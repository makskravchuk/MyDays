const editDayBtn = document.querySelector(".edit-day-button");
const dayUpdatedTime = document.querySelector(".day-updated-time");
editDayBtn.children[0].innerText = 'visibility';
editDayBtn.children[1].innerText = 'Переглянути день'


function autoResizeHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function setupDropdownWrapper(name, select, button, elem, dropdown, data, onChange) {
    select = document.querySelector(select);
    button = document.querySelector(button);
    elem = document.querySelector(elem);
    dropdown = document.querySelector(dropdown);
    setupDropdown(name, select, button, elem, dropdown,
        data, onChange);
}

function setDayUpdateTime(date) {
    dayUpdatedTime.innerText = date;
}

function sendFormData(url, formData, successCallback) {
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData,
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        successCallback(data);
    }).catch(error => {
        console.error(error);
    });
}