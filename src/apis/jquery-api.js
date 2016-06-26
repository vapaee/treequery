TreeQuery._tq_register_api("jquery-dom-manage", {
    each: function (callback) {
        var do_break = null;
        for (var i=0; i<this.length; i++) {
            do_break = callback.call(this[i], this[i], i, this);
            if (do_break) break;
        }
        return this;
    },
    offset: function () {
        return {
            top: this[0].offsetTop,
            left: this[0].offsetLeft
        }
    },
    eq: function (index) {
        return this[index];
    },
    is: function (selection) {
        console.assert(false, "TreeQuery.BaseStrategy.is NOT IMPLEMENTED YET");
        return $();
    },
    next: function () {
        // https://api.jquery.com/next/
        // Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
        console.assert(false, "TreeQuery.BaseStrategy.next NOT IMPLEMENTED YET");
        return false;
    },
    class: function (new_class_value) {
        return this._tq_strategy._tq_class(this[0], new_class_value);
    },
    addClass: function (classname) {        
        return this.each(function (element,index,self) {
            self._tq_strategy._tq_add_class(element, classname);
        });
    },
    removeClass: function (classname) {
        return this.each(function (element,index,self) {
            self._tq_strategy._tq_remove_class(element, classname);
        });
    },
    hasClass: function (classname) {
        return this._tq_strategy._tq_has_class(this[0], classname);
    },
    css: function (key, val) {
        if (arguments.length == 1) {
            if (typeof key == "object") {
                for (var i in key) {
                    this.css(i, key[i]);
                }
                return this;            
            }

            if (typeof key == "string") {
                if (this.length == 0) return null;
                return self._tq_strategy._tq_set_css(this[0], key, val);          
            }
        }
        
        if (arguments.length == 2 && typeof key == "string") {
            return this.each(function (element,index,self) {
                self._tq_strategy._tq_set_css(element, key, val);
            });
        }
        
        return this;
    },
    attr: function (key, value) {
        
        if (arguments.length == 1 && typeof key == "string") {
            return this._tq_strategy._tq_get_attr(this[0], key);
        }
        
        if (arguments.length == 2 && typeof key == "string" && (typeof value == "string" || typeof value == "number")) {
            return this.each(function (element,index,self) {
                self._tq_strategy._tq_set_attr(element, key, value);
            });            
        }
        
        if (arguments.length == 2 && typeof key == "string" && typeof value == "function") {
            return this.each(function (element,index,self) {
                var value_func = value.apply(element, [index, key]);
                self._tq_strategy._tq_set_attr(element, key, value_func);
            });            
        }        
        
        if (typeof key == "object") {
            var list = key;
            for (var key_i in list) {
                var value_i = list[key_i];                
                this.each(function (element,index,self) {
                    self._tq_strategy._tq_set_attr(element, key_i, value_i);
                });
            }            
        }
        return this;               
    },
    attributes: function (new_attrs_value) {
        if (arguments.length == 0) {
            return this._tq_strategy._tq_map_attr(this[0]);       
        }        
        return this.each(function (element,index,self) {
            self._tq_strategy._tq_set_map_attr(element, new_attrs_value);
        });
    },
    removeAttr: function (key) {
        return this.each(function (element,index,self) {
            self._tq_strategy._tq_remove_attr(element, key);
        });
    },
    children: function (selector) {
        console.assert(!selector || typeof selector == "string", arguments);
        var $selector = null;
        
        if (selector) {
            $selector = TreeQuery(selector);
        }
        var result = [];
        this.each(function (element, index, self) {
            var children = self._tq_strategy._tq_children(element);
            if ($selector) {
                // Esto se podría optimizar haciendo que el motor tenga una forma de chequear que un objeto concreto cumple con un query
                for (var i=0; i<$selector.length; i++) {
                    for (var j=0; j<children.length; j++) {
                        if ($selector[i] == children[j]) {
                            result.push(children[j]);
                        }
                    }
                }
            } else {
                result = result.concat(children);
            }
        });
        return TreeQuery(result);
    },
    remove: function () {
        return this.each(function (element,index,self) {
            self._tq_strategy._tq_remove(element);
        });
    },
    parent: function (selector) {
        console.assert(!selector || typeof selector == "string", arguments);
        var $selector = null;
        
        if (selector) {
            $selector = TreeQuery(selector);
        }
        var result = [];
        this.each(function (element, index, self) {
            var parent = self._tq_strategy._tq_parent(element);
            if ($selector) {
                // Esto se podría optimizar haciendo que el motor tenga una forma de chequear que un objeto concreto cumple con un query
                for (var i=0; i<$selector.length; i++) {
                    if ($selector[i] == parent) {
                        result.push(parent);
                    }
                }
            } else {
                result.push(parent);
            }
        });
        return TreeQuery(result);
    },
    clone: function () {
        var result = [];
        this.each(function (element, index, self) {
            var minime = self._tq_strategy._tq_clone(element);
            result.pus(minime);
        });
        return TreeQuery(result);        
    },
    append: function (target) {
        return this.each(function (element,index,self) {
            if (self._tq_strategy._tq_accepts(target)) {
                self._tq_strategy._tq_add_child(node, target);
            }
            if (target instanceof TreeQuery) {
                for (var i=0; i<target.length; i++) {                    
                    var elem = target[i];
                    console.assert(self._tq_strategy._tq_accepts(elem), elem);
                    if (!isNaN(index) && index!=self.length-1) {
                        elem = self._tq_strategy._tq_clone(elem);
                    }
                    self._tq_strategy._tq_add_child(element, elem);
                }
            }
            if (typeof target == "string") {
                self.append(TreeQuery(target));
            }
            
        });        
    },
    appendTo: function (content) {
        if (typeof content == "string") {
            content = new TreeQuery(content, this._tqGetDefaultContext());
        }
        
        return this.each(function (element,index,self) {
            if (self._tq_strategy._tq_accepts(content)) {
                self._tq_strategy._tq_add_child(content, element);
            }

            if (content instanceof TreeQuery) {
                for (var i=0; i<content.length; i++) {                    
                    var elem = content[i];
                    console.assert(self._tq_strategy._tq_accepts(elem), elem);
                    if (i==content.length-1) {
                        self._tq_strategy._tq_add_child(elem, element );
                    } else {
                        self._tq_strategy._tq_add_child(elem, self._tq_strategy._tq_clone(element));
                    }
                }                
            }
        });          
        
    },
    // ----------------------------------------------------------
    height: function (new_value) {        
        if (new_value) {
            if (typeof new_value == "number") {
                new_value = new_value + "px";
            } 
            return this.each(function (element,index,self) {
                self._tq_strategy._tq_height(element, new_value);
            });            
        } else {
           return this._tq_strategy._tq_height(this[0]);
        }
    },
    width: function (new_value) {
        if (new_value) {
            if (typeof new_value == "number") {
                new_value = new_value + "px";
            } 
            return this.each(function (element,index,self) {
                self._tq_strategy._tq_width(element, new_value);
            });            
        } else {
           return this._tq_strategy._tq_width(this[0]);
        }
    },
    
});