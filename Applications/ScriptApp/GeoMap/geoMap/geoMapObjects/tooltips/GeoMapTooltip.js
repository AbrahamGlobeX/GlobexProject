/**
 * WidgetGeoMap::GeoMapTooltip
 */

class GeoMapTooltipBaseEvents extends GeoMapObjectBaseEvents {
	
	constructor(object) {
		super(object);
	}
	
	tooltipopen(event) {
		let object = this.object;
		
		if(event.tooltip != object.object)
			return undefined;
		
		if(object.opened)
			return undefined;
		
		object.opened = true;
				
		return {};
	}
	
	tooltipclose(event) {
		let object = this.object;
		
		if(event.tooltip != object.object)
			return undefined;
		
		if(!object.opened)
			return undefined;
		
		object.opened = false;
		
		return {};
	}
	
};

class GeoMapTooltipEvents extends GeoTooltipEvents {
	
	constructor(object) {
		super(object);
		
		this.baseEvents = new GeoMapTooltipBaseEvents(object);
		
		this.addInitEvents();
	}
	
	onOpen(eventName, objectId) {
		if (objectId == undefined){
			let maps = this.maps;
			for (let id in maps){
				for (let mapId in maps[id]) {
					let leafletObj = maps[id][mapId];//L.PopUp
					leafletObj.addEventListener( (baseEvent) => {
						let event = this.baseEvents["tooltipopen"].call(this.baseEvents, baseEvent);
						event.objId = id;
						if (event == undefined)
							return;
						this.object.handleEvent(eventName, event, mapId);
					});
				}
			}
		}
		// this.addBaseEvent(eventName, "tooltipopen", this.map);
	}
	
	onClose(eventName, objectId) {

		this.addBaseEvent(eventName, "tooltipclose", this.map);
	}

};

class GeoMapTooltip extends GeoTooltip {
	
	constructor(properties) {
		super(properties.GeoTooltip);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		var tooltip = L.tooltip();
		
		tooltip.setLatLng([this.lat, this.lon]);
		tooltip.setContent(this.content);
		
		this.object = tooltip;

		for (let id in this.layerObjects)
			this.onBindTo(this.layerObjects[id]);
		// if(this.layerObject != undefined)
		// 	this.onBindTo();
		
		this.events = new GeoMapTooltipEvents(this);
	}
	
	unbind(objectId) {
		let layer = this.layerObjects[objectId];
		
		if(layer == undefined)
			return;
		
		layer.tooltip = undefined;

		for (let id in this.maps[objectId]){
			let leafObj = this.maps[objectId][id];
			if (leafObj == undefined) continue;
			if (this.opened[objectId][id])
				layer.maps[id].closeTooltip(leafObj);
			layer.maps[id].unbindTooltip(leafObj);
		}

		delete this.layerObjects[objectId];
		delete this.opened[objectId];
		// if(layer.object != this.map.map)
		// 	layer.object.unbindTooltip(this.object);
		// else
		// 	if(this.opened)
		// 		this.object.closeTooltip(this.object);
	
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

		layer.maps[mapId].openTooltip();
		// if(layer != this.map)

		// else
		// 	layer.map.openTooltip(this.object);
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
		
		layer.maps[mapId].closeTooltip();
	}
	
	onBindTo(layerObj) {
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
			return;
		}

		this.maps[objId] = {};
		let leafToolTips = this.maps[objId];

		for (let mapId in mapsOpened){

			let object = layerObj.maps[mapId];

			if (object == undefined) {
				console.error("object not found");
				debugger;
			}

			leafToolTips[mapId] = new L.tooltip();
			// leafPopups[mapId].setContent(this.content);
			object.bindTooltip(this.content,leafToolTips[mapId]);
			this.events.addEventsToExistObj(leafToolTips[mapId]);

			if(mapsOpened[mapId])
				object.openTooltip();
		}
		layerObj.tooltip = this;

		//властью данной мне их больше не будет на картах
		// if (layer instanceof  L.map){
		// 	console.log("i bind to map");
		//
		// 	if(this.opened)
		// 		layer.object.openTooltip(this.object);
		//
		// 	this.layerObject.tooltip = this;
		// 	return;
		// }

		// for (let mapId in layer.maps){
		// 	let object = layer.maps[mapId];
		//
		// 	object.bindTooltip(this.object);
		//
		// 	if(this.opened[layer.id][mapId])
		// 		object.openTooltip();
		// }
		//
		// layer.tooltip = this;
	}
	
};
