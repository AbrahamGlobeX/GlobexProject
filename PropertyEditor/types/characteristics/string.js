class Characteristics_StringType extends BasePropertyType {
    constructor() {
        super({ "en": "String", "ru": "Строка" });
        this.value = "";
    }
    onCreate() {
        const widget = new WidgetLayoutHorizontal();
        const label = new WidgetLabel();
        label.text = "Значение";
        const input = new WidgetInput();
        input.htmlElement.oninput = (e) => {
            this.value = e.target.value;
        }

        widget.includeWidget(label);
        widget.includeWidget(input);

        this.widget = widget;
    }

    static async getLabelWidget(property) {
        const widget = new WidgetLayoutHorizontal();
        const label = new WidgetLabel();
        label.text = property.value;

        widget.includeWidget(label);
        console.log("widget", widget);
        return widget;
    }

    static async getInputWidget(property) {
        const widget = new WidgetLayoutHorizontal();
        const input = new WidgetInput();
        input.text = property.value;
        input.htmlElement.oninput = (e) => {
            property.value = e.target.value;
        }

        widget.includeWidget(input);
        return widget;
    }
}