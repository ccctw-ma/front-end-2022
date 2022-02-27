"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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
exports.load = exports.PoseNet = exports.MULTI_PERSON_INFERENCE_CONFIG = exports.SINGLE_PERSON_INFERENCE_CONFIG = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const checkpoints_1 = require("./checkpoints");
const mobilenet_1 = require("./mobilenet");
const decode_multiple_poses_1 = require("./multi_pose/decode_multiple_poses");
const resnet_1 = require("./resnet");
const decode_single_pose_1 = require("./single_pose/decode_single_pose");
const util_1 = require("./util");
// The default configuration for loading MobileNetV1 based PoseNet.
//
// (And for references, the default configuration for loading ResNet
// based PoseNet is also included).
//
// ```
// const RESNET_CONFIG = {
//   architecture: 'ResNet50',
//   outputStride: 32,
//   quantBytes: 2,
// } as ModelConfig;
// ```
const MOBILENET_V1_CONFIG = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    inputResolution: 257,
};
const VALID_ARCHITECTURE = ['MobileNetV1', 'ResNet50'];
const VALID_STRIDE = {
    'MobileNetV1': [8, 16, 32],
    'ResNet50': [32, 16]
};
const VALID_MULTIPLIER = {
    'MobileNetV1': [0.50, 0.75, 1.0],
    'ResNet50': [1.0]
};
const VALID_QUANT_BYTES = [1, 2, 4];
function validateModelConfig(config) {
    config = config || MOBILENET_V1_CONFIG;
    if (config.architecture == null) {
        config.architecture = 'MobileNetV1';
    }
    if (VALID_ARCHITECTURE.indexOf(config.architecture) < 0) {
        throw new Error(`Invalid architecture ${config.architecture}. ` +
            `Should be one of ${VALID_ARCHITECTURE}`);
    }
    if (config.inputResolution == null) {
        config.inputResolution = 257;
    }
    (0, util_1.validateInputResolution)(config.inputResolution);
    if (config.outputStride == null) {
        config.outputStride = 16;
    }
    if (VALID_STRIDE[config.architecture].indexOf(config.outputStride) < 0) {
        throw new Error(`Invalid outputStride ${config.outputStride}. ` +
            `Should be one of ${VALID_STRIDE[config.architecture]} ` +
            `for architecture ${config.architecture}.`);
    }
    if (config.multiplier == null) {
        config.multiplier = 1.0;
    }
    if (VALID_MULTIPLIER[config.architecture].indexOf(config.multiplier) < 0) {
        throw new Error(`Invalid multiplier ${config.multiplier}. ` +
            `Should be one of ${VALID_MULTIPLIER[config.architecture]} ` +
            `for architecture ${config.architecture}.`);
    }
    if (config.quantBytes == null) {
        config.quantBytes = 4;
    }
    if (VALID_QUANT_BYTES.indexOf(config.quantBytes) < 0) {
        throw new Error(`Invalid quantBytes ${config.quantBytes}. ` +
            `Should be one of ${VALID_QUANT_BYTES} ` +
            `for architecture ${config.architecture}.`);
    }
    if (config.architecture === 'MobileNetV1' && config.outputStride === 32 &&
        config.multiplier !== 1) {
        throw new Error(`When using an output stride of 32, ` +
            `you must select 1 as the multiplier.`);
    }
    return config;
}
exports.SINGLE_PERSON_INFERENCE_CONFIG = {
    flipHorizontal: false
};
exports.MULTI_PERSON_INFERENCE_CONFIG = {
    flipHorizontal: false,
    maxDetections: 5,
    scoreThreshold: 0.5,
    nmsRadius: 20
};
function validateSinglePersonInferenceConfig(config) { }
function validateMultiPersonInputConfig(config) {
    const { maxDetections, scoreThreshold, nmsRadius } = config;
    if (maxDetections <= 0) {
        throw new Error(`Invalid maxDetections ${maxDetections}. ` +
            `Should be > 0`);
    }
    if (scoreThreshold < 0.0 || scoreThreshold > 1.0) {
        throw new Error(`Invalid scoreThreshold ${scoreThreshold}. ` +
            `Should be in range [0.0, 1.0]`);
    }
    if (nmsRadius <= 0) {
        throw new Error(`Invalid nmsRadius ${nmsRadius}.`);
    }
}
class PoseNet {
    constructor(net, inputResolution) {
        (0, util_1.assertValidOutputStride)(net.outputStride);
        (0, util_1.assertValidResolution)(inputResolution, net.outputStride);
        this.baseModel = net;
        this.inputResolution = inputResolution;
    }
    /**
     * Infer through PoseNet, and estimates multiple poses using the outputs.
     * This does standard ImageNet pre-processing before inferring through the
     * model. The image should pixels should have values [0-255]. It detects
     * multiple poses and finds their parts from part scores and displacement
     * vectors using a fast greedy decoding algorithm.  It returns up to
     * `config.maxDetections` object instance detections in decreasing root
     * score order.
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) The input
     * image to feed through the network.
     *
     * @param config MultiPoseEstimationConfig object that contains parameters
     * for the PoseNet inference using multiple pose estimation.
     *
     * @return An array of poses and their scores, each containing keypoints and
     * the corresponding keypoint scores.  The positions of the keypoints are
     * in the same scale as the original image
     */
    estimateMultiplePoses(input, config = exports.MULTI_PERSON_INFERENCE_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            const configWithDefaults = Object.assign(Object.assign({}, exports.MULTI_PERSON_INFERENCE_CONFIG), config);
            validateMultiPersonInputConfig(config);
            const outputStride = this.baseModel.outputStride;
            const inputResolution = this.inputResolution;
            const [height, width] = (0, util_1.getInputTensorDimensions)(input);
            const { resized, padding } = (0, util_1.padAndResizeTo)(input, inputResolution);
            const { heatmapScores, offsets, displacementFwd, displacementBwd } = this.baseModel.predict(resized);
            const allTensorBuffers = yield (0, util_1.toTensorBuffers3D)([heatmapScores, offsets, displacementFwd, displacementBwd]);
            const scoresBuffer = allTensorBuffers[0];
            const offsetsBuffer = allTensorBuffers[1];
            const displacementsFwdBuffer = allTensorBuffers[2];
            const displacementsBwdBuffer = allTensorBuffers[3];
            const poses = yield (0, decode_multiple_poses_1.decodeMultiplePoses)(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, configWithDefaults.maxDetections, configWithDefaults.scoreThreshold, configWithDefaults.nmsRadius);
            const resultPoses = (0, util_1.scaleAndFlipPoses)(poses, [height, width], inputResolution, padding, configWithDefaults.flipHorizontal);
            heatmapScores.dispose();
            offsets.dispose();
            displacementFwd.dispose();
            displacementBwd.dispose();
            resized.dispose();
            return resultPoses;
        });
    }
    /**
     * Infer through PoseNet, and estimates a single pose using the outputs.
     * This does standard ImageNet pre-processing before inferring through the
     * model. The image should pixels should have values [0-255]. It detects
     * multiple poses and finds their parts from part scores and displacement
     * vectors using a fast greedy decoding algorithm.  It returns a single pose
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) The input
     * image to feed through the network.
     *
     * @param config SinglePersonEstimationConfig object that contains
     * parameters for the PoseNet inference using single pose estimation.
     *
     * @return An pose and its scores, containing keypoints and
     * the corresponding keypoint scores.  The positions of the keypoints are
     * in the same scale as the original image
     */
    estimateSinglePose(input, config = exports.SINGLE_PERSON_INFERENCE_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            const configWithDefaults = Object.assign(Object.assign({}, exports.SINGLE_PERSON_INFERENCE_CONFIG), config);
            validateSinglePersonInferenceConfig(configWithDefaults);
            const outputStride = this.baseModel.outputStride;
            const inputResolution = this.inputResolution;
            const [height, width] = (0, util_1.getInputTensorDimensions)(input);
            const { resized, padding } = (0, util_1.padAndResizeTo)(input, inputResolution);
            const { heatmapScores, offsets, displacementFwd, displacementBwd } = this.baseModel.predict(resized);
            const pose = yield (0, decode_single_pose_1.decodeSinglePose)(heatmapScores, offsets, outputStride);
            const poses = [pose];
            const resultPoses = (0, util_1.scaleAndFlipPoses)(poses, [height, width], inputResolution, padding, configWithDefaults.flipHorizontal);
            heatmapScores.dispose();
            offsets.dispose();
            displacementFwd.dispose();
            displacementBwd.dispose();
            resized.dispose();
            return resultPoses[0];
        });
    }
    /** Deprecated: Use either estimateSinglePose or estimateMultiplePoses */
    estimatePoses(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config.decodingMethod === 'single-person') {
                const pose = yield this.estimateSinglePose(input, config);
                return [pose];
            }
            else {
                return this.estimateMultiplePoses(input, config);
            }
        });
    }
    dispose() {
        this.baseModel.dispose();
    }
}
exports.PoseNet = PoseNet;
function loadMobileNet(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputStride = config.outputStride;
        const quantBytes = config.quantBytes;
        const multiplier = config.multiplier;
        if (tf == null) {
            throw new Error(`Cannot find TensorFlow.js. If you are using a <script> tag, please ` +
                `also include @tensorflow/tfjs on the page before using this
        model.`);
        }
        const url = (0, checkpoints_1.mobileNetCheckpoint)(outputStride, multiplier, quantBytes);
        const graphModel = yield tfconv.loadGraphModel(config.modelUrl || url);
        const mobilenet = new mobilenet_1.MobileNet(graphModel, outputStride);
        const validInputResolution = (0, util_1.getValidInputResolutionDimensions)(config.inputResolution, mobilenet.outputStride);
        return new PoseNet(mobilenet, validInputResolution);
    });
}
function loadResNet(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputStride = config.outputStride;
        const quantBytes = config.quantBytes;
        if (tf == null) {
            throw new Error(`Cannot find TensorFlow.js. If you are using a <script> tag, please ` +
                `also include @tensorflow/tfjs on the page before using this
        model.`);
        }
        const url = (0, checkpoints_1.resNet50Checkpoint)(outputStride, quantBytes);
        const graphModel = yield tfconv.loadGraphModel(config.modelUrl || url);
        const resnet = new resnet_1.ResNet(graphModel, outputStride);
        const validInputResolution = (0, util_1.getValidInputResolutionDimensions)(config.inputResolution, resnet.outputStride);
        return new PoseNet(resnet, validInputResolution);
    });
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
function load(config = MOBILENET_V1_CONFIG) {
    return __awaiter(this, void 0, void 0, function* () {
        config = validateModelConfig(config);
        if (config.architecture === 'ResNet50') {
            return loadResNet(config);
        }
        else if (config.architecture === 'MobileNetV1') {
            return loadMobileNet(config);
        }
        else {
            return null;
        }
    });
}
exports.load = load;
