class WidgetLabel extends BaseWidget {
  constructor() {
    super();
    // this.createDomElement("div");
    this.addClassName("WidgetLabel");

    try {
      new ResizeObserver(this.controlFontSize.bind(this)).observe(
        this.htmlElement
      );
    } catch (e) {}
  }

  onCreate() {
    this.htmlText = document.createElement("div");
    this.htmlText.className = "WidgetLabelText";
    this.htmlText.textContent = this.text;
	this.fontSize = "20px";
	this.fontWeight = 'normal'

    this.htmlElement.className = "WidgetLabel";
    this.htmlElement.appendChild(this.htmlText);

    try {
      new ResizeObserver(this.controlFontSize.bind(this)).observe(
        this.htmlElement
      );
    } catch (e) {}
  }

  onSetText(value) {
    if (this.htmlText) {
      this.htmlText.textContent = value;
    }
  }

  eventHandler(eventType, eventObject) {
    eventObject.persist();
    console.log(eventType, eventObject);
    Module.Store.dispatch({
      eventName: this.props.widgets[this.id].events[eventType],
      value: eventObject,
    });
  }

  set fontSize(value) {
	this._fontSize = value;
	this.htmlText.style.fontSize = value + "px";
  }
  //#region

  // render() {

  // 	const widget = this.props.widgets[this.id];

  // 	let eventAttributes = {};

  // 	for (let eventName in widget.events) {
  // 		eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
  // 	}

  // 	return (
  // 		// Base Label Html
  // 		<div
  // 			id={this.id}
  // 			className="WidgetLabel"
  // 			// {...widget.attributes}
  // 			// {...eventAttributes}
  // 		>
  // 			< div
  // 				id={"textLabel_" + this.id}
  // 				className= "WidgetLabelText"
  // 			>
  // 				{this.text}
  // 			</div>
  // 		</div>
  // 	);

  // }

  //#endregion

  onComponentDidMount() {
    // this.htmlText = document.getElementById("textLabel_" + this.id);
    // try {
    // 	new ResizeObserver(this.controlFontSize.bind(this)).observe(this.htmlElement);
    // } catch (e) { }
    // this.htmlText.textContent = this.text;
  }

  controlText(stateText) {
    let text = stateText;
    // try {
    // 	text = decodeURIComponent(escape(window.atob(stateText)));
    // } catch (e) {
    // 	console.log(this.type, "setState->", "Text DecodeError!", e, stateText);
    // 	return;
    // }

    this.text = text;
    if (!this.htmlElement.contains(this.htmlText)) {
      this.htmlElement.appendChild(this.htmlText);
    }

    if (this.iconName == "") this.htmlText.textContent = text;
  }

  controlIconName(stateIconName) {
    if (this.iconName == stateIconName) {
      return;
    }

    this.iconName = stateIconName;

    if (this.iconName == "") {
      this.htmlText.textContent = this.text;
      this.htmlText.classList.remove("MaterialIcon");
    } else {
      this.htmlText.textContent = stateIconName;
      this.htmlText.classList.add("MaterialIcon");
    }
  }

  controlVerticalTextAlign(stateTextAlign) {
    if (this.verticalTextAlign == stateTextAlign) return;
    this.verticalTextAlign = stateTextAlign;
    switch (stateTextAlign) {
      case 1: // TEXT TOP
        this.htmlText.style.alignItems = "flex-start";
        break;
      case 2: // TEXT CENTER
        this.htmlText.style.alignItems = "center";
        break;
      case 3: // TEXT BOTTOM
        this.htmlText.style.alignItems = "flex-end";
        break;
    }
  }

  controlHorizontalTextAlign(stateTextAlign) {
    if (this.horizontalTextAlign == stateTextAlign) return;

    switch (
      stateTextAlign //justify-content: center;
    ) {
      case 1: // TEXT LEFT
        this.htmlText.style.justifyContent = "flex-start";
        this.htmlText.style.textAlign = "left";
        break;
      case 2: // TEXT CENTER
        this.htmlText.style.justifyContent = "center";
        this.htmlText.style.textAlign = "center";
        break;
      case 3: // TEXT RIGHT
        this.htmlText.style.justifyContent = "flex-end";
        this.htmlText.style.textAlign = "right";
        break;
    }
  }

  controlFontSize(e) {
    if (!this.autoSize) {
      this.htmlText.style.fontSize = this.fontSize + "px";
      return;
    }

    let html = this.htmlElement;
    const ratio =
      html.clientWidth < html.clientHeight
        ? html.clientWidth / html.clientHeight
        : html.clientHeight / html.clientWidth;

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
      this.htmlText.style.fontSize = fontSize + "%";
    }
  }

  controlBreakWord(type) {
    if (type === 0) {
      this.htmlText.style.wordBreak = "normal";
    } else if (type == 1) {
      this.htmlText.style.wordBreak = "break-all";
    } else if (type == 2) {
      this.htmlText.style.wordBreak = "keep-all";
    } else if (type == 3) {
      this.htmlText.style.wordBreak = "break-word";
    }
  }


  set fontWeight(value) {
	this._fontWeight = value;
	this.htmlText.style.fontWeight = value;
  }

  set autoSize(value) {
    this._autoSize = value;
    if (!this.autoSize) this.htmlText.style.fontSize = this.fontSize + "px";
    else this.controlFontSize();
  }

  get autoSize() {
    return this._autoSize;
  }

  //This method can be invoked from C++ or neurone only
  ctrlWidgetSize(value) {
    if (value == null) return;
    if (value === 0) return;

    let html = this.htmlElement;
    if (value === 1 || value === 3) {
      while (html.scrollWidth > html.clientWidth) {
        if (html.style.minWidth === html.scrollWidth + "px") break;
        html.style.minWidth = html.scrollWidth + "px";
        html.style.maxWidth = html.scrollWidth + "px";
      }
    }
    if (value === 2 || value === 3) {
      while (html.scrollHeight > html.clientHeight) {
        if (html.style.minHeight === html.scrollHeight + "px") break;
        html.style.minHeight = html.scrollHeight + "px";
        html.style.maxHeight = html.scrollHeight + "px";
      }
    }
  }

  //This method can be invoked from C++ or neurone only
  ctrlFontSize() {
    let html = this.htmlText;
    while (
      html.scrollWidth > html.clientWidth ||
      html.scrollHeight > html.clientHeight
    ) {
      html.style.fontSize = parseInt(html.style.fontSize) - 1 + "px";
    }
  }
}
