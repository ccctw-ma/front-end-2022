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
exports.DevAppModule = exports.AppModule = void 0;
// This is needed to make media queries work in Angular zone.
require("zone.js/dist/webapis-media-query");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const router_1 = require("@angular/router");
const router_store_1 = require("@ngrx/router-store");
const store_1 = require("@ngrx/store");
const store_devtools_1 = require("@ngrx/store-devtools");
const ngrx_mediaqueries_1 = require("@yoozly/ngrx-mediaqueries");
const navigation_tree_module_1 = require("../components/navigation_tree/navigation_tree.module");
const state_1 = require("../store/state");
const app_component_1 = require("./app.component");
/** The main application module. */
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [app_component_1.AppComponent],
        imports: [
            platform_browser_1.BrowserModule,
            navigation_tree_module_1.NavigationTreeModule,
            ngrx_mediaqueries_1.NgrxMediaqueriesModule.forRoot({
                // Detect if the app is running on a small screen/area for responsive
                // design purposes. UI elements will be arranged differently on screens
                // with different sizes.
                //
                // TODO: add more (e.g. medium-screen, etc) as needed.
                'small-screen': 'screen and (max-width:600px)',
            }),
            store_1.StoreModule.forRoot(ngrx_mediaqueries_1.MERGE_REDUCERS),
            router_1.RouterModule.forRoot([
                { path: '', component: app_component_1.AppComponent },
                { path: '**', redirectTo: '' },
            ]),
            router_store_1.StoreRouterConnectingModule.forRoot(),
        ],
        providers: [
            {
                provide: ngrx_mediaqueries_1.MERGE_REDUCERS,
                useFactory: () => (Object.assign(Object.assign(Object.assign({}, state_1.appReducers), { 'router': router_store_1.routerReducer }), (0, ngrx_mediaqueries_1.ngrxMediaQueriesReducer)())),
            },
            {
                provide: core_1.APP_INITIALIZER,
                useFactory: (init) => () => init,
                deps: [ngrx_mediaqueries_1.MediaQueriesService],
                multi: true
            },
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
/**
 * The DevAppModule adds the NgRx dev tools support when running in dev
 * mode.
 *
 * Download the chrome extension that works with internal sites at:
 * go/redux-devtools
 */
let DevAppModule = class DevAppModule {
};
DevAppModule = __decorate([
    (0, core_1.NgModule)({
        imports: [
            AppModule,
            store_devtools_1.StoreDevtoolsModule.instrument({
                maxAge: 200,
                autoPause: true, // Pauses recording actions and state changes when the
                // extension window is not open
            }),
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], DevAppModule);
exports.DevAppModule = DevAppModule;
