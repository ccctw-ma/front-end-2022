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
exports.BaseModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
/**
 * BodyPix supports using various convolution neural network models
 * (e.g. ResNet and MobileNetV1) as its underlying base model.
 * The following BaseModel interface defines a unified interface for
 * creating such BodyPix base models. Currently both MobileNet (in
 * ./mobilenet.ts) and ResNet (in ./resnet.ts) implements the BaseModel
 * interface. New base models that conform to the BaseModel interface can be
 * added to BodyPix.
 */
class BaseModel {
    constructor(model, outputStride) {
        this.model = model;
        this.outputStride = outputStride;
        const inputShape = this.model.inputs[0].shape;
        tf.util.assert((inputShape[1] === -1) && (inputShape[2] === -1), () => `Input shape [${inputShape[1]}, ${inputShape[2]}] ` +
            `must both be equal to or -1`);
    }
    /**
     * Predicts intermediate Tensor representations.
     *
     * @param input The input RGB image of the base model.
     * A Tensor of shape: [`inputResolution`, `inputResolution`, 3].
     *
     * @return A dictionary of base model's intermediate predictions.
     * The returned dictionary should contains the following elements:
     * - heatmapScores: A Tensor3D that represents the keypoint heatmap scores.
     * - offsets: A Tensor3D that represents the offsets.
     * - displacementFwd: A Tensor3D that represents the forward displacement.
     * - displacementBwd: A Tensor3D that represents the backward displacement.
     * - segmentation: A Tensor3D that represents the segmentation of all
     * people.
     * - longOffsets: A Tensor3D that represents the long offsets used for
     * instance grouping.
     * - partHeatmaps: A Tensor3D that represents the body part segmentation.
     */
    predict(input) {
        return tf.tidy(() => {
            const asFloat = this.preprocessInput(tf.cast(input, 'float32'));
            const asBatch = tf.expandDims(asFloat, 0);
            const results = this.model.predict(asBatch);
            const results3d = results.map(y => tf.squeeze(y, [0]));
            const namedResults = this.nameOutputResults(results3d);
            return {
                heatmapScores: tf.sigmoid(namedResults.heatmap),
                offsets: namedResults.offsets,
                displacementFwd: namedResults.displacementFwd,
                displacementBwd: namedResults.displacementBwd,
                segmentation: namedResults.segmentation,
                partHeatmaps: namedResults.partHeatmaps,
                longOffsets: namedResults.longOffsets,
                partOffsets: namedResults.partOffsets
            };
        });
    }
    /**
     * Releases the CPU and GPU memory allocated by the model.
     */
    dispose() {
        this.model.dispose();
    }
}
exports.BaseModel = BaseModel;
