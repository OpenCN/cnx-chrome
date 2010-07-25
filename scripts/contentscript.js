(function(window, $, chrome, undefined){

var cnx = {
	edn: window.location.hostname === "www.cybernations.net" ? "se" : "te",
	id: (($("a[data-popupmenu='popmenu3']").attr("href") || "").match(/\d+$/) || "")[0]
};

switch (window.location.pathname.toLowerCase()) {
	case "/nation_drill_display.asp": {
		if (!RegExp("nation_id=" + cnx.id, "i").test(window.location.search)) {
			$(".shadetabs + table > tbody").css("display", "table-row-group");
			break;
		}
		
		chrome.extension.sendRequest({ get: ["rows"] }, function(rows){
			/*** scrape data ***/
			var $table = $(".shadetabs + table > tbody"), $tr = $table.children(), trp = 0;
			
			$.each(rows, function(id, row){
				var $td = $tr.eq(trp).children(), k = 0 in $td ? $td[0].innerText : "", txt = 1 in $td ? $td[1].innerText.trim() : k, html = 1 in $td ? $td[1].innerHTML.trim() : k;
				
				if (row.is === k.replace(/\s/g, "") || k.indexOf(row.has) !== -1) {
					row.txt = txt;
					row.html = html;
					row.tr = $tr[trp];
					rows[id] = row;
					trp++;
				}
			});
			
			cnx.rows = rows;
			
			/*** save data ***/
			var data = {
				date: Date.now(),
				isStale: false,
				edn: cnx.edn,
				id: cnx.id,
				ruler: rows.ruler.txt,
				name: rows.name.txt,
				gov: rows.gov.txt.match(/^(.+)\s-/)[1],
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
			
			chrome.extension.sendRequest({ set: [cnx.edn, "nation_data"], val: data });
			
			/*** display table ***/
			chrome.extension.sendRequest({ get: "layout", edn: cnx.edn }, updateLayout);
		});
		
		chrome.extension.onRequest.addListener(function(req, sender, reply){
			("layout" in req) && updateLayout(req.layout);
			reply(null);
		});
		
		function updateLayout(layout) {
			var $newtable = $("<tbody/>"), rows = cnx.rows;
			
			if (/extended=1/i.test(window.location.search)) {
				layout = null;
			}
			
			if (!layout) {
				$.each(rows, function(k, row){
					$(row.tr).appendTo($newtable);
				});
			} else {
				layout.forEach(function(id){
					if (id in rows) {
						$(rows[id].tr).appendTo($newtable);
					} else {
						$newtable.append('<tr><td colspan="2" style="color:white;background-color:navy"><b><span style="opacity:0">_</span>:. ' + id + '</b></td></tr>');
					}
				});
			}
			cnx.$nationtable = $newtable.replaceAll(".shadetabs + table > tbody").css("display", "table-row-group");
		}
		
		break;
	}
	
	case "/improvements_purchase.asp":
	case "/national_wonders_purchase.asp": {
		$("#table17"); // disband
		$("#table3 > tbody > tr > td:eq(0) > input").mouseover(function(){
			var modifier = this.value;
		});
	}
	
	case "/technology_purchase.asp":
	case "/infrastructurebuysell.asp":
	case "/militarybuysell.asp": {
		chrome.extension.sendRequest({ set: [cnx.edn, "nation_data", "isStale"], val: true });
		break;
	}
}

})(this, this.$, this.chrome);