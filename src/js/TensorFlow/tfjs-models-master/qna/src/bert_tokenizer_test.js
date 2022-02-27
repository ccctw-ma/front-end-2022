"use strict";
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
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const bert_tokenizer_1 = require("./bert_tokenizer");
(0, jasmine_util_1.describeWithFlags)('bertTokenizer', jasmine_util_1.NODE_ENVS, () => {
    it('should load', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenizer = yield (0, bert_tokenizer_1.loadTokenizer)();
        expect(tokenizer).toBeDefined();
    }));
    it('should tokenize', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenizer = yield (0, bert_tokenizer_1.loadTokenizer)();
        const result = tokenizer.tokenize('a new test');
        expect(result).toEqual([1037, 2047, 3231]);
    }));
    it('should tokenize punctuation', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenizer = yield (0, bert_tokenizer_1.loadTokenizer)();
        const result = tokenizer.tokenize('a new [test]');
        expect(result).toEqual([1037, 2047, 1031, 3231, 1033]);
    }));
    it('should tokenize empty string', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenizer = yield (0, bert_tokenizer_1.loadTokenizer)();
        const result = tokenizer.tokenize('');
        expect(result).toEqual([]);
    }));
    it('should tokenize control characters', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenizer = yield (0, bert_tokenizer_1.loadTokenizer)();
        const result = tokenizer.tokenize('a new\b\v [test]');
        expect(result).toEqual([1037, 100, 1031, 3231, 1033]);
    }));
    it('should processInput', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenizer = yield (0, bert_tokenizer_1.loadTokenizer)();
        const result = tokenizer.processInput(' a new\t\v  [test]');
        expect(result).toEqual([
            { text: 'a', index: 1 }, { text: 'new', index: 3 }, { text: '[', index: 10 },
            { text: 'test', index: 11 }, { text: ']', index: 15 }
        ]);
    }));
});
