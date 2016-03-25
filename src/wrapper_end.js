
    if ( typeof define === "function" && define.amd ) {
        define([], function () {return TreeQuery; } );
    } else {
        window.$ = TreeQuery;
        window.TreeQuery = TreeQuery;
    }

})();