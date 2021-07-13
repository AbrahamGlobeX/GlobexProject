
class CheckBoxPropertyView extends PropertyBlockView {

    static nameToType = {}

    static nameToInitFunc = {}

    static nameToUpdateValueFunc = {}

    static propertiesInfo = {};

    constructor(propertiesBlock) {

        super(propertiesBlock);

        this.inputElement;
    }

    initHtml(name, value) {

        let htmlContainer = document.createElement('div');
         
        htmlContainer.classList.add("input-group");

        let inputGroupAddon = document.createElement('span');
         
        inputGroupAddon.classList.add("input-group-addon");
         
        inputGroupAddon.textContent = name;

        htmlContainer.appendChild(inputGroupAddon);

        let inputElement = document.createElement('input');
         
        inputElement.classList.add("form-control");
         
        inputElement.setAttribute("type", "checkbox");
         
        inputElement.setAttribute("placeholder", name);

        if(typeof value === 'undefined')
            value = PropertyBlockView.getDefault(name);

        if(value)
            inputElement.setAttribute("checked", "");
        
        inputElement.value = value;

        inputElement.addEventListener('input', function(event) {

            this.handleInput();

            this.propertiesBlock.trigger("changePropertyViewValue", name, event.target.checked);

        }.bind(this));

        htmlContainer.appendChild(inputElement);

        this.inputElement = inputElement;

        this.htmlContainer = htmlContainer;
    }

    onInit(name, value) {

        this.initHtml(name, value);
    }

    setValue(value, rewriteEmpty = true) {

        if(!this.checkEmptyRewrite(value, rewriteEmpty))
            return;

        if(value)
            this.inputElement.setAttribute("checked", "");
        else
            this.inputElement.removeAttribute("checked");
    }
}