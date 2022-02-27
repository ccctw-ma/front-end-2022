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
exports.bertQaTfjsLoader = exports.BertQATFJS = exports.BertQATFJSLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const common_2 = require("./common");
/** Loader for Q&A TFJS model. */
class BertQATFJSLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFJS Bert Q&A model',
            description: 'Run Bert Q&A model with TFJS',
            resourceUrls: {
                'github': 'https://github.com/tensorflow/tfjs-models/tree/master/qna',
            },
            runtime: common_1.Runtime.TFJS,
            version: '1.0.0',
            supportedTasks: [common_1.Task.QUESTION_AND_ANSWER],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow-models/qna@${this.metadata.version}`]];
        this.sourceModelGlobalNamespace = 'qna';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let modelConfig = null;
            if (loadingOptions && loadingOptions.modelUrl) {
                modelConfig = { modelUrl: loadingOptions.modelUrl };
            }
            if (loadingOptions && loadingOptions.fromTFHub != null && modelConfig) {
                modelConfig.fromTFHub = loadingOptions.fromTFHub;
            }
            const bertQaModel = yield sourceModelGlobal.load(modelConfig);
            return new BertQATFJS(bertQaModel, loadingOptions);
        });
    }
}
exports.BertQATFJSLoader = BertQATFJSLoader;
/**
 * Pre-trained TFJS Bert Q&A model.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional).
 * const model = await tfTask.QuestionAndAnswer.BertQA.TFJS.load();
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
 *   {description: 'Options for `load`', symbol: 'BertQATFJSLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'BertQATFJSInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Question & Answer', subheading: 'Models'}
 */
class BertQATFJS extends common_2.QuestionAnswerer {
    constructor(qnaModel, loadingOptions) {
        super();
        this.qnaModel = qnaModel;
        this.loadingOptions = loadingOptions;
    }
    predict(question, context, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.qnaModel) {
                throw new Error('source model is not loaded');
            }
            yield (0, common_1.ensureTFJSBackend)(this.loadingOptions);
            const qnaResults = yield this.qnaModel.findAnswers(question, context);
            return { answers: qnaResults };
        });
    }
}
exports.BertQATFJS = BertQATFJS;
exports.bertQaTfjsLoader = new BertQATFJSLoader();
