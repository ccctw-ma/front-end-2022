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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const bodySegmentation = __importStar(require("../index"));
const mask_util_1 = require("../shared/calculators/mask_util");
const test_util_1 = require("../shared/test_util");
// Measured in percent.
const EPSILON_IOU = 0.98;
function expectSegmenter(segmenter, image, segmentationImage) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield segmenter.segmentPeople(image, {});
        const segmentation = result[0];
        const maskValuesToLabel = Array.from(Array(256).keys(), (v, _) => segmentation.maskValueToLabel(v));
        const mask = segmentation.mask;
        const actualBooleanMask = (0, test_util_1.imageToBooleanMask)(
        // Round to binary mask using red value cutoff of 128.
        (yield segmentation.mask.toImageData()).data, 128, 0, 0);
        const expectedBooleanMask = (0, test_util_1.imageToBooleanMask)((yield (0, mask_util_1.toImageDataLossy)(segmentationImage)).data, 0, 0, 255);
        expect(maskValuesToLabel.every(label => label === 'person'));
        expect(mask.getUnderlyingType() === 'tensor');
        expect((0, test_util_1.segmentationIOU)(expectedBooleanMask, actualBooleanMask))
            .toBeGreaterThanOrEqual(EPSILON_IOU);
    });
}
(0, jasmine_util_1.describeWithFlags)('TFJS MediaPipeSelfieSegmentation static image ', jasmine_util_1.BROWSER_ENVS, () => {
    let segmenter;
    let image;
    let segmentationImage;
    let timeout;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        image = yield (0, test_util_1.loadImage)('portrait.jpg', 820, 1024);
        segmentationImage =
            yield (0, test_util_1.loadImage)('portrait_segmentation.png', 820, 1024);
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('general model test.', () => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        segmenter = yield bodySegmentation.createSegmenter(model, { runtime: 'tfjs', modelType: 'general' });
        expectSegmenter(segmenter, image, segmentationImage);
        segmenter.dispose();
    }));
    it('landscape model test.', () => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        segmenter = yield bodySegmentation.createSegmenter(model, { runtime: 'tfjs', modelType: 'landscape' });
        expectSegmenter(segmenter, image, segmentationImage);
        segmenter.dispose();
    }));
});
