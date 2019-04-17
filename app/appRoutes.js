/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

'use strict';

module.exports = function (app) {
    var Controller = require('./appController')

    ////////////////////////////
    // API ROUTES
    ////////////////////////////

    // app.post("/api/users", app.oauth.authorise(), TMuser.addUser);
    // app.put("/api/users", app.oauth.authorise(), TMuser.updateUser);
    // app.get("/api/users/:id", app.oauth.authorise(), TMuser.getUser);
    // app.delete("/api/users/:id", app.oauth.authorise(), TMuser.deleteUser);

    // app.post("/api/tasks", app.oauth.authorise(), Task.addTask);
    // app.put("/api/tasks", app.oauth.authorise(), Task.updateTask);
    // app.get("/api/task/:id", app.oauth.authorise(), Task.getTask);
    // app.delete("/api/task/:id", app.oauth.authorise(), Task.deleteTask);

    // app.get("/api/task/id/:id", app.oauth.authorise(), Task.getTasks);

    ////////////////////////////
    // APP ROUTES
    ////////////////////////////

    app.get('/achievements', Controller.getAchievements)
    app.get('/progress', Controller.getProgress)
    app.get('/schedule', Controller.getSchedule)
    app.get('/tasklist', Controller.getTasklist)
    app.get('/taskview', Controller.getTaskview)

    ////////////////////////////
    // FILE ROUTES
    ////////////////////////////
}