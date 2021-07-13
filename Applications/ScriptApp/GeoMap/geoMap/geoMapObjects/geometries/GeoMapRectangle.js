/**
 * WidgetGeoMap::GeoMapRectangle
 */

class GeoMapRectangle extends GeoMapGeometry {
	
	constructor(properties) {
		super(properties.GeoMapGeometry);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		let r = properties.rectangle;
		
		if(undef(r, "rectangle", properties))
			return;
		
		let min = r.min;
		
		if(undef(min, "min", r))
			return;
		
		let minLon = parseFloat(min.lon);
		let minLat = parseFloat(min.lat);

		let max = r.max;

		if(undef(max, "max", r))
			return;

		let maxLon = parseFloat(max.lon);
		let maxLat = parseFloat(max.lat);

		this.data = [];

		this.data.push(L.latLng(minLat,minLon));
		this.data.push(L.latLng(maxLat,minLon));
		this.data.push(L.latLng(maxLat,maxLon));
		this.data.push(L.latLng(minLat,maxLon));

		this.minPoint = L.latLng(minLat,minLon);
		this.maxPoint = L.latLng(maxLat,maxLon);

		GeoMapObject.prototype.fillMaps.call(this, () => {//TODO зачем по разному
			let rect = L.rectangle([[1,1],[-1,-1]]);

			rect.getLatLngs()[0] = this.data;

			rect.getBounds()._northEast = this.maxPoint;
			rect.getBounds()._southWest = this.minPoint;

			return rect;
		});

		// this.object = rectangle;
		
		if(properties.styleId != undefined)
			this.style = geoManager.styles[properties.styleId];
		
		this.init();
	}
	
	getDefaultStyle() {
		return GeoRectangleStyle.getDefaultStyle();
	}
	
	setMinPosition(pos) {
		if(this.minLon == pos.lon)
			if(this.minLat == pos.lat)
				return;

		// TODO 2 redraw?
		this.setMinLon(pos.lon);
		this.setMinLat(pos.lat);
	}
	
	setMaxPosition(pos) {
		if(this.maxLon == pos.lon)
			if(this.maxLat == pos.lat)
				return;

		// TODO 2 redraw?
		this.setMaxLon(pos.lon);
		this.setMaxLat(pos.lat);
	}
	
	setMinLon(longitude) {
		if(this.minPoint.lng == longitude)
			return;

		this.minPoint.lng = longitude;
		this.data[1].lng = longitude;
		this.data[0].lng = longitude;

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	setMinLat(latitude) {
		if(this.minPoint.lat == latitude)
			return;

		this.minPoint.lat = latitude;
		this.data[0].lat = latitude;
		this.data[3].lat = latitude;

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	setMaxLon(longitude) {
		if(this.maxPoint.lng == longitude)
			return;
			
		this.maxPoint.lng = longitude;
		this.data[2].lng = longitude;
		this.data[3].lng = longitude;

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	setMaxLat(latitude) {
		if(this.maxPoint.lat == latitude)
			return;
			
		this.maxPoint.lat = latitude;
		this.data[1].lat = latitude;
		this.data[2].lat = latitude;

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	onMove(lon, lat) {
		this.minPoint.lng += lon;
		this.minPoint.lat += lat;
		this.maxPoint.lng += lon;
		this.maxPoint.lat += lat;

		for (let i=0; i<this.data.length; ++i) {
			let latLng = this.data[i];
			latLng.lng += lon;
			latLng.lat += lat;
		}

		this.callObjectsMethod("redraw")
	}
};
