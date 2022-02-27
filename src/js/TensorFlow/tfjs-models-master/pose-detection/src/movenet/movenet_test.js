"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const constants_1 = require("../constants");
const poseDetection = __importStar(require("../index"));
const test_util_2 = require("../shared/test_util");
const constants_2 = require("./constants");
const EPSILON_VIDEO = 60;
(0, jasmine_util_1.describeWithFlags)('MoveNet', jasmine_util_1.ALL_ENVS, () => {
    let detector;
    let timeout;
    beforeAll(() => {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000; // 5mins
    });
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        detector = yield poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, { modelType: constants_2.SINGLEPOSE_LIGHTNING });
    }));
    it('estimatePoses does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([128, 128, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield detector.estimatePoses(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
});
(0, jasmine_util_1.describeWithFlags)('MoveNet video ', jasmine_util_1.BROWSER_ENVS, () => {
    let detector;
    let timeout;
    let expected;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        expected = yield fetch(`${test_util_2.KARMA_SERVER}/pose_1.json`)
            .then(response => response.json())
            .then((result) => {
            return result.map(namedKeypoint => {
                return constants_1.COCO_KEYPOINTS.map(name => {
                    const keypoint = namedKeypoint[name];
                    return [keypoint.x, keypoint.y];
                });
            });
        });
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('test lightning.', () => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        const model = poseDetection.SupportedModels.MoveNet;
        detector = yield poseDetection.createDetector(model, { modelType: constants_2.SINGLEPOSE_LIGHTNING });
        const result = [];
        const callback = (video, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
            const poses = yield detector.estimatePoses(video, null /* config */, timestamp);
            result.push(poses[0].keypoints.map(kp => [kp.x, kp.y]));
            return poses[0].keypoints;
        });
        // We set the timestamp increment to 33333 microseconds to simulate
        // the 30 fps video input. We do this so that the filter uses the
        // same fps as the reference test.
        // https://github.com/google/mediapipe/blob/ecb5b5f44ab23ea620ef97a479407c699e424aa7/mediapipe/python/solution_base.py#L297
        const simulatedInterval = 33.3333;
        // Synthetic video at 30FPS.
        yield (0, test_util_2.loadVideo)('pose_1.mp4', 30 /* fps */, callback, expected, poseDetection.util.getAdjacentPairs(model), simulatedInterval);
        (0, test_util_1.expectArraysClose)(result, expected, EPSILON_VIDEO);
        detector.dispose();
    }));
});
