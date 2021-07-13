class LabelComponentModel extends TextComponentModel
{
    static propertiesNames = null;
    
    constructor(componentsModel) {

        super(componentsModel);

    }

}

LabelComponentModel.propertiesNames = new Set([
    ...TextComponentModel.propertiesNames
]);