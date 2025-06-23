import { currentLang, t, initLangCombobox } from './i18n.js';
import { isHomePage, queryToData } from './utils.js';

let params = null;

export function init() {
	let isHome = isHomePage();

	if(isHome == null) {
		//Not home page but link is not corrrect
		//We have to redirect home
		console.log("null");
		document.location.search = "";
	} else if(isHome) {
		//We're on home page
		//We have to set labels to default
		//We have to init langs options
		console.log("true");
		translateInitWebsite(currentLang);
		initLangCombobox();
	} else {
		//We're not on home page
		//We need to set the values on the roulette
		console.log("false");
		params = queryToData(new URLSearchParams(document.location.search).get("q"));
	}
}