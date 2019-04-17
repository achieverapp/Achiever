/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskController.js    */

'use strict'

exports.getAchievements = function (req, res) {
  res.sendFile('private/html/achievements.html');
};

exports.getProgress = function (req, res) {
  res.sendFile('private/html/progress.html');
};

exports.getSchedule = function (req, res) {
  res.sendFile('private/html/schedule.html');
};

exports.getTasklist = function (req, res) {
  res.sendFile('private/html/tasklist.html');
};

exports.getTaskview = function (req, res) {
  res.sendFile('private/html/taskview.html');
};
