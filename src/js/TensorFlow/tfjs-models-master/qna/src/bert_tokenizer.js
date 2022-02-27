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
exports.loadTokenizer = exports.BertTokenizer = exports.VOCAB_URL = exports.VOCAB_BASE = exports.NFKC_TOKEN = exports.SEP_TOKEN = exports.SEP_INDEX = exports.CLS_TOKEN = exports.CLS_INDEX = exports.UNK_INDEX = void 0;
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
const tf = __importStar(require("@tensorflow/tfjs-core"));
const SEPERATOR = '\u2581';
exports.UNK_INDEX = 100;
exports.CLS_INDEX = 101;
exports.CLS_TOKEN = '[CLS]';
exports.SEP_INDEX = 102;
exports.SEP_TOKEN = '[SEP]';
exports.NFKC_TOKEN = 'NFKC';
exports.VOCAB_BASE = 'https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1/';
exports.VOCAB_URL = exports.VOCAB_BASE + 'processed_vocab.json?tfjs-format=file';
/**
 * Class for represent node for token parsing Trie data structure.
 */
class TrieNode {
    constructor(key) {
        this.key = key;
        this.children = {};
        this.end = false;
    }
    getWord() {
        const output = [];
        let node = this;
        while (node != null) {
            if (node.key != null) {
                output.unshift(node.key);
            }
            node = node.parent;
        }
        return [output, this.score, this.index];
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }
    /**
     * Insert the bert vacabulary word into the trie.
     * @param word word to be inserted.
     * @param score word score.
     * @param index index of word in the bert vocabulary file.
     */
    insert(word, score, index) {
        let node = this.root;
        const symbols = [];
        for (const symbol of word) {
            symbols.push(symbol);
        }
        for (let i = 0; i < symbols.length; i++) {
            if (node.children[symbols[i]] == null) {
                node.children[symbols[i]] = new TrieNode(symbols[i]);
                node.children[symbols[i]].parent = node;
            }
            node = node.children[symbols[i]];
            if (i === symbols.length - 1) {
                node.end = true;
                node.score = score;
                node.index = index;
            }
        }
    }
    /**
     * Find the Trie node for the given token, it will return the first node that
     * matches the subtoken from the beginning of the token.
     * @param token string, input string to be searched.
     */
    find(token) {
        let node = this.root;
        let iter = 0;
        while (iter < token.length && node != null) {
            node = node.children[token[iter]];
            iter++;
        }
        return node;
    }
}
function isWhitespace(ch) {
    return /\s/.test(ch);
}
function isInvalid(ch) {
    return (ch.charCodeAt(0) === 0 || ch.charCodeAt(0) === 0xfffd);
}
const punctuations = '[~`!@#$%^&*(){}[];:"\'<,.>?/\\|-_+=';
/** To judge whether it's a punctuation. */
function isPunctuation(ch) {
    return punctuations.indexOf(ch) !== -1;
}
/**
 * Tokenizer for Bert.
 */
class BertTokenizer {
    /**
     * Load the vacabulary file and initialize the Trie for lookup.
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vocab = yield this.loadVocab();
            this.trie = new Trie();
            // Actual tokens start at 999.
            for (let vocabIndex = 999; vocabIndex < this.vocab.length; vocabIndex++) {
                const word = this.vocab[vocabIndex];
                this.trie.insert(word, 1, vocabIndex);
            }
        });
    }
    loadVocab() {
        return __awaiter(this, void 0, void 0, function* () {
            return tf.util.fetch(exports.VOCAB_URL).then(d => d.json());
        });
    }
    processInput(text) {
        const charOriginalIndex = [];
        const cleanedText = this.cleanText(text, charOriginalIndex);
        const origTokens = cleanedText.split(' ');
        let charCount = 0;
        const tokens = origTokens.map((token) => {
            token = token.toLowerCase();
            const tokens = this.runSplitOnPunc(token, charCount, charOriginalIndex);
            charCount += token.length + 1;
            return tokens;
        });
        let flattenTokens = [];
        for (let index = 0; index < tokens.length; index++) {
            flattenTokens = flattenTokens.concat(tokens[index]);
        }
        return flattenTokens;
    }
    /* Performs invalid character removal and whitespace cleanup on text. */
    cleanText(text, charOriginalIndex) {
        const stringBuilder = [];
        let originalCharIndex = 0, newCharIndex = 0;
        for (const ch of text) {
            // Skip the characters that cannot be used.
            if (isInvalid(ch)) {
                originalCharIndex += ch.length;
                continue;
            }
            if (isWhitespace(ch)) {
                if (stringBuilder.length > 0 &&
                    stringBuilder[stringBuilder.length - 1] !== ' ') {
                    stringBuilder.push(' ');
                    charOriginalIndex[newCharIndex] = originalCharIndex;
                    originalCharIndex += ch.length;
                }
                else {
                    originalCharIndex += ch.length;
                    continue;
                }
            }
            else {
                stringBuilder.push(ch);
                charOriginalIndex[newCharIndex] = originalCharIndex;
                originalCharIndex += ch.length;
            }
            newCharIndex++;
        }
        return stringBuilder.join('');
    }
    /* Splits punctuation on a piece of text. */
    runSplitOnPunc(text, count, charOriginalIndex) {
        const tokens = [];
        let startNewWord = true;
        for (const ch of text) {
            if (isPunctuation(ch)) {
                tokens.push({ text: ch, index: charOriginalIndex[count] });
                count += ch.length;
                startNewWord = true;
            }
            else {
                if (startNewWord) {
                    tokens.push({ text: '', index: charOriginalIndex[count] });
                    startNewWord = false;
                }
                tokens[tokens.length - 1].text += ch;
                count += ch.length;
            }
        }
        return tokens;
    }
    /**
     * Generate tokens for the given vocalbuary.
     * @param text text to be tokenized.
     */
    tokenize(text) {
        // Source:
        // https://github.com/google-research/bert/blob/88a817c37f788702a363ff935fd173b6dc6ac0d6/tokenization.py#L311
        let outputTokens = [];
        const words = this.processInput(text);
        words.forEach(word => {
            if (word.text !== exports.CLS_TOKEN && word.text !== exports.SEP_TOKEN) {
                word.text = `${SEPERATOR}${word.text.normalize(exports.NFKC_TOKEN)}`;
            }
        });
        for (let i = 0; i < words.length; i++) {
            const chars = [];
            for (const symbol of words[i].text) {
                chars.push(symbol);
            }
            let isUnknown = false;
            let start = 0;
            const subTokens = [];
            const charsLength = chars.length;
            while (start < charsLength) {
                let end = charsLength;
                let currIndex;
                while (start < end) {
                    const substr = chars.slice(start, end).join('');
                    const match = this.trie.find(substr);
                    if (match != null && match.end != null) {
                        currIndex = match.getWord()[2];
                        break;
                    }
                    end = end - 1;
                }
                if (currIndex == null) {
                    isUnknown = true;
                    break;
                }
                subTokens.push(currIndex);
                start = end;
            }
            if (isUnknown) {
                outputTokens.push(exports.UNK_INDEX);
            }
            else {
                outputTokens = outputTokens.concat(subTokens);
            }
        }
        return outputTokens;
    }
}
exports.BertTokenizer = BertTokenizer;
function loadTokenizer() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenizer = new BertTokenizer();
        yield tokenizer.load();
        return tokenizer;
    });
}
exports.loadTokenizer = loadTokenizer;
