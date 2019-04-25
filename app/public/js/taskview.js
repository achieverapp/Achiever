/**
 * Maps priority numbers to the css styles for them
 */
var priorityToClassMap = {
  "0": "priority-low",
  "1": "priority-med",
  "2": "priority-high"
};

/**maps priority numbers to priority names */
var priorityToName = {
  0: "Low",
  1: "Medium",
  2: "High",
  "0": "Low",
  "1": "Medium",
  "2": "High"
};

/**maps priority names to priority numbers */
var nameToPriority = {
  "Low": 0,
  "Medium": 1,
  "High": 2
}

/**When the document finished loading, retrieve task information from the server and load all event handlers */
$(document).ready(function () {
  //updates the task information from the database.
  getTask(currTaskId, function (result, status) {
    if (result != null && result.success)
      setTaskInfo(result.data);
  });

  $("#categoryDropdown").data("changed", false); // flags to show whether data from a dropdown was changed;
  $("#priorityDropdown").data("changed", false);
  $(".dropdown").data("prevPriority", "btn-secondary"); //default style for priority dropdown

  //load the navbar when the page loads
  $("#navbar").load("/html/navbar.html");

  // When the save task button is clicked, save the task and send it to the server.
  $("#saveTaskBtn").click(saveTask); //call the saveTask function

  // Event handler for the category dropdown menu.
  // When the user clicks a category, the dropdown will change its text to what they selected.
  $(".category-dropdown").click(categoryDropdownItemChanged);

  // Event handler for the priority dropdown menu.
  // When the user clicks a priority level, the dropdown will change its text and style to what they selected
  $(".priority-dropdown").click(priorityDropdownItemChanged);

  // When the title checkbox is clicked, update the status of all the subtasks checks.
  $("#taskCheckBox").click(titleCheckboxClick);

  // Event handler for when the enter key is pressed on one of the text input forms.
  // Adds a new empty row for the task to allow the user to input another task
  $(document.body).on("keydown", ".empty-task", onTypeInEmptySubTask); //call the onTypeInEmptySubTask function when an empty input

  //toggles the checkboxes when a user clicks them
  $(document.body).on("click", ".subtask-checkbox", checkSubTask); //call the checkSubTask function when a checkbox is clicked.

  // WHen you click on the delete button of a subtask, we need to remove it from the list.
  // In the future there should be some form of confirmation to delete a subtask, (or maybe an undo button?)
  $(document.body).on("click", ".fa-trash-alt", function (e) {
    e.currentTarget.parentElement.remove(); //traverses the tree and removes the parent html from the document.
  });
});

////////////////////////////////////////////////////////////////
//////////// Event handlers ////////////////////////////////////
////////////////////////////////////////////////////////////////

/**
 * Item changed event handler for the category dropdown. Updates the dropdown text with what the user clicked on.
 * Sets the proprty changed flag to true for when the save task button is clicked.
 * @param {*} e: click event object.
 */
function categoryDropdownItemChanged(e) {
  $("#categoryDropdown").html(e.target.innerHTML);
  $("#categoryDropdown").data("changed", true);
}

/**
 * Item changed event handler for the priority dropdown. Updates the dropdown text with what the user clicked on.
 * Sets the proprty changed flag to true for when the save task button is clicked.
 * @param {*} e: click event object.
 */
function priorityDropdownItemChanged(e) {
  $("#priorityDropdown").html(e.target.innerText) //set the title of the button to the dropdown that was selected.

  $("#priorityDropdown").toggleClass($(".dropdown").data("prevPriority") + " " + e.target.id); //set the style so it matches the priority
  $(".dropdown").data("prevPriority", e.target.id); //save the previous style

  $("#priorityDropdown").data("changed", true);
}

/**
 * click event handler for the title checkbox. When this function is called, the task check status is toggled.
 * ALl subtasks check status is also toggled to the status of the title checkbox
 */
function titleCheckboxClick() {
  this.classList.toggle("fa-square"); //toggle the checkbox on the title
  this.classList.toggle("fa-check-square");

  //toggle all the subtasl checkboxes to what the title checkbox is
  if ($("#taskCheckBox").hasClass("fa-check-square")) {
    $(".subtask-checkbox.fa-square").toggleClass("fa-square fa-check-square");
  } else {
    $(".subtask-checkbox.fa-check-square").toggleClass("fa-check-square fa-square");
  }
}

/**
 * Click event handler for when a user types in an empty subtask.
 * Will update the classes in the subtask to flag it as a task that can be sent to the server.
 * Will add another empty subtask to the end, and allow the task to be deleted.
 * @param {*} e: click event variable
 */
function onTypeInEmptySubTask(e) {
  if ($(".empty-task").val() != "") { //if the enter key is pressed.
    //regex to find only the number at the end of the id
    var curId = parseInt($(".empty-task").attr("id").match(/\d+/)[0]) + 1;

    $(".empty-task").after("<span class=\"far fa-trash-alt subtask-checkbox\" id=\"trash" + (curId -
      1) + "style=\"float: right\"></span>");

    $(".empty-task").parent().children(".fa-square").addClass("subtask-checkbox");

    $(".empty-task").removeClass("empty-task"); //first remove the empty-task class from the old task

    addEndTask(curId);
    autosize($('.empty-task'));
  }
}

/**
 * Function to handle a click event on a subtask checkbox. 
 * Toggles the subtask checkbox as well as the task title checkbox if all subtasks are checked
 * @param {*} e: event variable from a click event.
 */
function checkSubTask(e) {
  this.classList.toggle("fa-square");
  this.classList.toggle("fa-check-square");
  if (!$(".subtask-checkbox.fa-square")[0]) { //if there are not any boxes that are unchecked            
    $("#taskCheckBox").addClass("fa-check-square"); //add the check to the title
    $("#taskCheckBox").removeClass("fa-square");
  } else { //There are some unchecked boxes            
    $("#taskCheckBox").removeClass("fa-check-square"); //remove the check from the title
    $("#taskCheckBox").addClass("fa-square");
  }
}

/**
 * Grabs all the data from the current tasks on the page and sends only the data that has changed to be updated on the API server.
 * Once a response is recieved, switches to the taskList Page
 * TODO: show a loading bar and errors if the data does not get sent.
 */
function saveTask() {
  if ($("#taskHeader").val() == "") { //show the user an error if there is no title for the task
    showBlankTitleToast();
    return;
  }

  // Calculate the dueDate from the date and time input forms.
  var date = new Date($("#datepicker").val()).toISOString().substr(0, 10); //Grab just the date in ISO format
  var time = $("#timepicker").val(); //Grab the time in ISO format
  var dueDate = new Date(date + "T" + time + ":00.000Z"); //Cobine them into one time in ISO format
  dueDate = new Date(dueDate.valueOf() + (new Date().getTimezoneOffset() * 60000)) //fix for the time zone difference

  var task = { // Task schema with everything that will be changed each time an update is called.
    _id: currTaskId,
    owner: currUserId,
    title: $("#taskHeader").val(), // Right now we always send the title, but we should change this in the future.
    subTasks: [], // We always want to sent all subtasks as far as I can tell (possibly store a copy of the original task and compare it with the new one to decide what to send)
    due: dueDate.toISOString() //Always want to send the dueDate unless the method above is implemented.
  }

  if ($("#taskCheckBox").hasClass("fa-check-square")) {
    task.checked = true; //save that the task was completed.
    task.completedOn = new Date().toISOString(); //save the time that the task was completed on.
  } else {
    task.checked = false; //save that the task was completed.
    task.completedOn = null; //save the time that the task was not completed
  }

  if ($("#priorityDropdown").data("changed")) //send the new priority only if it is changed
    task.priority = nameToPriority[$("#priorityDropdown").html()];

  if ($("#categoryDropdown").data("changed")) //send the new category only if it is changed
    task.category = $("#categoryDropdown").html();

  $(".subtask-display").each(function () { //Load all the subtasks from the webpage
    if ($(this).children("textarea").val() != "") { // Only load them if there is a task with text in it
      task.subTasks.push(new SubTask({ //add each subtask to the array
        checked: $(this).children("span.far").hasClass("fa-check-square"),
        title: $(this).children("textarea").val()
      }));
    }
  });

  // Update the task and then switch to the tasklist page only after the data is sent.
  updateTask(task, function (response, status) {
    window.location.href = `/tasklist?userId=${currUserId}`; //need to change pages only after the task is updated
  });
}


////////////////////////////////////////////////////////////////
//////////// General use functions /////////////////////////////
////////////////////////////////////////////////////////////////


/**
 * Load the data from a task object on to the page
 * @param task: Task object that will be loaded into the page
 */
function setTaskInfo(task) {
  var DueDate = task.due == null ? new Date() : new Date(task.due);
  console.log(DueDate.valueOf());
  DueDate = new Date(DueDate.valueOf() - (new Date().getTimezoneOffset() * 60000))
  var date = DueDate.toISOString();
  console.log(date);
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

/**
 *  takes a tasks array that contains an array of subtask strings to add.
 */
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

  addEndTask(curId); //Create an empty input at the end so the user can add a new subtask
  autosize($('textarea')); //set the new textarea to be autosized.
}

/**
 *add an empty task to the end of the list that allows the user to type in there.
 *When the user types in this last input it will turn into a normal subtask and then
 *generate another endTask
 */
function addEndTask(curId) {
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