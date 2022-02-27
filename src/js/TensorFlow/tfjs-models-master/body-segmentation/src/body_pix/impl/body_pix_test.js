"use strict";
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const bodyPixModel = __importStar(require("./body_pix_model"));
const resnet = __importStar(require("./resnet"));
const util = __importStar(require("./util"));
(0, jasmine_util_1.describeWithFlags)('BodyPix', jasmine_util_1.ALL_ENVS, () => {
    let bodyPix;
    const inputResolution = 513;
    const outputStride = 32;
    const quantBytes = 4;
    const numKeypoints = 17;
    const numParts = 24;
    const outputResolution = (inputResolution - 1) / outputStride + 1;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const resNetConfig = { architecture: 'ResNet50', outputStride, inputResolution, quantBytes };
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
                        displacementBwd: tf.zeros([outputResolution, outputResolution, 2 * (numKeypoints - 1)]),
                        segmentation: tf.zeros([outputResolution, outputResolution, 1]),
                        partHeatmaps: tf.zeros([outputResolution, outputResolution, numParts]),
                        longOffsets: tf.zeros([outputResolution, outputResolution, 2 * numKeypoints]),
                        partOffsets: tf.zeros([outputResolution, outputResolution, 2 * numParts])
                    };
                },
                dipose: () => { }
                // tslint:disable-next-line:no-any
            };
        });
        bodyPix = yield bodyPixModel.load(resNetConfig);
    }));
    it('segmentPerson does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield bodyPix.segmentPerson(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('segmentMultiPerson does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield bodyPix.segmentMultiPerson(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('segmentPersonParts does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield bodyPix.segmentPersonParts(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('segmentMultiPersonParts does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield bodyPix.segmentMultiPersonParts(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it(`segmentPerson uses default values when null is ` +
        `passed in inferenceConfig parameters`, () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        spyOn(util, 'toInputResolutionHeightAndWidth').and.callThrough();
        yield bodyPix.segmentPerson(input, {});
        expect(util.toInputResolutionHeightAndWidth)
            .toHaveBeenCalledWith('medium', 32, [73, 73]);
    }));
    it(`segmentMultiPerson uses default values when null is ` +
        `passed in inferenceConfig parameters`, () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        spyOn(util, 'toInputResolutionHeightAndWidth').and.callThrough();
        yield bodyPix.segmentMultiPerson(input, {});
        expect(util.toInputResolutionHeightAndWidth)
            .toHaveBeenCalledWith('medium', 32, [73, 73]);
    }));
    it(`segmentPersonParts uses default values when null is ` +
        `passed in inferenceConfig parameters`, () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        spyOn(util, 'toInputResolutionHeightAndWidth').and.callThrough();
        yield bodyPix.segmentPersonParts(input, {});
        expect(util.toInputResolutionHeightAndWidth)
            .toHaveBeenCalledWith('medium', 32, [73, 73]);
    }));
    it(`segmentMultiPersonParts uses default values when null is ` +
        `passed in inferenceConfig parameters`, () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([73, 73, 3]);
        spyOn(util, 'toInputResolutionHeightAndWidth').and.callThrough();
        yield bodyPix.segmentMultiPersonParts(input, {});
        expect(util.toInputResolutionHeightAndWidth)
            .toHaveBeenCalledWith('medium', 32, [73, 73]);
    }));
});
