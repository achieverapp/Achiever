var priorityToClassMap = {
    0: "priority-low",
    1: "priority-med",
    2: "priority-high",
};

function buildTaskCard(task) {
    var taskCardNode = document.createElement("li");
    taskCardNode.id = task.id;
    taskCardNode.classList.add("card");
    taskCardNode.classList.add("task-card");
    taskCardNode.classList.add(priorityToClassMap[task.priority]);
    taskCardNode.innerHTML =
        "<div class='container'>" +
        "<h2 class='fa fa-check-square align-middle text-white' style='display: inline-block;'></h2>" +
        "<div class='align-middle' style='display:inline-block; padding-left:16px; max-width:90%'>" +
        "<h3 style='margin-bottom:0px;'>" + task.title + "</h3>" +
        "<p style='font-size: 10pt; display:inline-block; margin-right:8px;'>Due:&nbsp;" + task.due + "</p>" +
        "<p style='font-size: 10pt; display:inline-block; margin-right:8px;'>Category:&nbsp;" + task.category + "</p>" +
        "</div>" +
        "</div>";
    return taskCardNode;
}