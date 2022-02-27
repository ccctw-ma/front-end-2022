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
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
describe('Toxicity classifier util', () => {
    it('should pad inputs of different lengths', () => {
        const inputs = [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5]];
        expect(inputs.map(d => (0, util_1.padInput)(d))).toEqual([
            [1, 2, 3, 0], [1, 2, 3, 4], [1, 2, 3, 4, 5, 0, 0, 0]
        ]);
    });
});