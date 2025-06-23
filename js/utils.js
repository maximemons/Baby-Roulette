import { t } from './i18n.js';

export function isHomePage() {
	var query = new URLSearchParams(document.location.search).get("q");
	var params = null;
	if(query != null) {
		params = queryToData(query);
	}
	
	if(query == null) {
		return true;
	}else{
		if(params == null) {
			return null;
		}
		return false;
	}
}

export function decodeDatas(base64) {
	try {
		var base64Decoded = atob(base64);
	  return decodeURIComponent(base64Decoded);
	} catch(e) {
		return "";
	}
}

export function encodeDatas(str) {
	try{
		var uriEncoded = encodeURIComponent(str);
	  return btoa(uriEncoded);
	} catch(e) {
		return "";
	}
}

export function queryToData(params) {
	var decodedParams = decodeDatas(params).split(";");

	if(decodedParams.length == 6 && (decodedParams[0] == "1" || decodedParams[0] == "2") && decodedParams[1].length >= 1 && decodedParams[2].length >= 1) {
		return {
			gender: decodedParams[0],
			symbolBoy: decodedParams[1],
			symbolGirl: decodedParams[2],
			labelWin: decodedParams[3],
			labelFail: decodedParams[4]
		};
	}

	return null; 
}