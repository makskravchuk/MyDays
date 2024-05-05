const dayParameterSelect = document.querySelector(".day-search-property");
const dayParameterSelectBtn = document.querySelector(".property-select-button");
const dayParameterElem = document.querySelector(".property-selected-value");
const dayParameterDropdown = document.querySelector(".property-select-dropdown");
const dayParameters = ["Заголовок дня", "Опис дня", "Список справ", "Відвідані місця", "Пов'язані люди", "Досягнення", "Життєві уроки", "Висновки"];

const options = setupDropdown("day_parameter", dayParameterSelect, dayParameterSelectBtn, dayParameterElem, dayParameterDropdown, dayParameters);

dayParameterElem.innerText = dayParameters[0];
options[0].querySelector("input[type='radio']").checked = true;