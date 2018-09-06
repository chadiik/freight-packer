
require('../../min-dependencies/lib/three/utils/BufferGeometryUtils');

function extractBGGroup(geometry, group){
    var g = new THREE.BufferGeometry();

    var position = new Float32Array(group.count * 3);
    var normal = new Float32Array(group.count * 3);
    var uv = new Float32Array(group.count * 2);

    var pArray = geometry.attributes.position.array;
    var nArray = geometry.attributes.normal.array;
    var uArray = geometry.attributes.uv.array;

    for(var i = 0; i < group.count; i++){
        var i3 = i * 3;
        var i3Array = group.start * 3 + i3;
        
        position[i3] = pArray[i3Array];
        position[i3 + 1] = pArray[i3Array + 1];
        position[i3 + 2] = pArray[i3Array + 2];

        normal[i3] = nArray[i3Array];
        normal[i3 + 1] = nArray[i3Array + 1];
        normal[i3 + 2] = nArray[i3Array + 2];

        var i2 = i * 2;
        var i2Array = group.start * 2 + i2;
        uv[i2] = uArray[i2Array];
        uv[i2 + 1] = uArray[i2Array + 1];
    }

    g.addAttribute('position', new THREE.BufferAttribute(position, 3));
    g.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
    g.addAttribute('uv', new THREE.BufferAttribute(uv, 2));

    return g;
}

class OptimizedMultiMat {
    /**
     * 
     * @param {THREE.Object3D} source 
     */
    constructor(source){

        this.obj = new THREE.Object3D(); // optimized object3D
        this.materialsMap = {};

        this.creationLog = {
            originalCallsNum: 0,
            newCallsNum: 0
        };

        var scope = this;
        if(source){
            source.updateMatrixWorld(true);
            source.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    let mesh = child.clone();
                    mesh.geometry = mesh.geometry.clone().applyMatrix(child.matrixWorld);
                    mesh.position.set(0, 0, 0);
                    mesh.rotation.set(0, 0, 0);
                    mesh.scale.set(1, 1, 1);

                    scope.AppendMesh(mesh);
                    
                }
            });
        }
    }

    /**
     * @param {THREE.Mesh} mesh 
     */
    AppendMesh(mesh){

        var geometry = mesh.geometry;
        var numGroups = geometry.groups.length;
        
        if(numGroups === 0){
            var materialUUID = mesh.material.uuid + Object.keys(geometry.attributes).length;
            if(this.materialsMap[materialUUID] === undefined){
                
                this.creationLog.newCallsNum++;
                this.creationLog.originalCallsNum++;

                this.materialsMap[materialUUID] = mesh;
                this.obj.add(mesh);
            }
            else{

                this.creationLog.originalCallsNum++;

                var merge = [this.materialsMap[materialUUID].geometry, mesh.geometry];
                var mergeOp = THREE.BufferGeometryUtils.mergeBufferGeometries(merge);
                if(mergeOp !== null) this.materialsMap[materialUUID].geometry = mergeOp;
                else console.log('merge error:' + this.sov.ToString(), merge, mergeOp);
            }
        }
        else{
            for(var iGroup = 0; iGroup < numGroups; iGroup++){
                var group = mesh.geometry.groups[iGroup];
                var groupMaterial = mesh.material[group.materialIndex];
                var groupGeometry = extractBGGroup(mesh.geometry, group);
                var materialUUID = groupMaterial.uuid + Object.keys(groupGeometry.attributes).length;
                if(this.materialsMap[materialUUID] === undefined){

                    this.creationLog.newCallsNum++;
                    this.creationLog.originalCallsNum++;

                    var groupMesh = new THREE.Mesh(groupGeometry, groupMaterial);
                    this.materialsMap[materialUUID] = groupMesh;
                    this.obj.add(groupMesh);
                }
                else{

                    this.creationLog.originalCallsNum++;

                    var merge = [this.materialsMap[materialUUID].geometry, groupGeometry];
                    this.materialsMap[materialUUID].geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(merge);
                }
            }
        }
    }
}

export default OptimizedMultiMat;