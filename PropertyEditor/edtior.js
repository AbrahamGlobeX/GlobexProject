class Property_Editor {

    constructor() {
        this._drawWidgets = new Property_DrawWidgets();
        this._ownProps = undefined;
        this._categories = [];
        this._findedProps = [];
        this._types = {};
        this._currentCategory = undefined;
        this._currentType = undefined;
        this._currentPropRef = undefined;


        this._isSelectedProp = false;
        this._isNewProp = true;

        this._currentName = "";

        this._currentLanguage = undefined;

        this.loadOwnProps(() => {
            this.createCategories();
            this.drawMainForm();
        });
    }
    createCategories() {
       
        this._categories.push(Property_Category.create({ "en": "Characteristics", "ru": "Характеристики" }));
        this.createTypes("Characteristics");

        this._categories.push(Property_Category.create({ "en": "Location", "ru": "Местоположение" }));
        this.createTypes("Location");

        this._categories.push(Property_Category.create({ "en": "Representation", "ru": "Представление" }));
        this.createTypes("Representation");
    }
    createTypes(category) {
        try {
            this._types[category] = {};
            const types = propertyTypes[category];
            for (let type of Object.keys(types)) {
                this._types[category][type] = new types[type];
            }
        } catch (e) {
            console.error("Property_Editor.createTypes", e);
        }
    }
    loadOwnProps(callback) {
        const loaded = function (resultJSON) {
            console.log("loadOwnProps", resultJSON);
            this._ownProps = resultJSON.cursor.firstBatch;
            callback();
        }
        const request = '{"meta.owner" : {"$oid" : "' + APP.owner + '"}}';
        APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
        APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "props", request);
    }

    drawMainForm() {

        this._mainForm = this._drawWidgets.drawDialog();
        const layout = this._drawWidgets.drawVerticalLayout(this._mainForm, { "height": "100%", "minWidth": "500px" });
        this.drawTitle(layout);
        this.drawLanguage(layout);
        this.drawCategory(layout);
        this.drawName(layout);

        this._findedLayout = this._drawWidgets.drawHorizontalLayout(layout, { "width": "100%", "border": "1px solid", "margin": "10px 0", "padding": "10px" });

        this.drawDescription(layout);
        this.drawWiki(layout);
        this.drawCategoryType(layout);


        this._layoutValues = this._drawWidgets.drawHorizontalLayout(layout, { "width": "100%" });

        this.drawButtons(layout);
    }
    closeForm() {
        this._drawWidgets.destroyWidget(this._mainForm);
    }
    drawTitle(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Добавление свойства");
    }

    drawLanguage(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Язык");
        const comboBox = this._drawWidgets.drawComboBox(layout);
        const languages = {
            "ru": {
                "name": {
                    "ru": "Русский",
                    "en": "Russian"
                }
            },
            "en": {
                "name": {
                    "ru": "Английский",
                    "en": "English"
                }
            }
        }
        for (let language of Object.keys(languages)) {
            this._drawWidgets.addItemInComboBox(comboBox, languages[language]["name"]["ru"], () => {
                this._currentLanguage = language;
            });
        }
    }
    drawName(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Название");
        this._nameInput = this._drawWidgets.drawInput(layout);
        ReactComponent[this._nameInput].htmlElement.oninput = (e) => {
            if (this._isSelectedProp) {
                e.target.value = this._currentName;
                this.drawDialogConfirmNewProp();
            } else {
                this.controlNameInput(e);
            }
        }
    }
    drawDescription(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Описание");
        this._descInput = this._drawWidgets.drawInput(layout);
        ReactComponent[this._descInput].htmlElement.oninput = (e) => {
            if (this._isSelectedProp) {
                e.target.value = this._currentDesc;
                this.drawDialogConfirmNewProp();
            } else {
                this._currentDesc = e.target.value;
            }
        }
    }
    drawWiki(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Википедия");
        this._wikiInput = this._drawWidgets.drawInput(layout);
        ReactComponent[this._wikiInput].htmlElement.oninput = (e) => {
            if (this._isSelectedProp) {
                e.target.value = this._currentWiki;
                this.drawDialogConfirmNewProp();
            } else {
                this._currentWiki = e.target.value;
            }
        }
    }
    drawButtons(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });

        this._drawWidgets.drawButton(layout, "Добавить", { "color": "#123456" }, () => {
            const types = this._types[this._currentCategory];
            const type = Object.keys(types).find((item) => types[item].constructor.name == this._currentType.constructor.name);
            this.addNewProperty(this._currentLanguage, this._currentName, this._currentDesc, this._currentWiki, this._currentCategory, type, this._currentType.value, this._currentType.currentType, this._currentType.currentUnit, this._currentPropRef, "");
            this.closeForm();
        });
        this._drawWidgets.drawButton(layout, "Отмена", { "color": "#123456" }, () => {
            this.closeForm();
        });
    }
    drawCategory(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Категория");
        const comboBox = this._drawWidgets.drawComboBox(layout);

        for (let category of this._categories) {
            this._drawWidgets.addItemInComboBox(comboBox, category.getName("ru"), () => {
                this.switchCategory(category.getName("en"))
            });
        }
    }
    drawCategoryType(parentLayout) {
        const layout = this._drawWidgets.drawHorizontalLayout(parentLayout, { "width": "100%" });
        this._drawWidgets.drawLabel(layout, "Тип");
        this._comboBoxWithTypes = this._drawWidgets.drawComboBox(layout);

    }
    switchCategory(category) {
        this._drawWidgets.clearWidget(this._layoutValues);
        this._drawWidgets.clearComboBox(this._comboBoxWithTypes);
        this._comboBoxTypes = [];
        for (let type of Object.keys(this._types[category])) {
            this._drawWidgets.addItemInComboBox(this._comboBoxWithTypes, this._types[category][type].getName("ru"), () => {
                if (this._isSelectedProp) {
                    this.drawDialogConfirmNewProp();
                } else {
                    this.switchCategoryType(this._types[category][type]);
                }
            });
            this._comboBoxTypes.push(type);
        }
        this._currentCategory = category;
    }
    switchCategoryType(type) {
        this._drawWidgets.clearWidget(this._layoutValues);
        this._drawWidgets.includeWidget(this._layoutValues, type.widget);
        this._currentType = type;
    }
    controlNameInput(e) {
        if (!this._currentLanguage) {
            e.target.value = "";
            return APP.log("error", "Выберите язык");
        }
        if (!this._currentCategory) {
            e.target.value = "";
            return APP.log("error", "Выберите категорию");
        }
        this._currentName = e.target.value;
        if (this._currentName.length < 3) return;
        this.findProps();
    }
    findProps() {
        this._findedProps = [];
        const regEx = new RegExp(this._currentName, "i");
        this._findedProps = this._ownProps
            .filter((item) => item["category"] == this._currentCategory && item["lang"] == this._currentLanguage)
            .filter((item) => regEx.test(item["name"]));

        const finded = function (resultJSON) {
            console.log("resultJSON", resultJSON);
            this._findedProps = [...this._findedProps, ...resultJSON.cursor.firstBatch];
            console.log("findedProps", this._findedProps);
            this.drawFindedProps();
        }
        const request = '{"name" : {"$regex" : "' + this._currentName + '", "$options" : "im"}, "lang" : "' + this._currentLanguage + '", "category" : "' + this._currentCategory + '", "meta.owner" : {"$oid" : "591c318fe9d2600f47e37d3a"}}';
        console.log("req", request);
        APP.dbWorker.responseDOLMongoRequest = finded.bind(this);
        APP.dbWorker.sendBaseRCRequest("DOLMongoRequest", "props", request);
    }
    controlIsChangeProp(input, e) {

    }
    drawFindedProps() {
        this._drawWidgets.clearWidget(this._findedLayout);

        const listLayout = this._drawWidgets.drawVerticalLayout(this._findedLayout, { "height": "250px" });



        for (let prop of this._findedProps) {
            const layout = this._drawWidgets.drawHorizontalLayout(listLayout, { "width": "100%", "minHeight": "50px", "maxHeight": "50px" });
            ReactComponent[layout].htmlElement.onmouseover = () => {
                ReactComponent[layout].setStyleProp("background", "grey");
                ReactComponent[layout].setStyleProp("cursor", "pointer");
            }
            ReactComponent[layout].htmlElement.onmouseout = () => {
                ReactComponent[layout].setStyleProp("background", "none");
                ReactComponent[layout].setStyleProp("cursor", "contextmenu");
            }

            ReactComponent[layout].htmlElement.onclick = () => {
                this.selectFindedProp(prop);
            }

            this._drawWidgets.drawLabel(layout, prop["name"]);
            this._drawWidgets.drawLabel(layout, Characteristics_NumberType.getUnitTypeName("SI", prop["unit_type"]));
        }
    }
    selectFindedProp(prop) {
        this._currentName = ReactComponent[this._nameInput].text = prop.name;
        this._currentDesc = ReactComponent[this._descInput].text = prop.description;
        this._currentWiki = ReactComponent[this._wikiInput].text = prop.wiki;

        console.log("prop", prop);
        //this.switchCategoryType(this._types[this._currentCategory][prop["type_value"]]);
        ReactComponent[this._comboBoxWithTypes].setCurrentItem(this._comboBoxTypes.indexOf(prop["type_value"]));

        if(prop["type_value"] == "number"){
            this._types[this._currentCategory][prop["type_value"]].setCurrentType(prop["unit_type"]);
        }

        this._currentPropRef = prop["pid"] || prop["_id"];
        this._isSelectedProp = true;
        this._isNewProp = false;
    }
    drawDialogConfirmNewProp(callbackYes = undefined, callbackNo = undefined) {
        const dialog = this._drawWidgets.drawDialog();
        const mainLayout = this._drawWidgets.drawVerticalLayout(dialog, { "minWidth": "500px" });

        const questionLayout = this._drawWidgets.drawHorizontalLayout(mainLayout, { "width": "100%" });

        this._drawWidgets.drawLabel(questionLayout, "Вы действительно хотите изменить свойство? Это создаст новое свойство")

        const buttonLayout = this._drawWidgets.drawHorizontalLayout(mainLayout, { "width": "100%" });

        this._drawWidgets.drawButton(buttonLayout, "Да", { "color": "#123456" }, () => {
            this._isSelectedProp = false;
            this._drawWidgets.destroyWidget(dialog);
            if (callbackYes) {
                callbackYes();
            }
        });
        this._drawWidgets.drawButton(buttonLayout, "Нет", { "color": "#123456" }, () => {
            this._drawWidgets.destroyWidget(dialog);
            if (callbackNo) {
                callbackNo();
            }
        });
    }

}
class Property_DrawWidgets {
    constructor() {

    }
    destroyWidget(widget) {
        ReactComponent[widget].destroyWidget();
    }
    includeWidget(parentWidget, childrenWidget) {
        let widget = undefined;
        if (childrenWidget instanceof BaseWidget) {
            widget = childrenWidget;
        } else {
            widget = ReactComponent[childrenWidget];
        }
        ReactComponent[parentWidget].includeWidget(widget);
    }
    clearWidget(widget) {
        ReactComponent[widget].clearWidget();
    }
    setWidgetStyle(widget, styles) {
        for (let style of Object.keys(styles)) {
            widget.setStyleProp(style, styles[style]);
        }
    }
    drawDialog(parentID = -1, styles = {}) {
        const widget = new WidgetDialog();
        this.setWidgetStyle(widget, styles);
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
    drawHorizontalLayout(parentID, styles = {}) {
        const widget = new WidgetLayoutHorizontal();
        this.setWidgetStyle(widget, styles);
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
    drawVerticalLayout(parentID, styles = {}) {
        const widget = new WidgetLayoutVertical();
        this.setWidgetStyle(widget, styles);
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
    drawInput(parentID, styles = {}) {
        const widget = new WidgetInput();
        this.setWidgetStyle(widget, styles);
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
    drawLabel(parentID, label, styles = {}) {
        const widget = new WidgetLabel();
        this.setWidgetStyle(widget, styles);
        widget.text = label;
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
    drawComboBox(parentID, styles = {}) {
        const widget = new WidgetComboBox();
        this.setWidgetStyle(widget, styles);
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
    addItemInComboBox(comboBox, text, callback) {
        ReactComponent[comboBox].addItem(text, callback);
    }
    clearComboBox(comboBox) {
        ReactComponent[comboBox].clearItems();
    }
    drawButton(parentID, text, styles = {}, callback = undefined) {
        const widget = new WidgetButton();
        this.setWidgetStyle(widget, styles);
        widget.text = text;
        widget.htmlElement.onclick = callback;
        if (parentID != -1) {
            ReactComponent[parentID].includeWidget(widget);
        }
        return widget.id;
    }
}