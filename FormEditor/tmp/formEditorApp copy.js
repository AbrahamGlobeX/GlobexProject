


var initFormState = {
    id:"comp0",
    htmlTag : "div",
    attributes : {
        style : {
           
            top : 50,
            left : 50,
            width : 500,
            height : 500
        }
    },
children : [

{
    id:"comp1",
    htmlTag : "button",
    content : "button",
    attributes : {
        style : {
            
            top : 100,
            left : 300,
            width : 150,
            height : 50
        }
    },
    children : []
},
{
    id:"comp2",
    htmlTag : "input",
    attributes : {
        value : "input",
        type : "text",
        style : {
            top : 200,
            left : 300,
            width : 150,
            height : 50
        }
    },
    children : []
}


]
}

var dragStart = function(event) {
    
    console.log(event);
}

var drop = function(event) {
    
    const dt = event.dataTransfer;
;

    initFormState.children.push();

}

addComponentChangeListener("comp0", 'drop', drop);

class App extends React.Component {

    constructor() {

        super();

        let state = { formState: initFormState };

        this.state = state;

        EventFormStateChange.bind('change', this.storeChanged.bind(this));

        
    }
    storeChanged() {
        console.log("DF");
        const newFormState = initFormState;

        this.setState({ formState: newFormState});
    }

    storeChanged2(event) {
        console.log("x");
        
        console.log(event);
    }


    render() {
        return (

            
                <AppComponent key = {0} initState={this.state.formState}></AppComponent>
            

        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
