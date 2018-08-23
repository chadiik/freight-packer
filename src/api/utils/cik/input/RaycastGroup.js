
/**
 * RaycastCallback
 * 
 * @callback RaycastCallback
 * @param {Object} obj
 * @param {THREE.Intersection} intersection
 */

 /**
  * Mapping function
  * 
  * @callback RaycastMapping
  * @param {Object} obj
  */

class RaycastGroup {

    /**
     * 
     * @param {Array<THREE.Object3D>} items 
     * @param {RaycastCallback} callback 
     * @param {RaycastMapping} collectionQuery 
     * @param {Boolean} updateProperty 
     * @param {Boolean} recursive 
     */
    constructor (items, callback, collectionQuery, updateProperty, recursive){
        /**
         * @type {Boolean}
         */
        this.enabled = true;

        this.items = items;
        this.callback = callback;
        this.updateProperty = updateProperty !== undefined ? updateProperty : false;
        this.recursive = recursive !== undefined ? recursive : false;

        if(collectionQuery === undefined){
            this.raycastItems = this.items;
        }
        else{
            this.raycastItems = [];
            this.collectionQuery = collectionQuery;
            this.GetRaycastItems(this.collectionQuery);
        }
    }

    GetRaycastItems(collectionQuery){
        for(var iItem = 0; iItem < this.items.length; iItem++){
            var rItem = collectionQuery(this.items[iItem]);
            if(rItem !== undefined){
                this.raycastItems.push(rItem);
            }
            else{
                this.items.splice(iItem, 1);
                Cik.Log('raycastItem is undefined, entry removed from .items array');
            }
        }
    }

    UpdateItems(items, collectionQuery){
        this.items = items;
        if(collectionQuery === undefined) collectionQuery = this.collectionQuery;

        if(collectionQuery === undefined){
            this.raycastItems = this.items;
        }
        else{
            this.raycastItems.length = 0;
            this.collectionQuery = collectionQuery;
            this.GetRaycastItems(this.collectionQuery);
        }
    }

    UpdateRaycastItems(){
        this.raycastItems.length = 0;
        for(var i = 0; i < this.items.length; i++){
            let raycastItem = this.collectionQuery(this.items[i]);
            if(raycastItem) this.raycastItems.push(raycastItem);
        }
    }

    Raycast(raycaster){
        if(this.enabled === false) return;

        
        if(this.updateProperty){
            this.UpdateRaycastItems();
        }
        
        var raycastItems = this.raycastItems;
        
        // if ( object.visible === false || object.parent === null) return; in THREE.Raycaster.intersectObject()
        var intersects = raycaster.intersectObjects(raycastItems, this.recursive);
        if (intersects.length > 0) {
            if(this.collectionQuery){
                var raycastItemIndex = this.BubbleUpForIndex(intersects[0].object, raycastItems);
                if(raycastItemIndex !== -1) this.callback(this.items[raycastItemIndex], intersects[0]);
            }
            else{
                this.callback(intersects[0].object, intersects[0]);
            }
        }
    }

    BubbleUpForIndex(child, collection){
        var nestLimit = 100;
        var numCollection = collection.length;
        while(child !== null && nestLimit-- > 0){
            for(var i = 0; i < numCollection; i++) if(collection[i] === child) return i;
            child = child.parent;
        }
        return -1;
    }
}

export default RaycastGroup;