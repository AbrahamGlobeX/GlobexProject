'use strict';

class WidgetSmartImage extends BaseWidget {

	constructor() {
		super();
	}

	onCreate() {
		this._imageId = -1;
		this.ofsX = 0;
		this.ofsY = 0;
		this._imageData = "";
		this.addClassName("WidgetImage");

		this.editMode = false;
		this.editModeButton = "";
		this.name = "Name0";
		this.nameLabel = "";
		this.layersTree = "";
		this.mainLay = "";
		this.target = "";
		this.table = "";
		this.abs = false;
		this.cp = 1;
		this.exPointers = [];
		this.list = "";
		this.treeNum = "";
		this.saveData = {};
		this.firstIn = true;
		this.layers = {[this.name]: {}};
		this.layerObjects = {};
		this.testObjectId = "60c97ac9d4acdd755b5beea2";
		this.currentLayerObject = {};
		this.mainObject = {};

		this.window = new widgetsComponentsTypes["window"];
		this.htmlElement.appendChild(this.window.htmlElement);
		this.window.htmlElement.style.width = "100%";
		this.window.htmlElement.style.height = "100%";
		this.window.htmlElement.style.background = "grey";

		this.mainMainLay = new widgetsComponentsTypes["layoutVertical"];
		this.window.includeWidget(this.mainMainLay.htmlElement);
		this.mainMainLay.htmlElement.style.width = "100%";
		this.mainMainLay.htmlElement.style.height = "100%";


		this.mainLay = new widgetsComponentsTypes["layoutHorizontal"];
		this.mainMainLay.includeWidget(this.mainLay);
		this.mainLay.htmlElement.style.width = "100%";
		this.mainLay.htmlElement.style.height = "98%";

		this.tabLay = new widgetsComponentsTypes["layoutHorizontal"];
		this.mainMainLay.includeWidget(this.tabLay);
		this.tabLay.htmlElement.style.width = "100%";
		this.tabLay.htmlElement.style.maxHeight = "4%";

		const main = new widgetsComponentsTypes["button"]
		this.tabLay.includeWidget(main);
		main.htmlElement.style.maxWidth = "300px";
		main.text = this.name;
		main.htmlElement.style.margin = "5px";
		main.htmlElement.style.backgroundColor = "green";

		main.btn = "";


		main.htmlElement.addEventListener("click", e => {
			if (e.target.className != "WidgetButton") this.selectLayer(main.text, ReactComponent[e.target.parentNode.id]);
			else this.selectLayer(main.text, ReactComponent[e.target.id]);
		});


		this.sideLay = new widgetsComponentsTypes["layoutVertical"];
		this.sideLay.htmlElement.style.maxWidth = "300px";
		this.sideLay.htmlElement.style.height = "100%";
		this.sideLay.htmlElement.style.overflow = "hidden";
		this.mainLay.includeWidget(this.sideLay);

		this.viewLay = new widgetsComponentsTypes["layoutVertical"];
		this.viewLay.htmlElement.style.width = "100%";
		this.viewLay.htmlElement.style.height = "100%";
		this.mainLay.includeWidget(this.viewLay);

		this.imgLay = new widgetsComponentsTypes["layoutVertical"];
		this.imgLay.htmlElement.style.width = "100%";
		this.imgLay.htmlElement.style.height = "100%";
		this.viewLay.includeWidget(this.imgLay);

		this.htmlImage = document.createElement('div');
		this.htmlImage.style.width = "500px";
		this.htmlImage.style.height = "300px";
		this.imgLay.htmlElement.appendChild(this.htmlImage);
		this.htmlImage.oncontextmenu = this.showContextMenu.bind(this);
		this.position = 2;

		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.svg.classList.add("smartSvg");
		this.svg.style.width = "100%";
		this.svg.style.minHeight = "100%";
		this.svg.style.position = "relative";
		this.htmlImage.appendChild(this.svg);

		






		const layhor = new widgetsComponentsTypes["layoutHorizontal"];
		layhor.htmlElement.style.width = "100%";
		layhor.htmlElement.style.maxHeight = "5.1%";
		layhor.htmlElement.style.top = "";
		layhor.htmlElement.style.left = "";
		layhor.htmlElement.style.right = "0px";
		layhor.htmlElement.style.bottom = "12.8%";
		this.viewLay.includeWidget(layhor);

		const widget = new widgetsComponentsTypes["label"];
		layhor.includeWidget(widget);
		this.nameLabel = widget.id;
		widget.htmlElement.style.zIndex = 950;
		widget.htmlElement.style.left = "40%";
		widget.htmlElement.style.top = "";
		widget.htmlElement.style.bottom = "0px";
		widget.htmlElement.style.backgroundColor = "white";
		widget.htmlElement.style.maxWidth = "80%";
		widget.text = this.name;
		widget.htmlElement.style.borderColor = "black";
		widget.htmlElement.style.borderWidth = "1px";
		widget.htmlElement.style.borderStyle = "groove";






		const tableWindow = new WidgetWindow;
		tableWindow.htmlElement.style.width = "100%";
		tableWindow.htmlElement.style.height = "100%";
		this.sideLay.includeWidget(tableWindow);

		const tableLayout = new widgetsComponentsTypes["layoutVertical"];
		tableLayout.htmlElement.style.width = "100%";
		tableLayout.htmlElement.style.height = "100%";
		tableWindow.includeWidget(tableLayout);





		this._contextMenu = new ContextMenu();

		const chooseTree = new WidgetTree;
		this.layersTree = chooseTree;
		chooseTree.htmlElement.style.width = "100%";
		tableLayout.includeWidget(chooseTree);
		let item = chooseTree.createItemInTree(-1);
		ReactComponent[item].expanded = 1;
		this.mainLay = item;
		this.currentLayer = this.mainLay;
		ReactComponent[item].text = "Главный слой";
		if (this.table != "") this.deleteElement(this.table);
		const table = new widgetsComponentsTypes["table"];
		this.table = table.id;
		table.htmlElement.style.width = "100%";
		table.htmlElement.style.height = "100%";
		tableLayout.includeWidget(table);
		table.htmlElement.addEventListener("click", e => {
			const dialog = new widgetsComponentsTypes["dialog"];
			dialog.dialogContent.style.width = "85%";
			dialog.dialogContent.style.height = "700px";
			const tabl = new widgetsComponentsTypes["table"];
			tabl.htmlElement.style.width = "100%";
			tabl.htmlElement.style.height = "100%";
			tabl.data = ReactComponent[this.table].data;
			dialog.includeWidget(tabl);
			dialog.addDialogButton("Закрыть", () => {

				if (tabl.globalInput != "") {
					this.deleteElement(tabl.globalInput.id);
					this.deleteElement(tabl.viewLine.id);
				}
				this.deleteElement(dialog.id);
			});
		});
		ReactComponent[item].htmlElement.addEventListener("dblclick", e => {
			this.refreshTable(0);
		});




		const objButton = new widgetsComponentsTypes["button"];
		tableLayout.includeWidget(objButton);
		objButton.htmlElement.style.width = "100%";
		objButton.htmlElement.style.maxHeight = "100px";
		objButton.htmlElement.style.background = "yellow";
		objButton.text = "Показать свойства";
		objButton.htmlElement.style.color = "black";
		objButton.htmlElement.addEventListener("click", e => {


			this.showProps(this.currentLayerObject);




		});



		this.svgNS = this.svg.namespaceURI;

		this.gridsWidth = this.svg.clientWidth - 80;
		this.gridsHeight = this.svg.clientHeight - 80;

		
		this.imageData = '/data/textures/sborka.jpg';
		//this.htmlImage.setAttribute("href", this.imageData);
		this.btnData = { btnArray: [] };
		this.visibleBtn = true;
		document.addEventListener('contextmenu', event => event.preventDefault());

		window.addEventListener('resize', event => {
			
			if (ReactComponent["w_1"].htmlElement.parentNode.parentNode.style.display != "none") {
				this.oldX = this.htmlImage.style.width.substring(0, this.htmlImage.style.width.length - 2);
				this.oldY = this.htmlImage.style.height.substring(0, this.htmlImage.style.height.length - 2);
				this.htmlImage.style.height = this.imgLay.htmlElement.clientHeight + 'px';
				this.htmlImage.style.width = this.imgLay.htmlElement.clientWidth + 'px';
				ReactComponent[this.nameLabel].htmlElement.style.maxWidth = this.svg.clientHeight * 1.507 + 'px';
				for (let i = 0; i < this.btnData.btnArray.length; i++) {

					let offsetX = (1 + (this.htmlImage.style.width.substring(0, this.htmlImage.style.width.length - 2) - this.oldX) / this.oldX);
					let offsetY = (1 + (this.htmlImage.style.height.substring(0, this.htmlImage.style.height.length - 2) - this.oldY) / this.oldY);

					this.btnData.btnArray[i].setAttribute('x', this.btnData.btnArray[i].x.animVal.value * offsetX);
					this.btnData.btnArray[i].setAttribute('y', this.btnData.btnArray[i].y.animVal.value * offsetY);
					this.btnData.btnArray[i].textElement.setAttribute('x', this.btnData.btnArray[i].x.animVal.value + this.btnData.btnArray[i].clientWidth / 2 - 8);
					this.btnData.btnArray[i].textElement.setAttribute('y', this.btnData.btnArray[i].y.animVal.value + this.btnData.btnArray[i].clientHeight / 2 + 6);
					if (this.btnData.btnArray[i].attributes.rx.value == "0") {
						//this.btnData.btnArray[i].textElement.textContent = btnNew.dataText;
						this.btnData.btnArray[i].textElement.setAttribute('x', this.btnData.btnArray[i].x.animVal.value + this.btnData.btnArray[i].clientWidth / 2 - 8 - (textElement.textContent.length - 1) * 5);
					}

					for (let j = 0; j < this.btnData.btnArray[i].tempBtn.length; j++) {
						this.btnData.btnArray[i].tempBtn[j].setAttribute('cx', this.btnData.btnArray[i].tempBtn[j].cx.animVal.value * offsetX);
						this.btnData.btnArray[i].tempBtn[j].setAttribute('cy', this.btnData.btnArray[i].tempBtn[j].cy.animVal.value * offsetY);

						this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('x1', this.btnData.btnArray[i].x.animVal.value + this.btnData.btnArray[i].clientWidth / 2);
						this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('x2', this.btnData.btnArray[i].tempBtn[j].cx.animVal.value);
						this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('y1', this.btnData.btnArray[i].y.animVal.value + this.btnData.btnArray[i].clientHeight / 2);
						this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('y2', this.btnData.btnArray[i].tempBtn[j].cy.animVal.value);
					}

					for (let j = 0; j < this.btnData.btnArray[i].duplicates.length; j++) {
						this.btnData.btnArray[i].duplicates[j].setAttribute('x', this.btnData.btnArray[i].duplicates[j].x.animVal.value * offsetX);
						this.btnData.btnArray[i].duplicates[j].setAttribute('y', this.btnData.btnArray[i].duplicates[j].y.animVal.value * offsetY);
						this.btnData.btnArray[i].duplicates[j].textElement.setAttribute('x', this.btnData.btnArray[i].duplicates[j].x.animVal.value + this.btnData.btnArray[i].duplicates[j].clientWidth / 2 - 8);
						this.btnData.btnArray[i].duplicates[j].textElement.setAttribute('y', this.btnData.btnArray[i].duplicates[j].y.animVal.value + this.btnData.btnArray[i].duplicates[j].clientHeight / 2 + 6);

						for (let k = 0; k < this.btnData.btnArray[i].duplicates[j].tempBtn.length; k++) {
							this.btnData.btnArray[i].duplicates[j].tempBtn[k].setAttribute('cx', this.btnData.btnArray[i].duplicates[j].tempBtn[k].cx.animVal.value * offsetX);
							this.btnData.btnArray[i].duplicates[j].tempBtn[k].setAttribute('cy', this.btnData.btnArray[i].duplicates[j].tempBtn[k].cy.animVal.value * offsetY);

							this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('x1', this.btnData.btnArray[i].duplicates[j].x.animVal.value + this.btnData.btnArray[i].clientWidth / 2);
							this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('x2', this.btnData.btnArray[i].duplicates[j].tempBtn[k].cx.animVal.value);
							this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('y1', this.btnData.btnArray[i].duplicates[j].y.animVal.value + this.btnData.btnArray[i].clientHeight / 2);
							this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('y2', this.btnData.btnArray[i].duplicates[j].tempBtn[k].cy.animVal.value);
						}
					}

				}
			}
		});

		window.oncontextmenu = this.showContextMenu.bind(this);
		

		this.htmlElement.addEventListener("dblclick", e => {
			this.visibleButtons(!this.visibleBtn);
		});

		window.addEventListener("mousedown", e => {
			this.onMouseDown(e);
		});

		this.htmlImage.addEventListener("dragstart", e => {
			e.preventDefault()
		});

		window.addEventListener("mouseup", e => {
			this.onMouseUp(e);
		});

		window.addEventListener("mousemove", e => {
			this.onMouseMove(e);
		});

		this.refreshList();
		this.refreshTable();

		//this.linkObject(); 
		//this.htmlElement.style.display.o // NIKOLAYS
		
	}

	saveWorkToDatabase() {
		let object = {};
		Object.keys(this.saveData).forEach(key => {
			object[key] = this.saveData[key];
			for (let i = 0; i < object[key].buttons.length; i++) {
				let btn = {};
				let fromBtn = this.saveData[key].buttons[i];
				btn.pos = {};
				btn.pos.x = fromBtn.attributes.x.value;
				btn.pos.y = fromBtn.attributes.y.value;
				btn.pos.rx = fromBtn.attributes.rx.value;
				btn.pos.ry = fromBtn.attributes.ry.value;
				btn.styles = fromBtn.styles;
				btn.obj = fromBtn.obj;
				btn.id = fromBtn.id;

				btn.tempBtn = [];

				for (let j = 0; j < fromBtn.tempBtn.length; j++) {
					let pointer = fromBtn.tempBtn[j];
					btn.tempBtn[j] = {};
					btn.tempBtn[j].pos = {}
					if (fromBtn.tempBtn[j].attributes["fill-opacity"]) btn.tempBtn[j].pos.opacity = fromBtn.tempBtn[j].attributes["fill-opacity"].value;
					btn.tempBtn[j].pos.x = fromBtn.tempBtn[j].attributes.cx.value;
					btn.tempBtn[j].pos.y = fromBtn.tempBtn[j].attributes.cy.value;
				}

				btn.duplicates = [];

				for (let j = 0; j < fromBtn.duplicates.length; j++) {
					let btnDup = {};
					let fromBtn = this.saveData[key].buttons[i].duplicates[j];
					btnDup.pos = {};
					btnDup.pos.x = fromBtn.attributes.x.value;
					btnDup.pos.y = fromBtn.attributes.y.value;
					btnDup.pos.rx = fromBtn.attributes.rx.value;
					btnDup.pos.ry = fromBtn.attributes.ry.value;
					btnDup.styles = fromBtn.styles;
					//btn.obj = fromBtn.obj;
					btnDup.id = fromBtn.id;

					btnDup.tempBtn = [];

					for (let k = 0; k < fromBtn.tempBtn.length; k++) {
						let pointer = fromBtn.tempBtn[k];
						btnDup.tempBtn[k] = {};
						btnDup.tempBtn[k].pos = {}
						if (fromBtn.tempBtn[k].attributes["fill-opacity"]) btnDup.tempBtn[k].pos.opacity = fromBtn.tempBtn[k].attributes["fill-opacity"].value;
						btnDup.tempBtn[k].pos.x = fromBtn.tempBtn[k].attributes.cx.value;
						btnDup.tempBtn[k].pos.y = fromBtn.tempBtn[k].attributes.cy.value;
					}

					btn.duplicates.push(btnDup);

				}

				object[key].buttons[i] = btn;

			}
		});
		console.log(object);


	}

	showStats() {
		let object = this.saveData;
		console.log(object);
	}

	showProps(tar) {
		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "700px";
		dialog.dialogContent.style.height = "700px";
		const layout = new widgetsComponentsTypes["layoutVertical"];
		layout.htmlElement.style.width = "100%";
		layout.htmlElement.style.height = "100%";
		dialog.includeWidget(layout);
		let boom = tar;
		if (boom.additional) boom = boom.object;
		Object.keys(boom).forEach(key => {
			if (key != "Composition") {
				const label = new widgetsComponentsTypes["label"];
				layout.includeWidget(label);
				label.htmlElement.style.width = "100%";
				label.htmlElement.style.minHeight = "50px";


				label.text = "Ключ: " + key + "				Значение: " + boom[key].value;
			}

		});

		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
	}


	refreshList(no = false) {
		if (this.list != "") {
			for (let i = 0; i < this.list.children.length; i++) this.deleteElement(this.list.children[i]);
			this.deleteElement(this.list.id);

		}
		if (!no) {
			const laylay = new widgetsComponentsTypes["layoutVertical"];
			this.viewLay.includeWidget(laylay);
			laylay.htmlElement.style.width = "85%";
			laylay.htmlElement.style.top = "";
			laylay.htmlElement.style.marginTop = "1%";
			laylay.htmlElement.style.left = "";
			laylay.htmlElement.style.right = "0px";
			laylay.htmlElement.backgroundColor = "aliceblue";
			laylay.htmlElement.style.bottom = "0px";
			laylay.htmlElement.style.maxHeight = "13%";
			const laygr = new widgetsComponentsTypes["layoutHorizontal"];
			laylay.includeWidget(laygr);
			laygr.htmlElement.style.width = "100%";
			laygr.htmlElement.style.height = "3%";
			this.list = laylay;
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				let lab = new widgetsComponentsTypes["label"];
				lab.htmlElement.style.minWidth = "30px";
				lab.htmlElement.style.height = "25px";
				lab.htmlElement.style.display = "contents";
				lab.htmlElement.childNodes[0].style.display = "contents";
				lab.htmlElement.childNodes[0].style.fontSize = "20px";
				laygr.includeWidget(lab);
				lab.text = this.btnData.btnArray[i].dataText + '    ';
			}
		} else {

		}
	}

	deleteElement(id = null) {
		let res = false;
		const component = ReactComponent[id];
		delete ReactComponent[id];
		if (component && component.htmlElement) {
			component.htmlElement.remove();
			res = true;
		}
		return res;
	}

	toggleEditMode() {

		this.editMode = !this.editMode;
		if (!this.editMode) {
			this.deleteElement(this.editModeButton);
		}
		else {
			const widget = new widgetsComponentsTypes["button"];
			this.includeWidget(widget);
			this.editModeButton = widget.id;
			widget.htmlElement.style.zIndex = 950;
			widget.htmlElement.style.left = "";
			widget.htmlElement.style.right = "0px";
			widget.htmlElement.style.backgroundColor = "red";
			widget.htmlElement.style.width = "20%";
			widget.text = "Выключить режим редактирования";
			widget.fontSize = 20;

			widget.htmlElement.addEventListener("click", e => {
				this.toggleEditMode();
				this.saveData[this.name] = {};
				this.saveData[this.name].buttons = this.btnData.btnArray;

			});
		}
	}

	setImage() {

		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "700px";
		dialog.dialogContent.style.height = "300px";
		const input = new widgetsComponentsTypes["input"];
		dialog.includeWidget(input);
		input.headerElement.textContent = "Вставьте URL изображения";
		input.headerElement.style.fontSize = "15px";

		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
		dialog.addDialogButton("Сохранить", () => { 
			this.imageData = input.inputElement.value;
			this.deleteElement(dialog.id);
		});
	}

	addButton() {

		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "700px";
		dialog.dialogContent.style.height = "300px";
		const input = new widgetsComponentsTypes["input"];
		dialog.includeWidget(input);
		input.headerElement.textContent = "Введите имя кнопки";
		input.headerElement.style.fontSize = "15px";

		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
		dialog.addDialogButton("Создать с именем", () => {
			this.createBtn(input.inputElement.value);
			this.deleteElement(dialog.id);
			this.linkButtonObj(true);
		});
		dialog.addDialogButton("Создать с номером", () => {
			this.createBtn("");
			this.deleteElement(dialog.id);
			this.linkButtonObj(true);
		});
	}

	saveSize(size) {//=-= переделать
		this.position = size;
		console.log(size);
	}

	deleteButton(event = null, check) {
		if (!this.target.dupp && check) {
			check = false;
			const dialog = new widgetsComponentsTypes["dialog"];
			dialog.dialogContent.style.width = "400px";
			dialog.dialogContent.style.height = "150px";
			const label = new widgetsComponentsTypes["label"];
			dialog.includeWidget(label);
			label.text = "Вы уверены? Удалятся дубликаты этого указателя. Количество: " + this.target.duplicates.length;
			label.htmlElement.style.width = "100%";
			dialog.addDialogButton("Нет", () => { this.deleteElement(dialog.id); });
			dialog.addDialogButton("Да", () => {
				this.deleteButton(null, false);
				this.deleteElement(dialog.id);
			});
			return;
		}
		if (check) {
			const dialog = new widgetsComponentsTypes["dialog"];
			dialog.dialogContent.style.width = "400px";
			dialog.dialogContent.style.height = "80px";
			dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
			dialog.addDialogButton("Удалить все", () => {
				this.target = this.target.orig;
				this.deleteButton(null, true);
				this.deleteElement(dialog.id);
			});
			dialog.addDialogButton("Удалить одну", () => {
				this.deleteButton(null, false);
				this.deleteElement(dialog.id);
			});
			return;
		}

		this.deletePointers();
		if (this.target.dupp) {
			let index2 = this.btnData.btnArray[this.target.value - 1].duplicates.map(function (e) { return e.id; }).indexOf(this.target.id);
			this.btnData.btnArray[this.target.value - 1].duplicates.splice(index2, 1);

		}

		this.deleteElement(this.target.treeItem.id);

		if (!this.target.dupp) {
			let index = this.btnData.btnArray.map(function (e) { return e.id; }).indexOf(this.target.id);
			//this.btnData.btnArray[index] = "deleted";

			if (this.target.duplicates) if (this.target.duplicates.length > 0) {
				for (let k = 0; k < this.target.duplicates.length; k++) {
					this.deletePointers(this.target.duplicates[k]);
					this.target.duplicates[k].parentNode.removeChild(this.target.duplicates[k].textElement);
					this.target.duplicates[k].parentNode.removeChild(this.target.duplicates[k]);
				}
			}
			this.btnData.btnArray.splice(index, 1);
			this.refreshTable(0);
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				let btn = this.btnData.btnArray[i];
				let num = i + 1;

				btn.innerText = num;
				btn.value = num;
				btn.dataText = num + ' ' + btn.dataText.split(' ')[1];
				this.btnData[num] = btn.dataText;
				ReactComponent[btn.treeItem.id].text = btn.dataText;
				btn.textElement.textContent = num;
				if (btn.duplicates.length > 0) {
					for (let j = 0; j < this.btnData.btnArray[i].duplicates.length; j++) {
						let btn2 = this.btnData.btnArray[i].duplicates[j];
						let num = i + 1;
						btn2.innerText = num;
						btn2.value = num;
						const id = "" + this.id + "#btn_" + num;
						btn.setAttribute("id", id);
						btn2.dataText = num + ' ' + btn2.dataText.split(' ')[1];
						this.btnData[num] = btn2.dataText;
						//ReactComponent[btn2.treeItem].text = btn2.dataText;
						btn2.textElement.textContent = num;
					}
				}
			}


		} else {
			let btn = this.target.orig;
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				if (btn.duplicates.length > 0) {
					for (let j = 0; j < this.btnData.btnArray[i].duplicates.length; j++) {
						let btn = this.btnData.btnArray[i].duplicates[j];
						let num = i + 1;

						btn.innerText = num;
						btn.value = num;
						btn.dataText = num + ' ' + btn.dataText.split(' ')[1];
						this.btnData[num] = btn.dataText;
						//ReactComponent[btn.treeItem].text = btn.dataText;
						btn.textElement.textContent = num;
					}
				}
			}
		}

		this.target.parentNode.removeChild(this.target.textElement);
		this.target.parentNode.removeChild(this.target);
		this.refreshList();
		this.refreshTable();
		//=-= удаление из массива
	}

	deletePointers(btn = this.target) {
		for (let i = 0; i < btn.tempBtn.length; i++) {
			let l = btn.tempBtn[i].currentLine;
			if (l.parentNode) l.parentNode.removeChild(l);
			if (btn.tempBtn[i].parentNode) btn.tempBtn[i].parentNode.removeChild(btn.tempBtn[i]);
		}
		btn.tempBtn = [];
	}

	setNumPointers(btn, num) {
		for (let i = 0; i < num; i++) {

			let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
			this.svg.appendChild(line);


			let lowBtn = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
			lowBtn.classList.add("lowCircleImage");
			lowBtn.classList.add("Unselectable");
			lowBtn.mouse = { move: false };
			lowBtn.setAttribute('cx', 200 + 6 * i);
			lowBtn.setAttribute('cy', 200 + 3 * i);
			lowBtn.setAttribute('r', 5);
			lowBtn.setAttribute("stroke-width", '2');
			lowBtn.setAttribute('stroke', "black");
			lowBtn.setAttribute('fill-opacity', btn.styles.fillOpacity);
			this.svg.appendChild(lowBtn);


			line.id = 'LineId_' + num;
			line.setAttribute("x1", '30');
			line.setAttribute("y1", '30');
			line.setAttribute("x2", 200 + 6 * i + '');
			line.setAttribute("y2", 200 + 3 * i + '');
			line.setAttribute("stroke", 'black');
			line.setAttribute("stroke-width", '1');
			line.ofsX1 = 30;
			line.ofsY1 = 30;
			line.ofsX2 = 200 + 6 * i;
			line.ofsY2 = 200 + 3 * i;
			line.style.cursor = 'pointer';
			line.style.stroke = 'black';
			line.style.strokeWidth = 1;

			lowBtn.currentLine = line;
			lowBtn.setAttribute('fill', btn.styles.fill.value)
			btn.tempBtn.push(lowBtn);
			line.mouse = { move: false };





			lowBtn.addEventListener("dblclick", e => {
				e.preventDefault();
				console.log(e, btn.dataText);
			});

			lowBtn.addEventListener("contextmenu", e => {
				e.preventDefault();

			});

			line = btn.tempBtn[i].currentLine;
			line.setAttribute("x1", btn.x.animVal.value + btn.clientHeight / 2 + '');
			line.setAttribute("y1", btn.y.animVal.value + btn.clientHeight / 2 + '');
			line.ofsX1 = btn.x.animVal.value + btn.clientWidth / 2 + '';
			line.ofsY1 = btn.y.animVal.value + btn.clientHeight / 2 + '';

			if (btn.style.display == "none") {

				line.setAttribute("x1", btn.x.animVal.value + '');
				line.setAttribute("y1", btn.y.animVal.value + btn.clientHeight / 2 + '');
			}

			this.svg.appendChild(line);

		}

		let index = this.btnData.btnArray.map(function (e) { return e.id; }).indexOf(btn.id);

		let btnNew = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		btnNew.setAttribute('x', btn.x.animVal.value);
		btnNew.setAttribute('y', btn.y.animVal.value);
		btnNew.setAttribute('rx', btn.x.animVal.value * 2);
		btnNew.setAttribute('ry', btn.y.animVal.value * 2);
		btnNew.setAttribute('fill', btn.styles.fill.value);
		btnNew.setAttribute('stroke', "black");
		btnNew.setAttribute('stroke-width', 2);

		btnNew.dupp = btn.dupp;
		if (btnNew.dupp) {
			btnNew.orig = btn.orig;
			btnNew.setAttribute('fill', "gray");
		}
		btnNew.classList.add("circleImage");
		btnNew.classList.add("Unselectable");
		btnNew.mouse = { move: false };
		this.svg.appendChild(btnNew);

		if (index > -1) this.btnData.btnArray[index] = btnNew;
		else {
			let ind = -1;
			for (let k = 0; k < this.btnData.btnArray.length; k++) {
				index = this.btnData.btnArray[k].duplicates.map(function (e) { return e.id; }).indexOf(btn.id);
				ind = k;
				if (index != -1) break;
			}
			this.btnData.btnArray[ind].duplicates[index] = btnNew;
		}
		num = btn.value;
		const id = btn.id;
		btnNew.setAttribute("id", id);
		btnNew.innerText = num;
		btnNew.value = num;
		btnNew.dataText = btn.dataText;
		btnNew.duplicates = btn.duplicates;
		btnNew.treeItem = btn.treeItem;
		btn.treeItem.btn.push(btnNew);
		btnNew.style.fontSize = "14px";
		this.btnData[num] = btnNew.dataText;
		btnNew.tempBtn = btn.tempBtn;
		btnNew.styles = btn.styles;

		btnNew.style.height = btnNew.styles.height;
		btnNew.setAttribute('rx', btnNew.styles.r);
		btnNew.setAttribute('ry', btnNew.styles.r);
		btnNew.setAttribute('fill', btnNew.styles.fill)




		let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		textElement.btn = btnNew;
		textElement.style.userSelect = "none";
		textElement.textContent = btnNew.value;
		textElement.style.fontWeight = "bold";
		textElement.style.fontSize = "20px";
		btnNew.textElement = textElement;
		btnNew.textElement.setAttribute("x", btn.x.animVal.value + 30 - 8);
		btnNew.textElement.setAttribute("y", btn.y.animVal.value + 30 + 6);
		if (btn.style.display == "none") {
			btnNew.style.width = btnNew.styles.height.substring(0, btnNew.style.height.length - 2) * 2 + 'px';
			btnNew.style.display = "none";
			btnNew.textElement.textContent = btn.textElement.textContent;
			btnNew.textElement.setAttribute('text-decoration', "underline");
		} else btnNew.style.width = btnNew.styles.height.substring(0, btnNew.style.height.length - 2) + 'px';
		// if (btnNew.attributes.rx.value == "0") {
		// 	btnNew.textElement.textContent = btnNew.dataText;
		// 	btnNew.textElement.setAttribute("x", btn.x.animVal.value + btn.clientWidth / 2 - 8 - (textElement.textContent.length - 1) * 5);
		// }



		this.svg.appendChild(textElement);
		btnNew.textElement.style.fontSize = btnNew.styles.font;



		if (btn.textElement) btn.textElement.parentNode.removeChild(btn.textElement);
		btn.parentNode.removeChild(btn);

		btnNew.addEventListener("dblclick", e => {
			e.preventDefault();
			console.log(e, btn.dataText);
		});
		btnNew.addEventListener("contextmenu", e => {
			e.preventDefault();

		});

		btnNew.addEventListener("mouseover", e => {
			btnNew.treeItem.htmlElement.style.backgroundColor = "red";
			for (let i = 0; i < btnNew.treeItem.btn.length; i++) {
				btnNew.treeItem.btn[i].setAttribute('fill', 'red');
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btnNew.value - 1].style.background = "red";
		});

		btnNew.addEventListener("mouseout", e => {
			btnNew.treeItem.htmlElement.style.backgroundColor = "";
			for (let i = 0; i < btnNew.treeItem.btn.length; i++) {
				btnNew.treeItem.btn[i].setAttribute('fill', btnNew.styles.fill);
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btnNew.value - 1].style.background = "";
		});

		textElement.addEventListener("mouseover", e => {
			textElement.btn.treeItem.htmlElement.style.backgroundColor = "red";
			for (let i = 0; i < textElement.btn.treeItem.btn.length; i++) {
				textElement.btn.treeItem.btn[i].setAttribute('fill', 'red');
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[textElement.btn.value - 1].style.background = "red";
		});

		textElement.addEventListener("mouseout", e => {
			textElement.btn.treeItem.htmlElement.style.backgroundColor = "";
			for (let i = 0; i < textElement.btn.treeItem.btn.length; i++) {
				textElement.btn.treeItem.btn[i].setAttribute('fill', textElement.btn.styles.fill);
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[textElement.btn.value - 1].style.background = "";
		});

		this.refreshTable();


	}

	renameImage(value) {

		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "700px";
		dialog.dialogContent.style.height = "300px";
		const input = new widgetsComponentsTypes["input"];
		dialog.includeWidget(input);
		input.inputElement.value = this.name;
		input.headerElement.textContent = "Введите имя изображения";
		input.headerElement.style.fontSize = "15px";

		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
		dialog.addDialogButton("Сохранить", () => {
			ReactComponent[this.nameLabel].onSetText(input.inputElement.value);
			this.name = input.inputElement.value;
			this.deleteElement(dialog.id);
		});
	}

	linkButtonObj(check = false) {
		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "700px";
		dialog.dialogContent.style.height = "700px";
		const layout = new widgetsComponentsTypes["layoutVertical"];
		layout.htmlElement.style.width = "100%";
		layout.htmlElement.style.height = "100%";
		layout.htmlElement.style.overflow = "hidden";
		dialog.includeWidget(layout);
		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });

		if (check) this.target = this.btnData.btnArray[this.btnData.btnArray.length - 1];

		for (let i = 0; i < this.currentLayerObject.Comp.length; i++) {

			const main = new widgetsComponentsTypes["button"];
			layout.includeWidget(main);
			main.text = this.name;
			main.htmlElement.style.margin = "5px";
			main.htmlElement.style.backgroundColor = "green";
			main.htmlElement.style.width = "100%";
			main.htmlElement.style.maxHeight = "50px";
			main.text = this.currentLayerObject.Comp[i].meta.name;
			main.htmlElement.addEventListener("click", e => {
				this.target.obj = this.currentLayerObject.Comp[i];
				this.deleteElement(dialog.id);
				this.refreshTable(0);
			});
		}

		const newobj = new widgetsComponentsTypes["button"];
		layout.includeWidget(newobj);
		newobj.text = this.name;
		newobj.htmlElement.style.margin = "5px";
		newobj.htmlElement.style.backgroundColor = "black";
		newobj.htmlElement.style.width = "100%";
		newobj.htmlElement.style.maxHeight = "50px";
		newobj.text = "Создать новый объект"
		newobj.htmlElement.addEventListener("click", e => {
			this.deleteElement(dialog.id);
			this.refreshTable(0);
			const dialog2 = new widgetsComponentsTypes["dialog"];
			dialog2.dialogContent.style.width = "700px";
			dialog2.dialogContent.style.height = "700px";
			const layout = new widgetsComponentsTypes["layoutVertical"];
			layout.htmlElement.style.width = "100%";
			layout.htmlElement.style.height = "100%";
			dialog2.includeWidget(layout);
			dialog2.addDialogButton("Закрыть", () => { this.deleteElement(dialog2.id); });
		});

	}

	/*linkObject(value) { //=-= заргузка объекта NIKOLAYS old
		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "700px";
		dialog.dialogContent.style.height = "300px";
		const input = new widgetsComponentsTypes["input"];
		dialog.includeWidget(input);
		input.inputElement.value = "60c97ac9d4acdd755b5beea2";
		input.headerElement.textContent = "Введите id объекта";
		input.headerElement.style.fontSize = "15px";
		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
		dialog.addDialogButton("Загрузить", () => { this.loadLinkObject(dialog.id, input.inputElement.value); });
		dialog.addDialogButton("Создать новый объект", () => { this.createLinkObject(dialog.id); });
	}*/

	linkObject(value){ // NIKOLAYS new
		const dialog = new WidgetDialog();
		dialog.width = "700px";
		dialog.height = "300px";
		
		const content = new WidgetLayoutVertical();
		content.height = "400px";

		let valueID = undefined; 

		const otherTree = MainClassification.getAllClassificationTree("showList", (info) => {
			if(info && info.hasOwnProperty("id")){
				valueID = info.id;
				console.log("valueID", valueID)
			}
		});
		for (let id of Object.keys(otherTree)) {
            const layout2 = new WidgetLayoutHorizontal();
			layout2.width = "100%";
			layout2.includeWidget(otherTree[id]);
			content.includeWidget(layout2);
        }

		dialog.includeWidget(content);

		dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
		dialog.addDialogButton("Загрузить", () => { this.loadLinkObject(dialog.id, valueID); });
		dialog.addDialogButton("Создать новый объект", () => { 
			this.createLinkObject(dialog.id); 
		});

	}

	loadLinkObject(dialog, id, sub = false) {
		let load = function (resultJson) {
			ReactComponent["w_1"].currentLayerObject = resultJson.cursor.firstBatch[0].object;
			ReactComponent["w_1"].layerObjects[ReactComponent["w_1"].name] = resultJson.cursor.firstBatch[0].object;
			if (resultJson.cursor.firstBatch[0].object["Composition"].length > 0) {
				ReactComponent["w_1"].currentLayerObject.Comp = [];
				for (let i = 0; i < resultJson.cursor.firstBatch[0].object["Composition"].length; i++) {
					const filer = '{"_id": {"$oid": "' + resultJson.cursor.firstBatch[0].object["Composition"][i].id + '"}}';
					APP.dbWorker.responseDOLMongoRequest = subLoad;
					APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", filer, false);
				}
			}
			// const dialog = new widgetsComponentsTypes["dialog"];
			// dialog.dialogContent.style.width = "700px";
			// dialog.dialogContent.style.height = "900px";
			// const label = new widgetsComponentsTypes["label"];
			// dialog.includeWidget(input);
			// label.inputElement.value = this.name;
			// label.headerElement.textContent = "Введите id объекта";
			// label.headerElement.style.fontSize = "15px";
			// dialog.addDialogButton("Закрыть", () => {this.deleteElement(dialog.id);});
			// dialog.addDialogButton("Загрузить", () => {this.loadLinkObject(dialog.id, input.inputElement.value);});
			// dialog.addDialogButton("Создать новый объект", () => {this.createLinkObject(dialog.id);});
		}
		let subLoad = function (resultJson) {
			ReactComponent["w_1"].currentLayerObject.Comp.push(resultJson.cursor.firstBatch[0]);
		}
		const filer = '{"_id": {"$oid": "' + id + '"}}';
		APP.dbWorker.responseDOLMongoRequest = load;
		APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", filer, false);
		if (dialog) this.deleteElement(dialog);
	}

	createLinkObject(dialog) { // NIKOLAYS 
		//
		this.deleteElement(dialog);
		window.oncontextmenu = undefined;
		this.htmlImage.oncontextmenu = undefined;

		this._savedCallbackCreateObject = MainClassificator._callbackCreateObject;

		const editor = new PatternEditorSystem(this);
		MainClassificator._callbackCreateObject = (object) => {
			this.projectObject.callbackCreateObject(object);
			this.callbackCreateObject(object);
		}
		editor.drawFormObjectsWithPatterns();
	}

	callbackCreateObject(args){ // NIKOLAYS
		console.log("callbackCreateObject",args);
		MainClassificator._callbackCreateObject = this._savedCallbackCreateObject;
		window.oncontextmenu = this.showContextMenu.bind(this);
		this.htmlImage.oncontextmenu = this.showContextMenu.bind(this);
	}
	cancelCreateObject(){
		MainClassificator._callbackCreateObject = this._savedCallbackCreateObject;

		window.oncontextmenu = this.showContextMenu.bind(this);
		this.htmlImage.oncontextmenu = this.showContextMenu.bind(this);

	}

	refreshTable(props) {
		if (ReactComponent[this.table]) {
			let table = ReactComponent[this.table];
			let arr = [[["№"], ["Имя"], ["Кол-во"], ["Объект"]]];
			if (props) arr[0] = arr[0].concat(props);
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				let count = this.btnData.btnArray[i].tempBtn.length;
				for (let j = 0; j < this.btnData.btnArray[i].duplicates.length; j++) {
					count += this.btnData.btnArray[i].duplicates[j].tempBtn.length;
				}
				let name = this.btnData[i + 1];
				if (this.btnData.btnArray[i].obj) name = this.btnData.btnArray[i].obj.meta.name;
				if (count > 0) arr.push([[i + 1], [name], [count], ["object"]]);
				// for (let j = 0; j < arr[0].length - 4; j++) {
				// 	if ((count > 0) && (this.btnData.btnArray.object[props[j]])) arr[i].push([this.btnData.btnArray.object[props[j]]]);
				// }
			}

			table.data = arr;
		}
	}

	exampleButton(lay) {
		lay.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		lay.svg.classList.add("smartSvg");
		lay.htmlElement.appendChild(lay.svg);
		lay.svg.style.width = "100%";
		lay.svg.style.position = "relative";
		this.exPointers = [];

		let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		lay.svg.appendChild(line);

		//asdf <- top comment!!!
		let lowBtn2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		lowBtn2.classList.add("lowCircleImage");
		lowBtn2.classList.add("Unselectable");
		lowBtn2.mouse = { move: false };
		lowBtn2.setAttribute('cx', 400);
		lowBtn2.setAttribute('cy', 122);
		lowBtn2.setAttribute('r', 5);
		lowBtn2.setAttribute('stroke', "black");
		lowBtn2.setAttribute('stroke-width', 2);
		lowBtn2.style.display = "none";
		lay.svg.appendChild(lowBtn2);
		this.exPointers.push(lowBtn2);

		lowBtn2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		lowBtn2.classList.add("lowCircleImage");
		lowBtn2.classList.add("Unselectable");
		lowBtn2.mouse = { move: false };
		lowBtn2.setAttribute('cx', 400);
		lowBtn2.setAttribute('cy', 42);
		lowBtn2.setAttribute('r', 5);
		lowBtn2.setAttribute('stroke', "black");
		lowBtn2.setAttribute('stroke-width', 2);
		lowBtn2.style.display = "none";
		lay.htmlElement.appendChild(lowBtn2);
		this.exPointers.push(lowBtn2);


		lay.svg.appendChild(lowBtn2);
		this.exPointers.push(lowBtn2);

		let line2 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		line2.style.position = "absolute";
		line2.id = "example#2"
		line2.setAttribute("x1", '165');
		line2.setAttribute("y1", '82');
		line2.setAttribute("x2", '400');
		line2.setAttribute("y2", '122');
		line2.ofsX1 = 165;
		line2.ofsY1 = 82;
		line2.ofsX2 = 400;
		line2.ofsY2 = 122;
		line2.style.cursor = 'pointer';
		line2.style.stroke = 'black';
		line2.style.strokeWidth = 1;
		lay.svg.appendChild(line2);
		lowBtn2.currentline2 = line2;
		line2.mouse = { move: false };
		line2.style.display = "none";
		this.exPointers.push(line2);

		line2 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		line2.style.position = "absolute";
		line2.id = "example#2"
		line2.setAttribute("x1", '165');
		line2.setAttribute("y1", '82');
		line2.setAttribute("x2", '400');
		line2.setAttribute("y2", '42');
		line2.ofsX1 = 165;
		line2.ofsY1 = 82;
		line2.ofsX2 = 400;
		line2.ofsY2 = 42;
		line2.style.cursor = 'pointer';
		line2.style.stroke = 'black';
		line2.style.strokeWidth = 1;
		lay.svg.appendChild(line2);
		lowBtn2.currentline2 = line2;
		line2.mouse = { move: false };
		line2.style.display = "none";
		this.exPointers.push(line2);
		//asdf

		let btn = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		btn.setAttribute('x', 134);
		btn.setAttribute('y', 51);
		btn.setAttribute('rx', btn.x.animVal.value * 2);
		btn.setAttribute('ry', btn.y.animVal.value * 2);
		btn.setAttribute('fill', "white");
		btn.setAttribute('stroke', "black");
		btn.setAttribute('stroke-width', 2);

		lay.svg.appendChild(line);

		btn.classList.add("circleImage");
		btn.classList.add("Unselectable");
		btn.mouse = { move: false };
		lay.svg.appendChild(btn);

		let lowBtn = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		lowBtn.classList.add("lowCircleImage");
		lowBtn.classList.add("Unselectable");
		lowBtn.mouse = { move: false };
		lowBtn.setAttribute('cx', 382);
		lowBtn.setAttribute('cy', 82);
		lowBtn.setAttribute('r', 5);
		lowBtn.setAttribute('stroke', "black");
		lowBtn.setAttribute('stroke-width', 2);
		lowBtn.setAttribute('fill-opacity', 1);
		lay.svg.appendChild(lowBtn);

		let num = 1;
		const id = "example#1";
		btn.setAttribute("id", id);
		btn.innerText = num;
		btn.num = num;
		btn.value = "Name";
		btn.style.borderRadius = "50%";

		line.style.position = "absolute";
		line.id = "example#2"
		line.setAttribute("x1", '165');
		line.setAttribute("y1", '82');
		line.setAttribute("x2", '382');
		line.setAttribute("y2", '82');
		line.ofsX1 = 165;
		line.ofsY1 = 82;
		line.ofsX2 = 382;
		line.ofsY2 = 82;
		line.style.cursor = 'pointer';
		line.style.stroke = 'black';
		line.style.strokeWidth = 1;


		lowBtn.currentLine = line;
		btn.tempBtn = [];
		btn.tempBtn.push(lowBtn);
		line.mouse = { move: false };

		let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		textElement.style.userSelect = "none";
		textElement.setAttribute("x", btn.x.animVal.value + btn.clientWidth / 2 - 8);
		textElement.setAttribute("y", btn.y.animVal.value + btn.clientHeight / 2 + 6);
		textElement.textContent = "1";
		textElement.style.fontWeight = "bold";
		textElement.style.fontSize = "20px";
		btn.textElement = textElement;
		lay.svg.appendChild(textElement);

		return [btn, lowBtn, line];
	}

	drawProps(btn) {
		if (btn.style.borderRadius == "50%") {

		} else {

		}
	}

	setColor(value, id, one) {
		if (one) this.target.setAttribute('fill', value);
		else for (let i = 0; i < this.btnData.btnArray.length; i++) {
			this.btnData.btnArray[i].setAttribute('fill', value);
			for (let j = 0; j < this.btnData.btnArray[i].duplicates.length; j++) this.btnData.btnArray[i].duplicates[j].setAttribute('fill', value);
		}
		this.deleteElement(id);
	}

	buttonChooseEdit(value) {//=-= отладка
		const dialog = new widgetsComponentsTypes["dialog"];
		dialog.dialogContent.style.width = "500px";
		dialog.dialogContent.style.height = "650px";

		const mainLayout = new widgetsComponentsTypes["layoutVertical"];
		dialog.includeWidget(mainLayout);
		mainLayout.htmlElement.style.width = "100%";
		mainLayout.htmlElement.style.height = "100%";

		const exampleLayout = new widgetsComponentsTypes["layoutHorizontal"];
		mainLayout.includeWidget(exampleLayout);
		exampleLayout.htmlElement.style.width = "100%";
		exampleLayout.htmlElement.style.maxHeight = "25%";
		exampleLayout.htmlElement.style.overflow = "hidden";
		exampleLayout.htmlElement.style.border = "solid";

		let example = this.exampleButton(exampleLayout);

		const big = new widgetsComponentsTypes["label"];
		mainLayout.includeWidget(big);
		big.text = "Поинтер";
		big.htmlElement.childNodes[0].style.fontSize = "19px";
		big.htmlElement.style.marginTop = "10px";
		big.htmlElement.style.maxHeight = "15px";
		big.htmlElement.style.width = "100%";

		const bigButtLayout = new widgetsComponentsTypes["layoutVertical"];
		mainLayout.includeWidget(bigButtLayout);
		bigButtLayout.htmlElement.classList.add("editLayout");
		bigButtLayout.htmlElement.style.maxHeight = "33%";
		bigButtLayout.htmlElement.style.marginTop = "5px";

		const bigButtLayoutForm = new widgetsComponentsTypes["layoutHorizontal"];
		bigButtLayout.includeWidget(bigButtLayoutForm);
		bigButtLayoutForm.htmlElement.style.width = "100%";
		const bigButtLayoutFormLabel = new widgetsComponentsTypes["label"];
		bigButtLayoutForm.includeWidget(bigButtLayoutFormLabel);
		bigButtLayoutFormLabel.htmlElement.style.maxWidth = "50px";
		bigButtLayoutFormLabel.htmlElement.style.marginLeft = "10px";
		bigButtLayoutFormLabel.text = "Круг:";

		let btn = document.createElement("div");
		btn.classList.add("circleImage");
		btn.classList.add("Unselectable");
		btn.mouse = { move: false };
		btn.style.position = "relative";
		btn.style.maxHeight = "40px";
		btn.style.maxWidth = "40px";
		btn.style.marginLeft = "80px";
		btn.style.marginTop = "10px";
		btn.innerText = "1";
		btn.style.lineHeight = "25px";
		bigButtLayoutForm.htmlElement.appendChild(btn);

		const bigButtLayoutNumberLabel2 = new widgetsComponentsTypes["label"];
		bigButtLayoutForm.includeWidget(bigButtLayoutNumberLabel2);
		bigButtLayoutNumberLabel2.htmlElement.style.maxWidth = "50px";
		bigButtLayoutNumberLabel2.htmlElement.style.marginLeft = "64px";
		bigButtLayoutNumberLabel2.text = "Список:"




		const withNumber2 = new widgetsComponentsTypes["checkBox"];
		bigButtLayoutForm.includeWidget(withNumber2);
		withNumber2.htmlElement.style.maxWidth = "40px";
		withNumber2.htmlElement.style.marginLeft = "60px";
		withNumber2.checked = true;


		const bigButtLayoutNumber = new widgetsComponentsTypes["layoutHorizontal"];
		bigButtLayout.includeWidget(bigButtLayoutNumber);

		const bigButtLayoutFormLabel2 = new widgetsComponentsTypes["label"];
		bigButtLayoutNumber.includeWidget(bigButtLayoutFormLabel2);
		bigButtLayoutFormLabel2.htmlElement.style.maxWidth = "50px";
		bigButtLayoutFormLabel2.htmlElement.style.marginLeft = "10px";
		bigButtLayoutFormLabel2.text = "Прямоугольник:";
		bigButtLayoutFormLabel2.htmlElement.childNodes[0].style.minWidth = "111px";

		let btn2 = document.createElement("div");
		btn2.classList.add("circleImage");
		btn2.classList.add("Unselectable");
		btn2.mouse = { move: false };
		btn2.style.position = "relative";
		btn2.style.maxHeight = "40px";
		btn2.style.maxWidth = "80px";
		btn2.style.marginLeft = "80px";
		btn2.style.marginTop = "10px";
		btn2.style.borderRadius = "0%";

		btn2.innerText = "1. Name";
		btn2.style.lineHeight = "25px";
		bigButtLayoutNumber.htmlElement.appendChild(btn2);
		btn2.addEventListener("mousedown", e => {
			example[0].style.borderRadius = "0%";
			example[0].setAttribute('rx', 0);
			example[0].setAttribute('ry', 0);
			bigButtLayoutNumberLabel.text = "С именем:"
			example[0].style.height = 60 + 'px';
			example[0].style.width = 60 * 2 + 'px';
			setSizeOwn.inputElement.value = 60;
			example[0].setAttribute('x', 165 - example[0].clientWidth / 2);
			example[0].setAttribute('y', 85 - example[0].clientHeight / 2);
			if (withNumber.checked) example[0].innerText = example[0].num + '. ' + example[0].value;//asd
			else example[0].innerText = example[0].value;
		});

		bigButtLayoutNumber.htmlElement.style.width = "100%";
		const bigButtLayoutNumberLabel = new widgetsComponentsTypes["label"];
		bigButtLayoutNumber.includeWidget(bigButtLayoutNumberLabel);
		bigButtLayoutNumberLabel.htmlElement.style.minWidth = "100px";
		bigButtLayoutNumberLabel.htmlElement.style.marginLeft = "10px";
		bigButtLayoutNumberLabel.text = "Процесс:"



		const withNumber = new widgetsComponentsTypes["checkBox"];
		bigButtLayoutNumber.includeWidget(withNumber);
		withNumber.htmlElement.style.maxWidth = "40px";
		withNumber.htmlElement.style.marginLeft = "25px";
		withNumber.checked = true;



		withNumber.htmlElement.addEventListener("click", e => {
			// if (withNumber.checked) {
			// 	withNumber.checked = false;
			// }
			// else {
			// 	withNumber.checked = true;
			// }

			// if (withNumber.checked) {
			// 	if (example[0].style.borderRadius == "0%")
			// 	example[0].textElement.textContent = example[0].num + ' ' + example[0].value;
			// 	else example[0].textElement.textContent = example[0].num;
			// }
			// else {
			// 	if (example[0].style.borderRadius == "0%")
			// 	example[0].textElement.textContent = example[0].num;
			// 	else example[0].textElement.textContent = example[0].num;
			// }
		});

		const setSizeOwn = new widgetsComponentsTypes["input"];
		setSizeOwn.htmlElement.style.maxWidth = "20%";

		btn.addEventListener("mousedown", e => {
			example[0].style.borderRadius = "50%";
			example[0].style.height = 60 + 'px';
			example[0].style.width = 60 + 'px';
			setSizeOwn.inputElement.value = 60;
			example[0].setAttribute('rx', example[0].clientWidth * 2);
			example[0].setAttribute('ry', example[0].clientHeight * 2);
			bigButtLayoutNumberLabel.text = "Список:"
			example[0].setAttribute('x', 165 - example[0].clientWidth / 2);
			example[0].setAttribute('y', 82 - example[0].clientHeight / 2);
			// example[0].style.lineHeight = "45px";
			// example[0].style.maxWidth = "60px";
			// example[0].style.width = "60px";
			// example[0].style.maxHeight = "60px";
			// example[0].style.height = "60px";
			// example[1].style.left = "315px";
			if (withNumber.checked) {
				if (example[0].style.borderRadius == "0%")
					example[0].textElement.textContent = example[0].num + example[0].value;
				else example[0].textElement.textContent = example[0].num;
			}
			else {
				if (example[0].style.borderRadius == "0%")
					example[0].textElement.textContent = example[0].num;
				else example[0].textElement.textContent = example[0].num;
			}
		});




		const bigButtLayoutSizeLabel = new widgetsComponentsTypes["label"];
		bigButtLayoutNumber.includeWidget(bigButtLayoutSizeLabel);
		bigButtLayoutSizeLabel.htmlElement.style.maxWidth = "50px";
		bigButtLayoutSizeLabel.htmlElement.style.marginLeft = "10px";
		bigButtLayoutSizeLabel.text = "Размер:"

		const bigButtLayoutColor = new widgetsComponentsTypes["layoutHorizontal"];

		setSizeOwn.inputElement.value = value.target.clientHeight;


		bigButtLayoutColor.includeWidget(bigButtLayoutSizeLabel);
		bigButtLayoutColor.includeWidget(setSizeOwn);

		setSizeOwn.inputElement.oninput = (e) => {
			if ((setSizeOwn.inputElement.value >= 20) && (setSizeOwn.inputElement.value <= 120)) {
				if (example[0].style.borderRadius == "0%") {
					example[0].style.height = setSizeOwn.inputElement.value + 'px';
					example[0].style.maxHeight = setSizeOwn.inputElement.value + 'px';
					example[0].style.width = setSizeOwn.inputElement.value * 2 + 'px';
					example[0].style.maxWidth = setSizeOwn.inputElement.value * 2 + 'px';
					example[0].style.lineHeight = setSizeOwn.inputElement.value - 15 + 'px';
					example[0].setAttribute('x', 165 - example[0].clientWidth / 2);
					example[0].setAttribute('y', 82 - example[0].clientHeight / 2);
					//example[1].style.left = 375 - (setSizeOwn.inputElement.value*2) + 'px';
				} else {
					// example[0].style.height = setSizeOwn.inputElement.value + 'px';
					// example[0].style.maxHeight = setSizeOwn.inputElement.value + 'px';
					// example[0].style.width = setSizeOwn.inputElement.value + 'px';
					// example[0].style.maxWidth = setSizeOwn.inputElement.value + 'px';
					// example[0].style.lineHeight = setSizeOwn.inputElement.value - 15 + 'px';
					// example[1].style.left = 375 - (setSizeOwn.inputElement.value) + 'px';
					example[0].style.width = setSizeOwn.inputElement.value + 'px';
					example[0].style.height = setSizeOwn.inputElement.value + 'px';
					example[0].setAttribute('x', 165 - example[0].clientWidth / 2);
					example[0].setAttribute('y', 82 - example[0].clientHeight / 2);
				}
			}
		}





		bigButtLayout.includeWidget(bigButtLayoutColor);
		bigButtLayoutColor.htmlElement.style.width = "100%";

		const bigButtLayoutFontLabel = new widgetsComponentsTypes["label"];
		bigButtLayoutColor.includeWidget(bigButtLayoutFontLabel);
		bigButtLayoutFontLabel.htmlElement.style.maxWidth = "60px";
		bigButtLayoutFontLabel.text = "Размер шрифта:"
		bigButtLayoutFontLabel.htmlElement.style.marginLeft = "30px";

		const setFontSize = new widgetsComponentsTypes["input"];
		setFontSize.htmlElement.style.maxWidth = "30%";
		bigButtLayoutColor.includeWidget(setFontSize);
		setFontSize.inputElement.value = example[0].textElement.style.fontSize.substring(0, example[0].textElement.style.fontSize.length - 2);
		setFontSize.inputElement.oninput = (e) => {
			if ((setFontSize.inputElement.value >= 15) && (setFontSize.inputElement.value <= 50)) example[0].textElement.style.fontSize = setFontSize.inputElement.value + 'px';
		}

		const setColor = new widgetsComponentsTypes["button"];
		bigButtLayoutColor.includeWidget(setColor);
		setColor.text = "Цвет";
		setColor.fontSize = 15;
		setColor.htmlElement.style.maxWidth = "80px";
		setColor.htmlElement.style.maxHeight = "40px";
		setColor.htmlElement.style.marginLeft = "50px";
		setColor.htmlElement.style.marginRight = "20px";
		setColor.htmlElement.style.backgroundColor = "aliceblue";
		setColor.htmlElement.childNodes[0].style.color = "black";
		setColor.htmlElement.style.marginTop = "5px";
		setColor.htmlElement.addEventListener("click", e => {

			const dialog = new widgetsComponentsTypes["dialog"];
			dialog.dialogContent.style.width = "700px";
			dialog.dialogContent.style.height = "300px";
			const input = new widgetsComponentsTypes["input"];
			input.inputElement.setAttribute('type', 'color');
			dialog.includeWidget(input);
			input.headerElement.textContent = "Выберите цвет";
			input.headerElement.style.fontSize = "15px";
			dialog.addDialogButton("Закрыть", () => { this.deleteElement(dialog.id); });
			dialog.addDialogButton("Сохранить", () => { this.setColor(input.inputElement.value, dialog.id); });

			mainLayout.includeWidget(smallButtLayout);
		});

		const small = new widgetsComponentsTypes["label"];
		mainLayout.includeWidget(small);
		small.text = "Поинт";
		small.htmlElement.childNodes[0].style.fontSize = "19px";
		small.htmlElement.style.marginTop = "10px";
		small.htmlElement.style.maxHeight = "15px";
		small.htmlElement.style.width = "100%";


		const smallButtLayout = new widgetsComponentsTypes["layoutVertical"];
		mainLayout.includeWidget(smallButtLayout);
		smallButtLayout.htmlElement.classList.add("editLayout");
		smallButtLayout.htmlElement.style.width = "100%";
		smallButtLayout.htmlElement.style.maxHeight = "29%";
		smallButtLayout.htmlElement.style.marginTop = "5px"
		//размер малой кнопки
		const smallButtSize = new widgetsComponentsTypes["layoutHorizontal"];
		smallButtSize.htmlElement.style.width = "100%";
		smallButtSize.htmlElement.style.marginTop = "10px";
		smallButtLayout.includeWidget(smallButtSize);
		const smallButtSizeLabel = new widgetsComponentsTypes["label"];
		smallButtSize.includeWidget(smallButtSizeLabel);
		smallButtSizeLabel.htmlElement.style.maxWidth = "50px";
		smallButtSizeLabel.text = "Тип:"

		const firstBtn = new widgetsComponentsTypes["button"];
		smallButtSize.includeWidget(firstBtn);
		firstBtn.htmlElement.style.backgroundColor = "bisque";
		firstBtn.text = "Прозрачный";
		firstBtn.htmlElement.style.maxWidth = "90px";
		firstBtn.htmlElement.style.maxHeight = "20px";
		firstBtn.htmlElement.style.marginTop = "15px";
		firstBtn.htmlElement.childNodes[0].style.color = "black";
		firstBtn.fontSize = 11;

		firstBtn.htmlElement.addEventListener("mousedown", e => {
			if (firstBtn.text == "Не прозрачный") {
				example[1].setAttribute('fill-opacity', "1");
				this.exPointers[0].setAttribute('fill-opacity', "1");
				this.exPointers[1].setAttribute('fill-opacity', "1");
				this.exPointers[2].setAttribute('fill-opacity', "1");
				this.exPointers[3].setAttribute('fill-opacity', "1");
				this.exPointers[4].setAttribute('fill-opacity', "1");
				firstBtn.text = "Прозрачный";
				console.log(example[1]);
			} else {
				example[1].setAttribute('fill-opacity', "0");
				this.exPointers[0].setAttribute('fill-opacity', "0");
				this.exPointers[1].setAttribute('fill-opacity', "0");
				this.exPointers[2].setAttribute('fill-opacity', "0");
				this.exPointers[3].setAttribute('fill-opacity', "0");
				this.exPointers[4].setAttribute('fill-opacity', "0");
				firstBtn.text = "Не прозрачный";
				console.log(example[1]);
			}
		});



		const smallButtPointer = new widgetsComponentsTypes["layoutHorizontal"];
		smallButtPointer.htmlElement.style.width = "100%";
		smallButtPointer.htmlElement.style.marginTop = "10px";
		smallButtLayout.includeWidget(smallButtPointer);

		if (this.target != "") {
			const smallButtPointerLabell = new widgetsComponentsTypes["label"];
			smallButtPointer.includeWidget(smallButtPointerLabell);
			smallButtPointerLabell.htmlElement.style.maxWidth = "80px";
			smallButtPointerLabell.htmlElement.childNodes[0].style.marginLeft = "10px";
			smallButtPointerLabell.htmlElement.childNodes[0].style.minWidth = "80px";
			smallButtPointerLabell.text = "Количество:"

			const inp = new widgetsComponentsTypes["input"];
			inp.inputElement.value = this.target.tempBtn.length;
			inp.htmlElement.style.maxWidth = "100px";
			inp.htmlElement.style.marginLeft = "30px";
			smallButtPointer.includeWidget(inp);
			if (this.target.tempBtn.length > 1) this.pointerAddDelete(true, exampleLayout);
			inp.inputElement.oninput = (e) => {
				this.cp = inp.inputElement.value;
				if (this.cp > 1) {
					this.pointerAddDelete(true, exampleLayout);
				} else {
					this.pointerAddDelete(false, exampleLayout);
				}
			};


		}

		dialog.addDialogButton("Закрыть", () => {
			this.deleteElement(dialog.id);
			this.target = "";
		});
		if (this.target == "") {
			dialog.addDialogButton("Сохранить", () => {
				this.buttonSaveEdit(false, example);
				this.target = "";
				this.deleteElement(dialog.id);
			});
		} else {
			dialog.addDialogButton("Сохранить", () => {
				this.buttonSaveEdit(true, example, this.cp);
				this.target = "";
				this.deleteElement(dialog.id);
				this.pointerAddDelete(false, exampleLayout);
			});
		}
	}

	duplicateButton(target, numm) { //=-= svg
		if (target.dupp) target = target.orig;


		let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		this.svg.appendChild(line);

		let btn = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		btn.setAttribute('x', 50);
		btn.setAttribute('y', 50);
		btn.setAttribute('rx', btn.x.animVal.value * 2);
		btn.setAttribute('ry', btn.y.animVal.value * 2);
		btn.setAttribute('fill', "gray");
		btn.setAttribute('stroke', "black");
		btn.setAttribute('stroke-width', 2);


		btn.classList.add("circleImage");
		btn.classList.add("Unselectable");
		btn.mouse = { move: false };
		this.svg.appendChild(btn);

		let lowBtn = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		lowBtn.classList.add("lowCircleImage");
		lowBtn.classList.add("Unselectable");
		lowBtn.mouse = { move: false };
		lowBtn.setAttribute('cx', 200);
		lowBtn.setAttribute('cy', 200);
		lowBtn.setAttribute('r', 5);
		lowBtn.setAttribute('stroke', 'black');
		lowBtn.setAttribute('stroke-width', 2);
		this.svg.appendChild(lowBtn);


		let num = target.value;
		const id = "" + this.id + "#btn_" + num + "dup" + (target.duplicates.length + 1);
		btn.setAttribute("id", id);
		btn.innerText = num;
		btn.dataText = target.dataText;
		btn.value = num;
		btn.dupp = true;
		btn.treeItem = target.treeItem;
		target.treeItem.btn.push(btn);
		btn.orig = target;
		//btn.dataText = num + ' ' + this.btnData.btnArray[target.value - 1].dataText.substring(2);
		btn.style.fontSize = "14px";
		//this.btnData[num] = btn.dataText;

		// if (this.btnData.btnArray[target.value - 1].dataText.substring(2) != "") {
		// 	//btn.innerText = this.btnData.btnArray[target.value - 1].dataText.substring(2);;
		// 	btn.style.borderRadius = "0%";
		// 	btn.style.display = "inline-table";
		// 	btn.style.lineHeight = "25px";
		// 	console.log(btn.style.width + ' ' + btn.style.height);
		// };


		line.id = 'LineId_' + num;
		line.setAttribute("x1", '30');
		line.setAttribute("y1", '30');
		line.setAttribute("x2", '200');
		line.setAttribute("y2", '200');
		line.ofsX1 = 30;
		line.ofsY1 = 30;
		line.ofsX2 = 200;
		line.ofsY2 = 200;
		line.style.cursor = 'pointer';
		line.style.stroke = 'black';
		line.style.strokeWidth = 1;

		lowBtn.currentLine = line;
		btn.tempBtn = [];
		btn.styles = target.styles;
		btn.tempBtn.push(lowBtn);
		line.mouse = { move: false };

		let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		textElement.btn = btn;
		textElement.style.userSelect = "none";
		textElement.setAttribute("x", btn.x.animVal.value + btn.clientWidth / 2 - 8);
		textElement.setAttribute("y", btn.y.animVal.value + btn.clientHeight / 2 + 6);
		textElement.textContent = btn.value;
		textElement.style.fontWeight = "bold";
		textElement.style.fontSize = "20px";
		btn.textElement = textElement;
		this.svg.appendChild(textElement);


		target.duplicates.push(btn);
		this.deletePointers(btn);
		this.setNumPointers(btn, numm);
		this.refreshTable();



		btn.addEventListener("dblclick", e => {
			e.preventDefault();
			console.log(e, btn.dataText);
		});

		lowBtn.addEventListener("dblclick", e => {
			e.preventDefault();
			console.log(e, btn.dataText);
		});

		btn.addEventListener("mouseover", e => {
			//e.target.setAttribute('fill', 'red');
			e.target.treeItem.htmlElement.style.backgroundColor = "red";
			for (let i = 0; i < e.target.treeItem.btn.length; i++) {
				e.target.treeItem.btn[i].setAttribute('fill', 'red');
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1].style.background = "red";
		});

		btn.addEventListener("mouseout", e => {
			//e.target.setAttribute('fill', e.target.styles.fill);
			e.target.treeItem.htmlElement.style.backgroundColor = "";
			for (let i = 0; i < e.target.treeItem.btn.length; i++) {
				e.target.treeItem.btn[i].setAttribute('fill', e.target.styles.fill);
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1].style.background = "";
		});

		textElement.addEventListener("mouseover", e => {
			e.target.btn.treeItem.htmlElement.style.backgroundColor = "red";
			for (let i = 0; i < e.target.btn.treeItem.btn.length; i++) {
				e.target.btn.treeItem.btn[i].setAttribute('fill', 'red');
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[e.target.btn.value - 1].style.background = "red";
		});

		textElement.addEventListener("mouseout", e => {
			e.target.btn.treeItem.htmlElement.style.backgroundColor = "";
			for (let i = 0; i < e.target.btn.treeItem.btn.length; i++) {
				e.target.btn.treeItem.btn[i].setAttribute('fill', e.target.btn.styles.fill);
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[e.target.btn.value - 1].style.background = "";
		});

		btn.addEventListener("contextmenu", e => {
			e.preventDefault();

		});

		lowBtn.addEventListener("contextmenu", e => {
			e.preventDefault();

		});


		return id;
	}

	pointerAddDelete(add, lay) { //=-= svg
		if (add) {
			this.exPointers[0].style.display = '';
			this.exPointers[1].style.display = '';
			this.exPointers[2].style.display = '';
			this.exPointers[3].style.display = '';
			this.exPointers[4].style.display = '';
		} else {
			this.exPointers[0].style.display = 'none';
			this.exPointers[1].style.display = 'none';
			this.exPointers[2].style.display = 'none';
			this.exPointers[3].style.display = 'none';
			this.exPointers[4].style.display = 'none';
		}
	}

	buttonSaveEdit(one, example, inp) { //=-= svg
		if (one) {
			this.target.style.borderRadius = example[0].style.borderRadius;
			this.target.setAttribute('rx', example[0].rx.animVal.value);
			this.target.setAttribute('ry', example[0].ry.animVal.value);
			if (example[0].rx.animVal.value == 0) this.target.style.width = example[0].style.height.substring(0, example[0].style.height.length - 2) * 2 + 'px';
			else this.target.style.width = example[0].style.height.substring(0, example[0].style.height.length - 2) + 'px';
			this.target.style.height = example[0].style.height;
			this.target.styles.font = example[0].textElement.style.fontSize;
			this.target.styles.r = example[0].rx.animVal.value;
			this.target.styles.height = example[0].style.height;
			this.target.styles.fill = this.target.attributes.fill.value;
			this.target.styles.fillOpacity = example[1].attributes["fill-opacity"].value;
			if ((inp <= 10) && (inp >= 0)) {
				this.deletePointers();
				this.setNumPointers(this.target, inp);
			}
			for (let j = 0; j < this.target.tempBtn.length; j++) {
				this.target.tempBtn[j].style.background = example[1].style.background;
			}
		} else {
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				let btn = this.btnData.btnArray[i];
				btn.style.borderRadius = example[0].style.borderRadius;
				btn.setAttribute('rx', example[0].rx.animVal.value);
				btn.setAttribute('ry', example[0].ry.animVal.value);
				if (example[0].rx.animVal.value == 0) btn.style.width = example[0].style.height.substring(0, example[0].style.height.length - 2) * 2 + 'px';
				else btn.style.width = example[0].style.height.substring(0, example[0].style.height.length - 2) + 'px';
				btn.style.height = example[0].style.height;
				btn.styles.font = example[0].textElement.style.fontSize;
				btn.styles.r = example[0].rx.animVal.value;
				btn.styles.height = example[0].style.height;
				btn.styles.fill = example[0].attributes.fill.value;
				btn.styles.fillOpacity = example[1].attributes["fill-opacity"];
				if ((inp <= 10) && (inp >= 0)) {
					this.deletePointers();
					this.setNumPointers(btn, inp);
				}
				for (let j = 0; j < btn.tempBtn.length; j++) {
					btn.tempBtn[j].style.background = example[1].style.background;
				}
			}
		}
	}

	createBuild(e) {
		this.target.layerName = "Name" + Object.keys(this.layers).length;
		this.currentLayer = this.target.treeItem.id;
		this.saveData[this.name] = {};
		this.saveData[this.name].buttons = this.btnData.btnArray;
		this.name = "Name" + Object.keys(this.layers).length;
		this.layers[this.name] = {};

		

		this.layerObjects[this.name] = this.target.obj;

		const main = new widgetsComponentsTypes["button"]
		this.tabLay.includeWidget(main);
		main.htmlElement.style.maxWidth = "300px";
		main.text = this.name;
		main.htmlElement.style.margin = "5px";
		main.htmlElement.style.backgroundColor = "green";
		main.btn = this.target;


		main.htmlElement.addEventListener("click", e => {
			if (e.target.className != "WidgetButton") this.selectLayer(main.text, ReactComponent[e.target.parentNode.id]);
			else this.selectLayer(main.text, ReactComponent[e.target.id]);
		});

		this.createNewLayer();
	}

	createNewLayer(event,) { //=-= svg
		//this.deleteElement(this.viewLay.id);

		this.viewLay.htmlElement.childNodes[0].parentNode.removeChild(this.viewLay.htmlElement.childNodes[0]);
		this.deleteElement(this.viewLay.htmlElement.childNodes[0].id);
		this.deleteElement(this.viewLay.htmlElement.childNodes[0].id);

		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.svg.classList.add("smartSvg");
		this.svg.style.width = "100%";
		this.svg.style.minHeight = "80%";
		this.svg.style.position = "relative";
		this.viewLay.htmlElement.appendChild(this.svg);

		this.htmlImage = document.createElementNS("http://www.w3.org/2000/svg", 'image');
		this.svg.appendChild(this.htmlImage);
		this.htmlImage.oncontextmenu = this.showContextMenu.bind(this);






		const layhor = new widgetsComponentsTypes["layoutHorizontal"];
		layhor.htmlElement.style.width = "100%";
		layhor.htmlElement.style.maxHeight = "5.1%";
		layhor.htmlElement.style.top = "";
		layhor.htmlElement.style.left = "";
		layhor.htmlElement.style.right = "0px";
		layhor.htmlElement.style.bottom = "12.8%";
		this.viewLay.includeWidget(layhor);

		const widget = new widgetsComponentsTypes["label"];
		layhor.includeWidget(widget);
		this.nameLabel = widget.id;
		widget.htmlElement.style.zIndex = 950;
		widget.htmlElement.style.left = "40%";
		widget.htmlElement.style.top = "";
		widget.htmlElement.style.bottom = "0px";
		widget.htmlElement.style.backgroundColor = "white";
		widget.htmlElement.style.maxWidth = "80%";
		widget.text = this.name;
		widget.htmlElement.style.borderColor = "black";
		widget.htmlElement.style.borderWidth = "1px";
		widget.htmlElement.style.borderStyle = "groove";


		this.imageData = '/data/textures/sborka.jpg';
		this.htmlImage.setAttribute("href", this.imageData);
		this.btnData = { btnArray: [] };
		this.htmlImage.addEventListener("dragstart", e => {
			e.preventDefault()
		});
		this.refreshList();
		this.refreshTable();

		if (this.target != "") this.currentLayer = this.target.treeItem.id;
		if (this.target == "") this.currentLayer = this.mainLay;



	}

	selectLayer(name, tab) {
		this.saveData[this.name] = {};
		this.saveData[this.name].buttons = this.btnData.btnArray;
		this.target = tab.btn;
		this.name = name;
		this.currentLayerObject = this.layerObjects[this.name];
		this.createNewLayer();
		this.drawLayer(name);

	}

	drawLayer(name) {
		this.saveData[name].buttons;
		for (let i = 0; i < this.saveData[name].buttons.length; i++) {
			let btn = this.saveData[name].buttons[i];
			console.log('button - ', btn);
			this.createBtn("", false, btn.treeItem);
			this.btnData.btnArray[i].styles = btn.styles;
			this.btnData.btnArray[i].setAttribute('x', btn.x.animVal.value);
			this.btnData.btnArray[i].setAttribute('y', btn.y.animVal.value);
			this.deletePointers(this.btnData.btnArray[i]);
			this.setNumPointers(this.btnData.btnArray[i], this.saveData[name].buttons[i].tempBtn.length);
			for (let j = 0; j < this.btnData.btnArray[i].tempBtn.length; j++) {
				this.btnData.btnArray[i].tempBtn[j].setAttribute('cx', btn.tempBtn[j].cx.animVal.value);
				this.btnData.btnArray[i].tempBtn[j].setAttribute('cy', btn.tempBtn[j].cy.animVal.value);
				this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('x1', btn.x.animVal.value + this.btnData.btnArray[i].clientHeight / 2);
				this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('y1', btn.y.animVal.value + this.btnData.btnArray[i].clientWidth / 2);
				this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('x2', btn.tempBtn[j].cx.animVal.value);
				this.btnData.btnArray[i].tempBtn[j].currentLine.setAttribute('y2', btn.tempBtn[j].cy.animVal.value);
			}
			for (let j = 0; j < this.saveData[name].buttons[i].duplicates.length; j++) {
				this.duplicateButton(this.btnData.btnArray[i]);
				this.btnData.btnArray[i].duplicates[j].setAttribute('x', btn.duplicates[j].x.animVal.value);
				this.btnData.btnArray[i].duplicates[j].setAttribute('y', btn.duplicates[j].y.animVal.value);
				this.btnData.btnArray[i].duplicates[j].styles = btn.styles;
				this.deletePointers(this.btnData.btnArray[i].duplicates[j]);
				this.setNumPointers(this.btnData.btnArray[i].duplicates[j], this.saveData[name].buttons[i].duplicates[j].tempBtn.length);
				for (let k = 0; k < this.btnData.btnArray[i].tempBtn.length; k++) {
					console.log('i ', i);
					console.log('j ', j);
					console.log('k ', k);
					this.btnData.btnArray[i].duplicates[j].tempBtn[k].setAttribute('cx', btn.duplicates[j].tempBtn[k].cx.animVal.value);
					this.btnData.btnArray[i].duplicates[j].tempBtn[k].setAttribute('cy', btn.duplicates[j].tempBtn[k].cy.animVal.value);
					this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('x1', btn.duplicates[j].x.animVal.value + this.btnData.btnArray[i].duplicates[j].clientHeight / 2);
					this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('y1', btn.duplicates[j].y.animVal.value + this.btnData.btnArray[i].duplicates[j].clientWidth / 2);
					this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('x2', btn.duplicates[j].tempBtn[k].cx.animVal.value);
					this.btnData.btnArray[i].duplicates[j].tempBtn[k].currentLine.setAttribute('y2', btn.duplicates[j].tempBtn[k].cy.animVal.value);
				}
			}
		}
	}



	openLayer() {
		// this.currentLayer = this.target.treeItem.id;
		// console.log(this.target);
		// this.createNewLayer();
		// this.drawLayer(this.target.layerName)

		this.showProps(this.target.obj);
	}

	showContextMenu(e, flag = false) {
		if (this._contextMenu.isBlocked) return false;

		this._contextMenu.clearItems();
		if (this._contextMenu._isShow) {
			this._contextMenu.hide();
		}

		this._contextMenu.show(APP.UI.mX, APP.UI.mY - 20);

		if (flag) {

			this.target = e.target;

			this._contextMenu.addItem("Растянуть", this.saveSize.bind(this, 0))

			this._contextMenu.addItem("По центру", this.saveSize.bind(this, 1))

			this._contextMenu.addItem("Заполнение", this.saveSize.bind(this, 2))

			this._contextMenu.addItem("По размеру", this.saveSize.bind(this, 3))

		} else if (e.target.classList[0] == "circleImage") {
			if (this.editMode) {

				this.target = e.target;

				this._contextMenu.addItem("Редактировать кнопку", this.buttonChooseEdit.bind(this, e))

				this._contextMenu.addItem("Удалить кнопку", this.deleteButton.bind(this, e, true))

				this._contextMenu.addItem("Создать сборку", this.createBuild.bind(this, e))

				this._contextMenu.addItem("Привязать объект", this.linkButtonObj.bind(this, e))

				this._contextMenu.addItem("Дублировать кнопку", this.duplicateButton.bind(this, e.target, 1))

				this._contextMenu.addItem("Открыть", this.openLayer.bind(this));

			} else {

				this._contextMenu.addItem("Открыть", call => { openLayer(); });

			}
		} else {
			if (e.target.btn) {
				let boom = {};
				boom.target = e.target.btn
				this.showContextMenu(boom);
			} else {
				if (this.editMode) {

					this._contextMenu.addItem("Добавить кнопку", this.addButton.bind(this, e))


					this._contextMenu.addItem("Задать изображение", this.setImage.bind(this, e))


					this._contextMenu.addItem("Изменить размер изображения", this.showContextMenu.bind(this, e, true), true)


					this._contextMenu.addItem("Привязать объект", this.linkObject.bind(this, e))


					this._contextMenu.addItem("Переименовать изображение", this.renameImage.bind(this, e))


					this._contextMenu.addItem("Редактировать вид кнопок", this.buttonChooseEdit.bind(this, e))

				} else {

					this._contextMenu.addItem("Включить режим редактирования", this.toggleEditMode.bind(this, e))

				}
			}
		}
	}

	onPosX(value) {
		if (value == null) return;
		this.svg.style.marginLeft = "-" + value;
		this.ofsX = parseInt(value);
		this.changLineX(value);
	}

	changLineX(value) {
		let valueInt = parseInt(value);
		for (let i = 0; i < this.btnData.btnArray.length; i++) {
			for (let i = 0; i < this.btnData.btnArray[i].tempBtn.length; i++) {
				let line = this.btnData.btnArray[i].tempBtn[j].currentLine;
				line.ofsX1 += valueInt;
				line.ofsX2 += valueInt;
				line.setAttribute("x1", line.ofsX1 + '');
				line.setAttribute("x2", line.ofsX2 + '');
			}
		}
	}

	onPosY(value) {
		if (value == null) return;
		this.svg.style.marginTop = "-" + value;
		this.ofsY = parseInt(value);
		this.changLineY(value);
	}

	changLineY(value) {
		let valueInt = parseInt(value);
		for (let i = 0; i < this.btnData.btnArray.length; i++) {
			for (let i = 0; i < this.btnData.btnArray[i].tempBtn.length; i++) {
				let line = this.btnData.btnArray[i].tempBtn[j].currentLine;
				line.ofsY1 += valueInt;
				line.ofsY2 += valueInt;
				line.setAttribute("y1", line.ofsY1 + '');
				line.setAttribute("y2", line.ofsY2 + '');
			}
		}
	}

	visibleButtons(value) {
		this.visibleBtn = value;
		if (!value) {
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				this.btnData.btnArray[i].classList.add("noShow");
				this.btnData.btnArray[i].textElement.classList.add("noShow");
				for (let j = 0; j < this.btnData.btnArray[i].tempBtn.length; j++) {
					this.btnData.btnArray[i].tempBtn[j].currentLine.classList.add("noShow");
					this.btnData.btnArray[i].tempBtn[j].classList.add("noShow");
				}

			}
		} else {
			for (let i = 0; i < this.btnData.btnArray.length; i++) {
				this.btnData.btnArray[i].classList.remove("noShow");
				this.btnData.btnArray[i].textElement.classList.remove("noShow");
				for (let j = 0; j < this.btnData.btnArray[i].tempBtn.length; j++) {
					this.btnData.btnArray[i].tempBtn[j].currentLine.classList.remove("noShow");
					this.btnData.btnArray[i].tempBtn[j].classList.remove("noShow");
				}

			}
		}
	}

	createBtn(text, check = true, sup = null) { //=-= svg 
		//debugger;
		//this.c = this.svg.childNodes[0].viewportElement.clientWidth / this.svg.childNodes[0].viewportElement.clientHeight;

		//this.htmlImage.style.height = this.htmlImage.viewportElement.clientHeight + 'px';
		//this.htmlImage.style.width = this.htmlImage.viewportElement.clientHeight * this.c + 'px';

		let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		this.svg.appendChild(line);

		ReactComponent[this.nameLabel].htmlElement.style.marginLeft = '11.3%';

		let btn = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

		this.btnData.btnArray.push(btn);
		let num = this.btnData.btnArray.length;
		btn.setAttribute('x', 250 + num * 20);
		btn.setAttribute('y', 50 + num * 20);
		btn.setAttribute('rx', btn.x.animVal.value * 2);
		btn.setAttribute('ry', btn.y.animVal.value * 2);
		btn.setAttribute('fill', "white");
		btn.setAttribute('stroke', "black");
		btn.setAttribute('stroke-width', 2);
		btn.styles = { height: "60px", r: "120", color: "white", font: "20", fill: "white" };//
		btn.layerName = "";
		btn.object = { Вес: 15, Длина: 10 }

		btn.classList.add("circleImage");
		btn.classList.add("Unselectable");
		btn.mouse = { move: false };
		this.svg.appendChild(btn);

		let lowBtn = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		lowBtn.classList.add("lowCircleImage");
		lowBtn.classList.add("Unselectable");
		lowBtn.mouse = { move: false };
		lowBtn.setAttribute('cx', 375 + num * 20);
		lowBtn.setAttribute('cy', 175 + num * 20);
		lowBtn.setAttribute('r', 5);
		lowBtn.setAttribute('stroke', "black");
		lowBtn.setAttribute('stroke-width', 2);
		this.svg.appendChild(lowBtn);



		const id = "" + this.id + "#btn_" + num;
		btn.setAttribute("id", id);
		btn.innerText = num;
		btn.value = num;
		btn.dataText = num + ' ' + text;
		btn.duplicates = [];
		btn.style.fontSize = "14px";
		this.btnData[num] = btn.dataText;
		btn.dupp = false;

		if (check) {
			let newItem = this.layersTree.createItemInTree(this.currentLayer);
			ReactComponent[newItem].text = btn.dataText;
			ReactComponent[newItem].btn = [btn];
			btn.treeItem = ReactComponent[newItem];
			btn.treeItem.expanded = 1;
			if (btn.treeItem.parent) btn.treeItem.parent.expanded = 1;

			btn.treeItem.htmlElement.addEventListener("mouseover", e => {
				let tar = "";
				if ((e.target.htmlElement) && (e.target.htmlElement.classList[0] == "WidgetTreeItem")) {
					tar = ReactComponent[e.target.id];
				} else if (e.target.classList[0] == "TreeItemContainer") {
					tar = ReactComponent[e.target.parentNode.id];
				} else {
					//tar = ReactComponent[e.target.parentNode.parentNode.id];
				}

				if (tar != "") {
					tar.htmlElement.style.background = 'red';
					tar.htmlElement.firstChild.style.background = 'red';
					tar.htmlElement.firstChild.lastChild.style.background = 'red';
					for (let i = 0; i < tar.btn.length; i++) {
						tar.btn[i].setAttribute('fill', 'red');
					}
					if (tar.parent.id == this.currentLayer) {
						if (ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1]) {
							ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1].style.background = "red";
						}
					}
				}

			});

			btn.treeItem.htmlElement.addEventListener("mouseout", e => {
				let tar = "";
				if ((e.target.htmlElement) && (e.target.htmlElement.classList[0] == "WidgetTreeItem")) {
					tar = ReactComponent[e.target.id];
				} else if (e.target.classList[0] == "TreeItemContainer") {
					tar = ReactComponent[e.target.parentNode.id];
				} else {
					//tar = ReactComponent[e.target.parentNode.parentNode.id];
				}

				if (tar != "") {
					tar.htmlElement.style.background = '';
					tar.htmlElement.firstChild.style.background = '';
					tar.htmlElement.firstChild.lastChild.style.background = '';
					for (let i = 0; i < tar.btn.length; i++) {
						tar.btn[i].setAttribute('fill', tar.btn[i].styles.fill);
					}
					if (tar.parent.id == this.currentLayer) {
						if (ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1]) {
							ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1].style.background = "";
						}
					}
				}

			});

			// btn.treeItem.htmlElement.addEventListener("dblclick", e => {
			// 	let tar = "";
			// 	if ((e.target.htmlElement) && (e.target.htmlElement.classList[0] == "WidgetTreeItem")) {
			// 		tar = ReactComponent[e.target.id];
			// 	} else if (e.target.classList[0] == "TreeItemContainer") {
			// 		tar = ReactComponent[e.target.parentNode.id];
			// 	} else {
			// 		//tar = ReactComponent[e.target.parentNode.parentNode.id];
			// 	}

			// 	//this.target = tar.btn;
			// 	this.openLayer();

			// });

		}

		if (sup) {
			btn.treeItem = sup;
		}




		line.id = 'LineId_' + num;//
		line.setAttribute("x1", 275 + num * 20 + '');//
		line.setAttribute("y1", 75 + num * 20 + '');//


		line.setAttribute("x2", 375 + num * 20 + '');//
		line.setAttribute("y2", 175 + num * 20 + '');//
		line.ofsX1 = 275 + num * 20;//
		line.ofsY1 = 75 + num * 20;//
		line.ofsX2 = 375 + num * 20;//
		line.ofsY2 = 175 + num * 20;//
		line.style.cursor = 'pointer';//
		line.style.stroke = 'black';//
		line.style.strokeWidth = 1;//

		lowBtn.currentLine = line;
		btn.tempBtn = [];
		btn.tempBtn.push(lowBtn);
		line.mouse = { move: false };

		let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');//
		textElement.btn = btn;//
		textElement.style.userSelect = "none";//
		textElement.setAttribute("x", 275 - 8 + num * 20);//
		textElement.setAttribute("y", 75 + 6 + num * 20);//
		textElement.textContent = btn.value;//
		textElement.style.fontWeight = "bold";//
		textElement.style.fontSize = "20px";//
		btn.textElement = textElement;//
		this.svg.appendChild(textElement);

		if (text != "") {
			btn.style.display = "none";
			btn.textElement.textContent = num + ' ' + text;
			btn.textElement.setAttribute('text-decoration', "underline");

			line.setAttribute("x2", 375 + num * 20 + '');
			line.setAttribute("y2", 175 + num * 20 + '');

		};



		btn.addEventListener("dblclick", e => {
			e.preventDefault();
			console.log(e, btn.dataText);
		});

		btn.addEventListener("mouseover", e => {
			//e.target.setAttribute('fill', 'red');
			e.target.treeItem.htmlElement.style.backgroundColor = "red";
			for (let i = 0; i < e.target.treeItem.btn.length; i++) {
				e.target.treeItem.btn[i].setAttribute('fill', 'red');
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1].style.background = "red";
		});

		btn.addEventListener("mouseout", e => {
			//e.target.setAttribute('fill', e.target.styles.fill);
			e.target.treeItem.htmlElement.style.backgroundColor = "";
			for (let i = 0; i < e.target.treeItem.btn.length; i++) {
				e.target.treeItem.btn[i].setAttribute('fill', e.target.styles.fill);
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[btn.value - 1].style.background = "";
		});

		textElement.addEventListener("mouseover", e => {
			e.target.btn.treeItem.htmlElement.style.backgroundColor = "red";
			for (let i = 0; i < e.target.btn.treeItem.btn.length; i++) {
				e.target.btn.treeItem.btn[i].setAttribute('fill', 'red');
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[e.target.btn.value - 1].style.background = "red";
		});

		textElement.addEventListener("mouseout", e => {
			e.target.btn.treeItem.htmlElement.style.backgroundColor = "";
			for (let i = 0; i < e.target.btn.treeItem.btn.length; i++) {
				e.target.btn.treeItem.btn[i].setAttribute('fill', e.target.btn.styles.fill);
			}
			ReactComponent[this.table].htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[e.target.btn.value - 1].style.background = "";
		});

		lowBtn.addEventListener("dblclick", e => {
			e.preventDefault();
			console.log(e, btn.dataText);
		});

		btn.addEventListener("contextmenu", e => {
			e.preventDefault();

		});

		lowBtn.addEventListener("contextmenu", e => {
			e.preventDefault();

		});

		this.refreshTable(0);
		this.refreshList();

		btn.styles.height = btn.clientHeight + 'px';
		btn.styles.r = btn.rx.animVal.value;

		return id;
	}

	onMouseDown(e) {

		

		if ((e.which == 1) && e.target.mouse) {
			e.target.mouse.x = e.clientX;
			e.target.mouse.y = e.clientY;
			e.target.mouse.move = true;
			console.log(e.target);
		} else if ((e.which == 3) && e.target.mouse) {
			e.target.mouse.moveLine = true;

			if (this.editMode) for (let i = 0; i < this.btnData.btnArray.length; i++) {
				let btn = this.btnData.btnArray[i];
				let line = btn.currentLine;
				let lowBtn = btn.tempBtn;
			}
		}

		if (e.target.btn) {
			e.target.btn.mouse.x = e.clientX;
			e.target.btn.mouse.y = e.clientY;
			e.target.btn.mouse.move = true;
			console.log(e.target);
		}
	}
	onMouseMove(e) {


		if (this.firstIn && (document.getElementById("root").style.display != "none")) {
			//this.linkObject(); // NIKOLAYS
			this.firstIn = false;
		}

		if (this.btnData.btnArray.length === 0) return;
		if (this.editMode) for (let i = 0; i < this.btnData.btnArray.length; i++) {
			let dupp = false;
			let btn = this.btnData.btnArray[i];
			let line;
			let width = this.htmlImage.style.width.substring(0, this.htmlImage.style.width.length - 2);
			let height = this.htmlImage.style.height.substring(0, this.htmlImage.style.height.length - 2);

			if (btn.duplicates) if (btn.duplicates.length > 0) dupp = true;

			//btn event
			if (btn.mouse) if (btn.mouse.move && (btn.x.animVal.value + e.clientX - btn.mouse.x > 1) && (btn.y.animVal.value + e.clientY - btn.mouse.y > 1)) {
				if ((btn.x.animVal.value + e.clientX - btn.mouse.x < width - btn.clientWidth) && (btn.y.animVal.value + e.clientY - btn.mouse.y < height - btn.clientHeight)) {
					btn.style.marginLeft = (btn.x.animVal.value + e.clientX - btn.mouse.x) + "px";
					btn.style.marginTop = (btn.y.animVal.value + e.clientY - btn.mouse.y) + "px";
					btn.setAttribute("x", btn.x.animVal.value + e.clientX - btn.mouse.x);
					btn.setAttribute("y", btn.y.animVal.value + e.clientY - btn.mouse.y);
					btn.textElement.setAttribute("x", Number(btn.textElement.attributes.x.value) + e.clientX - btn.mouse.x);
					btn.textElement.setAttribute("y", Number(btn.textElement.attributes.y.value) + e.clientY - btn.mouse.y);

					btn.mouse.x = e.clientX;
					btn.mouse.y = e.clientY;
					for (let i = 0; i < btn.tempBtn.length; i++) {
						line = btn.tempBtn[i].currentLine;

						line.setAttribute("x1", this.ofsX + btn.x.animVal.value + btn.clientWidth / 2 + '');
						line.setAttribute("y1", this.ofsY + btn.y.animVal.value + btn.clientHeight / 2 + '');

						if (btn.style.display == "none") if ((btn.tempBtn[i].cx.animVal.value < btn.x.animVal.value) && (btn.tempBtn[i].cy.animVal.value < btn.y.animVal.value)) {
							line.setAttribute("x1", this.ofsX + btn.x.animVal.value + '');
							line.setAttribute("y1", this.ofsY + btn.y.animVal.value + '');
						} else if ((btn.tempBtn[i].cx.animVal.value > btn.x.animVal.value) && (btn.tempBtn[i].cy.animVal.value < btn.y.animVal.value)) {
							line.setAttribute("x1", this.ofsX + btn.x.animVal.value + 60 + 7.5 * (btn.textElement.textContent.length - 1) + '');
							line.setAttribute("y1", this.ofsY + btn.y.animVal.value + '');
						} else if ((btn.tempBtn[i].cx.animVal.value < btn.x.animVal.value) && (btn.tempBtn[i].cy.animVal.value > btn.y.animVal.value)) {
							line.setAttribute("x1", this.ofsX + btn.x.animVal.value + '');
							line.setAttribute("y1", this.ofsY + btn.y.animVal.value + 60 + '');
						} else {
							line.setAttribute("x1", this.ofsX + btn.x.animVal.value + 60 + 7.5 * (btn.textElement.textContent.length - 1) + '');
							line.setAttribute("y1", this.ofsY + btn.y.animVal.value + 60 + '');
						}
						line.ofsX1 = this.ofsX + btn.clientWidth / 2;
						line.ofsY1 = this.ofsY + btn.clientHeight / 2;

					}
				}
			} else if (btn.duplicates.length > 0) {
				for (let i = 0; i < btn.duplicates.length; i++) {
					let dup = btn.duplicates[i];
					let line = "";

					//btn duplicate event
					if (dup.mouse.move && (dup.x.animVal.value + e.clientX - dup.mouse.x > 1) && (dup.y.animVal.value + e.clientY - dup.mouse.y > 1)) {
						if ((dup.x.animVal.value + e.clientX - dup.mouse.x < width - dup.clientWidth) && (dup.y.animVal.value + e.clientY - dup.mouse.y < height - dup.clientHeight)) {
							dup.style.marginLeft = (dup.x.animVal.value + e.clientX - dup.mouse.x) + "px";
							dup.style.marginTop = (dup.y.animVal.value + e.clientY - dup.mouse.y) + "px";
							dup.setAttribute("x", dup.x.animVal.value + e.clientX - dup.mouse.x);
							dup.setAttribute("y", dup.y.animVal.value + e.clientY - dup.mouse.y);
							dup.textElement.setAttribute("x", dup.x.animVal.value + dup.clientWidth / 2 + e.clientX - dup.mouse.x - 8);
							dup.textElement.setAttribute("y", dup.y.animVal.value + dup.clientHeight / 2 + e.clientY - dup.mouse.y + 6);
							dup.mouse.x = e.clientX;
							dup.mouse.y = e.clientY;
							for (let i = 0; i < dup.tempBtn.length; i++) {
								line = dup.tempBtn[i].currentLine;
								line.setAttribute("x1", this.ofsX + dup.x.animVal.value + dup.clientWidth / 2 + '');
								line.setAttribute("y1", this.ofsY + dup.y.animVal.value + dup.clientHeight / 2 + '');
								line.ofsX1 = this.ofsX + dup.x.animVal.value + dup.clientWidth / 2;
								line.ofsY1 = this.ofsY + dup.y.animVal.value + dup.clientHeight / 2;
							}
						}
					}
				}
			}
			//pointer event
			if (btn.tempBtn) for (let i = 0; i < btn.tempBtn.length; i++) {
				let lowBtn = btn.tempBtn[i];
				line = btn.tempBtn[i].currentLine;
				if (lowBtn.mouse.move && (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x > 1) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y > 1)) {
					if ((lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x < width - lowBtn.clientWidth) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y < height - lowBtn.clientHeight)) {
						lowBtn.style.left = (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x) + "px";
						lowBtn.style.top = (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y) + "px";
						lowBtn.setAttribute("cx", lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x);
						lowBtn.setAttribute("cy", lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y);
						lowBtn.mouse.x = e.clientX;
						lowBtn.mouse.y = e.clientY;
						line.setAttribute("x2", this.ofsX + lowBtn.cx.animVal.value + '');
						line.setAttribute("y2", this.ofsY + lowBtn.cy.animVal.value + '');
						line.ofsX2 = this.ofsX + lowBtn.cx.animVal.value;
						line.ofsY2 = this.ofsY + lowBtn.cy.animVal.value;
					}
				}
			}
			//pointer duplicate event
			if (dupp) for (let i = 0; i < btn.duplicates.length; i++) {
				for (let j = 0; j < btn.duplicates[i].tempBtn.length; j++) {
					let lowBtn = btn.duplicates[i].tempBtn[j];
					line = btn.duplicates[i].tempBtn[j].currentLine;
					if (lowBtn.mouse.move && (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x > 1) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y > 1)) {
						if ((lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x < width - lowBtn.clientWidth) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y < height - lowBtn.clientHeight)) {
							lowBtn.style.left = (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x) + "px";
							lowBtn.style.top = (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y) + "px";
							lowBtn.setAttribute("cx", lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x);
							lowBtn.setAttribute("cy", lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y);
							lowBtn.mouse.x = e.clientX;
							lowBtn.mouse.y = e.clientY;
							line.setAttribute("x2", this.ofsX + lowBtn.cx.animVal.value + '');
							line.setAttribute("y2", this.ofsY + lowBtn.cy.animVal.value + '');
							line.ofsX2 = this.ofsX + lowBtn.cx.animVal.value;
							line.ofsY2 = this.ofsY + lowBtn.cy.animVal.value;
						}
					}
				}
			}
		}
	}

	onMouseUp(e) {
		if (this.editMode) for (let i = 0; i < this.btnData.btnArray.length; i++) {
			let btn = this.btnData.btnArray[i];
			if (btn == "deleted") continue;
			let dupp = false;
			let lowBtn = btn.tempBtn[0];
			if (btn.duplicates.length > 0) { dupp = true; }
			let line = lowBtn.currentLine;
			let width = this.htmlImage.style.width.substring(0, this.htmlImage.style.width.length - 2);
			let height = this.htmlImage.style.height.substring(0, this.htmlImage.style.height.length - 2);
			//btn event
			if (btn.mouse.move && (btn.x.animVal.value + e.clientX - btn.mouse.x > 1) && (btn.y.animVal.value + e.clientY - btn.mouse.y > 1)) {
				if ((btn.x.animVal.value + e.clientX - btn.mouse.x < width - btn.clientWidth) && (btn.y.animVal.value + e.clientY - btn.mouse.y < height - btn.clientHeight)) {
					btn.style.marginLeft = (btn.x.animVal.value + e.clientX - btn.mouse.x) + "px";
					btn.style.marginTop = (btn.y.animVal.value + e.clientY - btn.mouse.y) + "px";
					btn.setAttribute("x", btn.x.animVal.value + e.clientX - btn.mouse.x);
					btn.setAttribute("y", btn.y.animVal.value + e.clientY - btn.mouse.y);
					btn.textElement.setAttribute("x", Number(btn.textElement.attributes.x.value) + e.clientX - btn.mouse.x);
					btn.textElement.setAttribute("y", Number(btn.textElement.attributes.y.value) + e.clientY - btn.mouse.y);
					if (btn.attributes.rx.value == "0") {

						//btn.textElement.setAttribute("x", btn.x.animVal.value + btn.clientWidth/2  + e.clientX - btn.mouse.x - 8 - (textElement.textContent.length - 1)*5);

					}
					btn.mouse = { move: false };
				}

			} else {
				btn.mouse = { move: false };
				if (btn.duplicates.length > 0) {
					for (let i = 0; i < btn.duplicates.length; i++) {
						let dup = btn.duplicates[i];
						let lowBtn = dup.tempBtn;
						let line = dup.tempBtn.currentLine;

						//btn duplicate event
						if (dup.mouse.move && (dup.x.animVal.value + e.clientX - dup.mouse.x > 1) && (dup.y.animVal.value + e.clientY - dup.mouse.y > 1)) {
							if ((dup.x.animVal.value + e.clientX - dup.mouse.x < width - dup.clientWidth) && (dup.y.animVal.value + e.clientY - dup.mouse.y < height - dup.clientHeight)) {
								dup.style.marginLeft = (dup.x.animVal.value + e.clientX - dup.mouse.x) + "px";
								dup.style.marginTop = (dup.y.animVal.value + e.clientY - dup.mouse.y) + "px";
								dup.setAttribute("x", dup.x.animVal.value + e.clientX - dup.mouse.x);
								dup.setAttribute("y", dup.y.animVal.value + e.clientY - dup.mouse.y);
								dup.textElement.setAttribute("x", dup.x.animVal.value + dup.clientWidth / 2 + e.clientX - dup.mouse.x - 8);
								dup.textElement.setAttribute("y", dup.y.animVal.value + dup.clientHeight / 2 + e.clientY - dup.mouse.y + 6);
								dup.mouse = { move: false };
							}
						}
						dup.mouse = { move: false };
					}
				}
			}
			//pointer event
			for (let i = 0; i < btn.tempBtn.length; i++) {
				lowBtn = btn.tempBtn[i];
				if (lowBtn.mouse.move && (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x > 1) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y > 1)) {
					if ((lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x < width - lowBtn.clientWidth) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y < height - lowBtn.clientHeight)) {
						lowBtn.style.left = (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x) + "px";
						lowBtn.style.top = (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y) + "px";
						lowBtn.setAttribute("cx", lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x);
						lowBtn.setAttribute("cy", lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y);
						lowBtn.mouse = { move: false };
					}

				}
				lowBtn.mouse = { move: false };
			}
			//pointer duplicate event
			if (dupp) for (let i = 0; i < btn.duplicates.length; i++) {
				for (let j = 0; j < btn.duplicates[i].tempBtn.length; j++) {
					lowBtn = btn.duplicates[i].tempBtn[j];
					if (lowBtn.mouse.move && (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x > 1) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y > 1)) {
						if ((lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x < width - lowBtn.clientWidth) && (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y < height - lowBtn.clientHeight)) {
							lowBtn.style.left = (lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x) + "px";
							lowBtn.style.top = (lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y) + "px";
							lowBtn.setAttribute("cx", lowBtn.cx.animVal.value + e.clientX - lowBtn.mouse.x);
							lowBtn.setAttribute("cy", lowBtn.cy.animVal.value + e.clientY - lowBtn.mouse.y);
							lowBtn.mouse = { move: false };
						}
					}
					lowBtn.mouse = { move: false };
				}
			}

		}
	}
	set imageData(value) {
		if (value === this._imageData) return;	
		this._imageData = value;
		this.htmlImage.style.background = "url(" + this.imageData + ")";
	}

	get imageData() {
		return this._imageData;
	}
	onGenerateContent(content, docData) {
		const htmlImage = this.htmlImage;
		const imageSize = htmlImage.getBoundingClientRect();
		let imgData = getStyle(htmlImage, 'background-image');
		if (imgData.indexOf('url') !== -1) {
			imgData = imgData.substring(5, imgData.length - 2);
		}

		let table = content.table;
		table.widths.push(imageSize.width);
		table.heights.push(imageSize.height);

		table.body.push([{}]);
		//do not draw a hidden element
		if (imageSize.width === 0 || imageSize.height === 0)
			return;

		if (imgData.indexOf('http') !== -1) {
			//TODO: need to draw special image
			return;
		}

		let body = table.body[0][0];
		body.image = imgData;

		let img = new Image();
		img.src = imgData;
		function imageHandler() {
			const size = {
				width: img.width,
				height: img.height
			}
			if (this.position === 0) {
				body.width = imageSize.width;
				body.height = imageSize.height;
			} else {
				body.fit = [size.width / (size.height / imageSize.height), imageSize.height];
				const left = Math.abs((imageSize.width - body.fit[0]) / 2);
				const top = Math.abs((imageSize.height - body.fit[1]) / 2);
				body.margin = [left, top, left, top];
			}

			docData.images.splice(docData.images.indexOf(img), 1);
		}

		img.onload = imageHandler.bind(this);
		docData.images.push(img);
	}

	set position(value) {
		// Stretch 	= 0, // растянуть
		// Centered = 1, // по центру
		// Filling 	= 2, // заполнение
		// ToSize 	= 3, // по размеру
		// Repeat 	= 4  // замостить
		this._position = value;
		if (value == 0) this.htmlImage.style.backgroundSize = "100% 100%";
		if (value == 1) { this.htmlImage.style.backgroundSize = ""; this.htmlImage.style.backgroundRepeat = "no-repeat"; }
		if (value == 2) this.htmlImage.style.backgroundSize = "cover";
		if (value == 3) this.htmlImage.style.backgroundSize = "contain";
		if (value == 4) { this.htmlImage.style.backgroundSize = ""; this.htmlImage.style.backgroundRepeat = "repeat" }
	}
	get position() { return this._position; }

	set imageId(value) {
		this.imageId = value;
		if (value != -1) this.checkLoad();
	}

	checkLoad() {
		let im = Rex.images[this.imageId];
		if (im == null) { requestAnimationFrame(this.checkLoad.bind(this)); return; }
		if (im.image == null) { requestAnimationFrame(this.checkLoad.bind(this)); return; }
		this.htmlImage.style.backgroundImage = `url(${im.data})`;
		if (this.htmlImage.style.backgroundImage == null) { requestAnimationFrame(this.checkLoad.bind(this)); return; }
	}

	get imageId() { return this.imageId; }

	controlIconName(stateIconName) {
		if (this.iconName == stateIconName) return;
		this.iconName = stateIconName;
		this.htmlImage.textContent = stateIconName;
	}

	set textAlign(value) {
		if (this.textAlign == value) return;
		this.textAlign = value;
		switch (value) { //justify-content: center;
			case 1:
				this.htmlImage.style.justifyContent = "flex-start";
				break;
			case 2:
				this.htmlImage.style.justifyContent = "center";
				break;
			case 3:
				this.htmlImage.style.justifyContent = "flex-end";
				break;
		}
	}


}


class BasicLine {

	constructor(svg, id, btn, img) {

		this.btn = btn;
		this.img = img;

		this.id = "line_" + id;

		// MAKE LINE
		// http://www.w3.org/2000/svg
		this.namespaceURL = decodeURIComponent(escape(window.atob("aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmc=")));

		this.htmlElement = svg;

		// <!--LINE-->
		this.htmlLine = document.createElementNS(this.namespaceURL, "svg");
		this.htmlLine.classList.add("connection_path");
		this.htmlElement.appendChild(this.htmlLine);

		this.htmlLine.setAttribute("stroke", "black");

		// SELECTION SUPPORT LINE
		this.htmlSupportLine = document.createElementNS(this.namespaceURL, "svg");
		this.htmlSupportLine.classList.add("connection_path");
		this.htmlSupportLine.classList.add("support_path");
		this.htmlElement.appendChild(this.htmlSupportLine);


		this.htmlLine.setAttribute("id", "C1_" + this.id);
		this.htmlSupportLine.setAttribute("id", "C2_" + this.id);

		this.initPoints();

		// this.dynamicCreate();
		// this.staticCreate();
		// this.updatePositions();

		this.pressed = false;

	}

	initPoints() {

		// POINT 1
		this.htmlP1 = document.createElementNS(this.namespaceURL, "circle");
		this.htmlP1.setAttribute("class", "PathCircle");
		this.htmlP1.setAttribute("r", 5);
		this.htmlP1.setAttribute("stroke", "transparent");
		this.htmlP1.setAttribute("fill", "transparent");
		this.htmlP1.setAttribute("stroke-width", 1);
		this.htmlP1.setAttribute("id", "P1_" + this.id);
		this.htmlElement.appendChild(this.htmlP1);
		// POINT 2
		this.htmlP2 = document.createElementNS(this.namespaceURL, "circle");
		this.htmlP2.setAttribute("class", "PathCircle");
		this.htmlP2.setAttribute("r", 5);
		this.htmlP2.setAttribute("stroke", "transparent");
		this.htmlP2.setAttribute("fill", "transparent");
		this.htmlP2.setAttribute("stroke-width", 1);
		this.htmlP2.setAttribute("id", "P1_" + this.id);
		this.htmlElement.appendChild(this.htmlP2);
	}

	updatePositions() {

		if (this.btn === null) {
			return;
		}

		if (this.img === null) {
			return;
		}

		this.p1x = this.btn.offsetLeft;
		this.p1y = this.btn.offsetTop;
		this.p2x = this.img.htmlElement.offsetLeft;
		this.p2y = this.img.htmlElement.offsetTop;

		this.setPos(this.p1x, this.p1y, this.p2x, this.p2y);
	}

	setPos(x, y, x2, y2) {
		let dx = Math.round(Math.abs(x - x2) / 2);
		dx = Math.max(100, dx);
		const d = "M " + x + " " + y + " C " + (x - dx) + " " + (y + 1) + " " + (x2 + dx) + " " + (y2 + 1) + " " + x2 + " " + y2;
		this.htmlLine.setAttribute("d", d);
		this.htmlSupportLine.setAttribute("d", d);
		this.htmlP1.setAttribute("cx", x);
		this.htmlP1.setAttribute("cy", y);
		this.htmlP2.setAttribute("cx", x2);
		this.htmlP2.setAttribute("cy", y2);
	}

	setPos2(x, y) {
		this.p1x = this.btn.offsetLeft;
		this.p1y = this.btn.offsetTop;
		this.p2x = x;
		this.p2y = y;
		let dx = Math.round(Math.abs(this.p1x - this.p2x) / 2);
		dx = Math.max(100, dx);
		const d = ("M " + this.p1x + " " + this.p1y + " C " + (this.p1x - dx) + " " + (this.p1y + 1) + " " + (this.p2x + dx) + " " + (this.p2y + 1) + " " + this.p2x + " " + this.p2y);
		this.htmlLine.setAttribute("d", d);
		this.htmlSupportLine.setAttribute("d", d);

	}

	focused(bool) {
		if (bool) {
			this.htmlLine.classList.add("focused");
			this.htmlElement.style.zIndex = 1;
			this.htmlP1.setAttribute("stroke", "orange");
			this.htmlP2.setAttribute("stroke", "orange");
		} else {
			this.htmlLine.classList.remove("focused");
			this.htmlElement.style.zIndex = 0;
			this.htmlP1.setAttribute("stroke", "transparent");
			this.htmlP2.setAttribute("stroke", "transparent");
		}
	}

	destroy() {

		this.htmlLine.remove();
		this.htmlSupportLine.remove();
		this.htmlP1.remove();
		this.htmlP2.remove();

		this.node1.removeLine(this);
		this.node2.removeLine(this);

	}


	mouseDown(event) {
		this.pressed = true;
	}

	mouseMove(event) {
		if (!this.pressed) {
			return;
		}
	}

	mouseUp(event) {
		this.pressed = false;
	}

	set name(value) {

	}

	set projectObject(value){ // NIKOLAYS
		this._projectObject = value;
	}
}