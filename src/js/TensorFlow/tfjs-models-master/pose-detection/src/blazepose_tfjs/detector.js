"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
exports.load = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const constants_1 = require("../constants");
const calculate_alignment_points_rects_1 = require("../shared/calculators/calculate_alignment_points_rects");
const calculate_inverse_matrix_1 = require("../shared/calculators/calculate_inverse_matrix");
const calculate_landmark_projection_1 = require("../shared/calculators/calculate_landmark_projection");
const calculate_score_copy_1 = require("../shared/calculators/calculate_score_copy");
const calculate_world_landmark_projection_1 = require("../shared/calculators/calculate_world_landmark_projection");
const constants_2 = require("../shared/calculators/constants");
const convert_image_to_tensor_1 = require("../shared/calculators/convert_image_to_tensor");
const create_ssd_anchors_1 = require("../shared/calculators/create_ssd_anchors");
const detector_inference_1 = require("../shared/calculators/detector_inference");
const image_utils_1 = require("../shared/calculators/image_utils");
const is_video_1 = require("../shared/calculators/is_video");
const landmarks_to_detection_1 = require("../shared/calculators/landmarks_to_detection");
const mask_util_1 = require("../shared/calculators/mask_util");
const non_max_suppression_1 = require("../shared/calculators/non_max_suppression");
const normalized_keypoints_to_keypoints_1 = require("../shared/calculators/normalized_keypoints_to_keypoints");
const refine_landmarks_from_heatmap_1 = require("../shared/calculators/refine_landmarks_from_heatmap");
const remove_detection_letterbox_1 = require("../shared/calculators/remove_detection_letterbox");
const remove_landmark_letterbox_1 = require("../shared/calculators/remove_landmark_letterbox");
const segmentation_smoothing_1 = require("../shared/calculators/segmentation_smoothing");
const tensors_to_detections_1 = require("../shared/calculators/tensors_to_detections");
const tensors_to_landmarks_1 = require("../shared/calculators/tensors_to_landmarks");
const tensors_to_segmentation_1 = require("../shared/calculators/tensors_to_segmentation");
const transform_rect_1 = require("../shared/calculators/transform_rect");
const keypoints_smoothing_1 = require("../shared/filters/keypoints_smoothing");
const visibility_smoothing_1 = require("../shared/filters/visibility_smoothing");
const constants = __importStar(require("./constants"));
const detector_utils_1 = require("./detector_utils");
class BlazePoseTfjsMask {
    constructor(mask) {
        this.mask = mask;
    }
    toCanvasImageSource() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toHTMLCanvasElementLossy)(this.mask);
        });
    }
    toImageData() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toImageDataLossy)(this.mask);
        });
    }
    toTensor() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mask;
        });
    }
    getUnderlyingType() {
        return 'tensor';
    }
}
function maskValueToLabel(maskValue) {
    (0, mask_util_1.assertMaskValue)(maskValue);
    return 'person';
}
/**
 * BlazePose detector class.
 */
class BlazePoseTfjsDetector {
    constructor(detectorModel, landmarkModel, enableSmoothing, enableSegmentation, smoothSegmentation, modelType) {
        this.detectorModel = detectorModel;
        this.landmarkModel = landmarkModel;
        this.enableSmoothing = enableSmoothing;
        this.enableSegmentation = enableSegmentation;
        this.smoothSegmentation = smoothSegmentation;
        this.modelType = modelType;
        // Store global states.
        this.regionOfInterest = null;
        this.prevFilteredSegmentationMask = null;
        this.anchors =
            (0, create_ssd_anchors_1.createSsdAnchors)(constants.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);
        const anchorW = tf.tensor1d(this.anchors.map(a => a.width));
        const anchorH = tf.tensor1d(this.anchors.map(a => a.height));
        const anchorX = tf.tensor1d(this.anchors.map(a => a.xCenter));
        const anchorY = tf.tensor1d(this.anchors.map(a => a.yCenter));
        this.anchorTensor = { x: anchorX, y: anchorY, w: anchorW, h: anchorH };
        this.prevFilteredSegmentationMask =
            this.enableSegmentation ? tf.tensor2d([], [0, 0]) : null;
    }
    /**
     * Estimates poses for an image or video frame.
     *
     * It returns a single pose or multiple poses based on the maxPose parameter
     * from the `config`.
     *
     * @param image
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param estimationConfig Optional. See `BlazePoseTfjsEstimationConfig`
     *       documentation for detail.
     *
     * @param timestamp Optional. In milliseconds. This is useful when image is
     *     a tensor, which doesn't have timestamp info. Or to override timestamp
     *     in a video.
     *
     * @return An array of `Pose`s.
     */
    // TF.js implementation of the mediapipe pose detection pipeline.
    // ref graph:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmark_cpu.pbtxt
    estimatePoses(image, estimationConfig, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = (0, detector_utils_1.validateEstimationConfig)(estimationConfig);
            if (image == null) {
                this.reset();
                return [];
            }
            this.maxPoses = config.maxPoses;
            // User provided timestamp will override video's timestamp.
            if (timestamp != null) {
                this.timestamp = timestamp * constants_2.MILLISECOND_TO_MICRO_SECONDS;
            }
            else {
                // For static images, timestamp should be null.
                this.timestamp =
                    (0, is_video_1.isVideo)(image) ? image.currentTime * constants_2.SECOND_TO_MICRO_SECONDS : null;
            }
            const imageSize = (0, image_utils_1.getImageSize)(image);
            const image3d = tf.tidy(() => tf.cast((0, image_utils_1.toImageTensor)(image), 'float32'));
            let poseRect = this.regionOfInterest;
            if (poseRect == null) {
                // Need to run detector again.
                const detections = yield this.detectPose(image3d);
                if (detections.length === 0) {
                    this.reset();
                    image3d.dispose();
                    return [];
                }
                // Gets the very first detection from PoseDetection.
                const firstDetection = detections[0];
                // Calculates region of interest based on pose detection, so that can be
                // used to detect landmarks.
                poseRect = this.poseDetectionToRoi(firstDetection, imageSize);
            }
            // Detects pose landmarks within specified region of interest of the image.
            const poseLandmarksByRoiResult = yield this.poseLandmarksByRoi(poseRect, image3d);
            image3d.dispose();
            if (poseLandmarksByRoiResult == null) {
                this.reset();
                return [];
            }
            const { landmarks: unfilteredPoseLandmarks, auxiliaryLandmarks: unfilteredAuxiliaryLandmarks, poseScore, worldLandmarks: unfilteredWorldLandmarks, segmentationMask: unfilteredSegmentationMask, } = poseLandmarksByRoiResult;
            // Smoothes landmarks to reduce jitter.
            const { actualLandmarksFiltered: poseLandmarks, auxiliaryLandmarksFiltered: auxiliaryLandmarks, actualWorldLandmarksFiltered: poseWorldLandmarks } = this.poseLandmarkFiltering(unfilteredPoseLandmarks, unfilteredAuxiliaryLandmarks, unfilteredWorldLandmarks, imageSize);
            // Calculates region of interest based on the auxiliary landmarks, to be
            // used in the subsequent image.
            const poseRectFromLandmarks = this.poseLandmarksToRoi(auxiliaryLandmarks, imageSize);
            // Cache roi for next image.
            this.regionOfInterest = poseRectFromLandmarks;
            // Smoothes segmentation to reduce jitter
            const filteredSegmentationMask = this.smoothSegmentation && unfilteredSegmentationMask != null ?
                this.poseSegmentationFiltering(unfilteredSegmentationMask) :
                unfilteredSegmentationMask;
            // Scale back keypoints.
            const keypoints = poseLandmarks != null ?
                (0, normalized_keypoints_to_keypoints_1.normalizedKeypointsToKeypoints)(poseLandmarks, imageSize) :
                null;
            // Add keypoint name.
            if (keypoints != null) {
                keypoints.forEach((keypoint, i) => {
                    keypoint.name = constants_1.BLAZEPOSE_KEYPOINTS[i];
                });
            }
            const keypoints3D = poseWorldLandmarks;
            // Add keypoint name.
            if (keypoints3D != null) {
                keypoints3D.forEach((keypoint3D, i) => {
                    keypoint3D.name = constants_1.BLAZEPOSE_KEYPOINTS[i];
                });
            }
            const pose = { score: poseScore, keypoints, keypoints3D };
            if (filteredSegmentationMask !== null) {
                // Grayscale to RGBA
                const rgbaMask = tf.tidy(() => {
                    const mask3D = 
                    // tslint:disable-next-line: no-unnecessary-type-assertion
                    tf.expandDims(filteredSegmentationMask, 2);
                    // Pads a pixel [r] to [r, 0].
                    const rgMask = tf.pad(mask3D, [[0, 0], [0, 0], [0, 1]]);
                    // Pads a pixel [r, 0] to [r, 0, 0, r].
                    return tf.mirrorPad(rgMask, [[0, 0], [0, 0], [0, 2]], 'symmetric');
                });
                if (!this.smoothSegmentation) {
                    tf.dispose(filteredSegmentationMask);
                }
                const segmentation = {
                    maskValueToLabel,
                    mask: new BlazePoseTfjsMask(rgbaMask)
                };
                pose.segmentation = segmentation;
            }
            return [pose];
        });
    }
    poseSegmentationFiltering(segmentationMask) {
        const prevMask = this.prevFilteredSegmentationMask;
        if (prevMask.size === 0) {
            this.prevFilteredSegmentationMask = segmentationMask;
        }
        else {
            this.prevFilteredSegmentationMask = (0, segmentation_smoothing_1.smoothSegmentation)(prevMask, segmentationMask, constants.BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG);
            tf.dispose(segmentationMask);
        }
        tf.dispose(prevMask);
        return this.prevFilteredSegmentationMask;
    }
    dispose() {
        this.detectorModel.dispose();
        this.landmarkModel.dispose();
        tf.dispose([
            this.anchorTensor.x, this.anchorTensor.y, this.anchorTensor.w,
            this.anchorTensor.h, this.prevFilteredSegmentationMask
        ]);
    }
    reset() {
        this.regionOfInterest = null;
        if (this.enableSegmentation) {
            tf.dispose(this.prevFilteredSegmentationMask);
            this.prevFilteredSegmentationMask = tf.tensor2d([], [0, 0]);
        }
        this.visibilitySmoothingFilterActual = null;
        this.visibilitySmoothingFilterAuxiliary = null;
        this.landmarksSmoothingFilterActual = null;
        this.landmarksSmoothingFilterAuxiliary = null;
    }
    // Detects poses.
    // Subgraph: PoseDetectionCpu.
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_detection/pose_detection_cpu.pbtxt
    detectPose(image) {
        return __awaiter(this, void 0, void 0, function* () {
            // PoseDetectionCpu: ImageToTensorCalculator
            // Transforms the input image into a 224x224 while keeping the aspect ratio
            // resulting in potential letterboxing in the transformed image.
            const { imageTensor: imageValueShifted, padding } = (0, convert_image_to_tensor_1.convertImageToTensor)(image, constants.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG);
            // PoseDetectionCpu: InferenceCalculator
            // The model returns a tensor with the following shape:
            // [1 (batch), 896 (anchor points), 13 (data for each anchor)]
            const { boxes, logits } = (0, detector_inference_1.detectorInference)(imageValueShifted, this.detectorModel);
            // PoseDetectionCpu: TensorsToDetectionsCalculator
            const detections = yield (0, tensors_to_detections_1.tensorsToDetections)([logits, boxes], this.anchorTensor, constants.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION);
            if (detections.length === 0) {
                tf.dispose([imageValueShifted, logits, boxes]);
                return detections;
            }
            // PoseDetectionCpu: NonMaxSuppressionCalculator
            const selectedDetections = yield (0, non_max_suppression_1.nonMaxSuppression)(detections, this.maxPoses, constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                .minSuppressionThreshold, constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                .overlapType);
            // PoseDetectionCpu: DetectionLetterboxRemovalCalculator
            const newDetections = (0, remove_detection_letterbox_1.removeDetectionLetterbox)(selectedDetections, padding);
            tf.dispose([imageValueShifted, logits, boxes]);
            return newDetections;
        });
    }
    // Calculates region of interest from a detection.
    // Subgraph: PoseDetectionToRoi.
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_detection_to_roi.pbtxt
    // If detection is not null, imageSize should not be null either.
    poseDetectionToRoi(detection, imageSize) {
        let startKeypointIndex;
        let endKeypointIndex;
        // Converts pose detection into a rectangle based on center and scale
        // alignment points.
        startKeypointIndex = 0;
        endKeypointIndex = 1;
        // PoseDetectionToRoi: AlignmentPointsRectsCalculator.
        const rawRoi = (0, calculate_alignment_points_rects_1.calculateAlignmentPointsRects)(detection, imageSize, {
            rotationVectorEndKeypointIndex: endKeypointIndex,
            rotationVectorStartKeypointIndex: startKeypointIndex,
            rotationVectorTargetAngleDegree: 90
        });
        // Expands pose rect with marging used during training.
        // PoseDetectionToRoi: RectTransformationCalculation.
        const roi = (0, transform_rect_1.transformNormalizedRect)(rawRoi, imageSize, constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG);
        return roi;
    }
    // Predict pose landmarks  and optionally segmentation within an ROI
    // subgraph: PoseLandmarksByRoiCpu
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmark_by_roi_cpu.pbtxt
    // When poseRect is not null, image should not be null either.
    poseLandmarksByRoi(roi, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageSize = (0, image_utils_1.getImageSize)(image);
            // Transforms the input image into a 256x256 tensor while keeping the aspect
            // ratio, resulting in potential letterboxing in the transformed image.
            const { imageTensor: imageValueShifted, padding: letterboxPadding, transformationMatrix } = (0, convert_image_to_tensor_1.convertImageToTensor)(image, constants.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG, roi);
            if (this.modelType !== 'lite' && this.modelType !== 'full' &&
                this.modelType !== 'heavy') {
                throw new Error('Model type must be one of lite, full or heavy,' +
                    `but got ${this.modelType}`);
            }
            // PoseLandmarksByRoiCPU: InferenceCalculator
            // The model returns 5 tensors with the following shape:
            // ld_3d: This tensor (shape: [1, 195]) represents 39 5-d keypoints.
            // output_poseflag: This tensor (shape: [1, 1]) represents the confidence
            //  score.
            // activation_segmentation: This tensor (shape: [256, 256]) represents the
            // mask of the input image.
            // activation_heatmap: This tensor (shape: [1, 64, 64, 39]) represents
            //  heatmap for the 39 landmarks.
            // world_3d: This tensor (shape: [1, 117]) represents 39 3DWorld keypoints.
            const outputTensor = this.landmarkModel.execute(imageValueShifted, [
                'ld_3d', 'output_poseflag', 'activation_segmentation',
                'activation_heatmap', 'world_3d'
            ]);
            // Decodes the tensors into the corresponding landmark and segmentation mask
            // representation.
            // PoseLandmarksByRoiCPU: TensorsToPoseLandmarksAndSegmentation
            const tensorsToPoseLandmarksAndSegmentationResult = yield this.tensorsToPoseLandmarksAndSegmentation(outputTensor);
            if (tensorsToPoseLandmarksAndSegmentationResult == null) {
                tf.dispose(outputTensor);
                tf.dispose(imageValueShifted);
                return null;
            }
            const { landmarks: roiLandmarks, auxiliaryLandmarks: roiAuxiliaryLandmarks, poseScore, worldLandmarks: roiWorldLandmarks, segmentationMask: roiSegmentationMask } = tensorsToPoseLandmarksAndSegmentationResult;
            const poseLandmarksAndSegmentationInverseProjectionResults = yield this.poseLandmarksAndSegmentationInverseProjection(imageSize, roi, letterboxPadding, transformationMatrix, roiLandmarks, roiAuxiliaryLandmarks, roiWorldLandmarks, roiSegmentationMask);
            tf.dispose(outputTensor);
            tf.dispose(imageValueShifted);
            return Object.assign({ poseScore }, poseLandmarksAndSegmentationInverseProjectionResults);
        });
    }
    poseLandmarksAndSegmentationInverseProjection(imageSize, roi, letterboxPadding, transformationMatrix, roiLandmarks, roiAuxiliaryLandmarks, roiWorldLandmarks, roiSegmentationMask) {
        return __awaiter(this, void 0, void 0, function* () {
            // -------------------------------------------------------------------------
            // ------------------------------ Landmarks --------------------------------
            // -------------------------------------------------------------------------
            // Adjusts landmarks (already normalized to [0.0, 1.0]) on the letterboxed
            // pose image to the corresponding coordinates with the letterbox removed.
            // PoseLandmarksAndSegmentationInverseProjection:
            // LandmarkLetterboxRemovalCalculator.
            const adjustedLandmarks = (0, remove_landmark_letterbox_1.removeLandmarkLetterbox)(roiLandmarks, letterboxPadding);
            // PoseLandmarksAndSegmentationInverseProjection:
            // LandmarkLetterboxRemovalCalculator.
            const adjustedAuxiliaryLandmarks = (0, remove_landmark_letterbox_1.removeLandmarkLetterbox)(roiAuxiliaryLandmarks, letterboxPadding);
            // PoseLandmarksAndSegmentationInverseProjection:
            // LandmarkProjectionCalculator.
            const landmarks = (0, calculate_landmark_projection_1.calculateLandmarkProjection)(adjustedLandmarks, roi);
            const auxiliaryLandmarks = (0, calculate_landmark_projection_1.calculateLandmarkProjection)(adjustedAuxiliaryLandmarks, roi);
            // -------------------------------------------------------------------------
            // --------------------------- World Landmarks -----------------------------
            // -------------------------------------------------------------------------
            // Projects the world landmarks from the letterboxed ROI to the full image.
            // PoseLandmarksAndSegmentationInverseProjection:
            // WorldLandmarkProjectionCalculator.
            const worldLandmarks = (0, calculate_world_landmark_projection_1.calculateWorldLandmarkProjection)(roiWorldLandmarks, roi);
            // -------------------------------------------------------------------------
            // -------------------------- Segmentation Mask ----------------------------
            // -------------------------------------------------------------------------
            let segmentationMask = null;
            if (this.enableSegmentation) {
                segmentationMask = tf.tidy(() => {
                    const [inputHeight, inputWidth] = roiSegmentationMask.shape;
                    // Calculates the inverse transformation matrix.
                    // PoseLandmarksAndSegmentationInverseProjection:
                    // InverseMatrixCalculator.
                    const inverseTransformationMatrix = (0, calculate_inverse_matrix_1.calculateInverseMatrix)(transformationMatrix);
                    const projectiveTransform = tf.tensor2d((0, image_utils_1.getProjectiveTransformMatrix)(inverseTransformationMatrix, { width: inputWidth, height: inputHeight }, imageSize), [1, 8]);
                    // Projects the segmentation mask from the letterboxed ROI back to the
                    // full image.
                    // PoseLandmarksAndSegmentationInverseProjection: WarpAffineCalculator.
                    const shape4D = [1, inputHeight, inputWidth, 1];
                    return tf.squeeze(tf.image.transform(tf.reshape(roiSegmentationMask, shape4D), projectiveTransform, 'bilinear', 'constant', 0, [imageSize.height, imageSize.width]), [0, 3]);
                });
                tf.dispose(roiSegmentationMask);
            }
            return { landmarks, auxiliaryLandmarks, worldLandmarks, segmentationMask };
        });
    }
    tensorsToPoseLandmarksAndSegmentation(tensors) {
        return __awaiter(this, void 0, void 0, function* () {
            // TensorsToPoseLandmarksAndSegmentation: SplitTensorVectorCalculator.
            const landmarkTensor = tensors[0], poseFlagTensor = tensors[1], segmentationTensor = tensors[2], heatmapTensor = tensors[3], worldLandmarkTensor = tensors[4];
            // Converts the pose-flag tensor into a float that represents the
            // confidence score of pose presence.
            const poseScore = (yield poseFlagTensor.data())[0];
            // Applies a threshold to the confidence score to determine whether a pose
            // is present.
            if (poseScore < constants.BLAZEPOSE_POSE_PRESENCE_SCORE) {
                return null;
            }
            // -------------------------------------------------------------------------
            // ---------------------------- Pose landmarks -----------------------------
            // -------------------------------------------------------------------------
            // Decodes the landmark tensors into a list of landmarks, where the
            // landmark coordinates are normalized by the size of the input image to
            // the model.
            // TensorsToPoseLandmarksAndSegmentation: TensorsToLandmarksCalculator.
            const rawLandmarks = yield (0, tensors_to_landmarks_1.tensorsToLandmarks)(landmarkTensor, constants.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG);
            // Refine landmarks with heatmap tensor.
            // TensorsToPoseLandmarksAndSegmentation:
            // RefineLandmarksFromHeatmapCalculator
            const allLandmarks = yield (0, refine_landmarks_from_heatmap_1.refineLandmarksFromHeatmap)(rawLandmarks, heatmapTensor, constants.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG);
            // Splits the landmarks into two sets: the actual pose landmarks and the
            // auxiliary landmarks.
            // TensorsToPoseLandmarksAndSegmentation:
            // SplitNormalizedLandmarkListCalculator
            const landmarks = allLandmarks.slice(0, constants.BLAZEPOSE_NUM_KEYPOINTS);
            const auxiliaryLandmarks = allLandmarks.slice(constants.BLAZEPOSE_NUM_KEYPOINTS, constants.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS);
            // -------------------------------------------------------------------------
            // ------------------------- Pose world landmarks --------------------------
            // -------------------------------------------------------------------------
            // Decodes the world landmark tensors into a list of landmarks.
            // TensorsToPoseLandmarksAndSegmentation: TensorsToLandmarksCalculator.
            const allWorldLandmarks = yield (0, tensors_to_landmarks_1.tensorsToLandmarks)(worldLandmarkTensor, constants.BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG);
            // Take only actual world landmarks.
            const worldLandmarksWithoutVisibility = allWorldLandmarks.slice(0, constants.BLAZEPOSE_NUM_KEYPOINTS);
            const worldLandmarks = (0, calculate_score_copy_1.calculateScoreCopy)(landmarks, worldLandmarksWithoutVisibility, true);
            // -------------------------------------------------------------------------
            // -------------------------- Segmentation Mask ----------------------------
            // -------------------------------------------------------------------------
            const segmentationMask = this.enableSegmentation ?
                (0, tensors_to_segmentation_1.tensorsToSegmentation)(segmentationTensor, constants.BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG) :
                null;
            return {
                landmarks,
                auxiliaryLandmarks,
                poseScore,
                worldLandmarks,
                segmentationMask
            };
        });
    }
    // Calculate region of interest (ROI) from landmarks.
    // Subgraph: PoseLandmarksToRoiCpu
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmarks_to_roi.pbtxt
    // When landmarks is not null, imageSize should not be null either.
    poseLandmarksToRoi(landmarks, imageSize) {
        // PoseLandmarksToRoi: LandmarksToDetectionCalculator.
        const detection = (0, landmarks_to_detection_1.landmarksToDetection)(landmarks);
        // Converts detection into a rectangle based on center and scale alignment
        // points.
        // PoseLandmarksToRoi: AlignmentPointsRectsCalculator.
        const rawRoi = (0, calculate_alignment_points_rects_1.calculateAlignmentPointsRects)(detection, imageSize, {
            rotationVectorStartKeypointIndex: 0,
            rotationVectorEndKeypointIndex: 1,
            rotationVectorTargetAngleDegree: 90
        });
        // Expands pose rect with marging used during training.
        // PoseLandmarksToRoi: RectTransformationCalculator.
        const roi = (0, transform_rect_1.transformNormalizedRect)(rawRoi, imageSize, constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG);
        return roi;
    }
    // Filter landmarks temporally to reduce jitter.
    // Subgraph: PoseLandmarkFiltering
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmark_filtering.pbtxt
    poseLandmarkFiltering(actualLandmarks, auxiliaryLandmarks, actualWorldLandmarks, imageSize) {
        let actualLandmarksFiltered;
        let auxiliaryLandmarksFiltered;
        let actualWorldLandmarksFiltered;
        if (this.timestamp == null || !this.enableSmoothing) {
            actualLandmarksFiltered = actualLandmarks;
            auxiliaryLandmarksFiltered = auxiliaryLandmarks;
            actualWorldLandmarksFiltered = actualWorldLandmarks;
        }
        else {
            const auxDetection = (0, landmarks_to_detection_1.landmarksToDetection)(auxiliaryLandmarks);
            const objectScaleROI = (0, calculate_alignment_points_rects_1.calculateAlignmentPointsRects)(auxDetection, imageSize, {
                rotationVectorEndKeypointIndex: 0,
                rotationVectorStartKeypointIndex: 1,
                rotationVectorTargetAngleDegree: 90
            });
            // Smoothes pose landmark visibilities to reduce jitter.
            if (this.visibilitySmoothingFilterActual == null) {
                this.visibilitySmoothingFilterActual = new visibility_smoothing_1.LowPassVisibilityFilter(constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG);
            }
            actualLandmarksFiltered =
                this.visibilitySmoothingFilterActual.apply(actualLandmarks);
            if (this.visibilitySmoothingFilterAuxiliary == null) {
                this.visibilitySmoothingFilterAuxiliary = new visibility_smoothing_1.LowPassVisibilityFilter(constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG);
            }
            auxiliaryLandmarksFiltered =
                this.visibilitySmoothingFilterAuxiliary.apply(auxiliaryLandmarks);
            actualWorldLandmarksFiltered =
                this.visibilitySmoothingFilterActual.apply(actualWorldLandmarks);
            // Smoothes pose landmark coordinates to reduce jitter.
            if (this.landmarksSmoothingFilterActual == null) {
                this.landmarksSmoothingFilterActual = new keypoints_smoothing_1.KeypointsSmoothingFilter(constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL);
            }
            actualLandmarksFiltered = this.landmarksSmoothingFilterActual.apply(actualLandmarksFiltered, this.timestamp, imageSize, true /* normalized */, objectScaleROI);
            if (this.landmarksSmoothingFilterAuxiliary == null) {
                this.landmarksSmoothingFilterAuxiliary = new keypoints_smoothing_1.KeypointsSmoothingFilter(constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY);
            }
            auxiliaryLandmarksFiltered = this.landmarksSmoothingFilterAuxiliary.apply(auxiliaryLandmarksFiltered, this.timestamp, imageSize, true /* normalized */, objectScaleROI);
            // Smoothes pose world landmark coordinates to reduce jitter.
            if (this.worldLandmarksSmoothingFilterActual == null) {
                this.worldLandmarksSmoothingFilterActual = new keypoints_smoothing_1.KeypointsSmoothingFilter(constants.BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL);
            }
            actualWorldLandmarksFiltered =
                this.worldLandmarksSmoothingFilterActual.apply(actualWorldLandmarks, this.timestamp);
        }
        return {
            actualLandmarksFiltered,
            auxiliaryLandmarksFiltered,
            actualWorldLandmarksFiltered
        };
    }
}
/**
 * Loads the BlazePose model.
 *
 * @param modelConfig ModelConfig object that contains parameters for
 * the BlazePose loading process. Please find more details of each parameters
 * in the documentation of the `BlazePoseTfjsModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, detector_utils_1.validateModelConfig)(modelConfig);
        const detectorFromTFHub = typeof config.detectorModelUrl === 'string' &&
            (config.detectorModelUrl.indexOf('https://tfhub.dev') > -1);
        const landmarkFromTFHub = typeof config.landmarkModelUrl === 'string' &&
            (config.landmarkModelUrl.indexOf('https://tfhub.dev') > -1);
        const [detectorModel, landmarkModel] = yield Promise.all([
            tfconv.loadGraphModel(config.detectorModelUrl, { fromTFHub: detectorFromTFHub }),
            tfconv.loadGraphModel(config.landmarkModelUrl, { fromTFHub: landmarkFromTFHub })
        ]);
        return new BlazePoseTfjsDetector(detectorModel, landmarkModel, config.enableSmoothing, config.enableSegmentation, config.smoothSegmentation, config.modelType);
    });
}
exports.load = load;
