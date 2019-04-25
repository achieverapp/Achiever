/* CptS 489, Spring 2019
    Project: Achievement Tracker
    File: AchievementController.js    */

    'use strict'

    const Achievement = require('../models/AchievementsModel.js');
    
    /** 
     * Adds a Achievement to the database. If there is an error, it will return to the caller.
     */ 
    exports.addAchievement = function (req, res) {
      var newAchievement = new Achievement(req.body);
      Achievement.addAchievement(req.app.locals.achievements, newAchievement, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    };
    
    /**
     * Gets a single Achievement from the server based on ID. If there is an error, it will return to the caller.
     */
    exports.getAchievement = function (req, res) {
      Achievement.getAchievement(req.app.locals.achievements, req.params.id, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
    
    /**
     * Handles getting all Achievements for the userID. Returns an error if there is one.
     */
    exports.getAchievements = function (req, res) {
      Achievement.getAchievements(req.app.locals.achievements, req.params.id, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
    
    /**
     * Handles updaing Achievements, automatically adds a Achievement instead of updating if the ID is default.
     */
    exports.updateAchievement = function (req, res) {
      if (req.body._id == "default") { //When we are adding a new Achievement, the ID will be default
        delete req.body._id; //remove the ID from the Achievement object
        var newAchievement = new Achievement(req.body); //turn it into a Achievement object
    
        if (!newAchievement.category) {
          newAchievement.category = "none";
        }
    
        Achievement.addAchievement(req.app.locals.achievements, newAchievement, function (err, result) { //call the addAchievement function to deal with the rest.
          if (err) {
            res.send(err)
          } else {
            res.json(result);
          }
        });
      } else {
        Achievement.updateAchievement(req.app.locals.achievements, req.body, function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.json(result);
          }
        });
      }
    }
    
    /**
     * Delete Achievement handler, there is no logic needed here. We do not currently want to delete Achievements.
     */
    exports.deleteAchievement = function (req, res) {
      Achievement.getAchievements(req.app.locals.achievements, req.params.id);
    }