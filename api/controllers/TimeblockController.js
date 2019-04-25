/* CptS 489, Spring 2019
    Project: Task Tracker
    TimeblockController.js
*/
'use strict'

const TimeBlock = require('../models/TimeBlockModel.js').TimeBlock;

/**
 * Constructor function for a result Object. Allows fast creation of a return object for an API response.
 *
 * The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
 * @param {string} statusMsg: Message that gives more detail on the result of the call.
 * @param {Object} statusObj: Object containing details about errors if there is an error
 * @param {boolean} success: Status of the API call
 * @param {string} id: ID of the object affected
 * @param {Object} data: data that can be read from the reciever
 */
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

/**
 * Calls the model's add time block function.
 * Checks to ensure that all needed properties are included. Will return an error if data is missing
 */
exports.addTimeBlock = function (req, res) {
    var newTimeBlock = new TimeBlock(req.body);
    if (newTimeBlock.owner != null && newTimeBlock.task != null && newTimeBlock.day != null && newTimeBlock.startDate != null && newTimeBlock.endDate != null) {
        TimeBlock.addTimeBlock(req.app.locals.timeblocks, newTimeBlock, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid TimeBlock. Missing one or more required properties", newTimeBlock));
    }
}

/**
 * Gets a single timeblock with the task ID and startDate as the key.
 * Calls the getTimeBlock model function
 * TODO: Need to change this to get a timeblock based on timeblock ID
 * Checks to ensure that all needed properties are included. Will return an error if data is missing
 */
exports.getTimeBlock = function (req, res) {
    var queryObj = JSON.parse(req.params.queryObj);
    //if (queryObj.task != null && queryObj.startDate != null) {
    if(queryObj._id != null) {
        TimeBlock.getTimeBlock(req.app.locals.timeblocks, queryObj, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid task-start Time combination. Missing one or more required properties", queryObj));
    }
}

/**
 * Gets all timeblocks for a user on a certain day.
 * Calls the getTimeBLocks model function
 * Checks to ensure that all needed properties are included. Will return an error if data is missing
 */
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

/**
 * Updates a timeblock with a certain ID
 * Calls the updateTimeBlock model function
 * Checks to ensure that all needed properties are included. Will return an error if data is missing
 */
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

/**
 * Deletes a timeblock with a certain ID
 * Calls the deleteTimeBlock model function
 * Checks to ensure that all needed properties are included. Will return an error if data is missing
 */
exports.deleteTimeBlock = function (req, res) {
    var queryObj = JSON.parse(req.params.queryObj);
    if (queryObj._id != null) {
        TimeBlock.deleteTimeBlock(req.app.locals.timeblocks, queryObj, function (result) {
            res.json(result);
        });
    } else {
        res.json(ResultObj("Invalid task-start Time combination. Missing one or more required properties", queryObj));
    }
}