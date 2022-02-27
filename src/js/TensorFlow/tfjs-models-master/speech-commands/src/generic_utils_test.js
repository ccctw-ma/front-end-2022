"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const generic_utils_1 = require("./generic_utils");
describe('string2ArrayBuffer and arrayBuffer2String', () => {
    it('round trip: ASCII only', () => {
        const str = 'Lorem_Ipsum_123 !@#$%^&*()';
        expect((0, generic_utils_1.arrayBuffer2String)((0, generic_utils_1.string2ArrayBuffer)(str))).toEqual(str);
    });
    it('round trip: non-ASCII', () => {
        const str = 'Welcome 欢迎 स्वागत हे ようこそ добро пожаловать 😀😀';
        expect((0, generic_utils_1.arrayBuffer2String)((0, generic_utils_1.string2ArrayBuffer)(str))).toEqual(str);
    });
    it('round trip: empty string', () => {
        const str = '';
        expect((0, generic_utils_1.arrayBuffer2String)((0, generic_utils_1.string2ArrayBuffer)(str))).toEqual(str);
    });
});
describe('concatenateFloat32Arrays', () => {
    it('Two non-empty', () => {
        const xs = new Float32Array([1, 3]);
        const ys = new Float32Array([3, 7]);
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([xs, ys]), new Float32Array([1, 3, 3, 7]));
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([ys, xs]), new Float32Array([3, 7, 1, 3]));
        // Assert that the original Float32Arrays are not altered.
        (0, test_util_1.expectArraysEqual)(xs, new Float32Array([1, 3]));
        (0, test_util_1.expectArraysEqual)(ys, new Float32Array([3, 7]));
    });
    it('Three unequal lengths non-empty', () => {
        const array1 = new Float32Array([1]);
        const array2 = new Float32Array([2, 3]);
        const array3 = new Float32Array([4, 5, 6]);
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([array1, array2, array3]), new Float32Array([1, 2, 3, 4, 5, 6]));
    });
    it('One empty, one non-empty', () => {
        const xs = new Float32Array([4, 2]);
        const ys = new Float32Array(0);
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([xs, ys]), new Float32Array([4, 2]));
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([ys, xs]), new Float32Array([4, 2]));
        // Assert that the original Float32Arrays are not altered.
        (0, test_util_1.expectArraysEqual)(xs, new Float32Array([4, 2]));
        (0, test_util_1.expectArraysEqual)(ys, new Float32Array(0));
    });
    it('Two empty', () => {
        const xs = new Float32Array(0);
        const ys = new Float32Array(0);
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([xs, ys]), new Float32Array(0));
        (0, test_util_1.expectArraysEqual)((0, generic_utils_1.concatenateFloat32Arrays)([ys, xs]), new Float32Array(0));
        // Assert that the original Float32Arrays are not altered.
        (0, test_util_1.expectArraysEqual)(xs, new Float32Array(0));
        (0, test_util_1.expectArraysEqual)(ys, new Float32Array(0));
    });
});
