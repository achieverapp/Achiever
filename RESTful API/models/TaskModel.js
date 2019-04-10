/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'user strict';
//var noSql = require('./noSqlDb.js');
var ObjectId = require('mongodb').ObjectId;

var User = function (task) {
    this.TaskName = task.TaskName;
    this.Category = task.Category;
    this.Priority = task.Priority;
    this.SubTasks = [];
    this.SubTasks = task.SubTasks;
    this.TimeBlocks = [];
}

Users.addTask = function (Tasks, taskId, result) {


}


Users.getTask = function (Tasks, taskId, result) {

}

Users.updateTask = function (Tasks, taskId, result) {

}


Users.deleteTask = function (Tasks, taskId, result) {

}