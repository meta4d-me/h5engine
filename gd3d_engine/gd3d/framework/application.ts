//主要的入口
namespace gd3d.framework
{
    export interface INotify
    {
        notify(trans: any, type: NotifyType);
    }
    export enum NotifyType
    {
        AddChild,
        RemoveChild,
        ChangeVisible,
        AddCamera,
        AddCanvasRender,
    }
    export class application
    {
        webgl: WebGLRenderingContext;
        stats: Stats.Stats;
        container: HTMLDivElement;
        width: number;
        height: number;
        limitFrame: boolean = true;
        notify: INotify;
        timeScale:number;
		version:string = "v0.0.1";
		build:string = "b000009";
        constructor(){
            window["gd3d_app"] = this;
        }

        start(div: HTMLDivElement)
        {
			console.log("version: "+this.version + "  build: "+this.build);
            sceneMgr.app = this;
            this.timeScale = 0.5;
            this.container = div;
            var canvas = document.createElement("canvas");
            canvas.className = "full";
            canvas.style.position = "absolute";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.backgroundColor = "#1e1e1e";
            canvas.setAttribute("tabindex", "1");
            div.appendChild(canvas);

            //init webgl;
            this.webgl = <WebGLRenderingContext>canvas.getContext('webgl') ||
                <WebGLRenderingContext>canvas.getContext("experimental-webgl");

            gd3d.render.webglkit.initConst(this.webgl);
            this.initAssetMgr();
            this.initInputMgr();

            this.initScene();
            this.beginTimer = this.lastTimer = Date.now() / 1000;
            this.loop();
            gd3d.io.referenceInfo.regDefaultType();
        }

        markNotify(trans: any, type: NotifyType)
        {
            this.doNotify(trans, type);
        }

        private doNotify(trans: transform, type: NotifyType)
        {
            if (trans == null)
                return;
            if (!this.checkFilter(trans))
                return;
            if (this.notify)
                this.notify.notify(trans, type);
            if (trans.children != null)
            {
                for (let index in trans.children)
                {
                    this.doNotify(trans.children[index], type);
                }
            }
        }

        checkFilter(trans: any)
        {
            if (trans instanceof gd3d.framework.transform)
            {
                if (trans.gameObject.hideFlags & gd3d.framework.HideFlags.HideInHierarchy)
                {
                    return false;
                }
            }
            if (trans instanceof gd3d.framework.transform2D)
            {
                if (trans.hideFlags & gd3d.framework.HideFlags.HideInHierarchy)
                {
                    return false;
                }
            }
            return true;
        }


        showFps()
        {
            if (this.stats == null)
            {
                this.stats = new Stats.Stats();
                this.stats.container.style.position = 'absolute'; //绝对坐标  
                this.stats.container.style.left = '0px';// (0,0)px,左上角  
                this.stats.container.style.top = '0px';
                this.container.appendChild(this.stats.container);
            }
            else
            {
                this.container.appendChild(this.stats.container);
            }
        }

        closeFps()
        {
            if (this.stats != null)
            {
                this.container.removeChild(this.stats.container);
            }
        }
        beStepNumber = 0;
        //delta 单位秒
        private update(delta: number)
        {
            if (this.webgl.canvas.clientWidth != this.webgl.canvas.width || this.webgl.canvas.clientHeight != this.webgl.canvas.height)
            {
                this.webgl.canvas.width = this.webgl.canvas.clientWidth;
                this.webgl.canvas.height = this.webgl.canvas.clientHeight;
                console.log("canvas resize.");
            }
            this.width = this.webgl.canvas.width;
            this.height = this.webgl.canvas.height;

            if (this.bePlay)
            {
                if (this.bePause)
                {
                    if (this.beStepForward && this.beStepNumber > 0)
                    {
                        this.beStepNumber--;
                        this.updateUserCode(delta);
                    }
                }
                else
                {
                    this.updateUserCode(delta);
                }
            }
            this.updateEditorCode(delta);

            if (this._scene != null)
            {
                this._scene.update(delta);
            }
        }
        private beginTimer;
        private lastTimer;
        private totalTime;
        private _deltaTime;
        getTotalTime(): number
        {
            return this.totalTime;
        }
        public get deltaTime()
        {
            return this._deltaTime * this.timeScale;
        }
        private loop()
        {
            var now = Date.now() / 1000;
            this._deltaTime = now - this.lastTimer;
            this.totalTime = now - this.beginTimer;
            this.update(this.deltaTime);
            if (this.stats != null)
                this.stats.update();
            this.lastTimer = now;

            if (this.limitFrame)
            {
                requestAnimationFrame(this.loop.bind(this));
            }
            else
            {
                setTimeout(this.loop.bind(this), 1);
            }
        }


        //一个Program 拥有横竖两条控制线，横向是时间线，用状态机表达UserState
        //纵向是 多个Scene，每个Scene拥有多个Camera，多个Scene用到的情况极少
        //Unity放弃了纵向，直接用Scene表达横向的时间线
        //我们也可以放弃纵向，同时只能拥有单个Scene，这样逻辑清晰
        //但是横向时间线也用Scene明显是个失败设计,控制层逻辑是高于Scene的，unity却用组件表达一切
        //我们只留一个控制层即可

        private _scene: scene;
        private initScene()
        {
            if (this._scene == null)
            {
                this._scene = new scene(this);
                sceneMgr.scene = this._scene;
            }
        }
        getScene(): scene
        {
            return this._scene;
        }

        private _assetmgr: assetMgr
        private initAssetMgr()
        {
            if (this._assetmgr == null)
            {
                this._assetmgr = new assetMgr(this);
                this._assetmgr.initDefAsset();
            }
        }
        getAssetMgr()
        {
            return this._assetmgr;
        }

        private _inputmgr: inputMgr
        private initInputMgr()
        {
            if (this._inputmgr == null)
            {
                this._inputmgr = new inputMgr(this);
            }
        }
        getInputMgr()
        {
            return this._inputmgr;
        }

        //用户控制层代码，逻辑非常简单，就是给用户一个全局代码插入的机会，update不受场景切换的影响
        private _userCode: IUserCode[] = [];
        private _userCodeNew: IUserCode[] = [];
        private _editorCode: IUserCode[] = [];
        private _editorCodeNew: IUserCode[] = [];
        private _bePlay: boolean = false;
        be2dstate: boolean = false;
        public curcameraindex: number = -1;
        public get bePlay()
        {
            return this._bePlay;
        }
        public set bePlay(value: boolean)
        {
            this._bePlay = value;
        }
        private _bePause: boolean = false;
        public get bePause()
        {
            return this._bePause;
        }
        public set bePause(value: boolean)
        {
            this._bePause = value;
        }
        private _beStepForward: boolean = false;
        public get beStepForward()
        {
            return this._beStepForward;
        }
        public set beStepForward(value: boolean)
        {
            this._beStepForward = value;
        }
        private updateUserCode(delta: number)
        {
            //add new code;
            for (var i = this._userCodeNew.length - 1; i >= 0; i--)
            {
                var c = this._userCodeNew[i];
                if (c.isClosed() == false)
                {
                    c.onStart(this);
                    this._userCode.push(c);
                    this._userCodeNew.splice(i, 1);
                }
            }
            // this._userCodeNew.length = 0;

            //update logic
            var closeindex = -1;
            for (var i = 0; i < this._userCode.length; i++)
            {
                var c = this._userCode[i];
                if (c.isClosed() == false)
                {
                    c.onUpdate(delta);
                }
                else if (closeindex < 0)
                {
                    closeindex = i;
                }
            }

            //remove closed
            if (closeindex >= 0)
            {
                this._userCode.splice(closeindex, 1);
            }
        }

        updateEditorCode(delta: number)
        {
            for (let i = this._editorCodeNew.length - 1; i >= 0; i--)
            {
                let c = this._editorCodeNew[i];
                if (c.isClosed() == false)
                {
                    c.onStart(this);
                    this._editorCode.push(c);
                    this._editorCodeNew.splice(i, 1);
                }
            }
            let closeindex = -1;
            for (let i = this._editorCode.length - 1; i >= 0; i--)
            {
                let c = this._editorCode[i];
                if (c.isClosed())
                {
                    this._editorCode.splice(i, 1);
                } else
                {
                    c.onUpdate(delta);
                }
            }
        }
        addUserCodeDirect(program: IUserCode)
        {
            this._userCodeNew.push(program);
        }
        addUserCode(classname: string)
        {
            //反射创建实例的方法
            var prototype = gd3d.reflect.getPrototype(classname);
            if (prototype != null)
            {
                var code = gd3d.reflect.createInstance(prototype, { "usercode": "1" });
                this.addUserCodeDirect(code);
            }
        }

        addEditorCode(classname: string)
        {
            //反射创建实例的方法
            var prototype = gd3d.reflect.getPrototype(classname);
            if (prototype != null)
            {
                var code = gd3d.reflect.createInstance(prototype, { "editorcode": "1" });
                this.addEditorCodeDirect(code);
            }
        }
        addEditorCodeDirect(program: IEditorCode)
        {
            this._editorCodeNew.push(program);
        }
    }
    export interface IUserCode
    {
        onStart(app: gd3d.framework.application);
        //以秒为单位的间隔
        onUpdate(delta: number);
        isClosed(): boolean;
    }
    export interface IEditorCode
    {
        onStart(app: gd3d.framework.application);
        //以秒为单位的间隔
        onUpdate(delta: number);
        isClosed(): boolean;
    }
}
