TreeQuery.Factory = {
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
}