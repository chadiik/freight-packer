
class Capabilities {
    constructor() {
      
    }
  
    static IsWebGLReady(){
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl && gl instanceof WebGLRenderingContext;
    }
}

export default Capabilities;
  