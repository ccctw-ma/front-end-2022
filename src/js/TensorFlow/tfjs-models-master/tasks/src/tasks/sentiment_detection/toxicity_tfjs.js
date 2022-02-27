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
exports.toxicityTfjsLoader = exports.ToxicityTFJS = exports.ToxicityTFJSLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const common_2 = require("./common");
/** Loader for toxicity TFJS model. */
class ToxicityTFJSLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFJS Toxicity model',
            description: 'Detect whether text contains toxic content such as ' +
                'threatening language, insults, obscenities, identity-based hate, ' +
                'or sexually explicit language.',
            resourceUrls: {
                'github': 'https://github.com/tensorflow/tfjs-models/tree/master/toxicity',
            },
            runtime: common_1.Runtime.TFJS,
            version: '1.2.2',
            supportedTasks: [common_1.Task.SENTIMENT_DETECTION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@${this.metadata.version}`]];
        this.sourceModelGlobalNamespace = 'toxicity';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const toxicityModel = yield sourceModelGlobal.load(loadingOptions && loadingOptions.threshold ? loadingOptions.threshold :
                0.85, loadingOptions && loadingOptions.toxicityLabels ?
                loadingOptions.toxicityLabels :
                []);
            return new ToxicityTFJS(toxicityModel, loadingOptions);
        });
    }
}
exports.ToxicityTFJSLoader = ToxicityTFJSLoader;
/**
 * Pre-trained TFJS toxicity model.
 *
 * It detects whether text contains toxic content such as threatening language,
 * insults, obscenities, identity-based hate, or sexually explicit language.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional. See below for docs).
 * const model = await tfTask.SentimentDetection.Toxicity.TFJS.load();
 *
 * // Run detection on text.
 * const result = await model.predict('You are stupid');
 * console.log(result.sentimentLabels);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * By default, the model returns the prediction results of the following
 * sentiment labels:
 *
 * - toxicity
 * - severe_toxicity
 * - identity_attack
 * - insult
 * - threat
 * - sexual_explicit
 * - obscene
 *
 * Refer to `tfTask.SentimentDetection` for the `predict` and `cleanUp` method,
 * and more details about the result interface.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol: 'ToxicityTFJSLoadingOptions'},
 *   {description: 'Options for `predict`', symbol:
 * 'ToxicityTFJSInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Sentiment Detection', subheading: 'Models'}
 */
class ToxicityTFJS extends common_2.SentimentDetector {
    constructor(toxicityModel, loadingOptions) {
        super();
        this.toxicityModel = toxicityModel;
        this.loadingOptions = loadingOptions;
    }
    predict(text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.toxicityModel) {
                throw new Error('source model is not loaded');
            }
            yield (0, common_1.ensureTFJSBackend)(this.loadingOptions);
            const toxicityResults = yield this.toxicityModel.classify(text);
            const sentimentLabels = {};
            for (const labelResult of toxicityResults) {
                sentimentLabels[labelResult.label] = {
                    result: labelResult.results[0].match,
                    probabilities: Array.from(labelResult.results[0].probabilities),
                };
            }
            return { sentimentLabels };
        });
    }
}
exports.ToxicityTFJS = ToxicityTFJS;
exports.toxicityTfjsLoader = new ToxicityTFJSLoader();
