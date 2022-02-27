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
const tfjs_core_1 = require("@tensorflow/tfjs-core");
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const maskUtil = __importStar(require("./mask_util"));
describe('maskUtil', () => {
    const rgbaValues = Array.from(new Array(24).keys());
    const expectedExact = rgbaValues;
    const expectedLossy = [
        0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0, 11,
        17, 17, 17, 15, 13, 13, 13, 19, 22, 22, 22, 23
    ];
    it('ImageData to HTMLCanvasElement.', () => __awaiter(void 0, void 0, void 0, function* () {
        const imageData = new ImageData(new Uint8ClampedArray(rgbaValues), 2, 3);
        const canvas = yield maskUtil.toHTMLCanvasElementLossy(imageData);
        expect(canvas.width).toBe(imageData.width);
        expect(canvas.height).toBe(imageData.height);
        const actual = Array.from(canvas.getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
            .data);
        (0, test_util_1.expectArraysEqual)(actual, expectedLossy);
    }));
    it('Tensor to HTMLCanvasElement.', () => __awaiter(void 0, void 0, void 0, function* () {
        const tensor = (0, tfjs_core_1.tensor3d)(rgbaValues, [2, 3, 4], 'int32');
        const [height, width] = tensor.shape.slice(0, 2);
        const canvas = yield maskUtil.toHTMLCanvasElementLossy(tensor);
        expect(canvas.width).toBe(width);
        expect(canvas.height).toBe(height);
        const actual = Array.from(canvas.getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
            .data);
        (0, test_util_1.expectArraysEqual)(actual, expectedLossy);
    }));
    it('HTMLCanvasElement to ImageData.', () => __awaiter(void 0, void 0, void 0, function* () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 2;
        canvas.height = 3;
        ctx.putImageData(new ImageData(new Uint8ClampedArray(rgbaValues), 2, 3), 0, 0);
        const imageData = yield maskUtil.toImageDataLossy(canvas);
        expect(imageData.width).toBe(canvas.width);
        expect(imageData.height).toBe(canvas.height);
        const actual = Array.from(imageData.data);
        (0, test_util_1.expectArraysEqual)(actual, expectedLossy);
    }));
    it('Tensor to ImageData.', () => __awaiter(void 0, void 0, void 0, function* () {
        const tensor = (0, tfjs_core_1.tensor3d)(rgbaValues, [2, 3, 4], 'int32');
        const [height, width] = tensor.shape.slice(0, 2);
        const imageData = yield maskUtil.toImageDataLossy(tensor);
        expect(imageData.width).toBe(width);
        expect(imageData.height).toBe(height);
        const actual = Array.from(imageData.data);
        (0, test_util_1.expectArraysEqual)(actual, expectedExact);
    }));
    it('HTMLCanvasElement to Tensor.', () => __awaiter(void 0, void 0, void 0, function* () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 2;
        canvas.height = 3;
        ctx.putImageData(new ImageData(new Uint8ClampedArray(rgbaValues), 2, 3), 0, 0);
        const tensor = yield maskUtil.toTensorLossy(canvas);
        const [height, width] = tensor.shape.slice(0, 2);
        expect(width).toBe(canvas.width);
        expect(height).toBe(canvas.height);
        (0, test_util_1.expectArraysEqual)(tensor.dataSync(), expectedLossy);
    }));
    it('ImageData to Tensor.', () => __awaiter(void 0, void 0, void 0, function* () {
        const imageData = new ImageData(new Uint8ClampedArray(rgbaValues), 2, 3);
        const tensor = yield maskUtil.toTensorLossy(imageData);
        const [height, width] = tensor.shape.slice(0, 2);
        expect(width).toBe(imageData.width);
        expect(height).toBe(imageData.height);
        (0, test_util_1.expectArraysEqual)(tensor.dataSync(), expectedExact);
    }));
    it('assertMaskValue.', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(() => maskUtil.assertMaskValue(-1))
            .toThrowError(/Mask value must be in range \[0, 255\]/);
        expect(() => maskUtil.assertMaskValue(256))
            .toThrowError(/Mask value must be in range \[0, 255\]/);
        expect(() => maskUtil.assertMaskValue(1.1))
            .toThrowError(/must be an integer/);
        const uint8Values = Array.from(Array(256).keys());
        uint8Values.forEach(value => expect(() => maskUtil.assertMaskValue(value)).not.toThrow());
    }));
});
