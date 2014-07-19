
export class IntMap {

    constructor() {
    
        this.obj = {};
    }
    
    get(key) {
    
        return this.obj["$" + key] | 0;
    }
    
    set(key, val) {
    
        this.obj["$" + key] = val | 0;
    }
    
}

