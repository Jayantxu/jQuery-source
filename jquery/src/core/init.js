// Initialize a jQuery object
define( [
	"../core",
	"../var/document",
	"../var/isFunction",
	"./var/rsingleTag",

	"../traversing/findFilter"
], function( jQuery, document, isFunction, rsingleTag ) {

"use strict";

// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// 处理: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// rootjQuery = jQuery(document)
		root = root || rootjQuery;

		// 处理HTML的形式
		if ( typeof selector === "string" ) {
      // 将其拆分为数组的形式
			if ( selector[ 0 ] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
        // 
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
        // 用正则去匹配
				match = rquickExpr.exec( selector );
			}
      
			// 匹配HTML或确保为非#id的情况
			if ( match && ( match[ 1 ] || !context ) ) {

				// 处理: $(html) -> $(array),匹配转为数组 例如
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// 处理: $(html, props),如：$()
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// 匹配: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {

			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ? root.ready( selector ) :
        // Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// 将init.prototype=jQuery.fn = jQuery.prototype
init.prototype = jQuery.fn;

// 初始化这部分jQuery(document)
rootjQuery = jQuery( document );

return init;

} );
