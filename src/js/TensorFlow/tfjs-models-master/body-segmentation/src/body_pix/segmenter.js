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
exports.load = void 0;
const mask_util_1 = require("../shared/calculators/mask_util");
const bodyPix = __importStar(require("./impl"));
class BodyPixMask {
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
function singleMaskValueToLabel(maskValue) {
    (0, mask_util_1.assertMaskValue)(maskValue);
    if (maskValue !== 255) {
        throw new Error(`Foreground id must be 255 but got ${maskValue}`);
    }
    return 'person';
}
function multiMaskValueToLabel(maskValue) {
    (0, mask_util_1.assertMaskValue)(maskValue);
    if (maskValue >= bodyPix.PART_CHANNELS.length) {
        throw new Error(`Invalid body part value ${maskValue}`);
    }
    return bodyPix.PART_CHANNELS[maskValue];
}
/**
 * MediaPipe segmenter class.
 */
class BodyPixSegmenter {
    // Should not be called outside.
    constructor(model) {
        this.bodyPixModel = model;
    }
    /**
     * Segment people found in an image or video frame.
     *
     * It returns a single segmentation which contains all the detected people
     * in the input.
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config Optional.
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     * @return An array of one `Segmentation`.
     */
    segmentPeople(input, segmentationConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input instanceof ImageBitmap) {
                const canvas = document.createElement('canvas');
                canvas.getContext('2d').drawImage(input, 0, 0);
                input = canvas;
            }
            let segmentations;
            if (segmentationConfig.segmentBodyParts) {
                const partSegmentations = segmentationConfig.multiSegmentation ?
                    yield this.bodyPixModel.segmentMultiPersonParts(input, segmentationConfig) :
                    [yield this.bodyPixModel.segmentPersonParts(input, segmentationConfig)];
                segmentations = partSegmentations.map(partSegmentation => {
                    const { data, width, height } = partSegmentation;
                    const rgbaData = new Uint8ClampedArray(width * height * 4).fill(0);
                    data.forEach((bodyPartLabel, i) => {
                        // Background.
                        if (bodyPartLabel === -1) {
                            rgbaData[i * 4] = bodyPix.PART_CHANNELS.length;
                            rgbaData[i * 4 + 3] = 0;
                        }
                        else {
                            rgbaData[i * 4] = bodyPartLabel;
                            rgbaData[i * 4 + 3] = 255;
                        }
                    });
                    return {
                        maskValueToLabel: multiMaskValueToLabel,
                        mask: new BodyPixMask(new ImageData(rgbaData, width, height)),
                    };
                });
            }
            else {
                const singleSegmentations = segmentationConfig.multiSegmentation ?
                    yield this.bodyPixModel.segmentMultiPerson(input, segmentationConfig) :
                    [yield this.bodyPixModel.segmentPerson(input, segmentationConfig)];
                segmentations = singleSegmentations.map(singleSegmentation => {
                    const { data, width, height } = singleSegmentation;
                    const rgbaData = new Uint8ClampedArray(width * height * 4).fill(0);
                    data.forEach((bodyPartLabel, i) => {
                        // Background.
                        if (bodyPartLabel === 0) {
                            rgbaData[i * 4] = 0;
                            rgbaData[i * 4 + 3] = 0;
                        }
                        else {
                            rgbaData[i * 4] = 255;
                            rgbaData[i * 4 + 3] = 255;
                        }
                    });
                    return {
                        maskValueToLabel: singleMaskValueToLabel,
                        mask: new BodyPixMask(new ImageData(rgbaData, width, height)),
                    };
                });
            }
            return segmentations;
        });
    }
    dispose() {
        this.bodyPixModel.dispose();
    }
    reset() { }
}
/**
 * Loads the BodyPix solution.
 *
 * @param modelConfig An object that contains parameters for
 * the BodyPix loading process. Please find more details of
 * each parameters in the documentation of the
 * `BodyPixModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        return bodyPix.load(modelConfig).then(model => new BodyPixSegmenter(model));
    });
}
exports.load = load;
