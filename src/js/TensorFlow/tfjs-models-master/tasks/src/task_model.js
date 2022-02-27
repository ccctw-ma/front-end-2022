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
exports.TaskModelLoader = void 0;
const package_loader_1 = require("./package_loader");
const common_1 = require("./tasks/common");
/**
 * A loader that loads a task model.
 *
 * A task model is backed by a "source model" that does the actual work, so the
 * main task of a model loader is to load this source model and "transform" it
 * into the target task model. To do that, the client that implements the
 * `TaskModelLoader` needs to:
 *
 * - Provide a set of metadata, such as model name, runtime, etc.
 *
 * - Provide package urls and global namespace name for the source model.
 *   `TaskModelLoader` will load the packages, and return the global namespace
 *   variable provided by the source model.
 *
 * - Implement the `transformSourceModel` method to load the source model using
 *   the global namespace variable from the previous step, and transform the
 *   source model to the corresponding task model.
 *
 *   To make this process more structured, each task will have a more concrete
 *   interface of `TaskModel` with the task-specific method defined. All the
 *   models under the task will transform to this interface to make sure they
 *   have the same API signature. See tasks/image_classification/common.ts for
 *   an example.
 *
 * @template N The type of the global namespace provided by the source model.
 * @template LO The type of options used during the model loading process.
 * @template M The type of the target task model to transform to.
 */
class TaskModelLoader {
    constructor() {
        /**
         * Callback to wait for (await) after all packages are loaded.
         *
         * This is necessary for models where certain conditions need to be met before
         * using the model.
         */
        this.postPackageLoadingCallback = undefined;
        /** A loader for loading packages. */
        this.packageLoader = new package_loader_1.PackageLoader();
    }
    /**
     * Loads the task model with the given options.
     *
     * @param options Options to use when loading the model.
     * @returns The loaded instance.
     */
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load the packages to get the global namespace ready.
            const sourceModelGlobal = yield this.loadSourceModelGlobalNamespace(options);
            // Wait for the callback to resolve if set.
            if (this.postPackageLoadingCallback) {
                yield this.postPackageLoadingCallback();
            }
            // For tfjs models, we automatically wait for the backend to be set before
            // proceeding. Subclasses don't need to do worry about this.
            if (this.metadata.runtime === common_1.Runtime.TFJS) {
                yield (0, common_1.ensureTFJSBackend)(options);
            }
            // Load the source model using the global namespace variable loaded above.
            return this.transformSourceModel(sourceModelGlobal, options);
        });
    }
    /**
     * Loads the global namespace of the source model by loading its packages
     * specified in the `packageUrls` field above.
     *
     * It is typically not necessary for subclasses to override this method as
     * long as they set the `packageUrls` and `sourceModelGlobalNamespace` field
     * above.
     */
    loadSourceModelGlobalNamespace(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const packages = [];
            // Add TFJS dependencies for TFJS models.
            if (this.metadata.runtime === common_1.Runtime.TFJS) {
                const tfjsOptions = options;
                packages.push(...(0, common_1.getTFJSModelDependencyPackages)(tfjsOptions ? tfjsOptions.backend : undefined));
            }
            // Load packages.
            packages.push(...this.packageUrls);
            return this.packageLoader.loadPackagesAndGetGlobalNamespace(this.sourceModelGlobalNamespace, packages);
        });
    }
    /**
     * Loads the source model and transforms it to the corresponding task model.
     *
     * A subclass should implement this method and use the
     * `sourceModelGlobalNamespace` to load the source model. Note that the
     * subclass should *NOT* use the namespace from the import statement to
     * implement this method (e.g. the "mobilenet" variable in `import * as
     * mobilenet from
     * '@tensorflow-models/mobilenet`). Instead, only `sourceModelGlobalNamespace`
     * should be used, which should have the same type as the imported namespace.
     * The imported namespace can only be used to reference types. This makes sure
     * that the code from the source model is NOT bundled in the final binary.
     */
    transformSourceModel(sourceModelGlobalNamespace, options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.TaskModelLoader = TaskModelLoader;
