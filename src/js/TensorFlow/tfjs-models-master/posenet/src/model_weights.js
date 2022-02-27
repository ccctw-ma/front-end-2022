"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelWeights = void 0;
class ModelWeights {
    constructor(variables) {
        this.variables = variables;
    }
    weights(layerName) {
        return this.variables[`MobilenetV1/${layerName}/weights`];
    }
    depthwiseBias(layerName) {
        return this.variables[`MobilenetV1/${layerName}/biases`];
    }
    convBias(layerName) {
        return this.depthwiseBias(layerName);
    }
    depthwiseWeights(layerName) {
        return this.variables[`MobilenetV1/${layerName}/depthwise_weights`];
    }
    dispose() {
        for (const varName in this.variables) {
            this.variables[varName].dispose();
        }
    }
}
exports.ModelWeights = ModelWeights;
