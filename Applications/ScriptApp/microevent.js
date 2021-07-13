/* eslint-disable no-empty-function */
'use strict';

// eslint-disable-next-line func-style
var MicroEvent = function () { };

MicroEvent.prototype = {
	bind(event, fct) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(fct);
	},
	unbind(event, fct) {
		this._events = this._events || {};
		if (event in this._events === false) {
			return;
		}
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger(event, ...args) {
		this._events = this._events || {};
		if (event in this._events === false) {
			return;
		}
		for (var i = 0; i < this._events[event].length; i++) {
			this._events[event][i].apply(this, args);
		}
	}
};

MicroEvent.mixin = function (destObject) {
	// eslint-disable-next-line array-element-newline
	var props = ['bind', 'unbind', 'trigger'];
	for (var i = 0; i < props.length; i++) {
		if (typeof destObject === 'function') {
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		} else {
			destObject[props[i]] = MicroEvent.prototype[props[i]];
		}
	}
	return destObject;
}

// if (typeof module !== "undefined" && ('exports' in module)) {
// 	module.exports = MicroEvent;
// }