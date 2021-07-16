class WidgetCheckBox extends BaseWidget {
  constructor() {
    super();

    // this.createDomElement("div");
  }

  onCreate() {
    this.htmlElement.className = "WidgetCheckBox";
    this.htmlContainer = document.createElement("div"); //Контейнер, в котором находятся все элементы виджета(CheckBox, Text, Icon)
    this.htmlContainer.classList.add("Content");
    this.htmlCheckContainer = document.createElement("div"); //Контейнер, в котором находятся все элементы CheckBox'a (Input, Label)

    this.inputElement = document.createElement("input");
    this.inputElement.type = "checkbox";
    this.inputElement.value = "None";
    this.inputElement.name = "check";
    // this.inputElement.addEventListener('click', e => {
    //   this.checked = this.inputElement.checked;
    // });
    //this.inputElement.disabled = true;

    this.labelElement = document.createElement("label");

    this.htmlText = document.createElement("div");
    this.htmlText.classList.add("WidgetCheckBoxText");

    this.htmlElement.appendChild(this.htmlContainer);
    this.htmlContainer.appendChild(this.htmlCheckContainer);

    this.htmlCheckContainer.appendChild(this.inputElement);
    this.htmlCheckContainer.appendChild(this.labelElement);

    this.htmlContainer.appendChild(this.htmlText);

    try {
      new ResizeObserver(
        function (event) {
          this.htmlText.style.width =
            "calc(" + 90 + "% - " + this._checkerSize + "px)";
          this.controlFontSize();
        }.bind(this)
      ).observe(this.htmlElement);
    } catch (e) {}
    this.checked = false;
    this.iconAlign = 0;
    this.icon = undefined;
    this.label = undefined;
    this.widthCheck = 17;
    this.heightCheck = 17;
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
      eventAttributes[eventName] = (event) =>
        this.eventHandler(eventName, event);
    }

    // return (
    // 	// Base CheckBox Html
    // 	<div
    // 		id={this.id}
    // 		className="WidgetCheckBox"
    // 		{...widget.attributes}
    // 		{...eventAttributes}

    // 	>
    // 		<div
    // 			id={"containerCheckBox_" + this.id}
    // 			className="Content"
    // 		>
    // 			<div
    // 				id={"checkContainerCheckBox_" + this.id}
    // 			>
    // 				<input
    // 					id={"inputCheckBox_" + this.id}
    // 					type="checkbox"
    // 					name="check"
    // 					// disabled="true"
    // 					// value={widget.textContent}
    // 				>
    // 				</input>
    // 				< label
    // 					id={"labelCheckBox_" + this.id}
    // 				>
    // 				</label>
    // 			</div>
    // 			<div
    // 				id={"textCheckBox_" + this.id}
    // 				className="WidgetCheckBoxText"
    // 			>
    // 				{widget.textContent}
    // 			</div>
    // 		</div>
    // 	</div>
    // );
  }

  onComponentDidMount() {
    // this.htmlContainer = document.getElementById("containerCheckBox_" + this.id);
    // this.htmlCheckContainer = document.getElementById("checkContainerCheckBox_" + this.id);
    // this.inputElement = document.getElementById("inputCheckBox_" + this.id);
    // this.labelElement = document.getElementById("labelCheckBox_" + this.id);
    // this.htmlText = document.getElementById("textCheckBox_" + this.id);
    // this.autoFontSize = true;
    // this.fontSize = 25;
    // this._checkerSize = 24;
    // this._lessHundred = false;
    // this.checked = false;
    // this.iconAlign = 0;
    // this.icon = undefined;
    // this.label = undefined;
    // this.widthCheck = 17;
    // this.heightCheck = 17;
    // try {
    // 	new ResizeObserver(function(event) {
    // 		this.htmlText.style.width = "calc(" + 90 + "% - " + this._checkerSize + "px)";
    // 		this.controlFontSize();
    // 	}.bind(this)).observe(this.htmlElement);
    // } catch (e) { }
  }

  controlFontSize() {
    if (!this.autoFontSize) {
      this.htmlElement.style.fontSize = this.fontSize + "px";
      return;
    }

    let html = this.htmlElement;
    const ratio =
      html.clientWidth < html.clientHeight
        ? html.clientWidth / html.clientHeight
        : html.clientHeight / html.clientWidth;
    const side = Math.max(html.clientWidth, html.clientHeight);
    const fontSize = side * ratio;

    if (fontSize < 100 && !this._lessHundred) html.style.fontSize = "100%";
    else html.style.fontSize = fontSize + "%";

    const newCheckerSize = fontSize / 3;
    if (newCheckerSize < this._checkerSize)
      this.controlCheckerSize(this._checkerSize);
    else this.controlCheckerSize(newCheckerSize, false);
  }

  controlCheckerSize(value, needSave = true) {
    if (needSave) this._checkerSize = value;

    switch (this._checkerStyle) {
      case 0:
      case 2:
      case 3:
      case 5:
        this.htmlCheckContainer.style.minWidth = value + "px";
        this.htmlCheckContainer.style.minHeight = value + "px";
        this.htmlCheckContainer.style.maxWidth = value + "px";
        this.htmlCheckContainer.style.maxHeight = value + "px";
        this._styleSizes = value;
        break;
      case 1:
        this.htmlCheckContainer.style.minWidth = value + "px";
        this.htmlCheckContainer.style.minHeight = value / 5 + "px";
        this.htmlCheckContainer.style.maxWidth = value + "px";
        this.htmlCheckContainer.style.maxHeight = value / 5 + "px";
        break;
      case 4:
        this.htmlCheckContainer.style.minWidth = value + "px";
        this.htmlCheckContainer.style.minHeight = value / 2 + "px";
        this.htmlCheckContainer.style.maxWidth = value + "px";
        this.htmlCheckContainer.style.maxHeight = value / 2 + "px";
    }

    if (this._checkerStyle === 0 || this._checkerStyle === 3) {
    } else if (this._checkerStyle === 1) {
      this._styleSizes = value;
    } else if (this._checkerStyle === 3) {
    }
  }

  controlText(stateText) {
    let text = stateText;
    // try { text = decodeURIComponent(escape(window.atob(stateText))); }
    // catch (e) { console.log(this.type, "setState->", "Text DecodeError!", e, stateText); return; }

    this.text = text;
    if (this.iconName == "") this.htmlText.innerText = text;
  }

  controlVerticalTextAlign(stateTextAlign) {
    if (this.verticalTextAlign == stateTextAlign) return;
    this.verticalTextAlign = stateTextAlign;
    switch (stateTextAlign) {
      case 1: // TEXT TOP
        this.htmlContainer.style.alignItems = "flex-start";
        break;
      case 2: // TEXT CENTER
        this.htmlContainer.style.alignItems = "center";
        break;
      case 3: // TEXT BOTTOM
        this.htmlContainer.style.alignItems = "flex-end";
        break;
    }
  }

  controlHorizontalTextAlign(stateTextAlign) {
    // if (stateTextAlign === 0) this.htmlText.innerText = "";
    // else this.htmlText.innerText = this.text;
    switch (stateTextAlign) {
      case 0: // NONE
        this.htmlText.style.textAlign = null;
        this.htmlContainer.style.justifyContent = null;
        break;
      case 1: // TEXT LEFT
        this.htmlText.style.textAlign = "left";
        this.htmlContainer.style.justifyContent = "left";
        break;
      case 2: // TEXT CENTER
        this.htmlText.style.textAlign = "center";
        this.htmlContainer.style.justifyContent = "center";
        break;
      case 3: // TEXT RIGHT
        this.htmlText.style.textAlign = "right";
        this.htmlContainer.style.justifyContent = "right";
        break;
    }
  }

  controlIconName(stateIconName) {
    if (this.iconName == stateIconName) return;
    this.iconName = stateIconName;

    if (this.iconName == "") {
      this.htmlText.textContent = this.text;
      this.htmlText.classList.remove("MaterialIcon");
      this.htmlText.classList.remove("MaterialIconOffset");
    } else {
      this.htmlText.textContent = stateIconName;
      this.htmlText.classList.add("MaterialIcon");
      this.htmlText.classList.add("MaterialIconOffset");
      this.htmlText.innerText = this.iconName;
    }
  }

  controlFontFamily(stateFontFamily) {
    this.htmlText.style.fontFamily = stateFontFamily;
  }

  getStyleType() {
    return this._checkerStyle;
  }

  controlStyle(stateStyle) {
    if (this._checkerStyle === stateStyle) return;
    this._checkerStyle = stateStyle;

    switch (stateStyle) {
      case 0:
        this.widgetStyleType = "CheckBox";
        this._isRadioButton = false;
        break;
      case 1:
        this.widgetStyleType = "Toggle";
        this._isRadioButton = false;
        break;
      case 2:
        this.widgetStyleType = "RadioButton";
        this._isRadioButton = true;
        break;
      case 3:
        this.widgetStyleType = "ClassicCheckBox";
        this._isRadioButton = false;
        break;
      case 4:
        this.widgetStyleType = "ClassicToggle";
        this._isRadioButton = false;
        break;
      case 5:
        this.widgetStyleType = "ClassicRadioButton";
        this._isRadioButton = true;
        break;
      default:
        return;
    }
    this.controlCheckerSize(this._checkerSize);
  }

  controlOrder(stateOrder) {
    this._widgetOrder = stateOrder;
    switch (stateOrder) {
      case 0:
        this.htmlCheckContainer.style.order = "0";
        this.htmlText.style.order = "1";
        this.htmlCheckContainer.style.left = "3%";
        this.htmlText.style.left = "7%";

        this.htmlCheckContainer.style.right = null;
        this.htmlText.style.right = null;
        break;
      case 1:
        this.htmlCheckContainer.style.order = "1";
        this.htmlText.style.order = "0";
        this.htmlCheckContainer.style.left = "3%";
        this.htmlText.style.left = "3%";
        break;
      default:
        return;
    }
  }

  set checked(value) {
    this.inputElement.checked = value;
    this._checked = value;

    if (value) {
      if (this.htmlCheckContainer.classList.contains("ClassicToggle")) {
        this.htmlCheckContainer.classList.add("ClassicToggleChecked");
      }
    } else {
      if (this.htmlCheckContainer.classList.contains("ClassicToggle")) {
        this.htmlCheckContainer.classList.remove("ClassicToggleChecked");
      }
    }
  }

  get checked() {
    return this._checked;
  }

  get checkedHTML() {
    return this.inputElement.checked;
  }

  // set id(value) {
  // 	if (this.id == value) return;
  // 	this.id = value;
  // 	this._id = value;
  // 	// this.htmlElement.id = "div" + value;
  // }

  set widgetStyleType(value) {
    if (!value) return;
    if (value.length === 0) return;

    this.htmlCheckContainer.className = value;
    this.inputElement.id = value;
    this.labelElement.htmlFor = value;
  }

  set autoFontSize(value) {
    if (value == null) return;
    this._autoFontSize = value;
    if (!value) {
      this.htmlElement.style.fontSize = this.fontSize + "px";
      this.controlCheckerSize(this._checkerSize);
    } else this.controlFontSize();
  }

  get autoFontSize() {
    return this._autoFontSize;
  }

  checkSelect() {
    return this.hover ? this.widget : undefined;
  }

  setChecked(value) {
    this.checked = value;
    this.update();
    if (value) {
      //this.animation.startAnimation();
      if (this.parentId != -1) {
        let p = Rex.widgets[this.parentId];
        if (p) {
          let children = p.children;
          for (let key in children) {
            let w = Rex.widgets[children[key]];
            if (!w) continue;
            if (w === this) continue;
            if (w.type === this.type && w.checked && w._isRadioButton) {
              w.setChecked(false);
            }
          }
        }
      } else {
        for (let key in Rex.widgets) {
          let w = Rex.widgets[key];
          if (!w) continue;
          if (w === this) continue;
          if (
            w.type === this.type &&
            w.checked &&
            w._isRadioButton &&
            w.parentId == -1
          ) {
            w.setChecked(false);
          }
        }
      }
    }
  }

  onHovered(hovered) {
    document.body.style.cursor = hovered ? "pointer" : "default";
  }

  onMouseDown(x, y, event) {
    if (event.which !== 1) return;
    this.checked = !this.checked;
    //this.startAnimation();

    if (this._isRadioButton) this.setChecked(true);
  }

  set lineHeight(value) {
    if (value == null) return;
    this.htmlElement.style.lineHeight = value + "%";
  }

  update() {}
}
