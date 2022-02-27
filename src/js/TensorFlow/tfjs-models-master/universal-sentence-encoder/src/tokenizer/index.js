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
exports.loadVocabulary = exports.loadTokenizer = exports.Tokenizer = void 0;
/**
 * Tokenizer.encode() is a port of `EncodeAsIds` from the SentencePiece library
 * (https://github.com/google/sentencepiece). Encode uses the Viterbi algorithm
 * to find the most likely sequence of tokens that comprise the input. For more
 * details, refer to https://arxiv.org/pdf/1804.10959.pdf.
 */
const tf = __importStar(require("@tensorflow/tfjs-core"));
const util_1 = require("../util");
const trie_1 = require("./trie");
const separator = '\u2581'; // This is the unicode character 'lower one eighth block'.
function processInput(str) {
    const normalized = str.normalize('NFKC');
    return normalized.length > 0 ?
        separator + normalized.replace(/ /g, separator) :
        normalized;
}
// The first tokens are reserved for unk, control symbols, and user-defined
// symbols.
const RESERVED_SYMBOLS_COUNT = 6;
class Tokenizer {
    constructor(vocabulary, reservedSymbolsCount = RESERVED_SYMBOLS_COUNT) {
        this.vocabulary = vocabulary;
        this.reservedSymbolsCount = reservedSymbolsCount;
        this.trie = new trie_1.Trie();
        for (let i = this.reservedSymbolsCount; i < this.vocabulary.length; i++) {
            this.trie.insert(this.vocabulary[i][0], this.vocabulary[i][1], i);
        }
    }
    encode(input) {
        const nodes = [];
        const words = [];
        const best = [];
        input = processInput(input);
        const symbols = (0, util_1.stringToChars)(input);
        for (let i = 0; i <= symbols.length; i++) {
            nodes.push({});
            words.push(0);
            best.push(0);
        }
        // Construct the lattice.
        for (let i = 0; i < symbols.length; i++) {
            const matches = this.trie.commonPrefixSearch(symbols.slice(i));
            for (let j = 0; j < matches.length; j++) {
                const piece = matches[j];
                const obj = { key: piece[0], score: piece[1], index: piece[2] };
                const endPos = piece[0].length;
                if (nodes[i + endPos][i] == null) {
                    nodes[i + endPos][i] = [];
                }
                nodes[i + endPos][i].push(obj);
            }
        }
        for (let endPos = 0; endPos <= symbols.length; endPos++) {
            for (const startPos in nodes[endPos]) {
                const arr = nodes[endPos][startPos];
                for (let j = 0; j < arr.length; j++) {
                    const word = arr[j];
                    const score = word.score + best[endPos - word.key.length];
                    if (best[endPos] === 0 || score >= best[endPos]) {
                        best[endPos] = score;
                        words[endPos] = arr[j].index;
                    }
                }
            }
        }
        const results = [];
        // Backward pass.
        let iter = words.length - 1;
        while (iter > 0) {
            results.push(words[iter]);
            iter -= this.vocabulary[words[iter]][0].length;
        }
        // Merge consecutive unks.
        const merged = [];
        let isPreviousUnk = false;
        for (let i = 0; i < results.length; i++) {
            const id = results[i];
            if (!(isPreviousUnk && id === 0)) {
                merged.push(id);
            }
            isPreviousUnk = id === 0;
        }
        return merged.reverse();
    }
}
exports.Tokenizer = Tokenizer;
/**
 * Load the Tokenizer for use independently from the UniversalSentenceEncoder.
 *
 * @param pathToVocabulary (optional) Provide a path to the vocabulary file.
 */
function loadTokenizer(pathToVocabulary) {
    return __awaiter(this, void 0, void 0, function* () {
        const vocabulary = yield loadVocabulary(pathToVocabulary);
        const tokenizer = new Tokenizer(vocabulary);
        return tokenizer;
    });
}
exports.loadTokenizer = loadTokenizer;
/**
 * Load a vocabulary for the Tokenizer.
 *
 * @param pathToVocabulary Defaults to the path to the 8k vocabulary used by the
 * UniversalSentenceEncoder.
 */
function loadVocabulary(pathToVocabulary) {
    return __awaiter(this, void 0, void 0, function* () {
        const vocabulary = yield tf.util.fetch(pathToVocabulary);
        return vocabulary.json();
    });
}
exports.loadVocabulary = loadVocabulary;
