var cnx = {
	id: $("a[title='View your nation']").attr("href").match(/\d+$/)[0],
	isTE: window.location.hostname === "tournament.cybernations.net",
	isExtended: /extended=1/i.test(window.location.search),
	
	scrape: function(){
		$(".shadetabs + table > tbody > tr").each(function(){
			var key = $(this).children(":eq(0)").text().trim(), val = $(this).children(":eq(1)").text().trim();
		});
		
		var data = {
			date: Date.now(),
			isStale: false,
			
		};
		
		chrome.extension.sendRequest({ get: "rows", v: "rows" }, function(rows){
			for (var k in rows) {
				console.log(k);
			}
		});
	}
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if ((new RegExp("nation_id=" + cnx.id, "i")).test(window.location.search)) {
			chrome.extension.sendRequest({ get: "nation_data", v: cnx.isTE ? "te" : "se" }, function(data){
				if (data.isStale || ((Date.now() - data.date) / (1000 * 60 * 60)) > 24) {
					cnx.scrape();
				}
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
		chrome.extension.sendRequest({ set: "nation_data.isStale", val: true, v: cnx.isTE ? "te" : "se" });
		break;
	}
}