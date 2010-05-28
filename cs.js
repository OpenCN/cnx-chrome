(function(window, $, chrome, undefined){

var cnx = {
	id: (($("a[title='View your nation']").attr("href") || "").match(/\d+$/) || "")[0],
	ver: window.location.hostname === "www.cybernations.net" ? "se" : "te",
	isExtended: /extended=1/i.test(window.location.search)
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if (!(RegExp("nation_id=" + cnx.id, "i")).test(window.location.search)) { break; }
		
		chrome.extension.sendRequest({ get: ["rows"] }, function(rows){
			/*** scrape data ***/
			var table = {}, $tr = $(".shadetabs + table > tbody > tr"), trp = 0;
			
			$.each(rows, function(id, r){
				var $td = $tr.eq(trp).children(), k = 0 in $td ? $td[0].innerText : "", v = 1 in $td ? ($td[1].innerText.trim() || $td[1].innerHTML.trim()) : k;
				
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
				
				improvements: table.improvements.split(", ").reduce(function(pre, cur){
					var s = cur.split(": ");
					pre[s[0]] = s[1]/1;
					return pre;
				}, {}),
				
				land: (function(land){
					return { total: land[0]/1, purchases: land[1]/1, modifiers: land[2]/1, growth: land[3]/1 };
				})(table.land.replace(/,/g, "").match(/-?[\d][\d\.]+/g)),
				
				resources: $(table.connected_resources + table.bonus_resources).get().map(function(elem){
					return elem.title.match(/^(.+?)\s-/)[1];
				})
			};
			
			["citizens", "citizen_tax", "tax", "environment", "infra", "tech", "strength", "global_radiation", "num_soldiers", "happiness", "nukes"].forEach(function(val){
				data[val] = table[val].match(this)[0].replace(/,/g, "")/1;
			}, /-?[\d,]+(?:\.\d+)?/);
			
			data.tax /= 100;
			
			chrome.extension.sendRequest({ set: [cnx.ver, "nation_data"], val: data });
		});
		
		break;
	}
	
	case "/improvements_purchase.asp":
	case "/national_wonders_purchase.asp": {
		
	}
	
	case "/technology_purchase.asp":
	case "/infrastructurebuysell.asp":
	case "/militarybuysell.asp": {
		chrome.extension.sendRequest({ set: [cnx.ver, "nation_data", "isStale"], val: true });
		break;
	}
}

})(this, this.$, this.chrome);