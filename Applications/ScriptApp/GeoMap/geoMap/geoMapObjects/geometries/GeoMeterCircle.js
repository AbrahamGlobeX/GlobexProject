/**
 * WidgetGeoMap::GeoMeterCircle
 */

class GeoMeterCircle extends GeoCircle {
	
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


		GeoMapObject.prototype.fillMaps.call(this, () => {let test = L.circle(this.data, {radius : radius}); test.setRadius(parseInt(this.radius)); return test;});
		// let latLng = {
		// 	lng : this.center.lon,
		// 	lat : this.center.lat
		// };
		
		// let circle = L.circle(latLng, {radius : radius});

		// this.object = circle;
		
		this.init();
		
	}
	
};