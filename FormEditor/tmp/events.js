var EventFormStateChange = {}

MicroEvent.mixin(EventFormStateChange);

var EventFormComponentChange = {}

MicroEvent.mixin(EventFormComponentChange);

var EventFormComponentPropertyChange = {}

MicroEvent.mixin(EventFormComponentPropertyChange);

EventFormStateChange.bind('change', function(formStateChangeInfo) {
    
    EventFormComponentChange.trigger(formStateChangeInfo.componentId, formStateChangeInfo.componentChangeInfo);

});

var EventFormComponentPropertyChanges = {}

var addComponentChangeListener = function(componentId, property, func) {

    EventFormComponentChange.bind(componentId, function(componentChangeInfo) {
        
        EventFormComponentPropertyChanges[componentId].trigger(componentChangeInfo.property, componentChangeInfo.propertyChangeInfo);
    
    });

    let componentPropertyChange = {};

    MicroEvent.mixin(componentPropertyChange);
    
    componentPropertyChange.bind(property, func);

    EventFormComponentPropertyChanges[componentId] = componentPropertyChange;
}