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
exports.validateEstimationConfig = exports.validateModelConfig = void 0;
const constants_1 = require("./constants");
function validateModelConfig(modelConfig) {
    const config = modelConfig == null ?
        Object.assign({}, constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG) : Object.assign({}, modelConfig);
    if (config.enableSmoothing == null) {
        config.enableSmoothing = constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing;
    }
    if (config.enableSegmentation == null) {
        config.enableSegmentation =
            constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSegmentation;
    }
    if (config.smoothSegmentation == null) {
        config.smoothSegmentation =
            constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.smoothSegmentation;
    }
    if (config.modelType == null) {
        config.modelType = constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType;
    }
    if (config.detectorModelUrl == null) {
        config.detectorModelUrl = constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.detectorModelUrl;
    }
    if (config.landmarkModelUrl == null) {
        switch (config.modelType) {
            case 'lite':
                config.landmarkModelUrl = constants_1.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE;
                break;
            case 'heavy':
                config.landmarkModelUrl = constants_1.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY;
                break;
            case 'full':
            default:
                config.landmarkModelUrl = constants_1.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL;
                break;
        }
    }
    return config;
}
exports.validateModelConfig = validateModelConfig;
function validateEstimationConfig(estimationConfig) {
    let config;
    if (estimationConfig == null) {
        config = constants_1.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG;
    }
    else {
        config = Object.assign({}, estimationConfig);
    }
    if (config.maxPoses == null) {
        config.maxPoses = 1;
    }
    if (config.maxPoses <= 0) {
        throw new Error(`Invalid maxPoses ${config.maxPoses}. Should be > 0.`);
    }
    if (config.maxPoses > 1) {
        throw new Error('Multi-pose detection is not implemented yet. Please set maxPoses ' +
            'to 1.');
    }
    return config;
}
exports.validateEstimationConfig = validateEstimationConfig;