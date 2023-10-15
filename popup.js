
var taskArr = [];

function updateView() {

    const tasksList = document.getElementById("tasksList");

    var child = tasksList.lastChild;
    while(child) {
        tasksList.removeChild(child);
        child = tasksList.lastChild;
    }

    taskArr.forEach((Element, index) => {
        const newTask = document.createElement("div");
        newTask.setAttribute("class", "task-div");

        const taskText = document.createElement("div");
        taskText.setAttribute("class", Element.isDone ? "task-text task-completed" : "task-text");
        taskText.innerHTML = (index + 1) + ". " + Element.task;
        taskText.style.fontSize = "12px";

        const taskControls = document.createElement("div");
        taskControls.setAttribute("class", "task-controls");

        const taskEdit = document.createElement("button");
        taskEdit.innerHTML = "Edit";
        taskEdit.setAttribute("id", index + "edit");
        taskEdit.setAttribute("class", "task-btn task-btn-edit");
        taskEdit.addEventListener("click", (event) => editTask(event.target.id));

        const taskDelete = document.createElement("button");
        taskDelete.innerHTML = "Delete";
        taskDelete.setAttribute("id", index + "delete");
        taskDelete.setAttribute("class", "task-btn task-btn-delete");
        taskDelete.addEventListener("click", (event) => deleteTask(event.target.id));

        taskControls.appendChild(taskEdit);
        taskControls.appendChild(taskDelete);

        newTask.appendChild(taskText);
        newTask.appendChild(taskControls);

        tasksList.appendChild(newTask);
    });
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, taskArr);
      });
    });
    
}

function addTask(isDone) {

    const task = document.getElementById("task-input").value.toLowerCase();
    if(task === null || task.trim() === "") return;
    taskArr.push({task, isDone});
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
    

    const taskInput = document.getElementById("task-input");
    taskInput.value = "";
}

function editTask(id) {

    const taskIndex = parseInt(id[0]);
    const taskText = taskArr[taskIndex].task;
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const taskInput = document.getElementById("task-input");
    taskInput.value = taskText;
}

function deleteTask(id) {

    const taskIndex = parseInt(id[0]);
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

function doTask(id) {

    const taskIndex = parseInt(id[0]);
    taskArr[taskIndex].isDone = !taskArr[taskIndex].isDone;
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

document.addEventListener("DOMContentLoaded", () => {

    const savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    if(savedTasks !== null) taskArr = [...savedTasks];
    updateView();
})

document.getElementById("task-submit-btn").addEventListener("click", () => addTask(false));

document.getElementById("task-clear-btn").addEventListener("click", () => {

    localStorage.clear();
    taskArr = [];
    updateView();
})