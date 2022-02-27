"use strict";
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const _1 = require(".");
(0, jasmine_util_1.describeWithFlags)('SemanticSegmentation', jasmine_util_1.NODE_ENVS, () => {
    it('SemanticSegmentation should not leak', () => __awaiter(void 0, void 0, void 0, function* () {
        const model = yield (0, _1.load)();
        const x = tf.zeros([227, 500, 3]);
        const numOfTensorsBefore = tf.memory().numTensors;
        yield model.segment(x);
        expect(tf.memory().numTensors).toEqual(numOfTensorsBefore);
    }));
    it('SemanticSegmentation map has matching dimensions', () => __awaiter(void 0, void 0, void 0, function* () {
        const x = tf.zeros([513, 500, 3]);
        const model = yield (0, _1.load)();
        const segmentationMapTensor = yield model.predict(x);
        const [height, width] = segmentationMapTensor.shape;
        expect([height, width]).toEqual([513, 500]);
    }));
    it('SemanticSegmentation segment method generates valid output', () => __awaiter(void 0, void 0, void 0, function* () {
        const model = yield (0, _1.load)();
        const x = tf.zeros([300, 500, 3]);
        const { legend } = yield model.segment(x);
        expect(Object.keys(legend)).toContain('background');
    }));
});
