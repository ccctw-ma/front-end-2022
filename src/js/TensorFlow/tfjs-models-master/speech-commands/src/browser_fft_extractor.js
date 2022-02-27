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
exports.Tracker = exports.getInputTensorFromFrequencyData = exports.flattenQueue = exports.BrowserFftFeatureExtractor = void 0;
/**
 * Audio FFT Feature Extractor based on Browser-Native FFT.
 */
const tf = __importStar(require("@tensorflow/tfjs-core"));
const browser_fft_utils_1 = require("./browser_fft_utils");
/**
 * Audio feature extractor based on Browser-native FFT.
 *
 * Uses AudioContext and analyser node.
 */
class BrowserFftFeatureExtractor {
    /**
     * Constructor of BrowserFftFeatureExtractor.
     *
     * @param config Required configuration object.
     */
    constructor(config) {
        if (config == null) {
            throw new Error(`Required configuration object is missing for ` +
                `BrowserFftFeatureExtractor constructor`);
        }
        if (config.spectrogramCallback == null) {
            throw new Error(`spectrogramCallback cannot be null or undefined`);
        }
        if (!(config.numFramesPerSpectrogram > 0)) {
            throw new Error(`Invalid value in numFramesPerSpectrogram: ` +
                `${config.numFramesPerSpectrogram}`);
        }
        if (config.suppressionTimeMillis < 0) {
            throw new Error(`Expected suppressionTimeMillis to be >= 0, ` +
                `but got ${config.suppressionTimeMillis}`);
        }
        this.suppressionTimeMillis = config.suppressionTimeMillis;
        this.spectrogramCallback = config.spectrogramCallback;
        this.numFrames = config.numFramesPerSpectrogram;
        this.sampleRateHz = config.sampleRateHz || 44100;
        this.fftSize = config.fftSize || 1024;
        this.frameDurationMillis = this.fftSize / this.sampleRateHz * 1e3;
        this.columnTruncateLength = config.columnTruncateLength || this.fftSize;
        this.overlapFactor = config.overlapFactor;
        this.includeRawAudio = config.includeRawAudio;
        tf.util.assert(this.overlapFactor >= 0 && this.overlapFactor < 1, () => `Expected overlapFactor to be >= 0 and < 1, ` +
            `but got ${this.overlapFactor}`);
        if (this.columnTruncateLength > this.fftSize) {
            throw new Error(`columnTruncateLength ${this.columnTruncateLength} exceeds ` +
                `fftSize (${this.fftSize}).`);
        }
        this.audioContextConstructor = (0, browser_fft_utils_1.getAudioContextConstructor)();
    }
    start(audioTrackConstraints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.frameIntervalTask != null) {
                throw new Error('Cannot start already-started BrowserFftFeatureExtractor');
            }
            this.stream = yield (0, browser_fft_utils_1.getAudioMediaStream)(audioTrackConstraints);
            this.audioContext = new this.audioContextConstructor({ sampleRate: this.sampleRateHz });
            const streamSource = this.audioContext.createMediaStreamSource(this.stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize * 2;
            this.analyser.smoothingTimeConstant = 0.0;
            streamSource.connect(this.analyser);
            // Reset the queue.
            this.freqDataQueue = [];
            this.freqData = new Float32Array(this.fftSize);
            if (this.includeRawAudio) {
                this.timeDataQueue = [];
                this.timeData = new Float32Array(this.fftSize);
            }
            const period = Math.max(1, Math.round(this.numFrames * (1 - this.overlapFactor)));
            this.tracker = new Tracker(period, Math.round(this.suppressionTimeMillis / this.frameDurationMillis));
            this.frameIntervalTask = setInterval(this.onAudioFrame.bind(this), this.fftSize / this.sampleRateHz * 1e3);
        });
    }
    onAudioFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            this.analyser.getFloatFrequencyData(this.freqData);
            if (this.freqData[0] === -Infinity) {
                return;
            }
            this.freqDataQueue.push(this.freqData.slice(0, this.columnTruncateLength));
            if (this.includeRawAudio) {
                this.analyser.getFloatTimeDomainData(this.timeData);
                this.timeDataQueue.push(this.timeData.slice());
            }
            if (this.freqDataQueue.length > this.numFrames) {
                // Drop the oldest frame (least recent).
                this.freqDataQueue.shift();
            }
            const shouldFire = this.tracker.tick();
            if (shouldFire) {
                const freqData = flattenQueue(this.freqDataQueue);
                const freqDataTensor = getInputTensorFromFrequencyData(freqData, [1, this.numFrames, this.columnTruncateLength, 1]);
                let timeDataTensor;
                if (this.includeRawAudio) {
                    const timeData = flattenQueue(this.timeDataQueue);
                    timeDataTensor = getInputTensorFromFrequencyData(timeData, [1, this.numFrames * this.fftSize]);
                }
                const shouldRest = yield this.spectrogramCallback(freqDataTensor, timeDataTensor);
                if (shouldRest) {
                    this.tracker.suppress();
                }
                tf.dispose([freqDataTensor, timeDataTensor]);
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.frameIntervalTask == null) {
                throw new Error('Cannot stop because there is no ongoing streaming activity.');
            }
            clearInterval(this.frameIntervalTask);
            this.frameIntervalTask = null;
            this.analyser.disconnect();
            this.audioContext.close();
            if (this.stream != null && this.stream.getTracks().length > 0) {
                this.stream.getTracks()[0].stop();
            }
        });
    }
    setConfig(params) {
        throw new Error('setConfig() is not implemented for BrowserFftFeatureExtractor.');
    }
    getFeatures() {
        throw new Error('getFeatures() is not implemented for ' +
            'BrowserFftFeatureExtractor. Use the spectrogramCallback ' +
            'field of the constructor config instead.');
    }
}
exports.BrowserFftFeatureExtractor = BrowserFftFeatureExtractor;
function flattenQueue(queue) {
    const frameSize = queue[0].length;
    const freqData = new Float32Array(queue.length * frameSize);
    queue.forEach((data, i) => freqData.set(data, i * frameSize));
    return freqData;
}
exports.flattenQueue = flattenQueue;
function getInputTensorFromFrequencyData(freqData, shape) {
    const vals = new Float32Array(tf.util.sizeFromShape(shape));
    // If the data is less than the output shape, the rest is padded with zeros.
    vals.set(freqData, vals.length - freqData.length);
    return tf.tensor(vals, shape);
}
exports.getInputTensorFromFrequencyData = getInputTensorFromFrequencyData;
/**
 * A class that manages the firing of events based on periods
 * and suppression time.
 */
class Tracker {
    /**
     * Constructor of Tracker.
     *
     * @param period The event-firing period, in number of frames.
     * @param suppressionPeriod The suppression period, in number of frames.
     */
    constructor(period, suppressionPeriod) {
        this.period = period;
        this.suppressionTime = suppressionPeriod == null ? 0 : suppressionPeriod;
        this.counter = 0;
        tf.util.assert(this.period > 0, () => `Expected period to be positive, but got ${this.period}`);
    }
    /**
     * Mark a frame.
     *
     * @returns Whether the event should be fired at the current frame.
     */
    tick() {
        this.counter++;
        const shouldFire = (this.counter % this.period === 0) &&
            (this.suppressionOnset == null ||
                this.counter - this.suppressionOnset > this.suppressionTime);
        return shouldFire;
    }
    /**
     * Order the beginning of a supression period.
     */
    suppress() {
        this.suppressionOnset = this.counter;
    }
}
exports.Tracker = Tracker;
