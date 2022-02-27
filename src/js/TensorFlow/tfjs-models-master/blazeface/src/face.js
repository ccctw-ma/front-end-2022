"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
exports.BlazeFaceModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const box_1 = require("./box");
const ANCHORS_CONFIG = {
    'strides': [8, 16],
    'anchors': [2, 6]
};
// `NUM_LANDMARKS` is a fixed property of the model.
const NUM_LANDMARKS = 6;
function generateAnchors(width, height, outputSpec) {
    const anchors = [];
    for (let i = 0; i < outputSpec.strides.length; i++) {
        const stride = outputSpec.strides[i];
        const gridRows = Math.floor((height + stride - 1) / stride);
        const gridCols = Math.floor((width + stride - 1) / stride);
        const anchorsNum = outputSpec.anchors[i];
        for (let gridY = 0; gridY < gridRows; gridY++) {
            const anchorY = stride * (gridY + 0.5);
            for (let gridX = 0; gridX < gridCols; gridX++) {
                const anchorX = stride * (gridX + 0.5);
                for (let n = 0; n < anchorsNum; n++) {
                    anchors.push([anchorX, anchorY]);
                }
            }
        }
    }
    return anchors;
}
function decodeBounds(boxOutputs, anchors, inputSize) {
    const boxStarts = tf.slice(boxOutputs, [0, 1], [-1, 2]);
    const centers = tf.add(boxStarts, anchors);
    const boxSizes = tf.slice(boxOutputs, [0, 3], [-1, 2]);
    const boxSizesNormalized = tf.div(boxSizes, inputSize);
    const centersNormalized = tf.div(centers, inputSize);
    const halfBoxSize = tf.div(boxSizesNormalized, 2);
    const starts = tf.sub(centersNormalized, halfBoxSize);
    const ends = tf.add(centersNormalized, halfBoxSize);
    const startNormalized = tf.mul(starts, inputSize);
    const endNormalized = tf.mul(ends, inputSize);
    const concatAxis = 1;
    return tf.concat2d([startNormalized, endNormalized], concatAxis);
}
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
function flipFaceHorizontal(face, imageWidth) {
    let flippedTopLeft, flippedBottomRight, flippedLandmarks;
    if (face.topLeft instanceof tf.Tensor &&
        face.bottomRight instanceof tf.Tensor) {
        const [topLeft, bottomRight] = tf.tidy(() => {
            return [
                tf.concat([
                    tf.slice(tf.sub(imageWidth - 1, face.topLeft), 0, 1),
                    tf.slice(face.topLeft, 1, 1)
                ]),
                tf.concat([
                    tf.sub(imageWidth - 1, tf.slice(face.bottomRight, 0, 1)),
                    tf.slice(face.bottomRight, 1, 1)
                ])
            ];
        });
        flippedTopLeft = topLeft;
        flippedBottomRight = bottomRight;
        if (face.landmarks != null) {
            flippedLandmarks = tf.tidy(() => {
                const a = tf.sub(tf.tensor1d([imageWidth - 1, 0]), face.landmarks);
                const b = tf.tensor1d([1, -1]);
                const product = tf.mul(a, b);
                return product;
            });
        }
    }
    else {
        const [topLeftX, topLeftY] = face.topLeft;
        const [bottomRightX, bottomRightY] = face.bottomRight;
        flippedTopLeft = [imageWidth - 1 - topLeftX, topLeftY];
        flippedBottomRight = [imageWidth - 1 - bottomRightX, bottomRightY];
        if (face.landmarks != null) {
            flippedLandmarks =
                face.landmarks.map((coord) => ([
                    imageWidth - 1 - coord[0],
                    coord[1]
                ]));
        }
    }
    const flippedFace = {
        topLeft: flippedTopLeft,
        bottomRight: flippedBottomRight
    };
    if (flippedLandmarks != null) {
        flippedFace.landmarks = flippedLandmarks;
    }
    if (face.probability != null) {
        flippedFace.probability = face.probability instanceof tf.Tensor ?
            face.probability.clone() :
            face.probability;
    }
    return flippedFace;
}
function scaleBoxFromPrediction(face, scaleFactor) {
    return tf.tidy(() => {
        let box;
        if (face.hasOwnProperty('box')) {
            box = face.box;
        }
        else {
            box = face;
        }
        return tf.squeeze((0, box_1.scaleBox)(box, scaleFactor).startEndTensor);
    });
}
class BlazeFaceModel {
    constructor(model, width, height, maxFaces, iouThreshold, scoreThreshold) {
        this.blazeFaceModel = model;
        this.width = width;
        this.height = height;
        this.maxFaces = maxFaces;
        this.anchorsData = generateAnchors(width, height, ANCHORS_CONFIG);
        this.anchors = tf.tensor2d(this.anchorsData);
        this.inputSizeData = [width, height];
        this.inputSize = tf.tensor1d([width, height]);
        this.iouThreshold = iouThreshold;
        this.scoreThreshold = scoreThreshold;
    }
    getBoundingBoxes(inputImage, returnTensors, annotateBoxes = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const [detectedOutputs, boxes, scores] = tf.tidy(() => {
                const resizedImage = tf.image.resizeBilinear(inputImage, [this.width, this.height]);
                const normalizedImage = tf.mul(tf.sub(tf.div(resizedImage, 255), 0.5), 2);
                // [1, 897, 17] 1 = batch, 897 = number of anchors
                const batchedPrediction = this.blazeFaceModel.predict(normalizedImage);
                const prediction = tf.squeeze(batchedPrediction);
                const decodedBounds = decodeBounds(prediction, this.anchors, this.inputSize);
                const logits = tf.slice(prediction, [0, 0], [-1, 1]);
                const scores = tf.squeeze(tf.sigmoid(logits));
                return [prediction, decodedBounds, scores];
            });
            // TODO: Once tf.image.nonMaxSuppression includes a flag to suppress console
            // warnings for not using async version, pass that flag in.
            const savedConsoleWarnFn = console.warn;
            console.warn = () => { };
            const boxIndicesTensor = tf.image.nonMaxSuppression(boxes, scores, this.maxFaces, this.iouThreshold, this.scoreThreshold);
            console.warn = savedConsoleWarnFn;
            const boxIndices = yield boxIndicesTensor.array();
            boxIndicesTensor.dispose();
            let boundingBoxes = boxIndices.map((boxIndex) => tf.slice(boxes, [boxIndex, 0], [1, -1]));
            if (!returnTensors) {
                boundingBoxes = yield Promise.all(boundingBoxes.map((boundingBox) => __awaiter(this, void 0, void 0, function* () {
                    const vals = yield boundingBox.array();
                    boundingBox.dispose();
                    return vals;
                })));
            }
            const originalHeight = inputImage.shape[1];
            const originalWidth = inputImage.shape[2];
            let scaleFactor;
            if (returnTensors) {
                scaleFactor = tf.div([originalWidth, originalHeight], this.inputSize);
            }
            else {
                scaleFactor = [
                    originalWidth / this.inputSizeData[0],
                    originalHeight / this.inputSizeData[1]
                ];
            }
            const annotatedBoxes = [];
            for (let i = 0; i < boundingBoxes.length; i++) {
                const boundingBox = boundingBoxes[i];
                const annotatedBox = tf.tidy(() => {
                    const box = boundingBox instanceof tf.Tensor ?
                        (0, box_1.createBox)(boundingBox) :
                        (0, box_1.createBox)(tf.tensor2d(boundingBox));
                    if (!annotateBoxes) {
                        return box;
                    }
                    const boxIndex = boxIndices[i];
                    let anchor;
                    if (returnTensors) {
                        anchor = tf.slice(this.anchors, [boxIndex, 0], [1, 2]);
                    }
                    else {
                        anchor = this.anchorsData[boxIndex];
                    }
                    const landmarks = tf.reshape(tf.squeeze(tf.slice(detectedOutputs, [boxIndex, NUM_LANDMARKS - 1], [1, -1])), [NUM_LANDMARKS, -1]);
                    const probability = tf.slice(scores, [boxIndex], [1]);
                    return { box, landmarks, probability, anchor };
                });
                annotatedBoxes.push(annotatedBox);
            }
            boxes.dispose();
            scores.dispose();
            detectedOutputs.dispose();
            return {
                boxes: annotatedBoxes,
                scaleFactor
            };
        });
    }
    /**
     * Returns an array of faces in an image.
     *
     * @param input The image to classify. Can be a tensor, DOM element image,
     * video, or canvas.
     * @param returnTensors (defaults to `false`) Whether to return tensors as
     * opposed to values.
     * @param flipHorizontal Whether to flip/mirror the facial keypoints
     * horizontally. Should be true for videos that are flipped by default (e.g.
     * webcams).
     * @param annotateBoxes (defaults to `true`) Whether to annotate bounding
     * boxes with additional properties such as landmarks and probability. Pass in
     * `false` for faster inference if annotations are not needed.
     *
     * @return An array of detected faces, each with the following properties:
     *  `topLeft`: the upper left coordinate of the face in the form `[x, y]`
     *  `bottomRight`: the lower right coordinate of the face in the form `[x, y]`
     *  `landmarks`: facial landmark coordinates
     *  `probability`: the probability of the face being present
     */
    estimateFaces(input, returnTensors = false, flipHorizontal = false, annotateBoxes = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const [, width] = getInputTensorDimensions(input);
            const image = tf.tidy(() => {
                if (!(input instanceof tf.Tensor)) {
                    input = tf.browser.fromPixels(input);
                }
                return tf.expandDims(tf.cast(input, 'float32'), 0);
            });
            const { boxes, scaleFactor } = yield this.getBoundingBoxes(image, returnTensors, annotateBoxes);
            image.dispose();
            if (returnTensors) {
                return boxes.map((face) => {
                    const scaledBox = scaleBoxFromPrediction(face, scaleFactor);
                    let normalizedFace = {
                        topLeft: tf.slice(scaledBox, [0], [2]),
                        bottomRight: tf.slice(scaledBox, [2], [2])
                    };
                    if (annotateBoxes) {
                        const { landmarks, probability, anchor } = face;
                        const normalizedLandmarks = tf.mul(tf.add(landmarks, anchor), scaleFactor);
                        normalizedFace.landmarks = normalizedLandmarks;
                        normalizedFace.probability = probability;
                    }
                    if (flipHorizontal) {
                        normalizedFace = flipFaceHorizontal(normalizedFace, width);
                    }
                    return normalizedFace;
                });
            }
            return Promise.all(boxes.map((face) => __awaiter(this, void 0, void 0, function* () {
                const scaledBox = scaleBoxFromPrediction(face, scaleFactor);
                let normalizedFace;
                if (!annotateBoxes) {
                    const boxData = yield scaledBox.array();
                    normalizedFace = {
                        topLeft: boxData.slice(0, 2),
                        bottomRight: boxData.slice(2)
                    };
                }
                else {
                    const [landmarkData, boxData, probabilityData] = yield Promise.all([face.landmarks, scaledBox, face.probability].map((d) => __awaiter(this, void 0, void 0, function* () { return d.array(); })));
                    const anchor = face.anchor;
                    const [scaleFactorX, scaleFactorY] = scaleFactor;
                    const scaledLandmarks = landmarkData
                        .map(landmark => ([
                        (landmark[0] + anchor[0]) * scaleFactorX,
                        (landmark[1] + anchor[1]) * scaleFactorY
                    ]));
                    normalizedFace = {
                        topLeft: boxData.slice(0, 2),
                        bottomRight: boxData.slice(2),
                        landmarks: scaledLandmarks,
                        probability: probabilityData
                    };
                    (0, box_1.disposeBox)(face.box);
                    face.landmarks.dispose();
                    face.probability.dispose();
                }
                scaledBox.dispose();
                if (flipHorizontal) {
                    normalizedFace = flipFaceHorizontal(normalizedFace, width);
                }
                return normalizedFace;
            })));
        });
    }
    /**
     * Dispose the WebGL memory held by the underlying model.
     */
    dispose() {
        if (this.blazeFaceModel != null) {
            this.blazeFaceModel.dispose();
        }
    }
}
exports.BlazeFaceModel = BlazeFaceModel;
