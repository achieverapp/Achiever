/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

'use strict';

module.exports = function (app) {
    var TMuser = require('../controllers/UserController')
    var Task = require('../controllers/TaskController')

    app.route('/users')
        .post(TMuser.addUser)
        .put(TMuser.updateUser);

    app.route('/users/:id')
        .get(TMuser.getUser)
        .delete(TMuser.deleteUser);

    app.route('/tasks')
        .post(Task.addTask);
    //.put(Task.updateTask);

    app.route('/tasks/:id')
        .get(Task.getTask);
    //.delete(Task.deleteTask);

    app.route('/tasks/id/:id')
        .get(Task.getTasks);
}