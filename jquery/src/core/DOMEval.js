define( [
	"../var/document"
], function( document ) {
	"use strict";

	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

  // 接收一段code代码
	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
    }
    // 在document中插入的script进行执行,全局性的,因为 globalEval 没有传入doc
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
