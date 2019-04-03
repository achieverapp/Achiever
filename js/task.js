export class Task {
    constructor() {
        this.id = -1;
        this.title = "";
        this.priority = 0;
        this.due = "01-01-1970T00:00:00.000+00:00";
        this.completed = null;
        this.category = "none";
        this.timeblock = { start: null, end: null, };
        this.subtasks = [];
    }
}

function compareTaskByDateAscending(lhs, rhs) {
    var lhsDate = new Date(lhs.due),
        rhsDate = new Date(rhs.due);

    
    if(lhs.due === rhs.due) {
        return lhs.priority - rhs.priority;
    }
    if(lhsDate > rhsDate) {
        return 1;
    }
    if(lhsDate < rhsDate) {
        return -1;
    }
    return 0;
}

function compareTaskByPriorityDescending(lhs, rhs) {
    if(lhs.priority === rhs.priority) {
        return compareTaskByDateAscending(lhs, rhs);
    }
    return lhs.priority - rhs.priority;
}
