//load the navbar when the page loads
$(document).ready(function () {
    $("#navbar").load("/html/navbar.html", function () {
        $("#nav-schedule").addClass("nav-active");
        resizeNav();
    });
    generateTableRows(5, 24); //generates tables for the whole 24 hour day
    loadModalDropdown();
    var today = new Date();
    $("#selectedDate").html(today.toDateString() + ":");

    // Function to generate rows for a table to make it look like a calendar.
    // The table will have 24 hours (12AM-11PM) and be broken down into sections of 15 minutes.
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
                "<tr class='empty-task-time' style='line-height:10px' id='time-" + i + "-0" + "'>" +
                "    <td rowspan='4' scope='row'><span>" + time + ":00 " + meridian + "</span></td>" +
                "    <td class='td-minute'>00</td>" +
                "    <td class='task-bucket bucket-empty'></td>" +
                "</tr>" +
                "<tr class='empty-task-time' style='line-height:10px' id='time-" + i + "-15" + "'>" +
                "    <td class='td-minute'>15</td>" +
                "    <td class='task-bucket bucket-empty'></td>" +
                "</tr>" +
                "<tr class='empty-task-time' style='line-height:10px' id='time-" + i + "-30" + "'>" +
                "    <td class='td-minute'>30</td>" +
                "    <td class='task-bucket bucket-empty'></td>" +
                "</tr>" +
                "<tr class='empty-task-time' style='line-height:10px' id='time-" + i + "-45" + "'>" +
                "    <td class='td-minute'>45</td>" +
                "    <td class='task-bucket bucket-empty'></td>" +
                "</tr>";
        }
        $("tbody").append(rowHTML);
    }

    //event handler for when the user clicks on an empty time slot to add a task to.
    //It will show them the schedule time block modal and populate it with an hour
    //time block from where they clicked.
    $(document.body).on("click", ".bucket-empty", function (e) {
        var id = $(this).closest('tr')[0].id;
        var temp = id.split('-'); // empty time block's ids are displayed as times in 24hr format
        var hour24 = parseInt(temp[1]);
        var hour = hour24 % 12;
        var endHour = hour + 1; // default timeblock length is 1 hour.
        var quarter = parseInt(temp[2]);

        // Showing whether the time selected is AM or PM
        if (hour24 >= 12) {
            $("#optionStartAM").parent().removeClass("active");
            $("#optionStartPM").parent().addClass("active");
        } else {
            $("#optionStartAM").parent().addClass("active");
            $("#optionStartPM").parent().removeClass("active");
        }

        // Showing whether the default 1 hour later end time is AM or PM
        if (hour24 + 1 >= 12 && hour24 + 1 < 24) {
            $("#optionEndAM").parent().removeClass("active");
            $("#optionEndPM").parent().addClass("active");
        } else {
            $("#optionEndAM").parent().addClass("active");
            $("#optionEndPM").parent().removeClass("active");
        }

        hour = (hour % 12 == 0) ? 12 : hour;
        endHour = (endHour % 12 == 0) ? 12 : endHour;

        // Padding times that are less than 10 with a 0 to make them uniform
        if (quarter < 10) {
            quarter = "0" + quarter.toString();
        }
        if (hour < 10) {
            hour = "0" + hour.toString();
            console.log(hour);
            console.log(hour % 12);
        }
        if (endHour < 10) {
            endHour = "0" + endHour.toString();
        }

        // setting the actual start and end times in the modal.
        $("#inputStartHour").val(hour);
        $("#inputEndHour").val(endHour);
        $("#inputEndMinute").val(quarter);
        $("#inputStartMinute").val(quarter);
        $("#timeblockEditModal").modal("show"); //open the modal
    });

    // Event handler for when the time block editor is opened.
    // Will query the model for a list of tasks and populate the dropdown with what it recieves.
    function loadModalDropdown() {
        var tasks, taskSelectHTML = "";
        getTaskList(function (response, status) {
            if (status) {
                tasks = response.data;
                //First build html elements for each item in the drop
                tasks.forEach(task => {
                    console.log(task._id); //not creating the correct ID
                    taskSelectHTML += "<a class='dropdown-item task-dropdown-item' id='task:" + task._id + "'>" + task
                        .title + "</a>";
                });
                $("#taskDropdownMenu").html(taskSelectHTML);
            }
        });
    };

    // Event handler for when a task from the dropdown is clicked.
    // Updates the text of the dropdown to be the contents of the item that was clicked.
    $(document.body).on("click", ".task-dropdown-item", function (e) {
        console.log((e.target.id).split(':')[1]); //not creating the correct ID
        $("#taskDropdown").html(e.target.innerHTML);
        taskId = (e.target.id).split(':')[1];
        $("#taskDropdown").data("taskId", taskId);
    });

    // Event handler for .input-minus button click event
    // when the button is clicked, decrement the corresponding input value
    $(document.body).on("click", ".input-minus", function (e) {
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
    });

    // Event handler for .input-plus button click event
    // when the button is clicked, increment the corresponding input value
    $(document.body).on("click", ".input-plus", function (e) {
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
    });


    /**
     * click event for modal save button
     *
     * gets information from modal and generates a new timeblock using that information
     */
    $("#btnSave").click(function () {
        var startHour = Number($("#inputStartHour").val()),
            startMinute = Number($("#inputStartMinute").val()),
            startIsPM = $("#optionStartPM").closest("label").hasClass('active'),
            endHour = Number($("#inputEndHour").val()),
            endMinute = Number($("#inputEndMinute").val()),
            endIsPM = $("#optionEndPM").closest("label").hasClass('active');

        if (startHour != 12) {
            startHour %= 12;
            startHour += (startIsPM ? 12 : 0);
        } else {
            startHour += (startIsPM ? 0 : 12);
        }
        if (endHour != 12) {
            endHour %= 12;
            endHour += (endIsPM ? 12 : 0);
        } else {
            endHour += (endIsPM ? 0 : 12);
        }

        if (!isTimeValid(startHour, startMinute, endHour, endMinute)) {
            showInvalidTimeToast();
            return;
        }
        var nRows = ((endHour - startHour) * 4) - (startMinute / 15) + (endMinute / 15);
        if (hasOverlaps(startHour, startMinute, nRows)) {
            showOverlapToast();
            return;
        }
        taskId = $("#taskDropdown").data("taskId");
        if (taskId == null) {
            showNoTaskToast();
            return;
        }
        addTaskToPage(startHour, startMinute, nRows, taskId);
    });

    function isTimeValid(startHour, startMinute, endHour, endMinute) {
        if (startHour >= 24) { // cannot start at or after midnight
            console.log("startHour >= 24")
            return false;
        }
        if (endHour >= 24 && endMinute > 0) { // cannot end after midnight
            console.log("endHour >= 24 && endMinute > 0")
            return false;
        }
        if (startHour > endHour) { // starts after it ends
            console.log("startHour > endHour")
            return false;
        }
        if (startHour == endHour) { // starts and ends in same hour
            console.log("startHour == endHour")
            if (startMinute >= endMinute) { // start time is >= end time
                console.log("startMinute >= endMinute")
                return false;
            }
        }
        return true;
    }

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


    /**
     * Update the schedule table html to show a task timeblock
     *
     * @param startHour: the hour (24) at which the timeblock begins
     * @param startMinute: the minute (increments of 15) at which the timeblock begins
     * @param nRows: the number of quarter-hour increments the timeblock spans
     * @param taskId: the id of the task to fill the timeblock
     */
    function addTaskToPage(startHour, startMinute, nRows, taskId) {
        var trId = "#time-" + startHour + "-" + startMinute;
        var task;
        getTask(taskId, function (response, status) {
            task = response.data;
            console.log($(trId))
            console.log(response.data);
            console.log($(trId).children('.task-bucket'))
            var td = $(trId).children('.task-bucket');
            td.prop("rowspan", nRows);
            td.removeClass("bucket-empty");
            td.addClass("bucket-full");
            td.css('padding', '0px');
            td.html("<div class='time-block-card' style='height: 100%; width: 100%; display: table;' draggable='true'><span style='display: table-cell; vertical-align: middle; padding-left: 8px'>" + task.title + "</span></div>")
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

    function removeRows(firstHour, firstMinute, nRows) {
        var currentHour = firstHour;
        var currentMinute = firstMinute;
        var trId;
        for (var i = 0; i < nRows; i++) {
            trId = "#time-" + currentHour + "-" + currentMinute;
            console.log("removing : " + trId);
            $(trId).children('.task-bucket').remove();
            if (currentMinute == 45) {
                currentMinute = 0;
                currentHour++;
            } else {
                currentMinute += 15;
            }
        }
    }

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
     *
     * @param elementId The element ID of the HTML tag we want to style
     * @param priority The priority code retrieved from the model
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

    /**
     * Checks time range overlaps an existing task timeblock
     *
     * @param hour24 the 24 hour start of the range
     * @param minute the minute start of the range in 15 minute increments
     * @param nRows the number of rows to span (number of 15 minute blocks)
     * @return true if overlaps, false otherwise
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

    function removeTaskFromPage(rowId) {
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
        addRows(firstHour, firstMinute, nRows-1);
    }

    $(document).on('drop', 'tr', function(event) {
        event.preventDefault();
        var id = event.originalEvent.dataTransfer.getData('text');
        var id = event.originalEvent.dataTransfer.getData("text");
        var targetId = $(event.target).closest('tr')[0].id;
        var temp = targetId.split('-');
        var hour = Number(temp[1]);
        var minute = Number(temp[2]);
        var nRows = $(id).children().find('.time-block-card').data('nRows');
        var taskId = $(id).children().find('.time-block-card').data('taskId');

        if(!hasOverlaps(hour, minute, nRows)) {
            removeTaskFromPage(id);
            addTaskToPage(hour, minute, nRows, taskId);
        }

    })

    $(document).on('dragover', 'tr', function(event) {
        event.preventDefault();
    })

    $(document).on('drag', '.time-block-card', function(event) {
    })

    $(document).on('dragstart', '.time-block-card', function(event) {
        event.originalEvent.dataTransfer.setData("text", $(this).data('parentId'));
    })
});