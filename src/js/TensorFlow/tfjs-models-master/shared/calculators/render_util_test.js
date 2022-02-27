"use strict";
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
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const test_util_2 = require("../test_util");
const mask_util_1 = require("./mask_util");
const renderUtil = __importStar(require("./render_util"));
class ImageDataMask {
    constructor(mask) {
        this.mask = mask;
    }
    toCanvasImageSource() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toHTMLCanvasElementLossy)(this.mask);
        });
    }
    toImageData() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mask;
        });
    }
    toTensor() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toTensorLossy)(this.mask);
        });
    }
    getUnderlyingType() {
        return 'imagedata';
    }
}
function getSegmentation(imageData) {
    return {
        maskValueToLabel: (maskValue) => `${maskValue}`,
        mask: new ImageDataMask(imageData),
    };
}
const WIDTH = 1049;
const HEIGHT = 861;
function getBinarySegmentation() {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, test_util_2.loadImage)('shared/three_people_binary_segmentation.png', WIDTH, HEIGHT);
        const imageData = yield (0, mask_util_1.toImageDataLossy)(image);
        return [getSegmentation(imageData)];
    });
}
function getBinaryMask() {
    return __awaiter(this, void 0, void 0, function* () {
        const segmentation = yield getBinarySegmentation();
        const binaryMask = yield renderUtil.toBinaryMask(segmentation, { r: 255, g: 255, b: 255, a: 255 }, { r: 0, g: 0, b: 0, a: 255 });
        return binaryMask;
    });
}
function getColoredSegmentation() {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, test_util_2.loadImage)('shared/three_people_colored_segmentation.png', WIDTH, HEIGHT);
        const imageData = yield (0, mask_util_1.toImageDataLossy)(image);
        return [getSegmentation(imageData)];
    });
}
const RAINBOW_PART_COLORS = [
    [110, 64, 170], [143, 61, 178], [178, 60, 178], [210, 62, 167],
    [238, 67, 149], [255, 78, 125], [255, 94, 99], [255, 115, 75],
    [255, 140, 56], [239, 167, 47], [217, 194, 49], [194, 219, 64],
    [175, 240, 91], [135, 245, 87], [96, 247, 96], [64, 243, 115],
    [40, 234, 141], [28, 219, 169], [26, 199, 194], [33, 176, 213],
    [47, 150, 224], [65, 125, 224], [84, 101, 214], [99, 81, 195]
];
function maskValueToRainbowColor(maskValue) {
    const [r, g, b] = RAINBOW_PART_COLORS[maskValue];
    return { r, g, b, a: 255 };
}
function getColoredMask() {
    return __awaiter(this, void 0, void 0, function* () {
        const segmentation = yield getColoredSegmentation();
        const coloredMask = yield renderUtil.toColoredMask(segmentation, maskValueToRainbowColor, { r: 255, g: 255, b: 255, a: 255 });
        return coloredMask;
    });
}
function expectImage(actual, imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, test_util_2.loadImage)(imageName, WIDTH, HEIGHT)
            .then(image => (0, mask_util_1.toImageDataLossy)(image))
            .then((expectedImage) => __awaiter(this, void 0, void 0, function* () { return (0, test_util_1.expectArraysClose)(actual.data, expectedImage.data); }));
    });
}
(0, jasmine_util_1.describeWithFlags)('renderUtil', jasmine_util_1.BROWSER_ENVS, () => {
    let image;
    let timeout;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        image = yield (0, test_util_2.loadImage)('shared/three_people.jpg', WIDTH, HEIGHT);
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('toBinaryMask.', () => __awaiter(void 0, void 0, void 0, function* () {
        const binaryMask = yield getBinaryMask();
        yield expectImage(binaryMask, 'shared/three_people_binary_mask.png');
    }));
    it('toColoredMask.', () => __awaiter(void 0, void 0, void 0, function* () {
        const coloredMask = yield getColoredMask();
        yield expectImage(coloredMask, 'shared/three_people_colored_mask.png');
    }));
    it('drawMask.', () => __awaiter(void 0, void 0, void 0, function* () {
        const binaryMask = yield getBinaryMask();
        const canvas = document.createElement('canvas');
        yield renderUtil.drawMask(canvas, image, binaryMask, 0.7, 3);
        const imageMask = yield (0, mask_util_1.toImageDataLossy)(canvas);
        yield expectImage(imageMask, 'shared/three_people_draw_mask.png');
    }));
    it('drawPixelatedMask.', () => __awaiter(void 0, void 0, void 0, function* () {
        const coloredMask = yield getColoredMask();
        const canvas = document.createElement('canvas');
        yield renderUtil.drawPixelatedMask(canvas, image, coloredMask);
        const imageMask = yield (0, mask_util_1.toImageDataLossy)(canvas);
        yield expectImage(imageMask, 'shared/three_people_pixelated_mask.png');
    }));
    it('drawBokehEffect.', () => __awaiter(void 0, void 0, void 0, function* () {
        const binarySegmentation = yield getBinarySegmentation();
        const canvas = document.createElement('canvas');
        yield renderUtil.drawBokehEffect(canvas, image, binarySegmentation);
        const imageMask = yield (0, mask_util_1.toImageDataLossy)(canvas);
        yield expectImage(imageMask, 'shared/three_people_bokeh_effect.png');
    }));
    it('blurBodyPart.', () => __awaiter(void 0, void 0, void 0, function* () {
        const coloredSegmentation = yield getColoredSegmentation();
        const canvas = document.createElement('canvas');
        yield renderUtil.blurBodyPart(canvas, image, coloredSegmentation, [0, 1]);
        const imageMask = yield (0, mask_util_1.toImageDataLossy)(canvas);
        yield expectImage(imageMask, 'shared/three_people_blur_body_parts.png');
    }));
});
