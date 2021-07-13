/* eslint-disable no-continue */
/*global globalShiftX*/
/*exported BasicNode*/
'use strict';

// OutFlows: [{…}]
// id: 101
// params: [{…}]
// type: "StoreElement"
// x: 0
// y: 0

class BasicNode {

    constructor(object) {
        this.id = object.id;
        this.type = object.type;
        this.x = object.x;
        this.y = object.y;

        this.flowIn = {};
        this.flowOut = {};
        this.dataIn = {};
        this.dataOut = {};

        this.lines = [];

        this.param = "";
        this.storeVal = "";
        // let valEl = false;
        if (("params" in object) && object.params.length > 0) {
            if ("eventName" in object.params[0]) {
                this.param = object.params[0].eventName;
            }
            if ("ElementName" in object.params[0]) {
                // valEl = true;
                this.storeVal = object.params[0].ElementName;
            }
        }

        this.htmlElement = document.createElement("div");
        this.htmlElement.id = this.id;
        this.htmlElement.classList.add("node");
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.innerText = this.type + "\n" + this.id + "\n\n";

        if (this.storeVal !== "") {
            this.valElement = document.createElement("div");
            this.valElement.style.color = "blue";
            this.valElement.style.fontWeight = "bold";
            this.valElement.innerText = this.storeVal;
            this.htmlElement.appendChild(this.valElement);
        }

        if (this.param !== "") {
            this.eventName = document.createElement("div");
            this.eventName.style.color = "red";
            this.eventName.style.fontWeight = "bold";
            this.eventName.innerText = this.param;
            this.htmlElement.appendChild(this.eventName);
        }


        // CONNECTIONs container
        this.container = document.createElement("div");
        this.container.classList.add("containers");
        this.htmlElement.appendChild(this.container);

        this.containerLEFT = document.createElement("div");
        this.containerLEFT.classList.add("connection_container");
        this.container.appendChild(this.containerLEFT);

        this.containerRIGHT = document.createElement("div");
        this.containerRIGHT.classList.add("connection_container");
        this.container.appendChild(this.containerRIGHT);

        this.inFlow = document.createElement("div");
        this.containerLEFT.appendChild(this.inFlow);

        this.outFlow = document.createElement("div");
        this.containerRIGHT.appendChild(this.outFlow);

        this.inData = document.createElement("div");
        this.containerLEFT.appendChild(this.inData);

        this.outData = document.createElement("div");
        this.containerRIGHT.appendChild(this.outData);


        this.pressed = false;
        this.pressX = null;
        this.pressY = null;

        // Parse Slots
        this.parseSlots(object, "Inputs");
        this.parseSlots(object, "Outputs");
    }

    parseSlots(object, slotsName) {
        if (slotsName in object) {
            if ("flow" in object[slotsName]) {
                for (const flowOut of object[slotsName].flow) {
                    if (!flowOut) {
                        continue;
                    }
                    if (slotsName === "Inputs") {
                        this.addLeftConnection(flowOut, "flow");
                    } else {
                        this.addRightConnection(flowOut, "flow");
                    }
                }
            }
            if ("data" in object[slotsName]) {
                for (const dataOut of object[slotsName].data) {
                    if (!dataOut) {
                        continue;
                    }
                    if (slotsName === "Inputs") {
                        this.addLeftConnection(dataOut, "data");
                    } else {
                        this.addRightConnection(dataOut, "data");
                    }
                }
            }
        }
    }

    addLeftConnection(name, type, line) {

        if (line) {
            this.lines.push(line);
        }

        if (type === "flow") {
            const c = this.flowIn[name];
            if (typeof c !== "undefined") {
                return c;
            }
        } else {
            const c = this.dataIn[name];
            if (typeof c !== "undefined") {
                return c;
            }
        }

        const connection = document.createElement("div");
        connection.classList.add("connection");

        const point = document.createElement("div");
        point.classList.add("c_point");
        connection.appendChild(point);

        const text = document.createElement("div");
        text.classList.add("fillText");
        text.innerText = name;
        connection.appendChild(text);


        if (type === "flow") {
            this.inFlow.appendChild(connection);
            this.flowIn[name] = connection;
        } else {
            this.inData.appendChild(connection);
            this.dataIn[name] = connection;
            point.style.border = "1px blue solid";
        }

        return connection;
    }

    addRightConnection(name, type, line) {

        if (line) {
            this.lines.push(line);
        }

        if (type === "flow") {
            const c = this.flowOut[name];
            if (typeof c !== "undefined") {
                return c;
            }
        } else {
            const c = this.dataOut[name];
            if (typeof c !== "undefined") {
                return c;
            }
        }

        const connection = document.createElement("div");
        connection.classList.add("connection");
        connection.classList.add("right");

        const text = document.createElement("div");
        text.classList.add("fillText");
        text.innerText = name;
        connection.appendChild(text);

        const point = document.createElement("div");
        point.classList.add("c_point");
        connection.appendChild(point);

        if (type === "flow") {
            this.outFlow.appendChild(connection);
            this.flowOut[name] = connection;
        } else {
            this.outData.appendChild(connection);
            this.dataOut[name] = connection;
            point.style.border = "1px blue solid";
        }
        return connection;
    }

    appendConnection(connection) {
        this.lines.push(connection);
    }

    mouseDown(event) {
        this.pressed = true;
        this.pressX = event.offsetX + globalShiftX;
        this.pressY = event.offsetY;
    }

    mouseMove(event) {
        if (this.pressed === false) {
            return;
        }

        this.htmlElement.style.top = event.clientY - this.pressY + "px";
        this.htmlElement.style.left = event.clientX - this.pressX + "px";

        for (const l of this.lines) {
            l.updatePositions();
        }
    }

    mouseUp( /*event*/ ) {
        this.pressed = false;
    }

}
