/**
 * WidgetGeoMap
 */
 
class WidgetGeoMapHtml extends WidgetViewHtml {
	
	constructor(widget) {
		console.log("Create GeoMapHTML");

		super(widget);
		this.addClassName("WidgetGeoMap");
		this.createDomElement("div");
		this.htmlElement.style.backgroundColor = "rgb(1,0,0) !important";
		new ResizeObserver(this.onResize.bind(this)).observe(this.htmlElement);
	};
	
	onDestroy() {
		console.log("DESTROY",this);
		this.widget.destroy();
	}

	onResize() {
		this.widget.onResize();
	}

};
