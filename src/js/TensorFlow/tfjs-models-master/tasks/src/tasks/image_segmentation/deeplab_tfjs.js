"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
exports.deeplabTfjsLoader = exports.DeeplabTFJS = exports.DeeplapTFJSLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const common_2 = require("./common");
/** Loader for deeplab TFJS model. */
class DeeplapTFJSLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFJS Deeplab',
            description: 'Run deeplab image segmentation model with TFJS',
            resourceUrls: {
                'github': 'https://github.com/tensorflow/tfjs-models/tree/master/deeplab',
            },
            runtime: common_1.Runtime.TFJS,
            version: '0.2.1',
            supportedTasks: [common_1.Task.IMAGE_SEGMENTATION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow-models/deeplab@${this.metadata.version}`]];
        this.sourceModelGlobalNamespace = 'deeplab';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = Object.assign({}, loadingOptions) ||
                { backend: 'webgl' };
            if (options.base == null) {
                options.base = 'pascal';
            }
            if (options.quantizationBytes == null) {
                options.quantizationBytes = 2;
            }
            const deeplabModel = yield sourceModelGlobal.load(options);
            return new DeeplabTFJS(deeplabModel, options);
        });
    }
}
exports.DeeplapTFJSLoader = DeeplapTFJSLoader;
/**
 * Pre-trained TFJS depelab model.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional).
 * //
 * // By default, it uses base='pascal' and quantizationBytes=2 with webgl
 * // backend. You can change them in the options parameter of the `load`
 * // function (see below for docs).
 * const model = await tfTask.ImageSegmentation.Deeplab.TFJS.load();
 *
 * // Run inference on an image with options (optional).
 * const img = document.querySelector('img');
 * const result = await model.predict(img);
 * console.log(result);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * Refer to `tfTask.ImageSegmenter` for the `predict` and `cleanUp` method.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol: 'DeeplabTFJSLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'DeeplabTFJSInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Image Segmentation', subheading: 'Models'}
 */
class DeeplabTFJS extends common_2.ImageSegmenter {
    constructor(deeplabModel, loadingOptions) {
        super();
        this.deeplabModel = deeplabModel;
        this.loadingOptions = loadingOptions;
    }
    predict(img, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deeplabModel) {
                throw new Error('source model is not loaded');
            }
            yield (0, common_1.ensureTFJSBackend)(this.loadingOptions);
            const deeplabResult = yield this.deeplabModel.segment(img, infereceOptions);
            const legend = {};
            for (const name of Object.keys(deeplabResult.legend)) {
                const colors = deeplabResult.legend[name];
                legend[name] = {
                    r: colors[0],
                    g: colors[1],
                    b: colors[2],
                };
            }
            return {
                legend,
                width: deeplabResult.width,
                height: deeplabResult.height,
                segmentationMap: deeplabResult.segmentationMap,
            };
        });
    }
    cleanUp() {
        if (!this.deeplabModel) {
            throw new Error('source model is not loaded');
        }
        this.deeplabModel.dispose();
    }
}
exports.DeeplabTFJS = DeeplabTFJS;
exports.deeplabTfjsLoader = new DeeplapTFJSLoader();
