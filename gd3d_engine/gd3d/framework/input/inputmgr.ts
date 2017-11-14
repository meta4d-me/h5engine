namespace gd3d.framework
{

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 鼠标(触屏)点击信息
     * @version egret-gd3d 1.0
     */
    export class pointinfo
    {
        id: number;
        touch: boolean = false;
        x: number;
        y: number;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 键盘、鼠标(触屏)事件管理类 应用状态机区分状态
     * @version egret-gd3d 1.0
     */
    export class inputMgr
    {
        private inputlast: HTMLInputElement = null;
        private app:gd3d.framework.application;
        point: pointinfo = new pointinfo();
        touches: { [id: number]: pointinfo } = {};
        keyboardMap: { [id: number]: boolean } = {};

        private rMtr_90 =new gd3d.math.matrix3x2();
        private rMtr_n90 =new gd3d.math.matrix3x2();
        constructor(app: application)
        {
            this.app = app;
            gd3d.math.matrix3x2MakeRotate(Math.PI * 90 / 180,this.rMtr_90);
            gd3d.math.matrix3x2MakeRotate(Math.PI * -90 / 180,this.rMtr_n90);

            app.webgl.canvas.addEventListener("touchstart", (ev: TouchEvent) =>
            {
                // console.log("引擎1111");
                // if (this.inputlast != null)
                // {
                //     this.inputlast.blur();
                // }
                // if (ev.target instanceof HTMLInputElement)
                // {
                //     this.inputlast = ev.target as HTMLInputElement;
                //     this.inputlast.focus();
                //     ev.preventDefault();
                //     // return;
                // }
                this.CalcuPoint(ev.touches[0].clientX,ev.touches[0].clientY);
                this.point.touch = true;

                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;
                    if (this.touches[id] == null)
                    {
                        this.touches[id] = new pointinfo();
                        this.touches[id].id = id;
                    }
                    this.touches[id].touch = true;
                    this.touches[id].x = touch.clientX;
                    this.touches[id].y = touch.clientY;
                }
            }
            );
            app.webgl.canvas.addEventListener("touchmove", (ev) =>
            {
                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;

                    if (this.touches[id] == null)
                    {
                        this.touches[id] = new pointinfo();
                        this.touches[id].id = id;
                    }
                    this.touches[id].touch = true;
                    this.touches[id].x = touch.clientX;
                    this.touches[id].y = touch.clientY;
                }

                var count = 0;
                var x = 0;
                var y = 0;
                for (var key in this.touches)
                {
                    if (this.touches[key].touch == true)
                    {
                        x += this.touches[key].x;
                        y += this.touches[key].y;
                        count++;
                    }
                }
                // this.point.x = x / (count * app.scale);
                // this.point.y = y / (count * app.scale);
                this.CalcuPoint(x / count,y / count);
            }
            );
            app.webgl.canvas.addEventListener("touchend", (ev) =>
            {
                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;
                    if (this.touches[id] == null)
                    {
                        this.touches[id] = new pointinfo();
                        this.touches[id].id = id;
                    }
                    this.touches[id].touch = false;
                }

                //所有触点全放开，point.touch才false
                for (var key in this.touches)
                {
                    if (this.touches[key].touch == true)
                        return;
                }
                this.point.touch = false;
            }
            );
            app.webgl.canvas.addEventListener("touchcancel", (ev) =>
            {
                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;
                    if (this.touches[id] == null)
                    {
                        this.touches[id] = new pointinfo();
                        this.touches[id].id = id;
                    }
                    this.touches[id].touch = false;
                }

                //所有触点全放开，point.touch才false
                for (var key in this.touches)
                {
                    if (this.touches[key].touch == true)
                        return;
                }
                this.point.touch = false;
            }
            );
            app.webgl.canvas.addEventListener("mousedown", (ev) =>
            {
                this.CalcuPoint(ev.clientX,ev.clientY);
                this.point.touch = true;
                
            }
            );
            app.webgl.canvas.addEventListener("mouseup", (ev) =>
            {
                this.point.touch = false;
            }
            );

            app.webgl.canvas.addEventListener("mousemove", (ev) =>
            {
                this.CalcuPoint(ev.clientX,ev.clientY);
            }
            );

            app.webgl.canvas.addEventListener("keydown", (ev: KeyboardEvent) =>
            {
                this.keyboardMap[ev.keyCode] = true;
            }, false);

            app.webgl.canvas.addEventListener("keyup", (ev: KeyboardEvent) =>
            {
                this.keyboardMap[ev.keyCode] = false;
            }, false);
            app.webgl.canvas.addEventListener("blur",(ev:KeyboardEvent)=>{
                this.point.touch = false;
            },false);
        }

        private tempV2_0:gd3d.math.vector2;
        private tempV2_1:gd3d.math.vector2;
        private CalcuPoint(clientX:number,clientY:number){
            if(!this.app || isNaN(clientX) || isNaN(clientY)) return;
            if(!this.tempV2_0) this.tempV2_0 = gd3d.math.pool.new_vector2();
            if(!this.tempV2_1) this.tempV2_1 = gd3d.math.pool.new_vector2();

            this.tempV2_0.x = clientX / this.app.scale;
            this.tempV2_0.y = clientY / this.app.scale;
            gd3d.math.vec2Clone(this.tempV2_0,this.tempV2_1);
            
            if(this.app.shouldRotate){
                switch (this.app.orientation){
                    case gd3d.framework.OrientationMode.PORTRAIT:
                    gd3d.math.matrix3x2TransformVector2(this.rMtr_90,this.tempV2_0,this.tempV2_1);
                    this.point.x = this.tempV2_1.x + this.app.webgl.canvas.width;
                    this.point.y = this.tempV2_1.y;
                    break;
                    case gd3d.framework.OrientationMode.LANDSCAPE:
                    gd3d.math.matrix3x2TransformVector2(this.rMtr_n90,this.tempV2_0,this.tempV2_1);
                    this.point.x = this.tempV2_1.x;
                    this.point.y = this.tempV2_1.y + this.app.webgl.canvas.height;
                    break;
                    case gd3d.framework.OrientationMode.LANDSCAPE_FLIPPED:
                    gd3d.math.matrix3x2TransformVector2(this.rMtr_90,this.tempV2_0,this.tempV2_1);
                    this.point.x = this.tempV2_1.x + this.app.webgl.canvas.width;
                    this.point.y = this.tempV2_1.y;
                    break;
                }
            }else{
                this.point.x = this.tempV2_0.x;
                this.point.y = this.tempV2_0.y;
            }
            
            //console.error(`x :${this.point.x}  y :${this.point.y}  w :${this.app.webgl.canvas.width}  h :${this.app.webgl.canvas.height}`);
        }
    }
}