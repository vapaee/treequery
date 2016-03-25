// ----------------------------------------------

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
