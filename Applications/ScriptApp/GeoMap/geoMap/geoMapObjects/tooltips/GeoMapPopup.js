/**
 * WidgetGeoMap::GeoMapPopup
 */

class GeoMapPopupBaseEvents extends GeoMapObjectBaseEvents {
	
	constructor(object) {
		super(object);
	}
	
	popupopen(event, objectId, mapId) {
		let object = this.object;

		let leafObj = object.maps[objectId][mapId];

		if (leafObj == undefined) {
			console.error("Error obj not found");
			return undefined;
		}

		if(object.opened[objectId][mapId])
			return undefined;

		object.opened[objectId][mapId] = true;

		let retEvent = {
			"objectId" : parseInt(objectId),
			"mapId" : parseInt(mapId),
			// "open" : true,
			"type" : "popUp"
		}
		return retEvent;
	}
	
	popupclose(event, objectId, mapId) {
		let object = this.object;

		let leafObj = object.maps[objectId][mapId];

		if (leafObj == undefined) {
			console.error("Error obj not found");
			return undefined;
		}

		if(!object.opened[objectId][mapId])
			return undefined;

		object.opened[objectId][mapId] = false;

		let retEvent = {
			"objectId" : parseInt(objectId),
			"mapId" : parseInt(mapId),
			"type" : "popUp"
		}

		return retEvent;
	}
	
}; 

class GeoMapPopupEvents extends GeoTooltipEvents {
	
	constructor(object) {
		super(object);
		
		this.baseEvents = new GeoMapPopupBaseEvents(object);
		
		this.addInitEvents();
	}
	
	onOpen(eventName, leafObj) {
		let baseEventName = "popupopen";
		if (leafObj == undefined){
			let maps = this.object.maps;
			for (let id in maps){
				for (let mapId in maps[id]) {

					geoManager.objects[id].maps[mapId].addEventListener(baseEventName, (baseEvent) => {
						let event = this.baseEvents[baseEventName].call(this.baseEvents, baseEvent, id, mapId);
						if (event == undefined)
							return;
						this.object.handleEvent(eventName, event, mapId);
					});
				}
			}
		}
		else {
			let maps = this.object.maps;
			for (let id in maps){
				for (let mapId in maps[id]) {
					let leafletObj = maps[id][mapId];//L.PopUp
					if (leafletObj != leafObj) continue;

					geoManager.objects[id].maps[mapId].addEventListener(baseEventName, (baseEvent) => {
						let event = this.baseEvents[baseEventName].call(this.baseEvents, baseEvent, id, mapId);
						if (event == undefined)
							return;
						this.object.handleEvent(eventName, event, mapId);
					});
				}
			}
		}
	}
	
	onClose(eventName, leafObj) {
		let baseEventName = "popupclose";
		if (leafObj == undefined){
			let maps = this.object.maps;
			for (let id in maps){
				for (let mapId in maps[id]) {

					geoManager.objects[id].maps[mapId].addEventListener(baseEventName, (baseEvent) => {
						let event = this.baseEvents[baseEventName].call(this.baseEvents, baseEvent, id, mapId);
						if (event == undefined)
							return;
						this.object.handleEvent(eventName, event, mapId);
					});
				}
			}
		}
		else {
			let maps = this.object.maps;
			for (let id in maps){
				for (let mapId in maps[id]) {
					let leafletObj = maps[id][mapId];//L.PopUp
					if (leafletObj != leafObj) continue;

					geoManager.objects[id].maps[mapId].addEventListener(baseEventName, (baseEvent) => {
						let event = this.baseEvents[baseEventName].call(this.baseEvents, baseEvent, id, mapId);
						if (event == undefined)
							return;
						this.object.handleEvent(eventName, event, mapId);
					});
				}
			}
		}
	}
	
};

class GeoMapPopup extends GeoTooltip {
	
	constructor(properties) {
		super(properties.GeoTooltip);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		var popup = L.popup({autoPan : false});
		
		popup.setLatLng([this.lat, this.lon]);
		
		// var frameData;// = '<iframe src="https:\/\/ru.wiktionary.org\/wiki\/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0" width="400" height="200" align="left">';
		// frameData = '<iframe src="http:\/\/192.168.10.65\/?type=AppServer&obj_id=5a1bad09e4610de6c3ec6987&ses_key=5a1be2d91003e87ac248b9de" width="400" height="200" align="left">'
		// frameData += 'Ваш браузер не поддерживает плавающие фреймы!';
		// frameData += '</iframe>';
		
		//popup.setContent(frameData);
		popup.setContent(this.content);
		
		this.object = popup;

		for (let id in this.layerObjects)
			this.onBindTo(this.layerObjects[id]);
		// if(this.layerObject != undefined)
		// 	this.onBindTo();
		//
		this.events = new GeoMapPopupEvents(this);
	}
	
	setPosition(pos) {
		this.object.setLatLng(pos);
	}
	
	unbind(objectId) {
		let layer = this.layerObjects[objectId];

		if(layer == undefined)
			return;

		layer.popup = undefined;

		for (let id in this.maps[objectId]){
			let lefObj = this.maps[objectId][id];
			if (lefObj == undefined) continue;
			if (this.opened[objectId][id])
				layer.maps[id].closePopup(lefObj);
			layer.maps[id].unbindPopup(lefObj);
		}

		delete this.layerObjects[objectId];
		delete this.opened[objectId];
		// if(layer.object != this.map.map)
		// 	layer.object.unbindPopup(this.object);
		// else
		// 	if(this.opened)
		// 		this.object.closePopup(this.object);
		//
		// debugger;
		// this.layerObject = undefined;
	}
	
	open(property) {
		let mapId = property.MapId;

		let objId = property.ObjectId;

		if (mapId == undefined || objId == undefined)
			return;

		if(this.opened[objId][mapId])
			return;

		this.opened[objId][mapId] = true;

		let layer = this.layerObjects[objId];

		if(layer == undefined)
			return;

		layer.maps[mapId].openPopup();
	}
	
	close(property) {
		let mapId = property.MapId;

		let objId = property.ObjectId;

		if (mapId == undefined || objId == undefined)
			return;

		if(!this.opened[objId][mapId])
			return;

		this.opened[objId][mapId] = false;

		let layer = this.layerObjects[objId];

		if(layer == undefined)
			return;

		layer.maps[mapId].closePopup();
		// if(!this.opened)
		// 	return;
		//
		// this.opened = false;
		//
		// let layer = this.layerObject;
		//
		// if(layer == undefined)
		// 	return;
		//
		// if(layer != this.map)
		// 	layer.object.closePopup();
		// else
		// 	layer.map.closePopup(this.object);
	}
	
	setContent(content) {
		let undef = this.getCheckFunction("constructor");
		
		if(undef(content, "content"))
			return;
		
		if(this.content == content)
			return;
		
		this.object.setContent(content);
	}

		
	onBindTo(layerObj) {
		// let undef = this.getCheckFunction("onBindTo");

		let objId = layerObj.id;

		if (objId == undefined) debugger;

		if (this.layerObjects[objId] != layerObj) {
			console.log("addToolTip");
			this.layerObjects[objId] = layerObj;
		}

		let mapsOpened = this.opened[objId];

		if (this.maps == undefined) {
			debugger;
			this.maps = {};
		}

		if (this.maps[objId] != undefined) {
			console.error("ALREADY EXIST");
			debugger;
		}

		this.maps[objId] = {};
		let leafPopups = this.maps[objId];

		for (let mapId in mapsOpened){

			let object = layerObj.maps[mapId];

			if (object == undefined) {
				console.error("object not found");
				debugger;
			}

			leafPopups[mapId] = new L.popup({autoPan : false});
			leafPopups[mapId].setContent(this.content);
			object.bindPopup(leafPopups[mapId]);
			this.events.addEventsToExistObj(leafPopups[mapId]);

			if(mapsOpened[mapId])
				object.openPopup();
		}
		layerObj.popup = this;

		// let layer = this.layerObject;
		
		// if(undef(layer, "layerObject", this))
		// 	return;

		// if (layer instanceof  L.map){
		// 	console.log("i bind to map");
		//
		// 	if(this.map.map != layer.object){
		// 		layer.object.bindPopup(this.object);
		//
		// 		if(this.opened)
		// 			layer.object.openPopup();
		// 	}
		// 	else
		// 		if(this.opened)
		// 			layer.object.openPopup(this.object);
		//
		// 	this.layerObject.tooltip = this;
		// 	return;
		// }


		//
		//
		//
		//
		//
		// let object = layer.object;
		//
		// if(undef(object, "object", layer))
		// 	return;
		//
		// if(object != this.map.map) {
		// 	object.bindPopup(this.object);
		//
		// 	if(this.opened)
		// 		object.openPopup();
		// }
		// else {
		// 	if(this.opened)
		// 		object.openPopup(this.object);
		// }
		//
		// this.layerObject.popup = this;
	}
	
};
