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
const faceMesh = __importStar(require("@mediapipe/face_mesh"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const constants_1 = require("../constants");
const landmarks_to_detection_1 = require("../shared/calculators/landmarks_to_detection");
const detector_utils_1 = require("./detector_utils");
/**
 * MediaPipe detector class.
 */
class MediaPipeFaceMeshMediaPipeDetector {
    // Should not be called outside.
    constructor(config) {
        // This will be filled out by asynchronous calls to onResults. They will be
        // stable after `await send` is called on the faces solution.
        this.width = 0;
        this.height = 0;
        this.selfieMode = false;
        this.faceMeshSolution = new faceMesh.FaceMesh({
            locateFile: (path, base) => {
                if (config.solutionPath) {
                    const solutionPath = config.solutionPath.replace(/\/+$/, '');
                    return `${solutionPath}/${path}`;
                }
                return `${base}/${path}`;
            }
        });
        this.faceMeshSolution.setOptions({
            refineLandmarks: config.predictIrises,
            selfieMode: this.selfieMode,
            maxNumFaces: config.maxFaces,
        });
        this.faceMeshSolution.onResults((results) => {
            this.height = results.image.height;
            this.width = results.image.width;
            this.faces = [];
            if (results.multiFaceLandmarks !== null) {
                const landmarksList = results.multiFaceLandmarks;
                for (let i = 0; i < landmarksList.length; i++) {
                    const keypoints = this.translateOutput(landmarksList[i]);
                    this.faces.push({
                        keypoints,
                        box: (0, landmarks_to_detection_1.landmarksToDetection)(keypoints).locationData.relativeBoundingBox
                    });
                }
            }
        });
    }
    translateOutput(landmarks) {
        const keypoints = landmarks.map((landmark, i) => {
            const keypoint = {
                x: landmark.x * this.width,
                y: landmark.y * this.height,
            };
            const name = constants_1.MEDIAPIPE_KEYPOINTS.get(i);
            if (name != null) {
                keypoint.name = name;
            }
            return keypoint;
        });
        return keypoints;
    }
    /**
     * Estimates faces for an image or video frame.
     *
     * It returns a single face or multiple faces based on the maxFaceMesh
     * parameter passed to the constructor of the class.
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config Optional.
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     *       staticImageMode: Optional. Defaults to false. Currently unused in
     * this implementation. Image input types are assumed to be static images, and
     * video inputs are assumed to be non static images.
     *
     * @return An array of `Face`s.
     */
    estimateFaces(input, estimationConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (estimationConfig && estimationConfig.flipHorizontal &&
                (estimationConfig.flipHorizontal !== this.selfieMode)) {
                this.selfieMode = estimationConfig.flipHorizontal;
                this.faceMeshSolution.setOptions({
                    selfieMode: this.selfieMode,
                });
            }
            // Cast to GL TexImageSource types.
            input = input instanceof tf.Tensor ?
                new ImageData(yield tf.browser.toPixels(input), input.shape[1], input.shape[0]) :
                input;
            yield this.faceMeshSolution.send({ image: input });
            return this.faces;
        });
    }
    dispose() {
        this.faceMeshSolution.close();
    }
    reset() {
        this.faceMeshSolution.reset();
        this.width = 0;
        this.height = 0;
        this.faces = null;
        this.selfieMode = false;
    }
    initialize() {
        return this.faceMeshSolution.initialize();
    }
}
/**
 * Loads the MediaPipe solution.
 *
 * @param modelConfig An object that contains parameters for
 * the MediaPipeFaceMesh loading process. Please find more details of each
 * parameters in the documentation of the
 * `MediaPipeFaceMeshMediaPipeModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, detector_utils_1.validateModelConfig)(modelConfig);
        const detector = new MediaPipeFaceMeshMediaPipeDetector(config);
        yield detector.initialize();
        return detector;
    });
}
exports.load = load;
