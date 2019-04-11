/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

    'use strict';

    module.exports=function(app)
    {
        var Task=require('../controllers/TaskController')

        app.route('/tasks')
        .post(TMuser.addTask)
        .put(TMuser.updateTask);

        app.route('/task/:_id')
        .get(TMuser.getTask)
        .delete(TMuser.deleteTask);
    }