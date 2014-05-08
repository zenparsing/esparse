/*

NOTE:  We are using an O(n) list-based search algorithm, because for our purposes
it is much faster than using an object-as-dictionary.  Object properties can be
read very fast, but creating new properties tends to be sluggish (v8 2014-05).  As 
v8 progresses, we may want to see if using the built-in Map class is faster.

*/

export class IntMap {

    constructor() {
    
        this.list = [];
    }
    
    get(key) {
    
        var i = this.searchList(key);
        return i >= 0 ? this.list[i][1] : 0;
    }
    
    set(key, val) {
    
        var i = this.searchList(key);
        
        if (i >= 0) this.list[i][1] = val;
        else this.list.push([ key, val ]);
    }
    
    searchList(key) {
    
        var list = this.list;

        for (var i = 0; i < list.length; ++i)
            if (list[i][0] === key)
                return i;
    
        return -1;
    }
    
}

