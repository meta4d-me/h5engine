/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public  
     * @language zh_CN
     * @classdesc
     * 多面凸包 刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class convexHullBody2d extends bassBody implements I2DComponent
    {
        static readonly ClassName:string="convexHullBody2d";
        vertexSets: math.vector2[] = [];
        options: IBodyData;
        flagInternal : boolean = false;
        removeCollinear : number = 0.01;
        minimumArea : number = 10;

        transform: transform2D;
        start() {
            let data = this.options || {};
            let pos = this.transform.localTranslate;
            this.body=this._physicsEngine.ConvexHullBodyByInitData(pos.x,pos.y,this.vertexSets,data,this.flagInternal,this.removeCollinear,this.minimumArea);
            //this.body=physic2D.creatRectBody(this.transform.localTranslate.x,this.transform.localTranslate.y,this.transform.width,this.transform.height,this.beStatic);
        }
        onPlay(){

        }
    }
}