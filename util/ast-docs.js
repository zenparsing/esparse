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
        props,
        item;

    text.match(/\n[ \t]+[A-Z]\w*(?:\([^)]*\))(?=[ ]*\{)|\n[ \t]+this\.[^\n]*/g).forEach(function(value) {

        value = value.trim();
    
        if (value.slice(0, 5) === "this.") {
    
            var match = value.match(/^this\.(\w+)[^;]*;\s*(?:\/\/\s*(\(\S+?\)|\[\S+?\])?\s*([^\n]+)?)?/),
                key = match[1],
                type = match[2] || "",
                desc = match[3] || "";
        
            if (!props)
                throw new Error("Oops - a property assign came before a type name!");
        
            switch (key) {
            
                case "type":
                case "start":
                case "end":
                    break;
                
                default:
                    props.push(new Property(key, type, desc));
            }
    
        } else {
    
            var name = value.slice(0, value.indexOf("("));
            
            item = { 
            
                name: name, 
                signature: value,
                properties: props = []
            };
            
            if (name !== "Node")
                names.push(item);
        }
    
    });
    
    names.sort(function(a, b) {
    
        return a.name.localeCompare(b.name);
    });
    
    names.forEach(function(item) {
    
        var props = item.properties;
        
        props.push(startProperty);
        props.push(endProperty);
    });
    
    names.unshift({ 
    
        name: "Node", 
        
        signature: "Node(type, start, end)",
        
        properties: [
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

function generateHTML(names) {

    var writer = new HtmlWriter(4);
    
    writer
    
    .write("<div>")
    .write("<ul>")
    .indent()
    
    .forEach(names, function(type) {
    
        writer.write(
            "<li><a href='#AST-" + writer.escape(type.name) + "'>" +  
            writer.escape(type.name) +
            "</a></li>");
    })
    
    .dedent()
    .write("</ul>")
    .write("</div>");
    
    names.forEach(function(type) {
    
        var props = type.properties;
        
        writer
        
        .write("<div>")
        .indent()
        
        .write(
            "<h3 id='AST-" + writer.escape(type.name) + "'>" + 
            writer.escape(type.signature) + 
            "</h3>")
        
        .write("<dl>")
        .indent()
        
        .forEach(props, function(param) {
        
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

function updateDocs(html) {

    var path = abs("ast-api.html");
    FS.writeFileSync(path, html, { encoding: "utf8" });
}

updateDocs(generateHTML(parseTypes()));
