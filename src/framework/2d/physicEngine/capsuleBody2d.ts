/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework
{
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * 胶囊体 2d刚体 （图形的朝向会根据 transform 的宽和高来适配）
     * @version m4m 1.0
     */
    @reflect.node2DComponent
    @reflect.node2DPhysicsBody
    export class capsuleBody2d extends physics2DBody 
    {
        static readonly ClassName:string="capsuleBody2d";
        
        transform: transform2D;
        /** 胶囊体朝向为 Y 轴 */
        get y_Axis (){return this.transform.height > this.transform.width ;};
        @reflect.Field("number")
        maxSides : number = 25;

        start() {
            this.options.angle = this.transform.localRotate;
            let body = this.physicsEngine.createCapsuleByPBody(this,this.maxSides);
            this.physicsEngine.addBody(this);

            super.start();
        }
        onPlay(){

        }

    }
}