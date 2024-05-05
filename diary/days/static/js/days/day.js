const menuLinks = document.querySelectorAll(".day-menu-item a");
const healthValueElem = document.getElementById("day-health-value");
const healthDescription = document.getElementById("day-health-description");
const taskStatusElements = document.querySelectorAll(".task-status");
const accessModeValueElem = document.querySelector(".access-mode-value");
const dayTypeValueElem = document.querySelector(".day-type-value");

if (taskStatusElements) setElementsTaskStatusStyle(taskStatusElements);
if (healthValueElem) setHealthValueStyle(healthValueElem);
if (dayTypeValueElem) setDayTypeValueStyle(dayTypeValueElem);
if (accessModeValueElem) setAccessModeValueStyle(accessModeValueElem);

for (const link of menuLinks) {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const elemId = link.getAttribute('href');
        const targetElem = document.querySelector(elemId);
        const offsetTop = targetElem.offsetTop - 20;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
        });
    });
}

window.addEventListener("scroll", () => {
    const contentBlocks = document.querySelectorAll(".day-content-block");
    contentBlocks.forEach((block) => {
        const blockRect = block.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const link = document.querySelector(`.day-menu-item:has(a[href="#${block.id}"])`)
        if (blockRect.top <= windowHeight && blockRect.top > 0) {
            link.classList.add("current-section");
        } else {
            link.classList.remove("current-section");
        }
    });
});

function setHealthValueStyle(healthValueElem) {
    const healthValue = healthValueElem.getAttribute("data-feeling");
    switch (healthValue) {
        case "excellent":
            healthValueElem.style.color = healthDescription.style.borderLeftColor = "lime";
            break;
        case "good":
            healthValueElem.style.color = healthDescription.style.borderLeftColor = "darkgreen";
            break;
        case "average":
            healthValueElem.style.color = healthDescription.style.borderLeftColor = "#caced1";
            break;
        case "poor":
            healthValueElem.style.color = healthDescription.style.borderLeftColor = "lightcoral";
            break;
        case "critical":
            healthValueElem.style.color = healthDescription.style.borderLeftColor = "darkred";
            break;
    }
}

function setElementsTaskStatusStyle(taskStatusElements) {
    taskStatusElements.forEach(elem => {
        setTaskStatusStyle(elem)
    });
}

function setTaskStatusStyle(elem) {
    const status = elem.getAttribute('data-status');
    if (status === "completed") {
        elem.className = 'task-status task-done';
        elem.innerHTML = `<i class="material-icons-outlined">done</i>`;
    } else if (status === "failed") {
        elem.className = 'task-status task-failed';
        elem.innerHTML = `<i class="material-icons-outlined">close</i>`;
    } else {
        elem.className = 'task-status';
        elem.innerHTML = ``;
    }
}


function setDayTypeValueStyle(dayTypeValueElem) {
    const dayTypeValue = dayTypeValueElem.getAttribute("data-day-type");
    switch (dayTypeValue) {
        case "special":
            dayTypeValueElem.style.color = 'red';
            dayTypeValueElem.style.borderColor = 'red';
            break;
        case "successful":
            dayTypeValueElem.style.color = 'rgb(255, 240, 0)';
            dayTypeValueElem.style.borderColor = 'rgba(255, 240, 0)';
            break;
        case "ordinary":
            dayTypeValueElem.style.color = 'green';
            dayTypeValueElem.style.borderColor = 'green';
            break;
        case "boring":
            dayTypeValueElem.style.color = 'gray';
            dayTypeValueElem.style.borderColor = 'gray';
            break;
        case "bad":
            dayTypeValueElem.style.color = 'black';
            dayTypeValueElem.style.borderColor = 'black';
            break;
    }
}

function setAccessModeValueStyle(accessModeValueElem) {
    const accessModeValue = accessModeValueElem.getAttribute("data-access-mode");
    if (accessModeValue === "private") {
        accessModeValueElem.style.color = "lime";
        accessModeValueElem.style.borderColor = "lime";
        accessModeValueElem.innerHTML = `<i class="material-icons-outlined">lock</i>` + accessModeValueElem.innerHTML;
    } else if (accessModeValue === "public") {
        accessModeValueElem.style.color = "darkorange";
        accessModeValueElem.style.borderColor = "darkorange";
        accessModeValueElem.innerHTML = `<i class="material-icons-outlined">group</i>` + accessModeValueElem.innerHTML;
    }
}