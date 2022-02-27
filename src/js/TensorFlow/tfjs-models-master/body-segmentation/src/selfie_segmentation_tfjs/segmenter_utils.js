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
exports.validateSegmentationConfig = exports.validateModelConfig = void 0;
const constants_1 = require("./constants");
function validateModelConfig(modelConfig) {
    if (modelConfig == null) {
        return Object.assign({}, constants_1.DEFAULT_TFJS_SELFIE_SEGMENTATION_MODEL_CONFIG);
    }
    const config = Object.assign({}, modelConfig);
    config.runtime = 'tfjs';
    if (config.modelType == null) {
        config.modelType = constants_1.DEFAULT_TFJS_SELFIE_SEGMENTATION_MODEL_CONFIG.modelType;
    }
    if (config.modelType !== 'general' && config.modelType !== 'landscape') {
        throw new Error(`Model type must be one of general or landscape, but got ${config.modelType}`);
    }
    if (config.modelUrl == null) {
        switch (config.modelType) {
            case 'general':
                config.modelUrl = constants_1.DEFAULT_TFJS_SELFIE_SEGMENTATION_MODEL_URL_GENERAL;
                break;
            case 'landscape':
            default:
                config.modelUrl = constants_1.DEFAULT_TFJS_SELFIE_SEGMENTATION_MODEL_URL_LANDSCAPE;
                break;
        }
    }
    return config;
}
exports.validateModelConfig = validateModelConfig;
function validateSegmentationConfig(segmentationConfig) {
    if (segmentationConfig == null) {
        return Object.assign({}, constants_1.DEFAULT_TFJS_SELFIE_SEGMENTATION_SEGMENTATION_CONFIG);
    }
    const config = Object.assign({}, segmentationConfig);
    if (config.flipHorizontal == null) {
        config.flipHorizontal =
            constants_1.DEFAULT_TFJS_SELFIE_SEGMENTATION_SEGMENTATION_CONFIG.flipHorizontal;
    }
    return config;
}
exports.validateSegmentationConfig = validateSegmentationConfig;
