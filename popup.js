
var taskArr = [];
var words = [];

function updateView() {

    const tasksList = document.getElementById("tasksList");

    var child = tasksList.lastChild;
    while(child) {
        tasksList.removeChild(child);
        child = tasksList.lastChild;
    }
    taskArr.forEach((Element, index) => {
        console.log("INDEX: " + index); 
            const newTask = document.createElement("div");
            newTask.setAttribute("class", "task-div");
            
            const taskButton = document.createElement("button");
            taskButton.textContent = Element.task;
            taskButton.setAttribute("class", "group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow");
            
            const redBackground = document.createElement("div");
            redBackground.setAttribute("class", "absolute inset-0 w-0 bg-red-500 transition-all duration-400ms ease-in-out group-hover:w-full");
            
            const buttonText = document.createElement("span");
            buttonText.setAttribute("class", "relative text-black group-hover:text-black");
            
            // Add a click event listener to the taskButton
            taskButton.addEventListener("click", (event) => deleteTask(taskButton.getAttribute("id"), taskButton.textContent));

            taskButton.setAttribute("id", index + "delete");
            console.log("TASK ID SHOULD BE: " + taskButton.getAttribute("id"));
            // Append the redBackground and buttonText to the taskButton
            taskButton.appendChild(redBackground);
            taskButton.appendChild(buttonText);
            words.push(Element.task);
            // Append the taskButton to the newTask
            newTask.appendChild(taskButton);
            
            // Append the newTask to tasksList (assuming tasksList is your container)
            tasksList.appendChild(newTask);
    });
    // taskArr.forEach((Element, index) => {
    //     const newTask = document.createElement("div");
    //     newTask.setAttribute("class", "task-div");

    //     const taskText = document.createElement("div");
    //     taskText.setAttribute("class", Element.isDone ? "task-text task-completed" : "task-text");
    //     taskText.innerHTML = (index + 1) + ". " + Element.task;
    //     taskText.style.fontSize = "12px";

    //     const taskControls = document.createElement("div");
    //     taskControls.setAttribute("class", "task-controls");

    //     const taskEdit = document.createElement("button");
    //     taskEdit.innerHTML = "Edit";
    //     taskEdit.setAttribute("id", index + "edit");
    //     taskEdit.setAttribute("class", "task-btn task-btn-edit");
    //     taskEdit.addEventListener("click", (event) => editTask(event.target.id));

    //     const taskDelete = document.createElement("button");
    //     taskDelete.innerHTML = "Delete";
    //     taskDelete.setAttribute("id", index + "delete");
    //     taskDelete.setAttribute("class", "task-btn task-btn-delete");
    //     taskDelete.addEventListener("click", (event) => deleteTask(event.target.id));

    //     taskControls.appendChild(taskEdit);
    //     taskControls.appendChild(taskDelete);

    //     newTask.appendChild(taskText);
    //     newTask.appendChild(taskControls);

    //     tasksList.appendChild(newTask);
    // });
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, taskArr);
      });
    });
    
}

function addTask(isDone) {
    const task = document.getElementById("task-input").value.toLowerCase();
    const taskInput = document.getElementById("task-input");
    taskInput.value = "";
    if(task === null || task.trim() === "" || words.includes(task)) return;
    taskArr.push({task, isDone});
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    words.push(document.getElementById("task-input").value.toLowerCase());
    updateView();
}

// function editTask(id) {
//     consol
//     const taskIndex = parseInt(id[0]);
//     const taskText = taskArr[taskIndex].task;
//     taskArr.splice(taskIndex, 1);
//     localStorage.setItem("savedTasks", JSON.stringify(taskArr));
//     updateView();

//     const taskInput = document.getElementById("task-input");
//     taskInput.value = taskText;
// }

function deleteTask(id, name) {
    console.log("ID" + id);
    const taskIndex = parseInt(id[0]);
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const valueToDelete = 3;

    const indexToDelete = words.indexOf(name);
    if (indexToDelete !== -1) {
    words.splice(indexToDelete, 1);
}
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