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
const mask_util_1 = require("../shared/calculators/mask_util");
const tensors_to_segmentation_1 = require("../shared/calculators/tensors_to_segmentation");
const constants = __importStar(require("./constants"));
const segmenter_utils_1 = require("./segmenter_utils");
class MediaPipeSelfieSegmentationTfjsMask {
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
 * MediaPipeSelfieSegmentation TFJS segmenter class.
 */
class MediaPipeSelfieSegmentationTfjsSegmenter {
    constructor(modelType, model) {
        this.modelType = modelType;
        this.model = model;
    }
    /**
     * Segment people found in an image or video frame.
     *
     * It returns a single segmentation which contains all the detected people
     * in the input.
     *
     * @param image
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config Optional.
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     * @return An array of one `Segmentation`.
     */
    // TF.js implementation of the mediapipe selfie segmentation pipeline.
    // ref graph:
    // https://github.com/google/mediapipe/blob/master/mediapipe/mediapipe/modules/elfie_segmentation/selfie_segmentation_cpu.pbtxt
    segmentPeople(image, segmentationConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            segmentationConfig = (0, segmenter_utils_1.validateSegmentationConfig)(segmentationConfig);
            if (image == null) {
                this.reset();
                return [];
            }
            // SelfieSegmentationCpu: ImageToTensorCalculator.
            // Resizes the input image into a tensor with a dimension desired by the
            // model.
            const { imageTensor: imageValueShifted } = (0, convert_image_to_tensor_1.convertImageToTensor)(image, this.modelType === 'general' ?
                constants.SELFIE_SEGMENTATION_IMAGE_TO_TENSOR_GENERAL_CONFIG :
                constants.SELFIE_SEGMENTATION_IMAGE_TO_TENSOR_LANDSCAPE_CONFIG);
            // SelfieSegmentationCpu: InferenceCalculator
            // The model returns a tensor with the following shape:
            // [1 (batch), 144, 256] or [1 (batch), 256, 256, 2] depending on modelType.
            const segmentationTensor = tf.tidy(
            // Slice activation output only.
            () => tf.slice(this.model.predict(imageValueShifted), [0, 0, 0, 1], -1));
            // SelfieSegmentationCpu: ImagePropertiesCalculator
            // Retrieves the size of the input image.
            const imageSize = (0, image_utils_1.getImageSize)(image);
            // SelfieSegmentationCpu: TensorsToSegmentationCalculator
            // Processes the output tensors into a segmentation mask that has the same
            // size as the input image into the graph.
            const maskImage = (0, tensors_to_segmentation_1.tensorsToSegmentation)(segmentationTensor, constants.SELFIE_SEGMENTATION_TENSORS_TO_SEGMENTATION_CONFIG, imageSize);
            // Grayscale to RGBA
            const rgbaMask = tf.tidy(() => {
                // tslint:disable-next-line: no-unnecessary-type-assertion
                const mask3D = tf.expandDims(maskImage, 2);
                const rgMask = tf.pad(mask3D, [[0, 0], [0, 0], [0, 1]]);
                return tf.mirrorPad(rgMask, [[0, 0], [0, 0], [0, 2]], 'symmetric');
            });
            tf.dispose([imageValueShifted]);
            return [{
                    maskValueToLabel,
                    mask: new MediaPipeSelfieSegmentationTfjsMask(rgbaMask)
                }];
        });
    }
    dispose() {
        this.model.dispose();
    }
    reset() { }
}
/**
 * Loads the MediaPipeSelfieSegmentationTfjs model.
 *
 * @param modelConfig ModelConfig object that contains parameters for
 * the MediaPipeSelfieSegmentationTfjs loading process. Please find more details
 * of each parameters in the documentation of the
 * `MediaPipeSelfieSegmentationTfjsModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, segmenter_utils_1.validateModelConfig)(modelConfig);
        const modelFromTFHub = (config.modelUrl.indexOf('https://tfhub.dev') > -1);
        const model = yield tfconv.loadGraphModel(config.modelUrl, { fromTFHub: modelFromTFHub });
        return new MediaPipeSelfieSegmentationTfjsSegmenter(config.modelType, model);
    });
}
exports.load = load;
