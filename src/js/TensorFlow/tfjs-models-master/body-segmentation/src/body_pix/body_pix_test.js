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
const bodySegmentation = __importStar(require("../index"));
const mask_util_1 = require("../shared/calculators/mask_util");
const renderUtil = __importStar(require("../shared/calculators/render_util"));
const test_util_1 = require("../shared/test_util");
// Measured in channels.
const DIFF_IMAGE = 30;
class CanvasImageSourceMask {
    constructor(mask) {
        this.mask = mask;
    }
    toCanvasImageSource() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mask;
        });
    }
    toImageData() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toImageDataLossy)(this.mask);
        });
    }
    toTensor() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mask_util_1.toTensorLossy)(this.mask);
        });
    }
    getUnderlyingType() {
        return 'canvasimagesource';
    }
}
function getSegmentation(image, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const segmenter = yield bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.BodyPix);
        const segmentations = yield segmenter.segmentPeople(image, config);
        return Promise.all(segmentations.map((segmentation) => __awaiter(this, void 0, void 0, function* () {
            return {
                maskValueToLabel: segmentation.maskValueToLabel,
                // Convert to canvas image source to apply alpha-premultiplication.
                mask: new CanvasImageSourceMask(yield segmentation.mask.toCanvasImageSource())
            };
        })));
    });
}
function getBinaryMask(image, expectedNumSegmentations) {
    return __awaiter(this, void 0, void 0, function* () {
        const segmentation = yield getSegmentation(image, {
            multiSegmentation: expectedNumSegmentations != null,
            segmentBodyParts: false
        });
        if (expectedNumSegmentations != null) {
            expect(segmentation.length).toBe(expectedNumSegmentations);
        }
        const binaryMask = yield renderUtil.toBinaryMask(segmentation, { r: 255, g: 255, b: 255, a: 255 }, { r: 0, g: 0, b: 0, a: 255 });
        return binaryMask;
    });
}
function getColoredMask(image, expectedNumSegmentations) {
    return __awaiter(this, void 0, void 0, function* () {
        const segmentation = yield getSegmentation(image, {
            multiSegmentation: expectedNumSegmentations != null,
            segmentBodyParts: true
        });
        if (expectedNumSegmentations != null) {
            expect(segmentation.length).toBe(expectedNumSegmentations);
        }
        const coloredMask = yield renderUtil.toColoredMask(segmentation, bodySegmentation.bodyPixMaskValueToRainbowColor, { r: 255, g: 255, b: 255, a: 255 });
        return coloredMask;
    });
}
const WIDTH = 1049;
const HEIGHT = 861;
function expectImage(actual, imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const expectedImage = yield (0, test_util_1.loadImage)(imageName, WIDTH, HEIGHT)
            .then((image) => __awaiter(this, void 0, void 0, function* () { return (0, mask_util_1.toImageDataLossy)(image); }));
        const mismatchedChannels = actual.data.reduce((mismatched, channel, i) => mismatched + +(channel !== expectedImage.data[i]), 0);
        expect(mismatchedChannels).toBeLessThanOrEqual(DIFF_IMAGE);
    });
}
(0, jasmine_util_1.describeWithFlags)('renderUtil', jasmine_util_1.BROWSER_ENVS, () => {
    let image;
    let timeout;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        image = yield (0, test_util_1.loadImage)('shared/three_people.jpg', WIDTH, HEIGHT);
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('Single Segmentation + No body parts.', () => __awaiter(void 0, void 0, void 0, function* () {
        const binaryMask = yield getBinaryMask(image);
        yield expectImage(binaryMask, 'shared/three_people_binary_mask.png');
    }));
    it('Multi Segmentation + No body parts.', () => __awaiter(void 0, void 0, void 0, function* () {
        const binaryMask = yield getBinaryMask(image, 3);
        yield expectImage(binaryMask, 'shared/three_people_binary_mask.png');
    }));
    it('Single Segmentation + Body parts.', () => __awaiter(void 0, void 0, void 0, function* () {
        const coloredMask = yield getColoredMask(image);
        yield expectImage(coloredMask, 'shared/three_people_colored_mask.png');
    }));
    it('Multi Segmentation + Body parts.', () => __awaiter(void 0, void 0, void 0, function* () {
        const coloredMask = yield getColoredMask(image, 3);
        yield expectImage(coloredMask, 'shared/three_people_colored_mask.png');
    }));
});
