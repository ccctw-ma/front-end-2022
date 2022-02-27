"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileNet = exports.decodeSinglePose = exports.decodeMultiplePoses = exports.version = exports.scalePose = exports.scaleAndFlipPoses = exports.getBoundingBoxPoints = exports.getBoundingBox = exports.getAdjacentKeyPoints = exports.PoseNet = exports.load = exports.poseChain = exports.partNames = exports.partIds = exports.partChannels = void 0;
const mobilenet_1 = require("./mobilenet");
Object.defineProperty(exports, "MobileNet", { enumerable: true, get: function () { return mobilenet_1.MobileNet; } });
const decode_multiple_poses_1 = require("./multi_pose/decode_multiple_poses");
Object.defineProperty(exports, "decodeMultiplePoses", { enumerable: true, get: function () { return decode_multiple_poses_1.decodeMultiplePoses; } });
const decode_single_pose_1 = require("./single_pose/decode_single_pose");
Object.defineProperty(exports, "decodeSinglePose", { enumerable: true, get: function () { return decode_single_pose_1.decodeSinglePose; } });
var keypoints_1 = require("./keypoints");
Object.defineProperty(exports, "partChannels", { enumerable: true, get: function () { return keypoints_1.partChannels; } });
Object.defineProperty(exports, "partIds", { enumerable: true, get: function () { return keypoints_1.partIds; } });
Object.defineProperty(exports, "partNames", { enumerable: true, get: function () { return keypoints_1.partNames; } });
Object.defineProperty(exports, "poseChain", { enumerable: true, get: function () { return keypoints_1.poseChain; } });
var posenet_model_1 = require("./posenet_model");
Object.defineProperty(exports, "load", { enumerable: true, get: function () { return posenet_model_1.load; } });
Object.defineProperty(exports, "PoseNet", { enumerable: true, get: function () { return posenet_model_1.PoseNet; } });
var util_1 = require("./util");
Object.defineProperty(exports, "getAdjacentKeyPoints", { enumerable: true, get: function () { return util_1.getAdjacentKeyPoints; } });
Object.defineProperty(exports, "getBoundingBox", { enumerable: true, get: function () { return util_1.getBoundingBox; } });
Object.defineProperty(exports, "getBoundingBoxPoints", { enumerable: true, get: function () { return util_1.getBoundingBoxPoints; } });
Object.defineProperty(exports, "scaleAndFlipPoses", { enumerable: true, get: function () { return util_1.scaleAndFlipPoses; } });
Object.defineProperty(exports, "scalePose", { enumerable: true, get: function () { return util_1.scalePose; } });
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
