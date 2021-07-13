/* eslint-disable camelcase */
/* global library APP*/

// eslint-disable-next-line no-unused-vars
class LibraryController {
	constructor() {

		this.m_counter = 0;
		this.m_librariesData = {};

		this.m_containerlibraryViewHtml = null;
		this.m_containerLibsViewHtml = null;
		this.m_btnControlHtml = null;
		this.m_btnLoadLibHtml = null;
		this.m_btnCollapseHtml = null;

		this.m_librariesOIDs = [];
		this.m_libDropData = {};
		this.m_dromObject = null;

		this.m_selectedItem = null;
		this.m_baseJSLibsList = {
			"5feadefbb01255000880e22a": "Std",
			"5feade65b01255000880e17e": "UtilsUSL",
			"5feadedeb01255000880e1f7": "WidgetReactors",
			"5fec19bf71ef3e041cf10538": "DynamicObjectLibrary",
			"5feadfa4b01255000880e2a8": "DeviceUSL",
			"605473f0b0125500080e2c02": "THClient",
			"606d7fa59367694607a3596a": "Geo",
			"606a8a3bb0125500081f75bf": "Explorer"
		};
		
		this.m_logicNode = null;
		
		this.initialize();		
	}

	initialize() {		
		this.m_containerlibraryViewHtml = APP.UI.htmlContainerLibraries;
		
		// Btns control lib list
		const btnContainer = document.createElement("div");
		btnContainer.id = "LibraresBtnContainer";
		this.m_containerlibraryViewHtml.appendChild(btnContainer);

		this.m_btnLoadLibHtml = document.createElement("div");
		this.m_btnLoadLibHtml.id = "LibraresBtnLoadLib";
		this.m_btnLoadLibHtml.textContent = "Load";
		this.m_btnLoadLibHtml.addEventListener("click", this.getLoadDialog.bind(this));
		btnContainer.appendChild(this.m_btnLoadLibHtml);

		this.m_btnCollapseHtml = document.createElement("div");
		this.m_btnCollapseHtml.id = "LibraresBtnCollapse";
		this.m_btnCollapseHtml.textContent = "COLLAPS DEFAULTS";
		btnContainer.appendChild(this.m_btnCollapseHtml);

		// Libs LIST
		this.m_containerLibsViewHtml = document.createElement("div");
		this.m_containerLibsViewHtml.id = "LibsView";
		this.m_containerlibraryViewHtml.appendChild(this.m_containerLibsViewHtml);

		this.parseStdCppLibraries();
	}
	
	// eslint-disable-next-line class-methods-use-this
	libControl(event) {
		const libContainer = event.target.parentElement.parentElement;
		if (libContainer.className === "LibraresViewLibContainerTrue") {
			libContainer.className = "LibraresViewLibContainerFalse";
		} else {
			libContainer.className = "LibraresViewLibContainerTrue";
		}
	}

	clearLibrariesData() {
		for (let i = 0; i < this.m_librariesOIDs.length; ++i) {
			if (this.excludeLibrary(this.m_librariesOIDs[i])) {
				i--;
			}
		}
	}

	// eslint-disable-next-line max-lines-per-function
	excludeLibrary(oid) {
		// Clear list OIDs
		const index = this.m_librariesOIDs.indexOf(oid);
		if (index === -1) {
			return false;
		} else {
			this.m_librariesOIDs.splice(index, 1);
		}

		// Get data
		const libData = this.m_librariesData[oid];
		if (!libData) {
			return false;
		}

		// Clear drop data
		for (const nodeOID in libData.blocks) {

			if (!nodeOID) {
				continue;
			}

			const blockData = libData.blocks[nodeOID];

			const dropId = blockData.html.id;
			delete this.m_libDropData[dropId];

			blockData.html.remove();
			delete libData.blocks[nodeOID];

			// DISABLE BLOCKS
			// eslint-disable-next-line guard-for-in
			// for (const nodeId in APP.Logic.nodes) {
			// 	const node = APP.Logic.nodes[nodeId];
			// 	if (!node) {
			// 		continue;
			// 	}
			// 	if (node.oid === nodeOID) {
			// 		node.setValidBlock(false);
			// 	}
			// }
			for (const logicName in APP.logicController.logics) {

				if (!logicName) {
					continue;
				}

				const logic = APP.logicController.logics[logicName];
				if (!logic) {
					continue;
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
					
					if (node.oid === nodeOID) {
						node.setValidBlock(false);
					}
					
				}
			}
			
			
			
		}

		// Clear lib data
		libData.html.remove();
		delete this.m_librariesData[oid];

		return true;

	}

	parseStdCppLibraries() {

		const libContainer = document.createElement("div");
		libContainer.className = "LibraresViewLibContainerTrue";
		this.m_containerLibsViewHtml.appendChild(libContainer);

		const libNameBtnControl = document.createElement("div");
		libNameBtnControl.className = "BtnControl";
		libNameBtnControl.textContent = "STD C++";
		libNameBtnControl.addEventListener("click", this.libControl.bind(this));
		libContainer.appendChild(libNameBtnControl);

		const libData = {};
		libData.name = "std";
		libData.oid = "std";
		libData.blocks = {};

		for (const libNode of library.nodes) {

			if (!libNode) {
				continue;
			}

			let text = libNode.type;
			if (libNode.name) {
				text = libNode.name;
			}

			this.addLibItem(text, libNode, libContainer);

			const libNodeData = {};
			libNodeData.comlited = true;
			libNodeData.name = text;
			libNodeData.oid = text;
			libData.blocks[text] = libNodeData;

		}

		this.m_librariesData.std = libData;

	}

	addLibItem(name, lib, container) {
		const id = "lib_" + this.m_counter++;
		const libItemHtml = document.createElement("div");
		libItemHtml.id = id;
		libItemHtml.draggable = true;
		libItemHtml.textContent = name;
		libItemHtml.addEventListener("dragstart", this.dragStart.bind(this));
		libItemHtml.addEventListener("dragend", this.dragEnd.bind(this));
		container.appendChild(libItemHtml);

		this.m_libDropData[id] = lib;

		return libItemHtml;

	}



	dragStart(event) {
		this.m_dromObject = event.target.id;
		if(this.m_dromObject === undefined)
				this.m_dromObject = event.target.parentElement.id;
	}

	dragEnd() {
		this.m_dromObject = null;
	}

	getDropObject() {
		if (this.m_logicNode) {
			return this.m_logicNode;
		} else {
			return this.m_libDropData[this.m_dromObject];
		}
	}

	// eslint-disable-next-line max-lines-per-function
	parseJavaScriptLibraries(json) {
		const blockOIDArray = [];
		const cursorJson = json.cursor;
		const array = cursorJson.firstBatch;

		for (const lib of array) {
			const l = {};
			l.oid = lib._id.$oid;
			l.name = lib.meta.name;
			l.blocks = {};

			// Remove from dialog
			if (this.dialogCoontainerHtml) {
				for (const itemNode of this.libsContainer.children) {
					if (itemNode && itemNode.oid && itemNode.oid === l.oid) {
						itemNode.remove();
					}
				}
			}

			// Check on loaded
			if (this.m_librariesOIDs.indexOf(l.oid) !== -1) {
				continue;
			}
			this.m_librariesOIDs.push(l.oid);


			const libContainer = document.createElement("div");
			libContainer.className = "LibraresViewLibContainerFalse";
			this.m_containerLibsViewHtml.appendChild(libContainer);

			const libNameBtnControl = document.createElement("div");
			libNameBtnControl.className = "BtnControl";
			libContainer.appendChild(libNameBtnControl);

			const libText = document.createElement("div");
			libText.className = "BtnText";
			libText.textContent = l.name;
			libText.addEventListener("click", this.libControl.bind(this));
			libNameBtnControl.appendChild(libText);

			const libExcludeBtn = document.createElement("div");
			libExcludeBtn.className = "BtnControlExclide";
			libExcludeBtn.textContent = "X";
			libExcludeBtn.oid = l.oid;
			libExcludeBtn.addEventListener("click", function f(event) {
				this.excludeLibrary(event.target.oid);
			}.bind(this));
			libNameBtnControl.appendChild(libExcludeBtn);

			l.html = libContainer;

			const blockList = lib.object.blocks;
			// eslint-disable-next-line guard-for-in
			for (const blockName in blockList) {
				const blockOID = blockList[blockName];
				blockOIDArray.push(blockOID);

				const blockData = {};
				blockData.oid = blockOID;
				blockData.name = blockName;
				blockData.comlited = false;
				l.blocks[blockData.oid] = blockData;

				blockData.html = this.addLibItem(blockName, null, libContainer);
				blockData.html.className = "LibraryDataFalse";

			}
			this.m_librariesData[l.oid] = l;
		}
		APP.dbWorker.requestGetStandartJSBlocks(blockOIDArray);
	}


	// eslint-disable-next-line complexity, max-lines-per-function
	parseJavaScriptNodes(jsonObjects) {

		// Parse Json Blocks Objects
		for (const objectBlock of jsonObjects) {

			const oid = objectBlock._id.$oid;
			const {name} = objectBlock.meta;
			const {inputs} = objectBlock.object;
			const {output} = objectBlock.object;
			const {func} = objectBlock.object;
			const {enums} = objectBlock.object;

			let libOID = "";
			if (objectBlock.object.lib) {
				libOID = objectBlock.object.lib.$oid;
			}

			// Fill data
			const lib = this.m_librariesData[libOID];
			if (!lib) {
				continue;
			}

			const block = lib.blocks[oid];
			if (!block) {
				continue;
			}

			if (block.oid !== oid) {
				console.error("!!!WHAT????");
			}

			if (block.name !== name) {
				console.error("Parse error! Block name incorrect: [", block.name, " !== ", name, "]");
				continue;
			}

			block.inputs = inputs;
			block.output = output;
			block.func = func;
			block.enums = enums;
			block.comlited = false;

			if (inputs && func && func.length) {
				block.comlited = true;
			}

			const objNode = {};
			objNode.name = name;
			objNode.oid = oid;
			objNode.type = "JavaScriptBlock";
			objNode.lib = lib.name;
			objNode.Inputs = {};
			objNode.Inputs.flow = ["in"];
			objNode.Inputs.data = inputs;
			objNode.Outputs = {};
			objNode.Outputs.flow = ["out "];
			if (output && output.length) {
				objNode.Outputs.data = [output];
			} else {
				objNode.Outputs.data = [];
			}
			objNode.enums = enums;
			objNode.params = [];
			objNode.params.push({
				"funcName": block.name,
				"libOid": "_" + lib.oid

			});

			block.objNode = objNode;

			if (block.html) {
				this.m_libDropData[block.html.id] = block.objNode;
				if (block.comlited) {
					block.html.className = "";

					// ENABLE BLOCKS
					// eslint-disable-next-line guard-for-in
					// for (const nodeId in APP.Logic.nodes) {
					// 	const node = APP.Logic.nodes[nodeId];
					// 	if (!node) {
					// 		continue;
					// 	}
						
					// 	if (!node.oid) {
					// 		if (node.lib === lib.name && node.name === name) {
					// 			node.oid = oid;
					// 			node.setValidBlock(block.comlited);
					// 			node.setEnums(enums);
					// 		}
					// 	} else if (node.oid === oid) {
					// 		node.setValidBlock(true);
					// 		node.setEnums(enums);
					// 	}
						
					// }
					
					for (const logicName in APP.logicController.logics) {
						
						if (!logicName) {
							continue;
						}
						
						const logic = APP.logicController.logics[logicName];
						if (!logic) {
							continue;
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

							if (!node.oid) {
								if (node.lib === lib.name && node.name === name) {
									node.oid = oid;
									node.setValidBlock(block.comlited);
									node.setEnums(enums);
								}
							} else if (node.oid === oid) {
								node.oid = oid;
								node.setValidBlock(true);
								node.setEnums(enums);
							}

						}
					}
					
					
					
				}
			}
		}
	}

	getNodeData(lib, name) {
		for (const lID in this.m_librariesData) {
			if (!lID) {
				continue;
			}
			const l = this.m_librariesData[lID];
			if (!l) {
				continue;
			}
			if (l.oid === lib || l.name === lib) {
				for (const bID in l.blocks) {
					if (!bID) {
						continue;
					}
					const b = l.blocks[bID];
					if (!b) {
						continue;
					}
					if (b.name === name) {
						return b;
					}
				}
			}
		}
		return null;
	}


	// eslint-disable-next-line max-lines-per-function
	getLoadDialog() {

		if (this.dialogCoontainerHtml) {
			return;
		}

		this.dialogCoontainerHtml = document.createElement("div");
		this.dialogCoontainerHtml.className = "LoadLibBack";
		document.body.appendChild(this.dialogCoontainerHtml);

		const viewContainer = document.createElement("div");
		viewContainer.className = "LoadLibContainer";
		this.dialogCoontainerHtml.appendChild(viewContainer);

		const titleHtml = document.createElement("div");
		titleHtml.textContent = "Choose library to load";
		titleHtml.className = "LoadLibTitle";
		viewContainer.appendChild(titleHtml);

		this.libsContainer = document.createElement("div");
		this.libsContainer.className = "LoadLibSubContainer";
		viewContainer.appendChild(this.libsContainer);

		for (const libOid in this.m_baseJSLibsList) {

			if (!libOid) {
				continue;
			}

			if (this.m_librariesOIDs.indexOf(libOid) !== -1) {
				continue;
			}

			if (!this.libsContainer.children.length) {
				const baseText = document.createElement("div");
				baseText.className = "LoadLibCategoryName";
				baseText.textContent = "Base standart JS libraries:";
				this.libsContainer.appendChild(baseText);
			}

			this.addLoadLibHtml(libOid, this.m_baseJSLibsList[libOid]);

		}


		const request = '{"meta.pattern": {"$oid": "' + APP.dbWorker.m_libraryPattent + '"}}';
		APP.dbWorker.sendBaseRCRequest("GetUserLibraries", "objects", request, false);

		const btnsContainer = document.createElement("div");
		btnsContainer.className = "LoadLibBtnsContainer";
		viewContainer.appendChild(btnsContainer);

		const btnAccept = document.createElement("div");
		btnAccept.className = "LoadLibBtn";
		btnAccept.textContent = "Load";
		btnAccept.addEventListener("click", this.loadPress.bind(this));
		btnsContainer.appendChild(btnAccept);

		const btnCancel = document.createElement("div");
		btnCancel.className = "LoadLibBtn";
		btnCancel.textContent = "Cancel";
		btnCancel.addEventListener("click", this.cancelPress.bind(this));
		btnsContainer.appendChild(btnCancel);

	}

	addLoadLibHtml(oid, name) {

		const itemContainer = document.createElement("div");
		itemContainer.oid = oid;
		itemContainer.className = "LoadLibItem";
		itemContainer.addEventListener("click", this.selectPress.bind(this));
		itemContainer.addEventListener("dblclick", this.loadPress.bind(this));
		this.libsContainer.appendChild(itemContainer);

		const itemName = document.createElement("div");
		itemName.className = "LoadLibItemName";
		itemName.textContent = name;
		itemContainer.appendChild(itemName);

		const itemOid = document.createElement("div");
		itemOid.className = "LoadLibItemOid";
		itemOid.textContent = oid;
		itemContainer.appendChild(itemOid);

	}

	selectPress(event) {

		if (this.m_selectedItem) {
			this.m_selectedItem.classList.remove("Selected");
		}
		this.m_selectedItem = event.target.parentElement;
		this.m_selectedItem.classList.add("Selected");
	}

	loadPress() {
		APP.dbWorker.requestGetJavaScriptLibraries([this.m_selectedItem.oid]);
	}

	cancelPress() {
		if (this.dialogCoontainerHtml) {
			this.dialogCoontainerHtml.remove();
			this.dialogCoontainerHtml = null;
		}
	}


	parseUserLibraries(json) {
		const array = json.cursor.firstBatch;

		if (!array.length) {
			return;
		}

		const baseText = document.createElement("div");
		baseText.className = "LoadLibCategoryName";
		baseText.textContent = "User JS libraries:";
		this.libsContainer.appendChild(baseText);


		for (const lib of array) {
			console.log(lib);

			const oid = lib._id.$oid;
			const {name} = lib.meta;

			this.addLoadLibHtml(oid, name);

		}

	}

}
