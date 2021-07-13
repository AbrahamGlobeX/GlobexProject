class ComponentResizeController {

    static minComponentSize = 1;

    static containerComponentTypes = null;

    constructor(model, view) {

        this.mainModel = model;

        this.mainView = view;

        this.resizerName = null;

        this.resizeStartX = null;
        this.resizeStartY = null;

        this.resizeStartComponentsGeometry = {}

        this.onComponentResizerMouseMove = this.onComponentResizerMouseMove.bind(this);
        this.onComponentResizerMouseUp = this.onComponentResizerMouseUp.bind(this);

        this.onComponentWrapperMouseMove = this.onComponentWrapperMouseMove.bind(this);
        this.onComponentWrapperMouseUp = this.onComponentWrapperMouseUp.bind(this);

        this.onComponentResizerMoverMouseMove = this.onComponentResizerMoverMouseMove.bind(this);
        this.onComponentResizerMoverMouseUp = this.onComponentResizerMoverMouseUp.bind(this);

        this.onComponentResizerSideMoverMouseMove = this.onComponentResizerSideMoverMouseMove.bind(this);
        this.onComponentResizerSideMoverMouseUp = this.onComponentResizerSideMoverMouseUp.bind(this);
    }

    init() {

        let view = this.mainView;

        let formEditField = view.centerBlock.formEditField;

        formEditField.bind('onComponentResizerMouseDown', this.onComponentResizerMouseDown.bind(this));
        formEditField.bind('onComponentResizerMoverMouseDown', this.onComponentResizerMoverMouseDown.bind(this));
        formEditField.bind('onComponentResizerSideMoverMouseDown', this.onComponentResizerSideMoverMouseDown.bind(this));
    }

    onComponentResizerMouseDown(name, e) {

        this.resizerName = name;

        this.resizeStartX = e.clientX;
        this.resizeStartY = e.clientY;

        let components = this.mainModel.form.components;

        for (let component of components.selectedComponents) {

            let geometry = {};

            geometry.x = component.getPropertyValue("x");

            geometry.y = component.getPropertyValue("y");

            geometry.width = component.getPropertyValue("width");

            geometry.height = component.getPropertyValue("height");

            this.resizeStartComponentsGeometry[component.name] = geometry;
        }

        let formEditField = this.mainView.centerBlock.formEditField;

        formEditField.bind('onComponentResizerMouseMove', this.onComponentResizerMouseMove);
        formEditField.bind('onComponentResizerMouseUp', this.onComponentResizerMouseUp);
    }

    updateComponentGeometryResizerE(component, startGeometry, xDif, yDif) {

        let width = startGeometry.width;

        let newWidth = width + xDif;

        let minSize = ComponentResizeController.minComponentSize;

        component.setPropertyValue("width", newWidth > 0 ? newWidth : minSize);
    }

    updateComponentGeometryResizerS(component, startGeometry, xDif, yDif) {

        let height = startGeometry.height;

        let newHeight = height + yDif;

        let minSize = ComponentResizeController.minComponentSize;

        component.setPropertyValue("height", newHeight > 0 ? newHeight : minSize);
    }

    updateComponentGeometryResizerW(component, startGeometry, xDif, yDif) {

        let x = startGeometry.x;

        let width = startGeometry.width;

        let newWidth = width - xDif;

        let minSize = ComponentResizeController.minComponentSize;

        if (newWidth > 0) {

            component.setPropertyValue("width", newWidth);
            component.setPropertyValue("x", x + xDif);

        } else {

            component.setPropertyValue("width", minSize);
            component.setPropertyValue("x", x + width - minSize);
        }
    }

    updateComponentGeometryResizerN(component, startGeometry, xDif, yDif) {

        let y = startGeometry.y;

        let height = startGeometry.height;

        let newHeight = height - yDif;

        let minSize = ComponentResizeController.minComponentSize;

        if (newHeight > 0) {

            component.setPropertyValue("height", newHeight);
            component.setPropertyValue("y", y + yDif);

        } else {

            component.setPropertyValue("height", minSize);
            component.setPropertyValue("y", y + height - minSize);
        }
    }

    initStartSelectedComponentsPos() {

        let selectedComponents = this.mainModel.form.components.selectedComponents;

        for(let component of selectedComponents) {

            let geometry = {};

            geometry.x = component.getPropertyValue("x");
    
            geometry.y = component.getPropertyValue("y");

            this.resizeStartComponentsGeometry[component.name] = geometry;
        }
    }
    
    updateSelectedComponentsPos(xDif, yDif) {

        let selectedComponents = this.mainModel.form.components.selectedComponents;

        for(let component of selectedComponents) {

            let geometry = this.resizeStartComponentsGeometry[component.name];

            component.setPropertyValue("x", geometry.x + xDif);
    
            component.setPropertyValue("y", geometry.y + yDif);
        }
    }

    onComponentResizerMouseMove(event) {

        let resizerName = this.resizerName;

        let components = this.mainModel.form.components;

        let startGeometry = this.resizeStartComponentsGeometry;

        let xDif = event.clientX - this.resizeStartX;
        let yDif = event.clientY - this.resizeStartY;

        let componentGeometryUpdates = [];

        if (resizerName == "e" || resizerName == "ne" || resizerName == "se")
            componentGeometryUpdates.push(this.updateComponentGeometryResizerE);

        if (resizerName == "s" || resizerName == "se" || resizerName == "sw")
            componentGeometryUpdates.push(this.updateComponentGeometryResizerS);

        if (resizerName == "w" || resizerName == "nw" || resizerName == "sw")
            componentGeometryUpdates.push(this.updateComponentGeometryResizerW);

        if (resizerName == "nw" || resizerName == "n" || resizerName == "ne")
            componentGeometryUpdates.push(this.updateComponentGeometryResizerN);

        for(let updateFunc of componentGeometryUpdates)
            for (let component of components.selectedComponents)
                updateFunc(component, startGeometry[component.name], xDif, yDif);
    }

    onComponentResizerMouseUp() {

        let formEditField = this.mainView.centerBlock.formEditField;

        formEditField.unbind('onComponentResizerMouseMove', this.onComponentResizerMouseMove);
        formEditField.unbind('onComponentResizerMouseUp', this.onComponentResizerMouseUp);

        this.resizeStartComponentsGeometry = {};
    }

    onComponentWrapperMouseMove(x, y) {

        this.updateSelectedComponentsPos(x - this.resizeStartX, y - this.resizeStartY);
    }

    onComponentWrapperMouseUp() {

        let componentWrappers = this.mainView.centerBlock.formEditField.componentWrappers;

        componentWrappers.unbind('onComponentWrapperMouseMove', this.onComponentWrapperMouseMove);
        componentWrappers.unbind('onComponentWrapperMouseUp', this.onComponentWrapperMouseUp);

        this.resizeStartComponentsGeometry = {};
    }

    onComponentWrapperMouseDown(componentName, x, y) {

        if (componentName === "formRoot")
            return;

        let components = this.mainModel.form.components;

        if (ComponentResizeController.containerComponentTypes.has(components.getComponent(componentName).type))
            return;

        this.resizeStartX = x;
        this.resizeStartY = y;

        this.initStartSelectedComponentsPos();

        let componentWrappers = this.mainView.centerBlock.formEditField.componentWrappers;

        componentWrappers.bind('onComponentWrapperMouseMove', this.onComponentWrapperMouseMove);
        componentWrappers.bind('onComponentWrapperMouseUp', this.onComponentWrapperMouseUp);
    }

    onComponentResizerMoverMouseMove(event) {

        this.updateSelectedComponentsPos(event.clientX - this.resizeStartX, event.clientY - this.resizeStartY);
    }

    onComponentResizerMoverMouseUp() {

        let formEditField = this.mainView.centerBlock.formEditField;

        formEditField.unbind('onComponentResizerMoverMouseMove', this.onComponentResizerMoverMouseMove);
        formEditField.unbind('onComponentResizerMoverMouseUp', this.onComponentResizerMoverMouseUp);

        this.resizeStartComponentsGeometry = {};
    }

    onComponentResizerMoverMouseDown(event) {

        this.resizeStartX = event.clientX;
        this.resizeStartY = event.clientY;

        this.initStartSelectedComponentsPos();

        let formEditField = this.mainView.centerBlock.formEditField;

        formEditField.bind('onComponentResizerMoverMouseMove', this.onComponentResizerMoverMouseMove);
        formEditField.bind('onComponentResizerMoverMouseUp', this.onComponentResizerMoverMouseUp);
    }

    onComponentResizerSideMoverMouseMove(event) {

        let sideType = this.resizerName;

        let resizeX = event.clientX;
        let resizeY = event.clientY;

        let xDif = null;
        let yDif = null;

        let updateGeometryFunc = null;

        if (sideType === 'Left') {

            xDif = resizeX - this.resizeStartX;

            updateGeometryFunc = this.updateComponentGeometryResizerW;

        }
        else if (sideType === 'Right') {

            xDif = resizeX - this.resizeStartX;

            updateGeometryFunc = this.updateComponentGeometryResizerE;

        } else if (sideType === 'Top') {

            yDif = resizeY - this.resizeStartY;

            updateGeometryFunc = this.updateComponentGeometryResizerN;

        } else if (sideType === 'Bottom') {

            yDif = resizeY - this.resizeStartY;

            updateGeometryFunc = this.updateComponentGeometryResizerS;
        }
        
        let selectedComponents = this.mainModel.form.components.selectedComponents;

        let startGeometry = this.resizeStartComponentsGeometry;
        
        for (let component of selectedComponents)
            updateGeometryFunc(component, startGeometry[component.name], xDif, yDif);
    }

    onComponentResizerSideMoverMouseUp() {

        let formEditField = this.mainView.centerBlock.formEditField;

        formEditField.unbind('onComponentResizerSideMoverMouseMove', this.onComponentResizerSideMoverMouseMove);
        formEditField.unbind('onComponentResizerSideMoverMouseUp', this.onComponentResizerSideMoverMouseUp);

        this.resizeStartComponentsGeometry = {};
    }

    onComponentResizerSideMoverMouseDown(sideType, event) {

        this.resizerName = sideType;

        let geometry = this.resizeStartComponentGeometry;

        let components = this.mainModel.form.components;

        let startGeometry = this.resizeStartComponentsGeometry;

        if (sideType === 'Left' || sideType === 'Right') {

            this.resizeStartX = event.clientX;

            let selectedComponents = components.selectedComponents;

            for(let component of selectedComponents) {

                let geometry = {};

                geometry.x = component.getPropertyValue("x");
        
                geometry.width = component.getPropertyValue("width");

                startGeometry[component.name] = geometry;
            }

        } else {

            this.resizeStartY = event.clientY;

            let selectedComponents = components.selectedComponents;

            for(let component of selectedComponents) {

                let geometry = {};

                geometry.y = component.getPropertyValue("y");
        
                geometry.height = component.getPropertyValue("height");

                startGeometry[component.name] = geometry;
            }
        }

        let formEditField = this.mainView.centerBlock.formEditField;

        formEditField.bind('onComponentResizerSideMoverMouseMove', this.onComponentResizerSideMoverMouseMove);
        formEditField.bind('onComponentResizerSideMoverMouseUp', this.onComponentResizerSideMoverMouseUp);
    }
}

ComponentResizeController.containerComponentTypes = new Set(['root', 'div']);