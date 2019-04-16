// import { rejects } from "assert";

/*
    model.js

    This file will now be used as a standardized interface to the true model backend    
*/

const URL = "http://localhost:3000"; //URL of the API server.

async function getTaskList(userId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: URL + "/tasks/id/" + userId,
            method: 'GET',
            success: resolve,
            error: reject
        });
    });
}

// returns a Promise that contains the result of the API call
async function getTask(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: URL + "/tasks/" + id,
            method: 'GET',
            success: resolve,
            error: reject          
        });
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

function getAPITask(id) {

}