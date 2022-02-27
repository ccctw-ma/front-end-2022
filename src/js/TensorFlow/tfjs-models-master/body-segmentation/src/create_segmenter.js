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
exports.createSegmenter = void 0;
const segmenter_1 = require("./body_pix/segmenter");
const segmenter_2 = require("./selfie_segmentation_mediapipe/segmenter");
const segmenter_3 = require("./selfie_segmentation_tfjs/segmenter");
const types_1 = require("./types");
/**
 * Create a body segmenter instance.
 *
 * @param model The name of the pipeline to load.
 * @param modelConfig The configuration for the pipeline to load.
 */
function createSegmenter(model, modelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (model) {
            case types_1.SupportedModels.MediaPipeSelfieSegmentation: {
                const config = modelConfig;
                let runtime;
                if (config != null) {
                    if (config.runtime === 'tfjs') {
                        return (0, segmenter_3.load)(config);
                    }
                    if (config.runtime === 'mediapipe') {
                        return (0, segmenter_2.load)(config);
                    }
                    runtime = config.runtime;
                }
                throw new Error(`Expect modelConfig.runtime to be either 'tfjs' ` +
                    `or 'mediapipe', but got ${runtime}`);
            }
            case types_1.SupportedModels.BodyPix: {
                const config = modelConfig;
                return (0, segmenter_1.load)(config);
            }
            default:
                throw new Error(`${model} is not a supported model name.`);
        }
    });
}
exports.createSegmenter = createSegmenter;
