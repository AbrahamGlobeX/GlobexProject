//Везде где Rex надо что то придумать!!!
//used WidgetWindow
class Resizer {

	constructor(widget) {

		this.resizeType = {
			none: 0,
			n: 1,		// n - (верх, центр),
			ne: 2,		// ne - (верхний правый угол),
			e: 3,		// e - (право),
			se: 4,		// se - (правый нижний угол),
			s: 5,		// s - (низ, центр),
			sw: 6,		// sw - (левый нижний угол),
			w: 7,		// w - (лево),
			nw: 8		// nw - (левый верхний угол)
		};
		this.widget = widget;
		this.needResize = true;
		this.resize = this.resizeType.none;
		// this.startResizePos = new Rex.Vector2(0, 0);
		// this.startResize = new Rex.Vector2(0, 0);
		// this.startMove = new Rex.Vector2(0, 0);

		this.cursorType = ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize", "default", "move"];
	}

	checkResize(mouseX, mouseY) {
		if (this.widget === undefined) return;
		if (this.needResize) return;

		// Погрешность определения границы стороны
		let errorLine = 20;
		let errorDiff = 10;
		let px = this.aPosX;
		let py = this.aPosY;
		let w = 0;
		let h = 0;
		if (this.typeView == "canvas") {
			w = this.width;
			h = this.height;
		} else {
			w = this.width;
			h = this.height;
		}
		// let mouse = new Rex.Vector2(mouseX, mouseY);
		let radius = 10;
		let shiftX = [w / 2, w, w, w, w / 2, 0, 0, 0];
		let shiftY = [0, 0, h / 2, h, h, h, h / 2, 0];
		for (let i = 0; i < shiftX.length; ++i) {
			// let distance = Rex.Vector2.distance(new Rex.Vector2(px + shiftX[i], py + shiftY[i]), mouse);
			if (distance < radius) {
				if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[i];
				this.resize = i + 1;
				return;
			}
		}

		w += px;
		h += py;

		// Ресайз на краю сторон

		// TOP
		if ((((px + errorLine) < mouseX) && (mouseX < (w - errorLine))) && (((py - errorDiff) < mouseY) && (mouseY < (py + errorDiff)))) {
			this.resize = 1;
			if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[0];
			return;
		}

		// RIGHT
		if (((w - errorDiff < mouseX) && (mouseX < w + errorDiff)) && ((py + errorLine < mouseY) && (mouseY < h - errorLine))) {
			this.resize = 3;
			if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[2];
			return;
		}

		// BOTTOM
		if (((px + errorLine < mouseX) && (mouseX < w - errorLine)) && ((h - errorDiff < mouseY) && (mouseY < h + errorDiff))) {
			this.resize = 5;
			if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[4];
			return;
		}

		// LEFT
		if (((px - errorDiff < mouseX) && (mouseX < px + errorDiff)) && ((py + errorLine < mouseY) && (mouseY < h - errorLine))) {
			this.resize = 7;
			if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[6];
			return;
		}

		if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[8];
		this.resize = this.resizeType.none;
	}

	mouseMove(x, y) {
		this.checkResize(x, y);
		if (this.needResize) {
			// let newPos = new Rex.Vector2(x, y);
			let newPos = {x: x, y: y};
			let delta = newPos.sub(this.startResizePos);
			let deltaSizeX = [0, delta.x, delta.x, delta.x, 0, -delta.x, -delta.x, -delta.x];
			let deltaSizeY = [-delta.y, -delta.y, 0, delta.y, delta.y, delta.y, 0, -delta.y];
			let deltaPosX = [
				this.startMove.x,
				this.startMove.x,
				this.startMove.x,
				this.startMove.x,
				this.startMove.x,
				this.startMove.x + delta.x,
				this.startMove.x + delta.x,
				this.startMove.x + delta.x
			];
			let deltaPosY = [
				this.startMove.y + delta.y,
				this.startMove.y + delta.y,
				this.startMove.y,
				this.startMove.y,
				this.startMove.y,
				this.startMove.y,
				this.startMove.y,
				this.startMove.y + delta.y
			];

			let minimumWidth = this.minWidth;
			let minimumHeight = this.minHeight;
			if (this.minContentWidth !== undefined) {
				if (this.minContentWidth > this.minWidth) {
					minimumWidth = this.minContentWidth;
				}
			}
			if (this.minContentHeight !== undefined) {
				if (this.minContentHeight > this.minHeight) {
					minimumHeight = this.minContentHeight;
				}
			}

			if (this.typeView == "html" && this.resize != 0) this.startMoving();

			for (let i = 0; i < deltaSizeX.length; ++i) {
				if (i + 1 != this.resize) continue;
				let posX = deltaPosX[i];
				let posY = deltaPosY[i];
				let width = this.startResize.x + deltaSizeX[i];
				let height = this.startResize.y + deltaSizeY[i];
				if (this.htmlElement != null) this.htmlElement.style.cursor = this.cursorType[i];
				if (((minimumWidth) > width) || ((minimumHeight) > height)) continue;
				this.setPosX(posX);
				this.setPosY(posY);
				if (this.width != width && width > this.paddingLeft + this.paddingRight) this.setWidth(width);
				if (this.height != height && height > this.paddingTop + this.paddingBottom) this.setHeight(height);
			}
			// Rex.gui.redraw();
			// if (Rex.gui === undefined) return;
			// Rex.gui.reposition(this.widget);
		}
	}

	mouseDown(x, y) {
		if (this.resize != this.resizeType.none) {
			this.startResizePos.x = x;
			this.startResizePos.y = y;
			this.startResize.x = this.width;
			this.startResize.y = this.height;
			this.startMove.x = this.posX;
			this.startMove.y = this.posY;
			this.needResize = true;
			// Rex.gui.needMove = false;
		}
	}

	mouseUp() {
		this.needResize = false;
		this.resize = this.resizeType.none;
	}

	draw(ctx, ctxTemp) {
		if (!this.needResize) return;
		let px = this.posX;
		let py = this.posY;
		let w = this.width;
		let h = this.height;
		ctx.strokeStyle = "rgb(100, 168, 209)";
		ctx.lineWidth = 1;
		ctx.beginPath();

		// Рисуем линии в зависимости от стороны ресайза
		switch (this.resize) {
			case 1: {
				ctx.moveTo(px, py);
				ctx.lineTo(px + w, py);
				break;
			}
			case 3: {
				ctx.moveTo(px + w, py);
				ctx.lineTo(px + w, py + h);
				break;
			}
			case 5: {
				ctx.moveTo(px, py + h);
				ctx.lineTo(px + w, py + h);
				break;
			}
			case 7: {
				ctx.moveTo(px, py);
				ctx.lineTo(px, py + h);
				break;
			}
		}
		ctx.stroke();

		let radius = 5;
		let shiftX = [w / 2, w, w, w, w / 2, 0, 0, 0];
		let shiftY = [0, 0, h / 2, h, h, h, h / 2, 0];
		for (let i = 0; i < shiftX.length; ++i) {
			if (i + 1 != this.resize) continue;
			if (this.resize == 0) continue;
			this.drawCircle(ctx, px + shiftX[i], py + shiftY[i], radius, "rgb(100, 168, 209)");
		}
	}

	drawCircle(ctx, x, y, radius, color) {
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	onMake() {
		let childHtml = "";

		if (!this.needResize) return ``;
		let radius = 5;
		let px = this.posX;
		let w = this.width + this.paddingLeft + this.paddingRight;
		let h = this.height + this.paddingTop + this.paddingBottom;

		let t = 0;
		let l = 0;
		let drW = 0;
		let drH = 0;
		let drawLine = false;
		// Рисуем линии в зависимости от стороны ресайза
		switch (this.resize) {
			case 1:
				{		//T
					drW = w;
					drawLine = true;
					break;
				}
			case 3:
				{		//R
					l = w - radius;
					drH = h;
					drawLine = true;

					break;
				}
			case 5:
				{		//B
					t = h - radius;
					drW = w;
					drawLine = true;

					break;
				}
			case 7:
				{		//L
					drH = h;
					drawLine = true;

					break;
				}
		}

		if (drawLine) {
			childHtml += `<div style="
								border: solid rgb(100, 168, 209) 1px;
								background: rgba(100, 168, 209, 0.5);
								top: 	${(t) + "px"};
								left: 	${(l) + "px"};
								width:	${(drW) + "px"};
								height:	${(drH) + "px"};
								position:absolute;
								"></div>`;

		}

		// Точки ресайза
		let shiftT = [0, 0, h / 2, h, h, h, h / 2, 0];
		let shiftL = [w / 2, w, w, w, w / 2, 0, 0, 0];
		for (let i = 0; i < shiftT.length; ++i) {
			if (i + 1 != this.resize) continue;
			if (this.resize == 0) continue;
			childHtml += `<div style="
									border: solid rgb(100, 168, 209) 1px;
									border-radius: ${(radius / 2) + "px"};
									background: rgba(100, 168, 209, 0.5);
									top: 	${(shiftT[i] - radius) + "px"};
									left: 	${(shiftL[i] - radius) + "px"};
									width:	${(radius) + "px"};
									height:	${(radius) + "px"};
									position:absolute;
									"></div>`;

		}

		return childHtml;

	}

}
class WidgetWindow extends BaseWidget {

	constructor() {
		super();

	}

onCreate() {
	this.isIncrease = false;
	this.isProjection = false;
	this.widthProjection = -1;
	this.maxSize = false;
	this.errorAttach = 25;
	// this.customButtons = {};
	this.active = false;
	this.needMove = false;
	// this.startMousePos = new Rex.Vector2(0, 0);//TODO: need think?
	// this.startMove = new Rex.Vector2(0, 0);//TODO: need think?
	this.startMousePos = { x: 0, y: 0 };
	this.startMove = { x: 0, y: 0 };

	this.minHeight = 25;
	this.minWidth = 25;

	this.minContentWidth = 0;
	this.minContentHeight = 0;

	this.horizontalSizePolicy = 0;
	this.verticalSizePolicy = 0;

	this.horizontalAlignType = 0;
	this.verticalAlignType = 0;

	this._enableHeader = null;
	this.needAttach = true;
	this.needUnAttach = true;

	this.resizer = new Resizer(this); //TODO: need think?
	this.blockResizer = false;

	this.isIncrease = false;
	this.isProjection = false;
	this.widthProjection = -1;
	this.maxSize = false;
	this.errorAttach = 25;
	// this.customButtons = {};
	this.active = false;

	// this.createDomElement("div");
	this.addClassName("WidgetWindow");

	this.contentElement = document.createElement("div");
	this.contentElement.classList.add("WindowContent");
	this.htmlElement.appendChild(this.contentElement);

	this.contetnContainerElement = document.createElement("div");
	this.contetnContainerElement.id = "wcc_" + this.id;
	this.contetnContainerElement.classList.add("WidgetWindowContainer");
	this.contentElement.appendChild(this.contetnContainerElement);

	this.headerElement = undefined;
	this.headerTextElement = undefined;

	this.minElement = undefined;
	this.maxElement = undefined;
	this.closeElement = undefined;

	window.addEventListener("resize", (event) => {
		if (this.verticalSizePolicy == 2) this.height = window.innerHeight;
		if (this.horizontalSizePolicy == 2) this.width = window.innerWidth;
		if (this.horizontalAlignType == 1) this.posX = 0;
		if (this.horizontalAlignType == 3) this.posX = window.innerWidth - this.width;
		if (this.verticalAlignType == 1) this.posY = 0;
		if (this.verticalAlignType == 3) this.posY = window.innerHeight - this.height;
	});
	this.createHeader();

	this.outerShielding = null;
	this.innerShielding = null;

}

	eventHandler(eventType, eventObject) {

		/*eventObject.persist();
		console.log('eventHandler', eventType, eventObject.target.value, eventObject.target);
		Module.Store.dispatch({
			'eventName': this.props.widgets[this.id].events[eventType],
			'value': eventObject
		});*/
	}

	render() {

		/*const widget = this.props.widgets[this.id];

		let eventAttributes = {};
		
		
		for (let eventName in widget.events) {
			eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
		}*/
		
		// return (
		// 	// Base Window Html
		// 	<div
		// 		id={this.id}
		// 		className="WidgetWindow"
		// 		{...widget.attributes}
		// 		{...eventAttributes}
		// 	>
		// 		<div
		// 			id={"contentWindow_" + this.id}
		// 			className="WindowContent"
		// 		>
		// 			<div
		// 				id={"wcc_" + this.id}
		// 				className="WidgetWindowContainer"
		// 			>
						
		// 			</div>
		// 		</div>
		// 	</div>
		// );

	}
	
	onComponentDidMount() {
		// console.log("MOUNTED", document.getElementById(this.html_id));
		
		// // this.htmlElement = document.getElementById("divWindow_" + this.id);
		
		// this.contentElement = document.getElementById("contentWindow_" + this.id);
		// this.contetnContainerElement = document.getElementById("wcc_" + this.id);
		// this.isIncrease = false;
		// this.isProjection = false;
		// this.widthProjection = -1;
		// this.maxSize = false;
		// this.errorAttach = 25;
		// // this.customButtons = {};
		// this.active = false;
		// this.needMove = false;
		// // this.startMousePos = new Rex.Vector2(0, 0);//TODO: need think?
		// // this.startMove = new Rex.Vector2(0, 0);//TODO: need think?
		// this.startMousePos = {x: 0, y: 0};
		// this.startMove = { x: 0, y: 0 };

		// this.minHeight = 25;
		// this.minWidth = 25;

		// this.minContentWidth = 0;
		// this.minContentHeight = 0;

		// this.horizontalSizePolicy = 0;
		// this.verticalSizePolicy = 0;

		// this.horizontalAlignType = 0;
		// this.verticalAlignType = 0;

		// this.enableHeader = null;
		// this.needAttach = true;
		// this.needUnAttach = true;

		// // this.resizer = new Resizer(this); //TODO: need think?
		// this.blockResizer = false;


		
		// window.addEventListener("resize", (event) => {
		// 	if (this.verticalSizePolicy == 2) this.height = window.innerHeight;
		// 	if (this.horizontalSizePolicy == 2) this.width = window.innerWidth;
		// 	if (this.horizontalAlignType == 1) this.posX = 0;
		// 	if (this.horizontalAlignType == 3) this.posX = window.innerWidth - this.width;
		// 	if (this.verticalAlignType == 1) this.posY = 0;
		// 	if (this.verticalAlignType == 3) this.posY = window.innerHeight - this.height;
		// });
		// this.createHeader();
		// this.htmlElement.style.padding = null;

		// this.controlHeaderColor(this.backgroundHeader);
		// this.controlContainerColor();
		// this.controlBColor();
		// this.updateCustomButtons();
		// this.controlIconName();

		// this.outerShielding = null;
		// this.innerShielding = null;


		// this.htmlElement.parentThis = this;
		
		
	}

	setColorContainer(color){
		this.backgroundContainer = color;
		this.controlContainerColor();
	}
	
	controlContainerColor() {
		if (this.contetnContainerElement != null) this.contetnContainerElement.style.background = this.backgroundContainer;
	}

	onCheckChildrens() {
		for (const id of this.children) {
			const child = ReactComponent[id];
			if (child && child.htmlElement) {
				this.contetnContainerElement.appendChild(child.htmlElement);
			}
		}
	}
	
	inverseEnableHeader(){
		this.setEnableHeader(!this._enableHeader);
	}

	controlFontSize() {
		this.htmlElement.style.fontSize = null;
		if (this.headerTextElement != null) this.headerTextElement.style.fontSize = this.fontSize + "px";
		if (this.headerElement != null) {
			this.headerElement.style.fontSize = this.fontSize + "px";
			// t
			let H = parseInt(this.headerElement.innerHeight);
			this.contetnContainerElement.style.height = "calc(100% - " + (H) + "px)";

			let size = H / 1.8;

			for (let i = 0; i < this.leftButtonsContainer.childNodes.length; ++i) {
				let e = this.leftButtonsContainer.childNodes[i];
				if (e == null) continue;
				e.style.height = size + "px";
				e.style.width = size + "px";
				e.style.borderRadius = size / 2 + "px";
				e.style.lineHeight = size + "px";
				e.style.fontSize = size + "px";
			}

			for (let i = 0; i < this.rightButtonsContainer.childNodes.length; ++i) {
				let e = this.rightButtonsContainer.childNodes[i];
				if (e == null) continue;
				e.style.height = size + "px";
				e.style.width = size + "px";
				e.style.borderRadius = size / 2 + "px";
				e.style.lineHeight = size + "px";
				e.style.fontSize = size + "px";
			}

		} else {
			this.contetnContainerElement.style.height = "100%";
		}
		
	}
	
	set enableHeader(value) {
		if (this._enableHeader == value) return;
		this._enableHeader = value;
		if (value) {
			this.contentElement.classList.remove("withoutHeader");
			this.contentElement.classList.add("WithHeader");
			if (this.headerElement == undefined)
				this.createHeader();
		} else {
			this.contentElement.classList.add("withoutHeader");
			this.contentElement.classList.remove("WithHeader");
			if (this.headerElement != undefined) {
				this.contentElement.removeChild(this.headerElement);
				this.headerElement = undefined;
			}
		}
		if (this.contetnContainerElement != null) {
			let H = 0;
			if (this.headerElement != null)
				H = parseInt(this.headerElement.offsetHeight);

			this.contetnContainerElement.style.height = "calc(100% - " + (H) + "px)";
		}
	}

	createHeader() {
		if (!this._enableHeader)
			return;

		this.headerElement = document.createElement("div");
		this.contentElement.insertBefore(this.headerElement, this.contetnContainerElement);
		this.headerElement.className = "TopBar";

		// LEFT BUTTONS
		this.leftButtonsContainer = document.createElement("div");
		this.leftButtonsContainer.classList.add("WidgetWindowLeftButtonsContainer");
		this.headerElement.appendChild(this.leftButtonsContainer);

		// TEXT
		this.textContainer = document.createElement("div");
		this.textContainer.className = "WidgetWindowHeaderTextContainer";
		this.headerElement.appendChild(this.textContainer);

		this.headerTextElement = document.createElement("div");
		this.headerTextElement.className = "HeaderTextWindow";
		this.headerTextElement.innerText = this.header;
		this.textContainer.appendChild(this.headerTextElement);

		this.headerIconElement = document.createElement("div");
		this.headerIconElement.className = "IconTextWindow";
		this.headerIconElement.innerText = this.iconName;
		this.textContainer.appendChild(this.headerIconElement);

		// RIGHT BUTTONS
		this.rightButtonsContainer = document.createElement("div");
		this.rightButtonsContainer.classList.add("WidgetWindowRightButtonsContainer");
		this.headerElement.appendChild(this.rightButtonsContainer);

		this.minElement = document.createElement("span");
		this.minElement.className = "MinBtn";
		this.minElement.innerText = "remove";
		this.minElement.title = "Minimize Window";

		this.maxElement = document.createElement("span");
		this.maxElement.className = "MaxBtn";
		this.maxElement.title = "Maximize Window";
		this.maxElement.innerText = "web_asset";

		this.closeElement = document.createElement("span");
		this.closeElement.className = "XBtn";
		this.closeElement.innerText = "close";
		this.closeElement.title = "Close Window";

		this.rightButtonsContainer.appendChild(this.minElement);
		this.rightButtonsContainer.appendChild(this.maxElement);
		this.rightButtonsContainer.appendChild(this.closeElement);

		this.controlAlign();
		this.controlTextColor();
		this.updateCustomButtons();
		this.backgroundHeader = "green";
		this.backgroundContainer = "white";
		this.headerElement.style.background = this.backgroundHeader;
		this.contetnContainerElement.style.background = this.backgroundContainer;
	}

	controlIconName() {
		if (this.headerElement == null) return;
		this.headerIconElement.textContent = this.iconName;
	}

	controlTextColor() {
		if (this.headerElement == null) return;
		this.headerTextElement.style.color = this.textColor;
		this.headerIconElement.style.color = this.textColor;
		this.htmlElement.style.color = null;

		this.headerElement.style.color = this.textColor;
	}

	updateCustomButtons() {
		if (this.headerElement == null) return;

		this.controlHeaderColor(this.backgroundHeader);

		for (let i = 0; i < this.leftButtonsContainer.childNodes.length; ++i) {
			let btn = this.leftButtonsContainer.childNodes[i];
			if (btn == null) continue;
			btn.remove();
			i--;
		}

		if (null == this.customButtons)
			return;

		for (let key of Object.keys(this.customButtons)) {
			// for (let btn of this.customButtons) {
			let btn = this.customButtons[key];
			if (null == btn)
				continue;

			let elem = document.createElement("span");
			elem.className = "WidgetWindowLeftButton";
			elem.title = btn.buttonName;
			elem.style.background = btn.buttonColor;
			elem.innerText = btn.iconName;
			elem.style.color = btn.iconColor;
			this.leftButtonsContainer.appendChild(elem);
		}

		this.controlFontSize();

	}
	onSetHeader(value){
		this.headerTextElement.innerText = value;
	}
	get enableHeader() {
		return this._enableHeader;
	}

	controlHeaderColor(stateValue) {
		if (this.headerElement == null) return;
		for (let i = 0; i < this.leftButtonsContainer.childNodes.length; ++i) {
			let e = this.leftButtonsContainer.childNodes[i];
			if (e == null) continue;
			e.style.background = stateValue;
			e.style.filter = "brightness(110%)";
		}

		for (let i = 0; i < this.rightButtonsContainer.childNodes.length; ++i) {
			let e = this.rightButtonsContainer.childNodes[i];
			if (e == null) continue;
			e.style.background = stateValue;
			e.style.filter = "brightness(110%)";
		}
		this.headerElement.style.background = stateValue;
	}

	controlFontStyle() {
		let italic = "";
		if (this.fontItalic) italic = "italic";
		if (this.headerTextElement != null) this.headerTextElement.style.fontStyle = italic;
		// this.headerElement.style.fontStyle = italic;

		let bold = "";
		if (this.fontBold) bold = "bold";
		if (this.headerTextElement != null) this.headerTextElement.style.fontWeight = bold;
		// this.headerElement.style.fontWeight = bold;

		let decoration = this.textDecorationType;
		if (this.headerTextElement != null) this.headerTextElement.style.textDecoration = decoration;

		this.htmlElement.style.fontWeight = null;
		this.htmlElement.style.fontStyle = null;
		this.htmlElement.style.textDecoration = null;

	}

	controlAlign() {

		if (!this._enableHeader) return;
		if (this.textAlign == 0) this.headerTextElement.innerText = "";
		else this.headerTextElement.innerText = this.header;
		switch (this.textAlign) { //justify-content: center;
			case 0: // TEXT NONE
				this.headerIconElement.style.width = "100%";
				if (this.textContainer.contains(this.headerTextElement)) this.textContainer.removeChild(this.headerTextElement);
				if (!this.textContainer.contains(this.headerIconElement)) this.textContainer.appendChild(this.headerIconElement);
				break;
			case 1: // TEXT LEFT
				this.headerIconElement.style.width = "30%";
				this.headerTextElement.style.width = "70%";
				if (this.textContainer.contains(this.headerTextElement)) this.textContainer.removeChild(this.headerTextElement);
				if (this.textContainer.contains(this.headerIconElement)) this.textContainer.removeChild(this.headerIconElement);
				this.textContainer.appendChild(this.headerTextElement);
				this.textContainer.appendChild(this.headerIconElement);
				break;
			case 2: // TEXT CENTER
				this.headerTextElement.style.width = "100%";
				if (this.textContainer.contains(this.headerIconElement)) this.textContainer.removeChild(this.headerIconElement);
				if (!this.textContainer.contains(this.headerTextElement)) this.textContainer.appendChild(this.headerTextElement);
				break;
			case 3: // TEXT RIGHT
				this.headerIconElement.style.width = "30%";
				this.headerTextElement.style.width = "70%";
				if (this.textContainer.contains(this.headerTextElement)) this.textContainer.removeChild(this.headerTextElement);
				if (this.textContainer.contains(this.headerIconElement)) this.textContainer.removeChild(this.headerIconElement);
				this.textContainer.appendChild(this.headerIconElement);
				this.textContainer.appendChild(this.headerTextElement);
				break;
		}
	}


	contains(node) {
		return this.contetnContainerElement.contains(node);
	}

	removeChild(node) {
		return this.contetnContainerElement.removeChild(node);
	}

	setHorizontalAlignType(value) {
		if (this.horizontalAlignType == value) return;
		this.horizontalAlignType = value;
		// if (value) Rex.callRpcMethod("Widgets", this.id, this.type, "setPosX", [this.posX]);
		// Rex.callRpcMethod("Widgets", this.id, this.type, "setHorizontalAlignType", [value]);
	}

	setVerticalAlignType(value) {
		if (this.verticalAlignType == value) return;
		this.verticalAlignType = value;
		// if (value) Rex.callRpcMethod("Widgets", this.id, this.type, "setPosY", [this.posY]);
		// Rex.callRpcMethod("Widgets", this.id, this.type, "setVerticalAlignType", [value]);
	}

	setWidgetAlign(horizontal, vertical) {
		if (this.horizontalAlignType == horizontal && this.verticalAlignType == vertical) return;
		this.horizontalAlignType = horizontal;
		this.verticalAlignType = vertical;
		// if (horizontal) Rex.callRpcMethod("Widgets", this.id, this.type, "setPosX", [this.posX]);
		// if (vertical) Rex.callRpcMethod("Widgets", this.id, this.type, "setPosY", [this.posY]);
		// Rex.callRpcMethod("Widgets", this.id, this.type, "setWidgetAlign", [horizontal, vertical]);
	}

	setHorizontalSizePolicy(value) {
		if (this.horizontalSizePolicy == value) return;
		this.horizontalSizePolicy = value;
		// if (value) Rex.callRpcMethod("Widgets", this.id, this.type, "setWidth", [this.width]);
		// Rex.callRpcMethod("Widgets", this.id, this.type, "setHorizontalSizePolicy", [value]);
	}

	setVerticalSizePolicy(value) {
		if (this.verticalSizePolicy == value) return;
		this.verticalSizePolicy = value;
		// if (value) Rex.callRpcMethod("Widgets", this.id, this.type, "setHeight", [this.height]);
		// Rex.callRpcMethod("Widgets", this.id, this.type, "setVerticalSizePolicy", [value]);
	}

	setSizePolicy(horizontal, vertical) {
		if (this.horizontalSizePolicy == horizontal && this.verticalSizePolicy == vertical) return;
		this.horizontalSizePolicy = horizontal;
		this.verticalSizePolicy = vertical;
		// if (horizontal) Rex.callRpcMethod("Widgets", this.id, this.type, "setWidth", [this.width]);
		// if (vertical) Rex.callRpcMethod("Widgets", this.id, this.type, "setHeight", [this.height]);
		// Rex.callRpcMethod("Widgets", this.id, this.type, "setSizePolicy", [horizontal, vertical]);
	}

	set elevation(value) {
		if ((value == null) || (this.elevation == value)) return;
		this.elevation = value;
		this.contentElement.style.boxShadow = `var(--elevation-${value})`;
	}

	controlBColor() {
		this.contentElement.style.background = this._backgroundColor;
	}

	appendChild(node) {
		if (node == null) return;
		node.style.position = "";

		let childId = node.id;
		let findIndex = this.children.indexOf(parseInt(childId));
		if (findIndex != -1 && findIndex < this.children.length - 1) {
			let nextChildId = this.children[findIndex + 1];
			let nextChild = Rex.widgets[nextChildId];
			if (nextChild != null && nextChild.htmlElement != null && this.contetnContainerElement == nextChild.htmlElement.parentNode) {
				this.contetnContainerElement.insertBefore(node, nextChild.htmlElement);
				return;
			}
		}

		this.contetnContainerElement.appendChild(node);
	}

	// Область возможного заполнения
	createProjectionWindow(x, y, w, h) {
		let container = document.getElementById("container1");
		if (container == null) return;
		let projection = document.getElementById("ProjectionWindow" + (this.id));
		if (projection == undefined) {
			projection = document.createElement("div");
			projection.className = "ProjectionWindow";
			projection.id = "ProjectionWindow" + (this.id);
			container.appendChild(projection);
		}
		projection.style.top = y + "px";
		projection.style.left = x + "px";
		projection.style.width = w + "px";
		projection.style.height = h + "px";
		this.isProjection = true;
		this.widthProjection = w;
	}

	deleteProjectionWindow() {
		let container = document.getElementById("container1");
		if (container == null) return;
		let projection = document.getElementById("ProjectionWindow" + (this.id));
		if (projection != undefined) {
			container.removeChild(projection);
			this.isProjection = false;
			this.widthProjection = -1;
		}
	}

	maximize_v1(func = "maximize", animation = true) {
		if (animation) this.htmlElement.style.transition = ".5s";
		if ((this.maxSize && func == "maximize") || (this.isIncrease && func == "increase")) {
			this.setSizePolicy(this.normalsize.horizontalSizePolicy, this.normalsize.verticalSizePolicy);
			this.setWidgetAlign(this.normalsize.horizontalAlign, this.normalsize.verticalAlign);
			this.setGeometry(this.normalsize.posX, this.normalsize.posY, this.normalsize.width, this.normalsize.height);
			this.posX = this.normalsize.posX;
			this.posY = this.normalsize.posY;
			this.width = this.normalsize.width;
			this.height = this.normalsize.height;
			this.isIncrease = false;
			this.maxSize = false;
			this.maxElement.innerText = "web_asset";
			this.maxElement.title = "Maximize Window";
		} else {
			if (!this.isIncrease)
				this.normalsize = {
					posX: this.posX,
					posY: this.posY,
					width: this.width,
					height: this.height,
					verticalAlign: this.verticalAlignType,
					horizontalAlign: this.horizontalAlignType,
					horizontalSizePolicy: this.horizontalSizePolicy,
					verticalSizePolicy: this.verticalSizePolicy
				};
			if (func == "maximize") {
				this.setSizePolicy(2, 2); //FullScreen;
				this.setHorizontalAlignType(1);
				this.setVerticalAlignType(1);
				this.isIncrease = false;
				this.maxSize = true;
				this.maxElement.innerText = "filter_none";
				this.maxElement.title = "Reduce Window";
			} else if (func == "increase") {
				this.htmlElement.style.width = window.innerWidth / 2;
				this.width = window.innerWidth / 2;
				this.htmlElement.style.left = "calc(100% - " + (this.width) + "px)";
				// Rex.callRpcMethod("Widgets", this.id, this.type, "setWidth", [this.width]);
				this.setVerticalSizePolicy(2); //FullScreen;
				this.setVerticalAlignType(1);

				// if(this.horizontalAlignType == 3) {
				// 	this.posX = window.innerWidth / 2;
				// 	Rex.callRpcMethod('Widgets', this.id, this.type, 'setPosX', [this.posX]);
				// }
				this.maxSize = false;
				this.isIncrease = true;
			}
		}
		if (animation) setTimeout(() => {
			this.htmlElement.style.transition = null;
		}, 500);
	}

	onNeedAttach(x, y) {

		let borderX = 0;
		let borderY = 0;
		let borderW = window.innerWidth;
		let borderH = window.innerHeight;

		if (this.parentId != -1) {
			let parentWidget = Rex.widgets[this.parentId];
			if (parentWidget != null) {
				let rect = parentWidget.htmlElement.getBoundingClientRect();

				borderX = rect.left;
				borderY = rect.top;
				borderW = rect.left + rect.width;
				borderH = rect.top + rect.height;
			}
		}

		let pT = this.paddingTop;
		let pB = this.paddingBottom;
		let pL = this.paddingLeft;
		let pR = this.paddingRight;

		if (y < (this.errorAttach + borderY)) {	// --- TOP ---

			if (this.verticalAlignType != 1)
				this.setVerticalAlignType(1);

			if (!this.maxSize && (!this.isProjection || (borderW - pL - pR) > this.widthProjection)) //create Top projection even if exist Left or Right projection
				this.createProjectionWindow(borderX + pL,
					borderY + pT,
					borderW - pL - pR,
					borderH - pT - pB);
			return;
		} else if (borderH - this.errorAttach < y) {	// --- BOTTON ---
			if (this.verticalAlignType != 3)
				this.setVerticalAlignType(3);

			if (!this.maxSize && (!this.isProjection || (borderW - pL - pR) > this.widthProjection)) //create Top projection even if exist Left or Right projection
				this.createProjectionWindow(borderX + pL,
					borderY + pT,
					borderW - pL - pR,
					borderH - pT - pB);
			return;
		} else if (x < (this.errorAttach + borderX)) {	// --- LEFT ---
			if (this.horizontalAlignType != 1)
				this.setHorizontalAlignType(1);

			if (!this.isProjection && !this.isIncrease)
				this.createProjectionWindow(borderX + pL, borderY + pT, (borderW / 2 - pL - pR), (borderH - pT - pB));

			return;
		} else if (borderW - this.errorAttach < x) {	// --- RIGHT ---

			if (this.horizontalAlignType != 3)
				this.setHorizontalAlignType(3);

			if (!this.isProjection && !this.isIncrease)
				this.createProjectionWindow(borderW / 2 + pL, borderY + pT, borderW / 2 - pL - pR, borderH - pT - pB); // height

			return;
		}

		// delete Top projection
		if (this.isProjection && y >= pT)
			this.deleteProjectionWindow();

		if (this.isProjection && (this.widthProjection < borderW - pL - pR) &&
			x >= pL && x <= borderW - pR) // delete !Top projection
			this.deleteProjectionWindow();

		if ((x > 2 * this.errorAttach) && (borderW - 2 * this.errorAttach > x)) {
			if (this.isIncrease && !(this.startMousePos.x == x && this.startMousePos.y == y)) {
				this.normalsize.posX = x - this.normalsize.width / 2;
				this.normalsize.posY = 0;
				if (this.normalsize.horizontalAlign != 0) this.normalsize.horizontalAlign = 0;
				if (this.normalsize.verticalAlign != 0) this.normalsize.verticalAlign = 0;
				this.startMove.x = this.normalsize.posX;
				this.startMove.y = this.normalsize.posY;
				this.maximize_v1("increase", false);
			}
			if (this.horizontalAlignType != 0) {
				if (this.needUnAttach) this.setHorizontalAlignType(0);
			}
		}

		if ((this.startMousePos.x != x || this.startMousePos.y != y) && y > this.errorAttach) {

			if (this.maxSize) {
				this.normalsize.posX = x - this.normalsize.width / 2;
				this.normalsize.posY = 0;
				if (this.normalsize.horizontalAlign != 0) this.normalsize.horizontalAlign = 0;
				if (this.normalsize.verticalAlign != 0) this.normalsize.verticalAlign = 0;
				this.startMove.x = this.normalsize.posX;
				this.startMove.y = this.normalsize.posY;
				this.maximize_v1("maximize", false);
			}
			if ((y > 2 * this.errorAttach) && (borderH - 2 * this.errorAttach > y)) {
				if (this.verticalAlignType != 0)
					if (this.needUnAttach) this.setVerticalAlignType(0);
			}
		}

	}

	onFocused(f) {
		this.active = f;
		if (f) {
			this.htmlElement.style.zIndex = null;
			this.htmlElement.classList.add("WidgetWindowActive");
		} else {
			this.htmlElement.style.zIndex = this.order;
			this.htmlElement.classList.remove("WidgetWindowActive");
		}
	}

	onMouseDoubleClick(event) {
		if (event.target.className == "MaxBtn" || event.target.className == "XBtn" || event.target.className == "MinBtn" || event.target.className == "WidgetWindowLeftButton") return;

		// if(event.x == this.startMousePos.x && event.y == this.startMousePos.y)
		// if((event.x > this.posX + 10) && (event.x < this.posX + this.width - 10) //check is header, 10 it's padding
		// 	&& (event.y > this.posY + 10)) {
		const path = event.path || (event.composedPath && event.composedPath());
		if (path.indexOf(this.headerElement) != -1) { //проверить на хидере ли курсор
			if (this.isIncrease) {
				this.maximize_v1("increase");
			} else this.maximize_v1();
		}
	}

	onMouseUp(x, y, event) {
		if (event.target.className == "MaxBtn" || event.target.className == "MaxBtnSpan") {
			this.maximize_v1();
			// Rex.callRpcMethod("Widgets", this.id, this.type, "maximizeWindow", []);
			return;
		}
		if (event.target.className == "XBtn" || event.target.className == "XBtnSpan") {
			// Rex.callRpcMethod("Widgets", this.id, this.type, "closeWindow", []);
			return;
		}
		if (event.target.className == "MinBtn" || event.target.className == "MinBtnSpan") {
			// Rex.callRpcMethod("Widgets", this.id, this.type, "minimizeWindow", []);
			return;
		}

		if (event.target.className == "WidgetWindowLeftButton") {
			// Rex.callRpcMethod("Widgets", this.id, this.type, "pressCustomButton", [event.target.title]);
			return;
		}

		if (this.isProjection) {
			this.deleteProjectionWindow();

			if ((x < this.paddingLeft) || (x > this.htmlElement.parentElement.offsetWidth - this.paddingRight)) {
				if (this.horizontalAlignType % 2 == 1 && this.needAttach && !this.maxSize && !this.isIncrease) {
					this.maximize_v1("increase");
				}
			} else {
				if (this.needAttach && !this.maxSize) {
					this.maximize_v1();
				}
			}

		} else {
			if ((this.maxSize || this.isIncrease))
				if (this.width != this.startWidth || this.height != this.startHeight) { // окно поменяло размер
					console.log("mouseUp");
					if (this.height != this.startHeight) this.setVerticalSizePolicy(0); //fixed
					if (this.width != this.startWidth) this.setHorizontalSizePolicy(0);
					if (this.needAttach) {
						// this.setVerticalAlignType(0); //none
						// this.setHorizontalAlignType(0);
						this.setWidgetAlign(0, 0); //none
					} else {
						if (this.height != this.startHeight && this.posY != 0) this.setVerticalAlignType(0); //none
						if (this.width != this.startWidth) {
							if (this.horizontalAlignType == 1 && this.posX != 0) this.setHorizontalAlignType(0); //none
							if (this.horizontalAlignType == 3 && this.posX == window.innerWidth / 2) this.setHorizontalAlignType(0);
						}
					}
					this.normalsize = {
						posX: this.posX,
						posY: this.posY,
						width: this.width,
						height: this.height,
						verticalAlign: this.verticalAlignType,
						horizontalAlign: this.horizontalAlignType,
						horizontalSizePolicy: this.horizontalSizePolicy,
						verticalSizePolicy: this.verticalSizePolicy
					};
					this.isIncrease = false;
					this.maxSize = false;
				}
		}
	}

	destroy() {
		if (this.htmlElement == null) return;
		let parent = this.htmlElement.parentElement;
		if (parent == null) return;
		this.htmlElement.style.opacity = 0;
		setTimeout(() => {
			parent.removeChild(this.htmlElement);
			this.onDestroy();
		}, 250);

		this.updateFocus();
	}

	startMoving() {
		if (this.htmlElement == null) return;

		// IN
		if (this.innerShielding == null) {
			this.innerShielding = document.createElement("div");
			this.innerShielding.classList.add("WindowMovingShielding");
			this.innerShielding.addEventListener("mouseup", this.stopMoving.bind(this), false);
			this.htmlElement.appendChild(this.innerShielding);
		}
		// OUT
		if (this.outerShielding == null) {
			this.outerShielding = document.createElement("div");
			this.outerShielding.classList.add("WindowMovingShielding");
			this.outerShielding.style.height = window.innerHeight + "px";
			this.outerShielding.style.zIndex = 199;
			this.outerShielding.addEventListener("mouseup", this.stopMoving.bind(this), false);
			let containerElement = document.getElementById(this.container);
			if (containerElement) containerElement.appendChild(this.outerShielding);
		}

	}

	stopMoving() {
		if (this.innerShielding != null) this.innerShielding.removeEventListener("mouseup", this.stopMoving.bind(this), false);
		if (this.outerShielding != null) this.outerShielding.removeEventListener("mouseup", this.stopMoving.bind(this), false);

		let elements = document.getElementsByClassName("WindowMovingShielding");
		for (let i = 0; i < elements.length; ++i) {
			let e = elements[i];
			if (e == null) continue;
			e.remove();
			i--;
		}
		if (this.innerShielding != null) this.innerShielding.remove();
		if (this.outerShielding != null) this.outerShielding.remove();

		this.innerShielding = null;
		this.outerShielding = null;
	}

}
