

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
        return TreeQuery(result, $target._tq_context);
    },    
    find: function ($target) {
        var result = [];
        var filter = TreeQuery.Factory.getFilter($target._tq_selector, $target._tq_strategy);
        var list = $target.map(function (a) { return a; });                
        while (list.length > 0) {
            var obj = list.splice(0,1)[0];
            var children = $target._tq_strategy._tq_children(obj);
            for (var index in children) {
                list.push(children[index]); // future revision
                if ( filter.check(children[index]) ) {
                    result.push(children[index]);
                }
            }
        }
        return TreeQuery(result, $target._tq_context);
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
            return TreeQuery(result, $target._tq_context);
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
            var children = $target._tq_strategy._tq_children(obj);
            result = result.concat(children);
        }
        return TreeQuery(result, $target._tq_context);
    },
    cache: {}
}
