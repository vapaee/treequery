QUnit.test("test html strategy", function( assert ) {
    
    document.body.innerHTML += "<style>.otra_clase { background-color: green; }</style>";
    document.body.innerHTML += "<style>.color_rojo { background-color: red; }</style>";
    
    var area = document.getElementById("test-area");
        area.innerHTML = '\
            <div class="hola">(hola)</div>\
            <div id="padre" coso="mi coso">\
                <div id="pepe" class="coso lololo">\
                    <p>texto_A</p>\
                    <p>texto_B</p>\
                </div>\
                <div id="acurate"><p>texto_1</p><p>texto_2</p><p>texto_3</p><p>texto_4</p></div>\
                <div id="lola" class="coso lala">\
                    <span id="palabra" class="texto">\
                        <p>texto_1</p>\
                        <p>texto_2</p>\
                        <p>texto_3</p>\
                        <p>texto_4</p>\
                    </span>\
                </div>\
            </div>\
        ';
    
    
    
    // -- actions
    query = "div.coso.lala";
    $target = $(query, area);
    console.log([query, $target]);
    $target.addClass("otra_clase");
    // -- assertions
    assert.equal($target.length, 1, query);
    assert.equal($target.hasClass("otra_clase"), true, query);
    
    // -- actions
    query = ".otra_clase";
    $target = $(query, area);
    console.log([query, $target]);
    $target.removeClass("otra_clase").addClass("another");
    // -- assertions
    assert.equal($target.length, 1, query);
    assert.equal($(query, area).length, 0, query);
    assert.equal($target.hasClass("otra_clase"), false, query);
    assert.equal($target.hasClass("another"), true, query);
    
    // -- actions
    query = ".coso";
    $target = $(query, area);
    console.log([query, $target]);
    $target.removeClass("coso").addClass("AAAAA");
    // -- assertions
    assert.equal($target.length, 2, query);
    assert.equal($(query, area).length, 0, query);
    assert.equal($(".AAAAA", area).hasClass("coso"), false, query);
    assert.equal($(".AAAAA", area).length, 2, query);
    
    // -- actions
    query = "#padre";
    $target = $(query, area);
    console.log([query, $target]);
    $target.attr("attr_1", "valor_1").attr("attr_2", "valor_2").removeAttr("coso");
    // -- assertions
    assert.equal($target.attr("attr_1"), "valor_1", query);
    assert.equal($target.attr("coso"), undefined, query);
    
    // -- actions
    query = "#acurate";
    $target = $(query, area);
    console.log([query, $target]);
    $target.attr({attr_1:"valor_1", attr_2:"valor_2"});
    // -- assertions
    assert.equal($target.attr("attr_1"), "valor_1", query);
    assert.equal($target.attr("attr_2"), "valor_2", query);    
    assert.equal($target.attr("id"), "acurate", query);
    
    // -- actions
    query = "#lola";
    $target = $(query, area);
    console.log([query, $target]);
    $target.attr({attr_1:"valor_1", attr_2:"valor_2"});
    // -- assertions
    assert.equal($target.attr("attr_1"), "valor_1", query);
    assert.equal($target.attr("attr_2"), "valor_2", query);    
    assert.equal($target.attr("id"), "lola", query);
    
    // -- actions
    query = "p";
    $target = $(query, area);
    console.log([query, $target]);
    $target.addClass("color_rojo");
    // -- assertions
    assert.equal($target.length, 10, query);

    
    // -- actions
    query = ".hola";
    var $target  = $(query);
    var padre = $("#padre");
    console.log([query, $target]);
    $target[0]._akitoy_ = "hola";
    padre.append($target);
    // -- assertions    
    assert.equal($target[0]._akitoy_, "hola", ".hola");
    assert.equal($(".hola")[0]._akitoy_, "hola", ".hola");
    assert.equal($("#padre .hola")[0]._akitoy_, "hola", "#padre .hola");

    // -- actions
    query = ".hola";
    var $target  = $(query);
    var p = $("#test-area p");
    console.log([query, $target]);
    $target[0]._akitoy_ = "hola";
    p.append($target);
    // -- assertions    
    assert.equal($target[0]._akitoy_, "hola", query);
    assert.equal($(query)[0]._akitoy_, undefined, query);
    assert.equal($(query)[9]._akitoy_, "hola", query);
    assert.equal($(query).length, 10, query);  
    // -----------

    // -- actions
    query = ".hola";
    var $target  = $(query);
    console.log([query, $target]);
    $target.remove();
    // -- assertions    
    assert.equal($(query).length, 0, query);  
    // -----------
    
    // -- actions
    query = "<div>*</div>";
    var $target  = $(query);
    console.log([query, $target]);
    $target.appendTo("#test-area").addClass("hola");
    // -- assertions    
    assert.equal($(".hola").length, 1, ".hola");
    assert.equal($("#test-area .hola").length, 1, "#test-area .hola");
    // -----------
    
    // -- actions
    query = ".hola";
    var $target  = $(query);
    console.log([query, $target]);
    $target.css({
        "background-color": "magenta",
        "position": "absolute"
    });
    // -- assertions    
    assert.equal($target.css("background-color"), "magenta", "background-color: magenta"); 
    // -----------
    
    // -- actions
    query = ".hola";
    var $target  = $(query);
    console.log([query, $target]);
    $target.offset({
        "top": "10px",
        "left": "10px"
    });
    // -- assertions    
    assert.equal($target.offset().top, 10, "background-color: magenta"); 
    // -----------
    
    // -- actions
    query = "#palabra p";
    var $target  = $(query);
    console.log([query, $target]);
    $target.removeClass("color_rojo");
    // -- assertions    
    assert.equal($target.hasClass("color_rojo"), false, "color_rojo");    
    // -----------
    
    // -- actions
    query = "#palabra p";
    var $target  = $(query);
    console.log([query, $target]);
    $target.css("background-color", "yellow");
    // -- assertions    
    assert.equal($target.css("background-color"), "yellow", "background-color: green");    
    // -----------
    
    // -- actions
    query = "#palabra";
    var $target  = $(query);
    console.log([query, $target]);
    $target.css({"background-color": "green"});
    // -- assertions    
    assert.equal($target.css("background-color"), "green", "background-color: green");    
    // -----------


    
    
});
