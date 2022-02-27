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
exports.toSegmentationImage = exports.toInputTensor = exports.getLabels = exports.getColormap = exports.getURL = exports.createPascalColormap = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const config_1 = require("./config");
function createPascalColormap() {
    /**
     * Generates the colormap matching the Pascal VOC dev guidelines.
     * The original implementation in Python: https://git.io/fjgw5
     */
    const pascalColormapMaxEntriesNum = config_1.config['DATASET_MAX_ENTRIES']['PASCAL'];
    const colormap = new Array(pascalColormapMaxEntriesNum);
    for (let idx = 0; idx < pascalColormapMaxEntriesNum; ++idx) {
        colormap[idx] = new Array(3);
    }
    for (let shift = 7; shift > 4; --shift) {
        const indexShift = 3 * (7 - shift);
        for (let channel = 0; channel < 3; ++channel) {
            for (let idx = 0; idx < pascalColormapMaxEntriesNum; ++idx) {
                colormap[idx][channel] |= ((idx >> (channel + indexShift)) & 1)
                    << shift;
            }
        }
    }
    return colormap;
}
exports.createPascalColormap = createPascalColormap;
/**
 * Returns
 *
 * @param base  :: `ModelArchitecture`
 *
 * The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 * @param quantizationBytes (optional) :: `QuantizationBytes`
 *
 * The degree to which weights are quantized (either 1, 2 or 4).
 * Setting this attribute to 1 or 2 will load the model with int32 and
 * float32 compressed to 1 or 2 bytes respectively.
 * Set it to 4 to disable quantization.
 *
 * @return The URL of the TF.js model
 */
function getURL(base, quantizationBytes) {
    const TFHUB_BASE = `${config_1.config['BASE_PATH']}`;
    const TFHUB_QUERY_PARAM = 'tfjs-format=file';
    const modelPath = quantizationBytes === 4 ?
        `${base}/1/default/1/model.json` :
        `${base}/1/quantized/${quantizationBytes}/1/model.json`;
    // Example of url that should be generated.
    // https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/default/1/model.json?tfjs-format=file
    return `${TFHUB_BASE}/${modelPath}?${TFHUB_QUERY_PARAM}`;
}
exports.getURL = getURL;
/**
 * @param base  :: `ModelArchitecture`
 *
 * The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 * @return colormap :: `[number, number, number][]`
 *
 * The list of colors in RGB format, represented as arrays and corresponding
 * to labels.
 */
function getColormap(base) {
    if (base === 'pascal') {
        return config_1.config['COLORMAPS']['PASCAL'];
    }
    else if (base === 'ade20k') {
        return config_1.config['COLORMAPS']['ADE20K'];
    }
    else if (base === 'cityscapes') {
        return config_1.config['COLORMAPS']['CITYSCAPES'];
    }
    throw new Error(`SemanticSegmentation cannot be constructed ` +
        `with an invalid base model ${base}. ` +
        `Try one of 'pascal', 'cityscapes' and 'ade20k'.`);
}
exports.getColormap = getColormap;
/**
 * @param base  :: `ModelArchitecture`
 *
 * The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 * @return labellingScheme :: `string[]`
 *
 * The list with verbal descriptions of labels
 */
function getLabels(base) {
    if (base === 'pascal') {
        return config_1.config['LABELS']['PASCAL'];
    }
    else if (base === 'ade20k') {
        return config_1.config['LABELS']['ADE20K'];
    }
    else if (base === 'cityscapes') {
        return config_1.config['LABELS']['CITYSCAPES'];
    }
    throw new Error(`SemanticSegmentation cannot be constructed ` +
        `with an invalid base model ${base}. ` +
        `Try one of 'pascal', 'cityscapes' and 'ade20k'.`);
}
exports.getLabels = getLabels;
/**
 * @param input  ::
 * `ImageData|HTMLImageElement|HTMLCanvasElement| HTMLVideoElement|tf.Tensor3D`
 *
 * The input image to prepare for segmentation.
 *
 * @return resizedInput :: `string[]`
 *
 * The input tensor to run through the model.
 */
function toInputTensor(input) {
    return tf.tidy(() => {
        const image = input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
        const [height, width] = image.shape;
        const resizeRatio = config_1.config['CROP_SIZE'] / Math.max(width, height);
        const targetHeight = Math.round(height * resizeRatio);
        const targetWidth = Math.round(width * resizeRatio);
        return tf.expandDims(tf.image.resizeBilinear(image, [targetHeight, targetWidth]));
    });
}
exports.toInputTensor = toInputTensor;
/**
 * @param colormap :: `Color[]`
 *
 * The list of colors in RGB format, represented as arrays and corresponding
 * to labels.
 *
 * @param labellingScheme :: `string[]`
 *
 * The list with verbal descriptions of labels
 *
 * @param rawSegmentationMap :: `tf.Tensor2D`
 *
 * The segmentation map of the image
 *
 * @param canvas (optional) :: `HTMLCanvasElement`
 *
 * The canvas where to draw the output
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
function toSegmentationImage(colormap, labelNames, rawSegmentationMap, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        if (colormap.length < labelNames.length) {
            throw new Error('The colormap must be expansive enough to encode each label. ' +
                `Aborting, since the given colormap has length ${colormap.length}, ` +
                `but there are ${labelNames.length} labels.`);
        }
        const [height, width] = rawSegmentationMap.shape;
        const segmentationImageBuffer = tf.buffer([height, width, 3], 'int32');
        const mapData = yield rawSegmentationMap.array();
        const labels = new Set();
        for (let columnIndex = 0; columnIndex < height; ++columnIndex) {
            for (let rowIndex = 0; rowIndex < width; ++rowIndex) {
                const label = mapData[columnIndex][rowIndex];
                labels.add(label);
                segmentationImageBuffer.set(colormap[label][0], columnIndex, rowIndex, 0);
                segmentationImageBuffer.set(colormap[label][1], columnIndex, rowIndex, 1);
                segmentationImageBuffer.set(colormap[label][2], columnIndex, rowIndex, 2);
            }
        }
        const segmentationImageTensor = segmentationImageBuffer.toTensor();
        const segmentationMap = yield tf.browser.toPixels(segmentationImageTensor, canvas);
        tf.dispose(segmentationImageTensor);
        const legend = {};
        for (const label of Array.from(labels)) {
            legend[labelNames[label]] = colormap[label];
        }
        return { legend, segmentationMap };
    });
}
exports.toSegmentationImage = toSegmentationImage;
