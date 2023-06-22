export class MainService {
    constructor() {
        let global_this = this;
        this.memory = {
            event_stored: {}
        };
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
                let nodeOption = global_this.LIB.jsCopyObject(_nodeOption), element_creation = node;
                if (!systemNodeCreate) {
                    element_creation = node.cloneNode(true);
                }

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
            }, XHRSendRequest: function(objData) {
                var xmlhttp = new XMLHttpRequest(),
                    dataSend = null,
                    isForm = objData.data && objData.data.constructor === FormData
                ;
                xmlhttp.open(objData.method ?? 'GET', objData.url, objData.async ?? true);
                if (objData.contentType === undefined) {
                    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                else if (typeof objData.contentType === 'string') {
                    xmlhttp.setRequestHeader('Content-type', objData.contentType);
                }
                if (objData.event) {
                    xmlhttp.onreadystatechange = function() {
                        xmlhttp.readyState == 4 && (
                            (xmlhttp.status == 200 && objData.event.done && objData.event.done({statusCode: xmlhttp.status, data: xmlhttp.response})) ||
                            (xmlhttp.status != 200 && objData.event.error && objData.event.error({statusCode: xmlhttp.status, statusText: xmlhttp.statusText, data: xmlhttp.response}))
                        )
                    }
                }
                if (objData.data) {
                    if (isForm) {
                        dataSend = objData.data
                    }
                    else {
                        dataSend = new URLSearchParams();
                        Object.keys(objData.data).forEach(key => {
                            let data_value = objData.data[key];
                            if (!!data_value && data_value.constructor === Object) {
                                dataSend.set(key, JSON.stringify(data_value));
                            }
                            else if (!!data_value && data_value.constructor === Array) {
                                dataSend.set(key, data_value.toString());
                            }
                            else {
                                dataSend.set(key, data_value);
                            }
                        });
                    }
                }
                xmlhttp.send(dataSend);
                return xmlhttp;
            }, getElementsByQuery(queryCommon){
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
            }, eventStored: {
                getEventNames() {
                    return Object.keys(global_this.memory.event_stored);
                }, getEvent(element) {
                    return global_this.memory.event_stored[event_name].filter(({node}) => node === element);
                }, setEvent(element, event_name, handler, options = null) {
                    if (!(event_name in global_this.memory.event_stored)) {
                        global_this.memory.event_stored[event_name] = []
                    }

                    global_this.memory.event_stored[event_name].push({node: element, handler: handler, options: options});
                }, removeEvent(element, event_name, private_handler = null) {
                    var events_removed = [];
                    if (private_handler == null || private_handler == false) {
                        if (global_this.memory.event_stored[event_name]) {
                            events_removed = global_this.memory.event_stored[event_name].filter(({node}) => node === element);
                            global_this.memory.event_stored[event_name] = global_this.memory.event_stored[event_name].filter(({node}) => node !== element);
                        }
                    }
                    else {
                        var index_delete = 0;
                        global_this.memory.event_stored[event_name] && global_this.memory.event_stored[event_name].filter(({node}) => node === element).forEach(({node, handler, options}) => {
                            // node.removeEventListener(event, handler, options)
                            if (global_this.memory.event_stored[event_name] && private_handler === handler) {
                                events_removed.push(global_this.memory.event_stored[event_name][index_delete]);
                                global_this.memory.event_stored[event_name].splice(index_delete, 1);
                                return false;
                            }
                            index_delete++;
                        });
                    }

                    if (global_this.memory.event_stored[event_name] && global_this.memory.event_stored[event_name].length == 0) {
                        delete global_this.memory.event_stored[event_name];
                    }

                    return events_removed;
                }
            }, bindEvents(queryCommon, bindOption, options = null) {
                var queryItems = global_this.LIB.getElementsByQuery(queryCommon),
                    bindEvents = Object.keys(bindOption);
            
                if (queryItems){
                    if (queryItems.length > 0){
                        queryItems.forEach(item => {
                            bindEvents.forEach(event_name => {
                                const handler = bindOption[event_name];
                                global_this.LIB.eventStored.setEvent(item, event_name, handler, options);

                                item.addEventListener(event_name, handler, options);
                            });
                        });
                    }
                }
            }, unbindEvents(queryCommon, bindOption){
                var queryItems = global_this.LIB.getElementsByQuery(queryCommon),
                    bindEvents = Object.keys(bindOption);
            
                if (queryItems && queryItems.length > 0){
                    queryItems.forEach(item => {
                        bindEvents.forEach(event_name => {
                            global_this.LIB.eventStored.removeEvent(item, event_name, bindOption[event_name]).forEach(function(event_data) {
                                if (bindOption[event_name] == undefined || (event_data.handler.name == bindOption[event_name].name && event_data.handler === bindOption[event_name])) {
                                    item.removeEventListener(event_name, event_data.handler, event_data.options);
                                }
                            });
                        });
                    });
                }
            }, unbindAllEvents(queryCommon){
                var queryItems = global_this.LIB.getElementsByQuery(queryCommon);
                const SYSTEM_EVENT_STOREDS = global_this.LIB.eventStored.getEventNames();

                if (queryItems){
                    if (queryItems.length > 0){
                        queryItems.forEach(item => {
                            SYSTEM_EVENT_STOREDS.forEach(event_name => {
                                global_this.LIB.eventStored.removeEvent(item, event_name).forEach(event_data => {
                                    item.removeEventListener(event_name, event_data['handler']);
                                });
                            });
                        });
                    }
                }
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