
require('../../min-dependencies/lib/three/utils/BufferGeometryUtils')

const radToDeg = 180.0 / Math.PI;
var vertexHash, pendingRecursive = 0;
var result;

class SurfaceUtils {

    /**
     * 
     * @param {THREE.Object3D} object 
     * @returns {THREE.BufferGeometry}
     */
    static MergeObject(object){
        var geometries = [];
        
        object.updateMatrixWorld(true);
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                var bg = child.geometry;
                bg.applyMatrix(child.matrixWorld);
                if(bg.isBufferGeometry === false) bg = new THREE.BufferGeometry().fromGeometry(bg);
                geometries.push(bg); 
            }
        });

        if(geometries.length === 1)
            return geometries[0];
        
        return SurfaceUtils.MergeBufferGeometries(geometries);
    }

    /**
     * 
     * @param {THREE.Object3D} object 
     */
    static BakeObject(object){
        object.updateMatrixWorld(true);
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                var bg = child.geometry;
                bg.applyMatrix(child.matrixWorld);
            }
        });
    }

    /**
     * 
     * @param {Array<THREE.BufferGeometry>} geometries 
     * @returns {THREE.BufferGeometry}
     */
    static MergeBufferGeometries(geometries){
        var bg = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
        return bg;
    }

    static CreateVertexHash(geometry){
        var vertexHash = [];
        var faces = geometry.faces;
        var vLen = geometry.vertices.length;
        for(var i = 0; i < vLen; i++){
            vertexHash[i] = [];
            for(var f in faces){
               if(faces[f].a == i || faces[f].b == i || faces[f].c == i){
                    vertexHash[i].push(faces[f]);
                }
            }
        }
        return vertexHash;
    }

    static GetCoplanar(maxAngle, geometry, face, clamp, out, originFace){
        // Original by (https://stackoverflow.com/users/3311552/radio): http://jsfiddle.net/ta0g3mLc/10/

        if(clamp === undefined) clamp = true;
        if(originFace === undefined) originFace = face;
        
        result = out;
        if(out === undefined) result = { count:0 };

        if(vertexHash === undefined){
            if(geometry instanceof Array) vertexHash = geometry;
            else vertexHash = SurfaceUtils.CreateVertexHash(geometry);
        }

        pendingRecursive++;

        var vertices = ['a', 'b', 'c'];
        for(var v in vertices){
            
            var vertexIndex = face[vertices[v]];
            var adjacentFaces = vertexHash[vertexIndex];

            for(var a in adjacentFaces){
                var newface = adjacentFaces[a];
                var testFace = originFace;
                if(clamp == false) testFace = face;

                if(testFace.normal.angleTo(newface.normal) * radToDeg <= maxAngle){
                    var key = newface.a + ',' + newface.b + ',' + newface.c;
                    if(result[key] === undefined){
                        result[key] = newface;
                        result.count++;
                        SurfaceUtils.GetCoplanar(maxAngle, geometry, newface, clamp, result, originFace);
                    }
                }
            }
        }

        pendingRecursive--;
      
        if(pendingRecursive === 0){
            // reset
            vertexHash = undefined;
            pendingRecursive = 0;

            // output
            delete result.count;
            return result;
        }
    }

    static FromVertices(vertices){
        var geometry = new THREE.Geometry();
        geometry.vertices = vertices;

        for(var f = 0, numFaces = vertices.length / 3; f < numFaces; f++){
            var v = f * 3;
            geometry.faces.push(new THREE.Face3(v, v + 1, v + 2));
        }
        
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeBoundingSphere();
        return geometry;
    }

    /**
     * 
     * @param {THREE.Geometry} geometry 
     * @param {THREE.Vector3} [normal]
     */
    static Normal(geometry, normal){
        normal = normal || new THREE.Vector3();
        for(var f in geometry.faces){
            var n = geometry.faces[f].normal;
            normal.add(n);
        }
        normal.normalize();
        return normal;
    }

    static Add(vertices, vector){
        var numVertices = vertices.length;
        for(var v = 0; v < numVertices; v++){
            vertices[v].add(vector);
        }

        return vertices;
    }

    static Clone(source){
        if(source instanceof Array){
            let length = source.length;
            if(length === 0) return [];
            if(source[0] instanceof THREE.Vector3){
                let result = [];
                for(let v = 0; v < length; v++){
                    result[v] = source[v].clone();
                }
                return result;
            }
        }
    }
    
}

export default SurfaceUtils;