(function(window, $, chrome, undefined){

var cnx = {
	id: (($("a[title='View your nation']").attr("href") || "").match(/\d+$/) || "")[0],
	isTE: window.location.hostname === "tournament.cybernations.net",
	isExtended: /extended=1/i.test(window.location.search)
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if (!(RegExp("nation_id=" + cnx.id, "i")).test(window.location.search)) { break; }
		
		chrome.extension.sendRequest({ get: "rows" }, function(rows){
			/*** scrape data ***/
			var table = {}, $tr = $(".shadetabs + table > tbody > tr"), trp = 0;
			
			$.each(rows, function(id, r){
				var $td = $tr.eq(trp).children(), k = $td.eq(0).text(), v = $td.eq(1).text().trim() || ($td.eq(1).html() || "").trim() || $td.eq(0).text();
				
				if (r.is === k.replace(/\s/g, "") || k.indexOf(r.has) !== -1) {
					table[id] = v;
					trp++;
				} else {
					return;
				}
			});
			
			cnx.table = table;
			
			/*** save data ***/
			var data = {
				date: Date.now(),
				isStale: false,
				id: cnx.id,
				ruler: table.ruler,
				name: table.name,
				gov: table.gov.match(/^(.+?)\s/)[1],
				wonders: table.wonders !== "No national wonders." ? table.wonders.split(", ") : [],
				
				land: (function(m){
					return { total: m[0]/1, purchases: m[1]/1, modifiers: m[2]/1, growth: m[3]/1 };
				})(table.land.replace(/,/g, "").match(/-?[\d][\d\.]+/g)),
				
				improvements: (function(i, a){
					a.forEach(function(v){ var s = v.split(": "); i[s[0]] = s[1]/1; });
					return i;
				})({}, table.improvements.split(", ")),
				
				resources: (function(resources, regexp){
					$(table.connected_resources + table.bonus_resources).each(function(){
						resources.push(this.title.match(regexp)[0]);
					});
					return resources;
				})([], /^[a-z]+/i)
			};
			
			["citizens", "citizen_tax", "tax", "environment", "infra", "tech", "strength", "global_radiation", "num_soldiers", "happiness", "nukes"].forEach(function(v){
				data[v] = table[v].match(this)[0].replace(/,/g, "")/1;
			}, /-?[\d,]+(?:\.\d+)?/);
			
			data.tax /= 100;
			
			chrome.extension.sendRequest({ set: "nation_data", val: data, v: cnx.isTE ? "te" : "se" });
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

})(this, this.$, this.chrome);