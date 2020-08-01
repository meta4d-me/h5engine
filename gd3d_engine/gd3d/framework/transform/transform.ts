/// <reference path="../../io/reflect.ts" />
namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * transform类 对应unity中transform概念
     * @version gd3d 1.0
     */
    @gd3d.reflect.SerializeType
    export class transform
    {
        private static readonly help_v3 = new gd3d.math.vector3();

        static readonly ClassName: string = "transform";

        private helpLRotate: math.quaternion = new math.quaternion();
        private helpLPos: math.vector3 = new math.vector3();
        private helpLScale: math.vector3 = new math.vector3(1, 1, 1);

        private static helpv2 = new math.vector2();
        private static helpv3 = new math.vector3();
        private static helpv3_1 = new math.vector3();
        private static helpUp = new math.vector3(0, 1, 0);
        private static helpRight = new math.vector3(1, 0, 0);
        private static helpFoward = new math.vector3(0, 0, 1);

        private static helpquat = new math.quaternion();
        private static helpquat_1 = new math.quaternion();

        private static helpmtx = new gd3d.math.matrix();

        private checkLRTSChange(): boolean
        {
            // if(!math.vec3Equal(this.helpLPos,this._localTranslate,Number.MIN_VALUE))
            //     return true;
            // if(!math.quatEqual(this.helpLRotate,this._localRotate,Number.MIN_VALUE))
            //     return true;
            // if(!math.vec3Equal(this.helpLScale,this._localScale,Number.MIN_VALUE))
            //     return true;

            // if (!this.fastEqual(this.helpLPos.rawData, this._localTranslate.rawData))
            //     return true;
            // if (!this.fastEqual(this.helpLRotate.rawData, this._localRotate.rawData))
            //     return true;
            // if (!this.fastEqual(this.helpLScale.rawData, this._localScale.rawData))
            //     return true;
            if (!this.fastEqual(this.helpLPos, this._localTranslate))
                return true;
            if (!this.fastEqual(this.helpLRotate, this._localRotate))
                return true;
            if (!this.fastEqual(this.helpLScale, this._localScale))
                return true;
            return false;
        }

        private fastEqual(d_0, d_1): boolean
        {
            if (d_0.x != d_1.x) return false;
            if (d_0.y != d_1.y) return false;
            if (d_0.z != d_1.z) return false;

            // if (d_0[0] != d_1[0]) return false;
            // if (d_0[1] != d_1[1]) return false;
            // if (d_0[2] != d_1[2]) return false;

            // if (d_0.length == 4 && d_0[3] != d_1[3])
            //     return false;
            return true;
        }

        private _scene: scene;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置所在场景实例
         * @param value 场景实例
         * @version gd3d 1.0
         */
        public set scene(value: scene)
        {
            this._scene = value;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所在场景
         * @version gd3d 1.0
         */
        public get scene(): scene
        {
            if (this._scene == null)
            {
                if (this._parent == null)
                    return null;
                this._scene = this._parent.scene;
            }
            return this._scene;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * transform名称
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("string")
        name: string = "noname";

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * transform唯一的insid
         * @version gd3d 1.0
         */
        public insId: insID = new insID();

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点依赖的prefab路径，如果不依赖，则为空
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("string")
        prefab: string = "";

        /**
         * [过时接口,完全弃用]
         */
        updateWorldTran()
        {
        }

        /**
         * [过时接口,完全弃用]
         * @param bool
         */
        updateTran(bool: boolean)
        {

        }

        // private aabbdirty: boolean = true;

        // /**
        // * @private
        // * @language zh_CN
        // * 标记aabb已修改
        // * @version gd3d 1.0
        // */
        // markAABBDirty()
        // {
        //     this.aabbdirty = true;
        //     this.markAABBChildDirty();//自己AABB变化了 整体的AABB（即包含所有子节点的AABB）肯定也需要改变

        //     //自己的AABB变化了 ，包含自己节点的总AABB也需要改变
        //     var p = this._parent;
        //     while (p != null)
        //     {
        //         p.markAABBChildDirty();
        //         p = p._parent;
        //     }
        // }

        // private aabbchilddirty: boolean = true;
        // /**
        // * @private
        // * @language zh_CN
        // * 标记aabb集合已修改
        // * @version gd3d 1.0
        // */
        // markAABBChildDirty()
        // {
        //     this.aabbchilddirty = true;
        // }

        private _dirtyAABB: boolean = true;

        private _aabb: aabb;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 自己的aabb
         * @version gd3d 1.0
         */
        get aabb()
        {

            if (!this._aabb)
            {
                this._aabb = this._buildAABB();
            }
            if (this._dirtyAABB)
            {
                this._aabb.update(this.getWorldMatrix());
                this._dirtyAABB = false;
            }
            return this._aabb;
        }

        // private _aabbchild: aabb=new gd3d.framework.aabb(math.pool.vector3_zero,math.pool.vector3_zero);
        // /**
        //  * @public
        //  * @language zh_CN
        //  * @classdesc
        //  * 包含自己和所有子物体的aabb
        //  * @version gd3d 1.0
        //  */
        // get aabbchild(){
        //     return this._aabbchild;
        // }

        /**
        * @private
        * @language zh_CN
        * 计算aabb
        * @version gd3d 1.0
        */
        // caclAABB()
        // {
        //     if (this.gameObject.components == null) return;
        //     if (this._aabb == null)
        //     {
        //         this._aabb = this.buildAABB();
        //         //this.aabbchild = this.aabb.clone();
        //         this._aabb.cloneTo(this._aabbchild);
        //     }
        //     this._aabb.update(this.worldMatrix);
        // }

        // /**
        // * @private
        // * @language zh_CN
        // * 计算aabb集合
        // * @version gd3d 1.0
        // */
        // caclAABBChild()
        // {
        //     if (this._aabb == null) return;
        //     //this.aabbchild = this.aabb.clone();
        //     this._aabb.cloneTo(this._aabbchild);

        //     if (this._children != null)
        //     {
        //         for (var i = 0; i < this._children.length; i++)
        //         {
        //             this._aabbchild.addAABB(this._children[i]._aabbchild);
        //         }
        //     }
        // }

        /** 创建过的 aabb 缓存 ，避免每次重复构建  */
        private static aabbStoreMap: { [key: number]: gd3d.math.vector3[] } = {};

        private static readonly aabbCareTypes = ["meshFilter", "skinnedMeshRenderer", "canvasRenderer"];
        /**
        * @private
        * @language zh_CN
        * 构建aabb
        * @version gd3d 1.0
        */
        private _buildAABB(): aabb
        {
            let minimum = new math.vector3();
            let maximum = new math.vector3();
            let _types = transform.aabbCareTypes;
            let len = _types.length;
            let matched = false;
            for (var i = 0; i < len; i++)
            {
                let t = _types[i];
                switch (t)
                {
                    case meshFilter.ClassName:
                        var filter = this.gameObject.getComponent("meshFilter") as meshFilter;
                        if (filter != null && filter.mesh != null && filter.mesh.data != null && filter.mesh.data.pos != null)
                        {
                            let m = filter.mesh;
                            let id = m.getGUID();
                            let min_max_v3 = transform.aabbStoreMap[id]; //优化 每次实例化都需构建
                            if (m.maximun && m.minimun)
                            {
                                minimum = m.minimun;
                                maximum = m.maximun;

                            } else if (min_max_v3)
                            {
                                minimum = min_max_v3[0];
                                maximum = min_max_v3[1];
                            } else
                            {
                                var meshdata: gd3d.render.meshData = m.data;
                                math.vec3SetByFloat(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                                math.vec3SetByFloat(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);
                                let len = meshdata.pos.length;
                                let pos = meshdata.pos;
                                for (var i = 0; i < len; i++)
                                {
                                    math.vec3Max(pos[i], maximum, maximum);
                                    math.vec3Min(pos[i], minimum, minimum);
                                }

                                transform.aabbStoreMap[id] = [minimum, maximum];
                            }

                            matched = true;
                        }
                        break;
                    case skinnedMeshRenderer.ClassName:
                        var skinmesh = this.gameObject.getComponent("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer;
                        if (skinmesh != null && skinmesh.mesh != null && skinmesh.mesh.data != null && skinmesh.mesh.data.pos != null)
                        {
                            let m = skinmesh.mesh;
                            let id = m.getGUID();
                            let min_max_v3 = transform.aabbStoreMap[id]; //优化 每次实例化都需构建
                            if (m.maximun && m.minimun)
                            {
                                minimum = m.minimun;
                                maximum = m.maximun;

                            } else if (min_max_v3)
                            {
                                minimum = min_max_v3[0];
                                maximum = min_max_v3[1];
                            } else
                            {
                                // NOTE: 如果当前物体有骨骼动画, 则不会使用这里的aabb进行剔除
                                var skinmeshdata: gd3d.render.meshData = skinmesh.mesh.data;
                                math.vec3SetByFloat(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                                math.vec3SetByFloat(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);

                                var p0 = gd3d.math.pool.new_vector3();

                                let len = skinmeshdata.pos.length;
                                for (var i = 0; i < len; i++)
                                {
                                    skinmesh.calActualVertexByIndex(i, p0);
                                    math.vec3Max(p0, maximum, maximum);
                                    math.vec3Min(p0, minimum, minimum);
                                }
                                gd3d.math.pool.delete_vector3(p0);

                                transform.aabbStoreMap[id] = [minimum, maximum];
                            }
                            matched = true;
                        }
                        break;
                    case canvasRenderer.ClassName:
                        var canvasR = this.gameObject.getComponent("canvasRenderer") as gd3d.framework.canvasRenderer;
                        if (canvasR && canvasR.canvas)
                        {
                            var cvs = canvasR.canvas;
                            var cPos = transform.helpv2;
                            gd3d.math.vec2Set(cPos, 0, 0);
                            var wPos_0 = transform.helpv3;
                            canvasR.calCanvasPosToWorldPos(cPos, wPos_0);

                            var wPos_1 = transform.helpv3_1;
                            gd3d.math.vec2Set(cPos, cvs.pixelWidth, cvs.pixelHeight);
                            canvasR.calCanvasPosToWorldPos(cPos, wPos_1);

                            gd3d.math.vec3Min(wPos_0, wPos_1, minimum);
                            gd3d.math.vec3Max(wPos_0, wPos_1, maximum);

                            matched = true;
                        }

                        break;
                }

                if (matched) break;
            }

            if (!matched)
            {
                minimum.x = minimum.y = minimum.z = -1;
                maximum.x = maximum.y = maximum.z = 1;
            }

            let _aabb = new aabb(minimum, maximum);
            return _aabb;
        }

        // private _children: transform[] = [];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 子物体列表
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("transform[]")
        children: transform[] = [];
        // get children()
        // {
        //     return this._children;
        // }
        // set children(children: transform[])
        // {
        //     this._children = children;
        // }

        private _physicsImpostor: PhysicsImpostor;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 物理代理对象
         * @version gd3d 1.0
         */
        get physicsImpostor()
        {
            return this._physicsImpostor;
        }
        set physicsImpostor(physicsImp: PhysicsImpostor)
        {
            this._physicsImpostor = physicsImp;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 父物体实例
         * @version gd3d 1.0
         */
        private _parent: transform;
        get parent()
        {
            return this._parent;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象RTS有变化了,视锥剔除使用
         * @version gd3d 1.0
         */
        dirtiedOfFrustumCulling = false;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否在任意摄像机视野内
         * @version gd3d 1.0
         */
        inCameraVisible = false;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前物体视锥剔除开关
         * @version gd3d 1.0
         */
        enableCulling = true;


        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加子物体实例
         * @param node 子物体实例
         * @version gd3d 1.0
         */
        addChild(node: transform)
        {
            this.addChildAt(node, this.children.length);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加子物体实例到索引位置
         * @param node 场景实例
         * @param index 索引位置
         * @version gd3d 1.0
         */
        addChildAt(node: transform, index: number)
        {
            if (index < 0)
                return;
            if (!node)
            {
                console.error(`node is null?? ${this.name}`);
                console.error(new Error().stack);
                return;
            }
            if (node._parent != null)
            {
                node._parent.removeChild(node);
            }
            if (this.children == null)
                this.children = [];

            this.children.splice(index, 0, node);
            node.scene = this.scene;
            node._parent = this;
            sceneMgr.app.markNotify(node, NotifyType.AddChild);
            if (node.hasComponent || node.hasComponentChild)
                this.markHaveComponent();

            if (node.hasRendererComp || node.hasRendererCompChild)
                this.markHaveRendererComp();

            node.dirtify(true);

        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除所有子物体
         * @version gd3d 1.0
         */
        removeAllChild(needDispose: boolean = false)
        {
            if (this.children == undefined) return;
            while (this.children.length > 0)
            {
                if (needDispose)
                    this.children[0].dispose();
                else
                    this.removeChild(this.children[0]);
            }

        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除指定子物体
         * @param node 子物体实例
         * @version gd3d 1.0
         */
        removeChild(node: transform)
        {
            if (node._parent != this || this.children == null)
            {
                console.warn("not my child.");
                return;
            }
            var i = this.children.indexOf(node);
            if (i >= 0)
            {
                this.children.splice(i, 1);
                sceneMgr.app.markNotify(node, NotifyType.RemoveChild);
                node._parent = null;
            }

        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 查找自己以及子物体中是否有指定名称的transform
         * @param name
         * @version gd3d 1.0
         */
        find(name: string): transform
        {
            if (this.name == name)
                return this;
            else
            {
                if (this.children != undefined)
                {
                    for (let i in this.children)
                    {
                        let res = this.children[i].find(name);
                        if (res != null)
                            return res;
                        else
                        {
                            continue;
                        }
                    }
                }
            }
            return null;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 判断是否与给定的transform有碰撞
         * @param tran 指定的transform
         * @version gd3d 1.0
         */
        checkImpactTran(tran: transform): boolean
        {
            if (this.gameObject.collider == null) return false;
            return this.gameObject.collider.intersectsTransform(tran);
        }

        //
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 返回场景中所有与当前tranform碰撞的transform
         * @version gd3d 1.0
         */
        checkImpact(): Array<transform>
        {
            var trans: Array<transform> = new Array<transform>();
            this.doImpact(this.scene.getRoot(), trans);
            return trans;
        }
        private doImpact(tran: transform, impacted: Array<transform>)
        {
            if (tran == this) return;
            if (tran.gameObject != null && tran.gameObject.collider != null)
            {
                if (this.checkImpactTran(tran))
                {
                    impacted.push(tran);
                }
            }
            if (tran.children != null)
            {
                for (var i = 0; i < tran.children.length; i++)
                {
                    this.doImpact(tran.children[i], impacted);
                }
            }
        }

        private dirtyLocal: boolean = false;
        private dirtyWorld: boolean = false;

        private dirtify(local = false)
        {
            this.dirtiedOfFrustumCulling = true;
            if ((!local || (local && this.dirtyLocal)) && this.dirtyWorld)
            {
                return;
            }

            if (local)
            {
                this.dirtyLocal = true;
            }

            if (!this.dirtyWorld)
            {
                this.dirtyWorld = true;
                let i = this.children.length;
                while (i--)
                {
                    if (this.children[i].dirtyWorld)
                    {
                        continue;
                    }
                    this.children[i].dirtify();
                }
            }

            //----------------------------------------
            //this.markAABBDirty(); //下阶段修改
            this._dirtyAABB = true;
        }

        //同步自己的 W 、L 矩阵
        private sync()
        {
            if (this.dirtyLocal)
            {
                math.matrixMakeTransformRTS(this._localTranslate, this._localScale, this._localRotate, this.localMatrix);
                math.vec3Clone(this._localTranslate, this.helpLPos);
                math.vec3Clone(this._localScale, this.helpLScale);
                math.quatClone(this._localRotate, this.helpLRotate);
                this.dirtyLocal = false;
            }

            if (this.dirtyWorld)
            {
                if (!this._parent)
                {
                    math.matrixClone(this.localMatrix, this.worldMatrix);
                } else
                {
                    math.matrixMultiply(this._parent.worldMatrix, this.localMatrix, this.worldMatrix);
                }

                this.dirtyWorld = false;
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * [ 过时接口,现不需要标记变化]
         * @version gd3d 1.0
         */
        markDirty()
        {
            // this.dirty = true;
            // var p = this._parent;
            // while (p != null)
            // {
            //     p.dirtyChild = true;
            //     p = p._parent;
            // }
        }
        markHaveComponent()
        {
            this.hasComponent = true;
            var p = this._parent;
            while (p != null)
            {
                p.hasComponentChild = true;
                p = p._parent;
            }
        }
        markHaveRendererComp()
        {
            this.hasRendererComp = true;
            var p = this._parent;
            while (p != null)
            {
                p.hasRendererCompChild = true;
                p = p._parent;
            }
        }

        // /**
        // * @private
        // * @language zh_CN
        // * @classdesc
        // * 刷新自己的aabb集合
        // * @version gd3d 1.0
        // */
        // updateAABBChild()
        // {
        //     if (this.aabbchilddirty)
        //     {
        //         if (this._children != null)
        //         {
        //             for (var i = 0; i < this._children.length; i++)
        //             {
        //                 this._children[i].updateAABBChild();
        //             }
        //         }
        //         this.caclAABBChild();
        //         this.aabbchilddirty = false;
        //     }
        // }

        public hasComponent: boolean = false; //自己是否有组件
        public hasComponentChild: boolean = false;  //子对象是否有组件
        public hasRendererComp: boolean = false; //自己是否有渲染器组件
        public hasRendererCompChild: boolean = false; //子对象是否有渲染器组件

        private _localRotate: math.quaternion = new math.quaternion();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地旋转四元数
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("quaternion")
        get localRotate()
        {
            return this._localRotate;
        }
        set localRotate(rotate: math.quaternion)
        {
            math.quatClone(rotate, this._localRotate);
            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        private _localTranslate: math.vector3 = new math.vector3(0, 0, 0);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地位移
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("vector3")
        get localTranslate()
        {
            return this._localTranslate;
        }
        set localTranslate(position: math.vector3)
        {
            math.vec3Clone(position, this._localTranslate);
            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 本地位移
        * @version gd3d 1.0
        */
        get localPosition()
        {
            return this._localTranslate;
        }
        set localPosition(position: math.vector3)
        {
            math.vec3Clone(position, this._localTranslate);
            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        private _localScale: math.vector3 = new math.vector3(1, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地缩放
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("vector3")
        get localScale()
        {
            return this._localScale;
        }
        set localScale(scale: math.vector3)
        {
            math.vec3Clone(scale, this._localScale);
            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        private localMatrix: math.matrix = new math.matrix();
        private _localEulerAngles: math.vector3 = new math.vector3(0, 0, 0);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地旋转的欧拉角
         * @version gd3d 1.0
         */
        get localEulerAngles(): math.vector3
        {
            math.quatToEulerAngles(this._localRotate, this._localEulerAngles);
            return this._localEulerAngles;
        }
        set localEulerAngles(angles: math.vector3)
        {
            math.quatFromEulerAngles(angles.x, angles.y, angles.z, this._localRotate);
            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        //这个是如果爹改了就要跟着算的
        private worldMatrix: math.matrix = new math.matrix();
        private worldRotate: math.quaternion = new math.quaternion();
        public worldTranslate: math.vector3 = new math.vector3(0, 0, 0);
        private worldScale: math.vector3 = new math.vector3(1, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的旋转
         * @version gd3d 1.0
         */
        getWorldRotate()
        {
            if (!this._parent || !this._parent._parent)
            {
                math.quatClone(this._localRotate, this.worldRotate);
            } else
            {
                math.matrixGetRotation(this.getWorldMatrix(), this.worldRotate);
            }
            return this.worldRotate;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform世界空间下的旋转
         *
         */
        setWorldRotate(rotate: math.quaternion)
        {
            if (!this._parent || !this._parent._parent)
            {
                math.quatClone(rotate, this._localRotate);
            } else
            {
                let tquat = transform.helpquat;
                let tquat_1 = transform.helpquat_1;
                math.quatClone(this._parent.getWorldRotate(), tquat);
                math.quatInverse(tquat, tquat_1);
                math.quatMultiply(tquat_1, rotate, this._localRotate);
            }

            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }
        //第一次计算世界坐标
        firstCalc: boolean = true;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的位移
         * @version gd3d 1.0
         */
        getWorldTranslate()
        {
            if (!this.firstCalc && this.gameObject.isStatic)
            {
                return this.worldTranslate;
            }
            if (!this._parent || !this._parent._parent)
            {
                math.vec3Clone(this._localTranslate, this.worldTranslate);
            } else
            {
                math.matrixGetTranslation(this.getWorldMatrix(), this.worldTranslate);
            }
            if (this.firstCalc)
                this.firstCalc = false;
            return this.worldTranslate;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的位移
         * @version gd3d 1.0
         */
        getWorldPosition()
        {
            if (!this._parent || !this._parent._parent)
            {
                math.vec3Clone(this._localTranslate, this.worldTranslate);
            } else
            {
                math.matrixGetTranslation(this.getWorldMatrix(), this.worldTranslate);
            }
            return this.worldTranslate;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform世界空间下的位移
         * @param pos 世界空间下的坐标
         * @version gd3d 1.0
         */
        setWorldPosition(pos: math.vector3)
        {
            if (!this._parent || !this._parent._parent)
            {
                math.vec3Clone(pos, this._localTranslate);
            } else
            {
                let tmtx = transform.helpmtx;
                math.matrixInverse(this._parent.getWorldMatrix(), tmtx);
                math.matrixTransformVector3(pos, tmtx, this._localTranslate);
            }

            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的缩放
         * @version gd3d 1.0
         */
        getWorldScale()
        {
            if (!this._parent || !this._parent._parent)
            {
                math.vec3Clone(this._localScale, this.worldScale);
            } else
            {
                math.matrixGetScale(this.getWorldMatrix(), this.worldScale);
            }
            return this.worldScale;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置世界坐标系下的缩放
         * @version gd3d 1.0
         */
        setWorldScale(scale: math.vector3)
        {
            if (!this._parent || !this._parent._parent)
            {
                math.vec3Clone(scale, this._localScale);
            } else
            {
                let tv3 = transform.helpv3;
                math.vec3Clone(this._parent.getWorldScale(), tv3);
                this._localScale.x = scale.x / tv3.x;
                this._localScale.y = scale.y / tv3.y;
                this._localScale.z = scale.z / tv3.z;
            }

            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取本地矩阵
         * @version gd3d 1.0
         */
        getLocalMatrix(): math.matrix
        {
            if (this.dirtyLocal)
            {
                math.matrixMakeTransformRTS(this._localTranslate, this._localScale, this._localRotate, this.localMatrix);
                math.vec3Clone(this._localTranslate, this.helpLPos);
                math.vec3Clone(this._localScale, this.helpLScale);
                math.quatClone(this._localRotate, this.helpLRotate);
                this.dirtyLocal = false;
            }
            return this.localMatrix;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界矩阵
         * @version gd3d 1.0
         */
        getWorldMatrix(): math.matrix
        {
            // if(!this.dirtyLocal){
            //     if(this.checkLRTSChange()){
            //         this.dirtify(true);
            //     }
            // }

            if (!this.dirtyLocal && !this.dirtyWorld)
            {
                this.checkToTop();
            }

            if (!this.dirtyLocal && !this.dirtyWorld)
            {
                return this.worldMatrix;
            }

            this.dirtiedOfFrustumCulling = true;

            //找dirty标记的 顶 ， 再刷新
            if (this._parent)
            {
                this._parent.getWorldMatrix();
            }

            this.sync();

            return this.worldMatrix;
        }

        private checkToTop()
        {
            let top: transform;
            let temp: transform = this;
            while (true)
            {
                if (temp.checkLRTSChange())
                {
                    temp.dirtyLocal = true;
                    //temp.dirtify(true);
                    top = temp;
                }

                if (!temp._parent) break;
                temp = temp._parent;
            }
            if (top)
            {
                top.dirtify(true);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下当前z轴的朝向
         * @version gd3d 1.0
         */
        getForwardInWorld(out: math.vector3)
        {
            math.matrixTransformNormal(transform.helpFoward, this.getWorldMatrix(), out);
            math.vec3Normalize(out, out);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下当前x轴的朝向
         * @version gd3d 1.0
         */
        getRightInWorld(out: math.vector3)
        {
            math.matrixTransformNormal(transform.helpRight, this.getWorldMatrix(), out);
            math.vec3Normalize(out, out);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下y轴的朝向
         * @version gd3d 1.0
         */
        getUpInWorld(out: math.vector3)
        {
            math.matrixTransformNormal(transform.helpUp, this.getWorldMatrix(), out);
            math.vec3Normalize(out, out);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform的世界矩阵 通过计算得到本地矩阵实现
         * @param mat 世界空间下矩阵
         * @version gd3d 1.0
         */
        setWorldMatrix(mat: math.matrix)
        {
            if (!this._parent)
            {
                math.matrixDecompose(mat, this._localScale, this._localRotate, this._localTranslate);
            } else
            {
                let tmtx = transform.helpmtx;
                math.matrixInverse(this._parent.getWorldMatrix(), tmtx);
                math.matrixMultiply(tmtx, mat, this.localMatrix);
                math.matrixDecompose(this.localMatrix, this._localScale, this._localRotate, this._localTranslate);
            }

            if (!this.dirtyLocal)
            {
                this.dirtify(true);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 旋转当前transform到z轴指向给定transform
         * @param trans 给定的transform
         * @version gd3d 1.0
         */
        lookat(trans: transform)
        {
            this.calcLookAt(trans.getWorldTranslate());
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 旋转当前transform到z轴指向给定坐标
         * @param point 给定的坐标
         * @version gd3d 1.0
         */
        lookatPoint(point: math.vector3)
        {
            this.calcLookAt(point);
        }

        private calcLookAt(point: math.vector3)
        {
            math.quatLookat(this.getWorldTranslate(), point, this.worldRotate);
            this.setWorldRotate(this.worldRotate);
        }
        constructor()
        {
            this.gameObject = new gameObject();
            this.gameObject.transform = this;
        }
        // private _gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取绑定的gameObject
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("gameObject")
        gameObject: gameObject;
        // get gameObject()
        // {
        //     if (this._gameObject == null)
        //     {
        //         this._gameObject = new gameObject();
        //         this._gameObject.transform = this;
        //     }
        //     return this._gameObject;
        // }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform的克隆
         * @version gd3d 1.0
         */
        clone(): transform
        {
            return io.cloneObj(this) as transform;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform是否被释放掉了
         * @version gd3d 1.0
         */
        get beDispose(): boolean
        {
            return this._beDispose;
        }
        private _beDispose: boolean = false;//是否被释放了

        public onDispose: () => void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放当前transform
         * @version gd3d 1.0
         */
        dispose()
        {
            if (this._parent) this._parent.removeChild(this);
            this._dispose();
        }

        private _dispose()
        {
            if (this._beDispose) return;
            // if (this.children)
            {
                // for (var k in this.children)
                // {
                //     this.children[k]._dispose();
                // }
                //this.removeAllChild();
                for (let i = 0, l = this.children.length; i < l; ++i)
                    this.children[i]._dispose();
                this.children = [];
            }
            if (this._physicsImpostor)
            {
                this._physicsImpostor.dispose();
            }
            // this._gameObject.dispose();
            this.gameObject.dispose();

            this._physicsImpostor = null;
            this._beDispose = true;
            if (this.onDispose)
                this.onDispose();

        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 作为引擎实例的唯一id使用 自增
     * @version gd3d 1.0
     */
    export class insID
    {
        constructor()
        {
            this.id = insID.next();
        }
        private static idAll: number = 1;
        private static next(): number
        {
            var next = insID.idAll;
            insID.idAll++;
            return next;
        }
        private id: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取唯一id
         * @version gd3d 1.0
         */
        getInsID(): number
        {
            return this.id;
        }
    }
}