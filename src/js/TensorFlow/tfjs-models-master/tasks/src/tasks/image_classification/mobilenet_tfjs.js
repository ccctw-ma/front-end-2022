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
exports.mobilenetTfjsLoader = exports.MobilenetTFJS = exports.MobilenetTFJSLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const common_2 = require("./common");
/** Loader for mobilenet TFJS model. */
class MobilenetTFJSLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFJS Mobilenet',
            description: 'Run mobilenet image classification model with TFJS',
            resourceUrls: {
                'github': 'https://github.com/tensorflow/tfjs-models/tree/master/mobilenet',
            },
            runtime: common_1.Runtime.TFJS,
            version: '2.1.0',
            supportedTasks: [common_1.Task.IMAGE_CLASSIFICATION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@${this.metadata.version}`]];
        this.sourceModelGlobalNamespace = 'mobilenet';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const mobilenetModel = yield sourceModelGlobal.load(loadingOptions);
            return new MobilenetTFJS(mobilenetModel, loadingOptions);
        });
    }
}
exports.MobilenetTFJSLoader = MobilenetTFJSLoader;
/**
 * Pre-trained TFJS mobilenet model.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional).
 * //
 * // By default, it uses mobilenet V1 with webgl backend. You can change them
 * // in the options parameter of the `load` function (see below for docs).
 * const model = await tfTask.ImageClassification.Mobilenet.TFJS.load();
 *
 * // Run inference on an image with options (optional).
 * const img = document.querySelector('img');
 * const result = await model.predict(img, {topK: 5});
 * console.log(result.classes);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * Refer to `tfTask.ImageClassifier` for the `predict` and `cleanUp` method.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol: 'MobilenetTFJSLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'MobilenetTFJSInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Image Classification', subheading: 'Models'}
 */
class MobilenetTFJS extends common_2.ImageClassifier {
    constructor(mobilenetModel, loadingOptions) {
        super();
        this.mobilenetModel = mobilenetModel;
        this.loadingOptions = loadingOptions;
    }
    predict(img, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mobilenetModel) {
                throw new Error('source model is not loaded');
            }
            yield (0, common_1.ensureTFJSBackend)(this.loadingOptions);
            const mobilenetResults = yield this.mobilenetModel.classify(img, infereceOptions ? infereceOptions.topK : undefined);
            const classes = mobilenetResults.map(result => {
                return {
                    className: result.className,
                    score: result.probability,
                };
            });
            const finalResult = {
                classes,
            };
            return finalResult;
        });
    }
}
exports.MobilenetTFJS = MobilenetTFJS;
exports.mobilenetTfjsLoader = new MobilenetTFJSLoader();
