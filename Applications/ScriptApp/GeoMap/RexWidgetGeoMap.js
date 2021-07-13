/**
 * WidgetGeoMap
 */
var counter = 0;
class WidgetGeoMap extends Widget {

	constructor(state) {

		super(state);

		this.geoMapState = state.geoMap;
		
		this.setState(state);
	};

	createView() {
		//виртуальная вызывается через базовый конструктор super
		this.view = new WidgetGeoMapHtml(this);
	}

	onInit() {
		this.geoMapInit(this.geoMapState);
		window.dispatchEvent(new Event('resize'));
	}

	geoMapInit(state) {

		this.map = new GeoMap(this, state, this.view.htmlElement);
		console.log("SSSSSSSSSS",this);

		if (geoManager == null)
			geoManager = new GeoManager ();

		let objectIds = state.init.ObjectIds;

		if (objectIds != undefined)
			for (let i=0; i<objectIds.length; ++i)
				this.map.addObjectToMap(objectIds[i]);
		// this.map.addObjectToMap(geoManager.objects[objectIds[i]]);

		geoManager.maps[this.map.id] = this.map;

		this.map.init(state);
	}

	destroy() {
		if(this.map != undefined)
			this.map.clear();
	}

	geoMapSetInteractive(editable) {
		if(editable != undefined)
			this.map.setInteractive(editable);
	}

	addObjectToMap (property){
		// //console.log("this.map",this.map);
		this.map.addObjectToMap(property.objId);
	}

	handleGeoMapEvent(event) {
		//console.log(event);
		let eventString = JSON.stringify(event);
		
		Rex.callRpcMethod("Widgets", this.id, this.type, "handleGeoMapEvent", [eventString]);
	}

	setState(state) {
		//console.log("set state WidgetGeoMap", state);
		super.setState(state);
		
		if(this.map != undefined) {
			this.map.setState(state.geoMap);
			
			if(state.visible != undefined)
				this.map.setVisible(state.visible);
			
			if(state.editable != undefined)
				this.map.setInteractive(!state.editable);
		}
		if(state.ManagerId != null) {
			Rex.widgets[state.ManagerId]
		}
	}
	
	setVisible(v) {
		if(this.map != undefined)
			this.map.setVisible(v);
		super.setVisible(v);
	}

	onResize() {
		if(this.map != undefined)
			this.map.invalidateSize();
	}
	
};


