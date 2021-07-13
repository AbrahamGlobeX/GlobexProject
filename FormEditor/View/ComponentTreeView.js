class ComponentTreeView extends BaseView {

    constructor() {

        super();

        this.htmlContainer = document.createElement('div');

        this.rootNodeText = "form";

        this.treeData = {
                            data: [],

                            onNodeSelected: this.onNodeSelected.bind(this)
                        };

        this.componentNodes = {};

    }

    onNodeSelected(event, node) {

        let nodeText = node.text;

        if(nodeText === this.rootNodeText)
            nodeText = "formRoot";

        this.trigger('onComponentTreeNodeSelected', nodeText);
    }

    initHtml() {

        // let htmlContainer = 

        // htmlContainer.classList.add("panel");
        // htmlContainer.classList.add("panel-default");

        // let header = document.createElement('h2');

        // header.textContent = "Tree";

        let htmlContainer = this.htmlContainer;

        htmlContainer.classList.add("treeview");

        let listElement = document.createElement('ul');

        listElement.classList.add("list-group");

        htmlContainer.appendChild(listElement);

        htmlContainer.id = "treeview-searchable";



        // $('#treeview-searchable').treeview(this.treeData);

        //htmlContainer.appendChild(treeviewElement);
        // <div class="col-sm-4">
        //     <h2>Tree</h2>
        //     <div id="treeview-searchable" class="treeview">
        //         <ul class="list-group">

        //         </ul>
        //     </div>
        // </div>
        // $('#treeview-searchable').treeview({
        //   data: [
        //     {
        //       text: "Parent 1",
        //       nodes: [
        //         {
        //           text: "Child 1",
        //           nodes: [
        //             {
        //               text: "Grandchild 1"
        //             },
        //             {
        //               text: "Grandchild 2"
        //             }
        //           ]
        //         },
        //         {
        //           text: "Child 2"
        //         }
        //       ]
        //     },
        //     {
        //       text: "Parent 2"
        //     },
        //     {
        //       text: "Parent 3"
        //     },
        //     {
        //       text: "Parent 4"
        //     },
        //     {
        //       text: "Parent 5"
        //     }
        //   ]
        // });

        // <div class="col-sm-4">
        //     <h2>Tree</h2>
        //     <div id="treeview-searchable" class="treeview">
        //         <ul class="list-group">
        //             <li class="list-group-item node-treeview-searchable" data-nodeid="0"
        //                 style="color:undefined;background-color:undefined;"><span
        //                     class="icon expand-icon glyphicon glyphicon-minus"></span><span class="icon node-icon"></span>Parent
        //                 1</li>
        //             <li class="list-group-item node-treeview-searchable" data-nodeid="1"
        //                 style="color:undefined;background-color:undefined;"><span class="indent"></span><span
        //                     class="icon expand-icon glyphicon glyphicon-minus"></span><span class="icon node-icon"></span>Child
        //                 1</li>
        //             <li class="list-group-item node-treeview-searchable" data-nodeid="2"
        //                 style="color:undefined;background-color:undefined;"><span class="indent"></span><span
        //                     class="indent"></span><span class="icon glyphicon"></span><span
        //                     class="icon node-icon"></span>Grandchild 1</li>
        //             <li class="list-group-item node-treeview-searchable" data-nodeid="3"
        //                 style="color:undefined;background-color:undefined;"><span class="indent"></span><span
        //                     class="indent"></span><span class="icon glyphicon"></span><span
        //                     class="icon node-icon"></span>Grandchild 2</li>
        //             <li class="list-group-item node-treeview-searchable" data-nodeid="4"
        //                 style="color:undefined;background-color:undefined;"><span class="indent"></span><span
        //                     class="icon glyphicon"></span><span class="icon node-icon"></span>Child 2</li>
        //             <li class="list-group-item node-treeview-searchable" data-nodeid="5"
        //                 style="color:undefined;background-color:undefined;"><span class="icon glyphicon"></span><span
        //                     class="icon node-icon"></span>Parent 2</li>
        //         </ul>
        //     </div>
        // </div>

    }

    init() {

        this.initHtml();

    }

    update() {

        $('#treeview-searchable').treeview(this.treeData);
    }

    onModelAddRootComponent(properties) {

        let rootNode = { text: this.rootNodeText };

        this.componentNodes[properties.name] = rootNode;

        this.treeData.data.push(rootNode);

        this.update();
    }

    onModelAddComponent(componentInfo) {

        let name = componentInfo.name;

        let componentNode = { text: name };

        let componentNodes = this.componentNodes;

        componentNodes[name] = componentNode;

        let parentName = componentInfo.parentName;

        let parentNodes = componentNodes[parentName].nodes;

        if (typeof parentNodes === 'undefined') {

            parentNodes = [];

            componentNodes[parentName].nodes = parentNodes;

        }

        parentNodes.push(componentNode);

        this.update();
    }

    onModelDeleteComponent(name, parentName) {

        let componentNodes = this.componentNodes;

        let parentNodes = componentNodes[parentName].nodes;

        let nodeIndex = parentNodes.indexOf(componentNodes[name]);

        if (nodeIndex !== -1)
            parentNodes.splice(nodeIndex, 1);
        
        delete componentNodes[name];

        this.update();
    }
}