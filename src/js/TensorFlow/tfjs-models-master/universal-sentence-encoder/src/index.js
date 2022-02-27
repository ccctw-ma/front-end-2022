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
exports.loadQnA = exports.loadTokenizer = exports.Tokenizer = exports.UniversalSentenceEncoder = exports.load = exports.version = void 0;
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tokenizer_1 = require("./tokenizer");
Object.defineProperty(exports, "loadTokenizer", { enumerable: true, get: function () { return tokenizer_1.loadTokenizer; } });
Object.defineProperty(exports, "Tokenizer", { enumerable: true, get: function () { return tokenizer_1.Tokenizer; } });
const use_qna_1 = require("./use_qna");
Object.defineProperty(exports, "loadQnA", { enumerable: true, get: function () { return use_qna_1.loadQnA; } });
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
const BASE_PATH = 'https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder';
function load(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const use = new UniversalSentenceEncoder();
        yield use.load(config);
        return use;
    });
}
exports.load = load;
class UniversalSentenceEncoder {
    loadModel(modelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return modelUrl
                ? tfconv.loadGraphModel(modelUrl)
                : tfconv.loadGraphModel('https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder-lite/1/default/1', { fromTFHub: true });
        });
    }
    load(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const [model, vocabulary] = yield Promise.all([
                this.loadModel(config.modelUrl),
                (0, tokenizer_1.loadVocabulary)(config.vocabUrl || `${BASE_PATH}/vocab.json`)
            ]);
            this.model = model;
            this.tokenizer = new tokenizer_1.Tokenizer(vocabulary);
        });
    }
    /**
     *
     * Returns a 2D Tensor of shape [input.length, 512] that contains the
     * Universal Sentence Encoder embeddings for each input.
     *
     * @param inputs A string or an array of strings to embed.
     */
    embed(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof inputs === 'string') {
                inputs = [inputs];
            }
            const encodings = inputs.map(d => this.tokenizer.encode(d));
            const indicesArr = encodings.map((arr, i) => arr.map((d, index) => [i, index]));
            let flattenedIndicesArr = [];
            for (let i = 0; i < indicesArr.length; i++) {
                flattenedIndicesArr =
                    flattenedIndicesArr.concat(indicesArr[i]);
            }
            const indices = tf.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
            const values = tf.tensor1d(tf.util.flatten(encodings), 'int32');
            const modelInputs = { indices, values };
            const embeddings = yield this.model.executeAsync(modelInputs);
            indices.dispose();
            values.dispose();
            return embeddings;
        });
    }
}
exports.UniversalSentenceEncoder = UniversalSentenceEncoder;
