/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskController.js    */

'use strict'

const Task = require('../models/TaskModel.js');

/** 
 * Adds a task to the database. If there is an error, it will return to the caller.
 */
exports.addTask = function (req, res) {
  var newTask = new Task(req.body);
  Task.addTask(req.app.locals.tasks, newTask, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
};

/**
 * Gets a single task from the server based on ID. If there is an error, it will return to the caller.
 */
exports.getTask = function (req, res) {
  Task.getTask(req.app.locals.tasks, req.params.id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

/**
 * Handles getting all tasks for the userID. Returns an error if there is one.
 */
exports.getTasks = function (req, res) {
  Task.getTasks(req.app.locals.tasks, req.params.id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

/**
 * Handles updaing tasks, automatically adds a task instead of updating if the ID is default.
 */
exports.updateTask = function (req, res) {  
  if (req.body._id == "default") { //When we are adding a new task, the ID will be default
    delete req.body._id; //remove the ID from the task object
    var newTask = new Task(req.body); //turn it into a task object

    if (!newTask.category) {
      newTask.category = "none";
    }    
    Task.addTask(req.app.locals.tasks, newTask, function (err, result) { //call the addTask function to deal with the rest.
      if (err) {
        res.send(err)
      } else {
        res.json(result);
      }
    });
  } else {    
    Task.updateTask(req.app.locals.tasks, req.body, function (err, result) {      
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
}

/**
 * Delete task handler, there is no logic needed here. We do not currently want to delete tasks.
 */
exports.deleteTask = function (req, res) {
  Task.getTasks(req.app.locals.tasks, req.params.id);
}