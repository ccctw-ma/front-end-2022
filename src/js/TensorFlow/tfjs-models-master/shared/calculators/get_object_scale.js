"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectScale = void 0;
/**
 * Estimate object scale to allow filter work similarly on nearer or futher
 * objects.
 * @param roi Normalized rectangle.
 * @param imageSize An object that contains width and height.
 * @returns A number representing the object scale.
 */
function getObjectScale(roi, imageSize) {
    const objectWidth = roi.width * imageSize.width;
    const objectHeight = roi.height * imageSize.height;
    return (objectWidth + objectHeight) / 2;
}
exports.getObjectScale = getObjectScale;
