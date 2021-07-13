
class PropertiesBlockView extends BaseView {

    static propertyPanelNames = null;

    static propertyNameToClass = null;

    constructor() {

        super();

        this.propertyNameToPanelBody = {};

        this.typesPropertyIndices = {};

        this.propertyBlocks = {};

        this.currentPropertyIndices = null;

        let panelPropertyNames = PropertiesBlockView.panelPropertyNames;

        for(let panelName of Object.keys(panelPropertyNames))
            for(let propertyName of panelPropertyNames[panelName])
                this.propertyNameToPanelBody[propertyName] = null;

        this.htmlContainer = null;

    }

    initPropertiesPanelHeader(panelName, panelBodylId) {
      
        let panelHeader = document.createElement('div');
         
        panelHeader.classList.add("panel-heading");

        let panelTitleElement = document.createElement('h4');
         
        panelTitleElement.classList.add("panel-titl");

        let panelTitleLink = document.createElement('a');

        panelTitleLink.setAttribute("data-toggle", "collapse");
        panelTitleLink.setAttribute("href", "#" + panelBodylId);

        panelTitleLink.textContent = panelName;

        panelTitleElement.appendChild(panelTitleLink);

        panelHeader.appendChild(panelTitleElement);

        return panelHeader;
    }

    initPropertiesPanelBody(panelBodyId) {
        
        let panelBody = document.createElement('div');
         
        panelBody.classList.add("panel-collapse");
        panelBody.classList.add("collapse");
        panelBody.classList.add("in");
        
        panelBody.id = panelBodyId;

        return panelBody;
    }

    initPropertiesPanel(panelName) {

        let panel = document.createElement('div');
         
        panel.classList.add("panel");
        panel.classList.add("panel-default");

        let panelBodylId = panelName + "PropertiesPanelBody";

        let panelHeader = this.initPropertiesPanelHeader(panelName, panelBodylId);
        
        panel.appendChild(panelHeader);

        let panelBody = this.initPropertiesPanelBody(panelBodylId);

        panel.appendChild(panelBody);

        panelBody.setAttribute("area-expanded", true);

        for(let propertyName of PropertiesBlockView.panelPropertyNames[panelName])
            this.propertyNameToPanelBody[propertyName] = panelBody;

        this.panelGroup.appendChild(panel);
    }

    initHtml() {

        let htmlContainer = document.createElement('div');
         
        htmlContainer.classList.add("col-sm-2");
        htmlContainer.classList.add("sidenav");
      
        let panelGroup = document.createElement('div');
         
        panelGroup.classList.add("panel-group");
        
        this.panelGroup = panelGroup;

        this.initPropertiesPanel("Appearance");
        this.initPropertiesPanel("Layout");
        this.initPropertiesPanel("Behavior");

        htmlContainer.appendChild(panelGroup);

        this.htmlContainer = htmlContainer;

    }

    init() {

        this.initHtml();
    }

    initComponentTypeProperties(propertiesInfo) {

        let componentTypesProperties = propertiesInfo.componentTypeProperties;

        let typesPropertyIndices = {};

        let panelPropertyNames = PropertiesBlockView.panelPropertyNames;

        for(let typeName in componentTypesProperties) {
            
            let typeProperties = componentTypesProperties[typeName];

            let typePropertyIndices = {};

            for(let panelName in panelPropertyNames)
                typePropertyIndices[panelName] = new Set();

            for(let propertyName of typeProperties) {

                for(let panelName in panelPropertyNames) {

                    let propertyIndex = panelPropertyNames[panelName].indexOf(propertyName);
    
                    if(propertyIndex != -1) {
    
                        typePropertyIndices[panelName].add(propertyIndex);
    
                        break;
                    }
                }

            }

            typesPropertyIndices[typeName] = typePropertyIndices;
        }

        PropertyBlockView.propertiesInfo = propertiesInfo.properties;

        this.typesPropertyIndices = typesPropertyIndices;
    }

    onMainModelInit(initInfo) {

        this.initComponentTypeProperties(initInfo.propertiesInfo);
        
    }

    addProperty(name, value) {

        let propertyView = new PropertiesBlockView.propertyNameToClass[name](this);

        propertyView.init(name, value);

        let panelBody = this.propertyNameToPanelBody[name];
        
        panelBody.appendChild(propertyView.htmlContainer);

        this.propertyBlocks[name] = propertyView;
    }

    insertProperty(previousPropertyName, propertyName, value) {

        let propertyView = new PropertiesBlockView.propertyNameToClass[propertyName](this);

        propertyView.init(propertyName, value);

        let panelBody = this.propertyNameToPanelBody[propertyName];

        if(typeof previousPropertyName != "undefined") {

            let perviousPropertyId = PropertyBlockView.getId(previousPropertyName);

            let perviousPropertyHtmlElement = document.getElementById(perviousPropertyId);

            panelBody.insertBefore(propertyView.htmlContainer, perviousPropertyHtmlElement.nextSibling);

        } else {
            
            panelBody.insertBefore(propertyView.htmlContainer, panelBody.firstChild);
        }

        this.propertyBlocks[propertyName] = propertyView;
    }

    removeProperty(panelName, propertyIndex) {
        
        let propertyName = PropertiesBlockView.panelPropertyNames[panelName][propertyIndex];

        document.getElementById(PropertyBlockView.getId(propertyName)).remove();

        delete this.propertyBlocks[propertyName];
    }

    updateProperties(newPropertyIndices, propertyValues) {

        let currentPropertyIndices = this.currentPropertyIndices;

        let panelPropertyNames =  PropertiesBlockView.panelPropertyNames;

        for(let panelName in panelPropertyNames) {

            let panelCurrentPropertyIndices = currentPropertyIndices[panelName];

            let panelNewPropertyIndices = newPropertyIndices[panelName];

            for(let propertyIndex of panelCurrentPropertyIndices) {

                if(!panelNewPropertyIndices.has(propertyIndex)) {

                    this.removeProperty(panelName, propertyIndex);
                }
            }

            let previousPropertyIndex = null;

            let propertyNames = panelPropertyNames[panelName];

            for(let propertyIndex of panelNewPropertyIndices) {
                
                let propertyName = propertyNames[propertyIndex];

                if(!panelCurrentPropertyIndices.has(propertyIndex)) {

                    let previousPropertyName = propertyNames[previousPropertyIndex];

                    this.insertProperty(previousPropertyName, propertyName, propertyValues[propertyName]);

                } else {

                    let value = propertyValues[propertyName];
                    
                    if(typeof value === "undefined")
                        value = PropertyBlockView.getDefault(propertyName);

                    this.propertyBlocks[propertyName].setValue(value);
                }

                previousPropertyIndex = propertyIndex;
            }
        }

        this.currentPropertyIndices = newPropertyIndices;
    }

    onChangeMultiSelectedComponents(components) {

        if(components.length == 0)
            return;

        let firstComponent = components[0];

        let firstComponentType = firstComponent.type;

        let typesPropertyIndices = this.typesPropertyIndices;

        let commonPropertyIndices = {};

        for(let panelName in typesPropertyIndices[firstComponentType])
            commonPropertyIndices[panelName] = new Set(typesPropertyIndices[firstComponentType][panelName]);

        let checkedComponentTypes = new Set([firstComponentType]);

        for(let i = 1; i < components.length; ++i) {

            let componentType = components[i].type;

            if(checkedComponentTypes.has(componentType))
                continue;

            checkedComponentTypes.add(componentType);
            
            let propertyIndices = typesPropertyIndices[componentType];

            for(let panelName in propertyIndices) {

                let panelPropertyIndices = propertyIndices[panelName];

                let panelCommonPropertyIndices = commonPropertyIndices[panelName];
                
                for(let propertyIndex of panelCommonPropertyIndices)
                    if(!panelPropertyIndices.has(propertyIndex))
                        panelCommonPropertyIndices.delete(propertyIndex);
            }
        }

        let firstComponentPropertyValues = firstComponent.properties;

        let commonPropertyValues = {};

        let propertyNames = PropertiesBlockView.panelPropertyNames;

        for(let panelName in commonPropertyIndices) {

            let panelCommonPropertyIndices = commonPropertyIndices[panelName];

            let panelPropertyNames = propertyNames[panelName];

            for(let propertyIndex of panelCommonPropertyIndices) {

                let propertyName = panelPropertyNames[propertyIndex];

                commonPropertyValues[propertyName] = firstComponentPropertyValues[propertyName];
            }
        }

        for(let i = 1; i < components.length; ++i) {

            let propertyValues = components[i].properties;

            for(let propertyName in commonPropertyValues) {

                let commonPropertyValue = commonPropertyValues[propertyName];

                if(commonPropertyValue !== '')
                    if(commonPropertyValue !== propertyValues[propertyName])
                        commonPropertyValues[propertyName] = '';
            }
        }

        this.updateProperties(commonPropertyIndices, commonPropertyValues);
    }

    onChangeSelectedComponents(components) {

        if(components.length === 1) {

            let component = components[0];

            let newComponentTypePropertyIndices;
            
            if(component.type != 'div') newComponentTypePropertyIndices = this.typesPropertyIndices[component.type];
            else newComponentTypePropertyIndices = this.typesPropertyIndices['root'];

            let propertyValues = component.properties;

            if(this.currentPropertyIndices !== null) {

                this.updateProperties(newComponentTypePropertyIndices, propertyValues);

            } else {

                let panelPropertyNames =  PropertiesBlockView.panelPropertyNames;

                for(let panelName in panelPropertyNames) {

                    let panelNewComponentTypePropertyIndices = newComponentTypePropertyIndices[panelName];

                    for(let propertyIndex of panelNewComponentTypePropertyIndices) {

                        let propertyName = panelPropertyNames[panelName][propertyIndex];
                            
                        this.addProperty(propertyName, propertyValues[propertyName]);
                    }
                }

                this.currentPropertyIndices = newComponentTypePropertyIndices;
            }
            
        } else {

            this.onChangeMultiSelectedComponents(components);
        }
        
    }

    updatePropertyValue(updateInfo) {

        let propertyBlock = this.propertyBlocks[updateInfo.propertyName];

        if(typeof propertyBlock != 'undefined')
            propertyBlock.setValue(updateInfo.propertyValue, false);
    }
}

PropertiesBlockView.panelPropertyNames = {

    "Appearance" : ["name", "text", "backgroundColor", "text-align"],
    "Layout" : ["x","y","width","height"],
    "Behavior" : ["enabled", "checked"]
}

PropertiesBlockView.propertyNameToClass = {

    "name" : InputPropertyView,
    "x" : SpinBoxPropertyView,
    "y" : SpinBoxPropertyView,
    "width" : SpinBoxPropertyView,
    "height" : SpinBoxPropertyView,
    "backgroundColor" : ColorPropertyView,
    "position" : InputPropertyView,
    "text" : InputPropertyView,
    "checked" : CheckBoxPropertyView,
    "text-align" : DropDownPropertyView

}