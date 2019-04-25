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
        this.category = task.category == null ? null : task.category;
        this.priority = task.priority == null ? 0 : task.priority;
        this.subTasks = task.subTasks == null ? [] : task.subTasks;
        this.timeBlocks = task.timeBlocks == null ? [] : task.timeBlocks;
        this.due = task.due == null ? new Date().toISOString() : task.due;
        this.completedOn = task.completedOn == null ? null : task.completedOn;
        this.checked = task.checked == null ? false : task.checked;
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


function getCheckedTask(id, callback) {
    $.ajax({
        url: URL + "/api/tasks/" + id + "?checked=true",
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
 * Delete the serverside copy of the sent timeblock.
 * @param {*} timeblock: an object with the _id of the timeblock to delete.
 * @param {Function} callback: the function to call when the API call completes.
 */
function deleteTimeblock(timeblock, callback) {
    $.ajax({
        url: URL + '/api/timeblocks/' + JSON.stringify(timeblock),
        data: timeblock,
        method: 'DELETE',
        success: callback,
        error: errorLog,
    })
}

/**
 * Get a specific timeblock from the server based off of its task ID and start Date
 * @param timeBlock: a timeBlock object with only the task ID and start Date to check with the server.
 * @param callback: the function to call when the API call completes.
 */
function getTimeBlock(timeblock, callback) {
    var sendObj = {
        // task: timeBlock.task,
        // startDate: timeBlock.startDate
        _id: timeblock._id
    }
    $.ajax({
        url: URL + "/api/timeblocks/" + JSON.stringify(sendObj),
        data: timeblock,
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
 * Get all userAChievement on a certain day for a certain user.
 * @param userAchievement: Pass a userachievement object with the owner ID and the day that you want to get the tasks for.
 * @param callback: the function to call when the API call completes.
 */
function getUserAchievements(userAchievement, callback) {
    var sendObj = {
        owner: userAchievement.owner,
    }

    $.ajax({
        url: URL + "/api/UserAchievement/" + JSON.stringify(sendObj),
        data: userAchievement,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

/** Get all achievements from a userachievement.
 * @param Id: Pass a an id for an achievement
 * @param callback: the function to call when the API call completes.
 */
function getAchievement(id, callback) {
    $.ajax({
        url: URL + "/api/achievement/" + id,
        method: 'GET',
        success: callback,
        error: errorLog
    })
}

/**
 * Retrieve a user from the server
 * @param callback: the function to call when the API call completes.
 */
function getUser(callback) {
    $.ajax({
        url: URL + "/api/users/" + currUserId,
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

/**
 * Get all the unchecked tasks from a array of tasks
 * @param {Array<Task} tasks an array of tasks to query from 
 * @returns {Array<Task} an array of unchecked tasks
 */
function getUncheckedTasks(tasks) {
    var uncheckedTasks = [];
    tasks.forEach(function (task) {
        if (task.checked === "false" || task.checked === false) {
            uncheckedTasks.push(task);
        }
    });
    return uncheckedTasks;
}

/**
 * Get all the checked tasks from a array of tasks
 * @param {Array<Task>} tasks an array of tasks to query from 
 * @returns {Array<Task} an array of checked tasks
 */
function getCheckedTasks(tasks) {
    var checkedTasks = [];
    tasks.forEach(function (task) {
        if (task.checked === "true" || task.checked === true) {
            checkedTasks.push(task);
        }
    });
    return checkedTasks;
}

/**
 * Get a list of tasks that falls within a specified date range
 * @param {Array<Task>} tasks an array of tasks to query from
 * @param {String} dateProp the name of the date property to filter by
 * @param {Date} startDate the oldest date in the date range (inclusive)
 * @param {Date} endDate the most recent date after the range (exclusive)
 * @returns {Array<Task>} an array of tasks in the date range
 */
function getTasksInDateRange(tasks, dateProp, startDate, endDate) {
    var inRangeTasks = [];
    tasks.forEach(function (task) {
        completedOn = new Date(task[dateProp])
        if (startDate <= completedOn && completedOn < endDate) {
            inRangeTasks.push(task);
        }
    });
    return inRangeTasks
}

/**
 * Find the monday of the same week as a specified date
 * @param {Date} date the date to find the monday in the same week
 * @returns {Date} the date of monday in the week of the specified date
 */
function getMondayOfCurrentWeek(date) {
    var day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (day == 0 ? -6 : 1) - day);
}

/**
 * Get a date an offset number of days from a specific date
 * @param {Date} date date the starting date used to calculate the offset date
 * @param {Number} offset the number of days to offset the date by
 * @returns {Date} the offset date
 */
function getOffsetDate(date, offset) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset)
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// Comparison functions /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Comparison function for task Dates
 * @returns negative if the lhs is greater
 * @returns 0 if they are the same
 * @returns positive if the rhs is greater
 * @param {*} lhs: Task to compare
 * @param {*} rhs: Task to compare on the right side
 */
function compareTaskByDateAscending(lhs, rhs) {
    var lhsDate = new Date(lhs.due),
        rhsDate = new Date(rhs.due);
    if (lhs.due === rhs.due)
        return lhs.priority - rhs.priority;
    if (lhsDate > rhsDate)
        return 1;
    if (lhsDate < rhsDate)
        return -1;
    return 0;
}

/**
 * Comparison function for task Dates
 * @returns negative if the rhs is greater
 * @returns 0 if they are the same
 * @returns positive if the lhs is greater
 * @param {*} lhs: Task to compare
 * @param {*} rhs: Task to compare on the right side
 */
function compareTaskByDateDescending(lhs, rhs) {
    var lhsDate = new Date(lhs.due),
        rhsDate = new Date(rhs.due);
    if (lhs.due === rhs.due)
        return lhs.priority - rhs.priority;
    if (lhsDate > rhsDate)
        return -1;
    if (lhsDate < rhsDate)
        return 1;
    return 0;
}

/**
 * Comparison function for task priorities
 * @returns negative if the lhs is greater
 * @returns 0 if they are the same
 * @returns positive if the rhs is greater
 * @param {*} lhs: Task to compare
 * @param {*} rhs: Task to compare on the right side
 */
function compareTaskByPriorityDescending(lhs, rhs) {
    if (lhs.priority === rhs.priority)
        return compareTaskByDateAscending(lhs, rhs);
    return rhs.priority - lhs.priority;
}