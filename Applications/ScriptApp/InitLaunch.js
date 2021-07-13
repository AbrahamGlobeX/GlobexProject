/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
/* global UI DBWorker LibraryController BasicConnection BasicNode NotificationManager TranslateManager LibrariesEditor*/

// Global editor application
const APP = {};

// eslint-disable-next-line no-unused-vars
function init() {
  APP.specialTypes = ["Handler", "HandlerWithParams"];

  // USER DATA
  APP.auth = false;
  APP.username = "";
  APP.owner = "";

  // OBJECT DATA
  APP.oid = "";
  APP.name = "";
  APP.description = "";
  APP.wiki = "";
  APP.image = "";
  APP.category = [];
  // APP.pattern = "000000000000000000000000";// def 0
  // APP.pattern = "58b528a3dcfd030dc81b84a1";// rex script
  APP.pattern = "5fffb5fa15bc561f0440713e"; // new for wasm app

  APP.index = -1;
  APP.script = {};
  APP.form = {};
  // APP.script = script;

  APP.translateManager = new TranslateManager();
  APP.TM = APP.translateManager;

  APP.nm = new NotificationManager();
  APP.log = function log(type, data) {
    APP.nm.message(data, type);
  };

  APP.dbWorker = new DBWorkerLaunch();
  //APP.dbWorker.initialize();

  APP.Logic = new LogicLaunch();
  APP.UI = new UILaunch();
  APP.UI.createTop();
  APP.UI.createLeftPanel();
  // APP.Logic.parseScript();

  APP.libraryController = new LibraryControllerLaunch();
  APP.libraryController.initialize();

  APP.libraryEditor = new LibrariesEditorLaunch();
  APP.libraryEditor.initialize();

  APP.UI.divObjectName.textContent = APP.name;
}

/**
 *
 * class LOGIC
 *
 **/
class LogicLaunch {
  constructor() {
    this.nodes = {}; // List of BLOCKS {ID|Object}
    this.connections = {}; // List of LINES {ID|Object}

    this.stores = {}; // Real Store
    this.storesList = []; // Names of Store
    this.storesBlocks = {}; // Blocks For Store Work
    this.storesConnections = []; // Connections For Store Work

    // Base DATA for WIDGETS
    this.storesList.push("widgets");
    this.stores.widgets = JSON.parse('{"0":{"children":[]}}');

    this.listBlockOids = []; // ALL droped js block OIDs

    // {NODE|array nodes}
    this.logicBlocksStructs = []; // START HENDLERS

    document.body.addEventListener("drop", this.drop.bind(this));
    document.body.addEventListener("dragover", this.dragover.bind(this));
    document.getElementById("root").style.top = "0px";
  }

  create() {}

  save() {}

  load() {
    return;
    const { script } = APP;

    if (!script) {
      APP.log("error", "Script is empty!");
      return;
    }

    // PARSE STORE LIST
    // eslint-disable-next-line guard-for-in
    for (const name in script.store) {
      const value = script.store[name];
      if (!value) {
        continue;
      }
      this.stores[name] = value;
      this.storesList.push(name);
    }

    APP.logicController.load(script);

    // this.listBlockOids = APP.script.jsBlocksOIDs;
    // if (!this.listBlockOids) {
    // 	this.listBlockOids = [];
    // }
  }

  // eslint-disable-next-line complexity
  parseScript() {
    return;
    const ids = [];

    if (!APP.script.nodes) {
      console.log("Script is empty!");
      return;
    }

    // PARSE STORE LIST
    // eslint-disable-next-line guard-for-in
    for (const name in APP.script.store) {
      const value = APP.script.store[name];
      if (!value) {
        continue;
      }

      this.stores[name] = value;
      this.storesList.push(name);
    }

    const container = document.getElementById("container");
    // PARSE NODES
    for (const n of APP.script.nodes) {
      // console.log("CreateNode:", n);

      if (APP.index < n.id) {
        APP.index = n.id;
      }

      // CHECK STORE BLOCK
      if (n.type === "FromStoreElement" || n.type === "ToStoreElement") {
        this.appendStoreBlock(n);
        ids.push(n.id);
        continue;
      }

      // CREATE NODE
      const o = new BasicNode(n);
      this.nodes[n.id] = o;
      const libNode = APP.libraryController.getNodeData(o.lib, o.name);
      if (libNode) {
        o.oid = libNode.oid;
        o.setValidBlock(libNode.comlited);
      } else {
        o.setValidBlock(false);
      }

      APP.UI.nodesScene.appendChild(o.htmlElement);

      // CHECK START BLOCKs
      if (APP.specialTypes.indexOf(n.type) !== -1) {
        o.htmlElement.classList.add("StartNodes");
        o.x = 10;
        o.setValidBlock(true);

        // HANDLER VIEW AREA
        const nodesArea = {};
        nodesArea.root = o;
        nodesArea.nodes = [];
        nodesArea.y1 = 9e10;
        nodesArea.y2 = 0;
        nodesArea.html = document.createElement("div");
        nodesArea.html.className = "ViewArea";
        container.appendChild(nodesArea.html);
        this.logicBlocksStructs.push(nodesArea);
      }
    }

    // PARSE CONNECTION LINES
    for (const c of APP.script.connections) {
      // console.log("CreateConnection:", c);

      // CHECK STORE CONNECTION
      const id1 = c.dest.nodeID;
      const id2 = c.source.nodeID;
      if (ids.indexOf(id1) !== -1 || ids.indexOf(id2) !== -1) {
        // Check on VALID connection
        const n1 = this.nodes[id1];
        const n2 = this.nodes[id2];
        if (!n1 && !n2) {
          console.error("Connection ", c, "not connected!");
          continue;
        }

        let result = false;

        // Add Stores
        if (n1) {
          result = n1.appendStore(c);
        } else if (n2) {
          result = n2.appendStore(c);
        }

        if (!result) {
          continue;
        }

        this.storesConnections.push(c);
        continue;
      }

      // CREATE CONNECTION
      const o = new BasicConnection(c);
      this.connections[o.id] = o;
      o.staticCreate();
      o.updatePositions();
      APP.UI.nodesScene.appendChild(o.htmlElement);
    }

    // PARSE NODES VIEW AREAS
    for (const area of this.logicBlocksStructs) {
      // Добавление в обьект всей цепочки блоков
      this.checkViewStruct(area.root, area);
    }

    for (const area of this.logicBlocksStructs) {
      // Расчет позиций по умолчанию
      const offset = 100;
      area.y1 = 9e10;
      area.y2 = -9e10;
      for (const node of area.nodes) {
        area.y1 = Math.min(area.y1, node.htmlElement.offsetTop);
        area.y2 = Math.max(
          area.y2,
          node.htmlElement.offsetTop + node.htmlElement.offsetHeight
        );
      }
      area.y1 -= offset;
      area.y2 += offset;
      area.html.style.top = area.y1 + "px";
      area.html.style.height = area.y2 - area.y1 + "px";
    }

    // Сортировка массива по Y координате
    this.logicBlocksStructs.sort(this.sortFunction);

    this.changeAreaColor();

    // Корректировка
    this.postCorrect();

    this.listBlockOids = APP.script.jsBlocksOIDs;
    if (!this.listBlockOids) {
      this.listBlockOids = [];
    }
  }

  // eslint-disable-next-line class-methods-use-this
  sortFunction(obj1, obj2) {
    if (!obj1 || !obj2) {
      return 0;
    }
    return obj1.y1 - obj2.y1;
  }

  checkViewStruct(node, area) {
    if (!node.viewArea) {
      node.viewArea = area;
      area.nodes.push(node);
    }

    for (const connection of node.lines) {
      if (connection.type !== "flow" || connection.nodeID2 !== node.id) {
        continue;
      }

      const nodeNext = this.nodes[connection.nodeID1];
      this.checkViewStruct(nodeNext, area);
    }
  }

  updateNodeViewAreas(area) {
    if (!area) {
      return;
    }

    const index = this.logicBlocksStructs.indexOf(area);
    if (index === -1) {
      return;
    }

    // RECALCULATE AREA
    let offset = 100;
    let oldY1 = area.y1;
    let oldY2 = area.y2;
    area.y1 = 9e10;
    area.y2 = -9e10;

    for (let node of area.nodes) {
      area.y1 = Math.min(area.y1, node.htmlElement.offsetTop);
      area.y2 = Math.max(
        area.y2,
        node.htmlElement.offsetTop + node.htmlElement.offsetHeight
      );
    }
    area.y1 -= offset;
    area.y2 += offset;
    area.html.style.top = area.y1 + "px";
    area.html.style.height = area.y2 - area.y1 + "px";

    let dY1 = oldY1 - area.y1;
    let dY2 = oldY2 - area.y2;

    // CORRECT UP
    if (dY1 !== 0) {
      for (let i = index - 1; i >= 0; i--) {
        let _area = this.logicBlocksStructs[i];
        for (let node of _area.nodes) {
          node.y -= dY1;
          node.htmlElement.style.top = node.htmlElement.offsetTop - dY1 + "px";
          for (const l of node.lines) {
            l.updatePositions();
          }
        }
        _area.y1 -= dY1;
        _area.y2 -= dY1;
        _area.html.style.top = _area.y1 + "px";
        _area.html.style.height = _area.y2 - _area.y1 + "px";
      }
    }

    // CORRECT DOWN
    if (dY2 !== 0) {
      let count = this.logicBlocksStructs.length;
      for (let i = index + 1; i < count; i++) {
        let _area = this.logicBlocksStructs[i];
        for (let node of _area.nodes) {
          node.y -= dY2;
          node.htmlElement.style.top = node.htmlElement.offsetTop - dY2 + "px";
          for (const l of node.lines) {
            l.updatePositions();
          }
        }
        _area.y1 -= dY2;
        _area.y2 -= dY2;
        _area.html.style.top = _area.y1 + "px";
        _area.html.style.height = _area.y2 - _area.y1 + "px";
      }
    }
  }

  addUpdatePos(delta) {
    let _area = this.logicBlocksStructs[i];
    for (let node of _area.nodes) {
      node.y -= dY2;
      node.htmlElement.style.top = node.htmlElement.offsetTop - dY2 + "px";
      for (const l of node.lines) {
        l.updatePositions();
      }
    }
    _area.y1 -= dY2;
    _area.y2 -= dY2;
    _area.html.style.top = _area.y1 + "px";
    _area.html.style.height = _area.y2 - _area.y1 + "px";
  }

  postCorrect() {
    let count = this.logicBlocksStructs.length - 1;
    for (let i = 0; i < count; i++) {
      let o1 = this.logicBlocksStructs[i];
      let o2 = this.logicBlocksStructs[i + 1];

      let d = o2.y1 - o1.y2;

      o2.y1 -= d;
      o2.y2 -= d;
      o2.html.style.top = o2.y1 + "px";
      o2.html.style.height = o2.y2 - o2.y1 + "px";
      for (let node of o2.nodes) {
        node.y -= d;
        node.htmlElement.style.top = node.htmlElement.offsetTop - d + "px";
        for (const l of node.lines) {
          l.updatePositions();
        }
      }
    }
  }

  parseLibrary() {}

  appendStoreBlock(data) {
    this.storesBlocks[data.id] = data;
    const name = data.params[0].ElementName;
    if (this.storesList.indexOf(name) === -1) {
      this.stores[name] = "";
      this.storesList.push(name);
    }
  }

  clearScript() {
    APP.oid = "";
    APP.name = "";
    APP.description = "";
    APP.wiki = "";
    APP.image = "";
    APP.category = [];

    APP.UI.divObjectName.textContent = "";

    script = {};
    APP.script = {};

    for (const n_id in this.nodes) {
      const n = this.nodes[n_id];
      this.removeObject(n);
    }

    for (const c_id in this.connections) {
      const c = this.connections[c_id];
      this.removeObject(c);
    }

    this.nodes = {};
    this.connections = {};

    this.stores = {};
    this.storesList = [];
    this.storesBlocks = {};
    this.storesConnections = [];

    this.storesList.push("widgets");
    this.stores.widgets = JSON.parse('{"0":{"children":[]}}');

    for (const o of APP.Logic.logicBlocksStructs) {
      if (o && o.html) {
        o.html.remove();
      }
    }
    this.logicBlocksStructs = [];
  }

  removeObjects(os) {
    if (!os) {
      for (const o of APP.UI.focused) {
        this.removeObject(o);
      }
    } else {
      for (const o of os) {
        this.removeObject(o);
      }
    }
  }

  removeObject(object) {
    if (!object) {
      return;
    }

    if (this.nodes[object.id]) {
      // if (object.type === "Handler" || object.type === "HandlerWithParams") {
      // 	return;
      // }
      delete this.nodes[object.id];
    } else if (this.connections[object.id]) {
      delete this.connections[object.id];
    }

    if (object.oid) {
      let find = false;
      // eslint-disable-next-line guard-for-in
      for (const nID in this.nodes) {
        const n = this.nodes[nID];
        if (!n) {
          continue;
        }

        if (n.oid === object.oid) {
          find = true;
          break;
        }
      }

      if (!find) {
        const index = this.listBlockOids.indexOf(object.oid);
        if (index !== -1) {
          this.listBlockOids.splice(index, 1);
        }
      }
    }

    object.destroy();
  }

  removeStoreConnection(data) {
    if (!data) {
      return;
    }

    const b_id_1 = data.dest.nodeID;
    const b_id_2 = data.source.nodeID;
    const index = this.storesConnections.indexOf(data);
    this.storesConnections.splice(index, 1);

    if (this.storesBlocks[b_id_1]) {
      delete this.storesBlocks[b_id_1];
    } else if (this.storesBlocks[b_id_2]) {
      delete this.storesBlocks[b_id_2];
    }
  }

  saveScript() {
    // SAVE OBJECT
    const object = {};
    object.nodes = [];
    object.connections = [];

    // SAVE NODES
    for (const nodeName in this.nodes) {
      if (!nodeName) {
        continue;
      }
      const node = this.nodes[nodeName];
      object.nodes.push(this.generateNode(node));
    }

    // SAVE STORE NODES
    for (const sn_id in this.storesBlocks) {
      if (!sn_id) continue;

      const sn = this.storesBlocks[sn_id];

      if (!sn) continue;
      object.nodes.push(sn);
    }

    // SAVE CONNECTION
    for (const connectionID in this.connections) {
      if (!connectionID) {
        continue;
      }
      const connection = this.connections[connectionID];
      if (!connection) {
        continue;
      }
      const oConnection = {};
      oConnection.type = connection.type;

      if (connection.pid !== undefined) oConnection.pid = connection.pid;

      oConnection.source = {
        nodeID: connection.nodeID2,
        index: connection.index2,
      };
      oConnection.dest = {
        nodeID: connection.nodeID1,
        index: connection.index1,
      };
      object.connections.push(oConnection);
    }

    // SAVE STORE CONNECTION
    for (const sn of this.storesConnections) {
      if (!sn) continue;
      object.connections.push(sn);
    }

    // SAVE STORE VALUES
    object.store = {};
    // eslint-disable-next-line guard-for-in
    for (const name in this.stores) {
      const value = this.stores[name];
      object.store[name] = value;
    }

    object.jsBlocksOIDs = this.listBlockOids;
    object.jsLibsOIDs = APP.libraryController.m_librariesOIDs;

    script = object;
    APP.script = object;
  }

  dublicate(event, objects) {
    if (!objects) {
      return;
    }

    for (const object of objects) {
      if (!object.id) {
        return;
      }

      const dublicateNode = this.generateNode(object);
      dublicateNode.id = ++APP.index;
      dublicateNode.x = APP.UI.getSceneOffset(event, 0);
      dublicateNode.y = APP.UI.getSceneOffset(event, 1);
      const o = new BasicNode(dublicateNode);
      this.nodes[dublicateNode.id] = o;
      APP.UI.nodesScene.appendChild(o.htmlElement);
    }
  }

  copy(objects) {}

  paste() {}

  loadFile(event) {
    const file = event.target.files[0];

    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function (e) {
        const s = e.target.result;
        const obj = JSON.parse(s);
        this.clearScript();
        APP.script = obj;
        script = obj;
        this.parseScript();
      }.bind(this)
    );
    reader.readAsBinaryString(file);
  }

  saveFile() {
    const dt = new Date();
    const dd = "" + dt.toDateString();
    let tt = "" + dt.toLocaleTimeString();
    tt = tt.replace(":", ".");
    tt = tt.replace(":", ".");
    const name = "save_" + dd + "_" + tt;
    const data = JSON.stringify(script);

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(data)
    );
    element.setAttribute("download", name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getArraySlots(obj) {
    const result = [];
    for (const slotName in obj) {
      if (!slotName) {
        continue;
      }
      const slot = obj[slotName];
      if (!slot) {
        continue;
      }
      result.push(slotName);
    }
    return result;
  }

  fixNodeSemicolon() {
    let script = APP.script;
    for (let i = 0; i < script.nodes.length; i++) {
      if (!script.nodes[i].Defaults) continue;
      for (let j = 0; j < script.nodes[i].Defaults.Inputs.length; j++) {
        if (
          typeof script.nodes[i].Defaults.Inputs[j].value === "string" &&
          script.nodes[i].Defaults.Inputs[j].value.includes("/semicolon")
        ) {
          let str = script.nodes[i].Defaults.Inputs[j].value.replaceAll(
            "/semicolon",
            ";"
          );
          script.nodes[i].Defaults.Inputs[j].value = str;
        }
      }
    }
    APP.script = script;
  }
  replaceNodeSemicolon() {
    let script = APP.script;
    for (let i = 0; i < script.nodes.length; i++) {
      if (!script.nodes[i].Defaults) continue;
      for (let j = 0; j < script.nodes[i].Defaults.Inputs.length; j++) {
        if (
          typeof script.nodes[i].Defaults.Inputs[j].value === "string" &&
          script.nodes[i].Defaults.Inputs[j].value.includes(";")
        ) {
          let str = script.nodes[i].Defaults.Inputs[j].value.replaceAll(
            ";",
            "/semicolon"
          );
          script.nodes[i].Defaults.Inputs[j].value = str;
        }
      }
    }
    APP.script = script;
  }

  generateNode(node) {
    const oNode = {};
    if (node.type === "JavaScriptBlock") {
      oNode.name = node.name;
    } else {
      oNode.name = node.type;
    }
    oNode.type = node.type;
    oNode.lib = node.lib;

    oNode.id = node.id;
    if (node.pid !== null && node.pid !== undefined) {
      oNode.pid = node.pid;
    }
    if (node.cid !== null && node.cid !== undefined) {
      oNode.cid = node.cid;
    }
    oNode.x = node.htmlElement.offsetLeft;
    oNode.y = node.htmlElement.offsetTop;
    if ("defParam" in node) {
      oNode.params = node.defParam;
    }
    oNode.Inputs = {
      flow: this.getArraySlots(node.flowIn),
      data: this.getArraySlots(node.dataIn),
    };
    oNode.Outputs = {
      flow: this.getArraySlots(node.flowOut),
      data: this.getArraySlots(node.dataOut),
    };
    const i_Defaults = [];
    const o_Defaults = [];
    for (const s of node.slots) {
      if (s.defaults) {
        if (s.side === "OUT") {
          o_Defaults.push(s.defaults);
        } else {
          i_Defaults.push(s.defaults);
        }
      }
    }
    if (i_Defaults.length || o_Defaults.length) {
      oNode.Defaults = {};
      if (i_Defaults.length) {
        oNode.Defaults.Inputs = i_Defaults;
      }
      if (o_Defaults.length) {
        oNode.Defaults.Outputs = o_Defaults;
      }
    }
    return oNode;
  }

  changeAreaColor() {
    // Изменение цветов
    let count = this.logicBlocksStructs.length;
    for (let i = 0; i < count; i++) {
      let o1 = this.logicBlocksStructs[i];

      if (i % 2 == 0) {
        o1.html.style.background = "#e9d0b2a1";
      } else {
        // o1.html.style.background = "#00c5ffa1";
        o1.html.style.background = "#d3b9a0a1";
      }
    }
  }

  drop(event) {
    event.preventDefault();
    const libObj = APP.libraryController.getDropObject();
    if (!libObj) {
      return;
    }

    let startBlock = false;

    if (libObj.type === "HandlerWithParams" || libObj.type === "Handler") {
      startBlock = true;
      if (event.target.className === "ViewArea") {
        return;
      }
    }

    const vec = APP.UI.translatePosTo(event.clientX, event.clientY);
    // console.log(vec);

    libObj.id = ++APP.index;
    libObj.x = vec[0];
    libObj.y = vec[1];

    const new_node = new BasicNode(libObj);
    this.nodes[new_node.id] = new_node;
    APP.UI.nodesScene.appendChild(new_node.htmlElement);

    let area = null;
    if (!startBlock) {
      for (let _area of this.logicBlocksStructs) {
        if (_area.html === event.target) {
          area = _area;
        }
      }
    } else {
      // NEW AREA
      new_node.htmlElement.classList.add("StartNodes");
      new_node.x = 10;

      // HANDLER VIEW AREA
      area = {};
      area.root = new_node;
      area.nodes = [];
      area.y1 = vec[1];
      area.y2 = vec[1];
      area.html = document.createElement("div");
      area.html.className = "ViewArea";
      container.appendChild(area.html);
      this.logicBlocksStructs.push(area);

      // Сортировка массива по Y координате
      this.logicBlocksStructs.sort(this.sortFunction);

      area.y1 = Math.min(area.y1, new_node.htmlElement.offsetTop);
      area.y2 = Math.max(
        area.y2,
        new_node.htmlElement.offsetTop + new_node.htmlElement.offsetHeight
      );

      area.html.style.top = area.y1 + "px";
      area.html.style.height = area.y2 - area.y1 + "px";

      this.changeAreaColor();

      // Корректировка
      this.postCorrect();
      // this.updateNodeViewAreas
    }

    if (area == null) {
      this.removeObject(new_node);
      return;
    }

    if (libObj.oid) {
      if (this.listBlockOids.indexOf(libObj.oid) === -1) {
        this.listBlockOids.push(libObj.oid);
      }
      new_node.oid = libObj.oid;
    }

    new_node.viewArea = area;
    area.nodes.push(new_node);

    this.updateNodeViewAreas(this.logicBlocksStructs[0]);
    this.updateNodeViewAreas(area);

    if (startBlock) {
      const view = document.createElement("div");
      view.id = "DropHandlerView";
      document.body.appendChild(view);

      const viewContainer = document.createElement("div");
      viewContainer.id = "DropHandlerViewContainer";
      view.appendChild(viewContainer);

      const title = document.createElement("div");
      title.id = "DropHandlerTitle";
      title.textContent = "Write event name:";
      viewContainer.appendChild(title);

      const input = document.createElement("input");
      input.id = "DropHandlerInput";
      input.value = "eventName";
      viewContainer.appendChild(input);

      const btn = document.createElement("div");
      btn.id = "DropHandlerBtn";
      btn.textContent = "Accept";
      viewContainer.appendChild(btn);

      btn.onclick = function (e) {
        new_node.changeHandlerParam(e.target.parentElement.children[1].value);
        e.target.parentElement.parentElement.remove();
      };
    }
  }

  dragover(event) {
    event.preventDefault();
  }

  // eslint-disable-next-line complexity
  exportScript(jsonObject) {
    this.clearScript();

    const { object } = jsonObject;
    const script = object.scriptJson;
    const { logics } = script;

    for (const logic of logics) {
      const linksN = {};

      // Parse nodes
      for (const node of logic.nodes) {
        console.log(node);

        const nodeData = APP.libraryController.getNodeData(
          node.library,
          node.type
        );
        let nodeObject = {};
        if (nodeData && nodeData.objNode) {
          nodeObject = nodeData.objNode;
          nodeObject.isValidBlock = nodeData.comlited;
        } else {
          nodeObject.name = node.type;
          nodeObject.type = node.type;
          nodeObject.lib = node.library;
          nodeObject.isValidBlock = false;
          nodeObject.Inputs = {};
          nodeObject.Inputs.flow = ["in"];
          nodeObject.Inputs.data = [];
          nodeObject.Outputs = {};
          nodeObject.Outputs.flow = [];
          nodeObject.Outputs.data = [];
          nodeObject.Defaults = {};
          nodeObject.Defaults.Inputs = [];

          if ("inputs" in node) {
            let index = 0;
            // eslint-disable-next-line max-depth
            for (const i of node.inputs) {
              nodeObject.Inputs.data.push(i.name);

              // eslint-disable-next-line max-depth
              if ("value" in i) {
                const d = {};
                d.index = index;
                d.value = i.value;
                nodeObject.Defaults.Inputs.push(d);
              }
              index++;
            }
          }

          if ("events" in node) {
            // eslint-disable-next-line max-depth
            for (const e of node.events) {
              nodeObject.Outputs.flow.push(e.name);
            }
          }
        }

        nodeObject.id = ++APP.index;
        nodeObject.x = node.pos_x;
        nodeObject.y = node.pos_y;

        const nnode = new BasicNode(nodeObject);
        this.nodes[nnode.id] = nnode;
        APP.UI.nodesScene.appendChild(nnode.htmlElement);

        const linkN = {};
        linkN.old = node;
        linkN.new = nnode;
        linksN[node.index] = linkN;
      }

      // Parse connections
      for (const node of logic.nodes) {
        // INPUTS
        if ("inputs" in node) {
          for (const input of node.inputs) {
            if ("source_node" in input && "source_output" in input) {
              // THIS PARSED BLOCK CONNECTIONS
              const thisIndex = node.index;
              const thisNodeNew = linksN[thisIndex].new;
              let thisSlot = null;
              // Find by Name
              for (const slot of thisNodeNew.slots) {
                if (
                  slot.name === input.name &&
                  slot.side === "IN" &&
                  slot.type === "data"
                ) {
                  thisSlot = slot;
                }
              }
              if (!thisSlot) {
                // Find by Index
                const indexOld = node.inputs.indexOf(input);
                for (const slot of thisNodeNew.slots) {
                  if (
                    slot.index === indexOld &&
                    slot.side === "IN" &&
                    slot.type === "data"
                  ) {
                    thisSlot = slot;
                  }
                }

                if (!thisSlot) {
                  continue;
                }
              }

              // SOURCE PARSED BLOCK CONNECTIONS
              const srcIndex = input.source_node;
              const srcNodeNew = linksN[srcIndex].new;
              let srcSlot = null;
              for (const slot of srcNodeNew.slots) {
                if (
                  slot.name === input.source_output &&
                  slot.side === "OUT" &&
                  slot.type === "data"
                ) {
                  srcSlot = slot;
                } else if (
                  srcSlot === null &&
                  slot.side === "OUT" &&
                  slot.type === "data"
                ) {
                  srcSlot = slot;
                }
              }
              if (!srcSlot) {
                continue;
              }

              const o = { type: "data" };
              const c1 = {
                nodeID: thisNodeNew.id,
                index: thisSlot.index,
              };
              const c2 = {
                nodeID: srcNodeNew.id,
                index: srcSlot.index,
              };
              o.dest = c1;
              o.source = c2;

              const l = new BasicConnection(o);
              APP.Logic.connections[l.id] = l;
              l.staticCreate();
              l.updatePositions();
              document.getElementById("container").appendChild(l.htmlElement);
            }
          }
        }

        if ("events" in node) {
          for (const event of node.events) {
            if ("actions" in event && "name" in event) {
              // THIS PARSED BLOCK CONNECTIONS
              const thisNodeNew = linksN[node.index].new;
              let thisSlot = null;
              // Find by Name
              for (const slot of thisNodeNew.slots) {
                if (
                  slot.name === event.name &&
                  slot.side === "OUT" &&
                  slot.type === "flow"
                ) {
                  thisSlot = slot;
                }
              }
              if (!thisSlot) {
                // Find by Index
                const indexOld = node.events.indexOf(event);
                for (const slot of thisNodeNew.slots) {
                  if (
                    slot.index === indexOld &&
                    slot.side === "OUT" &&
                    slot.type === "flow"
                  ) {
                    thisSlot = slot;
                  }
                }
                if (!thisSlot) {
                  continue;
                }
              }

              // SOURCE PARSED BLOCK CONNECTIONS
              for (const action of event.actions) {
                const srcNodeNew = linksN[action.node].new;
                let srcSlot = null;
                for (const slot of srcNodeNew.slots) {
                  if (
                    slot.name === action.value &&
                    slot.side === "IN" &&
                    slot.type === "flow"
                  ) {
                    srcSlot = slot;
                  } else if (
                    srcSlot === null &&
                    slot.side === "IN" &&
                    slot.type === "flow"
                  ) {
                    srcSlot = slot;
                  }
                }
                if (!srcSlot) {
                  continue;
                }

                const o = {
                  type: "flow",
                };
                const c1 = {
                  nodeID: thisNodeNew.id,
                  index: thisSlot.index,
                };
                const c2 = {
                  nodeID: srcNodeNew.id,
                  index: srcSlot.index,
                };
                o.dest = c2;
                o.source = c1;

                const l = new BasicConnection(o);
                APP.Logic.connections[l.id] = l;
                l.staticCreate();
                l.updatePositions();
                document.getElementById("container").appendChild(l.htmlElement);
              }
            }
          }
        }
      }
    }
  }
}

function insertParam(key, value) {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  const kvp = document.location.search.substr(1).split("&");

  let i = 0;
  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key + "=")) {
      let pair = kvp[i].split("=");
      pair[1] = value;
      kvp[i] = pair.join("=");
      break;
    }
  }

  if (i >= kvp.length) {
    kvp[kvp.length] = [key, value].join("=");
  }

  const params = kvp.join("&");

  const newURL =
    window.location.origin + window.location.pathname + "?" + params;
  window.history.pushState("", "", newURL);
}

function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode("0x" + p1);
      }
    )
  );
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function decode_base64_experimental(s) {
  var e = {},
    i,
    k,
    v = [],
    r = "",
    w = String.fromCharCode;
  var n = [
    [65, 91],
    [97, 123],
    [48, 58],
    [43, 44],
    [47, 48],
  ];

  for (z in n) {
    for (i = n[z][0]; i < n[z][1]; i++) {
      v.push(w(i));
    }
  }
  for (i = 0; i < 64; i++) {
    e[v[i]] = i;
  }

  for (i = 0; i < s.length; i += 72) {
    var b = 0,
      c,
      x,
      l = 0,
      o = s.substring(i, i + 72);
    for (x = 0; x < o.length; x++) {
      c = e[o.charAt(x)];
      b = (b << 6) + c;
      l += 6;
      while (l >= 8) {
        r += w((b >>> (l -= 8)) % 256);
      }
    }
  }
  return r;
}

function utf8Decode(utf8String) {
  if (typeof utf8String != "string")
    throw new TypeError("parameter ‘utf8String’ is not a string");
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  const unicodeString = utf8String
    .replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc =
          ((c.charCodeAt(0) & 0x0f) << 12) |
          ((c.charCodeAt(1) & 0x3f) << 6) |
          (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      }
    )
    .replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc = ((c.charCodeAt(0) & 0x1f) << 6) | (c.charCodeAt(1) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
  return unicodeString;
}
