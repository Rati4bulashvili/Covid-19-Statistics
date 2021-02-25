//variables
const countriesContainer = document.querySelector('.wrapper__sidebar__all-countries__list');
const favouritesContainer = document.querySelector('.wrapper__sidebar__favourites__list');
const flag = document.querySelector('.wrapper__statistics__country-data__country-flag');
const region = document.querySelector('#region');
const population = document.querySelector('#population');
const capital = document.querySelector('#capital');
const language = document.querySelector('#language');
const currency = document.querySelector('#currency');
const cases = document.querySelector('#cases');
const deaths = document.querySelector('#deaths');
const critical = document.querySelector('#critical');
const recovered = document.querySelector('#recovered');
const header = document.querySelector('#header');
const sidebarBtn = document.querySelector('.navbar__list-item--sidebar-toggle');
const sidebarImg = document.querySelector('.navbar__list-item--sidebar-toggle__img');
const sidebar = document.querySelector('.wrapper__sidebar');
// const sidebarOpen = document.querySelector('.navbar__list-item--sidebar-open');
// const sidebarClose = document.querySelector('.navbar__list-item--sidebar-close');
// const header = document.querySelector('.wrapper__statistics__country-data__country-info__header');
let countries;

//onload, LocalStorage
let favourites = [];

window.onload = function(){
	_getLocalStorage();
}

function _getLocalStorage(){
	if(localStorage.getItem('favourites')){
		favourites = localStorage.getItem('favourites');
		favourites = favourites.split(',');
		fillContainer(favourites, favouritesContainer)
	}
}

//API handling
const getCountries = async function(){
	const countries = await fetch("https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "1c502885fbmshb740a5f1616b35dp18c8b9jsn365e1d121942",
			"x-rapidapi-host": "covid-19-coronavirus-statistics2.p.rapidapi.com"
		}
	})
	return countries.json();
}
getCountries().then(response => response.result)
.then(response => {
	listCountries(response);
	countries = response;
})

function listCountries(countries){
	sortedCountries = sortCountries(countries);
	fillContainer(sortedCountries, countriesContainer);
}

function sortCountries(countries){
	let sortedCountries = [];
	countries.forEach(elem => {
		sortedCountries.push(elem.country);
	})
	sortedCountries.sort();
	return sortedCountries;
}

async function moveToFavourite(event){
	const countryName = event.target.closest('.country-name').dataset.id;

	const id = event.target.closest('.country-list').dataset.id;
	const sortedCountries = sortCountries(countries);
	favourites.push(sortedCountries[id]);
	favourites = [...new Set(favourites)];
	fillContainer(favourites, favouritesContainer)
	localStorage.setItem('favourites', favourites);
}

// async function moveToFavourite(event){
// 	const countryName = event.target.closest('.country-name').dataset.id;

// 	const id = event.target.closest('.country-list').dataset.id;
// 	getCountries().then(response => response.result)
// 	.then(response => {
// 		const sortedCountries = sortCountries(response);
// 		favourites.push(sortedCountries[id]);
// 		favourites = [...new Set(favourites)];
// 		fillContainer(favourites, favouritesContainer)
// 		localStorage.setItem('favourites', favourites);
// 	})
// }

function removeFromFavourite(event){
	const id = event.target.closest('.country-list').dataset.id;
	favourites.splice(id, 1);
	fillContainer(favourites, favouritesContainer)
	localStorage.setItem('favourites', favourites);
}

//functions

function fillContainer(arr, container){
	container.innerHTML = '';
	
	arr.forEach( elem => {
		
		let li = document.createElement('li');
		li.dataset.id = container.childElementCount;
		li.classList.add('country-list');

		let btnContainer = document.createElement('span');
		btnContainer.dataset.id = elem;
		btnContainer.classList.add('country-name');
		
		var countryName = document.createElement('span');
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

async function viewCountryInfo(event){

	const country = event.target.closest('.country-name').dataset.id;
	const res = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
	const [data] = await res.json();

	flag.src = data.flag; 
	population.innerText = data.population;
	language.innerText = data.languages[0].name;
	capital.innerText = data.capital;
	region.innerText = data.subregion;
	header.innerText = data.name;
	currency.innerText = data.currencies[0].code;

	viewCovidInfo(event);
}

async function viewCovidInfo(event){

	const country = event.target.closest('.country-name').dataset.id;

	let [countryData] = countries.filter( cur => {
		if(cur.country === country){
			return cur
		}
	})

	cases.innerText = countryData.totalCases;
	recovered.innerText = countryData.totalRecovered;
	deaths.innerText = countryData.totalDeaths;
}

// async function viewCovidInfo(event){

// 	const country = event.target.closest('.country-name').dataset.id;
// 	getCountries().then(res => res.result)
// 	.then(response => {

// 		let [countryData] = response.filter( cur => {
// 			if(cur.country === country){
// 				return cur
// 			}
// 		})

// 		cases.innerText = countryData.totalCases;
// 		recovered.innerText = countryData.totalRecovered;
// 		deaths.innerText = countryData.totalDeaths;
// 	})
// }

sidebarBtn.addEventListener('click', toggleSidebar);

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

const overallData = async function(){
	const countries = await fetch("https://covid-19-data.p.rapidapi.com/totals", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "6192d944aemsh3747b76ff701443p101a0ajsn59f7f1003e3f",
			"x-rapidapi-host": "covid-19-data.p.rapidapi.com"
		}
	})

	return countries.json();
}

overallData().then(res => {
	cases.innerText = res[0].confirmed;
	recovered.innerText = res[0].recovered;
	deaths.innerText = res[0].deaths;
	deaths.innerText = res[0].deaths;
	critical.innerText = res[0].critical;
})




//1.++fill favs container
//1.1++use functional programming

//2.++remove from favs
//2.1++bug: data id should be assigned according to arr
//2.2++LC
//2.3  bug: favoriting one country more than one times

//3++<3 and lupa images