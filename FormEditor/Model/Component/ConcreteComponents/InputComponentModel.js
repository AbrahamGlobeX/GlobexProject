class InputComponentModel extends TextComponentModel
{
    static propertiesNames = null;
    
    constructor(componentsModel) {

        super(componentsModel);

    }

}

InputComponentModel.propertiesNames = new Set([
    ...TextComponentModel.propertiesNames
]);