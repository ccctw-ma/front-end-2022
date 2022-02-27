"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keypointsToNormalizedKeypoints = void 0;
function keypointsToNormalizedKeypoints(keypoints, imageSize) {
    return keypoints.map(keypoint => {
        const normalizedKeypoint = Object.assign(Object.assign({}, keypoint), { x: keypoint.x / imageSize.width, y: keypoint.y / imageSize.height });
        if (keypoint.z != null) {
            // Scale z the same way as x (using image width).
            keypoint.z = keypoint.z / imageSize.width;
        }
        return normalizedKeypoint;
    });
}
exports.keypointsToNormalizedKeypoints = keypointsToNormalizedKeypoints;
