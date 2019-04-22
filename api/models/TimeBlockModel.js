/* CptS 489, Spring 2019
    Project: Task Tracker
    File: timeBlockModel.js    */

'use strict';

var ObjectId = require('mongodb').ObjectId;

// Task + startDate combinations will always be unique
class TimeBlock {
    constructor(timeBlocks) {
        this._id = timeBlocks._id == null ? null : timeBlocks._id;
        this.task = timeBlocks.task == null ? null : timeBlocks.task;
        this.owner = timeBlocks.owner == null ? null : timeBlocks.owner;
        this.day = timeBlocks.day == null ? new Date().toISOString().split("T")[0] : timeBlocks.day; //if there is no day, then use today. makes a new date and then splits on "T" which should give only month, day, and year
        this.startDate = timeBlocks.startDate == null ? new Date().toISOString() : timeBlocks.startDate;
        this.endDate = timeBlocks.endDate == null ? new Date().toISOString() : timeBlocks.endDate;
        // this.title = timeBlocks.title == null ? null : timeBlocks.title;
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
                console.log(resultObj)
                result(resultObj);
            }
        });
    }

    /*
    GettimeBlock returns the data of the timeBlock with the given task and startDate
    If no timeBlock is found, there is no data retuned and a statusMsg with the reason why there was an error.
    */
    static getTimeBlock(timeBlockDB, querytimeBlock, result) {
        var resultObj;
        timeBlockDB.find({
            task: querytimeBlock.task,
            startDate: querytimeBlock.startDate
        }).toArray(function (err, res) {
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
    static getTimeBlocks(timeBlockDB, querytimeBlock, result) {
        var resultObj;
        timeBlockDB.find({
            day: querytimeBlock.day,
            owner: querytimeBlock.owner
        }).toArray(function (err, res) {
            if (err) {
                resultObj = ResultObj("Error when searching for timeblocks for user " + userId, err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else {
                resultObj = ResultObj("timeblocks retrieved", null, true, querytimeBlock.day, res);
                result(resultObj);
            }
        });
    }

    /*
    updatetimeBlock function is responsible for updating anything that may be stored in a timeBlock object.
    */
    static updateTimeBlock(timeBlockDB, newTimeBlock, result) {
        var resultObj;
        timeBlockDB.find({
            _id: new ObjectId(newTimeBlock._id)
        }).toArray(function (err, res) {
            if (err) { //Unkown error, return to client and display it in the log.
                resultObj = ResultObj("Error when checking if timeBlock is available.", err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else if (res.length == 0) { //no timeBlock with id timeBlockId, tell the updater and log it
                resultObj = ResultObj("timeBlock is not available");
                console.log(resultObj.statusMsg);
                result(resultObj);
            } else { //timeBlock is in the database!
                updateDate(timeBlockDB, newTimeBlock, resultObj).then(result); //change these to things we need later
            }
        });
    }

    /*delete a timeBlock from the database
    searching for the timeBlockId(for now we will find by timeBlockId) and remove them from the database
    */
    static deleteTimeBlock(timeBlockDB, querytimeBlock, result) {
        var resultObj;
        timeBlockDB.find({
            task: querytimeBlock.task,
            startDate: querytimeBlock.startDate
        }).toArray(function (err, res) {
            if (err) {
                resultObj = ResultObj("Error when deleting timeBlock", err);
                console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
                result(resultObj);
            } else {
                timeBlockDB.deleteOne({
                    task: querytimeBlock.task,
                    startDate: querytimeBlock.startDate
                }, function (err2) {
                    if (err2) {
                        resultObj = ResultObj("Error when deleting timeblock", err2);
                        console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
                        result(resultObj);
                    } else {
                        resultObj = ResultObj("timeBlock was deleted", null, true, null, null);
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

async function updateDate(timeBlockDB, newTimeBlock, resultObj) {
    return new Promise(function (resolve) {
        timeBlockDB.updateOne({ //find the timeBlock to update
                _id: new ObjectId(newTimeBlock._id)
            }, { //update its data with:
                $set: {
                    'startDate': newTimeBlock.startDate,
                    'endDate': newTimeBlock.endDate
                }
            },
            function (err) {
                if (err) { //Unkown error, return to client and display it in the log.
                    resultObj = ResultObj("Error when attempting to update timeblock!", err);
                    console.log(resultObj.statusMsg + ": " + err);
                    resolve(resultObj);
                } else { //hole updated successfully!
                    resultObj = ResultObj("start date changed to " + newTimeBlock.startDate, null, true, null, newTimeBlock);
                    resolve(resultObj);
                }
            });
    });
}





module.exports = {
    TimeBlock,
    ResultObj
};