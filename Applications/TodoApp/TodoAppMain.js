/* eslint-disable class-methods-use-this */
/*global Module, React, ListActions, ReactDOM, script*/
/*exported myObj*/
'use strict';

class Initializer extends React.Component {

    constructor() {
        super();
        ListActs.loadScript(APP.script);
    }

    render() {
        return (<div></div>);
    }
}

class TodoList extends React.Component {
    constructor() {
        super();
    }

    onSelectItem(event) {

        let records = this.props.records;
        let index = 0;
        
        for (; index < records.length; ++index) {
            if (records[index].id == event.target.id) {
                break;
            }
        }

        ListActs.srikeOut(index);
    }

    createRecord(elem) {

        let style = {
            cursor: "pointer",
            textDecoration: "line-through"
        };
        if (elem.enabled) {
            style.textDecoration = "none";
        }

        return (<li style={style} key={elem.id} id={elem.id} onClick={this.onSelectItem.bind(this)}>{elem.value}</li>);
    }

    render() {
        return (
            <ul style={{ backgroundColor: "grey" }}>{this.props.records.map(this.createRecord.bind(this))}</ul>
        );
    }
}

let resetAll;
let renumber = Module.Store.renumber;

class App extends React.Component {

    constructor() {

        super();
        
        this.construct();

        resetAll = this.refresh.bind(this);
        
        Event.bind('change', this.storeChanged.bind(this));
    }

    refresh() {
        console.log("REEEEEEEEEEEEEEEEEEEEE");
        Module.Store.resetAll();

        ListActs.loadScript(script);
        this.construct();
        //this.forceUpdate();
    }

    construct() {

        const record = {
            value: "",
            enabled: true,
            id: Date.now()
        }

        let state = { records: [], inputValue: "" };
// Удалить. Убрать в floscript.js
        // if (!Module.Store.appendElement("records", state.records)) {
        //     console.error("Elem Not Appended!");
        // }

        // if (!Module.Store.appendElement("record", record)) {
        //     console.error("Elem Not Appended!");
        // }

        // if (!Module.Store.appendElement("emptyVal", "")) {
        //     console.error("Elem Not Appended!");
        // }

        // if (!Module.Store.appendElement("pathVal", "value")) {
        //     console.error("Elem Not Appended!");
        // }

        // if (!Module.Store.appendElement("disabled", false)) {
        //     console.error("Elem Not Appended!");
        // }

        // if (!Module.Store.appendElement("enabledPath", "enabled")) {
        //     console.error("Elem Not Appended!");
        // }
        this.state = state;
    }

    storeChanged() {
        const newrecords = Module.Store.getAll().records;
        const newrecord = Module.Store.getAll().record;
        this.setState({ records: newrecords, inputValue: newrecord.value });
    }

    onPressAdd() {
        ListActs.addRecord();
    }

    onChangeInput(event) {
        const record = {
            value: event.target.value,
            enabled: true,
            id: Date.now()
        }
        ListActs.updateRecord(record);
    }

    render() {
        return (

            <div>

                <button onClick={this.onPressAdd.bind(this)}>add record</button>
                <input value={this.state.inputValue} onChange={this.onChangeInput.bind(this)} type="text"></input>

                <Initializer></Initializer>
                <TodoList records={this.state.records}></TodoList>
            </div>

        );
    }
}



// class TodoApp extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = { items: [], text: '' };
//       this.handleChange = this.handleChange.bind(this);
//       this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     render() {
//       return (
//         <div>
//           <h3>Список дел</h3>
//           <TodoList items={this.state.items} />
//           <form onSubmit={this.handleSubmit}>
//             <label htmlFor="new-todo">
//               Что нужно сделать?
//             </label>
//             <input
//               id="new-todo"
//               onChange={this.handleChange}
//               value={this.state.text}
//             />
//             <button>
//               Добавить #{this.state.items.length + 1}
//             </button>
//           </form>
//         </div>
//       );
//     }

//     handleChange(e) {
//       this.setState({ text: e.target.value });
//     }

//     handleSubmit(e) {
//       e.preventDefault();
//       if (!this.state.text.length) {
//         return;
//       }
//       const newItem = {
//         text: this.state.text,
//         id: Date.now()
//       };
//       this.setState(state => ({
//         items: state.items.concat(newItem),
//         text: ''
//       }));
//     }
//   }

//   class TodoList extends React.Component {
//     render() {
//       return (
//         <ul>
//           {this.props.items.map(item => (
//             <li key={item.id}>{item.text}</li>
//           ))}
//         </ul>
//       );
//     }
//   }

ReactDOM.render(<App />, document.getElementById('root'))
