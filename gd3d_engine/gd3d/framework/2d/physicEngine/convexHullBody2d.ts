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
            this._physicsEngine.ConvexHullBodyByInitData(this,this.vertexSets,this.flagInternal,this.removeCollinear,this.minimumArea);
            //this.body=physic2D.creatRectBody(this.transform.localTranslate.x,this.transform.localTranslate.y,this.transform.width,this.transform.height,this.beStatic);
            
            //校准 重心 初始位置
            let max = this.body.bounds.max;
            let min = this.body.bounds.min;
            let center = poolv2();
            this.calceBoundingCenter(max,min,center);
            let offset  = center;
            math.vec2ScaleByNum(center,-1,offset);
            let newPos = offset;
            math.vec2Add(this.transform.localTranslate,offset,newPos);
            this.setPosition(newPos);
            this.transform.markDirty();
            poolv2_del(center);
        }

        private calceBoundingCenter(max:{x:number,y:number},min:{x:number,y:number},center:math.vector2){
            center.x = (max.x + min.x)/2;
            center.y = (max.y + min.y)/2;
        }

        onPlay(){

        }
    }
}