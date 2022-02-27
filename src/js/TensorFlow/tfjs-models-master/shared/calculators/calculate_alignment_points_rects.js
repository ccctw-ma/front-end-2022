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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAlignmentPointsRects = void 0;
const detection_to_rect_1 = require("./detection_to_rect");
// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/alignment_points_to_rects_calculator.cc
function calculateAlignmentPointsRects(detection, imageSize, config) {
    const startKeypoint = config.rotationVectorStartKeypointIndex;
    const endKeypoint = config.rotationVectorEndKeypointIndex;
    const locationData = detection.locationData;
    const xCenter = locationData.relativeKeypoints[startKeypoint].x * imageSize.width;
    const yCenter = locationData.relativeKeypoints[startKeypoint].y * imageSize.height;
    const xScale = locationData.relativeKeypoints[endKeypoint].x * imageSize.width;
    const yScale = locationData.relativeKeypoints[endKeypoint].y * imageSize.height;
    // Bounding box size as double distance from center to scale point.
    const boxSize = Math.sqrt((xScale - xCenter) * (xScale - xCenter) +
        (yScale - yCenter) * (yScale - yCenter)) *
        2;
    const rotation = (0, detection_to_rect_1.computeRotation)(detection, imageSize, config);
    // Set resulting bounding box.
    return {
        xCenter: xCenter / imageSize.width,
        yCenter: yCenter / imageSize.height,
        width: boxSize / imageSize.width,
        height: boxSize / imageSize.height,
        rotation
    };
}
exports.calculateAlignmentPointsRects = calculateAlignmentPointsRects;
