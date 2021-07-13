
class FormEditFieldView {

    static propertyCategories = {}

    static componentTypeToHtmlTag = {}

    static formComponents = {};

    constructor() {

        let events = {};

        MicroEvent.mixin(events);

        this.events = events;

        this.htmlContainer = document.createElement('div');

        this.formEditFieldContainer = null;

        this.formComponentsState = {};

        this.componentsMap = {};

        this.componentWrappers = new ComponentWrappers();

        this.componentResizers = [new ComponentResizersView(this)];

        this.componentSelector = new ComponentSelectorView();
    }

    bind(event, func) {

        this.events.bind(event, func);
    }

    unbind(event, func) {

        this.events.unbind(event, func);
    }

    trigger(event, ...args) {

        args.unshift(event);

        this.events.trigger.apply(this.events, args);
    }

    initHtml() {

        let htmlContainer = this.htmlContainer;

        htmlContainer.classList.add("col-sm-8");
        htmlContainer.classList.add("text-left");

        let formEditFieldContainer = document.createElement('div');

        formEditFieldContainer.id = "formEditFieldContainer";

        formEditFieldContainer.classList.add("formEditFieldContainer");
        formEditFieldContainer.classList.add("bg-info");

        htmlContainer.appendChild(formEditFieldContainer);

        this.formEditFieldContainer = formEditFieldContainer;

        this.htmlContainer = htmlContainer;
    }

    init() {

        this.initHtml();

        document.addEventListener('keydown', event => {

            if (event.target.tagName !== 'INPUT')
                this.trigger('keydown', event.code, event.ctrlKey);
        });
    }

    static updateComponentTypeAttributes(attributes, emptyAttributes, componentType, propertyName, propertyValue) {

        let componentTypeAttributes = FormEditFieldView.componentTypeAttributes[componentType];

        if (typeof componentTypeAttributes !== 'undefined') {

            let attributeName = componentTypeAttributes[propertyName];

            if (typeof attributeName !== 'undefined') {

                attributes[attributeName] = propertyValue;

                return true;
            }
        }

        let componentTypeEmptyAttributes = FormEditFieldView.componentTypeEmptyAttributes[componentType];

        if (typeof componentTypeEmptyAttributes !== 'undefined') {

            let attributeName = componentTypeEmptyAttributes[propertyName];

            if (typeof attributeName !== 'undefined') {

                if (propertyValue) {

                    emptyAttributes[attributeName] = "";

                } else {

                    delete emptyAttributes[attributeName];
                }

                return true;
            }
        }

        return false;
    }

    static makeComponentAttributes(componentType, properties, emptyAttributes) {

        let attributes = {};

        let style = {};

        attributes.style = style;

        let categories = FormEditFieldView.propertyCategories;

        for (let propertyName in properties) {

            let ruleName = categories.style[propertyName];

            let propertyValue = properties[propertyName];

            if (typeof ruleName !== 'undefined') {

                style[ruleName] = propertyValue;

            } else {

                if (!FormEditFieldView.updateComponentTypeAttributes(attributes, emptyAttributes, componentType, propertyName, propertyValue))
                    if (propertyName !== categories.textContent && propertyName !== "name")
                        console.error("Uknown property name ", propertyName);
            }
        }

        style.position = "absolute";

        let constAttributes = FormEditFieldView.componentTypeConstAttributes[componentType];

        if (typeof constAttributes !== 'undefined')
            for (let attributeName in constAttributes)
                attributes[attributeName] = constAttributes[attributeName];

        return attributes;
    }

    updateComponentAttributes(attributes, emptyAttributes, componentType, propertyName, propertyValue) {

        let style = attributes.style;

        let categories = FormEditFieldView.propertyCategories;

        let ruleName = categories.style[propertyName];

        if (typeof ruleName !== 'undefined') {

            style[ruleName] = propertyValue;

        } else {

            if (!FormEditFieldView.updateComponentTypeAttributes(attributes, emptyAttributes, componentType, propertyName, propertyValue))
                if (propertyName !== categories.textContent && propertyName !== "name")
                    console.error("Uknown property name ", propertyName);

        }
    }

    static makeComponentWrapperInfo(componentType, componentName, componentState, parentComponentName) {

        let style = componentState.attributes.style;

        return {

            componentType: componentType,

            componentName: componentName,

            left: style.left,
            top: style.top,
            width: style.width,
            height: style.height,

            parentComponentName: parentComponentName
        }
    }

    static makeComponentWrapperUpdateInfo(componentName, propertyName, propertyValue) {

        let ruleName = FormEditFieldView.propertyCategories.style[propertyName];

        if (typeof ruleName === 'undefined')
            return null;

        if (ruleName === "left" || ruleName === "top"
            || ruleName === "width" || ruleName === "height")
            return {

                componentName: componentName,

                ruleName: ruleName,

                value: propertyValue
            }

        return null;
    }

    static isGeomertyProperty(name) {

        return name === 'x' || name === 'y' || name === 'width' || name === 'height';
    }

    onModelAddRootComponent(properties) {

        let componentState = this.formComponentsState;

        let name = properties.name;

        let type = "root";

        componentState.id = name;

        componentState.htmlTag = "div";

        componentState.children = [];

        let emptyAttributes = {};

        let attributes = FormEditFieldView.makeComponentAttributes(type, properties, emptyAttributes);

        componentState.attributes = attributes;

        componentState.emptyAttributes = emptyAttributes;

        this.componentsMap[name] = componentState;

        const formRootComponent = new FormRootComponent(this.formEditFieldContainer, attributes);

        this.componentWrappers.init(this.formEditFieldContainer);

        this.componentWrappers.add(FormEditFieldView.makeComponentWrapperInfo(type, name, componentState, null));

        this.formEditFieldContainer.appendChild(this.componentWrappers.get(name));

        this.componentResizers[0].init(this.formEditFieldContainer, type, name, true);

        this.componentSelector.init(this.formEditFieldContainer, this.componentWrappers.get(name));

        for (let propertyName in properties) {

            let widgetParameterName = FormEditFieldView.propertiesToWidgetsParameters[propertyName];

            if (typeof widgetParameterName === 'undefined')
                widgetParameterName = propertyName;

            let suffix = FormEditFieldView.propertiesToWidgetsParametersSuffixes[propertyName];

            if (typeof suffix === 'undefined')
                suffix = "";

            // if (typeof reactComponent[widgetParameterName] != 'undefined')
            formRootComponent[widgetParameterName] = properties[propertyName] + suffix;
        }

        if(typeof FormEditFieldView.formComponents == 'undefined')
            FormEditFieldView.formComponents = {};

        FormEditFieldView.formComponents[name] = formRootComponent;
    }

    static setTextContent(componentState, componentType, properties) {

        let textPopertyName = FormEditFieldView.propertyCategories.textContent;

        let textContent = properties[textPopertyName];

        if (typeof textContent !== 'undefined') {

            let componentTypeAttributes = FormEditFieldView.componentTypeAttributes[componentType];

            let componentTypeEmptyAttributes = FormEditFieldView.componentTypeEmptyAttributes[componentType];

            if ((typeof componentTypeAttributes === 'undefined' ||
                typeof componentTypeAttributes[textPopertyName] === 'undefined') &&
                (typeof componentTypeEmptyAttributes === 'undefined' ||
                    typeof componentTypeEmptyAttributes[textPopertyName] === 'undefined')
            )
                componentState.textContent = textContent;
        }
    }

    onModelAddComponent(componentInfo) {

        let type = componentInfo.type;

        let name = componentInfo.name;

        let componentState = {};

        componentState.id = name;

        componentState.htmlTag = FormEditFieldView.componentTypeToHtmlTag[type];

        componentState.component = type;

        if (typeof componentInfo.children !== 'undefined')
            componentState.children = [];

        let properties = componentInfo.properties;

        let emptyAttributes = {};

        componentState.attributes = FormEditFieldView.makeComponentAttributes(type, properties, emptyAttributes);

        componentState.emptyAttributes = emptyAttributes;

        FormEditFieldView.setTextContent(componentState, type, properties);

        componentState.children = componentInfo.children;

        this.componentsMap[name] = componentState;

        let parentName = componentInfo.parentName;

        this.componentsMap[parentName].children.push(componentState.id);

        this.componentWrappers.add(FormEditFieldView.makeComponentWrapperInfo(type, name, componentState, parentName));

        // this.updateFormRootState();

        FormEditFieldView.formComponents[name] = new widgetsComponentsTypes[type]();

        const reactComponent = FormEditFieldView.formComponents[name];

        for (let propertyName in properties) {

            let widgetParameterName = FormEditFieldView.propertiesToWidgetsParameters[propertyName];

            if (typeof widgetParameterName === 'undefined')
                widgetParameterName = propertyName;

            let suffix = FormEditFieldView.propertiesToWidgetsParametersSuffixes[propertyName];

            if (typeof suffix === 'undefined')
                suffix = "";

            // if (typeof reactComponent[widgetParameterName] != 'undefined')
                reactComponent[widgetParameterName] = properties[propertyName] + suffix;
        }

        FormEditFieldView.formComponents[parentName].includeWidget(reactComponent);
    }

    updateComponentStateProperty(updateInfo) {

        let type = updateInfo.componentType;

        let componentName = updateInfo.componentName;

        let componentState = this.componentsMap[componentName];

        let propertyName = updateInfo.propertyName;

        if (propertyName === 'name') {

            componentState.id = componentName;

            // this.updateFormRootState();

            return;
        }

        let propertyValue = updateInfo.propertyValue;

        this.updateComponentAttributes(componentState.attributes, componentState.emptyAttributes, type, propertyName, propertyValue);

        if (propertyName === FormEditFieldView.propertyCategories.textContent) {

            let properties = {};

            properties[propertyName] = propertyValue;

            FormEditFieldView.setTextContent(componentState, type, properties);
        }

        this.componentWrappers.update(FormEditFieldView.makeComponentWrapperUpdateInfo(componentName, propertyName, propertyValue));

        if (FormEditFieldView.isGeomertyProperty(propertyName)) {

            let resizer = this.componentResizers.find((element) => { return element.componentName == componentName });

            resizer.updateGeometryProperty(type, this.componentWrappers.get(componentName));
        }

        const reactComponent = FormEditFieldView.formComponents[componentName];


        let widgetParameterName = FormEditFieldView.propertiesToWidgetsParameters[propertyName];

        if (typeof widgetParameterName === 'undefined')
            widgetParameterName = propertyName;

        let suffix = FormEditFieldView.propertiesToWidgetsParametersSuffixes[propertyName];

        if (typeof suffix === 'undefined')
            suffix = "";

        // if (typeof reactComponent[widgetParameterName] != 'undefined')
            reactComponent[widgetParameterName] = propertyValue + suffix;
    }

    onModelUpdateComponentPropertyValue(updateInfo) {

        this.updateComponentStateProperty(updateInfo);
    }

    updateResizer(resizer, component, mainStyle = false) {

        let properties = component.properties;

        let resizersUpdateInfo = {

            width: properties.width,
            height: properties.height,

            componentType: component.type,

            componentName: properties.name,

            wrapperHtmlElement: this.componentWrappers.get(properties.name),

            mainStyle: mainStyle
        }

        resizer.update(resizersUpdateInfo);
    }

    onChangeSelectedComponents(components) {

        if (components.length === 0)
            return;

        let resizers = this.componentResizers;

        if (resizers === null)
            return;

        let length = components.length;

        let resizersLength = resizers.length;

        if (length < resizersLength) {

            for (let i = length; i < resizersLength; ++i)
                resizers[i].destroy();

            resizers.splice(length, resizersLength - length);

        } else if (length > resizersLength) {

            for (let i = resizersLength; i < length; ++i) {

                let resizer = new ComponentResizersView(this);

                let component = components[i];

                resizer.init(this.formEditFieldContainer, component.type, component.properties.name);

                resizers.push(resizer);
            }
        }

        this.updateResizer(resizers[0], components[0], true);

        for (let i = 1; i < components.length; ++i)
            this.updateResizer(resizers[i], components[i]);
    }

    onChangeMainSelectedComponent(componentName) {

        let resizers = this.componentResizers;

        resizers.find((element) => { return element.mainStyle }).updateMainStyle();

        resizers.find((element) => { return element.componentName == componentName }).updateMainStyle(true);
    }

    onModelDeleteComponent(name, parentName) {

        let componentsMap = this.componentsMap;

        let parent = componentsMap[parentName];

        parent.children = parent.children.filter(item => !(item.id === name));

        delete componentsMap[name];

        this.componentWrappers.remove(name);

        FormEditFieldView.formComponents[parentName].excludeWidget(FormEditFieldView.formComponents[name]);

        delete FormEditFieldView.formComponents[name];
        // this.updateFormRootState();
    }


    onChangeEditMode(value) {

        if (value) {

            this.componentResizers[0].show();
            this.componentWrappers.show();
        }
        else {

            this.componentWrappers.hide();
            this.componentResizers[0].hide();
        }
    }
}

FormEditFieldView.propertyCategories = {

    style: {
        "x": "left",
        "y": "top",
        "width": "width",
        "height": "height",
        "position": "position",
        "backgroundColor": "backgroundColor",
        "text-align": "textAlign"
    },

    textContent: "text"

}

FormEditFieldView.componentTypeToHtmlTag = {

    div: "div",

    button: "button",

    input: "input",

    checkbox: "input",

    label: "label"

}

FormEditFieldView.componentTypeConstAttributes = {

    "checkBox": { "type": "checkbox" }

}

FormEditFieldView.componentTypeAttributes = {

    "input": { "text": "value" },
    "checkBox": { "checked": "checked" }

}

FormEditFieldView.componentTypeEmptyAttributes = {

    "checkBox": { "checked": "checked" }
}

FormEditFieldView.propertiesToWidgetsParameters = {

    "x": "posX",
    "y": "posY"
}

FormEditFieldView.propertiesToWidgetsParametersSuffixes = {

    "x": "px",
    "y": "px",
    "width": "px",
    "height": "px"
}