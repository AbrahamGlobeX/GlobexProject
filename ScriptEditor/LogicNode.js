/* global APP BasicNode  BasicConnection */


// eslint-disable-next-line no-unused-vars
class LogicNode {

	constructor(controller) {
		
		this.controller = controller;
		this.libsController = APP.libraryController;
		this.mainController = APP.libraryController;
		
		this.name = "";
		
		this.nodes = {};
		this.connections = {};
		this.storesBlocks = {};
		this.storesConnections = [];
		
		this.oids = [];
		
		this.actions = {};
		this.events = {};
		this.inputs = {};
		this.outputs = {};
		
		this.logicNodes = [];
		this.html = null;
		
	}


	// eslint-disable-next-line max-lines-per-function, complexity
	parse(nodes, connections) {
		
		const ids = [];
		
		// PARSE NODES
		for (const nodeIndex in nodes) {
			if (!nodeIndex) {
				continue;
			}
			const nodeObject = nodes[nodeIndex];
			if (!nodeObject) {
				continue;
			}
			
			// CHECK STORE BLOCK
			if (nodeObject.type === "FromStoreElement" ||
				nodeObject.type === "ToStoreElement") {
				this.appendStoreBlock(nodeObject);
				ids.push(nodeObject.id);
				continue;
			}
			
			const block = this.createBlock(nodeObject);
			if (block) {
				
				let connection = null;
				if (block.type === "Action") {
					connection = this.addConnection(block.lib, this.actions, this.controller.htmlActions, true);
				}
				
				if (block.type === "Event") {
					connection = this.addConnection(block.lib, this.events, this.controller.htmlEvents, true);
				}
				
				if (block.type === "Input") {
					connection = this.addConnection(block.lib, this.inputs, this.controller.htmlInputs, true);
				}
				
				if (block.type === "Output") {
					connection = this.addConnection(block.lib, this.outputs, this.controller.htmlOutputs, true);
				}
				
				// CHECK Logics block
				if (block.type === "Logic" ||
					block.type === "Action" ||
					block.type === "Event" ||
					block.type === "Input" ||
					block.type === "Output") {
					block.setValidBlock(true);
				}
				
				if (connection) {
					block.notDestroy = true;
					block.setValidBlock(true);
					connection.block = block;
				}
				
			}
			
		}
		
		
		
		// PARSE CONNECTION
		for (const connIndex in connections) {
			if (!connIndex) {
				continue;
			}
			const connectionObject = connections[connIndex];
			if (!connectionObject) {
				continue;
			}
			
			// CHECK STORE CONNECTION
			const id1 = connectionObject.dest.nodeID;
			const id2 = connectionObject.source.nodeID;
			if (ids.indexOf(id1) !== -1 ||
				ids.indexOf(id2) !== -1) {
					
				// Check on VALID connection
				const n1 = this.nodes[id1];
				const n2 = this.nodes[id2];
				if (!n1 && !n2) {
					console.error("Store connection ", connectionObject, "not connected!");
					continue;
				}
				// Add Stores
				let result = false;
				if (n1) {
					result = n1.appendStore(connectionObject);
				} else if (n2) {
					result = n2.appendStore(connectionObject);
				}
				if (!result) {
					continue;
				}
				this.storesConnections.push(connectionObject);
				continue;
			}
			
			this.createConnection(connectionObject);
			
		}
		
	}

	// generate() {
	// 	this.outputs;
	// 	return "";
	// }



	generateNode() {
		return {
			"type": "Logic",
			"logic": this.name, 	// Bottom
			"name": "Logic",		// Top
			"isValidBlock": true,
			"Inputs": {
				"flow": Object.keys(this.actions),
				"data": Object.keys(this.inputs)
			},
			"Outputs": {
				"flow": Object.keys(this.events),
				"data": Object.keys(this.outputs)
			}
		};
	}
	
	
	
	// eslint-disable-next-line max-lines-per-function
	createBlock(jsonData) {
		
		if ("id" in jsonData) {
			if (APP.index < jsonData.id) {
				APP.index = jsonData.id;
			}
			if (this.nodes[jsonData.id]) {
				jsonData.id = ++APP.index;
			}
		} else {
			jsonData.id = ++APP.index;
		}
		
		// const {oid} = jsonData;
		// if (oid) {
		// 	// if (APP.oidBlocks.indexOf(oid) === -1) {
		// 	// 	APP.oidBlocks.push(oid);
		// 	// }
			
		// 	if (this.oids.indexOf(oid) === -1) {
		// 		this.oids.push(oid);
		// 	}
			
		// }
		
		// Create block
		const block = new BasicNode(jsonData, this);
		this.nodes[block.id] = block;
		
		// CHECK JS BLOCK
		const libNode = this.libsController.getNodeData(block.lib, block.name);
		if (libNode) {
			block.oid = libNode.oid;
			block.setValidBlock(libNode.comlited);
		} else {
			block.setValidBlock(false);
		}
		
		
		// CHECK Logics block
		if (block.type === "Logic" ||
			block.type === "Action" ||
			block.type === "Event" ||
			block.type === "Input" ||
			block.type === "Output") {
			block.setValidBlock(true);
		}
		
		
		// CHECK HANDLER BLOCK
		if (jsonData.type === "HandlerWithParams" || jsonData.type === "Handler") {
			block.htmlElement.classList.add("StartNodes");
			block.x = 10;
			block.setValidBlock(true);
		}
		
		return block;
		
	}
	
	createConnection(jsonData) {
		
		// CREATE CONNECTION
		const connection = new BasicConnection(jsonData, this);
		if (!connection.node1 || !connection.node2) {
			return null;
		}
		
		this.connections[connection.id] = connection;
		connection.staticCreate();
		connection.updatePositions();
		
		// APP.UI.nodesScene.appendChild(connection.htmlElement); 
		
		return connection;
		
	}

	addAction(name) {
		const connection = this.addConnection(name, this.actions, this.controller.htmlActions, false);
		if (connection) {
			const blockJson = {
				"type": "Action",
				"logic": this.name,		// Bottom
				"name": "Action",		// Top
				"lib": name,
				"Inputs": {
					"flow": [],
					"data": []
				},
				"Outputs": {
					"flow": ["out"],
					"data": []
				}
			};
			
			const block = this.createBlock(blockJson);
			block.notDestroy = true;
			block.setValidBlock(true);
			connection.block = block;
			APP.htmlScript.appendChild(block.htmlElement);
			
		}
		
	}
	
	// removeAction(name) {
	// 	this.removeConnection(name, this.actions);
	// }
	
	
	
	addEvent(name) {
		const connection = this.addConnection(name, this.events, this.controller.htmlEvents, false);
		if (connection) {
			const blockJson = {
				"type": "Event",
				"logic": this.name, 	// Bottom
				"name": "Event", 		// Top
				"lib": name,
				"Inputs": {
					"flow": ["in"],
					"data": []
				},
				"Outputs": {
					"flow": [],
					"data": []
				}
			};
			const block = this.createBlock(blockJson);
			block.notDestroy = true;
			block.setValidBlock(true);
			connection.block = block;
			APP.htmlScript.appendChild(block.htmlElement);
		}
	}
	
	
	
	addInput(name) {
		const connection = this.addConnection(name, this.inputs, this.controller.htmlInputs, false);
		if (connection) {
			const blockJson = {
				"type": "Input",
				"logic": this.name, 	// Bottom
				"name": "Input", 		// Top
				"lib": name,
				"Inputs": {
					"flow": [],
					"data": []
				},
				"Outputs": {
					"flow": [],
					"data": ["value"]
				}
			};
			const block = this.createBlock(blockJson);
			block.notDestroy = true;
			block.setValidBlock(true);
			connection.block = block;
			APP.htmlScript.appendChild(block.htmlElement);
		}
	}
	
	
	
	addOutput(name) {
		const connection = this.addConnection(name, this.outputs, this.controller.htmlOutputs, false);
		if (connection) {
			const blockJson = {
				"type": "Output",
				"logic": this.name, 	// Bottom
				"name": "Output", 		// Top
				"lib": name,
				"Inputs": {
					"flow": [],
					"data": ["value"]
				},
				"Outputs": {
					"flow": [],
					"data": []
				}
			};
			const block = this.createBlock(blockJson);
			block.notDestroy = true;
			block.setValidBlock(true);
			connection.block = block;
			APP.htmlScript.appendChild(block.htmlElement);
		}
	}
	
	
	
	addConnection(name, container, htmlParent, parsed) {
		
		if (name in container) {
			return null;
		}
		
		const html = this.controller.createHtmlConnection(name, "X", htmlParent, true, function f() {
			this.removeConnection(name, container);
		}.bind(this));
		
		const connection = {
			html,
			"block": null
		};
		
		container[name] = connection;
		
		if (parsed) {
			html.remove();
		}
		
		return connection;
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	removeConnection(name, container) {
		if (name in container) {
			const connection = container[name];
			if (connection.html) {
				connection.html.remove();
			}
			if (connection.block) {
				APP.Logic.removeObject(connection.block);
			}
			delete container[name];
		}
	}
	
	clean() {
		
	}
	
	
	
	appendStoreBlock(data) {
		this.storesBlocks[data.id] = data;
		if (APP.index <  data.id) {
			APP.index = data.id;
		}
		const name = data.params[0].ElementName;
		if (APP.Logic.storesList.indexOf(name) === -1) {
			APP.Logic.stores[name] = "";
			APP.Logic.storesList.push(name);
		}
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
	
	
	expand(block) {
		this.controller.expandLogic(block, this);
	}
	
}