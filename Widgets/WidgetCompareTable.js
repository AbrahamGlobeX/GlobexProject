//#region For tests only

const objToCompare = {
  _id: {
    $oid: "60b8dab3b012550009053fe6",
  },
  meta: {
    name: "Пшеница Тест",
    description: "",
    pattern: {
      $oid: "5ce777ef9ddcac72773c1a47",
    },
    owner: {
      $oid: "60222cadb4a8ca0008411e04",
    },
  },
  additional: {
    wiki_ref: {
      en: "Пшеница Тест",
    },
    category: [
      "2cee3b0f0000000000000000.2cee3b0f0000000000000001.2cee3b0f0000000000000002.2cee3b0f0000000000000003.2cee3b0f000000000000031b",
    ],
    classification: {
      "60222e96b0125500080a4c1e": ["6"],
    },
    image: "",
    last_update_time: 0,
    last_update_by: "",
  },
  object: {
    "пжлст!!12": {
      value: "Красный",
      prop_ref: {
        $oid: "5cebacd47744766dd37a2148",
      },
    },
    Weight: {
      value: "15",
      prop_ref: {
        $oid: "5a0987cbd9ce171c30451879",
      },
    },
    "есть залупа?": {
      value: true,
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "фыв",
      lang: "ru",
      themes: ["Basic"],
      type_value: "boolean",
      current_system: "SI",
      wiki: "фыв",
    },
  },
};

const objToCompare2 = {
  _id: {
    $oid: "60bf5913b0125500090788b7",
  },
  meta: {
    name: "asd",
    description: "",
    pattern: {
      $oid: "5ce777ef9ddcac72773c1a47",
    },
    owner: {
      $oid: "60222cadb4a8ca0008411e04",
    },
  },
  additional: {
    wiki_ref: {
      en: "asd",
    },
    category: [
      "2cee3b0f0000000000000000.2cee3b0f0000000000000001.2cee3b0f0000000000000002.2cee3b0f0000000000000003.2cee3b0f000000000000031b",
    ],
    classification: {
      "60222e96b0125500080a4c1e": [],
    },
    image: "",
    last_update_time: 0,
    last_update_by: "",
  },
  object: {
    "пжлст!!12": {
      value: "Красный",
      prop_ref: {
        $oid: "5cebacd47744766dd37a2148",
      },
    },
    Weight: {
      value: 100,
      prop_ref: {
        $oid: "5a0987cbd9ce171c30451879",
      },
    },
    Length: {
      value: 1000,
      prop_ref: {
        $oid: "5a40ad4e65e7c321bc381499",
      },
    },
    hjhlkhklhlkjhlkhjlkjhlkjh: {
      value: 1000,
      prop_ref: {
        $oid: "60bf5910b0125500090788ae",
      },
    },
  },
};

const comparableObjects = [objToCompare, objToCompare2];

//#endregion

class CompareTable extends BaseObjectEditor {
  constructor(parentID, comparedObjects = comparableObjects) {
    super();
    this._comparedObjects = comparedObjects;
    this._allProperties = [];
    this._parentId = parentID;
    this.onCreate();
  }

  onCreate() {
    console.log("Comparable", this._comparedObjects);

    const dialogWindow = this.drawDialog(this._parentId);

    ReactComponent[dialogWindow].minWidth = "100%";
    ReactComponent[dialogWindow].minHeight = "100%";
    ReactComponent[dialogWindow].overflow = "hidden";
    ReactComponent[dialogWindow].containerHeight = "100vh";

    const mainCompareLayout = this.drawLayout(dialogWindow, "layoutVertical", {
      minWidth: "100%",
      minHeight: "100%",
    });

    //#region Widgets header

    const headerLayout = this.drawLayout(mainCompareLayout, "layoutVertical", {
      minWidth: "100%",
      maxHeight: "15%",
    });

    // Wiget title
    const widgetTitle = this.drawLabel(
      headerLayout,
      `Cравнение характеристик ${this._comparedObjects.length} товаров`,
      {
        minWidth: "100%",
        maxHeight: "30%",
      }
    );

    ReactComponent[widgetTitle].htmlElement.firstChild.className +=
      " header__title";

    // Widget buttons Layout
    const widgetTitleButtonsLayout = this.drawLayout(
      headerLayout,
      "layoutHorizontal",
      {
        maxHeight: "100px",
        width: "100%",
      }
    );

    ReactComponent[widgetTitleButtonsLayout].htmlElement.className +=
      " header__title__buttons";

    // Widget button "Только различающиеся"
    const widgetTitleButtonDifferent = this.drawButton(
      widgetTitleButtonsLayout,
      "Только различающиеся",
      {
        maxHeight: "100px",
        maxWidth: "45%",
      },
      () => {
        console.error("NOT IMPLEMENT EXCEPTION");
      }
    );

    // Widget button "Добавить товары к сравнению"
    const widgetTitleButtonAddToCompare = this.drawButton(
      widgetTitleButtonsLayout,
      "Добавить товары к сравнению",
      {
        maxHeight: "100px",
        maxWidth: "45%",
      },
      () => {
        console.error("NOT IMPLEMENT EXCEPTION");
      }
    );

    //#endregion

    //#region Widgets body

    const bodyLayout = this.drawLayout(mainCompareLayout, "layoutHorizontal", {
      minWidth: "100%",
      maxHeight: "75%",
    });

    const bodyCheckboxLayout = this.drawLayout(bodyLayout, "layoutVertical", {
      minWidth: "10%",
      maxWidth: "10%",
      height: "100%",
    });

    const bodyTableLayout = this.drawLayout(bodyLayout, "layoutHorizontal", {
      minWidth: "10%",
      height: "100%",
    });

    for (let i = 0; i < this._comparedObjects.length; i++) {
      // const columnLayout = this.drawLayout
      this.createTable(bodyTableLayout, this._comparedObjects[i]);
    }

    //#endregion

    //#region Widgets footer

    const footerLayout = this.drawLayout(mainCompareLayout, "layoutVertical", {
      minWidth: "100%",
      maxHeight: "6%",
    });

    ReactComponent[footerLayout].htmlElement.className += " footer__buttons";

    // Widget button "Создать новый проект"
    const widgetFooterButtonCreateProj = this.drawButton(
      footerLayout,
      "Создать новый проект",
      {
        maxHeight: "100px",
        maxWidth: "30%",
      },
      () => {
        console.error("NOT IMPLEMENT EXCEPTION");
      }
    );

    // Widget button "Добавить проект"
    const widgetFooterButtonAddToProj = this.drawButton(
      footerLayout,
      "Добавить в проект",
      {
        maxHeight: "100px",
        maxWidth: "30%",
      },
      () => {
        console.error("NOT IMPLEMENT EXCEPTION");
      }
    );

    // Widget button "Закрыть диалоговое окно"
    const widgetFooterButtonCloseDialog = this.drawButton(
      footerLayout,
      "Закрыть",
      {
        maxHeight: "100px",
        maxWidth: "30%",
      },
      () => {
        this.destroyWidject(dialogWindow);
        console.error("NOT IMPLEMENT EXCEPTION");
      }
    );
    //#endregion
  }

  createTable(parentId, dataInfo) {
    console.log("dataInfo", dataInfo);
    
    const infoKeys = this.getAllProperties();
    const hLayout = this.drawLayout(parentId, "layoutVertical", {
      height: "100%",
    });
    ReactComponent[hLayout].htmlElement.className += " horizontalLayout";

    for (let i = 0; i < infoKeys.length + 1; i ++) {
      const lbl = this.drawLayout(hLayout, "layoutVertical", {
        minWidth: "100%",
        minHeight: "30px",
      });
      let inText = " - "
      if (i == 0){
        const tabelHeader = this.drawLabel(lbl, dataInfo.meta.name, {
          maxHeight: "50px"
        });
        ReactComponent[tabelHeader].htmlElement.style = 'border-bottom: 1px solid black; height: 50px'
        continue
      }
      if (
        dataInfo.object[infoKeys[i-1]]
      ) {
        inText = dataInfo.object[infoKeys[i-1]].value
      }
      this.drawLabel(lbl, inText);
    }    
  }

  /**
   *Метод выносит все отличные свойства из всех полученных объектов
   *
   * @return {Array} Свойства всех объектов
   * @memberof WidgetCompareTable
   */
  getAllProperties() {
    if (!this._comparedObjects) {
      APP.log("error", "There is no data");
      return;
    }
    let result = [];
    this._comparedObjects.forEach((element) => {
      result = [...new Set([...result, ...Object.keys(element.object)])];
    });
    return result;
  }

  /**
   * Создает диалоговое окно
   *
   * @param {String} parentID
   * @return {String} dialogID
   * @memberof WidgetCompareTable
   */
  drawDialog(parentID) {
    const dialog = new WidgetDialog();

    if (parentID == -1) {
      dialog.htmlElement.style.background = "black";
    }
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[dialog.id]);
    }
    return dialog.id;
  }

  /**
   *Создает новый Layout
   *
   * @param {String} parentID родительский Layout
   * @param {string} type layoutVertical/layoutHorizontal
   * @param {Object} Стили Layoutа
   * @return {String} LayoutId
   * @memberof WidgetCompareTable
   */
  drawLayout(parentLayoutID, type, style = { width: "700px", height: "50px" }) {
    if (type !== "layoutVertical" && type !== "layoutHorizontal") {
      console.error("openPropertyEditor: Error #1");
    }
    const layout = new widgetsComponentsTypes[type]();

    const styleProperties = Object.keys(style);
    for (let i = 0; i < styleProperties.length; i++)
      ReactComponent[layout.id][styleProperties[i]] = style[styleProperties[i]];

    ReactComponent[parentLayoutID].includeWidget(ReactComponent[layout.id]);
    return layout.id;
  }

  /**
   * Создает кнопку
   *
   * @param {String} parentID родительский Layout
   * @param {String} text текст кнопки
   * @param {Object} Стили кнопки
   * @param {Function} Функция, которая срабатывает по нажатию на кнопку
   * @return {String} buttonId
   * @memberof WidgetCompareTable
   */
  drawButton(parentID, text, styles = {}, callback = null) {
    const button = new WidgetButton();
    button.text = text;
    button.htmlElement.addEventListener("click", callback);
    this.setWidgetStyle(button.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[button.id]);
    }
    return button.id;
  }

  /**
   * Создает checkbox
   *
   * @param {String} Месторасположение checkbox
   * @param {Object} Стили checkbox
   * @param {Function} Функция,к оторая срабатывает на нажатие
   * @return {*} checkboxId
   * @memberof WidgetCompareTable
   */
  drawCheckbox(parentID = -1, styles = {}, callback) {
    const checkbox = new WidgetCheckBox();
    this.widgetSetStyle(checkbox.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[checkbox.id]);
    }

    if (callback) {
      ReactComponent[checkbox.id].htmlElement.onchange = (e) => {
        callback(e.target.checked);
      };
    }
    return checkbox.id;
  }

  /**
   * Копирование объекта
   *
   * @param {Object} Копируемый объект
   * @return {Object} Копия объекта
   * @memberof WidgetCompareTable
   */
  copyObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * Создает Label
   *
   * @param {String} Местоположение label
   * @param {String} Тект Label
   * @param {Object} Стили label
   * @return {String} LabelId
   * @memberof WidgetCompareTable
   */
  drawLabel(parentID, label, styles = {}) {
    const widget = new WidgetLabel();
    this.setWidgetStyle(widget.id, styles);
    widget.text = label;
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(widget);
    }
    return widget.id;
  }

  /**
   * Создает iput
   *
   * @param {String} parentID
   * @param {string} value="" input
   * @param {Object} стили input
   * @return {String} inputId
   * @memberof WidgetCompareTable
   */
  drawInput(parentID, value = "", styles = {}) {
    const input = new WidgetInput();
    input.text = value;
    this.widgetSetStyle(input.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[input.id]);
    }
    return input.id;
  }

  setWidgetStyle(widget, styles) {
    for (let style of Object.keys(styles)) {
      ReactComponent[widget].setStyleProp(style, styles[style]);
    }
  }

  /**
   * Удаление данного виджета
   *
   * @param {String} dialogWindow
   * @memberof CompareTable
   */
  destroyWidject(dialogWindow) {
    ReactComponent[dialogWindow].htmlElement.style.display = "none";
  }
}
