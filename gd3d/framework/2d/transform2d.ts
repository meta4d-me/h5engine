/// <reference path="../../io/reflect.ts" />
/// <reference path="../../render/struct.ts" />

namespace gd3d.framework
{
    export interface I2DComponent
    {
        start();
        update(delta: number);
        transform: transform2D;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean);
        remove();
    }

    export interface IRectRenderer extends I2DComponent
    {
        render(canvas: canvas);
        //刷新顶点信息
        updateTran();
    }

    @gd3d.reflect.SerializeType
    export class C2DComponent
    {
        @gd3d.reflect.Field("I2DComponent")
        comp: I2DComponent;
        init: boolean;
        constructor(comp: I2DComponent, init: boolean = false)
        {
            this.comp = comp;
            this.init = init;
        }
    }

    //也走transform 那一套，不过是2d版，
    //因为统一有 pivot 和 size,而且2d并不继承自3d
    //所以我不想让他继承transform2d
    //那么问题来了，gameobject 还要不要，要，gameobject 管组件的，
    //gameobject 区分清自己现在挂载的transform 是 2d 还是 3d 就好
    @gd3d.reflect.SerializeType
    export class transform2D
    {
        // public notify: INotify;
        private _canvas: canvas;
        set canvas(val: canvas)
        {
            this._canvas = val;
        }
        get canvas(): canvas
        {
            if (this._canvas == null)
            {
                if (this.parent == null)
                    return null;
                return this.parent.canvas;
            }
            return this._canvas;
        }
        @gd3d.reflect.Field("string")
        name: string = "noname";
        parent: transform2D;
        @gd3d.reflect.Field("transform2D[]")
        children: transform2D[];
        //尺寸
        @gd3d.reflect.Field("number")
        width: number;//2d位置
        @gd3d.reflect.Field("number")
        height: number;
        @gd3d.reflect.Field("vector2")
        pivot: math.vector2 = new math.vector2(0, 0);//中心点位置
        hideFlags: HideFlags = HideFlags.None;
        _visible = true;
        get visibleInScene()
        {
            let obj: transform2D = this;
            while (obj.visible)
            {
                obj = obj.parent;
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
                sceneMgr.app.markNotify(this, NotifyType.ChangeVisible);
            }
        }

        get transform()
        {
            return this;
        }

        public insId: insID = new insID();
        private dirty: boolean = true;//自己是否需要更新
        private dirtyChild: boolean = true;//子层是否需要更新
        private dirtyWorldDecompose: boolean = false;

        //位置信息
        @gd3d.reflect.Field("vector2")
        localTranslate: math.vector2 = new math.vector2(0, 0);//显示位置
        @gd3d.reflect.Field("vector2")
        localScale: math.vector2 = new math.vector2(1, 1);//缩放位置
        @gd3d.reflect.Field("number")
        localRotate: number = 0;//旋转

        private localMatrix: math.matrix3x2 = new gd3d.math.matrix3x2;//2d矩阵
        //这个是如果爹改了就要跟着算的

        private worldMatrix: gd3d.math.matrix3x2 = new gd3d.math.matrix3x2();
        private worldRotate: math.angelref = new math.angelref();
        private worldTranslate: gd3d.math.vector2 = new gd3d.math.vector2(0, 0);
        private worldScale: gd3d.math.vector2 = new gd3d.math.vector2(1, 1);
        addChild(node: transform2D)
        {
            if (node.parent != null)
            {
                node.parent.removeChild(node);
            }
            if (this.children == null)
                this.children = [];
            this.children.push(node);
            node.parent = this;
            node.canvas = this.canvas;
            sceneMgr.app.markNotify(node, NotifyType.AddChild);
        }
        addChildAt(node: transform2D, index: number)
        {
            if (index < 0)
                return;
            if (node.parent != null)
            {
                node.parent.removeChild(node);
            }
            if (this.children == null)
                this.children = [];

            this.children.splice(index, 0, node);

            node.canvas = this.canvas;
            node.parent = this;
            sceneMgr.app.markNotify(node, NotifyType.AddChild);
        }
        removeChild(node: transform2D)
        {
            if (node.parent != this || this.children == null)
            {
                throw new Error("not my child.");
            }
            var i = this.children.indexOf(node);
            if (i >= 0)
            {
                this.children.splice(i, 1);
            }
            sceneMgr.app.markNotify(node, NotifyType.RemoveChild);
        }


        removeAllChild()
        {
            while(this.children.length>0)
            {
                this.removeChild(this.children[0]);
            }
        }

        //矩阵关系

        markDirty()
        {
            this.dirty = true;
            var p = this.parent;
            while (p != null)
            {
                p.dirtyChild = true;
                p = p.parent;
            }
        }
        updateTran(parentChange: boolean)
        {
            //无刷
            if (this.dirtyChild == false && this.dirty == false && parentChange == false)
                return;

            if (this.dirty)
            {
                gd3d.math.matrix3x2MakeTransformRTS(this.localTranslate, this.localScale, this.localRotate, this.localMatrix);
            }
            if (this.dirty || parentChange)
            {
                if (this.parent == null)
                {
                    gd3d.math.matrix3x2Clone(this.localMatrix, this.worldMatrix);
                }
                else
                {
                    gd3d.math.matrix3x2Multiply(this.parent.worldMatrix, this.localMatrix, this.worldMatrix);
                }
                if (this.renderer != null)
                {
                    this.renderer.updateTran();
                }
                this.dirtyWorldDecompose = true;
            }

            if (this.children != null)
            {
                for (var i = 0; i < this.children.length; i++)
                {
                    this.children[i].updateTran(parentChange || this.dirty);
                }
            }
            this.dirty = false;
            this.dirtyChild = false;
        }
        updateWorldTran()
        {
            //parent 找到顶，第一个dirty的
            var p = this.parent;
            var dirtylist: transform2D[] = [];
            dirtylist.push(this);
            while (p != null)
            {
                if (p.dirty)
                    dirtylist.push(p);
                p = p.parent;
            }
            var top = dirtylist.pop();
            top.updateTran(false);
        }
        getWorldTranslate()
        {
            if (this.dirtyWorldDecompose)
            {
                math.matrix3x2Decompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
                this.dirtyWorldDecompose = false;
            }
            return this.worldTranslate;
        }
        getWorldScale()
        {
            if (this.dirtyWorldDecompose)
            {
                math.matrix3x2Decompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
                this.dirtyWorldDecompose = false;
            }
            return this.worldScale;
        }
        getWorldRotate()
        {
            if (this.dirtyWorldDecompose)
            {
                math.matrix3x2Decompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
                this.dirtyWorldDecompose = false;
            }
            return this.worldRotate;
        }
        getLocalMatrix(): gd3d.math.matrix3x2
        {
            return this.localMatrix;
        }
        getWorldMatrix(): gd3d.math.matrix3x2
        {
            return this.worldMatrix;
        }


        setWorldPosition(pos: math.vector2)
        {
            this.dirty = true;
            this.updateWorldTran();

            var thispos = this.getWorldTranslate();
            var dir = math.pool.new_vector2();
            dir.x = pos.x - thispos.x;
            dir.y = pos.y - thispos.y;

            var pworld = math.pool.new_matrix3x2();
            if (this.parent != null)
            {
                math.matrix3x2Clone(this.parent.worldMatrix, pworld);
            }
            else
            {
                math.matrix3x2MakeIdentity(pworld);
            }
            var matinv = math.pool.new_matrix3x2();
            math.matrix3x2Inverse(pworld, matinv);

            var dirinv = math.pool.new_vector2();
            math.matrix3x2TransformNormal(matinv, dir, dirinv);

            this.localTranslate.x += dirinv.x;
            this.localTranslate.y += dirinv.y;

            math.pool.delete_matrix3x2(matinv);
            math.pool.delete_vector2(dir);
            math.pool.delete_vector2(dirinv);
        }
        dispose()
        {
            if(this.children)
            {
                for (var k in this.children)
                {
                    this.children[k].dispose();
                }
                this.removeAllChild();
            }
            this.removeAllComponents();
        }
        //组件管理，原unity gameobject的部分
        //待渲染的数据
        renderer: IRectRenderer;
        // collider2d: boxcollider2d;
        @gd3d.reflect.Field("C2DComponent[]")
        components: C2DComponent[] = [];
        update(delta: number)
        {
            if (this.components != null)
            {
                for (var i = 0; i < this.components.length; i++)
                {
                    if (this.components[i].init == false)
                    {
                        this.components[i].comp.start();
                        this.components[i].init = true;
                    }
                    if (sceneMgr.app.bePlay && !sceneMgr.app.bePause)
                        this.components[i].comp.update(delta);
                }
            }
            if (this.children != null)
            {
                for (var i = 0; i < this.children.length; i++)
                {
                    this.children[i].update(delta);
                }
            }
        }
        addComponentDirect(comp: I2DComponent): I2DComponent
        {
            if (comp.transform != null)
            {
                throw new Error("this components has added to a  gameObject");
            }
            comp.transform = this;
            if (this.components == null)
                this.components = [];
            let _comp: C2DComponent = new C2DComponent(comp, false);
            this.components.push(_comp);
            if (reflect.getClassTag(comp["__proto__"], "renderer") == "1")
            {//这货是个渲染器

                if (this.renderer == null)
                {
                    this.renderer = comp as any;
                    // console.warn("add renderer:" + this.name);
                }
                else
                {
                    throw new Error("已经有一个渲染器的组件了，不能俩");
                }
            }
            // if (reflect.getClassTag(comp["__proto__"], "eventoarser") == "1")
            // {//这货是个boxcollider
            //     if (this.eventoarser == null)
            //     {
            //         this.eventoarser = comp as any;
            //         console.warn("add boxcollider2d:" + this.name);
            //     }
            //     else
            //     {
            //         throw new Error("已经有一个碰撞盒的组件了，不能俩");
            //     }
            // }
            return comp;
        }
        getComponent(type: string): I2DComponent
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
        getComponents(): I2DComponent[]
        {
            let components: I2DComponent[] = [];
            for (var i = 0; i < this.components.length; i++)
            {
                components.push(this.components[i].comp);
            }
            return components;
        }
        //包含自己
        getComponentsInChildren(type: string): I2DComponent[]
        {
            let components: I2DComponent[] = [];
            this.getNodeCompoents(this, type, components);

            return components;
        }

        private getNodeCompoents(node: transform2D, _type: string, comps: I2DComponent[])
        {
            for (var i in node.components)
            {
                var cname = gd3d.reflect.getClassName(node.components[i].comp["__proto__"]);
                if (cname == _type)
                {
                    comps.push(this.components[i].comp);
                }
            }
            if (node.children != null)
            {
                for (var i in node.children)
                {
                    this.getNodeCompoents(node.children[i], _type, comps);
                }
            }
        }


        addComponent(type: string): I2DComponent
        {
            if (this.components == null)
                this.components = [];
            for (var key in this.components)
            {
                var st = this.components[key]["comp"]["constructor"]["name"];
                if (st == type)
                {
                    throw new Error("已经有一个" + type + "的组件了，不能俩");
                }
            }
            var pp = gd3d.reflect.getPrototype(type);
            var comp = gd3d.reflect.createInstance(pp, { "2dcomp": "1" });
            return this.addComponentDirect(comp);
        }
        removeComponent(comp: I2DComponent)
        {
            for (var i = 0; i < this.components.length; i++)
            {
                if (this.components[i].comp == comp)
                {
                    if (this.components[i].init)
                    {//已经初始化过

                    }
                    this.components.splice(i, 1);
                }
            }
        }
        removeComponentByTypeName(type: string)
        {
            for (var i = 0; i < this.components.length; i++)
            {
                if (reflect.getClassName(this.components[i].comp) == type)
                {
                    var p = this.components.splice(i, 1);
                    if (p[0].comp == this.renderer) this.renderer = null;
                    return p[0];
                }
            }
        }

        removeAllComponents()
        {
            for (var i = 0; i < this.components.length; i++)
            {
                this.components[i].comp.remove();
                if (this.components[i].comp == this.renderer) this.renderer = null;
            }
            this.components.length = 0;
        }

        onCapturePointEvent(canvas: canvas, ev: PointEvent)
        {
            //event 捕捉阶段，正向
            if (this.components != null)
            {
                for (var i = 0; i <= this.components.length; i++)
                {
                    if (ev.eated == false)
                    {
                        var comp = this.components[i];
                        if (comp != null)
                            if (comp.init)
                            {
                                comp.comp.onPointEvent(canvas, ev, true);
                            }
                    }
                }
            }
            if (ev.eated == false)
            {
                if (this.children != null)
                {
                    for (var i = 0; i <= this.children.length; i++)
                    {
                        var c = this.children[i];
                        if (c != null)
                            c.onCapturePointEvent(canvas, ev);
                    }
                }
            }
        }
        ContainsPoint(p: math.vector2): boolean
        {
            var p2 = new math.vector2();
            p2.x = p.x + this.pivot.x * this.width;
            p2.y = p.y + this.pivot.y * this.height;
            return p2.x >= 0 && p2.y >= 0 && p2.x < this.width && p2.y < this.height;
        }
        ContainsCanvasPoint(pworld: math.vector2): boolean
        {
            var mworld = this.getWorldMatrix();
            var mout = new math.matrix3x2();
            gd3d.math.matrix3x2Inverse(mworld, mout);

            var p2 = new math.vector2();
            gd3d.math.matrix3x2TransformVector2(mout, pworld, p2);
            p2.x += this.pivot.x * this.width;
            p2.y += this.pivot.y * this.height;
            return p2.x >= 0 && p2.y >= 0 && p2.x < this.width && p2.y < this.height;

        }

        onPointEvent(canvas: canvas, ev: PointEvent)
        {
            //event 上升阶段,上升阶段事件会被吞掉
            if (this.children != null)
            {
                for (var i = this.children.length - 1; i >= 0; i--)
                {
                    if (ev.eated == false)
                    {
                        var c = this.children[i];
                        if (c != null)
                            c.onPointEvent(canvas, ev);
                        // if (ev.eated)
                        // {//事件刚刚被吃掉，
                        //     //这时是否要做点什么？
                        // }
                    }
                }
            }

            if (ev.eated == false && this.components != null)
            {

                for (var i = this.components.length - 1; i >= 0; i--)
                {
                    var comp = this.components[i];
                    if (comp != null)
                        if (comp.init)
                        {
                            comp.comp.onPointEvent(canvas, ev, false);
                        }
                }
            }



        }
    }
}