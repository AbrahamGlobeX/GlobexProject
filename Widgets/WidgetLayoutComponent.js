class WidgetLayout extends BaseWidget {

	constructor() {
		super();

		// this.createDomElement("div");
	}

	onCreate() {
		this.htmlElement.classList.add("WidgetLayout");
		window.addEventListener("resize", (event) => {
			if (this.parentId != -1) return;
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		});

		try {
			new ResizeObserver(this.observeScrollable.bind(this)).observe(this.htmlElement);
		}
		catch (e) {
		}

		this.htmlElement.children.indexOf = function (child) {
			if (child == null) return -1;
			for (let i = 0; i < this.length; ++i)
				if (child === this[i]) return i;
			return -1;
		};

		this.htmlElement.addEventListener("scroll", function (event) {
			const maxScrollPosV = this.htmlElement.scrollHeight - this.htmlElement.clientHeight;
			// if (this.htmlElement.scrollTop !== maxScrollPosV)
			// 	Rex.callRpcMethod("Widgets", this.id, this.type, "setScrollPosVertical", [this.htmlElement.scrollTop / maxScrollPosV, false]);

			const maxScrollPosH = this.htmlElement.scrollWidth - this.htmlElement.clientWidth;
			// if (this.htmlElement.scrollLeft !== maxScrollPosH)
			// 	Rex.callRpcMethod("Widgets", this.id, this.type, "setScrollPosHorizontal", [this.htmlElement.scrollLeft / maxScrollPosH, false]);
		}.bind(this));

		this._hoveredWidget = null;

		this.offsetData =
		{
			id: this.id,
			type: this.getLayoutType(),
			children: []
		};
		this.minContentWidth = 0;
		this.minContentHeight = 0;
		this.baseLayoutOrientation = 0;
		// this.setState(state);
		this._widgetOrder = [];
		this._direction = 0;

		this._scrollPosV = null;
		this._scrollPosH = null;
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
		// 	// Base Layout Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetLayout"
		// 		{...widget.attributes}
		// 		{...eventAttributes}
		// 	>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {

		// this._scrollPosV = null;
		// this._scrollPosH = null;
		// this.minContentWidth = 0;
		// this.minContentHeight = 0;
		// this.baseLayoutOrientation = 0;
		// this._widgetOrder = [];
		// this._direction = 0;

		// window.addEventListener("resize", (event) => {
		// 	if (this.parentId != -1) return;
		// 	this.width = window.innerWidth;
		// 	this.height = window.innerHeight;
		// });

		// try {
		// 	new ResizeObserver(this.observeScrollable.bind(this)).observe(this.htmlElement);
		// }
		// catch (e) {
		// }

		// this.htmlElement.children.indexOf = function (child) {
		// 	if (child == null) return -1;
		// 	for (let i = 0; i < this.length; ++i)
		// 		if (child === this[i]) return i;
		// 	return -1;
		// };

		// this.htmlElement.addEventListener("scroll", function (event) {
		// 	const maxScrollPosV = this.htmlElement.scrollHeight - this.htmlElement.clientHeight;
		// 	// if (this.htmlElement.scrollTop !== maxScrollPosV)
		// 	// 	Rex.callRpcMethod("Widgets", this.id, this.type, "setScrollPosVertical", [this.htmlElement.scrollTop / maxScrollPosV, false]);

		// 	const maxScrollPosH = this.htmlElement.scrollWidth - this.htmlElement.clientWidth;
		// 	// if (this.htmlElement.scrollLeft !== maxScrollPosH)
		// 	// 	Rex.callRpcMethod("Widgets", this.id, this.type, "setScrollPosHorizontal", [this.htmlElement.scrollLeft / maxScrollPosH, false]);
		// }.bind(this));

		// this._hoveredWidget = null;

		// this.offsetData =
		// {
		// 	id: this.id,
		// 	type: this.getLayoutType(),
		// 	children: []
		// };
	}
	
	set direction(value) {
		this._direction = value
	}

	get direction() {
		return this._direction;
	}

	set scrollable(value) {
		if (value == null) return;
		this._scrollable = value;
		this.setScrollable();
	}

	get scrollable() {
		return this._scrollable;
	}

	onMouseDown(x, y, event) {
		if (this.editMode) {
			if (this._swapWidgetA != null) return;
			if (this._hoveredWidget !== this && this._hoveredWidget != null) {
				this._swapWidgetA = this._hoveredWidget;
			}
		}
	}

	onMouseUp(x, y, event) {
		if (this.editMode) {
			if (this._swapWidgetA == null) return;

			if (event.shiftKey === true) {
				if ((this._swapWidgetA !== this._hoveredWidget)
					&& (this._hoveredWidget !== this) && (this._hoveredWidget != null)) {
					this._swapWidgetB = this._hoveredWidget;
					this.swapWidgets(this._swapWidgetA.id, this._swapWidgetB.id);
				}
			}

			this._swapWidgetA = null;
			this._swapWidgetB = null;
		}
	}

	onMouseMove(x, y, event) {
		if (this.editMode) {
			if (this._swapWidgetA == null) return;
			if (event.shiftKey === true) return;

			if ((this._swapWidgetA !== this._hoveredWidget)
				&& (this._hoveredWidget !== this) && (this._hoveredWidget != null)) {
				this._swapWidgetB = this._hoveredWidget;
				this.swapWidgets(this._swapWidgetA.id, this._swapWidgetB.id);
			}
		}
	}

	swapWidgets(widgetID_A, widgetID_B) {
		if (widgetID_A == widgetID_B) return;
		if (!widgetID_A || !widgetID_B) return;

		const widgetA = Rex.widgets[widgetID_A].htmlElement;
		const widgetB = Rex.widgets[widgetID_B].htmlElement;
		if (!widgetA || !widgetB) return;

		const widgetA_index = this.htmlElement.children.indexOf(widgetA);
		const widgetB_index = this.htmlElement.children.indexOf(widgetB);

		if (widgetA_index === widgetB_index) return;

		widgetA.remove();
		if (widgetA_index < widgetB_index) {
			this.htmlElement.insertBefore(widgetA, widgetB.nextElementSibling);
		} else if (widgetA_index > widgetB_index) {
			this.htmlElement.insertBefore(widgetA, widgetB);
		}

		// Rex.callRpcMethod("Widgets", this.id, this.type, "swapWidgetsById", [parseInt(widgetID_A), parseInt(widgetID_B)]);
		this.spacing = this._spacing;
	}

	appendChild(child) {
		if (child == null)
			return;

		if (!this.contains(child)) {
			if (this.direction === 0) {
				this.htmlElement.appendChild(child);
			} else if (this.direction === 1) {
				const firstChild = this.htmlElement.firstChild;
				this.htmlElement.insertBefore(child, firstChild);
			}

			let ID = child.id;
			try {
				if (child.id.indexOf("w") === 0) {
					ID = (child.id.slice(1));
				}
			} catch (e) { }

			if (this.children.indexOf(parseInt(ID)) === -1)
				this.children.push(parseInt(ID));

			this.widgetOrder = this.children;
			this.spacing = this._spacing;
			this.scrollPosVertical = this.scrollPosVertical;
			this.scrollPosHorizontal = this.scrollPosHorizontal;
		}
	}


	onInit() {
		for (let childId of this.children) {
			// let child = Rex.widgets[childId];
			// if (child == null) continue;
			// child.width = "100%";
			// child.height = undefined;
		}
	}

	checkSelect(event, parentId) {
		if (this.editMode === true) {
			const path = event.path || (event.composedPath && event.composedPath());
			this._hoveredWidget = null;
			return this.hover ? this.widget : null;
		} else return super.checkSelect(event, parentId);
	}

	// Функция возвращает численное значение типа Layout'а
	// return values
	// 	1 - Vertical || Flex
	// 	2 - Horizontal
	// 	0 - Any other widget
	getLayoutType(widget) {
		if (widget == null)
			widget = this;
		

		const type = widget.type;

		if (type == "WidgetLayoutVertical" || type == "WidgetLayoutFlex")
			return 1;
		else if (type == "WidgetLayoutHorizontal")
			return 2;

		return 0;
	}

	getScroll() {
		const offset =
		{
			width: (this.htmlElement.scrollWidth - this.htmlElement.clientWidth),
			height: (this.htmlElement.scrollHeight - this.htmlElement.clientHeight),
		};
		return offset;
	}

	observeScrollable(event) {
		this.setScrollable();
	}
	onCheckChildrens() {
		for (const id of this.children) {
			const child = ReactComponent[id];
			if (child && child.htmlElement) {
				this.htmlElement.appendChild(child.htmlElement);
			}
		}
	}
	setScrollable(widgetType = -1, parentId = null) {
		// if (Rex.widgets == null)
		// 	return null;

		// get current layout type
		const typeId = this.getLayoutType();
		// it isn't vertical, horizontal or flex layout
		if (typeId === 0)
			return null;

		// keep the type of widget that called the function for the first time
		if (widgetType === -1)
			widgetType = typeId;

		if (this.scrollable === false) {
			// get scroll offset, type and parent id values of current layout
			this.offsetData.offset = this.getScroll();
			this.offsetData.type = typeId;
			this.offsetData.parentId = parentId;

			//check children for scroll offset
			for (let childId of this.children) {
				// let widgetChild = Rex.widgets[childId];
				// if (!widgetChild)
				// 	return null;

				// if child widget isn't vertical or flex, then push 0 to the children array
				if (this.getLayoutType(widgetChild) === 0) {
					this.offsetData.children.push(0);
					continue;
				}

				widgetChild._scrollable = false;
				// call this method recursively for each child whose type value is not 0
				let data = widgetChild.setScrollable(widgetType, this.offsetData.id);
				// push children offset data to the children array
				this.offsetData.children.push(data);
			}

			// update offset values
			this.offsetData.offset = this.getScroll();

			let parentData = null;
			// if (Rex.widgets[this.offsetData.parentId] != null) {
			// 	parentData = Rex.widgets[this.offsetData.parentId].offsetData;
			// } else return null;

			// if vertical or flex
			if (typeId === 1) {
				// add offset height to style height
				if (this.offsetData.offset.height !== 0)
					this.htmlElement.style.minHeight = this.htmlElement.clientHeight + this.offsetData.offset.height + 'px';

				if (parentData != null) {
					if (parentData.type !== typeId && this.offsetData.offset.height !== 0)
						// if layout has offset, that shouldn't have, and has parent offset data
						// set that offset value to the parent
						parentData.offset.height = this.offsetData.offset.height;
				}

				if (this.offsetData.offset.width !== 0) {
					if (parentData != null)
						this.htmlElement.style.minWidth = this.htmlElement.clientWidth + this.offsetData.offset.width + 'px';
				}
				// if horizontal layout
				// the same thing except that the height replaced with a width 
			} else if (typeId === 2) {
				if (this.offsetData.offset.width !== 0)
					this.htmlElement.style.minWidth = this.htmlElement.clientWidth + this.offsetData.offset.width + 'px';

				if (parentData != null) {
					if (parentData.type !== typeId && this.offsetData.offset.width !== 0)
						parentData.offset.width = this.offsetData.offset.width;
				}

				if (this.offsetData.offset.height !== 0) {
					if (parentData != null)
						this.htmlElement.style.minHeight = this.htmlElement.clientHeight + this.offsetData.offset.height + 'px';
				}
			}
		} else {
			// restore old offset values
			for (let childID of this.children) {
				// const childWidget = Rex.widgets[childID];
				// if (!childWidget)
				// 	continue;

				if (childWidget.type.search("Layout") !== -1 && childWidget.type.search("Grid") === -1) {
					const childHtml = childWidget.htmlElement;

					if (typeId === 1)
						childHtml.style.minHeight = childWidget.minHeight + 'px';
					else if (typeId === 2)
						childHtml.style.minWidth = childWidget.minWidth + 'px';
				}
			}
		}

		return this.offsetData;
	}

	set widgetOrder(value) {
		if (value == null) return;
		if (value.length === 0) return;
		this._widgetOrder = value;

		if (this.children.length === 0) return;
		if (value.length !== this.children.length) return;
		// if (Rex.widgets === undefined) return;

		while (this.htmlElement.children.length !== 0)
			this.htmlElement.removeChild(this.htmlElement.children[0]);

		for (const id of this._widgetOrder) {
			// const child = Rex.widgets[id];
			// if (child === undefined) continue;
			// this.htmlElement.appendChild(child.htmlElement);
		}
	}

	set spacing(value) { 
		this._spacing = value;
	}

	get spacing() {
		return this._spacing;
	}
	set scrollPosVertical(value) {
		if (!this.needControlScroll) return;
		if (value < 0 || value > 1) return;
		this._scrollPosV = value;
		const maxScrollPos = this.htmlElement.scrollHeight - this.htmlElement.clientHeight;
		this.htmlElement.scrollTop = value * maxScrollPos;
	}

	get scrollPosVertical() {
		return this._scrollPosV;
	}

	set scrollPosHorizontal(value) {
		if (!this.needControlScroll) return;
		if (value < 0 || value > 1) return;
		this._scrollPosH = value;
		const maxScrollPos = this.htmlElement.scrollWidth - this.htmlElement.clientWidth;
		this.htmlElement.scrollLeft = value * maxScrollPos;
	}

	get scrollPosHorizontal() {
		return this._scrollPosH;
	}

	set needControlScroll(value) {
		if (value == null) return;
		this._needControlScroll = value;
	}

	get needControlScroll() {
		return this._needControlScroll;
	}
	
}
