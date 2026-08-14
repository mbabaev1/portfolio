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

const forecast = document.querySelector("#forecast");
const forecastGrid = document.querySelector("#forecastGrid");

const locationButton = document.querySelector("#locationButton");


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

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55 ||
        code === 61 ||
        code === 63 ||
        code === 65 ||
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return "🌧️";
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75
    ) {
        return "❄️";
    }

    if (code === 95) {
        return "⛈️";
    }

    return "🌡️";
}

function renderForecast(daily) {

    forecastGrid.innerHTML = "";

    daily.time.forEach((date, index) => {

        const day = new Date(date);

        const dayName = day.toLocaleDateString("ru-RU", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `
            <p class="forecast-date">
                ${dayName}
            </p>

            <div class="forecast-icon">
    ${getWeatherIcon(daily.weather_code[index])}
</div>

            <p class="forecast-description">
                ${getWeatherDescription(daily.weather_code[index])}
            </p>

            <div class="forecast-temperature">
                <strong>
                    ${Math.round(daily.temperature_2m_max[index])}°
                </strong>

                <span>
                    ${Math.round(daily.temperature_2m_min[index])}°
                </span>
            </div>
        `;

        forecastGrid.appendChild(card);
    });

    forecast.classList.add("active");
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
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&forecast_days=5` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ошибка загрузки погоды");
    }

    return await response.json();
}

async function showWeatherByCoordinates(latitude, longitude) {

    try {
        status.textContent = "Определяем погоду по местоположению...";
        status.className = "status loading";

        weatherResult.classList.remove("active");
        forecast.classList.remove("active");

        const weatherData = await getWeather(latitude, longitude);
        const current = weatherData.current;

        cityName.textContent = "Ваше местоположение";

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

        renderForecast(weatherData.daily);

    } catch (error) {
        status.textContent = "Не удалось загрузить погоду";
        status.className = "status error";

        weatherResult.classList.remove("active");
        forecast.classList.remove("active");
    }
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

        renderForecast(weatherData.daily);

    } catch (error) {

        status.textContent = error.message;
        status.className = "status error";

        weatherResult.classList.remove("active");

        forecast.classList.remove("active");
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

locationButton.addEventListener("click", () => {

    if (!navigator.geolocation) {
        status.textContent = "Геолокация не поддерживается браузером";
        status.className = "status error";
        return;
    }

    status.textContent = "Определяем ваше местоположение...";
    status.className = "status loading";

    navigator.geolocation.getCurrentPosition(
        position => {
            showWeatherByCoordinates(
                position.coords.latitude,
                position.coords.longitude
            );
        },

        () => {
            status.textContent = "Не удалось получить местоположение";
            status.className = "status error";
        }
    );
});
