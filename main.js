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
const input = document.querySelector('.wrapper__sidebar__all-countries__search__input');
const searchBtn = document.querySelector('.wrapper__sidebar__all-countries__search__submit');
const errorMsg = document.querySelector('.notify-error__error-message');
const errorMsgContainer = document.querySelector('.notify-error');
let countries;
let favourites = [];

sidebarBtn.addEventListener('click', toggleSidebar);
searchBtn.addEventListener('click', search);
input.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
	  event.preventDefault();
	  searchBtn.click();
	}
})

//onload, LocalStorage
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

//////////////////////////////////////API handling
const getCountries = async function(){
	const countries = await fetch("https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "e9dd0e2b76mshaa4911a7ce7ae52p161d51jsncb3f45a82b6a",
			"x-rapidapi-host": "covid-19-coronavirus-statistics2.p.rapidapi.com"
		}
	})
	return countries.json();
}
getCountries().then(response => response.result)
.then(response => {
	listCountries(response);
	countries = response;
}).catch(err => {
	displayErrorMsg(err)
})

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
}).catch(err => {
	displayErrorMsg(err)
})

/////////////////////////////////////////////////////////automatically fired functions
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


function fillContainer(arr, container){
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

/////////////////////////////////////////////////////user-fired functions

async function moveToFavourite(event){
	const countryName = event.target.closest('.country-name').dataset.id;

	const id = event.target.closest('.country-list').dataset.id;
	const sortedCountries = sortCountries(countries);
	favourites.push(sortedCountries[id]);
	favourites = [...new Set(favourites)];
	fillContainer(favourites, favouritesContainer)
	localStorage.setItem('favourites', favourites);
}

function removeFromFavourite(event){
	const id = event.target.closest('.country-list').dataset.id;
	favourites.splice(id, 1);
	fillContainer(favourites, favouritesContainer)
	localStorage.setItem('favourites', favourites);
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

function search(){
	[add] = countries.filter( cur => cur.country == input.value)
	try{
		favourites.push(add.country);
		favourites = [...new Set(favourites)];
		fillContainer(favourites, favouritesContainer)
		localStorage.setItem('favourites', favourites);
	}
	catch{
		error = `can not find country '${input.value}'`
		displayErrorMsg(error)
	}

}

function displayErrorMsg(error){
	errorMsgContainer.style.opacity = '1';
	errorMsg.innerText = error;
	
	setTimeout( () => {	
		errorMsgContainer.style.opacity = '0'
	}, 6000);
}






