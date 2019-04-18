/*
    model.js

    This file will now be used as a standardized interface to the true model backend.
*/

// Need to find a way to get all these constructors into one file
class SubTask {
    constructor(subTask) {
        this.checked = subTask.checked == null ? false : subTask.checked;
        this.title = subTask.title == null ? false : subTask.title;
    }
}

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

const currUserId = getUrlParameter('userId');
const currTaskId = getUrlParameter('taskId');
const URL = "http://localhost:3000"; //URL of the API server.

function errorLog(data, status) {
    console.log("ERROR!: " + status);
    console.log(data);
}

// call this function with a callback to recieve all tasks for the user in the query parameter from the API
// Will return details in the response object of the callback function
// status object will return the status of the ajax call
function getTaskList(callback) {
    $.ajax({
        url: URL + "/api/tasks/id/" + currUserId,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

// call this function with a callback to recieve a task from the API
// Will return details in the response object of the callback function
// status object will return the status of the ajax call
function getTask(id, callback) {
    console.log("getTask1");
    $.ajax({
        url: URL + "/api/tasks/" + id,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

// // call this function with a callback to recieve the task in the queryparameter from the API
// // Will return details in the response object of the callback function
// // status object will return the status of the ajax call
// function getTask(callback) {
//     console.log("getTask2");
//     $.ajax({
//         url: URL + "/api/tasks/" + currTaskId,
//         method: 'GET',
//         success: callback,
//         error: errorLog
//     });
// }

function updateTask(task, callback) {
    $.ajax({
        url: URL + "/api/tasks/",
        data: task,
        method: 'PUT',
        success: callback,
        error: errorLog
    });
}

//https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
function getUrlParameter(sParam) {
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
};