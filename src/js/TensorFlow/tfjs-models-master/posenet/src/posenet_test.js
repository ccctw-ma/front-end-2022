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
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const mobilenet = __importStar(require("./mobilenet"));
const posenetModel = __importStar(require("./posenet_model"));
const resnet = __importStar(require("./resnet"));
const util_1 = require("./util");
(0, jasmine_util_1.describeWithFlags)('PoseNet', jasmine_util_1.NODE_ENVS, () => {
    let mobileNet;
    let resNet;
    const inputResolution = 513;
    const outputStride = 32;
    const multiplier = 1.0;
    const quantBytes = 4;
    const outputResolution = (inputResolution - 1) / outputStride + 1;
    const numKeypoints = 17;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Mock out the actual load so we don't make network requests in the unit
        // test.
        const resNetConfig = { architecture: 'ResNet50', outputStride, inputResolution, quantBytes };
        const mobileNetConfig = {
            architecture: 'MobileNetV1',
            outputStride,
            inputResolution,
            multiplier,
            quantBytes
        };
        spyOn(tfconv, 'loadGraphModel').and.callFake(() => {
            return null;
        });
        spyOn(resnet, 'ResNet').and.callFake(() => {
            return {
                outputStride,
                predict: (input) => {
                    return {
                        inputResolution,
                        heatmapScores: tf.zeros([outputResolution, outputResolution, numKeypoints]),
                        offsets: tf.zeros([outputResolution, outputResolution, 2 * numKeypoints]),
                        displacementFwd: tf.zeros([outputResolution, outputResolution, 2 * (numKeypoints - 1)]),
                        displacementBwd: tf.zeros([outputResolution, outputResolution, 2 * (numKeypoints - 1)])
                    };
                },
                dipose: () => { }
            };
        });
        spyOn(mobilenet, 'MobileNet').and.callFake(() => {
            return {
                outputStride,
                predict: (input) => {
                    return {
                        inputResolution,
                        heatmapScores: tf.zeros([outputResolution, outputResolution, numKeypoints]),
                        offsets: tf.zeros([outputResolution, outputResolution, 2 * numKeypoints]),
                        displacementFwd: tf.zeros([outputResolution, outputResolution, 2 * (numKeypoints - 1)]),
                        displacementBwd: tf.zeros([outputResolution, outputResolution, 2 * (numKeypoints - 1)])
                    };
                },
                dipose: () => { }
            };
        });
        resNet = yield posenetModel.load(resNetConfig);
        mobileNet = yield posenetModel.load(mobileNetConfig);
    }));
    it('estimateSinglePose does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([inputResolution, inputResolution, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield resNet.estimateSinglePose(input, { flipHorizontal: false });
        yield mobileNet.estimateSinglePose(input, { flipHorizontal: false });
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('estimateMultiplePoses does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([inputResolution, inputResolution, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield resNet.estimateMultiplePoses(input, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.5,
            nmsRadius: 20
        });
        yield mobileNet.estimateMultiplePoses(input, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.5,
            nmsRadius: 20
        });
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('mobilenet load with resolution numbers passes through ', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputResolution = 500;
        const validInputResolution = (0, util_1.toValidInputResolution)(inputResolution, outputStride);
        const expectedResolution = [validInputResolution, validInputResolution];
        const model = yield posenetModel.load({ architecture: 'MobileNetV1', outputStride, inputResolution });
        expect(model.inputResolution).toEqual(expectedResolution);
    }));
    it('resnet load with resolution numbers passes through', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputResolution = 350;
        const validInputResolution = (0, util_1.toValidInputResolution)(inputResolution, outputStride);
        const expectedResolution = [validInputResolution, validInputResolution];
        const model = yield posenetModel.load({ architecture: 'ResNet50', outputStride, inputResolution });
        expect(model.inputResolution).toEqual(expectedResolution);
    }));
    it('mobilenet load with resolution object passes through', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputResolution = { width: 600, height: 400 };
        const expectedResolution = [
            (0, util_1.toValidInputResolution)(inputResolution.height, outputStride),
            (0, util_1.toValidInputResolution)(inputResolution.width, outputStride)
        ];
        const model = yield posenetModel.load({ architecture: 'MobileNetV1', outputStride, inputResolution });
        expect(model.inputResolution).toEqual(expectedResolution);
    }));
    it('resnet load with resolution object passes through', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputResolution = { width: 700, height: 500 };
        const expectedResolution = [
            (0, util_1.toValidInputResolution)(inputResolution.height, outputStride),
            (0, util_1.toValidInputResolution)(inputResolution.width, outputStride)
        ];
        const model = yield posenetModel.load({ architecture: 'ResNet50', outputStride, inputResolution });
        expect(model.inputResolution).toEqual(expectedResolution);
    }));
});
