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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeAudioMediaStream = exports.FakeAudioContext = void 0;
/**
 * Testing Utilities for Browser Audio Feature Extraction.
 */
class FakeAudioContext {
    constructor() {
        this.sampleRate = 44100;
    }
    static createInstance() {
        return new FakeAudioContext();
    }
    createMediaStreamSource() {
        return new FakeMediaStreamAudioSourceNode();
    }
    createAnalyser() {
        return new FakeAnalyser();
    }
    close() { }
}
exports.FakeAudioContext = FakeAudioContext;
class FakeAudioMediaStream {
    constructor() { }
    getTracks() {
        return [];
    }
}
exports.FakeAudioMediaStream = FakeAudioMediaStream;
class FakeMediaStreamAudioSourceNode {
    constructor() { }
    connect(node) { }
}
class FakeAnalyser {
    constructor() {
        this.x = 0;
    }
    getFloatFrequencyData(data) {
        const xs = [];
        for (let i = 0; i < this.fftSize / 2; ++i) {
            xs.push(this.x++);
        }
        data.set(new Float32Array(xs));
    }
    getFloatTimeDomainData(data) {
        const xs = [];
        for (let i = 0; i < this.fftSize / 2; ++i) {
            xs.push(-(this.x++));
        }
        data.set(new Float32Array(xs));
    }
    disconnect() { }
}
