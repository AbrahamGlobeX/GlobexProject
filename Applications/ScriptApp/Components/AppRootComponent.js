
class AppRootComponent {

    constructor(parentElement) {
        
        const id = 'formRoot';

        this.id = id;

        let htmlElement = document.createElement('div');

        htmlElement.id = id;

        htmlElement.style.position = 'absolute';

        htmlElement.style.width = '100%';
        htmlElement.style.height = '100%';
        htmlElement.classList.add('Form');

        parentElement.appendChild(htmlElement);

        if(typeof window.ReactComponent == 'undefined')
            window.ReactComponent = {};

        window.ReactComponent[id] = this;

        this.htmlElement = htmlElement;
    }

    includeWidget(widget) {

        this.htmlElement.appendChild(widget.htmlElement);

    }
	
	excludeWidget(widget) {

        this.htmlElement.removeChild(widget.htmlElement);
    }
}
