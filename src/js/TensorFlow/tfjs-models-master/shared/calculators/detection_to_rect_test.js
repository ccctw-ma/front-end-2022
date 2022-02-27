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
const detection_to_rect_1 = require("./detection_to_rect");
function detectionWithLocationData(xMin, yMin, width, height) {
    const detection = {
        locationData: {
            boundingBox: { xMin, yMin, width, height, xMax: xMin + width, yMax: yMin + height }
        }
    };
    return detection;
}
function detectionWithKeyPoints(keypoints) {
    const detection = {
        locationData: {
            relativeKeypoints: keypoints.map(keypoint => ({ x: keypoint[0], y: keypoint[1] }))
        }
    };
    return detection;
}
function detectionWithRelativeLocationData(xMin, yMin, width, height) {
    const detection = {
        locationData: {
            relativeBoundingBox: { xMin, yMin, width, height, xMax: xMin + width, yMax: yMin + height }
        }
    };
    return detection;
}
function expectRectEq(rect, xCenter, yCenter, width, height) {
    expect(rect.xCenter).toBe(xCenter);
    expect(rect.yCenter).toBe(yCenter);
    expect(rect.width).toBe(width);
    expect(rect.height).toBe(height);
}
describe('DetectionsToRects', () => {
    it('detection to rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        const rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithLocationData(100, 200, 300, 400), 'boundingbox', 'rect');
        expectRectEq(rects, 250, 400, 300, 400);
    }));
    it('detection keypoints to rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        let rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0, 0], [1, 1]]), 'keypoints', 'rect', { width: 640, height: 480 });
        expectRectEq(rects, 320, 240, 640, 480);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0.25, 0.25], [0.75, 0.75]]), 'keypoints', 'rect', { width: 640, height: 480 });
        expectRectEq(rects, 320, 240, 320, 240);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0, 0], [0.5, 0.5]]), 'keypoints', 'rect', { width: 640, height: 480 });
        expectRectEq(rects, 160, 120, 320, 240);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0.5, 0.5], [1, 1]]), 'keypoints', 'rect', { width: 640, height: 480 });
        expectRectEq(rects, 480, 360, 320, 240);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0.25, 0.25], [0.75, 0.75]]), 'keypoints', 'rect', { width: 0, height: 0 });
        expectRectEq(rects, 0, 0, 0, 0);
    }));
    it('detection to normalized rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        const rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithRelativeLocationData(0.1, 0.2, 0.3, 0.4), 'boundingbox', 'normRect');
        expectRectEq(rects, 0.25, 0.4, 0.3, 0.4);
    }));
    it('detection keypoints to normalized rect.', () => __awaiter(void 0, void 0, void 0, function* () {
        let rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0, 0], [0.5, 0.5], [1, 1]]), 'keypoints', 'normRect');
        expectRectEq(rects, 0.5, 0.5, 1, 1);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0.25, 0.25], [0.75, 0.25], [0.75, 0.75]]), 'keypoints', 'normRect');
        expectRectEq(rects, 0.5, 0.5, 0.5, 0.5);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0, 0], [0.5, 0.5]]), 'keypoints', 'normRect');
        expectRectEq(rects, 0.25, 0.25, 0.5, 0.5);
        rects = (0, detection_to_rect_1.calculateDetectionsToRects)(detectionWithKeyPoints([[0.5, 0.5], [1, 1]]), 'keypoints', 'normRect');
        expectRectEq(rects, 0.75, 0.75, 0.5, 0.5);
    }));
});
