/**
 * GeoMap ProviderControls
 */

class GeoMapProviderControls {
	
	constructor() {
		this.checker = new GeoMapChecker(this);
	}
	
	getCheckFunction(method) {
		return this.checker.getUndefinedTestFunction(method);
	}
	
	createProviderControl(providerName, controlName) {
		let undef = this.getCheckFunction("createProviderControl");

		if(undef(providerName, "provider name"))
			return;

		let createFunctionName = "create" + providerName + "Control";

		let createFunction = this[createFunctionName];

		if(undef(createFunction, "\'" + createFunctionName + "\" function", this))
			return;

		return createFunction.call(this, controlName);
	}
	
	createControl(providerName, controlName) {
		let control = this.createProviderControl(providerName, controlName);
		return control;
	}
	
	createOpenStreetMapControl(controlName) {
		let undef = this.getCheckFunction("createOpenStreetMapControl");
		
		let name = controlName;
		
		if (name == undefined)
			name = "OSMGeocoder";
		
		let control;
		
		switch (name) {
			case "OSMGeocoder":
				control = new L.Control.OSMGeocoder();
				break;
			default:
				if(undef(undefined, "control name \'" + controlName + "\'", "createOpenStreetMapControl"))
					return undefined;
		}
	}
	
};