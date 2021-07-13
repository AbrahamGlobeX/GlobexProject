
class FormEditorApp
{
    constructor(htmlContainer) {

        this.mainModel = null;

        this.mainView = null;

        this.mainController = null;
    }

    init(htmlContainer) {

        let formEditorHtmlElement = document.createElement('div');

        htmlContainer.appendChild(formEditorHtmlElement);

        formEditorHtmlElement.style.width = "100%";
        formEditorHtmlElement.style.height = "100%";

        let mainModel = new MainModel();

        let mainView = new MainView();

        let mainController = new MainController(mainModel, mainView);

        let mainViewParameters = {

            htmlContainer : formEditorHtmlElement

        }

        mainView.init(mainViewParameters);

        mainController.init();

        

        let mainModelParameters = {

            

        }

        mainModel.init(mainModelParameters);

        mainController.addComponentController.addRootComponent();

        this.mainModel = mainModel;

        this.mainView = mainView;

        this.mainController = mainController;
    }

}
