class CheckBoxComponentModel extends BaseComponentModel
{
    static propertiesNames = null;
    
    constructor(componentsModel) {

        super(componentsModel);

    }
}

CheckBoxComponentModel.propertiesNames = new Set([
    "checked",
    ...BaseComponentModel.propertiesNames
]);