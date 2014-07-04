/*

NOTE:  We are using an O(n) list-based search algorithm, because for our purposes
it is much faster than using an object-as-dictionary.  Object properties can be
read very fast, but creating new properties tends to be sluggish (v8 2014-05).  As 
v8 progresses, we may want to see if using the built-in Map class is faster.

*/

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

