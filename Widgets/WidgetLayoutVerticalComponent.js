class WidgetLayoutVertical extends WidgetLayout {

	constructor() {
		super();
		
		this.addClassName("WidgetLayoutVertical");

		this._childrenAlignType = null;
		this._childrenHorizontalAlignType = 0;
		this._childrenVerticalAlignType = 0;

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
		// 	// Base LayoutVertical Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetLayoutVertical"
		// 		{...widget.attributes}
		// 		{...eventAttributes}
		// 	>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {


	}
	

	appendChild(child) {
		super.appendChild(child);
	}

	set spacing(value) {
		if (value == null) return;
		if (value < 0) return;

		this._spacing = value;

		for (let i = 0; i < this.htmlElement.children.length - 1; ++i) {
			const child = this.htmlElement.children[i];
			if (child == null) continue;
			child.style.marginBottom = value + "px";
		}

		if (this.htmlElement.children.length > 1) {
			let lastChild = this.htmlElement.children[this.htmlElement.children.length - 1];
			if (lastChild != null)
				lastChild.style.marginBottom = null;
		}
	}

	controlChildrenHorizontalAlignType(alignmentType) {
		if (!alignmentType)
			return;

		if (alignmentType === 0) //none = left
			alignmentType = 1;

		this._childrenHorizontalAlignType = alignmentType;

		if (alignmentType === 1)
			this.htmlElement.style.alignItems = "flex-start";
		else if (alignmentType === 2)
			this.htmlElement.style.alignItems = "center";
		else if (alignmentType === 3)
			this.htmlElement.style.alignItems = "flex-end";

	}

	controlChildrenVerticalAlignType(alignmentType) {
		if (!alignmentType)
			return;

		this._childrenVerticalAlignType = alignmentType;

		if (this.hasScroll()) {
			this.htmlElement.style.justifyContent = "";
			return;
		}

		if (alignmentType === 0)
			this.htmlElement.style.justifyContent = "";
		else if (alignmentType === 1)
			this.htmlElement.style.justifyContent = "flex-start";
		else if (alignmentType === 2)
			this.htmlElement.style.justifyContent = "center";
		else if (alignmentType === 3)
			this.htmlElement.style.justifyContent = "flex-end";
	}

	hasScroll() {
		return Math.abs(this.htmlElement.scrollHeight - this.htmlElement.clientHeight) !== 0;
	}


}
