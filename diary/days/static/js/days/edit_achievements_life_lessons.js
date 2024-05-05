const achievementsList = document.querySelector(".day-achievements-list");
const lifeLessonsList = document.querySelector(".day-life-lessons-list");
const achievementsTextAreas = document.querySelectorAll(".achievement-textarea");
const lifeLessonsTextAreas = document.querySelectorAll(".life-lesson-textarea");
const achievementsDeleteBtns = document.querySelectorAll(".delete-achievement-button");
const lifeLessonsDeleteBtns = document.querySelectorAll(".delete-life-lesson-button");

const achievementInput = document.querySelector(".add-achievement-textarea");
const lifeLessonInput = document.querySelector(".add-life-lesson-textarea");
const addAchievementBtn = document.getElementById("add-achievement-button");
const addLifeLessonBtn = document.getElementById("add-life-lesson-button");

let achievementsCounter = achievementsTextAreas.length;
let lifeLessonsCounter = lifeLessonsTextAreas.length;

achievementsDeleteBtns.forEach(value => {
    value.addEventListener('click', (event) => {
        const id = value.parentNode.parentNode.getAttribute('data-achv-id');
        deleteItem(id, 'achievement');
    });
});
lifeLessonsDeleteBtns.forEach(value => {
    const id = value.parentNode.parentNode.getAttribute('data-lesson-id');
    value.addEventListener('click', (event) => {
        const id = value.parentNode.parentNode.getAttribute('data-lesson-id');
        deleteItem(id, 'life_lesson');
    });
});

achievementsTextAreas.forEach((textarea) => {
    autoResizeHeight(textarea);
    textarea.addEventListener('input', () => {
        autoResizeHeight(textarea);
    });
    textarea.addEventListener('blur', (event) => {
        const id = event.target.parentNode.parentNode.getAttribute('data-achv-id');
        textAreaOnChange(id, event.target, 'achievement');
    });
});
lifeLessonsTextAreas.forEach((textarea) => {
    autoResizeHeight(textarea);
    textarea.addEventListener('input', () => {
        autoResizeHeight(textarea);
    });
    textarea.addEventListener('blur', (event) => {
        const id = event.target.parentNode.parentNode.getAttribute('data-lesson-id');
        textAreaOnChange(id, event.target, 'life_lesson');
    });
});


function textAreaOnChange(pk, textarea, field_name) {
    if (textarea.value) {
        const url = `${window.location.href}${field_name}/${pk}/change/`;
        const formData = new FormData();
        formData.append('text', textarea.value);
        sendFormData(url, formData, (data) => {
            setDayUpdateTime(data['updated']);
        });
    }
}

function deleteItem(pk, field_name) {
    let item = null;
    if (field_name === 'achievement') {
        item = document.querySelector(`.day-achievements-list-elem[data-achv-id="${pk}"`);
    } else if (field_name === 'life_lesson') {
        item = document.querySelector(`.day-life-lessons-list-elem[data-lesson-id="${pk}"`);
    }
    const url = `${window.location.href}${field_name}/${pk}/delete/`;
    sendFormData(url, null, (data) => {
        item.parentNode.removeChild(item);
        setDayUpdateTime(data['updated']);
    });
}

addAchievementBtn.addEventListener('click', (event) => {
    const text = achievementInput.value;
    if (text) appendItem(text, 'achievement');
});
addLifeLessonBtn.addEventListener('click', (event) => {
    const text = lifeLessonInput.value;
    if (text) appendItem(text, 'life_lesson');
});

function appendItem(text, field_name) {
    const url = `${window.location.href}${field_name}/add/`;
    const formData = new FormData();
    formData.append('text', text);
    sendFormData(url, formData, (data) => {
        if (field_name === 'achievement') {
            const id = data['data']['achievement_id'];
            achievementsList.appendChild(createListElem(id, text, field_name));
        } else {
            const id = data['data']['lesson_id'];
            lifeLessonsList.appendChild(createListElem(id, text, field_name));
        }
        setDayUpdateTime(data['updated']);
    });
}

function createListElem(id, text, field_name) {
    const li = document.createElement('li');
    li.classList.add("day-content-list-elem");
    const elemContent = document.createElement('span');
    elemContent.classList.add("elem-content");
    li.appendChild(elemContent);
    const elemNumber = document.createElement('span');
    elemNumber.className = "elem-number";
    elemContent.appendChild(elemNumber);
    const textarea = document.createElement('textarea');
    textarea.innerText = text;
    elemContent.appendChild(textarea);
    const deleteBtn = document.createElement('div');
    deleteBtn.className = "item-text-button delete-btn";
    deleteBtn.innerHTML = "<i class=\"material-icons-outlined\">delete</i>";
    elemContent.appendChild(deleteBtn);
    const icon = document.createElement('i');
    icon.classList.add('material-icons-outlined');
    li.appendChild(icon);
    if (field_name === 'achievement') {
        li.classList.add("day-achievements-list-elem");
        li.setAttribute('data-achv-id', `${id}`);
        elemNumber.innerText = `${++achievementsCounter}`;
        textarea.classList.add("achievement-textarea");
        deleteBtn.classList.add("delete-achievement-button");
        icon.textContent = 'emoji_events';

    } else if (field_name === 'life_lesson') {
        li.classList.add("day-life-lessons-list-elem");
        li.setAttribute('data-lesson-id', `${id}`);
        elemNumber.innerText = `${++lifeLessonsCounter}`;
        textarea.classList.add("life-lesson-textarea");
        deleteBtn.classList.add("delete-life-lesson-button");
        icon.textContent = 'bookmark';
    }
    deleteBtn.addEventListener('click', (event) => {
        deleteItem(`${id}`, field_name);
    });
    textarea.addEventListener('blur', (event) => {
        textAreaOnChange(`${id}`, event.target, field_name);
    });
    return li;
}
