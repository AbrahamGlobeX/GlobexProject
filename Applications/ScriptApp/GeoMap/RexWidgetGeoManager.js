/**
 * WidgetGeoMap
 */
class WidgetGeoManager extends Widget {

	createView() {
		//хз надо ли виртуальная вызывается через базовый конструктор super
		this.view = new WidgetGeoManagerHtml(this);
	}

	constructor(state) {
		console.log("Create RexWidgetGeoMap");
		super(state);
	};


	setState(state){
		super.setState(state);//надо ли?
		if (geoManager == null)
			geoManager = new GeoManager(state);
		geoManager.setState(state);
	}

};


