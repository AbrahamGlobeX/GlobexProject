class WidgetLayoutGrid extends WidgetLayout {
  constructor() {
    super();

    this.hovered_widget = null;
    this.hovered_widget_cell = null;
    this.resizeCell = null;
    this.lastResizer = null;
    // this.createDomElement("div");
    this.htmlElement.classList.add("WidgetLayoutGrid");

    this.inited = false;

    //Контейнер для виджетов, которые прилетели до инита грида
    this.WIDGETS = [];

    this.scrollGridParamX = false;
    this.scrollGridParamY = false;

    this.gridItems = [];
  }

  eventHandler(eventType, eventObject) {
    eventObject.persist();
    console.log(
      "eventHandler",
      eventType,
      eventObject.target.value,
      eventObject.target
    );
    Module.Store.dispatch({
      eventName: this.props.widgets[this.id].events[eventType],
      value: eventObject,
    });
  }

  render() {
    const widget = this.props.widgets[this.id];

    let eventAttributes = {};

    for (let eventName in widget.events) {
      eventAttributes[eventName] = (event) =>
        this.eventHandler(eventName, event);
    }

    // return (
    // 	// Base LayoutGrid Html
    // 	<div
    // 		id={this.id}
    // 		className="WidgetLayoutGrid"
    // 		{...widget.attributes}
    // 		{...eventAttributes}
    // 	>
    // 	</div>
    // );
  }

  onComponentDidMount() {}

  appendChild(child) {
    if (!this.contains(child)) {
      if (this.inited === true) {
        let cell = this.getCellByChild(child);
        if (cell == null && !this.WIDGETS.includes(child)) {
          this.WIDGETS.push(child);
          return;
        }
        cell.appendChild(child);
        this.gridItems.push(child);
      } else if (this.inited === false) {
        if (!this.WIDGETS.includes(child)) this.WIDGETS.push(child);
      }
    }
  }

  generateGridTemplateRows() {
    let grid_template_rows = "";
    let sum = 0;
    for (let i = 0; i < this.countRow; ++i) {
      const val = this._templateRow[i] * 100;
      if (i !== this.countRow - 1) grid_template_rows += Math.abs(val) + "%";
      else grid_template_rows += "auto";
      sum += val;
    }
    this.htmlElement.style.gridTemplateRows = grid_template_rows;
  }

  generateGridTemplateColumns() {
    let lessZero = [];
    let grid_template_columns = "";
    let sum = 0;
    for (let i = 0; i < this.countCol; ++i) {
      const val = this._templateCol[i] * 100;
      if (val < 0) lessZero.push(val);
      if (i !== this.countCol - 1) grid_template_columns += Math.abs(val) + "%";
      else grid_template_columns += "auto";
      sum += val;
    }
    this.htmlElement.style.gridTemplateColumns = grid_template_columns;
  }

  initGrid(row, col, indexR = 0, indexC = 0) {
    for (let i = indexR; i < row; i++) {
      for (let j = indexC; j < col; j++) {
        let cell = document.createElement("div");
        cell.classList.add("LayoutGridCell");

        cell.parentId = this.id;
        cell.row = i;
        cell.col = j;

        let cellPadding = this.cellPaddings[i][j];

        cell = this.setCellData(cell, cellPadding);

        this.htmlElement.appendChild(cell);
        this.createResizersForCell(row, col, cell);
      }
    }
    this.inited = true;

    //После инита пробегаем по массиву и добавляем виджеты на свои позиции
    if (this.WIDGETS.length !== 0) {
      for (let i = 0; i < this.WIDGETS.length; i++) {
        let child = this.WIDGETS[i];
        this.appendChild(child);
      }
      this.WIDGETS = [];
    }
  }

  createResizersForCell(row, col, cell) {
    //Функция создает "ползунки", за которые можно тянуть, для ячейки
    if (cell.col !== 0) {
      let cellResizerLeft = document.createElement("div");
      cellResizerLeft.classList.add("cell-resizer");
      cellResizerLeft.classList.add("cell-resizer-left");
      cellResizerLeft.parentCell = cell;
      cell.appendChild(cellResizerLeft);
      cell.leftResizer = cellResizerLeft;
      // cellResizerLeft.addEventListener("mousemove", this.resizeL.bind(this.widget));
    }
    if (cell.col !== col - 1) {
      let cellResizerRight = document.createElement("div");
      cellResizerRight.classList.add("cell-resizer");
      cellResizerRight.classList.add("cell-resizer-right");
      cellResizerRight.parentCell = cell;
      cell.appendChild(cellResizerRight);
      cell.rightResizer = cellResizerRight;
    }
    if (cell.row !== 0) {
      let cellResizerTop = document.createElement("div");
      cellResizerTop.classList.add("cell-resizer");
      cellResizerTop.classList.add("cell-resizer-top");
      cellResizerTop.parentCell = cell;
      cell.appendChild(cellResizerTop);
      cell.topResizer = cellResizerTop;
    }
    if (cell.row !== row - 1) {
      let cellResizerBottom = document.createElement("div");
      cellResizerBottom.classList.add("cell-resizer");
      cellResizerBottom.classList.add("cell-resizer-bottom");
      cellResizerBottom.parentCell = cell;
      cell.appendChild(cellResizerBottom);
      cell.bottomResizer = cellResizerBottom;
    }
  }

  addRowToEnd() {
    for (let i = this.prevCountRow; i < this.countRow; ++i) {
      for (let j = 0; j < this.countCol; ++j) {
        let cell = document.createElement("div");
        cell.classList.add("LayoutGridCell");
        if (this.editMode) cell.classList.add("editMode");

        cell.parentId = this.id;
        cell.row = i;
        cell.col = j;

        this.createResizersForCell(i, j, cell);

        const paddingsLine = this.cellPaddings[i];
        if (paddingsLine != null) {
          const paddingData = paddingsLine[j];

          if (paddingData != null) {
            this.setCellData(cell, paddingData);
          }
        }

        this.htmlElement.appendChild(cell);
        this.applyPadding();
      }
    }
  }

  removeLastRow() {
    let toRemove = [];

    for (let i = this.countRow; i < this.prevCountRow; ++i) {
      // for (let j = 0; j < this.countCol; ++j) {
      for (let j = 0; j < this.prevCountCol; ++j) {
        const index = i * this.prevCountCol + j;
        const cell = this.htmlElement.children[index];
        toRemove.push(cell);
      }
    }

    for (let i = 0; i < toRemove.length; ++i)
      this.htmlElement.removeChild(toRemove[i]);
  }

  addColToEnd() {
    for (let i = 0; i < this.countRow; ++i) {
      for (let j = this.prevCountCol; j < this.countCol; ++j) {
        const index = i * this.countCol + j;
        let cell = document.createElement("div");
        cell.classList.add("LayoutGridCell");
        if (this.editMode) cell.classList.add("editMode");

        cell.parentId = this.id;
        cell.row = i;
        cell.col = j;

        this.createResizersForCell(i, j, cell);

        const paddingsLine = this.cellPaddings[i];
        if (paddingsLine != null) {
          const paddingData = paddingsLine[j];

          if (paddingData != null) {
            this.setCellData(cell, paddingData);
          }
        }

        this.htmlElement.insertBefore(cell, this.htmlElement.children[index]);
      }
    }
  }

  removeLastCol() {
    let toRemove = [];

    for (let i = 0; i < this.countRow; ++i) {
      for (let j = this.countCol; j < this.prevCountCol; ++j) {
        const index = i * this.prevCountCol + j;
        const cell = this.htmlElement.children[index];
        if (!cell) continue;
        toRemove.push(cell);
      }
    }

    for (let cell of toRemove) this.htmlElement.removeChild(cell);
  }

  redrawGrid(row, col) {
    if (row == null || col == null) return;
    if (this.htmlElement.children.length === 0) {
      if (!this.inited) this.initGrid(row, col);
    } else {
      if (row > this.prevCountRow) {
        this.addRowToEnd();
        this.prevCountRow = row;
      } else if (row < this.prevCountRow) {
        this.removeLastRow();
        this.prevCountRow = row;
      }

      if (col > this.prevCountCol) {
        this.addColToEnd();
        this.prevCountCol = col;
      } else if (col < this.prevCountCol) {
        this.removeLastCol();
        this.prevCountCol = col;
      }
    }
  }

  checkSelect(event, parentId) {
    const path = event.path || (event.composedPath && event.composedPath());
    if (this.editMode === true) {
      if (this.hovered_widget_cell == null) {
        let widget = Rex.widgets[path[path.length - 1]];
        if (widget == null) return this.hover ? this.widget : null;
        if (widget.parentId === this.id) {
          this.hovered_widget = widget;
          if (widget.editMode) return widget.checkSelect(event, parentId);
          return this.hover ? this.widget : null;
        }
        this.hovered_widget = null;
        return this.hover ? this.widget : null;
      }
    } else return super.checkSelect(event, parentId);
  }

  setHover(value) {
    for (let i = 0; i < this.htmlElement.children.length; i++) {
      let child = this.htmlElement.children[i];

      if (value) child.classList.add("editMode");
      else child.classList.remove("editMode");
    }
  }

  setCellData(cell, cellPadding) {
    const width = this.styleWidth;
    const height = this.styleHeight;

    cell.paddingLeftValue = Math.round(width * cellPadding[0]); // 0 - left
    cell.paddingRightValue = Math.round(width * cellPadding[1]); // 1 - right
    cell.paddingTopValue = Math.round(height * cellPadding[2]); // 2 - top
    cell.paddingBottomValue = Math.round(height * cellPadding[3]); // 3 - bottom

    return cell;
  }

  get styleWidth() {
    return parseInt(this.getStyle(this.htmlElement, "width"));
  }

  get styleHeight() {
    return parseInt(this.getStyle(this.htmlElement, "height"));
  }

  getStyle(node, strCssRule) {
    let oElm = node;
    let strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
      let v = document.defaultView.getComputedStyle(oElm, "");
      strValue = v[strCssRule];

      if (strValue.length === 0) strValue = node.style[strCssRule];
    } else if (oElm.currentStyle) {
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

  set transparentBorder(value) {
    if (!this.editMode) return;
    if (value == null) return;
    this._transparentBorder = value;
    this.setHover(!value);
  }

  expand() {
    //нужно именно два равно когда мы проверяем айдишники. Так как теперь айдишник может быть строкой.
    if (this.htmlElement.parentElement === undefined) {
      this.posX = 0;
      this.posY = 0;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    if (this.children.length >= 0) {
      this.onExpand();
    } else {
      this.minContentHeight = 0;
      this.minContentWidth = 0;
    }
  }

  onExpand() {
    this.redrawGrid(this.countRow, this.countCol);
  }

  onMouseDown(x, y, event) {
    if (this.editMode === true) {
      const epath = event.path || (event.composedPath && event.composedPath());
      if (this.hovered_widget !== this && this.hovered_widget != null) {
        for (let i = 0; i < epath.length; i++) {
          let path = epath[i];
          if (path.classList.contains("LayoutGridCell")) {
            this.hovered_widget_cell = path;
            break;
          }
        }
      }

      if (this.lastResizer != null)
        this.resizeCell = this.lastResizer.parentElement;
    }
  }

  onMouseUp(x, y, event) {
    if (this.editMode === true) {
      this.hovered_widget = null;
      this.hovered_widget_cell = null;

      if (this.resizeCell != null) {
        for (let i = 0; i < this.countRow; i++) {
          const value = this._templateRow[i] * this.height;
          Rex.callRpcMethod("Widgets", this.id, this.type, "setRowHeight", [
            i,
            value,
          ]);
        }

        for (let i = 0; i < this.countCol; i++) {
          const value = this._templateCol[i] * this.width;
          Rex.callRpcMethod("Widgets", this.id, this.type, "setColumnWidth", [
            i,
            value,
          ]);
        }

        this.resizeCell = null;
      }
    }
  }

  onMouseMove(x, y, event) {
    if (this.editMode === true) {
      if (this.hovered_widget_cell != null) {
        const epath =
          event.path || (event.composedPath && event.composedPath());
        for (let i = 0; i < epath.length; i++) {
          let path = epath[i];
          if (path.classList == null) continue;
          if (path.classList.contains("LayoutGridCell")) {
            this.replaceWidgetCell(this.hovered_widget_cell, path);
            break;
          }
        }
      }

      let targetElement = event.target;

      if (targetElement !== undefined) {
        if (targetElement.classList.contains("cell-resizer")) {
          if (targetElement.parentCell.parentId !== this.id) return;
          if (this.lastResizer == null) {
            targetElement.style.background = "gray";
            this.lastResizer = targetElement;
          }
        } else {
          if (this.lastResizer != null && this.resizeCell == null) {
            this.lastResizer.style.background = "none";
            this.lastResizer = null;
          }
        }
      }

      if (this.resizeCell != null) {
        if (this.lastResizer.classList.contains("cell-resizer-left")) {
          // Вычисляем относительную позицию клика по X
          let relX = this.clickPosX(x);
          this.resizeLeft(relX);
        }
        if (this.lastResizer.classList.contains("cell-resizer-right")) {
          //Вычисляем относительную позицию клика по X
          let relX = this.clickPosX(x);
          this.resizeRight(relX);
        } else if (this.lastResizer.classList.contains("cell-resizer-top")) {
          //Вычисляем относительную позицию клика по Y
          let relY = this.clickPosY(y);
          this.resizeTop(relY);
        } else if (this.lastResizer.classList.contains("cell-resizer-bottom")) {
          //Вычисляем относительную позицию клика по Y
          let relY = this.clickPosY(y);
          this.resizeBottom(relY);
        }
      }
    }
  }

  resizeLeft(relX) {
    let currentMaxWidth = this.getWidgetMaxWidthInCol(this.resizeCell.col);
    let prevMaxWidth = this.getWidgetMaxWidthInCol(this.resizeCell.col - 1);

    let sum = 0;
    for (let i = 0; i < this.resizeCell.col; ++i) {
      sum += this._templateCol[i];
    }

    const leftPos = sum * this.styleWidth;
    const dWidth = leftPos - relX;

    const prevCellIndex =
      this.resizeCell.row * this.countCol + (this.resizeCell.col - 1);
    const prevCell = this.htmlElement.children[prevCellIndex];

    if (
      this.getCellStyleData(this.resizeCell, "width") + dWidth <=
      currentMaxWidth
    )
      return;
    if (this.getCellStyleData(prevCell, "width") - dWidth <= prevMaxWidth)
      return;

    this._templateCol[this.resizeCell.col] += dWidth / this.styleWidth;
    this._templateCol[this.resizeCell.col - 1] -= dWidth / this.styleWidth;

    this.generateGridTemplateColumns();
  }

  resizeRight(relX) {
    let currentMaxWidth = this.getWidgetMaxWidthInCol(this.resizeCell.col);
    let nextMaxWidth = this.getWidgetMaxWidthInCol(this.resizeCell.col + 1);

    let sum = 0;
    for (let i = 0; i < this.resizeCell.col + 1; ++i) {
      sum += this._templateCol[i];
    }

    const leftPos = sum * this.styleWidth;
    const dWidth = leftPos - relX;

    const nextCellIndex =
      this.resizeCell.row * this.countCol + (this.resizeCell.col + 1);
    const nextCell = this.htmlElement.children[nextCellIndex];

    if (
      this.getCellStyleData(this.resizeCell, "width") - dWidth <=
      currentMaxWidth
    )
      return;
    if (this.getCellStyleData(nextCell, "width") + dWidth <= nextMaxWidth)
      return;

    this._templateCol[this.resizeCell.col] -= dWidth / this.styleWidth;
    this._templateCol[this.resizeCell.col + 1] += dWidth / this.styleWidth;

    this.generateGridTemplateColumns();
  }

  resizeTop(relY) {
    let currentMaxHeight = this.getWidgetMaxHeightInRow(this.resizeCell.row);
    let upperMaxHeight = this.getWidgetMaxHeightInRow(this.resizeCell.row - 1);

    let sum = 0;
    for (let i = 0; i < this.resizeCell.row; ++i) {
      sum += this._templateRow[i];
    }

    const topPos = sum * this.styleHeight;
    const dHeight = topPos - relY;

    const upperCellIndex =
      (this.resizeCell.row - 1) * this.countCol + this.resizeCell.col;
    const upperCell = this.htmlElement.children[upperCellIndex];

    if (
      this.getCellStyleData(this.resizeCell, "height") + dHeight <=
      currentMaxHeight
    )
      return;
    if (this.getCellStyleData(upperCell, "height") - dHeight <= upperMaxHeight)
      return;

    this._templateRow[this.resizeCell.row] += dHeight / this.styleHeight;
    this._templateRow[this.resizeCell.row - 1] -= dHeight / this.styleHeight;

    this.generateGridTemplateRows();
  }

  resizeBottom(relY) {
    let currentMaxHeight = this.getWidgetMaxHeightInRow(this.resizeCell.row);
    let bottomMaxHeight = this.getWidgetMaxHeightInRow(this.resizeCell.row + 1);

    let sum = 0;
    for (let i = 0; i < this.resizeCell.row + 1; ++i) {
      sum += this._templateRow[i];
    }

    const topPos = sum * this.styleHeight;
    const dHeight = topPos - relY;

    const bottomCellIndex =
      (this.resizeCell.row + 1) * this.countCol + this.resizeCell.col;
    const bottomCell = this.htmlElement.children[bottomCellIndex];

    if (
      this.getCellStyleData(this.resizeCell, "height") - dHeight <=
      currentMaxHeight
    )
      return;
    if (
      this.getCellStyleData(bottomCell, "height") + dHeight <=
      bottomMaxHeight
    )
      return;

    this._templateRow[this.resizeCell.row] -= dHeight / this.styleHeight;
    this._templateRow[this.resizeCell.row + 1] += dHeight / this.styleHeight;

    this.generateGridTemplateRows();
  }

  getWidgetMaxWidthInCol(col) {
    let retValue = 0;

    for (let i = 0; i < this.countRow; i++) {
      let index = i * this.countCol + col;

      let cell = this.htmlElement.children[index];
      let child = cell.children[cell.children.length - 1];

      if (child === undefined) continue;
      if (child.id === "") continue;

      let widget = Rex.widgets[child.id];
      if (widget === undefined) continue;

      let width = widget.minWidth;
      if (width > retValue) retValue = width;
    }

    return retValue;
  }

  getWidgetMaxHeightInRow(row) {
    let retValue = 0;

    for (let i = 0; i < this.countCol; i++) {
      let index = row * this.countCol + i;

      let cell = this.htmlElement.children[index];
      let child = cell.children[cell.children.length - 1];

      if (child === undefined) continue;
      if (child.id === "") continue;

      let widget = Rex.widgets[child.id];
      if (widget === undefined) continue;

      let height = widget.minHeight;
      if (height > retValue) retValue = height;
    }

    return retValue;
  }

  clickPosX(x) {
    return x - this.aPosX;
  }

  clickPosY(y) {
    return y - this.aPosY;
  }

  replaceWidgetCell(oldCell, newCell) {
    if (oldCell === newCell) return;
    if (oldCell == null) return;
    if (newCell == null) return;

    let oldCellWidget = null;
    let newCellWidget = null;

    if (oldCell.parentId !== this.id) {
      oldCellWidget = Rex.widgets[oldCell.parentId];
      oldCell = this.getCellByChild(oldCellWidget.htmlElement);
      if (!oldCell) return;
    }

    if (newCell.parentId !== this.id) {
      newCellWidget = Rex.widgets[newCell.parentId];
      newCell = this.getCellByChild(newCellWidget.htmlElement);
      if (!newCell) return;
    }

    this.hovered_widget_cell = newCell;
    Rex.callRpcMethod("Widgets", this.id, this.type, "replaceWidgetCell", [
      oldCell.row,
      oldCell.col,
      newCell.row,
      newCell.col,
    ]);
  }

  getCellByChild(child) {
    if (!this.cells) return null;
    const id = child.id.replace(/\D+/g, "");
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[0].length; j++) {
        let cell = this.cells[i][j];

        if (cell == null) continue;
        if (id == cell) {
          return this.htmlElement.children[i * this.cells[0].length + j];
        }
      }
    }
    return null;
  }

  setEditMode(value) {
    this.editMode = value;
    if (this.editMode) this.setHover(!this._transparentBorder);
    else this.setHover(false);
  }

  applyPadding() {
    for (let i = 0; i < this.cellPaddings.length; i++) {
      for (let j = 0; j < this.cellPaddings[0].length; j++) {
        if (this.cellPaddings[i][j] == null) continue;
        let cellPaddings = this.cellPaddings[i][j];
        this.setCellPadding(
          i,
          j,
          Math.round(cellPaddings[0]), //left
          Math.round(cellPaddings[1]), //right
          Math.round(cellPaddings[2]), //top
          Math.round(cellPaddings[3]), //bottom
          false
        );
      }
    }
  }

  setCellPadding(row, col, left, right, top, bottom, Rpc = true) {
    let cell = this.htmlElement.children[row * this.countCol + col];
    if (cell === undefined) return;

    cell.style.marginLeft = left + "px";
    cell.style.marginRight = right + "px";
    cell.style.marginTop = top + "px";
    cell.style.marginBottom = bottom + "px";

    if (Rpc === true)
      Rex.callRpcMethod("Widgets", this.id, this.type, "setCellPadding", [
        row,
        col,
        left,
        right,
        top,
        bottom,
      ]);
  }

  getCellStyleData(cell, style) {
    if (style === "") return;
    if (!cell) return;

    let retData = this.getStyle(cell, style);
    return parseInt(retData);
  }

  set swapCells(swapData) {
    if (!Rex.widgets) return;
    const fromRow = swapData[0];
    const fromCol = swapData[1];
    const toRow = swapData[2];
    const toCol = swapData[3];

    const fromCell =
      this.htmlElement.children[fromRow * this.countCol + fromCol];
    const toCell = this.htmlElement.children[toRow * this.countCol + toCol];
    if (!fromCell || !toCell) return;
    if (fromCell === toCell) return;

    let oldCellWidget = Rex.widgets[this.cells[toCell.row][toCell.col]];
    let newCellWidget = Rex.widgets[this.cells[fromCell.row][fromCell.col]];

    if (newCellWidget !== undefined) {
      fromCell.appendChild(newCellWidget.htmlElement);

      newCellWidget.htmlElement.style.width = "100%";
      newCellWidget.htmlElement.style.height = "100%";
    }
    if (oldCellWidget !== undefined) {
      toCell.appendChild(oldCellWidget.htmlElement);

      oldCellWidget.htmlElement.style.width = "100%";
      oldCellWidget.htmlElement.style.height = "100%";
    }
  }

  set templateRows(value) {
    if (!value) return;
    this._templateRow = value;
    this.updateRows(value.length);
    this.generateGridTemplateRows();
  }

  set templateColumns(value) {
    if (!value) return;
    this._templateCol = value;
    this.updateCols(value.length);
    this.generateGridTemplateColumns();
  }

  updateRows(row) {
    if (this.inited === false) {
      return;
    }

    if (row == null) {
      return;
    }

    if (row === this.prevCountRow) {
      return;
    }

    if (row > this.prevCountRow) {
      this.addRowToEnd();
    } else {
      this.removeLastRow();
    }

    this.prevCountRow = row;
  }

  updateCols(col) {
    if (this.inited === false) {
      return;
    }

    if (col == null) {
      return;
    }

    if (col === this.prevCountCol) {
      return;
    }

    if (col > this.prevCountCol) {
      this.addColToEnd();
    } else {
      this.removeLastCol();
    }

    this.prevCountCol = col;
  }
}
