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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationTree = void 0;
const core_1 = require("@angular/core");
const store_1 = require("@ngrx/store");
const types_1 = require("src/app/common/types");
const selectors_1 = require("src/app/store/selectors");
/**
 * The tree to show all models grouped by tasks.
 */
let NavigationTree = class NavigationTree {
    constructor(store, router) {
        this.store = store;
        this.router = router;
        this.items$ = this.store.pipe((0, store_1.select)(selectors_1.selectAllModelItems));
        this.selectedItemId$ = this.store.pipe((0, store_1.select)(selectors_1.selectSelectedModelItemId));
    }
    handleClick(item) {
        this.router.navigate([], {
            queryParams: {
                [types_1.UrlParamKey.MODEL_ITEM_ID]: item.id,
            },
            queryParamsHandling: 'merge',
        });
    }
};
NavigationTree = __decorate([
    (0, core_1.Component)({
        selector: 'navigation-tree',
        templateUrl: './navigation_tree.component.html',
        styleUrls: ['./navigation_tree.component.scss'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], NavigationTree);
exports.NavigationTree = NavigationTree;
