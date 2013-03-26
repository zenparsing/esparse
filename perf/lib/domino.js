/*=es6now=*/(function(fn, deps) { if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof __MODULE === 'function') __MODULE(fn, deps); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof window !== 'undefined' && "") fn.call(window, null, window[""] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { "use strict"; 

var __modules = [], __exports = [], __global = this; 

function __require(i, obj) { 
    var e = __exports; 
    if (e[i] !== void 0) return e[i]; 
    __modules[i].call(__global, e[i] = (obj || {})); 
    return e[i]; 
} 

__modules[0] = function(exports) {
var DOMSet = __require(1).DOMSet;
var Promise = __require(2).Promise;

var Document = __require(3);
var HttpRequest = __require(4);

var document = this.document;

// TODO: Allow overidding the document?
function create(name, attr) {

	var dom = new DOMSet(document.createElement(name));
	if (attr) dom.setAttributes(attr);
	return dom;
}



exports.Promise = Promise;
exports.loaded = Document.loaded;
exports.http = HttpRequest.send;
exports.query = DOMSet.query;
exports.from = DOMSet.create;
exports.html = DOMSet.parse;
exports.encode = Document.encode;
exports.create = create;
};

__modules[1] = function(exports) {
var __this = this; var Element = __require(5);
var Metrics = __require(6);
var Trans = __require(7);
var Fragment = __require(8);
var Engine = __require(9);
var Node = __require(10);
var Keys = __require(11);

var Promise = __require(2).Promise;
var toArray = Node.toArray;

var AP = Array.prototype,
	CLASS_DELIM = / +/g,
	TRANS_PROPS = {
	
		"duration": 1,
		"delay": 1,
		"timingFunction": 1,
		"onend": 1,
		"onabort": 1,
		"useNative": 1,
		"properties": 1
	};

function eachClass(name, fn) {
    
    if (!name) return;
		
    if (name.indexOf(" ") >= 0) {
    
        name = name.split(CLASS_DELIM);
        
        for (var i = 0; i < name.length; ++i)
            fn(n, name[i], arg);
    
    } else {
    
        fn(n, name, arg);
    }
}

function parseHTML(html, doc) {

	return toArray(Fragment.create(html, doc).fragment.childNodes);
}

function notSupported() { 

    throw new Error("DOMSet operation not supported.");
}

var DOMSet = es6now.Class(function(__super) { return {

	constructor: function(a, sort) {
	
		if (typeof a === "string") {
		
			a = (a.charAt(0) === "<") ? parseHTML(a, sort) : Engine.query(a, sort);
			sort = false;
		
		} else if (Array.isArray(a)) {
		
			if (a.query)
				sort = false;
			
			a = AP.slice.call(a, 0);
		
		} else {
		
			a = Node.toArray(a);
		}
		
		if (sort)
			a = Engine.sort(a, true);
		
		Keys.set(a, DOMSet.prototype);
		
		return a;
	},
	
	// === Array Operations ===
	
	push: function() { notSupported() },
	pop: function() { notSupported() },
	reverse: function() { notSupported() },
	sort: function() { notSupported() },
	splice: function() { notSupported() },
	shift: function() { notSupported() },
	unshift: function() { notSupported() },
	
	map: function(fn, self) {
	
		return new DOMSet(AP.map.call(this, fn, self), true);
	},
	
	mapArray: function(fn, self) {
	
		return AP.map.call(this, fn, self);
	},
	
	slice: function(f, t) {
	
		return new DOMSet(AP.slice.call(this, f, t), false);
	},
	
	filter: function(a, b) {
	
		a = (typeof a === "string") ?
			Engine.filter(this, a, b) :
			AP.filter.call(this, a, b);
		
		return new DOMSet(a, false);
	},
	
	concat: function(a, b) {
	
		return new DOMSet(AP.concat.call(this, new DOMSet(a, b)), true);
	},
	
	forEach: function(fn, self) {
	
		AP.forEach.call(this, fn, self);
		return this;
	},
	
	elements: function() {
	
		return this.filter((function(n) { return n.nodeType === 1; }));
	},
	
	toArray: function() {
	
		return AP.slice.call(this, 0);
	},

	clone: function(deep) {
	
		return this.map((function(n) { return Element.clone(n, deep); }));
	},
	
	clear: function() { 
	
	    return this.forEach((function(node) { return Element.clear(node); }));
	},
	
	detach: function() {
	
	    return this.forEach((function(node) { return Element.detach(node); }));
	},
	
	dispose: function() {
	
	    return this.forEach((function(node) { return Element.dispose(node); }));
	},
	
	// === Getters and Setters ===
	
    get: function(key, def) {
	
	    return key.charAt(0) === "@" ?
	        this._first((function(n) { return Element.getData(n, key, def); })) :
	        this._first((function(n) { return n[key] === void 0 ? def : n[key]; }));
	},
	
	set: function(key, val) { var __this = this; 
	
	    if (typeof key === "object") {
	    
	        Object.keys(key).forEach((function(k) { return __this.set(k, key[k]); }));
	        return this;
	    }
	    
	    return key.charAt(0) === "@" ?
	        this.forEach((function(n) { return Element.setData(n, key, val); })) :
	        this.forEach((function(n) { return n[key] = val; }));
	},
	
	getText: function() { 
	
	    return this._first((function(node) { return Element.getText(node); }));
	},
	
	setText: function(val) { 
	
	    return this.forEach((function(node) { return Element.setText(node, val); })); 
	},
	
	getHTML: function() {
	
	    return this._firstElem((function(e) { return e.innerHTML || ""; }));
	},
	
	setHTML: function(html) {
	
		// Attempt to use innerHTML if singleton
		if (this.length === 1) {
		
			try {
			
				this[0].innerHTML = html;
				return this;
			}
			catch (x) {}
		}
		
		DOMSet.parse(html).replaceContent(this);
		return this;
	},
	
    // === Styles and CSS Classes ===
	
	computedStyle: function(name) {
	    
	    return this._firstElem((function(e) { return Element.computedStyle(e, name); }));
	},
	
	getStyle: function(name) {
	    
	    return this._firstElem((function(e) { return Element.getStyle(e, name); }));
	},
	
	setStyle: function(name, val) { var __this = this; 
	
	    if (typeof name === "object") {
	    
	        Object.keys(name).forEach((function(k) { return __this.setStyle(k, name[k]); }));
		    return this;
	    }
	    
	    return this.elements().forEach((function(e) { return Element.setStyle(e, name, val); }));
	},
	
	addClass: function(name) {
	
	    return this.elements().forEach((function(e) { return eachClass(name, (function(n) { return Element.addClass(e, n); })); }));
	},
	
	removeClass: function(name) {
	
	    return this.elements().forEach((function(e) { return eachClass(name, (function(n) { return Element.removeClass(e, n); })); }));
	},
	
	toggleClass: function(name) {
	
	    return this.elements().forEach((function(e) { return eachClass(name, (function(n) { return Element.toggleClass(e, n); })); }));
	},
	
	setClass: function(name, on) {
	
	    return this.elements().forEach((function(e) { return eachClass(name, (function(n) { return Element.setClass(e, n, on); })); }));
	},
	
	hasClass: function(name) {
	
	    return this._firstElem((function(e) {
	
            if (name.indexOf(" ") >= 0) {
            
                name = name.split(CLASS_DELIM);
                
                for (var i = 0; i < name.length; ++i)
                    if (!Element.hasClass(e, name[i]))
                        return false;
                
                return true;
            
            } else {
            
                return Element.hasClass(e, name);
            }
        }));
	},
	
	// === Attributes ===
	
	getAttribute: function(name) {
	
	    return this._firstElem((function(e) { return Element.getAttribute(e, name); }));
	},
	
	setAttribute: function(name, val) { var __this = this; 
	
	    if (typeof name === "object") {
	    
	        Object.keys(name).forEach((function(k) { return __this.setAttribute(k, name[k]); }));
    		return this;
	    }
	    
	    return this.elements().forEach((function(e) { return Element.setAttribute(e, name, val); }));
	},
	
	// === Events ===
	
	addEventListener: function(type, fn, capture) {
	
	    return this.forEach((function(n) { return Element.addListener(n, type, fn, capture); }));
	},
	
	removeEventListener: function(type, fn, capture) {
	
	    return this.forEach((function(n) { return Element.removeListener(n, type, fn, capture); }));
	},
	
	on: function(fn, capture) {
	
		if (typeof fn === "object") {
		
			for (var i in fn)
				this.addListener(i, fn[i], capture);
			
			return this;
		}
		
		return this.addEventListener(fn, capture);
	},
	
    // === Traversal ===
	
	query: function(sel) {
	
		return new DOMSet(Engine.search(this, sel), false);
	},
	
	firstElement: function() { return this.map(Element.firstElement) },
	firstChild: function() { return this.map((function(n) { return n.firstChild; })) },
	lastElement: function() { return this.map(Element.lastElement) },
	lastChild: function() { return this.map((function(n) { return n.lastChild; })) },
	nextElement: function() { return this.map(Element.nextElement) },
	nextSibling: function() { return this.map((function(n) { return n.nextSibling; })) },
	previousElement: function() { return this.map(Element.previousElement) },
	previousSibling: function() { return this.map((function(n) { return n.previousSibling; })) },
	parentNode: function() { return this.map((function(n) { return n.parentNode; })) },
	
	childNodes: function() {
	
	    var c = [];
		this.forEach((function(e) { return c = c.concat(toArray(e.childNodes)); }));
		return new DOMSet(c, true);
	},
	
	children: function() {
	
	    var c = [];
	    
		this.forEach((function(e) { return c = c.concat(toArray(Element.children(e))); }));
		return new DOMSet(c, true);
	},

	bubble: function(sel, ctx) {
	
		var c = [];
		
		this.forEach((function(e) {
		
			for (; e; e = e.parentNode) {
			
				if (Engine.matches(e, sel, ctx)) {
				
					c.push(e);
					return;
				}
			}
		}));
		
		return new DOMSet(c, true);
	},
	
    // === Tree Modification ===
	
	appendTo: function(obj, ctx) { return this._manip("appendTo", obj, ctx) },
	prependTo: function(obj, ctx) { return this._manip("prependTo", obj, ctx) },
	insertBefore: function(obj, ctx) { return this._manip("insertBefore", obj, ctx) },
	insertAfter: function(obj, ctx) { return this._manip("insertAfter", obj, ctx) },
	
	replace: function(obj, ctx) { return this._manip("replace", obj, ctx) },
	replaceContent: function(obj, ctx) { return this._manip("replaceContent", obj, ctx) },
	wrap: function(obj, ctx) { return this._manip("wrap", obj, ctx) },
	wrapContent: function(obj, ctx) { return this._manip("wrapContent", obj, ctx) },
	
	append: function(obj, ctx) { return this._rmanip("appendTo", obj, ctx) },
	prepend: function(obj, ctx) { return this._rmanip("prependTo", obj, ctx) },
	replaceWith: function(obj, ctx) { return this._rmanip("replace", obj, ctx) },
	replaceContentWith: function(obj, ctx) { return this._rmanip("replaceContent", obj, ctx) },
	wrapWith: function(obj, ctx) { return this._rmanip("wrap", obj, ctx) },
	wrapContentWith: function(obj, ctx) { return this._rmanip("wrapContent", obj, ctx) },
	
	// === Metrics ===
	
	metrics: function() {
	
	    this._first((function(n) { return n.nodeType === 1 ? 
	        Metrics.elementMetrics(n) :
			n.window === n ? Metrics.windowMetrics(n) : null; }));
	},
	
	resize: function(w, h) {
	
	    return this.elements().forEach((function(e) { return Element.resize(e, w, h); }));
	},
	
	// === Effects ===
	
    transition: function(t) { var __this = this; 
	
		var p = t.properties, 
			a = [];
		
		if (!p)
			p = t.properties = {};
		
		// Copy properties to "properties" object
		Object.keys(t).forEach((function(k) {
		
			if (!TRANS_PROPS[k] && p[k] === void 0)
				p[k] = t[k];
		}));
		
		this.forEach((function(e) { return a.push(Trans.begin(e, t)); }));
		
		return Promise.whenAll(a).then((function(val) { return __this; }));
	},
	
    _first: function(fn) {
	
	    return this[0] ? fn(this[0]) : null;
	},
	
	_firstElem: function(fn) {
	
	    var e = this[0];
	    return (e && e.nodeType === 1) ? fn(e) : null;
	},
	
    _manip: function(fn, obj, ctx) {
    
        obj = new DOMSet(obj, ctx).elements();
        if (obj.length === 0) return this;
        
        var f = Fragment.create(this).duplicate(obj.length), 
            a = obj,
            i;
    
        for (i = a.length; i--;)
            f[i][fn](a[i]);
        
        return this;
    },
    
    _rmanip: function(fn, obj, ctx) {
    
        obj = (typeof obj === "string") ? 
            DOMSet.parse(obj) : 
            new DOMSet(obj, ctx);
        
        obj[fn](this);
        return this;
    }
	
}});

DOMSet.parse = (function(html, doc) {

	return Keys.set(parseHTML(html, doc), DOMSet.prototype);
});

DOMSet.query = (function(sel, ctx) {

	return Keys.set(Engine.query(sel, ctx), DOMSet.prototype);
});

DOMSet.create = (function(a, b) {
	
	return new DOMSet(a, b);
});

exports.DOMSet = DOMSet;
};

__modules[2] = function(exports) {
var _M0 = __require(12); Object.keys(_M0).forEach(function(k) { exports[k] = _M0[k]; });
};

__modules[3] = function(exports) {
/*

- Improve detection of whether "DOMContentLoaded" has already fired?
  Which browsers support readyState?

*/

var QueryString = __require(13);
var Promise = __require(2).Promise;

var _M0 = __require(14), addListener = _M0.addListener, removeListener = _M0.removeListener;

var encodeRE = /[<>'\"&]/g,
	encodeMap = { ">": "&gt;", "<": "&lt;", "'": "&#39;", "\"": "&quot;", "&": "&amp;" },
	promiseKey = "ceba146b-7920-418f-ad85-091cd168ded6",
	document = this.document;

// Returns a promise for the loaded event
function loaded(doc) {

	doc = doc || document;
	return doc[promiseKey] || (doc[promiseKey] = loadedPromise(doc));
}

// Creates a ready promise for the document
function loadedPromise(doc) {

	var ready = new Promise(),
	    complete = false,
		win = doc.defaultView || doc.parentWindow;
		
	// Add listeners for onready
	addListener(win, "load", fireReady);
	addListener(doc, "DOMContentLoaded", fireReady);
	addListener(doc, "readystatechange", readyChange);
	
	// Check for current ready state
	readyChange();
	
	// Use doScroll hack for IE < 9
	if (!win.addEventListener && win.attachEvent)
		ieReadyCheck();
	
	return ready.future;
	
	// Fires the ready event, if not already fired
	function fireReady() {
	
		if (!complete) {
		
			// Remove handlers
			removeListener(win, "load", fireReady);
			removeListener(doc, "DOMContentLoaded", fireReady);
			removeListener(doc, "readystatechange", readyChange);
			
			// Resolve promise
			ready.resolve();
			complete = true;
		}
	}
	
	// Called when the document's readyState changes
	function readyChange() {
	
		if (doc.readyState === "complete")
			fireReady();
	}
	
	// doScroll IE hack
	function ieReadyCheck() {
	
		var root = doc.documentElement;
		
		try { !win.frameElement && root.doScroll && scrollCheck(); }
		catch (x) {}
	
		function scrollCheck() {
		
			if (ready) {
			
				try { root.doScroll("left"); setTimeout(fireReady, 10); }
				catch(e) { setTimeout(scrollCheck, 10); }
			}
		}
	}
}

// Returns true if the specified document is an HTML document
function isHTML(d) {

	var r = (d || document).documentElement || 0;
	return r.nodeName === "HTML" || r.className !== undefined;
}

// Encodes document text
function encode(s) {

	return (s + "").replace(encodeRE, (function(m) { return encodeMap[m]; }));
}

// Returns the querystring data for the current document
function querystring(doc) {

	return QueryString.parse((doc || document).location.search);
}

exports.loaded = loaded;
exports.isHTML = isHTML;
exports.encode = encode;
exports.querystring = querystring;
};

__modules[4] = function(exports) {
/*

- This should be class-based instead

- getAllResponseHeaders returns a string which must be parsed...

- Apparently we need to abort current requests on window.unload?

- Should we attempt to use IE's XDomainRequest for cross-domain
  requests?  CORS is supported for all current browsers except 
  Opera.

- This module presents a really simple interface, but we need to
  look into the latest XHR features to find out how we should make
  it more powerful.

*/

var Promise = __require(2).Promise;
var Keys = __require(11);

var window = this,
	XHR = window.XMLHttpRequest,
	noop = (function() { return void 0; });

// Add XMLHttpRequest constructor to IE6 (and IE7/8 for file:)
if (window.ActiveXObject && (!XHR || window.location.protocol === "file:")) {

	XHR = function() { return new window.ActiveXObject("Microsoft.XMLHTTP"); };
}

var options = {

	timeout: 10000
};
	
function send(req) {

	if (typeof req === "string")
		req = { url: req };
	
	req = Keys.set({ headers: {}, body: null, method: "GET" }, req);
	req = Keys.add(req, options);
	
	var promise = new Promise(),
		xhr, 
		tmr;
	
	// Create XMLHttpRequest
	xhr = new XHR();
	tmr = 0;
	
	// Open request
	xhr.open(req.method.toUpperCase(), req.url, true);
	
	// Set headers
	Object.keys(req.headers).forEach((function(k) { return xhr.setRequestHeader(k, req.headers[k]); }));
	
	if (req.timeout) 
		tmr = setTimeout(timeout, req.timeout);

	xhr.onreadystatechange = onreadystatechange;
	xhr.send(req.body);
	
	return promise.future;
	
	// Called when the request has timed out
	function timeout() {
	
		tmr = 0;
		abort("timeout");
	}
	
	// Aborts the request
	function abort(err) {
	
		err = err || "abort";
		
		if (xhr) {
		
			try { xhr.abort(); }
			catch (x) {}

			cleanup();
			
			// TODO: Error reporting needs to be cleaned up
			promise.reject(new Error(err));
		}
	}
	
	// Finalizes request operation
	function cleanup() {
	
		if (xhr) {
		
			xhr.onreadystatechange = noop;
			xhr = null;
		}
		
		if (tmr)
			clearTimeout(tmr);
	}
	
	// Callback function for readystatechange event
	function onreadystatechange() {
	
		if (!xhr || xhr.readyState !== 4) return;
		
		var s = 0, ev = {};
		
		try {
		
			ev.status = s = xhr.status;
			ev.statusText = xhr.statusText;
			ev.responseText = xhr.responseText;
			ev.responseXML = xhr.responseXML;
			ev.headers = xhr.getAllResponseHeaders();
		}
		catch (x) {}

		cleanup();

		if (s >= 200 && s < 300 || // Success
			s === 304 || // Not Modified
			s === 1223 // IE Bug
			) {
		
			promise.resolve(ev);
		
		} else {
		
		    var err = new Error(ev.statusText);
		    err.response = ev;
		    
			promise.reject(err);
		}
	}
}

exports.options = options;
exports.send = send;
};

__modules[5] = function(exports) {
var _M0 = __require(10); Object.keys(_M0).forEach(function(k) { exports[k] = _M0[k]; });
var _M1 = __require(15); Object.keys(_M1).forEach(function(k) { exports[k] = _M1[k]; });
var _M2 = __require(14); Object.keys(_M2).forEach(function(k) { exports[k] = _M2[k]; });
var _M3 = __require(16); Object.keys(_M3).forEach(function(k) { exports[k] = _M3[k]; });

var _M4 = __require(6), resize = _M4.resize, metrics = _M4.elementMetrics;

exports.resize = resize;
exports.metrics = metrics;
};

__modules[6] = function(exports) {
/*

- IE6-7 will report offsetParents that are not actually positioning
  contexts.  Fixing this would require that we traverse up the chain
  of offsetParents looking for elements whose effective position is not
  static.  Or we could punt on it, since there is an easy workaround via
  CSS (just set the reported offset parent's position to relative).

- Do all target hosts implement getBoundingClientRect now?  If so, we
  can eliminate getPageDOM.

- Feature detection will depend upon the browser mode for the current
  frame and will not necessarily work when used on elements in another
  frame with a different mode.

*/

var window = this,
	tested = false,
	fixBorders = false,
	fixTables = false,
	hasFixed = true,
	borderBox = false,
	useView = true,
	winBody = false;

// Performs feature/bug detection
function detect() {

	var doc = window.document,
		root = doc.documentElement,
		body = doc.body || doc.getElementsByTagName("body")[0],
		d = doc.createElement("div");
	
	// Detect box-model variations
	d.innerHTML = "<div style='visibility:hidden;position:absolute;top:0;left:0;width:100px;border:solid 5px;'><div></div></div>";
	body.appendChild(d = d.firstChild);
	
	// Detect default box model
	if (d.offsetWidth === 100) borderBox = "border-box";
	
	// Detect if position is calculated from outside of border (IE 8?)
	if (d.firstChild.offsetLeft > 0) fixBorders = true;
	
	// Detect table issues (IE?)
	d.innerHTML = "<table cellspacing='0' style='border:solid 5px;'><tr><td></td></tr></table>";
	if (d.getElementsByTagName("td")[0].offsetLeft > 0) fixTables = true;
	
	// Detect whether fixed positioning is supported (IE < 7)
	d.style.position = "fixed";
	d.style.left = "-100px";
	if (d.offsetLeft >= 0) hasFixed = false;
	
	body.removeChild(d);
	d = null;
	
	// Determine how to get current style
	if (!window.getComputedStyle && root.currentStyle) useView = false;
	
	// Determine if body reports window size
	if (!root.clientHeight) winBody = true;
	
	// Determine if getBoundingClientRect is available
	if (root.getBoundingClientRect === undefined)
		getPage = getPageDOM;
	
	tested = true;
}

// Returns the dimensions for the window containing an element
function win(w) {

	// Do feature detection
	if (!tested) detect();
	
	var d = (w && (w.ownerDocument || w.document)) || window.document,
		n = (winBody && (d.body || d.getElementsByTagName("body")[0])) || d.documentElement;
	
	return {
		element: n, 
		left: n.clientLeft,
		top: n.clientTop,
		width: n.clientWidth, 
		height: n.clientHeight, 
		scrollLeft: n.scrollLeft,
		scrollTop: n.scrollTop,
		pageLeft: n.scrollLeft - n.clientLeft,
		pageTop: n.scrollTop - n.clientTop
	};
}

// Returns element or window dimensions
function box(e) {

	// Do feature detection
	if (!tested) detect();
	
	var doc = e.ownerDocument,
		view = doc.defaultView,
		b, 
		s, 
		c, 
		p;

	// Get element dimensions
	b = {
		element: e,
		context: e.offsetParent,
		left: e.offsetLeft, 
		top: e.offsetTop,
		width: e.offsetWidth,
		height: e.offsetHeight,
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	};
	
	// Fix position
	if (c = b.context) {
	
		if (!c.offsetParent) {
		
			b.left += c.offsetLeft;
			b.top += c.offsetTop;
		}
		
		if (fixBorders || (fixTables && ("TABLE|TD|TH").indexOf(c.nodeName.toUpperCase()) >= 0)) {
		
			s = (view ? view.getComputedStyle(c, null) : c.currentStyle);
		
			b.left -= +(s.borderLeftWidth) || 0;
			b.top -= +(s.borderTopWidth) || 0;
		}
	}
	
	// Get element style/box properties
	s = (view ? view.getComputedStyle(e, null) : e.currentStyle);
	
	b.boxModel = borderBox || s.boxSizing || s.MozBoxSizing || s.WebkitBoxSizing || "content-box";
	b.position = s.position;
	b.paddingTop = +(s.paddingTop) || 0;
	b.paddingLeft = +(s.paddingLeft) || 0;
	b.paddingBottom = +(s.paddingBottom) || 0;
	b.paddingRight = +(s.paddingRight) || 0;
	b.borderTop = +(s.borderTopWidth) || 0;
	b.borderLeft = +(s.borderLeftWidth) || 0;
	b.borderBottom = +(s.borderBottomWidth) || 0;
	b.borderRight = +(s.borderRightWidth) || 0;
	b.marginTop = +(s.marginTop) || 0;
	b.marginLeft = +(s.marginLeft) || 0;
	b.marginBottom = +(s.marginBottom) || 0;
	b.marginRight = +(s.marginRight) || 0;
	
	if (!hasFixed && b.position === "fixed")
		b.position = "static";
	
	// Get page coordinates
	p = getPage(b);
	b.pageTop = p.top;
	b.pageLeft = p.left;
	
	return b;
}

// Resizes an element
function resize(e, w, h) {

	var b = box(e),
		cb = (b.boxModel === "content-box");
	
	if (typeof w === "number") {
	
		if (cb) w -= (b.paddingLeft + b.paddingRight + b.borderLeft + b.borderRight);
		e.style.width = Math.max(Math.round(w), 0) + "px";
	}
	
	if (typeof h === "number") {
	
		if (cb) h -= (b.paddingTop + b.paddingBottom + b.borderTop + b.borderBottom);
		e.style.height = Math.max(Math.round(h), 0) + "px";
	}
	
	return b;
}

// Gets the coordinates of an element in document space
function getPage(b) {

	var e = b.element,
		r = e.getBoundingClientRect(), 
		w = win(e);
	
	return { 
		top: Math.round(r.top) + w.scrollTop - w.top,
		left: Math.round(r.left) + w.scrollLeft - w.left
	};
}

// Gets the coordinates of an element in document space
function getPageDOM(b) {

	var e = b.element,
		doc = e.ownerDocument,
		root = doc.documentElement,
		body = (doc.body || 0),
		x = b.left,
		y = b.top,
		p = b.context,
		fixed = (b.position === "fixed"),
		win;
	
	// Walk up the tree
	while ((e = e.parentNode) && e !== root && e !== body) {
	
		if (fixed = (b.position === "fixed"))
			break;
		
		b = box(e);
		
		// Add element scroll
		x += b.scrollLeft;
		y += b.scrollTop;
		
		// If next offsetParent in path, add offset
		if (e === p) {
		
			x += b.left + b.borderLeft;
			y += b.top + b.borderRight;
			p = e.offsetParent;
		}
	}

	if (fixed) {
	
		// Add window scroll for fixed elements
		win = win(e);
		x += win.scrollLeft;
		y += win.scrollTop;
	
	} else if (("relative|static").indexOf(box.position) >= 0) {
	
		// Add body offset for flow elements
		x += +(body.offsetLeft) || 0;
		y += +(body.offsetTop ) || 0;
	}
	
	return { top: y, left: x };
}



exports.resizeElement = resize;
exports.elementMetrics = box;
exports.windowMetrics = win;
};

__modules[7] = function(exports) {
var Promise = __require(2).Promise;
var Keys = __require(11);

var _M0 = __require(17), domBegin = _M0.begin;
var _M1 = __require(18), nativeBegin = _M1.begin;


// Begins a list of transitions
function begin(e, t) {

	var promises = [],
		useNative = !e.ownerSVGElement && (t.useNative !== false),
		start = useNative && nativeBegin || domBegin,
		props = t.properties || {},
		item;
	
	var meta = {
	
		duration: t.duration,
		delay: t.delay,
		timingFunction: t.timingFunction
	};
	
	Object.keys(props).forEach((function(k) {
	
		item = Keys.set({ property: k, value: props[k] }, meta);
		promises.push(start(e, item));
	}));
	
	return Promise.whenAll(promises).then((function(val) { return null; }), (function(err) { return null; }));
}

exports.begin = begin;
};

__modules[8] = function(exports) {
/*

- cache parse results?

- Replace self-closing tags with begin/end pairs?  Example "<div />" will
  not be parsed as a self-closing tag with innerHTML.  Do we care about that?
  I don't think so.  Let libraries be "clever".
  
- Remove auto-inserted tbody elements? (IE < 9)  I don't think so.  It's
  not harmful and we can't really specify what the algorithm should be.

*/


var Node = __require(10);
var toArray = Node.toArray;

var RE_TAG = /<([^\s>]+)/,
	document = this.document,
	parseHelp = [];

var tagCtx = {

	clean: [ 0, "", "" ],
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	area: [ 1, "<map>", "</map>" ]
};

tagCtx.optgroup = tagCtx.option;
tagCtx.tbody = tagCtx.tfoot = tagCtx.colgroup = tagCtx.caption = tagCtx.thead;
tagCtx.th = tagCtx.td;

// Returns a DocumentFragment containing the specified html
function parse(html, doc) {

	doc = doc || document;
	html = html + "";
	
	var f = doc.createDocumentFragment(), m;
	
	// Get the first tag in the string
	if (!(m = RE_TAG.exec(html))) {
	
		// Create a single text node
		f.appendChild(doc.createTextNode(html));
	
	} else {
	
		// Create parsing context and set innerHTML
		var p = doc.createElement("div"),
			w = tagCtx[m[1]] || tagCtx.clean,
			d = w[0],
			i;
		
		p.innerHTML = w[1] + html + w[2];
		while (d--) p = p.lastChild;
		
		cloneScripts(p);
		
		// Run parser helpers
		for (i = 0; i < parseHelp.length; ++i)
			parseHelp[i](html, p, doc);
		
		// Insert nodes into a doc fragment
		while (i = p.firstChild)
			f.appendChild(i);
		
		p = null;
	}
	
	return new Template(f);
}

// Clones script elements so that they will execute when
// inserted into the document
function cloneScripts(e) {

	var a = e.getElementsByTagName("script"), p, i;
	
	for (i = 0; e = a[i++];) {
	
		p = e.parentNode;
		p.replaceChild(Node.clone(e, true), e);
	}
}

// Finds the insertion point for a wrap operation
function wrapParent(f) {

	var i = f.firstChild;
	
	while (i) {
	
		if (i.firstChild) i = i.firstChild;
		else if (i.nextSibling) i = i.nextSibling;
		else break;
	}
	
	if (i && i.nodeType !== 1)
		i = i.parentNode;
	
	return i;
}

// Converts a Node, NodeList, or Array of Nodes to a document fragment
function toFragment(o) {

	var d, i, f;
	
	if (!o) o = [];
	else if (o.nodeType === 11) return o;
	else o = toArray(o);
	
	d = o[0] && o[0].ownerDocument || document;
	f = d.createDocumentFragment();
	
	for (i = 0; i < o.length; ++i)
		f.appendChild(o[i]);
	
	return f;
}

var Template = es6now.Class(function(__super) { return {

	constructor: function(frag) {
	
		this.doc = frag.ownerDocument;
		this.fragment = frag;
	},
	
	duplicate: function(n) {
	
		if (n < 1) 
			return [];
		
		var a = [this];
		
		while (--n)
			a.push(new Template(Node.clone(this.fragment, true)));
		
		return a;
	},
	
	appendTo: function(e) {
	
		e = this._parent(e);
		e.appendChild(this.fragment);
	},
	
	prependTo: function(e) {
	
		e = this._parent(e);
		e.insertBefore(this.fragment, e.firstChild);
	},
	
	insertBefore: function(e) {
	
		e.parentNode.insertBefore(this.fragment, e);
	},
	
	insertAfter: function(e) {
	
		e.parentNode.insertBefore(this.fragment, e.nextSibling);
	},
	
	replace: function(e) {
	
		e.parentNode.replaceChild(this.fragment, e);
		Node.dispose(e);
	},
	
	replaceContent: function(e) {
	
		Node.clear(e);
		this._parent(e).appendChild(this.fragment);
	},
	
	wrap: function(e) {
	
		var p = wrapParent(this.fragment);
		if (!p) return;
		
		e = this._parent(e);
		e.parentNode.replaceChild(this.fragment, e);
		p.appendChild(e);
	},
	
	wrapContent: function(e) {
	
		var p = wrapParent(this.fragment), c = this.fragment.firstChild;
		if (!p) return;
		
		e = this._parent(e);
		e.appendChild(this.fragment);
		
		// Move children into wrapper
		while (e.firstChild !== c)
			p.appendChild(e.firstChild);
	},
	
	_parent: function(e) {
	
		// If inserting TR's into a TABLE, get or create an intermediate TBODY
		if (e.nodeName.toUpperCase() === "TABLE") {
		
			var c = this.fragment.firstChild,
				d = e.ownerDocument;
			
			if (c.nodeName.toUpperCase() === "TR")
				return e.getElementsByTagName("tbody")[0] || e.appendChild(d.createElement("tbody"));
		}
		
		return e;
	}
	
}});

// Feature/Bug Detection
(function() {

	var tmp = document.createElement("div");
	tmp.innerHTML = "   <link /><span></span>";
	
	// Determine if parser needs a little help (IE <= 9?)
	if (!tmp.getElementsByTagName("link").length)
		tagCtx.clean = [ 1, ";)<div>", "</div>" ];
	
	// Determine if parser strips leading whitespace (IE <= 9?)
	if (tmp.firstChild.nodeType !== 3) {
	
		var LWS = /^\s+/;
	
		parseHelp.push((function(html, e, doc) {
		
			var m;
			
			if (m = html.match(LWS))
				e.insertBefore(doc.createTextNode(m[0]), e.firstChild);
		}));
	}

	tmp = null;
	
})();

function create(nodes, doc) {
    
    return typeof nodes === "string" ? 
		parse(nodes, doc) : 
		new Template(toFragment(nodes));
}

exports.create = create;
};

__modules[9] = function(exports) {
/*

Selectus - Another CSS3 Selector Engine
Copyright (c) 2012 Kevin H. Smith (khs4473)
Licensed under the MIT license.

Remaining CSS3 Issues:

- namespaces are not supported
- {name} pattern is too permissive (.5cm passes)
- \\\n within a string will be converted to \n, not ""
- psuedo filters with an empty arg list '()' will not throw.
  
IE Issues:

- [attr] - getAttributeNode will incorrectly return null when the attribute's value is the empty string
- :empty - IE does not store whitespace as text node children
- :root - cloned nodes have a document node as their parent, so they ARE the root
- getting <param> elements: very strange behavior


*/

var D = this.document,
	DXML = isXML(D),
	HTML_ELEMS = {html:1,head:1,body:1,table:1,tr:1,td:1,form:1,button:1,input:1,option:1,select:1,textarea:1,img:1,script:1,span:1,code:1,a:1,pre:1,div:1,blockquote:1,ol:1,ul:1,li:1,p:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1},
	SCOPE_ATTR = "selectus-scope",
	undefined,
	filters,
	combinators,
	traversal;

var _hash = (this.location.hash || "").replace(/^#/, ""),
	_xml = false,
	_xid = 0,
	_sid = 0,
	_scopeID = 1,
	_pCache = {},
	_pCacheSize = 100,
	_hasQSA = true,
	_hasByClass = true,
	_matchesSel = false,
	_ctx,
	_connected,
	_doc,
	_msxml;

(function(k) {

	for (k in HTML_ELEMS) {
	
		HTML_ELEMS[k] =
		HTML_ELEMS[k.toUpperCase()] = k.toUpperCase();
	}

})();


// == THE PARSER ==

/*

PARSER REGULAR EXPRESSIONS

escape: \\[^_]
string1: "([^\n\r\f\\"]|{escape})*"
string2: '([^\n\r\f\\']|{escape})*'
name: ([\w\u00c0-\uFFFF_-]|{escape})+
combinator: \s*([+>~,\s])\s*
tag: \*|{name}
hash: #{name}
class: \.{name}
attribute: \[\s*{name}\s*([|*$^~!]?=({name}|{string1}|{string2})\s*)?\]
psuedo: ::?{name}(\(\s*([^)(]|\([^)]*\))*\s*\))?

\s*([+>~,\s])\s*
	$1 = combinator or comma
\*|(?:[\w\u00c0-\uFFFF_-]|\\[^_])+
#(?:[\w\u00c0-\uFFFF_-]|\\[^_])+
\.(?:[\w\u00c0-\uFFFF_-]|\\[^_])+
\[\s*((?:[\w\u00c0-\uFFFF_-]|\\[^_])+)\s*(?:([|*$^~!]?=)\s*((?:[\w\u00c0-\uFFFF_-]|\\[^_])+|"(?:[^\n\r\f\\"]|\\[^_])*"|'(?:[^\n\r\f\\']|\\[^_])*')\s*)?\]
	$2 = attribute name
	$3 = match
	$4 = test value
:(:?(?:[\w\u00c0-\uFFFF_-]|\\[^_])+)(?:\(\s*((?:[^)(]|\([^)]*\))*)\s*\))?
	$5 = filter name
	$6 = arg string

*/


var LEX = (/\s*([+>~,\s])\s*|\*|(?:[\w\u00c0-\uFFFF_-]|\\[^_])+|#(?:[\w\u00c0-\uFFFF_-]|\\[^_])+|\.(?:[\w\u00c0-\uFFFF_-]|\\[^_])+|\[\s*((?:[\w\u00c0-\uFFFF_-]|\\[^_])+)\s*(?:([|*$^~!]?=)\s*((?:[\w\u00c0-\uFFFF_-]|\\[^_])+|"(?:[^\n\r\f\\"]|\\[^_])*"|'(?:[^\n\r\f\\']|\\[^_])*')\s*)?\]|:(:?(?:[\w\u00c0-\uFFFF_-]|\\[^_])+)(?:\(\s*((?:[^)(]|\([^)]*\))*)\s*\))?/g),
	PREP = (/^\s\s*|\\([\\_]|([0-9a-f]{1,6})\s?)|\s\s*$/gi),
	UNESC = (/^['"]|\\([^_])|['"]$/g),
	NTH_EXP = (/^(?:([+-])?(\d+)?n\s*(?:([+-])\s*(\d+))?|([+-]?\s*\d+)|(even)|(odd))$/i),
	ID_QRY = (/^#(?:[\w\u00c0-\uFFFF_-])+$/),
	CLS_QRY = (/^\.(?:[\w\u00c0-\uFFFF_-])+$/),
	SYNTAX_ERR = "Selector syntax error.";


// Parses the selector expression and returns an array of sequence objects
function parse(sel) {

	var	k = sel,
		chain = [],
		stack,
		top,
		i;
	
	// Used compiled structure, if available
	if (_pCache[k]) return _pCache[k];
	
	// Trim and replace Unicode escapes
	sel = sel.replace(PREP, (function(m, m1, m2) {
	
		if (m1 === "\\") return "\\\\";
		if (m1 === "_") return "_";
		if (m2) return "\\" + String.fromCharCode(parseInt(m2, 16));
		return "";
	}));
	
	newSeq(sel);
	
	if (!sel || sel.replace(LEX, match).length > 0)
		throw new Error(SYNTAX_ERR);
	
	endSeq();
	
	// Maintain cache size
	if (_pCacheSize === 0) for (i in _pCache) { delete _pCache[i]; break; }
	else --_pCacheSize;
	
	return _pCache[k] = chain;
	
	
	// === INNER FUNCTIONS ===
	
	// Starts a new sequence
	function newSeq(rem) {
	
		chain.push(stack = []);
		
		stack.qry = "";
		stack.left = [];
		newSel(rem);
	}
	
	// Ends a sequence
	function endSeq() {
	
		endSel();
	}
	
	// Starts a new selector
	function newSel(rem) {
	
		stack.push(top = {
		
			tag: "*", 
			utag: "*", 
			ftr: [], 
			qry: "", 
			qsaOK: true,
			rem: rem
		});
	}
	
	// Ends a selector
	function endSel(c) {
	
		if (!top.valid) throw new Error(SYNTAX_ERR);
		
		top.qry = top.qry || "*";
		stack.qry += top.qry + (c || "");
		
		top.cmb = combinators[c];
		top.tagOnly = (top.ftr.length === 0);
		
		if (top.id) {
		
			stack.id = top.id;
			stack.idIndex = stack.length - 1;
		}
		
		if (top.name) {
		
			stack.name = top.name;
			stack.nameIndex = stack.length - 1;
		}
	}
	
	// Adds a filter
	function addFtr(n, a) {
	
		var f = filters[n];
		
		a.name = n;
		a.test = f.test || f;
		a.std = !!f._std;
		
		top.valid = true;
		top.ftr.push(a);
	}
	
	// Validates an attribute selector
	function chkAttr(op) {
	
		if (op === "!=") {
		
			if (options.negativeAttributeMatch) return false;
			else throw new Error("Operator != is not supported.");
		}

		return true;
	}
	
	// Validates a psuedo selector
	function chkFtr(f, n, args) {
	
		if (!f || (!f._std && !customFilters)) 
			throw new Error("Filter not supported: '" + n + "'");
		
		if (!f.parse && args)
			throw new Error(SYNTAX_ERR);
		
		return f._std;
	}
	
	// Main parsing routine
	function match(m, m1, m2, m3, m4, m5, m6, off, str) {
	
		var raw = m, fArg = m6;
		
		// Escape all matches
		m = m && m.replace(UNESC, "$1");
		m1 = m1 && m1.replace(UNESC, "$1");
		m2 = m2 && m2.replace(UNESC, "$1");
		m3 = m3 && m3.replace(UNESC, "$1");
		m4 = m4 && m4.replace(UNESC, "$1");
		m5 = m5 && m5.replace(UNESC, "$1");
		m6 = m6 && m6.replace(UNESC, "$1");

		var c = (m1 || m.substring(0, 1)),
			std = true,
			ftr;
		
		if ((">+~ ").indexOf(c) >= 0) {
		
			endSel(c);
			newSel(str.slice(off));
		
		} else if (c === ",") {
		
			endSeq();
			newSeq(str.slice(off));
		
		} else {
		
			switch (c) {
			
			case "#":
				addFtr("_id", [ top.id = m.substring(1) ]);
				break;
			case ".":
				addFtr("_class", [ top.cls = " " + m.substring(1) + " " ]);
				break;
			case "[":
				std = chkAttr(m3);
				addFtr("_attr", filters._attr.parse(m2, m4, m3));
				if (m2 === "name" && m3 === "=") top.name = m4;
				break;
			case ":":
				std = chkFtr(ftr = filters[m5], m5, m6);
				addFtr(m5, (ftr.parse) ? ftr.parse(m6, fArg) : [m6]);
				break;
			default:
				top.valid = true;
				top.tag = m;
				top.utag = m.toUpperCase();
				break;
			}
			
			if (std) top.qry += raw;
			else top.qsaOK = false;
		}
		
		return "";
	}
}


// == HELPERS AND UTILITIES ==


// Basic element info
function contains(a, b) { return !!(a.compareDocumentPosition(b) & 16); }
function doc(n) { return (n && (n.ownerDocument || (n.nodeType === 9 ? n : D))) || D; }
function compare(a, b) { return a === b ? 0 : ((a.compareDocumentPosition(b) & 4) ? -1 : 1); }
function attr(e, n) { return e.getAttribute(n); }

// Utility functions
function byId(d, id) { return d.getElementById(id); }
function toInt(s) { var n = parseInt(s, 10); return (isNaN(n)) ? 0 : n; }
function isXML(d) { var r = d.documentElement || 0; return r.nodeName !== "HTML" || r.className === undefined; }
function reject() { return false; }


var slice = Array.prototype.slice,
	copyTagList = function(a) { return slice.call(a, 0); },
	search;


// Parsing of nth-child expressions
function nthParse(s, fArg) {

	var m = NTH_EXP.exec(s), i;
	
	if (!m) throw new Error("Invalid nth-child expression.");
	if (m[5]) return [ 0, toInt(m[5]) ];
	if (m[6]) return [ 2, 0 ];
	if (m[7]) return [ 2, 1 ];
	
	for (i = 1; i < 5; ++i)
		m[i] = m[i] || "";
	
	var a = toInt(m[1] + (m[2] || "1")),
		b = toInt(m[3] + m[4] + "");
	
	return [ a, b ];
}


// Returns a function for testing nth-child expressions
function nthTest(type, rev) {

	var k = (type ? 2 : 0) + (rev ? 1 : 0);
	
	// Returns the element index using a cache
	function cache(e) {
	
		var p = e.parentNode,
			c = e.SELECTUS_NTH || (e.SELECTUS_NTH = []),
			i = 1;
		
		if (p && (p.SELECTUS_XID !== _xid || !(i = c[k]))) {
		
			p.SELECTUS_XID = _xid;
			
			// Reindex element and siblings
			var j = 0, s, tag = (type ? e.nodeName : false);
	
			if (rev) { // Reverse index
			
				for (s = p.lastChild; s; s = s.previousSibling)
					if (s.nodeType === 1 && (!tag || tag === s.nodeName))
						(s.SELECTUS_NTH || (s.SELECTUS_NTH = []))[k] = ++j;
			
			} else { // Forward index
			
				for (s = p.firstChild; s; s = s.nextSibling)
					if (s.nodeType === 1 && (!tag || tag === s.nodeName))
						(s.SELECTUS_NTH || (s.SELECTUS_NTH = []))[k] = ++j;
			}
			
			i = c ? c[k] : j;
		}
		
		return i;
	}
	
	// Returns the element index without using a cache
	function nocache(e) {
	
		var p = e.parentNode;
		
		if (p) {
		
			var j = 0, s, tag = (type ? e.nodeName : false);
	
			if (rev) { // Reverse index
			
				for (s = p.lastChild; s; s = s.previousSibling)
					if (s.nodeType === 1 && (!tag || tag === s.nodeName) && ++j)
						if (s === e) return j;
			
			} else { // Forward index
			
				for (s = p.firstChild; s; s = s.nextSibling)
					if (s.nodeType === 1 && (!tag || tag === s.nodeName) && ++j)
						if (s === e) return j;
			}
		}
		
		return 1;
	}
	
	return function(a, b) {
	
		if (a === 1 && b === 0) 
			return true;
		
		var i = _msxml ? nocache(this) : cache(this), d;
		
		if (a === 0) return i === b;
		else return ((d = i - b) % a === 0 && d / a >= 0);
	};
}


// Returns a function for testing first/last/only child
function firstLast(op, type) {

	var first = (op === "first" || op === "only"),
		last = (op === "last" || op === "only");
	
	return function() {
	
		var e, tag = (type ? this.nodeName : false);
		
		if (first)
			for (e = this; e = e.previousSibling;)
				if (e.nodeType === 1 && (!tag || tag === e.nodeName))
					return false;
		
		if (last)
			for (e = this; e = e.nextSibling;)
				if (e.nodeType === 1 && (!tag || tag === e.nodeName))
					return false;
		
		return true;
	};
}


// Returns the union or intersection of two element arrays
function merge(a, b, intersect) {

	if (!b) return a;
	
	var r = [],
		s = (intersect ? [] : r),
		i = 0,
		j = 0;
	
	while (i < a.length || j < b.length) {
	
		if (i === a.length) r.push(b[j++]);
		else if (j === b.length) r.push(a[i++]);
		else if (a[i] === b[j]) { s.push(a[i++]); ++j; }
		else if (compare(a[i], b[j]) < 0) r.push(a[i++]);
		else r.push(b[j++]);
	}
	
	return s;
}


// Returns a copy of the array with non-elements removed
function elemsOnly(a) {

	var i, j, out = [];
	
	for (i = 0, j = 0; a[i] !== undefined; ++i)
		if (a[i] && a[i].nodeType === 1) 
			out[j++] = a[i];
	
	return out;
}


// Copies and sorts a list of nodes and removes duplicates
function sort(a, unique, elem) {

	var i;
	
	a = elem ? elemsOnly(a) : slice.call(a, 0);
	a.sort(compare);
	
	// Remove duplicates and empty items
	if (unique) {
	
		for (i = a.length; i--;)
			if (!a[i] || a[i] === a[i + 1])
				a.splice(i, 1);
	}
	
	return a;
}


// == FILTERS ==


filters = {

	_id: function(id) { return this.getAttribute("id") === id; },
	
	_class: function(cls) {
	
		var c = this.className;
		if (typeof c !== "string") c = this.getAttribute("class") || "";
		return (" " + c + " ").indexOf(cls) >= 0;
	},

	_attr: {
	
		parse: function(n, v, op) {
		
			if (!op) v = null;
			else if ((op = op.substring(0, 1)) === "~" && v) v = " " + v + " ";
			
			return [ n, v, op ];
		},
		
		test: function(n, v, op) {
		
			var a;
			
			if (v === null) {
			
				// Use node for existence test
				a = this.getAttributeNode(n);
				return a != null && !!(a.specified || a.nodeValue);
			}
			
			a = attr(this, n) + "";
			
			switch (op) {
			
				case "~": return (" " + a + " ").indexOf(v) >= 0;
				case "^": return a.indexOf(v) === 0;
				case "$": return a.indexOf(v) === Math.abs(a.length - v.length);
				case "*": return a.indexOf(v) >= 0;
				case "|": return (a + "-").indexOf(v + "-") === 0;
				case "!": return a !== v;
				default: return a === v;
			}
		}
	},
	
	root: function() { return this.ownerDocument.documentElement === this; },
	
	scope: function() { return this === _ctx; },
	
	empty: function() {
	
		for (var c = this.firstChild; c; c = c.nextSibling)
			if (c.nodeType === 1 || (c.nodeType < 6 && c.nodeValue)) 
				return false;
		
		return true;
	},
	
	"first-child": firstLast("first", false),
	"last-child": firstLast("last", false),
	"only-child": firstLast("only", false),
	
	"first-of-type": firstLast("first", true),
	"last-of-type": firstLast("last", true),
	"only-of-type": firstLast("only", true),
	
	"nth-child": { parse: nthParse, test: nthTest(false, false) },
	"nth-last-child": { parse: nthParse, test: nthTest(false, true) },
	"nth-of-type": { parse: nthParse, test : nthTest(true, false) },
	"nth-last-of-type": { parse: nthParse, test: nthTest(true, true) },
	
	not: {
	
		parse: function(a, b) {
		
			b = parse(b);
			
			var s = b[0][0],
				f = s.ftr;
			
			if (b.length > 1 || b[0].length > 1 || f.length > 1 || (f[0] && f[0].name === "not"))
				throw new Error("Invalid :not selector.");
			
			return [s];
		},
		
		test: function(sel) { return !filter(this, sel); }
	},
	
	enabled: function() { return this.disabled !== true; },
	disabled: function() { return this.disabled === true; },
	checked: function() { return (this.checked === true || this.selected === true); },
	
	target: function() {
	
		return this.getAttribute("id") === _hash || 
			this.getAttribute("name") === _hash; 
	},
	
	lang: {
	
		parse: function(a) { return [a]; },
		
		test: function(v) {
		
			var m, e;
			
			for (e = this; e; e = e.parentNode)
				if (m = e.lang) break;
			
			return !!(m && (m === v || m.indexOf(v + "-") >= 0));
		}
	},
	
	":first-line": reject,
	":first-letter": reject,
	":before": reject,
	":after": reject,
	
	link: reject,
	visited: reject,
	active: reject,
	hover: reject,
	focus: reject
	
};


// Mark all filters as "standard"
(function(k) {

	for (k in filters)
		filters[k]._std = true;

})();


// == COMBINATORS ==


traversal = {

	next: function(adj) {
	
		return function(a, sel) {
		
			var c = a.length, r = [], i = 0, j = 0, stk = [], n, e;
			
			step: while (i < c) {
			
				e = a[i];
				n = a[++i];
				
				next: while (true) {
				
					// Step into descendants first
					if (n && contains(e, n)) { stk.push(e); continue step; };
					
					while (e = e.nextSibling) {
					
						if (e.nodeType !== 1) continue;
						
						// Add sibling
						r[j++] = e;
						if (adj) break;
						
						// If this is the next element, move next pointer
						if (e === n) n = a[++i];
						
						continue next;
					}
					
					if (stk.length === 0) continue step;
					else e = stk.pop();
				}
			}
			
			return filterAll(r, sel, true, true);
		};
	},
	
	child: function(adj) {
	
		if (adj) return traversal.children();
		else return traversal.descendants();
	},
	
	children: function() {
	
		return function(a, sel) {
		
			var c = a.length, r = [], i = 0, j = 0, stk = [], n, e;
			
			step: while (i < c) {
			
				e = a[i];
				n = a[++i];
				
				for (e = e.firstChild; e; e = e.nextSibling)
					if (e.nodeType === 1) break;
				
				next: while(true) {
				
					if (!e) {
					
						if (stk.length === 0) break;
						else e = stk.pop();
					
					} else {
					
						// Add child
						r[j++] = e;
					}
					
					// Step into children and children's descendants
					if (n && (e === n || contains(e, n))) {
					
						stk.push(e); 
						continue step; 
					}
					
					while (e = e.nextSibling) 
						if (e.nodeType === 1) break;
				}
			}
			
			return filterAll(r, sel, true, true);
		};
	},
	
	descendants: function() {
	
		return function(a, sel) {
		
			var tag = sel.tag, c = a.length, r = [], t, e, p;
			
			for (var i = 0; i < c; ++i) {
			
				e = a[i];

				// Skip if descendant of last
				if (p && contains(p, e)) continue;
				
				t = e.getElementsByTagName(tag);
				r = r.concat(sel.tagOnly ? copyTagList(t, tag) : filterAll(t, sel, false, false));
				p = e;
			}
			
			return r;
		};
	}
};


combinators = {

	" ": { // Descendant
	
		stop: false,
		sibling: false,
		cache: true,
		right: traversal.child(false)
	},
	
	">": { // Child
	
		stop: true,
		sibling: false,
		cache: true,
		right: traversal.child(true)
	},
	
	"~": { // General Sibling
	
		stop: false,
		sibling: true,
		cache: true,
		right: traversal.next(false)
	},
	
	"+": { // Immediate Sibling
	
		stop: true,
		sibling: true,
		cache: false,
		right: traversal.next(true)
	}
};


// == MATCHER ==


// Searches using querySelectorAll
function searchQSA(seq, elems) {

	var top = seq[seq.length - 1], e;
	if (elems) return scanLeft(filterAll(elems, top, true, false), seq);
	
	// "Rooted" QSA will always return a superset of our match
	try { e = _ctx.querySelectorAll(seq.qry); }
	catch (x) { return searchDOM(seq); }
	
	return scanLeft(top.qsaOK ? slice.call(e, 0) : filterAll(e, top, false, false), seq);
}


// Searches using standard DOM methods
function searchDOM(seq, elems) {

	var piv = seq.length - 1, 
		sel = seq[piv], 
		a, 
		e;
	
	if (elems) {
	
		a = filterAll(elems, sel, true, false);
	
	} else if (seq.id && _connected && !_xml) {
	
		// If an ID is provided, pivot on the ID
		piv = seq.idIndex;
		sel = seq[piv];
		
		e = byId(_doc, seq.id);
		
		if (e === null) a = [];
		else if (e) a = ((_ctx === _doc || contains(_ctx, e)) && filter(e, sel)) ? [e] : [];
	}
	
	if (!a) {
	
		// Fallback to getElementsByTagName
		a = _ctx.getElementsByTagName(sel.tag);
		a = sel.tagOnly ? copyTagList(a, sel.tag) : filterAll(a, sel, false, false);
	}
	
	// Short curcuit scanning if only one selector
	if (seq.length === 1) return a;
	
	// Do left scan
	if (a.length > 0) a = scanLeft(a, seq, piv);
	
	// Do right scan
	if (a.length > 0) a = scanRight(a, seq, piv);
	
	return a;
}


// Performs a left scan
function scanLeft(a, seq, pivot) {

	var start = (pivot === undefined ? seq.length - 2 : pivot - 1);
	if (start < 0) return a;
	
	// Increment scan ID
	++_sid;
	
	var /* other    */ i = a.length, qsaCompat = options.qsaCompatible, nn,
		/* cache    */ chk = a.slice(0), c,
		/* output   */ r = [], j = 0,
		/* stack    */ stk = [], e, pos,
		/* selector */ sel, cmb, sib;
	
	next: while (i--) {
	
		stk.length = 0;
		e = a[i];
		pos = start;
		
		step: while (true) {
		
			if (sel !== seq[pos]) {
			
				sel = seq[pos];
				cmb = sel.cmb;
				sib = cmb.sibling;
			}
			
			while (e = (sib ? e.previousSibling : e.parentNode)) {
			
				if (sib) { if (e.nodeType !== 1) continue; }
				else if (qsaCompat) { if (e === _doc) break; }
				else if (e === _ctx) break;
				
				if (cmb.cache && !_msxml) {
				
					// Get cache
					c = e.SELECTUS_LS;
					
					// Validate cache
					if (e.SELECTUS_SID !== _sid) {
					
						if (!c) c = e.SELECTUS_LS = [];
						else c.length = 0;
						
						e.SELECTUS_SID = _sid;
					
					} else if (c[pos]) {
					
						if (chk[i] = chk[c[pos]])
							r[j++] = a[i];
						
						continue next;
					}
					
					c[pos] = i;
				}
				
				if ((sel.tagOnly) ?
					(sel.tag === "*" || (HTML_ELEMS[nn = e.nodeName] || nn.toUpperCase()) === sel.utag) :
					(filter(e, sel))) {
					
					if (pos === 0) {
					
						// Sequence exhausted - match found
						r[j++] = a[i];
						chk[i] = true;
						continue next;
					
					} else {
					
						// Step into next selector
						stk.push(e, pos--);
						continue step;
					}
				}
				
				// Stop if immediate combinator
				if (cmb.stop) break;
			}
			
			if (stk.length === 0) {
			
				// Match failed
				chk[i] = false;
				continue next;
			}
			
			pos = stk.pop();
			e = stk.pop();
		}
	}
	
	return r.reverse();
}


// Performs a right scan
function scanRight(a, seq, pivot) {

	for (var i = pivot || 0; i < seq.length - 1; i++)
		a = seq[i].cmb.right(a, seq[i + 1]);
	
	return a;
}


// Filters an element by the selector
function filter(e, sel) {

	var f = sel.ftr, 
		i = f.length, 
		t = sel.utag, 
		fi, 
		nn;
	
	// Filter tag
	if (t !== "*" && t !== (HTML_ELEMS[nn = e.nodeName] || nn.toUpperCase()))
		return false;
	
	// Apply other filters
	while (i--)
		if (!(fi = f[i]).test.apply(e, fi))
			return false;
	
	return true;
}


// Filters an array of elements by the selector
function filterAll(a, sel, tag, inPlace) {

	var /* filters */ f = sel.ftr, fc = f.length, fi, fv, 
		/* results */ r = (inPlace ? a : []), ri = 0,
		/* input   */ ai, av, 
		/* class   */ cls = sel.cls, cn,
		/* tag     */ t = sel.utag, nn;

	outer:
	for (ai = 0; av = a[ai]; ++ai) {
	
		// Optimized className comparison
		if (!_xml && cls && typeof (cn = av.className) === "string") {
		
			if ((" " + cn + " ").indexOf(cls) < 0) continue;
			else if (fc === 1) { r[ri++] = av; continue; }
		}
		
		// Filter comments
		if (!inPlace && t === "*" && av.nodeType !== 1)
			continue;
		
		// Filter tag
		if (tag && t !== "*" && t !== (HTML_ELEMS[nn = av.nodeName] || nn.toUpperCase())) 
			continue;
	
		// Apply other filters
		for (fi = 0; fi < fc; ++fi)
			if ((fv = f[fi]).test.apply(av, fv) === false)
				continue outer;
		
		r[ri++] = av;
	}
	
	r.length = ri;
	return r;
}


// == DRIVER ==


// Performs initialization
function setup(ctx) {

	if ((ctx || (ctx = D)) === D) {
	
		// Set document defaults
		_ctx = D;
		_xml = DXML;
		_doc = D;
		_connected = true;
	
	} else {
	
		// Determinte context
		ctx = (typeof ctx === "string") ? (query(ctx)[0]) : (ctx || D);
		if (!ctx || !ctx.nodeType) throw new Error("Invalid context.");
		
		// Get document node
		_doc = doc(ctx);
		
		// Set XML switch
		_xml = isXML(_doc);
		
		// Set connected flag
		_connected = (
			ctx.nodeType === 9 || 
			ctx === _doc.documentElement || 
			contains(_doc.documentElement, ctx));
	}
	
	// Set the search function
	search = (options.useQSA && ctx.querySelectorAll) ? searchQSA : searchDOM;

	// Increment transaction ID
	++_xid;
	
	// Detect MSXML
	_msxml = _xml && !_doc.getElementById;
	
	// Store context
	return _ctx = ctx;
}


// Performs shortcuts for special selectors
function bypass(sel) {

	var e, attr;
	
	if (typeof sel !== "string") 
		return [];
	
	// Simple ID selector bypass
	if (sel.charAt(0) === "#" && _connected && !_xml && ID_QRY.test(sel)) {
	
		e = byId(_doc, sel.substring(1));
		if (e === null) return [];
		return (e && (_ctx.nodeType === 9 || contains(_ctx, e))) ? [e] : null;
	}
	
	// Simple class name selector bypass
	if (_hasByClass && sel.charAt(0) === "." && CLS_QRY.test(sel) && _ctx.getElementsByClassName)
		return slice.call(_ctx.getElementsByClassName(sel.substring(1)), 0);
	
	// Simple HTML element queries
	if (HTML_ELEMS[sel])
		return slice.call(_ctx.getElementsByTagName(sel), 0);

	// QSA bypass
	if (options.useQSA && _ctx.querySelectorAll) {
	
		// For rooted QSA, attach an arbitrary attribute and modify selector
		if (_ctx.nodeType !== 9 && !options.qsaCompatible) {
		
			attr = _ctx.getAttribute(SCOPE_ATTR);
			if (!attr) _ctx.setAttribute(SCOPE_ATTR, attr = String(_scopeID++));
			sel = "[" + SCOPE_ATTR + "='" + attr + "'] " + sel;
		}
		
		try { return slice.call(_ctx.querySelectorAll(sel), 0); }
		catch (x) { /* Bypass Fails */ }
	}
	
	return null;
}

// Evaluates a selector in a fragment context
function queryFragment(sel, frag, elems) {

	var ctx;
	
	try {
	
		// Move fragment into a disconnected element
		ctx = frag.ownerDocument.createElement("div");
		ctx.appendChild(frag);
		
		query(sel, ctx, elems);
	
	} finally {
	
		// Restore fragment
		while (ctx.firstChild) 
			frag.appendChild(ctx.firstChild);
	}
}

// Evaluates the selector
function query(sel, ctx, elems) {

	// Delegate if context is a fragment
	if (ctx && ctx.nodeType === 11)
		return queryFragment(sel, ctx, elems);
	
	// Optimize query("body")
	if (sel === "body" && !ctx && !elems && D.body && !DXML)
		return [D.body];
	
	var chain, a, i;

	// Initialize system
	ctx = setup(ctx);

	// Attempt to bypass parsing
	if (elems === undefined) a = bypass(sel);
	
	if (!a) {
	
		// Parse selector
		chain = parse(sel);
		
		// Sort input array and remove non-elements
		if (elems)
			elems = sort(elems, false, true);
	
		// For each selector sequence, add sequence matches to results
		for (i = 0; i < chain.length; ++i)
			a = merge(search(chain[i], elems), a);
	}
	
	return a;
}


// Filters an array of elements
function queryFilter(a, sel, ctx) {

	if (a.length === 0) return [];
	else return query(sel, ctx || a[0].ownerDocument, a);
}


// Returns a value indicating whether an element matches a selector
function queryMatches(e, sel, ctx) {

	return e.nodeType === 1 && query(sel, ctx || e.ownerDocument, [e]).length > 0;
}


// Traverses down the document tree
function walk(elems, sel) {

	if (elems.length === 0) 
		return [];
	
	var len = elems.length, i, p, e, a;
	
	for (i = 0; i < len; ++i) {
	
		e = elems[i];
		if (e.nodeType !== 1) continue;

		// Skip if descendant of last
		if (p && contains(p, e)) continue;
		
		a = merge(query(sel, e), a);
		p = e;
	}
	
	return a;
}


// == FEATURE & BUG DETECTION ==

!function() {

	var SRC_INDEX = false,
		R = D.documentElement,
		d = D.createElement("div"),
		id = "selectus" + (new Date()).getTime(),
		slowContains,
		attrMap;
	
	d.style.display = "none";
	d.innerHTML = "<form><input name='id' /><input id='length' /></form><a class='TEST' name='" + id + "'></a>";
	d.appendChild(D.createComment(""));
	
	R.insertBefore(d, R.firstChild);
	
	// querySelectorAll support
	try { d.querySelectorAll(".TEST")[0].nodeType; }
	catch (x) { _hasQSA = false; }
	
	// getElementsByClassName support
	try {
	
		d.getElementsByClassName("TEST")[0].className = "TEST2";
		
		// Safari 3: Improperly caches getElementsByClassName results
		if (d.getElementsByClassName("TEST").length === 1)
			_hasByClass = false;
	}
	catch (x) { _hasByClass = false; }
		
	
	// matchesSelector support
	_matchesSel = (function() {
	
		var p = ["matchesSelector", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector" ];
		
		for (var i = 0; i < p.length; ++i) {
		
			if (d[p[i]]) {
			
				// Verify that invalid selectors throw an error
				try { d[p[i]]("!"); return false; }
				catch (x) { return p[i]; }
			}
		}
		
		return false;
	}());

	// Use looping array copy if needed	
	try {
	
		// (IE: doesn't allow calling Array.slice on NodeLists)
		slice.call(d.childNodes, 0)[0].nodeType;
		
		// (IE/Opera9: elements with id="length" hide length)
		if (typeof d.getElementsByTagName("*").length !== "number")
			throw "";
	
	} catch (x) {
	
		slice = function() {
		
			if (this.slice) return this.slice(0);
			var r = [];
			for (var i = 0, j = 0; this[i]; ++i) r[j++] = this[i];
			return r;
		};
	}
	
	// Use slower alternatives for compareDocumentPosition
	if (!d.compareDocumentPosition) {
	
		slowContains = function(a, b) {
		
			if (a === b) return false;
			
			for (var p = b; p = p.parentNode;)
				if (p === a) return true;
			
			return false;
		};
		
		if (d.contains !== undefined) {
		
			// IE, Safari, Opera
			contains = function(a, b) {
			
				if (a === b) return false;
				else if (b.ownerDocument === a) return true;
				else if (_msxml) return slowContains(a, b);
				else if (a.contains) return a.contains(b);
				else return false;
			};
		
		} else {
		
			// This is very slow
			contains = slowContains;
		}
		
		// Traversing contains-based compare
		compare = function(a, b) {
		
			var e, s, i, ai, bi, ad, bd;
			
			if (a === b) return 0;
			
			if (SRC_INDEX) {
			
				ai = a.sourceIndex;
				bi = b.sourceIndex;
				ad = a.ownerDocument;
				bd = b.ownerDocument;
				
				if ((i = ai - bi) &&
					(ad === bd) &&
					(ad.all || {})[ai] === a &&
					(bd.all || {})[bi] === b) {
					
					return i;
				}
			}
			
			if (contains(a, b)) return -1;
			if (contains(b, a)) return 1;
			
			for (e = a; e; e = e.parentNode) {
			
				if (e.parentNode && !contains(e.parentNode, b))
					continue;
				
				while ((s = e.previousSibling) && (e = s))
					if (e === b || (e.nodeType === 1 && contains(e, b))) 
						return 1;
				
				return -1;
			}
		};
		
		SRC_INDEX = (d.sourceIndex !== undefined && d.all);
	}
	
	// Check getElementById if needed (IE: returns elements with name = id)
	if (D.getElementById(id)) {
	
		byId = function(d, id) {
		
			var e = d.getElementById(id);
			return e === null || (e && (e.id === id || attr(e, "id") === id)) ? e : undefined;
		};
	}
	
	// Filter comments if needed (IE: returns comments for *)
	if (d.getElementsByTagName("*")[4]) {
	
		copyTagList = function(a, tag) {
		
			return (tag === "*") ? elemsOnly(a) : slice.call(a, 0);
		};
	}
	
	// Use node attribute match if attributes can be hidden by properties (IE < 8)
	if (d.firstChild.getAttribute("id")) {
	
		// Use property names for attributes
		attrMap = { "class": "className", "for": "htmlFor" };
		
		attr = function(e, n) {
		
			var a;
			
			if (_xml) a = e.getAttribute(n);
			else if ("src|href".indexOf(n) >= 0) a = e.getAttribute(n, 2);
			else a = e.getAttribute(attrMap[n] || n);
			
			if (a !== null && typeof a !== "string")
				a = (a = e.getAttributeNode(n)) && a.value || null;
			
			return a;
		};
		
		filters._id = function(id) {
		
			return this.id === id || attr(this, "id") === id;
		};
	}
	
	R.removeChild(d);
	d = R = null;
	
}();


// == EXPORT API ==

var options = {

    useQSA: _hasQSA,
	qsaCompatible: true,
	negativeAttributeMatch: false,
	customFilters: false
};



exports.options = options;
exports.filters = filters;
exports.query = query;
exports.filter = queryFilter;
exports.matches = queryMatches;
exports.search = walk;
exports.sort = sort;
};

__modules[10] = function(exports) {
/*

- IE GC assistance will only work for elements in this frame.

*/

var _M0 = __require(11), generateKey = _M0.generate;

var dataKey = generateKey(),
	uidKey = generateKey(),
	window = this,
	textContent = "textContent",
	uid = 1;

// Returns the text content of the node
function getText(e) {

	return e[textContent] + "";
}

// Sets the text content of the node
function setText(e, v) {

	e[textContent] = v + "";
}

// Returns a unique identifier for the node
function uniqueID(e) {

	return e[uidKey] || (e[uidKey] = uid++);
}

// Returns the data object associated with the node
function dataMap(e) {

	return e[dataKey] || (e[dataKey] = {});
}

// Gets data associated with the node
function getData(e, key, def) {

	var d = dataMap(e)["@" + (key || "")];
	
	if (d === void 0 && def !== void 0)
		setData(e, key, d = def);
	
	return d;
}

// Sets data associated with the node
function setData(e, key, val) {

    var d = dataMap(e);
	key = "@" + (key || "");
	
    if (val === void 0) {
    
        if (d[key]) delete d[key];
        
    } else {
    
        d["@" + (key || "")] = val;
    }
}

// Returns true if the first node contains the second node
function contains(a, b) {

	return !!(a.compareDocumentPosition(b) & 16);
}

// Performs cleanup on a node (only useful when GC is buggy)
function finalize(e) {

	return e;
}

// Clones a node
function clone(e, deep) {

	return e.cloneNode(deep);
}

// Removes all children from a node
function clear(e) {

	while (e.firstChild)
		e.removeChild(e.firstChild);
	
	return e;
}

// Removes a node from the tree
function detach(e) {

	if (e.parentNode)
		e.parentNode.removeChild(e);
}

// Removes and finalizes a node
function dispose(e) {

	detach(e);
	finalize(e);
}

// Gets the next sibling element
function nextElement(e) {

	var n = e.nextElementSibling;
	if (n) return n;
	
	while ((e = e.nextSibling) && e.nodeType !== 1);
	return e;
}

// Gets the previous sibling element
function previousElement(e) {

	var p = e.previousElementSibling;
	if (p) return p;
	
	while ((e = e.previousSibling) && e.nodeType !== 1);
	return e;
}

// Gets the first child element
function firstElement(e) {

	var c = e.firstElementChild;
	if (c) return c;
	
	for (e = e.firstChild; e && e.nodeType !== 1; e = e.nextSibling);
	return e;
}

// Gets the last child element
function lastElement(e) {

	var c = e.lastElementChild;
	if (c) return c;
	
	for (e = e.lastChild; e && e.nodeType !== 1; e = e.previousSibling);
	return e;
}

// Gets the child elements
function children(e) {

	var c = e.children;
	if (c) return c;
	
	for (c = [], e = e.firstChild; e; e = e.nextSibling)
		if (e.nodeType === 1)
			c.push(e);
			
	return c;
}

// Returns true if the object is Array-like
function isArrayLike(o) {

	return o && typeof o.length === "number";
}

// Copies a node list
function copyList(list) {

	return [].slice.call(list, 0);
}

// Returns an array of nodes from a node, NodeList, or array
function toArray(obj) {

	if (obj === null || obj === undefined) return [];
	else if (Array.isArray(obj)) return obj;
	else if (obj.nodeType || obj.window === obj) return [obj];
	else if (isArrayLike(obj)) return copyList(obj);
	else return [obj];
}

//@jiac:if LEGACY

// Feature/bug detection
(function() {

	var tmp = window.document.createElement("div");
	tmp._x = 1;
	
	// Contains function (IE < 9, Safari < 4)
	if (!tmp.compareDocumentPosition && tmp.contains)
		contains = function(a, b) { return (a !== b && a.contains(b)); };

	// Test if cloning has issues (IE < 9)
	if (tmp.cloneNode(true)._x && tmp.uniqueID && tmp.clearAttributes)
		fixCloneIE();
	
	// Assume GC is broken for IE < 9
	if (!tmp.addEventListener && tmp.attachEvent)
		fixLeaksIE();
	
	// Test if slicing throws with NodeLists (IE < 9)
	try { [].slice.call(tmp.childNodes, 0); }
	catch (x) { fixSliceIE(); }
	
	// User innerText instead of textContent (IE < 9)
	if (tmp[textContent] === undefined && tmp.innerText !== undefined)
		textContent = "innerText";
	
	tmp = null;
	
})();

// Workaround for non-generic slice in IE < 9
function fixSliceIE() {

	isArrayLike = (function(o) {
	
		if (!o) return false;
		var len = o.length;
		
		// IE NodeLists "length" property can be shadowed by an element
		return (typeof len === "number") ||
			(typeof len === "object" && o.length.nodeType && o[0] && o[0].nodeType);
	});
	
	copyList = (function(list) {
	
		if (typeof list.slice === "function")
			return list.slice(0);
		
		if (list.slice) return list.slice(0);
		var r = [];
		for (var i = 0, j = 0; list[i]; ++i) r[j++] = list[i];
		return r;
	});
}

// Workaround for cloning bugs in IE < 9
function fixCloneIE() {

	dataMap = function(e) {
	
		var uid = uniqueID(e), d = e[dataKey];
		return (d && d.$id === uid ? d : (e[dataKey] = { $id: uid }));
	};
	
	clone = (function(n, deep) {
	
		var c = n.cloneNode(deep), i;
		
		if (c.nodeType === 1) { // Element
		
			fixAll(n, c, deep);
		
		} else if (c.childNodes) { // Document Fragment
		
			for (i = 0; i < n.childNodes.length; ++i)
				if (n.childNodes[i].nodeType === 1)
					fixAll(n.childNodes[i], c.childNodes[i], true);
		}
		
		return c;
	});
	
	function fix(a, b, deep) {
	
		b.clearAttributes(); // Remove attributes and event handler list
		b.mergeAttributes(a, false); // Add attributes back in
		b[uidKey] = null; // Remove unique ID
		
		switch (b.nodeName.toLowerCase()) {			
		
		case "script":
			b.src = a.src;
			if (deep) b.text = a.text;
			break;
		
		case "object":
			b.outerHTML = a.outerHTML;
			break;
		
		case "input":
			if (a.checked) b.defaultChecked = b.checked = a.checked;
			b.value = a.value;
			b.defaultValue = a.defalutValue;
			break;
		
		case "option":
			b.selected = a.defaultSelected;
			break;
			
		}
	}
	
	function fixAll(n, c, deep) {
	
		fix(n, c, deep);
		
		var a = n.getElementsByTagName("*"), 
			b = c.getElementsByTagName("*"),
			i,
			e;
		
		for (i = 0; e = a[i]; i++)
			fix(e, b[i], true);
	}
}

// Workarounds for memory leaks in IE < 9
function fixLeaksIE() {

	/*
	
	IE GARBAGE COLLECTION HELP
	
	Assume that IE's GC doesn't work anyway and store references to elements
	that have expandos or handlers defined.  When the page is unloaded, use
	clearAttributes to clean everything up.
	
	*/
	
	var gc = {},
		props = {},
		map = dataMap,
		k;
	
	// Map initial window properties
	for (k in window) 
		props[k] = 1;
	
	dataMap = function(e) {
	
		// Mark for GC
		if (e.clearAttributes) 
			gc[uniqueID(e)] = e;
		
		return map(e);
	};
	
	clear = function(e) {
	
		clearTree(e);
		
		while (e.firstChild)
			e.removeChild(e.firstChild);
	};
	
	finalize = function(e) {
	
		clearTree(e);
		clearNode(e);	
		return e;
	};
	
	window.attachEvent("onunload", clearAll);
	
	function clearTree(e) {
	
		// Finalize all elements in subtree
		var a = e.getElementsByTagName("*"), i, n;
		
		for (i = 0; n = a[i++];) 
			clearNode(n);
			
		return e;
	}
	
	function clearNode(n) {
	
		var id = uniqueID(n);
		
		if (gc[id]) {
		
			// Remove data and handlers
			n.clearAttributes();
			delete gc[id];
		}
	}
	
	function clearAll() {
	
		var k;
		
		// Clear node expandos and handlers
		for (k in gc)
			gc[k].clearAttributes();
		
		// Clear window properties added since script was loaded
		for (k in window) 
			if (!(k in props))
				try { window[k] = 0; } catch (x) {};
		
		// Clear this handler
		window.detachEvent("onunload", clearAll);
	}
	
}

//@jiac:endif LEGACY



exports.uniqueID = uniqueID;
exports.getData = getData;
exports.setData = setData;
exports.contains = contains;
exports.clone = clone;
exports.clear = clear;
exports.detach = detach;
exports.dispose = dispose;
exports.getText = getText;
exports.setText = setText;
exports.firstElement = firstElement;
exports.lastElement = lastElement;
exports.nextElement = nextElement;
exports.previousElement = previousElement;
exports.children = children;
exports.toArray = toArray;
};

__modules[11] = function(exports) {
var HOP = Object.prototype.hasOwnProperty;

function has(obj, k) {

    return HOP.call(obj, k); 
}

function set(a, b) {

	Object.keys(b).forEach((function(k) { return a[k] = b[k]; }));
	return a;
}

function add(a, b) {
	
	Object.keys(b).forEach((function(k) {
		
		if (a[k] === void 0)
			a[k] = b[k];
	}));
	
	return a;
}

function forEach(obj, fn) {

	Object.keys(obj).forEach(fn);
}

function generate() {

    return "DOMINO_" + (+new Date) + "_" + (Math.random() * 9999 >>> 0) + "";
}

var KeySet = es6now.Class(function(__super) { return {

    constructor: function(a) {
    
        if (typeof a !== "object")
            a = arguments;
        
        for (var i = 0; i < a.length; ++i)
            this[a[i]] = 1            
    },
    
    has: function(key) { return this[key] === 1 },
    add: function(key) { this[key] = 1 },
    remove: function(key) { this[key] = 0 },
    forEach: function(fn) { forEach(this, fn) }
    
}});

exports.has = has;
exports.set = set;
exports.add = add;
exports.forEach = forEach;
exports.generate = generate;
exports.KeySet = KeySet;
};

__modules[12] = function(exports) {
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

__modules[13] = function(exports) {
var Keys = __require(11);

var D = decodeURIComponent,
	E = encodeURIComponent,
	window = this;

var def = {

	separator: "&",
	equals: "=",
	lowerCase: false
};

function options(o) {

	return o ? Keys.add(o, def) : def;
}

// Converts a hash to a querystring
function stringify(m, op) {

	var a = [], x;
	
	op = options(op);
	
	if (typeof m !== "object") {
	
		x = {};
		x[m.toString()] = "";
		m = x;
	}
	
	// TODO: what if value is an Array?
	Object.keys(m).forEach(function(k) {
	
		if (op.lowerCase) k = k.toLowerCase();
		a.push(E(k) + op.equals + E(m[k] + ""));
	});
	
	return "?" + a.join(op.separator);
}

// Splits a URL into parts
function split(url) {

	var s = url.indexOf("?"),
		h = url.indexOf("#");
	
	if (s < 0)
		s = url.length;
		
	if (h < s) 
		h = url.length;
	
	return [ url.slice(0, s), url.slice(s, h), url.slice(h) ];
}

// Parses a querystring
function parse(s, op) {

	var m = {}, a, i, p, k;
	
	if (s === undefined)
		s = window.location.search;
	
	op = options(op);
	
	if (s.charAt(0) === "?")
		s = s.slice(1);
	
	var a = s.split(op.separator), m = {}, i, p, k;
	
	for (i = 0; i < a.length; ++i) {
	
		if ((p = a[i].indexOf(op.equals)) === -1) 
			p = a[i].length;
		
		if (k = D(a[i].substring(0, p))) {
		
			if (op.lowerCase) k = k.toLowerCase();
			m[k] = D(a[i].substring(p + 1));
		}
	}
	
	return m;
}

// Parses the querystring in a URL
function fromURL(url, op) {

	return parse(split(url)[1], op);
}

// Replaces the querystring in a URL
function replace(url, m, op) {

	var a = split(url);
	a[1] = stringify(m, op);
	return a.join("");
}

// Appends querystring data to a URL
function append(url, m, op) {

	var a = split(url);
	a[1] = stringify(Keys.set(parse(a[1], op), m), op);
	return a.join("");
}

exports.stringify = stringify;
exports.parse = parse;
exports.fromURL = fromURL;
exports.replace = replace;
exports.append = append;
};

__modules[14] = function(exports) {
/*

- Add event mapping, scoped to a dom object instance?  The problem
  here is that we rely on the original function being extensible,
  which might not be the case in ES5.  For right now, we're going
  to have to leave this alone.

- IE garbage collection help will break if we attach handlers to
  elements in other frames.

- Will event registration work for frames in IE?

*/

var getData = __require(10).getData;
var _M0 = __require(11), generateKey = _M0.generate;

var window = this;

// Base event functions
function add(e, p, f, c) { e.addEventListener(p, f, c || false); }
function remove(e, p, f, c) { e.removeEventListener(p, f, c || false); }

if (!window.addEventListener && window.attachEvent) (function() {

	var dataKey = generateKey(),
		uidKey = generateKey(), 
		uid = 1;
	
	// Event functions
	var evtFn = {
	
		preventDefault: function() { this.returnValue = false; },
		getPreventDefault: function() { return !this.returnValue; },
		stopPropagation: function() { this.cancelBubble = true; }
	};
	
	add = (function(e, p, f) {
	
		p = "on" + p;
		
		var ff = map(e, p, f);

		// If function has not already been attached...
		if (!ff) {
		
			// Create wrapper and attach
			ff = (function() { f.call(e, evt(e)) });
			map(e, p, f, ff);
			e.attachEvent(p, ff);
		}
	});

	remove = (function(e, p, f) {
	
		p = "on" + p;
		
		// Unmap wrapper and detach
		var ff = map(e, p, f, null);
		if (ff) e.detachEvent(p, ff);
	});
	
	add(window, "unload", unload);
	
	// Clears all window handlers (GC)
	function unload() {
	
		var d = getData(window, dataKey) || {}, k;
		
		for (k in d) 
			window.detachEvent(k.substring(0, k.indexOf("-")), d[k]);
	}
	
	// Map or unmap an event handler
	function map(e, p, f, ff) {
	
		var d = getData(e, dataKey, {}),
			id = f[uidKey] || (f[uidKey] = uid++),
			k = p + "-" + id;
		
		if (ff === null) {
		
			f = d[k];
			delete d[k];
			return f;
		
		} else if (ff) {
		
			return (d[k] = ff);
		}
	}

	// Normalize event object
	function evt(o) {
	
		var e = window.event, 
			d = o.document || o.ownerDocument || o,
			r = d.documentElement,
			b = d.body || 0,
			k;
		
		for (k in evtFn) 
			e[k] = evtFn[k];
		
		e.currentTarget = o;
		e.target = e.srcElement || d;
		e.relatedTarget = (e.fromElement === e.srcElement ? e.toElement : e.fromElement);
		e.pageX = (e.clientX || 0) + (r.scrollLeft || b.scrollLeft || 0) - (r.clientLeft || b.clientLeft || 0);
		e.pageY = (e.clientY || 0) + (r.scrollTop || b.scrollTop || 0) - (r.clientTop || b.clientTop || 0);
		
		return e;
	}
	
})();



exports.addListener = add;
exports.removeListener = remove;
};

__modules[15] = function(exports) {
var __this = this; var RE_CSS = (/-(\S)/g),
	RE_CSS_REV = (/[a-z][A-Z]/g),
	CLIST = "classList",
	opacityTextAliased = false,
	classList = true,
	cssMap = {},
	revMap = {};

function computedStyle(e, p) {

	var s = e.ownerDocument.defaultView.getComputedStyle(e, null), v;
	
	if (p === undefined) 
		return s;
	
	v = s[styleName(p)];
	
	if (v === undefined && s.getPropertyValue)
		v = s.getPropertyValue(cssName(p));
	
	return v;
}

function getStyle(e, p) {

	if (typeof cssMap[p] === "object")
		return cssMap[p].get(e, p);
	
	return computedStyle(e, p);
}

function setStyle(e, p, v) {

	if (typeof cssMap[p] === "object") cssMap[p].set(e, p, v);
	else e.style[styleName(p)] = v;
}

function styleName(p) {

	if (typeof cssMap[p] === "string")
		return cssMap[p];
	
	if (p.indexOf("-") >= 0)
		p = p.replace(RE_CSS, (function(m, m1) { return m1.toUpperCase(); }));
	
	return p;
}

function cssName(p) {

	if (revMap[p])
		return revMap[p];
		
	if (p.indexOf("-") === -1)
		p = p.replace(RE_CSS_REV, (function(m) { return m.charAt(0) + "-" + m.charAt(1).toLowerCase(); }));
	
	return p;
}

function mapStyle(from, to) {

	cssMap[from] = to;
	if (typeof to === "string") revMap[to] = from;
}

function hasClass(e, n) {

	if (classList && e[CLIST]) 
		return e[CLIST].contains(n);
	
	var s = e.className;
	
	if (typeof s !== "string") 
		s = e.getAttribute("class");
	
	return ((" " + s + " ").indexOf(" " + n + " ") >= 0);
}

function addClass(e, n) {

	if (classList && e[CLIST])
		return e[CLIST].add(n);
	
	var s = e.className, at = (typeof s !== "string");
	
	if (at) s = e.getAttribute("class");
	
	if ((" " + s + " ").indexOf(" " + n + " ") === -1) {
	
		s += " " + n;
		
		if (at) e.setAttribute("class", s);
		else e.className = s;
	}
}

function removeClass(e, n) {

	if (classList && e[CLIST])
		return e[CLIST].remove(n);
	
	var s = e.className, at = (typeof s !== "string"), idx;
	
	if (at) s = e.getAttribute("class");
	
	s = " " + s + " ";
	idx = s.indexOf(" " + n + " ");
	
	if (idx >= 0) {
	
		s = s.slice(0, idx) + s.slice(idx + n.length + 1);
		s = s.trim();
		
		if (at) e.setAttribute("class", s);
		else e.className = s;
	}
}

function toggleClass(e, n) {

	if (classList && e[CLIST])
		return e[CLIST].toggle(n);
	
	if (hasClass(e, n)) {
	
		removeClass(e, n);
		return false;
	
	} else {
	
		addClass(e, n);
		return true;
	}
}

function setClass(e, n, on) {

	if (on) return addClass(e, n);
	else return removeClass(e, n);
}

mapStyle("float", "cssFloat");


(function() {

	var window = __this,
	    root = window.document.documentElement, 
		RE_OPACITY = /progid:DXImageTransform\.Microsoft\.Alpha\(opacity=([^)]*)\)/,
		RE_PX = /^-?\d+(?:px)?$/i,
		RE_INT = /^-?\d/,
		tmp;

	// Simulate getComputedStyle (IE)
	if (!window.getComputedStyle && root.currentStyle) {
	
		computedStyle = (function(e, p) {
		
			var s = e.currentStyle, v;
			
			if (p === undefined)
				return s;
			
			p = styleName(p);
			v = s[p];
			
			// Convert length values to px units
			// Adapted from jQuery and http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
			if (v && RE_INT.test(v) && !RE_PX.test(v)) {
			
				var style = e.style,
					left = style.left,
					rsLeft = e.runtimeStyle && e.runtimeStyle[p];
				
				if (rsLeft)
					e.runtimeStyle.left = v;
				
				style.left = (p === "fontSize" ? "1em" : (v || 0));
				v = style.pixelLeft + "px";
				style.left = left;
				
				if (rsLeft)
					e.runtimeStyle.left = rsLeft;
			}
			
			return v === "" ? "auto" : v;
		});
	}

	// Use "styleFloat" for float CSS property (IE)
	if (root.style.cssFloat === undefined && root.style.styleFloat !== undefined)
		mapStyle("float", "styleFloat");
	
	// Add opacity support for IE < 9
	if (root.style.opacity === undefined && root.filters !== undefined) {
	
		mapStyle("opacity", {
		
			get: function(e, p) {
			
				var f = e.style.filter;
				return f && f.indexOf("opacity=") >= 0 ? (parseFloat(RE_OPACITY.exec(f)[1]) / 100) : 1;
			},
			
			set: function(e, p, v) {
			
				var s = e.style,
					prev = s.filter,
					f = (v >= 1 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + Math.ceil(v * 100) + ")");
				
				f = RE_OPACITY.test(prev) ? 
					prev.replace(RE_OPACITY, f) : 
					prev + " " + f;
				
				if (f.replace(/ /, "")) s.filter = f;
				else s.removeAttribute("filter");
			}
		});

		// Indicate wonky ClearType
		opacityTextAliased = true;
	}
	
	// Check for classList support
	classList = !!root.classList;
	
	tmp = null;
	
})();


exports.computedStyle = computedStyle;
exports.getStyle = getStyle;
exports.setStyle = setStyle;
exports.styleName = styleName;
exports.cssName = cssName;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.setClass = setClass;
};

__modules[16] = function(exports) {
/*

- How should we do the namespaces stuff?  We're going to want to do something
  like have the namespaces defined on some instance object.  Removing it for now.
- tabIndex weirdness on getAttribute? What browsers/versions?
- Safari option "selected" getAttribute hack.  What versions?

*/

var __this = this; var isHTML = __require(3).isHTML;

var attrMap = {};

// Gets an attribute
function getAttribute(e, n) {

	var m;
	
	// Check for HTML attribute mapping
	if ((m = attrMap[n]) && isHTML(e.ownerDocument))
	{
		if (typeof m === "string") n = m;
		else if (m.get) return m.get(e, n);
	}
	
	return e.getAttribute(n) || null;
}

// Sets an attribute
function setAttribute(e, n, v) {

	var m;
	
	// Check for HTML attribute mapping
	if ((m = attrMap[n]) && isHTML(e.ownerDocument)) {
	
		if (typeof m === "string") n = m;
		else if (m.set) return m.set(e, n, v);
	}
	
	if (v === null) e.removeAttribute(n);
	else e.setAttribute(n, v + "");
}

(function() {

	/* 
	
	See [http://msdn.microsoft.com/en-us/library/ms536429(v=vs.85).aspx] for 
	more information on many of these quirks.
	
	*/
	
	var tmp = __this.document.createElement("div"), _get;
	tmp.innerHTML = "<a class='test' href='/a' style='color:green'>test</a>";
	tmp = tmp.firstChild;
	tmp._x = 1;
	
	// Use DOM property names instead of attribute names (IE < 8)
	if (tmp.getAttribute("class") === null && tmp.getAttribute("className") !== null) {
	
		attrMap["class"] = "className";
		attrMap["for"] = "htmlFor";
	}
	
	// Access style attribute through cssText (IE < 9)
	if (!tmp.getAttribute("style") && tmp.style.cssText) {
	
		attrMap["style"] = {
		
			get: function(e, n) { return e.style.cssText.toLowerCase(); },
			set: function(e, n, v) { e.style.cssText = v + ""; }
		};
	}
	
	// Use special "to-string" flag for URL attributes (href and src) (IE < 8)
	if (tmp.getAttribute("href") !== "/a") {
	
		attrMap["src"] = attrMap["href"] = {
		
			get: function(e, n) { return e.getAttribute(n, 2); }
		};
	}
	
	// Use getAttributeNode if getAttribute returns properties (IE < 9)
	if (tmp.getAttribute("_x")) {
	
		_get = getAttribute;
		
		getAttribute = (function(e, n) {
		
			var v = _get(e, n);
			
			if (v !== null && typeof v !== "string")
				v = (v = e.getAttributeNode(n)) && v.value || null;
			
			return v;
		});
	}
	
	tmp = null;
	
})();


exports.getAttribute = getAttribute;
exports.setAttribute = setAttribute;
};

__modules[17] = function(exports) {
var __this = this; var Anim = __require(19);

var Promise = __require(2).Promise;
var parseColor = __require(20).parseColor;
var _M0 = __require(15), getStyle = _M0.getStyle, setStyle = _M0.setStyle, cssName = _M0.cssName, styleName = _M0.styleName;
var uniqueID = __require(10).uniqueID;
var _M1 = __require(16), getAttr = _M1.getAttribute, setAttr = _M1.setAttribute;

var	rgbaOK = true,
	RE_REAL = /^\s*(-?[\d\.]+)\s*(?:(\S+)\s*)?$/i,
	RE_COLOR = /^(color|(\S+Color|stroke|fill))$/;

// Parses a color value
function parseReal(v) {

	if (typeof v === "number") 
	    return { value: v, units: "" };
	
	var m = RE_REAL.exec(v);
	return m ? { value: parseFloat(m[1]), units: m[2] } : { value: 0, units: "px", nan: true };
}

// Begins a color transition
function beginColor(e, t, p, type) {

	var from = parseColor(getStyle(e, p)),
		to = parseColor(t.value),
		rgba = (type === "style" && rgbaOK);
	
	if (!(from && to)) return;
	
	if (from.join(",") === to.join(","))
		t.duration = 0;
	
	t.update = update;
	Anim.animate(t);
	
	function update(y) {
	
		y = (rgba ? "rgba(" : "rgb(") + 
			Math.floor(from[0] + (to[0] - from[0]) * y) + "," +
			Math.floor(from[1] + (to[1] - from[1]) * y) + "," +
			Math.floor(from[2] + (to[2] - from[2]) * y) +
			(rgba ? ("," + (from[3] + (to[3] - from[3]) * y) + ")") : ")");
		
		if (type === "attr") e.setAttribute(p, y);
		else setStyle(e, p, y);
	}
}

// Begins a numeric transition
function beginReal(e, t, p, type) {

	var cur = getStyle(e, p) || (type !== "style" && getAttr(e, p)),
		run = Anim.getAnimation(t.id),
		from = parseReal(cur).value,
		start = from,
		toCSS = parseReal(t.value),
		to = toCSS.value,
		units = toCSS.units;
	
	if (toCSS.nan)
		return (type === "attr" ? setAttr : setStyle)(e, p, t.value);
	
	if (run) {
	
		from = ((run.toValue - run.fromValue) * (to - from) >= 0) ? run.fromValue : run.toValue;
		
		if (from === to) t.duration = 0;
		else t.delay = -Math.abs((start - from) * Anim.getDuration(t.duration) / (to - from));
	}
	
	t.fromValue = from;
	t.toValue = to;
	t.update = update;
	
	if (to - start === 0) 
		t.duration = 0;
	
	Anim.animate(t);
	
	function update(y) {
	
		y = (start + (y * (to - start))) + units;
	
		if (type === "attr") e.setAttribute(p, y);
		else setStyle(e, p, y);
	}
}

// Begins a transition
function begin(e, t) {

	var promise = new Promise(),
		type = e.ownerSVGElement ? "attr" : "style",
		p = cssName(t.property);
	
	t.propertyName = p;
	
	if (type === "style")
		p = styleName(t.property);
	
	t.id = uniqueID(e) + ":" + p;
	t.target = e;
	t.onend = (function(evt) { return promise.resolve(evt); });
	t.onabort = (function(evt) { return promise.reject(evt); });
	
	(p.search(RE_COLOR) >= 0 ? beginColor : beginReal)(e, t, p, type);
	
	return promise.future;
}

// Test support for RGBA values
(function() {

	var d = __this.document.createElement("div"), ok = false;
	
	try {
	
		d.style.color = "rgba(0, 0, 0, .5)";
		ok = (d.style.color.indexOf("rgba") === 0);
	
	} catch (x) {}
	
	d = null;
	rgbaOK = ok;
	
})();

exports.begin = begin;
};

__modules[18] = function(exports) {
var __this = this; var Keys = __require(11);
var Promise = __require(2).Promise;
var _M0 = __require(15), setStyle = _M0.setStyle, cssName = _M0.cssName;

var	DATA_KEY = Keys.generate(),
	prefix,
	endEvent;

// Begins a transition
function begin(e, t) {

	var data = e[DATA_KEY], p, r;
	
	if (!data) {
	
		data = e[DATA_KEY] = {};
		e.addEventListener(endEvent, onend(e, data), false);
	}
	
	p = cssName(t.property);
	r = add(t, p, data);
	apply(e, data);
	
	// Note:  Opera 10.60 will not transition unless the style is set on a promise turn
	setTimeout((function(val) { return setStyle(e, t.property, t.value); }), 1);
	
	return r;
}

// Handler for transitionend event
function onend(e, data) {

	return function(evt) {
	
		var p = evt.propertyName;
		
		if (Keys.has(data, p)) {
		
			// Resolve promise and remove data
			data[p].promise.resolve(evt);
			delete data[p];
		}
		
		if (Object.keys(data).length === 0) 
			apply(e, data);
	};
}

// Adds a transition to a list
function add(t, p, data) {

	var dur = (t.duration === 0 ? 0 : (t.duration || 1000)),
		del = t.delay || 0,
		promise = new Promise(),
		d;
	
	if (typeof dur !== "string") dur += "ms";
	if (typeof del !== "string") del += "ms";
	
	// If property is already transitioning
	if (Keys.has(data, p)) {
	
		d = data[p];
		
		// Reject promise
		d.transition.cancelled = true;
		d.promise.reject(d.transition);
	}
	
	data[p] = {
	
		duration: dur,
		delay: del,
		timing: t.timingFunction || "ease",
		transition: t,
		promise: promise
	};
	
	return promise.future;
}

// Applies a transition
function apply(e, data) {

	var s = e.style,
		prop = [],
		dur = [],
		del = [],
		tim = [];
	
	Keys.forEach(data, (function(k) {
	
		var d = data[k];
		
		prop.push(k);
		dur.push(d.duration);
		del.push(d.delay);
		tim.push(d.timing);
	}));
	
	s[prefix + "Property"] = prop.join(",");
	s[prefix + "Duration"] = dur.join(",");
	s[prefix + "Delay"] = del.join(",");
	s[prefix + "TimingFunction"] = tim.join(",");
}

// Determine browser-specific names
(function() {

	var window = __this.window,
	    a = [ "", "Webkit", "Moz", "O" ], 
		e = [ "transitionend", "webkitTransitionEnd", "transitionend", "OTransitionEnd" ],
		cls = [ "", "WebKitTransitionEvent" ],
		d = __this.document.createElement("div"),
		s = d.style,
		i;
	
	// Find CSS property prefix
	for (i = 0; i < a.length; ++i) {
	
		if (typeof s[a[i] + "TransitionProperty"] === "string") {
		
			// Verify that browser supports transition events (Safari < 4 does not)
			if (!cls[i] || window[cls[i]] !== void 0) {
			
				prefix = a[i] ? (a[i] + "Transition") : "transition";
				endEvent = e[i];
			}
			
			break;
		}
	}
	
	d = null;
	
})();

if (!prefix)
    begin = null;
exports.begin = begin;
};

__modules[19] = function(exports) {
var runMap = {},
	runList = [],
	timer = null,
	FRAME_SIZE = 30,
	RE_TIME = /^\s*(-?\d+)\s*(s||ms)\s*$/i,
	RE_BEZIER = /^\s*cubic-bezier\s*\(\s*(\d+(?:\.\d+)?|\.\d+)\s*,\s*(\d+(?:\.\d+)?|\.\d+)\s*,\s*(\d+(?:\.\d+)?|\.\d+)\s*,\s*(\d+(?:\.\d+)?|\.\d+)\s*\)\s*$/i;

var TIMING = {

	"ease" : [ 0.25, 0.1, 0.25, 1.0 ],
	"linear" : [ 0.0, 0.0, 1.0, 1.0 ],
	"ease-in" : [ 0.42, 0.0, 1.0, 1.0 ],
	"ease-out" : [ 0.0, 0.0, 0.58, 1.0 ],
	"ease-in-out" : [ 0.42, 0.0, 0.58, 1.0 ]
};

function bezier(cp, epsilon) {

	// Adapted from WebCore:UnitBezier.h
	
	var cx = 3.0 * cp[0],
		bx = 3.0 * (cp[2] - cp[0]) - cx,
		ax = 1.0 - cx - bx;
	
	var cy = 3.0 * cp[1],
		by = 3.0 * (cp[3] - cp[1]) - cy,
		ay = 1.0 - cy - by;
	
	return (function(x) {
	
		return sampleY(solveX(x, epsilon));
	});
	
	function solveX(x) {
	
		var t0, t1, t2, x2, d2, i;
		
		// First try a few iterations of Newton's method (normally very fast)
		for (t2 = x, i = 0; i < 8; i++) {
		
			x2 = sampleX(t2) - x;
			
			if (Math.abs(x2) < epsilon)
				return t2;
			
			d2 = sampleDerivativeX(t2);
			
			if (Math.abs(d2) < 1e-6)
				break;
			
			t2 = t2 - x2 / d2;
		}
		
		// Fall back to the bisection method for reliability
		t0 = 0;
		t1 = 1;
		t2 = x;
		
		if (t2 < t0)
			return t0;
			
		if (t2 > t1)
			return t1;
		
		while (t0 < t1) {
		
			x2 = sampleX(t2);
			
			if (Math.abs(x2 - x) < epsilon)
				return t2;
				
			if (x > x2) t0 = t2;
			else t1 = t2;
			
			t2 = (t1 - t0) * 0.5 + t0;
		}
		
		// Failure
		return t2;
	}
	
	function sampleX(t) {
	
		return ((ax * t + bx) * t + cx) * t;
	}
	
	function sampleDerivativeX(t) {
	
		return (3 * ax * t + 2 * bx) * t + cx;
	}
	
	function sampleY(t) {
	
		return ((ay * t + by) * t + cy) * t;
	}
}

// Splits a bezier curve at t
function splitBezier(p0, t) {

	var p1 = sub(p0), 
		p2 = sub(p1), 
		p3 = sub(p2);
	
	return [
		[ p0[0], p1[0], p2[0], p3[0] ],
		[ p3[0], p2[1], p1[2], p0[3] ]
	];
	
	function sub(a) {
	
		var s = [], i;
		
		for (i = 1; i < a.length; ++i) {
		
			s.push([
			
				a[i - 1][0] + (a[i][0] - a[i - 1][0]) * t,
				a[i - 1][1] + (a[i][1] - a[i - 1][1]) * t
			]);
		}
		
		return s;
	}
}

// Parses a string bezier specification
function parseBezier(s) {

	if (typeof s !== "string") 
		return (s || TIMING.ease);
	
	if (s in TIMING) 
		return TIMING[s];
	
	var m = RE_BEZIER.exec(s);
	return m ? [ m[1] * 1, m[2] * 1, m[3] * 1, m[4] * 1 ] : TIMING.ease;
}

// Returns a duration value from a string or number
function getDuration(t) {

	return Math.max(parseTime(t, 1000), 0);
}

// Returns a delay value from a string or number
function getDelay(t) {

	return parseTime(t);
}

// Converts a string time into milliseconds
function parseTime(s, d) {

	if (typeof s !== "string") 
		return (s === 0 ? 0 : (s || d || 0));
	
	var m = RE_TIME.exec(s);
	if (!m) return d || 0;

	var ms = m[1] * 1;
	return (m[2] === "s") ? (ms * 1000) : ms;
}

// Called for every animation frame
function frame() {

	for (var i = runList.length; i--;)
		if (!runList[i]()) 
			runList.splice(i, 1);
	
	if (!runList.length) {
	
		clearInterval(timer);
		timer = 0;
	}
}

// Calculates a new set of control points based on an offset
function offset(c, t) {

	var b = splitBezier([ [ 0, 0 ], [ c[0], c[1] ], [ c[2], c[3] ], [ 1, 1 ] ], t),
		x = b[0][3][0],
		y = b[0][3][1],
		a = trans(b[1][1]),
		b = trans(b[1][2]);
	
	return [ a[0], a[1], b[0], b[1] ];
	
	function trans(p) {
	
		// TODO: divide-by-zero?
		return [ 
			((p[0] - x) / (1 - x)), 
			((p[1] - y) / (1 - y))
		];
	}
}

// Starts an animation
function animate(a) {

	/*
	
	Animation Properties
	
	id (string)
	duration (integer or string)
	delay (integer or string)
	timingFunction (array or string)
	paused (boolean)
	update (function)
	onend (function)
	onabort (function)
	
	*/
	var ms = getDuration(a.duration),
		delay = getDelay(a.delay),
		c = parseBezier(a.timingFunction),
		done = false,
		id = a.id,
		t0 = new Date().getTime(),
		t = 0,
		y = 0,
		bez;

	if (delay < 0 && ms > 0) {
	
		delay = Math.min(-delay, ms);
		c = offset(c, delay / ms);
		ms -= delay;
		delay = 0;
	}
	
	if (ms === 0) 
		t = y = 1;
	
	// Cancel current animation with same ID
	if (id && typeof runMap[id] === "object")
		runMap[id].running = false;
	
	a.running = true;
	a.done = false;
	
	runMap[id] = a;
	runList.push(next);
	
	timer = timer || setInterval(frame, FRAME_SIZE);
	
	// Generate bezier solver
	bez = bezier(c, 1000 / (200 * ms));
	
	// Called on every animation frame
	function next() {
	
		if (done) {
		
			// Animation has been finalized
			return false;
		
		} else if (!a.running) {
		
			// Animation has been cancelled
			end(false);
			return false;
		
		} else if (a.paused) {
		
			// Animation has been paused
			return true;
		
		} else if (delay > FRAME_SIZE) {
		
			// Initial animation delay has not been reached
			delay -= FRAME_SIZE;
			return true;
		}
		
		// Set "running" to false before updating, so that if update throws,
		// the animation will be cancelled on the next turn
		a.running = false;
		a.update(y);
		a.running = true;
		
		if (t === 1) {
		
			end(true);
			return false;
		}
		
		t = Math.min((new Date().getTime() - t0) / ms, 1);
		y = bez(t);
		
		return true;
	}
	
	// Called when an animation is completed or cancelled
	function end(completed) {
	
		if (id && runMap[id] === a) 
			delete runMap[id];
	
		done = true;
		a.cancelled = !completed;
		a.running = false;
		
		var cb = completed ? a.onend : a.onabort;
		if (cb) cb(a);
	}
}

// Returns the current animation with the specified ID
function getAnimation(id) {

	var a = runMap[id];
	return typeof a === "object" && a.running || null;
}

function getFrameRate() { return 1000 / FRAME_SIZE; }
function setFrameRate(fps) { FRAME_SIZE = 1000 / fps; }


exports.getDuration = getDuration;
exports.getDelay = getDelay;
exports.animate = animate;
exports.getAnimation = getAnimation;
exports.getFrameRate = getFrameRate;
exports.setFrameRate = setFrameRate;
};

__modules[20] = function(exports) {
var RE_LIST = /\(([^)]*)\)/,
	RE_LIST_SPLIT = /\s*,\s*/g;

var NAMED_COLORS = {

	black: [ 0, 0, 0, 1 ],
	silver: [ 192, 192, 192, 1 ],
	gray: [ 128, 128, 128, 1 ],
	white: [ 255, 255, 255, 1 ],
	maroon: [ 128, 0, 0, 1 ],
	red: [ 255, 0, 0, 1 ],
	purple: [ 128, 0, 128, 1 ],
	fuschia: [ 255, 0, 255, 1 ],
	green: [ 0, 128, 0, 1 ],
	lime: [ 0, 255, 0, 1 ],
	olive: [ 128, 128, 0, 1 ],
	yellow: [ 255, 255, 0, 1 ],
	navy: [ 0, 0, 128, 1 ],
	blue: [ 0, 0, 255, 1 ],
	teal: [ 0, 128, 128, 1 ],
	aqua: [ 0, 255, 255, 1 ],
	transparent: [ 0, 0, 0, 0 ]
};

function values(s) {

	RE_LIST.lastIndex = 0;
	var m = RE_LIST.exec(s);
	
	return (m) ? m[1].split(RE_LIST_SPLIT) : [];
}

function absRGB(v) {

	var end = v.length - 1;
	
	v = (v.charAt(end) === "%") ? 
		Math.round(255 * v.substring(0, end) / 100) : 
		parseInt(v, 10);
	
	return v;
}

function hsl2rgb(hue, sat, lum) {

	var m1, m2;
	
	if (lum <= 0.5) m2 = lum * (sat + 1);
	else m2 = lum + sat - (lum * sat);
	
	m1 = lum * 2 - m2;
	
	return [ 
		hue2rgb(hue + 1 / 3),
		hue2rgb(hue),
		hue2rgb(hue - 1 / 3)
	];
					 
	function hue2rgb(h) {
	
		if (h < 0) h += 1;
		else if (h > 1) h -=1 ;
		
		if (h * 6 < 1) return h * 6 * (m2 - m1) + m1;
		if (h * 2 < 1) return m2;
		if (h * 3 < 2) return (2 / 3 - h) * 6 * (m2 - m1) + m1;
		return m1;
	}
}

function parseColor(s) {

	var INT = parseInt, list, rgb;
	
	s = s.toLowerCase();
	
	if (s.substring(0, 1) === "#") {
	
		s = s.substring(1, s.length);
		
		if (s.length === 3) {
		
			// Short hex
			return [ 
				INT(s.charAt(0) + s.charAt(0), 16), 
				INT(s.charAt(1) + s.charAt(1), 16),
				INT(s.charAt(2) + s.charAt(2), 16),
				1
			];
		
		} else if (s.length === 6) {
		
			// Long hex
			return [ 
				INT(s.substring(0, 2), 16), 
				INT(s.substring(2, 4), 16),
				INT(s.substring(4, 6), 16),
				1
			];
		}
	
	} else if (s.substring(0, 3) === "rgb") { // RGB, RGBA
	
		list = values(s);
		
		return [
			absRGB(list[0]),
			absRGB(list[1]),
			absRGB(list[2]),
			(s.charAt(3) === "a" && list[3]) ? parseFloat(list[3]) : 1
		];
	
	} else if (s.substring(0, 3) === "hsl") { // HSL, HSLA
	
		list = values(s);
	
		rgb = hsl2rgb(
			((INT(list[0], 10) % 360 + 360) % 360) / 360,
			INT(list[1].substring(0, list[1].length - 1), 10) / 100,
			INT(list[2].substring(0, list[2].length - 1), 10) / 100
		);
		
		return [
			Math.round(rgb[0] * 255),
			Math.round(rgb[1] * 255),
			Math.round(rgb[2] * 255),
			(s.charAt(3) === "a" && list[3]) ? parseFloat(list[3]) : 1
		];
	
	} else if (s in NAMED_COLORS) {
	
		return NAMED_COLORS[s];
	}
	
	return NAMED_COLORS.black;
}

exports.parseColor = parseColor;
};

__require(0, exports);


}, []);