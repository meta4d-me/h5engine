/// <reference path="../../../io/reflect.ts" />
namespace m4m.framework
{
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 矩形卷轴
    * @version m4m 1.0
    */
    @reflect.node2DComponent
    export class scrollRect implements I2DComponent, I2DPointListener
    {
        static readonly ClassName: string = "scrollRect";

        private _content: transform2D;

        private static helpv2 = new math.vector2();
        private static helpv2_1 = new math.vector2();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version m4m 1.0
         */
        @m4m.reflect.Field("reference", null, "transform2D")
        get content(): transform2D
        {
            return this._content;
        }
        set content(content: transform2D)
        {
            this._content = content;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平滑动开启
         * @version m4m 1.0
         */
        @m4m.reflect.Field("boolean")
        horizontal: boolean = true;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直滑动开启
         * @version m4m 1.0
         */
        @m4m.reflect.Field("boolean")
        vertical: boolean = true;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 滑动惯性
         * @version m4m 1.0
         */
        @m4m.reflect.Field("boolean")
        inertia: boolean = true;

        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 惯性减速率
        * @version m4m 1.0
        */
        @m4m.reflect.Field("number")
        decelerationRate: number = 0.135;

        start()
        {
        }

        onPlay()
        {

        }

        update(delta: number)
        {
            this.flyingSlidr(delta);
        }
        transform: transform2D;
        //暂停滑动
        pauseSlide: boolean = false;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {
            if (this.pauseSlide)
            {
                this.isPointDown = false;
                return;
            }
            //oncap==true 是捕获阶段，一般的行为，只在pop阶段处理
            if (oncap == false)
            {
                let tv2 = scrollRect.helpv2;
                tv2.x = ev.x;
                tv2.y = ev.y;
                var b = this.transform.ContainsCanvasPoint(tv2);

                if (b)
                {
                    ev.eated = true;
                    if (this._content == null) return;
                    if (!this.horizontal && !this.vertical) return;

                    let temps = scrollRect.helpv2;
                    m4m.math.vec2Set(temps, ev.x, ev.y);
                    let tempc = scrollRect.helpv2_1;
                    this.transform.canvas.clipPosToCanvasPos(temps, tempc);

                    let sp = this.strPoint;
                    if (ev.type == event.PointEventEnum.PointDown)
                    {
                        //点下
                        this.isPointDown = true;
                        sp.x = tempc.x;
                        sp.y = tempc.y;
                        math.vec2Clone(this._content.transform.localTranslate, this.strPos);
                        this.canfly = false;
                        if (this.onDownFun)
                            this.onDownFun(sp.x, sp.y);
                    }
                    if (ev.type == event.PointEventEnum.PointHold && this.isPointDown)
                    {
                        //滑动中
                        let lp = this.lastPoint;
                        if (lp.x != tempc.x || lp.y != tempc.y)
                        {
                            lp.x = tempc.x; lp.y = tempc.y;
                            let addtransX = lp.x - sp.x;
                            let addtransY = lp.y - sp.y;
                            math.vec2Clone(this.strPos, this._content.localTranslate);
                            this.SlideTo(addtransX, addtransY);
                        }
                        if (this.inertia)
                        {
                            this.collectPointing();
                        }

                    }
                }
            }
            if (ev.type == event.PointEventEnum.PointUp)
            {
                //滑动结束
                this.isPointDown = false;
                if (this.inertia)
                {
                    this.onInertiaSliderUp();
                }
                if (this.onUpFun)
                    this.onUpFun();
            }
        }
        private isPointDown = false;
        private lastPoint = new math.vector2();
        private strPoint = new math.vector2();
        private strPos = new math.vector2();
        //滑动一定距离
        private SlideTo(addtransX, addtransY)
        {
            if (!this._content) return;
            let ctrans = this._content.transform;
            let cpos = ctrans.localTranslate;
            let trans = this.transform;

            if (this.horizontal)
            {
                cpos.x += addtransX;
                if (cpos.x > 0 || ctrans.width <= trans.width) cpos.x = 0;
                if (ctrans.width > trans.width && cpos.x + ctrans.width < trans.width) cpos.x = -1 * (ctrans.width - trans.width);
            }
            if (this.vertical)
            {
                cpos.y += addtransY;
                if (cpos.y > 0 || ctrans.height <= trans.height) cpos.y = 0;
                if (ctrans.height > trans.height && cpos.y + ctrans.height < trans.height) cpos.y = -1 * (ctrans.height - trans.height);
            }

            ctrans.markDirty();

            if (this.onMoveFun)
                this.onMoveFun(addtransX, addtransY);
        }

        private readonly collectNum = 3; //控制采集精度
        private points: m4m.math.vector2[] = [];
        //收集点数据
        private collectPointing()
        {
            if (!this.isPointDown) return;
            // let p = this.iptmgr.point;
            let p = this.lastPoint;
            if (this.points.length > this.collectNum)
            {
                let v2 = this.points.shift();
                m4m.math.pool.delete_vector2(v2);
            }
            let currpos = m4m.math.pool.new_vector2(p.x, p.y);
            this.points.push(currpos);
        }

        private flyVelocity = new math.vector2(); //速度
        //点up
        private onInertiaSliderUp()
        {
            if (this.points.length < 2)
            {
                m4m.math.pool.delete_vector2Array(this.points);
                return;
            }
            //计算缓动 滑行
            let fv = this.flyVelocity;
            fv.x = fv.y = 0;
            let len = this.points.length;
            let tv2 = scrollRect.helpv2;
            for (let i = 1; i < len; i++)
            {
                let p_0 = this.points[i - 1];
                let p_1 = this.points[i];
                math.vec2Subtract(p_1, p_0, tv2);
                math.vec2Add(tv2, fv, fv);
            }

            math.vec2Clone(this.flyVelocity, this.lastfv);
            m4m.math.pool.delete_vector2Array(this.points);
            this.canfly = true;
        }

        private canfly = false;
        private readonly threshold = 0.01; //阈值
        private readonly cgTime = 0.2;
        private cgCount = this.cgTime;
        private lastfv = new math.vector2();
        //惯性滑动
        private flyingSlidr(delta: number)
        {
            if (!this.canfly || !this.inertia) return;
            let fv = this.flyVelocity;
            this.cgCount += delta;
            if (this.cgCount >= this.cgTime)
            {
                math.vec2Clone(fv, this.lastfv);
                math.vec2ScaleByNum(fv, this.decelerationRate, fv);
                this.cgCount = 0;
            }

            if (math.vec2Length(fv) < this.threshold)
            {
                this.canfly = false;
                this.cgCount = this.cgTime;
            }
            let tv2 = scrollRect.helpv2;
            math.vec2SLerp(this.lastfv, fv, this.cgCount / this.cgTime, tv2);
            this.SlideTo(tv2.x, tv2.y);

            if(this.canfly==false)//惯性滑动 结束
            {
                if(this.onSlideEndFun)this.onSlideEndFun();
            }
        }
        public onMoveFun: (x: number, y: number) => {};
        public onDownFun: (x: number, y: number) => {};
        public onUpFun: () => {};
        public onSlideEndFun: () => {};//惯性滑动 结束
        remove()
        {
            this._content = null;
            this.transform = null;
        }
    }

}