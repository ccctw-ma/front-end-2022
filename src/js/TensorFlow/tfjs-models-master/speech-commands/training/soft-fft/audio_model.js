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
exports.AudioModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tfl = __importStar(require("@tensorflow/tfjs-layers"));
const fs = __importStar(require("fs"));
/// <reference path="./types/node-wav.d.ts" />
const wav = __importStar(require("node-wav"));
const path = __importStar(require("path"));
/**
 * Audio Model that creates tf.Model for a fix amount of labels. It requires a
 * feature extractor to convert the audio stream into input tensors for the
 * internal tf.Model.
 * It provide datasets loading, training, and model saving functions.
 */
class AudioModel {
    /**
     *
     * @param inputShape Input tensor shape.
     * @param labels Audio command label list
     * @param dataset Dataset class to store the loaded data.
     * @param featureExtractor converter to extractor features from audio stream
     * as input tensors
     */
    constructor(inputShape, labels, dataset, featureExtractor) {
        this.labels = labels;
        this.dataset = dataset;
        this.featureExtractor = featureExtractor;
        this.featureExtractor.config({
            melCount: 40,
            bufferLength: 480,
            hopLength: 160,
            targetSr: 16000,
            isMfccEnabled: true,
            duration: 1.0
        });
        this.model = this.createModel(inputShape);
    }
    createModel(inputShape) {
        const model = tfl.sequential();
        model.add(tfl.layers.conv2d({ filters: 8, kernelSize: [4, 2], activation: 'relu', inputShape }));
        model.add(tfl.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
        model.add(tfl.layers.conv2d({ filters: 32, kernelSize: [4, 2], activation: 'relu' }));
        model.add(tfl.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
        model.add(tfl.layers.conv2d({ filters: 32, kernelSize: [4, 2], activation: 'relu' }));
        model.add(tfl.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
        model.add(tfl.layers.conv2d({ filters: 32, kernelSize: [4, 2], activation: 'relu' }));
        model.add(tfl.layers.maxPooling2d({ poolSize: [2, 2], strides: [1, 2] }));
        model.add(tfl.layers.flatten({}));
        model.add(tfl.layers.dropout({ rate: 0.25 }));
        model.add(tfl.layers.dense({ units: 2000, activation: 'relu' }));
        model.add(tfl.layers.dropout({ rate: 0.5 }));
        model.add(tfl.layers.dense({ units: this.labels.length, activation: 'softmax' }));
        model.compile({
            loss: 'categoricalCrossentropy',
            optimizer: tf.train.sgd(0.01),
            metrics: ['accuracy']
        });
        model.summary();
        return model;
    }
    /**
     * Load all dataset for the root directory, all the subdirectories that have
     * matching name to the entries in model label list, contained audio files
     * will be converted to input tensors and stored in the dataset for training.
     * @param dir The root directory of the audio dataset
     * @param callback Callback function for display training logs
     */
    loadAll(dir, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            this.labels.forEach((label, index) => __awaiter(this, void 0, void 0, function* () {
                callback(`loading label: ${label} (${index})`);
                promises.push(this.loadDataArray(path.resolve(dir, label), callback).then(v => {
                    callback(`finished loading label: ${label} (${index})`, true);
                    return [v, index];
                }));
            }));
            let allSpecs = yield Promise.all(promises);
            allSpecs = allSpecs
                .map((specs, i) => {
                const index = specs[1];
                return specs[0].map(spec => [spec, index]);
            })
                .reduce((acc, currentValue) => acc.concat(currentValue), []);
            tf.util.shuffle(allSpecs);
            const specs = allSpecs.map(spec => spec[0]);
            const labels = allSpecs.map(spec => spec[1]);
            this.dataset.addExamples(this.melSpectrogramToInput(specs), tf.oneHot(labels, this.labels.length));
        });
    }
    /**
     * Load one dataset from directory, all contained audio files
     * will be converted to input tensors and stored in the dataset for training.
     * @param dir The directory of the audio dataset
     * @param label The label for the audio dataset
     * @param callback Callback function for display training logs
     */
    loadData(dir, label, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.labels.indexOf(label);
            const specs = yield this.loadDataArray(dir, callback);
            this.dataset.addExamples(this.melSpectrogramToInput(specs), tf.oneHot(tf.fill([specs.length], index, 'int32'), this.labels.length));
        });
    }
    loadDataArray(dir, callback) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, filenames) => {
                if (err) {
                    reject(err);
                }
                let specs = [];
                filenames.forEach((filename) => {
                    callback('decoding ' + dir + '/' + filename + '...');
                    const spec = this.splitSpecs(this.decode(dir + '/' + filename));
                    if (!!spec) {
                        specs = specs.concat(spec);
                    }
                    callback('decoding ' + dir + '/' + filename + '...done');
                });
                resolve(specs);
            });
        });
    }
    decode(filename) {
        const result = wav.decode(fs.readFileSync(filename));
        return this.featureExtractor.start(result.channelData[0]);
    }
    /**
     * Train the model for stored dataset. The method call be called multiple
     * times.
     * @param epochs iteration of the training
     * @param trainCallback
     */
    train(epochs, trainCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.fit(this.dataset.xs, this.dataset.ys, {
                batchSize: 64,
                epochs: epochs || 100,
                shuffle: true,
                validationSplit: 0.1,
                callbacks: trainCallback
            });
        });
    }
    /**
     * Save the model to the specified directory.
     * @param dir Directory to store the model.
     */
    save(dir) {
        return this.model.save('file://' + dir);
    }
    /**
     * Return the size of the dataset in string.
     */
    size() {
        return this.dataset.xs ?
            `xs: ${this.dataset.xs.shape} ys: ${this.dataset.ys.shape}` :
            '0';
    }
    splitSpecs(spec) {
        if (spec.length >= 98) {
            const output = [];
            for (let i = 0; i <= (spec.length - 98); i += 32) {
                output.push(spec.slice(i, i + 98));
            }
            return output;
        }
        return undefined;
    }
    melSpectrogramToInput(specs) {
        // Flatten this spectrogram into a 2D array.
        const batch = specs.length;
        const times = specs[0].length;
        const freqs = specs[0][0].length;
        const data = new Float32Array(batch * times * freqs);
        console.log(data.length);
        for (let j = 0; j < batch; j++) {
            const spec = specs[j];
            for (let i = 0; i < times; i++) {
                const mel = spec[i];
                const offset = j * freqs * times + i * freqs;
                data.set(mel, offset);
            }
        }
        // Normalize the whole input to be in [0, 1].
        const shape = [batch, times, freqs, 1];
        // this.normalizeInPlace(data, 0, 1);
        return tf.tensor4d(data, shape);
    }
}
exports.AudioModel = AudioModel;
