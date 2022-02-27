"use strict";
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const calculate_inverse_matrix_1 = require("./calculate_inverse_matrix");
describe('calculateInverseMatrix', () => {
    const identity = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    it('identity matrix.', () => __awaiter(void 0, void 0, void 0, function* () {
        const inverse = (0, calculate_inverse_matrix_1.calculateInverseMatrix)(identity);
        (0, test_util_1.expectArraysClose)((0, calculate_inverse_matrix_1.matrix4x4ToArray)(inverse), (0, calculate_inverse_matrix_1.matrix4x4ToArray)(identity));
    }));
    it('translation.', () => __awaiter(void 0, void 0, void 0, function* () {
        const matrix = [
            [1.0, 0.0, 0.0, 2.0],
            [0.0, 1.0, 0.0, -5.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        const inverse = (0, calculate_inverse_matrix_1.calculateInverseMatrix)(matrix);
        const expectedInverse = [
            [1.0, 0.0, 0.0, -2.0],
            [0.0, 1.0, 0.0, 5.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        (0, test_util_1.expectArraysClose)((0, calculate_inverse_matrix_1.matrix4x4ToArray)(inverse), (0, calculate_inverse_matrix_1.matrix4x4ToArray)(expectedInverse));
    }));
    it('scale.', () => __awaiter(void 0, void 0, void 0, function* () {
        const matrix = [
            [5.0, 0.0, 0.0, 0.0],
            [0.0, 2.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        const inverse = (0, calculate_inverse_matrix_1.calculateInverseMatrix)(matrix);
        const expectedInverse = [
            [0.2, 0.0, 0.0, 0.0],
            [0.0, 0.5, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        (0, test_util_1.expectArraysClose)((0, calculate_inverse_matrix_1.matrix4x4ToArray)(inverse), (0, calculate_inverse_matrix_1.matrix4x4ToArray)(expectedInverse));
    }));
    it('rotation90.', () => __awaiter(void 0, void 0, void 0, function* () {
        const matrix = [
            [0.0, -1.0, 0.0, 0.0],
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        const inverse = (0, calculate_inverse_matrix_1.calculateInverseMatrix)(matrix);
        const expectedInverse = [
            [0.0, 1.0, 0.0, 0.0],
            [-1.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        (0, test_util_1.expectArraysClose)((0, calculate_inverse_matrix_1.matrix4x4ToArray)(inverse), (0, calculate_inverse_matrix_1.matrix4x4ToArray)(expectedInverse));
    }));
    it('precision.', () => __awaiter(void 0, void 0, void 0, function* () {
        const matrix = [
            [0.00001, 0.0, 0.0, 0.0], [0.0, 0.00001, 0.0, 0.0], [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0]
        ];
        const inverse = (0, calculate_inverse_matrix_1.calculateInverseMatrix)(matrix);
        const expectedInverse = [
            [100000.0, 0.0, 0.0, 0.0], [0.0, 100000.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0], [0.0, 0.0, 0.0, 1.0]
        ];
        (0, test_util_1.expectArraysClose)((0, calculate_inverse_matrix_1.matrix4x4ToArray)(inverse), (0, calculate_inverse_matrix_1.matrix4x4ToArray)(expectedInverse));
    }));
    it('random matrix.', () => __awaiter(void 0, void 0, void 0, function* () {
        for (let seed = 1; seed <= 5; ++seed) {
            const matrix = tf.randomUniform([4, 4], 0, 10, 'float32', seed);
            const inverse = (0, calculate_inverse_matrix_1.calculateInverseMatrix)((0, calculate_inverse_matrix_1.arrayToMatrix4x4)(matrix.dataSync()));
            const product = tf.matMul(matrix, inverse);
            (0, test_util_1.expectArraysClose)(product.dataSync(), (0, calculate_inverse_matrix_1.matrix4x4ToArray)(identity));
        }
    }));
});
