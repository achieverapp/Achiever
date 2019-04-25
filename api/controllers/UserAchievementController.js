/* CptS 489, Spring 2019
    Project: userAchievements Tracker
    File: userAchievementsController.js    */

    'use strict'

    const userAchievements = require('../models/UserAchievementModel.js');
    
    /** 
     * Adds a userAchievements to the database. If there is an error, it will return to the caller.
     */ 
    exports.addUserAchievement = function (req, res) {
      var newuserAchievements = new UserAchievement(req.body);
      userAchievements.addUserAchievements(req.app.locals.userachievements, newuserAchievements, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    };
    
    /**
     * Gets a single userAchievements from the server based on ID. If there is an error, it will return to the caller.
     */
    exports.getUserAchievement = function (req, res) {
      userAchievements.getUserAchievements(req.app.locals.userachievement, req.params.id, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
    
    /**
     * Handles getting all userAchievementss for the userID. Returns an error if there is one.
     */
    exports.getUserAchievements = function (req, res) {
      userAchievements.getUserAchievementss(req.app.locals.userAchievement, req.params.id, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
    
    /**
     * Handles updaing userAchievementss, automatically adds a userAchievements instead of updating if the ID is default.
     */
    exports.updateUserAchievement = function (req, res) {
      
        var newUserAchievement = new UserAchievement(req.body);
         UserAchievements.updateUser(req.app.locals.userachievement, newUserAchievement, function (result) {
        res.json(result);
  });
}
    
    
    /**
     * Delete userAchievements handler, there is no logic needed here. We do not currently want to delete userAchievementss.
     */
    exports.deleteUserAchievement = function (req, res) {
      userAchievements.getUserAchievementss(req.app.locals.userAchievement, req.params.id);
    }