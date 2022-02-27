"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const handpose = __importStar(require("./index"));
const test_util_1 = require("./test_util");
(0, jasmine_util_1.describeWithFlags)('Handpose', jasmine_util_1.ALL_ENVS, () => {
    let model;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Note: this makes a network request for model assets.
        model = yield handpose.load({ detectionConfidence: 0 });
    }));
    it('estimateHands does not leak memory', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = tf.zeros([128, 128, 3]);
        // Do not count tensors involved in setup.
        yield model.estimateHands(input);
        let beforeTensors = tf.memory().numTensors;
        yield model.estimateHands(input, false /* flipHorizontal */);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
        beforeTensors = tf.memory().numTensors;
        yield model.estimateHands(input, true /* flipHorizontal */);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
    }));
    it('estimateHands returns objects with expected properties', () => __awaiter(void 0, void 0, void 0, function* () {
        // Stubbed image contains a single hand.
        const input = tf.tensor3d(test_util_1.stubbedImageVals, [128, 128, 3]);
        yield model.estimateHands(input);
        const beforeTensors = tf.memory().numTensors;
        const hands = yield model.estimateHands(input);
        expect(tf.memory().numTensors).toEqual(beforeTensors);
        const hand = hands[0];
        expect(hand.boundingBox.topLeft).toBeDefined();
        expect(hand.boundingBox.bottomRight).toBeDefined();
        expect(hand.landmarks).toBeDefined();
        expect(hand.handInViewConfidence).toBeDefined();
    }));
});
