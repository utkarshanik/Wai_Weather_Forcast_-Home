let city = document.querySelector('.city_name');
let search_city = document.querySelector('.search')
let daysContainer = document.querySelector('.day5'); // Get the element with class .5day
let hourContainer = document.querySelector('.hour5');
let time;

// Eventlistener => Clcik
search_city.addEventListener('click', async () => {
  let cityy = city.value.trim();  // Get user input
  daysContainer.innerHTML = '';
  hourContainer.innerHTML = '';
  if (!cityy) {
    console.error("City name is empty!");
    return;
  }
  console.log("City entered:", cityy);
  let data = await fetchData(cityy);
  await main(data);
})

// Eventlistener => KeyDown
city.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {  
    let cityy = city.value.trim();      daysContainer.innerHTML = '';
    hourContainer.innerHTML = '';
    if (!cityy) {
      console.error("City name is empty!");
      return;
    }

    // Fetch weather data only after the user enters the city name
    let data = await fetchData(cityy);
    await main(data);
  }
});

//By Default Value
async function chalo() {
  let a = await fetchData('Ahmednagar');
  await main(a);
}

//To get the city name and uv
async function fetchData(cityy) {
  try {
    let res = await fetch(`https://api.weatherapi.com/v1/current.json?key=e7adf9952dc040049ea70053251003&q=${cityy}&aqi=yes`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} - ${res.statusText}`);
    }

    let data = await res.json();
    await fetchData1(cityy);

    return data;
  } catch (error) {
    alert('Please Provide Valid City Name')
    console.error('Error fetching data:', error);

  }
}

//To get the hourls and 5 day forcast
async function fetchData1(cityname) {
  try {
    let res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=7558760060b43c7b8805cc83f755f6f5`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} - ${res.statusText}`);
    }

    let [data] = await res.json();

    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=7558760060b43c7b8805cc83f755f6f5`);

    let data2 = await response.json();
    // console.log(data2)

    let temp_data;
    let date;
    let days = '';

    // Extract 5-day data by filtering for a specific time (e.g., 12:00 PM)
    const dailyData = data2.list.filter(item => item.dt_txt.includes("12:00:00"));
    if (dailyData.length > 0) {
      if (daysContainer) {
        dailyData.forEach(item => {
          const weatherDescription = item.weather[0].description;
          const icon = item.weather[0].icon; 
          temp_data = item.main.temp - 273.15; 
          date = item.dt_txt.split(" ")[0]; // Get date only
          // console.log(`Icon:${icon}, Temp: ${temp_data.toFixed(2)}°C, Date: ${date}, Weather: ${weatherDescription}`);
          daysContainer.innerHTML += `
            <div class="d-flex justify-content-between align-items-center">
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}">
            <p>${temp_data.toFixed(2)}&degC</p>
            <p>${date_String(date)}</p>
            </div>
            `;
        });
      } else {
        console.error("Element with class '.5day' not found.");
      }
    } else {
      console.error("No data found for 12:00 PM.");
    }


    //Extract the Hourly data
    if (data2.list && data2.list.length > 0) {
      // Extract the first 5 elements
      const firstFiveElements = data2.list.slice(0, 4);
      // Process and log data for each element
      const processedData = firstFiveElements.map(item => {
        const dateTime = item.dt_txt.split(" ")[1]; // Date and time
        // console.log(item);
        const temperature = item.main.temp - 273.15
        const weatherDescription = item.weather[0].description; // Weather description
        const icon = item.weather[0].icon; // Weather icon
        // console.log(`Time: ${dateTime}, Temp: ${temperature},Weather: ${weatherDescription}, Icon: ${icon}`);
    
        hourContainer.innerHTML +=
          `<div class="col-3 text-center">
            <h3 class="text-center ">${time_String(dateTime)}</h3>
            <span class="feel_temp"><img src="http://openweathermap.org/img/wn/${icon}.png" alt=""></span>
            <p class="text-center mb-2">${temperature.toFixed(2)}&degC</p>
            <span class="feel_temp "><img src="image/navigatio1.png" alt=""></span>
            <p class="text-center">${item.wind.speed}km/h</p>
          </div>`
        return { dateTime, temperature, weatherDescription, icon };
      });
    }
    else {
      console.log("No data available in the list.");
    }

    //Converting timestamp to the Current Date
    function timestamp(time) {
      const date = new Date(time * 1000); // Multiply by 1000 to convert seconds to milliseconds
      const localDate = date.toLocaleString();
      return localDate;
    }

    // Getting Sunrise and Sunset
    let a = data2.city.sunrise
    let b = data2.city.sunset
    let rise = await timestamp(a)
    let set = await timestamp(b)

    document.querySelector('.rise').innerHTML = rise.split(" ")[1]
    document.querySelector('.set').innerHTML = set.split(" ")[1]
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
}

//Putting the data in first two Box
async function main(a) {
  document.querySelector('.city').innerHTML = `${a.location.name}`
  let local = a.location.localtime
  let [date, time] = local.split(" ")
  document.querySelector('.time').innerHTML = `${time}`
  document.querySelector('.day').innerHTML = `${date_String(date)}`
  document.querySelector('.temp').innerHTML = `${a.current.temp_c}&deg`
  document.querySelector('.feel_temp').innerHTML = `Feels like ${a.current.feelslike_c}&degC`
  document.querySelector('.weatherImg').innerHTML = `<img src="${a.current.condition.icon}" alt="">
    <span class="text-center">${a.current.condition.text}</span>`
  document.querySelector('.humidity').innerHTML = `${a.current.humidity}`
  document.querySelector('.wind').innerHTML = `${a.current.wind_kph}`
  document.querySelector('.pressure').innerHTML = `${a.current.pressure_in}`
  document.querySelector('.uv').innerHTML = `${a.current.uv}`

}

// calling the default value
chalo();

// converting Time
function time_String(time) {
  let result = time.substring(0, 5)
  return result
}

// converting Date
function date_String(date) {
  let result = date.split("-").reverse().join("-");
  return result;
}

//Toogle for light and dark mode
let radio = document.querySelector('.checkin')
let mode = document.querySelector('.mode')
let elements = document.querySelectorAll('.tab-1'); 
radio.addEventListener('click', () => {
  if (radio.dataset.val === 'one') {
    document.body.style.background = '#f4f3ee'
    elements.forEach((el) => {
      el.classList.add('tab2'); 
    });

    radio.dataset.val = 'two'
    mode.innerText = 'Dark Mode'
  }
  else {
    document.body.style.background = 'rgb(76, 77, 77)'
    radio.dataset.val = 'one';
    mode.innerText = 'Light Mode'
    elements.forEach((el) => {
      el.classList.remove('tab2'); 
    });

  }
})

//Getting current Geolocation
async function geo() {
  async function getLocation() {
    if (navigator.geolocation) {
      let a = navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  async function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let data = { lat, lon }
    console.log(data);

    let ge = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=ca5dd58b9959440cba238cc3a98b267a`)
    let ge1 = await ge.json();

    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${ge1.latitude}&lon=${ge1.longitude}&appid=7558760060b43c7b8805cc83f755f6f5`);

    let data2 = await response.json();

    let data4 = await fetchData(ge1.city);
    await main(data4);

    daysContainer.innerHTML = '';
    hourContainer.innerHTML = '';
    let temp_data;
    let date;
    let days = '';

    const dailyData = data2.list.filter(item => item.dt_txt.includes("12:00:00"));
    if (dailyData.length > 0) {
      if (daysContainer) {
        dailyData.forEach(item => {
          const weatherDescription = item.weather[0].description;
          const icon = item.weather[0].icon;
          temp_data = item.main.temp - 273.15; 
          date = item.dt_txt.split(" ")[0]; 

          daysContainer.innerHTML += `
              <div class="d-flex justify-content-between align-items-center">
              <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}">
              <p>${temp_data.toFixed(2)}&degC</p>
              <p>${date_String(date)}</p>
              </div>
              `;
        });
      } else {
        console.error("Element with class '.5day' not found.");
      }
    } else {
      console.error("No data found for 12:00 PM.");
    }

    if (data2.list && data2.list.length > 0) {
      // Extract the first 5 elements
      const firstFiveElements = data2.list.slice(0, 4);
      // Process and log data for each element
      const processedData = firstFiveElements.map(item => {
        const dateTime = item.dt_txt.split(" ")[1]; 
        const temperature = item.main.temp - 273.15
        const weatherDescription = item.weather[0].description; 
        const icon = item.weather[0].icon; 
        hourContainer.innerHTML +=
          `<div class="col-3 text-center">
            <h3 class="text-center ">${time_String(dateTime)}</h3>
            <span class="feel_temp"><img src="http://openweathermap.org/img/wn/${icon}.png" alt=""></span>
            <p class="text-center">${temperature.toFixed(2)}&degC</p>
            </div> `
        return { dateTime, temperature, weatherDescription, icon };
      });
    }
    else {
      console.log("No data available in the list.");
    }

    function timestamp(time) {
      const date = new Date(time * 1000); 
      const localDate = date.toLocaleString();
      return localDate;
    }

    let a = data2.city.sunrise
    let b = data2.city.sunset
    let rise = await timestamp(a)
    let set = await timestamp(b)

    document.querySelector('.rise').innerHTML = rise.split(" ")[1]
    document.querySelector('.set').innerHTML = set.split(" ")[1]
  }
  getLocation();
}

// ipgeo key = ca5dd58b9959440cba238cc3a98b267a
