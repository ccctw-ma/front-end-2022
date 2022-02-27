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
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const knnClassifier = __importStar(require("./index"));
(0, jasmine_util_1.describeWithFlags)('KNNClassifier', jasmine_util_1.NODE_ENVS, () => {
    it('simple nearest neighbors', () => __awaiter(void 0, void 0, void 0, function* () {
        const x0s = [
            tf.tensor1d([1, 1, 1, 1]), tf.tensor1d([1.1, 0.9, 1.2, 0.8]),
            tf.tensor1d([1.2, 0.8, 1.3, 0.7])
        ];
        const x1s = [
            tf.tensor1d([-1, -1, -1, -1]), tf.tensor1d([-1.1, -0.9, -1.2, -0.8]),
            tf.tensor1d([-1.2, -0.8, -1.3, -0.7])
        ];
        const classifier = knnClassifier.create();
        x0s.forEach(x0 => classifier.addExample(x0, 0));
        x1s.forEach(x1 => classifier.addExample(x1, 1));
        const x0 = tf.tensor1d([1.1, 1.1, 1.1, 1.1]);
        const x1 = tf.tensor1d([-1.1, -1.1, -1.1, -1.1]);
        // Warmup.
        yield classifier.predictClass(x0);
        const numTensorsBefore = tf.memory().numTensors;
        const result0 = yield classifier.predictClass(x0);
        expect(result0.classIndex).toBe(0);
        const result1 = yield classifier.predictClass(x1);
        expect(result1.classIndex).toBe(1);
        expect(tf.memory().numTensors).toEqual(numTensorsBefore);
        classifier.dispose();
    }));
    it('calling predictClass before adding example throws', () => __awaiter(void 0, void 0, void 0, function* () {
        const classifier = knnClassifier.create();
        const x0 = tf.tensor1d([1.1, 1.1, 1.1, 1.1]);
        let errorMessage;
        try {
            yield classifier.predictClass(x0);
        }
        catch (error) {
            errorMessage = error.message;
        }
        expect(errorMessage)
            .toMatch(/You have not added any examples to the KNN classifier/);
        classifier.dispose();
    }));
    it('examples with classId that does not start at 0 works', () => __awaiter(void 0, void 0, void 0, function* () {
        const classifier = knnClassifier.create();
        classifier.addExample(tf.tensor2d([5, 2], [2, 1]), 1);
        classifier.addExample(tf.tensor2d([6, 1], [2, 1]), 2);
        const result = yield classifier.predictClass(tf.tensor2d([3, 3], [2, 1]));
        expect(result.classIndex).toBe(0);
        expect(result.label).toBe('1');
        expect(result.confidences).toEqual({ '1': 0.5, '2': 0.5 });
        expect(classifier.getClassExampleCount()).toEqual({ 1: 1, 2: 1 });
        classifier.dispose();
    }));
    it('examples with classId 5, 7 and 9', () => __awaiter(void 0, void 0, void 0, function* () {
        const classifier = knnClassifier.create();
        classifier.addExample(tf.tensor1d([7, 7]), 7);
        classifier.addExample(tf.tensor1d([5, 5]), 5);
        classifier.addExample(tf.tensor1d([9, 9]), 9);
        classifier.addExample(tf.tensor1d([5, 5]), 5);
        const result = yield classifier.predictClass(tf.tensor1d([5, 5]));
        expect(result.classIndex).toBe(1);
        expect(result.label).toBe('5');
        expect(result.confidences).toEqual({ 5: 2 / 3, 7: 1 / 3, 9: 0 });
        expect(classifier.getClassExampleCount()).toEqual({ 5: 2, 7: 1, 9: 1 });
        classifier.dispose();
    }));
    it('examples with string labels', () => __awaiter(void 0, void 0, void 0, function* () {
        const classifier = knnClassifier.create();
        classifier.addExample(tf.tensor1d([7, 7]), 'a');
        classifier.addExample(tf.tensor1d([5, 5]), 'b');
        classifier.addExample(tf.tensor1d([9, 9]), 'c');
        classifier.addExample(tf.tensor1d([5, 5]), 'b');
        const result = yield classifier.predictClass(tf.tensor1d([5, 5]));
        expect(result.classIndex).toBe(1);
        expect(result.label).toBe('b');
        expect(result.confidences).toEqual({ b: 2 / 3, a: 1 / 3, c: 0 });
        expect(classifier.getClassExampleCount()).toEqual({ b: 2, a: 1, c: 1 });
        classifier.dispose();
    }));
    it('getClassifierDataset', () => {
        const classifier = knnClassifier.create();
        classifier.addExample(tf.tensor1d([5, 5.1]), 5);
        classifier.addExample(tf.tensor1d([7, 7]), 7);
        classifier.addExample(tf.tensor1d([5.2, 5.3]), 5);
        classifier.addExample(tf.tensor1d([9, 9]), 9);
        const dataset = classifier.getClassifierDataset();
        expect(Object.keys(dataset)).toEqual(['5', '7', '9']);
        expect(dataset[5].shape).toEqual([2, 2]);
        expect(dataset[7].shape).toEqual([1, 2]);
        expect(dataset[9].shape).toEqual([1, 2]);
        classifier.dispose();
    });
    it('clearClass', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(tf.memory().numTensors).toBe(0);
        const classifier = knnClassifier.create();
        tf.tidy(() => {
            classifier.addExample(tf.tensor1d([5, 5]), 5);
            classifier.addExample(tf.tensor1d([7, 7]), 7);
            classifier.addExample(tf.tensor1d([5, 5]), 5);
            classifier.addExample(tf.tensor1d([9, 9]), 9);
        });
        const numTensorsBefore = tf.memory().numTensors;
        expect(classifier.getClassExampleCount()).toEqual({ 5: 2, 7: 1, 9: 1 });
        expect(classifier.getNumClasses()).toBe(3);
        expect(numTensorsBefore).toBe(3);
        classifier.clearClass(5);
        expect(classifier.getClassExampleCount()).toEqual({ 7: 1, 9: 1 });
        expect(classifier.getNumClasses()).toBe(2);
        const numTensorsAfter = tf.memory().numTensors;
        expect(numTensorsAfter).toBe(2);
        classifier.clearAllClasses();
        expect(classifier.getClassExampleCount()).toEqual({});
        expect(classifier.getNumClasses()).toBe(0);
        expect(tf.memory().numTensors).toBe(0);
        classifier.dispose();
    }));
});
