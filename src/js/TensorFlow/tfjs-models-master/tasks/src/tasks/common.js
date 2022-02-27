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
exports.ensureTFJSBackend = exports.getTFJSModelDependencyPackages = exports.Runtime = exports.Task = exports.DEFAULT_TFJS_VERSION = exports.DEFAULT_TFJS_BACKEND = void 0;
const utils_1 = require("../utils");
/** Default TFJS backend. */
exports.DEFAULT_TFJS_BACKEND = 'webgl';
/** Default TFJS version. */
exports.DEFAULT_TFJS_VERSION = '3.6.0';
/** All supported tasks. */
var Task;
(function (Task) {
    Task["IMAGE_CLASSIFICATION"] = "IMAGE_CLASSIFICATION";
    Task["OBJECT_DETECTION"] = "OBJECT_DETECTION";
    Task["IMAGE_SEGMENTATION"] = "IMAGE_SEGMENTATION";
    Task["SENTIMENT_DETECTION"] = "SENTIMENT_DETECTION";
    Task["NL_CLASSIFICATION"] = "NL_CLASSIFICATION";
    Task["QUESTION_AND_ANSWER"] = "QUESTION_AND_ANSWER";
})(Task = exports.Task || (exports.Task = {}));
/** All supported runtimes. */
var Runtime;
(function (Runtime) {
    Runtime["TFJS"] = "TFJS";
    Runtime["TFLITE"] = "TFLite";
    Runtime["MEDIA_PIPE"] = "MediaPipe";
})(Runtime = exports.Runtime || (exports.Runtime = {}));
/** A helper function to get the TFJS packages that a TFJS model depends on. */
function getTFJSModelDependencyPackages(backend = exports.DEFAULT_TFJS_BACKEND, version = exports.DEFAULT_TFJS_VERSION) {
    const packages = [
        [`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@${version}`],
        [`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@${version}`],
    ];
    switch (backend) {
        case 'cpu':
            packages[1].push(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu@${version}`);
            break;
        case 'webgl':
            packages[1].push(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@${version}`);
            break;
        case 'wasm':
            packages[1].push(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${version}/dist/tf-backend-wasm.min.js`);
            break;
        default:
            console.warn('WARNING', `Backend '${backend}' not supported. Use 'webgl' as the default.`);
            packages[1].push(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@${version}`);
            break;
    }
    return packages;
}
exports.getTFJSModelDependencyPackages = getTFJSModelDependencyPackages;
/**
 * Makes sure the current tfjs backend matches the one in the given option.
 *
 * For TFJS models, this function should be called at the loading time as well
 * as before running inference.
 *
 * Users might run multiple TFJS models with different backend options in a web
 * app. Only setting the backend at the model loading time is not enough because
 * the backend might be set to another one when loading a different model. We
 * also need to call this right before running the inference.
 */
function ensureTFJSBackend(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const backend = options ? options.backend : exports.DEFAULT_TFJS_BACKEND;
        // tslint:disable-next-line:no-any
        const global = (0, utils_1.isWebWorker)() ? self : window;
        const tf = global['tf'];
        if (!tf) {
            throw new Error('tfjs not loaded');
        }
        if (tf.getBackend() !== backend) {
            yield tf.setBackend(backend);
        }
    });
}
exports.ensureTFJSBackend = ensureTFJSBackend;
