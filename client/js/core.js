export class Core {
    constructor() {
        let globalThis = this,
            CoreStored = {queueStored: {
                task_working: true, stop: function() {
                    CoreStored.queueStored.task_working = false;
                }
            }}
        ;
        this.CoreStored = CoreStored;
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
                if (globalThis.LIB.isNullOrEmpty(queryItems)){
                    return false;
                }
                else {
                    if (!queryItems.entries){
                        queryItems = [queryItems];
                    }
                }
                return queryItems;
            }, nodeCreator(data = {node: 'div', ...document.createElement('div')}) {
                let element_creation = document.createElement(data.node);
                return this.nodeCloner(element_creation, data, true);
            }, nodeCloner(node = document.documentElement, _nodeOption = null, systemNodeCreate = false) {
                let nodeOption = globalThis.LIB.jsCopyObject(_nodeOption), element_creation = node;
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
                if (globalThis.LIB.isNullOrEmpty(queryItems)){
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
                    return Object.keys(globalThis.memory.event_stored);
                }, getEvent(element) {
                    return globalThis.memory.event_stored[event_name].filter(({node}) => node === element);
                }, setEvent(element, event_name, handler, options = null) {
                    if (!(event_name in globalThis.memory.event_stored)) {
                        globalThis.memory.event_stored[event_name] = []
                    }

                    globalThis.memory.event_stored[event_name].push({node: element, handler: handler, options: options});
                }, removeEvent(element, event_name, private_handler = null) {
                    var events_removed = [];
                    if (private_handler == null || private_handler == false) {
                        if (globalThis.memory.event_stored[event_name]) {
                            events_removed = globalThis.memory.event_stored[event_name].filter(({node}) => node === element);
                            globalThis.memory.event_stored[event_name] = globalThis.memory.event_stored[event_name].filter(({node}) => node !== element);
                        }
                    }
                    else {
                        var index_delete = 0;
                        globalThis.memory.event_stored[event_name] && globalThis.memory.event_stored[event_name].filter(({node}) => node === element).forEach(({node, handler, options}) => {
                            // node.removeEventListener(event, handler, options)
                            if (globalThis.memory.event_stored[event_name] && private_handler === handler) {
                                events_removed.push(globalThis.memory.event_stored[event_name][index_delete]);
                                globalThis.memory.event_stored[event_name].splice(index_delete, 1);
                                return false;
                            }
                            index_delete++;
                        });
                    }

                    if (globalThis.memory.event_stored[event_name] && globalThis.memory.event_stored[event_name].length == 0) {
                        delete globalThis.memory.event_stored[event_name];
                    }

                    return events_removed;
                }
            }, bindEvents(queryCommon, bindOption, options = null) {
                var queryItems = globalThis.LIB.getElementsByQuery(queryCommon),
                    bindEvents = Object.keys(bindOption);
            
                if (queryItems){
                    if (queryItems.length > 0){
                        queryItems.forEach(item => {
                            bindEvents.forEach(event_name => {
                                const handler = bindOption[event_name];
                                globalThis.LIB.eventStored.setEvent(item, event_name, handler, options);
                                item.addEventListener(event_name, handler, options);
                            });
                        });
                    }
                }
            }, unbindEvents(queryCommon, bindOption){
                var queryItems = globalThis.LIB.getElementsByQuery(queryCommon),
                    bindEvents = Object.keys(bindOption);
            
                if (queryItems && queryItems.length > 0){
                    queryItems.forEach(item => {
                        bindEvents.forEach(event_name => {
                            globalThis.LIB.eventStored.removeEvent(item, event_name, bindOption[event_name]).forEach(function(event_data) {
                                if (bindOption[event_name] == undefined || (event_data.handler.name == bindOption[event_name].name && event_data.handler === bindOption[event_name])) {
                                    item.removeEventListener(event_name, event_data.handler, event_data.options);
                                }
                            });
                        });
                    });
                }
            }, unbindAllEvents(queryCommon){
                var queryItems = globalThis.LIB.getElementsByQuery(queryCommon);
                const SYSTEM_EVENT_STOREDS = globalThis.LIB.eventStored.getEventNames();

                if (queryItems){
                    if (queryItems.length > 0){
                        queryItems.forEach(item => {
                            SYSTEM_EVENT_STOREDS.forEach(event_name => {
                                globalThis.LIB.eventStored.removeEvent(item, event_name).forEach(event_data => {
                                    item.removeEventListener(event_name, event_data['handler']);
                                });
                            });
                        });
                    }
                }
            }, dateTimeNow(format = "dd/mm/yy h:i:s") {
                let currentdate = new Date(); 
                
                let map = {
                    h: currentdate.getHours().toString(),
                    i: currentdate.getMinutes().toString(),
                    s: currentdate.getSeconds().toString(),
                    mm: (currentdate.getMonth() + 1).toString(),
                    dd: currentdate.getDate().toString(),
                    yy: currentdate.getFullYear().toString().slice(-2)
                };

                (map.h.length == 1) && (map.h = '0' + map.h);
                (map.i.length == 1) && (map.i = '0' + map.i);
                (map.s.length == 1) && (map.s = '0' + map.s);
                (map.dd.length == 1) && (map.dd = '0' + map.dd);
                (map.mm.length == 1) && (map.mm = '0' + map.mm);
            
                return format.replace(/h|i|s|mm|dd|yy|yyyy/gi, matched => map[matched])
            }, async queueExcuteTasking(task) {
                for (let _task of task) {
                    await new Promise(resolve => {
                        _task(resolve);
                    });
                }
            }, async queueExcuteStories(task, key = 'main') {
                let queueStored = CoreStored.queueStored;
                if (!queueStored[key]) queueStored[key] = [];
                queueStored[key].push(task);
                if (!queueStored[key].isStated) {
                    queueStored.task_working = true;
                    queueStored[key].isStated = true;

                    let index = 0;
                    while (true) {
                        if (index >= queueStored[key].length) {
                            queueStored[key] = [];
                            delete queueStored[key];
                            break;
                        }

                        await new Promise(resolve => {
                            queueStored[key][index](resolve);
                        });
                        
                        index++;

                        if (!queueStored.task_working) {
                            queueStored.task_working = true;
                            index = queueStored[key].length;
                        }
                    }
                }
                return queueStored;
            }, getStyleOfElement(queryCommon) {
                let style = getComputedStyle(this.getElementsByQuery(queryCommon)[0]);
                return style;
            }, setStyleToElements(element, styles, value = null) {
                let apply_styles = {},
                    LIB = globalThis.LIB;
                if (typeof styles == 'string'){
                    apply_styles[styles] = value;
                }
                else{
                    Object.keys(styles).forEach(key => {
                        apply_styles[key] = styles[key];
                    });
                }
            
                let queryItems = null
                if (typeof element == 'string'){
                    queryItems = document.querySelectorAll(element)
                }
                else{
                    queryItems = element;
                }
            
                if (!LIB.isNullOrEmpty(queryItems)){
                    if (queryItems.length > 0){
                        if (typeof queryItems == 'object'){
                            for (let i = 0; i < queryItems.length; i++){
                                const item = queryItems[i];
                                Object.keys(apply_styles).forEach(key => {
                                    item.style[key] = apply_styles[key];
                                });
                            }
                        }
                        else{
                            queryItems.forEach(item => {
                                if (!LIB.isNullOrEmpty(item)) {
                                    Object.keys(apply_styles).forEach(key => {
                                        item.style[key] = apply_styles[key];
                                    });
                                }
                            });
                        }
                    }
                    else{
                        if (!LIB.isNullOrEmpty(queryItems.style)) {
                            Object.keys(apply_styles).forEach(key => {
                                queryItems.style[key] = apply_styles[key];
                            });
                        }
                    }
                }
            }, md5(d) {
                let M = (d) => {
                    let _, m, f, r;
                    for(_,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)
                        _=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);
        
                    return f
                },X = (d) => {
                    let _, m;
                    for(_=Array(d.length>>2),m=0;m<_.length;m++)
                        _[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;
                        
                    return _
                },V = (d) => {
                    let _, m;
                    for(_="",m=0;m<32*d.length;m+=8)
                        _+=String.fromCharCode(d[m>>5]>>>m%32&255);
        
                    return _
                },Y = (d,_) => {
                    let m, f, r, i, n;
                    d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;
                    for(m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){
                        let h=m,t=f,g=r,e=i;
                        f=md5_ii(
                            f=md5_ii(
                                f=md5_ii(
                                    f=md5_ii(
                                        f=md5_hh(
                                            f=md5_hh(
                                                f=md5_hh(
                                                    f=md5_hh(
                                                        f=md5_gg(
                                                            f=md5_gg(
                                                                f=md5_gg(
                                                                    f=md5_gg(
                                                                        f=md5_ff(
                                                                            f=md5_ff(
                                                                                f=md5_ff(
                                                                                    f=md5_ff(
                                                                                        f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330
                                                                                    ),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983
                                                                                ),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162
                                                                            ),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329
                                                                        ),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302
                                                                    ),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848
                                                                ),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501
                                                            ),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734
                                                        ),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556
                                                    ),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640
                                                ),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189
                                            ),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651
                                        ),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055
                                    ),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799
                                ),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649
                            ),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551
                        ),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)
                    }
                    return Array(m,f,r,i)
                },md5_cmn = (d,_,m,f,r,i) => safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)
                ,md5_ff = (d,_,m,f,r,i,n) => md5_cmn(_&m|~_&f,d,_,r,i,n)
                ,md5_gg = (d,_,m,f,r,i,n) => md5_cmn(_&f|m&~f,d,_,r,i,n)
                ,md5_hh = (d,_,m,f,r,i,n) => md5_cmn(_^m^f,d,_,r,i,n)
                ,md5_ii = (d,_,m,f,r,i,n) => md5_cmn(m^(_|~f),d,_,r,i,n)
                ,safe_add = (d,_) => {let m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}
                ,bit_rol = (d,_) => d<<_|d>>>32-_
                ;
                
                return M(V(Y(X(d),8*d.length))).toLowerCase();
            }
        }
        this.ControlsStore = {};
        this.Controls = {
            add: function(control_item, control_type) {
                if (!globalThis.ControlsStore[control_type]) globalThis.ControlsStore[control_type] = [];
                globalThis.ControlsStore[control_type].push(control_item);
            }
        }
        this.CSSFiles = {};
    }

    CONFIG = {
        ANIMATION_TIME: 150,
        LOW_PROFILE_MODE: false
    }

    FormType = {
        Window: 0,
        WidgetTasbar: 1,
        WidgetWindow: 2
    }

    CSSControlClassLoad(classLoad) {
        this.#private_CSSLoad('./client/css/', classLoad.name);
    }
    
    CSSWidgetClassLoad(classLoad) {
        this.#private_CSSLoad('./client/js/widget/css/', classLoad.name);
    }

    CSSLoadCustom(url, classLoad) {
        this.#private_CSSLoad(url, classLoad.name);
    }

    #private_CSSLoad(cssFolder, classType) {
        if (!this.CSSFiles[classType]) {
            let myJsPath = `${cssFolder}${classType}.css`,
                myJsItem = this.LIB.nodeCreator({node: 'link', id: classType, rel: 'stylesheet', type: 'text/css', media: 'all', href: myJsPath})
            ;
            this.CSSFiles[classType] = {
                path: myJsPath,
                item: myJsItem
            }
            document.head.appendChild(myJsItem);
        }
    }

    effector(element) {
        let globalThis = this, LIB = globalThis.LIB, CoreStored = this.CoreStored, CONFIG = globalThis.CONFIG;
        const ELEMENTS = LIB.getElementsByQuery(element);
        const ACTIONS = {
            show: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                let queue_string = _opts.queue ?? 'show_eff';
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);
 
                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', opacity: '0', transition: null});
                                setTimeout(() => {
                                    child_resolve();
                                }, 10);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {opacity: '1', transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                    resolve();
                                }, animateTime - 10);
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, queue_string);
                return CoreStored.queueStored;
            }, hide: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                let queue_string = _opts.queue ?? 'hide_eff';
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);

                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {opacity: '1', transition: `all ${animateTime - 10}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                }, 10);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, 'opacity', '0');
                                setTimeout(() => {
                                    LIB.setStyleToElements(item, {display: 'none', transition: null, opacity: null});
                                    child_resolve();
                                    resolve();
                                }, animateTime - 10);
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, queue_string);
                return CoreStored.queueStored;
            }, showSwipe: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                let queue_string = _opts.queue ?? 'show_sw_eff';
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME),
                        type = ((_opts && _opts.type) ? _opts.type : 'left'),
                        transform = " translateX(-100%)"
                    ;

                    if (type == 'right') {
                        transform = " translateX(100%)";
                    }
                    else if (type == 'bottom') {
                        transform = " translateY(100%)";
                    }
                    else if (type == 'top') {
                        transform = " translateY(-100%)";
                    }
                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            let StyleOfElement = LIB.getStyleOfElement(item),
                                HistoryTransform = (StyleOfElement.transform && StyleOfElement.transform != 'none') ? StyleOfElement.transform : '',
                                HistoryCurentTransform = LIB.isNullOrEmpty(item.transform) ? null : item.transform,
                                HistoryPosition = (StyleOfElement.position) ? StyleOfElement.position : '',
                                position = (LIB.isNullOrEmpty(HistoryPosition) || HistoryPosition == 'static') ? 'relative' : HistoryPosition
                            ;
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', opacity: '0', position: position, transform: HistoryTransform + transform, transition: null});
                                setTimeout(() => {
                                    child_resolve();
                                }, 20);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {opacity: '1', transform: HistoryCurentTransform, transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                    resolve();
                                }, animateTime);
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done(ELEMENTS);
                        resolve();
                        main_resolve();
                    }]);
                }, queue_string);
                return CoreStored.queueStored;
            }, showSwipeWidth: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);

                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            let stockWidth = '0px';
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', opacity: '0', overflow: 'none', transition: null});
                                stockWidth = LIB.getStyleOfElement(item).width;
                                LIB.setStyleToElements(item, {width: '0px'});
                                setTimeout(() => {
                                    child_resolve();
                                }, 20);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {opacity: '1', width: stockWidth, transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                }, animateTime);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {overflow: null, transition: null});
                                child_resolve();
                                resolve();
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, 'show_sw_w_eff');
            }, hideSwipe: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                let queue_string = _opts.queue ?? 'hide_sw_eff';
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME),
                        type = ((_opts && _opts.type) ? _opts.type : 'left'),
                        transform = " translateX(-100%)"
                    ;

                    if (type == 'right') {
                        transform = " translateX(100%)";
                    }
                    else if (type == 'bottom') {
                        transform = " translateY(100%)";
                    }
                    else if (type == 'top') {
                        transform = " translateY(-100%)";
                    }
                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            let StyleOfElement = LIB.getStyleOfElement(item),
                                HistoryTransform = (StyleOfElement.transform && StyleOfElement.transform != 'none') ? StyleOfElement.transform : '',
                                HistoryPosition = (StyleOfElement.position) ? StyleOfElement.position : '',
                                position = (LIB.isNullOrEmpty(HistoryPosition) || HistoryPosition == 'static') ? 'relative' : HistoryPosition
                            ;
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', opacity: '1', position: position, transition: null});
                                setTimeout(() => {
                                    child_resolve();
                                }, 10);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {opacity: '0', transform: HistoryTransform + transform, transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    LIB.setStyleToElements(item, {display: 'none', transition: null, opacity: null, transform: HistoryTransform});
                                    child_resolve();
                                    resolve();
                                }, animateTime);
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done(ELEMENTS);
                        resolve();
                        main_resolve();
                    }]);
                }, queue_string);
                return CoreStored.queueStored;
            }, hideSwipeWidth: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                if (!_opts) _opts = {};
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);

                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {opacity: '0', width: '0px', overflow: 'none', transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    LIB.setStyleToElements(item, {display: 'none', width: null, overflow: null, opacity: null, transition: null});
                                    child_resolve();
                                    resolve();
                                }, animateTime);
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, 'hide_sw_w_eff');
            }, zoomIn: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                if (!_opts) _opts = {};
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);

                    const CheckCancel = function(resolve, child_resolve) {
                        if (_opts && _opts.IsCancel == true) {
                            child_resolve();
                            resolve();
                            return true;
                        }
                        return false;
                    }

                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            let HISTORY_TRANSFORM = LIB.getStyleOfElement(item).transform,
                                ELEMENT_TRANSFORM = item.style.transform;
                            (!HISTORY_TRANSFORM) && (HISTORY_TRANSFORM = '');
                            (LIB.isNullOrEmpty(ELEMENT_TRANSFORM)) && (ELEMENT_TRANSFORM = null);
    
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(0.7)', transition: null});
                                setTimeout(() => {
                                    child_resolve();
                                }, 20);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(1)', transition: `all cubic-bezier(0.6, 1.35, 0.75, 1.35) ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                }, animateTime + 20);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {transform: null});
                                child_resolve();
                                resolve();
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, 'zoom_in_eff');
            }, zoomOut: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                if (!_opts) _opts = {};
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);

                    const CheckCancel = function(resolve, child_resolve) {
                        if (_opts && _opts.IsCancel == true) {
                            child_resolve();
                            resolve();
                            return true;
                        }
                        return false;
                    }

                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            let HISTORY_TRANSFORM = LIB.getStyleOfElement(item).transform,
                                ELEMENT_TRANSFORM = item.style.transform;
                            (!HISTORY_TRANSFORM) && (HISTORY_TRANSFORM = '');
                            (LIB.isNullOrEmpty(ELEMENT_TRANSFORM)) && (ELEMENT_TRANSFORM = null);
    
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(1)', transition: null});
                                setTimeout(() => {
                                    child_resolve();
                                }, 20);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(0.7)', transition: `all cubic-bezier(0, -0.53, 0.68, 0.41) ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                }, animateTime + 20);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {transform: null});
                                child_resolve();
                                resolve();
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, 'zoom_out_eff');
            }, collapse: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);

                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', height: 'fit-content', minHeight: null, transition: null});
                                const NEW_HEIGHT = item.offsetHeight;
                                LIB.setStyleToElements(item, {display: 'block', height: `${NEW_HEIGHT}px`, minHeight: `${NEW_HEIGHT}px`, transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                }, 10);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', height: '0px', minHeight: '0px', overflow: 'hidden'});
                                setTimeout(() => {
                                    child_resolve();
                                }, animateTime);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'none', overflow: null, transition: null, minHeight: null, height: null});
                                child_resolve();
                                resolve();
                            }]);
                        });
                    }, function(resolve) {
                        (_opts) && (_opts.self = ELEMENTS);
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, 'collapse_expand_eff');
            }, expand: function(_opts = {}) {
                if (ELEMENTS.length == 0) return false;
                if (!_opts) _opts = {};
                LIB.queueExcuteStories(function(main_resolve) {
                    let animateTime = ((_opts && _opts.time) ? _opts.time : CONFIG.ANIMATION_TIME);
                    
                    LIB.queueExcuteTasking([function(resolve) {
                        ELEMENTS.forEach(item => {
                            let NEW_HEIGHT = 0;
                            LIB.queueExcuteTasking([function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', height: 'fit-content', minHeight: null, transition: null, overflow: 'hidden'});
                                NEW_HEIGHT = item.offsetHeight;
                                LIB.setStyleToElements(item, {display: 'block', height: '0px', minHeight: '0px'});
                                setTimeout(() => {
                                    child_resolve();
                                }, 10)
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', height: `${NEW_HEIGHT}px`, minHeight: `${NEW_HEIGHT}px`, transition: `all ${animateTime}ms`});
                                setTimeout(() => {
                                    child_resolve();
                                }, animateTime);
                            }, function(child_resolve) {
                                LIB.setStyleToElements(item, {display: 'block', overflow: null, transition: null, minHeight: null, height: null});
                                child_resolve();
                                resolve();
                            }]);
                        });
                    }, function(resolve) {
                        (_opts && _opts.done) && _opts.done();
                        resolve();
                        main_resolve();
                    }]);
                }, 'collapse_expand_eff');
            }, scrollTop: function(location) {
                ELEMENTS.forEach(item => {
                    item.scrollTo({top: location, behavior: 'smooth'});
                });
            }
        }
        return ACTIONS;
    }
}