TreeQuery._tq_register_stratgy("html-element", {
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
            return TreeQuery(children);
        } catch(e) {
            return null;
        }
    },
    _tq_class: function (node, new_class_value) {
        // if new_class_value is passed then the class of the node is setted.
        // Otherwise returns the current class value of the node
        console.assert(this._tq_accepts(node), node);
        if (new_class_value) {
            node.className = new_class_value;
            return this;
        };
        return node.className.split(" ");
    },
    _tq_add_class: function (node, classname) {
        console.assert(this._tq_accepts(node), node);            
        node.className += " " + classname;
        return this;
    },
    _tq_remove_class: function (node, classname) {
        console.assert(this._tq_accepts(node), node);            
        node.className = node.className.replace(new RegExp("(?:^|\\s)" + classname +  "(?!\\S)", "g"), '' );
        return this;
    },
    _tq_has_class: function (node, classname) {
        console.assert(this._tq_accepts(node), node);            
        var reg = new RegExp("(?:^|\\s)" + classname +  "(?!\\S)");
        return !!node.className.match(reg);
    },
    _tq_get_css: function (node, key) {
        return node.style[TreeQuery.utils.toCamelCase(key)]
    },
    _tq_set_css: function (node, key, value) {
        return node.style[TreeQuery.utils.toCamelCase(key)] = value;        
    },
    _tq_get_attr: function (node, key) {
        console.assert(this._tq_accepts(node), node);        
        console.assert(typeof key == "string", arguments);
        return node.getAttribute(key);
    },
    _tq_set_attr: function (node, key, value) {
        console.assert(this._tq_accepts(node), node);        
        console.assert(typeof key == "string", arguments);
        return node.setAttribute(key, value);
    },
    _tq_map_attr: function (node) {
        console.assert(this._tq_accepts(node), node);            
        var result = {};
        Object.defineProperty(result, 'length', {enumerable: false, value: node.attributes.length});            
        for (var i=0; i<node.attributes.length; i++) {
            result[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
        }
        return result;
    },
    _tq_set_map_attr: function (node, new_attrs_value) {
        console.assert(this._tq_accepts(node), node);            
        for (var i=0; i<node.attributes.length; i++) {
            node.removeAttribute(node.attributes[i].nodeValue);
        }
        for (var prop in new_attrs_value) {                    
            node.setAttribute(prop, new_attrs_value[prop]);
        }
        return this;
    },
    _tq_remove_attr: function (node, key) {
        console.assert(this._tq_accepts(node), node);
        node.removeAttribute(key);
        return this;
    },
    _tq_children: function (node) {
        console.assert(this._tq_accepts(node), node);
        var children = [];
        for (var i in node.childNodes) {
            if (this._tq_accepts(node.childNodes[i])) {
                children.push(node.childNodes[i]);
            }
        }
        return children;                    
    },
    _tq_remove: function (node) {
        console.assert(this._tq_accepts(node), node);
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        return this;
    },        
    // ---------------------------------------------------------
    _tq_add_child: function (node, child) {
        console.assert(this._tq_accepts(node), node);
        console.assert(this._tq_accepts(child), child);
        if (this._tq_accepts(child)) {                        
            node.appendChild(child);
        }
        return this;
    },
    _tq_remove_child: function (node, child) {
        console.assert(this._tq_accepts(node), node);
        console.assert(this._tq_accepts(child), child);
        if (this._tq_accepts(child)) {                        
            node.removeChild(child);
        }
        return this;
    },
    _tq_parent: function (node, current_parent) {
        // if current_parent is passed then the parent is seted to this obj
        // Otherwise returns the current node's parent (if any) 
        console.assert(this._tq_accepts(node), node);            
        if (current_parent && this._tq_accepts(current_parent)) {                        
            if (node.parentNode != current_parent) {
                node.parentNode.removeChild(node);
                current_parent.appendChild(node);
                console.assert(node.parentNode == current_parent, node, node.parentNode,current_parent);
            }
            return this;
        }
        return node.parentNode;
    },
    _tq_clone: function (node) {
        console.assert(this._tq_accepts(node), node);
        return node.cloneNode(true);
    },
    // ----------------------------------------------------------
    _tq_tag_name: function (node) {
        // returns the tag name of the node
        console.assert(this._tq_accepts(node), node);
        return node.tagName.toLowerCase();
    },
    _tq_id: function (node, new_id) {
        // if new_id is passed then the node's id is seted.
        // Otherwise returns the current node's id
        return new_id ? this._tq_set_attr(node, "id", new_id) : this._tq_get_attr(node, "id");
    },
    _tq_offset: function (node, new_value) {
        if (new_value) {
            console.error("ERROR: _tq_offset(arguments[2]) not implemented");            
            return this;
        }
        return {top: node.offsetTop, left: node.offsetLeft};
    },
    _tq_width: function (node, new_value) {
        if (new_value) {
            node.style.width= new_value;
            return this;
        }
        return node.offsetWidth;
    },
    _tq_height: function (node, new_value) {
        if (new_value) {
            node.style.height = new_value;
            return this;
        }
        return node.offsetHeight;
    },
});
