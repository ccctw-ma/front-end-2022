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
const convert_image_to_tensor_1 = require("../shared/calculators/convert_image_to_tensor");
const image_utils_1 = require("../shared/calculators/image_utils");
const shift_image_value_1 = require("../shared/calculators/shift_image_value");
const decode_multiple_poses_1 = require("./calculators/decode_multiple_poses");
const decode_single_pose_1 = require("./calculators/decode_single_pose");
const flip_poses_1 = require("./calculators/flip_poses");
const scale_poses_1 = require("./calculators/scale_poses");
const constants_1 = require("./constants");
const detector_utils_1 = require("./detector_utils");
const load_utils_1 = require("./load_utils");
/**
 * PoseNet detector class.
 */
class PosenetDetector {
    constructor(posenetModel, config) {
        this.posenetModel = posenetModel;
        // validate params.
        const inputShape = this.posenetModel.inputs[0].shape;
        tf.util.assert((inputShape[1] === -1) && (inputShape[2] === -1), () => `Input shape [${inputShape[1]}, ${inputShape[2]}] ` +
            `must both be equal to or -1`);
        const validInputResolution = (0, load_utils_1.getValidInputResolutionDimensions)(config.inputResolution, config.outputStride);
        (0, detector_utils_1.assertValidOutputStride)(config.outputStride);
        (0, detector_utils_1.assertValidResolution)(validInputResolution, config.outputStride);
        this.inputResolution = validInputResolution;
        this.outputStride = config.outputStride;
        this.architecture = config.architecture;
    }
    /**
     * Estimates poses for an image or video frame.
     *
     * This does standard ImageNet pre-processing before inferring through the
     * model. The image should pixels should have values [0-255]. It returns a
     * single pose or multiple poses based on the maxPose parameter from the
     * `config`.
     *
     * @param image
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config
     *       maxPoses: Optional. Max number of poses to estimate.
     *       When maxPoses = 1, a single pose is detected, it is usually much more
     *       efficient than maxPoses > 1. When maxPoses > 1, multiple poses are
     *       detected.
     *
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     * @return An array of `Pose`s.
     */
    estimatePoses(image, estimationConfig = constants_1.SINGLE_PERSON_ESTIMATION_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = (0, detector_utils_1.validateEstimationConfig)(estimationConfig);
            if (image == null) {
                return [];
            }
            this.maxPoses = config.maxPoses;
            const { imageTensor, padding } = (0, convert_image_to_tensor_1.convertImageToTensor)(image, {
                outputTensorSize: this.inputResolution,
                keepAspectRatio: true,
                borderMode: 'replicate'
            });
            const imageValueShifted = this.architecture === 'ResNet50' ?
                tf.add(imageTensor, constants_1.RESNET_MEAN) :
                (0, shift_image_value_1.shiftImageValue)(imageTensor, [-1, 1]);
            const results = this.posenetModel.predict(imageValueShifted);
            let offsets, heatmap, displacementFwd, displacementBwd;
            if (this.architecture === 'ResNet50') {
                offsets = tf.squeeze(results[2], [0]);
                heatmap = tf.squeeze(results[3], [0]);
                displacementFwd = tf.squeeze(results[0], [0]);
                displacementBwd = tf.squeeze(results[1], [0]);
            }
            else {
                offsets = tf.squeeze(results[0], [0]);
                heatmap = tf.squeeze(results[1], [0]);
                displacementFwd = tf.squeeze(results[2], [0]);
                displacementBwd = tf.squeeze(results[3], [0]);
            }
            const heatmapScores = tf.sigmoid(heatmap);
            let poses;
            if (this.maxPoses === 1) {
                const pose = yield (0, decode_single_pose_1.decodeSinglePose)(heatmapScores, offsets, this.outputStride);
                poses = [pose];
            }
            else {
                poses = yield (0, decode_multiple_poses_1.decodeMultiplePoses)(heatmapScores, offsets, displacementFwd, displacementBwd, this.outputStride, this.maxPoses, config.scoreThreshold, config.nmsRadius);
            }
            const imageSize = (0, image_utils_1.getImageSize)(image);
            let scaledPoses = (0, scale_poses_1.scalePoses)(poses, imageSize, this.inputResolution, padding);
            if (config.flipHorizontal) {
                scaledPoses = (0, flip_poses_1.flipPosesHorizontal)(scaledPoses, imageSize);
            }
            imageTensor.dispose();
            imageValueShifted.dispose();
            tf.dispose(results);
            offsets.dispose();
            heatmap.dispose();
            displacementFwd.dispose();
            displacementBwd.dispose();
            heatmapScores.dispose();
            return scaledPoses;
        });
    }
    dispose() {
        this.posenetModel.dispose();
    }
    reset() {
        // No-op. There's no global state.
    }
}
/**
 * Loads the PoseNet model instance from a checkpoint, with the ResNet
 * or MobileNet architecture. The model to be loaded is configurable using the
 * config dictionary ModelConfig. Please find more details in the
 * documentation of the ModelConfig.
 *
 * @param config ModelConfig dictionary that contains parameters for
 * the PoseNet loading process. Please find more details of each parameters
 * in the documentation of the ModelConfig interface. The predefined
 * `MOBILENET_V1_CONFIG` and `RESNET_CONFIG` can also be used as references
 * for defining your customized config.
 */
function load(modelConfig = constants_1.MOBILENET_V1_CONFIG) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, detector_utils_1.validateModelConfig)(modelConfig);
        if (config.architecture === 'ResNet50') {
            // Load ResNet50 model.
            const defaultUrl = (0, load_utils_1.resNet50Checkpoint)(config.outputStride, config.quantBytes);
            const model = yield tfconv.loadGraphModel(config.modelUrl || defaultUrl);
            return new PosenetDetector(model, config);
        }
        // Load MobileNetV1 model.
        const defaultUrl = (0, load_utils_1.mobileNetCheckpoint)(config.outputStride, config.multiplier, config.quantBytes);
        const model = yield tfconv.loadGraphModel(config.modelUrl || defaultUrl);
        return new PosenetDetector(model, config);
    });
}
exports.load = load;
