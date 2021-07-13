

class HeaderMenu extends BaseView
{
    constructor() {

        super();

        this.htmlContainer = null;

        this.menuItems = {};

        this.editModeEnabledItemName = "View";
        this.editModeDisabledItemName = "Edit";
    }

    initMenuItems(navbarBodyList) {

        let itemNames = [
            "Save",
            "View"
        ];

        for(let name of itemNames) {

            let navbarItemLi = document.createElement('li');

            let navbarItem = document.createElement('a');

            navbarItem.setAttribute("href", "#");

            navbarItem.textContent = name;

            this.menuItems[name] = navbarItem;

            navbarItemLi.appendChild(navbarItem);

            navbarBodyList.appendChild(navbarItemLi);

            navbarItem.addEventListener("click", function(e) {

                this.trigger("onMenuItemClick", name);

            }.bind(this));
        }

    }

    initHtml() {

        let htmlContainer = document.createElement('nav');

        htmlContainer.classList.add("navbar");
        htmlContainer.classList.add("navbar-inverse");

        let containerFluid = document.createElement('div');

        containerFluid.classList.add("container-fluid");

        let navbarHeader = document.createElement('div');

        navbarHeader.classList.add("navbar-header");

        let navbarToggle = document.createElement('button');

        navbarToggle.classList.add("navbar-toggle");

        navbarToggle.setAttribute("data-toggle", "collapse");
        navbarToggle.setAttribute("data-target", "#navbarBody");

        for(let i = 0; i < 3; ++i) {

            let iconBar = document.createElement('span');

            iconBar.classList.add("icon-bar");

            navbarToggle.appendChild(iconBar);
        }

        navbarHeader.appendChild(navbarToggle);

        containerFluid.appendChild(navbarHeader);

        let navbarBody = document.createElement('div');

        navbarBody.classList.add("collapse");
        navbarBody.classList.add("navbar-collapse");

        navbarBody.id = "navbarBody";

        let navbarBodyList = document.createElement('ul');

        navbarBodyList.classList.add("nav");
        navbarBodyList.classList.add("navbar-nav");

        this.initMenuItems(navbarBodyList);

        // let navbarSaveLi = document.createElement('li');

        // let navbarSave = document.createElement('a');

        // navbarSave.setAttribute("href", "#");

        // navbarSave.textContent = "Save";

        // navbarSaveLi.appendChild(navbarSave);

        // navbarBodyList.appendChild(navbarSaveLi);

        // let navbarViewLi = document.createElement('li');

        // let navbarView = document.createElement('a');

        // navbarView.setAttribute("href", "#");
        
        // navbarView.textContent = "View";

        // navbarViewLi.appendChild(navbarView);

        // navbarBodyList.appendChild(navbarViewLi);

        navbarBody.appendChild(navbarBodyList);

        containerFluid.appendChild(navbarBody);

        htmlContainer.appendChild(containerFluid);

        this.htmlContainer = htmlContainer;

    }

    init() {

        this.initHtml();

    }

    onChangeEditMode(value) {

        let enabledText = this.editModeEnabledItemName;
        let disabledText = this.editModeDisabledItemName;

        let menuItemName = value ? enabledText : disabledText;

        let changeEditModeMenuItem = this.menuItems[enabledText];

        if(typeof changeEditModeMenuItem === 'undefined')
            changeEditModeMenuItem = this.menuItems[disabledText];

        changeEditModeMenuItem.textContent = menuItemName;
    }

}