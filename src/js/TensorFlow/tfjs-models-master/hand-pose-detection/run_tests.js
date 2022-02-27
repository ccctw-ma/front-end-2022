"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
// Use the CPU backend for running tests.
require("@tensorflow/tfjs-backend-cpu");
// tslint:disable-next-line:no-imports-from-dist
const jasmine_util = __importStar(require("@tensorflow/tfjs-core/dist/jasmine_util"));
// tslint:disable-next-line:no-require-imports
const jasmineCtor = require('jasmine');
Error.stackTraceLimit = Infinity;
process.on('unhandledRejection', e => {
    throw e;
});
jasmine_util.setTestEnvs([{ name: 'test-hand-pose-detection', backendName: 'cpu', flags: {} }]);
const unitTests = 'src/**/*_test.ts';
const runner = new jasmineCtor();
runner.loadConfig({ spec_files: [unitTests], random: false });
runner.execute();
