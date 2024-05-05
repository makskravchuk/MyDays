setupDropdownWrapper("select_day_type", ".day-type-select", ".day-type-select-button",
    ".day-type-selected-value", ".day-type-select-dropdown", dayTypes, onChangeDayTypeSelect);

function onChangeDayTypeSelect(dayType) {
    const url = `${window.location.href}day_type/`;
    const formData = new FormData();
    formData.append('day_type', dayType.slice(3));
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
    });
}

setupDropdownWrapper("select_access_mode", ".access-mode-select", ".access-mode-select-button",
    ".access-mode-selected-value", ".access-mode-select-dropdown", accessModes, onChangeAccessModeSelect);

function onChangeAccessModeSelect(accessMode) {
    const url = `${window.location.href}access_mode/`;
    const formData = new FormData();
    formData.append('access_mode', accessMode);
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
    });
}