"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedModels = exports.Keypoint = void 0;
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
const common_interfaces_1 = require("./shared/calculators/interfaces/common_interfaces");
Object.defineProperty(exports, "Keypoint", { enumerable: true, get: function () { return common_interfaces_1.Keypoint; } });
var SupportedModels;
(function (SupportedModels) {
    SupportedModels["MediaPipeFaceMesh"] = "MediaPipeFaceMesh";
})(SupportedModels = exports.SupportedModels || (exports.SupportedModels = {}));