class Characteristics_TelephoneType extends BasePropertyType {
    constructor(){
        super({"en" : "Telephone", "ru" : "Телефон"});
    }
    onCreate(){
        this.value = {
            "country" : "",
            "code" : "",
            "number" : "",
            "additional" : ""
        }
        const widgetWrapper = new WidgetLayoutHorizontal();
        widgetWrapper.width = "100%";
        widgetWrapper.height = "100%";

        const widget = new WidgetLayoutVertical();
        widget.height = "100px";

        const titleWidget = new WidgetLayoutHorizontal();
        titleWidget.setStyleProp("minHeight","50px");
        titleWidget.setStyleProp("maxHeight","50px");
        titleWidget.width = "100%";

        const label1 = new WidgetLabel();
        
        const label2 = new WidgetLabel();
        label2.text = "Код страны";
        const label3 = new WidgetLabel();
        label3.text = "Код города / оператора";
        const label4 = new WidgetLabel();
        label4.text = "Номер";
        const label5 = new WidgetLabel();
        label5.text = "Доп.";

        titleWidget.includeWidget(label1);
        titleWidget.includeWidget(label2);
        titleWidget.includeWidget(label3);
        titleWidget.includeWidget(label4);
        titleWidget.includeWidget(label5);

        widget.includeWidget(titleWidget);

        const inputWidget = new WidgetLayoutHorizontal();
        inputWidget.setStyleProp("minHeight","50px");
        inputWidget.setStyleProp("maxHeight","50px");
        inputWidget.width = "100%";

        const valuelabel = new WidgetLabel();
        valuelabel.text = "Значение";

        const inputCountry = new WidgetInput();
        inputCountry.text = "";
        inputCountry.htmlElement.oninput = (e) => {
            this.controlInput(e,"country");
        }
        const inputCode = new WidgetInput();
        inputCode.text = "";
        inputCode.htmlElement.oninput = (e) => {
            this.controlInput(e,"code");
        }
        const inputNumber = new WidgetInput();
        inputNumber.text = "";
        inputNumber.htmlElement.oninput = (e) => {
            this.controlInput(e,"number");
        }

        const inputAdditional = new WidgetInput();
        inputAdditional.text = "";
        inputAdditional.htmlElement.oninput = (e) => {
            this.controlInput(e,"additional");
        }

        inputWidget.includeWidget(valuelabel);
        inputWidget.includeWidget(inputCountry);
        inputWidget.includeWidget(inputCode);
        inputWidget.includeWidget(inputNumber);
        inputWidget.includeWidget(inputAdditional);

        widget.includeWidget(inputWidget);

        widgetWrapper.includeWidget(widget);
        this.widget = widgetWrapper;
    }
    controlInput(e, value){
        if(e.inputType == "insertText"){
            if(e.data.charCodeAt() < 48 || e.data.charCodeAt() > 57){
                e.target.value = this.value[value];
                if(value == "country"){
                    e.target.value = "+" + this.value[value];
                }
                return;
            }
            this.value[value] = parseInt(e.target.value);
            if(value == "country"){
                e.target.value = "+" + this.value[value];
            }
        }
    }
}