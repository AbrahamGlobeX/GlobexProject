/**
 * WidgetGeoMap::GeoObject
 */

class GeoBaseEvents {
	
	constructor(object) {
		this.object = object;
	}
	
};

class GeoEvents {
	
	constructor(object) {
		this.checker = new GeoMapChecker(this);
		this.object = object;
		this.addedEvents = [];
	}
	
	getCheckFunction(method) {
		return this.checker.getUndefinedTestFunction(method, this);
	}
	
	add(name) {
		debugger;
		let undef = this.getCheckFunction("add");
		if(undef(name, "name"))
			return;
		
		if(this.has(name))
			return;
		
		if(undef(this[name], "function " + name, this))
			return;

		this.object.on('click', function(){
			console.log("assad");
		})

		// if (obj == undefined)//CHANGE
		//this[name](name);
		// else
		// 	this[name](name, leafGeom);
	}

	addExistObj (name, leafObj) {
		let undef = this.getCheckFunction("add");

		if(undef(name, "name"))
			return;

		this[name](name, leafObj);
	}

	has(eventName) {
		return this.addedEvents.indexOf(eventName) > -1;
	}
	
	addInitEvents() {
		let undef = this.getCheckFunction("addInitEvents");
		
		let events = this.object.initEvents;
		
		if(undef(events, "events"))
			return;
		
		for(let i = 0; i < events.length; ++i)
			this.add(events[i]);
	}

	addEventsToExistObj (leafObj) {
		let undef = this.getCheckFunction("addInitEvents");

		let events = this.object.initEvents;

		if(undef(events, "events"))
			return;

		for(let i = 0; i < events.length; ++i)
			this.addExistObj(events[i], leafObj);
	}
};

class GeoObject {
	
	constructor(properties) {
		this.checker = new GeoMapChecker(this);
		this.id = undefined;
		this.events = undefined;
		this.initEvents = undefined;
		
		let undef = this.getCheckFunction("constructor");
		
		if(undef(properties, "properties"))
			return;
		
		let id = properties.id;
		
		if(undef(id, "id", properties))
			return;
		
		this.id = id;
		
		let events = properties.events;
		
		if(undef(events, "events", properties))
			return;
		
		this.initEvents = events;
	}
	
	getCheckFunction(method) {
		return this.checker.getUndefinedTestFunction(method, this);
	}
	
	addEvent(name) {
		let undef = this.getCheckFunction("addEvent");
		
		let events = this.events;
		
		if(undef(events, "events", this))
			return;
		
		events.add(name);
	}
	
	addInitEvents() {
		let undef = this.getCheckFunction("addInitEvents");
		
		let events = this.initEvents;
		
		if(undef(events, "initEvents", this))
			return;
		
		for(let i = 0; i < events.length; ++i)
			addEvent(events[i]);
	}
	
};
