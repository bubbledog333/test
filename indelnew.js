function showDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];

  return `Last Updated: ${day} ${hours}:${minutes}`;
}

function getForecast(coordinates) {
  let apiKey = "2980ff43226d67e53abfcdb6d457dcc8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let temperature = document.querySelector("#tempNow");
  temperature.innerHTML = Math.round(response.data.main.temp);

  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;

  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = Math.round(response.data.main.feels_like);

  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;

  let dateNow = document.querySelector("#date");
  dateNow.innerHTML = showDate(response.data.dt * 1000);

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
  celcius = response.data.main.temp;
}

function search(city) {
  let apiKey = "2980ff43226d67e53abfcdb6d457dcc8";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function citySubmit(event) {
  event.preventDefault();
  celciusTemp.classList.add("active");
  fahrenheit.classList.remove("active");
  let searchBar = document.querySelector("#search-bar");
  search(searchBar.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", citySubmit);

function showFahrenheit(event) {
  event.preventDefault();
  celciusTemp.classList.remove("active");
  fahrenheit.classList.add("active");
  let temperature = document.querySelector("#tempNow");
  let fahrenheitTemperature = (celcius * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}
let celcius = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

function showCelcius(event) {
  event.preventDefault();
  celciusTemp.classList.add("active");
  fahrenheit.classList.remove("active");
  let temperature = document.querySelector("#tempNow");
  temperature.innerHTML = Math.round(celcius);
}

let celciusTemp = document.querySelector("#celcius");
celciusTemp.addEventListener("click", showCelcius);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forcastApi = response.data.daily;
  let forecast = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forcastApi.forEach(function (forcastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
<div class="col-2">
<div class="weatherDate">${formatDay(forcastDay.dt)}</div>
<img src="http://openweathermap.org/img/wn/${
          forcastDay.weather[0].icon
        }@2x.png" alt="" width="40px">
  <span class="topTemp"> ${Math.round(
    forcastDay.temp.max
  )}</span> <span class="bottomTemp">${Math.round(forcastDay.temp.min)}</span>
</div> `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

search("Sydney");
