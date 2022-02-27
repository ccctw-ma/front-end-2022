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
const handPoseDetection = __importStar(require("../index"));
const test_util_2 = require("../shared/test_util");
// Measured in pixels.
const EPSILON_IMAGE = 12;
// Measured in pixels.
const EPSILON_VIDEO = 18;
// Measured in meters.
const EPSILON_VIDEO_WORLD = 0.01;
// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/python/solutions/hands_test.py
const EXPECTED_HAND_KEYPOINTS_PREDICTION = [
    [
        [580, 34], [504, 50], [459, 94], [429, 146], [397, 182], [507, 167],
        [479, 245], [469, 292], [464, 330], [545, 180], [534, 265], [533, 319],
        [536, 360], [581, 172], [587, 252], [593, 304], [599, 346], [615, 168],
        [628, 223], [638, 258], [648, 288]
    ],
    [
        [138, 343], [211, 330], [257, 286], [289, 237], [322, 203], [219, 216],
        [238, 138], [249, 90], [253, 51], [177, 204], [184, 115], [187, 60],
        [185, 19], [138, 208], [131, 127], [124, 77], [117, 36], [106, 222],
        [92, 159], [79, 124], [68, 93]
    ]
];
(0, jasmine_util_1.describeWithFlags)('MediaPipeHands', jasmine_util_1.ALL_ENVS, () => {
    let timeout;
    beforeAll(() => {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
    });
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('estimateHands does not leak memory.', () => __awaiter(void 0, void 0, void 0, function* () {
        const startTensors = tf.memory().numTensors;
        // Note: this makes a network request for model assets.
        const detector = yield handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, { runtime: 'tfjs' });
        const input = tf.zeros([128, 128, 3]);
        const beforeTensors = tf.memory().numTensors;
        yield detector.estimateHands(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
        detector.dispose();
        input.dispose();
        expect(tf.memory().numTensors).toEqual(startTensors);
    }));
    it('throws error when runtime is not set.', (done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands);
            done.fail('Loading without runtime succeeded unexpectedly.');
        }
        catch (e) {
            expect(e.message).toEqual(`Expect modelConfig.runtime to be either ` +
                `'tfjs' or 'mediapipe', but got undefined`);
            done();
        }
    }));
});
(0, jasmine_util_1.describeWithFlags)('MediaPipeHands static image ', jasmine_util_1.BROWSER_ENVS, () => {
    let detector;
    let image;
    let timeout;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        image = yield (0, test_util_2.loadImage)('hands.jpg', 720, 382);
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('test lite model.', () => __awaiter(void 0, void 0, void 0, function* () {
        const startTensors = tf.memory().numTensors;
        // Note: this makes a network request for model assets.
        detector = yield handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, { runtime: 'tfjs', modelType: 'lite' });
        const beforeTensors = tf.memory().numTensors;
        const result = yield detector.estimateHands(image, {
            staticImageMode: true
        });
        const keypoints = result.map(hand => hand.keypoints.map(keypoint => [keypoint.x, keypoint.y]));
        (0, test_util_1.expectArraysClose)(keypoints, EXPECTED_HAND_KEYPOINTS_PREDICTION, EPSILON_IMAGE);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
        detector.dispose();
        expect(tf.memory().numTensors).toEqual(startTensors);
    }));
    it('test full model.', () => __awaiter(void 0, void 0, void 0, function* () {
        const startTensors = tf.memory().numTensors;
        // Note: this makes a network request for model assets.
        detector = yield handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, { runtime: 'tfjs', modelType: 'full' });
        const beforeTensors = tf.memory().numTensors;
        const result = yield detector.estimateHands(image, {
            staticImageMode: true
        });
        const keypoints = result.map(hand => hand.keypoints.map(keypoint => [keypoint.x, keypoint.y]));
        (0, test_util_1.expectArraysClose)(keypoints, EXPECTED_HAND_KEYPOINTS_PREDICTION, EPSILON_IMAGE);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
        detector.dispose();
        expect(tf.memory().numTensors).toEqual(startTensors);
    }));
});
(0, jasmine_util_1.describeWithFlags)('MediaPipe Hands video ', jasmine_util_1.BROWSER_ENVS, () => {
    let detector;
    let timeout;
    let expected;
    let expected3D;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        expected = yield fetch(`${test_util_2.KARMA_SERVER}/asl_hand.full.json`)
            .then(response => response.json())
            .then(result => (0, test_util_2.getXYPerFrame)(result));
        expected3D = yield fetch(`${test_util_2.KARMA_SERVER}/asl_hand_3d.full.json`)
            .then(response => response.json());
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('test.', () => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        detector = yield handPoseDetection.createDetector(model, { runtime: 'tfjs', maxHands: 1 });
        const result = [];
        const result3D = [];
        const callback = (video, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
            const hands = yield detector.estimateHands(video, null /* config */);
            // maxNumHands is set to 1.
            result.push(hands[0].keypoints.map(kp => [kp.x, kp.y]));
            result3D.push(hands[0].keypoints3D.map(kp => [kp.x, kp.y, kp.z]));
            return hands[0].keypoints;
        });
        yield (0, test_util_2.loadVideo)('asl_hand.25fps.mp4', 25 /* fps */, callback, expected, constants_1.MEDIAPIPE_CONNECTED_KEYPOINTS_PAIRS, 0 /* simulatedInterval unused */);
        (0, test_util_1.expectArraysClose)(result, expected, EPSILON_VIDEO);
        (0, test_util_1.expectArraysClose)(result3D, expected3D, EPSILON_VIDEO_WORLD);
        detector.dispose();
    }));
});
