/**
 * WidgetGeoMap::GeoMap
 */

class GeoMapBaseEvents extends GeoLayerBaseEvents {
	
	constructor(object) {
		super(object);
	}
	
	move(event) {
		let map = event.target;
		
		let v = this.object.view;
		
		let latLng = map.getCenter();
		let zoom = map.getZoom();
		
		let pixelOffset = map.project(L.latLng(latLng));
		
		if(Rex.compare(v.zoom , zoom))
			if(Rex.compare(v.x, pixelOffset.x, 1))
				if(Rex.compare(v.y, pixelOffset.y, 1))
					return undefined;
		
		v.lon = latLng.lng;
		v.lat = latLng.lat;
		
		v.zoom = zoom;
		
		v.x = pixelOffset.x;
		v.y = pixelOffset.y;
		
		return {
			lon : latLng.lng,
			lat : latLng.lat,
			zoom : zoom
		};
	}
	
	mousemove(event) {
		// //console.log("mousemove", event);
		return {
			lon : event.latlng.lng,
			lat : event.latlng.lat
		};
	}
	
};

class GeoMapEvents extends GeoLayerEvents {
	
	constructor(object) {
		super(object);
		
		this.baseEvents = new GeoMapBaseEvents(object);
		
		this.addInitEvents();
	}
	
	onChangeView(eventName) {
		this.addBaseEvent(eventName, "move");
	}
	
	onMouseMove(eventName) {
		this.addBaseEvent(eventName, "mousemove");
	}
};

class GeoMap extends GeoLayerObject {
	
	constructor(mapWidget, properties, htmlContainer) {
		//console.log("GeoMap constructor");
		super(properties.GeoLayerObject);

		this.htmlContainer = htmlContainer;

		//console.log("GeoMap properties", properties);

		this.checker = new GeoMapChecker(this);

		let undef = this.getCheckFunction("constructor");
		if(undef(properties, "properties")) {
			return;
		}

		let init = properties.init;
		if(undef(init, "init", properties)) {
			return;

		}

		// this.clientId = Math.round(Math.random() * 1e8);

		this.mapWidget = mapWidget;
		
		this.htmlMapStyle = undefined;
		
		this.view = {
			lon : 0,
			lat : 0,
			x : undefined,
			y : undefined,
			zoom : 0
		};
		
		this.initLeafletSettings();
		
		this.map = this.createMap();
		
		this.object = this.map;
		
		this.visible = true;
		this.interactive = true;
		this.draggable = true;
		
		this.map.doubleClickZoom.disable();
		this.map.keyboard.disable();
		
		this.setInteractive(true);

		this.setVisible(mapWidget.visible);
		this.setDraggable(this.draggable);
		
		this.setView(init.viewPosition);
		
		// this.objectTypes = this.createObjectTypes();
		// this.styleTypes = this.createStyleTypes();
		
		this.objects = {};
		// this.styles = {};
		// this.images = {};

		this.gridLayers = {};
		
		this.currentGridLayer = undefined;
		
		this.providerLayers = new GeoMapProviderLayers();
		
		this.addProviderLayer({parameters : {provider : "OpenStreetMap"} });
		this.addProviderLayer({parameters : {provider : "GoogleMap"} });
		this.addProviderLayer({parameters : {provider : "YandexMap"} });
		this.addProviderLayer({parameters : {provider : "GlobeXYMap"} });
		
		//this.addProviderLayer({name : "roadmap", parameters : {provider : "GoogleMap", type : "roadmap"} });
		//this.addProviderLayer({name : "satellite", parameters : {provider : "GoogleMap", type : "satellite"} });
		// this.addProviderLayer({name : "terrain", parameters : {provider : "GoogleMap", type : "terrain"} });
		
		this.providerControls = new GeoMapProviderControls();
		this.events = new GeoMapEvents(this);
	}
	//this.addProviderControl("OpenStreetMap");
	
	initLeafletSettings() {
		let undef = this.getCheckFunction("initLeafletSettings");

		if(undef(L, "Leaflet global object L"))
			return;

		GeoImageIcon.setDefaultOptions(L.Icon.Default.prototype.options);
	}

	createMap() {
		let htmlMap = document.createElement('div');
		htmlMap.id = "geoMap" + this.id;

		this.htmlMap = htmlMap;

		let style = htmlMap.style;

		this.htmlMapStyle = style;

		style.backgroundColor = "rgb(253,250,243)";
		//style.zIndex = "1";
		let abs = 1;

		if(abs == 1) {
			style.position = 'absolute';
			style.left = '0%';
			style.top = '0%';
			style.width = '100%';
			style.height = '100%';
		} else {
			style.position = 'relative';
			style.left = '0%';
			style.top = '0%';
			style.width = '100%';
			style.height = '100%';
		}

		this.htmlContainer.appendChild(htmlMap);

		let v = this.view;

		let lonLat = [v.lon, v.lat];

		let map = L.map(htmlMap, {center: lonLat, zoom: v.zoom});

		let pixelOffset = map.project(lonLat, v.zoom);

		v.x = pixelOffset.x;
		v.y = pixelOffset.y;

		return map;
		// let htmlMap = document.createElement('div');
		//
		// htmlMap.id = "geoMap" + this.id;
		//
		// this.htmlMap = htmlMap;
		//
		// let style = htmlMap.style;
		//
		// this.htmlMapStyle = style;
		//
		// style.backgroundColor = "rgb(242,239,233)";
		// style.zIndex = "1";
		// style.position = 'absolute';
		//
		// let widget = this.mapWidget;
		//
		// let x, y, w, h;
		//
		// x = 200;
		// y = 200;
		// w = 300;
		// h = 300;
		//
		// if(Rex[widget.parentId] != undefined) {
		// 	x = widget.getAbsolutePosX();
		// 	y = widget.getAbsolutePosY();
		// 	w = widget.getAbsoluteWidth();
		// 	h = widget.getAbsoluteHeight();
		// }
		//
		// let paddingLeft = 5;
		// let paddingRight = 5;
		// let paddingTop = h * 0.06 + 5;
		// let paddingBottom = 5;
		//
		// x = x + paddingLeft;
		// y = y + paddingTop;
		// w = w - paddingLeft - paddingRight;
		// h = h - paddingTop - paddingBottom;
		//
		// //this.setPos(x, y);
		// //this.setSize(w, h);
		// this.mapWidget.view.htmlElement.appendChild(htmlMap);
		//
		// //document.getElementById('canvas').parentElement.appendChild(htmlMap);
		//
		// let v = this.view;
		//
		// let lonLat = [v.lon, v.lat];
		//
		// let map = L.map(htmlMap, {center: lonLat, zoom: v.zoom});
		//
		// let pixelOffset = map.project(lonLat, v.zoom);
		//
		// v.x = pixelOffset.x;
		// v.y = pixelOffset.y;
		//
		// return map;
	}
	
	getViewZoom() {
		return this.object.getZoom();
	}

	getViewLon() {

		return this.object.getCenter().lng;
	}

	getViewLat() {

		return this.object.getCenter().lat;
	}

	setPos(x, y) {
		if(Math.abs(x - this.posX) > 0.1) {
			this.posX = x;
			this.htmlMapStyle.left = x + "px";
		}
		
		if(Math.abs(y - this.posY) > 0.1) {
			this.posY = y;
			this.htmlMapStyle.top = y + "px";
		}
	}
	
	setSize(width, height) {
		if(Math.abs(width - this.width) > 0.1) {
			this.width = width;
			this.htmlMapStyle.width = width + "px";
		}
		
		if(Math.abs(height - this.height) > 0.1) {
			this.height = height;
			this.htmlMapStyle.height = height + "px";
		}
		
		this.invalidateSize();
	}

	invalidateSize() {
		if(this.map != undefined)
			this.map.invalidateSize();
	}
	
	setInteractive(interactive) {
		if(this.interactive == interactive)
			return;
		
		this.interactive = interactive;
		
		let map = this.map;
		
		if(1||interactive) {
			if(this.draggable)
				map.dragging.enable();
			
			map.touchZoom.enable();
			//map.doubleClickZoom.enable();
			map.scrollWheelZoom.enable();
			map.boxZoom.enable();
			//map.keyboard.enable();
			
			if (map.tap) map.tap.enable();
		} else {
			map.dragging.disable();
			map.touchZoom.disable();
			//map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
			map.boxZoom.disable();
			//map.keyboard.disable();
			
			if (map.tap) map.tap.disable();
		}
	}
	
	setDraggable(draggable) {
		if(this.draggable == draggable)
			return;
		
		this.draggable = draggable;
		
		if(draggable)
			this.map.dragging.enable();
		else
			this.map.dragging.disable();
	}
	
	setView(pos) {
		
		let undef = this.getCheckFunction("setView");
		
		if(undef(pos, "pos"))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;
		
		let lon = pos.lon;
		
		if(undef(lon, "lon", pos))
			return;
		
		let zoom = pos.zoom;
		
		if(undef(zoom, "zoom", pos))
			return;
			
		let v = this.view;
		
		if(Rex.compare(v.lon, lon, 1e-9))
			if(Rex.compare(v.lat, lat, 1e-9))
				if(Rex.compare(v.zoom, zoom, 1e-9))
					return;
		
		let map = this.map;
		
		let latLng = L.latLng([lat, lon]);
		
		let pixelOffset = map.project(latLng, zoom);
		
		v.lon = lon;
		v.lat = lat;
		
		v.zoom = zoom;
		
		v.x = pixelOffset.x;
		v.y = pixelOffset.y;
		
		map.setView(latLng, zoom, {animate : false});
	}
	
	flyTo(properties) {
		let undef = this.getCheckFunction("flyTo");
		
		if(undef(properties, "properties"))
			return;
		
		let pos = properties.pos;
		
		if(undef(pos, "pos", properties))
			return;
		
		let duration = properties.duration;
		
		if(undef(duration, "duration", properties))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;
		
		let lon = pos.lon;
		
		if(undef(lon, "lon", pos))
			return;
		
		let zoom = pos.zoom;
		
		if(undef(zoom, "zoom", pos))
			return;
		
		this.map.flyTo({lng : lon, lat : lat}, zoom, {animate : true, duration : duration / 1000});
	}
	
	panTo(parameters) {
		let undef = this.getCheckFunction("panTo");
		
		if(undef(parameters, "properties"))
			return;
		
		let pos = parameters.pos;
		
		if(undef(pos, "pos", parameters))
			return;
		
		let duration = parameters.duration;
		
		if(undef(duration, "duration", parameters))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;
		
		let lon = pos.lon;
		
		if(undef(lon, "lon", pos))
			return;

		this.map.panTo({lng : lon, lat : lat}, {animate : true, duration : duration / 1000});
	}
	
	setCurrentLayer(layerName) {
		let undef = this.getCheckFunction("setCurrentLayer");
		
		if(undef(layerName, "layerName"))
			return;

		let currentLayer = this.currentGridLayer;
		
		if(layerName == "") {
			if(currentLayer)
				currentLayer.removeFrom(this.map);
			
			this.currentGridLayer = undefined;
			
			return;
		}
		
		let layer = this.gridLayers[layerName];
		
		if(undef(layer, "layer " + layerName, this.gridLayers))
			return;
		
		if(layer == currentLayer)
			return;
		
		if(currentLayer)
			currentLayer.removeFrom(this.map);
		
		this.map.addLayer(layer);
		
		this.currentGridLayer = layer;
	}
	
	addProviderLayer(layerInfo) {
		let undef = this.getCheckFunction("addProviderLayer");
		
		if(undef(layerInfo, "parameters"))
			return;
		
		let name = layerInfo.name;
		
		let parameters = layerInfo.parameters;
		
		if(parameters !== Object(parameters))
			parameters = JSON.parse(parameters);
		
		if(undef(parameters, "parameters", layerInfo))
			return;
		
		let providerName = parameters.provider;
		
		if(undef(providerName, "providerName", parameters))
			return;
		
		delete parameters['provider'];
		
		if(name == undefined || name == "")
			name = providerName;
		
		let layer = this.gridLayers[name];
		
		if(layer == undefined) {
			layer = this.providerLayers.createLayer(providerName, parameters);
			
			if(undef(layer, "Provider layer with parameters" + parameters))
				return undefined;
			
			this.gridLayers[name] = layer;
		} else {
			undef("Layer with name " + name + " already exists!");
			return undefined;
		}
		
		return layer;
	}
	
	removeProviderLayer(layerName) {
		let undef = this.getCheckFunction("removeProviderLayer");
		
		if(undef(layerName, "layerName"))
			return;
		
		let layer = this.gridLayers[layerName];
		
		if(undef(layer, "layer " + layerName,  this.gridLayers))
			return;
		
		if(this.currentGridLayer == layer) {
			layer.removeFrom(this.map);
			this.currentGridLayer = undefined;
		}
		
		delete this.gridLayers[layerName];
	}
	
	addProviderControl(providerName, controlName) {
		let undef = this.getCheckFunction("addProviderControl");
		
		let control = this.providerControls.createControl(providerName, controlName);
		
		if(undef(control, "Provider control " + controlName))
			return;
		
		this.map.addControl(control);
	}
	
	checkRange(range) {
		let undef = this.getCheckFunction("checkRange");
		
		if(undef(range, "range"))
			return false;
		
		let start = range.start;
		
		if(undef(start, "start", range))
			return false;
		
		let end = range.end;
		
		if(undef(end, "end", range))
			return false;

		if(start < 0)
			if(undef("start index < 0"))
				return false;
			
		if(end < 0)
			if(undef("end index < 0"))
				return false;
			
		if(end < start)
			if(undef("end index < start index"))
				return false;
		
		return true;
	}
	
	init(state) {
		if(state == undefined)
			return;
		
		let undef = this.getCheckFunction("init");
		
		let init = state.init;
		
		if(init == undefined)
			return;
		
		let range = init.initRequestsRange;
		
		if(range != undefined)
			if(state.requests != undefined)
				this.handleInitRequests(state.requests, range);

		//console.log("cur LAYER", init.currentLayer);
		this.setCurrentLayer(init.currentLayer);
	}
	
	setState(state) {
		if(state == undefined)
			return;
		
		let init = state.init;
		
		let range = undefined;
		
		if(init != undefined)
			range = init.initRequestsRange;
		
		this.handleRequests(state.requests, range);
	}
	
	handleInitRequests(requests, requestsRange) {
		if(!this.checkRange(requestsRange))
			return;
		
		for (var i = requestsRange.start; i <= requestsRange.end; ++i)
			this.handleRequest(requests[i]);
		
		requestsRange.start = 0;
	}
	
	handleRequest(request) {
		let undef = this.getCheckFunction("handleRequest");
		
		if(undef(request, "request"))
			return;
		
		let r = request;
		
		if(undef(r.clientId, "clientId", r))
			return;
		
		if(this.clientId == r.clientId)
			return;
		
		let method = r.method;
		
		if(undef(method, "method", r))
			return;
		
		let id = r.id;
		
		if(undef(id, "id", r))
			return;
		
		let type = r.type;
		
		if(undef(type, "type", r))
			return;
		
		let object;
		
		switch(type) {
			case "map" :
				object = this;
				break;
				
			case "object" :
				object = this.objects[id];
				
				if(undef(object, "map object with id = " + id, this.objects))
					return;
				
				break;
				
			case "style" :
				object = this.styles[id];
				
				if(undef(object, "style with id = " + id, method, this.styles))
					return;
		}
		
		let requestFunction = object[method];
		
		if(undef(requestFunction, "function " + method, object))
			return;
		
		requestFunction.call(object, r.parameters);
	}
	
	handleRequests(requests, initRequestsRange) {
		if(requests == undefined)
			return;
		if(initRequestsRange == undefined) {
			for (var i = 0; i < requests.length; ++i)
				this.handleRequest(requests[i]);
		} else {
			if(!this.checkRange(initRequestsRange))
				return;
			
			for (let i = 0; i < initRequestsRange.start; ++i)
				this.handleRequest(requests[i]);
			
			for (let i = initRequestsRange.end + 1; i < requests.length; ++i)
				this.handleRequest(requests[i]);
			
			return;
		}
	}
	
	addOnMapLayer(object) {
		let undef = this.getCheckFunction("addOnBaseMap");
		
		if(undef(object, "object"))
			return;

		if (object.maps[this.id] == undefined){
			if (Object.keys(object.maps).length < 1) {
				object.maps[this.id] = object.protoObject;
				//console.warn("Error can't add to map object not init");
				//return;
			}
			else {
				// //console.log("before", object.maps[0]);
				let existId = Object.keys(object.maps)[0];

				let temp = object.cloneLayer(object.maps[existId]);//COPY Object

				object.maps[this.id] = temp;
				// if (temp != )
				// object.maps[this.id].redraw();
				object.geoEvents.addEventsToExistObj(temp);
				// 	temp.addEventListener()
				// }
				// //console.log("after", temp);
			}
		}

		let baseObject = object.maps[this.id];

		if(undef(baseObject, "object", object))
			return;
		//console.log(baseObject);
		baseObject.addTo(this.map);
	}
	
	addObject(parameters) {
		let undef = this.getCheckFunction("addObject");
		
		if(undef(parameters, "parameters"))
			return;
		
		let id = parameters.id;
		
		if(undef(id, "id", parameters))
			return;

		if(this.objects[id] != undefined)
			return;

		let object;

		if (geoManager.isObjectExist(id)){
			//console.log("exists", id);
			object = geoManager.getObject(id);
		}
		else {
			//console.log("NOT exists", id);
			object = geoManager.addObject(this,parameters);
		}

		//console.log("OBJECT", object);
		object.onAddOnMap(this);
		
		this.objects[id] = object;//надо ли?
	}

	// addObjectToMap (object) {
	// 	object.onAddOnMap(this);
	//
	// 	this.objects[object.id] = object;//надо ли?
	// }

	addObjectToMap (id) {
		let object = geoManager.objects[id];

		if (object === undefined) {
			// debugger;
			console.error("prosto beda");
			return;
		}

		object.onAddOnMap(this);

		this.objects[object.id] = object;//надо ли?
	}

	removeObject(objectId) {
		let undef = this.getCheckFunction("removeObject");
		
		if(undef(objectId, "objectId"))
			return;
		
		let object = geoManager.objects[objectId];
		
		if(object === undefined) debugger;

		object.removeFromMap(this.id);

		delete this.objects[object.id];
	}
	
	addStyle(parameters) {
		let undef = this.getCheckFunction("addStyle");
		
		if(undef(parameters, "parameters"))
			return;
		
		let id = parameters.id;

		if(undef(id, "id", parameters))
			return;
		
		if(this.styles[id] != undefined)
			return;

		if (!geoManager.isStyleExist(id))
			geoManager.addStyle(this,parameters);
	}
	
	removeStyle(styleId) {
		let undef = this.getCheckFunction("removeStyle");
		
		if(undef(styleId, "styleId"))
			return;
		
		let style = this.styles[styleId];
		
		if(style.getNumObjects() > 0) {
			undef("Removed style has " + style.getNumObjects() + " objects!");
			return;
		}
		
		delete this.styles[styleId];
	}
	
	addImage(parameters) {
		let undef = this.getCheckFunction("addImage");
		
		if(undef(parameters, "parameters"))
			return;
		
		let id = parameters.id;
		
		if(undef(id, "id", parameters))
			return;
		
		if(this.images[id] != undefined)
			return;

		if (!geoManager.isImageExist(id))
			geoManager.addImage(parameters);

		this.images.id = geoManager.getImage(id);//надо ли??
	}
	
	handleEvent(eventName, event, id) {
		this.handleObjectEvent(this.id, eventName, event, id);
	}
	
	handleObjectEvent(objectId, eventName, eventData, mapId) {

		let undef = this.getCheckFunction("handleObjectEvent");
		
		if(undef(objectId, "objectId"))
			return;
		
		if(undef(eventName, "eventName"))
			return;
		
		if(undef(eventData, "eventData"))
			return;

		let event = {
			clientId : geoManager.clientId + "",
			objectId : objectId,
			name : eventName,
			data : eventData
		};

		if (mapId != undefined)
			event.mapId = parseInt(mapId);

		this.mapWidget.handleGeoMapEvent(event);
	}
	
	setVisible(v) {
		let undef = this.getCheckFunction("setVisible");
		
		if(undef(v, "v"))
			return;
		
		if(this.visible == v)
			return;
		
		this.visible = v;
		
		let style = this.htmlMapStyle;
		
		if(style == undefined)
			return;
		
		if(v)
			style.visibility = "visible";
		else
			style.visibility = "hidden";
	}
	
	clear() {
		let undef = this.getCheckFunction("clear");
		
		if(undef(this.map, "map", this))
			return;
		
		this.map.remove();
		
		// this.htmlMap.remove();
	}
		
	addCollection(collection) {////console.log("addCollection", collection);
		let undef = this.getCheckFunction("addCollection");
		
		if(undef(collection, "collection"))
			return;
		
		if(!Array.isArray(collection)) {
			undef("collection is not array : " + collection);
			return;
		}
		
		// let objects = [];

		/*
		for(let i = 0; i < collection.length; ++i) {
			let parameters = collection[i];
		
			let id = parameters.id;
			
			if(undef(id, "id", parameters))
				return;
			
			if(this.objects[id] != undefined) {
				//console.log("addCollection error object already exists : id = " + id, this.objects[id], this.objects);
				undef("object " + this.objects[id] + " already exists in " + this.objects);
				return;
			}
			
			let objectType = parameters.type;
			
			if(undef(objectType, "type", parameters))
				return;
			
			let type = this.objectTypes[objectType];
	
			if(undef(type, "type " + objectType, this.geoObjectTypes))
				return;
			
			let object = new type(this, this, parameters.properties);
			
			this.objects[id] = object;
			
			objects.push(object);
		}
		*/

		for(let i = 0; i < collection.length; ++i) {

			let id = collection[i];
			if (this.objects[id] != undefined) continue;

			// console.log("this",this.map);
			this.addObjectToMap(id);
		}
	}
	
	removeCollection(collection) {
		let undef = this.getCheckFunction("removeCollection");
		
		if(undef(collection, "collection"))
			return;
		
		if(!Array.isArray(collection)) {
			undef("collection is not array : " + collection);
			return;
		}
		
		let objects = [];
		
		for(let i = 0; i < collection.length; ++i) {		
			let objectId = collection[i];
			
			if(undef(objectId, "objectId", collection))
				return;
			
			let object = this.objects[objectId];
			
			if(undef(object, "object", this.objects))
				return;

			if (object == undefined) {
				// debugger;
				console.log("ну просто хз как так");
				continue;
			}
			objects.push(object);
			
			delete this.objects[objectId];
		}
		
		for(let i = 0; i < objects.length; ++i) {
			let obj = objects[i];
			if (obj == undefined) {
				debugger;
				continue;
			}
			obj.removeFromMap(this.id);
		}
	}
	
};
