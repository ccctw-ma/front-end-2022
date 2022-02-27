"use strict";
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
exports.decodeMultiplePartMasksCPU = exports.decodeMultipleMasksCPU = void 0;
const keypoints_1 = require("../keypoints");
const util_1 = require("./util");
function computeDistance(embedding, pose, minPartScore = 0.3) {
    let distance = 0.0;
    let numKpt = 0;
    for (let p = 0; p < embedding.length; p++) {
        if (pose.keypoints[p].score > minPartScore) {
            numKpt += 1;
            distance += Math.pow((embedding[p].x - pose.keypoints[p].position.x), 2) +
                Math.pow((embedding[p].y - pose.keypoints[p].position.y), 2);
        }
    }
    if (numKpt === 0) {
        distance = Infinity;
    }
    else {
        distance = distance / numKpt;
    }
    return distance;
}
function convertToPositionInOuput(position, [padT, padL], [scaleX, scaleY], stride) {
    const y = Math.round(((padT + position.y + 1.0) * scaleY - 1.0) / stride);
    const x = Math.round(((padL + position.x + 1.0) * scaleX - 1.0) / stride);
    return { x, y };
}
function getEmbedding(location, keypointIndex, convertToPosition, outputResolutionX, longOffsets, refineSteps, [height, width]) {
    const newLocation = convertToPosition(location);
    const nn = newLocation.y * outputResolutionX + newLocation.x;
    let dy = longOffsets[keypoints_1.NUM_KEYPOINTS * (2 * nn) + keypointIndex];
    let dx = longOffsets[keypoints_1.NUM_KEYPOINTS * (2 * nn + 1) + keypointIndex];
    let y = location.y + dy;
    let x = location.x + dx;
    for (let t = 0; t < refineSteps; t++) {
        y = Math.min(y, height - 1);
        x = Math.min(x, width - 1);
        const newPos = convertToPosition({ x, y });
        const nn = newPos.y * outputResolutionX + newPos.x;
        dy = longOffsets[keypoints_1.NUM_KEYPOINTS * (2 * nn) + keypointIndex];
        dx = longOffsets[keypoints_1.NUM_KEYPOINTS * (2 * nn + 1) + keypointIndex];
        y = y + dy;
        x = x + dx;
    }
    return { x, y };
}
function matchEmbeddingToInstance(location, longOffsets, poses, numKptForMatching, [padT, padL], [scaleX, scaleY], outputResolutionX, [height, width], stride, refineSteps) {
    const embed = [];
    const convertToPosition = (pair) => convertToPositionInOuput(pair, [padT, padL], [scaleX, scaleY], stride);
    for (let keypointsIndex = 0; keypointsIndex < numKptForMatching; keypointsIndex++) {
        const embedding = getEmbedding(location, keypointsIndex, convertToPosition, outputResolutionX, longOffsets, refineSteps, [height, width]);
        embed.push(embedding);
    }
    let kMin = -1;
    let kMinDist = Infinity;
    for (let k = 0; k < poses.length; k++) {
        const dist = computeDistance(embed, poses[k]);
        if (dist < kMinDist) {
            kMin = k;
            kMinDist = dist;
        }
    }
    return kMin;
}
function getOutputResolution([inputResolutionY, inputResolutionX], stride) {
    const outputResolutionX = Math.round((inputResolutionX - 1.0) / stride + 1.0);
    const outputResolutionY = Math.round((inputResolutionY - 1.0) / stride + 1.0);
    return [outputResolutionX, outputResolutionY];
}
function decodeMultipleMasksCPU(segmentation, longOffsets, posesAboveScore, height, width, stride, [inHeight, inWidth], padding, refineSteps, numKptForMatching = 5) {
    const dataArrays = posesAboveScore.map(x => new Uint8Array(height * width).fill(0));
    const { top: padT, left: padL } = padding;
    const [scaleX, scaleY] = (0, util_1.getScale)([height, width], [inHeight, inWidth], padding);
    const [outputResolutionX,] = getOutputResolution([inHeight, inWidth], stride);
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            const n = i * width + j;
            const prob = segmentation[n];
            if (prob === 1) {
                const kMin = matchEmbeddingToInstance({ x: j, y: i }, longOffsets, posesAboveScore, numKptForMatching, [padT, padL], [scaleX, scaleY], outputResolutionX, [height, width], stride, refineSteps);
                if (kMin >= 0) {
                    dataArrays[kMin][n] = 1;
                }
            }
        }
    }
    return dataArrays;
}
exports.decodeMultipleMasksCPU = decodeMultipleMasksCPU;
function decodeMultiplePartMasksCPU(segmentation, longOffsets, partSegmentaion, posesAboveScore, height, width, stride, [inHeight, inWidth], padding, refineSteps, numKptForMatching = 5) {
    const dataArrays = posesAboveScore.map(x => new Int32Array(height * width).fill(-1));
    const { top: padT, left: padL } = padding;
    const [scaleX, scaleY] = (0, util_1.getScale)([height, width], [inHeight, inWidth], padding);
    const [outputResolutionX,] = getOutputResolution([inHeight, inWidth], stride);
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            const n = i * width + j;
            const prob = segmentation[n];
            if (prob === 1) {
                const kMin = matchEmbeddingToInstance({ x: j, y: i }, longOffsets, posesAboveScore, numKptForMatching, [padT, padL], [scaleX, scaleY], outputResolutionX, [height, width], stride, refineSteps);
                if (kMin >= 0) {
                    dataArrays[kMin][n] = partSegmentaion[n];
                }
            }
        }
    }
    return dataArrays;
}
exports.decodeMultiplePartMasksCPU = decodeMultiplePartMasksCPU;
