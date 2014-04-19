var Path = require("path"),
    FS = require("fs");

function abs(path) { return Path.resolve(__dirname, path); }

function dict() { return Object.create(null); }

function Property(name, type, description) {
    
    this.name = name;
    this.type = type || "(Node)";
    this.description = description;
}

var startProperty = new Property("start", "(number)", "The starting position of the node within the input string"),
    endProperty = new Property("end", "(number)", "The ending position of the node within the input string");

function parseTypes() {

    var text = FS.readFileSync(abs("../src/AST.js"), "utf8"),
        names = [],
        params,
        item;

    text.match(/\n[ \t]+[A-Z]\w*(?=\([^)]*\)[ ]*\{)|\n[ \t]+this\.[^\n]*/g).forEach(function(value) {

        value = value.trim();
    
        if (value.slice(0, 5) === "this.") {
    
            var match = value.match(/^this\.(\w+)[^;]*;\s*(?:\/\/\s*(\(\S+?\)|\[\S+?\])?\s*([^\n]+)?)?/),
                key = match[1],
                type = match[2] || "",
                desc = match[3] || "";
        
            if (!params)
                throw new Error("Oops - a property assign came before a type name!");
        
            switch (key) {
            
                case "type":
                case "start":
                case "end":
                    break;
                
                default:
                    params.push(new Property(key, type, desc));
            }
    
        } else {
    
            item = { name: value, parameters: params = [] };
            
            if (value !== "Node")
                names.push(item);
        }
    
    });
    
    names.sort(function(a, b) {
    
        return a.name.localeCompare(b.name);
    });
    
    names.forEach(function(item) {
    
        var params = item.parameters;
        
        params.push(startProperty);
        params.push(endProperty);
    });
    
    names.unshift({ 
    
        name: "Node", 
        
        parameters: [
            new Property("type", "(string)", "The node type"),
            startProperty,
            endProperty,
            new Property("children()", "(array)", "Returns an array of child nodes")
        ]
        
    });
    
    return names;
}

function htmlText(text) {

    return text.replace(/[<>&'"]/g, function(chr) {
    
        switch (chr) {
        
            case "<": return "&lt;";
            case ">": return "&gt;";
            case '"': return "&quot;";
            case "&": return "&amp;";
            default:  return "&#x" + chr.charCodeAt(0).toString(16) + ";";
        }
    });
}

function HtmlWriter(indentSize) {

    var indentUnit = new Array((indentSize || 4) + 1).join(" "),
        indent = "",
        lines = [],
        me = this;
        
    this.write = function(txt) {
    
        lines.push(indent + txt);
        return me;
    };
    
    this.toString = function() {
    
        return lines.join("\n");
    };
    
    this.indent = function() {
    
        indent += indentUnit;
        return me;
    };
    
    this.dedent = function() {
    
        indent = indent.slice(0, -1 * indentUnit.length);
        return me;
    };
    
    this.forEach = function(array, fn) {
    
        array.forEach(fn);
        return me;
    };
    
    this.escape = htmlText;
}

function generateHTML(names, headerLevel) {

    headerLevel = String(headerLevel || 2);
    
    var writer = new HtmlWriter(4);
    
    names.forEach(function(type) {
    
        var params = type.parameters;
        
        writer
        
        .write("<div class='ast-node'>")
        .indent()
        
        .write(
            "<h" + headerLevel + ">" +
            writer.escape(type.name) + "(" +
                params.map(function(item) { return writer.escape(item.name) }).join(", ") +
            ")" +
            "</h" + headerLevel + ">"
        )
        
        .write("<dl>")
        .indent()
        
        .forEach(params, function(param) {
        
            if (type.name !== "Node" && (param.name === "start" || param.name === "end"))
                return;
            
            writer
            
            .write("<dt>" + writer.escape(param.name) + "</dt>")
            
            .write("<dd>" +
                "<em>" + 
                writer.escape(param.type.replace(/\|/g, " | ")) + 
                "</em> " + 
                writer.escape(param.description) +
            "</dd>");
        })
        
        .dedent()
        .write("</dl>")
        
        .dedent()
        .write("</div>");
    
    });
    
    return String(writer);
}

FS.writeFileSync(abs("ast-nodes.html"), generateHTML(parseTypes(), 3), { encoding: "utf8" });
