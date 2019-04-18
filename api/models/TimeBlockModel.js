/* CptS 489, Spring 2019
    Project: Task Tracker
    File: timeBlockModel.js    */

'use strict';

var ObjectId = require('mongodb').ObjectId;

class TimeBlock {
    constructor(timeBlocks) {
        this.task = timeBlocks.task == null ? null : timeBlocks.task;
        this.owner = timeBlocks.owner == null ? null : timeBlocks.owner;
        this.day = timeBlocks.day == null ? new Date().toISOString().split("T")[0] : timeBlocks.day; //if there is no day, then use today. makes a new date and then splits on "T" which should give only month, day, and year
        this.startDate = timeBlocks.startDate == null ? new Date().toISOString() : timeBlocks.startDate;
        this.endDate = timeBlocks.endDate == null ? new Date().toISOString() : timeBlocks.endDate;
    }

    // Takes a new timeBlock object that contains all data that we want to add.
    static addTimeBlock(timeBlockDB, newTimeBlock, result) {
        var resultObj;
        timeBlockDB.insertOne(newTimeBlock, function (err, res) {
            if (err) { //Unkown error, return to client and display it in the log.
                resultObj = ResultObj("Error when adding timeBlock to database", err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else { //timeBlock was added to the database.
                resultObj = ResultObj("Added timeBlock ", null, true, newTimeBlock._id, newTimeBlock);
                result(resultObj);
            }
        });
    }
    /*
    GettimeBlock returns the data of the timeBlock with the given ID.
    If no timeBlock is found, there is no data retuned and a statusMsg with the reason why there was an error.
    */
    static getTimeBlock(timeBlockDB, querytimeBlock, result) {
        var query = querytimeBlock;
        if (querytimeBlock._id) {
            query._id = new ObjectId(querytimeBlock._id)
        }
        var resultObj;
        timeBlockDB.find(query).toArray(function (err, res) {
            if (err) {
                resultObj = ResultObj("Error when adding timeBlock to database", err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else if (res.length == 1) {
                resultObj = ResultObj("timeBlock retrieved", null, true, res[0]._id, res[0]);
                result(resultObj);
            } else {
                resultObj = ResultObj("timeBlock not found");
                result(resultObj);
            }
        });
    }

    //get all time blocks for a specific user
    static getTimeBlocks(timeBlockDB, userId, result) {
        var resultObj;
        timeBlockDB.find({
            owner: userId
        }).toArray(function (err, res) {
            if (err) {
                resultObj = ResultObj("Error when searching for timeblocks for user " + userId, err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else {
                resultObj = ResultObj("timeblocks retrieved", null, true, userId, res);
                result(resultObj);
            }
        });
    }
    /*
    updatetimeBlock function is responsible for updating anything that may be stored in a timeBlock object.
    As of milestone 2, the timeBlock object is only responsible for storing:
      * Saved tasks
      * Name
      * _id
    */
    static updateTimeBlock(timeBlockDB, newtimeBlock, result) {
        var resultObj;
        timeBlockDB.find({
            _id: new ObjectId(newtimeBlock._id)
        }).toArray(function (err, res) {
            if (err) { //Unkown error, return to client and display it in the log.
                resultObj = ResultObj("Error when checking if timeBlock with id " + newtimeBlock._Id + " exists in database.", err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else if (res.length == 0) { //no timeBlock with id timeBlockId, tell the updater and log it
                resultObj = ResultObj("timeBlock not in database. ID:" + newtimeBlock._Id);
                console.log(resultObj.statusMsg);
                result(resultObj);
            } else { //timeBlock is in the database!
                //Three different Cases:
                //  timeBlock adds a new task to save
                //  timeBlock updates their name
                //  timeBlock updates thier other information (Not implemented yet)
                if (newtimeBlock.name != null)
                    updateName(timeBlockDB, newtimeBlock, resultObj).then(result); //change these to things we need later
                if (newtimeBlock.savedTasks.length > 0)
                    updateSavedTasks(timeBlockDB, newtimeBlock, resultObj).then(result);
            }
        });
    }

    /*delete a timeBlock from the database
    searching for the timeBlockId(for now we will find by timeBlockId) and remove them from the database
    */
    static deleteTimeBlock(timeBlockDB, timeBlockId, result) {
        var resultObj;
        timeBlockDB.find({
            _id: new ObjectId(timeBlockId)
        }).toArray(function (err, res) {
            if (err) {
                resultObj = ResultObj("Error when deleting timeBlock to database", err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else {
                timeBlockDB.deleteOne({
                    _id: new ObjectId(timeBlockId)
                }, function (err2) {
                    if (err) {
                        resultObj = ResultObj("Error when timeBlock timeBlock to database", err2);
                        console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
                        result(resultObj);
                    } else {
                        resultObj = ResultObj("timeBlock with ID:" + timeBlockId + "was deleted", null, true, null, null);
                        result(resultObj);
                    }
                });
            }
        });
    }
}

/*
  ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
  can be put in one function.
/*
      ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
      can be put in one function.
    
      The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
    
The most common parameters are closer to the start of the list
while the ones that rarely get called are towards the end.*/

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

async function updateName(timeBlockDB, newtimeBlock, resultObj) {
    return new Promise(function (resolve) {
        timeBlockDB.updateOne({ //find the timeBlock to update
                _id: new ObjectId(newtimeBlock._id)
            }, { //update its data with:
                $set: {
                    'name': newtimeBlock.name
                }
            },
            function (err) {
                if (err) { //Unkown error, return to client and display it in the log.
                    resultObj = ResultObj("Error when attempting to change name!", err);
                    console.log(resultObj.statusMsg + ": " + err);
                    resolve(resultObj);
                } else { //hole updated successfully!
                    resultObj = ResultObj("Name channged to " + newtimeBlock.name, null, true);
                    resolve(resultObj);
                }
            });
    });
}

async function updateSavedTasks(timeBlockDB, newtimeBlock, resultObj) {
    return new Promise(function (resolve) {
        timeBlockDB.find({
                _id: new ObjectId(newtimeBlock._id),
                savedTasks: {
                    $elemMatch: { //mongoDB to match anything that also matches the data inside the property
                        taskId: newtimeBlock.savedTasks.taskId
                    }
                }
            })
            .toArray(function (err, res) {
                if (err) { //Unkown error, return to client and display it in the log.
                    resultObj = ResultObj("Error when locating timeBlock", err);
                    console.log(resultObj.statusMsg + ": " + err);
                    resolve(statusObj);
                }
                if (res.length == 0) { //Insert a task ID if it is not already in the data
                    timeBlockDB.updateOne({ //select the timeBlock with the given timeBlockId to update
                            _id: new ObjectId(newtimeBlock._id)
                        }, {
                            $push: { //adds the holedata as a new element of the holes array
                                savedTasks: {
                                    $each: newtimeBlock.savedTasks
                                }
                            },
                        },
                        function (err2) {
                            if (err2) { //Unkown error, return to client and display it in the log.
                                resultObj = ResultObj("Error when attempting to save task ID: " + newtimeBlock.savedTasks + " for timeBlock " + newtimeBlock.timeBlockName, err2);
                                console.log(resultObj.statusMsg + ": " + err2);
                                resolve(resultObj);
                            } else { //Task was added successfully!
                                resultObj = ResultObj("Task saved as template for timeBlock " + newtimeBlock.timeBlockName, null, true);
                                resolve(resultObj);
                            }
                        });
                }
            });
    });
}



module.exports = {
    TimeBlock,
    ResultObj
};