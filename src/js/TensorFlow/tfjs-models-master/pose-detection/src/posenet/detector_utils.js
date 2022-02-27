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
exports.validateEstimationConfig = exports.assertValidResolution = exports.assertValidOutputStride = exports.validateModelConfig = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const constants_1 = require("./constants");
function validateModelConfig(modelConfig) {
    const config = modelConfig || constants_1.MOBILENET_V1_CONFIG;
    if (config.architecture == null) {
        config.architecture = 'MobileNetV1';
    }
    if (constants_1.VALID_ARCHITECTURE.indexOf(config.architecture) < 0) {
        throw new Error(`Invalid architecture ${config.architecture}. ` +
            `Should be one of ${constants_1.VALID_ARCHITECTURE}`);
    }
    if (config.inputResolution == null) {
        config.inputResolution = { height: 257, width: 257 };
    }
    if (config.outputStride == null) {
        config.outputStride = 16;
    }
    if (constants_1.VALID_STRIDE[config.architecture].indexOf(config.outputStride) < 0) {
        throw new Error(`Invalid outputStride ${config.outputStride}. ` +
            `Should be one of ${constants_1.VALID_STRIDE[config.architecture]} ` +
            `for architecture ${config.architecture}.`);
    }
    if (config.multiplier == null) {
        config.multiplier = 1.0;
    }
    if (constants_1.VALID_MULTIPLIER[config.architecture].indexOf(config.multiplier) < 0) {
        throw new Error(`Invalid multiplier ${config.multiplier}. ` +
            `Should be one of ${constants_1.VALID_MULTIPLIER[config.architecture]} ` +
            `for architecture ${config.architecture}.`);
    }
    if (config.quantBytes == null) {
        config.quantBytes = 4;
    }
    if (constants_1.VALID_QUANT_BYTES.indexOf(config.quantBytes) < 0) {
        throw new Error(`Invalid quantBytes ${config.quantBytes}. ` +
            `Should be one of ${constants_1.VALID_QUANT_BYTES} ` +
            `for architecture ${config.architecture}.`);
    }
    if (config.architecture === 'MobileNetV1' && config.outputStride === 32 &&
        config.multiplier !== 1) {
        throw new Error(`When using an output stride of 32, ` +
            `you must select 1 as the multiplier.`);
    }
    return config;
}
exports.validateModelConfig = validateModelConfig;
function assertValidOutputStride(outputStride) {
    tf.util.assert(constants_1.VALID_OUTPUT_STRIDES.indexOf(outputStride) >= 0, () => `outputStride of ${outputStride} is invalid. ` +
        `It must be either 8 or 16.`);
}
exports.assertValidOutputStride = assertValidOutputStride;
function isValidInputResolution(resolution, outputStride) {
    return (resolution - 1) % outputStride === 0;
}
function assertValidResolution(resolution, outputStride) {
    tf.util.assert(isValidInputResolution(resolution.height, outputStride), () => `height of ${resolution.height} is invalid for output stride ` +
        `${outputStride}.`);
    tf.util.assert(isValidInputResolution(resolution.width, outputStride), () => `width of ${resolution.width} is invalid for output stride ` +
        `${outputStride}.`);
}
exports.assertValidResolution = assertValidResolution;
function validateEstimationConfig(estimationConfig) {
    let config = estimationConfig;
    if (config.maxPoses == null) {
        config.maxPoses = 1;
    }
    if (config.maxPoses <= 0) {
        throw new Error(`Invalid maxPoses ${config.maxPoses}. Should be > 0.`);
    }
    if (config.maxPoses > 1) {
        // Multi-poses estimation, needs additional check for multi-poses
        // parameters.
        config = Object.assign(Object.assign({}, constants_1.MULTI_PERSON_ESTIMATION_CONFIG), config);
        if (config.scoreThreshold < 0.0 || config.scoreThreshold > 1.0) {
            throw new Error(`Invalid scoreThreshold ${config.scoreThreshold}. ` +
                `Should be in range [0.0, 1.0]`);
        }
        if (config.nmsRadius <= 0) {
            throw new Error(`Invalid nmsRadius ${config.nmsRadius}.`);
        }
    }
    return config;
}
exports.validateEstimationConfig = validateEstimationConfig;
