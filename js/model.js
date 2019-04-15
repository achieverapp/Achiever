// import { rejects } from "assert";

/*
    model.js

    This file is meant to be used to emulate a RESTFUL api call that is made to a separate server to demo the app for milestone1.
*/

var tasks = [{
        id: 2,
        title: "Do some fitness stuff cuz summer beach-bod obvs",
        due: "2019-04-10T23:59:59.999-07:00",
        category: "wellness",
        priority: 0,
        subtasks: [
            "Work out and be a healthy human being.",
            "Eat some healthy food, c'mon!",
            "EXAMPLE WOOOOW"
        ]
    },
    {
        id: 0,
        title: "Do some work stuff cuz deadlines n wutnot",
        due: "2019-04-14T23:59:59.999-07:00",
        category: "work",
        priority: 2
    },
    {
        id: 1,
        title: "Do some chore stuff cuz your house is a mess",
        due: "2019-03-09T23:59:59.999-07:00",
        category: "home",
        priority: 1
    },
];

function getTaskList() {
    return tasks;
}

function getTask(id) {
    var i = 0;
    while (tasks[i].id !== id && i < tasks.length) {
        i++;
    }
    if (i === tasks.length) {
        return null;
    }
    return tasks[i];
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
    //return new Promise(function (resolve) {
    return new Promise(function (resolve) {
        $.ajax({
            url: "http://localhost:3000/tasks/" + id,
            method: 'GET',
            success: function (data, status) {
                // console.log("data: " + JSON.stringify(data));
                // console.log("status: " + status);
                resolve(data, status);
            },
            error: function (data, status) {
                // console.log("data: " + JSON.stringify(data));
                // console.log("status: " + status);
                rejects(data, status);
            }
        });
    });
}