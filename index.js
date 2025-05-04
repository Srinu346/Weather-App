const search = document.querySelector('.location-button'); 
const input = document.querySelector('.search-input');
const hourlyWeatherDiv = document.querySelector('.hourly-weather .weather-list');
const API_KEy = "81aa35aef69948a094d145805250405";
const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276]
}

const HourlyDisplay=(HourlyData)=>{
    const dat = new Date().setMinutes(0,0,0);
    const next24Hours = dat + 24*60*60*1000;

    const next24HoursData = HourlyData.filter(({time})=>{
        const forecastTime = new Date(time).getTime();
        return forecastTime>= dat && forecastTime<= next24Hours;
    });
    
    hourlyWeatherDiv.innerHTML = next24HoursData.map(item =>{
        const temperature = item.temp_c;
        const time = item.time;
        const weatherIcon = Object.keys(weatherCodes).find(icon=>weatherCodes[icon].includes(item.condition.code));

        return `<li class="weather-item">
                        <p class="time">${time}</p>
                        <img class="weather-icon" src="icons/${weatherIcon}.svg">
                        <p class="temperature">${temperature}°C</p>
                    </li>`;
    }).join("");
}
const currentWeather= document.querySelector('.current-weather');

const getWeather = async (cityName) => {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEy}&q=${cityName}&days=2` ;
    try{const weather = await fetch(API_URL);
    const data = await weather.json();
    
    const temperature = data.current.temp_c;
    const description = data.current.condition.text;
    const weatherIcon = Object.keys(weatherCodes).find(icon=>weatherCodes[icon].includes(data.current.condition.code));
    
    currentWeather.querySelector(".temperature").innerHTML = `${temperature}<span>°C</span>`;
    currentWeather.querySelector(".weather-icon").src=`icons/${weatherIcon}.svg`;
    currentWeather.querySelector(".description").innerText = description;
    const combineHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
    HourlyDisplay(combineHourlyData);
    }
    catch(error){
        console.log(error);
    }
}
input.addEventListener('keyup',(e)=>{
    const cityName = input.value;
    if(e.key === "Enter" && cityName){
        getWeather(cityName);
    }
})