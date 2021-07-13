class CopyPasteComponentController {

    constructor(model, view, deleteComponentController) {

        this.mainModel = model;

        this.mainView = view;

        this.deleteComponentController = deleteComponentController;
    }

    init() {

    }

    copyComponents() {

        this.mainModel.componentsClipboard = [...this.mainModel.form.components.selectedComponents];

        console.log("copyComponents");
    }

    cutComponents() {

        this.mainModel.componentsClipboard = [...this.mainModel.form.components.selectedComponents];

        this.deleteComponentController.deleteSelectedComponents();

        console.log("cutComponents");
    }

    pasteComponents() {

        //this.mainModel.componentsClipboard = [...this.mainModel.form.components.selectedComponents];

        //this.deleteComponentController.deleteSelectedComponents();

        console.log("pasteComponents");
    }


}

