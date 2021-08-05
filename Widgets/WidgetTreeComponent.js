let dragObject = {};

class WidgetTreeItem extends BaseWidget {
  constructor() {
    super();
  }

  onCreate() {
    // this.props = props;
    this.iconText = "";
    this.nameOfStyle = "";
    this.childrenItems = [];
    this._parentId = undefined;
    // this.createDomElement("div");
    this.addClassName("WidgetTreeItem");
    this.htmlElement.classList.add("NoParent");
    this.htmlElement.classList.add("NoExpand");

    // this.htmlElement = document.createElement("div");
    // this.htmlElement.classList.add("WidgetTreeItem");

    this._expandIcon = "keyboard_arrow_down";
    this._noExpandIcon = "keyboard_arrow_right";

    this.htmlContainer = document.createElement("div");
    this.htmlContainer.classList.add("TreeItemContainer");
    this.htmlContainer.classList.add("Unselectable");
    this.htmlElement.appendChild(this.htmlContainer);
    this.htmlElement.classList.add("Unselectable");

    this.textLabel = document.createElement("div");
    this.textLabel.classList.add("Unselectable");
    // this.textLabel.classList.add("TreeItemText");

    this.htmlIcon = document.createElement("div");
    this.htmlIcon.classList.add("TreeItemIcon");
    this.htmlIcon.classList.add("Unselectable");

    this._fakeHtmlIcon = false;
    this._fakeHandler = null;
    this._callback = undefined;
    this._callbackdragstart = undefined;
    this._info = {};

    // this.htmlContainer.addEventListener('mouseenter', e => {
    // 	if (this.htmlElement != e.target && this.htmlElement != e.target && this.htmlContainer != e.target) return;
    // 	this.hovered = true;
    // });
    // this.htmlContainer.addEventListener('mouseleave', e => {
    // 	if (this.htmlElement != e.target && this.htmlElement != e.target && this.htmlContainer != e.target) return;
    // 	this.hovered = false;
    // });

    this.expanded = false;
    this.htmlIcon.addEventListener(
      "click",
      function (event) {
        if (!this._fakeHtmlIcon) {
          this.tree.addSelectedItem(this, event.ctrlKey);
          this.expanded = !this.expanded;
        } else {
          if (!this._fakeHandlerIsCallback) {
            Module.Store.dispatch({
              eventName: this._fakeHandler,
              value: this.id,
            });
          } else {
            console.log("_fakeHandler");
            this._fakeHandler();
          }
        }
      }.bind(this)
    );
    this.htmlContainer.addEventListener(
      "click",
      function (event) {
        this.tree.addSelectedItem(this, event.ctrlKey);
        if (this._callback) this._callback();
      }.bind(this)
    );
    this.htmlContainer.setAttribute("draggable", true);

    // this.htmlContainer.addEventListener(
    //   "dragstart",
    //   function (event) {
    //     this.tree.addSelectedItem(this, event.ctrlKey);
    //     if (this._callbackdragstart) this._callbackdragstart();
    //   }.bind(this)
    // );

    // this.htmlContainer.classList.add('draggable')

    this.htmlContainer.addEventListener("dragstart", (e) => {
      e.target.classList.add("forDraggingOnly");
      console.log("dragstart");
    });

    this.htmlContainer.addEventListener("dragend", (e) => {
      e.target.classList.remove("forDraggingOnly");
      console.log("dragend");
    });

    this.htmlContainer.onmousedown = (e) => {
      if (e.which != 1) return;

      const elem = e.target.closest(".draggable");

      if (!elem) return;

      dragObject.elem = elem;

      dragObject.downX = e.pageX;
      dragObject.downY = e.pageY;
    };

    // this.childrenDiv = document.createElement("div");

    // this.htmlElement.appendChild(this.htmlElement);
    // this.htmlElement.appendChild(this.childrenDiv);

    // this.children = props.id.children;
    // this._depth = props.depth;
    // this.tree = props.tree;
    // if(this.tree) this.tree.addItem(this);
    // this.parent = props.parent;
    // if(this.parent) {
    // 	this.parent.addChildren(this.id);
    // 	this.parentId = this.parent.id
    // } else this._parentId = -1;
  }

  createFakeExpand(Handler, isCallback = false) {
    if (this.childrenItems.length !== 0) return;
    this.htmlIcon.textContent =
      this.iconText === "" ? this._noExpandIcon : this.iconText;
    this._fakeHtmlIcon = true;
    this._fakeHandler = Handler;
    this._fakeHandlerIsCallback = isCallback;
  }

  openFakeExpand() {
    if (!this._fakeHtmlIcon) return;
    this._fakeHtmlIcon = false;
    this.tree.addSelectedItem(this, false);
    this.expanded = !this.expanded;
  }

  eventHandler(eventType, eventObject) {
    // TODO: React component ? delete/update : not delete
    eventObject.persist();
    console.log(eventType, eventObject);
    Module.Store.dispatch({
      eventName: this.props.widgets[this.id].events[eventType],
      value: eventObject,
    });
  }

  createChild(childId, index) {
    // TODO: React component ? delete/update : not delete
    return (
      <WidgetTreeItem
        key={childId}
        id={childId}
        depth={this.depth + 1}
        tree={this.tree}
        parent={this}
        // widgets={this.props.widgets}
      ></WidgetTreeItem>
    );
  }

  render() {
    return <div id={"container " + this.id}></div>;
    //#region
    // const widget = this.props.widgets[this.id];

    // let eventAttributes = {};

    // for (let eventName in widget.events) {
    // 	eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
    // }

    // return (
    // 	// Base TreeItem Html
    // 	<div>
    // 		<div
    // 			id={this.id}
    // 			className="WidgetTreeItem"
    // 			// {...widget.attributes}
    // 			// {...eventAttributes}
    // 		>
    // 			<div
    // 				id={"treeItemContainer_" + this.id}
    // 				className="TreeItemContainer"
    // 			>
    // 				<div
    // 					id={"treeItemIcon_" + this.id}
    // 					className="TreeItemIcon"
    // 				>
    // 				</div>
    // 				<div
    // 					id={"textLabel_" + this.id}
    // 					className="Unselectable"
    // 				>
    // 				</div>
    // 			</div>
    // 		</div>
    // 		<div id={"divChildrenTreeItem_" + this.id}>
    // 			{ this.children && this.children.map(this.createChild.bind(this)) }
    // 		</div>
    // 	</div >

    // );

    //#endregion
  }

  //#region onComponentDidMount()

  // onComponentDidMount() {
  // 	this.htmlReactContainer.appendChild(this.childrenDiv);

  // this.htmlContainer = document.getElementById("container " + this.id);
  // this.htmlContainer.appendChild(this.htmlElement);

  // this.htmlIcon = document.getElementById("treeItemIcon_" + this.id);
  // this.textLabel = document.getElementById("textLabel_" + this.id);
  // this.childrenDiv = document.getElementById("divChildrenTreeItem_" + this.id);
  // this.selected = false;
  // this.autoFontSize = true;
  // this.fontSize = 25;
  // this._checkerSize = 24;
  // this._lessHundred = false;

  // this.expandIcon = "keyboard_arrow_down";
  // this.noExpandIcon = "keyboard_arrow_right";
  // this.expanded = true;
  // this.text = "";
  // this.childrenItems = [];
  // this.iconText = "";
  // this.nameOfStyle = "";
  // this.htmlContainer.style.marginLeft = this.depth * 10 + "px";

  // this.htmlIcon.addEventListener("click", function (event) {
  // 	this.tree.addSelectedItem(this, event.ctrlKey);
  // 	this.expanded = !this.expanded;
  // }.bind(this));
  // this.htmlContainer.addEventListener("click", function (event) {
  // 	this.tree.addSelectedItem(this, event.ctrlKey);
  // }.bind(this));

  // }

  //#endregion

  onDestroy() {
    /*for (let idx = 0; idx < this.childrenItems.length; idx++) {
			let item = this.childrenItems[idx];
			if(item == null) continue;
			this.tree.removeItemFromTree(item.id);
		}
		console.log("this.childrenItems",this.childrenItems);
		console.log("this",this);
		for (let idx = 0; idx < this.childrenItems.length; idx++){
			const htmlElement = ReactComponent[this.childrenItems[idx]].htmlElement;
			ReactComponent[this.childrenItems[idx]].parent = this.parent;
			ReactComponent[this.childrenItems[idx]].parentId = this.parent.id;
			console.log("this.childrenItems[idx]",this.childrenItems[idx]);

			this.htmlElement.removeChild(htmlElement);
			this.parent.htmlElement.appendChild(htmlElement);
			this.parent.childrenItems.push(this.childrenItems[i]);
		} 
		return;
		if ((this.parent != null) && (this.parent.childrenItems.length == 1)) {
			this.parent.htmlElement.classList.remove("Parent");
			this.parent.htmlIcon.textContent = this.parent.iconText;
		}*/
    console.log("this", this);
    if (this.childrenItems.length == 0) {
      /*this.tree.items.get(this.parentId).htmlElement.classList.remove("Parent");
			this.tree.items.get(this.parentId).htmlElement.classList.add("NoParent");
			this.tree.items.get(this.parentId).htmlIcon.innerText = "";*/
    } else {
      for (let i = 0; i < this.childrenItems.length; i++) {
        this.tree.items.get(this.childrenItems[i]).parentId = this.parentId;
        //this.tree.items.get(this.parentId).childrenItems.push(this.id);
        //this.tree.item.get(this.childrenItems[i]).depth--;
        //this.tree.item.get(this.childrenItems[i]).htmlContainer.style.marginLeft = (this.tree.item.get(this.childrenItems[i]).depth * 10) + "px";
      }
    }
    this.tree.items
      .get(this.parentId)
      .childrenItems.splice(
        this.tree.items.get(this.parentId).childrenItems.indexOf(this.id),
        1
      );
    this.tree.items.delete(this.id);
    this.htmlElement.remove();
  }

  set expandIcon(value) {
    if (this._expandIcon == value) return;
    this._expandIcon = value;
  }

  get expandIcon() {
    return this._expandIcon;
  }

  set noExpandIcon(value) {
    if (this._noExpandIcon == value) return;
    this._noExpandIcon = value;
  }

  get noExpandIcon() {
    return this._noExpandIcon;
  }

  set parentId(value) {
    if (this.parentId == value) return;
    this._parentId = value;
    if (!this.tree.inited) return;
    this.setParent(value);
  }

  get parentId() {
    return this._parentId;
  }

  setParent(id) {
    let parent = this.tree.items.get(id);
    if (parent == null) {
      this.depth = 0;
      this.onInit(this.tree.htmlElement);
    } else {
      this.depth = parent.depth + 1;
      this.onInit(parent.htmlElement);
      this.parent = parent;
      parent.addChildren(this.id);
      parent.htmlElement.classList.add("Parent");
      parent.htmlElement.classList.remove("NoParent");
      parent.expanded = parent.expanded;
      // parent.htmlIcon.textContent = this.expandIcon;
    }
  }

  addChildren(childId) {
    let index = this.childrenItems.indexOf(childId);
    if (index > -1) return;
    this.childrenItems.push(childId);
  }

  getChildIdByIndex(index) {
    return this.childrenItems[index];
  }

  set hint(value) {
    if (value == null || this.hint == value) return;
    try {
      let text = decodeURIComponent(escape(window.atob(value)));
      this._hint = text;
      this.textLabel.title = text;
      this.htmlElement.title = text;
    } catch (e) {
      console.log(this.type, "setState->", "Hint DecodeError!", e, value);
    }
  }

  get hint() {
    return this._hint;
  }

  set depth(value) {
    if (this.depth == value) return;
    this._depth = value;
    if (this.htmlContainer)
      this.htmlContainer.style.marginLeft = this.depth * 10 + "px";
  }

  get depth() {
    return this._depth;
  }

  setState(state) {
    if (state.id != null) this.id = state.id;
    if (state.children != null) this.children = state.children;
    if (state.widgetId != null) this.widgetId = state.widgetId;
    if (state.iconText != null) {
      this.iconText = state.iconText;
      if (
        this.htmlElement.classList.contains("Parent") &&
        state.iconText == ""
      ) {
        if (this.htmlElement.classList.contains("Expand"))
          this.htmlIcon.textContent = this.expandIcon;
        else this.htmlIcon.textContent = this.noExpandIcon;
      } else {
        this.htmlIcon.textContent = state.iconText;
      }
    }
    if (state.styleName != null) {
      if (this.htmlElement && state.styleName.length > 0) {
        if (this.nameOfStyle.length == 0)
          this.htmlElement.classList.add(state.styleName);
        else this.htmlElement.classList.remove(this.nameOfStyle);
      }
      this.nameOfStyle = state.styleName;
    }
  }

  onInit(node) {
    // debugger;
    node.appendChild(this.htmlElement);
    this.htmlContainer.appendChild(this.htmlIcon);
    this.htmlContainer.appendChild(this.textLabel);
    if (this.childrenItems.length != 0) {
      this.htmlElement.classList.add("Parent");
      this.htmlElement.classList.remove("NoParent");
      // this.htmlElement.addEventListener('click', e => {
      //   console.log('Parents', e);
      // })

      for (let i = 0; i < this.childrenItems.length; ++i) {
        if (this.tree.items.get(this.children[i]))
          this.tree.items.get(this.children[i]).onInit(this.htmlElement);
      }
    } else {
      this.htmlElement.classList.add("NoParent");
      this.htmlElement.classList.remove("Parent");
      this.htmlIcon.textContent = this.iconText;
    }

    this.htmlElement.style.visibility = null;
    this.expanded = this.expanded; // WTF?
  }

  setSelected(select) {
    if (select === this.selected) return;
    this.selected = select;
    if (this.selected) {
      this.htmlElement.classList.add("Selected");
    } else {
      this.htmlElement.classList.remove("Selected");
    }
  }

  set text(value) {
    // if ((value == null) || (this.text == value)) return;
    // try {
    // let text = decodeURIComponent(escape(window.atob(value)));
    let text = value;
    this._text = text;
    this.textLabel.innerText = text;
    // }
    // catch (e) {
    // 	console.log(this.type, "setState->", "Text DecodeError!", e, value);
    // }
  }

  get text() {
    return this._text;
  }

  setTextColor(value) {
    this.textColor = value;
    this.textLabel.style.color = value;
  }

  setIconText(value) {
    this.iconText = value;
    this.htmlIcon.textContent = value;
  }

  setIconColor(value) {
    this.iconColor = value;
    this.htmlIcon.style.color = value;
  }

  setBackgroundColor(value) {
    this.backgroundColor = value;
    this.htmlElement.style.backgroundColor = value;
  }

  setBorderSize(value) {
    this.borderSize = value;
    this.htmlElement.style.borderWidth = value + "px";
  }

  set expanded(value) {
    //if(this.expanded == value) return;
    this._expanded = value;
    // if (!this.tree.inited) return;
    if (this.childrenItems.length > 0) {
      this.htmlElement.classList.add("Parent");
      this.htmlElement.classList.remove("NoParent");
      if (value) {
        this.htmlElement.classList.add("Expand");
        this.htmlElement.classList.remove("NoExpand");
        if (this.htmlElement.classList.contains("Parent")) {
          this.htmlIcon.textContent =
            this.iconText === "" ? this.expandIcon : this.iconText;
          // this.childrenDiv.style.display = "block";
        }
      } else {
        this.htmlElement.classList.add("NoExpand");
        this.htmlElement.classList.remove("Expand");
        if (this.htmlElement.classList.contains("Parent")) {
          this.htmlIcon.textContent =
            this.iconText === "" ? this.noExpandIcon : this.iconText;
          // this.childrenDiv.style.display = "none";
        }
      }
    } else {
      this.htmlElement.classList.add("NoParent");
      this.htmlElement.classList.remove("Parent");
      this.htmlIcon.textContent = this.iconText;
    }
  }

  get expanded() {
    return this._expanded;
  }

  checkSearch() {
    if (this.tree.search != "" && !this.checkSearchFilter()) {
      this.htmlElement.classList.add("NoSearch");
    } else {
      this.htmlElement.classList.remove("NoSearch");
    }

    // if (this.tree.search != "") {
    //   if (!this.checkSearchFilter()) {
    //     this.htmlElement.classList.add("NoSearch");
    //   } else {
    //     this.htmlElement.classList.remove("NoSearch");
    //   }
    // } else {
    //   this.htmlElement.classList.remove("NoSearch");
    // }
  }

  checkSearchFilter() {
    if (this.text.toLowerCase().indexOf(this.tree.search.toLowerCase()) !== -1)
      return true;

    if (this.parentId != -1) {
      let parent = this.tree.items.get(this.parentId);
      if (null != parent)
        if (
          parent.text
            .toLowerCase()
            .indexOf(parent.tree.search.toLowerCase()) !== -1
        )
          return true;
    }

    for (let i = 0; i < this.childrenItems.length; ++i) {
      let child = this.tree.items.get(this.childrenItems[i]);
      if (child.checkSearchFilter()) return true;
    }
    return false;
  }
  set callback(callback) {
    this._callback = callback;
  }
  get callback() {
    return this._callback;
  }

  set callbackdragstart(dragstart) {
    this._callbackdragstart = dragstart;
  }
  get callbackdragstart() {
    return this._callbackdragstart;
  }

  set info(value) {
    this._info = value;
  }
  get info() {
    return this._info;
  }
}

class WidgetTree extends BaseWidget {
  constructor() {
    super();
    // this.props = props;
    // this.createDomElement("div");
    this.addClassName("WidgetTree");
    // debugger;
    // if (this.htmlContainer) this.htmlContainer.appendChild(this.htmlElement);
    // else if (document.getElementById("container " + this.id))
    // 	this.htmlContainer = document.getElementById("container " + this.id);

    this.inited = true;
    this.items = new Map();
    this.selectedItems = [];
    this.search = "";
    // this.lastItemId = 0;
    // this.checkChildren();
  }

  eventHandler(eventType, eventObject) {
    eventObject.persist();
    console.log(eventType, eventObject);
    Module.Store.dispatch({
      eventName: this.props.widgets[this.id].events[eventType],
      value: eventObject,
    });
  }

  createChild(childId, index) {
    // TODO: React component ? delete/update : not delete
    return (
      <WidgetTreeItem
        key={childId}
        id={childId}
        depth={0}
        tree={this}
        widgets={this.props.widgets}
      ></WidgetTreeItem>
    );
  }

  render() {
    const widget = this.props.widgets[this.id];

    let eventAttributes = {};

    for (let eventName in widget.events) {
      eventAttributes[eventName] = (event) =>
        this.eventHandler(eventName, event);
    }

    const children = this.props.widgets[this.id].children;

    return <div id={"container " + this.id}></div>;

    // return (
    // 	// Base Tree Html
    // 	<div
    // 		id={this.id}
    // 		className="WidgetTree"
    // 		{...widget.attributes}
    // 		{...eventAttributes}

    // 	>
    // 		{children.map(this.createChild.bind(this))}
    // 	</div>
    // );
  }

  onComponentDidMount() {
    // this.htmlContainer = document.getElementById("container " + this.id);
    // this.htmlContainer.appendChild(this.htmlElement);
    // this.htmlElement.widgetTree = this;
    // this.autoFontSize = true;
    // this.fontSize = 25;
    // this._checkerSize = 24;
    // this._lessHundred = false;
  }

  checkChildren() {
    for (let i in this.children) {
      if (i != "length") this.addItemInTree(this.children[i]);
    }
  }

  addItemInTree(item, parentId = -1) {
    let sourceItem = ReactComponent[item];
    if (sourceItem) {
      this.addItem(sourceItem);
      sourceItem.parentId = parentId;
    }
  }

  createItemInTree(
    parentId,
    callback = undefined,
    info = undefined,
    callbackdragstart = undefined
  ) {
    let sourceItem = new WidgetTreeItem();
    this.addItem(sourceItem);
    sourceItem.parentId = parentId;
    sourceItem.callback = callback;
    sourceItem.info = info;
    sourceItem.callbackdragstart = callbackdragstart;
    return sourceItem.id;
  }

  copyTree() {
    const conformity = {};
    const newTree = new WidgetTree();
    const offset =
      parseInt(newTree.id.replace("w_", "")) -
      parseInt(this.id.replace("w_", ""));
    for (let id of Object.keys(Object.fromEntries(this.items))) {
      let parentID = this.items.get(id).parentId;
      if (parentID != -1) {
        parentID = "w_" + (parseInt(parentID.replace("w_", "")) + offset);
      }
      const item = newTree.createItemInTree(
        parentID,
        this.items.get(id).callback,
        this.items.get(id).info
      );
      conformity[item] = id;
      ReactComponent[item].text = this.items.get(id).text;
    }

    return [newTree, conformity];
  }

  addItem(item) {
    if (item == null) return;
    this.items.set(item.id, item);
    item.tree = this;
  }

  getItem(id) {
    return this.items.get(id);
  }

  getItemsSize() {
    return this.items.size;
  }
  removeItemFromTree(id) {
    let item = this.items.get(id);
    if (item == null) return;
    //debugger;
    console.log("item", item);
    console.log("items", this.items);

    item.destroy();
  }

  addSelectedItem(item, multiselect) {
    let index = this.selectedItems.indexOf(item);
    if (index > -1) {
      item.setSelected(false);
      this.selectedItems.splice(index, 1);
      return;
    }
    if (!multiselect) {
      while (this.selectedItems.length != 0) {
        let tmpItem = this.selectedItems.pop();
        tmpItem.setSelected(false);
      }
    }
    this.selectedItems.push(item);
    item.setSelected(true);
  }

  getSelectedItems() {
    return this.selectedItems;
  }

  setSearch(search) {
    if (this.search === search) return;
    this.search = search;
    for (let i in this.items) {
      this.items.get(i).checkSearch();
    }
  }

  onSetState(state) {
    if (state.search !== undefined) {
      try {
        this.search = decodeURIComponent(escape(window.atob(state.search)));
        for (let item of this.items.values()) {
          try {
            item.checkSearch();
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        // console.log(this.type, "setState-> Search filter decodeError!");
      }
    }
    if (this.items == null) this.items = new Map();
    if (state.updates != null) {
      for (let item of state.updates) {
        let sourceItem = null;
        if (!this.items.has(item.id)) {
          sourceItem = new WidgetTreeItem();
          this.items.set(item.id, sourceItem);
          sourceItem.tree = this;
          sourceItem.id = item.id;
          sourceItem.htmlElement.id = this.id + "_" + sourceItem.id;
          sourceItem.children = item.children;
          sourceItem.htmlElement.draggable = this.draggable;
        }
      }
      for (let item of state.updates) {
        let sourceItem = this.items.get(item.id);
        sourceItem.setState(item);
      }
    }
    if (state.selectedItemId != null) {
      this.selectItem = this.items.get(this.selectedItemId);
      if (this.currentSelectedItem != null)
        this.currentSelectedItem.htmlElement.classList.remove("Selected");
      if (this.selectItem != null) {
        this.currentSelectedItem = this.selectItem;
        this.currentSelectedItem.htmlElement.classList.add("Selected");
      }
    }
    if (state.needRemove) {
      for (let itemId of state.needRemove) {
        let item = this.items.get(itemId);
        if (item == null) continue;
        item.destroy();
        delete this.items.get(itemId);
        this.items.delete(itemId);
      }
    }
  }

  appendChild(child) {
    for (let item of this.items.values()) {
      let id = child.id.replace("div", "");
      if (item.widgetId == id) {
        item.htmlContainer.appendChild(child);
        // child.style.marginLeft = "20px";
        // Rex.widgets[item.widgetId].width = undefined;
        // Rex.widgets[item.widgetId].height = undefined;
        child.style.width = null;
        child.style.height = null;
      }
    }
  }

  set draggable(value) {
    this._draggable = value;
    if (this.items == null) return;
    if (value) {
      for (let item of this.items.values()) {
        item.htmlElement.draggable = value;
      }
    } else {
      for (let item of this.items.values()) {
        item.htmlElement.draggable = null;
      }
    }
  }

  get draggable() {
    return this._draggable;
  }

  onDrag(dragAndDrop) {
    if (this.hoveredItemId == -1) return { itemId: -1 };
    let item = this.items.get(this.hoveredItemId);

    let data = { itemId: item.id };
    this.dragging = true;
    return data;
  }

  onInit() {
    this.height = undefined;
    for (let key of this.items.keys()) {
      let item = this.items.get(key);
      if (item.parentId != -1) continue;
      item.onInit(this.htmlElement);
      if (item.childrenItems.length != 0)
        item.htmlElement.classList.add("Parent");
    }
    this.draggable = this.draggable;
  }

  checkSelect() {
    for (let item of this.items.values()) {
      if (item.checkSelect() != undefined) return item.checkSelect();
    }
    return this.hover ? this.widget : undefined;
  }
  setAllItemCallback(callback) {
    for (let item of this.items.values()) {
      item.callback = () => {
        callback(item.info);
      };
    }
  }
}
