(function(localStorage){

var v = localStorage.v / 1;
if (!v) {
	localStorage.v = 1;
	localStorage.se = localStorage.te = '{"nation_data":{"date":0, "isStale":true}}';
	
}

if (v <= 1) {}

})(localStorage);