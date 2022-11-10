/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework
{
     /**
     * @public  
     * @language zh_CN
     * @classdesc
     * 矩形 2d刚体
     * @version m4m 1.0
     */
    @reflect.node2DComponent
    @reflect.node2DPhysicsBody
    export class rectBody2d extends physics2DBody
    {
        static readonly ClassName:string="rectBody2d";
        transform: transform2D;

        start() {
            this.options.angle = this.transform.localRotate;
            let body = this.physicsEngine.createRectByPBody(this);
            this.physicsEngine.addBody(this);
            super.start();
        }
        onPlay(){

        }
    }
}