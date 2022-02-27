"use strict";
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 *
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
exports.scaleAndFlipPoses = exports.flipPosesHorizontal = exports.flipPoseHorizontal = exports.scalePoses = exports.scalePose = exports.toTensorBuffers3D = exports.padAndResizeTo = exports.resize2d = exports.removePaddingAndResizeBack = exports.scaleAndCropToInputTensorShape = exports.resizeAndPadTo = exports.toInputTensor = exports.toInputResolutionHeightAndWidth = exports.toValidInputResolution = exports.getInputSize = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
function getSizeFromImageLikeElement(input) {
    if ('offsetHeight' in input && input.offsetHeight !== 0
        && 'offsetWidth' in input && input.offsetWidth !== 0) {
        return [input.offsetHeight, input.offsetWidth];
    }
    else if (input.height != null && input.width != null) {
        return [input.height, input.width];
    }
    else {
        throw new Error(`HTMLImageElement must have height and width attributes set.`);
    }
}
function getSizeFromVideoElement(input) {
    if (input.hasAttribute('height') && input.hasAttribute('width')) {
        // Prioritizes user specified height and width.
        // We can't test the .height and .width properties directly,
        // because they evaluate to 0 if unset.
        return [input.height, input.width];
    }
    else {
        return [input.videoHeight, input.videoWidth];
    }
}
function getInputSize(input) {
    if ((typeof (HTMLCanvasElement) !== 'undefined' &&
        input instanceof HTMLCanvasElement) ||
        (typeof (OffscreenCanvas) !== 'undefined' &&
            input instanceof OffscreenCanvas) ||
        (typeof (HTMLImageElement) !== 'undefined' &&
            input instanceof HTMLImageElement)) {
        return getSizeFromImageLikeElement(input);
    }
    else if (typeof (ImageData) !== 'undefined' && input instanceof ImageData) {
        return [input.height, input.width];
    }
    else if (typeof (HTMLVideoElement) !== 'undefined' &&
        input instanceof HTMLVideoElement) {
        return getSizeFromVideoElement(input);
    }
    else if (input instanceof tf.Tensor) {
        return [input.shape[0], input.shape[1]];
    }
    else {
        throw new Error(`error: Unknown input type: ${input}.`);
    }
}
exports.getInputSize = getInputSize;
function isValidInputResolution(resolution, outputStride) {
    return (resolution - 1) % outputStride === 0;
}
function toValidInputResolution(inputResolution, outputStride) {
    if (isValidInputResolution(inputResolution, outputStride)) {
        return inputResolution;
    }
    return Math.floor(inputResolution / outputStride) * outputStride + 1;
}
exports.toValidInputResolution = toValidInputResolution;
const INTERNAL_RESOLUTION_STRING_OPTIONS = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    full: 'full'
};
const INTERNAL_RESOLUTION_PERCENTAGES = {
    [INTERNAL_RESOLUTION_STRING_OPTIONS.low]: 0.25,
    [INTERNAL_RESOLUTION_STRING_OPTIONS.medium]: 0.5,
    [INTERNAL_RESOLUTION_STRING_OPTIONS.high]: 0.75,
    [INTERNAL_RESOLUTION_STRING_OPTIONS.full]: 1.0
};
const MIN_INTERNAL_RESOLUTION = 0.1;
const MAX_INTERNAL_RESOLUTION = 2.0;
function toInternalResolutionPercentage(internalResolution) {
    if (typeof internalResolution === 'string') {
        const result = INTERNAL_RESOLUTION_PERCENTAGES[internalResolution];
        tf.util.assert(typeof result === 'number', () => `string value of inputResolution must be one of ${Object.values(INTERNAL_RESOLUTION_STRING_OPTIONS)
            .join(',')} but was ${internalResolution}.`);
        return result;
    }
    else {
        tf.util.assert(typeof internalResolution === 'number' &&
            internalResolution <= MAX_INTERNAL_RESOLUTION &&
            internalResolution >= MIN_INTERNAL_RESOLUTION, () => `inputResolution must be a string or number between ${MIN_INTERNAL_RESOLUTION} and ${MAX_INTERNAL_RESOLUTION}, but ` +
            `was ${internalResolution}`);
        return internalResolution;
    }
}
function toInputResolutionHeightAndWidth(internalResolution, outputStride, [inputHeight, inputWidth]) {
    const internalResolutionPercentage = toInternalResolutionPercentage(internalResolution);
    return [
        toValidInputResolution(inputHeight * internalResolutionPercentage, outputStride),
        toValidInputResolution(inputWidth * internalResolutionPercentage, outputStride)
    ];
}
exports.toInputResolutionHeightAndWidth = toInputResolutionHeightAndWidth;
function toInputTensor(input) {
    // TODO: tf.browser.fromPixels types to support OffscreenCanvas
    // @ts-ignore
    return input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
}
exports.toInputTensor = toInputTensor;
function resizeAndPadTo(imageTensor, [targetH, targetW], flipHorizontal = false) {
    const [height, width] = imageTensor.shape;
    const targetAspect = targetW / targetH;
    const aspect = width / height;
    let resizeW;
    let resizeH;
    let padL;
    let padR;
    let padT;
    let padB;
    if (aspect > targetAspect) {
        // resize to have the larger dimension match the shape.
        resizeW = targetW;
        resizeH = Math.ceil(resizeW / aspect);
        const padHeight = targetH - resizeH;
        padL = 0;
        padR = 0;
        padT = Math.floor(padHeight / 2);
        padB = targetH - (resizeH + padT);
    }
    else {
        resizeH = targetH;
        resizeW = Math.ceil(targetH * aspect);
        const padWidth = targetW - resizeW;
        padL = Math.floor(padWidth / 2);
        padR = targetW - (resizeW + padL);
        padT = 0;
        padB = 0;
    }
    const resizedAndPadded = tf.tidy(() => {
        // resize to have largest dimension match image
        let resized;
        if (flipHorizontal) {
            resized = tf.image.resizeBilinear(tf.reverse(imageTensor, 1), [resizeH, resizeW]);
        }
        else {
            resized = tf.image.resizeBilinear(imageTensor, [resizeH, resizeW]);
        }
        const padded = tf.pad3d(resized, [[padT, padB], [padL, padR], [0, 0]]);
        return padded;
    });
    return { resizedAndPadded, paddedBy: [[padT, padB], [padL, padR]] };
}
exports.resizeAndPadTo = resizeAndPadTo;
function scaleAndCropToInputTensorShape(tensor, [inputTensorHeight, inputTensorWidth], [resizedAndPaddedHeight, resizedAndPaddedWidth], [[padT, padB], [padL, padR]], applySigmoidActivation = false) {
    return tf.tidy(() => {
        let inResizedAndPadded = tf.image.resizeBilinear(tensor, [resizedAndPaddedHeight, resizedAndPaddedWidth], true);
        if (applySigmoidActivation) {
            inResizedAndPadded = tf.sigmoid(inResizedAndPadded);
        }
        return removePaddingAndResizeBack(inResizedAndPadded, [inputTensorHeight, inputTensorWidth], [[padT, padB], [padL, padR]]);
    });
}
exports.scaleAndCropToInputTensorShape = scaleAndCropToInputTensorShape;
function removePaddingAndResizeBack(resizedAndPadded, [originalHeight, originalWidth], [[padT, padB], [padL, padR]]) {
    return tf.tidy(() => {
        const batchedImage = tf.expandDims(resizedAndPadded);
        return tf.squeeze(tf.image
            .cropAndResize(batchedImage, [[
                padT / (originalHeight + padT + padB - 1.0),
                padL / (originalWidth + padL + padR - 1.0),
                (padT + originalHeight - 1.0) /
                    (originalHeight + padT + padB - 1.0),
                (padL + originalWidth - 1.0) / (originalWidth + padL + padR - 1.0)
            ]], [0], [originalHeight, originalWidth]), [0]);
    });
}
exports.removePaddingAndResizeBack = removePaddingAndResizeBack;
function resize2d(tensor, resolution, nearestNeighbor) {
    return tf.tidy(() => {
        const batchedImage = tf.expandDims(tensor, 2);
        return tf.squeeze(tf.image.resizeBilinear(batchedImage, resolution, nearestNeighbor));
    });
}
exports.resize2d = resize2d;
function padAndResizeTo(input, [targetH, targetW]) {
    const [height, width] = getInputSize(input);
    const targetAspect = targetW / targetH;
    const aspect = width / height;
    let [padT, padB, padL, padR] = [0, 0, 0, 0];
    if (aspect < targetAspect) {
        // pads the width
        padT = 0;
        padB = 0;
        padL = Math.round(0.5 * (targetAspect * height - width));
        padR = Math.round(0.5 * (targetAspect * height - width));
    }
    else {
        // pads the height
        padT = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
        padB = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
        padL = 0;
        padR = 0;
    }
    const resized = tf.tidy(() => {
        let imageTensor = toInputTensor(input);
        imageTensor = tf.pad3d(imageTensor, [[padT, padB], [padL, padR], [0, 0]]);
        return tf.image.resizeBilinear(imageTensor, [targetH, targetW]);
    });
    return { resized, padding: { top: padT, left: padL, right: padR, bottom: padB } };
}
exports.padAndResizeTo = padAndResizeTo;
function toTensorBuffers3D(tensors) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(tensors.map(tensor => tensor.buffer()));
    });
}
exports.toTensorBuffers3D = toTensorBuffers3D;
function scalePose(pose, scaleY, scaleX, offsetY = 0, offsetX = 0) {
    return {
        score: pose.score,
        keypoints: pose.keypoints.map(({ score, part, position }) => ({
            score,
            part,
            position: {
                x: position.x * scaleX + offsetX,
                y: position.y * scaleY + offsetY
            }
        }))
    };
}
exports.scalePose = scalePose;
function scalePoses(poses, scaleY, scaleX, offsetY = 0, offsetX = 0) {
    if (scaleX === 1 && scaleY === 1 && offsetY === 0 && offsetX === 0) {
        return poses;
    }
    return poses.map(pose => scalePose(pose, scaleY, scaleX, offsetY, offsetX));
}
exports.scalePoses = scalePoses;
function flipPoseHorizontal(pose, imageWidth) {
    return {
        score: pose.score,
        keypoints: pose.keypoints.map(({ score, part, position }) => ({
            score,
            part,
            position: { x: imageWidth - 1 - position.x, y: position.y }
        }))
    };
}
exports.flipPoseHorizontal = flipPoseHorizontal;
function flipPosesHorizontal(poses, imageWidth) {
    if (imageWidth <= 0) {
        return poses;
    }
    return poses.map(pose => flipPoseHorizontal(pose, imageWidth));
}
exports.flipPosesHorizontal = flipPosesHorizontal;
function scaleAndFlipPoses(poses, [height, width], [inputResolutionHeight, inputResolutionWidth], padding, flipHorizontal) {
    const scaleY = (height + padding.top + padding.bottom) / (inputResolutionHeight);
    const scaleX = (width + padding.left + padding.right) / (inputResolutionWidth);
    const scaledPoses = scalePoses(poses, scaleY, scaleX, -padding.top, -padding.left);
    if (flipHorizontal) {
        return flipPosesHorizontal(scaledPoses, width);
    }
    else {
        return scaledPoses;
    }
}
exports.scaleAndFlipPoses = scaleAndFlipPoses;
