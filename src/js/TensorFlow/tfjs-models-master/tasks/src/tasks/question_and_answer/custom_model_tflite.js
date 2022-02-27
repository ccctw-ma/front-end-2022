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
exports.qaCustomModelTfliteLoader = exports.QACustomModelTFLite = exports.QuestionAnswerCustomModelTFLiteLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const tflite_common_1 = require("./tflite_common");
/** Loader for custom Q&A TFLite model. */
class QuestionAnswerCustomModelTFLiteLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'Question&Answer with TFLite models',
            description: 'A QuestionAnswerer backed by the TFLite Task Library. ' +
                'It can work with any models that meet the ' +
                '<a href="https://www.tensorflow.org/lite/inference_with_metadata/' +
                'task_library/bert_question_answerer' +
                '#model_compatibility_requirements" ' +
                'target="_blank">model requirements</a>. Try models from this ' +
                '<a href="https://tfhub.dev/tensorflow/collections/lite/task-library/' +
                'bert-question-answerer/1" target="_blank">collection</a>.',
            resourceUrls: {
                'TFLite task library': 'https://www.tensorflow.org/lite/' +
                    'inference_with_metadata/task_library/overview',
            },
            runtime: common_1.Runtime.TFLITE,
            version: '0.0.1-alpha.3',
            supportedTasks: [common_1.Task.QUESTION_AND_ANSWER],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@${this.metadata.version}/dist/tf-tflite.min.js`]];
        this.sourceModelGlobalNamespace = 'tflite';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const tfliteQa = yield sourceModelGlobal.BertQuestionAnswerer.create(loadingOptions.model);
            return new QACustomModelTFLite(tfliteQa);
        });
    }
}
exports.QuestionAnswerCustomModelTFLiteLoader = QuestionAnswerCustomModelTFLiteLoader;
/**
 * A custom TFLite Q&A model loaded from a model url or an `ArrayBuffer` in
 * memory.
 *
 * The underlying question answerer is built on top of the [TFLite Task
 * Library](https://www.tensorflow.org/lite/inference_with_metadata/task_library/overview).
 * As a result, the custom model needs to meet the [metadata
 * requirements](https://www.tensorflow.org/lite/inference_with_metadata/task_library/bert_question_answerer#model_compatibility_requirements).
 *
 * Usage:
 *
 * ```js
 * // Load the model from a custom url.
 * const model = await tfTask.QuestionAndAnswer.CustomModel.TFLite.load({
 *   model:
 * 'https://tfhub.dev/tensorflow/lite-model/mobilebert/1/metadata/1?lite-format=tflite',
 * });
 *
 * // Run inference with question and context.
 * const result = await model.predict(question, context);
 * console.log(result.answers);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * Refer to `tfTask.QuestionAnswerer` for the `predict` and `cleanUp` method.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol:
 * 'QACustomModelTFLiteLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'QACustomModelTFLiteInferenceOptions'}
 * ]
 *
 *
 * @doc {heading: 'Question & Answer', subheading: 'Models'}
 */
class QACustomModelTFLite extends tflite_common_1.QuestionAnswererTFLite {
}
exports.QACustomModelTFLite = QACustomModelTFLite;
exports.qaCustomModelTfliteLoader = new QuestionAnswerCustomModelTFLiteLoader();
