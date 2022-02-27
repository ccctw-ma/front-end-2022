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
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// tslint:disable-next-line: no-imports-from-dist
const test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
const test_util_2 = require("../test_util");
const create_ssd_anchors_1 = require("./create_ssd_anchors");
const EPS = 1e-5;
function compareAnchors(actual, expected) {
    expect(actual.length).toBe(expected.length);
    for (let i = 0; i < actual.length; ++i) {
        const actualAnchor = actual[i];
        const expectedAnchor = expected[i];
        for (const key of ['xCenter', 'yCenter', 'width', 'height']) {
            const actualValue = actualAnchor[key];
            const expectedValue = expectedAnchor[key];
            (0, test_util_1.expectNumbersClose)(actualValue, expectedValue, EPS);
        }
    }
}
function parseAnchors(anchorsValues) {
    return anchorsValues.map(anchorValues => ({
        xCenter: anchorValues[0],
        yCenter: anchorValues[1],
        width: anchorValues[2],
        height: anchorValues[3]
    }));
}
describe('createSsdAnchors', () => {
    it('face detection config.', () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedAnchors = parseAnchors(yield fetch(`${test_util_2.KARMA_SERVER}/shared/anchor_golden_file_0.json`)
            .then(response => response.json()));
        const config = {
            featureMapHeight: [],
            featureMapWidth: [],
            numLayers: 5,
            minScale: 0.1171875,
            maxScale: 0.75,
            inputSizeHeight: 256,
            inputSizeWidth: 256,
            anchorOffsetX: 0.5,
            anchorOffsetY: 0.5,
            strides: [8, 16, 32, 32, 32],
            aspectRatios: [1.0],
            fixedAnchorSize: true
        };
        const actualAnchors = (0, create_ssd_anchors_1.createSsdAnchors)(config);
        compareAnchors(actualAnchors, expectedAnchors);
    }));
    it('3 inputs reverse.', () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedAnchors = parseAnchors(yield fetch(`${test_util_2.KARMA_SERVER}/shared/anchor_golden_file_1.json`)
            .then(response => response.json()));
        const config = {
            featureMapHeight: [],
            featureMapWidth: [],
            numLayers: 6,
            minScale: 0.2,
            maxScale: 0.95,
            inputSizeHeight: 300,
            inputSizeWidth: 300,
            anchorOffsetX: 0.5,
            anchorOffsetY: 0.5,
            strides: [16, 32, 64, 128, 256, 512],
            aspectRatios: [1.0, 2.0, 0.5, 3.0, 0.3333],
            reduceBoxesInLowestLayer: true
        };
        const actualAnchors = (0, create_ssd_anchors_1.createSsdAnchors)(config);
        compareAnchors(actualAnchors, expectedAnchors);
    }));
});
