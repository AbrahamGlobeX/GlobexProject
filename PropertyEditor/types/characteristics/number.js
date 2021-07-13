class Characteristics_NumberType extends BasePropertyType{
    static units = undefined;
    static unitsID = "609a6e539fb518e175a3f8e3";
    static unitsOwner = "60222cadb4a8ca0008411e04";
    constructor(){
        super({"en" : "Number", "ru" : "Числовой"});
        this._value = 0;
        this._currentType = undefined;
        this._currentUnit = undefined
        

        this._isLoading = false;
    }
    onCreate(){
        console.log("this._unitsType", this._unitsID);

        if(!Characteristics_NumberType.units){
            return Characteristics_NumberType.loadUnitTypes(this.onCreate.bind(this));
        
        }
        this._comboBoxTypes = [];
        
        const widget = new WidgetLayoutVertical();
        widget.setStyleProp("height","100%");

        const comboBoxLayout = new WidgetLayoutHorizontal();
        comboBoxLayout.setStyleProp("width","100%");

        const comboBoxLabel = new WidgetLabel();
        comboBoxLabel.text = "Величина";
        this._comboBoxWithTypes = new WidgetComboBox();

        for(let type of Object.keys(Characteristics_NumberType.units["types"]["SI"])){
            this._comboBoxWithTypes.addItem(Characteristics_NumberType.units["types"]["SI"][type]["name"]["ru"], () => {
                this.changeUnitType(type);
            });
            this._comboBoxTypes.push(type);
        }

        comboBoxLayout.includeWidget(comboBoxLabel);
        comboBoxLayout.includeWidget(this._comboBoxWithTypes);
        widget.includeWidget(comboBoxLayout);

        
        const valueLayout = new WidgetLayoutHorizontal();
        valueLayout.setStyleProp("width","100%");

        const label = new WidgetLabel();
        label.text = "Значение";
        this._valueInput = new WidgetInput();
        this._valueInput.htmlElement.oninput = this.controllInput.bind(this);
        this._unitComboBox = new WidgetComboBox();

        valueLayout.includeWidget(label);
        valueLayout.includeWidget(this._valueInput);
        valueLayout.includeWidget(this._unitComboBox);
        widget.includeWidget(valueLayout);

        this.widget = widget;
    }
    setCurrentType(type){
        this._comboBoxWithTypes.setCurrentItem(this._comboBoxTypes.indexOf(type));
    }
    controllInput(e){
        this._value = e.target.value;
    }
    static loadUnitTypes(callback = undefined){
        const loaded = function(resultJSON){
            console.log("resultJSON",resultJSON);
            Characteristics_NumberType.units = resultJSON.cursor.firstBatch[0];
            if(callback){
                callback();
            }
        }
        const request = '{"_id" : {"$oid" : "'+Characteristics_NumberType.unitsID+'"}, "meta.owner" : {"$oid" : "'+Characteristics_NumberType.unitsOwner+'"}}';
        this._isLoading = true;
        APP.dbWorker.responseDOLMongoRequest = loaded.bind(this);
        APP.dbWorker.sendBaseRCRequest("DOLMongoRequest","objects",request);
    }
    get units(){
        return this._units;
    }
    get value(){
        return this._value;
    }
    get currentType(){
        return this._currentType;
    }
    get currentUnit(){
        return this._currentUnit;
    }
    changeUnitType(type){
        this._unitComboBox.clearItems();
        this._currentUnit = undefined;
        this._currentType = type;
        let index = 0;
        const units = Characteristics_NumberType.units["types"]["SI"][type]["units"];
        const defaultUnit = Characteristics_NumberType.units["types"]["SI"][type]["default"];
        for(let unit of Object.keys(units)){
            this._unitComboBox.addItem(units[unit]["label"]["ru"], () => {
                this._value = Characteristics_NumberType.changeUnits("SI",this._value,this._currentType,this._currentUnit,unit);
                this._valueInput.text = this._value;
                this._currentUnit = unit;
            });
            if(unit === defaultUnit){
                this._currentUnit = unit;
                this._unitComboBox.setCurrentItem(index);
            }
            index++;
        }
        
    }
    static calculateValue(input, formula){
        return eval(formula.replaceAll("x0",input));
    }
    static changeUnits(system,value,currentType,currentUnit,newUnits){
        const units = Characteristics_NumberType.units["types"][system][currentType]["units"];
        return Characteristics_NumberType.calculateValue(
                Characteristics_NumberType.calculateValue(
                    value, units[currentUnit]["fromFormula"]),
                    units[newUnits]["toFormula"]);
    }
    static async waitLoadUnits(){
        return new Promise((res) => {
            if(!Characteristics_NumberType.units){
                if(!this._isLoading){
                    Characteristics_NumberType.loadUnitTypes();
                }
                setTimeout(function a(){
                    if(!Characteristics_NumberType.units){
                        setTimeout(a,1000);
                    } else {
                        res();
                    }
                },1000);
            } else {
                res();
            }
        });
        
    }
    static async getLabelWidget(property){
        await Characteristics_NumberType.waitLoadUnits();
        const widget = new WidgetLayoutHorizontal();
        const label = new WidgetLabel();
        label.text = property.value;
        const comboBox = new WidgetComboBox();

        const units = Characteristics_NumberType.units["types"]["SI"][property.unitType]["units"];
        const defaultUnit = Characteristics_NumberType.units["types"]["SI"][property.unitType]["default"];
        property.unit = property.unit || defaultUnit;
        let index = 0;

        for(let unit of Object.keys(units)){
            comboBox.addItem(units[unit]["label"]["ru"], () => {
                property.value = Characteristics_NumberType.changeUnits("SI",property.value,property.unitType,property.unit,unit);
                label.text = property.value;
                property.unit = unit;
            });
            if(unit === property.unit){
                comboBox.setCurrentItem(index);
            }
            index++;
        }
        widget.includeWidget(label);
        widget.includeWidget(comboBox);
        console.log("widget",widget);
        return widget;
    }
    static getUnitTypeName(system,type){
        if(!Characteristics_NumberType.units){
            return "undefined";
        }
        if(!Characteristics_NumberType.units["types"][system].hasOwnProperty(type)){
            return "Not Found";
        }
        return Characteristics_NumberType.units["types"][system][type]["name"]["ru"];
    }


    static async getInputWidget(property){
        await Characteristics_NumberType.waitLoadUnits();
        const widget = new WidgetLayoutHorizontal();
        const input = new WidgetInput();
        input.text = property.value;
        input.htmlElement.oninput = (e) => {
            property.value = e.target.value;

            console.log("getInput", property.value);

        }

        const comboBox = new WidgetComboBox();


        const units = Characteristics_NumberType.units["types"]["SI"][property.unitType]["units"];
        const defaultUnit = Characteristics_NumberType.units["types"]["SI"][property.unitType]["default"];
        property.unit = property.unit || defaultUnit;
        let index = 0;

        for(let unit of Object.keys(units)){
            comboBox.addItem(units[unit]["label"]["ru"], () => {
                property.value = Characteristics_NumberType.changeUnits("SI",property.value,property.unitType,property.unit,unit);
                input.text = property.value;
                property.unit = unit;
            });
            if(unit === property.unit){
                comboBox.setCurrentItem(index);
            }
            index++;
        }
        widget.includeWidget(input);
        widget.includeWidget(comboBox);
        console.log("widget",widget);
        return widget;

    }
}