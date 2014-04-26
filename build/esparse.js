/*=es6now=*/(function(fn, deps, name) { if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof window !== 'undefined' && name) fn.call(window, null, window[name] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { 'use strict'; function __load(p) { var e = require(p); return typeof e === 'object' ? e : { 'default': e }; } 

var __this = this; this.es6now = {};

(function() {

/*

Provides basic support for methods added in EcmaScript 5 for EcmaScript 4 browsers.
The intent is not to create 100% spec-compatible replacements, but to allow the use
of basic ES5 functionality with predictable results.  There are features in ES5 that
require an ES5 engine (freezing an object, for instance).  If you plan to write for 
legacy engines, then don't rely on those features.

*/

var global = this,
    OP = Object.prototype,
    HOP = OP.hasOwnProperty,
    slice = Array.prototype.slice,
    TRIM_S = /^s+/,
    TRIM_E = /s+$/,
    FALSE = function() { return false; },
    TRUE = function() { return true; },
    identity = function(o) { return o; },
    defGet = OP.__defineGetter__,
    defSet = OP.__defineSetter__,
    keys = Object.keys || es4Keys,
    ENUM_BUG = !function() { var o = { constructor: 1 }; for (var i in o) return i = true; }(),
    ENUM_BUG_KEYS = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ],
    ERR_REDUCE = "Reduce of empty array with no initial value";

// Returns the internal class of an object
function getClass(o) {

    if (o === null || o === undefined) return "Object";
    return OP.toString.call(o).slice("[object ".length, -1);
}

// Returns an array of keys defined on the object
function es4Keys(o) {

    var a = [], i;
    
    for (i in o)
        if (HOP.call(o, i))
            a.push(i);
    
    if (ENUM_BUG) 
        for (i = 0; i < ENUM_BUG_KEYS.length; ++i)
            if (HOP.call(o, ENUM_BUG_KEYS[i]))
                a.push(ENUM_BUG_KEYS[i]);
    
    return a;
}

// Sets a collection of keys, if the property is not already set
function addKeys(o, p) {

    for (var i = 0, a = keys(p), k; i < a.length; ++i) {
    
        k = a[i];
        
        if (o[k] === undefined) 
            o[k] = p[k];
    }
    
    return o;
}


// In IE8, defineProperty and getOwnPropertyDescriptor only work on DOM objects
// and are therefore useless - so bury them.
try { (Object.defineProperty || FALSE)({}, "-", { value: 0 }); }
catch (x) { Object.defineProperty = undefined; };

try { (Object.getOwnPropertyDescriptor || FALSE)({}, "-"); }
catch (x) { Object.getOwnPropertyDescriptor = undefined; }

// In IE < 9 [].slice does not work properly when the start or end arguments are undefined.
try { [0].slice(0, undefined)[0][0]; }
catch (x) {

    Array.prototype.slice = function(s, e) {
    
        s = s || 0;
        return (e === undefined ? slice.call(this, s) : slice.call(this, s, e));
    };
}

// ES5 Object functions
addKeys(Object, {

    create: function(o, p) {
    
        var n;
        
        if (o === null) {
        
            n = { "__proto__": o };
        
        } else {
        
            var f = function() {};
            f.prototype = o;
            n = new f;
        }
        
        if (p !== undefined)
            Object.defineProperties(n, p);
        
        return n;
    },
    
    keys: keys,
    
    getOwnPropertyDescriptor: function(o, p) {
    
        if (!HOP.call(o, p))
            return undefined;
        
        return { 
            value: o[p], 
            writable: true, 
            configurable: true, 
            enumerable: OP.propertyIsEnumerable.call(o, p)
        };
    },
    
    defineProperty: function(o, n, p) {
    
        var msg = "Accessor properties are not supported.";
        
        if ("get" in p) {
        
            if (defGet) defGet(n, p.get);
            else throw new Error(msg);
        }
        
        if ("set" in p) {
        
            if (defSet) defSet(n, p.set);
            else throw new Error(msg);
        }
        
        if ("value" in p)
            o[n] = p.value;
        
        return o;
    },
    
    defineProperties: function(o, d) {
    
        Object.keys(d).forEach(function(k) { Object.defineProperty(o, k, d[k]); });
        return o;
    },
    
    getPrototypeOf: function(o) {
    
        return "__proto__" in o ? o.__proto__ : o.constructor.prototype;
    },
    
    /*
    
    NOTE: getOwnPropertyNames is buggy since there is no way to get non-enumerable 
    ES3 properties.
    
    */
    
    getOwnProperyNames: keys,
    
    freeze: identity,
    seal: identity,
    preventExtensions: identity,
    isFrozen: FALSE,
    isSealed: FALSE,
    isExtensible: TRUE
    
});


// Add ES5 String extras
addKeys(String.prototype, {

    trim: function() { return this.replace(TRIM_S, "").replace(TRIM_E, ""); }
});


// Add ES5 Array extras
addKeys(Array, {

    isArray: function(obj) { return getClass(obj) === "Array"; }
});


addKeys(Array.prototype, {

    indexOf: function(v, i) {
    
        var len = this.length >>> 0;
        
        i = i || 0;
        if (i < 0) i = Math.max(len + i, 0);
        
        for (; i < len; ++i)
            if (this[i] === v)
                return i;
        
        return -1;
    },
    
    lastIndexOf: function(v, i) {
    
        var len = this.length >>> 0;
        
        i = Math.min(i || 0, len - 1);
        if (i < 0) i = len + i;
        
        for (; i >= 0; --i)
            if (this[i] === v)
                return i;
        
        return -1;
    },
    
    every: function(fn, self) {
    
        var r = true;
        
        for (var i = 0, len = this.length >>> 0; i < len; ++i)
            if (i in this && !(r = fn.call(self, this[i], i, this)))
                break;
        
        return !!r;
    },
    
    some: function(fn, self) {
    
        var r = false;
        
        for (var i = 0, len = this.length >>> 0; i < len; ++i)
            if (i in this && (r = fn.call(self, this[i], i, this)))
                break;
        
        return !!r;
    },
    
    forEach: function(fn, self) {
    
        for (var i = 0, len = this.length >>> 0; i < len; ++i)
            if (i in this)
                fn.call(self, this[i], i, this);
    },
    
    map: function(fn, self) {
    
        var a = [];
        
        for (var i = 0, len = this.length >>> 0; i < len; ++i)
            if (i in this)
                a[i] = fn.call(self, this[i], i, this);
        
        return a;
    },
    
    filter: function(fn, self) {
    
        var a = [];
        
        for (var i = 0, len = this.length >>> 0; i < len; ++i)
            if (i in this && fn.call(self, this[i], i, this))
                a.push(this[i]);
        
        return a;
    },
    
    reduce: function(fn) {
    
        var len = this.length >>> 0,
            i = 0, 
            some = false,
            ini = (arguments.length > 1),
            val = (ini ? arguments[1] : this[i++]);
        
        for (; i < len; ++i) {
        
            if (i in this) {
            
                some = true;
                val = fn(val, this[i], i, this);
            }
        }
        
        if (!some && !ini)
            throw new TypeError(ERR_REDUCE);
        
        return val;
    },
    
    reduceRight: function(fn) {
    
        var len = this.length >>> 0,
            i = len - 1,
            some = false,
            ini = (arguments.length > 1),
            val = (ini || i < 0  ? arguments[1] : this[i--]);
        
        for (; i >= 0; --i) {
        
            if (i in this) {
            
                some = true;
                val = fn(val, this[i], i, this);
            }
        }
        
        if (!some && !ini)
            throw new TypeError(ERR_REDUCE);
        
        return val;
    }
});

// Add ES5 Function extras
addKeys(Function.prototype, {

    bind: function(self) {
    
        var f = this,
            args = slice.call(arguments, 1),
            noargs = (args.length === 0);
        
        bound.prototype = f.prototype;
        return bound;
        
        function bound() {
        
            return f.apply(
                this instanceof bound ? this : self, 
                noargs ? arguments : args.concat(slice.call(arguments, 0)));
        }
    }
});

// Add ES5 Date extras
addKeys(Date, {

    now: function() { return (new Date()).getTime(); }
});

// Add ES5 Date extras
addKeys(Date.prototype, {

    toISOString: function() {
    
        function pad(s) {
        
            if ((s = "" + s).length === 1) s = "0" + s;
            return s;
        }
        
        return this.getUTCFullYear() + "-" +
            pad(this.getUTCMonth() + 1, 2) + "-" +
            pad(this.getUTCDate(), 2) + "T" +
            pad(this.getUTCHours(), 2) + ":" +
            pad(this.getUTCMinutes(), 2) + ":" +
            pad(this.getUTCSeconds(), 2) + "Z";
    },
    
    toJSON: function() {
    
        return this.toISOString();
    }
});

// Add ISO support to Date.parse
if (Date.parse(new Date(0).toISOString()) !== 0) !function() {

    /*
    
    In ES5 the Date constructor will also parse ISO dates, but overwritting 
    the Date function itself is too far.  Note that new Date(isoDateString)
    is not backward-compatible.  Use the following instead:
    
    new Date(Date.parse(dateString));
    
    1: +/- year
    2: month
    3: day
    4: hour
    5: minute
    6: second
    7: fraction
    8: +/- tz hour
    9: tz minute
    
    */
    
    var isoRE = /^(?:((?:[+-]d{2})?d{4})(?:-(d{2})(?:-(d{2}))?)?)?(?:T(d{2}):(d{2})(?::(d{2})(?:.d{3})?)?)?(?:Z|([-+]d{2}):(d{2}))?$/,
        dateParse = Date.parse;

    Date.parse = function(s) {
    
        var t, m, hasDate, i, offset;
        
        if (!isNaN(t = dateParse(s)))
            return t;
        
        if (s && (m = isoRE.exec(s))) {
        
            hasDate = m[1] !== undefined;
            
            // Convert matches to numbers (month and day default to 1)
            for (i = 1; i <= 9; ++i)
                m[i] = Number(m[i] || (i <= 3 ? 1 : 0));
            
            // Calculate ms directly if no date is provided
            if (!hasDate)
                return ((m[4] * 60 + m[5]) * 60 + m[6]) * 1000 + m[7];
            
            // Convert month to zero-indexed
            m[2] -= 1;
            
            // Get TZ offset
            offset = (m[8] * 60 + m[9]) * 60 * 1000;
            
            // Remove full match from array
            m.shift();
            
            t = Date.UTC.apply(this, m) + offset;
        }
        
        return t;
    };
            
}();


}).call(this);

(function() {

var HOP = Object.prototype.hasOwnProperty,
    STATIC = /^__static_/;

// Returns true if the object has the specified property
function hasOwn(obj, name) {

    return HOP.call(obj, name);
}

// Returns true if the object has the specified property in
// its prototype chain
function has(obj, name) {

    for (; obj; obj = Object.getPrototypeOf(obj))
        if (HOP.call(obj, name))
            return true;
    
    return false;
}

// Iterates over the descriptors for each own property of an object
function forEachDesc(obj, fn) {

    var names = Object.getOwnPropertyNames(obj), i;
    
    for (i = 0; i < names.length; ++i)
        fn(names[i], Object.getOwnPropertyDescriptor(obj, names[i]));
    
    if (Object.getOwnPropertySymbols) {
    
        names = Object.getOwnPropertySymbols(obj);
        
        for (i = 0; i < names.length; ++i)
            fn(names[i], Object.getOwnPropertyDescriptor(obj, names[i]));
    }
    
    return obj;
}

// Performs copy-based inheritance
function inherit(to, from) {

    for (; from; from = Object.getPrototypeOf(from)) {
    
        forEachDesc(from, (function(name, desc) {
        
            if (!has(to, name))
                Object.defineProperty(to, name, desc);
        }));
    }
    
    return to;
}

function defineMethods(to, from) {

    forEachDesc(from, (function(name, desc) {
    
        if (typeof name !== "string" || !STATIC.test(name))
            Object.defineProperty(to, name, desc);
    }));
}

function defineStatic(to, from) {

    forEachDesc(from, (function(name, desc) {
    
        if (typeof name === "string" &&
            STATIC.test(name) && 
            typeof desc.value === "object" && 
            desc.value) {
            
            defineMethods(to, desc.value);
        }
    }));
}

function Class(base, def) {

    var parent;
    
    if (def === void 0) {
    
        // If no base class is specified, then Object.prototype
        // is the parent prototype
        def = base;
        base = null;
        parent = Object.prototype;
    
    } else if (base === null) {
    
        // If the base is null, then then then the parent prototype is null
        parent = null;
        
    } else if (typeof base === "function") {
    
        parent = base.prototype;
        
        // Prototype must be null or an object
        if (parent !== null && Object(parent) !== parent)
            parent = void 0;
    }
    
    if (parent === void 0)
        throw new TypeError();
    
    // Generate the method collection, closing over "__super"
    var proto = Object.create(parent),
        props = def(parent),
        constructor = props.constructor;
    
    if (!constructor)
        throw new Error("No constructor specified.");
    
    // Make constructor non-enumerable
    // if none is provided
    Object.defineProperty(props, "constructor", {
    
        enumerable: false,
        writable: true,
        configurable: true,
        value: constructor
    });
    
    // Set prototype methods
    defineMethods(proto, props);
    
    // Set constructor's prototype
    constructor.prototype = proto;
    
    // Set class "static" methods
    defineStatic(constructor, props);
    
    // "Inherit" from base constructor
    if (base) inherit(constructor, base);
    
    return constructor;
}

this.es6now.Class = Class;


}).call(this);

(function() {

var global = this, 
    arraySlice = Array.prototype.slice,
    toString = Object.prototype.toString;

// === Symbols ===

var symbolCounter = 0;

function fakeSymbol() {

    return "__$" + Math.floor(Math.random() * 1e9) + "$" + (++symbolCounter) + "$__";
}

// NOTE:  As of Node 0.11.12, V8's Symbol implementation is a little wonky.
// There is no Object.getOwnPropertySymbols, so reflection doesn't seem to
// work like it should.  Furthermore, Node blows up when trying to inspect
// Symbol objects.  We expect to replace this override when V8's symbols
// catch up with the ES6 specification.

this.Symbol = fakeSymbol;

Symbol.iterator = Symbol("iterator");

this.es6now.iterator = function(obj) {

    if (global.Symbol && Symbol.iterator && obj[Symbol.iterator] !== void 0)
        return obj[Symbol.iterator]();
    
    if (Array.isArray(obj))
        return obj.values();
    
    return obj;
};

this.es6now.computed = function(obj) {

    var name, desc, i;
    
    for (i = 1; i < arguments.length; ++i) {
    
        name = "__$" + (i - 1);
        desc = Object.getOwnPropertyDescriptor(obj, name);
        
        if (!desc)
            continue;
        
        Object.defineProperty(obj, arguments[i], desc);
        delete obj[name];
    }
    
    return obj;
};

this.es6now.rest = function(args, pos) {

    return arraySlice.call(args, pos);
};

function eachKey(obj, fn) {

    var keys = Object.getOwnPropertyNames(obj),
        i;
    
    for (i = 0; i < keys.length; ++i)
        fn(keys[i]);
    
    if (!Object.getOwnPropertySymbols)
        return;
    
    keys = Object.getOwnPropertySymbols(obj);
    
    for (i = 0; i < keys.length; ++i)
        fn(keys[i]);
}

function addMethods(obj, methods) {

    eachKey(methods, (function(key) {
    
        if (key in obj)
            return;
        
        Object.defineProperty(obj, key, {
        
            value: methods[key],
            configurable: true,
            enumerable: false,
            writable: true
        });
    }));
}


// === Object ===

addMethods(Object, {

    is: function(left, right) {
    
        if (left === right)
            return left !== 0 || 1 / left === 1 / right;
        
        return left !== left && right !== right;
    },
    
    assign: function(target, source) {
    
        Object.keys(source).forEach((function(key) { return target[key] = source[key]; }));
        return target;
    }
    
});

// === Number ===

addMethods(Number, {

    EPSILON: ((function($) {
    
        var next, result;
        
        for (next = 1; 1 + next !== 1; next = next / 2)
            result = next;
        
        return result;
        
    }))(),
    
    MAX_SAFE_INTEGER: 9007199254740992,
    
    MIN_SAFE_INTEGER: -9007199254740991,
    
    isInteger: function(val) {
    
        typeof val === "number" && val | 0 === val;
    }
    
    // TODO: isSafeInteger
    
});

// === String === 

addMethods(String, {

    raw: function(callsite) { var args = es6now.rest(arguments, 1);
    
        var raw = callsite.raw,
            len = raw.length >>> 0;
        
        if (len === 0)
            return "";
            
        var s = "", i = 0;
        
        while (true) {
        
            s += raw[i];
        
            if (i + 1 === len)
                return s;
        
            s += args[i++];
        }
    }
    
    // TODO:  fromCodePoint
    
});

addMethods(String.prototype, {
    
    repeat: function(count) {
    
        if (this == null)
            throw TypeError();
        
        var n = count ? Number(count) : 0;
        
        if (isNaN(n))
            n = 0;
        
        // Account for out-of-bounds indices
        if (n < 0 || n == Infinity)
            throw RangeError();
        
        if (n == 0)
            return "";
            
        var result = "";
        
        while (n--)
            result += this;
        
        return result;
    },
    
    startsWith: function(search) {
    
        var string = String(this);
        
        if (this == null || toString.call(search) == "[object RegExp]")
            throw TypeError();
            
        var stringLength = this.length,
            searchString = String(search),
            searchLength = searchString.length,
            position = arguments.length > 1 ? arguments[1] : undefined,
            pos = position ? Number(position) : 0;
            
        if (isNaN(pos))
            pos = 0;
        
        var start = Math.min(Math.max(pos, 0), stringLength);
        
        return this.indexOf(searchString, pos) == start;
    },
    
    endsWith: function(search) {
    
        if (this == null || toString.call(search) == '[object RegExp]')
            throw TypeError();
        
        var stringLength = this.length,
            searchString = String(search),
            searchLength = searchString.length,
            pos = stringLength;
        
        if (arguments.length > 1) {
        
            var position = arguments[1];
        
            if (position !== undefined) {
        
                pos = position ? Number(position) : 0;
                
                if (isNaN(pos))
                    pos = 0;
            }
        }
        
        var end = Math.min(Math.max(pos, 0), stringLength),
            start = end - searchLength;
        
        if (start < 0)
            return false;
            
        return this.lastIndexOf(searchString, start) == start;
    },
    
    contains: function(search) {
    
        if (this == null)
            throw TypeError();
            
        var stringLength = this.length,
            searchString = String(search),
            searchLength = searchString.length,
            position = arguments.length > 1 ? arguments[1] : undefined,
            pos = position ? Number(position) : 0;
        
        if (isNaN(pos))
            pos = 0;
            
        var start = Math.min(Math.max(pos, 0), stringLength);
        
        return this.indexOf(string, searchString, pos) != -1;
    }
    
    // TODO: codePointAt
    
});

// === Array ===

var ArrayIterator = es6now.Class(function(__super) { return es6now.computed({

    constructor: function ArrayIterator(array, kind) {
    
        this.array = array;
        this.current = 0;
        this.kind = kind;
    },
    
    next: function() {
    
        var length = this.array.length >>> 0,
            index = this.current;
        
        if (index >= length) {
        
            this.current = Infinity;
            return { value: void 0, done: true };
        }
        
        this.current += 1;
        
        switch (this.kind) {
        
            case "values":
                return { value: this.array[index], done: false };
            
            case "entries":
                return { value: [ index, this.array[index] ], done: false };
            
            default:
                return { value: index, done: false };
        }
    },
    
    __$0: function() { return this }

}, Symbol.iterator) });

addMethods(Array.prototype, es6now.computed({

    values: function() { return new ArrayIterator(this, "values") },
    entries: function() { return new ArrayIterator(this, "entries") },
    keys: function() { return new ArrayIterator(this, "keys") },
    __$0: function() { return this.values() }
}, Symbol.iterator));


}).call(this);

(function() { var __this = this;

var enqueueMicrotask = ((function($) {

    var window = __this.window,
        process = __this.process,
        msgChannel = null,
        list = [];
    
    if (typeof setImmediate === "function") {
    
        return window ?
            window.setImmediate.bind(window) :
            setImmediate;
    
    } else if (process && typeof process.nextTick === "function") {
    
        return process.nextTick;
        
    } else if (window && window.MessageChannel) {
        
        msgChannel = new window.MessageChannel();
        msgChannel.port1.onmessage = (function($) { if (list.length) list.shift()(); });
    
        return (function(fn) {
        
            list.push(fn);
            msgChannel.port2.postMessage(0);
        });
    }
    
    return (function(fn) { return setTimeout(fn, 0); });

}))();

// The following property names are used to simulate the internal data
// slots that are defined for Promise objects.

var $status = "Promise#status",
    $value = "Promise#value",
    $onResolve = "Promise#onResolve",
    $onReject = "Promise#onReject";

// The following property name is used to simulate the built-in symbol @@isPromise
var $$isPromise = "@@isPromise";

function isPromise(x) { 

    return !!x && $$isPromise in Object(x);
}

function promiseDefer(ctor) {

    var d = {};

    d.promise = new ctor((function(resolve, reject) {
        d.resolve = resolve;
        d.reject = reject;
    }));

    return d;
}

function promiseChain(promise, onResolve, onReject) {

    if (typeof onResolve !== "function") onResolve = (function(x) { return x; });
    if (typeof onReject !== "function") onReject = (function(e) { throw e });

    var deferred = promiseDefer(promise.constructor);
    
    if (typeof promise[$status] !== "string")
        throw new TypeError("Promise method called on a non-promise");

    switch (promise[$status]) {

        case "pending":
            promise[$onResolve].push([deferred, onResolve]);
            promise[$onReject].push([deferred, onReject]);
            break;

        case "resolved":
            promiseReact(deferred, onResolve, promise[$value]);
            break;
    
        case "rejected":
            promiseReact(deferred, onReject, promise[$value]);
            break;
    }

    return deferred.promise;
}

function promiseResolve(promise, x) {
    
    promiseDone(promise, "resolved", x, promise[$onResolve]);
}

function promiseReject(promise, x) {
    
    promiseDone(promise, "rejected", x, promise[$onReject]);
}

function promiseDone(promise, status, value, reactions) {

    if (promise[$status] !== "pending") 
        return;
        
    promise[$status] = status;
    promise[$value] = value;
    promise[$onResolve] = promise[$onReject] = void 0;
    
    for (var i = 0; i < reactions.length; ++i) 
        promiseReact(reactions[i][0], reactions[i][1], value);
}

function promiseUnwrap(deferred, x) {

    if (x === deferred.promise)
        throw new TypeError("Promise cannot wrap itself");
    
    if (isPromise(x))
        promiseChain(x, deferred.resolve, deferred.reject);
    else
        deferred.resolve(x);
}

function promiseReact(deferred, handler, x) {

    enqueueMicrotask((function($) {
    
        try { promiseUnwrap(deferred, handler(x)) } 
        catch(e) { try { deferred.reject(e) } catch (e) { } }
    }));
}

var Promise = es6now.Class(function(__super) { return {

    constructor: function Promise(init) { var __this = this;
    
        if (typeof init !== "function")
            throw new TypeError("Promise constructor called without initializer");
        
        this[$value] = void 0;
        this[$status] = "pending";
        this[$onResolve] = [];
        this[$onReject] = [];
    
        var resolve = (function(x) { return promiseResolve(__this, x); }),
            reject = (function(r) { return promiseReject(__this, r); });
        
        try { init(resolve, reject) } catch (x) { reject(x) }
    },
    
    chain: function(onResolve, onReject) {
    
        return promiseChain(this, onResolve, onReject);
    },
    
    then: function(onResolve, onReject) {

        if (typeof onResolve !== "function") onResolve = (function(x) { return x; });
        
        return promiseChain(this, (function(x) {
    
            if (x && typeof x === "object") {
            
                var maybeThen = x.then;
                
                if (typeof maybeThen === "function")
                    return maybeThen.call(x, onResolve, onReject);
            }
                        
            return onResolve(x);
        
        }), onReject);
        
    },
    
    catch: function(onReject) {
    
        return this.then(void 0, onReject);
    },
    
    __static_0: { isPromise: function(x) {
        
        return isPromise(x);
    } },
    
    __static_1: { defer: function() {
    
        return promiseDefer(this);
    } },
    
    __static_2: { accept: function(x) {
    
        var d = promiseDefer(this);
        d.resolve(x);
        return d.promise;
    } },
    
    __static_3: { resolve: function(x) { 
    
        if (isPromise(x))
            return x;
            
        var d = promiseDefer(this);
        d.resolve(x);
        return d.promise;
    } },
    
    __static_4: { reject: function(x) { 
    
        var d = promiseDefer(this);
        d.reject(x);
        return d.promise;
    } },

    __static_5: { all: function(values) {

        // TODO: We should be getting an iterator from values
        
        var deferred = promiseDefer(this),
            count = values.length,
            resolutions = [];
            
        try {
        
            if (!Array.isArray(values))
                throw new Error("Invalid argument");
        
            var count = values.length;
        
            if (count === 0) {
        
                deferred.resolve(resolutions);
            
            } else {
        
                for (var i = 0; i < values.length; ++i)
                    this.resolve(values[i]).then(onResolve(i), deferred.reject);
            }
            
        } catch(x) { deferred.reject(x) }
        
        return deferred.promise;
        
        function onResolve(i) {
    
            return (function(x) {
        
                resolutions[i] = x;
            
                if (--count === 0)
                    deferred.resolve(resolutions);
            });
        }
    } },
    
    __static_6: { race: function(values) {
    
        // TODO: We should be getting an iterator from values
        
        var deferred = promiseDefer(this);
        
        try {
        
            if (!Array.isArray(values))
                throw new Error("Invalid argument");
            
            for (var i = 0; i < values.length; ++i)
                this.resolve(values[i]).then(deferred.resolve, deferred.reject);
        
        } catch(x) { deferred.reject(x) }
        
        return deferred.promise;
    } }
    
} });

Promise.prototype[$$isPromise] = true;

this.Promise = Promise;


}).call(this);

(function() {

this.es6now.async = function(iterable) {
    
    var iter = es6now.iterator(iterable),
        resolver,
        promise;
    
    promise = new Promise((function(resolve, reject) { return resolver = { resolve: resolve, reject: reject }; }));
    resume(void 0, false);
    return promise;
    
    function resume(value, error) {
    
        if (error && !("throw" in iter))
            return resolver.reject(value);
        
        try {
        
            // Invoke the iterator/generator
            var result = error ? iter.throw(value) : iter.next(value),
                value = result.value,
                done = result.done;
            
            if (Promise.isPromise(value)) {

                if (done) value.chain(resolver.resolve, resolver.reject);
                else      value.chain((function(x) { return resume(x, false); }), (function(x) { return resume(x, true); }));
            
            } else if (done) {
                
                resolver.resolve(value);
                
            } else {
            
                resume(value, false);
            }
            
        } catch (x) { resolver.reject(x) }
        
    }
};


}).call(this);

var AST_ = (function(exports) {

/*

NOTE:  For auto-documentation purposes, the following conventions must be followed:

1)  The last parameters to each constructor function must always be "start"
    and "end", in that order.

2)  With the exception of "start" and "end", the order of constructor parameters
    must be identical to the order of property assignments within the constructor.

*/
var AST = {
    
    Node: function(type, start, end) {

        this.type = type; // (string) The node type
        this.start = start;
        this.end = end;
    },
    
    Identifier: function(value, context, start, end) { 

        this.type = "Identifier";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The string value of the identifier
        this.context = context; // (string) The context in which the identifier appears ("", "variable", "declaration")
    },

    // A number literal
    NumberLiteral: function(value, start, end) {
    
        this.type = "NumberLiteral";
        this.start = start;
        this.end = end;
        this.value = value; // (number) The mathmatical value of the number literal
    },

    // A string literal
    StringLiteral: function(value, start, end) {

        this.type = "StringLiteral";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The value of the string literal
    },

    TemplatePart: function(value, isEnd, start, end) {
    
        this.type = "TemplatePart";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The string value of the template fragment
        this.templateEnd = isEnd; // (boolean) True if this template fragment terminates the template literal
    },

    RegularExpression: function(value, flags, start, end) {
    
        this.type = "RegularExpression";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The raw value of the regular expression literal
        this.flags = flags; // (string) The set of flags for the regular expression literal
    },

    BooleanLiteral: function(value, start, end) {
    
        this.type = "BooleanLiteral";
        this.start = start;
        this.end = end;
        this.value = value; // (boolean) The value of the boolean literal
    },
    
    NullLiteral: function(start, end) { 

        this.type = "NullLiteral";
        this.start = start;
        this.end = end;
    },

    Script: function(statements, start, end) {
    
        this.type = "Script";
        this.start = start;
        this.end = end;
        this.statements = statements; // [Node] A list of statements
    },

    Module: function(statements, start, end) {

        this.type = "Module";
        this.start = start;
        this.end = end;
        this.statements = statements; // [Node] A list of statements
    },

    ThisExpression: function(start, end) { 

        this.type = "ThisExpression";
        this.start = start;
        this.end = end;
    },

    SuperExpression: function(start, end) { 

        this.type = "SuperExpression";
        this.start = start;
        this.end = end;
    },

    SequenceExpression: function(list, start, end) {

        this.type = "SequenceExpression";
        this.start = start;
        this.end = end;
        this.expressions = list; // [Node] A list of expressions
    },

    AssignmentExpression: function(op, left, right, start, end) {
    
        this.type = "AssignmentExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) An assignment operator
        this.left = left; // The left-hand-side of the assignment operator
        this.right = right; // The right-hand-side of the assignment operator
    },

    SpreadExpression: function(expr, start, end) {
    
        this.type = "SpreadExpression";
        this.start = start;
        this.end = end;
        this.expression = expr; // An expression
    },

    YieldExpression: function(expr, delegate, start, end) {
    
        this.type = "YieldExpression";
        this.start = start;
        this.end = end;
        this.delegate = delegate; // (boolean) True if the yield expression is delegating
        this.expression = expr; // An expression
    },

    ConditionalExpression: function(test, cons, alt, start, end) {
    
        this.type = "ConditionalExpression";
        this.start = start;
        this.end = end;
        this.test = test; // A test expression
        this.consequent = cons; // The expression evaluated if the test passes
        this.alternate = alt; // The expression evaluated if the test fails
    },

    BinaryExpression: function(op, left, right, start, end) {
    
        this.type = "BinaryExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) A binary operator
        this.left = left; // The left operand expression
        this.right = right; // The right operand expression
    },

    UpdateExpression: function(op, expr, prefix, start, end) {
    
        this.type = "UpdateExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) An update operator
        this.expression = expr; // An expression
        this.prefix = prefix; // (boolean) True if the operator is a prefix
    },

    UnaryExpression: function(op, expr, start, end) {
    
        this.type = "UnaryExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) A unary operator
        this.expression = expr; // An expression
    },

    MemberExpression: function(obj, prop, computed, start, end) {
    
        this.type = "MemberExpression";
        this.start = start;
        this.end = end;
        this.object = obj; // An expression evaulating to an object
        this.property = prop; // An expression evaluating to a property name
        this.computed = computed; // (boolean) True if the property name is computed
    },

    CallExpression: function(callee, args, start, end) {
    
        this.type = "CallExpression";
        this.start = start;
        this.end = end;
        this.callee = callee; // An expression
        this.arguments = args; // [Node] A list of call arguments
    },

    TaggedTemplateExpression: function(tag, template, start, end) {
    
        this.type = "TaggedTemplateExpression";
        this.start = start;
        this.end = end;
        this.tag = tag; // The template tag
        this.template = template; // (TemplateExpression) A template
    },

    NewExpression: function(callee, args, start, end) {
    
        this.type = "NewExpression";
        this.start = start;
        this.end = end;
        this.callee = callee; // An expression
        this.arguments = args; // [Node] A list of call arguments
    },

    ParenExpression: function(expr, start, end) {
    
        this.type = "ParenExpression";
        this.start = start;
        this.end = end;
        this.expression = expr; // An expression contained within parenthesis
    },

    ObjectLiteral: function(props, start, end) {
    
        this.type = "ObjectLiteral";
        this.start = start;
        this.end = end;
        this.properties = props; // [PropertyDefinition|MethodDefinition] A list of properties and methods defined in the object literal
    },

    ComputedPropertyName: function(expr, start, end) {
    
        this.type = "ComputedPropertyName";
        this.start = start;
        this.end = end;
        this.expression = expr; // An expression
    },

    PropertyDefinition: function(name, expr, start, end) {
    
        this.type = "PropertyDefinition";
        this.start = start;
        this.end = end;
        this.name = name; // (StringLiteral|NumberLiteral|Identifier|ComputedPropertyName) The property name
        this.expression = expr; // (Node?) An expression
    },

    ObjectPattern: function(props, start, end) {
        
        this.type = "ObjectPattern";
        this.start = start;
        this.end = end;
        this.properties = props; // [PatternProperty] A list of destructuring pattern properties
    },
    
    PatternProperty: function(name, pattern, initializer, start, end) {
    
        this.type = "PatternProperty";
        this.start = start;
        this.end = end;
        this.name = name; // The destructuring property name
        this.pattern = pattern; // (Node?) A destructuring target pattern
        this.initializer = initializer; // (Node?) A default initializer expression
    },

    ArrayPattern: function(elements, start, end) {
    
        this.type = "ArrayPattern";
        this.start = start;
        this.end = end;
        this.elements = elements; // [PatternElement|PatternRestElement] A list of of destructuring pattern elements
    },
    
    PatternElement: function(pattern, initializer, start, end) {
    
        this.type = "PatternElement";
        this.start = start;
        this.end = end;
        this.pattern = pattern; // A destructuring target pattern
        this.initializer = initializer; // (Node?) A default initializer expression
    },
    
    PatternRestElement: function(pattern, start, end) {
    
        this.type = "PatternRestElement";
        this.start = start;
        this.end = end;
        this.pattern = pattern; // A destructuring target
    },

    MethodDefinition: function(kind, name, params, body, start, end) {
    
        this.type = "MethodDefinition";
        this.start = start;
        this.end = end;
        this.kind = kind; // (string) The type of method
        this.name = name; // The method name
        this.params = params; // [FormalParameter] A list of formal parameters
        this.body = body; // (FunctionBody) The function body
    },

    ArrayLiteral: function(elements, start, end) {
    
        this.type = "ArrayLiteral";
        this.start = start;
        this.end = end;
        this.elements = elements; // [Node|null]
    },

    ArrayComprehension: function(qualifiers, expr, start, end) {
    
        this.type = "ArrayComprehension";
        this.start = start;
        this.end = end;
        this.qualifiers = qualifiers;
        this.expression = expr;
    },

    GeneratorComprehension: function(qualifiers, expr, start, end) {
    
        this.type = "GeneratorComprehension";
        this.start = start;
        this.end = end;
        this.qualifiers = qualifiers;
        this.expression = expr;
    },

    ComprehensionFor: function(left, right, start, end) {
    
        this.type = "ComprehensionFor";
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
    },

    ComprehensionIf: function(test, start, end) {
    
        this.type = "ComprehensionIf";
        this.start = start;
        this.end = end;
        this.test = test;
    },

    TemplateExpression: function(lits, subs, start, end) {
    
        this.type = "TemplateExpression";
        this.start = start;
        this.end = end;
        this.literals = lits;
        this.substitutions = subs;
    },

    Block: function(statements, start, end) {
    
        this.type = "Block";
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    LabelledStatement: function(label, statement, start, end) {
    
        this.type = "LabelledStatement";
        this.start = start;
        this.end = end;
        this.label = label;
        this.statement = statement;
    },

    ExpressionStatement: function(expr, start, end) {
    
        this.type = "ExpressionStatement";
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    EmptyStatement: function(start, end) { 

        this.type = "EmptyStatement";
        this.start = start;
        this.end = end;
    },

    VariableDeclaration: function(kind, list, start, end) {
    
        this.type = "VariableDeclaration";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.declarations = list;
    },

    VariableDeclarator: function(pattern, initializer, start, end) {
    
        this.type = "VariableDeclarator";
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    ReturnStatement: function(arg, start, end) {
    
        this.type = "ReturnStatement";
        this.start = start;
        this.end = end;
        this.argument = arg;
    },

    BreakStatement: function(label, start, end) {
    
        this.type = "BreakStatement";
        this.start = start;
        this.end = end;
        this.label = label;
    },

    ContinueStatement: function(label, start, end) {
    
        this.type = "ContinueStatement";
        this.start = start;
        this.end = end;
        this.label = label;
    },

    ThrowStatement: function(expr, start, end) {
    
        this.type = "ThrowStatement";
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    DebuggerStatement: function(start, end) {
    
        this.type = "DebuggerStatement";
        this.start = start;
        this.end = end;
    },

    IfStatement: function(test, cons, alt, start, end) {
    
        this.type = "IfStatement";
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    },

    DoWhileStatement: function(body, test, start, end) {
    
        this.type = "DoWhileStatement";
        this.start = start;
        this.end = end;
        this.body = body;
        this.test = test;
    },

    WhileStatement: function(test, body, start, end) {
    
        this.type = "WhileStatement";
        this.start = start;
        this.end = end;
        this.test = test;
        this.body = body;
    },

    ForStatement: function(initializer, test, update, body, start, end) {
    
        this.type = "ForStatement";
        this.start = start;
        this.end = end;
        this.initializer = initializer;
        this.test = test;
        this.update = update;
        this.body = body;
    },

    ForInStatement: function(left, right, body, start, end) {
    
        this.type = "ForInStatement";
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
        this.body = body;
    },

    ForOfStatement: function(left, right, body, start, end) {
    
        this.type = "ForOfStatement";
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
        this.body = body;
    },

    WithStatement: function(object, body, start, end) {
    
        this.type = "WithStatement";
        this.start = start;
        this.end = end;
        this.object = object;
        this.body = body;
    },

    SwitchStatement: function(desc, cases, start, end) {
    
        this.type = "SwitchStatement";
        this.start = start;
        this.end = end;
        this.descriminant = desc;
        this.cases = cases;
    },

    SwitchCase: function(test, cons, start, end) {
    
        this.type = "SwitchCase";
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
    },

    TryStatement: function(block, handler, fin, start, end) {
    
        this.type = "TryStatement";
        this.start = start;
        this.end = end;
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
    },

    CatchClause: function(param, body, start, end) {
    
        this.type = "CatchClause";
        this.start = start;
        this.end = end;
        this.param = param;
        this.body = body;
    },

    FunctionDeclaration: function(kind, identifier, params, body, start, end) {
    
        this.type = "FunctionDeclaration";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    },

    FunctionExpression: function(kind, identifier, params, body, start, end) {
    
        this.type = "FunctionExpression";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    },

    FormalParameter: function(pattern, initializer, start, end) {
    
        this.type = "FormalParameter";
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    RestParameter: function(identifier, start, end) {
    
        this.type = "RestParameter";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
    },

    FunctionBody: function(statements, start, end) {
    
        this.type = "FunctionBody";
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    ArrowFunctionHead: function(params, start, end) {
    
        this.type = "ArrowFunctionHead";
        this.start = start;
        this.end = end;
        this.parameters = params;
    },

    ArrowFunction: function(kind, params, body, start, end) {
    
        this.type = "ArrowFunction";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.params = params;
        this.body = body;
    },

    ClassDeclaration: function(identifier, base, body, start, end) {
    
        this.type = "ClassDeclaration";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    },

    ClassExpression: function(identifier, base, body, start, end) {
    
        this.type = "ClassExpression";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    },

    ClassBody: function(elems, start, end) {
    
        this.type = "ClassBody";
        this.start = start;
        this.end = end;
        this.elements = elems;
    },

    ClassElement: function(isStatic, method, start, end) {
    
        this.type = "ClassElement";
        this.start = start;
        this.end = end;
        this.static = isStatic;
        this.method = method;
    },
    
    ModuleDeclaration: function(identifier, body, start, end) {
    
        this.type = "ModuleDeclaration";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.body = body;
    },

    ModuleBody: function(statements, start, end) {
    
        this.type = "ModuleBody";
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    ModuleImport: function(identifier, from, start, end) {
    
        this.type = "ModuleImport";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.from = from;
    },

    ModuleAlias: function(identifier, path, start, end) {
    
        this.type = "ModuleAlias";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.path = path;
    },

    ImportDefaultDeclaration: function(ident, from, start, end) {
    
        this.type = "ImportDefaultDeclaration";
        this.start = start;
        this.end = end;
        this.identifier = ident;
        this.from = from;
    },

    ImportDeclaration: function(specifiers, from, start, end) {
    
        this.type = "ImportDeclaration";
        this.start = start;
        this.end = end;
        this.specifiers = specifiers;
        this.from = from;
    },

    ImportSpecifier: function(imported, local, start, end) {
    
        this.type = "ImportSpecifier";
        this.start = start;
        this.end = end;
        this.imported = imported;
        this.local = local;
    },

    ExportDeclaration: function(declaration, start, end) {
    
        this.type = "ExportDeclaration";
        this.start = start;
        this.end = end;
        this.declaration = declaration;
    },

    ExportsList: function(list, from, start, end) {
    
        this.type = "ExportsList";
        this.start = start;
        this.end = end;
        this.specifiers = list;
        this.from = from;
    },

    ExportSpecifier: function(local, exported, start, end) {
    
        this.type = "ExportSpecifier";
        this.start = start;
        this.end = end;
        this.local = local;
        this.exported = exported;
    },

    ModulePath: function(list, start, end) {
    
        this.type = "ModulePath";
        this.start = start;
        this.end = end;
        this.elements = list;
    }

};

function isNode(x) {

    return x !== null && typeof x === "object" && typeof x.type === "string";
}

var NodeBase = es6now.Class(function(__super) { return {

    children: function() { var __this = this;
    
        var list = [];
        
        Object.keys(this).forEach((function(k) {
        
            // Don't iterate over backlinks to parent node
            if (k === "parent")
                return;
            
            var value = __this[k];
            
            if (Array.isArray(value))
                value.forEach((function(x) { if (isNode(x)) list.push(x) }));
            else if (isNode(value))
                list.push(value);
        }));
        
        return list;
    }, constructor: function NodeBase() {}
} });

Object.keys(AST).forEach((function(k) { return AST[k].prototype = NodeBase.prototype; }));


exports.AST = AST; return exports; }).call(this, {});

var Scanner_ = (function(exports) {

// Unicode 6.2.0 | 2012-05-23, 20:34:59 GMT [MD]
var identifierStart = /[\x24\x41-\x5A\x5F\x61-\x7A\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    identifierPart = /[\x24\x30-\x39\x41-\x5A\x5F\x61-\x7A\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u036F\u0370-\u0374\u0376-\u0377\u037A-\u037D\u0386\u0387\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u064A\u064B-\u0669\u066E-\u066F\u0670\u0671-\u06D3\u06D5\u06D6-\u06DC\u06DF-\u06E4\u06E5-\u06E6\u06E7-\u06E8\u06EA-\u06ED\u06EE-\u06EF\u06F0-\u06F9\u06FA-\u06FC\u06FF\u0710\u0711\u0712-\u072F\u0730-\u074A\u074D-\u07A5\u07A6-\u07B0\u07B1\u07C0-\u07C9\u07CA-\u07EA\u07EB-\u07F3\u07F4-\u07F5\u07FA\u0800-\u0815\u0816-\u0819\u081A\u081B-\u0823\u0824\u0825-\u0827\u0828\u0829-\u082D\u0840-\u0858\u0859-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0903\u0904-\u0939\u093A-\u093C\u093D\u093E-\u094F\u0950\u0951-\u0957\u0958-\u0961\u0962-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC\u09BD\u09BE-\u09C4\u09C7-\u09C8\u09CB-\u09CD\u09CE\u09D7\u09DC-\u09DD\u09DF-\u09E1\u09E2-\u09E3\u09E6-\u09EF\u09F0-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A3C\u0A3E-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A71\u0A72-\u0A74\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABC\u0ABD\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE1\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3C\u0B3D\u0B3E-\u0B44\u0B47-\u0B48\u0B4B-\u0B4D\u0B56-\u0B57\u0B5C-\u0B5D\u0B5F-\u0B61\u0B62-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55-\u0C56\u0C58-\u0C59\u0C60-\u0C61\u0C62-\u0C63\u0C66-\u0C6F\u0C82-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC\u0CBD\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5-\u0CD6\u0CDE\u0CE0-\u0CE1\u0CE2-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF2\u0D02-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D4E\u0D57\u0D60-\u0D61\u0D62-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2-\u0DF3\u0E01-\u0E30\u0E31\u0E32-\u0E33\u0E34-\u0E3A\u0E40-\u0E46\u0E47-\u0E4E\u0E50-\u0E59\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB1\u0EB2-\u0EB3\u0EB4-\u0EB9\u0EBB-\u0EBC\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18-\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F3F\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F87\u0F88-\u0F8C\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u102A\u102B-\u103E\u103F\u1040-\u1049\u1050-\u1055\u1056-\u1059\u105A-\u105D\u105E-\u1060\u1061\u1062-\u1064\u1065-\u1066\u1067-\u106D\u106E-\u1070\u1071-\u1074\u1075-\u1081\u1082-\u108D\u108E\u108F-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1712-\u1714\u1720-\u1731\u1732-\u1734\u1740-\u1751\u1752-\u1753\u1760-\u176C\u176E-\u1770\u1772-\u1773\u1780-\u17B3\u17B4-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18A8\u18A9\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u194F\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C0\u19C1-\u19C7\u19C8-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A17-\u1A1B\u1A20-\u1A54\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B04\u1B05-\u1B33\u1B34-\u1B44\u1B45-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1B83-\u1BA0\u1BA1-\u1BAD\u1BAE-\u1BAF\u1BB0-\u1BB9\u1BBA-\u1BE5\u1BE6-\u1BF3\u1C00-\u1C23\u1C24-\u1C37\u1C40-\u1C49\u1C4D-\u1C4F\u1C50-\u1C59\u1C5A-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CE9-\u1CEC\u1CED\u1CEE-\u1CF1\u1CF2-\u1CF4\u1CF5-\u1CF6\u1D00-\u1DBF\u1DC0-\u1DE6\u1DFC-\u1DFF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C-\u200D\u203F-\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CEF-\u2CF1\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u3029\u302A-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309A\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA620-\uA629\uA62A-\uA62B\uA640-\uA66E\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F\uA6A0-\uA6EF\uA6F0-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA802\uA803-\uA805\uA806\uA807-\uA80A\uA80B\uA80C-\uA822\uA823-\uA827\uA840-\uA873\uA880-\uA881\uA882-\uA8B3\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8F2-\uA8F7\uA8FB\uA900-\uA909\uA90A-\uA925\uA926-\uA92D\uA930-\uA946\uA947-\uA953\uA960-\uA97C\uA980-\uA983\uA984-\uA9B2\uA9B3-\uA9C0\uA9CF\uA9D0-\uA9D9\uAA00-\uAA28\uAA29-\uAA36\uAA40-\uAA42\uAA43\uAA44-\uAA4B\uAA4C-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAAF\uAAB0\uAAB1\uAAB2-\uAAB4\uAAB5-\uAAB6\uAAB7-\uAAB8\uAAB9-\uAABD\uAABE-\uAABF\uAAC0\uAAC1\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAEB-\uAAEF\uAAF2-\uAAF4\uAAF5-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uABE3-\uABEA\uABEC-\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33-\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    whitespaceChars = /[\x09\x0B-\x0C\x20\xA0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\uFEFF]/;

var identifierEscape = /\\u([0-9a-fA-F]{4})/g,
    newlineSequence = /\r\n?|[\n\u2028\u2029]/g;

// === Reserved Words ===
var reservedWord = new RegExp("^(?:" +
    "break|case|catch|class|const|continue|debugger|default|delete|do|" +
    "else|enum|export|extends|false|finally|for|function|if|import|in|" +
    "instanceof|new|null|return|super|switch|this|throw|true|try|typeof|" +
    "var|void|while|with" +
")$");

// === Punctuators ===
var multiCharPunctuator = new RegExp("^(?:" +
    "--|[+]{2}|" +
    "&&|[|]{2}|" +
    "<<=?|" +
    ">>>?=?|" +
    "[!=]==|" +
    "=>|" +
    "[\.]{2,3}|" +
    "[-+&|<>!=*&\^%\/]=" +
")$");

// === Miscellaneous Patterns ===
var octalEscape = /^(?:[0-3][0-7]{0,2}|[4-7][0-7]?)/,
    blockCommentPattern = /\r\n?|[\n\u2028\u2029]|\*\//g,
    hexChar = /[0-9a-f]/i;

// === Character type lookup table ===
function makeCharTable() {

    var table = [],
        i;
    
    for (i = 0; i < 128; ++i) table[i] = "";
    for (i = 65; i <= 90; ++i) table[i] = "identifier";
    for (i = 97; i <= 122; ++i) table[i] = "identifier";
    
    add("whitespace", "\t\v\f ");
    add("newline", "\r\n");
    add("decimal-digit", "123456789");
    add("punctuator-char", "{[]();,?:");
    add("punctuator", "<>+-*%&|^!~=");
    add("dot", ".");
    add("slash", "/");
    add("rbrace", "}");
    add("zero", "0");
    add("string", "'\"");
    add("template", "`");
    add("identifier", "$_\\");
    
    return table;
    
    function add(type, string) {
    
        string.split("").forEach((function(c) { return table[c.charCodeAt(0)] = type; }));
    }
}

var charTable = makeCharTable();

// Performs a binary search on an array
function binarySearch(array, val) {

    var right = array.length - 1,
        left = 0,
        mid,
        test;
    
    while (left <= right) {
        
        mid = (left + right) >> 1;
        test = array[mid];
        
        if (val === test)
            return mid;
        
        if (val < test) right = mid - 1;
        else left = mid + 1;
    }
    
    return left;
}

// Returns true if the character is a valid identifier part
function isIdentifierPart(c) {

    if (c > 127)
        return identifierPart.test(String.fromCharCode(c));
    
    return  c > 64 && c < 91 || 
            c > 96 && c < 123 ||
            c > 47 && c < 58 ||
            c === 36 ||
            c === 95 ||
            c === 92;
}

// Returns true if the specified character is a newline
function isNewlineChar(c) {

    switch (c) {
    
        case "\r":
        case "\n":
        case "\u2028":
        case "\u2029":
            return true;
    }
    
    return false;
}

// Returns true if the specified character can exist in a non-starting position
function isPunctuatorNext(c) {

    switch (c) {
    
        case "+":
        case "-":
        case "&":
        case "|":
        case "<":
        case ">":
        case "=":
        case ".":
            return true;
    }
    
    return false;
}

// Returns true if the specified character is a valid numeric following character
function isNumberFollow(c) {

    if (c > 127)
        return isNumberFollowUnicode(c);
    
    return !(
        c > 64 && c < 91 || 
        c > 96 && c < 123 ||
        c > 47 && c < 58 ||
        c === 36 ||
        c === 95 ||
        c === 92
    );
}

// Returns true if the specified character is a valid numeric following character
function isNumberFollowUnicode(c) {

    return !identifierStart.test(String.fromCharCode(c));
}

var Scanner = es6now.Class(function(__super) { return {

    constructor: function Scanner(input, offset) {

        this.input = input || "";
        this.offset = offset | 0;
        this.length = this.input.length;
        this.lines = [-1];
        this.lastLineBreak = -1;
        
        this.value = "";
        this.number = 0;
        this.regexFlags = "";
        this.templateEnd = false;
        this.newlineBefore = false;
        this.strictError = "";
        this.start = 0;
        this.end = 0;
    },
    
    skip: function() {
        
        return this.next("skip");
    },
    
    next: function(context) {

        if (this.type !== "COMMENT")
            this.newlineBefore = false;
        
        this.strictError = "";
        
        do {
        
            this.start = this.offset;
            
            this.type = 
                this.start >= this.length ? this.EOF() : 
                context === "skip" ? this.Skip() :
                this.Start(context);
        
        } while (!this.type);
        
        this.end = this.offset;
        
        return this.type;
    },
    
    raw: function(token) {
    
        return this.input.slice(token.start, token.end);
    },
    
    lineNumber: function(offset) {
    
        return binarySearch(this.lines, offset);
    },
    
    position: function(offset) {
    
        var line = this.lineNumber(offset),
            pos = this.lines[line - 1],
            column = offset - pos;
        
        return { line: line, column: column, lineOffset: pos + 1 };
    },
    
    addLineBreak: function(offset) {
    
        if (offset > this.lastLineBreak)
            this.lines.push(this.lastLineBreak = offset);
    },
    
    peekChar: function() {
    
        return this.input.charAt(this.offset);
    },
    
    peekCharAt: function(n) {
    
        return this.input.charAt(this.offset + n);
    },
    
    peekCode: function() {
    
        return this.input.charCodeAt(this.offset) | 0;
    },
    
    peekCodeAt: function(n) {
    
        return this.input.charCodeAt(this.offset + n) | 0;
    },
    
    readChar: function() {
    
        return this.input.charAt(this.offset++);
    },
    
    readUnicodeEscape: function() {
  
        var hex = "";
        
        if (this.peekChar() === "{") {
        
            this.offset++;
            hex = this.readHex(0);
            
            if (hex.length < 1 || this.readChar() !== "}")
                return null;
        
        } else {
        
            hex = this.readHex(4);
        
            if (hex.length < 4)
                return null;
        }
        
        var val = parseInt(hex, 16);
        
        if (val > 1114111)
            return null;
        
        return String.fromCharCode(val);
    },
    
    readOctalEscape: function() {
    
        var m = octalEscape.exec(this.input.slice(this.offset, this.offset + 3)),
            val = m ? m[0] : "";
        
        this.offset += val.length;
        
        return val;
    },
    
    readStringEscape: function() {
    
        this.offset++;
        
        var chr = "", 
            esc = "";
        
        switch (chr = this.readChar()) {
        
            case "t": return "\t";
            case "b": return "\b";
            case "v": return "\v";
            case "f": return "\f";
            case "r": return "\r";
            case "n": return "\n";
    
            case "\r":
            
                this.addLineBreak(this.offset - 1);
                
                if (this.peekChar() === "\n")
                    this.offset++;
                
                return "";
            
            case "\n":
            case "\u2028":
            case "\u2029":
            
                this.addLineBreak(this.offset - 1);
                return "";

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            
                this.offset--;
                esc = this.readOctalEscape();
                
                if (esc === "0") {
                
                    return String.fromCharCode(0);
                
                } else {
                
                    this.strictError = "Octal literals are not allowed in strict mode";
                    return String.fromCharCode(parseInt(esc, 8));
                }
            
            case "x":
            
                esc = this.readHex(2);
                return (esc.length < 2) ? null : String.fromCharCode(parseInt(esc, 16));
            
            case "u":
            
                return this.readUnicodeEscape();
            
            default: 
            
                return chr;
        }
    },
    
    readRange: function(low, high) {
    
        var start = this.offset,
            code = 0;
        
        while (code = this.peekCode()) {
        
            if (code >= low && code <= high) this.offset++;
            else break;
        }
        
        return this.input.slice(start, this.offset);
    },
    
    readInteger: function() {
    
        var start = this.offset,
            code = 0;
        
        while (code = this.peekCode()) {
        
            if (code >= 48 && code <= 57) this.offset++;
            else break;
        }
        
        return this.input.slice(start, this.offset);
    },
    
    readHex: function(maxLen) {
        
        var str = "", 
            chr = "";
        
        while (chr = this.peekChar()) {
        
            if (!hexChar.test(chr))
                break;
            
            str += chr;
            this.offset++;
            
            if (str.length === maxLen)
                break;
        }
        
        return str;
    },
    
    Skip: function() {
    
        var code = this.peekCode();
        
        if (code < 128) {
        
            switch (charTable[code]) {
        
                case "whitespace": return this.Whitespace(code);
            
                case "newline": return this.Newline(code);
            
                case "slash":
            
                    var next = this.peekCodeAt(1);

                    if (next === 47) return this.LineComment(code);       // /
                    else if (next === 42) return this.BlockComment(code); // *
            }
        
        } else {
        
            var chr = this.peekChar();
        
            // Unicode newlines
            if (isNewlineChar(chr))
                return this.Newline(code);
        
            // Unicode whitespace
            if (whitespaceChars.test(chr))
                return this.UnicodeWhitespace(code);
        }
        
        return "UNKNOWN";
    },
    
    Start: function(context) {
    
        var code = this.peekCode(), 
            next = 0;
        
        switch (charTable[code]) {
        
            case "punctuator-char": return this.PunctuatorChar();
            
            case "whitespace": return this.Whitespace();
            
            case "identifier": return this.Identifier(context);
            
            case "rbrace":
            
                if (context === "template") return this.Template();
                else return this.PunctuatorChar();
            
            case "punctuator": return this.Punctuator();
            
            case "newline": return this.Newline(code);
            
            case "decimal-digit": return this.Number();
            
            case "template": return this.Template();
            
            case "string": return this.String();
            
            case "zero": 
            
                switch (next = this.peekCodeAt(1)) {
                
                    case 88: case 120: return this.HexNumber();   // x
                    case 66: case 98: return this.BinaryNumber(); // b
                    case 79: case 111: return this.OctalNumber(); // o
                }
                
                return next >= 48 && next <= 55 ?
                    this.LegacyOctalNumber() :
                    this.Number();
            
            case "dot": 
            
                next = this.peekCodeAt(1);
                
                if (next >= 48 && next <= 57) return this.Number();
                else return this.Punctuator();
            
            case "slash":
            
                next = this.peekCodeAt(1);

                if (next === 47) return this.LineComment();       // /
                else if (next === 42) return this.BlockComment(); // *
                else if (context === "div") return this.Punctuator();
                else return this.RegularExpression();
            
        }
        
        var chr = this.peekChar();
        
        // Unicode newlines
        if (isNewlineChar(chr))
            return this.Newline(code);
        
        // Unicode whitespace
        if (whitespaceChars.test(chr))
            return this.UnicodeWhitespace();
        
        // Unicode identifier chars
        if (identifierStart.test(chr))
            return this.Identifier(context);
        
        return this.Error();
    },
    
    Whitespace: function() {
    
        this.offset++;
        
        var code = 0;
        
        while (code = this.peekCode()) {
        
            // ASCII Whitespace:  [\t] [\v] [\f] [ ] 
            if (code === 9 || code === 11 || code === 12 || code === 32)
                this.offset++;
            else
                break;
        }
        
        return "";
    },
    
    UnicodeWhitespace: function() {
    
        this.offset++;
        
        // General unicode whitespace
        while (whitespaceChars.test(this.peekChar()))
            this.offset++;
        
        return "";
    },
    
    Newline: function(code) {
        
        this.addLineBreak(this.offset++);
        
        // Treat /r/n as a single newline
        if (code === 13 && this.peekCode() === 10)
            this.offset++;
        
        this.newlineBefore = true;
        
        return "";
    },
    
    PunctuatorChar: function() {
    
        return this.readChar();
    },
    
    Punctuator: function() {
        
        var op = this.readChar(), 
            chr = "",
            next = "";
        
        while (
            isPunctuatorNext(chr = this.peekChar()) &&
            multiCharPunctuator.test(next = op + chr)) {
    
            this.offset++;
            op = next;
        }
        
        // ".." is not a valid token
        if (op === "..") {
        
            this.offset--;
            op = ".";
        }
        
        return op;
    },
    
    Template: function() {
    
        var first = this.readChar(),
            end = false, 
            val = "", 
            esc = "",
            chr = "";
        
        while (chr = this.peekChar()) {
            
            if (chr === "`") {
            
                end = true;
                break;
            }
            
            if (chr === "$" && this.peekCharAt(1) === "{") {
            
                this.offset++;
                break;
            }
            
            if (chr === "\\") {
            
                esc = this.readStringEscape();
                
                if (!esc) 
                    return this.Error();
                
                val += esc;
                
            } else {
            
                val += chr;
                this.offset++;
            }
        }
        
        if (!chr)
            return this.Error();
        
        this.offset++;
        this.value = val;
        this.templateEnd = end;
        
        return "TEMPLATE";
    },
    
    String: function() {
    
        var delim = this.readChar(),
            val = "",
            esc = "",
            chr = "";
        
        while (chr = this.input[this.offset]) {
        
            if (chr === delim)
                break;
            
            if (isNewlineChar(chr))
                return this.Error();
            
            if (chr === "\\") {
            
                esc = this.readStringEscape();
                
                if (esc === null)
                    return this.Error();
                
                val += esc;
                
            } else {
            
                val += chr;
                this.offset++;
            }
        }
        
        if (!chr)
            return this.Error();
        
        this.offset++;
        this.value = val;
        
        return "STRING";
    },
    
    RegularExpression: function() {
    
        this.offset++;
        
        var backslash = false, 
            inClass = false,
            flags = "",
            flagStart = 0,
            val = "", 
            chr = "",
            code = 0;
        
        while (chr = this.readChar()) {
        
            if (isNewlineChar(chr))
                return this.Error();
            
            if (backslash) {
            
                val += "\\" + chr;
                backslash = false;
            
            } else if (chr === "[") {
            
                inClass = true;
                val += chr;
            
            } else if (chr === "]" && inClass) {
            
                inClass = false;
                val += chr;
            
            } else if (chr === "/" && !inClass) {
            
                break;
            
            } else if (chr === "\\") {
            
                backslash = true;
                
            } else {
            
                val += chr;
            }
        }
        
        if (!chr)
            return this.Error();
        
        flagStart = this.offset;
        
        while (isIdentifierPart(code = this.peekCode())) {
        
            // Unicode escapes are not allowed in regular expression flags
            if (code === 92)
                return this.Error();
            
            this.offset++;
        }
        
        if (this.offset > flagStart)
            flags = this.input.slice(flagStart, this.offset);
        
        this.value = val;
        this.regexFlags = flags;
        
        return "REGEX";
    },
    
    LegacyOctalNumber: function() {
    
        this.offset++;
        
        var start = this.offset,
            code = 0;
        
        while (code = this.peekCode()) {
        
            if (code >= 48 && code <= 55)
                this.offset++;
            else
                break;
        }
        
        this.strictError = "Octal literals are not allowed in strict mode";
        
        var val = parseInt(this.input.slice(start, this.offset), 8);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    },
    
    Number: function() {
    
        var start = this.offset,
            next = "";
        
        this.readInteger();
        
        if ((next = this.peekChar()) === ".") {
        
            this.offset++;
            this.readInteger();
            next = this.peekChar();
        }
        
        if (next === "e" || next === "E") {
        
            this.offset++;
            
            next = this.peekChar();
            
            if (next === "+" || next === "-")
                this.offset++;
            
            if (!this.readInteger())
                return this.Error();
        }
        
        var val = parseFloat(this.input.slice(start, this.offset));
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    },
    
    BinaryNumber: function() {
    
        this.offset += 2;
        
        var val = parseInt(this.readRange(48, 49), 2);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    },
    
    OctalNumber: function() {
    
        this.offset += 2;
        
        var val = parseInt(this.readRange(48, 55), 8);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    },
    
    HexNumber: function() {
    
        this.offset += 2;
        
        var val = parseInt(this.readHex(0), 16);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    },
    
    Identifier: function(context) {
    
        var start = this.offset,
            startChar = true,
            id = "",
            code = 0,
            esc = "";

        while (true) {
        
            code = this.peekCode();
        
            if (code === 92 /* backslash */) {
            
                id += this.input.slice(start, this.offset++);
                
                if (this.readChar() !== "u")
                    return this.Error();
                
                esc = this.readUnicodeEscape();
                
                if (esc === null)
                    return this.Error();

                if (!(startChar ? identifierStart : identifierPart).test(esc))
                    return this.Error();
                
                id += esc;
                start = this.offset;
                
            } else if (startChar || isIdentifierPart(code)) {
            
                this.offset++;
                
            } else {
            
                break;
            }
            
            startChar = false;
        }
        
        id += this.input.slice(start, this.offset);
        
        if (context !== "name" && reservedWord.test(id))
            return esc ? this.Error() : id;
        
        this.value = id;
        
        return "IDENTIFIER";
    },
    
    LineComment: function() {
    
        this.offset += 2;
        
        var start = this.offset,
            chr = "";
        
        while (chr = this.peekChar()) {
        
            if (isNewlineChar(chr))
                break;
            
            this.offset++;
        }
        
        this.value = this.input.slice(start, this.offset);
        
        return "COMMENT";
    },
    
    BlockComment: function() {
    
        this.offset += 2;
        
        var pattern = blockCommentPattern,
            start = this.offset,
            m = null;
        
        while (true) {
        
            pattern.lastIndex = this.offset;
            
            m = pattern.exec(this.input);
            if (!m) return this.Error();
            
            this.offset = m.index + m[0].length;
            
            if (m[0] === "*/")
                break;
            
            this.newlineBefore = true;
            this.addLineBreak(m.index);
        }
        
        this.value = this.input.slice(start, this.offset - 2);
        
        return "COMMENT";
    },
    
    EOF: function() {
    
        return "EOF";
    },
    
    Error: function() {
    
        if (this.start === this.offset)
            this.offset++;
        
        return "ILLEGAL";
    }
    
} });


exports.Scanner = Scanner; return exports; }).call(this, {});

var Transform_ = (function(exports) {

var AST = AST_.AST;
    
var Transform = es6now.Class(function(__super) { return {

    // Transform an expression into a formal parameter list
    transformFormals: function(expr) {
        
        if (!expr)
            return [];
            
        var param,
            list,
            node,
            expr;
        
        switch (expr.type) {
        
            case "SequenceExpression": list = expr.expressions; break;
            case "CallExpression": list = expr.arguments; break;
            default: list = [expr]; break;
        }
    
        for (var i = 0; i < list.length; ++i) {
        
            node = list[i];
            
            if (i === list.length - 1 && node.type === "SpreadExpression") {
            
                expr = node.expression;
                
                // Rest parameters can only be identifiers
                if (expr.type !== "Identifier")
                    this.fail("Invalid rest parameter", expr);
                
                this.checkBindingTarget(expr);
                
                // Clear parser error for invalid spread expression
                node.error = "";
                
                param = new AST.RestParameter(expr, node.start, node.end);
                
            } else {
             
                param = new AST.FormalParameter(node, null, node.start, node.end);
                this.transformPatternElement(param, true);
            }
            
            list[i] = param;
        }
        
        return list;
    },
    
    transformArrayPattern: function(node, binding) {
    
        // NOTE: ArrayPattern and ArrayLiteral are isomorphic
        node.type = "ArrayPattern";
        
        var elems = node.elements,
            elem,
            expr;
        
        for (var i = 0; i < elems.length; ++i) {
        
            elem = elems[i];
            
            // Skip holes in pattern
            if (!elem) 
                continue;
            
            switch (elem.type) {
                
                case "SpreadExpression":
                
                    // TODO:  Currently, we are ignoring the last comma, but commas
                    // are not allowed after a rest element.  Should they be?
                    
                    // Rest element must be in the last position
                    if (i < elems.length - 1)
                        this.fail("Invalid destructuring pattern", elem);
                    
                    expr = elem.expression;
                    
                    // Rest target cannot be a destructuring pattern
                    switch (expr.type) {
                    
                        case "ObjectLiteral":
                        case "ObjectPattern":
                        case "ArrayLiteral":
                        case "ArrayPattern": 
                            this.fail("Invalid rest pattern", expr);
                    }
                    
                    elem = new AST.PatternRestElement(expr, elem.start, elem.end);
                    this.checkPatternTarget(elem.pattern, binding);
                    break;
                
                case "PatternRestElement":
                    this.checkPatternTarget(elem.pattern, binding);
                    break;
                    
                case "PatternElement":
                    this.transformPatternElement(elem, binding);
                    break;
                
                default:
                    elem = new AST.PatternElement(elem, null, elem.start, elem.end);
                    this.transformPatternElement(elem, binding);
                    break;
                    
            }
            
            elems[i] = elem;
        }
        
    },
    
    transformObjectPattern: function(node, binding) {

        // NOTE: ObjectPattern and ObjectLiteral are isomorphic
        node.type = "ObjectPattern";
        
        var props = node.properties;
        
        for (var i = 0; i < props.length; ++i) {
        
            var prop = props[i];
            
            // Clear the error flag
            prop.error = "";
            
            switch (prop.type) {
                    
                case "PropertyDefinition":
                    
                    // Replace node
                    props[i] = prop = new AST.PatternProperty(
                        prop.name,
                        prop.expression,
                        null,
                        prop.start,
                        prop.end);
                    
                    break;
                
                case "PatternProperty":
                    break;
                
                default:
                    this.fail("Invalid pattern", prop);
            }
            
            if (prop.pattern) this.transformPatternElement(prop, binding);
            else this.checkPatternTarget(prop.name, binding);
        }
    },
    
    transformPatternElement: function(elem, binding) {
    
        var node = elem.pattern;
        
        // Split assignment into pattern and initializer
        if (node && node.type === "AssignmentExpression" && node.operator === "=") {
        
            elem.initializer = node.right;
            elem.pattern = node = node.left;
        }
        
        this.checkPatternTarget(node, binding);
    }, constructor: function Transform() {}
    
} });



exports.Transform = Transform; return exports; }).call(this, {});

var IntMap_ = (function(exports) {


var IntMap = es6now.Class(function(__super) { return {

    constructor: function IntMap() {
    
        this.obj = Object.create(null);
    },
    
    get: function(key) {
    
        return this.obj[key] | 0;
    },
    
    set: function(key, val) {
    
        return this.obj[key] = val | 0;
    }
    
} });


exports.IntMap = IntMap; return exports; }).call(this, {});

var Validate_ = (function(exports) {

var IntMap = IntMap_.IntMap;

// Object literal property name flags
var PROP_NORMAL = 1,
    PROP_DATA = 2,
    PROP_GET = 4,
    PROP_SET = 8;

// Identifiers which are reserved in strict mode    
var strictReservedWord = new RegExp("^(?:" +
    "implements|private|public|interface|package|let|protected|static|yield" +
")$");

// Returns true if the identifier is a reserved word in strict mode
function isStrictReserved(word) {

    return strictReservedWord.test(word);
}

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
}

// Unwraps parens surrounding an expression
function unwrapParens(node) {

    // Remove any parenthesis surrounding the target
    for (; node.type === "ParenExpression"; node = node.expression);
    return node;
}

var Validate = es6now.Class(function(__super) { return {

    // Validates an assignment target
    checkAssignmentTarget: function(node, simple) {
    
        switch (node.type) {
        
            case "Identifier":
            
                if (isPoisonIdent(node.value))
                    this.addStrictError("Cannot modify " + node.value + " in strict mode", node);
        
                return;
            
            case "MemberExpression":
                return;
            
            case "ObjectPattern":
            case "ArrayPattern":
                if (!simple) return;
                break;
            
            case "ObjectLiteral":
                if (!simple) { this.transformObjectPattern(node, false); return }
                break;
                
            case "ArrayLiteral":
                if (!simple) { this.transformArrayPattern(node, false); return }
                break;
            
        }
        
        this.fail("Invalid left-hand side in assignment", node);
    },
    
    // Validates a binding target
    checkBindingTarget: function(node) {
    
        var name, msg;
        
        switch (node.type) {
        
            case "Identifier":
            
                // Perform basic identifier validation
                this.checkIdentifier(node);
        
                // Mark identifier node as a declaration
                node.context = "declaration";
            
                name = node.value;
        
                if (isPoisonIdent(name))
                    this.addStrictError("Binding cannot be created for '" + name + "' in strict mode", node);
                
                return;
            
            case "ArrayLiteral":
            case "ArrayPattern":
                this.transformArrayPattern(node, true);
                return;
            
            case "ObjectLiteral":
            case "ObjectPattern":
                this.transformObjectPattern(node, true);
                return;
            
        }
        
        this.fail("Invalid binding target", node);
    },
    
    // Validates a target in a binding or assignment pattern
    checkPatternTarget: function(node, binding) {
    
        return binding ? this.checkBindingTarget(node) : this.checkAssignmentTarget(node, false);
    },
    
    // Checks an identifier for strict mode reserved words
    checkIdentifier: function(node) {
    
        var ident = node.value;
        
        // TODO: Add a restriction for await in async functions?
        
        if (ident === "yield" && this.context.functionType === "generator")
            this.fail("yield cannot be an identifier inside of a generator function", node);
        else if (isStrictReserved(ident))
            this.addStrictError(ident + " cannot be used as an identifier in strict mode", node);
    },
    
    // Checks function formal parameters for strict mode restrictions
    checkParameters: function(params, kind) {
    
        var names = new IntMap, 
            name,
            node;
        
        for (var i = 0; i < params.length; ++i) {
        
            node = params[i];
            
            if (node.type !== "FormalParameter" || node.pattern.type !== "Identifier")
                continue;
            
            name = node.pattern.value;
            
            if (isPoisonIdent(name))
                this.addStrictError("Parameter name " + name + " is not allowed in strict mode", node);
            
            if (names.get(name))
                this.addStrictError("Strict mode function may not have duplicate parameter names", node);
            
            names.set(name, 1);
        }
    },
    
    // TODO: Add a method for validating the parameter list of arrow functions, which may
    // contain identifiers or initializers which are not valid within the containing context.
    
    // TODO: For identifiers within an arrow function parameter list, we have
    // to take into account the parent context.  For example, yield is not
    // allowed as an identifier within the parameter list of an arrow function
    // contained within a generator.  For "modified" arrow functions (e.g. 
    // async arrows) we'll have to take the union of these restrictions.
    
    // Performs validation on transformed arrow formal parameters
    checkArrowParameters: function(params) {
    
        params = this.transformFormals(params);
        this.checkParameters(params);
        return params;
    },
    
    // Performs validation on the init portion of a for-in or for-of statement
    checkForInit: function(init, type) {
    
        if (init.type === "VariableDeclaration") {
            
            // For-in/of may only have one variable declaration
            if (init.declarations.length !== 1)
                this.fail("for-" + type + " statement may not have more than one variable declaration", init);
            
            var decl = init.declarations[0];
            
            // Initializers are not allowed in for in and for of
            if (decl.initializer)
                this.fail("Invalid initializer in for-" + type + " statement", init);
            
        } else {
        
            this.checkAssignmentTarget(this.unwrapParens(init));
        }
    },
    
    // Checks for duplicate object literal property names
    checkPropertyName: function(node, nameSet) {
    
        var flag = PROP_NORMAL,
            currentFlags = 0,
            name = "";
        
        switch (node.name.type) {
        
            case "Identifier":
            case "StringLiteral":
                name = node.name.value;
                break;
                
            case "ComputedPropertyName":
                // If property name is computed, skip duplicate check
                return;
            
            default:
                name = String(node.name.value);
                break;
        }
        
        switch (node.type) {

            case "PropertyDefinition":
            
                // Duplicates only allowed for "x: expr" form
                if (node.expression)
                    flag = PROP_DATA;
                
                break;
    
            case "MethodDefinition":
        
                switch (node.kind) {

                    case "get": flag = PROP_GET; break;
                    case "set": flag = PROP_SET; break;
                }
                
                break;
        }

        // If this name has already been added...
        if (currentFlags = nameSet.get(name)) {
        
            var duplicate = true;
            
            switch (flag) {
    
                case PROP_DATA:
                    
                    if (currentFlags === PROP_DATA) {
                    
                        this.addStrictError("Duplicate data property names in object literal not allowed in strict mode", node);
                        duplicate = false;
                    }
                    
                    break;
                
                case PROP_GET:
                    if (currentFlags === PROP_SET) duplicate = false;
                    break;
                    
                case PROP_SET:
                    if (currentFlags === PROP_GET) duplicate = false;
                    break;
            }
            
            if (duplicate)
                this.addInvalidNode("Duplicate property names in object literal not allowed", node);
        }

        // Set name flag
        nameSet.set(name, currentFlags | flag);
    },
    
    checkInvalidNodes: function() {
    
        var context = this.context,
            parent = context.parent,
            list = context.invalidNodes,
            item,
            node,
            error;
        
        for (var i = 0; i < list.length; ++i) {
        
            item = list[i];
            node = item.node;
            error = node.error;
            
            // Skip if error has been resolved
            if (!error)
                continue;
            
            // Throw if item is not a strict-mode-only error, or
            // if the current context is strict
            if (!item.strict || context.mode === "strict")
                this.fail(error, node);
            
            // Skip strict errors in sloppy mode
            if (context.mode === "sloppy")
                continue;
            
            // NOTE:  If the parent context is sloppy, then we ignore.
            // If the parent context is strict, then this context would
            // also be known to be strict and therefore handled above.
            
            // If parent mode has not been determined, add error to
            // parent context
            if (!parent.mode)
                parent.invalidNodes.push(item);
        }
        
    },
    
    checkDelete: function(node) {
    
        node = this.unwrapParens(node);
        
        if (node.type === "Identifier")
            this.addStrictError("Cannot delete unqualified property in strict mode", node);
    }, constructor: function Validate() {}
    
} });


exports.Validate = Validate; return exports; }).call(this, {});

var Parser_ = (function(exports) {

var AST = AST_.AST;
var Scanner = Scanner_.Scanner;
var Transform = Transform_.Transform;
var Validate = Validate_.Validate;
var IntMap = IntMap_.IntMap;

// Returns true if the specified operator is an increment operator
function isIncrement(op) {

    return op === "++" || op === "--";
}

// Returns a binary operator precedence level
function getPrecedence(op) {

    switch (op) {
    
        case "||": return 1;
        case "&&": return 2;
        case "|": return 3;
        case "^": return 4;
        case "&": return 5;
        case "==":
        case "!=":
        case "===":
        case "!==": return 6;
        case "<=":
        case ">=":
        case ">":
        case "<":
        case "instanceof":
        case "in": return 7;
        case ">>>":
        case ">>":
        case "<<": return 8;
        case "+":
        case "-": return 9;
        case "*":
        case "/":
        case "%": return 10;
    }
    
    return 0;
}

// Returns true if the specified operator is an assignment operator
function isAssignment(op) {

    if (op === "=")
        return true;
    
    switch (op) {
    
        case "*=": 
        case "&=": 
        case "^=": 
        case "|=": 
        case "<<=": 
        case ">>=": 
        case ">>>=": 
        case "%=": 
        case "+=": 
        case "-=": 
        case "/=":
            return true;
    }
    
    return false;
}

// Returns true if the specified operator is a unary operator
function isUnary(op) {
    
    switch (op) {
    
        case "await":
        case "delete":
        case "void": 
        case "typeof":
        case "!":
        case "~":
        case "+":
        case "-":
            return true;
    }
    
    return false;
}

// Returns true if the value is a function modifier keyword
function isFunctionModifier(value) {

    // TODO:  Here we just test a string value, but what if the identifier contains
    // unicode escapes?
    
    switch (value) {
    
        case "async": return true;
    }
    
    return false;
}

// Copies token data
function copyToken(from, to) {

    to.type = from.type;
    to.value = from.value;
    to.number = from.number;
    to.regexFlags = from.regexFlags;
    to.templateEnd = from.templateEnd;
    to.newlineBefore = from.newlineBefore;
    to.strictError = from.strictError;
    to.start = from.start;
    to.end = from.end;
    
    return to;
}

var Context = es6now.Class(function(__super) { return {

    constructor: function Context(parent, isFunction) {
    
        this.parent = parent;
        this.mode = "";
        this.isFunction = isFunction;
        this.functionBody = false;
        this.functionType = "";
        this.labelSet = new IntMap;
        this.switchDepth = 0;
        this.loopDepth = 0;
        this.invalidNodes = [];
    }
} });

var Parser = es6now.Class(function(__super) { return {

    constructor: function Parser(input, offset) {

        var scanner = new Scanner(input, offset);
        
        this.scanner = scanner;
        this.input = input;
        
        this.peek0 = null;
        this.peek1 = null;
        this.tokenStash = new Scanner;
        this.tokenEnd = scanner.offset;
        
        this.context = new Context(null, false);
        this.setStrict(false);
    },
    
    nextToken: function(context) {
    
        var scanner = this.scanner,
            type = "";
        
        context = context || "";
        
        do { type = scanner.next(context); }
        while (type === "COMMENT");
        
        return scanner;
    },
    
    nodeStart: function() {
    
        if (this.peek0)
            return this.peek0.start;
        
        // Skip over whitespace and comments
        this.scanner.skip();
        
        return this.scanner.offset;
    },
    
    nodeEnd: function() {
    
        return this.tokenEnd;
    },
    
    readToken: function(type, context) {
    
        var token = this.peek0 || this.nextToken(context);
        
        this.peek0 = this.peek1;
        this.peek1 = null;
        this.tokenEnd = token.end;
        
        if (type && token.type !== type)
            this.unexpected(token);
            
        return token;
    },
    
    read: function(type, context) {
    
        return this.readToken(type, context).type;
    },
    
    peekToken: function(context) {
    
        if (!this.peek0)
            this.peek0 = this.nextToken(context);
        
        return this.peek0;
    },
    
    peek: function(context) {
    
        return this.peekToken(context).type;
    },
    
    peekTokenAt: function(context, index) {
    
        if (index !== 1 || this.peek0 === null)
            throw new Error("Invalid lookahead")
        
        if (this.peek1 === null) {
        
            this.peek0 = copyToken(this.peek0, this.tokenStash);
            this.peek1 = this.nextToken(context);
        }
        
        return this.peek1;
    },
    
    peekAt: function(context, index) {
    
        return this.peekTokenAt(context, index).type;
    },
    
    unpeek: function() {
    
        if (this.peek0) {
        
            this.scanner.offset = this.peek0.start;
            this.peek0 = null;
            this.peek1 = null;
        }
    },
    
    peekUntil: function(type, context) {
    
        var tok = this.peek(context);
        return tok !== "EOF" && tok !== type ? tok : null;
    },
    
    readKeyword: function(word) {
    
        // TODO:  What if token has a unicode escape?  Does it still count as the keyword?
        // Do we fail if the keyword has a unicode escape (this would mirror what happens
        // with reserved words).
        
        var token = this.readToken();
        
        if (token.type === word || token.type === "IDENTIFIER" && token.value === word)
            return token;
        
        this.unexpected(token);
    },
    
    peekKeyword: function(word) {
    
        var token = this.peekToken();
        return token.type === "IDENTIFIER" && token.value === word;
    },
    
    peekLet: function() {
    
        if (this.peekKeyword("let")) {
        
            switch (this.peekAt("div", 1)) {
            
                case "{":
                case "[":
                case "IDENTIFIER": return true;
            }
        }
        
        return false;
    },
    
    peekModule: function() {
    
        if (this.peekKeyword("module")) {
        
            var token = this.peekTokenAt("div", 1);
            return (!token.newlineBefore && token.type === "IDENTIFIER");
        }
        
        return false;
    },
    
    peekYield: function() {
    
        return this.context.functionBody &&
            this.context.functionType === "generator" && 
            this.peekKeyword("yield");
    },
    
    peekAwait: function() {
    
        return this.context.functionBody && 
            this.context.functionType === "async" &&
            this.peekKeyword("await");
    },
    
    peekFunctionModifier: function() {
    
        var token = this.peekToken();
        
        if (!(token.type === "IDENTIFIER" && isFunctionModifier(token.value)))
            return false;
        
        token = this.peekTokenAt("div", 1);
        return token.type === "function" && !token.newlineBefore;
    },
    
    peekEnd: function() {
    
        var token = this.peekToken();
        
        if (!token.newlineBefore) {
            
            switch (token.type) {
            
                case "EOF":
                case "}":
                case ";":
                case ")":
                    break;
                
                default:
                    return false;
            }
        }
        
        return true;
    },
    
    unexpected: function(token) {
    
        var type = token.type, msg;
        
        msg = type === "EOF" ?
            "Unexpected end of input" :
            "Unexpected token " + token.type;
        
        this.fail(msg, token);
    },
    
    fail: function(msg, node) {
    
        if (!node)
            node = this.peekToken();
        
        var pos = this.scanner.position(node.start),
            err = new SyntaxError(msg);
        
        err.line = pos.line;
        err.column = pos.column;
        err.lineOffset = pos.lineOffset;
        err.startOffset = node.start;
        err.endOffset = node.end;
        err.sourceText = this.input;
        
        throw err;
    },
    
    unwrapParens: function(node) {

        // Remove any parenthesis surrounding the target
        for (; node.type === "ParenExpression"; node = node.expression);
        return node;
    },

    
    // == Context Management ==
    
    pushContext: function(isFunction) {
    
        var parent = this.context;
        
        this.context = new Context(parent, isFunction);
        
        if (parent.mode === "strict")
            this.context.mode = "strict";
    },
    
    pushMaybeContext: function() {
    
        var parent = this.context;
        this.pushContext(parent.isFunction);
        this.context.functionBody = parent.functionBody;
        this.context.functionType = parent.functionType;
    },
    
    popContext: function(collapse) {
    
        var context = this.context,
            parent = context.parent;
        
        // If collapsing into parent context, copy invalid nodes into parent
        if (collapse) {

            for (var i = 0; i < context.invalidNodes.length; ++i)
                parent.invalidNodes.push(context.invalidNodes[i]);
            
        } else {
        
            this.checkInvalidNodes();
        }
        
        this.context = this.context.parent;
    },
    
    setStrict: function(strict) {
    
        this.context.mode = strict ? "strict" : "sloppy";
    },
    
    addStrictError: function(error, node) {
    
        this.addInvalidNode(error, node, true);
    },
    
    addInvalidNode: function(error, node, strict) {
    
        node.error = error;
        this.context.invalidNodes.push({ node: node, strict: !!strict });
    },
    
    setLoopLabel: function(label) {
    
        this.context.labelSet.set(label, 2);
    },
    
    // === Top Level ===
    
    Script: function() {
    
        this.pushContext(false);
        
        var start = this.nodeStart(),
            statements = this.StatementList(true, false);
        
        this.popContext();
        
        return new AST.Script(statements, start, this.nodeEnd());
    },
    
    Module: function() {
    
        this.pushContext(false);
        this.setStrict(true);
        
        var start = this.nodeStart(),
            statements = this.StatementList(true, true);
        
        this.popContext();
        
        return new AST.Module(statements, start, this.nodeEnd());
    },
    
    // === Expressions ===
    
    Expression: function(noIn) {
    
        var start = this.nodeStart(),
            expr = this.AssignmentExpression(noIn),
            list = null;
            
        while (this.peek("div") === ",") {

            this.read();
            
            if (list === null)
                expr = new AST.SequenceExpression(list = [expr], start, -1);
            
            list.push(this.AssignmentExpression(noIn));
        }
        
        if (list)
            expr.end = this.nodeEnd();
        
        return expr;
    },
    
    AssignmentExpression: function(noIn, allowSpread) {
    
        var start = this.nodeStart(),
            node;
        
        if (this.peek() === "...") {
        
            this.read();
            
            node = new AST.SpreadExpression(
                this.AssignmentExpression(noIn),
                start,
                this.nodeEnd());
            
            if (!allowSpread)
                this.addInvalidNode("Invalid spread expression", node);
            
            return node;
        }
        
        if (this.peekYield())
            return this.YieldExpression(noIn);
        
        node = this.ConditionalExpression(noIn);
        
        if (node.type === "ArrowFunctionHead")
            return this.ArrowFunctionBody(node, noIn);
        
        // Check for assignment operator
        if (!isAssignment(this.peek("div")))
            return node;
        
        this.checkAssignmentTarget(this.unwrapParens(node), false);
        
        return new AST.AssignmentExpression(
            this.read(),
            node,
            this.AssignmentExpression(noIn),
            start,
            this.nodeEnd());
    },
    
    YieldExpression: function(noIn) {
    
        var start = this.nodeStart(),
            delegate = false,
            expr = null;
            
        this.readKeyword("yield");
        
        if (!this.peekEnd()) {
        
            if (this.peek() === "*") {
        
                this.read();
                delegate = true;
            }
        
            expr = this.AssignmentExpression(noIn);
        }
        
        return new AST.YieldExpression(
            expr, 
            delegate, 
            start, 
            this.nodeEnd());
    },
    
    ConditionalExpression: function(noIn) {
    
        var start = this.nodeStart(),
            left = this.BinaryExpression(noIn),
            middle,
            right;
        
        if (this.peek("div") !== "?")
            return left;
        
        this.read("?");
        middle = this.AssignmentExpression();
        this.read(":");
        right = this.AssignmentExpression(noIn);
        
        return new AST.ConditionalExpression(left, middle, right, start, this.nodeEnd());
    },
    
    BinaryExpression: function(noIn) {
    
        return this.PartialBinaryExpression(this.UnaryExpression(), 0, noIn);
    },
    
    PartialBinaryExpression: function(lhs, minPrec, noIn) {
    
        var prec = 0,
            next = "", 
            max = 0, 
            op = "",
            rhs;
        
        while (next = this.peek("div")) {
            
            // Exit if operator is "in" and in is not allowed
            if (next === "in" && noIn)
                break;
            
            prec = getPrecedence(next);
            
            // Exit if not a binary operator or lower precendence
            if (prec === 0 || prec < minPrec)
                break;
            
            this.read();
            
            op = next;
            max = prec;
            rhs = this.UnaryExpression();
            
            while (next = this.peek("div")) {
            
                prec = getPrecedence(next);
                
                // Exit if not a binary operator or equal or higher precendence
                if (prec === 0 || prec <= max)
                    break;
                
                rhs = this.PartialBinaryExpression(rhs, prec, noIn);
            }
            
            lhs = new AST.BinaryExpression(op, lhs, rhs, lhs.start, rhs.end);
        }
        
        return lhs;
    },
    
    UnaryExpression: function() {
    
        var start = this.nodeStart(),
            type = this.peek(),
            token,
            expr;
        
        if (isIncrement(type)) {
        
            this.read();
            expr = this.MemberExpression(true);
            this.checkAssignmentTarget(this.unwrapParens(expr), true);
            
            return new AST.UpdateExpression(type, expr, true, start, this.nodeEnd());
        }
        
        if (this.peekAwait())
            type = "await";
        
        if (isUnary(type)) {
        
            this.read();
            expr = this.UnaryExpression();
            
            if (type === "delete")
                this.checkDelete(expr);
            
            return new AST.UnaryExpression(type, expr, start, this.nodeEnd());
        }
        
        expr = this.MemberExpression(true);
        token = this.peekToken("div");
        type = token.type;
        
        // Check for postfix operator
        if (isIncrement(type) && !token.newlineBefore) {
        
            this.read();
            this.checkAssignmentTarget(this.unwrapParens(expr), true);
            
            return new AST.UpdateExpression(type, expr, false, start, this.nodeEnd());
        }
        
        return expr;
    },
    
    MemberExpression: function(allowCall) {
    
        var start = this.nodeStart(),
            token = this.peekToken(),
            arrowType = "",
            exit = false,
            prop,
            expr;
        
        expr = 
            token.type === "new" ? this.NewExpression() :
            token.type === "super" ? this.SuperExpression() :
            this.PrimaryExpression();
        
        while (!exit) { 
        
            token = this.peekToken("div");
            
            switch (token.type) {
            
                case ".":
                
                    this.read();
                    
                    expr = new AST.MemberExpression(
                        expr, 
                        this.IdentifierName(), 
                        false, 
                        start, 
                        this.nodeEnd());
                    
                    break;
                
                case "[":
                
                    this.read();
                    prop = this.Expression();
                    this.read("]");
                    
                    expr = new AST.MemberExpression(
                        expr, 
                        prop, 
                        true, 
                        start, 
                        this.nodeEnd());
        
                    break;
                
                case "(":
                    
                    if (!allowCall) {
                    
                        exit = true;
                        break;
                    }
                    
                    if (expr.type === "Identifier" && 
                        isFunctionModifier(expr.value)) {
                
                        arrowType = expr.value;
                        this.pushMaybeContext();
                    }
                    
                    expr = new AST.CallExpression(
                        expr, 
                        this.ArgumentList(), 
                        start, 
                        this.nodeEnd());
                    
                    if (arrowType) {
                    
                        token = this.peekToken("div");

                        if (token.type === "=>" && !token.newlineBefore) {
                        
                            expr = this.ArrowFunctionHead(arrowType, expr, start);
                            exit = true;
                        
                        } else {
                            
                            arrowType = "";
                            this.popContext(true);
                        }
                    }
                    
                    break;
                
                case "TEMPLATE":
                
                    expr = new AST.TaggedTemplateExpression(
                        expr,
                        this.TemplateExpression(),
                        start,
                        this.nodeEnd());
                    
                    break;
                
                default:
                
                    if (expr.type === "SuperExpression")
                        this.fail("Invalid super expression", expr);
                    
                    exit = true;
                    break;
            }
        }
        
        return expr;
    },
    
    NewExpression: function() {
    
        var start = this.nodeStart();
        
        this.read("new");
        
        var expr = this.peek() === "super" ?
            this.SuperExpression() :
            this.MemberExpression(false);
        
        var args = this.peek("div") === "(" ? this.ArgumentList() : null;
        
        return new AST.NewExpression(expr, args, start, this.nodeEnd());
    },
    
    SuperExpression: function() {
    
        var start = this.nodeStart();
        this.read("super");
        
        var node = new AST.SuperExpression(start, this.nodeEnd());
        
        if (!this.context.isFunction)
            this.fail("Super keyword outside of function", node);
        
        return node;
    },
    
    ArgumentList: function() {
    
        var list = [];
        
        this.read("(");
        
        while (this.peekUntil(")")) {
        
            if (list.length > 0)
                this.read(",");
            
            list.push(this.AssignmentExpression(false, true));
        }
        
        this.read(")");
        
        return list;
    },
    
    PrimaryExpression: function() {
    
        var token = this.peekToken(),
            type = token.type,
            start = this.nodeStart(),
            next;
        
        switch (type) {
            
            case "function": return this.FunctionExpression();
            case "class": return this.ClassExpression();
            case "TEMPLATE": return this.TemplateExpression();
            case "NUMBER": return this.NumberLiteral();
            case "STRING": return this.StringLiteral();
            case "{": return this.ObjectLiteral();
            
            case "(": return this.peekAt(null, 1) === "for" ? 
                this.GeneratorComprehension() :
                this.ParenExpression();
            
            case "[": return this.peekAt(null, 1) === "for" ?
                this.ArrayComprehension() :
                this.ArrayLiteral();
            
            case "IDENTIFIER":
                
                next = this.peekTokenAt("div", 1);
                
                if (next.type === "=>") {
                
                    this.pushContext(true);
                    return this.ArrowFunctionHead("", this.BindingIdentifier(), start);
                
                } else if (!next.newlineBefore) {
                
                    if (next.type === "function")
                        return this.FunctionExpression();
                    
                    if (next.type === "IDENTIFIER" && isFunctionModifier(token.value)) {
                    
                        this.read();
                        this.pushContext(true);
                        return this.ArrowFunctionHead(token.value, this.BindingIdentifier(), start);
                    }
                }
                
                return this.Identifier(true);
            
            case "REGEX": return this.RegularExpression();
            
            case "null":
                this.read();
                return new AST.NullLiteral(token.start, token.end);
            
            case "true":
            case "false":
                this.read();
                return new AST.BooleanLiteral(type === "true", token.start, token.end);
            
            case "this":
                this.read();
                return new AST.ThisExpression(token.start, token.end);
        }
        
        this.unexpected(token);
    },
    
    Identifier: function(isVar) {
    
        var token = this.readToken("IDENTIFIER"),
            node = new AST.Identifier(token.value, isVar ? "variable" : "", token.start, token.end);
        
        this.checkIdentifier(node);
        return node;
    },
    
    IdentifierName: function() {
    
        var token = this.readToken("IDENTIFIER", "name");
        return new AST.Identifier(token.value, "", token.start, token.end);
    },
    
    StringLiteral: function() {
    
        var token = this.readToken("STRING"),
            node = new AST.StringLiteral(token.value, token.start, token.end);
        
        if (token.strictError)
            this.addStrictError(token.strictError, node);
        
        return node;
    },
    
    NumberLiteral: function() {
    
        var token = this.readToken("NUMBER"),
            node = new AST.NumberLiteral(token.number, token.start, token.end);
        
        if (token.strictError)
            this.addStrictError(token.strictError, node);
        
        return node;
    },
    
    TemplatePart: function() {
    
        var token = this.readToken("TEMPLATE", "template"),
            node = new AST.TemplatePart(token.value, token.templateEnd, token.start, token.end);
        
        if (token.strictError)
            this.addStrictError(token.strictError, node);
        
        return node;
    },
    
    RegularExpression: function() {
    
        // TODO:  Validate regular expression against RegExp grammar (21.2.1)
        var token = this.readToken("REGEX");
        return new AST.RegularExpression(token.value, token.regexFlags, token.start, token.end);
    },
    
    BindingIdentifier: function() {
    
        var token = this.readToken("IDENTIFIER"),
            node = new AST.Identifier(token.value, "", token.start, token.end);
        
        this.checkBindingTarget(node);
        return node;
    },
    
    BindingPattern: function() {
    
        var node;
        
        switch (this.peek()) { 
        
            case "{":
                node = this.ObjectLiteral();
                break;
            
            case "[":
                node = this.ArrayLiteral();
                break;
            
            default:
                return this.BindingIdentifier();
        }
        
        this.checkBindingTarget(node);
        return node;
    },
    
    ParenExpression: function() {

        var start = this.nodeStart(),
            expr = null,
            rest = null;
        
        // Push a new context in case we are parsing an arrow function
        this.pushMaybeContext();
        
        this.read("(");
        
        switch (this.peek()) {
        
            // An empty arrow function formal list
            case ")":
                break;
            
            // Paren expression
            default:
                expr = this.Expression();
                break;
        }
        
        this.read(")");
        
        if (expr === null || this.peek("div") === "=>")
            return this.ArrowFunctionHead("", expr, start);
        
        // Collapse this context into its parent
        this.popContext(true);
        
        return new AST.ParenExpression(expr, start, this.nodeEnd());
    },
    
    ObjectLiteral: function() {
    
        var start = this.nodeStart(),
            nameSet = new IntMap,
            comma = false,
            list = [],
            node;
        
        this.read("{");
        
        while (this.peekUntil("}", "name")) {
        
            if (list.length > 0) {
            
                this.read(",");
                comma = true;
            }
            
            if (this.peek("name") !== "}") {
            
                comma = false;
                list.push(node = this.PropertyDefinition());
                this.checkPropertyName(node, nameSet);
            }
        }
        
        this.read("}");
        
        return new AST.ObjectLiteral(list, start, this.nodeEnd());
    },
    
    PropertyDefinition: function() {
    
        var start = this.nodeStart(),
            node,
            name;
        
        if (this.peek("name") === "*")
            return this.MethodDefinition();
        
        switch (this.peekAt("name", 1)) {
        
            case "=":
        
                // Re-read token as an identifier
                this.unpeek();
            
                node = new AST.PatternProperty(
                    this.Identifier(true),
                    null,
                    (this.read(), this.AssignmentExpression()),
                    start,
                    this.nodeEnd());
        
                this.addInvalidNode("Invalid property definition in object literal", node);
                return node;
            
            case ",":
            case "}":
            
                // Re-read token as an identifier
                this.unpeek();
        
                return new AST.PropertyDefinition(
                    this.Identifier(true),
                    null,
                    start,
                    this.nodeEnd());
        }
            
        name = this.PropertyName();
        
        if (this.peek("name") === ":") {
        
            return new AST.PropertyDefinition(
                name,
                (this.read(), this.AssignmentExpression()),
                start,
                this.nodeEnd());
        }
        
        return this.MethodDefinition(name);
    },
    
    PropertyName: function() {
    
        var token = this.peekToken("name");
        
        switch (token.type) {
        
            case "IDENTIFIER": return this.IdentifierName();
            case "STRING": return this.StringLiteral();
            case "NUMBER": return this.NumberLiteral();
            case "[": return this.ComputedPropertyName();
        }
        
        this.unexpected(token);
    },
    
    ComputedPropertyName: function() {
    
        var start = this.nodeStart();
        
        this.read("[");
        var expr = this.AssignmentExpression();
        this.read("]");
        
        return new AST.ComputedPropertyName(expr, start, this.nodeEnd());
    },
    
    ArrayLiteral: function() {
    
        var start = this.nodeStart(),
            list = [],
            comma = false,
            next,
            type;
        
        this.read("[");
        
        while (type = this.peekUntil("]")) {
            
            if (type === ",") {
            
                this.read();
                
                if (comma)
                    list.push(null);
                
                comma = true;
            
            } else {
            
                list.push(next = this.AssignmentExpression(false, true));
                comma = false;
            }
        }
        
        this.read("]");
        
        return new AST.ArrayLiteral(list, start, this.nodeEnd());
    },
    
    ArrayComprehension: function() {
    
        var start = this.nodeStart();
        
        this.read("[");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read("]");
        
        return new AST.ArrayComprehension(list, expr, start, this.nodeEnd());
    },
    
    GeneratorComprehension: function() {
    
        var start = this.nodeStart(),
            fType = this.context.functionType;
        
        // Generator comprehensions cannot contain contextual expresions like yield
        this.context.functionType = "";
        this.read("(");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read(")");
        this.context.functionType = fType;
        
        return new AST.GeneratorComprehension(list, expr, start, this.nodeEnd());
    },
    
    ComprehensionQualifierList: function() {
    
        var list = [],
            done = false;
        
        list.push(this.ComprehensionFor());
        
        while (!done) {
        
            switch (this.peek()) {
            
                case "for": list.push(this.ComprehensionFor()); break;
                case "if": list.push(this.ComprehensionIf()); break;
                default: done = true; break;
            }
        }
        
        return list;
    },
    
    ComprehensionFor: function() {
    
        var start = this.nodeStart();
        
        this.read("for");
        
        return new AST.ComprehensionFor(
            this.BindingPattern(),
            (this.readKeyword("of"), this.AssignmentExpression()),
            start,
            this.nodeEnd());
    },
    
    ComprehensionIf: function() {
    
        var start = this.nodeStart(),
            test;
            
        this.read("if");
        
        this.read("(");
        test = this.AssignmentExpression();
        this.read(")");
        
        return new AST.ComprehensionIf(test, start, this.nodeEnd());
    },
    
    TemplateExpression: function() {
        
        var atom = this.TemplatePart(),
            start = atom.start,
            lit = [atom],
            sub = [];
        
        while (!atom.templateEnd) {
        
            sub.push(this.Expression());
            
            // Discard any tokens that have been scanned using a different context
            this.unpeek();
            
            lit.push(atom = this.TemplatePart());
        }
        
        return new AST.TemplateExpression(lit, sub, start, this.nodeEnd());
    },
    
    // === Statements ===
    
    Statement: function(label) {
    
        var next;
        
        switch (this.peek()) {
            
            case "IDENTIFIER":
            
                next = this.peekTokenAt("div", 1);
                
                if (next.type === ":")
                    return this.LabelledStatement();
                
                if (next.type === "function" && !next.newlineBefore)
                    return this.FunctionDeclaration();
                
                return this.ExpressionStatement();
            
            case "{": return this.Block();
            case ";": return this.EmptyStatement();
            case "var": return this.VariableStatement();
            case "return": return this.ReturnStatement();
            case "break": return this.BreakStatement();
            case "continue": return this.ContinueStatement();
            case "throw": return this.ThrowStatement();
            case "debugger": return this.DebuggerStatement();
            case "if": return this.IfStatement();
            case "do": return this.DoWhileStatement(label);
            case "while": return this.WhileStatement(label);
            case "for": return this.ForStatement(label);
            case "with": return this.WithStatement();
            case "switch": return this.SwitchStatement();
            case "try": return this.TryStatement();
            
            default: return this.ExpressionStatement();
        }
    },
    
    Block: function() {
        
        var start = this.nodeStart();
        
        this.read("{");
        var list = this.StatementList(false, false);
        this.read("}");
        
        return new AST.Block(list, start, this.nodeEnd());
    },
    
    Semicolon: function() {
    
        var token = this.peekToken(),
            type = token.type;
        
        if (type === ";" || !(type === "}" || type === "EOF" || token.newlineBefore))
            this.read(";");
    },
    
    LabelledStatement: function() {
    
        var start = this.nodeStart(),
            label = this.Identifier(),
            name = label.value,
            labelSet = this.context.labelSet;
        
        if (labelSet.get(name) > 0)
            this.fail("Invalid label", label);
        
        this.read(":");
        
        labelSet.set(name, 1);
        var statement = this.Statement(name);
        labelSet.set(name, 0);
        
        return new AST.LabelledStatement(
            label, 
            statement,
            start,
            this.nodeEnd());
    },
    
    ExpressionStatement: function() {
    
        var start = this.nodeStart(),
            expr = this.Expression();
        
        this.Semicolon();
        
        return new AST.ExpressionStatement(expr, start, this.nodeEnd());
    },
    
    EmptyStatement: function() {
    
        var start = this.nodeStart();
        
        this.Semicolon();
        
        return new AST.EmptyStatement(start, this.nodeEnd());
    },
    
    VariableStatement: function() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.nodeEnd();
        
        return node;
    },
    
    VariableDeclaration: function(noIn) {
    
        var start = this.nodeStart(),
            token = this.peekToken(),
            kind = token.type,
            isConst = false,
            list = [];
        
        switch (kind) {
        
            case "var":
                break;
            
            case "const":
                isConst = true;
                break;
            
            case "IDENTIFIER":
            
                if (token.value === "let") {
                
                    kind = "let";
                    break;
                }
                
            default:
                this.fail("Expected var, const, or let");
        }
        
        this.read();
        
        while (true) {
        
            list.push(this.VariableDeclarator(noIn, isConst));
            
            if (this.peek() === ",") this.read();
            else break;
        }
        
        return new AST.VariableDeclaration(kind, list, start, this.nodeEnd());
    },
    
    VariableDeclarator: function(noIn, isConst) {
    
        var start = this.nodeStart(),
            pattern = this.BindingPattern(),
            init = null;
        
        if ((!noIn && pattern.type !== "Identifier") || this.peek() === "=") {
        
            // NOTE: Patterns must have initializers when not in declaration
            // section of a for statement
            
            this.read("=");
            init = this.AssignmentExpression(noIn);
            
        } else if (isConst) {
        
            this.fail("Missing const initializer", pattern);
        }
        
        return new AST.VariableDeclarator(pattern, init, start, this.nodeEnd());
    },
    
    ReturnStatement: function() {
    
        if (!this.context.isFunction)
            this.fail("Return statement outside of function");
        
        var start = this.nodeStart();
        
        this.read("return");
        var value = this.peekEnd() ? null : this.Expression();
        
        this.Semicolon();
        
        return new AST.ReturnStatement(value, start, this.nodeEnd());
    },
    
    BreakStatement: function() {
    
        var start = this.nodeStart(),
            context = this.context,
            labelSet = context.labelSet;
        
        this.read("break");
        var label = this.peekEnd() ? null : this.Identifier();
        this.Semicolon();
        
        var node = new AST.BreakStatement(label, start, this.nodeEnd());
        
        if (label) {
        
            if (labelSet.get(label.value) === 0)
                this.fail("Invalid label", label);
                
        } else if (context.loopDepth === 0 && context.switchDepth === 0) {
        
            this.fail("Break not contained within a switch or loop", node);
        }
        
        return node;
    },
    
    ContinueStatement: function() {
    
        var start = this.nodeStart(),
            context = this.context,
            labelSet = context.labelSet;
        
        this.read("continue");
        var label = this.peekEnd() ? null : this.Identifier();
        this.Semicolon();
        
        var node = new AST.ContinueStatement(label, start, this.nodeEnd());
        
        if (label) {
        
            if (labelSet.get(label.value) !== 2)
                this.fail("Invalid label", label);
                
        } else if (context.loopDepth === 0) {
        
            this.fail("Continue not contained within a loop", node);
        }
        
        return node;
    },

    ThrowStatement: function() {
    
        var start = this.nodeStart();
        
        this.read("throw");
        
        var expr = this.peekEnd() ? null : this.Expression();
        
        if (expr === null)
            this.fail("Missing throw expression");
        
        this.Semicolon();
        
        return new AST.ThrowStatement(expr, start, this.nodeEnd());
    },
    
    DebuggerStatement: function() {
    
        var start = this.nodeStart();
        
        this.read("debugger");
        this.Semicolon();
        
        return new AST.DebuggerStatement(start, this.nodeEnd());
    },
    
    IfStatement: function() {
    
        var start = this.nodeStart();
        
        this.read("if");
        this.read("(");
        
        var test = this.Expression(),
            body = null,
            elseBody = null;
        
        this.read(")");
        body = this.Statement();
        
        if (this.peek() === "else") {
        
            this.read();
            elseBody = this.Statement();
        }
        
        return new AST.IfStatement(test, body, elseBody, start, this.nodeEnd());
    },
    
    DoWhileStatement: function(label) {
    
        var start = this.nodeStart(),
            body, 
            test;
        
        if (label) 
            this.setLoopLabel(label);
        
        this.read("do");
        
        this.context.loopDepth += 1;
        body = this.Statement();
        this.context.loopDepth -= 1;
        
        this.read("while");
        this.read("(");
        
        test = this.Expression();
        
        this.read(")");
        
        return new AST.DoWhileStatement(body, test, start, this.nodeEnd());
    },
    
    WhileStatement: function(label) {
    
        var start = this.nodeStart();
        
        if (label) 
            this.setLoopLabel(label);
        
        this.read("while");
        this.read("(");
        var expr = this.Expression();
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.WhileStatement(
            expr, 
            statement, 
            start, 
            this.nodeEnd());
    },
    
    ForStatement: function(label) {
    
        var start = this.nodeStart(),
            init = null,
            test,
            step;
        
        if (label) 
            this.setLoopLabel(label);
        
        this.read("for");
        this.read("(");
        
        // Get loop initializer
        switch (this.peek()) {
        
            case ";":
                break;
                
            case "var":
            case "const":
                init = this.VariableDeclaration(true);
                break;
            
            case "IDENTIFIER":
            
                if (this.peekLet()) {
                
                    init = this.VariableDeclaration(true);
                    break;
                }
            
            default:
                init = this.Expression(true);
                break;
        }
        
        if (init) {
        
            if (this.peek() === "in")
                return this.ForInStatement(init, start);
        
            if (this.peekKeyword("of"))
                return this.ForOfStatement(init, start);
        }
        
        this.read(";");
        test = this.peek() === ";" ? null : this.Expression();
        
        this.read(";");
        step = this.peek() === ")" ? null : this.Expression();
        
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.ForStatement(
            init, 
            test, 
            step, 
            statement, 
            start, 
            this.nodeEnd());
    },
    
    ForInStatement: function(init, start) {
    
        this.checkForInit(init, "in");
        
        this.read("in");
        var expr = this.Expression();
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.ForInStatement(
            init, 
            expr, 
            statement, 
            start, 
            this.nodeEnd());
    },
    
    ForOfStatement: function(init, start) {
    
        this.checkForInit(init, "of");
        
        this.readKeyword("of");
        var expr = this.AssignmentExpression();
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.ForOfStatement(
            init, 
            expr, 
            statement, 
            start, 
            this.nodeEnd());
    },
    
    WithStatement: function() {
    
        var start = this.nodeStart();
        
        this.read("with");
        this.read("(");
        
        var node = new AST.WithStatement(
            this.Expression(), 
            (this.read(")"), this.Statement()),
            start,
            this.nodeEnd());
            
        this.addStrictError("With statement is not allowed in strict mode", node);
        
        return node;
    },
    
    SwitchStatement: function() {
    
        var start = this.nodeStart();
        
        this.read("switch");
        this.read("(");
        
        var head = this.Expression(),
            hasDefault = false,
            cases = [],
            node;
        
        this.read(")");
        this.read("{");
        this.context.switchDepth += 1;
        
        while (this.peekUntil("}")) {
        
            node = this.SwitchCase();
            
            if (node.test === null) {
            
                if (hasDefault)
                    this.fail("Switch statement cannot have more than one default", node);
                
                hasDefault = true;
            }
            
            cases.push(node);
        }
        
        this.context.switchDepth -= 1;
        this.read("}");
        
        return new AST.SwitchStatement(head, cases, start, this.nodeEnd());
    },
    
    SwitchCase: function() {
    
        var start = this.nodeStart(),
            expr = null, 
            list = [],
            type;
        
        if (this.peek() === "default") {
        
            this.read();
        
        } else {
        
            this.read("case");
            expr = this.Expression();
        }
        
        this.read(":");
        
        while (type = this.peekUntil("}")) {
        
            if (type === "case" || type === "default")
                break;
            
            list.push(this.Statement());
        }
        
        return new AST.SwitchCase(expr, list, start, this.nodeEnd());
    },
    
    TryStatement: function() {
    
        var start = this.nodeStart();
        
        this.read("try");
        
        var tryBlock = this.Block(),
            handler = null,
            fin = null;
        
        if (this.peek() === "catch")
            handler = this.CatchClause();
        
        if (this.peek() === "finally") {
        
            this.read("finally");
            fin = this.Block();
        }
        
        return new AST.TryStatement(tryBlock, handler, fin, start, this.nodeEnd());
    },
    
    CatchClause: function() {
    
        var start = this.nodeStart();
        
        this.read("catch");
        this.read("(");
        var param = this.BindingPattern();
        this.read(")");
        
        return new AST.CatchClause(param, this.Block(), start, this.nodeEnd());
    },
    
    // === Declarations ===
    
    StatementList: function(prologue, isModule) {
    
        var list = [],
            element,
            node,
            dir;
        
        // TODO: is this wrong for braceless statement lists?
        while (this.peekUntil("}")) {
        
            list.push(element = this.Declaration(isModule));
            
            // Check for directives
            if (prologue) {
            
                if (element.type === "ExpressionStatement" &&
                    element.expression.type === "StringLiteral") {
                
                    // Get the non-escaped literal text of the string
                    node = element.expression;
                    dir = this.input.slice(node.start + 1, node.end - 1);

                    // Check for strict mode
                    if (dir === "use strict")
                        this.setStrict(true);
                        
                } else {
                
                    prologue = false;
                }
            }
        }
        
        return list;
    },
    
    Declaration: function(isModule) {
    
        switch (this.peek()) {
            
            case "function": return this.FunctionDeclaration();
            case "class": return this.ClassDeclaration();
            case "const": return this.LexicalDeclaration();
            
            case "import": 
            
                if (isModule)
                    return this.ImportDeclaration();
            
            case "export":
                
                if (isModule)
                    return this.ExportDeclaration();
                
                break;
            
            case "IDENTIFIER":
            
                if (this.peekLet())
                    return this.LexicalDeclaration();
                
                if (this.peekModule())
                    return this.ModuleDefinition();
                
                break;
        }
        
        return this.Statement();
    },
    
    LexicalDeclaration: function() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.nodeEnd();
        
        return node;
    },
    
    // === Functions ===
    
    FunctionDeclaration: function() {
    
        var start = this.nodeStart(),
            kind = "",
            tok;
        
        tok = this.peekToken();
        
        if (tok.type === "IDENTIFIER" && isFunctionModifier(tok.value)) {
        
            this.read();
            kind = tok.value;
        }
        
        this.read("function");
        
        if (!kind && this.peek() === "*") {
            
            this.read();
            kind = "generator";
        }
        
        this.pushContext(true);
        this.context.functionType = kind;
        
        var ident = this.BindingIdentifier(),
            params = this.FormalParameters(),
            body = this.FunctionBody();

        this.checkParameters(params);
        this.popContext();
        
        return new AST.FunctionDeclaration(
            kind,
            ident,
            params,
            body,
            start,
            this.nodeEnd());
    },
    
    FunctionExpression: function() {
    
        var start = this.nodeStart(),
            ident = null,
            kind = "",
            tok;
        
        tok = this.peekToken();
        
        if (tok.type === "IDENTIFIER" && isFunctionModifier(tok.value)) {
        
            this.read();
            kind = tok.value;
        }
        
        this.read("function");
        
        if (!kind && this.peek() === "*") {
            
            this.read();
            kind = "generator";
        }
        
        this.pushContext(true);
        this.context.functionType = kind;
        
        if (this.peek() !== "(")
            ident = this.BindingIdentifier();
        
        var params = this.FormalParameters(),
            body = this.FunctionBody();
        
        this.checkParameters(params);
        this.popContext();
        
        return new AST.FunctionExpression(
            kind,
            ident,
            params,
            body,
            start,
            this.nodeEnd());
    },
    
    MethodDefinition: function(name) {
    
        var start = name ? name.start : this.nodeStart(),
            kind = "",
            val;
        
        if (!name && this.peek("name") === "*") {
        
            this.read();
            
            kind = "generator";
            name = this.PropertyName();
        
        } else {
        
            if (!name)
                name = this.PropertyName();
            
            if (name.type === "Identifier" && this.peek("name") !== "(") {
            
                val = name.value;
                
                if (val === "get" || val === "set" || isFunctionModifier(val)) {
                
                    kind = name.value;
                    name = this.PropertyName();
                }
            }
        }
        
        this.pushContext(true);
        
        if (kind === "generator" || isFunctionModifier(kind))
            this.context.functionType = kind;
        
        var params = kind === "get" || kind === "set" ?
            this.AccessorParameters(kind) :
            this.FormalParameters();
        
        var body = this.FunctionBody();
        
        this.checkParameters(params);
        this.popContext();
        
        return new AST.MethodDefinition(
            kind,
            name,
            params,
            body,
            start,
            this.nodeEnd());
    },
    
    AccessorParameters: function(kind) {
    
        var list = [];
        
        this.read("(");
        
        if (kind === "set")
            list.push(this.FormalParameter(false));
        
        this.read(")");
        
        return list;
    },
    
    FormalParameters: function() {
    
        var list = [];
        
        this.read("(");
        
        while (this.peekUntil(")")) {
            
            if (list.length > 0)
                this.read(",");
            
            // Parameter list may have a trailing rest parameter
            if (this.peek() === "...") {
            
                list.push(this.RestParameter());
                break;
            }
            
            list.push(this.FormalParameter(true));
        }
        
        this.read(")");
        
        return list;
    },
    
    FormalParameter: function(allowDefault) {
    
        var start = this.nodeStart(),
            pattern = this.BindingPattern(),
            init = null;
        
        if (allowDefault && this.peek() === "=") {
        
            this.read("=");
            init = this.AssignmentExpression();
        }
        
        return new AST.FormalParameter(pattern, init, start, this.nodeEnd());
    },
    
    RestParameter: function() {
    
        var start = this.nodeStart();
        
        this.read("...");
        
        return new AST.RestParameter(this.BindingIdentifier(), start, this.nodeEnd());
    },
    
    FunctionBody: function() {
        
        this.context.functionBody = true;
        
        var start = this.nodeStart();
        
        this.read("{");
        var statements = this.StatementList(true, false);
        this.read("}");
        
        return new AST.FunctionBody(statements, start, this.nodeEnd());
    },
    
    ArrowFunctionHead: function(kind, formals, start) {
    
        // Context must have been pushed by caller
        this.context.isFunction = true;
        this.context.functionType = kind;
        
        // Transform and validate formal parameters
        var params = this.checkArrowParameters(formals);
        
        return new AST.ArrowFunctionHead(params, start, this.nodeEnd());
    },
    
    ArrowFunctionBody: function(head, noIn) {
    
        this.read("=>");
        
        var params = head.parameters,
            start = head.start,
            kind = this.context.functionType;
        
        // Use function body context even if parsing expression body form
        this.context.functionBody = true;
        
        var body = this.peek() === "{" ?
            this.FunctionBody() :
            this.AssignmentExpression(noIn);
        
        this.popContext();
        
        return new AST.ArrowFunction(kind, params, body, start, this.nodeEnd());
    },
    
    // === Classes ===
    
    ClassDeclaration: function() {
    
        var start = this.nodeStart(),
            ident = null,
            base = null;
        
        this.read("class");
        
        ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.MemberExpression(true);
        }
        
        return new AST.ClassDeclaration(
            ident,
            base,
            this.ClassBody(),
            start,
            this.nodeEnd());
    },
    
    ClassExpression: function() {
    
        var start = this.nodeStart(), 
            ident = null,
            base = null;
        
        this.read("class");
        
        if (this.peek() === "IDENTIFIER")
            ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.MemberExpression(true);
        }
        
        return new AST.ClassExpression(
            ident, 
            base, 
            this.ClassBody(), 
            start, 
            this.nodeEnd());
    },
    
    ClassBody: function() {
        
        var start = this.nodeStart(),
            nameSet = new IntMap, 
            staticSet = new IntMap,
            list = [],
            node;
        
        this.pushContext(false);
        this.setStrict(true);
        this.read("{");
        
        while (this.peekUntil("}", "name")) {
        
            list.push(node = this.ClassElement());
            this.checkPropertyName(node.method, node.static ? staticSet : nameSet);
        }
        
        this.read("}");
        this.popContext();
        
        return new AST.ClassBody(list, start, this.nodeEnd());
    },
    
    ClassElement: function() {
    
        var start = this.nodeStart(),
            isStatic = false;
        
        // Check for static modifier
        if (this.peekToken("name").value === "static" &&
            this.peekAt("name", 1) !== "(") {
        
            isStatic = true;
            this.read();
        }
        
        var method = this.MethodDefinition(),
            name = method.name;
        
        if (isStatic) {
        
            if (name.type === "Identifier" && name.value === "prototype")
                this.fail("Invalid prototype property in class definition", name);
            
        } else {
        
            if (name.type === "Identifier" && name.value === "constructor" && method.kind !== "")
                this.fail("Invalid constructor property in class definition", name);
        }
        
        return new AST.ClassElement(isStatic, method, start, this.nodeEnd());
    },
    
    // === Modules ===
    
    ModuleDefinition: function() {
    
        var start = this.nodeStart(),
            ident,
            target;
        
        this.readKeyword("module");
        
        ident = this.BindingIdentifier();
        
        if (this.peek() === "=") {
    
            this.read();
            target = this.ModulePath();
            this.Semicolon();
        
            return new AST.ModuleAlias(
                ident,
                target,
                start,
                this.nodeEnd());
            
        } else if (this.peekKeyword("from")) {
    
            this.read();
            target = this.ModuleSpecifier();
            this.Semicolon();
        
            return new AST.ModuleImport(
                ident,
                target,
                start,
                this.nodeEnd());
        }
        
        return new AST.ModuleDeclaration(
            ident,
            this.ModuleBody(),
            start,
            this.nodeEnd());
    },
    
    ModuleDeclaration: function() {
        
        var start = this.nodeStart();
        
        this.readKeyword("module");
        
        return new AST.ModuleDeclaration(
            this.BindingIdentifier(),
            this.ModuleBody(),
            start,
            this.nodeEnd());
    },
    
    ModuleBody: function() {
    
        this.pushContext(false);
        this.setStrict(true);
        
        var start = this.nodeStart();
        
        this.read("{");
        var list = this.StatementList(true, true);
        this.read("}");
        
        this.popContext();
        
        return new AST.ModuleBody(list, start, this.nodeEnd());
    },
    
    ModuleSpecifier: function() {
    
        return this.peek() === "STRING" ? this.StringLiteral() : this.ModulePath();
    },
    
    ImportDeclaration: function() {
    
        var start = this.nodeStart(),
            ident,
            from;
        
        this.read("import");
        
        switch (this.peek()) {
        
            case "IDENTIFIER":
            
                ident = this.BindingIdentifier();
                this.readKeyword("from");
                from = this.ModuleSpecifier();
                this.Semicolon();
                
                return new AST.ImportDefaultDeclaration(ident, from, start, this.nodeEnd());
            
            case "STRING":
            
                from = this.ModuleSpecifier();
                this.Semicolon();
                
                return new AST.ImportDeclaration(null, from, start, this.nodeEnd());
        }
        
        var list = [];
        
        this.read("{");
    
        while (this.peekUntil("}")) {
    
            list.push(this.ImportSpecifier());
        
            if (this.peek() === ",") 
                this.read();
        }
    
        this.read("}");
        this.readKeyword("from");
        from = this.ModuleSpecifier();
        this.Semicolon();
        
        return new AST.ImportDeclaration(list, from, start, this.nodeEnd());
    },
    
    ImportSpecifier: function() {
    
        var start = this.nodeStart(),
            hasLocal = false,
            local = null,
            remote;
        
        if (this.peek() !== "IDENTIFIER") {
        
            // Re-scan token as an identifier name
            this.unpeek();
            remote = this.IdentifierName();
            hasLocal = true;
            
        } else {
        
            remote = this.Identifier();
            hasLocal = this.peekKeyword("as");
        }
        
        if (hasLocal) {
        
            this.readKeyword("as");
            local = this.BindingIdentifier();
            
        } else {
        
            this.checkBindingTarget(remote);
        }
        
        return new AST.ImportSpecifier(remote, local, start, this.nodeEnd());
    },
    
    ExportDeclaration: function() {
    
        var start = this.nodeStart(),
            binding;
        
        this.read("export");
        
        switch (this.peek()) {
                
            case "var":
            case "const":
            
                binding = this.VariableDeclaration(false);
                this.Semicolon();
                break;
            
            case "function":
            
                binding = this.FunctionDeclaration();
                break;
            
            case "class":
            
                binding = this.ClassDeclaration();
                break;
            
            case "IDENTIFIER":
            
                if (this.peekLet()) {
                
                    binding = this.VariableDeclaration(false);
                    this.Semicolon();
                    break;
                }
                
                if (this.peekFunctionModifier()) {
                
                    binding = this.FunctionDeclaration();
                    break;
                }
            
                if (this.peekModule()) {
                
                    binding = this.ModuleDeclaration();
                    break;
                }
                
            default:
                
                binding = this.ExportsList();
                this.Semicolon();
                break;
        }
        
        return new AST.ExportDeclaration(binding, start, this.nodeEnd());
    },
    
    ExportsList: function() {
    
        var start = this.nodeStart(),
            list = null,
            from = null;
        
        if (this.peek() === "*") {
        
            this.read();
            this.readKeyword("from");
            from = this.ModuleSpecifier();
            
        } else {
        
            list = [];
            
            this.read("{");
            
            while (this.peekUntil("}")) {
        
                list.push(this.ExportSpecifier());
            
                if (this.peek() === ",") 
                    this.read();
            }
            
            this.read("}");
            
            if (this.peekKeyword("from")) {
            
                this.read();
                from = this.ModuleSpecifier();
            
            } else {
            
                // TODO: Make sure that export specifiers do
                // not reference reserved words!
            }
        }
        
        return new AST.ExportsList(list, from, start, this.nodeEnd());
    },
    
    ExportSpecifier: function() {
    
        var start = this.nodeStart(),
            local = this.IdentifierName(),
            remote = null;
        
        if (this.peekKeyword("as")) {
        
            this.read();
            remote = this.IdentifierName();
        }
        
        return new AST.ExportSpecifier(local, remote, start, this.nodeEnd());
    },
    
    ModulePath: function() {
    
        var start = this.nodeStart(),
            path = [];
        
        while (true) {
        
            path.push(this.Identifier());
            
            if (this.peek() === ".") this.read();
            else break;
        }
        
        return new AST.ModulePath(path, start, this.nodeEnd());
    }
    
} });

// Add externally defined methods
Object.assign(Parser.prototype, Transform.prototype);
Object.assign(Parser.prototype, Validate.prototype);


exports.Parser = Parser; return exports; }).call(this, {});

var main = (function(exports) {

var AST = AST_.AST;
var Parser = Parser_.Parser;
var Scanner = Scanner_.Scanner;



function parseModule(input, options) {

    return new Parser(input, options).Module();
}

function parseScript(input, options) {

    return new Parser(input, options).Script();
}


exports.Parser = Parser; exports.Scanner = Scanner; exports.AST = AST; exports.parseModule = parseModule; exports.parseScript = parseScript; return exports; }).call(this, {});

Object.keys(main).forEach(function(k) { exports[k] = main[k]; });


}, [], "esparse");