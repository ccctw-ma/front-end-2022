"use strict";
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
const non_max_suppression_1 = require("./non_max_suppression");
function createDetection(label, score, xMin, yMin, size) {
    return {
        locationData: {
            relativeBoundingBox: {
                xMin,
                yMin,
                width: size,
                height: size,
                xMax: xMin + size,
                yMax: yMin + size
            },
        },
        label: [label],
        score: [score]
    };
}
describe('NonMaxSuppression', () => {
    it('IntersectionOverUnion.', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputDetections = [
            createDetection('obj1', 1, 0, 0, 10),
            createDetection('obj2', 1.2, 2, 2, 10),
            createDetection('obj3', 1, 15, 15, 10),
            createDetection('obj4', 2, 40, 40, 10)
        ];
        const outputDetections = yield (0, non_max_suppression_1.nonMaxSuppression)(inputDetections.slice(), 2, 0.2, 'intersection-over-union');
        expect(outputDetections.length).toBe(2);
        expect(outputDetections[0]).toBe(inputDetections[3]);
        expect(outputDetections[1]).toBe(inputDetections[1]);
    }));
});
