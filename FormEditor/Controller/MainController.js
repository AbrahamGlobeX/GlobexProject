class MainController
{
    constructor(model, view) {

        this.mainModel = model;

        this.mainView = view;

        this.addComponentController = new AddComponentController(model, view);

        this.deleteComponentController = new DeleteComponentController(model, view);

        this.componentPropertiesController = new ComponentPropertiesController(model, view);

        this.componentSelectionController = new ComponentSelectionController(model, view);

        this.componentResizeController = new ComponentResizeController(model, view);

        this.copyPasteComponentController = new CopyPasteComponentController(model, view, this.deleteComponentController);

        this.keyboardHandlers = {};
    }

    initKeyboardHandlers() {

        this.keyboardHandlers['DELETE'] = this.deleteComponentController.onDeleteKeydown.bind(this.deleteComponentController);
        this.keyboardHandlers['CTRL+KEYC'] = this.copyPasteComponentController.copyComponents.bind(this.copyPasteComponentController);
        this.keyboardHandlers['CTRL+KEYX'] = this.copyPasteComponentController.cutComponents.bind(this.copyPasteComponentController);
        this.keyboardHandlers['CTRL+KEYV'] = this.copyPasteComponentController.pasteComponents.bind(this.copyPasteComponentController);
    }

    bindModelEvents() {

        let model = this.mainModel;

        let view = this.mainView;

        let headerMenu = view.headerMenu;
        
        let centerBlock = view.centerBlock;

        let componentToolboxView = centerBlock.componentToolbox;

        model.bind("init", componentToolboxView.onMainModelInit.bind(componentToolboxView));

        model.bind('onChangeEditMode', centerBlock.onChangeEditMode.bind(centerBlock));

        model.bind('onChangeEditMode', headerMenu.onChangeEditMode.bind(headerMenu));
    }

    bindViewEvents() {

        let view = this.mainView;

        let headerMenu = view.headerMenu;
        
        let centerBlock = view.centerBlock;

        let formEditField = centerBlock.formEditField;

        formEditField.bind('keydown', this.onFormEditFieldKeydown.bind(this));

        let componentWrappers = formEditField.componentWrappers;
        
        headerMenu.bind('onMenuItemClick', this.onMenuItemClick.bind(this));

        componentWrappers.bind('onComponentWrapperMouseDown', this.onComponentWrapperMouseDown.bind(this));
    }

    init() {

        this.addComponentController.init();

        this.deleteComponentController.init();

        this.componentPropertiesController.init();

        this.componentSelectionController.init();

        this.componentResizeController.init();

        this.copyPasteComponentController.init();

        this.initKeyboardHandlers();

        this.bindModelEvents();

        this.bindViewEvents();
    }

    onMenuItemClick(itemName) {

        let funcName = "onMenu" + itemName + "ItemClick";

        this[funcName]();
    }

    onMenuSaveItemClick() {

        // var formString = this.mainModel.form.toString();

        // var hiddenElement = document.createElement('a');

        // hiddenElement.href = 'data:attachment/text,' + encodeURI(formString);
        // hiddenElement.target = '_blank';
        // hiddenElement.download = 'formString.txt';
        // hiddenElement.click();

    }

    onMenuViewItemClick() {

        this.mainModel.setEditMode(!this.mainModel.editMode);
    }

    onComponentWrapperMouseDown(componentName, x, y) {

        this.componentSelectionController.onComponentWrapperMouseDown(componentName, x, y);

        this.componentResizeController.onComponentWrapperMouseDown(componentName, x, y);
    }

    onFormEditFieldKeydown(key, ctrlKey) {

        if(ctrlKey)
            key = "CTRL+" + key;

        let keyHandler = this.keyboardHandlers[key.toUpperCase()];
        
        if(typeof keyHandler != 'undefined')
            keyHandler();

        console.log(key);
    }


}