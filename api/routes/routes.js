/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserRoutes.js    */

'use strict';

module.exports = function (app) {
    var User = require('../controllers/UserController')
    var Task = require('../controllers/TaskController')
    var Auth = require('../controllers/AuthController')
    var TimeBlock = require('../controllers/TimeblockController') // !important -- 'block' in TimeblockController must be lowercase 'b' -- !important //
    var Achievement=require('../controllers/AchievementController')
    var UserAchievement=require('../controllers/UserAchievementController')

    //  User Routes
    app.route('/api/users')
        .post(User.addUser)
        .put(User.updateUser);

    app.route('/api/users/:id')
        .get(User.getUser)
        .delete(User.deleteUser);

    //  Task Routes
    app.route('/api/tasks')
        .post(Task.addTask)
        .put(Task.updateTask);

    app.route('/api/tasks/:id')
        .get(Task.getTask)
        .delete(Task.deleteTask);

    app.route('/api/tasks/id/:id')
        .get(Task.getTasks);

    //  TimeBlock Routes
    app.route('/api/timeblocks')
        .post(TimeBlock.addTimeBlock)
        .put(TimeBlock.updateTimeBlock);

    app.route('/api/timeblocks/:queryObj') //takes an object that contains a task id and a start time
        .get(TimeBlock.getTimeBlock)
        .delete(TimeBlock.deleteTimeBlock);

    app.route('/api/timeblocks/day/:userDayObj') //takes an object that contains a task id and day
        .get(TimeBlock.getTimeBlocks);
    
    app.route('/api/achievements')
        .post(Achievement.addAchievement)
        .put(Achievement.updateAchievement);

    app.route('/api/achievements/:id') //takes an object that contains a task id and a start time
        .get(Achievement.getAchievement)
        .delete(Achievement.deleteAchievement);

    app.route('/api/userachievements')
        .post(UserAchievement.addUserAchievement)
        .put(UserAchievement.updateUserAchievement);

    app.route('/api/userachievements/:id') //takes an object that contains a task id and a start time
        .get(UserAchievement.getUserAchievement)
        .delete(UserAchievement.deleteUserAchievement);
    
    // OAuth Routes
    app.get('/api/oauth/redirect', Auth.authenticate)
}