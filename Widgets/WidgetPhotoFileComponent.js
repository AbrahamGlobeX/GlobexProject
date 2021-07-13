class WidgetPhotoFile extends BaseWidget {
    constructor(){
        super();
    }
    onCreate(){
        this.htmlElement.className = "WidgetFile";

        this.imgElement = document.createElement("img");
        this.imgElement.style.width = "100%";
        this.imgElement.style.height = "100%";

        this.htmlElement.appendChild(this.imgElement);
    }
    set src(value){
        this._src = value;
        if(this.imgElement){
            this.imgElement.src = value;
        }
    }
}