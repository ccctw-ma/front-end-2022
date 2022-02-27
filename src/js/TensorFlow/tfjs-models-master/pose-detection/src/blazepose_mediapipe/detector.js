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
const pose = __importStar(require("@mediapipe/pose"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const constants_1 = require("../constants");
const mask_util_1 = require("../shared/calculators/mask_util");
const detector_utils_1 = require("./detector_utils");
class BlazePoseMediaPipeMask {
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
function maskValueToLabel(maskValue) {
    (0, mask_util_1.assertMaskValue)(maskValue);
    return 'person';
}
/**
 * MediaPipe detector class.
 */
class BlazePoseMediaPipeDetector {
    // Should not be called outside.
    constructor(config) {
        // This will be filled out by asynchronous calls to onResults. They will be
        // stable after `await send` is called on the pose solution.
        this.width = 0;
        this.height = 0;
        this.selfieMode = false;
        this.poseSolution = new pose.Pose({
            locateFile: (path, base) => {
                if (config.solutionPath) {
                    const solutionPath = config.solutionPath.replace(/\/+$/, '');
                    return `${solutionPath}/${path}`;
                }
                return `${base}/${path}`;
            }
        });
        let modelComplexity;
        switch (config.modelType) {
            case 'lite':
                modelComplexity = 0;
                break;
            case 'heavy':
                modelComplexity = 2;
                break;
            case 'full':
            default:
                modelComplexity = 1;
                break;
        }
        this.poseSolution.setOptions({
            modelComplexity,
            smoothLandmarks: config.enableSmoothing,
            enableSegmentation: config.enableSegmentation,
            smoothSegmentation: config.smoothSegmentation,
            selfieMode: this.selfieMode,
        });
        this.poseSolution.onResults((results) => {
            this.height = results.image.height;
            this.width = results.image.width;
            if (results.poseLandmarks == null) {
                this.poses = [];
            }
            else {
                const pose = this.translateOutput(results.poseLandmarks, results.poseWorldLandmarks);
                if (results.segmentationMask) {
                    pose.segmentation = {
                        maskValueToLabel,
                        mask: new BlazePoseMediaPipeMask(results.segmentationMask)
                    };
                }
                this.poses = [pose];
            }
        });
    }
    translateOutput(pose, pose3D) {
        const output = {
            keypoints: pose.map((landmark, i) => ({
                x: landmark.x * this.width,
                y: landmark.y * this.height,
                z: landmark.z,
                score: landmark.visibility,
                name: constants_1.BLAZEPOSE_KEYPOINTS[i]
            }))
        };
        if (pose3D != null) {
            output.keypoints3D = pose3D.map((landmark, i) => ({
                x: landmark.x,
                y: landmark.y,
                z: landmark.z,
                score: landmark.visibility,
                name: constants_1.BLAZEPOSE_KEYPOINTS[i]
            }));
        }
        return output;
    }
    /**
     * Estimates poses for an image or video frame.
     *
     * It returns a single pose or multiple poses based on the maxPose parameter
     * from the `config`.
     *
     * @param image
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config Optional.
     *       maxPoses: Optional. Max number of poses to estimate.
     *       When maxPoses = 1, a single pose is detected, it is usually much
     *       more efficient than maxPoses > 1. When maxPoses > 1, multiple poses
     *       are detected.
     *
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     *       enableSmoothing: Optional. Default to true. Smooth pose landmarks
     *       coordinates and visibility scores to reduce jitter.
     *
     * @param timestamp Optional. In milliseconds. This is useful when image is
     *     a tensor, which doesn't have timestamp info. Or to override timestamp
     *     in a video.
     *
     * @return An array of `Pose`s.
     */
    estimatePoses(image, estimationConfig, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (estimationConfig && estimationConfig.flipHorizontal &&
                (estimationConfig.flipHorizontal !== this.selfieMode)) {
                this.selfieMode = estimationConfig.flipHorizontal;
                this.poseSolution.setOptions({
                    selfieMode: this.selfieMode,
                });
            }
            // Cast to GL TexImageSource types.
            image = image instanceof tf.Tensor ?
                new ImageData(yield tf.browser.toPixels(image), image.shape[1], image.shape[0]) :
                image;
            yield this.poseSolution.send({ image: image }, timestamp);
            return this.poses;
        });
    }
    dispose() {
        this.poseSolution.close();
    }
    reset() {
        this.poseSolution.reset();
    }
    initialize() {
        return this.poseSolution.initialize();
    }
}
/**
 * Loads the MediaPipe solution.
 *
 * @param modelConfig ModelConfig object that contains parameters for
 * the BlazePose loading process. Please find more details of each parameters
 * in the documentation of the `BlazePoseMediaPipeModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, detector_utils_1.validateModelConfig)(modelConfig);
        const result = new BlazePoseMediaPipeDetector(config);
        yield result.initialize();
        return result;
    });
}
exports.load = load;
