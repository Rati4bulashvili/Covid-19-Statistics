const favouritesContainer = document.querySelector('.wrapper__sidebar__favourites__list');
const cases = document.querySelector('#cases');
const deaths = document.querySelector('#deaths');
const recovered = document.querySelector('#recovered');
let favourites = [];
export const critical = document.querySelector('#critical');
export let countries;
let sortedCountries;

import * as model from './model.js'
import * as view from './view.js'

window.onload = function(){
	if(model._getLocalStorage()){
		favourites = model._getLocalStorage();
	}
	if(favourites.length){
		view.fillContainer(favourites, favouritesContainer)
	}
}

async function renderCountries(){
	
	await model.getCountries().then(response => response.result)
	.then(response => {
		countries = response;
		sortedCountries = sortCountries(countries);
		
		view.fillContainer(sortedCountries, view.countriesContainer);
		view.input.disabled = false;
	}).catch(err => {
		view.displayErrorMsg(err + '💥')
	})
}
renderCountries();

async function renderOverallData(){

	await model.overallData().then(res => {
		cases.innerText = res[0].confirmed;
		recovered.innerText = res[0].recovered;
		deaths.innerText = res[0].deaths;
		deaths.innerText = res[0].deaths;
		critical.innerText = res[0].critical;
	}).catch(err => {
		view.displayErrorMsg('Too Many API Calls (give me some time to fetch) 💥')
	})
}
renderOverallData();

export function sortCountries(countries){
	let sortedCountries = [];
	countries.forEach(elem => {
		sortedCountries.push(elem.country);
	})
	sortedCountries.sort();
	return sortedCountries;
}

export function moveToFavourite(event){
	const id = event.target.closest('.country-list-item').dataset.id;
	let favouritesSet, choosedCountry;

	if(view.searching){
		choosedCountry = view.filteredCountries[id];
		favourites.push(choosedCountry);
	}
	else{
		choosedCountry = sortedCountries[id];
		favourites.push(choosedCountry);
	}
	
	favouritesSet = [...new Set(favourites)];
	if(favourites.length > favouritesSet.length){
		view.displayErrorMsg(`${choosedCountry} is already favourite`);
		favourites = favouritesSet;
	}
	else{
		view.fillContainer(favouritesSet, favouritesContainer)
		localStorage.setItem('favourites', favouritesSet);
	}
}

export function removeFromFavourite(event){
	const id = event.target.closest('.country-list-item').dataset.id;
	favourites.splice(id, 1);
	view.fillContainer(favourites, favouritesContainer)
	localStorage.setItem('favourites', favourites);
}

export async function getCountryInfo(event){
	const country = event.target.closest('.country-name').dataset.id;
	const res = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
	const [data] = await res.json();
	return data;
}


