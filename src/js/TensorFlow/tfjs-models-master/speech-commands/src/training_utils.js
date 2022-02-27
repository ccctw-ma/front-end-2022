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
exports.balancedTrainValSplitNumArrays = exports.balancedTrainValSplit = void 0;
/**
 * Utility functions for training and transfer learning of the speech-commands
 * model.
 */
const tf = __importStar(require("@tensorflow/tfjs-core"));
/**
 * Split feature and target tensors into train and validation (val) splits.
 *
 * Given sufficent number of examples, the train and val sets will be
 * balanced with respect to the classes.
 *
 * @param xs Features tensor, of shape [numExamples, ...].
 * @param ys Targets tensors, of shape [numExamples, numClasses]. Assumed to be
 *   one-hot categorical encoding.
 * @param valSplit A number > 0 and < 1, fraction of examples to use
 *   as the validation set.
 * @returns trainXs: training features tensor; trainYs: training targets
 *   tensor; valXs: validation features tensor; valYs: validation targets
 *   tensor.
 */
function balancedTrainValSplit(xs, ys, valSplit) {
    tf.util.assert(valSplit > 0 && valSplit < 1, () => `validationSplit is expected to be >0 and <1, ` +
        `but got ${valSplit}`);
    return tf.tidy(() => {
        const classIndices = tf.argMax(ys, -1).dataSync();
        const indicesByClasses = [];
        for (let i = 0; i < classIndices.length; ++i) {
            const classIndex = classIndices[i];
            if (indicesByClasses[classIndex] == null) {
                indicesByClasses[classIndex] = [];
            }
            indicesByClasses[classIndex].push(i);
        }
        const numClasses = indicesByClasses.length;
        const trainIndices = [];
        const valIndices = [];
        // Randomly shuffle the list of indices in each array.
        indicesByClasses.map(classIndices => tf.util.shuffle(classIndices));
        for (let i = 0; i < numClasses; ++i) {
            const classIndices = indicesByClasses[i];
            const cutoff = Math.round(classIndices.length * (1 - valSplit));
            for (let j = 0; j < classIndices.length; ++j) {
                if (j < cutoff) {
                    trainIndices.push(classIndices[j]);
                }
                else {
                    valIndices.push(classIndices[j]);
                }
            }
        }
        const trainXs = tf.gather(xs, trainIndices);
        const trainYs = tf.gather(ys, trainIndices);
        const valXs = tf.gather(xs, valIndices);
        const valYs = tf.gather(ys, valIndices);
        return { trainXs, trainYs, valXs, valYs };
    });
}
exports.balancedTrainValSplit = balancedTrainValSplit;
/**
 * Same as balancedTrainValSplit, but for number arrays or Float32Arrays.
 */
function balancedTrainValSplitNumArrays(xs, ys, valSplit) {
    tf.util.assert(valSplit > 0 && valSplit < 1, () => `validationSplit is expected to be >0 and <1, ` +
        `but got ${valSplit}`);
    const isXsFloat32Array = !Array.isArray(xs[0]);
    const classIndices = ys;
    const indicesByClasses = [];
    for (let i = 0; i < classIndices.length; ++i) {
        const classIndex = classIndices[i];
        if (indicesByClasses[classIndex] == null) {
            indicesByClasses[classIndex] = [];
        }
        indicesByClasses[classIndex].push(i);
    }
    const numClasses = indicesByClasses.length;
    const trainIndices = [];
    const valIndices = [];
    // Randomly shuffle the list of indices in each array.
    indicesByClasses.map(classIndices => tf.util.shuffle(classIndices));
    for (let i = 0; i < numClasses; ++i) {
        const classIndices = indicesByClasses[i];
        const cutoff = Math.round(classIndices.length * (1 - valSplit));
        for (let j = 0; j < classIndices.length; ++j) {
            if (j < cutoff) {
                trainIndices.push(classIndices[j]);
            }
            else {
                valIndices.push(classIndices[j]);
            }
        }
    }
    if (isXsFloat32Array) {
        const trainXs = [];
        const trainYs = [];
        const valXs = [];
        const valYs = [];
        for (const index of trainIndices) {
            trainXs.push(xs[index]);
            trainYs.push(ys[index]);
        }
        for (const index of valIndices) {
            valXs.push(xs[index]);
            valYs.push(ys[index]);
        }
        return { trainXs, trainYs, valXs, valYs };
    }
    else {
        const trainXs = [];
        const trainYs = [];
        const valXs = [];
        const valYs = [];
        for (const index of trainIndices) {
            trainXs.push(xs[index]);
            trainYs.push(ys[index]);
        }
        for (const index of valIndices) {
            valXs.push(xs[index]);
            valYs.push(ys[index]);
        }
        return { trainXs, trainYs, valXs, valYs };
    }
}
exports.balancedTrainValSplitNumArrays = balancedTrainValSplitNumArrays;
