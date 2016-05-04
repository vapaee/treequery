TreeQuery._tq_register_stratgy("js-object", {
    accepts: function (node) {
        // reorna true si el node es del tipo que implementa esta estrategia
        return false;
    },
    _tq_class: function (node, new_class_value) {
        // if new_class_value is passed then the class of the node is setted.
        // Otherwise returns the current class value of the node
    },
    _tq_add_class: function (node, classname) {},
    _tq_remove_class: function (node, classname) {},
    _tq_has_class: function (node, classname) {
        console.assert(this._tq_accepts(node), node);
    },

    _tq_set_attr: function (node) {},
    _tq_map_attr: function (new_attrs_value) {
        // if new_attrs_value is passed then the attribute list of the node is replaced.
        // Otherwise returns the current node's attribute list
    },
    _tq_remove_attr: function (node) {},

    _tq_children: function (node) {
    },
    _tq_remove: function (node) {},
    _tq_add_child: function (node) {},
    _tq_remove_child: function (node) {},
    _tq_parent: function (node, current_parent) {
        // if current_parent is passed then the parent is seted to this obj
        // Otherwise returns the current node's parent (if any) 
    },
    _tq_tag_name: function (node) {
        // returns the tag name of the node
    },
    _tq_id: function (node, new_id) {
        // if new_id is passed then the node's id is seted.
        // Otherwise returns the current node's id
    },
});