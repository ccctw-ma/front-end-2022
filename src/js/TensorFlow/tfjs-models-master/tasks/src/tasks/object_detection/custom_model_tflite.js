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
exports.objectDetectorCustomModelTfliteLoader = exports.ODCustomModelTFLite = exports.ObjectDetectionCustomModelTFLiteLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const tflite_common_1 = require("./tflite_common");
/** Loader for custom object detection TFLite model. */
class ObjectDetectionCustomModelTFLiteLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'Object detection with TFLite models',
            description: 'An object detector backed by the TFLite Task Library. ' +
                'It can work with any models that meet the ' +
                '<a href="https://www.tensorflow.org/lite/inference_with_metadata/' +
                'task_library/object_detector#model_compatibility_requirements" ' +
                'target="_blank">model requirements</a>. Try models from this ' +
                '<a href="https://tfhub.dev/tensorflow/collections/lite/task-library/' +
                'object-detector/1" target="_blank">collection</a>.',
            resourceUrls: {
                'TFLite task library': 'https://www.tensorflow.org/lite/' +
                    'inference_with_metadata/task_library/overview',
            },
            runtime: common_1.Runtime.TFLITE,
            version: '0.0.1-alpha.3',
            supportedTasks: [common_1.Task.OBJECT_DETECTION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@${this.metadata.version}/dist/tf-tflite.min.js`]];
        this.sourceModelGlobalNamespace = 'tflite';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const tfliteObjectDetector = yield sourceModelGlobal.ObjectDetector.create(loadingOptions.model, loadingOptions);
            return new ODCustomModelTFLite(tfliteObjectDetector);
        });
    }
}
exports.ObjectDetectionCustomModelTFLiteLoader = ObjectDetectionCustomModelTFLiteLoader;
/**
 * A custom TFLite object detection model loaded from a model url or an
 * `ArrayBuffer` in memory.
 *
 * The underlying object detector is built on top of the [TFLite Task
 * Library](https://www.tensorflow.org/lite/inference_with_metadata/task_library/overview).
 * As a result, the custom model needs to meet the [metadata
 * requirements](https://www.tensorflow.org/lite/inference_with_metadata/task_library/object_detector#model_compatibility_requirements).
 *
 * Usage:
 *
 * ```js
 * // Load the model from a custom url with other options (optional).
 * const model = await tfTask.ObjectDetection.CustomModel.TFLite.load({
 *   model:
 * 'https://tfhub.dev/tensorflow/lite-model/ssd_mobilenet_v1/1/metadata/2?lite-format=tflite',
 * });
 *
 * // Run inference on an image.
 * const img = document.querySelector('img');
 * const result = await model.predict(img);
 * console.log(result.objects);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * Refer to `tfTask.ObjectDetector` for the `predict` and `cleanUp` method.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol:
 * 'ODCustomModelTFLiteLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'ODCustomModelTFLiteInferenceOptions'}
 * ]
 *
 *
 * @doc {heading: 'Object Detection', subheading: 'Models'}
 */
class ODCustomModelTFLite extends tflite_common_1.ObjectDetectorTFLite {
}
exports.ODCustomModelTFLite = ODCustomModelTFLite;
exports.objectDetectorCustomModelTfliteLoader = new ObjectDetectionCustomModelTFLiteLoader();
