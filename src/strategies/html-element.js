
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
