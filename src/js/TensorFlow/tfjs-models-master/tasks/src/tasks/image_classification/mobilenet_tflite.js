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
exports.mobilenetTfliteLoader = exports.MobilenetTFLite = exports.MobilenetTFLiteLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const tflite_common_1 = require("./tflite_common");
/** Loader for mobilenet TFLite model. */
class MobilenetTFLiteLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFLite Mobilenet',
            description: 'Run mobilenet image classification model with TFLite',
            runtime: common_1.Runtime.TFLITE,
            version: '0.0.1-alpha.3',
            supportedTasks: [common_1.Task.IMAGE_CLASSIFICATION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@${this.metadata.version}/dist/tf-tflite.min.js`]];
        this.sourceModelGlobalNamespace = 'tflite';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            // Construct the mobilenet model url from version and alpha.
            let mobilenetVersion = '1';
            let mobilenetAlpha = '1.0';
            if (loadingOptions) {
                if (loadingOptions.version !== undefined) {
                    mobilenetVersion = String(loadingOptions.version);
                }
                if (loadingOptions.alpha !== undefined) {
                    mobilenetAlpha = String(loadingOptions.alpha);
                }
            }
            // There is no TFLite mobilenet v2 model available other than 2_1.0.
            if (mobilenetVersion === '2' && mobilenetAlpha !== '1.0') {
                mobilenetAlpha = '1.0';
                console.warn(`No mobilenet TFLite model available for ${mobilenetVersion}_${mobilenetAlpha}. Using 2_1.0 instead.`);
            }
            // TODO: use TFHub url when CORS is correctly set.
            const url = `https://storage.googleapis.com/tfweb/models/mobilenet_v${mobilenetVersion}_${mobilenetAlpha}_224_1_metadata_1.tflite`;
            const tfliteImageClassifier = yield sourceModelGlobal.ImageClassifier.create(url, loadingOptions);
            return new MobilenetTFLite(tfliteImageClassifier);
        });
    }
}
exports.MobilenetTFLiteLoader = MobilenetTFLiteLoader;
/**
 * Pre-trained TFLite mobilenet image classification model.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional).
 * //
 * // By default, it uses mobilenet V1. You can change it in the options
 * // parameter of the `load` function (see below for docs).
 * const model = await tfTask.ImageClassification.Mobilenet.TFJS.load();
 *
 * // Run inference on an image.
 * const img = document.querySelector('img');
 * const result = await model.predict(img);
 * console.log(result.classes);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * Refer to `tfTask.ImageClassifier` for the `predict` and `cleanUp` method.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol:
 * 'MobilenetTFLiteLoadingOptions'},
 *   {description: 'Options for `predict`',
 * symbol: 'MobilenetTFLiteInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Image Classification', subheading: 'Models'}
 */
class MobilenetTFLite extends tflite_common_1.ImageClassifierTFLite {
}
exports.MobilenetTFLite = MobilenetTFLite;
exports.mobilenetTfliteLoader = new MobilenetTFLiteLoader();
