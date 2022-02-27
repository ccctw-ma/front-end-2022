"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
// tslint:disable-next-line: no-imports-from-dist
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const one_euro_filter_1 = require("./one_euro_filter");
(0, jasmine_util_1.describeWithFlags)('OneEuroFilter ', jasmine_util_1.ALL_ENVS, () => {
    let oneEuroFilter;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        oneEuroFilter = new one_euro_filter_1.OneEuroFilter({
            frequency: 30.0,
            minCutOff: 15.5,
            beta: 20.2,
            derivateCutOff: 21.5,
            thresholdCutOff: 0.02,
            thresholdBeta: 0.5
        });
    }));
    it('outputs are in convex hull of inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const value0 = -1.0;
        const timestamp0 = 1;
        const value1 = 2.0;
        const timestamp1 = 15;
        const value2 = -3.0;
        const timestamp2 = 33;
        const output0 = oneEuroFilter.apply(value0, timestamp0, 1 /* valueScale */);
        expect(output0).toEqual(value0);
        const output1 = oneEuroFilter.apply(value1, timestamp1, 1 /* valueScale */);
        expect(output1).toBeLessThan(Math.max(value0, value1));
        expect(output1).toBeGreaterThan(Math.min(value0, value1));
        const output2 = oneEuroFilter.apply(value2, timestamp2, 1 /* valueScale */);
        expect(output2).toBeLessThan(Math.max(value0, value1, value2));
        expect(output2).toBeGreaterThan(Math.min(value0, value1, value2));
    }));
});
