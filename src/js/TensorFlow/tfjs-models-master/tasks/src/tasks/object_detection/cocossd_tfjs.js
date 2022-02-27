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
exports.cocoSsdTfjsLoader = exports.CocoSsdTFJS = exports.CocoSsdTFJSLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const common_2 = require("./common");
/** Loader for cocossd TFJS model. */
class CocoSsdTFJSLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFJS COCO-SSD',
            description: 'Run COCO-SSD object detection model with TFJS',
            resourceUrls: {
                'github': 'https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd',
            },
            runtime: common_1.Runtime.TFJS,
            version: '2.2.2',
            supportedTasks: [common_1.Task.OBJECT_DETECTION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@${this.metadata.version}`]];
        this.sourceModelGlobalNamespace = 'cocoSsd';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const cocoSsdModel = yield sourceModelGlobal.load(loadingOptions);
            return new CocoSsdTFJS(cocoSsdModel, loadingOptions);
        });
    }
}
exports.CocoSsdTFJSLoader = CocoSsdTFJSLoader;
/**
 * Pre-trained TFJS coco-ssd model.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional).
 * //
 * // By default, it uses lite_mobilenet_v2 as the base model with webgl
 * // backend. You can change them in the `options` parameter of the `load`
 * // function (see below for docs).
 * const model = await tfTask.ObjectDetection.CocoSsd.TFJS.load();
 *
 * // Run detection on an image with options (optional).
 * const img = document.querySelector('img');
 * const result = await model.predict(img, {numMaxBoxes: 5});
 * console.log(result.objects);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * Refer to `tfTask.ObjectDetector` for the `predict` and `cleanUp` method.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol: 'CocoSsdTFJSLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'CocoSsdTFJSInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Object Detection', subheading: 'Models'}
 */
class CocoSsdTFJS extends common_2.ObjectDetector {
    constructor(cocoSsdModel, loadingOptions) {
        super();
        this.cocoSsdModel = cocoSsdModel;
        this.loadingOptions = loadingOptions;
    }
    predict(img, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cocoSsdModel) {
                throw new Error('source model is not loaded');
            }
            yield (0, common_1.ensureTFJSBackend)(this.loadingOptions);
            const cocoSsdResults = yield this.cocoSsdModel.detect(img, infereceOptions ? infereceOptions.maxNumBoxes : undefined, infereceOptions ? infereceOptions.minScore : undefined);
            const objects = cocoSsdResults.map(result => {
                return {
                    boundingBox: {
                        originX: result.bbox[0],
                        originY: result.bbox[1],
                        width: result.bbox[2],
                        height: result.bbox[3],
                    },
                    className: result.class,
                    score: result.score,
                };
            });
            const finalResult = {
                objects,
            };
            return finalResult;
        });
    }
    cleanUp() {
        if (!this.cocoSsdModel) {
            throw new Error('source model is not loaded');
        }
        return this.cocoSsdModel.dispose();
    }
}
exports.CocoSsdTFJS = CocoSsdTFJS;
exports.cocoSsdTfjsLoader = new CocoSsdTFJSLoader();
