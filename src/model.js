export const getCountries = async function(){
	const countries = await fetch("https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "e9dd0e2b76mshaa4911a7ce7ae52p161d51jsncb3f45a82b6a",
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

