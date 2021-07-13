/* eslint-disable spaced-comment */
/* eslint-disable lines-around-comment */
/* eslint-disable complexity */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable guard-for-in */
/* global APP LogicNode*/


// eslint-disable-next-line no-unused-vars
class LogicController {
	
	constructor(htmlLogicsContainer, htmlStructContainer) {
		
		this.htmlLogicsContainer = htmlLogicsContainer;
		this.htmlStructContainer = htmlStructContainer;
		
		this.logics = {};
		
		this.htmlBtnNewLodic = null;
		this.htmlLogicsList = null;
		
		this.htmlActions = null;
		this.htmlEvents = null;
		this.htmlInputs = null;
		this.htmlOutputs = null;
		
		this.mainLogic = null;
		this.currentLogic = null;
		
		this.initialize();
		
	}
	
	// eslint-disable-next-line max-lines-per-function
	initialize() {
		
		this.htmlLogicsContainer.className = "RightTopContainer";
		this.htmlStructContainer.className = "RightTopContainer";
		this.htmlStructContainer.classList.add("Main");
		
		
		// Fill logics
		this.htmlBtnNewLodic = document.createElement("div");
		this.htmlBtnNewLodic.className = "BtnAddLogic";
		this.htmlBtnNewLodic.textContent = "Add logic";
		this.htmlBtnNewLodic.addEventListener("click", this.createLogicEvent.bind(this));
		this.htmlLogicsContainer.appendChild(this.htmlBtnNewLodic);
		
		this.htmlLogicsList = document.createElement("div");
		this.htmlLogicsList.className = "ListLogicsCon";
		this.htmlLogicsContainer.appendChild(this.htmlLogicsList);
		
		this.mainLogic = this.createLogic("Main");
		this.selectLogic("Main");
		
		
		// Fill current struct
		this.htmlActions = document.createElement("div");
		this.htmlActions.className = "ConnectionContainer";
		this.htmlStructContainer.appendChild(this.htmlActions);
		
		this.createHtmlConnection("Actions:", "+", this.htmlActions, false, function f() {
			if (this.currentLogic) {
				this.createDialogText("Enter action name:", this.currentLogic.addAction.bind(this.currentLogic));
			}
		}.bind(this));
		
		
		
		this.htmlEvents = document.createElement("div");
		this.htmlEvents.className = "ConnectionContainer";
		this.htmlStructContainer.appendChild(this.htmlEvents);
		
		this.createHtmlConnection("Events:", "+", this.htmlEvents, false, function f() {
			if (this.currentLogic) {
				this.createDialogText("Enter event name:", this.currentLogic.addEvent.bind(this.currentLogic));
			}
		}.bind(this));
		
		
		
		this.htmlInputs = document.createElement("div");
		this.htmlInputs.className = "ConnectionContainer";
		this.htmlStructContainer.appendChild(this.htmlInputs);
		
		this.createHtmlConnection("Inputs:", "+", this.htmlInputs, false, function f() {
			if (this.currentLogic) {
				this.createDialogText("Enter event name:", this.currentLogic.addInput.bind(this.currentLogic));
			}
		}.bind(this));
		
		
		
		this.htmlOutputs = document.createElement("div");
		this.htmlOutputs.className = "ConnectionContainer";
		this.htmlStructContainer.appendChild(this.htmlOutputs);
		
		this.createHtmlConnection("Outputs:", "+", this.htmlOutputs, false, function f() {
			if (this.currentLogic) {
				this.createDialogText("Enter output name:", this.currentLogic.addOutput.bind(this.currentLogic));
			}
		}.bind(this));
		
		
	}
	
	load(script) {
		
		if (!this.mainLogic) {
			APP.log("error", "Main logic not found!");
			return;
		}
		

		
		
		if ("logics" in script) { 
			
			const {logics} = script;
			if (!logics) {
				return;
			}
			
			for (const logicName in logics) {
				
				if (!logicName) {
					continue;
				}
				
				const logicJson = logics[logicName];
				if (!logicJson) {
					continue;
				}
				
				this.parseLogic(logicName, logicJson);
				
			}
			
		}
		
		this.selectLogic("Main");
		this.clearScene();
		this.mainLogic.parse(script.nodes, script.connections);
		this.fillScene();

		for (const id in this.mainLogic.nodes) {
			APP.UI.searchBlock(this.mainLogic.nodes[id]);
			break;
		}
		
	}
	
	parseLogic(name, jsonData) {
		
		const logic = this.createLogic(name);
		if (logic) {
			logic.parse(jsonData.nodes, jsonData.connections);
		}
		
	}
	
	// eslint-disable-next-line max-lines-per-function, complexity
	save() {
		
		
		
		// SAVE OBJECT
		const object = {};
		object.nodes = [];
		object.connections = [];
		object.logics = {};
		object.jsBlocksOIDs = [];
		
		
		for (const logicName in this.logics) {
			
			if (!logicName) {
				continue;
			}
			
			const logic = this.logics[logicName];
			if (!logic) {
				continue;
			}
			
			let logicObject = null;
			if (logicName !== "Main") {
				logicObject = {};
				logicObject.nodes = [];
				logicObject.connections = [];
				object.logics[logicName] = logicObject;
			}
			
			// OIDS
			for (const oid of logic.oids) {
				if (object.jsBlocksOIDs.indexOf(oid) === -1) {
					object.jsBlocksOIDs.push(oid);
				}
			}
			
			
			
			// SAVE NODES
			for (const nodeName in logic.nodes) {
				
				if (!nodeName) {
					continue;
				}
				
				const node = logic.nodes[nodeName];
				if (!node) {
					continue;
				}
				
				const nodeJson = APP.Logic.generateNode(node);
				
				if (logicObject) {
					logicObject.nodes.push(nodeJson);
				} else {
					object.nodes.push(nodeJson);
				}
				
			}
			
			
			
			// SAVE STORE NODES
			for (const snId in logic.storesBlocks) {
				
				if (!snId) {
					continue;
				}
				
				const sn = logic.storesBlocks[snId];
				if (!sn) {
					continue;
				}
				
				if (logicObject) {
					logicObject.nodes.push(sn);
				} else {
					object.nodes.push(sn);
				}
				
			}
			
			
			
			// SAVE CONNECTION
			for (const connectionID in logic.connections) {
				
				if (!connectionID) {
					continue;
				}
				
				const connection = logic.connections[connectionID];
				if (!connection) {
					continue;
				}
				
				const oConnection = {};
				oConnection.type = connection.type;
				
				if (connection.pid) {
					oConnection.pid = connection.pid;
				}
				
				oConnection.source = {
					"nodeID": connection.nodeID2,
					"index": connection.index2
				};
				oConnection.dest = {
					"nodeID": connection.nodeID1,
					"index": connection.index1
				};
				
				if (logicObject) {
					logicObject.connections.push(oConnection);
				} else {
					object.connections.push(oConnection);
				}
				
			}
			
			
			
			// SAVE STORE CONNECTION 
			for (const sn of logic.storesConnections) {
				
				if (!sn) {
					continue;
				}
				
				if (logicObject) {
					logicObject.connections.push(sn);
				} else {
					object.connections.push(sn);
				}
				
			}
			
		}
		
		
		
		// SAVE STORE VALUES
		for (const name in this.stores) {
			
			if (!name) {
				continue;
			}
			
			const value = this.stores[name];
			if (!value) {
				continue;
			}
			
			object.store[name] = value;
			
		}
		
		return object;
		
	}
	
	
	
	createLogicEvent(event) {
		this.createDialogText("Enter logic name:", this.createLogic.bind(this));
	}
	
	selectLogicEvent(event) {
		const text = event.target.textContent;
		this.selectLogic(text);
	}
	
	selectLogic(name) {
		
		const logic = this.logics[name];
		if (logic) {
			
			if (this.currentLogic) {
				this.currentLogic.html.classList.remove("selected");
				
				
			}
			// clear scene and connections
			this.clearScene();
			this.currentLogic = logic;
			this.currentLogic.html.classList.add("selected");
		}
		
		if (name === "Main") {
			this.htmlStructContainer.classList.add("Main");
		} else {
			this.htmlStructContainer.classList.remove("Main");
		}
		
		// fill scene and connections
		this.fillScene();
		
		
	}
	
	
	// eslint-disable-next-line max-lines-per-function
	clearScene() {
		
		if (!this.currentLogic) {
			return;
		}
		
		// clear blocks
		for (const blockId in this.currentLogic.nodes) {
			if (!blockId) {
				continue;
			}
			const block = this.currentLogic.nodes[blockId];
			if (!block) {
				continue;
			}
			block.htmlElement.remove();
		}
		
		
		
		// clear connection
		for (const connectionId in this.currentLogic.connections) {
			if (!connectionId) {
				continue;
			}
			const connection = this.currentLogic.connections[connectionId];
			if (!connection) {
				continue;
			}
			connection.htmlLine.remove();
			connection.htmlP1.remove();
			connection.htmlP2.remove();
			connection.htmlSupportLine.remove();
		}
		
		
		
		// clear actions
		for (const actionName in this.currentLogic.actions) {
			
			if (!actionName) {
				continue;
			}
			
			const action = this.currentLogic.actions[actionName];
			if (!action) {
				continue;
			}
			
			action.html.remove();
			
		}
		
		
		
		// clear events
		for (const eventName in this.currentLogic.events) {

			if (!eventName) {
				continue;
			}

			const event = this.currentLogic.events[eventName];
			if (!event) {
				continue;
			}

			event.html.remove();

		}
		
		
		
		// clear inputs
		for (const inputName in this.currentLogic.inputs) {

			if (!inputName) {
				continue;
			}

			const input = this.currentLogic.inputs[inputName];
			if (!input) {
				continue;
			}

			input.html.remove();

		}
		
		// clear output
		for (const outputName in this.currentLogic.outputs) {

			if (!outputName) {
				continue;
			}

			const output = this.currentLogic.outputs[outputName];
			if (!output) {
				continue;
			}

			output.html.remove();

		}
		
		
		
	}
	
	// eslint-disable-next-line max-lines-per-function
	fillScene() {

		if (!this.currentLogic) {
			return;
		}

		// Fill blocks
		for (const blockId in this.currentLogic.nodes) {
			
			if (!blockId) {
				continue;
			}
			
			const block = this.currentLogic.nodes[blockId];
			if (!block) {
				continue;
			}
			
			APP.htmlScript.appendChild(block.htmlElement);
			
		}
		
		
		
		// Fill connection
		for (const connectionId in this.currentLogic.connections) {
			
			if (!connectionId) {
				continue;
			}
			
			const connection = this.currentLogic.connections[connectionId];
			if (!connection) {
				continue;
			}
			
			connection.updatePositions();
			APP.htmlSVG.appendChild(connection.htmlLine);
			APP.htmlSVG.appendChild(connection.htmlP1);
			APP.htmlSVG.appendChild(connection.htmlP2);
			APP.htmlSVG.appendChild(connection.htmlSupportLine);
			
		}
		
		
		
		// Fill actions
		for (const actionName in this.currentLogic.actions) {

			if (!actionName) {
				continue;
			}

			const action = this.currentLogic.actions[actionName];
			if (!action) {
				continue;
			}

			this.htmlActions.appendChild(action.html);

		}



		// Fill events
		for (const eventName in this.currentLogic.events) {

			if (!eventName) {
				continue;
			}

			const event = this.currentLogic.events[eventName];
			if (!event) {
				continue;
			}

			this.htmlEvents.appendChild(event.html);

		}



		// Fill inputs
		for (const inputName in this.currentLogic.inputs) {

			if (!inputName) {
				continue;
			}

			const input = this.currentLogic.inputs[inputName];
			if (!input) {
				continue;
			}

			this.htmlInputs.appendChild(input.html);

		}
		
		
		
		// Fill output
		for (const outputName in this.currentLogic.outputs) {

			if (!outputName) {
				continue;
			}

			const output = this.currentLogic.outputs[outputName];
			if (!output) {
				continue;
			}

			this.htmlOutputs.appendChild(output.html);

		}
		
	}
	
	createLogic(name) {
		
		if (name in this.logics) {
			APP.log("warn", "Name already exist!");
			return null;
		}
		
		console.log("Logic created:", name);
		
		const logic = new LogicNode(this);
		logic.name = name;
		logic.html = this.addHtmlLogic(name);
		this.logics[name] = logic;
		
		return logic;
		
	}
	
	removeLogic(name) {
		if (name in this.logics) {
			
			const logic = this.logics[name];
			
			logic.html.remove();
			delete this.logics[name];
			
			APP.log("info", "Logic deleted!");
			
		} 
		APP.log("error", "Logic not found!");
	}
	
	
	
	addHtmlLogic(name) {
		const htmlLogic = document.createElement("div");
		htmlLogic.className = "LogicItem";
		htmlLogic.title = name;
		htmlLogic.textContent = name;
		htmlLogic.draggable = true;
		htmlLogic.addEventListener("dragstart", this.dragStart.bind(this));
		htmlLogic.addEventListener("dragend", this.dragEnd.bind(this));
		htmlLogic.addEventListener("click", this.selectLogicEvent.bind(this));
		this.htmlLogicsList.appendChild(htmlLogic);
		return htmlLogic;
	}
	
	dragStart(event) {
		const logic = this.logics[event.target.textContent];
		
		if (this.mainLogic !== this.currentLogic) {
			return;
		}
		
		if (logic) {
			APP.libraryController.m_logicNode = logic.generateNode();
		}
	}

	// eslint-disable-next-line class-methods-use-this
	dragEnd() {
		APP.libraryController.m_logicNode = null;
	}
	
	
	
	// eslint-disable-next-line class-methods-use-this
	createDialogText(title, callback) {
		
		const dialogMain = document.createElement("div");
		dialogMain.className = "DialogEditorBack";
		
		const dialogContainer = document.createElement("div");
		dialogContainer.className = "DialogEditorContainer";
		dialogMain.appendChild(dialogContainer);
		
		const dialogTitle = document.createElement("div");
		dialogTitle.textContent = title;
		dialogTitle.className = "DialogEditorTitle";
		dialogContainer.appendChild(dialogTitle);
		
		const dialogInput = document.createElement("input");
		dialogInput.className = "DialogEditorInput";
		dialogContainer.appendChild(dialogInput);
		
		const dialogBtnsContainer = document.createElement("div");
		dialogBtnsContainer.className = "DialogEditorBtns";
		dialogContainer.appendChild(dialogBtnsContainer);
		
		const dialogBtnAccept = document.createElement("div");
		dialogBtnAccept.textContent = "Ok";
		dialogBtnAccept.className = "DialogEditorBtn";
		dialogBtnAccept.addEventListener("click", function f(e) {
			const text = e.target.offsetParent.children[1].value;
			e.target.offsetParent.parentElement.remove();
			callback(text);
		}.bind(this));
		dialogBtnsContainer.appendChild(dialogBtnAccept);
		
		const dialogBtnCancel = document.createElement("div");
		dialogBtnCancel.textContent = "Cancel";
		dialogBtnCancel.className = "DialogEditorBtn";
		dialogBtnCancel.addEventListener("click", function f(e) {
			e.target.offsetParent.parentElement.remove();
		});
		dialogBtnsContainer.appendChild(dialogBtnCancel);
		
		document.body.appendChild(dialogMain);
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	createHtmlConnection(txt, btnTxt, container, drop, callback) {
		
		const item = document.createElement("div");
		item.className = "ConnectionItem";
		container.appendChild(item);
		
		const itemTxt = document.createElement("div");
		itemTxt.textContent = txt;
		itemTxt.className = "ConnectionItemTxt";
		item.appendChild(itemTxt);
		
		const itemBtn = document.createElement("div");
		itemBtn.textContent = btnTxt;
		itemBtn.className = "ConnectionItemBtn";
		itemBtn.addEventListener("click", callback);
		item.appendChild(itemBtn);
		
		if (drop) {
			itemTxt.draggable = true;
			itemTxt.addEventListener("dragstart", this.dragStart.bind(this));
			itemTxt.addEventListener("dragend", this.dragEnd.bind(this));
			itemTxt.className = "ConnectionItemTxt2";
		}
		
		return item;
		
	}
	
	
	
	copy() {
		
	}
	
	
	
	paste() {
		
	}
	
	
	
	// eslint-disable-next-line max-lines-per-function
	drop(event) {
		
		if (!this.currentLogic) {
			return;
		}
		
		const jsonBlockData = APP.libraryController.getDropObject();
		if (!jsonBlockData) {
			return;
		}
		
		const vec = APP.UI.translatePosTo(event.clientX, event.clientY);
		jsonBlockData.x = vec[0];
		jsonBlockData.y = vec[1];
		
		const block = this.currentLogic.createBlock(jsonBlockData);
		APP.htmlScript.appendChild(block.htmlElement);
		
		if (jsonBlockData.type === "HandlerWithParams" ||
			jsonBlockData.type === "Handler") {
			
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

			input.focus();
			
			input.onkeypress = function (e) {
				if (e.keyCode === 13) {
					block.changeHandlerParam(e.target.value);
					e.target.parentElement.parentElement.remove();
				}
			};
			
			btn.onclick = function (e) {
				block.changeHandlerParam(e.target.parentElement.children[1].value);
				e.target.parentElement.parentElement.remove();
			};
			
		}
		
		
	}
	
	
	
	
	
	
	
	
	
	
	// eslint-disable-next-line class-methods-use-this, max-lines-per-function, complexity
	fillingScript(objectZ) {
		
		const object = JSON.parse(JSON.stringify(objectZ));
		
		// SAVE OBJECT
		const objectBasic = {};
		objectBasic.store = object.store;
		objectBasic.nodes = [];
		objectBasic.connections = [];
		objectBasic.jsBlocksOIDs = object.jsBlocksOIDs;
		objectBasic.jsLibsOIDs = object.jsLibsOIDs;

		
		
		// FIND INDEX ...
		let id = -1;
		for (const nodeName in object.nodes) {
			if (!nodeName) continue;
			const node = object.nodes[nodeName];
			if (!node) continue;
			if (node.id >= id) {
				id = node.id + 1;
			}
		}
		
		
		const logicsData = {};
		const logicsIds = [];
		
		// FIND ALL LOGIC NODES
		for (const nodeName in object.nodes) {
			if (!nodeName) continue;
			const node = object.nodes[nodeName];
			if (!node) continue;
			if (node.type === "Logic") {
				logicsIds.push(node.id);
				logicsData[node.id] = {
					node,
					"conn": []
				};
			} else {
				objectBasic.nodes.push(node);
			}
		}
		
		
		
		// FIND ALL CONNECTIONS
		for (const connectionName in object.connections) {
			
			if (!connectionName) continue;
			const connection = object.connections[connectionName];
			if (!connection) continue;
			
			// CHECK MAIN CONNECTION
			if (logicsIds.indexOf(connection.dest.nodeID) !== -1) {
				logicsData[connection.dest.nodeID].conn.push(connection);
				continue;
			} else if (logicsIds.indexOf(connection.source.nodeID) !== -1) {
				logicsData[connection.source.nodeID].conn.push(connection);
				continue;
			} else {
				objectBasic.connections.push(connection);
			}
		}
		
		
		
		// REPLACE ALL DATA
		for (const logicId in logicsData) {
			if (!logicId) continue;
			const logicData = logicsData[logicId];
			if (!logicData) continue;
			
			const logic = object.logics[logicData.node.logic];
			if (!logic) {
				console.error("Cant find Logic:", logicData.node.logic);
				continue;
			}
			
			
			console.log("\n");
			
			
			const ids = {};
			const a = {};
			const e = {};
			const i = {};
			const o = {};
			
			let index = 0;
			for (const n of logicData.node.Inputs.flow) {
				a[n] = {
					index,
					"node": null,
					"conn": []
				};
				index++;
			}

			index = 0;
			for (const n of logicData.node.Inputs.data) {
				i[n] = {
					index,
					"node": null,
					"conn": []
				};
				index++;
			}

			index = 0;
			for (const n of logicData.node.Outputs.flow) {
				e[n] = {
					index,
					"node": null,
					"conn": []
				};
				index++;
			}

			index = 0;
			for (const n of logicData.node.Outputs.data) {
				o[n] = {
					index,
					"node": null,
					"conn": []
				};
				index++;
			}
			
			const connInIds = [];
			
			// Replace nodes
			for (const logicNodeName in logic.nodes) {
				if (!logicNodeName) continue;
				const logicNode = logic.nodes[logicNodeName];
				if (!logicNode) continue;
				
				const copied = JSON.parse(JSON.stringify(logicNode));
				
				// Save connection data
				if (copied.type === "Action") {
					a[copied.lib].node = copied;
					connInIds.push(copied.id);
					continue;
				}
				if (copied.type === "Event") {
					e[copied.lib].node = copied;
					connInIds.push(copied.id);
					continue;
				}
				if (copied.type === "Input") {
					i[copied.lib].node = copied;
					connInIds.push(copied.id);
					continue;
				}
				if (copied.type === "Output") {
					o[copied.lib].node = copied;
					connInIds.push(copied.id);
					continue;
				}
				
				const newId = ++id;
				ids[copied.id] = newId;
				copied.id = newId;
				
				objectBasic.nodes.push(copied);
				
			}
			
			const innerConn = [];
			
			// Replace CONNECTIONs
			for (const logicConnectionName in logic.connections) {
				if (!logicConnectionName) continue;
				const logicConnection = logic.connections[logicConnectionName];
				if (!logicConnection) continue;
				
				const copied = JSON.parse(JSON.stringify(logicConnection));
				
				// CHECK LOGIC INNER CONNECTIONS
				const id1 = copied.dest.nodeID;
				const id2 = copied.source.nodeID;
				if (connInIds.indexOf(id1) !== -1) {
					innerConn.push(copied);
					continue;
				} else if (connInIds.indexOf(id2) !== -1) {
					innerConn.push(copied);
					continue;
				} else {
					
					copied.dest.nodeID = ids[id1];
					copied.source.nodeID = ids[id2];
					
					objectBasic.connections.push(copied);
					
				}
				
			}
			
			// debugger;
			
			const badConnections = [];
			
			// REPLACE CONNECT FROM OUT
			for (const connection of logicData.conn) {
				if (!connection) {
					continue;
				}
				
				const nId = logicData.node.id;
				const id1 = connection.dest.nodeID;
				const id2 = connection.source.nodeID;
				
				// !!! SOURCE TRUE
				if (id1 === nId) {
					
					if (connection.type === "flow") {
						// actions
						const name = logicData.node.Inputs.flow[connection.dest.index];
						const connInNode = a[name];
						
						for (const connectionIn of innerConn) {
							const cId = connInNode.node.id;
							const id1c = connectionIn.dest.nodeID;
							const id2c = connectionIn.source.nodeID;
							
							// FIND DEST (source === action)
							if (id2c === cId) {
								
								const newC = {
									"dest": {
										"nodeID": ids[id1c],
										"index": connectionIn.dest.index
									},
									"source": {
										"nodeID": id2,
										"index": connection.source.index
									},
									"type": "flow"
								};
								
								if (!ids[id1c]) {
									badConnections.push({connection,connectionIn,connInNode});
									continue;
								}
								
								objectBasic.connections.push(newC);
								
							}
							
						}
						
						
					} else {
						
						// inputs
						const name = logicData.node.Inputs.data[connection.dest.index];
						const connInNode = i[name];

						for (const connectionIn of innerConn) {
							const cId = connInNode.node.id;
							const id1c = connectionIn.dest.nodeID;
							const id2c = connectionIn.source.nodeID;

							// FIND DEST (source === input)
							if (id2c === cId) {

								const newC = {
									"dest": {
										"nodeID": ids[id1c],
										"index": connectionIn.dest.index
									},
									"source": {
										"nodeID": id2,
										"index": connection.source.index
									},
									"type": "data"
								};
								if (!ids[id1c]) {
									badConnections.push({
										connection,
										connectionIn,
										connInNode
									});
									continue;
								}
								objectBasic.connections.push(newC);

							}

						}
					}
					
				} else if (id2 === nId) { // !!! DEST TRUE
				
					if (connection.type === "flow") {
						// events
						const name = logicData.node.Outputs.flow[connection.source.index];
						const connInNode = e[name];

						for (const connectionIn of innerConn) {
							const cId = connInNode.node.id;
							const id1c = connectionIn.dest.nodeID;
							const id2c = connectionIn.source.nodeID;

							// FIND SOURCE (dest === event)
							if (id1c === cId) {

								const newC = {
									"dest": {
										"nodeID": id1,
										"index": connection.dest.index
									},
									"source": {
										"nodeID": ids[id2c],
										"index": connectionIn.source.index
									},
									"type": "flow"
								};
								if (!ids[id2c]) {
									badConnections.push({
										connection,
										connectionIn,
										connInNode
									});
									continue;
								}
								objectBasic.connections.push(newC);

							}

						}


					} else {
						// outputs
						
						const name = logicData.node.Outputs.data[connection.source.index];
						const connInNode = o[name];

						for (const connectionIn of innerConn) {
							const cId = connInNode.node.id;
							const id1c = connectionIn.dest.nodeID;
							const id2c = connectionIn.source.nodeID;

							// FIND SOURCE (dest === event)
							if (id1c === cId) {

								const newC = {
									"dest": {
										"nodeID": id1,
										"index": connection.dest.index
									},
									"source": {
										"nodeID": ids[id2c],
										"index": connectionIn.source.index
									},
									"type": "data"
								};
								if (!ids[id2c]) {
									badConnections.push({
										connection,
										connectionIn,
										connInNode
									});
									continue;
								}
								objectBasic.connections.push(newC);

							}

						}

						
					}
					
					
				}
				
			}
			
			// FIX BAD CONNections
			// debugger;
			
			
			// DEFAULTS
			const defS = logicData.node.Defaults;
			if (defS) {
				if (defS.Inputs) {
					for (const defInput of defS.Inputs) {
						// GET ALL INPUT DEFAULT
						
						let findedId = -1;
						
						for (const iName in i) {
							// get ID input block
							if (!iName) continue;
							const iVal = i[iName];
							if (!iVal) continue;
							
							if (defInput.index === iVal.index) {
								findedId = iVal.node.id
								break;
							}
							
						}
						
						// fnd connections
						if (findedId !== -1) {
							
							for (const connection of innerConn) {
								
								if (!connection) continue;
								if (connection.type === "flow") continue;
								
								if (connection.source.nodeID === findedId) {
									const needlyId = ids[connection.dest.nodeID];
									const needlyIndex = connection.dest.index;
									
									// eslint-disable-next-line max-depth
									for (const ntest of objectBasic.nodes) {
										if (!ntest) continue;
										// eslint-disable-next-line max-depth
										if (ntest.id === needlyId) {
											// eslint-disable-next-line max-depth
											if (ntest.Defaults) {
												if (ntest.Defaults) {
													if (ntest.Defaults.Inputs) {
														ntest.Defaults.Inputs.push({
															"index": needlyIndex,
															"value": defInput.value
														});
													} else {
														ntest.Defaults.Inputs = [];
														ntest.Defaults.Inputs.push({
															"index": needlyIndex,
															"value": defInput.value
														});
													}
												}
											} else {
												ntest.Defaults = {};
												ntest.Defaults.Inputs = [];
												ntest.Defaults.Inputs.push({
													"index": needlyIndex,
													"value": defInput.value
												});
											}
										}
										
									}
									
								}
								
								
								
							}
							
							
						}
						
						
						
					}
				}
			}
			
			
			
		}
		
		
		return objectBasic;
		
	}
	
	
	// eslint-disable-next-line max-lines-per-function
	expandLogic(logicBlock, logic) {
		
		// const idsArr = [];
		const ids = {};
		// const newBlocks = {};
		
		// copy blocks
		// eslint-disable-next-line guard-for-in
		for (const blockId in logic.nodes) {
			const block = logic.nodes[blockId];
			
			if (block.type === "Action" ||
				block.type === "Event" ||
				block.type === "Input" ||
				block.type === "Output") {
				continue;
			}

			const copiedJson = APP.Logic.generateNode(block);
			// copiedJson.x = copiedJson.x - deltaX;
			// copiedJson.y = copiedJson.y - deltaY;
			copiedJson.id = ++APP.index;
			
			const copiedBlock = this.currentLogic.createBlock(copiedJson);
			if (copiedBlock) {
				APP.UI.nodesScene.appendChild(copiedBlock.htmlElement);
				ids[block.id] = copiedBlock.id;
				// idsArr.push(block.id);
				// newBlocks[copiedBlock.id] = copiedBlock;
			}
		}
		
		// copy connections
		for (const connectionName in logic.connections) {
			
			const connection = logic.connections[connectionName];
			
			const nId1 = connection.nodeID1; // DEST
			const nId2 = connection.nodeID2; // SOURCE
			
			const newNId1 = ids[nId1];
			const newNId2 = ids[nId2];
			
			const connectionJson = {};
			connectionJson.type = connection.type;
			connectionJson.dest = {
				"nodeID": newNId1,
				"index": connection.index1
			};
			connectionJson.source = {
				"nodeID": newNId2,
				"index": connection.index2
			};
			
			const copied = APP.logicController.currentLogic.createConnection(connectionJson);
			if (copied) {
				copied.updatePositions();
				APP.htmlSVG.appendChild(copied.htmlLine);
				APP.htmlSVG.appendChild(copied.htmlP1);
				APP.htmlSVG.appendChild(copied.htmlP2);
				APP.htmlSVG.appendChild(copied.htmlSupportLine);
			}
			
		}
		
		// save copies LogicBlock
		const connsOut = [];
		const connsIn = [];
		
		
		for (const c of logicBlock.lines) {
			
			const connectionJson = {};
			connectionJson.type = c.type;
			connectionJson.dest = {
				"nodeID": c.nodeID1,
				"index": c.index1
			};
			connectionJson.source = {
				"nodeID": c.nodeID2,
				"index": c.index2
			};
			
			connsOut.push(connectionJson);
			
		}
		
		const arrName = [];
		const arr = [];
		
		//	ACTIONS
		for (const connName in logicBlock.flowIn) {
			const conn = logicBlock.flowIn[connName];
			const slot = logicBlock.getSlot(conn);
			const actionBlock = logic.actions[slot.name];
			for (const lineOut of slot.lines) {
				for (const lineIn of actionBlock.block.lines) {
					const id = ids[lineIn.nodeID1] + "_" + lineIn.index1 + "_" + lineOut.nodeID2 + "_" + lineOut.index2 + "_" + lineOut.type;
					if (arrName.indexOf(id) !== -1) {
						continue;
					} else {
						arrName.push(id);
					}
					const connectionJson = {};
					connectionJson.type = lineOut.type;
					connectionJson.dest = {
						"nodeID": ids[lineIn.nodeID1],
						"index": lineIn.index1
					};
					connectionJson.source = {
						"nodeID": lineOut.nodeID2,
						"index": lineOut.index2
					};
					arr.push(connectionJson);
				}
			}
		}
		//	Inputs
		for (const connName in logicBlock.dataIn) {
			const conn = logicBlock.dataIn[connName];
			const slot = logicBlock.getSlot(conn);
			const block = logic.inputs[slot.name];
			for (const lineOut of slot.lines) {
				for (const lineIn of block.block.lines) {
					const id = ids[lineIn.nodeID1] + "_" + lineIn.index1 + "_" + lineOut.nodeID2 + "_" + lineOut.index2 + "_" + lineOut.type;
					if (arrName.indexOf(id) !== -1) {
						continue;
					} else {
						arrName.push(id);
					}
					const connectionJson = {};
					connectionJson.type = lineOut.type;
					connectionJson.dest = {
						"nodeID": ids[lineIn.nodeID1],
						"index": lineIn.index1
					};
					connectionJson.source = {
						"nodeID": lineOut.nodeID2,
						"index": lineOut.index2
					};
					arr.push(connectionJson);
				}
			}
		}
		
		//	EVENTS
		for (const connName in logicBlock.flowOut) {
			const conn = logicBlock.flowOut[connName];
			const slot = logicBlock.getSlot(conn);
			const block = logic.events[slot.name];
			for (const lineOut of slot.lines) {
				for (const lineIn of block.block.lines) {
					const id = lineOut.nodeID1 + "_" + lineIn.index1 + "_" + ids[lineIn.nodeID2] + "_" + lineOut.index2 + "_" + lineOut.type;
					if (arrName.indexOf(id) !== -1) {
						continue;
					} else {
						arrName.push(id);
					}
					const connectionJson = {};
					connectionJson.type = lineOut.type;
					connectionJson.dest = {
						"nodeID": lineOut.nodeID1,
						"index": lineOut.index1
					};
					connectionJson.source = {
						"nodeID": ids[lineIn.nodeID2],
						"index": lineIn.index2
					};
					arr.push(connectionJson);
				}
			}
		}
		
		//	OUTPUTS
		for (const connName in logicBlock.dataOut) {
			const conn = logicBlock.dataOut[connName];
			const slot = logicBlock.getSlot(conn);
			const block = logic.outputs[slot.name];
			for (const lineOut of slot.lines) {
				for (const lineIn of block.block.lines) {
					const id = lineOut.nodeID1 + "_" + lineIn.index1 + "_" + ids[lineIn.nodeID2] + "_" + lineOut.index2 + "_" + lineOut.type;
					if (arrName.indexOf(id) !== -1) {
						continue;
					} else {
						arrName.push(id);
					}
					const connectionJson = {};
					connectionJson.type = lineOut.type;
					connectionJson.dest = {
						"nodeID": lineOut.nodeID1,
						"index": lineOut.index1
					};
					connectionJson.source = {
						"nodeID": ids[lineIn.nodeID2],
						"index": lineIn.index2
					};
					arr.push(connectionJson);
				}
			}
		}

		
		APP.Logic.removeObject(logicBlock);
		
		for (const connectionJson of arr) {
			const copied = APP.logicController.currentLogic.createConnection(connectionJson);
			if (copied) {
				copied.updatePositions();
				APP.htmlSVG.appendChild(copied.htmlLine);
				APP.htmlSVG.appendChild(copied.htmlP1);
				APP.htmlSVG.appendChild(copied.htmlP2);
				APP.htmlSVG.appendChild(copied.htmlSupportLine);
			}
		}
		
		
	}
	
	
	
}