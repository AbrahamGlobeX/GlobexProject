
class ComponentWrappers extends BaseView {

    static containerTypes = null;

    constructor() {

        super();

        this.wrappers = {};

        this.htmlContainer = null;

    }

    static getComponentWrapperName(componentName) {

        return componentName + "_wrapper";
    }

    init(htmlContainer) {

        this.htmlContainer = htmlContainer;
    }

    get(componentName) {

        return this.wrappers[ComponentWrappers.getComponentWrapperName(componentName)];
    }

    getRandColComp() {
        return parseInt(Math.random() * 255) + "";
    }

    dropOnComponent(componentName, event) {

        event.preventDefault();
        event.stopPropagation();

        let droppedType = event.dataTransfer.getData("text");

        const targetClientRect = event.currentTarget.getBoundingClientRect();

        let dropInfo = {

            componentName: componentName,

            dropData: event,

            droppedType: droppedType,

            x: event.clientX - targetClientRect.left,

            y: event.clientY - targetClientRect.top
        }

        this.trigger("drop", dropInfo);
    }

    getWrappersContainer() {

        return this.get('formRoot');
    }

    add(info) {

        let wrapperElement = document.createElement('div');

        let componentName = info.componentName;

        let wrapperName = ComponentWrappers.getComponentWrapperName(componentName);

        let wrappers = this.wrappers;

        wrappers[wrapperName] = wrapperElement;

        wrapperElement.id = wrapperName;

        let style = wrapperElement.style;

        style.left = info.left + "px";
        style.top = info.top + "px";
        style.width = info.width + "px";
        style.height = info.height + "px";

        style.backgroundColor = "rgba(" + this.getRandColComp() + "," + this.getRandColComp() + "," + this.getRandColComp() + ",0.0)";

        style.position = "absolute";

        let onMouseDown = null;

        let that = this;

        if (info.componentType != "root" && !ComponentWrappers.containerTypes.has(info.componentType)) {

            style.cursor = "move";

        } else {

            style.cursor = "auto";

            wrapperElement.addEventListener("drop", function (e) { this.dropOnComponent(componentName, e) }.bind(this));
        }

        let wrappersContainer = this.getWrappersContainer();

        let onMouseMove = function (e) {

            let containerRect = wrappersContainer.getBoundingClientRect();

            that.trigger('onComponentWrapperMouseMove',
                e.clientX - containerRect.left,
                e.clientY - containerRect.top);
        };

        let onMouseUp = function () {

            that.trigger('onComponentWrapperMouseUp', name);

            document.removeEventListener("mouseup", onMouseUp);

            document.removeEventListener("mousemove", onMouseMove);
        };

        onMouseDown = function (e) {

            let containerRect = wrappersContainer.getBoundingClientRect();

            e.stopPropagation();

            that.trigger('onComponentWrapperMouseDown',
                componentName,
                e.clientX - containerRect.left,
                e.clientY - containerRect.top);

            document.addEventListener("mousemove", onMouseMove);

            document.addEventListener("mouseup", onMouseUp);
        };

        wrapperElement.addEventListener("mousedown", onMouseDown);

        wrapperElement.setAttribute("draggable", false);
        wrapperElement.addEventListener("dragstart", function () { return false; })
        wrapperElement.ondragstart = function () { return false; };

        if (info.parentComponentName !== null) {

            let parentWrapperName = ComponentWrappers.getComponentWrapperName(info.parentComponentName);

            wrappers[parentWrapperName].appendChild(wrapperElement);
        }

        wrapperElement.addEventListener("dragenter", function (e) { e.preventDefault(); });
        wrapperElement.addEventListener("dragover", function (e) { e.preventDefault(); });

    }

    update(info) {

        if (info === null)
            return;

        let wrapperName = ComponentWrappers.getComponentWrapperName(info.componentName);

        this.wrappers[wrapperName].style[info.ruleName] = info.value + 'px';
    }

    remove(componentName) {

        let wrapperName = ComponentWrappers.getComponentWrapperName(componentName);

        let wrappers = this.wrappers;

        wrappers[wrapperName].remove();

        delete wrappers[wrapperName];
    }

    show() {

        for (let name in this.wrappers)
            this.wrappers[name].style.visibility = "visible";
    }

    hide() {

        for (let name in this.wrappers)
            this.wrappers[name].style.visibility = "hidden";
    }

}

ComponentWrappers.containerTypes = new Set(["div", "layoutVertical",
    "layoutHorizontal",
    "layoutGrid",
    "layoutFlex"]);

