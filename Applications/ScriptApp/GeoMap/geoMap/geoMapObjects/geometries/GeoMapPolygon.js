/**
 * WidgetGeoMap::GeoMapPolygon
 */

class GeoMapPolygon extends GeoMapGeometry {
	
	constructor(properties) {
		super(properties.GeoMapGeometry);
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;

		this.data = [[]];

		if(properties.polygon != undefined)
			this.data = GeoMapPolygon.polygonToGeoJson(properties.polygon);

		GeoMapObject.prototype.fillMaps.call(this, () => {//TODO зачем по разному
			// let pol = L.polygon.apply(L, GeoMapPolygon.polygonGetDefaultJson());
			let pol = L.polygon(GeoMapPolygon.polygonGetDefaultJson());

			for (let i=0; i<this.data.length; ++i)
				pol.getLatLngs()[i] = this.data[i];

			return pol;
		});

		if(properties.styleId != undefined)
			this.style = geoManager.styles[properties.styleId];
		
		this.init();
	}
	
	getDefaultStyle() {
		return GeoPolygonStyle.getDefaultStyle();
	}
	
	static polygonToGeoJson(multiPolygon) {
		// let undef = this.getCheckFunction("polygonToGeoJson");
		
		// if(undef(multiPolygon, "multiPolygon"))
		// 	return undefined;
		
		let ret = [];

		for(let i = 0; i < multiPolygon.length; ++i) {
			let polygon = GeoMapGeometry.pathToGeoJson(multiPolygon[i]);

			polygon.push(polygon[0]);
			
			ret.push(polygon);
		}
		
		return ret;
	}

	static polygonGetDefaultJson () {
		return [GeoMapGeometry.pathGetDefaultJson()];
	}
	
	addPoint(lonLat) {
		let undef = this.getCheckFunction("addPoint");
		
		if(undef(lonLat, "lonLat"))
			return;
		
		let lon = lonLat.lon;
		
		if(undef(lon, "lon", lonLat))
			return;
		
		let lat = lonLat.lat;
		
		if(undef(lat, "lat", lonLat))
			return;

		let dlina = this.data[0].length;
		// if (dlina < 2)
		// 	console.log("OPA !!!!", this.data[0]);

		if (dlina == 0) {
			this.data[0].push(L.latLng(lat,lon));
			this.data[0].push(this.data[0][0]);
			// this.data[0][1] = this.data[0][0];
			// this.data[0][1].lng = this.data[0][0].lng;
		}
		else this.data[0].splice(dlina-1,0,L.latLng(lat,lon));
		// this.maps[0].addLatLng({lng : lon, lat : lat});

		for (let id in this.maps)
			this.maps[id].redraw();
		// for (let i=1; i<Object.keys(this.maps).length; ++i)
		// 	this.maps[i].redraw();
	}
	
	setPoint(point) {console.log("setPoint", point);
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

		let polygon = this.data[0];

		if(id >= polygon.length || id < 0)
			if(undef("Point id is out of range"))
				return;

		polygon[id].lng = parseFloat(lon);
		polygon[id].lat = parseFloat(lat);

		for (let id in this.maps){
			this.maps[id].redraw();
		}
	}
	
	setInnerPoint(innerPoint) {
		let undef = this.getCheckFunction("setInnerPoint");
		
		if(undef(innerPoint, "innerPoint"))
			return;
		
		let innerId = innerPoint.innerId;
		
		if(undef(innerId, "innerId"))
			return;
		
		let point = innerPoint.point;
		
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
		
		// let polygons = this.object.getLatLngs();
		let polygons = this.data;

		innerId++;
		
		if(innerId < 1 || innerId >= polygons.length) {
			undef("Inner id is out of range");
			return;
		}
		
		let inner = polygons[innerId];
		
		if(id >= inner.length || id < 0) {
			undef("Point id is out of range");
			return;
		}
		
		inner[id].lng = parseFloat(lon);
		inner[id].lat = parseFloat(lat);
		
		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	addInnerPoint(innerPoint) {
		let undef = this.getCheckFunction("addInnerPoint");
		
		if(undef(innerPoint, "innerPoint"))
			return;
		
		let innerId = innerPoint.innerId;
		
		if(undef(innerId, "innerId", innerPoint))
			return;
		
		let pos = innerPoint.pos;

		if(undef(pos, "pos", innerPoint))
			return;
		
		let lon = pos.lon;
		
		if(undef(lon, "lon", pos))
			return;
		
		let lat = pos.lat;
		
		if(undef(lat, "lat", pos))
			return;
		
		let polygons = this.maps[0].getLatLngs();

		if(innerId < 0) {
			undef("Bad inner id " + innerId);
			return;
		}
		
		let size = polygons.length - 1;
		
		if(innerId > size)
			undef((innerId - size) + " empty inners will be generated.");
		
		for(let i = size; i <= innerId; ++i)
			polygons.push([]);
		
		let inner = polygons[innerId + 1];
		
		inner.push({lon : lon, lat : lat});//TODO ЗАЧЕМ lon если lng???

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	addInnerPolygon(inner) {
		let undef = this.getCheckFunction("addInnerPolygon");
	
		if(undef(inner, "inner"))
			return;
		
		if(!Array.isArray(inner)) {
			undef("inner is not array : " + inner);
			return;
		}

		// let polygons = this.maps[0].getLatLngs();

		for(let i = 0; i < inner.length; ++i) {
			inner[i] = L.latLng({lng: inner[i].lon, lat: inner[i].lat});
		}

		// polygons.push(inner);

		// this.maps[0].redraw();

		if(Object.keys(this.maps).length == 0) {
			let polygons = this.protoObject.getLatLngs();
			polygons.push(inner);
		}

		for (let i=0; i<Object.keys(this.maps).length; ++i){
			polygons = this.maps[i].getLatLngs();
			polygons.push(inner);
			this.maps[i].redraw();
		}
	}

	onMove(lon, lat) {
		let polygons = this.data;
		for(let i = 0; i < polygons.length; ++i) {
			let polygon = polygons[i];
			
			for(let j = 0; j < polygon.length-1; ++j) {
				let pos = polygon[j];
				pos.lng += lon;
				pos.lat += lat;
			}
		}

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	setPolygon(polygon) {//console.log("setPolygon", polygon);
		if(undef(polygon, "polygon"))
			return;
		
		let data = GeoMapPolygon.polygonToGeoJson(polygon);
		
		this.maps[0].setLatLngs(data);

		for (let i=1; i<Object.keys(this.maps).length; ++i)
			this.maps[i].redraw();
	}
	
	setOuter(outer) {//console.log("setOuter", outer);
		let undef = this.getCheckFunction("setOuter");
		
		if(undef(outer, "outer"))
			return;
		
		if(!Array.isArray(outer)) {
			undef("outer is not array : " + outer);
			return;
		}
		
		let polygons = this.data;//.getLatLngs();
				
		for(let i = 0; i < outer.length; ++i)
			outer[i] = L.latLng({lng : outer[i].lon, lat: outer[i].lat});
				
		polygons[0] = outer;

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	setInner(innerInfo) {
		let undef = this.getCheckFunction("setInner");
		
		if(undef(innerInfo, "innerInfo"))
			return;
		
		let id = innerInfo.id;
		
		if(undef(id, "id", innerInfo))
			return;
		
		let inner = innerInfo.inner;
		
		if(undef(inner, "inner", innerInfo))
			return;
		
		if(!Array.isArray(inner)) {
			undef("inner is not array : " + inner);
			return;
		}
		
		id++;
		
		let polygons = this.data;//this.object.getLatLngs();
		
		if(id < 1 || id >= polygons.length) {
			undef("Inner id is out of range");
			return;
		}
				
		for(let i = 0; i < inner.length; ++i)
			inner[i] = L.latLng({lng : inner[i].lon, lat: inner[i].lat});
				
		polygons[id] = inner;

		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
	removePoint(index) {
		// let polygon = this.object.getLatLngs()[0];
		let polygon = this.data[0];

		if(index >= polygon.length || index < 0)
			if(undef("Point index is out of range"))
				return;


		// this.object.getLatLngs()[0].splice(index, 1);

		if (index == 0) {
			polygon.splice(0,1);
			polygon[polygon.length-1] = polygon[0];
		}
		else polygon.splice(index, 1)

		for (let id in this.maps)
			this.maps[id].redraw();
	}

	insertPoint (point){

		let index = parseInt(point.id);
		if (index == undefined) console.error("insertPoint index undefined");

		let pos = point.pos;
		if (pos == undefined) console.error("insertPoint pos undefined");

		let polygon = this.data[0];

		if (index >= polygon.length || index < 0)
			console.error("insertPolygon: Point index out of range");

		let latLngPoint = L.latLng(pos);

		// console.log("polygon", polygon);
		if (index == 0) {// || index == polygon.length-1){
			//swap data
			let oldPoint = polygon[0];
			polygon[0] = latLngPoint;
			polygon[polygon.length-1] = latLngPoint;
			// if (index == 0)
			polygon.splice(1,0,oldPoint);
			// else polygon.splice(index,0,oldPoint);
		}
		else polygon.splice(index,0,latLngPoint);

		// console.log("polygon2", polygon);
		for (let id in this.maps)
			this.maps[id].redraw();
	}
	
};
