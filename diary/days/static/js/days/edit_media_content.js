const addPhotoBtn = document.getElementById("add-photo-button");
const photoDescriptionTextarea = document.querySelector(".photo-description-textarea");
const photoChooser = document.querySelector(".choose-photo");
const addVideoBtn = document.getElementById("add-video-button");
const videoDescriptionTextarea = document.querySelector(".video-description-textarea");
const videoChooser = document.querySelector(".choose-video");
const addAudioBtn = document.getElementById("add-audio-button");
const audioDescriptionTextarea = document.querySelector(".audio-description-textarea");
const audioChooser = document.querySelector(".choose-audio");

const photoGallery = document.querySelector(".photo-gallery");
const videoGallery = document.querySelector(".video-gallery");
const audioGallery = document.querySelector(".audio-gallery");

addPhotoBtn.addEventListener('click', () => {
    photoChooser.click();
});
photoChooser.addEventListener('change', (event) => {
    const selectedPhoto = event.target.files[0];
    const description = photoDescriptionTextarea.value;
    addMediaContent('image', selectedPhoto, description, (data) => {
        const galleryItem = createGalleryItem('img', 'day-photo-container', data['data']['id'], description,
            `<img class="gallery-item" src=${data['data']['url']} alt="photo">`);
        photoGallery.appendChild(galleryItem);
        setupGallery('img', 'day-photo-container', false, deleteItemFunction, userFullName, dateDisplay);
    });
});

addVideoBtn.addEventListener('click', () => {
    videoChooser.click();
});
videoChooser.addEventListener('change', (event) => {
    const selectedVideo = event.target.files[0];
    const description = videoDescriptionTextarea.value;
    addMediaContent('video', selectedVideo, description, (data) => {
        const galleryItem = createGalleryItem('video', 'day-video-container', data['data']['id'], description,
            `<video class="gallery-video" src=${data['data']['url']} muted controls></video>`);
        videoGallery.appendChild(galleryItem);
        setupGallery('video', 'day-video-container', false, deleteItemFunction, userFullName, dateDisplay);
    });
});

addAudioBtn.addEventListener('click', () => {
    audioChooser.click();
});
audioChooser.addEventListener('change', (event) => {
    const selectedAudio = event.target.files[0];
    const description = audioDescriptionTextarea.value;
    addMediaContent('audio', selectedAudio, description, (data) => {
        const galleryItem = createGalleryItem('audio', 'day-audio-container', data['data']['id'], description,
            `<audio class="gallery-item gallery-audio" controls
                                       src=${data['data']['url']}></audio>`);
        if (description) galleryItem.innerHTML += `<div class="scroll audio-caption">${description}</div>`;
        audioGallery.appendChild(galleryItem);
        setupGallery('audio', 'day-audio-container', false, deleteItemFunction, userFullName, dateDisplay);
    });
});


function addMediaContent(type, selectedFile, description, addGalleryItem) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('description', description);
    formData.append('file', selectedFile);
    const url = `${window.location.href}media_content/add/`;
    sendFormData(url, formData, (data) => {
        addGalleryItem(data);
        setDayUpdateTime(data['updated']);
    });
}


function createGalleryItem(type, galleryItemClass, id, description, innerHTML) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add("gallery-item-container");
    galleryItem.classList.add(galleryItemClass);
    galleryItem.setAttribute(`data-${type}-index`, id);
    galleryItem.setAttribute('data-caption', description);
    galleryItem.innerHTML = innerHTML;
    return galleryItem;
}