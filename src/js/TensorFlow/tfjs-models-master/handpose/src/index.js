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
exports.HandPose = exports.load = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const hand_1 = require("./hand");
const keypoints_1 = require("./keypoints");
const pipeline_1 = require("./pipeline");
// Load the bounding box detector model.
function loadHandDetectorModel() {
    return __awaiter(this, void 0, void 0, function* () {
        const HANDDETECT_MODEL_PATH = 'https://tfhub.dev/mediapipe/tfjs-model/handdetector/1/default/1';
        return tfconv.loadGraphModel(HANDDETECT_MODEL_PATH, { fromTFHub: true });
    });
}
const MESH_MODEL_INPUT_WIDTH = 256;
const MESH_MODEL_INPUT_HEIGHT = 256;
// Load the mesh detector model.
function loadHandPoseModel() {
    return __awaiter(this, void 0, void 0, function* () {
        const HANDPOSE_MODEL_PATH = 'https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1';
        return tfconv.loadGraphModel(HANDPOSE_MODEL_PATH, { fromTFHub: true });
    });
}
// In single shot detector pipelines, the output space is discretized into a set
// of bounding boxes, each of which is assigned a score during prediction. The
// anchors define the coordinates of these boxes.
function loadAnchors() {
    return __awaiter(this, void 0, void 0, function* () {
        return tf.util
            .fetch('https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1/anchors.json?tfjs-format=file')
            .then(d => d.json());
    });
}
/**
 * Load handpose.
 *
 * @param config A configuration object with the following properties:
 * - `maxContinuousChecks` How many frames to go without running the bounding
 * box detector. Defaults to infinity. Set to a lower value if you want a safety
 * net in case the mesh detector produces consistently flawed predictions.
 * - `detectionConfidence` Threshold for discarding a prediction. Defaults to
 * 0.8.
 * - `iouThreshold` A float representing the threshold for deciding whether
 * boxes overlap too much in non-maximum suppression. Must be between [0, 1].
 * Defaults to 0.3.
 * - `scoreThreshold` A threshold for deciding when to remove boxes based
 * on score in non-maximum suppression. Defaults to 0.75.
 */
function load({ maxContinuousChecks = Infinity, detectionConfidence = 0.8, iouThreshold = 0.3, scoreThreshold = 0.5 } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const [ANCHORS, handDetectorModel, handPoseModel] = yield Promise.all([loadAnchors(), loadHandDetectorModel(), loadHandPoseModel()]);
        const detector = new hand_1.HandDetector(handDetectorModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, ANCHORS, iouThreshold, scoreThreshold);
        const pipeline = new pipeline_1.HandPipeline(detector, handPoseModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, maxContinuousChecks, detectionConfidence);
        const handpose = new HandPose(pipeline);
        return handpose;
    });
}
exports.load = load;
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
function flipHandHorizontal(prediction, width) {
    const { handInViewConfidence, landmarks, boundingBox } = prediction;
    return {
        handInViewConfidence,
        landmarks: landmarks.map((coord) => {
            return [width - 1 - coord[0], coord[1], coord[2]];
        }),
        boundingBox: {
            topLeft: [width - 1 - boundingBox.topLeft[0], boundingBox.topLeft[1]],
            bottomRight: [
                width - 1 - boundingBox.bottomRight[0], boundingBox.bottomRight[1]
            ]
        }
    };
}
class HandPose {
    constructor(pipeline) {
        this.pipeline = pipeline;
    }
    static getAnnotations() {
        return keypoints_1.MESH_ANNOTATIONS;
    }
    /**
     * Finds hands in the input image.
     *
     * @param input The image to classify. Can be a tensor, DOM element image,
     * video, or canvas.
     * @param flipHorizontal Whether to flip the hand keypoints horizontally.
     * Should be true for videos that are flipped by default (e.g. webcams).
     */
    estimateHands(input, flipHorizontal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const [, width] = getInputTensorDimensions(input);
            const image = tf.tidy(() => {
                if (!(input instanceof tf.Tensor)) {
                    input = tf.browser.fromPixels(input);
                }
                return tf.expandDims(tf.cast(input, 'float32'));
            });
            const result = yield this.pipeline.estimateHand(image);
            image.dispose();
            if (result === null) {
                return [];
            }
            let prediction = result;
            if (flipHorizontal === true) {
                prediction = flipHandHorizontal(result, width);
            }
            const annotations = {};
            for (const key of Object.keys(keypoints_1.MESH_ANNOTATIONS)) {
                annotations[key] =
                    keypoints_1.MESH_ANNOTATIONS[key].map(index => prediction.landmarks[index]);
            }
            return [{
                    handInViewConfidence: prediction.handInViewConfidence,
                    boundingBox: prediction.boundingBox,
                    landmarks: prediction.landmarks,
                    annotations
                }];
        });
    }
}
exports.HandPose = HandPose;
