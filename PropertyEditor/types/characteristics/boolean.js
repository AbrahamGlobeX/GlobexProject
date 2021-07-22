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

    static async getInputWidget(property) {
        const widget = new WidgetLayoutHorizontal();
        const input = new WidgetCheckBox();
        input.checked = property.value;
        input.inputElement.onchange = (e) => {
            property.value = e.target.checked;
        }

        widget.includeWidget(input);
        return widget;
    }
	
	static async getLabelWidget(property) {
        const widget = new WidgetLayoutHorizontal();
        const input = new WidgetCheckBox();
        input.checked = property.value;
        input.inputElement.disabled = true;

        widget.includeWidget(input);
        return widget;
    }
}