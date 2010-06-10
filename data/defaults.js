(function(localStorage){

var ver = localStorage.ver / 1;

if (!ver) {
	localStorage.se = localStorage.te = '{"layout":"", "nation_data":{"date":0, "isStale":true}}';
}

localStorage.ver = 1;

})(this.localStorage);