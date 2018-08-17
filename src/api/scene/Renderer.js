import Utils from "../utils/cik/Utils";

/**
 * @typedef RendererParams
 * @property {Boolean} antialias
 * @property {Boolean} shadows
 * @property {Boolean} shadowsAutoUpdate
 * @property {Number} clearColor - hex color 0xff7f00
 * @property {Number} renderSizeMul
 * @property {Boolean} composer
 */

/** @type {RendererParams} */
const defaultParams = {
    antialias: true,
    shadows: true,
    shadowMapType: THREE.PCFSoftShadowMap,
    shadowsAutoUpdate: true,
    clearColor: 0xcfcfcf,
    renderSizeMul: 1,
    composer: false
};

class Renderer {
    /**
     * @param {RendererParams} params 
     */
    constructor(params) {

        this.params = Utils.AssignUndefined(params, defaultParams);
        this.renderer = new THREE.WebGLRenderer({antialias: this.params.antialias});

        this.renderer.shadowMap.enabled = this.params.shadows;
        this.renderer.shadowMap.type = this.params.shadowMapType;
        this.renderer.shadowMap.autoUpdate = this.params.shadowsAutoUpdate;

        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.toneMapping = THREE.Uncharted2ToneMapping;
        this.renderer.toneMappingExposure = 1.4;
        //this.renderer.toneMappingExposure = ;
        
        this.maxTextureSize = this.renderer.context.getParameter(this.renderer.context.MAX_TEXTURE_SIZE);
        this.pixelRatio = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.params.clearColor), 1);

        this.ResizeRenderer = function(screen){
            var newWidth = screen.width * this.params.renderSizeMul;
            var newHeight = screen.height * this.params.renderSizeMul;
            this.renderer.setSize(newWidth, newHeight);
        };

        this.Render = function(scene, camera){
            this.renderer.render(scene, camera);
        };
        
        this.UpdateShadowMaps = function(){
            this.renderer.shadowMap.needsUpdate = true;
        };

        this.ResizeDomElement = function(screen){
            this.renderer.domElement.style.width = Math.floor(screen.width) + 'px';
            this.renderer.domElement.style.height = Math.floor(screen.height) + 'px';
        };

        this.AdjustCamera = function(screen, camera){
            camera.aspect = screen.width / screen.height;
            camera.updateProjectionMatrix();
        };

        this.ReconfigureViewport = function(screen, camera){
            this.AdjustCamera(screen, camera);

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