class WidgetComboBox extends BaseWidget {
  constructor() {
    super();
    // this.createDomElement("div");
  }

  onCreate() {
    this.header = "";
    this.expanded = false;
    this._$currentIndex = -1;
    this._$currentHoverIndex = -1;
    this._$headerVisible = false;
    this._$currentHeaderText = "";

    this.scrollVertical = undefined; //scroll V
    this.scrollHorizontal = undefined; //scroll H

    this.heightChilds = 0;
    this.maxWidthArrow = 50;
    this.minWidthArrow = 15;
    this.widthArrow = this.width / 10;

    this._changeSelectItemHandler = undefined;
    this._changeSeleteItemValue = undefined;

    this.addClassName("WidgetComboBox");

    this.currentIndex = -1;
    this._$itemsArea = new ComboBoxArea(this);
    this._$govno = -1;

    this.lastPosY = this.posY; //костыль на изменение позиции y

    this.lineElement = document.createElement("div");
    this.lineElement.classList.add("LineContainer");
    this.htmlElement.appendChild(this.lineElement);

    this.headInputElement = document.createElement("div");
    this.headInputElement.classList.add("InputWithHeader");
    this.lineElement.appendChild(this.headInputElement);

    this.headerElement = document.createElement("div");
    this.headerElement.innerText = "header";
    this.headerElement.classList.add("InputHeader");
    this.headerElement.classList.add("Unselectable");
    this.headInputElement.appendChild(this.headerElement);

    this.autoSize = true;
    this.displayElement = document.createElement("div");
    // this.displayElement.style.textOverflow = 'ellipsis';
    // this.displayElement.style.height = '70%';
    // this.displayElement.style.justifyContent = 'center';
    // this.displayElement.style.overflow = 'hidden';
    this.headInputElement.appendChild(this.displayElement);
    this.displayElement.classList.add("DisplayLabel");

    this.inputSearch = document.createElement("input");
    this.inputSearch.classList.add("InputSearch");

    this.inputSearch.value = "search text";
    this.inputSearch.style.display = "none";
    this.headInputElement.appendChild(this.inputSearch);

    this.buttonExpand = document.createElement("div");
    this.buttonExpand.classList.add("ButtonCombobox");
    this.buttonExpand.classList.add("Unselectable");
    this.buttonExpand.innerText = "expand_more";

    this.lineElement.appendChild(this.buttonExpand);

    this.buttonExpand.addEventListener("mousedown", (e) => {
      console.log(this.expanded);
      this.onMouseDown(e.clientX, e.clientY, e);
      console.log(this.expanded);
    });

    this.inputSearch.oninput = () => {
      if (this._$itemsArea == undefined) return;
      let findstr = this.inputSearch.value.toLowerCase();
      this._$itemsArea.findContainStr(findstr);
    };
    /*for(let i = 0; i < 5; i++){
			this.addItem('item' + i);
		}*/

    this._callbacks = {};
  }

  addItem(text, callback = null) {
    let item = new WidgetLabel();
    item.text = text;
    item.background = "white";
    this._callbacks[text] = callback;
    this.appendChild(item.htmlElement);
  }
  onSetHeader(value) {}

  removeItem(index) {
    this.getArea().removeChild(index);
  }

  clearItems() {
    this._$itemsArea.clearItems();
  }

  eventHandler(eventType, eventObject) {
    eventObject.persist();
    console.log(eventType, eventObject);
    Module.Store.dispatch({
      eventName: this.props.widgets[this.id].events[eventType],
      value: eventObject,
    });
  }
  onChangeSelectItem(handler, value = undefined) {
    this._changeSelectItemHandler = handler;
    this._changeSeleteItemValue = value;
  }
  render() {
    const widget = this.props.widgets[this.id];

    let eventAttributes = {};

    for (let eventName in widget.events) {
      eventAttributes[eventName] = (event) =>
        this.eventHandler(eventName, event);
    }

	//#region 
	
    // return (
    // 	// Base ComboBox Html
    // 	<div
    // 		id={this.id}
    // 		className="WidgetComboBox"
    // 		{...widget.attributes}
    // 		{...eventAttributes}

    // 	>
    // 		<div
    // 			id={"lineContainerComboBox_" + this.id}
    // 			className="LineContainer"
    // 		>
    // 			<div
    // 				id={"inputWithHeaderComboBox_" + this.id}
    // 				className="InputWithHeader"
    // 			>
    // 				<div
    // 					id={"inputHeaderComboBox_" + this.id}
    // 					className="InputHeader"
    // 				>
    // 				</div>
    // 				< div
    // 					id={"labelComboBox_" + this.id}
    // 					className="DisplayLabel"
    // 				>
    // 				</div>
    // 				< input
    // 					id={"inputSearchComboBox_" + this.id}
    // 					className="InputSearch"
    // 				>
    // 				</input>

    // 			</div>

    // 			<div
    // 				id={"buttonComboboxComboBox_" + this.id}
    // 				className="ButtonCombobox"
    // 			>
    // 			</div>
    // 		</div>
    // 	</div>
    // );
	//#endregion

  }

  onComponentDidMount() {

	//#region 
    // this.lineElement = document.getElementById("lineContainerComboBox_" + this.id);
    // this.headInputElement = document.getElementById("inputWithHeaderComboBox_" + this.id);
    // this.headerElement = document.getElementById("inputHeaderComboBox_" + this.id);
    // this.displayElement = document.getElementById("labelComboBox_" + this.id);
    // this.inputSearch = document.getElementById("inputSearchComboBox_" + this.id);
    // this.buttonExpand = document.getElementById("buttonComboboxComboBox_" + this.id);
    // this.autoFontSize = true;
    // this.fontSize = 25;
    // this._checkerSize = 24;
    // this._lessHundred = false;
    // this.currentIndex = -1;
    // this._$itemsArea = new ComboBoxArea(this);
    // this._$govno = -1;
    // this.lastPosY = this.posY;//костыль на изменение позиции y
    // this.header = '';
    // this.expanded = false;
    // this._$currentIndex = -1;
    // this._$currentHoverIndex = -1;
    // this._$headerVisible = false;
    // this._$currentHeaderText = '';
    // this.scrollVertical = undefined;	//scroll V
    // this.scrollHorizontal = undefined;	//scroll H
    // this.heightChilds = 0;
    // this.maxWidthArrow = 50;
    // this.minWidthArrow = 15;
    // this.widthArrow = this.width / 10;
    // this.headerElement.innerText = "header";
    // this.inputSearch.value = 'search text';
    // this.inputSearch.style.display = 'none';
    // this.buttonExpand.innerText = "expand_more";
    // this.inputSearch.oninput = () => {
    // 	if (this._$itemsArea == undefined) return;
    // 	let findstr = this.inputSearch.value.toLowerCase();
    // 	this._$itemsArea.findContainStr(findstr);
    // }

	//#endregion
  }

  setExpand(flag) {
    // if (this.expanded == flag) return;
    this.expanded = flag; //самому себе
  }

  setCurrentItemIndex(index) {
    if (index == -1) {
      this.resetItemIndex();
      return true;
    }

    if (!this.checkIndex(index)) return false;
    this._$currentIndex = index;

    return true;
  }

  resetItemIndex() {
    this._$currentIndex = -1;
  }

  checkIndex(index) {
    return !(
      index < 0 ||
      this.children == undefined ||
      index > this.children.length
    );
  }

  sendHoverIndex(index) {
    if (this._$currentHoverIndex == index) return;
    this._$currentHoverIndex = index;
  }

  setHeaderText(text) {
    if (this._$currentHeaderText == text) return false;
    this._$currentHeaderText = text;
  }

  setHeaderVisible(flag) {
    if (this._$headerVisible == flag) return false;
    this._$headerVisible = flag;
  }

  onCheckInit() {
    return true;
  }

  onInit() {
    for (let child of this.children)
      if (child != undefined && child.view != undefined)
        this.appendChild(child.view);
  }

  onFocused(focused) {
    if (!focused) {
      this.setExpand(false); //NOTE тут раньше просто присваивалось. может лишнее rex.gui.reposition
      // Rex.gui.permamentWidget = undefined;
    }
  }

  onDestroy() {
    this._$itemsArea.destroy();
    delete this._$itemsArea;
  }

  getArea() {
    return this._$itemsArea;
  }

  updateChildByRemove(listIds) {
    for (let i = 0; i < this.getArea().getSizeItems(); ++i) {
      let w = this.getArea().getItem(i);
      if (
        w == undefined ||
        w.children.length == 0 ||
        w.children[0] == undefined
      ) {
        console.log("Error");
        // if (this.currentIndex == i) this.setCurrentItemIndex(-1);
        this.removeChild(w);
        continue;
      }
      let index = listIds.indexOf(parseInt(w.children[0].id));
      if (index == -1) {
        // if (this.currentIndex == i) this.setCurrentItemIndex(-1);
        this.removeChild(w.children[0]);
        --i;
      }
    }
    this.setCurrentItem(this.currentIndex); //currentIndex)
  }

  onInit() {
    // this.width = "100%";
    this.expanded ? this.getArea().expand() : this.getArea().collapse();
    this.setCurrentItem(this.currentItem);
  }

  setHeader(text) {
    let newText = text;
    // try {
    // 	newText = decodeURIComponent(escape(window.atob(text)));
    // } catch (e) { console.log(this.type, " -> setState-> \"header\" DecodeError!"); return; }

    if (this.header === newText) return;
    this.header = newText;

    this.headerElement.innerText = newText;
    this.headerElement.innerHTML = newText;
  }

  onMouseDown(x, y, event) {
    if (this.getArea().getSizeItems() == 0) return;
    if (this.expanded) {
      this.getArea().collapse();
    } else {
      this.getArea().expand();
    }
    this.setExpand(!this.expanded);
    return;
  }

  setCurrentItem(index) {
    const oldIndex = this.currentIndex;
    for (let index = 0; index < this.getArea().getSizeItems(); ++index) {
      let w = this.getArea().getItem(index);

      if (w == undefined || w.classList == undefined) continue;

      if (w.classList.contains("hidden")) w.classList.remove("hidden");
      if (w.classList.contains("select")) w.classList.remove("select");
    }

    if (index == -1) {
      this.displayElement.innerHTML = "";
      this.inputSearch.value = this.displayElement.innerHTML;
      this.currentIndex = index;
      this.getArea().collapse();
    }
    // if (this.currentIndex != -1)

    let w = this.getArea().getItem(index);
    if (w == undefined) {
      if (index != undefined && index != -1) this._$govno = index;
      this.getArea().collapse();
      return;
    }

    w.classList.add("select");

    this.displayElement.textContent = w.children[0].textContent;
    this.inputSearch.value = this.displayElement.textContent;
    this.currentIndex = index;
    this.getArea().collapse();
    this.expanded = false;

    if (this._callbacks[this.getSelectedItemText()]) {
      this._callbacks[this.getSelectedItemText()]();
    }

    const sendObj = {
      old: oldIndex,
      new: this.currentIndex,
    };
    if (this._changeSeleteItemValue)
      sendObj["value"] = this._changeSeleteItemValue;

    if (this._changeSelectItemHandler) {
      Module.Store.dispatch({
        eventName: this._changeSelectItemHandler,
        value: sendObj,
      });
    }
  }
  getSelectedItemText() {
    return ReactComponent[this.getItem(this.currentIndex).id].text;
  }
  getSelectedItemIndex() {
    return this.currentIndex;
  }
  checkSelect(event) {
    if (this.getArea().checkSelectArea(event.x, event.y)) return this.widget;
    return this.hover ? this.widget : undefined;
  }

  appendChild(widget) {
    this.getArea().appendChild(widget);
  }

  removeChild(widget) {
    this.getArea().removeChild(widget);
  }

  controlFontSize(e) {
    if (!this.autoSize) {
      this.displayElement.style.fontSize = this.fontSize + "px";
      return;
    }
    let html = this.displayElement;
    const ratio =
      html.clientWidth < html.clientHeight
        ? html.clientWidth / html.clientHeight
        : html.clientHeight / html.clientWidth;
    const side = Math.max(html.clientWidth, html.clientHeight);
    const fontSize = side * ratio * 2;
    if (fontSize < 100) html.style.fontSize = "100%";
    else html.style.fontSize = fontSize + "%";
  }

  getItem(index) {
    return this.getArea().getItem(index);
  }
}

class ComboBoxArea {
  constructor(combobox) {
    this._$parent = combobox;
    this._$show = false;
    this._$up = false;
    this._$defaultItemHeight = 35;
    this._$heightItem = this._$defaultItemHeight;

    //параметры предка
    let rect = this._$parent.htmlElement.getBoundingClientRect(); //левый верхний угол
    this._$x = rect.x;
    this._$y = rect.y;
    this._$heightParent = 0;

    //наша высота
    this._$expandHeight = 0;
    this._$userHeight = 300;
    this._$autoHeight = false;

    // let scene = document.getElementById(this._$parent.container);
    let scene = this._$parent.htmlElement;

    if (scene == undefined)
      console.error("Combobox->constructor : бля сцена труп");
    this.htmlElement = document.createElement("div");

    this.htmlElement.classList.add("ComboBoxArea");
    this.htmlElement.classList.add("Down");
    this.htmlElement.id = "w" + combobox.id;
    scene.appendChild(this.htmlElement);

    this._$items = this.htmlElement.children;
  }

  destroy() {
    let scene = document.getElementById(this._$parent.container);
    if (scene == undefined)
      console.error("Combobox->destructor : бля сцена труп");
    else scene.removeChild(this.htmlElement);
    // document.removeChild(this.htmlElement);
  }

  checkSelectArea(x, y) {
    if (this._$show) {
      //наверх
      if (
        this._$up &&
        x >= this._$x &&
        x <= this._$x + this.htmlElement.offsetWidth &&
        y <= this._$y &&
        y >= this._$y - this.htmlElement.offsetHeight
      )
        return true;
      //вниз
      else if (
        !this._$up &&
        x >= this._$x &&
        x <= this._$x + this.htmlElement.offsetWidth &&
        y >= this._$y &&
        y <= this._$y + this.htmlElement.offsetHeight
      )
        return true;
    }
    return false;
  }
  setAutoHeight(boolflag) {
    this._$autoHeight = boolflag;
    this.updateHeigth();
  }
  setUserHeight(height) {
    this._$userHeight = height;
    if (!this._$autoHeight) this.updateHeigth();
  }

  updateHeigth(sizeItems) {
    if (this._$autoHeight) {
      if (sizeItems != undefined) {
        if (sizeItems > 5) {
          this._$expandHeight = 5 * this._$heightItem;
          this.htmlElement.style.overflowY = "scroll";
        } else {
          this._$expandHeight = sizeItems * this._$heightItem;
          this.htmlElement.style.overflowY = "hidden";
        }
      }
    } else {
      if (sizeItems == undefined) {
        sizeItems = 0;
        for (let index = 0; index < this._$items.length; ++index) {
          let w = this.htmlElement.children[index];
          if (!w.classList.contains("hidden")) ++sizeItems;
        }
      }

      let prevHeight = sizeItems * this._$heightItem;
      //если высота пользователя меньше высоты числа итемов сетим его высоту и скролл
      if (prevHeight > this._$userHeight) {
        this._$expandHeight = this._$userHeight;
        this.htmlElement.style.overflowY = "scroll";
      }
      //иначе оставляем свое
      else {
        this._$expandHeight = prevHeight;
        this.htmlElement.style.overflowY = "hidden";
      }
    }

    //высота окна - высота то верхней точки - высота виджета
    let sizeToDown = window.innerHeight - this._$y - this._$heightParent; //posY
    let sizeToTop = this._$y;

    //всегда хотим сначала разворачивать вниз
    //если не влазиет в низ
    if (this._$expandHeight > sizeToDown) {
      //проверяем не влезет ли наверх
      if (this._$expandHeight < sizeToTop) {
        this._$up = true;
        this.htmlElement.style.overflowY =
          this._$expandHeight < this._$items.length * this._$heightItem
            ? "scroll"
            : "hidden";
      }
      //если не влезло смотрим где больше места
      else {
        this.htmlElement.style.overflowY = "scroll";
        this._$up = sizeToTop > sizeToDown;
        this._$expandHeight = this._$up ? sizeToTop : sizeToDown;
      }
    } else this._$up = false;

    //изменение позиции по X
    if (this.htmlElement.style.left != this._$x)
      this.htmlElement.style.left = this._$x + "px";
    //куда и как раскрывать
    if (this._$up) {
      if (this.htmlElement.classList.contains("Down")) {
        this.htmlElement.classList.remove("Down");
        this.htmlElement.classList.add("Up");
      }
      this.htmlElement.style.top = null;
      this.htmlElement.style.bottom = window.innerHeight - this._$y + "px";
    } else {
      if (this.htmlElement.classList.contains("Up")) {
        this.htmlElement.classList.remove("Up");
        this.htmlElement.classList.add("Down");
      }
      this.htmlElement.style.bottom = null;
      this.htmlElement.style.top = this._$y + this._$heightParent + "px";
    }
    //сеттим высоту
    if (this._$show) this.htmlElement.style.height = this._$expandHeight + "px";
  }

  updateGeometry() {
    let flag = false;
    let rect = this._$parent.htmlElement.getBoundingClientRect(); //левый верхний угол
    if (this._$x != rect.x) {
      this._$x = rect.x;
      flag = true;
    }
    if (this._$y != rect.y) {
      this._$y = rect.y;
      flag = true;
    }
    if (this._$heightParent != rect.height) {
      this._$heightParent = rect.height;
      flag = true;
    }
    if (this.htmlElement.style.width != rect.width) {
      this.htmlElement.style.width = rect.width + "px";
    }
    if (flag) this.updateHeigth();
  }

  updateItemHeight(height) {
    if (height == undefined) {
      this._$heightItem = this._$defaultItemHeight;
      for (let i = 0; i < this._$items.length; ++i) {
        let w = this._$items[i];
        if (
          w != undefined &&
          w.style.offsetHeight != undefined &&
          this._$heightItem < w.style.offsetHeight
        )
          this._$heightItem = w.style.offsetHeight;
      }
    } else {
      let h = this._$defaultItemHeight;
      try {
        h = parseInt(height);
      } catch (e) {}

      if (this._$heightItem < h + 2) this._$heightItem = h + 2; //2 - по пикселю на бордер
    }
  }

  collapse() {
    if (!this._$show) return;
    this._$show = false;
    this.htmlElement.style.height = "0px";
    this._$parent.inputSearch.style.display = "none";
    this._$parent.displayElement.style.display = "";
    this._$parent.inputSearch.value = this._$parent.displayElement.innerText;
    this._$parent.inputSearch.value = this._$parent.displayElement.innerHTML;
    for (let i = 0; i < this._$items.length; ++i) {
      let ch = this._$items[i];
      if (ch.classList.contains("hidden")) ch.classList.remove("hidden");
    }
  }

  expand() {
    this.updateGeometry(); //когда-нибудь этот метод будет вызываться осмысленно на изменение позиции!!!
    this.updateHeigth(this.getSizeItems());
    this._$show = true;
    this.htmlElement.style.height = this._$expandHeight + "px";
    this._$parent.inputSearch.style.display = "";
    this._$parent.displayElement.style.display = "none";
  }

  findContainStr(findstr) {
    let itemsSize = 0;
    for (let i = 0; i < this._$items.length; ++i) {
      let ch = this._$items[i];
      let str = ch.innerText.toLowerCase();
      if (str.indexOf(findstr) != -1) {
        if (ch.classList.contains("hidden")) ch.classList.remove("hidden");
        ++itemsSize;
      } else if (!ch.classList.contains("hidden")) ch.classList.add("hidden");
    }
    this.updateHeigth(itemsSize);
  }

  appendChild(widget) {
    if (widget == undefined) debugger;  // TODO: add error?
    let item = document.createElement("div");
    item.classList.add("ItemArea");
    item.classList.add("Unselectable");
    item.appendChild(widget);
    item.id = widget.id;
    item.area = this;
    this.htmlElement.appendChild(item);
    item.onmouseover = () => {
      for (let index = 0; index < item.area._$items.length; ++index)
        if (item.area._$items[index] == item)
          item.area._$parent.sendHoverIndex(index);
    };
    item.onmousedown = () => {
      for (let index = 0; index < item.area._$items.length; ++index) {
        if (item.area._$items[index] == item) {
          if (ReactComponent[item.id].callback)
            ReactComponent[item.id].callback();
          if (!item.area._$parent.setCurrentItem(index)) item.area.collapse();
        }
      }
    };

    // widget.innerText = widget.innerHTML;//это просто костль для верхней строчки О_О которая в wiscontainere перетирает текст
    this.updateItemHeight(widget.style.height);
    this.updateHeigth(this._$items.length);

    if (
      this._$parent._$govno != -1 &&
      this._$parent._$govno <= this._$items.length - 1
    )
      this._$parent.setCurrentItem(this._$parent._$govno);
  }

  removeChild(index) {
    let w = this._$items[index];
    if (w) {
      //this.htmlElement.removeChild(this._$items[index]);
      this._$items[index].parentNode.removeChild(this._$items[index]);
      this.updateItemHeight();
      this.updateHeigth(this._$items.length); //vot hz?
      console.log(this._$items);

      //this._$items.splice(index, 1); // error
    }
  }

  getSizeItems() {
    return this._$items.length;
  }

  getItem(index) {
    return this._$items[index];
  }

  isExpand() {
    return this._$show;
  }

  clearItems() {
    for (let index = 0; this.getSizeItems(); index++) {
      this.removeChild(0);
    }
  }
}
