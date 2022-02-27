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
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const image_utils_1 = require("./image_utils");
function expectRotatedRectEq(rect, width, height, xCenter, yCenter, rotation) {
    expect(rect.xCenter).toBe(xCenter);
    expect(rect.yCenter).toBe(yCenter);
    expect(rect.width).toBe(width);
    expect(rect.height).toBe(height);
    expect(rect.rotation).toBe(rotation);
}
describe('GetRoi', () => {
    it('no norm rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        expectRotatedRectEq((0, image_utils_1.getRoi)({ width: 4, height: 4 }), 4, 4, 2, 2, 0);
        expectRotatedRectEq((0, image_utils_1.getRoi)({ width: 25, height: 15 }), 25, 15, 12.5, 7.5, 0);
    }));
    it('whole image norm rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        const normRect = { width: 1, height: 1, xCenter: 0.5, yCenter: 0.5, rotation: 0 };
        expectRotatedRectEq((0, image_utils_1.getRoi)({ width: 4, height: 4 }, normRect), 4, 4, 2, 2, 0);
        expectRotatedRectEq((0, image_utils_1.getRoi)({ width: 25, height: 15 }, normRect), 25, 15, 12.5, 7.5, 0);
    }));
    it('expanded norm rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        const normRect = { width: 4, height: 2, xCenter: 0.5, yCenter: 1, rotation: 3 };
        expectRotatedRectEq((0, image_utils_1.getRoi)({ width: 4, height: 4 }, normRect), 16, 8, 2, 4, 3);
        expectRotatedRectEq((0, image_utils_1.getRoi)({ width: 25, height: 15 }, normRect), 100, 30, 12.5, 15, 3);
    }));
});
const EPS = 1e-6;
function expectPaddingClose(padding, top, bottom, left, right) {
    (0, test_util_1.expectNumbersClose)(padding.top, top, EPS);
    (0, test_util_1.expectNumbersClose)(padding.bottom, bottom, EPS);
    (0, test_util_1.expectNumbersClose)(padding.left, left, EPS);
    (0, test_util_1.expectNumbersClose)(padding.right, right, EPS);
}
describe('PadRoi', () => {
    it('no padding.', () => __awaiter(void 0, void 0, void 0, function* () {
        const roi = { xCenter: 20, yCenter: 10, width: 100, height: 200, rotation: 5 };
        expectPaddingClose((0, image_utils_1.padRoi)(roi, { width: 10, height: 10 }, false), 0, 0, 0, 0);
        expectRotatedRectEq(roi, 100, 200, 20, 10, 5);
    }));
    it('horizontal padding.', () => __awaiter(void 0, void 0, void 0, function* () {
        const roi = { xCenter: 20, yCenter: 10, width: 100, height: 200, rotation: 5 };
        expectPaddingClose((0, image_utils_1.padRoi)(roi, { width: 10, height: 10 }, true), 0, 0, 0.25, 0.25);
        expectRotatedRectEq(roi, 200, 200, 20, 10, 5);
    }));
    it('vertical padding.', () => __awaiter(void 0, void 0, void 0, function* () {
        const roi = { xCenter: 1, yCenter: 2, width: 21, height: 19, rotation: 3 };
        const expectedHorizontalPadding = (21 - 19) / 2.0 / 21;
        expectPaddingClose((0, image_utils_1.padRoi)(roi, { width: 10, height: 10 }, true), expectedHorizontalPadding, expectedHorizontalPadding, 0, 0);
        expectRotatedRectEq(roi, 21, 21, 1, 2, 3);
    }));
});
