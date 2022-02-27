"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WavFileFeatureExtractor = void 0;
const audio_utils_1 = require("./utils/audio_utils");
const audio_utils_2 = require("./utils/audio_utils");
class WavFileFeatureExtractor {
    constructor() {
        // Target sample rate.
        this.targetSr = 16000;
        // How long the buffer is.
        this.bufferLength = 480;
        // How many mel bins to use.
        this.melCount = 40;
        // Number of samples to hop over for every new column.
        this.hopLength = 160;
        // How long the total duration is.
        this.duration = 1.0;
        // Whether to use MFCC or Mel features.
        this.isMfccEnabled = true;
        this.fftSize = 512;
        this.audioUtils = new audio_utils_1.AudioUtils();
    }
    config(params) {
        Object.assign(this, params);
        this.bufferCount = Math.floor((this.duration * this.targetSr - this.bufferLength) /
            this.hopLength) +
            1;
        if (this.hopLength > this.bufferLength) {
            console.error('Hop length must be smaller than buffer length.');
        }
        // The mel filterbank is actually half of the size of the number of samples,
        // since the FFT array is complex valued.
        this.fftSize = (0, audio_utils_2.nextPowerOfTwo)(this.bufferLength);
        this.melFilterbank = this.audioUtils.createMelFilterbank(this.fftSize / 2 + 1, this.melCount);
    }
    start(samples) {
        this.features = [];
        // Get buffer(s) out of the circular buffer. Note that there may be
        // multiple available, and if there are, we should get them all.
        const buffers = this.getFullBuffers(samples);
        for (const buffer of buffers) {
            // console.log(`Got buffer of length ${buffer.length}.`);
            // Extract the mel values for this new frame of audio data.
            const fft = this.audioUtils.fft(buffer);
            const fftEnergies = this.audioUtils.fftEnergies(fft);
            const melEnergies = this.audioUtils.applyFilterbank(fftEnergies, this.melFilterbank);
            const mfccs = this.audioUtils.cepstrumFromEnergySpectrum(melEnergies);
            if (this.isMfccEnabled) {
                this.features.push(mfccs);
            }
            else {
                this.features.push(melEnergies);
            }
        }
        return this.features;
    }
    stop() { }
    transform(data) {
        return data;
    }
    getFeatures() {
        return this.features;
    }
    getImages() {
        throw new Error('Method not implemented.');
    }
    /**
     * Get as many full buffers as are available in the circular buffer.
     */
    getFullBuffers(sample) {
        const out = [];
        let index = 0;
        // While we have enough data in the buffer.
        while (index <= sample.length - this.bufferLength) {
            // Get a buffer of desired size.
            const buffer = sample.slice(index, index + this.bufferLength);
            index += this.hopLength;
            out.push(buffer);
        }
        return out;
    }
}
exports.WavFileFeatureExtractor = WavFileFeatureExtractor;
