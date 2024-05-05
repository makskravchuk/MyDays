const textDescriptionTextarea = document.getElementById("day-text-description-textarea");
autoResizeHeight(textDescriptionTextarea);

textDescriptionTextarea.addEventListener('input', () => {
    autoResizeHeight(textDescriptionTextarea)
});
textDescriptionTextarea.addEventListener('blur', (event) => {
    // if (event.target.value !== "") {
    const formData = new FormData();
    formData.append('text_description', event.target.value);
    const url = `${window.location.href}text_description/`;
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
    });
    // }
});