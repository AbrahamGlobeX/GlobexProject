
class ComponentToolboxView extends BaseView {

    constructor() {

        super();

        this.htmlContainer = null;

        this.componentList = null;

    }


    addComponentTypeElementEvents(element, name) {

        let dblclickHandler = function (event) {

            this.trigger("componentTypeElementDbClick", name)

        };

        let dragstartHandler = function (event) {

            event.dataTransfer.setData("text/plain", name);
        };

        element.addEventListener("dblclick", dblclickHandler.bind(this));
        element.addEventListener("dragstart", dragstartHandler.bind(this));
    }

    capitalizeFirstLetter(string) {

        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    initComponentList(componentTypeNames) {

        for (let name of componentTypeNames) {

            let componentTypeElement = document.createElement('a');

            componentTypeElement.classList.add("list-group-item");

            componentTypeElement.setAttribute("href", "#");

            componentTypeElement.textContent = this.capitalizeFirstLetter(name);

            let componentTypeFont = document.createElement('i');

            componentTypeFont.classList.add("fa");
            componentTypeFont.classList.add("fa-check");

            componentTypeFont.setAttribute("aria-hidden", "true");

            componentTypeElement.appendChild(componentTypeFont);

            this.componentList.appendChild(componentTypeElement);

            this.addComponentTypeElementEvents(componentTypeElement, name);
        }

    }

    initHtml() {

        let htmlContainer = document.createElement('div');

        htmlContainer.classList.add("panel");
        htmlContainer.classList.add("panel-default");

        let componentList = document.createElement('div');

        componentList.classList.add("list-group");

        componentList.style.lineHeight = "0";

        let componentListHeader = document.createElement('a');

        componentListHeader.classList.add("list-group-item");
        componentListHeader.classList.add("active");

        componentListHeader.setAttribute("href", "#");

        componentListHeader.textContent = "Toolbox";

        componentList.appendChild(componentListHeader);

        this.componentList = componentList;

        htmlContainer.appendChild(componentList);

        this.htmlContainer = htmlContainer;
    }

    init() {

        this.initHtml();

    }

    onMainModelInit(initInfo) {

        this.initComponentList(initInfo.componentTypeNames);
    }
}