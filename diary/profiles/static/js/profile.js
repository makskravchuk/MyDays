const profileGalleryBtn = document.querySelector(".profile-photos-button");
const profileGalleryModal = document.getElementById("profile-gallery");
const closeProfileGalleryBtn = document.querySelector(".close-profile-gallery");
const profileGalleryPhotos = document.querySelector(".gallery-photos");
const profilePhotoSlider = document.querySelector(".carousel");
const profilePhotosCount = document.querySelector("#profile-photos-count .badge-info");
const csrftoken = getCookie('csrftoken');

function deleteProfilePhoto(pk, type) {
    const items = document.querySelectorAll(`[data-img-index="${pk}"]`);
    fetch(`${window.location.origin}/profile/delete/profile_photo/${pk}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            items.forEach(item => {
                item.parentNode.removeChild(item)
            });
            photosNumber--;
            profilePhotosCount.textContent = photosNumber;
        })
        .catch(error => {
            console.error(error);
        });
}

const deleteFunction = isProfileOwner ? deleteProfilePhoto : null
setupGallery('img', 'profile-photo-item', nested = true, deleteFunction, userFullName);

if (isProfileOwner) {
    const addProfilePhotoBtn = document.querySelector(".add-photo-button");
    const editProfileBtn = document.querySelector(".edit-button");
    const editProfileModal = document.getElementById("edit-profile");
    const closeEditProfileBtn = document.querySelector(".close-edit-profile");
    const chooseProfileMainPhotoInput = document.querySelector(".choose-profile-main-photo");
    const changeProfileMainPhotoBtn = document.querySelector(".change-photo-button");
    const selectedMainPhoto = document.querySelector(".edit-main-photo");

    changeProfileMainPhotoBtn.addEventListener('click', () => {
        chooseProfileMainPhotoInput.click();
    });

    chooseProfileMainPhotoInput.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];
        selectedMainPhoto.src = URL.createObjectURL(selectedFile);
    })

    addProfilePhotoBtn.addEventListener('click', () => {
        const photoInput = document.createElement('input');
        photoInput.type = 'file';
        photoInput.accept = 'image/*';
        photoInput.click();
        photoInput.addEventListener('change', (event) => {
            const selectedFile = event.target.files[0];
            const formData = new FormData();
            formData.append('image', selectedFile);
            fetch(`${window.location.origin}/profile/add_profile_photo/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const galleryItem = `<div class="profile-photo-item" data-img-index="${data['photo'].id}"><img src="${data['photo'].url}" alt="image"></div>`;
                    profileGalleryPhotos.insertAdjacentHTML('afterbegin', galleryItem);
                    const sliderItem = `<li class="card" data-img-index="${data['photo'].id}"><div class="img"><img src="${data['photo'].url}" alt="img" draggable="false"></div></li>`;
                    profilePhotoSlider.insertAdjacentHTML('afterbegin', sliderItem);
                    setupGallery('img', 'profile-photo-item', nested = true, deleteProfilePhoto, userFullName);
                    photosNumber++;
                    profilePhotosCount.textContent = photosNumber;
                })
                .catch(error => {
                    console.error(error);
                });
        });
    });
    editProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'block';
        document.body.style.overflow = "hidden";
    });
    closeEditProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
        document.body.style.overflow = "auto";
    });

    if (anyErrorMessages) {
        editProfileBtn.click();
    }
}


profileGalleryBtn.addEventListener('click', () => {
    profileGalleryModal.style.display = 'block';
    document.body.style.overflow = "hidden";
});


closeProfileGalleryBtn.addEventListener('click', () => {
    profileGalleryModal.style.display = 'none';
    document.body.style.overflow = "auto";
});
