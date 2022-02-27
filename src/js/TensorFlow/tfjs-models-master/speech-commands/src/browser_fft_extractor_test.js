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
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const browser_fft_extractor_1 = require("./browser_fft_extractor");
const BrowserFftUtils = __importStar(require("./browser_fft_utils"));
const browser_test_utils_1 = require("./browser_test_utils");
const test_utils_1 = require("./test_utils");
const testEnvs = jasmine_util_1.NODE_ENVS;
(0, jasmine_util_1.describeWithFlags)('flattenQueue', testEnvs, () => {
    it('3 frames, 2 values each', () => {
        const queue = [[1, 1], [2, 2], [3, 3]].map(x => new Float32Array(x));
        expect((0, browser_fft_extractor_1.flattenQueue)(queue)).toEqual(new Float32Array([1, 1, 2, 2, 3, 3]));
    });
    it('2 frames, 2 values each', () => {
        const queue = [[1, 1], [2, 2]].map(x => new Float32Array(x));
        expect((0, browser_fft_extractor_1.flattenQueue)(queue)).toEqual(new Float32Array([1, 1, 2, 2]));
    });
    it('1 frame, 2 values each', () => {
        const queue = [[1, 1]].map(x => new Float32Array(x));
        expect((0, browser_fft_extractor_1.flattenQueue)(queue)).toEqual(new Float32Array([1, 1]));
    });
});
(0, jasmine_util_1.describeWithFlags)('getInputTensorFromFrequencyData', testEnvs, () => {
    it('6 frames, 2 vals each', () => {
        const freqData = new Float32Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        const numFrames = 6;
        const fftSize = 2;
        const tensor = (0, browser_fft_extractor_1.getInputTensorFromFrequencyData)(freqData, [1, numFrames, fftSize, 1]);
        (0, test_utils_1.expectTensorsClose)(tensor, tf.tensor4d(freqData, [1, 6, 2, 1]));
    });
});
(0, jasmine_util_1.describeWithFlags)('BrowserFftFeatureExtractor', testEnvs, () => {
    function setUpFakes() {
        spyOn(BrowserFftUtils, 'getAudioContextConstructor')
            .and.callFake(() => browser_test_utils_1.FakeAudioContext.createInstance);
        spyOn(BrowserFftUtils, 'getAudioMediaStream')
            .and.callFake(() => new browser_test_utils_1.FakeAudioMediaStream());
    }
    it('constructor', () => {
        setUpFakes();
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            suppressionTimeMillis: 1000,
            overlapFactor: 0
        });
        expect(extractor.fftSize).toEqual(1024);
        expect(extractor.numFrames).toEqual(43);
        expect(extractor.columnTruncateLength).toEqual(225);
        expect(extractor.overlapFactor).toBeCloseTo(0);
    });
    it('constructor errors due to null config', () => {
        expect(() => new browser_fft_extractor_1.BrowserFftFeatureExtractor(null))
            .toThrowError(/Required configuration object is missing/);
    });
    it('constructor errors due to missing spectrogramCallback', () => {
        expect(() => new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: null,
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            suppressionTimeMillis: 1000,
            overlapFactor: 0
        }))
            .toThrowError(/spectrogramCallback cannot be null or undefined/);
    });
    it('constructor errors due to invalid numFramesPerSpectrogram', () => {
        expect(() => new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            numFramesPerSpectrogram: -2,
            columnTruncateLength: 225,
            overlapFactor: 0,
            suppressionTimeMillis: 1000
        }))
            .toThrowError(/Invalid value in numFramesPerSpectrogram: -2/);
    });
    it('constructor errors due to negative overlapFactor', () => {
        expect(() => new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            overlapFactor: -0.1,
            suppressionTimeMillis: 1000
        }))
            .toThrowError(/Expected overlapFactor/);
    });
    it('constructor errors due to columnTruncateLength too large', () => {
        expect(() => new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 1600,
            overlapFactor: 0,
            suppressionTimeMillis: 1000
        }))
            .toThrowError(/columnTruncateLength .* exceeds fftSize/);
    });
    it('constructor errors due to negative suppressionTimeMillis', () => {
        expect(() => new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 1600,
            overlapFactor: 0,
            suppressionTimeMillis: -1000 // <0 and leads to Error.
        }))
            .toThrowError(/Expected suppressionTimeMillis to be >= 0/);
    });
    it('start and stop: overlapFactor = 0', done => {
        setUpFakes();
        const spectrogramDurationMillis = 1024 / 44100 * 43 * 1e3;
        const numCallbacksToComplete = 3;
        let numCallbacksCompleted = 0;
        const tensorCounts = [];
        const callbackTimestamps = [];
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () {
                callbackTimestamps.push(tf.util.now());
                if (callbackTimestamps.length > 1) {
                    expect(callbackTimestamps[callbackTimestamps.length - 1] -
                        callbackTimestamps[callbackTimestamps.length - 2])
                        .toBeGreaterThanOrEqual(spectrogramDurationMillis);
                }
                expect(x.shape).toEqual([1, 43, 225, 1]);
                tensorCounts.push(tf.memory().numTensors);
                if (tensorCounts.length > 1) {
                    // Assert no memory leak.
                    expect(tensorCounts[tensorCounts.length - 1])
                        .toEqual(tensorCounts[tensorCounts.length - 2]);
                }
                if (++numCallbacksCompleted >= numCallbacksToComplete) {
                    yield extractor.stop();
                    done();
                }
                return false;
            }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            overlapFactor: 0,
            suppressionTimeMillis: 0
        });
        extractor.start();
    });
    it('start and stop: correct rotating buffer size', done => {
        setUpFakes();
        const numFramesPerSpectrogram = 43;
        const columnTruncateLength = 225;
        const numCallbacksToComplete = 3;
        let numCallbacksCompleted = 0;
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () {
                const xData = yield x.data();
                // Verify the correctness of the spectrogram data.
                for (let i = 0; i < xData.length; ++i) {
                    const segment = Math.floor(i / columnTruncateLength);
                    const expected = segment * 1024 + (i % columnTruncateLength) +
                        1024 * numFramesPerSpectrogram * numCallbacksCompleted;
                    expect(xData[i]).toEqual(expected);
                }
                if (++numCallbacksCompleted >= numCallbacksToComplete) {
                    yield extractor.stop();
                    done();
                }
                return false;
            }),
            numFramesPerSpectrogram,
            columnTruncateLength,
            overlapFactor: 0,
            suppressionTimeMillis: 0
        });
        extractor.start();
    });
    it('start and stop: overlapFactor = 0.5', done => {
        setUpFakes();
        const numCallbacksToComplete = 5;
        let numCallbacksCompleted = 0;
        const spectrogramTensors = [];
        const callbackTimestamps = [];
        const spectrogramDurationMillis = 1024 / 44100 * 43 * 1e3;
        const numFramesPerSpectrogram = 43;
        const columnTruncateLength = 225;
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () {
                callbackTimestamps.push(tf.util.now());
                if (callbackTimestamps.length > 1) {
                    expect(callbackTimestamps[callbackTimestamps.length - 1] -
                        callbackTimestamps[callbackTimestamps.length - 2])
                        .toBeGreaterThanOrEqual(spectrogramDurationMillis * 0.5);
                    // Verify the content of the spectrogram data.
                    const xData = yield x.data();
                    expect(xData[xData.length - 1])
                        .toEqual(callbackTimestamps.length * 22 * 1024 - 800);
                }
                expect(x.shape).toEqual([1, 43, 225, 1]);
                spectrogramTensors.push(tf.clone(x));
                if (++numCallbacksCompleted >= numCallbacksToComplete) {
                    yield extractor.stop();
                    done();
                }
                return false;
            }),
            numFramesPerSpectrogram,
            columnTruncateLength,
            overlapFactor: 0.5,
            suppressionTimeMillis: 0
        });
        extractor.start();
    });
    it('start and stop: the first frame is captured', done => {
        setUpFakes();
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () {
                expect(x.shape).toEqual([1, 43, 225, 1]);
                const xData = x.dataSync();
                // Verify that the first frame is not all zero or any constant value
                // We don't compare the values against zero directly, because the
                // spectrogram data is normalized here. The assertions below are also
                // based on the fact that the fake audio context outputs linearly
                // increasing sample values.
                expect(xData[1]).toBeGreaterThan(xData[0]);
                expect(xData[2]).toBeGreaterThan(xData[1]);
                yield extractor.stop();
                done();
                return false;
            }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            overlapFactor: 0,
            suppressionTimeMillis: 0
        });
        extractor.start();
    });
    it('start and stop: suppressionTimeMillis = 1000', done => {
        setUpFakes();
        const numCallbacksToComplete = 2;
        const suppressionTimeMillis = 1500;
        let numCallbacksCompleted = 0;
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () {
                if (++numCallbacksCompleted >= numCallbacksToComplete) {
                    const tEnd = tf.util.now();
                    // Due to the suppression time, the time elapsed between the two
                    // consecutive callbacks should be longer than it.
                    expect(tEnd - tBegin).toBeGreaterThanOrEqual(suppressionTimeMillis);
                    yield extractor.stop();
                    done();
                }
                return true; // Returning true causes suppression.
            }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            overlapFactor: 0.25,
            suppressionTimeMillis
        });
        const tBegin = tf.util.now();
        extractor.start();
    });
    it('stopping unstarted extractor leads to Error', () => __awaiter(void 0, void 0, void 0, function* () {
        setUpFakes();
        const extractor = new browser_fft_extractor_1.BrowserFftFeatureExtractor({
            spectrogramCallback: (x) => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            numFramesPerSpectrogram: 43,
            columnTruncateLength: 225,
            overlapFactor: 0,
            suppressionTimeMillis: 1000
        });
        let caughtError;
        try {
            yield extractor.stop();
        }
        catch (err) {
            caughtError = err;
        }
        expect(caughtError.message)
            .toMatch(/Cannot stop because there is no ongoing streaming activity/);
    }));
});
