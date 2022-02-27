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
exports.decodeOnlyPartSegmentation = exports.decodePartSegmentation = exports.toMaskTensor = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
/**
 * Takes the sigmoid of the part heatmap output and generates a 2d one-hot
 * tensor with ones where the part's score has the maximum value.
 *
 * @param partHeatmapScores
 */
function toFlattenedOneHotPartMap(partHeatmapScores) {
    const numParts = partHeatmapScores.shape[2];
    const partMapLocations = tf.argMax(partHeatmapScores, 2);
    const partMapFlattened = tf.reshape(partMapLocations, [-1]);
    return tf.oneHot(partMapFlattened, numParts);
}
function clipByMask2d(image, mask) {
    return tf.mul(image, mask);
}
/**
 * Takes the sigmoid of the segmentation output, and generates a segmentation
 * mask with a 1 or 0 at each pixel where there is a person or not a person. The
 * segmentation threshold determines the threshold of a score for a pixel for it
 * to be considered part of a person.
 * @param segmentScores A 3d-tensor of the sigmoid of the segmentation output.
 * @param segmentationThreshold The minimum that segmentation values must have
 * to be considered part of the person.  Affects the generation of the
 * segmentation mask and the clipping of the colored part image.
 *
 * @returns A segmentation mask with a 1 or 0 at each pixel where there is a
 * person or not a person.
 */
function toMaskTensor(segmentScores, threshold) {
    return tf.tidy(() => tf.cast(tf.greater(segmentScores, tf.scalar(threshold)), 'int32'));
}
exports.toMaskTensor = toMaskTensor;
/**
 * Takes the sigmoid of the person and part map output, and returns a 2d tensor
 * of an image with the corresponding value at each pixel corresponding to the
 * part with the highest value. These part ids are clipped by the segmentation
 * mask. Wherever the a pixel is clipped by the segmentation mask, its value
 * will set to -1, indicating that there is no part in that pixel.
 * @param segmentScores A 3d-tensor of the sigmoid of the segmentation output.
 * @param partHeatmapScores A 3d-tensor of the sigmoid of the part heatmap
 * output. The third dimension corresponds to the part.
 *
 * @returns A 2d tensor of an image with the corresponding value at each pixel
 * corresponding to the part with the highest value. These part ids are clipped
 * by the segmentation mask.  It will have values of -1 for pixels that are
 * outside of the body and do not have a corresponding part.
 */
function decodePartSegmentation(segmentationMask, partHeatmapScores) {
    const [partMapHeight, partMapWidth, numParts] = partHeatmapScores.shape;
    return tf.tidy(() => {
        const flattenedMap = toFlattenedOneHotPartMap(partHeatmapScores);
        const partNumbers = tf.expandDims(tf.range(0, numParts, 1, 'int32'), 1);
        const partMapFlattened = tf.cast(tf.matMul(flattenedMap, partNumbers), 'int32');
        const partMap = tf.reshape(partMapFlattened, [partMapHeight, partMapWidth]);
        const partMapShiftedUpForClipping = tf.add(partMap, tf.scalar(1, 'int32'));
        return tf.sub(clipByMask2d(partMapShiftedUpForClipping, segmentationMask), tf.scalar(1, 'int32'));
    });
}
exports.decodePartSegmentation = decodePartSegmentation;
function decodeOnlyPartSegmentation(partHeatmapScores) {
    const [partMapHeight, partMapWidth, numParts] = partHeatmapScores.shape;
    return tf.tidy(() => {
        const flattenedMap = toFlattenedOneHotPartMap(partHeatmapScores);
        const partNumbers = tf.expandDims(tf.range(0, numParts, 1, 'int32'), 1);
        const partMapFlattened = tf.cast(tf.matMul(flattenedMap, partNumbers), 'int32');
        return tf.reshape(partMapFlattened, [partMapHeight, partMapWidth]);
    });
}
exports.decodeOnlyPartSegmentation = decodeOnlyPartSegmentation;
