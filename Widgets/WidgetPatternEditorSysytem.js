class PatternEditorSystem extends BaseObjectEditor {
  constructor(externalSystem) {
    super();
    // settings start
    this._settings = {};
    this._settings["MinCountChar"] = 3;
    this._findStr = "";
    this._ownPatterns = {};

    this._selectedPatterns = {};
    this._selectedProperties = {};
    this._ownCreatingPattern = {};

    this._loadedClassification = {};

    this._loadedPatternsLayout;
    this._loadedPatterns = {};
    this._selectedPatternsLayout;

    this._createdClassification;

    this.$external = externalSystem;
    this._selectObjectOrPattern = undefined;
    this.unitTypes = this.$external.unitTypes;

    this._viewPatternPropertiesDialog = undefined;

    this._selectedPropertiesNewVersion = {};

    //this.categoryOfProperties = externalSystem.categoryOfProperties;

    //MainClassificator.openPrototype = this.openPrototypeProperties.bind(this);
    //MainClassification.openPrototype = this.openPrototypeProperties.bind(this);

    this._categoriesWithList = {};

    // settings ends
  }
  // new

  drawCategoryProperties(parentLayout, categoryName, isEmpty) {
    const categoryLayout = this.drawLayout(parentLayout, "layoutHorizontal", {
      width: "100%",
    });
    const name = this.drawLabel(categoryLayout, categoryName);

    ReactComponent[name].controlHorizontalTextAlign(1);
    if (!isEmpty) {
      const descLayout = this.drawLayout(parentLayout, "layoutHorizontal", {
        width: "90%",
        marginLeft: "10%",
      });
      const l1 = this.drawLabel(descLayout, "Название", { maxWidth: "40%" });
      const l2 = this.drawLabel(descLayout, "Значение", { maxWidth: "40%" });
      const l3 = this.drawLabel(descLayout, "Тип", { maxWidth: "20%" });

      ReactComponent[l1].controlHorizontalTextAlign(1);
      ReactComponent[l2].controlHorizontalTextAlign(1);
      ReactComponent[l3].controlHorizontalTextAlign(1);
    }
    const propertiesLayout = this.drawLayout(
      this.drawLayout(parentLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "200px" }
    );
    return propertiesLayout;
  }

  async drawPropertyItem(parentLayout, property, mode = "view") {
    console.log("drawPropertyItem", property);
    const propertyLayout = this.drawLayout(parentLayout, "layoutHorizontal", {
      width: "90%",
      marginLeft: "10%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    const name = this.drawLabel(propertyLayout, property.name, {
      maxWidth: "40%",
    });
    ReactComponent[name].controlHorizontalTextAlign(1);
    let widget;

    if (mode === "view") {
      widget = await propertyTypes[property.category][
        property.valueType
      ].getLabelWidget(property);
      ReactComponent[propertyLayout].includeWidget(widget);
    } else {
      widget = await propertyTypes[property.category][
        property.valueType
      ].getInputWidget(property);
      ReactComponent[propertyLayout].includeWidget(widget);

      const checkbox = this.drawCheckbox(
        propertyLayout,
        { maxWidth: "5%" },
        (checked) => {
          property.isSelect = checked;
          console.log("property", property);
        }
      );

      ReactComponent[checkbox].checked = property.isSelect;
    }
  }

  drawButtonAddProperty(parentLayout, callback) {
    return this.drawButton(
      this.drawLayout(parentLayout, "layoutHorizontal", {
        width: "5%",
        marginLeft: "95%",
        minHeight: "50px",
        maxHeight: "50px",
        marginTop: "3%",
        background: "#e8e8e8",
      }),
      "+",
      { color: "#123456" },
      callback
    );
  }

  createCategories(pattern) {
    this._categoriesWithList[pattern] = {};
    this._categoriesWithList[pattern]["Characteristics"] =
      CategoryWithProperties.create({
        en: "Characteristics",
        ru: "Характеристики",
      });
    this._categoriesWithList[pattern]["Location"] =
      CategoryWithProperties.create({ en: "Location", ru: "Местоположение" });
  }
  openPatternCreateForm(name, category, callback) {
    const pattern = {
      meta: {
        name: name,
        name_t: {},
        owner: {
          $oid: "" + APP.owner + "",
        },
        description: "",
        description_t: {},
      },
      additional: {
        image: "",
        wiki_ref_t: { en: "None" },
        category: [category],
        wiki_ref: { en: "None" },
      },
      schema: {
        type: "object",
        properties: {},
        unverified: {},
        required: [],
      },
    };
    this._selectedPattern = pattern;
    const patternName = this._selectedPattern["meta"]["name"];

    this.createCategories(patternName);

    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "600px",
    });

    const titleLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawLabel(titleLayout, "Создание прототипа ");

    const categoriesWithPropertiesLayout = {};

    this.drawButton(
      this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "Добавить свойство",
      { color: "#123456" },
      () => {
        const editor = new Property_Editor();
        editor.addNewProperty = (...args) => {
          this.addNewProperty.bind(
            this,
            args,
            categoriesWithPropertiesLayout[args[4]]
          )();
        };
      }
    );
    for (let category of Object.keys(this._categoriesWithList[patternName])) {
      const properties =
        this._categoriesWithList[patternName][category].properties;
      categoriesWithPropertiesLayout[category] = this.drawCategoryProperties(
        mainLayout,
        this._categoriesWithList[patternName][category].getName("ru"),
        !(properties.length > 0)
      );
      for (let property of properties) {
        this.drawPropertyItem(
          categoriesWithPropertiesLayout[category],
          property,
          "edit"
        );
      }
      this.drawButtonAddProperty(
        categoriesWithPropertiesLayout[category],
        () => {
          const editor = new Property_Editor();
          editor.addNewProperty = (...args) => {
            this.addNewProperty.bind(
              this,
              args,
              categoriesWithPropertiesLayout[category]
            )();
          };
        }
      );
    }

    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(btnLayout, "Добавить", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
      this.createPrototype(() => {
        callback(this._selectedPattern);
      });
    });
    this.drawButton(btnLayout, "Отмена", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
    });
  }
  openObjectFormEdit(object, props, pattern, callback) {
    console.log("openObjectFoenEdit", object);
    console.log("openObjectFoenEdit", props);

    console.log("pattern", pattern);

    this._selectedPattern = pattern;
    const patternName = this._selectedPattern["meta"]["name"];
    const properties = {};
    for (let property of Object.keys(object["object"])) {
      if (props.hasOwnProperty(property)) {
        if (!props[property].hasOwnProperty("_id")) continue;
        properties[property] = props[property];
        properties[property]["value"] = object["object"][property]["value"];
      } else {
        properties[property] = object["object"][property];
      }
    }

    this.createCategories(patternName);
    const seperated =
      CategoryWithProperties.seperatedPropertiesByGroup(properties);

    for (let category of Object.keys(seperated)) {
      this._categoriesWithList[patternName][category].addProperties(
        seperated[category],
        true
      );
    }
    console.log("seperated", seperated);
    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "600px",
    });

    const titleLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawLabel(
      titleLayout,
      "Редактирование объекта " + object["meta"]["name"]
    );

    const categoriesWithPropertiesLayout = {};
    this.drawButton(
      this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "Редактировать сборку",
      { color: "#123456" },
      () => {
        const newDialog = this.drawDialog(-1);
        const newMainLayout = this.drawLayout(newDialog, "layoutVertical", {
          minWidth: "90vw",
        });
        this.smartWidget = new WidgetSmartImage();
        this.smartWidget.projectObject = this.$external._projectSystem;
        this.smartWidget.height = "90vh";

        const contentLayout = this.drawLayout(
          newMainLayout,
          "layoutHorizontal",
          { width: "100%" }
        );
        ReactComponent[contentLayout].includeWidget(this.smartWidget);
        const btnLayout = this.drawLayout(newMainLayout, "layoutHorizontal", {
          width: "100%",
        });
        this.drawButton(btnLayout, "Сохранить", { color: "#123456" }, () => {
          ReactComponent[newDialog].destroyWidget();
          this.smartWidget = undefined;
          window.oncontextmenu = undefined;
        });
        this.drawButton(btnLayout, "Отменить", { color: "#123456" }, () => {
          ReactComponent[newDialog].destroyWidget();
          this.smartWidget = undefined;
          window.oncontextmenu = undefined;
        });
      }
    );
    this.drawButton(
      this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "Добавить свойство",
      { color: "#123456" },
      () => {
        const editor = new Property_Editor();
        editor.addNewProperty = (...args) => {
          this.addNewProperty.bind(
            this,
            args,
            categoriesWithPropertiesLayout[args[4]]
          )();
        };
      }
    );
    for (let category of Object.keys(this._categoriesWithList[patternName])) {
      const properties =
        this._categoriesWithList[patternName][category].properties;
      categoriesWithPropertiesLayout[category] = this.drawCategoryProperties(
        mainLayout,
        this._categoriesWithList[patternName][category].getName("ru"),
        !(properties.length > 0)
      );
      for (let property of properties) {
        this.drawPropertyItem(
          categoriesWithPropertiesLayout[category],
          property,
          "edit"
        );
      }
      this.drawButtonAddProperty(
        categoriesWithPropertiesLayout[category],
        () => {
          const editor = new Property_Editor();
          editor.addNewProperty = (...args) => {
            this.addNewProperty.bind(
              this,
              args,
              categoriesWithPropertiesLayout[category]
            )();
          };
        }
      );
    }

    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(btnLayout, "Сохранить", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
      this.saveObject(object, callback);
    });
    this.drawButton(btnLayout, "Отмена", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
    });
  }
  async createPrototype(callback) {
    const categoriesWithProperties =
      this._categoriesWithList[Object.keys(this._categoriesWithList)[0]];
    const properties = {};
    const newProperties = {};
    const addPropsToPattern = {};

    for (let category of Object.keys(categoriesWithProperties)) {
      properties[category] = categoriesWithProperties[category].selected;
      newProperties[category] = properties[category].filter(
        (item) => !item.propRef
      );
    }

    await this.createNewProps(newProperties);

    for (let category of Object.keys(properties)) {
      addPropsToPattern[category] = [];
      for (let property of properties[category]) {
        if (
          !this._selectedPattern["schema"]["properties"].hasOwnProperty(
            property.name
          ) &&
          !this._selectedPattern["schema"]["unverified"].hasOwnProperty(
            property.name
          )
        ) {
          addPropsToPattern[category].push(property);
        }
      }
    }
    const id = await this.createPattern(this._selectedPattern);
    this._selectedPattern["_id"] = id;
    await this.addPropsToOwnPattern(
      this._selectedPattern["_id"]["$oid"],
      addPropsToPattern
    );

    callback();
  }
  async saveObject(object, callback) {
    const categoriesWithProperties =
      this._categoriesWithList[Object.keys(this._categoriesWithList)[0]];
    const properties = {};
    const newProperties = {};
    const addPropsToPattern = {};

    for (let category of Object.keys(categoriesWithProperties)) {
      properties[category] = categoriesWithProperties[category].selected;
      newProperties[category] = properties[category].filter(
        (item) => !item.propRef
      );
    }
    console.log("properties", properties);
    console.log("newProperties", newProperties);

    await this.createNewProps(newProperties);
    console.log("newProperties", newProperties);

    for (let category of Object.keys(properties)) {
      addPropsToPattern[category] = [];
      for (let property of properties[category]) {
        if (
          !this._selectedPattern["schema"]["properties"].hasOwnProperty(
            property.name
          ) &&
          !this._selectedPattern["schema"]["unverified"].hasOwnProperty(
            property.name
          )
        ) {
          addPropsToPattern[category].push(property);
        }
      }
    }
    console.log("addPropsToPattern", addPropsToPattern);

    await this.addPropsToPattern(
      this._selectedPattern["_id"]["$oid"],
      addPropsToPattern
    );
    await this.incPropsCount();

    for (let category of Object.keys(properties)) {
      const propertyNames = properties[category].map((item) => item.name);
      if (propertyNames.length != 0) {
        const delProp = Object.keys(object["object"]).filter(
          (item) => propertyNames.indexOf(item) == -1
        );
        for (let prop of delProp) {
          delete object["object"][prop];
        }
      }
      for (let property of properties[category]) {
        if (!object["object"].hasOwnProperty(property.name)) {
          if (!property.propRef) {
            object["object"][property.name] = {
              value: property.value,
              average_default: 0,
              category: property.category,
              count_uses: 0,
              description: property.desc,
              lang: property.lang,
              themes: ["Basic"],
              type_value: property.valueType,
              unit_type: property.unitType,
              current_unit: property.unit,
              current_system: "SI",
              wiki: property.wiki,
            };
          } else {
            object["object"][property.name] = {
              value: property.value,
              prop_ref: property.propRef,
            };
          }
        } else {
          object["object"][property.name]["value"] = property.value;
        }
      }
    }

    callback();
  }
  openPrototypeProperties(pattern, mode = "view", props = undefined) {
    try {
      if (this._viewPatternPropertiesDialog) {
        ReactComponent[this._viewPatternPropertiesDialog].clearWidget();
      } else {
        this._viewPatternPropertiesDialog = this.drawDialog(-1);
      }

      const patternName = pattern["meta"]["name"];
      this.createCategories(patternName);
      this._selectedPattern = pattern;

      console.log();

      const l1 = CategoryWithProperties.seperatedPropertiesByGroup(
        pattern["schema"]["properties"]
      );

      for (let category of Object.keys(l1)) {
        this._categoriesWithList[patternName][category].addProperties(
          l1[category]
        );
      }

      const categoriesWithPropertiesLayout = {};
      const mainLayout = this.drawLayout(
        this._viewPatternPropertiesDialog,
        "layoutVertical",
        { minWidth: "50vw", minHeight: "75vh", maxHeight: "75vh" }
      );

      this.drawLabel(
        this.drawLayout(mainLayout, "layoutHorizontal", {
          width: "100%",
          minHeight: "50px",
          maxHeight: "50px",
        }),
        "Просмотр свойств прототипа"
      );
      this.drawLabel(
        this.drawLayout(mainLayout, "layoutHorizontal", {
          width: "100%",
          minHeight: "50px",
          maxHeight: "50px",
        }),
        pattern["meta"]["name"]
      );

      if (mode === "edit") {
        this.drawButton(
          this.drawLayout(mainLayout, "layoutHorizontal", {
            width: "100%",
            minHeight: "50px",
            maxHeight: "50px",
          }),
          "Добавить свойство",
          { color: "#123456" },
          () => {
            const editor = new Property_Editor();
            editor.addNewProperty = (...args) => {
              this.addNewProperty.bind(
                this,
                args,
                categoriesWithPropertiesLayout[args[4]]
              )();
            };
          }
        );
      }

      for (let category of Object.keys(this._categoriesWithList[patternName])) {
        const properties =
          this._categoriesWithList[patternName][category].properties;
        categoriesWithPropertiesLayout[category] = this.drawCategoryProperties(
          mainLayout,
          this._categoriesWithList[patternName][category].getName("ru"),
          !(properties.length > 0)
        );
        for (let property of properties) {
          this.drawPropertyItem(
            categoriesWithPropertiesLayout[category],
            property,
            mode
          );
        }

        if (mode === "edit") {
          this.drawButtonAddProperty(
            categoriesWithPropertiesLayout[category],
            () => {
              const editor = new Property_Editor();
              editor.addNewProperty = (...args) => {
                this.addNewProperty.bind(
                  this,
                  args,
                  categoriesWithPropertiesLayout[category]
                )();
              };
            }
          );
        }
      }

      const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
      });
      this.drawButton(
        btnLayout,
        mode === "view" ? "Создать объект" : "Сохранить",
        { color: "#123456" },
        () => {
          if (mode === "view") {
            //this._selectedPatterns[pattern["meta"]["name"]] = pattern;
            this.openPrototypeProperties(pattern, "edit");
          } else if (mode === "edit") {
            this.openFormSetObjectName(() => {
              ReactComponent[this._viewPatternPropertiesDialog].destroyWidget();
              this._viewPatternPropertiesDialog = undefined;
              this._selectedPropertiesNewVersion = {};
            });
          }
        }
      );
      this.drawButton(
        btnLayout,
        mode === "view" ? "Закрыть" : "Отмена",
        { color: "#123456" },
        () => {
          if (mode === "view") {
            ReactComponent[this._viewPatternPropertiesDialog].destroyWidget();
            this._viewPatternPropertiesDialog = undefined;
            this._selectedPropertiesNewVersion = {};
            if (this.smartWidget) {
              this.smartWidget.cancelCreateObject();
            }
          } else {
            if (props) {
              ReactComponent[this._viewPatternPropertiesDialog].destroyWidget();
              this._viewPatternPropertiesDialog = undefined;
              this._selectedPropertiesNewVersion = {};
              if (this.smartWidget) {
                this.smartWidget.cancelCreateObject();
              }
            } else {
              this.openPrototypeProperties(pattern, "view");
            }
          }
        }
      );
      console.log("openpropert", pattern);
    } catch (e) {
      console.error("openPrototypeProperties", e);
    }
  }

  addNewProperty(arr, layout) {
    const [
      lang,
      name,
      desc,
      wiki,
      category,
      valueType,
      value,
      unitType,
      unit,
      propRef,
      parentPattern,
    ] = arr;
    const property = this._categoriesWithList[
      this._selectedPattern["meta"]["name"]
    ][category].addProperty(
      propRef,
      name,
      lang,
      desc,
      wiki,
      valueType,
      value,
      true,
      unitType,
      unit
    );
    this.drawPropertyItem(layout, property, "edit");
    ReactComponent[layout].childGoToLast(
      ReactComponent[layout].children.length - 2
    );
  }
  openFormSetObjectName(callback) {
    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "500px",
    });
    this.drawLabel(
      this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "Создание объекта"
    );

    const nameLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    this.drawLabel(nameLayout, "Имя объекта");
    let nameInput = "";
    ReactComponent[this.drawInput(nameLayout, "")].htmlElement.oninput = (
      e
    ) => {
      nameInput = e.target.value;
    };

    const wikiLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    this.drawLabel(wikiLayout, "Википедия");
    let wikiInput = "";

    ReactComponent[this.drawInput(wikiLayout, "")].htmlElement.oninput = (
      e
    ) => {
      wikiInput = e.target.value;
    };

    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    this.drawButton(btnLayout, "ОК", { color: "#123456" }, () => {
      if (nameInput.length <= 0 || wikiInput.length <= 0) {
        return APP.log("error", "Заполните все поля");
      }

      this.createObjectVersion2(nameInput, wikiInput, () => {
        ReactComponent[dialog].destroyWidget();
        callback();
      });
    });

    this.drawButton(btnLayout, "Отмена", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
    });
  }
  async createObjectVersion2(name, wiki, callback) {
    const categoriesWithProperties =
      this._categoriesWithList[Object.keys(this._categoriesWithList)[0]];
    const properties = {};
    const newProperties = {};
    const addPropsToPattern = {};

    for (let category of Object.keys(categoriesWithProperties)) {
      properties[category] = categoriesWithProperties[category].selected;
      newProperties[category] = properties[category].filter(
        (item) => !item.propRef
      );
    }
    console.log("properties", properties);
    console.log("newProperties", newProperties);

    await this.createNewProps(newProperties);
    console.log("newProperties", newProperties);

    for (let category of Object.keys(properties)) {
      addPropsToPattern[category] = [];
      for (let property of properties[category]) {
        if (
          !this._selectedPattern["schema"]["properties"].hasOwnProperty(
            property.name
          ) &&
          !this._selectedPattern["schema"]["unverified"].hasOwnProperty(
            property.name
          )
        ) {
          addPropsToPattern[category].push(property);
        }
      }
    }
    console.log("addPropsToPattern", addPropsToPattern);

    await this.addPropsToPattern(
      this._selectedPattern["_id"]["$oid"],
      addPropsToPattern
    );
    await this.incPropsCount();
    const object = await this.createNewObject(
      this._selectedPattern,
      name,
      wiki,
      properties
    );
    this.callbackCreateObject(object);

    callback();
  }
  async createNewProps(props) {
    return new Promise((res) => {
      async function create() {
        /*for (let category of Object.keys(props)) {
                    for (let property of props[category]) {
                        await this.createNewProp(property);
                    }
                }*/
        res();
      }
      create.bind(this)();
    });
  }

  async createNewProp(property) {
    return new Promise((res) => {
      const updated = function (resultJSON) {
        console.log("resultJSON", resultJSON);
        res();
      };
      const created = function (resultJSON) {
        console.log(resultJSON);
        property.propRef = resultJSON.inserted_id;
        const sets = {
          $set: {
            pid: { $oid: "" + resultJSON.inserted_id["$oid"] + "" },
          },
        };
        APP.dbWorker.responseDOLMongoRequest = updated.bind(this);
        APP.dbWorker.sendUpdateRCRequest(
          "DOLMongoRequest",
          resultJSON.inserted_id["$oid"],
          JSON.stringify(sets),
          "props"
        );
      };
      const object = {
        average_default: 0,
        category: property.category,
        count_uses: 0,
        description: property.desc,
        lang: property.lang,
        meta: {
          owner: { $oid: "591c318fe9d2600f47e37d3a" },
          r: ["All"],
        },
        name: property.name,
        themes: ["Basic"],
        type_value: property.valueType,
        unit_type: property.unitType,
        current_unit: property.unit,
        current_system: "SI",
        wiki: property.wiki,
      };
      APP.dbWorker.responseDOLMongoRequest = created.bind(this);
      APP.dbWorker.sendInsertRCRequest(
        "DOLMongoRequest",
        JSON.stringify(object),
        "props"
      );
    });
  }

  async createNewPattern() {
    return new Promise((res) => {
      res();
    });
  }
  async createPattern(pattern) {
    return new Promise((res) => {
      const created = function (resultJSON) {
        res(resultJSON.inserted_id);
      };

      APP.dbWorker.responseDOLMongoRequest = created.bind(this);
      APP.dbWorker.sendInsertRCRequest(
        "DOLMongoRequest",
        JSON.stringify(pattern),
        "patterns"
      );
    });
  }
  async addPropsToOwnPattern(patternID, props) {
    return new Promise((res) => {
      const inserted = function (resultJSON) {
        console.log("res", resultJSON);
        res();
      };
      let sets = {};
      for (let category of Object.keys(props)) {
        for (let property of props[category]) {
          const propObject = {
            average_default: 0,
            category: property.category,
            count_uses: 0,
            description: property.desc,
            lang: property.lang,
            themes: ["Basic"],
            type_value: property.valueType,
            unit_type: property.unitType,
            current_unit: property.unit,
            current_system: "SI",
            wiki: property.wiki,
          };
          if (property.propRef) {
            propObject["prop_ref"] = property.propRef;
          }
          sets["schema.properties." + property.name] = propObject;
          this._selectedPattern["schema"]["properties"][property.name] =
            propObject;
        }
      }
      APP.dbWorker.responseDOLMongoRequest = inserted.bind(this);
      APP.dbWorker.sendUpdateRCRequest(
        "DOLMongoRequest",
        patternID,
        JSON.stringify({
          $set: sets,
        }),
        "patterns"
      );
    });
  }

  async addPropsToPattern(patternID, props) {
    return new Promise((res) => {
      const inserted = function (resultJSON) {
        console.log("res", resultJSON);
        res();
      };
      let sets = {};
      for (let category of Object.keys(props)) {
        for (let property of props[category]) {
          sets["schema.unverified." + property.name] = {
            average_default: 0,
            category: property.category,
            count_uses: 0,
            description: property.desc,
            lang: property.lang,
            themes: ["Basic"],
            type_value: property.valueType,
            unit_type: property.unitType,
            current_unit: property.unit,
            current_system: "SI",
            wiki: property.wiki,
          };
          if (property.propRef) {
            sets["schema.unverified." + property.name]["prop_ref"] =
              property.propRef;
          }
        }
      }
      APP.dbWorker.responseDOLMongoRequest = inserted.bind(this);
      APP.dbWorker.sendUpdateRCRequest(
        "DOLMongoRequest",
        patternID,
        JSON.stringify({
          $set: sets,
        }),
        "patterns"
      );
    });
  }

  async incPropsCount(patternID, propsID) {
    return new Promise((res) => {
      res();
    });
  }

  async createNewObject(pattern, name, wiki, properties) {
    return new Promise((res) => {
      const object = {
        meta: {
          name: name,
          description: "",
          pattern: {
            $oid: pattern["_id"]["$oid"],
          },
          owner: {
            $oid: "" + APP.owner + "",
          },
        },
        additional: {
          wiki_ref: { en: wiki },
          category: [pattern["additional"]["category"][0]],
          classification: {},
          image: "",
          last_update_time: 0,
          last_update_by: "",
        },
        object: {},
      };
      for (let category of Object.keys(properties)) {
        for (let property of properties[category]) {
          if (!property.propRef) {
            object["object"][property.name] = {
              average_default: 0,
              category: property.category,
              count_uses: 0,
              description: property.desc,
              lang: property.lang,
              themes: ["Basic"],
              type_value: property.valueType,
              unit_type: property.unitType,
              current_unit: property.unit,
              current_system: "SI",
              wiki: property.wiki,
              value: property.value,
            };
          } else {
            object["object"][property.name] = {
              value: property.value,
              prop_ref: property.propRef,
            };
          }
        }
      }
      const inserted = function (resultJSON) {
        console.log("result", resultJSON);
        object["_id"] = resultJSON.inserted_id;
        res(object);
      };
      APP.dbWorker.responseDOLMongoRequest = inserted.bind(this);
      APP.dbWorker.sendInsertRCRequest(
        "DOLMongoRequest",
        JSON.stringify(object)
      );
    });
  }

  clearLayout(layout) {
    ReactComponent[layout].clearWidget();
  }

  seperatedPropertiesByGroups(properties) {
    const seperated = {};

    for (let propertyName of Object.keys(properties)) {
      if (!seperated.hasOwnProperty(properties[propertyName]["category"])) {
        seperated[properties[propertyName]["category"]] = {};
      }
      seperated[properties[propertyName]["category"]][propertyName] =
        properties[propertyName];
    }
    return seperated;
  }

  switchSearchMode() {
    ReactComponent[this._searchTreeLayout].clearWidget();
    ReactComponent[this._searchBtnLayout].clearWidget();
    const otherTree =
      this._searchMode == "object"
        ? MainClassification.getAllClassificationTree()
        : MainClassificator.getAllClassificatorTree();
    
    for (let id of Object.keys(otherTree)) {
      const layout2 = this.drawLayout(
        this._searchTreeLayout,
        "layoutHorizontal",
        { width: "100%" }
      );
      ReactComponent[layout2].includeWidget(otherTree[id]);
      ReactComponent[otherTree[id]["id"]].htmlElement.style.display = "";
    }

      // Классификатор проекта

    if (this._searchMode == "pattern") {
      this.drawButton(
        this._searchBtnLayout,
        "Открыть классификатор",
        { color: "#123456" },
        () => {
          MainClassificator.loadMainClassificator();
        }
      );
      this.drawButton(
        this._searchBtnLayout,
        "Новый",
        { color: "#123456" },
        () => {}
      );
    }

    this.drawButton(
      this._searchBtnLayout,
      "Закрыть",
      { color: "#123456" },
      () => {
        ReactComponent[this.dialogFormObjectsWithPatterns].destroyWidget();
        if (this.$external instanceof WidgetSmartImage) {
          this.$external.cancelCreateObject();
        }
      }
    );
  }
  drawFormObjectsWithPatterns() {
    let currentSearchOptionButton = undefined;

    this.dialogFormObjectsWithPatterns = this.drawDialog(-1);
    const mainLayout = this.drawLayout(
      this.dialogFormObjectsWithPatterns,
      "layoutVertical",
      { minWidth: "35vw", minHeight: "65vh" }
    );

    this.drawLabel(
      this.drawLayout(mainLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "Создайте по прототипу или выберете необходим Вам объект"
    );

    const searchLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    
    this.drawLabel(searchLayout, "Поиск по имени объекта");
    
    ReactComponent[this.drawInput(searchLayout, "")].htmlElement.oninput =
      this.controlFindInput.bind(this);
    const searchOptionLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    const objectBTNOption = this.drawButton(
      searchOptionLayout,
      "Объекты",
      { color: "#123456", background: "grey" },
      () => {
        if (currentSearchOptionButton) {
          this.widgetSetStyle(currentSearchOptionButton, {
            background: "#2bbbad",
          });
        }
        this.widgetSetStyle(objectBTNOption, { background: "grey" });
        currentSearchOptionButton = objectBTNOption;
        this._searchMode = "object";
        this.switchSearchMode();
      }
    );
    currentSearchOptionButton = objectBTNOption;
    const patternBTNOption = this.drawButton(
      searchOptionLayout,
      "Прототип",
      { color: "#123456" },
      () => {
        if (currentSearchOptionButton) {
          this.widgetSetStyle(currentSearchOptionButton, {
            background: "#2bbbad",
          });
        }
        this.widgetSetStyle(patternBTNOption, { background: "grey" });
        currentSearchOptionButton = patternBTNOption;
        this._searchMode = "pattern";
        this.switchSearchMode();
      }
    );
    this._searchLayout = this.drawLayout(
      this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "100%" }
    );
    this._searchTreeLayout = this.drawLayout(
      this.drawLayout(this._searchLayout, "layoutHorizontal", {
        width: "100%",
      }),
      "layoutVertical",
      { height: "400px" }
    );
    this._searchBtnLayout = this.drawLayout(
      this._searchLayout,
      "layoutHorizontal",
      { width: "100%", minHeight: "50px", maxHeight: "50px" }
    );
    this._searchMode = "object";
    this.switchSearchMode();
  }

  controlFindInput(e) {
    
    if (e.target.value.length <= 0) {
      this.switchSearchMode();
      return;
    }
    ReactComponent[this._searchTreeLayout].clearWidget();

    if (this._searchMode == "object") {
       const data = searchByName(Object.values(Object.values(MainObjects)[7]), e.target.value)
      //MainObjects.find(e.target.value);
      
      let result = []
      data.forEach(item => result.push({classification: item.additional.classification, name: item.meta.name}))

      const tree =
        MainClassification.drawTreeByClassificationsWithObjects(result);

      for (let id of Object.keys(tree)) {
        const layout = this.drawLayout(
          this._searchTreeLayout,
          "layoutHorizontal",
          { width: "100%" }
        );
        ReactComponent[layout].includeWidget(tree[id]);
      }
    } else {
      console.log('Main Classificator:', MainClassificator);
      console.log('MainClassificator find', MainClassificator.find(e.target.value))
      const data = searchByName(Object.values(MainClassificator)[5],e.target.value)

      console.log('Mainclassificator data', Object.values(MainClassificator)[5]);

      const tree = MainClassificator.drawClassificatorTreesByItems(data);

      for (let id of Object.keys(tree)) {
        const layout = this.drawLayout(
          this._searchTreeLayout,
          "layoutHorizontal",
          { width: "100%" }
        );
        ReactComponent[layout].includeWidget(tree[id]);
      }
    }
  }
}
