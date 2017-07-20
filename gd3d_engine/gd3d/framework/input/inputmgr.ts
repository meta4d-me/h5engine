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
        touch: boolean;
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
        point: pointinfo = new pointinfo();
        touches: { [id: number]: pointinfo } = {};
        keyboardMap: { [id: number]: boolean } = {};

        constructor(app: application)
        {
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
                this.point.x = ev.touches[0].clientX / app.scale;
                this.point.y = ev.touches[0].clientY / app.scale;
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
                this.point.x = x / (count * app.scale);
                this.point.y = y / (count * app.scale);
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
                this.point.x = ev.clientX / app.scale;
                this.point.y = ev.clientY / app.scale;
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
                this.point.x = ev.clientX / app.scale;
                this.point.y = ev.clientY / app.scale;
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
        }
    }
}