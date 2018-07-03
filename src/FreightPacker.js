//const THREE = require('./lib/three-91');

class FreightPacker {
  constructor() {
    
  }

  Init(){
    console.log('Freight Packer v0.1');
    var p = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    console.log('THREE:', p);
  }
}
export default FreightPacker;
