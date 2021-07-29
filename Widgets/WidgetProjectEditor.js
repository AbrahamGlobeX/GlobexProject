let MainClassification;
let MainClassificator;
let MainObjects;
class ProjectEditor extends BaseObjectEditor {
  constructor() {
    super();


    this._leftLayout = undefined;
    this._centerLayout = undefined;
    this._rightLayout = undefined;
    this._currentProject = "";

    this._workingProjectLayout;
    this._allProjectLayout;

    this._currentProjectLayout = undefined;

    this._projects = undefined;
    this._openedProject = [];
    this._mineProjects = [];
    this._openProjectLayout = "";

    this._classificatorArray = [];

    this._leftLayoutVisible = true;

    this._contextMenu = new NewContextMenu();

    MainObjects = new ObjectSystem(this);

    MainClassificator = new Classificator(
      this._contextMenu,
      this.callbackCreateObject.bind(this)
    );
    MainClassification = new Classification(
      this._contextMenu,
      MainObjects,
      this._rightLayout
    );
  }
  loadOwnProjects(handler) {
    const request = '{"meta.owner" : {"$oid" : "' + APP.owner + '"}}';
    const loadedProjects = function (resultJSON) {
      if ("cursor" in resultJSON) {
        this._projects = resultJSON.cursor.firstBatch;
        console.log("this_projects", this._projects);
        this.loadCategoryOfProperties(() => {
          setTimeout(() => {
            Module.Store.dispatch({
              eventName: handler,
              value: null,
            });
          }, 0);
        });
      }
    };
    APP.dbWorker.responseDOLMongoRequest = loadedProjects.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "projects", request);
  }
  loadOwnClassificator(handler) {
    MainClassificator.loadOwnClassificator(() => {
      setTimeout(() => {
        Module.Store.dispatch({
          eventName: handler,
          value: null,
        });
      }, 0);
    });
  }
  drawForm() {
    const dialog = this.drawDialog(-1);

    const mainLayout = this.drawLayout(dialog, "layoutHorizontal", {
      minWidth: "90vw",
      minHeight: "90vh",
    });

    this._leftLayout = this.drawLayout(mainLayout, "layoutVertical", {
      minWidth: "20%",
      maxWidth: "20%",
      width: "100%",
      height: "auto",
      border: "2px solid #aaa",
    });
    this._mainContentLayout = this.drawLayout(mainLayout, "layoutVertical", {
      width: "100%",
      height: "auto",
    });

    this._headerLayout = this.drawLayout(
      this.drawLayout(this._mainContentLayout, "layoutHorizontal", {
        width: "101%",
        maxHeight: "12%",
      }),
      "layoutVertical",
      {
        height: "100%",
      }
    );
    this._contentLayout = this.drawLayout(
      this._mainContentLayout,
      "layoutHorizontal",
      { width: "100%" }
    );

    this.drawLeftWidget();
  }
  drawLeftWidget() {
    this.drawLabel(this._leftLayout, "Режим редактирования", {
      width: "100%",
      minHeight: "40px",
      maxHeight: "46px",
      "border-bottom": "2px solid rgb(170, 170, 170)",
    });

    const projectLabel = this.drawLabel(this._leftLayout, "Проекты", {
      width: "100%",
      minHeight: "40px",
      maxHeight: "50px",
      background: "#26a69a",
      margin: "6px 0 0 0",
      "border-bottom": "2px solid rgb(170, 170, 170)",
    });

    ReactComponent[projectLabel].fontSize = 30;
    ReactComponent[projectLabel].fontWeight = "bold";

    this._openProjectLayout = this.drawLabel(
      this._leftLayout,
      "Открытые проекты",
      {
        maxHeight: "50px",
        minWidth: "100%",
        border: "1x solid black",
      }
    );

    (this._openProjectLayout = this.drawLayout(
      this._leftLayout,
      "layoutVertical",
      { width: "100%" }
    )),
      "layoutVertical",
      { minHeight: "100%", maxHeight: "100%" };

    this.drawProjects(this._openProjectLayout, this._openedProject);

    // Мои проекты

    const myProjectLabel = this.drawLabel(this._leftLayout, "Мои проекты", {
      maxHeight: "50px",
      minWidth: "100%",
      background: "#26a69a",
      border: "1x solid black",
    });

    ReactComponent[myProjectLabel].fontSize = 40;
    ReactComponent[myProjectLabel].fontWeight = "bold";    

    // поле для поиска
    const searchProjectInput = this.drawInput(this._leftLayout,'',{
      maxHeight: '30px',
      minWidth: '100%',
    })
       
    // поиск в моих проектах
    this._mineProjects = this._projects;
    ReactComponent[searchProjectInput].htmlElement.oninput = (e) => {
      if(e.target.value.length > 0) {
        this._mineProjects = searchByName(this._projects, e.target.value)
      } else {
        this._mineProjects = this._projects
      }

      ReactComponent[this._allProjectLayout].clearWidget();
      this.drawProjects(this._allProjectLayout, this._mineProjects );
    }
    

    this._allProjectLayout = this.drawLayout(
      this.drawLayout(this._leftLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { minHeight: "100%", maxHeight: "100%" }
    );

    this.drawButton(
      this.drawLayout(this._leftLayout, "layoutHorizontal", {
        width: "100%",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "Создать новый проект",
      { color: "#123456" },
      () => {
        this.drawFormEditProject();
      }
    );
    this.drawProjects(this._allProjectLayout, this._mineProjects || this._projects);
  }

  // Открытые проекты

  drawProjects(layout, projects) {
    if (projects !== undefined && projects.length > 0) {
      for (let i = 0; i < projects.length; i++) {
        const projectLayout = this.drawLayout(layout, "layoutHorizontal", {
          width: "90%",
          minHeight: "40px",
          maxHeight: "40px",
          borderBottom: "1px solid black",
          margin: "0 auto",
          background: "#D9EDF7",
        });
        ReactComponent[
          this.drawLabel(projectLayout, projects[i]["meta"]["name"])
        ].htmlElement.onclick = (e) => {
          if (this._currentProjectLayout) {
            this._currentProjectLayout.style.background = "none";
          }

          //  Проверка на наличие проекта в открытых проектах и добавление проекта, если он отсутствует
          if (
            this._openedProject.length <= 0 ||
            this._openedProject.indexOf(projects[i]) === -1
          ) {
            this._openedProject.push(projects[i]);
            ReactComponent[this._leftLayout].clearWidget();
            this.drawLeftWidget();
          }

          this._currentProjectLayout = e.target.parentNode;
          this._currentProjectLayout.style.background = "#dbdbdb";
          this.openProject(projects[i]["_id"]["$oid"]);

          this.showObjects();

          console.log("e", e);
          console.log("this._currentProjectLayout", this._currentProjectLayout);
        };
      }
    }
  }

  drawFormEditProject(project = undefined) {
    const dialog = this.drawDialog(-1);
    const mainLayout = this.drawLayout(dialog, "layoutVertical", {
      minWidth: "700px",
    });

    const languagesLayout = this.drawLayout(
      this.drawLayout(mainLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "300px" }
    );

    const selectedLanguage = function (language) {
      const languageLayout = this.drawLayout(
        languagesLayout,
        "layoutHorizontal",
        { width: "100%" }
      );
      this.drawLabel(
        languageLayout,
        languageSystem.selectedLanguages[language]["name"]["ru"]
      );
      namesValues[language] = project ? project["meta"]["name"][language] : "";
      ReactComponent[
        this.drawInput(languageLayout, namesValues[language])
      ].htmlElement.oninput = (e) => {
        namesValues[language] = e.target.value;
      };

      ReactComponent[languagesLayout].childGoToLast(
        ReactComponent[languagesLayout].children.length - 2
      );
    };

    const languageSystem = new LanguageSystem(this);

    const namesValues = {};

    if (project) {
      for (let language of Object.keys(project["meta"]["name"])) {
        languageSystem.addSelectedLanguage(language);
      }
    }
    const allLanguages = project
      ? languageSystem.selectedLanguages
      : languageSystem.defaultLanguages;
    for (let language of Object.keys(allLanguages)) {
      const languageLayout = this.drawLayout(
        languagesLayout,
        "layoutHorizontal",
        { width: "100%" }
      );
      this.drawLabel(languageLayout, allLanguages[language]["name"]["ru"]);
      namesValues[language] = project ? project["meta"]["name"][language] : "";
      ReactComponent[
        this.drawInput(languageLayout, namesValues[language])
      ].htmlElement.oninput = (e) => {
        namesValues[language] = e.target.value;
      };
    }

    this.drawButton(
      this.drawLayout(languagesLayout, "layoutHorizontal", {
        width: "10%",
        marginLeft: "85%",
        background: "#ddd",
        minHeight: "50px",
        maxHeight: "50px",
      }),
      "+",
      { color: "#123456" },
      () => {
        this.selectedLanguage = selectedLanguage;
        languageSystem.drawForm();
      }
    );

    let wikiInput = "";
    const wikiLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawLabel(wikiLayout, "Википедия");

    ReactComponent[this.drawInput(wikiLayout, wikiInput)].htmlElement.oninput =
      (e) => {
        wikiInput = e.target.value;
      };

    const btnLayout = this.drawLayout(mainLayout, "layoutHorizontal", {
      width: "100%",
    });
    this.drawButton(btnLayout, "Создать", { color: "#123456" }, () => {
      this.createProject(namesValues, wikiInput, () => {
        ReactComponent[dialog].destroyWidget();
      });
    });
    this.drawButton(btnLayout, "Отменить", { color: "#123456" }, () => {
      ReactComponent[dialog].destroyWidget();
    });
  }
  createProject(names, wiki, callback) {
    const project = {
      meta: {
        name: names["ru"],
        description: "t",
        owner: {
          $oid: "" + APP.owner + "",
        },
        pattern: {
          $oid: "58b528a3dcfd030dc81b84a0",
        },
      },
      additional: {
        image: "",
        category: [],
        wiki_ref: { en: wiki },
      },
      project: {
        object_list: [],
      },
    };
    const classification = {
      meta: {
        name: "Классификация проекта " + names["ru"],
        owner: {
          $oid: "" + APP.owner + "",
        },
        pattern: {
          $oid: "58b528a3dcfd030dc81b84a0",
        },
      },
      classification: {
        1: {
          name: {
            ru: "Классификация проекта " + names["ru"],
          },
          childrens: {
            2: {
              name: {
                ru: "Общие",
              },
              childrens: {},
            },
          },
        },
      },
    };
    const classificator = {
      meta: {
        name: "Классификатор проекта " + names["ru"],
        owner: {
          $oid: "" + APP.owner + "",
        },
        pattern: {
          $oid: "58b528a3dcfd030dc81b84a0",
        },
      },
      classificator: {
        "2cee3b0f0000000000000000": {
          childrens: {},
        },
      },
    };
    const createdProject = function (resultJSON) {
      console.log("res", resultJSON);

      project["_id"] = resultJSON.inserted_id;

      this._projects.push(project);

      const projectLayout = this.drawLayout(
        this._allProjectLayout,
        "layoutHorizontal",
        {
          width: "90%",
          minHeight: "60px",
          maxHeight: "60px",
          borderBottom: "1px solid black",
          margin: "0 auto",
        }
      );
      ReactComponent[
        this.drawLabel(projectLayout, project["meta"]["name"])
      ].htmlElement.onclick = (e) => {
        if (this._currentProjectLayout) {
          this._currentProjectLayout.style.background = "none";
        }
        this._currentProjectLayout = e.target.parentNode;
        this._currentProjectLayout.style.background = "#dbdbdb";
        this.openProject(project["_id"]["$oid"]);
        console.log("e", e);
        console.log("this._currentProjectLayout", this._currentProjectLayout);
      };
      callback();
    };

    const createdProjectClassificator = function (resultJSON) {
      project["additional"]["classificator"] = {
        $oid: resultJSON["inserted_id"]["$oid"],
      };
      project["additional"]["classificatorObject"] = classificator;
      debugger;
      console.log("Классификатор проекта", classificator);

      APP.dbWorker.responseDOLMongoRequest = createdProject.bind(this);

      const inserted = {
        meta: {
          owner: project["meta"]["owner"],
          name: project["meta"]["name"],
          description: project["meta"]["description"],
          pattern: project["meta"]["pattern"],
        },
        additional: {
          image: project["additional"]["image"],
          category: project["additional"]["category"],
          wiki_ref: project["additional"]["wiki_ref"],
          classificator: project["additional"]["classificator"],
          classification: project["additional"]["classification"],
        },
        project: {
          object_list: [],
        },
      };

      APP.dbWorker.sendInsertRCRequest(
        "DOLMongoRequest",
        JSON.stringify(inserted),
        "projects"
      );
    };

    const createdClassification = function (resultJSON) {
      project["additional"]["classification"] = {
        $oid: resultJSON["inserted_id"]["$oid"],
      };
      project["additional"]["classificationObject"] = classification;
      APP.dbWorker.responseDOLMongoRequest =
        createdProjectClassificator.bind(this);
      APP.dbWorker.sendInsertRCRequest(
        "DOLMongoRequest",
        JSON.stringify(classificator),
        "objects"
      );
    };

    APP.dbWorker.responseDOLMongoRequest = createdClassification.bind(this);
    APP.dbWorker.sendInsertRCRequest(
      "DOLMongoRequest",
      JSON.stringify(classification)
    );
  }
  openProject(projectID) {
    if (this._currentProject != "")
      if (this._currentProject["_id"]["$oid"] === projectID) return;
    ReactComponent[this._headerLayout].clearWidget();
    ReactComponent[this._contentLayout].clearWidget();
    this._centerLayout = this.drawLayout(
      this._contentLayout,
      "layoutVertical",
      { height: "100%" }
    );
    this._rightLayout = this.drawLayout(this._contentLayout, "layoutVertical", {
      height: "100%",
    });
    MainClassification._rightLayout = this._rightLayout;

    const project = this._projects.find(
      (item) => item["_id"]["$oid"] == projectID
    );
    this._currentProject = project;
    MainClassificator.setProjectID(this._currentProject["_id"]["$oid"]);
    MainClassification.setProjectID(this._currentProject["_id"]["$oid"]);
    const nameLayout = this.drawLayout(this._headerLayout, "layoutHorizontal", {
      width: "100%",
      minHeigt: "50px",
      maxHeight: "100%",
      minHeight: "50px",
      overflow: "hidden",
      borderTop: "2px solid #aaa",
      borderBottom: "2px solid #aaa",
    });

    // VIEW TITLE //

    let headerText = this.drawLabel(
      nameLayout,
      `Редактирование проекта "${project.meta.name}"`
    );
    const switchGroupLayout = this.drawLayout(
      this._headerLayout,
      "layoutHorizontal",
      { width: "100%", minHeight: "60px", maxHeight: "60px" }
    );
    ReactComponent[headerText].fontSize = 40;
    ReactComponent[headerText].fontWeight = "bold";
    //this._centerContentLayout = this.drawLayout(this.drawLayout(this._centerLayout,"layoutHorizontal",{"width" : "100%"}),"layoutVertical",{});
    const btnObject = this.drawButton(
      switchGroupLayout,
      "Объекты",
      { color: "#123456", maxWidth: "49.3%" },
      () => {
        this.showObjects();
        this.widgetSetStyle(btnObject, { background: "grey" });
      }
    );
    const rightButton = this.drawButton(
      switchGroupLayout,
      "Приложения",
      { color: "#123456" },
      () => {}
    );
    ReactComponent[rightButton].htmlElement.style.marginLeft = "6px";
  }
  loadObjects(callback) {
    const loadedClassificator = function () {
      MainClassification.loadClassification(
        this._currentProject["additional"]["classification"]["$oid"],
        this._currentProject["_id"]["$oid"],
        loadedObjects.bind(this)
      );
    };

    const loadedObjects = function () {
      MainObjects.loadObjects(
        this._currentProject["_id"]["$oid"],
        this._currentProject["project"]["object_list"],
        () => {
          this._currentProject["project"]["objects"] =
            MainObjects._objects[this._currentProject["_id"]["$oid"]];
          callback();
        }
      );
    };
    MainClassificator.loadClassificator(
      this._currentProject["_id"]["$oid"],
      this._currentProject["additional"]["classificator"]["$oid"],
      loadedClassificator.bind(this)
    );
  }
  showObjects() {
    if (!this._currentProject["project"]["objects"]) {
      return this.loadObjects(() => {
        this.loadAllObjects(() => {
          this.showObjects();
        });
      });
    }
    if (this._classLayout) {
      ReactComponent[this._classLayout].destroyWidget();
    }

    this._classLayout = this.drawLayout(
      this._centerLayout,
      "layoutHorizontal",
      { width: "100%" }
    );

    //this._classLayout = undefined;
    this.drawClassificator();
    this.drawClassification();
  }
  drawClassificator() {
    const classificatorLayout = this.drawLayout(
      this._classLayout,
      "layoutVertical",
      { height: "100%" }
    );

    // Кнопка 'Классификатор GlobeXY'
    this.drawButton(
      classificatorLayout,
      "Классификатор GlobeXY",
      {
        minWidth: "100%",
        maxHeight: "30px",
        background: "grey",
        color: "black",
      },
      () => {}
    );
    // this.drawLabel(
    //   this.drawLayout(classificatorLayout, "layoutHorizontal", {
    //     width: "100%",
    //     maxHeight: "50px",
    //     minHeight: "50px",
    //   }),
    //   "Классификатор"
    // );
    // this.drawLabel(
    //   this.drawLayout(classificatorLayout, "layoutHorizontal", {
    //     width: "100%",
    //     maxHeight: "50px",
    //     minHeight: "50px",
    //   }),
    //   "созданный на основе объектов проекта"
    // );

    const classificatorTreeLayout = this.drawLayout(
      classificatorLayout,
      "layoutHorizontal",
      { width: "100%", minHeight: "600px" }
    );
    ReactComponent[classificatorTreeLayout].includeWidget(
      ReactComponent[
        MainClassificator.drawTree(this._currentProject["_id"]["$oid"])
      ]
    );
    ReactComponent[classificatorTreeLayout].htmlElement.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        MainClassificator.showContextMenu(e, "mainView");
      }
    );
    // Кнопка "Добавить объект"

    this.drawButton(
      this.drawLayout(classificatorLayout, "layoutHorizontal", {
        width: "99%",
        maxHeight: "50px",
      }),
      "Добавить объект",
      { color: "#123456" },
      () => {
        const editor = new PatternEditorSystem(this);
        editor.callbackCreateObject = this.callbackCreateObject.bind(this);
        editor.drawFormObjectsWithPatterns();
      }
    );
  }

  drawClassification() {
    try {
      const classificationLayout = this.drawLayout(
        this._classLayout,
        "layoutVertical",
        { height: "100%", paddingLeft: "3%" }
      );
      // this.drawLabel(
      //   this.drawLayout(classificationLayout, "layoutHorizontal", {
      //     width: "100%",
      //     maxHeight: "50px",
      //     minHeight: "50px",
      //   }),
      //   "Классификация проекта"
      // );
      // this.drawLabel(
      //   this.drawLayout(classificationLayout, "layoutHorizontal", {
      //     width: "100%",
      //     maxHeight: "50px",
      //     minHeight: "50px",
      //   }),
      //   this._currentProject["meta"]["name"]
      // );

      const classificationTreeLayout = this.drawLayout(
        classificationLayout,
        "layoutHorizontal",
        { width: "100%", minHeight: "600px" }
      );
      ReactComponent[classificationTreeLayout].includeWidget(
        ReactComponent[
          MainClassification.drawTree(this._currentProject["_id"]["$oid"])
        ]
      );
      //MainClassification.fillTreeWithObject(this._currentProject["_id"]["$oid"],this._currentProject["project"]["objects"]);
      MainClassification.fillTreeWithObject(
        this._currentProject["_id"]["$oid"]
      );

      ReactComponent[classificationTreeLayout].htmlElement.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
          MainClassification.showContextMenu(e, "mainView");
        }
      );

      // Кнопка 'Редактировать группу' работает как кнопка 'Сравнить объекты'
      this.drawButton(
        this.drawLayout(classificationLayout, "layoutHorizontal", {
          width: "99%",
          maxHeight: "50px",
        }),
        "Редактировать группу",
        { color: "#123456" },
        () => { 
          // import WidgetCompareTable from './WidgetCompareTable'
          const compareobj = new CompareTable(this._allProjectLayout)
        }
        // () => {
        //   const editor = new PatternEditorSystem(this);
        //   editor.callbackCreateObject = this.callbackCreateObject.bind(this);
        //   editor.drawFormObjectsWithPatterns();
        // }
      );
    } catch (e) {
      console.error("drawClassification", e);
    }
  }

  callbackCreateObject(createdObject) {
    const insertedIntoList = function (resultJSON) {
      console.log("insertedIntoList", resultJSON);
      /**/

      MainClassificator.loadPrototype(
        createdObject["additional"]["category"][0],
        (pattern) => {
          const [result, ids] = MainClassificator.checkAndAddPatternInProject(
            this._currentProject["_id"]["$oid"],
            pattern
          );
          if (result) {
            MainObjects._objects[this._currentProject["_id"]["$oid"]].push(
              createdObject
            );
            MainObjects.setObjectClassification(
              this._currentProject["_id"]["$oid"],
              createdObject["_id"]["$oid"],
              "2"
            );

            this._currentProject["project"]["object_list"].push(
              createdObject["_id"]
            );
            //this._currentProject["project"]["objects"].push(MainObjects.findObjectByID(this._currentProject["_id"]["$oid"],createdObject["_id"]["$oid"]));

            MainObjects.loadObjectProperties(
              this._currentProject["_id"]["$oid"],
              () => {
                this.showObjects();
              }
            );
          } else {
            MainClassificator.fillAddedPatternInProjectClassificator(
              this._currentProject["_id"]["$oid"],
              pattern,
              ids,
              () => {
                MainClassificator.updateClassificator(
                  this._currentProject["_id"]["$oid"],
                  this._currentProject["additional"]["classificator"]["$oid"],
                  () => {
                    MainObjects._objects[
                      this._currentProject["_id"]["$oid"]
                    ].push(createdObject);
                    MainObjects.setObjectClassification(
                      this._currentProject["_id"]["$oid"],
                      createdObject["_id"]["$oid"],
                      "2"
                    );

                    this._currentProject["project"]["object_list"].push(
                      createdObject["_id"]
                    );
                    //this._currentProject["project"]["objects"].push(MainObjects.findObjectByID(this._currentProject["_id"]["$oid"],createdObject["_id"]["$oid"]));

                    MainClassificator.drawTree(
                      this._currentProject["_id"]["$oid"]
                    );

                    MainObjects.loadObjectProperties(
                      this._currentProject["_id"]["$oid"],
                      () => {
                        this.showObjects();
                      }
                    );
                  }
                );
              }
            );
            console.log("result", ids);
          }
        }
      );
    };
    console.log("createdObject", createdObject);

    const push = {
      $push: {
        "project.object_list": createdObject["_id"],
      },
    };
    console.log("push", push);
    APP.dbWorker.responseDOLMongoRequest = insertedIntoList.bind(this);
    APP.dbWorker.sendUpdateRCRequest(
      "DOLMongoRequest",
      this._currentProject["_id"]["$oid"],
      JSON.stringify(push),
      "projects"
    );
  }

  loadAllObjects(callback) {
    try {
      const loadIDs = {};
      const loadProject = function (index) {
        if (index >= this._projects.length) {
          console.log("current project", this._currentProject["_id"]["$oid"]);
          console.log("objects", MainObjects._objects);
          return callback();
        }
        const project = this._projects[index];
        if (
          !project["additional"].hasOwnProperty("classificator") ||
          project["_id"]["$oid"] === this._currentProject["_id"]["$oid"]
        ) {
          return loadProject.bind(this, ++index)();
        }
        MainClassificator.loadClassificator(
          project["_id"]["$oid"],
          project["additional"]["classificator"]["$oid"],
          () => {
            MainClassification.loadClassification(
              project["additional"]["classification"]["$oid"],
              project["_id"]["$oid"],
              () => {
                MainObjects.loadObjects(
                  project["_id"]["$oid"],
                  project["project"]["object_list"],
                  () => {
                    MainClassificator.drawTree(project["_id"]["$oid"]);

                    MainClassification.drawTree(project["_id"]["$oid"]);
                    //MainClassification.fillTreeWithObject(project["_id"]["$oid"],MainObjects._objects[project["_id"]["$oid"]]);
                    MainClassification.fillTreeWithObject(
                      project["_id"]["$oid"]
                    );
                    console.log("project: " + project + " loaded");
                    loadProject.bind(this, ++index)();
                  }
                );
              }
            );
          }
        );
      };
      loadProject.bind(this, 0)();
    } catch (e) {
      console.error("ProjectEditor.loadAllObjects", e);
    }
  }
}

class Classificator {
  constructor(contextMenu, callbackCreateObject) {
    this._classificatorID = "2cee3b0f0000000000000000";
    this._classificator = {};
    this._tree = {};
    this._treeItem = {};
    this._projectID = undefined;

    this._ownClassificator = [];

    this._contextMenu = contextMenu;
    this._callbackCreateObject = callbackCreateObject;

    this._drawFormWidgets = new DrawFormWidgets();
    this._mainTreeClassificator = undefined;
    this._mainTreeClassificatorItems = {};

    this._classificatorMenuName = "ClassificatorMenu";
    this._classificatorMenuItemsName = "ClassificatorItemsName";
    this._classificatorMainMenuName = "MainClassificatorMenu";
    this._classificatorMainMenuItemsName = "MainClassificatorItemsName";

    this._contextMenu.createMenu(this._classificatorMenuItemsName);

    this._contextMenu.createMenu(this._classificatorMenuName);

    this._contextMenu.addMenuItem(
      this._classificatorMenuName,
      "Создать прототип",
      -1,
      "main",
      {},
      undefined
    );
    this._contextMenu.addMenuItem(
      this._classificatorMenuName,
      "Создать объект",
      -1,
      "main",
      {},
      undefined
    );
    this._contextMenu.addMenuItem(
      this._classificatorMenuName,
      "Открыть прототип",
      -1,
      "main",
      {},
      undefined
    );

    this._contextMenu.createMenu(this._classificatorMainMenuItemsName);

    this._contextMenu.createMenu(this._classificatorMainMenuName);

    this._contextMenu.addMenuItem(
      this._classificatorMainMenuName,
      "Создать прототип",
      -1,
      "main",
      {},
      undefined
    );
    this._contextMenu.addMenuItem(
      this._classificatorMainMenuName,
      "Создать объект",
      -1,
      "main",
      {},
      undefined
    );
    this._contextMenu.addMenuItem(
      this._classificatorMainMenuName,
      "Открыть прототип",
      -1,
      "main",
      {},
      undefined
    );
  }
  setProjectID(projectID) {
    this._projectID = projectID;
  }
  loadOwnClassificator(callback) {
    try {
      const loaded = function (resultJSON) {
        const result = resultJSON.cursor.firstBatch;
        this._ownClassificator = result;
        console.log("Classificator.loadOwnClassificator.loaded", result);
        callback();
      };
      const request = '{"meta.owner" : {"$oid" : "' + APP.owner + '"}}';
      APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
      APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "patterns", request);
    } catch (e) {
      console.error("Classificator.loadOwnClassificator", e);
    }
  }
  loadClassificator(projectID, id, callback) {
    const loadedClassificator = function (resultJSON) {
      console.log("loadClassificator resultJSON", resultJSON);
      this._classificator[projectID] =
        resultJSON.cursor.firstBatch[0].classificator;
      if (Object.keys(this._classificator[projectID]).length == 0) callback();
      this.loadCommonClassificator(
        projectID,
        this.getClassificatorIDS(projectID),
        callback
      );
      console.log("this._classificator", this._classificator);
    };
    const request = '{"_id" : {"$oid" : "' + id + '"}}';
    console.log("loadClassificator", request);
    APP.dbWorker.responseDOLMongoRequest = loadedClassificator.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  loadCommonClassificator(projectID, ids, callback) {
    const loadedCommonClassificator = function (resultJSON) {
      console.log("loadedComminClassificator", resultJSON);
      this.fillClassificatorWithCommon(
        projectID,
        JSON.parse(JSON.stringify(resultJSON.cursor.firstBatch))
      );
      callback();
    };
    const request =
      '{"_id" : {"$in":[' +
      ids.map((item) => '{"$oid" : "' + item + '"}').join(",") +
      "]}}";

    console.log("loadCommonClassificator", request);
    APP.dbWorker.responseDOLMongoRequest = loadedCommonClassificator.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  getClassificatorIDS(projectID) {
    const ids = {};
    const getID = function (key, element) {
      ids[key] = 1;
      for (let child of Object.keys(element["childrens"])) {
        getID.bind(this, child, element["childrens"][child])();
      }
    };
    const rootID = Object.keys(this._classificator[projectID])[0];
    getID.bind(this, rootID, this._classificator[projectID][rootID])();
    console.log('Classificator PROJECT', ids);
    return Object.keys(ids);
  }
  fillClassificatorWithCommon(projectID, common) {
    let ClassID = 0;
    while (common.length) {
      if (ClassID >= common.length) {
        ClassID = 0;
      }
      const currentClassificator = common[ClassID];
      if (!currentClassificator.hasOwnProperty("parent_id")) {
        this._classificator[projectID][currentClassificator["_id"]["$oid"]][
          "name"
        ] = currentClassificator["meta"]["name"];
        this._classificator[projectID][currentClassificator["_id"]["$oid"]][
          "layer"
        ] = currentClassificator["layer"];
        common.splice(ClassID, 1);
        continue;
      }

      const parentIDS = currentClassificator["parent_id"].map(
        (item) => item["$oid"]
      );
      let _currentClass = this._classificator[projectID];
      let _predClass = undefined;

      for (let parentID of parentIDS) {
        _currentClass = _currentClass[parentID];
        _predClass = _currentClass;
        _currentClass = _currentClass["childrens"];
      }
      _currentClass = _currentClass[currentClassificator["_id"]["$oid"]];
      if (!_currentClass) {
        ClassID++;
        continue;
      }
      _currentClass["layer"] = currentClassificator["layer"];

      _currentClass["name"] = _predClass["layer"].find((item) => {
        if (item.hasOwnProperty("child_id")) {
          return (
            item["child_id"]["$oid"] === currentClassificator["_id"]["$oid"]
          );
        } else {
          return (
            item["leaf_id"]["$oid"] === currentClassificator["_id"]["$oid"]
          );
        }
      })["name"];
      common.splice(ClassID, 1);
    }
    const findLeafChild = function (
      key,
      currentElement,
      predElement = undefined
    ) {
      if (Object.keys(currentElement["childrens"]).length != 0) {
        for (let children of Object.keys(currentElement["childrens"])) {
          predElement = currentElement;
          findLeafChild(
            children,
            currentElement["childrens"][children],
            predElement
          );
        }
      } else {
        if (!currentElement.hasOwnProperty("name")) {
          currentElement["name"] = predElement["layer"].find((item) => {
            if (item.hasOwnProperty("leaf_id")) {
              return item["leaf_id"]["$oid"] == key;
            } else {
              return item["child_id"]["$oid"] == key;
            }
          })["name"];
        }
      }
    };
    findLeafChild(
      Object.keys(this._classificator[projectID])[0],
      this._classificator[projectID][
        Object.keys(this._classificator[projectID])[0]
      ]
    );
  }
  drawTree(projectID) {
    if (this._tree[projectID]) {
      this._tree[projectID].destroyWidget();
    }
    this._tree[projectID] = new WidgetTree();
    this._treeItem[projectID] = {};
    const drawItem = function (id, parentID, element, predParentID, pID) {
      const name =
        parentID === -1
          ? "Классификатор проекта"
          : element.name["ru"] + " ( прототип )";
      predParentID = parentID;
      const item = this._tree[projectID].createItemInTree(parentID, () => {});
      ReactComponent[item].text = name;

      this._treeItem[projectID][id] = {
        widget: item,
        parent: predParentID,
        name: parentID === -1 ? "Классификатор проекта" : element.name["ru"],
        parentID: pID,
        id: id,
      };
      this._contextMenu.addMenuItem(
        this._classificatorMenuItemsName,
        "",
        item,
        "prototype",
        {
          id: id,
          parents: this.findedParent.bind(this, projectID, pID),
          name: element.name["ru"],
        },
        undefined
      );
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
    const rootID = Object.keys(this._classificator[projectID])[0];
    drawItem.bind(
      this,
      rootID,
      -1,
      this._classificator[projectID][rootID],
      -1,
      -1
    )();
    return this._tree[projectID].id;
  }
  getTree(projectID) {
    return this._tree[projectID].copyTree();
  }
  getAllClassificatorTree(mode = "addObject") {
    this._contextMenu.logMenuItems(this._classificatorMenuItemsName);
    const tree = {};
    for (let id of Object.keys(this._classificator)) {
      let projTree = undefined;
      let confirmity = undefined;
      if (id === this._projectID) {
        [projTree, confirmity] = this._tree[id].copyTree();
      } else {
        projTree = this._tree[id];
      }
      projTree.htmlElement.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showContextMenu(e, mode, confirmity);
      });
      tree[id] = projTree;
    }
    return tree;
  }
  findedParent(projectID, parentID) {
    const parents = [];
    while (parentID != -1) {
      parents.unshift(parentID);
      parentID = this._treeItem[projectID][parentID]["parentID"];
    }
    return parents;
  }
  find(findStr) {
    let allFinded = {};
    for (let id of Object.keys(this._treeItem)) {
      const finded = Object.keys(this._treeItem[id])
        .filter((item) => {
          return new RegExp(findStr).test(this._treeItem[id][item]["name"]);
        })
        .map((item) => {
          this._treeItem[id][item]["id"] = item;
          return this._treeItem[id][item];
        });
      console.log("finded", finded);
      console.log("treeItem", this._treeItem[id]);

      allFinded[id] = this.buildFindTree(id, finded);
    }
    return allFinded;
  }
  buildFindTree(projectID, finded) {
    const buildTree = {};

    for (let object of finded) {
      const items = [];
      items.push({ name: object["name"], id: object["id"] });
      let currentParent = object["parentID"];
      while (currentParent != -1) {
        items.unshift({
          name: this._treeItem[projectID][currentParent]["name"],
          id: this._treeItem[projectID][currentParent]["id"],
        });
        currentParent = this._treeItem[projectID][currentParent]["parentID"];
      }
      let currentBuildTree = buildTree;
      for (let item of items) {
        if (currentBuildTree.hasOwnProperty(item["id"])) {
          currentBuildTree = currentBuildTree[item["id"]]["childrens"];
        } else {
          currentBuildTree[item["id"]] = {
            name: item["name"],
            childrens: {},
          };
          currentBuildTree = currentBuildTree[item["id"]]["childrens"];
        }
      }
    }
    return buildTree;
  }

  drawClassificatorTreeByItems(classificator) {
    console.log('Draw classificator ', classificator);
    const treeItem = {};
    const tree = new WidgetTree();
    if (Object.keys(classificator).length == 0) {
      console.log('Enter undefined', Object.keys(classificator));
      const item = tree.createItemInTree(-1);
      ReactComponent[item].text = "Классификатор проекта";

      const item2 = tree.createItemInTree(item);
      ReactComponent[item2].text = "Ничего не найдено";

      return tree;
    }
    const drawItem = function (id, parentID, element, predParentID, pID) {
      const name = element + " ( прототип )";
      predParentID = parentID;
      const item = tree.createItemInTree(0, () => {});
      ReactComponent[item].text = name;

      treeItem[id] = {
        widget: item,
        parent: predParentID,
        name:  element,
        parentID: pID,
        id: id,
      };
     // for (let childID of Object.keys(element.childrens)) {
        // drawItem.bind(
        //   this,
        //   id,
        //   item,
        //   element,
        //   predParentID,
        //   id
        // )();
     // }
    };
    const rootID = Object.keys(classificator)[0];    
    drawItem.bind(this, rootID, -1, classificator[rootID], -1, -1)();

    return tree;
  }

  drawClassificatorTreesByItems(items) {
    const trees = {};
    for (let id of Object.keys(items)) {
      trees[id] = this.drawClassificatorTreeByItems(items[id]);
    }
    return trees;
  }

  showContextMenu(
    e,
    mode,
    confirmity = undefined,
    isMainClassificator = false
  ) {
    console.log("showContextMenu class", e);
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
      return;
    }
    let finded = undefined;
    let ids = [];
    if (!isMainClassificator) {
      finded = this._contextMenu.findItemByWidgetID(
        this._classificatorMenuItemsName,
        id
      );
      ids = finded.info.parents();
      ids.push(finded.info.id);
      ids = ids.join(".");
    } else {
      finded = this._contextMenu.findItemByWidgetID(
        this._classificatorMainMenuItemsName,
        id
      );
      ids = JSON.parse(JSON.stringify(finded.info.parents));
      ids.push(finded.info.id);
      ids = ids.join(".");
    }
    console.log("finded", finded);
    console.log("ids", ids);
    if (!finded) {
      return;
    }
    switch (finded["type"]) {
      case "prototype": {
        if (mode != "addObject") break;
        this._contextMenu.setMenuItemCallback(
          this._classificatorMenuName,
          "Создать прототип",
          this.openPrototypeCreateForm.bind(this, finded.info.name, ids)
        );
        this._contextMenu.setMenuItemCallback(
          this._classificatorMenuName,
          "Открыть прототип",
          this.openPrototypeForm.bind(this, ids)
        );
        this._contextMenu.setMenuItemCallback(
          this._classificatorMenuName,
          "Создать объект",
          this.openPrototypeForm.bind(this, ids, "edit")
        );
        this._contextMenu.showMenu(
          this._classificatorMenuName,
          APP.UI.mX,
          APP.UI.mY
        );
        break;
      }
      case "mainPrototype": {
        this._contextMenu.setMenuItemCallback(
          this._classificatorMainMenuName,
          "Создать прототип",
          this.openPrototypeCreateForm.bind(this, finded.info.name, ids)
        );
        this._contextMenu.setMenuItemCallback(
          this._classificatorMainMenuName,
          "Открыть прототип",
          this.openPrototypeForm.bind(this, ids)
        );
        this._contextMenu.setMenuItemCallback(
          this._classificatorMainMenuName,
          "Создать объект",
          this.openPrototypeForm.bind(this, ids, "edit")
        );
        this._contextMenu.showMenu(
          this._classificatorMainMenuName,
          APP.UI.mX,
          APP.UI.mY
        );
        break;
      }
    }
  }
  loadPrototype(category, callback) {
    const loaded = function (resultJSON) {
      console.log("resultJSOn", resultJSON);
      const result = resultJSON.cursor.firstBatch;
      if (Array.isArray(result) && result.length == 0) {
        return callback();
      }
      return callback(result[0]);
    };
    const finded = this._ownClassificator.find(
      (item) => item["additional"]["category"][0] === category
    );
    if (finded) {
      return callback(finded);
    }
    const request =
      '{"additional.category" : "' +
      category +
      '", "meta.owner" : {"$oid" : "591c318fe9d2600f47e37d3a"}}';
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "patterns", request);
  }
  openPrototypeForm(category, mode = "view") {
    this.loadPrototype(category, (prototype) => {
      if (!prototype) {
        return APP.log("warn", "Данный прототип не создан");
      }
      const editor = new PatternEditorSystem(this);
      editor.callbackCreateObject = this._callbackCreateObject;
      editor.openPrototypeProperties(prototype, mode);
      //this.openPrototype(prototype,mode);
    });
  }
  openPrototypeCreateForm(name, category) {
    this.loadPrototype(category, (prototype) => {
      if (prototype) {
        return APP.log("warn", "Данный прототип уже создан");
      }
      const editor = new PatternEditorSystem(this);
      editor.callbackCreateObject = this._callbackCreateObject;
      editor.openPatternCreateForm(name, category, (pattern) => {
        this._ownClassificator.push(pattern);
      });
    });
  }

  loadMainClassificator() {
    try {
      const loaded = function (resultJSON) {
        console.log("resultJSNO", resultJSON);

        const result = resultJSON.cursor.firstBatch[0];
        console.log("result", result);

        this.drawFormWithMainTree();
        this.drawPatternsInMainClassificatorTree(result.layer);
      };
      const request = '{"_id" : {"$oid" : "' + this._classificatorID + '"}}';
      APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
      APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
    } catch (e) {
      console.error("Classificator.loadMainClassificator", e);
    }
  }
  drawFormWithMainTree() {
    try {
      const [layout, searchLayout] = this._drawFormWidgets.drawCommonDialog(
        "Общий классификатор",
        "",
        "Отмена",
        () => {},
        true
      );
      this._drawFormWidgets.drawSearch(searchLayout, (e) => {});

      this._mainTreeClassificator = new WidgetTree();
      this._mainTreeClassificator.htmlElement.style.width = "100%";
      this._mainTreeClassificator.htmlElement.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
          this.showContextMenu(e, "view", undefined, true);
        }
      );
      ReactComponent[layout].includeWidget(this._mainTreeClassificator);
    } catch (e) {
      console.error("Classificator.drawFormWithMainTree", e);
    }
  }
  drawPatternsInMainClassificatorTree(patterns) {
    try {
      for (let pattern of patterns) {
        const item = this._mainTreeClassificator.createItemInTree(-1);
        ReactComponent[item].text = pattern.name.ru;
        if (pattern.hasOwnProperty("child_id")) {
          ReactComponent[item].createFakeExpand(() => {
            this.loadPatternsInMainClassificatorTree(
              pattern["child_id"]["$oid"],
              (result) => {
                this.addPatternsInMainClassificatorTree(result, item);
              }
            );
          }, true);
        }

        this._contextMenu.addMenuItem(
          this._classificatorMainMenuItemsName,
          "",
          item,
          "mainPrototype",
          {
            id: pattern["child_id"]["$oid"] || pattern["leaf_id"]["$oid"],
            parents: -1,
            name: pattern.name.ru,
          },
          undefined
        );
      }
    } catch (e) {
      console.error("Classificator.drawPatternsInMainClassificatorTree", e);
    }
  }
  loadPatternsInMainClassificatorTree(id, callback) {
    try {
      const loaded = function (resultJSON) {
        const result = resultJSON.cursor.firstBatch[0];
        console.log("result", result);
        callback(result);
      };
      const request = '{"_id" : {"$oid" : "' + id + '"}}';
      APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
      APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
    } catch (e) {
      console.error("Classificator.loadPatternsInMainClassificatorTree", e);
    }
  }
  addPatternsInMainClassificatorTree(pattern, parentID) {
    try {
      const parents = pattern["parent_id"].map((item) => item["$oid"]);
      console.log("parents", parents);
      parents.push(pattern["_id"]["$oid"]);
      for (let layer of pattern.layer) {
        const item = this._mainTreeClassificator.createItemInTree(parentID);
        ReactComponent[item].text = layer.name.ru;
        if (layer.hasOwnProperty("child_id")) {
          ReactComponent[item].createFakeExpand(() => {
            this.loadPatternsInMainClassificatorTree(
              layer["child_id"]["$oid"],
              (result) => {
                this.addPatternsInMainClassificatorTree(result, item);
              }
            );
          }, true);
        }
        console.log("pattern", layer);

        this._contextMenu.addMenuItem(
          this._classificatorMainMenuItemsName,
          "",
          item,
          "mainPrototype",
          {
            id: layer.hasOwnProperty("child_id")
              ? layer["child_id"]["$oid"]
              : layer["leaf_id"]["$oid"],
            parents: parents,
            name: layer.name.ru,
          },
          undefined
        );
      }
      ReactComponent[parentID].openFakeExpand();
    } catch (e) {
      console.error("Classificator.addPatternsInMainClassificatorTree", e);
    }
  }
  checkAndAddPatternInProject(projectID, pattern) {
    try {
      const categories = pattern["additional"]["category"][0].split(".");
      console.log("checkAndAddPatternInProject.categories", categories);
      let currentClassificator = this._classificator[projectID];
      const ids = [];
      for (let category of categories) {
        if (!currentClassificator.hasOwnProperty(category)) {
          ids.push(category);
          currentClassificator[category] = {
            childrens: {},
          };
        }
        currentClassificator = currentClassificator[category];
        currentClassificator = currentClassificator["childrens"];
      }

      if (ids.length != 0) {
        return [false, ids];
      }
      return [true, []];
    } catch (e) {
      console.error("Classificator.checkAndAddPatternInProject", e);
    }
  }
  fillAddedPatternInProjectClassificator(projectID, pattern, ids, callback) {
    try {
      const loaded = function (resultJSON) {
        try {
          console.log(
            "fillAddedPatternInProjectClassificator.loaded.result",
            resultJSON
          );
          console.log("this._classificator", this._classificator[projectID]);

          console.log("pattern", pattern);
          const step = pattern["additional"]["category"][0]
            .split(".")
            .filter((item) => !(ids.indexOf(item) != -1));

          let currentClassificator = this._classificator[projectID];
          let predClassificator = undefined;
          for (let id of step) {
            currentClassificator = currentClassificator[id];
            predClassificator = currentClassificator;
            currentClassificator = currentClassificator["childrens"];
          }
          for (let id of ids) {
            const findPattern = resultJSON.cursor.firstBatch.find(
              (item) => item["_id"]["$oid"] == id
            );
            console.log("pattern", findPattern);
            console.log("predClassificator", predClassificator);
            console.log("id", id);
            console.log("ids", ids);
            console.log(
              "this._classificator[projectID]",
              this._classificator[projectID]
            );
            if (findPattern)
              currentClassificator[id]["layer"] = findPattern["layer"];
            currentClassificator[id]["name"] = predClassificator["layer"].find(
              (item) => {
                if (item.hasOwnProperty("child_id")) {
                  return item["child_id"]["$oid"] == id;
                } else {
                  return item["leaf_id"]["$oid"] == id;
                }
              }
            )["name"];
            currentClassificator = currentClassificator[id];
            predClassificator = currentClassificator;
            currentClassificator = currentClassificator["childrens"];
          }
          console.log("this._classificator", this._classificator[projectID]);
          callback();
        } catch (e) {
          console.error("fillAddedPatternInProjectClassificator.loaded", e);
        }
      };
      const request =
        '{"_id" : {"$in":[' +
        ids.map((item) => '{"$oid" : "' + item + '"}').join(",") +
        "]}}";
      console.log("fillAddedPatternInProjectClassificator.request", request);
      APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
      APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
    } catch (e) {
      console.error("fillAddedPatternInProjectClassificator", e);
    }
  }
  updateClassificator(projectID, classificatorID, callback) {
    try {
      const updated = function (resultJSON) {
        console.log("Classificator.updateClassificator.updated", resultJSON);
        callback();
      };
      const buildClassificator = {};
      const generateClassificatorWithoutTrash = function (
        id,
        element,
        classificator
      ) {
        classificator[id] = {
          childrens: element.childrens,
        };

        for (let i of Object.keys(element.childrens)) {
          generateClassificatorWithoutTrash.bind(
            this,
            i,
            element.childrens[i],
            classificator[id]["childrens"]
          )();
        }
      };
      const copyClassificator = JSON.parse(
        JSON.stringify(this._classificator[projectID])
      );
      const rootID = Object.keys(copyClassificator)[0];
      generateClassificatorWithoutTrash(
        rootID,
        copyClassificator[rootID],
        buildClassificator
      );
      const sets = {
        $set: {
          classificator: buildClassificator,
        },
      };
      console.log("sets", sets);
      console.log("classificatorID", classificatorID);
      APP.dbWorker.responseDOLMongoRequest = updated.bind(this);
      APP.dbWorker.sendUpdateRCRequest(
        "DOLMongoRequest",
        classificatorID,
        JSON.stringify(sets)
      );
    } catch (e) {
      console.error("Classificator.updateClassificator", e);
    }
  }
}

class ObjectSystem extends BaseObjectEditor {
  constructor(projectSystem) {
    super();
    this._objects = {};
    this._objectProps = {};
    this._projectSystem = projectSystem;
  }
  loadObjects(projectID, ids, callback) {
    console.log("loadObjects ids", ids);
    const loadedObjects = function (resultJSON) {
      this._objects[projectID] = resultJSON.cursor.firstBatch;
      this.loadObjectProperties(projectID, callback);
      //callback();
    };

    const request =
      '{"_id" : {"$in":[' +
      ids.map((item) => '{"$oid" : "' + item["$oid"] + '"}').join(",") +
      "]}}";

    console.log("loadObjects", request);
    APP.dbWorker.responseDOLMongoRequest = loadedObjects.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "objects", request);
  }
  find(findStr) {
    let allFinded = [];
    for (let id of Object.keys(this._objects)) {
      allFinded = allFinded.concat(
        this._objects[id].filter((item) =>
          new RegExp(findStr, "i").test(item["meta"]["name"])
        )
      );
    }
    let returnValue = allFinded.map((item) => {
      return {
        name: item["meta"]["name"],
        classification: item["additional"]["classification"],
      };
    });
    const obj = {};

    for (let object of returnValue) {
      obj[object.name] = object.classification;
    }
    returnValue = [];
    for (let name of Object.keys(obj)) {
      returnValue.push({ name: name, classification: obj[name] });
    }

    return returnValue;
  }
  findObjectByID(projectID, objectID) {
    return this._objects[projectID].find(
      (item) => item["_id"]["$oid"] === objectID
    );
  }
  getObjectClassification(projectID, objectID) {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      return finded["additional"]["classification"][projectID];
    }
    return [];
  }
  addObjectClassification(projectID, objectID, classification) {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      finded["additional"]["classification"][projectID].push(classification);
      this.updateObject(projectID, objectID);
    }
  }
  setObjectClassification(projectID, objectID, classification) {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      finded["additional"]["classification"][projectID] = [classification];
      this.updateObject(projectID, objectID);
    }
  }
  deleteObjectClassification(projectID, objectID, classifiaction) {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      finded["additional"]["classification"][projectID] = finded["additional"][
        "classification"
      ][projectID].filter((item) => item.split(".").pop() != classifiaction);
      this.updateObject(projectID, objectID);
    }
  }
  getObjectClassificator(projectID, objectID) {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      return finded["additional"]["classificator"];
    }
  }
  getObjectProps(projectID, objectID) {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      return finded["object"];
    }
  }
  getObjectName(projectID, objectID, lang = "ru") {
    const finded = this.findObjectByID(projectID, objectID);
    if (finded) {
      return finded["meta"]["name"];
    }
  }
  updateObject(projectID, objectID) {
    const updated = function (resultJSON) {
      console.log("ObjectSystem.updateObject.updated", resultJSON);
    };
    const finded = this.findObjectByID(projectID, objectID);
    if (!finded) return;
    const sets = {
      $set: {
        additional: finded["additional"],
        object: finded["object"],
      },
    };
    console.log("ObjectSystem.updateObject.req", sets);
    APP.dbWorker.responseDOLMongoRequest = updated.bind(this);
    APP.dbWorker.sendUpdateRCRequest(
      "DOLMongoRequest",
      objectID,
      JSON.stringify(sets)
    );
  }

  loadObjectProperties(projectID, callback) {
    const req = {};
    const loaded = function (resultJSON) {
      console.log("loaded", resultJSON);
      const result = resultJSON.cursor.firstBatch;
      for (let prop of result) {
        if (!this._objectProps.hasOwnProperty(prop["name"])) continue;
        this._objectProps[prop["name"]] = prop;
      }
      console.log("this._objectProps", this._objectProps);
      callback();
    };
    for (let object of this._objects[projectID]) {
      if (!object["additional"].hasOwnProperty("classification")) continue;
      for (let prop of Object.keys(object["object"])) {
        if (this._objectProps.hasOwnProperty(prop)) {
        } else {
          if (object["object"][prop].hasOwnProperty("prop_ref")) {
            if (object["object"][prop]["prop_ref"]["$oid"])
              req[prop] = object["object"][prop]["prop_ref"]["$oid"];
            this._objectProps[prop] =
              object["object"][prop]["prop_ref"]["$oid"];
          }
        }
      }
    }
    const request =
      '{"_id" : {"$in" : [ ' +
      Object.keys(req)
        .map((item) => '{"$oid" : "' + req[item] + '"}')
        .join(",") +
      "]}}";
    APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "props", request);
    console.log("this._objectProps", request);
  }

  showObjectInfo(layout, projectID, id) {
    ReactComponent[layout].clearWidget();
    const object = this.findObjectByID(projectID, id);
    this.showObjectTitle(layout, object, projectID);
    this.showObjectProperties(layout, object, projectID);
  }

  showObjectTitle(layout, object) {
    const newLayout = this.drawLayout(layout, "layoutHorizontal", {
      width: "100%",
      maxHeight: "25px",
      minHeight: "25px",
    });
    const headerTitle = this.drawLabel(newLayout, "Объект", {
      background: "rgb(156 155 155 / 80)",
      height: "25px",
    });

    ReactComponent[headerTitle].fontWeight = "bold";
    ReactComponent[headerTitle].fontSize = 20;

    const nameLayout = this.drawLayout(layout, "layoutHorizontal", {
      width: "100%",
      maxHeight: "50px",
      minHeight: "50px",
    });

    this.drawLabel(nameLayout, "Название");
    this.drawLabel(nameLayout, object["meta"]["name"]);

    const wikiLayout = this.drawLayout(layout, "layoutHorizontal", {
      width: "100%",
      maxHeight: "50px",
      minHeight: "50px",
    });
    this.drawLabel(wikiLayout, "Википедия");
    this.drawLabel(wikiLayout, object["additional"]["wiki_ref"]["en"]);
  }

  loadPrototype(category, callback) {
    const loaded = function (resultJSON) {
      console.log("resultJSOn", resultJSON);
      const result = resultJSON.cursor.firstBatch;
      if (Array.isArray(result) && result.length == 0) {
        return APP.log("warn", "Данный прототип не создан");
      }
      return callback(result[0]);
    };
    const loadedOwnPatterns = function (resultJSON) {
      const result = resultJSON.cursor.firstBatch;
      const finded = result.find(
        (item) => item["additional"]["category"][0] === category
      );
      if (finded) {
        return callback(finded);
      }
      const request =
        '{"additional.category" : "' +
        category +
        '", "meta.owner" : {"$oid" : "591c318fe9d2600f47e37d3a"}}';
      APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
      APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "patterns", request);
    };
    const request = '{"meta.owner" : {"$oid" : "' + APP.owner + '"}}';
    APP.dbWorker.responseDOLMongoRequest = loadedOwnPatterns.bind(this);
    APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "patterns", request);
  }

  async showObjectProperties(parentLayout, object, projectID) {
    console.log("this._objectProps", this._objectProps);
    const propsLayout = this.drawLayout(
      this.drawLayout(parentLayout, "layoutHorizontal", { width: "100%" }),
      "layoutVertical",
      { height: "100%" }
    );
    for (let prop of Object.keys(object["object"])) {
      let property;

      if (this._objectProps.hasOwnProperty(prop)) {
        if (!this._objectProps[prop].hasOwnProperty("name")) continue;
        property = new Property(
          this._objectProps[prop]["category"],
          this._objectProps[prop]["pid"],
          this._objectProps[prop]["name"],
          "",
          "",
          "",
          this._objectProps[prop]["type_value"],
          object["object"][prop]["value"],
          false,
          this._objectProps[prop]["unit_type"]
        );
      } else {
        property = new Property(
          object["object"][prop]["category"],
          "",
          prop,
          "",
          "",
          "",
          object["object"][prop]["type_value"],
          object["object"][prop]["value"],
          false,
          object["object"][prop]["unit_type"]
        );
      }

      const layout = this.drawLayout(propsLayout, "layoutHorizontal", {
        width: "100%",
        maxHeight: "50px",
        minHeight: "50px",
      });
      this.drawLabel(layout, property.name);
      const widget = await propertyTypes[property.category][
        property.valueType
      ].getLabelWidget(property);
      ReactComponent[layout].includeWidget(widget);
      //this.drawLabel(layout,object["object"][prop]["value"]);
      //this.drawLabel(layout,this._objectProps[prop]["category"]);
    }
    this.DrawEditObjectButton(parentLayout, object, projectID);
  }

  DrawEditObjectButton(parentLayout, object, projectID) {
    this.drawButton(
      parentLayout,
      "Редактировать объект",
      {
        color: "#123456",
        width: "100%",
        maxHeight: "50px",
        minHeight: "50px",
      },
      () => {
        console.log("object", object);
        this.loadPrototype(object["additional"]["category"][0], (pattern) => {
          const editor = new PatternEditorSystem(this);
          editor.openObjectFormEdit(object, this._objectProps, pattern, () => {
            console.log("object", object);
            this.loadObjectProperties(projectID, () => {
              this.updateObject(projectID, object["_id"]["$oid"]);
              this.showObjectInfo(layout, projectID, object["_id"]["$oid"]);
            });
          });
        });
      }
    );
  }
}

//#region SearchEngine

/**
 *function to find the name of an object or project
 *@return {Array} Array of objects that have that keyword in name
 */
function searchByName(data, searchKeyword) {
  debugger;
  let arrayToFonSearch
  if (!data.isArray) {
    arrayToFonSearch = convertToArray(Object.values(data));
  } else {
    arrayToFonSearch = data
  }

  let objectsToOutput;
  if (!searchKeyword.trim()) {
    objectsToOutput = [];
  } else {
    objectsToOutput = BigDataSearch(arrayToFonSearch, searchKeyword);
  }
  
  return objectsToOutput;
}

/**
 * function to find the name of an object or project
 *
 * @param {Array} arrayToSearch the array in which we are looking
 * @param {String} keywords the words we are looking for
 * @return {Array} search results
 */
function BigDataSearch(arrayToSearch, keywords) {
  keywords = keywords.trim().replace(/ +/g, " ").split(" ");
  keywords.forEach((keyword) => {
    arrayToSearch = arrayToSearch.filter((el) =>
      el.meta.name.toLowerCase().includes(keyword.toLowerCase())
    );
  });
  // let result = []
  // arrayToSearch.forEach(item => result.push({classification: item.additional.classification, name: item.meta.name}))
  return arrayToSearch;
}

/**
 *convert an array of arrays to one array
 *
 * @param {Array} array
 * @return {Array} result array
 */
function convertToArray(array) {
  let result = [];
  array.forEach((el) => {
    result = result.concat(el);
  });
  return result;
}

/**
 *
 *  Search property by name or name+value
 * @param {Array} array The array in which we are looking for the property
 * @param {String} propName The name of the property we are looking for
 * @param {String} propValue The value of the property we are looking for
 * @param {String} comparison The value of the comparison > < >= etc
 * @return {Array} Array of objects id
 */
function searchProperty(array, propName, propValue = null, comparison = "=") {
  // Checking fields for emptiness
  const searchArray = convertToArray(Object.values(array));
  if (searchArray.length === 0 || !propName.trim()) {
    document.getElementById("result2").innerText = "";
  }

  // преобразование к строке в нижнем регистре или к числу для дальнейшего сравнения
  isNaN(propValue) ? propValue.toLowerCase() : (propValue = Number(propValue));

  // сравнение значения свойства с требуемым 
  const result = [];
  searchArray.map((obj) => {
    Object.keys(obj.object).map((prop) => {
      if (prop.toLowerCase().includes(propName.toLowerCase())) {
        if (propValue && comparison) {
          switch (comparison) {
            case "=":
              if (propValue == obj.object[prop].value.toLowerCase())
                return result.push(obj);
              break;
            case ">":
              if (propValue > obj.object[prop].value.toLowerCase())
                return result.push(obj);
              break;
            case "<":
              if (propValue < obj.object[prop].value.toLowerCase())
                return result.push(obj);
              break;
            case ">=":
              if (propValue >= obj.object[prop].value.toLowerCase())
                return result.push(obj);
              break;
            case "<=":
              if (propValue <= obj.object[prop].value.toLowerCase())
                return result.push(obj);
              break;
            default:
              return;
          }
        }
        return result.push(obj);
      }
    });
  });

  let result2 = [];
  result2 = result.map((el) => (result2 += el.meta.name + " "));
}

function convertClassificatorToArray(classificator) {
  debugger;
  console.log('Enter a converter');
  let result;
  result = classificator._classificator;
  result = Object.values(result);
  result.forEach((el) => {
    const child = Object.values(el)[0];
    getChildrens(child);
  });
}

function getChildrens(obj) { 
  console.log('Enter get children');
  if (Object.values(obj.childrens).length > 0) {
    Object.values(obj.childrens).forEach((child) => {
      return getChildrens( child);
    });
  } else {
    debugger;
    console.log('Classificator array', this);
    this._classificatorArray.push(obj.name.ru || obj.name);
    return obj;
  }
}

function searchClassificatorByName(classifiactors, searcher) {
  debugger;
  console.log('Enter a searcher');
  convertClassificatorToArray(classifiactors);

  let arrayToSearch;
  const keywords = searcher.trim().replace(/ +/g, " ").split(" ");

  keywords.forEach((keyword) => {
    arrayToSearch = this._classificatorArray.filter(el => el.toLowerCase().includes(keyword.toLowerCase()))  
  });
  return this._classificatorArray;
}


//#region Adaptive mb in future
 
window.addEventListener('resize', (e) => {
  // console.log('resize',e);
})

function move(){
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
}

//#endregion
