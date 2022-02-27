"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceScore = exports.decodePose = exports.addVectors = exports.withinNmsRadiusOfCorrespondingPoint = exports.squaredDistance = exports.getImageCoords = exports.getOffsetPoint = exports.toTensorBuffers3D = void 0;
const constants_1 = require("../../constants");
const constants_2 = require("../constants");
function toTensorBuffers3D(tensors) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(tensors.map(tensor => tensor.buffer()));
    });
}
exports.toTensorBuffers3D = toTensorBuffers3D;
function getOffsetPoint(y, x, keypoint, offsets) {
    return {
        y: offsets.get(y, x, keypoint),
        x: offsets.get(y, x, keypoint + constants_2.NUM_KEYPOINTS)
    };
}
exports.getOffsetPoint = getOffsetPoint;
function getImageCoords(part, outputStride, offsets) {
    const { heatmapY, heatmapX, id: keypoint } = part;
    const { y, x } = getOffsetPoint(heatmapY, heatmapX, keypoint, offsets);
    return {
        x: part.heatmapX * outputStride + x,
        y: part.heatmapY * outputStride + y
    };
}
exports.getImageCoords = getImageCoords;
function squaredDistance(y1, x1, y2, x2) {
    const dy = y2 - y1;
    const dx = x2 - x1;
    return dy * dy + dx * dx;
}
exports.squaredDistance = squaredDistance;
function withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, { x, y }, keypointId) {
    return poses.some(({ keypoints }) => {
        return squaredDistance(y, x, keypoints[keypointId].y, keypoints[keypointId].x) <=
            squaredNmsRadius;
    });
}
exports.withinNmsRadiusOfCorrespondingPoint = withinNmsRadiusOfCorrespondingPoint;
const partIds = 
// tslint:disable-next-line: no-unnecessary-type-assertion
constants_1.COCO_KEYPOINTS.reduce((result, jointName, i) => {
    result[jointName] = i;
    return result;
}, {});
const parentChildrenTuples = constants_2.POSE_CHAIN.map(([parentJoinName, childJoinName]) => ([partIds[parentJoinName], partIds[childJoinName]]));
const parentToChildEdges = parentChildrenTuples.map(([, childJointId]) => childJointId);
const childToParentEdges = parentChildrenTuples.map(([parentJointId,]) => parentJointId);
function clamp(a, min, max) {
    if (a < min) {
        return min;
    }
    if (a > max) {
        return max;
    }
    return a;
}
function getStridedIndexNearPoint(point, outputStride, height, width) {
    return {
        y: clamp(Math.round(point.y / outputStride), 0, height - 1),
        x: clamp(Math.round(point.x / outputStride), 0, width - 1)
    };
}
function getDisplacement(edgeId, point, displacements) {
    const numEdges = displacements.shape[2] / 2;
    return {
        y: displacements.get(point.y, point.x, edgeId),
        x: displacements.get(point.y, point.x, numEdges + edgeId)
    };
}
function addVectors(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
exports.addVectors = addVectors;
/**
 * We get a new keypoint along the `edgeId` for the pose instance, assuming
 * that the position of the `idSource` part is already known. For this, we
 * follow the displacement vector from the source to target part (stored in
 * the `i`-t channel of the displacement tensor). The displaced keypoint
 * vector is refined using the offset vector by `offsetRefineStep` times.
 */
function traverseToTargetKeypoint(edgeId, sourceKeypoint, targetKeypointId, scoresBuffer, offsets, outputStride, displacements, offsetRefineStep = 2) {
    const [height, width] = scoresBuffer.shape;
    const point = { y: sourceKeypoint.y, x: sourceKeypoint.x };
    // Nearest neighbor interpolation for the source->target displacements.
    const sourceKeypointIndices = getStridedIndexNearPoint(point, outputStride, height, width);
    const displacement = getDisplacement(edgeId, sourceKeypointIndices, displacements);
    const displacedPoint = addVectors(point, displacement);
    let targetKeypoint = displacedPoint;
    for (let i = 0; i < offsetRefineStep; i++) {
        const targetKeypointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
        const offsetPoint = getOffsetPoint(targetKeypointIndices.y, targetKeypointIndices.x, targetKeypointId, offsets);
        targetKeypoint = addVectors({
            x: targetKeypointIndices.x * outputStride,
            y: targetKeypointIndices.y * outputStride
        }, { x: offsetPoint.x, y: offsetPoint.y });
    }
    const targetKeyPointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
    const score = scoresBuffer.get(targetKeyPointIndices.y, targetKeyPointIndices.x, targetKeypointId);
    return {
        y: targetKeypoint.y,
        x: targetKeypoint.x,
        name: constants_1.COCO_KEYPOINTS[targetKeypointId],
        score
    };
}
/**
 * Follows the displacement fields to decode the full pose of the object
 * instance given the position of a part that acts as root.
 *
 * @return An array of decoded keypoints and their scores for a single pose
 */
function decodePose(root, scores, offsets, outputStride, displacementsFwd, displacementsBwd) {
    const numParts = scores.shape[2];
    const numEdges = parentToChildEdges.length;
    const instanceKeypoints = new Array(numParts);
    // Start a new detection instance at the position of the root.
    const { part: rootPart, score: rootScore } = root;
    const rootPoint = getImageCoords(rootPart, outputStride, offsets);
    instanceKeypoints[rootPart.id] = {
        score: rootScore,
        name: constants_1.COCO_KEYPOINTS[rootPart.id],
        y: rootPoint.y,
        x: rootPoint.x
    };
    // Decode the part positions upwards in the tree, following the backward
    // displacements.
    for (let edge = numEdges - 1; edge >= 0; --edge) {
        const sourceKeypointId = parentToChildEdges[edge];
        const targetKeypointId = childToParentEdges[edge];
        if (instanceKeypoints[sourceKeypointId] &&
            !instanceKeypoints[targetKeypointId]) {
            instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsBwd);
        }
    }
    // Decode the part positions downwards in the tree, following the forward
    // displacements.
    for (let edge = 0; edge < numEdges; ++edge) {
        const sourceKeypointId = childToParentEdges[edge];
        const targetKeypointId = parentToChildEdges[edge];
        if (instanceKeypoints[sourceKeypointId] &&
            !instanceKeypoints[targetKeypointId]) {
            instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsFwd);
        }
    }
    return instanceKeypoints;
}
exports.decodePose = decodePose;
/* Score the newly proposed object instance without taking into account
 * the scores of the parts that overlap with any previously detected
 * instance.
 */
function getInstanceScore(existingPoses, squaredNmsRadius, instanceKeypoints) {
    let notOverlappedKeypointScores = instanceKeypoints.reduce((result, { y, x, score }, keypointId) => {
        if (!withinNmsRadiusOfCorrespondingPoint(existingPoses, squaredNmsRadius, { y, x }, keypointId)) {
            result += score;
        }
        return result;
    }, 0.0);
    return notOverlappedKeypointScores /= instanceKeypoints.length;
}
exports.getInstanceScore = getInstanceScore;
