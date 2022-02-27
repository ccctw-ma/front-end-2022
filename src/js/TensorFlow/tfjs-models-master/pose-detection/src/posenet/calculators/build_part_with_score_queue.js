"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPartWithScoreQueue = void 0;
const max_heap_1 = require("./max_heap");
function scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores) {
    const [height, width] = scores.shape;
    let localMaximum = true;
    const yStart = Math.max(heatmapY - localMaximumRadius, 0);
    const yEnd = Math.min(heatmapY + localMaximumRadius + 1, height);
    for (let yCurrent = yStart; yCurrent < yEnd; ++yCurrent) {
        const xStart = Math.max(heatmapX - localMaximumRadius, 0);
        const xEnd = Math.min(heatmapX + localMaximumRadius + 1, width);
        for (let xCurrent = xStart; xCurrent < xEnd; ++xCurrent) {
            if (scores.get(yCurrent, xCurrent, keypointId) > score) {
                localMaximum = false;
                break;
            }
        }
        if (!localMaximum) {
            break;
        }
    }
    return localMaximum;
}
/**
 * Builds a priority queue with part candidate positions for a specific image in
 * the batch. For this we find all local maxima in the score maps with score
 * values above a threshold. We create a single priority queue across all parts.
 */
function buildPartWithScoreQueue(scoreThreshold, localMaximumRadius, scores) {
    const [height, width, numKeypoints] = scores.shape;
    const queue = new max_heap_1.MaxHeap(height * width * numKeypoints, ({ score }) => score);
    for (let heatmapY = 0; heatmapY < height; ++heatmapY) {
        for (let heatmapX = 0; heatmapX < width; ++heatmapX) {
            for (let keypointId = 0; keypointId < numKeypoints; ++keypointId) {
                const score = scores.get(heatmapY, heatmapX, keypointId);
                // Only consider parts with score greater or equal to threshold as
                // root candidates.
                if (score < scoreThreshold) {
                    continue;
                }
                // Only consider keypoints whose score is maximum in a local window.
                if (scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores)) {
                    queue.enqueue({ score, part: { heatmapY, heatmapX, id: keypointId } });
                }
            }
        }
    }
    return queue;
}
exports.buildPartWithScoreQueue = buildPartWithScoreQueue;
