
class AppComponent extends React.Component {

    constructor(props) {
        super();

        this.initState = props.initState;
        this.state = props.initState;
    }

    createChild(child, index) {

        return <AppComponent

            key={index}

            initState={child}
        >
        </AppComponent>;

    }

    drop(event) {
        EventFormComponentChange.trigger(this.state.id, {property:"drop", propertyChangeInfo : event});
    }

    render() {


        if(this.state.htmlTag == "div")
            return (
                <this.state.htmlTag  {...this.state.attributes} onDrop={this.drop.bind(this)} onDragEnter={function(event){event.preventDefault();}} onDragOver={function(event){event.preventDefault();}} >

                    {this.state.content}

                    {this.state.children.map(this.createChild.bind(this))}
                    
                </this.state.htmlTag>

            );
        else if(this.state.htmlTag == "button")
            return (
                <this.state.htmlTag   {...this.state.attributes} onDrop={this.drop.bind(this)} onDragEnter={function(event){event.preventDefault();}} onDragOver={function(event){event.preventDefault();}} >

                    {this.state.content}

                    
                </this.state.htmlTag>

            );
        else
            return (
                <this.state.htmlTag {...this.state.attributes} >
                    
                </this.state.htmlTag>
            );

    }
}


