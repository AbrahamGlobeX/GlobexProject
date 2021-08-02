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
    "есть печеньки?": {
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

const objToCompare3 = {
  _id: {
    $oid: "60ee5d15b0125500090c13ac",
  },
  meta: {
    name: "Крышка редуктора",
    description: "",
    pattern: {
      $oid: "60ee562bb0125500090c0f53",
    },
    owner: {
      $oid: "60222cadb4a8ca0008411e04",
    },
  },
  additional: {
    wiki_ref: {
      en: "Панировка",
    },
    category: [
      "2cee3b0f0000000000000000.2cee3b0f00000000000000cb.2cee3b0f000000000000011f.2cee3b0f000000000000012b.2cee3b0f00000000000009cd",
    ],
    classification: {
      "60ec1655b0125500090bdbb4": ["2"],
    },
    image: "",
    last_update_time: 0,
    last_update_by: "",
  },
  object: {
    "Вес заготовки": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Вес заготовки",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Weight",
      current_unit: "KG",
      current_system: "SI",
      wiki: "Вес",
      value: "0.2",
    },
    "Длина изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Длина изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Length",
      current_unit: "M",
      current_system: "SI",
      wiki: "Длина изделия",
      value: "0.15",
    },
    "Количество изделий": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Количество используемых изделий в проекте",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Quantity",
      current_unit: "IT",
      current_system: "SI",
      wiki: "Количество",
      value: "1",
    },
    "Марка материала изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Марка материала изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "string",
      current_unit: "",
      current_system: "SI",
      wiki: "Марка материала изделия",
      value: "Сталь 3",
    },
    "Материал изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Материал изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "string",
      current_unit: "",
      current_system: "SI",
      wiki: "Материал изделия",
      value: "Лист",
    },
    "Площадь заготовки": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Площадь заготовки",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Square",
      current_unit: "SQM",
      current_system: "SI",
      wiki: "Площадь заготовки",
      value: "0.01",
    },
    "Расчетная цена материала заготовки": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Расчетная цена материала заготовки",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Currency",
      current_unit: "RUB",
      current_system: "SI",
      wiki: "Цена",
      value: "21",
    },
    "Толщина изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Толщина изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Length",
      current_unit: "M",
      current_system: "SI",
      wiki: "Толщина",
      value: "0.0015",
    },
    "Ширина изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Ширина изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Length",
      current_unit: "M",
      current_system: "SI",
      wiki: "Ширина изделия",
      value: "0.093",
    },
  },
};

const objToCompare4 = {
  _id: {
    $oid: "60ee9332b0125500090c3588",
  },
  meta: {
    name: "Стенка корпуса 1",
    description: "",
    pattern: {
      $oid: "60ee562bb0125500090c0f53",
    },
    owner: {
      $oid: "60222cadb4a8ca0008411e04",
    },
  },
  additional: {
    wiki_ref: {
      en: "Панировка",
    },
    category: [
      "2cee3b0f0000000000000000.2cee3b0f00000000000000cb.2cee3b0f000000000000011f.2cee3b0f000000000000012b.2cee3b0f00000000000009cd",
    ],
    classification: {
      "60ec1655b0125500090bdbb4": ["2"],
    },
    image: "",
    last_update_time: 0,
    last_update_by: "",
  },
  object: {
    "Вес заготовки": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Вес заготовки",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Weight",
      current_unit: "KG",
      current_system: "SI",
      wiki: "Вес",
      value: "3.6",
    },
    "Длина изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Длина изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Length",
      current_unit: "M",
      current_system: "SI",
      wiki: "Длина изделия",
      value: "0.815",
    },
    "Количество изделий": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Количество используемых изделий в проекте",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Quantity",
      current_unit: "IT",
      current_system: "SI",
      wiki: "Количество",
      value: "1",
    },
    "Марка материала изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Марка материала изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "string",
      current_unit: "",
      current_system: "SI",
      wiki: "Марка материала изделия",
      value: "Сталь 3",
    },
    "Материал изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Материал изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "string",
      current_unit: "",
      current_system: "SI",
      wiki: "Материал изделия",
      value: "Лист",
    },
    "Площадь заготовки": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Площадь заготовки",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Square",
      current_unit: "SQM",
      current_system: "SI",
      wiki: "Площадь заготовки",
      value: "0.31",
    },
    "Расчетная цена материала заготовки": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Расчетная цена материала заготовки",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Currency",
      current_unit: "RUB",
      current_system: "SI",
      wiki: "Цена",
      value: "474",
    },
    "Толщина изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Толщина изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Length",
      current_unit: "M",
      current_system: "SI",
      wiki: "Толщина",
      value: "0.0015",
    },
    "Ширина изделия": {
      average_default: 0,
      category: "Characteristics",
      count_uses: 0,
      description: "Ширина изделия",
      lang: "ru",
      themes: ["Basic"],
      type_value: "number",
      unit_type: "Length",
      current_unit: "M",
      current_system: "SI",
      wiki: "Ширина изделия",
      value: "0.38",
    },
  },
};

const comparableObjects = [
  objToCompare,
  objToCompare2,
  objToCompare3,
  objToCompare4,
];

//TODO: prevent-default scroll

//#endregion

class CompareTable extends BaseObjectEditor {
  constructor(parentID, comparedObjects = comparableObjects) {
    super();
    this._comparedObjects = comparedObjects.map((el) => {
      Object.keys(el.object).forEach((item) => {
        el.object[item].checked = false;
      });
      el.checked = false;
      return el;
    });
    this._allProperties = [];
    this._parentId = parentID;
    this._displayDiffProps = false;

    this._bodyLayout;
    this._bodyTableLayout;
    this._bodyCheckboxLayout;

    this._diffProperties = this.getAllProperties();

    this.onCreate();
  }

  onCreate() {
    console.log("Compared objects", this._comparedObjects);

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
        this.getDifferentProperties();
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

    this._bodyLayout = bodyLayout;

    ReactComponent[bodyLayout].htmlElement.style.marginBottom = "20px";

    const bodyTableLayout = this.drawLayout(bodyLayout, "layoutHorizontal", {
      minWidth: "10%",
      height: "100%",
    });

    this._bodyTableLayout = bodyTableLayout;

    this.createTable(bodyTableLayout, this._comparedObjects);
    //#endregion

    //#region Widgets footer

    const footerLayout = this.drawLayout(mainCompareLayout, "layoutVertical", {
      minWidth: "100%",
      maxHeight: "6%",
    });

    ReactComponent[footerLayout].htmlElement.className += " footer__buttons";

    // Widget button "Создать новый объект"
    const widgetFooterButtonCreateProj = this.drawButton(
      footerLayout,
      "Создать новый объект",
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
      }
    );

    ReactComponent[footerLayout].htmlElement.style.marginBottom = "20px";
    //#endregion
  }

  /**
   * Создает таблицу сравнения
   *
   * @param {String} parentId Id родительского элемента
   * @param {Array} dataInfo Массив объектов
   * @memberof CompareTable
   */
  createTable(parentId, dataInfo) {
    const infoKeys = this._diffProperties;

    // Цикл по объектам
    for (let i = 0; i < dataInfo.length + 1; i++) {
      if (i == 0) {
        const hLayout = this.drawLayout(parentId, "layoutVertical", {
          height: "100%",
          maxWidth: "80px",
        });
        this.createCheckBoxColumn(hLayout);
        ReactComponent[hLayout].htmlElement.addEventListener(
          "mousewheel",
          (e) => {
            console.log("Scroll checkbox", e);
            this.scrollFunction(e.target.parentElement.parentElement.parentElement, e.offsetY);
          }
        );
        continue;
      }
      const hLayout = this.drawLayout(parentId, "layoutVertical", {
        height: "100%",
      });
      ReactComponent[hLayout].htmlElement.classList.add("horizontalLayout");

      ReactComponent[hLayout].htmlElement.addEventListener(
        "mousewheel",
        (e) => {
          console.log("mouse wheel", e);
        }
      );

      //#region Drag n Drop
      const tasksListElement =
        ReactComponent[this._bodyTableLayout].htmlElement;
      const taskElements =
        tasksListElement.querySelectorAll(`.horizontalLayout`);

      ReactComponent[hLayout].htmlElement.setAttribute("draggable", true);
      ReactComponent[hLayout].innerObject = dataInfo[i - 1]._id.$oid;

      tasksListElement.addEventListener("dragstart", (evt) => {
        // console.log('Drag start', evt);
        evt.target.classList.add("selectedObjectProperty");
      });
      tasksListElement.addEventListener("dragend", (evt) => {
        // console.log('Drag end', evt);
        evt.target.classList.remove("selectedObjectProperty");
      });

      tasksListElement.addEventListener("dragover", (evt) => {
        evt.preventDefault();

        const activeElement = tasksListElement.querySelector(
          `.selectedObjectProperty`
        );
        const currentElement = evt.target.parentElement;

        const isMoveable =
          activeElement !== currentElement &&
          currentElement.classList.contains(`horizontalLayout`);

        if (!isMoveable) {
          return;
        }

        const getNextElement = (cursorPosition, currentElement) => {
          const currentElementCoord = currentElement.getBoundingClientRect();
          const currentElementCenter =
            currentElementCoord.y + currentElementCoord.height / 2;

          const nextElement =
            cursorPosition < currentElementCenter
              ? currentElement
              : currentElement.nextElementSibling;

          return nextElement;
        };

        const nextElement = getNextElement(evt.clientY, currentElement);

        if (
          (nextElement &&
            activeElement === nextElement.previousElementSibling) ||
          activeElement === nextElement
        ) {
          return;
        }

        tasksListElement.insertBefore(activeElement, nextElement);

        evt.target.classList.remove("selectedObjectProperty");

        // this.moveObjInArray(
        //   ReactComponent[activeElement.id].innerObject,
        //   ReactComponent[nextElement.id].innerObject
        // );
      });

      //#endregion

      // Цикл по ключам
      for (let j = 0; j < infoKeys.length + 1; j++) {
        const lbl = this.drawLayout(hLayout, "layoutVertical", {
          minWidth: "100%",
          minHeight: "70px",
        });
        ReactComponent[lbl].htmlElement.style.alignItems = "center";
        let inText = " - ";
        if (j == 0) {
          const tableHeader = this.drawLayout(lbl, "layoutVertical", {});

          const tableHeaderLabel = this.drawLabel(
            tableHeader,
            dataInfo[i - 1].meta.name,
            {
              maxHeight: "50px",
            }
          );

          //#region Внутренние кнопки в заголовке таблицы

          const tableHeaderLayout = this.drawLayout(
            tableHeader,
            "layoutHorizontal",
            {}
          );

          const buttonShare = this.drawLabel(tableHeaderLayout, "S", {});
          const buttonDelete = this.drawLabel(tableHeaderLayout, "D", {});
          const buttonCheck = this.drawLabel(tableHeaderLayout, "C", {});

          ReactComponent[buttonCheck].htmlElement.addEventListener(
            "click",
            () => {
              dataInfo[i - 1].checked = !dataInfo[i - 1].checked;

              this.clearWidget(this._bodyTableLayout);
              this.createTable(this._bodyTableLayout, this._comparedObjects);
            }
          );

          ReactComponent[buttonDelete].htmlElement.addEventListener(
            "click",
            () => {
              this._comparedObjects.splice(i - 1, 1);
              this.clearWidget(this._bodyTableLayout);
              this.createTable(this._bodyTableLayout, this._comparedObjects);
              // ReactComponent[hLayout].htmlElement.style.display = "none";
            }
          );

          ReactComponent[buttonShare].htmlElement.classList.add(
            "tableHeaderButtons"
          );
          ReactComponent[buttonDelete].htmlElement.classList.add(
            "tableHeaderButtons"
          );
          ReactComponent[buttonCheck].htmlElement.classList.add(
            "tableHeaderButtons"
          );

          if (dataInfo[i - 1].checked) {
            ReactComponent[hLayout].htmlElement.classList.add(
              "checkedComparedpropertyOrObject"
            );
          } else {
            ReactComponent[hLayout].htmlElement.classList.remove(
              "checkedComparedpropertyOrObject"
            );
          }

          ReactComponent[buttonShare].htmlElement.style = "height: 30px";
          ReactComponent[buttonDelete].htmlElement.style = "height: 30px";
          ReactComponent[buttonCheck].htmlElement.style = "height: 30px";

          ReactComponent[tableHeaderLayout].htmlElement.style =
            "border-bottom: 1px solid black; height: 50px";
          continue;
        }

        //#endregion

        if (i - 1 == 0) {
          // Добавление названия свойства перед значением для первого элемента
          inText = infoKeys[j - 1];
        } else {
          inText = "";
        }

        const propName = this.drawLabel(lbl, inText);
        inText = " - ";

        ReactComponent[propName].htmlElement.style = "width: 100%";

        if (dataInfo[i - 1].object[infoKeys[j - 1]]) {
          // добавление значения свойства, если оно существует
          inText = dataInfo[i - 1].object[infoKeys[j - 1]].value || " - ";
        }
        const objectValue = this.drawLabel(lbl, inText);

        ReactComponent[objectValue].htmlElement.style = "width: 100%";

        ReactComponent[objectValue].htmlElement.classList.add(
          "checkedComparePropertyLayout"
        );

        ReactComponent[objectValue].htmlElement.classList.add(
          "checkedComparePropertyLayout"
        );

        if (
          (dataInfo[i - 1].object.hasOwnProperty(this._diffProperties[j - 1]) &&
            dataInfo[i - 1].object[this._diffProperties[j - 1]].hasOwnProperty(
              "checked"
            ) &&
            dataInfo[i - 1].object[infoKeys[j - 1]].checked) ||
          dataInfo[i - 1].checked
        ) {
          ReactComponent[objectValue].htmlElement.classList.add(
            "checkedComparedpropertyOrObject"
          );
        } else {
          ReactComponent[objectValue].htmlElement.classList.remove(
            "checkedComparedpropertyOrObject"
          );
        }
      }
    }
  }

  /**
   *Создает колонку с checkbox
   *
   * @param {String} parentId
   * @memberof CompareTable
   */
  createCheckBoxColumn(parentId) {
    const infoKeys = this._diffProperties;
    for (let j = 0; j < infoKeys.length + 1; j++) {
      const lbl = this.drawLayout(parentId, "layoutVertical", {
        minHeight: "70px",
      });
      ReactComponent[lbl].htmlElement.style.alignItems = "center";
      if (j == 0) {
        const tabelHeader = this.drawLabel(lbl, "Выделить все свойства", {
          maxHeight: "50px",
        });
        ReactComponent[tabelHeader].htmlElement.style =
          "border-bottom: 1px solid black; height: 50px";
        continue;
      }
      this.drawLabel(lbl, "");

      const checkbx = this.drawCheckbox(lbl, {}, (e) => {
        this._comparedObjects.map((el) => {
          if (
            el.object.hasOwnProperty(this._diffProperties[j - 1]) &&
            el.object[this._diffProperties[j - 1]].hasOwnProperty("checked")
          ) {
            el.object[this._diffProperties[j - 1]].checked = e;
          } else {
            el.object[this._diffProperties[j - 1]] = {};
            el.object[this._diffProperties[j - 1]].checked = e;
          }
        });

        this.clearWidget(this._bodyTableLayout);
        this.createTable(this._bodyTableLayout, this._comparedObjects);
      });

      const checkboxValue = this._comparedObjects.reduce((sum = true, el) => {
        if (
          el.object.hasOwnProperty(this._diffProperties[j - 1]) &&
          el.object[this._diffProperties[j - 1]].hasOwnProperty("checked")
        ) {
          sum = sum && el.object[this._diffProperties[j - 1]].checked;
        } else {
          sum = false;
        }
        return sum;
      });

      ReactComponent[checkbx].htmlElement.querySelector("input").value =
        checkboxValue;

      ReactComponent[checkbx].htmlElement.querySelector("input").checked =
        checkboxValue;
    }
  }

  /**
   *Метод возвращает все отличные свойства из всех полученных объектов
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
   *Создает массив свойств, только с различными значениями
   *
   * @memberof CompareTable
   */
  getDifferentProperties() {
    const allProperties = this.getAllProperties();
    const difProperties = [];
    allProperties.forEach((prop) => {
      let arrToTest = [];
      this._comparedObjects.forEach((item) => {
        if (item.object[prop]) arrToTest.push(item.object[prop].value);
      });
      const result = [...new Set([...arrToTest])];
      if (
        arrToTest.length != this._comparedObjects.length ||
        result.length > 1
      ) {
        difProperties.push(prop);
      }
    });

    this._displayDiffProps = !this._displayDiffProps;
    if (this._displayDiffProps) {
      this._diffProperties = difProperties;
    } else {
      this._diffProperties = this.getAllProperties();
    }

    this.clearWidget(this._bodyTableLayout);
    this.createTable(this._bodyTableLayout, this._comparedObjects);
  }

  deleteObjectsColumn() {}

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

    ReactComponent[parentLayoutID].includeWidget(layout);
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

  clearWidget(widget) {
    ReactComponent[widget].clearWidget();
  }

  /**
   *Метод для перемещения элемента массива
   *
   * @param {Array} array массив,в котором перемещаем элемент
   * @param {Integer} oldIndex элемент массива для перемещения
   * @param {Integer} newIndex новая позиция элмента
   * @return {Array} массив с перемещенным элементом
   * @memberof CompareTable
   */
  moveObjInArray(oldId, newId) {
    // Преобразвание индексов в целые десятичные числа

    if (oldId == newId) return;

    console.log("before change", this._comparedObjects);

    console.log("OldId", oldId);
    console.log("newId", newId);

    const oldIndex = this._comparedObjects.indexOf(
      this._comparedObjects.find((el) => el._id.$oid == oldId)
    );
    const newIndex = this._comparedObjects.indexOf(
      this._comparedObjects.find((el) => el._id.$oid == newId)
    );

    console.log("oldIndex", oldIndex);
    console.log("newIndex", newIndex);

    if (oldIndex < newIndex)
      this._comparedObjects.splice(
        newIndex + 1,
        0,
        this._comparedObjects.splice(oldIndex, 1)[0]
      );

    if (oldIndex > newIndex)
      this._comparedObjects.splice(
        oldIndex - 1,
        0,
        this._comparedObjects.splice(oldIndex, 1)[0]
      );

    console.log("after change", this._comparedObjects);

    // array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);

    // Изменение прототипа массиваА
    // Array.prototype.move = function(from,to){
    //   this.splice(to,0,this.splice(from,1)[0]);
    //   return this;
    // };
  }

  scrollFunction(element, offset) {
    // this._bodyLayout

    console.log("Scrolling", element, offset);

    for (let i = 0; i < ReactComponent[this._bodyLayout].htmlElement.firstChild.childNodes.length; i++){
      console.log(ReactComponent[this._bodyLayout].htmlElement.firstChild.childNodes[i]);
      ReactComponent[this._bodyLayout].htmlElement.firstChild.childNodes[i].scrollTo(0, offset)
    }

    console.log('react component',ReactComponent[this._bodyLayout])
  }
}
