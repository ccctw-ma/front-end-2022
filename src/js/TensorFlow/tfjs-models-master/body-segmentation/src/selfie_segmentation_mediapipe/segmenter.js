"use strict";
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
const selfieSegmentation = __importStar(require("@mediapipe/selfie_segmentation"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const mask_util_1 = require("../shared/calculators/mask_util");
const segmenter_utils_1 = require("./segmenter_utils");
class MediaPipeSelfieSegmentationMediaPipeMask {
    constructor(mask) {
        this.mask = mask;
    }
    toCanvasImageSource() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mask;
        });
    }
    toImageData() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toImageDataLossy)(this.mask);
        });
    }
    toTensor() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toTensorLossy)(this.mask);
        });
    }
    getUnderlyingType() {
        return 'canvasimagesource';
    }
}
function maskValueToLabel(maskValue) {
    (0, mask_util_1.assertMaskValue)(maskValue);
    return 'person';
}
/**
 * MediaPipe segmenter class.
 */
class MediaPipeSelfieSegmentationMediaPipeSegmenter {
    // Should not be called outside.
    constructor(config) {
        this.selfieMode = false;
        this.selfieSegmentationSolution =
            new selfieSegmentation.SelfieSegmentation({
                locateFile: (path, base) => {
                    if (config.solutionPath) {
                        const solutionPath = config.solutionPath.replace(/\/+$/, '');
                        return `${solutionPath}/${path}`;
                    }
                    return `${base}/${path}`;
                }
            });
        let modelSelection;
        switch (config.modelType) {
            case 'landscape':
                modelSelection = 1;
                break;
            case 'general':
            default:
                modelSelection = 0;
                break;
        }
        this.selfieSegmentationSolution.setOptions({
            modelSelection,
            selfieMode: this.selfieMode,
        });
        this.selfieSegmentationSolution.onResults((results) => {
            this.segmentation = [{
                    maskValueToLabel,
                    mask: new MediaPipeSelfieSegmentationMediaPipeMask(results.segmentationMask)
                }];
        });
    }
    /**
     * Segment people found in an image or video frame.
     *
     * It returns a single segmentation which contains all the detected people
     * in the input.
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config Optional.
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     * @return An array of one `Segmentation`.
     */
    segmentPeople(input, segmentationConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (segmentationConfig && segmentationConfig.flipHorizontal &&
                (segmentationConfig.flipHorizontal !== this.selfieMode)) {
                this.selfieMode = segmentationConfig.flipHorizontal;
                this.selfieSegmentationSolution.setOptions({
                    selfieMode: this.selfieMode,
                });
            }
            // Cast to GL TexImageSource types.
            input = input instanceof tf.Tensor ?
                new ImageData(yield tf.browser.toPixels(input), input.shape[1], input.shape[0]) :
                input;
            yield this.selfieSegmentationSolution.send({ image: input });
            return this.segmentation;
        });
    }
    dispose() {
        this.selfieSegmentationSolution.close();
    }
    reset() {
        this.selfieSegmentationSolution.reset();
        this.segmentation = null;
        this.selfieMode = false;
    }
    initialize() {
        return this.selfieSegmentationSolution.initialize();
    }
}
/**
 * Loads the MediaPipe solution.
 *
 * @param modelConfig An object that contains parameters for
 * the MediaPipeSelfieSegmentation loading process. Please find more details of
 * each parameters in the documentation of the
 * `MediaPipeSelfieSegmentationMediaPipeModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, segmenter_utils_1.validateModelConfig)(modelConfig);
        const segmenter = new MediaPipeSelfieSegmentationMediaPipeSegmenter(config);
        yield segmenter.initialize();
        return segmenter;
    });
}
exports.load = load;
