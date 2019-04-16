// import { rejects } from "assert";

/*
    model.js

    This file will now be used as a standardized interface to the true model backend    
*/
const currUserId = getUrlParameter('userId');
const currTaskId = getUrlParameter('taskId');
const URL = "http://localhost:3000"; //URL of the API server.

console.log(currUserId);

function errorLog(data, status) {
    console.log("ERROR!: " + status);
    console.log(data);
}

function getTaskList(callback) {
    $.ajax({
        url: URL + "/tasks/id/" + currUserId,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

// returns a Promise that contains the result of the API call
function getTask(id, callback) {
    $.ajax({
        url: URL + "/tasks/" + id,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

// returns a Promise that contains the result of the API call
function getTask(callback) {
    $.ajax({
        url: URL + "/tasks/" + currTaskId,
        method: 'GET',
        success: callback,
        error: errorLog
    });
}

function updateTask(task) {
    var i = 0;
    while (tasks[i].id !== task.id && i < tasks.length) {
        i++;
    }
    if (i === tasks.length) {
        tasks.push(task);
    } else {
        tasks[i] = task;
    }
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