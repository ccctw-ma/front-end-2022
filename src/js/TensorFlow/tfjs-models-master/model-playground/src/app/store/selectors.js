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
exports.selectSelectedModelItemId = exports.selectAllModelItems = void 0;
const router_store_1 = require("@ngrx/router-store");
const store_1 = require("@ngrx/store");
const types_1 = require("../common/types");
const selectRouter = (0, store_1.createFeatureSelector)('router');
const selectQueryParams = (0, router_store_1.getSelectors)(selectRouter).selectQueryParams;
/** Selector to select all model items. */
const selectAllModelItems = (state) => {
    return state.allModelItems;
};
exports.selectAllModelItems = selectAllModelItems;
/** Selector to select the id of the currently selected model item from URL. */
exports.selectSelectedModelItemId = (0, store_1.createSelector)(selectQueryParams, (params) => {
    if (!params) {
        return '';
    }
    return params[types_1.UrlParamKey.MODEL_ITEM_ID];
});
