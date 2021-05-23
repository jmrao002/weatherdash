// global variables
let cityFormEl = document.querySelector("#city-search-form");
let cityInputEl = document.querySelector("#city");
let weatherContainerEl = document.querySelector("#todays-weather-container");
let citySearchInputEl = document.querySelector("#searched-city");
let forecastTextEl = document.querySelector("#forecast-header-text");
let forecastContainerEl = document.querySelector("#fiveday-container");
let previousSearchButtonEl = document.querySelector("#search-history-buttons");
let cityHistoryEl = JSON.parse(localStorage.getItem("cities")) || [];
// api key for authentication
const apiKey = "e16c89093c956c2cd45ad971b9b24220";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

// function to get the weather and to throw an error if no data is entered
function getWeather(e) {
  e.preventDefault();
  let city = cityInputEl.value.trim();
  if (!city) {
    alert("Please enter a City");
  } else {
    getCityWeather(city);
    getFiveDay(city);
    cityHistoryEl.unshift({ city });
    cityInputEl.value = "";
    saveSearch();
    searchHistory(city);
  }
}

// put search data into local storage
function saveSearch() {
  localStorage.setItem("cities", JSON.stringify(cityHistoryEl));
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

// print weather data to screen
function printWeather(weather, searchCity) {
  // unhide page container
  let pageContainerEl = document.querySelector("#page-container");
  pageContainerEl.classList.remove("d-none");
  // clear old content when searching for a new city
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;
  // create date el
  let currentDate = document.createElement("span");
  currentDate.textContent =
    "   -   " + moment(weather.dt.value).format("dddd MMM D");
  citySearchInputEl.appendChild(currentDate);
  // create an image el
  let wIcon = document.createElement("img");
  let icon = weather.weather[0].icon;
  wIcon.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + icon + ".png"
  );
  citySearchInputEl.appendChild(wIcon);
  console.log(weather);

  // create el for temp data
  let tempEl = document.createElement("span");
  tempEl.textContent =
    "Temperature: " + Math.round(weather.main.temp) + "°F";
  tempEl.classList = "list-group-item";

  // create el for feels like temp
  let feelsLikeEl = document.createElement("span");
  feelsLikeEl.textContent =
    "Feels Like: " + Math.round(weather.main.feels_like) + "°F";
  feelsLikeEl.classList = "list-group-item";

  // create el for humidity data
  let humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
  humidityEl.classList = "list-group-item";

  // create el for wind data
  let windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind: " + Math.round(weather.wind.speed) + " MPH";
  windSpeedEl.classList = "list-group-item";

  //append to weather container
  weatherContainerEl.appendChild(tempEl);
  weatherContainerEl.appendChild(feelsLikeEl);
  weatherContainerEl.appendChild(humidityEl);
  weatherContainerEl.appendChild(windSpeedEl);

  // define latitute and longitude for following API call
  let lat = weather.coord.lat;
  let lon = weather.coord.lon;
  getUvIndex(lat, lon);
}

// get uv index from API using lat and lon from previous function
function getUvIndex(lat, lon) {
  let apiUrl = baseUrl + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      printUvIndex(data);
    });
  });
}

// print uv index
function printUvIndex(index) {
  let uvIndexEl = document.createElement("div");
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

  //append index to current weather
  uvIndexEl.appendChild(uvIndexValue);
  weatherContainerEl.appendChild(uvIndexEl);
}

// function to get the five dat forecast
function getFiveDay(city) {
  let apiUrl =
    baseUrl + "forecast?q=" + city + "&units=imperial&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      printForecast(data);
    });
  });
}

// function to print 5 day forecast
function printForecast(weather) {
  forecastContainerEl.textContent = "";
  forecastTextEl.textContent = "5-Day Forecast";

  let forecast = weather.list;
  for (let i = 5; i < forecast.length; i = i + 8) {
    let dailyForecast = forecast[i];

    let forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-info text-light m-2";

    //create date el
    let forecastDate = document.createElement("h4");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("ddd MMM D");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //create an image el
    let wIcon = document.createElement("img");
    wIcon.classList = "card-body text-center";
    let icon = dailyForecast.weather[0].icon;
    wIcon.setAttribute(
      "src",
      "https://openweathermap.org/img/wn/" + icon + ".png"
    );

    //append to forecast card
    forecastEl.appendChild(wIcon);

    //create and append temp span
    let forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body";
    forecastTempEl.textContent =
      "Temp: " + Math.round(dailyForecast.main.temp) + " °F";
    forecastEl.appendChild(forecastTempEl);

    //create and append wind span
    let forecastWindEl = document.createElement("span");
    forecastWindEl.classList = "card-body";
    forecastWindEl.textContent =
      "Wind: " + Math.round(dailyForecast.wind.speed) + " MPH";
    forecastEl.appendChild(forecastWindEl);

    // create and append humidity span
    let forecastHumidityEl = document.createElement("span");
    forecastHumidityEl.classList = "card-body";
    forecastHumidityEl.textContent =
      "Humidity: " + dailyForecast.main.humidity + "%";
    forecastEl.appendChild(forecastHumidityEl);

    //append to five day container
    forecastContainerEl.appendChild(forecastEl);
  }
}

// function to populate aside with previous search data
function searchHistory(previousSearch) {
  searchHistoryEl = document.createElement("button");
  searchHistoryEl.textContent = previousSearch;
  searchHistoryEl.classList = "d-flex w-100 btn-dark rounded border p-2";
  searchHistoryEl.setAttribute("data-city", previousSearch);
  searchHistoryEl.setAttribute("type", "submit");
  previousSearchButtonEl.prepend(searchHistoryEl);
}

// function to run search again from previous
function previousSearchHandler(e) {
  let city = e.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    getFiveDay(city);
  }
}

// event listeners
cityFormEl.addEventListener("submit", getWeather);
previousSearchButtonEl.addEventListener("click", previousSearchHandler);
