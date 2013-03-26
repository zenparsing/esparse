/*=es6now=*/(function(fn, deps) { if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof __MODULE === 'function') __MODULE(fn, deps); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof window !== 'undefined' && "Lowdown") fn.call(window, null, window["Lowdown"] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { "use strict"; 

var __modules = [], __exports = [], __global = this; 

function __require(i, obj) { 
    var e = __exports; 
    if (e[i] !== void 0) return e[i]; 
    __modules[i].call(__global, e[i] = (obj || {})); 
    return e[i]; 
} 

__modules[0] = function(exports) {
// Initialize es6now runtime environment
var initialize = __require(1).initialize;

initialize();
 
var _M0 = __require(2); 

exports.configure = _M0.configure;
exports.load = _M0.load;
};

__modules[1] = function(exports) {
var _M0 = __require(3); 
exports.initialize = _M0.initialize;
};

__modules[2] = function(exports) {
var ScriptLoader = __require(4);
var Promise = __require(5).Promise;

var SCHEME_RE = /^[a-z]+:/i;

var HOP = {}.hasOwnProperty,
    globalObject = this,
    home = dirname(globalObject.location.pathname),
    modules = {},
    globalNames = {},
    urlMap = {},
    initialized = false,
    pending = 0,
    pendingList = [],
    noCache = false;

// Loads a module and returns a promise for the module object
function load(url) {

    initialize();
    return loadModule(url, home).then((function(m) { return m.deref(); }));
}

// Configures the module loader
function configure(options) {

    if (!initialize(options))
        throw new Error("Loader has already been initialized.");
}

// Defines a module
function define(url, exports) {

    url = resolve(url, home);
    
    if (hasKey(modules, url))
        throw new Error("Module '" + url + "' is already loaded.");
    
    modules[url] = {
    
        future: Promise.when(M),
        deref: function() { return exports; }
    };
}

// The global module registration function
function __MODULE(fn, dep) {

    ScriptLoader.getContext((function(context) {
    
        if (!context.factory) {
        
            context.factory = fn;
            context.dependencies = dep;
        }
    }));
}

// Loads a script and returns a promise for completion
function loadScript(url) {

    var src = url + (noCache ? ("?" + new Date().getTime()) : "");
    
    globalObject.__MODULE = __MODULE;
    
    return ScriptLoader.loadScript(src);
}
    
// Initializes the global environment
function initialize(config) {

    if (initialized)
        return false;
    
    config = config || {};
        
    if (typeof config.mappings === "object" && config.mappings)
        urlMap = config.mappings;
    
    if (config.overrideCache === true)
        noCache = true;
    
    return initialized = true;
}

// Loads a module
function loadModule(url, dir) {

    var M, promise;
    
    url = resolve(url, dir);
    dir = dirname(url);
    
    // Return promise if already loading
    if (hasKey(modules, url))
        return modules[url].future;
    
    promise = new Promise;
    
    M = modules[url] = {
    
        future: promise.future,
        exports: null,
        factory: null,
        
        deref: function() {
    
            if (this.exports)
                return this.exports;
                
            if (!this.factory)
                throw new Error("Module '" + url + "' could not be loaded.");
            
            this.factory.call(globalObject, 
                (function(url) { return modules[resolve(url, dir)].deref(); }), 
                this.exports = {});
        
            return this.exports;
        }
    };
    
    pending += 1;
    pendingList.push((function() { return resolvePromise(); }));

    loadScript(url).then((function(value) {
    
        var deps = [];
        
        if (value && value.factory) {
        
            var fn = value.factory,
                req = value.dependencies || [];
            
            M.factory = fn;
            
            // Load dependencies
            while (req.length)
                deps.push(loadModule(req.shift(), dir));
        
        } else if (hasKey(globalNames, url)) {
        
            M.exports = globalObject[globalNames[url]] || null;
        }
        
        // If everything requested has been fetched, resolve all
        // promises (will break any cycles that exist).
        if (--pending === 0)
            while (pendingList.length > 0)
                pendingList.pop()();
        
        Promise.whenAll(deps).then(
            (function(val) { return resolvePromise(); }), 
            (function(err) { return rejectPromise(err); }));
    }));
    
    return M.future;
    
    function resolvePromise() {
    
        if (promise) {
        
            promise.resolve(M);
            promise = null;
        }
    }
    
    function rejectPromise(err) {
    
        if (promise) {
        
            promise.reject(M);
            promise = null;
        }
    }
}


// Resolves a module reference
function resolve(url, dir) {

    return normalize(mapURL(url), dir);
}

// Performs module namespace mappings
function mapURL(url) {

    var entry;
    
    if (hasKey(urlMap, url)) {
    
        entry = urlMap[url];
        
        if (typeof entry === "string")
            entry = { url: entry };
        
        // Store global name for loading non-modules
        if (entry.globalName)
            globalNames[normalize(entry.url || url, home)] = entry.globalName;
                
        if (entry.url && entry.url !== url) {
        
            url = mapURL(entry.url);
            
            if (url === entry.url)
                url = normalize(url, home);
        }
    }
    
    return url;
}

// Returns true if the object has the specified property
function hasKey(o, k) { return HOP.call(o, k); }

// Normalized a URL relative to a directory
function normalize(url, dir) {

    if (!SCHEME_RE.test(url)) {
    
        if (url.charAt(0) !== "/")
            url = dir + "/" + url;
        
        url = collapse(url);
    }
    
    return url;
}

// Gets the directory from a path
function dirname(path) {

    var i = path.lastIndexOf("/");
    return (i >= 0) ? path.slice(0, i) : "";
}

// Removes relative segments from a path
function collapse(path) {

    var a = path.split("/"), out = [], i, e;
    
    for (i = 0; i < a.length; ++i) {
    
        e = a[i];
        
        if (e === ".") continue;
        else if (e === ".." && out.length > 0) out.pop();
        else out.push(e);
    }
    
    return out.join("/");
}

exports.load = load;
exports.configure = configure;
exports.define = define;
};

__modules[3] = function(exports) {
var Class = __require(6).Class;
var emulate = __require(7).emulate;

var initialized = false,
    global = this;

function initialize() {

    if (initialized)
        return;
    
    emulate();
    
    global.es6now = {
    
        Class: Class
    };
    
    initialized = true;
}

exports.initialize = initialize;
};

__modules[4] = function(exports) {
var Promise = __require(5).Promise;

var READY_STATE = "loaded|complete",
    TEST_INTERACTIVE = !!this.ActiveXObject, // effectively, IE
    document = this.document,
    scripts = {},
    uid = 0,
    timeout = 10000,
    queue = [],
    head;

// Injects a script tag into the document
function loadScript(src, data) {

    var s = document.createElement("script"),
        promise = new Promise(),
        k = "@" + (uid++),
        value;
    
    value = {
    
        element: s, 
        src: src, 
        data: data
    };
    
    scripts[k] = { promise: promise, value: value };
    
    s._key = k;
    s.type = "text/javascript";
    s.src = src;
    s.async = true;
    
    s.onload = 
    s.onerror = 
    s.onreadystatechange = (function() {
    
        if (typeof s.readyState === "undefined" ||
            READY_STATE.indexOf(s.readyState) >= 0) {
        
            completed(s);
        }
    });
    
    toHead(s);
    startTimer(s);
    setContext(scripts[k]);
    
    return promise.future;
}

// Starts a timeout timer for a script
function startTimer(s) {

    poll();
    
    function poll() {
    
        // Opera reports "interactive" while script is fetching.  Poll
        // in order to determine if HTTP error is encountered
        if (s.readyState === "interactive") {
        
            s._timer = setTimeout(poll, 200);
        
        } else if (!s._timer) {
        
            s._timer = setTimeout(poll, timeout);
        
        } else {
        
            s._timer = 0;
            completed(s);
        }
    }
}

// Called when script tag has finished executing
function completed(s) {

    if (s._done) 
        return;
    
    var key = s._key,
        obj = scripts[key],
        val = obj.value;
    
    // Clear timeout
    if (s._timer) 
        clearTimeout(s._timer);
    
    // Clear memory in IE
    if (s.clearAttributes) 
        try { s.clearAttributes(); } 
        catch (x) {}
    
    // Cleanup
    delete scripts[key];
    s._done = true;
    
    setContext(obj);
    obj.promise.resolve(val);
}

// Executes a callback when the calling script src is known
function getContext(fn) {

    var key, val;
    
    queue.push(fn);

    // For IE, find executing script by looking for "interactive" state
    if (TEST_INTERACTIVE) {
    
        for (key in scripts) {
        
            val = scripts[key].value;
            
            if (val.element.readyState === "interactive") {
            
                setContext(scripts[key]);
                break;
            }
        }
    }
}

// Sets the current script context
function setContext(script) {

    var fn;
    
    // Call all queued context callbacks
    while (fn = queue.shift())
        fn.call(script.value.element, script.value);
}

// Inserts an element in the head of the document
function toHead(elem) {

    var d = elem.ownerDocument,
        h = (head = d.getElementsByTagName("head")[0]) || 
            d.getElementsByTagName("body")[0] ||
            d.documentElement.firstChild;
    
    h.insertBefore(elem, h.firstChild);
}

exports.loadScript = loadScript;
exports.getContext = getContext;
};

__modules[5] = function(exports) {
var _M0 = __require(8); Object.keys(_M0).forEach(function(k) { exports[k] = _M0[k]; });

};

__modules[6] = function(exports) {
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

    var names = Object.getOwnPropertyNames(obj);
    
    for (var i = 0, name; i < names.length; ++i)
        fn(names[i], Object.getOwnPropertyDescriptor(obj, names[i]));
    
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

function defineMethods(to, from, classMethods) {

    forEachDesc(from, (function(name, desc) {
    
        if (STATIC.test(name) === classMethods)
            Object.defineProperty(to, classMethods ? name.replace(STATIC, "") : name, desc);
    }));
    
    return to;
}

function Class(base, def) {

    function constructor() { 
    
        if (parent && parent.constructor)
            parent.constructor.apply(this, arguments);
    }
    
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
    
    // Generate the method collection, closing over "super"
    var props = def(parent);
    
    // Get constructor
    if (hasOwn(props, "constructor"))
        constructor = props.constructor;
    
    // Make constructor non-enumerable and assign a default
    // if none is provided
    Object.defineProperty(props, "constructor", {
    
        enumerable: false,
        writable: true,
        configurable: true,
        value: constructor
    });
    
    // Create prototype object
    var proto = defineMethods(Object.create(parent), props, false);
    
    // Set constructor's prototype
    constructor.prototype = proto;
    
    // Set class "static" methods
    defineMethods(constructor, props, true);
    
    // "Inherit" from base constructor
    if (base) inherit(constructor, base);
    
    return constructor;
}



exports.Class = Class;
};

__modules[7] = function(exports) {
var ES5 = __require(9);

var global = this;

function addProps(obj, props) {

    Object.keys(props).forEach((function(k) {
    
        if (typeof obj[k] !== "undefined")
            return;
        
        Object.defineProperty(obj, k, {
        
            value: props[k],
            configurable: true,
            enumerable: false,
            writable: true
        });
    }));
}

function emulate() {

    ES5.emulate();

    addProps(Object, {
    
        is: function(a, b) {
        
            // TODO
        },
        
        assign: function(target, source) {
        
            Object.keys(source).forEach((function(k) { return target[k] = source[k]; }));
            return target;
        },
        
        mixin: function(target, source) {
        
            Object.getOwnPropertyNames(source).forEach((function(name) {
            
                var desc = Object.getOwnPropertyDescriptor(source, name);
                Object.defineProperty(target, name, desc);
            }));
            
            return target;
        }
    });
    
    addProps(Number, {
    
        EPSILON: Number.EPSILON || (function() {
        
            var next, result;
            
            for (next = 1; 1 + next !== 1; next = next / 2)
                result = next;
            
            return result;
        }()),
        
        MAX_INTEGER: 9007199254740992,
        
        isFinite: function(val) {
            
            return typeof val === "number" && isFinite(val);
        },
        
        isNaN: function(val) {
        
            return typeof val === "number" && isNaN(val);
        },
        
        isInteger: function(val) {
        
            typeof val === "number" && val | 0 === val;
        },
        
        toInteger: function(val) {
            
            return val | 0;
        }
    });
    
    addProps(Array, {
    
        from: function(arg) {
            // TODO
        },
        
        of: function() {
            // ?
        }
    
    });
    
    addProps(String.prototype, {
        
        repeat: function(count) {
        
            return new Array(count + 1).join(this);
        },
        
        startsWith: function(search, start) {
        
            return this.indexOf(search, start) === start;
        },
        
        endsWith: function(search, end) {
        
            return this.slice(-search.length) === search;
        },
        
        contains: function(search, pos) {
        
            return this.indexOf(search, pos) !== -1;
        }
    });
    
    if (typeof Map === "undefined") global.Map = (function() {
    
        function Map() {
        
        }
        
        return Map;
        
    })();
    
    if (typeof Set === "undefined") global.Set = (function() {
    
        function Set() {
        
        }
        
        return Set;
        
    })();
    
}



exports.emulate = emulate;
};

__modules[8] = function(exports) {
var identity = (function(obj) { return obj; }),
    freeze = Object.freeze || identity,
    queue = [],
    waiting = false,
    asap;

// UUID property names used for duck-typing
var DISPATCH = "07b06b7e-3880-42b1-ad55-e68a77514eb9",
    IS_FAILURE = "7d24bf0f-d8b1-4783-b594-cec32313f6bc";

var EMPTY_LIST_MSG = "List cannot be empty.",
    WAS_RESOLVED_MSG = "The promise has already been resolved.",
    CYCLE_MSG = "A promise cycle was detected.";

var THROW_DELAY = 50;

// Enqueues a message
function enqueue(future, args) {

    queue.push({ fn: future[DISPATCH], args: args });
    
    if (!waiting) {
    
        waiting = true;
        asap(flush);
    }
}

// Flushes the message queue
function flush() {

    waiting = false;

    while (queue.length > 0) {
        
        // Send each message in queue
        for (var count = queue.length, msg; count > 0; --count) {
        
            msg = queue.shift();
            msg.fn.apply(void 0, msg.args);
        }
    }
}

// Returns a cycle error
function cycleError() {

    return failure(CYCLE_MSG);
}

// Future constructor
function Future(dispatch) {
    
    this[DISPATCH] = dispatch;
}

// Registers a callback for completion when a future is complete
Future.prototype.then = function then(onSuccess, onFail) {

    onSuccess || (onSuccess = identity);
    
    var resolve = (function(value) { return finish(value, onSuccess); }),
        reject = (function(value) { return finish(value, onFail); }),
        promise = new Promise(onQueue),
        target = this,
        done = false;
    
    onQueue(onSuccess, onFail);
    
    return promise.future;
    
    function onQueue(success, error) {
    
        if (success && resolve) {
        
            enqueue(target, [ resolve, null ]);
            resolve = null;
        }
        
        if (error && reject) {
        
            enqueue(target, [ null, reject ]);
            reject = null;
        }
    }
    
    function finish(value, transform) {
    
        if (!done) {
        
            done = true;
            promise.resolve(applyTransform(transform, value));
        }
    }
};

// Begins a deferred operation
function Promise(onQueue) {

    var token = {},
        pending = [],
        throwable = true,
        next = null;

    this.future = freeze(new Future(dispatch));
    this.resolve = resolve;
    this.reject = reject;
    
    freeze(this);
    
    // Dispatch function for future
    function dispatch(success, error, src) {
    
        var msg = [success, error, src || token];
        
        if (error)
            throwable = false;
        
        if (pending) {
        
            pending.push(msg);
            
            if (onQueue)
                onQueue(success, error);
        
        } else {
        
            // If a cycle is detected, convert resolution to a rejection
            if (src === token) {
            
                next = cycleError();
                maybeThrow();
            }
            
            enqueue(next, msg);
        }
    }
    
    // Resolves the promise
    function resolve(value) {
    
        if (!pending)
            throw new Error(WAS_RESOLVED_MSG);
        
        var list = pending;
        pending = false;
        
        // Create a future from the provided value
        next = when(value);

        // Send internally queued messages to the next future
        for (var i = 0; i < list.length; ++i)
            enqueue(next, list[i]);
        
        maybeThrow();
    }
    
    // Resolves the promise with a rejection
    function reject(error) {
    
        resolve(failure(error));
    }
    
    // Throws an error if the promise is rejected and there
    // are no error handlers
    function maybeThrow() {
    
        if (!throwable || !isFailure(next))
            return;
        
        setTimeout((function() {
        
            var error = null;
            
            // Get the error value
            next[DISPATCH](null, (function(val) { return error = val; }));
            
            // Throw it
            if (error && throwable)
                throw error;
            
        }), THROW_DELAY);
    }
}

// Returns a future for an object
function when(obj) {

    if (obj && obj[DISPATCH])
        return obj;
    
    if (obj && obj.then) {
    
        var promise = new Promise();
        obj.then(promise.resolve, promise.reject);
        return promise.future;
    }
    
    // Wrap a value in an immediate future
    return freeze(new Future((function(success) { return success && success(obj); })));
}

// Returns true if the object is a failed future
function isFailure(obj) {

    return obj && obj[IS_FAILURE];
}

// Creates a failure Future
function failure(value) {

    var future = new Future((function(success, error) { return error && error(value); }));
    
    // Tag the future as a failure
    future[IS_FAILURE] = true;
    
    return freeze(future);
}

// Applies a promise transformation function
function applyTransform(transform, value) {

    try { return (transform || failure)(value); }
    catch (ex) { return failure(ex); }
}

// Returns a future for every completed future in an array
function whenAll(list) {

    var count = list.length,
        promise = new Promise(),
        out = [],
        value = out,
        i;
    
    for (i = 0; i < list.length; ++i)
        waitFor(list[i], i);
    
    if (count === 0)
        promise.resolve(out);
    
    return promise.future;
    
    function waitFor(f, index) {
    
        when(f).then((function(val) { 
        
            out[index] = val;
            
            if (--count === 0)
                promise.resolve(value);
        
        }), (function(err) {
        
            value = failure(err);
            
            if (--count === 0)
                promise.resolve(value);
        }));
    }
}

// Returns a future for the first completed future in an array
function whenAny(list) {

    if (list.length === 0)
        throw new Error(EMPTY_LIST_MSG);
    
    var promise = new Promise(), i;
    
    for (i = 0; i < list.length; ++i)
        when(list[i]).then((function(val) { return promise.resolve(val); }), (function(err) { return promise.reject(err); }));
    
    return promise.future;
}

function iterate(fn) {

    var done = false,
        stop = (function(val) { done = true; return val; }),
        next = (function(last) { return done ? last : when(fn(stop)).then(next); });
    
    return when(null).then(next);
}

function forEach(list, fn) {

    var i = -1;
    
    return iterate((function(stop) { return (++i >= list.length) ? stop() : fn(list[i], i, list); }));
}

// === Event Loop API ===

asap = (function(global) {
    
    var msg = uuid(),
        process = global.process,
        window = global.window,
        msgChannel = null,
        list = [];
    
    if (process && typeof process.nextTick === "function") {
    
        // NodeJS
        return process.nextTick;
   
    } else if (window && window.addEventListener && window.postMessage) {
    
        // Modern Browsers
        if (window.MessageChannel) {
        
            msgChannel = new window.MessageChannel();
            msgChannel.port1.onmessage = onmsg;
        
        } else {
        
            window.addEventListener("message", onmsg, true);
        }
        
        return (function(fn) {
        
            list.push(fn);
            
            if (msgChannel !== null)
                msgChannel.port2.postMessage(msg);
            else
                window.postMessage(msg, "*");
            
            return 1;
        });
    
    } else {
    
        // Legacy
        return (function(fn) { return setTimeout(fn, 0); });
    }
        
    function onmsg(evt) {
    
        if (msgChannel || (evt.source === window && evt.data === msg)) {
        
            evt.stopPropagation();
            if (list.length) list.shift()();
        }
    }
    
    function uuid() {
    
        return [32, 16, 16, 16, 48].map((function(bits) { return rand(bits); })).join("-");
        
        function rand(bits) {
        
            if (bits > 32) 
                return rand(bits - 32) + rand(32);
            
            var str = (Math.random() * 0xffffffff >>> (32 - bits)).toString(16),
                len = bits / 4 >>> 0;
            
            if (str.length < len) 
                str = (new Array(len - str.length + 1)).join("0") + str;
            
            return str;
        }
    }
    
})(this);

Promise.when = when;
Promise.whenAny = whenAny;
Promise.whenAll = whenAll;
Promise.forEach = forEach;
Promise.iterate = iterate;
Promise.reject = failure;


exports.Promise = Promise;
};

__modules[9] = function(exports) {
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
    TRIM_S = /^\s+/,
    TRIM_E = /\s+$/,
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

// Emulates an ES5 environment
function emulate() {

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
        
            var p = o.__proto__ || o.constructor.prototype;
            return p;
        },
        
        /*
        
        getOwnPropertyNames is buggy since there is no way to get non-enumerable 
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
        
        var isoRE = /^(?:((?:[+-]\d{2})?\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{3})?)?)?(?:Z|([-+]\d{2}):(\d{2}))?$/,
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
    
    // Add JSON object
    if (typeof JSON === "undefined") global.JSON = (function() {
    
        var TOK = /[\[\]}{:,]|null|true|false|-?\d+(\.\d+)?([eE][+-]?\d+)?|"([^"\\]|\\[\s\S])*"|\s+/g,
            ESC = /[\\\"\x00-\x1F\u0080-\uFFFF]/g;
        
        function parse(s) {
        
            if (s.replace(TOK, "").length > 0)
                throw new Error("JSON syntax error");
            
            try { return (new Function("return (" + s + ");"))(); }
            catch (x) { throw new Error("JSON sytax error"); }
        }
        
        function esc(s) {
        
            switch (s) {
            
                case "\b": return "\\b";
                case "\t": return "\\t";
                case "\n": return "\\n";
                case "\f": return "\\f";
                case "\r": return "\\r";
                case '"': return '\\"';
                case "\\": return "\\\\";
                default: return "\\u" + ("0000" + s.charCodeAt(0).toString(16)).slice(-4);
            }
        }
        
        function stringify(o) {
        
            var i, a;
            
            switch (typeof o) {
            
                case "string":
                    return "\"" + o.replace(ESC, esc) + "\"";
                    
                case "boolean":
                    return o ? "true" : "false";
                    
                case "number":
                    return isFinite(o) ? o.toString() : "null";
                    
                case "object":
                
                    if (!o) {
                    
                        return "null";
                    
                    } else if (Array.isArray(o)) {
                    
                        for (a = [], i = 0; i < o.length; ++i) 
                            a.push(stringify(o[i]));
                        
                        return "[" + a.join(",") + "]";
                    
                    } else if (o.toJSON) {
                    
                        return stringify(o.toJSON());
                    
                    } else {
                    
                        for (a = Object.keys(o), i = 0; i < a.length; ++i)
                            a[i] = stringify(a[i]) + ":" + stringify(o[a[i]]);
                        
                        return "{" + a.join(",") + "}";
                    }
                    
            }
            
            throw new Error("Cannot convert object to JSON string.");
        }
        
        return { parse: parse, stringify: stringify };
        
    })();
}

exports.addKeys = addKeys;
exports.emulate = emulate;
};

__require(0, exports);


}, []);