class ComponentSelectionController {

    static containerComponentTypes = null;

    constructor(model, view) {

        this.mainModel = model;

        this.mainView = view;

        this.selectionStartX = null;
        this.selectionStartY = null;

        this.selectionComponent = null;

        this.selectionStarted = false;

        this.selctorStartGeometry = {

            x: null,
            y: null,
            width: null,
            height: null
        }

        this.onComponentWrapperMouseMove = this.onComponentWrapperMouseMove.bind(this);
        this.onComponentWrapperMouseUp = this.onComponentWrapperMouseUp.bind(this);

        this.selectorViewStartSelection = null;
        this.selectorViewUpdate = null;
        this.selectorViewEndSelection = null;
    }

    init() {

        let model = this.mainModel;
        let view = this.mainView;

        let centerBlock = view.centerBlock;

        let formEditField = centerBlock.formEditField;

        let components = model.form.components;
        let propertiesView = centerBlock.propertiesBlock;

        components.bind('onChangeSelectedComponents', propertiesView.onChangeSelectedComponents.bind(propertiesView));
        components.bind('onChangeSelectedComponents', formEditField.onChangeSelectedComponents.bind(formEditField));
        components.bind('onChangeMainSelectedComponent', formEditField.onChangeMainSelectedComponent.bind(formEditField));

        let componentTree = centerBlock.componentTree;

        componentTree.bind('onComponentTreeNodeSelected', this.onComponentTreeNodeSelected.bind(this));

        let componentSelectorView = formEditField.componentSelector;

        this.selectorViewStartSelection = componentSelectorView.startSelection.bind(componentSelectorView);
        this.selectorViewUpdate = componentSelectorView.updateSelection.bind(componentSelectorView);
        this.selectorViewEndSelection = componentSelectorView.endSelection.bind(componentSelectorView);
    }

    setSelectedComponentByName(name) {

        this.mainModel.form.components.setSelectedComponentByName(name);
    }

    setMainSelectedComponentByName(name) {

        this.mainModel.form.components.setMainSelectedComponentByName(name);
    }

    setSelectedComponents(components) {

        this.mainModel.form.components.setSelectedComponents(components);
    }

    calcSelectionComponentAbsolutePosition() {

        let component = this.selectionComponent;

        let x = component.getPropertyValue('x');
        let y = component.getPropertyValue('y');

        let currentComponent = component.parent;

        if (currentComponent === null)
            return { x: 0, y: 0 }

        while (currentComponent.name != 'formRoot') {

            x += currentComponent.getPropertyValue('x');
            y += currentComponent.getPropertyValue('y');

            currentComponent = currentComponent.parent
        }

        return { x: x, y: y };
    }

    calcSelectorRelativePosition() {

        let selectionComponentPosition = this.calcSelectionComponentAbsolutePosition();

        let selectorGeometry = this.mainModel.componentSelector.geometry;

        return {
            x: selectorGeometry.x - selectionComponentPosition.x,
            y: selectorGeometry.y - selectionComponentPosition.y
        }
    }

    isBoxIntersected(component, box) {

        let x = component.getPropertyValue('x');
        let y = component.getPropertyValue('y');
        let width = component.getPropertyValue('width');
        let height = component.getPropertyValue('height');

        if (x > box.x + box.width) return false;
        if (y > box.y + box.height) return false;
        if (x + width < box.x) return false;
        if (y + height < box.y) return false;

        return true;
    }

    updateSelectedComponents() {

        let selectorRelativePosition = this.calcSelectorRelativePosition();

        let selectorGeometry = this.mainModel.componentSelector.geometry;

        let box = {
            x: selectorRelativePosition.x,
            y: selectorRelativePosition.y,
            width: selectorGeometry.width,
            height: selectorGeometry.height,
        }

        let selectionComponent = this.selectionComponent;

        let selectedComponents = [];

        for (let component of selectionComponent.children)
            if (this.isBoxIntersected(component, box))
                selectedComponents.push(component);

        if (selectedComponents.length > 0) {

            selectedComponents.sort((elem1, elem2)=>{

                let id1 = parseInt(elem1.name.replace(/\D/g,''));
                let id2 = parseInt(elem2.name.replace(/\D/g,''));

                if(id1 < id2)   return -1;
                if(id1 > id2)   return 1;

                return 0;
            });

            this.setSelectedComponents(selectedComponents);
        }
    }

    onComponentWrapperMouseMove(x, y) {
        
        if (!this.selectionStarted) {

            if (ComponentSelectionController.containerComponentTypes.has(this.selectionComponent.type))
                this.startSelection(x, y);

            this.selectionStarted = true;
        }

        let startX = this.selectionStartX;
        let startY = this.selectionStartY;

        let selectorX = Math.min(startX, x);
        let selectorY = Math.min(startY, y);

        let selectorWidth = Math.abs(x - startX);
        let selectorHeight = Math.abs(y - startY);

        this.mainModel.componentSelector.update(selectorX, selectorY, selectorWidth, selectorHeight);
    }

    onComponentWrapperMouseUp() {
        
        let componentWrappers = this.mainView.centerBlock.formEditField.componentWrappers;

        componentWrappers.unbind('onComponentWrapperMouseMove', this.onComponentWrapperMouseMove);
        componentWrappers.unbind('onComponentWrapperMouseUp', this.onComponentWrapperMouseUp);

        if(this.selectionStarted) {

            let componentSelector = this.mainModel.componentSelector;

            componentSelector.unbind('onStartSelection', this.selectorViewStartSelection);
            componentSelector.unbind('onUpdate', this.selectorViewUpdate);
    
            componentSelector.endSelection();
    
            componentSelector.unbind('onEndSelection', this.selectorViewEndSelection);
    
            this.updateSelectedComponents();
    
            this.selectionStarted = false;
        }
    }

    startSelection(x, y) {

        let componentSelector = this.mainModel.componentSelector;

        componentSelector.bind('onStartSelection', this.selectorViewStartSelection);
        componentSelector.bind('onUpdate', this.selectorViewUpdate);
        componentSelector.bind('onEndSelection', this.selectorViewEndSelection);

        componentSelector.startSelection(x, y);
    }

    onComponentWrapperMouseDown(componentName, x, y) {

        let components = this.mainModel.form.components;

        let component = components.getComponent(componentName);

        let selectedComponents = components.selectedComponents;

        if (!selectedComponents.includes(component))
            this.setSelectedComponentByName(componentName);
        else
            this.setMainSelectedComponentByName(componentName);

        if (!ComponentSelectionController.containerComponentTypes.has(component.type))
            return;

        this.selectionStartX = x;
        this.selectionStartY = y;

        this.selectionComponent = component;

        let formEditField = this.mainView.centerBlock.formEditField;

        let componentWrappers = formEditField.componentWrappers;

        componentWrappers.bind('onComponentWrapperMouseMove', this.onComponentWrapperMouseMove);

        componentWrappers.bind('onComponentWrapperMouseUp', this.onComponentWrapperMouseUp);
    }

    onComponentTreeNodeSelected(nodeText) {

        this.setSelectedComponentByName(nodeText);
    }
}

ComponentSelectionController.containerComponentTypes = new Set(['root', 'div']);