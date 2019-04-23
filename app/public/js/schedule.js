/*
    schedule.js
    This file is responsible for dealing with dynamic javascript functionality for the schedule page
    It loads the timeblocks for the current user and allows them to create and modify timeblocks.
*/

var currentDay // GLOBAL FOR THE PAGE. PROBABLY WANT TO CHANGE IN THE FUTURE

/**
 * When the document is ready, initialize the page by setting event handlers, and generating or loading the necessary html
 */
$(document).ready(function () {
    currentDay = new Date()
    $("#selectedDate").html(currentDay.toDateString() + ":")

    $("#navbar").load("/html/navbar.html", function () { //load the navbar at the top of the page
        $("#nav-schedule").addClass("nav-active")
        resizeNav()
    })
    generateTableRows(5, 24) //generates tables for the whole 24 hour day
    addTimeblocksToPage() // add timeblocks from the API server
    loadModalDropdown()


})

$(document.body).on('dragover', 'tr', onTrDragover)
$(document.body).on('dragstart', '.time-block-card', onTimeblockCardDragstart)
$(document.body).on("click", ".bucket-empty", onBucketEmptyClick)
$(document.body).on('click', '#btnNextDay', onBtnNextDayClick)
$(document.body).on('click', '#btnPrevDay', onBtnPrevDayClick)
$(document.body).on('drop', 'tr', onTimeblockDropped)
$(document.body).on("click", ".task-dropdown-item", onTaskDropdownItemClick)
$(document.body).on("click", ".input-minus", onInputMinusClick)
$(document.body).on("click", ".input-plus", onInputPlusClick)
$(document.body).on('click', '#btnSave', onBtnSaveClick)

////////////////////////////////////////////////////////////////////////////////
///////////////////// Event Handlers ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * store the id of the starting table row in the drag event dataTransfer
 * @param {*} e: event object
 */
function onTimeblockCardDragstart(e) {
    e.originalEvent.dataTransfer.setData("text", $(this).data('parentId'))
}

/**
 * Allow dragging timeblocks over tr elements
 * @param {*} e: event object
 */
function onTrDragover(e) {
    e.preventDefault()
}

/**
 * Click event handler for empty time slot. When an empty time slot in the schedule is clicked, open the timeblock editing modal,
 * and set the times based on the time clicked on.
 */
function onBucketEmptyClick () {
    var id = $(this).closest('tr')[0].id
    var temp = id.split('-') // empty time block's ids are displayed as times in 24hr format
    var hour24 = parseInt(temp[1])
    var hour = hour24 % 12
    var endHour = hour + 1 // default timeblock length is 1 hour.
    var quarter = parseInt(temp[2])

    // Showing whether the time selected is AM or PM
    if (hour24 >= 12) {
        $("#optionStartAM").parent().removeClass("active")
        $("#optionStartPM").parent().addClass("active")
    } else {
        $("#optionStartAM").parent().addClass("active")
        $("#optionStartPM").parent().removeClass("active")
    }

    // Showing whether the default 1 hour later end time is AM or PM
    if (hour24 + 1 >= 12 && hour24 + 1 < 24) {
        $("#optionEndAM").parent().removeClass("active")
        $("#optionEndPM").parent().addClass("active")
    } else {
        $("#optionEndAM").parent().addClass("active")
        $("#optionEndPM").parent().removeClass("active")
    }

    hour = (hour % 12 == 0) ? 12 : hour
    endHour = (endHour % 12 == 0) ? 12 : endHour

    // Padding times that are less than 10 with a 0 to make them uniform
    if (quarter < 10) {
        quarter = "0" + quarter.toString()
    }
    if (hour < 10) {
        hour = "0" + hour.toString()
        console.log(hour)
        console.log(hour % 12)
    }
    if (endHour < 10) {
        endHour = "0" + endHour.toString()
    }

    // setting the actual start and end times in the modal.
    $("#inputStartHour").val(hour)
    $("#inputEndHour").val(endHour)
    $("#inputEndMinute").val(quarter)
    $("#inputStartMinute").val(quarter)
    $("#timeblockEditModal").modal("show") //open the modal
}

function onBtnNextDayClick() {
    $('.fa-spinner').show();
    currentDay.setTime(currentDay.getTime() + 86400000)
    $("#selectedDate").html(currentDay.toDateString() + ":")
    $(".timeblock-row").remove()
    generateTableRows(5, 24) //generates tables for the whole 24 hour day
    addTimeblocksToPage() // add timeblocks from the API server
}

function onBtnPrevDayClick() {
    $('.fa-spinner').show();
    currentDay.setTime(currentDay.getTime() - 86400000)
    $("#selectedDate").html(currentDay.toDateString() + ":")
    $(".timeblock-row").remove()
    generateTableRows(5, 24) //generates tables for the whole 24 hour day
    addTimeblocksToPage() // add timeblocks from the API server
}

/**
 * click event handler for modal save button. Gets information from modal and generates a new timeblock using that information
 */
function onBtnSaveClick() {
    var startHour = Number($("#inputStartHour").val()),
        startMinute = Number($("#inputStartMinute").val()),
        startIsPM = $("#optionStartPM").closest("label").hasClass('active'),
        endHour = Number($("#inputEndHour").val()),
        endMinute = Number($("#inputEndMinute").val()),
        endIsPM = $("#optionEndPM").closest("label").hasClass('active')
    startHour = timeTo24(startHour, startIsPM)
    endHour = timeTo24(endHour, endIsPM)

    if (!isTimeValid(startHour, startMinute, endHour, endMinute)) {
        showInvalidTimeToast()
        return
    }
    var nRows = ((endHour - startHour) * 4) - (startMinute / 15) + (endMinute / 15);
    if (hasOverlaps(startHour, startMinute, nRows)) {
        showOverlapToast()
        return
    }
    taskId = $("#taskDropdown").data("taskId");
    if (taskId == null || typeof taskId === 'undefined') {
        showNoTaskToast()
        return
    }
    endHourStr = Number(endHour) < 10 ? "0" + endHour : endHour
    endMinuteStr = Number(endMinute) < 10 ? "0" + endMinute : endMinute
    endTimeStr = endHourStr + ':' + endMinuteStr
    startHourStr = Number(startHour) < 10 ? "0" + startHour : startHour
    startMinuteStr = Number(startMinute) < 10 ? "0" + startMinute : startMinute
    startTimeStr = startHourStr + ':' + startMinuteStr
    var timeBlockObj = createTimeblockObject(startHourStr + ":" + startMinuteStr, endHourStr + ":" + endMinuteStr, taskId)
    addTimeBlock(timeBlockObj, function (response, status) {
        console.log(response); //Debug
        if (response.success)
            addTimeblockToPage(startHour, startMinute, nRows, taskId, response.data._id)
    })
}

/**
 * Click event handler for number input plus buttons. When plus is clicked, increment the corresponding input value.
 */
function onInputPlusClick() {
    var inputGroup = $(this).closest(".input-group")[0];
    var input = $(inputGroup).find("input")[0];
    var currentVal = Number($(input).val());
    var newVal = currentVal;
    var max = Number($(input).prop("max"))
    var step = Number($(input).prop("step"))
    if (currentVal < max || null == max) {
        if (step) {
            newVal += step;
        } else {
            newVal++;
        }
    }
    if (newVal < 10) {
        newVal = "0" + newVal;
    }
    $(input).val(newVal);
}

/**
 * Click event handler for number input minus buttons. When minus is clicked, decrement the corresponding input value.
 */
function onInputMinusClick() {
    var inputGroup = $(this).closest(".input-group")[0];
    var input = $(inputGroup).find("input")[0];
    var min = Number($(input).prop("min"))
    var step = Number($(input).prop("step"))
    var currentVal = Number($(input).val());
    var newVal = currentVal;
    if (currentVal > min || null == min) {
        if (step) {
            newVal -= step;
        } else {
            newVal--;
        }
    }
    if (newVal < 10) {
        newVal = "0" + newVal;
    }
    $(input).val(newVal);
}

/**
 *
 * @param {*} e: event object for corresponding click event
 */
function onTaskDropdownItemClick(e) {
    console.log('task dropdown item click')
    // TODO: check still not creating correct Id
    console.log((e.target.id).split(':')[1]); //not creating the correct ID
    $("#taskDropdown").html(e.target.innerHTML);
    taskId = (e.target.id).split(':')[1];
    $("#taskDropdown").data("taskId", taskId);
}

/**
 * Event handler for timeblock drop event. Moves the timeblock to the time it was dropped on.
 * @param {*} event: drop event object
 */
function onTimeblockDropped(event) {
    event.preventDefault();
    var id = event.originalEvent.dataTransfer.getData("text");
    var taskId = $(id).children().find('.time-block-card');
    var targetId = $(event.target).closest('tr')[0].id;
    var timeBlockID = $(id).children().find('.time-block-card')[0].id; //Gets the id of the timeblock which is stored as the div id
    var temp = targetId.split('-');
    var hour = Number(temp[1]);
    var minute = Number(temp[2]);
    var nRows = $(id).children().find('.time-block-card').data('nRows');
    var taskId = $(id).children().find('.time-block-card').data('taskId');

    if (!hasOverlaps(hour, minute, nRows)) {
        removeTimeblockFromPage(id);
        addTimeblockToPage(hour, minute, nRows, taskId, timeBlockID);
        var endHour = Number(hour) + Math.floor(nRows / 4); //calculate the end times
        var endMinute = Number(minute) + ((nRows % 4) * 15);
        endHour = endHour < 10 ? "0" + endHour : endHour; // pad all times with a 0 if they need it
        endMinute = endMinute < 10 ? "0" + endMinute : endMinute;
        var startHour = Number(hour) < 10 ? "0" + hour : hour;
        var startMinute = Number(minute) < 10 ? "0" + minute : minute;
        var timeBlockObj = createTimeblockObject(startHour + ":" + startMinute, endHour + ":" + endMinute, taskId); //create a new timeBLock with those times
        timeBlockObj._id = timeBlockID; //add the timeBLock ID
        updateTimeBlock(timeBlockObj, function (response, status) { //update it on the server side.
            console.log(response); //Debug
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// Document manipulation functions //////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Queries the model for all the timeblocks in the current day, and adds them to the schedule.
 */
function addTimeblocksToPage() {
    getTimeBlocks({
        day: currentDay.toISOString().substr(0, 10),
        owner: currUserId
    }, function (response, status) {
        if (status == "success") {
            response.data.forEach(timeBlock => {
                var startHour = Number(timeBlock.startDate.substr(11, 2));
                var startMinute = Number(timeBlock.startDate.substr(14, 2));
                var endHour = Number(timeBlock.endDate.substr(11, 2));
                var endMinute = Number(timeBlock.endDate.substr(14, 2));
                var nRows = ((endHour - startHour) * 4) - (startMinute / 15) + (endMinute / 15);
                addTimeblockToPage(startHour, startMinute, nRows, timeBlock.task, timeBlock._id);
            })
        }
        $('.fa-spinner').hide();
        //$('.schedule-table').show();
    });
}

/**
 * Queries the model for a list of all the user's tasks, and populates the dropdown list with the titles of the tasks.
 */
function loadModalDropdown() {
    var tasks, taskSelectHTML = "";
    getTaskList(function (response, status) {
        if (status) {
            tasks = response.data;
            //First build html elements for each item in the drop
            tasks.forEach(task => {
                console.log(task._id); //not creating the correct ID
                taskSelectHTML += "<a class='dropdown-item task-dropdown-item' id='task:" + task._id + "'>" + task.title + "</a>";
            });
            $("#taskDropdownMenu").html(taskSelectHTML);
        }
    });
};

/**
 * Function to generate rows for a table to make it look like a calendar.
 * The table will have up to 24 hours (12AM-11PM) and be broken down into sections of 15 minutes.
 * @param {Number} startHour: the 24 hour of the day at which the schedule table should start
 * @param {Number} endHour: the 24 hour of the day at which the schedule table should start
 */
function generateTableRows(startHour, endHour) {
    var rowHTML = "";
    var time;
    var meridian = "AM";
    for (var i = startHour; i < endHour; i++) {
        time = (i % 12);
        if (time == 0)
            time = 12;
        if (i >= 12)
            meridian = "PM"

        rowHTML +=
            `<tr class='timeblock-row' style='line-height:10px' id='time-${i}-0'>` +
            `    <td rowspan='4' scope='row'><span style='width: 5em; display: inline-block'>${time}:00 ${meridian}</span></td>` +
            `    <td class='td-minute'>00</td>` +
            `    <td class='task-bucket bucket-empty'></td>` +
            `</tr>` +
            `<tr class='timeblock-row' style='line-height:10px' id='time-${i}-15'>` +
            "    <td class='td-minute'>15</td>" +
            "    <td class='task-bucket bucket-empty'></td>" +
            "</tr>" +
            `<tr class='timeblock-row' style='line-height:10px' id='time-${i}-30'>` +
            "    <td class='td-minute'>30</td>" +
            "    <td class='task-bucket bucket-empty'></td>" +
            "</tr>" +
            `<tr class='timeblock-row' style='line-height:10px' id='time-${i}-45'>` +
            "    <td class='td-minute'>45</td>" +
            "    <td class='task-bucket bucket-empty'></td>" +
            "</tr>";
    }
    $("tbody").append(rowHTML);
}

/**
 * Add a timeblock to the current day's schedule page.
 * @param {Number} startHour: the hour (24) at which the timeblock begins
 * @param {Number} startMinute: the minute (increments of 15) at which the timeblock begins
 * @param {Number} nRows: the number of quarter-hour increments the timeblock spans
 * @param {*} taskId: the id of the task to fill the timeblock
 */
function addTimeblockToPage(startHour, startMinute, nRows, taskId, timeblockId) {
    var trId = "#time-" + startHour + "-" + startMinute;
    var task;
    getTask(taskId, function (response, status) {
        task = response.data;
        var td = $(trId).children('.task-bucket');
        td.prop("rowspan", nRows);
        td.removeClass("bucket-empty");
        td.addClass("bucket-full");
        td.css('padding', '0px');
        td.html(generateTimeblockDiv(timeblockId, task.title))
        setPriorityColor(td.children('.time-block-card'), task.priority);
        var div = (td.children('.time-block-card'))
        div.height(div.closest('td').height() + 1);
        div.data('nRows', nRows);
        div.data('taskId', taskId);
        div.data('parentId', trId);
        firstHour = startHour;
        firstMinute = (startMinute + 15) % 60;
        if (45 == startMinute) {
            firstHour++;
        }
        removeRows(firstHour, firstMinute, nRows - 1);
    });
}

/**
 * removes the timeblock beginning in the row specified from the page.
 * @param {*} rowId: the id of the tr containing the timeblock to remove
 */
function removeTimeblockFromPage(rowId) {
    var div = $(rowId).children().find('.time-block-card');
    var td = div.parent('td');
    var nRows = div.data('nRows');
    var taskId = div.data('taskId');
    var temp = rowId.split('-');
    var hour = Number(temp[1]);
    var minute = Number(temp[2]);
    td.addClass("bucket-empty");
    td.removeClass("bucket-full");
    td.prop("rowspan", 1)
    td.html("");
    firstHour = hour;
    firstMinute = (minute + 15) % 60;
    if (45 == minute) {
        firstHour++;
    }
    addRows(firstHour, firstMinute, nRows - 1);
}

/**
 * Remove td's from the rows that will be spanned by a timeblock.
 * @param {Number} firstHour: the 24 hour of the row at which the first td should be removed
 * @param {Number} firstMinute: the minute of the row at which the first td should be removed
 * @param {Number} nRows: the number of 15 minute rows to remove td's from
 */
function removeRows(firstHour, firstMinute, nRows) {
    var currentHour = firstHour;
    var currentMinute = firstMinute;
    var trId;
    for (var i = 0; i < nRows; i++) {
        trId = "#time-" + currentHour + "-" + currentMinute;
        $(trId).children('.task-bucket').remove();
        if (currentMinute == 45) {
            currentMinute = 0;
            currentHour++;
        } else {
            currentMinute += 15;
        }
    }
}

/**
 * Replace td's that were removed to accomodate a timeblock, when that timeblock is removed.
 * @param {Number} firstHour: the 24 hour of the row in which the first td should be replaced
 * @param {Number} firstMinute: the minute of the row at which the first td should be replaced
 * @param {Number} nRows: the number of 15 minute rows to replace td's in
 */
function addRows(firstHour, firstMinute, nRows) {
    var currentHour = firstHour;
    var currentMinute = firstMinute;
    var trId;
    for (var i = 0; i < nRows; i++) {
        trId = "#time-" + currentHour + "-" + currentMinute;
        $(trId).append("<td class='task-bucket bucket-empty'></td>");
        if (currentMinute == 45) {
            currentMinute = 0;
            currentHour++;
        } else {
            currentMinute += 15;
        }
    }
}

/**
 * Takes the priority that is stored in the model and displays the correct CSS style for it
 * @param {*} elementId: The element ID of the HTML tag we want to style
 * @param {Number} priority: The priority code of the relevant task
 */
function setPriorityColor(element, priority) {
    switch (Number(priority)) {
        case 0:
            //$(elementId).children('.time-block-card')[0].addClass("priority-low");
            element.addClass("priority-low");
            break;
        case 1:
            element.addClass("priority-med");
            break;
        case 2:
            element.addClass("priority-high");
            break;
    }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// Show toast functions /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Show a toast notifying the user that the timeblock could not be created
 * due to a time conflict with another timeblock
 */
function showNoTaskToast() {
    $("#toastTitle").html("Error when creating timeblock");
    $("#toastSubtitle").html("");
    $("#toastBody").html("No task was selected. Please select a task from the list to schedule for the timeblock.");
    $('.toast').toast('show');
}

/**
 * Show a toast notifying the user that the timeblock could not be created
 * due to a time conflict with another timeblock
 */
function showOverlapToast() {
    $("#toastTitle").html("Error when creating timeblock");
    $("#toastSubtitle").html("");
    $("#toastBody").html("Cannot create overlapping timeblocks. Please ensure the selected time range does not conflict with other scheduled tasks.");
    $('.toast').toast('show');
}

/**
 * Show a toast notifying the user that the timeblock could not be created
 * due to an invalid time range
 */
function showInvalidTimeToast() {
    $("#toastTitle").html("Error when creating timeblock");
    $("#toastSubtitle").html("");
    $("#toastBody").html("The selected time range was invalid. Please make sure the start time precedes the end time, and the end is no later than 12:00PM.");
    $('.toast').toast('show');
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// Helper functions /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Generate the html div element which displays a timeblock
 * @param {*} timeblockId: the id of the timeblock in the schema
 * @param {*} taskTitle: the title of the task associated with the timeblock
 */
function generateTimeblockDiv(timeblockId, taskTitle) {
    const html = `<div id='${timeblockId}'class='time-block-card' style='height: 100%; width: 100%; display: table;'` +
        ` draggable='true'><span style='display: table-cell; vertical-align: middle; padding-left: 8px'>${taskTitle}</span></div>`
    return html
}

/**
 * Checks time range overlaps an existing task timeblock
 * @param {NUmber} hour24: the 24 hour start of the range
 * @param {Number} minute: the minute start of the range in 15 minute increments
 * @param {Number} nRows: the number of rows to span (number of 15 minute blocks)
 * @returns true if overlaps, false otherwise
 */
function hasOverlaps(hour24, minute, nRows) {
    var currentHour = hour24,
        currentMinute = minute,
        trId = "#time-" + currentHour + "-" + currentMinute;

    if ($(trId).children('.bucket-full').length > 0) {
        return true;
    }
    for (var i = 0; i < nRows - 1; i++) {
        if (currentMinute == 45) {
            currentMinute = 0;
            currentHour++;
        } else {
            currentMinute += 15;
        }
        trId = "#time-" + currentHour + "-" + currentMinute;
        if ($(trId).children('.bucket-full').length > 0) {
            return true;
        }
    }
    return false;
}

/**
 * Verify that for a given time range, the begin time precedes the end time, and that the end time is not after midnight.
 * @param {Number} startHour: the hour at which the timeblock begins
 * @param {Number} startMinute: the minute at which the timeblock begins
 * @param {Number} endHour: the hour at which the timeblock ends
 * @param {Number} endMinute: the minute at which the timeblock ends
 */
function isTimeValid(startHour, startMinute, endHour, endMinute) {
    if (startHour >= 24) { // cannot start at or after midnight
        return false;
    }
    if (endHour > 24 || (endHour == 24 && endMinute > 0)) { // cannot end after midnight
        return false;
    }
    if (startHour > endHour) { // starts after it ends
        return false;
    }
    if (startHour == endHour) { // starts and ends in same hour
        if (startMinute >= endMinute) { // start time is >= end time
            return false;
        }
    }
    return true;
}

/**
 * Convert an hour to 24 hour time
 * @param {Number} hour
 * @param {Boolean} isPM
 */
function timeTo24(hour, isPM) {
    var newHour = hour
    if (newHour != 12) {
        newHour += (isPM ? 12 : 0);
    } else {
        newHour += (isPM ? 0 : 12);
    }
    return newHour;
}