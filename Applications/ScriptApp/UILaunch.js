/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-continue */
/* eslint-disable no-console */
/* exported globalShiftX init*/
/* global script BasicNode BasicConnection Slot APP sendPostRequest*/
'use strict';
class UILaunch {

	constructor() {

		this.nodesScene = document.getElementById("container");
		this.userView = document.getElementById("root");

		this.selecedArea = null;
		this.hovered = null;
		this.focused = [];

		this.mX = 0;
		this.mY = 0;
		this.moveEvent = null;

		this.camX = -100;
		this.camY = -650;
		this.camZ = 1;

		this.movingScene = false;
		this.connectBrowserEvents();

		// MAKE SVG CONTAINER
		// http://www.w3.org/2000/svg
		this.namespaceURL = decodeURIComponent(escape(window.atob("aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmc=")));

		// SVG Container for Node Lines
		this.svgContainer = document.createElementNS(this.namespaceURL, "svg");
		this.svgContainer.classList.add("SVG_CONTAINER");
		this.svgContainer.style.overflow = "visible";

		// Store container
		this.storeContainer = null;
		this.storeSelected = null;
		this.nodeSlot = null;

		// CONTAINER HANDLERS
		this.handlersView = document.createElement("div");
		this.handlersView.className = "ViewView";
		//this.nodesScene.appendChild(this.handlersView);


		// TRUE SVG EDITOR: https://yqnn.github.io/svg-path-editor/
		// BLOCKS PATH TEMPLATE
		const _clipPathTemlate1 = document.createElementNS(this.namespaceURL, "clipPath");
		_clipPathTemlate1.id = "clipPathTemplate1";
		this.svgContainer.appendChild(_clipPathTemlate1);
		const _pathTemlate1 = document.createElementNS(this.namespaceURL, "path");
		// _pathTemlate1.setAttribute("d", `M 0 0 L 0 41 L 200 41 L 180 20 C 160 0 160 0 140 0 L 0 0 Z`);
		_pathTemlate1.setAttribute("d", `M 0 0 L 0 41 L 200 41 L 200 41 C 122 0 122 0 122 0 L 0 0 Z`);
		_pathTemlate1.setAttribute("d", `M 0 0 L 0 20 L 200 20 L 200 20 C 122 0 122 0 122 0 L 0 0 Z`);
		_clipPathTemlate1.appendChild(_pathTemlate1);

		// BOTTOM
		let _clipPathTemlate2 = document.createElementNS(this.namespaceURL, "clipPath");
		_clipPathTemlate2.id = "clipPathTemplate2";
		let _pathTemlate2 = document.createElementNS(this.namespaceURL, "path");
		// _pathTemlate2.setAttribute("d", `M 0 0 L 200 0 L 200 20 L 30 20 C 20 20 20 20 10 10 L 0 0`);
		_pathTemlate2.setAttribute("d", `M 0 0 L 200 0 L 200 20 L 78 19 C 78 19 78 19 0 0 L 0 0`);
		this.svgContainer.appendChild(_clipPathTemlate2);
		_clipPathTemlate2.appendChild(_pathTemlate2);
		
		
		
		this.m_loginDiv = null;
		this.m_registrationDiv = null;
		
		this.m_valueEditDiv = null;
		this.m_valueEditDiv = null;
		
		this.usernameDiv = null;
		
		//this.updateScene();
		
	}

	connectBrowserEvents() {
		document.addEventListener("mousedown", this.mouseDown.bind(this));
		document.addEventListener("mousemove", this.mouseMove.bind(this));
		document.addEventListener("mouseup", this.mouseUp.bind(this));
		document.addEventListener("mousewheel", 	this.mouseWheel.bind(this));
		document.addEventListener("keydown", this.keyDown.bind(this));
	}

	mouseDown(event) {
		
		
		if (this.m_divListScriptsDiv || this.m_loginDiv || this.m_registrationDiv) {
			return;
		}

		// CHECK HOVER OBJECT
		this.hovered = this.checkHover(event);


		let targetClass = event.target.className;

		// START SELECTED AREA
		if (!this.selecedArea &&
			!this.hovered &&
			event.which === 1 &&
			// (event.target == this.nodesScene ||	event.target == document.body)) {
			(targetClass == "container" || targetClass == "ViewView" || targetClass == "ViewArea" ||
				event.target == document.body)) {

			this.selecedArea = document.createElement("div");
			this.selecedArea.classList.add("SelectedArea");

			this.selecedArea.sPX = this.getSceneOffset(event, 0);
			this.selecedArea.sPY = this.getSceneOffset(event, 1);

			// document.body.appendChild(this.selecedArea);
			this.nodesScene.appendChild(this.selecedArea);

			this.clearFocudes();

		}

		// FOCUSED ONE OBJECT
		if (this.hovered && event.which === 1) {

			if (this.focused.indexOf(this.hovered) === -1) {
				this.clearFocudes();

				this.focused.push(this.hovered);
				this.hovered.focused(true);
			}

			if (this.focused.length === 1) {
				this.focused[0].mouseDown(event);
			} else {
				this.msoX = APP.UI.getSceneOffset(event, 0);
				this.msoY = APP.UI.getSceneOffset(event, 1);
			}

		}



		// START MOVING SCENE
		if (event.which === 2) {
			this.movingScene = true;
			this.movingX = event.clientX / this.camZ;
			this.movingY = event.clientY / this.camZ;
			return;
		}



	}

	mouseMove(event) {

		this.moveEvent = event;


		// CHECK HOVER OBJECT
		this.hovered = this.checkHover(event);

		// SELECTED AREA RESIZE
		if (this.selecedArea) {

			const x = this.getSceneOffset(event, 0);
			const y = this.getSceneOffset(event, 1);

			this.selecedArea.style.top = Math.min(this.selecedArea.sPY, y) + "px";
			this.selecedArea.style.left = Math.min(this.selecedArea.sPX, x) + "px";
			this.selecedArea.style.width = Math.abs(this.selecedArea.sPX - x) + "px";
			this.selecedArea.style.height = Math.abs(this.selecedArea.sPY - y) + "px";

			return;
		}

		// MOVING SCENE PRECESS
		if (this.movingScene) {
			this.moveScene(event);
		}

		// MOVE FOCUSED OBJECTS
		if (this.focused.length) {

			let node = this.focused[0];
			if (this.focused.length === 1) {
				node.mouseMove(event);
			} else if (event.which === 1) {

				const dx = this.msoX - APP.UI.getSceneOffset(event, 0);
				const dy = this.msoY - APP.UI.getSceneOffset(event, 1);

				for (const o of this.focused) {
					if (!o) continue;
					o.htmlElement.style.left = o.htmlElement.offsetLeft - dx + "px";
					o.htmlElement.style.top = o.htmlElement.offsetTop - dy + "px";

					if (o.htmlElement.offsetLeft < 300) {
						o.htmlElement.style.left = "300px";
					}

					for (const l of o.lines) {
						l.updatePositions();
					}
				}

				this.msoX = APP.UI.getSceneOffset(event, 0);
				this.msoY = APP.UI.getSceneOffset(event, 1);
			}
			APP.Logic.updateNodeViewAreas(node.viewArea);
		}

		this.mX = event.clientX;
		this.mY = event.clientY;

	}

	mouseUp(event) {

		// CHECK SELECTED AREA
		if (this.selecedArea) {

			const saX = this.selecedArea.offsetLeft;
			const saY = this.selecedArea.offsetTop;
			const saW = this.selecedArea.offsetWidth;
			const saH = this.selecedArea.offsetHeight;

			for (const nId in APP.Logic.nodes) {
				const n = APP.Logic.nodes[nId];
				if (!n) continue;
				const nX = n.htmlElement.offsetLeft;
				const nY = n.htmlElement.offsetTop;
				const nW = n.htmlElement.offsetWidth;
				const nH = n.htmlElement.offsetHeight;
				if (saX < nX && saY < nY && saX + saW > nX + nW && saY + saH > nY + nH) {
					this.focused.push(n);
					n.focused(true);
				}
			}

		}

		// MOVE FOCUSED OBJECTS
		if (this.focused.length) {

			if (this.focused.length === 1) {
				this.focused[0].mouseUp(event);
			}

		}

		this.movingScene = false;
		if (this.selecedArea) {
			this.selecedArea.remove();
			this.selecedArea = null;
		}

	}

	mouseWheel(event) {

		// if (event.target !== this.nodesScene && event.target !== document.body) {
		// 	return;
		// }
		
		let find = false;
		for (const el of event.path) {
			if (el.id === "container") {
				find = true;
				break;
			}
		}
		
		if (!find) {
			return;
		}
		
		
		const deltaZero = 0;
		const deltaMin = -1;
		const deltaMax = 1;
		
		const minZoom = 0.1;
		const maxZoom = 2.0;
		const stepZoom = 0.1;
		

		const deltaValue = event.deltaY || event.delta || event.wheelDeltaY || event.wheelDelta;
		const delta = deltaValue < deltaZero ? deltaMax : deltaMin;

		this.camZ += delta * stepZoom;
		if (this.camZ <= minZoom) {
			this.camZ = minZoom;
		} else if (this.camZ > maxZoom) {
			this.camZ = maxZoom;
		}


		// 
		// let w = window.innerWidth / 2;
		// let h = window.innerHeight / 2;
		// let _x = (event.clientX - w) / this.camZ + w + this.camX - (w / this.camZ);
		// let _y = (event.clientY - h) / this.camZ + h + this.camY - (h / this.camZ);
		// this.camX = _x;
		// this.camY = _y;
		
		
		let vec = this.translatePosToCenter(event.clientX, event.clientY);
		this.camX = vec[0];
		this.camY = vec[1];

		
		// console.log("MOUSE POS:", event.clientX, event.clientY);
		
		const hardStartScene = 0;
		this.checkScenePosition(hardStartScene, hardStartScene);
		this.updateScene();

	}

	keyDown(event) {

		if (event.repeat) {
			return;
		}
		const keyCodeS = 83;
		const keyCodeD = 68;
		const keyCodeDelete = 46;
		const keyCodeTab = 9;

		// SAVE
		if (event.ctrlKey && event.keyCode === keyCodeS) {
			event.preventDefault();
			APP.Logic.saveScript();
			APP.Logic.saveFile();
		}
		// DUBLICATE
		if (event.ctrlKey && event.keyCode === keyCodeD) {
			event.preventDefault();
			APP.Logic.dublicate(this.moveEvent, this.focused);
		}
		// DELETE
		if (event.keyCode === keyCodeDelete) {
			event.preventDefault();
			APP.Logic.removeObjects();
		}
		// TAB
		if (event.keyCode === keyCodeTab) {
			if (this.m_loginDiv || this.saveDialogDiv) {
				return;
			}
			event.preventDefault();
			this.view();
		}
		
	}


	moveScene(event) {
		const dx = event.clientX - this.mX;
		const dy = event.clientY - this.mY;
		this.checkScenePosition(dx, dy);
		this.updateScene();
	}

	checkScenePosition(dx, dy) {
		
		if (APP.Logic.logicBlocksStructs.length === 0) {
			return;
		}
		
		// GET UP LEFT POINT
		let px = APP.Logic.logicBlocksStructs[0].html.offsetLeft;
		let py = APP.Logic.logicBlocksStructs[0].html.offsetTop;

		let vec = this.translatePosFrom(px, py);
		let controlX = vec[0];
		let controlY = vec[1];

		this.camX -= dx / this.camZ;
		this.camY -= dy / this.camZ;

		// CHECK ON UP LEFT POINT
		if (this.camX < controlX) {
			this.camX = controlX;
		}
		if (this.camY < controlY) {
			this.camY = controlY;
		}

	}

	view() {
		if (this.userView.style.display === "none") {
			this.userView.style.display = "inline-block";
		} else {
			this.userView.style.display = "none";
		}
	}

	getSceneOffset(e, v) {
		if (v === 0) {
			const w = window.innerWidth / 2;
			return (e.clientX - w) / this.camZ + w + this.camX;
		} else if (v === 1) {
			const h = window.innerHeight / 2;
			return (e.clientY - h) / this.camZ + h + this.camY;
		}
	}

	updateScene() {
		this.nodesScene.style.transform = `scale(${this.camZ}) translate(${(-this.camX)}px, ${(-this.camY)}px)`;
	}

	// eslint-disable-next-line class-methods-use-this
	checkHover(event) {

		const path = event.path || (event.composedPath && event.composedPath());

		for (const n of path) {

			if (!n) {
				continue;
			}

			if (!n.id) {
				continue;
			}

			if (n.id.indexOf("N_") !== -1) {
				const id = n.id.substr(2);
				return APP.Logic.nodes[id];
			} else if (n.id.indexOf("C1_") !== -1 || n.id.indexOf("C2_") !== -1 || n.id.indexOf("P1_") !== -1 || n.id.indexOf("P2_") !== -1) {
				const id = n.id.substr(3);
				return APP.Logic.connections[id];
			}

		}

		return null;
		
	}

	clearFocudes() {
		for (const o of this.focused) {
			o.focused(false);
		}
		this.focused = [];
	}

	createFormEditorButton() {

		let that = this;

		this.b6 = this.createBtn(this.topBar, "TopFormBtn", "Form", function f3() {
			// APP.Logic.saveScript();
			// APP.Logic.saveFile();

			let formEditorContainer = document.getElementById('formEditorContainer');

			if (that.b6.textContent === "Form") {

				if (formEditorContainer === null) {

					formEditorContainer = document.createElement('div');

					formEditorContainer.id = "formEditorContainer";

					const {style} = formEditorContainer;

					style.position = "absolute";
					style.top = "20px";
					style.width = "100%";
					style.height = "calc(100% - 25px)";
					style.zIndex = "10";
					style.background = "white";
					// style.background = "var(--gridCellColor)";

					document.body.appendChild(formEditorContainer);

					let formEditorApp = new FormEditorApp();

					const form = JSON.parse(JSON.stringify(APP.form));

					formEditorApp.init(formEditorContainer);

					formEditorApp.mainModel.form.fromJson(form);

					APP.form = form;
				}

				formEditorContainer.style.display = "block";

				that.b6.textContent = "Script";

			} else {

				formEditorContainer.style.display = "none";

				that.b6.textContent = "Form";
			}

		}.bind(this));
	}

	createExpandDefaultsButton() {

		let that = this;

		this.b10 = this.createBtn(this.topBar, "ExpandDefsBtn", "EXPAND DEFAULTS", function f3() {

			if (that.b10.textContent === "EXPAND DEFAULTS") {

				for (let defaultBlock of document.getElementsByClassName('StoreBlock'))
					defaultBlock.classList.add('F');

				that.b10.textContent = "COLLAPS DEFAULTS";

			} else {

				for (let defaultBlock of document.getElementsByClassName('StoreBlock'))
					defaultBlock.classList.remove('F');

				that.b10.textContent = "COLLAPS DEFAULTS";
			}

		}.bind(this));

		this.b10.style.width = '162px';
	}

	createTop() {
		
		// TOP LINE CONTAINER
		// this.topBar = document.createElement("div");
		// this.topBar.id = "TopBar";
		// document.body.appendChild(this.topBar);
		
		
		// this.createBtn(this.topBar, "TopMenuBtn", "MENU", this.showMenu.bind(this));
		// this.createBtn(this.topBar, "TopSaveBtn", "SAVE", this.saveDialog.bind(this));
		// this.createBtn(this.topBar, "TopViewBtn", "VIEW", this.view.bind(this));
		// this.createBtn(this.topBar, "TopStoreBtn", "STORE", this.getStoreList.bind(this));
		// this.createBtn(this.topBar, "TopRunBtn", "RUN", this.restartApp.bind(this));
		// this.createBtn(this.topBar, "TopLibsBtn", "LIBS", this.libEditor.bind(this));
		
		//this.searchInput = document.createElement("input");
		//this.topBar.appendChild(this.searchInput);
		//this.searchInput.addEventListener("keypress", this.search.bind(this));
		
		
		//this.createFormEditorButton();
		//this.createExpandDefaultsButton();
		
		
		this.divObjectName = document.createElement("div");
		//this.divObjectName.id = "ApplicationTopName";
		//this.divObjectName.textContent = "";
		//his.topBar.appendChild(this.divObjectName);
		
		
	}
	
	showMenu(event) {
		
		if (this.m_containerMenuHtml) {
			this.m_containerMenuHtml.remove();
			this.m_containerMenuHtml = null;
			return;
		}
		
		this.m_containerMenuHtml = document.createElement("div");
		this.m_containerMenuHtml.id = "MenuContainerDiv";
		document.body.appendChild(this.m_containerMenuHtml);
		
		this.createBtn(
			this.m_containerMenuHtml,
			"MenuNewAppBtn",
			"Create New Application",
			this.pressClearScript.bind(this));
		
		this.createBtn(
			this.m_containerMenuHtml,
			"MenuOpenDBAppBtn",
			"Open Application from DB",
			this.openScripsList.bind(this));
		
		this.createBtn(
			this.m_containerMenuHtml,
			"MenuSaveDBBtn",
			"Save Application to DB",
			this.saveDialog.bind(this));
		
		this.m_btnOpenLocalFileApplicationHtml = this.createBtn(
			this.m_containerMenuHtml,
			"MenuOpenFIleAppBtn",
			"Open Application File",
			this.pressOpenFile.bind(this));
		
		this.createBtn(
			this.m_containerMenuHtml,
			"MenuSaveFileBtn",
			"Save Application File",
			this.saveToFile.bind(this));
		
		this.createBtn(
			this.m_containerMenuHtml,
			"MenuExportBtn",
			"Import Old Scripts",
			this.exportOldScripts.bind(this));
		
		// HIDDEN INPUT
		const inp = document.createElement("input");
		inp.style.display = "none";
		inp.setAttribute("type", "file");
		inp.multiple = false;
		inp.style.display = "none";
		inp.addEventListener("change", APP.Logic.loadFile.bind(APP.Logic));
		this.m_btnOpenLocalFileApplicationHtml.appendChild(inp);
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	pressClearScript() {
		APP.Logic.clearScript();
	}
	
	pressOpenFile() {
		this.m_btnOpenLocalFileApplicationHtml.firstElementChild.click();
	}
	
	// eslint-disable-next-line class-methods-use-this
	saveToFile() {
		APP.Logic.saveScript();
		APP.Logic.saveFile();
	}
	
	// eslint-disable-next-line class-methods-use-this
	restartApp() {
		APP.Logic.saveScript();
		resetAll();
	}
	
	// eslint-disable-next-line class-methods-use-this
	libEditor() {
		APP.libraryEditor.viewHide();
	}
	
	createTopRightBar() {
		
		
		//if (this.usernameDiv) {
		//	return;
		//}
		
		//const rightTopDiv = document.createElement("div");
		//rightTopDiv.id = "TopRightDiv";
		//this.topBar.appendChild(rightTopDiv);
		
		// USERNAME
		this.usernameDiv = document.createElement("div");
		
		const loadObjectFromUrl = function() {

			const urlData = window.location.search;
			const objKey = "obj_id=";
			const objLength = 24;
			const index = urlData.indexOf(objKey);
			if (index !== -1) {

				const correctIndex = index + objKey.length;
				const oid = urlData.substring(correctIndex, correctIndex + objLength);

				if (oid.length === objLength /*&& APP.auth*/) {
					APP.dbWorker.setLoadObject(oid);
				}

			}
		}


		if (!APP.auth) {
			this.openLoginPanel();

		} else {
		// AUTO LOAD OBJECT
			loadObjectFromUrl();
		}

		return;
		this.usernameDiv.id = "UsernameDiv";
		this.usernameDiv.textContent = APP.username;
		rightTopDiv.appendChild(this.usernameDiv);
		
		if (APP.auth) {
			// EXIT
			this.createExitBtn();
			
		} else {
		
			// LOGIN
			this.btnLogin = document.createElement("div");
			this.btnLogin.textContent = "Login";
			rightTopDiv.appendChild(this.btnLogin);
			this.btnLogin.addEventListener("click", this.openLoginPanel.bind(this));
			
			// REGISTRATION
			this.btnReg = document.createElement("div");
			this.btnReg.textContent = "Registration";
			rightTopDiv.appendChild(this.btnReg);
			this.btnReg.addEventListener("click", this.openRegistrationPanel.bind(this));
		
		}
		
		
		
		const langBox = document.createElement("select");
		langBox.className = "LanguageSelect";
		langBox.addEventListener("change", APP.translateManager.changeLanguageEvent.bind(APP.translateManager));
		rightTopDiv.appendChild(langBox);
		
		for (const lang of APP.translateManager.langs) {
			const langEl = document.createElement("option");
			langEl.value = lang;
			langEl.textContent = lang;
			langBox.appendChild(langEl);
		}
		
	}
	
	createExitBtn() {
		
		const rightTopDiv = document.getElementById("TopRightDiv");
		this.btnLogout = document.createElement("div");
		this.btnLogout.textContent = "Logout";
		rightTopDiv.appendChild(this.btnLogout);
		this.btnLogout.addEventListener("click", function f1() {
			sendPostRequest("/user/logout", "", function f2(event) {
				console.log("logout", event);
				
				APP.auth = false;
				APP.username = "AnonymousUser";
				this.usernameDiv.textContent = APP.username;
				
				this.btnLogout.remove();
				
				// LOGIN
				this.btnLogin = document.createElement("div");
				this.btnLogin.textContent = "Login";
				rightTopDiv.appendChild(this.btnLogin);
				this.btnLogin.addEventListener("click", this.openLoginPanel.bind(this));

				// REGISTRATION
				this.btnReg = document.createElement("div");
				this.btnReg.textContent = "Registration";
				rightTopDiv.appendChild(this.btnReg);
				this.btnReg.addEventListener("click", this.openRegistrationPanel.bind(this));
				
			}.bind(this));
		}.bind(this));
	}
	
	// eslint-disable-next-line class-methods-use-this
	createBtn(container, id, name, func) {
		const btn = document.createElement("div");
		btn.id = id;
		btn.className = "NavBtn";
		btn.innerText = APP.TM.getDicText(id, name);
		btn.onclick = func;
		container.appendChild(btn);
		return btn;
	}

	getStoreList(slot) {

		if (this.storeContainer) {
			return;
		}

		if (slot instanceof MouseEvent) {
			slot = null;
		}

		this.nodeSlot = slot;

		// ***
		// DRAW DIALOG MESSAGE
		// ***
		const d = document.createElement("div");
		this.storeContainer = d;
		d.className = "StoresBackground";

		// Main Container
		const div = document.createElement("div");
		div.className = "StoresContainer";
		d.appendChild(div);

		// Switch beetwen Store and Defaults
		const div_Switch = document.createElement("div");
		div_Switch.className = "SwitchContainer";
		div.appendChild(div_Switch);

		const btn_s = document.createElement("div");
		btn_s.className = "BtnSwitch";
		btn_s.innerText = "Store";
		btn_s.style.fontWeight = "bold";
		div_Switch.appendChild(btn_s);

		let ddd = null;
		if (this.nodeSlot) {

			const btn_d = document.createElement("div");
			btn_d.className = "BtnSwitch";
			btn_d.innerText = "Default";
			div_Switch.appendChild(btn_d);

			// Set Defaults
			const div_d = document.createElement("div");
			div_d.className = "DefaultsContainer";
			div_d.innerText = "\nEnter Default value:";
			div_d.style.display = "none";
			div.appendChild(div_d);

			const input_def = document.createElement("input");
			input_def.className = "DefaultsInput";
			div_d.appendChild(document.createElement("br"));
			div_d.appendChild(input_def);
			if (this.nodeSlot.defaults) {
				input_def.value = this.nodeSlot.defaults.value;
			}

			// SWITCH CLICKS EVENTS
			btn_s.onclick = this.changeToStore;
			btn_d.onclick = this.changeToDefaults.bind(this);
			ddd = btn_d;

		}

		// List STORES
		const div2 = document.createElement("div");
		div2.className = "StoresContainer2";
		div.appendChild(div2);

		// ***
		// PULL STORES:
		// ***
		// eslint-disable-next-line guard-for-in
		for (const l in APP.Logic.stores) {

			// const v = APP.Logic.stores[l];

			const lineDiv = document.createElement("div");
			lineDiv.className = "StoreItem";
			lineDiv.innerText = l;
			lineDiv.value = l;
			div2.appendChild(lineDiv);

			// SELECT STORE CLICK
			lineDiv.onclick = this.selectStoreEvent.bind(this)

			// REMOVE STORE
			if (!this.nodeSlot) {
				const removeStore = document.createElement("div");
				removeStore.className = "StoreRemove";
				removeStore.innerText = "x";
				removeStore.onclick = this.removeStoreEvent.bind(this);
				lineDiv.appendChild(removeStore);
				
				
				const editStore = document.createElement("div");
				lineDiv.appendChild(editStore);
				editStore.className = "StoreEdit";
				editStore.innerText = "edit";
				editStore.onclick = this.editStoreValue.bind(this);
				
			}

		}

		// ADD NEW STORE
		if (!this.nodeSlot) {
			const lineDiv = document.createElement("div");
			lineDiv.className = "StoreItem";
			lineDiv.innerText = "Add new store:";
			div2.appendChild(lineDiv);

			const input = document.createElement("input");
			input.className = "InputNewStore";
			lineDiv.appendChild(input);

			const addStore = document.createElement("div");
			lineDiv.appendChild(addStore);
			addStore.className = "StoreRemove";
			addStore.innerText = "+";
			addStore.onclick = this.createStoreEvent.bind(this);
			
		}

		if (this.nodeSlot) {
			const btn_ok = document.createElement("div");
			btn_ok.className = "BtnChooseStore1";
			btn_ok.innerText = "Ok"
			div.appendChild(btn_ok);
			btn_ok.onclick = this.acceptStoreDefaults.bind(this);

			if (this.nodeSlot.defaults) {
				this.changeToDefaults({ "target": ddd });
			}

		}

		const btn_c = document.createElement("div");
		btn_c.className = "BtnChooseStore2";
		btn_c.innerText = "Cancel"
		div.appendChild(btn_c);
		btn_c.onclick = this.cancelStoreDefaults.bind(this);

		document.body.appendChild(d);

	}

	selectStoreEvent(event) {
		if (this.storeSelected) {
			this.storeSelected.classList.remove("Selected");
		}
		event.target.classList.add("Selected");
		this.storeSelected = event.target;
	}

	createStoreEvent(event) {
		const text = event.target.parentElement.children[0].value;
		if (!text.length) {
			console.error("Name is empty!");
			return;
		}
		
		if (APP.Logic.storesList.indexOf(text) !== -1) {
			console.error("Name already exist!");
			return;
		}
		
		const lineDiv = document.createElement("div");
		lineDiv.className = "StoreItem";
		lineDiv.innerText = text;
		lineDiv.value = text;
		lineDiv.onclick = this.selectStoreEvent.bind(this);

		if (!this.nodeSlot) {
			const removeStore = document.createElement("div");
			lineDiv.appendChild(removeStore);
			removeStore.className = "StoreRemove";
			removeStore.innerText = "x";
			removeStore.onclick = this.removeStoreEvent.bind(this);
			
			const editStore = document.createElement("div");
			lineDiv.appendChild(editStore);
			editStore.className = "StoreEdit";
			editStore.innerText = "edit";
			editStore.onclick = this.editStoreValue.bind(this);
			
		}

		APP.Logic.storesList.push(text);
		APP.Logic.stores[text] = "";
		
		event.target.parentElement.parentElement.insertBefore(lineDiv, event.target.parentElement);
		event.target.parentElement.children[0].value = "";

	}

	removeStoreEvent(event) {
		console.log("REMOVE STORE", e.target.parentElement.textContent);
		// TODO REMOVE
	}
	
	
	editStoreValue(event) {
		const storeName = event.target.parentElement.value;
		this.editValue(storeName, null);
	}

	acceptStoreDefaults(event) {

		if (this.nodeSlot && this.nodeSlot instanceof Slot) {
			if (this.storeSelected) {
				this.nodeSlot.appendStoreToSlot(this.storeSelected.innerText);
			} else {
				const def = this.storeContainer.children[0].children[1].children[2].value;
				APP.Logic.nodes[this.nodeSlot.nodeID].appendDefaults(this.nodeSlot, {
					"index": this.nodeSlot.index,
					"value": def
				});
			}
		}

		console.log("OK");

		this.storeContainer.remove();
		this.storeContainer = null;
		this.storeSelected = null;
		this.nodeSlot = null;
	}

	cancelStoreDefaults(event) {
		this.storeContainer.remove();
		this.storeContainer = null;
		this.storeSelected = null;
		this.nodeSlot = null;
	}

	changeToStore(event) {
		const def = event.target.parentElement.parentElement.children[1];
		const str = event.target.parentElement.parentElement.children[2];
		def.style.display = "none";
		str.style.display = "";
		event.target.style.fontWeight = "bold";
		event.target.parentElement.children[1].style.fontWeight = "";
	}

	changeToDefaults(event) {
		
		
		this.editValue(null, this.nodeSlot);
		
		this.storeContainer.remove();
		this.storeContainer = null;
		this.storeSelected = null;
		
		// const def = event.target.parentElement.parentElement.children[1];
		// const str = event.target.parentElement.parentElement.children[2];
		// def.style.display = "";
		// str.style.display = "none";
		// event.target.style.fontWeight = "bold";
		// event.target.parentElement.children[0].style.fontWeight = "";

		// if (this.storeSelected) {
		// 	this.storeSelected.classList.remove("Selected");
		// 	this.storeSelected = null;
		// }

	}

	btnResetAll() {
		resetAll();
	}


	search(e) {
		if (!e) e = window.event;
		let keyCode = e.keyCode || e.which;
		if (keyCode != '13') {
			return;
		}

		let node = null;
		let value = e.target.value;


		// eslint-disable-next-line no-negated-condition
		if (!isNaN(value)) {
			// search by ID
			node = APP.Logic.nodes[parseInt(value)];
		} else {
			// search by str
			// eslint-disable-next-line guard-for-in
			for (let nodeID in APP.Logic.nodes) {
				let n = APP.Logic.nodes[nodeID];
				if (!n) {
					continue;
				}
				if (n.type.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					n.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
					node = n;
					break;
				}
			}
		}

		if (!node) {
			return;
		}

		this.camZ = 2;
		let nx = node.htmlElement.offsetLeft;
		let ny = node.htmlElement.offsetTop;
		let nw = node.htmlElement.offsetWidth / 2;
		let nh = node.htmlElement.offsetHeight / 2;

		let vec = this.translatePosToCenter(nx + nw, ny + nh);
		this.camX = vec[0];
		this.camY = vec[1];

		this.updateScene();
	}


	translatePosTo(x, y) {
		let w = window.innerWidth / 2;
		let h = window.innerHeight / 2;
		let _x = (x - w) / this.camZ + w + this.camX;
		let _y = (y - h) / this.camZ + h + this.camY;
		return [_x, _y];
	}

	translatePosFrom(x, y) {
		let w = window.innerWidth / 2;
		let h = window.innerHeight / 2;
		let camX = x - w - (- w / this.camZ);
		let camY = y - h - (- h / this.camZ);
		return [camX, camY];
	}

	translatePosToCenter(x, y) {
		let w = window.innerWidth / 2;
		let h = window.innerHeight / 2;
		let camX = x - w - (- w / this.camZ) - (w / this.camZ);
		let camY = y - h - (- h / this.camZ) - (h / this.camZ);
		return [camX, camY];
	}

	createStoreBlock() {

		this.staticStoreView = document.createElement("div");
		this.staticStoreView.id = "StaticStoreView";
		document.body.appendChild(this.staticStoreView);

		let buttonControl = document.createElement("div");
		buttonControl.className = "BtnControl";
		buttonControl.textContent = "Спрятать";
		buttonControl.addEventListener("click", this.hideViewControls.bind(this));
		this.staticStoreView.appendChild(buttonControl);

		for (let store in APP.Logic.stores) {

			let storeHtml = document.createElement("div");
			this.staticStoreView.appendChild(storeHtml);
			storeHtml.textContent = store;

		}


	}


	
	openLoginPanel(anonymLoadFuncm, oid) {

		if (APP.auth || this.m_loginDiv || this.m_registrationDiv) {
			return;
		}
		
		this.m_loginDiv = document.createElement("div");
		this.m_loginDiv.className = "loginDiv";
		this.m_loginDiv.style.zIndex = '12';
		document.body.appendChild(this.m_loginDiv);
		
		
		const loginP2 = document.createElement("div");
		this.m_loginDiv.appendChild(loginP2);
		
		// TITLE
		const loginTitleText = document.createElement("div");
		loginTitleText.className = "LoginTitle";
		loginTitleText.textContent = "Логин";
		loginP2.appendChild(loginTitleText);
		
		// NAME
		const loginText = document.createElement("div");
		loginText.className = "LoginFormTxt";
		loginText.textContent = "Имя пользователя";
		loginP2.appendChild(loginText);
		
		const loginInput = document.createElement("input");
		loginInput.id = "login";
		loginP2.appendChild(loginInput);
		
		// PASS
		const passText = document.createElement("div");
		passText.className = "LoginFormTxt";
		passText.textContent = "Пароль";
		loginP2.appendChild(passText);
		
		const passInput = document.createElement("input");
		passInput.id = "password";
		passInput.type = "password";
		loginP2.appendChild(passInput);
		
		const divBtnContainer = document.createElement("div");
		divBtnContainer.className = "LoginBtnConstainer";
		loginP2.appendChild(divBtnContainer);
		
		const btnSend = document.createElement("div");
		btnSend.className = "LoginBtn";
		btnSend.textContent = "Ок";
		divBtnContainer.appendChild(btnSend);
		btnSend.addEventListener("click", this.sendLoginClick.bind(this));
		
		const btnClose = document.createElement("div");
		btnClose.className = "LoginBtn";
		btnClose.textContent = "Отмена";
		divBtnContainer.appendChild(btnClose);
		btnClose.addEventListener("click", function f(e) {
			this.m_loginDiv.remove();
			this.m_loginDiv = null;
			

			const urlData = window.location.search;
			const objKey = "obj_id=";
			const objLength = 24;
			const index = urlData.indexOf(objKey);
			if (index !== -1) {

				const correctIndex = index + objKey.length;
				const oid = urlData.substring(correctIndex, correctIndex + objLength);

				if (oid.length === objLength /*&& APP.auth*/) {
					APP.dbWorker.setLoadObject(oid);
					APP.dbWorker.requestGetApplicationObject(oid);
				}

			}
			
		}.bind(this));
		
	}
	
	sendLoginClick() {
		const login = document.getElementById("login");
		const pass = document.getElementById("password");
		const data = 'username=' + encodeURIComponent(login.value) + '&password=' + encodeURIComponent(pass.value);
		sendPostRequest("/user/login", data, this.callbackLoginRequest.bind(this));
	}
	
	callbackLoginRequest(event) {
		
		const doneStatus = 4;
		if (event.target.readyState !== doneStatus) {
			return;
		}
		
		const successStatus = "{\"status\": \"success\"}";
		if (successStatus === event.target.responseText) {
			
			// TO DO может косячить и ложно говорить о авторизации
			// APP.auth = true;
			
			// CHECK NAME
			// sendPostRequest("/user/status", "", function f(event) {
				
			// 	const dataJson = JSON.parse(event.target.response);
			// 	APP.username = dataJson.user.username;
			// 	this.usernameDiv.textContent = APP.username;
				
			// 	const auth = dataJson.authenticated;
			// 	const key = dataJson.user.as_user_id;
				
			// 	if (auth) {
			// 		if (key === "57e39cd0d75c2574ed907e49") {
			// 			APP.auth = false;
			// 		} else {
			// 			APP.auth = true;
			// 		}
			// 	}
				
				
			// }.bind(this));
			
			
			// // GET NEW SES KEY FOR objects list
			// sendPostRequest("/api/ugnsk", "", function f(event) {
			// 	const dataJSON = JSON.parse(event.target.response);
			// 	// connectToRCDriver(dataJSON.key);
			// 	getNewTokens(dataJSON.key, "GetObjectList");
			// });
			
			
			sendPostRequest("/user/status", "", APP.dbWorker.onCheckUserStatus.bind(APP.dbWorker));
			
			//this.btnLogin.remove();
			//this.btnReg.remove();
			this.m_loginDiv.firstElementChild.style.border = "2px #12cf3b solid";
			//this.createExitBtn();
			
			setTimeout(function pause() {
				this.m_loginDiv.remove();
				this.m_loginDiv = null;

				const urlData = window.location.search;
				const objKey = "obj_id=";
				const objLength = 24;
				const index = urlData.indexOf(objKey);
				if (index !== -1) {

					const correctIndex = index + objKey.length;
					const oid = urlData.substring(correctIndex, correctIndex + objLength);

					if (oid.length === objLength && APP.auth) {
						APP.dbWorker.setLoadObject(oid);
						APP.dbWorker.requestGetApplicationObject(oid);
					}

				}

			}.bind(this), 1500);
			
		} else {
			this.m_loginDiv.firstElementChild.style.border = "2px red solid";
		}
		
	
	}
	
	
	
	openRegistrationPanel() {
		
		if (APP.auth || this.m_loginDiv || this.m_registrationDiv) {
			return;
		}
		
		this.m_registrationDiv = document.createElement("div");
		this.m_registrationDiv.className = "RegistrationDiv";
		
		document.body.appendChild(this.m_registrationDiv);


		const regP2 = document.createElement("div");
		this.m_registrationDiv.appendChild(regP2);

		// TITLE
		const regTitleText = document.createElement("div");
		regTitleText.textContent = "Registration";
		regP2.appendChild(regTitleText);

		// USERNAME
		const usernameText = document.createElement("div");
		usernameText.textContent = "Name";
		regP2.appendChild(usernameText);
		
		const usernameInput = document.createElement("input");
		regP2.appendChild(usernameInput);
		
		
		// EMAIL
		const emailText = document.createElement("div");
		emailText.textContent = "Email";
		const emailInput = document.createElement("div");
		emailInput.appendChild(phoneText);
		
		// PHONE
		const phoneText = document.createElement("div");
		phoneText.textContent = "Phone number";
		regP2.appendChild(phoneText);
		
		const phoneInput = document.createElement("div");
		regP2.appendChild(phoneInput);
		
		// PASS
		const passText = document.createElement("div");
		passText.textContent = "Password";
		regP2.appendChild(passText);
		
		const passInput = document.createElement("input");
		passInput.type = "password";
		regP2.appendChild(passInput);
		
		// CONF PASS
		const passText2 = document.createElement("div");
		passText2.textContent = "Password repeate";
		regP2.appendChild(passText2);
		
		const passInput2 = document.createElement("input");
		passInput2.type = "password";
		regP2.appendChild(passInput2);
		
		// BTNS
		const btnsDiv = document.createElement("div");
		regP2.appendChild(btnsDiv);
		
		const btnSend = document.createElement("div");
		btnSend.className = "LoginBtn";
		btnSend.textContent = "Ok";
		btnsDiv.appendChild(btnSend);
		// btnSend.addEventListener("click", this.sendLoginClick.bind(this));

		const btnClose = document.createElement("div");
		btnClose.className = "LoginBtn";
		btnClose.textContent = "Cancel";
		btnsDiv.appendChild(btnClose);
		btnClose.addEventListener("click", function f() {
			this.m_registrationDiv.remove();
			this.m_registrationDiv = null;
		}.bind(this));
		
	}
	
	
	openScriptObjectList(list) {
		
		
		
	}
	
	
	openScripsList() {
		
		if (!APP.scriptsList || !APP.scriptsList.length) {
			return;
		}
		
		this.m_divListScriptsDiv = document.createElement("div");
		this.m_divListScriptsDiv.className = "ListScriptsContainer";
		document.body.appendChild(this.m_divListScriptsDiv);
		
		const subdivListScripts = document.createElement("div");
		this.m_divListScriptsDiv.appendChild(subdivListScripts);
		
		const listScripts = document.createElement("div");
		listScripts.className = "ListScripts";
		subdivListScripts.appendChild(listScripts);
		
		const closeListScripts = document.createElement("div");
		closeListScripts.textContent = "Close";
		closeListScripts.className = "CloseListScripts";
		subdivListScripts.appendChild(closeListScripts);
		closeListScripts.addEventListener("click", function fff(){
			if (this.m_divListScriptsDiv) {
				this.m_divListScriptsDiv.remove();
				this.m_divListScriptsDiv = null;
			}
		}.bind(this));
		
		for (const obj of APP.scriptsList) {

			const oid = obj._id.$oid;
			const {name} = obj.meta;
			const dscr = obj.meta.description;
			
			
			const listItem = document.createElement("div");
			listItem.className = "ScriptListItem";
			listItem.title = dscr;
			listScripts.appendChild(listItem);
			
			const listItemName = document.createElement("div");
			listItemName.textContent = name;
			listItemName.className = "ScriptListItemName";
			listItem.appendChild(listItemName);
			
			const listItemOID = document.createElement("div");
			listItemOID.textContent = oid;
			listItemOID.className = "ScriptListItemOID";
			listItem.appendChild(listItemOID);
			
			listItem.addEventListener("click", this.chooseLoadScript.bind(this));
			
			
		}
		
		
	}
	
	// eslint-disable-next-line class-methods-use-this
	chooseLoadScript(event) {
		
		const oid = event.target.parentElement.children[1].textContent;
		this.moveToOID = oid;
		
		
		if (this.m_divListScriptsDiv) {
			this.m_divListScriptsDiv.remove();
			this.m_divListScriptsDiv = null;
		}
		
		// sendPostRequest("/api/ugnsk", "", function f(event) {
		// 	const dataJSON = JSON.parse(event.target.response);
		// 	getNewTokens(dataJSON.key, "GetObject");
		// });
		
		APP.dbWorker.requestGetApplicationObject(oid);
		
	}

	saveDialog() {
		
		APP.Logic.saveScript();
		if (APP.oid.length === 24) {
			this.sendSaveRequest();
			return;
		}
		
		this.saveDialogDiv = document.createElement("div");
		this.saveDialogDiv.id = "SaveDialogDiv";
		document.body.appendChild(this.saveDialogDiv);
		
		const saveDialogForm = document.createElement("div");
		saveDialogForm.id = "SaveDialogForm";
		this.saveDialogDiv.appendChild(saveDialogForm);
		
		const saveDialogTitle = document.createElement("div");
		saveDialogTitle.className = "SaveDialogTitle";
		saveDialogTitle.textContent = "Save appication object";
		saveDialogForm.appendChild(saveDialogTitle);
		
		// NAME
		const nameText = document.createElement("div");
		nameText.className = "SaveDialogText";
		nameText.textContent = "Name:";
		saveDialogForm.appendChild(nameText);
		
		const nameInput = document.createElement("input");
		nameInput.className = "SaveDialogInput";
		saveDialogForm.appendChild(nameInput);
		
		// DESCRIPTION
		const descriptionText = document.createElement("div");
		descriptionText.className = "SaveDialogText";
		descriptionText.textContent = "Description:";
		saveDialogForm.appendChild(descriptionText);

		const descriptionInput = document.createElement("input");
		descriptionInput.className = "SaveDialogInput";
		saveDialogForm.appendChild(descriptionInput);
		
		// WIKI
		const wikiText = document.createElement("div");
		wikiText.className = "SaveDialogText";
		wikiText.textContent = "Wiki Ref:";
		saveDialogForm.appendChild(wikiText);
		
		const wikiInput = document.createElement("input");
		wikiInput.className = "SaveDialogInput";
		saveDialogForm.appendChild(wikiInput);
		
		// BTNs
		const btnsDiv = document.createElement("div");
		btnsDiv.className = "SaveDialogBTNs";
		saveDialogForm.appendChild(btnsDiv);
		
		// SAVE
		const btnSave = document.createElement("div");
		btnSave.className = "SaveDialogBTN";
		btnSave.textContent = "Save";
		btnsDiv.appendChild(btnSave);
		btnSave.addEventListener("click", function fSave(nameText, nameInput, descriptionText, descriptionInput, wikiText, wikiInput) {
			
			const name = nameInput.value;
			const dscr = descriptionInput.value;
			const wiki = wikiInput.value;
			
			let valid = true;
			if (name.length === 0) {
				valid = false;
				nameText.textContent = "Name: { field is empty }";
				nameText.style.color = "red";
			} else {
				nameText.textContent = "Name:";
				nameText.style.color = "green";
			}
			if (dscr.length === 0) {
				valid = false;
				descriptionText.textContent = "Description: {field is empty}";
				descriptionText.style.color = "red";
			} else {
				descriptionText.textContent = "Description:";
				descriptionText.style.color = "green";
			}
			if (wiki.length === 0) {
				valid = false;
				wikiText.textContent = "Wiki referense: {field is empty}";
				wikiText.style.color = "red";
			} else {
				wikiText.textContent = "Wiki referense:";
				wikiText.style.color = "green";
			}
			
			if (!valid) {
				return;
			}
			
			APP.name = name;
			APP.description = dscr;
			APP.wiki = wiki;
			
			if (this.saveDialogDiv) {
				this.saveDialogDiv.remove();
				this.saveDialogDiv = null;
			}
			
			const data = 'collection=' + encodeURIComponent("objects");
			sendPostRequest("/api/create", data, function createFunc(event) {
				console.log(event.target.response);
				const dataJson = JSON.parse(event.target.response);
				if ("_id" in dataJson) {
					APP.oid = dataJson._id;
					this.sendSaveRequest();
				} else {
					APP.log("error", "Create object error");
				}
			}.bind(this));
			
		}.bind(this, nameText, nameInput, descriptionText, descriptionInput, wikiText, wikiInput));
		
		// CANCEL
		const btnCancel = document.createElement("div");
		btnCancel.className = "SaveDialogBTN";
		btnCancel.textContent = "Cancel";
		btnsDiv.appendChild(btnCancel);
		btnCancel.addEventListener("click", function fClose() {
				
			if (this.saveDialogDiv) {
				this.saveDialogDiv.remove();
			}
			
		}.bind(this));
		
	}
	
	sendSaveRequest() {
		
		// const oid = "5ffd3671b012550008887bc7";
		const {oid} = APP;
		
		const validLengthOID = 24;
		if (oid.length !== validLengthOID) {
			return;
		}
		APP.Logic.replaceNodeSemicolon();
		const data =
			"_id=" + encodeURIComponent(oid) +
			"&collection=" + encodeURIComponent("objects") +
			"&meta=" + JSON.stringify({
				"name": encodeURIComponent(APP.name),
				"pattern": {
					"$oid": encodeURIComponent(APP.pattern)
				},
				"description": encodeURIComponent(APP.description)
			}) +
			"&object=" + JSON.stringify({
				"script_data": APP.script,
				"form_data": APP.form
			}) +
			"&additional=" + JSON.stringify({
				"wiki_ref": encodeURIComponent(APP.wiki),
				"image": encodeURIComponent(APP.image),
				"category": encodeURIComponent(APP.category)
			});

		APP.Logic.fixNodeSemicolon();
		sendPostRequest("/api/update", data, function updFunc(event) {
			// {"status": "object updated"}
			const dataJson = JSON.parse(event.target.response); 
			// console.log("SAVE RESULT:", event.target.response);
			if (dataJson.status === "object updated") {
				APP.log("info", "Object updated");
			} else {
				APP.log("error", "Object not updated");
			}
			
		}.bind(this));
	}
	
	
	editValue(name, slot) {
	
		this.m_valueEditDiv = document.createElement("div");
		this.m_valueEditDiv.id = "ValueEditDiv";
		document.body.appendChild(this.m_valueEditDiv);
		
		const veSubDiv = document.createElement("div");
		veSubDiv.id = "ValueEditSubDiv";
		this.m_valueEditDiv.appendChild(veSubDiv);
		
		const veTitle = document.createElement("div");
		veTitle.id = "ValueEditTitle";
		veTitle.textContent = "По умолчанию";
		veSubDiv.appendChild(veTitle);
		
		const veTypeTxt = document.createElement("div");
		veTypeTxt.id = "ValueEditTypeText";
		veSubDiv.appendChild(veTypeTxt);
		
		// Types
		const veTypeContainer = document.createElement("div");
		veTypeContainer.id = "ValueEditTypeContainer";
		veSubDiv.appendChild(veTypeContainer);
		
		const veTC0 = document.createElement("div");
		veTC0.className = "ValueEditTypeContainer";
		veTypeContainer.appendChild(veTC0);
		const inpB = this.createRadioBtn(veTC0, "Bool", true);
		const inpS = this.createRadioBtn(veTC0, "String", false);
		
		const veTC1 = document.createElement("div");
		veTC1.className = "ValueEditTypeContainer";
		veTypeContainer.appendChild(veTC1);
		const inpN = this.createRadioBtn(veTC1, "Numeric", true);
		const inpO = this.createRadioBtn(veTC1, "JSON Object", false);
		
		const veInputContainer = document.createElement("div");
		veInputContainer.id = "ValueEditInputContainer";
		veSubDiv.appendChild(veInputContainer);
		
		const veInputValue = document.createElement("input");
		// veInputValue.id = "ValueEditInput";
		veInputContainer.appendChild(veInputValue);
		
		
		
		// BTNs
		const btnsDiv = document.createElement("div");
		btnsDiv.className = "VEBTNs";
		veSubDiv.appendChild(btnsDiv);

		// SAVE
		const btnOk = document.createElement("div");
		btnOk.className = "VEBTN";
		btnOk.textContent = "Ок";
		btnsDiv.appendChild(btnOk);
		btnOk.addEventListener("click", function fOk(name, slot, event) {
			
			const input = document.getElementById("ValueEditInput");
			
			let v = null;
			const {type} = input;
			if (type === "checkbox") {
				v = input.checked;
			} else if (type === "number") {
				v = parseFloat(input.value);
			} else if (type === "text") {
				v = input.value;
			} else if (type === "textarea") {
				try {
					v = JSON.parse(input.value);
				} catch (e) {
					console.error("Catn parse text to json. Bad JSON! ");
					return;
				}
			}
			
			if (name) {
				// store
				if (name in APP.Logic.stores) {
					APP.Logic.stores[name] = v;
				} else {
					console.error("Cant set store value! Store not found!");
				}
			} else {
				// default
				APP.Logic.nodes[this.nodeSlot.nodeID].appendDefaults(this.nodeSlot, {
					"index": this.nodeSlot.index,
					"value": v
				});
			}
			
			if (this.m_valueEditDiv) {
				this.m_valueEditDiv.remove();
				this.m_valueEditDiv = null;
			}
			
			
		}.bind(this, name, slot));
		
		// CANCEL
		const btnCancel = document.createElement("div");
		btnCancel.className = "VEBTN";
		btnCancel.textContent = "Отмена";
		btnsDiv.appendChild(btnCancel);
		btnCancel.addEventListener("click", function fClose() {

			if (this.m_valueEditDiv) {
				this.m_valueEditDiv.remove();
				this.m_valueEditDiv = null;
			}

		}.bind(this));
		
		
		const baseValue = APP.Logic.stores[name];
		const storeType = typeof baseValue;
		console.log(storeType);
		if (storeType === "boolean") {
			inpB.click();
			document.getElementById("ValueEditInput").checked = baseValue;
		} else if (storeType === "number") {
			inpN.click();
			document.getElementById("ValueEditInput").value = baseValue;
		} else if (storeType === "string") {
			inpS.click();
			document.getElementById("ValueEditInput").value = baseValue;
		} else {
			inpO.click();
			document.getElementById("ValueEditInput").value = JSON.stringify(baseValue);
		}
		
	}
	
	
	createRadioBtn(container, text, left) {
		
		let c = null;
		if (left) {
			c = document.createElement("div");
			c.className = "ValueEditTypeContainerL";
			container.appendChild(c);
		} else {
			c = document.createElement("div");
			c.className = "ValueEditTypeContainerR";
			container.appendChild(c);
		}
		
		const txt = document.createElement("div");
		txt.textContent = text;
		c.appendChild(txt);
		
		const input = document.createElement("input");
		input.type = "radio";
		input.name = "ValueType";
		input.textContent = text;
		input.addEventListener("change", this.changeValueType.bind(this));
		c.appendChild(input);
		
		c.addEventListener("click", function f() {
			this.click();
		}.bind(input));
		
		return input;
		
	}
	
	
	// eslint-disable-next-line class-methods-use-this
	changeValueType(event) {
		
		const inputContainer = document.getElementById("ValueEditInputContainer");
		inputContainer.firstElementChild.remove();
		
		let input = document.createElement("input");
		
		this.m_valueEditDiv.children[0].id = "ValueEditSubDiv";
		
		const type = event.target.textContent;
		if (type === "Bool") {
			input.type = "checkbox";
			input.checked = true;
			input.className = "ValueEditInputB";
		} else if (type === "Numeric") {
			input.type = "number";
			input.className = "ValueEditInputN";
		} else if (type === "String") {
			input.type = "text";
			input.className = "ValueEditInputS";
		} else if (type === "JSON Object") {
			input = document.createElement("textarea");
			input.value = "{\n}";
			input.className = "ValueEditInputT";
			this.m_valueEditDiv.children[0].id = "ValueEditSubDiv1";
		}
		
		input.id = "ValueEditInput";
		inputContainer.appendChild(input);
		
	}
	
	
	// eslint-disable-next-line no-dupe-class-members
	exportOldScripts() {
	
		if (!APP.scriptsList || !APP.scriptsList.length) {
			return;
		}
		
		this.m_divListScriptsDiv = document.createElement("div");
		this.m_divListScriptsDiv.className = "ListScriptsContainer";
		document.body.appendChild(this.m_divListScriptsDiv);

		const subdivListScripts = document.createElement("div");
		this.m_divListScriptsDiv.appendChild(subdivListScripts);

		const listScripts = document.createElement("div");
		listScripts.className = "ListScripts";
		subdivListScripts.appendChild(listScripts);

		const closeListScripts = document.createElement("div");
		closeListScripts.textContent = "Закрыть";
		closeListScripts.className = "CloseListScripts";
		subdivListScripts.appendChild(closeListScripts);
		closeListScripts.addEventListener("click", function fff() {
			if (this.m_divListScriptsDiv) {
				this.m_divListScriptsDiv.remove();
				this.m_divListScriptsDiv = null;
			}
		}.bind(this));
		
		for (const obj of APP.RexScripts) {
			
			const oid = obj._id.$oid;
			const {name} = obj.meta;
			const dscr = obj.meta.description;
			
			const listItem = document.createElement("div");
			listItem.className = "ScriptListItem";
			listItem.title = dscr;
			listItem.oid = oid;
			listScripts.appendChild(listItem);
			
			const listItemName = document.createElement("div");
			listItemName.textContent = name;
			listItemName.className = "ScriptListItemName";
			listItem.appendChild(listItemName);
			
			const listItemOID = document.createElement("div");
			listItemOID.textContent = oid;
			listItemOID.className = "ScriptListItemOID";
			listItem.appendChild(listItemOID);
			
			listItem.addEventListener("click", this.chooseExportScript.bind(this));
			
		}
	}
	
	chooseExportScript(event) {
		const {oid} = event.target.parentElement;
		
		if (this.m_divListScriptsDiv) {
			this.m_divListScriptsDiv.remove();
			this.m_divListScriptsDiv = null;
		}
		
		APP.dbWorker.requestGetRexScriptObject(oid);
		
	}
	
	
	
	createLeftPanel() {
		return;
		this.leftPanel = document.createElement("div");
		this.leftPanel.id = "LeftPanel";
		this.leftPanel.className = "LeftPanelView";
		document.body.appendChild(this.leftPanel);
		
		// HIDE / SHOW
		this.m_btnControlHtml = document.createElement("div");
		this.m_btnControlHtml.id = "LeftPanelControlBtn";
		this.m_btnControlHtml.textContent = "HIDE";
		this.m_btnControlHtml.addEventListener("click", this.controlLeftPanel.bind(this));
		this.leftPanel.appendChild(this.m_btnControlHtml);
		
		
		const htmlMainContainer = document.createElement("div");
		htmlMainContainer.className = "LVMainContainer";
		this.leftPanel.appendChild(htmlMainContainer);
		
		
		
		// objects / widgets / libraies
		
		const htmlTab1BtnsContainer = document.createElement("div");
		htmlTab1BtnsContainer.className = "TabBtnsContainer";
		htmlMainContainer.appendChild(htmlTab1BtnsContainer);
		
		const htmlBtnObjects = document.createElement("div");
		htmlBtnObjects.textContent = "Objects";
		htmlBtnObjects.addEventListener("click", this.controlTab1.bind(this));
		htmlTab1BtnsContainer.appendChild(htmlBtnObjects);
		
		const htmlBtnWidgets = document.createElement("div");
		htmlBtnWidgets.textContent = "Widgets";
		htmlBtnWidgets.addEventListener("click", this.controlTab1.bind(this));
		htmlTab1BtnsContainer.appendChild(htmlBtnWidgets);
		
		const htmlBtnLibraries = document.createElement("div");
		htmlBtnLibraries.textContent = "Libraries";
		htmlBtnLibraries.addEventListener("click", this.controlTab1.bind(this));
		htmlTab1BtnsContainer.appendChild(htmlBtnLibraries);
		
		const htmlTab1Container = document.createElement("div");
		htmlTab1Container.className = "TabContainer";
		htmlMainContainer.appendChild(htmlTab1Container);
		
		this.htmlContainerObjects = document.createElement("div");
		htmlTab1Container.appendChild(this.htmlContainerObjects);
		
		this.htmlContainerWidgets = document.createElement("div");
		htmlTab1Container.appendChild(this.htmlContainerWidgets);
		
		this.htmlContainerLibraries = document.createElement("div");
		htmlTab1Container.appendChild(this.htmlContainerLibraries);
		
		// logics / struct
		const htmlTab2BtnsContainer = document.createElement("div");
		htmlTab2BtnsContainer.className = "TabBtnsContainer";
		htmlMainContainer.appendChild(htmlTab2BtnsContainer);
		
		const htmlBtnLogics = document.createElement("div");
		htmlBtnLogics.textContent = "Logics";
		htmlBtnLogics.addEventListener("click", this.controlTab2.bind(this));
		htmlTab2BtnsContainer.appendChild(htmlBtnLogics);
		
		const htmlBtnStruct = document.createElement("div");
		htmlBtnStruct.textContent = "Struct";
		htmlBtnStruct.addEventListener("click", this.controlTab2.bind(this));
		htmlTab2BtnsContainer.appendChild(htmlBtnStruct);
		
		const htmlTab2Container = document.createElement("div");
		htmlTab2Container.className = "TabContainer";
		htmlMainContainer.appendChild(htmlTab2Container);
		
		this.htmlContainerLogics = document.createElement("div");
		htmlTab2Container.appendChild(this.htmlContainerLogics);
		
		this.htmlContainerStruct = document.createElement("div");
		htmlTab2Container.appendChild(this.htmlContainerStruct);
		
	}
	
	controlLeftPanel() {
		if (this.leftPanel.className === "LeftPanelView") {
			this.leftPanel.className = "LeftPanelHide";
			this.m_btnControlHtml.textContent = "Спрятать";
		} else {
			this.leftPanel.className = "LeftPanelView";
			this.m_btnControlHtml.textContent = "Показать";
		}
	}
	
	controlTab1(event) {
		
	}
	
	controlTab2(event) {

	}
	
	
}