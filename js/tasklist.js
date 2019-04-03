//import { Task } from task;

var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
};

// generate the task list
// TODO: move this code into its own function.
function buildTaskList() {
    var upcomingUL = document.getElementById("task-list");
    var overdueUL = document.getElementById("overdue-list");
    var tasks = getTaskList();
    var overdue = [];

    while (upcomingUL.firstChild) {
        upcomingUL.removeChild(upcomingUL.firstChild);
    }
    while (overdueUL.firstChild) {
        overdueUL.removeChild(overdueUL.firstChild);
    }

    tasks.forEach(task => {
        if (task.completed == null) {
            var due = new Date(task.due);
            var today = new Date();
            if (today > due) {
                overdue.push(task);
                overdueUL.appendChild(buildTaskCard(task))
            }
            else {
                upcomingUL.appendChild(buildTaskCard(task));
            }
        }
    });
    if (overdue.length == 0) {
        $("#overdue-div").hide();
    }
}


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
        "<h3 class='task-card-title' style='display:block'>" + task.title + "</h3>" +
        "<p class='task-due'>Due:&nbsp;" + formatDateTime(dueDate) + "</p>" +
        "<p class='task-category'>Category:&nbsp;" + task.category + "</p>" +
        "</div>" +
        "</div>";
    return taskCardNode;
}

function formatDateTime(date) {
    return date.toLocaleString();
}