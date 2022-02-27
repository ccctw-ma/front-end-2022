"use strict";
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
exports.decodePersonInstancePartMasks = exports.decodePersonInstanceMasks = exports.toPersonKPartSegmentation = exports.toPersonKSegmentation = void 0;
const tf = __importStar(require("@tensorflow/tfjs-core"));
const tfjs_core_1 = require("@tensorflow/tfjs-core");
const decode_multiple_masks_cpu_1 = require("./decode_multiple_masks_cpu");
const decode_multiple_masks_webgl_1 = require("./decode_multiple_masks_webgl");
function toPersonKSegmentation(segmentation, k) {
    return tf.tidy(() => tf.cast(tf.equal(segmentation, tf.scalar(k)), 'int32'));
}
exports.toPersonKSegmentation = toPersonKSegmentation;
function toPersonKPartSegmentation(segmentation, bodyParts, k) {
    return tf.tidy(() => tf.sub(tf.mul(tf.cast(tf.equal(segmentation, tf.scalar(k)), 'int32'), tf.add(bodyParts, 1)), 1));
}
exports.toPersonKPartSegmentation = toPersonKPartSegmentation;
function isWebGlBackend() {
    return (0, tfjs_core_1.getBackend)() === 'webgl';
}
function decodePersonInstanceMasks(segmentation, longOffsets, poses, height, width, stride, [inHeight, inWidth], padding, minPoseScore = 0.2, refineSteps = 8, minKeypointScore = 0.3, maxNumPeople = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        // Filter out poses with smaller score.
        const posesAboveScore = poses.filter(pose => pose.score >= minPoseScore);
        let personSegmentationsData;
        if (isWebGlBackend()) {
            const personSegmentations = tf.tidy(() => {
                const masksTensorInfo = (0, decode_multiple_masks_webgl_1.decodeMultipleMasksWebGl)(segmentation, longOffsets, posesAboveScore, height, width, stride, [inHeight, inWidth], padding, refineSteps, minKeypointScore, maxNumPeople);
                const masksTensor = tf.engine().makeTensorFromDataId(masksTensorInfo.dataId, masksTensorInfo.shape, masksTensorInfo.dtype);
                return posesAboveScore.map((_, k) => toPersonKSegmentation(masksTensor, k));
            });
            personSegmentationsData =
                (yield Promise.all(personSegmentations.map(mask => mask.data())));
            personSegmentations.forEach(x => x.dispose());
        }
        else {
            const segmentationsData = yield segmentation.data();
            const longOffsetsData = yield longOffsets.data();
            personSegmentationsData = (0, decode_multiple_masks_cpu_1.decodeMultipleMasksCPU)(segmentationsData, longOffsetsData, posesAboveScore, height, width, stride, [inHeight, inWidth], padding, refineSteps);
        }
        return personSegmentationsData.map((data, i) => ({ data, pose: posesAboveScore[i], width, height }));
    });
}
exports.decodePersonInstanceMasks = decodePersonInstanceMasks;
function decodePersonInstancePartMasks(segmentation, longOffsets, partSegmentation, poses, height, width, stride, [inHeight, inWidth], padding, minPoseScore = 0.2, refineSteps = 8, minKeypointScore = 0.3, maxNumPeople = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        const posesAboveScore = poses.filter(pose => pose.score >= minPoseScore);
        let partSegmentationsByPersonData;
        if (isWebGlBackend()) {
            const partSegmentations = tf.tidy(() => {
                const masksTensorInfo = (0, decode_multiple_masks_webgl_1.decodeMultipleMasksWebGl)(segmentation, longOffsets, posesAboveScore, height, width, stride, [inHeight, inWidth], padding, refineSteps, minKeypointScore, maxNumPeople);
                const masksTensor = tf.engine().makeTensorFromDataId(masksTensorInfo.dataId, masksTensorInfo.shape, masksTensorInfo.dtype);
                return posesAboveScore.map((_, k) => toPersonKPartSegmentation(masksTensor, partSegmentation, k));
            });
            partSegmentationsByPersonData =
                (yield Promise.all(partSegmentations.map(x => x.data())));
            partSegmentations.forEach(x => x.dispose());
        }
        else {
            const segmentationsData = yield segmentation.data();
            const longOffsetsData = yield longOffsets.data();
            const partSegmentaionData = yield partSegmentation.data();
            partSegmentationsByPersonData = (0, decode_multiple_masks_cpu_1.decodeMultiplePartMasksCPU)(segmentationsData, longOffsetsData, partSegmentaionData, posesAboveScore, height, width, stride, [inHeight, inWidth], padding, refineSteps);
        }
        return partSegmentationsByPersonData.map((data, k) => ({ pose: posesAboveScore[k], data, height, width }));
    });
}
exports.decodePersonInstancePartMasks = decodePersonInstancePartMasks;
