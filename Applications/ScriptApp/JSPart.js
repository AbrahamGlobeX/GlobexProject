var idWidgets = 1;

class JSPart {
  log(value) {
    console.log(value);
  }

  message(text) {
    APP.log("info", text);
  }

  appendElement(array, elem) {
    const arrayCopy = JSON.parse(JSON.stringify(array));
    const newElem = JSON.parse(JSON.stringify(elem));

    arrayCopy.push(newElem);

    return arrayCopy;
  }

  toString(value) {
    return value + "";
  }

  inversion(value) {
    return !value;
  }

  createWidget(widgets, type) {
    // console.log("AF", widgets, type);
    widgets = Module.Store.getAll().widgets;
    let idWidget = "widget_" + idWidgets++;
    widgets["0"].children.push(idWidget);
    // widgets['0'].attributes.className = "Form";
    let width = "500px";
    let height = "500px";
    if (
      type != "window" &&
      type != "layout" &&
      type != "layoutGrid" &&
      type != "dialog"
    ) {
      width = "150px";
      height = "75px";
    }
    if (type == "tree") {
      width = "250px";
      height = "750px";
    }
    if (type == "calendar") {
      width = "350px";
      height = "350px";
    }

    widgets[idWidget] = {
      htmlTag: type,
      component: type,
      textContent: "header on/off",
      headerText: "header",

      attributes: {
        // type : 'checkbox',
        style: {
          left: Math.random() * 500 + "px",
          top: Math.random() * 500 + "px",
          // ,
          width,
          height,
          background: "gray",
        },
        // checked : true
      },
      events: {
        onKeyPress: "someEvent",
        onClick: "someEvent",
      },
      children: [
        // {
        //     id: 1,
        //     children: [
        //         { id: 11,
        //             children: [
        //                 { id: 111 },
        //                 { id: 112 },
        //                 { id: 113 },
        //                 { id: 114 }
        //             ]
        //          },
        //         { id: 12 },
        //         { id: 13 },
        //         { id: 14 }
        //     ]
        // },
        // { id: 2 },
        // { id: 3 },
        // { id: 4 }
      ],
    };

    return widgets;
  }
  createDialog(type, content) {
    const dialog = new widgetsComponentsTypes["dialog"]();
    const mainlayout = new widgetsComponentsTypes["layoutVertical"]();
    ReactComponent[dialog.id].includeWidget(ReactComponent[mainlayout.id]);
    let returned = {
      dialog: dialog.id,
    };
    switch (type) {
      case "CreateProject": {
        let titlelayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let title = new widgetsComponentsTypes["label"]();
        title.text = "CreateProject";
        ReactComponent[titlelayout.id].includeWidget(ReactComponent[title.id]);
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[titlelayout.id]
        );
        returned["title"] = {
          layout: titlelayout.id,
          title: title.id,
        };

        let maincontentlayout = new widgetsComponentsTypes["layoutVertical"]();

        let namelayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let namelabel = new widgetsComponentsTypes["label"]();
        namelabel.text = "Name";
        let nameinput = new widgetsComponentsTypes["input"]();
        ReactComponent[namelayout.id].includeWidget(
          ReactComponent[namelabel.id]
        );
        ReactComponent[namelayout.id].includeWidget(
          ReactComponent[nameinput.id]
        );
        ReactComponent[maincontentlayout.id].includeWidget(
          ReactComponent[namelayout.id]
        );

        let desclayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let desclabel = new widgetsComponentsTypes["label"]();
        desclabel.text = "Description";
        let descinput = new widgetsComponentsTypes["input"]();
        ReactComponent[desclayout.id].includeWidget(
          ReactComponent[desclabel.id]
        );
        ReactComponent[desclayout.id].includeWidget(
          ReactComponent[descinput.id]
        );
        ReactComponent[maincontentlayout.id].includeWidget(
          ReactComponent[desclayout.id]
        );

        let wikilayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let wikilabel = new widgetsComponentsTypes["label"]();
        wikilabel.text = "Wiki";
        let wikiinput = new widgetsComponentsTypes["input"]();
        ReactComponent[wikilayout.id].includeWidget(
          ReactComponent[wikilabel.id]
        );
        ReactComponent[wikilayout.id].includeWidget(
          ReactComponent[wikiinput.id]
        );
        ReactComponent[maincontentlayout.id].includeWidget(
          ReactComponent[wikilayout.id]
        );

        let classificationsLayout = new widgetsComponentsTypes[
          "layoutVertical"
        ]();
        for (let i = 0; i < content.length; i++) {
          let classnamelayot = new widgetsComponentsTypes["layoutHorizonal"]();
          let classlabel = new widgetsComponentsTypes["label"]();
          classlabel.text = content[i]["name"];
          ReactComponent[classnamelayot.id].includeWidget(
            ReactComponent[classlabel.id]
          );
        }

        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[maincontentlayout.id]
        );
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[classificationsLayout.id]
        );

        returned["maincontent"] = {
          layout: maincontentlayout.id,
          name: {
            layout: namelayout.id,
            label: namelabel.id,
            input: nameinput.id,
          },
          desc: {
            layout: desclayout.id,
            label: desclabel.id,
            input: descinput.id,
          },
          wiki: {
            layout: wikilayout.id,
            label: wikilabel.id,
            input: wikiinput.id,
          },
        };

        let buttonlayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let btnok = new widgetsComponentsTypes["button"]();
        btnok.text = "Create";
        let btncancel = new widgetsComponentsTypes["button"]();
        btncancel.text = "Cancel";

        returned["buttons"] = {
          btnok: btnok.id,
          btncancel: btncancel.id,
        };
        ReactComponent[buttonlayout.id].includeWidget(ReactComponent[btnok.id]);
        ReactComponent[buttonlayout.id].includeWidget(
          ReactComponent[btncancel.id]
        );
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[buttonlayout.id]
        );
        break;
      }
      case "CreateObject": {
        let titlelayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let title = new widgetsComponentsTypes["label"]();
        title.text = "CreateObject";
        ReactComponent[titlelayout.id].includeWidget(ReactComponent[title.id]);
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[titlelayout.id]
        );
        returned["title"] = {
          layout: titlelayout.id,
          title: title.id,
        };

        let maincontentlayout = new widgetsComponentsTypes["layoutVertical"]();

        let namelayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let namelabel = new widgetsComponentsTypes["label"]();
        namelabel.text = "Name";
        let nameinput = new widgetsComponentsTypes["input"]();
        ReactComponent[namelayout.id].includeWidget(
          ReactComponent[namelabel.id]
        );
        ReactComponent[namelayout.id].includeWidget(
          ReactComponent[nameinput.id]
        );
        ReactComponent[maincontentlayout.id].includeWidget(
          ReactComponent[namelayout.id]
        );

        let desclayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let desclabel = new widgetsComponentsTypes["label"]();
        desclabel.text = "Description";
        let descinput = new widgetsComponentsTypes["input"]();
        ReactComponent[desclayout.id].includeWidget(
          ReactComponent[desclabel.id]
        );
        ReactComponent[desclayout.id].includeWidget(
          ReactComponent[descinput.id]
        );
        ReactComponent[maincontentlayout.id].includeWidget(
          ReactComponent[desclayout.id]
        );

        let wikilayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let wikilabel = new widgetsComponentsTypes["label"]();
        wikilabel.text = "Wiki";
        let wikiinput = new widgetsComponentsTypes["input"]();
        ReactComponent[wikilayout.id].includeWidget(
          ReactComponent[wikilabel.id]
        );
        ReactComponent[wikilayout.id].includeWidget(
          ReactComponent[wikiinput.id]
        );
        ReactComponent[maincontentlayout.id].includeWidget(
          ReactComponent[wikilayout.id]
        );

        let classificationsLayout = new widgetsComponentsTypes[
          "layoutVertical"
        ]();
        for (let i = 0; i < content.length; i++) {
          let classnamelayot = new widgetsComponentsTypes["layoutHorizonal"]();
          let classlabel = new widgetsComponentsTypes["label"]();
          classlabel.text = content[i]["name"];
          ReactComponent[classnamelayot.id].includeWidget(
            ReactComponent[classlabel.id]
          );
        }

        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[maincontentlayout.id]
        );
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[classificationsLayout.id]
        );

        returned["maincontent"] = {
          layout: maincontentlayout.id,
          name: {
            layout: namelayout.id,
            label: namelabel.id,
            input: nameinput.id,
          },
          desc: {
            layout: desclayout.id,
            label: desclabel.id,
            input: descinput.id,
          },
          wiki: {
            layout: wikilayout.id,
            label: wikilabel.id,
            input: wikiinput.id,
          },
        };

        let buttonlayout = new widgetsComponentsTypes["layoutHorizontal"]();
        let btnok = new widgetsComponentsTypes["button"]();
        btnok.text = "Create";
        let btncancel = new widgetsComponentsTypes["button"]();
        btncancel.text = "Cancel";

        returned["buttons"] = {
          btnok: btnok.id,
          btncancel: btncancel.id,
        };
        ReactComponent[buttonlayout.id].includeWidget(ReactComponent[btnok.id]);
        ReactComponent[buttonlayout.id].includeWidget(
          ReactComponent[btncancel.id]
        );
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[buttonlayout.id]
        );
        break;
      }
      case "OpenPropertyEditor": {
        let object = {
          name: "111",
          description: "",
          wiki: "22",
          properties: [
            {
              ID: "newPattern",
              properties: {
                Weight: {
                  value: {
                    valueTo: 6,
                    valueFrom: 2,
                  },
                  category: "Image",
                  prototypeID: "5ce777ef9ddcac72773c1a47",
                  ptype: "double",
                  counter: 27,
                  prop_ref: {
                    $oid: "5a0987cbd9ce171c30451879",
                  },
                },
              },
            },
          ],
        };
        if (content.hasOwnProperty("object")) object = content["object"];
        content["prototypes"] = [
          {
            ID: "5ce777ef9ddcac72773c1a47",
            properties: {
              "пжлст!!12": {
                value: {
                  valueTo: 0.005,
                  valueFrom: 0.005,
                },
                category: "Characteristics",
                prototypeID: "5ce777ef9ddcac72773c1a47",
                ptype: "double",
                counter: 11,
                prop_ref: {
                  $oid: "5cebacd47744766dd37a2148",
                },
              },
              Weight: {
                value: {
                  valueTo: 6,
                  valueFrom: 2,
                },
                category: "Image",
                prototypeID: "5ce777ef9ddcac72773c1a47",
                ptype: "double",
                counter: 27,
                prop_ref: {
                  $oid: "5a0987cbd9ce171c30451879",
                },
              },
            },
          },
          {
            ID: "5d2c03499ddcac1522795dae",
            properties: {},
          },
        ];

        const prototypes = content["prototypes"];
        let ownPrototype = object["properties"];

        const ownPrototypePatternID = "newPattern";

        let ownPropertiesList;
        let prototypePropertiesList;

        let ownProperties;
        let prototypeProperties;

        const Groups = {
          0: { name: "ALL", widget: null },
          1: { name: "Characteristics", widget: null },
          2: { name: "Image", widget: null },
          3: { name: "Image", widget: null },
          4: { name: "Image", widget: null },
          5: { name: "Image", widget: null },
          6: { name: "Image", widget: null },
          7: { name: "Image", widget: null },
        };
        let currentGroup = Groups[0];

        let DrawLabelWithInput;
        let DrawPropertiesByGroup;
        let AddButtonInLayout;

        let DrawMenuChooseGroup;
        let SwitchPropertiesGroup;

        let AddItemInPropertyList;
        let RemoveItemFromPropertyList;
        let DrawPropertiesList;

        let GeneratePropertiesInRightFormat;
        let SeparatePropertyByGroups;

        let CheckIsOwnPrototypeContainProperty;

        GeneratePropertiesInRightFormat = function (properties) {
          let rightProperties = [];
          for (let i = 0; i < properties.length; i++) {
            rightProperties[properties[i]["ID"]] = properties[i]["properties"];
          }
          return rightProperties;
        };

        SeparatePropertyByGroups = function (properties) {
          let separatedPropertiesByGroups = [];
          const prototypeKeys = Object.keys(properties);
          for (
            let prototypeID = 0;
            prototypeID < prototypeKeys.length;
            prototypeID++
          ) {
            separatedPropertiesByGroups[prototypeKeys[prototypeID]] = [];

            const propertyKeys = Object.keys(
              properties[prototypeKeys[prototypeID]]
            );
            for (
              let propertyID = 0;
              propertyID < propertyKeys.length;
              propertyID++
            ) {
              if (prototypeKeys.length > 1) {
                if (
                  CheckIsOwnPrototypeContainProperty(
                    ownProperties,
                    ownPrototypePatternID,
                    propertyKeys[propertyID]
                  )
                )
                  continue;
              }
              for (
                let groupID = 0;
                groupID < Object.keys(Groups).length;
                groupID++
              ) {
                const groupName = Groups[groupID]["name"];
                if (
                  !separatedPropertiesByGroups[
                    prototypeKeys[prototypeID]
                  ].hasOwnProperty(groupName)
                )
                  separatedPropertiesByGroups[prototypeKeys[prototypeID]][
                    groupName
                  ] = {};
                console.log(propertyKeys[propertyID]);
                if (groupName === "ALL") {
                  //debugger;
                  separatedPropertiesByGroups[prototypeKeys[prototypeID]][
                    groupName
                  ][propertyKeys[propertyID]] =
                    properties[prototypeKeys[prototypeID]][
                      propertyKeys[propertyID]
                    ];
                  /*separatedPropertiesByGroups[prototypeKeys[prototypeID]][groupName][propertyKeys[propertyID]] = {
                                        "value" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["value"],
                                        "category" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["category"]
                                    };*/
                  continue;
                }
                if (
                  groupName ===
                  properties[prototypeKeys[prototypeID]][
                    propertyKeys[propertyID]
                  ]["category"]
                ) {
                  separatedPropertiesByGroups[prototypeKeys[prototypeID]][
                    groupName
                  ][propertyKeys[propertyID]] =
                    properties[prototypeKeys[prototypeID]][
                      propertyKeys[propertyID]
                    ];
                  /*separatedPropertiesByGroups[prototypeKeys[prototypeID]][groupName][propertyKeys[propertyID]] = {
                                        "value" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["value"],
                                        "category" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["category"]
                                    };*/
                  break;
                }
              }
            }
          }
          return separatedPropertiesByGroups;
        };

        CheckIsOwnPrototypeContainProperty = function (
          ownProperties,
          ownPrototypePatternID,
          name,
          property
        ) {
          if (
            ownProperties.hasOwnProperty(ownPrototypePatternID) &&
            ownProperties[ownPrototypePatternID].hasOwnProperty(
              Groups[0]["name"]
            ) &&
            ownProperties[ownPrototypePatternID][
              Groups[0]["name"]
            ].hasOwnProperty(name)
          )
            return true;
          return false;
        };

        ownProperties = SeparatePropertyByGroups(
          GeneratePropertiesInRightFormat(ownPrototype)
        );
        console.log("ownPro", ownProperties);
        prototypeProperties = SeparatePropertyByGroups(
          GeneratePropertiesInRightFormat(prototypes)
        );

        AddItemInPropertyList = function (
          propertyListID,
          name,
          property,
          isOwn,
          value = ""
        ) {
          console.log("property", property);
          const { layout, label, input } = DrawLabelWithInput(
            propertyListID,
            name,
            ""
          );
          ReactComponent[layout].minHeight = "70px";
          if (isOwn) {
            ReactComponent[input].text = value;
            const btn1 = AddButtonInLayout(layout, "", function () {});
            ReactComponent[btn1["button"]].htmlElement.innerHTML = "&#9998;";
            const btn2 = AddButtonInLayout(layout, "-", () => {
              delete ownProperties[ownPrototypePatternID][Groups[0]["name"]][
                name
              ];
              delete ownProperties[ownPrototypePatternID][property["category"]][
                name
              ];

              if (
                !prototypeProperties[property["prototypeID"]].hasOwnProperty(
                  Groups[0]["name"]
                )
              )
                prototypeProperties[property["prototypeID"]][
                  Groups[0]["name"]
                ] = {};

              if (
                !prototypeProperties[property["prototypeID"]].hasOwnProperty(
                  property["category"]
                )
              )
                prototypeProperties[property["prototypeID"]][
                  property["category"]
                ] = {};

              prototypeProperties[property["prototypeID"]][Groups[0]["name"]][
                name
              ] = property;
              prototypeProperties[property["prototypeID"]][
                property["category"]
              ][name] = property;

              RemoveItemFromPropertyList(propertyListID, layout);
              AddItemInPropertyList(
                prototypePropertiesList,
                name,
                property,
                false
              );
            });
            ReactComponent[btn1["button"]].textColor = "#123456";
            ReactComponent[btn2["button"]].textColor = "#123456";
          } else {
            const btn = AddButtonInLayout(layout, "+", () => {
              if (!ownProperties.hasOwnProperty(ownPrototypePatternID)) {
                ownProperties[ownPrototypePatternID] = [];
              }
              if (
                !ownProperties[ownPrototypePatternID].hasOwnProperty(
                  Groups[0]["name"]
                )
              )
                ownProperties[ownPrototypePatternID][Groups[0]["name"]] = {};

              if (
                !ownProperties[ownPrototypePatternID].hasOwnProperty(
                  property["category"]
                )
              )
                ownProperties[ownPrototypePatternID][property["category"]] = {};

              ownProperties[ownPrototypePatternID][Groups[0]["name"]][name] =
                property;
              ownProperties[ownPrototypePatternID][property["category"]][name] =
                property;

              delete prototypeProperties[property["prototypeID"]][
                Groups[0]["name"]
              ][name];
              delete prototypeProperties[property["prototypeID"]][
                property["category"]
              ][name];
              RemoveItemFromPropertyList(propertyListID, layout);
              AddItemInPropertyList(
                ownPropertiesList,
                name,
                property,
                true,
                ReactComponent[input].text
              );
              console.log(ownProperties);
              console.log(prototypeProperties);
            });
            ReactComponent[btn["button"]].textColor = "#123456";
          }
        };

        RemoveItemFromPropertyList = function (propertyListID, layoutID) {
          ReactComponent[propertyListID].deleteWidget(ReactComponent[layoutID]);
        };

        DrawMenuChooseGroup = function (ParentLayoutID) {
          for (let i = 0; i < 8; i++) {
            const { button } = AddButtonInLayout(ParentLayoutID, i, () => {
              SwitchPropertiesGroup(i);
            });
            Groups[i]["widget"] = button;
            ReactComponent[button].textColor = "#123456";
            ReactComponent[button].hint = Groups[i]["name"];
          }
          ReactComponent[currentGroup["widget"]].background = "grey";
        };
        SwitchPropertiesGroup = function (group) {
          ReactComponent[currentGroup["widget"]].background = "none";
          currentGroup = Groups[group];
          ReactComponent[currentGroup["widget"]].background = "grey";
          ReactComponent[ownPropertiesList].clearWidget();
          ReactComponent[prototypePropertiesList].clearWidget();
          DrawPropertiesList(
            ownPropertiesList,
            currentGroup,
            ownProperties,
            true
          );
          DrawPropertiesList(
            prototypePropertiesList,
            currentGroup,
            prototypeProperties,
            false
          );
        };
        DrawPropertiesList = function (
          parentLayoutID,
          group,
          properties,
          isOwn
        ) {
          const prototypeKeys = Object.keys(properties);
          for (let i = 0; i < prototypeKeys.length; i++) {
            try {
              let propertiesKeys = Object.keys(
                properties[prototypeKeys[i]][group["name"]]
              );
              console.log("propertiesKeys", propertiesKeys);
              for (let j = 0; j < propertiesKeys.length; j++) {
                AddItemInPropertyList(
                  parentLayoutID,
                  propertiesKeys[j],
                  properties[prototypeKeys[i]][group["name"]][
                    propertiesKeys[j]
                  ],
                  isOwn
                );
              }
            } catch (e) {}
          }
        };
        DrawPropertiesByGroup = function (
          parrentLayoutID,
          group,
          properties,
          isOwn
        ) {
          let propertiesButtonLayout = new widgetsComponentsTypes[
            "layoutHorizontal"
          ]();
          propertiesButtonLayout.width = "500px";
          let btn;
          if (isOwn) {
            btn = AddButtonInLayout(
              propertiesButtonLayout.id,
              "Own Properties",
              function () {}
            );
          } else {
            btn = AddButtonInLayout(
              propertiesButtonLayout.id,
              "Prototypes Properties",
              function () {}
            );
          }
          ReactComponent[btn["button"]].textColor = "#123456";
          ReactComponent[parrentLayoutID].includeWidget(
            ReactComponent[propertiesButtonLayout.id]
          );

          let propertiesListLayout = new widgetsComponentsTypes[
            "layoutHorizontal"
          ]();
          propertiesListLayout.width = "500px";

          let propertiesList = new widgetsComponentsTypes["layoutVertical"]();
          propertiesList.controlChildrenHorizontalAlignType(3);
          DrawPropertiesList(propertiesList.id, group, properties, isOwn);
          ReactComponent[propertiesListLayout.id].includeWidget(
            ReactComponent[propertiesList.id]
          );
          ReactComponent[parrentLayoutID].includeWidget(
            ReactComponent[propertiesListLayout.id]
          );
          return {
            propertiesList: propertiesList.id,
          };
        };
        DrawLabelWithInput = function (ParentLayoutID, Name, Value) {
          let layout = new widgetsComponentsTypes["layoutHorizontal"]();
          layout.width = "500px";
          let label = new widgetsComponentsTypes["label"]();
          label.text = Name;
          label.height = "70px";
          let input = new widgetsComponentsTypes["input"]();
          input.text = Value;
          ReactComponent[layout.id].includeWidget(ReactComponent[label.id]);
          ReactComponent[layout.id].includeWidget(ReactComponent[input.id]);
          ReactComponent[ParentLayoutID].includeWidget(
            ReactComponent[layout.id]
          );
          return {
            layout: layout.id,
            label: label.id,
            input: input.id,
          };
        };
        AddButtonInLayout = function (ParentLayoutID, Text, callback) {
          let button = new widgetsComponentsTypes["button"]();
          button.text = Text;
          button.htmlElement.addEventListener("click", callback);

          ReactComponent[ParentLayoutID].includeWidget(
            ReactComponent[button.id]
          );

          return {
            button: button.id,
          };
        };

        // ObjectSettings (name, desc, wiki)

        let objectsettingslayout = new widgetsComponentsTypes[
          "layoutVertical"
        ]();
        objectsettingslayout.width = "500px";
        DrawLabelWithInput(objectsettingslayout.id, "Name", object["name"]);
        DrawLabelWithInput(
          objectsettingslayout.id,
          "Description",
          object["description"]
        );
        DrawLabelWithInput(objectsettingslayout.id, "Wiki", object["wiki"]);
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[objectsettingslayout.id]
        );

        let propertiesGroupLayout = new widgetsComponentsTypes[
          "layoutHorizontal"
        ]();
        propertiesGroupLayout.width = "500px";
        DrawMenuChooseGroup(propertiesGroupLayout.id);
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[propertiesGroupLayout.id]
        );

        let ownPropertiesLayout = new widgetsComponentsTypes[
          "layoutVertical"
        ]();
        ownPropertiesLayout.width = "500px";
        ownPropertiesList = DrawPropertiesByGroup(
          ownPropertiesLayout.id,
          currentGroup,
          ownProperties,
          true
        )["propertiesList"];

        let prototypePropertiesLayout = new widgetsComponentsTypes[
          "layoutVertical"
        ]();
        prototypePropertiesLayout.width = "500px";
        prototypePropertiesList = DrawPropertiesByGroup(
          prototypePropertiesLayout.id,
          currentGroup,
          prototypeProperties,
          false
        )["propertiesList"];

        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[ownPropertiesLayout.id]
        );
        ReactComponent[mainlayout.id].includeWidget(
          ReactComponent[prototypePropertiesLayout.id]
        );

        console.log(object);

        break;
      }
    }
    return returned;
  }
  GeneratePropertiesGroups() {
    let groups = {
      0: "ALL",
      1: "Characteristics",
      2: "Image",
      3: "Image2",
      4: "Image3",
      5: "Image4",
      6: "Image5",
      7: "Image6",
    };
    Object.freeze(groups);
    return groups;
  }
  OpenPropertyEditor(groups, openCreateHandler, saveObjectHandler) {
    const _groups = {};

    //let currentActiveButton = null;

    let GeneratePropertiesGroup = function (groups) {
      let groupKeys;
      try {
        groupKeys = Object.keys(groups);
      } catch (e) {
        groupKeys = [];
      }
      for (let i = 0; i < groupKeys.length; i++) {
        _groups[i] = {};
        _groups[i]["name"] = groups[groupKeys[i]];
        _groups[i]["widget"] = null;
      }
    };

    /**
     *  Функция для создание layout
     *
     * @param {String} parentLayoutID
     * @param {*} type layoutVertical/layoutHorizontal
     * @param {string} [style={ width: "700px", height: "50px" }]
     * @return {String} ID of created layout
     */
    let DrawLayout = function (
      parentLayoutID,
      type,
      style = { width: "700px", height: "50px" }
    ) {
      if (type !== "layoutVertical" && type !== "layoutHorizontal") {
        console.error("openPropertyEditor: Error #1");
      }

      const layout = new widgetsComponentsTypes[type]();

      const styleProperties = Object.keys(style);
      for (let i = 0; i < styleProperties.length; i++)
        ReactComponent[layout.id][styleProperties[i]] =
          style[styleProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[layout.id]);
      return layout.id;
    };

    let DrawLabelWithInput = function (
      parentLayoutID,
      name,
      value = "",
      styleLabel = {},
      styleInput = {}
    ) {
      const label = new widgetsComponentsTypes["label"]();
      label.text = name;
      const styleLabelProperties = Object.keys(styleLabel);
      for (let i = 0; i < styleLabelProperties.length; i++)
        ReactComponent[label.id][styleLabelProperties[i]] =
          style[styleLabelProperties[i]];

      const input = new widgetsComponentsTypes["input"]();
      input.text = value;
      const styleInputProperties = Object.keys(styleInput);
      for (let i = 0; i < styleInputProperties.length; i++)
        ReactComponent[label.id][styleInputProperties[i]] =
          style[styleInputProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[label.id]);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[input.id]);
      return { label: label.id, input: input.id };
    };

    let AddButtonInLayout = function (
      parentLayoutID,
      name,
      style = {},
      callback = null
    ) {
      //debugger;
      const button = new widgetsComponentsTypes["button"]();
      button.text = name;

      const styleProperties = Object.keys(style);
      for (let i = 0; i < styleProperties.length; i++)
        ReactComponent[button.id][styleProperties[i]] =
          style[styleProperties[i]];

      button.htmlElement.addEventListener("click", callback);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[button.id]);
      return button.id;
    };

    let DrawChoisePropertyMenu = function (parentLayoutID) {
      const groupKeys = Object.keys(_groups);
      for (let i = 0; i < groupKeys.length; i++) {
        const button = AddButtonInLayout(parentLayoutID, i, {
          textColor: "#123456",
        });
        _groups[groupKeys[i]]["widget"] = button;
        _groups[groupKeys[i]]["isSelected"] = false;
        ReactComponent[button].hint = _groups[groupKeys[i]]["name"];
      }
      ReactComponent[_groups[groupKeys[0]]["widget"]].background = "grey";
      _groups[groupKeys[0]]["isSelected"] = true;
    };

    let ReturnButtonsWidget = function (groups) {
      const ret = {};
      const groupKeys = Object.keys(groups);
      for (let i = 0; i < groupKeys.length; i++)
        ret[groups[groupKeys[i]]["name"]] = {
          widget: groups[groupKeys[i]]["widget"],
          isSelected: groups[groupKeys[i]]["isSelected"],
        };
      return ret;
    };

    GeneratePropertiesGroup(groups);

    const dialog = new widgetsComponentsTypes["dialog"]();
    const mainlayout = DrawLayout(dialog.id, "layoutVertical");

    const descobject = DrawLayout(mainlayout, "layoutVertical");

    const name = DrawLabelWithInput(
      DrawLayout(descobject, "layoutHorizontal"),
      "Name"
    );
    const desc = DrawLabelWithInput(
      DrawLayout(descobject, "layoutHorizontal"),
      "Description"
    );
    const wiki = DrawLabelWithInput(
      DrawLayout(descobject, "layoutHorizontal"),
      "Wiki"
    );

    DrawChoisePropertyMenu(DrawLayout(mainlayout, "layoutHorizontal"));

    const ownPropertiesLayout = DrawLayout(mainlayout, "layoutVertical");
    const ownPropertiesButtonLayout = DrawLayout(
      ownPropertiesLayout,
      "layoutHorizontal"
    );
    AddButtonInLayout(
      ownPropertiesButtonLayout,
      "Own Properties",
      { textColor: "#123456" },
      null
    );
    AddButtonInLayout(
      ownPropertiesButtonLayout,
      "+",
      { textColor: "#123456" },
      () => {
        Module.Store.dispatch({
          eventName: openCreateHandler,
          value: groups,
        });
      }
    );

    const ownPropertiesList = DrawLayout(
      DrawLayout(ownPropertiesLayout, "layoutHorizontal"),
      "layoutVertical"
    );
    ReactComponent[ownPropertiesList].controlChildrenHorizontalAlignType(3);

    const prototypePropertiesLayout = DrawLayout(mainlayout, "layoutVertical");
    AddButtonInLayout(
      DrawLayout(prototypePropertiesLayout, "layoutHorizontal"),
      "PrototypeProperties",
      { textColor: "#123456" },
      null
    );
    const prototypePropertiesList = DrawLayout(
      DrawLayout(prototypePropertiesLayout, "layoutHorizontal"),
      "layoutVertical"
    );
    ReactComponent[prototypePropertiesList].controlChildrenHorizontalAlignType(
      3
    );

    const btnslayout = DrawLayout(mainlayout, "layoutHorizontal");
    AddButtonInLayout(btnslayout, "Сохранить", { textColor: "#123456" }, () => {
      ReactComponent[dialog.id].clearWidget();
      ReactComponent[dialog.id].htmlElement.remove();
      delete ReactComponent[dialog.id];

      Module.Store.dispatch({
        eventName: saveObjectHandler,
        value: {
          name: ReactComponent[name["input"]].inputElement.value,
          desc: ReactComponent[desc["input"]].inputElement.value,
          wiki: ReactComponent[wiki["input"]].inputElement.value,
        },
      });
    });

    AddButtonInLayout(btnslayout, "Отмена", { textColor: "#123456" }, () => {
      ReactComponent[dialog.id].clearWidget();
      ReactComponent[dialog.id].htmlElement.remove();
      delete ReactComponent[dialog.id];
    });

    console.log(_groups);

    return {
      dialog: dialog.id,
      buttons: ReturnButtonsWidget(_groups),
      inputs: {
        name: name["input"],
        desc: desc["input"],
        wiki: wiki["input"],
      },
      ownPropertiesList: ownPropertiesList,
      prototypePropertiesList: prototypePropertiesList,
    };
  }

  FillObjectData(data, inputs) {
    data = {
      name: "TestName",
      desc: "TestDesc",
      wiki: "wiki.ru",
    };
    if (
      !inputs.hasOwnProperty("name") ||
      !inputs.hasOwnProperty("desc") ||
      !inputs.hasOwnProperty("wiki")
    ) {
      console.error("FillObjectData. Error #1");
      return;
    }
    ReactComponent[inputs["name"]].text = data["name"];
    ReactComponent[inputs["desc"]].text = data["desc"];
    ReactComponent[inputs["wiki"]].text = data["wiki"];
  }

  InterpretationProperties(
    objectPrototypeProperties,
    prototypesProperties,
    Groups
  ) {
    objectPrototypeProperties = [
      {
        ID: "newPrototype",
        properties: {},
      },
    ];
    prototypesProperties = [
      {
        ID: "5ce777ef9ddcac72773c1a47",
        properties: {
          "пжлст!!12": {
            value: {
              valueTo: 0.005,
              valueFrom: 0.005,
            },
            category: "Characteristics",
            prototypeID: "5ce777ef9ddcac72773c1a47",
            ptype: "double",
            counter: 11,
            prop_ref: {
              $oid: "5cebacd47744766dd37a2148",
            },
          },
          Weight: {
            value: {
              valueTo: 6,
              valueFrom: 2,
            },
            category: "Image",
            prototypeID: "5ce777ef9ddcac72773c1a47",
            ptype: "double",
            counter: 27,
            prop_ref: {
              $oid: "5a0987cbd9ce171c30451879",
            },
          },
        },
      },
      {
        ID: "5d2c03499ddcac1522795dae",
        properties: {},
      },
    ];

    let GeneratePropertiesInRightFormat = function (properties) {
      let rightProperties = [];
      for (let i = 0; i < properties.length; i++) {
        rightProperties[properties[i]["ID"]] = properties[i]["properties"];
      }
      return rightProperties;
    };
    let SeparatePropertyByGroups = function (properties) {
      let separatedPropertiesByGroups = [];
      const prototypeKeys = Object.keys(properties);
      for (
        let prototypeID = 0;
        prototypeID < prototypeKeys.length;
        prototypeID++
      ) {
        separatedPropertiesByGroups[prototypeKeys[prototypeID]] = [];

        const propertyKeys = Object.keys(
          properties[prototypeKeys[prototypeID]]
        );
        for (
          let propertyID = 0;
          propertyID < propertyKeys.length;
          propertyID++
        ) {
          for (
            let groupID = 0;
            groupID < Object.keys(Groups).length;
            groupID++
          ) {
            const groupName = Groups[groupID];

            if (
              !separatedPropertiesByGroups[
                prototypeKeys[prototypeID]
              ].hasOwnProperty(groupName)
            )
              separatedPropertiesByGroups[prototypeKeys[prototypeID]][
                groupName
              ] = {};
            console.log(propertyKeys[propertyID]);
            if (groupName === "ALL") {
              //debugger;
              separatedPropertiesByGroups[prototypeKeys[prototypeID]][
                groupName
              ][propertyKeys[propertyID]] =
                properties[prototypeKeys[prototypeID]][
                  propertyKeys[propertyID]
                ];
              /*separatedPropertiesByGroups[prototypeKeys[prototypeID]][groupName][propertyKeys[propertyID]] = {
                                "value" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["value"],
                                "category" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["category"]
                            };*/
              continue;
            }
            if (
              groupName ===
              properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]][
                "category"
              ]
            ) {
              separatedPropertiesByGroups[prototypeKeys[prototypeID]][
                groupName
              ][propertyKeys[propertyID]] =
                properties[prototypeKeys[prototypeID]][
                  propertyKeys[propertyID]
                ];
              /*separatedPropertiesByGroups[prototypeKeys[prototypeID]][groupName][propertyKeys[propertyID]] = {
                                "value" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["value"],
                                "category" : properties[prototypeKeys[prototypeID]][propertyKeys[propertyID]]["category"]
                            };*/
              break;
            }
          }
        }
      }
      return separatedPropertiesByGroups;
    };
    let RemoveRepeateProperties = function (
      ownProperties,
      prototypeProperties
    ) {
      const ownPrototypeKeys = Object.keys(ownProperties);
      if (
        typeof ownPrototypeKeys === "undefined" ||
        ownPrototypeKeys.length === 0
      )
        return;
      if (!ownProperties[ownPrototypeKeys[0]].hasOwnProperty(Groups[0])) return;
      const ownPropertyKeys = Object.keys(
        ownProperties[ownPrototypeKeys[0]][Groups[0]]
      );

      for (let i = 0; i < ownPropertyKeys.length; i++) {
        const prototypeID =
          ownProperties[ownPrototypeKeys[0]][Groups[0]][ownPropertyKeys[i]][
            "prototypeID"
          ];
        const category =
          ownProperties[ownPrototypeKeys[0]][Groups[0]][ownPropertyKeys[i]][
            "category"
          ];

        delete prototypeProperties[prototypeID][Groups[0]][ownPropertyKeys[i]];
        delete prototypeProperties[prototypeID][category][ownPropertyKeys[i]];
      }
    };

    let ownProperties;
    let prototypeProperties;

    ownProperties = SeparatePropertyByGroups(
      GeneratePropertiesInRightFormat(objectPrototypeProperties)
    );
    prototypeProperties = SeparatePropertyByGroups(
      GeneratePropertiesInRightFormat(prototypesProperties)
    );
    RemoveRepeateProperties(ownProperties, prototypeProperties);

    return {
      object: ownProperties,
      prototypes: prototypeProperties,
    };
  }

  FillObjectProperties(
    ownList,
    prototypeList,
    objectProperties,
    prototypeProperties,
    groupName
  ) {
    let DrawLayout = function (
      parentLayoutID,
      type,
      style = { width: "700px", height: "50px" }
    ) {
      if (type !== "layoutVertical" && type !== "layoutHorizontal") {
        console.error("openPropertyEditor: Error #1");
      }

      const layout = new widgetsComponentsTypes[type]();

      const styleProperties = Object.keys(style);
      for (let i = 0; i < styleProperties.length; i++)
        ReactComponent[layout.id][styleProperties[i]] =
          style[styleProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[layout.id]);
      return layout.id;
    };

    let DrawLabelWithInput = function (
      parentLayoutID,
      name,
      value = "",
      styleLabel = {},
      styleInput = {}
    ) {
      const label = new widgetsComponentsTypes["label"]();
      label.text = name;
      const styleLabelProperties = Object.keys(styleLabel);
      for (let i = 0; i < styleLabelProperties.length; i++)
        ReactComponent[label.id][styleLabelProperties[i]] =
          style[styleLabelProperties[i]];

      const input = new widgetsComponentsTypes["input"]();
      input.text = value;
      const styleInputProperties = Object.keys(styleInput);
      for (let i = 0; i < styleInputProperties.length; i++)
        ReactComponent[label.id][styleInputProperties[i]] =
          style[styleInputProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[label.id]);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[input.id]);
      return { label: label.id, input: input.id };
    };

    let AddButtonInLayout = function (
      parentLayoutID,
      name,
      style = {},
      callback = null
    ) {
      //debugger;
      const button = new widgetsComponentsTypes["button"]();
      button.text = name;

      const styleProperties = Object.keys(style);
      for (let i = 0; i < styleProperties.length; i++)
        ReactComponent[button.id][styleProperties[i]] =
          style[styleProperties[i]];

      button.htmlElement.addEventListener("click", callback);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[button.id]);
      return button.id;
    };

    let AddItemInPropertyList = function (
      propertyListID,
      propertyName,
      property,
      isOwn
    ) {
      const layout = DrawLayout(propertyListID, "layoutHorizontal", {
        width: "700px",
        minHeight: "70px",
      });
      if (isOwn) {
        DrawLabelWithInput(layout, propertyName, "test");
        const btn = AddButtonInLayout(layout, "");
        ReactComponent[btn].htmlElement.innerHTML = "&#9998;";
        AddButtonInLayout(layout, "-", { textColor: "#123456" }, () => {
          ReactComponent[ownList].deleteWidget(ReactComponent[layout]);

          const category = property["category"];
          const prototypeID = property["prototypeID"];

          delete objectProperties[Object.keys(objectProperties)[0]]["ALL"][
            propertyName
          ];
          delete objectProperties[Object.keys(objectProperties)[0]][category][
            propertyName
          ];

          if (Object.keys(objectProperties)[0] === prototypeID) {
            console.log("Свое свойство");
            return;
          }

          if (!prototypeProperties[prototypeID].hasOwnProperty("ALL"))
            prototypeProperties[prototypeID]["ALL"] = {};

          if (!prototypeProperties[prototypeID].hasOwnProperty(category))
            prototypeProperties[prototypeID][category] = {};

          prototypeProperties[prototypeID]["ALL"][propertyName] = property;
          prototypeProperties[prototypeID][category][propertyName] = property;

          AddItemInPropertyList(prototypeList, propertyName, property, false);
          console.log("objectProperties", objectProperties);
          console.log("prototypeProperties", prototypeProperties);
        });
      } else {
        DrawLabelWithInput(layout, propertyName, "");
        AddButtonInLayout(layout, "+", { textColor: "#123456" }, () => {
          ReactComponent[prototypeList].deleteWidget(ReactComponent[layout]);
          AddItemInPropertyList(ownList, propertyName, property, true);

          //debugger;
          const category = property["category"];
          const prototypeID = property["prototypeID"];

          delete prototypeProperties[prototypeID]["ALL"][propertyName];
          delete prototypeProperties[prototypeID][category][propertyName];

          if (
            !objectProperties[Object.keys(objectProperties)[0]].hasOwnProperty(
              "ALL"
            )
          )
            objectProperties[Object.keys(objectProperties)[0]]["ALL"] = {};

          if (
            !objectProperties[Object.keys(objectProperties)[0]].hasOwnProperty(
              category
            )
          )
            objectProperties[Object.keys(objectProperties)[0]][category] = {};

          objectProperties[Object.keys(objectProperties)[0]]["ALL"][
            propertyName
          ] = property;
          objectProperties[Object.keys(objectProperties)[0]][category][
            propertyName
          ] = property;

          console.log("objectProperties", objectProperties);
          console.log("prototypeProperties", prototypeProperties);
        });
      }
    };

    let ClearList = function (propertyListID) {
      ReactComponent[propertyListID].clearWidget();
    };

    let DrawItems = function (propertyListID, properties, groupName, isOwn) {
      //debugger;
      const prototypeKeys = Object.keys(properties);
      for (
        let prototypeID = 0;
        prototypeID < prototypeKeys.length;
        prototypeID++
      ) {
        if (!properties[prototypeKeys[prototypeID]].hasOwnProperty(groupName))
          continue;
        const propertyKeys = Object.keys(
          properties[prototypeKeys[prototypeID]][groupName]
        );
        for (
          let propertyID = 0;
          propertyID < propertyKeys.length;
          propertyID++
        ) {
          AddItemInPropertyList(
            propertyListID,
            propertyKeys[propertyID],
            properties[prototypeKeys[prototypeID]][groupName][
              propertyKeys[propertyID]
            ],
            isOwn
          );
        }
      }
    };

    ClearList(ownList);
    ClearList(prototypeList);

    DrawItems(ownList, objectProperties, groupName, true);
    DrawItems(prototypeList, prototypeProperties, groupName, false);
  }

  getPatternIDs(propertyList) {
    console.log("propertyList", propertyList);
    return Object.keys(propertyList);
  }

  SetHandlerSwitchGroup(
    btns,
    handler,
    ownList,
    prototypeList,
    ownProperties,
    prototypeProperties
  ) {
    const btnKeys = Object.keys(btns);
    for (let btni = 0; btni < btnKeys.length; btni++) {
      ReactComponent[
        btns[btnKeys[btni]]["widget"]
      ].htmlElement.addEventListener("click", () => {
        ReactComponent[btns[btnKeys[btni]]["widget"]].background = "grey";
        btns[btnKeys[btni]]["isSelected"] = true;
        const data = {
          groupName: btnKeys[btni],
          ownList: ownList,
          prototypeList: prototypeList,
          objectProperties: ownProperties,
          prototypeProperties: prototypeProperties,
          btns: btns,
        };
        Module.Store.dispatch({
          eventName: handler,
          value: data,
        });
      });
    }
  }
  SwitchBtnBackground(groupName, btns) {
    const btnKeys = Object.keys(btns);
    for (let btni = 0; btni < btnKeys.length; btni++) {
      if (btns[btnKeys[btni]]["isSelected"]) {
        ReactComponent[btns[btnKeys[btni]]["widget"]].background = "none";
        btns[btnKeys[btni]]["isSelected"] = false;
      }
    }
    btns[groupName]["isSelected"] = true;
    ReactComponent[btns[groupName]["widget"]].background = "grey";
  }

  OpenPropertyCreate(types, themes, groups, prototypeID, addPropertyHandler) {
    let DrawLayout = function (
      parentLayoutID,
      type,
      style = { width: "700px", height: "50px" }
    ) {
      if (type !== "layoutVertical" && type !== "layoutHorizontal") {
        console.error("openPropertyEditor: Error #1");
      }

      const layout = new widgetsComponentsTypes[type]();

      const styleProperties = Object.keys(style);
      for (let i = 0; i < styleProperties.length; i++)
        ReactComponent[layout.id][styleProperties[i]] =
          style[styleProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[layout.id]);
      return layout.id;
    };

    let DrawLabelWithInput = function (
      parentLayoutID,
      name,
      value = "",
      styleLabel = {},
      styleInput = {}
    ) {
      const label = new widgetsComponentsTypes["label"]();
      label.text = name;
      const styleLabelProperties = Object.keys(styleLabel);
      for (let i = 0; i < styleLabelProperties.length; i++)
        ReactComponent[label.id][styleLabelProperties[i]] =
          style[styleLabelProperties[i]];

      const input = new widgetsComponentsTypes["input"]();
      input.text = value;
      const styleInputProperties = Object.keys(styleInput);
      for (let i = 0; i < styleInputProperties.length; i++)
        ReactComponent[label.id][styleInputProperties[i]] =
          style[styleInputProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[label.id]);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[input.id]);
      return { label: label.id, input: input.id };
    };

    let AddButtonInLayout = function (
      parentLayoutID,
      name,
      style = {},
      callback = null
    ) {
      //debugger;
      const button = new widgetsComponentsTypes["button"]();
      button.text = name;

      const styleProperties = Object.keys(style);
      for (let i = 0; i < styleProperties.length; i++)
        ReactComponent[button.id][styleProperties[i]] =
          style[styleProperties[i]];

      button.htmlElement.addEventListener("click", callback);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[button.id]);
      return button.id;
    };

    let DrawLabelWithCombobox = function (
      parentLayoutID,
      name,
      comboboxlist,
      labelstyle = {},
      comboboxstyle = {}
    ) {
      const label = new widgetsComponentsTypes["label"]();
      label.text = name;

      const styleLabelProperties = Object.keys(labelstyle);
      for (let i = 0; i < styleLabelProperties.length; i++)
        ReactComponent[label.id][styleLabelProperties[i]] =
          labelstyle[styleLabelProperties[i]];

      const combobox = new widgetsComponentsTypes["comboBox"]();

      for (let i = 0; i < comboboxlist.length; i++) {
        ReactComponent[combobox.id].addItem(
          comboboxlist[i]["text"],
          comboboxlist[i]["callback"]
        );
      }

      const styleComboboxProperties = Object.keys(comboboxstyle);
      for (let i = 0; i < styleComboboxProperties.length; i++)
        ReactComponent[combobox.id][styleComboboxProperties[i]] =
          comboboxstyle[styleComboboxProperties[i]];

      ReactComponent[parentLayoutID].includeWidget(ReactComponent[label.id]);
      ReactComponent[parentLayoutID].includeWidget(ReactComponent[combobox.id]);
      return { label: label.id, combobox: combobox.id };
    };

    types = {
      Number: {
        ru: "Числовой",
        en: "Number",
      },
      String: {
        ru: "Строчный",
        en: "String",
      },
      Bool: {
        ru: "Логический",
        en: "Boolean",
      },
    };
    themes = {
      Weight: {
        ru: "Вес",
        en: "Weigth",
      },
      Sizes: {
        ru: "Размеры",
        en: "Sizes",
      },
    };

    const typearray = Object.keys(types)
      .map((i) => {
        return types[i]["ru"];
      })
      .map((i) => {
        return { text: i, callback: null };
      });
    const grouparray = Object.values(groups)
      .filter((i) => {
        return i !== "ALL";
      })
      .map((i) => {
        return { text: i, callback: null };
      });

    const dialog = new widgetsComponentsTypes["dialog"]();
    const mainlayout = DrawLayout(dialog.id, "layoutVertical", {
      width: "700px",
    });
    const propertydata = DrawLayout(mainlayout, "layoutVertical", {
      width: "700px",
    });
    const nameInput = DrawLabelWithInput(
      DrawLayout(propertydata, "layoutHorizontal"),
      "Name",
      ""
    )["input"];
    const wikiInput = DrawLabelWithInput(
      DrawLayout(propertydata, "layoutHorizontal"),
      "Wiki",
      ""
    )["input"];

    const categorybox = DrawLabelWithCombobox(
      DrawLayout(mainlayout, "layoutHorizontal"),
      "Category",
      grouparray
    )["combobox"];
    const typebox = DrawLabelWithCombobox(
      DrawLayout(mainlayout, "layoutHorizontal"),
      "Type",
      typearray
    )["combobox"];

    const valueInput = DrawLabelWithInput(
      DrawLayout(mainlayout, "layoutHorizontal"),
      "Value",
      ""
    )["input"];

    const btnlayout = DrawLayout(mainlayout, "layoutHorizontal");
    AddButtonInLayout(btnlayout, "Добавить", { textColor: "#123456" }, () => {
      let name = ReactComponent[nameInput].inputElement.value;
      let wiki = ReactComponent[wikiInput].inputElement.value;
      let errors = [];
      if (name.length < 3) errors.push("Name must be more then 3 characters");
      if (wiki.length < 3) errors.push("Wiki must be more then 3 characters");

      let category;
      try {
        category = ReactComponent[categorybox].getSelectedItemText();
      } catch (e) {
        errors.push("Chouse category");
      }
      let type;
      try {
        type = ReactComponent[typebox].getSelectedItemText();
      } catch (e) {
        errors.push("Chouse type");
      }
      let value = ReactComponent[valueInput].inputElement.value;
      if (errors.length) {
        for (let error of errors) {
          APP.log("error", error);
        }
        return;
      }
      const obj = {
        name: name,
        wiki: wiki,
        category: category,
        type: Object.keys(types)
          .map((i) => {
            if (types[i]["ru"] === type) return i;
          })
          .filter((i) => {
            return i;
          })[0],
        prototypeID: prototypeID,
        propID: "newProp",
        value: value,
      };
      ReactComponent[dialog.id].clearWidget();
      ReactComponent[dialog.id].htmlElement.remove();
      delete ReactComponent[dialog.id];

      return Module.Store.dispatch({
        eventName: addPropertyHandler,
        value: obj,
      });
    });
    AddButtonInLayout(btnlayout, "Отменить", { textColor: "#123456" }, () => {
      ReactComponent[dialog.id].clearWidget();
      ReactComponent[dialog.id].htmlElement.remove();
      delete ReactComponent[dialog.id];
    });
  }
  addOwnPropertyToPropertyList(propertyList, property) {
    console.log("1", propertyList);
    const prototypeID = Object.keys(propertyList)[0];

    if (
      propertyList[prototypeID].hasOwnProperty("ALL") &&
      propertyList[prototypeID]["ALL"].hasOwnProperty(property["name"])
    ) {
      APP.log("error", "Данное свойство уже присутсвует");
      return;
    }

    if (!propertyList[prototypeID].hasOwnProperty("ALL"))
      propertyList[prototypeID]["ALL"] = {};
    if (!propertyList[prototypeID].hasOwnProperty(property["category"]))
      propertyList[prototypeID][property["category"]] = {};

    const propertyName = property["name"];
    delete property["name"];
    propertyList[prototypeID]["ALL"][propertyName] = property;
    propertyList[prototypeID][property["category"]][propertyName] = property;
    console.log("2", propertyList);
  }

  saveProperty22(property, properties, event) {
    console.log("handler", event);
    let insert = function (json) {
      property["propID"] = json["inserted_id"]["$oid"];
      console.log("inserted");
      console.log("handler2", event);
      setTimeout(() => {
        Module.Store.dispatch({
          eventName: event,
          value: properties,
        });
      }, 0);
    };
    APP.dbWorker.responseDOLMongoRequest = insert;
    const objectData = {
      additional: {
        wiki: property["wiki"],
      },
      name: property["name"],
      meta: {
        r: ["ALL"],
        owner: {
          $oid: APP.owner,
        },
        pass_verification: false,
      },
      lang: "ru",
      type: property["type"],
      category: property["category"],
      counter: 0,
    };
    console.log("objectData", objectData);
    const request =
      "02rc00{" +
      '"v": "1.0",' +
      '"id": "DOLMongoRequest",' +
      '"tokens": {' +
      '	"token_long": "' +
      APP.dbWorker.m_long_token +
      '",' +
      '	"token_short": "' +
      APP.dbWorker.m_short_token +
      '"' +
      "}," +
      '"cmd": {' +
      '	"insert": "props",' +
      '	"documents": [' +
      JSON.stringify(objectData) +
      "]" +
      "	}}0f0f0f0f";
    console.log(request);
    APP.dbWorker.m_socket.send(request);
  }
  PrepareObjectToSaveDB(objectID, objectData, objectProperties, prototypeIDs) {
    console.log(objectData);
    console.log(objectProperties);

    const prototype = {};
    const prototypeID = Object.keys(objectProperties)[0];
    prototype["ID"] = prototypeID;
    prototype["properties"] = {};
    prototype["ParentsID"] = [];
    for (let i = 0; i < prototypeIDs.length; i++) {
      prototype["ParentsID"].push(prototypeIDs[i]);
    }
    const object = {};
    object["ID"] = objectID;
    object["Name"] = objectData["name"];
    object["Desc"] = objectData["desc"];
    object["Wiki"] = objectData["wiki"];
    object["PrototypeID"] = prototypeID;
    object["properties"] = {};
    if (!objectProperties[prototypeID].hasOwnProperty("ALL"))
      return { object: object, prototype: prototype };
    const propertyKeys = Object.keys(objectProperties[prototypeID]["ALL"]);
    for (let i = 0; i < propertyKeys.length; i++) {
      let property = {};
      property["category"] =
        objectProperties[prototypeID]["ALL"][propertyKeys[i]]["category"];
      property["prototypeID"] =
        objectProperties[prototypeID]["ALL"][propertyKeys[i]]["prototypeID"];
      property["ptype"] =
        objectProperties[prototypeID]["ALL"][propertyKeys[i]]["type"];
      property["prop_ref"] =
        objectProperties[prototypeID]["ALL"][propertyKeys[i]]["propID"];

      let pr = {};
      pr["prop_ref"] =
        objectProperties[prototypeID]["ALL"][propertyKeys[i]]["propID"];
      pr["value"] =
        objectProperties[prototypeID]["ALL"][propertyKeys[i]]["value"];

      prototype["properties"][propertyKeys[i]] = property;
      object["properties"][propertyKeys[i]] = pr;
    }
    return { object: object, prototype: prototype };
  }
  findNewedProperties(propertyList) {
    const prototypeID = Object.keys(propertyList)[0];
    if (!propertyList[prototypeID].hasOwnProperty("ALL")) return;
    const propertyKeys = Object.keys(propertyList[prototypeID]["ALL"]);
    const newProperties = [];
    for (let i = 0; i < propertyKeys.length; i++) {
      if (
        propertyList[prototypeID]["ALL"][propertyKeys[i]]["propID"] ===
        "newProp"
      ) {
        propertyList[prototypeID]["ALL"][propertyKeys[i]]["name"] =
          propertyKeys[i];
        newProperties.push(propertyList[prototypeID]["ALL"][propertyKeys[i]]);
      }
    }
    return newProperties;
  }
  savePrototype(object, prototype, handler) {
    let saved = function (json) {
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    let inserted = function (json) {
      prototype["ID"] = json["inserted_id"]["$oid"];
      object["PrototypeID"] = prototype["ID"];
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    const objectData = {
      additional: {
        wiki: "wiki for prototype",
      },

      meta: {
        owner: {
          $oid: APP.owner,
        },
        name: "name for prototype",
        description: "description for protype",
      },
      schema: {
        parentsID: prototype["ParentsID"],
        properties: prototype["properties"],
      },
    };
    console.log("objectData", objectData);
    let request;
    if (prototype["ID"] === "newPrototype") {
      request =
        "02rc00{" +
        '"v": "1.0",' +
        '"id": "DOLMongoRequest",' +
        '"tokens": {' +
        '	"token_long": "' +
        APP.dbWorker.m_long_token +
        '",' +
        '	"token_short": "' +
        APP.dbWorker.m_short_token +
        '"' +
        "}," +
        '"cmd": {' +
        '	"insert": "patterns",' +
        '	"documents": [' +
        JSON.stringify(objectData) +
        "]" +
        "	}}0f0f0f0f";
      APP.dbWorker.responseDOLMongoRequest = inserted;
    } else {
      request =
        "02rc00{" +
        '"v": "1.0",' +
        '"id": "DOLMongoRequest",' +
        '"tokens": {' +
        '	"token_long": "' +
        APP.dbWorker.m_long_token +
        '",' +
        '	"token_short": "' +
        APP.dbWorker.m_short_token +
        '"' +
        "}," +
        '"cmd": {' +
        '	"update": "patterns",' +
        '   "updates": [{' +
        '   "q": "_id" : {"$oid" : "' +
        prototype["ID"] +
        '"},' +
        '	"u": ' +
        JSON.stringify(objectData) +
        "   }]" +
        "	}}0f0f0f0f";
      APP.dbWorker.responseDOLMongoRequest = saved;
    }
    console.log(request);
    APP.dbWorker.m_socket.send(request);
  }
  saveObject(object, handler) {
    let saved = function (json) {
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    let inserted = function (json) {
      object["ID"] = json["inserted_id"]["$oid"];
      Module.Store.dispatch({
        eventName: handler,
        value: null,
      });
    };
    const objectData = {
      additional: {
        wiki_ref: object["Wiki"],
      },

      meta: {
        r: "ALL",
        w: { $oid: APP.owner },
        owner: {
          $oid: APP.owner,
        },
        name: object["Name"],
        description: object["Desc"],
        pattern: { $oid: object["PrototypeID"] },
      },
      object: {
        properties: object["properties"],
      },
    };
    console.log("objectData", objectData);
    let request;
    if (object["ID"] === "newObject") {
      request =
        "02rc00{" +
        '"v": "1.0",' +
        '"id": "DOLMongoRequest",' +
        '"tokens": {' +
        '	"token_long": "' +
        APP.dbWorker.m_long_token +
        '",' +
        '	"token_short": "' +
        APP.dbWorker.m_short_token +
        '"' +
        "}," +
        '"cmd": {' +
        '	"insert": "objects",' +
        '	"documents": [' +
        JSON.stringify(objectData) +
        "]" +
        "	}}0f0f0f0f";
      APP.dbWorker.responseDOLMongoRequest = inserted;
    } else {
      request =
        "02rc00{" +
        '"v": "1.0",' +
        '"id": "DOLMongoRequest",' +
        '"tokens": {' +
        '	"token_long": "' +
        APP.dbWorker.m_long_token +
        '",' +
        '	"token_short": "' +
        APP.dbWorker.m_short_token +
        '"' +
        "}," +
        '"cmd": {' +
        '	"update": "objects",' +
        '   "updates": [{' +
        '   "q": "_id" : {"$oid" : "' +
        object["ID"] +
        '"},' +
        '	"u": ' +
        JSON.stringify(objectData) +
        "   }]" +
        "	}}0f0f0f0f";
      APP.dbWorker.responseDOLMongoRequest = saved;
    }
    console.log(request);
    APP.dbWorker.m_socket.send(request);
  }

  mqttConnect(connecthandler) {
    new MQTT_Manager(connecthandler);
  }
  mqttSendMessage(topic, msg) {
    if (!window.mqtt_client) return;
    window.mqtt_client.sendMessage(topic, msg);
  }
  mqttSubscribe(topic) {
    if (!window.mqtt_client) return;
    window.mqtt_client.subscribeTopic(topic);
  }
  mqttUnsubscribe(topic) {
    if (!window.mqtt_client) return;
    window.mqtt_client.unsubscribeTopic(topic);
  }
  mqttStartGetResponse(handler) {
    if (!window.mqtt_client) return;
    window.mqtt_client.startGetResponse(handler);
  }
  mqttStopGetResponse() {
    if (!window.mqtt_client) return;
    window.mqtt_client.stopGetResponse();
  }
  getDescription(object) {
    return;
  }

  setView(id, lon, lat, zoom) {
    const objectType = "map";
    const funcName = "setView";
    const parameters = { lon, lat, zoom };

    WidgetGeoMap.runGeoMethod(objectType, id, funcName, parameters);

    //let markerParameters = {lon, lat};

    //markerParameters = {position : markerParameters};

    //WidgetGeoMap.createObject('Marker', markerParameters);
    //WidgetGeoMap.createObject('PixelCircle', markerParameters);
    //WidgetGeoMap.addObjectOnMap(0, 'w_1');
    //WidgetGeoMap.addObjectOnMap(1, 'w_1');
  }

  addObjectOnMap(objectId, mapId) {
    WidgetGeoMap.addObjectOnMap(0, "w_1");
  }

  createTestObject(content, width, height) {
    // const id0 = WidgetGeoMap.objectId++;

    // let parameters0 = {

    //     GeoMapGeometry: {

    //         GeoMapObject: {

    //             GeoLayerObject: {

    //                 GeoObject: {
    //                     id: id0,
    //                     events: []
    //                 }
    //             },

    //             maps: []
    //         }
    //     }
    // };

    // WidgetGeoMap.createObject('Line', parameters0, id0);
    // WidgetGeoMap.addObjectOnMap(0, 'w_1');

    // const objectType = 'object';
    // const funcName = 'addPoint';

    // const parameters2 = { lon: 0, lat: 0 };

    // WidgetGeoMap.runGeoMethod(objectType, id0, funcName, parameters2);

    // const parameters3 = { lon: 10, lat: 0 };

    // WidgetGeoMap.runGeoMethod(objectType, id0, funcName, parameters3);

    // const parameters4 = { lon: 0, lat: 10 };

    // WidgetGeoMap.runGeoMethod(objectType, id0, funcName, parameters4);

    // const id = WidgetGeoMap.objectId++;

    // let parameters = {

    //     GeoStyle: {

    //         GeoObject: {
    //             id: id,
    //             events: []
    //         }
    //     }
    // };

    // WidgetGeoMap.createStyleObject('LineText', parameters, id);

    // const objectType2 = 'object';
    // const funcName2 = 'setText';
    // const parameters5 = 1;
    // // debugger;
    // WidgetGeoMap.runGeoMethod(objectType2, id0, funcName2, parameters5);

    // const objectType3 = 'style';
    // const funcName3 = 'setText';
    // const parameters6 = '#338800';
    // // debugger;
    // WidgetGeoMap.runGeoMethod(objectType3, id, funcName3, parameters6);

    // const id = WidgetGeoMap.objectId++;

    // let parameters = {

    //     GeoStyle: {

    //         GeoObject: {
    //             id: id,
    //             events: []
    //         }
    //     },

    //     color: color,
    //     size: size,
    //     family: family,
    //     weight: weight,
    //     style: style
    // };

    // WidgetGeoMap.createStyleObject('Font', parameters, id);

    // const objectType4 = 'style';
    // const funcName4 = 'setFont';
    // const parameters7 = id3;
    // // debugger;
    // WidgetGeoMap.runGeoMethod(objectType4, id, funcName4, parameters7);

    // // const parameters3 = { lon : 10, lat : 0};

    // // WidgetGeoMap.runGeoMethod(objectType, id, funcName, parameters3);

    // // const parameters4 = { lon : 0, lat : 10};

    // // WidgetGeoMap.runGeoMethod(objectType, id, funcName, parameters4);

    return id;
  }
}

var jspart = new JSPart();

var makeRequest = function (type, name, func, parameters) {
  let req = "";

  req +=
    'db.objects.insert([{"additional":{"image":"","wiki_ref":{"en":""},"category":[""]},"meta":{"Dll_object":true,"r":["All"],"name":"';
  req += name;

  req +=
    '","pattern":ObjectId("602e8135b0125500080c8192"),"owner":ObjectId("595ee3580469b6a6015312f0"),"description":"empty"},"object":{"inputs":';

  req +=
    '["id",' +
    parameters.map((x) => '"' + x + '"').toString() +
    '],"output":"","func":"';

  req +=
    func +
    " = function(id," +
    parameters.toString() +
    "){const objectType = '" +
    type +
    "'; const funcName = '" +
    func +
    "';";

  if (parameters.length > 1)
    req += "const parameters = {" + parameters.toString() + "};";
  else req += "const parameters = " + parameters.toString() + ";";

  req +=
    ' WidgetGeoMap.runGeoMethod(objectType, id, funcName, parameters);}","lib":ObjectId("606d7fa59367694607a3596a")}}])';

  return req;
};

var dbIns = function (str) {
  let res = "";

  let s1 = str.split("|");

  for (let s2 of s1) {
    let s3 = s2.split(";");

    let pars = [];

    if (typeof s3[3] != "undefined") pars = s3[3].split(",");

    res += makeRequest(s3[0], s3[1], s3[2], pars) + "\n\n";
  }

  console.log(res);
};

var mytol = function (str2) {
  let str = str2;
  for (let i = 0; i < str.length; ++i)
    if (str[i] == "," || str[i] == ";") {
      let lc = str[i + 1] + "";

      lc = lc.toLowerCase();

      str = str.substring(0, i + 1) + lc + str.substring(i + 2);
    }

  return str;
};
/*CreateProject = function(object, handler){
    
}*/
var inputFile = function (layout, readHandler) {
  const input = document.createElement("input");
  const data = {};
  input.type = "file";
  ReactComponent[layout].htmlElement.appendChild(input);
  input.onchange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      Module.Store.dispatch({
        name: readHandler,
        value: data,
      });
    };
    reader.readAsText(file);
  };
};

var parseGetCoordsAndSpeed = function (content) {
  const data = {};
  let str = "";
  for (let i = 0; i < content.length; i++) {
    if (content[i] == "\n") {
      if (str.indexOf("gpsloc") != -1) {
        let timeIndex = str.indexOf(",");
        let time = parseInt(str.substring(0, timeIndex));
        let cmdIndex = str.indexOf(",", timeIndex + 1);
        let cmd = str.substring(timeIndex + 1, cmdIndex);
        let value = str.substring(cmdIndex + 1);

        if (!data.hasOwnProperty(time)) {
          data[time] = {};
        }
        let _value;

        let latIndex = value.indexOf(",");
        _value["lat"] = parseFloat(value.substring(7, latIndex));
        _value["lon"] = parseFloat(
          value.substring(latIndex + 7, value.length - 1)
        );

        data[time]["gpsloc"] = _value;
        data[time]["gpsspeed"] = 0;
      }
      str = "";
    }
    str += content[i];
  }
};

var calculateSpeed = function (data) {
  let maxSpeed = 0;

  const degreesToRadians = function (degrees) {
    return (degrees * Math.PI) / 180;
  };

  const distanceInKmBetweenEarthCoordinates = function (
    lat1,
    lon1,
    lat2,
    lon2
  ) {
    let earthRadiusKm = 6371;

    let dLat = degreesToRadians(lat2 - lat1);
    let dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };
  const times = Object.keys(data);
  for (let i = 0; i < times.length - 1; i++) {
    let dist = distanceInKmBetweenEarthCoordinates(
      data[times[i]]["gpsloc"]["lat"],
      data[times[i]]["gpsloc"]["lon"],
      data[times[i + 1]]["gpsloc"]["lat"],
      data[times[i + 1]]["gpsloc"]["lon"]
    );
    let speed = dist / times[i + 1] - times[i];
    data[time]["gpsspeed"] = speed;

    if (speed > maxSpeed) maxSpeed = speed;
  }
  return speed;
};
