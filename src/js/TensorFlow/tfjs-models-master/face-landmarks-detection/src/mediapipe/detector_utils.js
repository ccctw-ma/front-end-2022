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
    if (modelConfig == null) {
        return Object.assign({}, constants_1.DEFAULT_FACE_MESH_MODEL_CONFIG);
    }
    const config = Object.assign({}, modelConfig);
    config.runtime = 'mediapipe';
    if (config.maxFaces == null) {
        config.maxFaces = constants_1.DEFAULT_FACE_MESH_MODEL_CONFIG.maxFaces;
    }
    if (config.predictIrises == null) {
        config.predictIrises = constants_1.DEFAULT_FACE_MESH_MODEL_CONFIG.predictIrises;
    }
    return config;
}
exports.validateModelConfig = validateModelConfig;
function validateEstimationConfig(estimationConfig) {
    if (estimationConfig == null) {
        return Object.assign({}, constants_1.DEFAULT_FACE_MESH_ESTIMATION_CONFIG);
    }
    const config = Object.assign({}, estimationConfig);
    if (config.flipHorizontal == null) {
        config.flipHorizontal = constants_1.DEFAULT_FACE_MESH_ESTIMATION_CONFIG.flipHorizontal;
    }
    if (config.staticImageMode == null) {
        config.staticImageMode =
            constants_1.DEFAULT_FACE_MESH_ESTIMATION_CONFIG.staticImageMode;
    }
    return config;
}
exports.validateEstimationConfig = validateEstimationConfig;
