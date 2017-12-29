namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * UI画布容器组件
     * @version egret-gd3d 1.0
     */
    @reflect.nodeComponent
    export class canvascontainer implements INodeComponent
    {
        constructor(){
            
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version egret-gd3d 1.0
         */
        gameObject: gameObject;
        
        private _canvas:canvas;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * UI canvas 
         * @version egret-gd3d 1.0
         */
        @reflect.Field("reference")
        get canvas(){
            return this._canvas;
        }
        set canvas(canv:canvas){
            this._canvas = canv;
            this.canvasInit();
        }
        private isCanvasinit = false;
        private canvasInit(){
            if(!this.gameObject || !this.gameObject.transform || !this.gameObject.transform.scene) return; 
            this._canvas.scene = this.gameObject.transform.scene;
            this._canvas.assetmgr = this._canvas.scene.app.getAssetMgr();
            this.isCanvasinit = true;
        }

        @reflect.Field("number")
        private _renderMode:canvasRenderMode = canvasRenderMode.ScreenSpaceOverlay;

        start()
        {

        }
        update(delta: number)
        {   
            if(!this.isCanvasinit) this.canvasInit();

        }
        /**
         * @private
         */
        remove()
        {
            
        }
        /**
         * @private
         */
        clone()
        {

        }
    }
    
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * UI画布容器RenderMode
     * @version egret-gd3d 1.0
     */
    export enum canvasRenderMode{
        ScreenSpaceOverlay,
        ScreenSpaceCamera,
        WorldSpace
    }

}