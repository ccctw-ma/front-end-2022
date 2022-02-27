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
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const remove_landmark_letterbox_1 = require("./remove_landmark_letterbox");
const EPS = 1e-5;
describe('LandmarkLetterboxRemovalCalculator', () => {
    const keypoints = [{ x: 0.5, y: 0.5 }, { x: 0.2, y: 0.2 }, { x: 0.7, y: 0.7 }];
    it('padding left right.', () => __awaiter(void 0, void 0, void 0, function* () {
        const padding = { left: 0.2, top: 0, right: 0.3, bottom: 0 };
        const outputKeypoints = (0, remove_landmark_letterbox_1.removeLandmarkLetterbox)(keypoints, padding);
        expect(outputKeypoints.length).toBe(3);
        (0, test_util_1.expectArraysClose)(outputKeypoints.map(keypoint => [keypoint.x, keypoint.y]), [[0.6, 0.5], [0.0, 0.2], [1, 0.7]], EPS);
    }));
    it('padding top bottom.', () => __awaiter(void 0, void 0, void 0, function* () {
        const padding = { left: 0, top: 0.2, right: 0, bottom: 0.3 };
        const outputKeypoints = (0, remove_landmark_letterbox_1.removeLandmarkLetterbox)(keypoints, padding);
        expect(outputKeypoints.length).toBe(3);
        (0, test_util_1.expectArraysClose)(outputKeypoints.map(keypoint => [keypoint.x, keypoint.y]), [[0.5, 0.6], [0.2, 0], [0.7, 1]], EPS);
    }));
});
