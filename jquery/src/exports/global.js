define( [
	"../core"
], function( jQuery, noGlobal ) {

"use strict";

var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

  // 此函数用于将jQuery转为我们自定的函数
jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}
  // 判断
	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}
  // 返回一个jQuery对象
	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
if ( !noGlobal ) {
	window.jQu.$ = jQuery;
}

} );
