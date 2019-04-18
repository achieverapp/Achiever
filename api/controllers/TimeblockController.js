'use strict'

const TimeBlock = require('../models/TimeBlockModel.js').TimeBlock;

exports.addTimeBlock = function (req, res) {
    var newTimeBlock = new TimeBlock(req.body);
    TimeBlock.addTimeBlock(req.app.locals.TimeBlocks, newTimeBlock, function (result) {
        res.json(result);
    });
};

exports.getTimeBlock = function (req, res) {
    TimeBlock.getTimeBlock(req.app.locals.TimeBlocks, req.params.id, function (result) {
        res.json(result);
    });
}

exports.updateTimeBlock = function (req, res) {
    var newTimeBlock = new TimeBlock(req.body);
    TimeBlock.updateTimeBlock(req.app.locals.TimeBlocks, newTimeBlock, function (result) {
        res.json(result);
    });
}

exports.deleteTimeBlock = function (req, res) {
    TimeBlock.deleteTimeBlock(req.app.locals.TimeBlocks, req.params.id, function (result) {
        res.json(result);
    });
}