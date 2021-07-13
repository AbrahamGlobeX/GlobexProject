/* eslint-disable class-methods-use-this */
/*global Module, React, ListActions, ReactDOM, script*/
/*exported myObj*/
'use strict';

class Initializer {

    constructor() {

        let scriptCopy = {
            "jsBlocksOIDs": [

            ],
            "nodes": [
                {
                    "name": "Handler",
                    "type": "Handler",
                    "lib": "",
                    "id": 41,
                    "pid": 0,
                    "x": 10,
                    "y": 145,
                    "params": [
                        {
                            "eventName": "init"
                        }
                    ],
                    "Inputs": {
                        "flow": [],
                        "data": []
                    },
                    "Outputs": {
                        "flow": [

                            "out"
                        ],
                        "data": []
                    }
                }
            ],
            "connections": [

            ],
            "store": {
                "widgets": {
                    "formRoot": {
                        "children": []
                    }
                }
            }
        }

        Module.Store.dispatch({
            'eventName': 'load-script',
            'script': scriptCopy
        });

        if (typeof APP.form.widgets === 'undefined')
            APP.form.widgets = {
                "formRoot": {
                    "children": [],
                    "properties": {

                        x: 50,
                        y: 50,
                        width: 502,
                        height: 500,
                        name: "formRoot"
                    }
                }
            }
    }
}

let resetAll;

//let renumber = Module.Store.renumber;

class App {

    static run() {

        new App(document.getElementById('root'));
    }

    constructor(parentElement) {

        this.construct();

        resetAll = this.refresh.bind(this);

        // Event.bind('change', this.storeChanged.bind(this));

        let that = this;

        APP.dbWorker.setLoadFunc(() => {

            APP.dbWorker.setLoadFunc(null);

            that.refresh();

            // const onJsBlockFunctionLoaded = (val) => {  };

            // jsBlockFunctionLoader.load(APP.script, onJsBlockFunctionLoaded);
        })

        this.initializer = new Initializer();

        this.rootComponent = new AppRootComponent(parentElement);

        // Module.Store.dispatch({
        //     'eventName': 'init',
        // });

        window.dispatchEvent(new window.SystemEventType('resize'));
    }

    createComp(componentName, formData) {

        const component = formData[componentName];

        const componentState = {};

        componentState.attributes = FormEditFieldView.makeComponentAttributes(component.type, component.properties, {});

        let reactComponent;

        if (typeof component.type !== 'undefined' && component.name != 'formRoot')
            reactComponent = new widgetsComponentsTypes[component.type]();
        else {

            if (typeof component.children != 'undefined')
                for (let child of component.children) {

                    ReactComponent["formRoot"].includeWidget(this.createComp(child, formData));
                }

            return;
        }


        ReactComponent[componentName] = reactComponent;

        for (let propertyName in component.properties) {

            let widgetParameterName = FormEditFieldView.propertiesToWidgetsParameters[propertyName];

            if (typeof widgetParameterName === 'undefined')
                widgetParameterName = propertyName;

            let suffix = FormEditFieldView.propertiesToWidgetsParametersSuffixes[propertyName];

            if (typeof suffix === 'undefined')
                suffix = "";

            reactComponent[widgetParameterName] = component.properties[propertyName] + suffix;
        }

        if (typeof component.children != 'undefined')
            for (let child of component.children) {

                reactComponent.includeWidget(this.createComp(child, formData));
            }


        return reactComponent;
    }

    formDataToStoreWidgets(formData) {

        this.createComp("formRoot", formData);
    }

    refresh() {
// debugger;
        const that = this;

        const rerunScript = function() {

            Module.Store.resetAll();

            for(let widgetId in ReactComponent) {

                if(widgetId != 'formRoot')
                    ReactComponent[widgetId].htmlElement.remove();
            }

            if (typeof APP.form != 'undefined') {

                that.formDataToStoreWidgets(APP.form.widgets);
            }

            Module.Store.dispatch({
                'eventName': 'load-script',
                'script': JSON.parse(JSON.stringify(APP.script))
            });

            that.construct();
// debugger;
            Module.Store.dispatch({
                'eventName': 'init',
            });
        }

        jsBlockFunctionLoader.load(APP.script, rerunScript);
    }

    construct() {

        const widgets = {

            "formRoot": {

                children: []
            }
        };

        let state = { widgets: widgets };

        this.state = state;
    }
}
