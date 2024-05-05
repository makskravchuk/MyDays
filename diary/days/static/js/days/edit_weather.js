const getWeatherBtn = document.getElementById("get-weather-button");
const cityInput = document.querySelector(".weather-city-input");
const minTemperatureElem = document.querySelector(".min-temperature");
const maxTemperatureElem = document.querySelector(".max-temperature");
const weatherIconElem = document.querySelector(".condition-img");
const weatherDescriptionElem = document.querySelector(".condition-description");
getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value;
    if (city) {
        const weather_url = `https://weatherapi-com.p.rapidapi.com/history.json?q=${city}&dt=${date}&lang=uk`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '784f8891abmsh12f93e41560b96dp146fb9jsnaf2b909d8625',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(weather_url, options);
            const result = await response.json();
            if (result.error) {
                alert(result.error.message);
            } else {
                const forecast = result.forecast.forecastday[0].day;
                const url = `${window.location.href}weather/set/`
                const formData = new FormData()
                formData.append("min_temperature", forecast['mintemp_c']);
                formData.append("max_temperature", forecast['maxtemp_c']);
                formData.append("description", forecast.condition.text);
                formData.append("icon_url", forecast.condition.icon);
                sendFormData(url, formData, (data) => {
                    minTemperatureElem.children[0].innerText = `${forecast['mintemp_c']}°C`;
                    maxTemperatureElem.children[0].innerText = `${forecast['maxtemp_c']}°C`;
                    weatherDescriptionElem.innerText = forecast.condition.text;
                    weatherIconElem.setAttribute("src", forecast.condition.icon);
                    setDayUpdateTime(data['updated']);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
});