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
