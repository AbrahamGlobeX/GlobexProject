class Property {
    constructor(category, propRef, name, lang, desc, wiki, valueType, value, isSelect, unitType, unit) {
        this._category = category;
        this._name = name;
        this._lang = lang;
        this._desc = desc;
        this._wiki = wiki;
        this._valueType = valueType;
        this._unitType = unitType;
        this._value = value;
        this._propRef = propRef;
        this._unit = unit;
        this._isSelect = isSelect;
    }

    //#region GetSet
    get category() {
        return this._category;
    }
    set category(value) {
        this._category = value;
    }

    set name(value) {
        this._name = value;
    }
    get name() {
        return this._name;
    }


    set lang(value) {
        this._lang = value;
    }
    get lang() {
        return this._lang;
    }


    set desc(value) {
        this._desc = value;
    }
    get desc() {
        return this._desc;
    }

    set wiki(value) {
        this._wiki = value;
    }
    get wiki() {
        return this._wiki;
    }
    set valueType(value) {
        this._valueType = value;
    }
    get valueType() {
        return this._valueType;
    }

    set unitType(value) {
        this._unitType = value;
    }
    get unitType() {
        return this._unitType;
    }


    set value(value) {
        this._value = value;
    }
    get value() {
        return this._value;
    }

    set propRef(value) {
        this._propRef = value;
    }
    get propRef() {
        return this._propRef;
    }

    set unit(value) {
        this._unit = value;
    }
    get unit() {
        return this._unit;
    }

    get isSelect() {
        return this._isSelect;
    }
    set isSelect(value) {
        this._isSelect = value;
    }
    //#endregion
}
class CategoryWithProperties {
    constructor(name) {
        this._name = name;
        this._list = [];
    }
    static create(name) {
        return new CategoryWithProperties(name);
    }
    static seperatedPropertiesByGroup(properties) {
        const seperated = {};

        for (let propertyName of Object.keys(properties)) {
            if (!seperated.hasOwnProperty(properties[propertyName]["category"])) {
                seperated[properties[propertyName]["category"]] = {};
            }
            seperated[properties[propertyName]["category"]][propertyName] = properties[propertyName];
        }
        return seperated;
    }
    addProperties(properties, checked = false) {

        for (let name of Object.keys(properties)) {
            this.addProperty(properties[name]["prop_ref"] || properties[name]["pid"], name, properties[name]["lang"], properties[name]["description"],
                properties[name]["wiki"], properties[name]["type_value"], properties[name].hasOwnProperty("value") ? properties[name]["value"] : properties[name]["average_default"], checked,
                properties[name]["unit_type"], "");
        }
    }
    addProperty(propRef, name, lang, desc, wiki, valueType, value, isSelect, unitType, unit) {
        const property = new Property(this._name["en"], propRef, name, lang, desc, wiki, valueType, value, isSelect, unitType, unit);
        this._list.push(property);
        return property;
    }
    getName(lang) {
        return this._name[lang];
    }
    get selected() {
        const props = [];
        for (let property of this._list) {
            if (property.isSelect) {
                props.push(property);
            }
        }
        return props;
    }
    get properties() {
        return this._list;
    }
}