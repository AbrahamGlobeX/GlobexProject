class WidgetFile extends BaseWidget {
    constructor(){
        super();
    }
    onCreate(){
        this.htmlElement.className = "WidgetFile";

        this.inputElement = document.createElement("input");
        this.inputElement.type = "file";

        this.htmlElement.appendChild(this.inputElement);
    }

    
}