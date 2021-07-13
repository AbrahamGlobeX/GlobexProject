
class FormRootComponent {

    constructor(parentElement, attributes) {
        
        const id = 'formRoot';

        this.id = id;

        let htmlElement = document.createElement('div');

        htmlElement.id = id;

        htmlElement.style.position = 'absolute';
        htmlElement.style.backgroundColor = attributes.style.backgroundColor;

        htmlElement.style.width = attributes.style.width + 'px';
        htmlElement.style.height = attributes.style.height + 'px';
        htmlElement.style.left = attributes.style.left + 'px';
        htmlElement.style.top = attributes.style.top + 'px';

        htmlElement.classList.add('Form');

        parentElement.appendChild(htmlElement);

        this.htmlElement = htmlElement;
    }

    includeWidget(widget) {

        this.htmlElement.appendChild(widget.htmlElement);

	}
	
	excludeWidget(widget) {

        this.htmlElement.removeChild(widget.htmlElement);
    }

	
	set posX(value) {
		this._posX = value;
		if (this.htmlElement) {
			this.htmlElement.style.left = value;
		}
	}

    get posX() {
		return this._posX;
	}
	
	set posY(value) {
		this._posY = value;
		if (this.htmlElement) {
			this.htmlElement.style.top = value;
		}
	}

	get posY() {
		return this._posY;
	}
	
	set width(value) {
		this._width = value;
		if (this.htmlElement) {
			this.htmlElement.style.width = value;
		}
	}
	
	get width() {
		return this._width;
	}
	
	set height(value) {
		this._height = value;
		if (this.htmlElement) {
			this.htmlElement.style.height = value;
		}
	}
	
	get height() {
		return this._height;
	}

}
