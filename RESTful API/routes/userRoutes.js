/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

    'use strict';

    module.exports=function(app)
    {
        var TTuser=require('../controllers/UserController')

        app.route('/users')
        .post(TTuser.addUser);

        //route calls

        app.route('/users/:userId')
        .get(TTuser.getUser)
        .put(TTuser.updateUser)
        .delete(TTuser.deleteUser);


    }