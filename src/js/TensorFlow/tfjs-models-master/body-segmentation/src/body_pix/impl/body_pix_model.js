"use strict";
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
exports.load = exports.BodyPix = exports.MULTI_PERSON_INSTANCE_INFERENCE_CONFIG = exports.PERSON_INFERENCE_CONFIG = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const decode_part_map_1 = require("./decode_part_map");
const mobilenet_1 = require("./mobilenet");
const decode_instance_masks_1 = require("./multi_person/decode_instance_masks");
const decode_multiple_poses_1 = require("./multi_person/decode_multiple_poses");
const resnet_1 = require("./resnet");
const saved_models_1 = require("./saved_models");
const util_1 = require("./util");
const APPLY_SIGMOID_ACTIVATION = true;
const FLIP_POSES_AFTER_SCALING = false;
// The default configuration for loading MobileNetV1 based BodyPix.
//
// (And for references, the default configuration for loading ResNet
// based PoseNet is also included).
//
// ```
// const RESNET_CONFIG = {
//   architecture: 'ResNet50',
//   outputStride: 32,
//   quantBytes: 4,
// } as ModelConfig;
// ```
const MOBILENET_V1_CONFIG = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    quantBytes: 4,
    multiplier: 0.75,
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
    return config;
}
exports.PERSON_INFERENCE_CONFIG = {
    flipHorizontal: false,
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
    maxDetections: 10,
    scoreThreshold: 0.4,
    nmsRadius: 20,
};
exports.MULTI_PERSON_INSTANCE_INFERENCE_CONFIG = {
    flipHorizontal: false,
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
    maxDetections: 10,
    scoreThreshold: 0.4,
    nmsRadius: 20,
    minKeypointScore: 0.3,
    refineSteps: 10
};
function validatePersonInferenceConfig(config) {
    const { segmentationThreshold, maxDetections, scoreThreshold, nmsRadius } = config;
    if (segmentationThreshold < 0.0 || segmentationThreshold > 1.0) {
        throw new Error(`segmentationThreshold ${segmentationThreshold}. ` +
            `Should be in range [0.0, 1.0]`);
    }
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
function validateMultiPersonInstanceInferenceConfig(config) {
    const { segmentationThreshold, maxDetections, scoreThreshold, nmsRadius, minKeypointScore, refineSteps } = config;
    if (segmentationThreshold < 0.0 || segmentationThreshold > 1.0) {
        throw new Error(`segmentationThreshold ${segmentationThreshold}. ` +
            `Should be in range [0.0, 1.0]`);
    }
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
    if (minKeypointScore < 0 || minKeypointScore > 1) {
        throw new Error(`Invalid minKeypointScore ${minKeypointScore}.` +
            `Should be in range [0.0, 1.0]`);
    }
    if (refineSteps <= 0 || refineSteps > 20) {
        throw new Error(`Invalid refineSteps ${refineSteps}.` +
            `Should be in range [1, 20]`);
    }
}
class BodyPix {
    constructor(net) {
        this.baseModel = net;
    }
    predictForPersonSegmentation(input) {
        const { segmentation, heatmapScores, offsets, displacementFwd, displacementBwd, } = this.baseModel.predict(input);
        return {
            segmentLogits: segmentation,
            heatmapScores,
            offsets,
            displacementFwd,
            displacementBwd,
        };
    }
    predictForPersonSegmentationAndPart(input) {
        const { segmentation, partHeatmaps, heatmapScores, offsets, displacementFwd, displacementBwd } = this.baseModel.predict(input);
        return {
            segmentLogits: segmentation,
            partHeatmapLogits: partHeatmaps,
            heatmapScores,
            offsets,
            displacementFwd,
            displacementBwd,
        };
    }
    predictForMultiPersonInstanceSegmentationAndPart(input) {
        const { segmentation, longOffsets, heatmapScores, offsets, displacementFwd, displacementBwd, partHeatmaps, } = this.baseModel.predict(input);
        return {
            segmentLogits: segmentation,
            longOffsets,
            heatmapScores,
            offsets,
            displacementFwd,
            displacementBwd,
            partHeatmaps
        };
    }
    /**
     * Given an image with people, returns a dictionary of all intermediate
     * tensors including: 1) a binary array with 1 for the pixels that are part of
     * the person, and 0 otherwise, 2) heatmapScores, 3) offsets, and 4) paddings.
     *
     * @param input ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)
     * The input image to feed through the network.
     *
     * @param internalResolution Defaults to 'medium'. The internal resolution
     * that the input is resized to before inference. The larger the
     * internalResolution the more accurate the model at the cost of slower
     * prediction times. Available values are 'low', 'medium', 'high', 'full', or
     * a percentage value between 0 and 1. The values 'low', 'medium', 'high', and
     * 'full' map to 0.25, 0.5, 0.75, and 1.0 correspondingly.
     *
     * @param segmentationThreshold The minimum that segmentation values must have
     * to be considered part of the person. Affects the generation of the
     * segmentation mask.
     *
     * @return A dictionary containing `segmentation`, `heatmapScores`, `offsets`,
     * and `padding`:
     * - `segmentation`: A 2d Tensor with 1 for the pixels that are part of the
     * person, and 0 otherwise. The width and height correspond to the same
     * dimensions of the input image.
     * - `heatmapScores`: A 3d Tensor of the keypoint heatmaps used by
     * pose estimation decoding.
     * - `offsets`: A 3d Tensor of the keypoint offsets used by pose
     * estimation decoding.
     * - `displacementFwd`: A 3d Tensor of the keypoint forward displacement used
     * by pose estimation decoding.
     * - `displacementBwd`: A 3d Tensor of the keypoint backward displacement used
     * by pose estimation decoding.
     * - `padding`: The padding (unit pixels) being applied to the input image
     * before it is fed into the model.
     */
    segmentPersonActivation(input, internalResolution, segmentationThreshold = 0.5) {
        const [height, width] = (0, util_1.getInputSize)(input);
        const internalResolutionHeightAndWidth = (0, util_1.toInputResolutionHeightAndWidth)(internalResolution, this.baseModel.outputStride, [height, width]);
        const { resized, padding } = (0, util_1.padAndResizeTo)(input, internalResolutionHeightAndWidth);
        const { segmentation, heatmapScores, offsets, displacementFwd, displacementBwd } = tf.tidy(() => {
            const { segmentLogits, heatmapScores, offsets, displacementFwd, displacementBwd } = this.predictForPersonSegmentation(resized);
            const [resizedHeight, resizedWidth] = resized.shape;
            const scaledSegmentScores = (0, util_1.scaleAndCropToInputTensorShape)(segmentLogits, [height, width], [resizedHeight, resizedWidth], [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
            return {
                segmentation: (0, decode_part_map_1.toMaskTensor)(tf.squeeze(scaledSegmentScores), segmentationThreshold),
                heatmapScores,
                offsets,
                displacementFwd,
                displacementBwd,
            };
        });
        resized.dispose();
        return {
            segmentation,
            heatmapScores,
            offsets,
            displacementFwd,
            displacementBwd,
            padding,
            internalResolutionHeightAndWidth
        };
    }
    /**
     * Given an image with many people, returns a PersonSegmentation dictionary
     * that contains the segmentation mask for all people and a single pose.
     *
     * Note: The segmentation mask returned by this method covers all people but
     * the pose works well for one person. If you want to estimate instance-level
     * multiple person segmentation & pose for each person, use
     * `segmentMultiPerson` instead.
     *
     * @param input ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)
     * The input image to feed through the network.
     *
     * @param config PersonInferenceConfig object that contains
     * parameters for the BodyPix inference using person decoding.
     *
     * @return A SemanticPersonSegmentation dictionary that contains height,
     * width, the flattened binary segmentation mask and the poses for all people.
     * The width and height correspond to the same dimensions of the input image.
     * - `height`: The height of the segmentation data in pixel unit.
     * - `width`: The width of the segmentation data in pixel unit.
     * - `data`: The flattened Uint8Array of segmentation data. 1 means the pixel
     * belongs to a person and 0 means the pixel doesn't belong to a person. The
     * size of the array is equal to `height` x `width` in row-major order.
     * - `allPoses`: The 2d poses of all people.
     */
    segmentPerson(input, config = exports.PERSON_INFERENCE_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            config = Object.assign(Object.assign({}, exports.PERSON_INFERENCE_CONFIG), config);
            validatePersonInferenceConfig(config);
            const { segmentation, heatmapScores, offsets, displacementFwd, displacementBwd, padding, internalResolutionHeightAndWidth } = this.segmentPersonActivation(input, config.internalResolution, config.segmentationThreshold);
            const [height, width] = segmentation.shape;
            const result = yield segmentation.data();
            segmentation.dispose();
            const tensorBuffers = yield (0, util_1.toTensorBuffers3D)([heatmapScores, offsets, displacementFwd, displacementBwd]);
            const [scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf] = tensorBuffers;
            let poses = (0, decode_multiple_poses_1.decodeMultiplePoses)(scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf, this.baseModel.outputStride, config.maxDetections, config.scoreThreshold, config.nmsRadius);
            poses = (0, util_1.scaleAndFlipPoses)(poses, [height, width], internalResolutionHeightAndWidth, padding, FLIP_POSES_AFTER_SCALING);
            heatmapScores.dispose();
            offsets.dispose();
            displacementFwd.dispose();
            displacementBwd.dispose();
            return { height, width, data: result, allPoses: poses };
        });
    }
    /**
     * Given an image with multiple people, returns an *array* of
     * PersonSegmentation object. Each element in the array corresponding to one
     * of the people in the input image. In other words, it predicts
     * instance-level multiple person segmentation & pose for each person.
     *
     * The model does standard ImageNet pre-processing before inferring through
     * the model. The image pixels should have values [0-255].
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) The input
     * image to feed through the network.
     *
     * @param config MultiPersonInferenceConfig object that contains
     * parameters for the BodyPix inference using multi-person decoding.
     *
     * @return An array of PersonSegmentation object, each containing a width,
     * height, a binary array (1 for the pixels that are part of the
     * person, and 0 otherwise) and 2D pose. The array size corresponds to the
     * number of pixels in the image. The width and height correspond to the
     * dimensions of the image the binary array is shaped to, which are the same
     * dimensions of the input image.
     */
    segmentMultiPerson(input, config = exports.MULTI_PERSON_INSTANCE_INFERENCE_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            config = Object.assign(Object.assign({}, exports.MULTI_PERSON_INSTANCE_INFERENCE_CONFIG), config);
            validateMultiPersonInstanceInferenceConfig(config);
            const [height, width] = (0, util_1.getInputSize)(input);
            const internalResolutionHeightAndWidth = (0, util_1.toInputResolutionHeightAndWidth)(config.internalResolution, this.baseModel.outputStride, [height, width]);
            const { resized, padding } = (0, util_1.padAndResizeTo)(input, internalResolutionHeightAndWidth);
            const { segmentation, longOffsets, heatmapScoresRaw, offsetsRaw, displacementFwdRaw, displacementBwdRaw, } = tf.tidy(() => {
                const { segmentLogits, longOffsets, heatmapScores, offsets, displacementFwd, displacementBwd, } = this.predictForMultiPersonInstanceSegmentationAndPart(resized);
                const scaledSegmentScores = (0, util_1.scaleAndCropToInputTensorShape)(segmentLogits, [height, width], internalResolutionHeightAndWidth, [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
                const longOffsetsResized = false;
                let scaledLongOffsets;
                if (longOffsetsResized) {
                    scaledLongOffsets = (0, util_1.scaleAndCropToInputTensorShape)(longOffsets, [height, width], internalResolutionHeightAndWidth, [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
                }
                else {
                    scaledLongOffsets = longOffsets;
                }
                const segmentation = (0, decode_part_map_1.toMaskTensor)(tf.squeeze(scaledSegmentScores), config.segmentationThreshold);
                return {
                    segmentation,
                    longOffsets: scaledLongOffsets,
                    heatmapScoresRaw: heatmapScores,
                    offsetsRaw: offsets,
                    displacementFwdRaw: displacementFwd,
                    displacementBwdRaw: displacementBwd,
                };
            });
            const tensorBuffers = yield (0, util_1.toTensorBuffers3D)([heatmapScoresRaw, offsetsRaw, displacementFwdRaw, displacementBwdRaw]);
            const [scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf] = tensorBuffers;
            let poses = (0, decode_multiple_poses_1.decodeMultiplePoses)(scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf, this.baseModel.outputStride, config.maxDetections, config.scoreThreshold, config.nmsRadius);
            poses = (0, util_1.scaleAndFlipPoses)(poses, [height, width], internalResolutionHeightAndWidth, padding, FLIP_POSES_AFTER_SCALING);
            const instanceMasks = yield (0, decode_instance_masks_1.decodePersonInstanceMasks)(segmentation, longOffsets, poses, height, width, this.baseModel.outputStride, internalResolutionHeightAndWidth, padding, config.scoreThreshold, config.refineSteps, config.minKeypointScore, config.maxDetections);
            resized.dispose();
            segmentation.dispose();
            longOffsets.dispose();
            heatmapScoresRaw.dispose();
            offsetsRaw.dispose();
            displacementFwdRaw.dispose();
            displacementBwdRaw.dispose();
            return instanceMasks;
        });
    }
    /**
     * Given an image with many people, returns a dictionary containing: height,
     * width, a tensor with a part id from 0-24 for the pixels that are
     * part of a corresponding body part, and -1 otherwise. This does standard
     * ImageNet pre-processing before inferring through the model.  The image
     * should pixels should have values [0-255].
     *
     * @param input ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)
     * The input image to feed through the network.
     *
     * @param internalResolution Defaults to 'medium'. The internal resolution
     * percentage that the input is resized to before inference. The larger the
     * internalResolution the more accurate the model at the cost of slower
     * prediction times. Available values are 'low', 'medium', 'high', 'full', or
     * a percentage value between 0 and 1. The values 'low', 'medium', 'high', and
     * 'full' map to 0.25, 0.5, 0.75, and 1.0 correspondingly.
     *
     * @param segmentationThreshold The minimum that segmentation values must have
     * to be considered part of the person.  Affects the clipping of the colored
     * part image.
     *
     * @return  A dictionary containing `partSegmentation`, `heatmapScores`,
     * `offsets`, and `padding`:
     * - `partSegmentation`: A 2d Tensor with a part id from 0-24 for
     * the pixels that are part of a corresponding body part, and -1 otherwise.
     * - `heatmapScores`: A 3d Tensor of the keypoint heatmaps used by
     * single-person pose estimation decoding.
     * - `offsets`: A 3d Tensor of the keypoint offsets used by single-person pose
     * estimation decoding.
     * - `displacementFwd`: A 3d Tensor of the keypoint forward displacement
     * used by pose estimation decoding.
     * - `displacementBwd`: A 3d Tensor of the keypoint backward displacement used
     * by pose estimation decoding.
     * - `padding`: The padding (unit pixels) being applied to the input image
     * before it is fed into the model.
     */
    segmentPersonPartsActivation(input, internalResolution, segmentationThreshold = 0.5) {
        const [height, width] = (0, util_1.getInputSize)(input);
        const internalResolutionHeightAndWidth = (0, util_1.toInputResolutionHeightAndWidth)(internalResolution, this.baseModel.outputStride, [height, width]);
        const { resized, padding, } = (0, util_1.padAndResizeTo)(input, internalResolutionHeightAndWidth);
        const { partSegmentation, heatmapScores, offsets, displacementFwd, displacementBwd } = tf.tidy(() => {
            const { segmentLogits, partHeatmapLogits, heatmapScores, offsets, displacementFwd, displacementBwd } = this.predictForPersonSegmentationAndPart(resized);
            const [resizedHeight, resizedWidth] = resized.shape;
            const scaledSegmentScores = (0, util_1.scaleAndCropToInputTensorShape)(segmentLogits, [height, width], [resizedHeight, resizedWidth], [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
            const scaledPartHeatmapScore = (0, util_1.scaleAndCropToInputTensorShape)(partHeatmapLogits, [height, width], [resizedHeight, resizedWidth], [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
            const segmentation = (0, decode_part_map_1.toMaskTensor)(tf.squeeze(scaledSegmentScores), segmentationThreshold);
            return {
                partSegmentation: (0, decode_part_map_1.decodePartSegmentation)(segmentation, scaledPartHeatmapScore),
                heatmapScores,
                offsets,
                displacementFwd,
                displacementBwd,
            };
        });
        resized.dispose();
        return {
            partSegmentation,
            heatmapScores,
            offsets,
            displacementFwd,
            displacementBwd,
            padding,
            internalResolutionHeightAndWidth
        };
    }
    /**
     * Given an image with many people, returns a PartSegmentation dictionary that
     * contains the body part segmentation mask for all people and a single pose.
     *
     * Note: The body part segmentation mask returned by this method covers all
     * people but the pose works well when there is one person. If you want to
     * estimate instance-level multiple person body part segmentation & pose for
     * each person, use `segmentMultiPersonParts` instead.
     *
     * @param input ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)
     * The input image to feed through the network.
     *
     * @param config PersonInferenceConfig object that contains
     * parameters for the BodyPix inference using single person decoding.
     *
     * @return A SemanticPartSegmentation dictionary that contains height, width,
     * the flattened binary segmentation mask and the pose for the person. The
     * width and height correspond to the same dimensions of the input image.
     * - `height`: The height of the person part segmentation data in pixel unit.
     * - `width`: The width of the person part segmentation data in pixel unit.
     * - `data`: The flattened Int32Array of person part segmentation data with a
     * part id from 0-24 for the pixels that are part of a corresponding body
     * part, and -1 otherwise. The size of the array is equal to `height` x
     * `width` in row-major order.
     * - `allPoses`: The 2d poses of all people.
     */
    segmentPersonParts(input, config = exports.PERSON_INFERENCE_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            config = Object.assign(Object.assign({}, exports.PERSON_INFERENCE_CONFIG), config);
            validatePersonInferenceConfig(config);
            const { partSegmentation, heatmapScores, offsets, displacementFwd, displacementBwd, padding, internalResolutionHeightAndWidth } = this.segmentPersonPartsActivation(input, config.internalResolution, config.segmentationThreshold);
            const [height, width] = partSegmentation.shape;
            const data = yield partSegmentation.data();
            partSegmentation.dispose();
            const tensorBuffers = yield (0, util_1.toTensorBuffers3D)([heatmapScores, offsets, displacementFwd, displacementBwd]);
            const [scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf] = tensorBuffers;
            let poses = (0, decode_multiple_poses_1.decodeMultiplePoses)(scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf, this.baseModel.outputStride, config.maxDetections, config.scoreThreshold, config.nmsRadius);
            poses = (0, util_1.scaleAndFlipPoses)(poses, [height, width], internalResolutionHeightAndWidth, padding, FLIP_POSES_AFTER_SCALING);
            heatmapScores.dispose();
            offsets.dispose();
            displacementFwd.dispose();
            displacementBwd.dispose();
            return { height, width, data, allPoses: poses };
        });
    }
    /**
     * Given an image with multiple people, returns an *array* of PartSegmentation
     * object. Each element in the array corresponding to one
     * of the people in the input image. In other words, it predicts
     * instance-level multiple person body part segmentation & pose for each
     * person.
     *
     * This does standard ImageNet pre-processing before inferring through
     * the model. The image pixels should have values [0-255].
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) The input
     * image to feed through the network.
     *
     * @param config MultiPersonInferenceConfig object that contains
     * parameters for the BodyPix inference using multi-person decoding.
     *
     * @return An array of PartSegmentation object, each containing a width,
     * height, a flattened array (with part id from 0-24 for the pixels that are
     * part of a corresponding body part, and -1 otherwise) and 2D pose. The width
     * and height correspond to the dimensions of the image. Each flattened part
     * segmentation array size is equal to `height` x `width`.
     */
    segmentMultiPersonParts(input, config = exports.MULTI_PERSON_INSTANCE_INFERENCE_CONFIG) {
        return __awaiter(this, void 0, void 0, function* () {
            config = Object.assign(Object.assign({}, exports.MULTI_PERSON_INSTANCE_INFERENCE_CONFIG), config);
            validateMultiPersonInstanceInferenceConfig(config);
            const [height, width] = (0, util_1.getInputSize)(input);
            const internalResolutionHeightAndWidth = (0, util_1.toInputResolutionHeightAndWidth)(config.internalResolution, this.baseModel.outputStride, [height, width]);
            const { resized, padding } = (0, util_1.padAndResizeTo)(input, internalResolutionHeightAndWidth);
            const { segmentation, longOffsets, heatmapScoresRaw, offsetsRaw, displacementFwdRaw, displacementBwdRaw, partSegmentation, } = tf.tidy(() => {
                const { segmentLogits, longOffsets, heatmapScores, offsets, displacementFwd, displacementBwd, partHeatmaps } = this.predictForMultiPersonInstanceSegmentationAndPart(resized);
                // decoding with scaling.
                const scaledSegmentScores = (0, util_1.scaleAndCropToInputTensorShape)(segmentLogits, [height, width], internalResolutionHeightAndWidth, [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
                // decoding with scaling.
                const scaledPartSegmentationScores = (0, util_1.scaleAndCropToInputTensorShape)(partHeatmaps, [height, width], internalResolutionHeightAndWidth, [[padding.top, padding.bottom], [padding.left, padding.right]], APPLY_SIGMOID_ACTIVATION);
                const scaledLongOffsets = longOffsets;
                const segmentation = (0, decode_part_map_1.toMaskTensor)(tf.squeeze(scaledSegmentScores), config.segmentationThreshold);
                const partSegmentation = (0, decode_part_map_1.decodeOnlyPartSegmentation)(scaledPartSegmentationScores);
                return {
                    segmentation,
                    longOffsets: scaledLongOffsets,
                    heatmapScoresRaw: heatmapScores,
                    offsetsRaw: offsets,
                    displacementFwdRaw: displacementFwd,
                    displacementBwdRaw: displacementBwd,
                    partSegmentation
                };
            });
            const tensorBuffers = yield (0, util_1.toTensorBuffers3D)([heatmapScoresRaw, offsetsRaw, displacementFwdRaw, displacementBwdRaw]);
            const [scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf] = tensorBuffers;
            let poses = (0, decode_multiple_poses_1.decodeMultiplePoses)(scoresBuf, offsetsBuf, displacementsFwdBuf, displacementsBwdBuf, this.baseModel.outputStride, config.maxDetections, config.scoreThreshold, config.nmsRadius);
            poses = (0, util_1.scaleAndFlipPoses)(poses, [height, width], internalResolutionHeightAndWidth, padding, FLIP_POSES_AFTER_SCALING);
            const instanceMasks = yield (0, decode_instance_masks_1.decodePersonInstancePartMasks)(segmentation, longOffsets, partSegmentation, poses, height, width, this.baseModel.outputStride, internalResolutionHeightAndWidth, padding, config.scoreThreshold, config.refineSteps, config.minKeypointScore, config.maxDetections);
            resized.dispose();
            segmentation.dispose();
            longOffsets.dispose();
            heatmapScoresRaw.dispose();
            offsetsRaw.dispose();
            displacementFwdRaw.dispose();
            displacementBwdRaw.dispose();
            partSegmentation.dispose();
            return instanceMasks;
        });
    }
    dispose() {
        this.baseModel.dispose();
    }
}
exports.BodyPix = BodyPix;
/**
 * Loads the MobileNet BodyPix model.
 */
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
        const url = (0, saved_models_1.mobileNetSavedModel)(outputStride, multiplier, quantBytes);
        const graphModel = yield tfconv.loadGraphModel(config.modelUrl || url);
        const mobilenet = new mobilenet_1.MobileNet(graphModel, outputStride);
        return new BodyPix(mobilenet);
    });
}
/**
 * Loads the ResNet BodyPix model.
 */
function loadResNet(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputStride = config.outputStride;
        const quantBytes = config.quantBytes;
        if (tf == null) {
            throw new Error(`Cannot find TensorFlow.js. If you are using a <script> tag, please ` +
                `also include @tensorflow/tfjs on the page before using this
        model.`);
        }
        const url = (0, saved_models_1.resNet50SavedModel)(outputStride, quantBytes);
        const graphModel = yield tfconv.loadGraphModel(config.modelUrl || url);
        const resnet = new resnet_1.ResNet(graphModel, outputStride);
        return new BodyPix(resnet);
    });
}
/**
 * Loads the BodyPix model instance from a checkpoint, with the ResNet
 * or MobileNet architecture. The model to be loaded is configurable using the
 * config dictionary ModelConfig. Please find more details in the
 * documentation of the ModelConfig.
 *
 * @param config ModelConfig dictionary that contains parameters for
 * the BodyPix loading process. Please find more details of each parameters
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
