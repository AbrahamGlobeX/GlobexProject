class DivComponentModel extends ContainerComponentModel
{
    constructor(componentsModel) {

        super(componentsModel);
    }

}

DivComponentModel.propertiesNames = new Set([
    ...ContainerComponentModel.propertiesNames
]);