
export class IntMap {

    constructor() {
    
        this.obj = Object.create(null);
    }
    
    get(key) {
    
        return this.obj[key] | 0;
    }
    
    set(key, val) {
    
        return this.obj[key] = val | 0;
    }
    
}
