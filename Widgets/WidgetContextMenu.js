class ContextMenu{
    constructor(showMenuHandler = undefined){
        this._items = {};
        this._elementsWithType = {};
        this._htmlElement = undefined;
        this._isShow = false;
        this._isBlocked = false;
        this.onCreate(showMenuHandler);
    }
    onCreate(showMenuHandler){
        this._htmlElement = document.createElement("div");
        this._htmlElement.classList.add("ContextMenu");

        window.onclick = (e) => {
            if(!this._isShow) return;
            if(!this._htmlElement.contains(e.target)){
                this.hide();
            }
        }
        if(showMenuHandler){
            window.oncontextmenu = showMenuHandler;
        }
    }
    destructor(){
        window.oncontextmenu = (e) => {return true;}
    }
    show(mX,mY){
        if(this._isBlocked) return;
        this._htmlElement.style.left = mX + "px";
        this._htmlElement.style.top = mY + "px";
        document.body.appendChild(this._htmlElement);
        this._isShow = true;
    }
    hide(){
        if(!this._isShow) return;
        document.body.removeChild(this._htmlElement);
        this._isShow = false;
    }
    addItem(text, callback = undefined){
        const item = document.createElement("div");
        item.classList.add("ContextMenuItem");
        
        const content = document.createElement("div");
        content.classList.add("ContextMenuContent");
        content.innerHTML = text;

        item.append(content);

        item.onclick = () => {
            this.hide();
            callback();
        };
        this._items[text] = callback;
        this._htmlElement.append(item);
    }
    addElementWithType(element, type, info){
        this._elementsWithType[element] = {"type" : type, "info" : info}
    }
    clearItems(){
        this._items = {};

        while(this._htmlElement.children.length != 0){
            this._htmlElement.children[0].remove();
        }
    }
    set isBlocked(value){
        this._isBlocked = value;
    }
    get isBlocked(){
        return this._isBlocked;
    }
    get isShow(){
        return this._isShow;
    }
    get elementsWithType(){
        return this._elementsWithType;
    }
}

class ContextMenuItem{
    constructor(name,widgetID,type,info,callback, style = {}, classlist = []){
        this._type = type;
        this._widgetID = widgetID;
        this._name = name;
        this._info = info;
        this._callback = callback;
        this._style = style;
        this._classlist = classlist;
    }
    set name(value){
        this._name = value;
    }
    get name(){
        return this._name;
    }
    get callback(){
        return this._callback;
    }
    get type(){
        return this._type;
    }
    get info(){
        return this._info;
    }
    get widgetID(){
        return this._widgetID;
    }
    set callback(callback){
        this._callback = callback;
    }
    set style(value){
        this._style = value;
    }
    get style(){
        return this._style;
    }
    set classlist(value){
        this._classlist = value;
    }
    get classlist(){
        return this._classlist;
    }
    addClasslist(name){
        if(this._classlist.indexOf(name) != -1) return;
        this._classlist.push(name);
    }
    removeClassList(name){
        this._classlist = this._classlist.filter((item) => item !== name);
    }
}
class ContextMenuList{
    constructor(name = "подменю"){
        this._list = [];
        this._name = name;
    }
    addMenuItem(name,widgetID,type,info,callback){
        this._list.push(new ContextMenuItem(name,widgetID,type,info,callback));
    }
    setMenuItemCallback(name,callback){
        const item = this.findItemByName(name);
        if(item){
            item.callback = callback;
        }
    }
    get list(){
        return this._list;
    }
    findItemByName(name){
        let finded = undefined;
        for(let item of this._list){
            if(item.name == name){
                finded = item;
                break;
            }
        }
        return finded;
    }
    showMenu(hideMenuCallback,menu){
        for(let item of this._list){
            const li = document.createElement("li");
            if(item instanceof ContextMenuList){
                li.innerHTML = "<p>"+item._name+"</p>";
                li.classList.add("subMenuParent");
                const subUl = document.createElement("ul");
                subUl.classList.add("subMenuChild");
                li.append(subUl);
                item.showMenu(hideMenuCallback,subUl);
            } else {
                li.innerHTML = "<p>" + item.name + "</p>";
                for(let classlist of item.classlist){
                    li.classList.add(classlist);
                }
                if(!li.classList.contains("ContextMenu-notSelectable")){
                    li.onclick = () => {
                        hideMenuCallback();
                        if(item.callback){
                            item.callback(item.info);
                        }
                    }
                }
                for(let style of Object.keys(item.style)){
                    li.style[style] = item.style[style];
                }
                
            }
            menu.append(li);
        }
    }
    addSubMenu(submenu){
        this._list.push(submenu);
    }
    findItemByWidgetID(widgetID){
        let finded = undefined;
        for(let item of this._list){
            if(item instanceof ContextMenuList) continue;
            if(item.widgetID == widgetID){
                finded = {
                    "type" : item.type,
                    "info" : item.info
                }
                break;
            }
        }
        return finded;
    }
    findItemByInfoField(field,value){
        let finded = undefined;
        for(let item of this._list){
            if(item instanceof ContextMenuList) continue;
            if(Object.keys(item.info).length == 0) continue;
            const fields = field.split(".");

            let currentField = item.info;
            let i = 0;
            for(let fiel of fields){
                if(!currentField.hasOwnProperty(fiel)) break;
                currentField = currentField[fiel];
                i++;
            }
            if(i != fields.length) continue;

            if(currentField == value){
                finded = item;
                break;
            }
        }
        return finded;
    }
    addAllItemsInfoField(field,value){
        for(let item of this._list){
            if(item instanceof ContextMenuList) continue;
            item.info[field] = value;
        }
    }
    clearItems(){
        this._list = [];
    }
    clearStyles(){
        for(let item of this._list){
            if(item instanceof ContextMenuList) continue;
            item.style = {};
            item.classlist = [];
        }
    }
    addAllItemStyles(style){
        for(let item of this._list){
            if(item instanceof ContextMenuList) continue;
            item.style = style;
        }
    }
}
class NewContextMenu{
    constructor(){
        this._isShow = false;
        this._isBlocked = false;
        this._menus = {};
        this._showedMenu = undefined;

        window.addEventListener("click", (e) => {
            if(this._isShow){
                if(this._showedMenu && !this._showedMenu.contains(e.target)){
                    this.hideMenu("");
                }
            }
        }) 

    }
    createMenu(menu){
        if(this._menus.hasOwnProperty(menu)) return;
        this._menus[menu] = new ContextMenuList();
    }
    addMenuItem(menu,name,widgetID,type,info,callback){
        if(!this._menus.hasOwnProperty(menu)) {
            console.error("Данное меню: " + menu + " не создано.");
            return;
        }
        this._menus[menu].addMenuItem(name,widgetID,type,info,callback);
    }
    addMenuItemSubMenu(menu,submenu){
        if(!this._menus.hasOwnProperty(menu)) {
            console.error("Данное меню: " + menu + " не создано.");
            return;
        }
        
        if(!submenu instanceof ContextMenuList){
            console.log("Не является меню");
            return;
        }
        this._menus[menu].addSubMenu(submenu);
    }
    setMenuItemCallback(menu,name,callback){
        if(!this._menus.hasOwnProperty(menu)) {
            console.error("Данное меню: " + menu + " не создано.");
            return;
        }
        this._menus[menu].setMenuItemCallback(name,callback);
    }
    hideMenu(menu){
        if(!this._isShow) return;
        this._isShow = false;
        if(this._showedMenu){
            this._showedMenu.remove();
        }
    }
    showMenu(menu, mX, mY){
        if(this._isBlocked) return;
        if(!this._menus.hasOwnProperty(menu)) return;

        if(this._isShow){
            this.hideMenu(menu);
        }

        this._showedMenu = document.createElement("div");
        this._showedMenu.classList.add("ContextMenu");
        this._showedMenu.style.left = mX + "px";
        this._showedMenu.style.top = mY + "px";

        const ul = document.createElement("ul");
        this._menus[menu].showMenu(() => {this.hideMenu(menu)},ul);
        this._showedMenu.appendChild(ul);

        
        this._isShow = true;
        document.body.append(this._showedMenu);
    }
    logMenuItems(menu){
        console.log("Меню " + menu + " : ",this._menus[menu])
    }
    findItemByWidgetID(menu, widgetID){
        let finded = undefined;
        if(!this._menus.hasOwnProperty(menu)){
            console.error("Данное меню: " + menu + " не создано.");
            return finded;
        } 
      
        finded = this._menus[menu].findItemByWidgetID(widgetID);
        return finded;
    }
    findItemByName(menu,name){
        if(!this._menus.hasOwnProperty(menu)){
            console.error("Данное меню: " + menu + " не создано.");
            return undefined;
        } 
        return this._menus[menu].findItemByName(name);
    }
    findItemByInfoField(menu,field,value){
        if(!this._menus.hasOwnProperty(menu)){
            console.error("Данное меню: " + menu + " не создано.");
            return undefined;
        } 
        return this._menus[menu].findItemByInfoField(field,value)
    }


}