var tasks = [
    { id: 2, title: "Do some fitness stuff cuz summer beach-bod obvs", due: "2019-04-10T23:59:59.999-07:00", category: "wellness", priority: 0 },
    { id: 0, title: "Do some work stuff cuz deadlines n wutnot", due: "2019-04-14T23:59:59.999-07:00", category: "work", priority: 2 },
    { id: 1, title: "Do some chore stuff cuz your house is a mess", due: "2019-03-09T23:59:59.999-07:00", category: "home", priority: 1 },
];

function getTaskList() {
    return tasks;
}

function getTask(id) {
    var i = 0;
    while(tasks[i].id !== id && i < tasks.length) {
        i++;
    }
    if(i === tasks.length) {
        return null;
    }
    return tasks[i];
}

function updateTask(task) {
    var i = 0;
    while(tasks[i].id !== task.id && i < tasks.length) {
        i++;
    }
    if(i === tasks.length) {
        tasks.push(task);
    }
    else {
        tasks[i] = task;
    }
}