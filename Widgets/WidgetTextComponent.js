class WidgetText extends BaseWidget {

	constructor() {
		super();


	}

	onCreate() {
		this._scrollPos = null;

		this.htmlElement.classList.add("WidgetText");

		this.headerElement = document.createElement("div");
		this.headerElement.classList.add("WidgetTextHeader");
		this.htmlElement.appendChild(this.headerElement);

		this.textContent = document.createElement("div");
		this.textContent.classList.add("WidgetTextContent");
		this.htmlElement.appendChild(this.textContent);

		this.textContent.addEventListener("scroll", function (event) {
			const maxScrollPos = this.textContent.scrollHeight - this.textContent.clientHeight;
			const currentPos = this.textContent.scrollTop;
			// if (maxScrollPos !== currentPos)
			// 	Rex.callRpcMethod("Widgets", this.id, this.type, "setScrollPos", [currentPos / maxScrollPos]);
		}.bind(this));


		// this.textContent.oninput = (event) => {
		// 	if (this.text == event.target.value) return;
		// 	this.text = event.target.value;
		// 	// Rex.callRpcMethod('Widgets', this.id, this.type, 'setParameters', [this.text, this.cursorPosition, this.selectPosition, this.globalSelectPosition, this.cursorLine, this.selectLine]);
		// };
		this.textMap = { array: [] };
		this._text = '';			// Исходный текст напечатанный пользователем
		this.textDraw = '';		// Форматированный текст для формирования строк и отрисовки
		this.header = '';
		this.wordsArr = [];

		//курсор
		this.cursorPosition = 0;
		this.cursorLine = 0;
		// this.lineHeight = 1;

		//выделенный текст
		this.globalSelectPosition = -1;
		this.selectPosition = -1;
		this.selectLine = 0;
		// this.controlHeader("this.header");
		this.text = "";

	}

	set horizontalTextAlign(value) {
		if (this.horizontalTextAlign === value) return;
		this._horizontalTextAlign = value;
		this.controlAlign();
	}

	get horizontalTextAlign() { return this._horizontalTextAlign; }

	set header(value) {
		if (this.header === value) return;
		this._header = value;
		this.controlHeader(value);
	}

	get header() { return this._header; }

	set text(value) {
		if (this.text === value) return;
		this.textContent.innerHTML = "";
		this.wordsArr = [];
		this._text = value;
		this.textMap.text = value;
		this.controlText(value);
	}

	get text() { return this._text; }

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
		// 			{...attributes}
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
		const textHtml = this.textContent;
		const textSize = this.getBoundingClientRect();

		let bWdith = parseInt(getStyle(html, 'borderWidth'));
		bWdith = isNaN(bWdith) ? 0 : bWdith;

		widgetTable.widths.push(htmlSize.width - bWdith * 2);
		widgetTable.heights.push(headerSize.eight - bWdith);
		widgetTable.heights.push(textSize.height - bWdith);

		generateText(headerHtml, headerBody);
		generateText(textHtml, textBody);

		const background = getColorHEX(getStyle(html, 'background-color'));

		headerBody.fillColor = background;
		textBody.fillColor = background;
	}

	mouseMove(x, y) {
		if (this.isHovered() && this.isFocused()) {
			document.body.style.cursor = 'text';
		} else { document.body.style.cursor = 'default'; }
		this.onMouseMove(x, y);
	}

	// pressEnter(value) {
	// 	if(value) this.updateParameters(true);
	// 	Rex.callRpcMethod("Widgets", this.id, this.type, "pressEnter", [value]);
	// }

	updateParameters() {
		this.update();
		// Rex.callRpcMethod('Widgets', this.id, this.type, 'setParameters', [this.text, this.cursorPosition, this.selectPosition, this.globalSelectPosition, this.cursorLine, this.selectLine]);
	}

	set lineHeight(value) {
		if (value == null) return;
		this.textContent.style.lineHeight = value + "%";
	}

	onInit() {
		this.scrollPos = this.scrollPos;
	}

	onSetState(state) {
		if (state.cursorPosition != null) this.cursorPosition = state.cursorPosition;
		if (state.selectPosition != null) this.selectPosition = state.selectPosition;
		if (state.globalSelectPosition != null) this.globalSelectPosition = state.globalSelectPosition;
		if (state.cursorLine != null) this.cursorLine = state.cursorLine;
		if (state.selectLine != null) this.selectLine = state.selectLine;
		if (state.lineHeight != null) this.lineHeight = state.lineHeight;
		if (state.scrollPos != null) this.scrollPos = state.scrollPos;

		if (state.header != null) this.controlHeader(state.header);
		if (state.text != null) this.controlText(state.text);
		if (state.horizontalTextAlign != null) this.controlAlign();
		if (state.fontSize != null) this.controlFontSize();
		if (state.textColor != null) this.controlTextColor();
		if (state.fontBold != null || state.fontItalic != null) this.controlFontStyle();

		if (state.activated != null) {
			this.htmlElement.classList.remove("Disabled");
			if (!state.activated)
				this.textContent.setAttribute("readonly", "true");
			else
				this.textContent.removeAttribute("readonly");
		}

	}

	controlText(stateText) {
		let arr = stateText.split('|');
		for (let i = 0; i < arr.length; i++) {
			if (i % 2 == 1) this.addWord(arr[i], true);
			else this.addWord(arr[i]);
		}
	}

	addWord(text, button = false) {
		let word = document.createElement("span");
		word.value = text;
		word.innerText = text;
		if (button) {
			word.classList.add('btn');
			word.addEventListener("click", function (event) {
				console.log('click on ', numWord, ' word: "', text, '".', word, event);
			}.bind(this));
		}
		let numWord = this.textMap.array.length;
		this.textMap.array.push(text);
		if (this.textMap.text !== this._text) {
			this._text += text;
			this.textMap.text += text;
		}
		if (numWord > 0) {
			let space = document.createElement("span");
			space.value = ' ';
			space.innerText = ' ';
			this.textContent.appendChild(space);
		}
		this.textMap[numWord] = word;
		if (button) this.wordsArr.push(word);
		this.textContent.appendChild(word);
		return word;
	}
	controlHeader(stateHeader) {
		this.headerElement.textContent = stateHeader;
	}

	controlAlign() {
		switch (this.horizontalTextAlign) { //justify-content: center;
			case 1:
				this.headerElement.style.justifyContent = "flex-start";
				this.textContent.style.textAlign = "left";
				break;
			case 2:
				this.headerElement.style.justifyContent = "center";
				this.textContent.style.textAlign = "center";
				break;
			case 3:
				this.headerElement.style.justifyContent = "flex-end";
				this.textContent.style.textAlign = "right";
				break;
			default:
				this.textContent.style.textAlign = "";
				break;
		}

	}

	controlFontSize() {
		this.textContent.style.fontSize = this.fontSize + "px";
		this.headerElement.style.fontSize = "calc(" + this.fontSize + "px * 1.2)";
	}

	controlTextColor() {
		this.textContent.style.color = this.textColor;
		this.headerElement.style.color = this.textColor;
		this.headerElement.style.filter = "brightness(50%)";
	}

	controlFontStyle() {
		let italic = "";
		if (this.fontItalic) italic = "italic";
		this.textContent.style.fontStyle = italic;
		this.headerElement.style.fontStyle = italic;

		let bold = "";
		if (this.fontBold) bold = "bold";
		this.textContent.style.fontWeight = bold;
		this.headerElement.style.fontWeight = bold;
	}

	keyUp(event) {
		// if (this.text == event.target.value) return;
		// this.text =  event.target.value;
		// Rex.callRpcMethod('Widgets', this.id, this.type, 'setParameters', [this.text, this.cursorPosition, this.selectPosition, this.globalSelectPosition, this.cursorLine, this.selectLine]);
	}

	set scrollPos(value) {
		if (value < 0 || value > 1) return;
		this._scrollPos = value;

		const maxScrollPos = this.textContent.scrollHeight - this.textContent.clientHeight;
		const currentScrollPos = value * maxScrollPos;
		if (this.textContent.scrollTop == currentScrollPos) return;
		this.textContent.scrollTop = currentScrollPos;
	}

	get scrollPos() {
		return this._scrollPos;
	}

}
