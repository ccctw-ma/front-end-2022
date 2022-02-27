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
exports.getOffsetVectors = exports.getOffsetPoints = exports.getPointsConfidence = exports.argmax2d = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const constants_1 = require("../../constants");
function mod(a, b) {
    return tf.tidy(() => {
        const floored = tf.div(a, tf.scalar(b, 'int32'));
        return tf.sub(a, tf.mul(floored, tf.scalar(b, 'int32')));
    });
}
function argmax2d(inputs) {
    const [height, width, depth] = inputs.shape;
    return tf.tidy(() => {
        const reshaped = tf.reshape(inputs, [height * width, depth]);
        const coords = tf.argMax(reshaped, 0);
        const yCoords = tf.expandDims(tf.div(coords, tf.scalar(width, 'int32')), 1);
        const xCoords = tf.expandDims(mod(coords, width), 1);
        return tf.concat([yCoords, xCoords], 1);
    });
}
exports.argmax2d = argmax2d;
function getPointsConfidence(heatmapScores, heatMapCoords) {
    const numKeypoints = heatMapCoords.shape[0];
    const result = new Float32Array(numKeypoints);
    for (let keypoint = 0; keypoint < numKeypoints; keypoint++) {
        const y = heatMapCoords.get(keypoint, 0);
        const x = heatMapCoords.get(keypoint, 1);
        result[keypoint] = heatmapScores.get(y, x, keypoint);
    }
    return result;
}
exports.getPointsConfidence = getPointsConfidence;
function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
    return tf.tidy(() => {
        const offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
        return tf.add(tf.cast(tf.mul(heatMapCoordsBuffer.toTensor(), tf.scalar(outputStride, 'int32')), 'float32'), offsetVectors);
    });
}
exports.getOffsetPoints = getOffsetPoints;
function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
    const result = [];
    for (let keypoint = 0; keypoint < constants_1.COCO_KEYPOINTS.length; keypoint++) {
        const heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
        const heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
        const { x, y } = getOffsetPoint(heatmapY, heatmapX, keypoint, offsetsBuffer);
        result.push(y);
        result.push(x);
    }
    return tf.tensor2d(result, [constants_1.COCO_KEYPOINTS.length, 2]);
}
exports.getOffsetVectors = getOffsetVectors;
function getOffsetPoint(y, x, keypoint, offsetsBuffer) {
    return {
        y: offsetsBuffer.get(y, x, keypoint),
        x: offsetsBuffer.get(y, x, keypoint + constants_1.COCO_KEYPOINTS.length)
    };
}
