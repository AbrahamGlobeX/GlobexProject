/**
 * WidgetGeoMap::GeoIcon
 */

class GeoIcon extends GeoStyle {
	
	constructor(properties) {
		super(properties.GeoStyle);
		
		let undef = this.getCheckFunction("constructor");
		
		// this.object = undefined;
		
		this.size = {width : undefined, height : undefined};
		this.anchor = {x : undefined, y : undefined};
		this.popupAnchor = {};
		this.tooltipAnchor = {};
		
		let size = properties.size;
		
		if(undef(size, "size", properties))
			return;
		
		let width = size.width;
		
		if(undef(width, "width", size))
			return;
		
		if(width != -1)
			this.size.width = width;
		
		let height = size.height;
		
		if(undef(height, "height", size))
			return;
		
		if(height != -1)
			this.size.height = height;
		
		this.setAnchor("anchor", properties.anchor);
		this.setAnchor("popupAnchor", properties.popupAnchor);
		this.setAnchor("tooltipAnchor", properties.tooltipAnchor);
		
		this.markers = [];
		
		let markerIds = properties.markers;
		
		if(markerIds)
			this.setMarkers(markerIds);
		
		this.options = undefined;
		this.opacity = properties.opacity;//ADD opacity04.07.19 @smag
		// iconUrl:       'marker-icon.png',
		// iconRetinaUrl: 'marker-icon-2x.png',
		// shadowUrl:     'marker-shadow.png',
		// iconSize:    [25, 41],
		// iconAnchor:  [12, 41],
		// popupAnchor: [1, -34],
		// tooltipAnchor: [16, -28],
		// shadowSize:  [41, 41]
	}
	
	setOpacity (opacity) {
		let undef = this.getCheckFunction("setOpacity");

		if (undef(opacity)) return;

		this.object.options.opacity = opacity;
		this.update();
	}

	setAnchor(name, anchor) {
		let undef = this.getCheckFunction("setAnchor");
				
		if(undef(name, "name"))
			return;
		
		if(undef(anchor, "anchor"))
			return;
		
		let x = anchor.x;
		
		if(undef(x, "x", anchor))
			return;
		
		if(x != -1)
			this[name].x = x;
		
		let y = anchor.y;
		
		if(undef(y, "y", anchor))
			return;
		
		if(y != -1)
			this[name].y = y;
	}
	
	init() {
		this.options = this.object.options;
		this.options.iconSize = [this.size.width, this.size.height];
		this.options.iconAnchor = [this.anchor.x, this.anchor.y];
		this.options.popupAnchor = [this.popupAnchor.x, this.popupAnchor.y];
		this.options.tooltipAnchor = [this.tooltipAnchor.x, this.tooltipAnchor.y];
	}
	
	setMarkers(markerIds) {
		let mapObjects = geoManager.objects;
		
		for(let i = 0; i < markerIds.length; ++i) {
			let marker = mapObjects[markerIds[i]];
			
			if(marker == undefined)
				continue;
			
			marker.icon = this;
			
			this.markers.push(marker);
		}
	}
	
	setSize(size) {
		let undef = this.getCheckFunction("setSize");
				
		if(undef(size, "size"))
			return;
		
		let width = size.width;
		
		if(undef(width, "width", size))
			return;
		
		let height = size.height;
		
		if(undef(height, "height", size))
			return;
		
		if(this.width == width)
			if(this.height == height)
				return;
			
		this.width = width;
		this.height = height;
		
		this.options.iconSize = [width, height];
				
		this.update();
	}
	
	setIconAnchor(pos) {
		let undef = this.getCheckFunction("setIconAnchor");
				
		if(undef(pos, "pos"))
			return;
		
		let x = pos.x;
		
		if(undef(x, "x", pos))
			return;
		
		let y = pos.y;
		
		if(undef(y, "y", pos))
			return;
		
		let anchor = this.anchor;
		
		if(anchor.x == x)
			if(anchor.y == y)
				return;
			
		anchor.x = x;
		anchor.y = y;
		
		this.options.iconAnchor = [x, y];
		
		this.update();
	}
	
	setPopupAnchor(pos) {
		let undef = this.getCheckFunction("setPopupAnchor");
				
		if(undef(pos, "pos"))
			return;
		
		let x = pos.x;
		
		if(undef(x, "x", pos))
			return;
		
		let y = pos.y;
		
		if(undef(y, "y", pos))
			return;
		
		let anchor = this.popupAnchor;
		
		if(anchor.x == x)
			if(anchor.y == y)
				return;
			
		anchor.x = x;
		anchor.y = y;
		
		this.options.popupAnchor = [x, y];
		
		this.update();
	}
	
	setTooltipAnchor(pos) {
		let undef = this.getCheckFunction("setTooltipAnchor");
				
		if(undef(pos, "pos"))
			return;
		
		let x = pos.x;
		
		if(undef(x, "x", pos))
			return;
		
		let y = pos.y;
		
		if(undef(y, "y", pos))
			return;
		
		let anchor = this.tooltipAnchor;
		
		if(anchor.x == x)
			if(anchor.y == y)
				return;
			
		anchor.x = x;
		anchor.y = y;
		
		this.options.tooltipAnchor = [x, y];
		
		this.update();
	}
	
	update() {
		let markers = this.markers;
		let object = this.object;
		
		//TODO for new maps
		for(let i = 0; i < markers.length; ++i) {
			let marker = markers[i];
			
			if(marker != undefined) {

				for (let id in marker.maps){
					let leafleat = marker.maps[id];
					leafleat.setIcon(object);
					leafleat.setOpacity(object.options.opacity);

					// leafleat.setOpacity(object.options.opacity);
					
					// if(leafleat.popup != undefined)
					// 	leafleat.popup.update();
				
					// if(marker.tooltip != undefined)
					// 	marker.tooltip.update();
				}
			}
		}
	}
	
	hasMarker(marker) {
		return this.markers.indexOf(marker) > -1;
	}
	
	addMarker(marker) {
		let undef = this.getCheckFunction("addMarker");
		
		if(undef(marker, "marker"))
			return;
		
		if(this.hasMarker(marker))
			return;
		
		this.markers.push(marker);
	}
	
	removeMarker(marker) {
		let undef = this.getCheckFunction("removeMarker");
		
		if(undef(marker, "marker"))
			return;
		
		if(!this.hasMarker(marker))
			return;
		
		let markers = this.markers;
		
		markers.splice(markers.indexOf(marker), 1);
	}
	
};
