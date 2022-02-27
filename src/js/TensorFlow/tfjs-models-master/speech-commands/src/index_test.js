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
// tslint:disable-next-line:no-require-imports
const packageJSON = require('../package.json');
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tfl = __importStar(require("@tensorflow/tfjs-layers"));
const speechCommands = __importStar(require("./index"));
describe('Public API', () => {
    it('version matches package.json', () => {
        expect(typeof speechCommands.version).toEqual('string');
        expect(speechCommands.version).toEqual(packageJSON.version);
    });
});
describe('Creating recognizer', () => {
    function makeModelArtifacts() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = tfl.sequential();
            model.add(tfl.layers.conv2d({
                filters: 8,
                kernelSize: 3,
                activation: 'relu',
                inputShape: [86, 500, 1]
            }));
            model.add(tfl.layers.flatten());
            model.add(tfl.layers.dense({ units: 3, activation: 'softmax' }));
            let modelArtifacts;
            yield model.save(tf.io.withSaveHandler(artifacts => {
                modelArtifacts = artifacts;
                return null;
            }));
            return modelArtifacts;
        });
    }
    function makeMetadata() {
        return {
            wordLabels: [speechCommands.BACKGROUND_NOISE_TAG, 'foo', 'bar'],
            tfjsSpeechCommandsVersion: speechCommands.version
        };
    }
    it('Create recognizer from aritfacts and metadata objects', () => __awaiter(void 0, void 0, void 0, function* () {
        const modelArtifacts = yield makeModelArtifacts();
        const metadata = makeMetadata();
        const recognizer = speechCommands.create('BROWSER_FFT', null, modelArtifacts, metadata);
        yield recognizer.ensureModelLoaded();
        expect(recognizer.wordLabels()).toEqual([
            speechCommands.BACKGROUND_NOISE_TAG, 'foo', 'bar'
        ]);
        expect(recognizer.modelInputShape()).toEqual([null, 86, 500, 1]);
    }));
});
