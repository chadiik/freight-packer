
/** @param {*} obj @param {string} key */
function getKey(obj, key){
    return key.split('.').reduce(function(a, b){
        return a && a[b];
    }, obj);
}

/** @param {*} obj @param {string} key */
function setKey(obj, key, val){
    key = key.split('.');
    while (key.length > 1) obj = obj[key.shift()];
    let endKey = key.shift();
    obj[endKey] = val;
    return obj[endKey];
}

const typeofNumber = 'number';

class NaNRecovery{
    /**
     * Properties that needs to be considered
     * @param {*} root
     * @param  {...string} keys 
     */
    constructor(root, ...keys){
        this.root = root;
        /** @type {Map<string, Number>} */
        this.properties = new Map();
        this.Watch(...keys);
    }

    /**
     * Properties that needs to be considered
     * @param  {...string} keys 
     */
    Watch(...keys){
        if(keys !== undefined && keys.length > 0){
            keys.forEach(key => {
                let value = getKey(this.root, key);
                this.properties.set(key, value);
            });
        }
    }

    /**
     * Checks the current values, recover any NaN (or typeof != number), otherwise update the stored number
     */
    AssertUpdateRecover(){
        let neededRecovery = false;
        let keys = this.properties.keys();
        for(let key of keys){
            // get the current value
            let value = getKey(this.root, key);
            // recover if not a number
            if(isNaN(value) || (typeof value !== typeofNumber)){
                neededRecovery = true;
                value = this.properties.get(key);
            }
            // update
            this.properties.set(key, value);
            setKey(this.root, key, value);
        };

        return neededRecovery;
    }
}

export default NaNRecovery;