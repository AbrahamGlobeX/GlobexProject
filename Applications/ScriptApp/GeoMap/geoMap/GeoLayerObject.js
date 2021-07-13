/**
 * WidgetGeoMap::GeoLayerObject
 */

class GeoLayerBaseEvents extends GeoBaseEvents {
	
	constructor(object) {
		super(object);
	}
	
	click(event) {
		console.log("click", event);
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	
	dblclick(event) {
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}

	contextmenu (event) {
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	mousedown(event) {//console.log("mousedown", event);
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	
	mouseup(event) {//console.log("mouseup", event);
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	
	mouseover(event) {
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	
	mouseout(event) {
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	
};

class GeoLayerEvents extends GeoEvents {

	constructor(object, inherited) {
		super(object);

		this.baseEvents = undefined;

		if(inherited === false) {
			this.baseEvents = new GeoLayerBaseEvents(object);

			this.addInitEvents();
		}
	}

	//listenObject : undefined или leafletObj
	addBaseEvent(eventName, baseEventName, listenObject) {
		let undef = this.getCheckFunction("add");

		if(undef(eventName, "eventName"))
			return;

		if(undef(baseEventName, "baseEventName"))
			return;

		if(undef(this.baseEvents, "baseEvents", this))
			return;

		let baseHandler = this.baseEvents[baseEventName];

		if(undef(baseHandler, "function " + baseEventName, this.baseEvents))
			return;

		let object = this.object;//js object

		if (listenObject == undefined) {
			if (object.object != undefined)
				this.addEventToLeafletObject(eventName, baseEventName, object.map, object.id);

			else {
				for (let id in object.maps) {

					listenObject = object.maps[id];//

					if (undef(listenObject, "listenObject")) return;

					this.addEventToLeafletObject(eventName, baseEventName, listenObject, id);
				}
			}
		}
		// else if (listenObject instanceof L.Map)
		// 	this.addEventToLeafletObject(eventName,baseEventName,listenObject);

		else
			for (let id in object.maps){
				if (object.maps[id] == listenObject){
					this.addEventToLeafletObject(eventName,baseEventName,listenObject,id);
					break;
				}
			}

		// if (object.object == null) debugger;

		// if(listenObject == undefined){
		// 	//если не пришел
		// 	if (this.object.object == undefined) {
		// 		//если это линия полигон или точка
		// 		for (let id in object.maps) {
		//
		// 			listenObject = object.maps[id];//todo
		//
		// 			if(undef(listenObject, "listenObject")) {
		// 				return;
		//
		// 			}
		// 			let self = this;
		//
		// 			listenObject.addEventListener(baseEventName, (baseEvent) => {
		// 				let event = baseHandler.call(self.baseEvents, baseEvent);
		//
		// 				if(event == undefined)
		// 					return;
		//
		// 				object.handleEvent(eventName, event, id);
		// 			});
		// 		}
		// 		return;
		// 	}
		// 	else listenObject = object.object;
		// }

		// if(undef(listenObject, "listenObject"))
		// 	return;

		// let self = this;
		//
		// listenObject.addEventListener(baseEventName, (baseEvent) => {
		// 	let event = baseHandler.call(self.baseEvents, baseEvent);
		//
		// 	if(event == undefined)
		// 		return;
		//
		// 	object.handleEvent(eventName, event);
		// });

	}

	addEventToLeafletObject (eventName, baseEventName, leaflet, mapId) {
		if (leaflet == undefined) return;
		if (baseEventName == undefined) return;

		leaflet.addEventListener(baseEventName, (baseEvent) => {
			// console.log(baseEvent);
			let event = this.baseEvents[baseEventName].call(this.baseEvents, baseEvent);

			if(event == undefined)
				return;

			// if (baseEventName == "contextmenu") debugger;
			this.object.handleEvent(eventName, event, mapId);//если карта, то mapId просто проебем
		});
	}

	onClick(eventName, leafObj) {
		this.addBaseEvent(eventName, "click", leafObj);
	}
	
	onDoubleClick(eventName, leafObj) {
		this.addBaseEvent(eventName, "dblclick", leafObj);
	}

	onRightClick (eventName, leafObj) {
		this.addBaseEvent(eventName, "contextmenu", leafObj);
	}
	
	onMouseDown(eventName, leafObj) {
		this.addBaseEvent(eventName, "mousedown", leafObj);
	}
	
	onMouseUp(eventName, leafObj) {
		this.addBaseEvent(eventName, "mouseup", leafObj);
	}
	
	onMouseOver(eventName, leafObj) {
		this.addBaseEvent(eventName, "mouseover", leafObj);
	} 
	
	onMouseOut(eventName, leafObj) {
		this.addBaseEvent(eventName, "mouseout", leafObj);
	} 
	
};

class GeoLayerObject extends GeoObject {
	
	constructor(properties) {
		super(properties.GeoObject);
		
		this.popup = undefined;
		this.tooltip = undefined;
		
		if(properties != undefined) {
			this.popupId = properties.popupId;
			this.tooltipId = properties.tooltipId;
		}
	}
	
	init() {
		this.initGeoTooltip("popup", this.popupId);
		this.initGeoTooltip("tooltip", this.tooltipId);
	}
	
	initGeoTooltip(type, id) {
		if(id == undefined)
			return;
		
		let tooltip = geoManager.objects[id];
		
		if (tooltip != undefined) {
			tooltip.unbind();
			
			tooltip.layerObject = this;
			debugger;
			
			tooltip.onBindTo(this);
			
			this[type] = tooltip;
		}
	}

};
