"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllModelLoaders = exports.getModelLoadersByRuntime = exports.QuestionAndAnswer = exports.NLClassification = exports.SentimentDetection = exports.ImageSegmentation = exports.ObjectDetection = exports.ImageClassification = exports.modelIndex = void 0;
const common_1 = require("./common");
const custom_model_tflite_1 = require("./image_classification/custom_model_tflite");
const mobilenet_tfjs_1 = require("./image_classification/mobilenet_tfjs");
const mobilenet_tflite_1 = require("./image_classification/mobilenet_tflite");
const custom_model_tflite_2 = require("./image_segmentation/custom_model_tflite");
const deeplab_tfjs_1 = require("./image_segmentation/deeplab_tfjs");
const deeplab_tflite_1 = require("./image_segmentation/deeplab_tflite");
const custom_model_tflite_3 = require("./nl_classification/custom_model_tflite");
const cocossd_tfjs_1 = require("./object_detection/cocossd_tfjs");
const cocossd_tflite_1 = require("./object_detection/cocossd_tflite");
const custom_model_tflite_4 = require("./object_detection/custom_model_tflite");
const bert_qa_tfjs_1 = require("./question_and_answer/bert_qa_tfjs");
const bert_qa_tflite_1 = require("./question_and_answer/bert_qa_tflite");
const custom_model_tflite_5 = require("./question_and_answer/custom_model_tflite");
const movie_review_tflite_1 = require("./sentiment_detection/movie_review_tflite");
const toxicity_tfjs_1 = require("./sentiment_detection/toxicity_tfjs");
/**
 * The main model index.
 *
 * The index structure is: {task_name}.{model_name}.{runtime}
 *
 * Note that it is possible to programmatically generate the index from a list
 * of loaders, but it would mean that we need to define a generic type for
 * each level of the index structure (e.g. {[taskName: string]: TaskModels}).
 * This will not work well for the auto-complete system in IDEs because
 * typescript doesn't know the candidates to show from the generic types.
 *
 * For this reason, we chose to create the index manually like below. In this
 * way, typescript will infer the types based on the content statically, and
 * correctly show the candidates when doing auto-complete.
 *
 * TODO: add test to make sure loaders are located in the correct index entries.
 */
exports.modelIndex = {
    [common_1.Task.IMAGE_CLASSIFICATION]: {
        MobileNet: {
            [common_1.Runtime.TFJS]: mobilenet_tfjs_1.mobilenetTfjsLoader,
            [common_1.Runtime.TFLITE]: mobilenet_tflite_1.mobilenetTfliteLoader,
        },
        CustomModel: {
            [common_1.Runtime.TFLITE]: custom_model_tflite_1.imageClassificationCustomModelTfliteLoader,
        },
    },
    [common_1.Task.OBJECT_DETECTION]: {
        CocoSsd: {
            [common_1.Runtime.TFJS]: cocossd_tfjs_1.cocoSsdTfjsLoader,
            [common_1.Runtime.TFLITE]: cocossd_tflite_1.cocoSsdTfliteLoader,
        },
        CustomModel: {
            [common_1.Runtime.TFLITE]: custom_model_tflite_4.objectDetectorCustomModelTfliteLoader,
        },
    },
    [common_1.Task.IMAGE_SEGMENTATION]: {
        Deeplab: {
            [common_1.Runtime.TFJS]: deeplab_tfjs_1.deeplabTfjsLoader,
            [common_1.Runtime.TFLITE]: deeplab_tflite_1.deeplabTfliteLoader,
        },
        CustomModel: {
            [common_1.Runtime.TFLITE]: custom_model_tflite_2.imageSegmenterCustomModelTfliteLoader,
        },
    },
    [common_1.Task.SENTIMENT_DETECTION]: {
        MovieReview: {
            [common_1.Runtime.TFLITE]: movie_review_tflite_1.movieReviewTfliteLoader,
        },
        Toxicity: {
            [common_1.Runtime.TFJS]: toxicity_tfjs_1.toxicityTfjsLoader,
        }
    },
    [common_1.Task.NL_CLASSIFICATION]: {
        CustomModel: {
            [common_1.Runtime.TFLITE]: custom_model_tflite_3.nlClassifierCustomModelTfliteLoader,
        },
    },
    [common_1.Task.QUESTION_AND_ANSWER]: {
        BertQA: {
            [common_1.Runtime.TFJS]: bert_qa_tfjs_1.bertQaTfjsLoader,
            [common_1.Runtime.TFLITE]: bert_qa_tflite_1.bertQaTfliteLoader,
        },
        CustomModel: {
            [common_1.Runtime.TFLITE]: custom_model_tflite_5.qaCustomModelTfliteLoader,
        }
    },
};
// Export each task individually.
// tslint:disable:variable-name
exports.ImageClassification = exports.modelIndex[common_1.Task.IMAGE_CLASSIFICATION];
// tslint:disable:variable-name
exports.ObjectDetection = exports.modelIndex[common_1.Task.OBJECT_DETECTION];
// tslint:disable:variable-name
exports.ImageSegmentation = exports.modelIndex[common_1.Task.IMAGE_SEGMENTATION];
// tslint:disable:variable-name
exports.SentimentDetection = exports.modelIndex[common_1.Task.SENTIMENT_DETECTION];
// tslint:disable:variable-name
exports.NLClassification = exports.modelIndex[common_1.Task.NL_CLASSIFICATION];
// tslint:disable:variable-name
exports.QuestionAndAnswer = exports.modelIndex[common_1.Task.QUESTION_AND_ANSWER];
/**
 * Filter model loaders by runtimes.
 *
 * A model loader will be returned if its runtime matches any runtime in the
 * given array.
 */
function getModelLoadersByRuntime(runtimes) {
    return filterModelLoaders((loader) => runtimes.includes(loader.metadata.runtime));
}
exports.getModelLoadersByRuntime = getModelLoadersByRuntime;
/** Gets all model loaders from the index. */
function getAllModelLoaders() {
    const modelLoaders = [];
    for (const task of Object.keys(exports.modelIndex)) {
        // tslint:disable-next-line:no-any
        const models = exports.modelIndex[task];
        for (const modelName of Object.keys(models)) {
            const runtimes = models[modelName];
            for (const runtime of Object.keys(runtimes)) {
                const taskModel = runtimes[runtime];
                modelLoaders.push(taskModel);
            }
        }
    }
    return modelLoaders;
}
exports.getAllModelLoaders = getAllModelLoaders;
function filterModelLoaders(filterFn) {
    const filteredModelLoaders = [];
    for (const modelLoader of getAllModelLoaders()) {
        if (filterFn(modelLoader)) {
            filteredModelLoaders.push(modelLoader);
        }
    }
    return filteredModelLoaders;
}
// TODO: add more util functions as needed.
