/**
 * WidgetGeoMap::GeoStyle
 */

class GeoStyle extends GeoObject {
	
	constructor(properties) {
		super(properties.GeoObject);
	}
	
	getNumObjects() {
		let undef = this.getCheckFunction("getNumObjects");
		
		undef("Call the abstract method!");
	}
	
	setOption(baseName, value) {
		if(this[baseName] == value)
			return;
		
		this[baseName] = value;
		
		this.update();
	}
	
};
