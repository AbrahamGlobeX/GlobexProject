'use strict';

/*global Module, MicroEvent*/
/*exported ListActions*/

var ListActs = {

    loadScript(scrobj) {
        Module.Store.dispatch({
            'eventName': 'load-script',
            'script': scrobj
        });
    },

    sendLogMsg(value) {
        Module.Store.dispatch({
            'eventName': 'sendLogMsg',
            'value': value
        });
    },

    updateRecord(record) {
        Module.Store.dispatch({
            'eventName': 'updateRecord',
            'value': record
        })
    },

    addRecord() {
        Module.Store.dispatch({
            'eventName': 'addRecord'
        })
    },

    srikeOut(index) {
        Module.Store.dispatch({
            'eventName': 'strikeOut',
            'value': index
        })
    }
};

var Event = {}
MicroEvent.mixin(Event);