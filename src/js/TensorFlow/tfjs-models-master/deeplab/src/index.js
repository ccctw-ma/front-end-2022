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
exports.SemanticSegmentation = exports.load = exports.toSegmentationImage = exports.getURL = exports.getLabels = exports.getColormap = exports.version = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const utils_1 = require("./utils");
Object.defineProperty(exports, "getColormap", { enumerable: true, get: function () { return utils_1.getColormap; } });
Object.defineProperty(exports, "getLabels", { enumerable: true, get: function () { return utils_1.getLabels; } });
Object.defineProperty(exports, "getURL", { enumerable: true, get: function () { return utils_1.getURL; } });
Object.defineProperty(exports, "toSegmentationImage", { enumerable: true, get: function () { return utils_1.toSegmentationImage; } });
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
/**
 * Initializes the DeepLab model and returns a `SemanticSegmentation` object.
 *
 * @param input ::
 *     `ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement`
 *
 *  The input image to feed through the network.
 *
 * @param config :: `ModelConfig`
 *
 * The configuration for the model with any of the following attributes:
 *
 *   * quantizationBytes (optional) :: `QuantizationBytes`
 *
 *      The degree to which weights are quantized (either 1, 2 or 4).
 *      Setting this attribute to 1 or 2 will load the model with int32 and
 *      float32 compressed to 1 or 2 bytes respectively.
 *      Set it to 4 to disable quantization.
 *
 *   * base (optional) :: `ModelArchitecture`
 *
 *      The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 *   * modelUrl (optional) :: `string`
 *
 *      The URL from which to load the TF.js GraphModel JSON.
 *      Inferred from `base` and `quantizationBytes` if undefined.
 *
 * @return The initialized `SemanticSegmentation` object
 */
function load(modelConfig = {
    base: 'pascal',
    quantizationBytes: 2
}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tf == null) {
            throw new Error(`Cannot find TensorFlow.js.` +
                ` If you are using a <script> tag, please ` +
                `also include @tensorflow/tfjs on the page before using this model.`);
        }
        if (modelConfig.base) {
            if (['pascal', 'cityscapes', 'ade20k'].indexOf(modelConfig.base) === -1) {
                throw new Error(`SemanticSegmentation cannot be constructed ` +
                    `with an invalid base model ${modelConfig.base}. ` +
                    `Try one of 'pascal', 'cityscapes' and 'ade20k'.`);
            }
            if ([1, 2, 4].indexOf(modelConfig.quantizationBytes) === -1) {
                throw new Error(`Only quantization to 1, 2 or 4 bytes is supported.`);
            }
        }
        else if (!modelConfig.modelUrl) {
            throw new Error(`SemanticSegmentation can be constructed either by passing ` +
                `the weights URL or one of the supported base model names from ` +
                `'pascal', 'cityscapes' and 'ade20k',` +
                `together with the degree of quantization (either 1, 2 or 4).` +
                `Aborting, since neither has been provided.`);
        }
        const graphModel = yield tfconv.loadGraphModel(modelConfig.modelUrl ||
            (0, utils_1.getURL)(modelConfig.base, modelConfig.quantizationBytes));
        const deeplab = new SemanticSegmentation(graphModel, modelConfig.base);
        return deeplab;
    });
}
exports.load = load;
class SemanticSegmentation {
    constructor(graphModel, base) {
        this.model = graphModel;
        this.base = base;
    }
    /**
     * Segments an arbitrary image and generates a two-dimensional tensor with
     * class labels assigned to each cell of the grid overlayed on the image ( the
     * maximum number of cells on the side is fixed to 513).
     *
     * @param input ::
     *     `ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement`
     *
     * The input image to segment.
     *
     * @return rawSegmentationMap :: `tf.Tensor2D`
     *
     * The segmentation map of the image
     */
    predict(input) {
        return tf.tidy(() => {
            const data = tf.cast((0, utils_1.toInputTensor)(input), 'int32');
            return tf.squeeze(this.model.execute(data));
        });
    }
    /**
     * Segments an arbitrary image and generates a two-dimensional tensor with
     * class labels assigned to each cell of the grid overlayed on the image ( the
     * maximum number of cells on the side is fixed to 513).
     *
     * @param image :: `ImageData | HTMLImageElement | HTMLCanvasElement |
     * HTMLVideoElement | tf.Tensor3D`;
     *
     *   The image to segment
     *
     * @param config (optional) The configuration object for the segmentation:
     *
     * - **config.canvas** (optional) :: `HTMLCanvasElement`
     *
     *   The canvas where to draw the output
     *
     * - **config.colormap** (optional) :: `[number, number, number][]`
     *
     *   The array of RGB colors corresponding to labels
     *
     * - **config.labels** (optional) :: `string[]`
     *
     *   The array of names corresponding to labels
     *
     *   By [default](./src/index.ts#L81), `colormap` and `labels` are set
     * according to the `base` model attribute passed during initialization.
     *
     * @returns A promise of a `DeepLabOutput` object, with four attributes:
     *
     * - **legend** :: `{ [name: string]: [number, number, number] }`
     *
     *   The legend is a dictionary of objects recognized in the image and their
     *   colors in RGB format.
     *
     * - **height** :: `number`
     *
     *   The height of the returned segmentation map
     *
     * - **width** :: `number`
     *
     *   The width of the returned segmentation map
     *
     * - **segmentationMap** :: `Uint8ClampedArray`
     *
     *   The colored segmentation map as `Uint8ClampedArray` which can be
     *   fed into `ImageData` and mapped to a canvas.
     */
    segment(input, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((config.colormap && config.labels) || this.base)) {
                throw new Error(`Calling the 'segment' method requires either the 'base'` +
                    ` attribute to be defined ` +
                    `(e.g. 'pascal', 'cityscapes' or'ade20k'),` +
                    ` or 'colormap' and 'labels' options to be set. ` +
                    `Aborting, since neither has been provided.`);
            }
            else if (!(config.colormap && config.labels)) {
                config.colormap = (0, utils_1.getColormap)(this.base);
                config.labels = (0, utils_1.getLabels)(this.base);
            }
            const { colormap, labels, canvas } = config;
            const rawSegmentationMap = tf.tidy(() => this.predict(input));
            const [height, width] = rawSegmentationMap.shape;
            const { legend, segmentationMap } = yield (0, utils_1.toSegmentationImage)(colormap, labels, rawSegmentationMap, canvas);
            tf.dispose(rawSegmentationMap);
            return { legend, height, width, segmentationMap };
        });
    }
    /**
     * Dispose of the tensors allocated by the model.
     * You should call this when you are done with the model.
     */
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.model) {
                this.model.dispose();
            }
        });
    }
}
exports.SemanticSegmentation = SemanticSegmentation;
