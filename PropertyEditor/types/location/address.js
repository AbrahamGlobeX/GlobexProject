class Location_AddressType extends BasePropertyType{
    constructor(){
        super({"en" : "Address", "ru" : "Адрес"});
        
    }
    onCreate(){
        const widget = new WidgetLayoutHorizontal();

        const label = new WidgetLabel();
        label.text = "Значение";

        const input = new WidgetInput();
        input.text = "";
        input.htmlElement.oninput = (e) => {
            this.value = e.target.value;
        }

        widget.includeWidget(label);
        widget.includeWidget(input);
        this.widget = widget;
    }
}