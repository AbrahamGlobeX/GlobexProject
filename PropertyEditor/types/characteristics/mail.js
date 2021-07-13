class Characteristics_MailType extends BasePropertyType {
    constructor(){
        super({"en" : "Mail", "ru" : "Почта"});
    }
    onCreate(){
        const widget = new WidgetLayoutHorizontal();

        const label = new WidgetLabel();
        label.text = "Значение";

        const input = new WidgetInput();
        input.text = "";
        input.htmlElement.oninput = (e) => {
            input.inputElement.style.border = "none";
            this.value = e.target.value;
            if(!new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{1,61})+\.+([a-zA-Z-0-9-]{2,61})$").test(this.value)){
                input.inputElement.style.border = "1px solid red";
            }
        }

        widget.includeWidget(label);
        widget.includeWidget(input);
        this.widget = widget;
    }
}