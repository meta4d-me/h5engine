/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public  
     * @language zh_CN
     * @classdesc
     * 多面凸包 2d刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    @reflect.node2DPhysicsBody
    export class convexHullBody2d extends physics2DBody
    {
        static readonly ClassName:string="convexHullBody2d";
        @reflect.Field("vector2[]")
        vertexSets: math.vector2[] = [];
        @reflect.Field("boolean")
        flagInternal : boolean = false;
        @reflect.Field("number")
        removeCollinear : number = 0.01;
        @reflect.Field("number")
        minimumArea : number = 10;

        transform: transform2D;
        start() {
            let data = this.options || {};
            let pos = this.transform.localTranslate;
            let body = this.physicsEngine.ConvexHullByPBody(this,this.vertexSets,this.flagInternal,this.removeCollinear,this.minimumArea);
            //this.body=physic2D.creatRectBody(this.transform.localTranslate.x,this.transform.localTranslate.y,this.transform.width,this.transform.height,this.beStatic);
            
            this.fixCenter();
            this.physicsEngine.addBody(this);
            if(this.onInit) this.onInit(this);
        }

        //校准 重心 初始位置
        private fixCenter(){
            let max = this.body.bounds.max;
            let min = this.body.bounds.min;
            let center = poolv2();
            this.calceBoundingCenter(max,min,center);
            let offset = poolv2();
            math.vec2Subtract(this.transform.localTranslate,center,offset);
            let newpos = offset;
            math.vec2Add(this.transform.localTranslate,offset,newpos);
            this.setPosition(newpos);
            this.transform.markDirty();
            poolv2_del(center);
            poolv2_del(offset);
        }

        private calceBoundingCenter(max:{x:number,y:number},min:{x:number,y:number},center:math.vector2){
            center.x = (max.x + min.x)/2;
            center.y = (max.y + min.y)/2;
        }

        onPlay(){

        }
    }
}