class DeleteComponentController {

    static containerComponentTypes = null;

    constructor(model, view) {

        this.mainModel = model;

        this.mainView = view;
    }

    init() {

        let formEditField = this.mainView.centerBlock.formEditField;
        let componentTree = this.mainView.centerBlock.componentTree;

        let components = this.mainModel.form.components;

        components.bind("deleteComponent", formEditField.onModelDeleteComponent.bind(formEditField));
        components.bind("deleteComponent", componentTree.onModelDeleteComponent.bind(componentTree));
    }

    deleteComponent(name) {

        let components = this.mainModel.form.components;

        components.deleteComponent(name);

        //components.setSelectedComponentByName(name);
    }

    collectComponentChildren(component, collection) {

        for(let child of component.children) {

            collection.push(child);

            if(typeof child.children != 'undefined')
                this.collectComponentChildren(child, collection);
        }
    }

    deleteSelectedComponents() {

        let components = this.mainModel.form.components;

        let selectedComponents = components.selectedComponents;

        if(selectedComponents[0].name === 'formRoot')
            return;

        let toDeleteComponents = [...selectedComponents];

        for(let i = 0; i < selectedComponents.length; ++i)
            if(typeof selectedComponents[i].children != 'undefined')
                this.collectComponentChildren(selectedComponents[i], toDeleteComponents);

        let creationStack = components.componentsCreationStack;

        for(let i = creationStack.length - 1; i >= 0; --i)
            if(toDeleteComponents.indexOf(creationStack[i]) === -1) {

                components.setSelectedComponentByName(creationStack[i].name);

                break;
            }

        for(let i = toDeleteComponents.length - 1; i >= 0; --i)
            this.deleteComponent(toDeleteComponents[i].name);
    }

    onDeleteKeydown() {

        this.deleteSelectedComponents();
    }
}


DeleteComponentController.containerComponentTypes = new Set(['root', 'div']);
