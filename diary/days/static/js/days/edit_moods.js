setupDropdownWrapper("select_morning_mood", ".morning-mood-select", ".morning-mood-select-button",
    ".morning-mood-selected-value", ".morning-mood-select-dropdown", moods, onChangeMorningMoodSelect);

function onChangeMorningMoodSelect(morningMood) {
    changeMood('morning', morningMood);
}

setupDropdownWrapper("select_noon_mood", ".noon-mood-select", ".noon-mood-select-button",
    ".noon-mood-selected-value", ".noon-mood-select-dropdown", moods, onChangeNoonMoodSelect);

function onChangeNoonMoodSelect(noonMood) {
    changeMood('noon', noonMood);
}

setupDropdownWrapper("select_evening_mood", ".evening-mood-select", ".evening-mood-select-button",
    ".evening-mood-selected-value", ".evening-mood-select-dropdown", moods, onChangeEveningMoodSelect);

function onChangeEveningMoodSelect(eveningMood) {
    changeMood('evening', eveningMood);
}

setupDropdownWrapper("select_night_mood", ".night-mood-select", ".night-mood-select-button",
    ".night-mood-selected-value", ".night-mood-select-dropdown", moods, onChangeNightMoodSelect);

function onChangeNightMoodSelect(nightMood) {
    changeMood('night', nightMood);
}


function changeMood(day_part, mood) {
    const url = `${window.location.href}mood/`;
    const formData = new FormData();
    formData.append(`${day_part}_mood`, mood.slice(3));
    sendFormData(url, formData, (data) => {
        setDayUpdateTime(data['updated']);
    });
}