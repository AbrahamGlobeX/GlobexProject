const Rex = {}
Rex.compare = function (v0, v1, epsilon) {
	return (Math.abs(v0 - v1) < (epsilon === undefined ? 1e-6 : epsilon));
};



class WidgetGeoMap extends BaseWidget {

	static objectId = 0;
	static runGeoMethod = null;
	static createObject = null;
	static createStyleObject = null;
	static addObjectOnMap = null;
	static addMapEvent = null;
	static addObjectEvent = null;

	constructor() {

		super();

		// this.map = null;
		// this.autoFontSize = true;
		// this.fontSize = 25;
		// this._lessHundred = false;

		// this.ripples = [];

		// try {
		// 	new ResizeObserver(this.controlFontSize.bind(this)).observe(this.htmlElement);
		// } catch (e) { }
		// this.htmlElement.addEventListener("click", this.startAnimation.bind(this));

		if (geoManager == null)
			geoManager = new GeoManager();


		const geoMapInfo = {

			GeoLayerObject: {
				
				GeoObject: {
					id: this.id,
					events: []
				}
			},

			init: {
				ObjectIds: [],
				currentLayer: "OpenStreetMap",
				viewPosition: { lon: 0, lat: 0, zoom: 0 }
			}
		}

		const map = new GeoMap(this, geoMapInfo, this.htmlElement);

		map.setCurrentLayer(geoMapInfo.init.currentLayer);

		map.invalidateSize();

		this.map = map;

		geoManager.addMap(map);
		// this.htmlText = document.createElement("div");
		// this.htmlText.className = "WidgetButtonText";
		// this.htmlText.textContent = this.text;

		// this.htmlIcon = document.createElement("div");
		// this.htmlIcon.className = "MaterialIcon";

		// this.htmlElement.className = "WidgetButton";
		// this.htmlElement.addEventListener("click", this.startAnimation.bind(this));
		// this.htmlElement.appendChild(this.htmlText);
		// this.htmlElement.appendChild(this.htmlIcon);

		// try {
		// 	new ResizeObserver(this.controlFontSize.bind(this)).observe(this.htmlElement);
		// } catch (e) {}

	}

	set width(value) {
		super.width = value;
		this.map.invalidateSize();
	}

	set height(value) {
		super.height = value;
		this.map.invalidateSize();
	}

	onCreate() {


	}

	checkSelect() {
		return this.hover ? this.widget : undefined;
	}

	handleGeoMapEvent(event) {
		debugger;
		const eventHandlers = geoManager.eventHandlers;

		if(typeof eventHandlers != 'undefined') {
			
			const handlerName = eventHandlers[event.name];

			if(typeof handlerName != 'undefined'){
				if(typeof handlerName === "string"){
					Module.Store.dispatch({
						"eventName" : handlerName,
						"value" : event
					});
				}
				else if(typeof handlerName === "function"){
					handlerName(event);
				}
			}
				
		}

		console.log(event);
	}
}

WidgetGeoMap.runGeoMethod = function(type, id, method, parameters) {
	
	return geoManager.run({type : type, id : id, method : method, properties : parameters});
}

WidgetGeoMap.createObject = function(type, parameters, id) {

	geoManager.objects[id] = new geoManager.objectTypes[type](parameters);
}

WidgetGeoMap.createStyleObject = function(type, parameters, id) {


	geoManager.styles[id] = new geoManager.styleTypes[type](parameters);
}

WidgetGeoMap.addObjectOnMap = function(objectId, mapId) {

		let object = geoManager.objects[objectId];

		let map = geoManager.maps[mapId];

		object.onAddOnMap(map);
}

WidgetGeoMap.addMapEvent = function(mapId, eventName, handlerName) {

	let map = geoManager.maps[mapId];

	map.addEvent(eventName);

	let eventHandlers = geoManager.eventHandlers;

	if(typeof eventHandlers == 'undefined') {

		eventHandlers = {};

		geoManager.eventHandlers = eventHandlers;
	}

	eventHandlers[eventName] = handlerName;
}

WidgetGeoMap.addObjectEvent = function(objectId, eventName, handlerName) {

	let object = geoManager.objects[objectId];

	object.addEvent(eventName);

	let eventHandlers = geoManager.eventHandlers;

	if(typeof eventHandlers == 'undefined') {

		eventHandlers = {};

		geoManager.eventHandlers = eventHandlers;
	}

	eventHandlers[eventName] = handlerName;
}

