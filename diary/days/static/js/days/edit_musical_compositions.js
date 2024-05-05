const musicalCompositions = document.querySelectorAll(".day-songs-list-elem");
const musicalCompositionsList = document.querySelector(".day-songs-list");
const authorInput = document.querySelector(".composition-author-input");
const titleInput = document.querySelector(".composition-title-input");
const addCompositionBtn = document.getElementById("add-composition-button");
let elemCounter = musicalCompositions.length;
musicalCompositions.forEach(value => {
    const deleteBtn = value.querySelector('.delete-composition-button');
    deleteBtn.addEventListener('click', () => {
        deleteMusicalComposition(value.getAttribute('data-composition-id'));
    });
});

function deleteMusicalComposition(pk) {
    const item = document.querySelector(`.day-songs-list-elem[data-composition-id="${pk}"`);
    const url = `${window.location.href}musical_composition/${pk}/delete/`;
    sendFormData(url, null, (data) => {
        item.parentNode.removeChild(item);
        setDayUpdateTime(data['updated']);
    });
}

addCompositionBtn.addEventListener('click', () => {
    const author = authorInput.value;
    const title = titleInput.value;
    if (author && title) {
        const url = `${window.location.href}musical_composition/add/`;
        const formData = new FormData();
        formData.append('author', author);
        formData.append('name', title);
        sendFormData(url, formData, (data) => {
            const musicalComposition = document.createElement('li');
            musicalComposition.classList.add('day-songs-list-elem');
            musicalComposition.classList.add('day-content-list-elem');
            musicalComposition.setAttribute('data-composition-id', data['data']['composition_id']);
            musicalComposition.innerHTML = `<span class="elem-content">
                                    <span class="elem-number">${++elemCounter}</span>
                                    <span class="elem-text">${author} - ${title}</span>
                                </span>`;
            const deleteItemBtn = document.createElement('span');
            deleteItemBtn.classList.add('delete-composition-button');
            deleteItemBtn.classList.add('item-text-button');
            deleteItemBtn.classList.add('delete-btn');
            deleteItemBtn.innerHTML = `<i class="material-icons-outlined">delete</i>`;
            musicalComposition.appendChild(deleteItemBtn);
            const musicNoteIcon = document.createElement('i');
            musicNoteIcon.classList.add('material-icons-outlined');
            musicNoteIcon.innerHTML = 'music_note';
            musicalComposition.appendChild(musicNoteIcon);
            musicalCompositionsList.appendChild(musicalComposition);
            deleteItemBtn.addEventListener('click', () => {
                deleteMusicalComposition(data['data']['composition_id']);
            });

            setDayUpdateTime(data['updated']);
        });
    }
});