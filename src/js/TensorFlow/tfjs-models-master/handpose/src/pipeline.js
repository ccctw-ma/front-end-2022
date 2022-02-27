"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.HandPipeline = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const box_1 = require("./box");
const util_1 = require("./util");
const UPDATE_REGION_OF_INTEREST_IOU_THRESHOLD = 0.8;
const PALM_BOX_SHIFT_VECTOR = [0, -0.4];
const PALM_BOX_ENLARGE_FACTOR = 3;
const HAND_BOX_SHIFT_VECTOR = [0, -0.1];
const HAND_BOX_ENLARGE_FACTOR = 1.65;
const PALM_LANDMARK_IDS = [0, 5, 9, 13, 17, 1, 2];
const PALM_LANDMARKS_INDEX_OF_PALM_BASE = 0;
const PALM_LANDMARKS_INDEX_OF_MIDDLE_FINGER_BASE = 2;
// The Pipeline coordinates between the bounding box and skeleton models.
class HandPipeline {
    constructor(boundingBoxDetector
    /* MediaPipe model for detecting hand bounding box */ , meshDetector
    /* MediaPipe model for detecting hand mesh */ , meshWidth, meshHeight, maxContinuousChecks, detectionConfidence) {
        this.boundingBoxDetector = boundingBoxDetector;
        this.meshDetector = meshDetector;
        this.meshWidth = meshWidth;
        this.meshHeight = meshHeight;
        this.maxContinuousChecks = maxContinuousChecks;
        this.detectionConfidence = detectionConfidence;
        // An array of hand bounding boxes.
        this.regionsOfInterest = [];
        this.runsWithoutHandDetector = 0;
        this.maxHandsNumber = 1; // TODO(annxingyuan): Add multi-hand support.
    }
    // Get the bounding box surrounding the hand, given palm landmarks.
    getBoxForPalmLandmarks(palmLandmarks, rotationMatrix) {
        const rotatedPalmLandmarks = palmLandmarks.map((coord) => {
            const homogeneousCoordinate = [...coord, 1];
            return (0, util_1.rotatePoint)(homogeneousCoordinate, rotationMatrix);
        });
        const boxAroundPalm = this.calculateLandmarksBoundingBox(rotatedPalmLandmarks);
        // boxAroundPalm only surrounds the palm - therefore we shift it
        // upwards so it will capture fingers once enlarged + squarified.
        return (0, box_1.enlargeBox)((0, box_1.squarifyBox)((0, box_1.shiftBox)(boxAroundPalm, PALM_BOX_SHIFT_VECTOR)), PALM_BOX_ENLARGE_FACTOR);
    }
    // Get the bounding box surrounding the hand, given all hand landmarks.
    getBoxForHandLandmarks(landmarks) {
        // The MediaPipe hand mesh model is trained on hands with empty space
        // around them, so we still need to shift / enlarge boxAroundHand even
        // though it surrounds the entire hand.
        const boundingBox = this.calculateLandmarksBoundingBox(landmarks);
        const boxAroundHand = (0, box_1.enlargeBox)((0, box_1.squarifyBox)((0, box_1.shiftBox)(boundingBox, HAND_BOX_SHIFT_VECTOR)), HAND_BOX_ENLARGE_FACTOR);
        const palmLandmarks = [];
        for (let i = 0; i < PALM_LANDMARK_IDS.length; i++) {
            palmLandmarks.push(landmarks[PALM_LANDMARK_IDS[i]].slice(0, 2));
        }
        boxAroundHand.palmLandmarks = palmLandmarks;
        return boxAroundHand;
    }
    // Scale, rotate, and translate raw keypoints from the model so they map to
    // the input coordinates.
    transformRawCoords(rawCoords, box, angle, rotationMatrix) {
        const boxSize = (0, box_1.getBoxSize)(box);
        const scaleFactor = [boxSize[0] / this.meshWidth, boxSize[1] / this.meshHeight];
        const coordsScaled = rawCoords.map((coord) => {
            return [
                scaleFactor[0] * (coord[0] - this.meshWidth / 2),
                scaleFactor[1] * (coord[1] - this.meshHeight / 2), coord[2]
            ];
        });
        const coordsRotationMatrix = (0, util_1.buildRotationMatrix)(angle, [0, 0]);
        const coordsRotated = coordsScaled.map((coord) => {
            const rotated = (0, util_1.rotatePoint)(coord, coordsRotationMatrix);
            return [...rotated, coord[2]];
        });
        const inverseRotationMatrix = (0, util_1.invertTransformMatrix)(rotationMatrix);
        const boxCenter = [...(0, box_1.getBoxCenter)(box), 1];
        const originalBoxCenter = [
            (0, util_1.dot)(boxCenter, inverseRotationMatrix[0]),
            (0, util_1.dot)(boxCenter, inverseRotationMatrix[1])
        ];
        return coordsRotated.map((coord) => {
            return [
                coord[0] + originalBoxCenter[0], coord[1] + originalBoxCenter[1],
                coord[2]
            ];
        });
    }
    estimateHand(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const useFreshBox = this.shouldUpdateRegionsOfInterest();
            if (useFreshBox === true) {
                const boundingBoxPrediction = yield this.boundingBoxDetector.estimateHandBounds(image);
                if (boundingBoxPrediction === null) {
                    image.dispose();
                    this.regionsOfInterest = [];
                    return null;
                }
                this.updateRegionsOfInterest(boundingBoxPrediction, true /*force update*/);
                this.runsWithoutHandDetector = 0;
            }
            else {
                this.runsWithoutHandDetector++;
            }
            // Rotate input so the hand is vertically oriented.
            const currentBox = this.regionsOfInterest[0];
            const angle = (0, util_1.computeRotation)(currentBox.palmLandmarks[PALM_LANDMARKS_INDEX_OF_PALM_BASE], currentBox.palmLandmarks[PALM_LANDMARKS_INDEX_OF_MIDDLE_FINGER_BASE]);
            const palmCenter = (0, box_1.getBoxCenter)(currentBox);
            const palmCenterNormalized = [palmCenter[0] / image.shape[2], palmCenter[1] / image.shape[1]];
            const rotatedImage = tf.image.rotateWithOffset(image, angle, 0, palmCenterNormalized);
            const rotationMatrix = (0, util_1.buildRotationMatrix)(-angle, palmCenter);
            let box;
            // The bounding box detector only detects palms, so if we're using a fresh
            // bounding box prediction, we have to construct the hand bounding box from
            // the palm keypoints.
            if (useFreshBox === true) {
                box =
                    this.getBoxForPalmLandmarks(currentBox.palmLandmarks, rotationMatrix);
            }
            else {
                box = currentBox;
            }
            const croppedInput = (0, box_1.cutBoxFromImageAndResize)(box, rotatedImage, [this.meshWidth, this.meshHeight]);
            const handImage = tf.div(croppedInput, 255);
            croppedInput.dispose();
            rotatedImage.dispose();
            let prediction;
            if (tf.getBackend() === 'webgl') {
                // Currently tfjs-core does not pack depthwiseConv because it fails for
                // very large inputs (https://github.com/tensorflow/tfjs/issues/1652).
                // TODO(annxingyuan): call tf.enablePackedDepthwiseConv when available
                // (https://github.com/tensorflow/tfjs/issues/2821)
                const savedWebglPackDepthwiseConvFlag = tf.env().get('WEBGL_PACK_DEPTHWISECONV');
                tf.env().set('WEBGL_PACK_DEPTHWISECONV', true);
                prediction =
                    this.meshDetector.predict(handImage);
                tf.env().set('WEBGL_PACK_DEPTHWISECONV', savedWebglPackDepthwiseConvFlag);
            }
            else {
                prediction =
                    this.meshDetector.predict(handImage);
            }
            const [flag, keypoints] = prediction;
            handImage.dispose();
            const flagValue = flag.dataSync()[0];
            flag.dispose();
            if (flagValue < this.detectionConfidence) {
                keypoints.dispose();
                this.regionsOfInterest = [];
                return null;
            }
            const keypointsReshaped = tf.reshape(keypoints, [-1, 3]);
            // Calling arraySync() because the tensor is very small so it's not worth
            // calling await array().
            const rawCoords = keypointsReshaped.arraySync();
            keypoints.dispose();
            keypointsReshaped.dispose();
            const coords = this.transformRawCoords(rawCoords, box, angle, rotationMatrix);
            const nextBoundingBox = this.getBoxForHandLandmarks(coords);
            this.updateRegionsOfInterest(nextBoundingBox, false /* force replace */);
            const result = {
                landmarks: coords,
                handInViewConfidence: flagValue,
                boundingBox: {
                    topLeft: nextBoundingBox.startPoint,
                    bottomRight: nextBoundingBox.endPoint
                }
            };
            return result;
        });
    }
    calculateLandmarksBoundingBox(landmarks) {
        const xs = landmarks.map(d => d[0]);
        const ys = landmarks.map(d => d[1]);
        const startPoint = [Math.min(...xs), Math.min(...ys)];
        const endPoint = [Math.max(...xs), Math.max(...ys)];
        return { startPoint, endPoint };
    }
    // Updates regions of interest if the intersection over union between
    // the incoming and previous regions falls below a threshold.
    updateRegionsOfInterest(box, forceUpdate) {
        if (forceUpdate) {
            this.regionsOfInterest = [box];
        }
        else {
            const previousBox = this.regionsOfInterest[0];
            let iou = 0;
            if (previousBox != null && previousBox.startPoint != null) {
                const [boxStartX, boxStartY] = box.startPoint;
                const [boxEndX, boxEndY] = box.endPoint;
                const [previousBoxStartX, previousBoxStartY] = previousBox.startPoint;
                const [previousBoxEndX, previousBoxEndY] = previousBox.endPoint;
                const xStartMax = Math.max(boxStartX, previousBoxStartX);
                const yStartMax = Math.max(boxStartY, previousBoxStartY);
                const xEndMin = Math.min(boxEndX, previousBoxEndX);
                const yEndMin = Math.min(boxEndY, previousBoxEndY);
                const intersection = (xEndMin - xStartMax) * (yEndMin - yStartMax);
                const boxArea = (boxEndX - boxStartX) * (boxEndY - boxStartY);
                const previousBoxArea = (previousBoxEndX - previousBoxStartX) *
                    (previousBoxEndY - boxStartY);
                iou = intersection / (boxArea + previousBoxArea - intersection);
            }
            this.regionsOfInterest[0] =
                iou > UPDATE_REGION_OF_INTEREST_IOU_THRESHOLD ? previousBox : box;
        }
    }
    shouldUpdateRegionsOfInterest() {
        const roisCount = this.regionsOfInterest.length;
        return roisCount !== this.maxHandsNumber ||
            this.runsWithoutHandDetector >= this.maxContinuousChecks;
    }
}
exports.HandPipeline = HandPipeline;
