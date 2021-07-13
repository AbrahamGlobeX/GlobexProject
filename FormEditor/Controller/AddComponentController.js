class AddComponentController {

    static containerComponentTypes = null;

    static newComponentPositionOffset = null;

    static componentInitProperties = {};

    static componentId = 0;

    static componentIds = {};

    constructor(model, view) {

        this.mainModel = model;

        this.mainView = view;
    }

    init() {

        let toolboxView = this.mainView.centerBlock.componentToolbox;

        let formEditField = this.mainView.centerBlock.formEditField;
        let componentTree = this.mainView.centerBlock.componentTree;

        toolboxView.bind("componentTypeElementDbClick", this.componentTypeElementDbClick.bind(this));
        formEditField.componentWrappers.bind("drop", this.dropComponentTypeElementOnComponent.bind(this));

        let model = this.mainModel;

        let components = model.form.components;

        components.bind("addRootComponent", formEditField.onModelAddRootComponent.bind(formEditField));
        components.bind("addComponent", formEditField.onModelAddComponent.bind(formEditField));
        components.bind("updateComponentPropertyValue", formEditField.onModelUpdateComponentPropertyValue.bind(formEditField));
        
        components.bind("addRootComponent", componentTree.onModelAddRootComponent.bind(componentTree));
        components.bind("addComponent", componentTree.onModelAddComponent.bind(componentTree));
    }

    static initComponentIds() {

        for(let type in AddComponentController.componentInitProperties)
            AddComponentController.componentIds[type] = 0;
    }

    getNewComponentName(type) {

        const id = AddComponentController.componentIds[type];

        if(typeof id === "undefined")
            type = "widget";

        return type + AddComponentController.componentIds[type]++;
    }

    componentTypeElementDbClick(type) {

        let info;

        if(typeof AddComponentController.componentInitProperties[type] === 'undefined') {

            info = JSON.parse(JSON.stringify(AddComponentController.componentInitProperties['widget']));

            info.type = type;

        } else {

            info = JSON.parse(JSON.stringify(AddComponentController.componentInitProperties[type]));
        }

        let components = this.mainModel.form.components;

        let selectedComponent = components.selectedComponents[0];

        let selectedComponentType = selectedComponent.type;

        if(ComponentSelectionController.containerComponentTypes.has(selectedComponentType))
            info.parentName = selectedComponent.name;
        else
            info.parentName = selectedComponent.parent.name;

        this.addComponent(info);
    }

    dropComponentTypeElementOnComponent(dropInfo) {

        let componentType = dropInfo.droppedType;

        let info;

        if(typeof AddComponentController.componentInitProperties[componentType] === 'undefined') {

            info = JSON.parse(JSON.stringify(AddComponentController.componentInitProperties['widget']));

            info.type = componentType;

        } else {

            info = JSON.parse(JSON.stringify(AddComponentController.componentInitProperties[componentType]));
        }

        info.properties.x =  parseInt(dropInfo.x);
        info.properties.y =  parseInt(dropInfo.y);
        
        let componentName = dropInfo.componentName;

        let component = this.mainModel.form.components.getComponent(componentName);

        if(component instanceof ContainerComponentModel)
            info.parentName = componentName;
        else
            info.parentName = this.mainModel.form.rootName;

        this.addComponent(info);
    }

    addRootComponent() {

        let info = JSON.parse(JSON.stringify(AddComponentController.componentInitProperties["root"]));

        let properties = info.properties;

        let name = this.mainModel.form.rootName;

        properties.name = name;

        let components = this.mainModel.form.components;
        
        components.addRootComponent(properties);

        components.setSelectedComponentByName(name);
    }

    addComponent(info) {

        let type = info.type;

        let name = this.getNewComponentName(type);

        info.properties.name = name;

        let addComponentInfo = {

            name: name,

            type: type,

            parentName: info.parentName,

            properties: info.properties
        }

        let components = this.mainModel.form.components;

        components.addNewComponent(addComponentInfo);

        components.setSelectedComponentByName(name);
    }
}

AddComponentController.componentInitProperties = {

    "root": {

        properties: {
            "x" : 50,
            "y" : 50,
            "width" : 502,
            "height" : 500,
            "backgroundColor" : "#ffffff"
        }
    },

    "button": {

        type: "button",

        properties: {
            "x" : 0,
            "y" : 0,
            "width" : 75,
            "height" : 23,
            "position" : "absolute",
            "text" : "Button"
        }
    },

    "label": {

        type: "label",

        properties: {
            "x" : 0,
            "y" : 0,
            "width" : 35,
            "height" : 13,
            "position" : "absolute",
            "text" : "Label"
        }
    },

    "input": {

        type: "input",

        properties: {
            "x" : 0,
            "y" : 0,
            "width" : 100,
            "height" : 20,
            "position" : "absolute",
            "text" : "txt"
        }
    },

    "checkBox": {

        type: "checkBox",

        properties: {
            "x" : 0,
            "y" : 0,
            "width" : 18,
            "height" : 17,
            "position" : "absolute",
            "checked" : false
        }
    },
    
    "div": {
        type: "div",

        properties: {
            "x" : 50,
            "y" : 50,
            "width" : 50,
            "height" : 50,
            "backgroundColor" : "#ffffff"
        }
    },

    "widget": {
        
        properties: {
            "x" : 50,
            "y" : 50,
            "width" : 50,
            "height" : 50,
            "backgroundColor" : "#aaaaaa"
        }
    },

    "geoMap": {
        type: "geoMap",
        properties: {
            "x" : 50,
            "y" : 50,
            "width" : 200,
            "height" : 100,
            "backgroundColor" : "#aaaaaa"
        }
    }

}

AddComponentController.initComponentIds();

AddComponentController.containerComponentTypes = new Set(['root', 'div']);

AddComponentController.newComponentPositionOffset = 8;
