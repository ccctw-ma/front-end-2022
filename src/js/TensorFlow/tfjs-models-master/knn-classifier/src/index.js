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
exports.create = exports.KNNClassifier = exports.version = void 0;
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tfjs_core_1 = require("@tensorflow/tfjs-core");
const util_1 = require("./util");
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
/**
 * A K-nearest neighbors (KNN) classifier that allows fast
 * custom model training on top of any tensor input. Useful for transfer
 * learning with an embedding from another pretrained model.
 */
class KNNClassifier {
    constructor() {
        // Individual class datasets used when adding examples. These get concatenated
        // into the full trainDatasetMatrix when a prediction is made.
        this.classDatasetMatrices = {};
        this.classExampleCount = {};
        this.labelToClassId = {};
        this.nextClassId = 0;
    }
    /**
     * Adds the provided example to the specified class.
     */
    addExample(example, label) {
        if (this.exampleShape == null) {
            this.exampleShape = example.shape;
        }
        if (!tfjs_core_1.util.arraysEqual(this.exampleShape, example.shape)) {
            throw new Error(`Example shape provided, ${example.shape} does not match ` +
                `previously provided example shapes ${this.exampleShape}.`);
        }
        this.clearTrainDatasetMatrix();
        if (!(label in this.labelToClassId)) {
            this.labelToClassId[label] = this.nextClassId++;
        }
        tf.tidy(() => {
            const normalizedExample = this.normalizeVectorToUnitLength(tf.reshape(example, [example.size]));
            const exampleSize = normalizedExample.shape[0];
            if (this.classDatasetMatrices[label] == null) {
                this.classDatasetMatrices[label] =
                    tf.reshape(normalizedExample, [1, exampleSize]);
            }
            else {
                const newTrainLogitsMatrix = tf.concat([
                    tf.reshape(this.classDatasetMatrices[label], [this.classExampleCount[label], exampleSize]),
                    tf.reshape(normalizedExample, [1, exampleSize])
                ], 0);
                this.classDatasetMatrices[label].dispose();
                this.classDatasetMatrices[label] = newTrainLogitsMatrix;
            }
            tf.keep(this.classDatasetMatrices[label]);
            if (this.classExampleCount[label] == null) {
                this.classExampleCount[label] = 0;
            }
            this.classExampleCount[label]++;
        });
    }
    /**
     * This method return distances between the input and all examples in the
     * dataset.
     *
     * @param input The input example.
     * @returns cosine similarities for each entry in the database.
     */
    similarities(input) {
        return tf.tidy(() => {
            const normalizedExample = this.normalizeVectorToUnitLength(tf.reshape(input, [input.size]));
            const exampleSize = normalizedExample.shape[0];
            // Lazily create the logits matrix for all training examples if necessary.
            if (this.trainDatasetMatrix == null) {
                let newTrainLogitsMatrix = null;
                for (const label in this.classDatasetMatrices) {
                    newTrainLogitsMatrix = (0, util_1.concatWithNulls)(newTrainLogitsMatrix, this.classDatasetMatrices[label]);
                }
                this.trainDatasetMatrix = newTrainLogitsMatrix;
            }
            if (this.trainDatasetMatrix == null) {
                console.warn('Cannot predict without providing training examples.');
                return null;
            }
            tf.keep(this.trainDatasetMatrix);
            const numExamples = this.getNumExamples();
            return tf.reshape(tf.matMul(tf.reshape(this.trainDatasetMatrix, [numExamples, exampleSize]), tf.reshape(normalizedExample, [exampleSize, 1])), [numExamples]);
        });
    }
    /**
     * Predicts the class of the provided input using KNN from the previously-
     * added inputs and their classes.
     *
     * @param input The input to predict the class for.
     * @returns A dict of the top class for the input and an array of confidence
     * values for all possible classes.
     */
    predictClass(input, k = 3) {
        return __awaiter(this, void 0, void 0, function* () {
            if (k < 1) {
                throw new Error(`Please provide a positive integer k value to predictClass.`);
            }
            if (this.getNumExamples() === 0) {
                throw new Error(`You have not added any examples to the KNN classifier. ` +
                    `Please add examples before calling predictClass.`);
            }
            const knn = tf.tidy(() => tf.cast(this.similarities(input), 'float32'));
            const kVal = Math.min(k, this.getNumExamples());
            const topKIndices = (0, util_1.topK)(yield knn.data(), kVal).indices;
            knn.dispose();
            return this.calculateTopClass(topKIndices, kVal);
        });
    }
    /**
     * Clears the saved examples from the specified class.
     */
    clearClass(label) {
        if (this.classDatasetMatrices[label] == null) {
            throw new Error(`Cannot clear invalid class ${label}`);
        }
        this.classDatasetMatrices[label].dispose();
        delete this.classDatasetMatrices[label];
        delete this.classExampleCount[label];
        this.clearTrainDatasetMatrix();
    }
    clearAllClasses() {
        for (const label in this.classDatasetMatrices) {
            this.clearClass(label);
        }
    }
    getClassExampleCount() {
        return this.classExampleCount;
    }
    getClassifierDataset() {
        return this.classDatasetMatrices;
    }
    getNumClasses() {
        return Object.keys(this.classExampleCount).length;
    }
    setClassifierDataset(classDatasetMatrices) {
        this.clearTrainDatasetMatrix();
        this.classDatasetMatrices = classDatasetMatrices;
        for (const label in classDatasetMatrices) {
            this.classExampleCount[label] = classDatasetMatrices[label].shape[0];
        }
    }
    /**
     * Calculates the top class in knn prediction
     * @param topKIndices The indices of closest K values.
     * @param kVal The value of k for the k-nearest neighbors algorithm.
     */
    calculateTopClass(topKIndices, kVal) {
        let topLabel;
        const confidences = {};
        if (topKIndices == null) {
            // No class predicted
            return {
                classIndex: this.labelToClassId[topLabel],
                label: topLabel,
                confidences
            };
        }
        const classOffsets = {};
        let offset = 0;
        for (const label in this.classDatasetMatrices) {
            offset += this.classExampleCount[label];
            classOffsets[label] = offset;
        }
        const votesPerClass = {};
        for (const label in this.classDatasetMatrices) {
            votesPerClass[label] = 0;
        }
        for (let i = 0; i < topKIndices.length; i++) {
            const index = topKIndices[i];
            for (const label in this.classDatasetMatrices) {
                if (index < classOffsets[label]) {
                    votesPerClass[label]++;
                    break;
                }
            }
        }
        // Compute confidences.
        let topConfidence = 0;
        for (const label in this.classDatasetMatrices) {
            const probability = votesPerClass[label] / kVal;
            if (probability > topConfidence) {
                topConfidence = probability;
                topLabel = label;
            }
            confidences[label] = probability;
        }
        return {
            classIndex: this.labelToClassId[topLabel],
            label: topLabel,
            confidences
        };
    }
    /**
     * Clear the lazily-loaded train logits matrix due to a change in
     * training data.
     */
    clearTrainDatasetMatrix() {
        if (this.trainDatasetMatrix != null) {
            this.trainDatasetMatrix.dispose();
            this.trainDatasetMatrix = null;
        }
    }
    /**
     * Normalize the provided vector to unit length.
     */
    normalizeVectorToUnitLength(vec) {
        return tf.tidy(() => {
            const sqrtSum = tf.norm(vec);
            return tf.div(vec, sqrtSum);
        });
    }
    getNumExamples() {
        let total = 0;
        for (const label in this.classDatasetMatrices) {
            total += this.classExampleCount[label];
        }
        return total;
    }
    dispose() {
        this.clearTrainDatasetMatrix();
        for (const label in this.classDatasetMatrices) {
            this.classDatasetMatrices[label].dispose();
        }
    }
}
exports.KNNClassifier = KNNClassifier;
function create() {
    return new KNNClassifier();
}
exports.create = create;
