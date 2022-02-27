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
exports.ToxicityClassifier = exports.load = exports.version = void 0;
const use = __importStar(require("@tensorflow-models/universal-sentence-encoder"));
const tfconv = __importStar(require("@tensorflow/tfjs-converter"));
const tf = __importStar(require("@tensorflow/tfjs-core"));
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
/**
 * Load the toxicity model.
 *
 * @param threshold A prediction is considered valid only if its confidence
 * exceeds the threshold. Defaults to 0.85.
 * @param toxicityLabels An array of strings indicating which types of toxicity
 * to detect. Labels must be one of `toxicity` | `severe_toxicity` |
 * `identity_attack` | `insult` | `threat` | `sexual_explicit` | `obscene`.
 * Defaults to all labels.
 */
function load(threshold, toxicityLabels) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = new ToxicityClassifier(threshold, toxicityLabels);
        yield model.load();
        return model;
    });
}
exports.load = load;
class ToxicityClassifier {
    constructor(threshold = 0.85, toxicityLabels = []) {
        this.threshold = threshold;
        this.toxicityLabels = toxicityLabels;
    }
    loadModel() {
        return __awaiter(this, void 0, void 0, function* () {
            return tfconv.loadGraphModel('https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1', { fromTFHub: true });
        });
    }
    loadTokenizer() {
        return __awaiter(this, void 0, void 0, function* () {
            return use.loadTokenizer();
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const [model, tokenizer] = yield Promise.all([this.loadModel(), this.loadTokenizer()]);
            this.model = model;
            this.tokenizer = tokenizer;
            this.labels =
                model.outputs.map((d) => d.name.split('/')[0]);
            if (this.toxicityLabels.length === 0) {
                this.toxicityLabels = this.labels;
            }
            else {
                tf.util.assert(this.toxicityLabels.every(d => this.labels.indexOf(d) > -1), () => `toxicityLabels argument must contain only items from the ` +
                    `model heads ${this.labels.join(', ')}, ` +
                    `got ${this.toxicityLabels.join(', ')}`);
            }
        });
    }
    /**
     * Returns an array of objects, one for each label, that contains
     * the raw probabilities for each input along with the final prediction
     * boolean given the threshold. If a prediction falls below the threshold,
     * `null` is returned.
     *
     * @param inputs A string or an array of strings to classify.
     */
    classify(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof inputs === 'string') {
                inputs = [inputs];
            }
            const encodings = inputs.map(d => this.tokenizer.encode(d));
            // TODO: revive once the model is robust to padding
            // const encodings = inputs.map(d => padInput(this.tokenizer.encode(d)));
            const indicesArr = encodings.map((arr, i) => arr.map((d, index) => [i, index]));
            let flattenedIndicesArr = [];
            for (let i = 0; i < indicesArr.length; i++) {
                flattenedIndicesArr =
                    flattenedIndicesArr.concat(indicesArr[i]);
            }
            const indices = tf.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
            const values = tf.tensor1d(tf.util.flatten(encodings), 'int32');
            const modelInputs = {
                Placeholder_1: indices,
                Placeholder: values
            };
            const labels = yield this.model.executeAsync(modelInputs);
            indices.dispose();
            values.dispose();
            return labels
                .map((d, i) => ({ data: d, headIndex: i }))
                .filter((d) => this.toxicityLabels.indexOf(this.labels[d.headIndex]) > -1)
                .map((d) => {
                const prediction = d.data.dataSync();
                const results = [];
                for (let input = 0; input < inputs.length; input++) {
                    const probabilities = prediction.slice(input * 2, input * 2 + 2);
                    let match = null;
                    if (Math.max(probabilities[0], probabilities[1]) > this.threshold) {
                        match = probabilities[0] < probabilities[1];
                    }
                    results.push({ probabilities, match });
                }
                return { label: this.labels[d.headIndex], results };
            });
        });
    }
}
exports.ToxicityClassifier = ToxicityClassifier;
