document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("taskInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    let taskItem = createTaskElement(taskText);
    document.getElementById("taskList").appendChild(taskItem);
    taskInput.value = "";
}

function createTaskElement(taskText) {
    let li = document.createElement("li");
    li.textContent = taskText;

    let checkButton = document.createElement("button");
    checkButton.innerHTML = "✔";
    checkButton.classList.add("check-btn");
    checkButton.onclick = function () {
        moveToCompleted(li);
    };

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "❌";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = function () {
        li.remove();
    };

    li.appendChild(checkButton);
    li.appendChild(deleteButton);
    return li;
}

function moveToCompleted(taskItem) {
    taskItem.querySelector(".check-btn").remove(); // Remove check button
    document.getElementById("completedList").appendChild(taskItem);
}
