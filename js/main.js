const ApiKey = 'f6fc8e3c1b9d4ec1987121631240812';
let currentHtml = document.getElementById('hero');
let hourlyHtml = document.getElementById('hourlyHtml');
let forecastHtml = document.getElementById('forecastHtml');
let search = document.querySelector('#search');
let searchBtn = document.querySelector('#searchBtn');

let activeWeather = {}
let qs = [];
let day1='';
let day2='';
let day3 = '';

const wither = async (search1) => {
    search.value = search1;
    let wither = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${search1}&days=3`);
    let res = await wither.json();
    if (res.error) {
        search.classList.remove('is-valid');
        search.classList.add('is-invalid')
    } else {
        search.classList.remove('is-invalid');
        search.classList.add('is-valid');
    }
    console.log(res);
    activeWeather = {
        icon: res.current.condition.icon,
        text: res.current.condition.text,
        temp: temp(res.current.temp_c),
        country: res.location.country,
        region: res.location.region,
        wind: res.current.wind_kph,
        humidity: res.current.humidity,
        feelslike: res.current.feelslike_c,
        last_updated: res.current.last_updated,
        forecast: res.forecast.forecastday[0]
    };


    displayCurrent(activeWeather)
    displayForecast(res.forecast.forecastday);
    // return wither;

}
const displayCurrent = (weather) => {
    let feel = `${weather.feelslike}`.split('.')[0];

    currentHtml.innerHTML = `
        <div class=" text-center pt-2">
            <img src="https:${weather.icon}" width="80" alt="">
            <h1 class=" fs-1 fw-bolder">${weather.temp}°C</h1>
            <p class="mb-1">${weather.text} , Sunday</p>
            <p class="fw-medium  mb-2">${weather.country} , ${weather.region}</p>
        </div>
        <div class="d-flex justify-content-center gap-3 mb-5 pb-4">
            <div class="inner weather-cred fw-medium rounded-3 p-2">
                <p class="mb-0"><i class="fas fa-wind"></i> Wind</p>
                <span class="fw-bold">${weather.wind} km/h</span>
            </div>
            <div class="inner weather-cred fw-medium rounded-3 p-2">
                <p class="mb-0"><i class="fas fa-droplet"></i> Humidity</p>
                <span class="fw-bold">${weather.humidity}%</span>
            </div>
            <div class="inner weather-cred fw-medium rounded-3 p-2">

                <p class="mb-0"><i class="fa-regular fa-temperature-half"></i> Feels Like</p>
                <span class="fw-bold">${feel}°C</span>
            </div>
        </div>
    `
    displayHourly(weather.last_updated, weather.forecast)
}

const displayHourly = (index = 0, day) => {
    index = index.split(' ')[1].split(':')[0]++;
    console.log(index);
    let loop = index + 12;
    if (loop > 24) {
        loop = 24;
    }
    
    let box = ``;
    // index = index--;

    for (let i = index; i < loop; i++) {
        let hour = day.hour[i].time.split(' ')[1].split(':')[0]++;

        box += `
            <div class="col-md-1 col-2">
                <div class="inner text-black text-center">
                    <p class="mb-0">${hour == index?"Now":hour <= 12? hour+'AM': hour-12 +'PM'}</p>
                    <img src="https:${day.hour[i].condition.icon}" width="30" alt="colody">
                    <p class="mb-0">${temp(day.hour[i].temp_c)}°C</p>
                </div>
            </div>
        `
    }
    hourlyHtml.innerHTML = box;

}

const displayForecast = (days) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let box = ``;
    for (let day in days) {
        const date = new Date(days[day].date);
        let month = months[date.getMonth()];
        let active = activeWeather.last_updated;
    active = active.split(" ")[0];
        box += ` 
        <div class="col-md-4">
            <div class="inner shadow pb-3 rounded-4 text-center ${active == days[day].date ? 'active' : ''} "  >
                <div class="w-100 d-flex justify-content-between bg-light p-2 ">
                    <p>${week[date.getDay()]}</p>
                    <p>${date.getDate()} ${month}</p>
                </div>
                <img src="https:${days[day].day.condition.icon}" alt="">
                <h2 class="fw-bolder">${temp(days[day].day.avgtemp_c)}°C</h2>
                <p class="fs-xs"><span><i class="fas fa-wind"></i>${days[day].day.maxwind_mph} km/h</span> <br><span><i class="fas fa-droplet"></i> ${days[day].day.avghumidity}%</span></p>
                <p class="">${days[day].day.condition.text}</p>
            </div>
        </div>`
    }

    forecastHtml.innerHTML = box;

}

const temp = (temp_c) => {
    return `${temp_c}`.split('.')[0]
}

search.addEventListener('keyup', () => {
    if (search.value.split('').length >= 3) {
        wither(search.value)
    }
});

searchBtn.addEventListener('click', () => {
    console.log(wither(search.value));
    wither(search.value)
    
});




wither('alex')