const path = 'api.openweathermap.org/data/2.5/forecast?';
const apiKey = `appid=25a93782855e0a005e7d83954dbaa2c8`;
const searchL = document.querySelector('#search-bar');
const formL = document.querySelector('#search-form');
const cityL = document.querySelector('#city');
const historyL = document.querySelector('#btns');

for (let key in localStorage){
   
  if(key == capitalize(key)){
    let btnL = addElement(key);
    historyL.insertAdjacentHTML('afterbegin',btnL);
  }
}

formL.addEventListener('submit',formHandler);
historyL.addEventListener('click',historyHandler);

 function apiCall(url) {
     fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${url}&${apiKey}`).then(function(resp){

    return resp.json()
}).then(function(json){
        console.log(json,' --first api call');
        let lat = json[0].lat;
        let long = json[0].lon;
       fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&${apiKey}&units=imperial`).then(function(newResp){
        return newResp.json()
    }).then(function(newJson){
        let temp = newJson.list.slice(0,6)
        console.log(temp)
        console.log(newJson);

     let newCity = {
        name: newJson.city.name,
        lat: newJson.city.coord.lat,
        long: newJson.city.coord.lon,
        wind: temp.map((x)=> x=[`wind-${temp.indexOf(x)}`,x.wind.speed]),
        temp: temp.map((x)=> x=[`temp-${temp.indexOf(x)}`,x.main.temp]),
        humid: temp.map((x)=> x=[`humid-${temp.indexOf(x)}`,x.main.humidity]),
        icon: temp.map((x)=> x=[`icon-${temp.indexOf(x)}`,x.weather[0].icon]),
        date: temp.map((x)=> x=[`date-${temp.indexOf(x)}`,x.dt_txt.slice(0,10)]), 
    updatePage(){
        setElements(this.wind);  setElements(this.temp);  
        setElements(this.humid);  setElements(this.date);  setIcons(this.icon);
        cityL.innerText = this.name;
        console.log(this.wind[0])
    } 
    }

    newCity.updatePage();
     localStorage.setItem(`${newCity.name}`,`${newCity.lat} ${newCity.long}`);


     
     
     console.log(newCity);
     
    })
})
};




function setElements(args){
      for(let arg of args) {
        document.querySelector(`#${arg[0]}`).innerText = `${arg[1]}`;
        console.log(document.querySelector(`#${arg[0]}`))
        console.log(arg);
    }
}

function setIcons(args) {
    for(let arg of args) {
        document.querySelector(`#${arg[0]}`).setAttribute('src',`http://openweathermap.org/img/wn/${arg[1]}@2x.png`);  
    }
}

function historyHandler(e) {
   let newSearch = capitalize(e.target.innerText);
   localStorage.removeItem(newSearch)
   return apiCall(newSearch);
}


function formHandler(e) {
    e.preventDefault()
    let search = capitalize(searchL.value);
    console.log(search)
    return apiCall(search);

    //newCity.weatherApi();
}

function addElement(name){
    let newBtn = document.createElement('button');
    return newBtn.innerHTML = `<button class="button is-fullwidth  mr-6 pr-6 ml-2 has-background-grey has-text-weight-semibold"> ${name} </button>`;

};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
