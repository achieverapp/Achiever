var Task = function (task) {
    this.owner = task.owner == null ? null : task.owner;
    this.title = task.title == null ? null : task.title;
    this.category = task.category == null ? none : task.category;;
    this.priority = task.priority == null ? 0 : task.priority;
    this.subTasks = task.subTasks == null ? [] : task.subTasks;
    this.timeBlocks = task.timeBlocks == null ? [] : task.timeBlocks;
    this.due = task.due == null ? new Date() : task.due;
}

var User = function (user) {
    this.name = user.name == null ? null : user.name;
    this._id = user._id == null ? null : user._id;
    this.savedTasks = user.savedTasks == null ? [] : user.savedTasks;
}

module.exports = {
    Task,
    User
};