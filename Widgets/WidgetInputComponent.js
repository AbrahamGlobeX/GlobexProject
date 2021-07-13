class WidgetInput extends BaseWidget {

	constructor() {
		super();		
	}

	onCreate(){
		this._text = "";
		this.str = "";
		this._header = "";
		this.valid = true;
		this._cursorPosition = -1;
		this._selectPosition = -1;
		this.str = this.text;
		this.fontSize = "";
		this.m_text = "";
		this._typeInput = 0;

		// this.createDomElement("div");
		this.addClassName("WidgetInput");

		this.inputElement = document.createElement("input");
		this.inputElement.type = "text";
		this.inputElement.required = true;
		this.headerElement = document.createElement("label");
		this.spanElement = document.createElement("span");

		this.htmlElement.appendChild(this.headerElement);
		this.htmlElement.appendChild(this.inputElement);
		this.htmlElement.appendChild(this.spanElement);

		this.inputElement.id = `${"input_" + this.id}`;
		this.inputElement.classList.add("WidgetInputText");
		this.headerElement.classList.add("WidgetInputHeader");
		this.spanElement.classList.add("WidgetInputBar");

		this.inputElement.oninput = () => {
			if (this.inputElement.value != this.sendData) {
				this.controlInputFormat();
			}
		};

		try {
			new ResizeObserver(this.controlFontSize.bind(this)).observe(this.htmlElement);
		} catch (e) {
		}

	}

	// eventHandler(eventType, eventObject) {

	// 	eventObject.persist();
	// 	console.log('eventHandler', eventType, eventObject.target.value, eventObject.target);

	// 	const eventHandlerName = this.props.widgets[this.id].events[eventType];

	// 	if(eventHandlerName)
	// 		Module.Store.dispatch({
	// 			'eventName': eventHandlerName,
	// 			'value': eventObject
	// 		});
	// 	else
	// 		Event.trigger(this.id+'_'+eventType, eventObject);
	// }

	render() {

		const widget = this.props.widgets[this.id];

		let eventAttributes = {};
		
		
		for (let eventName in widget.events) {
			eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
		}
		
		// return (
		// 	// Base Input Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetInput"
		// 	>
		// 		< label
		// 			id={"headerInput_" + this.id}
		// 			className="WidgetInputHeader"
		// 		> 
		// 			{widget.headerText} 
		// 		</label>
		// 		<input
		// 			id={"input_" + this.id}
		// 			className="WidgetInputText"
		// 			type="text"
		// 			require="true"
		// 			// value={widget.textContent} 
		// 			{...widget.attributes}
		// 			{...eventAttributes} 
		// 		>
					
		// 		</input>
		// 		< span 
		// 			id={"inputSpan_" + this.id}
		// 			className= "WidgetInputBar" 
		// 		>
		// 		</span>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {

		// this.headerElement = document.getElementById("headerInput_" + this.id);
		// this.inputElement = document.getElementById("input_" + this.id);
		// this.spanElement = document.getElementById("inputSpan_" + this.id);
		
		// this.inputElement.oninput = () => {
		// 	if (this.inputElement.value != this.sendData) {
		// 		this.controlInputFormat();
		// 	}
		// };
	}
	
	onGenerateContent(content) {
		let widgetTable = content.table;
		widgetTable.body.push([{ margin: [0, 0, 0, 0] }]);
		widgetTable.body.push([{ margin: [0, 0, 0, 0] }]);

		let headerBody = widgetTable.body[0][0];
		let textBody = widgetTable.body[1][0];

		const html = this.htmlElement;
		const htmlSize = html.getBoundingClientRect();
		const headerHtml = this.headerElement;
		const headerSize = headerHtml.getBoundingClientRect();
		const textHtml = this.inputElement;
		const textSize = textHtml.getBoundingClientRect();

		let bWdith = parseInt(getStyle(html, 'borderWidth'));
		bWdith = isNaN(bWdith) ? 0 : bWdith;

		widgetTable.widths.push(htmlSize.width - bWdith * 2);
		widgetTable.heights.push(headerSize.height - bWdith);
		widgetTable.heights.push(textSize.height - bWdith);

		generateText(headerHtml, headerBody);
		generateText(textHtml, textBody);

		const background = getColorHEX(getStyle(html, 'background-color'));

		headerBody.fillColor = background;
		textBody.fillColor = background;
	}

	mouseMove(x, y) {
		if (this.isHovered() && this.isFocused()) {
			document.body.style.cursor = "text";
		} else {
			document.body.style.cursor = "default";
		}
		this.onMouseMove(x, y);
	}

	updateParameters() {
		this.text = this.str;
	}

	get cursorPosition() {
		return this._cursorPosition;
	}

	set cursorPosition(value) {
		if (this._cursorPosition != value) {
			this._cursorPosition = value;
			this.onChangeCursorPosition(value);
			this.update();
		}
	}

	get selectPosition() {
		return this._selectPosition;
	}

	set selectPosition(value) {
		if (this._selectPosition != value) {
			this._selectPosition = value;
			this.update();
		}
	}

	set text(value) {
		let nText = value
		// try {
		// 	nText = decodeURIComponent(escape(window.atob(value)));
		// } catch (e) {
		// 	console.error(this.type, "setState->", "Text DecodeError!")
		// }

		this._text = nText;
		if (this.sendData == nText) return;
		this.inputElement.value = nText;
		this.sendData = nText;
		this.controlInputFormat(false);

	}
	controlHorizontalTextAlign(state){
		switch(state){
			case 1: {
				break;
			}
			case 2:{
				this.inputElement.style.textAlign = "center";
				break;
			}
		}
	}
	get text() {
		return this._text;
	}

	set header(value) {
		let oldh = this.header;
		let nHeader = value;
		// try {
		// 	nHeader = decodeURIComponent(escape(window.atob(value)));
		// } catch (e) {
		// 	console.error(this.type, "setState->", "Header DecodeError!")
		// }
		if (oldh != nHeader) {
			this.header = nHeader;
			this.headerElement.innerText = nHeader;
		}
	}

	get header() {
		return this._header;
	}

	set customStyle(value) {
		this.customStyle = value;
		for (let name in value) {
			let v = value[name];
			if (this.attributeStyle.indexOf(name) != -1) {
				if (document.body.style[name] !== undefined || (name.substr(0, 2) === "--")) {
					this.inputElement.style.setProperty(name, v);
					continue;
				}
				this.inputElement.setAttribute(name, v);
			} else {
				if (document.body.style[name] !== undefined || (name.substr(0, 2) === "--")) {
					this.htmlElement.style.setProperty(name, v);
					continue;
				}
				this.htmlElement.setAttribute(name, v);
			}
		}
	}

	set autoFontSize(value) {
		if (value == null) return;
		this._autoFontSize = value;
		this.controlFontSize();
		if (!value) {
			let t = "px";
			let font_size = parseInt(this.fontSize);

			if (this.fontSize.indexOf("px") != -1) t = "px";
			else if (this.fontSize.indexOf("%") != -1) t = "%";

			this.inputElement.style.fontSize = font_size + t;
		}
	}

	get autoFontSize() {
		return this._autoFontSize;
	}

	//рут: я не просто так это гавно скопипиздил, где-то может ебануть
	//саня: но блядь, тут же одна и та же херня, и все три работают одновременно.
	//рут: бля, я предупредил
	//саня: похуй.
	//саня: ...
	//саня: но пожалуй оставлю все же комментарий.
	//keyDown(event) {
	//	console.log('preeesssss',event);
	//	if(event.key == "Enter") this.pressEnter(true);
	//	this.str = this.inputElement.value;
	//	this._text = this.str;
	//	Rex.callRpcMethod('Widgets', this.id, this.type, 'setText', [this.text]);
	//}
	//
	//UPD саня: ну бомбануло конечно. странно, что это вообще работало...
	// саня: я тут подправил чутка - хотя бы сделал методы разными. до следущего бабаха
	//
	//
	//upd2 саня: бля снова бомбануло. немного причесал, но и это не идеально.
	// саня: зато убрал костыль сверху. до следущего бабаха

	keyPress(event) {
		if (event.key == "Enter") {
			this.controlInputFormat();
			this.pressEnter(true);
		}
	}

	sendText(v) {
		let data = this.inputElement.value;
		if (null != v)
			data = v;

		if (this.sendData == data) return;
		this.sendData = data;
	}

	controlTextColor() {
		this.inputElement.style.color = this.textColor;
		this.headerElement.style.color = this.textColor;
		this.headerElement.style.filter = "brightness(50%)";

		this.spanElement.style.setProperty("--main-color", this.textColor);
	}

	controlFontStyle() {
		let italic = "";
		if (this.fontItalic) italic = "italic";
		this.inputElement.style.fontStyle = italic;
		this.headerElement.style.fontStyle = italic;

		let bold = "";
		if (this.fontBold) bold = "bold";
		this.inputElement.style.fontWeight = bold;
		this.headerElement.style.fontWeight = bold;
	}

	controlFontSize() {
		let t = "px";
		let font_size = parseInt(this.fontSize);

		if (this.fontSize.indexOf("px") != -1) t = "px";
		else if (this.fontSize.indexOf("%") != -1) t = "%";

		if (!this.autoFontSize)
			this.headerElement.style.fontSize = (font_size * 0.8) + t;
		else {
			let html = this.headerElement;
			const ratio = html.clientWidth < html.clientHeight ? html.clientWidth / html.clientHeight :
				html.clientHeight / html.clientWidth;
			const side = Math.max(html.clientWidth, html.clientHeight);
			const fontSize = side * ratio * 4.5;
			html.style.fontSize = fontSize + "%";
			this.inputElement.style.fontSize = (fontSize + 40) + "%";
		}

	}

	controlValid(stateValid) {
		this.valid = stateValid;
		if (stateValid) this.inputElement.classList.remove("Invalid");
		else this.inputElement.classList.add("Invalid");
	}

	isValid() {
		return this.valid;
	}

	set typeInput(value){
		this._typeInput = value;
	}

	get typeInput(){
		return this._typeInput;
	}

	set typeValidate(value) {
		this._typeValidate = value;
	}

	get typeValidate() {
		return this._typeValidate;
	}

	controlTypeInput() {
		if (this.typeInput == 1) this.inputElement.type = "password";
		else this.inputElement.type = "";
		this.controlInputFormat(false);
	}

	controlInputFormat(send) {
		if (this.typeInput == 0 || this.typeInput == 1) {
			if (send == null) this.sendText();
			return;
		}

		if (this.typeInput == 2) { // Numeric
			// 1000000.545455 => 1 000 000.545455

			let sendData = this.inputElement.value;

			let index1 = sendData.indexOf(".");
			let index2 = sendData.indexOf(",");
			if (index1 != -1) {
				// find .
				let intPart = sendData.substring(0, index1);
				let doublePart = sendData.substring(index1);

				let intStr = intPart.replace(/[^.\d]+/g, "");
				let doubleStr = doublePart.replace(/[^.\d]+/g, "");
				sendData = intStr + doubleStr;

				let viewData = "";
				intStr = intStr.split("").reverse().join("");
				for (let i = 0; i < intStr.length; i++) {

					viewData += intStr[i];
					if ((i + 1) % 3 == 0 && (i != intStr.length - 1) && (i != 0)) {
						viewData += " ";
					}
				}
				viewData = viewData.split("").reverse().join("") + doubleStr;

				this.inputElement.value = viewData;
				if (send == null) this.sendText(sendData);
				return;

			} else if (index2 != -1) {
				// find .
				let intPart = sendData.substring(0, index2);
				let doublePart = sendData.substring(index2);

				let intStr = intPart.replace(/[^.\d]+/g, "");
				let doubleStr = doublePart.replace(/[^.\d]+/g, "");
				sendData = intStr + doubleStr;

				let viewData = "";
				intStr = intStr.split("").reverse().join("");
				for (let i = 0; i < intStr.length; i++) {

					viewData += intStr[i];
					if ((i + 1) % 3 == 0 && (i != intStr.length - 1) && (i != 0)) {
						viewData += " ";
					}
				}
				viewData = viewData.split("").reverse().join("") + doubleStr;

				this.inputElement.value = viewData;
				if (send == null) this.sendText(sendData);
				return;

			} else {
				// not found double - only digits
				sendData = sendData.replace(/[^.\d]+/g, "");
				sendData = sendData.split("").reverse().join(""); //Reverse

				let viewData = "";
				for (let i = 0; i < sendData.length; i++) {

					viewData += sendData[i];
					if ((i + 1) % 3 == 0 && (i != sendData.length - 1) && (i != 0)) {
						viewData += " ";
					}
				}
				sendData = sendData.split("").reverse().join("");
				viewData = viewData.split("").reverse().join("");

				this.inputElement.value = viewData;
				if (send == null) this.sendText(sendData);
				return;
			}

		} else if (this.typeInput == 3) { // PhoneNumber
			// 89135777887 => 8 (913) 577 - 7887


			// Only digits
			let sendData = this.inputElement.value;
			sendData = sendData.replace(/[^.\d]+/g, "");

			// Length <= 16
			if (sendData.length > 11) sendData = sendData.substring(0, 11);

			let viewData = "";

			if (sendData.length > 0) viewData += sendData.substring(0, 1);
			if (sendData.length > 1) viewData += " (" + sendData.substring(1, 4);
			if (sendData.length > 4) viewData += ") " + sendData.substring(4, 7);
			if (sendData.length > 7) viewData += " - " + sendData.substring(7, 11);

			this.inputElement.value = viewData;
			if (send == null) this.sendText(sendData);
			return;

		} else if (this.typeInput == 4) { // CreditCard
			//7899566445613451 => 7899 5664 4561 3451

			// Only digits
			let sendData = this.inputElement.value;
			sendData = sendData.replace(/[^.\d]+/g, "");

			// Length <= 16
			if (sendData.length > 16) sendData = sendData.substring(0, 16);

			let viewData = "";
			for (let i = 0; i < sendData.length; i++) {
				viewData += sendData[i];
				if ((i + 1) % 4 == 0 && (i != sendData.length - 1))
					viewData += " ";
			}

			this.inputElement.value = viewData;
			if (send == null) this.sendText(sendData);
			return;
		}
	}

}
