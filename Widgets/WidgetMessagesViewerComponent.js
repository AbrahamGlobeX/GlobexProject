class WidgetMessagesViewer extends BaseWidget {

	constructor(props) {
		super(props);
		this.autoFontSize = true;
		this.fontSize = 25;
		this._lessHundred = false;
		
		this.ripples = [];
		
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
		
		return (
			// Base MessagesViewer Html
			<div 
				id={this.id} 
				className="WidgetMessagesViewer"
				{...widget.attributes}
				{...eventAttributes}
			>
				< div 
					id={"textMessagesViewer_" + this.id} 
					className = "WidgetMessagesViewerText" 
					>
						 {widget.textContent}
				</div>
				< div 
					id={"iconMessagesViewer_" + this.id} 
					className= "MaterialIcon"
				 >
				 </div>
			</div>
		);

	}
	
	onComponentDidMount() {
		this.htmlText = document.getElementById("textMessagesViewer_" + this.id);
		this.htmlIcon = document.getElementById("iconMessagesViewer_" + this.id);
		try {
			new ResizeObserver(this.controlFontSize.bind(this)).observe(this.htmlElement);
		} catch (e) { }
		this.htmlElement.addEventListener("click", this.startAnimation.bind(this));
	}
	
	controlFontSize() {
		
		if (!this.autoSize) {
			this.htmlText.style.fontSize = this.fontSize + 'px';
			return;
		}

		let html = this.htmlElement;
		const ratio = html.clientWidth < html.clientHeight ?
			html.clientWidth / html.clientHeight : html.clientHeight / html.clientWidth;

		const side = Math.max(html.clientWidth, html.clientHeight);
		if (side === 0) {
			return;
		}

		let fontSize = side * ratio;
		if (ratio < 0.5) {
			fontSize *= 2;
		}

		if (fontSize < 100 && !this._lessHundred) {
			this.htmlText.style.fontSize = "100%";
		} else {
			this.htmlText.style.fontSize = (fontSize) + '%';
		}
		
	}
	
	startAnimation(event) {
		
		const w = this.htmlElement.offsetWidth;
		const h = this.htmlElement.offsetHeight;
		
		const rippleSize = Math.max(w, h) * 4;
		const delay = 100;
		const posX = event.clientX;
		const posY = event.clientY;

		
		const x = this.htmlElement.offsetLeft;
		const y = this.htmlElement.offsetTop;
		
		const dx = posX - x;
		const dy = posY - y;

		const containerRipple = document.createElement("div");
		containerRipple.style.width = this.htmlElement.clientWidth + "px";
		containerRipple.style.height = this.htmlElement.clientHeight + "px";
		containerRipple.style.overflow = "hidden";
		containerRipple.style.position = "absolute";
		this.ripples.push(containerRipple);

		let ripple = document.createElement("div");
		ripple.style.left = (dx - (rippleSize / 2)) + "px";
		ripple.style.top = (dy - (rippleSize / 2)) + "px";
		ripple.style.height = (rippleSize) + "px";
		ripple.style.width = (rippleSize) + "px";
		ripple.style.borderRadius = (rippleSize) + "px";
		ripple.classList.add("RippleAnimation");
		this.htmlElement.appendChild(containerRipple);
		containerRipple.appendChild(ripple);

		setTimeout(function () {
			ripple.style["-webkit-transform"] = "scale(1)";
			ripple.style["-moz-transform"] = "scale(1)";
			ripple.style.transform = "scale(1)";
			ripple.style.opacity = 0;
		}, delay);

		let remove = false;
		setTimeout(function () {
			if (containerRipple != null && !remove)
				containerRipple.remove();
		}, 2000);
	}

	controlText(stateText) {
		let text = stateText;
		this.text = text;
		this.htmlText.innerText = text;

		if (stateText == "") {
			if (this.htmlElement.contains(this.htmlText)) {
				this.htmlElement.removeChild(this.htmlText);
			}
		} else {
			if (!this.htmlElement.contains(this.htmlText)) this.htmlElement.appendChild(this.htmlText);
			this.htmlText.innerText = this.text;
		}
	}

	controlIconName(stateIconName) {
		if (this.iconName == stateIconName) return;
		this.iconName = stateIconName;
		this.htmlIcon.innerText = this.iconName;
		this.controlVerticalTextAlign(this.verticalTextAlign);
		this.controlHorizontalTextAlign(this.horizontalTextAlign);
	}

	controlVerticalTextAlign(stateTextAlign) {
		if (this.verticalTextAlign == stateTextAlign) return;
		this.verticalTextAlign = stateTextAlign;
		switch (stateTextAlign) {
			case 1: // TEXT TOP
				this.htmlText.style.alignItems = "flex-start";
				this.htmlIcon.style.alignItems = "flex-start";
				break;
			case 2: // TEXT CENTER
				this.htmlText.style.alignItems = "center";
				this.htmlIcon.style.alignItems = "center";
				break;
			case 3: // TEXT BOTTOM
				this.htmlText.style.alignItems = "flex-end";
				this.htmlIcon.style.alignItems = "flex-end";
				break;
		}
	}

	controlHorizontalTextAlign(stateTextAlign) {
		if (stateTextAlign == 0) this.htmlText.innerText = "";
		else this.htmlText.innerText = this.text;

		this.textAlign = stateTextAlign;

		switch (stateTextAlign) { //justify-content: center;
			case 0: // TEXT NONE
				this.htmlIcon.style.width = "100%";
				if (this.htmlElement.contains(this.htmlText))
					this.htmlElement.removeChild(this.htmlText);

				if (!this.htmlElement.contains(this.htmlIcon))
					this.htmlElement.appendChild(this.htmlIcon);

				break;
			case 1: // TEXT LEFT
				this.htmlIcon.style.width = "30%";
				this.htmlText.style.width = "70%";
				if (this.htmlIcon.innerText.length === 0) {
					this.htmlIcon.style.width = null;
					this.htmlText.style.width = "100%";
					this.htmlText.style.justifyContent = "flex-start";
				}
				this.htmlText.style.textAlign = "left";
				if (this.htmlElement.contains(this.htmlText))
					this.htmlElement.removeChild(this.htmlText);

				if (this.htmlElement.contains(this.htmlIcon))
					this.htmlElement.removeChild(this.htmlIcon);

				if (this.htmlText.innerText.length !== 0)
					this.htmlElement.appendChild(this.htmlText);

				if (this.htmlIcon.innerText.length !== 0)
					this.htmlElement.appendChild(this.htmlIcon);

				break;
			case 2: // TEXT CENTER
				this.htmlText.style.width = "100%";
				this.htmlText.style.justifyContent = "center";
				this.htmlText.style.textAlign = "center";

				if (this.htmlElement.contains(this.htmlIcon))
					this.htmlElement.removeChild(this.htmlIcon);

				if (!this.htmlElement.contains(this.htmlText) &&
					this.htmlText.innerText.length !== 0) {
					this.htmlElement.appendChild(this.htmlText);
				}
				break;
			case 3: // TEXT RIGHT
				this.htmlIcon.style.width = "30%";
				this.htmlText.style.width = "70%";
				if (this.htmlIcon.innerText.length === 0) {
					this.htmlIcon.style.width = null;
					this.htmlText.style.width = "100%";
					this.htmlText.style.justifyContent = "flex-end";
				}
				this.htmlText.style.textAlign = "right";
				if (this.htmlElement.contains(this.htmlText))
					this.htmlElement.removeChild(this.htmlText);

				if (this.htmlElement.contains(this.htmlIcon))
					this.htmlElement.removeChild(this.htmlIcon);

				if (this.htmlIcon.innerText.length !== 0)
					this.htmlElement.appendChild(this.htmlIcon);
				if (this.htmlText.innerText.length !== 0)
					this.htmlElement.appendChild(this.htmlText);
				break;
		}
	}

	controlFontFamily(stateFontFamily) {
		this.htmlText.style.fontFamily = stateFontFamily;
	}

	checkSelect() {
		return this.hover ? this.widget : undefined;
	}

	onMouseDown(x, y, event) {
		this.startAnimation(event)
	}

	set autoFontSize(value) {
		if (value == null) return;
		this._autoFontSize = value;
		if (!value)
			this.htmlElement.style.fontSize = this.fontSize + "px";
		else this.controlFontSize();
	}

	get autoFontSize() {
		return this._autoFontSize;
	}

	onDestroy() {
		for (let c of this.ripples) {
			if (null == c) continue;
			c.remove();
		}
	}

	
}
