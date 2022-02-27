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
exports.ImageSegmenterTFLite = void 0;
const common_1 = require("./common");
/**
 * The base class for all image segmentation TFLite models.
 *
 * @template T The type of inference options.
 */
class ImageSegmenterTFLite extends common_1.ImageSegmenter {
    constructor(tfliteImageSegmenter) {
        super();
        this.tfliteImageSegmenter = tfliteImageSegmenter;
    }
    predict(img, infereceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.tfliteImageSegmenter) {
                throw new Error('source model is not loaded');
            }
            const tfliteResults = this.tfliteImageSegmenter.segment(img);
            if (!tfliteResults) {
                return {
                    legend: {},
                    width: -1,
                    height: -1,
                    segmentationMap: undefined,
                };
            }
            const segmentation = tfliteResults[0];
            const legend = {};
            const colors = [];
            for (const coloredLabel of segmentation.coloredLabels) {
                legend[coloredLabel.className || coloredLabel.displayName] = coloredLabel;
                colors.push(coloredLabel);
            }
            const segmentationMap = new Uint8ClampedArray(segmentation.width * segmentation.height * 4);
            for (let i = 0; i < segmentation.categoryMask.length; i++) {
                const categoryIndex = segmentation.categoryMask[i];
                const color = colors[categoryIndex];
                segmentationMap[i * 4] = color.r;
                segmentationMap[i * 4 + 1] = color.g;
                segmentationMap[i * 4 + 2] = color.b;
                segmentationMap[i * 4 + 3] = 255;
            }
            return {
                legend,
                width: segmentation.width,
                height: segmentation.height,
                segmentationMap,
            };
        });
    }
    cleanUp() {
        if (!this.tfliteImageSegmenter) {
            throw new Error('source model is not loaded');
        }
        this.tfliteImageSegmenter.cleanUp();
    }
}
exports.ImageSegmenterTFLite = ImageSegmenterTFLite;
