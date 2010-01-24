var cnx = {
	id: $("a[title='View your nation']").attr("href").match(/\d+$/)[0],
	te: window.location.hostname === "tournament.cybernations.net",
	
	scrape: function(){
		
	}
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if (window.location.search.toLowerCase() === "?nation_id=" + cnx.id) {
			chrome.extension.sendRequest(["get", "nation data stale", cnx.te], function(yes){
				yes && cnx.scrape();
			});
		}
		break;
	}
	case "/improvements_purchase.asp":
	case "/national_wonders_purchase.asp": {
		break;
	}
	case "/technology_purchase.asp":
	case "/infrastructurebuysell.asp":
	case "/militarybuysell.asp": {
		chrome.extension.sendRequest(["set", "nation data stale", te]);
	}
}