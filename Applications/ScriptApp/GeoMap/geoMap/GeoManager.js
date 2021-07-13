//GetGeoPos
// navigator.geolocation.getCurrentPosition(function(location) {
// 	alert(location.coords.latitude);
// 	alert(location.coords.longitude);
// 	alert(location.coords.accuracy);
// });
/**
 * GeoManager
 */


var geoManager = null;//GlobalVariable

class GeoManager {

	constructor(state) {
		geoManager = this;

		this.objectTypes = this.createObjectTypes();
		this.styleTypes = this.createStyleTypes();

		this.maps = {};
		this.images = {};
		this.styles = {};
		this.tooltips = {};
		this.objects = {};

		this.clientId = Math.round(Math.random() * 1e8) + "";

		this.setState(state);
	}

	setState(state) {

		if (geoManager == null) return;

		if (state === undefined) return;

		if (state.geoManager == undefined) return;

		let initParameters = state.geoManager.init;

		if (initParameters != undefined) this.init(initParameters);

		let requests = state.geoManager.requests;

		if (requests == undefined) return;

		if (requests === undefined) return;

		for (var i = 0; i < requests.length; ++i) {
			// console.log("OneRec", requests[i]);
			let request = requests[i];
			if (request === undefined) continue;
			// console.log("method",request.method);
			if (this.clientId == request.clientId) return;

			this[request.method](request.parameters);
		}
	}

	init(parameters) {

		let style, object, id;

		let allImage = parameters.Images;

		if (allImage != undefined)
			this.images = allImage;

		let allObjects = parameters.Objects;

		if (allObjects != undefined) {
			for (let objectType in allObjects) {
				let type = this.objectTypes[objectType];
				for (let i = 0; i < allObjects[objectType].length; ++i) {
					object = new type(allObjects[objectType][i]);
					id = object.id;
					this.objects[id] = object;
				}
			}
		}

		let allStyles = parameters.Styles;

		if (allStyles != undefined) {
			for (let objectType in allStyles) {
				let type = this.styleTypes[objectType];
				for (let i = 0; i < allStyles[objectType].length; ++i) {
					style = new type(allStyles[objectType][i]);
					id = style.id;
					this.styles[id] = style;
				}
			}
		}
	}

	run(parameters) {

		debugger;

		let obj = this[parameters.type + 's'][parameters.id];

		if (obj == undefined) return;
		// if (obj == undefined) debugger;

		return obj[parameters.method](parameters.properties);
	}

	addCollection(parameters) {

		let mapId = parameters.mapId;

		let initParameters = parameters.init;

		let styles = initParameters.styles;

		for (let id in styles)
			geoManager.addStyle(styles[id]);

		let objects = initParameters.objects;
		for (let id in objects) {
			let oneObj = objects[id];
			oneObj.mapId = mapId;
			geoManager.addObject(oneObj);
		}
	}

	addObject(parameters) {

		let objectType = parameters.type;

		let type = this.objectTypes[objectType];

		let map = this.maps[parameters.mapId];

		let object = new type(parameters.properties);

		let id = object.id;
		this.objects[id] = object;

		map.addObjectToMap(id);
	}

	addStyle(parameters) {

		let objectType = parameters.type;

		let type = this.styleTypes[objectType];

		let style = new type(parameters.properties);

		let id = style.id;

		this.styles[id] = style;
	}

	addTooltip(parameters) {
		let tooltip;

		let typeTooltip = parameters.type;

		if (typeTooltip == "Popup")
			tooltip = new GeoMapPopup(parameters.properties);
		else if (typeTooltip == "ToolTip")
			tooltip = new GeoMapTooltip(parameters.properties);
		else {
			console.error("error unknow type tooltip");
			return;
		}

		let id = tooltip.id;

		this.tooltips[id] = tooltip;
	}

	addImage(parameters) {
		//console.log("PARAMETERS", parameters);
		let id = parameters.id;

		if (this.images[id] === undefined)
			this.images[id] = parameters.data;
	}

	addMap(map) {
		if (map == undefined)
			console.log("OPA ERROR MAPA HZ");

		this.maps[map.id] = map;
	}

	removeObject (id) {
		let object = this.objects[id];

		if (object == undefined) {
			console.error("obj undefined");
			return;
		}

		for (let mapId in object.maps)
			this.maps[mapId].removeObject(object.id);

		object.maps = {};

		if (object.removeStyle != undefined) object.removeStyle();
		

		delete this.objects[id];
	}

	removeStyle (id) {

		let style = this.styles[id];

		if (style == undefined){
			console.error("style undefined");
			return;
		}

		for (let objId in style.geometries)
			this.objects[objId].removeStyle();

		delete this.styles[id];
	}

	removeToolTip (id) {
		let toolTip = this.tooltips[id];

		if (toolTip == undefined) {
			console.log("toolTip undefined");
			return;
		}

		delete this.tooltips[id];
	}

	// deleteToolTip (id) {
	//
	// }

	createObjectTypes() {
		const types = {
			'Marker': GeoMapMarker,
			'Popup': GeoMapPopup,
			// 'Tooltip': GeoMapTooltip,
			'Line': GeoMapLine,
			'Polygon': GeoMapPolygon,
			'Rectangle': GeoMapRectangle,
			'PixelCircle': GeoPixelCircle,
			'MeterCircle': GeoMeterCircle
		};
		return types;
	}


	createStyleTypes() {
		const types = {
			'ImageIcon': GeoImageIcon,
			'HtmlIcon': GeoHtmlIcon,
			'Font' : GeoFont,
			'LineText' : GeoLineText,
			'LineStyle': GeoLineStyle,
			'CircleStyle': GeoCircleStyle,
			'PolygonStyle': GeoPolygonStyle,
			'RectangleStyle': GeoRectangleStyle
		};
		return types;
	}

	getMap(id) {
		console.log("getMap");
		let map = this.maps[id];
		if (map === undefined)
			console.log("HeT TAKOU MAP");
		return map;
	}

	getObject(id) {
		return (this.objects[id]);
	}

	getStyle(id) {
		return (this.images[id]);
	}

	getImage(id) {
		return (this.styles[id]);
	}

	isObjectExist(id) {
		console.log("isExist", this.objects[id]);
		return (this.objects[id] !== undefined);
	}

	isStyleExist(id) {
		return (this.styles[id] !== undefined);
	}

	isImageExist(id) {
		return (this.images[id] !== undefined);
	}

}

geoManager = new GeoManager ();

