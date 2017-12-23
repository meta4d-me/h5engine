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
        }

        @reflect.Field("number")
        private _renderMode:canvasRenderMode = canvasRenderMode.ScreenSpaceOverlay;

        start()
        {

        }
        update(delta: number)
        {

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