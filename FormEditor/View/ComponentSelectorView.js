
class ComponentSelectorView extends BaseView {

    constructor() {

        super();

        this.htmlContainer = null;

        this.selectorElement = null;

        this.rootElement = null;

        this.selectorGeometry = {
            left: null,
            top: null,
            width: null,
            height: null
        };
    }

    init(htmlContainer, rootElement) {

        this.htmlContainer = htmlContainer;

        let selectorElement = document.createElement('div');

        selectorElement.id = "componentSelector";

        selectorElement.setAttribute("draggable", false);
        selectorElement.addEventListener("dragstart", function () { return false; })
        selectorElement.ondragstart = function () { return false; };

        let style = selectorElement.style;

        style.backgroundColor = "rgba(0,255,0,1)";

        style.position = "absolute";

        style.borderStyle = "dotted";

        style.borderWidth = "thin";

        style.borderColor = "rgba(105,105,105,1)";

        this.selectorElement = selectorElement;

        this.rootElement = rootElement;
    }

    setSelectorGeometry(selectorInfo) {

        let rootElementStyle = this.rootElement.style;

        let selectorGeometry = this.selectorGeometry;

        if (typeof selectorInfo.x !== 'undefined')
            selectorGeometry.left = parseInt(rootElementStyle.left) + selectorInfo.x;

        if (typeof selectorInfo.y !== 'undefined')
            selectorGeometry.top = parseInt(rootElementStyle.top) + selectorInfo.y;

        if (typeof selectorInfo.width !== 'undefined')
            selectorGeometry.width = selectorInfo.width;

        if (typeof selectorInfo.height !== 'undefined')
            selectorGeometry.height = selectorInfo.height;

        let left = selectorGeometry.left;

        let top = selectorGeometry.top;

        let width = selectorGeometry.width;

        let height = selectorGeometry.height;

        let selectorElementrStyle = this.selectorElement.style;

        selectorElementrStyle.left = left;
        selectorElementrStyle.top = top;
        selectorElementrStyle.width = width;
        selectorElementrStyle.height = height;
    }

    startSelection(x, y) {

        this.setSelectorGeometry({ x: x, y: y, width: 0, height: 0 });

    }

    isSelectorVisible() {

        let geometry = this.selectorGeometry;

        return geometry.width + geometry.height > 4;
    }

    updateSelection(selectorGeometry) {

        this.setSelectorGeometry(selectorGeometry);

        let htmlContainer = this.htmlContainer;

        let selector = this.selectorElement;

        if (selector.parentElement !== htmlContainer) {

            if (this.isSelectorVisible())
                this.htmlContainer.appendChild(this.selectorElement);

        } else {

            if (!this.isSelectorVisible())
                this.htmlContainer.removeChild(this.selectorElement);
        }
    }

    endSelection() {

        let selector = this.selectorElement;

        let selectorStyle = selector.style;

        if (selector.parentElement === this.htmlContainer)
            this.htmlContainer.removeChild(selector);

        selectorStyle.width = 0;
        selectorStyle.height = 0;
    }

}
