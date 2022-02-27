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
exports.expectFaceMesh = exports.MEDIAPIPE_MODEL_CONFIG = void 0;
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const constants_1 = require("../constants");
const faceDetection = __importStar(require("../index"));
const test_util_2 = require("../shared/test_util");
exports.MEDIAPIPE_MODEL_CONFIG = {
    runtime: 'mediapipe',
    solutionPath: 'base/node_modules/@mediapipe/face_mesh'
};
// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/python/solutions/face_mesh_test.py
// Measured in pixels.
const EPSILON_IMAGE = 5;
const EYE_INDICES_TO_LANDMARKS = [
    [33, [345, 178]],
    [7, [348, 179]],
    [163, [352, 178]],
    [144, [357, 179]],
    [145, [365, 179]],
    [153, [371, 179]],
    [154, [378, 178]],
    [155, [381, 177]],
    [133, [383, 177]],
    [246, [347, 175]],
    [161, [350, 174]],
    [160, [355, 172]],
    [159, [362, 170]],
    [158, [368, 171]],
    [157, [375, 172]],
    [173, [380, 175]],
    [263, [467, 176]],
    [249, [464, 177]],
    [390, [460, 177]],
    [373, [455, 178]],
    [374, [448, 179]],
    [380, [441, 179]],
    [381, [435, 178]],
    [382, [432, 177]],
    [362, [430, 177]],
    [466, [465, 175]],
    [388, [462, 173]],
    [387, [457, 171]],
    [386, [450, 170]],
    [385, [444, 171]],
    [384, [437, 172]],
    [398, [432, 175]] //
];
const IRIS_INDICES_TO_LANDMARKS = [
    [468, [362, 175]],
    [469, [371, 175]],
    [470, [362, 167]],
    [471, [354, 175]],
    [472, [363, 182]],
    [473, [449, 174]],
    [474, [458, 174]],
    [475, [449, 167]],
    [476, [440, 174]],
    [477, [449, 181]] //
];
const EXPECTED_BOX = {
    xMin: 305,
    xMax: 504,
    yMin: 103,
    yMax: 347,
    width: 199,
    height: 244
};
function expectFaceMesh(detector, image, staticImageMode, predictIrises, numFrames, epsilon) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < numFrames; ++i) {
            const result = yield detector.estimateFaces(image, { staticImageMode });
            expect(result.length).toBe(1);
            const box = result[0].box;
            (0, test_util_1.expectNumbersClose)(box.xMin, EXPECTED_BOX.xMin, EPSILON_IMAGE);
            (0, test_util_1.expectNumbersClose)(box.xMax, EXPECTED_BOX.xMax, EPSILON_IMAGE);
            (0, test_util_1.expectNumbersClose)(box.yMin, EXPECTED_BOX.yMin, EPSILON_IMAGE);
            (0, test_util_1.expectNumbersClose)(box.yMax, EXPECTED_BOX.yMax, EPSILON_IMAGE);
            (0, test_util_1.expectNumbersClose)(box.width, EXPECTED_BOX.width, EPSILON_IMAGE);
            (0, test_util_1.expectNumbersClose)(box.height, EXPECTED_BOX.height, EPSILON_IMAGE);
            const keypoints = result[0].keypoints.map(keypoint => [keypoint.x, keypoint.y]);
            expect(keypoints.length)
                .toBe(predictIrises ? constants_1.MEDIAPIPE_FACEMESH_NUM_KEYPOINTS_WITH_IRISES :
                constants_1.MEDIAPIPE_FACEMESH_NUM_KEYPOINTS);
            for (const [eyeIdx, gtLds] of EYE_INDICES_TO_LANDMARKS) {
                (0, test_util_1.expectArraysClose)(keypoints[eyeIdx], gtLds, epsilon);
            }
            if (predictIrises) {
                for (const [irisIdx, gtLds] of IRIS_INDICES_TO_LANDMARKS) {
                    (0, test_util_1.expectArraysClose)(keypoints[irisIdx], gtLds, epsilon);
                }
            }
        }
    });
}
exports.expectFaceMesh = expectFaceMesh;
(0, jasmine_util_1.describeWithFlags)('MediaPipe FaceMesh ', jasmine_util_1.BROWSER_ENVS, () => {
    let image;
    let timeout;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
        image = yield (0, test_util_2.loadImage)('portrait.jpg', 820, 1024);
    }));
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    function expectMediaPipeFaceMesh(image, staticImageMode, predictIrises, numFrames) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: this makes a network request for model assets.
            const model = faceDetection.SupportedModels.MediaPipeFaceMesh;
            const detector = yield faceDetection.createDetector(model, Object.assign(Object.assign({}, exports.MEDIAPIPE_MODEL_CONFIG), { predictIrises }));
            yield expectFaceMesh(detector, image, staticImageMode, predictIrises, numFrames, EPSILON_IMAGE);
        });
    }
    it('static image mode no attention.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectMediaPipeFaceMesh(image, true, false, 5);
    }));
    it('static image mode with attention.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectMediaPipeFaceMesh(image, true, true, 5);
    }));
    it('streaming mode no attention.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectMediaPipeFaceMesh(image, false, false, 10);
    }));
    it('streaming mode with attention.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectMediaPipeFaceMesh(image, false, true, 10);
    }));
});
