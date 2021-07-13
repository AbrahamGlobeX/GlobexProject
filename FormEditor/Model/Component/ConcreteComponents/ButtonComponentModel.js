class ButtonComponentModel extends TextComponentModel
{
    static propertiesNames = null;
    
    constructor(componentsModel) {

        super(componentsModel);

    }

}

ButtonComponentModel.propertiesNames = new Set([
    ...TextComponentModel.propertiesNames
]);