var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high"
};

var priorityToName = {
    0: "Low",
    1: "Medium",
    2: "High"
};

//load the navbar when the page loads
$(document).ready(function () {

    //updates the task information from the database.
    getTask(function (result, status) {
        if (result != null && result.success) {
            setTaskInfo(result.data);
        } else {
            console.log(result)
        }
    });

    $(".dropdown").data("prevPriority", "btn-secondary"); //default style for priority dropdown


    $("#navbar").load("navbar.html", function () {
        resizeNav();
    });

    // Event handler for the category dropdown menu.
    // When the user clicks a category, the dropdown will change its text to what they selected.
    $(".category-dropdown").click(function (e) {
        $("#categoryDropdown").html(e.target.innerHTML);
    });

    // Event handler for the priority dropdown menu.
    // When the user clicks a priority level, the dropdown will change its text and style to what they selected
    $(".priority-dropdown").click(function (e) {
        $("#priorityDropdown").html(e.target.innerText) //set the title of the button to the dropdown that was selected.

        $("#priorityDropdown").toggleClass($(".dropdown").data("prevPriority") + " " + e.target.id); //set the style so it matches the priority
        $(".dropdown").data("prevPriority", e.target.id); //save the previous style
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
            console.log("TEST");

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
            console.log("all checkBoxes checked");
            $("#taskCheckBox").addClass("fa-check-square"); //add the check to the title
            $("#taskCheckBox").removeClass("fa-square");
        } else { //There are some unchecked boxes
            console.log("some checkBoxes unchecked");
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
    var date = new Date(task.due).toISOString();
    var day = date.substr(0, 10);
    var time = date.substr(11, 5);
    // var due = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
    console.log(time);
    $("#taskHeader").html(task.title);
    $("#categoryDropdown").html(task.category);
    $("#priorityDropdown").html(priorityToName[task.priority]);
    $("#priorityDropdown").addClass(priorityToClassMap[task.priority]);
    $("#datepicker").val(day);
    $("#timepicker").val(time);
    addSubTasks(task.subTasks);
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
                "   <span class=\"far fa-" + (t.checked ? "check-" : "") + "square subtask-checkbox\" id=\"checkbox" + curId + "\"></span>" +
                "   <textarea class=\"form-control task-textbox border-0\" id=\"textbox" + curId + "\"" +
                "       type=\"text\" rows=\"1\">" + t.title + "</textarea>" +
                "   <span class=\"far fa-trash-alt\" id=\"trash" + curId + "\" style=\"float: right\"></span>" +
                "</div>"
            );
        curId++; //increment the id for each new task that we will add
    });

    addEndTask(curId);
    autosize($('textarea'));

    //Trying to create a task object that can get sent to the server for saving
    $("#saveTaskBtn").click(function () {
        var task = {
            _id: currTaskId,
            subTasks: []
        }

        if ($("#taskCheckBox").hasClass("fa-check-square")) {
            task.checked = true; //save that the task was completed.
            task.completedOn = new Date().toISOString(); //save the time that the task was completed on.
        } else {
            task.checked = false; //save that the task was completed.
            task.completedOn = null; //save the time that the task was not completed
        }

        $(".subtask-display").each(function () {
            if ($(this).children("textarea").val() != "") {
                task.subTasks.push(new SubTask({
                    checked: $(this).children("span.far").hasClass("fa-check-square"),
                    title: $(this).children("textarea").val()
                }));
            }
        });
        console.log(task);

        updateTask(task, function (response, status) {
            console.log(response);
        });
        // window.location.href = './tasklist.html';
    });
}

function addEndTask(curId) {
    //add an empty task to the end of the list so that the user can add more.
    $(".task").children(".card-body").children(".subtask-list")
        .append( // add a new empty task to the end of the current list            
            "<div class=\"form-inline subtask-display\">" +
            "   <span class=\"far fa-square\" id=\"checkbox" + curId + "\"></span>" +
            "   <textarea class=\"form-control task-textbox border-0 empty-task\" id=\"textbox" + curId + "\"" +
            "       type=\"text\" rows=\"1\"></textarea>" +
            "</div>"
        );
}