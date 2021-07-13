class WidgetSideBars extends BaseWidget {

	constructor() {
		super();
	}

	onCreate() {
		this.showRightPanel = true;
		this.showLeftPanel = true;
		this.leftWidget = -1;
		this.rightWidget = -1;
		this.centerWidget = -1;
		this.leftContainerWidth = "25%";
		this.leftContainerMaxWidth = "290px";
		this.rightContainerWidth = "25%";
		this.rightContainerMaxWidth = "290px";
		this.buttonSize = "290px";

		// this.createDomElement("div");
		this.addClassName("WidgetSideBars");

		this.buttonsContainer = this.leftBtnContainer = document.createElement("div");
		this.buttonsContainer.classList.add("WSB-buttons-container");
		this.htmlElement.appendChild(this.buttonsContainer);

		this.openContentBtn = document.createElement("div");
		this.openContentBtn.classList.add("material-icons", "WSB-OpenContentBtn");
		this.openContentBtn.textContent = "menu";
		this.openContentBtn.title = "Скрыть боковые панели";
		this.buttonsContainer.appendChild(this.openContentBtn);

		this.leftBtnContainer = document.createElement("div");
		this.leftBtnContainer.classList.add("WSB-custom-buttons-container");
		this.buttonsContainer.appendChild(this.leftBtnContainer);

		this.leftContainer = document.createElement("div");
		this.leftContainer.classList.add("WSB-LeftContainer", "min-width-style");
		this.htmlElement.appendChild(this.leftContainer);

		this.centerContainer = document.createElement("div");
		this.centerContainer.classList.add("WSB-CenterContainer");
		this.htmlElement.appendChild(this.centerContainer);

		this.rightContainer = document.createElement("div");
		this.rightContainer.classList.add("WSB-RightContainer", "min-width-style");
		this.htmlElement.appendChild(this.rightContainer);

		this.openContentBtn.addEventListener("click", this.toggleSideBars.bind(this));

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
		// 	// Base SideBars Html
		// 	<div 
		// 		id={this.id} 
		// 		className="WidgetSideBars"
		// 		{...widget.attributes}
		// 		{...eventAttributes}
		// 	>
		// 		{/* < div 
		// 			id={"buttonsContainerSideBars_" + this.id} 
		// 			className= "WSB-buttons-container" 
		// 		>
		// 			< div
		// 				id={"openContentBtnSideBars_" + this.id}
		// 			>

		// 			</div>

		// 		</div> */}
		// 	</div>
		// );

	}
	
	onComponentDidMount() {

		// this.buttonsContainer = this.leftBtnContainer = document.createElement("div");
		// this.buttonsContainer.classList.add("WSB-buttons-container");
		// this.htmlElement.appendChild(this.buttonsContainer);

		// this.openContentBtn = document.createElement("div");
		// this.openContentBtn.classList.add("material-icons", "WSB-OpenContentBtn");
		// this.openContentBtn.textContent = "menu";
		// this.openContentBtn.title = "Скрыть боковые панели";
		// this.buttonsContainer.appendChild(this.openContentBtn);

		// this.leftBtnContainer = document.createElement("div");
		// this.leftBtnContainer.classList.add("WSB-custom-buttons-container");
		// this.buttonsContainer.appendChild(this.leftBtnContainer);

		// this.leftContainer = document.createElement("div");
		// this.leftContainer.classList.add("WSB-LeftContainer", "min-width-style");
		// this.htmlElement.appendChild(this.leftContainer);

		// this.centerContainer = document.createElement("div");
		// this.centerContainer.classList.add("WSB-CenterContainer");
		// this.htmlElement.appendChild(this.centerContainer);

		// this.rightContainer = document.createElement("div");
		// this.rightContainer.classList.add("WSB-RightContainer", "min-width-style");
		// this.htmlElement.appendChild(this.rightContainer);

		// this.openContentBtn.addEventListener("click", this.toggleSideBars.bind(this));
	}
	addElement(type, className, parentElement) {
		let element = document.createElement(type);
		element.classList.add(className);
		parentElement.appendChild(element);
		return element;
	}

	decodeText(text) {
		let decodeText = "";
		try {
			decodeText = decodeURIComponent(escape(window.atob(text)));
		}
		catch (e) {
			console.log(this.type, "setState->", "Text DecodeError!", e, text);
			decodeText = "Error";
		}
		return decodeText;
	}

	onSetState(state) {
		if (state.leftWidget != null) {
			this.setLeftWidget();
		}
		if (state.centerWidget != null) {
			this.setCenterWidget();
		}
		if (state.rightWidget != null) {
			this.setRightWidget();
		}
		if (state.showLeftPanel != null) {
			this.visibleLeftPanel();
		}
		if (state.showRightPanel != null) {
			this.visibleRightPanel();
		}
		if (state.leftContainerWidth != null) {
			this.updateLeftContainerWidth();
		}
		if (state.leftContainerMaxWidth != null) {
			this.updateLeftContainerMaxWidth();
		}
		if (state.rightContainerMaxWidth != null) {
			this.updateRightContainerWidth();
		}
		if (state.rightContainerMaxWidth != null) {
			this.updateRightContainerMaxWidth();
		}
		if (state.buttonSize != null) {
			this.htmlElement.style.setProperty("--sb-button-size", this.buttonSize);
		}
		if (state.customButtons) {
			this.updateCustomButtons();
		}
		if (state.toggleSB != null) {
			if (!state.toggleSB && this.leftContainer.classList.contains("hidden-side-bar")) {
				this.leftContainer.classList.remove("hidden-side-bar");
				this.rightContainer.classList.remove("hidden-side-bar");
				this.openContentBtn.classList.remove("WSB-OpenContentBtn-rotate");
				this.openContentBtn.title = "Скрыть боковые панели";
				this.centerContainer.classList.remove("WSB-CenterContainer-compact");
				this.centerContainer.classList.remove("WSB-CenterContainer-compact-onclick");
				this.leftBtnContainer.classList.toggle("zero-size");
				setTimeout(() => {
					this.rightContainer.classList.toggle("min-width-style");
					this.leftContainer.classList.toggle("min-width-style");
					this.buttonsContainer.classList.toggle("hide-panel");
					this.leftBtnContainer.classList.toggle("zero-size");
				}, 300);
			} else if (state.toggleSB && !this.leftContainer.classList.contains("hidden-side-bar")) {
				this.leftContainer.classList.add("hidden-side-bar");
				this.rightContainer.classList.add("hidden-side-bar");
				this.openContentBtn.classList.add("WSB-OpenContentBtn-rotate");
				this.openContentBtn.title = "Показать боковые панели";
				this.centerContainer.classList.add("WSB-CenterContainer-compact");
				this.centerContainer.classList.add("WSB-CenterContainer-compact-onclick");
				this.leftBtnContainer.classList.toggle("zero-size");

				this.rightContainer.classList.toggle("min-width-style");
				this.leftContainer.classList.toggle("min-width-style");
				setTimeout(() => {
					this.buttonsContainer.classList.toggle("hide-panel");
					this.leftBtnContainer.classList.toggle("zero-size");
				}, 300);
			}
		}
	}

	onInit() {
		if (this.leftWidget != -1) this.setLeftWidget();
		if (this.centerWidget != -1) this.setCenterWidget();
		if (this.rightWidget != -1) this.setRightWidget();
		this.updateCustomButtons();
	}

	appendChild(child) {
		if (child.id == this.leftWidget) {
			this.leftContainer.appendChild(child);
		}
		if (child.id == this.centerWidget) {
			this.centerContainer.appendChild(child);
		}
		if (child.id == this.rightWidget) {
			this.rightContainer.appendChild(child);
		}
	}

	removeChilds(parent) {
		for (let child of parent.childNodes)
			child.remove();
	}

	setLeftWidget() {
		this.removeChilds(this.leftContainer);
		if (this.leftWidget != -1 && Rex.widgets != null && Rex.widgets[this.leftWidget]) {
			this.leftContainer.appendChild(Rex.widgets[this.leftWidget].view.htmlElement);
			this.updateLeftContainerMaxWidth();
			this.updateLeftContainerWidth();
		}
	}

	setCenterWidget() {
		this.removeChilds(this.centerContainer);
		if (this.centerWidget != -1 && Rex.widgets != null && Rex.widgets[this.centerWidget]) {
			this.centerContainer.appendChild(Rex.widgets[this.centerWidget].view.htmlElement);
		}
	}

	setRightWidget() {
		this.removeChilds(this.rightContainer);
		if (this.rightWidget != -1 && Rex.widgets != null && Rex.widgets[this.rightWidget]) {
			this.rightContainer.appendChild(Rex.widgets[this.rightWidget].view.htmlElement);
			this.updateRightContainerWidth();
			this.updateRightContainerMaxWidth();
		}
	}

	updateLeftContainerWidth() {
		this.htmlElement.style.setProperty("--sb-left-panel-width", this.leftContainerWidth);
	}

	updateRightContainerWidth() {
		this.htmlElement.style.setProperty("--sb-right-panel-width", this.rightContainerWidth);
	}

	updateLeftContainerMaxWidth() {
		this.htmlElement.style.setProperty("--sb-left-panel-max-width", this.leftContainerMaxWidth);
	}

	updateRightContainerMaxWidth() {
		this.htmlElement.style.setProperty("--sb-right-panel-max-width", this.rightContainerMaxWidth);
	}

	visibleLeftPanel() {
		if (this.showLeftPanel) {
			this.leftContainer.classList.remove("hiddenPanel");
			this.openContentBtn.classList.remove("hiddenPanel");
		}
		else {
			if (!this.leftContainer.classList.contains("hiddenPanel"))
				this.leftContainer.classList.add("hiddenPanel");
			if (!this.showRightPanel)
				this.openContentBtn.classList.add("hiddenPanel");
		}
	}

	visibleRightPanel() {
		if (this.showRightPanel) {
			this.rightContainer.classList.remove("hiddenPanel");
			this.openContentBtn.classList.remove("hiddenPanel");
		}
		else {
			if (!this.rightContainer.classList.contains("hiddenPanel"))
				this.rightContainer.classList.add("hiddenPanel");
			if (!this.showLeftPanel)
				this.openContentBtn.classList.add("hiddenPanel");
		}
	}

	toggleSideBars() {
		if (this.leftContainer.classList.contains("hidden-side-bar")) {
			this.leftContainer.classList.remove("hidden-side-bar");
			this.rightContainer.classList.remove("hidden-side-bar");
			this.openContentBtn.classList.remove("WSB-OpenContentBtn-rotate");
			this.openContentBtn.title = "Скрыть боковые панели";
			this.centerContainer.classList.remove("WSB-CenterContainer-compact");
			this.centerContainer.classList.remove("WSB-CenterContainer-compact-onclick");
			this.leftBtnContainer.classList.toggle("zero-size");
			setTimeout(() => {
				this.rightContainer.classList.toggle("min-width-style");
				this.leftContainer.classList.toggle("min-width-style");

				this.buttonsContainer.classList.toggle("hide-panel");
				this.leftBtnContainer.classList.toggle("zero-size");
			}, 300);

		} else {
			this.leftContainer.classList.add("hidden-side-bar");
			this.rightContainer.classList.add("hidden-side-bar");
			this.openContentBtn.classList.add("WSB-OpenContentBtn-rotate");
			this.openContentBtn.title = "Показать боковые панели";
			this.centerContainer.classList.add("WSB-CenterContainer-compact");
			this.centerContainer.classList.add("WSB-CenterContainer-compact-onclick");
			this.leftBtnContainer.classList.toggle("zero-size");

			this.rightContainer.classList.toggle("min-width-style");
			this.leftContainer.classList.toggle("min-width-style");
			setTimeout(() => {
				this.buttonsContainer.classList.toggle("hide-panel");
				this.leftBtnContainer.classList.toggle("zero-size");
			}, 300);
		}
	}

	updateCustomButtons() {
		if (this.buttonsContainer == null) return;

		for (let i = 0; i < this.leftBtnContainer.childNodes.length; ++i) {
			let btn = this.leftBtnContainer.childNodes[i];
			if (btn == null) continue;
			btn.remove();
			i--;
		}

		if (null == this.customButtons)
			return;

		for (let key of Object.keys(this.customButtons)) {
			let btn = this.customButtons[key];
			if (null == btn)
				continue;

			let elem = document.createElement("span");
			elem.classList.add("material-icons", "WSB-custom-button");
			elem.title = btn.buttonName;
			elem.innerText = btn.iconName;
			this.leftBtnContainer.appendChild(elem);

			// elem.addEventListener("click", () => {
			// 	Rex.callRpcMethod("Widgets", this.id, this.type, "pressCustomButton", [btn.buttonName]);
			// });
		}

	}	
}
