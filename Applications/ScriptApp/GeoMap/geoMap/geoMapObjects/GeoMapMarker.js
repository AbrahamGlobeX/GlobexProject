/**
 * WidgetGeoMap::GeoMapMarker
 */

class GeoMarkerBaseEvents extends GeoMapObjectBaseEvents {
	
	constructor(object) {
		super(object);
	}
	
	move(event) {
		let object = this.object;
		
		let lon = event.latlng.lng;
		let lat = event.latlng.lat;
		
		if(Rex.compare(object.lon, lon, 1e-9))
			if(Rex.compare(object.lat, lat, 1e-9))
				return undefined;
			
		object.lon = lon;
		object.lat = lat;
		
		return {
			lon : lon,
			lat : lat
		};
	}

};

class GeoMarkerEvents extends GeoMapObjectEvents {
	
	constructor(object) {
		super(object);
		
		this.baseEvents = new GeoMarkerBaseEvents(object);
		
		this.addInitEvents();
	}
	
	onChangePos(eventName) {
		this.addBaseEvent(eventName, "move");
	}

};

class GeoMapMarker extends GeoMapObject {
	
	constructor(properties) {
		super(properties.GeoMapObject);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		let p = properties.position;
		
		if(undef(p, "position", properties))
			return;
		
		if(undef(p.lon, "lon", p))
			return;
		
		if(undef(p.lat, "lat", p))
			return;
		
		this.lon = parseFloat(p.lon);
		this.lat = parseFloat(p.lat);
		
		let draggable = properties.draggable;
		
		if(undef(draggable, "draggable", properties))
			return;

		this.draggable = draggable;

		GeoMapObject.prototype.fillMaps.call(this, () => {
			let marker = L.marker([this.lat, this.lon], {opacity: 1});
			
			marker.options.draggable = draggable;

			return marker;
		});
		
		let iconId = properties.iconId;
		
		if(iconId != undefined) {
			let icon = geoManager.styles[iconId];
			
			if(icon != undefined)
				this.setIcon(iconId);
		}
		
		this.geoEvents = new GeoMarkerEvents(this);
	}
	
	setPos(pos) {
		if(Rex.compare(this.lon, pos.lon, 1e-9))
			if(Rex.compare(this.lat, pos.lat, 1e-9))
				return;
			
		this.lon = parseFloat(pos.lon);
		this.lat = parseFloat(pos.lat);

		for (let id in this.maps)
			this.maps[id].setLatLng({lng: this.lon, lat : this.lat});
	}
	
	setIcon(iconId) {
		let undef = this.getCheckFunction("setIcon");
		
		if(undef(iconId, "iconId"))
			return;
		
		let icon = geoManager.styles[iconId];
		
		if(undef(icon, "icon"))
			return;
		
		if(this.icon == icon)
			return;
		
		let i = this.icon;
		
		this.icon = icon;
		
		if(i != undefined)
			i.removeMarker(this);
		
		if(!icon.hasMarker(this))
			icon.addMarker(this);

		for (let id in this.maps) {
			let leafletEntity = this.maps[id];
			leafletEntity.setIcon(icon.object);
			leafletEntity.setOpacity(icon.object.options.opacity);
			// leafletEntity.setOpacity(icon.object.options.opacity);
		}
	}
	
	removeIcon() {
		if(this.icon == undefined)
			return;
		
		let i = this.icon;
		
		this.icon = undefined;
		
		if(i.hasMarker(this))
			i.removeMarker(this);

		for (let id in this.maps)
			this.maps[id].setIcon(new L.Icon.Default());
	}
	
	setDraggable(draggable) {
		if(this.draggable == draggable)
			return;
		
		this.draggable = draggable;
				
		if(draggable)
			for (let id in this.maps)
				this.maps[id].dragging.enable();
		else
			for (let id in this.maps)
				this.maps[id].dragging.disable();
	}

	onMove(lon, lat) {
		this.setPos({lon : this.lon + lon, lat : this.lat + lat});
	}
	
};