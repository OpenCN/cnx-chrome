(function(window, $, chrome, undefined){

var background = chrome.extension.getBackgroundPage(), cnx = background.cnx, $D = background.$D, page = {
	edn: window.location.hash.slice(1),
	$layout: $("#options-layout")
};
page.data = new $D(page.edn);


/*** tabs ***/
$.each({ "#tabs": "#panels", "#info-tabs": "#info-panels" }, function(tabs, panels){
	$(tabs).children().click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
		$(panels).children().removeClass("selected").eq($(this).index()).addClass("selected");
	});
});


/*** info ***/
$("#info-effects-cash span").eq(1).text(page.data.citizen_tax);
$("#info-effects-happiness span").eq(1).text(page.data.happiness);
$("#info-effects-environment span").eq(1).text(page.data.environment).end().eq(2).text(1 + page.data.global_radiation);

$("#info-effects input").bind("input", function(){
	$(this).siblings().text("$" + utils.commafy((new $D(page.data)).modify(this.getAttribute("data-modify"), this.value, 1).difference("income").toFixed()));
}).trigger("input");


/*** options ***/
$.each(cnx.data.layouts, function(k){
	$("<option/>").val(k).text(k).appendTo(page.$layout);
});
page.$layout.children("[value='" + cnx.data[page.edn].layout + "']").attr("selected", "true").end().change(function(){
	var layout = this.value;
	
	cnx.data.set([page.edn, "layout"], layout);
	
	$.each(cnx.tabs, function(tabId, edn){
		edn === page.edn && chrome.tabs.sendRequest(tabId / 1, { layout: cnx.data.layouts[layout] || null });
	});
});

})(this, this.jQuery, this.chrome);