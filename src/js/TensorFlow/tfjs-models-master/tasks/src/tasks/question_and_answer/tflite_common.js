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
exports.QuestionAnswererTFLite = void 0;
const common_1 = require("./common");
/**
 * The base class for all Q&A TFLite models.
 *
 * @template T The type of inference options.
 */
class QuestionAnswererTFLite extends common_1.QuestionAnswerer {
    constructor(tfliteQuestionAnswerer) {
        super();
        this.tfliteQuestionAnswerer = tfliteQuestionAnswerer;
    }
    predict(question, context, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.tfliteQuestionAnswerer) {
                throw new Error('source model is not loaded');
            }
            // In TFLite task library, context is the first parameter.
            const tfliteResults = this.tfliteQuestionAnswerer.answer(context, question);
            const answers = tfliteResults.map(result => {
                return {
                    text: result.text,
                    startIndex: result.pos.start,
                    endIndex: result.pos.end,
                    score: result.pos.logit,
                };
            });
            return { answers };
        });
    }
    cleanUp() {
        if (!this.tfliteQuestionAnswerer) {
            throw new Error('source model is not loaded');
        }
        this.tfliteQuestionAnswerer.cleanUp();
    }
}
exports.QuestionAnswererTFLite = QuestionAnswererTFLite;
