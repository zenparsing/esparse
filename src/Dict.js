
export class IntMap {

    constructor() { this.obj = {} }
    get(key) { return this.obj["$" + key] | 0 }
    set(key, val) { this.obj["$" + key] = val | 0 }

}

export class Dict {

    constructor() { this.obj = {} }
    get(key) { return this.obj["$" + key] }
    set(key, val) { this.obj["$" + key] = val }
    has(key) { return this.obj["$" + key] !== void 0 }

    forEach(fn) {

        Object.keys(this.obj).forEach(k => fn(this.obj[k], k.slice(1), this));
    }

}
