var cnx = {
	id: $("a[title='View your nation']").attr("href").match(/\d+$/)[0],
	isTE: window.location.hostname === "tournament.cybernations.net",
	isExtended: /extended=1/i.test(window.location.search),
	
	traverse: function(cb){
		chrome.extension.sendRequest({ get: "rows" }, function(rows){
			var table = {}, $tr = $(".shadetabs + table > tbody > tr"), trp = 0;
			
			$.each(rows, function(id, r){
				var $td = $tr.eq(trp).children(), k = $td.eq(0).text(), v = $td.eq(1).text().trim();
				
				if (r.is === k.replace(/\s/g, "") || k.indexOf(r.has) !== -1) {
					table[id] = v;
					trp++;
				} else {
					return true;
				}
			});
			
			cnx.table = table;
		});
	},
	scrape: function(){
		var t = cnx.table, data = {
			date: Date.now(),
			isStale: false,
			id: cnx.id,
			ruler: t.ruler,
			name: t.name
		};
		chrome.extension.sendRequest({ set: "nation_data", val: data, v: cnx.isTE ? "te" : "se" });
	}
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if ((new RegExp("nation_id=" + cnx.id, "i")).test(window.location.search)) {
			cnx.traverse(function(){
				chrome.extension.sendRequest({ get: "nation_data", v: cnx.isTE ? "te" : "se" }, function(data){
					if (data.isStale || ((Date.now() - data.date) / (1000 * 60 * 60)) > 24) {
						cnx.scrape();
					}
				});
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