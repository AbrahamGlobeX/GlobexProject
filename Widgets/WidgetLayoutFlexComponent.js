class WidgetLayoutFlex extends WidgetLayout {

	constructor() {
		super();
		
		this.htmlElement.classList.add("WidgetLayoutFlex");
		this.currentChildren = [];
		
	}

	eventHandler(eventType, eventObject) {

		eventObject.persist();
		console.log('eventHandler', eventType, eventObject.target.value, eventObject.target);
		Module.Store.dispatch({
			'eventName': this.props.widgets[this.id].events[eventType],
			'value': eventObject
		});
	}

	render() {

		const widget = this.props.widgets[this.id];

		let eventAttributes = {};
		
		
		for (let eventName in widget.events) {
			eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
		}
		
		// return (
		// 	// Base LayoutFlex Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetLayoutFlex"
		// 		{...widget.attributes}
		// 		{...eventAttributes}
		// 	>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {


	}
	
	appendChild(child) {
		this.htmlElement.appendChild(child);
		this.currentChildren.push(parseInt(child.id));
		this.scrollPosHorizontal = this.scrollPosHorizontal;
		this.scrollPosVertical = this.scrollPosVertical;

		if (!this.scrollable) {
			let delta = Math.abs(this.htmlElement.scrollHeight - this.htmlElement.clientHeight);
			if (delta !== 0)
				this.htmlElement.style.minHeight = this.htmlElement.clientHeight + delta + 'px';
		} else {
			this.htmlElement.style.minHeight = this._oldMinHeightStyleValue;
		}
	}

	set spacing(value) {
		if (value == null) return;
		if (value < 0) return;

		this._spacing = value;
		this.htmlElement.style.setProperty("--child-spacing", value);
	}

	set maxWidgetHeight(value){
		this._maxWidgetHeight = value;
	}

	get maxWidgetHeight() {
		return this._maxWidgetHeight;
	}

	set maxWidgetWidth(value) {
		this._maxWidgetWidth = value;
	}

	get maxWidgetWidth() {
		return this._maxWidgetWidth;
	}

	set minWidgetHeight(value) {
		this._minWidgetHeight = value;
	}

	get minWidgetHeight() {
		return this._minWidgetHeight;
	}

	set minWidgetWidth(value) {
		this._minWidgetWidth = value;
	}

	get minWidgetWidth() {
		return this._minWidgetWidth;
	}

}
