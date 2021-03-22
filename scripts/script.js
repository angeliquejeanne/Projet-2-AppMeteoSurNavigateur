import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

// console.log("DEPUIS MAIN JS:" + tabJoursEnOrdre);

const CLEFAPI = '569dd9d5dc9886ab7e1e29d2ecdc9ef6';
let resultatsAPI;

const weather = document.querySelector('.weather');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const hour = document.querySelectorAll('.hours-name-prev');
const valueForHour = document.querySelectorAll('.hours-prev-value');
const dayDiv = document.querySelectorAll('.day-name-prev');
const weatherDayDiv = document.querySelectorAll('.day-weather-prev');
const iconImg = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icon-chargement');

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        // console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long,lat);

    }, () => {
        alert(`Vous avez refusé la géolocalisation, l'application ne peur pas fonctionner, veuillez l'activer.!`)
    })
}

function AppelAPI(long, lat) {

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        // console.log(data);

        resultatsAPI = data;

        weather.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`
        localisation.innerText = resultatsAPI.timezone;


        // les heures, par tranche de trois, avec leur temperature.

        let hourActuelle = new Date().getHours();

        for(let i = 0; i < hour.length; i++) {

            let hourIncr = hourActuelle + i * 3;

            if(hourIncr > 24) {
                hour[i].innerText = `${hourIncr - 24} h`;
            } else if(hourIncr === 24) {
                hour[i].innerText = "00 h"
            } else {
                hour[i].innerText = `${hourIncr} h`;
            }

        }

        // temp pour 3h
        for(let j = 0; j < valueForHour.length; j++) {
            valueForHour[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`
        }


        // trois premieres lettres des jours 

        for(let k = 0; k < tabJoursEnOrdre.length; k++) {
            dayDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }


        // Temp par jour
        for(let m = 0; m < 7; m++){
            weatherDayDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
        }

        // Icone dynamique 
         if(hourActuelle >= 6 && hourActuelle < 21) {
             iconImg.src = `src/jour/${resultatsAPI.current.weather[0].icon}.svg`
         } else  {
            iconImg.src = `src/nuit/${resultatsAPI.current.weather[0].icon}.svg`
         }


         chargementContainer.classList.add('disparition');

    })

}