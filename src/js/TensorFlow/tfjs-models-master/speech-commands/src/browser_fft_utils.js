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
exports.playRawAudio = exports.getAudioMediaStream = exports.getAudioContextConstructor = exports.normalizeFloat32Array = exports.normalize = exports.loadMetadataJson = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const util_1 = require("util");
function loadMetadataJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const HTTP_SCHEME = 'http://';
        const HTTPS_SCHEME = 'https://';
        const FILE_SCHEME = 'file://';
        if (url.indexOf(HTTP_SCHEME) === 0 || url.indexOf(HTTPS_SCHEME) === 0) {
            const response = yield fetch(url);
            const parsed = yield response.json();
            return parsed;
        }
        else if (url.indexOf(FILE_SCHEME) === 0) {
            // tslint:disable-next-line:no-require-imports
            const fs = require('fs');
            const readFile = (0, util_1.promisify)(fs.readFile);
            return JSON.parse(yield readFile(url.slice(FILE_SCHEME.length), { encoding: 'utf-8' }));
        }
        else {
            throw new Error(`Unsupported URL scheme in metadata URL: ${url}. ` +
                `Supported schemes are: http://, https://, and ` +
                `(node.js-only) file://`);
        }
    });
}
exports.loadMetadataJson = loadMetadataJson;
let EPSILON = null;
/**
 * Normalize the input into zero mean and unit standard deviation.
 *
 * This function is safe against divison-by-zero: In case the standard
 * deviation is zero, the output will be all-zero.
 *
 * @param x Input tensor.
 * @param y Output normalized tensor.
 */
function normalize(x) {
    if (EPSILON == null) {
        EPSILON = tf.backend().epsilon();
    }
    return tf.tidy(() => {
        const { mean, variance } = tf.moments(x);
        // Add an EPSILON to the denominator to prevent division-by-zero.
        return tf.div(tf.sub(x, mean), tf.add(tf.sqrt(variance), EPSILON));
    });
}
exports.normalize = normalize;
/**
 * Z-Normalize the elements of a Float32Array.
 *
 * Subtract the mean and divide the result by the standard deviation.
 *
 * @param x The Float32Array to normalize.
 * @return Noramlzied Float32Array.
 */
function normalizeFloat32Array(x) {
    if (x.length < 2) {
        throw new Error('Cannot normalize a Float32Array with fewer than 2 elements.');
    }
    if (EPSILON == null) {
        EPSILON = tf.backend().epsilon();
    }
    return tf.tidy(() => {
        const { mean, variance } = tf.moments(tf.tensor1d(x));
        const meanVal = mean.arraySync();
        const stdVal = Math.sqrt(variance.arraySync());
        const yArray = Array.from(x).map(y => (y - meanVal) / (stdVal + EPSILON));
        return new Float32Array(yArray);
    });
}
exports.normalizeFloat32Array = normalizeFloat32Array;
function getAudioContextConstructor() {
    // tslint:disable-next-line:no-any
    return window.AudioContext || window.webkitAudioContext;
}
exports.getAudioContextConstructor = getAudioContextConstructor;
function getAudioMediaStream(audioTrackConstraints) {
    return __awaiter(this, void 0, void 0, function* () {
        return navigator.mediaDevices.getUserMedia({
            audio: audioTrackConstraints == null ? true : audioTrackConstraints,
            video: false
        });
    });
}
exports.getAudioMediaStream = getAudioMediaStream;
/**
 * Play raw audio waveform
 * @param rawAudio Raw audio data, including the waveform and the sampling rate.
 * @param onEnded Callback function to execute when the playing ends.
 */
function playRawAudio(rawAudio, onEnded) {
    const audioContextConstructor = 
    // tslint:disable-next-line:no-any
    window.AudioContext || window.webkitAudioContext;
    const audioContext = new audioContextConstructor();
    const arrayBuffer = audioContext.createBuffer(1, rawAudio.data.length, rawAudio.sampleRateHz);
    const nowBuffering = arrayBuffer.getChannelData(0);
    nowBuffering.set(rawAudio.data);
    const source = audioContext.createBufferSource();
    source.buffer = arrayBuffer;
    source.connect(audioContext.destination);
    source.start();
    source.onended = () => {
        if (onEnded != null) {
            onEnded();
        }
    };
}
exports.playRawAudio = playRawAudio;
