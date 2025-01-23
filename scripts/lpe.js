(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lpe"] = factory();
	else
		root["lpe"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 110:
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 387:
/***/ ((module) => {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 184:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_656__) => {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __nested_webpack_require_656__(574)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __nested_webpack_require_656__(341)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 228:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_1059__) => {

var isObject = __nested_webpack_require_1059__(305);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 464:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_1307__) => {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __nested_webpack_require_1307__(221);
var toLength = __nested_webpack_require_1307__(485);
var toAbsoluteIndex = __nested_webpack_require_1307__(157);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 89:
/***/ ((module) => {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 94:
/***/ ((module) => {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 52:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_2635__) => {

// optional / simple context binding
var aFunction = __nested_webpack_require_2635__(387);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 344:
/***/ ((module) => {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 763:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_3456__) => {

// Thank's IE8 for his funny defineProperty
module.exports = !__nested_webpack_require_3456__(448)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 34:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_3737__) => {

var isObject = __nested_webpack_require_3737__(305);
var document = (__nested_webpack_require_3737__(526).document);
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 140:
/***/ ((module) => {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ 127:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_4332__) => {

var global = __nested_webpack_require_4332__(526);
var core = __nested_webpack_require_4332__(94);
var hide = __nested_webpack_require_4332__(341);
var redefine = __nested_webpack_require_4332__(859);
var ctx = __nested_webpack_require_4332__(52);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 448:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 461:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_6199__) => {

module.exports = __nested_webpack_require_6199__(556)('native-function-to-string', Function.toString);


/***/ }),

/***/ 526:
/***/ ((module) => {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 917:
/***/ ((module) => {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 341:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_6964__) => {

var dP = __nested_webpack_require_6964__(967);
var createDesc = __nested_webpack_require_6964__(996);
module.exports = __nested_webpack_require_6964__(763) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 308:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_7340__) => {

var document = (__nested_webpack_require_7340__(526).document);
module.exports = document && document.documentElement;


/***/ }),

/***/ 956:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_7540__) => {

module.exports = !__nested_webpack_require_7540__(763) && !__nested_webpack_require_7540__(448)(function () {
  return Object.defineProperty(__nested_webpack_require_7540__(34)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 249:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_7835__) => {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __nested_webpack_require_7835__(89);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 305:
/***/ ((module) => {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 32:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_8378__) => {

"use strict";

var create = __nested_webpack_require_8378__(719);
var descriptor = __nested_webpack_require_8378__(996);
var setToStringTag = __nested_webpack_require_8378__(844);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__nested_webpack_require_8378__(341)(IteratorPrototype, __nested_webpack_require_8378__(574)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ 175:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_8998__) => {

"use strict";

var LIBRARY = __nested_webpack_require_8998__(750);
var $export = __nested_webpack_require_8998__(127);
var redefine = __nested_webpack_require_8998__(859);
var hide = __nested_webpack_require_8998__(341);
var Iterators = __nested_webpack_require_8998__(906);
var $iterCreate = __nested_webpack_require_8998__(32);
var setToStringTag = __nested_webpack_require_8998__(844);
var getPrototypeOf = __nested_webpack_require_8998__(627);
var ITERATOR = __nested_webpack_require_8998__(574)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ 970:
/***/ ((module) => {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ 906:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 750:
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ 719:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_12154__) => {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __nested_webpack_require_12154__(228);
var dPs = __nested_webpack_require_12154__(626);
var enumBugKeys = __nested_webpack_require_12154__(140);
var IE_PROTO = __nested_webpack_require_12154__(766)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __nested_webpack_require_12154__(34)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  (__nested_webpack_require_12154__(308).appendChild)(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ 967:
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_13757__) => {

var anObject = __nested_webpack_require_13757__(228);
var IE8_DOM_DEFINE = __nested_webpack_require_13757__(956);
var toPrimitive = __nested_webpack_require_13757__(48);
var dP = Object.defineProperty;

exports.f = __nested_webpack_require_13757__(763) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 626:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_14443__) => {

var dP = __nested_webpack_require_14443__(967);
var anObject = __nested_webpack_require_14443__(228);
var getKeys = __nested_webpack_require_14443__(311);

module.exports = __nested_webpack_require_14443__(763) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ 627:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_14940__) => {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __nested_webpack_require_14940__(917);
var toObject = __nested_webpack_require_14940__(270);
var IE_PROTO = __nested_webpack_require_14940__(766)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ 561:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_15534__) => {

var has = __nested_webpack_require_15534__(917);
var toIObject = __nested_webpack_require_15534__(221);
var arrayIndexOf = __nested_webpack_require_15534__(464)(false);
var IE_PROTO = __nested_webpack_require_15534__(766)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 311:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_16167__) => {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __nested_webpack_require_16167__(561);
var enumBugKeys = __nested_webpack_require_16167__(140);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ 996:
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 859:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_16688__) => {

var global = __nested_webpack_require_16688__(526);
var hide = __nested_webpack_require_16688__(341);
var has = __nested_webpack_require_16688__(917);
var SRC = __nested_webpack_require_16688__(415)('src');
var $toString = __nested_webpack_require_16688__(461);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

(__nested_webpack_require_16688__(94).inspectSource) = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ 844:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_17854__) => {

var def = (__nested_webpack_require_17854__(967).f);
var has = __nested_webpack_require_17854__(917);
var TAG = __nested_webpack_require_17854__(574)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ 766:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_18226__) => {

var shared = __nested_webpack_require_18226__(556)('keys');
var uid = __nested_webpack_require_18226__(415);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ 556:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_18489__) => {

var core = __nested_webpack_require_18489__(94);
var global = __nested_webpack_require_18489__(526);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __nested_webpack_require_18489__(750) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ 157:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_19021__) => {

var toInteger = __nested_webpack_require_19021__(87);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 87:
/***/ ((module) => {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 221:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_19542__) => {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __nested_webpack_require_19542__(249);
var defined = __nested_webpack_require_19542__(344);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 485:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_19858__) => {

// 7.1.15 ToLength
var toInteger = __nested_webpack_require_19858__(87);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 270:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_20165__) => {

// 7.1.13 ToObject(argument)
var defined = __nested_webpack_require_20165__(344);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ 48:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_20392__) => {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __nested_webpack_require_20392__(305);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 415:
/***/ ((module) => {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 574:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_21349__) => {

var store = __nested_webpack_require_21349__(556)('wks');
var uid = __nested_webpack_require_21349__(415);
var Symbol = (__nested_webpack_require_21349__(526).Symbol);
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ 165:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_21817__) => {

"use strict";

var addToUnscopables = __nested_webpack_require_21817__(184);
var step = __nested_webpack_require_21817__(970);
var Iterators = __nested_webpack_require_21817__(906);
var toIObject = __nested_webpack_require_21817__(221);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __nested_webpack_require_21817__(175)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ 890:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nested_webpack_require_23037__) => {

var $iterators = __nested_webpack_require_23037__(165);
var getKeys = __nested_webpack_require_23037__(311);
var redefine = __nested_webpack_require_23037__(859);
var global = __nested_webpack_require_23037__(526);
var hide = __nested_webpack_require_23037__(341);
var Iterators = __nested_webpack_require_23037__(906);
var wks = __nested_webpack_require_23037__(574);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_25117__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_25117__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_25117__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_25117__.o(definition, key) && !__nested_webpack_require_25117__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_25117__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_25117__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nested_webpack_require_25117__.r(__nested_webpack_exports__);

// EXPORTS
__nested_webpack_require_25117__.d(__nested_webpack_exports__, {
  LPESyntaxError: () => (/* reexport */ LPESyntaxError),
  STDLIB: () => (/* reexport */ STDLIB),
  deparse: () => (/* reexport */ deparse),
  eval_lisp: () => (/* reexport */ eval_lisp),
  eval_lpe: () => (/* binding */ eval_lpe),
  isArray: () => (/* reexport */ isArray),
  isFunction: () => (/* reexport */ isFunction),
  isHash: () => (/* reexport */ isHash),
  isNumber: () => (/* reexport */ isNumber),
  isString: () => (/* reexport */ isString),
  makeSF: () => (/* reexport */ makeSF),
  parse: () => (/* reexport */ parse),
  unbox: () => (/* reexport */ unbox)
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __nested_webpack_require_25117__(890);
;// CONCATENATED MODULE: ./src/lisp.js

/**
 *  miniMAL lisp interpreter
 *  Copyright (C) 2014 Joel Martin
 *  Licensed under MPL 2.0
 *  https://github.com/kanaka/mal
 *
 */
/**
 *  The code has been reworked to suite LuxmsBI needs
 *  by esix & Dmitry Dorofeev
 *  2017-2019
 */



/**
 * @typedef {Object} EvalOptions
 * @property {boolean=} resolveString Would proceed variables to their names <br>`lpe 'x' -> string 'x' (if x is not defined)`
 * @property {any=} streamAdapter Is there any streaming library so lpe can use it
 * @property {boolean=} squareBrackets Should `[Square Brackets]` be interpreted as string
 */

const isArray = arg => Object.prototype.toString.call(arg) === '[object Array]';
const isString = arg => typeof arg === 'string';
const isNumber = arg => typeof arg === 'number';
const isBoolean = arg => arg === true || arg === false;
const isHash = arg => typeof arg === 'object' && arg !== null && !isArray(arg);
const isFunction = arg => typeof arg === 'function';

/**
 * Get or Set variable in context
 * @param {*} ctx - array, hashmap or function that stores variables
 * @param {*} varName - the name of variable
 * @param {*} value - optional value to set (undefined if get)
 * @param {EvalOptions=} resolveOptions - options on how to resolve. resolveString - must be checked by caller and is not handled here...
 */
function $var$(ctx, varName, value, resolveOptions = {}) {
  if (isArray(ctx)) {
    // contexts chain
    for (let theCtx of ctx) {
      const result = $var$(theCtx, varName, value, resolveOptions);
      if (result === undefined) continue; // no such var in context
      if (value === undefined) return result; // get => we've got a result
      return $var$(theCtx, varName, value, resolveOptions); // set => redirect 'set' to context with variable.
    }
    if (value === undefined) return undefined; // get => variable not found in all contexts
    if (ctx.length) $var$(ctx[0], varName, value, resolveOptions); // set => set variable to HEAD context
    return undefined; // ??? ctx.length = 0
  }
  if (isFunction(ctx)) {
    return ctx(varName, value, resolveOptions);
  }
  if (isHash(ctx)) {
    if (value === undefined) {
      // get from hash
      const result = ctx[varName];
      //console.log(`$var: for ${varName} got ${isFunction(result)? 'FUNC' : result}`)
      if (result !== undefined) {
        // found value in hash
        return result;
      }
      if (varName.substr(0, 3) !== 'sf:' && isFunction(ctx['sf:' + varName])) {
        // user-defined special form
        return makeSF(ctx['sf:' + varName]);
      }
      return undefined;
    } else {
      return ctx[varName] = value;
    }
  }
  return undefined;
}
function makeMacro(fn, ast) {
  fn.ast = ast || [[], {}, [], 1]; // mark as macro
  return fn;
}
function isMacro(fn) {
  if (!isFunction(fn)) return false;
  if (!isArray(fn.ast)) return false;
  return !!fn.ast[3];
}
function makeSF(fn) {
  fn.__isSpecialForm = true;
  return fn;
}
function isSF(fn) {
  if (!isFunction(fn)) return false;
  return !!fn.__isSpecialForm;
}
function makeLetBindings(ast, ctx, rs) {
  let result = {};
  if (isHash(ast)) {
    for (let varName in ast) {
      result[varName] = EVAL(ast[varName], ctx, rs);
    }
  } else if (isArray(ast) && isString(ast[0])) {
    if (ast[0] === '[') {
      ast = ast.slice(1);
    }
    if (isString(ast[0])) {
      result[ast[0]] = EVAL(ast[1], ctx, rs);
    } else if (isArray(ast[0])) {
      ast.forEach(pair => pair[0] === '[' ? result[pair[1]] = EVAL(pair[2], ctx, rs) : result[pair[0]] = EVAL(pair[1], ctx, rs));
    } else {
      throw new Error('LISP: let expression (1) invalid form in ' + ast);
    }
  } else if (isArray(ast)) {
    ast.forEach(pair => pair[0] === '[' ? result[pair[1]] = EVAL(pair[2], ctx, rs) : result[pair[0]] = EVAL(pair[1], ctx, rs));
  } else if (isFunction(ast)) {
    return ast;
  } else {
    throw new Error('LISP: let expression (2) invalid form in ' + ast);
  }
  return result;
}

// if (condition, then, else)
// if (condition, then, condition2, then2, ..., else)
const ifSF = (ast, ctx, options) => {
  if (ast.length === 0) return undefined;
  if (ast.length === 1) return EVAL(ast[0], ctx, options); // one arg - by convention return the argument
  const condition = EVAL(ast[0], ctx, {
    ...options,
    resolveString: false
  });
  return unbox([condition], ([condition]) => {
    if (condition) {
      return EVAL(ast[1], ctx, options);
    } else {
      return ifSF(ast.slice(2), ctx, options);
    }
  }, options === null || options === void 0 ? void 0 : options.streamAdapter);
};

/**
 * Рекурсивный begin
 */
const beginSF = (ast, ctx, options) => {
  if (ast.length === 0) return null;
  const firstOperator = EVAL(ast[0], ctx, options);
  return unbox([firstOperator], ([firstResult]) => ast.length === 1 ? firstResult : beginSF(ast.slice(1), ctx, options), // Если один аргумент - возвращаем значение
  options === null || options === void 0 ? void 0 : options.streamAdapter);
};
const SPECIAL_FORMS = {
  // built-in special forms
  'let': makeSF((ast, ctx, rs) => EVAL(['begin', ...ast.slice(1)], [makeLetBindings(ast[0], ctx, rs), ctx], rs)),
  '`': makeSF((ast, ctx) => ast[0]),
  // quote
  'macroexpand': makeSF(macroexpand),
  'begin': makeSF(beginSF),
  'do': makeSF((ast, ctx) => {
    throw new Error('DO not implemented');
  }),
  'if': makeSF(ifSF),
  '~': makeSF((ast, ctx, rs) => {
    // mark as macro
    const f = EVAL(ast[0], ctx, rs); // eval regular function
    f.ast.push(1); // mark as macro
    return f;
  }),
  '.-': makeSF((ast, ctx, options) => {
    // get or set attribute
    let [obj, propertyName, value] = ast.map(a => EVAL(a, ctx, options));
    // hack
    if (propertyName === undefined && isString(ast[1])) {
      // string propertyName tried to evaluate in rs context
      propertyName = ast[1];
    }
    return unbox([obj, propertyName, value], ([obj, propertyName, value]) => {
      try {
        return value !== undefined ? obj[propertyName] = value : obj[propertyName];
      } catch (err) {
        return value; // undefined when 'get'
      }
    }, options === null || options === void 0 ? void 0 : options.streamAdapter);
  }),
  '.': makeSF((ast, ctx, rs) => {
    // call object method
    const [obj, methodName, ...args] = ast.map(a => EVAL(a, ctx, rs));
    const fn = obj[methodName];
    return fn.apply(obj, args);
  }),
  'try': makeSF((ast, ctx, rs) => {
    // try/catch
    try {
      return EVAL(ast[0], ctx, rs);
    } catch (e) {
      const errCtx = env_bind([ast[1][0]], ctx, [e]);
      return EVAL(ast[1][1], errCtx, rs);
    }
  }),
  '||': makeSF((ast, ctx, rs) => ast.some(a => !!EVAL(a, ctx, rs))),
  // logical or
  '&&': makeSF((ast, ctx, rs) => ast.every(a => !!EVAL(a, ctx, rs))),
  // logical and
  'fn': makeSF((ast, ctx, rs) => {
    // define new function (lambda)
    const f = (...args) => EVAL(ast[1], env_bind(ast[0], ctx, args), rs);
    f.ast = [ast[1], ctx, ast[0]]; // f.ast compresses more than f.data
    return f;
  }),
  'def': makeSF((ast, ctx, rs) => {
    // update current environment
    const value = EVAL(ast[1], ctx, rs);
    const result = $var$(ctx, ast[0], value);
    return result;
  }),
  'resolve': makeSF((ast, ctx, rs) => {
    const result = $var$(ctx, ast[0], undefined, rs);
    return result;
  }),
  'eval_lpe': makeSF((ast, ctx, options) => {
    const lpeCode = eval_lisp(ast[0], ctx, options);
    const lisp = parse(lpeCode, options);
    const result = eval_lisp(lisp, ctx);
    return result;
  }),
  'filterit': makeSF((ast, ctx, rs) => {
    //console.log("FILTERIT: " + JSON.stringify(ast))
    const array = eval_lisp(ast[0], ctx, rs);
    const conditionAST = ast[1];
    const result = Array.prototype.filter.call(array, (it, idx) => !!eval_lisp(conditionAST, [{
      it,
      idx
    }, ctx], rs));
    return result;
  }),
  'mapit': makeSF((ast, ctx, rs) => {
    const array = eval_lisp(ast[0], ctx, rs);
    const conditionAST = ast[1];
    const result = Array.prototype.map.call(array, (it, idx) => eval_lisp(conditionAST, [{
      it,
      idx
    }, ctx], rs));
    return result;
  }),
  'get_in': makeSF((ast, ctx, rs) => {
    let array = [];
    let hashname;
    //console.log(JSON.stringify(ast))
    if (isArray(ast[0])) {
      hashname = eval_lisp(ast[0], ctx, rs);
    } else {
      hashname = ast[0];
    }
    if (isArray(ast[1]) && ast[1][0] === '[') {
      // массив аргументов, ка в классическом get_in в Clojure
      array = eval_lisp(ast[1], ctx, rs);
    } else {
      // просто список ключей в виде аргументов
      [, ...array] = ast;
      const a = ["["].concat(array);
      array = eval_lisp(a, ctx, rs);
    }

    // но вообще-то вот так ещё круче ["->","a",3,1]
    // const m = ["->"].concat( array.slice(1).reduce((a, b) => {a.push([".-",b]); return a}, [[".-", ast[0], array[0]]]) );
    const m = ["->", hashname].concat(array);
    //console.log('get_in', JSON.stringify(m))
    return eval_lisp(m, ctx, rs);
  }),
  'assoc_in': makeSF((ast, ctx, rs) => {
    const array = eval_lisp(ast[1], ctx, {
      ...rs,
      wantCallable: false
    });
    // удивительно, но работает set(a . 3 , 2, "Hoy")
    //const m = ["->", ast[0]].concat( array.slice(0,-1) );
    //const e = ["set", m, array.pop(), ast[2]]
    // первый аргумент в ast - ссылка на контекст/имя переменной
    //console.log('assoc_in var:', JSON.stringify(ast))
    // let focus = $var$(ctx, ast[0], undefined, {...rs, wantCallable: false});
    let focus = EVAL(ast[0], ctx, {
      ...rs,
      wantCallable: false
    });
    for (var i = 0; i < array.length - 1; i++) {
      if (focus[array[i]] === undefined) {
        // нужно создать
        if (isString(array[i + 1])) {
          focus = focus[array[i]] = {};
        } else {
          focus = focus[array[i]] = [];
        }
      } else {
        focus = focus[array[i]];
      }
    }
    const e = ["set", focus, array.pop(), ast[2]];
    //console.log(JSON.stringify(e), JSON.stringify(eval_lisp(e, ctx, rs)))
    return eval_lisp(e, ctx, rs);
  }),
  'cp': makeSF((ast, ctx, rs) => {
    const from = EVAL(ast[0], ctx, {
      ...rs,
      wantCallable: false
    });
    const to = EVAL(ast[1], ctx, {
      ...rs,
      wantCallable: false
    });
    //console.log(`CP ${JSON.stringify(from)} to `, JSON.stringify(to))
    const lpe = ["assoc_in", to[0], ["["].concat(to.slice(1)), ["get_in", from[0], ["["].concat(from.slice(1))]];
    //console.log('CP', JSON.stringify(ast))
    return EVAL(lpe, ctx, rs);
  }),
  'ctx': makeSF((ast, ctx, rs) => {
    //FIXME will work only for single keys, we want: ctx(k1,k2,k3.df)
    let ret = {};
    ast.map(k => ret[k] = $var$(ctx, k, undefined, rs));
    return ret;
  })
};
const STDLIB = {
  // built-in constants
  '#t': true,
  '#f': false,
  'NIL': null,
  'null': null,
  // js specific
  'true': true,
  'false': false,
  'Array': Array,
  // TODO: consider removing these properties
  'Object': Object,
  'Hashmap': {},
  'Date': Date,
  'console': console,
  'JSON': JSON,
  // special forms
  ...SPECIAL_FORMS,
  // built-in functions
  '=': (...args) => args.every(v => v == args[0]),
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.length === 1 ? -args[0] : args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.length === 1 ? 1 / args[0] : args.reduce((a, b) => a / b),
  '<': (...args) => args.every((v, i) => i === 0 ? true : args[i - 1] < args[i]),
  '>': (...args) => args.every((v, i) => i === 0 ? true : args[i - 1] > args[i]),
  '<=': (...args) => args.every((v, i) => i === 0 ? true : args[i - 1] <= args[i]),
  '>=': (...args) => args.every((v, i) => i === 0 ? true : args[i - 1] >= args[i]),
  '!=': (...args) => !args.every(v => v == args[0]),
  //  "'": a => `'${a}'`,
  '[': (...args) => args,
  'RegExp': (...args) => RegExp.apply(RegExp, args),
  'count': a => a.length,
  'del': (a, b) => delete a[b],
  // 'del': (a, b) => Reflect.deleteProperty(a, b),
  'isa': (a, b) => a instanceof b,
  'type': a => typeof a,
  'new': (...args) => new (args[0].bind.apply(args[0], args))(),
  'not': a => !a,
  'list': (...args) => args,
  'vector': (...args) => args,
  'map': makeSF((ast, ctx, rs) => {
    let arr = eval_lisp(ast[0], ctx, {
      ...rs,
      wantCallable: false
    });
    rs.wantCallable = true;
    let fn = eval_lisp(ast[1], ctx, {
      ...rs,
      wantCallable: true
    });
    return isArray(arr) ? arr.map(it => fn(it)) : [];
  }),
  'filter': (arr, fn) => isArray(arr) ? arr.filter(it => fn(it)) : [],
  'throw': a => {
    throw a;
  },
  'identity': a => a,
  'pluck': (c, k) => c.map(el => el[k]),
  // for each array element, get property value, present result as array.
  'read-string': a => JSON.parse(a),
  'rep': a => JSON.stringify(EVAL(JSON.parse(a), STDLIB)),
  // TODO: fix ctx and rs arguments
  'null?': a => a === null || a === undefined,
  // ??? add [] ???
  'true?': a => a === true,
  'false?': a => a === false,
  'string?': isString,
  'list?': isArray,
  'contains?': (a, b) => a.hasOwnProperty(b),
  'str': (...args) => args.map(x => isString(x) ? x : isFunction(x) ? x.lpeName : JSON.stringify(x)).join(''),
  'get': (a, b) => a.hasOwnProperty(b) ? a[b] : undefined,
  'nth': (a, b) => a.hasOwnProperty(b) ? a[b] : undefined,
  'set': (a, b, c) => (a[b] = c, a),
  'keys': a => Object.keys(a),
  'vals': a => Object.values(a),
  'rest': a => a.slice(1),
  'split': makeSF((ast, ctx, rs) => {
    let str = eval_lisp(ast[0], ctx, {
      ...rs,
      wantCallable: false
    });
    let sep = eval_lisp(ast[1], ctx, {
      ...rs,
      wantCallable: false
    });
    return str.split(sep);
  }),
  'println': (...args) => console.log(args.map(x => isString(x) ? x : JSON.stringify(x)).join(' ')),
  'empty?': a => isArray(a) ? a.length === 0 : false,
  'cons': (a, b) => [].concat([a], b),
  'prn': (...args) => console.log(args.map(x => JSON.stringify(x)).join(' ')),
  'slice': (a, b, ...end) => isArray(a) ? a.slice(b, end.length > 0 ? end[0] : a.length) : [],
  'first': a => a.length > 0 ? a[0] : null,
  'last': a => a[a.length - 1],
  'sort': a => isArray(a) ? a.sort() : [],
  // https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
  // only for numbers!
  'max': a => isArray(a) ? a.reduce(function (p, v) {
    return p > v ? p : v;
  }) : [],
  'min': a => isArray(a) ? a.reduce(function (p, v) {
    return p < v ? p : v;
  }) : [],
  'apply': (f, ...b) => f.apply(f, b),
  'concat': (...a) => [].concat.apply([], a),
  'pr_str': (...a) => a.map(x => JSON.stringify(x)).join(' '),
  'classOf': a => Object.prototype.toString.call(a),
  'join': (a, sep) => isArray(a) ? Array.prototype.join.call(a, sep) : '',
  'rand': () => Math.random(),
  // operator from APL language
  '⍴': (len, ...values) => Array.apply(null, Array(len)).map((a, idx) => values[idx % values.length]),
  re_match: (t, r, o) => t.match(new RegExp(r, o)),
  // not implemented yet
  // 'hash-table->alist'
  '"': makeSF((ast, ctx, rs) => String(ast[0])),
  '\'': makeSF((ast, ctx, rs) => String(ast[0])),
  '[]': makeSF((ast, ctx, rs) => String(ast[0])),
  // macros
  // '()': makeMacro((...args) => ['begin', ...args]), from 2022 It is just grouping of expressions
  '()': makeMacro(args => args),
  '->': makeMacro((acc, ...ast) => {
    // thread first macro
    // императивная лапша для макроса ->
    // надо вот так: https://clojuredocs.org/clojure.core/-%3E%3E
    // AST[["filterit",[">",1,0]]]
    //console.log("---------> " +JSON.stringify(acc) + " " + JSON.stringify(ast));

    for (let arr of ast) {
      if (!isArray(arr)) {
        arr = [".-", acc, arr]; // это может быть обращение к хэшу или массиву через индекс или ключ....
      } else if (arr[0] === "()" && arr.length === 2 && (isString(arr[1]) || isNumber(arr[1]))) {
        arr = [".-", acc, arr[1]];
      } else {
        arr = arr.slice(0); // must copy array before modify
        arr.splice(1, 0, acc);
        //console.log("AST !!!!" + JSON.stringify(arr))
        // AST[["filterit",[">",1,0]]]
        // AST !!!!["filterit","locations",[">",1,0]]
        // подставляем "вычисленное" ранее значение в качестве первого аргумента... классика thread first
      }
      acc = arr;
    }
    //console.log("AST !!!!" + JSON.stringify(acc))
    if (!isArray(acc)) {
      return ["resolve", acc];
    }
    return acc;
  }),
  '->>': makeMacro((acc, ...ast) => {
    // thread last macro
    // императивная лапша для макроса ->>
    // надо вот так: https://clojuredocs.org/clojure.core/-%3E%3E
    for (let arr of ast) {
      arr.push(acc);
      acc = arr;
    }
    return acc;
  }),
  'invoke': makeMacro((...ast) => {
    /// мы не можем использовать точку в LPE для вызова метода объекта, так как она уже замаплена на ->
    /// поэтому для фанатов ООП пришлось добавить макрос invoke - вызов метода по его текстовому названию.
    /// invoke хорошо стыкуется с ->
    ast.splice(0, 0, ".");
    return ast;
  }),
  'and': makeMacro((...ast) => {
    if (ast.length === 0) return true;
    if (ast.length === 1) return ast[0];
    return ["let", ["__and", ast[0]], ["if", "__and", ["and"].concat(ast.slice(1)), "__and"]];
  }),
  'or': makeMacro((...ast) => {
    if (ast.length === 0) return false;
    if (ast.length === 1) return ast[0];
    return ["let", ["__or", ast[0]], ["if", "__or", "__or", ["or"].concat(ast.slice(1))]];
  }),
  // system functions & objects
  // 'js': eval,

  eval: a => EVAL(a, STDLIB)
};
for (const [key, val] of Object.entries(STDLIB)) {
  if (isFunction(val)) {
    val.lpeName = key;
  }
}
function macroexpand(ast, ctx, resolveString = true) {
  //console.log("MACROEXPAND: " + JSON.stringify(ast))
  while (true) {
    if (!isArray(ast)) break;
    if (!isString(ast[0])) break;
    //const v = $var$(ctx, ast[0]);
    const v = $var$(ctx, ast[0], undefined, {
      "resolveString": resolveString
    }); //возможно надо так
    if (!isFunction(v)) break;
    if (!isMacro(v)) break;
    ast = v.apply(v, ast.slice(1)); // Это макрос! 3-й элемент макроса установлен в 1 через push
  }
  //console.log("MACROEXPAND RETURN: " + JSON.stringify(ast))

  return ast;
}

/**
 * Return new ctx with symbols in ast bound to
 * corresponding values in exprs
 * @param ast
 * @param ctx
 * @param exprs
 * @returns {*[]}
 */
function env_bind(ast, ctx, exprs) {
  let newCtx = {};
  for (let i = 0; i < ast.length; i++) {
    if (ast[i] === "&") {
      // variable length arguments
      newCtx[ast[i + 1]] = Array.prototype.slice.call(exprs, i);
      break;
    } else {
      newCtx[ast[i]] = exprs[i];
    }
  }
  return [newCtx, ctx];
}

/**
 * Unwrap values if they are promise or stream
 * @param {any[]} args
 * @param {(arg: any[]) => any} resolve callback to run when all ready
 * @param {any?} streamAdapter
 */
function unbox(args, resolve, streamAdapter) {
  const hasPromise = args.find(a => a instanceof Promise);
  const hasStreams = !!args.find(a => streamAdapter === null || streamAdapter === void 0 ? void 0 : streamAdapter.isStream(a));
  if (hasStreams) {
    // TODO: add loading state
    const evaluatedArgs = args.map(a => streamAdapter.isStream(a) ? streamAdapter.getLastValue(a) : a);
    let outputStream; // what will be returned
    const subscriptions = [];
    let resultStream;
    let resultStreamSubscription;
    const disposeResultStream = () => {
      // handler - dispose resultStream if any
      if (resultStreamSubscription) {
        var _resultStreamSubscrip, _resultStreamSubscrip2;
        (_resultStreamSubscrip = (_resultStreamSubscrip2 = resultStreamSubscription).dispose) === null || _resultStreamSubscrip === void 0 || _resultStreamSubscrip.call(_resultStreamSubscrip2);
        resultStreamSubscription = null;
      }
      if (resultStream) {
        streamAdapter.disposeStream(resultStream);
        resultStream = null;
      }
    };
    const dispose = () => {
      // handler - dispose all dependencies
      disposeResultStream();
      subscriptions.forEach(subscription => {
        var _subscription$dispose;
        return subscription === null || subscription === void 0 || (_subscription$dispose = subscription.dispose) === null || _subscription$dispose === void 0 ? void 0 : _subscription$dispose.call(subscription);
      }); // unsubscribe all subscriptions
      args.filter(a => streamAdapter === null || streamAdapter === void 0 ? void 0 : streamAdapter.isStream(a)).forEach(streamAdapter.disposeStream); // and free services
    };
    const onNextValue = value => {
      // when we have extracted value from result
      streamAdapter.next(outputStream, value);
    };
    const onNextResult = result => {
      // will be called on next result to be pushed into stream
      if (streamAdapter.isStream(result)) {
        // when result is stream itself
        if (resultStream !== result) {
          // and only when new stream is received
          disposeResultStream();
          resultStream = result;
          onNextValue(streamAdapter.getLastValue(resultStream));
          resultStreamSubscription = streamAdapter.subscribe(resultStream, onNextValue);
        }
      } else {
        // when result is just value (TODO: Promise)
        disposeResultStream(); // we don't need stream any more if it was on previous result
        onNextValue(result);
      }
    };
    outputStream = streamAdapter.createStream(undefined, dispose);
    onNextResult(resolve(evaluatedArgs));
    args.forEach((a, idx) => {
      if (streamAdapter.isStream(a)) {
        subscriptions.push(
        // save subscription in order to dispose later
        streamAdapter.subscribe(a, value => {
          evaluatedArgs[idx] = value; // update arguments
          onNextResult(resolve(evaluatedArgs));
        }));
      }
    });
    return outputStream;
  } else if (hasPromise) {
    // TODO: handle both streams and promises
    return Promise.all(args).then(resolve);
  } else {
    return resolve(args); // TODO check if stream or promise returned
  }
}

/**
 *
 * @param ast
 * @param ctx
 * @param {EvalOptions=} options
 * @returns {Promise<Awaited<unknown>[] | void>|*|null|undefined}
 */
function EVAL(ast, ctx, options) {
  //console.log(`EVAL CALLED FOR ${JSON.stringify(ast)}`)
  while (true) {
    ast = macroexpand(ast, ctx, (options === null || options === void 0 ? void 0 : options.resolveString) ?? false); // by default do not resolve string

    if (!isArray(ast)) {
      // atom
      if (isString(ast)) {
        const value = $var$(ctx, ast, undefined, options);
        //console.log(`${JSON.stringify(resolveOptions)} var ${ast} resolved to ${isFunction(value)?'FUNCTION':''} ${JSON.stringify(value)}`)
        if (value !== undefined) {
          if (isFunction(value) && options["wantCallable"] !== true) {
            return ast;
          } else {
            // variable
            //console.log(`EVAL RETURN resolved var ${JSON.stringify(ast)}`)
            return value;
          }
        }
        //console.log(`EVAL RETURN resolved2 var ${resolveOptions && resolveOptions.resolveString ? ast : undefined}`)
        return options && options.resolveString ? ast : undefined; // if string and not in ctx
      }
      //console.log(`EVAL RETURN resolved3 var ${JSON.stringify(ast)}`)
      return ast;
    }

    //console.log(`EVAL CONTINUE for ${JSON.stringify(ast)}`)

    // apply
    // c 2022 делаем macroexpand сначала, а не после
    // ast = macroexpand(ast, ctx, resolveOptions && resolveOptions.resolveString ? true: false);

    //console.log(`EVAL CONTINUE after macroexpand: ${JSON.stringify(ast)}`)
    if (!Array.isArray(ast)) return ast; // TODO: do we need eval here?
    if (ast.length === 0) return null; // TODO: [] => empty list (or, maybe return vector [])

    //console.log("EVAL1: ", JSON.stringify(resolveOptions),  JSON.stringify(ast))
    const [opAst, ...argsAst] = ast;
    const op = EVAL(opAst, ctx, {
      ...options,
      wantCallable: true
    }); // evaluate operator

    if (typeof op !== 'function') {
      throw new Error('Error: ' + String(op) + ' is not a function');
    }
    if (isSF(op)) {
      // special form
      const sfResult = op(argsAst, ctx, options);
      return sfResult;
    }
    const args = argsAst.map(a => EVAL(a, ctx, options)); // evaluate arguments

    if (op.ast) {
      // Macro
      ast = op.ast[0];
      ctx = env_bind(op.ast[2], op.ast[1], args); // TCO
    } else {
      return unbox(args, args => {
        const fnResult = op.apply(op, args);
        return fnResult;
      }, options === null || options === void 0 ? void 0 : options.streamAdapter);
    }
  }
} // EVAL

function eval_lisp(ast, ctx, options) {
  const result = EVAL(ast, [ctx || {}, STDLIB], options || {
    resolveString: true
  });
  return result;
}

// Use with care
function init_lisp(ctx) {
  ctx = [ctx || {}, STDLIB];
  return {
    eval: ast => eval_lisp(ast, ctx),
    val: (varName, value) => $var$(ctx, varName, value)
  };
}

// deprecated
function evaluate(ast, ctx) {
  return eval_lisp(ast, ctx);
}
;// CONCATENATED MODULE: ./src/lpel.js
// http://javascript.crockford.com/tdop/tdop.html

// 2010-02-23

// (c) 2006 Douglas Crockford

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments of the // type are ignored.

// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&

const isDigit = c => c >= '0' && c <= '9';
//const isLetter = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
// https://stackoverflow.com/questions/9862761/how-to-check-if-character-is-a-letter-in-javascript
//const isLetter = (c) => RegExp(/^\p{L}$/,'u').test(c);
const isLetter = c => c.toLowerCase() != c.toUpperCase();

// Transform a token object into an exception object and throw it.
function LPESyntaxError(message) {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  // this.stack = (new Error()).stack;
}
function makeError(t, message) {
  t.message = message;
  const errorDescription = JSON.stringify(t, ['name', 'message', 'from', 'to', 'key', 'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
  throw new LPESyntaxError(errorDescription);
}
const PREFIX = '=<>!+-*&|/%^:.';
const SUFFIX = '=<>&|:.';

/**
 *
 * @param s
 * @param {{squareBrackets: boolean}} options
 * @returns {*[]}
 */
function tokenize(s, options) {
  if (s.startsWith('lpe:')) s = s.substr(4);
  if (s.startsWith('⚡')) s = s.substr(1);
  const {
    squareBrackets
  } = options;
  let c; // The current character.
  let from; // The index of the start of the token.
  let i = 0; // The index of the current character.
  let length = s.length;
  let n; // The number value.
  let str; // The string value.
  let result = []; // An array to hold the results.
  const make = (type, value) => ({
    type,
    value,
    from,
    to: i
  }); // Make a token object.

  // If the source string is empty, return nothing.
  if (!s) {
    return [];
  }

  // Loop through this text, one character at a time.
  c = s.charAt(i);
  while (c) {
    from = i;

    // Ignore whitespace.
    if (c <= ' ') {
      i += 1;
      c = s.charAt(i);

      // name.
    } else if (isLetter(c) || c === '_' || c === '$' || c === '#') {
      // first char of name. TODO: remove #
      str = c;
      i += 1;
      for (;;) {
        c = s.charAt(i);
        if (isLetter(c) || isDigit(c) || c === '_' || c === '$') {
          str += c;
          i += 1;
        } else {
          break;
        }
      }
      result.push(make('name', str));
      // number.

      // A number cannot start with a decimal point. It must start with a digit,
      // possibly '0'.
    } else if (c >= '0' && c <= '9') {
      str = c;
      i += 1;

      // Look for more digits.

      for (;;) {
        c = s.charAt(i);
        if (c < '0' || c > '9') {
          break;
        }
        i += 1;
        str += c;
      }

      // Look for a decimal fraction part.

      if (c === '.') {
        i += 1;
        str += c;
        for (;;) {
          c = s.charAt(i);
          if (c < '0' || c > '9') {
            break;
          }
          i += 1;
          str += c;
        }
      }

      // Look for an exponent part.
      if (c === 'e' || c === 'E') {
        i += 1;
        str += c;
        c = s.charAt(i);
        if (c === '-' || c === '+') {
          i += 1;
          str += c;
          c = s.charAt(i);
        }
        if (c < '0' || c > '9') {
          makeError(make('number', str), "Bad exponent");
        }
        do {
          i += 1;
          str += c;
          c = s.charAt(i);
        } while (c >= '0' && c <= '9');
      }

      // Make sure the next character is not a letter.

      if (c >= 'a' && c <= 'z') {
        str += c;
        i += 1;
        makeError(make('number', str), "Bad number");
      }

      // Don't convert the string value to a number. If it is finite, then it is a good
      // token.
      // result.push(make('number', parseFloat(str)));
      // result.push(make('number', str));

      n = +str;
      if (isFinite(n)) {
        result.push(make('number', n));
      } else {
        makeError(make('number', str), "Bad number");
      }
    } else if (c === '\'' || c === '"' || squareBrackets && c === '[') {
      // 'string', "string", [string]
      /** @type {'string_double' | 'string_single' | 'string_column'}  */
      const type = c === '"' ? 'string_double' : c === '\'' ? 'string_single' : 'string_column';
      const closer = c === '"' ? '"' : c === '\'' ? '\'' : ']';
      str = '';
      i += 1;
      for (;;) {
        c = s.charAt(i);
        if (c < ' ') {
          makeError(make('', str) || make(type, str), c === '\n' || c === '\r' || c === '' ? "Unterminated string." : "Control character in string.");
        }
        if (c === closer) {
          // Look for the closing quote.
          break;
        }
        if ((type === 'string_single' || type === 'string_double') && c === '\\') {
          // Look for escapement.
          i += 1;
          if (i >= length) {
            makeError(make(type, str), "Unterminated string");
          }
          c = s.charAt(i);
          switch (c) {
            case 'b':
              c = '\b';
              break;
            case 'f':
              c = '\f';
              break;
            case 'n':
              c = '\n';
              break;
            case 'r':
              c = '\r';
              break;
            case 't':
              c = '\t';
              break;
            case 'u':
              if (i >= length) {
                makeError(make(type, str), "Unterminated string");
              }
              c = parseInt(s.substr(i + 1, 4), 16);
              if (!isFinite(c) || c < 0) {
                makeError(make(type, str), "Unterminated string");
              }
              c = String.fromCharCode(c);
              i += 4;
              break;
          }
        }
        str += c;
        i += 1;
      }
      i += 1;
      result.push(make(type, str));
      c = s.charAt(i);

      // comment.
    } else if (c === '/' && s.charAt(i + 1) === '/') {
      i += 1;
      for (;;) {
        c = s.charAt(i);
        if (c === '\n' || c === '\r' || c === '') {
          break;
        }
        i += 1;
      }

      // combining
    } else if (PREFIX.indexOf(c) >= 0) {
      str = c;
      i += 1;
      while (true) {
        c = s.charAt(i);
        if (i >= length || SUFFIX.indexOf(c) < 0) {
          break;
        }
        str += c;
        i += 1;
      }
      result.push(make('operator', str));

      // single-character operator
    } else {
      i += 1;
      result.push(make('operator', c));
      c = s.charAt(i);
    }
  }
  return result;
}
/* harmony default export */ const lpel = ((/* unused pure expression or super */ null && (0)));
;// CONCATENATED MODULE: ./src/lpep.js
/**
 * LuxPath expressions parser
 *
 * VERSION: 1.0.1
 *
 * DVD: added sexpr property to the token as array to keep s-expressions.
 *      arity and first, second etc will be removed
 *
 */

// Parser for Simplified JavaScript written in Simplified JavaScript
// From Top Down Operator Precedence
// http://javascript.crockford.com/tdop/index.html
// http://crockford.com/javascript/tdop/tdop.html
// Douglas Crockford
// 2010-06-26
//////////////////////////////////////////////////
// Later hacked to parse LPE instead of JavaScript
// Dmitry Dorofeev
// 2017-01-20

/*

lbp = left binding power
rbp = right binding power
nud = null denotation
led = left denotation
std = statement denotation
*/




/**
 *
 * @param {{squareBrackets: boolean}} options
 * @returns {function(*): null|*|{sexpr: string[]}}
 */
const make_parse = function (options = {}) {
  const squareBrackets = options.squareBrackets ?? false; // by default - ! squareBrackets

  var m_symbol_table = {};
  var m_token;
  var m_tokens;
  var m_token_nr;

  // стэк для типов выражений
  var m_expr_scope = {
    pop: function () {}
  }; // для разбора логических выражений типа (A and B or C)

  // для хранения алиасов для операций
  var m_operator_aliases = {};
  var operator_alias = function (from, to) {
    m_operator_aliases[from] = to;
  };
  var itself = function () {
    return this;
  };
  let scope = {
    find: function (n) {
      var e = this,
        o;
      var s = Object.create(original_symbol);
      s.nud = itself;
      s.led = null;
      s.lbp = 0;
      return s;
    }
  };
  var expr_logical_scope = {
    pop: function () {
      m_expr_scope = this.parent;
    },
    parent: null,
    tp: "logical"
  };
  var expr_lpe_scope = {
    pop: function () {
      m_expr_scope = this.parent;
    },
    parent: null,
    tp: "lpe"
  };
  var new_expression_scope = function (tp) {
    var s = m_expr_scope;
    m_expr_scope = Object.create(tp === "logical" ? expr_logical_scope : expr_lpe_scope);
    m_expr_scope.parent = s;
    return m_expr_scope;
  };
  var advance = function (id) {
    var a, o, t, v;
    if (id && m_token.id !== id) {
      makeError(m_token, "Got " + m_token.value + " but expected '" + id + "'.");
    }
    if (m_token_nr >= m_tokens.length) {
      m_token = m_symbol_table["(end)"];
      return;
    }
    t = m_tokens[m_token_nr];
    m_token_nr += 1;
    v = t.value;
    a = t.type;
    if (a === "name") {
      if (v === 'true' || v === 'false' || v === 'null') {
        o = m_symbol_table[v];
        a = "literal";
      } else if (m_expr_scope.tp == "logical") {
        if (v === "or" || v === "and" || v === "not" || v === "in" || v === "is") {
          //a = "operator";
          o = m_symbol_table[v];
          //console.log("OPERATOR>", v , " ", JSON.stringify(o))
          if (!o) {
            makeError(t, "Unknown logical operator.");
          }
        } else {
          o = scope.find(v);
        }
      } else {
        o = scope.find(v);
      }
    } else if (a === "operator") {
      o = m_symbol_table[v];
      if (!o) {
        makeError(t, "Unknown operator.");
      }
    } else if (a === 'string_double') {
      // "строчка" в двойнгых кавычках
      o = m_symbol_table['(string_literal_double)'];
      a = 'literal';
    } else if (a === 'string_single') {
      // 'строчка' в ординарных
      o = m_symbol_table['(string_literal_single)'];
      a = 'literal';
    } else if (a === 'string_column') {
      // [строчка] в скобочках
      o = m_symbol_table['(string_literal_column)'];
      a = 'literal';
    } else if (a === "number") {
      o = m_symbol_table["(number_literal)"];
      a = "literal";
    } else {
      makeError(t, "Unexpected token.");
    }
    m_token = Object.create(o);
    m_token.from = t.from;
    m_token.to = t.to;
    m_token.value = v;
    m_token.arity = a;
    if (a === "operator") {
      m_token.sexpr = m_operator_aliases[v];
    } else {
      m_token.sexpr = v; // by dima
    }
    return m_token;
  };
  var statement = function () {
    var n = m_token,
      v;
    if (n.std) {
      advance();
      //scope.reserve(n);
      return n.std();
    }
    v = expression(0);
    //if (!v.assignment && v.id !== "(") {
    /*  if (v.id !== "(" && v.id !== "name" && v.id !== "number") {
        console.log(v);
        v.error("Bad expression statement.");
    }*/
    //advance(";");
    return v;
  };
  var statements = function () {
    var a = [],
      s;
    while (true) {
      //console.log(token);
      if (m_token.id === "(end)") {
        break;
      } else if (m_token.value === ';') {
        // skip optional ;
        advance();
      }
      s = statement();
      //console.log("STATEMENT ", s);
      if (s) {
        a.push(s);
      }
    }
    return a.length === 0 ? null : a.length === 1 ? a[0] : {
      "sexpr": ["begin"].concat(a.map(function (el) {
        return el["sexpr"];
      }))
    };
  };
  var expression = function (rbp) {
    var left;
    var t = m_token;
    advance();
    left = t.nud();
    while (rbp < m_token.lbp) {
      t = m_token;
      advance();
      left = t.led(left);
    }
    return left;
  };
  var original_symbol = {
    nud: function () {
      makeError(this, "Undefined.");
    },
    led: function (left) {
      makeError(this, "Missing operator.");
    }
  };
  var symbol = function (id, bp) {
    var s = m_symbol_table[id];
    bp = bp || 0;
    if (s) {
      if (bp >= s.lbp) {
        s.lbp = bp;
      }
    } else {
      s = Object.create(original_symbol);
      s.id = s.value = id;
      s.lbp = bp;
      m_symbol_table[id] = s;
    }
    operator_alias(id, id);
    return s;
  };
  var infix = function (id, bp, led) {
    var s = symbol(id, bp);
    s.led = led || function (left) {
      this.first = left;
      var right = expression(bp);
      this.second = right;
      this.arity = "binary";
      this.sexpr = [this.sexpr, left.sexpr, right.sexpr];
      return this;
    };
    return s;
  };

  // infix operators are left associative.
  // We can also make right associative operators, such as short-circuiting logical operators,
  // by reducing the right binding power.
  var infixr = function (id, bp, led) {
    var s = symbol(id, bp);
    s.led = led || function (left) {
      this.first = left;
      var right = expression(bp - 1);
      this.second = right;
      this.arity = "binary";
      this.sexpr = [this.sexpr, left.sexpr, right.sexpr];
      return this;
    };
    return s;
  };
  var prefix = function (id, nud) {
    var s = symbol(id);
    s.nud = nud || function () {
      // scope.reserve(this);
      var expr = expression(70);
      this.first = expr;
      this.arity = "unary";
      this.sexpr = [this.sexpr, expr.sexpr];
      return this;
    };
    return s;
  };
  var stmt = function (s, f) {
    var x = symbol(s);
    x.std = f;
    return x;
  };
  symbol("(end)");
  symbol("(name)");
  symbol("(null)");
  symbol(":");
  symbol(";");
  symbol(")");
  symbol("]");
  symbol("}");
  symbol("true").nud = function () {
    this.sexpr = true;
    return this;
  };
  symbol("false").nud = function () {
    this.sexpr = false;
    return this;
  };
  symbol("null").nud = function () {
    this.sexpr = null;
    return this;
  };

  // allow to skip values in function calls....
  var comma = symbol(",");
  symbol("(string_literal_double)").nud = function () {
    this.first = '"';
    this.arity = "unary";
    this.sexpr = ['"', this.sexpr];
    return this;
  };
  symbol("(string_literal_single)").nud = function () {
    this.first = "'";
    this.arity = "unary";
    this.sexpr = ["'", this.sexpr];
    return this;
  };
  symbol("(string_literal_column)").nud = function () {
    this.first = "'";
    this.arity = "unary";
    this.sexpr = ["[]", this.sexpr];
    return this;
  };
  symbol("(number_literal)").nud = itself;

  // [esix]: commented as in conflict with SQL operator ':'
  // infix("?", 20, function (left) {
  //   this.first = left;
  //   this.second = expression(0);
  //   advance(":");
  //   this.third = expression(0);
  //   this.arity = "ternary";
  //   this.sexpr = ["if", this.first.sexpr, this.second.sexpr, this.third.sexpr];
  //   return this;
  // });

  // [esix]: ternary operator with no conflict on ':' operator
  infix('?', 20, function (left) {
    this.first = left;
    this.second = expression(0);
    this.arity = 'binary';
    if (this.second.arity === 'binary' && this.second.value === ':') {
      this.sexpr = ["if", this.first.sexpr, this.second.sexpr[1], this.second.sexpr[2]];
    } else {
      makeError(this.second, "Invalid ternary operator.");
    }
    return this;
  });
  infixr("&&", 30);
  infixr("∧", 30);
  operator_alias("&&", "and");
  operator_alias("∧", "and");
  infixr("||", 30);
  infixr("∨", 30);
  operator_alias("||", "or");
  operator_alias("∨", "or");
  infixr('⍱', 30);
  operator_alias('⍱', 'nor');
  infixr('⍲', 30);
  operator_alias('⍲', 'nand');
  infixr('⊣', 30);
  operator_alias('⊣', 'car');
  infixr('⊢', 30);
  operator_alias('⊢', 'cdr');
  infixr('⍴', 30);

  /* will be used in logical scope, allow (a or and(b,c,ss)) */
  infixr("and", 30).nud = function () {
    return this;
  };
  /* allow (a and or(b,c,ss)) */
  infixr("or", 30).nud = function () {
    return this;
  };

  // required for SQL logical scope where a in (1,2,3)
  infixr("in", 30);
  infixr("is", 30);

  // for SQL types: '10'::BIGINT
  infixr("::", 90);

  // for SQL as
  infixr(":", 80);
  infix(":=", 30);
  infixr('~', 40);
  infixr('!~', 40);
  infixr('=', 40);
  infixr('≠', 40);
  operator_alias('≠', '!='); // from to canonical form;

  infixr('==', 40);
  infixr('!==', 40);
  infixr('!=', 40);
  infixr('<', 40);
  infixr('<=', 40);
  infixr('≤', 40);
  operator_alias('≤', '<=');
  infixr(">", 40);
  infixr(">=", 40);
  infixr("≥", 40);
  operator_alias("≥", ">=");
  infixr("<>", 40);
  infix("+", 50);
  infix("-", 50);
  infix("*", 60);
  infix("/", 60);
  infix("(", 80, function (left) {
    let a = [];
    this.arity = "binary";
    this.first = left;
    this.value = "("; // it was '(' by dima
    this.second = a;
    if ((left.arity !== "unary" || left.id !== "function") && left.arity !== "name" && left.id !== "(" && left.id !== "&&" && left.id !== "||" && left.id !== "?") {
      makeError(left, "Expected a variable name.");
    }

    // dima support for missed function arguments...
    if (m_token.id !== ")") {
      if (false) { var e; } else {
        new_expression_scope("lpe");
        while (true) {
          // console.log(">" + token.arity + " NAME:" + left.value);
          if (m_token.id === ',') {
            a.push({
              value: null,
              arity: "literal"
            });
            advance();
          } else if (m_token.id === ')') {
            a.push({
              value: null,
              arity: "literal"
            });
            break;
          } else {
            new_expression_scope("logical");
            var e = expression(0);
            //console.log("LOGICAL????? " + JSON.stringify(e));
            m_expr_scope.pop();
            // var e = statements();
            a.push(e);
            if (m_token.id !== ",") {
              break;
            }
            advance(",");
          }
        }
        m_expr_scope.pop();
      }
    }
    this.sexpr = [this.first.value].concat(a.map(function (el) {
      return el.sexpr;
    }));
    advance(")");
    return this;
  });
  function lift_funseq(node) {
    if (node.value === "->") {
      return lift_funseq(node.first).concat(lift_funseq(node.second));
    } else
      /*if (node.value === "(") {
      console.log("() DETECTED" + JSON.stringify(node))
      //if (node.first.value === "->"){
      // если у нас в скобки взято выражение "->", то скобки можно удалить
      // if (true).(frst().second()) === if(true) => [->> [first] [second]] скобки не нужны,
      // так как seq уже группирует вызовы в цепочку
      // DIMA 2022 на самом деле нет для
      // if(a=b).(yes().yes()).(no().no3())
      // получаем
      // ["->",["if",["=","a","b"]],["yes"],["yes"],["no"],["no3"]]
      // что выглядит странно со вснх сторон
      //  return [["->"].concat(lift_funseq(node.first.first)).concat(lift_funseq(node.first.second))];
      //} else {
      return lift_funseq(node.first);
      //}
      } else */
      {
        //console.log("?? DETECTED" + JSON.stringify(node))
        return [node.sexpr];
      }
  }
  function lift_funseq_2(node) {
    if (node.value === "->>") {
      return lift_funseq(node.first).concat(lift_funseq(node.second));
    } else
      /*if (node.value === "()") {
      //if (node.first.value === "->>"){
      // если у нас в скобки взято выражение "->", то скобки можно удалить
      // if (true).(frst().second()) === if(true) => [->> [first] [second]] скобки не нужны,
      // так как seq уже группирует вызовы в цепочку
      //  return [["->>"].concat(lift_funseq(node.first.first)).concat(lift_funseq(node.first.second))];
      //} else {
      return lift_funseq(node.first);
      //}
      } else */
      {
        return [node.sexpr];
      }
  }
  infix(".", 70, function (left) {
    this.first = left;
    // this.second = expression(0);
    this.second = expression(70);
    this.arity = "binary";
    this.value = "->";
    this.sexpr = ["->"].concat(lift_funseq(this));
    return this;
  });
  infix("..", 70, function (left) {
    this.first = left;
    // this.second = expression(0);
    this.second = expression(70);
    this.arity = "binary";
    this.value = "->>";
    this.sexpr = ["->>"].concat(lift_funseq_2(this));
    return this;
  });

  // WARNING HACK FIXME DIMA - добавил чтобы писать order_by(+a)
  // А также замена /table на +table в htSQL
  prefix("+");
  prefix("!");

  // allow func().not(a)   а также f(a is not null)
  var n = prefix("not", function () {
    // it is nud function
    var expr = expression(70);
    //console.log("AHTUNG expr is " + JSON.stringify(expr))
    if (isArray(expr.sexpr) && expr.sexpr[0] === '()') {
      /* выражение not() выдаёт вот такое:
        {
          from: 0,
          to: 3,
          value: 'not',
          arity: 'unary',
          sexpr: [ 'not', [ '()' ] ],
          first: {from: 3,to: 4,value: '(',arity: 'binary',sexpr: [ '()' ],
                  first: { from: 3, to: 4, value: '()', arity: 'name', sexpr: ['()'] }
          }
        }
        not(1) даёт такое, a not(1,2) нельзя написать = ошибка !!!
          {
            from: 0,
            to: 3,
            value: 'not',
            arity: 'unary',
            sexpr: [ 'not', [ '()', 1 ] ],
            first: { from: 4, to: 5, value: 1, arity: 'literal', sexpr: [ '()', 1 ] }
          }
        надо его преобразовать в
          {
            from: 1,
            to: 2,
            value: '(',
            arity: 'binary',
            sexpr: [ 'f' ],
            first: { from: 0, to: 1, value: 'f', arity: 'name', sexpr: 'f' },
            second: []
          }
        или с параметром (одним!)
          {
            from: 1,
            to: 2,
            value: '(',
            arity: 'binary',
            sexpr: [ 'f', 1 ],
            first: { from: 0, to: 1, value: 'f', arity: 'name', sexpr: 'f' },
            second: [ { from: 2, to: 3, value: 1, arity: 'literal', sexpr: 1 } ]
          }
      */
      this.arity = 'name';
      this.value = 'not';
      this.sexpr = 'not';
      var e = {
        from: 0,
        to: 2,
        value: '(',
        arity: 'binary',
        sexpr: ['not'],
        first: this
      };
      if (expr.sexpr.length > 1) {
        e.second = [{
          from: 4,
          to: 5,
          value: expr.sexpr[1],
          arity: 'literal',
          sexpr: expr.sexpr[1]
        }];
        e.sexpr.push(expr.sexpr); // keep () in the parsed AST
        //e.sexpr = e.sexpr.concat(expr.sexpr) // keep () in the parsed AST
      }
      return e;
    }

    // simple operator `not expr`
    this.first = expr;
    this.arity = "unary";
    this.sexpr = [this.sexpr, expr.sexpr];
    //console.log("2NOT nud:" + JSON.stringify(this))
    return this;
  });
  n.led = function (left) {
    //console.log("NOT led left:" + JSON.stringify(left))
    return this;
  }; // will be used in logical scope

  prefix("¬");
  operator_alias("!", "not");
  operator_alias("¬", "not");

  // trying to optimize, when we have negated -number
  prefix("-");
  prefix(".", function () {
    var v = expression(70);
    if (v.value !== "(") {
      makeError(v, "Only functions may have dot (.) unary operator.");
    }
    // this.first = v;
    // this.arity = "unary";
    // return this;
    // skip unary dot !!!
    return v;
  });
  prefix("(", function () {
    var e;
    if (m_token.value === ')') {
      // если это просто () две скобки, то возвращаем сразу кусок AST,генерим функцию с именем "()"
      // {"from":3,"to":4,"value":"(","arity":"operator","sexpr":"("}
      this.arity = "binary";
      this.sexpr = ["()"];
      this.first = {
        from: this.from,
        to: this.to + 1,
        value: '()',
        arity: 'name',
        sexpr: ['()']
      };
      advance(")");
      return this;
    }
    e = expression(0);
    //console.log('(), got e' + JSON.stringify(e))
    if (m_expr_scope.tp == "logical") {
      // we should remember all brackets to restore original user expression
      e.value = "("; // FIXME: why not make it '()' ?? and looks like function `()` call ?
      e.sexpr = ["()", e.sexpr];
    } else {
      if (e.value === "->") {
        // в скобки взято выражение из цепочки LPE вызовов, нужно запомнить скобки, делаем push "()" в текущий AST
        e = {
          first: e,
          value: "(",
          arity: "binary",
          sexpr: ["()", e.sexpr]
        };
      }
    }
    advance(")");
    return e;
  });
  if (!squareBrackets) {
    prefix("[", function () {
      var a = [];
      if (m_token.id !== "]") {
        while (true) {
          a.push(expression(0));
          // a.push(statements());
          if (m_token.id !== ",") {
            break;
          }
          advance(",");
        }
      }
      advance("]");
      this.first = a;
      this.arity = "unary";
      this.sexpr = ["["].concat(a.map(el => el.sexpr));
      return this;
    });
  }
  return function (source) {
    m_tokens = tokenize(source, {
      squareBrackets
    });
    m_token_nr = 0;
    new_expression_scope("logical");
    advance();
    var s = statements();
    // var s = expression(0);
    advance("(end)");
    return s;
  };
};
const parser3 = make_parse({
  squareBrackets: false
});
const parser4 = make_parse({
  squareBrackets: true
});

/**
 *
 * @param str
 * @param {EvalOptions} options
 * @returns {*}
 */
function parse(str, options = {}) {
  try {
    const squareBrackets = options.squareBrackets ?? false; // by default - do not use square brackets (true)
    let parser;
    if (squareBrackets) {
      parser = parser4; // In v4 - square brackets are interpreted as special strings (SQL column/table)
    } else {
      parser = parser3;
    }
    const parseResult = parser(str); // from, to, value, arity, sexpr
    return parseResult.sexpr;
  } catch (err) {
    console.error("Error", err.message);
    console.error("Error", err.stack);
    throw err;
  }
}

;// CONCATENATED MODULE: ./src/lped.js
const lped_isArray = arg => Object.prototype.toString.call(arg) === '[object Array]';
const lped_isString = arg => typeof arg === 'string';
const lped_isNumber = arg => typeof arg === 'number';
const lped_isBoolean = arg => arg === true || arg === false;
const lped_isHash = arg => typeof arg === 'object' && arg !== null && !lped_isArray(arg);
const lped_isFunction = arg => typeof arg === 'function';
const OPERATORS = {
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  '=': true,
  'and': '&&',
  'or': '||'
};
const PRIORITY = {
  '=': 40,
  '*': 20,
  '+': 10,
  '-': 10,
  '||': 5
};
const safeReplace = {
  '\n': '\\n',
  '\r': '\\r',
  '\"': '\\"',
  '\'': '\\\'',
  '\\': '\\\\'
};
function fixString(s) {
  return s.split('').map(char => char in safeReplace ? safeReplace[char] : char).join('');
}
function deparseWithOptionalBrackets(sexpr, op) {
  const res = deparse(sexpr);
  if (lped_isArray(sexpr) && sexpr.length && OPERATORS[sexpr[0]]) {
    if (op === sexpr[0]) {
      return res;
    }
    const priority1 = PRIORITY[op];
    const priority2 = PRIORITY[sexpr[0]];
    if (priority1 && priority2 && priority1 < priority2) {
      // no need on brackets
      return res;
    }
    return '(' + res + ')';
  } else {
    return res;
  }
}
function deparseSexpr(sexpr) {
  const op = sexpr[0];
  const args = sexpr.slice(1);
  if (op === '"') return '"' + fixString(args[0]) + '"';
  if (op === '\'') return '\'' + fixString(args[0]) + '\'';
  if (op === '[') return '[' + args.map(deparse).join(', ') + ']';
  if (op === '()') return '(' + args.map(deparse).join(', ') + ')';
  if (op === '->') return args.map(deparse).join('.');
  if ((op === '-' || op === '+') && args.length === 1) {
    if (lped_isNumber(args[0]) || lped_isString(args[0])) return op + String(args[0]);else return op + deparseWithOptionalBrackets(args[0], op);
  }
  if (OPERATORS[op] === true) {
    return args.map(arg => deparseWithOptionalBrackets(arg, op)).join(' ' + op + ' ');
  }
  if (lped_isString(OPERATORS[op])) {
    return args.map(arg => deparseWithOptionalBrackets(arg, OPERATORS[op])).join(' ' + OPERATORS[op] + ' ');
  }
  if (op === 'begin') return args.map(deparse).join('; ');
  return op + '(' + sexpr.slice(1).map(deparse).join(', ') + ')';
}
function deparse(lispExpr) {
  if (lped_isString(lispExpr)) {
    return lispExpr;
  } else if (lped_isNumber(lispExpr)) {
    return lispExpr.toString();
  } else if (lped_isBoolean(lispExpr)) {
    return lispExpr.toString();
  } else if (lped_isArray(lispExpr) && lispExpr.length === 0) {
    return '[]';
  } else if (lispExpr === null) {
    return 'null';
  } else if (lped_isArray(lispExpr)) {
    return deparseSexpr(lispExpr);
  } else {
    return String(lispExpr);
  }
}
;// CONCATENATED MODULE: ./src/index.js



function eval_lpe(lpe, ctx, options) {
  const ast = parse(lpe, options);
  return eval_lisp(ast, ctx, options);
}


// test:
// var ast = parse('2+2*2');
// console.log(ast);
// var res = eval_lisp(ast, []);
// console.log(res);
})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=lpe.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  LPESyntaxError: () => (/* reexport */ dist_lpe.LPESyntaxError),
  deparse: () => (/* reexport */ dist_lpe.deparse),
  eval_lisp: () => (/* reexport */ dist_lpe.eval_lisp),
  eval_lpe: () => (/* binding */ eval_lpe),
  eval_sql_expr: () => (/* reexport */ eval_sql_expr),
  eval_sql_macros: () => (/* reexport */ eval_sql_macros),
  eval_sql_where: () => (/* reexport */ eval_sql_where),
  generate_koob_sql: () => (/* reexport */ generate_koob_sql),
  generate_report_sql: () => (/* reexport */ generate_report_sql),
  generate_sql_for_model: () => (/* reexport */ generate_sql_for_model),
  parse: () => (/* reexport */ dist_lpe.parse),
  parse_sql_expr: () => (/* reexport */ parse_sql_expr),
  tokenize_sql_template: () => (/* reexport */ tokenize_sql_template)
});

// EXTERNAL MODULE: ./node_modules/@luxms/lpe/dist/lpe.js
var dist_lpe = __webpack_require__(110);
;// ./src/console/console.js
/* harmony default export */ const console_console = (console);
;// ./src/utils/utils.js

function db_quote_literal(intxt) {
  return "'" + intxt.toString().replace(/\'/g, "''") + "'";
}
function db_quote_ident(intxt) {
  return '"' + intxt.toString() + '"';
}

// for debugging outside of database !!!
function reports_get_columns(cubeId, dims) {
  var r = [];
  if ((0,dist_lpe.isArray)(dims)) {
    r = dims;
  } else if ((0,dist_lpe.isArray)(globalThis.MOCKcubeColumns)) {
    // FIXME: OBSOLETE, use dims argument!!!
    r = globalThis.MOCKcubeColumns;
  } else {
    //console.log("Built in Cube COLUMNS")
    var r = [{
      "id": "ch.fot_out.Val",
      "type": "NUMBER",
      "title": "Val",
      "sql_query": "\"Val\"",
      "config": {}
    }, {
      "id": "ch.fot_out.My version",
      "type": "STRING",
      "title": "My version",
      "sql_query": "\"My version\"",
      "config": {}
    }, {
      "id": "ch.fot_out.dt",
      "type": "PERIOD",
      "title": "dt",
      "sql_query": "NOW() - INTERVAL '1 DAY'",
      "config": {}
    }, {
      "id": "ch.fot_out.hcode_id",
      "type": "NUMBER",
      "title": "hcode_id",
      "sql_query": "hcode_id",
      "config": {}
    }, {
      "id": "ch.fot_out.hcode_name",
      "type": "STRING",
      "title": "hcode_name",
      "sql_query": "hcode_name",
      "config": {}
    }, {
      "id": "ch.fot_out.unit_name",
      "type": "STRING",
      "title": "unit_name",
      "sql_query": "unit_name",
      "config": {}
    }, {
      "id": "ch.fot_out.date_type_id",
      "type": "NUMBER",
      "title": "date_type_id",
      "sql_query": "date_type_id",
      "config": {}
    }, {
      "id": "ch.fot_out.dor_id",
      "type": "NUMBER",
      "title": "dor_id",
      "sql_query": "dor_id",
      "config": {}
    }, {
      "id": "ch.fot_out.dor_tlg",
      "type": "STRING",
      "title": "dor_tlg",
      "sql_query": "dor_tlg",
      "config": {}
    }, {
      "id": "ch.fot_out.dor_name",
      "type": "STRING",
      "title": "dor_name",
      "sql_query": "dor_name",
      "config": {}
    }, {
      "id": "ch.fot_out.obj_id",
      "type": "NUMBER",
      "title": "obj_id",
      "sql_query": "obj_id",
      "config": {}
    }, {
      "id": "ch.fot_out.tlg",
      "type": "STRING",
      "title": "tlg",
      "sql_query": "tlg",
      "config": {}
    }, {
      "id": "ch.fot_out.obj_name",
      "type": "STRING",
      "title": "obj_name",
      "sql_query": "obj_name",
      "config": {}
    }, {
      "id": "ch.fot_out.oe_type",
      "type": "STRING",
      "title": "oe_type",
      "sql_query": "oe_type",
      "config": {}
    }, {
      "id": "ch.fot_out.priox_int",
      "type": "NUMBER",
      "title": "priox_int",
      "sql_query": "priox_int",
      "config": {}
    }, {
      "id": "ch.fot_out.type_oe_bi",
      "type": "STRING",
      "title": "type_oe_bi",
      "sql_query": "type_oe_bi",
      "config": {}
    }, {
      "id": "ch.fot_out.dor1",
      "type": "STRING",
      "title": "dor1",
      "sql_query": "dor1",
      "config": {}
    }, {
      "id": "ch.fot_out.dor2",
      "type": "STRING",
      "title": "dor2",
      "sql_query": "dor2",
      "config": {}
    }, {
      "id": "ch.fot_out.dor3",
      "type": "STRING",
      "title": "dor3",
      "sql_query": "dor3",
      "config": {}
    }, {
      "id": "ch.fot_out.dor4",
      "type": "STRING",
      "title": "dor4",
      "sql_query": "dor4",
      "config": {}
    }, {
      "id": "ch.fot_out.dor5",
      "type": "STRING",
      "title": "dor5",
      "sql_query": "dor5",
      "config": {}
    }, {
      "id": "ch.fot_out.dor6",
      "type": "STRING",
      "title": "dor6",
      "sql_query": "dor6",
      "config": {}
    }, {
      "id": "ch.fot_out.branch1",
      "type": "STRING",
      "title": "branch1",
      "sql_query": "branch1",
      "config": {}
    }, {
      "id": "ch.fot_out.branch2",
      "type": "STRING",
      "title": "branch2",
      "sql_query": "branch2",
      "config": {
        "defaultValue---": "lpe:\"300\""
      }
    }, {
      "id": "ch.fot_out.branch3",
      "type": "STRING",
      "title": "branch3",
      "sql_query": "branch3",
      "config": {}
    }, {
      "id": "ch.fot_out.branch4",
      "type": "STRING",
      "title": "branch4",
      "sql_query": "branch4",
      "config": {}
    }, {
      "id": "ch.fot_out.branch5",
      "type": "STRING",
      "title": "branch5",
      "sql_query": "branch5",
      "config": {}
    }, {
      "id": "ch.fot_out.branch6",
      "type": "STRING",
      "title": "branch6",
      "sql_query": "branch6",
      "config": {}
    }, {
      "id": "ch.fot_out.ss1",
      "type": "STRING",
      "title": "ss1",
      "sql_query": "ss1",
      "config": {}
    }, {
      "id": "ch.fot_out.рус яз",
      "type": "STRING",
      "title": "рус яз",
      "sql_query": "\"рус столб\"",
      "config": {}
    }, {
      "id": "ch.fot_out.ss2",
      "type": "STRING",
      "title": "ss2",
      "sql_query": "ss2",
      "config": {}
    }, {
      "id": "ch.fot_out.ss3",
      "type": "STRING",
      "title": "ss3",
      "sql_query": "ss3",
      "config": {}
    }, {
      "id": "ch.fot_out.ss4",
      "type": "STRING",
      "title": "ss4",
      "sql_query": "ss4",
      "config": {}
    }, {
      "id": "ch.fot_out.ss5",
      "type": "STRING",
      "title": "ss5",
      "sql_query": "ss5",
      "config": {}
    }, {
      "id": "ch.fot_out.ss6",
      "type": "STRING",
      "title": "ss6",
      "sql_query": "ss6",
      "config": {}
    }, {
      "id": "ch.fot_out.indicator_v",
      "type": "NUMBER",
      "title": "indicator_v",
      "sql_query": "indicator_v",
      "config": {}
    }, {
      "id": "ch.fot_out.group_pay_name",
      "type": "STRING",
      "title": "group_pay_name",
      "sql_query": "group_pay_name",
      "config": {
        "follow": ["fot_out.group_pay_id"],
        "children": ["fot_out.pay_name", "fot_out.pay_code"],
        "memberALL": "Не задано"
      }
    }, {
      "id": "ch.fot_out.pay_code",
      "type": "STRING",
      "title": "pay_code",
      "sql_query": "pay_code",
      "config": {
        "memberALL": "Не задано",
        "follow": ["fot_out.pay_name"]
      }
    }, {
      "id": "ch.fot_out.pay_title",
      "type": "STRING",
      "title": "pay_title",
      "sql_query": "dictGet('gpn.group_pay_dict', 'some_real_field', tuple(pay_code))",
      "config": {}
    }, {
      "id": "ch.fot_out.pay_name",
      "type": "STRING",
      "title": "pay_name",
      "sql_query": "pay_name",
      "config": {
        "memberALL": "Не задано",
        "follow": ["fot_out.pay_code"]
      }
    }, {
      "id": "ch.fot_out.category_name",
      "type": "STRING",
      "title": "category_name",
      "sql_query": "category_name",
      "config": {}
    }, {
      "id": "ch.fot_out.sex_code",
      "type": "STRING",
      "title": "sex_code",
      "sql_query": "sex_code",
      "config": {
        "memberALL": null,
        "altDimensions": ["fot_out.sex_name"]
      }
    }, {
      "id": "ch.fot_out.sex_name",
      "type": "STRING",
      "title": "sex_name",
      "sql_query": "sex_name",
      "config": {
        "memberALL": "Все",
        "altDimensions": ["fot_out.sex_code"]
      }
    }, {
      "id": "ch.fot_out.area_name",
      "type": "STRING",
      "title": "area_name",
      "sql_query": "area_name",
      "config": {}
    }, {
      "id": "ch.fot_out.region_name",
      "type": "STRING",
      "title": "region_name",
      "sql_query": "region_name",
      "config": {}
    }, {
      "id": "ch.fot_out.municipal_name",
      "type": "STRING",
      "title": "municipal_name",
      "sql_query": "municipal_name",
      "config": {}
    }, {
      "id": "ch.fot_out.prod_group_name",
      "type": "STRING",
      "title": "prod_group_name",
      "sql_query": "prod_group_name",
      "config": {}
    }, {
      "id": "ch.fot_out.profession_name",
      "type": "STRING",
      "title": "profession_name",
      "sql_query": "profession_name",
      "config": {}
    }, {
      "id": "ch.fot_out.v_agg",
      "type": "AGGFN",
      "title": "v_agg",
      "sql_query": "max(sum(v_main))",
      "config": {}
    }, {
      "id": "ch.fot_out.v_rel_fzp",
      "type": "SUM",
      "title": "v_rel_fzp",
      "sql_query": "v_rel_fzp",
      "config": {}
    }, {
      "id": "ch.fot_out.v_main",
      "type": "SUM",
      "title": "v_main",
      "sql_query": "v_main",
      "config": {}
    }, {
      "id": "ch.fot_out.v_rel_fzp",
      "type": "SUM",
      "title": "v_rel_fzp",
      "sql_query": "v_rel_fzp",
      "config": {}
    }, {
      "id": "ch.fot_out.v_rel_pp",
      "type": "SUM",
      "title": "v_rel_pp",
      "sql_query": "v_rel_pp",
      "config": {}
    }, {
      "id": "ch.fot_out.fackt",
      "type": "SUM",
      "title": "fackt",
      "sql_query": "round(v_main,2)",
      "config": {}
    }, {
      "id": "ch.fot_out.Т Е С Т 1",
      "type": "SUM",
      "title": "Т Е С Т 1",
      "sql_query": "\"Т Е С Т 1\"",
      "config": {}
    }, {
      "id": "ch.fot_out.Т Е С Т 2",
      "type": "SUM",
      "title": "Т Е С Т 2",
      "sql_query": "\"Т Е С Т 2\"",
      "config": {}
    }, {
      "id": "ch.fot_out.Т Е С Т 3",
      "type": "SUM",
      "title": "Т Е С Т 3",
      "sql_query": "\"Т Е С Т 3\"",
      "config": {}
    }];
  }
  var parts = cubeId.split('.');
  var res = {};
  res[parts[0]] = {};
  var deep = {};
  r.map(el => {
    var ids = el.id.split('.');
    el["_ds"] = ids[0];
    el["_cube"] = ids[1];
    el["_col"] = ids[2];
    deep[el["_col"]] = el;
    res[el.id] = el;
  });
  res[parts[0]][parts[1]] = deep;
  return res;
}
function reports_get_column_info(srcId, col) {
  var parts = col.split('.');
  return {
    "id": col,
    "sql_query": parts[2],
    "type": "STRING",
    "config": {}
  };
}
function reports_get_table_sql(target_db_type, tbl, cube) {
  var table_name = tbl.split('.')[1];
  if ((0,dist_lpe.isHash)(cube)) {
    //console.log("Cube SQL provided as func arg")
    var sql = cube.sql_query;
    if (sql.match(/ /) !== null) sql = `(${sql})`; // it's select ... FROM or something like this
    if (target_db_type === 'oracle') {
      return {
        "query": `${sql} ${table_name}`,
        "config": cube.config
      };
    }
    return {
      "query": `${sql} AS ${table_name}`,
      "config": cube.config
    };
  }
  if (globalThis.MOCKCubeSQL !== undefined && (0,dist_lpe.isHash)(globalThis.MOCKCubeSQL[`${target_db_type}-${tbl}`])) {
    return globalThis.MOCKCubeSQL[`${target_db_type}-${tbl}`];
  }
  if (target_db_type === 'oracle') {
    return {
      "query": `${table_name} ${table_name}`,
      "config": {
        "is_template": 0
      }
    };
  }
  return {
    "query": `${table_name} AS ${table_name}`,
    "config": {
      "is_template": 0,
      "count_distinct!!!": "uniq"
    }
  };
  // hcode_name
  // and ${filters(group_pay_name)}
  //return {"query": `${table_name} AS ${table_name} where ` + '${filters(sex_code,pay_code)} ', "config": {"is_template": 1,"skip_where":0}}
}

/* should find path to JOIN all tables listed in cubes array */
/* returns list of tables and list of links between them */
function reports_get_join_path(cubes) {
  return {
    "links": [],
    "nodes": cubes
  };
}

// should return LPE STRUCT
function reports_get_join_conditions(link_struct) {
  return 'TRUE';
}
function get_data_source_info(srcIdent) {
  if (srcIdent === 'oracle') {
    return {
      'flavor': 'oracle'
    };
  } else {
    return {
      'flavor': 'postgresql'
    };
  }
}
;// ./src/sql_where.js
/**
 Copyright (c) 2019 Luxms Inc.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */





/*
where - всегда возвращает слово WHERE, а потом условия. На пустом входе вернёт WHERE TRUE
filter - на пустом входе вернёт пустую строку
*/

function sql_where_context(_vars) {
  // для отслеживания переменных, значения которых отсутствуют для cond
  // cond('col in $(row.var)', [])
  var track_undefined_values_for_cond = [];

  // try to get datasource Ident
  // table lookup queries should be sending us key named sourceId = historical name!
  var srcIdent = _vars["sourceId"];
  if (srcIdent !== undefined) {
    let ds_info = get_data_source_info(srcIdent);
    _vars["_target_database"] = ds_info["flavor"];
  }
  var _context = _vars;
  var try_to_quote_column = function (colname) {
    if (typeof _vars['_columns'] == 'object') {
      var h = _vars['_columns'][colname];
      if (typeof h == "object") {
        h = h['name'].toString();
        // console.log("-: try_to_quote_column " + JSON.stringify(h));
        // console.log("-: try_to_quote_column " + (typeof h));
        if (h.length > 0) {
          // return '"' + h + '"';
          return h;
        }
      }
    }
    return colname.toString();
  };
  var try_to_quote_order_by_column = function (colname) {
    var res = colname.toString();
    if (typeof _vars['_columns'] == 'object') {
      var h = _vars['_columns'][colname];
      if (typeof h == "object") {
        var o = h['order'];
        if (o === undefined) {
          o = h['name'];
        }
        //console.log("-: try_to_quote_order_by_column " + JSON.stringify(o));
        //console.log("-: try_to_quote_order_by_column " + (typeof o));
        if (o !== undefined && o.length > 0) {
          o = o.toString();
          var regExp = new RegExp(/^\w[\w\d]*$/, "i");
          // quote only literals that are not standard!
          var schema_table = o.split('.');
          if (schema_table.length < 4) {
            res = schema_table.map(item => regExp.test(item) ? item : db_quote_ident(item)).join('.');
          } else {
            throw new Error('Too many dots for column name ' + o);
          }
        }
      }
    }
    return res;
  };
  var resolve_literal = function (lit) {
    //console.log('LITERAL ', lit, '  CONTEXT:', _vars[lit]);
    if (_vars[lit] == undefined) {
      return try_to_quote_column(lit);
    } else {
      // есть возможность переименовать имена столбцов! или сделать ещё какие-то подстановки
      return (0,dist_lpe.eval_lisp)(lit, _vars);
    }
  };
  var resolve_order_by_literal = function (lit) {
    //console.log('OB LITERAL ', lit, ' CONTEXT:', _vars[lit]);

    if (_vars[lit] === undefined) {
      return try_to_quote_order_by_column(lit);
    } else {
      // есть возможность переименовать имена столбцов! или сделать ещё какие-то подстановки
      return (0,dist_lpe.eval_lisp)(lit, _vars);
    }
  };

  /* заполняем контекст функциями и макросами, заточенными на SQL */
  _context['order_by'] = function () {
    var ret = [];
    var ctx = {};
    var get_extra_order = function (colname) {
      if (typeof _vars['_columns'] == 'object') {
        var h = _vars['_columns'][colname];
        if (typeof h == "object") {
          var o = h['order_extra'];
          if (o !== undefined) {
            return ` ${o}`;
          }
        }
      }
      return "";
    };
    for (var key in _vars) ctx[key] = _vars[key];
    // так как order_by будет выполнять eval_lisp, когда встретит имя столба с минусом -a, то мы
    // с помощью макросов + и - в этом случае перехватим вызов и сделаем обработку.
    // а вот когда работает обработчик аргументов where - там eval_lisp почти никогда не вызывается...
    ctx['+'] = function (a) {
      return resolve_order_by_literal((0,dist_lpe.eval_lisp)(a, _vars)) + get_extra_order(a);
    };
    ctx['+'].ast = [[], {}, [], 1]; // mark as macro

    ctx['-'] = function (a) {
      return resolve_order_by_literal((0,dist_lpe.eval_lisp)(a, _vars)) + ' DESC' + get_extra_order(a);
    };
    ctx['-'].ast = [[], {}, [], 1]; // mark as macro

    // вот так будет работать: order_by(-short_tp,y)
    // Но у нас может быть ситуация, когда мы столбцы для сотрировки передали в массиве _vars["sort"]
    // Это koob lookup
    // поэтому делаем разбор этого массива и дописываем аргументы
    // что-то похожее делается прямо в  function eval_sql_where, но там проверяется что _vars["sort"] = строка.
    let args = Array.prototype.slice.call(arguments);
    if ((0,dist_lpe.isArray)(_vars["sort"])) {
      var extra_args = _vars["sort"].map(el => (0,dist_lpe.parse)(el));
      args = args.concat(extra_args);
    }
    for (var i = 0; i < args.length; i++) {
      //console.log(`step ${i} ${JSON.stringify(args[i])}`)
      if (args[i] instanceof Array) {
        ret.push((0,dist_lpe.eval_lisp)(args[i], ctx));
      } else {
        // try_to_quote_column берёт текст в двойные кавычки для известных столбцов!!!
        var a = args[i].toString();
        ret.push(resolve_order_by_literal(a) + get_extra_order(a));
      }
    }
    if (ret.length > 0) {
      return 'ORDER BY ' + ret.join(',');
    } else {
      return '';
    }
  };
  _context['order_by'].ast = [[], {}, [], 1]; // mark as macro

  _context['lpe_pg_tstz_at_time_zone'] = function (timestamp, zone) {
    // FIXME: check quotes !!!
    if (/'/.test(timestamp)) {
      throw 'Wrong timestamp: ' + JSON.stringify(timestamp);
    }
    //console.log("lpe_pg_tstz_at_time_zone" + timestamp);
    return "'" + timestamp + "'" + "::timestamptz at time zone '" + zone + "'";
  };
  _context['pg_interval'] = function (cnt, period_type) {
    var pt;
    if (period_type instanceof Object) {
      pt = period_type["unit"];
    } else {
      pt = period_type;
    }
    if (/^\d+$/.test(pt)) {
      // all numbers....
      switch (pt) {
        case 1:
          pt = 'second';
          break;
        case 2:
          pt = 'minute';
          break;
        case 3:
          pt = 'hour';
          break;
        case 4:
          pt = 'day';
          break;
        case 5:
          pt = 'week';
          break;
        case 6:
          pt = 'month';
          break;
        case 7:
          pt = 'quarter';
          break;
        case 8:
          pt = 'year';
          break;
        default:
          throw "wrong period type:" + pt;
      }
    } else {
      var reg = new RegExp("['\"]+", "g");
      pt = pt.replace(reg, "");
    }
    var regExp = new RegExp(/quarter/, "i");
    if (regExp.test(pt)) {
      return "'" + cnt * 3 + " month'::interval";
    }
    return "'" + cnt + " " + pt + "'::interval";
  };
  _context["ql"] = function (el) {
    // NULL values should not be quoted
    // console.log('QL: ' + JSON.stringify(el))
    return el === null ? null : db_quote_literal(el);
  };
  _context["includes"] = function (col, el) {
    // First arg = column name, second arg = string literal
    return `${col} ? ${el}`;
  };

  // required for Oracle Reports
  _context["to_timestamp"] = function (el, fmt, nls) {
    return `to_timestamp(${el})`;
  };

  // required for Oracle Reports
  _context["to_char"] = function (el, tp, fmt) {
    return `to_char()`;
  };

  // required for Oracle Reports
  _context["to_date"] = function (el, fmt, nls) {
    if (fmt && nls) {
      return `to_date(${el}, ${fmt}, ${nls})`;
    }
    if (fmt) {
      return `to_date(${el}, ${fmt})`;
    }
    return `to_date(${el})`;
  };

  /*
  _context["'"] = function (expr) {
    // we should eval things in the cond ( a = '$(abs.ext)')
    //console.log('FOUND EXPR: ' + expr)
    if (expr.match(/^\s*\$\(.*\)\s*$/)){
      return `'{eval_lisp(expr, _context)}'`
    }
  }*/

  // table lookup filters with auto-filling
  _context['filters'] = function () {
    // for(var i = 0; i < arguments.length; i++) {
    var a = Array.prototype.slice.call(arguments);

    // нужно включить ВСЕ элементы из _vars.context.row,
    // "row":{"short_tp":["=","ГКБ"],"y":["=",2021]}
    var row = _vars.context.row;
    if (a.length > 0) {
      // возможно есть except???
      var except;
      var args = [];
      for (var i = 0; i < a.length; i++) {
        var el = a[i];
        if ((0,dist_lpe.isArray)(el) && el[0] === 'except') {
          except = el;
        } else {
          args.push(el);
        }
      }
      if (except) {
        // console.log('EXCEPT !!!' + JSON.stringify(except))
        // нужно почистить _vars.context.row от лишних ключей
        // считаем, что в except идут исключительно имена столбцов
        except.slice(1).map(key => delete row[key]);
      }
      if (args.length > 0) {
        // есть элементы, которые явно указаны, генерим условия только для них
        // нужно почистить _vars.context.row от лишних ключей
        // args.map( el => console.log("ITER:" + JSON.stringify(el)) )
        var r = {};
        args.map(el => {
          if ((0,dist_lpe.isArray)(el)) {
            if (el[0] === ':') {
              //ITER:[":","short_tp","tp"]
              if (el[1] in row) {
                r[el[2]] = row[el[1]];
              }
            }
          } else {
            if (el in row) {
              r[el] = row[el];
            }
          }
        });
        row = r;
      }
    }

    // FIXME: REMOVE el!=='measures' in Sept. 2022
    var expr = Object.keys(row).filter(el => el !== 'measures' && el !== '$measures').map(col => {
      var ar = row[col];
      //console.log("ITERITER:" + col + " " + JSON.stringify(ar))
      if ((ar[0] === '=' || ar[0] === '!=') && ar.length > 2) {
        return [ar[0], col, ['['].concat(ar.slice(1).map(el => ["ql", el]))];
      }
      return [ar[0], col].concat(ar.slice(1).map(el => ["ql", el]));
    });
    if (expr.length === 0) {
      return "1=1";
    }
    if (expr.length > 1) {
      expr = ["filter", ["and"].concat(expr)];
    } else {
      expr = ["filter", expr[0]];
    }

    //console.log("FILTERS:" + JSON.stringify(expr))
    return (0,dist_lpe.eval_lisp)(expr, _context);
  };
  _context['filters'].ast = [[], {}, [], 1]; // mark as macro

  // filter
  _context['filter'] = function () {
    var ctx = {};
    for (var key in _vars) ctx[key] = _vars[key];
    var quote_scalar = function (el) {
      if (typeof el === "string") {
        return db_quote_literal(el);
      } else if (typeof el === "number") {
        return el;
      } else {
        return db_quote_literal(JSON.stringify(el));
      }
    };
    var prnt = function (ar) {
      //console.log("PRNT:" + JSON.stringify(ar))
      if (ar instanceof Array) {
        if (ar[0] === '$' || ar[0] === '"' || ar[0] === "'" || ar[0] === "str" || ar[0] === "[" || ar[0] === 'parse_kv' || ar[0] === 'parse_cond' || ar[0] === "=" || ar[0] === "!=" || ar[0] === "ql" || ar[0] === "pg_interval" || ar[0] === "lpe_pg_tstz_at_time_zone" || ar[0] === "column" || ar[0] === "cond" || ar[0] === "includes" || ar[0] === "get_in" || ar[0] === "map") {
          return (0,dist_lpe.eval_lisp)(ar, ctx);
        } else {
          if (ar.length == 2) {
            // unary
            if (ar[0] == "not") {
              return ar[0] + ' ' + prnt(ar[1]);
            } else if (ar[0] == "()") {
              return "(" + prnt(ar[1]) + ")";
            } else if (ar[0].match(/^[^\w]+$/)) {
              return ar[0] + prnt(ar[1]);
            } else {
              return prnt(ar[0]) + "(" + prnt(ar[1]) + ")";
            }
          } else if (ar.length == 3) {
            if (ar[0] == "->") {
              // наш LPE использует точку, как разделитель вызовов функций и кодирует её как ->
              // в логических выражениях мы это воспринимаем как ссылку на <ИМЯ СХЕМЫ>.<ИМЯ ТАБЛИЦЫ>
              //return '"' + ar[1]+ '"."' + ar[2] + '"';
              return ar[1] + '.' + ar[2];
            } else if (ar[0] == "and" || ar[0] == "or") {
              return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
            } else if (ar[0] == "~") {
              //_source_database
              // Oracle has no ~ operator !!!
              if (_vars["_target_database"] === 'oracle') {
                return `REGEXP_LIKE( ${prnt(ar[1])} , ${prnt(ar[2])} )`;
              } else if (_vars["_target_database"] === 'mysql') {
                return `${prnt(ar[1])} REGEXP ${prnt(ar[2])}`;
              } else {
                return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
              }
            } else if (ar[0] == "ilike") {
              //_source_database
              // Oracle has no ilike !!!!
              if (_vars["_target_database"] === 'oracle' || _vars["_target_database"] === 'sqlserver') {
                // UPPER(last_name) LIKE 'SM%'
                return `UPPER( ${prnt(ar[1])} ) LIKE UPPER(${prnt(ar[2])})`;
              } else {
                return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
              }
            } else if (ar[0] == "like" || ar[0] == "in" || ar[0] == "is" || ar[0].match(/^[^\w]+$/)) {
              // имя функции не начинается с буквы
              //console.log("PRNT FUNC x F z " + JSON.stringify(ar))
              // ["~",["column","vNetwork.folder"],"XXX"]

              if (Array.isArray(ar[1]) && ar[1][0] === 'column' && Array.isArray(ar[2]) && ar[2][0] !== 'column' || !Array.isArray(ar[2])) {
                // справа значение, которое нужно квотировать!
              }
              return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
            } else {
              return ar[0] + '(' + prnt(ar[1]) + ',' + prnt(ar[2]) + ')';
            }
          } else if (ar[0] == "and" || ar[0] == "or") {
            // много аргументов для логической функции
            return ar.slice(1).map(prnt).join(' ' + ar[0] + ' ');
          } else if (ar[0] == "between") {
            return '(' + prnt(ar[1]) + ' BETWEEN ' + prnt(ar[2]) + ' AND ' + prnt(ar[3]) + ')';
          } else {
            // это неизвестная функция с неизвестным кол-вом аргументов
            return ar[0] + '(' + ar.slice(1).map(function (argel) {
              return prnt(argel);
            }).join(',') + ')';
          }
        }
      } else {
        return ar;
      }
    };
    ctx['get_in'] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
      // возвращаем переменные, которые в нашем контексте, вызывая стандартный get_in
      // при этом наши переменные фильтруем!!пока что есть только _user_info
      let _v = {
        "user": _context["user"]
      };
      return (0,dist_lpe.eval_lisp)(["get_in"].concat(ast), _v, rs);
    });
    ctx['map'] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
      // вызываем стандартный map
      // можно использовать array.map(ql)
      let _v = {
        "user": _context["user"],
        "ql": _context["ql"]
      };
      return (0,dist_lpe.eval_lisp)(["map"].concat(ast), _v, rs);
    });
    ctx['cond'] = function (expr, ifnull) {
      //console.log('COND MACRO expr: ' + JSON.stringify(expr));
      //console.log('COND MACRO ifnull: ' + JSON.stringify(ifnull));
      //COND MACRO expr: ["\"","myfunc($(period.title1)) = 234"]
      //COND MACRO ifnull: ["["]
      let parsed = expr;

      //console.log('COND PARSED:' + JSON.stringify(parsed));
      //Мы будем использовать спец флаг, были ли внутри этого cond доступы к переменным,
      // которые дали undefined. через глобальную переменную !!!
      if ((0,dist_lpe.isNumber)(ifnull) || ifnull === null || (0,dist_lpe.isArray)(ifnull) && ifnull.length === 2 && (ifnull[0] === '"' || ifnull[0] === "'")) {
        let val = prnt(ifnull);
        track_undefined_values_for_cond.unshift(val);
      } else {
        track_undefined_values_for_cond.unshift(false);
      }
      let evaluated = prnt(parsed);
      let unresolved = track_undefined_values_for_cond.shift();
      //console.log('UNRESOLVED:' + unresolved);
      if (unresolved === true) {
        // не удалось найти значение, результат зависит от второго аргумента!
        /*
        если значение var == null
        cond('col in $(row.var)', []) = значит убрать cond вообще (с учётом or/and)
        cond('col = $(row.var)', ['col is null']) = полная замена col is null
        */
        if ((0,dist_lpe.isArray)(ifnull) && ifnull[0] === '[') {
          if (ifnull.length === 1) {
            return '1=1';
          } else {
            // надо вычислить значение по умолчанию!!!
            // ["\"","myfunc(1)"]
            let ast = ifnull[1];
            let p = prnt(ast);
            if ((0,dist_lpe.isArray)(ast) && (ast[0] === '"' || ast[0] === "'")) {
              // убираем кавычки
              p = p.slice(1, -1);
            }
            return p;
          }
        }
      }
      //console.log('COND1:' + evaluated);
      return evaluated;
    };
    ctx['cond'].ast = [[], {}, [], 1]; // mark as macro

    ctx['"'] = function (el) {
      return '"' + el.toString() + '"';
    };
    ctx['"'].ast = [[], {}, [], 1]; // mark as macro

    ctx["'"] = function (expr) {
      // we should eval things in the cond ( a = '$(abs.ext)')
      //console.log("QUOT:" + expr)
      if (expr.match(/^\s*\$\(.*\)\s*$/)) {
        var parsed = (0,dist_lpe.parse)(expr);
        return `'${(0,dist_lpe.eval_lisp)(parsed, ctx)}'`;
      } else {
        return "'" + expr.toString() + "'";
      }
    };
    ctx["'"].ast = [[], {}, [], 1]; // mark as macro: IF it is not a macro, than '*' is evaled to func body!

    ctx["["] = function (el) {
      return "[" + Array.prototype.slice.call(arguments).join(',') + "]";
    };
    function eq_not_eq(l, r, op) {
      // понимаем a = [null] как a is null
      // a = [] просто пропускаем, А кстати почему собственно???
      // a = [null, 1,2] как a in (1,2) or a is null

      // ["=",["column","vNetwork.cluster"],["[","SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]]
      //console.log('========'+ JSON.stringify(l) + ' <> ' + JSON.stringify(r))
      if (r instanceof Array) {
        if (r.length === 0) {
          return op === 'eq' ? 'TRUE' : 'FALSE';
        }
        if (r[0] === '[') {
          r = ['['].concat(r.slice(1).map(function (el) {
            return (0,dist_lpe.eval_lisp)(el, _context);
          }));
          var nonnull = r.filter(function (el) {
            return el !== null;
          });
          if (nonnull.length === r.length) {
            if (nonnull.length === 1) {
              return op === '=' ? 'TRUE' : 'FALSE';
            } else {
              return prnt(l) + (op === '=' ? " IN (" : " NOT IN (") + r.slice(1).map(function (el) {
                return prnt(el);
              }).join(',') + ")";
            }
          } else {
            var col = prnt(l);
            if (nonnull.length === 1) {
              return col + (op === '=' ? " IS NULL" : " IS NOT NULL");
            } else {
              if (op === '=') {
                return "(" + col + " IS NULL OR " + col + " IN (" + nonnull.slice(1).map(function (el) {
                  return prnt(el);
                }).join(',') + "))";
              } else {
                return "(" + col + " IS NOT NULL OR " + col + " NOT IN (" + nonnull.slice(1).map(function (el) {
                  return prnt(el);
                }).join(',') + "))";
              }
            }
          }
        } else {
          //console.log(r[0] + " RESOLVING VAR " + JSON.stringify(r[1]));
          // FIXME: сюда может прилететь ->
          //console.log("RESOLVING VAR " + JSON.stringify(_context));
          var var_expr;
          if (r[0] === '$') {
            /* FIXME !!!
            _context contains just hash with defined vars (key/value).
            $(expr) inside sql_where should resolve to vars or generate exception with user refer to not defined var!!!
            it is better than default eval_lisp behavior where undefined var reolves to itself (atom).
            */
            //var_expr = eval_lisp(r[1], _context);
            var_expr = (0,dist_lpe.eval_lisp)(r[1], _context); // actually, we might do eval_lisp(r, ctx) but that will quote everything, including numbers!
            // здесь мы получаем в том числе и массив, хорошо бы понимать, мы находимся в cond или нет
            // ["=","ГКБ"]
            //console.log("RESOLVED $" + JSON.stringify(var_expr) )
            if ((0,dist_lpe.isArray)(var_expr)) {
              if (var_expr[0] === '=') {
                if (var_expr.length === 2) {
                  // всё хорошо !!! Это похоже на koob lookup
                  var_expr = var_expr[1];
                } else {
                  throw new Error(`Resolved value is array with length of not 2, which is not yet supported. ${JSON.stringify(var_expr)}`);
                }
              } else {
                // array here: pass it to the next logic
                console_console.log('array in $ evaluation');
                // возможно значение переменной резолвится в массив???
                //throw new Error(`Resolved value is array, with operation different from = which is not yet supported. ${JSON.stringify(var_expr)}`)
              }
            }
          } else {
            var_expr = prnt(r, ctx);
          }
          if (var_expr !== undefined) {
            if (var_expr instanceof Array) {
              //console.log(`EVAL = ${op}` + JSON.stringify(l) + ' ' + JSON.stringify(var_expr));
              return ctx[op](l, ['['].concat(var_expr));
            } else {
              //console.log("EVAL = " + JSON.stringify(l) + ' ' + JSON.stringify(var_expr));
              return ctx[op](l, var_expr);
            }
          }
        }
      }
      if (r === null || r === undefined) {
        var defVal = track_undefined_values_for_cond[0];
        //console.log("$ CHECK " + defVal)
        if ((0,dist_lpe.isString)(defVal) || (0,dist_lpe.isNumber)(defVal) || defVal === null) {
          return defVal;
        } else {
          // ставим метку, что был резолвинг неопределённого значения
          track_undefined_values_for_cond[0] = true;
        }
        return prnt(l) + (op === '=' ? " IS NULL " : " IS NOT NULL ");
      } else if (r === '') {
        return prnt(l) + ` ${op} ''`;
      } else {
        return prnt(l) + ` ${op} ` + prnt(r);
      }
    }
    ctx['='] = function (l, r) {
      return eq_not_eq(l, r, '=');
    };
    ctx['='].ast = [[], {}, [], 1]; // mark as macro

    ctx['!='] = function (l, r) {
      return eq_not_eq(l, r, '!=');
    };
    ctx['!='].ast = [[], {}, [], 1]; // mark as macro

    // $(name) will quote text elements !!! suitable for generating things like WHERE title in ('a','b','c')
    // also, we should evaluate expression, if any.
    ctx['$'] = function (inexpr) {
      //console.log("$$$$$$$$$" + JSON.stringify(inexpr))
      var expr = (0,dist_lpe.eval_lisp)(inexpr, _context); // evaluate in a normal LISP context without vars, not in WHERE context
      // здесь мы получаем в том числе и массив, хорошо бы понимать, мы находимся в cond или нет
      //console.log("$$$$$$$$$ = " + JSON.stringify(expr))
      // ["=","ГКБ"]
      if ((0,dist_lpe.isArray)(expr)) {
        if (expr[0] === '=') {
          if (expr.length === 2) {
            // всё хорошо !!! Это похоже на koob lookup
            return expr[1];
          }
        }
        //throw new Error(`Resolved value is array, which is not yet supported. ${JSON.stringify(expr)}`)
      }

      /* есть возможность определить, что мы внутри cond()
      if (track_undefined_values_for_cond.length > 0) {
        console.log('$$$ inside cond!')
      }*/
      if (expr instanceof Array) {
        // try to print using quotes, use plv8 !!!
        if (_vars["_quoting"] === 'explicit') {
          return expr.map(function (el) {
            return el;
          }).join(',');
        } else {
          return expr.map(function (el) {
            return quote_scalar(el);
          }).join(',');
        }
      }
      if (expr === undefined) {
        // значит по этому ключу нет элемента в _vars например !!!
        var defVal = track_undefined_values_for_cond[0];
        //console.log("$ CHECK " + defVal)
        if ((0,dist_lpe.isString)(defVal) || (0,dist_lpe.isNumber)(defVal) || defVal === null) {
          return defVal;
        } else {
          // ставим метку, что был резолвинг неопределённого значения
          track_undefined_values_for_cond[0] = true;
        }
        return '';
      }
      // May break compatibility WITH THE OLD templates !!!!!
      if (_vars["_quoting"] === 'explicit') {
        return expr;
      } else {
        // Old style templates, try to auto quote...
        return db_quote_literal(expr);
      }
    };
    ctx['$'].ast = [[], {}, [], 1]; // mark as macro

    //  пока что считаем что у нас ОДИН аргумент и мы его интерпретируем как таблица.столбец
    ctx['parse_kv'] = function (expr) {
      if (expr instanceof Array) {
        if (expr[0] === '->') {
          var sql = 'select "' + expr[2] + '" from "' + expr[1] + '" where id = $1::INT';
          var id_val = resolve_literal(expr[1].replace(/.$/, "_id"));

          //console.log('SQL: ', sql, " val:", id_val);

          var res_json = plv8.execute(sql, [id_val]);
          //var res_json = [{"src_id":"$a:Вася:$b:Петя"}];
          var frst = res_json[0];

          //console.log('SQL RES: ', frst);

          if (frst !== undefined && frst[expr[2]] !== null && frst[expr[2]].length > 0) {
            var axis_condition = function (e) {
              var result = e.split(':').map(function (e2) {
                e2 = e2.replace(/\'/g, "''"); //' be safe
                return e2.indexOf('$') == 0 ? ' AND ' + e2.substr(1) + '=' : "'" + e2 + "'";
              }).join('').substr(5);
              return result;
            };
            var result = axis_condition(frst[expr[2]]);
            if (result === undefined || result.length == 0) return '(/*kv not resolved*/ 0=1)';
            return result;
          }
        }
      }
      // return everything, FIXME: is it right thing to do ?
      return '(/*parse_kv EMPTY*/ 1=1)';
    };
    ctx['parse_kv'].ast = [[], {}, [], 1]; // mark as macro

    // we should parse all logic: & | ! () but we are cheating at the moment....
    // NOTE: it is unrelated to cond func!!!
    ctx['parse_cond'] = function (expr) {
      if (expr instanceof Array) {
        if (expr[0] === '->') {
          var sql = 'select "' + expr[2] + '" from "' + expr[1] + '" where id = $1::INT';
          var id_val = resolve_literal(expr[1].replace(/.$/, "_id"));

          //console.log('SQL: ', sql, " val:", id_val);

          var res_json = plv8.execute(sql, [id_val]);
          //var res_json = [{"src_id":"dor_id=96&obj_id=64024775"}];
          var frst = res_json[0];

          //console.log('SQL RES: ', frst);

          if (frst !== undefined && frst[expr[2]] !== null && frst[expr[2]].length > 0) {
            var axis_condition = function (e) {
              var result = e.split('&').map(function (e2) {
                return e2;
              }).join(' and ');
              return result;
            };
            var result = axis_condition(frst[expr[2]]);
            if (result === undefined || result.length == 0) return '(/*cond not resolved*/ 0=1)';
            return result;
          }
        }
      }
      // return everything, FIXME: is it right thing to do ?
      return '(/*parse_cond EMPTY*/ 1=1)';
    };
    ctx['parse_cond'].ast = [[], {}, [], 1]; // mark as macro

    var ret = [];
    //console.log("where IN: ", JSON.stringify(Array.prototype.slice.call(arguments)));

    var fts = _vars['fts'];
    var tree = arguments;
    if (fts !== undefined && fts.length > 0) {
      fts = fts.replace(/\'/g, "''"); //' be safe
      // Full Text Search based on column_list
      if (typeof _vars['_columns'] == 'object') {
        let generator_func = col => col["search"] !== undefined ? ["ilike", col["search"], ["'", '%' + fts + '%']] : null;
        var ilike = Object.values(_vars['_columns']).map(generator_func).filter(el => el !== null).reduce((ac, el) => ac ? ['or', ac, el] : el, null) || [];
        console_console.log("FTS PARSED: ", JSON.stringify(ilike));
        //console.log( "FTS PARSED: ",  JSON.stringify(tree));

        if (ilike !== undefined && ilike.length > 0) {
          // добавляем корень AND с нашим поиском
          if (tree[0]) {
            tree = [["and", tree[0], ['()', ilike]]];
          } else {
            tree = [['()', ilike]];
          }
        }
      }
    }

    // Проверяем волшебный ключ в контексте _rls_filters
    let rls = _vars["_rls_filters"];
    if ((0,dist_lpe.isArray)(rls) && rls.length > 0) {
      // добавляем корень AND с нашими фильтрами
      if (tree[0]) {
        tree = [["and", tree[0], ['()', rls]]];
      } else {
        tree = [['()', rls]];
      }
    }
    for (var i = 0; i < tree.length; i++) {
      // console.log("array ", JSON.stringify(Array.prototype.slice.call(tree[i])));
      ret.push(prnt(tree[i], ctx));
    }
    var r = ret[0]; // у нас только один результат должен быть !!!
    if (r == undefined) {
      r = '';
    }
    return r;
  };
  _context['filter'].ast = [[], {}, [], 1]; // mark as macro

  // where - we should not eval arguments, so we must mark where as macro!!!
  _context['where'] = function () {
    // we should always get ONE argument, for example: ["=",["$",["->","period","title"]],3]
    // BUT if we get two, or more arguments, we eval them one by one, AND combine later with AND operand, skipping empty results...
    var tree = arguments;
    var ret = [];
    if (tree.length > 0) {
      for (var i = 0; i < tree.length; i++) {
        // console.log("array ", JSON.stringify(Array.prototype.slice.call(tree[i])));
        var r = (0,dist_lpe.eval_lisp)(["filter", tree[i]], _context); // r should be string
        if (r.length > 0) {
          ret.push(r);
        }
      }
    } else {
      var r = (0,dist_lpe.eval_lisp)(["filter"], _context); // r should be string
      if (r.length > 0) {
        ret.push(r);
      }
    }
    if (ret.length > 0) {
      if (ret.length > 1) {
        return 'WHERE (' + ret.join(') AND (') + ')';
      } else {
        return 'WHERE ' + ret[0];
      }
    } else {
      return 'WHERE TRUE';
    }
  };
  _context['where'].ast = [[], {}, [], 1]; // mark as macro

  return _context;
}
function eval_sql_where(_expr, _vars) {
  if (typeof _vars === 'string') _vars = JSON.parse(_vars);
  var sexpr = (0,dist_lpe.parse)(_expr);

  //console.log('sql_where parse: ', JSON.stringify(sexpr));

  if (sexpr instanceof Array && (sexpr[0] === 'filter' && sexpr.length <= 2 || sexpr[0] === 'order_by' || sexpr[0] === 'if' || sexpr[0] === 'where' || sexpr[0] === 'pluck' || sexpr[0] === 'str' || sexpr[0] === 'prnt' || sexpr[0] === 'cond' || sexpr[0] === 'filters' || sexpr[0] === '->' // it is dot operator, FIXME: add correct function call check !
  )) {
    // ok
    if (sexpr[0] === 'order_by' && (0,dist_lpe.isString)(_vars['sort']) && _vars['sort'].length > 0) {
      // we should inject content of the sort key, which is coming from the GUI.
      // do it in a safe way
      var extra_srt_expr = (0,dist_lpe.parse)(`order_by(${_vars['sort']})`);
      //console.log('sql_where ORDER BY MIXED0: ', JSON.stringify(extra_srt_expr));
      //console.log('sql_where ORDER BY MIXED1: ', JSON.stringify(_vars));
      sexpr = sexpr.concat(extra_srt_expr.slice(1));
      //console.log('sql_where ORDER BY MIXED: ', JSON.stringify(sexpr));
    } else {
      if (sexpr[0] === 'cond') {
        sexpr = ["filter", ["cond", sexpr[1], sexpr[2]]];
      }
    }
  } else {
    throw "Found unexpected top-level func: " + sexpr[0];
  }
  var _context = sql_where_context(_vars);
  var ret = (0,dist_lpe.eval_lisp)(sexpr, _context);

  // console.log('ret: ',  JSON.stringify(ret));
  return ret;
}
;// ./src/sql_context.js
/**
    Copyright (c) 2019 Luxms Inc.

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the Software
    is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/






// polyfill = remove in 2020 !!!

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
function sql_context(_vars) {
  var _context = sql_where_context(_vars);

  /* заполняем контекст функциями и макросами, заточенными на SQL */
  _context['sql'] = function () {
    var q; // resulting sql
    var args = Array.prototype.slice.call(arguments);
    //console.log('SQL IN: ', args);

    // use sql-struct!
    var command = ["sql-struct"].concat(args);
    var struct = (0,dist_lpe.eval_lisp)(command, _context);
    q = `${struct["select"]} ${struct["from"]}`;
    if (struct["where"] !== undefined) {
      q = `${q} WHERE ${struct["where"]}`;
    }
    if (struct["group_by"] !== undefined) {
      q = `${q} ${struct["group_by"]}`;
    }
    if (struct["order_by"] !== undefined) {
      q = `${q} ${struct["order_by"]}`;
    }
    if (struct["limit_offset"] !== undefined) {
      if (_vars["_target_database"] === 'oracle') {
        q = `SELECT * FROM (
          ${q}
        ) WHERE ${struct["limit_offset"]}`;
      } else {
        q = `${q} ${struct["limit_offset"]}`;
      }
    }
    return q;
  };
  _context['sql'].ast = [[], {}, [], 1]; // mark as macro

  /* возвращает структуру запроса, при этом все элементы уже превращены в TEXT */
  _context['sql-struct'] = function () {
    var q = {
      "select": undefined,
      "from": undefined,
      "where": undefined,
      "order_by": undefined,
      "limit_offset": undefined,
      "group_by": undefined
    }; // resulting sql

    var args = Array.prototype.slice.call(arguments);
    //console.log('SQL-STRUCT IN: ', args);

    var find_part = function (p) {
      return args.find(el => p == el[0]);
    };
    var sel = find_part('select');
    //console.log('FOUND select: ', sel);
    q.select = (0,dist_lpe.eval_lisp)(sel, _context);
    var from = find_part('from');
    //console.log('FOUND from: ', from);
    q.from = (0,dist_lpe.eval_lisp)(from, _context);
    var where = find_part('filter');
    //console.log("FOUND where: ", where);
    if (where instanceof Array && where.length > 1) {
      q.where = (0,dist_lpe.eval_lisp)(where, _context);
    }
    var grp = find_part('group_by');
    //console.log('FOUND group_by: ', grp);
    if (grp instanceof Array && grp.length > 1) {
      q.group_by = (0,dist_lpe.eval_lisp)(grp, _context);
    }
    var srt = find_part('order_by');
    //console.log('FOUND sort: ', srt);
    if (srt instanceof Array && srt.length > 1) {
      q.order_by = (0,dist_lpe.eval_lisp)(srt, _context);
    }

    //slice(offset, pageItemsNum)
    var s = find_part('slice');
    //console.log("FOUND slice: ", s);
    if (s instanceof Array && s.length > 1) {
      q.limit_offset = (0,dist_lpe.eval_lisp)(s, _context);
    }
    return q;
  };
  _context['sql-struct'].ast = [[], {}, [], 1]; // mark as macro

  function prnt(a) {
    //console.log('prnt IN: ', a);
    if (a instanceof Array) {
      if (a.length > 0) {
        if (a[0] === '::' && a.length == 3) {
          return a[1] + '::' + a[2];
        } else if (a[0] === ':') {
          return (0,dist_lpe.eval_lisp)(a, _context);
          //return prnt(a[1]) + ' as "' + a[2].replace(/"/,'\\"') + '"';
        } else if (a[0] === "->") {
          // наш LPE использует точку, как разделитель вызовов функций и кодирует её как ->
          // в логических выражениях мы это воспринимаем как ссылку на <ИМЯ СХЕМЫ>.<ИМЯ ТАБЛИЦЫ>
          // return '"' + a[1] + '"."' + a[2] + '"';
          return (0,dist_lpe.eval_lisp)(a, _context);
        } else {
          return a[0] + '(' + a.slice(1).map(function (argel) {
            return prnt(argel);
          }).join(',') + ')';
        }
      } else {
        return '';
      }
    } else {
      return a;
    }
  }

  // table.column
  _context['->'] = function () {
    var a = Array.prototype.slice.call(arguments);
    //console.log("->   " + JSON.stringify(a));
    return a.join('.');
  };
  _context[':'] = function () {
    var a = Array.prototype.slice.call(arguments);
    //console.log("->   " + JSON.stringify(a));
    return prnt(a[0]) + ' as ' + a[1].replace(/"/, '\\"');
  };

  // должен вернуть СТРОКУ
  _context['select'] = function () {
    var a = Array.prototype.slice.call(arguments);
    //console.log("select IN: ",  JSON.stringify(a));
    if (a.length < 1) {
      return "SELECT *";
    } else {
      return "SELECT " + a.map(prnt).join(',');
    }
  };
  _context['select'].ast = [[], {}, [], 1]; // mark as macro

  _context['from'] = function () {
    var a = Array.prototype.slice.call(arguments);
    //console.log('from IN: ', a);
    if (a.length < 1) {
      return "";
    } else {
      return "FROM " + a.map(prnt).join(', ');
    }
  };
  _context['from'].ast = [[], {}, [], 1]; // mark as macro

  _context['slice'] = function () {
    var a = Array.prototype.slice.call(arguments);
    //console.log('slice IN: ', a);
    if (a.length < 1) {
      return "";
    } else {
      if (_vars["_target_database"] === 'oracle') {
        if (parseInt(a[0]) === 0) {
          return `ROWNUM <= ${parseInt(a[1])}`;
        } else {
          return `ROWNUM > ${parseInt(a[0])} AND ROWNUM <= ${parseInt(a[1]) + parseInt(a[0])}`;
        }
      } else if (_vars["_target_database"] === 'sqlserver') {
        return `OFFSET ${parseInt(a[0])} ROWS FETCH NEXT ${parseInt(a[1])} ROWS ONLY`;
      } else {
        return `LIMIT ${parseInt(a[1])} OFFSET ${parseInt(a[0])}`;
      }
    }
  };
  _context['slice'].ast = [[], {}, [], 1]; // mark as macro

  _context['group_by'] = function () {
    var a = Array.prototype.slice.call(arguments);
    if (a.length === 0) {
      return "";
    } else {
      return "GROUP BY " + a.join(' , ');
    }
  };
  return _context;
}

/*
Это не дописано!!! Идея была сделать синтаксис, похожий на htSQL. типа +table(col1,col2).where(col1>3)
но например, как указать схему? сейчас парсер фигню выдаёт, так как точка не всегда корректно отрабатывает +sch.table(col1,col2)
Тщательнее надо....

select lpe.eval_sql_expr($$metrics(id).where(id='abcd')$$);


Примеры htSQL:
/course.filter(credits<3).select(department_code, no, title)
/course.sort(credits-).limit(10){department_code, no, credits}
/course.limit(10).sort(credits-){department_code, no, credits}

То есть, у нас имя таблицы идёт первым в любом случае. В LuxPath предлагаю использовать
комюинацию htSQL select и список столбцов {} в одном макросе +имя_таблицы(...)
мы будем использовать + вместо / Но слэш в htSQL не является частью синтаксиса, имя таблицы просто всегда идёт первым!!!

*/

function eval_sql_expr(_expr, _vars) {
  var ctx = sql_context(_vars);
  var _context = ctx;
  // for(var key in _vars) _context[key] = _vars[key];

  _context['sql->entrypoint'] = function () {
    //console.log("++++++++++++++++++");
    var ret = [];
    for (var i = 0; i < arguments.length; i++) {
      ret.push((0,dist_lpe.eval_lisp)(arguments[i], _context));
      //console.log(JSON.stringify(ret));
    }
    return ret.join(',');
  };
  _context['sql->entrypoint'].ast = [[], {}, [], 1]; // mark as macro

  var sexpr = (0,dist_lpe.parse)(_expr);
  //console.log("parsed eval_sql_expr IN: ", sexpr);

  /*
  if (ctx.hasOwnProperty('where')){
    console.log('W O W');
  }
  */

  // точка входа всегда должна быть sql->entrypoint, так как мы определили sql->entrypoint как макроc чтобы иметь возможность
  // перекодировать имена таблиц в вызов .from()
  // а parse возвращает нам ->, так что меняем!
  if (sexpr[0] === '->') {
    sexpr[0] = 'sql->entrypoint';
  }
  if (sexpr[0] !== 'sql->entrypoint') {
    sexpr = ['sql->entrypoint', sexpr];
  }

  // теперь нужно пройтись по списку вызовов и привести к нормальной форме.
  // в нормальной форме всё выглядит вот так: (seq sql(select() from()) sql(...) sql(...) )
  // ["seq",["metrics","a","d",["max","c"]],["where"]]
  // ["seq",["+",["metrics","a","d",["max","c"]]],["where"]]

  /* на вход прилетает IN:
    metrics(a,d,max(c)).where(a>1 and i < 4).periods.where(a>4)
    ["seq",["metrics","a","d",["max","c"]],["where",["and",[">","a","1"],["<","i","4"]]],"periods",["where",[">","a","4"]]]
    ["seq",["sql",["select","a","d",["max","c"]],["from","metrics"],["filter",["and",[">","a","1"],["<","i","4"]]]],["sql",["select"],["from","periods"],["filter",[">","a","4"]]]]
  */

  var sql = ['sql'];
  var do_select_from = function (sel) {
    if (!(sel instanceof Array)) {
      sel = [sel];
    }
    var fr = sel[0];
    var p = false;
    if (fr != 'where' && fr != 'select' && fr != 'sort' && fr != 'filter' && fr != 'from' && fr != 'slice') {
      sel[0] = 'select';
      p = true;
    }
    sql.push(sel);
    if (p) {
      sql.push(["from", fr]);
    }
    //console.log("parse do_select_from: ", sql);
  };
  for (var i = 1; i < sexpr.length; i++) {
    var expr = sexpr[i];
    if (expr instanceof Array) {
      // expr: ["metrics","a","d",["max","c"]]
      // if (expr[0] === 'order_by') {expr[0]='sort'};
      if (expr[0] === 'where') {
        expr[0] = 'filter';
      }
      ;
      if (expr[0] === '+') {
        // expr: ["+",["metrics","a","d",["max","c"]]]
        do_select_from(expr[1]);
      } else if (_context[expr[0].toString()] === undefined) {
        // это имя таблицы... так как мы проверили на ключевые слова,
        // распознаваемые нашим интерпретатором
        // expr: ["metrics","a","d",["max","c"]]
        do_select_from(expr);
      } else {
        sql.push(sexpr[i]);
      }
    } else if (_context[expr.toString()] === undefined) {
      // это литерал = имя таблицы...
      // expr: "metrics"
      do_select_from(expr);
    } else {
      throw 'unexpected call: ' + JSON.stringify(expr);
    }
  }

  //console.log('parse: ', sql);

  var ret = (0,dist_lpe.eval_lisp)(sql, _context);
  // console.log("parse: ", ret);

  return ret;
}

/* returns struct, which is suitable to build full SQL text:
            {
                from: undefined,
                limit_offset: undefined,
                order_by: undefined,
                select: 'SELECT *',
                where: undefined,
                group_by: undefined
              }
*/
function parse_sql_expr(_expr, _vars, _forced_table, _forced_where) {
  var ctx = sql_context(_vars);
  var _context = ctx;
  // for(var key in _vars) _context[key] = _vars[key];

  if (_expr === null || _expr === '' || typeof _expr === "undefined") {
    _expr = 'filter()'; // that should generate empty struct
  }
  var sexpr = (0,dist_lpe.parse)(_expr);
  if (sexpr[0] === '->') {
    sexpr[0] = 'sql->entrypoint';
  }
  if (sexpr[0] !== 'sql->entrypoint') {
    // это значит, что на входе у нас всего один вызов функции, мы его обернём в ->
    sexpr = ['sql->entrypoint', sexpr];
  }
  //console.log("DBAPI IN: ", sexpr);

  /*
  if (ctx.hasOwnProperty('where')){
    console.log('W O W');
  }
  */

  // теперь нужно пройтись по списку вызовов и привести к нормальной форме.
  // в нормальной форме у нас должен быть один вызов sql() а внутри select().from().where()
  // причём
  // select(a,b) === select(a).select(b)
  // order_by(a,b) === order_by(a).order_by(b)
  // where(a>1).where(b<1) === where(a>1 and b<1)
  // from(a).from(b).from(c) === from(c)
  // в последнем случае берётся последний from, а все первые игнорятся, но см. test.js = там есть другой пример !!!!

  var sql = ['sql-struct']; // wrapped by sql call...
  var cache = {
    "filter": [],
    "select": [],
    "order_by": [],
    "from": [],
    "slice": []
  };
  for (var i = 1; i < sexpr.length; i++) {
    var expr = sexpr[i];
    if (expr instanceof Array) {
      var fr = expr[0];
      if (fr != 'where' && fr != 'select' && fr != 'order_by' && fr != 'from' && fr != ':' && fr != 'slice' && fr != 'filter') {
        throw 'unexpected func: ' + JSON.stringify(fr);
      }
      // have no idea how to support aliases for selects...
      if (fr === ':' && expr[1][0] === 'select') {
        cache["select"].push(expr[1]);
      } else {
        if (fr === 'where') {
          fr = 'filter';
        }
        cache[fr].push(expr);
      }
    } else {
      throw 'unexpected literal: ' + JSON.stringify(expr);
    }
  }
  if (_forced_table !== undefined) {
    cache[fr].push(["from", _forced_table]);
  }

  //console.log("DEBUG", JSON.stringify(cache));

  var args = cache["select"].map(ar => ar.slice(1));
  var sel = [].concat.apply(["select"], args); //flat
  sql.push(sel);
  var f = cache["from"].pop();
  if (f) {
    sql.push(f);
  }
  f = cache["order_by"].pop();
  if (f) {
    sql.push(f);
  }
  f = cache["slice"].pop();
  if (f) {
    sql.push(f);
  }
  args = cache["filter"].map(ar => ar.slice(1));
  args = [].concat.apply([], args); //flat

  if (args.length > 0) {
    var w = ["()", args[0]];
    if (args.length > 1) {
      for (var i = 1; i < args.length; i++) {
        w = ["and", w, ["()", args[i]]];
      }
    }
    sql.push(["filter", w]);
  }

  //console.log("WHERE", JSON.stringify(w));

  //console.log('DBAPI parse: ', sql);

  var ret = (0,dist_lpe.eval_lisp)(sql, _context);
  return ret;
}
function generate_report_sql(_cfg, _vars) {
  var ctx = sql_context(_vars);
  var _context = ctx;
  /* Для генерации SELECT запросов из конфигов, созданных для Reports */

  /* while we wrapping aggregate functions around columns, we should keep track of the free columns, so we will be able to
     generate correct group by !!!!
  */
  var group_by = _cfg["columns"].map(h => h["id"]);
  var wrap_aggregate_functions = (col, cfg, col_id) => {
    ret = col;
    // Empty agg arrays can be used for AGGFN type ! We happily support it
    if (Array.isArray(cfg["agg"])) {
      group_by = group_by.filter(id => id !== col_id);
      var r = cfg["agg"].reduce((a, currentFunc) => `${currentFunc}( ${a} )`, ret);

      /* it is a special default formatter, which should be implemented per column with LPE!!!! DISABLED
      if (_context["_target_database"] === 'oracle' || _context["_target_database"] === 'postgresql') {
        // automatically format number
        r = `to_char( ${r}, '999G999G999G999G990D00')`
      }
      */
      return r;
    }
    return ret;
  };
  _context["column"] = function (col) {
    var col_info = reports_get_column_info(_cfg["sourceId"], col);
    var col_sql = col_info["sql_query"];
    if (col_sql.match(/^\S+$/) === null) {
      // we have whitespace here, so it is complex expression :-()
      return `${col_sql}`;
    }
    // we have just column name, prepend table alias !
    var parts = col.split('.');
    return `${parts[1]}.${col_sql}`;
  };
  _context['generate_sql_struct_for_report'] = function (cfg) {
    //console.log(JSON.stringify(cfg))
    if (typeof cfg === 'object' && Array.isArray(cfg)) {
      throw new Error("reports_sql expected {...} as argument");
    }

    /* нужно сгенерить что-то типа такого:
    [  'sql-struct',
    [
      'select',
      'a',
      'b',
      [ '->', 'department_code', 'alias' ],
      [ '::', 'no', 'TEXT' ],
      [ 'max', 'credits' ]
    ],
    [ 'from', [ '->', 'bm', 'tbl' ] ],
    [ 'order_by', 'a', [ '-', 'b' ] ],
    [ 'filter', [ '()', [Array] ] ]
    ]
    */
    /*
      var convert_in_to_eq = function(in_lpe){
        if (in_lpe[0] === 'in'){
          in_lpe[0] = '=';
        }
         in_lpe.map(el => {
           if (Array.isArray(el)) {
            convert_in_to_eq(el)
           }
          })
        return in_lpe;
      }*/

    const convert_in_to_eq = in_lpe => {
      if (!Array.isArray(in_lpe) || in_lpe.length === 0) return in_lpe;
      return [in_lpe[0] === 'in' ? '=' : in_lpe[0], ...in_lpe.slice(1).map(convert_in_to_eq)];
    };

    // на входе вложенная структура из конфига.
    // расчитываем, что структура создана в GUI и порядок следования элементов стандартный
    var quote_text_constants = in_lpe => {
      if (!Array.isArray(in_lpe)) return in_lpe;
      if (in_lpe[0] === 'IN') {
        // example: ["IN",["column","vNetwork.cluster"],["SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]]
        // Transform to AST form
        in_lpe[0] = 'in';
        in_lpe[2] = ['['].concat(in_lpe[2]);
        // and process further
      }

      //console.log("quote_text_constants" + JSON.stringify(in_lpe))
      if (in_lpe[0] === 'in') {
        if (Array.isArray(in_lpe[1])) {
          if (in_lpe[1][0] === 'column') {
            if (Array.isArray(in_lpe[2]) && in_lpe[2][0] === '[') {
              // ["=",["column","vNetwork.cluster"],["[","SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]]
              var info = reports_get_column_info(_cfg["sourceId"], in_lpe[1][1]);
              if (info["type"] === 'PERIOD' && _context["_target_database"] === 'oracle') {
                in_lpe[2] = ['['].concat(in_lpe[2].slice(1).map(el => ["to_date", ["ql", el], "'YYYY-MM-DD'"]));
              } else {
                in_lpe[2] = ['['].concat(in_lpe[2].slice(1).map(el => ["ql", el]));
              }
            }
          }
        }
      } else {
        if (in_lpe.length > 2 && in_lpe[0] !== 'not') {
          if (Array.isArray(in_lpe[1])) {
            if (in_lpe[1][0] === 'column') {
              if (!Array.isArray(in_lpe[2])) {
                // ANY OPERATOR
                // ["~",["column","vNetwork.cluster"],"SPB99-DMZ02"]
                var info = reports_get_column_info(_cfg["sourceId"], in_lpe[1][1]);
                if (info["type"] === 'PERIOD' && _context["_target_database"] === 'oracle') {
                  in_lpe[2] = ["to_date", ["ql", in_lpe[2]], "'YYYY-MM-DD'"];
                } else {
                  in_lpe[2] = ["ql", in_lpe[2]];
                }
              }
              if (in_lpe.length === 4) {
                // between
                if (!Array.isArray(in_lpe[3])) {
                  //["between",["column","vNetwork.period_month"],"2019-09-10","2019-09-20"]
                  var info = reports_get_column_info(_cfg["sourceId"], in_lpe[1][1]);
                  if (info["type"] === 'PERIOD' && _context["_target_database"] === 'oracle') {
                    in_lpe[3] = ["to_date", ["ql", in_lpe[3]], "'YYYY-MM-DD'"];
                    in_lpe[4] = ["to_date", ["ql", in_lpe[4]], "'YYYY-MM-DD'"];
                  } else {
                    in_lpe[3] = ["ql", in_lpe[3]];
                    in_lpe[4] = ["ql", in_lpe[4]];
                  }
                }
              }
            }
          }
        }
      }
      in_lpe.map(el => {
        //console.log("RECURS" + JSON.stringify(el))
        quote_text_constants(el);
      });
      return in_lpe;
    };
    var struct = ['sql'];
    var allSources = cfg["columns"].map(h => h["id"].split('.')[0]);
    var uniq = [...new Set(allSources)];
    if (uniq.length != 1) {
      throw new Error("We support select from one source only, joins are not supported! Sources detected: " + JSON.stringify(uniq));
    }
    var allTables = cfg["columns"].map(h => h["id"].split('.').slice(0, 2).join('.'));
    // !!!!!!!!!!!!! uniq will be used later in from!!!
    var uniqTables = [...new Set(allTables)];
    var join_struct = reports_get_join_path(uniqTables);
    if (join_struct.nodes.length === 0) {
      throw new Error("Can not find path to JOIN tables: " + JSON.stringify(uniqTables));
    }

    // HACK as we miss _cfg["sourceId"]
    var srcIdent = _cfg["sourceId"];
    if (srcIdent === undefined) {
      srcIdent = join_struct.nodes[0].split('.')[0];
    }
    let ds_info = get_data_source_info(srcIdent);
    _context["_target_database"] = ds_info["flavor"];

    // column should always be represented as full path source.cube.column
    // for aggregates we should add func names as suffix ! like source.cube.column.max_avg
    var sel = ['select'].concat(cfg["columns"].map(h => {
      var col_info = reports_get_column_info(cfg["sourceId"], h["id"]);
      var col_sql = col_info["sql_query"];
      var parts = h.id.split('.');
      //if ( col_sql.match( /^\S+$/ ) !== null ) {
      if (col_sql === parts[2]) {
        // we have just column name, prepend table alias !
        col_sql = `${parts[1]}.${col_sql}`;
      }

      // This is hack to implement AGGFN type !
      // aggFormula should be used in the same way as AGGFN
      if (col_info["config"]["aggFormula"] || col_info["type"] == "AGGFN") {
        // We should remove column from GROUP BY
        // group_by is global, it is sad but true
        group_by = group_by.filter(id => id !== h["id"]);
      }
      var wrapped_column_sql = wrap_aggregate_functions(col_sql, h, h["id"]);
      var as = `${h.id}`;
      if (Array.isArray(h["agg"])) {
        as = `"${h.id}.${h["agg"].join('.')}"`;
      }

      //return `${wrapped_column_sql} AS ${as}`
      // oracle has limit 30 chars in identifier!
      // we can skip it for now.
      return `${wrapped_column_sql}`;
      // return [':', `${wrapped_column_sql}`, 'abc']
    }));
    if (group_by.length === cfg["columns"].length) {
      group_by = ["group_by"];
    } else {
      // we should provide group_by!
      group_by = ["group_by"].concat(group_by.map(c => ["column", c]));
    }

    // will return something like     (select * from abc) AS a
    var from = ['from'].concat(join_struct.nodes.map(t => reports_get_table_sql(ds_info["flavor"], t)));
    var order_by = ['order_by'].concat(cfg["columns"].map(h => {
      if (h["sort"] == 1) {
        return ["+", ["column", h["id"]]];
      } else if (h["sort"] == 2) {
        return ["-", ["column", h["id"]]];
      }
    }));
    order_by = order_by.filter(function (el) {
      return el !== undefined;
    });
    var filt = cfg["filters"].map(h => {
      return h["lpe"] ? convert_in_to_eq(quote_text_constants(h["lpe"])) : null;
    }).filter(function (el) {
      return el !== null;
    });

    //console.log("========= reports_get_join_conditions " + JSON.stringify(join_struct))
    if (join_struct.nodes.length > 1) {
      filt = filt.concat(reports_get_join_conditions(join_struct));
    }
    if (filt.length > 1) {
      filt = ['and'].concat(filt);
    } else if (filt.length == 1) {
      filt = filt[0];
    }
    if (filt.length > 0) {
      filt = ["filter", filt];
    } else {
      filt = ["filter"];
    }
    struct.push(sel, from, order_by, filt, group_by);
    if (cfg["limit"] !== undefined) {
      var offset = cfg["offset"] || 0;
      struct.push(["slice", offset, cfg["limit"]]);
    }
    //console.log(JSON.stringify(struct))

    //console.log(`USING ${target_db_type} as target database`)
    var ret = (0,dist_lpe.eval_lisp)(struct, _context);
    return ret;
  };

  // по хорошему, надо столбцы засунуть в _context в _columns и подгрузить их тип из базы!!!
  // но мы типы столбцов будем определять здесь (в этой функции) и пытаться закавычить константы заранее....
  var ret = (0,dist_lpe.eval_lisp)(["generate_sql_struct_for_report", _cfg], _context);
  return ret;
}
;// ./src/utils/lpe_sql_tokenizer.js
// 2024-04-23

// (c) 2024 Luxms

//import console from '../console/console';

// Transform a token object into an exception object and throw it.
function LPESyntaxError(message) {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  // this.stack = (new Error()).stack;
}
function makeError(t, message) {
  t.message = message;
  const errorDescription = JSON.stringify(t, ['name', 'message', 'from', 'to', 'key', 'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
  throw new LPESyntaxError(errorDescription);
}
function tokenize_sql_template(s) {
  let c; // The current character.
  let from = 0; // The index of the start of the token.
  let i = 0; // The index of the current character.
  let length = s.length;
  let q; // The quote character.
  let str = ''; // The string value.
  let result = []; // An array to hold the results.
  let nested_curvy_level = 0;
  const make = (type, value, adjustFrom = 0, adjustTo = 0) => ({
    type,
    value,
    from: from + adjustFrom,
    to: i + adjustTo
  }); // Make a token object.

  // If the source string is empty, return nothing.
  if (!s) {
    return [];
  }

  // Loop through this text, one character at a time.
  c = s.charAt(i);
  while (c) {
    //console.log(`i=${i} c=${c} str=${str}`)

    if (c === '$') {
      i += 1;
      c = s.charAt(i); // look ahead
      if (c === '{') {
        // LPE mode on
        // FIXME: check symbol before $: \${} is not lpe but \\${} is lpe!
        let lpe = '';
        // report accumulated text before ${
        if (str != '') {
          result.push(make('literal', str, 0, -2));
          str = '';
        }
        from = i + 1;
        nested_curvy_level = 0;
        // READ INSIDE LPE
        for (;;) {
          i += 1;
          c = s.charAt(i);
          if (c === '{') {
            nested_curvy_level += 1;
            lpe += '{';
          } else if (c === '}') {
            if (nested_curvy_level === 0) {
              result.push(make('lpe', lpe, -2, 0));
              i += 1;
              c = s.charAt(i);
              from = i;
              break;
            } else {
              nested_curvy_level -= 1;
              lpe += '}';
            }
          } else if (c === '\'' || c === '"') {
            lpe += c;
            q = c;
            i += 1;
            // READ IN THE STRING QUOTE
            for (;;) {
              c = s.charAt(i);
              if (c < ' ') {
                // make('string', str).error(c === '\n' || c === '\r' || c === '' ?
                //     "Unterminated string." :
                //     "Control character in string.", make('', str));
                makeError(make('', lpe) || make(q === '"' ? 'string_double' : 'string_single', lpe), c === '\n' || c === '\r' || c === '' ? "Unterminated string." : "Control character in string.");
              }

              // Look for the closing quote.

              if (c === q) {
                lpe += q;
                break;
              }

              // Look for escapement.

              if (c === '\\') {
                i += 1;
                if (i >= length) {
                  makeError(make(q === '"' ? 'string_double' : 'string_single', lpe), "Unterminated string");
                }
                c = s.charAt(i);
                switch (c) {
                  case 'b':
                    c = '\b';
                    break;
                  case 'f':
                    c = '\f';
                    break;
                  case 'n':
                    c = '\n';
                    break;
                  case 'r':
                    c = '\r';
                    break;
                  case 't':
                    c = '\t';
                    break;
                  case 'u':
                    if (i >= length) {
                      makeError(make(q === '"' ? 'string_double' : 'string_single', lpe), "Unterminated string");
                    }
                    c = parseInt(s.substr(i + 1, 4), 16);
                    if (!isFinite(c) || c < 0) {
                      makeError(make(q === '"' ? 'string_double' : 'string_single', lpe), "Unterminated string");
                    }
                    c = String.fromCharCode(c);
                    i += 4;
                    break;
                }
              }
              lpe += c;
              i += 1;
            }
          } else if (c === '') {
            // overflow }
            if (nested_curvy_level !== 0) {
              makeError(make('lpe', lpe), "Unbalanced {}");
            } else {
              makeError(make('lpe', lpe), "EOT reached in LPE expression");
            }
          } else {
            lpe += c;
          }
        }
        if (nested_curvy_level !== 0) {
          makeError(make('lpe', lpe), "--> Unbalanced {}");
        }
      } else {
        str += '$';
      }
    } else {
      str += c;
      i += 1;
      c = s.charAt(i);
    }
  }
  if (str) {
    result.push(make('literal', str, 0, -1));
  }
  return result;
}

// export default tokenize_sql_template;
;// ./src/funcs/agg.js
function generateAggContext(v) {
  let _variables = v;
  function median(col) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `quantile(0.5)(${col})`;
    } else if (_variables._target_database === 'postgresql' || _variables._target_database === 'oracle') {
      return `percentile_cont(0.5) WITHIN GROUP (ORDER BY ${col} DESC)`;
    } else if (_variables._target_database === 'teradata' || _variables._target_database === 'sap') {
      return `median(${col})`;
    } else {
      throw Error(`median() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function quantile(col, q) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `quantileExactLow(${q})(${col})`;
    } else if (_variables._target_database === 'postgresql' || _variables._target_database === 'oracle') {
      return `percentile_disc(${q}) WITHIN GROUP (ORDER BY ${col} ASC)`;
    } else {
      throw Error(`median() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function mode(col) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `arrayElement(topK(1)(${col}),1)`;
    } else if (_variables._target_database === 'postgresql') {
      return `mode() WITHIN GROUP (ORDER BY ${col})`;
    } else if (_variables._target_database === 'oracle') {
      return `STATS_MODE(${col})`;
    } else {
      throw Error(`mode() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function varPop(col) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `varPop(${col})`;
    } else if (_variables._target_database === 'postgresql' || _variables._target_database === 'oracle' || _variables._target_database === 'teradata' || _variables._target_database === 'vertica' || _variables._target_database === 'sap') {
      return `var_pop(${col})`;
    } else if (_variables._target_database === 'sqlserver') {
      return `VarP(${col})`;
    } else {
      throw Error(`var_pop() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function varSamp(col) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `varSamp(${col})`;
    } else if (_variables._target_database === 'postgresql' || _variables._target_database === 'oracle' || _variables._target_database === 'teradata' || _variables._target_database === 'vertica' || _variables._target_database === 'sap') {
      return `var_samp(${col})`;
    } else if (_variables._target_database === 'sqlserver') {
      return `Var(${col})`;
    } else {
      throw Error(`var_samp() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function stddevSamp(col) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `stddevSamp(${col})`;
    } else if (_variables._target_database === 'postgresql' || _variables._target_database === 'oracle' || _variables._target_database === 'teradata' || _variables._target_database === 'vertica' || _variables._target_database === 'sap') {
      return `stddev_samp(${col})`;
    } else if (_variables._target_database === 'sqlserver') {
      return `Stdev(${col})`;
    } else {
      throw Error(`var_samp() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function stddevPop(col) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `stddevPop(${col})`;
    } else if (_variables._target_database === 'postgresql' || _variables._target_database === 'oracle' || _variables._target_database === 'teradata' || _variables._target_database === 'vertica' || _variables._target_database === 'sap') {
      return `stddev_pop(${col})`;
    } else if (_variables._target_database === 'sqlserver') {
      return `StdevP(${col})`;
    } else {
      throw Error(`var_samp() is not implemented for ${_variables._target_database} yet`);
    }
  }
  function corr(c1, c2) {
    _variables["_result"]["agg"] = true;
    return `corr(${c1}, ${c2})`;
    //throw Error(`mode() is not implemented for ${_context._target_database} yet`)
  }

  // COUNT(CASE WHEN A = 42 THEN 1 END)
  function countIf(cond) {
    _variables["_result"]["agg"] = true;
    if (_variables._target_database === 'clickhouse') {
      return `countIf(${cond})`;
    } else {
      return `COUNT(CASE WHEN ${cond} THEN 1 END)`;
    }
    //throw Error(`mode() is not implemented for ${_context._target_database} yet`)
  }
  return {
    'median': median,
    'quantile': quantile,
    'mode': mode,
    'varPop': varPop,
    'varSamp': varSamp,
    'stddevSamp': stddevSamp,
    'stddevPop': stddevPop,
    'corr': corr,
    'countIf': countIf
  };
}
;// ./src/funcs/calendar.js


/**
 * _variables
 ** _target_database
 * -
 *
 */

function generateCalendarContext(v) {
  let _variables = v;
  function getNotImplementedException(func) {
    return Error(`${func}() is not implemented for ${_variables._target_database} yet`);
  }
  function fullUnitToChar(u) {
    if (fullUnitIs(u, "y")) return "y";
    if (fullUnitIs(u, "i")) return "i";
    if (fullUnitIs(u, "q")) return "q";
    if (fullUnitIs(u, "m")) return "m";
    if (fullUnitIs(u, "w")) return "w";
    if (fullUnitIs(u, "d")) return "d";
  }
  const fullUnitFuncs = {
    y: u => ["YEAR", "year"].includes(u),
    i: u => ["IYYY", "iyyy"].includes(u),
    q: u => ["Q", "quarter"].includes(u),
    m: u => ["MONTH", "month"].includes(u),
    w: u => ["IW", "WW", "week"].includes(u),
    d: u => ["DD", "DAY", "day"].includes(u)
  };
  function fullUnitIs(fullUnit, u) {
    return fullUnitFuncs[u](fullUnit);
  }
  function toFullUnit(u) {
    let fver = 1;
    if (["teradata", "vertica", "oracle"].includes(_variables._target_database)) {
      fver = 0;
    }
    if (/^'?\s*(?:y|year)\s*'?$/i.test(u)) {
      return {
        0: 'YEAR',
        1: 'year'
      }[fver];
    }
    if (/^'?\s*(?:i|isoyear|iyyy)\s*'?$/i.test(u)) {
      return {
        0: 'IYYY',
        1: 'iyyy'
      }[fver];
    }
    if (/^'?\s*(?:q|quarter)\s*'?$/i.test(u)) {
      return {
        0: 'Q',
        1: 'quarter'
      }[fver];
    }
    if (/^'?\s*(?:m|month)\s*'?$/i.test(u)) {
      return {
        0: 'MONTH',
        1: 'month'
      }[fver];
    }
    if (/^'?\s*(?:w|week|ww)\s*'?$/i.test(u)) {
      return {
        0: 'IW',
        1: 'week'
      }[fver];
    }
    if (/^'?\s*(?:d|day)\s*'?$/i.test(u)) {
      return {
        0: 'DD',
        1: 'day'
      }[fver];
    }
    return u;
  }
  function toIntervalUnit(u) {
    let uu = toFullUnit(u);
    if (fullUnitIs(uu, "y")) return "year";
    if (fullUnitIs(uu, "m")) return "month";
    if (fullUnitIs(uu, "d")) return "day";
    throw getNotImplementedException(`toIntervalUnit(${uu})`);
  }

  /**
   * попытка определить, что параметр - это просто закавыченная строка в понятном формате,
   * и если это так, то  нужно сделать адаптацию для SQL базы
   * @param {date} dt SQL дата или строка в формате 'YYYY-MM-DD'
   * @returns SQL выражение для получения даты
   */
  function adapt_date(dt) {
    if (/^'\d{4}-\d{2}-\d{2}'$/.test(dt)) {
      let res = {
        clickhouse: `toDate(${dt}, '%Y-%m-%d')`,
        mysql: `STR_TO_DATE(${dt}, '%Y-%m-%d')`,
        sqlserver: `CONVERT(DATE, ${dt}, 102)`,
        default: `TO_DATE(${dt}, 'YYYY-MM-DD')`
      };
      return res[_variables._target_database] || res["default"];
    }
    return dt;
  }

  /**
   * Получение дату начала периода
   * @todo Сделать поддержку времени
   *
   * @example toStart(today(), 'month')
   * @example toStart('month')
   *
   * @param {date | string} one Дата для поиска начала периода | unit
   * @param {string | undefined} two unit | undefinde
   * @returns SQL выражение для получения даты начала периода
   */
  function toStart(one, two) {
    if (two === undefined) {
      return toStartImpl(today(), one);
    }
    return toStartImpl(one, two);
  }

  /**
   * Получение даты начала периода
   * @param {date} start Дата для поиска начала периода
   * @param {string} unit Период, начало которого необходимо найти
   * @returns SQL выражение для получения даты начала периода
   */
  function toStartImpl(start, unit) {
    let adaptedDate = adapt_date(start);
    let fullUnit = toFullUnit(unit);
    let result = false;
    switch (_variables._target_database) {
      case "teradata":
      case "vertica":
      case "oracle":
        result = `TRUNC(${adaptedDate}, '${fullUnit}')`;
        break;
      case "clickhouse":
        result = fullUnitIs(fullUnit, "i") ? `toStartOfISOYear(${adaptedDate})` : `DATE_TRUNC('${fullUnit}', ${adaptedDate})`;
        break;
      case "postgresql":
        result = fullUnitIs(fullUnit, "i") ? `TO_DATE(SUBSTRING(${isow(adaptedDate)}, 1, 4)||'-01', '${fullUnit}-iw')` : `DATE_TRUNC('${fullUnit}', ${adaptedDate})`;
        break;
      case "sqlserver":
        result = fullUnitIs(fullUnit, "w") ? `DATEADD(${fullUnit}, DATEDIFF(${fullUnit}, 0, ${dateShiftImpl(adaptedDate, -1, "d")}), 0)` : fullUnitIs(fullUnit, "i") ? dateShiftImpl(toStartImpl(adaptedDate, "w"), `-(${woty(adaptedDate)} - 1) * 7`, "d") : `DATEADD(${fullUnit}, DATEDIFF(${fullUnit}, 0, ${adaptedDate}), 0)`;
        break;
      case "mysql":
        result = {
          y: `STR_TO_DATE(DATE_FORMAT(${adaptedDate}, '%Y-01-01'), '%Y-%m-%d')`,
          i: `CAST(${adaptedDate} as date) - INTERVAL WEEKDAY(${adaptedDate}) DAY - INTERVAL (DATE_FORMAT(${adaptedDate}, '%v') - 1) WEEK`,
          q: `MAKEDATE(YEAR(${adaptedDate}), 1) + INTERVAL (QUARTER(${adaptedDate}) - 1) QUARTER`,
          m: `STR_TO_DATE(DATE_FORMAT(${adaptedDate}, '%Y-%m-01'), '%Y-%m-%d')`,
          w: `CAST(${adaptedDate} as date) - INTERVAL WEEKDAY(${adaptedDate}) DAY`,
          d: `${adaptedDate}`
        }[fullUnitToChar(fullUnit)];
        break;
      case "sap":
        result = {
          y: `TO_DATE(TO_CHAR(${adaptedDate}, 'YYYY') || '-01-01' , 'YYYY-MM-DD')`,
          i: `ADD_DAYS(ADD_DAYS(TO_DATE(${adaptedDate}), - TO_CHAR(${adaptedDate}, 'D') + 1), -(SUBSTRING(ISOWEEK(${adaptedDate}), 7) - 1) * 7)`,
          q: `CASE SUBSTRING(QUARTER(${adaptedDate}), 7, 1)
          WHEN 1 THEN TO_DATE(TO_CHAR(${adaptedDate}, 'YYYY') || '-01-01' , 'YYYY-MM-DD')
          WHEN 2 THEN TO_DATE(TO_CHAR(${adaptedDate}, 'YYYY') || '-04-01' , 'YYYY-MM-DD')
          WHEN 3 THEN TO_DATE(TO_CHAR(${adaptedDate}, 'YYYY') || '-07-01' , 'YYYY-MM-DD')
          WHEN 4 THEN TO_DATE(TO_CHAR(${adaptedDate}, 'YYYY') || '-10-01' , 'YYYY-MM-DD') END`,
          m: `TO_DATE(TO_CHAR(${adaptedDate}, 'YYYY-MM') || '-01' , 'YYYY-MM-DD')`,
          w: `ADD_DAYS(${adaptedDate}, -TO_CHAR(${adaptedDate}, 'D') + 1)`,
          d: `${adaptedDate}`
        }[fullUnitToChar(fullUnit)].replace("\s+", " ");
        break;
    }
    if (result) return result;
    throw getNotImplementedException("toStart");
  }

  /**
   * Получение даты окончания периода
   * @todo Сделать поддержку времени
   *
   * @example toEnd(today(), 'month')
   * @example toEnd('month')
   *
   * @param {date | string} one Дата для поиска начала периода | unit
   * @param {string | undefined} two unit | undefinde
   * @returns SQL выражение для получения даты окончания периода
   */
  function toEnd(one, two) {
    if (two === undefined) {
      return toEndImpl(today(), one);
    }
    return toEndImpl(one, two);
  }

  /**
   * Получение даты окончания периода
   * @todo Сделать поддержку времени
   *
   * @param {date} one Дата для поиска начала периода
   * @param {string} two unit
   * @returns SQL выражение для получения даты окончания периода
   */
  function toEndImpl(start, unit) {
    let adaptedDate = adapt_date(start);
    let fullUnit = toFullUnit(unit);
    if (fullUnitIs(fullUnit, "d")) {
      return toStartImpl(start, unit);
    }
    return `CAST((${dateShiftImpl(dateShiftImpl(toStartImpl(start, unit), 1, unit), -1, "d")}) AS DATE)`;
  }

  /**
   * Получение текущей даты
   * @returns SQL выражение для получения текущей даты
   */
  function today() {
    if (_variables._target_database === 'sqlserver') {
      return 'GETDATE()';
    } else if (_variables._target_database === 'clickhouse') {
      return 'today()';
    } else {
      return 'CURRENT_DATE';
    }
  }

  /**
   * Получение текущего TIMESTAMP
   * @returns SQL выражение для получения текущего TIMESTAMP
   */
  function now() {
    if (_variables._target_database === 'clickhouse') {
      return 'now()';
    }
    return 'CURRENT_TIMESTAMP'; // https://stackoverflow.com/questions/385042/sql-server-equivalent-of-mysqls-now
  }

  /**
   * Сдвинуть дату на определенный период
   *
   * @example shiftPeriod(today(), -1, 'month')
   * @example shiftPeriod(-1, 'month')
   *
   * @param {date | int} one Дата для поиска начала периода | Количество unit
   * @param {int | string} two Количество unit | unit
   * @param {string | undefined} three unit | undefined
   * @returns SQL выражение для получения даты со сдвигом
   */
  function dateShift(one, two, three) {
    if (three === undefined) {
      return dateShiftImpl(today(), one, two);
    }
    return dateShiftImpl(one, two, three);
  }

  /**
   * Сдвинуть дату на определенный период
   * @param {date} start Дата для поиска начала периода
   * @param {int} delta Количество unit
   * @param {string} unit unit
   * @returns SQL выражение для получения даты со сдвигом
   */
  function dateShiftImpl(start, delta, unit) {
    if (delta == 0) {
      return adapt_date(start);
    }
    let adaptedDate = adapt_date(start);
    let fullUnit = toFullUnit(unit);
    if (fullUnitIs(fullUnit, "q")) {
      return dateShiftImpl(start, delta * 3, "m");
    }
    if (fullUnitIs(fullUnit, "w")) {
      return dateShiftImpl(start, delta * 7, "d");
    }
    if (fullUnitIs(fullUnit, "i")) {
      throw getNotImplementedException("dateShift(isoyear)");
    }
    if (_variables._target_database === 'sap') {
      let sapFunc = {
        y: "ADD_YEARS",
        m: "ADD_MONTHS",
        d: "ADD_DAYS"
      }[fullUnitToChar(fullUnit)];
      if (sapFunc) {
        return `${sapFunc}(${adaptedDate}, ${delta})`;
      }
      throw getNotImplementedException(`dateShift(${fullUnit})`);
    }
    let intervalUnit = toIntervalUnit(fullUnit);
    let oracleNewDate = `ADD_MONTHS(${adaptedDate}, ${delta})`;
    let res = {
      sqlserver: `DATEADD(${intervalUnit}, ${delta}, ${adaptedDate})`,
      postgresql: `${adaptedDate} + INTERVAL '${delta} ${intervalUnit}'`,
      oracle: fullUnitIs(fullUnit, "m") ? `CASE WHEN EXTRACT(DAY FROM ${oracleNewDate}) > EXTRACT(DAY FROM ${adaptedDate}) ` + `THEN TO_DATE(TO_CHAR(${oracleNewDate}, 'yyyy-mm-') || EXTRACT(DAY FROM ${adaptedDate}), 'yyyy-mm-dd') ` + `ELSE ${oracleNewDate} END` : `${adaptedDate} + INTERVAL '${delta}' ${intervalUnit}`,
      teradata: `${adaptedDate} + INTERVAL ${delta < 0 ? "-" : ""}'${Math.abs(delta)}' ${intervalUnit}`,
      default: `${adaptedDate} + INTERVAL '${delta}' ${intervalUnit}`
    };
    return res[_variables._target_database] || res["default"];
  }

  /**
   * Получение даты начала и окончания периода
   * @param {date | string} one Дата для поиска или unit, если необходимо взять сегодня
   * @param {string | undefined} two unit, если первый параметр - дата
   * @returns Массив SQL выражений для получения [даты начала, даты окончания] периода
   */
  function bound(one, two) {
    return [toStartImpl(one, two), toEndImpl(one, two)];
  }

  /**
   * Получить дату и дату со сдвигом
   * @todo Сделать поддержку времени
   *
   * @example extend(today(), 1, 'm') -> [today(), today() + interval]
   * @example extend([today(), date], 1, 'm') -> [today(), date + interval]
   * @example extend(\1, 'm') -> [today(), today() + interval]
   *
   * @param {date | [date, date] | int} one Дата | Массив дат | Количество unit
   * @param {int | string} two Количество unit | unit
   * @param {string | undefined} three unit | undefined
   * @returns Массив [Дата, Сдвинутая дата]
   */
  function extend(one, two, three) {
    if (three === undefined) {
      return extendImpl(today(), one, two);
    }
    return extendImpl(one, two, three);
  }

  /**
   * Получить дату и дату со сдвигом
   * @param {date | [date, date]} start Дата | Массив дат
   * @param {int} delta Количество unit
   * @param {string} unit unit
   * @returns Массив [Дата, Сдвинутая дата]
   */
  function extendImpl(start, delta, unit) {
    let stt = start;
    let end = start;
    if ((0,dist_lpe.isArray)(start)) {
      if (start.length !== 2) {
        throw Error(`you can use only 2 elements Array for date literal`);
      }
      stt = start[0];
      end = start[1];
    }
    return [adapt_date(stt), dateShift(end, delta, unit)];
  }

  /** Получить год как INTEGER */
  function year(dt) {
    // , "mysql", "clickhouse"
    if (["sqlserver"].includes(_variables._target_database)) {
      return `year(${adapt_date(dt)})`;
    } else {
      return `CAST(EXTRACT(YEAR FROM ${adapt_date(dt)}) AS INT)`;
    }
  }

  /** Получить полугодие как INTEGER */
  function hoty(dt) {
    if (_variables._target_database === 'sqlserver') {
      return `(DATEPART(QUARTER, ${adapt_date(dt)})/3+1)`;
    } else {
      return `FLOOR(EXTRACT(MONTH FROM ${adapt_date(dt)}) / 7 + 1)`;
    }
  }

  /** Получить квартал как INTEGER */
  function qoty(dt) {
    if (_variables._target_database === 'sqlserver') {
      return `(DATEPART(QUARTER, ${adapt_date(dt)}))`;
    } else {
      return `FLOOR((EXTRACT(MONTH FROM ${adapt_date(dt)}) - 1) / 3 + 1)`;
    }
  }

  /** Получить месяц как INTEGER */
  function moty(dt) {
    if (_variables._target_database === 'sqlserver') {
      return `(DATEPART(MONTH, ${adapt_date(dt)}))`;
    } else {
      return `EXTRACT(MONTH FROM ${adapt_date(dt)})`;
    }
  }

  /** Получить неделю как INTEGER */
  function woty(dt) {
    let adaptedDate = adapt_date(dt);
    if (["postgresql", "greenplum", "oracle", "teradata", "vertica"].includes(_variables._target_database)) {
      return `CAST(TO_CHAR(${adaptedDate}, 'IW') AS INT)`;
    }
    let res = {
      sap: `SUBSTRING(ISOWEEK(${adaptedDate}), 7)`,
      mysql: `DATE_FORMAT(${adaptedDate}, '%v')`,
      clickhouse: `formatDateTime(${adaptedDate}, '%V')`,
      sqlserver: `datepart(iso_week, ${adaptedDate})`
    }[_variables._target_database];
    if (res) return `CAST(${res} AS INT)`;
    throw getNotImplementedException("woty");
  }

  /** Получить день года как INTEGER */
  function doty(dt) {
    let adaptedDate = adapt_date(dt);
    if (["postgresql", "greenplum", "oracle", "teradata", "sap", "vertica"].includes(_variables._target_database)) {
      return `CAST(TO_CHAR(${adaptedDate}, 'DDD') AS INT)`;
    }
    let res = {
      mysql: `DATE_FORMAT(${adaptedDate}, '%j')`,
      clickhouse: `formatDateTime(${adaptedDate}, '%j')`,
      sqlserver: `DATEPART(DAYOFYEAR, ${adaptedDate})`
    }[_variables._target_database];
    if (res) return `CAST(${res} AS INT)`;
    throw getNotImplementedException("doty");
  }

  /** Формат даты 'YYYY' -> 2024 */
  function isoy(dt) {
    let adaptedDate = adapt_date(dt);
    if (["postgresql", "greenplum", "oracle", "teradata", "sap", "vertica"].includes(_variables._target_database)) {
      return `TO_CHAR(${adaptedDate}, 'YYYY')`;
    }
    let res = {
      mysql: `DATE_FORMAT(${adaptedDate}, '%Y')`,
      clickhouse: `formatDateTime(${adaptedDate}, '%Y')`,
      sqlserver: `FORMAT(${adaptedDate}, 'yyyy')`
    }[_variables._target_database];
    if (res) return res;
    throw getNotImplementedException("isoy");
  }

  /** Формат даты 'YYYY-MM' -> 2024-10 */
  function isom(dt) {
    let adaptedDate = adapt_date(dt);
    if (["postgresql", "greenplum", "oracle", "teradata", "sap", "vertica"].includes(_variables._target_database)) {
      return `TO_CHAR(${adaptedDate}, 'YYYY-MM')`;
    }
    let res = {
      mysql: `DATE_FORMAT(${adaptedDate}, '%Y-%m')`,
      clickhouse: `formatDateTime(${adaptedDate}, '%Y-%m')`,
      sqlserver: `FORMAT(${adaptedDate}, 'yyyy-MM')`
    }[_variables._target_database];
    if (res) return res;
    throw getNotImplementedException("isom");
  }

  /** Формат даты 'YYYY-Qqq' -> 2024-Q1 */
  function isoq(dt) {
    if (_variables._target_database === 'sqlserver') {
      return `CONCAT(FORMAT(${adapt_date(dt)}, 'yyyy'), '-Q', DATEPART(QUARTER, ${adapt_date(dt)}))`;
    } else if (_variables._target_database === 'mysql') {
      return `CONCAT(DATE_FORMAT(${adapt_date(dt)}, '%Y'), '-Q', quarter(${adapt_date(dt)}))`;
    } else if (_variables._target_database === 'clickhouse') {
      return `formatDateTime(${adapt_date(dt)}, '%Y-Q%Q')`;
    } else {
      return `TO_CHAR(${adapt_date(dt)}, 'YYYY-"Q"Q')`;
    }
  }

  /** Формат даты 'YYYY-Www' -> 2024-W09 */
  function isow(dt) {
    let adaptedDate = adapt_date(dt);
    if (["postgresql", "greenplum", "oracle", "teradata", "vertica"].includes(_variables._target_database)) {
      return `TO_CHAR(${adaptedDate}, 'IYYY"-W"IW')`;
    }
    let res = {
      sap: `ISOWEEK(${adaptedDate})`,
      mysql: `DATE_FORMAT(${adaptedDate}, '%x-W%v')`,
      clickhouse: `formatDateTime(${adaptedDate}, '%G-W%V')`,
      sqlserver: `CONCAT( YEAR(DATEADD(day, 3 - (DATEPART(weekday, ${adaptedDate}) + 6) % 7, ${adaptedDate})), '-W', FORMAT(datepart(iso_week, ${adaptedDate}),'D2'))`
    }[_variables._target_database];
    if (res) return res;
    throw getNotImplementedException("isow");
  }

  /** Формат даты 'YYYY-DDD' -> 2024-321 */
  function isod(dt) {
    let adaptedDate = adapt_date(dt);
    if (["postgresql", "greenplum", "oracle", "teradata", "sap", "vertica"].includes(_variables._target_database)) {
      return `TO_CHAR(${adaptedDate}, 'YYYY-DDD')`;
    }
    let res = {
      mysql: `DATE_FORMAT(${adaptedDate}, '%Y-%j')`,
      clickhouse: `formatDateTime(${adaptedDate}, '%Y-%j')`,
      sqlserver: `CONCAT(FORMAT(${adaptedDate}, 'yyyy'), '-', FORMAT(DATEPART(DAYOFYEAR, ${adaptedDate}), 'D3'))`
    }[_variables._target_database];
    if (res) return res;
    throw getNotImplementedException("isod");
  }
  return {
    'dateShift': dateShift,
    'today': today,
    'now': now,
    'bound': bound,
    'extend': extend,
    'toStart': toStart,
    'toEnd': toEnd,
    'isoy': isoy,
    'isoq': isoq,
    'isom': isom,
    'isow': isow,
    'isod': isod,
    'year': year,
    'hoty': hoty,
    'qoty': qoty,
    'moty': moty,
    'woty': woty,
    'doty': doty,
    'adapt_date': adapt_date
  };
}
;// ./src/funcs/window.js


function generateWindowContext(v) {
  let _variables = v;
  function init_nested_agg_context() {
    // agg_funcs === hashmap!

    let agg_funcs_hashmap = generateAggContext();
    let agg_funcs = {
      'count': null,
      'max': null,
      'min': null,
      'avg': null,
      'count': null,
      'uniq': null,
      'sum': null,
      ...agg_funcs_hashmap
    };
    let calculate = args => args.map(el => (0,dist_lpe.isHash)(el) && el["🧮🎰🙉"] !== undefined ? el["🧮🎰🙉"] : 0);
    let bulbulate = args => args.length === 0 ? 0 : Math.max(...calculate(args));
    let ctx = (key, val, resolveOptions) => {
      if (resolveOptions && resolveOptions.wantCallable) {
        if (agg_funcs[key] === undefined) {
          return (...args) => {
            return {
              "🧮🎰🙉": bulbulate(args)
            };
          };
        } else {
          return (...args) => {
            return {
              "🧮🎰🙉": bulbulate(args) + 1
            };
          };
        }
      } else {
        return {
          "🧮🎰🙉": 0
        };
      }
    };
    return ctx;
  }
  let nested_agg_context = init_nested_agg_context();

  /* первый аргумент = это всегда должна быть функция. Например sum(dt).
     мы её должны вычислить вручную, но при этом мы должны удалить флаг agg!
      window(sum(dt), partition("dt","col"), order("-dt","col"), frame(null, 'current'))
  */

  // задача просто сгенерить PARTITION BY ...
  let partition = function () {
    // пока что наивно... но надо будет добавить
    // возможность поиска АЛИАСОВ!!!
    var a = Array.prototype.slice.call(arguments);
    return `PARTITION BY ${a.join(',')}`;
  };

  // задача просто сгенерить ORDER BY ...
  let order = function () {
    // пока что наивно... но надо будет добавить
    // возможность поиска АЛИАСОВ!!!
    var a = Array.prototype.slice.call(arguments);
    return `ORDER BY ${a.join(',')}`;
  };
  let frame = function (s, e) {
    throw Error(`frame() is not yet implemented`);
  };
  let window = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    if (!(0,dist_lpe.isArray)(ast[0])) {
      throw Error(`window() first argument must be a function!`);
    }

    // из-за хорошо выбранных имён вложенных функций, у нас будет правильный порядок:
    // partition(), order(), frame() !!!
    let args = ast.slice(1).sort((a, b) => String(b[0]).localeCompare(String(a[0])));

    // вычисляем первый аргумент, это типа функция
    let nested_count = (0,dist_lpe.eval_lisp)(ast[0], nested_agg_context);
    nested_count = nested_count["🧮🎰🙉"];
    let func_text = (0,dist_lpe.eval_lisp)(ast[0], ctx);

    //console.log(`WINDOW: + ${func_text} AGG: ${nested_count}`)

    function over() {
      let context = [{
        "partition": partition,
        "order": order,
        "frame": frame
      }, ctx];
      let ret = args.map(el => {
        let result;
        if (el[0] === 'order') {
          let orderContext = [{
            "+": (0,dist_lpe.makeSF)(ast => {
              return (0,dist_lpe.eval_lisp)(ast[0], context);
            }),
            "-": (0,dist_lpe.makeSF)(ast => {
              return `${(0,dist_lpe.eval_lisp)(ast[0], context)} DESC`;
            })
          }, context];
          return (0,dist_lpe.eval_lisp)(el, orderContext);
        } else {
          return (0,dist_lpe.eval_lisp)(el, context);
        }
      }).join(' ');
      return ret;
    }

    // FIXME!!! и ещё заполнить result!!!! если он есть !!!
    let sql = `${func_text} OVER (${over()})`;

    // если вложенность вызова agg функций > 1 sum(sum(v)), то будет нужен GROUP BY, а мы являемся measure
    // иначе мы просто столбец...
    if (nested_count > 1) {
      _variables["_result"]["agg"] = true;
    } else {
      delete _variables["_result"]["agg"]; // мы точно не агрегат, хотя были вызовы Agg функций
    }
    // console.log(`AGG: ${_variables["_result"]["agg"]}`)
    // FIXME: кажется это уже не надо, НО по нашему столбцу может быть попытка сделать агрегат
    // _variables["_result"]["do_not_group_by"] = true

    // FIXME: сначала нужно очистить код от старого running()
    //_variables["_result"]["window"] = true
    return sql;
  });
  return {
    'window': window
  };
}
;// ./src/sql_koob.js
/**
    Copyright (c) 2019 Luxms Inc.

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the Software
    is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/





//import {eval_sql_where} from './sql_where';




//import { generateMDXContext } from './funcs/mdx.js';

//console.log( JSON.stringify(generate_agg_funcs.init({"a":"b"})) );

//import util from 'license-report/lib/util';

//const SQL_where_context = sql_where_context({});

/* Постановка
На входе имеем структуру данных из браузера:
          { "with":"czt.fot",
              "filters": {
              "dor1": ["=", "ГОРЬК"],
              "dor2": ["=", "ПОДГОРЬК"],
              "dor4": ["=", null],
              "dor5": ["=", null],
              "Пол":  ["or", ["!="], ["ilike", "Муж"]],
              "dt": ["BETWEEN", "2020-01", "2020-12"],
              "sex_name": ["=", "Мужской"],
              "": [">", ["+",["col1", "col2"]], 100]
            },
            "having": {
              "dt": [">","2020-08"],
            },
            "return": "count", // возможно такое!!!
            "columns": ["dor3", "czt.fot.dor4", "fot.dor5", 'sum((val3+val1)/100):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new":  ["avg", ["+",["column","val2"],["column","val3"]]]} ],
            "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2", "summa"]
          }

Требуется
1) тексты отпарсить в скоботу и сделать готовые для eval структуры.
2) на основе with сходить в базу и получить всю инфу про столбцы куба, подготовить context для поиска столбцов по короткому и длинному имени.
3) выполнить eval для части columns -> получить массив структур, готовых к построению части SELECT.
   'sum((val3+val1)/100):summa' ===>
   {
     expr: 'sum((fot.val3+fot.val1)/100)',
     alias: "summa",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true
     cubes: ["czt.fot"]
   }
   можно также в процессе вычисления определить тип столбца из базы, и автоматом навесить agg, например sum
4) на основе columns_struct вычислить group_by, проверить, требуется ли JOIN.
5) при вычислении фильтров, учесть group_by и сделать дополнение для столбцов, у которых в конфиге указано как селектить ALL (memberALL)
6) создать какое-то чудо, которое будет печатать SQL из этих структур.
7) при генерации SQL в ПРОСТОМ случае, когда у нас один единственный куб, генрим КОРОТКИЕ имена столбцов
*/

// из клиента приходят имена столбов в разных регистрах, и ответ клиент ждёт тоже в разных
// регистрах...
function should_quote_alias(name) {
  return name.match(/^[_a-z][_a-z0-9]*$/) === null;
}
function upper_by_default(db) {
  return db === 'oracle' || db === 'teradata' || db === 'sap';
}

/**
 * возвращает строку `col AS alias`
 * @param {*} db
 * @param {*} src
 * @param {*} alias
 * @returns
 */
function quot_as_expression(db, src, alias) {
  // 1 определяем, нужно ли квотировать
  let should_quote = false;
  if (upper_by_default(db)) {
    should_quote = true;
    // `select col from dual` вернёт в JDBC `COL` заглавными буквами !!!
    // это ломает клиент, который ждёт lowercase названия объектов

    // teradata не понимает max(a) as max
    // Поэтому, для оракла будем брать в кавычки все абсолютно столбцы и делать из них алиасы!
    // потом в условиях order by надо будет добавить кавычки тоже!
    /*if (alias.match(/^[a-zA-Z]\w*$/) === null) {
      should_quote = true
    }*/
  } else {
    // если есть хоть одна заглавная буква, пробел или не ASCII символ
    if (should_quote_alias(alias)) {
      should_quote = true;
    }
  }
  if (!should_quote) {
    return `${src} as ${alias}`;
  }
  if (db === 'mysql') {
    return `${src} as ` + "`" + `${alias}` + "`";
  } else {
    return `${src} as "${alias}"`;
  }
}
let auto_quote_filters_expr = function (ar, should_not_quote, try_column) {
  let arr = ar;
  if ((0,dist_lpe.isString)(ar)) {
    if (ar.startsWith('lpe:')) {
      let ast = (0,dist_lpe.parse)(ar);
      if (!(0,dist_lpe.isArray)(ast)) {
        throw new Error(`not valid lpe expr: ${ar}`);
      } else {
        arr = ast;
      }
    } else {
      throw new Error(`no lpe: prefix in expr: ${ar}`);
    }
  }
  if ((0,dist_lpe.isArray)(arr)) {
    return arr.map((el, i) => {
      if (i === 0) {
        return el;
      }
      if ((0,dist_lpe.isString)(el)) {
        if (should_not_quote) {
          return el;
        } else {
          if (i === 1 && try_column) {
            return ["column", el];
          } else {
            return ["ql", el];
          }
        }
      }
      if ((0,dist_lpe.isArray)(el)) {
        if (el[0] === '=' || el[0] === '!=' || el[0] === 'between') {
          return auto_quote_filters_expr(el, false, try_column);
        } else {
          return auto_quote_filters_expr(el, true, try_column);
        }
      }
      return el;
    });
  }

  // support for empty filters:
  return ar;
};

/***************************************************************
 * Дописывает имена столбцов в структуре _cfg, до полных имён, используя префикс cube_prefix, там, где это очевидно.
 * простые тексты переводит в LPE скоботу
 * Считаем, что любой встреченный литерал является именем столбца.
 * в контексте ctx[_columns] должны быть описания столбцов из базы
 */
function normalize_koob_config(_cfg, cube_prefix, ctx) {
  var parts = cube_prefix.split('.');
  var ds = parts[0];
  var cube = parts[1];
  var ret = {
    "ds": ds,
    "cube": cube,
    "filters": {},
    "having": {},
    "columns": [],
    "sort": [],
    "limit": _cfg["limit"],
    "offset": _cfg["offset"],
    "subtotals": _cfg["subtotals"],
    "options": (0,dist_lpe.isArray)(_cfg["options"]) ? _cfg["options"] : [],
    "return": _cfg["return"],
    "config": _cfg["config"]
  };
  var aliases = {};
  if (_cfg["distinct"]) ret["distinct"] = [];

  /* expand_column также будем делать в процессе выполнения LPE, там будет вся инфа про куб, и про его дименшены.
     мы будем точно знать, является ли суффикс именем столбца из куба или нет.
     То есть нужна правильная реализация функции column и правильная реализация для неизвестного литерала, с учётом алиасов !!!
  */

  var expand_column = col => {
    return col.match(/("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)/) === null ? ctx._columns[`${cube_prefix}.${col}`] ? `${cube_prefix}.${col}` : col : col;
  };

  // для фильтров заменяем ключи на полные имена
  if ((0,dist_lpe.isHash)(_cfg["filters"])) {
    Object.keys(_cfg["filters"]).filter(k => k !== "").map(key => {
      ret["filters"][expand_column(key)] = auto_quote_filters_expr(_cfg["filters"][key]);
    });
    // https://gito.luxms.com/luxmsbi/lpe-sql/-/issues/74
    // вот тут надо попробовать отпарсить первый аргумент операций не как ql, а как column!!

    ret["filters"][""] = auto_quote_filters_expr(_cfg["filters"][""], false, 'try_column');
  }

  // для having заменяем ключи на полные имена
  if ((0,dist_lpe.isHash)(_cfg["having"])) {
    Object.keys(_cfg["having"]).filter(k => k !== "").map(key => {
      ret["having"][expand_column(key)] = auto_quote_filters_expr(_cfg["having"][key]);
    });
    ret["having"][""] = auto_quote_filters_expr(_cfg["having"][""], false, 'try_column');
  }

  // для фильтров заменяем ключи на полные имена, но у нас может быть массив [{},{}]
  if ((0,dist_lpe.isArray)(_cfg["filters"])) {
    var processed = _cfg["filters"].map(obj => {
      var result = {};
      if ((0,dist_lpe.isHash)(obj)) {
        Object.keys(obj).filter(k => k !== "").map(key => {
          result[expand_column(key)] = auto_quote_filters_expr(obj[key]);
        });
        result[""] = auto_quote_filters_expr(obj[""], false, 'try_column');
      }
      return result;
    });
    ret["filters"] = processed; // [{},{}]
  }

  // probably we should use aliased columns a AS b!!
  if ((0,dist_lpe.isArray)(_cfg["having"])) {
    Object.keys(_cfg["having"]).filter(k => k !== "").map(key => ret["having"][expand_column(key)] = auto_quote_filters_expr(_cfg["having"][key]));
  }

  // "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2", ["-",["column","val3"]]]
  // FIXME: нужна поддержка "sort": [1,3,-2]
  // FIXME: может быть лучше перейти на ORDER BY 2, 1 DESC, 4 ????
  // FIXME: тогда не надо будет париться с квотацией
  if ((0,dist_lpe.isArray)(_cfg["sort"])) {
    ret["sort"] = _cfg["sort"].map(el => {
      if (Array.isArray(el)) {
        if (el.length === 2) {
          if (el[0] === "-" || el[0] === "+") {
            if (Array.isArray(el[1])) {
              if (el[1][0] === "column") {
                return [el[0], ["column", expand_column(el[1][1])]];
              }
            } else {
              return [el[0], ["colref", el[1]]];
            }
          }
        }
      } else if (el && typeof el === 'string') {
        // тут может быть ссылка как на столбец, так и на alias, надо бы научиться отличать одно от другого
        // чтобы отличить alias от столбца - не делаем expand_column сейчас, и используем вызов colref!
        // FIXME: colref сейчас объявлен только для контекста sort!
        // FIXME: мы теряем имя куба: cube_prefix
        if (el.startsWith("-")) {
          return ["-", ["colref", el.substring(1)]];
        } else if (el.startsWith("+")) {
          return ["+", ["colref", el.substring(1)]];
        } else {
          return ["+", ["colref", el]];
        }
      }
    });
  }

  // "columns": ["dor3", "src.cube.dor4", "cube.col", 'sum((val3+val1)/100):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new":  ["avg", ["+",["column","val2"],["column","val3"]]]} ],
  /* возвращает примерно вот такое:
  [["column","ch.fot_out.dor3"],["->","src","cube","dor4"],["->","cube","col"],[":",["sum",["/",["()",["+","val3","val1"]],100]],"summa"],[":",["column","ch.fot_out.old"],"new"],["sum",["column","val2"]],[":",["avg",["+",["column","val2"],["column","val3"]]],"new"]]
  простые случаи раскладывает в скоботу сразу, чтобы не запускать eval_lisp
  */
  var expand_column_expression = function (el) {
    if ((0,dist_lpe.isString)(el)) {
      // do not call parse on simple strings, which looks like column names !!!
      if (el.match(/^[a-zA-Z_][\w ]*$/) !== null) {
        return ["column", expand_column(el)];
      }

      // exactly full column name, но может быть лучше это скинуть в ->
      if (el.match(/^([a-zA-Z_][\w ]*\.){1,2}[a-zA-Z_][\w ]*$/) !== null) {
        return ["column", el];
      }

      // can throw exceptions
      try {
        // try parsing
        var ast = (0,dist_lpe.parse)(`expr(${el})`);
        if (typeof ast === 'string') {
          // but if it was string, try to expand
          return ["column", expand_column(ast)];
        }
        return ast;
      } catch (err) {
        // if failed, return as is
        return ["column", el];
      }
    } else if (Array.isArray(el)) {
      return el;
    } else {
      throw new Error(`Wrong element in the columns array: ${el.toString()}`);
    }
  };

  // turn text lpe representations into AST, keep AST as is...
  ret["columns"] = _cfg["columns"].map(el => {
    if ((0,dist_lpe.isHash)(el)) {
      return [":", expand_column_expression(Object.values(el)[0]), Object.keys(el)[0]];
    } else {
      return expand_column_expression(el);
    }
  });

  //console.log(`COLUMNS: ${JSON.stringify(ret["filters"])}`)

  return ret;
}

/* _c = контекст, откуда берём на выбор функции */
function init_udf_args_context(_cube, _vars, _target_database, _c) {
  // ожидаем на вход хэш с фильтрами _vars прямо из нашего запроса koob...
  // _context._target_database === 'postgresql'
  /*
   {"dt":["between",2019,2022],"id":["=",23000035],"regions":["=","Moscow","piter","tumen"]}
  udf_args:  ["dir","regions","id","id","dt","dt"]
  udf_args:  ["dir",["ql","regions"],"id","id","dt","dt"]
  для квотации уже не работает, нужен кастомный резолвер имён ;-) а значит специальный контекст, в котором
  надо эвалить каждый второй аргумент: TODO
   Вместо кастомного резолвера можно использовать специальные ключи для rs - типа resolveColumn, и тогда
  нащ резолвер может работать по другому!
   если ключ (нечётный аргумент - пустой, то пишем без имени аргумента...)
   where @dir = 'Moscow@piter@tumen', @id = 23000035 => sep(@)
  'VAL1, VAL2, VAL3'                                => sep(,)
  '''VAL1'',''VAL2'',''VAL3'''                      => sep(,), quot( ql2 )
  */

  let udf_arg_cfg = {
    "sqlserver": {
      "arg_prefix": "",
      "arg_suffix": "",
      "arg_sep": ", ",
      "array_val_sep": "@",
      "array_val_quot": "",
      "array_val_quot_enforced": true,
      // always quoting, ignore what user wants
      "array_quot": "ql",
      "varname_prefix": "@",
      "varname_suffix": " = "
    },
    "sap": {
      "arg_prefix": "'PLACEHOLDER' = (",
      "arg_suffix": ")",
      "arg_sep": ", ",
      "array_val_sep": ",",
      "array_val_quot": "ql",
      // if ql() provided in template we call this func
      "array_val_quot_enforced": false,
      "array_quot": "ql",
      // hard coded func called in any case !
      "varname_prefix": "'$$",
      "varname_suffix": "$$', "
    },
    "postgresql": {
      "arg_prefix": "",
      "arg_suffix": "",
      "arg_sep": ", ",
      "array_val_sep": ",",
      "array_val_quot": "qj",
      // quot JSON val with ""
      "array_val_quot_enforced": true,
      // always quoting, ignore what user wants
      "array_quot": "",
      // if empty, then try array_prefix
      "array_prefix": "$lpe_array_quot$[",
      "array_suffix": "]$lpe_array_quot$",
      // '["val1","val2","val\"123"]'
      "varname_prefix": null,
      // means that var name should be skipped!!!
      "varname_suffix": null
    }
  };
  let c = udf_arg_cfg[_target_database];
  let generate_array_literal = function (literal_list, is_in_ql_call) {
    /* нормализация LPE приводит к тому, что мы добавляем везде  ["ql", literal]
    а вот тут мы ждём как раз литералы, поэтому пытаемся отменить ["ql",...]
    */

    let list = literal_list.map(el => {
      if ((0,dist_lpe.isArray)(el)) {
        if (el[0] === 'ql') {
          return el[1];
        }
      }
      return el;
    });
    //console.log(`generate_array_literal: ${JSON.stringify(list)}`)
    let possible_quot = c.array_val_quot;
    if (!c.array_val_quot_enforced && !is_in_ql_call) {
      possible_quot = "";
    }
    if (possible_quot === "") {
      return list.join(c.array_val_sep);
    } else if (possible_quot === "ql") {
      return list.map(v => db_quote_literal(v)).join(c.array_val_sep);
    } else if (possible_quot === "qj") {
      // json quoting
      return list.map(v => JSON.stringify(v)).join(c.array_val_sep);
    }
  };
  let _cctx = {};
  if ((0,dist_lpe.isFunction)(_c["get_in"])) {
    _cctx["get_in"] = _c["get_in"];
  }
  let quote_array_literal = function (v) {
    if (c.array_quot === "ql") {
      return db_quote_literal(v);
    } else if (c.array_prefix) {
      return `${c.array_prefix}${v}${c.array_suffix}`;
    } else {
      return v;
    }
  };

  /* we may need to query database to generate val list
  for example: ["between", '2001-01-01','2002-02-01'] should generate list of dates...
  for now this part is buggy and very limited...
  basically it either return one value, or list value
    */
  function eval_filters_expr(filters, name) {
    if (filters[0] === '=') {
      if (filters.length > 2) {
        // return array
        return filters.slice(1);
      } else {
        if (filters.length === 2) {
          // return just value
          return filters[1];
        }
      }
    } else if (filters[0] === 'ql') {
      // после того, как мы починили #66 у нас все константы в списках значений для фильтров
      // принудитильно заквотированы, нужно это поддержать хотя бы так...
      // return db_quote_literal(filters[1])
      // это чисто, чтобы тесты сработали и вдруг кто-то уже пробовал этим пользоваться...
      return filters[1];
    }
    throw new Error(`udf_args() can not handle filter op ${filters[0]} yet`);
  }

  // возвращает изначальнный JSON BODY целиком!
  // FIXME!! нужно пользоваться get_in() с какой-то версии 9.x есть доступ к JSON body запроса!!!
  // FIXME deprecated!!!
  _cctx["koob_filters"] = function () {
    let _v = {};
    let _filters = (0,dist_lpe.eval_lisp)(["get_in", ['"', "koob"], ['"', "query"], ['"', "filters"]], _cctx, {
      resolveString: false
    });
    if (_filters === undefined) {
      return _v;
    }

    // NOTE: udf functions actually expect keys in the form
    //       data_source.cube_ident.column
    for (let key in _filters) {
      if (key.length === 0) {
        // иногда у нас бывает фильтр с ключём === пустая строка
        _v[key] = _filters[key];
      } else {
        _v[`${_cube}.${key}`] = _filters[key];
      }
    }
    return _v;
  };
  _cctx["udf_args"] = (0,dist_lpe.makeSF)((ast, ctx) => {
    // аргументы = пары значениий,
    //console.log(`udf_args: `, JSON.stringify(ast))

    if (udf_arg_cfg[_target_database] === undefined) {
      throw new Error("udf_args() is not yet supported for: ".concat(_target_database));
    }
    let print_val_var_pair = function (k, v, is_array) {
      //console.log(`KV: ${k} = ${v}`)
      let s = c.arg_prefix;
      if (c.varname_prefix === null) {
        // skip var name completely !!! usefull for postgresql??
        // and other positional arg functions
        s = `${s}`;
      } else {
        s = `${s}${c.varname_prefix}${k}${c.varname_suffix}`;
      }
      if (is_array) {
        return `${s}${quote_array_literal(v)}${c.arg_suffix}`;
      } else {
        return `${s}${v}${c.arg_suffix}`;
      }
    };
    let pairs = ast.reduce((list, _, index, source) => {
      if (index % 2 === 0) {
        let name = source[index];
        let filter_ast = source[index + 1];
        //console.log(`SRC: ${name} ` + JSON.stringify(source));
        name = (0,dist_lpe.eval_lisp)(name, _cctx); // should eval to itself !
        //console.log(`filtername: ${name} filters AST ` + JSON.stringify(filter_ast))
        // FIXME!! тут нужен собственный резолвер ИМЁН, который понимает wantCallable
        // и ищет имена в _vars как запасной вариант!!!

        let filters = (0,dist_lpe.eval_lisp)(filter_ast, ctx, {
          "resolveString": false
        }); // включая _vars !
        //console.log('filters evaled to ' + JSON.stringify(filters))
        if (filters !== undefined) {
          if ((0,dist_lpe.isArray)(filters)) {
            let vallist = eval_filters_expr(filters);
            if ((0,dist_lpe.isArray)(vallist)) {
              let expr = generate_array_literal(vallist, false);
              if (expr.length > 0) {
                list.push(print_val_var_pair(name, expr, true));
              } else {
                throw new Error(`udf_args() has filter without value, only op ${filters[0]}`);
              }
            } else {
              list.push(print_val_var_pair(name, vallist));
            }
          } else {
            //console.log(`NEVER BE HERE! ${filters}`)
            if (filters.length > 0) {
              if (name && name.length > 0) {
                list.push(print_val_var_pair(name, filters));
              } else {
                // postgresql might skip names ???
                list.push(`${filters}`);
              }
            }
          }
        }
      }
      return list;
    }, []);
    return pairs.join(c.arg_sep);
  });
  _cctx["ql"] = function (arg) {
    //console.log(`QL: ${arg}`  + JSON.stringify(arg))
    if ((0,dist_lpe.isArray)(arg)) {
      //console.log('QL:'  + JSON.stringify(arg))
      let vallist = eval_filters_expr(arg);
      if ((0,dist_lpe.isArray)(vallist)) {
        let expr = generate_array_literal(vallist, true); // enforce quoting as it is ql() call
        return quote_array_literal(expr);
      } else {
        return db_quote_literal(vallist);
      }
    } else {
      if (arg !== undefined) {
        //console.log(`QUOT FOR ${arg}`)
        if ((0,dist_lpe.isHash)(arg)) {
          // This is JSON as hash, we should quote it as string!
          return db_quote_literal(JSON.stringify(arg));
        }
        return db_quote_literal(arg);
      }
    }
    return undefined;
  };
  return [_cctx,
  // функция, которая резолвит имена столбцов для случаев, когда имя функции не определено в явном виде в _vars/_context
  // а также пытается зарезолвить коэффициенты
  (key, val, resolveOptions) => {
    //console.log("RESOLVER : " + key + " " + JSON.stringify(resolveOptions))
    if (resolveOptions && resolveOptions.wantCallable) {
      return undefined; // try standard context in _cctx
    }
    let fullname = `${_cube}.${key}`;
    //console.log("RESOLVER2:" + `CUBE: ${_cube} FULLNAME: ${fullname}  _vars: ${JSON.stringify(_vars)}` + _vars[fullname])
    return _vars[fullname];
  }];
}

/*********************************
 *
 * init_koob_context
 * на входе контекст может быть массивом, а может быть хэшем. Стало сложнее с этим работать!
 * Cчитаем, что на входе может быть только хэш с уже прочитанными именами столбцов!!
 */

function init_koob_context(_vars, default_ds, default_cube) {
  let _ctx = []; // это контекст где будет сначала список переменных, включая _columns, и функции
  if ((0,dist_lpe.isHash)(_vars)) {
    //_ctx = [{..._vars}]
    _ctx = [{}, _vars];
  }
  let _context = _ctx[0];
  let _variables = _ctx[1];
  let agg_funcs = generateAggContext(_variables);
  let cal_funcs = generateCalendarContext(_variables);
  let win_funcs = generateWindowContext(_variables);

  //_context["lpe_median"] = agg_funcs["lpe_median"]

  // пытается определить тип аргумента, если это похоже на столбец, то ищет про него инфу в кэше и определяет тип,
  // а по типу можно уже думать, квотировать значения или нет.
  var shouldQuote = function (col, v) {
    if ((0,dist_lpe.isArray)(col) && col[0] === 'column') {
      //try to detect column type
      var c = _variables["_columns"][col[1]];
      if (c) {
        return c.type !== 'NUMBER';
      }
      return (0,dist_lpe.isString)(v);
    }

    // это формула над какими-то столбцами...
    // смотрим на тип выражения v, если это текст, то возвращаем true,
    // но сначала проверим, вдруг это alias???
    if (_variables["_aliases"][v]) {
      return false;
    }

    // left and right side looks like a column names, don't quote
    if ((0,dist_lpe.isString)(col) && (0,dist_lpe.isString)(v) && (col.match(/^[A-Za-z_]+\w*$/) || col.match(/^[A-Za-z_]+\w*\.[A-Za-z_]+\w*$/)) && (v.match(/^[A-Za-z_]+\w*$/) || v.match(/^[A-Za-z_]+\w*\.[A-Za-z_]+\w*$/))) {
      return false;
    }
    return (0,dist_lpe.isString)(v);
  };

  // пытается определить тип аргумента, если это похоже на столбец, то ищет про него инфу в кэше и определяет тип,
  // а по типу можно уже думать, квотировать значения или нет.
  // При этом значение всегда считается литералом, и не воспринимается как имя столбца!!!
  // удобно для квотирования элементов массива!!
  var shouldQuoteLiteral = function (col, v) {
    if ((0,dist_lpe.isArray)(col) && col[0] === 'column') {
      //try to detect column type
      var c = _variables["_columns"][col[1]];
      if (c) {
        return c.type !== 'NUMBER';
      }
      //return false;
      /* FIXME: эта проверка сломала if: #66 */
      return !(0,dist_lpe.isNumber)(v);
    }

    // это формула над какими-то столбцами...
    // смотрим на тип выражения v, если это текст, то возвращаем true,
    // но сначала проверим, вдруг это alias???
    if (_variables["_aliases"][v]) {
      return false;
    }
    return !(0,dist_lpe.isNumber)(v);
  };
  var quoteLiteral = function (lit) {
    if ((0,dist_lpe.isString)(lit) || (0,dist_lpe.isNumber)(lit) || (0,dist_lpe.isArray)(lit) && lit[0] !== "ql") {
      return ["ql", lit];
    }
    return lit;
  };

  /* если нужно, берёт в кавычки, но не делает eval для первого аргумента! */
  /* Считается, что первый аргумент - строка или число но не ast */
  var evalQuoteLiteral = function (lit) {
    return lit === null ? null : db_quote_literal(lit);
  };

  // функция, которая резолвит имена столбцов для случаев, когда имя функции не определено в явном виде в _vars/_context
  // а также пытается зарезолвить коэффициенты
  _ctx.push((key, val, resolveOptions) => {
    // console.log(`WANT to resolve ${key} ${val}`, JSON.stringify(resolveOptions));
    // console.log(`COLUMN: `, JSON.stringify(_variables["_columns"][key]));
    // вызываем функцию column(ПолноеИмяСтолбца) если нашли столбец в дефолтном кубе
    if (_variables["_columns"][key]) return _context["column"](key);
    //console.log('NOT HERE?')
    if (_variables["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`);
    // reference to alias!
    //console.log("DO WE HAVE SUCH ALIAS?" , JSON.stringify(_variables["_aliases"]))
    // алиас не должен переопределять функции с таким же именем
    if (_variables["_aliases"][key] && (resolveOptions === undefined || !resolveOptions["wantCallable"])) {
      if (!(0,dist_lpe.isHash)(_variables["_result"])) {
        _variables["_result"] = {};
      }
      if (!(0,dist_lpe.isArray)(_variables["_result"]["columns"])) {
        _variables["_result"]["columns"] = [];
      }
      // remeber reference to alias as column name!
      _variables["_result"]["columns"].push(key);

      // mark our expression same as target
      // FIXME: setting window will result in BUGS
      //_variables["_result"]["window"] = _variables["_aliases"][key]["window"]
      _variables["_result"]["agg"] = _variables["_aliases"][key]["agg"];

      // Mark agg function to display expr as is
      _variables["_result"]["outerVerbatim"] = true;
      return key;
    }
    if (resolveOptions && resolveOptions.wantCallable) {
      if (key.match(/^\w+$/)) {
        if (_variables["_result"]) {
          //console.log("HUY!! " + JSON.stringify(key))
          // в этом списке только стандартные вещи, которые во всех базах одинаково пишутся
          if (['sum', 'avg', 'min', 'max', 'count'].find(el => el === key)) {
            _variables["_result"]["agg"] = true;
          }
        }
        return function () {
          var a = Array.prototype.slice.call(arguments);
          //console.log(`FUNC RESOLV ${key}`, JSON.stringify(a))
          if (key.match(/^between$/i)) {
            //console.log(`between(${a.join(',')})`)
            var e = (0,dist_lpe.eval_lisp)(["between"].concat(a), _ctx);
            return e;
          }
          if (key === 'count') {
            if (_variables._target_database == 'clickhouse') {
              // console.log('COUNT:' + JSON.stringify(a))
              // у нас всегда должен быть один аргумент и он уже прошёл eval !!!
              // Это БАГ в тыкдоме v21 = отдаёт текстом значения, если count делать :-()
              return `toUInt32(count(${a[0]}))`;
            }
          }
          if (key === 'only1' || key === 'on1y') {
            // особый режим выполнения SQL.
            // ставим флаг, потом будем оптимизировать запрос!
            _variables["_result"]["only1"] = true;
            return a[0];
          }
          return `${key}(${a.join(',')})`;
        };
      } else {
        // -> ~ > < != <> and so on,
        //  FIXME: мы должны вернуть более умный макрос, который будет искать вызовы column в левой и правой части и делать ql при необходимости
        return (0,dist_lpe.makeSF)((ast, ctx, rs) => {
          //console.log(`ANY FUNC ${key}`, JSON.stringify(ast))
          var k = key;
          var col = ast[0];

          //FIXME: надо бы тоже quoteLiteral вызывать для c
          var c = (0,dist_lpe.eval_lisp)(col, ctx, rs);
          if (ast.length === 1) {
            // например `-1 * sum(col)`
            return `${k}${c}`;
          }
          var v = ast[1];
          if ((0,dist_lpe.isString)(v)) {
            if (!v.startsWith('$') && !resolveOptions["resolveColumn"] === true) {
              // коэфициент не надо квотировать, оно должно замениться на конкретное число!
              if (shouldQuote(col, v)) v = quoteLiteral(v);
            }
          }
          v = (0,dist_lpe.eval_lisp)(v, ctx, rs);
          return `${c} ${k} ${v}`;
        });
      }
    }
    if (key.startsWith('$')) {
      // возможно, это коэффициент?
      let val = _variables["_coefficients"][key];
      if ((0,dist_lpe.isNumber)(val)) {
        return val;
      }
    }

    // We may have references to yet unresolved aliases....
    if ((0,dist_lpe.isHash)(_variables["_result"])) {
      if (key.match(/^[A-Za-z_]+\w*$/)) {
        if (!(0,dist_lpe.isArray)(_variables["_result"]["unresolved_aliases"])) {
          _variables["_result"]["unresolved_aliases"] = [];
        }
        _variables["_result"]["unresolved_aliases"].push(key);
      }
    }
    return key;
  }); // end of _ctx.push()

  _context["::"] = function (col, type) {
    if (_variables._target_database === 'postgresql' || _variables._target_database === 'clickhouse') {
      return `${col}::${type}`;
    } else {
      return `CAST(${col} AS ${type})`;
    }
  };
  _context["to_char"] = function (col, fmt) {
    if (_variables._target_database === 'clickhouse') {
      if (fmt === "'YYYY'") {
        return `leftPad(toString(toYear(${col})), 4, '0')`;
      } else if (fmt === "'YYYY-\"Q\"Q'") {
        return `format('{}-Q{}', leftPad(toString(toYear(${col})), 4, '0'), toString(toQuarter(${col})))`;
      } else if (fmt === "'YYYY-MM'") {
        return `format('{}-{}', leftPad(toString(toYear(${col})), 4, '0'), leftPad(toString(toMonth(${col})), 2, '0'))`;
      } else if (fmt === "'YYYY-\"W\"WW'") {
        return `format('{}-W{}', leftPad(toString(toYear(${col})), 4, '0'), leftPad(toString(toISOWeek(${col})), 2, '0'))`;
      }
    } else {
      return `to_char(${col}, ${fmt})`;
    }
  };
  _context["window"] = win_funcs["window"];
  _context["median"] = agg_funcs["median"];
  _context["quantile"] = agg_funcs["quantile"];
  _context["mode"] = agg_funcs["mode"];
  _context["varPop"] = agg_funcs["varPop"];
  _context["stddevPop"] = agg_funcs["stddevPop"];
  _context["varSamp"] = agg_funcs["varSamp"];
  _context["stddevSamp"] = agg_funcs["stddevSamp"];
  _context["corr"] = agg_funcs["corr"];
  _context["countIf"] = agg_funcs["countIf"];

  // deprecated REMOVE in v.11
  _context["var_pop"] = _context["varPop"];

  // deprecated REMOVE in v.11
  _context["var_samp"] = _context["varSamp"];

  // deprecated REMOVE in v.11
  _context["stddev_samp"] = _context["stddevSamp"];

  // deprecated REMOVE in v.11
  _context["stddev_pop"] = _context["stddevPop"];
  _context["dateShift"] = cal_funcs["dateShift"];
  _context["today"] = cal_funcs["today"];
  _context["now"] = cal_funcs["now"];
  _context["bound"] = cal_funcs["bound"];
  _context["extend"] = cal_funcs["extend"];
  _context["toStart"] = cal_funcs["toStart"];
  _context["toEnd"] = cal_funcs["toEnd"];
  _context["isoy"] = cal_funcs["isoy"];
  _context["isoq"] = cal_funcs["isoq"];
  _context["isom"] = cal_funcs["isom"];
  _context["isow"] = cal_funcs["isow"];
  _context["isod"] = cal_funcs["isod"];
  _context["year"] = cal_funcs["year"];
  _context["hoty"] = cal_funcs["hoty"];
  _context["qoty"] = cal_funcs["qoty"];
  _context["moty"] = cal_funcs["moty"];
  _context["woty"] = cal_funcs["woty"];
  _context["doty"] = cal_funcs["doty"];
  _context["_sequence"] = 0; // magic sequence number for uniq names generation

  // специальная обёртка для вычисления lpe выражений.
  // Например, в lpe есть count(), split() которые сейчас транслируются в SQL.
  // у lpe должен быть только один аргумент!  lpe(get_in().map(ql))
  _context["lpe"] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    let _v = {
      "user": _variables["_user_info"],
      "koob": {
        "query": _variables["_koob_api_request_body"],
        "access_filters": _variables["_access_filters"],
        "access_filters_format": _variables["_access_filters_format"]
      }
    };
    let c = (0,dist_lpe.eval_lisp)(ast[0], [dist_lpe.STDLIB, _v, ctx], {
      ...rs,
      wantCallable: false
    });
    return c;
  });
  /* добавляем модификатор=второй аргумент, который показывает в каком месте SQL используется столбец:
  where, having, group, template_where
  */
  _context["column"] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    /* col = строка, которую не нужно eval!!!! иначе уйдём в резолвер по умолчанию
    а он вызовет нас опять.
    sql_context = строка
    на вход может приходить всякое
    COLUMN CALLED "ch.fot_out.v_rel_pp"
    COLUMN CALLED ["ch.fot_out.group_pay_name"]
    COLUMN CALLED ["sum","where"]
    */
    if ((0,dist_lpe.isString)(ast)) {
      ast = [ast];
    }
    let col = ast[0];
    let sql_context = ast[1];

    //console.log(`COLUMN CALLED ${ JSON.stringify(ast) }`)
    // считаем, что сюда приходят только полностью резолвенные имена с двумя точками...
    let c;
    let parts = col.split('.');
    if (parts.length === 3) {
      c = _variables["_columns"][col];
    }
    if (!(0,dist_lpe.isHash)(c)) {
      // пробуем добавить датасорс и куб и найти столбец по его полному id
      // ну и такие вещи попадаются:
      //      LOOKING FOR: ch.fot_out.(round(v_main,2))
      //      LOOKING FOR: ch.fot_out."My version"
      let fullCol = `${_variables["_ds"]}.${_variables["_cube"]}.${col}`;
      c = _variables["_columns"][fullCol];
      if ((0,dist_lpe.isHash)(c)) {
        col = fullCol;
      }
    }

    //console.log(`[${sql_context}] column func: ${col} ${sql_context} resolved to ${JSON.stringify(c)}`)
    if (c) {
      // side-effect to return structure (one per call)
      if (_variables["_result"]) {
        _variables["_result"]["columns"].push(col);
        //console.log(`PUSH ${col}` + JSON.stringify(_variables["_result"]))
        if (c["type"] === "AGGFN") {
          _variables["_result"]["agg"] = true;
        }
      }
      let parts = col.split('.');
      let colname = parts[2];
      //console.log(`COMPARE ${colname} = ${JSON.stringify(c)}`)
      if (colname.localeCompare(c.sql_query, undefined, {
        sensitivity: 'accent'
      }) === 0 || (/*`"${colname}"`.localeCompare(c.sql_query, undefined, { sensitivity: 'accent' }) === 0 */
      c.sql_query.length > 2 && c.sql_query === db_quote_ident(colname))
      //FIXME: handle "a"."b" as well?
      ) {
        // we have just column name or one column alias, prepend table alias !
        if (_variables._target_database == 'clickhouse') {
          if (sql_context == 'where') {
            // enable table prefixing for now
            // template_where не должен подставлять имя таблицы!
            return `${parts[1]}.${c.sql_query}`;
          } else {
            return `${c.sql_query}`;
          }
        } else {
          return `${c.sql_query}`;
        }

        // temporarily disabled by DIMA FIXME, but at least clickhouse need reference to table name !
        // without it clickhouse uses alias!
        //return `${parts[1]}.${c.sql_query}`
      } else {
        //console.log(`OPANKI: ${c.sql_query}`)
        // FIXME: WE JUST TRY TO match getDict, if ANY. there should be a better way!!!
        // dictGet('gpn.group_pay_dict', some_real_field, tuple(pay_code))
        // console.log(`OPANKI: ${c.sql_query}`, JSON.stringify(c))
        if (_variables._target_database == 'clickhouse') {
          // for the SELECT part make sure we produce different things for INNER and OUTER SQL
          // SELECT part is denoted by _variables["_result"]
          if (_variables["_result"] && c.sql_query.match(/dictGet\(/)) {
            //console.log(`OPANKI1: ${c.sql_query}`)
            _variables["_result"]["outer_expr"] = c.sql_query;
            _variables["_result"]["outer_alias"] = parts[2];
            var m = c.sql_query.match(/,[^,]+,(.*)/);
            if (m) {
              m = m[1];
              //console.log(`OPANKI11: ${m}`)
              // ' tuple(pay_code))'
              var t = m.match(/tuple\((\w+)\)/);
              if (t) {
                //console.log(`OPANKI22: ${c.sql_query}  ${t[1]}`)
                _variables["_result"]["alias"] = t[1];
                return t[1];
              } else {
                t = m.match(/(\w+)/);
                if (t) {
                  _variables["_result"]["alias"] = t[1];
                  return t[1];
                }
              }
            }
          }
        }
        if (_variables["_result"]) {
          // make alias for calculated columns
          let parts = col.split('.');
          if (parts.length === 3) {
            _variables["_result"]["alias"] = parts[2];
          }
        }
        if (c.sql_query.length > 2 && /^"([^"]+|"{2})+"$/.test(c.sql_query)) {
          return c.sql_query;
        } else if (/^[A-Za-z_]\w+$$/.test(c.sql_query)) {
          return c.sql_query;
        } else {
          return `(${c.sql_query})`; // FIXME: почему скобки??? ну да ладно, может нужно для сложных выражений
        }
      }
    } else {
      // это был алиас, и его надо поискать, если это where
      //console.log("NOT FOUND" + col)
      if (sql_context == 'where') {
        // в фильтрах использовали алиасы или вообще ошиблись.
        // если ключ в фильтрах совпал с именем столбца, то мы это отработали в if() выше
        // нужно найти алиас
        let c = _variables["_aliases"][col];
        //console.log(`RESOLVED ALIAS: ${JSON.stringify(c)}`)
        if ((0,dist_lpe.isHash)(c)) {
          // если это просто переименование, то мы можем написать правильный WHERE
          // иначе - это ошибка и нужно использовать HAVING!!!
          // {"columns":["ch.fot_out.group_pay_name"],"unresolved_aliases":["sum"],"agg":true,"alias":"sum","expr":null,"outer_expr":"sum(group_pay_name)"}
          //  {"columns":["ch.fot_out.group_pay_name"],"alias":"xxx","expr":"group_pay_name"}
          if (c["columns"].length === 1) {
            let idName = c["columns"][0];
            let parts = idName.split('.');
            let colname = parts[2];
            if (colname.localeCompare(c.expr, undefined, {
              sensitivity: 'accent'
            }) === 0 || `"${colname}"`.localeCompare(c.expr, undefined, {
              sensitivity: 'accent'
            }) === 0) {
              // это просто переименование
              if (_variables._target_database == 'clickhouse') {
                col = `${parts[1]}.${c.expr}`;
              } else {
                col = c.expr;
              }
            } else {
              throw new Error(`Resolving key [${col}] for filters, but it resolved to complex expression [${c.expr ? c.expr : c.outer_expr}] which can not be searched at row data level :-()`);
            }
          }
        }
      }
    }
    //console.log("COL FAIL", col)
    // возможно кто-то вызовет нас с коротким именем - нужно знать дефолт куб!!!
    //if (_context["_columns"][default_ds][default_cube][key]) return `${default_cube}.${key}`;
    // на самом деле нас ещё вызывают из фильтров, и там могут быть алиасы на столбцы не в кубе,
    // а вообще в другой таблице, пробуем просто квотировать по ходу пьессы.

    return col;
  });

  /*
     expr: "initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt",
     alias: "mnt",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true,
     window: true,
     outer_expr: "runningAccumulate(mnt, (comp_code,gl_account)) as col1",
     outer_alias: 'col1'
  */

  /* DEPRECATED!!!! */
  _context["running"] = function () {
    _context["_result"]["agg"] = true; // mark that we are aggregate function for correct 'group by'
    _context["_result"]["window"] = true;
    var a = Array.prototype.slice.call(arguments);
    //console.log("RUNNING" , JSON.stringify(a))
    //console.log("Flavor" , JSON.stringify(_context._target_database))

    if (_context._target_database !== 'clickhouse') {
      throw Error('running function is only supported for clickhouse SQL flavour');
    }

    //
    // we have 3 args ["sum","v_main",["-","hcode_name"]]
    // or we have 2 args: ["lead","rs"]
    // and should generate: initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt
    var fname = a[0];
    var colname = a[1];
    var order_by = '';
    var expr = '';
    if (fname === 'sum') {
      order_by = a[2]; // array!
      order_by = order_by[1]; // FIXME! may crash on wrong input!!! use eval !!!
      // We have 2 phases, inner and outer.
      // For inner phase we should generate init:
      expr = `initializeAggregation('${fname}State',${fname}(${colname}))`;

      // For outer phase we should generate
      // runningAccumulate(wf1, (comp_code,gl_account)) AS end_lc,
      // BUT WIITHOUT AS end_lc
      var alias = '_w_f_' + ++_context["_sequence"];
      _context["_result"]["expr"] = expr;
      _context["_result"]["columns"] = [colname];
      _context["_result"]["inner_order_by_excl"] = order_by;
      _context["_result"]["outer_expr"] = `runningAccumulate(${alias}, partition_columns())`; //it should not be used as is
      _context["_result"]["outer_expr_eval"] = true; // please eval outer_expr !!!
      _context["_result"]["outer_alias"] = alias;
    } else if (fname === 'lead') {
      // or we have 2 args: ["lead","rs"]
      // if this column is placed BEFORE referenced column, we can not create correct outer_expr
      // in this case we provide placeholder...

      var init = _context["_aliases"][colname];
      if ((0,dist_lpe.isHash)(init) && init["alias"]) {
        _context["_result"]["outer_expr"] = `finalizeAggregation(${init["alias"]})`;
      } else {
        _context["_result"]["outer_expr"] = `finalizeAggregation(resolve_alias())`;
        _context["_result"]["outer_expr_eval"] = true;
        _context["_result"]["eval_reference_to"] = colname;
      }
      expr = null; // no inner expr for this func!
    }
    return expr;
  };
  _context['running'].ast = [[], {}, [], 1]; // mark as macro

  // сюда должны попадать только хитрые варианты вызова функций с указанием схемы типа utils.smap()
  // но нет, [["dateShift","dt",["-",3],"month"],["bound",["'","q"]]]
  // можно сделать эвристику, если первый элемент литерал или функция ",что значит имя SQL
  // то не делаем thread, а иначе делаем!!!
  _context["->"] = function () {
    var a = Array.prototype.slice.call(arguments);
    if ((0,dist_lpe.isArray)(a[0]) && a[0][0] === '"' || !(0,dist_lpe.isArray)(a[0])) {
      //console.log("-> !" , JSON.stringify(a))
      return a.map(el => (0,dist_lpe.isArray)(el) ? (0,dist_lpe.eval_lisp)(el, _ctx, {
        "resolveColumn": false
      }) : el).join('.');
    } else {
      // нужно сделать настоящий ->
      let [acc, ...ast] = a;
      for (let arr of ast) {
        if (!(0,dist_lpe.isArray)(arr)) {
          arr = [".-", acc, arr]; // это может быть обращение к хэшу или массиву через индекс или ключ....
        } else if (arr[0] === "()" && arr.length === 2 && ((0,dist_lpe.isString)(arr[1]) || (0,dist_lpe.isNumber)(arr[1]))) {
          arr = [".-", acc, arr[1]];
        } else {
          arr = arr.slice(0); // must copy array before modify
          arr.splice(1, 0, acc);
          //console.log("AST !!!!" + JSON.stringify(arr))
          // AST[["filterit",[">",1,0]]]
          // AST !!!!["filterit","locations",[">",1,0]]
          // подставляем "вычисленное" ранее значение в качестве первого аргумента... классика thread first
        }
        acc = arr;
      }
      //console.log("AST !!!!" + JSON.stringify(acc))
      if (!(0,dist_lpe.isArray)(acc)) {
        return ["resolve", acc];
      }
      return acc;
    }
  };
  _context['->'].ast = [[], {}, [], 1]; // mark as macro

  _context[':'] = function (o, n) {
    //var a = Array.prototype.slice.call(arguments);
    //console.log(":   " + JSON.stringify(o) + ` ${JSON.stringify(n)}`);
    //return a[0] + ' as ' + a[1].replace(/"/,'\\"');

    // если нам придёт вот такое "count(v_rel_pp):'АХТУНГ'",
    var al = n;
    if ((0,dist_lpe.isArray)(n) && n[0] === "'" || n[0] === '"') {
      al = n[1];
    }
    //console.log("AS   " + JSON.stringify(_ctx));
    var otext = (0,dist_lpe.eval_lisp)(o, _ctx, {
      resolveString: true,
      resolveColumn: true,
      "wantCallable": false
    });
    // FIXME: columns: ["year:c_year"] приводит к тому, что мы резолвим функцию!!!
    if ((0,dist_lpe.isFunction)(otext)) {
      console_console.log("FUNCTION!" + otext);
      console_console.log(`FUNCTION: ${JSON.stringify(o)}`);
      otext = o;
    }
    if (_variables["_result"]) {
      // мы кидаем значение alias в _result, это подходит для столбцов
      // для TABLE as alias не надо вызывать _result

      // также есть outer_alias для оконных функций, мы его поменяем!!!
      if (_variables["_result"]["outer_alias"]) {
        _variables["_result"]["alias"] = _variables["_result"]["outer_alias"];
        _variables["_result"]["outer_alias"] = al;
      } else {
        _variables["_result"]["alias"] = al;
      }
      return otext;
    }
    // FIXME: кажется это вообще не работает, так как ожидается n в виде текста, а он может быть []
    // но сюда мы не попадаем, так как _variables["_result"]
    return quot_as_expression(_variables["_target_database"], otext, n);
  };
  _context[':'].ast = [[], {}, [], 1]; // mark as macro

  _context['toString'] = (0,dist_lpe.makeSF)((ast, ctx) => {
    // we need to use makeSF, as normal LISP context will not evaluate column names ???
    //console.log(JSON.stringify(ast))
    var col = ast[0];
    var s = (0,dist_lpe.eval_lisp)(col, _ctx);
    if (_variables._target_database === 'clickhouse') {
      return `toString(${s})`;
    } else if (_variables._target_database === 'postgresql') {
      return `${s}::TEXT`;
    } else {
      return `cast(${s} AS VARCHAR)`;
    }
  });

  // Clickhouse way.... will create extra dataset
  // range(end), range([start, ] end [, step])
  // Returns an array of UInt numbers from start to end - 1 by step.
  // either 1 or 3 args !!!
  _context['range'] = function (from, to, step) {
    if (_variables._target_database === 'clickhouse') {
      let r;
      if (to === undefined) {
        r = `arrayJoin(range(${from}))`;
      } else {
        if (step === undefined) {
          r = `arrayJoin(range(${from},${to}))`;
        } else {
          r = `arrayJoin(range(${from},${to}, ${step}))`;
        }
      }
      _variables["_result"]["is_range_column"] = true;
      return r;
    } else if (_variables._target_database === 'postgresql') {
      let s = '';
      if (to === undefined) {
        s = `generate_series(0, ${from}-1)`;
      } else {
        if (step === undefined) {
          s = `generate_series(${from}, ${to}-1)`;
        } else {
          s = `generate_series(${from}, ${to}-1, ${step})`;
        }
      }
      _variables["_result"]["is_range_column"] = true;
      _variables["_result"]["expr"] = 'koob__range__';
      _variables["_result"]["columns"] = ["koob__range__"];
      _variables["_result"]["join"] = {
        "type": "inner",
        "alias": "koob__range__",
        "expr": `${s}`
      };
      return 'koob__range__';
    } else if (_variables._target_database === 'teradata') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // JOIN и WHERE!!!
      // select  _koob__range__table__.day_of_calendar, procurement_subject
      // FROM bi.fortests, sys_calendar.CALENDAR as koob__range__table__
      // where purch_id = 8585 and day_of_calendar BETWEEN 1 AND 10;
      // max count is limited to 73414
      if (step !== undefined) {
        throw Error(`range(with step argument) is not supported for ${_variables._target_database}`);
      }
      let f;
      if (to === undefined) {
        f = ['<=', from];
      } else {
        f = ['between', from + 1, to];
      }
      _variables["_result"]["is_range_column"] = true;
      _variables["_result"]["expr"] = 'koob__range__table__.day_of_calendar - 1';
      _variables["_result"]["columns"] = ["day_of_calendar"];
      _variables["_result"]["alias"] = 'koob__range__';
      _variables["_result"]["join"] = {
        "type": "inner",
        "table": "sys_calendar.CALENDAR",
        "alias": "koob__range__table__",
        "filters": {
          "koob__range__table__.day_of_calendar": f
        }
      };
      return 'koob__range__table__.day_of_calendar - 1';
      // FIXME: это попадает в GROUP BY !!!
    } else if (_variables._target_database === 'oracle') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // JOIN и WHERE!!!
      // ONLY FOR Oracle 10g and above!
      if (step === undefined) {
        step = '';
      } else {
        step = ` and MOD(LEVEL, ${step}) = 0`;
      }
      if (to === undefined) {
        to = from;
        from = 0;
      }
      _variables["_result"]["is_range_column"] = true;
      _variables["_result"]["expr"] = 'koob__range__';
      _variables["_result"]["columns"] = ["koob__range__"];
      _variables["_result"]["join"] = {
        "type": "inner",
        "expr": `(
      select LEVEL-1 AS koob__range__ from dual
      where LEVEL between ${from}+1 and ${to}${step}
      connect by LEVEL <= ${to}
      )`
      };
      return 'koob__range__';
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_variables._target_database === 'sqlserver') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // только JOIN
      //
      if (step === undefined) {
        step = 1;
      }
      if (to === undefined) {
        to = from;
        from = 0;
      }
      let numbers = [];
      for (let i = from; i < to; i += step) {
        numbers.push(`(${i})`);
      }
      _variables["_result"]["is_range_column"] = true;
      _variables["_result"]["expr"] = 'koob__range__';
      _variables["_result"]["columns"] = ["koob__range__"];
      _variables["_result"]["join"] = {
        "type": "inner",
        "alias": "koob__range__table__",
        "expr": `(
      select koob__range__ FROM (VALUES ${numbers.join(", ")}) vals(koob__range__)
      )`

        // (select n FROM (VALUES (0), (1), (2)) v1(n)) as t
      };
      return 'koob__range__';
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_variables._target_database === 'vertica') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // только JOIN
      //
      if (step === undefined) {
        step = '';
      } else {
        step = ` WHERE MOD(koob__range__, ${step}) = 0`;
      }
      if (to === undefined) {
        to = from - 1;
        from = 0;
      } else {
        to = to - 1;
      }
      _variables["_result"]["is_range_column"] = true;
      _variables["_result"]["expr"] = 'koob__range__';
      _variables["_result"]["columns"] = ["koob__range__"];
      _variables["_result"]["join"] = {
        "type": "inner",
        "alias": "koob__range__table__",
        "expr": `(
          WITH koob__range__table__seq AS (
            SELECT ROW_NUMBER() OVER() - 1 AS koob__range__ FROM (
                SELECT 1 FROM (
                    SELECT date(0) + INTERVAL '${from} second' AS se UNION ALL
                    SELECT date(0) + INTERVAL '${to} seconds' AS se ) a
                TIMESERIES tm AS '1 second' OVER(ORDER BY se)
            ) b
        )
        SELECT koob__range__ FROM koob__range__table__seq${step})`
      };
      return 'koob__range__';
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_variables._target_database === 'sap') {
      // SAP HANA
      if (step === undefined) {
        step = '1';
      } else {
        step = `${step}`;
      }
      if (to === undefined) {
        to = from;
        from = 0;
      }
      _variables["_result"]["is_range_column"] = true;
      _variables["_result"]["expr"] = 'koob__range__';
      _variables["_result"]["columns"] = ["koob__range__"];
      _variables["_result"]["join"] = {
        "type": "inner",
        "expr": `(
      select GENERATED_PERIOD_START AS koob__range__ from SERIES_GENERATE_INTEGER(${step}, ${from}, ${to})
      )`
      };
      return 'koob__range__';
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else {
      throw Error(`range() is not supported in ${_variables._target_database}`);
    }
  };
  _context['pointInPolygon'] = (0,dist_lpe.makeSF)((ast, ctx) => {
    //console.log(JSON.stringify(ast))
    // [["tuple","lat","lng"],["[",["tuple",0,0],["tuple",0,1],["tuple",1,0],["tuple",1,1]]]
    var point = ast[0];
    var pnt = (0,dist_lpe.eval_lisp)(point, _ctx); // point as first argument

    var poly = (0,dist_lpe.eval_lisp)(ast[1], _ctx);
    if (_variables._target_database === 'clickhouse') {
      return `pointInPolygon(${pnt}, [${poly}])`;
    } else if (_variables._target_database === 'postgresql') {
      // circle '((0,0),2)' @> point '(1,1)'        	polygon '((0,0),(1,1))'
      return `polygon '(${poly})' @> point${pnt}`;
    } else {
      throw Error(`pointInPolygon is not supported in ${_variables._target_database}`);
    }
  });
  _context['pointInEllipses'] = function () {
    if (_variables._target_database !== 'clickhouse') {
      throw Error(`pointInEllipses is not supported in ${_variables._target_database}`);
    }
    var a = Array.prototype.slice.call(arguments);
    if ((a.length - 2) % 4 != 0) {
      throw Error(`pointInEllipses should contain correct number of coordinates!`);
    }
    return `pointInEllipses(${a.join(',')})`;
  };
  _context['pointInCircle'] = (0,dist_lpe.makeSF)((ast, ctx) => {
    // ["lat","lng", 0,0,R]
    var point = ast[0];
    var x = (0,dist_lpe.eval_lisp)(ast[0], ctx); // point x
    var y = (0,dist_lpe.eval_lisp)(ast[1], ctx);
    var cx = (0,dist_lpe.eval_lisp)(ast[2], ctx); // center of circle
    var cy = (0,dist_lpe.eval_lisp)(ast[3], ctx); // center of circle
    var R = (0,dist_lpe.eval_lisp)(ast[4], ctx);
    if (_context._target_database === 'clickhouse') {
      return `pointInEllipses(${x},${y},${cx},${cy},${R},${R})`;
    } else if (_variables._target_database === 'postgresql') {
      return `circle(point(${cx},${cy}),${R}) @> point(${x},${y})`;
    } else {
      throw Error(`pointInPolygon is not supported in ${_variables._target_database}`);
    }
  });
  _context['()'] = function (a) {
    return `(${a})`;
  };

  /*
    _context['if'] = function(cond, truthy, falsy) {
      return `CASE WHEN ${cond} THEN ${truthy} ELSE ${falsy} END`
    }
  */

  _context['if'] = function () {
    let a = Array.prototype.slice.call(arguments);
    if (a.length < 2) {
      throw Error(`ifs() requires some arguments (at least 2)`);
    }
    let expr = '';
    let diff;
    if (a.length % 2 === 0) {
      expr = `CASE WHEN ${a[a.length - 2]} THEN ${a[a.length - 1]} END`;
      diff = 4;
    } else {
      expr = `${a[a.length - 1]}`;
      diff = 3;
    }
    for (let i = a.length - diff; i >= 0; i = i - 2) {
      // i = cond, i+1 = action
      expr = `CASE WHEN ${a[i]} THEN ${a[i + 1]} ELSE ${expr} END`;
    }
    return expr;
  };
  _context['concatWithSeparator'] = function () {
    let a = Array.prototype.slice.call(arguments);
    let head = 'concat_ws';
    if (_variables._target_database === 'clickhouse') {
      head = `concatWithSeparator(`;
    } else if (_variables._target_database === 'postgresql') {
      head = `concat_ws(`;
    } else {
      throw Error(`No concatWithSeparator() function support for flavor: ${_variables._target_database}`);
    }
    head = head.concat(a.join(',')).concat(')');
    return head;
  };
  _context['substring'] = function (str, offset, len) {
    if (_variables._target_database === 'clickhouse') {
      return `substringUTF8(${str}, ${offset}, ${len})`;
    } else {
      return `substring(${str}, ${offset}, ${len})`;
    }
  };
  _context['initcap'] = function (str) {
    if (_variables._target_database === 'clickhouse') {
      return `initcapUTF8(${str})`;
    } else {
      return `initcap(${str})`;
    }
  };
  _context['length'] = function (str) {
    if (_variables._target_database === 'clickhouse') {
      return `lengthUTF8(${str})`;
    } else {
      return `length(${str})`;
    }
  };
  _context['left'] = function (str, len) {
    if (_variables._target_database === 'clickhouse') {
      return `leftUTF8(${str}, ${len})`;
    } else {
      return `left(${str}, ${len})`;
    }
  };
  _context['right'] = function (str, len) {
    if (_variables._target_database === 'clickhouse') {
      return `rightUTF8(${str}, ${len})`;
    } else {
      return `right(${str}, ${len})`;
    }
  };
  _context['/'] = function (l, r) {
    if (_variables._target_database === 'clickhouse') {
      return `CAST(${l} AS Nullable(Float64)) / ${r}`;
    } else {
      return `CAST(${l} AS FLOAT) / ${r}`;
    }
  };
  _context['tuple'] = function (first, second) {
    if (_variables._target_database === 'clickhouse') {
      return `tuple(${first},${second})`;
    } else {
      return `(${first},${second})`;
    }
  };
  _context['expr'] = function (a) {
    // Just placeholder for logical expressions, which should keep ()
    return a;
  };
  _context['get_in'] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // FIXME, кажется это вызывается из sql_where
    // возвращаем переменные, которые в нашем контексте, вызывая стандартный get_in
    // при этом наши переменные фильтруем!!пока что есть только _user_info и koob.request
    let _v = {
      "user": _variables["_user_info"],
      "koob": {
        "query": _variables["_koob_api_request_body"],
        "access_filters": _variables["_access_filters"],
        "access_filters_format": _variables["_access_filters_format"]
      }
    };
    //console.log(JSON.stringify(_v))
    //console.log(JSON.stringify(eval_lisp(["get_in"].concat(ast), _v, rs)))
    return (0,dist_lpe.eval_lisp)(["get_in"].concat(ast), _v, rs);
  });
  var partial_filter = function (a) {
    if ((0,dist_lpe.isArray)(a[0]) && a[0][0] === "ignore(me)") {
      var ignoreme = a.shift();
      a = a.map(el => {
        if ((0,dist_lpe.isArray)(el)) {
          el.splice(1, 0, ignoreme);
          return el;
        } else {
          return el;
        }
      });
    }
    //console.log("OR->OR->OR", JSON.stringify(a))
    a = a.map(el => (0,dist_lpe.eval_lisp)(el, _ctx));
    return a;
  };
  _context['or'] = function () {
    // Первый аргумент может быть ["ignore(me)",[]] = и надо его передать дальше!!!!
    // #244
    var a = Array.prototype.slice.call(arguments);
    //console.log("OR OR OR", JSON.stringify(a))
    // [["ignore(me)",["column","ch.fot_out.pay_code"]],["!="],["ilike","Муж"]]
    a = partial_filter(a);
    if ((0,dist_lpe.isArray)(a)) {
      if (a.length > 0) {
        return `(${a.join(') OR (')})`;
      }
    }
    // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments
    return '1=0';
  };
  _context['or'].ast = [[], {}, [], 1]; // mark as macro

  _context['and'] = function () {
    var a = Array.prototype.slice.call(arguments);
    a = partial_filter(a);
    //console.log('AND:' + JSON.stringify(a))
    if ((0,dist_lpe.isArray)(a)) {
      if (a.length > 0) {
        return `(${a.join(') AND (')})`;
      }
    }
    // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments
    return '1=1';
  };
  _context['and'].ast = [[], {}, [], 1]; // mark as macro

  _context['not'] = function () {
    var a = Array.prototype.slice.call(arguments);
    a = partial_filter(a);
    return `NOT ${a[0]}`;
  };
  _context['not'].ast = [[], {}, [], 1]; // mark as macro

  /**
   * resolveOptions может иметь ключ resolveString, но мы добавляем опцию
   * reolveColumn и если ЯВНО равно false, то не делаем поиска столбцов,которые были по-умолчанию
   */
  _context["'"] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    //console.log(`QUOT ${JSON.stringify(ast)} ${JSON.stringify(_variables["_result"])}`)
    // try to check if it is a column?
    let a = ast[0];
    if (rs.resolveColumn === false) {
      //console.log(`SINGLE QUOT resolveColumn: false ==${db_quote_literal(a)}==`)
      return db_quote_literal(a);
    }

    //console.log(`QUOT ${JSON.stringify(ast)} ==${c}== ${JSON.stringify(_variables["_result"])}`)
    //console.log(`CMP: ${c} !== ${a}\n ${JSON.stringify(_variables)}`)
    // FIXME: нужно искать именно этот столбец!!! в _variables???
    let resolvedColumn = _variables["_columns"];
    if ((0,dist_lpe.isHash)(resolvedColumn)) {
      resolvedColumn = resolvedColumn[_variables["_ds"]];
      if ((0,dist_lpe.isHash)(resolvedColumn)) {
        resolvedColumn = resolvedColumn[_variables["_cube"]];
        if ((0,dist_lpe.isHash)(resolvedColumn)) {
          resolvedColumn = resolvedColumn[a];
        }
      }
    }
    if ((0,dist_lpe.isHash)(resolvedColumn)) {
      // значит уже есть sql выражение, например ("рус яз")
      let c = _context["column"](a);
      return c;
    } else {
      return db_quote_literal(a);
    }
  });

  /**
    * resolveOptions может иметь ключ resolveString, но мы добавляем опцию
    * reolveColumn и если ЯВНО равно false, то неделаем поиска столбцов,которые былипо-умолчанию
    */

  _context['"'] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    //console.log(`QUOT ${JSON.stringify(ast)} ${JSON.stringify(_variables["_result"])}`)
    // try to check if it is a column?
    let a = ast[0];
    if (rs.resolveColumn === false) {
      //console.log(`QUOT resolveColumn: false ==${db_quote_ident(a)}==`)
      return db_quote_ident(a);
    } else {
      let c = _context["column"](a);
      //console.log(`QUOT ${JSON.stringify(ast)} ==${c}== ${JSON.stringify(_variables["_result"])}`)
      if (c != a) {
        // значит уже есть sql выражение, например ("рус яз")
        return c;
      } else {
        return db_quote_ident(a);
      }
    }
  });

  // overwrite STDLIB! or we will treat (a = 'null') as (a = null) which is wrong in SQL !
  _context['null'] = 'null';
  _context['true'] = 'true';
  _context['false'] = 'false';

  // FIXME: в каких-то случаях вызывается эта версия ql, а есть ещё одна !!!
  // _ctx.ql
  _context["ql"] = function (el) {
    // NULL values should not be quoted
    // plv8 version of db_quote_literal returns E'\\d\\d' for '\d\d' which is not supported in ClickHose :-()
    // so we created our own version...
    // console.log("QL: " + el)
    if ((0,dist_lpe.isArray)(el)) {
      // city=ql(get_in("user", "sys_config", "cities"))
      // FIXME: функция/макрос = парсит свой правый аргумент и пытается его тоже заквотировать
      // пока что вот так делаем и тогда всё корректно.
      return el;
    }
    return el === null ? null : db_quote_literal(el);
  };

  // специальная функция, видя которую не делаем магию и не подставляем имена столбцов куда попало
  _context["ensureThat"] = function (el) {
    return el;
  };

  /* тут мы не пометили AGG !!!
  _context['count'] = makeSF( (ast,ctx) => {
    var a;
    if (ast.length == 1) {
      a = ast[0]
    } else {
      a = ast
    }
    if (_context._target_database == 'clickhouse') {
      // Это БАГ в тыкдоме = отдаёт текстом значения, если count делать Ж-()
      return `toUInt32(count(${eval_lisp(a, ctx)}))`
    } else {
      return `count(${eval_lisp(a, ctx)})`
    }
  });*/

  _context['between'] = function (col, var1, var2) {
    /* while adding auto_quote for filters, these two calls are obsolete! */
    //if (shouldQuote(col,var1)) var1 = quoteLiteral(var1)
    //if (shouldQuote(col,var2)) var2 = quoteLiteral(var2)

    let l = (0,dist_lpe.eval_lisp)(var1, _ctx); // if we use _context -> we have now unknown function names passing to SQL level
    let r;
    if ((0,dist_lpe.isArray)(l)) {
      r = l[1];
      l = l[0];
    } else {
      r = (0,dist_lpe.eval_lisp)(var2, _ctx);
    }
    if (l === null || (0,dist_lpe.isString)(l) && (l.length === 0 || l === "''")) {
      if (r === null || (0,dist_lpe.isString)(r) && (r.length === 0 || r === "''")) {
        // both are empty, we should not generate any conditions!
        // FIXME: Should we return null?
        return '1=1';
      } else {
        // l is null, r is real
        return `${(0,dist_lpe.eval_lisp)(col, _ctx)} <= ${r}`;
      }
    } else {
      if (r === null || (0,dist_lpe.isString)(r) && (r.length === 0 || r === "''")) {
        // l is real, r is null
        return `${(0,dist_lpe.eval_lisp)(col, _ctx)} >= ${l}`;
      } else {
        // both l and r is real
        return `${(0,dist_lpe.eval_lisp)(col, _ctx)} BETWEEN ${l} AND ${r}`;
      }
    }
  };
  _context['between'].ast = [[], {}, [], 1]; // mark as macro

  _context['~'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl);
    // в каждой базе свои regexp
    if (_vars["_target_database"] === 'oracle') {
      return `REGEXP_LIKE( ${(0,dist_lpe.eval_lisp)(col, _ctx)} , ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)} )`;
    } else if (_vars["_target_database"] === 'mysql') {
      return `${(0,dist_lpe.eval_lisp)(col, _ctx)} REGEXP ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
    } else if (_vars["_target_database"] === 'clickhouse') {
      // case is important !!!
      return `match( ${(0,dist_lpe.eval_lisp)(col, _ctx)} , ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)} )`;
    } else {
      return `${(0,dist_lpe.eval_lisp)(col, _ctx)} ~ ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
    }
  };
  _context['~'].ast = [[], {}, [], 1]; // mark as macro

  _context['~*'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl);
    // в каждой базе свои regexp
    if (_vars["_target_database"] === 'oracle') {
      return `REGEXP_LIKE( ${(0,dist_lpe.eval_lisp)(col, _ctx)} , ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}, 'i')`;
    } else if (_vars["_target_database"] === 'mysql') {
      return `REGEXP_LIKE( ${(0,dist_lpe.eval_lisp)(col, _ctx)}, ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}, 'i')`;
    } else if (_vars["_target_database"] === 'clickhouse') {
      // case is not important !!!
      var pattern = (0,dist_lpe.eval_lisp)(tmpl, _ctx); // should be in quotes! 'ddff'
      pattern = `(?i:${pattern.slice(1, -1)})`;
      return `match( ${(0,dist_lpe.eval_lisp)(col, _ctx)} , '${pattern}' )`;
    } else {
      return `${(0,dist_lpe.eval_lisp)(col, _ctx)} ~* ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
    }
  };
  _context['~*'].ast = [[], {}, [], 1]; // mark as macro

  _context['!~'] = (0,dist_lpe.makeSF)((ast, ctx) => {
    return "NOT " + (0,dist_lpe.eval_lisp)(["~"].concat(ast), ctx);
  });
  _context['!~*'] = (0,dist_lpe.makeSF)((ast, ctx) => {
    return "NOT " + (0,dist_lpe.eval_lisp)(["~*"].concat(ast), ctx);
  });
  _context['like'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl);
    return `${(0,dist_lpe.eval_lisp)(col, _ctx)} LIKE ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
  };
  _context['like'].ast = [[], {}, [], 1]; // mark as macro

  _context['ilike'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl);
    if (_vars["_target_database"] === 'clickhouse') {
      // FIXME: detect column type !!!
      return `toString(${(0,dist_lpe.eval_lisp)(col, _ctx)}) ILIKE ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
    } else if (_vars["_target_database"] === 'oracle' || _vars["_target_database"] === 'sqlserver') {
      // FIXME! Oracle has something similar to ilike in v12 only :-()
      // FIXME: use regexp
      return `UPPER(${(0,dist_lpe.eval_lisp)(col, _ctx)}) LIKE UPPER(${(0,dist_lpe.eval_lisp)(tmpl, _ctx)})`;
    } else if (_vars["_target_database"] === 'mysql') {
      // https://www.oreilly.com/library/view/mysql-cookbook/0596001452/ch04s11.html
      return `${(0,dist_lpe.eval_lisp)(col, _ctx)} LIKE ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
    } else {
      return `${(0,dist_lpe.eval_lisp)(col, _ctx)} ILIKE ${(0,dist_lpe.eval_lisp)(tmpl, _ctx)}`;
    }
  };
  _context['ilike'].ast = [[], {}, [], 1]; // mark as macro

  _context['ignore(me)'] = function (arg) {
    return arg;
  };

  /*
  f1 / lpe_total(sum, f2)
  We should make subselect with full aggregation, but using our local WHERE!!!
  local WHERE is not Yet known, so we should postpone execution???
   But we probably can inject EVAL part into _context["_result"]["expr"] ??
  if (_context["_result"]){
   */

  /* DEPRECATED!!! */
  _context['lpe_subtotal'] = (0,dist_lpe.makeSF)((ast, ctx) => {
    if (_context["_result"]) {
      var seq = ++_context["_sequence"];
      if (!(0,dist_lpe.isHash)(_context["_result"]["lpe_subtotals"])) {
        _context["_result"]["lpe_subtotals"] = {};
      }
      //console.log("AST: ", ast)
      // FIXME: please check that we have agg func in the AST, overwise we will get SQL errors from the DB
      //AST:  [ [ 'sum', 'v_rel_pp' ] ]
      //AST:  [ [ '+', [ 'avg', 'v_rel_pp' ], 99 ] ]
      _context["_result"]["lpe_subtotals"][`lpe_subtotal_${seq}`] = {
        "ast": ast,
        "expr": `${(0,dist_lpe.eval_lisp)(ast[0], ctx)}`
      };
      // in simple cases we wil have this: {"lpe_totals":{
      // "lpe_total_2":{"ast":[["avg", "v_rel_pp"]],"expr":"avg(fot_out.v_rel_pp)"}}

      _context["_result"]["eval_expr"] = true;
    }
    // naive!!!
    return `lpe_subtotal_${seq}()`; // ${ast[0]}, ${ast[1]}
  });

  /*
  op - это "=" или "!=", от этого зависит делаем мы IN или NOT IN
  arg_list - это вычисляемое ast, которое может вернуть любой JSON либо текст, всегда будет в виде массива.
         Например, было ["=","a",123] у нас будет arg_list = [123]
  rs - это контекст вычисления, в котором может быть ценная инфа, типа 'where'
  */
  let eval_rvalue_for_equivalence = function (column, op, arg_list, ctx, rs) {
    /* правильный подход = это понимать тип столбца, и если это не INT, то квотировать
    элементы, но мы попадаем на варианты, когда ql() уже используется в выражении! */

    //console.log(`eval_rvalue_for_equivalence: ${JSON.stringify(arg_list)}`)
    let in_not_in, is_null_not_null, op_and_or;
    if (op === '=') {
      in_not_in = 'IN';
      is_null_not_null = 'IS NULL';
      op_and_or = 'OR';
    } else {
      in_not_in = 'NOT IN';
      is_null_not_null = 'IS NOT NULL';
      op_and_or = 'AND';
    }
    if (!(0,dist_lpe.isArray)(arg_list)) {
      throw new Error(`Can not process literal value ${arg_list}, accept only arrays`);
    }
    let quotAtomValue = function (v) {
      if ((0,dist_lpe.isNumber)(v)) {
        // FIXME кажется можно цифры тоже квотировать, но это не точно!
        // Нужно смотерть на тип столбца!!!
        return v;
      } else if (v === null) {
        // FIXME: нужно что-то для undefined !!!!
        return null;
      } else if (v === true || v === false) {
        return v;
      } else {
        return db_quote_literal(v);
      }
    };

    // #1393 flatMap is missing in plv8 2.3.15
    //       add flatten function and wrap map
    let flatten = function (arr, depth = 1) {
      if (depth === 1) {
        return flattenArr(arr);
      }
      let res = [];
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          res.push(flatten(arr[i], depth - 1));
        } else {
          res.push(arr[i]);
        }
      }
      return res;
    };
    let flattenArr = function (arr) {
      let res = [];
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          res = res.concat(flattenArr(arr[i]));
        } else {
          res.push(arr[i]);
        }
      }
      return res;
    };
    let rval = flatten(arg_list.map(ast_el => {
      if ((0,dist_lpe.isArray)(ast_el)) {
        if (ast_el[0] === "[") {
          //console.log(`rvalue is array: ` + JSON.stringify(ast_el))
          // лучше бы этого не делать вообще!!!
          // это массив значений, который мы превращаем в "col IN ()"
          // это значит, что мы не должны квотировать элементы cпециально!!! Но для фильтров у нас уже готовый LPE, и там нет никаких функций '
          // FIXME: мы должны пройти весь массив и индивидуально евалить каждый элемент.
          // Если элемент - это ["'","txt"], то его не надо больше проверять ни на что, он уже заквотирован.
          // Иначе, надо проверить...
          // также надо проверить, что есть NULL прямо здесь!
          let detect = ast_el.slice(1).find(element => element !== null);
          if (detect !== undefined) {
            if (detect[0] === "'") {
              // есть как минимум одна кавычка, ожидаем, что eval всё закавычит автоматически!
              let v = (0,dist_lpe.eval_lisp)(ast_el, ctx, rs);
              return v;
            }
          }
        }

        // здесь эвалим LPE выражение, которое вообще-то может вернуть массив
        // который хорошо бы грамотно докинуть внутрь уже существующего массива rval.
        // возможно map() = это плохая идея и нужен цикл
        // ["=","Москва", "Питер", ["get_in", "user", "groups"]]
        // хорошо бы получить норм SQL:  IN ('Москва', 'Питер', 'GRP1', 'группа2')
        let v = (0,dist_lpe.eval_lisp)(ast_el, ctx, rs);
        if ((0,dist_lpe.isArray)(v)) {
          v = v.map(quotAtomValue);
        }
        return v;
      } else {
        // if (col=col) = не нужно кавычки ставить!
        return ast_el;
        //return quotAtomValue(ast_el)
      }
    }));
    // если наше выражение = это функция массив, то мы бежим по всем элементам...

    /* мы должны пройти по всему списку arg_list, и каждый элемент проэвалить!
    можно сэкономить, так как koob api шлёт неправильную скоботу, и эвалить константы
    не имеет смысла! */
    //console.log(`  eval_rvalue_for_equivalence evaled: ${JSON.stringify(rval)}`)

    if (rval.length === 1) {
      rval = rval[0]; // массив из одного элемента - это сам элемент
    }
    if (rval === null) {
      return `${column} ${is_null_not_null}`;
    }
    if (rval === undefined) {
      return '1=1'; // FIXME, если op это !=, то что значит col != undefined ?????
    }
    if ((0,dist_lpe.isArray)(rval)) {
      let notNullValues = rval.filter(function (el) {
        return el !== null;
      });
      if (notNullValues.length === rval.length) {
        if (notNullValues.length === 0) {
          return '1=1'; // FIXME, если op это !=, то что значит col != пустое место ?????
        } else {
          return `${column} ${in_not_in} (${notNullValues.join(', ')})`;
        }
      } else {
        if (notNullValues.length === 0) {
          return `${column} ${is_null_not_null}`;
        } else {
          return `${column} ${in_not_in} (${notNullValues.join(', ')}) ${op_and_or} ${column} ${is_null_not_null}`;
        }
      }
    }

    // FIXME: это надо добавить в quotAtomValue
    if ((0,dist_lpe.isHash)(rval)) {
      //throw new Error(`Comparation column ${column} with Object is not supported`);
      return `${column} ${op} ${db_quote_literal(JSON.stringify(rval))}`;
    }
    return `${column} ${op} ${rval}`;
  };
  _context['='] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // понимаем a = [null] как a is null
    // a = [] просто пропускаем, А кстати почему собственно???
    // a = [null, 1,2] как a in (1,2) or a is null

    // ["=",["column","vNetwork.cluster"],SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]
    // var a = Array.prototype.slice.call(arguments)
    // console.log("=========" + JSON.stringify(ast))
    var col = ast[0];

    /* FIXME !!! AGHTUNG !!!!
    было var c = eval_lisp(col, _context) и сложные выражения типа if ( sum(v_rel_pp)=0, 0, sum(pay_code)/sum(v_rel_pp)):d
    не резолвились, так как функции sum,avg,min и т.д. сделаны в общем виде!!!
    Видимо, надо везде переходить на _ctx !!!!
    */
    var c = (0,dist_lpe.eval_lisp)(col, ctx, rs);

    /* была попытка сделать сравнение с типом столбца ARRAY и даже управлять именем функции,
    которую писали в конфиге. Пока что уберём
      (clickhouseArray === true ? `arrayIntersect(${c}, [${v}]) = []` : `${c} != ${v}`)
      let clickhouseArray = _variables["_columns"][`${_variables["_ds"]}.${c}`]
    if (clickhouseArray===undefined) {
      clickhouseArray = _variables["_columns"][`${_variables["_ds"]}.${_variables["_cube"]}.${c}`]
    }
    if (isHash(clickhouseArray)){
      clickhouseArray = clickhouseArray["config"]
      if (isHash(clickhouseArray)){
        clickhouseArray = clickhouseArray["clickhouseArray"] // assume = true
      }
    } */

    if (ast.length === 1) {
      return '1=0';
    } else {
      return eval_rvalue_for_equivalence(c, '=', ast.slice(1), ctx, rs);
    }
  });
  _context["["] = (...args) => args;
  _context['!='] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // понимаем a != [null] как a is not null
    // a != [] просто пропускаем, А кстати почему собственно???
    // a != [null, 1,2] как a not in (1,2) and a is not null

    // ["!=",["column","vNetwork.cluster"],SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]
    // var a = Array.prototype.slice.call(arguments)
    // console.log("!=!=!=" , JSON.stringify(ast))
    var col = ast[0];
    var c = (0,dist_lpe.eval_lisp)(col, ctx, rs);
    if (ast.length === 1) {
      return '1=1';
    } else {
      return eval_rvalue_for_equivalence(c, '!=', ast.slice(1), ctx, rs);
    }
  });

  //console.log('CONTEXT RETURN!', _ctx[0]['()']);
  return _ctx;
}
function extend_context_for_order_by(_context, _cfg) {
  // создаём контекст с двумя макросами + и -, а они вызовут обычный контекст....
  // можно пробовать переопределить реализацию функции column и поиска литералов/алиасов
  // но пока что будет так

  var aliasContext = [
  //
  {
    "colref": (0,dist_lpe.makeSF)(col => {
      /* col[0] содержит ровно то, что было в изначальном конфиге на входе!
      */
      //console.log("NEW COLREF!!!:", JSON.stringify(col))
      /*
        Postgresql: order by random()
        Greenplum:  order by random()
        Oracle:     order by dbms_random.value()
        MS SQL:     order by newid()
        Mysql:      order by rand()
        Clickhouse: order by rand()
        DB2:        order by rand()
        */
      if (col[0] === 'rand()') {
        var tdb = _context[1]._target_database;
        if (tdb === 'postgresql') {
          return 'random()';
        } else if (tdb === 'oracle') {
          return 'dbms_random.value()';
        } else if (tdb === 'sqlserver') {
          return 'newid()';
        } else {
          return 'rand()';
        }
      }
      if (col[0] in _cfg["_aliases"]) {
        if (upper_by_default(_context[1]._target_database) || should_quote_alias(col[0])) {
          return `"${col[0]}"`;
        } else {
          return col[0];
        }
      }
      var parts = col[0].split('.');
      if (parts.length === 3) {
        return `${parts[1]}.${parts[2]}`;
        //return parts[2]
      } else {
        if (upper_by_default(_context[1]._target_database) || should_quote_alias(col[0])) {
          // пытаемся полечить проблему Oracle UPPER CASE имён
          //console.log(`HOPP ${JSON.stringify(_cfg["_aliases"])}`)
          // в алиасах у нас нет такого столбца
          return `"${col[0]}"`;
        }
      }
      return col[0];

      /*
      if (_context[1]["_columns"][key]) return _context["column"](key)
      if (_context[1]["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
      return col*/
    }),
    "column": (0,dist_lpe.makeSF)(col => {
      /* примерно на 222 строке есть обработчик-резолвер литералов, там хардкодный вызов функции
        if (_context["_columns"][key]) return _context["column"](key)
        то есть вызывается функция column в явном виде, а тут мы просто печатаем, что нам прислали.
         FIXME: ИМЕЕТ смысл сделать функцию colref() и типа ссылаться на какой-то столбец.
        И тут мы можем умно резолвить имена столбцов и алиасы и подставлять то, что нам надо.
        ЛИБО объявить тут функцию как МАКРОС и тогда уже правильно отработать column
        NEW COL: ["ch.fot_out.dor1"]
        console.log("NEW COL", col)
         _context[1]["_columns"] содержит описания из БД
      */
      var parts = col[0].split('.');
      if (parts.length === 3) {
        return `${parts[1]}.${parts[2]}`;
        //return parts[2]
      } else {
        return col[0];
      }

      /*
      if (_context[1]["_columns"][key]) return _context["column"](key)
      if (_context[1]["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
      return col*/
    })
  }, ..._context];
  let _ctx = {};
  _ctx["+"] = (0,dist_lpe.makeSF)(ast => {
    return (0,dist_lpe.eval_lisp)(ast[0], aliasContext);
  });
  _ctx["-"] = (0,dist_lpe.makeSF)(ast => {
    return `${(0,dist_lpe.eval_lisp)(ast[0], aliasContext)} DESC`;
  });
  return _ctx;
}

/* В итоге у нас получается явный GROUP BY по указанным столбцам-dimensions и неявный group by по всем остальным dimensions куба.
 Свободные дименшены могут иметь мембера ALL, и во избежание удвоения сумм, требуется ВКЛЮЧИТЬ мембера ALL в суммирование как некий кэш.
 Другими словами, по ВСЕМ свободным дименшенам, у которых есть мембер ALL (см. конфиг) требуется добавить фильтр dimX = 'ALL' !
  Также можно считать агрегаты на лету, но для этого требуется ИСКЛЮЧИТЬ memberALL из агрегирования!!!
  Для указанных явно дименшенов доп. условий не требуется, клиент сам должен задать фильтры и понимать последствия.
 В любом случае по group by столбцам не будет удвоения, memberAll будет явно представлен отдельно в результатах
*/

function inject_all_member_filters(_cfg, columns) {
  /* _cfg.filters может быть {} а может быть [{},{}] и тут у нас дикий код */

  var processed = {};
  if ((0,dist_lpe.isHash)(_cfg["filters"])) {
    _cfg["filters"] = get_all_member_filters(_cfg, columns, _cfg["filters"]);
  } else if ((0,dist_lpe.isArray)(_cfg["filters"])) {
    _cfg["filters"] = _cfg["filters"].map(obj => get_all_member_filters(_cfg, columns, obj));
  }
  return _cfg;
}
function inject_parallel_hierarchy_filters(_cfg, columns) {
  /* _cfg.filters может быть {} а может быть [{},{}] и тут у нас дикий код */
  var processed = {};
  if ((0,dist_lpe.isHash)(_cfg["filters"])) {
    _cfg["filters"] = get_parallel_hierarchy_filters(_cfg, columns, _cfg["filters"]);
  } else if ((0,dist_lpe.isArray)(_cfg["filters"])) {
    _cfg["filters"] = _cfg["filters"].map(obj => get_parallel_hierarchy_filters(_cfg, columns, obj));
  }
  return _cfg;
}
function get_parallel_hierarchy_filters(_cfg, columns, _filters) {
  //console.log("FILTERS", JSON.stringify(_filters))
  //console.log("columns", JSON.stringify(columns))
  // Ищем dimensions, у которых тип parallel и они ещё не указаны в фильтрах
  // ПО ВСЕМ СТОЛБАМ!!!
  Object.values(columns).map(el => {
    if ((0,dist_lpe.isHash)(el.config)) {
      // если это параллельный дименшн и нет явно фильтра по нему
      //if (el.config.hierarchyType === 'parallel' && !isArray(_filters[el.id])){
      // НА САМОМ ДЕЛЕ ЭТО sharedDimension ???? conflicting
      // если есть значение по умолчанию, и не было явно указано фильтров, то ставим значение по умолчанию

      if (el.config.defaultValue !== undefined && !(0,dist_lpe.isArray)(_filters[el.id])) {
        if ((0,dist_lpe.isArray)(el.config.defaultValue)) {
          // This is parsed lpe AST
          // для дефолтного значения типа ["=","txt"] заменяем строковые литералы на ["=",["ql",literal]]
          _filters[el.id] = auto_quote_filters_expr(el.config.defaultValue);
        } else {
          if ((0,dist_lpe.isString)(el.config.defaultValue) && el.config.defaultValue.startsWith('lpe:')) {
            let expr = el.config.defaultValue.substr(4);
            let evaled = (0,dist_lpe.parse)(expr);
            if ((0,dist_lpe.isArray)(evaled) && (evaled[0] === '"' || evaled[0] === "'")) {
              // это константа и поэтому нужно добавить равенство!
              _filters[el.id] = ["=", evaled];
            } else {
              _filters[el.id] = evaled;
            }
          } else {
            if ((0,dist_lpe.isString)(el.config.defaultValue)) {
              _filters[el.id] = ["=", ["ql", el.config.defaultValue]];
            } else {
              _filters[el.id] = ["=", el.config.defaultValue];
            }
          }
        }
      }
    }
  });
  return _filters;
}

/*
Если у нас есть group by, то используем memeberALL,

Потом, к тем фильтрам, которые получились, добавляем фильтры по столбцам, где есть ключ "hierarchy_type":"parallel"
и делаем фильтр "default_value", НО ТОЛЬКО ЕСЛИ В ЗАПРОСЕ НЕТУ КЛЮЧА "distinct": "force"

*/

function get_all_member_filters(_cfg, columns, _filters) {
  var processed = {}; // лучше его использовать как аккумулятор для накопления ответа, это вам не Clojure!
  var h = {};
  // заполняем хэш h длинными именами столбцов, по которым явно есть GROUP BY
  _cfg["_group_by"].map(el => {
    el.columns.map(e => h[e] = true);
  });
  //console.log("FILTERS", JSON.stringify(_filters))
  //console.log("columns", JSON.stringify(columns))
  // Ищем dimensions, по которым явно указан memeber ALL, и которых НЕТ в нашем явном списке...
  // ПО ВСЕМ СТОЛБАМ!!!
  Object.values(columns).map(el => {
    if (h[el.id] === true) {
      return; // столбец уже есть в списке group by!
    }
    if ((0,dist_lpe.isHash)(el.config)) {
      // Если для столбца прописано в конфиге follow=[], и нашего столбца ещё нет в списке фильтров, то надо добавить фильтр
      if ((0,dist_lpe.isArray)(el.config.follow) && !(0,dist_lpe.isArray)(_filters[el.id])) {
        for (let alt of el.config.follow) {
          // names should skip datasource
          let altId = `${_cfg.ds}.${alt}`;
          //console.log(`###checking ${el.config.follow} ${altId}`, JSON.stringify(_filters[el.id]) )
          // По столбцу за которым мы следуем есть условие
          if ((0,dist_lpe.isArray)(_filters[altId])) {
            if (_filters[altId].length == 2) {
              // у столбца описан memberAll
              if (columns[altId].config.memberALL === null || (0,dist_lpe.isString)(columns[altId].config.memberALL) || (0,dist_lpe.isNumber)(columns[altId].config.memberALL)) {
                var f = _filters[altId];
                /* раньше мы всегда использовали литералы, а теперь насильно добавляем ["ql",literal]
                поэтому сравнивать значения стало намного сложнее, но надеемся на лучшее!
                FIXME!!! было: if (f[1][1]==columns[altId].config.memberALL) */
                if (f[1][1] == columns[altId].config.memberALL) {
                  // Есть условие по столбцу, которому мы должны следовать, надо добавить такое же условие!
                  if ((0,dist_lpe.isArray)(f[1]) && f[1][0] === "ql") {
                    _filters[el.id] = [f[0], f[1]];
                  } else {
                    _filters[el.id] = [f[0], ["ql", f[1]]];
                  }
                  break;
                }
              }
            }
            // так как есть условие по основному столбцу, мы не знаем точно, какое наше значение ему соответствует,
            // и чтобы не добавлялся memberALL ниже, мы пропускаем наш столбец
            return;
          }
        }
      }
      if (el.config.memberALL === null || (0,dist_lpe.isString)(el.config.memberALL) || (0,dist_lpe.isNumber)(el.config.memberALL)) {
        // есть значение для члена ALL, и оно в виде строки или IS NULL
        // добавляем фильтр, но только если по этому столбцу нет другого фильтра (который задали в конфиге)!!!
        // NOTE: по ключу filters ещё не было нормализации !!!

        if (!(0,dist_lpe.isArray)(_filters[el.id])) {
          // Также нужно проверить нет ли уже фильтра по столбцу, который является altId
          if ((0,dist_lpe.isArray)(el.config.altDimensions)) {
            for (let alt of el.config.altDimensions) {
              // names must skip datasource, but may skip cube, let's add our cube if it is missed...
              let altId = '';
              if (alt.includes('.')) {
                altId = `${_cfg.ds}.${alt}`;
              } else {
                altId = `${_cfg.ds}.${_cfg.cube}.${alt}`;
              }
              //console.log("ALT", JSON.stringify(altId))
              if ((0,dist_lpe.isArray)(_filters[altId]) || h[altId] === true) {
                // уже есть условие по столбцу из altId, не добавляем новое условие
                // но только в том случае, если у нас явно просят этот столбец в выдачу
                // if ( h[])
                return;
              }
            }
          }
          //console.log(`!!!!checking  ${el.id} children`, JSON.stringify(el.config.children) )
          // Если есть дочерние столбцы, то надо проверить нет ли их в GROUP BY или В Фильтрах
          if ((0,dist_lpe.isArray)(el.config.children)) {
            for (let alt of el.config.children) {
              let altId = '';
              if (alt.includes('.')) {
                altId = `${_cfg.ds}.${alt}`;
              } else {
                altId = `${_cfg.ds}.${_cfg.cube}.${alt}`;
              }
              if ((0,dist_lpe.isArray)(_filters[altId]) || h[altId] === true) {
                // children уже специфицированы, не надо добавлять меня!
                return;
              }
            }
          }
          _filters[el.id] = ["=", ["ql", el.config.memberALL]];
        }
      }
    }
  });
  //console.log("FILTERS AFTER", JSON.stringify(_filters))

  return _filters;
}

/* возвращает все или некоторые фильтры в виде массива
если указаны required_columns и negate == falsy, то возвращает фильтры, соответсвующие required_columns
если указаны required_columns и negate == trufy, то возвращает все, кроме указанных в required_columns фильтров

Sep 2023: так как это для части SQL WHERE, то мы никогда не возвращаем столбцы, у которых стоит признак agg
*/

/* sql_context нужен для передачи в функцию `columns` = для принятия решения, используем ли мы имя таблицы
в clickhouse или нет*/

/* FIXME: в context обычно в 1-м элементе массива идёт структура с _aliases и c _target_database
   с помощью этого можно поискать по алиасам !!!
*/
function get_filters_array(context, filters_array, cube, required_columns, negate, sql_context) {
  //console.log("get_filters_array " + JSON.stringify(filters_array))
  // [{"ch.fot_out.hcode_name":[">","2019-01-01"],"ch.fot_out.pay_title":["=","2019-01-01","2020-03-01"],"ch.fot_out.group_pay_name":["=","Не задано"],"ch.fot_out.pay_code":["=","Не задано"],"ch.fot_out.pay_name":["=","Не задано"],"ch.fot_out.sex_code":["=",null]}]
  //console.log(`get_filters_array ${negate} required_columns: ` + JSON.stringify(required_columns))
  //console.log("======")

  /* нужно пройти по LPE и добавить второй аргумент ко всем вызовам column(), чтобы чётко указать
  что это контекст where или having */

  let reformator = function (ar) {
    if ((0,dist_lpe.isArray)(ar)) {
      if (ar[0] === "column") {
        ar[2] = sql_context;
        return ar;
      } else {
        return ar.map(el => {
          if ((0,dist_lpe.isArray)(el)) {
            return reformator(el);
          } else {
            return el;
          }
        });
      }
    }
    return ar;
  };
  filters_array = filters_array.map(el => {
    let h = {};
    for (const [key, value] of Object.entries(el)) {
      h[key] = reformator(value);
    }
    return h;
  });

  //console.log("get_filters_array0 <<<< " + JSON.stringify(filters_array))

  let comparator = function (k) {
    return k !== "";
  };
  /*  required_columns может содержать не вычисленные значения:
    ["id","'dt':'date'"] (кавычки, двоеточия)
    нужно их аккуратно вычислить, но пока неясно, в каком контексте...
  */
  let aliases = {};
  let ignore_quot = function (ast) {
    if ((0,dist_lpe.isArray)(ast)) {
      return ast[1];
    } else {
      return ast;
    }
  };
  let local_alias_lpe_evaled_map = {};

  //FIXME hack чтобы работал код для agg функций
  context[1]["_result"] = {
    "columns": []
  };
  if ((0,dist_lpe.isArray)(required_columns) && required_columns.length > 0) {
    //console.log(`REQ COLS: ${JSON.stringify(required_columns)}`)
    required_columns = required_columns.map(el => {
      let ast = (0,dist_lpe.isArray)(el) ? el : (0,dist_lpe.parse)(el); // с мая 2024 мы используем LPE, и столбцы уже могли пройти parse
      let colname, aliasname;
      //console.log('get_filters_array1> ' + JSON.stringify(ast))
      if ((0,dist_lpe.isArray)(ast)) {
        //[":",["'","dt"],["'","date"]]
        // FIXME: не будем делать context & eval, но надо бы

        if (ast[0] === ':') {
          colname = ignore_quot(ast[1]);
          // [":",["'","dt"],["()",["->",["\"","date space"],["\"","tbl"],["\"","col"]]]]
          if ((0,dist_lpe.isArray)(ast[2]) && ast[2][0] === '()') {
            ast[2] = ast[2][1];
            aliasname = (0,dist_lpe.eval_lisp)(ast[2], context);
            //console.log(`get_filters_array2><< ${aliasname} ==` + JSON.stringify(ast[2]))
            local_alias_lpe_evaled_map[aliasname] = true;
          } else {
            //aliasname = ignore_quot(ast[2])
            aliasname = (0,dist_lpe.eval_lisp)(ast[2], context);
          }
          //console.log('get_filters_array3=== ' + aliasname)
        } else {
          colname = ignore_quot(ast);
          aliasname = colname;
        }
      } else {
        colname = el;
        aliasname = el;
      }
      colname = cube + '.' + colname;
      aliases[colname] = aliasname;
      return colname;
    });
    if (negate) {
      comparator = function (k) {
        return k !== "" && !required_columns.includes(k);
      };
    } else {
      comparator = function (k) {
        return k !== "" && required_columns.includes(k);
      };
    }
  }
  let c = context[1];
  let should_quot_local_alias = function (a) {
    if (local_alias_lpe_evaled_map[a] === true) {
      return false;
    }
    if (a.startsWith("'") || a.startsWith('"')) {
      return false;
    }
    return should_quote_alias(a);
  };
  var ret = filters_array.map(_filters => {
    let part_where = null;
    let pw = Object.keys(_filters).filter(k => comparator(k)).map(key => {
      // специальная функция `ignore(me)` = которая ничего не делает, но является меткой для
      // and or not
      const [op, ...args] = _filters[key];
      let colname = aliases[key]; // это только при наличии required_columns
      //console.log(`   STEP ${colname}`)
      if ((0,dist_lpe.isString)(colname)) {
        if (should_quot_local_alias(colname)) {
          // FIXME: double check that lisp is ok with quoted string
          colname = db_quote_ident(colname);
        }
      } else {
        // ищем варианты для фильтров по алиасам "xxx": ["=","знач"]
        // для clickhouse НУЖНО использовать ALIASES!!!
        if (c._target_database !== 'clickhouse' && (0,dist_lpe.isHash)(c._aliases) && (0,dist_lpe.isHash)(c._aliases[key]) && c._aliases[key].expr) {
          colname = c._aliases[key].expr;
        } else {
          colname = ["column", key, sql_context];
        }
      }
      //console.log(`   STEP1 ${colname}`)

      if (op === "ensureThat") {
        return [op, ...args];
      } else {
        //console.log(`STEP0: ${colname} == ${local_alias_lpe_evaled_map[colname]} `)
        return [op, ["ignore(me)", colname], ...args];
      }

      /*
      let el = _filters[key].slice(0)
      el.splice(1,0,["ignore(me)",["column",key]])
      return el*/
    });
    //console.log("step:" + JSON.stringify(pw))

    // условия по пустому ключу "" подставляем только если у нас генерация полного условия WHERE,
    // а если это filter(col1,col2) то не надо
    if (required_columns === undefined || (0,dist_lpe.isArray)(required_columns) && required_columns.length === 0 || negate === true) {
      if ((0,dist_lpe.isArray)(_filters[""])) {
        if ((0,dist_lpe.isArray)(pw)) {
          pw.push(_filters[""]);
        } else {
          pw = _filters[""];
        }
      }
    }
    if (pw.length > 0) {
      let wh = ["and"].concat(pw);
      // console.log("--WHERE", JSON.stringify(wh))
      // возможно, тут нужен спец. контекст с правильной обработкой or/and  функций.
      // ибо первым аргументом мы тут всегда ставим столбец!!!
      //console.log('*****: ' + JSON.stringify(wh))
      part_where = (0,dist_lpe.eval_lisp)(JSON.parse(JSON.stringify(wh)), context);
      //console.log('.....: ' + JSON.stringify(filters_array))
    } else {
      part_where = (0,dist_lpe.eval_lisp)(JSON.parse(JSON.stringify(pw)), context);
    }
    return part_where;
  }).filter(el => el !== null && el.length > 0);
  delete context[1]["_result"];

  //console.log("RET: " + ret)
  //console.log(JSON.stringify(filters_array))
  //console.log("---------------------------")
  return ret;
}

/* Добавляем ключ "_aliases", чтобы можно было легко найти столбец по алиасу */
function cache_alias_keys(_cfg) {
  /*
  "_columns":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INTERVAL '1 DAY')"},
   {"columns":["ch.fot_out.branch4"],"expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":
   ["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":"sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},
   {"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}]
   */

  _cfg["_aliases"] = {};
  _cfg["_columns"].map(el => {
    var k = el["alias"];
    if (k && k.length > 0) {
      // включаем это в кэш
      if (_cfg["_aliases"][k]) {
        // EXCEPTION, duplicate aliases
        throw Error(`Duplicate alias ${k} for ${JSON.stringify(el)}`);
      }
      _cfg["_aliases"][k] = el;
    } else {
      // SKIPPED, no Alias found !!!
    }
  });
  //console.log("######", JSON.stringify(_cfg))
  return _cfg;
}

//  но возможно для teradata и oracle мы захотим брать в двойные кавычки...
function genereate_subtotals_group_by(cfg, group_by_list, target_database) {
  let subtotals = cfg["subtotals"];
  let ret = {
    'group_by': '',
    'select': [],
    'having': ''
  };
  //console.log(`SUBTOTALS CFG ${JSON.stringify(cfg)}`)
  // {"ds":"ch","cube":"fot_out",
  //console.log(`GROUP BY: ${JSON.stringify(subtotals)} ${JSON.stringify(group_by_list)}`)
  if (group_by_list.length === 0) {
    return ret;
  }

  //cfg["_group_by"].map(el => console.log(JSON.stringify(el)))
  //subtotals.map(el => console.log(JSON.strisngify(el)))
  let group_by_exprs = target_database === 'clickhouse' ? group_by_list.map(el => el.alias ? el.alias : el.expr) : group_by_list.map(el => el.expr);
  let group_by_aliases = group_by_list.map(el => el.alias).filter(el => el !== undefined);
  let group_by_columns = null;
  let group_by_sql = group_by_exprs.join(', ');
  let check_column_existence = function (col) {
    var i = group_by_exprs.indexOf(col);
    if (i === -1) {
      i = group_by_exprs.indexOf(`"${col}"`);
      if (i === -1) {
        i = group_by_aliases.indexOf(col);
        if (i === -1) {
          i = group_by_aliases.indexOf(`"${col}"`); //FIXME - не уверен что в алиасы попадут заквотированные имена!
          if (i === -1) {
            if (group_by_columns === null) {
              group_by_columns = group_by_list.map(el => (0,dist_lpe.isString)(el.columns[0]) ? el.columns[0].split('.')[2] : undefined).filter(el => el !== undefined);
              //console.log(JSON.stringify(group_by_columns));
            }
            var i = group_by_columns.indexOf(col);
            if (i === -1) {
              //console.log(`GROUP BY for ${col} : ${JSON.stringify(group_by_list)}`)
              // GROUP BY: ["dt"] [{"columns":["ch.fot_out.dt"],"alias":"ddd","expr":"(NOW() - INTERVAL '1 DAY')"}]
              throw Error(`looking for column ${col} listed in subtotals, but can not find in group_by`);
            }
          }
        }
      }
    }
  };

  // check existance of range() column
  let range_cols = group_by_list.filter(el => el.is_range_column === true);
  let range_col = range_cols[0];
  let range_col_in_the_middle = false;

  // проверяем, является ли range НЕ первым столбцом в subtotals ??? #1248
  // FIXME считается, что у нас может быть только один range column!!!

  for (let i = 1; i < subtotals.length; i++) {
    let subtotal_name = subtotals[i];
    let gb_range_column_index = group_by_list.findIndex(c => c.is_range_column === true && (c.expr === subtotal_name || c.expr === `"${subtotal_name}"` || c.alias === subtotal_name || c.alias === `"${subtotal_name}"`));

    //console.log(`${target_database}# SUBTOTAL: ${subtotal_name}` + gb_range_column_index)
    //console.log(JSON.stringify(group_by_list))
    if (gb_range_column_index !== -1) {
      range_col_in_the_middle = true;
      range_col = group_by_list[gb_range_column_index];
      break;
    }
  } // for

  /*
  if (!range_col_in_the_middle && isObject(range_col) && group_by_list[0].is_range_column !== true){
    // есть вариант, что в subtotals у нас не найдено range in the middle, но
    // в самом group by есть range, и он не на первом месте (но по фэншую надо искать с условием не только на первом месте)    // На всякий случай добавляем фильтрацию!
     range_col_in_the_middle = true
  }*/

  //let accum_val = (group_by_list[0] && group_by_list[0].is_range_column === true) ? [range_col.expr] : []
  let accum_val = [];

  // {"options": ["AllButOneInterleaved"] }
  // нужно сделать без учёта subtotals !!!
  let cross_subtotals_combinations = function () {
    return subtotals.map(col => {
      check_column_existence(col);
      //console.log(JSON.stringify(group_by_list.filter(c => c !== col).join(', ')))
      /*
          let r = []
      for (let i=0; i < group_by_list.length; i++){
        let line = group_by_list.slice(0, i).concat(group_by_list.slice(i+1))
        r.push(line.map(c => c.expr).join(', '))
      }
      return r
      */
      // FIXME: range should be handled smartly!!!!
      return group_by_list.filter(c => c.expr !== col && c.expr !== `"${col}"` && c.alias !== col && c.alias !== `"${col}"`).map(c => c.expr).join(', ');
    });
  };
  let hier_subtotals_combinations = function () {
    let res = subtotals.reduce((accum, col) => {
      check_column_existence(col);
      //console.log(`accum: ${JSON.stringify(accum)} + col: ${col} + first: ${JSON.stringify(accum.slice(-1).pop())}`)
      let match = group_by_list.filter(c => c.expr == col || c.expr == `"${col}"` || c.alias == col || c.alias == `"${col}"` || (0,dist_lpe.isArray)(c.columns) && (0,dist_lpe.isString)(c.columns[0]) && c.columns[0].split('.')[2] == col);
      if (match.length == 0) {
        throw Error(`hier_subtotals_combinations: looking for column ${col} listed in subtotals, but can not find in group_by`);
      }
      //console.log(`FOUND: ${JSON.stringify(match)} in ${JSON.stringify(group_by_list)}`)
      let colexpr;
      if (target_database === 'clickhouse') {
        colexpr = match[0].alias ? match[0].alias : match[0].expr;
      } else {
        colexpr = match[0].expr;
      }
      return accum.concat([accum.slice(-1).pop().concat(colexpr)]);
    }, [accum_val]);
    res.shift(); // remove GROUPING SETS ()

    /*
    SEE #706 !!!
              -GROUP BY GROUPING SETS ((koob__range__table__.day_of_calendar - 1, (NOW() - INTERVAL '1 DAY'), v_main, group_pay_name)
    we should remove this useless item:,(koob__range__table__.day_of_calendar - 1),
              -                        (koob__range__table__.day_of_calendar - 1,(NOW() - INTERVAL '1 DAY')),
              -                        (koob__range__table__.day_of_calendar - 1,(NOW() - INTERVAL '1 DAY'),v_main)
              -
    */

    /*
              if (group_by_list[0].is_range_column && res.length>1) {
                res.shift();
              }
    */
    return res;
  };
  let conf = cfg["config"] || {};
  let subtotals_combinations = conf["subtotalsMode"] === "AllButOneInterleaved" ? cross_subtotals_combinations : hier_subtotals_combinations;
  let uberTotal = '';
  let subtotalsSQL = '';

  // #756 не надо добавлять () даже если просили, если есть range()
  if (conf["subtotalsTotal"] && !range_col) {
    uberTotal = ",\n                        ()";
  }

  /*
  GRPBY: {"columns":[],"unresolved_aliases":["type_oe_bi"],"expr":"type_oe_bi"}
  SUBTOTAL: type_oe_bi

  GRPBY: {"columns":[],"expr":"ch.fot_out.dt"}
  SUBTOTAL: dt
  */
  if (conf["subtotalsMode"] != "AllButOneInterleaved") {
    //console.log('group_by_list: ' + JSON.stringify(group_by_list))
    //console.log('subtotals: ' + JSON.stringify(subtotals))

    if (group_by_list.length == subtotals.length // ||
    /* есть range() и совпадает кол-во subtotals с group by */
    /* (group_by_list.length - subtotals.length == 1 && range_col) */) {
      let lastSubtotal = subtotals[subtotals.length - 1];
      let lastGrp = group_by_list[group_by_list.length - 1];
      //console.log('LAST GRPBY: ' + JSON.stringify(lastGrp))
      //console.log('LAST SUBTOTAL: ' + lastSubtotal)

      /* FIXME: double quotes!!! */
      if (lastGrp.expr === lastSubtotal || lastGrp.alias === lastSubtotal || (0,dist_lpe.isArray)(lastGrp.columns) && (0,dist_lpe.isString)(lastGrp.columns[0]) && lastGrp.columns[0].split('.')[2] == lastSubtotal) {
        // we should remove it from subtotals, possibly we need check range()???
        // Удаляем бессмысленную группировку, так как она и так учтена в GROUP BY
        subtotals = subtotals.slice(0, -1);

        /* See #706 - не нужно удалять subtotal по range()
        if (range_col && subtotals.length === 1 &&
          (subtotals[0] === group_by_list[0].alias || subtotals[0] === group_by_list[0].expr) &&
          group_by_list[0].is_range_column
         ) {
          // after cleaning of the last column we have only range column = it is useless!
          // console.log('FIRST GRPBY: ' + JSON.stringify(group_by_list[0]))
          // console.log('FIRST SUBTOTAL: ' + subtotals[0])
           subtotals = []
        }*/

        /*
        if (subtotals.length === 0){
          // проверяем range()
          if(range_col){
            subtotals.push(range_col.expr)
            accum_val = [] // sorry for this
          }
        }*/
      }
    }
  }
  if (subtotals.length > 0) {
    subtotalsSQL = "\n                       ,(".concat(subtotals_combinations().join("),\n                        ("), ')');
  }
  ret.group_by = "\nGROUP BY GROUPING SETS ((".concat(group_by_sql, ')', subtotalsSQL, uberTotal, "\n                       )");

  // This might be a hard problem:
  // {"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr": "avg(fot_out.indicator_v + fot_out.v_main)"}
  let get_alias = function (el) {
    let r;
    if (el.alias !== undefined) {
      r = el.alias;
    } else {
      r = el.expr;
    }
    if (r.startsWith('"')) {
      return r.replace(/^"/, '"∑');
    } else {
      return `"∑${r}"`;
    }
  };
  let get_grouping_expr = function (el) {
    if (target_database === 'clickhouse') {
      return `GROUPING(${el.alias ? el.alias : el.expr})`;
    } else {
      return `GROUPING(${el.expr})`;
    }
  };

  /* временно отключаем, нужно не алиас подставлять а exp */

  if (range_col_in_the_middle && (0,dist_lpe.isHash)(range_col)) {
    // не нужны суммы по range()!! #1248
    let a = get_grouping_expr(range_col);
    ret.having = `${a} != 1`;
  }
  ret.select = group_by_list.map(el => `${get_grouping_expr(el)} AS ${get_alias(el)}`);
  return ret;
}

/* в _vars могут быть доп. настройки для контекста.
Вообще говоря это должен быть настоящий контекст! с помощью init_koob_context() мы дописываем в этот
контекст новые ключи, типа _columns, _aliases и т.д. Снаружи мы можем получить доп. фильтры. в ключе
_access_filters

_vars["_dimensions"] соддержит уже выбранные из базы записи из koob.dimensions для нужного куба
_vars["_cube"] содержит уже выбранную запись из базы из koob.cubes для нужного куба
*/

function generate_koob_sql(_cfg, _vars) {
  // так как мы потом меняем _vars, дописывая туда _ds и _cube для более удобного резолва
  // столбцов, то нужно ценнную инфу запомнить!

  let _req_cube_info = _vars["_cube"];

  /* FIXME: Remove in 2025 = mdx поддерживается в BI Model
    if (isHash(_req_cube_info) && isHash(_req_cube_info.config) && _req_cube_info.config.is_mdx) {
      let _mdx_context = generateMDXContext(_cfg, _vars)
      //let _result = eval_lisp([], _mdx_context)
      //return 'SELECT NULL;'
    }
  */

  //let _context = {... _vars};
  let _context = _vars;
  if ((0,dist_lpe.isHash)(_context) && (0,dist_lpe.isHash)(_context["_access_filters"])) {
    // для _access_filters заменяем строковые литералы на ["ql",literal]
    let c = _context["_access_filters"];
    let ret = {};
    Object.keys(c).map(key => {
      ret[key] = auto_quote_filters_expr(c[key]);
    });
    _context["_access_filters"] = ret;
    //console.log(`FLTR ${JSON.stringify(_context)}`)
  }
  _context["_koob_api_request_body"] = _cfg; // запоминаем весь запрос из клиента, то есть можно перейти к одному аргументу _vars в будущем!

  if ((0,dist_lpe.isHash)(_cfg["coefficients"])) {
    _context["_coefficients"] = _cfg["coefficients"];
  }

  /*
  {
  "with":"czt.fot",
    "filters": {
    "dor1": ["=", "ГОРЬК"],
    "dor2": ["=", "ПОДГОРЬК"],
    "dor4": ["=", null],
    "dor5": ["=", null],
    "dt": ["BETWEEN", "2020-01", "2020-12"],
    "sex_name": ["=", "Мужской"],
    "": [">", ["+",["col1", "col2"]], 100]
  },
  "having": {
    "dt": [">","2020-08"],
  },
  "columns": ["dor3", 'sum(val3):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new",  ["avg", ["+",["column","val2"],["column","val3"]]} ],
  "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2"]
  }
  */

  if ((0,dist_lpe.isHash)(_vars["_data_source"]) && (0,dist_lpe.isString)(_vars["_data_source"]["url"])) {
    var url = _vars["_data_source"]["url"];
    var matched = url.match(/^jdbc\:([^:]+)\:/);
    //console.log(`JSON DATA SOURCE URL MATCHED ${JSON.stringify(matched)}`)
    if (matched != null && matched.length > 1) {
      _context["_target_database"] = matched[1];
    } else {
      _context["_target_database"] = 'postgresql';
    }
  }
  let ds_info = {};
  if ((0,dist_lpe.isString)(_cfg["with"])) {
    var w = _cfg["with"];
    _context["_columns"] = reports_get_columns(w, _vars["_dimensions"]);
    _context["_aliases"] = {}; // will be filled while we are parsing columns

    // это корректный префикс: "дс.перв"."куб.2"  так что тупой подсчёт точек не катит.
    if (w.match(/^("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)$/) !== null) {
      _cfg = normalize_koob_config(_cfg, w, _context);
      if (_context["_target_database"] === undefined) {
        // это выполняется в БД на лету
        ds_info = get_data_source_info(w.split('.')[0]);
        _context["_target_database"] = ds_info["flavor"];
      } else {
        //Это выполняется в тестах
        ds_info = {
          "flavor": _context["_target_database"]
        };
      }
      //console.log(`DS INFO ${JSON.stringify(ds_info)}`)
    } else {
      // это строка, но она не поддерживается, так как либо точек слишком много, либо они не там, либо их нет
      throw new Error(`Request contains with key, but it has the wrong format: ${w} Should be datasource.cube with exactly one dot in between.`);
    }
  } else {
    throw new Error(`Default cube must be specified in with key`);
  }
  if (_cfg["columns"].length === 0) {
    throw new Error(`Empty columns in the request. Can not create SQL.`);
  }
  _context["_ds"] = _cfg["ds"];
  _context["_cube"] = _cfg["cube"];
  _context = init_koob_context(_context, _cfg["ds"], _cfg["cube"]);

  //console.log("PRE %%%%: " + _context[1]['()'])
  //console.log("NORMALIZED CONFIG FILTERS: ", JSON.stringify(_cfg))
  //console.log("NORMALIZED CONFIG COLUMNS: ", JSON.stringify(_cfg["columns"]))
  /*
    while we evaluating each column, koob_context will fill JSON structure in the context like this:
   {
     expr: "sum((fot.val3+fot.val1)/100) as summa",
     alias: "summa",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true
   }
    For window func clickhouse flavor we may get this inner/outer SQL:
  {
     expr: "runningAccumulate(mnt, (comp_code,gl_account)) as col1",
     alias: "col1",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true,
     window: true,
     inner_expr: "initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt",
     inner_alias: 'mnt'
   }
  */

  var cube_query_template = reports_get_table_sql(ds_info["flavor"], `${_cfg["ds"]}.${_cfg["cube"]}`, _req_cube_info);

  /* функция зависит от переменной cube_query_temaplte  :-() */
  _context[0]["uniq"] = function (col) {
    // считаем, что аргумент всегда один конкретный столбец (не *)
    _context[1]["_result"]["agg"] = true;
    if (_context[1]._target_database === 'clickhouse' && (0,dist_lpe.isString)(cube_query_template.config.count_distinct) && /^\w+$/.test(cube_query_template.config.count_distinct)) {
      return `${cube_query_template.config.count_distinct}(${col})`;
    } else {
      return `count(distinct(${col}))`;
    }
  };

  /* функция зависит от cube_query_template() */

  _context[0]["total"] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // считаем, что аргумент всегда один конкретный столбец или формула (не *)

    let known_agg = _context[1]["_result"]["agg"];
    _context[1]["_result"]["agg"] = false;

    // парсим пока что только первый аргумент!!!
    //console.log(JSON.stringify(ast))
    let col = (0,dist_lpe.eval_lisp)(ast[0], ctx, rs);
    if (!_context[1]["_result"]["agg"]) {
      throw new Error(`total() first argument must be an aggregate`);
    }
    _context[1]["_result"]["agg"] = known_agg;
    if (cube_query_template.config.is_template) {
      throw new Error(`total() is not yet supported for SQL templates :-(`);
    }
    let f = cube_query_template.query;
    return `(SELECT ${col} FROM ${f})`;
  });
  let columns_s = [];
  let global_only1 = false;
  let global_joins = [];
  let columns = _cfg["columns"].map(el => {
    // eval should fill in _context[1]["_result"] object
    // hackers way to get results!!!!
    _context[1]["_result"] = {
      "columns": []
    };
    //console.log("PRE EVAL: " + JSON.stringify(el))
    //console.log("PRE  CTX: " + _context[1]['()'])
    var r = (0,dist_lpe.eval_lisp)(el, _context);
    //console.log("POST EVAL: " + JSON.stringify(r))
    var col = _context[1]["_result"];
    if (col["only1"] === true) {
      global_only1 = true;
    }
    columns_s.push(col);
    if (col["alias"]) {
      _context[1]["_aliases"][col["alias"]] = col;
    }
    if ((0,dist_lpe.isHash)(col["join"])) {
      // Нужно запомнить условия для JOIN
      let join = col["join"];
      if (join["type"] !== 'inner') {
        throw new Error(`Only inner join is supported.`);
      }

      /* может быть понадобится
      if (col["is_range_column"] === true) {
        // try to fix where expr using real alias
        join.filters[col.alias] = join.filters["koob__range__"]
        delete join.filters["koob__range__"]
      }*/

      global_joins.push(join);
      //console.log(`HOY! ${JSON.stringify(col)}`)

      // FIXME: keys might collide!!! do not override!
      _cfg["filters"] = {
        ..._cfg["filters"],
        ...join["filters"]
      };
    }

    //FIXME: we should have nested settings for inner/outer
    // Hope aliases will not collide!
    if (col["outer_alias"]) {
      _context[1]["_aliases"][col["outer_alias"]] = col;
    }
    return r;
  });
  _context[1]["_result"] = null;
  _cfg["_aliases"] = _context[1]["_aliases"];

  //console.log("ALIASES" + JSON.stringify(_cfg["_aliases"]))
  var has_window = null;
  for (var i = 0; i < columns.length; i++) {
    columns_s[i]["expr"] = columns[i];
    if (!has_window && columns_s[i]["window"]) {
      //FIXME: for now store here usefull info about order by !!!
      // it will be used later on the SQL generation stage
      has_window = columns_s[i]["inner_order_by_excl"];
    }
  }
  for (var i = 0; i < columns_s.length; i++) {
    // Also, try to resolve unresolved aliases
    //console.log("ITER0 " + JSON.stringify(columns_s[i]))
    if ((0,dist_lpe.isArray)(columns_s[i]["unresolved_aliases"])) {
      for (var al of columns_s[i]["unresolved_aliases"]) {
        var col = _cfg["_aliases"][al];
        //console.log("ITER1 " + JSON.stringify(col))
        if (col) {
          if (col.agg) {
            // we have alias to the agg func, do the magic
            columns_s[i]["agg"] = true;
            columns_s[i]["outer_expr"] = columns_s[i]["expr"]; // so we can skip it in the inner select...
            columns_s[i]["expr"] = null;
            break;
          }
        }
      }
    }
  }

  // try to make transitive agg
  // FIXME: try to resolve full column names as well!
  for (var el of columns_s) {
    if (el["agg"] !== true) {
      for (var al of el["columns"]) {
        var col = _cfg["_aliases"][al];
        if (col) {
          if (col.agg) {
            el["agg"] = true;
            break;
          }
        }
      }
    }
  }

  // ищем кандидатов для GROUP BY и заполняем оригинальную структуру служебными полями
  _cfg["_group_by"] = [];
  _cfg["_measures"] = [];
  columns_s.map(el => {
    if (el["agg"] === true) {
      _cfg["_measures"].push(el);
    } else {
      // window functions
      if (el["do_not_group_by"] === true) {
        _cfg["_measures"].push(el);
      } else {
        _cfg["_group_by"].push(el);
      }
    }
  });
  _cfg["_columns"] = columns_s;

  //console.log("RES ", JSON.stringify(columns_s))

  if (_cfg["_measures"].length === 0) {
    // do not group if we have no aggregates !!!
    _cfg["_group_by"] = [];
  }
  //console.log("GBY ", JSON.stringify(_cfg["_group_by"]))

  /* В итоге у нас получается явный GROUP BY по указанным столбцам-dimensions и неявный group by по всем остальным dimensions куба.
   Свободные дименшены могут иметь мембера ALL, и во избежание удвоения сумм, требуется ВКЛЮЧИТЬ мембера ALL в суммирование как некий кэш.
   Другими словами, по ВСЕМ свободным дименшенам, у которых есть мембер ALL (см. конфиг) требуется добавить фильтр dimX = 'ALL' !
    Для указанных явно дименшенов доп. условий не требуется, клиент сам будет разбираться с результатом
  */

  /* Если есть хотя бы один явный столбец group_by, а иначе, если просто считаем агрегаты по всей таблице без группировки по столбцам */

  if (_cfg["options"].includes('!MemberALL') === false && (_cfg["_group_by"].length > 0 || _cfg["_measures"].length > 0)) {
    _cfg = inject_all_member_filters(_cfg, _context[1]["_columns"]);
  }
  if (_cfg["options"].includes('!ParallelHierarchyFilters') === false) {
    _cfg = inject_parallel_hierarchy_filters(_cfg, _context[1]["_columns"]);
  }

  // at this point we will have something like this:
  /*
   {"ds":"ch",
   "cube":"fot_out",
   "filters":{"ch.fot_out.dor1":["=","ГОРЬК"],"ch.fot_out.dor2":["=","ПОДГОРЬК"],"ch.fot_out.dor4":["=",null],
   "ch.fot_out.dor5":["=",null],"ch.fot_out.dt":["BETWEEN","2020-01","2020-12"],"ch.fot_out.sex_name":["=","Мужской"],"ch.fot_out.pay_name":
   ["=",null]},
   "having":{"ch.fot_out.dt":[">","2020-08"]},
   "columns":[["column","ch.fot_out.dt"],["column","ch.fot_out.branch4"],
   ["column","fot_out.ss1"],[":",["sum",["/",["()",["+","v_main",["->","utils",["func","v_rel_fzp"]]]],100]],"summa"],[":",
   ["column","ch.fot_out.obj_name"],"new"],["sum",["column","v_rel_pp"]],[":",["avg",["+",["column","ch.fot_out.indicator_v"],["column","v_main"]]],
   "new"]],"sort":[["-",["column","ch.fot_out.dor1"]],["+",["column","val1"]],["-",["column","val2"]],["-",["column","czt.fot.dor2"]],
   ["+",["column","summa"]]],
   "_group_by":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INTERVAL '1 DAY')"},{"columns":["ch.fot_out.branch4"],
   "expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"}],
   "_measures":[{"columns":["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":
   "sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}],
   "_columns":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INTERVAL '1 DAY')"},
   {"columns":["ch.fot_out.branch4"],"expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":
   ["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":"sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},
   {"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}]}
  */

  // we populate it dynamically now!
  //_cfg = cache_alias_keys(_cfg)

  // let's get SQL from it! BUT what about window functions ???

  if (has_window) {
    if (_context[1]["_target_database"] != 'clickhouse') {
      throw Error(`No Window functions support for flavor: ${_context[1]["_target_database"]}`);
    }
    // Try to replace column func to return short names!
    _context[1]["column"] = function (col) {
      // считаем, что сюда приходят только полностью резолвенные имена с двумя точками...
      var c = _context[1]["_columns"][col];
      if (c) {
        var parts = col.split('.');
        if (parts[2].localeCompare(c.sql_query, undefined, {
          sensitivity: 'accent'
        }) === 0) {
          // we have just column name, prepend table alias !
          return `${c.sql_query}`;
          //return `${parts[1]}.${c.sql_query}`
        } else {
          return `(${c.sql_query})`;
        }
      }
      //console.log("COL FAIL", col)
      // возможно кто-то вызовет нас с коротким именем - нужно знать дефолт куб!!!
      //if (_context["_columns"][default_ds][default_cube][key]) return `${default_cube}.${key}`;

      return col;
    };
  }

  /* У нас к этому моменту должны быть заполнены в _cfg["having"] и _cfg["filters"]
  при этом в массиве filters могут быть в том числе и столбцы, отмеченные как agg, а их нельзя пихать в where!
  поэтому, мы должны качественно отработать массивы:

  - _cfg[filters] для where (пропуская agg)
  - _cfg[filters] (включая agg) и _cfg[havig] для having

  */

  let where = '';
  let part_where = '1=1';
  let havingSQL = '';
  let part_having = '1=1';
  let filters_array = [];
  let filters_array_request = _cfg["filters"];
  if ((0,dist_lpe.isHash)(filters_array_request)) {
    let cols = _context[1]["_columns"];

    /* здесь надо пройти по массиву filters_array, и вычислить AGGFN столбцы, и перенести их в having
    До того, как мы начнём генерить условия WHERE
     Пока что делаем только для простого случая, когда filters_array = hash, и нет никаких сложных
    склеек OR
     */
    Object.keys(filters_array_request).map(col => {
      if ((0,dist_lpe.isHash)(cols[col])) {
        if (cols[col]["type"] === 'AGGFN') {
          // Move col to the having hashmap ???

          if (_cfg["having"][col]) {
            Error(`"having" hashmap contains same column as derived column from AGGFN dimension: ${col}`);
          }
          _cfg["having"][col] = filters_array_request[col];
          delete filters_array_request[col];
          // console.log("AGGFN:" + JSON.stringify(_cfg["having"]))
        }
      }
    });
    filters_array_request = [filters_array_request]; // делаем общий код на все варианты входных форматов {}/[]
  }
  havingSQL = get_filters_array(_context, [_cfg["having"]], '');
  // ["((NOW() - INTERVAL '1 DAY') > '2020-01-01') AND ((max(sum(v_main))) > 100)"]
  // console.log("AGGFN:" + JSON.stringify(havingSQL))

  // AGGFN условия в любом случае должны попадать в HAVING, иначе SQL не работает.
  // Проверка на наличие агрегатов не позволяет делать запрос по всей совокупности данных
  if (havingSQL.length === 1 /*&& _cfg["_group_by"].length > 0*/) {
    havingSQL = `\nHAVING ${havingSQL[0]}`;
  } else {
    havingSQL = '';
  }

  /* для кликхауса возможно надо другой контекст для подстановки в filters() */

  let access_where = '';
  let prepare_sql_where_parts = function (where_context) {
    // where_context = 'where'
    let ret = {
      'filters_array': [],
      'where': '',
      'part_where': '1=1',
      'access_where': ''
    };
    ret['filters_array'] = get_filters_array(_context, filters_array_request, '', undefined, false, where_context);
    // это теперь массив из уже готового SQL WHERE!

    // access filters
    var filters = _context[1]["_access_filters"];
    var ast = [];
    //console.log("WHERE access filters: ", JSON.stringify(filters))
    if ((0,dist_lpe.isString)(filters) && filters.length > 0) {
      var ast = (0,dist_lpe.parse)(`expr(${filters})`);
      ast.splice(0, 1, '()'); // replace expr with ()
    } else if ((0,dist_lpe.isArray)(filters) && filters.length > 0) {
      if (filters[0] === 'expr') {
        filters[0] = '()';
        ast = filters;
      } else if (filters[0] !== '()') {
        ast = ['()', filters];
      }
    } else if ((0,dist_lpe.isHash)(filters)) {
      // новый формат фильтров, который совпадает с уже существующим....
      // возможно нужно ключи привести к полному имени ds.cube.column ????
      let access_where = get_filters_array(_context, [filters], '', undefined, false, where_context);
      if (access_where.length == 1) {
        ret['access_where'] = access_where[0];
      } else if (access_where.length > 1) {
        ret['access_where'] = `(${access_where.join(")\n   OR (")})`;
      }
      //console.log(`NEW FILTERS: ${JSON.stringify(access_where)}`)
    } else {
      //warning
      //console.log('Access filters are missed.')
    }
    //console.log("WHERE access filters AST", JSON.stringify(ast))

    if (ast.length > 0) {
      // array
      ret['access_where'] = (0,dist_lpe.eval_lisp)(ast, _context);
    }
    let fw = '';
    if (ret['filters_array'].length == 1) {
      fw = ret['filters_array'][0];
    } else if (ret['filters_array'].length > 1) {
      fw = `(${ret['filters_array'].join(")\n   OR (")})`;
    }
    if (fw.length > 0) {
      if (ret['access_where'] !== undefined && ret['access_where'].length > 0) {
        fw = `(${fw})\n   AND\n   ${ret['access_where']}`;
      }
    } else {
      if (ret['access_where'] !== undefined && ret['access_where'].length > 0) {
        fw = ret['access_where'];
      }
    }
    if (cube_query_template.config.is_template && cube_query_template.config.skip_where) {
      // не печатаем часть WHERE, даже если она и должна быть, так как в конфиге куба нас просят
      // этого не делать.
      if (fw.length > 0) {
        ret['part_where'] = fw;
      }
    } else {
      if (fw.length > 0) {
        ret['where'] = `\nWHERE ${fw}`;
        ret['part_where'] = fw;
      }
    }
    //console.log(`RET: ${JSON.stringify(ret) } `)
    return ret;
  }; // end of prepare_sql_where_parts

  let res = prepare_sql_where_parts('where');
  where = res['where'];
  part_where = res['part_where'];
  access_where = res['access_where'];
  filters_array = res['filters_array'];

  // для teradata limit/offset
  let global_extra_columns = [];
  // Для Oracle
  let global_generate_3_level_sql = false;
  let top_level_where = ''; // for oracle RANGE && LIMIT
  let group_by;
  if (_context[1]["_target_database"] === 'clickhouse') {
    //console.log(JSON.stringify(_cfg["_group_by"]))
    group_by = _cfg["_group_by"].map(el => el.alias ? should_quote_alias(el.alias) ? db_quote_ident(el.alias) : el.alias : el.expr);
  } else {
    group_by = _cfg["_group_by"].map(el => el.expr);
  }

  // нужно дополнить контекст для +,- и суметь сослатся на алиасы!
  var order_by_context = extend_context_for_order_by(_context, _cfg);
  //console.log("SORT:", JSON.stringify(_cfg["sort"]))
  var order_by = _cfg["sort"].map(el => (0,dist_lpe.eval_lisp)(el, order_by_context));
  //console.log("ORDER BY:", JSON.stringify(order_by))
  // ORDER BY: ["perda","lead DESC","newid() DESC","newid()"]

  //console.log("SQL:", JSON.stringify(cube_query_template))
  var from = cube_query_template.query;
  var limit = (0,dist_lpe.isNumber)(_cfg["limit"]) ? ` LIMIT ${_cfg["limit"]}` : '';
  var offset = (0,dist_lpe.isNumber)(_cfg["offset"]) ? ` OFFSET ${_cfg["offset"]}` : '';
  let limit_offset = '';
  if (_context[1]["_target_database"] === 'oracle') {
    //AHTUNG!! это же условие для WHERE FILTERS !!!
    let w;
    if (limit) {
      if (offset) {
        w = `"koob__row__num__" > ${parseInt(_cfg["offset"])} AND "koob__row__num__" <= (${parseInt(_cfg["offset"])} + ${parseInt(_cfg["limit"])})`;
      } else {
        w = `"koob__row__num__" <= ${parseInt(_cfg["limit"])}`;
      }
    } else if (offset) {
      w = `"koob__row__num__" > ${parseInt(_cfg["offset"])}`;
    }
    if (w) {
      global_generate_3_level_sql = true;
      if (top_level_where.length > 3) {
        top_level_where = `${top_level_where} AND ${w}`;
      } else {
        top_level_where = `\nWHERE ${w}`;
      }
    }
  } else if (_context[1]["_target_database"] === 'sqlserver') {
    if (limit) {
      if (offset) {
        limit_offset = `\nOFFSET ${parseInt(_cfg["offset"])} ROWS FETCH NEXT ${parseInt(_cfg["limit"])} ROWS ONLY`;
      } else {
        limit_offset = `\nOFFSET 0 ROWS FETCH NEXT ${parseInt(_cfg["limit"])} ROWS ONLY`;
      }
    } else if (offset) {
      limit_offset = `\nOFFSET ${parseInt(_cfg["offset"])} ROWS`;
    }

    // FIXME: кажется это надо делать абсолютно для всех БД
    // и надо с умом подбирать список столбцов
    if (limit_offset.length > 1 && order_by.length === 0) {
      order_by = ["1"];
    }
  } else if (_context[1]["_target_database"] === 'teradata' && (limit || offset)) {
    // Здесь нужно иметь под рукой сотрировку! если её нет, то надо свою выбрать

    let window_order_by;
    if (order_by.length === 0) {
      // надо использовать все столбцы, которые являются dimensions и лежать в group by ???
      //throw Error(`Teradata limit/offset without specified sorting order is not YET supported :-(`)

      if (_cfg["_group_by"].length === 0) {
        window_order_by = _cfg["_columns"].map(el => {
          if (el.alias) {
            return `"${el.alias}"`;
          } else {
            return el.expr;
          }
        }).join(',');
      } else {
        window_order_by = _cfg["_group_by"].map(el => el.expr).join(',');
      }
    } else {
      window_order_by = order_by.join(', ');
    }
    //`ROW_NUMBER() OVER (order by ${window_order_by}) as koob__row__num__`
    let column = {
      "columns": [],
      "alias": "koob__row__num__",
      "expr": `ROW_NUMBER() OVER (order by ${window_order_by})`
    };
    // мы не можем добавлять это в общий список столбцов, так как нам потребуется ещё одна обёртка!
    // создаём пока переменную глобальную! но нам нужны вложенные SQL контексты, а не просто outer/inner
    //_cfg["_columns"].unshift(column)
    global_extra_columns.unshift(column);
    if (limit) {
      //QUALIFY __row_num  BETWEEN 1 and 4;
      if (offset) {
        let left = parseInt(_cfg["offset"]) + 1;
        limit_offset = `\nQUALIFY koob__row__num__ BETWEEN ${left} AND ${parseInt(_cfg["offset"]) + parseInt(_cfg["limit"])}`;
      } else {
        limit_offset = `\nQUALIFY koob__row__num__ <= ${parseInt(_cfg["limit"])}`;
      }
    } else if (offset) {
      limit_offset = `\nQUALIFY koob__row__num__ > ${parseInt(_cfg["offset"])}`;
    }
  } else {
    if (limit) {
      if (offset) {
        limit_offset = ` LIMIT ${parseInt(_cfg["limit"])} OFFSET ${parseInt(_cfg["offset"])}`;
      } else {
        limit_offset = ` LIMIT ${parseInt(_cfg["limit"])}`;
      }
    } else if (offset) {
      limit_offset = ` OFFSET ${parseInt(_cfg["offset"])}`;
    }
  }
  var ending = '';
  // FIXME! Требуется использовать настройки куба, поле config.query_settings.max_threads
  //        Если в кубе нет настроек, то настройки из JDBC connect string сами применятся,
  //        на уровне драйвера !!! Нужна функция по получению инфы про куб (а у нас может быть несколько таблиц!!!)
  // if (isHash(_vars["_data_source"]) && isString(_vars["_data_source"]["url"]) ) {
  //if (_context[1]["_target_database"] === 'clickhouse'){
  // config->'_connection'->'options'->'max_threads'
  // ending = "\nSETTINGS max_threads = 1"
  //}

  var expand_outer_expr = function (el) {
    if (el["eval_expr"] === true) {
      //console.log("FOUND EVAL", JSON.stringify(el))
      // only one kind of expressions for now...
      // {"lpe_totals":{
      // "lpe_total_2":{"ast":["avg","v_rel_pp"],"expr":"avg(fot_out.v_rel_pp)"}}
      var expr = el.expr;
      for (var total in el.lpe_subtotals) {
        var hash = el.lpe_subtotals[total];
        expr = expr.replace(`${total}()`, `(SELECT ${hash["expr"]} FROM ${from}${where})`);
      }
      return expr;
    } else {
      return el.expr;
    }
  };
  if (has_window) {
    // assuming we are working for clickhouse only....
    // we should generate correct order_by, even though each window func may require it's own order by
    // FIXME: we use only ONE SUCH FUNC FOR NOW, IGNORING ALL OTHERS

    // skip all columns which are references to window funcs!
    var innerSelect = "SELECT ";
    // могут быть ньюансы квотации столбцов, обозначения AS и т.д. поэтому каждый участок приводим к LPE и вызываем SQLPE функции с адаптацией под конкретные базы
    innerSelect = innerSelect.concat(_cfg["_columns"].map(el => {
      //console.log('1: ' + JSON.stringify(el) + " alias:" + el.alias)
      if (el.expr === null) {
        return null;
      }
      if (el.alias) {
        for (var part of el.columns) {
          //console.log('2 part:' + part)
          // if we reference some known alias
          var target = _cfg["_aliases"][part];
          if (target && target.window) {
            // if we reference window function, skip such column from inner select!
            return null;
          }
        }
        return quot_as_expression(_context[1]["_target_database"], el.expr, el.alias);
      } else {
        if (el.columns.length === 1) {
          var parts = el.columns[0].split('.');
          return quot_as_expression(_context[1]["_target_database"], el.expr, parts[2]);
        }
        return el.expr;
      }
    }).filter(el => el !== null).join(', '));
    var expand_column = col => {
      var cube_prefix = `${_cfg["ds"]}.${_cfg["cube"]}`;
      return col.match(/("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)/) === null ? _context[1]._columns[`${cube_prefix}.${col}`] ? `${_cfg["cube"]}.${col}` : col : col;
    };
    var excl_col = expand_column(has_window);
    //console.log(`${_cfg["ds"]}.${_cfg["cube"]}` + " EXPANDING " + has_window + " to " + excl_col)
    //console.log(JSON.stringify(_context[1]["_columns"]))

    // Put excl_col to the last position, so running window will accumulate data over it!

    var inner_order_by = [];
    if (group_by.find(el => el === excl_col)) {
      inner_order_by = group_by.filter(el => el !== excl_col).concat(excl_col);
    }
    inner_order_by = inner_order_by.length ? "\nORDER BY ".concat(inner_order_by.join(', ')) : '';
    var having = where.replace("WHERE", "HAVING");
    var inner_group_by = group_by.length ? "\nGROUP BY ".concat(group_by.join(', ')) : '';
    var inner = `${innerSelect}\nFROM ${from}${inner_group_by}${having}${inner_order_by}`;

    // NOW WE NEED OUTER !

    function get_outer_expr(el) {
      if (el.outer_expr) {
        if (el.outer_expr_eval) {
          if (el.eval_reference_to) {
            // resolve_reference!!
            var init = _cfg["_aliases"][el.eval_reference_to];
            return el.outer_expr.replace('resolve_alias()', init["alias"]);
          } else {
            // FIXME, currently we just do simple replace! love LISP: do eval!!!
            var part_columns = group_by.filter(el => el != excl_col);
            part_columns = part_columns.length ? part_columns.map(el => {
              var p = el.split('.');
              return p[p.length - 1];
            }).join(', ') : '';
            if (part_columns === '') {
              part_columns = 'tuple(null)';
            } else {
              part_columns = `(${part_columns})`;
            }
            return el.outer_expr.replace('partition_columns()', part_columns);
          }
        } else {
          var parts = el.outer_expr.match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);
          if (parts) {
            return parts[2];
          }
          return el.outer_expr;
        }
      } else {
        // FIXME: stupid Javascript IF
        if (el.agg === true && el.outerVerbatim !== true) {
          // try to just use alias or column name!!!
          //console.log("DEPARSE " + JSON.stringify(el))
          if (el.alias) {
            return el.alias;
          } else {
            var parts = el.columns[0].match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);
            if (parts) {
              return parts[3];
            }
          }
        } else {
          var parts = el.expr.match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);
          if (parts) {
            return parts[2];
          }
        }
        return el.expr;
      }
    }
    var select = (0,dist_lpe.isArray)(_cfg["distinct"]) ? "SELECT DISTINCT " : "SELECT ";
    select = select.concat(_cfg["_columns"].map(el => {
      //console.log('outer1: ' + JSON.stringify(el) + " alias:" + el.alias)
      if (el.outer_alias) {
        return quot_as_expression(_context[1]["_target_database"], get_outer_expr(el), el.outer_alias);
      } else if (el.alias) {
        return quot_as_expression(_context[1]["_target_database"], get_outer_expr(el), el.alias);
      } else {
        if (el.columns.length === 1) {
          var parts = el.columns[0].match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);
          //console.log(`outer2: ${get_outer_expr(el)}` + JSON.stringify(parts))
          if (parts) {
            return quot_as_expression(_context[1]["_target_database"], get_outer_expr(el), parts[3]);
          }
          return `${get_outer_expr(el)}`;
        }
        return `${get_outer_expr(el)}`;
      }
    }).filter(el => el !== null).join(', '));
    order_by = order_by.length ? "\nORDER BY ".concat(order_by.join(', ')) : '';
    return `${select}\nFROM (\n${inner}\n)${order_by}${limit_offset}${ending}`;
  } else {
    // NOT WINDOW! normal SELECT
    //---------------------------------------------------------------------
    let custom_count_disctinct = null;
    if (_cfg["return"] === "count" && (0,dist_lpe.isString)(cube_query_template.config.count_distinct) && /^\w+$/.test(cube_query_template.config.count_distinct) && _context[1]["_target_database"] === 'clickhouse' && (0,dist_lpe.isArray)(_cfg["distinct"])) {
      custom_count_disctinct = cube_query_template.config.count_distinct;
    }
    // могут быть ньюансы квотации столбцов, обозначения AS и т.д. поэтому каждый участок приводим к LPE и вызываем SQLPE функции с адаптацией под конкретные базы
    var normal_level_columns = _cfg["_columns"].map(el => {
      // It is only to support dictionaries for Clickhouse!!!
      // FIXME: switch to stacked SELECT idea
      if (el.outer_alias) {
        el.alias = el.outer_alias;
      }
      if (el.outer_expr) {
        el.expr = el.outer_expr;
      }
      /////////////////////////////////////////////////////
      //console.log("COLUMN:", JSON.stringify(el))

      /* v8.11 возвращает отдельные столбцы с GROUPING(col), generate_grouping больше не актуально */
      let generate_grouping = function (arg) {
        return expand_outer_expr(arg);
      };
      if ((0,dist_lpe.isArray)(_cfg["subtotals"])) {
        if (_context[1]["_target_database"] === 'clickhouse') {
          generate_grouping = function (arg) {
            let expanded = expand_outer_expr(arg);
            if (arg.agg === true) {
              return expanded;
            } else {
              // начиная с 22.6 появилась функция grouping
              // начиная с 22.9 она работает правильно, но есть проблема с алиасом на if(GROUPING())!!!
              // Это бага!!! даже в 22.12
              // Поэтому отключаем!!!
              // return `if(GROUPING(${expanded})=0,${expanded},NULL)`
              return expanded;
            }
          };
        } else if (_context[1]["_target_database"] === 'postgresql' || /* есть проблема с генерацией SQL _context[1]["_target_database"]==='oracle' || */
        _context[1]["_target_database"] === 'teradata' || _context[1]["_target_database"] === 'sqlserver' || _context[1]["_target_database"] === 'vertica') {
          generate_grouping = function (arg) {
            let expanded = expand_outer_expr(arg);
            if (arg.agg === true) {
              return expanded;
            } else {
              return `CASE WHEN GROUPING(${expanded})=0 THEN ${expanded} ELSE NULL END`;
            }
          };
        }
      }
      if (custom_count_disctinct) {
        return expand_outer_expr(el);
      } else {
        if (el.alias) {
          return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), el.alias);
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.');
            // We may have auto-generated columns, which has no dots in name!
            // COLUMN: {"columns":["ch.fot_out.hcode_name"],"expr":"hcode_name"}
            // COLUMN: {"columns":["koob__range__"],"is_range_column":true,"expr":"koob__range__","join":{
            if (parts.length === 3) {
              return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), parts[2]);
            } else {
              return expand_outer_expr(el);
            }
          }
          //console.log("--ONE ELEMENT NO ALIAS" + JSON.stringify(el))
          return expand_outer_expr(el);
        }
      }
    }).join(', ');
    if (custom_count_disctinct) {
      // пишем кастомную функцию вместо DISTINCT !!!
      normal_level_columns = `${custom_count_disctinct}(${normal_level_columns})`;
    }
    order_by = order_by.length ? "\nORDER BY ".concat(order_by.join(', ')) : '';
    let select_tail = normal_level_columns;
    if (group_by.length == 0) {
      group_by = '';
    } else {
      if (_cfg["subtotals"] === 'cube') {
        if (_context[1]["_target_database"] === 'clickhouse') {
          group_by = `\nGROUP BY ${group_by.join(', ')} WITH CUBE`;
        } else {
          // postgresql
          group_by = `\nGROUP BY CUBE (${group_by.join(', ')})`;
        }
      } else if ((0,dist_lpe.isArray)(_cfg["subtotals"])) {
        // FIXME: кажется только mysql не алё
        if (_context[1]["_target_database"] === 'postgresql' || _context[1]["_target_database"] === 'oracle' || _context[1]["_target_database"] === 'teradata' || _context[1]["_target_database"] === 'clickhouse' || _context[1]["_target_database"] === 'sqlserver' || _context[1]["_target_database"] === 'vertica') {
          let subtotals = genereate_subtotals_group_by(_cfg, _cfg["_group_by"], _context[1]["_target_database"]);
          if (subtotals.having !== '') {
            if (havingSQL === '') {
              havingSQL = `\nHAVING ${subtotals.having}`;
            } else {
              havingSQL = havingSQL.replace("\nHAVING", "\nHAVING (");
              havingSQL = `${havingSQL}) AND (${subtotals.having})`;
            }
          }
          group_by = subtotals.group_by;
          select_tail = `${select_tail}, ${subtotals.select.join(', ')}`;
          // We need to add extra columns to the select as well
        } else {
          throw new Error(`named subtotals are not yet supported for ${_context[1]["_target_database"]}`);
        }
      } else {
        group_by = "\nGROUP BY ".concat(group_by.join(', '));
      }
    }
    select = (0,dist_lpe.isArray)(_cfg["distinct"]) && custom_count_disctinct === null ? "SELECT DISTINCT " : "SELECT ";
    select = select.concat(select_tail);
    var final_sql = '';
    if (cube_query_template.config.is_template) {
      // Разбиваем весь шаблон на токены, и каждый LPE токен выполняем...
      let tokens = tokenize_sql_template(from);
      //console.log(_context)
      /*
      _context = [
        {функции koob lpe},
        {переменные типа _columns, _target_database, _koob_api_request_body},
        Func reolver
      ]
      */

      //_context - это массив, поэому, можно добавить в нужное место (не в конец, так как там резолвер!)
      // функции filters(), access_filters(), udf_args(), filter() = lookup,
      let tmpl_ctx = {
        "filters": (0,dist_lpe.makeSF)((ast, ctx, rs) => {
          if (ast.length === 0) {
            // без аргументов
            // FIXME: улучшить проверку!
            if (_context[1]["_target_database"] === 'clickhouse') {
              let our_where = prepare_sql_where_parts('template_where');
              return our_where["part_where"];
            } else {
              //FIXME: уже вычисленные условия!
              return part_where;
            }
          } else {
            let filters_array = _cfg["filters"];
            if ((0,dist_lpe.isHash)(filters_array)) {
              filters_array = [filters_array];
            } else {
              throw new Error(`Can not split OR SQL WHERE into template parts filters(...). Sorry.`);
            }
            let subst;
            if (ast.length === 1 && (0,dist_lpe.isArray)(ast[0]) && ast[0][0] === "except") {
              // Специальная форма с одним except!
              // аргументы except -  и есть список столбцов!
              let columns = ast[0].slice(1);
              subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, true, 'template_where');
            } else {
              // просто список столбцов
              // список столбцов ещё не вычислен! Попытка запарсить столбцы делается внутри get_filters_array()
              // там руками делается вычисление `:` и всё на этом! Хорошо бы вычислять стандартным образом!
              // это можно сделать прямо здесь!
              let columns = ast;
              subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false, 'template_where');
            }
            if (subst.length == 0) {
              return "1=1";
            }
            return subst;
          }
        }),
        "access_filters": (0,dist_lpe.makeSF)((ast, ctx, rs) => {
          let ready_cond = undefined;
          if (_context[1]["_target_database"] === 'clickhouse') {
            let our_where = prepare_sql_where_parts('template_where');
            ready_cond = our_where["access_where"];
          } else {
            //уже вычисленные условия!
            ready_cond = access_where;
          }
          return (0,dist_lpe.isString)(ready_cond) && ready_cond.length > 0 ? ready_cond : '1=1';
        }),
        "udf_args": (0,dist_lpe.makeSF)((ast, ctx, rs) => {
          if (ast.length == 0) {
            return "";
          }
          let filters_array = _cfg["filters"];
          if (!(0,dist_lpe.isHash)(filters_array)) {
            throw new Error(`filters as array is not supported for udf_args(). Sorry.`);
          }
          let c = init_udf_args_context(`${_cfg.ds}.${_cfg.cube}`, _cfg["filters"], _context[1]["_target_database"], _context[0]);
          let a = ["udf_args", ...ast];
          return (0,dist_lpe.eval_lisp)(a, c);
        }),
        "filter": (0,dist_lpe.makeSF)((ast, ctx, rs) => {
          if (ast.length === 0) {
            return "1=1";
          }
          let cc = sql_where_context({
            'user': _vars["_user_info"]
          });
          let a = ["filter", ...ast];

          //console.log(`Parsed expr: ${JSON.stringify(ast)}`)
          return (0,dist_lpe.eval_lisp)(a, cc);
        })
      };
      // FIXME: есть попытка с эти работать: init_udf_args_context()
      let final_sql = tokens.map(t => {
        if (t.type === 'lpe') {
          let lpe_script = (0,dist_lpe.parse)(t.value);
          let sql = (0,dist_lpe.eval_lisp)(lpe_script, [tmpl_ctx, ..._context]);
          return sql;
        } else {
          return t.value;
        }
      }).join('');
      //console.log(`FINAL SQL:\n${final_sql}`)
      from = final_sql;

      /*
            // надо подставить WHERE аккуратно, это уже посчитано, заменяем ${filters} и ${filters()}
            var re = /\$\{filters(?:\(\))?\}/gi;

            // FIXME!!! part_where создан с подстановкой имени таблицы для Clickhouse!!!
            // FIXME!!! а это не всегда работает для шаблонов!!!
            let our_where
            if (_context[1]["_target_database"]==='clickhouse') {
              our_where = prepare_sql_where_parts('template_where')
              our_where = our_where["part_where"]
            } else {
              our_where = part_where
            }


            var processed_from = from.replace(re, our_where); //SQLWhereNegate уже учтено!


            // access_filters
            if (access_where.length == 0) {
              access_where = '1=1'
            }
            var re = /\$\{access_filters(?:\(\))?\}/gi;
            var processed_from = processed_from.replace(re, access_where); //SQLWhereNegate нельзя применять!

            // ищем except()
            re = /\$\{filters\(except\(([^\)]*)\)\)\}/gi

            function except_replacer(match, columns_text, offset, string) {
              if (SQLWhereNegate) {
                throw new Error(`Can not process filters(except(...)) when option SQLWhereNegate is present. Sorry.`)
              }
              var columns = columns_text.split(',')
              var filters_array = _cfg["filters"];
              if (isHash(filters_array)) {
                filters_array = [filters_array]
              } else {
                throw new Error(`Can not split OR SQL WHERE into template parts filters(except(...)). Sorry.`)
              }
              //console.log(JSON.stringify(_cfg["filters"]))
              var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, true, 'template_where')
              if (subst.length == 0) {
                return "1=1"
              }
              return subst;
            }
            processed_from = processed_from.replace(re, except_replacer);

            // ищем filters(a,v,c)
            // FIXME: не делаем access_filters :()
            re = /\$\{filters\(([^\}]+)\)\}/gi

            function inclusive_replacer(match, columns_text, offset, string) {
              if (SQLWhereNegate) {
                throw new Error(`Can not process filters(...) when option SQLWhereNegate is present. Sorry.`)
              }
              var columns = columns_text.split(',')
              var filters_array = _cfg["filters"];
              if (isHash(filters_array)) {
                filters_array = [filters_array]
              } else {
                throw new Error(`Can not split OR SQL WHERE into template parts filters(...). Sorry.`)
              }
              //console.log(JSON.stringify(_cfg["filters"]))
              var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false, 'template_where')
              if (subst.length == 0) {
                return "1=1"
              }
              return subst;
            }
            processed_from = processed_from.replace(re, inclusive_replacer);

            //final_sql = `${select}\nFROM ${processed_from}${group_by}${order_by}${limit_offset}${ending}`

            ///////////////////////////////////////////////////////////////////////
            // ищем ${udf_args(column , title, name1, filter1, ....)}
            re = /\$\{udf_args\(([^\}]+)\)\}/gi
            let c = init_udf_args_context(`${_cfg.ds}.${_cfg.cube}`,
                                          _cfg["filters"],
                                          _context[1]["_target_database"],
                                          _context[0]);

            function udf_args_replacer(match, columns_text, offset, string) {
              if (SQLWhereNegate) {
                throw new Error(`Can not process udf_args(...) when option SQLWhereNegate is present. Sorry.`)
              }
              var filters_array = _cfg["filters"];
              if (!isHash(filters_array)) {
                throw new Error(`filters as array is not supported for udf_args(). Sorry.`)
              }
              //console.log(JSON.stringify(filters_array))
              //var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false)
              var ast = parse( `udf_args(${columns_text})`);
              if (ast.length == 0) {
                return ""
              }
              return eval_lisp(ast, c);
            }
            processed_from = processed_from.replace(re, udf_args_replacer);

            // функция filter из table lookup, но тут своя реализация... пробуем
            re = /\$\{filter\(([^\}]+)\)\}/gi // SQLWhereNegate = кажется тут не нужно

            // FIXME: надо инитить глобальный контекст, и подкидывать переменные про юзера.
            // let cc = [ {_target_database: "HOY"}, SQL_where_context ];

            let cc = sql_where_context({'user': _vars["_user_info"]});

            function filter_replacer(match, expression, offset, string) {
              //console.log(`Detected filters expresssion: ${expression}`)
              //var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false)
              var ast = parse( `filter(${expression})`);
              if (ast.length == 0) {
                return "1=1"
              }
              //console.log(`Parsed expr: ${JSON.stringify(ast)}`)
              return eval_lisp(ast, cc);
            }
            processed_from = processed_from.replace(re, filter_replacer);
      */

      // from = processed_from
    }
    if (global_joins.length > 0) {
      // нужно ещё сделать JOINS
      from = from + ',' + global_joins.map(el => {
        if (el["expr"]) {
          return el["alias"] ? `${el["expr"]} as ${el["alias"]}` : el["expr"];
        } else {
          return el["alias"] ? `${el["table"]} as ${el["alias"]}` : el["table"];
        }
      });
    }
    if (global_extra_columns.length > 0) {
      let saved_columns = _cfg["_columns"];
      _cfg["_columns"] = global_extra_columns;
      // нам нужно ещё раз обернуть весь запрос!!!
      // похоже список столбцов нужнео дополнить нашими доп столбцами....
      var top_level_select = 'SELECT ';
      top_level_select = top_level_select.concat(global_extra_columns.map(el => {
        // It is only to support dictionaries for Clickhouse!!!
        // FIXME: switch to stacked SELECT idea
        // console.log(`global_extra_columns: ${JSON.stringify(el)}`)
        if (el.outer_alias) {
          el.alias = el.outer_alias;
        }
        if (el.outer_expr) {
          el.expr = el.outer_expr;
        }
        /////////////////////////////////////////////////////
        //console.log("COLUMN:", JSON.stringify(el))
        if (el.alias) {
          return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), el.alias);
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.');
            return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), parts[2]);
          }
          return expand_outer_expr(el);
        }
      }).join(', '));

      //console.log(`global_extra_columns STEP ${top_level_select}`)
      top_level_select = top_level_select.concat(', ');
      _cfg["_columns"] = saved_columns;
      // ещё раз надо пройтись по столбцам, но теперь нам нужны ТОЛЬКО АЛИАСЫ !
      top_level_select = top_level_select.concat(_cfg["_columns"].map(el => {
        // It is only to support dictionaries for Clickhouse!!!
        // FIXME: switch to stacked SELECT idea
        if (el.outer_alias) {
          el.alias = el.outer_alias;
        }
        if (el.outer_expr) {
          el.expr = el.outer_expr;
        }
        /////////////////////////////////////////////////////
        //console.log("COLUMN:", JSON.stringify(el))
        if (el.alias) {
          // FIXME: делаем принудительную квотацию для терадаты!!!
          //return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), el.alias)
          return `"${el.alias}"`;
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.');
            //return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), parts[2])
            return `"${parts[2]}"`;
          }
          return `"${expand_outer_expr(el)}"`;
        }
      }).join(', '));
      if (global_only1 === true) {
        group_by = '';
        // plSQL will parse this comment! Sic!
        top_level_select = `/*ON1Y*/${top_level_select}`;
      }
      // Oracle can not handle `table as alias` So we removed AS from final select
      // Teradata: [TeraJDBC 16.20.00.13] [Error 3706] [SQLState 42000] Syntax error: ORDER BY is not allowed in subqueries.
      if (_context[1]["_target_database"] === 'teradata') {
        // FIXME: В терадате используется WINDOW  OVER (ORDER BY) для наших типов запросов, так что должно быть норм.
        final_sql = `${top_level_select} FROM (${select}\nFROM ${from}${where}${group_by}${havingSQL}) koob__top__level__select__${top_level_where}${order_by}${limit_offset}${ending}`;
      } else {
        final_sql = `${top_level_select} FROM (${select}\nFROM ${from}${where}${group_by}${havingSQL}${order_by}) koob__top__level__select__${top_level_where}${limit_offset}${ending}`;
      }
    } else {
      if (global_only1 === true) {
        group_by = '';
        // plSQL will parse this comment! Sic!
        select = `/*ON1Y*/${select}`;
      }
      if (_context[1]["_target_database"] === 'oracle' && global_generate_3_level_sql === true) {
        // В оракле приходится 3-х этажный селект делать
        final_sql = `SELECT * FROM (SELECT koob__inner__select__.*, ROWNUM AS "koob__row__num__" FROM (${select}\nFROM ${from}${where}${group_by}${havingSQL}${order_by}) koob__inner__select__) koob__top__level__select__${top_level_where}${ending}`;
      } else {
        final_sql = `${select}\nFROM ${from}${where}${group_by}${havingSQL}${order_by}${limit_offset}${ending}`;
      }
    }

    //console.log("FINAL: " + final_sql)
    //custom_count_disctinct уже содержит кастомную функцию типа uniq() и не нужно делать доп. обёртку
    if (_cfg["return"] === "count" && custom_count_disctinct === null) {
      if (_context[1]["_target_database"] === 'clickhouse') {
        final_sql = `select toUInt32(count(300)) as count from (${final_sql})`;
      } else {
        // use quotes to interact with our Web client in all cases (prevent upper case)
        final_sql = `select count(300) as "count" from (${final_sql}) koob__count__src__`;
      }
    }
    return final_sql;
  }
}
;// ./src/sql_macros.js
/**
 Copyright (c) 2022 Luxms Inc.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */




let postgresql_typemap = {
  'INT': ['INT', 'utils.safe_convert_to_int'],
  'FLOAT': ['FLOAT', 'utils.safe_convert_to_float8'],
  'DOUBLE': ['FLOAT', 'utils.safe_convert_to_float8'],
  'STRING': ['TEXT', 'utils.safe_convert_to_text'],
  'DATE': ['DATE', 'utils.safe_convert_to_date'],
  'DATETIME': ['TIMESTAMP', 'utils.safe_convert_to_timestamp']
};
function sql_macros_context(_vars) {
  let global_current_column;
  var _ctx = []; // это контекст где будет сначала список переменных, включая _columns, и функции
  if ((0,dist_lpe.isHash)(_vars)) {
    _ctx = [_vars];
  }
  var _context = {};

  // добавляем наш контекст, как имеющий более высокий приоритет над существующим
  _ctx.unshift(_context);
  _context["cast"] = function (column, typeTo, optional_default) {
    // utils.convert_softly('foo', /*new type*/ 'INT', /* default*/ NULL);
    let def_val;
    let dbType = postgresql_typemap[typeTo];
    if (dbType === undefined) {
      throw Error(`Conversion to ${typeTo} is not supported`);
    }
    if (optional_default === null) {
      def_val = `NULL::${dbType[0]}`;
    } else {
      def_val = optional_default === undefined ? `NULL::${dbType[0]}` : `${db_quote_literal(optional_default)}::${dbType[0]}`;
    }
    let sql = `    ALTER COLUMN ${db_quote_ident(column)} SET DATA TYPE ${dbType[0]}
    USING ${dbType[1]}(${db_quote_ident(column)}, ${def_val})`;
    return sql;
  };
  _context["regexp"] = function (first, second) {
    if (second === undefined) {
      return `(regexp_match(${db_quote_ident(global_current_column)}, '${first}'))[1]`;
    } else {
      return `(regexp_match(${first}, '${second}'))[1]`;
    }
  };
  _context["to_date"] = function (first, second) {
    if (second === undefined) {
      return `to_date(${db_quote_ident(global_current_column)}, ${db_quote_literal(first)})`;
    } else {
      return `to_date(${first}, ${db_quote_literal(second)})`;
    }
  };
  _context["to_datetime"] = function (first, second) {
    if (second === undefined) {
      return `to_timestamp(${db_quote_ident(global_current_column)}, ${db_quote_literal(first)})::TIMESTAMP`;
    } else {
      return `to_timestamp(${first}, ${db_quote_literal(second)})::TIMESTAMP`;
    }
  };
  _context["left"] = function (first, second) {
    if (second === undefined) {
      //console.log(`isNumber ${first}: ${isNumber(first)}`)
      return `left(${db_quote_ident(global_current_column)}, ${db_quote_literal(first)})`;
    } else {
      //console.log(`isNumber ${second}: ${isNumber(second)}`)
      return `left(${first}, ${db_quote_literal(second)})`;
    }
  };
  _context["castWithExpr"] = (0,dist_lpe.makeSF)((ast, ctx) => {
    // column, typeTo, expr, optional_default
    let column = (0,dist_lpe.eval_lisp)(ast[0], ctx);
    let typeTo = (0,dist_lpe.eval_lisp)(ast[1], ctx);
    let dbType = postgresql_typemap[typeTo];
    if (dbType === undefined) {
      throw Error(`Conversion to ${typeTo} is not supported`);
    }

    // remember for use in other functions
    global_current_column = column;
    let def_val, optional_default;
    if (ast[3] === null) {
      def_val = `NULL::${dbType[0]}`;
    } else {
      if (ast[3] === undefined) {
        def_val = `NULL::${dbType[0]}`;
      } else {
        optional_default = (0,dist_lpe.eval_lisp)(ast[3], ctx);
        def_val = `${db_quote_literal(optional_default)}::${dbType[0]}`;
      }
    }
    if (dbType[0] === 'DATE' && ast[2][0] === 'to_date' || dbType[0] === 'TIMESTAMP' && ast[2][0] === 'to_datetime') {
      // делаем быстрый хэк
      let arg = (0,dist_lpe.eval_lisp)(ast[2][1], ctx);
      let sql = `    ALTER COLUMN ${db_quote_ident(column)} SET DATA TYPE ${dbType[0]}
    USING ${dbType[1]}(${db_quote_ident(column)}, ${db_quote_literal(arg)}, ${def_val})`;
      return sql;
    }
    //console.log(JSON.stringify(ast[2]))
    let expr = (0,dist_lpe.eval_lisp)(ast[2], ctx);
    //console.log(expr)

    let sql = `    ALTER COLUMN ${db_quote_ident(column)} SET DATA TYPE ${dbType[0]}
    USING ${dbType[1]}(${expr}, ${def_val})`;
    return sql;
  });
  return _ctx;
}
function eval_sql_macros(_sexpr, _vars) {
  if (typeof _vars === 'string') _vars = JSON.parse(_vars);

  //console.log('sql_where parse: ', JSON.stringify(sexpr));

  var _context = sql_macros_context(_vars);
  var ret = (0,dist_lpe.eval_lisp)(_sexpr, _context);

  // console.log('ret: ',  JSON.stringify(ret));
  return ret;
}
;// ./src/model/sql_model_context.js
/**
    Copyright (c) 2024 Luxms Inc.
    Copyright (c) 2024 Dmitry Dorofeev.
*/




/*
Ожидаем в _vars получить хэшмэп с ключами = голыми именами столбцов из логической модели,
то есть это имена, которые:
  1) уникальны в рамках модели
  2) не имеют ничего общего с реальными именами столбцов в базе
  3) используются во всех выражениях в дэшах и RLS
значениями является хэшмэп с 3 объектами: хэшмэп alsoIn, SQLColumn, SQLDataFrame в котором находится столбец; ключи column/dataframe
Если столбец находится в 2-х и более таблицах, то они перечисляются в массиве alsoIn


{
  'Revenue Goal': {
    column: D {
      id: 'col0',
      schema: null,
      name: 'revenue_goal',
      alias: 'Revenue Goal',
      type: 'STRING',
      native_type: 'STRING'
    },
    dataframe: Q [SQLMDXCube-mdx: #cube.sampleId null.[AdventureWorksDW2019Multidimensional-EE].[Adventure Works]] {
      id: 'cube.sampleId',
      schema: null,
      name: '[AdventureWorksDW2019Multidimensional-EE].[Adventure Works]',
      alias: null,
      lomo_dataframe_role: 'fact',
      type: 'mdx'
    },
    alsoIn: {}
  },


*/

/* expr() вызванный на литералах просто возвращает значение литерала */
Number.prototype.expr = function () {
  return this.valueOf();
};
String.prototype.expr = function () {
  return this.valueOf();
};

// FIXME: заменить возвращаемые хэшмэпы на объект resultObj с фиксированными полями
function sql_model_context(_vars, _columns) {
  let _columnsHash = _columns;
  let _context = _vars || {};

  /* FIXME: нужно создать базовый класс Postgres и от него отнаследовать другие,
  с имплементацией для всех других баз - будет меньше IF
  */
  let flavors = {
    "mdx": {
      "isSafeName": function (namedObject) {
        return false;
      },
      "quoteName": function (namedObject) {
        return `[${namedObject}]`;
      },
      "quoteLiteral": function (literal) {
        return `[${literal}]`;
      },
      "equalTo": function (col, literals, options) {
        // вариант для options.sqlContext = 'dimensionFilter'
        if (options.sqlContext === 'dimensionFilter' || options.sqlContext === 'whereFilter') {
          let txt = literals.map(el => `${col.expr(options)}.${el.expr(options)}`);
          if (txt && txt.length > 0) {
            return `{${txt.join(', ')}}`;
          } else {
            return "";
          }
        }
        throw new Error(`Not implemented equalTo()`);
      },
      "notEqualTo": function (col, literals, options) {
        // вариант для options.sqlContext = 'dimensionFilter'
        if (options.sqlContext === 'dimensionFilter' || options.sqlContext === 'whereFilter') {
          let txt = literals.map(el => `${col.expr(options)}.${el.expr(options)}`);
          if (txt && txt.length > 0) {
            // { [Geography].[Country].MEMBERS - [Geography].[Country].[(All)] - [Geography].[Country].[Canada] - [Geography].[Country].[Australia] }  * {[Product].[Product].[Cable Lock] } on 1
            return `{${col.expr(options)}.MEMBERS - ${col.expr(options)}.[(All)] - ${txt.join(' - ')}}`;
          } else {
            return "";
          }
        }
        throw new Error(`Not implemented notEqualTo()`);
      }
    }
  };
  let safeName = function (col, options) {
    let name = col.expr(options);
    let flavor = flavors[options.flavor];
    return flavor.isSafeName(name, options) ? name : flavor.quoteName(name, options);
  };
  let quoteLiteral = function (literal, options) {
    let flavor = flavors[options.flavor];
    return flavor.quoteLiteral(literal.expr(options), options);
  };
  let equalTo = function (col, literals, options) {
    let flavor = flavors[options.flavor];
    return flavor.equalTo(col, literals, options);
  };
  let notEqualTo = function (col, literals, options) {
    let flavor = flavors[options.flavor];
    return flavor.notEqualTo(col, literals, options);
  };
  //console.log(`CTX INIT ${JSON.stringify(_columnsHash)}`)
  _context["[]"] = function (name) {
    // в скобках у нас изначально записаны человечьи имена lomo_name из модели
    let columnObj = _columnsHash[name];
    if (columnObj !== undefined) {
      let c = {};
      // запоминаем упоминания столбцов, при этом ключами являются уникальные в рамках модели id столбцов!!
      // console.log(`AHGTUBNG!!! ${columnObj.column.expr}`)
      c[columnObj.column.id] = columnObj.column;
      return {
        // тут получаем проблему с двойным квотированием уже безопасных имён столбцов
        // считаем, что в случае MDX у нас уже безопасные имена столбцов в поле expression, так как они []
        // возможно, надо требовать, чтобы expression был безопасен для любых flavor
        // сейчас if написан здесь, так как мы обрабатываем конкретно квотирование []
        "expr": o => o.flavor === 'mdx' ? columnObj.column.expr(o) : safeName(columnObj.column, o),
        "columns": c
      };
    } else {
      // это неизвестное науке имя столбца, поэтому, мы либо должны кинуть ошибку,
      // либо придумать, что это за столбец
      // кстати, это может быть алиас, который нам ещё пока что неизвестен???

      //console.log(`ALIAS??? ${name.expr()} == ${JSON.stringify(_columnsHash[name])}`)
      return name;
      //throw new Error("Unknown column name used: ${name}")
    }
  };
  _context["ql"] = function (literal) {
    return {
      "expr": o => quoteLiteral(literal, o),
      "columns": (0,dist_lpe.isHash)(literal) ? literal.columns : {}
    };
  };
  var partial_filter = function (a) {
    if ((0,dist_lpe.isArray)(a[0]) && a[0][0] === "ignore(me)") {
      var ignoreme = a.shift();
      a = a.map(el => {
        if ((0,dist_lpe.isArray)(el)) {
          el.splice(1, 0, ignoreme);
          return el;
        } else {
          return el;
        }
      });
    }
    a = a.map(el => (0,dist_lpe.eval_lisp)(el, _context));
    //console.log("OR->OR->OR", JSON.stringify(a))
    return a;
  };
  _context["="] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // первым аргументом у нас будет скорее всего имя столбца,
    // далее скорее всего список кыотированных или не очень квотированных выражений
    // также возможны столбцы, но нам пока что фиолетово.
    // считаем, что если сделать eval каждого значения, то получим либо Number/String, либо column
    // и у них у всех есть функция expr(q), либо мы можем обернуть литерал в объект с функцией expr(q)
    let column = (0,dist_lpe.eval_lisp)(ast[0], _context);
    let flattenLiterals = ast.slice(1).flatMap(expr => {
      return (0,dist_lpe.eval_lisp)(expr, _context);
    });

    //console.log(`FLATTEN ${JSON.stringify(flattenLiterals)}`)
    return {
      "expr": o => equalTo(column, flattenLiterals, o),
      "columns": column.columns
    };
  });
  _context["!="] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // первым аргументом у нас будет скорее всего имя столбца,
    // далее скорее всего список кыотированных или не очень квотированных выражений
    // также возможны столбцы, но нам пока что фиолетово.
    // считаем, что если сделать eval каждого значения, то получим либо Number/String, либо column
    // и у них у всех есть функция expr(q), либо мы можем обернуть литерал в объект с функцией expr(q)
    let column = (0,dist_lpe.eval_lisp)(ast[0], _context);
    let flattenLiterals = ast.slice(1).flatMap(expr => {
      return (0,dist_lpe.eval_lisp)(expr, _context);
    });

    //console.log(`FLATTEN ${JSON.stringify(flattenLiterals)}`)
    return {
      "expr": o => notEqualTo(column, flattenLiterals, o),
      "columns": column.columns
    };
  });

  /* WIP
  */
  _context['or'] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    // Первый аргумент может быть ["ignore(me)",[]] = и надо его передать дальше!!!!
    // #244
    //console.log("OR OR OR", JSON.stringify(a))
    // [["ignore(me)",["column","ch.fot_out.pay_code"]],["!="],["ilike","Муж"]]
    let a = partial_filter(ast);
    if ((0,dist_lpe.isArray)(a)) {
      if (a.length > 0) {
        return `(${a.join(') OR (')})`;
      }
    }
    // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments
    return {
      "expr": q => '1=0',
      "columns": {}
    };
  });

  /* WIP
  */
  _context['and'] = (0,dist_lpe.makeSF)((ast, ctx, rs) => {
    //console.log(`HOY AND ${JSON.stringify(ast)}`)

    let a = partial_filter(ast);
    //console.log('AND:' + JSON.stringify(a))
    if ((0,dist_lpe.isArray)(a)) {
      if (a.length > 0) {
        return {
          "expr": q => `(${a.map(el => el.expr(q)).join(') AND (')})`,
          "columns": {} //FIXME: нужно копить columns для каждого элемента и вернуть ИТОГ!!!
        };
      }
    }
    // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments
    return {
      "expr": q => '1=1',
      "columns": {}
    };
  });

  /* так-то это полный алиас для [], для обратной совместимости оставили */
  _context["column"] = function (name, sql_context) {
    if (!sql_context) {
      sql_context = 'where';
    }
    // name у нас берётся из ключей filters и всегда ссылается на lomo_name
    let columnObj = _columnsHash[name];
    if (columnObj !== undefined) {
      let c = {};
      // запоминаем упоминания столбцов, при этом ключами являются уникальные в рамках модели id столбцов!!
      c[columnObj.column.id] = columnObj.column;
      return {
        // см. реализацию для [],
        "expr": o => o.flavor === 'mdx' ? columnObj.column.expr(o) : safeName(columnObj.column, o),
        "columns": c
      };
    } else {
      // это неизвестное науке имя столбца, поэтому, мы либо должны кинуть ошибку,
      // либо придумать, что это за столбец
      // кстати, это может быть алиас, который нам ещё пока что неизвестен???

      //console.log(`NOT KNOWN COLUMN??? ${name.expr()} == ${JSON.stringify(_columnsHash[name])}`)

      throw new Error("Unknown column name used: ${name}");
    }
  };

  // алиас не вычисляет никаких новых значений, а просто подхранивает имя алиаса
  // в ответ JSON. Алиасы будут проанализированы вызыающей стороной !!!
  _context[":"] = function (ex, alias) {
    if ((0,dist_lpe.isHash)(ex)) {
      ex.alias = alias;
      return ex;
    } else {
      return {
        "expr": ex.expr,
        "alias": alias
      };
    }
  };

  // функция ничего не делает, но используется для каррирования в выражениях and/or
  _context['ignore(me)'] = function (arg) {
    return arg;
  };

  /* WIP */
  _context["::"] = function (col, type) {
    return {
      "expr": q => {
        if (q.flavor === 'postgresql' || q.flavor === 'clickhouse') {
          return `${col.expr(q)}::${type})}`;
        } else {}
      },
      "columns": col.columns
    };
  };
  return _context;
}
;// ./src/model/quotinator.js
/*
Квотирует объекты СУБД в зависимости от типа СУБД. У нас есть варианты:

- двойные кавычки (как у всех)
- косые кавычки (вроде бы hive и mysql)
- []

*/

class SQLQuotinator {
  quote(name) {
    return `"${name}"`;
  }
}
class SquareBracketSQLQuotinator {
  quote(name) {
    return `[${name}]`;
  }
}
class BackticksSQLQuotinator {
  quote(name) {
    return `\`${name}\``;
  }
}
function getQuotinator(flavor) {
  if (flavor === 'sqlserver') {
    return new SquareBracketSQLQuotinator();
  } else {
    return new SQLQuotinator();
  }
}
;// ./src/sql_model.js
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





const get_in = (obj, keys) => keys.reduce((xs, x) => xs[x] ? xs[x] : null, obj);
const clone_prop = (to, from, prop) => to[prop] = get_in(from, [prop]);
class SQLNamedEntity {
  constructor(cfg) {
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "alias", void 0);
    ['id', 'schema', 'name', 'alias', 'expression'].map(el => clone_prop(this, cfg, el));
    if (this.expression === undefined || this.expression === null) {
      this.expression = this.safeName();
    }
  }
  get sql() {
    return this.alias ? `${this.expression} AS ${this.alias}` : `${this.expression}`;
  }

  /* FIXME: ВСЕ МЕТОДЫ, СВЯЗАННЫЕ С ВЫВОДОМ ТЕКСТА ДОЛЖНЫ БЫТЬ В МОДЕЛИ!!!
  только она знает версию SQL и может правильно брать в кавычки разные вещи!!!!
  на уровне объектов мы готовим правильные имена и правильные связи = структуру ответа
  а модель эту структуру распечатывает!!! */

  /* ставим кавычки в любом случае */
  quotedName(name) {
    if (name) {
      return `"${name}"`;
    } else {
      return `"${this.name}"`;
    }
  }

  /* Добавляем кавычки только если имя кажется небезопасным,
  при этом есть возможность добавить алиас, который тоже может быть небезопасным
  */
  safeName(alias) {
    let safeAlias;
    if (alias) {
      if (alias.match(/^[_a-z][_a-z0-9]*$/) === null) {
        safeAlias = ` AS ${this.quotedName(alias)}`;
      } else {
        safeAlias = ` AS ${alias}`;
      }
    } else {
      safeAlias = '';
    }
    if (this.name.match(/^[_a-z][_a-z0-9]*$/) === null) {
      return `${this.quotedName()}${safeAlias}`;
    } else {
      return `${this.name}${safeAlias}`;
    }
  }

  /* при небезопасных символах, берём имя схемы в кавычки */
  safeSchema() {
    if (this.schema.match(/^[_a-z][_a-z0-9]*$/) === null) {
      return this.quotedName();
    } else {
      return this.schema;
    }
  }

  /* безопасное имя, вместе с безопасной схемой (если есть) */
  safeFullName(alias) {
    if (this.schema) {
      return `${this.safeSchema()}.${this.safeName(alias)}`;
    } else {
      return this.safeName(alias);
    }
  }
}
class SQLColumn extends SQLNamedEntity {
  constructor(cfg) {
    /* нужно использовать `;` иначе babel генерит лютую дичь */
    super(cfg);
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "native_type", void 0);
    _defineProperty(this, "lomo_column_role", void 0);
    ['native_type', 'type', 'lomo_column_role'].map(el => clone_prop(this, cfg, el));
    this.alias = cfg['lomo_name']; //возможно это русское название !!!

    //console.log(`NEW SQLCOlumn ${JSON.stringify(cfg)}`)
  }
  expr() {
    return this.expression;
  }
  get [Symbol.toStringTag]() {
    return `SQLColumn: #${this.id} ${this.name}:${this.alias}`;
  }
}

// Это может быть View, Table, Dictionary в Clickhouse
var _columns = /*#__PURE__*/new WeakMap();
var _columns_by_id = /*#__PURE__*/new WeakMap();
var _columns_by_name = /*#__PURE__*/new WeakMap();
var _columns_by_alias = /*#__PURE__*/new WeakMap();
var _keys = /*#__PURE__*/new WeakMap();
var _links = /*#__PURE__*/new WeakMap();
var _primary_key = /*#__PURE__*/new WeakMap();
class SQLDataFrame extends SQLNamedEntity {
  constructor(cfg) {
    super(cfg);
    _classPrivateFieldInitSpec(this, _columns, []);
    _classPrivateFieldInitSpec(this, _columns_by_id, {});
    _classPrivateFieldInitSpec(this, _columns_by_name, {});
    _classPrivateFieldInitSpec(this, _columns_by_alias, {});
    _classPrivateFieldInitSpec(this, _keys, []);
    _classPrivateFieldInitSpec(this, _links, []);
    _classPrivateFieldInitSpec(this, _primary_key, void 0);
    _defineProperty(this, "lomo_dataframe_role", void 0);
    this.type = cfg.type;
    _classPrivateFieldSet(_columns, this, []);
    _classPrivateFieldSet(_columns_by_id, this, {});
    _classPrivateFieldSet(_columns_by_name, this, {});
    this.lomo_dataframe_role = cfg.lomo_dataframe_role;
    cfg.columns.map(el => this.addColumn(el));
  }
  safeColumnName(col_id, schema) {
    let s;
    if (schema) {
      if (schema.match(/^[_a-z][_a-z0-9]*$/) === null) {
        s = this.quotedName(schema);
      } else {
        s = schema;
      }
    }
    let col = _classPrivateFieldGet(_columns_by_id, this)[col_id];
    if (col) {
      if (schema) {
        return `${s}.${col.expr()}`;
      } else {
        return col.expr();
      }
    }
    throw new Error(`No column with id ${col_id} in ${this}`);
  }
  addColumn(cfg) {
    let c = new SQLColumn(cfg);
    if (c !== null) {
      _classPrivateFieldGet(_columns, this).push(c);
      _classPrivateFieldGet(_columns_by_id, this)[c.id] = c;
      _classPrivateFieldGet(_columns_by_name, this)[c.name] = c;
      _classPrivateFieldGet(_columns_by_alias, this)[c.alias] = c; // Алиасом у нас изначально является lomo_name из модели
    }
  }
  columnsByAlias() {
    return _classPrivateFieldGet(_columns_by_alias, this);
  }

  // возвращает список элементов, для каждого столбца и сам столбец и его SQL представление
  columnsSQLList(settings) {
    let tableAlias = settings.tableAlias ? `${settings.tableAlias}.` : '';
    // {"tableAlias": fact_alias, "columnsWithAliases": true}

    let ret;
    if (settings.columnsWithAliases === true) {
      ret = _classPrivateFieldGet(_columns, this).map(el => {
        return {
          // в модели есть функция safeName(столбец)
          "expr": q => `${tableAlias}${q.safeName(el)} AS "${el.alias}"`,
          "column": el
        };
      });
    } else {
      ret = _classPrivateFieldGet(_columns, this).map(el => {
        return {
          "expr": q => `${tableAlias}${q.safeName(el)}`,
          "column": el
        };
      });
    }
    return ret;
  }
  sql() {
    return 'SQLDataFrame SQL:';
  }
  linkTo(dataframe, mapping) {
    // FIXME: возможно надо создать объект Link???
    // FIXME: нужно зарезолвить mapping на объекты-столбцы!!!
    _classPrivateFieldGet(_links, this).push({
      "to": dataframe,
      "mapping": mapping
    });
    //console.log(`LINK TO ${JSON.stringify(this.#links)}`)
  }
  getLinkTo(frame) {
    let link = _classPrivateFieldGet(_links, this).find(el => frame.id === el.to.id);
    return link;
  }
  get [Symbol.toStringTag]() {
    return `SQLDataFrame-${this.type}: #${this.id} ${this.schema}.${this.name}`;
  }
  safeFrom(alias) {
    return this.safeFullName(alias);
  }
}

// должен сгенерить настоящий MDX, с учётом фильтров. См. mdx.md
class MDXQuery extends SQLDataFrame {
  constructor(cfg) {
    super(cfg);
  }
}

// Специальный объект, который использует функцию openquery() в SQL Server,
// чтобы подать MDX запрос. См. mdx.md
var _nested_mdx_query = /*#__PURE__*/new WeakMap();
class SQLMDXCube extends SQLDataFrame {
  constructor(cfg) {
    super(cfg);

    /* создаём объет, который сгенерит именно MDX,
    который как раз и будет аргументом для openquery() */
    _classPrivateFieldInitSpec(this, _nested_mdx_query, void 0);
    _classPrivateFieldSet(_nested_mdx_query, this, new MDXQuery(cfg));
  }
  safeFrom(alias) {
    // FIXME: алиас нам ароде как не нужен???
    //return this.safeFullName()
    // у нас уже всё в скобках!!! квадратных!!!
    return this.name; // возможно надо expr()??? как для столбцов
  }
  get [Symbol.toStringTag]() {
    return `SQLMDXCube-${this.type}: #${this.id} ${this.schema}.${this.name}`;
  }
}
var _filters = /*#__PURE__*/new WeakMap();
var _SQLUDF_brand = /*#__PURE__*/new WeakSet();
class SQLUDF extends SQLDataFrame {
  constructor(cfg) {
    super(cfg);
    _classPrivateMethodInitSpec(this, _SQLUDF_brand);
    _classPrivateFieldInitSpec(this, _filters, []);
    _defineProperty(this, "limit", null);
    _defineProperty(this, "offset", null);
    _defineProperty(this, "joins", []);
  }
  sql() {
    return 'SQLUDF SQL:';
  }
  get [Symbol.toStringTag]() {
    return `SQLUDF: #${this.id} ${this.schema}.${this.name}`;
  }
}

//database, schema, name may be null or undefined for SQLQuery!
function _dimensions() {}
function _measures() {}
var _filters2 = /*#__PURE__*/new WeakMap();
var _SQLQuery_brand = /*#__PURE__*/new WeakSet();
class SQLQuery extends SQLDataFrame {
  constructor(cfg) {
    super(cfg);
    _classPrivateMethodInitSpec(this, _SQLQuery_brand);
    _classPrivateFieldInitSpec(this, _filters2, []);
    _defineProperty(this, "based_on", void 0);
    // SQLDataFrame или SQLQuery
    _defineProperty(this, "limit", null);
    _defineProperty(this, "offset", null);
    _defineProperty(this, "joins", []);
    _defineProperty(this, "query", void 0);
    this.query = cfg.query;
  }
  sql() {
    return 'SQLQuery SQL:';
  }
  get [Symbol.toStringTag]() {
    return `SQLQuery: #${this.id} ${this.schema}.${this.name}`;
  }
  safeFrom() {
    return `(${this.query})`;
  }
}

// FIXME: это должен быть статический class method
function _dimensions2() {}
function _measures2() {}
function createDataFrameObject(el) {
  // FIXME: возможно надо сделать свой тип для каждого варианта, можно позже это сделать.
  if (el.type === 'table' || el.type === 'view' || el.type === 'dictionary') {
    return new SQLDataFrame(el);
  } else if (el.type === 'sql') {
    return new SQLQuery(el);
  } else if (el.type === 'udf') {
    return new SQLUDF(el);
  } else if (el.type === 'mdx') {
    return new SQLMDXCube(el);
  } else {
    throw new Error(`unknown type [${el.type}] for dataframe object: ${JSON.stringify(el)}`);
  }
}
var _joins = /*#__PURE__*/new WeakMap();
var _quotinator = /*#__PURE__*/new WeakMap();
class DynamicQuery {
  constructor(model, options) {
    _defineProperty(this, "fromFrame", void 0);
    // таблица или запрос или UDF из котрого делаем запрос
    _defineProperty(this, "fromFrame_alias", "luxmsbi_fact__");
    _defineProperty(this, "model", void 0);
    // для генерации SQL, нужно из-за flavor
    _defineProperty(this, "columns", []);
    // столбцы, готовые для вывода (перечисленные в select)
    _classPrivateFieldInitSpec(this, _joins, []);
    _defineProperty(this, "outerQuery", void 0);
    // Объемлющий запрос, порождённый нами. (parent)
    _defineProperty(this, "outerColumnAliases", []);
    // ключами являются индексы столбцов, которые поступили на вход запроса.
    // тут храним только алиас каждого столбца на своём индексе
    _defineProperty(this, "innerColumnAliases", []);
    _defineProperty(this, "limit", 1001);
    // by default
    _defineProperty(this, "offset", 0);
    _defineProperty(this, "flavor", 'postgresql');
    _classPrivateFieldInitSpec(this, _quotinator, void 0);
    _defineProperty(this, "filters", {});
    _defineProperty(this, "orderByList", []);
    // список выражений для сортировки
    _defineProperty(this, "processedOrderByList", []);
    // вычисленный
    _defineProperty(this, "preprocessedFilters", undefined);
    // заквотированы литералы, но не сделан eval
    _defineProperty(this, "processedFilters", {});
    // уже сделан eval
    _defineProperty(this, "sqlContext", {
      "flavor": "mdx",
      "sqlContext": "dimensionFilter"
    });
    this.model = model;
    this.flavor = this.model.flavor;
    _classPrivateFieldSet(_quotinator, this, getQuotinator(this.flavor));
  }
  get [Symbol.toStringTag]() {
    return `DynamicQuery(${this.flavor})`;
  }
  quote(name) {
    return _classPrivateFieldGet(_quotinator, this).quote(name);
  }

  /* безопасное имя для столбца или таблицы, вместе с безопасной схемой (если есть) */
  safeFullName(namedObject) {
    if (namedObject.schema) {
      return `${this.safeSchemaName(namedObject)}.${namedObject.expr()}`;
    } else {
      return namedObject.expr();
    }
  }
  isSafeName(name) {
    return name.match(/^[_A-Za-z][_A-Za-z0-9]*$/) === null ? false : true;
  }
  safeSchemaName(namedObject) {
    if (namedObject.schema) {
      return this.isSafeName(namedObject.schema) ? this.quote(namedObject.schema) : namedObject.schema;
    } else {
      throw new Error('No schema for ${namedObject}, but someone want to print it in SQL Query');
    }
  }
  safeName(namedObject) {
    if ((0,dist_lpe.isString)(namedObject)) {
      return this.isSafeName(namedObject) ? namedObject : this.quote(namedObject);
    }

    // тут у нас объект, который мы вытащили из хэша столбцов и он почему-то не SQLColumn ???
    //console.log(namedObject instanceof SQLColumn)

    return namedObject.expr(this); // не применить функцию expr() от столбца ;-()

    /*
    if (namedObject.name) {
        // оказывается, у нас уже есть готовый SQL/MDX и не надо ничего квотировать!
        return namedObject.name
        //return this.isSafeName(namedObject.name) ? namedObject.name : this.quote(namedObject.name)
    } else {
        throw new Error('No name for ${namedObject}, but someone want to print it in SQL Query')
    }
    */
  }
  auto_quote_filters_expr(ar, should_not_quote) {
    let arr = ar;
    if ((0,dist_lpe.isString)(ar)) {
      if (ar.startsWith('lpe:')) {
        let ast = (0,dist_lpe.parse)(ar, {
          squareBrackets: true
        });
        if (!(0,dist_lpe.isArray)(ast)) {
          throw new Error(`not valid lpe expr: ${ar}`);
        } else {
          arr = ast;
        }
      } else {
        throw new Error(`no lpe: prefix in expr: ${ar}`);
      }
    }
    if ((0,dist_lpe.isArray)(arr)) {
      return arr.map((el, i) => {
        if (i === 0) {
          return el;
        }
        if ((0,dist_lpe.isString)(el)) {
          if (should_not_quote) {
            return el;
          } else {
            return ["ql", el];
          }
        }
        if ((0,dist_lpe.isArray)(el)) {
          if (el[0] === '=' || el[0] === '!=' || el[0] === 'between') {
            return this.auto_quote_filters_expr(el);
          } else {
            return this.auto_quote_filters_expr(el, true);
          }
        }
        return el;
      });
    }
    // support for empty filters:
    return ar;
  }
  preprocessFilters() {
    if (this.preprocessedFilters) {
      return;
    } else {
      this.preprocessedFilters = {};
    }
    if (Object.keys(this.filters).length === 0) {
      return;
    }

    // для фильтров проходим каррированный LPE и добавляем квотирование литералов
    Object.keys(this.filters).map(key => {
      this.preprocessedFilters[key] = this.auto_quote_filters_expr(this.filters[key]);
    });

    //console.log(`preprocessed filters 0: ${JSON.stringify(this.preprocessedFilters)}`)

    // Здесь кусочек из get_filters_array()
    let part_where = null;
    let sql_context = 'where';
    let pw = Object.keys(this.preprocessedFilters).filter(k => k !== '').map(key => {
      // специальная функция `ignore(me)` = которая ничего не делает, но является меткой для
      // and or not
      const [op, ...args] = this.preprocessedFilters[key];
      let colname = ["column", key, sql_context]; // фильтры только по lomo_name !
      let expr;
      if (op === "ensureThat") {
        expr = [op, ...args];
      } else {
        //console.log(`STEP0: ${colname} == ${local_alias_lpe_evaled_map[colname]} `)
        expr = [op, ["ignore(me)", colname], ...args];
      }

      //console.log(`pre eval : ${JSON.stringify(expr)}`)
      // JSON.parse(JSON.stringify(expr), {squareBrackets: true})
      this.processedFilters[key] = (0,dist_lpe.eval_lisp)(expr, this.model.context());
    });

    //console.log(`parsed filters: ${Object.values(this.processedFilters).map(el=>el.expr(this.sqlContext)).join(' AND ')}`)
  }
  from(frame) {
    this.fromFrame = frame;
    if (this.columns.length === 0 && !(this.fromFrame instanceof DynamicQuery)) {
      // нужно сделать `SELECT *`, но с явным указанием имён всех столбцов.
      // но в случае если у нас динамический запрос, то он сам заполнит наш this.columns!!!!
      this.columns = this.fromFrame.columnsSQLList({
        "tableAlias": this.fromFrame_alias,
        "columnsWithAliases": true
      });
    }
    return this;
  }
  select(columns) {
    // столбцы должны как-то биться с таблицами, которые у нас есть в наличии!!
    // если столбцы не указаны, то мы выводим вообще все столбцы, какие есть в таблице(ах)!!!
    if ((0,dist_lpe.isArray)(columns) && columns.length > 0) {
      let evaled_columns = columns.map(col => {
        let a = (0,dist_lpe.parse)(col, {
          squareBrackets: true
        });

        // пока что пробуем вернуть ОБЪЕКТ а не готовый SQL текст для каждого столбца.
        // типа там будет метод expr(), который сможет напечатать текстовочку
        // То есть мы при вычислении LPE генерим вложенные вызовы expr(q), которые сможем
        // выполнить позже, при генерации итогового SQL.
        // А пока мы бегаем по AST = мы копим статистику об используемых столбуах, типах функций
        // и определяем алиас
        let el = (0,dist_lpe.eval_lisp)(a, this.model.context());
        //console.log(`COLUMN EVAL1: ${col} ${JSON.stringify(el)}` )
        //console.log(`COLUMN EVAL2: ${el.expr(this)}`)
        return el;
      });
      this.columns = evaled_columns;
      //console.log(`COLUMNS: ${JSON.stringify(evaled_columns)}`)
    }
    return this;
  }
  where(filters) {
    if ((0,dist_lpe.isHash)(filters)) {
      this.filters = filters;
    } else {
      throw new Error(`Got filters, but they are not hashmap :-(`);
    }
    return this;
  }
  leftJoin(frame) {
    // делаем LEFT JOIN нашего SQL с аргументом, который может быть и DynamicQuery ваще-то
    // У нас модель построена так, что связи идут от справочника в таблицу фактов (так как один ко многим)
    // Это как бы наоборот от того, куда указывают (REFERENCES) FOREIGN KEYS
    let link = frame.getLinkTo(this.fromFrame);
    if (link) {
      // таким образом, frame - это справочник для this, и мы можем сделать
      // select * from this left join frame
      // console.log(`Link found ${link.to}`)
      let alias = `luxmsbi_dict__${_classPrivateFieldGet(_joins, this).length}`;
      let keys = Object.keys(link.mapping);
      let l = {
        "type": "left",
        "mapping": link.mapping,
        //FIXME будет неудобно делать мэппинги ????
        "to": frame,
        "alias": alias,
        "from": this.fromFrame,
        // убираем столбцы, которые уже и так были в таблице фактов (ключи)
        // довольно наивно, но пока вот так.
        // Возможно это лучше делать в момент окончательного sql()
        // Но у нас в модели у них совпадлают ИМЕНА !!!
        "columns": frame.columnsSQLList({
          "tableAlias": alias,
          "columnsWithAliases": true
        }).filter(el => !keys.find(key => key === el.column.id))
      };
      _classPrivateFieldGet(_joins, this).push(l);
    } else {
      // можем запретить делать JOIN с таблицами, с которыми нет связей:
      //throw new Error(`${this.fromFrame} LEFT JOIN ${frame} failed: no links found` );
    }
    return this;
    // или новый DynamicQuery :-)
  }

  // генерит кусочек SQL, который является списком столбцов
  // включает столбцы из основной таблицы и из всех сджойненных
  generateColumns() {
    let cols0 = this.columns.map(el => el.expr(this));
    let cols = _classPrivateFieldGet(_joins, this).flatMap(el => el.columns.map(c => c.expr(this)));
    if ((0,dist_lpe.isArray)(cols0)) {
      cols = cols0.concat(cols);
    }
    return cols;
    //console.log(`COLS: ${JSON.stringify(cols)}`)
  }
  generateJoinPart(link) {
    let from_cols = [],
      to_cols = [];
    for (const [key, value] of Object.entries(link.mapping)) {
      to_cols.push(key);
      from_cols.push(value);
    }
    // mapping у нас ОБРАТНЫЙ !!!
    let cols = `(${from_cols.map(el => link.from.safeColumnName(el, this.fromFrame_alias)).join(",")}) = (${to_cols.map(el => link.to.safeColumnName(el, link.alias)).join(",")})`;
    let r = `${link.type.toUpperCase()} JOIN ${link.to.safeFrom(link.alias)} ON ${cols}`;
    return r;
  }
  fromPart() {
    let f = `${this.fromFrame.safeFrom()} AS ${this.fromFrame_alias}`;
    let joins = _classPrivateFieldGet(_joins, this).map(el => this.generateJoinPart(el)).join(' ');
    return `${f} ${joins}`;
  }

  // FIXME: должен быть подзапрос для оракла !!!
  limitOffset(limit, offset) {
    let l = parseInt(limit);
    if (l > 0) {
      this.limit = l;
    }
    let o = parseInt(offset);
    if (o > 0) {
      this.offset = o;
    }
  }
  generateLimitOffset(sql) {
    // FIXME: for Oracle and other db надо делать подзапрос !!!!
    // FIXME: тщательнее с flavor надо что-то уже выбрать!
    if (this.flavor === 'sqlserver' || this.flavor === 'mdx' || this.flavor === 'linkedssas') {
      if (this.limit) {
        if (this.offset) {
          return `${sql}\nOFFSET ${this.offset} ROWS FETCH NEXT ${this.limit} ROWS ONLY`;
        } else {
          return `${sql}\nOFFSET 0 ROWS FETCH NEXT ${this.limit} ROWS ONLY`;
        }
      } else if (this.offset) {
        return `${sql}\nOFFSET ${this.offset} ROWS`;
      }
    }
    return sql;
  }
  generateOrderBy(sql) {
    if (this.limit || this.offset) {
      return `${sql}\nORDER BY 1`;
    }
    return sql;
  }
  sql(query_params, sql_subquery) {
    // tableAlias кажется нужно использовать имя таблицы в случае, если это clickhouse ???

    // также, должна быть возможность удалить столбцы из списка, так как они есть и в фактах и в словарях
    // по этим столбцам идёт связь. Можно все столбцы взять из фактов и скипать их из словарей.
    // нужен except

    // второй аргумент может прилететь, как готовый подзапрос.

    let fromPart = sql_subquery ? sql_subquery : this.fromPart();
    let sql = `SELECT ${this.generateColumns().join(', ')} FROM ${fromPart}`;

    // наивный вариант, для оракла надо делать подзапрос !!!
    // FIXME: надо перейти на нормальные выражения q.select().orderBy().limitOffset()
    sql = this.generateOrderBy(sql);
    return this.generateLimitOffset(sql);
  }
}
class MDXDynamicQuery extends DynamicQuery {
  //FIXME: надо лучше формировать объект с опциями!!!

  constructor(model, options) {
    super(model, options);

    // Этот объект генерит внутренний SQL и должен попродить объемлющий SQL запрос
    // и состыковать эти запросы по именам столбцов!
    // тут запоминаем все ключи столбцов, которые засветились в SELECT columns, это потенциально больше, чем columns
    // возможно ещё надо запомнить и алиасы, но пока только столбцы
    // ключи = lomo_name, значение = сам объект SQLColumn
    _defineProperty(this, "selectedColumns", {});
    _defineProperty(this, "flavor", 'mdx');
    this.outerQuery = new DynamicQuery(model, options);
    this.outerQuery.from(this);
  }

  // добавляем mdx алиасы даже для тех столбцов, которые их явно не указывали
  generateColumns() {
    let cols = this.columns.map((el, i) => {
      let ret = el.expr(this);
      // console.log(`EVALED: ${el.expr}`)

      let keys = Object.keys(el.columns);
      if (keys.length === 1) {
        let col = el.columns[keys[0]];
        if (col.lomo_column_role === 'dimension') {
          // трёхчлен надо разбить до двух и дописать херь
          let chk = ret.split('].[');
          if (chk.length === 3) {
            // это трёхчлен!
            ret = ret.replace(new RegExp('\\[[^\\]]+\\]$'), 'CurrentMember.Member_caption');
          } else {
            // двухчлен ??
            ret = `${ret}.CurrentMember.Member_caption`;
          }
        }
      }
      return `    MEMBER ${this.safeName(this.outerColumnAliases[el.index])} AS ${ret}`;
    });
    return cols;
    //console.log(`COLS: ${JSON.stringify(cols)}`)
  }
  select(columns) {
    super.select(columns);
    // у нас вычисленные через LPE this.columns и нам лучше заменить ALIASES на luxmsbicolumn1...
    // а потом использовать их в кастомной

    this.outerQuery.columns = [];
    this.columns.map((col, i) => {
      col.index = i;

      // col.alias -> это всегда алиас, который хочет видеть конечный юзер!!!
      this.outerColumnAliases[i] = `luxmsbicol_${i}`; // что увидит объемлющий запрос

      if (col.alias === undefined) {
        if (Object.keys(col.columns).length === 1) {
          let columnKey = Object.keys(col.columns)[0];
          let lomo_name = col.columns[columnKey].alias;
          col.alias = lomo_name;
        } else {
          // автоматически созданное имя
          col.alias = this.outerColumnAliases[i];
        }
      }

      // заполняем имена столбцов, которые увидит конечный пользователь
      this.outerQuery.innerColumnAliases[i] = this.outerColumnAliases[i];

      // FIXME: зная типы столбцов, нужно сгенерить правильные приведения типов
      // COALESCE( CAST("[Measures].[q1]" as float),0) as q1
      if (Object.keys(col.columns).length !== 1) {
        // FIXME: надо придумать, как выводить тип результата
        //throw new Error(`Column ${JSON.stringify(col)} has more than one sources?`)
      }

      // запоминаем все столбцы, которые упоминались в вычислениях
      // ключи = lomo_name, значение = сам объект SQLColumn
      Object.keys(col.columns).forEach(key => this.selectedColumns[col.columns[key].alias] = col.columns[key]);
      let columnKey = Object.keys(col.columns)[0];
      this.outerQuery.columns.push(this.generateColumnWithNativeType(col.columns[columnKey], this.outerColumnAliases[i], col.alias));
    });

    // теперь нужно выделить столбцы, которые имеются в sелекте???
    //console.log(JSON.stringify(this.columns))
    //console.log('SELECTED COLUMNS ' + JSON.stringify(this.selectedColumns))
    return this;
  }
  generateColumnWithNativeType(col, innerAlias, outerAlias) {
    // dimensions всегда STRING вроде как
    // А все Measures всегда FLOAT ???
    let sqlserverType = 'nvarchar';
    let defaultValue = "''";
    if (col.type === 'FLOAT') {
      sqlserverType = 'float';
      defaultValue = '0.0';
    } else if (col.type === 'INTEGER') {
      sqlserverType = 'integer';
      defaultValue = '0';
    }
    return {
      // FIXME: нужно понять dimension или measure???
      "expr": q => `COALESCE( CAST("[Measures].[${innerAlias}]" as ${sqlserverType}),${defaultValue}) as ${this.safeName(outerAlias)}`,
      "alias": outerAlias,
      "columns": {}
    };
  }
  generateFiltersAsDims() {
    this.preprocessFilters();

    // Нужно определить дименшены, которые не указаны в фильтрах и для них сформировать
    // стандартное выражение на оси 1 без члена All
    let dimensions = Object.values(this.selectedColumns).filter(col => col.lomo_column_role === 'dimension').map(col => {
      if (col.alias in this.filters) {
        // столбец находится в фильтрах, надо вычислить Expr
        // console.log(` GGG GGG GGG ${JSON.stringify(this.processedFilters[col.alias])}` )
        let intermediate = (0,dist_lpe.eval_lisp)(this.processedFilters[col.alias], this.model.context());
        let text = intermediate.expr({
          "flavor": this.flavor,
          "sqlContext": "dimensionFilter"
        });
        if (text) {
          return text;
        } else {
          // это пустой фильтр, например !=, который ничего не фильтрует!
          // делаем так, как будто фильтра не было вообще
          return `{${col.expression}.MEMBERS - ${col.expression}.[(All)]}`;
        }
      } else {
        // столбца нет в фильтрах, надо вычесть All
        return `{${col.expression}.MEMBERS - ${col.expression}.[(All)]}`;
      }
    });
    if (dimensions.length > 0) {
      return `,\nNON EMPTY ${dimensions.join('\n * ')} ON 1`;
    }
    return "";
  }
  generateFiltersAsWhere() {
    this.preprocessFilters();

    // Нужно определить, фильтры, которых нет в дименшенах
    // стандартное выражение на оси 1 без члена All
    let not_selected_filters = Object.keys(this.filters).filter(key => !(key in this.selectedColumns) && this.model.columns[key].column.lomo_column_role === 'dimension').map(key => {
      let intermediate = (0,dist_lpe.eval_lisp)(this.processedFilters[key], this.model.context());
      let text = intermediate.expr({
        "flavor": this.flavor,
        "sqlContext": "whereFilter"
      });
      return text;
    });
    let whereFilters = not_selected_filters.filter(el => el !== '' && el);
    if (whereFilters.length > 0) {
      return `\n  WHERE (${whereFilters.join('\n , ')})`;
    }
    return "";
  }
  fromPart(query_params) {
    let f = this.fromFrame.safeFrom();
    return f;
  }
  sql(query_params, subquery) {
    // tableAlias кажется нужно использовать имя таблицы в случае, если это clickhouse ???

    // также, должна быть возможность удалить столбцы из списка, так как они есть и в фактах и в словарях
    // по этим столбцам идёт связь. Можно все столбцы взять из фактов и скипать их из словарей.
    // нужен except
    //{[q1] , [q2], [q3], [q4]} on 0

    // в случае, если у нас оджин столбец, то надо добавить дефолтную межу!
    let colsSQL = this.columns.map((el, i) => `[${this.outerColumnAliases[i]}]`).join(', ');
    if (this.columns.length === 1) {
      colsSQL = `${colsSQL}, [Measures].DefaultMember`;
    }
    let sql = `openquery(${this.model.linkedSSASName}, '\nWITH\n${this.generateColumns().join("\n")}
SELECT {${colsSQL}} ON 0${this.generateFiltersAsDims()}
    FROM ${this.fromPart()}${this.generateFiltersAsWhere()}
')`;

    // limit offset должен сгенерить объемлющий запрос,
    // поэтому передаём в него наши настройки, а свои настройки тихо игнорируем.
    this.outerQuery.limitOffset(this.limit, this.offset);
    let outerSQL = this.outerQuery.sql(query_params, sql);
    return outerSQL;
  }
}
var _context = /*#__PURE__*/new WeakMap();
var _dataframes = /*#__PURE__*/new WeakMap();
var _dataframes_by_id = /*#__PURE__*/new WeakMap();
var _fact_table = /*#__PURE__*/new WeakMap();
class SQLModel {
  constructor(cfg, options) {
    _defineProperty(this, "flavor", 'postgresql');
    _classPrivateFieldInitSpec(this, _context, {});
    _classPrivateFieldInitSpec(this, _dataframes, []);
    _classPrivateFieldInitSpec(this, _dataframes_by_id, {});
    _classPrivateFieldInitSpec(this, _fact_table, null);
    _defineProperty(this, "columns", {});
    //все столбцы в модели, хэш по уникальному имени title/alias
    _defineProperty(this, "linkedSSASName", void 0);
    if ((0,dist_lpe.isHash)(options) && options.flavor) {
      this.flavor = options.flavor;
    }

    // добавляем таблицы
    cfg.dataframes.map(el => this.addDataframe(el));

    // если у нас одна таблица, то она и будет фактом!
    if (_classPrivateFieldGet(_dataframes, this).length === 1) {
      _classPrivateFieldSet(_fact_table, this, _classPrivateFieldGet(_dataframes, this)[0]);
    }
    // добавляем связи
    if ((0,dist_lpe.isArray)(cfg.lomo_links)) {
      cfg.lomo_links.map(el => {
        this.addLink(el);
      });
    }

    //console.log(this.columns)
    _classPrivateFieldSet(_context, this, sql_model_context({}, this.columns));
    if (options["linked_ssas_name"]) {
      this.linkedSSASName = options["linked_ssas_name"];
    } else if ((0,dist_lpe.isHash)(options["options"])) {
      this.linkedSSASName = options["options"]["linked_ssas_name"];
    }
  }
  context() {
    // LPE context
    return _classPrivateFieldGet(_context, this);
  }
  get dataframes() {
    return _classPrivateFieldGet(_dataframes, this);
  }
  addDataframe(df_json) {
    let df = createDataFrameObject(df_json);
    if (df !== null) {
      //console.log(`ALIASES: ${JSON.stringify(df.columnsByAlias())}`)
      for (const [key, val] of Object.entries(df.columnsByAlias())) {
        if (this.columns[key]) {
          // duplicate column, это норм, но нужно сделать
          // ссылки на несколько таблиц из одного столбца!
          this.columns[key]["alsoIn"][df.id] = df;
        }
        this.columns[key] = {
          "column": val,
          "dataframe": df,
          "alsoIn": {}
        };
      }
      _classPrivateFieldGet(_dataframes, this).push(df);
      if (df.id !== null) {
        _classPrivateFieldGet(_dataframes_by_id, this)[df.id] = df;
      }
      // на модель у нас должна быть одна факт таблица (пока что так)
      if (df_json.lomo_dataframe_role === 'fact') {
        _classPrivateFieldSet(_fact_table, this, df);
      }
    }
  }

  // добавляет связь между 2-мя таблицами (таблицы уже должны быть в модели)
  addLink(el) {
    if ((0,dist_lpe.isHash)(el.from) && (0,dist_lpe.isHash)(el.to)) {
      let f = el.from,
        t = el.to;
      if (f.dataframe && t.dataframe) {
        // пропускаем ссылки на таблицы, которых нет в модели!
        if (_classPrivateFieldGet(_dataframes_by_id, this)[f.dataframe]) {
          _classPrivateFieldGet(_dataframes_by_id, this)[f.dataframe].linkTo(_classPrivateFieldGet(_dataframes_by_id, this)[t.dataframe], el.mapping);
        }
      }
    }
  }
  get [Symbol.toStringTag]() {
    return `SQLModel: ${JSON.stringify(_classPrivateFieldGet(_dataframes, this))}`;
  }
  singleQuery(query_params, options) {
    let q = _classPrivateFieldGet(_fact_table, this).type === 'mdx' ? new MDXDynamicQuery(this, options) : new DynamicQuery(this, options); // flavor находится в options и будет доступен внутри Query!

    let columns = query_params["columns"];
    let filters = query_params["filters"];
    q.select(columns).from(_classPrivateFieldGet(_fact_table, this));
    q.where(filters); // hashmap
    q.limitOffset(query_params["limit"], query_params["offset"]);

    // limit offset in query_params
    return q.sql(/*query_params*/);
  }
  starSchemaFullJoin(query_params, options) {
    // для всех таблиц один супер большой `select * from`
    let q = new DynamicQuery(this, options);
    q.from(_classPrivateFieldGet(_fact_table, this));
    _classPrivateFieldGet(_dataframes, this).map(el => {
      if (el.lomo_dataframe_role === 'dimension') {
        q.leftJoin(el);
      }
    });
    q.limitOffset(query_params["limit"], query_params["offset"]);

    // limit offset in query_params
    return q.sql(/*query_params*/);
  }
}

/*
_cfg: большой JSON с полным описанием модели
https://gito.luxms.com/luxmsbi/luxmsbi-web-client/-/issues/139
*/

function generate_sql_for_model(_body, options) {
  let model = new SQLModel(_body.model, options);
  let response;
  if (model.dataframes.length === 1) {
    response = model.singleQuery(_body, {});
  } else {
    // в _body у нас будет LIMIT/OFFSET
    response = model.starSchemaFullJoin(_body, {});
  }
  if (_body["return"] === "count") {
    // нужно обернуть запрос в select count(*)
    return `SELECT count(300) as "count" FROM (${response}) koob__count__src__`;
  } else {
    return response;
  }
}
;// ./src/index.js








function eval_lpe(lpe, ctx, options) {
  const ast = (0,dist_lpe.parse)(lpe);
  return (0,dist_lpe.eval_lisp)(ast, ctx, options);
}


// test:
// var ast = parse('2+2*2');
// console.log(ast);
// var res = eval_lisp(ast, []);
// console.log(res);

// test:
// var result = eval_sql_where("where(id=[1,2,3,4] and metric.tree_level(id) = 3 and max(id)=now() and $metric_id = 3)", {"$metric_id":"COOL","id":"ID"});
// console.log(result);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=lpe.js.map
