/**
 * WidgetGeoMap::GeoMapObject
 */

class GeoMapObjectBaseEvents extends GeoLayerBaseEvents {
	
	constructor(object) {
		super(object);
	}
	
};

class GeoMapObjectEvents extends GeoLayerEvents {
	
	constructor(object) {
		super(object);
	}
};

class GeoMapObject extends GeoLayerObject {

	constructor(properties) {
	// constructor(map, geoObjects, properties) {
		super(properties.GeoLayerObject);

		let undef = this.getCheckFunction("constructor");

		let maps = properties.maps;

		this.maps = {};

		if (maps == undefined){
			console.warn("Maps ", maps);
			return;
		}
		else {
			if (geoManager == null) console.warn("AAAAA MANAGER NULL addObj::MAPOBJECT");
			// for (let mapId in maps) {
			for (let i=0; i<maps.length; ++i)
				this.maps[maps[i]] = undefined;
		}

		// this.object = undefined;
	}

	callObjectsMethod(methodName, ...args) {
		let m = this.maps;

		if (m.length < 1) return;

		// for (int i=0; i<arguments.s);//вырезали указатель на метод

		let method = m[0][methodName];

		for(let key in m)
			method.call(m[key], ...args);//передали оставльные параметры
	}

	fillMaps (objectCreater) {
		for (let mapId in this.maps)
			this.maps[mapId] = objectCreater();
		this.protoObject = objectCreater();
	}

	handleEvent(eventName, event, id) {
		geoManager.maps[id].handleObjectEvent(this.id, eventName, event, id);
	}

	onAddOnMap(map) {
		if (this.maps[map.id] != undefined)
			console.warn("ya yje na karte");
		map.addOnMapLayer(this);
	}

	removeFromMap(mapId) {
		let map = geoManager.maps[mapId];

		if(map == undefined)
			return;

		this.maps[mapId].removeFrom(map.object);
	}
	// removeFromMap() {
	// 	let map = this.maps;
	//
	// 	if(map == undefined)
	// 		return;
	//
	// 	map.object.removeLayer(this.object);
	// }

	onMove() {

	}

	move(offset) {
		let lon = parseFloat(offset.lon);
		let lat = parseFloat(offset.lat);

		if(lon == 0)
			if(lat == 0)
				return;

		this.onMove(lon, lat);
	}

	cloneLayer (layer) {
		let options = this.cloneOptions(layer.options);

		// we need to test for the most specific class first, i.e.
		// Circle before CircleMarker

		// Renderers
		if (layer instanceof L.SVG) {
			return L.svg(options);
		}
		if (layer instanceof L.Canvas) {
			return L.canvas(options);
		}

		// Tile layers
		if (layer instanceof L.TileLayer.WMS) {
			return L.tileLayer.wms(layer._url, options);
		}
		if (layer instanceof L.TileLayer) {
			return L.tileLayer(layer._url, options);
		}
		if (layer instanceof L.ImageOverlay) {
			return L.imageOverlay(layer._url, layer._bounds, options);
		}

		// Marker layers
		if (layer instanceof L.Marker) {
			return L.marker(layer.getLatLng(), options);
		}

		if (layer instanceof L.Circle) {
			return L.circle(layer.getLatLng(), layer.getRadius(), options);
		}
		if (layer instanceof L.CircleMarker) {
			return L.circleMarker(layer.getLatLng(), options);
			// return circle.getLatLng() = layer.getLatLng();
		}

		if (layer instanceof L.Rectangle) {
			let rect = L.rectangle([[1,1],[-1,-1]],options);

			rect.getLatLngs()[0] = this.data;

			rect.getBounds()._northEast = this.maxPoint;
			rect.getBounds()._southWest = this.minPoint;

			return rect;
		}

		if (layer instanceof L.Polygon) {//TODO
			let pol = L.polygon(GeoMapPolygon.polygonGetDefaultJson(), options);

			for (let i=0; i<layer.getLatLngs().length; ++i)
				pol.getLatLngs()[i] = layer.getLatLngs()[i];

			return pol;
		}
		if (layer instanceof L.Polyline) {
			let line = L.polyline(GeoMapLine.lineGetDefaultJson(), options);

			for (let i=0; i<layer.getLatLngs().length; ++i)
				line.getLatLngs()[0] = layer.getLatLngs()[i];

			return line;
		}

		if (layer instanceof L.GeoJSON) {
			return L.geoJson(layer.toGeoJSON(), options);
		}

		if (layer instanceof L.LayerGroup) {
			return L.layerGroup(this.cloneInnerLayers(layer));
		}
		if (layer instanceof L.FeatureGroup) {
			return L.FeatureGroup(this.cloneInnerLayers(layer));
		}
	}

	cloneOptions (options) {
		let ret = {};
		for (let i in options) {
			let item = options[i];

			if (item && item.clone) ret[i] = item.clone();

			else if (item instanceof L.Layer) ret[i] = this.cloneLayer(item);

			else ret[i] = item;
		}
		return ret;
	}

	cloneInnerLayers (layer) {
		let layers = [];
		layer.eachLayer((inner) =>{
			layers.push(this.cloneLayer(inner));
		});
		return layers;
	}

	bringToFront () {
		// debugger;
		for (let id in this.maps){
			let leafObj = this.maps[id];
			leafObj.bringToFront();
		}
	}

	bringToBack () {
		// debugger;
		for (let id in this.maps){
			let leafObj = this.maps[id];
			leafObj.bringToBack();
		}
	}
};
