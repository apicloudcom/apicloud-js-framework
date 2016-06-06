/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
(function(window){
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function(){
        var ls = window.localStorage;
        if(isAndroid){
           ls = os.localStorage();
        }
        return ls;
    };
    var parseArguments = function(url, data, fnSuc, dataType){
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    };

    /*Referring to Framework7(Dom7)*/
    var API = function (arr) {
        var _this = this, i = 0;
        // Create array-like object
        for (i = 0; i < arr.length; i++) {
            _this[i] = arr[i];
        }
        _this.length = arr.length;
        // Return collection with methods
        return this;
    };
    var $ = function (selector, context) {
        var arr = [], i = 0;
        if (selector && !context) {
            if (selector instanceof API) {
                return selector;
            }
        }
        if (selector) {
            // String
            if (typeof selector === 'string') {
                var els, tempParent, html;
                selector = html = selector.trim();
                //For example: $('<div>element</div>')
                if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                    var toCreate = 'div';
                    if (html.indexOf('<li') === 0) toCreate = 'ul';
                    if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                    if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                    if (html.indexOf('<tbody') === 0) toCreate = 'table';
                    if (html.indexOf('<option') === 0) toCreate = 'select';
                    tempParent = document.createElement(toCreate);
                    tempParent.innerHTML = html;
                    for (i = 0; i < tempParent.childNodes.length; i++) {
                        arr.push(tempParent.childNodes[i]);
                    }
                }
                else {
                    //For example: $('#id')
                    if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                        // Pure ID selector
                        els = [document.getElementById(selector.split('#')[1])];
                    }
                    else {
                        // Other selectors
                        
                        //Fixed by jinlong | zhangjinlong3546@sina.com
                        //For example: $('.class')
                        var contextEl = document;
                        if(context){
                            //For example: $('.class', document.body)
                            if(context.nodeType && context.nodeType === 1){
                                contextEl = context;
                            }else{//For example: $('.class', '.context')
                                contextEl = document.querySelectorAll(context)[0];
                            }
                        }
                        els = contextEl.querySelectorAll(selector);
                    }
                    for (i = 0; i < els.length; i++) {
                        if (els[i]) arr.push(els[i]);
                    }
                }
            }
            // Node/element
            //For example: $(document.body)
            else if (selector.nodeType || selector === window || selector === document) {
                arr.push(selector);
            }
            //Array of elements or instance of Dom
            //For example: $(document.querySelectorAll('div'))
            else if (selector.length > 0 && selector[0].nodeType) {
                for (i = 0; i < selector.length; i++) {
                    arr.push(selector[i]);
                }
            }
        }
        return new API(arr);
    };

    //Global Method
    $.trim = function(str){
        if(str){
            str = str +'';
            return str.trim();
        }else{
            return '';
        }
    };
    $.isElement = function(obj){
        return !!(obj && obj.nodeType && obj.nodeType == 1);
    };
    $.isArray = function(obj){
        return Array.isArray(obj);
    };
    $.isEmptyObject = function(obj){
        if(JSON.stringify(obj) === '{}'){
            return true;
        }
        return false;
    };
    $.contains = function(parent, node){
        if(document.documentElement.contains){
            return parent !== node && parent.contains(node);
        }else{
            while(node && (node = node.parentNode)){
                if(node === parent){
                    return true;
                }
            }
            return false;
        }
    };
    $.setStorage = function(key, value){
        if(arguments.length === 2){
            var v = value;
            if(typeof v == 'object'){
                v = JSON.stringify(v);
                v = 'obj-'+ v;
            }else{
                v = 'str-'+ v;
            }
            var ls = uzStorage();
            if(ls){
                ls.setItem(key, v);
            }
        }
    };
    $.getStorage = function(key){
        var ls = uzStorage();
        if(ls){
            var v = ls.getItem(key);
            if(!v){return;}
            if(v.indexOf('obj-') === 0){
                v = v.slice(4);
                return JSON.parse(v);
            }else if(v.indexOf('str-') === 0){
                return v.slice(4);
            }
        }
    };
    $.rmStorage = function(key){
        var ls = uzStorage();
        if(ls && key){
            ls.removeItem(key);
        }
    };
    $.clearStorage = function(){
        var ls = uzStorage();
        if(ls){
            ls.clear();
        }
    };
    /*by king*/
    $.fixIos7Bar = function(selector){
        var el = $(selector)[0];
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
        }
    };
    $.fixStatusBar = function(selector){
        var el = $(selector)[0];
        var sysType = api.systemType;
        if(sysType == 'ios'){
            $.fixIos7Bar(el);
        }else if(sysType == 'android'){
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if(ver >= 4.4){
                el.style.paddingTop = '25px';
            }
        }
    };
    $.post = function(/*url,data,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    $.get = function(/*url,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };

    /*APICloud JavaScript Method*/
    API.prototype = {
        constructor: API,
        on: function(name, fn, useCapture){
            useCapture = useCapture || false;
            var that = this;
            var i = 0;
            for(i; i< that.length; i++){
                that[i].addEventListener(name, fn, useCapture);
            }
            return that;
        },
        off: function(name, fn, useCapture){
            useCapture = useCapture || false;
            var that = this;
            var i = 0;
            for(i; i< that.length; i++){
                that[i].removeEventListener(name, fn, useCapture);
            }
            return that;
        },
        one: function(name, fn, useCapture){
            useCapture = useCapture || false;
            var that = this;
            var cb = function(){
                fn && fn();
                that.off(name, cb, useCapture);
            };
            return that.on(name, cb, useCapture);
        },
        trigger: function (eventName, eventData) {
            for (var i = 0; i < this.length; i++) {
                var evt;
                try {
                    evt = new CustomEvent(eventName, {detail: eventData, bubbles: true, cancelable: true});
                }
                catch (e) {
                    evt = document.createEvent('Event');
                    evt.initEvent(eventName, true, true);
                    evt.detail = eventData;
                }
                this[i].dispatchEvent(evt);
            }
            return this;
        },
        eq: function(index){
            index = parseInt(index);
            var len = this.length;
            if(index >= 0 && index < len){
                return new API([this[index]]);
            }else{
                return new API([]);
            }
        },
        prev: function(){
            if (this.length > 0) {
                if(this[0].previousElementSibling){
                    return new API([this[0].previousElementSibling]);
                }else{
                    return new API([]);
                }
            }else{
                return new API([]);
            }
        },
        next: function(){
            if (this.length > 0) {
                if(this[0].nextElementSibling){
                    return new API([this[0].nextElementSibling]);
                }else{
                    return new API([]);
                }
            }else{
                return new API([]);
            }
        },
        closest: function(selector){
            var thisEl = this[0], doms;
            var targetEl = false;

            var findNode = function(el){
                doms = $(selector, el.parentNode);
                var i = 0, len = doms.length;
                for(i; i<len; i++){
                    if(doms[i] === el){
                        targetEl = doms[i];
                        return targetEl;
                    }
                }
                return targetEl;
            };
            //current element is target element
            targetEl = findNode(thisEl);

            //loop the parents
            while(!targetEl){
                thisEl = thisEl.parentNode;
                //reach root element
                if(thisEl === document.body || thisEl.nodeType == thisEl.DOCUMENT_NODE){
                    return new API([]);
                }
                targetEl = findNode(thisEl);
            }

            if(targetEl){
                return new API([targetEl]);
            }else{
                return new API([]);
            }
        },
        remove: function(){
            for (var i = 0; i < this.length; i++) {
                if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        attr: function(name, value){
            if(arguments.length === 1){
                //get attr
                if(this[0]){
                   return this[0].getAttribute(name);
                }
            }else{
                //set attr
                var i = 0, len = this.length;
                for(i; i<len; i++){
                    this[i].setAttribute(name, value);
                }
                return this;
            }
        },
        removeAttr: function(name){
            var i = 0, len = this.length;
            for(i; i<len; i++){
                this[i].removeAttribute(name);
            }
            return this;
        },
        hasClass: function(className){
            if(!this[0]){return false;}
            return this[0].classList.contains(className);
        },
        addClass: function(className){
            var cls = className.split(' ');
            for(var i = 0, iLen = cls.length; i < iLen; i++){
                for(var j = 0, jLen = this.length; j < jLen; j++){
                    this[j].classList.add(cls[i]);
                }
            }
            return this;
        },
        removeClass: function(className){
            var cls = className.split(' ');
            for(var i = 0, iLen = cls.length; i < iLen; i++){
                for(var j = 0, jLen = this.length; j < jLen; j++){
                    this[j].classList.remove(cls[i]);
                }
            }
            return this;
        },
        toggleClass: function(className){
            var cls = className.split(' ');
            for(var i = 0, iLen = cls.length; i < iLen; i++){
                for(var j = 0, jLen = this.length; j < jLen; j++){
                    this[j].classList.toggle(cls[i]);
                }
            }
            return this;
        },
        val: function(value){
            if(typeof value === 'undefined'){
                //get
                var el = this[0];
                switch(el.tagName){
                    case 'SELECT':
                        var value = el.options[el.selectedIndex].value;
                        return value;
                        break;
                    default:
                        return el.value;
                }
            }else{
                //set
                var setVal = function(el, value){
                    switch(el.tagName){
                        case 'SELECT':
                            el.options[el.selectedIndex].value = value;
                            break;
                        case 'INPUT':
                            el.value = value;
                            break;
                        case 'TEXTAREA':
                            el.value = value;
                            break;
                    }
                };
                for(var i = 0, len = this.length; i<len; i++){
                    setVal(this[i], value);
                }
                return this;
            }
        },
        prepend: function(el){
            var html;
            if($.isElement(el)){
                //DOM element
                html = el.outerHTML;
            }else if(typeof el === 'string'){
                //HTML string
                html = el;
            }
            for(var i = 0, len = this.length; i<len; i++){
                this[i].insertAdjacentHTML('afterbegin', html);
            }
            return this;
        },
        append: function(el){
            var html;
            if($.isElement(el)){
                html = el.outerHTML;
            }else if(typeof el === 'string'){
                html = el;
            }
            for(var i = 0, len = this.length; i<len; i++){
                this[i].insertAdjacentHTML('beforeend', html);
            }
            return this;
        },
        before: function(el){
            var html;
            if($.isElement(el)){
                html = el.outerHTML;
            }else if(typeof el === 'string'){
                html = el;
            }
            for(var i = 0, len = this.length; i<len; i++){
                this[i].insertAdjacentHTML('beforebegin', html);
            }
            return this;
        },
        after: function(el){
            var html;
            if($.isElement(el)){
                html = el.outerHTML;
            }else if(typeof el === 'string'){
                html = el;
            }
            for(var i = 0, len = this.length; i<len; i++){
                this[i].insertAdjacentHTML('afterend', html);
            }
            return this;
        },
        html: function(html){
            if(html){
                //set
                for(var i = 0, len = this.length; i<len; i++){
                    this[i].innerHTML = html;
                }
                return this;
            }else{
                //get
                return this[0].innerHTML;
            }
        },
        text: function(text){
            if(text){
                //set
                for(var i = 0, len = this.length; i<len; i++){
                    this[i].textContent = text;
                }
                return this;
            }else{
                //get
                return this[0].textContent;
            }
        },
        offset: function(){
            var el = this[0];
            var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

            var rect = el.getBoundingClientRect();
            return {
                l: rect.left + sl,
                t: rect.top + st,
                w: el.offsetWidth,
                h: el.offsetHeight
            };
        },
        css: function(css){
            //set
            if(typeof css == 'string' && css.indexOf(':') > 0){
                for(var i = 0, len = this.length; i<len; i++){
                    this[i].style += ';' + css;
                }
            }else{//get
                var computedStyle = window.getComputedStyle(this[0], null);
                return computedStyle.getPropertyValue(css);
            }
        }
    };

    window.$api = $;

})(window);


