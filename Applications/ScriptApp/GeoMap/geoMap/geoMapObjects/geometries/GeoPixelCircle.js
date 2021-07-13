/**
 * WidgetGeoMap::GeoPixelCircle
 */

class GeoPixelCircle extends GeoCircle {
	
	constructor(properties) {
		super(properties.GeoCircle);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		let radius = properties.radius;
		
		if(undef(radius, "radius", properties))
			return;
		
		this.radius = radius;

		this.data = this.center;

		GeoMapObject.prototype.fillMaps.call(this, () => {return L.circleMarker(this.data, {radius : radius});});

		this.init();
		
	}
	
};