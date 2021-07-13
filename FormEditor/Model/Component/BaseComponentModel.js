class BaseComponentModel extends BaseModel
{
    static propertiesNames = null;

    static customPropertyTypes = null;

    static propertiesInfo = null;

    constructor(componentsModel) {

        super();

        this.name = null;

        this.type = null;

        this.parent = null;

        this.componentsModel = componentsModel;

        this.properties = {};

    }

    getPropertyValue(name) {
        return this.properties[name].value;
    }

    getPropertyValues() {

        let properties = this.properties;

        let propertyValues = {};

        for(let propertyName in properties)
            propertyValues[propertyName] = properties[propertyName].value;

        return propertyValues;
    }

    checkProperty(name) {

        return this.constructor.propertiesNames.has(name);
    }

    setPropertyValue(name, value) {

        let property = this.properties[name];

        if(typeof property !== 'undefined')
            property.setValue(value);
        else
            this.initProperty(name, value);

        let updateInfo = {
            componentName : this.name,
            componentType : this.type,
            propertyName : name,
            propertyValue : value
        };
        
        this.componentsModel.trigger("updateComponentPropertyValue", updateInfo);

        APP.form.widgets[this.name] = this.toJson();
        // APP.script.store.widgets = this.toJson();
    }

    initProperty(name, value) {

        if(!this.checkProperty(name)) {

            console.error("Uknown property name");

            return;
        }

        let property;

        let propertyClass = BaseComponentModel.customPropertyTypes[name];

        if(typeof propertyClass === 'undefined')
            propertyClass = ComponentPropertyModel;

        property = new propertyClass();

        property.init(name, value);

        this.properties[name] = property;
    }

    init(name, type, properties) {

        this.name = name;

        this.type = type;

        for(let propertyName in properties)
            this.initProperty(propertyName, properties[propertyName]);
    }

    propertiesToJson() {

        const res = {};

        const properties = this.properties;

        for(let key in properties)
            res[key] = properties[key].value;
        
        return res;
    }

    onToJson(data) {

    }

    toJson() {

        const data = {};

        data.name = this.name;
        data.type = this.type;

        data.properties = this.propertiesToJson();

        this.onToJson(data);

        return data;
    }

    fromJson(data) {

        this.name = data.name;
        this.type = data.type;

        const properties = data.properties;

        for(let propertyName in properties)
            this.initProperty(propertyName, properties[propertyName]);
    }
}

BaseComponentModel.propertiesNames = new Set([
    "name",
    "x",
    "y",
    "width",
    "height",
    "backgroundColor",
    "position"
]);

BaseComponentModel.propertiesInfo = {
    
    "name": {default : "name"},
    
    "text": {default : "text"},
    
    "x": {default : 0, stepValue : 1},

    "y": {default : 0, stepValue : 1},

    "width": {default : 0, minValue : 0, stepValue : 1},

    "height": {default : 0, minValue : 0, stepValue : 1},

    "backgroundColor": {default : "#000000"},

    "position": {default : "absolute"},

    "checked": {default : false}
}

BaseComponentModel.customPropertyTypes = {

    "text-align": EnumComponentPropertyModel

}



