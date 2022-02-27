"use strict";
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResNet = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const base_model_1 = require("./base_model");
const imageNetMean = [-123.15, -115.90, -103.06];
class ResNet extends base_model_1.BaseModel {
    preprocessInput(input) {
        return tf.add(input, imageNetMean);
    }
    nameOutputResults(results) {
        const [displacementBwd, displacementFwd, heatmap, longOffsets, offsets, partHeatmaps, segmentation, partOffsets,] = results;
        return {
            offsets,
            segmentation,
            partHeatmaps,
            longOffsets,
            heatmap,
            displacementFwd,
            displacementBwd,
            partOffsets
        };
    }
}
exports.ResNet = ResNet;
