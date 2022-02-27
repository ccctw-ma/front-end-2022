"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
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
exports.UniversalSentenceEncoderQnA = exports.loadQnA = exports.version = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tokenizer_1 = require("./tokenizer");
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
const BASE_PATH = 'https://tfhub.dev/google/tfjs-model/universal-sentence-encoder-qa-ondevice/1';
// Index in the vocab file that needs to be skipped.
const SKIP_VALUES = [0, 1, 2];
// Offset value for skipped vocab index.
const OFFSET = 3;
// Input tensor size limit.
const INPUT_LIMIT = 192;
// Model node name for query.
const QUERY_NODE_NAME = 'input_inp_text';
// Model node name for query.
const RESPONSE_CONTEXT_NODE_NAME = 'input_res_context';
// Model node name for response.
const RESPONSE_NODE_NAME = 'input_res_text';
// Model node name for response result.
const RESPONSE_RESULT_NODE_NAME = 'Final/EncodeResult/mul';
// Model node name for query result.
const QUERY_RESULT_NODE_NAME = 'Final/EncodeQuery/mul';
// Reserved symbol count for tokenizer.
const RESERVED_SYMBOLS_COUNT = 3;
// Value for token padding
const TOKEN_PADDING = 2;
// Start value for each token
const TOKEN_START_VALUE = 1;
function loadQnA() {
    return __awaiter(this, void 0, void 0, function* () {
        const use = new UniversalSentenceEncoderQnA();
        yield use.load();
        return use;
    });
}
exports.loadQnA = loadQnA;
class UniversalSentenceEncoderQnA {
    loadModel() {
        return __awaiter(this, void 0, void 0, function* () {
            return tfconv.loadGraphModel(BASE_PATH, { fromTFHub: true });
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const [model, vocabulary] = yield Promise.all([
                this.loadModel(),
                (0, tokenizer_1.loadVocabulary)(`${BASE_PATH}/vocab.json?tfjs-format=file`)
            ]);
            this.model = model;
            this.tokenizer = new tokenizer_1.Tokenizer(vocabulary, RESERVED_SYMBOLS_COUNT);
        });
    }
    /**
     *
     * Returns a map of queryEmbedding and responseEmbedding
     *
     * @param input the ModelInput that contains queries and answers.
     */
    embed(input) {
        const embeddings = tf.tidy(() => {
            const queryEncoding = this.tokenizeStrings(input.queries, INPUT_LIMIT);
            const responseEncoding = this.tokenizeStrings(input.responses, INPUT_LIMIT);
            if (input.contexts != null) {
                if (input.contexts.length !== input.responses.length) {
                    throw new Error('The length of response strings ' +
                        'and context strings need to match.');
                }
            }
            const contexts = input.contexts || [];
            if (input.contexts == null) {
                contexts.length = input.responses.length;
                contexts.fill('');
            }
            const contextEncoding = this.tokenizeStrings(contexts, INPUT_LIMIT);
            const modelInputs = {};
            modelInputs[QUERY_NODE_NAME] = queryEncoding;
            modelInputs[RESPONSE_NODE_NAME] = responseEncoding;
            modelInputs[RESPONSE_CONTEXT_NODE_NAME] = contextEncoding;
            return this.model.execute(modelInputs, [QUERY_RESULT_NODE_NAME, RESPONSE_RESULT_NODE_NAME]);
        });
        const queryEmbedding = embeddings[0];
        const responseEmbedding = embeddings[1];
        return { queryEmbedding, responseEmbedding };
    }
    tokenizeStrings(strs, limit) {
        const tokens = strs.map(s => this.shiftTokens(this.tokenizer.encode(s), INPUT_LIMIT));
        return tf.tensor2d(tokens, [strs.length, INPUT_LIMIT], 'int32');
    }
    shiftTokens(tokens, limit) {
        tokens.unshift(TOKEN_START_VALUE);
        for (let index = 0; index < limit; index++) {
            if (index >= tokens.length) {
                tokens[index] = TOKEN_PADDING;
            }
            else if (!SKIP_VALUES.includes(tokens[index])) {
                tokens[index] += OFFSET;
            }
        }
        return tokens.slice(0, limit);
    }
}
exports.UniversalSentenceEncoderQnA = UniversalSentenceEncoderQnA;
