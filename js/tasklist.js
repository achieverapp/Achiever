var priorities = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
  }

  function BuildTaskCard(task) {
    var taskCard = "<li class='card task-card " + priorities[task.priority] + "' id='task-'" + task.id + "'>" +
      "<div class='container'>" +
      "<div class='card-content'>" +
      "<a href='#' style='text-decoration: none'>" +
      "<h2 class='fa fa-check-square align-middle text-white' style='display:inline-block; margin-right: 16px'></h2></a>" +
      "<div class='align-middle' style='display:inline-block; max-width:90%'>" +
      "<h3 style='margin-bottom:0px'>" + task.title + "</h3>" +
      "<p style='font-size: 10pt; display: inline-block'>Due: " + task.due + "&nbsp;</p>" +
      "<p style='font-size: 10pt; display: inline-block'>Category: " + task.category + "&nbsp;</p>" +
      "</div>" + "</div>" + "</div>" + "</li>";
    return taskCard;
  }