// Code of Weather Dashboard

// Define city input and API Key
var cityInput = document.querySelector("#city-input");
var APIKey = "d1e2d0763204896fd894698f5c6e27ee";


var searchFormEl = document.querySelector("#search-form");
var currentDate = document.querySelector("#currentDay");
var forecastTitle = document.querySelector("#forecast-title");
var forecastDays = document.querySelector("#forecast-days");
var currentWeather = document.querySelector("#current-container");

currentWeather.style.display = "none";
forecastTitle.style.display = "none";

//Weahter details
var city = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#weather-icon");
var temperature = document.querySelector("#temp");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind-speed");
var UVI = document.querySelector("#uv-index");



var searchHistory = document.querySelector("#search-history");
var deleteHistory = document.querySelector("#delete-history");


//Search city input
var searchCity = function (event,cityName) {
    event.preventDefault();
    var cityName = cityInput.value;
    if (cityName) {
        getCityWeather(cityName);
        cityInput.value = "";
        var searchedCity = JSON.parse(localStorage.getItem("CityList")) || [cityName];
        var storedCities = {city: cityName};
        searchedCity.push(storedCities);

        localStorage.setItem("CityList", JSON.stringify(searchedCity));
    } else {
        alert("You forgot to choose a city");
    }
    createCityList(searchedCity);
};

//Create search history list
function createCityList() {
    var searchedCities = JSON.parse(localStorage.getItem("CityList")) || [];
    searchHistory.innerHTML="";
     for (i = 1; i<searchedCities.length; i++){
        var buttonEl = document.createElement("li");
        buttonEl.classList = "list-group-item list-group-item-action list-group-item-dark";
        buttonEl.setAttribute(`data-id`, i);
        buttonEl.textContent = searchedCities[i].city;
        searchHistory.appendChild(buttonEl);
    }
};

var getCityWeather = function (cityName) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid='  + APIKey;

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log("Coord api:", data);
            var latitude = data.city.coord.lat;
            var longitude = data.city.coord.lon;
            
            city.textContent = data.city.name;

            fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=${APIKey}`
                )
                .then(function (response) {
                    response.json()
                        .then(function (data) {
                            displayWeather(data);
                        })
                });
        })
    });
};

// Click search
searchFormEl.addEventListener("submit", searchCity);

//Show weather details
var displayWeather = function(data) {

    //Current weather
    currentDate.textContent = new Date(data.current.dt * 1000).toLocaleDateString();
    weatherIcon.src = 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png';
    temperature.textContent = "Temperature: " + data.current.temp + "°F";
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    windSpeed.textContent= "Wind Speed: " + data.current.wind_speed + " MPH";
    var currentUVI = data.current.uvi;
    UVI.textContent = "UV Index: " + currentUVI;

    
    
    if (currentUVI >=0 && currentUVI <= 2) {UVI.classList = "bg-success text-white"}
    else if (currentUVI >=3  && currentUVI <= 5) {UVI.classList = "bg-warning"}
    else if (currentUVI >=6 && currentUVI <= 7) {UVI.classList = "bg-warning"}
    else if (currentUVI >=8) {UVI.classList = "bg-danger text-white"};    
    
    // The weather of five days
    currentWeather.style.display = "block";
    forecastTitle.style.display = "block";
    forecastDays.textContent= "";

    for (i=0; i < 5; i++) {
        
        var tag = document.createElement("div");
        tag.classList = "tag bg-secondary";
        var tagBody = document.createElement("div");
        tagBody.classList = "tag-body";
        
        var date = document.createElement("p");
        date.classList = "daily-date";
        date.textContent = new Date(data.daily[i].dt * 1000).toLocaleDateString();

        var dailyIcon = document.createElement("img");
        dailyIcon.src = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png';

        var tempEl = document.createElement("p");
        tempEl.classList = "tag-text daily-weather-text";
        tempEl.textContent = "Temp: " + data.daily[i].temp.max + "°F";
        
        var humidityEl = document.createElement("p");
        humidityEl.classList = "tag-text daily-weather-text";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";

        var windSpeedEl = document.createElement("p");
        windSpeedEl.classList = "tag-text daily-weather-text";
        windSpeedEl.textContent = "Wind: " + data.daily[i].wind_speed + "MPH";

        forecastDays.append(tag);
        tag.append(tagBody);
        tagBody.appendChild(date);
        tagBody.appendChild(dailyIcon);
        tagBody.appendChild(tempEl);
        tagBody.appendChild(humidityEl);
        tagBody.appendChild(windSpeedEl);
    }
    
};

//Show search history
var showSearchHistory = function (event) {
    var searchedCities = JSON.parse(localStorage.getItem("CityList")) || [];
    currentWeather.style.display = "block";
    var cityId = event.target.getAttribute("data-id");
    var cityIndex = searchedCities[cityId].city;
    console.log(cityIndex);
    getCityWeather(cityIndex);
};


//delete scearch history
deleteHistory.addEventListener("click", function(event){
    localStorage.clear(event);
    searchHistory.textContent = "";
    forecastDays.textContent= "";
    currentWeather.style.display = "none";
    forecastTitle.style.display = "none";
});

createCityList();


searchHistory.addEventListener("click", showSearchHistory);
