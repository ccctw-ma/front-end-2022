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
exports.getNLClassifierOptions = exports.NLClassifierTFLite = void 0;
const common_1 = require("./common");
/**
 * The base class for all NL classification TFLite models.
 *
 * @template T The type of inference options.
 */
class NLClassifierTFLite extends common_1.NLClassifier {
    constructor(tfliteNLClassifier) {
        super();
        this.tfliteNLClassifier = tfliteNLClassifier;
    }
    predict(text, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.tfliteNLClassifier) {
                throw new Error('source model is not loaded');
            }
            const tfliteResults = this.tfliteNLClassifier.classify(text);
            if (!tfliteResults) {
                return { classes: [] };
            }
            const classes = tfliteResults.map(result => {
                return {
                    className: result.className,
                    score: result.probability,
                };
            });
            const finalResult = { classes };
            return finalResult;
        });
    }
    cleanUp() {
        if (!this.tfliteNLClassifier) {
            throw new Error('source model is not loaded');
        }
        this.tfliteNLClassifier.cleanUp();
    }
}
exports.NLClassifierTFLite = NLClassifierTFLite;
/** Merges the given options with the default NLClassifier options. */
function getNLClassifierOptions(options) {
    const nlclassifierOptions = {
        inputTensorIndex: 0,
        outputScoreTensorIndex: 0,
        outputLabelTensorIndex: -1,
        inputTensorName: 'INPUT',
        outputScoreTensorName: 'OUTPUT_SCORE',
        outputLabelTensorName: 'OUTPUT_LABEL',
    };
    if (!options) {
        return nlclassifierOptions;
    }
    if (options.inputTensorIndex != null) {
        nlclassifierOptions.inputTensorIndex = options.inputTensorIndex;
    }
    if (options.outputScoreTensorIndex != null) {
        nlclassifierOptions.outputScoreTensorIndex = options.outputScoreTensorIndex;
    }
    if (options.outputLabelTensorIndex != null) {
        nlclassifierOptions.outputLabelTensorIndex = options.outputLabelTensorIndex;
    }
    if (options.inputTensorName != null) {
        nlclassifierOptions.inputTensorName = options.inputTensorName;
    }
    if (options.outputScoreTensorName != null) {
        nlclassifierOptions.outputScoreTensorName = options.outputScoreTensorName;
    }
    if (options.outputLabelTensorName != null) {
        nlclassifierOptions.outputLabelTensorName = options.outputLabelTensorName;
    }
    return nlclassifierOptions;
}
exports.getNLClassifierOptions = getNLClassifierOptions;
