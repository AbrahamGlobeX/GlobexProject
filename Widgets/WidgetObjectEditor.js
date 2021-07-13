class BaseObjectEditor {
  constructor() {
    this.unitTypesID = "609a6e539fb518e175a3f8e3";
    this.categoryOfPropertiesID = "60b9cf4b00920ec6cb9841f4";
    this._categoryOfProperties = {};
    this._unitTypes = {};
    this._languages = {
      ru: {
        name: {
          ru: "Русский",
          en: "Russian",
        },
        default: true,
      },
      en: {
        name: {
          ru: "Английский",
          en: "English",
        },
        default: true,
      },
    };
    this._valueTypes = {
      string: {
        name: {
          ru: "Строчный",
          en: "String",
        },
      },
      number: {
        name: {
          ru: "Числовой",
          en: "Number",
        },
      },
    };
    this._unitGroups = {
      Basic: {
        name: {
          ru: "Базовые",
          en: "Basic",
        },
      },
    };
  }
  calculateValue(input, formula) {
    console.log("inout", input);
    console.log("typeof", typeof input);
    return eval(formula.replaceAll("x0", input));
  }
  changeUnits(value, system, unitType, oldUnits, newUnits) {
    console.log("this._unitTypes", this._unitTypes);
    return this.calculateValue(
      this.calculateValue(
        value,
        this._unitTypes["types"][system][unitType]["units"][oldUnits][
          "fromFormula"
        ]
      ),
      this._unitTypes["types"][system][unitType]["units"][newUnits]["toFormula"]
    );
  }
  widgetSetStyle(widgetID, styles) {
    for (let style of Object.keys(styles)) {
      ReactComponent[widgetID].setStyleProp(style, styles[style]);
    }
  }
  drawLayout(parentID, type, styles = {}) {
    /*if(type !== "layoutHorizontal" || type !== "layoutVertical"){
            console.error("[drawLayout] " + type + " is not validate");
        }*/

    const layout = new widgetsComponentsTypes[type]();
    this.widgetSetStyle(layout.id, styles);

    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[layout.id]);
    }
    return layout.id;
  }

  drawLabel(parentID, text, styles = {}) {
    const label = new WidgetLabel();
    label.text = text;
    this.widgetSetStyle(label.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[label.id]);
    }
    return label.id;
  }

  drawInput(parentID, value = "", styles = {}) {
    const input = new WidgetInput();
    input.text = value;
    this.widgetSetStyle(input.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[input.id]);
    }
    return input.id;
  }

  drawComboBox(parentID, styles = {}) {
    const combobox = new WidgetComboBox();
    this.widgetSetStyle(combobox.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[combobox.id]);
    }
    return combobox.id;
  }
  fillComboBoxWithUnits(comboBox, units, unitDefault, property, callback) {
    console.log("units", units);
    let index = 0;
    for (let unit of Object.keys(units)) {
      ReactComponent[comboBox].addItem(units[unit]["label"]["ru"], () => {
        const newValue = this.changeUnits(
          property["$_value"] ? property["$_value"] : 0,
          "SI",
          property["$_unitType"],
          property["$_currentUnit"],
          unit
        );
        property["$_currentUnit"] = unit;
        property["$_value"] = newValue;
        callback(newValue);
      });
      if (unit == unitDefault) {
        property["$_currentUnit"] = unit;
        ReactComponent[comboBox].setCurrentItem(index);
      }
      index++;
    }
  }
  drawDialog(parentID, styles = {}) {
    const dialog = new WidgetDialog();
    this.widgetSetStyle(dialog.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[dialog.id]);
    }
    return dialog.id;
  }
  drawButton(parentID, text, styles = {}, callback = null) {
    const button = new WidgetButton();
    button.text = text;
    button.htmlElement.addEventListener("click", callback);
    this.widgetSetStyle(button.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[button.id]);
    }
    return button.id;
  }
  drawCheckbox(parentID = -1, styles = {}, callback = undefined) {
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
  drawTree(parentID = -1, styles = {}) {
    const tree = new WidgetTree();
    this.widgetSetStyle(tree.id, styles);
    if (parentID != -1) {
      ReactComponent[parentID].includeWidget(ReactComponent[tree.id]);
    }
    return tree.id;
  }
  addItemInTree(tree, parentID, text, callback = undefined) {
    const item = ReactComponent[tree].createItemInTree(parentID, callback);
    ReactComponent[item].text = text;
    return item;
  }
  copyObject(object) {
    return JSON.parse(JSON.stringify(object));
  }
  loadUnitTypes(handler) {
    const loaded = function (resultJSON) {
      console.log("resultJSON", resultJSON);
      if (!"cursor" in resultJSON) return;
      this._unitTypes = resultJSON["cursor"]["firstBatch"][0];
      console.log("this._unitTypes", this._unitTypes);
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    const request = '{"_id" : {"$oid" : "' + this.unitTypesID + '"}}';
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  loadCategoryOfProperties(callback) {
    const loaded = function (resultJSON) {
      console.log("loadCategoryOfPropert", resultJSON);
      this._categoryOfProperties = resultJSON.cursor.firstBatch[0].category;
      callback();
    };
    const request =
      '{"_id" : {"$oid" : "' + this.categoryOfPropertiesID + '"}}';
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  get languages() {
    return this._languages;
  }
  get valueTypes() {
    return this._valueTypes;
  }
  get unitTypes() {
    return this._unitTypes;
  }
  set unitTypes(value) {
    this._unitTypes = value;
  }
  get unitGroups() {
    return this._unitGroups;
  }
  get categoryOfProperties() {
    return this._categoryOfProperties;
  }
  set categoryOfProperties(value) {
    this._categoryOfProperties = value;
  }
  controlTypeInput(e, type) {
    if (type === "string") return;
    else if (type === "number") {
      console.log("e", e);
      switch (e.inputType) {
        case "deleteWordBackward": {
          e.target.value = "0";
          break;
        }
        case "deleteContentBackward": {
          if (e.target.value.length <= 0) {
            e.target.value = "0";
          }
          break;
        }
        default: {
          let inputValueLeft = e.target.value.substr(
            0,
            e.target.selectionStart - 1
          );
          let inputValueRight = e.target.value.substr(e.target.selectionStart);
          if (e.data == "." || e.data == ",") {
            if (
              inputValueLeft.indexOf(".") != -1 ||
              inputValueRight.indexOf(".") != -1
            ) {
              e.target.value = inputValueLeft + inputValueRight;
              return;
            }
            e.target.value = inputValueLeft + "." + inputValueRight;
            return;
          }
          if (!parseFloat(e.data) && parseFloat(e.data) != 0) {
            e.target.value = inputValueLeft + inputValueRight;
            return;
          }
          if (inputValueLeft.length == 1 && parseFloat(inputValueLeft) == 0) {
            inputValueLeft = "";
          }
          e.target.value = inputValueLeft + e.data + inputValueRight;
          break;
        }
      }
    }
  }
}
class CreatePropertyEditor extends BaseObjectEditor {
  constructor() {
    super();
    // widgets
    this._dialog;
    this._mainLayout;
    this._languageWidget;
    this._nameWidget;
    this._descWidget;
    this._wikiWidget;
    this._groupWidget;
    this._valueTypeWidget;
    this._unitTypeWidget;
    this._valueWidget;
    this._buttonsWidget;
    // newProperty
    this._language;
    this._name;
    this._desc;
    this._wiki;
    this._group;
    this._valueType;
    this._unitType;
    this._units;
    this._value;
  }
  drawForm() {
    this._dialog = this.drawDialog(-1);
    this._mainLayout = this.drawLayout(this._dialog, "layoutVertical", {
      minWidth: "500px",
    });
    this.drawLanguageWidget();
    this.drawNameWidget();
    this.drawDescWidget();
    this.drawWikiWidget();
    this.drawGroupWidget();
    this.drawValueTypeWidget();
    this.drawUnitTypeWidget();
    this.drawValueWidget();
    this.drawButtonWidget();
  }
  drawLanguageWidget() {
    this._languageWidget = {};
    this._languageWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._languageWidget["label"] = this.drawLabel(
      this._languageWidget["layout"],
      "Language"
    );
    this._languageWidget["comboBox"] = this.drawComboBox(
      this._languageWidget["layout"]
    );

    for (let language of Object.keys(this.languages)) {
      ReactComponent[this._languageWidget["comboBox"]].addItem(
        this.languages[language]["name"]["ru"],
        () => {
          this.changeLanguage(language);
        }
      );
    }
    ReactComponent[this._languageWidget["comboBox"]].setCurrentItem(0);
    this.changeLanguage(Object.keys(this.languages)[0]);
  }
  drawNameWidget() {
    this._nameWidget = {};
    this._nameWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._nameWidget["label"] = this.drawLabel(
      this._nameWidget["layout"],
      "Name"
    );
    this._nameWidget["input"] = this.drawInput(this._nameWidget["layout"]);
  }
  drawDescWidget() {
    this._descWidget = {};
    this._descWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._descWidget["label"] = this.drawLabel(
      this._descWidget["layout"],
      "Description"
    );
    this._descWidget["input"] = this.drawInput(this._descWidget["layout"]);
  }
  drawWikiWidget() {
    this._wikiWidget = {};
    this._wikiWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._wikiWidget["label"] = this.drawLabel(
      this._wikiWidget["layout"],
      "Wiki"
    );
    this._wikiWidget["input"] = this.drawInput(this._wikiWidget["layout"]);
  }
  drawGroupWidget() {
    this._groupWidget = {};
    this._groupWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._groupWidget["label"] = this.drawLabel(
      this._groupWidget["layout"],
      "Group"
    );
    this._groupWidget["comboBox"] = this.drawComboBox(
      this._groupWidget["layout"]
    );
  }
  drawValueTypeWidget() {
    this._valueTypeWidget = {};
    this._valueTypeWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._valueTypeWidget["label"] = this.drawLabel(
      this._valueTypeWidget["layout"],
      "Value type"
    );
    this._valueTypeWidget["comboBox"] = this.drawComboBox(
      this._valueTypeWidget["layout"]
    );

    for (let valueType of Object.keys(this.valueTypes)) {
      ReactComponent[this._valueTypeWidget["comboBox"]].addItem(
        this.valueTypes[valueType]["name"]["ru"],
        () => {
          this.changeValueType(valueType);
        }
      );
    }
  }
  drawUnitTypeWidget() {
    this._unitTypeWidget = {};
    this._unitTypeWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%", display: "none" }
    );
    this._unitTypeWidget["label"] = this.drawLabel(
      this._unitTypeWidget["layout"],
      "Unit Type"
    );
    this._unitTypeWidget["comboBox"] = this.drawComboBox(
      this._unitTypeWidget["layout"]
    );
  }

  drawValueWidget() {
    this._valueWidget = {};
    this._valueWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._valueWidget["label"] = this.drawLabel(
      this._valueWidget["layout"],
      "Your value"
    );
    this._valueWidget["input"] = this.drawInput(this._valueWidget["layout"]);

    ReactComponent[this._valueWidget["input"]].htmlElement.oninput =
      this.controlValueInput.bind(this);

    this._valueWidget["comboBox"] = this.drawComboBox(
      this._valueWidget["layout"],
      { display: "none" }
    );
  }
  drawButtonWidget() {
    this._buttonsWidget = {};
    this._buttonsWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutHorizontal",
      { width: "100%" }
    );
    this._buttonsWidget["btns"] = {
      BTNOK: this.drawButton(
        this._buttonsWidget["layout"],
        "Create",
        { textColor: "#123456" },
        () => {}
      ),
      BTNCANCEL: this.drawButton(
        this._buttonsWidget["layout"],
        "Cancel",
        { textColor: "#123456" },
        () => {
          ReactComponent[this._dialog].destroyWidget();
        }
      ),
    };
  }
  fillUnitTypeComboBox() {
    ReactComponent[this._unitTypeWidget["comboBox"]].clearItems();
    for (let unitType of Object.keys(this.unitTypes["types"])) {
      ReactComponent[this._unitTypeWidget["comboBox"]].addItem(
        this.unitTypes["types"][unitType]["name"]["ru"],
        () => {
          this.changeUnitType(unitType);
        }
      );
    }
  }
  fillUnitsComboBox() {
    ReactComponent[this._valueWidget["comboBox"]].clearItems();
    let index = 0;
    let thas = this;
    for (let unit of Object.keys(
      this.unitTypes["types"][this._unitType]["units"]
    )) {
      if (unit === this.unitTypes["types"][this._unitType]["default"]) {
        ReactComponent[this._valueWidget["comboBox"]].setCurrentItem(index);
        this._units = unit;
      }
      ReactComponent[this._valueWidget["comboBox"]].addItem(
        this.unitTypes["types"][this._unitType]["units"][unit]["label"]["ru"],
        () => {
          this._value = this.changeUnits(
            this._value ? this._value : 0,
            this._unitType,
            this._units,
            unit
          );
          this._units = unit;
          ReactComponent[this._valueWidget["input"]].text = this._value;
        }
      );
      index++;
    }
  }
  changeLanguage(language) {
    this._language = language;
  }
  changeUnitType(unitType) {
    this._unitType = unitType;
    this.fillUnitsComboBox();
  }
  changeValueType(valueType) {
    this._valueType = valueType;
    switch (valueType) {
      case "string": {
        this.widgetSetStyle(this._unitTypeWidget["layout"], {
          display: "none",
        });
        this.widgetSetStyle(this._valueWidget["comboBox"], { display: "none" });
        break;
      }
      case "number": {
        this.fillUnitTypeComboBox();
        this.widgetSetStyle(this._unitTypeWidget["layout"], {
          display: "flex",
        });
        this.widgetSetStyle(this._valueWidget["comboBox"], {
          display: "block",
        });
        break;
      }
    }
  }
  controlValueInput(e) {
    if (
      e.inputType == "deleteWordBackward" ||
      e.inputType == "deleteContentBackward"
    ) {
      this._value = e.target.value;
      return;
    }
    e.target.value = e.target.value.substr(0, e.target.value.length - 1);
    if (this._valueType == "number") {
      if (e.data.charCodeAt() < 48 || e.data.charCodeAt() > 57) return;
      if (this._value && this._value.length != 0) {
        console.log("0", this._value[0]);
        console.log("type", typeof this._value[0]);
      }
    }
    e.target.value += e.data;
    this._value = e.target.value;
  }
}

class UnitsEditor extends BaseObjectEditor {
  constructor() {
    super();
    this._dialog;
    this._mainLayout;
    this._leftWidget;
    this._rightWidget;
    this._addUnitWidget;
    this._addTypeUnitsWidget;
    this._addUnitGroupWidget;

    this._editorSystem = new UnitsEditorSystem(this);
    this._languageSystem = new LanguageSystem(this);
    this._currentSystem;
    this._currentTypeUnit;

    this.unitTypes;
    this._addUnitGroup = undefined;

    this._saveButton = undefined;
    this._showedButtonSave = false;
    this.init();
  }
  changeUnitGroup(group) {
    this._addUnitGroup = group;
  }
  init() {
    this.loadUnitType();
    this.drawForm();
  }
  loadUnitType() {
    //this.unitTypes = {};
    //this.unitTypes = this.copyObject(this.unitTypes);
    console.log("unitTypes", this.unitTypes);
  }
  loaded(handler) {
    const loaded = function (result) {
      if ("cursor" in result) {
        console.log("this", this);
        this.unitTypes = result["cursor"]["firstBatch"][0];
        console.log("unitTypes", this.unitTypes);
      }
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    const request = '{"_id" : {"$oid" : "' + this.unitTypesID + '"}}';
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  drawForm() {
    this._dialog = this.drawDialog(-1);
    this._mainLayout = this.drawLayout(this._dialog, "layoutHorizontal", {
      minWidth: "700px",
    });
    this.drawLeftWidget();
    this.drawRightWidget();
    window.oncontextmenu = this.showCustomMenu.bind(this);
    window.onclick = () => {
      if (this._contextMenu) {
        this._contextMenu.remove();
      }
    };
  }
  showCustomMenu(e) {
    if (!this._currentSystem) return false;
    if (this._contextMenu) {
      this._contextMenu.remove();
    }
    const name = e.target.textContent;
    let finded = undefined;
    for (let typeUnit of Object.keys(
      this.unitTypes["types"][this._currentSystem]
    )) {
      if (
        this.unitTypes["types"][this._currentSystem][typeUnit]["name"]["ru"] ===
        name
      ) {
        console.log(this.unitTypes["types"][this._currentSystem][typeUnit]);
        finded = typeUnit;
        break;
      }
    }
    if (!finded) return false;
    this.drawCustomMenuForm(APP.UI.mX, APP.UI.mY, (event) => {
      switch (event) {
        case "edit": {
          this.showFormEditTypeUnit(finded, () => {
            this.loadUnitType();
            this.drawSystem(this._currentSystem);
          });
          break;
        }
        case "remove": {
          delete this.unitTypes["types"][this._currentSystem][finded];
          this.loadUnitType();
          this.drawSystem(this._currentSystem);
          break;
        }
      }
    });
    return false;
  }
  showFormEditTypeUnit(unit, callback) {
    const dialog = this.drawDialog(-1);
    const mainlayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "90vw",
    });

    const groupLayout = this.drawLayout(mainlayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawLabel(groupLayout, "Select Group");
    const groupComboBox = this.drawComboBox(groupLayout);

    let groupIndex = 0;
    let currentGroup = undefined;
    for (let group of Object.keys(this.unitGroups)) {
      ReactComponent[groupComboBox].addItem(
        this.unitGroups[group]["name"]["ru"],
        () => {
          currentGroup = group;
        }
      );
      if (
        group === this.unitTypes["types"][this._currentSystem][unit]["category"]
      ) {
        ReactComponent[groupComboBox].setCurrentItem(groupIndex);
      }
      groupIndex++;
    }

    const languageListLayout = this.drawLayout(
      this.drawLayout(mainlayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "300px" }
    );

    const languageSystem = new LanguageSystem();

    for (let language of Object.keys(
      this.unitTypes["types"][this._currentSystem][unit]["name"]
    )) {
      languageSystem.addSelectedLanguage(language);
    }
    const valueInputs = {};

    const selectedLanguage = function (language) {
      const layout = this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      });
      this.drawLabel(
        layout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      valueInputs[language] = "";
      ReactComponent[
        this.drawInput(layout, valueInputs[language])
      ].htmlElement.oninput = (e) => {
        valueInputs[language] = e.target.value;
      };
    };

    for (let language of Object.keys(languageSystem.selectedLanguages)) {
      const layout = this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      });
      this.drawLabel(
        layout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      valueInputs[language] =
        this.unitTypes["types"][this._currentSystem][unit]["name"][language];
      ReactComponent[
        this.drawInput(layout, valueInputs[language])
      ].htmlElement.oninput = (e) => {
        valueInputs[language] = e.target.value;
      };
    }

    this.drawButton(
      this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "10%",
        minHeight: "50px",
        maxHeight: "50px",
        marginLeft: "85%",
        marginTop: "20px",
        background: "#ddd",
      }),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        languageSystem.drawForm();
      }
    );

    const btnLayout = this.drawLayout(mainlayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(btnLayout, "Save", { color: "#123456" }, () => {
      this.unitTypes["types"][this._currentSystem][unit]["name"] = valueInputs;
      this.unitTypes["types"][this._currentSystem][unit]["category"] =
        currentGroup;
      console.log(this.unitTypes);
      ReactComponent[dialog].destroyWidget();
      callback();
    });
    this.drawButton(btnLayout, "Cancel", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
    });
  }
  drawCustomMenuForm(mx, my, callback) {
    this._contextMenu = document.createElement("div");
    this._contextMenu.style.position = "absolute";
    this._contextMenu.style.left = mx + "px";
    this._contextMenu.style.top = my + "px";
    this._contextMenu.style.background = "#bbb7b7";
    this._contextMenu.style.zIndex = 9999;
    this._contextMenu.style.color = "white";
    this._contextMenu.style.fontWeight = "bold";
    this._contextMenu.style.fontSize = "15px";

    const menuItem1 = document.createElement("div");
    menuItem1.innerHTML = "Edit";
    menuItem1.style.padding = "5px";
    menuItem1.onclick = (e) => {
      callback("edit");
    };
    menuItem1.onmouseenter = () => {
      menuItem1.background = "#aaa";
    };
    menuItem1.onmouseleave = () => {
      menuItem1.background = "none";
    };

    const menuItem2 = document.createElement("div");
    menuItem2.style.padding = "5px";
    menuItem2.innerHTML = "Remove";

    menuItem2.onclick = (e) => {
      callback("remove");
    };

    menuItem2.onmouseenter = () => {
      menuItem2.background = "#aaa";
    };
    menuItem2.onmouseleave = () => {
      menuItem2.background = "none";
    };

    this._contextMenu.append(menuItem1);
    this._contextMenu.append(menuItem2);
    document.body.append(this._contextMenu);
  }
  drawLeftWidget() {
    this._leftWidget = {};
    this._leftWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutVertical",
      { height: "500px", maxWidth: "40%", borderRight: "2px solid" }
    );

    this._leftWidget["unitListLayout"] = this.drawLayout(
      this.drawLayout(this._leftWidget["layout"], "layoutHorizontal", {
        minHeight: "80%",
        maxHeight: "80%",
        width: "100%",
      }),
      "layoutVertical",
      { height: "100%" }
    );
    this._leftWidget["btnLayout"] = this.drawLayout(
      this._leftWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this._leftWidget["btnSelect"] = this.drawButton(
      this._leftWidget["btnLayout"],
      "Select",
      { color: "#123456" },
      () => {
        this._editorSystem.drawSelectSystemWidget();
      }
    );
  }
  drawRightWidget() {
    this._rightWidget = {};
    this._rightWidget["layout"] = this.drawLayout(
      this._mainLayout,
      "layoutVertical",
      { height: "100%" }
    );
    this._rightWidget["header"] = {};
    this._rightWidget["header"]["layout"] = this.drawLayout(
      this._rightWidget["layout"],
      "layoutHorizontal",
      { width: "100%", paddingBottom: "20px", borderBottom: "2px solid" }
    );
    this._rightWidget["header"]["systemLabel"] = this.drawLabel(
      this._rightWidget["header"]["layout"],
      "",
      {}
    );
    this._rightWidget["units"] = {};
    this._rightWidget["units"]["defaultUnitLayout"] = this.drawLayout(
      this._rightWidget["layout"],
      "layoutHorizontal",
      {
        marginTop: "20px",
        display: "none",
        width: "90%",
        marginLeft: "5%",
        border: "2px solid",
      }
    );

    this._rightWidget["units"]["unitListLayout"] = this.drawLayout(
      this.drawLayout(this._rightWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "layoutVertical",
      { height: "300px" }
    );
  }

  drawSystem(system) {
    console.log("system", system);
    if (!this._rightWidget.hasOwnProperty("header")) return;
    if (!this._leftWidget.hasOwnProperty("unitListLayout")) return;
    ReactComponent[
      this._rightWidget["units"]["defaultUnitLayout"]
    ].clearWidget();
    ReactComponent[this._rightWidget["units"]["unitListLayout"]].clearWidget();
    this._currentSystem = system;
    console.log("unitTypes", this.unitTypes);
    ReactComponent[this._rightWidget["header"]["systemLabel"]].text =
      this.unitTypes["systems"][system]["name"]["ru"];

    ReactComponent[this._leftWidget["unitListLayout"]].clearWidget();
    const seperated = this.seperatedTypeUnitByGroup();
    const groupLayout = {};
    console.log("seperated", seperated);

    for (let group of Object.keys(seperated)) {
      console.log("group", group);
      const maxMinHeight =
        Object.keys(seperated[group]).length * 50 + 50 + "px";
      groupLayout[group] = this.drawLayout(
        this.drawLayout(
          this._leftWidget["unitListLayout"],
          "layoutHorizontal",
          { width: "100%", maxHeight: maxMinHeight, minHeight: maxMinHeight }
        ),
        "layoutVertical",
        { height: "100%" }
      );
      const groupLabel = this.drawLabel(
        this.drawLayout(groupLayout[group], "layoutHorizontal", {
          width: "100%",
          minHeight: "50px",
          maxHeight: "50px",
        }),
        this.unitGroups[group]["name"]["ru"],
        { width: "100%" }
      );
      ReactComponent[groupLabel].controlHorizontalTextAlign(1);
      ReactComponent[groupLabel].htmlText.style.fontSize = "20px";
      for (let unit of Object.keys(seperated[group])) {
        const unitLayout = this.drawLayout(
          groupLayout[group],
          "layoutHorizontal",
          {
            width: "90%",
            marginLeft: "10%",
            minHeight: "50px",
            maxHeight: "50px",
          }
        );
        const button = this.drawButton(
          unitLayout,
          seperated[group][unit]["name"]["ru"],
          { color: "#123456", height: "50px" },
          () => {
            this.loadUnitType();
            this._currentTypeUnit = unit;
            this.drawTypeUnits();
          }
        );
        ReactComponent[button].fontSizes = 15;
        ReactComponent[button].controlHorizontalTextAlign(1);
      }
    }
    this.drawButton(
      this.drawLayout(this._leftWidget["unitListLayout"], "layoutHorizontal", {
        width: "20%",
        minHeight: "50px",
        maxHeight: "50px",
        background: "#ddd",
        marginLeft: "75%",
      }),
      "+",
      { color: "#123456" },
      () => {
        this.drawAddTypeUnitsWidget((unit) => {
          const category =
            this.unitTypes["types"][this._currentSystem][unit]["category"];

          if (!seperated.hasOwnProperty(category)) {
            seperated[category] = {};
            groupLayout[category] = this.drawLayout(
              this.drawLayout(
                this._leftWidget["unitListLayout"],
                "layoutHorizontal",
                { width: "100%" }
              ),
              "layoutVertical",
              { height: "100%" }
            );

            const groupLabel = this.drawLabel(
              groupLayout[category],
              this.unitGroups[category]["name"]["ru"],
              { width: "100%" }
            );
            ReactComponent[groupLabel].controlHorizontalTextAlign(1);
            ReactComponent[groupLabel].htmlText.style.fontSize = "20px";

            ReactComponent[this._leftWidget["unitListLayout"]].childGoToLast(
              ReactComponent[this._leftWidget["unitListLayout"]].children
                .length - 2
            );
          }
          seperated[category][unit] =
            this.unitTypes["types"][this._currentSystem][unit];
          const maxMinHeight =
            Object.keys(seperated[category]).length * 20 + 50 + "px";
          console.log("seperated", seperated);
          console.log("maxMin", maxMinHeight);
          this.widgetSetStyle(ReactComponent[groupLayout[category]].parentId, {
            minHeight: maxMinHeight,
            maxHeight: maxMinHeight,
          });

          const unitLayout = this.drawLayout(
            groupLayout[category],
            "layoutHorizontal",
            {
              width: "90%",
              marginLeft: "10%",
              minHeight: "20px",
              maxHeight: "20px",
            },
            { height: "100%" }
          );
          const button = this.drawButton(
            unitLayout,
            this.unitTypes["types"][this._currentSystem][unit]["name"]["ru"],
            { color: "#123456", height: "20px" },
            () => {
              this.hideButtonSave();
              this.loadUnitType();
              this._currentTypeUnit = unit;
              this.drawTypeUnits();
            }
          );
          ReactComponent[button].fontSizes = 20;
          ReactComponent[button].controlHorizontalTextAlign(1);
          //ReactComponent[this._leftWidget["unitListLayout"]].childGoToLast(ReactComponent[this._leftWidget["unitListLayout"]].children.length - 2);
        });
      }
    );
  }
  saveUnits() {
    //this.unitTypes = this.copyObject(this.unitTypes);
    console.log("unitTypes", this.unitTypes);
    const saved = function (result) {
      console.log("result", result);
      this.hideButtonSave();
      this.loadUnitType();
    };
    const sets = {
      $set: {
        systems: this.unitTypes["systems"],
        types: this.unitTypes["types"],
      },
    };
    console.log("sets", sets);
    APP.dbWorker.responseDOLMongoRequest = saved;
    APP.dbWorker.sendUpdateRCRequest(
      "DOLMongoRequest",
      this.unitTypesID,
      JSON.stringify(sets)
    );
  }
  showButtonSave() {
    if (this._showedButtonSave) return;
    if (!this._saveButton) return;
    this._isNeedSave = false;
    this.widgetSetStyle(this._saveButton, { display: "flex" });
    this._showedButtonSave = true;
  }
  hideButtonSave() {
    if (!this._showedButtonSave) return;
    if (!this._saveButton) return;
    this.widgetSetStyle(this._saveButton, { display: "none" });
    this._showedButtonSave = false;
  }
  drawAddTypeUnitsWidget(callback) {
    this._addTypeUnitsWidget = {};
    this._addTypeUnitsWidget["dialog"] = this.drawDialog(-1);
    this._addTypeUnitsWidget["layout"] = this.drawLayout(
      this._addTypeUnitsWidget["dialog"],
      "layoutVertical",
      { minWidth: "600px" }
    );

    this.drawLabel(
      this.drawLayout(this._addTypeUnitsWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      this.unitTypes["systems"][this._currentSystem]["name"]["ru"]
    );
    this.drawLabel(
      this.drawLayout(this._addTypeUnitsWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "Добавить тип величины"
    );

    const languageInputs = {};

    const selectedLanguage = function (language) {
      const layout = this.drawLayout(
        this._addTypeUnitsWidget["languagesLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        layout,
        this._languageSystem.selectedLanguages[language]["name"]["ru"]
      ),
        { maxWidth: "50%", minWidth: "50%" };
      languageInputs[language] = "";
      ReactComponent[
        this.drawInput(layout, "", { maxWidth: "50%", minWidth: "50%" })
      ].htmlElement.oninput = (e) => {
        languageInputs[language] = e.target.value;
      };
      ReactComponent[this._addTypeUnitsWidget["languagesLayout"]].childGoToLast(
        ReactComponent[this._addTypeUnitsWidget["languagesLayout"]].children
          .length - 2
      );
    };

    let currentGroupComboBoxIndex = 0;

    const groupLayout = this.drawLayout(
      this._addTypeUnitsWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawLabel(groupLayout, "Select group");
    const groupComboBox = this.drawComboBox(groupLayout);

    for (let group of Object.keys(this.unitGroups)) {
      currentGroupComboBoxIndex++;
      ReactComponent[groupComboBox].addItem(
        this.unitGroups[group]["name"]["ru"],
        () => {
          this.changeUnitGroup(group);
        }
      );
    }
    let createGroupFunc;
    createGroupFunc = function () {
      this.drawAddUnitGroup((groupName) => {
        ReactComponent[groupComboBox].removeItem(currentGroupComboBoxIndex);

        ReactComponent[groupComboBox].addItem(
          this.unitGroups[groupName]["name"]["ru"],
          () => {
            this.changeUnitGroup(groupName);
          }
        );

        ReactComponent[groupComboBox].setCurrentItem(currentGroupComboBoxIndex);

        ReactComponent[groupComboBox].addItem(
          "Create group",
          createGroupFunc.bind(this)
        );
        currentGroupComboBoxIndex++;
      });
      console.log("created");
    };
    ReactComponent[groupComboBox].addItem(
      "Create group",
      createGroupFunc.bind(this)
    );

    const typeLayout = this.drawLayout(
      this._addTypeUnitsWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawLabel(typeLayout, "Select type");
    const typeComboBox = this.drawComboBox(typeLayout);

    let valueType = undefined;

    ReactComponent[typeComboBox].addItem("Строка", () => {
      valueType = "string";
    });
    ReactComponent[typeComboBox].addItem("Число", () => {
      valueType = "number";
    });

    this.drawLabel(
      this.drawLayout(this._addTypeUnitsWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "Имя"
    );

    const LanguagesHeaderLayout = this.drawLayout(
      this._addTypeUnitsWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );

    this.drawLabel(LanguagesHeaderLayout, "Язык", {
      maxWidth: "50%",
      minWidth: "50%",
    });
    this.drawLabel(LanguagesHeaderLayout, "Название", {
      maxWidth: "50%",
      minWidth: "50%",
    });

    this._addTypeUnitsWidget["languagesLayout"] = this.drawLayout(
      this.drawLayout(this._addTypeUnitsWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "layoutVertical",
      { height: "300px" }
    );
    for (let language of Object.keys(this._languageSystem.defaultLanguages)) {
      const layout = this.drawLayout(
        this._addTypeUnitsWidget["languagesLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        layout,
        this._languageSystem.defaultLanguages[language]["name"]["ru"],
        { maxWidth: "50%", minWidth: "50%" }
      );
      languageInputs[language] = "";
      ReactComponent[
        this.drawInput(layout, "", { maxWidth: "50%", minWidth: "50%" })
      ].htmlElement.oninput = (e) => {
        languageInputs[language] = e.target.value;
      };
    }

    this.drawButton(
      this.drawLayout(
        this._addTypeUnitsWidget["languagesLayout"],
        "layoutHorizontal",
        {
          width: "10%",
          background: "#ddd",
          marginTop: "20px",
          marginLeft: "90%",
          minHeight: "50px",
          maxHeight: "50px",
        }
      ),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        this._languageSystem.drawForm();
      }
    );

    const btnLayout = this.drawLayout(
      this._addTypeUnitsWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawButton(btnLayout, "Create", { color: "#123456" }, () => {
      for (let language of Object.keys(languageInputs)) {
        if (languageInputs[language].length <= 0) {
          return APP.log(
            "error",
            "Вы не заполнили поле с именем для " + language + " языка"
          );
        }
      }
      if (!this._addUnitGroup) {
        return APP.log("error", "Вы не выбрали группу");
      }
      if (!valueType) {
        return APP.log("error", "Вы не выбрали тип");
      }
      const name = languageInputs.hasOwnProperty("en")
        ? languageInputs["en"]
        : languageInputs["ru"];
      this.unitTypes["types"][this._currentSystem][name] = {
        name: languageInputs,
        category: this._addUnitGroup,
        units: {},
        type: valueType,
        default: "",
      };
      console.log(this.unitTypes["types"][this._currentSystem][name]);
      this._languageSystem.clearSelectedLanguages();
      ReactComponent[this._addTypeUnitsWidget["dialog"]].destroyWidget();
      this._addTypeUnitsWidget = {};
      callback(name);
    });
    this.drawButton(btnLayout, "Cancel", { color: "#123456" }, () => {
      this._languageSystem.clearSelectedLanguages();
      ReactComponent[this._addTypeUnitsWidget["dialog"]].destroyWidget();
      this._addTypeUnitsWidget = {};
    });
  }
  seperatedTypeUnitByGroup() {
    const seperated = {};
    //console.log("this._currentSystem",this._currentSystem);
    if (!this.unitTypes["types"].hasOwnProperty(this._currentSystem)) {
      this.unitTypes["types"][this._currentSystem] = {};
    }
    for (let unitType of Object.keys(
      this.unitTypes["types"][this._currentSystem]
    )) {
      let category =
        this.unitTypes["types"][this._currentSystem][unitType]["category"];
      if (!seperated.hasOwnProperty(category)) {
        seperated[category] = {};
      }
      seperated[category][unitType] =
        this.unitTypes["types"][this._currentSystem][unitType];
    }
    return seperated;
  }
  drawTypeUnits() {
    ReactComponent[
      this._rightWidget["units"]["defaultUnitLayout"]
    ].clearWidget();
    ReactComponent[this._rightWidget["units"]["unitListLayout"]].clearWidget();
    if (this._saveButton) {
      ReactComponent[this._saveButton].destroyWidget();
      this._saveButton = undefined;
      this._showedButtonSave = false;
    }
    this.widgetSetStyle(this._rightWidget["units"]["defaultUnitLayout"], {
      display: "flex",
    });
    const type =
      this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "type"
      ];
    switch (type) {
      case "number": {
        this.drawTypeNumberUnits();
        break;
      }
      case "string": {
        this.drawTypeStringUnits();
        break;
      }
    }
    this._saveButton = this.drawLayout(
      this._rightWidget["layout"],
      "layoutHorizontal",
      { width: "25%", display: "none" }
    );
    this.drawButton(this._saveButton, "Save", { color: "#123456" }, () => {
      this.saveUnits();
    });

    if (this._isNeedSave) {
      this.showButtonSave();
    }
  }
  drawTypeStringUnits() {
    const baseSystem =
      this.unitTypes["systems"][this._currentSystem]["baseSystem"];
    const unitBaseSystems = [];
    if (baseSystem) {
      const layoutHeader = this.drawLayout(
        this._rightWidget["units"]["unitListLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(layoutHeader, "Base System value", { maxWidth: "45%" });
      this.drawLabel(layoutHeader, "Value", { maxWidth: "45%" });

      for (let unit of Object.keys(
        this.unitTypes["types"][baseSystem][this._currentTypeUnit]["units"]
      )) {
        const layout = this.drawLayout(
          this._rightWidget["units"]["unitListLayout"],
          "layoutHorizontal",
          { width: "100%", minHeight: "50px", maxHeight: "50px" }
        );
        this.drawLabel(
          layout,
          this.unitTypes["types"][baseSystem][this._currentTypeUnit]["units"][
            unit
          ]["label"]["ru"],
          { maxWidth: "45%" }
        );
        const value = this.drawLabel(
          layout,
          this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
            "units"
          ][unit]["label"]["ru"],
          { maxWidth: "45%" }
        );
        this.drawButton(
          layout,
          "edit",
          { color: "#123456", maxWidth: "50px", cursor: "pointer" },
          () => {
            this.formEditValue(unit, () => {
              ReactComponent[value].text =
                this.unitTypes["types"][this._currentSystem][
                  this._currentTypeUnit
                ]["units"][unit]["label"]["ru"];
              this.showButtonSave();
            });
          }
        );
        unitBaseSystems.push(unit);
      }
    }
    const layoutHeader = this.drawLayout(
      this._rightWidget["units"]["unitListLayout"],
      "layoutHorizontal",
      { width: "100%", minHeight: "50px", maxHeight: "50px" }
    );
    this.drawLabel(layoutHeader, "Value", { maxWidth: "80%" });
    for (let unit of Object.keys(
      this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "units"
      ]
    )) {
      if (unitBaseSystems.indexOf(unit) != -1) continue;
      const layout = this.drawLayout(
        this._rightWidget["units"]["unitListLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      const value = this.drawLabel(
        layout,
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["label"]["ru"],
        { maxWidth: "80%" }
      );
      this.drawButton(
        layout,
        "edit",
        { color: "#123456", maxWidth: "10%", cursor: "pointer" },
        () => {
          this.formEditValue(unit, () => {
            ReactComponent[value].text =
              this.unitTypes["types"][this._currentSystem][
                this._currentTypeUnit
              ]["units"][unit]["label"]["ru"];
            this.showButtonSave();
          });
        }
      );
      this.drawButton(
        layout,
        "X",
        { color: "#123456", maxWidth: "10%", cursor: "pointer" },
        () => {
          ReactComponent[
            this._rightWidget["units"]["unitListLayout"]
          ].deleteWidget(ReactComponent[layout]);
          delete this.unitTypes["types"][this._currentSystem][
            this._currentTypeUnit
          ]["units"][unit];
          this.showButtonSave();
        }
      );
    }
    this.drawButton(
      this.drawLayout(
        this._rightWidget["units"]["unitListLayout"],
        "layoutHorizontal",
        {
          width: "10%",
          marginTop: "20px",
          marginLeft: "85%",
          background: "#ddd",
          minHeight: "50px",
          maxHeight: "50px",
        }
      ),
      "+",
      { color: "#123456" },
      () => {
        this.drawFormAddUnit((unit) => {
          this.showButtonSave();
          const layout = this.drawLayout(
            this._rightWidget["units"]["unitListLayout"],
            "layoutHorizontal",
            { width: "100%", minHeight: "50px", maxHeight: "50px" }
          );
          this.drawLabel(
            layout,
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["label"]["ru"],
            { maxWidth: "80%" }
          );
          ReactComponent[
            this._rightWidget["units"]["unitListLayout"]
          ].childGoToLast(
            ReactComponent[this._rightWidget["units"]["unitListLayout"]]
              .children.length - 2
          );
        });
      }
    );
  }
  formEditValue(unit, callback) {
    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "600px",
    });
    const type =
      this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "type"
      ];
    const languageSystem = new LanguageSystem(this);
    const valueInputs = {};
    for (let language of Object.keys(
      this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "units"
      ][unit]["label"]
    )) {
      languageSystem.addSelectedLanguage(language);
    }
    const languagesListLayout = this.drawLayout(
      this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "300px" }
    );
    const layout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    this.drawLabel(layout, "Язык", {
      maxWidth: type === "number" ? "33%" : "50%",
    });
    if (type === "number") {
      this.drawLabel(layout, "Название", { maxWidth: "33%" });
      this.drawLabel(layout, "Сокр. Название", { maxWidth: "33%" });
    } else {
      this.drawLabel(layout, "Значение", { maxWidth: "50%" });
    }
    for (let language of Object.keys(languageSystem.selectedLanguages)) {
      const layout = this.drawLayout(languagesListLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      });
      this.drawLabel(
        layout,
        languageSystem.selectedLanguages[language]["name"]["ru"],
        { maxWidth: type === "number" ? "33%" : "50%" }
      );
      if (type === "number") {
        valueInputs[language] = {
          name: this.unitTypes["types"][this._currentSystem][
            this._currentTypeUnit
          ]["units"][unit]["name"][language],
          label:
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["label"][language],
        };
        ReactComponent[
          this.drawInput(layout, valueInputs[language]["name"], {
            maxWidth: "33%",
            padding: "0 20px",
          })
        ].htmlElement.oninput = (e) => {
          valueInputs[language]["name"] = e.target.value;
        };
        ReactComponent[
          this.drawInput(layout, valueInputs[language]["label"], {
            maxWidth: "33%",
            padding: "0 20px",
          })
        ].htmlElement.oninput = (e) => {
          valueInputs[language]["label"] = e.target.value;
        };
      } else {
        ReactComponent[
          this.drawInput(
            layout,
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["label"][language],
            { maxWidth: "50%" }
          )
        ].htmlElement.oninput = (e) => {
          valueInputs[language] = e.target.value;
        };
      }
    }
    const selectedLanguage = function (language) {
      const layout = this.drawLayout(languagesListLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      });
      this.drawLabel(layout, languageSystem[language]["name"]["ru"], {
        maxWidth: type === "number" ? "33%" : "50%",
      });
      if (type === "number") {
        valueInputs[language] = {
          name: "",
          label: "",
        };
        ReactComponent[
          this.drawInput(layout, valueInputs[language]["name"], {
            maxWidth: "33%",
            padding: "0 20px",
          })
        ].htmlElement.oninput = (e) => {
          valueInputs[language]["name"] = e.target.value;
        };
        ReactComponent[
          this.drawInput(layout, valueInputs[language]["label"], {
            maxWidth: "33%",
            padding: "0 20px",
          })
        ].htmlElement.oninput = (e) => {
          valueInputs[language]["label"] = e.target.value;
        };
      } else {
        ReactComponent[
          this.drawInput(
            layout,
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["label"][language]
          )
        ].htmlElement.oninput = (e) => {
          valueInputs[language] = e.target.value;
        };
      }
      ReactComponent[languagesListLayout].childGoToLast(
        ReactComponent[languagesListLayout].children.length - 2
      );
    };
    this.drawButton(
      this.drawLayout(languagesListLayout, "layoutHorizontal", {
        width: "10%",
        minHeight: "50px",
        maxHeight: "50px",
        marginLeft: "85%",
        marginTop: "20px",
        background: "#ddd",
      }),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        languageSystem.drawForm();
      }
    );

    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(btnLayout, "Save", { color: "#123456" }, () => {
      if (type === "number") {
        const names = {};
        const labels = {};
        for (let language of Object.keys(valueInputs)) {
          names[language] = valueInputs[language]["name"];
          labels[language] = valueInputs[language]["label"];
        }
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["name"] = names;
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["label"] = labels;
      } else {
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["label"] = valueInputs;
      }

      console.log(this.unitTypes);
      ReactComponent[dialog].destroyWidget();
      callback();
    });
    this.drawButton(btnLayout, "Cancel", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
    });
  }
  drawTypeNumberUnits() {
    this._defaultValue = 1;
    const valueInputs = {};

    const baseSystem =
      this.unitTypes["systems"][this._currentSystem]["baseSystem"];

    let defaultUnitName;
    let defaultUnitLabel;

    let defaultTypeUnit;

    if (!baseSystem) {
      if (
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "default"
        ] == ""
      ) {
        this.drawLabel(
          this._rightWidget["units"]["defaultUnitLayout"],
          "Dont created default unit"
        );
        this.drawButton(
          this._rightWidget["units"]["defaultUnitLayout"],
          "Create",
          { color: "#123456" },
          () => {
            this.drawFormAddUnit((unit) => {
              console.log("unit", unit);
              this._isNeedSave = true;
              this.unitTypes["types"][this._currentSystem][
                this._currentTypeUnit
              ]["default"] = unit;
              this.drawTypeUnits();
            });
          }
        );

        return;
      }
      defaultTypeUnit =
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "default"
        ];
      defaultUnitName =
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][defaultTypeUnit]["name"]["ru"];
      defaultUnitLabel =
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][defaultTypeUnit]["label"]["ru"];
    } else {
      if (
        this.unitTypes["types"][baseSystem][this._currentTypeUnit]["default"] ==
        ""
      ) {
        this.drawLabel(
          this._rightWidget["units"]["defaultUnitLayout"],
          "Base system Dont created default unit"
        );
        return;
      }
      defaultTypeUnit =
        this.unitTypes["types"][baseSystem][this._currentTypeUnit]["default"];
      defaultUnitName =
        this.unitTypes["types"][baseSystem][this._currentTypeUnit]["units"][
          defaultTypeUnit
        ]["name"]["ru"];
      defaultUnitLabel =
        this.unitTypes["types"][baseSystem][this._currentTypeUnit]["units"][
          defaultTypeUnit
        ]["label"]["ru"];
    }

    this._rightWidget["units"]["defaultUnitName"] = this.drawLabel(
      this._rightWidget["units"]["defaultUnitLayout"],
      defaultUnitName,
      {}
    );
    ReactComponent[this._rightWidget["units"]["defaultUnitName"]];
    ReactComponent[
      this.drawInput(
        this._rightWidget["units"]["defaultUnitLayout"],
        this._defaultValue,
        {}
      )
    ].htmlElement.oninput = (e) => {
      switch (e.inputType) {
        case "deleteWordBackward": {
          e.target.value = "0";
          break;
        }
        case "deleteContentBackward": {
          if (e.target.value.length <= 0) {
            e.target.value = "0";
          }
          break;
        }
        default: {
          let inputValueLeft = e.target.value
            .substr(0, e.target.selectionStart - 1)
            .replaceAll(" ", "");
          let inputValueRight = e.target.value
            .substr(e.target.selectionStart)
            .replaceAll(" ", "");

          if (e.data == "." || e.data == ",") {
            if (
              inputValueLeft.indexOf(".") != -1 ||
              inputValueRight.indexOf(".") != -1
            ) {
              e.target.value = inputValueLeft + inputValueRight;
              return;
            }
            e.target.value = inputValueLeft + "." + inputValueRight;
            return;
          }
          if (!parseFloat(e.data) && parseFloat(e.data) != 0) {
            e.target.value = inputValueLeft + inputValueRight;
            return;
          }
          if (inputValueLeft.length == 1 && parseFloat(inputValueLeft) == 0) {
            inputValueLeft = "";
          }
          e.target.value = inputValueLeft + e.data + inputValueRight;

          break;
        }
      }
      this._defaultValue = parseFloat(e.target.value);
      for (let unit of Object.keys(valueInputs)) {
        ReactComponent[valueInputs[unit]].text = this.calculateValue(
          this._defaultValue,
          this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
            "units"
          ][unit]["toFormula"]
        );
      }
    };
    this._rightWidget["units"]["defaultUnitLabel"] = this.drawLabel(
      this._rightWidget["units"]["defaultUnitLayout"],
      defaultUnitLabel,
      {}
    );
    const labelUnits = {};
    for (let unit of Object.keys(
      this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "units"
      ]
    )) {
      if (unit === defaultTypeUnit) continue;
      const layout = this.drawLayout(
        this._rightWidget["units"]["unitListLayout"],
        "layoutHorizontal",
        { width: "90%", marginLeft: "5%", minHeight: "50px", maxHeight: "50px" }
      );
      const name = this.drawLabel(
        layout,
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["name"]["ru"]
      );
      let value = this.calculateValue(
        this._defaultValue,
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["toFormula"]
      );
      valueInputs[unit] = this.drawInput(layout, value, {});
      ReactComponent[valueInputs[unit]].htmlElement.oninput = (e) => {
        this.controlValueInput(e, unit, labelUnits[unit]);
      };

      let modifer = this._defaultValue / value;
      labelUnits[unit] = this.drawLabel(
        layout,
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][unit]["label"]["ru"] +
          " (x" +
          modifer +
          ")",
        {}
      );

      this.drawButton(layout, "edit", { color: "#123456" }, () => {
        this.formEditValue(unit, () => {
          ReactComponent[name].text =
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["name"]["ru"];
          modifer = this.unitTypes["types"][this._currentSystem][
            this._currentTypeUnit
          ]["units"][unit]["fromFormula"].replaceAll("x0*", "");
          ReactComponent[labelUnits[unit]].text =
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["label"]["ru"] +
            " (x" +
            modifer +
            ")";
          this.showButtonSave();
        });
      });
      this.drawButton(layout, "X", { color: "#123456" }, () => {
        ReactComponent[
          this._rightWidget["units"]["unitListLayout"]
        ].deleteWidget(ReactComponent[layout]);
        delete this.unitTypes["types"][this._currentSystem][
          this._currentTypeUnit
        ]["units"][unit];
        this.showButtonSave();
      });
    }

    this.drawButton(
      this.drawLayout(
        this._rightWidget["units"]["unitListLayout"],
        "layoutHorizontal",
        {
          width: "10%",
          marginTop: "20px",
          marginLeft: "85%",
          background: "#ddd",
          minHeight: "50px",
          maxHeight: "50px",
        }
      ),
      "+",
      { color: "#123456" },
      () => {
        this.drawFormAddUnit((unit) => {
          this.showButtonSave();
          const layout = this.drawLayout(
            this._rightWidget["units"]["unitListLayout"],
            "layoutHorizontal",
            {
              width: "90%",
              marginLeft: "5%",
              minHeight: "50px",
              maxHeight: "50px",
            }
          );
          const name = this.drawLabel(
            layout,
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["name"]["ru"]
          );
          let value = this.calculateValue(
            this._defaultValue,
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["toFormula"]
          );
          valueInputs[unit] = this.drawInput(layout, value, {});
          ReactComponent[valueInputs[unit]].htmlElement.oninput = (e) => {
            this.controlValueInput(e, unit, labelUnits[unit]);
          };
          let modifer = this._defaultValue / value;
          labelUnits[unit] = this.drawLabel(
            layout,
            this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
              "units"
            ][unit]["label"]["ru"] +
              " (x" +
              modifer +
              ")",
            {}
          );

          this.drawButton(layout, "edit", { color: "#123456" }, () => {
            this.formEditValue(unit, () => {
              ReactComponent[name].text =
                this.unitTypes["types"][this._currentSystem][
                  this._currentTypeUnit
                ]["units"][unit]["name"]["ru"];
              modifer = this.unitTypes["types"][this._currentSystem][
                this._currentTypeUnit
              ]["units"][unit]["fromFormula"].replaceAll("x0*", "");
              ReactComponent[labelUnits[unit]].text =
                this.unitTypes["types"][this._currentSystem][
                  this._currentTypeUnit
                ]["units"][unit]["label"]["ru"] +
                " (x" +
                modifer +
                ")";
              this.showButtonSave();
            });
          });
          this.drawButton(layout, "X", { color: "#123456" }, () => {
            ReactComponent[
              this._rightWidget["units"]["unitListLayout"]
            ].deleteWidget(ReactComponent[layout]);
            delete this.unitTypes["types"][this._currentSystem][
              this._currentTypeUnit
            ]["units"][unit];
            this.showButtonSave();
          });

          ReactComponent[
            this._rightWidget["units"]["unitListLayout"]
          ].childGoToLast(
            ReactComponent[this._rightWidget["units"]["unitListLayout"]]
              .children.length - 2
          );
        });
      }
    );
  }
  delimiterValue(number) {
    return (number + "").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
  }
  controlValueInput(e, unit, label) {
    console.log("e", e);
    switch (e.inputType) {
      case "deleteWordBackward": {
        e.target.value = "0";
        break;
      }
      case "deleteContentBackward": {
        if (e.target.value.length <= 0) {
          e.target.value = "0";
        }
        break;
      }
      default: {
        let inputValueLeft = e.target.value.substr(
          0,
          e.target.selectionStart - 1
        );
        let inputValueRight = e.target.value.substr(e.target.selectionStart);
        if (e.data == "." || e.data == ",") {
          if (
            inputValueLeft.indexOf(".") != -1 ||
            inputValueRight.indexOf(".") != -1
          ) {
            e.target.value = inputValueLeft + inputValueRight;
            return;
          }
          e.target.value = inputValueLeft + "." + inputValueRight;
          return;
        }
        if (!parseFloat(e.data) && parseFloat(e.data) != 0) {
          e.target.value = inputValueLeft + inputValueRight;
          return;
        }
        if (inputValueLeft.length == 1 && parseFloat(inputValueLeft) == 0) {
          inputValueLeft = "";
        }
        e.target.value = inputValueLeft + e.data + inputValueRight;
        break;
      }
    }
    let newValue = parseFloat(e.target.value);

    console.log("newValue", newValue);
    if (newValue === 0) return;
    const modifer = this._defaultValue / newValue;
    this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
      "units"
    ][unit]["toFormula"] = "x0/" + modifer;
    this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
      "units"
    ][unit]["fromFormula"] = "x0*" + modifer;

    ReactComponent[label].text =
      this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "units"
      ][unit]["label"]["ru"] +
      " (x" +
      modifer +
      ")";

    this.showButtonSave();
  }
  drawFormAddUnit(callback) {
    const type =
      this._unitTypes["types"][this._currentSystem][this._currentTypeUnit][
        "type"
      ];
    this.showButtonSave();
    this._addUnitWidget = {};
    this._addUnitWidget["dialog"] = this.drawDialog(-1);
    this._addUnitWidget["layout"] = this.drawLayout(
      this._addUnitWidget["dialog"],
      "layoutVertical",
      { minWidth: "600px" }
    );
    this.drawLabel(
      this.drawLayout(this._addUnitWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "" +
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "name"
        ]["ru"]
    );
    this.drawLabel(
      this.drawLayout(this._addUnitWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      type === "number" ? "Добавить единицу измерения" : "Добавить значение"
    );
    this._addUnitWidget["languageDescLayout"] = this.drawLayout(
      this._addUnitWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawLabel(this._addUnitWidget["languageDescLayout"], "Язык", {
      maxWidth: type === "number" ? "33%" : "50%",
    });
    this.drawLabel(
      this._addUnitWidget["languageDescLayout"],
      type === "number" ? "Название" : "Значение",
      { maxWidth: type === "number" ? "33%" : "50%" }
    );
    if (type === "number")
      this.drawLabel(
        this._addUnitWidget["languageDescLayout"],
        "Сокр.название",
        { maxWidth: "33%" }
      );

    let names = {};

    const selectedLanguage = function (language) {
      names[language] = {
        name: "",
        label: "",
      };
      const layout = this.drawLayout(
        this._addUnitWidget["languagesLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        layout,
        this._languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      ReactComponent[
        this.drawInput(layout, "", {
          maxWidth: type === "number" ? "33%" : "50%",
          padding: "0 20px",
        })
      ].htmlElement.oninput = (e) => {
        names[language]["name"] = e.target.value;
      };
      if (type === "number")
        ReactComponent[
          this.drawInput(layout, "", { maxWidth: "33%", padding: "0 20px" })
        ].htmlElement.oninput = (e) => {
          names[language]["label"] = e.target.value;
        };
      ReactComponent[this._addUnitWidget["languagesLayout"]].childGoToLast(
        ReactComponent[this._addUnitWidget["languagesLayout"]].children.length -
          2
      );
    };

    this._addUnitWidget["languagesLayout"] = this.drawLayout(
      this.drawLayout(this._addUnitWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "layoutVertical",
      { height: "300px" }
    );
    for (let language of Object.keys(this._languageSystem.defaultLanguages)) {
      names[language] = {
        name: "",
        label: "",
      };
      const layout = this.drawLayout(
        this._addUnitWidget["languagesLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        layout,
        this._languageSystem.defaultLanguages[language]["name"]["ru"]
      );
      ReactComponent[
        this.drawInput(layout, "", {
          maxWidth: type === "number" ? "33%" : "50%",
          padding: "0 20px",
        })
      ].htmlElement.oninput = (e) => {
        names[language]["name"] = e.target.value;
      };
      if (type === "number")
        ReactComponent[
          this.drawInput(layout, "", { maxWidth: "33%", padding: "0 20px" })
        ].htmlElement.oninput = (e) => {
          names[language]["label"] = e.target.value;
        };
    }
    this.drawButton(
      this.drawLayout(
        this._addUnitWidget["languagesLayout"],
        "layoutHorizontal",
        {
          width: "10%",
          minHeight: "50px",
          maxHeight: "50px",
          marginLeft: "87%",
          background: "#ddd",
          marginTop: "20px",
        }
      ),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        this._languageSystem.drawForm();
      }
    );

    const buttonsLayout = this.drawLayout(
      this._addUnitWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawButton(buttonsLayout, "Add", { color: "#123456" }, () => {
      for (let name of Object.keys(names)) {
        if (names[name]["name"].length <= 0) {
          return APP.log(
            "error",
            "Вы не заполнили " + type === "number"
              ? "полное имя"
              : "значение" + " для " + name + " языка"
          );
        }
        if (type === "number")
          if (names[name]["label"].length <= 0) {
            return APP.log(
              "error",
              "Вы не заполнили сокращенное имя для " + name + " языка"
            );
          }
      }
      let label;
      if (type === "number") {
        if (names.hasOwnProperty("en")) {
          label = names["en"]["label"];
        } else {
          label = names["ru"]["label"];
        }
        label = label.toUpperCase();

        let labelName = {};
        let fullName = {};

        for (let language of Object.keys(names)) {
          labelName[language] = names[language]["label"];
          fullName[language] = names[language]["name"];
        }

        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][label] = {
          label: labelName,
          name: fullName,
          fromFormula: "x0",
          toFormula: "x0",
        };
      } else if (type === "string") {
        let values = {};
        for (let language of Object.keys(names)) {
          values[language] = names[language]["name"];
        }
        const sizes = Object.keys(
          this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
            "units"
          ]
        ).length.toString();
        label = sizes;
        this.unitTypes["types"][this._currentSystem][this._currentTypeUnit][
          "units"
        ][sizes] = {
          label: values,
          name: {},
          fromFormula: "x0",
          toFormula: "x0",
        };
      }
      console.log(this.unitTypes);

      this._languageSystem.clearSelectedLanguages();
      ReactComponent[this._addUnitWidget["dialog"]].destroyWidget();
      this._addUnitWidget = {};

      callback(label);
    });
    this.drawButton(buttonsLayout, "Cancel", { color: "#123456" }, () => {
      this._languageSystem.clearSelectedLanguages();
      ReactComponent[this._addUnitWidget["dialog"]].destroyWidget();
      this._addUnitWidget = {};
    });
  }
  drawAddUnitGroup(callback) {
    this._addUnitGroupWidget = {};
    this._addUnitGroupWidget["dialog"] = this.drawDialog(-1);
    this._addUnitGroupWidget["layout"] = this.drawLayout(
      this._addUnitGroupWidget["dialog"],
      "layoutVertical",
      { minWidth: "500px" }
    );

    this._addUnitGroupWidget["langaugeLayout"] = this.drawLayout(
      this.drawLayout(this._addUnitGroupWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "layoutVertical",
      { height: "300px" }
    );

    const languageSystem = new LanguageSystem(this);

    const valueInputs = {};

    const selectedLanguage = function (language) {
      valueInputs[language] = "";
      const languageLayout = this.drawLayout(
        this._addUnitGroupWidget["langaugeLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        languageLayout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      ReactComponent[this.drawInput(languageLayout, "")].htmlElement.oninput = (
        e
      ) => {
        valueInputs[language] = e.target.value;
      };
      ReactComponent[this._addUnitGroupWidget["langaugeLayout"]].childGoToLast(
        ReactComponent[this._addUnitGroupWidget["langaugeLayout"]].children
          .length - 2
      );
    };

    for (let language of Object.keys(languageSystem.defaultLanguages)) {
      valueInputs[language] = "";
      const languageLayout = this.drawLayout(
        this._addUnitGroupWidget["langaugeLayout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        languageLayout,
        languageSystem.defaultLanguages[language]["name"]["ru"]
      );
      ReactComponent[this.drawInput(languageLayout, "")].htmlElement.oninput = (
        e
      ) => {
        valueInputs[language] = e.target.value;
      };
    }
    this.drawButton(
      this.drawLayout(
        this._addUnitGroupWidget["langaugeLayout"],
        "layoutHorizontal",
        {
          width: "10%",
          minHeight: "50px",
          maxHeight: "50px",
          marginLeft: "85%",
          marginTop: "20px",
          background: "#ddd",
        }
      ),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        languageSystem.drawForm();
      }
    );

    const btnLayout = this.drawLayout(
      this._addUnitGroupWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawButton(btnLayout, "Create", { color: "#123456" }, () => {
      for (let input of Object.keys(valueInputs)) {
        if (valueInputs[input].length <= 0) {
          return APP.log("error", "Вы не заполнили " + input + " поле");
        }
      }
      const groupName = valueInputs.hasOwnProperty("en")
        ? valueInputs["en"]
        : valueInputs["ru"];
      this.unitGroups[groupName] = {
        name: valueInputs,
      };
      console.log("unitGroup", this.unitGroups);

      ReactComponent[this._addUnitGroupWidget["dialog"]].destroyWidget();
      this._addUnitGroupWidget = {};
      callback(groupName);
    });
    this.drawButton(btnLayout, "Cancel", { color: "#123456" }, () => {
      ReactComponent[this._addUnitGroupWidget["dialog"]].destroyWidget();
      this._addUnitGroupWidget = {};
    });
  }
}
class LanguageSystem extends BaseObjectEditor {
  constructor(externalSystem) {
    super();
    this._$externalSystem = externalSystem;
    this._selectLanguageWidget;
    this._selectedLanguages = {};
    this._defaultLanguages = {};
    this.init();
  }
  init() {
    for (let language of Object.keys(this.languages)) {
      if (this.languages[language]["default"]) {
        this._defaultLanguages[language] = this.languages[language];
      }
    }
  }
  drawForm() {
    this._selectLanguageWidget = {};
    this._selectLanguageWidget["dialog"] = this.drawDialog(-1);
    this._selectLanguageWidget["layout"] = this.drawLayout(
      this._selectLanguageWidget["dialog"],
      "layoutVertical",
      { minWidth: "600px" }
    );

    this._selectLanguageWidget["languagesLayout"] = this.drawLayout(
      this.drawLayout(
        this._selectLanguageWidget["layout"],
        "layoutHorizontal",
        { width: "100%" }
      ),
      "layoutVertical"
    );

    for (let language of Object.keys(this.languages)) {
      if (this._selectedLanguages.hasOwnProperty(language)) continue;
      if (this._defaultLanguages.hasOwnProperty(language)) continue;
      this.drawButton(
        this.drawLayout(
          this._selectLanguageWidget["languagesLayout"],
          "layoutHorizontal",
          { width: "100%" }
        ),
        this.languages[language]["name"]["ru"],
        { color: "#123456" },
        () => {
          this._selectedLanguages[language] = this.languages[language];
          ReactComponent[this._selectLanguageWidget["dialog"]].destroyWidget();
          this._selectLanguageWidget = {};
          this._$externalSystem.selectedLanguage(language);
        }
      );
    }
    this.drawButton(
      this.drawLayout(
        this._selectLanguageWidget["layout"],
        "layoutHorizontal",
        { width: "100%" }
      ),
      "Cancel",
      { color: "#123456" },
      () => {
        ReactComponent[this._selectLanguageWidget["dialog"]].destroyWidget();
        this._selectLanguageWidget = {};
      }
    );
  }
  get defaultLanguages() {
    return this._defaultLanguages;
  }
  get selectedLanguages() {
    return this._selectedLanguages;
  }
  clearSelectedLanguages() {
    this._selectedLanguages = {};
  }
  addSelectedLanguage(language) {
    this._selectedLanguages[language] = this.languages[language];
  }
}
class UnitsEditorSystem extends BaseObjectEditor {
  constructor(unitsEditor) {
    super();
    this._selectSystemWidget;
    this._createSystemWidget;
    this._selectLanguageWidget;

    this._$parent = unitsEditor;

    this._selectedLanguages;

    this._shortName = "";

    this._baseSystem = undefined;
  }
  createSystem(settings) {
    console.log(settings);
    const system = settings["shortName"];
    this._$parent.unitTypes["systems"][system] = {};
    this._$parent.unitTypes["systems"][system]["name"] = {};
    for (let language of settings["names"]) {
      this._$parent.unitTypes["systems"][system]["name"][language["lang"]] =
        language["value"];
    }
    this._$parent.unitTypes["systems"][system]["baseSystem"] = null;
    this._$parent.unitTypes["types"][system] = {};

    if (this._baseSystem) {
      this._$parent.unitTypes["systems"][system]["baseSystem"] =
        this._baseSystem;

      for (let unitType of Object.keys(
        this._$parent.unitTypes["types"][this._baseSystem]
      )) {
        this._$parent.unitTypes["types"][system][unitType] = {
          name: this._$parent.unitTypes["types"][this._baseSystem][unitType][
            "name"
          ],
          category:
            this._$parent.unitTypes["types"][this._baseSystem][unitType][
              "category"
            ],
          units:
            this._$parent.unitTypes["types"][this._baseSystem][unitType][
              "type"
            ] === "number"
              ? {}
              : this._$parent.unitTypes["types"][this._baseSystem][unitType][
                  "units"
                ],
          default: "",
          type: this._$parent.unitTypes["types"][this._baseSystem][unitType][
            "type"
          ],
        };
      }
    }

    console.log("unitTypes", this._$parent.unitTypes);

    const layout = this.drawLayout(
      this._selectSystemWidget["layout"],
      "layoutHorizontal",
      { width: "500px", minHeight: "50px", maxHeight: "50px" }
    );
    this.drawButton(
      layout,
      this._$parent.unitTypes["systems"][system]["name"]["ru"],
      { color: "#123456" },
      () => {
        this.openSystem(system);
      }
    );
    ReactComponent[this._selectSystemWidget["layout"]].childGoToLast(
      ReactComponent[this._selectSystemWidget["layout"]].children.length - 2
    );
  }
  openSystem(system) {
    //this._$parent.loadUnitType();
    console.log(system);
    console.log("parent", this._$parent);
    this._$parent.drawSystem(system);
    ReactComponent[this._selectSystemWidget["dialog"]].destroyWidget();
    this._selectSystemWidget = {};
  }
  drawSelectSystemWidget() {
    this._selectSystemWidget = {};
    this._selectSystemWidget["dialog"] = this.drawDialog(-1);
    this._selectSystemWidget["layout"] = this.drawLayout(
      this._selectSystemWidget["dialog"],
      "layoutVertical",
      { maxHeight: "400px" }
    );

    for (let system of Object.keys(this._$parent.unitTypes["systems"])) {
      const layout = this.drawLayout(
        this._selectSystemWidget["layout"],
        "layoutHorizontal",
        { width: "500px", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawButton(
        layout,
        this._$parent.unitTypes["systems"][system]["name"]["ru"],
        { color: "#123456" },
        () => {
          this.openSystem(system);
        }
      );
    }

    const layout = this.drawLayout(
      this._selectSystemWidget["layout"],
      "layoutHorizontal",
      { width: "500px", minHeight: "50px", maxHeight: "50px" }
    );
    this.drawButton(layout, "Add System", { color: "#123456" }, () => {
      this.drawCreateSystemWidget();
    });
  }
  changeBaseSystem(system) {
    this._baseSystem = system;
  }
  drawCreateSystemWidget() {
    this._createSystemWidget = {};
    this._createSystemWidget["dialog"] = this.drawDialog(-1);
    this._createSystemWidget["layout"] = this.drawLayout(
      this._createSystemWidget["dialog"],
      "layoutVertical",
      { minWidth: "400px" }
    );

    this._createSystemWidget["short"] = {};
    this._createSystemWidget["short"]["layout"] = this.drawLayout(
      this._createSystemWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawLabel(this._createSystemWidget["short"]["layout"], "Short name: ");
    ReactComponent[
      (this._createSystemWidget["short"]["input"] = this.drawInput(
        this._createSystemWidget["short"]["layout"],
        ""
      ))
    ].htmlElement.oninput = (e) => {
      this._shortName = e.target.value;
    };

    const baseSystemLayout = this.drawLayout(
      this._createSystemWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawLabel(baseSystemLayout, "Select system for base");
    const comboBox = this.drawComboBox(baseSystemLayout);
    ReactComponent[comboBox].addItem("None", () => {
      this.changeBaseSystem(undefined);
    });
    for (let system of Object.keys(this._$parent.unitTypes["systems"])) {
      ReactComponent[comboBox].addItem(
        this._$parent.unitTypes["systems"][system]["name"]["ru"],
        () => {
          this.changeBaseSystem(system);
        }
      );
    }

    this.drawLabel(
      this.drawLayout(this._createSystemWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "Names"
    );

    this._createSystemWidget["names"] = {};
    this._createSystemWidget["names"]["layout"] = this.drawLayout(
      this.drawLayout(this._createSystemWidget["layout"], "layoutHorizontal", {
        width: "100%",
      }),
      "layoutVertical",
      { height: "400px" }
    );

    this._selectedLanguages = {};

    for (let language of Object.keys(this.languages)) {
      if (this.languages[language]["default"]) {
        const languageLayout = this.drawLayout(
          this._createSystemWidget["names"]["layout"],
          "layoutHorizontal",
          { width: "100%", minHeight: "50px", maxHeight: "50px" }
        );
        this.drawLabel(languageLayout, this.languages[language]["name"]["ru"]);

        this._selectedLanguages[language] = {};
        this._selectedLanguages[language]["value"] = "";
        ReactComponent[
          (this._selectedLanguages[language]["input"] = this.drawInput(
            languageLayout,
            ""
          ))
        ].htmlElement.oninput = (e) => {
          this._selectedLanguages[language]["value"] = e.target.value;
        };
      }
    }

    const languageLayout = this.drawLayout(
      this._createSystemWidget["names"]["layout"],
      "layoutHorizontal",
      { width: "100%", minHeight: "50px", maxHeight: "50px" }
    );
    this.drawButton(
      languageLayout,
      "Add Language",
      { color: "#123456" },
      () => {
        this.drawSelectLanguageWidget();
      }
    );

    const buttonLayout = this.drawLayout(
      this._createSystemWidget["layout"],
      "layoutHorizontal",
      { width: "100%" }
    );
    this.drawButton(buttonLayout, "Create", { color: "#123456" }, () => {
      console.log(this._selectedLanguages);
      for (let language of Object.keys(this._selectedLanguages)) {
        if (this._selectedLanguages[language]["value"] == "") {
          return APP.log("error", "You don't fill " + language + " input");
        }
      }
      const object = {
        shortName: this._shortName,
        names: Object.keys(this._selectedLanguages).map((language) => {
          return {
            lang: language,
            value: this._selectedLanguages[language]["value"],
          };
        }),
      };
      ReactComponent[this._createSystemWidget["dialog"]].destroyWidget();
      this._createSystemWidget = {};
      this.createSystem(object);
    });
    this.drawButton(buttonLayout, "Cancel", { color: "#123456" }, () => {
      ReactComponent[this._createSystemWidget["dialog"]].destroyWidget();
      this._createSystemWidget = {};
    });
  }
  drawSelectLanguageWidget() {
    this._selectLanguageWidget = {};
    this._selectLanguageWidget["dialog"] = this.drawDialog(-1);

    this._selectLanguageWidget["layout"] = this.drawLayout(
      this._selectLanguageWidget["dialog"],
      "layoutVertical",
      { minWidth: "300px" }
    );

    this._selectLanguageWidget["languages"] = {};
    this._selectLanguageWidget["languages"]["layout"] = this.drawLayout(
      this.drawLayout(
        this._selectLanguageWidget["layout"],
        "layoutHorizontal",
        { width: "100%" }
      ),
      "layoutVertical",
      { height: "300px" }
    );

    for (let language of Object.keys(this.languages)) {
      if (this._selectedLanguages.hasOwnProperty(language)) continue;
      const languageLayout = this.drawLayout(
        this._selectLanguageWidget["languages"]["layout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "60px", maxHeight: "60px" }
      );
      this.drawButton(
        languageLayout,
        this.languages[language]["name"]["ru"],
        { color: "#123456" },
        () => {
          const nameLayout = this.drawLayout(
            this._createSystemWidget["names"]["layout"],
            "layoutHorizontal",
            { width: "100%", minHeight: "50px", maxHeight: "50px" }
          );
          this.drawLabel(nameLayout, this.languages[language]["name"]["ru"]);

          this._selectedLanguages[language] = {};
          this._selectedLanguages[language]["value"] = "";
          ReactComponent[
            (this._selectedLanguages[language]["input"] = this.drawInput(
              nameLayout,
              ""
            ))
          ].htmlElement.oninput = (e) => {
            this._selectedLanguages[language]["value"] = e.target.value;
          };

          this.drawButton(nameLayout, "-", { textColor: "#123456" }, () => {
            ReactComponent[
              this._createSystemWidget["names"]["layout"]
            ].deleteWidget(nameLayout);
            delete this._selectedLanguages[language];
          });

          ReactComponent[
            this._createSystemWidget["names"]["layout"]
          ].childGoToLast(
            ReactComponent[this._createSystemWidget["names"]["layout"]].children
              .length - 2
          );

          ReactComponent[this._selectLanguageWidget["dialog"]].destroyWidget();

          this._selectLanguageWidget = {};
        }
      );
    }

    this.drawButton(
      this.drawLayout(
        this._selectLanguageWidget["layout"],
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      ),
      "Cancel",
      { color: "#123456" },
      () => {
        ReactComponent[this._selectLanguageWidget["dialog"]].destroyWidget();
        this._selectLanguageWidget = {};
      }
    );
  }
}
class ProductPropertyEditor extends BaseObjectEditor {
  constructor() {
    super();
    this._mainDialog;
    this._mainLayout;
    this._productLayout;
    this._productsLayout = {};
    this._groupsLayout = {};
    this._isEditMode = false;
    this._componentNames = {
      Water: {
        name: {
          ru: "Вода",
          en: "Water",
        },
      },
      Protein: {
        name: {
          ru: "Белки",
          en: "Protein",
        },
      },
      Fat: {
        name: {
          ru: "Жиры",
          en: "Fats",
        },
      },
      Carbohydrates: {
        name: {
          ru: "Углеводы",
          en: "Carbohydrates",
        },
      },
      Kilocalories: {
        name: {
          ru: "Ккал",
          en: "Kcal",
        },
      },
    };
    this._products = {};
    this._productID = "60a7598c9fb518e175d9e7bd";
    this._contextMenu = new ContextMenu();
    this.init();
  }
  init() {
    window.oncontextmenu = this.showContextMenu.bind(this);
  }
  showContextMenu(e) {
    console.log("e", e);
    if (this._contextMenu.isBlocked) return false;

    this._contextMenu.clearItems();
    if (this._contextMenu._isShow) {
      this._contextMenu.hide();
    }

    let findProduct = undefined;
    let findGroup = undefined;

    for (let item of Object.keys(this._productsLayout)) {
      if (!e.target.parentNode) break;
      if (e.target.parentNode.getAttribute("id") == item) {
        findGroup = this._productsLayout[item]["group"];
        findProduct = this._productsLayout[item]["name"];
        console.log(this._productsLayout[item]["name"]);
        break;
      } else if (e.target.parentNode.parentNode.getAttribute("id") == item) {
        findGroup = this._productsLayout[item]["group"];
        findProduct = this._productsLayout[item]["name"];
        break;
      }
    }

    if (!findGroup) {
      for (let item of Object.keys(this._groupsLayout)) {
        if (!e.target.parentNode) break;
        if (e.target.parentNode.parentNode.getAttribute("id") == item) {
          findGroup = this._groupsLayout[item]["group"];
          break;
        }
      }
    }

    if (findGroup && !findProduct) {
      this._contextMenu.addItem("Добавить группу", () => {
        this.drawFormEditGroup(() => {
          this.drawProducts();
        });
      });
      this._contextMenu.addItem("Редактировать группу", () => {
        this.drawFormEditGroup(
          () => {
            this.drawProducts();
          },
          this._products[findGroup],
          findGroup
        );
      });
      this._contextMenu.addItem("Удалить группу", () => {
        delete this._products[findGroup];
        this.drawProducts();
      });
      this._contextMenu.addItem("Добавить продукт", () => {
        this.drawFormEditProduct(() => {
          this.drawProducts();
        }, findGroup);
      });
    } else if (findProduct && findGroup) {
      this._contextMenu.addItem("Добавить продукт", () => {
        this.drawFormEditProduct(() => {
          this.drawProducts();
        }, findGroup);
      });
      this._contextMenu.addItem("Редактировать продукт", () => {
        this.drawFormEditProduct(
          () => {
            this.drawProducts();
          },
          findGroup,
          this._products[findGroup]["products"][findProduct],
          findProduct
        );
      });
      this._contextMenu.addItem("Удалить продукт", () => {
        delete this._products[findGroup]["products"][findProduct];
        this.drawProducts();
      });
    } else if (!findGroup && !findProduct) {
      this._contextMenu.addItem("Добавить группу", () => {
        this.drawFormEditGroup(() => {
          this.drawProducts();
        });
      });
    }

    this._contextMenu.show(APP.UI.mX, APP.UI.mY);
    return false;
  }
  drawForm() {
    this._mainDialog = this.drawDialog(-1);
    this._mainLayout = this.drawLayout(this._mainDialog, "layoutVertical", {
      minWidth: "700px",
      maxHeight: "700px",
    });
    this._productLayout = this.drawLayout(
      this.drawLayout(this._mainLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "600px" }
    );
    const btnLayouts = this.drawLayout(this._mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(btnLayouts, "Сохранить", { color: "#123456" }, () => {
      this.saved();
    });
    this.drawProducts();
  }
  drawProducts() {
    this.clearLayout(this._productLayout);
    for (let groupName of Object.keys(this._products)) {
      this.drawProductGroupWithProducts(groupName);
    }
  }
  clearLayout(layout) {
    ReactComponent[layout].clearWidget();
  }
  drawProductGroupWithProducts(productGroup) {
    const groupLayout = this.drawLayout(
      this._productLayout,
      "layoutHorizontal",
      { width: "100%", minHeight: "50px", maxHeight: "50px" }
    );
    this.drawLabel(groupLayout, this._products[productGroup]["name"]["ru"]);
    this._groupsLayout[groupLayout] = { group: productGroup };
    const headerLayout = this.drawLayout(
      this._productLayout,
      "layoutHorizontal",
      { width: "100%", minHeight: "50px", maxHeight: "50px" }
    );
    this.drawLabel(headerLayout, "Продукт", { maxWidth: "20%" });
    for (let component of Object.keys(this._componentNames)) {
      this.drawLabel(
        headerLayout,
        this._componentNames[component]["name"]["ru"],
        { maxWidth: "16%" }
      );
    }
    const layout = this.drawLayout(
      this.drawLayout(this._productLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "200px",
        maxHeight: "200px",
        marginBottom: "30px",
      }),
      "layoutVertical",
      { height: "200px" }
    );
    for (let productName of Object.keys(
      this._products[productGroup]["products"]
    )) {
      const productLayout = this.drawLayout(layout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      });
      const product = this._products[productGroup]["products"][productName];
      const label = this.drawLabel(productLayout, product["name"]["ru"], {
        maxWidth: "20%",
      });
      for (let structureName of Object.keys(product["structure"])) {
        const input = this.drawInput(
          productLayout,
          product["structure"][structureName],
          { maxWidth: "16%", padding: "0 10px" }
        );
        ReactComponent[input].controlHorizontalTextAlign(2);
        ReactComponent[input].htmlElement.oninput = (e) => {
          product["structure"][structureName] = e.target.value;
        };
      }
      this._productsLayout[productLayout] = {
        group: productGroup,
        name: productName,
      };
    }
  }
  drawFormEditProduct(
    callback,
    group,
    product = undefined,
    productName = undefined
  ) {
    this._contextMenu.isBlocked = true;
    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "600px",
    });

    const languageSystem = new LanguageSystem(this);
    if (product) {
      for (let language of Object.keys(product["name"]))
        languageSystem.addSelectedLanguage(language);
    }
    const languageListLayout = this.drawLayout(
      this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "300px" }
    );
    const selectedLanguages = product
      ? languageSystem.selectedLanguages
      : languageSystem.defaultLanguages;

    const nameValues = {};
    const selectedLanguage = function (language) {
      const layout = this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "100%",
        maxHeight: "50px",
        minHeight: "50px",
      });
      this.drawLabel(
        layout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      nameValues[language] = product ? product["name"][language] : "";
      ReactComponent[
        this.drawInput(layout, nameValues[language])
      ].htmlElement.oninput = (e) => {
        nameValues[language] = e.target.value;
      };
      ReactComponent[languageListLayout].childGoToLast(
        ReactComponent[languageListLayout].children.length - 2
      );
    };
    for (let language of Object.keys(selectedLanguages)) {
      //debugger;
      const layout = this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "100%",
        maxHeight: "50px",
        minHeight: "50px",
      });
      this.drawLabel(layout, selectedLanguages[language]["name"]["ru"]);
      nameValues[language] = product ? product["name"][language] : "";
      ReactComponent[
        this.drawInput(layout, nameValues[language])
      ].htmlElement.oninput = (e) => {
        nameValues[language] = e.target.value;
      };
    }
    this.drawButton(
      this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "10%",
        marginLeft: "85%",
        background: "#ddd",
        maxHeight: "50px",
        minHeight: "50px",
      }),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        languageSystem.drawForm();
      }
    );
    this.drawLabel(
      this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
      "Состав"
    );
    const structureValues = {};
    for (let componentName of Object.keys(this._componentNames)) {
      const layout = this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
      });
      this.drawLabel(layout, this._componentNames[componentName]["name"]["ru"]);
      structureValues[componentName] = product
        ? product["structure"][componentName]
        : "";
      ReactComponent[
        this.drawInput(layout, structureValues[componentName])
      ].htmlElement.oninput = (e) => {
        structureValues[componentName] = e.target.value;
      };
    }
    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(
      btnLayout,
      product ? "Сохранить" : "Добавить",
      { color: "#123456" },
      () => {
        const object = {
          name: nameValues,
          structure: structureValues,
        };
        const name = product
          ? productName
          : nameValues.hasOwnProperty("en")
          ? nameValues["en"]
          : nameValues["ru"];
        this._products[group]["products"][name] = object;
        this._contextMenu.isBlocked = false;
        callback();

        ReactComponent[dialog].destroyWidget();
      }
    );
    this.drawButton(btnLayout, "Отмена", { color: "#123456" }, () => {
      this._contextMenu.isBlocked = false;
      ReactComponent[dialog].destroyWidget();
    });
  }

  saved() {
    const saved = function (result) {
      console.log("result", result);
    };
    const sets = {
      $set: {
        products: this._products,
      },
    };
    APP.dbWorker.responseDOLMongoRequest = saved;
    APP.dbWorker.sendUpdateRCRequest(
      "DOLMongoRequest",
      this._productID,
      JSON.stringify(sets)
    );
  }
  loaded(handler) {
    const loaded = function (result) {
      if ("cursor" in result) {
        console.log("this", this);
        this._products = result["cursor"]["firstBatch"][0]["products"];
        console.log("this_products", this._products);
      }
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    const request = '{"_id": {"$oid": "' + this._productID + '"}}';
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  drawFormEditGroup(callback, group = undefined, groupName = undefined) {
    this._contextMenu.isBlocked = true;
    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "600px",
    });

    const languageSystem = new LanguageSystem(this);
    if (group) {
      for (let language of Object.keys(group["name"]))
        languageSystem.addSelectedLanguage(language);
    }
    const languageListLayout = this.drawLayout(
      this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "300px" }
    );
    const selectedLanguages = group
      ? languageSystem.selectedLanguages
      : languageSystem.defaultLanguages;

    const nameValues = {};
    const selectedLanguage = function (language) {
      const layout = this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "100%",
        maxHeight: "50px",
        minHeight: "50px",
      });
      this.drawLabel(
        layout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      nameValues[language] = group ? group["name"][language] : "";
      ReactComponent[
        this.drawInput(layout, nameValues[language])
      ].htmlElement.oninput = (e) => {
        nameValues[language] = e.target.value;
      };
      ReactComponent[languageListLayout].childGoToLast(
        ReactComponent[languageListLayout].children.length - 2
      );
    };
    for (let language of Object.keys(selectedLanguages)) {
      //debugger;
      const layout = this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "100%",
        maxHeight: "50px",
        minHeight: "50px",
      });
      this.drawLabel(layout, selectedLanguages[language]["name"]["ru"]);
      nameValues[language] = group ? group["name"][language] : "";
      ReactComponent[
        this.drawInput(layout, nameValues[language])
      ].htmlElement.oninput = (e) => {
        nameValues[language] = e.target.value;
      };
    }
    this.drawButton(
      this.drawLayout(languageListLayout, "layoutHorizontal", {
        width: "10%",
        marginLeft: "85%",
        background: "#ddd",
        maxHeight: "50px",
        minHeight: "50px",
      }),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        languageSystem.drawForm();
      }
    );

    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(
      btnLayout,
      group ? "Сохранить" : "Добавить",
      { color: "#123456" },
      () => {
        const object = {
          name: nameValues,
          products: group ? group["products"] : {},
        };
        const name = group
          ? groupName
          : nameValues.hasOwnProperty("en")
          ? nameValues["en"]
          : nameValues["ru"];
        this._products[name] = object;
        this._contextMenu.isBlocked = false;
        callback();

        ReactComponent[dialog].destroyWidget();
      }
    );
    this.drawButton(btnLayout, "Отмена", { color: "#123456" }, () => {
      this._contextMenu.isBlocked = false;
      ReactComponent[dialog].destroyWidget();
    });
  }
}
