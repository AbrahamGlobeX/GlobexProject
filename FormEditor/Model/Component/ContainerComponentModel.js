class ContainerComponentModel extends BaseComponentModel
{
    static propertiesNames = null;
    
    constructor(componentsModel) {

        super(componentsModel);
        
        this.children = [];
    }

    toJson() {

        const res = super.toJson();

        const children = [];

        for(let child of this.children)
            children.push(child.name);

        res.children = children;

        return res;
    }
}

ContainerComponentModel.propertiesNames = new Set([
    "padding-left",
    ...(BaseComponentModel.propertiesNames)
]);