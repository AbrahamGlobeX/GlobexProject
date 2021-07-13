
class PropertyBlockView {

    static nameToType = {}

    static nameToInitFunc = {}

    static nameToUpdateValueFunc = {}

    static propertiesInfo = {}

    constructor(propertiesBlock) {

        this.htmlContainer = null;

        this.propertiesBlock = propertiesBlock;

        this.empty = false;
    }

    static getId(name) {
        return name + "_pr";
    }

    static getDefault(name) {
        return PropertyBlockView.propertiesInfo[name].default;
    }
    
    init(name, value) {

        this.onInit(name, value);

        this.htmlContainer.id = PropertyBlockView.getId(name);
    }

    checkEmptyRewrite(value, rewriteEmpty) {

        if(!rewriteEmpty && this.empty)
            return false;

        this.empty = value === '';

        return true;
    }

    handleInput() {
        
        this.empty = false;
    }
}