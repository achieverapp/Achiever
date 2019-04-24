/*
    model.js
    This file will now be used as a standardized interface to the true model backend.
*/

///////////////////////////////////////////////////////////////////////////////
/////////////////// Class Definitions for Database Schema /////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * SubTask object that is the same schema as the SubTasks stored inside a task on the API server.
 * Need to move all these into their own separate file
 */
class SubTask {
    constructor(subTask) {
        this.checked = subTask.checked == null ? false : subTask.checked;
        this.title = subTask.title == null ? false : subTask.title;
    }
}

/**
 * Task object that is the same schema as the tasks stored on the API server.
 * Need to move all these into their own separate file
 */
class Task {
    constructor(task) {
        this.owner = task.owner == null ? null : task.owner;
        this.title = task.title == null ? null : task.title;
        this.category = task.category == null ? none : task.category;;
        this.priority = task.priority == null ? 0 : task.priority;
        this.subTasks = task.subTasks == null ? [] : task.subTasks;
        this.timeBlocks = task.timeBlocks == null ? [] : task.timeBlocks;
        this.due = task.due == null ? new Date() : task.due;
    }
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// Global Variables //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const currUserId = getQueryParam('userId');
const currTaskId = getQueryParam('taskId');
const URL = location.protocol + '//' + location.host; //URL of the API server.
//console.log(location.protocol + '//' + location.host + location.pathname); //location of the URL

/**
 * Console Logging function for all js files that include model.js
 * @param data: Data that you want to be logged
 * @param status: status code that you want to be logged
 */
function errorLog(data, status) {
    console.log("ERROR!: " + status);
    console.log(data);
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// Task list interface functions /////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Retrieve all tasks for the current user from the API server
 * @param callback: the function to call when the API call completes.
 */
function getTaskList(callback) {
    $.ajax({
        url: URL + "/api/tasks/id/" + currUserId,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

/**
 * Retrieve a copy of a full task with a task ID
 * @param id: the id of the task to retrieve from the server.
 * @param callback: the function to call when the API call completes.
 */
function getTask(id, callback) {
    $.ajax({
        url: URL + "/api/tasks/" + id,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

/**
 * Update the server side copy of the sent task.
 * @param task: a Task object with any properties that you want updated.
 * @param callback: the function to call when the API call completes.
 */
function updateTask(task, callback) {
    $.ajax({
        url: URL + "/api/tasks/",
        data: task,
        method: 'PUT',
        success: callback,
        error: errorLog
    });
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// TimeBlocks interface functions /////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Add a timeblock to the database
 * @param timeBlock: a Timeblock object to be sent to the server.
 * @param callback: the function to call when the API call completes.
 */
function addTimeBlock(timeBlock, callback) {
    $.ajax({
        url: URL + "/api/timeblocks",
        data: timeBlock,
        method: 'POST',
        success: callback,
        error: errorLog
    });
}

/**
 * Update the server side copy of the sent TimeBLock.
 * @param timeBlock: a timeBlock object with any properties that you want updated.
 * @param callback: the function to call when the API call completes.
 */
function updateTimeBlock(timeBlock, callback) {
    $.ajax({
        url: URL + "/api/timeblocks",
        data: timeBlock,
        method: 'PUT',
        success: callback,
        error: errorLog
    });
}

/**
 * Get a specific timeblock from the server based off of its task ID and start Date
 * @param timeBlock: a timeBlock object with only the task ID and start Date to check with the server.
 * @param callback: the function to call when the API call completes.
 */
function getTimeBlock(timeBlock, callback) {
    var sendObj = {
        task: timeBlock.task,
        startDate: timeBlock.startDate
    }
    $.ajax({
        url: URL + "/api/timeblocks/" + JSON.stringify(sendObj),
        data: timeBlock,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

/**
 * Get all timeblocks on a certain day for a certain user.
 * @param timeBlock: Pass a timeblok object with the owner ID and the day that you want to get the tasks for.
 * @param callback: the function to call when the API call completes.
 */
function getTimeBlocks(timeBlock, callback) {
    var sendObj = {
        owner: timeBlock.owner,
        day: timeBlock.day
    }
    $.ajax({
        url: URL + "/api/timeblocks/day/" + JSON.stringify(sendObj),
        data: timeBlock,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}
///////////////////////////////////////////////////////////////////////////////
/////////////////// achievements interface functions /////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Get all timeblocks on a certain day for a certain user.
 * @param userAchievement: Pass a timeblok object with the owner ID and the day that you want to get the tasks for.
 * @param callback: the function to call when the API call completes.
 */
function getUserAchievements(userAchievement, callback)
{
    var sendObj={
        owner:userAchievement.owner,
        
    }

    $.ajax({
        url: URL + "/api/UserAchievement/" + JSON.stringify(sendObj),
        data: userachievement,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

/**
 * Retrieves parameters from the URL
 * @param sParam: Retrieve the parameter from the URL with this name
 *https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
 */
function getQueryParam(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

/**
 * Generate a timeblock object
 * @param {*} startTimeStr: a string representing the start time of the timeblock, in hh:mm format
 * @param {*} endTimeStr: a string representing the end time of the timeblock, in hh:mm format
 * @param {*} taskId: the schema id of the associated task
 */
function createTimeblockObject(startTimeStr, endTimeStr, taskId) {
    var blockDay = currentDay.toISOString().substr(0, 10);
    var start = blockDay + "T" + startTimeStr + ":00.000Z";
    var end = blockDay + "T" + endTimeStr + ":00.000Z";
    return {
        owner: currUserId,
        task: taskId,
        day: blockDay,
        startDate: start,
        endDate: end
    }
}
