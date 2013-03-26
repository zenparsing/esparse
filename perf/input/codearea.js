/*=es6now=*/(function(fn, deps) { if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof MODULE === 'function') MODULE(fn, deps); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof window !== 'undefined' && "CodeArea") fn.call(window, null, window["CodeArea"] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { 

var __modules = [], __exports = [], __global = this, __undef; 

function __require(i, obj) { 
  var e = __exports[i]; 
  
  if (e !== __undef) 
    return e; 
  
  __modules[i].call(__global, __exports[i] = (obj || {})); 
  
  if (e !== __undef) 
    __exports[i] = e; 
  
  return __exports[i]; 
} 

__modules[0] = function(exports) {
"use strict";

var Editor = __require(1).Editor;


exports.Editor = Editor;
};

__modules[1] = function(exports) {
 "use strict"; var __this = this;

var Actions = __require(2).Actions;
var Caret = __require(8).Caret;
var History = __require(9).History;
var TextBuffer = __require(11).TextBuffer;
var TextView = __require(13).TextView;
var FoldView = __require(14).FoldView;
var TextRange = __require(3).TextRange;
var Selection = __require(16).Selection;
var RichText = __require(17).RichText;
var EventSubscriber = __require(10).EventSubscriber;
var Controller = __require(22).Controller;
var Options = __require(24).Options;
var ParseView = __require(33).ParseView;
var forEachKey = __require(5).forEachKey;

var Layers = __require(35);
var Styles = __require(36);
var HtmlBrush = __require(21);

var BACKGROUND_DELAY = 350,
    MAX_LINE_TOKENS = 256;

var Editor = es6now.Class(EventSubscriber, function(__super) { return {

    constructor: function(elem, options) {
    
        __super.call(this);
        
        if (typeof elem === "string")
            elem = document.getElementById(elem);
        
        if (!elem || elem.nodeType !== 1)
            throw new Error("Invalid element.");
            
        Styles.insertStylesheet(elem);
        
        // Element must be a positioning context
        if (elem.style.position === "static")
            elem.style.position = "relative";
        
        // Build the layers
        this.layers = Layers.build(elem);
        this.element = elem;
        this.frame = this.layers.frame;
        
        this.options = new Options(options);
        
        // Create a RichText helper
        this.richText = new RichText(this.layers.text, this.options.get("tabSize"));
        this.subscribe(this.richText, "renderline", "_onRenderLine");
        this.metrics = this.richText;
        
        // Create a Caret object
        this.caret = new Caret(this.layers.caret);
        
        // Create a user input controller
        this.controller = new Controller(this);
        
        // Queueing
        this.backgroundTimer = 0;
        this.flushTimer = 0;
        this.pending = {};
        
        this.loaded = false;
        this.load();
    },
    
    dispose: function() {
    
        this.unsubscribe();
        this._unload();
        this.richText.dispose();
        this.caret.dispose();
        this.controller.dispose();
        
        for (var i in this.layers)
            this.layers[i].parentNode.removeChild(this.layers[i]);
    },
    
    load: function(text) {
    
        var buffer, view;
        
        this._unload();
        this.loaded = true;
        
        // Create the TextView
        var buffer = TextView.isInstance(text) ? text.getBuffer() : new TextBuffer(text),
            view;
        
        this.textView = view = new FoldView(buffer);
        this.subscribe(this.textView, "change", "_onTextChange");
        
        // Create a parse view
        this.parseView = new ParseView(view, new (this.options.get("parser")));
        this.subscribe(this.parseView, "parse", "_onParse");
        
        // Create a selection object
        this.selection = new Selection(view);
        this.subscribe(this.selection, "change", "_onSelectionChange");
        
        // Create a history controller
        this.history = new History(buffer, this.selection);
        
        // Create an action controller
        this.actions = new Actions(this);
        
        // Reset the input controller
        this.controller.reset();
        
        // Initialize the text display
        this.richText.clear();
        this._replaceLines(0, 0, 0, this.textView.getLineCount() - 1);
        this.enqueue("update-gutter");
        
        this.flushQueue();
    },
    
    focus: function() {
    
        this.controller.focus();
        this.caret.activate();
    },
    
    setOptions: function(options) {
    
        this.options.set(options);
        this.controller.reset();
        this.refresh();
    },
    
    refresh: function() {
        
        this.enqueue("refresh-text", "update-selection", "update-gutter");
        this.flushQueue();
    },
    
    getColumnFromPoint: function(x, line) {
    
        var col = this.richText.getColumnFromPoint(x, line);
        
        if (col === -1) {
        
            rect = this.richText.getRect();
            col = 0;
            
            if (x > rect.left + rect.width)
                col = TextRange.MAX_COL;
            
            col = this.textView.validateRange(new TextRange(line, col)).start.col;
        }
        
        return col;
    },
    
    getRangeFromPoint: function(x, y) {
    
        var rng = this.richText.getRangeFromPoint(x, y),
            rect,
            line,
            col;
        
        // If point does not lie on a rendered line...
        if (!rng) {
        
            rect = this.richText.getRect();
            line = this.richText.getLineFromPoint(y);
            col = 0;
            
            if (x > rect.left + rect.width)
                col = TextRange.MAX_COL;
            
            rng = this.textView.validateRange(new TextRange(line, col));
        }
        
        return rng;
    },
    
    scrollLineIntoView: function(line) {
    
        this.richText.scrollLineIntoView(line);
        this._updateScroll();
    },
    
    scrollIntoView: function(range) {
    
        this.richText.scrollIntoView(range || this.selection);
        this._updateScroll();
    },
    
    enqueue: function() { var __this = this; 
    
        for (var i = 0; i < arguments.length; ++i)
            this.pending[arguments[i]] = true;
        
        if (!this.flushTimer)
            this.flushTimer = setTimeout((function() { "use strict"; __this.flushQueue() }), 0);
    },
    
    flushQueue: function() {
    
        if (this.flushTimer) {
        
            clearTimeout(this.flushTimer);
            this.flushTimer = 0;
        }
        
        var ops = this.pending;
        
        if (ops["refresh-text"])
            this._refreshText();
        else if (ops["update-text"])
            this._updateText();
        
        if (ops["scroll-text"])
            this._scrollText();
        
        if (ops["scroll-into-view"])
            this.scrollIntoView();
        
        if (ops["update-selection"])
            this._updateSelection();
        
        if (ops["update-gutter"])
            this._updateGutter();
        
        forEachKey(ops, (function(k) { "use strict"; return ops[k] = false; }));
    },
    
    _unload: function() {
    
        if (!this.loaded)
            return;
        
        this.unsubscribe(this.textView);
        this.unsubscribe(this.selection);
        this.actions.dispose();
        this.history.dispose();
        this.selection.dispose();
        this.textView.dispose();
        this.parseView.dispose();
        
        this.loaded = false;
    },
    
    _onTextChange: function(evt) {
    
        var ins = evt.inserted,
            rem = evt.removed;
        
        this._replaceLines(rem.start.line, rem.end.line, ins.start.line, ins.end.line);
        this.caret.activate();
        
        if (!evt.virtual)
            this._delayUpdateBackground();
        
        // Only update gutter if number of lines is changing
        if (ins.start.line !== ins.end.line || rem.start.line !== rem.end.line)
            this.enqueue("update-gutter");
    },
    
    _onSelectionChange: function() {
    
        this.actions.clearBiasColumn();
        this.enqueue("update-selection");
    },
    
    _onRenderLine: function(evt) {
    
        var rng = new TextRange(evt.line, 0, evt.line, TextRange.MAX_COL),
            textView = this.textView,
            foldGlyph = FoldView.FOLD_GLYPH,
            text = textView.getLines(evt.line)[0],
            tokens = evt.tokens,
            offset = 0,
            list,
            tok,
            end,
            str,
            i;
        
        list = this.parseView.splitRange(rng);
        
        for (i = 0; i < list.length && tokens.length < MAX_LINE_TOKENS; ++i) {
        
            tok = list[i];
            
            if (!tok.isEmpty()) {
            
                if (offset < tok.start.col)
                    add(text.slice(offset, tok.start.col));
                
                end = tok.end.line > evt.line ? TextRange.MAX_COL : tok.end.col;
                str = text.slice(tok.start.col, end);
                
                add(str, tok.type);
            }
        }
        
        if (offset < text.length)
            add(text.slice(offset));
        
        function add(val, type) {
        
            var a = val.indexOf(foldGlyph), b;
            
            if (a >= 0 && textView.isFold(evt.line, offset + a)) {
            
                b = a + foldGlyph.length;
                
                if (a > 0)
                    tokens.push({ text: val.slice(0, a), type: type });
                
                tokens.push({ text: foldGlyph, type: "fold-glyph" });
                offset += b;
                
                if (val = val.slice(b))
                    add(val, type);
            
            } else {
            
                tokens.push({ text: val, type: type });
                offset += val.length;
            }
        }
    },
    
    _onParse: function(evt) {
    
        var rng = evt.range;
        
        this._spliceLines(rng.start.line, rng.end.line, rng.start.line, rng.end.line);
        this.enqueue("update-text");
        
        if (evt.async) {
        
            this.enqueue("update-selection");
            this.flushQueue();
        }
    },
    
    _spliceLines: function(removeFrom, removeTo, addFrom, addTo) {
    
        this.richText.spliceLines(removeFrom, removeTo - removeFrom + 1, addTo - addFrom + 1);
    },
    
    _replaceLines: function(removeFrom, removeTo, addFrom, addTo) {
    
        this.richText.spliceLines(removeFrom, removeTo - removeFrom + 1, addTo - addFrom + 1);
        this.enqueue("update-text", "update-selection");
    },
    
    _setSurfaceArea: function() {
        
        var frame = this.frame,
            surface = this.layers.surface,
            lineHeight = this.richText.lineHeight,
            lines = this.textView.getLineCount(),
            h,
            w;
        
        h = (lines - 1) * lineHeight + frame.clientHeight;
        w = this.richText.getRenderedWidth() - 20 + frame.clientWidth;
        
        surface.style.height = h + "px";
        surface.style.width = Math.max(surface.offsetWidth, w) + "px";
    },
    
    _refreshText: function() {
    
        this.richText.refresh();
        this._setSurfaceArea();
    },
    
    _updateText: function() {
    
        this.richText.update();
        this._setSurfaceArea();
    },
    
    _scrollText: function() {
    
        var f = this.frame;
        this.richText.scroll(f.scrollLeft, f.scrollTop);
    },
    
    _updateScroll: function() {
    
        var frame = this.frame,
            top = frame.scrollTop;
        
        frame.scrollTop = this.richText.scrollTop;
        frame.scrollLeft = this.richText.scrollLeft;
        
        if (top !== frame.scrollTop)
            this.enqueue("update-gutter");
    },
    
    _updateGutter: function() {
    
        var lines = this.richText.getVisibleLines(),
            html = "",
            style,
            num,
            prev,
            p,
            i;
        
        html = "<div style='position:absolute;left:0;top:" + lines.offsetTop + "px;'>";
        
        if (lines.length > 0 && lines[0].line > 0) {
        
            p = this.textView.mapPoint({ line: lines[0].line - 1, col: 0 }, true);
            prev = p.line + 1;
        }
        
        for (i = 0; i < lines.length; ++i) {
        
            p = this.textView.mapPoint({ line: lines[i].line, col: 0 }, true);
            num = p.line + 1;
            
            if (num === prev) num = "";
            else prev = num;
            
            style = "height:" + lines[i].height + "px";
            html += "<div class='line-number' style='" + style + "' data-line='" + lines[i].line + "'>" + num + "</div>";
        }
        
        html += "</div>";
        
        this.layers.gutter.innerHTML = html;
    },
    
    _updateSelection: function() {
    
        var rng = this.selection.getRange(),
            rects = this.richText.getRangeRects(rng),
            caretRect,
            end;
        
        if (rng.isEmpty()) {
        
            // Caret rect is just the first rect
            caretRect = rects[0];
            
            // Highlight the current line
            rects = [ this.richText.getLineRect(rng.start.line) ];
            this._paintRects(rects, "selection", "current-line");
        
        } else {
        
            // Find rect for insertion point
            end = new TextRange(rng.end.line, rng.end.col),
            caretRect = this.richText.getRangeRects(end)[0];
            
            // Paint selection
            this._paintRects(rects, "selection");
        }
        
        if (caretRect) {
        
            // Show caret
            this.caret.position(caretRect);
            this.caret.activate();
        
        } else {
        
            // Hide caret
            this.caret.hide();
        }
        
        if (this.backgroundTimer === 0)
            this._updateSentinels();
    },
    
    _delayUpdateBackground: function() { var __this = this; 
    
        if (this.backgroundTimer)
            clearTimeout(this.backgroundTimer);
        
        // Clear background
        this._paintRects([], "background");
        
        this.backgroundTimer = setTimeout((function() { "use strict";
        
            __this.backgroundTimer = 0;
            __this._updateSentinels();
            
        }), BACKGROUND_DELAY);
    },
    
    _updateSentinels: function() {
    
        var rng = this.selection.getRange(),
            rects = [],
            list,
            i,
            j;
        
        if (rng.isEmpty()) {
        
            list = this.parseView.getSentinelRanges(rng.start.line, rng.start.col);
            
            for (i = 0; i < list.length; ++i) {
            
                for (j = 0; j < list[i].length; ++j) {
                    
                    rng = list[i][j];
                    rects = rects.concat(this.richText.getRangeRects(rng));
                }
            }
        }
        
        this._paintRects(rects, "background", "highlight");
    },

    _paintRects: function(list, target, type) {
    
        this.layers[target] = HtmlBrush.paintRects(this.layers[target], list, type);
    }
}});

exports.Editor = Editor;
};

__modules[2] = function(exports) {
"use strict";

var TextRange = __require(3).TextRange;
var mixin = __require(4).mixin;
var _M0 = __require(5), hasKey = _M0.hasKey, setKeys = _M0.setKeys;
var Find = __require(6).Find;
var Movement = __require(7).Movement;


// Returns a string of spaces equivalent to a tab at
// the specified column
function tabSpaces(size, col) {

    return " ".repeat(size - (col % size));
}

var Actions = es6now.Class(null, function(__super) { return {

    constructor: function(editor) {
    
        this.editor = editor;
        this.textView = editor.textView;
        this.parseView = editor.parseView;
        this.selection = editor.selection;
        this.history = editor.history;
        this.metrics = editor.metrics;
        this.options = editor.options;
        
        this.insertMode = "";
        this.biasCol = -1;
    },
    
    dispose: function() {
    
        // Empty
    },
    
    // Returns a value indicating whether the command is defined
    isDefined: function(cmd) {
    
        return hasKey(Actions.prototype, cmd);
    },
    
    // Inserts a string
    insert: function(txt) {
    
        if (txt) {
        
            this.pushHistory("insert");
            
            var s = this.selection;
            
            if (!s.isEmpty()) 
                this.textView.remove(s);
            
            this.textView.insert(txt, s.start.line, s.start.col);
        }
    },
        
    // Inserts a newline
    insertNewline: function() {
    
        var r = this.selection.getRange(true);
        
        // Move end point past white space
        r.end = this.textView.movePoint(r.end, function(c) {
        
            return (/[^\S\n]/).test(c) ? 1 : 0;
        });
        
        var start = r.start,
            rng = new TextRange(start.line, 0, start.line, start.col),
            str = this.textView.toString(rng),
            indent = str.match(/^\s+/) || [""];
        
        this.pushHistory();
        this.selection.setRange(r);
        this.insert("\n" + indent);
    },
    
    // Inserts a tab
    insertTab: function() {
    
        if (this.options.get("insertSpaces")) {
        
            var size = this.options.get("tabSize"),
                rng = this.selection.getRange();
                
            rng.normalize();
            
            this.insert(tabSpaces(size, rng.start.col));
            
        } else {
        
            this.insert("\t");
        }
    },
    
    // Inserts a tab or shifts right, depending on the selection
    insertTabShift: function() {
    
        if (this.selection.start.line === this.selection.end.line)
            this.insertTab();
        else
            this.shiftRight();
    },
    
    // Removes a tab or shifts left, depending on the selection
    removeTabShift: function() {
    
        this.shiftLeft();
    },
    
    // Removes the current selection
    remove: function() {
    
        if (!this.selection.isEmpty()) {
        
            this.pushHistory();
            this.textView.remove(this.selection);
        }
    },
    
    // Removes the selection and previous character
    backspace: function() {
    
        this.pushHistory("backspace");
        
        if (this.selection.isEmpty())
            this.selectLeft();

        this.textView.remove(this.selection);
    },
    
    // Removes the selection and next character
    reverseBackspace: function() {
    
        this.pushHistory("rbackspace");
        
        if (this.selection.isEmpty())
            this.selectRight();
        
        this.textView.remove(this.selection);
    },
    
    // Adds an entry to the edit history
    pushHistory: function(state) {
    
        state = state || "";
        
        if (this.insertMode !== state) {
        
            this.insertMode = state;
            this.history.push(this.selection);
        }
    },
    
    // Undoes the last edit
    undo: function() {
    
        this.history.undo(this.selection);
    },
    
    // Redoes the last edit
    redo: function() {
    
        this.history.redo(this.selection);
    },
    
    // Shifts the selected lines to the right by a tab width
    shiftRight: function() {
    
        this.pushHistory();
        
        var rng = this.selection.getRange(true), 
            tab = "\t",
            i;
        
        if (this.options.get("insertSpaces"))
            tab = tabSpaces(this.options.get("tabSize"), 0);
        
        rng.start.col = 0;
        rng.end.col = TextRange.MAX_COL;
        
        this.selection.setRange(rng);
        
        for (i = rng.start.line; i <= rng.end.line; ++i)
            this.textView.insert(tab, i, 0);
        
        this.selection.setStart(rng.start.line, 0);
    },
    
    // Shifts the selected lines to the left by a tab width
    shiftLeft: function() {
    
        this.pushHistory();
        
        var rng = this.selection.getRange(true), p, cnt, i;
        
        rng.start.col = 0;
        rng.end.col = TextRange.MAX_COL;
        
        this.selection.setRange(rng);
        
        for (i = rng.start.line; i <= rng.end.line; ++i) {
        
            p = { line: i, col: 0 },
            cnt = this.options.get("tabSize");
            
            p = this.textView.movePoint(p, function(c) {
            
                if (cnt === 0) return 0;
                else if ((/\s/).test(c)) cnt -= 1;
                else return 0;
                
                return 1;
            });
            
            if (p.col > 0)
                this.textView.remove(new TextRange(i, 0, i, p.col));
        }
        
        this.selection.setStart(rng.start.line, 0);
    },
    
    scrollDown: function() {
    
        this.scroller.scrollDown();
    },
    
    scrollUp: function() {
    
        this.scroller.scrollUp();
    },
    
    foldSelection: function() {
    
        var rng = this.selection.getRange();
        
        // If there is a selection, then collapse that selection
        if (!rng.isEmpty()) {
        
            this.textView.collapse(rng);
            
        } else {
        
            var exp, p;
            
            // Attempt to expand adjacent following fold
            exp = this.textView.expand(rng.start.line, rng.start.col);
            
            if (!exp) {
            
                // Attempt to expand adjacent preceding fold
                p = this.textView.movePoint(rng.start, -1);
                p = this.textView.validatePoint(p);
                exp = this.textView.expand(p.line, p.col);
            }
            
            if (!exp) {
            
                // Attemp to toggle sentinels
                this._foldSentinels(rng.start.line, rng.start.col);
            
            } else {
            
                // Select expanded range
                this.selection.setRange(exp);
            }
        }
    },
    
    _foldSentinels: function(line, col) {
    
        var list = this.parseView.getSentinelRanges(line, col),
            rng,
            start,
            end,
            rng,
            i;
        
        // Find last sentinel pair
        for (i = list.length; i--;) {
        
            if (list[i].length < 2)
                continue;
            
            // Find range between sentinels
            start = list[i][0].end;
            end = list[i][1].start;
            
            rng = new TextRange(start.line, start.col, end.line, end.col);
            
            if (!rng.isEmpty()) {
                
                this.textView.expand(start.line, start.col) ||
                this.textView.collapse(rng);
                
                return true;
            }
        }
        
        return false;
    }
}});

mixin(Actions, Movement);
mixin(Actions, Find);

exports.Actions = Actions;
};

__modules[3] = function(exports) {
"use strict";

// A range of characters in line/col coordinates
var TextRange = es6now.Class(null, function(__super) { return {

    constructor: function(startLine, startCol, endLine, endCol) {
    
        this.start = { line: (startLine = startLine || 0), col: (startCol = startCol || 0) };
        this.end = { line: (endLine === undefined ? startLine : endLine), col: (endCol === undefined ? startCol : endCol) };
    },
    
    // Returns a copy of the start point
    getStart: function() {
    
        return { line: this.start.line, col: this.start.col };
    },
    
    // Returns a copy of the end point
    getEnd: function() {
    
        return { line: this.end.line, col: this.end.col };
    },
    
    // Returns true if the range is equal to the specified range
    equals: function(rng) {
    
        return this.start.line === rng.start.line &&
            this.start.col === rng.start.col &&
            this.end.line === rng.end.line &&
            this.end.col === rng.end.col;
    },

    // Returns a value indicating whether the current selection is empty
    isEmpty: function() {
    
        return (this.start.line === this.end.line && this.start.col === this.end.col);
    },
    
    // Returns a value indicating whether the start point occurs before the end point
    isNormalized: function() {
    
        return (this.start.line < this.end.line) || 
            (this.start.line === this.end.line && this.start.col <= this.end.col);
    },
    
    // Swaps the start and end points if they are out of order
    normalize: function() {
    
        if (this.isNormalized())
            return false;
        
        var s = this.start,
            e = this.end;
        
        this.start = e;
        this.end = s;
        
        return true;
    },
    
    // Returns a string value indicating the relationship between
    // the range and a point
    comparePoint: function(point) {
    
        var line = point.line,
            col = point.col;
        
        if (line < this.start.line || (line === this.start.line && col < this.start.col))
            return "before";
        
        if (line > this.end.line || (line === this.end.line && col >= this.end.col))
            return "after";
        
        return "inside";
    },
    
    // Adjusts the range in reponse to an update in an underlying text space
    adjust: function(removed, inserted) {
    
        var normal = this.isNormalized(),
            empty = this.isEmpty(),
            mod = false;
        
        if (removed) {
        
            byRemove(this.start);
            byRemove(this.end);
        }
        
        if (inserted) {
        
            byInsert(normal ? this.start : this.end, true);
            byInsert(normal ? this.end : this.start, empty);
        }
        
        return mod;
        
        function byInsert(p, left) {
        
            var s = inserted.start,
                e = inserted.end;
                
            if (p.line > s.line) {
            
                mod = true;
                p.line += e.line - s.line;
            
            } else if (p.line === s.line && 
                (p.col > s.col || (left && p.col === s.col))) {
                
                mod = true;
                p.line = e.line;
                p.col += e.col - s.col;
            }
        }
        
        function byRemove(p) {
        
            var s = removed.start,
                e = removed.end;
            
            switch (removed.comparePoint(p)) {
            
                case "inside":
                
                    mod = true;
                    p.line = s.line;
                    p.col = s.col;
                    break;
                
                case "after":
                
                    mod = true;
                    
                    if (p.line > e.line) {
                    
                        p.line -= e.line - s.line;
                    
                    } else {
                    
                        p.line = s.line;
                        p.col = s.col + (p.col - e.col);
                    }
                    
                    break;
            }
        }
    }
}});

TextRange.MAX_COL = Number.MAX_VALUE;

TextRange.MAX_LINE = Number.MAX_VALUE;

TextRange.copy = function(r) {

    return new TextRange(
        r.start.line,
        r.start.col,
        r.end.line,
        r.end.col
    );
};
exports.TextRange = TextRange;
};

__modules[4] = function(exports) {
var getKeys = __require(5).getKeys;

var es5 = !!Object.getOwnPropertyDescriptor;

function mixin(to, from) {

    if (typeof to === "function" && to.prototype)
        to = to.prototype;
    
    if (typeof from === "function" && from.prototype)
        from = from.prototype;
    
    var keys = (Object.getOwnPropertyNames || getKeys)(from),
        desc,
        k,
        i;
    
    for (i = 0; i < keys.length; ++i) {
    
        k = keys[i];
        
        if (es5) {
            
            desc = Object.getOwnPropertyDescriptor(from, k);
            Object.defineProperty(to, k, desc);
        
        } else {
        
            to[k] = from[k];
        }
    }
    
    return to;
}
exports.mixin = mixin;
};

__modules[5] = function(exports) {
"use strict";

var getKeys = Object.keys || ES4_keys,
    forEach = [].forEach || ES4_forEach,
    OP = Object.prototype,
    HOP = OP.hasOwnProperty,
    ENUM_BUG = (function() { "use strict"; var o = { constructor: 1 }; for (var i in o) return false; })(),
    ENUM_BUG_KEYS = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ];

// Returns an array of keys defined on the object
function ES4_keys(o) {

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

// Executes a function for every item in the array
function ES4_forEach(a, fn, self) {

    for (var i = 0, len = this.length >>> 0; i < len; ++i)
        if (i in this)
            fn.call(self, this[i], i, this);
}

// Returns true if the object has a key
function hasKey(o, k) { return HOP.call(o, k); }

// Enumerates over the set of keys defined on the object
function forEachKey(o, fn, self) { return forEach.call(getKeys(o), fn, self); }

// Sets a collection of keys
function setKeys(o, p, p2)  {

    forEach.call(getKeys(p), (function(k) { "use strict"; o[k] = p[k] }));
    
    if (p2) for (var i = 2; i < arguments.length; ++i)
        setKeys(o, arguments[i]);
    
    return o;
}

// Sets a collection of keys, if the property is not already set
function addKeys(o, p, p2) {

    forEach.call(getKeys(p), (function(k) { "use strict"; if (o[k] === undefined) o[k] = p[k]; }));
    
    if (p2) for (var i = 2; i < arguments.length; ++i)
        addKeys(o, arguments[i]);
    
    return o;
}

// Copies the collection of keys to a new object
function copyKeys(p) {

    return setKeys({}, p);
}

var KeySet = es6now.Class(null, function(__super) { return {

    constructor: function(a) {

        if (typeof a !== "object")
            a = arguments;
        
        for (var i = 0; i < a.length; ++i)
            this[a[i]] = 1;
    },
    
    has: function(key) { return (this[key] === 1); },
    add: function(key) { this[key] = 1; },
    remove: function(key) { this[key] = 0; },
    each: function(fn) { forEachKey(this, fn); }
}});



exports.getKeys = getKeys;
exports.hasKey = hasKey;
exports.addKeys = addKeys;
exports.setKeys = setKeys;
exports.forEachKey = forEachKey;
exports.copyKeys = copyKeys;
exports.KeySet = KeySet;
};

__modules[6] = function(exports) {
"use strict";

var TextRange = __require(3).TextRange;

function findNext(textView, startLine, startCol, args) {
    
    var start = textView.mapPoint({ line: startLine || 0, col: startCol || 0 }, true),
        buffer = textView.getBuffer(),
        lineCount = buffer.getLineCount(),
        line = start.line,
        col = start.col,
        pattern = args.regex || toRegex(args.text),
        rng,
        m;
    
    if (typeof pattern === "string") {
    
        if (args.entireWord)
            pattern = "\\b" + pattern + "\\b";
        
        pattern = new RegExp(pattern, (args.ignoreCase ? "ig" : "g"));
    }
    
    while (true) {
    
        pattern.lastIndex = col;    
        m = pattern.exec(buffer.lineAt(line));
        
        if (m) {
        
            rng = new TextRange(line, m.index, line, m.index + m[0].length);
            return textView.unmapRange(rng, true);
        }
        
        line += 1;
        col = 0;
        
        if (line >= lineCount) {
        
            line = 0;
        
        } else if (line === start.line) {
        
            return null;
        }
    }
}

function toRegex(text, ignoreCase) {

    var i, re = "";
    
    for (i = 0; i < text.length; ++i)
        re += "\\u" + pad4(text.charCodeAt(i).toString(16));
    
    return re;
}

function pad4(str) {

    if (str.length < 4)
        str = new Array(4 - str.length + 1).join("0") + str;
    
    return str;
}


var Find = es6now.Class(null, function(__super) { return {


    findNext: function(args) {

        var end = this.selection.end,
            rng = match(this.textView, end.line, end.col, args);
        
        if (rng)
            this.selection.setRange(rng);
    }
}});

exports.Find = Find;
};

__modules[7] = function(exports) {
"use strict";

var TextRange = __require(3).TextRange;

var END_SPACES = /[ \t\v]+$/,
    SPACES_ONLY = /^[ \t\v]+$/,
    TAB = /\t/g;

function expandTabs(text, col, tabSize) {

    var adj = 0, m;
    
    for (TAB.lastIndex = 0; m = TAB.exec(text);) {
    
        if (m.index >= col)
            break;
        
        adj += tabSize - ((m.index + adj) % tabSize) - 1;
    }
    
    return col + adj;
}

function collapseTabs(text, col, tabSize) {

    var adj = 0, m;
    
    for (TAB.lastIndex = 0; m = TAB.exec(text);) {
    
        if (m.index >= col)
            break;
        
        adj += tabSize - ((m.index + adj) % tabSize) - 1;
        col -= adj;
    }
    
    return col;
}

var Movement = es6now.Class(null, function(__super) { return {

    clearBiasColumn: function() { this.biasCol = -1; },
    
    moveLeft: function() { this._moveFn(false, false, this._left); },
    selectLeft: function() { this._moveFn(true, false, this._left); },
    
    moveRight: function() { this._moveFn(false, false, this._right); },
    selectRight: function() { this._moveFn(true, false, this._right); },
    
    moveUp: function() { this._moveFn(false, true, this._up) },
    selectUp: function() { this._moveFn(true, true, this._up) },
    
    moveDown: function() { this._moveFn(false, true, this._down) },
    selectDown: function() { this._moveFn(true, true, this._down) },
    
    moveBOF: function() { this._moveFn(false, false, this._bof) },
    selectBOF: function() { this._moveFn(true, false, this._bof) },
    
    moveEOF: function() { this._moveFn(false, false, this._eof) },
    selectEOF: function() { this._moveFn(true, false, this._eof) },
    
    moveBOL: function() { this._moveFn(false, false, this._bol) },
    selectBOL: function() { this._moveFn(true, false, this._bol) },
    
    moveEOL: function() { this._moveFn(false, false, this._eol) },
    selectEOL: function() { this._moveFn(true, false, this._eol) },
    
    moveNextWord: function() { this._moveFn(false, false, this._nextWord) },
    selectNextWord: function() { this._moveFn(true, false, this._nextWord) },
    
    movePreviousWord: function() { this._moveFn(false, false, this._previousWord) },
    selectPreviousWord: function() { this._moveFn(true, false, this._previousWord) },
    
    movePageUp: function() { this._moveFn(false, true, this._pageUp) },
    selectPageUp: function() { this._moveFn(true, true, this._pageUp) },
    
    movePageDown: function() { this._moveFn(false, true, this._pageDown) },
    selectPageDown: function() { this._moveFn(true, true, this._pageDown) },
    
    goToLine: function(line) {
    
        this.setRange(line, 0);
    },
    
    setStart: function(line, col) {
    
        this.insertMode = "";
        this.selection.setStart(line, col);
    },
    
    setEnd: function(line, col) {
    
        this.insertMode = "";
        this.selection.setEnd(line, col);
    },
    
    setRange: function(startLine, startCol, endLine, endCol) {
    
        this.insertMode = "";
        this.selection.setRange(startLine, startCol, endLine, endCol);
    },
    
    backspaceWord: function() {
    
        if (this.selection.isEmpty())
            this.selectPreviousWord();
    
        this.backspace();
    },
    
    reverseBackspaceWord: function() {
    
        if (this.selection.isEmpty())
            this.selectNextWord();
    
        this.reverseBackspace();
    },
    
    selectWord: function() {
    
        var line = this.selection.end.line,
            col = this.selection.end.col,
            str = this.textView.lineAt(line),
            re,
            c,
            m;
        
        // Back up if positioned at end of line
        if (col >= str.length && col > 0) --col;
        c = str.charAt(col);
        
        // Find current pattern
        ((re = /\s+/).test(c) || (re = /[\w@\$]+/).test(c) || (re = /[^\w\s@\$]+/));
        
        // Find pattern start
        while (col > 0 && re.test(str.charAt(col - 1))) col -= 1;
        
        // Find complete pattern
        m = str.substring(col).match(re);
        
        this.selection.setRange(line, col, line, col + (m ? m[0].length : 0));
        this.insertMode = "";
    },
    
    selectLine: function(line) {
    
        if (line === undefined)
            line = this.selection.end.line;
        
        this.selection.setRange(new TextRange(line, 0, line + 1, 0));
        this.insertMode = "";
    },
    
    selectAll: function() {
    
        this.selection.setRange(new TextRange(0, 0, TextRange.MAX_LINE, TextRange.MAX_COL));
        this.insertMode = "";
    },
    
    _moveFn: function(select, biased, fn) {
    
        var p = fn.call(this, select);
        
        if (select) this.selection.setEnd(p.line, p.col);
        else this.selection.setRange(p.line, p.col);
        
        this.insertMode = "";
        
        if (biased)
            this.biasCol = p.col;
    },
    
    _left: function(select) {

        if (!select && !this.selection.isEmpty())
            return this.selection.getRange(true).getStart();
        
        return this._leftRight(this.selection.getEnd(), -1);
    },

    _right: function(select) {
    
        if (!select && !this.selection.isEmpty())
            return this.selection.getRange(true).getEnd();
    
        return this._leftRight(this.selection.getEnd(), 1);
    },
    
    _leftRight: function(p, step) {
    
        var line = this.textView.lineAt(p.line),
            tabSize = this.options.get("tabSize"),
            offset = p.col,
            tabStep,
            str,
            m;
        
        if (offset === 0 || SPACES_ONLY.test(line.slice(0, offset))) {
        
            if (step === 1) {
            
                tabStep = tabSize - (offset % tabSize);
                str = line.slice(p.col, p.col + tabStep);
                
                if (str.length === tabStep && SPACES_ONLY.test(str))
                    step = tabStep;
            
            } else if (p.col > 0 && offset % tabSize === 0) {
            
                str = line.slice(Math.max(0, p.col - tabSize), p.col);
            
                if (m = END_SPACES.exec(str))
                    step = -(m[0].length);
            }
            
        }
        
        return this.textView.movePoint(p, step);
    },
    
    _up: function() { 
    
        return this._upDown(-1);
    },
    
    _down: function() { 
    
        return this._upDown(1);
    },
    
    _pageUp: function() {
    
        var s = this.metrics.pageSize;
        return this._upDown(s ? -(s - 2) : 0);
    },
    
    _pageDown: function() {
    
        var s = this.metrics.pageSize;
        return this._upDown(s ? (s - 2) : 0);
    },
    
    _upDown: function(count) {
    
        var tabSize = this.options.get("tabSize"),
            p = this.selection.end,
            newLine = p.line + count,
            col = this.biasCol >= 0 ? this.biasCol : p.col;
        
        col = expandTabs(this.textView.lineAt(p.line), col, tabSize);
        col = collapseTabs(this.textView.lineAt(newLine), col, tabSize);
        
        return { line: newLine, col: col };
    },
    
    _bof: function() {
    
        return { line: 0, col: 0 };
    },
    
    _eof: function() {
    
        return { line: TextRange.MAX_LINE, col: TextRange.MAX_COL };
    },
    
    _bol: function() {
    
        return { line: this.selection.end.line, col: 0 };
    },
    
    _eol: function() {
    
        return { line: this.selection.end.line, col: TextRange.MAX_COL };
    },
    
    _nextWord: function(select) {
    
        if (!select && !this.selection.isEmpty())
            return this.selection.getRange(true).getEnd();
        
        var p = this.selection.getEnd(),
            state = 0,
            m;
        
        return this.textView.movePoint(p, function(c) {
        
            while (true) {
            
                switch (state) {
                
                case 0:
                    m = (/([ \f\t\v])|(\n)|([\w@\$])|([^\w@\$])/).exec(c);
                    if (m[1]) state = 1;
                    if (m[2]) state = 2;
                    if (m[3]) state = 3;
                    if (m[4]) state = 4;
                    return 1;
                
                case 1:
                    return (/[ \f\t\v]/).test(c) ? 1 : 0;
                
                case 2:
                    if ((/\n/).test(c)) return 1;
                    state = 1;
                    continue;
                
                case 3:
                    if ((/[\w@\$]/).test(c)) return 1;
                    state = 1;
                    continue;
                
                case 4:
                    if ((/[^\w@\$\s]/).test(c)) return 1;
                    state = 1;
                    continue;
                
                }
                
                break;
            }
            
            return 0;
        });
    },
    
    _previousWord: function(select) {
    
        if (!select && !this.selection.isEmpty())
            return this.selection.getRange(true).getStart();
        
        var p = this.selection.getEnd(),
            state = 0,
            m;
        
        return this.textView.movePoint(p, function(c) {
        
            switch (state) {
            
            case 0:
                state = 1;
                return -1;
            
            case 1:
                m = (/([ \f\t\v])|(\n)|([\w@\$])|([^\w@\$])/).exec(c);
                if (m[1]) state = 1;
                if (m[2]) state = 2;
                if (m[3]) state = 3;
                if (m[4]) state = 4;
                return -1;
            
            case 2:
                if ((/\n/).test(c)) return -1;
                break;
            
            case 3:
                if ((/[\w@\$]/).test(c)) return -1;
                break;
            
            case 4:
                if ((/[^\w@\$\s]/).test(c)) return -1;
                break;
            
            case 5:
                return 0;
            
            }
            
            state = 5;
            return 1;
        });
    }
}});
exports.Movement = Movement;
};

__modules[8] = function(exports) {
var __this = this; "use strict";

var BLINK_INTERVAL = 1250,
    BLINK_RATIO = .5;

function clearTimer(timer) {

    if (timer) clearTimeout(timer);
    return 0;
}

var Caret = es6now.Class(null, function(__super) { return {

    constructor: function(elem) {
    
        this.element = elem;
        this.blinkInterval = BLINK_INTERVAL;
        this.blinkRatio = BLINK_RATIO;
        
        this.timer = 0;
        this.cssClass = elem.className;
        
        this.hide();
    },
    
    dispose: function() {
    
        this.timer = clearTimer(this.timer);
    },
    
    position: function(rect) {
    
        var s = this.element.style;
        s.top = rect.top + "px";
        s.left = rect.left + "px";
        s.height = rect.height + "px";
    },
    
    activate: function() { var __this = this; 
    
        this.active = true;
        this.hidden = false;
        this.visible = true;
        this._setCSS();
        
        clearTimer(this.timer);
        
        this.timer = setTimeout(
            (function() { "use strict"; return __this._onBlink(); }), 
            this.blinkInterval * this.blinkRatio);
    },
    
    deactivate: function() {
    
        this.timer = clearTimer(this.timer);
        
        this.active = false;
        this.visible = !this.hidden;
        this._setCSS();
    },
    
    hide: function() {
    
        this.timer = clearTimer(this.timer);
        
        this.active = false;
        this.visible = false;
        this.hidden = true;
        this._setCSS();
    },
    
    _onBlink: function() { var __this = this; 
    
        var ratio = this.active ? (1 - this.blinkRatio) : this.blinkRatio,
            ms = this.blinkInterval * ratio;
        
        this.visible = !this.visible;
        this._setCSS();
        this.timer = setTimeout((function() { "use strict"; return __this._onBlink(); }), ms);
    },
    
    _setCSS: function() {
    
        this.element.style.visibility = this.visible ? "visible" : "hidden";
        this.element.className = this.cssClass + (this.active ? " active" : "");
    }
}});

exports.Caret = Caret;
};

__modules[9] = function(exports) {
"use strict";

var EventSubscriber = __require(10).EventSubscriber;

var MAX_ENTRIES = 101;

// Creates a new history entry
function entry(selection) {

    return {
        undo: [],
        redo: [],
        range: selection.getRange()
    };
}

var History = es6now.Class(EventSubscriber, function(__super) { return {

    constructor: function(textBuffer, selection) {
    
        __super.call(this);
        
        this.textBuffer = textBuffer;
        this.selection = selection;
        this.list = [];
        this.current = -1;
        this.supressEvents = false;
        
        this.subscribe(textBuffer, "change", "_onTextChange");
    },
    
    dispose: function() {
    
        this.unsubscribe();
    },
    
    // Pushes a state onto the history stack
    push: function() {
    
        var empty = false;
        
        if (this.current >= 0)
            empty = (this.list[this.current].undo.length === 0);
        
        if (!empty) {
        
            this.list.length = ++this.current;
            this._pushEntry();
        }
    },
    
    // Rolls back the last change
    undo: function() {
    
        if (this.current < 0) 
            return;
        
        if (this.current >= this.list.length - 1)
            this._pushEntry();
        
        this.supressEvents = true;
        
        // Get current entry
        var e = this.list[this.current], i, a;
        
        // Apply undo actions in reverse order
        for (i = e.undo.length; i--;) {
        
            a = e.undo[i];
            this.textBuffer.replace(a.range, a.text);
        }
        
        // Restore selection
        if (e.undo.length > 0)
            this.selection.setRange(e.range);
        
        // Back up pointer
        this.current -= 1;
        
        this.supressEvents = false;
    },
    
    // Rolls forward the next change
    redo: function() {
    
        if (this.current >= this.list.length - 2)
            return;
        
        this.supressEvents = true;
        
        // Advance pointer
        this.current += 1;
        
        // Get current entry
        var e = this.list[this.current], 
            next = this.list[this.current + 1],
            i, 
            a;
        
        // Apply redo actions in order
        for (i = 0; i < e.redo.length; ++i) {
        
            a = e.redo[i];
            this.textBuffer.replace(a.range, a.text);
        }
        
        // Restore selection
        if (e.redo.length > 0)
            this.selection.setRange(next.range);
        
        this.supressEvents = false;
    },
    
    _pushEntry: function() {
    
        this.list.push(entry(this.selection));
        
        if (this.list.length > MAX_ENTRIES && this.current > 0) {
        
            this.list.splice(0, 1);
            this.current -= 1;
        }
    },
    
    _onTextChange: function(evt) {
    
        if (this.supressEvents)
            return;
        
        if (this.current < 0)
            this.push();
        
        var e = this.list[this.current];
        
        e.undo.push({ range: evt.inserted, text: evt.removedText });
        e.redo.push({ range: evt.removed, text: evt.insertedText });
    }
}});

exports.History = History;
};

__modules[10] = function(exports) {
var __this = this; "use strict";

// Adds an event listener
function addListener(target, type, fn) {

    if (target.addEventListener) {
    
        target.addEventListener(type, fn, false);
    
    } else if (target.attachEvent) {
    
        fn = IE8_wrapListener(target, fn);
        target.attachEvent("on" + type, fn);
    }
    
    return fn;
}

// Removes an event listener
function removeListener(target, type, fn) {

    if (target.removeEventListener) {
    
        target.removeEventListener(type, false);
    
    } else if (target.detachEvent) {
    
        target.detachEvent("on" + type, fn);
    }
}

// [IE8] Use legacy events API
function IE8_wrapListener(target, fn) {

    return (function() { "use strict"; fn.call(target, IE8_wrapEvent(target)); });
}

var IE8_EVENT_FUNCTIONS = {

    preventDefault: function() { this.returnValue = false; this.defaultPrevented = true; },
    stopPropagation: function() { this.cancelBubble = true; }
};

// Normalize event object
function IE8_wrapEvent(target) {

    var e = window.event, 
        d = target.document || target.ownerDocument || target,
        r = d.documentElement,
        b = d.body || 0,
        k;
    
    for (k in IE8_EVENT_FUNCTIONS) 
        e[k] = IE8_EVENT_FUNCTIONS[k];
    
    e.defaultPrevented = false;
    e.currentTarget = target;
    e.target = e.srcElement || d;
    e.relatedTarget = (e.fromElement === e.srcElement ? e.toElement : e.fromElement);
    e.pageX = (e.clientX || 0) + (r.scrollLeft || b.scrollLeft || 0) - (r.clientLeft || b.clientLeft || 0);
    e.pageY = (e.clientY || 0) + (r.scrollTop || b.scrollTop || 0) - (r.clientTop || b.clientTop || 0);
    
    return e;
}

var EventSubscriber = es6now.Class(null, function(__super) { return {

    constructor: function() {
    
        this.subscriptions = [];
    },
    
    subscribe: function(target, type, fn) { var __this = this; 
    
        if (typeof fn === "string")
            fn = this[fn];
        
        var listener = (typeof fn === "function") ? 
            (function() { "use strict"; return fn.apply(__this, arguments); }) : 
            fn;
        
        this.subscriptions.push({
        
            target: target, 
            type: type,
            listener: addListener(target, type, listener)
        });
    },
    
    unsubscribe: function(target, type) {
    
        var list = this.subscriptions, i, s;
        
        for (i = list.length; i--;) {
        
            s = list[i];
            
            if ((!target || s.target === target) &&
                (!type || s.type === type)) {
                
                removeListener(s.target, s.type, s.listener);
                list.splice(i, 1);
            }
        }
    }
}});

exports.EventSubscriber = EventSubscriber;
};

__modules[11] = function(exports) {
"use strict";

var EventTarget = __require(12).EventTarget;
var TextRange = __require(3).TextRange;

var arraySplice = Array.prototype.splice;

// Splits a string into lines
function split(text) {

    // Normalize line endings
    text = text.replace(/\r\n?|[\u2028\u2029]/g, "\n");
    
    // Remove BOM
    text = text.replace(/^\uFEFF/, "");
    
    // Split into lines
    // [IE8] Using regular expression as split argument does not work
    return text.split("\n");
}

// A text stream arranged in line/col character coordinates
var TextBuffer = es6now.Class(EventTarget, function(__super) { return {

    constructor: function(txt) {
    
        __super.call(this);
        
        this.lines = [ "", "" ];
        this.insert(txt || "", 0, 0);
    },
    
    dispose: function() {
    
        // Empty
    },
    
    // Gets the underlying buffer
    getBuffer: function() {
    
        return this;
    },
    
    // Maps a point into the underlying buffer space
    mapPoint: function(p) {
    
        return { line: p.line, col: p.col };
    },
    
    // Unmaps a point from the underlying buffer space
    unmapPoint: function(p) {
    
        return { line: p.line, col: p.col };
    },
    
    // Returns the number of text lines in the buffer
    getLineCount: function() {
    
        return this.lines.length - 1;
    },
    
    // Returns the string at specified line number
    lineAt: function(i) {
    
        if (i < 0 || i >= this.lines.length)
            return "";
        
        return this.lines[i] + (i === this.lines.length - 2 ? "" : "\n");
    },
    
    // Gets the character at the specified position
    charAt: function(line, col) {
    
        if (line < 0 || col < 0 || line > this.lines.length - 2) 
            return "";
        
        var str = this.lines[line];
        
        if (col === str.length) return "\n";
        else if (col > str.length) return "";
        
        return str.charAt(col);
    },

    // Gets an array of lines
    getLines: function(from, to) {
    
        if (to === void 0)
            to = from;
        
        if (from > to || from >= this.lines.length - 1)
            return [];
        
        return this._toArray(new TextRange(from, 0, to, TextRange.MAX_COL));
    },
    
    // Gets the text within the specified range
    toString: function(rng) {
    
        return this._toArray(rng).join("\n");
    },
    
    // Inserts a string into the text
    insert: function(str, line, col) {
    
        return this.replace(new TextRange(line, col), str);
    },
    
    // Removes the text within the specified range
    remove: function(rng) {
    
        return this.replace(rng, "");
    },
    
    replace: function(rng, text) {
    
        rng = this.validateRange(rng);
        
        var startLine = rng.start.line,
            endLine = rng.end.line,
            pre = this.lines[startLine].slice(0, rng.start.col),
            post = this.lines[endLine].slice(rng.end.col),
            removedText = this.toString(rng),
            inserted = new TextRange(startLine, rng.start.col),
            newLines = split(text),
            last = newLines.length - 1;
        
        if (last > 0) {
        
            inserted.end.line += last;
            inserted.end.col = newLines[last].length;
            
            newLines[0] = pre + newLines[0];
            newLines[last] += post;
            
        } else {
        
            inserted.end.col += newLines[0].length;
            newLines[0] = pre + newLines[0] + post;
        }
        
        if (last === 0 && endLine === startLine) {
        
            this.lines[startLine] = newLines[0];
            
        } else {
        
            newLines.splice(0, 0, startLine, endLine - startLine + 1);
            arraySplice.apply(this.lines, newLines);
        }
        
        this.dispatchEvent({
            type: "change",
            removed: rng,
            removedText: removedText,
            inserted: inserted,
            insertedText: text
        });
    },
    
    // Returns the nearest valid point in the text buffer
    validatePoint: function(p) {
    
        var max = this.lines.length - 2, ln;
        
        p = { 
            line: Math.max(0, p.line), 
            col: Math.max(0, p.col)
        };
        
        if (p.line > max) {
        
            p.line = max;
            p.col = this.lines[max].length;
        
        } else {
        
            ln = this.lines[p.line];
            p.col = Math.min(p.col, ln.length);
        }
        
        return p;
    },
    
    // Validates a range for a text buffer
    validateRange: function(rng) {
    
        var s = this.validatePoint(rng.start),
            e = this.validatePoint(rng.end),
            r = new TextRange(s.line, s.col, e.line, e.col);
        
        r.normalize();
        return r;
    },
    
    // Gets the text within the specified range as an array
    _toArray: function(rng) {
    
        rng = this.validateRange(rng || new TextRange(0, 0, TextRange.MAX_LINE, TextRange.MAX_COL));
        
        var start = rng.start,
            end = rng.end,
            out = [],
            i;
        
        if (start.line === end.line) {
        
            out.push(this.lines[start.line].substring(start.col, end.col));
        
        } else {
        
            i = start.line;
            
            out.push(this.lines[i].substring(start.col));
            while (++i < end.line) out.push(this.lines[i]);
            out.push(this.lines[i].substring(0, end.col));
        }
        
        return out;
    }
}});

exports.TextBuffer = TextBuffer;
};

__modules[12] = function(exports) {
"use strict";

var CAPTURING = 1,
	AT_TARGET = 2,
	BUBBLING = 3;

function add(type, handler, capture) {

	if (!isHandler(handler))
		throw new Error("Listener is not a function or EventListener object.");
	
	var a = list(this, type, capture), i = a.indexOf(handler);
	if (i === -1) a.push(handler);
}

function remove(type, handler, capture) {

	var a = list(this, type, capture), i = a.indexOf(handler);
	if (i !== -1) a.splice(i, 1);
}

function list(obj, type, capture) {

	var e = obj.eventListeners[type];
	if (!e) e = obj.eventListeners[type] = { capture: [], bubble: [] };
	
	return e[capture ? "capture" : "bubble"];
}

function isHandler(h) {

	return typeof h === "function" || h && typeof h.handleEvent === "function";
}

function fire(obj, type, evt, capture) {

	var a = list(obj, type, capture).slice(0), i, h;
	
	// Add property handler if defined
	if (typeof obj["on" + type] === "function")
		a.unshift(obj["on" + type]);
	
	for (i = 0; i < a.length; ++i) {
	
		h = a[i];
		
		if (h.handleEvent) h.handleEvent(evt);
		else h.call(obj, evt);
	}
}

function dispatch(evt) {

	var cancel = false,
		stop = false,
		action = evt.defaultAction,
		bubble = (typeof evt.bubbles === "boolean" ? evt.bubbles : true),
		path = [],
		i;
	
	evt.target = this;
	evt.timeStamp = Date.now();
	evt.preventDefault = (function() { "use strict"; cancel = true; });
	evt.stopPropagation = (function() { "use strict"; stop = true; });
	
	// Build event bubble path
	for (i = this.parentEventTarget; i; i = i.parentEventTarget)
		path.push(i);
	
	// Capture phase
	for (evt.eventPhase = CAPTURING, i = path.length; i-- && !stop;)
		fire(evt.currentTarget = path[i], evt.type, evt, true);
	
	if (!stop) {
	
		// At target phase
		evt.eventPhase = AT_TARGET;
		fire(evt.currentTarget = this, evt.type, evt, false);
		if (!bubble) stop = true;
	}
	
	// Bubble phase
	for (evt.eventPhase = BUBBLING, i = 0; i < path.length && !stop; ++i)
		fire(evt.currentTarget = path[i], evt.type, evt, false);
	
	// Call default action
	if (!(cancel && evt.cancelable) && typeof action === "function")
		action.call(evt.currentTarget = this, evt);
	
	// Return defaultPrevented
	return cancel;
}

var EventTarget = es6now.Class(null, function(__super) { return {

	constructor: function(parent) {
	
		this.eventListeners = {};
		this.parentEventTarget = parent || null;
	},
	
	// EventTarget interface
	addEventListener: function(type, handler, capture) { 
	
	    return add.call(this, type, handler, capture); 
	},
	
	removeEventListener: function(type, handler, capture) { 
	
	    return remove.call(this, type, handler, capture);
	},
	
	dispatchEvent: function(evt) {
	
	    return dispatch.call(this, evt);
	},
	
	// Aliases
	on: function(type, handler, capture) {
	
	    return add.call(this, type, handler, capture);
	}
}});

exports.EventTarget = EventTarget;
};

__modules[13] = function(exports) {
"use strict";

var mixin = __require(4).mixin;
var TextRange = __require(3).TextRange;
var EventTarget = __require(12).EventTarget;
var EventSubscriber = __require(10).EventSubscriber;
var setKeys = __require(5).setKeys;

function copyEvent(evt, range) {

    var e = copyKeys(evt);
    if (range) setKeys(e, { range: range });
    return e;
}

var TextView = es6now.Class(EventTarget, function(__super) { return {
    
    constructor: function(filter) {
    
        __super.call(this);
        
        EventSubscriber.call(this);
        
        this.filter = filter;
        this.subscribe(filter, "change", "_onFilterChange");
    },
    
    dispose: function() {

        this.unsubscribe();
        this.filter.dispose();
    },
    
    // Returns the underlying text buffer
    getBuffer: function() {
    
        return this.filter.getBuffer();
    },
    
    // Returns the number of text lines in the view
    getLineCount: function() {
    
        var cnt = this.filter.getLineCount(),
            p = this.unmapPoint({ line: cnt, col: 0 });
            
        return p.line;
    },
    
    // Returns the string at specified line number
    lineAt: function(i) {
    
        var text = (this.getLines(i)[0] || "");
        
        if (i < this.getLineCount() - 1)
            text += "\n";
        
        return text;
    },
    
    // Gets the character at the specified position
    charAt: function(line, col) {
    
        return this.lineAt(line).charAt(col);
    },
    
    // Gets the text within the specified range
    toString: function(rng) {
    
        return this.filter.toString(this.mapRange(rng));
    },
    
    // Inserts a string into the text
    insert: function(str, line, col) {
    
        var p = this.mapPoint({ line: line, col: col });
        this.filter.insert(str, p.line, p.col);
    },
    
    // Removes the text within the specified range
    remove: function(rng) {
    
        var start = this.mapPoint(rng.start),
            end = this.mapPoint(rng.end),
            range = new TextRange(start.line, start.col, end.line, end.col);
        
        this.filter.remove(range);
    },
    
    // Maps a point into the underlying filter space
    mapPoint: function(p, recursive) {
    
        return recursive ? 
            this.filter.mapPoint(p, true) : 
            { line: p.line, col: p.col };
    },
    
    // Unmaps a point from the underlying filter space
    unmapPoint: function(p, recursive) {
    
        return recursive ? 
            this.filter.unmapPoint(p, true) : 
            { line: p.line, col: p.col };
    },
    
    // Maps a range into the underlying filter space
    mapRange: function(rng, recursive) {
    
        var s = this.mapPoint(rng.start, recursive),
            e = this.mapPoint(rng.end, recursive);
        
        return new TextRange(s.line, s.col, e.line, e.col);
    },
    
    // Unmaps a range from the underlying filter space
    unmapRange: function(rng, recursive) {
    
        var s = this.unmapPoint(rng.start, recursive),
            e = this.unmapPoint(rng.end, recursive);
        
        return new TextRange(s.line, s.col, e.line, e.col);
    },
    
    // Gets an array of lines
    getLines: function(from, to) {
    
        if (to === undefined)
            to = from;
        
        var rng = this.mapRange(new TextRange(from, 0, to, 0));
        return this.filter.getLines(rng.start.line, rng.end.line);
    },
    
    // Returns the nearest valid point in the text buffer
    validatePoint: function(p) {
    
        p = this.mapPoint(p);
        p = this.filter.validatePoint(p);
        p = this.unmapPoint(p);
        
        return p;
    },
    
    // Validates a range for a text buffer
    validateRange: function(rng) {
    
        var s = this.validatePoint(rng.start),
            e = this.validatePoint(rng.end),
            r = new TextRange(s.line, s.col, e.line, e.col);
        
        r.normalize();
        return r;
    },
    
    // Moves the point by the specified number of characters
    movePoint: function(point, offset) {
    
        point = { line: point.line, col: point.col };
        
        if (offset === 0)
            return point;
        
        var q = this.mapPoint(point, true);
        
        if (typeof offset === "function") {
        
            var fn = offset, c;
            
            while (true) {
            
                c = this.charAt(point.line, point.col) || " ";
                offset = fn(c);
                
                if (!offset || move.call(this) !== 0) 
                    break;
            }
        
        } else {
        
            move.call(this);
        }
        
        return point;
        
        // Moves the point [offset] spaces
        function move() {
        
            var fn = (offset > 0 ? next : prev), 
                i = (offset > 0 ? -1 : 1);
            
            while (offset !== 0 || !moved.call(this)) {
            
                if (!fn.call(this))
                    break;
                
                if (offset !== 0) 
                    offset += i;
            }
            
            return offset;
        }
        
        // Moves the point backward
        function prev() {
        
            var line = point.line, 
                col = point.col - 1,
                valid = true;
            
            if (col < 0) {
            
                if (line === 0) {
                
                    col = 0;
                    valid = false;
                
                } else {
                
                    line -= 1;
                    col = this.lineAt(line).length - 1;
                }
            }
            
            point.line = line;
            point.col = col;
            
            return valid;
        }
        
        // Moves the point forward
        function next() {
        
            var line = point.line, 
                col = point.col + 1,
                len = this.lineAt(line).length - 1,
                valid = true;
        
            if (col > len) {
            
                if (line >= this.getLineCount()) {
                
                    col = len;
                    valid = false;
                
                } else {
                
                    col = 0;
                    line += 1;
                }
            }
            
            point.line = line;
            point.col = col;
            
            return valid;
        }
        
        // Returns a value indicating whether the point has actually 
        // been moved relative to the underlying buffer
        function moved() {
        
            var p = this.mapPoint(point, true);
            return p.line !== q.line || p.col !== q.col;
        }
    },
    
    _onFilterChange: function(evt) {
    
        var rem = this.unmapRange(evt.removed),
            e = {};
        
        this._onChange(evt);
        
        setKeys(e, evt);
        e.removed = rem;   
        
        this.dispatchEvent(e);
    },

    _onChange: function(evt) {
    
        // Not implemented
    }
}});

TextView.isInstance = function(obj) {

    return obj && 
        typeof obj === "object" && 
        obj.getBuffer &&
        obj.mapPoint &&
        obj.getLines;
};

mixin(TextView, EventSubscriber);

exports.TextView = TextView;
};

__modules[14] = function(exports) {
"use strict";
/*

Linear in the number of folds in the document.  We should explore ways to make
this logarithmic.

*/

var TextRange = __require(3).TextRange;
var TextView = __require(13).TextView;
var _M0 = __require(15), searchArray = _M0.search;

var GLYPH = "...", // "\u2026"
    GLYPH_LEN = GLYPH.length;

var FoldView = es6now.Class(TextView, function(__super) { return {
    
    constructor: function(filter) {
    
        __super.call(this, filter);
        this.folds = [];
    },
    
    mapPoint: function(p, recursive) {
    
        p = { line: p.line, col: p.col };
        
        var d;
        
        this._iterateFolds(p, (function(f, loc) { "use strict";
        
            if (p.line === f.start.line) {
            
                d = p.col - f.start.col;
                
                // If point is inside of fold glyph, slide to nearest edge
                if (d < f.glyphLength) {
                
                    p.col = f.start.col;
                    
                    // If sliding to left edge, exit
                    if (d < f.glyphLength / 2)
                        return;
                    
                    // Slide to right edge
                    p.col += f.glyphLength;
                }
            }
            
            p.line += f.end.line - f.start.line;
            
            if (p.line === f.end.line)
                p.col += f.end.col - f.start.col - f.glyphLength;
        }));
        
        return recursive ? this.filter.mapPoint(p, true) : p;
    },
    
    unmapPoint: function(p, recursive) {
    
        if (recursive)
            p = this.filter.unmapPoint(p, true);
        
        var line = p.line, col = p.col;
        
        this._iterateFolds(p, (function(f, loc) { "use strict";

            if (loc === "inside") {
            
                // Adjust folded lines
                line -= p.line - f.start.line;
                
                // If point is on same line as start of fold...
                if (p.line === f.start.line) {
                
                    col -= p.col - f.start.col;
                    
                    // Remove folded chars
                    if (p.col > f.start.col + f.glyphLength)
                        col += f.glyphLength;
                
                } else {
                
                    // There are no previous folds on this line
                    col = f.start.col + f.glyphLength;
                }
            
            } else {
            
                // Adjust folded lines
                line -= f.end.line - f.start.line;
            
                // If fold occurs on this line...
                if (p.line === f.end.line) {
                
                    // If fold is single-line...
                    if (f.start.line === f.end.line) {
                    
                        // Remove folded chars and add glyph
                        col = col - (f.end.col - f.start.col) + f.glyphLength;
                
                    } else {
                
                        // Offset from start column
                        col = f.start.col + f.glyphLength + (col - f.end.col);
                    }
                }
            }
        }));
        
        return { line: line, col: col };
    },
    
    getLines: function(from, to) {
    
        if (to === void 0)
            to = from;
        
        var rng = new TextRange(from, 0, to, TextRange.MAX_COL),
            list = [],
            out = [],
            offset,
            lines,
            mark,
            line,
            col,
            fold,
            i;
        
        // Get list of folds that occur on these lines
        this._iterateFolds(rng.end, (function(f) { "use strict";
        
            var d = f.end.line - f.start.line;
            
            if (f.comparePoint(rng.start) !== "before")
                rng.start.line += d;
            
            rng.end.line += d;
            
            if (f.comparePoint(rng.start) !== "after" ||
                (f.end.line === rng.start.line && f.end.col === rng.start.col)) {
                
                list.push(f);
            }
        }));
        
        // Get lines from underlying buffer
        lines = this.filter.getLines(rng.start.line, rng.end.line);
        offset = rng.start.line;
        line = offset;
        mark = 0;
        col = 0;
        
        // Add terminating range to simplify loop
        list.push(new TextRange(rng.end.line, TextRange.MAX_COL));
        
        // Replace each folded range with glyph
        for (i = 0; i < list.length && line - offset < lines.length; ++i) {
        
            fold = list[i];
            
            // Add fold glyph
            if (i > 0 && list[i - 1].glyphLength)
                out[mark] += GLYPH;
            
            // Add lines before range
            if (line < fold.start.line) {
            
                // Add remainder of line for last range
                out[mark] = (out[mark] || "") + lines[line - offset].slice(col);
                
                // Add intermediate lines
                out = out.concat(lines.slice(line + 1 - offset, fold.start.line - offset));
                line = fold.start.line;
                mark = out.length;
                col = 0;
                
                if (line - offset >= lines.length)
                    break;
            }
            
            // Add substring on line before range
            out[mark] = (out[mark] || "") + lines[line - offset].slice(col, fold.start.col);
            
            // Skip over range lines
            line = fold.end.line;
            col = fold.end.col;
        }
        
        return out;
    },
    
    collapse: function(range) {
    
        range = this.filter.validateRange(this.mapRange(range));
        
        var m = this._searchFolds(range),
            removedText,
            removed,
            inserted,
            fold;
        
        // Exit if fold already exists
        if (m.value)
            return;
        
        fold = TextRange.copy(range);
        fold.glyphLength = GLYPH_LEN;
        
        removed = this.unmapRange(range);
        removedText = this.filter.toString(range);
        
        this.folds.splice(m.index, 0, fold);
        
        inserted = this.unmapRange(new TextRange(range.start.line, range.start.col));
        inserted.end.col += GLYPH_LEN;
        
        this.dispatchEvent({
        
            type: "change",
            removed: removed,
            removedText: removedText,
            inserted: inserted,
            insertedText: GLYPH,
            virtual: true
        });
    },
    
    expand: function(startLine, startCol) {
    
        var rng = new TextRange(startLine, startCol, startLine, startCol + GLYPH_LEN),
            m = this._searchFolds(this.mapRange(rng)),
            fold = m.value,
            inserted,
            insertedText,
            removed;
        
        if (!fold)
            return null;
        
        removed = this.unmapRange(new TextRange(fold.start.line, fold.start.col));
        removed.end.col += GLYPH_LEN;
        
        this.folds.splice(m.index, 1);
        
        inserted = this.unmapRange(fold);
        insertedText = this.filter.toString(fold);
        
        this.dispatchEvent({
        
            type: "change",
            removed: removed,
            removedText: GLYPH,
            inserted: inserted,
            insertedText: insertedText,
            virtual: true
        });
        
        return inserted;
    },
    
    isFold: function(line, col) {
    
        var rng = new TextRange(line, col, line, col + GLYPH_LEN),
            m = this._searchFolds(this.mapRange(rng));
        
        return !!m.value;
    },
    
    _onInsert: function(evt) {
    
        for (var i = 0; i < this.folds.length; ++i)
            this.folds[i].adjust(null, evt.range);
    },
    
    _onRemove: function(evt) {
    
        for (var i = 0; i < this.folds.length; ++i)
            this.folds[i].adjust(evt.range, null);
    },
    
    _onChange: function(evt) {
    
        for (var i = 0; i < this.folds.length; ++i)
            this.folds[i].adjust(evt.removed, evt.inserted);
    },
    
    _fire: function(type, range, text) {
    
        this.dispatchEvent({
        
            type: type,
            range: range,
            text: text,
            virtual: true
        });
    },
    
    _searchFolds: function(range) {
    
        return searchArray(this.folds, (function(val) { "use strict";
        
            return (range.start.line - val.start.line) || (range.start.col - val.start.col) ||
                (val.end.line - range.end.line) || (val.end.col - range.end.col);
        }));
    },
    
    _iterateFolds: function(p, fn) {
    
        var folds = this.folds,
            end = null,
            f,
            c,
            i;
        
        for (i = 0; i < folds.length; ++i) {
        
            f = folds[i];
            
            // If fold is now empty (because of buffer mutations), remove it
            if (f.isEmpty()) {
            
                folds.splice(i, 1);
                i -= 1;
                continue;
            }
            
            // Skip nested folds
            if (end && f.comparePoint(end) !== "before")
                continue;
            
            c = f.comparePoint(p);
            
            // Exit if there are no more preceeding folds
            if (c === "before")
                break;
            
            fn.call(this, f, c);
            
            // Recompare point (callback may mutate point)
            c = f.comparePoint(p);
            
            // Exit if there will be no more preceeding folds
            if (c !== "after")
                break;
            
            end = { line: f.end.line, col: f.end.col - 1 };
        }
    }
}});

FoldView.FOLD_GLYPH = GLYPH;

exports.FoldView = FoldView;
};

__modules[15] = function(exports) {
"use strict";

// Perform a binary search of the sorted list
function search(list, compare) {

    list = list || [];
    
    var from = 0,
        to = list.length - 1,
        value = null,
        test,
        i,
        c;
    
    if (typeof compare !== "function") {
    
        test = compare;
        compare = function(val) { return test - val; };
    }
    
    while (to - from >= 0) {
    
        i = from + Math.ceil((to - from) / 2);
        c = compare(list[i]);
        
        if (c === 0) {
        
            // The list may contain matches before this position.
            // Scan backward to find the correct item.
            while (i > 0) {
                
                c = compare(list[i - 1]);
                
                if (c === 0) i = i - 1;
                else break;
            }
            
            from = to = i;
            value = list[i];
            
            break;
        }
        
        if (c > 0) from = i + 1;
        else to = i - 1;
    }
    
    i = Math.max(from, to);
    
    return {
        value: value,
        index: i,
        array: list
    };
}

exports.search = search;
};

__modules[16] = function(exports) {
"use strict";

var mixin = __require(4).mixin;
var EventTarget = __require(12).EventTarget;
var EventSubscriber = __require(10).EventSubscriber;
var TextRange = __require(3).TextRange;
var setKeys = __require(5).setKeys;

var Selection = es6now.Class(TextRange, function(__super) { return {

    constructor: function(textView) {
    
        __super.call(this);
        
        EventTarget.call(this);
        EventSubscriber.call(this);
        
        this.textView = textView;
        this.subscribe(textView, "change", "_onTextChange");
    },
    
    dispose: function() {
    
        this.unsubscribe();
    },
    
    // Collapses the selection to an insert point
    collapse: function(to) {
    
        if (!this.isEmpty()) {
        
            var prev = this.getRange();
            
            if (to === "start") {
            
                this.end.line = this.start.line;
                this.end.col = this.start.col;
            
            } else {
            
                this.start.line = this.end.line;
                this.start.col = this.end.col;
            }
            
            this.dispatchEvent({ type: "change", previousRange: prev });
        }
    },
    
    // Sets the selection range
    setRange: function(startLine, startCol, endLine, endCol) {
    
        var s, e;
        
        if (startLine.start) { // setRange(TextRange)
        
            endLine = startLine.end.line;
            endCol = startLine.end.col;
            startCol = startLine.start.col;
            startLine = startLine.start.line;
        
        } else if (endLine === void 0) { // setRange(line, col)
        
            endLine = startLine;
            endCol = startCol;
        }
        
        s = this.textView.validatePoint({ line: startLine, col: startCol }),
        e = this.textView.validatePoint({ line: endLine, col: endCol });
        
        if (this.start.line !== s.line || this.start.col !== s.col ||
            this.end.line !== e.line || this.end.col !== e.col) {
            
            var prev = this.getRange();
            this.start.line = s.line;
            this.start.col = s.col;
            this.end.line = e.line;
            this.end.col = e.col;
            
            this.dispatchEvent({ type: "change", previousRange: prev });
        }
    },
    
    // Sets the starting point of the selection
    setStart: function(line, col) {
    
        return this.setRange(line, col, this.end.line, this.end.col);
    },
    
    // Sets the ending point of the selection
    setEnd: function(line, col) {
    
        return this.setRange(this.start.line, this.start.col, line, col);
    },
    
    // Returns a TextRange corresponding to the selection
    getRange: function(normalize) {
    
        var r = TextRange.copy(this);
        if (normalize) r.normalize();
        return r;
    },
    
    // Returns the selection as a string
    toString: function() {
    
        return this.textView.toString(this);
    },
    
    // Adjusts the selection in response to a change in the text view
    _onTextChange: function(evt) {
    
        var prev = this.getRange();
        
        if (this.adjust(evt.removed, evt.inserted))
            this.dispatchEvent({ type: "change", previousRange: prev });
    }
}});

mixin(Selection, EventTarget);
mixin(Selection, EventSubscriber);


exports.Selection = Selection;
};

__modules[17] = function(exports) {
var __this = this; "use strict";

var TextRange = __require(3).TextRange;
var EventTarget = __require(12).EventTarget;
var EventSubscriber = __require(10).EventSubscriber;
var FontMetrics = __require(18).FontMetrics;

var Util = __require(19);
var HtmlBrush = __require(21);

var arraySplice = Array.prototype.splice;

var MIN_LINE_WIDTH = 400,
    MAX_CHAR_WIDTH = 2,
    HSCROLL_CHARS = 8;

var RichText = es6now.Class(EventTarget, function(__super) { return {

    constructor: function(element, tabSize) {
    
        __super.call(this);
        
        EventSubscriber.call(this);

        this.element = element;
        this.element.innerHTML = "<div class='content'></div>";
        this.content = this.element.firstChild;
        this.fontMetrics = new FontMetrics(element);
        this.tabSize = tabSize;
        
        this.scrollTop = 0;
        this.scrollLeft = 0;
        
        this.clear();
        this._refreshMetrics();
    },
    
    dispose: function() {
    
        this.fontMetrics.dispose();
    },
    
    clear: function() {
    
        this.divs = [ Util.buildHTML([ { text: "" }], this.tabSize) ];
        this.lineOffset = 0;
        this.childCount = 1;
        this.content = HtmlBrush.paint(this.content, this.divs.join(""));
        this.dirty = false;
        this.dirtyLine = -1;
    },
    
    scroll: function(x, y) {
    
        if (x !== null) {
        
            x -= (x % this.scrollQuantum);
            
            if (x !== this.scrollLeft) {
        
                this.scrollLeft = x;
                this.content.style.left = "-" + x + "px";
            }
        }
        
        if (y !== null) {
        
            y -= (y % this.lineHeight);
            
            if (y !== this.scrollTop) {
            
                this.scrollTop = y;
                this.update(true);
            }
        }
    },
    
    refresh: function() {
    
        this._refreshMetrics();
        this.update(true);
    },
    
    update: function(all) {

        if (!all && this.dirtyLine >= 0 && this.isLineRendered(this.dirtyLine)) {
        
            this._updateLine(this.dirtyLine);
        
        } else {
        
            var vis = this.getVisibleLines();
        
            this._renderLines(vis.firstLine, vis.lastLine);
            this.content.style.top = vis.offsetTop + "px";
        }
        
        this.dirty = false;
        this.dirtyLine = -1;
    },
    
    measureText: function(text) {
    
        return this.fontMetrics.measureText(text);
    },

    getRect: function() {
    
        return this.element.getBoundingClientRect();
    },
    
    getRenderedWidth: function() {
    
        return this.content.offsetWidth;
    },
    
    getRenderedLines: function() {
    
        var first = this.lineOffset;
        return this._getLineInfo(first, first + this.childCount - 1);
    },
    
    isLineRendered: function(y) {
    
        y -= this.lineOffset;
        return y >= 0 && y < this.childCount;
    },
    
    getVisibleLines: function() {
    
        var maxLine = this.divs.length - 1,
            top = this.scrollTop,
            bottom = top + this.height,
            lineHeight = this.lineHeight,
            first = Math.min(Math.floor(top / lineHeight), maxLine + 1),
            last = Math.min(Math.ceil(bottom / lineHeight), maxLine);
        
        return this._getLineInfo(first, last);
    },
    
    getRangeFromPoint: function(x, y) {
    
        this._checkDirty();
        
        return Util.getRangeFromPoint(
            x, 
            y, 
            this.content, 
            this.lineOffset, 
            this.lineHeight);
    },
    
    getColumnFromPoint: function(x, line) {
    
        this._checkDirty();
        
        if (!this.isLineRendered(line))
            return -1;
        
        var rect = this.getRect();
        
        var range = Util.getRangeFromPoint(
            x,
            line * this.lineHeight - this.scrollTop + rect.top,
            this.content,
            this.lineOffset,
            this.lineHeight);
        
        return range ? range.start.col : -1;
    },
    
    getLineFromPoint: function(y) {
    
        var rect = this.getRect();
        return Math.floor((y - rect.top + this.scrollTop) / this.lineHeight);
    },
    
    getRangeRects: function(range) {
    
        this._checkDirty();
        
        var list;
        
        if (range.start.line === range.end.line) {
        
            list = Util.getRangeRects(range, this.content, this.lineOffset);
            return this._normalizeRects(list);
        }
        
        range = TextRange.copy(range);
        range.normalize();
        
        var start = range.start.line,
            end = range.end.line,
            startCol = range.start.col,
            endCol = range.end.col,
            last = this.lineOffset + this.childCount - 1,
            upper,
            lower,
            rng,
            pad,
            rm;
        
        if (start < this.lineOffset) {
        
            start = this.lineOffset;
            startCol = 0;
        }
        
        if (end > last) {
        
            end = last;
            endCol = TextRange.MAX_COL;
        }
        
        if (end < start)
            return [];
        
        // Get rects from first line
        rng = new TextRange(start, startCol, start, TextRange.MAX_COL);
        upper = this.getRangeRects(rng);
        
        // Get rects from end line
        rng = new TextRange(end, 0, end, endCol);
        lower = this.getRangeRects(rng);
        
        // Add right continuing rect
        if (end > start) {
        
            rng = new TextRange(start, 0, start, TextRange.MAX_COL);
            rm = rightmost(this.getRangeRects(rng));
            
            if (rm < this.lineRight) {
            
                upper.push({
                
                    left: rm,
                    right: this.lineRight,
                    top: upper[0].top,
                    bottom: upper[0].bottom,
                    width: this.lineRight - rm,
                    height: upper[0].height
                });
            }
        }
        
        // Add middle rect
        if (end > start + 1) {
            
            pad = Math.max(0, this.lineLeft - this.scrollLeft);
            
            upper.push({ 
            
                left: pad, 
                right: this.lineRight, 
                top: upper[0].bottom, 
                bottom: lower[0].top, 
                width: this.lineRight - pad, 
                height: lower[0].top - upper[0].bottom
            });
        }
        
        list = upper.concat(lower);
        
        return list;
        
        function rightmost(rects) {
            
            var r = 0, i;
            
            for (i = 0; i < rects.length; ++i)
                r = Math.max(r, rects[i].right);
            
            return r;
        }
    },
    
    getLineRect: function(line) {
    
        if (!this.isLineRendered(line))
            return null;
        
        var e = this.content.childNodes[line - this.lineOffset];
        
        return {
            top: e.offsetTop,
            left: 0,
            width: this.content.offsetWidth,
            height: e.offsetHeight
        };
    },
    
    spliceLines: function(start, del, ins) {
        
        if (del === 1 && ins === 1) {
            
            this.divs[start] = void 0;
            this.dirtyLine = (!this.dirty || this.dirtyLine === start) ? start : -1;
        
        } else {
        
            var args = new Array(ins + 2);
            args[0] = start;
            args[1] = del;
            
            arraySplice.apply(this.divs, args);
            this.dirtyLine = -1;
        }
        
        if (start < this.lineOffset + this.childCount)
            this.dirty = true;
    },
    
    scrollLineIntoView: function(line) {
    
        if (!this.isLineRendered(line)) {
        
            var top = this.lineHeight * line - this.scrollTop;
            
            // Scroll line into view and re-render
            this.scroll(null, this._getScrollY(top));
        }
    },
    
    scrollIntoView: function(range) { var __this = this; 
    
        this._checkDirty();
        
        // Collapse to end
        range = new TextRange(range.end.line, range.end.col);
        
        var line = range.end.line,
            rect;
        
        // Make sure that line is already in view
        this.scrollLineIntoView(line);
        
        rect = this.getRangeRects(range)[0];
        
        if (!rect && Util.isIE8) {
        
            // [IE8] An empty rect will be returned in some cases when
            // a containing element has just been created.  Attempt
            // to scroll in a future turn as a workaround.
            setTimeout((function() { "use strict";
            
                if (rect = __this.getRangeRects(range)[0])
                    __this.scroll(__this._getScrollX(rect.left), __this._getScrollY(rect.top));
            
            }), 0);
            
            return;
        }
        
        this.scroll(this._getScrollX(rect.left), this._getScrollY(rect.top));
    },
    
    _getLineInfo: function(first, last) {
    
        var scrollTop = this.scrollTop,
            lineHeight = this.lineHeight,
            top = first * lineHeight,
            lines = new Array(last + 1 - first),
            i,
            j;
        
        lines.lineHeight = lineHeight;
        lines.firstLine = first;
        lines.lastLine = last;
        lines.top = top;
        lines.offsetTop = top - scrollTop;
        
        for (i = first, j = 0; i <= last; ++i, ++j) {
        
            lines[j] = {
            
                line: i,
                top: top,
                bottom: top + lineHeight,
                height: lineHeight,
                offsetTop: top - scrollTop
            };
            
            top += lineHeight;
        }
    
        return lines;
    },
    
    _updateLine: function(line) {
    
        var div = this.content.childNodes[line - this.lineOffset];
        
        this._buildHTML(line, line);
        HtmlBrush.paintOuter(div, this.divs[line]);
    },
    
    _renderLines: function(first, last) {
    
        var maxLine = this.divs.length - 1;
        
        // Sanitize input
        first = Math.max(first, 0);
        last = Math.min(last, maxLine);
        
        // Cache state
        this.lineOffset = first;
        this.childCount = last + 1 - first;
        
        // Build HTML for all dirty lines
        this._buildHTML(first, last);
        
        // Write updated HTML
        this.content = HtmlBrush.paint(this.content, this.divs.slice(first, last + 1).join(""));
    },
    
    _buildHTML: function(first, last) {
    
        var divs = this.divs,
            fresh = [],
            evt, 
            i;
        
        for (i = first; i <= last && i < divs.length; ++i) {
        
            if (typeof divs[i] === "string")
                continue;
            
            // Pull token list from listener
            this.dispatchEvent(evt = {
            
                type: "renderline",
                line: i,
                tokens: []
            });
            
            // Generate HTML from token list
            divs[i] = Util.buildHTML(evt.tokens, this.tabSize);
            fresh.push(i);
        }
        
        return fresh;
    },
    
    _refreshMetrics: function() {
    
        var elem = this.element,
            pad;
        
        pad = Util.getComputedStyle(this.content).paddingLeft;
        pad = parseInt(pad, 10);
        
        if (isNaN(pad))
            pad = 0;
        
        this.width = elem.offsetWidth;
        this.height = elem.offsetHeight;
        
        this.lineHeight = this.content.childNodes[0].offsetHeight;
        this.avgCharWidth = this.fontMetrics.measureText("X").width;
        this.maxCharWidth = this.avgCharWidth * MAX_CHAR_WIDTH;
        
        this.lineWidth = Math.max(this.width - pad, MIN_LINE_WIDTH);
        this.lineLeft = pad;
        this.lineRight = this.lineWidth + pad;
        this.pageSize = Math.ceil(this.height / this.lineHeight);
        
        this.scrollQuantum = HSCROLL_CHARS * this.avgCharWidth;
    },
    
    _checkDirty: function() {
    
        if (this.dirty)
            throw new Error("INVALID STATE");
    },
    
    _normalizeRects: function(list) {
    
        var elemRect = this.getRect(),
            lineHeight = this.lineHeight,
            i, 
            r;
        
        for (i = 0; i < list.length; ++i) {
        
            r = list[i];            
            r.height = Math.max(r.height, lineHeight); // WebKit/Mac: rect height may be less than line height
            
            r.left -= elemRect.left;
            r.right = r.left + r.width;
            r.top -= elemRect.top;
            r.bottom = r.top + r.height;
        }
        
        return list;
    },
    
    _getScrollY: function(top) {

        var bottom = top + this.lineHeight + 20,
            scroll = this.scrollTop,
            elemHeight = this.height;
        
        // Scroll vertically
        if (top < 0)
            scroll += top;
        else if (bottom > elemHeight)
            scroll += bottom - elemHeight;
        
        return scroll;
    },
    
    _getScrollX: function(left) {
    
        var right = left + 20,
            scroll = this.scrollLeft,
            elemWidth = this.width;
        
        // Scroll horizontally
        if (left < 0)
            scroll += left - 5;
        else if (right > elemWidth)
            scroll += right - elemWidth + Math.floor(elemWidth / 4);
        
        return scroll;
    }
}});

exports.RichText = RichText;
};

__modules[18] = function(exports) {
"use strict";

var _M0 = __require(19), encode = _M0.encode, getComputedStyle = _M0.getComputedStyle;

var TAB_CHAR = /[\t\v]/g;

function createElement(tag, source) {

    var elem = document.createElement(tag),
        style = elem.style;
        
    style.position = "absolute";
    style.top = "-20000px";
    style.left = "0px";
    style.whiteSpace = "pre";
    style.visibility = "hidden";
    
    return elem;
}

var FontMetrics = es6now.Class(null, function(__super) { return {

    constructor: function(source) {
    
        var ref = getComputedStyle(source),
            canvas = createElement("canvas", source);
        
        if (canvas.getContext) {
        
            this.element = canvas;
            this.context = canvas.getContext("2d");
            this.context.font = ref.fontSize + " " + ref.fontFamily;
        
        } else {
        
            this.element = createElement("div", source);
            this.element.style.fontSize = ref.fontSize;
            this.element.style.fontFamily = ref.fontFamily;
            this.context = null;
        }
        
        source.parentNode.appendChild(this.element);
    },
    
    dispose: function() {
    
        this.element.parentNode.removeChild(this.element);
    },
    
    measureText: function(str) {
    
        if (this.context)
            return this.context.measureText(str.replace(TAB_CHAR, " "));
        
        this.element.innerHTML = encode(str);
        
        return {
            width: this.element.offsetWidth,
            height: this.element.offsetHeight
        };
    }
}});

exports.FontMetrics = FontMetrics;
};

__modules[19] = function(exports) {
"use strict";

var TextRange = __require(3).TextRange;
var IE8 = __require(20);

var isIE8 = IE8.isIE8,
    LINE_CLASS = "line",
    LINE_TERM = "&nbsp;<span class='eol' data-len='1'> </span>",
    SPAN_TERM = isIE8 ? "<i></i>" : "",
    ENCODE = /[<>'\"&\s]/g,
    VTAB_CHAR = "\u000B",
    TAB = /\t/g;

var ENCODE_TO = {

    ">": "&gt;", 
    "<": "&lt;", 
    "'": "&#39;",
    "\"": "&quot;", 
    "&": "&amp;",
    "\t": "\t"
};

// Gets the computed style for an element
function getComputedStyle(e) {

    return isIE8 ? IE8.getComputedStyle(e) : window.getComputedStyle(e, null);
}

// Encodes text as HTML
function encode(input) {

    return input.replace(ENCODE, (function(m) { "use strict"; return ENCODE_TO[m] || "&nbsp;"; }));
}

// Gets the text length of a node
function nodeLength(node) {

    var type = node.nodeType, len;
    
    // Text nodes have length of text
    if (type === 3) {
    
        if (node.parentNode.className === "tab")
            return 1;
        
        return node.nodeValue.length;
    }
    
    len = node.fw_nodeLength;
    
    // All elements should have a data-len attribute
    if (len === void 0)
        len = node.fw_nodeLength = parseInt(node.getAttribute("data-len"), 10);
    
    if (isNaN(len))
        throw new Error("Element does not have a data-len attribute.");
    
    return len;
}

// Creates a DOM range for the specified text range
function getDOMRange(range, elem, lineOffset) {

    var b = getRangeBoundaries(range, elem, lineOffset), rng;
    
    if (!b)
        return null;
    
    rng = isIE8 ? IE8.createRange() : document.createRange();
    
    if (b.inverted) {
    
        rng.setStart(b.end.node, b.end.offset);
        rng.setEnd(b.start.node, b.start.offset);
    
    } else {
    
        rng.setStart(b.start.node, b.start.offset);
        rng.setEnd(b.end.node, b.end.offset);
    }
    
    return rng;
}

// Returns DOM range boundaries for a text range
function getRangeBoundaries(range, elem, lineOffset) {

    var childNodes = elem.childNodes,
        start = clip(range.start),
        end = clip(range.end);
    
    // If both points lie outside rendered area on the same side, return null
    if (start.clipped && end.clipped && start.line === end.line)
        return null;
    
    return {
        start: scanTo(start),
        end: scanTo(end),
        inverted: !range.isNormalized()
    };
    
    function clip(point) {
    
        var line = point.line - lineOffset,
            col = point.col,
            clipped = true;
        
        // Normalize line range
        if (line < 0) {
        
            line = 0;
            col = 0;
        
        } else if (line >= childNodes.length) {
        
            line = childNodes.length - 1;
            col = TextRange.MAX_COL;
        
        } else {
        
            clipped = false;
        }
        
        return { line: line, col: col, clipped: clipped };
    }
    
    function scanTo(point) {
    
        var a = scanNode(childNodes[point.line], point.col);
        return { node: a[0], offset: a[1] };
    }
    
    function scanNode(n, col) {
    
        if (n.nodeType === 3) {
        
            if (n.parentNode.className === "tab")
                return [n, col ? n.nodeValue.length : 0];
            
            return [n, col];
        }
        
        var a = n.childNodes,
            sum = 0,
            prev = 0,
            len,
            i;
        
        if (a.length === 0)
            return [n, 0];
        
        for (i = 0; i < a.length; ++i) {
        
            len = nodeLength(a[i]);
            sum += len;
            
            if (sum >= col)
                return scanNode(a[i], col - prev);
            
            prev = sum;
        }
        
        return [n, i];
    }
}

// Returns a list of rectangles for the specified range
function getRangeRects(range, elem, lineOffset) {

    return getClientRects(getDOMRange(range, elem, lineOffset));
}

// Returns a list of retangles for the specified DOM range
function getClientRects(domRange) {

    var list = (domRange ? domRange.getClientRects() : []),
        a = [],
        out = [],
        prev,
        i;
    
    // In Webkit, when a range's start point and end point occur
    // in different inline elements, getClientRects will return
    // a rectangle for the whole element in which the end point
    // occurs.  These "element" rects always occur in the list
    // before the partial rect that we're interested in, so they
    // can be skipped.  If there is also RTL text inside of the
    // element, there may be more than one rect per element.
    // Elements that have borders or padding must also be
    // taken into consideration.
    
    for (i = 0; i < list.length; ++i) {
    
        while (prev && prev.left >= list[i].left - 1) {
        
            a.pop();
            prev = a[a.length - 1];
        }
        
        a.push(prev = copy(list[i]));
    }
    
    // Attempt to reduce the number of returned rectangles by
    // joining with the previous rectangle
        
    for (i = 0, prev = null; i < a.length; ++i) {
    
        if (adjacent(prev, a[i])) {
        
            prev.right = a[i].right;
            prev.width = prev.right - prev.left;
        
        } else {
        
            out.push(prev = a[i]);
        }
    }
    
    return out;
    
    function copy(r) {
    
        return {
            left: r.left,
            right: r.right,
            bottom: r.bottom,
            top: r.top,
            width: r.width,
            height: r.height
        };
    }
    
    function adjacent(a, b) {
    
        return a && b && 
            a.top === b.top && 
            a.bottom === b.bottom && 
            a.right === b.left;
    }
}

// Returns true if the point lies within the rectangle
function inRect(rect, x, y) {

    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

// Returns true if the horizontal point lies within the rectangle
function inRectX(rect, x) {

    return x >= rect.left && x <= rect.right;
}

// Returns a TextRange that contains the specified point in viewport coordinates
function getRangeFromPoint(x, y, elem, lineOffset, lineHeight) {

    var rect = elem.getBoundingClientRect(),
        nodes = elem.childNodes,
        child = Math.floor((y - rect.top) / lineHeight);
    
    // Point must be in a rendered line
    if (child < 0 || child >= nodes.length)
        return null;
    
    var from = 0,
        to = Math.max(nodeLength(nodes[child]), from + 1),
        line = child + lineOffset,
        container,
        textRange,
        domRange,
        nextRange,
        nextRect,
        rects,
        mid;
    
    rect = nodes[child].getBoundingClientRect();
    
    // If point does not lie in line, return beginning or ending of line
    if (!inRect(rect, x, y))
        return new TextRange(line, (x < rect.left) ? from : to);
    
    // Binary search
    while (to - from > 1) {
    
        mid = from + Math.ceil((to - from) / 2);
        rects = getRangeRects(new TextRange(line, from, line, mid), elem, lineOffset);
        
        if (inRectList(rects)) to = mid;
        else from = mid;
    }
    
    textRange = new TextRange(line, from, line, to);    
    domRange = getDOMRange(textRange, elem, lineOffset);
    container = domRange.commonAncestorContainer;
    
    if (container.nodeType === 3)
        container = container.parentNode;
    
    // Set the containing element for the range
    textRange.container = container;
    
    // Get bounding rectangle for resulting range
    rect = getClientRects(domRange)[0];
    
    // Get bounding rectangle for following character (we need this information
    // in order to determine whether we are dealing with an RTL character)
    nextRange = getDOMRange(new TextRange(line, to, line, to + 1), elem, lineOffset);
    nextRect = getClientRects(nextRange)[0] || rect; // nextRange.getBoundingClientRect() || rect;
    
    // Get midpoint of rectangle
    mid = rect.left + ((rect.right - rect.left) / 2);
    
    // Collapse to nearest edge
    if (nextRect.left >= rect.left && x >= mid ||
        nextRect.left < rect.left && x <= mid) {
        
        textRange.start.col = textRange.end.col;
    
    } else {
    
        textRange.end.col = textRange.start.col;
    }
    
    return textRange;

    function inRectList(list) {
    
        for (var i = 0; i < list.length; ++i)
            if (inRectX(list[i], x))
                return true;
        
        return false;
    }
}

// Builds an HTML fragment for a sequence of <text, type> pairs
function buildHTML(tokens, tabSize) {

    var lineLen = 0, 
        tabAdj = 0,
        str = "",
        len,
        sub,
        tok,
        i;
    
    for (i = 0; i < tokens.length; ++i) {
    
        tok = tokens[i];
        
        if (!tok.text)
            continue;
        
        sub = encode(tok.text).replace(TAB, tabReplacer);
        len = tok.text.length;
        lineLen += len;
        
        if (tok.type)
            sub = "<span class=\"" + (tok.type) + "\" data-len=\"" + (len) + "\">" + (sub) + "" + (SPAN_TERM) + "</span>";
        
        str += sub;
    }
    
    return "<div data-len=\"" + (lineLen) + "\" class=\"" + (LINE_CLASS) + "\">" + (str) + "" + (LINE_TERM) + "</div>";
    
    function tabReplacer(m, col) {
    
        var pos = lineLen + col + tabAdj,
            len = tabSize - (pos % tabSize);
        
        tabAdj += len - 1;
        
        return "<span class=\"tab\" data-len=\"1\">" + ("&nbsp;".repeat(len)) + "</span>";
    }
}



exports.isIE8 = isIE8;
exports.encode = encode;
exports.buildHTML = buildHTML;
exports.getRangeFromPoint = getRangeFromPoint;
exports.getRangeRects = getRangeRects;
exports.getComputedStyle = getComputedStyle;
};

__modules[20] = function(exports) {
"use strict";

function wrapRange(range) {

    return {
    
        setStart: function(node, offset) {
        
            range.setEndPoint("StartToStart", create(node, offset));
        },
        
        setEnd: function(node, offset) {
        
            range.setEndPoint("EndToStart", create(node, offset));
        },
        
        getBoundingClientRect: function() {
        
            return fixRect(range.getBoundingClientRect());
        },
        
        getClientRects: function() {
        
            var list = range.getClientRects(), 
                out = [], 
                i;
            
            for (i = 0; i < list.length; ++i)
                out.push(fixRect(list[i]));
            
            return out;
        },
        
        commonAncestorContainer: range.parentElement,
        
        ieRange: range
        
    };
}

function create(node, offset) {

    var r = document.body.createTextRange(), 
        child,
        pos;
    
    if (node) {
    
        if (node.nodeType === 3) {
        
            pos = locate(node);
            pos.offset += offset;
        
        } else if (node.nodeType === 1) {
        
            child = node.childNodes[offset];
            
            if (child) {
            
                pos = locate(child);
            
            } else {
            
                pos = locate(node);
                pos.offset += nodeLength(node);
            }
        }
        
        r.moveToElementText(pos.node);
        r.moveStart("character", pos.offset);
        r.collapse();
    }
    
    return r;
}

function locate(node) {

    if (node.nodeType === 1)
        return { node: node, offset: 0 };
    
    var prev = node.previousSibling, loc;
    
    if (prev) {
    
        loc = locate(prev);
        loc.offset += nodeLength(prev);
    
    } else {
    
        loc = { node: node.parentNode, offset: 0 };
    }
    
    return loc;
}

function nodeLength(node) {

    var val = node.nodeValue;
    return typeof val === "string" ? val.length : (node.innerText || "").length;
}

function fixRect(r) {

    return {
        top: r.top,
        left: r.left,
        bottom: r.bottom,
        right: r.right,
        width: r.right - r.left,
        height: r.bottom - r.top
    };
}

function getComputedStyle(e) {

    return e.currentStyle;
}

function createRange() { 

    return wrapRange(create());
}

var isIE8 = !document.createRange;

exports.getComputedStyle = getComputedStyle;
exports.createRange = createRange;
exports.isIE8 = isIE8;
};

__modules[21] = function(exports) {
"use strict";

function paint(elem, html) {

    var clone = elem.cloneNode(false);
    clone.innerHTML = html;
    
    elem.parentNode.replaceChild(clone, elem);
    return clone;
}

function paintOuter(elem, outerHTML) {

    var div = document.createElement("div"), e;
    div.innerHTML = outerHTML;
    e = div.firstChild;
    
    elem.parentNode.replaceChild(e, elem);
    return e;
}

function paintRects(elem, list, type) {

    var html = "",
        style,
        rect,
        i;
        
    type = type || "";
    
    for (i = 0; i < list.length; ++i) {
    
        rect = list[i];
        if (!rect || rect.width === 0) continue;
        
        style = "position:absolute;" +
            "top:" + rect.top + "px;" +
            "left:" + rect.left + "px;" +
            "height:" + rect.height + "px;" +
            "width:" + rect.width + "px";
        
        html += "<div class='" + type + "' style='" + style + "'></div>";
    }
    
    return paint(elem, html);
}

exports.paint = paint;
exports.paintOuter = paintOuter;
exports.paintRects = paintRects;
};

__modules[22] = function(exports) {
var __this = this; var EventSubscriber = __require(10).EventSubscriber;
var KeyReader = __require(23).KeyReader;

var CLICK_DELAY = 250,
    DRAG_SCROLL_DELAY = 50,
    DRAG_SCROLL_AMOUNT = 30;
    
var Controller = es6now.Class(EventSubscriber, function(__super) { return {

    constructor: function(editor) {
    
        __super.call(this);
        
        var layers = editor.layers,
            element = editor.element,
            document = element.ownerDocument;
        
        this.editor = editor;
        this.actions = editor.actions;
        
        // Mouse tracking
        this.mouseDown = false;
        this.clicks = 0;
        this.clickTimer = 0;
        this.dragMode = "";
        this.dragRange = null;
        this.mousePos = null;
        this.scrollTimer = 0;
        
        // Attach a KeyReader
        this.keyReader = new KeyReader(editor.options.get("keyMap"));     
        this.subscribe(this.keyReader, "command", "_onCommand");
        this.subscribe(this.keyReader, "char", "_onChar");
        this.subscribe(this.keyReader, "afterclipboardaction", "_afterClipboardAction");
        this.subscribe(this.keyReader, "paste", "_onPaste");
        this.subscribe(this.keyReader, "cut", "_onCut");
        this.subscribe(this.keyReader, "copy", "_onCopy");
        this.subscribe(this.keyReader, "blur", "_onBlur");
        this.subscribe(this.keyReader, "focus", "_onFocus");
        
        // Mouse listeners
        this.subscribe(layers.surface, "mousedown", "_onMouseDown");
        this.subscribe(document, "mousemove", "_onMouseMove");
        this.subscribe(document, "mouseup", "_onMouseUp");
        this.subscribe(layers.gutter, "mousedown", "_onGutterMouseDown");
        
        // IE will direct the events past transparent layers into text layer
        this.subscribe(layers.text, "mousedown", "_onMouseDown");
        this.subscribe(layers.text, "mousemove", "_onMouseMove");
        
        // [IE8] Cancelling the mousedown event does not prevent user selection
        element.onselectstart = (function() { "use strict"; return false; });
        
        // Scroll listeners
        this.subscribe(layers.frame, "scroll", "_onScroll");
    },
    
    dispose: function() {
    
        this.unsubscribe();
        this.keyReader.dispose();
    },
    
    reset: function() {
    
        this.actions = this.editor.actions;
        this.keyReader.setKeyMap(this.editor.options.get("keyMap"));
    },
    
    focus: function() {
    
        this.keyReader.focus();
    },
    
    _onCommand: function(evt) {
    
        var cmd = evt.command,
            editor = this.editor;
        
        if (typeof cmd === "function") {
        
            cmd.call(this.actions);
            
            editor.flushQueue();
            
        } else if (this.actions.isDefined(cmd)) {
        
            this.actions[cmd]();
            
            if (cmd !== "selectAll")
                editor.enqueue("scroll-into-view");
            
            editor.flushQueue();
        }
    },
    
    _onChar: function(evt) {
    
        var editor = this.editor;
        
        this.actions.insert(evt.charString);
        
        editor.enqueue("scroll-into-view");
        editor.flushQueue();
    },
    
    _afterClipboardAction: function(evt) {
    
        if (evt.action === "paste")
            this.editor.enqueue("scroll-into-view");
        
        this.editor.flushQueue();
    },
    
    _onPaste: function(evt) {
    
        this.actions.insert(evt.textData);
    },
    
    _onCut: function(evt) {
    
        evt.textData = this.editor.selection.toString();
        this.actions.remove();
    },
    
    _onCopy: function(evt) {
    
        evt.textData = this.editor.selection.toString();
    },
    
    _onFocus: function() {
    
        this.editor.caret.activate();
    },
    
    _onBlur: function() {
    
        this.editor.caret.deactivate();
    },
    
    _onMouseUp: function() {
    
        if (!this.mouseDown)
            return;
        
        this.mouseDown = false;
        this.mousePos = null;
        this.dragMode = "";
        this.dragRange = null;
        
        if (this.scrollTimer) {
        
            clearTimeout(this.scrollTimer);
            this.scrollTimer = 0;
        }
        
        this.editor.focus();
    },
    
    _onMouseDown: function(evt) { var __this = this; 
    
        evt.preventDefault();
        
        this.mouseDown = true;
        this.mousePos = { x: evt.clientX, y: evt.clientY };
        
        if (this.clickTimer) {
        
            clearTimeout(this.clickTimer);
            this.clickTimer = 0;
        }
        
        var editor = this.editor,
            actions = this.actions,
            rng = editor.getRangeFromPoint(evt.clientX, evt.clientY),
            line = rng.end.line,
            col = rng.end.col;
        
        switch (++this.clicks) {
        
            case 1:
                if (evt.shiftKey) actions.setEnd(line, col);
                else actions.setRange(line, col);
                break;
                
            case 2:
                actions.setRange(line, col);
                actions.selectWord();
                this.dragMode = "word";
                this.dragRange = editor.selection.getRange();
                break;
                
            case 3:
                actions.selectLine();
                this.clicks = 0;
                this.dragMode = "line";
                this.dragRange = editor.selection.getRange();
                break;
        }
    
        this.clickTimer = setTimeout((function() { "use strict"; __this.clicks = __this.clickTimer = 0; }), CLICK_DELAY);
        
        editor.flushQueue();
    },
    
    _onMouseMove: function(evt) {
    
        if (!this.mouseDown)
            return;
        
        this.mousePos = { x: evt.clientX, y: evt.clientY };
        this._onDrag();
        this._dragScroll();
    },
    
    _onGutterMouseDown: function(evt) {
    
        if (evt.target.className === "line-number") {
        
            var i = parseInt(evt.target.getAttribute("data-line"), 10),
                editor = this.editor;
            
            this.actions.selectLine(i);
            evt.preventDefault();
            
            // [IE8] We must set the focus after a timeout
            setTimeout((function() { "use strict"; editor.focus() }), 0);
            
            editor.flushQueue();
        }
    },
    
    _onDrag: function() {
    
        var editor = this.editor,
            actions = this.actions,
            rng = editor.getRangeFromPoint(this.mousePos.x, this.mousePos.y),
            normal,
            point;
        
        actions.setEnd(rng.end.line, rng.end.col);
        
        if (this.dragMode) {
        
            normal = editor.selection.isNormalized();
        
            switch (this.dragMode) {
            
                case "word":
                    if (normal) actions.selectNextWord();
                    else actions.selectPreviousWord();
                    break;
                
                case "line":
                    if (normal) actions.selectEOL();
                    else actions.selectBOL();
                    break;
            }
            
            point = (normal) ? this.dragRange.start : this.dragRange.end;
            actions.setStart(point.line, point.col);
        }
    },
    
    _onScroll: function(evt) {
    
        if (this.mouseDown)
            this._onDrag();
        
        // Update text and selection to reflect new scroll position
        this.editor.enqueue("scroll-text", "update-selection");
        
        // TODO: only update when vertically scrolled
        this.editor.enqueue("update-gutter");
    },
    
    _dragScroll: function() { var __this = this; 
    
        if (this.scrollTimer)
            return;
        
        var editor = this.editor,
            frame = editor.layers.frame,
            rect = editor.richText.getRect();
        
        var check = (function() { "use strict";
        
            if (!__this.mouseDown)
                return;
            
            var x = __this.mousePos.x,
                y = __this.mousePos.y,
                scrollTop = frame.scrollTop,
                scrollLeft = frame.scrollLeft;
            
            if (x < rect.left) {
            
                frame.scrollLeft = Math.max(scrollLeft - DRAG_SCROLL_AMOUNT, 0);
            
            } else if (x > rect.left + rect.width) {
            
                frame.scrollLeft += DRAG_SCROLL_AMOUNT;
            }
            
            if (y < rect.top) {
            
                frame.scrollTop = Math.max(scrollTop - DRAG_SCROLL_AMOUNT, 0);
            
            } else if (y > rect.top + rect.height) {
            
                frame.scrollTop += DRAG_SCROLL_AMOUNT;
            }
            
            __this.scrollTimer = setTimeout(check, DRAG_SCROLL_DELAY);
        });
        
        check();
    }
}});
exports.Controller = Controller;
};

__modules[23] = function(exports) {
var __this = this; "use strict";

var mixin = __require(4).mixin;
var EventTarget = __require(12).EventTarget;
var EventSubscriber = __require(10).EventSubscriber;
var _M0 = __require(5), hasKey = _M0.hasKey, setKeys = _M0.setKeys;

var DIGITS = /^\d+$/;
    
function wrapKeyEvent(evt, props) {

    var e = {
    
        type: evt.type,
        keyCode: evt.keyCode,
        charCode: evt.charCode,
        metaKey: evt.metaKey,
        shiftKey: evt.shiftKey,
        altKey: evt.altKey,
        ctrlKey: evt.ctrlKey,
        sourceEvent: evt
    };
    
    if (props)
        setKeys(e, props);
    
    return e;
}

function createTextarea() {

    var ta = document.createElement("textarea");
        
    ta.style.position = "fixed";
    ta.style.top = "0px";
    ta.style.left = "-200%";
    ta.style.width = "100%";
    ta.style.height = "100%";
    ta.style.zIndex = -1;
    
    document.body.appendChild(ta);
    
    return ta;
}

var handlers = {

    beforecut: function(evt) { evt.preventDefault(); },
    
    beforecopy: function(evt) { evt.preventDefault(); },
    
    paste: function(evt) { this._doPaste(evt); },
    
    cut: function(evt) { this._doCutCopy(evt); },
    
    copy: function(evt) { this._doCutCopy(evt); },
    
    keydown: function(evt) {
    
        this.lastPress = 0;
        
        // Prevent exiting input
        if (this._onKeyDown(evt) === 9)
            evt.preventDefault();
        
        evt.stopPropagation();
        this.ignorePress = evt.defaultPrevented;
    },
    
    keypress: function(evt) {
    
        var k = evt.keyCode || evt.charCode,
            c = evt.charCode || evt.keyCode;
        
        if (k === this.lastPress)
            this._onKeyDown(evt);
        
        this.lastPress = k;
        
        if (this.ignorePress) {
        
            evt.preventDefault();
        
        } else if (evt.charCode !== 0) {
        
            this.dispatchEvent(wrapKeyEvent(evt));
            
            if (c && !(evt.metaKey || evt.ctrlKey)) {
            
                evt.preventDefault();
                this.dispatchEvent(wrapKeyEvent(evt, { type: "char", charString: String.fromCharCode(c) }));
            }
        }
        
        evt.stopPropagation();
    },
    
    keyup: function(evt) {
    
        this.lastPress = 0;
        this.dispatchEvent(wrapKeyEvent(evt));
        
        evt.stopPropagation();
    },
    
    focus: function() {
    
        this.dispatchEvent({ type: "focus" });
    },
    
    blur: function() {
    
        this.dispatchEvent({ type: "blur" });
    }
    
};

var KeyReader = es6now.Class(EventTarget, function(__super) { return {

    constructor: function(keyMap) {
    
        __super.call(this);
        
        EventSubscriber.call(this);
        
        this.ignorePress = false;
        this.lastPress = 0;
        this.keyMap = keyMap || {};
        this.textarea = createTextarea();
        this._enableCopy();
        
        for (var k in handlers)
            this.subscribe(this.textarea, k, handlers[k]);
    },
    
    dispose: function() {
    
        if (this.timer) 
            clearTimeout(this.timer);
        
        this.unsubscribe();
        this.textarea.parentNode.removeChild(this.textarea);
    },
    
    focus: function() {
    
        this.textarea.focus();
        this.textarea.select();
    },
    
    setKeyMap: function(map) {
    
        this.keyMap = map;
    },
    
    _enableCopy: function() {
    
        this.textarea.value = "x";
        this.textarea.select();
    },
    
    _onKeyDown: function(evt) {
    
        this.dispatchEvent(wrapKeyEvent(evt));
        
        var code = evt.keyCode,
            char = String.fromCharCode(code),
            key = "",
            a,
            b;
        
        if (evt.shiftKey) key = "shift+" + key;
        if (evt.metaKey) key = "meta+" + key;
        if (evt.altKey) key = "alt+" + key;
        if (evt.ctrlKey) key = "ctrl+" + key;
        
        a = key + String(code);
        b = DIGITS.test(char) ? null : (key + char);
        
        if (hasKey(this.keyMap, a)) key = a;
        else if (b && hasKey(this.keyMap, b)) key = b;
        else key = null;
        
        if (key) {
        
            this.dispatchEvent({ type: "command", command: this.keyMap[key] });
            evt.preventDefault();
        }
        
        return key;
    },
    
    _doPaste: function(evt) { var __this = this; 
    
        var data = evt.clipboardData, 
            ta = this.textarea,
            dispatch;
            
        dispatch = (function(txt) { "use strict";
        
            __this.dispatchEvent({ type: "paste", textData: txt });
            __this.dispatchEvent({ type: "afterclipboardaction", action: "paste" });
        });
        
        this.dispatchEvent({ type: "clipboardaction", action: "paste" });
        
        if (data && data.getData) {
        
            evt.preventDefault();
            dispatch(data.getData("text/plain"));
        
        } else {
        
            setTimeout((function() { "use strict";
            
                var txt = ta.value;
                dispatch(txt);
                
                __this._enableCopy();
                
            }), 0);
        }
    },
    
    _doCutCopy: function(evt) { var __this = this; 
    
        var type = evt.type,
            e = { type: type, textData: "" }, 
            ta = this.textarea;
        
        this.dispatchEvent({ type: "clipboardaction", action: type });
        this.dispatchEvent(e);
        
        ta.value = e.textData || "";
        ta.select();
        
        setTimeout((function() { "use strict";
        
            __this.dispatchEvent({ type: "afterclipboardaction", action: type });
            __this._enableCopy();
        
        }), 0);
    }
}});

mixin(KeyReader, EventSubscriber);

exports.KeyReader = KeyReader;
};

__modules[24] = function(exports) {
"use strict";

var _M0 = __require(5), hasKey = _M0.hasKey, addKeys = _M0.addKeys, setKeys = _M0.setKeys, copyKeys = _M0.copyKeys;
var KeyMap = __require(25).KeyMap;
var HtmlParser = __require(28).HtmlParser;

var DEFAULT = {

    tabSize: 4,
    insertSpaces: true,
    keyMap: KeyMap,
    parser: HtmlParser
    
};

var Options = es6now.Class(null, function(__super) { return {

    constructor: function(map) {
    
        this.map = addKeys(map || {}, DEFAULT);
    },
    
    get: function(key) {
    
        if (key === undefined) return copyKeys(this.map);
        else return hasKey(this.map, key) ? this.map[key] : null;
    },
    
    set: function(key, val) {
    
        if (typeof key === "string") this.map[key] = val;
        else setKeys(this.map, key);
    }
}});

exports.Options = Options;
};

__modules[25] = function(exports) {
"use strict";

var _M0 = __require(26), Win = _M0.KeyMap;
var _M1 = __require(27), Mac = _M1.KeyMap;

var KeyMap = Win;

if (window.navigator) {

    var ua = window.navigator.userAgent;
    
    if (ua.indexOf("Macintosh;") >= 0)
        KeyMap = Mac;
}

exports.KeyMap = KeyMap;
};

__modules[26] = function(exports) {
"use strict";

var KeyMap = {

    13: "insertNewline",
    "shift+13": "insertNewline",
    "ctrl+13": "insertNewline",
    "ctrl+shift+13": "insertNewline",
    
    9: "insertTabShift",
    "shift+9": "removeTabShift",
    
    37: "moveLeft",
    39: "moveRight",
    40: "moveDown",
    38: "moveUp",
    
    "shift+37": "selectLeft",
    "shift+39": "selectRight",
    "shift+40": "selectDown",
    "shift+38": "selectUp",
    
    "36": "moveBOL",
    "35": "moveEOL",
    "ctrl+36": "moveBOF",
    "ctrl+35": "moveEOF",
    
    "shift+36": "selectBOL",
    "shift+35": "selectEOL",
    "ctrl+shift+36": "selectBOF",
    "ctrl+shift+35": "selectEOF",
    
    "ctrl+37": "movePreviousWord",
    "ctrl+39": "moveNextWord",
    "33": "movePageUp",
    "34": "movePageDown",
    
    "ctrl+shift+37": "selectPreviousWord",
    "ctrl+shift+39": "selectNextWord",
    "shift+33": "selectPageUp",
    "shift+34": "selectPageDown",
    
    8: "backspace",
    "ctrl+8": "backspaceWord",
    46: "reverseBackspace",
    "shift+46": "reverseBackspaceWord",
    
    "ctrl+Z": "undo",
    "ctrl+Y": "redo",
    
    "ctrl+A": "selectAll",
    
    "ctrl+K": "foldSelection"

};

exports.KeyMap = KeyMap;
};

__modules[27] = function(exports) {
"use strict";

var KeyMap = {

    13: "insertNewline",
    "shift+13": "insertNewline",
    "meta+13": "insertNewline",
    "meta+shift+13": "insertNewline",
    
    9: "insertTab",
    
    37: "moveLeft",
    39: "moveRight",
    40: "moveDown",
    38: "moveUp",
    
    "shift+37": "selectLeft",
    "shift+39": "selectRight",
    "shift+40": "selectDown",
    "shift+38": "selectUp",
    
    "meta+37": "moveBOL",
    "meta+39": "moveEOL",
    "meta+38": "moveBOF",
    "meta+40": "moveEOF",
    
    "meta+shift+37": "selectBOL",
    "meta+shift+39": "selectEOL",
    "meta+shift+38": "selectBOF",
    "meta+shift+40": "selectEOF",
    
    "alt+37": "movePreviousWord",
    "alt+39": "moveNextWord",
    "alt+38": "movePageUp",
    "alt+40": "movePageDown",
    
    "alt+shift+37": "selectPreviousWord",
    "alt+shift+39": "selectNextWord",
    "alt+shift+38": "selectPageUp",
    "alt+shift+40": "selectPageDown",
    
    8: "backspace",
    "alt+8": "backspaceWord",
    "shift+8": "reverseBackspace",
    "alt+shift+8": "reverseBackspaceWord",
    
    "meta+90": "undo",
    "meta+shift+90": "redo",
    
    "meta+221": "shiftRight",
    "meta+219": "shiftLeft",
    
    "meta+A": "selectAll",
    
    "meta+K": "foldSelection"
};

exports.KeyMap = KeyMap;
};

__modules[28] = function(exports) {
"use strict";

var Parser = __require(29).Parser;
var JavascriptParser = __require(30).JavascriptParser;
var CSSParser = __require(32).CSSParser;
var KeySet = __require(5).KeySet;

var spacePattern = /[ \n\r\f\t]+/g,
    spaceChar = /[ \n\r\f\t]/;

var voidTags = new KeySet(
    "area", "base", "br", "col", "command", "embed", "hr", "img", "input", 
    "keygen", "link", "meta", "param", "source", "track", "wbr"
);

var HtmlParser = es6now.Class(Parser, function(__super) { return {

    constructor: function() {
    
        this.jsParser = new JavascriptParser();
        this.cssParser = new CSSParser();
        
        __super.call(this, "html");
    },

    Start: function(context) {
    
        // Find element opening tag
        var i = this.search("<");
        
        if (i === -1) {
        
            this.offset = this.end;
            return "text";
        }
        
        if (i > this.offset) {
        
            this.offset = i;
            this.write("text");
        }
        
        var chr = this.peek(1);
        
        // Check for space after angle
        if (!chr || spaceChar.test(chr)) {
        
            this.read();
            return "text";
        }
        
        if (chr === "!") {
        
            if (this.search("<!--") === this.offset)
                return this.CommentBegin(context);
            
            if (this.search("<![CDATA[") === this.offset)
                return this.CDataBegin(context);
        }
        
        if (chr === "?")
            return this.DirectiveBegin(context);
        
        if (chr === "/")
            return this.EndTagBegin(context);
        
        return this.StartTagBegin(context);
    },
    
    CommentBegin: function(context) {
    
        this.pushNode("Comment");
        
        this.match("<!--");
        this.write({ type: "comment", isSentinel: true });
        
        return this.Comment();
    },
    
    Comment: function() {
    
        var i = this.search("-->");
        
        if (i >= 0) {
        
            if (i > this.offset) {
            
                this.offset = i;
                this.write("comment");
            }
            
            this.offset = i + 3;
            this.write({ type: "comment", isSentinel: true  });
            
            this.popNode();
        
        } else {
        
            this.offset = this.end;
            this.write("comment");
        }
    },
    
    DirectiveBegin: function(context) {
    
        var m = this.match(/<\?([^\s>]*)/g),
            name = m[1].toLowerCase();
        
        this.pushNode({ type: "Directive", name: name });
        return "tag";
    },
    
    Directive: function() {
    
        var i = this.search("?>");
        
        if (i >= 0) {
        
            this.offset = i;
            this.write("");
            
            this.offset += 2;
            this.write("tag");
            
            this.popNode();
        
        } else {
        
            this.offset = this.end;
            this.write("");
        }
    },
    
    CDataBegin: function(context) {
    
        this.pushNode("CData");
        
        this.match("<![CDATA[");
        this.write({ type: "tag", isSentinel: true });
        
        return this.CData();
    },
    
    CData: function() {
    
        var i = this.search("]]>");
        
        if (i >= 0) {
        
            this.offset = i;
            this.write("");
            
            this.offset += 3;
            this.write({ type: "tag", isSentinel: true });
            
            this.popNode();
        
        } else {
        
            this.offset = this.end;
            this.write("");
        }
    },
    
    StartTagBegin: function(context) {
    
        this.match("<");
        
        var i = this.search(/[ \n\r\f\t]|\/?>|$/g),
            name = (i >= 0 ? this.input.slice(this.offset, i).toLowerCase() : "");
        
        this.pushNode({ type: "Tag", tagName: name });
        this.pushNode({ type: "StartTag", tagName: name, isSentinel: true });
        
        if (i >= 0)
            this.offset = i;
        
        this.write("tag");
    },
    
    StartTag: function(context) {
    
        var name = context.tagName, m;
        
        if (this.match(spacePattern))
            this.write("");
        
        if (m = this.match(/\/?>/g)) {
        
            this.write("tag");
            this.popNode();
            
            if (m[1] || name.slice(0, 1) === "!" || voidTags.has(name)) this.popNode();
            else if (name === "script") this.ScriptBegin();
            else if (name === "style") this.StyleBegin();
            else this.pushNode({ type: "Start", tagName: name });
            
        } else if (this.peek()) {
        
            return this.Attribute(context); 
        }
    },
    
    EndTagBegin: function(context) {
    
        var m = this.match(/<\/([^\s>]*)/g),
            name = m[1].toLowerCase(),
            pop = 1,
            node;
        
        // Find matching tag node
        for (node = context; node; node = node.parent, ++pop)
            if (node.tagName === name)
                break;
        
        if (node) {
        
            // Pop off intermediate nodes
            while (pop--)
                this.popNode();
        
        } else {
        
            this.pushNode({ type: "Tag", tagName: name });
        }
        
        this.pushNode({ type: "EndTag", tagName: name, isSentinel: true });
        this.write("tag");
    },
    
    EndTag: function(context) {
    
        if (this.match(spacePattern))
            this.write("");
            
        var i = this.search(">");
        
        if (i === -1) {
        
            this.offset = this.end;
            return "tag";
        }
        
        this.offset = i + 1;
        this.write("tag");
        
        this.popNode();
        this.popNode();
    },
    
    Attribute: function(context) {
    
        var chr = this.peek();
        
        if (chr === "=") {
        
            this.read();
            context.attrValue = true;
            return "punctuator";
            
        } else if (chr === "'" || chr === '"') {
        
            context.attrValue = false;
            return this.StringStart(chr);
        
        } else {
        
            this.match(/[^="'> \n\r\f\t]+/g);
            this.write(context.attrValue ? "string" : "attribute");
            context.attrValue = false;
        }
    },
    
    StringStart: function(delim) {
    
        this.pushNode({ type: "String", delim: delim });
        
        this.read();
        return "string";
    },
    
    String: function(context) {
    
        var i = this.search(context.delim);
        
        this.offset = i >= 0 ? i + 1 : this.end;
        this.append("string");
        
        if (i >= 0)
            this.popNode();
    },
    
    ScriptBegin: function(context) {
    
        this.pushNode(context = { type: "Script", tagName: "script" });
        this.pushNode(this.jsParser.createRoot());
        
        return this.Script(context);
    },
    
    Script: function(context) {
    
        var i = this.search(/<\/script[\s>$]/ig);
        
        this.delegate(this.jsParser, i, i >= 0);

        if (i === this.start)
            return this.EndTagBegin(context);
    },
    
    StyleBegin: function(context) {
    
        this.pushNode(context = { type: "Style", tagName: "style" });
        this.pushNode(this.cssParser.createRoot());
        
        return this.Style(context);
    },
    
    Style: function(context) {
    
        var i = this.search(/<\/style[\s>$]/ig);
        
        this.delegate(this.cssParser, i, i >= 0);

        if (i === this.start)
            return this.EndTagBegin(context);
    }
}});

exports.HtmlParser = HtmlParser;
};

__modules[29] = function(exports) {
"use strict";

function findNode(node, lang) {

    while (node.lang !== lang && node.parent)
        node = node.parent;
    
    return node;
}

var Parser = es6now.Class(null, function(__super) { return {

    constructor: function(lang) {
    
        this.lang = lang;
    },
    
    createRoot: function() {
    
        return { type: "Start", lang: this.lang };
    },
    
    parse: function(options) {
    
        this.tree = options.tree;
        this.input = options.input;
        this.start = options.start;
        this.offset = options.start;
        this.end = options.end;
        this.tokenList = options.tokenList;
        this.lastToken = null;
        
        if (this.end < 0)
            this.end = this.input.length;

        var node = findNode(this.tree.current, this.lang),
            s = this.start,
            token;
        
        token = this[node.type](node);
        
        if (this.offset !== this.start)
            this.write(token || "");
        
        if (this.offset - s === 0)
            debugger;
        
        return this.offset - s;
    },
    
    write: function(token) {
    
        if (typeof token === "string")
            token = { type: token };
        
        var len = this.offset - this.start;
        
        if (len < 0)
            throw new Error("Cannot write a zero-length token.");
        
        token.start = this.start;
        token.length = len;
        token.tokenList = this.tokenList;
        
        this.start = this.offset;
        this.lastToken = token;
        
        this.tree.insertToken(token);
        this.tokenList.push(token);
        
        return token;
    },
    
    append: function(type) {
    
        if (!this.lastToken || this.lastToken.type !== type)
            return this.write(type);
        
        this.lastToken.length += this.offset - this.start;
        this.start = this.offset;
    },
    
    read: function() {
        
        if (this.offset >= this.end)
            return "";
        
        return this.input[this.offset++];
    },
    
    peek: function(offset) {
    
        offset = this.offset + (offset || 0);
        
        if (offset >= this.end)
            return "";
        
        return this.input[offset];
    },
    
    search: function(pattern) {
    
        if (typeof pattern === "string")
            return this.input.indexOf(pattern, this.offset);
        
        pattern.lastIndex = this.offset;
        var m = pattern.exec(this.input);
        
        return m ? m.index : -1;
    },
    
    match: function(pattern) {
    
        if (typeof pattern === "string") {
        
            var i = this.input.indexOf(pattern, this.offset);
            
            if (i === this.offset) {
            
                this.offset += pattern.length;
                return true;
            
            } else {
            
                return false;
            }
        }
        
        pattern.lastIndex = this.offset;
        
        var m = pattern.exec(this.input);
        
        if (m && m.index !== this.offset)
            m = null;
        
        if (m)
            this.offset += m[0].length;
        
        return m;
    },
    
    pushNode: function(node) {
    
        if (typeof node === "string")
            node = { type: node };
        
        if (!node.lang)
            node.lang = this.lang;
        
        this.tree.push(node);
    },
    
    popNode: function() {
    
        this.tree.pop();
    },
    
    delegate: function(parser, end, exit) {
    
        if (this.offset > this.start)
            this.write("");
        
        if (end === undefined || end < 0)
            end = this.end;
        
        var len = 0;
        
        if (this.start < end) {
        
            len = parser.parse({
            
                input: this.input,
                start: this.start,
                end: end,
                tokenList: this.tokenList,
                tree: this.tree
            });
        }
        
        this.offset += len;
        this.start = this.offset;
        
        if (exit && this.start === end) {
        
            while (this.tree.current.lang !== this.lang)
                this.popNode();
        }
        
        return len;
    }
}});

exports.Parser = Parser;
};

__modules[30] = function(exports) {
"use strict";

var Parser = __require(29).Parser;
var _M0 = __require(31), unicode = _M0.categories;
var KeySet = __require(5).KeySet;

var unicodeLetter = unicode.Lu + unicode.Ll + unicode.Lt + unicode.Lm + unicode.Lo + unicode.Nl,
    identifierStart = new RegExp("^[\\\\_$" + unicodeLetter + "]"),
    identifierPart = new RegExp("^[_$\u200c\u200d" + unicodeLetter + unicode.Mn + unicode.Mc + unicode.Nd + unicode.Pc + "]+"),
    identifierEscape = /\\u([0-9a-fA-F]{4})/g;

// [IE8] does not recognize "\v", use "\x0b" instead

var whitespaceChars = new CharSet("\t\x0b\f\uFEFF \u1680\u180E\u202F\u205F\u3000\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A"),
    decimalDigit = new CharSet("0123456789"),
    newlineChars = new CharSet("\r\n\u2028\u2029"),
    punctuatorChars = new CharSet("{}[]().;,<>+-*%&|^!~?:=/"),
    xChars = new CharSet("xX");

var multiCharPunctuators = new KeySet(
    "++", "--", "&&", "||", "<<", ">>", ">>>", "<=", ">=", "!=", "!==", "==", 
    "===", "*=", "&=", "^=", "|=", "<<=", ">>=", ">>>=", "%=", "+=", "-=", "/=");

var reservedWords = new KeySet(
    "break", "case", "catch", "continue", "debugger", "default", "finally", "for", "function",
    "if", "switch", "this", "try", "var", "while", "with", "class", "const", "enum", "export", 
    "extends", "import", "super", "true", "false", "delete", "do", "else", "in", "instanceof", 
    "new", "return", "throw", "typeof", "null", "void");

var strictReservedWords = new KeySet(
    "implements", "let", "private", "public", "interface", "package", 
    "protected", "static", "yeild");

var reservedLiterals = new KeySet("this", "null", "true", "false");
    
var stringEscapeChars = {

    "n": "\n",
    "r": "\r",
    "t": "\t",
    "b": "\b",
    "v": "\x0b",
    "f": "\f",
    "0": "\0"
};

var stringEscape = /([nrtbvf])|x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4})|([0-3][0-7]{0,2}|[4-7][0-7]?)|\r\n|[\s\S]/g,
    stringEscapeStrict = /([nrtbvf0])|x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4})|\r\n|[\s\S]/g,
    numberPattern = /(0[0-7]+)|(?:\.[0-9]+|(?:0|[1-9][0-9]*)(?:\.[0-9]+)?)(?:[eE][+-]?[0-9]+)?/g,
    numberPatternStrict = /(?:\.[0-9]+|(?:0|[1-9][0-9]*)(?:\.[0-9]+)?)(?:[eE][+-]?[0-9]+)?/g,
    hexPattern = /0[xX]([0-9a-fA-F]+)/g,
    blockCommentBegin = /\/\*/g,
    blockCommentEnd = /[\s\S]*?\*\//g;

// Returns a KeySet for each character in the string
function CharSet(str) {

    return new KeySet(str.split(""));
}

var WHITESPACE = 1,
    DECIMAL_DIGIT = 2,
    NEWLINE = 3,
    PUNCTUATOR = 4,
    ASCII_IDENT = 5;
    
var charTable = createCharTable();

// Creates an optimized character lookup table
function createCharTable() {

    var map = {}, i;
    
    whitespaceChars.each(function(k) { map[k] = WHITESPACE; });
    decimalDigit.each(function(k) { map[k] = DECIMAL_DIGIT; });
    newlineChars.each(function(k) { map[k] = NEWLINE; });
    punctuatorChars.each(function(k) { map[k] = PUNCTUATOR; });
    
    for (i = 65; i < 91; ++i)
        map[String.fromCharCode(i)] = ASCII_IDENT;
    
    for (i = 97; i < 123; ++i)
        map[String.fromCharCode(i)] = ASCII_IDENT;
        
    map["_"] = ASCII_IDENT;
    map["$"] = ASCII_IDENT;
    map["\\"] = ASCII_IDENT;
    
    return map;
}

var JavascriptParser = es6now.Class(Parser, function(__super) { return {

    constructor: function() {
    
        this.strict = false;
        __super.call(this, "javascript");
    },
    
    Start: function(context) {
    
        var chr = this.peek(),
            kind = charTable[chr];
        
        if (kind === WHITESPACE)
            return this.Whitespace();
        
        if (kind === NEWLINE)
            return this.Newline();
        
        if (kind === DECIMAL_DIGIT) {
        
            if (xChars.has(this.peek(1)))
                return this.HexNumber(context);
            else
                return this.Number(context);
        }
        
        if (chr === "." && decimalDigit.has(this.peek(1)))
            return this.Number(context);
        
        if (chr === "'")
            return this.SQStringStart(context);
        
        if (chr === '"')
            return this.DQStringStart(context);
        
        if (chr === "/") {
        
            var next = this.peek(1);
            
            if (next === "/")
                return this.LineComment();
            else if (next === "*")
                return this.BlockCommentStart();
            else if (!context.div)
                return this.RegularExpression(context);
        }
        
        if (kind === PUNCTUATOR)
            return this.Punctuator(context);
        
        if (kind === ASCII_IDENT || identifierStart.test(chr))
            return this.Identifier(context);
        
        return this.Error();
    },
    
    Whitespace: function() {
    
        while (whitespaceChars.has(this.peek()))
            this.read();
        
        return null;
    },
    
    Newline: function() {
        
        var val = this.read();
        
        if (val === "\r" && this.peek() === "\n")
            val += this.read();
        
        this.newlineBefore = true;
        
        return null;
    },
    
    Punctuator: function(context) {
    
        var str = this.read(), next;
        
        while (multiCharPunctuators.has(next = str + this.peek())) {
        
            this.read();
            str = next;
        }
        
        if (str !== "++" && str !== "--")
            context.div = (str === ")" || str === "]");
        
        return { type: "punctuator", value: str };
    },
    
    StringContent: function(delim) {
    
        var chr, val = "";
        
        while (chr = this.peek()) {
        
            if (chr === delim) {
            
                this.read();
                return true;
            }
            
            if (newlineChars.has(chr)) {
            
                this.read();
                return true;
            }
            
            val += (chr === "\\") ? 
                this.StringEscape() : 
                this.read();
        }
        
        return false;
    },
    
    DQStringStart: function(context) {
    
        context.div = true;
        
        this.pushNode("DQString");
        
        this.read();
        return "string";
    },
    
    DQString: function() {
    
        var end = this.StringContent('"');
        
        this.append("string");
        
        if (end)
            this.popNode();
    },
    
    SQStringStart: function(context) {
    
        context.div = true;
        
        this.pushNode("SQString");
        
        this.read();
        return "string";
    },
    
    SQString: function() {
    
        var end = this.StringContent("'");
        
        this.append("string");
        
        if (end)
            this.popNode();
    },
    
    StringEscape: function() {
    
        this.read();
        
        var m = this.match(this.strict ? stringEscapeStrict : stringEscape);
        if (!m) return "";
        
        if (m[1]) return stringEscapeChars[m[1]];
        else if (m[2]) return String.fromCharCode(parseInt(m[2], 16));
        else if (m[3]) return String.fromCharCode(parseInt(m[3], 16));
        else if (this.strict && m[4]) return String.fromCharCode(parseInt(m[4], 8));
        else return m[0];
    },
    
    RegularExpression: function(context) {
    
        this.read();
        
        var backslash = false, 
            inClass = false,
            flags = null,
            val = "", 
            chr;
        
        while ((chr = this.read())) {
        
            if (newlineChars.has(chr)) {
            
                chr = "";
                break;
            }
            
            if (backslash) {
            
                val += "\\" + chr;
                backslash = false;
            
            } else if (chr == "[") {
            
                inClass = true;
                val += chr;
            
            } else if (chr == "]" && inClass) {
            
                inClass = false;
                val += chr;
            
            } else if (chr == "/" && !inClass) {
            
                break;
            
            } else if (chr == "\\") {
            
                backslash = true;
                
            } else {
            
                val += chr;
            }
        }
        
        if (identifierStart.test(this.peek()))
            flags = this.Identifier({ name: true }).value;
        
        context.div = true;
        
        return { type: "regex", value: val, flags: flags };
    },
    
    Number: function(context) {
    
        var m = this.match(this.strict ? numberPatternStrict : numberPattern);
        if (!m) return this.Error();
        
        context.div = true;
        return { type: "number", value: m[1] ? parseInt(m[1], 8) : parseFloat(m[0]) };
    },
    
    HexNumber: function(context) {
    
        var m = this.match(hexPattern);
        if (!m) return this.Error();
        
        context.div = true;
        return { type: "number", value: parseInt(m[1], 16) };
    },
    
    Identifier: function(context) {
    
        var str = this.read(),
            esc = (str === "\\"),
            type = "identifier",
            chr;
        
        while (chr = this.peek()) {
        
            if (chr === "\\")
                esc = true;
            else if (!identifierPart.test(chr))
                break;
            
            str += this.read();
        }
        
        // Process unicode escape sequences
        if (esc) {
        
            str = str.replace(identifierEscape, function(m, m1) {
                
                return String.fromCharCode(parseInt(m1, 16));
            });
        }
        
        if (context.name) type = "identifier";
        else if (reservedWords.has(str)) type = "keyword";
        else if (this.strict && strictReservedWords.has(str)) type = "keyword";
        
        context.div = (type === "identifier" || reservedLiterals.has(str));
        
        return { type: type, value: str };
    },
    
    LineComment: function() {
    
        this.offset = this.end;
        return "comment";
    },
    
    BlockCommentStart: function() {
    
        this.pushNode("BlockComment");
        
        this.match(blockCommentBegin);
        return "comment";
    },
    
    BlockComment: function() {
        
        var m = this.match(blockCommentEnd);
        
        if (!m)
            this.offset = this.end;
        
        this.append("comment");
        
        if (m)
            this.popNode();
    },
    
    Error: function() {
    
        this.read();
        return "error";
    }
}});

exports.JavascriptParser = JavascriptParser;
};

__modules[31] = function(exports) {
"use strict";

var forEachKey = __require(5).forEachKey;

function expand(map) {

    var pattern = /([0-9a-f]{4})(-[0-9a-f]{4})?/ig;
    
    forEachKey(map, (function(k) { "use strict";
    
        map[k] = map[k].replace(pattern, (function(m, m1, m2) { "use strict";
            
            return "\\u" + m1 + (m2 ? "-\\u" + m2.slice(1) : "");
        }));
    }));
    
    return map;
}

// The following list is not complete.  It only contains the categories that are
// relavant for javascript.
var categories = expand({

    Ll: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F0521052305250561-05871D00-1D2B1D62-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7C2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2D00-2D25A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CFB00-FB06FB13-FB17FF41-FF5A",
    Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E0520052205240531-055610A0-10C51E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CEDA640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BFF21-FF3A",
    Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
    Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D611D781D9B-1DBF2071207F2090-20942C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A9CFAA70AADDFF70FF9EFF9F",
    Lo: "01BB01C0-01C3029405D0-05EA05F0-05F20621-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150904-0939093D09500958-096109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF12135-21382D30-2D652D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
    
    Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0902093C0941-0948094D0951-095509620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F90-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135F1712-17141732-1734175217531772177317B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1DC0-1DE61DFD-1DFF20D0-20DC20E120E5-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66FA67CA67DA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
    Mc: "0903093E-09400949-094C094E0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1C24-1C2B1C341C351CE11CF2A823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BABE3ABE4ABE6ABE7ABE9ABEAABEC",
    
    Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
    Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
    
    Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F"

});
exports.categories = categories;
};

__modules[32] = function(exports) {
"use strict";

var Parser = __require(29).Parser;
var KeySet = __require(5).KeySet;

var newlineChars = new CharSet("\r\n\f"),
    spaceChars = new CharSet("\r\n\f\t "),
    digitChars = new CharSet("0123456789"),
    escapePattern = /[0-9a-fA-F]{1,6}\s?|[\r\n\f\u0020-\u007E\u0080-\uD7FF\uE000-\uFFFD]/g,
    numberPattern = /[0-9]+(?:\.[0-9]+)?|\.[0-9]/g,
    nameStartChar = /[a-zA-Z_\u0080-\uD7FF\uE000-\uFFFD]/,
    nameChars = /[a-zA-Z0-9_\u0080-\uD7FF\uE000-\uFFFD-]+/g,
    blockCommentBegin = /\/\*/g,
    blockCommentEnd = /[\s\S]*?\*\//g,
    urlStart = /url\(/ig;

// Returns a KeySet for each character in the string
function CharSet(str) {

    return new KeySet(str.split(""));
}

var CSSParser = es6now.Class(Parser, function(__super) { return {

    constructor: function() {
    
        __super.call(this, "css");
    },
    
    Start: function(context) {
    
        var chr = this.peek();
        
        if (spaceChars.has(chr))
            return this.WhiteSpace(context);
        
        if (chr === "@")
            return this.AtRule(context);
        
        if (chr === "#")
            return this.Hash(context);
        
        if (digitChars.has(chr) || (chr === "." && digitChars.has(this.peek(1))))
            return this.Number(context);
        
        if (chr === "'" || chr === '"')
            return this.StringStart(chr);
        
        if (chr === "/" && this.peek(1) === "*")
            return this.BlockCommentStart();
        
        if (chr === "{")
            return this.BlockStart(context);
        
        if (chr === "{")
            return this.BlockEnd(context);
        
        if (chr.toLowerCase() === "u" && this.search(urlStart) === this.offset)
            return this.UrlStart(context);
        
        if (this.isIdentStart())
            return this.Identifier(context);
        
        this.read();
        return "";
    },
    
    WhiteSpace: function() {
    
        while (spaceChars.has(this.peek()))
            this.read();
        
        return "";
    },
    
    UrlStart: function(context) {
    
        this.pushNode("Url");
        
        this.offset += 3; // url
        this.write("keyword");
    },
    
    Url: function(context) {
    
        var i = this.search(/["')]/g);
        
        if (i === -1) {
        
            this.offset = this.end;
            return "";
        }
        
        if (i > this.offset) {
        
            this.offset = i;
            this.write("");
        }
        
        var chr = this.peek();
        
        if (chr === ")") {
        
            this.read();
            this.write("");
            this.popNode();
        
        } else {
        
            return this.StringStart(chr);
        }
    },
    
    AtRule: function(context) {
    
        this.read("@");
        this.IdentifierName();
        
        return "keyword";
    },
    
    Identifier: function(context) {
        
        this.IdentifierName(context);
        return "identifier";
    },
    
    IdentifierName: function(context) {
    
        this.match("-");
        this.Name();
    },
    
    Name: function(context) {
    
        while (true) {
        
            this.match(nameChars);
            
            if (this.match("\\")) this.match(escapePattern);
            else break;
        }
    },
    
    Hash: function(context) {
    
        this.match("#");
        this.Name(context);
        
        return "identifier";
    },
    
    Number: function(context) {
    
        this.match(numberPattern);
        
        var chr = this.peek();
        
        if (chr === "%") {
        
            // Percentage
            this.read();
        
        } else if (this.isIdentStart()) {
        
            // Dimensions
            this.IdentifierName(context);
        }
        
        return "number";
    },
    
    StringStart: function(delim) {
    
        this.pushNode({ type: "String", delim: delim });
        
        this.read();
        return "string";
    },
    
    String: function(context) {
    
        var chr, end = false;
        
        while (chr = this.read()) {
        
            if (chr === context.delim || newlineChars.has(chr)) {
            
                end = true;
                break;
            }
            
            if (chr === "\\")
                this.match(escapePattern);
        }
        
        this.append("string");
        
        if (end)
            this.popNode();
    },
    
    BlockCommentStart: function() {
    
        this.pushNode("BlockComment");
        
        this.match(blockCommentBegin);
        return "comment";
    },
    
    BlockComment: function() {
        
        var m = this.match(blockCommentEnd);
        
        if (!m)
            this.offset = this.end;
        
        this.append("comment");
        
        if (m)
            this.popNode();
    },
    
    BlockStart: function(context) {
    
        this.read("{");
        this.pushNode("Start");
        
        return "";
    },
    
    BlockEnd: function(context) {
    
        this.read("}");
        this.write("");
        
        if (context.parent)
            this.popNode();
    },
    
    isIdentStart: function() {
    
        var chr = this.peek();
        
        if (chr === "-" && nameStartChar.test(this.peek(1)) || 
            chr === "\\" && this.search(escapePattern) === this.offset + 1 ||
            nameStartChar.test(chr)) {
        
            return true;
        }
        
        return false;
    }
}});

exports.CSSParser = CSSParser;
};

__modules[33] = function(exports) {
var __this = this; "use strict";

var mixin = __require(4).mixin;
var ParseTree = __require(34).ParseTree;
var EventTarget = __require(12).EventTarget;
var EventSubscriber = __require(10).EventSubscriber;
var TextRange = __require(3).TextRange;
var _M0 = __require(15), searchArray = _M0.search;
var setKeys = __require(5).setKeys;

var arraySplice = Array.prototype.splice;

var FAST_CHUNK_SIZE = 1024,
    CHUNK_SIZE = 32768,
    SLEEP_MS = 25;

var ParseView = es6now.Class(EventTarget, function(__super) { return {

    constructor: function(textView, parser) {
    
        __super.call(this);
        
        EventSubscriber.call(this);
        
        var buffer = textView.getBuffer();
        
        this.textView = textView;
        this.textBuffer = buffer;
        
        this.parser = parser;
        this.tree = new ParseTree(parser.createRoot());
        this.restoreFrom = -1;
        this.mergeFrom = -1;
        
        var count = buffer.getLineCount();
        
        // The token index
        this.tokens = new Array(count);
        this._reindex(0);
        
        // The start state for each line
        this.states = new Array(count);
        this.states[0] = this.tree.saveState();
        
        // The current parsing position
        this.head = {};
        
        // The line we are currently scanning, if paused
        this.marker = null;
        
        this.subscribe(buffer, "change", "_onTextChange");
        
        this._cueHead(0);
        this._defer();
    },
    
    dispose: function() {
    
        this.unsubscribe();
    },
    
    splitRange: function(range) {
    
        range = this.textView.mapRange(range, true);
        range = this.textBuffer.validateRange(range);
        
        var start = range.start,
            end = range.end,
            from = start.line,
            to = end.line,
            out = [],
            tokens,
            len,
            pos,
            i,
            j,
            r;
        
        for (i = from; i <= to; ++i) {
        
            tokens = this.tokens[i] || [];
            len = (i === to ? end.col : this.textBuffer.lineAt(i).length);
            pos = 0;
            j = 0;
            
            // Search for starting token
            if (i === from)
                j = this._findToken(i, start.col).index;
            
            for (; j < tokens.length; ++j) {
            
                // Create a text range for the token
                r = this._getTokenRange(tokens[j]);
                
                if (i === from) {

                    // Clip range if necessary
                    if (r.start.col < start.col)
                        r.start.col = start.col;
                }
                
                if (i === to) {
                
                    // Stop if token is after range
                    if (r.start.col >= end.col)
                        break;
                    
                    // Clip range if necessary
                    if (r.end.col > end.col)
                        r.end.col = end.col;
                }
                
                pos = r.end.col;
                out.push(r);
            }
            
            // Add range for any unscanned text
            if (pos < len) {
            
                r = new TextRange(i, pos, i, len);
                r.type = "";
                
                out.push(r);
            }
        }
        
        return this._unmapRanges(out);
    },
    
    getSentinelRanges: function(line, col) {
    
        var rng = this.textView.mapRange(new TextRange(line, col), true);
        
        line = rng.start.line;
        col = rng.start.col;
        
        var tokens = this.tokens[line],
            nodes = [],
            out = [],
            node,
            p,
            m,
            i;
        
        if (!tokens)
            return out;
        
        m = this._findToken(line, col);
        
        // If point lies on a token boundary or at end of line...
        if (m.value || m.index >= tokens.length) {
        
            if (m.value && this._isCharSentinel(m.value, "start"))
                nodes.push(m.value);
            
            if (m.index > 0) {
            
                node = tokens[m.index - 1];
            
                if (this._isCharSentinel(node))
                    nodes.push(node);
            }
            
            if (m.value && nodes.length === 0) {
            
                // Find parent of first ancestor which is not a first child
                for (node = m.value; p = node.parent; node = p)
                    if (p.children[0] !== node)
                        break;
                
                nodes.push(p);
            }
            
        } else {
        
            nodes.push(tokens[m.index]);
        }
        
        for (i = 0; i < nodes.length; ++i) {
        
            if (nodes[i]) {
            
                out.push(
                    this._unmapRanges(
                    this._getNodeRanges(
                    this._findSentinels(nodes[i]))));
            }
        }
        
        return out;
    },

    _isCharSentinel: function(token, loc) {
    
        if (token.isSentinel && token.length === 1) {
        
            var sib = token.parent.children;
            
            return sib[loc === "start" ? 0 : sib.length - 1] === token;
        }
        
        return false;
    },
    
    _findSentinels: function(node) {
        
        var n, p, a, b, c, s;
        
        for (n = node, p = n.parent; p; n = p, p = n.parent) {
            
            if (!n.isSentinel)
                continue;
            
            c = p.children;
            
            if (c[0] === n) {
            
                s = c[c.length - 1];
                
                a = n;
                b = s.isSentinel ? s : null;
                
                break;
            }
            
            if (c[c.length - 1] === n) {
            
                s = c[0];
                
                a = s.isSentinel ? s : null;
                b = n;
                
                break;
            }
        }
        
        if (a === b)
            b = null;
        
        return [a, b];
    },
    
    _getTokenRange: function(token) {
    
        var line = token.tokenList.index,
            rng = new TextRange(line, token.start, line, token.start + token.length);
        
        rng.type = token.type;
        
        return rng;
    },
    
    _getNodeRange: function(node) {
    
        var a, b, rng = null;
        
        // Find first and last tokens in subtree
        for (a = node; a && a.children; a = a.children[0]);
        for (b = node; b && b.children; b = b.children[b.children.length - 1]);
        
        // NOTE: the rightmost or leftmost leaves might not be
        // tokens.  A more sophisticated method would search for
        // the nearest leaf that is a token.
        
        if (a && b) {
        
            rng = new TextRange(
                a.tokenList.index, 
                a.start, 
                b.tokenList.index,
                b.start + b.length);
            
            rng.type = node.type;
        }
        
        return rng;
    },
    
    _getNodeRanges: function(list) {
    
        var out = [], i;
        
        for (i = 0; i < list.length; ++i)
            if (list[i])
                out.push(this._getNodeRange(list[i]));
        
        return out;
    },
    
    _onTextChange: function(evt) {
    
        var ins = evt.inserted,
            rem = evt.removed,
            from = ins.start.line,
            reindex = false,
            to;
        
        // Invalidate edited line
        this._invalidateLine(from);
        
        // Maintain line-based data structures
        if (rem.end.line > from || ins.end.line > from) {
        
            var args = new Array(ins.end.line - from + 2);
            args[0] = from + 1;
            args[1] = rem.end.line - from;
            
            arraySplice.apply(this.tokens, args);
            arraySplice.apply(this.states, args);
            
            this._reindex(from + 1);
        }
        
        // Correct marker position
        if (this.marker !== null && this.marker > from)
            this.maker -= to - from;
        
        this._cueHead(from);
        this._readChunk(true);
    },
    
    _reindex: function(from) {
    
        var tokens = this.tokens, i;
        
        for (i = from; i < tokens.length; ++i)
            if (tokens[i])
                tokens[i].index = i;
    },
    
    _cueHead: function(line) {
    
        line = line || 0;
        
        if (this.timer) {
        
            // If we're currently parsing a previous line, the parser
            // will catch up to this line eventually, so exit
            if (line > this.head.line)
                return;
        
            // Cancel current parsing operation
            clearTimeout(this.timer);
            this.timer = 0;
        }

        // If currently in the process of scanning a line,
        // invalidate the scanned tokens (line must be re-scanned)
        if (this.marker !== null) {
        
            this._invalidateLine(this.marker);
            this.marker = null;
        }
        
        // Restore parser state
        this.tree.restore(this.states[line]);
        
        // Re-save state so that we can merge at this line later
        this.states[line] = this.tree.saveState();

        this.restoreFrom = line;
        this.mergeFrom = Math.max(line, this.mergeFrom);
        
        // Set current position
        this.head = { line: line, col: 0 };
    },
    
    _readChunk: function(fast) {
    
        var async = !!this.timer,
            rem = fast ? FAST_CHUNK_SIZE : CHUNK_SIZE,
            line = this.head.line,
            col = this.head.col,
            end = this.textBuffer.getLineCount(),
            done = true,
            tokens,
            text,
            len,
            rng,
            next;

        this.timer = 0;
        
        line_loop:
        while (line < end) {
        
            tokens = col === 0 ? (this.tokens[line] = []) : this.tokens[line];
            tokens.index = line;
            
            text = this.textBuffer.lineAt(line);
            
            while (col < text.length) {
            
                if (rem <= 0) {
                
                    done = false;
                    this.marker = line;
                    break line_loop;
                }
                
                len = this.parser.parse({
                    
                    tree: this.tree,
                    input: text,
                    start: col,
                    end: Math.min(text.length, col + rem),
                    tokenList: tokens
                
                });
                
                if (len === 0)
                    throw new Error("Parser did not consume any input.");
                
                col += len;
                rem -= len;
            }
            
            next = line + 1;
            this.marker = null;
            
            // Attempt to merge tree with previous parse tree
            if (next >= this.mergeFrom && this.tree.merge(this.states[next])) {
                
                // Move to next invalid line
                next = this._nextUnparsedLine(next);
                if (next === -1) break;
            
            } else if (next < end) {
            
                // Save state and initialize next line for parsing
                this.states[next] = this.tree.saveState();
                this._invalidateLine(next);
            }
            
            col = 0;
            line = next;
            
            // Exit if doing a single-line parse
            if (fast) {
            
                done = false;
                break;
            }
        }
        
        rng = new TextRange(this.head.line, this.head.col, line, col);
        rng = this.textBuffer.validateRange(rng);
        rng = this.textView.unmapRange(rng, true);
        
        this.dispatchEvent({
        
            type: "parse",
            range: rng,
            async: async
        });
        
        if (done) {
        
            this.mergeFrom = this.restoreFrom;
            
        } else {
        
            // If not complete, store current position and schedule another pass
            this.head = { line: line, col: col };
            this._defer(SLEEP_MS);
        }
    },
    
    _defer: function(ms) { var __this = this; 
    
        this.timer = setTimeout((function() { "use strict"; __this._readChunk() }), ms || 0);
    },
    
    _invalidateLine: function(line) {
    
        var list = this.tokens[line];
        
        if (list)
            list.dirty = true;
    },
    
    _nextUnparsedLine: function(start) {
    
        for (var i = start, tok; i < this.tokens.length; ++i) {
        
            tok = this.tokens[i];
            
            if (!tok || tok.dirty)
                return i;
        }
        
        return -1;
    },
    
    _findToken: function(line, col) {
    
        var m = searchArray(this.tokens[line], (function(tok) { "use strict"; return col - tok.start; }));
        
        if (!m.value && m.index > 0) {
        
            if (m.index === m.array.length) {
            
                var t = m.array[m.index - 1];
                
                if (t.start + t.length > col)
                    m.index -= 1;
            
            } else {
            
                m.index -= 1;
            }
        }
        
        return m;
    },
    
    _unmapRanges: function(list) {
    
        for (var i = 0, rng; i < list.length; ++i) {
        
            rng = this.textView.unmapRange(list[i], true);
            rng.type = list[i].type;
            
            list[i] = rng;
        }
        
        return list;
    }
}});

mixin(ParseView, EventSubscriber);


exports.ParseView = ParseView;
};

__modules[34] = function(exports) {
"use strict";

var _M0 = __require(5), getKeys = _M0.getKeys, forEachKey = _M0.forEachKey, addKeys = _M0.addKeys;

// Returns true if the given value can be stored
function isStateValue(val) {

    var t = typeof(val);
    return t !== null && t !== "function" && t !== "object";
}

// Default node method implementations
var Node = {

    saveState: function() {
    
        var state = {}, node = this;
    
        forEachKey(this, function(k) {
        
            if (isStateValue(node[k]))
                state[k] = node[k];
        });
        
        return state;
    },
    
    loadState: function(state) {
    
        var node = this;
        
        forEachKey(this, function(k) {
        
            if (isStateValue(node[k]))
                node[k] = state[k];
        });
    },
    
    stateEquals: function(state) {
    
        var keys = getKeys(state), i;
        
        // States must have the same number of value keys
        if (keys.length !== keyCount(this))
            return false;
    
        // Value keys must be identically equal
        for (i = 0; i < keys.length; ++i)
            if (this[keys[i]] !== state[keys[i]])
                return false;
        
        return true;
        
        function keyCount(node) {
        
            var c = 0;
            
            forEachKey(node, function(k) { 
            
                if (isStateValue(node[k]))
                    c += 1;
            });
            
            return c;
        }
    }

};

var ParseTree = es6now.Class(null, function(__super) { return {

    constructor: function(root) {
        
        this.root = root;
        this.current = root;
        
        root.parent = null;
        root.children = [];
        
        addKeys(root, Node);
    },
    
    saveState: function() {
    
        var list = [], node;
        
        for (node = this.current; node; node = node.parent) {
        
            list.push({
            
                node: node,
                children: node.children,
                position: node.children.length,
                state: node.saveState()
                
            });
        }
        
        return list;
    },
    
    restore: function(state) {
    
        var i, s, node;
        
        for (i = 0; i < state.length; ++i) {
        
            s = state[i];
            node = s.node;
            
            node.loadState(s.state);
            
            // Remove nodes from left side of split
            node.children = node.children.slice(0, s.position);
        }
        
        this.current = state[0].node;
    },
    
    merge: function(state) {
    
        if (!state || !this.stateEquals(state))
            return false;
        
        var i, j, s, a, b, c, last;
        
        for (i = 0, a = this.current; i < state.length; ++i, a = a.parent) {
        
            s = state[i];
            b = s.node;
            
            // Insert nodes from right side of split
            for (j = s.position; j < s.children.length; ++j) {
            
                c = s.children[j];
                
                a.children.push(c);
                c.parent = a;
            }
        }
        
        // Current node is right-most non-leaf node
        a = this.root;
        
        while (true) {
        
            if (a.children.length === 0)
                break;
            
            last = a.children[a.children.length - 1];
            
            if (!last.children)
                break;
            
            a = last;
        }
        
        this.current = a;
        
        return true;
    },
    
    stateEquals: function(state) {
    
        var i = 0, node;
        
        for (node = this.current; node; node = node.parent, ++i)
            if (!state[i] || !node.stateEquals(state[i].state))
                return false;
        
        return state[i] ? false : true;
    },
    
    insertToken: function(token) {
    
        this.current.children.push(token);
        token.parent = this.current;
        token.children = null;
    },
    
    push: function(node) {
    
        this.current.children.push(node);
        
        node.parent = this.current;
        node.children = [];
        
        // Add default method implementations
        addKeys(node, Node);
        
        this.current = node;
    },
    
    pop: function() {
    
        var p = this.current.parent;
        
        if (!p)
            throw new Error("Cannot pop the root node.");
        
        return this.current = p;
    }
}});

exports.ParseTree = ParseTree;
};

__modules[35] = function(exports) {
"use strict";

var LAYERS = {
    
    document: {
        
        background: {},
        selection: {},
        text: {},
        caret: {}
    },
    
    gutter: {},
    
    frame: {
    
        surface: {}
    }
};

function createBox(parent, name) {

    var d = document.createElement("div");
    d.className = name;
    parent.appendChild(d);
    return d;
}

function build(parent, layers, map) {

    var k, box;
    
    map = map || LAYERS;
    layers = layers || {};
    
    for (k in map) {
    
        layers[k] = box = createBox(parent, k);
        
        if (map[k] && typeof map[k] === "object")
            build(box, layers, map[k]);
    }
    
    return layers;
}

exports.build = build;
};

__modules[36] = function(exports) {
"use strict";

var BASE_CLASS = "CodeArea";

var RULES = 

"." + (BASE_CLASS) + " { \n    border: solid 1px #bbb; \n    overflow: hidden; \n    font: 12px/16px 'Monaco', 'Menlo', 'Ubuntu Mono', 'Droid Sans Mono', 'Consolas', monospace; \n}\n\ndiv.frame { \n    position: absolute; \n    top: 0; \n    left: 57px; \n    right: 0; \n    height: 100%; \n    overflow: scroll; \n}\n\ndiv.document { \n    position: absolute; \n    top: 0; \n    left: 57px; \n    right: 0; \n    bottom: 0; \n    overflow: hidden; \n}\n\ndiv.surface { \n    position: absolute; \n    top: 0; \n    left: 0; \n    cursor: text; \n}\n\ndiv.caret { \n    position: absolute; \n    top: 0px; \n    left: 0px; \n    width: 2px; \n    height: 0px; \n    color: #000; \n    background-color: #000; \n}\n\ndiv.text { \n    position: absolute; \n    top: 0; \n    left: 0; \n    bottom: 0; \n    right: 0; \n    white-space: pre; \n}\n\ndiv.text div.content { \n    position: absolute; \n    top: 0; \n    left: 0; \n    padding-left: 8px; \n}\n\ndiv.selection { \n    position: absolute; \n    top: 0; \n    left: 0; \n}\n\ndiv.gutter { \n    position: absolute; \n    top: 0; \n    left: 0; \n    bottom: 0; \n    width: 56px; \n    overflow: hidden; \n    text-align: right; \n    border-right: solid 1px #bbb; \n    color: gray; \n    font: 10px/16px Helvetica, sans-serif; \n    text-shadow: 1px 1px rgba(255, 255, 255, .8); \n    box-shadow: 0 -3px 6px rgba(0, 0, 0, .5); \n    background-color: #f0f0f0; \n    background-image: -webkit-linear-gradient(top, #f5f5f5, #ddd);  \n    background-image: -moz-linear-gradient(top, #f5f5f5, #ddd); \n    background-image: -ms-linear-gradient(top, #f5f5f5, #ddd); \n    background-image: linear-gradient(to bottom, #f5f5f5, #ddd); \n}\n\ndiv.line-number { \n    padding-right: 3px; \n    width: 50px; \n    cursor: default; \n    overflow: hidden; \n}\n\ndiv.line-number:hover { \n    color: #000; \n}\n\ndiv.line { }\n\ndiv.selection div.current-line { display: none; }\n\ndiv.selection div { background-color: #BFD8FA; }\n\ndiv.highlight { background-color: #e7eadc; }\n\nspan.eol { display: none; }\n\nspan.error { color: red; }\n\nspan.keyword { color: #0000CC; }\n\nspan.null { color: #0000CC; }\n\nspan.boolean { color: #0000CC; }\n\nspan.string { color: #FF3399; }\n\nspan.member { color: #000080; }\n\nspan.comment { color: #007400; }\n\nspan.regex { color: #990066; }\n\nspan.number { color: #336699; }\n\nspan.tag { color: #0000CC; }\n\nspan.attribute { color: #990066; }\n\nspan.property { color: #1180B7; }\n\nspan.tab { }\n\nspan.fold-glyph { \n    border: solid 1px #999; \n}";

var RULE_LIST = RULES.split(/\n\n+/g).map((function(rule) { "use strict";

    if (rule.charAt(0) !== ".")
        rule = "." + BASE_CLASS + " " + rule;
    
    return rule;
}));

var inserted = false;

// Adds default stylesheet rules to the document
function insertStylesheet(elem) {

    if (inserted)
        return;
    
    inserted = true;
    
    setClass(elem, BASE_CLASS, true);
    
    var d = document,
        h = d.documentElement.firstChild,
        s = d.createElement("style"),
        i;

    h.insertBefore(s, h.firstChild);
    
    if (!s.sheet)
        return IE8_insertRules(s);
    
    for (s = s.sheet, i = 0; i < RULE_LIST.length; ++i)
        s.insertRule(RULE_LIST[i], s.cssRules.length);
}

// [IE8] Uses legacy stylesheet API
function IE8_insertRules(elem) {

    var sheets = document.styleSheets, 
        css = RULE_LIST.join("\n\n"),
        s, 
        i;
    
    // Find element in styleSheets collection
    for (i = 0; i < sheets.length; ++i) {
    
        s = sheets[i];
        
        if (s.owningElement === elem) {
        
            s.cssText = css;
            break;
        }
    }
}

// Adds or removes a CSS class name from an element
function setClass(elem, name, on) {

    var c = " " + elem.className + " ",
        i = c.indexOf(" " + name + " ");
    
    if (i >= 0) {
    
        if (!on) {
        
            c = c.slice(0, i) + c.slice(i + name.length + 1);
            c = c.replace(/^\s+|\s+$/, "");
        
            elem.className = c;
        }
    
    } else if (on) {
    
        elem.className = (c.length > 2 ? c.slice(1) : "") + name;
    }
}


exports.insertStylesheet = insertStylesheet;
exports.setClass = setClass;
};

__require(0, exports);


}, []);