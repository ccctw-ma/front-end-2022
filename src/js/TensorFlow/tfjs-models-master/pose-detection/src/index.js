"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movenet = exports.calculators = exports.util = exports.TrackerType = exports.createDetector = void 0;
var create_detector_1 = require("./create_detector");
Object.defineProperty(exports, "createDetector", { enumerable: true, get: function () { return create_detector_1.createDetector; } });
// Supported models enum.
__exportStar(require("./types"), exports);
var types_1 = require("./calculators/types");
Object.defineProperty(exports, "TrackerType", { enumerable: true, get: function () { return types_1.TrackerType; } });
// Second level exports.
// Utils for rendering.
const util = __importStar(require("./util"));
exports.util = util;
// General calculators.
const keypoints_to_normalized_keypoints_1 = require("./shared/calculators/keypoints_to_normalized_keypoints");
const calculators = { keypointsToNormalizedKeypoints: keypoints_to_normalized_keypoints_1.keypointsToNormalizedKeypoints };
exports.calculators = calculators;
// MoveNet model types.
const constants_1 = require("./movenet/constants");
const movenet = {
    modelType: {
        'SINGLEPOSE_LIGHTNING': constants_1.SINGLEPOSE_LIGHTNING,
        'SINGLEPOSE_THUNDER': constants_1.SINGLEPOSE_THUNDER,
        'MULTIPOSE_LIGHTNING': constants_1.MULTIPOSE_LIGHTNING
    }
};
exports.movenet = movenet;
