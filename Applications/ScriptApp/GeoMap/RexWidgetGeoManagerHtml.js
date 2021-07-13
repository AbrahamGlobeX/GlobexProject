/**
 * WidgetGeoMap
 */

class WidgetGeoManagerHtml extends WidgetViewHtml {

	constructor(widget) {
		//console.log("Create GeoManager");

		super(widget);

		this.addClassName("WidgetGeoManager");


		this.createDomElement("div");

		this.htmlElement.style.display = "none";
	};

};
