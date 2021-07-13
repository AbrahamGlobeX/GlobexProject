/* eslint-disable max-lines-per-function */
/* eslint-disable no-continue */
/* eslint-disable max-len */
/* exported BasicConnection init*/
/* global APP*/
'use strict';

// dest: {nodeID: 44, index: 1}
// source: {nodeID: 101, index: 0}
// type: "data"

// eslint-disable-next-line no-unused-vars
class BasicConnection {

	constructor(connection, logic) {
		
		this.logic = logic;
		
		if (!logic) {
			console.error("BAD CURRENT LOGIC!!!");
			return;
		}

		// INIT DATA
		this.type = connection.type;

		this.pid = connection.pid;
		// this.cid = connection.cid;
		
		this.nodeID1 = connection.dest.nodeID;
		this.nodeID2 = connection.source.nodeID;

		this.index1 = connection.dest.index;
		this.index2 = connection.source.index;

		this.node1 = this.logic.nodes[this.nodeID1]; // DEST (in)
		this.node2 = this.logic.nodes[this.nodeID2]; // SOURSE (out)
		
		this.id = "" + this.nodeID1 + "_" + this.index1 + "_" + this.nodeID2 + "_" + this.index2 + "_" + this.type;

		// MAKE LINE
		// http://www.w3.org/2000/svg
		this.namespaceURL = decodeURIComponent(escape(window.atob("aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmc=")));
		
		this.htmlElement = APP.UI.svgContainer;

		// <!--LINE-->
		this.htmlLine = document.createElementNS(this.namespaceURL, "path");
		this.htmlLine.classList.add("connection_path");
		this.htmlElement.appendChild(this.htmlLine);

		if (this.type === "data") {
			this.htmlLine.setAttribute("stroke", "blue");
		} else {
			this.htmlLine.setAttribute("stroke", "gray");
		}

		// SELECTION SUPPORT LINE
		this.htmlSupportLine = document.createElementNS(this.namespaceURL, "path");
		this.htmlSupportLine.classList.add("connection_path");
		this.htmlSupportLine.classList.add("support_path");
		this.htmlElement.appendChild(this.htmlSupportLine);

		
		this.htmlLine.setAttribute("id", "C1_" + this.id);
		this.htmlSupportLine.setAttribute("id", "C2_" + this.id);
		
		this.initPoints();

		// this.dynamicCreate();
		// this.staticCreate();
		// this.updatePositions();

		this.pressed = false;

	}

	initPoints() {
		
		// POINT 1
		this.htmlP1 = document.createElementNS(this.namespaceURL, "circle");
		this.htmlP1.setAttribute("class", "PathCircle");
		this.htmlP1.setAttribute("r", 5);
		this.htmlP1.setAttribute("stroke", "transparent");
		this.htmlP1.setAttribute("fill", "transparent");
		this.htmlP1.setAttribute("stroke-width", 2);
		this.htmlP1.setAttribute("id", "P1_" + this.id);
		this.htmlElement.appendChild(this.htmlP1);
		// POINT 2
		this.htmlP2 = document.createElementNS(this.namespaceURL, "circle");
		this.htmlP2.setAttribute("class", "PathCircle");
		this.htmlP2.setAttribute("r", 5);
		this.htmlP2.setAttribute("stroke", "transparent");
		this.htmlP2.setAttribute("fill", "transparent");
		this.htmlP2.setAttribute("stroke-width", 2);
		this.htmlP2.setAttribute("id", "P1_" + this.id);
		this.htmlElement.appendChild(this.htmlP2);
	}

	dynamicCreate() {

		if (this.type === "data") {
			this.conn1 = this.node1.addLeftConnection("data", "data", this);
			this.conn2 = this.node2.addRightConnection("data", "data", this);
		} else {
			this.conn1 = this.node1.addLeftConnection("in", "flow", this);
			this.conn2 = this.node2.addRightConnection("out", "flow", this);
		}
		this.node1.appendConnection(this);
		this.node2.appendConnection(this);

	}

	staticCreate() {
		if (this.type === "data") {
			this.conn1 = this.node1.dataIn[Object.keys(this.node1.dataIn)[this.index1]];
			this.conn2 = this.node2.dataOut[Object.keys(this.node2.dataOut)[this.index2]];
		} else {
			this.conn1 = this.node1.flowIn[Object.keys(this.node1.flowIn)[this.index1]];
			this.conn2 = this.node2.flowOut[Object.keys(this.node2.flowOut)[this.index2]];
		}
		this.node1.appendConnection(this);
		this.node2.appendConnection(this);
	}

	updatePositions() {

		if (this.node1 === null) {
			return;
		}

		if (this.node2 === null) {
			return;
		}

		if (this.conn1 === null) {
			return;
		}

		if (this.conn2 === null) {
			return;
		}

		this.p1x = this.node1.htmlElement.offsetLeft + this.conn1.children[0].offsetLeft;
		this.p1y = this.node1.htmlElement.offsetTop + this.conn1.children[0].offsetTop;
		this.p2x = this.node2.htmlElement.offsetLeft + this.conn2.children[1].offsetLeft;
		this.p2y = this.node2.htmlElement.offsetTop + this.conn2.children[1].offsetTop;

		this.setPos(this.p1x, this.p1y, this.p2x, this.p2y);
	}

	setPos(x, y, x2, y2) {
		let dx = Math.round(Math.abs(x - x2) / 2);
		dx = Math.max(100, dx);
		const d = "M " + x + " " + y + " C " + (x - dx) + " " + (y + 1) + " " + (x2 + dx) + " " + (y2 + 1) + " " + x2 + " " + y2;
		this.htmlLine.setAttribute("d", d);
		this.htmlSupportLine.setAttribute("d", d);
		this.htmlP1.setAttribute("cx", x);
		this.htmlP1.setAttribute("cy", y);
		this.htmlP2.setAttribute("cx", x2);
		this.htmlP2.setAttribute("cy", y2);
	}

	setPos2(x, y) {
		this.p1x = this.node1.htmlElement.offsetLeft + this.conn1.children[0].offsetLeft;
		this.p1y = this.node1.htmlElement.offsetTop + this.conn1.children[0].offsetTop;
		this.p2x = x;
		this.p2y = y;
		let dx = Math.round(Math.abs(this.p1x - this.p2x) / 2);
		dx = Math.max(100, dx);
		const d = ("M " + this.p1x + " " + this.p1y + " C " + (this.p1x - dx) + " " + (this.p1y + 1) + " " + (this.p2x + dx) + " " + (this.p2y + 1) + " " + this.p2x + " " + this.p2y);
		this.htmlLine.setAttribute("d", d);
		this.htmlSupportLine.setAttribute("d", d);

	}

	focused(bool) {
		if (bool) { 
			this.htmlLine.classList.add("focused");
			this.htmlElement.style.zIndex = 1;
			this.htmlP1.setAttribute("stroke", "orange");
			this.htmlP2.setAttribute("stroke", "orange");
		} else {
			this.htmlLine.classList.remove("focused");
			this.htmlElement.style.zIndex = 0;
			this.htmlP1.setAttribute("stroke", "transparent");
			this.htmlP2.setAttribute("stroke", "transparent");
		}
	}

	destroy() {
		
		this.htmlLine.remove();
		this.htmlSupportLine.remove();
		this.htmlP1.remove();
		this.htmlP2.remove();
		
		this.node1.removeLine(this);
		this.node2.removeLine(this);
		
	}


	mouseDown(event) {
		this.pressed = true;
	}

	mouseMove(event) {
		if (!this.pressed) {
			return;
		}
	}

	mouseUp(event) {
		this.pressed = false;
	}
	
}