({

/** 'hello\nworld'; **/
'newlines are escaped': `'hello\\nworld';`,

/** /foobar/; **/
'regex - basic': '/foobar/;',

/** /foo\/bar/; **/
'regex - escaped forward slash': '/foo\\/bar/;',

/** /foo[/]bar/; **/
'regex - not escaped forward slash': '/foo[\\/]bar/;',

})
