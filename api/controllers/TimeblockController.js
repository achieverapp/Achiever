'use strict'

const TimeBlock = require('../models/TimeBlockModel.js').TimeBlock;

function ResultObj(statusMsg = "", statusObj = null, success = false, id = null, data = null) { //what will be returned to the requester when the function completes
    var returnObj = {
        objId: id,
        success: success,
        statusMsg: statusMsg,
        statusObj: statusObj,
        data: data,
    };
    return returnObj;
}

exports.addTimeBlock = function (req, res) {
    var newTimeBlock = new TimeBlock(req.body);
    if (newTimeBlock.owner != null && newTimeBlock.task != null && newTimeBlock.day != null && newTimeBlock.owner != null && newTimeBlock.owner != null) {
        TimeBlock.addTimeBlock(req.app.locals.timeblocks, newTimeBlock, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid TimeBlock. Missing one or more required properties", newTimeBlock));
    }
}

//get a single task, startTIme combo
exports.getTimeBlock = function (req, res) {
    var taskStartObj = JSON.parse(req.params.taskStartObj);
    if (taskStartObj.task != null && taskStartObj.startDate != null) {
        TimeBlock.getTimeBlock(req.app.locals.timeblocks, taskStartObj, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid task-start Time combination. Missing one or more required properties", taskStartObj));
    }
}

//get all timeblocks for a certain task on a certain day
exports.getTimeBlocks = function (req, res) {
    var userDayObj = JSON.parse(req.params.userDayObj);
    if (userDayObj.owner != null && userDayObj.day != null) {
        TimeBlock.getTimeBlocks(req.app.locals.timeblocks, userDayObj, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid task-start Time combination. Missing one or more required properties", userDayObj));
    }
}

//I don't think we are going to need updateTimeBlock.
// We are probably going to need to just delete the old one and add a new one.
exports.updateTimeBlock = function (req, res) {
    var newTimeBlock = new TimeBlock(req.body);
    if (newTimeBlock._id != null && newTimeBlock.startDate != null && newTimeBlock.endDate != null) {
        TimeBlock.updateTimeBlock(req.app.locals.timeblocks, newTimeBlock, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid task-start Time combination. Missing one or more required properties", newTimeBlock));
    }
}

//delete a task, startTIme combo
exports.deleteTimeBlock = function (req, res) {
    var taskStartObj = JSON.parse(req.params.taskStartObj);
    if (taskStartObj.task != null && taskStartObj.startDate != null) {
        TimeBlock.deleteTimeBlock(req.app.locals.timeblocks, taskStartObj, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid task-start Time combination. Missing one or more required properties", taskStartObj));
    }
}