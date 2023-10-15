
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

            const buttonText = document.createElement("span");
            buttonText.setAttribute("class", "relative text-black group-hover:text-white");
            
            const redBackground = document.createElement("div");
            redBackground.setAttribute("class", "absolute inset-0 w-0 bg-red-500 transition-all duration-400ms ease-in-out group-hover:w-full");
            
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
    
    // Get the taskButton to be deleted
    const taskButton = document.getElementById(id);
    
    // Add the fade-out animation class
    taskButton.classList.add("gradual-fade-out-animation");
    
    // After the animation duration, remove the button from the DOM
    setTimeout(() => {
      taskArr.splice(taskIndex, 1);
      localStorage.setItem("savedTasks", JSON.stringify(taskArr));
      updateView();
      taskButton.remove();
    }, 500); // Adjust this duration to match your animation duration
    
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
document.getElementById('task-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    console.log('Enter key pressed!');
    addTask(false); 
  }
});
document.getElementById("task-clear-btn").addEventListener("click", () => {

    localStorage.clear();
    taskArr = [];
    updateView();
})

//SECOND POPUP that appears at the top of a webpage 
let previousLength = taskArr.length; //use to keep track of taskArr changes 
function checkArrayLength() {
    if (myArray.length !== previousLength) {
      openWarningPopup();
      previousLength = myArray.length;
    }
  }
  setInterval(checkArrayLength, 1000); // Check every second

const arrayProxy = new Proxy(taskArr, {
    set(target, prop, value) {
      if (prop === 'length' && (target[prop] === 0 || value === 0)) {
        if (target[prop] !== value) {
            console.log("SHOULD OPEN WARNING POPUP");
          openWarningPopup();
        }
      }
      target[prop] = value;
      return true;
    },
  });
document.getElementById('showWarningButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({ openWarningPopup: true });
  });
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.openWarningPopup) {
      // Open the warning popup
      chrome.windows.create({
        type: 'popup',
        url: 'warning-popup.html',
        width: 300,
        height: 200,
        left: Math.round((screen.width - 300) / 2),
        top: Math.round((screen.height - 200) / 2),
      });
    }
  });