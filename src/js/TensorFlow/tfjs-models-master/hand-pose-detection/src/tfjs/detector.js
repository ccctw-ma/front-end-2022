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
const association_norm_rect_1 = require("../shared/calculators/association_norm_rect");
const calculate_landmark_projection_1 = require("../shared/calculators/calculate_landmark_projection");
const calculate_world_landmark_projection_1 = require("../shared/calculators/calculate_world_landmark_projection");
const convert_image_to_tensor_1 = require("../shared/calculators/convert_image_to_tensor");
const create_ssd_anchors_1 = require("../shared/calculators/create_ssd_anchors");
const detection_to_rect_1 = require("../shared/calculators/detection_to_rect");
const detector_inference_1 = require("../shared/calculators/detector_inference");
const image_utils_1 = require("../shared/calculators/image_utils");
const non_max_suppression_1 = require("../shared/calculators/non_max_suppression");
const normalized_keypoints_to_keypoints_1 = require("../shared/calculators/normalized_keypoints_to_keypoints");
const remove_detection_letterbox_1 = require("../shared/calculators/remove_detection_letterbox");
const remove_landmark_letterbox_1 = require("../shared/calculators/remove_landmark_letterbox");
const tensors_to_detections_1 = require("../shared/calculators/tensors_to_detections");
const tensors_to_landmarks_1 = require("../shared/calculators/tensors_to_landmarks");
const transform_rect_1 = require("../shared/calculators/transform_rect");
const hand_landmarks_to_rect_1 = require("./calculators/hand_landmarks_to_rect");
const constants = __importStar(require("./constants"));
const detector_utils_1 = require("./detector_utils");
/**
 * MediaPipeHands detector class.
 */
class MediaPipeHandsTfjsDetector {
    constructor(detectorModel, landmarkModel, maxHands) {
        this.detectorModel = detectorModel;
        this.landmarkModel = landmarkModel;
        this.maxHands = maxHands;
        // Store global states.
        this.prevHandRectsFromLandmarks = null;
        this.anchors =
            (0, create_ssd_anchors_1.createSsdAnchors)(constants.MPHANDS_DETECTOR_ANCHOR_CONFIGURATION);
        const anchorW = tf.tensor1d(this.anchors.map(a => a.width));
        const anchorH = tf.tensor1d(this.anchors.map(a => a.height));
        const anchorX = tf.tensor1d(this.anchors.map(a => a.xCenter));
        const anchorY = tf.tensor1d(this.anchors.map(a => a.yCenter));
        this.anchorTensor = { x: anchorX, y: anchorY, w: anchorW, h: anchorH };
    }
    /**
     * Estimates hands for an image or video frame.
     *
     * It returns a single hand or multiple hands based on the maxHands
     * parameter from the `config`.
     *
     * @param image
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param estimationConfig Optional. See `MediaPipeHandsTfjsEstimationConfig`
     *       documentation for detail.
     *
     * @return An array of `Hand`s.
     */
    // TF.js implementation of the mediapipe hand detection pipeline.
    // ref graph:
    // https://github.com/google/mediapipe/blob/master/mediapipe/mediapipe/modules/hand_landmark/hand_landmark_tracking_cpu.pbtxt
    estimateHands(image, estimationConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = (0, detector_utils_1.validateEstimationConfig)(estimationConfig);
            if (image == null) {
                this.reset();
                return [];
            }
            // HandLandmarkTrackingCpu: ImagePropertiesCalculator
            // Extracts image size.
            const imageSize = (0, image_utils_1.getImageSize)(image);
            const image3d = tf.tidy(() => {
                let imageTensor = tf.cast((0, image_utils_1.toImageTensor)(image), 'float32');
                if (config.flipHorizontal) {
                    const batchAxis = 0;
                    imageTensor = tf.squeeze(tf.image.flipLeftRight(
                    // tslint:disable-next-line: no-unnecessary-type-assertion
                    tf.expandDims(imageTensor, batchAxis)), [batchAxis]);
                }
                return imageTensor;
            });
            const prevHandRectsFromLandmarks = this.prevHandRectsFromLandmarks;
            let handRects;
            // Drops the incoming image for detection if enough hands have already been
            // identified from the previous image. Otherwise, passes the incoming image
            // through to trigger a new round of palm detection.
            if (config.staticImageMode || prevHandRectsFromLandmarks == null ||
                prevHandRectsFromLandmarks.length < this.maxHands) {
                // HandLandmarkTrackingCpu: PalmDetectionCpu
                // Detects palms.
                const allPalmDetections = yield this.detectPalm(image3d);
                if (allPalmDetections.length === 0) {
                    this.reset();
                    image3d.dispose();
                    return [];
                }
                // HandLandmarkTrackingCpu: ClipDetectionVectorSizeCalculator
                // HandLandmarkTrackingCpu: Makes sure there are no more detections than
                // the provided maxHands. This is already done by our implementation of
                // nonMaxSuppresion.
                const palmDetections = allPalmDetections;
                // HandLandmarkTrackingCpu: PalmDetectionDetectionToRoi
                // Calculates region of interest (ROI) based on the specified palm.
                const handRectsFromPalmDetections = palmDetections.map(detection => this.palmDetectionToRoi(detection, imageSize));
                handRects = handRectsFromPalmDetections;
            }
            else {
                handRects = prevHandRectsFromLandmarks;
            }
            // HandLandmarkTrackingCpu: AssociationNormRectCalculator
            // This calculator ensures that the output handRects array
            // doesn't contain overlapping regions based on the specified
            // minSimilarityThreshold. Note that our implementation does not perform
            // association between rects from previous image and rects based
            // on palm detections from the current image due to not having tracking
            // IDs in our API, so we don't call it with two inputs like MediaPipe
            // (previous and new rects). The call is nonetheless still necessary
            // since rects from previous image could overlap.
            handRects = (0, association_norm_rect_1.calculateAssociationNormRect)([handRects], constants.MPHANDS_MIN_SIMILARITY_THRESHOLD);
            // HandLandmarkTrackingCpu: HandLandmarkCpu
            // Detect hand landmarks for the specific hand rect.
            const handResults = yield Promise.all(handRects.map(handRect => this.handLandmarks(handRect, image3d)));
            const hands = [];
            this.prevHandRectsFromLandmarks = [];
            for (const handResult of handResults) {
                if (handResult == null) {
                    continue;
                }
                const { landmarks, worldLandmarks, handScore: score, handedness } = handResult;
                // HandLandmarkTrackingCpu: HandLandmarkLandmarksToRoi
                // Calculate region of interest (ROI) based on detected hand landmarks to
                // reuse on the subsequent runs of the graph.
                this.prevHandRectsFromLandmarks.push(this.handLandmarksToRoi(landmarks, imageSize));
                // Scale back keypoints.
                const keypoints = (0, normalized_keypoints_to_keypoints_1.normalizedKeypointsToKeypoints)(landmarks, imageSize);
                // Add keypoint name.
                if (keypoints != null) {
                    keypoints.forEach((keypoint, i) => {
                        delete keypoint.z;
                        keypoint.name = constants_1.MEDIAPIPE_KEYPOINTS[i];
                    });
                }
                const keypoints3D = worldLandmarks;
                // Add keypoint name.
                if (keypoints3D != null) {
                    keypoints3D.forEach((keypoint3D, i) => {
                        keypoint3D.name = constants_1.MEDIAPIPE_KEYPOINTS[i];
                    });
                }
                hands.push({ keypoints, keypoints3D, handedness, score });
            }
            image3d.dispose();
            return hands;
        });
    }
    dispose() {
        this.detectorModel.dispose();
        this.landmarkModel.dispose();
        tf.dispose([
            this.anchorTensor.x, this.anchorTensor.y, this.anchorTensor.w,
            this.anchorTensor.h
        ]);
    }
    reset() {
        this.prevHandRectsFromLandmarks = null;
    }
    // Detects palms.
    // Subgraph: PalmDetectionCpu.
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/palm_detection/palm_detection_cpu.pbtxt
    detectPalm(image) {
        return __awaiter(this, void 0, void 0, function* () {
            // PalmDetectionCpu: ImageToTensorCalculator
            // Transforms the input image into a 128x128 while keeping the aspect ratio
            // resulting in potential letterboxing in the transformed image.
            const { imageTensor: imageValueShifted, padding } = (0, convert_image_to_tensor_1.convertImageToTensor)(image, constants.MPHANDS_DETECTOR_IMAGE_TO_TENSOR_CONFIG);
            // PalmDetectionCpu: InferenceCalculator
            // The model returns a tensor with the following shape:
            // [1 (batch), 896 (anchor points), 19 (data for each anchor)]
            const { boxes, logits } = (0, detector_inference_1.detectorInference)(imageValueShifted, this.detectorModel);
            // PalmDetectionCpu: TensorsToDetectionsCalculator
            const detections = yield (0, tensors_to_detections_1.tensorsToDetections)([logits, boxes], this.anchorTensor, constants.MPHANDS_TENSORS_TO_DETECTION_CONFIGURATION);
            if (detections.length === 0) {
                tf.dispose([imageValueShifted, logits, boxes]);
                return detections;
            }
            // PalmDetectionCpu: NonMaxSuppressionCalculator
            const selectedDetections = yield (0, non_max_suppression_1.nonMaxSuppression)(detections, this.maxHands, constants.MPHANDS_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                .minSuppressionThreshold, constants.MPHANDS_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                .overlapType);
            // PalmDetectionCpu: DetectionLetterboxRemovalCalculator
            const newDetections = (0, remove_detection_letterbox_1.removeDetectionLetterbox)(selectedDetections, padding);
            tf.dispose([imageValueShifted, logits, boxes]);
            return newDetections;
        });
    }
    // calculates hand ROI from palm detection.
    // Subgraph: PalmDetectionDetectionToRoi.
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/hand_landmark/palm_detection_detection_to_roi.pbtxt
    palmDetectionToRoi(detection, imageSize) {
        // Converts results of palm detection into a rectangle (normalized by image
        // size) that encloses the palm and is rotated such that the line connecting
        // center of the wrist and MCP of the middle finger is aligned with the
        // Y-axis of the rectangle.
        // PalmDetectionDetectionToRoi: DetectionsToRectsCalculator.
        const rawRoi = (0, detection_to_rect_1.calculateDetectionsToRects)(detection, 'boundingbox', 'normRect', imageSize, {
            rotationVectorStartKeypointIndex: 0,
            rotationVectorEndKeypointIndex: 2,
            rotationVectorTargetAngleDegree: 90
        });
        // Expands and shifts the rectangle that contains the palm so that it's
        // likely to cover the entire hand.
        // PalmDetectionDetectionToRoi: RectTransformationCalculation.
        const roi = (0, transform_rect_1.transformNormalizedRect)(rawRoi, imageSize, constants.MPHANDS_DETECTOR_RECT_TRANSFORMATION_CONFIG);
        return roi;
    }
    // Predict hand landmarks.
    // subgraph: HandLandmarkCpu
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/hand_landmark/hand_landmark_cpu.pbtxt
    handLandmarks(handRect, image) {
        return __awaiter(this, void 0, void 0, function* () {
            // HandLandmarkCpu: ImageToTensorCalculator
            // Transforms a region of image into a 224x224 tensor while keeping the
            // aspect ratio, and therefore may result in potential letterboxing.
            const { imageTensor: imageValueShifted, padding } = (0, convert_image_to_tensor_1.convertImageToTensor)(image, constants.MPHANDS_LANDMARK_IMAGE_TO_TENSOR_CONFIG, handRect);
            // HandLandmarkCpu: InferenceCalculator
            // Runs a model takes an image tensor and
            // outputs a list of tensors representing, for instance, detection
            // boxes/keypoints and scores.
            // The model returns 3 tensors with the following shape:
            // Identity_2:0: This tensor (shape: [1, 63]) represents 21 3-d
            // keypoints.
            // Identity_1:0: This tensor (shape: [1, 1]) represents the
            // confidence score of the presence of a hand.
            // Identity:0: This tensor (shape: [1, 1]) represents the classication
            // score of handedness
            // Identity:3: This tensor (shape: [1, 63]) represents 21 3DWorld keypoints.
            const landmarkResult = this.landmarkModel.execute(imageValueShifted, [
                'Identity_2:0', 'Identity_1:0', 'Identity:0', 'Identity_3:0'
            ]);
            const landmarkTensor = landmarkResult[0], handFlagTensor = landmarkResult[1], handednessTensor = landmarkResult[2], worldLandmarkTensor = landmarkResult[3];
            // Converts the hand-flag tensor into a float that represents the
            // confidence score of pose presence.
            const handScore = (yield handFlagTensor.data())[0];
            // Applies a threshold to the confidence score to determine whether a hand
            // is present.
            if (handScore < constants.MPHANDS_HAND_PRESENCE_SCORE) {
                tf.dispose(landmarkResult);
                tf.dispose(imageValueShifted);
                return null;
            }
            // Converts the handedness tensor into a float that represents the
            // classification score of handedness.
            const handednessScore = (yield handednessTensor.data())[0];
            const handedness = handednessScore >= 0.5 ? 'Left' : 'Right';
            // Decodes the landmark tensors into a list of landmarks, where the
            // landmark coordinates are normalized by the size of the input image to
            // the model.
            // HandLandmarkCpu: TensorsToLandmarksCalculator.
            const landmarks = yield (0, tensors_to_landmarks_1.tensorsToLandmarks)(landmarkTensor, constants.MPHANDS_TENSORS_TO_LANDMARKS_CONFIG);
            // Decodes the landmark tensors into a list of landmarks, where the landmark
            // coordinates are normalized by the size of the input image to the model.
            // HandLandmarkCpu: TensorsToLandmarksCalculator.
            const worldLandmarks = yield (0, tensors_to_landmarks_1.tensorsToLandmarks)(worldLandmarkTensor, constants.MPHANDS_TENSORS_TO_WORLD_LANDMARKS_CONFIG);
            // Adjusts landmarks (already normalized to [0.0, 1.0]) on the letterboxed
            // hand image to the corresponding locations on the same image with the
            // letterbox removed.
            // HandLandmarkCpu: LandmarkLetterboxRemovalCalculator.
            const adjustedLandmarks = (0, remove_landmark_letterbox_1.removeLandmarkLetterbox)(landmarks, padding);
            // Projects the landmarks from the cropped hand image to the corresponding
            // locations on the full image before cropping (input to the graph).
            // HandLandmarkCpu: LandmarkProjectionCalculator.
            const landmarksProjected = (0, calculate_landmark_projection_1.calculateLandmarkProjection)(adjustedLandmarks, handRect);
            // Projects the world landmarks from the cropped pose image to the
            // corresponding locations on the full image before cropping (input to the
            // graph).
            // HandLandmarkCpu: WorldLandmarkProjectionCalculator.
            const worldLandmarksProjected = (0, calculate_world_landmark_projection_1.calculateWorldLandmarkProjection)(worldLandmarks, handRect);
            tf.dispose(landmarkResult);
            tf.dispose(imageValueShifted);
            return {
                landmarks: landmarksProjected,
                worldLandmarks: worldLandmarksProjected,
                handScore,
                handedness
            };
        });
    }
    // Calculate hand region of interest (ROI) from landmarks.
    // Subgraph: HandLandmarkLandmarksToRoi
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/hand_landmark/hand_landmark_landmarks_to_roi.pbtxt
    // When landmarks is not null, imageSize should not be null either.
    handLandmarksToRoi(landmarks, imageSize) {
        // Extracts a subset of the hand landmarks that are relatively more stable
        // across frames (e.g. comparing to finger tips) for computing the bounding
        // box. The box will later be expanded to contain the entire hand. In this
        // approach, it is more robust to drastically changing hand size. The
        // landmarks extracted are: wrist, MCP/PIP of five fingers.
        // HandLandmarkLandmarksToRoi: SplitNormalizedLandmarkListCalculator.
        const partialLandmarks = [].concat(landmarks.slice(0, 4), landmarks.slice(5, 7), landmarks.slice(9, 11), landmarks.slice(13, 15), landmarks.slice(17, 19));
        // Converts the hand landmarks into a rectangle (normalized by image size)
        // that encloses the hand. The calculator uses a subset of all hand
        // landmarks extracted from the concat + slice above to
        // calculate the bounding box and the rotation of the output rectangle.
        // HandLandmarkLandmarksToRoi: HandLandmarksToRectCalculator.
        const rawRoi = (0, hand_landmarks_to_rect_1.handLandmarksToRect)(partialLandmarks, imageSize);
        // Expands pose rect with marging used during training.
        // PoseLandmarksToRoi: RectTransformationCalculator.
        const roi = (0, transform_rect_1.transformNormalizedRect)(rawRoi, imageSize, constants.MPHANDS_LANDMARK_RECT_TRANSFORMATION_CONFIG);
        return roi;
    }
}
/**
 * Loads the MediaPipeHands model.
 *
 * @param modelConfig ModelConfig object that contains parameters for
 * the MediaPipeHands loading process. Please find more details of each
 * parameters in the documentation of the `MediaPipeHandsTfjsModelConfig`
 * interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, detector_utils_1.validateModelConfig)(modelConfig);
        const detectorFromTFHub = (config.detectorModelUrl.indexOf('https://tfhub.dev') > -1);
        const landmarkFromTFHub = (config.landmarkModelUrl.indexOf('https://tfhub.dev') > -1);
        const [detectorModel, landmarkModel] = yield Promise.all([
            tfconv.loadGraphModel(config.detectorModelUrl, { fromTFHub: detectorFromTFHub }),
            tfconv.loadGraphModel(config.landmarkModelUrl, { fromTFHub: landmarkFromTFHub })
        ]);
        return new MediaPipeHandsTfjsDetector(detectorModel, landmarkModel, config.maxHands);
    });
}
exports.load = load;
