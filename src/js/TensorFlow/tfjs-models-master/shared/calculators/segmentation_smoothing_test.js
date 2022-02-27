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
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const calculate_inverse_matrix_1 = require("./calculate_inverse_matrix");
const segmentation_smoothing_1 = require("./segmentation_smoothing");
function runTest(useWebGL, mixRatio) {
    const prevMask = (0, calculate_inverse_matrix_1.arrayToMatrix4x4)(new Array(16).fill(111 / 255));
    const curMask = (0, calculate_inverse_matrix_1.arrayToMatrix4x4)([
        0.00, 0.00, 0.00, 0.00,
        0.00, 0.98, 0.98, 0.00,
        0.00, 0.98, 0.98, 0.00,
        0.00, 0.00, 0.00, 0.00
    ]);
    tf.setBackend(useWebGL ? 'webgl' : 'cpu');
    const resultMask = (0, segmentation_smoothing_1.smoothSegmentation)(tf.tensor2d(prevMask), tf.tensor2d(curMask), { combineWithPreviousRatio: mixRatio });
    expect(resultMask.shape[0]).toBe(curMask.length);
    expect(resultMask.shape[1]).toBe(curMask[0].length);
    const result = resultMask.arraySync();
    if (mixRatio === 1.0) {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                const input = curMask[i][j];
                const output = result[i][j];
                // Since the input has high value (250), it has low uncertainty.
                // So the output should have changed lower (towards prev),
                // but not too much.
                if (input > 0) {
                    expect(input).not.toBeCloseTo(output);
                }
                (0, test_util_1.expectNumbersClose)(input, output, 3.0 / 255.0);
            }
        }
    }
    else if (mixRatio === 0.0) {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                const input = curMask[i][j];
                const output = result[i][j];
                (0, test_util_1.expectNumbersClose)(input, output, 1e-7); // Output should match current.
            }
        }
    }
    else {
        throw new Error(`Invalid mixRatio: ${mixRatio}`);
    }
    return result;
}
(0, jasmine_util_1.describeWithFlags)('smoothSegmentation ', jasmine_util_1.BROWSER_ENVS, () => {
    it('test smoothing.', () => __awaiter(void 0, void 0, void 0, function* () {
        runTest(false, 0.0);
        const cpuResult = runTest(false, 1.0);
        const glResult = runTest(true, 1.0);
        // CPU & webGL should match.
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                (0, test_util_1.expectNumbersClose)(cpuResult[i][j], glResult[i][j], 1e-7);
            }
        }
    }));
});
