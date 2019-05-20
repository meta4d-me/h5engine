/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * 圆形 刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class circleBody2d extends physics2DBody 
    {
        static readonly ClassName:string="circleBody2d";

        transform: transform2D;
        @reflect.Field("number")
        radius:number=1;
        @reflect.Field("number")
        maxSides : number = 25;

        start() {
            let data = this.options || {};
            let body = this.physicsEngine.createCircleBodyByInitData(this,this.radius,this.maxSides);
            this.physicsEngine.addBody(this);
            if(this.onInit) this.onInit(this);
        }
        onPlay(){

        }

    }
}