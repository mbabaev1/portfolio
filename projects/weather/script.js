const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");

const status = document.querySelector("#status");
const weatherResult = document.querySelector("#weatherResult");

const cityName = document.querySelector("#cityName");
const weatherDescription = document.querySelector("#weatherDescription");

const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");


function getWeatherDescription(code) {

    const descriptions = {
        0: "Ясно",
        1: "Преимущественно ясно",
        2: "Переменная облачность",
        3: "Пасмурно",
        45: "Туман",
        48: "Туман с изморозью",
        51: "Слабая морось",
        53: "Морось",
        55: "Сильная морось",
        61: "Слабый дождь",
        63: "Дождь",
        65: "Сильный дождь",
        71: "Слабый снег",
        73: "Снег",
        75: "Сильный снег",
        80: "Ливень",
        81: "Сильный ливень",
        82: "Очень сильный ливень",
        95: "Гроза"
    };

    return descriptions[code] || "Погодные условия";
}


async function getCityCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ошибка поиска города");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Город не найден");
    }

    return data.results[0];
}


async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ошибка загрузки погоды");
    }

    return await response.json();
}


async function showWeather(city) {

    try {

        status.textContent = "Загружаем погоду...";
        status.className = "status loading";

        weatherResult.classList.remove("active");


        const location = await getCityCoordinates(city);

        const weatherData = await getWeather(
            location.latitude,
            location.longitude
        );


        const current = weatherData.current;


        cityName.textContent =
            `${location.name}${location.country ? ", " + location.country : ""}`;

        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);

        temperature.textContent =
            Math.round(current.temperature_2m) + "°";

        feelsLike.textContent =
            Math.round(current.apparent_temperature) + "°";

        humidity.textContent =
            current.relative_humidity_2m + "%";

        wind.textContent =
            Math.round(current.wind_speed_10m) + " км/ч";


        status.textContent = "Актуальные данные";
        status.className = "status";

        weatherResult.classList.add("active");

    } catch (error) {

        status.textContent = error.message;
        status.className = "status error";

        weatherResult.classList.remove("active");
    }
}


searchForm.addEventListener("submit", event => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        return;
    }

    showWeather(city);
});
