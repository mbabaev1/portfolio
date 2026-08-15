const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskDate = document.querySelector("#taskDate");

const taskList = document.querySelector("#taskList");

const totalTasks = document.querySelector("#totalTasks");
const activeCount = document.querySelector("#activeCount");
const completedCount = document.querySelector("#completedCount");

const searchInput = document.querySelector("#searchInput");
const filters = document.querySelector("#filters");
const clearCompleted = document.querySelector("#clearCompleted");

const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#editForm");
const editTaskInput = document.querySelector("#editTaskInput");
const editTaskDate = document.querySelector("#editTaskDate");

const closeEditModal = document.querySelector("#closeEditModal");
const cancelEdit = document.querySelector("#cancelEdit");

let editingTaskId = null;


let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


function saveTasks() {
    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}


function formatDate(date) {

    if (!date) {
        return "Без срока";
    }

    return new Date(date + "T00:00:00")
        .toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

function isOverdue(date, completed) {

    if (!date || completed) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(date + "T00:00:00");

    return deadline < today;
}


function updateStats() {

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}


function getVisibleTasks() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    return tasks.filter(task => {

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchValue);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });
}


function renderTasks() {

    taskList.innerHTML = "";

    const visibleTasks = getVisibleTasks();

    if (visibleTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-tasks">
                Задачи не найдены
            </div>
        `;

        updateStats();
        return;
    }


    visibleTasks.forEach(task => {

        const item = document.createElement("article");

        const overdue = isOverdue(
    task.date,
    task.completed
);

item.className = `
    task-item
    ${task.completed ? "completed" : ""}
    ${overdue ? "overdue" : ""}
`;

        item.innerHTML = `
            <div class="task-main">

                <input
                    class="task-checkbox"
                    type="checkbox"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                    aria-label="Отметить задачу выполненной"
                >

                <div class="task-content">

                    <h3 class="task-title">
                        ${escapeHTML(task.title)}
                    </h3>

                    <p class="task-date">
    ${formatDate(task.date)}

    ${overdue ? `
        <span class="overdue-label">
            Просрочено
        </span>
    ` : ""}
</p>

                </div>

            </div>

            <div class="task-actions">

                <button
                    type="button"
                    class="edit-button"
                    data-id="${task.id}"
                >
                    Изменить
                </button>

                <button
                    type="button"
                    class="delete-button"
                    data-id="${task.id}"
                >
                    Удалить
                </button>

            </div>
        `;

        taskList.appendChild(item);
    });

    updateStats();
}


function escapeHTML(value) {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;
}

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        editModal.classList.contains("active")
    ) {
        closeEdit();
    }
});


function addTask(title, date) {

    const task = {
        id: Date.now(),
        title,
        date,
        completed: false
    };

    tasks.unshift(task);

    saveTasks();
    renderTasks();
}


function toggleTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}


function deleteTask(taskId) {

    tasks = tasks.filter(
        task => task.id !== taskId
    );

    saveTasks();
    renderTasks();
}


function editTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return;
    }

    editingTaskId = taskId;

    editTaskInput.value = task.title;
    editTaskDate.value = task.date || "";

    editModal.classList.add("active");

    editTaskInput.focus();
}

function closeEdit() {

    editModal.classList.remove("active");

    editingTaskId = null;

    editForm.reset();
}

editForm.addEventListener("submit", event => {

    event.preventDefault();

    const task = tasks.find(
        task => task.id === editingTaskId
    );

    if (!task) {
        return;
    }

    const newTitle = editTaskInput.value.trim();

    if (!newTitle) {
        return;
    }

    task.title = newTitle;
    task.date = editTaskDate.value;

    saveTasks();
    renderTasks();
    closeEdit();
});

closeEditModal.addEventListener("click", closeEdit);
cancelEdit.addEventListener("click", closeEdit);

editModal.addEventListener("click", event => {

    if (event.target === editModal) {
        closeEdit();
    }
});


taskForm.addEventListener("submit", event => {

    event.preventDefault();

    const title = taskInput.value.trim();
    const date = taskDate.value;

    if (!title) {
        return;
    }

    addTask(title, date);

    taskForm.reset();
    taskInput.focus();
});


taskList.addEventListener("click", event => {

    const deleteButton =
        event.target.closest(".delete-button");

    const editButton =
        event.target.closest(".edit-button");


    if (deleteButton) {

        const taskId = Number(
            deleteButton.dataset.id
        );

        deleteTask(taskId);
        return;
    }


    if (editButton) {

        const taskId = Number(
            editButton.dataset.id
        );

        editTask(taskId);
    }
});



searchInput.addEventListener("input", () => {
    renderTasks();
});


filters.addEventListener("click", event => {

    const button =
        event.target.closest(".filter-button");

    if (!button) {
        return;
    }

    currentFilter = button.dataset.filter;

    document
        .querySelectorAll(".filter-button")
        .forEach(item => {
            item.classList.remove("active");
        });

    button.classList.add("active");

    renderTasks();
});


clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();
    renderTasks();
});

renderTasks();
