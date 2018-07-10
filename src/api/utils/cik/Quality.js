class Quality {
    constructor(callback){
        this.testCallback = callback;
    }

    Common(quality){
        //                      0       1       2       3
        var composer        = [ 0,      0,      0,      1       ];
        var antialias       = [ 0,      1,      1,      0       ];
        var shadows         = [ 0,      0,      1,      1       ];
        var renderSizeMul   = [ .5,     1,      1,      1       ];
        
        var result = {
            composer: Boolean(composer[quality]), 
            antialias: Boolean(antialias[quality]),
            shadows: Boolean(shadows[quality]),
            renderSizeMul: renderSizeMul[quality]
        };
        return result;
    }

    OnTestComplete(quality){
        var result = this.Common(quality);
        this.testCallback(result);
    }

    PerformanceTest1(){
        var quality = 2;
        // Test webgl supported shader precision, see WebGLRenderer, https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
        this.OnTestComplete(quality);
    }

}

export default Quality;