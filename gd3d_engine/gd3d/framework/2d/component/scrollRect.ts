/// <reference path="../../../io/reflect.ts" />
namespace gd3d.framework
{
    let helpV2 = new gd3d.math.vector2();
    let helpV2_1 = new gd3d.math.vector2();
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * 矩形卷轴
     * @version egret-gd3d 1.0
     */
    @reflect.node2DComponent
    export class scrollRect implements I2DComponent
    {
        static readonly ClassName:string="scrollRect";
        
        private _content : transform2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("reference",null,"transform2D")
        get content():transform2D{
            return this._content;
        }
        set content(content:transform2D){
            this._content = content;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平滑动开启
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("boolean")
        horizontal:boolean = true;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直滑动开启
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("boolean")
        vertical:boolean = true;

        start() {

        }

        onPlay(){

        }
        
        update(delta: number) {

        }
        transform: transform2D;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean) {
            //oncap==true 是捕获阶段，一般的行为，只在pop阶段处理
            if (oncap == false)
            {
                helpV2.x = ev.x;
                helpV2.y = ev.y;
                var b = this.transform.ContainsCanvasPoint(helpV2);
                
                if (b)
                {
                    ev.eated = true;
                    if(this._content == null)return;
                    if(!this.horizontal && !this.vertical) return;

                    let temps = helpV2;
                    let tempc = helpV2_1;
                    this.transform.canvas.ModelPosToCanvasPos(temps,tempc);

                    if(this.strPoint == null) this.strPoint = new math.vector2();
                    let sp = this.strPoint;
                    if(ev.type == event.PointEventEnum.PointDown ) {
                        this.isPointDown = true;
                        sp.x = tempc.x;
                        sp.y = tempc.y;
                        if(this.strPos == null) this.strPos = new math.vector2();
                        math.vec2Clone(this._content.transform.localTranslate,this.strPos);
                    }
                    if(ev.type == event.PointEventEnum.PointHold && this.isPointDown){
                        if(this.lastPoint == null) this.lastPoint = new math.vector2();
                        let lp = this.lastPoint;
                        if(lp.x != tempc.x || lp.y != tempc.y){
                            lp.x = tempc.x; lp.y = tempc.y;
                            let addtransX = lp.x - sp.x;
                            let addtransY = lp.y - sp.y;
                            this.SlideTo(addtransX,addtransY);
                            
                        }
                    }
                }
            }
                if(ev.type == event.PointEventEnum.PointUp ) {
                    this.isPointDown = false;
                }
        }
        private isPointDown = false;
        private lastPoint : math.vector2;
        private strPoint : math.vector2;
        private strPos : math.vector2;

        private SlideTo(addtransX,addtransY){
            if(this._content == null || this.strPos == null) return;
            let ctrans =  this._content.transform;
            let cpos = ctrans.localTranslate;
            let trans = this.transform;
            math.vec2Clone(this.strPos,cpos);

            if(this.horizontal){
                cpos.x += addtransX;
                if(cpos.x>0)  cpos.x = 0;
                if(ctrans.width >= trans.width && cpos.x + ctrans.width <  trans.width) cpos.x = -1*(ctrans.width-trans.width);
            }
            if(this.vertical){
                cpos.y += addtransY;
                if(cpos.y>0)  cpos.y = 0;
                if(ctrans.height >= trans.height && cpos.y + ctrans.height < trans.height)  cpos.y = -1*(ctrans.height - trans.height);
            }
            
            ctrans.markDirty();
        }
        
        remove() {
            this._content = null;
            this.transform = null;
        }
    }

}