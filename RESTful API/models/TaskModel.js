/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'user strict';
//var noSql = require('./noSqlDb.js');
//var ObjectId = require('mongodb').ObjectId;

var Task = function (task) {
    this.TaskName = task.TaskName;
    this.Category = task.Category;
    this.Priority = task.Priority;
    this.SubTasks = [];
    this.SubTasks = task.SubTasks;
    this.TimeBlocks = [];
}

Task.addTask = function (Tasks, taskName, result) {
    var resultObj, testTask, regex; // variables used throughout the function.
    resultObj = { //what will be returned to the requester when the function completes
        taskId: "",
        success: false, //task is not added by default
        statusMsg: "",
        statusObj: null
    };

    // TODO: Probably don't need this but Ill leave it here for now
    regex = /^(?:[ '.\-a-zA-Z]*)?$/gm; //Regex tests for only alphabetics, periods, spaces, and hyphens

    if (!(typeof taskName == 'string') || taskName.length == 0 || !(regex.test(taskName))) { //invalid taskName. 
        resultObj.statusMsg = "Error: Task was not added because taskName is invalid. (is not a string, is 0 characters, or does not match Regex)";
        result(resultObj, null);
    } else { //data is valid
        testTask = { //create a task to query the database with
            taskName: taskName
        };

        //Query the database for any Tasks with taskName
        Tasks.find(testTask).toArray(function (err, res) {
            if (err) { //Unkown error, return to client and display it in the log.
                resultObj.statusMsg = "There was an error when testing if the task already exists in the database";
                console.log(resultObj.statusMsg);
                resultObj.statusObj = err;
                result(resultObj, null)
            } else if (res.length > 0) { //Task is already in database
                resultObj.statusMsg = "Task already exists in the database";
                console.log(res[0].taskId);
                result(resultObj, null);
            } else { //Task is not in database, so we need to add it

                //build out the testTask to be used to insert into the databse
                testTask.taskId = taskName + Math.random().toString(36).substr(2); //random string after taskName as the key\
                testTask = new Task(testTask); //build the rest of the parameters for a Task by using the constructor

                //Add the new Task into the database
                Tasks.insertOne(testTask, function (err2) {
                    if (err2) { //Unkown error, return to client and display it in the log.
                        resultObj.statusMsg = "Error when adding Task to database";
                        console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
                        resultObj.statusObj = err2;
                        result(resultObj, null);
                    } else { //Task was added to the database.
                        resultObj.taskId = testTask.taskId; //return taskId and that they were added.
                        resultObj.success = true;
                        result(resultObj, null);
                    }
                });
            }
        });
    }
}


Task.getTask = function (Tasks, taskId, result) {

}

Task.updateTask = function (Tasks, taskId, result) {

}


Task.deleteTask = function (Tasks, taskId, result) {

}
module.exports =  Task ;