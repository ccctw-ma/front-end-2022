"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const test_util_2 = require("../test_util");
const convert_image_to_tensor_1 = require("./convert_image_to_tensor");
const image_utils_1 = require("./image_utils");
const mask_util_1 = require("./mask_util");
// Measured in pixels.
const EPS = 7;
describe('ImageToTensorCalculator', () => {
    let input;
    let timeout;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        input = yield (0, test_util_2.loadImage)('shared/image_to_tensor_input.jpg', 64, 128);
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    function runTest(roi, config, expectedFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imageTensor } = (0, convert_image_to_tensor_1.convertImageToTensor)(input, config, roi);
            // Shift to [0, 255] range.
            const [rangeMin, rangeMax] = config.outputTensorFloatRange;
            const { scale, offset } = (0, image_utils_1.transformValueRange)(rangeMin, rangeMax, 0, 255);
            const actualResult = tf.tidy(() => tf.add(tf.mul(imageTensor, scale), offset));
            tf.dispose(imageTensor);
            const expectedResultRGBA = yield (0, test_util_2.loadImage)(`shared/${expectedFileName}`, config.outputTensorSize.width, config.outputTensorSize.height)
                .then(image => (0, mask_util_1.toImageDataLossy)(image));
            const expectedResultRGB = expectedResultRGBA.data.filter((_, index) => index % 4 !== 3);
            (0, test_util_1.expectArraysClose)(new Uint8ClampedArray(actualResult.dataSync()), expectedResultRGB, EPS);
        });
    }
    it('medium sub rect keep aspect.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.65,
            yCenter: 0.4,
            width: 0.5,
            height: 0.5,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 256, height: 256 },
            keepAspectRatio: true,
            borderMode: 'replicate'
        }, 'medium_sub_rect_keep_aspect.png');
    }));
    it('medium sub rect keep aspect border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.65,
            yCenter: 0.4,
            width: 0.5,
            height: 0.5,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 256, height: 256 },
            keepAspectRatio: true,
            borderMode: 'zero'
        }, 'medium_sub_rect_keep_aspect_border_zero.png');
    }));
    it('medium sub rect keep aspect with rotation.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.65,
            yCenter: 0.4,
            width: 0.5,
            height: 0.5,
            rotation: Math.PI * 90 / 180,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 256, height: 256 },
            keepAspectRatio: true,
            borderMode: 'replicate'
        }, 'medium_sub_rect_keep_aspect_with_rotation.png');
    }));
    it('medium sub rect keep aspect with rotation border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.65,
            yCenter: 0.4,
            width: 0.5,
            height: 0.5,
            rotation: Math.PI * 90 / 180,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 256, height: 256 },
            keepAspectRatio: true,
            borderMode: 'zero'
        }, 'medium_sub_rect_keep_aspect_with_rotation_border_zero.png');
    }));
    it('medium sub rect with rotation.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.65,
            yCenter: 0.4,
            width: 0.5,
            height: 0.5,
            rotation: Math.PI * -45 / 180,
        }, {
            outputTensorFloatRange: [-1, 1],
            outputTensorSize: { width: 256, height: 256 },
            keepAspectRatio: false,
            borderMode: 'replicate'
        }, 'medium_sub_rect_with_rotation.png');
    }));
    it('medium sub rect with rotation border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.65,
            yCenter: 0.4,
            width: 0.5,
            height: 0.5,
            rotation: Math.PI * -45 / 180,
        }, {
            outputTensorFloatRange: [-1, 1],
            outputTensorSize: { width: 256, height: 256 },
            keepAspectRatio: false,
            borderMode: 'zero'
        }, 'medium_sub_rect_with_rotation_border_zero.png');
    }));
    it('large sub rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.5,
            height: 1.1,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 128, height: 128 },
            keepAspectRatio: false,
            borderMode: 'replicate'
        }, 'large_sub_rect.png');
    }));
    it('large sub rect border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.5,
            height: 1.1,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 128, height: 128 },
            keepAspectRatio: false,
            borderMode: 'zero'
        }, 'large_sub_rect_border_zero.png');
    }));
    it('large sub keep aspect.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.5,
            height: 1.1,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 128, height: 128 },
            keepAspectRatio: true,
            borderMode: 'replicate'
        }, 'large_sub_rect_keep_aspect.png');
    }));
    it('large sub keep aspect border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.5,
            height: 1.1,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 128, height: 128 },
            keepAspectRatio: true,
            borderMode: 'zero'
        }, 'large_sub_rect_keep_aspect_border_zero.png');
    }));
    it('large sub keep aspect with rotation.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.5,
            height: 1.1,
            rotation: Math.PI * -15 / 180,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 128, height: 128 },
            keepAspectRatio: true,
            borderMode: 'replicate'
        }, 'large_sub_rect_keep_aspect_with_rotation.png');
    }));
    it('large sub keep aspect with rotation border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.5,
            height: 1.1,
            rotation: Math.PI * -15 / 180,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 128, height: 128 },
            keepAspectRatio: true,
            borderMode: 'zero'
        }, 'large_sub_rect_keep_aspect_with_rotation_border_zero.png');
    }));
    it('no op except range.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.0,
            height: 1.0,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 64, height: 128 },
            keepAspectRatio: true,
            borderMode: 'replicate'
        }, 'noop_except_range.png');
    }));
    it('no op except range border zero.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield runTest({
            xCenter: 0.5,
            yCenter: 0.5,
            width: 1.0,
            height: 1.0,
            rotation: 0,
        }, {
            outputTensorFloatRange: [0, 1],
            outputTensorSize: { width: 64, height: 128 },
            keepAspectRatio: true,
            borderMode: 'zero'
        }, 'noop_except_range.png');
    }));
});
