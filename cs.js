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
			var $table = $(".shadetabs + table > tbody"), $tr = $table.children("tr"), trp = 0;
			
			$.each(rows, function(id, row){
				var $td = $tr.eq(trp).children(), k = 0 in $td ? $td[0].innerText : "", txt = 1 in $td ? $td[1].innerText.trim() : k, html = 1 in $td ? $td[1].innerHTML.trim() : k;
				
				if (row.is === k.replace(/\s/g, "") || k.indexOf(row.has) !== -1) {
					row.txt = txt;
					row.html = html;
					row.td = $tr[trp];
					rows[id] = row;
					trp++;
				} else {
					return;
				}
			});
			
			cnx.rows = rows;
			
			/*** save data ***/
			var data = {
				date: Date.now(),
				isStale: false,
				id: cnx.id,
				ruler: rows.ruler.txt,
				name: rows.name.txt,
				gov: rows.gov.txt.match(/^(.+?)\s/)[1],
				wonders: rows.wonders.txt !== "No national wonders." ? rows.wonders.txt.split(", ") : [],
				
				improvements: rows.improvements.txt.split(", ").reduce(function(pre, cur){
					var s = cur.split(": ");
					pre[s[0]] = s[1]/1;
					return pre;
				}, {}),
				
				land: (function(land){
					return { total: land[0]/1, purchases: land[1]/1, modifiers: land[2]/1, growth: land[3]/1 };
				})(rows.land.txt.replace(/,/g, "").match(/-?[\d][\d\.]+/g)),
				
				resources: $(rows.connected_resources.html + rows.bonus_resources.html).get().map(function(elem){
					return elem.title.match(/^(.+?)\s-/)[1];
				})
			};
			
			["citizens", "citizen_tax", "tax", "environment", "infra", "tech", "strength", "global_radiation", "num_soldiers", "happiness", "nukes"].forEach(function(val){
				data[val] = rows[val].txt.match(this)[0].replace(/,/g, "")/1;
			}, /-?[\d,]+(?:\.\d+)?/);
			
			data.tax /= 100;
			
			chrome.extension.sendRequest({ set: [cnx.ver, "nation_data"], val: data });
			
			/*** display data ***/
			$tr.remove();
			chrome.extension.sendRequest({ get: ["layouts", "war"] }, function(list){
				list.forEach(function(id){
					if (id[0] !== "!") {
						$table.append(rows[id].td);
					} else {
						$table.append('<tr><td colspan="2" bgcolor="#000080" style="color:white"><b>_:. foo</b></td></tr>');
					}
				});
			});
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