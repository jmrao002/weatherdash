// global variables
let cityFormEl = document.querySelector("#city-search-form");
let cityInputEl = document.querySelector("#city");
let weatherContainerEl = document.querySelector("#current-weather-container");
let citySearchInputEl = document.querySelector("#searched-city");
let forecastTextEl = document.querySelector("#forecast-header-text");
let forecastContainerEl = document.querySelector("#fiveday-container");
let previousSearchButtonEl = document.querySelector("#past-search-buttons");
let cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
// api key for authentication
const apiKey = "e16c89093c956c2cd45ad971b9b24220";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

function getWeather(e) {
  e.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getCityWeather(city);
    get5Day(city);
    cityHistory.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please enter a City");
  }
  saveSearch();
  searchHistory(city);
}

function saveSearch() {
  localStorage.setItem("cities", JSON.stringify(cityHistory));
}

// function to call API to get weather from search term
function getCityWeather(city) {
  let apiUrl =
    baseUrl + "weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      printWeather(data, city);
    });
  });
}

function printWeather(weather, searchCity) {
  // clear old content
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;

  // create date element
  let currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchInputEl.appendChild(currentDate);

  // create an image element
  let weatherIcon = document.createElement("img");
  let icon = weather.weather[0].icon;
  weatherIcon.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + icon + "@2x.png"
  );
  citySearchInputEl.appendChild(weatherIcon);

  // create a span element to hold temperature data
  let temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item";

  // create a span element to hold Humidity data
  let humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  // create a span element to hold Wind data
  let windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";

  //append to container
  weatherContainerEl.appendChild(temperatureEl);

  //append to container
  weatherContainerEl.appendChild(humidityEl);

  //append to container
  weatherContainerEl.appendChild(windSpeedEl);

  let lat = weather.coord.lat;
  let lon = weather.coord.lon;
  getUvIndex(lat, lon);
}

function getUvIndex(lat, lon) {
  let apiUrl = baseUrl + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      printUvIndex(data);
    });
  });
}

function printUvIndex(index) {
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: ";
  uvIndexEl.classList = "list-group-item";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "rounded favorable";
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "rounded moderate ";
  } else if (index.value > 8) {
    uvIndexValue.classList = "rounded severe";
  }

  uvIndexEl.appendChild(uvIndexValue);

  //append index to current weather
  weatherContainerEl.appendChild(uvIndexEl);
}

function get5Day(city) {
  let apiUrl =
    baseUrl + "forecast?q=" + city + "&units=imperial&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      print5Day(data);
    });
  });
}

// function to print 5 day forecast
function print5Day(weather) {
  forecastContainerEl.textContent = "";
  forecastTextEl.textContent = "5-Day Forecast:";

  let forecast = weather.list;
  for (let i = 5; i < forecast.length; i = i + 8) {
    let dailyForecast = forecast[i];

    let forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-info text-light m-2";

    //create date element
    let forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //create an image element
    let weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    let icon = dailyForecast.weather[0].icon;
    weatherIcon.setAttribute(
      "src",
      "https://openweathermap.org/img/wn/" + icon + "@2x.png"
    );

    //append to forecast card
    forecastEl.appendChild(weatherIcon);

    //create and append temperature span
    let forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
    forecastEl.appendChild(forecastTempEl);

    //create and append wind span
    let forecastWindEl = document.createElement("span");
    forecastWindEl.classList = "card-body text-center";
    forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
    forecastEl.appendChild(forecastWindEl);

    // create and append humidity span
    let forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent =
      "Humidity: " + dailyForecast.main.humidity + "  %";
    forecastEl.appendChild(forecastHumEl);

    //append to five day container
    forecastContainerEl.appendChild(forecastEl);
  }
}

// function to populate aside with previous search data
function searchHistory(previousSearch) {
  searchHistoryEl = document.createElement("button");
  searchHistoryEl.textContent = previousSearch;
  searchHistoryEl.classList = "d-flex w-100 btn-light rounded border p-2";
  searchHistoryEl.setAttribute("data-city", previousSearch);
  searchHistoryEl.setAttribute("type", "submit");
  previousSearchButtonEl.prepend(searchHistoryEl);
}

function previousSearchHandler(event) {
  let city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    get5Day(city);
  }
}

// event listeners
cityFormEl.addEventListener("submit", getWeather);
previousSearchButtonEl.addEventListener("click", previousSearchHandler);

// add function to return alert error if city is not found
