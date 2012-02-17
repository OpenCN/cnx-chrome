var utils = {
	getJSON: function(path){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", chrome.extension.getURL(path), false);
		xhr.send();
		return JSON.parse(xhr.responseText);
	},
	commafy: function(n){
		return (n + "").replace(/(-?)(\d+)(.*)/, function(m, $1, $2, $3){
			return $1 + $2.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + $3;
		});
	}
};