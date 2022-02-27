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
exports.scaleAndFlipPoses = exports.padAndResizeTo = exports.toResizedInputTensor = exports.toInputTensor = exports.getInputTensorDimensions = exports.assertValidResolution = exports.assertValidOutputStride = exports.getValidInputResolutionDimensions = exports.validateInputResolution = exports.toValidInputResolution = exports.flipPosesHorizontal = exports.flipPoseHorizontal = exports.scalePoses = exports.scalePose = exports.toTensorBuffers3D = exports.getBoundingBoxPoints = exports.getBoundingBox = exports.getAdjacentKeyPoints = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const keypoints_1 = require("./keypoints");
function eitherPointDoesntMeetConfidence(a, b, minConfidence) {
    return (a < minConfidence || b < minConfidence);
}
function getAdjacentKeyPoints(keypoints, minConfidence) {
    return keypoints_1.connectedPartIndices.reduce((result, [leftJoint, rightJoint]) => {
        if (eitherPointDoesntMeetConfidence(keypoints[leftJoint].score, keypoints[rightJoint].score, minConfidence)) {
            return result;
        }
        result.push([keypoints[leftJoint], keypoints[rightJoint]]);
        return result;
    }, []);
}
exports.getAdjacentKeyPoints = getAdjacentKeyPoints;
const { NEGATIVE_INFINITY, POSITIVE_INFINITY } = Number;
function getBoundingBox(keypoints) {
    return keypoints.reduce(({ maxX, maxY, minX, minY }, { position: { x, y } }) => {
        return {
            maxX: Math.max(maxX, x),
            maxY: Math.max(maxY, y),
            minX: Math.min(minX, x),
            minY: Math.min(minY, y)
        };
    }, {
        maxX: NEGATIVE_INFINITY,
        maxY: NEGATIVE_INFINITY,
        minX: POSITIVE_INFINITY,
        minY: POSITIVE_INFINITY
    });
}
exports.getBoundingBox = getBoundingBox;
function getBoundingBoxPoints(keypoints) {
    const { minX, minY, maxX, maxY } = getBoundingBox(keypoints);
    return [
        { x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY },
        { x: minX, y: maxY }
    ];
}
exports.getBoundingBoxPoints = getBoundingBoxPoints;
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
function toValidInputResolution(inputResolution, outputStride) {
    if (isValidInputResolution(inputResolution, outputStride)) {
        return inputResolution;
    }
    return Math.floor(inputResolution / outputStride) * outputStride + 1;
}
exports.toValidInputResolution = toValidInputResolution;
function validateInputResolution(inputResolution) {
    tf.util.assert(typeof inputResolution === 'number' ||
        typeof inputResolution === 'object', () => `Invalid inputResolution ${inputResolution}. ` +
        `Should be a number or an object with width and height`);
    if (typeof inputResolution === 'object') {
        tf.util.assert(typeof inputResolution.width === 'number', () => `inputResolution.width has a value of ${inputResolution.width} which is invalid; it must be a number`);
        tf.util.assert(typeof inputResolution.height === 'number', () => `inputResolution.height has a value of ${inputResolution.height} which is invalid; it must be a number`);
    }
}
exports.validateInputResolution = validateInputResolution;
function getValidInputResolutionDimensions(inputResolution, outputStride) {
    validateInputResolution(inputResolution);
    if (typeof inputResolution === 'object') {
        return [
            toValidInputResolution(inputResolution.height, outputStride),
            toValidInputResolution(inputResolution.width, outputStride),
        ];
    }
    else {
        return [
            toValidInputResolution(inputResolution, outputStride),
            toValidInputResolution(inputResolution, outputStride),
        ];
    }
}
exports.getValidInputResolutionDimensions = getValidInputResolutionDimensions;
const VALID_OUTPUT_STRIDES = [8, 16, 32];
function assertValidOutputStride(outputStride) {
    tf.util.assert(typeof outputStride === 'number', () => 'outputStride is not a number');
    tf.util.assert(VALID_OUTPUT_STRIDES.indexOf(outputStride) >= 0, () => `outputStride of ${outputStride} is invalid. ` +
        `It must be either 8, 16, or 32`);
}
exports.assertValidOutputStride = assertValidOutputStride;
function isValidInputResolution(resolution, outputStride) {
    return (resolution - 1) % outputStride === 0;
}
function assertValidResolution(resolution, outputStride) {
    tf.util.assert(typeof resolution[0] === 'number' && typeof resolution[1] === 'number', () => `both resolution values must be a number but had values ${resolution}`);
    tf.util.assert(isValidInputResolution(resolution[0], outputStride), () => `height of ${resolution[0]} is invalid for output stride ` +
        `${outputStride}.`);
    tf.util.assert(isValidInputResolution(resolution[1], outputStride), () => `width of ${resolution[1]} is invalid for output stride ` +
        `${outputStride}.`);
}
exports.assertValidResolution = assertValidResolution;
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
exports.getInputTensorDimensions = getInputTensorDimensions;
function toInputTensor(input) {
    return input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
}
exports.toInputTensor = toInputTensor;
function toResizedInputTensor(input, resizeHeight, resizeWidth, flipHorizontal) {
    return tf.tidy(() => {
        const imageTensor = toInputTensor(input);
        if (flipHorizontal) {
            return tf.image.resizeBilinear(tf.reverse(imageTensor, 1), [resizeHeight, resizeWidth]);
        }
        else {
            return tf.image.resizeBilinear(imageTensor, [resizeHeight, resizeWidth]);
        }
    });
}
exports.toResizedInputTensor = toResizedInputTensor;
function padAndResizeTo(input, [targetH, targetW]) {
    const [height, width] = getInputTensorDimensions(input);
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
