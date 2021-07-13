class ComponentsModel extends BaseModel {
    static customComponentTypes = {};

    constructor() {

        super();

        this.components = null;

        this.componentsCreationStack = [];

        this.selectedComponents = null;
    }

    init() {

        this.components = {};

        this.selectedComponents = [];
    }

    getComponent(name) {

        if (this.components !== null)
            return this.components[name];
        else
            return null;
    }

    addRootComponent(properties) {

        let name = properties.name;

        let root = new ComponentsModel.customComponentTypes["root"](this);

        root.init(name, "root", properties);

        this.components[name] = root;

        this.componentsCreationStack.push(root);

        this.trigger("addRootComponent", properties);

        

        APP.form.widgets = this.toJson();
        // APP.script.store.widgets = this.toJson();
    }

    makeComponent(componentInfo) {

        let type = componentInfo.type;

        let componentClass = ComponentsModel.customComponentTypes[type];

        if (typeof componentClass === 'undefined')
            componentClass = BaseComponentModel;

        let name = componentInfo.name;

        let properties = componentInfo.properties;

        let component = new componentClass(this);

        component.init(name, type, properties);

        let parent = this.components[componentInfo.parentName];

        component.parent = parent;

        return component;
    }

    addComponent(component) {

        let name = component.name;

        this.components[name] = component;

        this.componentsCreationStack.push(component);

        let parentName = component.parent.name;

        if (parentName !== null) {

            let parent = this.components[parentName];

            parent.children.push(component);
        }

        let addComponentInfo = {

            name: name,

            type: component.type,

            parentName: parentName,

            properties: component.getPropertyValues()
        };

        if (component instanceof ContainerComponentModel)
            addComponentInfo.children = [];

        this.trigger("addComponent", addComponentInfo);

        APP.form.widgets = this.toJson();
        // APP.script.store.widgets = this.toJson();
    }

    addNewComponent(componentInfo) {

        let component = this.makeComponent(componentInfo);

        this.addComponent(component);
    }

    setSelectedComponentByName(name) {

        let selectedComponents = this.selectedComponents;

        if (selectedComponents.length === 1 && selectedComponents[0] === name)
            return;

        let component = this.components[name];

        this.selectedComponents = [component];

        this.trigger('onChangeSelectedComponents', [{ type: component.type, properties: component.getPropertyValues() }])
    }

    setMainSelectedComponentByName(name) {

        let selectedComponents = this.selectedComponents;

        if (selectedComponents[0].name === name)
            return;

        let componentIndex = selectedComponents.indexOf(this.getComponent(name));

        let buf = selectedComponents[0];

        selectedComponents[0] = selectedComponents[componentIndex];

        selectedComponents[componentIndex] = buf;

        this.trigger('onChangeMainSelectedComponent', name);

    }

    setSelectedComponents(components) {

        this.selectedComponents = components;

        let changeInfo = [];

        for (let component of components)
            changeInfo.push({ type: component.type, properties: component.getPropertyValues() });

        this.trigger('onChangeSelectedComponents', changeInfo);
    }

    deleteComponent(name) {

        let component = this.getComponent(name);

        let selectedComponents = this.selectedComponents;

        let index = selectedComponents.indexOf(component);

        if (index !== -1)
            selectedComponents.splice(index, 1);

        delete this.components[name];

        let stackIndex = this.componentsCreationStack.indexOf(component);

        if (stackIndex !== -1)
            this.componentsCreationStack.splice(stackIndex, 1);

        let parent = component.parent;

        let parentChildren = parent.children;

        let childIndex = parentChildren.indexOf(component);

        if (childIndex !== -1)
            parentChildren.splice(childIndex, 1);

        this.trigger("deleteComponent", name, parent.name);

        APP.form.widgets = this.toJson();
        // APP.script.store.widgets = this.toJson();
    }

    toJson() {

        const res = {};

        for(let component of this.componentsCreationStack)
            res[component.name] = component.toJson();
        
        return res;
    }

    fromJson(widgets) {

        let newComponentsIds = ["formRoot"];

        widgets.formRoot.name = 'formRoot';
        widgets.formRoot.type = 'div';

        const components = this.components;

        while(newComponentsIds.length != 0) {

            const component = widgets[newComponentsIds.shift()];

            components[component.name] = this.makeComponent(component);

            this.componentsCreationStack.push(components[component.name]);

            if(typeof component.children !== 'undefined')
                newComponentsIds = newComponentsIds.concat(...component.children);
        }

        for(let componentId in this.components) {

            const children = widgets[componentId].children;

            if(typeof children != 'undefined')
                for(let childId of children) {

                    const child = components[childId];

                    const component = components[componentId];

                    component.children.push(child);

                    child.parent = component;
                }
        }
    }
}


ComponentsModel.customComponentTypes = {

    "root": DivComponentModel,

    "div": DivComponentModel,

    "button": ButtonComponentModel,

    "input": InputComponentModel,

    "checkBox": CheckBoxComponentModel,

    "label": LabelComponentModel,
    
	"layoutVertical" : ContainerComponentModel,
	"layoutHorizontal" : ContainerComponentModel,
	"layoutGrid" : ContainerComponentModel,
	"layoutFlex" : ContainerComponentModel,
	"tab" : ContainerComponentModel,
	"sideBars" : ContainerComponentModel,
	"messagesViewer" : ContainerComponentModel,
	"comboBox" : ContainerComponentModel,
	"spinBox" : ContainerComponentModel,
	"geoMap" : ContainerComponentModel
}

ComponentsModel.componentTypeNames = [

    //"div",

    "button",

    "label",

    "input",

    "checkBox",

	"layoutVertical",
	"layoutHorizontal",
	"layoutGrid",
	"layoutFlex",
	"tab",
	"sideBars",
	"messagesViewer",
	"contacts",
	"loading",
	"comboBox",
	"calendar",
	"tree",
	"spinBox",
	"geoMap"
]