var map;

require(["esri/map", "esri/dijit/Search", "dojo/domReady!"], function(Map, Search) {
	map = new Map("map", {
		basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
		center: [-122.45, 37.75], // longitude, latitude
		zoom: 13
	});

	var search = new Search({
		map: map
	}, "search");
	search.startup();
});