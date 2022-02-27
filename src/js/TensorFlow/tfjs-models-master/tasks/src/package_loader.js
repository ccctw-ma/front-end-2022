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
exports.PackageLoader = void 0;
const utils_1 = require("./utils");
/**
 * A loader for dynamically loading a set of packages (with dependencies) and
 * returning the global namespace variable initialized by those packages.
 *
 * @template G The type of the global namespace variable.
 */
class PackageLoader {
    /**
     * Loads the given packages and returns the loaded global namespace.
     *
     * See `TaskModelLoader.packageUrls` for more info about how to use it to
     * specify packages with dependencies.
     *
     * TODO: use a design similar to tfjs' `Platform` to provide different
     * implmentations for dynamic package loading, global, etc.
     */
    loadPackagesAndGetGlobalNamespace(namespace, packageUrls, curIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (curIndex >= packageUrls.length) {
                // tslint:disable-next-line:no-any
                const global = (0, utils_1.isWebWorker)() ? self : window;
                const globalNamespace = global[namespace];
                if (!globalNamespace) {
                    throw new Error(`Global namespace '${namespace}' not set after loading packages ${packageUrls}`);
                }
                return globalNamespace;
            }
            yield Promise.all(packageUrls[curIndex].map(name => this.loadPackage(name)));
            return this.loadPackagesAndGetGlobalNamespace(namespace, packageUrls, curIndex + 1);
        });
    }
    loadPackage(packageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Don't load a package if the package is being loaded or has already been
            // loaded.
            if (PackageLoader.promises[packageUrl]) {
                return PackageLoader.promises[packageUrl];
            }
            // From webworker.
            if ((0, utils_1.isWebWorker)()) {
                importScripts(packageUrl);
                PackageLoader.promises[packageUrl] = Promise.resolve();
            }
            // From webpage.
            else {
                const script = document.createElement('script');
                script.crossOrigin = 'anonymous';
                const promise = new Promise((resolve, reject) => {
                    script.onerror = () => {
                        reject();
                        document.head.removeChild(script);
                    };
                    script.onload = () => {
                        resolve();
                    };
                });
                document.head.appendChild(script);
                script.setAttribute('src', packageUrl);
                PackageLoader.promises[packageUrl] = promise;
            }
            return PackageLoader.promises[packageUrl];
        });
    }
}
exports.PackageLoader = PackageLoader;
PackageLoader.promises = {};
