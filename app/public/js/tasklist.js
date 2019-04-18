var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
    "0": "priority-low",
    "1": "priority-med",
    "2": "priority-high",
};

$(document).ready(function () {
    // load the navbar
    $("#navbar").load("/html/navbar.html", function () {
        $("#nav-tasklist").addClass("nav-active");
        resizeNav();
    });

    // attach task data to body
    var tasks = getTaskList();
    $(document.body).data("tasks", tasks);

    buildTaskList("sortByDueDate");
    $("#nav-tasklist").addClass("nav-active");

    $("#btn-newtask").on("click", function () {
        console.log("test");
        var userId = getQueryParam("userId")
        window.location.href = `/taskview?taskId=default&userId=${userId}`;
    });

    $(".sortby-dropdown-item").click(function (e) {
        $(".sortby-dropdown").each(function () { //set the title of the button to the dropdown that was selected.
            var element = $(this);
            element.html(e.target.innerText);
        });

        $(".sortby-dropdown").data("sortBy", e.target.id);
        buildTaskList(e.target.id);
    });
});

$(document).on("click", ".task-checkbox", function () {
    taskCard = $(this).closest('.task-card');
    id = Number(taskCard[0].id);
    task = getTask(id);
    var now = new Date();
    task.completed = now.toISOString();
    updateTask(task); //need to make this update the task on the server side.
    console.log(JSON.stringify(task));
    var sortBy = $("#sortByDropdown").data("sortBy");
    buildTaskList(sortBy);
});

$(document).on("mouseover", ".task-checkbox", function (e) {
    $(e.target).removeClass("check-incomplete").addClass("check-complete");
});

$(document).on("mouseleave", ".task-checkbox", function (e) {
    $(e.target).removeClass("check-complete").addClass("check-incomplete");
});

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

    // Event handler for when a task is clicked on. Should bring the user to the task view page.
    // Adds a new empty row for the task to allow the user to input another task
    $(document.body).on("click", ".task-card", function (e) {
        var userId = getQueryParam('userId')
        if ($(e.target).hasClass("task-card-container")) {
            window.location.href = `/taskview?taskId=${e.target.parentElement.id}&userId=${userId}`;
        } else {
            window.location.href = `/taskview?taskId=${e.target.id}&userId=${userId}`;
        }
    });
}

function buildTaskCard(task) {
    var dueDate = new Date(task.due);
    var taskCardNode = document.createElement("li");
    taskCardNode.id = task._id;
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

function getQueryParam(param) {
    var url = window.location.href;
    return url.split(`${param}=`)[1].split('&')[0]
}