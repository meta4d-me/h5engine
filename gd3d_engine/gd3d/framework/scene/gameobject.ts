/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    export enum HideFlags
    {
        None = 0x00000000,
        HideInHierarchy = 0x00000001,
        HideInInspector = 0x00000002,
        DontSaveInEditor = 0x00000004,
        NotEditable = 0x00000008,
        DontSaveInBuild = 0x00000010,
        DontUnloadUnusedAsset = 0x00000020,
        DontSave = 0x00000034,
        HideAndDontSave = 0x0000003D,
    }

    export interface INodeComponent
    {
        start();
        update(delta: number);
        gameObject: gameObject;
        remove();
        clone();
        // jsonToAttribute(json: any, assetmgr: assetMgr);
    }

    @gd3d.reflect.SerializeType
    export class nodeComponent
    {
        @gd3d.reflect.Field("INodeComponent")
        comp: INodeComponent;
        init: boolean;

        constructor(comp: INodeComponent, init: boolean = false)
        {
            this.comp = comp;
            this.init = init;
        }
    }

    @gd3d.reflect.SerializeType
    export class gameObject
    {
        getScene(): scene
        {
            return this.transform.scene;
        }
        @gd3d.reflect.Field("number")
        @gd3d.reflect.UIStyle("enum")
        layer: number = 0;//物件有一个layer 取值范围0~31，各种功能都可以用layer mask 去过滤作用范围
        hideFlags: HideFlags = HideFlags.None;
        transform: transform;
        // dontdestroyonload:boolean = false;//加载新场景的时候是否销毁。
        // transform2d: transform2D;

        @gd3d.reflect.Field("nodeComponent[]")
        components: nodeComponent[] = [];
        private  componentsInit:nodeComponent[]=[];
        renderer: IRenderer;
        camera: camera;
        light: light;
        collider: ICollider;
        private _visible = true;

        get visibleInScene()
        {
            let obj: gameObject = this;
            while (obj.visible && obj.transform.parent)
            {
                obj = obj.transform.parent.gameObject;
            }
            return obj.visible;
        }
        get visible(): boolean
        {
            return this._visible;
        };//自否可见
        set visible(val: boolean)
        {
            if (val != this._visible)
            {
                this._visible = val;
                sceneMgr.app.markNotify(this.transform, NotifyType.ChangeVisible);
            }
        }
        getName(): string
        {
            return this.transform.name;
            // return this.transform != null ? this.transform.name : this.transform2d.name;
        }

        init()
        {
            if(this.componentsInit.length>0)
            {
                for(var i=0;i<this.componentsInit.length;i++)
                {
                    this.componentsInit[i].comp.start();
                    this.componentsInit[i].init = true;
                }
                this.componentsInit.length=0;
            }
        }

        update(delta: number)
        {
            if (this.components.length == 0) return;

            for (var i = 0; i < this.components.length; i++)
            {
                // if (this.components[i].init == false)
                // {
                //     this.components[i].comp.start();
                //     this.components[i].init = true;
                // }
                // if (this.getScene().app.bePlay && !this.getScene().app.bePause)
                // {
                //     this.components[i].comp.update(delta);
                // }
                // else if (this.components[i].comp == this.renderer || this.components[i].comp == this.camera)
                // {
                //     //有些组件是需要在场编状态下运行的
                //     this.components[i].comp.update(delta);
                // }
                this.components[i].comp.update(delta);
            }
        }
        addComponentDirect(comp: INodeComponent): INodeComponent
        {
            if (comp.gameObject != null)
            {
                throw new Error("this components has added to a  gameObject");
            }
            comp.gameObject = this;
            // if (this.components == null)
            //     this.components = [];

            //这种不明确的初始化以后不要用，反射识别不到类型。一定要构建类型
            //this.components.push({ comp: comp, init: false });
            let nodeObj = new nodeComponent(comp, false);
            let add = true;

            if (reflect.getClassTag(comp["__proto__"], "renderer") == "1" || reflect.getClassTag(comp["__proto__"], "effectbatcher") == "1")
            {//这货是个渲染器

                if (this.renderer == null)
                {
                    this.renderer = comp as any;
                    // console.warn("add renderer:" + this.transform.name);
                }
                else
                {
                    add = false;
                    console.warn("已经有一个渲染器的组件了，不能俩");
                    //throw new Error("已经有一个渲染器的组件了，不能俩");
                }
            }
            if (reflect.getClassTag(comp["__proto__"], "camera") == "1")
            {//这货是个摄像机
                if (this.camera == null)
                {
                    this.camera = comp as any;
                    // console.warn("add camera:" + this.transform.name);
                }
                else
                {
                    add = false;
                    console.warn("已经有一个摄像机的组件了，不能俩");
                    //throw new Error("已经有一个摄像机的组件了，不能俩");
                }
            }
            if (reflect.getClassTag(comp["__proto__"], "light") == "1")
            {//这货是个light
                if (this.light == null)
                {
                    this.light = comp as any;
                    console.warn("add light:" + this.transform.name);
                }
                else
                {
                    add = false;
                    console.warn("已经有一个灯光的组件了，不能俩");
                    //throw new Error("已经有一个灯光的组件了，不能俩");
                }
            }
            if (reflect.getClassTag(comp["__proto__"], "boxcollider") == "1" || reflect.getClassTag(comp["__proto__"], "meshcollider") == "1" || reflect.getClassTag(comp["__proto__"], "canvasRenderer") == "1")
            {//这货是个collider
                if (this.collider == null)
                {
                    this.collider = comp as any;
                    // console.warn("add collider:" + this.transform.name);
                }
                else
                {
                    add = false;
                    console.warn("已经有一个碰撞盒的组件了，不能俩");
                    //throw new Error("已经有一个碰撞盒的组件了，不能俩");
                }
            }


            if (add)
            {
                this.components.push(nodeObj);
                this.componentsInit.push(nodeObj);
                if (reflect.getClassTag(comp["__proto__"], "camera") == "1")
                    sceneMgr.app.markNotify(this.transform, NotifyType.AddCamera);
                if (reflect.getClassTag(comp["__proto__"], "canvasRenderer") == "1")
                    sceneMgr.app.markNotify(this.transform, NotifyType.AddCanvasRender);
            }
            return comp;
        }
        //只是自己身上找到的第一个
        getComponent(type: string): INodeComponent
        {
            for (var i = 0; i < this.components.length; i++)
            {
                var cname = gd3d.reflect.getClassName(this.components[i].comp["__proto__"]);
                if (cname == type)
                {
                    return this.components[i].comp;
                }
            }
            return null;
        }
        //获取身上所有的组件
        getComponents(): INodeComponent[]
        {
            let components: INodeComponent[] = [];
            for (var i = 0; i < this.components.length; i++)
            {
                components.push(this.components[i].comp);
            }
            return components;
        }
        //包含自己（未测试）
        getComponentsInChildren(type: string): INodeComponent[]
        {
            let components: INodeComponent[] = [];
            this._getComponentsInChildren(type, this, components);
            return components;
        }

        private _getComponentsInChildren(type: string, obj: gameObject, array: INodeComponent[])
        {
            for (var i = 0; i < obj.components.length; i++)
            {
                var cname = gd3d.reflect.getClassName(obj.components[i].comp["__proto__"]);
                if (cname == type)
                {
                    array.push(obj.components[i].comp);
                }
            }
            for (let i = 0; obj.transform.children != undefined && i < obj.transform.children.length; i++)
            {
                let _obj = obj.transform.children[i].gameObject;
                this._getComponentsInChildren(type, _obj, array);
            }
        }

        getComponentInParent(type: string): INodeComponent
        {
            let result: INodeComponent = null;
            let _parent = this.transform.parent;
            while (result == null && _parent != null)
            {
                result = _parent.gameObject.getComponent(type);
                _parent = _parent.parent;
            }
            return result;
        }
        addComponent(type: string): INodeComponent
        {
            // if (this.components == null)
            //     this.components = [];
            for (var key in this.components)
            {
                var st = this.components[key]["comp"]["constructor"]["name"];
                if (st == type)
                {
                    throw new Error("已经有一个" + type + "的组件了，不能俩");
                }
            }
            var pp = gd3d.reflect.getPrototype(type);
            var comp = gd3d.reflect.createInstance(pp, { "nodecomp": "1" });
            return this.addComponentDirect(comp);
        }
        removeComponent(comp: INodeComponent)
        {
            for (var i = 0; i < this.components.length; i++)
            {
                if (this.components[i].comp == comp)
                {
                    if (this.components[i].init)
                    {//已经初始化过
                        this.components[i].comp.remove();
                    }
                    this.remove(this.components[i].comp);
                    this.components.splice(i, 1);
                    break;
                }
            }
        }

        remove(comp: INodeComponent)
        {
            if (reflect.getClassTag(comp["__proto__"], "renderer") == "1")
            {//这货是个渲染器
                this.renderer = null;
            }
            if (reflect.getClassTag(comp["__proto__"], "camera") == "1")
            {//这货是个摄像机
                this.camera = null;
            }
            if (reflect.getClassTag(comp["__proto__"], "light") == "1")
            {//这货是个light
                this.light = null;
            }
            if (reflect.getClassTag(comp["__proto__"], "boxcollider") == "1" || reflect.getClassTag(comp["__proto__"], "meshcollider") == "1" || reflect.getClassTag(comp["__proto__"], "canvasRenderer") == "1")
            {//这货是个collider
                this.collider = null;
            }
        }

        removeComponentByTypeName(type: string)
        {
            for (var i = 0; i < this.components.length; i++)
            {
                if (reflect.getClassName(this.components[i].comp) == type)
                {
                    if (this.components[i].init)
                    {//已经初始化过
                        this.components[i].comp.remove();
                    }
                    this.remove(this.components[i].comp);
                    this.components.splice(i, 1);
                    break;
                }
            }
        }
        removeAllComponents()
        {
            for (var i = 0; i < this.components.length; i++)
            {
                // if (this.components[i].init)
                {//已经初始化过
                    this.components[i].comp.remove();
                }
                this.remove(this.components[i].comp);
            }
            this.components.length = 0;
        }
        dispose()
        {
            this.removeAllComponents();
        }

    }



}