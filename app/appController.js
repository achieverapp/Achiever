/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskController.js    */

'use strict'

var path = require('path')

exports.getAchievements = function (req, res) {
  res.sendFile(path.resolve('private/html/achievements.html'));
};

exports.getLogin = function (req, res) {
  res.sendFile(path.resolve('public/html/login.html'));
};

exports.getProgress = function (req, res) {
  res.sendFile(path.resolve('private/html/progress.html'));
};

exports.getSchedule = function (req, res) {
  res.sendFile(path.resolve('private/html/schedule.html'));
};

exports.getTasklist = function (req, res) {
  res.sendFile(path.resolve('private/html/tasklist.html'));
};

exports.getTaskview = function (req, res) {
  res.sendFile(path.resolve('private/html/taskview.html'));
};
