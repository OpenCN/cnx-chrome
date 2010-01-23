var cnx = {
	id: $("a[title='View your nation']").attr("href").match(/\d+$/)[0],
	te: /^tournament/.test(window.location.hostname),
	
	scrape: function(){
		
	}
};

if (window.location.pathname.toLowerCase() === "/nation_drill_display.asp" && window.location.search.toLowerCase() === "?nation_id=" + cnx.id) {
	cnx.scrape();
}