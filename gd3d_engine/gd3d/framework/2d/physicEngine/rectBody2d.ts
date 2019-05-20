/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public  
     * @language zh_CN
     * @classdesc
     * 矩形 刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class rectBody2d extends physics2DBody
    {
        static readonly ClassName:string="rectBody2d";
        transform: transform2D;

        start() {
            let data = this.options || {};
            let body = this.physicsEngine.creatRectBodyByInitData(this);
            this.physicsEngine.addBody(this);
            if(this.onInit) this.onInit(this);
        }
        onPlay(){

        }
    }
}