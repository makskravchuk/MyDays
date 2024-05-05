const conclusionsTextarea = document.getElementById("day-conclusions-textarea");

autoResizeHeight(conclusionsTextarea);
conclusionsTextarea.addEventListener('input', () => {
    autoResizeHeight(conclusionsTextarea)
});
conclusionsTextarea.addEventListener('blur', (event) => {
    // if (event.target.value !== "") {
    const formData = new FormData();
    formData.append('conclusion', event.target.value);
    const url = `${window.location.href}conclusion/`;
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
    });
    // }
});
