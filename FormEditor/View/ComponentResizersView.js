
class ComponentResizersView extends BaseView {

    static rootSquares = null;

    static containerTypes = null;

    static capitalizeFirstLetter(string) {

        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(parentView) {

        super();

        this.mainStyle = false;

        this.parentView = parentView;

        this.htmlContainer = null;

        this.borderExtra = 4;

        this.squareSize = 8;

        this.borders = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };

        this.componentType = null;

        this.componentName = null;

        this.componentGeometry = {

            left: null,
            top: null,
            width: null,
            height: null

        }

        this.squaresInfo = {

            nw: { x: -1, y: -1, html: null, cursor: "nwse-resize" }, n: { x: 0, y: -1, html: null, cursor: "ns-resize" }, ne: { x: 1, y: -1, html: null, cursor: "nesw-resize" },
            w: { x: -1, y: 0, html: null, cursor: "ew-resize" }, e: { x: 1, y: 0, html: null, cursor: "ew-resize" },
            sw: { x: -1, y: 1, html: null, cursor: "nesw-resize" }, s: { x: 0, y: 1, html: null, cursor: "ns-resize" }, se: { x: 1, y: 1, html: null, cursor: "nwse-resize" },
        };

        this.mover = null;

        this.moverImageSrc = "../../FormEditor/View/Images/componentMover.jpg";

        this.moverSize = 15;

        this.sideMovers = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };

        this.sideMoverSize = 3;

    }

    init(htmlContainer, componentType, componentName, mainStyle = false) {

        this.htmlContainer = htmlContainer;

        this.componentName = componentName;

        this.mainStyle = mainStyle;

        this.createBorder(componentName);

        //this.createSideMovers(componentType, componentName);

        this.createSquares(componentType, componentName);

        this.createMover(componentType, componentName);

        this.componentType = componentType;
    }

    createBorder(componentName) {

        let borders = this.borders;

        for (let key in borders) {

            let border = document.createElement('div');

            this.htmlContainer.appendChild(border);

            let borderType = ComponentResizersView.capitalizeFirstLetter(key);

            border.id = componentName + "_resizerBorder" + borderType;

            border.setAttribute("draggable", false);
            border.addEventListener("dragstart", function () { return false; })
            border.ondragstart = function () { return false; };

            let style = border.style;

            style.backgroundColor = "rgba(0,0,0,0)";

            style.position = "absolute";

            let borderPrefix = "border" + borderType;

            style[borderPrefix + "Style"] = "solid";

            style[borderPrefix + "Width"] = "thin";

            style[borderPrefix + "Color"] = "rgba(105,105,105,1)";

            border.setAttribute("draggable", false);
            border.addEventListener("dragstart", function () { return false; })

            borders[key] = border;
        }

        borders.left.style.width = 0;
        borders.right.style.width = 0;
        borders.top.style.height = 0;
        borders.bottom.style.height = 0;
    }

    createSideMovers(componentType, componentName, componentsInfo) {

        let sideMovers = this.sideMovers;

        for (let key in sideMovers) {

            let sideMover = document.createElement('div');

            let sideType = ComponentResizersView.capitalizeFirstLetter(key);

            sideMover.id = componentName + "_resizerSideMover" + sideType;

            let style = sideMover.style;

            style.backgroundColor = "rgba(0,120,0,0.0)";

            style.position = "absolute";

            sideMover.setAttribute("draggable", false);
            sideMover.addEventListener("dragstart", function () { return false; })
            sideMover.ondragstart = function () { return false; };

            sideMovers[key] = sideMover;

            let that = this;

            let onMouseMove = function (event) {

                that.parentView.trigger('onComponentResizerSideMoverMouseMove', event);
            };

            let onMouseUp = function () {

                that.parentView.trigger('onComponentResizerSideMoverMouseUp');

                document.removeEventListener("mouseup", onMouseUp);

                document.removeEventListener("mousemove", onMouseMove);
            };

            let onMouseDown = function (event) {

                event.stopPropagation();

                that.parentView.trigger('onComponentResizerSideMoverMouseDown', sideType, event);

                document.addEventListener("mousemove", onMouseMove);

                document.addEventListener("mouseup", onMouseUp);
            };

            sideMover.addEventListener("mousedown", onMouseDown);
        }

        this.htmlContainer.appendChild(sideMovers.right);
        this.htmlContainer.appendChild(sideMovers.bottom);

        if (componentType !== 'root') {

            this.htmlContainer.appendChild(sideMovers.left);
            this.htmlContainer.appendChild(sideMovers.top);
        }

        let sideMoverSize = this.sideMoverSize;

        sideMovers.left.style.width = sideMoverSize + 'px';
        sideMovers.left.style.cursor = "ew-resize";

        sideMovers.right.style.width = sideMoverSize + 'px';
        sideMovers.right.style.cursor = "ew-resize";

        sideMovers.top.style.height = sideMoverSize + 'px';
        sideMovers.top.style.cursor = "ns-resize";

        sideMovers.bottom.style.height = sideMoverSize + 'px';
        sideMovers.bottom.style.cursor = "ns-resize";
    }

    createMover(componentType, componentName) {

        let mover = document.createElement('img');

        mover.id = componentName + "_resizerMover";

        mover.src = this.moverImageSrc;

        this.mover = mover;

        let style = mover.style;

        style.width = this.moverSize + 'px';

        style.height = this.moverSize + 'px';

        style.backgroundColor = "rgba(0,255,0,1)";

        style.position = "absolute";

        style.borderStyle = "solid";

        style.borderWidth = "thin";

        style.borderRadius = "2px";

        style.borderColor = "rgba(55,76,102,1)";

        style.cursor = "move";

        style.userSelect = "none";

        mover.setAttribute("draggable", false);
        mover.addEventListener("dragstart", function () { return false; })
        mover.ondragstart = function() { return false; };

        let that = this;

        let onMouseMove = function (event) {

            that.parentView.trigger('onComponentResizerMoverMouseMove', event);
        };

        let onMouseUp = function () {

            that.parentView.trigger('onComponentResizerMoverMouseUp');

            document.removeEventListener("mouseup", onMouseUp);

            document.removeEventListener("mousemove", onMouseMove);
        };

        let onMouseDown = function (event) {

            event.stopPropagation();

            that.parentView.trigger('onComponentResizerMoverMouseDown', event);

            document.addEventListener("mousemove", onMouseMove);

            document.addEventListener("mouseup", onMouseUp);
        };

        mover.addEventListener("mousedown", onMouseDown);

        if (ComponentResizersView.containerTypes.has(componentType))
                this.htmlContainer.appendChild(this.mover);
    }

    setSquareLocation(componentsInfo, name) {

        let squareInfo = this.squaresInfo[name];

        let squareHalfSize = this.squareSize / 2;

        let extra = squareHalfSize - 1;

        let style = squareInfo.html.style;

        let componentGeometry = this.componentGeometry;

        if (typeof componentsInfo.left !== 'undefined')
            componentGeometry.left = componentsInfo.left;

        if (typeof componentsInfo.top !== 'undefined')
            componentGeometry.top = componentsInfo.top;

        if (typeof componentsInfo.width !== 'undefined')
            componentGeometry.width = componentsInfo.width;

        if (typeof componentsInfo.height !== 'undefined')
            componentGeometry.height = componentsInfo.height;

        let componentHalfWidth = componentGeometry.width / 2;

        let componentHalfHeight = componentGeometry.height / 2;

        style.left = (componentGeometry.left + componentHalfWidth + squareInfo.x * (componentHalfWidth + extra) - squareHalfSize) + 'px';

        style.top = (componentGeometry.top + componentHalfHeight + squareInfo.y * (componentHalfHeight + extra) - squareHalfSize) + 'px';

    }

    createSquare(componentName, name) {

        let square = document.createElement('div');

        square.id = componentName + "_resizerSquare_" + name;

        this.squaresInfo[name].html = square;

        square.classList.add("componentResizerSquare");

        if(this.mainStyle)
            square.classList.add("componentResizerSquareMain");

        let style = square.style;

        style.width = this.squareSize + 'px';

        style.height = this.squareSize + 'px';

        style.backgroundColor = 'rgba(37, 165, 154, 0.5)';

        style.borderRadius = '3px';

        style.cursor = this.squaresInfo[name].cursor;

        square.setAttribute("draggable", false);
        square.addEventListener("dragstart", function () { return false; })
        square.ondragstart = function () { return false; };

        let that = this;

        let onMouseUp = function () {

            that.parentView.trigger('onComponentResizerMouseUp');

            document.removeEventListener("mouseup", onMouseUp);
        };

        let onMouseMove = function (e) {

            that.parentView.trigger('onComponentResizerMouseMove', e);
        };

        let onMouseDown = function (e) {

            e.stopPropagation();

            that.parentView.trigger('onComponentResizerMouseDown', name, e);

            document.addEventListener("mousemove", onMouseMove);

            document.addEventListener("mouseup", onMouseUp);
        };

        square.addEventListener("mousedown", onMouseDown);

        return square;

    }

    createSquares(componentType, componentName) {

        let squaresInfo = this.squaresInfo;

        let htmlContainer = this.htmlContainer;

        if (componentType !== 'root') {

            for (let squareName in squaresInfo) {

                let square = this.createSquare(componentName, squareName);

                htmlContainer.appendChild(square);
            }

        } else {

            for (let squareName in squaresInfo)
                this.createSquare(componentName, squareName);

            for (let squareName of ComponentResizersView.rootSquares)
                htmlContainer.appendChild(squaresInfo[squareName].html);
        }
    }

    setBordersGeometry(componentsInfo) {

        let componentGeometry = this.componentGeometry;

        if (typeof componentsInfo.left !== 'undefined')
            componentGeometry.left = componentsInfo.left;

        if (typeof componentsInfo.top !== 'undefined')
            componentGeometry.top = componentsInfo.top;

        if (typeof componentsInfo.width !== 'undefined')
            componentGeometry.width = componentsInfo.width;

        if (typeof componentsInfo.height !== 'undefined')
            componentGeometry.height = componentsInfo.height;

        let extra = this.borderExtra;

        let extraHalf = extra / 2;

        let left = componentGeometry.left - extraHalf - 1;

        let top = componentGeometry.top - extraHalf - 1;

        let width = componentGeometry.width + extra + 1;

        let height = componentGeometry.height + extra + 1;

        let borders = this.borders;

        let leftBorderStyle = borders.left.style;

        leftBorderStyle.left = left + 'px';
        leftBorderStyle.top = top + 'px';
        leftBorderStyle.height = height + 'px';

        let rightBorderStyle = borders.right.style;

        rightBorderStyle.left = (left + width) + 'px';
        rightBorderStyle.top = top + 'px';
        rightBorderStyle.height = height + 'px';

        let topBorderStyle = borders.top.style;

        topBorderStyle.left = left + 'px';
        topBorderStyle.top = top + 'px';
        topBorderStyle.width = width + 'px';

        let bottomBorderStyle = borders.bottom.style;

        bottomBorderStyle.left = left + 'px';
        bottomBorderStyle.top = (top + height) + 'px';
        bottomBorderStyle.width = width + 'px';
    }

    setSideMoversGeometry(componentsInfo) {

        if(componentsInfo === null)
            return;

        let componentGeometry = this.componentGeometry;

        if (typeof componentsInfo.left !== 'undefined')
            componentGeometry.left = componentsInfo.left;

        if (typeof componentsInfo.top !== 'undefined')
            componentGeometry.top = componentsInfo.top;

        if (typeof componentsInfo.width !== 'undefined')
            componentGeometry.width = componentsInfo.width;

        if (typeof componentsInfo.height !== 'undefined')
            componentGeometry.height = componentsInfo.height;

        let extra = this.borderExtra;

        let extraHalf = extra / 2;

        let left = componentGeometry.left - extraHalf - 0.5;

        let top = componentGeometry.top - extraHalf - 1;

        let width = componentGeometry.width + extra + 1;

        let height = componentGeometry.height + extra + 1;

        let sideMovers = this.sideMovers;

        let sideMoverSizeHalf = this.sideMoverSize / 2;

        let leftSideMoverStyle = sideMovers.left.style;

        leftSideMoverStyle.left = (left - sideMoverSizeHalf) + 'px';
        leftSideMoverStyle.top = top + 'px';
        leftSideMoverStyle.height = height + 'px';

        let rightSideMoverStyle = sideMovers.right.style;

        rightSideMoverStyle.left = (left + width - sideMoverSizeHalf) + 'px';
        rightSideMoverStyle.top = top + 'px';
        rightSideMoverStyle.height = height + 'px';

        let topSideMoverStyle = sideMovers.top.style;

        topSideMoverStyle.left = left + 'px';
        topSideMoverStyle.top = (top - sideMoverSizeHalf) + 'px';
        topSideMoverStyle.width = width + 'px';

        let bottomSideMoverStyle = sideMovers.bottom.style;

        bottomSideMoverStyle.left = left + 'px';
        bottomSideMoverStyle.top = (top + height - sideMoverSizeHalf) + 'px';
        bottomSideMoverStyle.width = width + 'px';
    }

    calcLocation(wrapperHtmlElement) {
if(typeof wrapperHtmlElement === 'undefined')debugger;
        let wrapperRect = wrapperHtmlElement.getBoundingClientRect();
        let containerRect = this.htmlContainer.getBoundingClientRect();

        return {
            left: wrapperRect.left - containerRect.left,
            top: wrapperRect.top - containerRect.top
        }
    }

    setMoverLocation(componentGeometry) {

        let style = this.mover.style;

        let moverSize = this.moverSize;

        let shift = componentGeometry.width / 2 > moverSize ? 7 : 0;

        style.left = (componentGeometry.left + shift) + 'px';

        style.top = (componentGeometry.top - moverSize / 2 - 1) + 'px';
    }

    updateMainStyle(mainStyle = false) {

        if(this.mainStyle == mainStyle)
            return;
        
        let squares = this.squaresInfo;

        if(mainStyle)
            for(let key in squares)
                squares[key].html.classList.add('componentResizerSquareMain');
        else
            for(let key in squares)
                squares[key].html.classList.remove('componentResizerSquareMain');
        
        this.mainStyle = mainStyle;
    }

    update(componentInfo) {

        this.componentName = componentInfo.componentName;

        this.updateMainStyle(componentInfo.mainStyle);

        let location = this.calcLocation(componentInfo.wrapperHtmlElement);

        let geometry = {

            left: location.left,
            top: location.top,
            width: componentInfo.width,
            height: componentInfo.height
        }

        this.setBordersGeometry(geometry);

        //this.setSideMoversGeometry(geometry);

        let squaresInfo = this.squaresInfo;

        let htmlContainer = this.htmlContainer;

        let rootSquares = ComponentResizersView.rootSquares;

        let type = componentInfo.componentType;

        let previousComponentType = this.componentType;

        let sideMovers = this.sideMovers;

        //let leftSideMover = sideMovers.left;
        //let topSideMover = sideMovers.top;

        if (type !== 'root') {

            for (let squareName in squaresInfo)
                this.setSquareLocation(geometry, squareName);

            if (previousComponentType === 'root') {

                //htmlContainer.appendChild(leftSideMover);
                //htmlContainer.appendChild(topSideMover);

                for (let squareName in squaresInfo)
                    if (!rootSquares.has(squareName))
                        htmlContainer.appendChild(this.squaresInfo[squareName].html);
            }

            if (ComponentResizersView.containerTypes.has(type)) {

                this.setMoverLocation(geometry);

                if (!ComponentResizersView.containerTypes.has(previousComponentType))
                    htmlContainer.appendChild(this.mover);

            } else {

                if (ComponentResizersView.containerTypes.has(previousComponentType))
                    htmlContainer.removeChild(this.mover);
            }

        } else {

            for (let squareName in squaresInfo) {

                if (rootSquares.has(squareName)) {

                    this.setSquareLocation(geometry, squareName);

                } else {

                    let squareHtml = squaresInfo[squareName].html;

                    if (squareHtml.parentNode == htmlContainer)
                        htmlContainer.removeChild(squareHtml);
                }
            }

            // if (leftSideMover.parentNode == htmlContainer)
            //     htmlContainer.removeChild(leftSideMover);

            // if (topSideMover.parentNode == htmlContainer)
            //     htmlContainer.removeChild(topSideMover);

            if (ComponentResizersView.containerTypes.has(previousComponentType))
                htmlContainer.removeChild(this.mover);
        }

        this.componentType = type;
    }

    updateGeometryProperty(componentType, wrapperHtmlElement) {

        let location = this.calcLocation(wrapperHtmlElement);

        let geometry = {

            left: location.left,
            top: location.top,
            width: parseInt(wrapperHtmlElement.style.width),
            height: parseInt(wrapperHtmlElement.style.height)
        }

        this.setBordersGeometry(geometry);

        //this.setSideMoversGeometry(geometry);

        let squaresInfo = this.squaresInfo;

        let rootSquares = ComponentResizersView.rootSquares;

        if (componentType !== 'root') {

            for (let squareName in squaresInfo)
                this.setSquareLocation(geometry, squareName);

            if (ComponentResizersView.containerTypes.has(componentType))
                this.setMoverLocation(geometry);

        } else {

            for (let squareName of rootSquares)
                this.setSquareLocation(geometry, squareName);

            this.componentType = componentType;
        }
    }

    show() {

        this.border.style.visibility = "visible";

        for (let squareName in this.squaresInfo)
            this.squaresInfo[squareName].html.style.visibility = "visible";
    }

    hide() {

        this.border.style.visibility = "hidden";

        for (let squareName in this.squaresInfo)
            this.squaresInfo[squareName].html.style.visibility = "hidden";
    }

    destroy() {

        for(let type in this.borders)
            this.borders[type].remove();

        for(let type in this.squaresInfo)
            this.squaresInfo[type].html.remove();


        this.mover.remove();

        // for(let type in this.sideMovers)
        //     this.sideMovers[type].remove();
    }

}

ComponentResizersView.rootSquares = new Set(["e", "se", "s"]);

ComponentResizersView.containerTypes = new Set(["div", "layoutVertical",
"layoutHorizontal",
"layoutGrid",
"layoutFlex"]);