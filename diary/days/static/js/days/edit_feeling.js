setupDropdownWrapper("select_feeling", ".feeling-select", ".feeling-select-button",
    ".feeling-selected-value", ".feeling-select-dropdown", feelings, onChangeFeelingSelect);

function onChangeFeelingSelect(feeling) {
    const formData = new FormData();
    formData.append("feeling", feeling);
    const url = `${window.location.href}feeling/`;
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
        healthDescription.innerText = data['data'];
    });
}