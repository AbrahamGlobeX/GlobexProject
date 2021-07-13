'use strict';

/*global Module, MicroEvent*/
/*exported ListActions*/

var ListActions = {

    loadScript(scrobj) {
        Module.Store.dispatch({
            'eventName': 'load-script',
            'script': scrobj
        });
    },

    changeInput(event) {
        Module.Store.dispatch({
            'eventName': 'change-ninput',
            'val': event.target.value
        });
    },

    cmdProbe(val) {
        Module.Store.dispatch({
            'eventName': 'updateTodoText',
            'value': val
        });
    },

    increment() {
        Module.Store.dispatch({
            'eventName': 'addTodo'
        });
    },

    decrement() {
        Module.Store.dispatch({
            'eventName': 'cmd-decrement'
        });
    },

    compare() {
        Module.Store.dispatch({
            'eventName': 'cmd-compare'
        });
    },

    changeName(personName) {
        Module.Store.dispatch({
            'eventName': 'change-name',
            'name': personName
        });
    }

};

var Event = {}
MicroEvent.mixin(Event);