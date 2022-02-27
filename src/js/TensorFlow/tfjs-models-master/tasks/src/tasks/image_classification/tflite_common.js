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
exports.ImageClassifierTFLite = void 0;
const common_1 = require("./common");
/**
 * The base class for all image classification TFLite models.
 *
 * @template T The type of inference options.
 */
class ImageClassifierTFLite extends common_1.ImageClassifier {
    constructor(tfliteImageClassifier) {
        super();
        this.tfliteImageClassifier = tfliteImageClassifier;
    }
    predict(img, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.tfliteImageClassifier) {
                throw new Error('source model is not loaded');
            }
            const tfliteResults = this.tfliteImageClassifier.classify(img);
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
        if (!this.tfliteImageClassifier) {
            throw new Error('source model is not loaded');
        }
        this.tfliteImageClassifier.cleanUp();
    }
}
exports.ImageClassifierTFLite = ImageClassifierTFLite;
