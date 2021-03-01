const favouritesContainer = document.querySelector('.wrapper__sidebar__favourites__list');
const cases = document.querySelector('#cases');
const deaths = document.querySelector('#deaths');
const recovered = document.querySelector('#recovered');
let favourites = [];
export const critical = document.querySelector('#critical');
export let countries;

import * as model from './model.js'
import * as view from './view.js'

window.onload = function(){
	if(favourites.length){
		favourites = model._getLocalStorage();
		view.fillContainer(favourites, favouritesContainer)
	}
}

async function renderCountries(){
	
	await model.getCountries().then(response => response.result)
	.then(response => {
		countries = response;
		let sortedCountries = sortCountries(countries);
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
		view.displayErrorMsg(err  + '💥')
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
	const id = event.target.closest('.country-list').dataset.id;
	if(view.searching){
		favourites.push(view.filteredCountries[id]);
		favourites = [...new Set(favourites)];
		view.fillContainer(favourites, favouritesContainer)
	}
	else{
		const sortedCountries = sortCountries(countries);
		favourites.push(sortedCountries[id]);
		favourites = [...new Set(favourites)];
		view.fillContainer(favourites, favouritesContainer)
	}
	localStorage.setItem('favourites', favourites);
}

export function removeFromFavourite(event){
	const id = event.target.closest('.country-list').dataset.id;
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