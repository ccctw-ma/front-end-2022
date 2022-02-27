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
exports.assertMaskValue = exports.toTensorLossy = exports.toImageDataLossy = exports.toHTMLCanvasElementLossy = void 0;
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
function toNumber(value) {
    return value instanceof SVGAnimatedLength ? value.baseVal.value : value;
}
/**
 * Converts input image to an HTMLCanvasElement. Note that converting
 * back from the output of this function to imageData or a Tensor will be lossy
 * due to premultiplied alpha color values. For more details please reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
 * @param image Input image.
 *
 * @returns Converted HTMLCanvasElement.
 */
function toHTMLCanvasElementLossy(image) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.createElement('canvas');
        if (image instanceof tf.Tensor) {
            yield tf.browser.toPixels(image, canvas);
        }
        else {
            canvas.width = toNumber(image.width);
            canvas.height = toNumber(image.height);
            const ctx = canvas.getContext('2d');
            if (image instanceof ImageData) {
                ctx.putImageData(image, 0, 0);
            }
            else {
                ctx.drawImage(image, 0, 0);
            }
        }
        return canvas;
    });
}
exports.toHTMLCanvasElementLossy = toHTMLCanvasElementLossy;
/**
 * Converts input image to ImageData. Note that converting
 * from a CanvasImageSource will be lossy due to premultiplied alpha color
 * values. For more details please reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
 * @param image Input image.
 *
 * @returns Converted ImageData.
 */
function toImageDataLossy(image) {
    return __awaiter(this, void 0, void 0, function* () {
        if (image instanceof tf.Tensor) {
            const [height, width] = image.shape.slice(0, 2);
            return new ImageData(yield tf.browser.toPixels(image), width, height);
        }
        else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = toNumber(image.width);
            canvas.height = toNumber(image.height);
            ctx.drawImage(image, 0, 0);
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    });
}
exports.toImageDataLossy = toImageDataLossy;
/**
 * Converts input image to Tensor. Note that converting
 * from a CanvasImageSource will be lossy due to premultiplied alpha color
 * values. For more details please reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
 * @param image Input image.
 *
 * @returns Converted Tensor.
 */
function toTensorLossy(image) {
    return __awaiter(this, void 0, void 0, function* () {
        const pixelsInput = (image instanceof SVGImageElement || image instanceof OffscreenCanvas) ?
            yield toHTMLCanvasElementLossy(image) :
            image;
        return tf.browser.fromPixels(pixelsInput, 4);
    });
}
exports.toTensorLossy = toTensorLossy;
function assertMaskValue(maskValue) {
    if (maskValue < 0 || maskValue >= 256) {
        throw new Error(`Mask value must be in range [0, 255] but got ${maskValue}`);
    }
    if (!Number.isInteger(maskValue)) {
        throw new Error(`Mask value must be an integer but got ${maskValue}`);
    }
}
exports.assertMaskValue = assertMaskValue;
