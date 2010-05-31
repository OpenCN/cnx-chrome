var utils = {
	getFile: function(path){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", chrome.extension.getURL(path), false);
		xhr.send();
		return xhr.responseText;
	}
};