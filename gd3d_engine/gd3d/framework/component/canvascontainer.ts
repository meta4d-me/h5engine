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

        //渲染排序
        get sortOrder(){
            return this._canvas && this._canvas.overlay2d ? this._canvas.overlay2d.sortOrder: 0;         
        }
        set sortOrder(order:number){
            if(this._canvas && this._canvas.overlay2d)
                this._canvas.overlay2d.sortOrder = order;
        }

        private isCanvasinit = false;
        private canvasInit(){
            if(!this.gameObject || !this.gameObject.transform || !this.gameObject.transform.scene) return; 
            this._canvas.scene = this.gameObject.transform.scene;
            this._canvas.assetmgr = this._canvas.scene.app.getAssetMgr();
            this.isCanvasinit = true;
        }

        private _lastMode:canvasRenderMode = canvasRenderMode.ScreenSpaceOverlay;
        private _renderMode:canvasRenderMode = canvasRenderMode.ScreenSpaceOverlay;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * renderMode UI render模式
         * @version egret-gd3d 1.0
         */
        @reflect.Field("number")
        get renderMode(){return this._renderMode;}
        set renderMode(mode:canvasRenderMode){ 
            if(this._renderMode == mode) return;
            this._lastMode = this._renderMode;
            this._renderMode = mode;
            this.styleToMode();
        }

        private styleToMode(){
            switch(this._renderMode){
                case canvasRenderMode.ScreenSpaceOverlay:
                    if(!this._canvas || !this._canvas.overlay2d) return;
                    let scene =this.gameObject.getScene();
                    scene.addScreenSpaceOverlay(this._canvas.overlay2d);
                break;
            }

        }

        start()
        {
            this.styleToMode();
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