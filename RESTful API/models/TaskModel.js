/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'user strict';

var ObjectId = require('mongodb').ObjectId;

var Task = function (task) {
  this.owner = task.owner == null ? null : task.owner;
  this.name = task.name == null ? null : task.name;;
  this.category = task.category == null ? none : task.category;;
  this.priority = task.priority == null ? 0 : task.priority;
  this.subTasks = task.subTasks == null ? [] : task.subTasks;
  this.timeBlocks = task.timeBlocks == null ? [] : task.timeBlocks;
}

/*
  ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
  can be put in one function.
    
  The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
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

/*
  add a task to the task database
  if the task can't be added then just return an err message
*/
Task.addTask = function (tasksDB, taskName, result) {
  var resultObj;
  tasksDB.insertOne(taskName, function (err, res) {
    if (err) { //Unkown error, return to client and display it in the log.
      resultObj = ResultObj("Error when adding new Task to database", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else {
      resultObj = ResultObj("Added task " + taskName.name, null, true, taskName._id, taskName);
      result(resultObj);
    }
  });
}

/*
  get a single task 
  if the task is not available then the return an err message,else return the task informationto
*/
Task.getTask = function (tasksDB, taskId, result) {
  var resultObj;
  tasksDB.find({
    _id: new ObjectId(taskId)
  }).toArray(function (err, res) {
    if (err) {
      resultObj = ResultObj("Error when adding user to database", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else if (res.length == 1) {
      resultObj = ResultObj("User retrieved", null, true, res[0]._id, res[0]);
      result(resultObj);
    } else {
      resultObj = ResultObj("user not found");
      result(resultObj);
    }
  });
}

//get all tasks for a specific user
Task.getTasks = function (tasksDB, userId, result) {
  var resultObj;
  tasksDB.find({
    owner: userId
  }).toArray(function (err, res) {
    if (err) {
      resultObj = ResultObj("Error when adding user to database", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else {
      console.log(res);
      resultObj = ResultObj("User retrieved", null, true, userId, res);
      result(resultObj);
    }
  });
}

// TODO: Implement U and D in milestone 3

Task.updateTask = function (tasksDB, taskId, result) {
  var resultObj;
  tasksDB.find({
    _id: new ObjectId(taskId)
  }).toArray(function (err, res) {
    if (err) { //Unkown error, return to client and display it in the log.
      resultObj = ResultObj("Error when checking if user with id " + taskId + " exists in database.", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else if (res.length == 0) { //no user with id userId, tell the updater and log it
      resultObj = ResultObj("Task not in database. ID:" + taskId._Id);
      console.log(resultObj.statusMsg);
      result(resultObj);
    } else {
      if (taskId.name != null) {
        updateTaskName(tasksDB, taskId, result).then(function (res) {
          result(res);
        })
      }
      if (taskId.category != null) {
        updateTaskCategory(tasksDB, taskId, result).then(function (res) {
          result(res);
        })
      }
      if (taskId.priority != null) {
        updateTaskPriority(tasksDB, taskId, result).then(function (res) {
          result(res);
        })
      }
      if (taskId.timeBlocks != null) {
        updateTaskTB(tasksDB, taskId, result).then(function (res) {
          result(res);
        })
      }
    }
  }
  )
}
//update the task name
async function updateTaskName(tasksDB, taskId, result) {
  return new Promise(function (resolve) {
    tasksDB.updateOne({
      _id: new ObjectId(taskId._id)
    }, {
      $set: { 'name': taskId.name }, function(err) {
        if (err) { //Unkown error, return to client and display it in the log.
          resultObj = ResultObj("Error when attempting to change name!", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(resultObj);
        } else { //hole updated successfully!
          resultObj = ResultObj("Name changed to " + taskId.name, null, true);
          resolve(resultObj);
        }
      }
      })

  })
}
//update category
async function updateTaskCategory(tasksDB, taskId, result) {

}
//update the priorty
async function updateTaskPriority(tasksDB, taskId, result) {

}
//update the timeblock 
async function updateTaskTB(tasksDB, taskId, result) {

}
// TODO: Implement U and D in milestone 3 
Task.deleteTask = function (tasksDB, taskId, result) {

}

module.exports = Task;