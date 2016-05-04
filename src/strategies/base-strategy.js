// ----------------------------------------------

var error_text = "ERROR: 'XXX' function must be overwritten";
function BaseStrategy(selector, context) {}

BaseStrategy.prototype = {};
BaseStrategy.prototype.constructor = BaseStrategy;

function Strategy(name) { this._tg_strategy = name; }
Strategy.prototype = new BaseStrategy();
Strategy.prototype.constructor = Strategy;

// -------------------------------

BaseStrategy.prototype._tq_accepts = function (node) {
    // reorna true si el node es del tipo que implementa esta estrategia
    console.error(error_text.replace("XXX", "check"));
    return false;
}

/*
BaseStrategy.prototype.eq = function (index) {
    return this[index];
}
    

BaseStrategy.prototype.is = function (node, selection) {
    console.assert(false, "TreeQuery.BaseStrategy.is NOT IMPLEMENTED YET");
    return $();
}
   
BaseStrategy.prototype.next = function () {
    // https://api.jquery.com/next/
    // Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
    console.assert(false, "TreeQuery.BaseStrategy.next NOT IMPLEMENTED YET");
    return false;
}
    */
BaseStrategy.prototype._tq_class = function (node, new_class_value) {
    // if new_class_value is passed then the class of the node is setted.
    // Otherwise returns the current class value of the node
    console.error(error_text.replace("XXX", "_tq_class"));
}

BaseStrategy.prototype._tq_add_class = function (node) {
    console.error(error_text.replace("XXX", "_tq_add_class"));
}

BaseStrategy.prototype._tq_remove_class = function (node) {
    console.error(error_text.replace("XXX", "_tq_remove_class"));
}

BaseStrategy.prototype._tq_has_class = function (node) {
    console.error(error_text.replace("XXX", "_tq_has_class"));
}

BaseStrategy.prototype._tq_map_attr = function (node, new_attrs_value) {
    console.error(error_text.replace("XXX", "_tq_map_attr"));
}

BaseStrategy.prototype._tq_get_attr = function (node, key) {
    console.error(error_text.replace("XXX", "_tq_get_attr"));
}

BaseStrategy.prototype._tq_set_attr = function (node, key, value) {
    console.error(error_text.replace("XXX", "_tq_set_attr"));
}

BaseStrategy.prototype._tq_remove_attr = function (node, key) {
    console.error(error_text.replace("XXX", "_tq_remove_attr"));
}

BaseStrategy.prototype._tq_children = function (node) {
    console.error(error_text.replace("XXX", "_tq_children"));
}

BaseStrategy.prototype._tq_remove = function (node) {
    console.error(error_text.replace("XXX", "_tq_remove"));
}

BaseStrategy.prototype._tq_add_child = function (node) {
    console.error(error_text.replace("XXX", "_tq_add_child"));
}


BaseStrategy.prototype._tq_remove_child = function (node) {
    console.error(error_text.replace("XXX", "_tq_remove_child"));
}

BaseStrategy.prototype._tq_clone = function (node) {
    console.error(error_text.replace("XXX", "_tq_clone"));
}

BaseStrategy.prototype._tq_parent = function (node, current_parent) {
    // if current_parent is passed then the parent is seted to this obj
    // Otherwise returns the current node's parent (if any) 
    console.error(error_text.replace("XXX", "_tq_parent"));
}

BaseStrategy.prototype._tq_tag_name = function (node) {
    // returns the tag name of the node
    console.error(error_text.replace("XXX", "_tq_tag_name"));
}

BaseStrategy.prototype._tq_id = function (node, new_id) {
    // if new_id is passed then the node's id is seted.
    // Otherwise returns the current node's id
    console.error(error_text.replace("XXX", "_tq_id"));
};

// ----------------------------------------------
