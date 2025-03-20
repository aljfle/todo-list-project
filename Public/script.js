document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("pendingTasks");
    const completedList = document.getElementById("completedTasks");
    const addTaskBtn = document.getElementById("addTaskBtn");

    if (!taskList || !completedList) {
        console.error("❌ Error: Task lists not found in the HTML.");
        return;
    }

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:3000/tasks");
            const tasks = await response.json();
            console.log("📌 Tasks fetched:", tasks);
            renderTasks(tasks);
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    };

    // Render tasks on UI
    const renderTasks = (tasks) => {
        taskList.innerHTML = "";
        completedList.innerHTML = "";

        tasks.forEach((task) => {
            const taskItem = document.createElement("li"); // ✅ Ayusin: gamitin li imbes na div
            taskItem.innerHTML = `
                <span>${task.title}</span>
                <button class="done-btn" onclick="toggleTaskStatus(${task.id}, '${task.title}', '${task.status}')">✔</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">❌</button>
            `;

            if (task.status === "completed") {
                taskItem.classList.add("done"); // ✅ Lagyan ng class para mag-strikethrough
                completedList.appendChild(taskItem);
            } else {
                taskList.appendChild(taskItem);
            }
        });
    };

    // Add new task
    const addTask = async () => {
        const title = document.getElementById("taskInput").value.trim();
        if (!title) {
            alert("Task title cannot be empty!");
            return;
        }

        const task = { title, status: "pending" };

        try {
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                throw new Error("Failed to add task");
            }

            document.getElementById("taskInput").value = "";
            fetchTasks();
        } catch (error) {
            console.error("❌ Error adding task:", error);
        }
    };

    // ✅ Gawing global function
    window.toggleTaskStatus = async (taskId, title, status) => {
        const updatedStatus = status === "pending" ? "completed" : "pending";

        console.log("🔍 Updating task:", { id: taskId, title, status: updatedStatus });

        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, status: updatedStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update task");
            }

            fetchTasks();
        } catch (error) {
            console.error("❌ Error updating task:", error);
            alert("Failed to update task. Please try again.");
        }
    };

    // ✅ Gawing global function
    window.deleteTask = async (taskId) => {
        console.log("🛠 Deleting task:", taskId);

        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            fetchTasks();
        } catch (error) {
            console.error("❌ Error deleting task:", error);
        }
    };

    // Event listener for adding task
    addTaskBtn.addEventListener("click", addTask);

    // Load tasks on page load
    fetchTasks();
});
