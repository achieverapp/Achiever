/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskModel.js    */

'use strict';
var ObjectId = require('mongodb').ObjectId;

/**
 * Task object that represents and controls functionality for storing tasks on a backend database
 * Current properties of a task:
 - name
 - category
 - priority
 - subtasks[]
 */
class Task {
  /**
   * Takes an Object and turns it into a Task with all the necessary properties.
   * @param {Object} task 
   */
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

  /**
   * Inserts a single task to the database     
   * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
   * @param {Task} task: Task object that you want to add to the database.
   * @param {function} result: Function to call for the server response
   */
  static addTask(tasksDB, task, result) {
    var resultObj;
    tasksDB.insertOne(task, function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when adding new Task to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Added task " + task.title, null, true, task._id, task);
        result(null, resultObj);
      }
    });
  }

  /**
   * Retrieves a single task
   * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
   * if the task is not available then the return an err message
   * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
   * @param {string} taskId: TaskID that we want to retrieve information from
   * @param {function} result: Function to call for the server response
   */
  static getTask(tasksDB, taskId, result) {
    var resultObj, id;
    if (taskId == "default") { // If the id is 'default' then we cannot create an ObjectId with it and mus tjust pass it as a string.
      id = taskId;
    } else {
      id = new ObjectId(taskId);
    }
    tasksDB.find({
      _id: id
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when adding task to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else if (res.length == 1) {
        resultObj = ResultObj("Task retrieved", null, true, res[0]._id, res[0]);
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Task not found");
        result(null, resultObj);
      }
    });
  }

  /**
   * Retrieves all the tasks for a certain user.
   * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
   * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
   * @param {string} userId: userID that we want to retrieve all the tasks for
   * @param {function} result: Function to call for the server response
   */
  static getTasks(tasksDB, userId, result) {
    var resultObj;
    tasksDB.find({
      owner: userId
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when adding task to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Task retrieved", null, true, userId, res);
        result(null, resultObj);
      }
    });
  }

  /**
   * Updates the properties of a task
   * Current properties of a task:
   - name
   - category
   - priority
   - subtasks[]
   * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
   * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
   * @param {Task} newTask: Object that contains the name and taskID that you want to update
   * @param {function} result: Function to call for the server response
   */
  static updateTask(tasksDB, newTask, result) {
    var resultObj;
    tasksDB.find({
      _id: new ObjectId(newTask._id)
    }).toArray(function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when checking if user with id " + newTask._id + " exists in database.", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(resultObj);
      } else if (res.length == 0) { //no user with id userId, tell the updater and log it
        resultObj = ResultObj("Task not in database. ID:" + newTask._id);
        console.log(resultObj.statusMsg);
        result(null, resultObj);
      } else {
        if (newTask.title != null) {
          updateTaskName(tasksDB, newTask, result).then(result);
        }
        if (newTask.category != null) {
          updateTaskCategory(tasksDB, newTask, result).then(result);
        }
        if (newTask.priority != null) {
          updateTaskPriority(tasksDB, newTask, result).then(result);
        }
        if (newTask.timeBlocks != null && newTask.timeBlocks.length > 0) {
          updateTaskTB(tasksDB, newTask, result).then(result);
        }
        if (newTask.subTasks != null && newTask.subTasks.length > 0) {
          updatesubTask(tasksDB, newTask, result).then(result);
        }
        if (newTask.checked != null && newTask.completedOn != null) {
          updateTaskChecked(tasksDB, newTask, result).then(result);
        }
      }
    });
  }

  /**
   * Deletes a task from the database
   * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
   * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
   * @param {Task} newTask: Object that contains the taskID that you want to delete
   */
  static deleteTask(tasksDB, taskId) {
    var resultObj;
    tasksDB.find({
      _id: new ObjectId(taskId)
    }).toArray(function (err) {
      if (err) {
        resultObj = ResultObj("Error when attempting to delete task!", err);
        console.log(resultObj.statusMsg + ": " + err);
        resolve(resultObj);
      } else {
        tasksDB.deleteOne({
          _id: new ObjectId(taskId)
        }).toArray(function (err2) {
          if (err2) {
            resultObj = ResultObj("Error when attempting to delete task!", err);
            console.log(resultObj.statusMsg + ": " + err);
            resolve(resultObj);
          } else {
            resultObj = ResultObj("user with" + taskId.title + "deleted");
            resultObj(resultObj);
          }
        });
      }
    });
  }
}

/**
 * Constructor function for a result Object. Allows fast creation of a return object for an API response.
 * 
 * The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
 * @param {string} statusMsg: Message that gives more detail on the result of the call.
 * @param {Object} statusObj: Object containing details about errors if there is an error
 * @param {boolean} success: Status of the API call
 * @param {string} id: ID of the object affected
 * @param {Object} data: data that can be read from the reciever
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

/**
 * Updates the checked status of a task
 * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
 * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
 * @param {Task} newTask: Object that contains the checked status and taskID that you want to update
 */
async function updateTaskChecked(tasksDB, newTask) {
  return new Promise(function (resolve) {
    var resultObj;
    tasksDB.updateOne({
      _id: new ObjectId(newTask._id)
    }, {
      $set: {
        'checked': newTask.checked,
        'completedOn': newTask.completedOn
      },
      function (err) {
        if (err) {
          resultObj = ResultObj("Error when attempting to check off task!", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(resultObj);
        } else {
          resultObj = ResultObj("Task checked changed to " + newTask.checked, null, true);
          resolve(resultObj);
        }
      }
    })
  })
}

/**
 * Updates the name of a task
 * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
 * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
 * @param {Task} newTask: Object that contains the name and taskID that you want to update
 */
async function updateTaskName(tasksDB, newTask) {
  return new Promise(function (resolve) {
    var resultObj;
    tasksDB.updateOne({
      _id: new ObjectId(newTask._id)
    }, {
      $set: {
        'title': newTask.title
      },
      function (err) {
        if (err) {
          resultObj = ResultObj("Error when attempting to change name!", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(resultObj);
        } else {
          resultObj = ResultObj("Name changed to " + newTask.title, null, true);
          resolve(resultObj);
        }
      }
    })

  })
}

/**
 * Updates the category of a task
 * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
 * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
 * @param {Task} newTask: Object that contains the category and taskID that you want to update
 */
async function updateTaskCategory(tasksDB, newTask) {
  return new Promise(function (resolve) {
    var resultObj;
    tasksDB.updateOne({
      _id: new ObjectId(newTask._id)
    }, {
      $set: {
        'category': newTask.category
      },
      function (err) {
        if (err) {
          resultObj = ResultObj("Error when attempting to change name!", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(resultObj);
        } else {
          resultObj = ResultObj("category changed to " + newTask.category, null, true);
          resolve(resultObj);
        }
      }
    })
  })
}

/**
 * Updates the priority of a task
 * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
 * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
 * @param {Task} newTask: Object that contains the priority and taskID that you want to update
 */
async function updateTaskPriority(tasksDB, newTask) {
  return new Promise(function (resolve) {
    var resultObj;
    tasksDB.updateOne({
      _id: new ObjectId(newTask._id)
    }, {
      $set: {
        'priority': newTask.priority
      },
      function (err) {
        if (err) {
          resultObj = ResultObj("Error when attempting to change name!", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(resultObj);
        } else {
          resultObj = ResultObj("priority changed to " + newTask.priority, null, true);
          resolve(resultObj);
        }
      }
    })
  })
}

/**
 * Updates the subtasks for a task
 * If no Task is found, there is no data retuned and a statusMsg with the reason why there was an error.
 * @param {Collection} tasksDB: MongoDB collection that this function will be ran on.
 * @param {Task} newTask: Object that contains the subtasks that you want to replace.
 */
async function updatesubTask(tasksDB, newTask) {
  return new Promise(function (resolve) {
    var resultObj;
    tasksDB.find({
      _id: new ObjectId(newTask._id)
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when locating subtask", err);
        console.log(resultObj.statusMsg + ": " + err);
        resolve(statusObj);
      } else if (res.length == 0) {
        tasksDB.updateOne({
          _id: new ObjectId(newTask._id)
        }, {
          $set: {
            subTasks: newTask.subTasks
          }
        }, function (err2, res2) {
          if (err2) { //Unkown error, return to client and display it in the log.
            resultObj = ResultObj("Error when attempting to save task ID: " + newTask.subTasks + " for task " + newTask.title, err2);
            console.log(resultObj.statusMsg + ": " + err2);
            resolve(resultObj);
          } else { //Task was added successfully!
            resultObj = ResultObj("Task updated", null, true);
            resolve(resultObj);
          }
        })
      }
    })
  })
}


module.exports = Task;