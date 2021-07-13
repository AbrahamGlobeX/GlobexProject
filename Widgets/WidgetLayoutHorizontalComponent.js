class WidgetLayoutHorizontal extends WidgetLayout {

	constructor() {
		super();
		this.ratioX = 0;
		this.ratioY = 0;

		this.space = 0;

		this.htmlElement.classList.add("WidgetLayoutHorizontal");

		this._childrenAlignType = null;

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
		// 	// Base LayoutHorizontal Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetLayoutHorizontal"
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

		this.controlChildrenHorizontalAlignType(this._childrenHorizontalAlignType);
		this.controlChildrenVerticalAlignType(this._childrenVerticalAlignType);
	}

	set spacing(value) {
		if (value == null) return;
		if (value < 0) return;

		this._spacing = value;

		for (let i = 0; i < this.htmlElement.children.length - 1; ++i) {
			const child = this.htmlElement.children[i];
			if (child == null) continue;
			child.style.marginRight = value + "px";
		}

		if (this.htmlElement.children.length > 1) {
			let lastChild = this.htmlElement.children[this.htmlElement.children.length - 1];
			if (lastChild != null)
				lastChild.style.marginRight = null;
		}

	}

	controlChildrenHorizontalAlignType(alignmentType) {
		if (!alignmentType)
			return;

		this._childrenHorizontalAlignType = alignmentType;

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

	controlChildrenVerticalAlignType(alignmentType) {
		if (!alignmentType)
			return;

		if (alignmentType === 0) //none = top
			alignmentType = 1;

		this._childrenVerticalAlignType = alignmentType;

		if (alignmentType === 1)
			this.htmlElement.style.alignItems = "flex-start";
		else if (alignmentType === 2)
			this.htmlElement.style.alignItems = "center";
		else if (alignmentType === 3)
			this.htmlElement.style.alignItems = "flex-end";
	}

	hasScroll() {
		return Math.abs(this.htmlElement.scrollWidth - this.htmlElement.clientWidth) !== 0;
	}


}
