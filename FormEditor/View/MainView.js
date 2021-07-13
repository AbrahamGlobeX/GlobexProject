

class MainView
{

    constructor() {

        this.htmlContainer = null;

        this.headerMenu = new HeaderMenu();

        this.centerBlock = new CenterBlockView();

    }

    initHeaderMenu() {

        let headerMenu = this.headerMenu;

        headerMenu.init();

        //this.htmlContainer.appendChild(headerMenu.htmlContainer);
    }

    initCenterBlock() {
        
        let centerBlock = this.centerBlock;

        this.htmlContainer.appendChild(centerBlock.htmlContainer);

        centerBlock.init();
    }

    disableDragstart() {

        var elems = document.body.getElementsByTagName("*");
        
        for(let elem of elems)
            elem.addEventListener("dragstart", function(){return false;});
    }

    init(parameters) {
        
        let htmlContainer = parameters.htmlContainer;

        htmlContainer.classList.add("headerMenuContainer");

        this.htmlContainer = htmlContainer;

        this.initHeaderMenu();
        
        this.initCenterBlock();
    }

    onChangeSelectedComponents(componentInfo) {
        
        this.centerBlock.onChangeSelectedComponents(componentInfo);
    }

    
}