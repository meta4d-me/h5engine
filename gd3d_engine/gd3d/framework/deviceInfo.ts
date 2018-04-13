namespace gd3d.framework
{
    export class DeviceInfo
    {
        private static debuginfo;
        private static getExtension()
        {
            this.debuginfo= sceneMgr.app.webgl.getExtension('WEBGL_debug_renderer_info');
            if(this.debuginfo==null)
            {
                console.warn("extension(WEBGL_debug_renderer_info) not support!");
            }
        }
        /**
         * GPU类型
         */
        public static get GraphDevice():string
        {
            if(this.debuginfo==null)
            {
                this.getExtension();
            }
            if(this.debuginfo)
            {
                let device:string=sceneMgr.app.webgl.getParameter(this.debuginfo.UNMASKED_RENDERER_WEBGL);
                return device;
            }else
            {
                return "unknown";
            }
        }
        /**
         * canvas 宽度
         */
        public static get CanvasWidth():number
        {
           if(sceneMgr.app)
           {
                return sceneMgr.app.webgl.canvas.width;
           }else
           {
               return null;
           }
        }
        /**
         * canvas 高度
         */
        public static get CanvasHeight():number
        {
            if(sceneMgr.app)
            {
                return sceneMgr.app.webgl.canvas.height;
            }else
            {
                return null;
            }
            
        }
        /**
         * 屏幕自适应方式
         */
        public static get ScreenAdaptiveType():string
        {
            if(sceneMgr.app)
            {
                return sceneMgr.app.screenAdaptiveType;
            }else
            {
                return "unknown";
            }
        }
        /**
         * 屏幕宽度
         */
        public static get ScreenWidth():number
        {
            return window.screen.width*(window.devicePixelRatio || 1);
        }
        /**
         * 屏幕高度
         */
        public static get ScreenHeight():number
        {
            return  window.screen.height*(window.devicePixelRatio || 1);
        }

    }

}