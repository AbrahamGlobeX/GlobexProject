class TextComponentModel extends BaseComponentModel
{
    static propertiesNames = null;
    
    constructor(componentsModel) {

        super(componentsModel);

    }

}

TextComponentModel.propertiesNames = new Set([
    "text",
    "text-align",
    ...(BaseComponentModel.propertiesNames)
]);