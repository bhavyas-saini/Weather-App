const userTab = document.querySelector("[data-user-Weather]")
const searchTab = document.querySelector("[data-search-Weather]")
const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const LoadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")




let currentTab = userTab;
const API_KEY = "982efe42eef3701d88317f5ffc3457cf";
currentTab.classList.add("current-tab"); 
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // Is search form container is visisble, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

         }else{
            //That's mean we are on search tab and have to switch on weather tab.So we're gonna invisile searchform.
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather vale tab me aagya hu, to weather bhi display krn hoga.So let's check local storage first
            //for coordinates, if we have saved them there.
            getfromSessionStorage();

         }
    }
     
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
})

//Check if  coordinates are already present in session storage
function getfromSessionStorage(){
   const localCoordinates = sessionStorage.getItem("user-coordinates");
   if(!localCoordinates){
    // Agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
   }
   else{

    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);

   }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    LoadingScreen.classList.add("active");


    //API Call

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        LoadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
       
    } 
    catch(err){
        LoadingScreen.classList.remove("active");
        // Don't know what to do now
    }
}


function renderWeatherInfo(weatherInfo){
    //firstly, we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-cityIcon]");
    const desc = document.querySelector("[weather-desc]");
    const weatherIcon = document.querySelector("[weather-icon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudspeed]");

    // console.log(weatherInfo);

    // Fetch the values from weatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name; 
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText =`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support Available")
    }
}

function showPosition(position){
      const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }
      sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinate));
      fetchUserWeatherInfo(userCoordinate);
}

const grantAccessButton = document.querySelector("[data-Grantaccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    return;
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    LoadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        LoadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        //uwu
    }

}
