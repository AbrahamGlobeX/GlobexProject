class ComponentPropertiesController {

    constructor(model, view) {

        this.mainModel = model;

        this.mainView = view;

    }

    init() {

        let propertiesBlock = this.mainView.centerBlock.propertiesBlock;

        propertiesBlock.bind("changePropertyViewValue", this.changePropertyViewValue.bind(this));
        
        let model = this.mainModel;

        let components = model.form.components;

        model.bind("init", propertiesBlock.onMainModelInit.bind(propertiesBlock));

        components.bind("updateComponentPropertyValue", propertiesBlock.updatePropertyValue.bind(propertiesBlock));
    }

    changePropertyViewValue(name, value) {

        let componentsModel = this.mainModel.form.components;

        for(let component of componentsModel.selectedComponents)
            component.setPropertyValue(name, value);
    }

    componentTypeElementDbClick(type) {

        let info = JSON.parse(JSON.stringify(AddComponentController.componentInitProperties[type]));

        let addComponentInfo = {

            name: this.getNewComponentName(type),

            type: info.type,

            parent: this.mainModel.form.rootName,

            properties: info.properties
        }

        this.addComponent(addComponentInfo);
    }

    addComponent(addComponentInfo) {

        this.mainModel.form.components.addComponent(addComponentInfo);
    }
}