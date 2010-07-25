(function(window, $, chrome, undefined){

$.tabs = function(tabs, panels){
	$(tabs).children().click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
		$(panels).children().removeClass("selected").eq($(this).index()).addClass("selected");
	});
};
$.tabs("#tabs", "#panels");
$.tabs("#info-tabs", "#info-panels");

var background = chrome.extension.getBackgroundPage().cnx, cnx = {
	edn: window.location.hash.slice(1),
	$layout: $("#options-layout")
};

$.each(background.data.layouts, function(k){
	$("<option/>").val(k).text(k).appendTo(cnx.$layout);
});
cnx.$layout.children("[value='" + background.data[cnx.edn].layout + "']").attr("selected", "true");

cnx.$layout.change(function(){
	var layout = this.value;
	
	background.data.set([cnx.edn, "layout"], layout);
	
	$.each(background.tabs, function(tabId, edn){
		edn === cnx.edn && chrome.tabs.sendRequest(tabId / 1, { layout: background.data.layouts[layout] || null });
	});
});

})(this, this.$, this.chrome);