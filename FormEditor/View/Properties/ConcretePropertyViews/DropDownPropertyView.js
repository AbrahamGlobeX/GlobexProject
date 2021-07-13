
class DropDownPropertyView extends PropertyBlockView {

    static nameToType = {}

    static nameToInitFunc = {}

    static nameToUpdateValueFunc = {}

    static propertiesInfo = {};

    constructor(propertiesBlock) {

        super(propertiesBlock);

        this.inputElement = null;
    }

    initHtml(name, value) {

// <div class="dropdown">
//   <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
//   <span class="caret"></span></button>
//   <ul class="dropdown-menu">
//     <li><a href="#">HTML</a></li>
//     <li><a href="#">CSS</a></li>
//     <li><a href="#">JavaScript</a></li>
//   </ul>
// </div>

        let htmlContainer = document.createElement('div');
         
        htmlContainer.classList.add("input-group");

        let inputGroupAddon = document.createElement('span');
         
        inputGroupAddon.classList.add("input-group-addon");
         
        inputGroupAddon.textContent = name;

        htmlContainer.appendChild(inputGroupAddon);

        let dropDownContainer = document.createElement('div');
         
        dropDownContainer.classList.add("dropdown");

        let buttonElement = document.createElement('button');
         
        buttonElement.classList.add("btn");
        buttonElement.classList.add("btn-default");
        buttonElement.classList.add("dropdown-toggle");

        buttonElement.setAttribute("type", "button");
        buttonElement.setAttribute("data-toggle", "dropdown");

        buttonElement.style.width = "100%";

        if(typeof value === 'undefined')
            value = PropertyBlockView.getDefault(name);
         
        buttonElement.textContent = value;

        let caretElement = document.createElement('span');
         
        caretElement.classList.add("caret");

        buttonElement.appendChild(caretElement);

        dropDownContainer.appendChild(buttonElement);

        let listElement = document.createElement('ul');
         
        listElement.classList.add("dropdown-menu");

        let propertyValues = PropertyBlockView.propertiesInfo[name].values;

        for(let propertyValueItem of propertyValues) {

            let listItemElement = document.createElement('li');

            let listItemLink = document.createElement('a');

            listItemLink.setAttribute("href", "#");

            listItemLink.textContent = propertyValueItem;
         
            listItemElement.appendChild(listItemLink);

            listElement.appendChild(listItemElement);

            listItemLink.addEventListener('click', function(e) {

                this.handleInput();

                this.propertiesBlock.trigger("changePropertyViewValue", name, propertyValueItem);
                
            }.bind(this));
        }

        dropDownContainer.appendChild(listElement);

        htmlContainer.appendChild(dropDownContainer);

        this.buttonElement = buttonElement;

        this.htmlContainer = htmlContainer;
    }

    onInit(name, value) {

        this.initHtml(name, value);
    }

    setValue(value, rewriteEmpty = true) {

        if(!this.checkEmptyRewrite(value, rewriteEmpty))
            return;

        this.buttonElement.textContent = value;
    }
}