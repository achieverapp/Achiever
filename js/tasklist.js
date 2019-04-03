//import { Task } from task;

var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
};

function buildTaskCard(task) {
    var dueDate = new Date(task.due)
    var taskCardNode = document.createElement("li");
    taskCardNode.id = task.id;
    taskCardNode.classList.add("card");
    taskCardNode.classList.add("task-card");
    taskCardNode.classList.add(priorityToClassMap[task.priority]);
    taskCardNode.innerHTML =
        "<div class='container'>" +
        "<h2 class='fa fa-check-square align-middle task-checkbox'></h2>" +
        "<div class='align-middle' style='display:inline-block; padding-left:16px; max-width:90%'>" +
        "<h3 class='task-title' style='display:block'>" + task.title + "</h3>" +
        "<p class='task-due'>Due:&nbsp;" + formatDateTime(dueDate) + "</p>" +
        "<p class='task-category'>Category:&nbsp;" + task.category + "</p>" +
        "</div>" +
        "</div>";
    return taskCardNode;
}

function formatDateTime(date) {
    var dateStr = "" + 
        date.getMonth() + "/" + 
        date.getDay() + "/" + 
        date.getFullYear() + " - " + 
        date.getHours() + ":" + 
        date.getMinutes();
    return date.toLocaleString();
    return dateStr;
}