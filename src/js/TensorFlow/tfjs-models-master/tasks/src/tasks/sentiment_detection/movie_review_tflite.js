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
exports.movieReviewTfliteLoader = exports.MovieReviewTFLite = exports.MovieReviewTFLiteLoader = void 0;
const task_model_1 = require("../../task_model");
const common_1 = require("../common");
const tflite_common_1 = require("../nl_classification/tflite_common");
const common_2 = require("./common");
const DEFAULT_THRESHOLD = 0.5;
/** Loader for cocossd TFLite model. */
class MovieReviewTFLiteLoader extends task_model_1.TaskModelLoader {
    constructor() {
        super(...arguments);
        this.metadata = {
            name: 'TFLite movie review model',
            description: 'Run a movie review model with TFLite and output ' +
                'the probabilities of whether the review is positive or negetive.',
            runtime: common_1.Runtime.TFLITE,
            version: '0.0.1-alpha.3',
            supportedTasks: [common_1.Task.SENTIMENT_DETECTION],
        };
        this.packageUrls = [[`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@${this.metadata.version}/dist/tf-tflite.min.js`]];
        this.sourceModelGlobalNamespace = 'tflite';
    }
    transformSourceModel(sourceModelGlobal, loadingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://storage.googleapis.com/tfweb/models/' +
                'movie_review_sentiment_classification.tflite';
            const tfliteNLClassifier = yield sourceModelGlobal.NLClassifier.create(url, (0, tflite_common_1.getNLClassifierOptions)());
            const threshold = loadingOptions && loadingOptions.threshold != null ?
                loadingOptions.threshold :
                DEFAULT_THRESHOLD;
            return new MovieReviewTFLite(tfliteNLClassifier, threshold);
        });
    }
}
exports.MovieReviewTFLiteLoader = MovieReviewTFLiteLoader;
/**
 * Pre-trained TFLite movie review sentiment detection model.
 *
 * It detects whether the review text is positive or negetive.
 *
 * Usage:
 *
 * ```js
 * // Load the model with options (optional).
 * const model = await tfTask.SentimentDetection.MovieReview.TFLite.load();
 *
 * // Run inference on a review text.
 * const result = await model.predict('This is a great movie!');
 * console.log(result.sentimentLabels);
 *
 * // Clean up.
 * model.cleanUp();
 * ```
 *
 * The model returns the prediction results of the following sentiment labels:
 *
 * - positive
 * - negative
 *
 * Refer to `tfTask.SentimentDetector` for the `predict` and `cleanUp` method,
 * and more details about the result interface.
 *
 * @docextratypes [
 *   {description: 'Options for `load`', symbol:
 * 'MovieReviewTFLiteLoadingOptions'},
 *   {description: 'Options for `predict`',
 * symbol: 'MovieReviewTFLiteInferenceOptions'}
 * ]
 *
 * @doc {heading: 'Sentiment Detection', subheading: 'Models'}
 */
class MovieReviewTFLite extends common_2.SentimentDetector {
    constructor(tfliteNLClassifier, threshold) {
        super();
        this.tfliteNLClassifier = tfliteNLClassifier;
        this.threshold = threshold;
    }
    predict(text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.tfliteNLClassifier) {
                throw new Error('source model is not loaded');
            }
            const tfliteResults = this.tfliteNLClassifier.classify(text);
            if (!tfliteResults) {
                return { sentimentLabels: {} };
            }
            const negativeProbability = tfliteResults[0].probability;
            const positiveProbability = tfliteResults[1].probability;
            let positiveResult = null;
            let negativeResult = null;
            if (Math.max(negativeProbability, positiveProbability) > this.threshold) {
                positiveResult = positiveProbability > negativeProbability;
                negativeResult = positiveProbability < negativeProbability;
            }
            return {
                sentimentLabels: {
                    'positive': {
                        result: positiveResult,
                        probabilities: [negativeProbability, positiveProbability],
                    },
                    'negative': {
                        result: negativeResult,
                        probabilities: [positiveProbability, negativeProbability],
                    }
                }
            };
        });
    }
}
exports.MovieReviewTFLite = MovieReviewTFLite;
exports.movieReviewTfliteLoader = new MovieReviewTFLiteLoader();
