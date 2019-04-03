export class Task {
    constructor() {
        this.id = -1;
        this.title = "";
        this.priority = 0;
        this.due = "1/1/1970";
        this.category = "none";
        this.timeblock = { start: null, end: null, };
    }
}
