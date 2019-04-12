/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * rect 刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class circleBody extends bassBody implements I2DComponent
    {
        static readonly ClassName:string="circleBody";

        transform: transform2D;
        radius:number=1;
        maxSides : number = 25;

        start() {
            let data = this.options || {};
            this.body=this._physicsEngine.creatCircleBodyByInitData(this.transform.localTranslate.x,this.transform.localTranslate.y,this.radius,data,this.maxSides);
        }
        onPlay(){

        }

    }
}