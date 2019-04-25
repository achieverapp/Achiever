/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

'use strict';

module.exports = function (app) {
    var Controller = require('./appController')

    app.get('/', Controller.getLogin)
    app.get('/achievements', Controller.getAchievements)
    app.get('/login', Controller.getLogin)
    app.get('/privacy', Controller.getPrivacy)
    app.get('/progress', Controller.getProgress)
    app.get('/schedule', Controller.getSchedule)
    app.get('/tasklist', Controller.getTasklist)
    app.get('/taskview', Controller.getTaskview)
}