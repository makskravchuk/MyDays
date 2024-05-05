const relatedPeople = document.querySelectorAll(".related-person");
const relatedPeopleList = document.querySelector(".related-people-container");
const relatedPersonInput = document.querySelector(".related-person-input");
const addPersonBtn = document.getElementById("add-related-person-button");

relatedPeople.forEach(value => {
    const deleteBtn = value.querySelector('.delete-person-button');
    deleteBtn.addEventListener('click', () => {
        deleteRelatedPerson(value.getAttribute('data-person-id'));
    });
});

function deleteRelatedPerson(pk) {
    const item = document.querySelector(`.related-person[data-person-id="${pk}"`);
    const url = `${window.location.href}related_person/${pk}/delete/`;
    sendFormData(url, null, (data) => {
        item.parentNode.removeChild(item);
        setDayUpdateTime(data['updated']);
    });
}

addPersonBtn.addEventListener('click', () => {
    const personName = relatedPersonInput.value;
    if (personName) {
        const url = `${window.location.href}related_person/add/`;
        const formData = new FormData();
        formData.append('name', personName);
        sendFormData(url, formData, (data) => {
            const relatedPersonElem = document.createElement('span');
            relatedPersonElem.classList.add("related-person");
            relatedPersonElem.setAttribute('data-person-id', data['data']['person_id']);
            relatedPersonElem.innerHTML = `<i class="material-icons-outlined">person_pin_circle</i>
                                <span>${personName}</span>`;
            const deleteBtn = document.createElement('span');
            deleteBtn.classList.add('delete-person-button');
            deleteBtn.classList.add('item-text-button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = `<i class="material-icons-outlined">delete</i>`;
            relatedPersonElem.appendChild(deleteBtn);
            relatedPeopleList.appendChild(relatedPersonElem);
            deleteBtn.addEventListener('click', () => {
                deleteRelatedPerson(data['data']['person_id']);
            });
            setDayUpdateTime(data['updated']);
        });
    }
});