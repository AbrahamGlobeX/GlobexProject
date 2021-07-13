/**
 * WidgetGeoMap::GeoTooltipEvents
 */

class GeoTooltipEvents  /*extends GeoEvents {//*/extends GeoMapObjectEvents {
	
	constructor(object) {
		super(object);
		// this.map = this.object.map.map;
		// this.object = object;
		this.maps = [];
		for (let id in this.object.maps){
			this.maps = geoManager.maps[id];
		}
	}
	
};

class GeoTooltip extends GeoLayerObject {
	
	constructor(properties) {
		super(properties.GeoLayerObject);
		
		this.content = "";
		this.opened = false;
		
		this.lon = 0;
		this.lat = 0;

		this.maps = {};
		// debugger;
		// this.layerObject = undefined;

		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		if(properties.content != undefined)
			this.content = properties.content;
		
		// let opened = properties.opened;
		//
		// if(undef(opened, "opened", properties))
		// 	return;
		
		// this.opened = opened;
		// this.openedAt = {};

		let p = properties.position;
		
		if(undef(p, "position", properties))
			return;
		
		if(undef(p.lon, "lon", p))
			return;
		
		if(undef(p.lat, "lat", p))
			return;
		
		this.lon = p.lon;
		this.lat = p.lat;
		
		let layerIds = properties.layerIds;

		this.layerObjects = {};

		this.opened = {};

		for (let id in layerIds) {
			let object = geoManager.objects[id];
			if (object == undefined) continue;
			this.layerObjects[id] = object;
			this.opened[id] = {};
			for (let mapId in object.maps)
				this.opened[id][mapId] = false;
		}
		// if(layerId != undefined)
		// 	this.layerObject = geoManager.objects[layerId];
	}

	handleEvent(eventName, event, id) {
		geoManager.maps[id].handleObjectEvent(this.id, eventName, event);
	}

	onAddOnMap(map) {
		
	}
	
	setPosition(pos) {
		this.object.setLatLng(pos);
	}
	
	setContent(content) {
		let undef = this.getCheckFunction("setContent");
		
		if(undef(content, "content"))
			return;
		
		if(this.content == content)
			return;
		
		this.content = content;
		
		this.object.setContent(content);
	}
	
	unbind() {
		
	}
	
	onBindTo(layerObj) {
	
	}
	
	bindTo(layerId) {
		let undef = this.getCheckFunction("bindTo");
		
		if(undef(layerId, "layerId"))
			return;

		let objectOnMaps = this.opened[layerId];

		if (objectOnMaps != undefined) {
			debugger;
			return;
		}

		objectOnMaps = {};
		this.opened[layerId] = objectOnMaps;
		// if(this.layerObject != undefined)
		// 	if(this.layerObject.id == layerId)
		// 		return;


		let layer = geoManager.objects[layerId];
		
		if(layer == undefined && layerId == this.map.id)
			layer = this.map;
				
		if(undef(layer, "layer"))
			return;

		for (let mapId in layer.maps)
			objectOnMaps[mapId] = false;

		this.layerObjects[layerId] = layer;

		this.onBindTo(layer);
	}
	
	setPos(pos) {
		if(Rex.compare(this.lon, pos.lon, 1e-9))
			if(Rex.compare(this.lat, pos.lat, 1e-9))
				return;
			
		this.lon = pos.lon;
		this.lat = pos.lat;
		
		this.object.setLatLng(pos);
	}
	
};