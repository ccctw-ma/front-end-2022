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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftBox = exports.squarifyBox = exports.enlargeBox = exports.scaleBoxCoordinates = exports.cutBoxFromImageAndResize = exports.getBoxCenter = exports.getBoxSize = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
function getBoxSize(box) {
    return [
        Math.abs(box.endPoint[0] - box.startPoint[0]),
        Math.abs(box.endPoint[1] - box.startPoint[1])
    ];
}
exports.getBoxSize = getBoxSize;
function getBoxCenter(box) {
    return [
        box.startPoint[0] + (box.endPoint[0] - box.startPoint[0]) / 2,
        box.startPoint[1] + (box.endPoint[1] - box.startPoint[1]) / 2
    ];
}
exports.getBoxCenter = getBoxCenter;
function cutBoxFromImageAndResize(box, image, cropSize) {
    const h = image.shape[1];
    const w = image.shape[2];
    const boxes = [[
            box.startPoint[1] / h, box.startPoint[0] / w, box.endPoint[1] / h,
            box.endPoint[0] / w
        ]];
    return tf.image.cropAndResize(image, boxes, [0], cropSize);
}
exports.cutBoxFromImageAndResize = cutBoxFromImageAndResize;
function scaleBoxCoordinates(box, factor) {
    const startPoint = [box.startPoint[0] * factor[0], box.startPoint[1] * factor[1]];
    const endPoint = [box.endPoint[0] * factor[0], box.endPoint[1] * factor[1]];
    const palmLandmarks = box.palmLandmarks.map((coord) => {
        const scaledCoord = [coord[0] * factor[0], coord[1] * factor[1]];
        return scaledCoord;
    });
    return { startPoint, endPoint, palmLandmarks };
}
exports.scaleBoxCoordinates = scaleBoxCoordinates;
function enlargeBox(box, factor = 1.5) {
    const center = getBoxCenter(box);
    const size = getBoxSize(box);
    const newHalfSize = [factor * size[0] / 2, factor * size[1] / 2];
    const startPoint = [center[0] - newHalfSize[0], center[1] - newHalfSize[1]];
    const endPoint = [center[0] + newHalfSize[0], center[1] + newHalfSize[1]];
    return { startPoint, endPoint, palmLandmarks: box.palmLandmarks };
}
exports.enlargeBox = enlargeBox;
function squarifyBox(box) {
    const centers = getBoxCenter(box);
    const size = getBoxSize(box);
    const maxEdge = Math.max(...size);
    const halfSize = maxEdge / 2;
    const startPoint = [centers[0] - halfSize, centers[1] - halfSize];
    const endPoint = [centers[0] + halfSize, centers[1] + halfSize];
    return { startPoint, endPoint, palmLandmarks: box.palmLandmarks };
}
exports.squarifyBox = squarifyBox;
function shiftBox(box, shiftFactor) {
    const boxSize = [
        box.endPoint[0] - box.startPoint[0], box.endPoint[1] - box.startPoint[1]
    ];
    const shiftVector = [boxSize[0] * shiftFactor[0], boxSize[1] * shiftFactor[1]];
    const startPoint = [box.startPoint[0] + shiftVector[0], box.startPoint[1] + shiftVector[1]];
    const endPoint = [box.endPoint[0] + shiftVector[0], box.endPoint[1] + shiftVector[1]];
    return { startPoint, endPoint, palmLandmarks: box.palmLandmarks };
}
exports.shiftBox = shiftBox;
