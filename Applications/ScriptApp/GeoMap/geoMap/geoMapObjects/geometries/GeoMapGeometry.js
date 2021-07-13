/**
 * WidgetGeoMap::GeoMapGeometry
 */

class GeoMapGeometry extends GeoMapObject {
	constructor(properties) {
		super(properties.GeoMapObject);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		this.style = undefined;
		
		this.events = new GeoLayerEvents(this, false);
	}
	
	static pathToGeoJson(path) {
		//let undef = this.getCheckFunction("pathToGeoJson");
		
		//if(undef(path, "path"))
			//return undefined;
		
		let ret = [];
		
		for(let i = 0; i < path.length; ++i) {
			let point = path[i];
			ret.push(L.latLng(point.lat,point.lon));
		}
		
		return ret;
	}

	static pathGetDefaultJson () {
		return [{"lng":"0","lat":"1"}];
	}

	init() {
		super.init();
		
		this.geoEvents = new GeoLayerEvents(this, false);
		
		if(this.style != undefined)
			this.style.addGeometry(this);
	}
	

	
	getDefaultStyle() {
		
	}
	
	setStyle(styleId) {
		let undef = this.getCheckFunction("setStyle");
		
		if(undef(styleId, "styleId"))
			return false;
		
		let style = geoManager.styles[styleId];

		if (style == undefined) debugger;
		// if(undef(style, "style"))
		// 	return false;
		
		// if(this.style == style)
		// 	return false;

		let s = this.style;
		
		this.style = style;
		
		if(s != undefined)
			s.removeGeometry(this);
		
		if(!style.hasGeometry(this))
			style.addGeometry(this);

		//this.callObjectsMethod("setStyle",style.options);

		return true;
	}
	
	removeStyle() {
		if(this.style == undefined)
			return;
		
		this.style.removeGeometry(this);
		
		this.style = undefined;

		for (let id in this.maps) {
			this.maps[id].setStyle(this.getDefaultStyle());
			this.maps[id].redraw();
		}
	}
	

	
};
