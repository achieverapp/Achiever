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
    getUser(showName);
    $(".sortby-dropdown").data("sortBy", 'sortByCompletionDate');
    buildTaskList(); //Build the task list, sorting by due date and calling the getTasksInDateRange

    //load event handler for changing sort method
    $(".sortby-dropdown-item").click(changeSortMethod);

    // Set up event handler for checking off a task
    $(document).on("click", ".task-checkbox", onTaskUnchecked);

    // Event handler for when a task is clicked on. Should bring the user to the task view page.
    // Adds a new empty row for the task to allow the user to input another task
    $(document).on("click", ".task-card", taskCardClicked);
    $(document).on("click", ".sorting-selector", onChangeFilter); //When the filter style is changed

    // load event handlers for styling of a checkbox
    $(document).on("mouseover", ".task-checkbox", onMouseEnter);
    $(document).on("mouseleave", ".task-checkbox", onMouseLeave);
});

////////////////////////////////////////////////////////////////////////////////
///////////////////// Event Handlers ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Event handler for retrieving a user's name and setting it to the HTML element for the page
 */
function showName(result, error) {
    console.log(result);
    $("#UserName").html(result.data.name);
}

/**event handler for when the user mouses over a task checkbox */
function onMouseEnter(e) {
    $(e.target).removeClass("check-complete").addClass("check-incomplete");
}

/**event handler for when the user's mouse focus leaves a task checkbox */
function onMouseLeave(e) {
    $(e.target).removeClass("check-incomplete").addClass("check-complete");
}

/**
 * Event handler for when a task card is clicked. Brings the user to the taskview page for the task they clicked on.
 * @param {*} e: click event object
 */
function taskCardClicked(e) {
    var userId = getQueryParam('userId')
    if ($(e.target).hasClass('task-checkbox')) {
        return;
    }
    var taskCard
    if (!$(e.target).hasClass('task-card')) {
        taskCard = $(e.target).closest('.task-card')
    } else {
        taskCard = $(e.target)
    }
    console.log(taskCard[0].id)
    window.location.href = `/taskview?taskId=${taskCard[0].id}&userId=${userId}&redirect=progress`;
}

function onTaskUnchecked() {
    var taskId = $(this).closest('.task-card')[0].id
    console.log('taskid = ' + taskId)
    var task = {
        _id: $(this).closest('.task-card')[0].id,
        completedOn: null,
        checked: false
    }
    updateTask(task, function (response, status) {
        console.log('as;lkdfjasl;fkjaslk;fj')
        var cardId = taskId //'#' + taskId
        console.log('task card: ' + taskCard);

    });
    taskCard = document.getElementById(taskId)
    $(taskCard).remove();
}

/**Load event handler for navbar HTML being added to the page */
function onNavBarLoad() {
    $("#nav-progress").addClass("nav-active");
}

/** Click event handler for the new task button.
 * Opens the taskview page for a new task, with taskId of 'default'
 */
function loadTaskView() {
    var userId = getQueryParam("userId")
    window.location.href = `/taskview?taskId=default&userId=${userId}`;
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
    buildTaskList();
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// General Use functions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Builds the list of tasks for the page with a given sort function.
 * Puts them into two categories, overdue tasks and upcoming tasks.
 * @param sortBy: sorting function to compare each task.
 */
function buildTaskList() {
    var completedUL = document.getElementById("completed-list");
    var tasks;
    var sortBy = $(".sortby-dropdown").data("sortBy")
    getTaskList(function (result, error) {
        tasks = result.data
        if (sortBy === "sortByPriority") {
            tasks.sort(compareTaskByPriorityDescending);
        } else if (sortBy === "sortByDueDate") {
            tasks.sort(compareTaskByDateDescending);
        } else if (sortBy === 'sortByCompletionDate') {
            tasks.sort(compareTaskByCompletionDateDescending)
        }

        var today = new Date();
        var monday = getMondayOfCurrentWeek(today)
        var endOfWeek = getOffsetDate(monday, 7)
        var dueTasks = getTasksInDateRange(tasks, 'due', monday, endOfWeek) //gets all tasks for the week
        var completedDueTasks = getCheckedTasks(dueTasks)
        console.log(dueTasks, completedDueTasks)
        //console.log(tasks.length)
        var completePercent = Math.floor((completedDueTasks.length / dueTasks.length) * 100) + "%"; //calculate the percentage as a string
        console.log(completePercent)
        $("#weeklyProgress").css('width', completePercent).html(completePercent); //set the HTML element with the new properties

        tasks = getCheckedTasks(tasks)
        if ($('.week-selector.active:visible').length == 1) { // show this week's that the user has checked off
            console.log("sorting by week");
            tasks = getTasksInDateRange(tasks, 'completedOn', monday, endOfWeek)
        }

        // } else { //show all tasks that the user has checked off
        //     tasks = getCheckedTasks(tasks)
        // }

        while (completedUL.firstChild) { //clear all the tasks
            completedUL.removeChild(completedUL.firstChild);
        }

        tasks.forEach(task => { //add all the tasks
            if (task.checked) {
                completedUL.appendChild(buildTaskCard(task));
            }
        });
    });
}

/**
 * Adds a task card on to the page
 * @param {*} task: Task object to add to the page
 */
function buildTaskCard(task) {
    var completeDate = new Date(task.completedOn);
    var taskCardNode = document.createElement("li");
    taskCardNode.id = task._id;
    taskCardNode.classList.add("card");
    taskCardNode.classList.add("task-card");
    taskCardNode.classList.add(priorityToClassMap[task.priority]);
    taskCardNode.innerHTML =
        "<div class='task-card-container'>" +
        "<h2 class='fas fa-check-square align-middle task-checkbox check-complete'></h2>" +
        "<div class='align-middle task-card-content'>" +
        "<h3 class='task-card-title' style='display:block'>" + task.title + "</h3>" +
        "<p class='task-due'>Completed:&nbsp;" + formatDateTime(completeDate) + "</p>" +
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

function onChangeFilter() {
    console.log("resetting filter")
    $('.sorting-selector:hidden').toggleClass("active", "inactive")
    buildTaskList(); //Build the task list, sorting by due date and calling the getTasksInDateRange
}