const monthInput = document.querySelector("input[type='hidden'][name='month']")
const yearInput = document.querySelector("input[type='hidden'][name='year']")
const morningMoodCanvas = document.getElementById("morning-mood-chart").getContext('2d');
const afternoonMoodCanvas = document.getElementById("afternoon-mood-chart").getContext('2d');
const eveningMoodCanvas = document.getElementById("evening-mood-chart").getContext('2d');
const nightMoodCanvas = document.getElementById("night-mood-chart").getContext('2d');
const moodColors = ['rgb(255,255,0)', 'rgb(255, 0,0)', 'rgb(255, 0,255)', 'rgba(0,255,0,1)', '#fc9b08', '#fac778', '#0d8ccd', 'rgb(200, 200,200)', '#555', 'dark'];
const moodsMarkers = document.querySelectorAll(".mood-color");
for (let i = 0; i < moodsMarkers.length; i++) {
    moodsMarkers[i].style.background = moodColors[i];
}
let morningMoodChart = new Chart(morningMoodCanvas, formMoodChartData(morningMoodsData, "Ранок"));
let afternoonMoodChart = new Chart(afternoonMoodCanvas, formMoodChartData(noonMoodsData, "День"));
let eveningMoodChart = new Chart(eveningMoodCanvas, formMoodChartData(eveningMoodsData, "Вечір"));
let nightMoodChart = new Chart(nightMoodCanvas, formMoodChartData(nightMoodsData, "Ніч"));


let healthCanvas = document.getElementById("health-chart").getContext('2d');
healthCanvas.canvas.height = 310;
healthCanvas.canvas.width = '100%';
healthChartBorderWidth = {'all': 1, 'year': 2, 'month': 3};
healthChartLabels = {'all': 'Увесь час', 'year': 'Рік', 'month': 'Місяць'}
let healthChart = new Chart(healthCanvas, {
    type: 'line',
    data: {
        labels: feelingLabels,
        datasets: [{
            label: healthChartLabels[period],
            data: feelingsData,
            tension: 0.1,
            borderColor: 'cornflowerblue',
            borderWidth: healthChartBorderWidth[period],
        }],
    },
    options: {
        scales: {
            x: {
                min: 1,
                max: feelingsDaysRange,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                },
            },
        },
        indexAxis: 'y',
        plugins: {
            legend: {
                display: true,
                labels: {
                    boxWidth: 0,
                    boxHeight: 0,
                },
            },
            title: {
                display: true,
                text: 'Самопочуття',
                font: {
                    size: 18,
                },
                color: 'black'
            }
        },
        elements: {
            point: {
                pointRadius: 0, // hide markers
            }
        },
    }
});


let dayTypeCanvas = document.getElementById("day-type-chart").getContext('2d');
dayTypeCanvas.canvas.width = 490;
dayTypeCanvas.canvas.height = 310;
let dayTypeChart = new Chart(dayTypeCanvas, {
    type: 'bar',
    data: {
        labels: dayTypeLabels,
        datasets: [{
            label: "Кількість днів",
            data: dayTypesData,
            barThickness: 30,
            backgroundColor: ['rgb(255, 0,255,1)', 'rgba(255,255,0,1)', 'rgba(0,255,0,1)', 'rgba(200, 200,200,1)', 'rgba(255, 0,0,1)'],
            borderRadius: 5,
        }],
    },
    options: {
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    precision: 0
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Типи днів',
                font: {
                    size: 18,
                },
                color: 'black'
            }
        }
    }
});


function formMoodChartData(data, title) {
    return {
        type: 'doughnut',
        data: {
            labels: moodLabels,
            datasets: [{
                cutout: 35,
                label: "Кількість днів",
                data: data,
                backgroundColor: moodColors,
                color: 'black',
                borderRadius: 5
            }],
        },
        options: {
            aspectRatio: 0.7,
            plugins: {
                legend: {
                    position: "bottom",
                    display: false,
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        font: {
                            size: 14,
                        }
                    },
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 15,
                        weight: 500,
                    },
                    color: 'black',
                }
            },
        }
    };
}


const yearElem = document.getElementById('year-value');
const monthElem = document.getElementById('month-value');
const nextYearBtn = document.querySelector('.next-year');
const prevYearBtn = document.querySelector('.prev-year');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const currentDate = new Date();
const date = new Date(year, month - 1);
yearElem.innerText = `${year} рік`;
yearInput.value = year;
const months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
monthElem.innerText = months[month - 1];
monthInput.value = month;

function updateDate(date) {
    if (isInDateRange(date)) {
        monthElem.innerText = months[date.getMonth()];
        monthInput.value = date.getMonth() + 1;
        yearElem.innerText = `${date.getFullYear()} рік`;
        yearInput.value = date.getFullYear();
        setVisibility(nextMonthBtn, !areDatesEqual(date, currentDate));
        setVisibility(prevMonthBtn, !areDatesEqual(date, birthday));
        setVisibility(nextYearBtn, !areDatesEqual(date, currentDate));
        setVisibility(prevYearBtn, !areDatesEqual(date, birthday));
    } else {
        date.setTime(date < birthday ? birthday.getTime() : currentDate.getTime());
        updateDate(date);
    }
}


function updateYear(yearDelta) {
    date.setFullYear(date.getFullYear() + yearDelta);
    updateDate(date);
}

function updateMonth(monthDelta) {
    date.setMonth(date.getMonth() + monthDelta);
    updateDate(date);
}


function setVisibility(element, visible) {
    element.style.visibility = visible ? "visible" : "hidden";
}

function isInDateRange(certainDate) {
    if (areDatesEqual(certainDate, birthday) || areDatesEqual(certainDate, currentDate)) return true;
    else return certainDate > birthday && certainDate < currentDate;
}

function areDatesEqual(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

prevYearBtn.addEventListener('click', () => {
    updateYear(-1);
});
nextYearBtn.addEventListener('click', () => {
    updateYear(1);
});

prevMonthBtn.addEventListener('click', () => {
    updateMonth(-1);
});

nextMonthBtn.addEventListener('click', () => {
    updateMonth(1);
});