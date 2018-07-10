
class Renderer {
    constructor(params) {

        this.params = params;
        this.renderer = new THREE.WebGLRenderer({antialias: this.params.antialias});

        if(this.params.shadows){
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMap.autoUpdate = false;
        }

        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        //this.renderer.toneMappingExposure = ;
        
        this.maxTextureSize = this.renderer.context.getParameter(this.renderer.context.MAX_TEXTURE_SIZE);
        this.pixelRatio = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.params.clearColor), 1);

        this.UseCamera = function(camera){
            this.camera = camera;
        };

        this.ResizeRenderer = function(screen){
            var newWidth = screen.width * this.params.renderSizeMul;
            var newHeight = screen.height * this.params.renderSizeMul;
            this.renderer.setSize(newWidth, newHeight);
        };

        this.Render = function(scene){
            this.renderer.render(scene, this.camera);
        };
        
        this.UpdateShadowMaps = function(){
            this.renderer.shadowMap.needsUpdate = true;
        };

        this.ResizeDomElement = function(screen){
            this.renderer.domElement.style.width = screen.width + 'px';
            this.renderer.domElement.style.height = screen.height + 'px';
        };

        this.ReconfigureViewport = function(screen){
            this.camera.aspect = screen.width / screen.height;
            this.camera.updateProjectionMatrix();

            this.ResizeRenderer(screen);
            this.ResizeDomElement(screen);
        };

        if(this.params.composer){
            Renderer.UseComposer(this);
        }
    }

    Dispose(){
        this.renderer.dispose();
    }

    static UseComposer (sceneRenderer){
        sceneRenderer.composer = new THREE.EffectComposer(sceneRenderer.renderer);
        sceneRenderer.renderPass = new THREE.RenderPass(undefined, undefined);
        sceneRenderer.renderPass.renderToScreen = true;
        sceneRenderer.composer.addPass(sceneRenderer.renderPass);
        sceneRenderer.renderPasses = [sceneRenderer.renderPass];

        sceneRenderer.UseCamera = function(camera){
            sceneRenderer.camera = camera;
            sceneRenderer.renderPass.camera = camera;
        };

        sceneRenderer.ResizeRenderer = function(screen){
            var newWidth = screen.width * sceneRenderer.params.renderSizeMul;
            var newHeight = screen.height * sceneRenderer.params.renderSizeMul;
            sceneRenderer.renderer.setSize(newWidth, newHeight);

            newWidth  = Math.floor( newWidth / sceneRenderer.pixelRatio ) || 1;
			newHeight = Math.floor( newWidth / sceneRenderer.pixelRatio ) || 1;
			sceneRenderer.composer.setSize( newWidth, newHeight );
        };

        sceneRenderer.Render = function(scene){
            sceneRenderer.renderPass.scene = scene;
            sceneRenderer.composer.render();
        };
    }
}

export default Renderer;