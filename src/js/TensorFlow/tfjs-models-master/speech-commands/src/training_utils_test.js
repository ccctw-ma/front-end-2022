"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
require("@tensorflow/tfjs-node");
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const test_utils_1 = require("./test_utils");
const training_utils_1 = require("./training_utils");
(0, jasmine_util_1.describeWithFlags)('balancedTrainValSplit', jasmine_util_1.NODE_ENVS, () => {
    it('Enough data for split', () => {
        const xs = tf.randomNormal([8, 3]);
        const ys = tf.oneHot(tf.tensor1d([0, 0, 0, 0, 1, 1, 1, 1], 'int32'), 2);
        const { trainXs, trainYs, valXs, valYs } = (0, training_utils_1.balancedTrainValSplit)(xs, ys, 0.25);
        expect(trainXs.shape).toEqual([6, 3]);
        expect(trainYs.shape).toEqual([6, 2]);
        expect(valXs.shape).toEqual([2, 3]);
        expect(valYs.shape).toEqual([2, 2]);
        (0, test_utils_1.expectTensorsClose)(tf.sum(trainYs, 0), tf.tensor1d([3, 3], 'int32'));
        (0, test_utils_1.expectTensorsClose)(tf.sum(valYs, 0), tf.tensor1d([1, 1], 'int32'));
    });
    it('Not enough data for split', () => {
        const xs = tf.randomNormal([8, 3]);
        const ys = tf.oneHot(tf.tensor1d([0, 0, 0, 0, 1, 1, 1, 1], 'int32'), 2);
        const { trainXs, trainYs, valXs, valYs } = (0, training_utils_1.balancedTrainValSplit)(xs, ys, 0.01);
        expect(trainXs.shape).toEqual([8, 3]);
        expect(trainYs.shape).toEqual([8, 2]);
        expect(valXs.shape).toEqual([0, 3]);
        expect(valYs.shape).toEqual([0, 2]);
    });
    it('Invalid valSplit leads to Error', () => {
        const xs = tf.randomNormal([8, 3]);
        const ys = tf.oneHot(tf.tensor1d([0, 0, 0, 0, 1, 1, 1, 1], 'int32'), 2);
        expect(() => (0, training_utils_1.balancedTrainValSplit)(xs, ys, -0.2)).toThrow();
        expect(() => (0, training_utils_1.balancedTrainValSplit)(xs, ys, 0)).toThrow();
        expect(() => (0, training_utils_1.balancedTrainValSplit)(xs, ys, 1)).toThrow();
        expect(() => (0, training_utils_1.balancedTrainValSplit)(xs, ys, 1.2)).toThrow();
    });
});
