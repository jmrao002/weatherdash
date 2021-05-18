// global variables
let cityEl = document.querySelector("#city-text");
let historyEl = document.querySelector("#history-container");
let cityNameEl = document.querySelector("#city-name");
let dateEl = document.querySelector("#date");
let iconEl = document.querySelector("#weather-icon");
let cTempEl = document.querySelector("#current-temp");
let cWindEl = document.querySelector("#current-wind");
let cHumidityEl = document.querySelector("#current-humidity");
let cUvindexEl = document.querySelector("#current-uvindex");
let cities = JSON.parse(localStorage.getItem("#search")) || [];
// apiKey
const APIKey = "e16c89093c956c2cd45ad971b9b24220";

// functions
// wrap an init around all this
function getWeather(cityName) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  fetch(
    "api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey,
    requestOptions
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error))
  );
}



function searchCities() {
  let cityEntry = cityEl.value;
  getWeather(cityEntry);
  cities.push(cityEntry);
  localStorage.setItem("cities", JSON.stringify(searchHistory));
  printSearchHistory();
}

printSearchHistory();
if (cities.length > 0) {
  getWeather(cities[cities.length - 1]);
}

// search box event listener
document.querySelector("#search-button").onclick = searchCities;
