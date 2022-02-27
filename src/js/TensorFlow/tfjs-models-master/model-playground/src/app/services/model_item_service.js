"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelItemService = void 0;
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
const core_1 = require("@angular/core");
const mobilenet_tfjs_1 = require("../models/image_classification/mobilenet_tfjs");
const mobilenet_tflite_1 = require("../models/image_classification/mobilenet_tflite");
const cocossd_tfjs_1 = require("../models/object_detection/cocossd_tfjs");
const actions_1 = require("../store/actions");
/**
 * Service for model item related tasks.
 */
let ModelItemService = class ModelItemService {
    constructor(store) {
        this.store = store;
    }
    /** Registers all model items. */
    registerAllModelItems() {
        this.store.dispatch((0, actions_1.addModelItemsFromInit)({
            items: [
                new mobilenet_tfjs_1.MobileNetTfjs(),
                new mobilenet_tflite_1.MobileNetTfLite(),
                new cocossd_tfjs_1.CocoSsdTfjs(),
            ]
        }));
    }
};
ModelItemService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], ModelItemService);
exports.ModelItemService = ModelItemService;
