class DrawFormWidgets extends BaseObjectEditor {
  constructor() {
    super();
    this._widgets = {};
  }
  drawComboBoxWithTitle(layout, title) {
    const comboBoxLayout = this.drawLayout(layout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });
    this.drawLabel(comboBoxLayout, title);
    const comboBox = this.drawComboBox(comboBoxLayout);
    return comboBox;
  }

  drawCommonDialog(title, OKName, CancelName, callback, isSearched = false) {
    try {
      const dialog = this.drawDialog(-1);
      ReactComponent[dialog].dialogContent.style.minWidth = "100%";
      const dialogName = title + new Date().getSeconds();
      this._widgets[dialogName] = dialog;
      const mainLayout = this.drawLayout(dialog, "layoutVertical", {
        minWidth: "600px",
        minHeight: "600px",
      });
      let searchLayout = undefined;

      this.drawLabel(
        this.drawLayout(mainLayout, "layoutHorizontal", {
          width: "100%",
          minHeight: "50px",
          maxHeight: "50px",
        }),
        title
      );
      if (isSearched) {
        searchLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
          width: "100%",
          minHeight: "50px",
          maxHeight: "50px",
        });
      }
      const contentLayout = this.drawLayout(
        this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
        "layoutVertical",
        { height: "500px" }
      );
      const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
        minHeight: "50px",
        maxHeight: "50px",
        width: "100%",
      });
      this.drawButton(btnLayout, OKName, { color: "#123456" }, () => {
        if (!callback()) return;
        ReactComponent[dialog].destroyWidget();
        delete this._widgets[dialogName];
      });
      this.drawButton(btnLayout, CancelName, { color: "#123456" }, () => {
        ReactComponent[dialog].destroyWidget();
        delete this._widgets[dialogName];
      });
      return [contentLayout, searchLayout];
    } catch (e) {
      console.error("DrawFormWidgets.drawCommonDialog", e);
    }
  }
  drawSearch(searchLayout, inputCallback) {
    this.drawLabel(searchLayout, "Поиск");
    ReactComponent[this.drawInput(searchLayout, "")].htmlElement.oninput = (
      e
    ) => {
      inputCallback(e);
    };
  }
  drawLanguages(layout, languageValues = undefined) {
    const languageSystem = new LanguageSystem(this);
    const languageHeaderLayout = this.drawLayout(layout, "layoutHorizontal", {
      width: "100%",
      minHeight: "50px",
      maxHeight: "50px",
    });

    this.drawLabel(languageHeaderLayout, "Язык");
    this.drawLabel(languageHeaderLayout, "Значение");

    const valueInputs = {};

    const selectedLanguages = languageValues
      ? languageValues
      : languageSystem.defaultLanguages;

    const languageListLayout = this.drawLayout(
      this.drawLayout(layout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "100%" }
    );

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

    for (let language of Object.keys(selectedLanguages)) {
      languageSystem.addSelectedLanguage(language);
      valueInputs[language] = languageValues ? languageValues[language] : "";
      const languageLayout = this.drawLayout(
        languageListLayout,
        "layoutHorizontal",
        { width: "100%", minHeight: "50px", maxHeight: "50px" }
      );
      this.drawLabel(
        languageLayout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      ReactComponent[
        this.drawInput(languageLayout, valueInputs[language])
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
    return valueInputs;
  }
}
class Classification {
  constructor(contextMenu, objectSystem, rightLayout) {
    this._classification = {};
    this._classificationMaxID = {};
    this._treeItem = {};
    this._objectTreeItem = {};
    this._tree = {};

    this._classificationID = {};

    this._projectID = undefined;

    this._contextMenu = contextMenu;

    this._classificationMenuName = "Classification";
    this._classificationItemsName = "ClassificationItems";

    this._classificationLoadedItemsName = "ClassificationLoadedItems";

    this._classificationGroupMenuName = "ClassificationGroupMenu";
    this._classificationObjectMenuName = "ClassificatioObjectMenu";

    this._classificationObjectMenuMainName = "ClassificationObjectMenuMainName";

    //this._classificationGroupListMenuName = "ClassificationGroupListMenu";
    this._classificationGroupListAddMenu = new ContextMenuList(
      "Добавить в группу"
    );
    this._classificationGroupListMoveMenu = new ContextMenuList(
      "Переместить в группу"
    );
    this._classificationGroupListDeleteMenu = new ContextMenuList(
      "Убрать из группы"
    );

    this._objectSystem = objectSystem;

    this._rightLayout = rightLayout;

    this._contextMenu.createMenu(this._classificationLoadedItemsName);

    this._contextMenu.createMenu(this._classificationMenuName);
    this._contextMenu.addMenuItem(
      this._classificationMenuName,
      "Добавить группу",
      -1,
      "main",
      {},
      this.formEditGroup.bind(this)
    );

    this._contextMenu.createMenu(this._classificationItemsName);

    this._contextMenu.createMenu(this._classificationGroupMenuName);
    this._contextMenu.addMenuItem(
      this._classificationGroupMenuName,
      "Добавить группу",
      -1,
      "main",
      {},
      this.formEditGroup.bind(this)
    );
    this._contextMenu.addMenuItem(
      this._classificationGroupMenuName,
      "Редактировать группу",
      -1,
      "main",
      {},
      undefined
    );
    this._contextMenu.addMenuItem(
      this._classificationGroupMenuName,
      "Удалить группу",
      -1,
      "main",
      {},
      undefined
    );
    //this._contextMenu.addMenuItemSubMenu(this._classificationGroupMenuName,this._classificationGroupListMenu);

    this._contextMenu.createMenu(this._classificationObjectMenuName);
    this._contextMenu.addMenuItem(
      this._classificationObjectMenuName,
      "Создать копию",
      -1,
      "main",
      {},
      undefined
    );
    this._contextMenu.addMenuItem(
      this._classificationObjectMenuName,
      "Использовать",
      -1,
      "main",
      {},
      undefined
    );

    this._contextMenu.createMenu(this._classificationObjectMenuMainName);
    /*this._contextMenu.addMenuItem(this._classificationObjectMenuMainName,"Добавить в группу",-1,"main",{},undefined);
        this._contextMenu.addMenuItem(this._classificationObjectMenuMainName,"Переместить в группу",-1,"main",{},undefined);
        this._contextMenu.addMenuItem(this._classificationObjectMenuMainName,"Убрать из группы",-1,"main",{},undefined);*/
    this._contextMenu.addMenuItemSubMenu(
      this._classificationObjectMenuMainName,
      this._classificationGroupListAddMenu
    );
    this._contextMenu.addMenuItemSubMenu(
      this._classificationObjectMenuMainName,
      this._classificationGroupListMoveMenu
    );
    this._contextMenu.addMenuItemSubMenu(
      this._classificationObjectMenuMainName,
      this._classificationGroupListDeleteMenu
    );
    this._contextMenu.addMenuItem(
      this._classificationObjectMenuMainName,
      "Удалить",
      -1,
      "main",
      {},
      undefined
    );

    this._drawFormWidgets = new DrawFormWidgets();
  }
  setProjectID(projectID) {
    this._projectID = projectID;
  }
  loadClassification(id, projectID, callback) {
    const loadedClassification = function (resultJSON) {
      this._classification[projectID] =
        resultJSON.cursor.firstBatch[0].classification;
      this._classificationMaxID[projectID] = -1;
      const findMaxID = function (id, element) {
        if (Number(id) > Number(this._classificationMaxID[projectID])) {
          this._classificationMaxID[projectID] = id;
        }
        for (let childID of Object.keys(element["childrens"])) {
          findMaxID.bind(this, childID, element["childrens"][childID])();
        }
      };
      const rootID = Object.keys(this._classification[projectID])[0];
      findMaxID.bind(this, rootID, this._classification[projectID][rootID])();
      callback();
    };
    this._classificationID[projectID] = id;
    const request = '{"_id" : {"$oid" : "' + id + '"}}';
    APP.dbWorker.responseDOLMongoRequest = loadedClassification.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }

  drawTree(projectID) {
    try {
      this._tree[projectID] = new WidgetTree();
      this._treeItem[projectID] = {};
      this._classificationGroupListAddMenu.clearItems();
      this._classificationGroupListMoveMenu.clearItems();
      this._classificationGroupListDeleteMenu.clearItems();
      const drawItem = function (id, parentID, element, predParentID, pID) {
        const name =
          parentID === -1
            ? `${element.name.ru}`
            : element.name["ru"] + " ( группа )";
        predParentID = parentID;
        const item = this._tree[projectID].createItemInTree(parentID, () => { });
        this._contextMenu.addMenuItem(
          this._classificationItemsName,
          "",
          item,
          "group",
          { name: element.name, id: id },
          undefined
        );

        if (parentID != -1) {
          this._classificationGroupListAddMenu.addMenuItem(
            name.replace(" ( группа )", ""),
            -1,
            "group",
            { id: id },
            this.addObjectToClassificationGroup.bind(this)
          );
          this._classificationGroupListMoveMenu.addMenuItem(
            name.replace(" ( группа )", ""),
            -1,
            "group",
            { id: id },
            this.moveObjectToClassificationGroup.bind(this)
          );
          if (id != "2") {
            this._classificationGroupListDeleteMenu.addMenuItem(
              name.replace(" ( группа )", ""),
              -1,
              "group",
              { id: id },
              this.deleteObjectFromClassificationGroup.bind(this)
            );
          }
        }

        ReactComponent[item].text = name;

        this._treeItem[projectID][id] = {
          widget: item,
          parent: predParentID,
          name: name.replace(" ( группа )", ""),
          id: id,
          parentID: pID,
        };
        for (let childID of Object.keys(element.childrens)) {
          drawItem.bind(
            this,
            childID,
            item,
            element.childrens[childID],
            predParentID,
            id
          )();
        }
      };
      const rootID = Object.keys(this._classification[projectID])[0];
      drawItem.bind(
        this,
        rootID,
        -1,
        this._classification[projectID][rootID],
        -1,
        -1
      )();
      return this._tree[projectID].id;
    } catch (e) {
      console.error("Classification.drawTree", e);
    }
  }
  fillTreeWithObject(projectID) {
    let map ={};
    const loaded = function (res) {
      console.log('res - ', res);
    }
    // for (let i = 0; i < MainClassification._objectSystem._objects[MainClassification._projectID].length; i++) {
    //   //console.log('object to change: ',MainClassification._objectSystem._objects[MainClassification._projectID][i]);
    //   if (!map.MainClassification._objectSystem._objects[MainClassification._projectID][i].additional.classification[projectID][j])
    //   const obj = {
    //     "meta": {
    //       "owner": {
    //         "$oid": APP.owner
    //       },
    //       "name": "",//
    //       "description": "",
    //       "pattern": {
    //         "$oid": "602e8108b0125500080c818c"//
    //       }
    //     },
    //     "object": "",//
    //     "additional": {
    //       "wiki_ref": "",
    //       "image": ""
    //     }
    //   }

    //   APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    //   APP.dbWorker.sendInsertRCRequest("DOLMongoRequest", JSON.stringify(obj), "objects");
    // }
    if (!this._tree[projectID]) return;
    this._objectTreeItem[projectID] = {};
    const objects = this._objectSystem._objects[projectID];
    for (let i = 0; i < objects.length; i++) {
      if (!objects[i]["additional"].hasOwnProperty("classification")) continue;
      let objectClassifications = objects[i]["additional"]["classification"][
        projectID
      ].map((item) => item.split(".").pop());
      this._objectTreeItem[projectID][objects[i]["_id"]["$oid"]] = [];
      for (let id of objectClassifications) {
        if (!this._treeItem[projectID][id]) {
          let updated = function (res) { 'fix', console.log(res); }
          objectClassifications.splice(objectClassifications.indexOf(id), 1);
          this._objectSystem._objects[projectID][i].additional.classification[projectID] = objectClassifications;
          objects[i]["additional"]["classification"][projectID]
          const sets = {
            $set: {
              additional: this._objectSystem._objects[projectID][i].additional,
            },
          };
          APP.dbWorker.responseDOLMongoRequest = updated.bind(this);
          APP.dbWorker.sendUpdateRCRequest(
            "DOLMongoRequest",
            this._objectSystem._objects[projectID][i]._id["$oid"],
            JSON.stringify(sets)
          );
          continue;
        }
        const item = this._tree[projectID].createItemInTree(
          this._treeItem[projectID][id]["widget"],
          () => {
            if (this._projectID != projectID) return;
            this._objectSystem.showObjectInfo(
              this._rightLayout,
              this._projectID,
              objects[i]["_id"]["$oid"]
            );
          },
          { id: objects[i]["_id"]["$oid"] }
        );
        this._contextMenu.addMenuItem(
          this._classificationItemsName,
          "",
          item,
          "object",
          {
            category: objects[i]["additional"]["category"],
            widget: item,
            props: objects[i]["object"],
            objectID: objects[i]["_id"]["$oid"],
          },
          undefined
        );
        ReactComponent[item].text = objects[i]["meta"]["name"] + " ( объект )";
        this._objectTreeItem[projectID][objects[i]["_id"]["$oid"]].push({
          group: id,
          widget: item,
        });
      }
    }
  }
  getTree(projectID) {
    const [tree, confirmity] = this._tree[projectID].copyTree();
    return tree;
  }

  drawTreeByClassificationWithObjects(projectID, data) {
    const tree = new WidgetTree();

    if (data.length == 0) {
      return
      // const item = tree.createItemInTree(-1);
      // ReactComponent[item].text = "Классификация проекта";  

      // const item2 = tree.createItemInTree(item);
      // ReactComponent[item2].text = "Ничего не найдено";

      // return tree;
    }

    const localTreeItem = {};
    let allClassification = {};

    data.forEach((item) => {
      if (
        //item.classification?.hasOwnProperty(projectID)
        item.hasOwnProperty("classification") &&
        item["classification"] &&
        item["classification"].hasOwnProperty(projectID)
      ) {
        item["classification"][projectID].forEach(
          (item2) => (allClassification[item2] = 1)
        );
      }
    });
    allClassification = Object.keys(allClassification);

    if (allClassification.length == 0) {
      return
      // const item = tree.createItemInTree(-1);
      // ReactComponent[item].text = "Классификация проекта";

      // const item2 = tree.createItemInTree(item);
      // ReactComponent[item2].text = "Ничего не найдено";

      // return tree;
    }
    for (let classification of allClassification) {
      const path = classification.split(".");
      let localCurrentTreeItem = localTreeItem;
      let currentClassification = this._classification[projectID];
      let predNum = -1;
      for (let num of path) {
        currentClassification = currentClassification["1"];
        if (!localCurrentTreeItem.hasOwnProperty(num)) {
          const item = tree.createItemInTree(predNum);
          ReactComponent[item].text = currentClassification.name.ru;
          localCurrentTreeItem[num] = { widget: item, parent: predNum };
          predNum = item;
        } else {
          predNum = localCurrentTreeItem[num]["widget"];
        }
        currentClassification = currentClassification["childrens"];
      }
    }

    for (let object of data) {
      if (
        !object.hasOwnProperty("classification") ||
        !object["classification"] ||
        !object["classification"].hasOwnProperty(projectID)
      )
        continue;
      const parents = object["classification"][projectID].map((item) =>
        item.split(".").pop()
      );
      for (let parent of parents) {
        const item = tree.createItemInTree(localTreeItem[parent]["widget"]);

        ReactComponent[item].text = object["name"];
      }
    }
    return tree;
  }

  drawTreeByClassificationsWithObjects(data) {
    const tree = {};
    for (let id of Object.keys(this._classification)) {
      tree[id] = this.drawTreeByClassificationWithObjects(id, data);
    }
    return tree;
  }

  getAllClassificationTree(mode = "addObject", callback = undefined) {
    const tree = {};
    for (let id of Object.keys(this._classification)) {
      let projTree = undefined;
      let confirmity = undefined;
      if (id === this._projectID) {
        [projTree, confirmity] = this._tree[id].copyTree();
      } else {
        projTree = this._tree[id];
      }
      if (mode != "showList") {
        projTree.htmlElement.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this.showContextMenu(e, mode, confirmity);
        });
      }
      if (callback) {
        projTree.setAllItemCallback(callback);
      }
      tree[id] = projTree;
    }
    return tree;
  }

  showContextMenu(e, mode, confirmity = undefined) {
    console.log("showContextMenu", e);
    let element = e.target;
    while (
      element &&
      !element.classList.contains("WidgetTreeItem") &&
      element.getAttribute("id") != "root"
    ) {
      element = element.parentNode;
    }
    console.log("element", element);
    const id = confirmity
      ? confirmity[element.getAttribute("id")]
      : element.getAttribute("id");
    if (id == "root") {
      this._contextMenu.showMenu(
        this._classificationMenuName,
        APP.UI.mX,
        APP.UI.mY
      );
      return;
    }
    const finded = this._contextMenu.findItemByWidgetID(
      this._classificationItemsName,
      id
    );
    console.log("finded", finded);
    if (!finded) {
      this._contextMenu.showMenu(
        this._classificationMenuName,
        APP.UI.mX,
        APP.UI.mY
      );
      return;
    }
    switch (finded["type"]) {
      case "group": {
        if (mode != "mainView") break;
        if (finded.info.id === "1" || finded.info.id === "2") {
          return this._contextMenu.showMenu(
            this._classificationMenuName,
            APP.UI.mX,
            APP.UI.mY
          );
        }
        this._contextMenu.setMenuItemCallback(
          this._classificationGroupMenuName,
          "Редактировать группу",
          this.formEditGroup.bind(this, finded)
        );
        this._contextMenu.setMenuItemCallback(
          this._classificationGroupMenuName,
          "Удалить группу",
          this.deleteGroup.bind(this, finded)
        );
        this._contextMenu.showMenu(
          this._classificationGroupMenuName,
          APP.UI.mX,
          APP.UI.mY
        );
        break;
      }
      case "object": {
        if (mode == "addObject") {
          this._contextMenu.setMenuItemCallback(
            this._classificationObjectMenuName,
            "Создать копию",
            this.loadPattern.bind(
              this,
              finded.info.category,
              "edit",
              finded.info.props
            )
          );
          this._contextMenu.showMenu(
            this._classificationObjectMenuName,
            APP.UI.mX,
            APP.UI.mY
          );
        } else {
          console.log(
            " this._objectTreeItem[projectID]",
            this._objectTreeItem[this._projectID]
          );
          this._classificationGroupListAddMenu.clearStyles();
          this._classificationGroupListMoveMenu.clearStyles();
          this._classificationGroupListDeleteMenu.addAllItemStyles({
            display: "none",
          });

          this._classificationGroupListAddMenu.addAllItemsInfoField(
            "objectID",
            finded.info["objectID"]
          );

          this._classificationGroupListMoveMenu.addAllItemsInfoField(
            "objectID",
            finded.info["objectID"]
          );
          this._classificationGroupListMoveMenu.addAllItemsInfoField(
            "objectWidget",
            finded.info["widget"]
          );

          this._classificationGroupListDeleteMenu.addAllItemsInfoField(
            "objectID",
            finded.info["objectID"]
          );
          this._classificationGroupListDeleteMenu.addAllItemsInfoField(
            "objectWidget",
            finded.info["widget"]
          );

          let classification = this._objectSystem.getObjectClassification(
            this._projectID,
            finded.info.objectID
          );
          classification = classification.map((item) => item.split(".").pop());
          for (let id of classification) {
            const name = this._treeItem[this._projectID][id]["name"];
            const addItem =
              this._classificationGroupListAddMenu.findItemByName(name);

            if (addItem) {
              addItem.style = {
                background: "green",
                cursor: "context-menu",
              };
              addItem.addClasslist("ContextMenu-notSelectable");
            }

            const moveItem =
              this._classificationGroupListMoveMenu.findItemByName(name);
            if (moveItem) {
              moveItem.style = {
                background: "green",
                cursor: "context-menu",
              };
              moveItem.addClasslist("ContextMenu-notSelectable");
            }

            const deleteItem =
              this._classificationGroupListDeleteMenu.findItemByName(name);
            if (
              deleteItem &&
              this._treeItem[this._projectID][id]["parentID"] != -1
            ) {
              deleteItem.style = {
                disaply: "block !important",
              };
            }
          }
          console.log("classifiaction", classification);

          this._contextMenu.showMenu(
            this._classificationObjectMenuMainName,
            APP.UI.mX,
            APP.UI.mY
          );
        }

        break;
      }
    }
  }
  loadPattern(category, mode, props) {
    const loaded = function (resultJSON) {
      const result = resultJSON.cursor.firstBatch;
      const editor = new PatternEditorSystem(this);
      editor.openPrototypeProperties(result[0], mode, props);

      //this.openPrototype(result[0],mode,props);
    };
    const request = '{"additional.category" : "' + category + '"}';
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "patterns", request);
  }
  formEditGroup(group = undefined) {
    debugger;
    console.log("group", group);
    let languageValues;
    let currentParentClassification = -1;
    const oldParentClassification =
      JSON.stringify(group) !== "{}"
        ? this._treeItem[this._projectID][group.info.id]["parentID"]
        : -1;
    const [contentLayout] = this._drawFormWidgets.drawCommonDialog(
      group ? "Редактирование группы" : "Создание группы",
      JSON.stringify(group) !== "{}" ? "Сохранить" : "Создать",
      "Отмена",
      () => {
        console.log("languageValues", languageValues);
        console.log("this._classificationMaxID", this._classificationMaxID);

        for (let language of Object.keys(languageValues)) {
          if (languageValues[language].length <= 0) {
            APP.log("error", "Вы не заполнили " + language + " язык");
            return false;
          }
        }

        const parents = [];
        let currentParrent = currentParentClassification;
        while (currentParrent != -1) {
          parents.unshift(currentParrent);
          currentParrent =
            this._treeItem[this._projectID][currentParrent]["parentID"];
        }
        const oldParents = [];
        if (
          oldParentClassification != -1 &&
          oldParentClassification != currentParentClassification
        ) {
          let oldCurrentParrent = oldParentClassification;
          while (oldCurrentParrent != -1) {
            oldParents.unshift(oldCurrentParrent);
            oldCurrentParrent =
              this._treeItem[this._projectID][oldCurrentParrent]["parentID"];
          }
        }
        console.log("parents", parents);

        if (JSON.stringify(group) === "{}") {
          this.addBranchToClassification(
            this._projectID,
            parents,
            this._treeItem[this._projectID][currentParentClassification][
            "widget"
            ],
            languageValues,
            () => { }
          );
        } else {
          this.updateBranchInClassification(
            this._projectID,
            parents,
            group.info.id,
            languageValues,
            oldParents
          );
        }
        return true;
      }
    );
    const combobox = this._drawFormWidgets.drawComboBoxWithTitle(
      contentLayout,
      "Родитель"
    );
    languageValues = this._drawFormWidgets.drawLanguages(
      contentLayout,
      JSON.stringify(group) !== "{}" ? group.info.name : undefined
    );
    let index = 0;
    const parentID =
      JSON.stringify(group) !== "{}"
        ? this._treeItem[this._projectID][group.info.id]["parentID"]
        : -1;
    for (let item of Object.keys(this._treeItem[this._projectID])) {
      ReactComponent[combobox].addItem(
        this._treeItem[this._projectID][item]["name"],
        () => {
          currentParentClassification = item;
        }
      );
      if (item == parentID) {
        ReactComponent[combobox].setCurrentItem(index);
      }
      index++;
    }
    if (parentID == -1) {
      ReactComponent[combobox].setCurrentItem(0);
    }
    console.log(
      "this._treeItem[this._projectID]",
      this._treeItem[this._projectID]
    );
  }
  deleteGroup(group) {
    console.log(this._treeItem[this._projectID]);
    debugger;
    if (
      Object.keys(this._objectTreeItem[this._projectID])
        .map((item) =>
          this._objectTreeItem[this._projectID][item].filter(
            (item2) => item2["group"] == group.info.id
          )
        )
        .filter((item) => item.length != 0).length != 0
    ) {
      return APP.log(
        "error",
        "В данной группе есть объекты. Удаление невозможно"
      );
    }
    if (
      Object.keys(this._treeItem[this._projectID]).filter(
        (item) =>
          this._treeItem[this._projectID][item]["parentID"] == group.info.id
      ).length != 0
    ) {
      return APP.log(
        "error",
        "В данной группе есть подгруппы. Удаление невозможно"
      );
    }
    const parents = [];
    let currentParent =
      this._treeItem[this._projectID][group.info.id]["parentID"];
    while (currentParent != -1) {
      parents.unshift(currentParent);
      currentParent =
        this._treeItem[this._projectID][currentParent]["parentID"];
    }
    let currentClassification = this._classification[this._projectID];
    for (let id of parents) {
      currentClassification = currentClassification[id];
      currentClassification = currentClassification["childrens"];
    }
    this._tree[this._projectID].removeItemFromTree(
      this._treeItem[this._projectID][group.info.id]["widget"]
    );
    delete currentClassification[group.info.id];
    delete this._treeItem[this._projectID][group.info.id];
    this.updateClassification(this._projectID, () => {
      console.log("parents", parents);
      console.log("currentClassification", currentClassification);
    });
  }
  addBranchToClassification(
    projectID,
    parentsID,
    parentWidget,
    names,
    callback
  ) {
    let currentClassification = this._classification[projectID];
    for (let id of parentsID) {
      currentClassification = currentClassification[id];
      currentClassification = currentClassification["childrens"];
    }
    let id = (parseInt(this._classificationMaxID[projectID]) + 1).toString();
    //let id = 0; debugger;
    //while(currentClassification[id]) id++;
    currentClassification[id] = {
      name: names,
      childrens: {},
    };
    const item = this._tree[projectID].createItemInTree(
      parentWidget,
      undefined
    );
    ReactComponent[item].text = names["ru"] + " ( группа )";

    this._treeItem[projectID][id] = {
      widget: item,
      parent: parentWidget,
      name: names["ru"],
      id: id,
      parentID: parentsID[parentsID.length - 1],
    };
    this._contextMenu.addMenuItem(
      this._classificationItemsName,
      "",
      item,
      "group",
      { name: names, id: id },
      undefined
    );
    this._classificationMaxID[projectID] = id;

    this._classificationGroupListAddMenu.addMenuItem(
      names["ru"],
      -1,
      "group",
      { id: id },
      this.addObjectToClassificationGroup.bind(this)
    );
    this._classificationGroupListMoveMenu.addMenuItem(
      names["ru"],
      -1,
      "group",
      { id: id },
      this.moveObjectToClassificationGroup.bind(this)
    );
    this._classificationGroupListDeleteMenu.addMenuItem(
      names["ru"],
      -1,
      "group",
      { id: id },
      this.deleteObjectFromClassificationGroup.bind(this)
    );

    this.updateClassification(projectID, () => {
      callback();
    });
  }
  updateBranchInClassification(projectID, parentsID, id, name, oldParentsID) {
    console.log("parentsID", parentsID);
    console.log("oldParentsID", oldParentsID);

    const treeItem = this._treeItem[projectID][id];

    let currentClassification = this._classification[projectID];
    let oldCurrentClassification = this._classification[projectID];

    for (let id of parentsID) {
      currentClassification = currentClassification[id];
      currentClassification = currentClassification["childrens"];
    }

    if (oldParentsID.length != 0) {
      for (let id of oldParentsID) {
        oldCurrentClassification = oldCurrentClassification[id];
        oldCurrentClassification = oldCurrentClassification["childrens"];
      }
      currentClassification[id] = JSON.parse(
        JSON.stringify(oldCurrentClassification[id])
      );
      delete oldCurrentClassification[id];

      const parentID = parentsID[parentsID.length - 1];
      const parentTreeItem = this._treeItem[projectID][parentID];
      treeItem["parent"] = parentTreeItem["widget"];
      treeItem["parentID"] = parentID;

      ReactComponent[treeItem["widget"]].parentId = parentTreeItem["widget"];
    }

    console.log("currentClassification", currentClassification);
    console.log("oldCurrentClassification", oldCurrentClassification);
    console.log(
      "this._classification[projectID]",
      this._classification[projectID]
    );
    console.log("this._treeItem[projectID]", this._treeItem[projectID]);

    currentClassification[id]["name"] = name;
    const addItem = this._classificationGroupListAddMenu.findItemByName(
      treeItem["name"]
    );
    if (addItem) {
      addItem.name = name["ru"];
    }

    const moveItem = this._classificationGroupListMoveMenu.findItemByName(
      treeItem["name"]
    );
    if (moveItem) {
      moveItem.name = name["ru"];
    }

    const deleteItem = this._classificationGroupListDeleteMenu.findItemByName(
      treeItem["name"]
    );
    if (deleteItem && this._treeItem[this._projectID][id]["parentID"] != -1) {
      deleteItem.name = name["ru"];
    }
    const finded = this._contextMenu.findItemByInfoField(
      this._classificationItemsName,
      "name.ru",
      treeItem["name"]
    );
    if (finded) {
      finded.info["name"] = name;
    }

    treeItem["name"] = name["ru"];
    ReactComponent[treeItem["widget"]].text = name["ru"];

    this.updateClassification(projectID, () => { });
  }
  updateClassification(projectID, callback) {
    debugger;
    const updated = function (resultJSON) {
      console.log("updateClassification", resultJSON);
      callback();
    };
    const id = this._classificationID[projectID];
    const sets = {
      $set: {
        classification: this._classification[projectID],
      },
    };
    APP.dbWorker.responseDOLMongoRequest = updated.bind(this);
    APP.dbWorker.sendUpdateRCRequest(
      "DOLMongoRequest",
      id,
      JSON.stringify(sets)
    );
  }

  addObjectToClassificationGroup(info) {
    const { id, objectID } = info;
    this._objectSystem.addObjectClassification(
      this._projectID,
      objectID,
      id.toString()
    );

    const item = this._tree[this._projectID].createItemInTree(
      this._treeItem[this._projectID][id]["widget"],
      () => { },
      { id: objectID }
    );
    this._contextMenu.addMenuItem(
      this._classificationItemsName,
      "",
      item,
      "object",
      {
        category: this._objectSystem.getObjectClassificator(
          this._projectID,
          objectID
        ),
        widget: item,
        props: this._objectSystem.getObjectProps(this._projectID, objectID),
        objectID: objectID,
      },
      undefined
    );
    ReactComponent[item].text =
      this._objectSystem.getObjectName(this._projectID, objectID) +
      " ( объект )";
    this._objectTreeItem[this._projectID][objectID].push({ group: id, widget: item });
  }
  moveObjectToClassificationGroup(info) {
    console.log("moveObjectToClassificationGroup");
    console.log("info", info);
    const { id, objectID } = info;
    this._objectSystem.setObjectClassification(
      this._projectID,
      objectID,
      id.toString()
    ); debugger;
    for (let group of this._objectTreeItem[this._projectID][objectID]) {
      if (group.group !== "2") this._tree[this._projectID].removeItemFromTree(group["widget"]);
    }

    const item = this._tree[this._projectID].createItemInTree(
      this._treeItem[this._projectID][id]["widget"],
      () => { },
      { id: objectID }
    );
    this._contextMenu.addMenuItem(
      this._classificationItemsName,
      "",
      item,
      "object",
      {
        category: this._objectSystem.getObjectClassificator(
          this._projectID,
          objectID
        ),
        widget: item,
        props: this._objectSystem.getObjectProps(this._projectID, objectID),
        objectID: objectID,
      },
      undefined
    );

    ReactComponent[item].text =
      this._objectSystem.getObjectName(this._projectID, objectID) +
      " ( объект )";

    this._objectTreeItem[this._projectID][objectID] = [
      { group: id, widget: item },
    ];
  }
  deleteObjectFromClassificationGroup(info) {
    console.log("deleteObjectFromClassificationGroup");
    console.log("info", info);

    const { id, objectID } = info;

    this._objectSystem.deleteObjectClassification(
      this._projectID,
      objectID,
      id.toString()
    );

    this._tree[this._projectID].removeItemFromTree(
      this._objectTreeItem[this._projectID][objectID].find(
        (item) => item["group"] == id.toString()
      )["widget"]
    );
    this._objectTreeItem[this._projectID][objectID] = this._objectTreeItem[
      this._projectID
    ][objectID].filter((item) => item["group"] != id.toString());

    if (
      this._objectSystem.getObjectClassification(this._projectID, objectID)
        .length == 0
    ) {
      this._objectSystem.setObjectClassification(
        this._projectID,
        objectID,
        "2"
      );

      const item = this._tree[this._projectID].createItemInTree(
        this._treeItem[this._projectID]["2"]["widget"],
        () => { },
        { id: objectID }
      );
      this._contextMenu.addMenuItem(
        this._classificationItemsName,
        "",
        item,
        "object",
        {
          category: this._objectSystem.getObjectClassificator(
            this._projectID,
            objectID
          ),
          widget: item,
          props: this._objectSystem.getObjectProps(this._projectID, objectID),
          objectID: objectID,
        },
        undefined
      );

      ReactComponent[item].text =
        this._objectSystem.getObjectName(this._projectID, objectID) +
        " ( объект )";

      this._objectTreeItem[this._projectID][objectID] = [
        { group: "2", widget: item },
      ];
    }

    console.log(
      "this._objectTreeItem[this._projectID][objectID]",
      this._objectTreeItem[this._projectID][objectID]
    );
  }
}
