var priorityToClassMap = {
    "0": "priority-low",
    "1": "priority-med",
    "2": "priority-high"
};

var priorityToName = {
    0: "Low",
    1: "Medium",
    2: "High",
    "0": "Low",
    "1": "Medium",
    "2": "High"
};

var nameToPriority = {
    "Low": 0,
    "Medium": 1,
    "High": 2
}

//load the navbar when the page loads
$(document).ready(function () {
    $("#categoryDropdown").data("changed", false); // flags to show whether data from a dropdown was changed;
    $("#priorityDropdown").data("changed", false);

    //updates the task information from the database.
    getTask(currTaskId, function (result, status) {
        if (result != null && result.success) {
            setTaskInfo(result.data);
            console.log(result);
        } else {
            console.log(result)
        }
    });

    $(".dropdown").data("prevPriority", "btn-secondary"); //default style for priority dropdown


    $("#navbar").load("/html/navbar.html", function () {
        resizeNav();
    });

    // Event handler for the category dropdown menu.
    // When the user clicks a category, the dropdown will change its text to what they selected.
    $(".category-dropdown").click(function (e) {
        $("#categoryDropdown").html(e.target.innerHTML);
        $("#categoryDropdown").data("changed", true);
    });

    // Event handler for the priority dropdown menu.
    // When the user clicks a priority level, the dropdown will change its text and style to what they selected
    $(".priority-dropdown").click(function (e) {
        $("#priorityDropdown").html(e.target.innerText) //set the title of the button to the dropdown that was selected.

        console.log(e.target.id);
        $("#priorityDropdown").toggleClass($(".dropdown").data("prevPriority") + " " + e.target.id); //set the style so it matches the priority
        $(".dropdown").data("prevPriority", e.target.id); //save the previous style

        $("#priorityDropdown").data("changed", true);
    });

    // A nice feature might be that when we click the big checkbox
    //need to check a or uncheck all the subtasks
    $("#taskCheckBox").click(function () {
        this.classList.toggle("fa-square"); //toggle the checkbox on the title
        this.classList.toggle("fa-check-square");

        //toggle all the subtasl checkboxes to what the title checkbox is
        if ($("#taskCheckBox").hasClass("fa-check-square")) {
            $(".subtask-checkbox.fa-square").toggleClass("fa-square fa-check-square");
        } else {
            $(".subtask-checkbox.fa-check-square").toggleClass("fa-check-square fa-square");
        }
    });

    // Event handler for when the enter key is pressed on one of the text input forms.
    // Adds a new empty row for the task to allow the user to input another task
    $(document.body).on("keydown", ".empty-task", function (e) {
        if ($(".empty-task").val() != "") { //if the enter key is pressed.
            //regex to find only the number at the end of the id
            var curId = parseInt($(".empty-task").attr("id").match(/\d+/)[0]) + 1;

            $(".empty-task").after("<span class=\"far fa-trash-alt subtask-checkbox\" id=\"trash" + (curId -
                1) + "style=\"float: right\"></span>");

            $(".empty-task").parent().children(".fa-square").addClass("subtask-checkbox");

            $(".empty-task").removeClass("empty-task"); //first remove the empty-task class from the old task

            addEndTask(curId);
            autosize($('.empty-task'));
            // return false;
        }
    });

    //toggles the checkboxes when a user clicks them
    $(document.body).on("click", ".subtask-checkbox", function (e) {
        this.classList.toggle("fa-square");
        this.classList.toggle("fa-check-square");
        if (!$(".subtask-checkbox.fa-square")[0]) { //if there are not any boxes that are unchecked
            // console.log("all checkBoxes checked");
            $("#taskCheckBox").addClass("fa-check-square"); //add the check to the title
            $("#taskCheckBox").removeClass("fa-square");
        } else { //There are some unchecked boxes
            // console.log("some checkBoxes unchecked");
            $("#taskCheckBox").removeClass("fa-check-square"); //remove the check from the title
            $("#taskCheckBox").addClass("fa-square");
        }
    });

    // WHen you click on the delete button of a subtask, we need to remove it from the list.
    // In the future there should be some form of confirmation to delete a subtask, (or maybe an undo button?)
    $(document.body).on("click", ".fa-trash-alt", function (e) {
        e.currentTarget.parentElement.remove(); //traverses the tree and removes the parent html from the document.
    });
});

function setTaskInfo(task) {
    var date = task.due == null ? new Date().toISOString() : new Date(task.due).toISOString();
    var day = date.substr(0, 10);
    var time = date.substr(11, 5);

    $("#datepicker").val(day); //set the dau and time inputs to contain the values retrieved from the API
    $("#timepicker").val(time);

    $("#taskHeader").html(task.title); // set the title to the one from the API
    if (task.category != null) // If the category is saved, show it
        $("#categoryDropdown").html(task.category);
    if (task.priority != null) { // If the priority is saved, show it
        $("#priorityDropdown").html(priorityToName[task.priority]);
        $("#priorityDropdown").addClass(priorityToClassMap[task.priority]);
        $(".dropdown").data("prevPriority", priorityToClassMap[task.priority]); //save the previous style
    }

    if (task.checked == "true") { //if the task is checked
        $("#taskCheckBox").addClass("fa-check-square"); //add the check to the title
        $("#taskCheckBox").removeClass("fa-square");
    } else { //There are some unchecked boxes
        $("#taskCheckBox").removeClass("fa-check-square"); //remove the check from the title
        $("#taskCheckBox").addClass("fa-square");
    }

    addSubTasks(task.subTasks); // Add the subtasks to the list
}

// taks a tasks array that contains an array of subtask strings to add.
function addSubTasks(tasks) {
    var curId = 1; //since this is at the start, we want our ids to start at 1.

    // inserts each task in the array/object that is passed.
    tasks.forEach(task => {
        t = new SubTask(task);
        $(".task").children(".card-body").children(".subtask-list")
            .append( // add a new empty task to the end of the current list
                "<div class=\"form-inline subtask-display\">" +
                "   <span class=\"far fa-" + (t.checked == "true" ? "check-" : "") + "square subtask-checkbox\" id=\"checkbox" + curId + "\"></span>" +
                `   <textarea class='form-control task-textbox border-0' id='textbox${curId}'` +
                `       type='text' rows='1' placeholder='Add a subtask here...'>${t.title}</textarea>` +
                "   <span class=\"far fa-trash-alt\" id=\"trash" + curId + "\" style=\"float: right\"></span>" +
                "</div>"
            );
        curId++; //increment the id for each new task that we will add
    });

    addEndTask(curId);
    autosize($('textarea'));

    //Trying to create a task object that can get sent to the server for saving
    $("#saveTaskBtn").click(function () {
        if ($("#taskHeader").val() == "") {
            showBlankTitleToast();
            return;
        }
        var date = new Date($("#datepicker").val()).toISOString().substr(0, 10); // Need to figure out how to add these two times so they can be sent to the server.
        var time = $("#timepicker").val();
        var dueDate = new Date(date + "T" + time + ":00.000Z");

        var task = {
            _id: currTaskId,
            owner: currUserId,
            title: $("#taskHeader").val(), // Right now we always send the title, but we should change this in the future.
            subTasks: [],
            due: dueDate.toISOString()
        }

        if ($("#taskCheckBox").hasClass("fa-check-square")) {
            task.checked = true; //save that the task was completed.
            task.completedOn = new Date().toISOString(); //save the time that the task was completed on.
        } else {
            task.checked = false; //save that the task was completed.
            // task.completedOn = null; //save the time that the task was not completed
        }

        console.log($("#priorityDropdown").data("changed"), $("#categoryDropdown").data("changed"))

        if ($("#priorityDropdown").data("changed")) //send the new priority only if it is changed
            task.priority = nameToPriority[$("#priorityDropdown").html()];

        if ($("#categoryDropdown").data("changed")) //send the new category only if it is changed
            task.category = $("#categoryDropdown").html();

        $(".subtask-display").each(function () {
            if ($(this).children("textarea").val() != "") {
                task.subTasks.push(new SubTask({
                    checked: $(this).children("span.far").hasClass("fa-check-square"),
                    title: $(this).children("textarea").val()
                }));
            }
        });

        updateTask(task, function (response, status) {});
        window.location.href = `/tasklist?userId=${currUserId}`;
    });
}

function addEndTask(curId) {
    //add an empty task to the end of the list so that the user can add more.
    $(".task").children(".card-body").children(".subtask-list")
        .append( // add a new empty task to the end of the current list
            "<div class=\"form-inline subtask-display\">" +
            `   <span class='far fa-square' id='checkbox${curId}'></span>` +
            `   <textarea class='form-control task-textbox border-0 empty-task' id='textbox${curId}'` +
            `       type='text' rows='1' placeholder='Add a subtask here...'></textarea>` +
            "</div>"
        );
}

/**
 * Show a toast notifying the user that the timeblock could not be created
 * due to a time conflict with another timeblock
 */
function showBlankTitleToast() {
    $("#toastTitle").html("There was a problem saving your task");
    $("#toastSubtitle").html("");
    $("#toastBody").html("Cannot save tasks without a title. Please enter a description of your task in the title box.");
    $('.toast').toast('show');
}