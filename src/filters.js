TreeQuery.Filters = function (strategy) {
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
    return strategy._tq_tag_name(node).toLowerCase() == this._tagname;
}

TreeQuery.Filters.AttrValueFilter = function (str) {
    console.assert(typeof str == "string", str);
    if (str.indexOf("!=") != -1) {
        this._attr_name = str.split("!=")[0];
        this._attr_value = str.split("!=")[1];
        this._attr_op = "!=";
    } else if (str.indexOf("=") != -1) {
        this._attr_name = str.split("=")[0];
        this._attr_value = str.split("=")[1];
        this._attr_op = "=";
    } else {
        this._attr_name = str;
        this._attr_value = null;
        this._attr_op = null;
    }    
}
TreeQuery.Filters.AttrValueFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.AttrValueFilter.prototype.constructor = TreeQuery.Filters.AttrValueFilter
TreeQuery.Filters.AttrValueFilter.prototype.check = function (node, strategy) {    
    var map = strategy._tq_map_attr(node);    
    switch (this._attr_op) {
        case "!=":
            if (typeof map[this._attr_name] == "undefined") return false;
            if (map[this._attr_name] != this._attr_value) return true;
            break;
        case "=": 
            if (typeof map[this._attr_name] == "undefined") return false;
            if (map[this._attr_name] == this._attr_value) return true;
            break;
        case null:
            if (typeof map[this._attr_name] != "undefined") return true;
            break;
    }
    return false;
}


TreeQuery.Filters.IdFilter = function (id) {
    this._id = id.toLowerCase();    
}
TreeQuery.Filters.IdFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.IdFilter.prototype.constructor = TreeQuery.Filters.IdFilter
TreeQuery.Filters.IdFilter.prototype.check = function (node, strategy) {
    var id = strategy._tq_id(node);;
    return typeof id == "string" ? id.toLowerCase() == this._id : false;
}


TreeQuery.Filters.ClassFilter = function (classname) {
    this._classname = classname.toLowerCase(); 
}
TreeQuery.Filters.ClassFilter.prototype = new TreeQuery.Filters();
TreeQuery.Filters.ClassFilter.prototype.constructor = TreeQuery.Filters.ClassFilter
TreeQuery.Filters.ClassFilter.prototype.check = function (node, strategy) {
    var list = strategy._tq_class(node);
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

