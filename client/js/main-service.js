export class MainService {
    constructor() {
        let global_this = this;
        this.LIB = {
            isNullOrEmpty: function(value){
                if (typeof value == "string") value = value.trim();
                if (typeof value == "boolean") return false;
                if (value == '' || value == null || value == undefined || value === 0 || value === '0'){
                    return true;
                }
                return false;
            }, jsCopyObject(obj) {
                if (obj) {
                    return JSON.parse(JSON.stringify(obj));
                }
                return obj;
            }, queryFind(queryCommon) {
                var queryItems = null
                if (typeof queryCommon == 'string'){
                    queryItems = document.querySelectorAll(queryCommon)
                }
                else{
                    queryItems = queryCommon;
                }
                if (global_this.LIB.isNullOrEmpty(queryItems)){
                    return false;
                }
                else {
                    if (!queryItems.entries){
                        queryItems = [queryItems];
                    }
                }
                return queryItems;
            }, nodeCreator(data) {
                let element_creation = document.createElement(data.node);
                return this.nodeCloner(element_creation, data, true);
            }, nodeCloner(node = document.documentElement, _nodeOption = null, systemNodeCreate = false) {
                let nodeOption = global_this.LIB.jsCopyObject(_nodeOption), element_creation = (systemNodeCreate == true) ? node : node.cloneNode(true);

                (nodeOption.classList) && (((typeof nodeOption.classList == 'string') && element_creation.classList.add(nodeOption.classList)) || ((typeof nodeOption.classList == 'object') && element_creation.classList.add(...nodeOption.classList)));
                delete nodeOption.classList;

                const LOOP_PROPERTIES = ['style', 'dataset'];
                LOOP_PROPERTIES.forEach(LOOP_PROPERTY => {
                    for (let key in nodeOption[LOOP_PROPERTY]) {
                        element_creation[LOOP_PROPERTY][key] = nodeOption[LOOP_PROPERTY][key];
                    }
                    delete nodeOption[LOOP_PROPERTY];
                });
                if (nodeOption.event) {
                    for (let key in nodeOption.event) {
                        element_creation.addEventListener(key, nodeOption.event[key]);
                    }
                    delete nodeOption.event;
                }

                for (let key in nodeOption) {
                    (nodeOption[key] == null) ? (element_creation.removeAttribute(key)) : (element_creation[key] = nodeOption[key]);
                }
                return element_creation;
            }, f_text2node: function(text) {
                return document.createRange().createContextualFragment(text).firstChild;
            }, text2node: function(text) {
                return document.createRange().createContextualFragment(text).childNodes;
            }
        }
        this.ControlsStore = {};
        this.Controls = {
            add: function(control_item, control_type) {
                if (!global_this.ControlsStore[control_type]) global_this.ControlsStore[control_type] = [];
                global_this.ControlsStore[control_type].push(control_item);
            }
        }
        this.CSSFolder = './client/css/';
        this.CSSFiles = {};
    }

    CSSClassLoad(classLoad) {
        let classType = classLoad.name;
        if (!this.CSSFiles[classType]) {
            let myJsPath = `${this.CSSFolder}${classType}.css`,
                myJsItem = this.LIB.nodeCreator({node: 'link', id: classType, rel: 'stylesheet', type: 'text/css', media: 'all', href: myJsPath})
            ;
            this.CSSFiles[classType] = {
                path: myJsPath,
                item: myJsItem
            }
            document.head.appendChild(myJsItem);
        }
    }
}