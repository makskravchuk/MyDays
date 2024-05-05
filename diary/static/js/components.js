function setupDropdown(selectName, select, button, selectedElem, dropdown, values, onChange) {
    for (const value of values) {
        dropdown.innerHTML += `
            <li role="option">
                <input type="radio" id="${value}-${selectName}" value="${value}" name="${selectName}"/>
                <label for="${value}-${selectName}">${value}</label>
            </li>
        `;
    }

    const options = dropdown.querySelectorAll("li");

    document.addEventListener("click", (e) => {
        const isClickInsideSelect = select.contains(e.target) || button.contains(e.target);
        const isClickInsideOptions = Array.from(options).some((option) => option.contains(e.target));

        if (!isClickInsideSelect && !isClickInsideOptions) {
            select.classList.remove("active");
            button.setAttribute("aria-expanded", "false");
        }
    });


// add click event to select button
    button.addEventListener("click", () => {
        // add/remove active class on the container element
        select.classList.toggle("active");
        // update the aria-expanded attribute based on the current state
        button.setAttribute(
            "aria-expanded",
            button.getAttribute("aria-expanded") === "true" ? "false" : "true"
        );
    });


    options.forEach((option) => {
        function handler(e) {
            option.addEventListener("click", (e) => {
                e.stopPropagation(); // Stop event propagation to prevent double triggering

                // Update selected element and hide dropdown
                selectedElem.textContent = option.querySelector("label").textContent;
                select.classList.remove("active");

                // Trigger onChange callback if provided
                if (onChange) {
                    onChange(selectedElem.textContent);
                }
            });

            option.addEventListener("keyup", (e) => {
                if (e.key === "Enter") {
                    e.stopPropagation(); // Stop event propagation to prevent double triggering

                    // Update selected element and hide dropdown
                    selectedElem.textContent = option.querySelector("label").textContent;
                    select.classList.remove("active");

                    // Trigger onChange callback if provided
                    if (onChange) {
                        onChange(selectedElem.textContent);
                    }
                }
            });
        }

        option.addEventListener("keyup", handler);
        option.addEventListener("click", handler);
    });
    return options;
}

function setupGallery(type, galleryItemsClass, nested = false, deleteItemFunction, author, dayDate = "") {
    let galleryItems = document.getElementsByClassName(galleryItemsClass);
    const lightBoxContainer = document.createElement("div");
    lightBoxContainer.setAttribute("tabindex", "0");
    const lightBoxContent = document.createElement("div");
    const lightBoxMedia = document.createElement(type);
    lightBoxMedia.setAttribute("preload", 'metadata');
    if (type === "video" || type === "audio") {
        lightBoxMedia.setAttribute("controls", 'true');
        lightBoxMedia.setAttribute("autoplay", 'true');
    }
    const lightBoxPrev = document.createElement("div");
    const lightBoxNext = document.createElement("div");
    const lightBoxCounter = document.createElement("div");
    const lightBoxDayInfo = document.createElement("div");
    const lightBoxCaption = document.createElement("div");

    lightBoxCounter.classList.add("lightbox-counter");
    lightBoxDayInfo.classList.add("lightbox-day-info");
    lightBoxCaption.classList.add("lightbox-caption");
    lightBoxContainer.classList.add("lightbox");
    lightBoxContent.classList.add("lightbox-content");
    lightBoxPrev.classList.add("fa", "fa-angle-left", "lightbox-prev");
    lightBoxNext.classList.add("fa", "fa-angle-right", "lightbox-next");
    lightBoxContainer.appendChild(lightBoxPrev);
    lightBoxContainer.appendChild(lightBoxContent);
    lightBoxContainer.appendChild(lightBoxCounter);
    lightBoxContainer.appendChild(lightBoxDayInfo);
    lightBoxContent.appendChild(lightBoxMedia);
    lightBoxContent.appendChild(lightBoxCaption);
    lightBoxContainer.appendChild(lightBoxNext);
    document.body.appendChild(lightBoxContainer);

    if (deleteItemFunction) {
        const deleteItemBtn = document.createElement("button");
        deleteItemBtn.innerHTML = `<i class="material-icons-outlined">delete</i>`
        deleteItemBtn.classList.add("delete-item-btn");
        lightBoxContent.appendChild(deleteItemBtn);
        deleteItemBtn.addEventListener('click', (event) => {
            const pk = lightBoxMedia.getAttribute("data-pk");
            deleteItemFunction(pk, type);
            lightBoxContent.click();
            event.stopImmediatePropagation();
        })
    }

    let index = 0;
    let mediaNumber = galleryItems.length;

    function showLightBox(n) {
        if (n === galleryItems.length) {
            n = 0;
        } else if (n < 0) {
            n = galleryItems.length - 1;
        }
        index = n;
        let mediaLocation = galleryItems[index].children[0].getAttribute("src");
        let itemPK = galleryItems[index].getAttribute(`data-${type}-index`);
        lightBoxMedia.setAttribute("src", mediaLocation);
        lightBoxMedia.setAttribute("data-pk", itemPK);
        let counterItem = null;
        switch (type) {
            case "img":
                counterItem = "Фото";
                break;
            case "video":
                counterItem = "Відео";
                break;
            case "audio":
                counterItem = "Голосовий запис";
                break;
        }
        lightBoxCounter.innerText = `${counterItem} ${index + 1} з ${mediaNumber}`;
        lightBoxCaption.innerText = galleryItems[index].getAttribute("data-caption");
        lightBoxDayInfo.innerText = `${author}\n${dayDate}`;
    }

    function currentMedia(event) {
        event.stopImmediatePropagation();
        lightBoxContainer.style.display = "block";
        if (this.children[0].tagName === "VIDEO" || this.children[0].tagName === "AUDIO") {
            this.children[0].pause();
        }
        lightBoxContainer.focus();
        document.body.style.overflow = "hidden";
        let mediaIndex = 0;
        Array.from(galleryItems).forEach((item, index) => {
            if (item.getAttribute(`data-${type}-index`) === this.getAttribute(`data-${type}-index`)) {
                mediaIndex = index
            }
        });
        showLightBox(mediaIndex);
    }

    for (let i = 0; i < galleryItems.length; i++) {
        galleryItems[i].addEventListener("click", currentMedia);
    }

    function sliderMedia(n) {
        showLightBox(index + n);
    }

    function prevMedia() {
        sliderMedia(-1);
    }

    function nextMedia() {
        sliderMedia(1);
    }

    lightBoxPrev.addEventListener('click', prevMedia);
    lightBoxNext.addEventListener('click', nextMedia);
    lightBoxContent.addEventListener('click', (event) => {
        if (event.target.tagName !== "VIDEO" && event.target.tagName !== "AUDIO") {
            lightBoxContainer.style.display = "none";
            if (!nested) document.body.style.overflow = "auto";
        }
        if (type === "video" || type === "audio") {
            lightBoxMedia.pause();
        }
    })

    lightBoxContainer.addEventListener('keydown',
        (e) => {
            if (e.key === "ArrowRight") {
                nextMedia();
            } else if (e.key === "ArrowLeft") {
                prevMedia();
            }
        });

    return galleryItems;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}