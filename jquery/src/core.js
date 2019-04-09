/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module

define( [
	"./var/arr",
	"./var/document",
	"./var/getProto",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/fnToString",
	"./var/ObjectFunctionString",
	"./var/support",
	"./var/isFunction",
	"./var/isWindow",
	"./core/DOMEval",
	"./core/toType"
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, isFunction, isWindow, DOMEval, toType ) {

"use strict";

var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
    // jQuery返回的实例是靠一个init()方法
    return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
  // Make sure we trim BOM and NBSP
  // 在trim中用用的
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  // 将jQuery.fn指向prototype，再向其中原型链上加入各参数与方法
jQuery.fn = jQuery.prototype = {

	// 当前版本
	jquery: version,
  // 指向的构造函数
	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,
  // 转数组后绑定的this
	toArray: function() {
		return slice.call( this );
	},
	// 通过index取到其中的第几个元素
	get: function( num ) {

		// 返回所有包含所有元素节点的新数组--->即返回一个原来的元素节点数组 
		if ( num == null ) {
			return slice.call( this );
		}
    // 如果是负index的情况则进行与数组节点元素的长度相加，否则直接取其元素
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// 入栈
	pushStack: function( elems ) {

		// uild a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},
  // 入栈slice切割出后堆入栈
	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
  },
  // first 和 last都是通过eq实现的
	first: function() {
		return this.eq( 0 );
	},
	last: function() {
		return this.eq( -1 );
	},
  // 传入取的那个index
	eq: function( i ) {
    var len = this.length,
      // + 是为了转为数字
      j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

// jQuery的extend函数的实现
jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,

		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// 判断是否深拷贝，当第一个参数为true时即为深拷贝
	if ( typeof target === "boolean" ) {
    // 将第一个boolean深拷贝的标志赋予deep
    deep = target;
    // 目标对象变为argument[ 1 ] 或者空
    target = arguments[ i ] || {};
    // i++
		i++; 
	}
  // 判断target是字符串或方法等情况
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}
  // 如果参数长度为1的时候，即也不复制
	if ( i === length ) {
		target = this;
		i--;
	}
	for ( ; i < length; i++ ) {
		// null/undefined的情况判断,从taiget后的参数开始遍历，非空情况下
		if ( ( options = arguments[ i ] ) != null ) {
			// 开始遍历----options是传入的args的每一个遍历
			for ( name in options ) {
        // 遍历一下其他的
        src = target[ name ];
				copy = options[ name ];
				// 防止结束
				if ( target === copy ) {
					continue;
				}
				// 深拷贝的情况下---是一个迭代的过程
				if ( deep && copy && ( jQuery.isPlainObject( copy ) || ( copyIsArray = Array.isArray( copy ) ) ) ) {
            // 拷贝对象为数组
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];
					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// 如果是数组或对象的情况，就迭代的extend进去
					target[ name ] = jQuery.extend( deep, clone, copy );

				// 如果不是undefined并且不是对象啥的，直接连上target对象
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

  // 报错
	error: function( msg ) {
		throw new Error( msg );
	},
  // 一个空函数，可充当空回调
	noop: function() {},

  // 检查对象是否普通对象
	isPlainObject: function( obj ) {
		var proto, Ctor;

    // 如果对象为空或者或者不为对象--->主要用于检查是否普通对象
    if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}
    // 取obj的原型对象，封装了getPrototypeOf()
		proto = getProto( obj );

		// 没有原型对象
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},
  // 检查对象是否为空
	isEmptyObject: function( obj ) {

		var name;
    // 经试验，为空时遍历会退出
		for ( name in obj ) {
			return false;
		}
		return true;
	},

  // 可以全局的执行JS脚本，相当与原生的的eval()
	globalEval: function( code ) {
		DOMEval( code );
	},
  // each方法，第一个参数是遍历的对象，后者是需要的回调函数
	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
      // 遍历obj，推入回调函数执行
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

  // 前后空格均替换去掉
	trim: function( text ) {
		return text == null ? "" : ( text + "" ).replace( rtrim, "" );
	},

	// 将类数组转为数组
	makeArray: function( arr, results ) {
    // 若非空，先置为数组
		var ret = results || [];
		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
        // 数组合并
				jQuery.merge( ret, typeof arr === "string" ? [ arr ] : arr);
			} else {
        // push入数组
				push.call( ret, arr );
			}
		}

		return ret;
	},

  // 查找位置
	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// 合并数组的操作方法，直接在first的后边接上
	merge: function( first, second ) {
    // 获取二待合并数组长度
    // 获取一将合并数组长度
		var len = +second.length,
			j = 0,
			i = first.length;
    // 遍历写入一数组
		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

  // 传入过滤函数callback过滤数组
  // 第三个参数的true 或者 false 是用于正向逆向选择的地方
  // 具体可以参看grep的使用方法
	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// map遍历
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
        // 返回执行后的结果
				value = callback( elems[ i ], i, arg );
        //  在非null的情况下，将其push入数组
				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

  // 判断object中是否有 length 这个键，并且读取其长度
  var length = !!obj && "length" in obj && obj.length,
  // 判断obj类型
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}
  //      为数组的类型        长度等于0         长度类型为数字              长度大于0         length-1要存在，即存在边界
	return type === "array" || length === 0 || typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

return jQuery;
} );
