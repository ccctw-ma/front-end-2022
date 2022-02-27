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
exports.nonMaxSuppression = void 0;
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
function nonMaxSuppression(detections, maxDetections, iouThreshold, 
// Currently only IOU overap is supported.
overlapType) {
    return __awaiter(this, void 0, void 0, function* () {
        // Sort to match NonMaxSuppresion calculator's decreasing detection score
        // traversal.
        // NonMaxSuppresionCalculator: RetainMaxScoringLabelOnly
        detections.sort((detectionA, detectionB) => Math.max(...detectionB.score) - Math.max(...detectionA.score));
        const detectionsTensor = tf.tensor2d(detections.map(d => [d.locationData.relativeBoundingBox.yMin,
            d.locationData.relativeBoundingBox.xMin,
            d.locationData.relativeBoundingBox.yMax,
            d.locationData.relativeBoundingBox.xMax]));
        const scoresTensor = tf.tensor1d(detections.map(d => d.score[0]));
        const selectedIdsTensor = yield tf.image.nonMaxSuppressionAsync(detectionsTensor, scoresTensor, maxDetections, iouThreshold);
        const selectedIds = yield selectedIdsTensor.array();
        const selectedDetections = detections.filter((_, i) => (selectedIds.indexOf(i) > -1));
        tf.dispose([detectionsTensor, scoresTensor, selectedIdsTensor]);
        return selectedDetections;
    });
}
exports.nonMaxSuppression = nonMaxSuppression;
