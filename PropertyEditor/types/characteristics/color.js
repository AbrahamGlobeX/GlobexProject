class Characteristics_ColorType extends BasePropertyType {
    constructor() {
        super({ "en": "Color", "ru": "Цвет" });
    }
    onCreate() {
        this.value = "#ff0000";
        this._currentColorType = "RGB";


        const widget = new WidgetLayoutHorizontal();

        
        const label = new WidgetLabel();
        label.text = "Значение";

        this._valueWidget = new WidgetLayoutHorizontal();
        
        const comboBox = new WidgetComboBox();

        comboBox.addItem("RGB", this.switchColorMode.bind(this,"RGB"));
        comboBox.addItem("HEX", this.switchColorMode.bind(this,"HEX"));
        comboBox.addItem("RAL", this.switchColorMode.bind(this,"RAL"));


        widget.includeWidget(label);
        widget.includeWidget(this._valueWidget);
        widget.includeWidget(comboBox);

        comboBox.setCurrentItem(0);
        // const color = new WidgetColor();
        // color.color = this.value;



        



        // const input = new WidgetInput();
        // input.htmlElement.onchange = (e) => {
        //     this._colorvalue = e.target.value;
        // }

        // color.htmlElement.onchange = (e) => {
        //     this.value = e.target.value;
        //     input.text = e.target.value;
        // }


        this.widget = widget;
    }

    switchColorMode(newMode) {
        this._valueWidget.clearWidget();
        this._currentColorType = newMode;
        if(this._currentColorType == "RAL"){
            const colorButton = new WidgetButton();
            colorButton.setStyleProp("background", this.value);
           
            const input = new WidgetInput();
            input.text = this._ralCode;
            input.htmlElement.oninput = (e) => {
                const color = WidgetColor.getHexRal(e.target.value);
                if(color){
                    this._ralCode = e.target.value;
                    colorButton.setStyleProp("background",color);
                    this.value = color;
                }
            }

            colorButton.htmlElement.ondblclick = (e) => {
                Characteristics_ColorType.openRalColor((color) => {
                    this._ralCode = color;
                    this.value = WidgetColor.getHexRal(color);
                    colorButton.setStyleProp("background", this.value);
                    input.text = color;
                });
            }

            this._valueWidget.includeWidget(colorButton);
            this._valueWidget.includeWidget(input);


        } else {
            let modeValue = this.value;
            if(this._currentColorType == "RGB"){
                const [red,green,blue] =    WidgetColor.HexToRGB(this.value); 
                modeValue = "rgb(" + red + " , " + green + ", " + blue + ")";
            }
            const input = new WidgetLabel();
            input.text = modeValue;

            const color = new WidgetColor();
            color.color = this.value;

            
            color.htmlElement.onchange = (e) => {
                this._ralCode = "";
                this.value = e.target.value;
                let val = this.value;
                if(this._currentColorType == "RGB"){
                    const [red,green,blue] =    WidgetColor.HexToRGB(this.value); 
                    val = "rgb(" + red + " , " + green + ", " + blue + ")";
                }
                input.text = val;
            }

            

            this._valueWidget.includeWidget(color);
            this._valueWidget.includeWidget(input);
        }
    }
    static openRalColor(callback){
        const dialog = new WidgetDialog();
        const mainLayout = new WidgetLayoutVertical();
        mainLayout.setStyleProp("minWidth", "500px");
        dialog.includeWidget(mainLayout);

        const colorLayoutWrapper = new WidgetLayoutHorizontal(); 
        colorLayoutWrapper.setStyleProp("width","100%");
        const colorLayout = new WidgetLayoutVertical();
        colorLayout.setStyleProp("height","300px");


        for(let color of Object.keys(WidgetColor.ralColor)){
            const layout = new WidgetLayoutHorizontal();
            layout.setStyleProp("width","100%");
            layout.setStyleProp("minHeight","50px");
            layout.setStyleProp("maxHeight","50px");
            const btn = new WidgetButton();
            btn.setStyleProp("background",WidgetColor.getHexRal(color));
            const label = new WidgetLabel();
            label.text = color;

            layout.includeWidget(btn);
            layout.includeWidget(label);
            colorLayout.includeWidget(layout);

            layout.htmlElement.ondblclick = (e) => {
                dialog.destroyWidget();
                callback(color);
            }
        }


        colorLayoutWrapper.includeWidget(colorLayout);
        mainLayout.includeWidget(colorLayoutWrapper);

        const btnLayout = new WidgetLayoutHorizontal();
        btnLayout.setStyleProp("width","100%");
        const btn = new WidgetButton();
        btn.setStyleProp("color","#123456");
        btn.text = "Отмена";

        btn.htmlElement.onclick = (e) => {
            dialog.destroyWidget();
        }

        btnLayout.includeWidget(btn);
        mainLayout.includeWidget(btnLayout);
    }

    static async getLabelWidget(property) {
        
        const switchColorMode = function(newMode, widget, value){
            widget.clearWidget();

            if(newMode == "RAL"){
                const colorButton = new WidgetButton();
                colorButton.setStyleProp("background", value);
            
                const input = new WidgetLabel();
                input.text = WidgetColor.findRalByHex(value) || "";

                widget.includeWidget(colorButton);
                widget.includeWidget(input);


            } else {
                let modeValue = value;
                if(newMode == "RGB"){
                    const [red,green,blue] =    WidgetColor.HexToRGB(value); 
                    modeValue = "rgb(" + red + " , " + green + ", " + blue + ")";
                }
                const input = new WidgetLabel();
                input.text = modeValue;

                const color = new WidgetColor();
                color.color = value;
                color.disabled = true;
        

                widget.includeWidget(color);
                widget.includeWidget(input);
            }
        }

        const colorType = undefined;

        const widget = new WidgetLayoutHorizontal();
        const valueWidget = new WidgetLayoutHorizontal();
        const comboBox = new WidgetComboBox();

        comboBox.addItem("RGB", switchColorMode.bind(this,"RGB",valueWidget,property.value));
        comboBox.addItem("HEX", switchColorMode.bind(this,"HEX",valueWidget,property.value));
        comboBox.addItem("RAL", switchColorMode.bind(this,"RAL",valueWidget,property.value));

        widget.includeWidget(valueWidget);
        widget.includeWidget(comboBox);

        comboBox.setCurrentItem(0);


        return widget;
    }

    static async getInputWidget(property) {
        /*const widget = new WidgetLayoutHorizontal();
        const color = new WidgetColor();
        color.disabled = false;
        color.color = property.value;
        color.htmlElement.onchange = (e) => {
            property.value = e.target.value;
        }

        widget.includeWidget(color);
        return widget;*/

        const switchColorMode = function(newMode, widget, property){
            widget.clearWidget();

            if(newMode == "RAL"){
                const colorButton = new WidgetButton();
                colorButton.setStyleProp("background", property.value);
            
                const input = new WidgetInput();
                input.text = WidgetColor.findRalByHex(property.value) || "";
                input.htmlElement.oninput = (e) => {
                    const v = WidgetColor.getHexRal(e.target.value);
                    if(v){
                        property.value = v;
                        colorButton.setStyleProp("background", property.value);
                    }
                }

                colorButton.htmlElement.ondblclick = (e) => {
                    Characteristics_ColorType.openRalColor((color) => {
                        property.value = WidgetColor.getHexRal(color);
                        colorButton.setStyleProp("background", property.value);
                        input.text = color;
                    });
                }

                widget.includeWidget(colorButton);
                widget.includeWidget(input);


            } else {
                let modeValue = property.value;
                if(newMode == "RGB"){
                    const [red,green,blue] =    WidgetColor.HexToRGB(property.value); 
                    modeValue = "rgb(" + red + " , " + green + ", " + blue + ")";
                }
                const input = new WidgetLabel();
                input.text = modeValue;

                const color = new WidgetColor();
                color.color = property.value;
                color.htmlElement.onchange = (e) =>{
                    property.value = e.target.value;
                    let modeValue2 = property.value;
                    if(newMode == "RGB"){
                        const [red,green,blue] =    WidgetColor.HexToRGB(property.value); 
                        modeValue2 = "rgb(" + red + " , " + green + ", " + blue + ")";
                    }
                    input.text = modeValue2;
                }
        

                widget.includeWidget(color);
                widget.includeWidget(input);
            }
        }

        const colorType = undefined;

        const widget = new WidgetLayoutHorizontal();
        const valueWidget = new WidgetLayoutHorizontal();
        const comboBox = new WidgetComboBox();

        comboBox.addItem("RGB", switchColorMode.bind(this,"RGB",valueWidget,property));
        comboBox.addItem("HEX", switchColorMode.bind(this,"HEX",valueWidget,property));
        comboBox.addItem("RAL", switchColorMode.bind(this,"RAL",valueWidget,property));

        widget.includeWidget(valueWidget);
        widget.includeWidget(comboBox);

        comboBox.setCurrentItem(0);


        return widget;
    }
}