"use strict";
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
exports.convertImageToTensor = void 0;
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
const get_rotated_sub_rect_to_rect_transformation_matrix_1 = require("./get_rotated_sub_rect_to_rect_transformation_matrix");
const image_utils_1 = require("./image_utils");
const shift_image_value_1 = require("./shift_image_value");
/**
 * Convert an image or part of it to an image tensor.
 *
 * @param image An image, video frame or image tensor.
 * @param config
 *      inputResolution: The target height and width.
 *      keepAspectRatio?: Whether target tensor should keep aspect ratio.
 * @param normRect A normalized rectangle, representing the subarea to crop from
 *      the image. If normRect is provided, the returned image tensor represents
 *      the subarea.
 * @returns A map with the following properties:
 *     - imageTensor
 *     - padding: Padding ratio of left, top, right, bottom, based on the output
 * dimensions.
 *     - transformationMatrix: Projective transform matrix used to transform
 * input image to transformed image.
 */
function convertImageToTensor(image, config, normRect) {
    const { outputTensorSize, keepAspectRatio, borderMode, outputTensorFloatRange } = config;
    // Ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/tensor/image_to_tensor_calculator.cc
    const imageSize = (0, image_utils_1.getImageSize)(image);
    const roi = (0, image_utils_1.getRoi)(imageSize, normRect);
    const padding = (0, image_utils_1.padRoi)(roi, outputTensorSize, keepAspectRatio);
    const transformationMatrix = (0, get_rotated_sub_rect_to_rect_transformation_matrix_1.getRotatedSubRectToRectTransformMatrix)(roi, imageSize.width, imageSize.height, false);
    const imageTensor = tf.tidy(() => {
        const $image = (0, image_utils_1.toImageTensor)(image);
        const transformMatrix = tf.tensor2d((0, image_utils_1.getProjectiveTransformMatrix)(transformationMatrix, imageSize, outputTensorSize), [1, 8]);
        const fillMode = borderMode === 'zero' ? 'constant' : 'nearest';
        const imageTransformed = tf.image.transform(
        // tslint:disable-next-line: no-unnecessary-type-assertion
        tf.expandDims(tf.cast($image, 'float32')), transformMatrix, 'bilinear', fillMode, 0, [outputTensorSize.height, outputTensorSize.width]);
        const imageShifted = outputTensorFloatRange != null ?
            (0, shift_image_value_1.shiftImageValue)(imageTransformed, outputTensorFloatRange) :
            imageTransformed;
        return imageShifted;
    });
    return { imageTensor, padding, transformationMatrix };
}
exports.convertImageToTensor = convertImageToTensor;
