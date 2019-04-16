//load the navbar when the page loads
$(document).ready(function () {
    getTask(function (result, status) {
        if (status != "error") {
            console.log(result);
            addSubTasks(result.data.subTasks);
        } else {
            getTask('0', function (result2, status2) {
                if (status2 != "error") {
                    addSubTasks(result2.data.subTasks);
                } else {
                    console.log("No task: ");
                }
            });
        }
    });

    var demoTasks = ["This is an example subtask", "This is another example subtask",
        "This is a test of dynamic adding of tasks", "Hello DROP TABLE"
    ];

    $(".dropdown").data("prevPriority", "btn-secondary"); //default style for priority dropdown


    $("#navbar").load("navbar.html", function () {
        resizeNav();
    });

    // Event handler for the category dropdown menu.
    // When the user clicks a category, the dropdown will change its text to what they selected.
    $(".category-dropdown").click(function (e) {
        $("#categryDropdown").html(e.target.innerHTML);
    });

    // Event handler for the priority dropdown menu.
    // When the user clicks a priority level, the dropdown will change its text and style to what they selected
    $(".priority-dropdown").click(function (e) {
        $("#priorityDropdown").html(e.target
            .innerText) //set the title of the button to the dropdown that was selected.

        $("#priorityDropdown").toggleClass($(".dropdown").data("prevPriority") + " " + e.target
            .id); //set the style so it matches the priority
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
        if ( /*e.which == 13 && */ $(".empty-task").val() != "") { //if the enter key is pressed.
            // console.log($(".empty-task").attr("id").match(/\d+/)[0]);

            //regex to find only the number at the end of the id
            var curId = parseInt($(".empty-task").attr("id").match(/\d+/)[0]) + 1;

            $(".empty-task").after("<span class=\"far fa-trash-alt subtask-checkbox\" id=\"trash" + (curId -
                1) + "style=\"float: right\"></span>");

            $(".empty-task").parent().children(".fa-square").addClass("subtask-checkbox");

            $(".empty-task").removeClass("empty-task"); //first remove the empty-task class from the old task

            $(".task").children(".card-body").children(".subtask-list")
                .append( // add a new empty task to the end of the current list
                    "<div class=\"form-inline\">\
                    <span class=\"far fa-square\" id=\"checkbox" +
                    curId +
                    "\"></span>" +
                    "<textarea class=\"form-control task-textbox border-0 empty-task\" id=\"textbox" + curId +
                    "\"type=\"text\" rows=\"1\"></textarea></div>"
                );
            autosize($('.empty-task'));
            // return false;
        }
    });

    //toggles the checkboxes when a user clicks them
    $(document.body).on("click", ".subtask-checkbox", function (e) {
        this.classList.toggle("fa-square");
        this.classList.toggle("fa-check-square");
    });

    // WHen you click on the delete button of a subtask, we need to remove it from the list.
    // In the future there should be some form of confirmation to delete a subtask, (or maybe an undo button?)
    $(document.body).on("click", ".fa-trash-alt", function (e) {
        e.currentTarget.parentElement
            .remove(); //traverses the tree and removes the parent html from the document.
    });
});

// taks a tasks array that contains an array of subtask strings to add.
function addSubTasks(tasks) {
    var curId = 1; //since this is at the start, we want our ids to start at 1.

    console.log(tasks);

    // inserts each task in the array/object that is passed.
    tasks.forEach(taskDesc => {
        $(".task").children(".card-body").children(".subtask-list")
            .append( // add a new empty task to the end of the current list
                "<div class=\"form-inline\">\
                    <span class=\"far fa-square subtask-checkbox\" id=\"checkbox" +
                curId +
                "\"></span>" +
                "<textarea class=\"form-control task-textbox border-0\" id=\"textbox" + curId +
                "\"type=\"text\" rows=\"1\">" + taskDesc + "</textarea>\
                    <span class=\"far fa-trash-alt\" id=\"trash" + curId +
                "\" style=\"float: right\"></span></div>"
            );
        curId++; //increment the id for each new task that we will add
    });

    //add an empty task to the end of the list so that the user can add more.
    $(".task").children(".card-body").children(".subtask-list")
        .append( // add a new empty task to the end of the current list
            "<div class=\"form-inline\">\
                    <span class=\"far fa-square\" id=\"checkbox" +
            curId +
            "\"></span>" +
            "<textarea class=\"form-control task-textbox border-0 empty-task\" id=\"textbox" + curId +
            "\"type=\"text\" rows=\"1\"></textarea></div>"
        );
    autosize($('textarea'));

    //Placeholder for now since this is not yet attached to any data.
    $("#saveTaskBtn").click(function () {
        window.location.href = './tasklist.html';
    });
}