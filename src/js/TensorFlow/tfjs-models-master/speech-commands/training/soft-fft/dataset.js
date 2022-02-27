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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dataset = void 0;
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
/**
 * A dataset for webcam controls which allows the user to add example Tensors
 * for particular labels. This object will concat them into two large xs and ys.
 */
class Dataset {
    constructor(numClasses) {
        this.numClasses = numClasses;
    }
    /**
     * Adding data pair to the dataset, examples and labels should have the
     * matching shape. For example, if the input shape is [2, 20, 20], 2 is the
     * batch size, the labels shape should be [2,10] (num of classes is 10).
     *
     * @param examples Batch of inputs
     * @param labels Matching labels for inputs
     */
    addExamples(examples, labels) {
        if (this.xs == null) {
            // For the first example that gets added, keep example and y so that the
            // Dataset owns the memory of the inputs. This makes sure that
            // if addExample() is called in a tf.tidy(), these Tensors will not get
            // disposed.
            this.xs = tf.keep(examples);
            this.ys = tf.keep(labels);
        }
        else {
            const oldX = this.xs;
            this.xs = tf.keep(this.xs.concat(examples, 0));
            const oldY = this.ys;
            this.ys = tf.keep(oldY.concat(labels, 0));
            oldX.dispose();
            oldY.dispose();
        }
    }
}
exports.Dataset = Dataset;
