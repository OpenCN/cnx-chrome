var utils = {
	getJSON: function(path){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", chrome.extension.getURL(path), false);
		xhr.send();
		return JSON.parse(xhr.responseText);
	}
};