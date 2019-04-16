var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
};

function buildTaskList() {
    return buildTaskList(null);
}

function buildTaskList(sortBy) {
    var upcomingUL = document.getElementById("task-list");
    var overdueUL = document.getElementById("overdue-list");
    var tasks;
    getTaskList(function (result, error) {
        tasks = result.data        

        if (sortBy === "sortByPriority") {
            tasks.sort(compareTaskByPriorityDescending);
        } else if (sortBy === "sortByDueDate") {
            tasks.sort(compareTaskByDateAscending);
        }
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
                } else {
                    upcomingUL.appendChild(buildTaskCard(task));
                }
            }
        });
        if (overdue.length == 0) {
            $("#overdue-div").hide();
            $("#sortByDropdown2").show();
        } else {
            $("#sortByDropdown2").hide();
        }
    });
}

function buildTaskCard(task) {    
    var dueDate = new Date(task.due);
    var taskCardNode = document.createElement("li");
    taskCardNode.id = task.id;
    taskCardNode.classList.add("card");
    taskCardNode.classList.add("task-card");
    taskCardNode.classList.add(priorityToClassMap[task.priority]);
    taskCardNode.innerHTML =
        "<div class='task-card-container'>" +
        "<h2 class='fas fa-check-square align-middle task-checkbox task-incomplete'></h2>" +
        "<div class='align-middle task-card-content'>" +
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

function compareTaskByDateAscending(lhs, rhs) {
    var lhsDate = new Date(lhs.due),
        rhsDate = new Date(rhs.due);

    if (lhs.due === rhs.due) {
        return lhs.priority - rhs.priority;
    }
    if (lhsDate > rhsDate) {
        return 1;
    }
    if (lhsDate < rhsDate) {
        return -1;
    }
    return 0;
}

function compareTaskByPriorityDescending(lhs, rhs) {
    if (lhs.priority === rhs.priority) {
        return compareTaskByDateAscending(lhs, rhs);
    }
    return rhs.priority - lhs.priority;
}