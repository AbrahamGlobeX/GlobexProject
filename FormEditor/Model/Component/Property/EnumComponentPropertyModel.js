class EnumComponentPropertyModel extends ComponentPropertyModel
{
    static propertiesInfo = {};

    constructor() {

        super();

        this.name = null;

        this.enumValues = null;

    }

    checkValue(value) {
        return (EnumComponentPropertyModel.propertiesInfo[this.name].values.indexOf(value) != -1)
    }

    onInit(value) {

        this.enumValues = EnumComponentPropertyModel.propertiesInfo[this.name].enumValues;

        if(this.checkValue(value))
            super.onInit(value);

    }

    setValue(value) {

        if(this.checkValue(value))
            super.setValue(value);
    }
}

EnumComponentPropertyModel.propertiesInfo = {

    "text-align" : {default : "center", values: ["center", "left", "right"]}

}