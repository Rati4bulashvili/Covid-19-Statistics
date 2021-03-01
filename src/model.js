export const getCountries = async function(){
	const countries = await fetch("https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "f3154dd547mshea5052542c54145p1a64fejsn128e64e07511",
			"x-rapidapi-host": "covid-19-coronavirus-statistics2.p.rapidapi.com"
		}
	})
	return countries.json();
}

export const overallData = async function(){
	const countries = await fetch("https://covid-19-data.p.rapidapi.com/totals", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "6192d944aemsh3747b76ff701443p101a0ajsn59f7f1003e3f",
			"x-rapidapi-host": "covid-19-data.p.rapidapi.com"
		}
	})
	
	return countries.json();
}

export function _getLocalStorage(){
	let favourites = [];
	if(localStorage.getItem('favourites')){
		favourites = localStorage.getItem('favourites');
		favourites = favourites.split(',');
		return favourites;
	}
}

