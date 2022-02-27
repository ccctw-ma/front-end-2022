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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentimentDetector = void 0;
/**
 * The base class for all SentimentDetection task models.
 *
 * @template IO The type of options used during the inference process. Different
 *     models have different inference options. See individual model for more
 *     details.
 *
 * @doc {heading: 'Sentiment Detection', subheading: 'Base model'}
 */
class SentimentDetector {
    /**
     * Cleans up resources if needed.
     *
     * @doc {heading: 'Sentiment Detection', subheading: 'Base model'}
     */
    cleanUp() { }
}
exports.SentimentDetector = SentimentDetector;