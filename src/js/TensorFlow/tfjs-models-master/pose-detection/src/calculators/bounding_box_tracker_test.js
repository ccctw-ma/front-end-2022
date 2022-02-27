"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bounding_box_tracker_1 = require("./bounding_box_tracker");
describe('Bounding box tracker', () => {
    const trackerConfig = {
        maxTracks: 4,
        maxAge: 1000,
        minSimilarity: 0.5,
        boundingBoxTrackerParams: {}
    };
    it('Instantiate tracker', () => {
        const bboxTracker = new bounding_box_tracker_1.BoundingBoxTracker(trackerConfig);
        expect(bboxTracker instanceof bounding_box_tracker_1.BoundingBoxTracker).toBe(true);
    });
    it('Compute IoU', () => {
        const bboxTracker = new bounding_box_tracker_1.BoundingBoxTracker(trackerConfig);
        const pose = {
            keypoints: [],
            box: {
                yMin: 0.0,
                xMin: 0.0,
                yMax: 1.0,
                xMax: 2 / 3,
                width: 2 / 3,
                height: 1.0
            }
        };
        const track = {
            id: 0,
            lastTimestamp: 1000000,
            keypoints: [],
            box: {
                yMin: 0.0,
                xMin: 1 / 3,
                yMax: 1.0,
                xMax: 1.0,
                width: 2 / 3,
                height: 1.0
            }
        };
        const computedIoU = bboxTracker['iou'](pose, track);
        expect(computedIoU).toBeCloseTo(1 / 3, 6);
    });
    it('Compute IoU with full overlap', () => {
        const bboxTracker = new bounding_box_tracker_1.BoundingBoxTracker(trackerConfig);
        const pose = {
            keypoints: [],
            box: { yMin: 0.0, xMin: 0.0, yMax: 1.0, xMax: 1.0, width: 1.0, height: 1.0 }
        };
        const track = {
            id: 0,
            lastTimestamp: 1000000,
            keypoints: [],
            box: { yMin: 0.0, xMin: 0.0, yMax: 1.0, xMax: 1.0, width: 1.0, height: 1.0 }
        };
        const computedIoU = bboxTracker['iou'](pose, track);
        expect(computedIoU).toBeCloseTo(1.0, 6);
    });
    it('Compute IoU with no intersection', () => {
        const bboxTracker = new bounding_box_tracker_1.BoundingBoxTracker(trackerConfig);
        const pose = {
            keypoints: [],
            box: { yMin: 0.0, xMin: 0.0, yMax: 0.5, xMax: 0.5, width: 0.5, height: 0.5 }
        };
        const track = {
            id: 0,
            lastTimestamp: 1000000,
            keypoints: [],
            box: { yMin: 0.5, xMin: 0.5, yMax: 1.0, xMax: 1.0, width: 0.5, height: 0.5 }
        };
        const computedIoU = bboxTracker['iou'](pose, track);
        expect(computedIoU).toBeCloseTo(0.0, 6);
    });
    it('Apply bounding box tracker', () => {
        // Timestamp: 0. Poses becomes the first two tracks.
        const bboxTracker = new bounding_box_tracker_1.BoundingBoxTracker(trackerConfig);
        let tracks;
        let poses = [
            {
                // Becomes track 1.
                keypoints: [],
                box: {
                    yMin: 0.0,
                    xMin: 0.0,
                    yMax: 0.5,
                    xMax: 0.5,
                    width: 0.5,
                    height: 0.5
                }
            },
            {
                // Becomes track 2.
                keypoints: [],
                box: {
                    yMin: 0.0,
                    xMin: 0.0,
                    yMax: 1.0,
                    xMax: 1.0,
                    width: 1.0,
                    height: 1.0
                }
            }
        ];
        poses = bboxTracker.apply(poses, 0);
        tracks = bboxTracker.getTracks();
        expect(poses.length).toEqual(2);
        expect(poses[0].id).toEqual(1);
        expect(poses[1].id).toEqual(2);
        expect(tracks.length).toEqual(2);
        expect(tracks[0].id).toEqual(1);
        expect(tracks[0].lastTimestamp).toEqual(0);
        expect(tracks[1].id).toEqual(2);
        expect(tracks[1].lastTimestamp).toEqual(0);
        // Timestamp: 100000. First pose is linked with track 1. Second pose spawns
        // a new track (id = 2).
        poses = [
            {
                // Linked with track 1.
                keypoints: [],
                box: {
                    yMin: 0.1,
                    xMin: 0.1,
                    yMax: 0.5,
                    xMax: 0.5,
                    width: 0.4,
                    height: 0.4
                }
            },
            {
                // Becomes track 3.
                keypoints: [],
                box: {
                    yMin: 0.3,
                    xMin: 0.2,
                    yMax: 0.9,
                    xMax: 0.9,
                    width: 0.7,
                    height: 0.6
                }
            }
        ];
        poses = bboxTracker.apply(poses, 100000);
        tracks = bboxTracker.getTracks();
        expect(poses.length).toEqual(2);
        expect(poses[0].id).toEqual(1);
        expect(poses[1].id).toEqual(3);
        expect(tracks.length).toEqual(3);
        expect(tracks[0].id).toEqual(1);
        expect(tracks[0].lastTimestamp).toEqual(100000);
        expect(tracks[1].id).toEqual(3);
        expect(tracks[1].lastTimestamp).toEqual(100000);
        expect(tracks[2].id).toEqual(2);
        expect(tracks[2].lastTimestamp).toEqual(0);
        // Timestamp: 1050000. First pose is linked with track 1. Second pose is
        // identical to track 2, but is not linked because track 2 is deleted due to
        // age. Instead it spawns track 4.
        poses = [
            {
                // Linked with track 1.
                keypoints: [],
                box: {
                    yMin: 0.1,
                    xMin: 0.1,
                    yMax: 0.5,
                    xMax: 0.55,
                    width: 0.4,
                    height: 0.45
                }
            },
            {
                // Becomes track 4.
                keypoints: [],
                box: {
                    yMin: 0.0,
                    xMin: 0.0,
                    yMax: 1.0,
                    xMax: 1.0,
                    width: 1.0,
                    height: 1.0
                }
            }
        ];
        poses = bboxTracker.apply(poses, 1050000);
        tracks = bboxTracker.getTracks();
        expect(poses.length).toEqual(2);
        expect(poses[0].id).toEqual(1);
        expect(poses[1].id).toEqual(4);
        expect(tracks.length).toEqual(3);
        expect(tracks[0].id).toEqual(1);
        expect(tracks[0].lastTimestamp).toEqual(1050000);
        expect(tracks[1].id).toEqual(4);
        expect(tracks[1].lastTimestamp).toEqual(1050000);
        expect(tracks[2].id).toEqual(3);
        expect(tracks[2].lastTimestamp).toEqual(100000);
    });
});
