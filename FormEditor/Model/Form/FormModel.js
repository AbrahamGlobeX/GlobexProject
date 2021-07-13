class FormModel extends BaseModel
{
    constructor() {

        super();

        this.components = new ComponentsModel();

        this.rootName = "formRoot";

    }

    init() {

        this.components.init();

    }

    addRootComponent(name) {

        this.components.addRootComponent(name);
    }

    toJson() {

        return { widgets : this.components.toJson()};
    }

    fromJson(data) {

        const widgets = data.widgets;

        if(typeof widgets === 'undefined')
            return;

        this.components.fromJson(widgets);

        // this.components.trigger("addRootComponent", widgets.formRoot.properties);

        // delete widgets.formRoot;

        const currentWidgets = [];

        const rootChildren = widgets['formRoot'].children;

        for(let widgetId of rootChildren)
            currentWidgets.push(widgetId);

        while(currentWidgets.length) {

            const widgetId = currentWidgets.splice(currentWidgets.length - 1, 1)[0];

            if(widgetId == "formRoot")
                continue;

            const component = this.components.components[widgetId];
            
            let addComponentInfo = {

                name: component.name,
    
                type: component.type,
    
                parentName: component.parent.name,
    
                properties: component.getPropertyValues()
            };
    
            if (component instanceof ContainerComponentModel)
                addComponentInfo.children = [];
    
            this.components.trigger("addComponent", addComponentInfo);

            if(typeof widgets[widgetId].children != 'undefined')
                for(let childId of widgets[widgetId].children)
                    currentWidgets.push(childId);
        }
    }


}