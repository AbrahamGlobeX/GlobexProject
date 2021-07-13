class WidgetSpinBox extends BaseWidget {

	constructor() {
		super();

		// this.createDomElement("div");

	}

	onCreate() {
		this.addClassName("WidgetInput");

		this.headerElement = document.createElement("label");
		this.headerElement.classList.add("WidgetInputHeader");

		this.inputElement = document.createElement("input");
		this.inputElement.id = `${"input_" + this.id}`;
		this.inputElement.type = "number";
		this.inputElement.required = true;
		this.inputElement.classList.add("WidgetInputText");

		this.spanElement = document.createElement("span");
		this.spanElement.classList.add("WidgetInputBar");

		this.htmlElement.appendChild(this.headerElement);
		this.htmlElement.appendChild(this.inputElement);
		this.htmlElement.appendChild(this.spanElement);

		this.inputElement.oninput = function (e) {

			if (isNaN(this.value) && e.data === "-") {
				return;
			}

			if (e.data)
				this.checkSpinBoxValue(e.srcElement.value, false);
			else
				this.checkSpinBoxValue(e.srcElement.value, true);

		}.bind(this);

		this.timer;             //timer identifier
		this.timerTime = 1000;  //time in ms, 5 second for example
		this.value = 0.0;
		this.step = 1.0;
		this.nodp = 0;
		this.oldValue = 0.0;

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
		// 	// Base SpinBox Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetInput"
		// 	>
		// 		< label
		// 			id={"headerSpinBox_" + this.id}
		// 			className="WidgetInputHeader"
		// 		> 
		// 			{widget.headerText} 
		// 		</label>
		// 		<input
		// 			id={"spinBox_" + this.id}
		// 			type="number"
		// 			require="true"
		// 			className="WidgetInputText"
		// 			// value={widget.textContent} 
		// 			{...widget.attributes}
		// 			{...eventAttributes} 
		// 		>
					
		// 		</input>
		// 		< span
		// 			id={"spinBoxSpan_" + this.id}
		// 			className= "WidgetInputBar" 
		// 		>
		// 		</span>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {

		// this.headerElement = document.getElementById("headerSpinBox_" + this.id);
		// this.inputElement = document.getElementById("spinBox_" + this.id);
		// this.spanElement = document.getElementById("spinBoxSpan_" + this.id);
		
		// this.inputElement.oninput = function (e) {

		// 	if (isNaN(this.value) && e.data === "-") {
		// 		return;
		// 	}

		// 	if (e.data)
		// 		this.checkSpinBoxValue(e.srcElement.value, false);
		// 	else
		// 		this.checkSpinBoxValue(e.srcElement.value, true);

		// }.bind(this);

		// this.value = 0.0;
		// this.step = 1.0;
		// this.nodp = 0;
		// this.oldValue = 0.0;
		// this.timer;             //timer identifier
		// this.timerTime = 1000;  //time in ms, 5 second for example
	}
	

	setValue(value) {
		if (value == this.value) return;
		this.value = !isNaN(value) ? value : 0;
		this.oldValue = !isNaN(value) ? value : 0;
	}

	set step(value) {
		if (this.step == value) return;
		this._step = value;
		if (value == -1) delete this.inputElement.step;
		else this.inputElement.step = value;
	}

	get step() { return this._step; }

	set value(val) {
		if (this.value == val) return;
		this._value = val;
		this.inputElement.value = val;
	}

	set header(value) {
		let oldh = this.header;
		let nHeader = value;
		// try { nHeader = decodeURIComponent(escape(window.atob(value))); }
		// catch (e) { console.error(this.type, "setState->", "Header DecodeError!") }
		if (oldh != nHeader) {
			this._header = nHeader;
			this.headerElement.innerText = nHeader;
		}
	}

	get header() {
		return this._header;
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

	checkSpinBoxValue(val, send) {

		let value = this.value;		// Старое значение
		let source = "" + val;	// Новое значение

		// Не число
		if (isNaN(source)) {
			this.htmlElement.value = value;
			return;
		}

		// Не валидная запятая
		if (source.indexOf(",") != -1) source.replace(",", ".");

		// Валидный дабл
		source = parseFloat(source);

		// Нет чисел после запятой
		if (this.nodp == 0) {
			value = parseInt(source);
		} else {
			if (this.nodp != -1) value = source.toFixed(this.nodp);
			else value = source;
		}

		// MIN MAX
		if (value > this.maxValue) return;
		else if (value < this.minValue) return;

		clearTimeout(this.timer);
		this.str = value;
		this._text = value;
		this.inputElement.value = value;
		this.value = value;

		if (send)
			this.sendValue();
		else
			this.timer = setTimeout(this.sendValue.bind(this), this.timerTime);

	}

	sendValue() {
		this.timer = -1;
	}

	onDestroy() {
		if (this.timer !== -1)
			this.sendValue();
	}
}
