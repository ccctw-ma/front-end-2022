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
const core_1 = require("@angular/core");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const app_module_1 = require("./app/app/app.module");
const environment_1 = require("./environments/environment");
// Load AppModule in productio mode.
if (environment_1.environment.production) {
    (0, core_1.enableProdMode)();
    (0, platform_browser_dynamic_1.platformBrowserDynamic)().bootstrapModule(app_module_1.AppModule).catch(err => console.error(err));
}
// Load DevAppModule in dev mode.
//
// DevAppModule has extra modules (e.g. StoreDevtoolsModule) registered for
// debugging purpose.
else {
    (0, platform_browser_dynamic_1.platformBrowserDynamic)()
        .bootstrapModule(app_module_1.DevAppModule)
        .catch(err => console.error(err));
}
