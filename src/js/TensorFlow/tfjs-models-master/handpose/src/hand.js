"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
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
exports.HandDetector = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const box_1 = require("./box");
class HandDetector {
    constructor(model, width, height, anchorsAnnotated, iouThreshold, scoreThreshold) {
        this.model = model;
        this.width = width;
        this.height = height;
        this.iouThreshold = iouThreshold;
        this.scoreThreshold = scoreThreshold;
        this.anchors = anchorsAnnotated.map(anchor => [anchor.x_center, anchor.y_center]);
        this.anchorsTensor = tf.tensor2d(this.anchors);
        this.inputSizeTensor = tf.tensor1d([width, height]);
        this.doubleInputSizeTensor = tf.tensor1d([width * 2, height * 2]);
    }
    normalizeBoxes(boxes) {
        return tf.tidy(() => {
            const boxOffsets = tf.slice(boxes, [0, 0], [-1, 2]);
            const boxSizes = tf.slice(boxes, [0, 2], [-1, 2]);
            const boxCenterPoints = tf.add(tf.div(boxOffsets, this.inputSizeTensor), this.anchorsTensor);
            const halfBoxSizes = tf.div(boxSizes, this.doubleInputSizeTensor);
            const startPoints = tf.mul(tf.sub(boxCenterPoints, halfBoxSizes), this.inputSizeTensor);
            const endPoints = tf.mul(tf.add(boxCenterPoints, halfBoxSizes), this.inputSizeTensor);
            return tf.concat2d([startPoints, endPoints], 1);
        });
    }
    normalizeLandmarks(rawPalmLandmarks, index) {
        return tf.tidy(() => {
            const landmarks = tf.add(tf.div(tf.reshape(rawPalmLandmarks, [-1, 7, 2]), this.inputSizeTensor), this.anchors[index]);
            return tf.mul(landmarks, this.inputSizeTensor);
        });
    }
    getBoundingBoxes(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedInput = tf.tidy(() => tf.mul(tf.sub(input, 0.5), 2));
            let batchedPrediction;
            if (tf.getBackend() === 'webgl') {
                // Currently tfjs-core does not pack depthwiseConv because it fails for
                // very large inputs (https://github.com/tensorflow/tfjs/issues/1652).
                // TODO(annxingyuan): call tf.enablePackedDepthwiseConv when available
                // (https://github.com/tensorflow/tfjs/issues/2821)
                const savedWebglPackDepthwiseConvFlag = tf.env().get('WEBGL_PACK_DEPTHWISECONV');
                tf.env().set('WEBGL_PACK_DEPTHWISECONV', true);
                // The model returns a tensor with the following shape:
                //  [1 (batch), 2944 (anchor points), 19 (data for each anchor)]
                batchedPrediction = this.model.predict(normalizedInput);
                tf.env().set('WEBGL_PACK_DEPTHWISECONV', savedWebglPackDepthwiseConvFlag);
            }
            else {
                batchedPrediction = this.model.predict(normalizedInput);
            }
            const prediction = tf.squeeze(batchedPrediction);
            // Regression score for each anchor point.
            const scores = tf.tidy(() => tf.squeeze(tf.sigmoid(tf.slice(prediction, [0, 0], [-1, 1]))));
            // Bounding box for each anchor point.
            const rawBoxes = tf.slice(prediction, [0, 1], [-1, 4]);
            const boxes = this.normalizeBoxes(rawBoxes);
            const savedConsoleWarnFn = console.warn;
            console.warn = () => { };
            const boxesWithHandsTensor = tf.image.nonMaxSuppression(boxes, scores, 1, this.iouThreshold, this.scoreThreshold);
            console.warn = savedConsoleWarnFn;
            const boxesWithHands = yield boxesWithHandsTensor.array();
            const toDispose = [
                normalizedInput, batchedPrediction, boxesWithHandsTensor, prediction,
                boxes, rawBoxes, scores
            ];
            if (boxesWithHands.length === 0) {
                toDispose.forEach(tensor => tensor.dispose());
                return null;
            }
            const boxIndex = boxesWithHands[0];
            const matchingBox = tf.slice(boxes, [boxIndex, 0], [1, -1]);
            const rawPalmLandmarks = tf.slice(prediction, [boxIndex, 5], [1, 14]);
            const palmLandmarks = tf.tidy(() => tf.reshape(this.normalizeLandmarks(rawPalmLandmarks, boxIndex), [
                -1, 2
            ]));
            toDispose.push(rawPalmLandmarks);
            toDispose.forEach(tensor => tensor.dispose());
            return { boxes: matchingBox, palmLandmarks };
        });
    }
    /**
     * Returns a Box identifying the bounding box of a hand within the image.
     * Returns null if there is no hand in the image.
     *
     * @param input The image to classify.
     */
    estimateHandBounds(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputHeight = input.shape[1];
            const inputWidth = input.shape[2];
            const image = tf.tidy(() => tf.div(tf.image.resizeBilinear(input, [this.width, this.height]), 255));
            const prediction = yield this.getBoundingBoxes(image);
            if (prediction === null) {
                image.dispose();
                return null;
            }
            // Calling arraySync on both boxes and palmLandmarks because the tensors are
            // very small so it's not worth calling await array().
            const boundingBoxes = prediction.boxes.arraySync();
            const startPoint = boundingBoxes[0].slice(0, 2);
            const endPoint = boundingBoxes[0].slice(2, 4);
            const palmLandmarks = prediction.palmLandmarks.arraySync();
            image.dispose();
            prediction.boxes.dispose();
            prediction.palmLandmarks.dispose();
            return (0, box_1.scaleBoxCoordinates)({ startPoint, endPoint, palmLandmarks }, [inputWidth / this.width, inputHeight / this.height]);
        });
    }
}
exports.HandDetector = HandDetector;
