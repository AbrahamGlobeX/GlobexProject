class WidgetDialog extends BaseWidget {

	constructor() {
		super();

	}

	onCreate() {
		// this.createDomElement("div");
		this.addClassName("WidgetDialog");

		this.dialogContent = document.createElement("div");
		this.dialogContent.classList.add("WidgetDialogContent");
		this.htmlElement.appendChild(this.dialogContent);

		this.headerElement = document.createElement("div");
		this.headerElement.classList.add("WidgetDialogHeader");
		this.dialogContent.appendChild(this.headerElement);

		this.dialogContentContainer = document.createElement("div");
		this.dialogContentContainer.classList.add("WidgetDialogContentContainer");
		this.dialogContent.appendChild(this.dialogContentContainer);

		this.buttonsContainer = document.createElement("div");
		this.buttonsContainer.classList.add("WidgetDialogButtonsContainer");
		this.dialogContent.appendChild(this.buttonsContainer);
		this.buttonNames = {};
		this.buttonCallback = {};
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
		// 	// Base Dialog Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetDialog"
		// 		{...eventAttributes}
		// 	>
		// 		<div
		// 			id={"contentDialog_" + this.id}
		// 			className="WidgetDialogContent"
		// 			{...widget.attributes}
		// 		>
		// 			<div
		// 				id={"headerDialog_" + this.id}
		// 				className="WidgetDialogHeader"
		// 			>
		// 			</div>
		// 			<div
		// 				id={"containerContentDialog_" + this.id}
		// 				className="WidgetDialogContentContainer"
		// 			>
		// 			</div>
		// 			<div
		// 				id={"containerButtonsDialog_" + this.id}
		// 				className="WidgetDialogButtonsContainer"
		// 			>
		// 			</div>
					
		// 		</div>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {

		// this.dialogContent = document.getElementById("contentDialog_" + this.id);
		// this.headerElement = document.getElementById("headerDialog_" + this.id);
		// this.dialogContentContainer = document.getElementById("containerContentDialog_" + this.id);
		// this.buttonsContainer = document.getElementById("containerButtonsDialog_" + this.id);
		
		// this.controlHeader("Header Dialog");
		// this.buttonNames.push("OK");
		// this.buttonNames.push("CLOSE");
		// this.updateButtons();
	}

	set minHeight(value) {
		this._minHeight = value;
		if (this.dialogContent) this.dialogContent.style.minHeight = this.minHeight;
	}

	get minHeight() { return this._minHeight; }

	set minWidth(value) {
		this._minWidth = value;
		if (this.dialogContent) this.dialogContent.style.minWidth = value;
	}

	get minWidth() { return this._minWidth; }

	set height(value) {
		this._height = value;
		if (this.dialogContent) this.dialogContent.style.height = value;
	}

	get height() { return this._height; }

	set width(value) {
		this._width = value;
		if (this.dialogContent) this.dialogContent.style.width = value;
	}

	get width() { return this._width; }

	appendChild(child) {
		if (!this.contains(child)) {
			this.dialogContentContainer.appendChild(child);
		}
	}

	onCheckChildrens() {
		for (const id of this.children) {
			const child = ReactComponent[id];
			if (child && child.htmlElement) {
				this.dialogContentContainer.appendChild(child.htmlElement);
			}
		}
	}

	
	controlHeader(stateHeader) {
		let newText = "";

		// try {
		// 	newText = decodeURIComponent(escape(window.atob(stateHeader)));
		// } catch (e) { console.log(this.type, " -> setState-> \"header\" DecodeError!"); return; }
		newText = stateHeader;

		if (this.header === newText) return;
		this.header = newText;
		this.headerElement.innerText = newText;

		this.updateHeight();
	}

	addDialogButton(nameButton, callback = null, param = null) {
		this.buttonNames[nameButton] = nameButton;
		this.buttonCallback[nameButton] = callback;
		this.updateButtons();
	}

	removeDialogButton(nameButton) {
		if(this.buttonNames[nameButton]) delete this.buttonNames[nameButton];
		else return;
		this.updateButtons();
	}

	updateButtons() {
		for (let i = 0; i < this.buttonsContainer.childNodes.length; ++i) {
			let btn = this.buttonsContainer.childNodes[i];
			if (btn == null) continue;
			btn.remove();
			i--;
		}

		for (let k in this.buttonNames) {
			let btnText = k;
			// try {
			// 	btnText = decodeURIComponent(escape(window.atob(k)));
			// } catch (e) {
			// 	console.error("Fail decode DialogBtnName ->", e);
			// }

			let elem = document.createElement("div");
			elem.className = "WidgetDialogButton";
			elem.title = btnText;
			elem.innerText = btnText;
			elem.addEventListener("click",function (event){
				this.buttonCallback[k]();
			}.bind(this));

			this.buttonsContainer.appendChild(elem);
		}

		this.updateHeight();

	}


	updateHeight() {
		this.dialogContent.style.height = this.height + "px";
		let h1 = this.headerElement.offsetHeight;
		let h2 = this.buttonsContainer.offsetHeight;
		this.dialogContentContainer.style.height = "calc(100% - " + (h1 + h2) + "px)"

	}


}
