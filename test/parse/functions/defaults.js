({

/** function f(a = delete x) { "use strict"; } **/
"default expressions have the strictness of thier function": {},

/** function f(a = 
        function(b = 
            function(eval) {}
        ) {}
    ) { "use strict" } **/
"nested default scopes inherit strictness (1)": {},

/** function f(a = 
        function(b = 
            function() { delete x }
        ) {}
    ) { "use strict" } **/
"nested default scopes inherit strictness (2)": {},

/** function f(a = 
        function(b = 
            function() { x; delete x }
        ) {}
    ) { "use strict" } **/
"nested default scopes inherit strictness (3)": {},

})