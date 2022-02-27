"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODELS = exports.SUPPRESSION_TIME = exports.DETECTION_THRESHOLD = exports.MIN_SAMPLE = exports.IS_MFCC_ENABLED = exports.DURATION = exports.EXAMPLE_SR = exports.MEL_COUNT = exports.HOP_LENGTH = exports.BUFFER_LENGTH = exports.ModelType = void 0;
var ModelType;
(function (ModelType) {
    ModelType[ModelType["FROZEN_MODEL"] = 0] = "FROZEN_MODEL";
    ModelType[ModelType["FROZEN_MODEL_NATIVE"] = 1] = "FROZEN_MODEL_NATIVE";
    ModelType[ModelType["TF_MODEL"] = 2] = "TF_MODEL";
})(ModelType = exports.ModelType || (exports.ModelType = {}));
exports.BUFFER_LENGTH = 1024;
exports.HOP_LENGTH = 444;
exports.MEL_COUNT = 40;
exports.EXAMPLE_SR = 44100;
exports.DURATION = 1.0;
exports.IS_MFCC_ENABLED = true;
exports.MIN_SAMPLE = 3;
exports.DETECTION_THRESHOLD = 0.5;
exports.SUPPRESSION_TIME = 500;
exports.MODELS = {};
