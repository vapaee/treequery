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
            MODIFIER = /:(\w+)/,
            ATTRIBS_4 = /\[(.+)\]\[(.+)\]\[(.+)\]\[(.+)\]/,
            ATTRIBS_3 = /\[(.+)\]\[(.+)\]\[(.+)\]/,
            ATTRIBS_2 = /\[(.+)\]\[(.+)\]/,
            ATTRIBS_1 = /\[(.+)\]/;
        
        var parts, tagname, id, class_list, modifier, modif_func, aster, attrs;
        
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
            var parts = selector.match(FUNCTION);
            modif_func = parts[1];
        } else if (MODIFIER.test(selector)) {
            // [":hover", "hover"]
            var parts = selector.match(MODIFIER);
            modifier = parts[1];
        } else if (ATTRIBS_4.test(selector)) {
            attrs = selector.match(ATTRIBS_4);
            attrs.splice(0,1);            
        } else if (ATTRIBS_3.test(selector)) {
            attrs = selector.match(ATTRIBS_3);
            attrs.splice(0,1);
        } else if (ATTRIBS_2.test(selector)) {
            attrs = selector.match(ATTRIBS_2);
            attrs.splice(0,1);
        } else if (ATTRIBS_1.test(selector)) {
            attrs = selector.match(ATTRIBS_1);
            attrs.splice(0,1);
        }
        
        // console.log(selector, "-->", tagname, id, class_list);
        
        var filter = new TreeQuery.Filters(strategy);
        
        if (aster) {
            filter.append(new TreeQuery.Filters.AsterFilter())
        }
        if (attrs) {
            console.debug("attrs: ", attrs);
            tagname = tagname.split("[")[0];
            for (var i=0; i<attrs.length; i++) {                
                filter.append(new TreeQuery.Filters.AttrValueFilter(attrs[i]))
            }
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