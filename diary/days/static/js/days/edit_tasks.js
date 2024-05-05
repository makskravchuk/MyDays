const todoList = document.querySelector(".todo-list");
const todos = document.querySelectorAll(".todo");
const deleteTaskBtns = document.querySelectorAll(".delete-task-button");
const addTaskBtn = document.querySelector(".add-task-button");
const todoTemplate = document.querySelector(".todo-template");
const timeInput = todoTemplate.querySelector(".execution-time-chooser");
const statusChooser = todoTemplate.querySelector(".task-status");
const descriptionInput = todoTemplate.querySelector(".task-description-input");

deleteTaskBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        deleteTask(btn.parentNode.parentNode.getAttribute('data-task-id'));
    });
});
todos.forEach(todo => {
    const taskStatusElem = todo.querySelector('.task-status');
    taskStatusElemAddListeners(taskStatusElem);
});

addTaskBtn.addEventListener('click', () => {
    const execution_time = timeInput.value;
    const description = descriptionInput.value;
    const status = statusChooser.getAttribute('data-status');
    if (execution_time && description) {
        addTask(execution_time, status, description);
    }
});

function deleteTask(id) {
    const item = document.querySelector(`.todo[data-task-id="${id}"`);
    const url = `${window.location.href}task/${id}/delete/`;
    sendFormData(url, null, (data) => {
        item.parentNode.removeChild(item);
        setDayUpdateTime(data['updated']);
    });
}

function addTask(execution_time, status, description) {
    const url = `${window.location.href}task/add/`;
    const formData = new FormData();
    formData.append('execution_time', execution_time);
    formData.append('status', status);
    formData.append('description', description);
    sendFormData(url, formData, (data) => {
        const id = data['data']['task_id'];
        const elem = createTaskElem(id, execution_time, status, description);
        todoList.insertBefore(elem, todoTemplate);
        const deleteBtn = elem.querySelector('.delete-task-button');
        const taskStatusElem = elem.querySelector('.task-status');
        setTaskStatusStyle(taskStatusElem);
        taskStatusElemAddListeners(taskStatusElem)
        deleteBtn.addEventListener('click', () => {
            deleteTask(id);
        });
        statusChooser.setAttribute('data-status', 'clear');
        setTaskStatusStyle(statusChooser);
        timeInput.value = '';
        descriptionInput.value = '';
        setDayUpdateTime(data['updated']);
    });
}

function changeTaskStatus(id, taskStatusElem, newStatus) {
    if (id !== null) {
        const url = `${window.location.href}task/${id}/status/change/`;
        const formData = new FormData();
        formData.append('status', newStatus);
        sendFormData(url, formData, (data) => {
            taskStatusElem.setAttribute('data-status', newStatus);
            setTaskStatusStyle(taskStatusElem);
            setDayUpdateTime(data['updated']);
        });
    } else {
        taskStatusElem.setAttribute('data-status', newStatus);
        setTaskStatusStyle(taskStatusElem);
    }
}

function taskStatusElemAddListeners(taskStatusElem) {
    taskStatusElem.addEventListener('click', () => {
        const taskId = taskStatusElem.parentNode.parentNode.getAttribute('data-task-id');
        const prevStatus = taskStatusElem.getAttribute('data-status');
        const newStatus = prevStatus === 'completed' ? 'failed' : 'completed';
        changeTaskStatus(taskId, taskStatusElem, newStatus);

    });
    taskStatusElem.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const taskId = taskStatusElem.parentNode.parentNode.getAttribute('data-task-id');
        changeTaskStatus(taskId, taskStatusElem, 'clear');
    });
}

function createTaskElem(id, execution_time, status, description) {
    const elem = document.createElement('li');
    elem.classList.add('todo');
    elem.setAttribute('data-task-id', id);
    elem.innerHTML = `<div class="execution-time">${execution_time}</div>
            <div class="task">
                <div class="task-status" data-status=${status}></div>
                <div class="task-description">${description}</div>
                <div class="delete-task-button item-text-button delete-btn">
                <i class="material-icons-outlined">delete</i>
                 </div>
            </div>`;
    return elem;
}