

class CenterBlockView {

    constructor() {

        this.htmlContainer = document.createElement('div');

        this.componentToolbox = new ComponentToolboxView();

        this.componentTree = new ComponentTreeView();

        this.formEditField = new FormEditFieldView();

        this.propertiesBlock = new PropertiesBlockView();
    }

    initLeftPanelGroup(rowContent) {

        let leftSideNav = document.createElement('div');

        leftSideNav.classList.add("col-sm-2");
        leftSideNav.classList.add("sidenav");

        let panelGroup = document.createElement('div');

        leftSideNav.appendChild(panelGroup);
        
        rowContent.appendChild(leftSideNav);
         
        panelGroup.classList.add("panel-group");
        
        let componentToolbox = this.componentToolbox;

        componentToolbox.init();
        
        panelGroup.appendChild(componentToolbox.htmlContainer);
        
        let componentTree = this.componentTree;

        panelGroup.appendChild(componentTree.htmlContainer);

        componentTree.init();
    }

    initHtml() {

        let htmlContainer = this.htmlContainer;

        htmlContainer.classList.add("container-fluid");
        htmlContainer.classList.add("text-center");

        let rowContent = document.createElement('div');

        rowContent.classList.add("row");
        rowContent.classList.add("content");

        htmlContainer.appendChild(rowContent);

        this.initLeftPanelGroup(rowContent);

        let formEditField = this.formEditField;
        
        rowContent.appendChild(formEditField.htmlContainer);

        formEditField.init();

        let properties = this.propertiesBlock;

        properties.init();
        
        rowContent.appendChild(properties.htmlContainer);

        this.htmlContainer = htmlContainer;

    }

    init() {

        this.initHtml();
    }

    onChangeSelectedComponents(componentInfo) {
        
        this.propertiesBlock.onChangeSelectedComponents(componentInfo.properties);
    }

    onChangeEditMode(value) {

        let visibility = value ? "visible" : "hidden";

        this.componentTree.htmlContainer.style.visibility = visibility;

        this.propertiesBlock.htmlContainer.style.visibility = visibility;

        this.formEditField.onChangeEditMode(value);

        // this.htmlContainer.setAttribute("visible", value);
    }
}