class MainModel extends BaseModel
{
    constructor() {

        super();

        this.form = new FormModel();

        this.componentSelector = new ComponentSelectorModel();

        this.componentsClipboard = [];

        this.editMode = true;
    }

    getPropertiesInfo(componentTypeNames) {

        let properties = BaseComponentModel.propertiesInfo;

        let enumProperties = EnumComponentPropertyModel.propertiesInfo;

        let customComponentTypes = ComponentsModel.customComponentTypes;

        let componentTypeProperties = {};

        for(let typeName of componentTypeNames) {

            let customComponentClassName = customComponentTypes[typeName];

            let className;

            if(typeof customComponentClassName !== 'undefined')
                className = customComponentClassName;
            else
                className = BaseComponentModel;

            componentTypeProperties[typeName] = className.propertiesNames;
        }

        return {

            properties : {...properties, ...enumProperties},

            componentTypeProperties : componentTypeProperties
        };

    }

    init(parameters) {

        this.form.init();

        let componentTypeNames = ComponentsModel.componentTypeNames;

        let initInfo = {

            componentTypeNames : componentTypeNames,

            propertiesInfo : this.getPropertiesInfo([...componentTypeNames, "root"])
        }

        this.events.trigger('init', initInfo);
    }

    setEditMode(value) {

        if(this.editMode == value) return;

        this.editMode = value;

        this.trigger('onChangeEditMode', value);
    }

}