const yearElem = document.getElementById('year');
yearElem.innerText = `${(new Date()).getFullYear()} рік`;
const nextYearBtn = document.querySelector('.next-year');
const prevYearBtn = document.querySelector('.prev-year');
const currentDate = new Date();
const date = new Date();
date.setDate(1);


const monthSelect = document.querySelector(".month-select");
const monthSelectBtn = document.querySelector(".month-select-button");
const monthElem = document.querySelector(".month-selected-value");
const monthDropdown = document.querySelector(".month-select-dropdown");
const months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
monthElem.innerText = months[currentDate.getMonth()];
setupDropdown("select_month", monthSelect, monthSelectBtn, monthElem, monthDropdown, months, onChangeMonthSelect);


const calendar = document.querySelector(".calendar-matrix");
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');

prevMonthBtn.style.visibility = "hidden";
nextMonthBtn.style.visibility = "hidden";

if (dayParameter && searchQuery) {
    const searchQueryInput = document.querySelector(".search-input");
    searchQueryInput.value = searchQuery;
    dayParameterElem.innerText = dayParameter;
    document.querySelector(`input[type='radio'][value='${dayParameter}']`).checked = true;
    dayParameterElem.innerText = dayParameter;
    for (const day of searchResults) {
        renderDay(new Date(day.date), day, true)
    }
} else {
    renderCalendar(date);
}

function renderCalendar(certainDate) {
    calendar.innerHTML = '';
    if (isInDateRange(certainDate)) {
        prevMonthBtn.style.visibility = "hidden";
        nextMonthBtn.style.visibility = "hidden";

        let [year, month] = [certainDate.getFullYear(), certainDate.getMonth()];
        const lastMonthDay = new Date(year, month + 1, 0).getDate();
        const firstDay = areDatesEqual(certainDate, birthday) ? birthday.getDate() : 1;
        const lastDay = areDatesEqual(certainDate, currentDate) ? currentDate.getDate() : lastMonthDay;

        getMonthDays(year, month, firstDay, lastDay).then(data => {
            const days = data['days'];
            for (let day = firstDay; day <= lastDay; day++) {
                if (days && days[day]) {
                    renderDay(new Date(year, month, day), days[day]);
                } else {
                    renderDay(new Date(year, month, day));
                }
            }
            updateButtonVisibility();
            if (areDatesEqual(certainDate, currentDate)) {
                setToday(currentDate);
            }
            monthElem.innerText = months[certainDate.getMonth()];
            yearElem.innerText = `${certainDate.getFullYear()} рік`;
        }).catch(error => {
            console.error(error);
        });
    } else {
        date.setTime(certainDate < birthday ? birthday.getTime() : currentDate.getTime());
        renderCalendar(date);
    }
}

function renderDay(dayDate, day_obj = null, renderFullDate = false) {
    const strDate = dateToString(dayDate);
    const url = `${window.location.origin}/days/${username}/day/${strDate}/`;
    const listItem = document.createElement('li');
    listItem.id = strDate;
    listItem.classList.add('calendar-matrix-day');
    if (day_obj) {
        if (day_obj.image_title) {
            listItem.style.color = 'white';
            listItem.style.backgroundColor = 'black';
            listItem.innerHTML += `<div class="day-image-background" 
            style="background-image: url('${window.location.origin}${day_obj.image_title}');"></div>`;
        }
        listItem.innerHTML +=
            `<a class="prevent-a" href=${url}><div class="day-cell-content">
            <time datetime="${dayDate.toDateString()}" ${renderFullDate ? 'style="font-size: 14px;"' : ""}>${renderFullDate ? dayDate.toLocaleDateString('uk') : dayDate.getDate()}</time>
            <span class="day-access-mode">${getAccessModeIcon(day_obj.access_mode).outerHTML}</span>
            <div class="day-title">${day_obj.title ? day_obj.title : ""}</div>
            <div class="day-type"><span>${day_obj.day_type.emoji}</span>${setDayTypeName(day_obj.day_type.type, day_obj.image_title).outerHTML}</div>
        </div></a>`;
    } else {
        listItem.innerHTML = `<a class="prevent-a" href=${url}>
                <div class="day-cell-content"><time datetime="${dayDate.toDateString()}">${dayDate.getDate()}</time>
                </div></a>`;
    }
    calendar.appendChild(listItem);
}

async function getMonthDays(year, month, firstDay, lastDay) {
    const url = `${window.location.origin}/days/calendar/month/?year=${year}&month=${month + 1}&first_day=${firstDay}&last_day=${lastDay}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}


function setVisibility(element, isNotVisible) {
    element.style.visibility = isNotVisible ? "hidden" : "visible";
}


function updateButtonVisibility() {
    setVisibility(nextMonthBtn, areDatesEqual(date, currentDate));
    setVisibility(prevMonthBtn, areDatesEqual(date, birthday));
    setVisibility(nextYearBtn, areDatesEqual(date, currentDate));
    setVisibility(prevYearBtn, areDatesEqual(date, birthday));
}


function setToday(date) {
    const strDate = dateToString(date);
    const cell = document.getElementById(strDate);
    if (cell) cell.classList.add("today");
}

function dateToString(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

function onChangeMonthSelect(month) {
    date.setMonth(months.indexOf(month));
    renderCalendar(date);
}


function areDatesEqual(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}


function isInDateRange(certainDate) {
    if (areDatesEqual(certainDate, birthday) || areDatesEqual(certainDate, currentDate)) return true;
    else return certainDate > birthday && certainDate < currentDate;
}


function updateYear(yearDelta) {
    date.setFullYear(date.getFullYear() + yearDelta);
    renderCalendar(date);
}


function updateMonth(monthDelta) {
    date.setMonth(date.getMonth() + monthDelta);
    renderCalendar(date);
}

prevMonthBtn.addEventListener('click', () => {
    updateMonth(-1);
});

nextMonthBtn.addEventListener('click', () => {
    updateMonth(1);
});
prevYearBtn.addEventListener('click', () => {
    updateYear(-1);
});
nextYearBtn.addEventListener('click', () => {
    updateYear(1);
});


function getAccessModeIcon(value) {
    const icon = document.createElement('i');
    icon.className = 'material-icons-outlined';
    if (value === "private") {
        icon.style.color = "lime";
        icon.innerText = "lock";
    } else if (value === "public") {
        icon.style.color = "darkorange";
        icon.style.fontSize = "26px";
        icon.innerText = 'group';
    }
    return icon;
}

function setDayTypeName(type, day_image) {
    const typeElem = document.createElement('span');
    typeElem.innerText = type;
    if (!day_image) {
        switch (type) {
            case "особливий":
                typeElem.style.color = 'red';
                break;
            case "успішний":
                typeElem.style.color = 'rgb(255, 240, 0)';
                break;
            case "звичайний":
                typeElem.style.color = 'green';
                break;
            case "нудний":
                typeElem.style.color = 'gray';
                break;
            case "поганий":
                typeElem.style.color = 'black';
                break;
        }
    } else {
        typeElem.style.color = 'white';
    }
    return typeElem;
}