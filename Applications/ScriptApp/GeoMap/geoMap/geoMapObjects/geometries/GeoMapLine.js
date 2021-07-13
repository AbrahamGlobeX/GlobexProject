/**
 * WidgetGeoMap::GeoMapLine
 */

class GeoMapLine extends GeoMapGeometry {
	
	constructor(properties) {
		super(properties.GeoMapGeometry);

		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		let arrowEnabled = properties.arrow;
		
		if(undef(arrowEnabled, "arrow", properties))
			return;
		
		this.arrowEnabled = arrowEnabled;
		
		let arrowSize = properties.arrowSize;
		
		if(undef(arrowSize, "arrowSize", properties))
			return;
		
		this.arrowSize = arrowSize;
		
		let l = properties.line;
		
		if(l == undefined)
			l = [];
		
		this.data = GeoMapLine.lineToGeoJson(l);

		GeoMapObject.prototype.fillMaps.call(this, () => {
			let line = L.polyline(GeoMapLine.lineGetDefaultJson());

			for (let i=0; i<this.data.length; ++i)
				line.getLatLngs()[i] = this.data[i];

			return line;
		});

		if(properties.styleId != undefined)
			this.style = geoManager.styles[properties.styleId];

		if(properties.textId != undefined) {
			let text = geoManager.styles[properties.textId];
			
			if(text != undefined) {
				text.addLine(this);
				this.text = text;
			}
		}
		
		this.init();
		
		this.arrow = undefined;
		this.arrowOptions = undefined;
		
		if(arrowEnabled) {
			this.createArrow();
			this.arrow.addTo(this.map.object);
		}
		
	}



	// init(objectMaker) {
	// 	for(var key in this.maps) {
	// 		this.maps[key] = objectMaker();
	// 	}
	// }
	// init(){
	// 	for (var id in this.maps){
	// 		geoManager.maps[id]
	// 	}
	// }

	getDefaultStyle() {
		return GeoLineStyle.getDefaultStyle();
	}
	
	setStyle(styleId) {
		if(!super.setStyle(styleId))
			return false;
		
		if(!this.arrowEnabled)
			return true;
		
		if(this.arrow == undefined) 
			this.createArrow();
		else
			this.updateArrowStyle();
		
		return true;
	}
	
	createArrow() {
		let arrowOptions = {
				pixelSize: this.arrowSize,
				polygon: false,
				pathOptions: {stroke: true}
			};
			
		let pattern = {
			offset: "100%",
			repeat: 0,
			symbol: L.Symbol.arrowHead(arrowOptions)
		};
		
		this.arrowOptions = pattern.symbol.options;

		for (let id in this.maps) {

			let leafObj = this.maps[id];

			this.arrow = L.polylineDecorator(leafObj, {patterns: [pattern]});

			this.arrow.addTo(geoManager.maps[id].map);
		}
	}
	
	addArrowOnMap() {
		if(this.arrow == undefined)
			return;
		
		let map = this.map;
		
		if(map != undefined)
			this.arrow.addTo(map.object);
	}
	
	removeArrowFromMap() {
		if(this.arrow == undefined)
			return;
		
		let map = this.map;
		
		if(map != undefined)
			map.object.removeLayer(this.arrow);
	}
	
	updateArrowSize() {
		this.arrowOptions.pixelSize = this.arrowSize;
			
		this.arrow.setPatterns(this.arrow.options.patterns);
	}
	
	updateArrowStyle() {
		this.arrowOptions.pathOptions =  this.object.options;
		
		this.arrowOptions.pathOptions['stroke']  = true;
			
		this.arrow.setPatterns(this.arrow.options.patterns);
	}
	
	setArrowEnabled(arrowEnabled) {
		console.log("setArrowEnabled::", arrowEnabled);
		let undef = this.getCheckFunction("setArrowEnabled");
		
		if(undef(arrowEnabled, "arrowEnabled"))
			return;
		
		if(this.arrowEnabled == arrowEnabled)
			return;
		
		this.arrowEnabled = arrowEnabled;
		
		if(this.arrowEnabled)
			if(this.arrow == undefined) 
				this.createArrow();
			else {
				this.updateArrowStyle();
				this.updateArrowSize();
				this.addArrowOnMap();
			}
		else
			if(this.arrow != undefined)
				this.removeArrowFromMap();
	}

	setArrowSize(arrowSize) {
		let undef = this.getCheckFunction("setArrowSize");
		
		if(undef(arrowSize, "arrowSize"))
			return;
		
		if(this.arrowSize == arrowSize)
			return;
		
		this.arrowSize = arrowSize;
		
		this.updateArrowSize();
	}
	
	// removeFromMap() {
	// 	super.removeFromMap();
	//
	// 	let map = this.map;
	//
	// 	if(map == undefined)
	// 		return;
	//
	// 	map.object.removeLayer(this.object);
	//
	// 	if(this.arrow != undefined)
	// 		map.object.removeLayer(this.arrow);
	// }
	
	static lineToGeoJson(line) {
		if(line == undefined)
			return undefined;
		
		return [GeoMapGeometry.pathToGeoJson(line)];
	}

	static lineGetDefaultJson () {
		return [GeoMapGeometry.pathGetDefaultJson()];
	}

	onMove(lon, lat) {

		//console.log("onMove:move",lon,lat);
		//console.log("onMove:coor",this.data[0][0].lng,this.data[0][0].lat);

		// let lines = this.object.getLatLngs();
		let arrLines = this.data;
		for(let i = 0; i < arrLines.length; ++i) {
			let line = arrLines[i];
			
			for(let j = 0; j < line.length; ++j) {
				let pos = line[j];
				pos.lng += lon;
				pos.lat += lat;
			}
		}
		
		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	addPoint(pos) {
		let undef = this.getCheckFunction("addPoint");
		
		if(undef(pos, "pos"))
			return;
		
		let lon = pos.lon;
		
		if(undef(lon, "lon", pos))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;

		// this.data[0].push({lng : parseFloat(lon), lat : parseFloat(lat)});//надо прям latlng

		this.data[0].push(L.latLng(lat,lon));

		for (let id in this.maps) {
			this.maps[id].redraw();
		}
	}
	
	setPoint(point) {
		let undef = this.getCheckFunction("setPoint");
		
		if(undef(point, "point"))
			return;
		
		let id = point.id;
		
		if(undef(id, "id", point))
			return;
		
		let pos = point.pos;

		if(undef(pos, "pos", point))
			return;
		
		let lon = pos.lon;
				
		if(undef(lon, "lon", pos))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;
		
		let line = this.data[0];
		
		if(id >= line.length || id < 0)
			if(undef("Point id is out of range"))
				return;
		
		line[id].lng = parseFloat(lon);
		line[id].lat = parseFloat(lat);

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	removePoint(index) {
		let line = this.data[0];
		
		if(index >= line.length || index < 0)
			if(undef("Point index is out of range"))
				return;
		
		line.splice(index, 1);

		for (let id in this.maps)
			this.maps[id].redraw();
	}

	insertPoint (point){
		let index = parseInt(point.id);
		if (index == undefined) console.error("insertPoint index undefined");

		let pos = point.pos;
		if (pos == undefined) console.error("insertPoint pos undefined");

		let line = this.data[0];

		if (index > line.length || index < 0)
			console.error("insertPolygon: Point index out of range");

		let latLngPoint = L.latLng(pos);

		line.splice(index,0,latLngPoint);

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	setLine(line) {
		if(undef(line, "line"))
			return;
		
		let data = this.lineToGeoJson(line);
		
		this.object.setLatLngs(data);
	}
	
	setText(textId) {
		let undef = this.getCheckFunction("setText");
		
		if(undef(textId, "textId"))
			return;
		
		let text = geoManager.styles[textId];
		
		// if(undef(text, "text", this.geoObjects.styles))
		// 	return;
		
		let t = this.text;
		
		if(t == text)
			return;
		
		if(t != undefined)
			t.removeLine(this);
			
		this.text = text;
		
		text.addLine(this);
	}
	
	removeText() {
		 let t = this.text;
		
		if(t == "")
			return;
		
		t.removeLine(this);
		
		this.object.setText("");
	}
	
};
