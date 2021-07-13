/* eslint-disable class-methods-use-this */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable no-continue */
/* global APP BasicConnection */
/* exported BasicNode*/
'use strict';

// OutFlows: [{…}]
// id: 101
// params: [{…}]
// type: "StoreElement"
// x: 0
// y: 0
class Slot {

	constructor(index, type, name, value, html, side) {
		this.index = index;			// Индекс блока
		this.type = type;			// Тип блока
		this.name = name;			// Имя блока
		this.value = value;			// Значение блока
		this.html = html;			// 
		this.side = side;			// 
		this.lines = [];			// 
		this.store = null;			// 
		this.defaults = null;		// 
	}

	appendStoreToSlot(name) {
		// debugger;
		// this -> slot

		// CREATE STORE BLOCK
		const block = {
			id: ++APP.index,
			x: -1,
			y: -1,
			params: [{
				ElementName: name
			}],
			Inputs: {
				flow: [],
				data: []
			},
			Outputs: {
				flow: [],
				data: []
			}
		};
		
		const currentBlock = APP.logicController.currentLogic.nodes[this.nodeID];
		if (!currentBlock) {
			return;
		}

		let s_n = -1;
		let s_i = -1;
		let d_n = -1;
		let d_i = -1;

		if (this.side === "IN") {
			// FromStoreElement
			//{"type":"FromStoreElement","id":-1,"x":-1,"y":-1,"params":[{"ElementName":"NAME"}],"Inputs":{"flow":[],"data":[]},"Outputs":{"flow":[],"data":["FromStore"]}}
			block.type = "FromStoreElement";
			block.Outputs.data.push("FromStore");


			s_n = block.id;
			s_i = 0;
			d_n = this.nodeID;
			d_i = this.index;
		} else {
			// ToStoreElement
			//"{"type":"ToStoreElement","id":-1,"x":-1,"y":-1,"params":[{"ElementName":"NAME"}],"Inputs":{"flow":[],"data":["ToStore"]},"Outputs":{"flow":[],"data":[]}}"
			block.type = "ToStoreElement";
			block.Inputs.data.push("ToStore");

			s_n = this.nodeID;
			s_i = this.index;
			d_n = block.id;
			d_i = 0;

		}
		// APP.Logic.appendStoreBlock(block);
		// this.logic.appendStoreBlock(block);
		currentBlock.logic.appendStoreBlock(block);

		// CONNECT STORE
		// "{"type":"data","source":{"nodeID":11,"index":0},"dest":{"nodeID":12,"index":0}}"
		const connection = {
			type: "data",
			source: {
				nodeID: s_n,
				index: s_i
			},
			"dest": {
				nodeID: d_n,
				index: d_i
			}
		};

		currentBlock.appendStore(connection);
		currentBlock.logic.storesConnections.push(connection);

		// debugger;
	}
	
}



// eslint-disable-next-line no-unused-vars
class BasicNode {

	constructor(object, logic) {
		
		this.logic = logic;
		
		this.id = object.id;
		this.type = object.type;
		this.lib = "";
		
		this.pid = object.pid;
		this.cid = object.cid;
		
		this.x = object.x;
		this.y = object.y;
		
		this.isValidBlock = true;
		if ("isValidBlock" in object) {
			this.isValidBlock = object.isValidBlock;
		}
		
		if ("params" in object && object.params.length > 0) {
			this.defParam = JSON.parse(JSON.stringify(object.params));
		}

		this.slots = [];

		this.flowIn = {};
		this.flowOut = {};
		this.dataIn = {};
		this.dataOut = {};

		this.line = null;
		this.slot = null;
		this.lines = [];

		this.param = "";
		this.storeVal = "";
		this.name = "";
		
		if ("params" in object && object.params.length > 0) {
			if ("eventName" in object.params[0]) {
				this.param = object.params[0].eventName;
			}
			if ("ElementName" in object.params[0]) {
				// valEl = true;
				this.storeVal = object.params[0].ElementName;
			}
		}
		if ("name" in object) {
			this.name = object.name;
		}
		
		if ("lib" in object) {
			this.lib = object.lib;
		}
		
		if ("logic" in object) {
			this.logicName = object.logic;
		}
		
		this.createHtml();

		this.pressed = false;
		this.pressX = null;
		this.pressY = null;

		// Parse Slots
		this.parseSlots(object, "Inputs");
		this.parseSlots(object, "Outputs");
		
		// Defaults
		this.parseDefaults(object);
		
		if ("enums" in object) {
			this.setEnums(object.enums);
		}
		
		this.notDestroy = false;
		
		
		if (this.type === "Logic") {
			const findedLogic = this.logic.controller.logics[this.logicName];
			if (findedLogic) {
				this.notDestroy = true;
				findedLogic.logicNodes.push(this);
				this.findedLogic = findedLogic;
				
				
				this.htmlElement.addEventListener('contextmenu', function f0(findedLogic, e) {
					e.preventDefault(); 
					
					if (this.menu) {
						this.menu.remove();
						this.menu = null;
						return;
					}
					
					const menuBlock = document.createElement('div');
					menuBlock.className = 'menu-block';
					this.menu = menuBlock;
					this.htmlElement.appendChild(menuBlock);
					
					// EXPAND LOGIC
					const menuItem1 = document.createElement('div');
					menuItem1.className = 'menu-item';
					menuItem1.textContent = 'Expand logic';
					menuItem1.addEventListener('click', function f1(findedLogic, e) {
						findedLogic.expand(this);
					}.bind(this, findedLogic));
					menuBlock.appendChild(menuItem1);
					
					// COPY
					const menuItem2 = document.createElement('div');
					menuItem2.className = 'menu-item';
					menuItem2.textContent = 'Copy';
					menuItem2.addEventListener('click', function f2(e) {
						APP.Logic.copy([this]);
						e.target.parentElement.remove();
					}.bind(this));
					menuBlock.appendChild(menuItem2);
					
					// ADD TO COPY BUFFER
					const menuItem3 = document.createElement('div');
					menuItem3.className = 'menu-item';
					menuItem3.textContent = 'Add to buffer';
					menuItem3.addEventListener('click', function f3(e) {
						APP.Logic.addToCopied(this);
						e.target.parentElement.remove();
					}.bind(this));
					menuBlock.appendChild(menuItem3);
					
				}.bind(this, findedLogic), false);
			}
		}
	}
	
	setValidBlock(value) {
		if (this.isValidBlock === value) {
			return;
		}
		this.isValidBlock = value;
		if (this.isValidBlock) {
			this.htmlElement.classList.remove("bad_node");
		} else {
			this.htmlElement.classList.add("bad_node");
		}
	}
	
	set oid(value) {
		this._oid = value;
	
		if (value.length !== 24) {
			return;
		}
		
		if (this.logic.oids.indexOf(value) === -1) {
			this.logic.oids.push(value);
		}
		
	}
	
	get oid() {
		return this._oid;
	}
	
	
	createHtml() {
		
		// BASIC CONTAINER
		this.htmlElement = document.createElement("div");
		this.htmlElement.id = "N_" + this.id;
		this.htmlElement.classList.add("node");
		this.htmlElement.style.top = this.y + "px";
		this.htmlElement.style.left = this.x + "px";
		
		if (!this.isValidBlock) {
			this.htmlElement.classList.add("bad_node");
		}
		
		// TYPE AND ID
		this.htmlTypeContainer = document.createElement("div");
		this.htmlTypeContainer.classList.add("node-type");
		this.htmlElement.appendChild(this.htmlTypeContainer);
		
		// MORE INFO CONTAINER
		this.htmlMInfoContainer = document.createElement("div");
		this.htmlMInfoContainer.classList.add("node-info");
		this.htmlElement.appendChild(this.htmlMInfoContainer);
		
		// CONNECTIONs container
		this.container = document.createElement("div");
		this.container.classList.add("containers");
		this.htmlElement.appendChild(this.container);
		
		this.containerLEFT = document.createElement("div");
		this.containerLEFT.classList.add("connection_container");
		this.container.appendChild(this.containerLEFT);
		
		this.containerRIGHT = document.createElement("div");
		this.containerRIGHT.classList.add("connection_container");
		this.container.appendChild(this.containerRIGHT);
		
		this.inFlow = document.createElement("div");
		this.inFlow.classList.add("F");
		this.containerLEFT.appendChild(this.inFlow);
		
		this.outFlow = document.createElement("div");
		this.outFlow.classList.add("F");
		this.containerRIGHT.appendChild(this.outFlow);
		
		this.inData = document.createElement("div");
		this.inData.classList.add("D");
		this.containerLEFT.appendChild(this.inData);
		
		this.outData = document.createElement("div");
		this.outData.classList.add("D");
		this.containerRIGHT.appendChild(this.outData);
		
		
		// BOTTOM INDENT 1
		this.bottomDiv = document.createElement("div");
		this.bottomDiv.classList.add("node-b-indent1");
		this.htmlElement.appendChild(this.bottomDiv);
		
		// BOTTOM INDENT 2
		this.bottomDiv1 = document.createElement("div");
		this.bottomDiv1.classList.add("node-b-indent2");
		this.htmlElement.appendChild(this.bottomDiv1);
		
		
		if (this.name !== "") {
			this.htmlTypeContainer.style.color = "green";
			this.htmlTypeContainer.style.fontWeight = "bold";
			this.htmlTypeContainer.innerText = this.name;
		}
		
		if (this.storeVal !== "") {
			this.htmlTypeContainer.style.color = "blue";
			this.htmlTypeContainer.style.fontWeight = "bold";
			this.htmlTypeContainer.innerText = this.storeVal;
		}
		
		if (this.param !== "") {
			this.htmlTypeContainer.style.color = "red";
			this.htmlTypeContainer.style.fontWeight = "bold";
			this.htmlTypeContainer.innerText = this.param;
		}
		
		this.bottomDiv1.innerText = this.lib;
		
		if (this.logicName && this.type === "Logic") {
			this.bottomDiv1.innerText = this.logicName;
		}
			
		this.htmlMInfoContainer.style.height = "5px";
		this.bottomDiv.style.height = "5px";
		this.bottomDiv1.style.textAlign = "right";
		
	}
	
	parseSlots(object, slotsName) {
		if (slotsName in object) {
			if ("flow" in object[slotsName]) {
				for (const flowOut of object[slotsName].flow) {
					if (!flowOut) {
						continue;
					}
					if (slotsName === "Inputs") {
						this.addLeftConnection(flowOut, "flow");
					} else {
						this.addRightConnection(flowOut, "flow");
					}
				}
			}
			if ("data" in object[slotsName]) {
				for (const dataOut of object[slotsName].data) {
					if (!dataOut) {
						continue;
					}
					if (slotsName === "Inputs") {
						this.addLeftConnection(dataOut, "data");
					} else {
						this.addRightConnection(dataOut, "data");
					}
				}
			}
		}
	}
	
	
	
	addAction(name) {
		if (this.flowIn[name]) {
			return;
		}
		this.addLeftConnection(name, "flow");
	}
	
	removeAction(name) {
		const html = this.flowIn[name];
		if (!html) {
			return;
		}
		const slot = this.getSlot(html);
		if (!slot) {
			return;
		}
		
		delete this.flowIn[name];
		const index = this.stots.indexOf(slot);
		this.stots.splice(index, 1);
		
		
		slot.html.remove();
		
		for (const line of slot.lines) {
			if (!line) {
				continue;
			}
		}
		
		
	}
	
	addInput(name) {
		if (this.dataIn[name]) {
			return;
		}
		this.addLeftConnection(name, "data");
	}
	
	removeInput(name) {
		
	}
	
	addEvent(name) {
		if (this.flowOut[name]) {
			return;
		}
		this.addRightConnection(name, "flow");
	}
	
	removeEvent(name) {
		
	}
	
	addOutput(name) {
		if (this.dataOut[name]) {
			return;
		}
		this.addRightConnection(name, "data");
	}
	
	removeOutput(name) {
		
	}
	
	
	
	parseDefaults(object) {
		
		// Check Defaults
		if (("Defaults" in object)) {
			
			// Check Def Inputs
			if ("Inputs" in object.Defaults) {
				const defaults = object.Defaults.Inputs;
				for (const def of defaults) {
					const slot = this.getSlotId("data", "IN", def.index);
					if (!slot) {
						continue;
					}
					
					// slot.defaults = c;
					// if (slot.side === "OUT") {
					// 	slot.html.style.borderRight = "5px solid green";
					// } else {
					// 	slot.html.style.borderLeft = "5px solid green";
					// }
					
					this.appendDefaults(slot, def);
					
				}
				
			}
			
			// Check Def Outputs
			if ("Outputs" in object.Defaults) {
				const defaults = object.Defaults.Outputs;
				for (const def of defaults) {
					const slot = this.getSlotId("data", "OUT", def.index);
					if (!slot) {
						continue;
					}
					this.appendDefaults(slot, def);
				}
				
			}
			
		}
	}

	addLeftConnection(name, type, line) {

		if (line) {
			this.lines.push(line);
		}

		if (type === "flow") {
			const c = this.flowIn[name];
			if (typeof c !== "undefined") {
				return c;
			}
		} else {
			const c = this.dataIn[name];
			if (typeof c !== "undefined") {
				return c;
			}
		}

		const connection = document.createElement("div");
		connection.classList.add("connection");
		if (type === "data") {
			connection.ondblclick = this.dblClickConnectionSlot.bind(this);
		}

		const point = document.createElement("div");
		point.classList.add("c_point");
		connection.appendChild(point);

		const text = document.createElement("div");
		text.classList.add("fillText");
		text.innerText = name;
		connection.appendChild(text);

		let index = -1;
		if (type === "flow") {
			index = Object.keys(this.flowIn).length;
			this.inFlow.appendChild(connection);
			this.flowIn[name] = connection;
		} else {
			index = Object.keys(this.dataIn).length;
			this.inData.appendChild(connection);
			this.dataIn[name] = connection;
			point.style.border = "1px blue solid";
		}


		const s = new Slot(index, type, name, null, connection, "IN");
		s.htmlText = text;
		s.nodeID = this.id;
		this.slots.push(s);
		return connection;
	}

	addRightConnection(name, type, line) {

		if (line) {
			this.lines.push(line);
		}

		if (type === "flow") {
			const c = this.flowOut[name];
			if (typeof c !== "undefined") {
				return c;
			}
		} else {
			const c = this.dataOut[name];
			if (typeof c !== "undefined") {
				return c;
			}
		}

		const connection = document.createElement("div");
		connection.classList.add("connection");
		connection.classList.add("right");
		if (type === "data") {
			connection.ondblclick = this.dblClickConnectionSlot.bind(this);
		}

		const text = document.createElement("div");
		text.classList.add("fillText");
		text.innerText = name;
		connection.appendChild(text);

		const point = document.createElement("div");
		point.classList.add("c_point");
		connection.appendChild(point);

		let index = -1;
		if (type === "flow") {
			index = Object.keys(this.flowOut).length;
			this.outFlow.appendChild(connection);
			this.flowOut[name] = connection;
		} else {
			index = Object.keys(this.dataOut).length;
			this.outData.appendChild(connection);
			this.dataOut[name] = connection;
			point.style.border = "1px blue solid";
		}


		const s = new Slot(index, type, name, null, connection, "OUT");
		s.htmlText = text;
		s.nodeID = this.id;
		this.slots.push(s);
		return connection;
	}
	
	dblClickConnectionSlot(event) {
		
		console.log("dbl_Press");
		
		const slot = this.getSlot(event.target);
		
		if (!slot) {
			console.error("Slot is null!");
			return;
		}
		
		if (!this.checkSlotAppended(slot)) {
			return;
		}
		
		if (slot.store) {
			console.error("Slot Store already exist!");
			return;
		}
		
		// APP.UI.getStoreList(this.appendStoreToSlot.bind(slot));
		APP.UI.getStoreList(slot);
		
	}

	// eslint-disable-next-line class-methods-use-this
	checkSlotAppended(slot) {
		
		if (!slot) {
			return false;
		}
		
		if ((slot.type === "data" && slot.side === "IN") || (slot.type === "flow" && slot.side === "OUT")) {
			if (slot.lines.length || slot.store) {
				console.error("SLOT ALREADY EXIST");
				return false;
			}
		}
		
		return true;
	}
	
	mouseDown(event) {
		
		this.pressX = event.offsetX;
		this.pressY = event.offsetY;
		this.pressEvent = event;
		
		if (event.target.classList.contains("node-type")) {
			this.pressed = true;
		} else if (event.target.classList.contains("connection")) {
			
			this.slot = this.getSlot(event.target);
			if (!this.slot) {
				return;
			}
			
			// CHECK ON ONE
			
			// INPUTS vs EVENTS
			if (!this.checkSlotAppended(this.slot)) {
				return;
			}
			
			const indexSlot = this.slot.index;
			// const childs = event.target.parentElement.childNodes;
			// for (let i = 0; i < childs.length; ++i) {
			// if (childs[i] === event.target) {
			// indexSlot = i;
			// }
			// }
			
			const o = {
				"type": this.slot.type,
				"dest": {
					"nodeID": this.id,
					"index": indexSlot
				},
				"source": {
					"nodeID": this.id,
					"index": indexSlot
				}
			};

			this.line = new BasicConnection(o, this.logic);
			document.getElementById("container").appendChild(this.line.htmlElement);

			const px1 = this.htmlElement.offsetLeft + this.slot.html.children[0].offsetLeft;
			const py1 = this.htmlElement.offsetTop + this.slot.html.children[0].offsetTop;

			this.line.setPos(px1, py1, px1, py1);

		}

	}

	mouseMove(event) {
		if (this.pressed === true) {
			
			const x = APP.UI.getSceneOffset(event, 0) - this.pressX;
			const y = APP.UI.getSceneOffset(event, 1) - this.pressY;
			
			this.x = x;
			this.y = y;
			this.htmlElement.style.left = x + "px";
			this.htmlElement.style.top = y + "px";
				
			if (this.htmlElement.offsetLeft < 300) {
				this.htmlElement.style.left = "300px";
			}
			
			for (const l of this.lines) {
				l.updatePositions();
			}
			
			
			
		} else if (this.line && this.slot) {
			if (this.slot.side === "IN") {
				const px1 = this.htmlElement.offsetLeft + this.slot.html.children[0].offsetLeft;
				const py1 = this.htmlElement.offsetTop + this.slot.html.children[0].offsetTop;
				this.line.setPos(px1, py1,
					 APP.UI.getSceneOffset(event, 0),
					 APP.UI.getSceneOffset(event, 1) + 10);
			} else {
				const px1 = this.htmlElement.offsetLeft + this.slot.html.children[1].offsetLeft;
				const py1 = this.htmlElement.offsetTop + this.slot.html.children[1].offsetTop;
				this.line.setPos(
					 APP.UI.getSceneOffset(event, 0),
					 APP.UI.getSceneOffset(event, 1) + 10, px1, py1);
			}
		}
		
	}

	// eslint-disable-next-line complexity
	mouseUp(event) {
		this.pressed = false;
		if (this.line) {
			let nO = null;
			const path = event.path || (event.composedPath && event.composedPath());
			for (const n of path) {
				if (!n) {
					continue;
				}
				if (!n.id) {
					continue;
				}
				if (n.classList.contains("node")) {
					
					let id = null;
					if (n.id.indexOf("N_") !== -1) {
						id = n.id.substr(2);
					}
					
					nO = this.logic.nodes[id];
					break;
				}
			}
			if (nO) {
				
				if (nO.viewArea !== this.viewArea && (nO.viewArea && this.viewArea)) {
					this.line.destroy();
					delete this.line;
					this.line = null;
					return;
				}
				
				const slot = nO.getSlot(event.target);
				if (slot && (slot.type === this.slot.type) && (slot.side !== this.slot.side)) {
					
					const o = {
						"type": this.slot.type
					};
					const c1 = {
						"nodeID": this.id,
						"index": this.slot.index
					};
					const c2 = {
						"nodeID": nO.id,
						"index": slot.index
					};
					if (this.slot.side === "IN") {
						o.dest = c1;
						o.source = c2;
					} else {
						o.dest = c2;
						o.source = c1;
					}
					const l = new BasicConnection(o, this.logic);
					this.logic.connections[l.id] = l;
					l.staticCreate();
					l.updatePositions();
					document.getElementById("container").appendChild(l.htmlElement);
					
					const area = nO.viewArea || this.viewArea;
					if (area) {
						APP.Logic.checkViewStruct(area.root, area);
					}
					
				}
			}
			this.line.destroy();
			delete this.line;
			this.line = null;
		}
		
		// try {
			
		const arr1 = APP.UI.getSceneOffsetXY(event.clientX, event.clientY);
		const arr2 = APP.UI.getSceneOffsetXY(this.pressEvent.clientX, this.pressEvent.clientY);
		const dx = arr1[0] - arr2[0];
		const dy = arr1[1] - arr2[1];
		if (Math.abs(dx) <= 10 && Math.abs(dy) <= 10) {
				
			if (!Object.keys(this.dataIn).length) {
				return;
			}
				
			APP.UI.rightPanel.style.display = "";
			const container = APP.UI.m_rightPanelContainerHtml;
			if (container.nodeID === this.id) {
				return;
			}
			container.nodeID = this.id;
				
			for (const dataInKey in this.dataIn) {
				if (!dataInKey) {
					continue;
				}
					
				const inputHtml = this.dataIn[dataInKey];
					
				const slot = this.getSlot(inputHtml);
				if (!slot) {
					continue;
				}
				
				
				// this.createSlotProperty(slot);
				
			
					
				// console.log(dataInKey, slot);
				// continue;
					
				// NAME
				const inputNameHtml = document.createElement('div');
				inputNameHtml.className = 'PropertyName';
				inputNameHtml.textContent = slot.name;
				container.appendChild(inputNameHtml);
				
					
				// STORE
				const inputStoreHtml = document.createElement('div');
				inputStoreHtml.className = 'PropertyType';
				inputStoreHtml.textContent = "Store:";
				container.appendChild(inputStoreHtml);
					
				const c1 = document.createElement('div');
				c1.className = 'ProperyValueContainer';
				container.appendChild(c1);
					
				if (slot.store) {
					
					const storeId = slot.store.source.nodeID;
					const store = this.logic.storesBlocks[storeId];
					
					const name = store.params[0].ElementName;
					
					// name - remove
					const storeName = document.createElement('div');
					storeName.className = 'PropertyValueStore';
					storeName.textContent = name;
					c1.appendChild(storeName);

					const inputType = document.createElement('div');
					inputType.className = 'PropertyTypeBtn';
					inputType.textContent = "X";
					c1.appendChild(inputType);
					
					inputType.onclick = function (e) {

						const storeConnection = this.store;

						this.html.style.borderLeft = "none";
						this.html.style.borderRight = "none";
						this.html.children[2].remove();

						const currentBlock = APP.logicController.currentLogic.nodes[this.nodeID];
						if (currentBlock) {
							currentBlock.logic.removeStoreConnection(this.store);
							this.store = null;
						}

					}.bind(slot);
					
				} else {
					// select
					const storeName = document.createElement('div');
					storeName.className = 'PropertyValueStoreBtn';
					storeName.textContent = 'Choose store value';
					c1.appendChild(storeName);
					storeName.addEventListener('click', function f(slot) {
						APP.UI.getStoreList(slot);
					}.bind(this, slot));
				}
					
				// DEFAULT
				const inputDefaultHtml = document.createElement('div');
				inputDefaultHtml.className = 'PropertyType';
				inputDefaultHtml.textContent = "Default:";
				container.appendChild(inputDefaultHtml);
				
				let defVal = '';
				let defType = null;
				if (slot.defaults) {
					
					defVal = slot.defaults.value;
					defType = typeof defVal;
					// console.log(defType, ' : ', defVal);
				}
				
				const c2 = document.createElement('div');
				c2.className = 'ProperyValueContainer';
				container.appendChild(c2);
					
				const inputDef = document.createElement('input');
				inputDef.className = 'PropertyValueDef';
				inputDef.value = defVal;
				c2.appendChild(inputDef);
				
				console.log('prop:', defType);
				
				//  CHECK TYPE
				if (defType === "boolean") {
					inputDef.type = "checkbox";
					inputDef.className = "ValueEditInputB";
					inputDef.checked = defVal;
				} else if (defType === "number") {
					inputDef.type = "number";
					inputDef.className = "ValueEditInputN";
					inputDef.value = defVal;
				} else if (defType === "object") {
					inputDef.type = "textarea";
					inputDef.className = "ValueEditInputS";
					inputDef.value = JSON.stringify(defVal);
				} else {
					inputDef.value = defVal;
				}
				inputDef.addEventListener('input', function fff(slot, event) {
					const input = event.target;
					let newValue = input.value;
					const {type} = input;
					if (type === "checkbox") {
						newValue = input.checked;
					} else if (type === "number") {
						newValue = parseFloat(input.value);
					} else if (type === "text") {
						newValue = input.value;
					} else if (type === "textarea") {
						try {
							newValue = JSON.parse(input.value);
						} catch (e) {
							console.error("Catn parse text to json. Bad JSON! ");
						}
					}
					
					if (slot.defaults) {
						slot.defaults.value = newValue;
						slot.htmlDefault.textContent = newValue;
					} else {
						this.appendDefaults(slot, {
							"index": slot.index,
							"value": newValue
						});
					}
				}.bind(this, slot));
					
				const inputType = document.createElement('div');
				inputType.className = 'PropertyTypeBtn';
				inputType.textContent = "Type";
				c2.appendChild(inputType);
				
			}
		}
	}
	
	// createSlotProperty(slot) {
	// 	const container = APP.UI.m_rightPanelContainerHtml;
	// 	// NAME
	// 	const inputNameHtml = document.createElement('div');
	// 	inputNameHtml.className = 'PropertyName';
	// 	inputNameHtml.textContent = slot.name;
	// 	container.appendChild(inputNameHtml);

	// 	let storeHtml = null;
	// 	let defaultsHtml = null;

	// 	if (slot.store) {
	// 		// STORE
	// 		const storeId = slot.store.source.nodeID;
	// 		const store = this.logic.storesBlocks[storeId];

	// 		const name = store.params[0].ElementName;

	// 		storeHtml = document.createElement('div');
	// 		container.appendChild(storeHtml);

	// 		const storeTitleHtml = document.createElement('div');
	// 		storeTitleHtml.className = 'PropertyType';
	// 		storeTitleHtml.textContent = "Store:";
	// 		storeHtml.appendChild(storeTitleHtml);
			
	// 		const c1 = document.createElement('div');
	// 		c1.className = 'ProperyValueContainer';
	// 		container.appendChild(c1);

	// 		// name - remove
	// 		const storeName = document.createElement('div');
	// 		storeName.className = 'PropertyValueStore';
	// 		storeName.textContent = name;
	// 		c1.appendChild(storeName);

	// 		const removeStoreBtn = document.createElement('div');
	// 		removeStoreBtn.className = 'PropertyTypeBtn';
	// 		removeStoreBtn.textContent = "X";
	// 		c1.appendChild(removeStoreBtn);

	// 	} else if (slot.defaults) {
	// 		// DEFAULTS

	// 	} else {
	// 		// ALL EMPTY
	// 	}
	// }
	
	changeHandlerParam(handlerParameterName) {
		// debugger;
		
		if (!handlerParameterName || !handlerParameterName.length) {
			return;
		}
		
		this.param = handlerParameterName;
		this.defParam[0].eventName = handlerParameterName;
		this.htmlTypeContainer.textContent = handlerParameterName;
		
	}

	focused(bool) {
		if (bool) {
			this.htmlElement.classList.add("focused");
		} else {
			this.htmlElement.classList.remove("focused");
		}
	}

	destroy() {
		
		// for (const c of this.lines) {
		// 	if (!c) {
		// 		continue;
		// 	}
		// 	APP.Logic.removeObject(c)
		// 	// c.destroy();
		// }
		
		for (let i = 0; i < this.lines.length; ++i) {
			const c = this.lines[i];
			if (!c) {
				continue;
			}
			APP.Logic.removeObject(c);
			i--;
			// c.destroy();
		}
		
		
		this.htmlElement.remove();
		// delete GlobalNodes[this.id];
	}
	
	appendConnection(connection) {
		
		if (!connection) {
			return false;
		}
		
		let slot = null;
		if (this.id === connection.nodeID1) {
			slot = this.getSlotId(connection.type, "IN", connection.index1);
		} else if (this.id === connection.nodeID2) {
			slot = this.getSlotId(connection.type, "OUT", connection.index2);
		}
		
		if (slot === null) {
			APP.Logic.removeObject(connection);
			return false;
		}
		
		if (!this.checkSlotAppended(slot)) {
			APP.Logic.removeObject(connection);
			return false;
		}
		
		// check on 
		
		slot.lines.push(connection);
		this.lines.push(connection);
		
		return true;
		
	}

	removeLine(line) {
		
		if (!line) {
			return;
		}
		
		
		let slot = null;
		if (line.nodeID1 === this.id) {
			slot = this.getSlotId(line.type, "IN", line.index1);
		} else {
			slot = this.getSlotId(line.type, "OUT", line.index2);
		}
		
		if (slot) {
			const index = slot.lines.indexOf(line);
			if (index !== -1) {
				slot.lines.splice(index, 1);
			}
		}
		
		for (let i = 0; i < this.lines.length; ++i) {
			const l = this.lines[i];
			if (!l) {
				continue;
			}
			if (l === line) {
				this.lines.splice(i, 1);
				--i;
			}
		}
		
	}
	
	appendStore(data) {
		
		if (!data) {
			return false;
		}
		
		let slot = null;
		let storeBlock = null;
		if (this.id === data.dest.nodeID) {
			slot = this.getSlotId(data.type, "IN", data.dest.index);
			storeBlock = this.logic.storesBlocks[data.source.nodeID];
		} else if (this.id === data.source.nodeID) {
			slot = this.getSlotId(data.type, "OUT", data.source.index);
			storeBlock = this.logic.storesBlocks[data.dest.nodeID];
		}

		if (!slot || !storeBlock) {
			// APP.Logic.removeObject(connection);
			return false;
		}
		
		if (!this.checkSlotAppended(slot)) {
			return false;
		}
		
		slot.store = (data);
		if (slot.side === "OUT") {
			
			slot.html.style.borderRight = "5px solid var(--storeBlockValueTriggerColor)";
			//slot.html.style.borderRight = "5px solid red";
		} else {
			
			slot.html.style.borderLeft = "5px solid var(--storeBlockValueTriggerColor)";
			// slot.html.style.borderLeft = "5px solid red";
		}
		if(storeBlock.params[0].ElementName == "CreateProject") debugger;
		
		// STORE NAME
		const div = document.createElement("div");
		div.className = "StoreBlock";
		div.innerText = storeBlock.params[0].ElementName;
		slot.html.appendChild(div);
		
		// REMOVE 
		const removeDiv = document.createElement("div");
		removeDiv.innerText = "x";
		div.appendChild(removeDiv);
		
		removeDiv.onclick = function (e) {
			
			const storeConnection = this.store;
			
			this.html.style.borderLeft = "none";
			this.html.style.borderRight = "none";
			this.html.children[2].remove();
			
			const currentBlock = APP.logicController.currentLogic.nodes[this.nodeID];
			if (currentBlock) {
				currentBlock.logic.removeStoreConnection(this.store);
				this.store = null;
			}
			
		}.bind(slot);
		
		
		// FIXED
		const fixedDiv = document.createElement("div");
		fixedDiv.className = "Fixed";
		fixedDiv.innerText = "!";
		div.appendChild(fixedDiv);

		fixedDiv.onclick = function (e) {

			const div = e.target.parentElement;
			
			if (div.classList.contains("F")) {
				div.classList.remove("F");
				// e.target.style.background = "";
			} else {
				// e.target.style.font = "#459c4b";
				div.classList.add("F");
			}

		}
		
		return true;
		
	}
	
	appendDefaults(slot, def) {
		
		if (!this.checkSlotAppended(slot)) {
			return false;
		}

		//if(def.value == "CreateProject") debugger;
		
		slot.defaults = def;
		if (slot.side === "OUT") {
			// slot.html.style.borderRight = "5px solid green";
			slot.html.style.borderRight = "5px solid var(--defaultBlockValueTriggerColor)";
		} else {
			// slot.html.style.borderLeft = "5px solid green";
			slot.html.style.borderLeft = "5px solid var(--defaultBlockValueTriggerColor)";
		}
		
		// STORE NAME
		const div = document.createElement("div");
		div.className = "StoreBlock";
		div.innerText = JSON.stringify(def.value);
		slot.html.appendChild(div);
		slot.htmlDefault = div;
		
		// REMOVE 
		const removeDiv = document.createElement("div");
		removeDiv.innerText = "x";
		div.appendChild(removeDiv);
		
		removeDiv.onclick = function f(e) {
			
			this.html.style.borderLeft = "none";
			this.html.style.borderRight = "none";
			this.htmlDefault.remove();
			// debugger;
			this.defaults = null;
			
		}.bind(slot);
		
		
		// FIXED
		const fixedDiv = document.createElement("div");
		fixedDiv.className = "Fixed";
		fixedDiv.innerText = "!";
		div.appendChild(fixedDiv);

		fixedDiv.onclick = function (e) {
			console.log(JSON.stringify(def.value));
			const div = e.target.parentElement;
			if (div.classList.contains("F")) {
				div.classList.remove("F");
			} else {
				div.classList.add("F");
			}
		}
		
		return true;
		
	}
	
	getSlot(html) {
		
		if (!html) {
			return null;
		}
		
		for (const s of this.slots) {
			if (!s) {
				continue;
			}

			if (s.html === html) {
				return s;
			}
		}
		return null;
	}
	
	getSlotId(type, side, index) {
		for (const s of this.slots) {
			if (!s) {
				continue;
			}
			
			if (s.type === type && s.side === side && s.index === index) {
				return s;
			}
		}
		return null;
	}
	
	
	setEnums(enums) {
		// debugger;
		
		for (const enumName in enums) {
			if (!enumName) {
				continue;
			}
			
			for (const slot of this.slots) {
				if (slot.type === "data" && slot.name === enumName) {
					
					if (slot.htmlEnum) {
						return;
					}
					
					console.log("ADD ENUM TO SLOT:", slot);
					
					let defVal = undefined;
					if (slot.defaults) {
						defVal = slot.defaults.value;
					}
					
					const enumArray = enums[enumName];
					
					const comboInput = document.createElement("select");
					comboInput.className = "NodeInputEnum";
					comboInput.addEventListener("change", this.changeEnum.bind(this));
					comboInput.selectedIndex = 0;
					
					let i = 0;
					for (const enumValue of enumArray) {
						const comboValue = document.createElement("option");
						comboValue.textContent = enumValue;
						comboValue.value = enumValue;
						comboInput.appendChild(comboValue);
						// eslint-disable-next-line max-depth
						if (defVal && enumValue === defVal) {
							comboInput.selectedIndex = i;
						}
						i++;
					}
					
					
					
					slot.htmlEnum = comboInput;
					slot.html.appendChild(comboInput);
					slot.html.ondblclick = null;
					
					
					this.changeEnum({
						"target": comboInput
					});
					
					break;
				}
			}
		}
	}
	
	changeEnum(event) {
		
		const slot = this.getSlot(event.target.parentElement);
		if (!slot) {
			console.error("Slot not found!");
			return;
		}
		
		slot.html.style.borderLeft = "none";
		slot.html.style.borderRight = "none";
		if (slot.htmlDefault) {
			slot.htmlDefault.remove();
		}
		slot.defaults = null;
		
		this.appendDefaults(slot, {
			"index": slot.index,
			"value": event.target.value
		});
		
	}
	
	generateMenu() {
		
		if (this.type === "Logic") {
			const findedLogic = this.logic.controller.logics[this.logicName];
			if (findedLogic) {
				
				// const background = document.createElement('div');
				// background.className = 'menu-background';

				const menuBlock = document.createElement('div');
				menuBlock.className = 'menu-block';
				this.htmlElement.appendChild(menuBlock);
				
				const menuItem = document.createElement('div');
				menuItem.className = 'menu-item';
				menuItem.textContent = 'Expand logic';
				menuBlock.appendChild(menuItem);
				
			}
		}
		
	}
	
	
}