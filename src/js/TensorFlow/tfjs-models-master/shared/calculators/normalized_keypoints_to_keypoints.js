"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizedKeypointsToKeypoints = void 0;
function normalizedKeypointsToKeypoints(normalizedKeypoints, imageSize) {
    return normalizedKeypoints.map(normalizedKeypoint => {
        const keypoint = Object.assign(Object.assign({}, normalizedKeypoint), { x: normalizedKeypoint.x * imageSize.width, y: normalizedKeypoint.y * imageSize.height });
        if (normalizedKeypoint.z != null) {
            // Scale z the same way as x (using image width).
            keypoint.z = normalizedKeypoint.z * imageSize.width;
        }
        return keypoint;
    });
}
exports.normalizedKeypointsToKeypoints = normalizedKeypointsToKeypoints;
