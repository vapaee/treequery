
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
