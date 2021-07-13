class BasePropertyType {
    constructor(names) {
        this._names = names;
        this._widget = undefined;
        this.onCreate();
    }
    onCreate() {
        const strError = "This method must be redefined";
        console.error(strError);
        throw strError;
    }
    createWidget() {
        const strError = "This method must be redefined";
        console.error(strError);
        throw strError;
    }
    getName(lang = "ru") {
        return this._names[lang];
    }
    set widget(value) {
        this._widget = value;
    }
    get widget() {
        if (!this._widget || !this._widget.hasOwnProperty("id") || !ReactComponent.hasOwnProperty(this._widget.id)) {
            this.onCreate();
        }
        return this._widget;
    }
}