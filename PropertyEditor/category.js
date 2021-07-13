class Property_Category{
    static maxID = -1;
    constructor(names, id){
        this._names = names;
        this._id = id;
    }
    static create(names){
        Property_Category.maxID++;
        return new Property_Category(names,Property_Category.maxID);
    }
    getName(lang = "ru"){
        return this._names[lang];
    }
    getID(){
        return this._id;
    }
}