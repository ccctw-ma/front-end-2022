"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filenameMsg = exports.trainingMsg = exports.labelsMsg = exports.MODEL_SHAPE = void 0;
// Load the binding
require("@tensorflow/tfjs-node");
const chalk_1 = __importDefault(require("chalk"));
const ora = __importStar(require("ora"));
const Vorpal = __importStar(require("vorpal"));
const audio_model_1 = require("./audio_model");
const dataset_1 = require("./dataset");
const wav_file_feature_extractor_1 = require("./wav_file_feature_extractor");
// tslint:disable-next-line:no-any
global.AudioContext = class AudioContext {
};
exports.MODEL_SHAPE = [98, 40, 1];
exports.labelsMsg = [
    { type: 'input', name: 'labels', message: 'Enter labels (seperate by comma)' }
];
exports.trainingMsg = [
    { type: 'input', name: 'dir', message: 'Enter file directory' },
    { type: 'input', name: 'label', message: 'Enter label for the directory' }
];
exports.filenameMsg = [{
        type: 'input',
        name: 'filename',
        message: 'Enter target filename for the model'
    }];
let model;
let labels;
const vorpal = new Vorpal();
let spinner = ora();
vorpal.command('create_model [labels...]')
    .alias('c')
    .description('create the audio model')
    .action((args, cb) => {
    console.log(args.labels);
    labels = args.labels;
    model = new audio_model_1.AudioModel(exports.MODEL_SHAPE, labels, new dataset_1.Dataset(labels.length), new wav_file_feature_extractor_1.WavFileFeatureExtractor());
    cb();
});
vorpal
    .command('load_dataset all <dir>', 'Load all the data from the root directory by the labels')
    .alias('la')
    .action((args) => {
    spinner.start('load dataset ...');
    return model
        .loadAll(args.dir, (text, finished) => {
        if (finished) {
            spinner.succeed(text);
        }
        else {
            spinner.start();
            spinner.text = text;
            spinner.render();
        }
    })
        .then(() => spinner.stop());
});
vorpal
    .command('load_dataset <dir> <label>', 'Load the dataset from the directory with the label')
    .alias('l')
    .action((args) => {
    spinner = ora('creating tensors ...');
    spinner.start();
    return model
        .loadData(args.dir, args.label, (text) => {
        // console.log(text);
        spinner.text = text;
        spinner.render();
    })
        .then(() => spinner.stop(), (err) => {
        spinner.fail(`failed to load: ${err}`);
    });
});
vorpal.command('dataset size', 'Show the size of the dataset')
    .alias('d')
    .action((args, cb) => {
    console.log(chalk_1.default.green(`dataset size = ${model.size()}`));
    cb();
});
vorpal.command('train [epoch]')
    .alias('t')
    .description('train all audio dataset')
    .action((args) => {
    spinner = ora('training models ...').start();
    return model
        .train(parseInt(args.epoch, 10) || 20, {
        onBatchEnd: (batch, logs) => __awaiter(void 0, void 0, void 0, function* () {
            spinner.text = chalk_1.default.green(`loss: ${logs.loss.toFixed(5)}`);
            spinner.render();
        }),
        onEpochEnd: (epoch, logs) => __awaiter(void 0, void 0, void 0, function* () {
            spinner.succeed(chalk_1.default.green(`epoch: ${epoch}, loss: ${logs.loss.toFixed(5)}` +
                `, accuracy: ${logs.acc.toFixed(5)}` +
                `, validation accuracy: ${logs.val_acc.toFixed(5)}`));
            spinner.start();
        })
    })
        .then(() => spinner.stop());
});
vorpal.command('save_model <filename>')
    .alias('s')
    .description('save the audio model')
    .action((args) => {
    spinner.start(`saving to ${args.filename} ...`);
    return model.save(args.filename).then(() => {
        spinner.succeed(`${args.filename} saved.`);
    }, () => spinner.fail(`failed to save ${args.filename}`));
});
vorpal.show();
