"use strict";
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
exports.tensorsToLandmarks = void 0;
const sigmoid_1 = require("./sigmoid");
function applyActivation(activation, value) {
    return activation === 'none' ? value : (0, sigmoid_1.sigmoid)(value);
}
/**
 * A calculator for converting Tensors from regression models into landmarks.
 * Note that if the landmarks in the tensor has more than 5 dimensions, only the
 * first 5 dimensions will be converted to [x,y,z, visibility, presence]. The
 * latter two fields may also stay unset if such attributes are not supported in
 * the model.
 * @param landmarkTensor List of Tensors of type float32. Only the first tensor
 * will be used. The size of the values must be (num_dimension x num_landmarks).
 * @param flipHorizontally Optional. Whether to flip landmarks horizontally or
 * not. Overrides corresponding field in config.
 * @param flipVertically Optional. Whether to flip landmarks vertically or not.
 * Overrides corresponding field in config.
 *
 * @param config
 *
 * @returns Normalized landmarks.
 */
function tensorsToLandmarks(landmarkTensor, config, flipHorizontally, flipVertically) {
    return __awaiter(this, void 0, void 0, function* () {
        flipHorizontally = flipHorizontally || config.flipHorizontally || false;
        flipVertically = flipVertically || config.flipVertically || false;
        const numValues = landmarkTensor.size;
        const numDimensions = numValues / config.numLandmarks;
        const rawLandmarks = yield landmarkTensor.data();
        const outputLandmarks = [];
        for (let ld = 0; ld < config.numLandmarks; ++ld) {
            const offset = ld * numDimensions;
            const landmark = { x: 0, y: 0 };
            if (flipHorizontally) {
                landmark.x = config.inputImageWidth - rawLandmarks[offset];
            }
            else {
                landmark.x = rawLandmarks[offset];
            }
            if (numDimensions > 1) {
                if (flipVertically) {
                    landmark.y = config.inputImageHeight - rawLandmarks[offset + 1];
                }
                else {
                    landmark.y = rawLandmarks[offset + 1];
                }
            }
            if (numDimensions > 2) {
                landmark.z = rawLandmarks[offset + 2];
            }
            if (numDimensions > 3) {
                landmark.score = applyActivation(config.visibilityActivation, rawLandmarks[offset + 3]);
            }
            // presence is in rawLandmarks[offset + 4], we don't expose it.
            outputLandmarks.push(landmark);
        }
        for (let i = 0; i < outputLandmarks.length; ++i) {
            const landmark = outputLandmarks[i];
            landmark.x = landmark.x / config.inputImageWidth;
            landmark.y = landmark.y / config.inputImageHeight;
            // Scale Z coordinate as X + allow additional uniform normalization.
            landmark.z = landmark.z / config.inputImageWidth / (config.normalizeZ || 1);
        }
        return outputLandmarks;
    });
}
exports.tensorsToLandmarks = tensorsToLandmarks;
