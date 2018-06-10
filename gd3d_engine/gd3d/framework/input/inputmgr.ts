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
        private eventer:event.InputEvent = new event.InputEvent();
        private inputlast: HTMLInputElement = null;
        private app:gd3d.framework.application;
        get point (){return this._point;};
        private _point: pointinfo = new pointinfo();
        get touches (){return this._touches};
        private _touches: { [id: number]: pointinfo } = {};
        private keyboardMap: { [id: number]: boolean } = {};

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
                this._point.touch = true;

                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;
                    if (this._touches[id] == null)
                    {
                        this._touches[id] = new pointinfo();
                        this._touches[id].id = id;
                    }
                    this._touches[id].touch = true;
                    this._touches[id].x = touch.clientX;
                    this._touches[id].y = touch.clientY;
                }
            }
            );
            app.webgl.canvas.addEventListener("touchmove", (ev:any) =>
            {
                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;

                    if (this._touches[id] == null)
                    {
                        this._touches[id] = new pointinfo();
                        this._touches[id].id = id;
                    }
                    this._touches[id].touch = true;
                    this._touches[id].x = touch.clientX;
                    this._touches[id].y = touch.clientY;
                }

                var count = 0;
                var x = 0;
                var y = 0;
                for (var key in this._touches)
                {
                    if (this._touches[key].touch == true)
                    {
                        x += this._touches[key].x;
                        y += this._touches[key].y;
                        count++;
                    }
                }
                // this.point.x = x / (count * app.scale);
                // this.point.y = y / (count * app.scale);
                this.CalcuPoint(x / count,y / count);
            }
            );
            app.webgl.canvas.addEventListener("touchend", (ev:any) =>
            {
                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;
                    if (this._touches[id] == null)
                    {
                        this._touches[id] = new pointinfo();
                        this._touches[id].id = id;
                    }
                    this._touches[id].touch = false;
                }

                //所有触点全放开，point.touch才false
                for (var key in this._touches)
                {
                    if (this._touches[key].touch == true)
                        return;
                }
                this._point.touch = false;
            }
            );
            app.webgl.canvas.addEventListener("touchcancel", (ev:any) =>
            {
                for (var i = 0; i < ev.changedTouches.length; i++)
                {
                    var touch = ev.changedTouches[i];
                    var id = touch.identifier;
                    if (this._touches[id] == null)
                    {
                        this._touches[id] = new pointinfo();
                        this._touches[id].id = id;
                    }
                    this._touches[id].touch = false;
                }

                //所有触点全放开，point.touch才false
                for (var key in this._touches)
                {
                    if (this._touches[key].touch == true)
                        return;
                }
                this._point.touch = false;
            }
            );
            app.webgl.canvas.addEventListener("mousedown", (ev) =>
            {
                this.CalcuPoint(ev.offsetX,ev.offsetY);
                this._point.touch = true;
                
            }
            );
            app.webgl.canvas.addEventListener("mouseup", (ev) =>
            {
                this._point.touch = false;
            }
            );

            app.webgl.canvas.addEventListener("mousemove", (ev) =>
            {
                this.CalcuPoint(ev.offsetX,ev.offsetY);
            }
            );

            app.webgl.canvas.addEventListener("keydown", (ev: KeyboardEvent) =>
            {
                this.hasKeyDown = this.keyboardMap[ev.keyCode] = true;
            }, false);

            app.webgl.canvas.addEventListener("keyup", (ev: KeyboardEvent) =>
            {
                delete this.keyboardMap[ev.keyCode];
                this.hasKeyUp = true;
            }, false);
            app.webgl.canvas.addEventListener("blur",(ev:KeyboardEvent)=>{
                this._point.touch = false;
            },false);
        }

        private readonly moveTolerance = 2;  //move 状态容忍值
        private lastTouch = false;
        private hasPointDown = false;
        private hasPointUP = false;
        private hasPointMove = false;
        private downPoint = new gd3d.math.vector2();
        private lastPoint = new gd3d.math.vector2();
        update(delta){
           this.pointCk();
           this.keyCodeCk();
        }

        private pointCk(){
            let pt = this._point;
            if(this.lastPoint.x != pt.x || this.lastPoint.y != pt.y){
                //on move
                this.eventer.EmitEnum_point( event.PointEventEnum.PointMove,pt.x,pt.y);
            }

            if(!this.lastTouch && pt.touch){
                //on down
                this.hasPointDown = true;
                this.downPoint.x = pt.x;
                this.downPoint.y = pt.y;
                this.eventer.EmitEnum_point(event.PointEventEnum.PointDown,pt.x,pt.y);
            }else if(this.lastTouch && !pt.touch){
                //on up
                this.hasPointUP = true;
                this.eventer.EmitEnum_point(event.PointEventEnum.PointUp,pt.x,pt.y);
            }

            if(this.hasPointUP && this.hasPointDown){
                let isMoveTolerance = (Math.abs(this.downPoint.x - pt.x)> this.moveTolerance || Math.abs(this.downPoint.y - pt.y)> this.moveTolerance)
                if(isMoveTolerance){
                    //on click
                    this.hasPointDown = this.hasPointUP = false;
                    this.eventer.EmitEnum_point(event.PointEventEnum.PointClick,pt.x,pt.y);
                }
            }

            if(!pt.touch){
                this.hasPointDown = false;
            }

            this.lastTouch = pt.touch;
            this.lastPoint.x = pt.x;
            this.lastPoint.y = pt.y;
        }

        private hasKeyDown = false;
        private hasKeyUp = false;
        private keyCodeCk(){
            if(this.hasKeyDown)
                this.eventer.EmitEnum_key(event.KeyEventEnum.KeyDown,null);
            if(this.hasKeyUp)
                this.eventer.EmitEnum_key(event.KeyEventEnum.KeyUp,null);

            this.hasKeyDown = this.hasKeyUp = false;
        }

        /**
        * 添加point事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addPointListener(eventEnum: event.PointEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.eventer.OnEnum_point(eventEnum,func,thisArg);
        }
        /**
         * 移除point事件监听者
         * @param eventEnum 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removePointListener(eventEnum: event.PointEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.eventer.RemoveListener(event.PointEventEnum[eventEnum],func,thisArg);
        }

        /**
        * 添加按键事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addKeyListener(eventEnum: event.KeyEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.eventer.OnEnum_key(eventEnum,func,thisArg);
        }
        /**
         * 移除按键事件监听者
         * @param eventEnum 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removeKeyListener(eventEnum: event.KeyEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.eventer.RemoveListener(event.KeyEventEnum[eventEnum],func,thisArg);
        }

        /**
         * 任意一按键被按下
         */
        anyKey(){
            if(this._point.touch) return true;
            for (const key in this.keyboardMap) {
                if (this.keyboardMap.hasOwnProperty(key)) {
                    const element = this.keyboardMap[key];
                    if(element == true) 
                        return true;
                }
            }
            return false;
        }

         /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取 指定按键是否Down
         * @version egret-gd3d 1.0
         */
        GetKeyDown(name:string)
        GetKeyDown(key:event.KeyCode)
        GetKeyDown(value:any){
            if( typeof(value) === "number" ){
                if(this.keyboardMap[value] != null)
                   return this.keyboardMap[value];
            }else if(typeof(value) === "string"){
                let id = event.KeyCode[value];
                if(id != null && this.keyboardMap[id] != null)
                    return this.keyboardMap[id];
            }
            return false;
        }
        
         /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取 指定按键是否UP
         * @version egret-gd3d 1.0
         */
        GetKeyUP(name:string)
        GetKeyUP(key:event.KeyCode)
        GetKeyUP(value:any):boolean{
            if( typeof(value) === "number" ){
                return !this.keyboardMap[value];
            }else if(typeof(value) === "string"){
                let id = event.KeyCode[value];
                if(id != null )
                    return !this.keyboardMap[id];
            }
            return false;
        }

        /**
         * 按键按下的数量
         */
        KeyDownCount(){
            let count = 0;
            for (const key in this.keyboardMap) {
                if (this.keyboardMap.hasOwnProperty(key)) {
                    if( this.keyboardMap[key] === true)
                        count ++;
                }
            }
            return count;
        }

        private tempV2_0:gd3d.math.vector2;
        private tempV2_1:gd3d.math.vector2;
        private CalcuPoint(clientX:number,clientY:number){
            if(!this.app || isNaN(clientX) || isNaN(clientY)) return;
            if(!this.tempV2_0) this.tempV2_0 = gd3d.math.pool.new_vector2();
            if(!this.tempV2_1) this.tempV2_1 = gd3d.math.pool.new_vector2();

            this.tempV2_0.x = clientX / this.app.scaleFromPandding;
            this.tempV2_0.y = clientY / this.app.scaleFromPandding;
            gd3d.math.vec2Clone(this.tempV2_0,this.tempV2_1);
            
            if(this.app.shouldRotate){
                switch (this.app.orientation){
                    case gd3d.framework.OrientationMode.PORTRAIT:
                    gd3d.math.matrix3x2TransformVector2(this.rMtr_90,this.tempV2_0,this.tempV2_1);
                    this._point.x = this.tempV2_1.x + this.app.webgl.canvas.width;
                    this._point.y = this.tempV2_1.y;
                    break;
                    case gd3d.framework.OrientationMode.LANDSCAPE:
                    gd3d.math.matrix3x2TransformVector2(this.rMtr_n90,this.tempV2_0,this.tempV2_1);
                    this._point.x = this.tempV2_1.x;
                    this._point.y = this.tempV2_1.y + this.app.webgl.canvas.height;
                    break;
                    case gd3d.framework.OrientationMode.LANDSCAPE_FLIPPED:
                    gd3d.math.matrix3x2TransformVector2(this.rMtr_90,this.tempV2_0,this.tempV2_1);
                    this._point.x = this.tempV2_1.x + this.app.webgl.canvas.width;
                    this._point.y = this.tempV2_1.y;
                    break;
                }
            }else{
                this._point.x = this.tempV2_0.x;
                this._point.y = this.tempV2_0.y;
            }
            
            //console.error(`x :${this.point.x}  y :${this.point.y}  w :${this.app.webgl.canvas.width}  h :${this.app.webgl.canvas.height}`);
        }
    }
}