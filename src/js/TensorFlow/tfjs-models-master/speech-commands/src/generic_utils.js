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
exports.getRandomInteger = exports.getUID = exports.arrayBuffer2String = exports.string2ArrayBuffer = exports.concatenateFloat32Arrays = exports.concatenateArrayBuffers = void 0;
/**
 * Concatenate a number of ArrayBuffers into one.
 *
 * @param buffers A number of array buffers to concatenate.
 * @returns Result of concatenating `buffers` in order.
 */
function concatenateArrayBuffers(buffers) {
    let totalByteLength = 0;
    buffers.forEach((buffer) => {
        totalByteLength += buffer.byteLength;
    });
    const temp = new Uint8Array(totalByteLength);
    let offset = 0;
    buffers.forEach((buffer) => {
        temp.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    });
    return temp.buffer;
}
exports.concatenateArrayBuffers = concatenateArrayBuffers;
/**
 * Concatenate Float32Arrays.
 *
 * @param xs Float32Arrays to concatenate.
 * @return The result of the concatenation.
 */
function concatenateFloat32Arrays(xs) {
    let totalLength = 0;
    xs.forEach(x => totalLength += x.length);
    const concatenated = new Float32Array(totalLength);
    let index = 0;
    xs.forEach(x => {
        concatenated.set(x, index);
        index += x.length;
    });
    return concatenated;
}
exports.concatenateFloat32Arrays = concatenateFloat32Arrays;
/** Encode a string as an ArrayBuffer. */
function string2ArrayBuffer(str) {
    if (str == null) {
        throw new Error('Received null or undefind string');
    }
    // NOTE(cais): This implementation is inefficient in terms of memory.
    // But it works for UTF-8 strings. Just don't use on for very long strings.
    const strUTF8 = unescape(encodeURIComponent(str));
    const buf = new Uint8Array(strUTF8.length);
    for (let i = 0; i < strUTF8.length; ++i) {
        buf[i] = strUTF8.charCodeAt(i);
    }
    return buf.buffer;
}
exports.string2ArrayBuffer = string2ArrayBuffer;
/** Decode an ArrayBuffer as a string. */
function arrayBuffer2String(buffer) {
    if (buffer == null) {
        throw new Error('Received null or undefind buffer');
    }
    const buf = new Uint8Array(buffer);
    return decodeURIComponent(escape(String.fromCharCode(...buf)));
}
exports.arrayBuffer2String = arrayBuffer2String;
/** Generate a pseudo-random UID. */
function getUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() +
        s4() + s4();
}
exports.getUID = getUID;
function getRandomInteger(min, max) {
    return Math.floor((max - min) * Math.random()) + min;
}
exports.getRandomInteger = getRandomInteger;
