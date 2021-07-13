/**
 * WidgetGeoMap::GeoRectangleStyle
 */

class GeoRectangleStyle extends GeoStyle {
	
	static getDefaultStyle() {
		return {
			stroke : true,
			color : "rgba(51, 136, 255, 1)",
			weight : 3,
			dashArray : "",
			dashOffset : "",
			fill : true,
			fillColor : "rgba(51, 136, 255, 1)",
			lineJoin : "round"
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
			"fillColor",
			["bordered", "stroke"],
			["filled", "fill"],
			"lineJoin"
		];

		this.initOptions(properties, options);
		
		this.setGeometries(properties.rectangles);
	}

	setGeometries(geometryIds) {
		if(geometryIds == undefined)
			return;

		let mapObjects = geoManager.objects;

		for(let i = 0; i < geometryIds.length; ++i) {
			let geometry = mapObjects[geometryIds[i]];

			if(geometry == undefined)
				continue;

			geometry.style = this;

			this.geometries.push(geometry);

			const newOptions = {};
		for(let option in this.options) {
			if(typeof this.options[option] != 'undefined')
				newOptions[option] = this.options[option];
		}

			for (let mapId in geometry.maps)
				geometry.maps[mapId].setStyle(newOptions);
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

		const newOptions = {};
		for(let option in this.options) {
			if(typeof this.options[option] != 'undefined')
				newOptions[option] = this.options[option];
		}

		for(let i = 0; i < geometries.length; ++i) {
			let geometry = geometries[i];
			if(geometry != undefined)
				for (let id in geometry.maps)
					geometry.maps[id].setStyle(newOptions);
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

		const newOptions = {};
		for(let option in this.options) {
			if(typeof this.options[option] != 'undefined')
				newOptions[option] = this.options[option];
		}

		for (let id in geometry.maps) {
			geometry.maps[id].setStyle(newOptions);
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

	setFillColor(v) {
		this.setOption("fillColor", v);
	}

	setBordered(v) {
		this.setOption("stroke", v);
	}

	setFilled(v) {
		this.setOption("fill", v);
	}

	setLineJoin(v) {
		this.setOption("lineJoin", v);
	}
	
};
