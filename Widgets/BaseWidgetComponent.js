// Created WidgetComponents widgets

if (typeof window.ReactComponent === "undefined") window.ReactComponent = {};

// BODY Users CSS storage
const CSSStyles = {};

/* global Module idWidgets*/
// eslint-disable-next-line no-unused-vars
class BaseWidget {
  // eslint-disable-next-line max-lines-per-function
  constructor() {
    this.id = "w_" + idWidgets++;
    ReactComponent[this.id] = this;

    const params = {};
    this._styleName = this.initValue("styleName", params, "");
    this._activated = true;
    this._visible = true;

    this._parentId = this.initValue("parentId", params, -1);
    this._children = this.initValue("children", params, []);

    this._posX = this.initValue("posX", params, "0px");
    this._posY = this.initValue("posY", params, "0px");
    this._width = this.initValue("width", params, "100px");
    this._height = this.initValue("height", params, "50px");

    this._minWidth = this.initValue("minWidth", params, "");
    this._minHeight = this.initValue("minHeight", params, "");
    this._maxWidth = this.initValue("maxWidth", params, "");
    this._maxHeight = this.initValue("maxHeight", params, "");

    this._textColor = this.initValue("textColor", params, "");
    this._textDecoration = this.initValue("textDecoration", params, "");
    this._textShadow = this.initValue("textShadow", params, "");
    this._fontFamily = this.initValue("fontFamily", params, "");
    this._fontSize = this.initValue("fontSize", params, "");
    this._fontItalic = this.initValue("fontItalic", params, "");
    this._fontBold = this.initValue("fontBold", params, "");

    this._borderSize = this.initValue("borderSize", params, "");
    this._borderType = this.initValue("borderType", params, "");
    this._borderColor = this.initValue("borderColor", params, "");
    this._borderRadius = this.initValue("borderRadius", params, "");

    this._background = this.initValue("background", params, "");

    this._text = this.initValue("text", params, "");
    this._header = this.initValue("header", params, "");
    this._hint = this.initValue("hint", params, "");

    this._elevation = "";
    this._iconName = "";

    this._isCanDeleted = true;
    this.create();
  }

  createDomElement(element) {
    this.htmlElement = document.createElement(element);
    this.htmlElement.id = this.id;
    this.htmlElement.style.visibility = "hidden";
    this.htmlElement.ondragover = (e) => e.preventDefault();
  }

  addClassName(value) {
    if (this.htmlElement == null) return;
    this.htmlElement.classList.add(value);
  }

  // eslint-disable-next-line class-methods-use-this
  initValue(key, props, defVal) {
    if (props != null && key in props) {
      return props[key];
    } else {
      return defVal;
    }
  }

  addCustomEvent(name, handler, value) {
    if (this.htmlElement) {
      let data = {
        e: null,
        value: null,
      };
      if (value || value === 0) data["value"] = value;
      this.htmlElement.addEventListener(name, (event) => {
        data["e"] = event;
        Module.Store.dispatch({
          eventName: handler,
          value: data,
        });
      });
    }
  }

  create() {
    this.htmlElement = document.createElement("div");
    this.htmlElement.id = this.id;

    this.onCreate();

    this.applyStyleProps();
    this.checkChildrens();

    if (this.parentId === -1) {
      const c = document.getElementById("formRoot");
      c.appendChild(this.htmlElement);
    }
  }

  onCreate() {}

  // componentDidMount() {
  // 	this.htmlElement = document.getElementById(this.id);
  // 	this.htmlElement.classList.add(this.styleName);
  // }

  applyStyleProps() {
    this.setStyleProp("left", this._posX);
    this.setStyleProp("top", this._posY);
    this.setStyleProp("width", this._width);
    this.setStyleProp("height", this._height);

    this.setStyleProp("minWidth", this._minWidth);
    this.setStyleProp("minHeight", this._minHeight);
    this.setStyleProp("maxWidth", this._maxWidth);
    this.setStyleProp("maxHeight", this._maxHeight);

    this.setStyleProp("color", this._textColor);
    this.setStyleProp("textDecoration", this._textDecoration);
    this.setStyleProp("textShadow", this._textShadow);
    this.setStyleProp("fontFamily", this._fontFamily);
    this.setStyleProp("fontSize", this._fontSize);
    this.setStyleProp("fontStyle", this._fontItalic);
    this.setStyleProp("fontWeight", this._fontBold);

    this.setStyleProp("borderWidth", this._borderSize);
    this.setStyleProp("borderStyle", this._borderType);
    this.setStyleProp("borderColor", this._borderColor);
    this.setStyleProp("borderRadius", this._borderRadius);

    this.setStyleProp("background", this._background);

    if (this._hint && this.htmlElement) {
      this.htmlElement.title = this._hint;
    }
  }

  setStyleProp(key, value) {
    if (value && this.htmlElement) {
      this.htmlElement.style[key] = value;
    }
  }

  eventHandler(eventType, eventObject) {
    eventObject.persist();
    console.log(
      "eventHandler",
      eventType,
      eventObject.target.value,
      eventObject.target
    );
    const eventHandlerName = this.props.widgets[this.id].events[eventType];
    if (eventHandlerName.toString().includes("function")) {
      // function
      //eventHandlerName template: function name(with/without params){operations;} param1; param2; ....; paramN
      let funcName = eventHandlerName
        .slice(eventHandlerName.indexOf(" "), eventHandlerName.indexOf("("))
        .trim();
      let runStr = eventHandlerName + " " + funcName;
      let paramsStr = "(";
      if (
        eventHandlerName.slice(
          eventHandlerName.indexOf("(") + 1,
          eventHandlerName.indexOf(")")
        ).length !== 0
      ) {
        let params = [];
        let index = -1;
        index = eventHandlerName.lastIndexOf("}");
        if (index === -1) {
          console.error("Error");
          return;
        }
        params = eventHandlerName
          .slice(index + 1, eventHandlerName.length)
          .trim()
          .split(";");
        let lastParam = params.pop();
        if (lastParam) params.push(lastParam);

        if (params.length === 0) {
          let requestTargetFields = eventHandlerName
            .slice(
              eventHandlerName.indexOf("(") + 1,
              eventHandlerName.indexOf(")")
            )
            .split(",");
          let lastField = requestTargetFields.pop();
          if (lastField) requestTargetFields.push(lastField);
          requestTargetFields.map((field) => {
            if (field === "nativeEventKey")
              paramsStr += '"' + eventObject.key + '",';
            else paramsStr += eventObject.target[field] + ",";
            //paramsStr += eventObject.event.key
          });
          if (paramsStr[paramsStr.length - 1] === ",")
            paramsStr = paramsStr.slice(0, paramsStr.length - 1);
        }

        runStr = runStr.slice(0, index + 1);
        runStr += " " + funcName;
        for (let i = 0; i < params.length; i++) {
          if (!params[i]) continue;
          paramsStr += params[i] + ",";
        }
        if (paramsStr[paramsStr.length - 1] === ",")
          paramsStr = paramsStr.slice(0, paramsStr.length - 1);
      }
      paramsStr += ");";
      runStr += paramsStr;
      console.log("runStr", runStr);

      try {
        eval(runStr);
      } catch (e) {
        console.error("Start handler function ERROR,", e);
      }
    } else if (!eventHandlerName) {
      // null
    } else {
      Module.Store.dispatch({
        eventName: eventHandlerName,
        value: eventObject,
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  includeWidget(widget) {
    if (!widget) {
      return;
    }

    if (widget.id === this.id) {
      return;
    }
    if (widget.isHidden) {
      return widget.setStyleProp("display", "block");
    }
    if (widget.parentId !== -1) {
      const parent = ReactComponent[widget.parentId];
      if (parent) {
        parent.removeChild(widget.id);
      }
    }

    this.children.push(widget.id);
    widget.parentId = this.id;

    //#region
    // remove store
    /*const { widgets } = Module.Store.getAll();
		const jsonWidget1 = widgets[this.id];
		const jsonWidget2 = widgets[widget.id];
		if (jsonWidget1 && jsonWidget2) {

			// Remove old
			const wIDOld = jsonWidget2.parentId;
			const widget0 = widgets[wIDOld];
			if (widget0) {
				const index = widget0.children.indexOf(widget.id);
				if (index !== -1) {
					widget0.children.splice(index, 1);
				}
			}

			// Add new
			jsonWidget2.parentId = this.id;
			jsonWidget1.children.push(widget.id);

		}
		*/

    //#endregion
    this.checkChildrens();
  }
  deleteWidget(widget) {
    if (!widget) return;
    if (widget.id === this.id) return;
    if (widget.parentId !== this.id) return;

    this.removeChild(widget);

    widget.htmlElement.remove();

    delete ReactComponent[widget.id];
  }

  destroy() {
    this.onDestroy();
    //this.htmlElement.remove();
  }

  onDestroy() {}

  destroyWidget() {
    if (this.htmlElement) {
      this.htmlElement.remove();
    }
    this.onDestroy();
    delete ReactComponent[this.id];
  }

  clearWidget() {
    while (this.children.length !== 0) {
      this.deleteWidget(ReactComponent[this.children[0]]);
    }
  }

  childGoToLast(index) {
    console.log("index", index);

    console.log("child", child);
    const childID = this._children[index];
    const child = ReactComponent[childID];
    const parentNode = child.htmlElement.parentNode;
    parentNode.removeChild(child.htmlElement);
    parentNode.appendChild(child.htmlElement);

    this._children.splice(index, 1);
    this._children.push(childID);

    console.log("child", this._children);
  }

  set children(childs) {
    this._children = childs;
    this.checkChildrens();
  }

  get children() {
    return this._children;
  }

  set parentId(id) {
    this._parentId = id;
  }

  get parentId() {
    return this._parentId;
  }

  set display(value) {
    this.htmlElement.style.display = value;
  }

  checkChildrens() {
    this.onCheckChildrens();
  }

  // eslint-disable-next-line class-methods-use-this
  onCheckChildrens() {}

  removeChild(widget) {
    const index = this.children.indexOf(widget.id);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  set styleName(value) {
    if (this.htmlElement) {
      if (this._styleName) {
        this.htmlElement.classList.remove(this._styleName);
      }
      this.htmlElement.classList.add(value);
    }
    console.log(
      "styleName value: ",
      value,
      " this_styleName: ",
      this._styleName
    );
    this._styleName = value;
  }

  set activated(value) {
    this._activated = value;

    if (value && this.htmlElement) {
      this.htmlElement.classList.add("Disabled");
      this.htmlElement.disabled = true;
    } else if (this.htmlElement) {
      this.htmlElement.classList.remove("Disabled");
      this.htmlElement.disabled = false;
    }
  }

  get activated() {
    return this._activated;
  }

  set visible(value) {
    this._visible = value;
    if (this.htmlElement) {
      if (!value) this.htmlElement.style.visibility = "hidden";
      else this.htmlElement.style.visibility = null;
    }
  }

  get visible() {
    return this._visible;
  }

  set posX(value) {
    this._posX = value;
    if (this.htmlElement) {
      this.htmlElement.style.left = value;
    }
  }

  get posX() {
    return this._posX;
  }

  set posY(value) {
    this._posY = value;
    if (this.htmlElement) {
      this.htmlElement.style.top = value;
    }
  }

  get posY() {
    return this._posY;
  }

  set width(value) {
    this._width = value;
    if (this.htmlElement) {
      this.htmlElement.style.width = value;
    }
  }

  get width() {
    return this._width;
  }

  set height(value) {
    this._height = value;
    if (this.htmlElement) {
      this.htmlElement.style.height = value;
    }
  }

  get height() {
    return this._height;
  }

  set minWidth(value) {
    this._minWidth = value;
    if (this.htmlElement) {
      this.htmlElement.style.minWidth = value;
    }
  }

  get minWidth() {
    return this._minWidth;
  }

  set minHeight(value) {
    this._minHeight = value;
    if (this.htmlElement) {
      this.htmlElement.style.minHeight = value;
    }
  }

  get minHeight() {
    return this._minHeight;
  }

  set maxWidth(value) {
    this._maxWidth = value;
    if (this.htmlElement) {
      this.htmlElement.style.maxWidth = value;
    }
  }

  get maxWidth() {
    return this._maxWidth;
  }

  set maxHeight(value) {
    this._maxHeight = value;
    if (this.htmlElement) {
      this.htmlElement.style.maxHeight = value;
    }
  }

  get maxHeight() {
    return this._maxHeight;
  }

  set textColor(value) {
    this._textColor = value;
    if (this.htmlElement) {
      this.htmlElement.style.color = value;
    }
  }

  get textColor() {
    return this._textColor;
  }

  set textDecoration(value) {
    this._textDecoration = value;
    if (this.htmlElement) {
      this.htmlElement.style.textDecoration = value;
    }
  }

  get textDecoration() {
    return this._textDecoration;
  }

  set textShadow(value) {
    this._textShadow = value;
    if (this.htmlElement) {
      this.htmlElement.style.textShadow = value;
    }
  }

  get textShadow() {
    return this._textShadow;
  }

  set fontFamily(value) {
    this._fontFamily = value;
    if (this.htmlElement) {
      this.htmlElement.style.fontFamily = value;
    }
  }

  get fontFamily() {
    return this._fontFamily;
  }

  set fontSize(value) {
    this._fontSize = value;
    if (this.htmlElement) {
      this.htmlElement.style.fontSize = value;
    }
  }

  get fontSize() {
    return this._fontSize;
  }

  set fontItalic(value) {
    this._fontItalic = value;
    if (this.htmlElement) {
      if (value) this.htmlElement.style.fontStyle = "italic";
      else this.htmlElement.style.fontStyle = "";
    }
  }

  get fontItalic() {
    return this._fontItalic;
  }

  set fontBold(value) {
    this._fontBold = value;
    if (this.htmlElement) {
      this.htmlElement.style.fontWeight = value;
    }
  }

  get fontBold() {
    return this._fontBold;
  }

  set borderSize(value) {
    this._borderSize = value;
    if (this.htmlElement) {
      this.htmlElement.style.borderWidth = value;
    }
  }

  get borderSize() {
    return this._borderSize;
  }

  set borderType(value) {
    this._borderType = value;
    if (this.htmlElement) {
      this.htmlElement.style.borderStyle = value;
    }
  }

  get borderType() {
    return this._borderType;
  }

  set borderColor(value) {
    this._borderColor = value;
    if (this.htmlElement) {
      this.htmlElement.style.borderColor = value;
    }
  }

  get borderColor() {
    return this._borderColor;
  }

  set borderRadius(value) {
    this._borderRadius = value;
    if (this.htmlElement) {
      this.htmlElement.style.borderRadius = value;
    }
  }

  get borderRadius() {
    return this._borderRadius;
  }

  set background(value) {
    this._background = value;
    if (this.htmlElement) {
      this.htmlElement.style.background = value;
    }
  }

  get background() {
    return this._background;
  }

  set hint(value) {
    this._hint = value;
    if (this.htmlElement) {
      this.htmlElement.title = value;
    }
  }

  get hint() {
    return this._hint;
  }

  set text(value) {
    this._text = value;
    this.onSetText(value);
  }

  get text() {
    return this._text;
  }

  // eslint-disable-next-line class-methods-use-this
  onSetText(value) {}
  SetHeader(value) {
    this.onSetHeader(value);
  }

  set elevation(value) {
    this._elevation = value;
    if (this.htmlElement) {
      this.htmlElement.style.boxShadow = value;
    }
  }

  get elevation() {
    return this._elevation;
  }

  set iconName(value) {
    this._iconName = value;
  }

  get iconName() {
    return this._iconName;
  }

  set header(value) {
    this._header = value;
    this.SetHeader(value);
  }
  get header() {
    return this._header;
  }

  set marginLeft(value) {
    this._marginLeft = value;
    if (this.htmlElement) {
      this.htmlElement.style.marginLeft = value;
    }
  }
  get marginLeft() {
    return this._marginLeft;
  }
  set cursor(value) {
    this._cursorStyle = value;
    if (this.htmlElement) {
      this.htmlElement.style.cursor = value;
    }
  }
  get cursor() {
    return this._cursorStyle;
  }
  set textDecoration(value) {
    this._textDecoration = value;
    if (this.htmlElement) {
      this.htmlElement.style.textDecoration = value;
    }
  }
  get textDecoration() {
    return this._textDecoration;
  }

  set isCanDeleted(value) {
    this._isCanDeleted = value;
  }

  get isCanDeleted() {
    return this._isCanDeleted;
  }

  set isHidden(value) {
    this._isHidden = value;
  }
  get isHidden() {
    return this._isHidden;
  }
}
