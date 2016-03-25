(function (undef) {
;var VERSION = "0.1.0",
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
        var result = this._tq_strategy._tq_parse(selector);
        if (result instanceof TreeQuery) {
            return result;
        } else {
            return $(this._tq_context, this._tq_context).find(selector);
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

TreeQuery.register = function (name, obj) {
    console.log("TreeQuery.register", name, obj);
    var base = new BaseStrategy();
    for (var func in base) {
        if (typeof base[func] == "function" && !obj[func]) {
            obj[func] = base[func];
        }
    }
    TreeQuery._tq_types[name] = obj;
    
    for (var name in obj) {
        if (typeof obj[name] == "function" && !TreeQuery_prototype[name]) {
            
            (function (_name) {                
                TreeQuery_prototype[_name] = function () {
                    var args = [null];
                    for (var i=0; i<arguments.length; i++) {
                        args.push(arguments[i]);
                    }
                    args.push(0);
                    args.push(this.length);
                    for (var i=0; i<this.length; i++) {
                        args[0]=this[i];
                        args[args.length-2]=i;
                        var result = this._tq_strategy[_name].apply(obj, args);
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
;TreeQuery.Filters = function (strategy) {
    this._filters = [];
    this._strategy = strategy;
}

TreeQuery.Filters.prototype = {};
TreeQuery.Filters.prototype.constructor = TreeQuery.Filters
TreeQuery.Filters.prototype.append = function (filter) {
    this._filters.push(filter);
}
TreeQuery.Filters.prototype.check = function (node, strategy) {
    var _strategy = strategy || this._strategy;
    if (!this._filters) console.warn("WARNING: check function not overwritten for this class: ", this);
    for (var i in this._filters) {
        console.assert(typeof this._filters[i].check == "function", this._filters[i]);
        if (!this._filters[i].check(node, _strategy)) return false;
    }
    return this._filters.length > 0;
}

TreeQuery.Filters.TageNameFilter = function (tagname) {
    this._tagname = tagname.toLowerCase();    
}
TreeQuery.Filters.TageNameFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.TageNameFilter.prototype.constructor = TreeQuery.Filters.TageNameFilter
TreeQuery.Filters.TageNameFilter.prototype.check = function (node, strategy) {
    return strategy.tagName(node).toLowerCase() == this._tagname;
}


TreeQuery.Filters.IdFilter = function (id) {
    this._id = id.toLowerCase();    
}
TreeQuery.Filters.IdFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.IdFilter.prototype.constructor = TreeQuery.Filters.IdFilter
TreeQuery.Filters.IdFilter.prototype.check = function (node, strategy) {
    var id = strategy.id(node);;
    return typeof id == "string" ? id.toLowerCase() == this._id : false;
}


TreeQuery.Filters.ClassFilter = function (classname) {
    this._classname = classname.toLowerCase(); 
}
TreeQuery.Filters.ClassFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.ClassFilter.prototype.constructor = TreeQuery.Filters.ClassFilter
TreeQuery.Filters.ClassFilter.prototype.check = function (node, strategy) {
    var list = strategy.class(node);
    for (var i in list) {
        if (list[i].toLowerCase() == this._classname) return true;
    }
    return false;
}


TreeQuery.Filters.AsterFilter = function () {}
TreeQuery.Filters.AsterFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.AsterFilter.prototype.constructor = TreeQuery.Filters.AsterFilter
TreeQuery.Filters.AsterFilter.prototype.check = function () {    
    return true;
}

;

TreeQuery.Engine = {
    parseSelector: function (selector) {
        return [];
    },    
    filter: function ($target) {
        var result = [];
        var filter = TreeQuery.Factory.getFilter($target._tq_selector, $target._tq_strategy);
        var list = $target.map(function (a) { return a; });                
        while (list.length > 0) {
            var obj = list.splice(0,1)[0];
            if ( filter.check(obj) ) {
                result.push(obj);
            }            
        }
        return $(result, $target._tq_context);
    },    
    find: function ($target) {
        var result = [];
        var filter = TreeQuery.Factory.getFilter($target._tq_selector, $target._tq_strategy);
        var list = $target.map(function (a) { return a; });                
        while (list.length > 0) {
            var obj = list.splice(0,1)[0];
            var children = $target._tq_strategy.children(obj);
            for (var index in children) {
                list.push(children[index]); // future revision
                if ( filter.check(children[index]) ) {
                    result.push(children[index]);
                }
            }
        }
        return $(result, $target._tq_context);
    },
    apply: function ($target, name_func, args, results) {
        // recorre toda la lista de objetos que contiene $target        
    },
    resolve: function ($target) {
        var $ = TreeQuery;
        // console.log("Engine.resolve", arguments);
        console.assert(typeof $target._tq_selector == "string", $target._tq_selector);
        var list, result = [],
            _list_of_comma_parts  = $target._tq_selector.split(","),
            _list_of_spaces_parts = $target._tq_selector.split(" "),
            _selector_has_commas  = _list_of_comma_parts.length > 1,
            _selector_has_spaces  = _list_of_spaces_parts.length > 1;
        
        if (_selector_has_commas) {
            list = _list_of_comma_parts;
            for (var _select in list) {
                var array = 
                result = result.concat($target.find(list[_select]).valueOf());
            }
            return $(result, $target._tq_context);
        } else if (_selector_has_spaces) {
            list = _list_of_spaces_parts;
            
            // div div
            // div > div
            function deep_search($t, selector) { return $t.find(selector); }
            function children($t, selector) { return $t.children().filter(selector); }
            var method = deep_search;
            $current = $target;
            for (var _select in list) {
                if (list[_select] == "") continue;
                if (list[_select] == ">") {
                    method = children;
                    continue;
                }
                $current = method($current, list[_select]);
                method = deep_search;
            }
            return $current;
        } else {
            
            return TreeQuery.Engine.find($target);
        }
        return $target;
    },
    children: function ($target) {
        var result = [];
        var list = $target.map(function (a) { return a; });                
        while (list.length > 0) {
            var obj = list.splice(0,1)[0];
            var children = $target._tq_strategy.children(obj);
            result = result.concat(children);
        }
        return $(result, $target._tq_context);
    },
    cache: {}
}
;TreeQuery.Factory = {
    getStrategy: function (selector, context) {
        // itera sobre los tipos definidos y a cada uno le pregunta si el contexto corresponde a su tipo.
        if (typeof TreeQuery.Factory.cache[context] != "undefined") return TreeQuery.Factory.cache[context]
        for (var name in TreeQuery._tq_types) {
            var strategy = TreeQuery._tq_types[name];        
            if (strategy._tq_accepts(context, selector)) {
                // TODO: acá tengo un memory leak?
                TreeQuery.Factory.cache[context] = strategy;
                return strategy;
            }
        }        
        return null;
    },
    getFilter: function (selector, strategy) {        
        console.assert(typeof selector == "string", selector);
        console.assert(selector.split(" ").length == 1, selector);
        /*
        var CLASS_SELECTOR = /(\.([\w-\d]+))+/;
        console.log( selector.match(CLASS_SELECTOR)  );
        // console.log( CLASS_SELECTOR.test(selector)  );
        if (selector.match(CLASS_SELECTOR)) {
            
        }
        */
        // ------
        var FUNCTION = /:(\w+)\(/,
            MODIFIER = /:(\w+)/
        ;
        var parts, tagname, id, class_list, modifier, modif_func, aster;
        
        tagname = selector;
        
        if (selector.indexOf(".") != -1) {
            var parts = selector.split(".");
            tagname = parts.splice(0,1)[0];            
            class_list = parts.map(function (n) {
                return n.split("[")[0].split(":")[0];
            });
        }
        
        if (selector == "*") {        
            tagname = "";
            aster = true;
        }
        
        if (selector.indexOf("#") != -1) {
            var parts = selector.split("#");
            tagname = parts[0];            
            id = parts[1].split("[")[0].split(":")[0];
        }
        
        if (selector.indexOf(":") != -1) {
            var parts = selector.split(":");
            modifier = parts[1];            
            id = parts[1].split("[")[0].split(":")[0];
        }
        
        if (FUNCTION.test(selector)) {
            // [":not(", "not"]
            var parts = text.match(FUNCTION);
            modif_func = parts[1];
        } else if (MODIFIER.test(selector)) {
            // [":not(", "not"]
            var parts = text.match(MODIFIER);
            modifier = parts[1];
        }
        
        // console.log(selector, "-->", tagname, id, class_list);
        
        var filter = new TreeQuery.Filters(strategy);
        
        if (aster) {
            filter.append(new TreeQuery.Filters.AsterFilter())
        }
        if (tagname) {
            filter.append(new TreeQuery.Filters.TageNameFilter(tagname))
        }
        if (id) {
            filter.append(new TreeQuery.Filters.IdFilter(id))
        }
        for (var i in class_list) {
            filter.append(new TreeQuery.Filters.ClassFilter(class_list[i]))
        }
        
        return filter;
    },
    cache: {}
};// ----------------------------------------------

var error_text = "ERROR: 'XXX' function must be overwritten";
function BaseStrategy(selector, context) {
    
}

BaseStrategy.prototype = {};
BaseStrategy.prototype.constructor = BaseStrategy;
BaseStrategy.prototype._tq_accepts = function (node) {
    // reorna true si el node es del tipo que implementa esta estrategia
    console.error(error_text.replace("XXX", "check"));
    return false;
}

BaseStrategy.prototype.class = function (node, new_class_value) {
    // if new_class_value is passed then the class of the node is setted.
    // Otherwise returns the current class value of the node
    console.error(error_text.replace("XXX", "class"));
}

BaseStrategy.prototype.addClass = function (node) {
    console.error(error_text.replace("XXX", "addClass"));
}

BaseStrategy.prototype.removeClass = function (node) {
    console.error(error_text.replace("XXX", "removeClass"));
}

BaseStrategy.prototype.hasClass = function (node) {
    console.error(error_text.replace("XXX", "hasClass"));
}

BaseStrategy.prototype.attributes = function (node, new_attrs_value) {
    // if new_attrs_value is passed then the attribute list of the node is replaced.
    // Otherwise returns the current node's attribute list
    console.error(error_text.replace("XXX", "atributtes"));
}

BaseStrategy.prototype.attr = function (node, key, value) {
    // if new_attrs_value is passed then the attribute list of the node is replaced.
    // Otherwise returns the current node's attribute list
    console.error(error_text.replace("XXX", "atributtes"));
}

BaseStrategy.prototype.removeAttr = function (node, key) {
    console.error(error_text.replace("XXX", "removeAttr"));
}

BaseStrategy.prototype.children = function (node, new_children) {
    // if new_children is passed then the all node's chilren are replaced.
    // Otherwise returns the current node's chilren list
    console.error(error_text.replace("XXX", "children"));
}

BaseStrategy.prototype.addChild = function (node) {
    console.error(error_text.replace("XXX", "addChild"));
}


BaseStrategy.prototype.removeChild = function (node) {
    console.error(error_text.replace("XXX", "removeChild"));
}

BaseStrategy.prototype.parent = function (node, current_parent) {
    // if current_parent is passed then the parent is seted to this obj
    // Otherwise returns the current node's parent (if any) 
    console.error(error_text.replace("XXX", "parent"));
}

BaseStrategy.prototype.tagName = function (node) {
    // returns the tag name of the node
    console.error(error_text.replace("XXX", "tagName"));
}

BaseStrategy.prototype.id = function (node, new_id) {
    // if new_id is passed then the node's id is seted.
    // Otherwise returns the current node's id
    console.error(error_text.replace("XXX", "id"));
};

// ----------------------------------------------
;
(function (installer) {
    if ( typeof define === "function" && define.amd ) {
        define(["treequery"], installer );
    } else if (typeof TreeQuery != "undefined") {
        installer(TreeQuery);
    } else {
        console.error("ERROR: can't register type. Enable to locate TreeQuery instance");
    }
})(function ($) {
    $.register("html-element", {
        _tq_accepts: function (node) {
            // reorna true si el node es del tipo que implementa esta estrategia
            return node instanceof HTMLElement;
        },
        _tq_parse: function (str) {
            try {
                var div = document.createElement('div');
                div.innerHTML = str;
                var children = Array.prototype.map.call(div.childNodes, function (n) { return n; });                
                if (children.length == 1 && children[0] instanceof Text) {
                    return null;
                }
                return $(children);
            } catch(e) {
                return null;
            }
        },
        class: function (node, new_class_value) {
            // if new_class_value is passed then the class of the node is setted.
            // Otherwise returns the current class value of the node
            console.assert(this._tq_accepts(node), node);
            if (new_class_value) {
                node.className = new_class_value;
                return this;
            };
            return node.className.split(" ");
        },
        addClass: function (node, classname) {
            console.assert(this._tq_accepts(node), node);            
            node.className += " " + classname;
            return this;
        },
        removeClass: function (node, classname) {
            console.assert(this._tq_accepts(node), node);            
            node.className = node.className.replace(new RegExp("(?:^|\\s)" + classname +  "(?!\\S)", "g"), '' );
            return this;
        },
        hasClass: function (node, classname) {
            console.assert(this._tq_accepts(node), node);            
            var reg = new RegExp("(?:^|\\s)" + classname +  "(?!\\S)");
            return !!node.className.match(reg);
        },
        attr: function (node, key, value) {
            console.assert(this._tq_accepts(node), node);        
            console.assert(arguments.length != 3, arguments);
            
            if ((arguments.length == 2 || arguments.length == 4) && typeof key == "string") {
                // no value passed. Is a get invocation.
                return this.attributes(node)[key];
            }
            
            if ((arguments.length == 2 || arguments.length == 4) && typeof key == "object") {
                // map object passed. Is a multiple set invocation.
                var list = key;
                for (var key_i in list) {
                    var value_i = list[key_i];
                    node.setAttribute(key_i, value_i);
                }                
            }
            
            if ((arguments.length == 3 || arguments.length == 5) && typeof value == "function") {
                var index = -1;                
                if (node.parentNode) {
                    var nodeList = Array.prototype.slice.call( node.parentNode.children );
                    index = nodeList.indexOf( node );
                }
                var value_func = value.apply(node, [index, key]);
                node.setAttribute(key, value_func);                
            }
            
            if (arguments.length == 3 || arguments.length == 5) {
                node.setAttribute(key, value);
            }
            
            return this;            
        },
        attributes: function (node, new_attrs_value) {
            // if new_attrs_value is passed then the attribute list of the node is replaced.
            // Otherwise returns the current node's attribute list
            console.assert(this._tq_accepts(node), node);            
            if (new_attrs_value) {
                for (var prop in new_attrs_value) {                    
                    node.setAttribute(prop, new_attrs_value[prop]);
                };
                return this;
            };            
            var result = {};
            Object.defineProperty(result, 'length', {enumerable: false, value: node.attributes.length});            
            for (var i=0; i<node.attributes.length; i++) {
                result[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
            }
            return result;
        },
        removeAttr: function (node, key) {
            console.assert(this._tq_accepts(node), node);
            node.removeAttribute(key);
            return this;
        },
        children: function (node, new_children) {
            // if new_children is passed then the all node's chilren are replaced.
            // Otherwise returns the current node's chilren list                        
            console.assert(this._tq_accepts(node), node);
            
            if (new_children) {
                for (var i in new_children) {
                    var child = new_children[i];
                    console.assert(this._tq_accepts(child), child);
                    if (this._tq_accepts(child)) {                        
                        node.appendChild(child);
                    }
                }
            }
            
            var children = [];
            for (var i in node.childNodes) {
                if (this._tq_accepts(node.childNodes[i])) {
                    children.push(node.childNodes[i]);
                }
            }
            return children;                    
        },
        remove: function (node) {
            console.assert(this._tq_accepts(node), node);
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            return this;
        },        
        // ---------------------------------------------------------
        addChild: function (node, child) {
            console.assert(this._tq_accepts(node), node);
            console.assert(this._tq_accepts(child), child);
            if (this._tq_accepts(child)) {                        
                node.appendChild(child);
            }
            return this;
        },
        removeChild: function (node) {
            console.assert(this._tq_accepts(node), node);
            console.assert(this._tq_accepts(child), child);
            if (this._tq_accepts(child)) {                        
                node.removeChild(child);
            }
            return this;
        },
        parent: function (node, current_parent) {
            // if current_parent is passed then the parent is seted to this obj
            // Otherwise returns the current node's parent (if any) 
            console.assert(this._tq_accepts(node), node);            
            if (current_parent && this._tq_accepts(current_parent)) {                        
                if (node.parentNode != current_parent) {
                    node.parentNode.removeChild(node);
                    current_parent.appendChild();
                    console.assert(node.parentNode == current_parent, node, node.parentNode,current_parent);
                }
                return this;
            }
            return node.parentNode;
        },
        clone: function (node) {
            console.assert(this._tq_accepts(node), node);
            return $(node.cloneNode(true));
        },
        append: function (node, target, index, total) {
            console.assert(this._tq_accepts(node), node);
            if (this._tq_accepts(target)) {
                this.addChild(node, target);
            }
            
            if (target instanceof TreeQuery) {
                for (var i=0; i<target.length; i++) {                    
                    var elem = target[i];
                    console.assert(this._tq_accepts(elem), elem);
                    if (!isNaN(index) && !isNaN(total) && index!=total-1) {
                        elem = this.clone(elem)[0];
                    }
                    this.append(node,elem);
                }
            }
            
            return this;
        },
        appendTo: function (node, content) {
            console.assert(this._tq_accepts(node), node);
            if (this._tq_accepts(content) && this._tq_accepts(node)) {
                content.appendChild(node);
            }
            
            if (content instanceof TreeQuery) {
                for (var i=0; i<content.length; i++) {                    
                    var elem = content[i];
                    console.assert(this._tq_accepts(elem), elem);
                    this.append(elem, i==content.length-1 ? node : this.clone(node)[0]);
                }                
            }
            
            if (typeof content == "string") {
                this.appendTo(node, $(content));
            }
            
            return this;
        },
        // ----------------------------------------------------------
        
        tagName: function (node) {
            // returns the tag name of the node
            console.assert(this._tq_accepts(node), node);
            return node.tagName.toLowerCase();
        },
        id: function (node, new_id) {
            // if new_id is passed then the node's id is seted.
            // Otherwise returns the current node's id
            return new_id ? this.attr(node, "id", new_id) : this.attr(node, "id");
        },
    });
});
;
(function (installer) {
    if ( typeof define === "function" && define.amd ) {
        define(["treequery"], installer );
    } else if (typeof TreeQuery != "undefined") {
        installer(TreeQuery);
    } else {
        console.error("ERROR: can't register type. Enable to locate TreeQuery instance");
    }
})(function ($) {
    $.register("js-object", {
        accepts: function (node) {
            // reorna true si el node es del tipo que implementa esta estrategia
            return false;
        },
        class: function (node, new_class_value) {
            // if new_class_value is passed then the class of the node is setted.
            // Otherwise returns the current class value of the node
        },
        addClass: function (node, classname) {},
        removeClass: function (node, classname) {},
        hasClass: function (node, classname) {
            console.assert(this._tq_accepts(node), node);
        },

        attr: function (node) {},
        atributtes: function (new_attrs_value) {
            // if new_attrs_value is passed then the attribute list of the node is replaced.
            // Otherwise returns the current node's attribute list
        },
        removeAttr: function (node) {},

        children: function (node, new_children) {
            // if new_children is passed then the all node's chilren are replaced.
            // Otherwise returns the current node's chilren list
        },
        addChild: function (node) {},
        removeAttr: function (node) {},
        parent: function (node, current_parent) {
            // if current_parent is passed then the parent is seted to this obj
            // Otherwise returns the current node's parent (if any) 
        },
        tagName: function (node) {
            // returns the tag name of the node
        },
        id: function (node, new_id) {
            // if new_id is passed then the node's id is seted.
            // Otherwise returns the current node's id
        },
    });
});
;
    if ( typeof define === "function" && define.amd ) {
        define([], function () {return TreeQuery; } );
    } else {
        window.$ = TreeQuery;
        window.TreeQuery = TreeQuery;
    }

})();