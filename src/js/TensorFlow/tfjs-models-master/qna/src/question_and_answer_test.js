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
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
require("@tensorflow/tfjs-backend-cpu");
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
require("jasmine");
const index_1 = require("./index");
(0, jasmine_util_1.describeWithFlags)('qna', jasmine_util_1.NODE_ENVS, () => {
    let model;
    let executeSpy;
    beforeEach(() => {
        spyOn(tfconv, 'loadGraphModel').and.callFake((modelUrl) => {
            model = new tfconv.GraphModel(modelUrl);
            executeSpy = spyOn(model, 'execute')
                .and.callFake((x) => [tf.tensor2d([
                    0, 0, 0, 0, 10, 20, 30, 20, 10, 0,
                    ...Array(374).fill(0)
                ], [1, 384]),
                tf.tensor2d([
                    0, 0, 0, 0, 10, 20, 30, 20, 10, 20,
                    ...Array(374).fill(0)
                ], [1, 384])]);
            return Promise.resolve(model);
        });
    });
    it('qna detect method should not leak', () => __awaiter(void 0, void 0, void 0, function* () {
        const qna = yield (0, index_1.load)();
        const numOfTensorsBefore = tf.memory().numTensors;
        yield qna.findAnswers('question', 'context');
        expect(tf.memory().numTensors).toEqual(numOfTensorsBefore);
    }));
    it('qna detect method should generate output', () => __awaiter(void 0, void 0, void 0, function* () {
        const qna = yield (0, index_1.load)();
        const data = yield qna.findAnswers('question', 'context');
        expect(data).toEqual([]);
    }));
    it('qna detect method should throw error if question is too long', () => __awaiter(void 0, void 0, void 0, function* () {
        const qna = yield (0, index_1.load)();
        const question = 'question '.repeat(300);
        let result = undefined;
        try {
            result = yield qna.findAnswers(question, 'context');
        }
        catch (error) {
            expect(error.message)
                .toEqual('The length of question token exceeds the limit (64).');
        }
        expect(result).toBeUndefined();
    }));
    it('qna detect method should work for long context', () => __awaiter(void 0, void 0, void 0, function* () {
        const qna = yield (0, index_1.load)();
        const context = 'text '.repeat(1000);
        executeSpy.and.returnValue([tf.tensor2d([
                0, 0, 0, 0, 10, 20, 30, 20, 10, 0,
                ...Array(384 * 6 - 10).fill(0)
            ], [6, 384]),
            tf.tensor2d([
                0, 0, 0, 0, 10, 20, 30, 20, 10, 20,
                ...Array(384 * 6 - 10).fill(0)
            ], [6, 384])]);
        const data = yield qna.findAnswers('question', context);
        expect(data.length).toEqual(5);
    }));
    it('should allow custom model url', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, index_1.load)({ modelUrl: 'https://google.com/model.json' });
        expect(tfconv.loadGraphModel)
            .toHaveBeenCalledWith('https://google.com/model.json', { fromTFHub: false });
    }));
    it('should populate the startIndex and endIndex', () => __awaiter(void 0, void 0, void 0, function* () {
        const qna = yield (0, index_1.load)();
        const result = yield qna.findAnswers('question', 'this is answer for you!');
        expect(result).toEqual([
            { text: 'answer', score: 60, startIndex: 8, endIndex: 14 },
            { text: 'answer for', score: 50, startIndex: 8, endIndex: 18 },
            { text: 'answer for you!', score: 50, startIndex: 8, endIndex: 23 },
            { text: 'is answer', score: 50, startIndex: 5, endIndex: 14 },
            { text: 'is', score: 40, startIndex: 5, endIndex: 7 }
        ]);
    }));
});
