var cnx = {
	id: $("a[title='View your nation']").attr("href").match(/\d+$/)[0],
	isTE: window.location.hostname === "tournament.cybernations.net",
	isExtended: /extended=1/i.test(window.location.search)
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if (!(new RegExp("nation_id=" + cnx.id, "i")).test(window.location.search)) { break; }
		
		chrome.extension.sendRequest({ get: "rows" }, function(rows){
			var table = {}, $tr = $(".shadetabs + table > tbody > tr"), trp = 0;
			
			$.each(rows, function(id, r){
				var $td = $tr.eq(trp).children(), k = $td.eq(0).text(), v = $td.eq(1).text().trim() || ($td.eq(1).html() || "").trim() || $td.eq(0).text();
				
				if (r.is === k.replace(/\s/g, "") || k.indexOf(r.has) !== -1) {
					table[id] = v;
					trp++;
				} else {
					return true;
				}
			});
			
			var data = {
				date: Date.now(),
				isStale: false,
				id: cnx.id,
				ruler: table.ruler,
				name: table.name,
				modifiers: null,
				gov: null,
				land: null
			};
			"citizens citizen_tax tax environment infra tech strength global_radiation num_soldiers happiness nukes".split(" ").forEach(function(v){
				data[v] = parseFloat(table[v].match(/-?[\d,]+(?:\.\d+)?/)[0].replace(",", ""));
			});
			chrome.extension.sendRequest({ set: "nation_data", val: data, v: cnx.isTE ? "te" : "se" });
			
			cnx.table = table;
		});
		
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