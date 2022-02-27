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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = require("path");
const semver = __importStar(require("semver"));
const shell = __importStar(require("shelljs"));
// Exit if any commands error.
shell.set('-e');
process.on('unhandledRejection', e => {
    throw e;
});
const dir = '.';
const dirs = fs.readdirSync(dir)
    .filter(f => fs.statSync((0, path_1.join)(dir, f)).isDirectory())
    .filter(f => !f.startsWith('.') && f !== 'node_modules');
function assertPeerDepSatisfied(peerDeps, devDeps, dependencyName, dir) {
    const peerDep = peerDeps[dependencyName];
    const devDep = devDeps[dependencyName];
    if (peerDep != null && devDep != null) {
        // Use the min version because semver.satisfies needs to compare a version
        // to a range.
        const minDevDepInPeerDepRange = semver.satisfies(semver.minVersion(devDep).version, peerDep);
        if (!minDevDepInPeerDepRange) {
            throw new Error(`devDependency version (${devDep}) does not satisfy ` +
                `peerDepency version (${peerDep}) of ${dependencyName} ` +
                `in ${dir}.`);
        }
    }
}
function assertCaretDep(depsMap, dependencyName, dir, depType) {
    const dep = depsMap[dependencyName];
    if (dep != null) {
        if (!dep.startsWith('^')) {
            throw new Error(`${depType} version (${dep}) of ${dependencyName} for ` +
                `${dir} must start with ^.`);
        }
    }
}
dirs.forEach(dir => {
    if (!fs.existsSync(`${dir}/package.json`) || dir === 'clone') {
        return;
    }
    console.log(`~~~~~~~~~~~~ Building ${dir} ~~~~~~~~~~~~`);
    shell.cd(dir);
    const pkg = JSON.parse(fs.readFileSync('package.json').toString());
    // Make sure peer dependencies and dev dependencies of tfjs match, and make
    // sure the version uses ^.
    const peerDeps = pkg.peerDependencies;
    const devDeps = pkg.devDependencies;
    assertCaretDep(peerDeps, '@tensorflow/tfjs', dir, 'peerDep');
    assertCaretDep(peerDeps, '@tensorflow/tfjs-core', dir, 'peerDep');
    assertCaretDep(peerDeps, '@tensorflow/tfjs-converter', dir, 'peerDep');
    assertCaretDep(devDeps, '@tensorflow/tfjs', dir, 'devDep');
    assertCaretDep(devDeps, '@tensorflow/tfjs-core', dir, 'devDep');
    assertCaretDep(devDeps, '@tensorflow/tfjs-converter', dir, 'devDep');
    assertPeerDepSatisfied(peerDeps, devDeps, '@tensorflow/tfjs', dir);
    assertPeerDepSatisfied(peerDeps, devDeps, '@tensorflow/tfjs-core', dir);
    assertPeerDepSatisfied(peerDeps, devDeps, '@tensorflow/tfjs-converter', dir);
    shell.cd('../');
    console.log();
    console.log();
});
