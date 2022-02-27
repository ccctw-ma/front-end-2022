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
exports.getMaxIntensityFrameIndex = exports.spectrogram2IntensityCurve = exports.getValidWindows = exports.arrayBuffer2SerializedExamples = exports.deserializeExample = exports.serializeExample = exports.Dataset = exports.BACKGROUND_NOISE_TAG = exports.DATASET_SERIALIZATION_VERSION = exports.DATASET_SERIALIZATION_DESCRIPTOR = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tfd = __importStar(require("@tensorflow/tfjs-data"));
const browser_fft_utils_1 = require("./browser_fft_utils");
const generic_utils_1 = require("./generic_utils");
const training_utils_1 = require("./training_utils");
// Descriptor for serialized dataset files: stands for:
//   TensorFlow.js Speech-Commands Dataset.
// DO NOT EVER CHANGE THIS!
exports.DATASET_SERIALIZATION_DESCRIPTOR = 'TFJSSCDS';
// A version number for the serialization. Since this needs
// to be encoded within a length-1 Uint8 array, it must be
//   1. an positive integer.
//   2. monotonically increasing over its change history.
// Item 1 is checked by unit tests.
exports.DATASET_SERIALIZATION_VERSION = 1;
exports.BACKGROUND_NOISE_TAG = '_background_noise_';
/**
 * A serializable, mutable set of speech/audio `Example`s;
 */
class Dataset {
    /**
     * Constructor of `Dataset`.
     *
     * If called with no arguments (i.e., `artifacts` == null), an empty dataset
     * will be constructed.
     *
     * Else, the dataset will be deserialized from `artifacts`.
     *
     * @param serialized Optional serialization artifacts to deserialize.
     */
    constructor(serialized) {
        this.examples = {};
        this.label2Ids = {};
        if (serialized != null) {
            // Deserialize from the provided artifacts.
            const artifacts = arrayBuffer2SerializedExamples(serialized);
            let offset = 0;
            for (let i = 0; i < artifacts.manifest.length; ++i) {
                const spec = artifacts.manifest[i];
                let byteLen = spec.spectrogramNumFrames * spec.spectrogramFrameSize;
                if (spec.rawAudioNumSamples != null) {
                    byteLen += spec.rawAudioNumSamples;
                }
                byteLen *= 4;
                this.addExample(deserializeExample({ spec, data: artifacts.data.slice(offset, offset + byteLen) }));
                offset += byteLen;
            }
        }
    }
    /**
     * Add an `Example` to the `Dataset`
     *
     * @param example A `Example`, with a label. The label must be a non-empty
     *   string.
     * @returns The UID for the added `Example`.
     */
    addExample(example) {
        tf.util.assert(example != null, () => 'Got null or undefined example');
        tf.util.assert(example.label != null && example.label.length > 0, () => `Expected label to be a non-empty string, ` +
            `but got ${JSON.stringify(example.label)}`);
        const uid = (0, generic_utils_1.getUID)();
        this.examples[uid] = example;
        if (!(example.label in this.label2Ids)) {
            this.label2Ids[example.label] = [];
        }
        this.label2Ids[example.label].push(uid);
        return uid;
    }
    /**
     * Merge the incoming dataset into this dataset
     *
     * @param dataset The incoming dataset to be merged into this dataset.
     */
    merge(dataset) {
        tf.util.assert(dataset !== this, () => 'Cannot merge a dataset into itself');
        const vocab = dataset.getVocabulary();
        for (const word of vocab) {
            const examples = dataset.getExamples(word);
            for (const example of examples) {
                this.addExample(example.example);
            }
        }
    }
    /**
     * Get a map from `Example` label to number of `Example`s with the label.
     *
     * @returns A map from label to number of example counts under that label.
     */
    getExampleCounts() {
        const counts = {};
        for (const uid in this.examples) {
            const example = this.examples[uid];
            if (!(example.label in counts)) {
                counts[example.label] = 0;
            }
            counts[example.label]++;
        }
        return counts;
    }
    /**
     * Get all examples of a given label, with their UIDs.
     *
     * @param label The requested label.
     * @return All examples of the given `label`, along with their UIDs.
     *   The examples are sorted in the order in which they are added to the
     *   `Dataset`.
     * @throws Error if label is `null` or `undefined`.
     */
    getExamples(label) {
        tf.util.assert(label != null, () => `Expected label to be a string, but got ${JSON.stringify(label)}`);
        tf.util.assert(label in this.label2Ids, () => `No example of label "${label}" exists in dataset`);
        const output = [];
        this.label2Ids[label].forEach(id => {
            output.push({ uid: id, example: this.examples[id] });
        });
        return output;
    }
    /**
     * Get all examples and labels as tensors.
     *
     * - If `label` is provided and exists in the vocabulary of the `Dataset`,
     *   the spectrograms of all `Example`s under the `label` will be returned
     *   as a 4D `tf.Tensor` as `xs`. The shape of the `tf.Tensor` will be
     *     `[numExamples, numFrames, frameSize, 1]`
     *   where
     *     - `numExamples` is the number of `Example`s with the label
     *     - `numFrames` is the number of frames in each spectrogram
     *     - `frameSize` is the size of each spectrogram frame.
     *   No label Tensor will be returned.
     * - If `label` is not provided, all `Example`s will be returned as `xs`.
     *   In addition, `ys` will contain a one-hot encoded list of labels.
     *   - The shape of `xs` will be: `[numExamples, numFrames, frameSize, 1]`
     *   - The shape of `ys` will be: `[numExamples, vocabularySize]`.
     *
     * @returns If `config.getDataset` is `true`, returns two `tf.data.Dataset`
     *   objects, one for training and one for validation.
     *   Else, xs` and `ys` tensors. See description above.
     * @throws Error
     *   - if not all the involved spectrograms have matching `numFrames` and
     *     `frameSize`, or
     *   - if `label` is provided and is not present in the vocabulary of the
     *     `Dataset`, or
     *   - if the `Dataset` is currently empty.
     */
    getData(label, config) {
        tf.util.assert(this.size() > 0, () => `Cannot get spectrograms as tensors because the dataset is empty`);
        const vocab = this.getVocabulary();
        if (label != null) {
            tf.util.assert(vocab.indexOf(label) !== -1, () => `Label ${label} is not in the vocabulary ` +
                `(${JSON.stringify(vocab)})`);
        }
        else {
            // If all words are requested, there must be at least two words in the
            // vocabulary to make one-hot encoding possible.
            tf.util.assert(vocab.length > 1, () => `One-hot encoding of labels requires the vocabulary to have ` +
                `at least two words, but it has only ${vocab.length} word.`);
        }
        if (config == null) {
            config = {};
        }
        // Get the numFrames lengths of all the examples currently held by the
        // dataset.
        const sortedUniqueNumFrames = this.getSortedUniqueNumFrames();
        let numFrames;
        let hopFrames;
        if (sortedUniqueNumFrames.length === 1) {
            numFrames = config.numFrames == null ? sortedUniqueNumFrames[0] :
                config.numFrames;
            hopFrames = config.hopFrames == null ? 1 : config.hopFrames;
        }
        else {
            numFrames = config.numFrames;
            tf.util.assert(numFrames != null && Number.isInteger(numFrames) && numFrames > 0, () => `There are ${sortedUniqueNumFrames.length} unique lengths among ` +
                `the ${this.size()} examples of this Dataset, hence numFrames ` +
                `is required. But it is not provided.`);
            tf.util.assert(numFrames <= sortedUniqueNumFrames[0], () => `numFrames (${numFrames}) exceeds the minimum numFrames ` +
                `(${sortedUniqueNumFrames[0]}) among the examples of ` +
                `the Dataset.`);
            hopFrames = config.hopFrames;
            tf.util.assert(hopFrames != null && Number.isInteger(hopFrames) && hopFrames > 0, () => `There are ${sortedUniqueNumFrames.length} unique lengths among ` +
                `the ${this.size()} examples of this Dataset, hence hopFrames ` +
                `is required. But it is not provided.`);
        }
        // Normalization is performed by default.
        const toNormalize = config.normalize == null ? true : config.normalize;
        return tf.tidy(() => {
            let xTensors = [];
            let xArrays = [];
            let labelIndices = [];
            let uniqueFrameSize;
            for (let i = 0; i < vocab.length; ++i) {
                const currentLabel = vocab[i];
                if (label != null && currentLabel !== label) {
                    continue;
                }
                const ids = this.label2Ids[currentLabel];
                for (const id of ids) {
                    const example = this.examples[id];
                    const spectrogram = example.spectrogram;
                    const frameSize = spectrogram.frameSize;
                    if (uniqueFrameSize == null) {
                        uniqueFrameSize = frameSize;
                    }
                    else {
                        tf.util.assert(frameSize === uniqueFrameSize, () => `Mismatch in frameSize  ` +
                            `(${frameSize} vs ${uniqueFrameSize})`);
                    }
                    const snippetLength = spectrogram.data.length / frameSize;
                    let focusIndex = null;
                    if (currentLabel !== exports.BACKGROUND_NOISE_TAG) {
                        focusIndex = spectrogram.keyFrameIndex == null ?
                            getMaxIntensityFrameIndex(spectrogram).dataSync()[0] :
                            spectrogram.keyFrameIndex;
                    }
                    // TODO(cais): See if we can get rid of dataSync();
                    const snippet = tf.tensor3d(spectrogram.data, [snippetLength, frameSize, 1]);
                    const windows = getValidWindows(snippetLength, focusIndex, numFrames, hopFrames);
                    for (const window of windows) {
                        const windowedSnippet = tf.tidy(() => {
                            const output = tf.slice(snippet, [window[0], 0, 0], [window[1] - window[0], -1, -1]);
                            return toNormalize ? (0, browser_fft_utils_1.normalize)(output) : output;
                        });
                        if (config.getDataset) {
                            // TODO(cais): See if we can do away with dataSync();
                            // TODO(cais): Shuffling?
                            xArrays.push(windowedSnippet.dataSync());
                        }
                        else {
                            xTensors.push(windowedSnippet);
                        }
                        if (label == null) {
                            labelIndices.push(i);
                        }
                    }
                    tf.dispose(snippet); // For memory saving.
                }
            }
            if (config.augmentByMixingNoiseRatio != null) {
                this.augmentByMixingNoise(config.getDataset ? xArrays :
                    xTensors, labelIndices, config.augmentByMixingNoiseRatio);
            }
            const shuffle = config.shuffle == null ? true : config.shuffle;
            if (config.getDataset) {
                const batchSize = config.datasetBatchSize == null ? 32 : config.datasetBatchSize;
                // Split the data into two splits: training and validation.
                const valSplit = config.datasetValidationSplit == null ?
                    0.15 :
                    config.datasetValidationSplit;
                tf.util.assert(valSplit > 0 && valSplit < 1, () => `Invalid dataset validation split: ${valSplit}`);
                const zippedXandYArrays = xArrays.map((xArray, i) => [xArray, labelIndices[i]]);
                tf.util.shuffle(zippedXandYArrays); // Shuffle the data before splitting.
                xArrays = zippedXandYArrays.map(item => item[0]);
                const yArrays = zippedXandYArrays.map(item => item[1]);
                const { trainXs, trainYs, valXs, valYs } = (0, training_utils_1.balancedTrainValSplitNumArrays)(xArrays, yArrays, valSplit);
                // TODO(cais): The typing around Float32Array is not working properly
                // for tf.data currently. Tighten the types when the tf.data bug is
                // fixed.
                // tslint:disable:no-any
                const xTrain = tfd.array(trainXs).map(x => tf.tensor3d(x, [
                    numFrames, uniqueFrameSize, 1
                ]));
                const yTrain = tfd.array(trainYs).map(y => tf.squeeze(tf.oneHot([y], vocab.length), [0]));
                // TODO(cais): See if we can tighten the typing.
                let trainDataset = tfd.zip({ xs: xTrain, ys: yTrain });
                if (shuffle) {
                    // Shuffle the dataset.
                    trainDataset = trainDataset.shuffle(xArrays.length);
                }
                trainDataset = trainDataset.batch(batchSize).prefetch(4);
                const xVal = tfd.array(valXs).map(x => tf.tensor3d(x, [
                    numFrames, uniqueFrameSize, 1
                ]));
                const yVal = tfd.array(valYs).map(y => tf.squeeze(tf.oneHot([y], vocab.length), [0]));
                let valDataset = tfd.zip({ xs: xVal, ys: yVal });
                valDataset = valDataset.batch(batchSize).prefetch(4);
                // tslint:enable:no-any
                // tslint:disable-next-line:no-any
                return [trainDataset, valDataset];
            }
            else {
                if (shuffle) {
                    // Shuffle the data.
                    const zipped = [];
                    xTensors.forEach((xTensor, i) => {
                        zipped.push({ x: xTensor, y: labelIndices[i] });
                    });
                    tf.util.shuffle(zipped);
                    xTensors = zipped.map(item => item.x);
                    labelIndices = zipped.map(item => item.y);
                }
                const targets = label == null ?
                    tf.cast(tf.oneHot(tf.tensor1d(labelIndices, 'int32'), vocab.length), 'float32') :
                    undefined;
                return {
                    xs: tf.stack(xTensors),
                    ys: targets
                };
            }
        });
    }
    augmentByMixingNoise(xs, labelIndices, ratio) {
        if (xs == null || xs.length === 0) {
            throw new Error(`Cannot perform augmentation because data is null or empty`);
        }
        const isTypedArray = xs[0] instanceof Float32Array;
        const vocab = this.getVocabulary();
        const noiseExampleIndices = [];
        const wordExampleIndices = [];
        for (let i = 0; i < labelIndices.length; ++i) {
            if (vocab[labelIndices[i]] === exports.BACKGROUND_NOISE_TAG) {
                noiseExampleIndices.push(i);
            }
            else {
                wordExampleIndices.push(i);
            }
        }
        if (noiseExampleIndices.length === 0) {
            throw new Error(`Cannot perform augmentation by mixing with noise when ` +
                `there is no example with label ${exports.BACKGROUND_NOISE_TAG}`);
        }
        const mixedXTensors = [];
        const mixedLabelIndices = [];
        for (const index of wordExampleIndices) {
            const noiseIndex = // Randomly sample from the noises, with replacement.
             noiseExampleIndices[(0, generic_utils_1.getRandomInteger)(0, noiseExampleIndices.length)];
            const signalTensor = isTypedArray ?
                tf.tensor1d(xs[index]) :
                xs[index];
            const noiseTensor = isTypedArray ?
                tf.tensor1d(xs[noiseIndex]) :
                xs[noiseIndex];
            const mixed = tf.tidy(() => (0, browser_fft_utils_1.normalize)(tf.add(signalTensor, tf.mul(noiseTensor, ratio))));
            if (isTypedArray) {
                mixedXTensors.push(mixed.dataSync());
            }
            else {
                mixedXTensors.push(mixed);
            }
            mixedLabelIndices.push(labelIndices[index]);
        }
        console.log(`Data augmentation: mixing noise: added ${mixedXTensors.length} ` +
            `examples`);
        mixedXTensors.forEach(tensor => xs.push(tensor));
        labelIndices.push(...mixedLabelIndices);
    }
    getSortedUniqueNumFrames() {
        const numFramesSet = new Set();
        const vocab = this.getVocabulary();
        for (let i = 0; i < vocab.length; ++i) {
            const label = vocab[i];
            const ids = this.label2Ids[label];
            for (const id of ids) {
                const spectrogram = this.examples[id].spectrogram;
                const numFrames = spectrogram.data.length / spectrogram.frameSize;
                numFramesSet.add(numFrames);
            }
        }
        const uniqueNumFrames = [...numFramesSet];
        uniqueNumFrames.sort();
        return uniqueNumFrames;
    }
    /**
     * Remove an example from the `Dataset`.
     *
     * @param uid The UID of the example to remove.
     * @throws Error if the UID doesn't exist in the `Dataset`.
     */
    removeExample(uid) {
        if (!(uid in this.examples)) {
            throw new Error(`Nonexistent example UID: ${uid}`);
        }
        const label = this.examples[uid].label;
        delete this.examples[uid];
        const index = this.label2Ids[label].indexOf(uid);
        this.label2Ids[label].splice(index, 1);
        if (this.label2Ids[label].length === 0) {
            delete this.label2Ids[label];
        }
    }
    /**
     * Set the key frame index of a given example.
     *
     * @param uid The UID of the example of which the `keyFrameIndex` is to be
     *   set.
     * @param keyFrameIndex The desired value of the `keyFrameIndex`. Must
     *   be >= 0, < the number of frames of the example, and an integer.
     * @throws Error If the UID and/or the `keyFrameIndex` value is invalid.
     */
    setExampleKeyFrameIndex(uid, keyFrameIndex) {
        if (!(uid in this.examples)) {
            throw new Error(`Nonexistent example UID: ${uid}`);
        }
        const spectrogram = this.examples[uid].spectrogram;
        const numFrames = spectrogram.data.length / spectrogram.frameSize;
        tf.util.assert(keyFrameIndex >= 0 && keyFrameIndex < numFrames &&
            Number.isInteger(keyFrameIndex), () => `Invalid keyFrameIndex: ${keyFrameIndex}. ` +
            `Must be >= 0, < ${numFrames}, and an integer.`);
        spectrogram.keyFrameIndex = keyFrameIndex;
    }
    /**
     * Get the total number of `Example` currently held by the `Dataset`.
     *
     * @returns Total `Example` count.
     */
    size() {
        return Object.keys(this.examples).length;
    }
    /**
     * Get the total duration of the `Example` currently held by `Dataset`,
     *
     * in milliseconds.
     *
     * @return Total duration in milliseconds.
     */
    durationMillis() {
        let durMillis = 0;
        const DEFAULT_FRAME_DUR_MILLIS = 23.22;
        for (const key in this.examples) {
            const spectrogram = this.examples[key].spectrogram;
            const frameDurMillis = spectrogram.frameDurationMillis | DEFAULT_FRAME_DUR_MILLIS;
            durMillis +=
                spectrogram.data.length / spectrogram.frameSize * frameDurMillis;
        }
        return durMillis;
    }
    /**
     * Query whether the `Dataset` is currently empty.
     *
     * I.e., holds zero examples.
     *
     * @returns Whether the `Dataset` is currently empty.
     */
    empty() {
        return this.size() === 0;
    }
    /**
     * Remove all `Example`s from the `Dataset`.
     */
    clear() {
        this.examples = {};
    }
    /**
     * Get the list of labels among all `Example`s the `Dataset` currently holds.
     *
     * @returns A sorted Array of labels, for the unique labels that belong to all
     *   `Example`s currently held by the `Dataset`.
     */
    getVocabulary() {
        const vocab = new Set();
        for (const uid in this.examples) {
            const example = this.examples[uid];
            vocab.add(example.label);
        }
        const sortedVocab = [...vocab];
        sortedVocab.sort();
        return sortedVocab;
    }
    /**
     * Serialize the `Dataset`.
     *
     * The `Examples` are sorted in the following order:
     *   - First, the labels in the vocabulary are sorted.
     *   - Second, the `Example`s for every label are sorted by the order in
     *     which they are added to this `Dataset`.
     *
     * @param wordLabels Optional word label(s) to serialize. If specified, only
     *   the examples with labels matching the argument will be serialized. If
     *   any specified word label does not exist in the vocabulary of this
     *   dataset, an Error will be thrown.
     * @returns A `ArrayBuffer` object amenable to transmission and storage.
     */
    serialize(wordLabels) {
        const vocab = this.getVocabulary();
        tf.util.assert(!this.empty(), () => `Cannot serialize empty Dataset`);
        if (wordLabels != null) {
            if (!Array.isArray(wordLabels)) {
                wordLabels = [wordLabels];
            }
            wordLabels.forEach(wordLabel => {
                if (vocab.indexOf(wordLabel) === -1) {
                    throw new Error(`Word label "${wordLabel}" does not exist in the ` +
                        `vocabulary of this dataset. The vocabulary is: ` +
                        `${JSON.stringify(vocab)}.`);
                }
            });
        }
        const manifest = [];
        const buffers = [];
        for (const label of vocab) {
            if (wordLabels != null && wordLabels.indexOf(label) === -1) {
                continue;
            }
            const ids = this.label2Ids[label];
            for (const id of ids) {
                const artifact = serializeExample(this.examples[id]);
                manifest.push(artifact.spec);
                buffers.push(artifact.data);
            }
        }
        return serializedExamples2ArrayBuffer({ manifest, data: (0, generic_utils_1.concatenateArrayBuffers)(buffers) });
    }
}
exports.Dataset = Dataset;
/** Serialize an `Example`. */
function serializeExample(example) {
    const hasRawAudio = example.rawAudio != null;
    const spec = {
        label: example.label,
        spectrogramNumFrames: example.spectrogram.data.length / example.spectrogram.frameSize,
        spectrogramFrameSize: example.spectrogram.frameSize,
    };
    if (example.spectrogram.keyFrameIndex != null) {
        spec.spectrogramKeyFrameIndex = example.spectrogram.keyFrameIndex;
    }
    let data = example.spectrogram.data.buffer.slice(0);
    if (hasRawAudio) {
        spec.rawAudioNumSamples = example.rawAudio.data.length;
        spec.rawAudioSampleRateHz = example.rawAudio.sampleRateHz;
        // Account for the fact that the data are all float32.
        data = (0, generic_utils_1.concatenateArrayBuffers)([data, example.rawAudio.data.buffer]);
    }
    return { spec, data };
}
exports.serializeExample = serializeExample;
/** Deserialize an `Example`. */
function deserializeExample(artifact) {
    const spectrogram = {
        frameSize: artifact.spec.spectrogramFrameSize,
        data: new Float32Array(artifact.data.slice(0, 4 * artifact.spec.spectrogramFrameSize *
            artifact.spec.spectrogramNumFrames))
    };
    if (artifact.spec.spectrogramKeyFrameIndex != null) {
        spectrogram.keyFrameIndex = artifact.spec.spectrogramKeyFrameIndex;
    }
    const ex = { label: artifact.spec.label, spectrogram };
    if (artifact.spec.rawAudioNumSamples != null) {
        ex.rawAudio = {
            sampleRateHz: artifact.spec.rawAudioSampleRateHz,
            data: new Float32Array(artifact.data.slice(4 * artifact.spec.spectrogramFrameSize *
                artifact.spec.spectrogramNumFrames))
        };
    }
    return ex;
}
exports.deserializeExample = deserializeExample;
/**
 * Encode intermediate serialization format as an ArrayBuffer.
 *
 * Format of the binary ArrayBuffer:
 *   1. An 8-byte descriptor (see above).
 *   2. A 4-byte version number as Uint32.
 *   3. A 4-byte number for the byte length of the JSON manifest.
 *   4. The encoded JSON manifest
 *   5. The binary data of the spectrograms, and raw audio (if any).
 *
 * @param serialized: Intermediate serialization format of a dataset.
 * @returns The binary conversion result as an ArrayBuffer.
 */
function serializedExamples2ArrayBuffer(serialized) {
    const manifestBuffer = (0, generic_utils_1.string2ArrayBuffer)(JSON.stringify(serialized.manifest));
    const descriptorBuffer = (0, generic_utils_1.string2ArrayBuffer)(exports.DATASET_SERIALIZATION_DESCRIPTOR);
    const version = new Uint32Array([exports.DATASET_SERIALIZATION_VERSION]);
    const manifestLength = new Uint32Array([manifestBuffer.byteLength]);
    const headerBuffer = (0, generic_utils_1.concatenateArrayBuffers)([descriptorBuffer, version.buffer, manifestLength.buffer]);
    return (0, generic_utils_1.concatenateArrayBuffers)([headerBuffer, manifestBuffer, serialized.data]);
}
/** Decode an ArrayBuffer as intermediate serialization format. */
function arrayBuffer2SerializedExamples(buffer) {
    tf.util.assert(buffer != null, () => 'Received null or undefined buffer');
    // Check descriptor.
    let offset = 0;
    const descriptor = (0, generic_utils_1.arrayBuffer2String)(buffer.slice(offset, exports.DATASET_SERIALIZATION_DESCRIPTOR.length));
    tf.util.assert(descriptor === exports.DATASET_SERIALIZATION_DESCRIPTOR, () => `Deserialization error: Invalid descriptor`);
    offset += exports.DATASET_SERIALIZATION_DESCRIPTOR.length;
    // Skip the version part for now. It may be used in the future.
    offset += 4;
    // Extract the length of the encoded manifest JSON as a Uint32.
    const manifestLength = new Uint32Array(buffer, offset, 1);
    offset += 4;
    const manifestBeginByte = offset;
    offset = manifestBeginByte + manifestLength[0];
    const manifestBytes = buffer.slice(manifestBeginByte, offset);
    const manifestString = (0, generic_utils_1.arrayBuffer2String)(manifestBytes);
    const manifest = JSON.parse(manifestString);
    const data = buffer.slice(offset);
    return { manifest, data };
}
exports.arrayBuffer2SerializedExamples = arrayBuffer2SerializedExamples;
/**
 * Get valid windows in a long snippet.
 *
 * Each window is represented by an inclusive left index and an exclusive
 * right index.
 *
 * @param snippetLength Long of the entire snippet. Must be a positive
 *   integer.
 * @param focusIndex Optional. If `null` or `undefined`, an array of
 *   evenly-spaced windows will be generated. The array of windows will
 *   start from the first possible location (i.e., [0, windowLength]).
 *   If not `null` or `undefined`, must be an integer >= 0 and < snippetLength.
 * @param windowLength Length of each window. Must be a positive integer and
 *   <= snippetLength.
 * @param windowHop Hops between successsive windows. Must be a positive
 *   integer.
 * @returns An array of [beginIndex, endIndex] pairs.
 */
function getValidWindows(snippetLength, focusIndex, windowLength, windowHop) {
    tf.util.assert(Number.isInteger(snippetLength) && snippetLength > 0, () => `snippetLength must be a positive integer, but got ${snippetLength}`);
    if (focusIndex != null) {
        tf.util.assert(Number.isInteger(focusIndex) && focusIndex >= 0, () => `focusIndex must be a non-negative integer, but got ${focusIndex}`);
    }
    tf.util.assert(Number.isInteger(windowLength) && windowLength > 0, () => `windowLength must be a positive integer, but got ${windowLength}`);
    tf.util.assert(Number.isInteger(windowHop) && windowHop > 0, () => `windowHop must be a positive integer, but got ${windowHop}`);
    tf.util.assert(windowLength <= snippetLength, () => `windowLength (${windowLength}) exceeds snippetLength ` +
        `(${snippetLength})`);
    tf.util.assert(focusIndex < snippetLength, () => `focusIndex (${focusIndex}) equals or exceeds snippetLength ` +
        `(${snippetLength})`);
    if (windowLength === snippetLength) {
        return [[0, snippetLength]];
    }
    const windows = [];
    if (focusIndex == null) {
        // Deal with the special case of no focus frame:
        // Output an array of evenly-spaced windows, starting from
        // the first possible location.
        let begin = 0;
        while (begin + windowLength <= snippetLength) {
            windows.push([begin, begin + windowLength]);
            begin += windowHop;
        }
        return windows;
    }
    const leftHalf = Math.floor(windowLength / 2);
    let left = focusIndex - leftHalf;
    if (left < 0) {
        left = 0;
    }
    else if (left + windowLength > snippetLength) {
        left = snippetLength - windowLength;
    }
    while (true) {
        if (left - windowHop < 0 || focusIndex >= left - windowHop + windowLength) {
            break;
        }
        left -= windowHop;
    }
    while (left + windowLength <= snippetLength) {
        if (focusIndex < left) {
            break;
        }
        windows.push([left, left + windowLength]);
        left += windowHop;
    }
    return windows;
}
exports.getValidWindows = getValidWindows;
/**
 * Calculate an intensity profile from a spectrogram.
 *
 * The intensity at each time frame is caclulated by simply averaging all the
 * spectral values that belong to that time frame.
 *
 * @param spectrogram The input spectrogram.
 * @returns The temporal profile of the intensity as a 1D tf.Tensor of shape
 *   `[numFrames]`.
 */
function spectrogram2IntensityCurve(spectrogram) {
    return tf.tidy(() => {
        const numFrames = spectrogram.data.length / spectrogram.frameSize;
        const x = tf.tensor2d(spectrogram.data, [numFrames, spectrogram.frameSize]);
        return tf.mean(x, -1);
    });
}
exports.spectrogram2IntensityCurve = spectrogram2IntensityCurve;
/**
 * Get the index to the maximum intensity frame.
 *
 * The intensity of each time frame is calculated as the arithmetic mean of
 * all the spectral values belonging to that time frame.
 *
 * @param spectrogram The input spectrogram.
 * @returns The index to the time frame containing the maximum intensity.
 */
function getMaxIntensityFrameIndex(spectrogram) {
    return tf.tidy(() => tf.argMax(spectrogram2IntensityCurve(spectrogram)));
}
exports.getMaxIntensityFrameIndex = getMaxIntensityFrameIndex;
