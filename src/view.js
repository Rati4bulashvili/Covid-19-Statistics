const flag = document.querySelector('.wrapper__statistics__country-data__country-flag');
const region = document.querySelector('#region');
const population = document.querySelector('#population');
const capital = document.querySelector('#capital');
const language = document.querySelector('#language');
const currency = document.querySelector('#currency');
const newCases = document.querySelector('#new-cases');
const newDeaths = document.querySelector('#new-deaths');

const errorMsg = document.querySelector('.notify-error__error-message');
const errorMsgContainer = document.querySelector('.notify-error');
const sidebarImg = document.querySelector('.navbar__list-item--sidebar-toggle__img');
const sidebar = document.querySelector('.wrapper__sidebar');
const sidebarBtn = document.querySelector('.navbar__list-item--sidebar-toggle');
const header = document.querySelector('#header');
export const input = document.querySelector('.wrapper__sidebar__all-countries__search__input');
export const countriesContainer = document.querySelector('.wrapper__sidebar__all-countries__list');
export let searching = false;
export let filteredCountries = [];

import {countries} from './controller.js'
import {sortCountries} from './controller.js'
import {moveToFavourite} from './controller.js'
import {removeFromFavourite} from './controller.js'
import {getCountryInfo} from './controller.js'
import {critical} from './controller.js'

sidebarBtn.addEventListener('click', toggleSidebar);
input.addEventListener('keyup', search); 

export function fillContainer(arr, container){
	container.innerHTML = '';
	arr.forEach( elem => {

		let li = document.createElement('li');
		li.dataset.id = container.childElementCount;
		li.classList.add('country-list');

		let btnContainer = document.createElement('span');
		btnContainer.dataset.id = elem;
		btnContainer.classList.add('country-name');
		
		let countryName = document.createElement('span');
		countryName.classList.add('country-name');
		countryName.innerText = elem;
		let favouriteImg = document.createElement('img');
		
		let toggleFavourite = document.createElement('button');
		if(container.classList.contains('wrapper__sidebar__all-countries__list')){	
			favouriteImg.src = './assets/pictures/notFilled.png'
			toggleFavourite.addEventListener('click', moveToFavourite);
		}
		else{	
			favouriteImg.src = './assets/pictures/filled.png'
			toggleFavourite.addEventListener('click', removeFromFavourite);
		}

		toggleFavourite.appendChild(favouriteImg)

		let expand = document.createElement('button');
		let expandImg = document.createElement('img');
		expandImg.src = './assets/pictures/search.png';
		expand.appendChild(expandImg);
		expand.addEventListener('click', viewCountryInfo);
		expand.classList.add('search');
		
		btnContainer.appendChild(toggleFavourite);
		btnContainer.appendChild(expand);
		li.appendChild(countryName);
		li.appendChild(btnContainer)

		container.insertAdjacentElement('beforeend', li);
	})
}

function search(){
	filteredCountries = [];
	searching = true;
    
	if(input.value === ''){
        fillContainer(sortCountries(countries), countriesContainer)
		searching = false;
		return;
	}
    
    countries.filter( cur => {	
		if(cur.country.toUpperCase().slice(0,input.value.length) === input.value.toUpperCase()){
			filteredCountries.push(cur.country)
		}	
	})

	fillContainer(filteredCountries, countriesContainer)
}

async function viewCountryInfo(event){
    let data = await getCountryInfo(event);

	flag.src = data.flag; 
	population.innerText = `${(data.population/1000000).toFixed(1)}M`;
	language.innerText = data.languages[0].name;
	capital.innerText = data.capital;
	region.innerText = data.subregion;
    if(data.name.length > 20){
        header.innerText = data.name.slice(0, 20);
    }
    else{
        header.innerText = data.name;
    }
	currency.innerText = data.currencies[0].code;

	viewCovidInfo(event);
}

async function viewCovidInfo(event){
	const country = event.target.closest('.country-name').dataset.id;

    try{
        let [countryData] = countries.filter( cur => {
            if(cur.country === country){
                return cur;
            }
        })
        cases.innerText = countryData.totalCases;
        recovered.innerText = countryData.totalRecovered;
        deaths.innerText = countryData.totalDeaths;
        newCases.innerText = `New Cases: ${countryData.newCases}`;
        newDeaths.innerText = `New Deaths: ${countryData.newDeaths}`;
        document.querySelector(".wrapper__statistics__country-data__details__covid-info__critical").style.display = 'none';
    }
    catch{
        displayErrorMsg('Please Wait Until All Countries Load ⏳')
    }
}

export function displayErrorMsg(error){
	errorMsgContainer.style.opacity = '1';
	errorMsg.innerText = error;
	
	setTimeout( () => {	
		errorMsgContainer.style.opacity = '0'
	}, 6000);
}

function toggleSidebar(){
	if(sidebar.classList.contains('sidebar-appear')){
		sidebar.classList.remove('sidebar-appear');
		sidebar.classList.add('sidebar-disappear');
		sidebarImg.src='./assets/pictures/arrow-right.png'
	}
	else{
		sidebar.classList.remove('sidebar-disappear')
		sidebar.classList.add('sidebar-appear')
		sidebarImg.src='./assets/pictures/arrow-left.png';
	}
}
