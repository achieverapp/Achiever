/*
    tasklist.js
    This file is responsible for dealing with dynamic javascript functionality for the tasklist page
    It loads the tasks for the current user and allows them to create and modify tasks.
*/

/**
 * Maps priority numbers to the css styles for them
 */
var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
    "0": "priority-low",
    "1": "priority-med",
    "2": "priority-high",
};

/**
 * Initializes the page, and all event handlers when the page finishes loading
 */
$(document).ready(function () {
    // load the navbar
    $("#navbar").load("/html/navbar.html", onNavBarLoad);

    buildTaskList("sortByDueDate"); //Build the task list, sorting by due date.

    $("#btn-newtask").on("click", loadTaskView); //Load the navbar and add the active class

    //load event handler for changing sort method
    $(".sortby-dropdown-item").click(changeSortMethod);

    // load event handlers for styling of a checkbox
    $(document).on("mouseover", ".task-checkbox", onMouseEnter);
    $(document).on("mouseleave", ".task-checkbox", onMouseLeave);

    // Set up event handler for checking off a task
    $(document).on("click", ".task-checkbox", onTaskChecked);

    // Event handler for when a task is clicked on. Should bring the user to the task view page.
    // Adds a new empty row for the task to allow the user to input another task
    $(document).on("click", ".task-card", taskCardClicked);
});

////////////////////////////////////////////////////////////////////////////////
///////////////////// Event Handlers ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Event handler for when a task card is clicked. Brings the user to the taskview page for the task they clicked on.
 * @param {*} e: click event object
 */
function taskCardClicked(e) {
    var userId = getQueryParam('userId')
    if($(e.target).hasClass('task-checkbox')) {
        return;
    }
    var taskCard
    if (!$(e.target).hasClass('task-card')) {
        taskCard = $(e.target).closest('.task-card')
    }
    else {
        taskCard = $(e.target)
    }
    console.log(taskCard[0].id)
    window.location.href = `/taskview?taskId=${taskCard[0].id}&userId=${userId}&redirect=tasklist`;
}

/**Load event handler for navbar HTML being added to the page */
function onNavBarLoad() {
    $("#nav-tasklist").addClass("nav-active");
}

/** Click event handler for the new task button.
 * Opens the taskview page for a new task, with taskId of 'default'
 */
function loadTaskView() {
    var userId = getQueryParam("userId")
    window.location.href = `/taskview?taskId=default&userId=${userId}`;
}

/**event handler for when the user mouses over a task checkbox */
function onMouseEnter(e) {
    $(e.target).removeClass("check-incomplete").addClass("check-complete");
}

/**event handler for when the user's mouse focus leaves a task checkbox */
function onMouseLeave(e) {
    $(e.target).removeClass("check-complete").addClass("check-incomplete");
}

/**
 * Event handler for when the sort method is changed.
 * @param {*} e: click event arguments
 */
function changeSortMethod(e) {
    $(".sortby-dropdown").each(function () { //set the title of the button to the dropdown that was selected.
        var element = $(this);
        element.html(e.target.innerText);
    });

    $(".sortby-dropdown").data("sortBy", e.target.id);
    buildTaskList(e.target.id);
}

/**
 * Event handler for when a task is clicked to be checked off.
 * Will remove the task from the list and update its checked status on the server
 * TODO: this function needs to update all the subtasks to be checked too (or not??? might not want to do this)
 */
function onTaskChecked() {
    var taskId = $(this).closest('.task-card')[0].id
    console.log('taskid = ' + taskId)
    var task = {
        _id: $(this).closest('.task-card')[0].id,
        completedOn: new Date().toISOString(),
        checked: true
    }
    updateTask(task, function (response, status) {
        console.log('as;lkdfjasl;fkjaslk;fj')
        var cardId = taskId //'#' + taskId
        console.log('task card: ' + taskCard);

    });
    taskCard = document.getElementById(taskId)
    $(taskCard).remove();
    console.log()
    if(0 == $('#overdue-list').find('li').length) {
        $('#overdue-div').hide();
        if(0 == $('#task-list').find('li').length) {
            $('#noTasksMessage').show();
        }
    }


}

////////////////////////////////////////////////////////////////////////////////
///////////////////// General Use functions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Builds the list of tasks for the page with a given sort function.
 * Puts them into two categories, overdue tasks and upcoming tasks.
 * @param sortBy: sorting function to compare each task.
 */
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
        tasks = getUncheckedTasks(tasks)
        if(tasks.length == 0) {
            $('#noTasksMessage').show();
        }
        else {
            $('#noTasksMessage').hide();
        }
        while (upcomingUL.firstChild) {
            upcomingUL.removeChild(upcomingUL.firstChild);
        }
        while (overdueUL.firstChild) {
            overdueUL.removeChild(overdueUL.firstChild);
        }
        var overdue = [];
        tasks.forEach(task => {
            if (task.completed == null && task.checked) {
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

/**
 * Adds a task card on to the page
 * @param {*} task: Task object to add to the page
 */
function buildTaskCard(task) {
    var dueDate = new Date(task.due);
    var taskCardNode = document.createElement("li");
    taskCardNode.id = task._id;
    taskCardNode.classList.add("card");
    taskCardNode.classList.add("task-card");
    taskCardNode.classList.add(priorityToClassMap[task.priority]);
    taskCardNode.innerHTML =
        "<div class='task-card-container'>" +
        "<h2 class='check-incomplete fas fa-check-square align-middle task-checkbox'></h2>" +
        "<div class='align-middle task-card-content'>" +
        "<h3 class='task-card-title' style='display:block'>" + task.title + "</h3>" +
        "<p class='task-due'>Due:&nbsp;" + formatDateTime(dueDate) + "</p>" +
        "<p class='task-category'>Category:&nbsp;" + task.category + "</p>" +
        "</div>" +
        "</div>";
    return taskCardNode;
}

/** Turns a Javascript Date object into local time */
function formatDateTime(date) {
    return date.toLocaleString();
}

/**
 * Retrieved a quer parameter
 * @param {*} param: name of the query parameter that is to e retrieved from the URL
 */
function getQueryParam(param) {
    var url = window.location.href;
    return url.split(`${param}=`)[1].split('&')[0]
}
