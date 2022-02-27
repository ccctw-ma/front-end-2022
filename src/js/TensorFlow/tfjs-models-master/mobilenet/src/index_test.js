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
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const index_1 = require("./index");
(0, jasmine_util_1.describeWithFlags)('MobileNet', jasmine_util_1.NODE_ENVS, () => {
    beforeAll(() => {
        spyOn(tfconv, 'loadGraphModel').and.callFake(() => {
            const model = {
                predict: (x) => tf.zeros([x.shape[0], 1001]),
                execute: (x, nodeName) => tf.zeros([x.shape[0], 1, 1, 1024]),
            };
            return model;
        });
    });
    it('batched input logits', () => __awaiter(void 0, void 0, void 0, function* () {
        const mobilenet = yield (0, index_1.load)();
        const img = tf.zeros([3, 227, 227, 3]);
        const logits = mobilenet.infer(img);
        expect(logits.shape).toEqual([3, 1000]);
    }));
    it('batched input embeddings', () => __awaiter(void 0, void 0, void 0, function* () {
        const mobilenet = yield (0, index_1.load)();
        const img = tf.zeros([3, 227, 227, 3]);
        const embedding = mobilenet.infer(img, true /* embedding */);
        expect(embedding.shape).toEqual([3, 1024]);
    }));
    it('MobileNet classify doesn\'t leak', () => __awaiter(void 0, void 0, void 0, function* () {
        const mobilenet = yield (0, index_1.load)();
        const x = tf.zeros([227, 227, 3]);
        const numTensorsBefore = tf.memory().numTensors;
        yield mobilenet.classify(x);
        expect(tf.memory().numTensors).toBe(numTensorsBefore);
    }));
    it('MobileNet infer doesn\'t leak', () => __awaiter(void 0, void 0, void 0, function* () {
        const mobilenet = yield (0, index_1.load)();
        const x = tf.zeros([227, 227, 3]);
        const numTensorsBefore = tf.memory().numTensors;
        mobilenet.infer(x);
        expect(tf.memory().numTensors).toBe(numTensorsBefore + 1);
    }));
});
