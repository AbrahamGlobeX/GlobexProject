/**
 * GeoMapProviderLayers
 */

class GeoMapProviderLayers {
	
	constructor() {
		this.checker = new GeoMapChecker(this);
	}
	
	getCheckFunction(method) {
		return this.checker.getUndefinedTestFunction(method);
	}
	
	checkParameters(parameters) {
		if (parameters != undefined)
			if(Object.keys(parameters).length > 0)
				return true;
	}
	
	createLayer(providerName, parameters) {
		let undef = this.getCheckFunction("createLayer");

		if(undef(providerName, "provider name"))
			return;

		let createFunctionName = "create" + providerName + "Layer";

		let createFunction = this[createFunctionName];

		if(undef(createFunction, "'" + createFunctionName + "' function", this))
			return;

		return createFunction.call(this, parameters);
	}

	createOpenStreetMapLayer(layerParameters) {
		let undef = this.getCheckFunction("createOpenStreetMapLayer");
		
		let parameters = {};
		
		let url = "";
		
		if(this.checkParameters(layerParameters)) {
			parameters = layerParameters;
			
			url = parameters['url'];
			
			delete parameters['url'];
		} else {
			url = "http:\/\/{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
			
			parameters['attribution'] = "Map data © OpenStreetMap contributors";
			
			parameters['minZoom'] = 0;
			parameters['maxZoom'] = 25;
			
			parameters['minNativeZoom'] = parameters['minZoom'];
			parameters['maxNativeZoom'] = 19;//parameters['maxZoom'];
		}
		
		return L.tileLayer(url, parameters);
	}
	
	createYandexMapLayer(layerParameters) {
		let undef = this.getCheckFunction("createYandexMapLayer");
		
		let parameters = {};
		
		let url = "";
		
		if(this.checkParameters(layerParameters)) {
			parameters = layerParameters;
			
			url = parameters['url'];
			
			delete parameters['url'];
		} else {
			url = "http:\/\/vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2";
			
			parameters['attribution'] = "<a http='yandex.ru' target='_blank'>Yandex</a>";
			
			parameters['subdomains'] = ["01", "02", "03", "04"];
		}
		
		return L.tileLayer(url, parameters);
	}
	
	createGoogleMapLayer(layerParameters) {
		let undef = this.getCheckFunction("createGoogleMapLayer");
		
		let parameters = {};
		
		if(this.checkParameters(layerParameters))
			parameters = layerParameters;
		else
			parameters['type'] = "hybrid";
		
		return L.gridLayer.googleMutant(parameters);
	}
	
	createGlobeXYMapLayer(layerParameters) {
		
		let parameters = {};
		
		let url = "";
		
		if(this.checkParameters(layerParameters)) {

			parameters = layerParameters;
			
			url = parameters['url'];
			
			delete parameters['url'];

		} else {
			
			// url = "http://192.168.10.65:9090/?x={x}&y={y}&z={z}&layer=main";
			url = "https://img0{s}.0070.ru/?x={x}&y={y}&z={z}&layer=main"
			
			parameters['attribution'] = "Map data ©2019 GlobeXY";
			
			parameters['minZoom'] = 0;
			parameters['maxZoom'] = 25;
			
			parameters['minNativeZoom'] = parameters['minZoom'];
			parameters['maxNativeZoom'] = parameters['maxZoom'];

			parameters['subdomains'] = ["1", "2", "3", "4"];
		}
		
		return L.tileLayer(url, parameters);
	}

	
};
