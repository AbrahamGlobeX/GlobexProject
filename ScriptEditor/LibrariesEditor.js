
/* global APP */

// eslint-disable-next-line no-unused-vars
class LibrariesEditor {
	
	constructor() {
		
		this.html = null;
		this.htmlContainer = null;
		
		
		this.librariesData = {};
		this.blocksData = {};
		
		this.m_selectedLibrary = null;
		this.m_selectedBlock = null;
		
		
		this.inputs = [];
		this.enums = [];
		
		
		this.initialize();
		
	}
	
	
	initialize() {
		
		// Main Container
		this.html = document.createElement("div");
		this.html.className = "LibrariesEditorFalse";
		// this.html.className = "LibrariesEditorTrue";
		
		// View container
		this.htmlContainer = document.createElement("div");
		this.htmlContainer.className = "LibrariesEditorContainer";
		this.html.appendChild(this.htmlContainer);
		
		// Libraries
		this.createLibrariesContainer();
		
		// Edit
		this.htmlEditContainer = document.createElement("div");
		this.htmlEditContainer.className = "LibrariesEditorEditContainer";
		this.htmlContainer.appendChild(this.htmlEditContainer);
		
		this.htmlEditHeader = document.createElement("div");
		this.htmlEditHeader.className = "LibrariesEditorHeader";
		this.htmlEditContainer.appendChild(this.htmlEditHeader);

		this.htmlEditTitle = document.createElement("div");
		this.htmlEditTitle.textContent = "Edit";
		this.htmlEditTitle.className = "LibrariesEditorTitle";
		this.htmlEditTitle.style.textAlign = "center";
		this.htmlEditHeader.appendChild(this.htmlEditTitle);
		
		this.createEditorContainer();
		
		// Blocks
		this.createBlocksContainer();
		
		document.body.appendChild(this.html);
		
	}
	
	createLibrariesContainer() {
		
		this.htmlLibrariesContainer = document.createElement("div");
		this.htmlLibrariesContainer.className = "LibrariesEditorLibrariesContainer";
		this.htmlContainer.appendChild(this.htmlLibrariesContainer);
		
		this.htmlLibrariesHeader = document.createElement("div");
		this.htmlLibrariesHeader.className = "LibrariesEditorHeader";
		this.htmlLibrariesContainer.appendChild(this.htmlLibrariesHeader);
		
		this.htmlLibrariesTitle = document.createElement("div");
		this.htmlLibrariesTitle.textContent = "Libraries:";
		this.htmlLibrariesTitle.className = "LibrariesEditorTitle";
		this.htmlLibrariesHeader.appendChild(this.htmlLibrariesTitle);
		
		this.htmlLibrariesBtnAdd = document.createElement("div");
		this.htmlLibrariesBtnAdd.textContent = "+";
		this.htmlLibrariesBtnAdd.className = "LibrariesEditorBtn";
		this.htmlLibrariesBtnAdd.addEventListener("click", this.createLibraryEvent.bind(this));
		this.htmlLibrariesHeader.appendChild(this.htmlLibrariesBtnAdd);
		
		this.htmlLibrariesList = document.createElement("div");
		this.htmlLibrariesList.className = "LibrariesEditorList";
		this.htmlLibrariesContainer.appendChild(this.htmlLibrariesList);
		
	}
	
	// eslint-disable-next-line max-lines-per-function
	createEditorContainer() {
		
		//
		// -------- LIBRARY DATA -------- 
		//
		this.htmlLibData = document.createElement("div");
		this.htmlLibData.style.display = "none";
		this.htmlLibData.className = "LE_LibraryContainer";
		this.htmlEditContainer.appendChild(this.htmlLibData);
		
		this.htmlLibEditTitle = document.createElement("div");
		this.htmlLibEditTitle.className = "LE_EditMainTitle";
		this.htmlLibEditTitle.textContent = "Libraty Data:";
		this.htmlLibData.appendChild(this.htmlLibEditTitle);
		
		this.htmlNameLib = this.createHtmlInputData(this.htmlLibData, "Name:");
		this.htmlDescLib = this.createHtmlInputData(this.htmlLibData, "Description:");
		
		this.htmlLibsBtnsContainer = document.createElement("div");
		this.htmlLibsBtnsContainer.className = "LE_BtnsContainer";
		this.htmlLibData.appendChild(this.htmlLibsBtnsContainer);
		this.createHtmlButton(this.htmlLibsBtnsContainer, "Save", this.saveLibraryEvent.bind(this));
		this.createHtmlButton(this.htmlLibsBtnsContainer, "Remove", this.removeLibraryEvent.bind(this));
	
		
		
		//
		// -------- BLOCK DATA -------- 
		//
		this.htmlBlockData = document.createElement("div");
		this.htmlBlockData.style.display = "none";
		this.htmlBlockData.className = "LE_BlockContainer";
		this.htmlEditContainer.appendChild(this.htmlBlockData);	
		
		const htmlBrDiv = document.createElement("div");
		htmlBrDiv.className = "LE_EditBr";
		this.htmlBlockData.appendChild(htmlBrDiv);
		
		this.htmlBlockEditTitle = document.createElement("div");
		this.htmlBlockEditTitle.textContent = "Block Data:";
		this.htmlBlockEditTitle.className = "LE_EditMainTitle";
		this.htmlBlockData.appendChild(this.htmlBlockEditTitle);
	
		this.htmlBlockOverflowData = document.createElement("div");
		this.htmlBlockOverflowData.className = "LE_BlockOverflov";
		this.htmlBlockData.appendChild(this.htmlBlockOverflowData);
		
		this.htmlNameBlock = this.createHtmlInputData(this.htmlBlockOverflowData, "Name:");
		this.htmlDescBlock = this.createHtmlInputData(this.htmlBlockOverflowData, "Description:");
		this.htmlWikiBlock = this.createHtmlInputData(this.htmlBlockOverflowData, "Wiki:");
		
		// inputs
		this.createHtmlInputsProperty();
		
		// output
		this.htmlOutputBlock = this.createHtmlInputData(this.htmlBlockOverflowData, "Output name:");
		
		// enum
		this.createHtmlEnumProperty();
		
		// func
		const funcContainer = document.createElement("div");
		funcContainer.className = "LE_EditPropContainer";
		this.htmlBlockOverflowData.appendChild(funcContainer);
		this.htmlFuncTitle = document.createElement("div");
		this.htmlFuncTitle.className = "LE_EditTitle";
		this.htmlFuncTitle.textContent = "JavaScript function code:";
		funcContainer.appendChild(this.htmlFuncTitle);
		this.htmlFuncTextArea = document.createElement("textarea");
		this.htmlFuncTextArea.className = "LE_EditTxtArea";
		funcContainer.appendChild(this.htmlFuncTextArea);
		
		
		this.htmlBlocksBtnsContainer = document.createElement("div");
		this.htmlBlocksBtnsContainer.className = "LE_BtnsContainer";
		this.htmlBlockOverflowData.appendChild(this.htmlBlocksBtnsContainer);
		this.createHtmlButton(this.htmlBlocksBtnsContainer, "Save", this.saveBlockEvent.bind(this));
		this.createHtmlButton(this.htmlBlocksBtnsContainer, "Remove", this.removeBlockEvent.bind(this));
		
	}
	
	createHtmlInputsProperty() {
		
		// CONTAINER
		const container = document.createElement("div");
		container.className = "LE_InputsMainContainer";
		this.htmlBlockOverflowData.appendChild(container);
		
		// TITLE
		const title = document.createElement("div");
		title.textContent = "Inputs:";
		title.className = "LE_EditTitle";
		container.appendChild(title);
		
		// NEW 
		this.htmlInputsNewContainer = document.createElement("div");
		this.htmlInputsNewContainer.className = "LE_InputsAddContainer";
		container.appendChild(this.htmlInputsNewContainer);
		
		this.htmlInputsNewInput = document.createElement("div");
		this.htmlInputsNewInput.className = "LE_InputsAddInput";
		this.htmlInputsNewInput.textContent = "Add new input:";
		this.htmlInputsNewContainer.appendChild(this.htmlInputsNewInput);
		
		this.htmlInputsInput = document.createElement("input");
		this.htmlInputsInput.className = "LE_InputsAddInput";
		this.htmlInputsNewContainer.appendChild(this.htmlInputsInput);

		this.htmlInputsInputBtn = document.createElement("div");
		this.htmlInputsInputBtn.className = "LE_InputsAddBtn";
		this.htmlInputsInputBtn.textContent = "+";
		this.htmlInputsInputBtn.addEventListener("click", this.addInputEvent.bind(this));
		this.htmlInputsNewContainer.appendChild(this.htmlInputsInputBtn);
		
		// LIST
		this.htmlInputsContainer = document.createElement("div");
		this.htmlInputsContainer.className = "LE_InputsContainer";
		container.appendChild(this.htmlInputsContainer);
		
	}
	
	addHtmlInputTag(name) {
		
		if (!name || name.length < 3) {
			return;
		}
		
		if (this.inputs.indexOf(name) !== -1) {
			return;
		}
		this.inputs.push(name);
		
		// ADD TO COMBO BOX
		const newOptionEnum = document.createElement("option");
		newOptionEnum.value = name;
		newOptionEnum.textContent = name;
		this.htmlEnumInputsList.appendChild(newOptionEnum);
		
		// TAG
		const inputContainer = document.createElement("div");
		inputContainer.className = "LE_InputItem";
		this.htmlInputsContainer.appendChild(inputContainer);

		const inputTxt = document.createElement("div");
		inputTxt.className = "LE_InputTxt";
		inputTxt.textContent = name;
		inputTxt.value = name;
		inputContainer.appendChild(inputTxt);

		const inputBtn = document.createElement("div");
		inputBtn.className = "LE_InputBtn";
		inputBtn.textContent = "x";
		inputBtn.addEventListener("click", this.removeInputEvent.bind(this));
		inputContainer.appendChild(inputBtn);
	}
	
	addInputEvent(event) {
		
		const txt = this.htmlInputsInput.value;
		if (!txt || txt.length < 3) {
			return;
		}
		
		this.htmlInputsInput.value = "";
		this.addHtmlInputTag(txt);
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	removeInputEvent(event) {
		
		const txt = event.target.parentElement.firstChild.textContent;
		const index = this.inputs.indexOf(txt);
		if (index !== -1) {
			this.inputs.splice(index, 1);
		}
		
		event.target.parentElement.remove();
		
		// TO DO remove enum
		
		for (const child of this.htmlEnumsList.children) {
			if (!child) {
				continue;
			}
			
			if (child.firstChild.firstChild.value === txt) {
				
				// remove html enum
				child.remove();
				
				// remove combo box
				for (const item of this.htmlEnumInputsList.options) {
					if (item.value === txt) {
						item.remove();
					}
				}
				
				// remove enums
				const index = this.enums.indexOf(txt);
				if (index !== -1) {
					this.enums.splice(index, 1);
				}
				
			}
			
		}
			
		
	}
	
	createHtmlEnumProperty() {
		
		// CONTAINER
		const container = document.createElement("div");
		container.className = "LE_EnumMainContainer";
		this.htmlBlockOverflowData.appendChild(container);
		
		const title = document.createElement("div");
		title.textContent = "Enum:";
		title.className = "LE_EditTitle";
		container.appendChild(title);
		
		// NEW
		const newContainer = document.createElement("div");
		newContainer.className = "LE_InputsAddContainer";
		container.appendChild(newContainer);
		
		const newTitle = document.createElement("div");
		newTitle.textContent = "Add new enum:";
		newTitle.className = "LE_EditTitle2";
		newContainer.appendChild(newTitle);
		
		this.htmlEnumInputsList = document.createElement("select");
		this.htmlEnumInputsList.className = "LE_EditInputAdd";
		newContainer.appendChild(this.htmlEnumInputsList);
		
		const newBtn = document.createElement("div");
		newBtn.className = "LE_EditBtnAdd";
		newBtn.textContent = "+";
		newBtn.addEventListener("click", this.addEnumEvent.bind(this));
		newContainer.appendChild(newBtn);
		
		// LIST
		this.htmlEnumsList = document.createElement("div");
		this.htmlEnumsList.className = "LE_EnumsList";
		container.appendChild(this.htmlEnumsList);
		
	}
	
	// eslint-disable-next-line max-lines-per-function
	addHtmlEnumTag(name) {
		
		if (!name || !name.length) {
			return null;
		}
		
		if (this.enums.indexOf(name) !== -1) {
			return null;
		}
		this.enums.push(name);
		for (const child of this.htmlEnumInputsList.children) {
			if (!child) {
				continue;
			}
			if (child.value === name) {
				child.remove();
			}
		}
		
		const container = document.createElement("div");
		container.className = "LE_EnumContainer";
		this.htmlEnumsList.appendChild(container);
		
		// Enum NAME
		const htmlEnumMainCon = document.createElement("div");
		htmlEnumMainCon.className = "LE_EnumContainer2";
		container.appendChild(htmlEnumMainCon);
		
		const htmlEnumMainTxt = document.createElement("div");
		htmlEnumMainTxt.value = name;
		htmlEnumMainTxt.textContent = name;
		htmlEnumMainTxt.className = "LE_EnumTxt";
		htmlEnumMainCon.appendChild(htmlEnumMainTxt);
		
		const htmlEnumMainDel = document.createElement("div");
		htmlEnumMainDel.className = "LE_EnumBtnDel";
		htmlEnumMainDel.textContent = "x";
		htmlEnumMainDel.addEventListener("click", this.removeEnumEvent.bind(this));
		htmlEnumMainCon.appendChild(htmlEnumMainDel);

		const inpContainer = document.createElement("div");
		inpContainer.className = "LE_EnumAddValContainer";
		container.appendChild(inpContainer);
		
		const htmlEnumAddInput = document.createElement("input");
		htmlEnumAddInput.className = "LE_EnumValInputAdd";
		inpContainer.appendChild(htmlEnumAddInput);
		
		const htmlEnumAdd = document.createElement("div");
		htmlEnumAdd.textContent = "->";
		htmlEnumAdd.className = "LE_EnumBtnAdd";
		htmlEnumAdd.addEventListener("click", this.addEnumEventValue.bind(this));
		inpContainer.appendChild(htmlEnumAdd);
		
		const htmlEnumContainer = document.createElement("div");
		htmlEnumContainer.className = "LE_EnumListContainer";
		container.appendChild(htmlEnumContainer);
		
		return htmlEnumContainer;
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	addHtmlEnumValueTag(container, name) {
		
		const htmlItemEnum = document.createElement("div");
		htmlItemEnum.className = "LE_EnumValItem";
		container.appendChild(htmlItemEnum);

		const htmlItemEnumTxt = document.createElement("div");
		htmlItemEnumTxt.textContent = name;
		htmlItemEnumTxt.value = name;
		htmlItemEnumTxt.className = "LE_EnumValTxt";
		htmlItemEnum.appendChild(htmlItemEnumTxt);

		const htmlItemEnumDel = document.createElement("div");
		htmlItemEnumDel.textContent = "x";
		htmlItemEnumDel.className = "LE_EnumValBtn";
		htmlItemEnumDel.addEventListener("click", this.removeEnumEventValue.bind(this));
		htmlItemEnum.appendChild(htmlItemEnumDel);
		
	}
		
	addEnumEvent(event) {
		
		const txt = this.htmlEnumInputsList.selectedOptions[0].value;
		this.addHtmlEnumTag(txt);
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	removeEnumEvent(event) {
		const txt = event.target.parentElement.firstChild.textContent;
		const index = this.enums.indexOf(txt);
		if (index !== -1) {
			this.enums.splice(index, 1);
		}
		
		// ADD TO COMBO BOX
		const newOptionEnum = document.createElement("option");
		newOptionEnum.value = txt;
		newOptionEnum.textContent = txt;
		this.htmlEnumInputsList.appendChild(newOptionEnum);
		
		
		event.target.parentElement.parentElement.remove();
		
		
	}
	
	addEnumEventValue(event) {
		const input = event.target.parentElement.children[0];
		const txt = input.value;
		const container = event.target.parentElement.parentElement.children[2];
		
		if (!txt || !txt.length) {
			return;
		}
		
		input.value = "";
		this.addHtmlEnumValueTag(container, txt);
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	removeEnumEventValue(event) {
		event.target.parentElement.remove();
	}
	
	createBlocksContainer() {
		
		this.htmlBlocksContainer = document.createElement("div");
		this.htmlBlocksContainer.className = "LibrariesEditorBlocksContainer";
		this.htmlContainer.appendChild(this.htmlBlocksContainer);
		
		this.htmlBlockHeader = document.createElement("div");
		this.htmlBlockHeader.className = "LibrariesEditorHeader";
		this.htmlBlocksContainer.appendChild(this.htmlBlockHeader);
		
		this.htmlBlockTitle = document.createElement("div");
		this.htmlBlockTitle.textContent = "Blocks:";
		this.htmlBlockTitle.className = "LibrariesEditorTitle";
		this.htmlBlockHeader.appendChild(this.htmlBlockTitle);
		
		this.htmlBlockBtnAdd = document.createElement("div");
		this.htmlBlockBtnAdd.textContent = "+";
		this.htmlBlockBtnAdd.className = "LibrariesEditorBtn";
		this.htmlBlockBtnAdd.addEventListener("click", this.createBlockEvent.bind(this));
		this.htmlBlockHeader.appendChild(this.htmlBlockBtnAdd);
		
		this.htmlBlockList = document.createElement("div");
		this.htmlBlockList.className = "LibrariesEditorList";
		this.htmlBlocksContainer.appendChild(this.htmlBlockList);
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	createHtmlInputData(parent, text) {
		
		const container = document.createElement("div");
		container.className = "LE_EditPropContainer";
		parent.appendChild(container);
		
		const title = document.createElement("div");
		title.textContent = text;
		title.className = "LE_EditTitle";
		container.appendChild(title);
		
		const input = document.createElement("input");
		input.className = "LE_EditInput";
		container.appendChild(input);
		
		return input;
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	createHtmlButton(parent, text, func) {
		const btn = document.createElement("div");
		btn.className = "LE_EditBtn";
		btn.textContent = text;
		btn.addEventListener("click", func);
		parent.appendChild(btn);
	}
	
	viewHide() {
		if (this.html.className === "LibrariesEditorTrue") {
			this.html.className = "LibrariesEditorFalse";
		} else {
			this.html.className = "LibrariesEditorTrue";
		}
	}
	
	parseLibraries(resultJson) {
		
		this.librariesData = {};
		if ("cursor" in resultJson) {
			const cursorJson = resultJson.cursor;
			const array = cursorJson.firstBatch;
			
			for (const lib of array) {
				const oid = lib._id.$oid;
				this.librariesData[oid] = lib;
				this.addHtmlLibData(oid, lib.meta.name);
			}
		}
		
	}
	
	addHtmlLibData(oid, name) {

		const htmlItem = document.createElement("div");
		htmlItem.className = "LibrariesEditorItem";
		this.htmlLibrariesList.appendChild(htmlItem);

		const htmlItemName = document.createElement("div");
		htmlItemName.className = "LibrariesEditorItemText";
		htmlItemName.textContent = name;
		htmlItemName.oid = oid;
		htmlItemName.addEventListener("click", this.chooseLibraryEvent.bind(this));
		htmlItem.appendChild(htmlItemName);
		
	}
	
	parseBlocks(resultJson) {
		
		this.htmlBlockList.remove();
		this.htmlBlockList = document.createElement("div");
		this.htmlBlockList.className = "LibrariesEditorList";
		this.htmlBlocksContainer.appendChild(this.htmlBlockList);
		
		this.blocksData = {};
		
		const array = resultJson.cursor.firstBatch;
		for (const node of array) {
			
			const oid = node._id.$oid;
			this.blocksData[oid] = node;
			this.addHtmlBlockData(oid, node.meta.name);
		}
		
	}
	
	addHtmlBlockData(oid, name) {
		const htmlItem = document.createElement("div");
		htmlItem.className = "LibrariesEditorItem";
		this.htmlBlockList.appendChild(htmlItem);

		const htmlItemName = document.createElement("div");
		htmlItemName.className = "LibrariesEditorItemText";
		htmlItemName.textContent = name;
		htmlItemName.oid = oid;
		htmlItemName.addEventListener("click", this.chooseBlockEvent.bind(this));
		htmlItem.appendChild(htmlItemName);
	}
	
	createLibraryEvent(event) {
		// const data = 'collection=' + encodeURIComponent("objects");
		// sendPostRequest("/api/create", data, function createFunc(event) {
		// 	console.log(event.target.response);
		// 	const dataJson = JSON.parse(event.target.response);
		// 	if ("_id" in dataJson) {
		// 		//
		// 	} else {
		// 		APP.log("error", "Create JS library error");
		// 	}
		// }.bind(this));
		
	
		this.createNameDialog(function f(name) {
			const objectData = {
				"meta": {
					"owner": {
						"$oid": APP.owner
					},
					name,
					"description": "",
					"pattern": {
						"$oid": "602e8108b0125500080c818c"
					}
				},
				"object": {
					"blocks": {}
				},
				"additional": {
					"wiki_ref": "",
					"image": ""
				}
			};
			this.tmpLibObject = objectData;
			APP.dbWorker.sendInsertRCRequest("LEInsertLib", JSON.stringify(objectData));
		}.bind(this));
		
		
	}
	
	onCreateLibEvent(json) {
		const oid = json.inserted_id.$oid;
		this.librariesData[oid] = this.tmpLibObject;
		this.addHtmlLibData(oid, this.tmpLibObject.meta.name);
	}
	
	createBlockEvent(event) {
		
		const {oid} = this.m_selectedLibrary;
		if (!oid || oid.length !== 24) {
			return;
		}
		
		this.createNameDialog(function f(name) {
			
			const objectData = {
				"meta": {
					"owner": {
						"$oid": APP.owner
					},
					name,
					"description": "",
					"pattern": {
						"$oid": "602e8135b0125500080c8192"
					}
				},
				"object": {
					"inputs": [],
					"output": "",
					"func": "",
					"enums": {},
					"lib": {
						"$oid": oid
					}
				},
				"additional": {
					"wiki_ref": "",
					"image": ""
				}
			};
			this.tmpBlockObject = objectData;
			APP.dbWorker.sendInsertRCRequest("LEInsertBlock", JSON.stringify(objectData));
			
		}.bind(this));
		
		
	}
	
	onCreateBlockEvent(json) {
		const oid = json.inserted_id.$oid;
		this.blocksData[oid] = this.tmpBlockObject;
		this.addHtmlBlockData(oid, this.tmpBlockObject.meta.name);
		
		// ADD to LIB
		const oidLib = this.m_selectedLibrary.oid;
		const libData = this.librariesData[oidLib];
		libData.object.blocks[this.tmpBlockObject.meta.name] = oid;

		const sets = {
			"$set": {
				"object": libData.object
			}
		};
		APP.dbWorker.sendUpdateRCRequest("dqww", oidLib, JSON.stringify(sets));
		
	}
	
	chooseLibraryEvent(event) {
		
		if (this.m_selectedLibrary === event.target) {
			return;
		}
		
		const lib = this.librariesData[event.target.oid];
		if (!lib) {
			return;
		}
		
		this.htmlBlockData.style.display = "none";
		
		let strOIDs = "";
		const {blocks} = lib.object;
		for (const blockName in blocks) {
			if (!blockName) {
				continue;
			}
			const blockOID = blocks[blockName];
			strOIDs += '{"$oid":"' + blockOID + '"},';
		}
		
		if (strOIDs[strOIDs.length - 1] === ",") {
			strOIDs = strOIDs.substr(0, strOIDs.length - 1);
		}
		
		const filterData = '{"_id": {"$in": [' + strOIDs + ']}}';
		APP.dbWorker.sendBaseRCRequest("LibrariesEditorBlocks", "objects", filterData, false);
		
		// Selected / Unselected
		if (this.m_selectedLibrary) {
			this.m_selectedLibrary.parentElement.classList.remove("LEItemSelected");
		}
		this.m_selectedLibrary = event.target;
		event.target.parentElement.classList.add("LEItemSelected");
		
		// fill data
		this.htmlLibData.style.display = "";
		this.htmlNameLib.value = lib.meta.name;
		this.htmlDescLib.value = lib.meta.description;
		
		
		
	}

	
	
	removeLibraryEvent(event) {

	}
	
	// eslint-disable-next-line class-methods-use-this
	saveLibraryEvent(event) {
		
		
		const name = this.htmlNameLib.value;
		if (!name) {
			return;
		}
		
		const {oid} = this.m_selectedLibrary;
		
		const sets = {
			"$set": {
				"meta.name": name,
				"meta.description": this.htmlDescLib.value
			}
		};
		this.m_selectedLibrary.textContent = name;
		APP.dbWorker.sendUpdateRCRequest("dqww", oid, JSON.stringify(sets));
		
	}
	
	
	clearBlockData() {
		
		this.clearContainer(this.htmlInputsContainer);
		this.clearContainer(this.htmlEnumsList);
		
		this.inputs = [];
		this.enums = [];
		this.htmlNameBlock.value = "";
		this.htmlDescBlock.value = "";
		this.htmlWikiBlock.value = "";
		this.htmlOutputBlock.value = "";
		this.htmlFuncTextArea.value = "";
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	clearContainer(container) {
		for (let i = 0; i < container.children.length; ++i) {
			const child = container.children[i];
			if (!child) {
				continue;
			}
			child.remove();
			--i;
		}
	}
	
	
	// eslint-disable-next-line max-lines-per-function
	chooseBlockEvent(event) {
		
		if (this.m_selectedBlock === event.target) {
			return;
		}
		
		const block = this.blocksData[event.target.oid];
		if (!block) {
			return;
		}
		
		this.clearBlockData();
		
		// Selected / Unselected
		if (this.m_selectedBlock) {
			this.m_selectedBlock.parentElement.classList.remove("LEItemSelected");
		}
		this.m_selectedBlock = event.target;
		event.target.parentElement.classList.add("LEItemSelected");
		this.htmlBlockData.style.display = "";
		
		this.htmlNameBlock.value = block.meta.name;
		this.htmlDescBlock.value = block.meta.description;
		this.htmlWikiBlock.value = block.additional.wiki_ref;
		
		this.htmlOutputBlock.value = block.object.output;
		this.htmlFuncTextArea.value = block.object.func;
		
		for (const input of block.object.inputs) {
			this.addHtmlInputTag(input);
		}
		
		for (const enumName in block.object.enums) {
			if (!enumName) {
				continue;
			}
			
			const container = this.addHtmlEnumTag(enumName);
			if (!container) {
				continue;
			}
			
			const enumArray = block.object.enums[enumName];
			for (const enumVal of enumArray) {
				this.addHtmlEnumValueTag(container, enumVal);
			}
			
		}
		
		
		
	}
	
	removeBlockEvent(event) {
		
	}
	
	saveBlockEvent(event) {
		
		
		const name = this.htmlNameBlock.value;
		if (!name) {
			return;
		}
		
		const enums = {};
		for (const childEnum of this.htmlEnumsList.children) {
			const name = childEnum.firstChild.firstChild.textContent;
			const arr = [];
			for (const child of childEnum.children[2].children) {
				arr.push(child.firstChild.textContent);
			}
			enums[name] = arr;
		}

		const {oid} = this.m_selectedBlock;

		const sets = {
			"$set": {
				"meta.name": name,
				"meta.description": this.htmlDescBlock.value,
				"object": {
					"inputs": this.inputs,
					"output": this.htmlOutputBlock.value,
					enums,
					"func": this.htmlFuncTextArea.value,
					"lib": {
						"$oid": this.m_selectedLibrary.oid
					}
				}
			}
		};
		this.m_selectedBlock.textContent = name;
		APP.dbWorker.sendUpdateRCRequest("dqww", oid, JSON.stringify(sets));
		
	}
	
	
	
	// eslint-disable-next-line class-methods-use-this
	createNameDialog(callbackFunc) {
		
		const dialogContainer = document.createElement("div");
		dialogContainer.className = "LE_Dialog";
		document.body.appendChild(dialogContainer);
		
		const subContainer = document.createElement("div");
		subContainer.className = "LE_DialogContainer";
		dialogContainer.appendChild(subContainer);
		
		const title = document.createElement("div");
		title.textContent = "Enter name:";
		title.className = "LE_DialogTitle";
		subContainer.appendChild(title);
		
		const input = document.createElement("input");
		input.className = "LE_DialogInput";
		subContainer.appendChild(input);
		
		const btnContainer = document.createElement("div");
		btnContainer.className = "LE_DialogBtnC";
		subContainer.appendChild(btnContainer);
		
		const btnOk = document.createElement("div");
		btnOk.className = "LE_DialogBtn";
		btnOk.textContent = "Ok";
		btnOk.addEventListener("click", function fOk(event) {
			// const txt = event.target.parentElement.parentElement.children[1].value;
			const txt = input.value;
			callbackFunc(txt);
			dialogContainer.remove();
		});
		btnContainer.appendChild(btnOk);
		
		const btnCancel = document.createElement("div");
		btnCancel.className = "LE_DialogBtn";
		btnCancel.textContent = "Cancel";
		btnCancel.addEventListener("click", function fCancel(event) {
			dialogContainer.remove();
		});
		btnContainer.appendChild(btnCancel);
		
		
	}
	
	
	
}