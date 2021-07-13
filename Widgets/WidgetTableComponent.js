class WidgetTable extends BaseWidget {

	constructor() {
		super();


	}

	onCreate() {
		this.addClassName("WidgetTable");
		this.inited = true;
		this.meta = {};
		this.maxCol = 3;
		this.maxRow = 3
		this.data = [];
		this.needHeadRow = true;
		this.fixHeadRow = true;
		this.needBorder = true;
		this.isNumberSort = false;
		this.needRowsNumber = true;
		this.needResize = false;
		this.canEditable = true;
		this.editing = false;
		this.currentInput = "";
		this.globalInput = "";
		this.viewLine = "";
		this.result = 0;
		this.resizeParams = {};
		this.scrollTop = 0;
		this.htmlElement.addEventListener("mousedown", e => {
			this.onMouseDown(e.clientX, e.clientY, e);
		});
		this.htmlElement.addEventListener("mouseup", e => {
			this.onMouseUp(e.clientX, e.clientY, e);
		});
		this.htmlElement.addEventListener("mousemove", e => {
			this.onMouseMove(e.clientX, e.clientY, e);
		});
		this.htmlElement.addEventListener("dblclick", e => {
			this.onMouseDoubleClick(e);
		});
		this.htmlElement.addEventListener("click", e => {
			this.onMouseClick(e);
		});
	}

	eventHandler(eventType, eventObject) {

		eventObject.persist();
		console.log(eventType, eventObject);
		let widgetWindow = null;
		for (let i = 1; i < idWidgets; i++) {
			widgetWindow = document.getElementById("divWindow_widget_" + i);
			if (widgetWindow) break;
		}
		if (widgetWindow) widgetWindow.parentThis.inverseEnableHeader();
		Module.Store.dispatch({
			'eventName': this.props.widgets[this.id].events[eventType],
			'value': eventObject
		});
	}

	render() {

		const widget = this.props.widgets[this.id];

		let eventAttributes = {};


		for (let eventName in widget.events) {
			eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
		}

		// return (
		// 	// Base Tab Html
		// 	<div 
		// 		id={this.id} 
		// 		className="WidgetTab"
		// 		{...attributes}
		// 		{...eventAttributes}
		// 	>
		// 		< div 
		// 			id={"headerElementTab_" + this.id} 
		// 			className= "WidgetTabHeader" 
		// 			>
		// 		</div>
		// 		< div 
		// 			id={"containerElementTab_" + this.id} 
		// 			className= "WidgetTabContainer"
		// 		 >
		// 		 </div>
		// 	</div>
		// );

	}

	onComponentDidMount() {

		// 	this.headerElement = document.getElementById("headerElementTab_" + this.id);
		// 	this.containerElement = document.getElementById("containerElementTab_" + this.id);
	}

	onCheckInit() {
		// for (let i = 0; i < this.children.length; ++i) {
		// 	if (Rex.widgets[this.children[i]] === undefined) return false;
		// }
		// return true;
	}

	addData(rowIndex, colIndex, text, colSpan = 1, rowSpan = 1) {
		if (rowIndex < 0 || colIndex < 0 || text === undefined || colSpan < 1 || rowSpan < 1) {
			console.error("not valid data");
			return;
		}
		if (rowIndex === 0 && rowSpan > 1 && this._needHeadRow === true) {
			console.error("can`t collapce head whis rows");
			return;
		}
		this.increaseTable(rowIndex, colIndex);
		this._data[rowIndex][colIndex] = text;
		if (rowSpan > 1) this.increaseTable(rowIndex + rowSpan - 1, colIndex);
		if (colSpan > 1) this.increaseTable(rowIndex, colIndex + colSpan - 1);
		this.remake();
	}

	removeData(rowIndex, colIndex) {
		if (rowIndex < 0 || colIndex < 0 || rowIndex > this.maxRow || colIndex > this.maxCol || this._data[rowIndex][colIndex] === undefined) {
			console.error("not valid data");
			return;
		}
		this._data[rowIndex][colIndex] = "";
		this.removeEmpty();
		this.remake();
	}

	removeEmpty() {
		let rows = [];
		let cols = [];
		for (let i = 0; i <= this._maxRow; ++i) {
			let flag = false;
			for (let j = 0; j <= this._maxCol; ++j) {
				if (this._data[i][j] !== "") {
					flag = true;
					break;
				}
			}
			if (flag === false) {
				rows.push(i);
			}
		}
		for (let i = 0; i <= this._maxCol; ++i) {
			let flag = false;
			for (let j = 0; j <= this._maxRow; ++j) {
				if (this._data[j][i] !== "") {
					flag = true;
					break;
				}
			}
			if (flag === false) {
				cols.push(i);
			}
		}
		for (let i = 0; i < rows.length; ++i) {
			this.removeDataRow(rows[i] - i);
		}
		for (let i = 0; i < cols.length; ++i) {
			this.removeDataCol(cols[i] - i);
		}
	}

	removeDataCol(index) {
		for (let i = 0; i <= this._maxRow; ++i) {
			this._data[i].splice(index, 1);
		}
		this._maxCol--;
	}


	removeDataRow(index) {
		this._data.splice(index, 1);
		this._maxRow--;
	}

	increaseTable(rowIndex, colIndex) {
		if (rowIndex > this._maxRow) {
			this.resize(this._data, rowIndex + 1, false);
			for (let i = this._maxRow + 1; i < rowIndex + 1; ++i) {
				this.resize(this._data[i], this._maxCol + 1, true);
			}
			this._maxRow = rowIndex;
		}
		if (colIndex > this._maxCol) {
			for (let i = 0; i < this._maxRow + 1; ++i) {
				this.resize(this._data[i], colIndex + 1, true);
			}
			this._maxCol = colIndex;
		}
	}

	resize(arr, newSize, defaultFlag) {
		while (newSize > arr.length)
			arr.push(defaultFlag ? '' : []);
		arr.length = newSize;
	}


	onGenerateContent(content) {
		//WARNING: Тут все на костылях. Сделал, как смог.
		const view = this;
		if (this.maxCol == -1 || this.maxRow == -1)
			return;

		const html = this.htmlElement;

		let thead = null;
		let tbody = null;

		//get header and body node
		if (this.needHeadRow) {
			if (this.fixHeadRow) {
				thead = html.children[1].children[0].children[0];
				tbody = html.children[1].children[0].children[1];
			} else {
				thead = html.children[0].children[0];
				tbody = html.children[0].children[1];
			}
		} else {
			tbody = html.children[0].children[0];
		}

		let table = content.table;

		const colIndex = this.maxCol + (this.needRowsNumber ? 2 : 1);
		for (let i = 0; i < this.maxRow + 1; ++i) {
			let rowHtml = null;

			if (thead != null && i !== 0)
				rowHtml = tbody.children[i - 1];
			else if (thead != null && i === 0)
				rowHtml = thead.children[i];
			else rowHtml = tbody.children[i];

			const rowSize = rowHtml.getBoundingClientRect();
			let rowContent = [];
			for (let j = 0; j < colIndex; ++j) {
				const cellHtml = rowHtml.children[j];
				const cellSize = cellHtml.getBoundingClientRect();
				const cellData = this.data[i][this.needRowsNumber ? j - 1 : j];
				if (i == 0) {
					table.widths.push(cellSize.Width);
				}

				if (cellData === '' || cellData == null) {
					rowContent.push({});
					continue;
				}

				const index = cellData.indexOf(':');
				if (index === -1)
					continue;

				const childId = parseInt(cellData.slice(index + 1));
				// const childWidget = Rex.widgets[childId];
				// if (childWidget == null)
				// 	continue;

				// childWidget.generateContent(rowContent);
				// let childObject = rowContent[j].table.body[0][0];
				// if (childObject.fillColor === '#ffffff' && this.needHeadRow && this.fixHeadRow && i === 0) {
				// 	childObject.fillColor = '#b7b7b7';
				// }
			}

			table.heights.push(rowSize.height);
			table.body.push(rowContent);
		}

		if (this.needRowsNumber) {
			for (let i = 0; i < this.maxRow + 1; ++i) {
				let rowHtml = null;

				if (thead != null && i !== 0)
					rowHtml = tbody.children[i - 1];
				else if (thead != null && i === 0)
					rowHtml = thead.children[i];
				else rowHtml = tbody.children[i];

				let bodyCell = table.body[i][0];
				bodyCell.margin = [0, 0, 0, 0];

				let htmlCell = rowHtml.children[0];

				generateText(htmlCell, bodyCell);
			}
		}

		let layout = content.layout;

		function vLineColor(i, node) {
			if (this.needBorder === false) {
				if (i !== 0)
					return '#ffffff';
			}

			return '#969696';
		}

		layout.vLineColor = vLineColor.bind(this);
		layout.hLineColor = '#969696';
		layout.vLineWidth = function () { return 1; };
		layout.hLineWidth = function () { return 1; };

		function fillColor(i, node, j) {
			if (this.needRowsNumber) {
				if (j === 0) {
					if (this.needHeadRow && i === 0)
						return '#b7b7b7';
					return mixColorWithOpacity('#000000', 0.08);
				}
			}

			if (this.needHeadRow && this.fixHeadRow && i === 0) {
				return '#b7b7b7';
			}
			return 'white'
		}

		layout.fillColor = fillColor.bind(this);
	}

	onMouseDown(x, y, event) {
		if (event.target.classList.contains("table-resizer")) {
			this.resizeParams.resizerClassList = event.target.classList;
			this.resizeParams.resizeElement = event.target.parentNode;
			this.resizeParams.nextResizeElement = this.resizeParams.resizeElement.nextElementSibling;
			this.resizeParams.previousResizeElement = this.resizeParams.resizeElement.previousElementSibling;
			this.resizeParams.resizeElementStartWidth = this.resizeParams.resizeElement.offsetWidth;
			this.resizeParams.nextResizeElementStartWidth = this.resizeParams.nextResizeElement ? this.resizeParams.nextResizeElement.offsetWidth : undefined;
			this.resizeParams.previousResizeElementStartWidth = this.resizeParams.previousResizeElement ? this.resizeParams.previousResizeElement.offsetWidth : undefined;
			this.resizeParams.startMovePos = event.pageX;
		}
		if (this.getParentElementByClass(event.target, "sort-baton")) {
			let sort = this.getParentElementByClass(event.target, "sort-baton");
			let batons = this.htmlElement.querySelectorAll('.sort-baton');
			let indicator = sort.querySelector('.indicator');
			if (this.sort(indicator.classList.contains("indicator-up"), this.needRowsNumber ? this.getParentElementByTag(sort, 'th').cellIndex - 1 :
				this.getParentElementByTag(sort, 'th').cellIndex, this.isNumberSort, event.target)) {
				for (let i = 0; i < batons.length; ++i) {
					if (!batons[i].classList.contains('default')) {
						batons[i].classList.toggle('default');
						this.composeObj(this.meta, this.joinTextToCompose("rows", "0", "cols", this.needRowsNumber ? this.getParentElementByTag(batons[i], 'th').cellIndex - 1 :
							this.getParentElementByTag(batons[i], 'th').cellIndex, "sort", "default"), "true");
					}
				}
				sort.classList.toggle('default');
				this.composeObj(this.meta, this.joinTextToCompose("rows", "0", "cols", this.needRowsNumber ? this.getParentElementByTag(sort, 'th').cellIndex - 1 :
					this.etParentElementByTag(sort, 'th').cellIndex, "sort", "default"), "none");
				indicator.classList.toggle("indicator-up");
				indicator.classList.toggle("indicator-down");
				if (indicator.classList.contains("indicator-up"))
					this.composeObj(this.meta, this.joinTextToCompose("rows", "0", "cols", this.needRowsNumber ? this.getParentElementByTag(sort, 'th').cellIndex - 1 :
						this.getParentElementByTag(sort, 'th').cellIndex, "sort", "indicator"), "indicator-up");
				else
					this.composeObj(this.meta, this.joinTextToCompose("rows", "0", "cols", this.needRowsNumber ? this.getParentElementByTag(sort, 'th').cellIndex - 1 :
						this.getParentElementByTag(sort, 'th').cellIndex, "sort", "indicator"), "indicator-down");
				// Rex.callRpcMethod('Widgets', this.id, this.type, 'setMetaJson', [JSON.stringify(this.meta)]);
			}
		}
	}

	sort(isUp, index, isNumberSort, baton) {
		if (this.meta) {
			if (this.haveColRowSpan("You can't sort merged cells")) {
				baton.style = "pointer-events: none; opacity: 0.4;";
				return false;
			}
		}
		let head = "";
		if (this.needHeadRow) head = this.data.splice(0, 1);
		this.data.sort(function (a, b) {
			let first = a[index];
			let second = b[index];
			let aId = Number.parseInt(a[index].substring("WidgetInTableId:".length));
			// if (!isNaN(aId)) {
			// 	first = Rex.widgets[aId];
			// 	if (first) {
			// 		first = first.text;
			// 	} else {
			// 		first = a[index];
			// 	}
			// }
			let bId = Number.parseInt(b[index].substring("WidgetInTableId:".length));
			// if (!isNaN(bId)) {
			// second = Rex.widgets[bId];
			// if (second) {
			// 		second = second.text;
			// 	}
			// 	else {
			// 		second = second[index];
			// 	}
			// }
			if (first === undefined) {
				if (second === undefined) {
					return 0;
				} else {
					return 1;
				}
			} else {
				if (isNumberSort)
					return isUp ? first - second : second - first;
				else {
					if (first > second) {
						return isUp ? 1 : -1;
					}
					if (first < second) {
						return isUp ? -1 : 1;
					}
					return 0;
				}
			}
		});
		if (this.needHeadRow) this.data.splice(0, 0, head[0]);
		this.remake();
		// Rex.callRpcMethod('Widgets', this.id, this.type, 'setDataJson', [JSON.stringify(this.data)]);
		return true;
	}

	onMouseMove(x, y, event) {
		if (this.resizeParams.resizeElement) {
			this.resizeTable(this.resizeParams.resizerClassList.contains("table-resizer-right"));
		}
	}

	resizeTable(isRight) {
		let resizeElementWidth = this.resizeParams.resizeElementStartWidth +
			(isRight ? event.pageX + (isRight ? - this.resizeParams.startMovePos
				: this.resizeParams.startMovePos)
				: - event.pageX + (isRight ? - this.resizeParams.startMovePos :
					this.resizeParams.startMovePos));
		let difElementWidth = isRight ?
			this.resizeParams.nextResizeElementStartWidth + (isRight ?
				- event.pageX + (isRight ?
					this.resizeParams.startMovePos :
					- this.resizeParams.startMovePos) :
				event.pageX + (isRight ?
					this.resizeParams.startMovePos :
					- this.resizeParams.startMovePos)) :
			this.resizeParams.previousResizeElementStartWidth + (isRight ?
				- event.pageX + (isRight ?
					this.resizeParams.startMovePos :
					- this.resizeParams.startMovePos) :
				event.pageX + (isRight ?
					this.resizeParams.startMovePos :
					- this.resizeParams.startMovePos));
		if (resizeElementWidth > 5 && difElementWidth > 5) {
			this.resizeParams.resizeElement.style.width = resizeElementWidth + 'px';
			isRight ? this.resizeParams.nextResizeElement.style.width = difElementWidth + 'px' : this.resizeParams.previousResizeElement.style.width = difElementWidth + 'px';
			if (this.fixHeadRow) {
				let hiddenRow = this.htmlElement.querySelector('.content-container .table-container').firstElementChild.firstElementChild;
				hiddenRow.children[this.resizeParams.resizeElement.cellIndex].style.width = resizeElementWidth + 'px';
				if (isRight) {
					hiddenRow.children[this.resizeParams.nextResizeElement.cellIndex].style.width = difElementWidth + 'px';
				} else {
					hiddenRow.children[this.resizeParams.previousResizeElement.cellIndex].style.width = difElementWidth + 'px';
				}
			}
		}
	}

	onMouseUp(x, y, event) {
		if (JSON.stringify(this.resizeParams) !== "{}") {
			let elem = this.resizeParams.resizeElement.querySelector('.table-content');
			let cellIndex = this.needRowsNumber ? elem.parentNode.cellIndex - 1 : elem.parentNode.cellIndex;
			let rowIndex = elem.parentNode.parentNode.rowIndex;
			this.composeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "cols", cellIndex, "styles", "width"), this.resizeParams.resizeElement.style.width);
			if (this.resizeParams.nextResizeElement) {
				let nextElem = this.resizeParams.nextResizeElement.querySelector('.table-content');
				let cellIndex = this.needRowsNumber ? nextElem.parentNode.cellIndex - 1 : nextElem.parentNode.cellIndex;
				let rowIndex = nextElem.parentNode.parentNode.rowIndex;
				this.composeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "cols", cellIndex, "styles", "width"), this.resizeParams.nextResizeElement.style.width);
			}
			if (this.resizeParams.previousResizeElement && !this.resizeParams.previousResizeElement.classList.contains('numbers')) {
				let prevElem = this.resizeParams.previousResizeElement.querySelector('.table-content');
				let cellIndex = this.needRowsNumber ? prevElem.parentNode.cellIndex - 1 : prevElem.parentNode.cellIndex;
				let rowIndex = prevElem.parentNode.parentNode.rowIndex;
				this.composeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "cols", cellIndex, "styles", "width"), this.resizeParams.previousResizeElement.style.width);
			}
			this.resizeParams = {};
			// Rex.callRpcMethod('Widgets', this.id, this.type, 'setMetaJson', [JSON.stringify(this.meta)]);
		}
	}

	haveColRowSpan(errorMessage = "") {
		let key;
		let rows = this.decomposeObj(this.meta, this.joinTextToCompose("rows"));
		for (key in rows) {
			let key1;
			let cols = this.decomposeObj(rows, this.joinTextToCompose(key, "cols"));
			for (key1 in cols) {
				if (dthis.ecomposeObj(cols, this.joinTextToCompose(key1, "attributes", "colSpan")) || this.decomposeObj(cols, this.joinTextToCompose(key1, "attributes", "rowSpan"))) {
					// Rex.gui.notificationManager.message(errorMessage, "error");
					console.error(errorMessage);
					return true;
				}
			}
		}
		return false;
	}

	onMouseClick(event) {
		if (this.canEditable) {
			if (this.editing) {
				let content;
				let row;
				let cell;
				if (event.target.classList.contains("table-content")) {
					row = event.target.parentElement.parentElement.rowIndex;
					cell = event.target.parentElement.cellIndex - 1;
					content = this.data[row][cell];
				}
				else if (event.target.firstElementChild) if (event.target.firstElementChild.classList.contains("table-content"))
					content = event.target.firstElementChild;
				else if (event.target.parentElement) if (event.target.parentElement.classList.contains("table-content"))
					content = event.target.parentElement;
				if (!content) return;

				console.log(this.data);

				console.log('Строка - ', row);
				console.log('Столбец - ', cell);
				console.log('Содержимое - ', content[0]);

				let add = "|" + cell + "," + row + "|";

				this.viewLine.text += add;

				this.currentInput.value += add;

				this.globalInput.inputElement.value += add;

				

				for (let i = 0; i < this.viewLine.wordsArr.length; i++) {
					this.viewLine.wordsArr[i].addEventListener('mouseover', e => {
						let arr = this.viewLine.wordsArr[i].textContent.split(',');
						this.htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[Number(arr[1]) - 1].childNodes[Number(arr[0]) + 1].style.background = 'red';
					});
					this.viewLine.wordsArr[i].addEventListener('mouseout', e => {
						let arr = this.viewLine.wordsArr[i].textContent.split(',');
						this.htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[Number(arr[1]) - 1].childNodes[Number(arr[0]) + 1].style.background = 'white';
					});
				}

				this.currentInput.focus();

				console.log(event);
			}
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

	onMouseDoubleClick(event) {
		if (this.canEditable) {
			let content
			if (event.target.classList.contains("table-content"))
				content = event.target;
			else if (event.target.firstElementChild.classList.contains("table-content"))
				content = event.target.firstElementChild;
			else if (event.target.parentElement.classList.contains("table-content"))
				content = event.target.parentElement;
			if (!content) return;
			if (content.id.indexOf("t-") !== -1) {
				// Rex.gui.notificationManager.message("You can not edit cell with wiget", "error");
				return;
			}



			content.style.display = "none";
			let textArea = document.createElement("textarea");
			textArea.textContent = content.textContent;
			textArea.style.resize = "none";
			textArea.style.border = "none";
			textArea.style.width = "100%";
			textArea.style.height = "100%";
			textArea.style.padding = "0";
			textArea.style.font = "inherit";
			this.currentInput = textArea;
			content.parentElement.appendChild(textArea);
			textArea.focus();

			textArea.onkeypress = (e) => {
				//if (textArea.value.split()[0] == "="	) {
				if (!e) e = window.event;
				var keyCode = e.code || e.key;
				if (keyCode == "Equal") { debugger;
					if (!this.editing) {
						const input = new widgetsComponentsTypes["input"];
						input.htmlElement.style.width = this.htmlElement.clientWidth + 'px';
						input.htmlElement.style.height = '40px';
						input.htmlElement.style.zIndex = 5000;
						input.htmlElement.style.position = "absolute";
						input.htmlElement.style.left = this.htmlElement.offsetLeft + 'px';
						input.htmlElement.style.top = this.htmlElement.offsetTop - 40 + 'px';
						input.htmlElement.style.background = "white";
						this.globalInput = input;

						input.inputElement.oninput = (e) => {
							this.currentInput.value = this.globalInput.inputElement.value;

							//this.globalInput.inputElement.value = this.currentInput.value;

							this.viewLine.text = this.globalInput.inputElement.value;
						}

						const text = new widgetsComponentsTypes["text"];
						text.htmlElement.style.width = this.htmlElement.clientWidth + 'px';
						text.htmlElement.style.height = '40px';
						text.htmlElement.style.zIndex = 5000;
						text.htmlElement.style.position = "absolute";
						text.htmlElement.style.left = this.htmlElement.offsetLeft + 'px';
						text.htmlElement.style.top = this.htmlElement.offsetTop - 80 + 'px';
						text.htmlElement.style.background = "grey";
						this.viewLine = text;

						this.editing = true;
						textArea.focus();
					}
				}
				if (keyCode == 'Enter') {
					if (this.editing) {
						let arr = textArea.value.split("|");
						for (let i = 0; i < arr.length; i++) {
							if (i % 2 == 1) {
								let value = arr[i].split(',');
								arr[i] = this.data[value[1]][value[0]][0];
							}
						}
						textArea.value = arr.join('');
						this.result = eval(textArea.value.substring(1));
						textArea.value = this.result;
						this.deleteElement(this.globalInput.id);
						this.deleteElement(this.viewLine.id);
					} else {
						this.result = textArea.value;
					}

					content.textContent = this.result;
					this.data[content.parentElement.parentElement.rowIndex][this.needRowsNumber ? content.parentElement.cellIndex - 1 : content.parentElement.cellIndex] = this.result;




					textArea.abc();



				}




				//}

			}
			textArea.oninput = (e) => {
				content.textContent = e.target.value;
				this.data[content.parentElement.parentElement.rowIndex][this.needRowsNumber ? content.parentElement.cellIndex - 1 : content.parentElement.cellIndex] = e.target.value;

				if (this.editing) {
					this.globalInput.inputElement.value = e.target.value;

					this.viewLine.text = e.target.value;
					console.log(e);

					for (let i = 0; i < this.viewLine.wordsArr.length; i++) {
						this.viewLine.wordsArr[i].addEventListener('mouseover', e => {
							let arr = this.viewLine.wordsArr[i].textContent.split(',');
							this.htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[Number(arr[1]) - 1].childNodes[Number(arr[0]) + 1].style.background = 'red';
						});
						this.viewLine.wordsArr[i].addEventListener('mouseout', e => {
							let arr = this.viewLine.wordsArr[i].textContent.split(',');
							this.htmlElement.childNodes[1].childNodes[0].childNodes[1].childNodes[Number(arr[1]) - 1].childNodes[Number(arr[0]) + 1].style.background = 'white';
						});
					}
				}
			}
			textArea.abc = () => {
				this.editing = false;
				let str = JSON.stringify(this.data);
				let re = /\\n/gi;
				// Rex.callRpcMethod('Widgets', this.id, this.type, 'setDataJson', [str.replace(re, ' ')]);
				content.style.display = "";
				textArea.remove();
			}
		}
	}

	//press enter event


	appendChild(child) {
		let content = document.getElementById("t-" + child.id);
		if (!content) content = document.getElementById("t-" + child.id.replace("div", ""));
		if (content)
			content.appendChild(child);
	}

	set maxCol(value) {
		this._maxCol = value;
		if (!this.inited) return;
		this.remake();
	}

	get maxCol() { return this._maxCol };

	set maxRow(value) {
		this._maxRow = value;
		if (!this.inited) return;
		this.remake();
	}

	get maxRow() { return this._maxRow };

	set meta(value) {
		this._meta = value;
		if (!this.inited) return;
		this.remake();
	}

	get meta() { return this._meta; }

	set data(value) {
		this._data = value;
		if (!this.inited) return;
		this.remake();
	}

	get data() { return this._data; }

	set fixHeadRow(value) {
		this._fixHeadRow = value;
		if (!this.inited) return;
		this.remake();
	}

	get fixHeadRow() { return this._fixHeadRow; }

	set needBorder(value) {
		this._needBorder = value;
		if (!this.inited) return;
		this.remake();
	}

	get needBorder() { return this._needBorder; }

	set needHeadRow(value) {
		this._needHeadRow = value;
		if (!this.inited) return;
		this.remake();
	}

	get needHeadRow() { return this._needHeadRow; }

	set needRowsNumber(value) {
		this._needRowsNumber = value;
		if (!this.inited) return;
		this.remake();
	}

	get needRowsNumber() { return this._needRowsNumber; }

	set needResize(value) {
		this._needResize = value;
		if (!this.inited) return;
		this.remake();
	}

	get needResize() { return this._needResize; }

	set canEditable(value) {
		this._canEditable = value;
		if (!this.inited) return;
		this.remake();
	}

	get canEditable() { return this._canEditable; }

	onSetState(state) {
		if (state.needHeadRow != null) this.needHeadRow = state.needHeadRow;
		if (state.isNumberSort != null) this.isNumberSort = state.isNumberSort;
	}

	// onInit() {
	// 	for (let i = 0; i < this.children.length; ++i) {
	// 		Rex.widgets[this.children[i]].height = undefined;
	// 		Rex.widgets[this.children[i]].width = undefined;
	// 	}
	// 	this.remake();
	// }

	remake() {
		this.htmlElement.style.backgroundImage = "";
		this.resortByOrder();
		this.needHeadRow ? this.scrollTop = (document.querySelector('.content-container') ? document.querySelector('.content-container').scrollTop : 0) : this.scrollTop = this.htmlElement.scrollTop;
		while (this.htmlElement.firstChild) {
			this.htmlElement.removeChild(this.htmlElement.firstChild);
		}
		if (this.data != null && this.data.length) {
			this.htmlElement.setAttribute("contenteditable", "false");
			if (this.fixHeadRow && this.needHeadRow) {
				this.makeFixHeadTable();
			} else {
				this.htmlElement.style.display = 'block';
				if (this.needHeadRow) {
					this.makeHeadTable();
				} else
					this.makeTable();
			}
		} else {
			this.htmlElement.style.backgroundImage = "url(https://cdn2.iconfinder.com/data/icons/large-svg-icons/512/datasheet_database_data_sheet-512.png)";
		}
	}

	makeFixHeadTable() {
		let headerContainer = document.createElement("div");
		headerContainer.classList.add("header-container");
		let headTableContainer = document.createElement("table");
		headTableContainer.classList.add("table-container", "fix-head");
		headerContainer.appendChild(headTableContainer);
		let head = document.createElement("thead");
		this.makeHead(head);
		headTableContainer.appendChild(head);
		this.htmlElement.appendChild(headerContainer);
		let contentContainer = this.makeContentContainer();
		this.htmlElement.appendChild(contentContainer);
		contentContainer.scrollTop = this.scrollTop;
	}

	makeContentContainer() {
		let contentContainer = document.createElement("div");
		contentContainer.classList.add("content-container");
		let tableContainer = document.createElement("table");
		tableContainer.classList.add("table-container");
		contentContainer.appendChild(tableContainer);
		let tableHead = document.createElement("thead");
		this.makeHead(tableHead, true);
		tableContainer.appendChild(tableHead);
		let tableBody = document.createElement("tbody");
		this.makeBody(tableBody);
		tableContainer.appendChild(tableBody);
		return contentContainer;
	}

	makeHead(parent, fake = false) {
		let row = document.createElement("tr");
		row.classList.add("header-row");
		this.makeHeadCols(row, fake);
		parent.appendChild(row);
		this.appendRowAttribute(0, row);
		this.appendContentRowAttribute(0, row);
	}

	makeHeadCols(parent, fake) {
		let head = this.data[0];
		if (this.needRowsNumber) {
			let colHead = document.createElement("th");
			colHead.classList.add('numbers');
			colHead.classList.add('first');
			colHead.textContent = '#';
			parent.appendChild(colHead);
		}
		for (let i = 0; i < head.length; ++i) {
			let colHead = document.createElement("th");
			if (this.needBorder && i !== (head.length - 1)) colHead.classList.add('border-need');
			if (i === 0) {
				this.makeColsParams(colHead, head, i, fake, "table-resizer-right");
			} else if (i === head.length - 1) {
				this.makeColsParams(colHead, head, i, fake, "table-resizer-left");
			} else {
				this.makeColsParams(colHead, head, i, fake, "");
			}
			parent.appendChild(colHead);
		}
	}

	makeColsParams(colHead, head, index, fake, resizerClass) {
		if (resizerClass === "table-resizer-left") colHead.classList.add("last-col");
		if (resizerClass === "table-resizer-right") colHead.classList.add("first-col");
		if (!this.needResize) colHead.classList.add("resize-off");
		let resizer = document.createElement("div");
		resizerClass !== "" ? resizer.classList.add("table-resizer", resizerClass) : resizer.classList.add("table-resizer", "table-resizer-left");
		colHead.appendChild(resizer);
		let content = document.createElement("div");
		content.classList.add("table-content");
		this.appendAllAttribute(colHead);
		this.appendContentAllAttribute(content);
		this.appendCellAttribute(0, index, colHead);
		if (head[index].length) {
			if (!head[index].indexOf("WidgetInTableId:")) {
				let id = Number.parseInt(head[index].substring("WidgetInTableId:".length));
				if (!isNaN(id)) {
					this.appendContentCellAttribute(id, content);
					content.id = "t-" + id;
					// if (Rex.widgets[id]) {
					// 	Rex.widgets[id].htmlElement.style.flex = 1;
					// 	content.appendChild(fake ? Rex.widgets[id].htmlElement.cloneNode(true) : Rex.widgets[id].htmlElement);
					// }
				}
			} else {
				content.textContent = head[index];
			}
		}
		if (resizerClass === "") {
			let rightResizer = document.createElement("div");
			rightResizer.classList.add("table-resizer", "table-resizer-right");
			colHead.appendChild(rightResizer);
		}
		this.createSortBaton(0, index, content);
		colHead.appendChild(content);
	}

	createSortBaton(rowIndex, colIndex, parent) {
		let attribute;
		let attributes = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "cols", colIndex, "sort"));
		if (attributes) {
			let sortBaton = document.createElement("div");
			sortBaton.classList.add("sort-baton");
			sortBaton.classList.add("default");
			let stem = document.createElement("div");
			stem.classList.add("stem");
			let indicator = document.createElement("div");
			indicator.classList.add("indicator");
			indicator.classList.add("indicator-up");
			let pointerLeft = document.createElement("div");
			pointerLeft.classList.add("pointer-left");
			let pointerRight = document.createElement("div");
			pointerRight.classList.add("pointer-right");
			let pointerMiddle = document.createElement("div");
			pointerMiddle.classList.add("pointer-middle");
			indicator.appendChild(pointerLeft);
			indicator.appendChild(pointerRight);
			indicator.appendChild(pointerMiddle);
			sortBaton.appendChild(indicator);
			sortBaton.appendChild(stem);
			parent.appendChild(sortBaton);
			for (attribute in attributes) {
				if (attribute === "default") {
					if (attributes[attribute] === "none") {
						sortBaton.classList.toggle("default");
					}
				} else if (attribute === "indicator") {
					if (attributes[attribute] === "indicator-down") {
						indicator.classList.toggle("indicator-up");
						indicator.classList.toggle("indicator-down");
					}
				}
			}
		}
	}

	makeBody(parent) {
		for (let i = this.needHeadRow ? 1 : 0; i < this.data.length; ++i) {
			let row = document.createElement('tr');
			this.makeCols(i, row);
			parent.appendChild(row);
			this.appendRowAttribute(i, row);
			this.appendContentRowAttribute(i, row);
		}
	}

	resortByOrder() {
		if (this.data != null && this.data.length && !this.haveColRowSpan("You can't make order merged cells")) {
			let arrOrderRow = [];
			let first;
			for (let i = 0; i < this.data.length; ++i) {
				let order = this.decomposeObj(this.meta, this.joinTextToCompose("rows", i, "order"));
				arrOrderRow[i] = order ? order : 0;
			}
			if (this.needHeadRow) {
				arrOrderRow[0] = -100000;
			}
			let flag = this.letsSort(arrOrderRow, false);
			let arrOrderCol = [];
			for (let i = 0; i < this.data[0].length; ++i) {
				let order = this.decomposeObj(this.meta, this.joinTextToCompose("rows", 0, "cols", i, "order"));
				arrOrderCol[i] = order ? order : 0;
			}
			// if (this.letsSort(arrOrderCol, true) || flag) {
			// 	Rex.callRpcMethod('Widgets', this.id, this.type, 'setDataJson', [JSON.stringify(this.data)]);
			// 	Rex.callRpcMethod('Widgets', this.id, this.type, 'setMetaJson', [JSON.stringify(this.meta)]);
			// }
		}
	}

	letsSort(a, cols) { //Сортировка подсчётом (обратная)
		let n = a.length, count = [], b = [];
		for (let i = 0; i < n; i++) count[i] = 0;
		for (let i = n - 1; i > 0; i--) {
			for (let j = i - 1; j > -1; j--) {
				if (a[i] < a[j]) count[j]++;
				else count[i]++;
			}
		}
		let retData = [];
		let retMeta = {};
		if (this.decomposeObj(this.meta, "all"))
			this.composeObj(retMeta, "all", this.decomposeObj(this.meta, "all"));
		if (cols) {
			for (let i = 0; i < n; i++) {
				b[count[i]] = a[i];
				for (let j = 0; j < this.data.length; ++j) {
					if (!retData[j]) retData[j] = [];
					retData[j][count[i]] = this.data[j][count[i]];
					if (this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "cols", i)))
						this.composeObj(retMeta, this.joinTextToCompose("rows", j, "cols", count[i]), this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "cols", i)));
					if (i === 0) {
						if (this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "content")))
							this.composeObj(retMeta, this.joinTextToCompose("rows", j, "content"), this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "content")));
						if (this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "order")))
							this.composeObj(retMeta, this.joinTextToCompose("rows", j, "order"), this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "order")));
						if (this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "styles")))
							this.composeObj(retMeta, this.joinTextToCompose("rows", j, "styles"), this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "styles")));
						if (this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "attribures")))
							this.composeObj(retMeta, this.joinTextToCompose("rows", j, "attribures"), this.decomposeObj(this.meta, this.joinTextToCompose("rows", j, "attribure")));
					}
				}
			}

		} else {
			for (let i = 0; i < n; i++) {
				b[count[i]] = a[i];
				retData[count[i]] = this.data[i];
				if (this.decomposeObj(this.meta, this.joinTextToCompose("rows", i)))
					this.composeObj(retMeta, this.joinTextToCompose("rows", count[i]), this.decomposeObj(this.meta, this.joinTextToCompose("rows", i)));
			}
		}
		this._meta = retMeta;
		if (this.data.join(',') === retData.join(',')) {
			this._data = retData;
			return false;
		}
		this._data = retData;
		return true;
	}

	makeCols(rowIndex, parent) {
		if (this.needRowsNumber) {
			let colHead = document.createElement("td");
			colHead.textContent = rowIndex;
			colHead.classList.add('numbers');
			parent.appendChild(colHead);
		}
		for (let i = 0; i < this.data[rowIndex].length; ++i) {
			let cell = document.createElement('td');
			let content = document.createElement("div");
			content.classList.add("table-content");
			cell.appendChild(content);
			if (this.needBorder && i !== (this.data[rowIndex].length - 1)) cell.classList.add('border-need');
			this.appendAllAttribute(cell);
			this.appendContentAllAttribute(content);
			this.appendCellAttribute(rowIndex, i, cell);
			if (this.data[rowIndex][i].length) {
				if (!this.data[rowIndex][i].indexOf("WidgetInTableId:")) {
					let id = Number.parseInt(this.data[rowIndex][i].substring("WidgetInTableId:".length));
					if (!isNaN(id)) {
						this.appendContentCellAttribute(id, content);
						content.id = "t-" + id;
						// if (Rex.widgets[id])
						// 	content.appendChild(Rex.widgets[id].htmlElement);
					}
				} else {
					content.textContent = this.data[rowIndex][i];
				}
			}
			parent.appendChild(cell);
		}
	}

	appendCellAttribute(rowIndex, colIndex, cell) {
		let attribute;
		let attributes = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "cols", colIndex, "attributes"));
		for (attribute in attributes) {
			cell.setAttribute(attribute, attributes[attribute]);
		}
		let style;
		let styles = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "cols", colIndex, "styles"));
		for (style in styles) {
			cell.style[style] = styles[style];
		}
	}

	appendAllAttribute(cell) {
		let attribute;
		let attributes = this.decomposeObj(this.meta, this.joinTextToCompose("all", "attributes"));
		for (attribute in attributes) {
			cell.setAttribute(attribute, attributes[attribute]);
		}
		let style;
		let styles = this.decomposeObj(this.meta, this.joinTextToCompose("all", "styles"));
		for (style in styles) {
			cell.style[style] = styles[style];
		}
	}

	appendRowAttribute(rowIndex, row) {
		let attribute;
		let attributes = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "attributes"));
		for (attribute in attributes) {
			row.setAttribute(attribute, attributes[attribute]);
		}
		let style;
		let styles = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "styles"));
		for (style in styles) {
			row.style[style] = styles[style];
		}
	}

	appendContentCellAttribute(widgetId, content) {
		let attribute;
		let attributes = this.decomposeObj(this.meta, this.joinTextToCompose(widgetId, "attributes"));
		for (attribute in attributes) {
			content.setAttribute(attribute, attributes[attribute]);
		}
		let style;
		let styles = this.decomposeObj(this.meta, this.joinTextToCompose(widgetId, "styles"));
		for (style in styles) {
			content.style[style] = styles[style];
		}
	}

	appendContentAllAttribute(content) {
		let attribute;
		let attributes = this.decomposeObj(this.meta, this.joinTextToCompose("all", "content", "attributes"));
		for (attribute in attributes) {
			content.setAttribute(attribute, attributes[attribute]);
		}
		let style;
		let styles = this.decomposeObj(this.meta, this.joinTextToCompose("all", "content", "styles"));
		for (style in styles) {
			content.style[style] = styles[style];
		}
	}

	appendContentRowAttribute(rowIndex, row) {
		for (let i = 0; i < row.childNodes.length; ++i) {
			let attribute;
			let attributes = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "content", "attributes"));
			for (attribute in attributes) {
				row.childNodes[i].querySelector('.table-content').setAttribute(attribute, this.meta.rows[rowIndex].attributes[attribute]);
			}
			let style;
			let styles = this.decomposeObj(this.meta, this.joinTextToCompose("rows", rowIndex, "content", "styles"));
			for (style in styles) {
				row.childNodes[i].querySelector('.table-content').style[style] = styles[style];
			}
		}
	}

	makeHeadTable() {
		let table = document.createElement('table');
		table.classList.add("table-container");
		let head = document.createElement('thead');
		this.makeHead(head);
		table.appendChild(head);
		let body = document.createElement('tbody');
		this.makeBody(body);
		table.appendChild(body);
		this.htmlElement.appendChild(table);
	}

	makeTable() {
		let table = document.createElement('table');
		table.classList.add("table-container");
		let body = this.makeTbody();
		table.appendChild(body);
		this.htmlElement.scrollTop = this.scrollTop;
		this.htmlElement.appendChild(table);
	}

	makeTbody() {
		let body = document.createElement('tbody');
		this.makeBody(body);
		return body;
	}

	removeChild(node) {
		let content = document.getElementById("t-" + node.id);
		if (!content) content = document.getElementById("t-" + node.id.replace("div", ""));
		if (content)
			content.removeChild(node);
	}

	checkSelect(event, parentId) {
		// for (let _widgetID of this.children) {
		// 	let ret = Rex.widgets[_widgetID] ? Rex.widgets[_widgetID].checkSelect(event, parentId) : undefined;
		// 	if (ret) return ret;
		// }
		return this.hover ? this.widget : undefined;
	}

	decomposeObj(obj, string) {
		return string.split(".").reduce((accumulator, currentValue) => {
			if (accumulator == null) return undefined;
			return accumulator[currentValue];
		}, obj);
	}

	composeObj(obj, string, value) {
		string.split(".").reduce((accumulator, currentValue, index, array) => {
			if (accumulator[currentValue] == null) accumulator[currentValue] = {};
			if (index === array.length - 1) accumulator[currentValue] = value;
			return accumulator[currentValue];
		}, obj);
		return obj;
	}

	joinTextToCompose() {
		let ret = "";
		let arg;
		for (arg in arguments) {
			ret += arguments[arg];
			ret += ".";
		}
		return ret.slice(0, -1);
	}

	getParentElementByTag(currentElem, tag) {
		while (currentElem.tagName !== tag && currentElem.localName !== tag) {
			if (currentElem.parentNode == null || currentElem.parentNode.classList == null) {
				return null;
			} else
				currentElem = currentElem.parentNode;
		}
		return currentElem;
	}

	/**
	 * @param currentElem
	 * @param className - elem from class list
	 */
	getParentElementByClass(currentElem, className) {
		while (!currentElem.classList.contains(className)) {
			if (currentElem.parentNode == null || currentElem.parentNode.classList == null) {
				return null;
			} else
				currentElem = currentElem.parentNode;
		}
		return currentElem;
	}

}
