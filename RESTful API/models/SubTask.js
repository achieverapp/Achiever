class SubTask {
  constructor(subTask) {
    this.checked = subTask.checked == null ? false : subTask.checked;
    this.title = subTask.title == null ? false : subTask.title;
  }
}

module.exports = {
  SubTask
};