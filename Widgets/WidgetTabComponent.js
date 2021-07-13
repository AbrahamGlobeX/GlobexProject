class WidgetTab extends BaseWidget {

	constructor() {
		super();
	}

	onCreate() {
		this.items = [];

		this.currentTab = -1;
		this.oldCurrentTab = -1;

		this.headerLayoutId = -1;
		this.currentTabId = -1;

		this.htmlElement.className = "WidgetTab";

		this.headerElement = document.createElement("div");
		this.headerElement.classList.add("WidgetTabHeader");
		this.htmlElement.appendChild(this.headerElement);

		this.containerElement = document.createElement("div");
		this.containerElement.classList.add("WidgetTabContainer");
		this.htmlElement.appendChild(this.containerElement);

		this._tabPosition = null;
		this._tabHeaderWidth = null;
		this._tabHeaderHeight = null;

		this._tabNeedCloseButton = null;

		this._currentLayout = null;
	}

	eventHandler(eventType, eventObject) {

		eventObject.persist();
		console.log(eventType, eventObject);
		let widgetWindow = null;
		for( let i = 1; i < idWidgets; i++){
			widgetWindow = document.getElementById("divWindow_widget_" + i);
			if(widgetWindow) break;
		}
		if (widgetWindow) widgetWindow.parentThis.inverseEnableHeader();
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
		// 	// Base Tab Html
		// 	<div 
		// 		id={this.id} 
		// 		className="WidgetTab"
		// 		{...widget.attributes}
		// 		{...eventAttributes}
		// 	>
		// 		< div 
		// 			id={"headerElementTab_" + this.id} 
		// 			className= "WidgetTabHeader" 
		// 			>
		// 		</div>
		// 		< div 
		// 			id={"containerElementTab_" + this.id} 
		// 			className= "WidgetTabContainer"
		// 		 >
		// 		 </div>
		// 	</div>
		// );

	}

	onComponentDidMount() {

		// 	this.headerElement = document.getElementById("headerElementTab_" + this.id);
		// 	this.containerElement = document.getElementById("containerElementTab_" + this.id);
	}

	onSetState(state) {
		if (state.currentTabId != null) this.currentTabId = state.currentTabId;
		if (state.tabPosition != null) this.tabPosition = state.tabPosition;
		if (state.tabHeaderWidth != null) this.tabHeaderWidth = state.tabHeaderWidth;
		if (state.tabHeaderHeight != null) this.tabHeaderHeight = state.tabHeaderHeight;
		if (state.tabHeaderAutoSize != null) this.tabHeaderAutoSize = state.tabHeaderAutoSize;
		if (state.items != null) this.updateItems();

	}

	appendChild(child) {
		//тут так и должно быть пусто. это перегруженый метод, и надо что бы он оставался таким.
		//appendChild происходит в set currentTabId()
		this.updateItems();
	}

	set currentTab(value) {
		if (value == -1 && this._currentTab == -1) return;

		if (value == -1 && this._currentTab != -1) {
			this.hideItem(this.items[this._currentTab]);
		} else if (this._currentTab == -1) {
			this.showItem(this.items[value]);
		} else {
			this.hideItem(this.items[this._currentTab]);
			this.showItem(this.items[value]);
		}

		this._currentTab = value
	}

	get currentTab() {
		return this._currentTab;
	}

	getNumTabs(){
		return this.items.length;
	}

	set tabPosition(value) {
		if (this.headerElement != null && this.containerElement != null) {
			this.htmlElement.classList.remove(this.posToStr(this._tabPosition));
			this.headerElement.classList.remove(this.posToStr(this._tabPosition));

			this.htmlElement.classList.add(this.posToStr(value));
			this.headerElement.classList.add(this.posToStr(value));
		}

		this.tabHeaderHeight = this.tabHeaderHeight;
		this.tabHeaderWidth = this.tabHeaderWidth;

		this._tabPosition = value;
	}

	get tabPosition() {
		return this._tabPosition;
	}

	set tabHeaderWidth(value) {
		if (value <= 0) return;
		this._tabHeaderWidth = value;
		if (this.containerElement == null) return;
		if (this._tabPosition == 1) {
			this.headerElement.style.width = this._tabHeaderWidth + "px";
			this.headerElement.style.minWidth = this._tabHeaderWidth + "px";
			this.containerElement.style.height = "100%";
		} else if (this._tabPosition == 3) {
			this.headerElement.style.width = this._tabHeaderWidth + "px";
			this.headerElement.style.minWidth = this._tabHeaderWidth + "px";
			this.containerElement.style.height = "100%";
		}
	}

	get tabHeaderWidth() {
		return this._tabHeaderWidth;
	}

	set tabHeaderHeight(value) {
		if (value <= 0) return;
		this._tabHeaderHeight = value;
		if (this.containerElement == null) return;
		if (this._tabPosition == 0) { // TOP
			this.containerElement.style.height = "calc(100% - " + this._tabHeaderHeight + "px)";
			this.headerElement.style.width = "100%";
			this.headerElement.style.minHeight = this._tabHeaderHeight + "px";
		} else if (this._tabPosition == 2) { // BOTTOM
			this.containerElement.style.height = "calc(100% - " + this._tabHeaderHeight + "px)";
			this.headerElement.style.width = "100%";
			this.headerElement.style.minHeight = this._tabHeaderHeight + "px";
		}
	}

	get tabHeaderHeight() {
		return this._tabHeaderHeight;
	}

	set tabHeaderAutoSize(value) {
		this._tabHeaderAutoSize = value;
		if (this.headerElement != null) {
			if (value) this.headerElement.classList.add("TabAutoSize");
			else this.headerElement.classList.remove("TabAutoSize");
		}
	}

	get tabHeaderAutoSize() {
		return this._tabHeaderAutoSize;
	}

	set tabNeedCloseButton(value) {

		this._tabNeedCloseButton = value;

		this.updateItems();
	}

	get tabNeedCloseButton() {

		return this._tabNeedCloseButton;
	}

	posToStr(v) {
		switch (v) {
			case 0: {
				return "Top"
			}
			case 1: {
				return "Right"
			}
			case 2: {
				return "Bottom"
			}
			case 3: {
				return "Left"
			}
		}
		return "Top";
	}

	onCheckChildrens(){
		this.updateItems();
	}

	updateItems() { debugger;
		//if (Rex.widgets == null) return;
		// CLEAR
		for (let i = 0; i < this.headerElement.childNodes.length; ++i) {
			let btn = this.headerElement.childNodes[i];
			if (btn == null) continue;
			btn.remove();
			i--;
		}

		for (let i = 0; i < this.containerElement.childNodes.length; ++i) {
			let w = this.containerElement.childNodes[i];
			if (w == null) continue;
			w.remove();
			i--;
		}

		// ADD
		for (let i = 0; i < this.items.length; ++i) {
			let item = this.items[i];
			let bID = item.buttonID;
			let wID = item.widgetID;



			let b = ReactComponent[bID];
			let w = ReactComponent[wID];
			if (b == null || w == null) continue;
			if (this.children.indexOf(bID) == -1 || this.children.indexOf(wID) == -1) continue;

			item.index = i;
			item.button = b;
			item.widget = w;
			b.title = i;

			let pageHeader = document.createElement('div');

			pageHeader.classList.add("WidgetTabPageHeader");

			if (this.tabNeedCloseButton) {

				let closeButton = document.createElement('div');

				closeButton.classList.add("MaterialIcon");
				closeButton.classList.add("TabPageCloseButton");
				closeButton.textContent = "close";
				closeButton.onclick = (event) => Rex.callRpcMethod('Widgets', this.id, this.type, 'removeTab', [i]);

				pageHeader.appendChild(closeButton);
			}

			pageHeader.appendChild(b.view.htmlElement);

			this.headerElement.appendChild(pageHeader);

			this.containerElement.appendChild(w.view.htmlElement);

			item.view.htmlElement.classList.add("TabContentHidden");
			item.button.view.htmlElement.classList.add("TabButton");

		}

		this.currentTab = this.currentTab;
	}

	hideItem(item) {
		if (item == null) return;
		if (item.button == null || item.widget == null) return;
		item.button.view.htmlElement.classList.remove("TabButtonSelected");
		item.view.htmlElement.classList.add("TabContentHidden");
	}

	showItem(item) {
		if (item == null) return;
		if (item.button == null || item.widget == null) return;
		item.button.view.htmlElement.classList.add("TabButtonSelected");
		item.view.htmlElement.classList.remove("TabContentHidden");
	}




}
