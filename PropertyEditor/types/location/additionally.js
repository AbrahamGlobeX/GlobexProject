class Location_AdditionallyType extends BasePropertyType{
    constructor(){
        super({"en" : "Additionally", "ru" : "Дополнительно"});
        
    }
    onCreate(){
        const widget = new WidgetLayoutHorizontal();

        const label = new WidgetLabel();
        label.text = "Значение";

        const input = new WidgetTextArea();
        input.text = "";
        input.htmlElement.oninput = (e) => {
            this.value = e.target.value;
        }

        widget.includeWidget(label);
        widget.includeWidget(input);
        this.widget = widget;
    }
}