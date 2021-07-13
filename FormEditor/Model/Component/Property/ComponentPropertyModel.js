class ComponentPropertyModel
{

    constructor() {

        this.name = null;

        this.value = null;

    }

    onInit(value) {

        this.value = value;
    }

    init(name, value) {

        this.name = name;

        this.onInit(value);

    }

    setValue(value) {

        this.value = value;
    }


}
