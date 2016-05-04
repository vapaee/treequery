var VERSION = "0.8.0",
    TreeQuery_prototype = [];

function TreeQuery(selector, context) {
    if (selector instanceof TreeQuery) return selector;
    if (arguments.length == 0) {
        if (!(this instanceof TreeQuery)) return new TreeQuery();
        return;
    }
    if (!(this instanceof TreeQuery)) return new TreeQuery(selector, context);
    this.length = 0;
    this._tq_selector = selector;
    this._tq_context  = context || this._tqGetDefaultContext();
    this._tq_strategy = this._tqGetStrategy();
    
    if (Array.isArray(selector)) {        
        for (var i in selector) {
            if (this.indexOf(selector[i]) == -1) this.push(selector[i]);
        }
        return this;
    }
    
    if (this._tq_strategy._tq_accepts(this._tq_selector)) {
        this.push(this._tq_selector);
        console.assert(this.length == 1, this);
        return this;
    }    
    
    if (typeof selector == "string") {
        if (selector=="body") {
            var body = this._tqGetDefaultContext();
            return new TreeQuery(body,body);
        }
        var result = this._tq_strategy._tq_parse(selector);
        if (result instanceof TreeQuery) {
            return result;
        } else {
            return new TreeQuery(this._tq_context, this._tq_context).find(selector);
        }
    }
    
}

TreeQuery.prototype = TreeQuery_prototype;
TreeQuery_prototype.constructor = TreeQuery;
TreeQuery_prototype._tqGetStrategy = function () {
    return TreeQuery.Factory.getStrategy(this._tq_selector, this._tq_context);
}

TreeQuery_prototype.valueOf = function () {
    return this.map(function (n) { return n; });
}

TreeQuery_prototype._tqGetDefaultContext = function () {
    return document.body;
}

TreeQuery_prototype.find = function (selector) {
    this._tq_selector = selector;
    return TreeQuery.Engine.resolve(this);
}

TreeQuery_prototype.children = function () {
    return TreeQuery.Engine.children(this);
}

TreeQuery_prototype.filter = function (selector) {
    this._tq_selector = selector;
    return TreeQuery.Engine.filter(this, selector);
}

TreeQuery._tq_version = VERSION;
TreeQuery._tq         = TreeQuery_prototype;
TreeQuery._tq_types   = {};

TreeQuery._tq_register_api = function (name, api) {
    for (var func in api) {
        if (typeof api[func] == "function") {
            TreeQuery._tq[func] = api[func];
        }
    }    
    
    /*
    var extensions = TreeQuery._tq_apis[name];    
    if (!extensions) extensions = {};
    
    for (var func in api) {
        if (typeof api[func] == "function") {
            extensions[func] = api[func];
        }
    }
    
    TreeQuery._tq_apis[name] = extensions;
    */
}

TreeQuery._tq_register_stratgy = function (name, api) {
    var base = new BaseStrategy();
    for (var func in base) {
        if (typeof base[func] == "function" && !api[func]) {
            api[func] = base[func];
        }
    }
    var strategy = TreeQuery._tq_types[name];    
    if (!strategy) strategy = new Strategy(name);
    
    for (var func in api) {
        if (typeof api[func] == "function") {
            strategy[func] = api[func];
        }
    }
    
    TreeQuery._tq_types[name] = strategy;
    
    for (var name in api) {
        if (typeof api[name] == "function" && !TreeQuery_prototype[name]) {
            
            (function (_name) {                
                TreeQuery_prototype[_name] = function () {
                    // this is TreeQuery                    
                    var args = Array.prototype.map.call(arguments, function (n) { return n; });
                    args.unshift(null);            // agrego un null al comienzo
                    args.push(0);                  // current index
                    args.push(this.length);        // total 
                    for (var i=0; i<this.length; i++) {
                        args[0]=this[i];           // current element
                        args[args.length-2]=i;     // current index
                        var result = this._tq_strategy[_name].apply(this._tq_strategy, args);
                        if (result != this._tq_strategy) {
                            return result;
                        }
                    }
                    
                    return this;
                };
            })(name);
            
        }
    }    
}
