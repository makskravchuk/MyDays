const videos = document.getElementsByTagName("video");
for (let video of videos) {
    video.controls = true;
    video.muted = true;
    video.addEventListener('mouseenter', function () {
        if (video.paused) {
            video.loop = true;
            video.play().then(() => {
            })
                .catch(error => {
                    console.error('Error starting video playback:', error);
                });
        }
    });
    video.addEventListener('mouseleave', function () {
        if (!video.paused) {
            video.pause();
            video.loop = false;
        }
    });
}

function deleteGalleryItem(pk, type) {
    const items = document.querySelectorAll(`[data-${type}-index="${pk}"]`);
    const url = `${window.location.href}media_content/${pk}/delete/`;
    sendFormData(url, null, (data) => {
        items.forEach(item => {
            item.parentNode.removeChild(item);
        });
        setDayUpdateTime(data['updated']);
    });
}

const deleteItemFunction = editMode ? deleteGalleryItem : null
setupGallery('img', 'day-photo-container', false, deleteItemFunction, userFullName, dateDisplay);
setupGallery('video', 'day-video-container', false, deleteItemFunction, userFullName, dateDisplay);
setupGallery('audio', 'day-audio-container', false, deleteItemFunction, userFullName, dateDisplay);
