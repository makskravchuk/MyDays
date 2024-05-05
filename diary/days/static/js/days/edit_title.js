const textTitleInput = document.getElementById("day-text-title-input");
const photoTitleChooser = document.querySelector(".choose-photo-title");
const photoTitle = document.getElementById("day-photo-title");
const changePhotoTitleBtn = document.querySelector(".change-photo-title-button");

textTitleInput.addEventListener('blur', (event) => {
    // if (event.target.value !== "") {
    const formData = new FormData();
    formData.append('title', event.target.value);
    const url = `${window.location.href}title/`;
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
    });
    // }
});
changePhotoTitleBtn.addEventListener('click', () => {
    photoTitleChooser.click();
});
photoTitleChooser.addEventListener('change',
    (event) => {
        const selectedImage = event.target.files[0];
        const formData = new FormData();
        formData.append('image_title', selectedImage);
        const url = `${window.location.href}image_title/`;
        sendFormData(url, formData, (data) => {
            setDayUpdateTime(data['updated']);
            photoTitle.src = URL.createObjectURL(selectedImage);
        });
    });
