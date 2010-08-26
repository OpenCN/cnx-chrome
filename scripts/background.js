var cnx = {
	data: {
		layouts: utils.getJSON("data/layouts.json"),
		rows: utils.getJSON("data/rows.json"),
		se: JSON.parse(localStorage.se),
		te: JSON.parse(localStorage.te),
		get: function(path){
			var obj = cnx.data;
			path.forEach(function(k){ obj = obj[k]; });
			return obj;
		},
		set: function(path, val){
			var obj = cnx.data, first = path[0], last = path.pop();
			path.forEach(function(k){ obj = obj[k]; });
			obj[last] = val;
			
			if (first === "se" || first === "te") { localStorage[first] = JSON.stringify(cnx.data[first]); }
		},
		modifiers: {}
	},
	tabs: {}
};

chrome.extension.onRequest.addListener(function(req, sender, reply){
	if ("get" in req) {
		if (req.get === "layout") {
			reply(cnx.data.layouts[cnx.data[req.edn].layout]);
		} else {
			reply(cnx.data.get(req.get));
		}
	} else if ("set" in req) {
		cnx.data.set(req.set, req.val);
		reply(null);
	}
});

chrome.tabs.onUpdated.addListener(function(id, changeinfo, tab){
	var cn = tab.url.match(/^http:\/\/(www|tournament)\.cybernations\.net/i);
	if (cn) {
		var edn = cn[1] === "www" ? "se" : "te"
		cnx.tabs[id] = edn;
		chrome.pageAction.setIcon({ tabId: id, path: "icons/19-" + edn + ".png" });
		chrome.pageAction.setPopup({ tabId: id, popup: "popup.html#" + edn });
		chrome.pageAction.show(id);
	} else {
		delete cnx.tabs[id];
	}
});