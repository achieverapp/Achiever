/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'use strict';
//var noSql = require('./noSqlDb.js');
var ObjectId = require('mongodb').ObjectId;

var User=function(User)
{
  this.name = User.name;
  this.userName=User.userName;
  this._id=User._id;
  this.savedTasks = [];
  this.savedTasks = user.savedTasks;
}


// Takes a new User object that contains all data that we want to add.
Users.addUser=function(User,newUser,result)
{
    var resultObj, testUser, regex; // variables used throughout the function.
  resultObj = { //what will be returned to the requester when the function completes
    userId: "",
    success: false, //user is not added by default
    statusMsg: "",
    statusObj: null
  };  

  if (!(typeof newUser.userName == 'string') || newUser.userName.length == 0) { //invalid username. 
    resultObj.statusMsg = "Error: user was not added because username is invalid. (is not a string, is length 0, or does not match Regex)";
    result(resultObj, null);
  } else { //data is valid
    testUser = { //create a user to query the database with
      userName: newUser.userName
    };

    //Query the database for any users with userName
    users.find(testUser).toArray(function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj.statusMsg = "There was an error when testing if the user already exists in the database";
        console.log(resultObj.statusMsg);
        resultObj.statusObj = err;
        result(resultObj, null)
      } else if (res.length > 0) { //user is already in database
        resultObj.statusMsg = "userName already exists in the database";
        console.log(res[0].userId);
        result(resultObj, null);
      } else { //user is not in database, so we need to add them

        // IMPORTANT: Probably going to use mongoDB's ID's to track users.
        // //build out the testUser to be used to insert into the databse
        // testUser.userId = userName + Math.random().toString(36).substr(2); //random string after userName as the key\
        testUser = new User(testUser); //build the rest of the parameters for a user by using the constructor

        //Add the new user into the database
        users.insertOne(testUser, function (err2) {
          if (err2) { //Unkown error, return to client and display it in the log.
            resultObj.statusMsg = "Error when adding user to database";
            console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
            resultObj.statusObj = err2;
            result(resultObj, null);
          } else { //user was added to the database.
            resultObj.userId = testUser._id; //return userid and that they were added.
            resultObj.success = true;
            result(resultObj, null);
          }
        });
      }
    });
  }
}

/*
GetUser returns the data of the user with the given ID.
If no user is found, there is no data retuned and a statusMsg with the reason why there was an error.
*/
Users.getUser=function(Users,UserId,result)
{
var resultObj={ success:false,statusMsg:"",statusObj:null};
Users.find({_id: UserId}).toArray(function(err,res)
{
    if(err)
    {
        resultObj.statusMsg="There was an error when trying to access user in database.";
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        resultObj.statusObj = err;
        result(resultObj, null);
    }
    else if(res.length==1)
    {
    resultObj.statusMsg = "User retrieved.";
      resultObj.success = true;
      resultObj.data = res[0];
      result(resultObj, null);
    }
    else{
    resultObj.statusMsg = "user not found";
    result(resultObj, null);
    }
})
}

Users.updateUser=function(users,user,result)
{  

  //Three different Cases:
  //  User adds a new task to save
  //  User updates their name
  //  User updates thier other information (Not implemented yet)

  newUser = new User(user);
  var resultObj = {
    success: false,
    statusMsg: "",
    statusObj: null
  };

  //Check if the user is in the database
  users.find({
    _id: user._id
  }).toArray(function (err, res) {
    if (err) { //Unkown error, return to client and display it in the log.
      resultObj.statusMsg = "Error when checking if user with id " + userId + " exists in database.";
      resultObj.statusObj = err;
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj, null);
    } else if (res.length == 0) { //no user with id userId, tell the updater and log it
      resultObj.statusMsg = "Cannot update hole of user with id " + userId + ". No such user exists.";
      console.log(resultObj.statusMsg);
      result(resultObj, null);
    } else { //user is in the database!
      if (false) { //placeholder for checking data to make sure it complies with things that we need. Ex progress not greater than 100% etc
        resultObj.statusMsg = "Cannot update user with id " + userId + ". At least one data item not in proper format or out of order"
        console.log(resultObj.statusMsg);
        result(resultObj, null);
      } else if (false) { //another placeholder for checking if subdata has errors (list of achievements contains one that doesnt exist or somethign like that)
        resultObj.statusMsg = "Cannot update user with id " + userId + ". subdata types are invalid"
        console.log(resultObj.statusMsg);
        result(resultObj, null);
      } else { //There is a user with that Id in the database.
        // Check if they have the new task in the database
        // !!!TODO!!!: change this into a separate function so there isnt such an absolutely massive blob
        users.find({
            _id: user._id,
            savedTasks: {
              $elemMatch: { //mongoDB to match anything that also matches the data inside the property     
                taskId: user.savedTasks.taskId
              }
            }
          })
          .toArray(function (err2, res2) {
            if (err2) { //Unkown error, return to client and display it in the log.
              resultObj.statusMsg = "Error when locating user";
              console.log(resultObj.statusMsg + ": " + err2);
              resultObj.statusObj = err2;
              result(resultObj, null);
            }
                  
                //Insert a new hole if it is not already in the data
                if (res2.length == 0) {                
                  //insert updated totals and holedata into the database
                  users.updateOne({ //select the user with the given userId to update
                      _id: user._id
                    }, {
                      $push: { //adds the holedata as a new element of the holes array
                        holes: {
                          holeNum: holeData.holeNum,
                          str: holeData.str,
                          time: holeData.time
                        }
                      },
                    },
                    function (err4, res4) {
                      if (err4) { //Unkown error, return to client and display it in the log.
                        resultObj.statusMsg = "Error when attempting to add new hole " + holeData.holeNum + " for user " + user.userName;
                        console.log(resultObj.statusMsg + ": " + err4);
                        resultObj.statusObj = err4;
                        resultObj.total = null;
                        result(resultObj, null);
                      } else { //Hole was added successfully!
                        resultObj.statusMsg = "Hole " + holeData.holeNum + " successfully added for user " + user.userName;
                        resultObj.success = true;
                        resultObj.total = totalObject;
                        result(resultObj, null);
                      }
                    });
                } else { // That user has already played that hole, so we need to update their old data

                  //calculate pars for the new data
                  for (var i = 0; i < user.holes.length; i++) { //adds up all the par hole data for the number of holes the user is on
                    var holeTimePar = new SGS(pars.holes[i].time); //gets the par time for the hole
                    sgsPar = sgsPar.addToMany([holeTimePar, new SGS(pars.holes[i].str, 0)]); //adds up all the times and strokes for the holes to build the SGS par
                    timePar = timePar.addTo(holeTimePar); //adds up all the times for the total par Time
                    strokesPar += pars.holes[i].str; //adds up all the strokes for the total par strokes
                  }

                  // First we need to calcuate what the updated totals will be             
                  var oldHoleData = user.holes[holeData.holeNum - 1]; //gets the old hole data

                  // Only need to update if there actually was a change in the data
                  if (holeData.str != oldHoleData.str || holeData.time != oldHoleData.time) {
                    var totalObject = {}, // initialize some variables that we need
                      update = {};

                    // Update that user in the database
                    users.updateOne({ //find the user to update
                        userId: userId,
                        holes: {
                          $elemMatch: {
                            holeNum: holeData.holeNum
                          }
                        }
                      }, { //update its data with:
                        $set: {
                          'holes.$.holeNum': holeData.holeNum,
                          'holes.$.str': holeData.str,
                          'holes.$.time': holeData.time,

                          'total.sgs': totalObject.sgs,
                          'total.sgsToPar': totalObject.sgsToPar,
                          'total.str': totalObject.str,
                          'total.strToPar': totalObject.strToPar,
                          'total.time': totalObject.time,
                          'total.timeToPar': totalObject.timeToPar
                        }
                      },
                      function (err4, res4) {
                        if (err4) { //Unkown error, return to client and display it in the log.
                          resultObj.statusMsg = "Error when attempting to update Hole " + holeData.holeNum + " for user " + user.userName;
                          console.log(resultObj.statusMsg + ": " + err4);
                          resultObj.statusObj = err4;
                          resultObj.total = null;
                          result(resultObj, null);
                        } else { //hole updated successfully!
                          resultObj.statusMsg = "Hole " + holeData.holeNum + " successfully added for user " + user.userName;
                          resultObj.success = true;
                          resultObj.total = totalObject;
                          result(resultObj, null);
                        }
                      });
                  } else { // New hole data is the same as what is in the database, so we didnt need to update anything!
                    resultObj.statusMsg = "Hole Data unchanged, update contained the same data already stored in database";
                    result(resultObj, null);
                  }
                }
              }
            });
          });
      }
    }
  });
}

/*delete a user from the database
searching for the userId(for now we will find by userId) and remove them from the database

*/
Users.deleteUser=function(Users,UserId,result)
{
var resultObj={success:false,statusMsg:"", statusMsg:null}
users.find(_id= userId).toArray(function(err,res)
{
    //if err
    if(err)
    {
        resultObj.statusMsg="There was an error when trying to access user in database.";
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        resultObj.statusObj = err;
        result(resultObj, null);
    }
    //if one
    else if(res==1)
    {
        Users.deleteOne({_id:UserId},function(err2,res2)
        {
        //if err
           if(err)
           {
            resultObj.statusMsg="unable to delete the specified userId";
            console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
            resultObj.statusObj = err;
            result(resultObj, null);
           }
           //delete
           else
           {
               resultObj.success=true;
               resultObj.statusMsg="user with"+userId+"was deleted";
               result(resultObj,null);
           }
        })  
    }
    //if nothing
    else
    {
    resultObj.statusMsg="user with"+userId+"was not found";
    result(resultObj, null);
    }
});
}


