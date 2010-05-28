(function(localStorage){

var v = localStorage.v / 1;

if (!v) {
	localStorage.se = localStorage.te = '{"nation_data":{"date":0, "isStale":true}}';
}

localStorage.v = 1;

})(this.localStorage);