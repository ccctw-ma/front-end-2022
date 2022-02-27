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
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const poseDetection = __importStar(require("../index"));
(0, jasmine_util_1.describeWithFlags)('PoseNet', jasmine_util_1.ALL_ENVS, () => {
    let detector;
    let timeout;
    beforeAll(() => {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        // This test suite makes real network request for model assets, increase
        // the default timeout to allow enough time to load and reduce flakiness.
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000; // 5mins
    });
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        detector = yield poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, {
            quantBytes: 4,
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 514, height: 513 },
            multiplier: 1
        });
    }));
    it('estimatePoses does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([128, 128, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield detector.estimatePoses(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('estimatePoses with multiple poses does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([128, 128, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield detector.estimatePoses(input, { maxPoses: 2 });
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
});
