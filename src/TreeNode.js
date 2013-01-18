
export class Identifier {

    constructor(value, context, start, end) {
    
        this.type = "Identifier";
        this.value = value;
        this.context = context;
        this.start = start;
        this.end = end;
    }
}

export class Number {

    constructor(value, start, end) {
    
        this.type = "Number";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class String {

    constructor(value, start, end) {
    
        this.type = "String";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class Template {

    constructor(value, isEnd, start, end) {
    
        this.type = "Template";
        this.value = value;
        this.templateEnd = isEnd;
        this.start = start;
        this.end = end;
    }
}

export class RegularExpression {

    constructor(value, flags, start, end) {
    
        this.type = "RegularExpression";
        this.value = value;
        this.flags = flags;
        this.start = start;
        this.end = end;
    }
}

export class Null {

    constructor(start, end) {
    
        this.type = "Null";
        this.start = start;
        this.end = end;
    }
}

export class Boolean {

    constructor(value, start, end) {
    
        this.type = "Boolean";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class ThisExpression {

    constructor(start, end) {
    
        this.type = "ThisExpression";
        this.start = start;
        this.end = end;
    }
}

export class SuperExpression {

    constructor(start, end) {
    
        this.type = "SuperExpression";
        this.start = start;
        this.end = end;
    }
}