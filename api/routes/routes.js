/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

'use strict';

module.exports = function (app) {
    var TMuser = require('../controllers/UserController')
    var Task = require('../controllers/TaskController')
    var Auth = require('../controllers/AuthController')

    app.route('/api/users')
        .post(TMuser.addUser)
        .put(TMuser.updateUser);

    app.route('/api/users/:id')
        .get(TMuser.getUser)
        .delete(TMuser.deleteUser);

    app.route('/api/tasks')
        .post(Task.addTask)
        .put(Task.updateTask);

    app.route('/api/tasks/:id')
        .get(Task.getTask)
        .delete(Task.deleteTask);

    app.route('/api/tasks/id/:id')
        .get(Task.getTasks);

    app.get('/api/oauth/redirect', Auth.authenticate)
}