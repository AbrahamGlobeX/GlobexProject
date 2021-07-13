
class AppComponent extends React.Component {

    constructor(props) {
        
        super();

        this.id = props.id;
    }

    createChild(childId) {

        const ComponentType = widgetsComponentsTypes[this.props.widgets[childId].component || "appComponent"];

        return <ComponentType

            key={childId}

            id={childId}

            widgets={this.props.widgets}
        >
        </ComponentType>;
    }

    eventHandler(eventType, eventObject) {

        eventObject.persist();

        console.log(eventType);

        Module.Store.dispatch({

            'eventName': this.props.widgets[this.id].events[eventType],

            'eventObject': eventObject
        });
    }

    render() {

        const widget = this.props.widgets[this.id];

        const HtmlTag = widget.htmlTag;

        let eventAttributes = {};
        
        for(let eventName in widget.events)
            eventAttributes[eventName] = (event)=>this.eventHandler(eventName, event);

        let textContent = widget.textContent;

        const hasTextContent = typeof textContent !== 'undefined';

        let children = widget.children;

        const hasChildren = typeof children !== 'undefined';

        if(hasChildren || hasTextContent)
            return (

                <HtmlTag

                    id = {this.id}

                    {...widget.attributes}
                    
                    {...eventAttributes}
                >
                    {textContent}

                    {hasChildren ? children.map(this.createChild.bind(this)) : null}

                </HtmlTag>
            );
        else
            return (

                <HtmlTag

                    id = {this.id}

                    {...widget.attributes}
                    
                    {...eventAttributes}
                >
                </HtmlTag>
            );
    }
}


