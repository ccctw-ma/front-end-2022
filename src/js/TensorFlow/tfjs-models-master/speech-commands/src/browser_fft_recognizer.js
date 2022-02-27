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
exports.deleteSavedTransferModel = exports.listSavedTransferModels = exports.BrowserFftSpeechCommandRecognizer = exports.getMajorAndMinorVersion = exports.localStorageWrapper = exports.SAVE_PATH_PREFIX = exports.SAVED_MODEL_METADATA_KEY = exports.UNKNOWN_TAG = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tfl = __importStar(require("@tensorflow/tfjs-layers"));
const browser_fft_extractor_1 = require("./browser_fft_extractor");
const browser_fft_utils_1 = require("./browser_fft_utils");
const dataset_1 = require("./dataset");
const generic_utils_1 = require("./generic_utils");
const training_utils_1 = require("./training_utils");
const version_1 = require("./version");
exports.UNKNOWN_TAG = '_unknown_';
// Key to the local-storage item that holds a map from model name to word
// list.
exports.SAVED_MODEL_METADATA_KEY = 'tfjs-speech-commands-saved-model-metadata';
exports.SAVE_PATH_PREFIX = 'indexeddb://tfjs-speech-commands-model/';
// Export a variable for injection during unit testing.
// tslint:disable-next-line:no-any
exports.localStorageWrapper = {
    localStorage: typeof window === 'undefined' ? null : window.localStorage
};
function getMajorAndMinorVersion(version) {
    const versionItems = version.split('.');
    return versionItems.slice(0, 2).join('.');
}
exports.getMajorAndMinorVersion = getMajorAndMinorVersion;
/**
 * Default window hop ratio used for extracting multiple
 * windows from a long spectrogram.
 */
const DEFAULT_WINDOW_HOP_RATIO = 0.25;
/**
 * Speech-Command Recognizer using browser-native (WebAudio) spectral featutres.
 */
class BrowserFftSpeechCommandRecognizer {
    /**
     * Constructor of BrowserFftSpeechCommandRecognizer.
     *
     * @param vocabulary An optional vocabulary specifier. Mutually exclusive
     *   with `modelURL` and `metadataURL`.
     * @param modelArtifactsOrURL An optional, custom model URL pointing to a
     *     model.json, or modelArtifacts in the format of `tf.io.ModelArtifacts`.
     *   file. Supported schemes: http://, https://, and node.js-only: file://.
     *   Mutually exclusive with `vocabulary`. If provided, `metadatURL`
     *   most also be provided.
     * @param metadataOrURL A custom metadata URL pointing to a metadata.json
     *   file. Or it can be a metadata JSON object itself. Must be provided
     *   together with `modelArtifactsOrURL`.
     */
    constructor(vocabulary, modelArtifactsOrURL, metadataOrURL) {
        this.MODEL_URL_PREFIX = `https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v${getMajorAndMinorVersion(version_1.version)}/browser_fft`;
        this.SAMPLE_RATE_HZ = 44100;
        this.FFT_SIZE = 1024;
        this.DEFAULT_SUPPRESSION_TIME_MILLIS = 0;
        this.streaming = false;
        this.transferRecognizers = {};
        // TODO(cais): Consolidate the fields into a single config object when
        // upgrading to v1.0.
        tf.util.assert(modelArtifactsOrURL == null && metadataOrURL == null ||
            modelArtifactsOrURL != null && metadataOrURL != null, () => `modelURL and metadataURL must be both provided or ` +
            `both not provided.`);
        if (modelArtifactsOrURL == null) {
            if (vocabulary == null) {
                vocabulary = BrowserFftSpeechCommandRecognizer.DEFAULT_VOCABULARY_NAME;
            }
            else {
                tf.util.assert(BrowserFftSpeechCommandRecognizer.VALID_VOCABULARY_NAMES.indexOf(vocabulary) !== -1, () => `Invalid vocabulary name: '${vocabulary}'`);
            }
            this.vocabulary = vocabulary;
            this.modelArtifactsOrURL =
                `${this.MODEL_URL_PREFIX}/${this.vocabulary}/model.json`;
            this.metadataOrURL =
                `${this.MODEL_URL_PREFIX}/${this.vocabulary}/metadata.json`;
        }
        else {
            tf.util.assert(vocabulary == null, () => `vocabulary name must be null or undefined when modelURL is ` +
                `provided`);
            this.modelArtifactsOrURL = modelArtifactsOrURL;
            this.metadataOrURL = metadataOrURL;
        }
        this.parameters = {
            sampleRateHz: this.SAMPLE_RATE_HZ,
            fftSize: this.FFT_SIZE
        };
    }
    /**
     * Start streaming recognition.
     *
     * To stop the recognition, use `stopListening()`.
     *
     * Example: TODO(cais): Add exapmle code snippet.
     *
     * @param callback The callback invoked whenever a word is recognized
     *   with a probability score greater than `config.probabilityThreshold`.
     *   It has the signature:
     *     (result: SpeechCommandRecognizerResult) => Promise<void>
     *   wherein result has the two fields:
     *   - scores: A Float32Array that contains the probability scores for all
     *     the words.
     *   - spectrogram: The spectrogram data, provided only if
     *     `config.includeSpectrogram` is `true`.
     * @param config The configurations for the streaming recognition to
     *   be started.
     *   The `modelName` field of `config` specifies the model to be used for
     *   online recognition. If not specified, it defaults to the name of the
     *   base model ('base'), i.e., the pretrained model not from transfer
     *   learning. If the recognizer instance has one or more transfer-learning
     *   models ready (as a result of calls to `collectTransferExample`
     *   and `trainTransferModel`), you can let this call use that
     *   model for prediction by specifying the corresponding `modelName`.
     * @throws Error, if streaming recognition is already started or
     *   if `config` contains invalid values.
     */
    listen(callback, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.streaming) {
                throw new Error('Cannot start streaming again when streaming is ongoing.');
            }
            yield this.ensureModelLoaded();
            if (config == null) {
                config = {};
            }
            let probabilityThreshold = config.probabilityThreshold == null ? 0 : config.probabilityThreshold;
            if (config.includeEmbedding) {
                // Override probability threshold to 0 if includeEmbedding is true.
                probabilityThreshold = 0;
            }
            tf.util.assert(probabilityThreshold >= 0 && probabilityThreshold <= 1, () => `Invalid probabilityThreshold value: ${probabilityThreshold}`);
            let invokeCallbackOnNoiseAndUnknown = config.invokeCallbackOnNoiseAndUnknown == null ?
                false :
                config.invokeCallbackOnNoiseAndUnknown;
            if (config.includeEmbedding) {
                // Override invokeCallbackOnNoiseAndUnknown threshold to true if
                // includeEmbedding is true.
                invokeCallbackOnNoiseAndUnknown = true;
            }
            if (config.suppressionTimeMillis < 0) {
                throw new Error(`suppressionTimeMillis is expected to be >= 0, ` +
                    `but got ${config.suppressionTimeMillis}`);
            }
            const overlapFactor = config.overlapFactor == null ? 0.5 : config.overlapFactor;
            tf.util.assert(overlapFactor >= 0 && overlapFactor < 1, () => `Expected overlapFactor to be >= 0 and < 1, but got ${overlapFactor}`);
            const spectrogramCallback = (x, timeData) => __awaiter(this, void 0, void 0, function* () {
                const normalizedX = (0, browser_fft_utils_1.normalize)(x);
                let y;
                let embedding;
                if (config.includeEmbedding) {
                    yield this.ensureModelWithEmbeddingOutputCreated();
                    [y, embedding] =
                        this.modelWithEmbeddingOutput.predict(normalizedX);
                }
                else {
                    y = this.model.predict(normalizedX);
                }
                const scores = yield y.data();
                const maxIndexTensor = y.argMax(-1);
                const maxIndex = (yield maxIndexTensor.data())[0];
                const maxScore = Math.max(...scores);
                tf.dispose([y, maxIndexTensor, normalizedX]);
                if (maxScore < probabilityThreshold) {
                    return false;
                }
                else {
                    let spectrogram = undefined;
                    if (config.includeSpectrogram) {
                        spectrogram = {
                            data: yield x.data(),
                            frameSize: this.nonBatchInputShape[1],
                        };
                    }
                    let wordDetected = true;
                    if (!invokeCallbackOnNoiseAndUnknown) {
                        // Skip background noise and unknown tokens.
                        if (this.words[maxIndex] === dataset_1.BACKGROUND_NOISE_TAG ||
                            this.words[maxIndex] === exports.UNKNOWN_TAG) {
                            wordDetected = false;
                        }
                    }
                    if (wordDetected) {
                        callback({ scores, spectrogram, embedding });
                    }
                    // Trigger suppression only if the word is neither unknown or
                    // background noise.
                    return wordDetected;
                }
            });
            const suppressionTimeMillis = config.suppressionTimeMillis == null ?
                this.DEFAULT_SUPPRESSION_TIME_MILLIS :
                config.suppressionTimeMillis;
            this.audioDataExtractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
                sampleRateHz: this.parameters.sampleRateHz,
                numFramesPerSpectrogram: this.nonBatchInputShape[0],
                columnTruncateLength: this.nonBatchInputShape[1],
                suppressionTimeMillis,
                spectrogramCallback,
                overlapFactor
            });
            yield this.audioDataExtractor.start(config.audioTrackConstraints);
            this.streaming = true;
        });
    }
    /**
     * Load the underlying tf.LayersModel instance and associated metadata.
     *
     * If the model and the metadata are already loaded, do nothing.
     */
    ensureModelLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.model != null) {
                return;
            }
            yield this.ensureMetadataLoaded();
            let model;
            if (typeof this.modelArtifactsOrURL === 'string') {
                model = yield tfl.loadLayersModel(this.modelArtifactsOrURL);
            }
            else {
                // this.modelArtifactsOrURL is an instance of `tf.io.ModelArtifacts`.
                model = yield tfl.loadLayersModel(tf.io.fromMemory(this.modelArtifactsOrURL.modelTopology, this.modelArtifactsOrURL.weightSpecs, this.modelArtifactsOrURL.weightData));
            }
            // Check the validity of the model's input shape.
            if (model.inputs.length !== 1) {
                throw new Error(`Expected model to have 1 input, but got a model with ` +
                    `${model.inputs.length} inputs`);
            }
            if (model.inputs[0].shape.length !== 4) {
                throw new Error(`Expected model to have an input shape of rank 4, ` +
                    `but got an input shape of rank ${model.inputs[0].shape.length}`);
            }
            if (model.inputs[0].shape[3] !== 1) {
                throw new Error(`Expected model to have an input shape with 1 as the last ` +
                    `dimension, but got input shape` +
                    `${JSON.stringify(model.inputs[0].shape[3])}}`);
            }
            // Check the consistency between the word labels and the model's output
            // shape.
            const outputShape = model.outputShape;
            if (outputShape.length !== 2) {
                throw new Error(`Expected loaded model to have an output shape of rank 2,` +
                    `but received shape ${JSON.stringify(outputShape)}`);
            }
            if (outputShape[1] !== this.words.length) {
                throw new Error(`Mismatch between the last dimension of model's output shape ` +
                    `(${outputShape[1]}) and number of words ` +
                    `(${this.words.length}).`);
            }
            this.model = model;
            this.freezeModel();
            this.nonBatchInputShape =
                model.inputs[0].shape.slice(1);
            this.elementsPerExample = 1;
            model.inputs[0].shape.slice(1).forEach(dimSize => this.elementsPerExample *= dimSize);
            this.warmUpModel();
            const frameDurationMillis = this.parameters.fftSize / this.parameters.sampleRateHz * 1e3;
            const numFrames = model.inputs[0].shape[1];
            this.parameters.spectrogramDurationMillis = numFrames * frameDurationMillis;
        });
    }
    /**
     * Construct a two-output model that includes the following outputs:
     *
     * 1. The same softmax probability output as the original model's output
     * 2. The embedding, i.e., activation from the second-last dense layer of
     *    the original model.
     */
    ensureModelWithEmbeddingOutputCreated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.modelWithEmbeddingOutput != null) {
                return;
            }
            yield this.ensureModelLoaded();
            // Find the second last dense layer of the original model.
            let secondLastDenseLayer;
            for (let i = this.model.layers.length - 2; i >= 0; --i) {
                if (this.model.layers[i].getClassName() === 'Dense') {
                    secondLastDenseLayer = this.model.layers[i];
                    break;
                }
            }
            if (secondLastDenseLayer == null) {
                throw new Error('Failed to find second last dense layer in the original model.');
            }
            this.modelWithEmbeddingOutput = tfl.model({
                inputs: this.model.inputs,
                outputs: [
                    this.model.outputs[0], secondLastDenseLayer.output
                ]
            });
        });
    }
    warmUpModel() {
        tf.tidy(() => {
            const x = tf.zeros([1].concat(this.nonBatchInputShape));
            for (let i = 0; i < 3; ++i) {
                this.model.predict(x);
            }
        });
    }
    ensureMetadataLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.words != null) {
                return;
            }
            const metadataJSON = typeof this.metadataOrURL === 'string' ?
                yield (0, browser_fft_utils_1.loadMetadataJson)(this.metadataOrURL) :
                this.metadataOrURL;
            if (metadataJSON.wordLabels == null) {
                // In some legacy formats, the field 'words', instead of 'wordLabels',
                // was populated. This branch ensures backward compatibility with those
                // formats.
                // tslint:disable-next-line:no-any
                const legacyWords = metadataJSON['words'];
                if (legacyWords == null) {
                    throw new Error('Cannot find field "words" or "wordLabels" in metadata JSON file');
                }
                this.words = legacyWords;
            }
            else {
                this.words = metadataJSON.wordLabels;
            }
        });
    }
    /**
     * Stop streaming recognition.
     *
     * @throws Error if there is not ongoing streaming recognition.
     */
    stopListening() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.streaming) {
                throw new Error('Cannot stop streaming when streaming is not ongoing.');
            }
            yield this.audioDataExtractor.stop();
            this.streaming = false;
        });
    }
    /**
     * Check if streaming recognition is ongoing.
     */
    isListening() {
        return this.streaming;
    }
    /**
     * Get the array of word labels.
     *
     * @throws Error If this model is called before the model is loaded.
     */
    wordLabels() {
        return this.words;
    }
    /**
     * Get the parameters of this instance of BrowserFftSpeechCommandRecognizer.
     *
     * @returns Parameters of this instance.
     */
    params() {
        return this.parameters;
    }
    /**
     * Get the input shape of the underlying tf.LayersModel.
     *
     * @returns The input shape.
     */
    modelInputShape() {
        if (this.model == null) {
            throw new Error('Model has not been loaded yet. Load model by calling ' +
                'ensureModelLoaded(), recognize(), or listen().');
        }
        return this.model.inputs[0].shape;
    }
    /**
     * Run offline (non-streaming) recognition on a spectrogram.
     *
     * @param input Spectrogram. Either a `tf.Tensor` of a `Float32Array`.
     *   - If a `tf.Tensor`, must be rank-4 and match the model's expected
     *     input shape in 2nd dimension (# of spectrogram columns), the 3rd
     *     dimension (# of frequency-domain points per column), and the 4th
     *     dimension (always 1). The 1st dimension can be 1, for single-example
     *     recogntion, or any value >1, for batched recognition.
     *   - If a `Float32Array`, must have a length divisible by the number
     *     of elements per spectrogram, i.e.,
     *     (# of spectrogram columns) * (# of frequency-domain points per column).
     * @param config Optional configuration object.
     * @returns Result of the recognition, with the following field:
     *   scores:
     *   - A `Float32Array` if there is only one input exapmle.
     *   - An `Array` of `Float32Array`, if there are multiple input examples.
     */
    recognize(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config == null) {
                config = {};
            }
            yield this.ensureModelLoaded();
            if (input == null) {
                // If `input` is not provided, draw audio data from WebAudio and us it
                // for recognition.
                const spectrogramData = yield this.recognizeOnline();
                input = spectrogramData.data;
            }
            let numExamples;
            let inputTensor;
            let outTensor;
            if (input instanceof tf.Tensor) {
                // Check input shape.
                this.checkInputTensorShape(input);
                inputTensor = input;
                numExamples = input.shape[0];
            }
            else {
                if (input.length % this.elementsPerExample) {
                    throw new Error(`The length of the input Float32Array ${input.length} ` +
                        `is not divisible by the number of tensor elements per ` +
                        `per example expected by the model ${this.elementsPerExample}.`);
                }
                numExamples = input.length / this.elementsPerExample;
                inputTensor = tf.tensor4d(input, [
                    numExamples
                ].concat(this.nonBatchInputShape));
            }
            const output = { scores: null };
            if (config.includeEmbedding) {
                // Optional inclusion of embedding (internal activation).
                yield this.ensureModelWithEmbeddingOutputCreated();
                const outAndEmbedding = this.modelWithEmbeddingOutput.predict(inputTensor);
                outTensor = outAndEmbedding[0];
                output.embedding = outAndEmbedding[1];
            }
            else {
                outTensor = this.model.predict(inputTensor);
            }
            if (numExamples === 1) {
                output.scores = (yield outTensor.data());
            }
            else {
                const unstacked = tf.unstack(outTensor);
                const scorePromises = unstacked.map(item => item.data());
                output.scores = (yield Promise.all(scorePromises));
                tf.dispose(unstacked);
            }
            if (config.includeSpectrogram) {
                output.spectrogram = {
                    data: (input instanceof tf.Tensor ? yield input.data() : input),
                    frameSize: this.nonBatchInputShape[1],
                };
            }
            tf.dispose(outTensor);
            return output;
        });
    }
    recognizeOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const spectrogramCallback = (x) => __awaiter(this, void 0, void 0, function* () {
                    const normalizedX = (0, browser_fft_utils_1.normalize)(x);
                    yield this.audioDataExtractor.stop();
                    resolve({
                        data: yield normalizedX.data(),
                        frameSize: this.nonBatchInputShape[1],
                    });
                    normalizedX.dispose();
                    return false;
                });
                this.audioDataExtractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
                    sampleRateHz: this.parameters.sampleRateHz,
                    numFramesPerSpectrogram: this.nonBatchInputShape[0],
                    columnTruncateLength: this.nonBatchInputShape[1],
                    suppressionTimeMillis: 0,
                    spectrogramCallback,
                    overlapFactor: 0
                });
                this.audioDataExtractor.start();
            });
        });
    }
    createTransfer(name) {
        if (this.model == null) {
            throw new Error('Model has not been loaded yet. Load model by calling ' +
                'ensureModelLoaded(), recognizer(), or listen().');
        }
        tf.util.assert(name != null && typeof name === 'string' && name.length > 1, () => `Expected the name for a transfer-learning recognized to be a ` +
            `non-empty string, but got ${JSON.stringify(name)}`);
        tf.util.assert(this.transferRecognizers[name] == null, () => `There is already a transfer-learning model named '${name}'`);
        const transfer = new TransferBrowserFftSpeechCommandRecognizer(name, this.parameters, this.model);
        this.transferRecognizers[name] = transfer;
        return transfer;
    }
    freezeModel() {
        for (const layer of this.model.layers) {
            layer.trainable = false;
        }
    }
    checkInputTensorShape(input) {
        const expectedRank = this.model.inputs[0].shape.length;
        if (input.shape.length !== expectedRank) {
            throw new Error(`Expected input Tensor to have rank ${expectedRank}, ` +
                `but got rank ${input.shape.length} that differs `);
        }
        const nonBatchedShape = input.shape.slice(1);
        const expectedNonBatchShape = this.model.inputs[0].shape.slice(1);
        if (!tf.util.arraysEqual(nonBatchedShape, expectedNonBatchShape)) {
            throw new Error(`Expected input to have shape [null,${expectedNonBatchShape}], ` +
                `but got shape [null,${nonBatchedShape}]`);
        }
    }
}
exports.BrowserFftSpeechCommandRecognizer = BrowserFftSpeechCommandRecognizer;
BrowserFftSpeechCommandRecognizer.VALID_VOCABULARY_NAMES = ['18w', 'directional4w'];
BrowserFftSpeechCommandRecognizer.DEFAULT_VOCABULARY_NAME = '18w';
/**
 * A subclass of BrowserFftSpeechCommandRecognizer: Transfer-learned model.
 */
class TransferBrowserFftSpeechCommandRecognizer extends BrowserFftSpeechCommandRecognizer {
    /**
     * Constructor of TransferBrowserFftSpeechCommandRecognizer.
     *
     * @param name Name of the transfer-learned recognizer. Must be a non-empty
     *   string.
     * @param parameters Parameters from the base recognizer.
     * @param baseModel Model from the base recognizer.
     */
    constructor(name, parameters, baseModel) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.baseModel = baseModel;
        tf.util.assert(name != null && typeof name === 'string' && name.length > 0, () => `The name of a transfer model must be a non-empty string, ` +
            `but got ${JSON.stringify(name)}`);
        this.nonBatchInputShape =
            this.baseModel.inputs[0].shape.slice(1);
        this.words = null;
        this.dataset = new dataset_1.Dataset();
    }
    /**
     * Collect an example for transfer learning via WebAudio.
     *
     * @param {string} word Name of the word. Must not overlap with any of the
     *   words the base model is trained to recognize.
     * @param {ExampleCollectionOptions}
     * @returns {SpectrogramData} The spectrogram of the acquired the example.
     * @throws Error, if word belongs to the set of words the base model is
     *   trained to recognize.
     */
    collectExample(word, options) {
        return __awaiter(this, void 0, void 0, function* () {
            tf.util.assert(!this.streaming, () => 'Cannot start collection of transfer-learning example because ' +
                'a streaming recognition or transfer-learning example collection ' +
                'is ongoing');
            tf.util.assert(word != null && typeof word === 'string' && word.length > 0, () => `Must provide a non-empty string when collecting transfer-` +
                `learning example`);
            if (options == null) {
                options = {};
            }
            if (options.durationMultiplier != null && options.durationSec != null) {
                throw new Error(`durationMultiplier and durationSec are mutually exclusive, ` +
                    `but are both specified.`);
            }
            let numFramesPerSpectrogram;
            if (options.durationSec != null) {
                tf.util.assert(options.durationSec > 0, () => `Expected durationSec to be > 0, but got ${options.durationSec}`);
                const frameDurationSec = this.parameters.fftSize / this.parameters.sampleRateHz;
                numFramesPerSpectrogram =
                    Math.ceil(options.durationSec / frameDurationSec);
            }
            else if (options.durationMultiplier != null) {
                tf.util.assert(options.durationMultiplier >= 1, () => `Expected duration multiplier to be >= 1, ` +
                    `but got ${options.durationMultiplier}`);
                numFramesPerSpectrogram =
                    Math.round(this.nonBatchInputShape[0] * options.durationMultiplier);
            }
            else {
                numFramesPerSpectrogram = this.nonBatchInputShape[0];
            }
            if (options.snippetDurationSec != null) {
                tf.util.assert(options.snippetDurationSec > 0, () => `snippetDurationSec is expected to be > 0, but got ` +
                    `${options.snippetDurationSec}`);
                tf.util.assert(options.onSnippet != null, () => `onSnippet must be provided if snippetDurationSec ` +
                    `is provided.`);
            }
            if (options.onSnippet != null) {
                tf.util.assert(options.snippetDurationSec != null, () => `snippetDurationSec must be provided if onSnippet ` +
                    `is provided.`);
            }
            const frameDurationSec = this.parameters.fftSize / this.parameters.sampleRateHz;
            const totalDurationSec = frameDurationSec * numFramesPerSpectrogram;
            this.streaming = true;
            return new Promise(resolve => {
                const stepFactor = options.snippetDurationSec == null ?
                    1 :
                    options.snippetDurationSec / totalDurationSec;
                const overlapFactor = 1 - stepFactor;
                const callbackCountTarget = Math.round(1 / stepFactor);
                let callbackCount = 0;
                let lastIndex = -1;
                const spectrogramSnippets = [];
                const spectrogramCallback = (freqData, timeData) => __awaiter(this, void 0, void 0, function* () {
                    // TODO(cais): can we consolidate the logic in the two branches?
                    if (options.onSnippet == null) {
                        const normalizedX = (0, browser_fft_utils_1.normalize)(freqData);
                        this.dataset.addExample({
                            label: word,
                            spectrogram: {
                                data: yield normalizedX.data(),
                                frameSize: this.nonBatchInputShape[1],
                            },
                            rawAudio: options.includeRawAudio ? {
                                data: yield timeData.data(),
                                sampleRateHz: this.audioDataExtractor.sampleRateHz
                            } :
                                undefined
                        });
                        normalizedX.dispose();
                        yield this.audioDataExtractor.stop();
                        this.streaming = false;
                        this.collateTransferWords();
                        resolve({
                            data: yield freqData.data(),
                            frameSize: this.nonBatchInputShape[1],
                        });
                    }
                    else {
                        const data = yield freqData.data();
                        if (lastIndex === -1) {
                            lastIndex = data.length;
                        }
                        let i = lastIndex - 1;
                        while (data[i] !== 0 && i >= 0) {
                            i--;
                        }
                        const increment = lastIndex - i - 1;
                        lastIndex = i + 1;
                        const snippetData = data.slice(data.length - increment, data.length);
                        spectrogramSnippets.push(snippetData);
                        if (options.onSnippet != null) {
                            options.onSnippet({ data: snippetData, frameSize: this.nonBatchInputShape[1] });
                        }
                        if (callbackCount++ === callbackCountTarget) {
                            yield this.audioDataExtractor.stop();
                            this.streaming = false;
                            this.collateTransferWords();
                            const normalized = (0, browser_fft_utils_1.normalizeFloat32Array)((0, generic_utils_1.concatenateFloat32Arrays)(spectrogramSnippets));
                            const finalSpectrogram = {
                                data: normalized,
                                frameSize: this.nonBatchInputShape[1]
                            };
                            this.dataset.addExample({
                                label: word,
                                spectrogram: finalSpectrogram,
                                rawAudio: options.includeRawAudio ? {
                                    data: yield timeData.data(),
                                    sampleRateHz: this.audioDataExtractor.sampleRateHz
                                } :
                                    undefined
                            });
                            // TODO(cais): Fix 1-tensor memory leak.
                            resolve(finalSpectrogram);
                        }
                    }
                    return false;
                });
                this.audioDataExtractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
                    sampleRateHz: this.parameters.sampleRateHz,
                    numFramesPerSpectrogram,
                    columnTruncateLength: this.nonBatchInputShape[1],
                    suppressionTimeMillis: 0,
                    spectrogramCallback,
                    overlapFactor,
                    includeRawAudio: options.includeRawAudio
                });
                this.audioDataExtractor.start(options.audioTrackConstraints);
            });
        });
    }
    /**
     * Clear all transfer learning examples collected so far.
     */
    clearExamples() {
        tf.util.assert(this.words != null && this.words.length > 0 && !this.dataset.empty(), () => `No transfer learning examples exist for model name ${this.name}`);
        this.dataset.clear();
        this.words = null;
    }
    /**
     * Get counts of the word examples that have been collected for a
     * transfer-learning model.
     *
     * @returns {{[word: string]: number}} A map from word name to number of
     *   examples collected for that word so far.
     */
    countExamples() {
        if (this.dataset.empty()) {
            throw new Error(`No examples have been collected for transfer-learning model ` +
                `named '${this.name}' yet.`);
        }
        return this.dataset.getExampleCounts();
    }
    /**
     * Get examples currently held by the transfer-learning recognizer.
     *
     * @param label Label requested.
     * @returns An array of `Example`s, along with their UIDs.
     */
    getExamples(label) {
        return this.dataset.getExamples(label);
    }
    /** Set the key frame index of a given example. */
    setExampleKeyFrameIndex(uid, keyFrameIndex) {
        this.dataset.setExampleKeyFrameIndex(uid, keyFrameIndex);
    }
    /**
     * Remove an example from the current dataset.
     *
     * @param uid The UID of the example to remove.
     */
    removeExample(uid) {
        this.dataset.removeExample(uid);
        this.collateTransferWords();
    }
    /**
     * Check whether the underlying dataset is empty.
     *
     * @returns A boolean indicating whether the underlying dataset is empty.
     */
    isDatasetEmpty() {
        return this.dataset.empty();
    }
    /**
     * Load an array of serialized examples.
     *
     * @param serialized The examples in their serialized format.
     * @param clearExisting Whether to clear the existing examples while
     *   performing the loading (default: false).
     */
    loadExamples(serialized, clearExisting = false) {
        const incomingDataset = new dataset_1.Dataset(serialized);
        if (clearExisting) {
            this.clearExamples();
        }
        const incomingVocab = incomingDataset.getVocabulary();
        for (const label of incomingVocab) {
            const examples = incomingDataset.getExamples(label);
            for (const example of examples) {
                this.dataset.addExample(example.example);
            }
        }
        this.collateTransferWords();
    }
    /**
     * Serialize the existing examples.
     *
     * @param wordLabels Optional word label(s) to serialize. If specified, only
     *   the examples with labels matching the argument will be serialized. If
     *   any specified word label does not exist in the vocabulary of this
     *   transfer recognizer, an Error will be thrown.
     * @returns An `ArrayBuffer` object amenable to transmission and storage.
     */
    serializeExamples(wordLabels) {
        return this.dataset.serialize(wordLabels);
    }
    /**
     * Collect the vocabulary of this transfer-learned recognizer.
     *
     * The words are put in an alphabetically sorted order.
     */
    collateTransferWords() {
        this.words = this.dataset.getVocabulary();
    }
    /**
     * Collect the transfer-learning data as `tf.Tensor`s.
     *
     * Used for training and evaluation when the amount of data is relatively
     * small.
     *
     * @param windowHopRatio Ratio betwen hop length in number of frames and the
     *   number of frames in a long spectrogram. Used during extraction
     *   of multiple windows from the long spectrogram.
     * @returns xs: The feature tensors (xs), a 4D tf.Tensor.
     *          ys: The target tensors (ys), one-hot encoding, a 2D tf.Tensor.
     */
    collectTransferDataAsTensors(windowHopRatio, augmentationOptions) {
        const numFrames = this.nonBatchInputShape[0];
        windowHopRatio = windowHopRatio || DEFAULT_WINDOW_HOP_RATIO;
        const hopFrames = Math.round(windowHopRatio * numFrames);
        const out = this.dataset.getData(null, Object.assign({ numFrames, hopFrames }, augmentationOptions));
        return { xs: out.xs, ys: out.ys };
    }
    /**
     * Same as `collectTransferDataAsTensors`, but returns `tf.data.Dataset`s.
     *
     * Used for training and evaluation when the amount of data is large.
     *
     * @param windowHopRatio Ratio betwen hop length in number of frames and the
     *   number of frames in a long spectrogram. Used during extraction
     *   of multiple windows from the long spectrogram.
     * @param validationSplit The validation split to be used for splitting
     *   the raw data between the `tf.data.Dataset` objects for training and
     *   validation.
     * @param batchSize Batch size used for the `tf.data.Dataset.batch()` call
     *   during the creation of the dataset objects.
     * @return Two `tf.data.Dataset` objects, one for training and one for
     *   validation. Each of the objects may be directly fed into
     *   `this.model.fitDataset`.
     */
    collectTransferDataAsTfDataset(windowHopRatio, validationSplit = 0.15, batchSize = 32, augmentationOptions) {
        const numFrames = this.nonBatchInputShape[0];
        windowHopRatio = windowHopRatio || DEFAULT_WINDOW_HOP_RATIO;
        const hopFrames = Math.round(windowHopRatio * numFrames);
        return this.dataset.getData(null, Object.assign({ numFrames,
            hopFrames, getDataset: true, datasetBatchSize: batchSize, datasetValidationSplit: validationSplit }, augmentationOptions));
        // TODO(cais): See if we can tighten the typing.
    }
    /**
     * Train the transfer-learning model.
     *
     * The last dense layer of the base model is replaced with new softmax dense
     * layer.
     *
     * It is assume that at least one category of data has been collected (using
     * multiple calls to the `collectTransferExample` method).
     *
     * @param config {TransferLearnConfig} Optional configurations fot the
     *   training of the transfer-learning model.
     * @returns {tf.History} A history object with the loss and accuracy values
     *   from the training of the transfer-learning model.
     * @throws Error, if `modelName` is invalid or if not sufficient training
     *   examples have been collected yet.
     */
    train(config) {
        return __awaiter(this, void 0, void 0, function* () {
            tf.util.assert(this.words != null && this.words.length > 0, () => `Cannot train transfer-learning model '${this.name}' because no ` +
                `transfer learning example has been collected.`);
            tf.util.assert(this.words.length > 1, () => `Cannot train transfer-learning model '${this.name}' because only ` +
                `1 word label ('${JSON.stringify(this.words)}') ` +
                `has been collected for transfer learning. Requires at least 2.`);
            if (config.fineTuningEpochs != null) {
                tf.util.assert(config.fineTuningEpochs >= 0 &&
                    Number.isInteger(config.fineTuningEpochs), () => `If specified, fineTuningEpochs must be a non-negative ` +
                    `integer, but received ${config.fineTuningEpochs}`);
            }
            if (config == null) {
                config = {};
            }
            if (this.model == null) {
                this.createTransferModelFromBaseModel();
            }
            // This layer needs to be frozen for the initial phase of the
            // transfer learning. During subsequent fine-tuning (if any), it will
            // be unfrozen.
            this.secondLastBaseDenseLayer.trainable = false;
            // Compile model for training.
            this.model.compile({
                loss: 'categoricalCrossentropy',
                optimizer: config.optimizer || 'sgd',
                metrics: ['acc']
            });
            // Use `tf.data.Dataset` objects for training of the total duration of
            // the recordings exceeds 60 seconds. Otherwise, use `tf.Tensor` objects.
            const datasetDurationMillisThreshold = config.fitDatasetDurationMillisThreshold == null ?
                60e3 :
                config.fitDatasetDurationMillisThreshold;
            if (this.dataset.durationMillis() > datasetDurationMillisThreshold) {
                console.log(`Detected large dataset: total duration = ` +
                    `${this.dataset.durationMillis()} ms > ` +
                    `${datasetDurationMillisThreshold} ms. ` +
                    `Training transfer model using fitDataset() instead of fit()`);
                return this.trainOnDataset(config);
            }
            else {
                return this.trainOnTensors(config);
            }
        });
    }
    /** Helper function for training on tf.data.Dataset objects. */
    trainOnDataset(config) {
        return __awaiter(this, void 0, void 0, function* () {
            tf.util.assert(config.epochs > 0, () => `Invalid config.epochs`);
            // Train transfer-learning model using fitDataset
            const batchSize = config.batchSize == null ? 32 : config.batchSize;
            const windowHopRatio = config.windowHopRatio || DEFAULT_WINDOW_HOP_RATIO;
            const [trainDataset, valDataset] = this.collectTransferDataAsTfDataset(windowHopRatio, config.validationSplit, batchSize, { augmentByMixingNoiseRatio: config.augmentByMixingNoiseRatio });
            const t0 = tf.util.now();
            const history = yield this.model.fitDataset(trainDataset, {
                epochs: config.epochs,
                validationData: config.validationSplit > 0 ? valDataset : null,
                callbacks: config.callback == null ? null : [config.callback]
            });
            console.log(`fitDataset() took ${(tf.util.now() - t0).toFixed(2)} ms`);
            if (config.fineTuningEpochs != null && config.fineTuningEpochs > 0) {
                // Perform fine-tuning.
                const t0 = tf.util.now();
                const fineTuningHistory = yield this.fineTuningUsingTfDatasets(config, trainDataset, valDataset);
                console.log(`fitDataset() (fine-tuning) took ` +
                    `${(tf.util.now() - t0).toFixed(2)} ms`);
                return [history, fineTuningHistory];
            }
            else {
                return history;
            }
        });
    }
    /** Helper function for training on tf.Tensor objects. */
    trainOnTensors(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare the data.
            const windowHopRatio = config.windowHopRatio || DEFAULT_WINDOW_HOP_RATIO;
            const { xs, ys } = this.collectTransferDataAsTensors(windowHopRatio, { augmentByMixingNoiseRatio: config.augmentByMixingNoiseRatio });
            console.log(`Training data: xs.shape = ${xs.shape}, ys.shape = ${ys.shape}`);
            let trainXs;
            let trainYs;
            let valData;
            try {
                // TODO(cais): The balanced split may need to be pushed down to the
                //   level of the Dataset class to avoid leaks between train and val
                //   splits.
                if (config.validationSplit != null) {
                    const splits = (0, training_utils_1.balancedTrainValSplit)(xs, ys, config.validationSplit);
                    trainXs = splits.trainXs;
                    trainYs = splits.trainYs;
                    valData = [splits.valXs, splits.valYs];
                }
                else {
                    trainXs = xs;
                    trainYs = ys;
                }
                const history = yield this.model.fit(trainXs, trainYs, {
                    epochs: config.epochs == null ? 20 : config.epochs,
                    validationData: valData,
                    batchSize: config.batchSize,
                    callbacks: config.callback == null ? null : [config.callback]
                });
                if (config.fineTuningEpochs != null && config.fineTuningEpochs > 0) {
                    // Fine tuning: unfreeze the second-last dense layer of the base
                    // model.
                    const fineTuningHistory = yield this.fineTuningUsingTensors(config, trainXs, trainYs, valData);
                    return [history, fineTuningHistory];
                }
                else {
                    return history;
                }
            }
            finally {
                tf.dispose([xs, ys, trainXs, trainYs, valData]);
            }
        });
    }
    fineTuningUsingTfDatasets(config, trainDataset, valDataset) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalTrainableValue = this.secondLastBaseDenseLayer.trainable;
            this.secondLastBaseDenseLayer.trainable = true;
            // Recompile model after unfreezing layer.
            const fineTuningOptimizer = config.fineTuningOptimizer == null ? 'sgd' : config.fineTuningOptimizer;
            this.model.compile({
                loss: 'categoricalCrossentropy',
                optimizer: fineTuningOptimizer,
                metrics: ['acc']
            });
            const fineTuningHistory = yield this.model.fitDataset(trainDataset, {
                epochs: config.fineTuningEpochs,
                validationData: valDataset,
                callbacks: config.callback == null ? null : [config.callback]
            });
            // Set the trainable attribute of the fine-tuning layer to its
            // previous value.
            this.secondLastBaseDenseLayer.trainable = originalTrainableValue;
            return fineTuningHistory;
        });
    }
    fineTuningUsingTensors(config, trainXs, trainYs, valData) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalTrainableValue = this.secondLastBaseDenseLayer.trainable;
            this.secondLastBaseDenseLayer.trainable = true;
            // Recompile model after unfreezing layer.
            const fineTuningOptimizer = config.fineTuningOptimizer == null ? 'sgd' : config.fineTuningOptimizer;
            this.model.compile({
                loss: 'categoricalCrossentropy',
                optimizer: fineTuningOptimizer,
                metrics: ['acc']
            });
            const fineTuningHistory = yield this.model.fit(trainXs, trainYs, {
                epochs: config.fineTuningEpochs,
                validationData: valData,
                batchSize: config.batchSize,
                callbacks: config.fineTuningCallback == null ? null :
                    [config.fineTuningCallback]
            });
            // Set the trainable attribute of the fine-tuning layer to its
            // previous value.
            this.secondLastBaseDenseLayer.trainable = originalTrainableValue;
            return fineTuningHistory;
        });
    }
    /**
     * Perform evaluation of the model using the examples that the model
     * has loaded.
     *
     * @param config Configuration object for the evaluation.
     * @returns A Promise of the result of evaluation.
     */
    evaluate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            tf.util.assert(config.wordProbThresholds != null &&
                config.wordProbThresholds.length > 0, () => `Received null or empty wordProbThresholds`);
            // TODO(cais): Maybe relax this requirement.
            const NOISE_CLASS_INDEX = 0;
            tf.util.assert(this.words[NOISE_CLASS_INDEX] === dataset_1.BACKGROUND_NOISE_TAG, () => `Cannot perform evaluation when the first tag is not ` +
                `${dataset_1.BACKGROUND_NOISE_TAG}`);
            return tf.tidy(() => {
                const rocCurve = [];
                let auc = 0;
                const { xs, ys } = this.collectTransferDataAsTensors(config.windowHopRatio);
                const indices = ys.argMax(-1).dataSync();
                const probs = this.model.predict(xs);
                // To calcaulte ROC, we collapse all word probabilites into a single
                // positive class, while _background_noise_ is treated as the
                // negative class.
                const maxWordProbs = tf.max(tf.slice(probs, [0, 1], [probs.shape[0], probs.shape[1] - 1]), -1);
                const total = probs.shape[0];
                // Calculate ROC curve.
                for (let i = 0; i < config.wordProbThresholds.length; ++i) {
                    const probThreshold = config.wordProbThresholds[i];
                    const isWord = maxWordProbs.greater(tf.scalar(probThreshold)).dataSync();
                    let negatives = 0;
                    let positives = 0;
                    let falsePositives = 0;
                    let truePositives = 0;
                    for (let i = 0; i < total; ++i) {
                        if (indices[i] === NOISE_CLASS_INDEX) {
                            negatives++;
                            if (isWord[i]) {
                                falsePositives++;
                            }
                        }
                        else {
                            positives++;
                            if (isWord[i]) {
                                truePositives++;
                            }
                        }
                    }
                    // TODO(cais): Calculate per-hour false-positive rate.
                    const fpr = falsePositives / negatives;
                    const tpr = truePositives / positives;
                    rocCurve.push({ probThreshold, fpr, tpr });
                    console.log(`ROC thresh=${probThreshold}: ` +
                        `fpr=${fpr.toFixed(4)}, tpr=${tpr.toFixed(4)}`);
                    if (i > 0) {
                        // Accumulate to AUC.
                        auc += Math.abs((rocCurve[i - 1].fpr - rocCurve[i].fpr)) *
                            (rocCurve[i - 1].tpr + rocCurve[i].tpr) / 2;
                    }
                }
                return { rocCurve, auc };
            });
        });
    }
    /**
     * Create an instance of tf.LayersModel for transfer learning.
     *
     * The top dense layer of the base model is replaced with a new softmax
     * dense layer.
     */
    createTransferModelFromBaseModel() {
        tf.util.assert(this.words != null, () => `No word example is available for tranfer-learning model of name ` +
            this.name);
        // Find the second last dense layer.
        const layers = this.baseModel.layers;
        let layerIndex = layers.length - 2;
        while (layerIndex >= 0) {
            if (layers[layerIndex].getClassName().toLowerCase() === 'dense') {
                break;
            }
            layerIndex--;
        }
        if (layerIndex < 0) {
            throw new Error('Cannot find a hidden dense layer in the base model.');
        }
        this.secondLastBaseDenseLayer = layers[layerIndex];
        const truncatedBaseOutput = this.secondLastBaseDenseLayer.output;
        this.transferHead = tfl.sequential();
        this.transferHead.add(tfl.layers.dense({
            units: this.words.length,
            activation: 'softmax',
            inputShape: truncatedBaseOutput.shape.slice(1),
            name: 'NewHeadDense'
        }));
        const transferOutput = this.transferHead.apply(truncatedBaseOutput);
        this.model =
            tfl.model({ inputs: this.baseModel.inputs, outputs: transferOutput });
    }
    /**
     * Get the input shape of the underlying tf.LayersModel.
     *
     * @returns The input shape.
     */
    modelInputShape() {
        return this.baseModel.inputs[0].shape;
    }
    getMetadata() {
        return {
            tfjsSpeechCommandsVersion: version_1.version,
            modelName: this.name,
            timeStamp: new Date().toISOString(),
            wordLabels: this.wordLabels()
        };
    }
    save(handlerOrURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCustomPath = handlerOrURL != null;
            handlerOrURL = handlerOrURL || getCanonicalSavePath(this.name);
            if (!isCustomPath) {
                // First, save the words and other metadata.
                const metadataMapStr = exports.localStorageWrapper.localStorage.getItem(exports.SAVED_MODEL_METADATA_KEY);
                const metadataMap = metadataMapStr == null ? {} : JSON.parse(metadataMapStr);
                metadataMap[this.name] = this.getMetadata();
                exports.localStorageWrapper.localStorage.setItem(exports.SAVED_MODEL_METADATA_KEY, JSON.stringify(metadataMap));
            }
            console.log(`Saving model to ${handlerOrURL}`);
            return this.model.save(handlerOrURL);
        });
    }
    load(handlerOrURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCustomPath = handlerOrURL != null;
            handlerOrURL = handlerOrURL || getCanonicalSavePath(this.name);
            if (!isCustomPath) {
                // First, load the words and other metadata.
                const metadataMap = JSON.parse(exports.localStorageWrapper.localStorage.getItem(exports.SAVED_MODEL_METADATA_KEY));
                if (metadataMap == null || metadataMap[this.name] == null) {
                    throw new Error(`Cannot find metadata for transfer model named ${this.name}"`);
                }
                this.words = metadataMap[this.name].wordLabels;
                console.log(`Loaded word list for model named ${this.name}: ${this.words}`);
            }
            this.model = yield tfl.loadLayersModel(handlerOrURL);
            console.log(`Loaded model from ${handlerOrURL}:`);
            this.model.summary();
        });
    }
    /**
     * Overridden method to prevent creating a nested transfer-learning
     * recognizer.
     *
     * @param name
     */
    createTransfer(name) {
        throw new Error('Creating transfer-learned recognizer from a transfer-learned ' +
            'recognizer is not supported.');
    }
}
function getCanonicalSavePath(name) {
    return `${exports.SAVE_PATH_PREFIX}${name}`;
}
/**
 * List the model that are currently saved locally in the browser.
 *
 * @returns An array of transfer-learned speech-commands models
 *   that are currently saved in the browser locally.
 */
function listSavedTransferModels() {
    return __awaiter(this, void 0, void 0, function* () {
        const models = yield tf.io.listModels();
        const keys = [];
        for (const key in models) {
            if (key.startsWith(exports.SAVE_PATH_PREFIX)) {
                keys.push(key.slice(exports.SAVE_PATH_PREFIX.length));
            }
        }
        return keys;
    });
}
exports.listSavedTransferModels = listSavedTransferModels;
/**
 * Delete a locally-saved, transfer-learned speech-commands model.
 *
 * @param name The name of the transfer-learned model to be deleted.
 */
function deleteSavedTransferModel(name) {
    return __awaiter(this, void 0, void 0, function* () {
        // Delete the words from local storage.
        let metadataMap = JSON.parse(exports.localStorageWrapper.localStorage.getItem(exports.SAVED_MODEL_METADATA_KEY));
        if (metadataMap == null) {
            metadataMap = {};
        }
        if (metadataMap[name] != null) {
            delete metadataMap[name];
        }
        exports.localStorageWrapper.localStorage.setItem(exports.SAVED_MODEL_METADATA_KEY, JSON.stringify(metadataMap));
        yield tf.io.removeModel(getCanonicalSavePath(name));
    });
}
exports.deleteSavedTransferModel = deleteSavedTransferModel;
