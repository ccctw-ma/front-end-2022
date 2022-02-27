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
(0, jasmine_util_1.describeWithFlags)('ObjectDetection', jasmine_util_1.NODE_ENVS, () => {
    beforeEach(() => {
        spyOn(tfconv, 'loadGraphModel').and.callFake(() => {
            const model = {
                executeAsync: (x) => [tf.ones([1, 1917, 90]), tf.ones([1, 1917, 1, 4])],
                dispose: () => true
            };
            return model;
        });
    });
    it('ObjectDetection detect method should not leak', () => __awaiter(void 0, void 0, void 0, function* () {
        const objectDetection = yield (0, index_1.load)();
        const x = tf.zeros([227, 227, 3]);
        const numOfTensorsBefore = tf.memory().numTensors;
        yield objectDetection.detect(x, 1);
        expect(tf.memory().numTensors).toEqual(numOfTensorsBefore);
    }));
    it('ObjectDetection e2e should not leak', () => __awaiter(void 0, void 0, void 0, function* () {
        const numOfTensorsBefore = tf.memory().numTensors;
        const objectDetection = yield (0, index_1.load)();
        const x = tf.zeros([227, 227, 3]);
        yield objectDetection.detect(x, 1);
        x.dispose();
        objectDetection.dispose();
        expect(tf.memory().numTensors).toEqual(numOfTensorsBefore);
    }));
    it('ObjectDetection detect method should generate output', () => __awaiter(void 0, void 0, void 0, function* () {
        const objectDetection = yield (0, index_1.load)();
        const x = tf.zeros([227, 227, 3]);
        const data = yield objectDetection.detect(x, 1);
        expect(data).toEqual([{ bbox: [227, 227, 0, 0], class: 'person', score: 1 }]);
    }));
    it('should allow custom model url', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, index_1.load)({ base: 'mobilenet_v1' });
        expect(tfconv.loadGraphModel)
            .toHaveBeenCalledWith('https://storage.googleapis.com/tfjs-models/' +
            'savedmodel/ssd_mobilenet_v1/model.json');
    }));
    it('should allow custom model url', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, index_1.load)({ modelUrl: 'https://test.org/model.json' });
        expect(tfconv.loadGraphModel)
            .toHaveBeenCalledWith('https://test.org/model.json');
    }));
});
