class Characteristics_BooleanType extends BasePropertyType{
    constructor(){
        super({"en" : "Boolean", "ru" : "Логический"});
        this.value = false;
    }
    onCreate(){
        const widget = new WidgetLayoutHorizontal();
        const label = new WidgetLabel();
        label.text = "Значение";
        const checkbox = new WidgetCheckBox();

        checkbox.htmlElement.onchange = (e) => {
            this.value = e.target.checked;
        }

        widget.includeWidget(label);
        widget.includeWidget(checkbox);
        this.widget = widget;
    }
}