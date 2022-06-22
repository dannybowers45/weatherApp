// using openweathermap.org API
//api key : 096e4009fc267bd6dfb7571425e6bfe9

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const windElement = document.querySelector(".windSpeed-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const sunriseElement = document.querySelector(".sunrise-value p");
const sunsetElement = document.querySelector(".sunset-value p");
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button")

const weather = {};

weather.windSpeed = {
    unit : "ms" //meters/sec
}
weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// api key
const key = "096e4009fc267bd6dfb7571425e6bfe9";


inputField.addEventListener("keyup", e =>{
    // checks if user pressed enter and that input value isn't empty
    if(e.key == "Enter" && inputField.value != ""){
        console.log("input check");
        getCityWeather(inputField.value);
    }
});
locationBtn.addEventListener("click", () =>{
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }
});

// user's location
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
    getWeekWeather(latitude, longitude);
}

// Geolocation error function
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//api call
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log("Current Weather JSON");
            console.dir(data);
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); //Adjusted from Kelvin 
            weather.feelsLike = Math.floor(data.main.feels_like - KELVIN); //Adjusted from Kelvin 
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.sunriseTime = moment.utc(data.sys.sunrise,'X').add(data.timezone,'seconds').format('HH:mm a'); //Adjusted from Unix UTC time
            weather.sunsetTime = moment.utc(data.sys.sunset,'X').add(data.timezone,'seconds').format('HH:mm a');
            weather.windSpeed.value = data.wind.speed;
        })
        .then(function(){
            displayWeather();
        });
}

function getCityWeather(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
   
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log("Current Weather JSON");
            console.dir(data);
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); //Adjusted from Kelvin 
            weather.feelsLike = Math.floor(data.main.feels_like - KELVIN); //Adjusted from Kelvin 
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.sunriseTime = moment.utc(data.sys.sunrise,'X').add(data.timezone,'seconds').format('HH:mm a'); //Adjusted from Unix UTC time
            weather.sunsetTime = moment.utc(data.sys.sunset,'X').add(data.timezone,'seconds').format('HH:mm a');
            weather.windSpeed.value = data.wind.speed;
        })
        .then(function(){
            displayWeather();
        });
}

//Weekly weather call only allows for latitude and longitude input
function getWeekWeather(lat, lon){
   let api2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${key}`; //&exclude={part}
    
    fetch(api2)
    .then(function(response){
        let data = response.json();
        console.log("Weekly Weather JSON");
        console.dir(data);
        return data;
    })
    .then(function(data){
        //looping through all the days of the week and outputting weather statistics
        //ran into many issues trying to parse this JSON and ultimately output to console because
        //HTML and CSS are very difficult to work with extensively and it was a JavaScript project at heart
        for(let i = 0; i < data.daily.length; i++) {
            let obj = data.daily[i];
            data.daily[i].dt
            console.log(data.daily[i]);
            var date = moment.utc(data.daily[i].dt,'X').add(data.timezone,'seconds').format('YYYY-MM-DD');
            var sunrise = moment.utc(data.daily[i].sunrise,'X').add(data.timezone_offset,'seconds').format('HH:mm a');
            var sunset = moment.utc(data.daily[i].sunset,'X').add(data.timezone_offset,'seconds').format('HH:mm a');
            var tempHigh = Math.floor(data.daily[i].temp.max - KELVIN);
            var tempLow = Math.floor(data.daily[i].temp.min - KELVIN);
            var weatherDesc = data.daily[i].weather[0].description; //took awhile to figure out this was a list of only one element, hence the '[0]'
            var windSpeed = data.daily[i].wind_speed;
            
            console.log("Date: " + date);
            console.log("Weather: " + weatherDesc);
            console.log("High of the day: " + tempHigh + " C° / " + celsiusToFahrenheit(tempLow) + " F°");
            console.log("Low of the day: " + tempLow + " C° / " + celsiusToFahrenheit(tempLow) + " F°");
            console.log("Wind Speeds: " + windSpeed + " M/S / " + metricToImperial(windSpeed) + " MPH");
            console.log("Sunrise time: " + sunrise);
            console.log("Sunset time: " + sunset);
        }

    })
}

// User interface function
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    windElement.innerHTML = `≈ ${weather.windSpeed.value}<span>M/S</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    sunriseElement.innerHTML = `sunrise \n ${weather.sunriseTime}`;
    sunsetElement.innerHTML = `sunset \n ${weather.sunsetTime}`;
}
//<img src="icons/sunset.png/>
//<img src="icons/sunrise.png/>
//celsius to fahrenheit conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}
//Meters/Sec to Miles Per Hour Conversion
function metricToImperial(windSpeed){
    return Math.floor(windSpeed * 56/25);
}

//Changes wind speed from Metric (M/S) to Imperial (MPH) and vice versa on click
windElement.addEventListener("click", function(){
    //console.log(weather.windSpeed.unit);
    if(weather.windSpeed.value === undefined) return;

    if(weather.windSpeed.unit == "ms"){
        let Imperial = metricToImperial(weather.windSpeed.value);
        Imperial = Math.floor(Imperial);
        
        windElement.innerHTML = `≈ ${Imperial}<span>MPH</span>`;
        weather.windSpeed.unit = "MPH";

    }else{
        windElement.innerHTML = `≈ ${weather.windSpeed.value}<span>M/S</span>`;
        weather.windSpeed.unit = "ms"
    }
});

//Changes Temp from celsius to fahrenheit and vice versa on click
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";

    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"

    }
});

