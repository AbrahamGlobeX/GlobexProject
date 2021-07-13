/**
 * WidgetGeoMap::GeoLineStyle
 */

class GeoLineStyle extends GeoStyle {
	
	static getDefaultStyle() {

		return {
			stroke : true,
			color : "rgba(51, 136, 255, 1)",
			weight : 3,
			dashArray : "",
			dashOffset : "",
			lineJoin : "round",
			lineCap : "round"
		}

	}
	
	constructor(properties) {
		super(properties.GeoStyle);

		let undef = this.getCheckFunction("constructor");

		this.geometries = [];
		this.options = {opacity : 1, fillOpacity : 1};

		let options = [
			"color",
			"weight",
			"dashOffset",
			["dashPattern", "dashArray"],
			"lineCap",
			"lineJoin"
		];

		this.initOptions(properties, options);
		
		this.setGeometries(properties.lines);

		// geoManger.addToMapStyles(this.id, this);
	}

	setGeometries(geometryIds) {
		if(geometryIds == undefined)
			return;

		let mapObjects = geoManager.objects;

		for(let i = 0; i < geometryIds.length; ++i) {
			let geometry = mapObjects[geometryIds[i]];

			if(geometry == undefined)
				continue;

			let oldS = geometry.style;

			geometry.style = this;

			if (oldS != undefined)
				oldS.removeGeometry(geometry);

			this.geometries.push(geometry);

			for (let id in geometry.maps)
				geometry.maps[id].setStyle(this.options);
			// geometry.object.setStyle(this.options);
		}
	}

	initOptions(properties, names) {
		let undef = this.getCheckFunction("initOptions");

		let name, baseName;

		for(let i = 0; i < names.length; ++i) {
			if(!Array.isArray(names[i])) {
				name = names[i];
				baseName = name;
			}
			else {
				name = names[i][0];
				baseName = names[i][1];
			}

			let option = properties[name];

			if(undef(option, name, properties))
				return false;

			this.options[baseName] = option;
		}

		return true;
	}

	setOption(baseName, value) {
		if(this.options[baseName] == value)
			return;

		this.options[baseName] = value;

		this.update();
	}

	update() {
		let geometries = this.geometries;
		let options = this.options;

		for(let i = 0; i < geometries.length; ++i) {
			let geometry = geometries[i];
			if(geometry != undefined)
				for (let id in geometry.maps){
					geometry.maps[id].setStyle(options);
				}
		}
	}

	getNumObjects() {
		return this.geometries.length;
	}

	hasGeometry(geometry) {
		return this.geometries.indexOf(geometry) > -1;
	}

	addGeometry(geometry) {
		let undef = this.getCheckFunction("addGeometry");

		if(undef(geometry, "geometry"))
			return;

		if(this.hasGeometry(geometry))
			return;

		this.geometries.push(geometry);

		for (let id in geometry.maps) {
			geometry.maps[id].setStyle(this.options);
		}
	}

	removeGeometry(geometry) {
		let undef = this.getCheckFunction("removeGeometry");

		if(undef(geometry, "geometry"))
			return;

		if(!this.hasGeometry(geometry))
			return;

		let geometries = this.geometries;

		geometries.splice(geometries.indexOf(geometry), 1);
	}

	setColor(v) {
		this.setOption("color", v);
	}

	setStrokeWeight(v) {
		this.setOption("weight", v);
	}

	setDashPattern(v) {
		this.setOption("dashArray", v);
	}

	setDashOffset(v) {
		this.setOption("dashOffset", v);
	}

	setLineCap(v) {
		this.setOption("lineCap", v);
	}
	
	setLineJoin(v) {
		this.setOption("lineJoin", v);
	}

	setBordered(v) {
		
		this.setOption("stroke", v);
	}
	
};

