// This won't work on gh-pages because both api-s require payed version of api for https and gh-pages force https
const ipApi = 'http://api.ipstack.com/check?access_key=7aa249145b3daa7cb04ab360633f4d7d';
const openWeatherAppId = 'daae173e6601ed118415b61db6a4003f';
const body = document.body;

fetch(ipApi)
    .then(response => response.json())
    .then(data => {
        let latitude = data.latitude;
        let longitude = data.longitude;
        let city = data.city;

        const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${openWeatherAppId}`;

        fetchWeather(city, openWeatherUrl);
    })
    .catch(error => console.log(error));

let fetchWeather = (city, api) => {
    fetch(api)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let desc = capitalizeFirstLatter(data.weather[0].description);
            let temperature = data.main.temp.toFixed(0);
            let icon = data.weather[0].icon;
            let iconSrc = `http://openweathermap.org/img/w/${icon}.png`;

            let content = `
                <h2>${city}</h2>
                <p>${desc}</p>
                <div id="temperatureDiv">
                    <p id="temperature">
                        ${temperature}°
                    </p>
                    <span id="unit" data-unit="Celsius">
                        Celsius
                    </span>
                </div>
                <img src="${iconSrc}" alt="${desc}">
            `

            let weatherData = createNode('div');
            weatherData.setAttribute('id', 'weatherData');
            weatherData.innerHTML = content;

            append(body, weatherData);
            document.getElementById('unit').addEventListener('click', changeUnits(temperature));
        })
        .catch(error => console.log(error));
}

let changeUnits = (currentTemp) => {
    return () => {
        let unit = document.getElementById('unit');
        let tempItem = document.getElementById('temperature');

        if (unit.dataset.unit == 'Celsius') {
            tempItem.innerHTML = (currentTemp * 1.8 + 32).toFixed(0) + '°';
            unit.dataset.unit = 'Fahrenheit';
            unit.innerHTML = unit.dataset.unit;
        } else {
            tempItem.innerHTML = currentTemp + '°';
            unit.dataset.unit = 'Celsius';
            unit.innerHTML = unit.dataset.unit;
        }
    }
}

let capitalizeFirstLatter = (str) => {
    return str.split(' ').map(item => {
        return item.slice(0, 1).toUpperCase() + item.slice(1);
    }).join(' ');
};

// Create the type of element you pass in the parameters
const createNode = (element) => document.createElement(element);

// Append the second parameter(element) to the first one
const append = (parent, el) => parent.appendChild(el);
