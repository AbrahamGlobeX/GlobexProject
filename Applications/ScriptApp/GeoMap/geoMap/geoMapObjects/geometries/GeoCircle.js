/**
 * WidgetGeoMap::GeoCircle
 */

class GeoCircle extends GeoMapGeometry {
	
	constructor(properties) {
		super(properties.GeoMapGeometry);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		let c = properties.center;
		
		if(undef(c, "center", properties))
			return;
		
		if(undef(c.lon, "lon", c))
			return;
		
		if(undef(c.lat, "lat", c))
			return;
		
		this.center = {lon : parseFloat(c.lon), lat : parseFloat(c.lat)};
		
		if(properties.styleId != undefined)
			this.style = geoManager.styles[properties.styleId];
	}

	getDefaultStyle() {
		return GeoCircleStyle.getDefaultStyle();
	}
	
	updateCenter() {
		for (let id in this.maps) {
			this.maps[id].setLatLng({lng: this.center.lon, lat: this.center.lat});
			this.maps[id].redraw();
		}
	}
	
	onMove(lon, lat) {
		//console.log("move PixelC", lon, lat);
		//console.log("move PixelC", this.center.lon, this.center.lat);
		this.center.lon += lon;
		this.center.lat += lat;
		
		this.updateCenter();
	}
	
	setCenter(pos) {
		let undef = this.getCheckFunction("setCenter");
		
		if(undef(pos, "pos"))
			return;
		
		let lon = pos.lon;
		
		if(undef(lon, "lon", pos))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;
		
		this.center.lon = parseFloat(lon);
		this.center.lat = parseFloat(lat);
		
		this.updateCenter();
	}
	
};