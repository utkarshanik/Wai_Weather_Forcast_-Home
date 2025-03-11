// Api_Key=e7adf9952dc040049ea70053251003
// Open weatgher api => 7558760060b43c7b8805cc83f755f6f5

// url => https://api.weatherapi.com/v1/current.json?key= e7adf9952dc040049ea70053251003&q=London&aqi=yes\


// let ask= prompt('Enter A City')  

let city = document.querySelector('.city_name');

city.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {  // Wait for the user to press Enter
    let cityy = city.value.trim();  // Get user input

    if (!cityy) { // Prevent empty input
      console.error("City name is empty!");
      return;
    }

    console.log("City entered:", cityy);

    // Fetch weather data only after the user enters the city name
    let data = await fetchData(cityy);
    // console.log(data);
    await main(data);
  }
});

async function fetchData(cityy) {
  try {
    let res = await fetch(`https://api.weatherapi.com/v1/current.json?key=e7adf9952dc040049ea70053251003&q=${cityy}&aqi=yes`);
    
    if (!res.ok) {  
      throw new Error(`API error: ${res.status} - ${res.statusText}`);
    }

    let data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

    
    
    async function main(a) {
      // let a = await fetchData();
      console.log(a); // Now 'a' contains the actual fetched data
      
  
      
      document.querySelector('.city').innerHTML=`${a.location.name}`
      let local= a.location.localtime
      let[date,time]=local.split(" ")
      document.querySelector('.time').innerHTML=`${time}`
      document.querySelector('.day').innerHTML=`${date}`
      document.querySelector('.temp').innerHTML=`${a.current.temp_c}`
      document.querySelector('.feel_temp').innerHTML=`${a.current.feelslike_c}`
      document.querySelector('.weatherImg').innerHTML=`<img src="${a.current.condition.icon}" alt="">
      <span class="text-center">${a.current.condition.text}</span>`
      document.querySelector('.humidity').innerHTML=`${a.current.humidity}`
      document.querySelector('.wind').innerHTML=`${a.current.wind_kph}`
      document.querySelector('.pressure').innerHTML=`${a.current.pressure_in}`
      document.querySelector('.uv').innerHTML=`${a.current.uv}`
    }
    
  
  
  