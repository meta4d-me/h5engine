/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * transform类 对应unity中transform概念
     * @version egret-gd3d 1.0
     */
    @gd3d.reflect.SerializeType
    export class transform 
    {
        private _scene: scene;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置所在场景实例
         * @param value 场景实例
         * @version egret-gd3d 1.0
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
         * @version egret-gd3d 1.0
         */
        public get scene(): scene
        {
            if (this._scene == null)
            {
                if (this.parent == null)
                    return null;
                this._scene = this.parent.scene;
            }
            return this._scene;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * transform名称
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("string")
        name: string = "noname";

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * transform唯一的insid
         * @version egret-gd3d 1.0
         */
        public insId: insID = new insID();

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点依赖的prefab路径，如果不依赖，则为空
         * @version egret-gd3d 1.0
         */
        prefab: string = null;

        private aabbdirty: boolean = true;

        /**
        * @private
        * @language zh_CN
        * 标记aabb已修改
        * @version egret-gd3d 1.0
        */
        markAABBDirty()
        {
            this.aabbdirty = true;
            this.markAABBChildDirty();//自己脏了 大aabb肯定脏了

            var p = this.parent;
            while (p != null)
            {
                p.markAABBChildDirty();
                p = p.parent;
            }
        }

        private aabbchilddirty: boolean = true;
        /**
        * @private
        * @language zh_CN
        * 标记aabb集合已修改
        * @version egret-gd3d 1.0
        */
        markAABBChildDirty()
        {
            this.aabbchilddirty = true;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 自己的aabb
         * @version egret-gd3d 1.0
         */
        aabb: aabb;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 包含自己和所有子物体的aabb
         * @version egret-gd3d 1.0
         */
        aabbchild: aabb;

        /**
        * @private
        * @language zh_CN
        * 计算aabb
        * @version egret-gd3d 1.0
        */
        caclAABB()
        {
            if (this.gameObject.components == null) return;
            if (this.aabb == null)
            {
                this.aabb = this.buildAABB();
                this.aabbchild = this.aabb.clone();
            }
            this.aabb.update(this.worldMatrix);
        }

        /**
        * @private
        * @language zh_CN
        * 计算aabb集合
        * @version egret-gd3d 1.0
        */
        caclAABBChild()
        {
            if (this.aabb == null) return;
            this.aabbchild = this.aabb.clone();
            if (this.children != null)
            {
                for (var i = 0; i < this.children.length; i++)
                {
                    this.aabbchild.addAABB(this.children[i].aabbchild);
                }
            }
        }

        /**
        * @private
        * @language zh_CN
        * 构建aabb
        * @version egret-gd3d 1.0
        */
        buildAABB(): aabb  
        {
            var minimum = new gd3d.math.vector3();
            var maximum = new gd3d.math.vector3();

            var filter = this.gameObject.getComponent("meshFilter") as meshFilter;
            if (filter != null && filter.mesh != null && filter.mesh.data != null && filter.mesh.data.pos != null)
            {
                var meshdata: gd3d.render.meshData = filter.mesh.data;
                gd3d.math.vec3SetByFloat(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                gd3d.math.vec3SetByFloat(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);

                for (var i = 0; i < meshdata.pos.length; i++)
                {
                    gd3d.math.vec3Max(meshdata.pos[i], maximum, maximum);
                    gd3d.math.vec3Min(meshdata.pos[i], minimum, minimum);
                }
            }
            else
            {
                var skinmesh = this.gameObject.getComponent("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer;
                if (skinmesh != null && skinmesh.mesh != null && skinmesh.mesh.data != null && skinmesh.mesh.data.pos != null)
                {
                    var skinmeshdata: gd3d.render.meshData = skinmesh.mesh.data;
                    gd3d.math.vec3SetByFloat(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                    gd3d.math.vec3SetByFloat(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);

                    for (var i = 0; i < skinmeshdata.pos.length; i++)
                    {
                        gd3d.math.vec3Max(skinmeshdata.pos[i], maximum, maximum);
                        gd3d.math.vec3Min(skinmeshdata.pos[i], minimum, minimum);
                    }
                }
                else
                {
                    minimum.x = -1;
                    minimum.y = -1;
                    minimum.z = -1;

                    maximum.x = 1;
                    maximum.y = 1;
                    maximum.z = 1;

                }
            }
            var _aabb = new aabb(minimum, maximum);
            return _aabb;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 子物体列表
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("transform[]")
        children: transform[];


        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 父物体实例
         * @version egret-gd3d 1.0
         */
        parent: transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加子物体实例
         * @param node 子物体实例
         * @version egret-gd3d 1.0
         */
        addChild(node: transform)
        {
            if (node.parent != null)
            {
                node.parent.removeChild(node);
            }
            if (this.children == null)
                this.children = [];
            this.children.push(node);
            node.scene = this.scene;
            node.parent = this;
            sceneMgr.app.markNotify(node, NotifyType.AddChild);
            if (node.hasComponent || node.hasComponentChild)
                this.markHaveComponent();

            if(node.hasRendererComp || node.hasRendererCompChild)
                this.markHaveRendererComp();
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加子物体实例到索引位置
         * @param node 场景实例
         * @param index 索引位置
         * @version egret-gd3d 1.0
         */
        addChildAt(node: transform, index: number)
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
            node.scene = this.scene;
            node.parent = this;
            sceneMgr.app.markNotify(node, NotifyType.AddChild);
            if (node.hasComponent || node.hasComponentChild)
                this.markHaveComponent();

            if(node.hasRendererComp || node.hasRendererCompChild)
                this.markHaveRendererComp();
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除所有子物体
         * @version egret-gd3d 1.0
         */
        removeAllChild()
        {
            if(this.children==undefined) return;
            while (this.children.length > 0)
            {
                this.removeChild(this.children[0]);
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除指定子物体
         * @param node 子物体实例
         * @version egret-gd3d 1.0
         */
        removeChild(node: transform)
        {
            if (node.parent != this || this.children == null)
            {
                throw new Error("not my child.");
            }
            var i = this.children.indexOf(node);
            if (i >= 0)
            {
                this.children.splice(i, 1);
                sceneMgr.app.markNotify(node, NotifyType.RemoveChild);
                node.parent = null;
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 查找自己以及子物体中是否有指定名称的transform
         * @param name
         * @version egret-gd3d 1.0
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
         * @version egret-gd3d 1.0
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
         * @version egret-gd3d 1.0
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
        //矩阵关系

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 标记需要刷新数据
         * @version egret-gd3d 1.0
         */
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
        markHaveComponent()
        {
            this.hasComponent = true;
            var p = this.parent;
            while (p != null)
            {
                p.dirtyChild = true;
				p.hasComponentChild = true;
                p = p.parent;
            }
        }
        markHaveRendererComp(){
            this.hasRendererComp = true;
            var p = this.parent;
            while (p != null)
            {
                p.dirtyChild = true;
				p.hasRendererCompChild = true;
                p = p.parent;
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 刷新transform状态
         * @param parentChange 父物体是否需要刷新
         * @version egret-gd3d 1.0
         */
        updateTran(parentChange: boolean)
        {
            //无刷
            if (this.dirtyChild == false && this.dirty == false && parentChange == false)
                return;

            if (this.dirty)
            {
                gd3d.math.matrixMakeTransformRTS(this.localTranslate, this.localScale, this.localRotate, this.localMatrix);
            }
            if (this.dirty || parentChange)
            {
                if (this.parent == null)
                {
                    gd3d.math.matrixClone(this.localMatrix, this.worldMatrix);
                }
                else
                {
                    gd3d.math.matrixMultiply(this.parent.worldMatrix, this.localMatrix, this.worldMatrix);
                }
                this.dirtyWorldDecompose = true;
                this.markAABBDirty();
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

            if (this.aabbdirty)
            {
                //transform里只更新自己的aabb
                this.caclAABB();
                this.aabbdirty = false;
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 刷新自己这一条线，以得到正确的worldMatrix信息
         * @version egret-gd3d 1.0
         */
        updateWorldTran()
        {
            //parent 找到顶，第一个dirty的
            var p = this.parent;
            var dirtylist: transform[] = [];
            dirtylist.push(this);
            while (p != null)
            {
                if (p.dirty)
                    dirtylist.push(p);
                p = p.parent;
            }
            var top = dirtylist.pop();
            top.updateTran(false);
            // math.matrixDecompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
        }

        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 刷新自己的aabb集合
        * @version egret-gd3d 1.0
        */
        updateAABBChild()
        {
            if (this.aabbchilddirty)
            {
                if (this.children != null)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        this.children[i].updateAABBChild();
                    }
                }
                this.caclAABBChild();
                this.aabbchilddirty = false;
            }
        }

        private dirty: boolean = true;//自己是否需要更新
        private dirtyChild: boolean = true;//子层是否需要更新

        public hasComponent: boolean = false; //自己是否有组件
        public hasComponentChild: boolean = false;  //子对象是否有组件

        public hasRendererComp:boolean = false; //自己是否有渲染器组件
        public hasRendererCompChild:boolean = false; //子对象是否有渲染器组件

        private dirtyWorldDecompose: boolean = false;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地旋转四元数
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("quaternion")
        localRotate: gd3d.math.quaternion = new gd3d.math.quaternion();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地位移
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("vector3", new gd3d.math.vector3(0, 0, 0))
        localTranslate: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地缩放
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("vector3", new gd3d.math.vector3(1, 1, 1))
        localScale: gd3d.math.vector3 = new gd3d.math.vector3(1, 1, 1);
        private localMatrix: gd3d.math.matrix = new gd3d.math.matrix();

        private _localEulerAngles: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取本地旋转的欧拉角
         * @version egret-gd3d 1.0
         */
        get localEulerAngles(): gd3d.math.vector3
        {
            math.quatToEulerAngles(this.localRotate, this._localEulerAngles);
            return this._localEulerAngles;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置本地旋转的欧拉角
         * @version egret-gd3d 1.0
         */
        set localEulerAngles(angle: gd3d.math.vector3)
        {
            math.quatFromEulerAngles(angle.x, angle.y, angle.z, this.localRotate);
        }

        //这个是如果爹改了就要跟着算的
        private worldMatrix: gd3d.math.matrix = new gd3d.math.matrix();
        private worldRotate: gd3d.math.quaternion = new gd3d.math.quaternion();
        private worldTranslate: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        private worldScale: gd3d.math.vector3 = new gd3d.math.vector3(1, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的位移
         * @version egret-gd3d 1.0
         */
        getWorldTranslate()
        {
            if (this.dirtyWorldDecompose)
            {
                math.matrixDecompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
                this.dirtyWorldDecompose = false;
            }
            //math.vec3Format(this.worldTranslate, 4, this.worldTranslate);
            return this.worldTranslate;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的缩放
         * @version egret-gd3d 1.0
         */
        getWorldScale()
        {
            if (this.dirtyWorldDecompose)
            {
                math.matrixDecompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
                this.dirtyWorldDecompose = false;
            }
            //math.vec3Format(this.worldScale, 4, this.worldScale);
            return this.worldScale;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的旋转
         * @version egret-gd3d 1.0
         */
        getWorldRotate()
        {
            if (this.dirtyWorldDecompose)
            {
                math.matrixDecompose(this.worldMatrix, this.worldScale, this.worldRotate, this.worldTranslate);
                this.dirtyWorldDecompose = false;
            }
            //math.quaternionFormat(this.worldRotate, 4, this.worldRotate);
            return this.worldRotate;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取本地矩阵
         * @version egret-gd3d 1.0
         */
        getLocalMatrix(): gd3d.math.matrix
        {
            return this.localMatrix;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界矩阵
         * @version egret-gd3d 1.0
         */
        getWorldMatrix(): gd3d.math.matrix
        {
            return this.worldMatrix;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下当前z轴的朝向
         * @version egret-gd3d 1.0
         */
        getForwardInWorld(out: gd3d.math.vector3)
        {
            var forward = gd3d.math.pool.new_vector3();
            forward.x = 0;
            forward.y = 0;
            forward.z = 1;
            gd3d.math.matrixTransformNormal(forward, this.worldMatrix, out);
            gd3d.math.vec3Normalize(out, out);
            gd3d.math.pool.delete_vector3(forward);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下当前x轴的朝向
         * @version egret-gd3d 1.0
         */
        getRightInWorld(out: gd3d.math.vector3)
        {
            var right = gd3d.math.pool.new_vector3();
            right.x = 1;
            right.y = 0;
            right.z = 0;
            gd3d.math.matrixTransformNormal(right, this.worldMatrix, out);
            gd3d.math.vec3Normalize(out, out);
            gd3d.math.pool.delete_vector3(right);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下y轴的朝向
         * @version egret-gd3d 1.0
         */
        getUpInWorld(out: gd3d.math.vector3)
        {
            var up = gd3d.math.pool.new_vector3();
            up.x = 0;
            up.y = 1;
            up.z = 0;
            gd3d.math.matrixTransformNormal(up, this.worldMatrix, out);
            gd3d.math.vec3Normalize(out, out);
            gd3d.math.pool.delete_vector3(up);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform的世界矩阵 通过计算得到本地矩阵实现
         * @param mat 世界空间下矩阵
         * @version egret-gd3d 1.0
         */
        setWorldMatrix(mat: math.matrix)
        {
            this.dirty = true;
            this.updateWorldTran();

            var pworld = math.pool.new_matrix();
            if (this.parent != null)
            {
                math.matrixClone(this.parent.worldMatrix, pworld);
            }
            else
            {
                math.matrixMakeIdentity(pworld);
            }
            var invparentworld = math.pool.new_matrix();
            math.matrixInverse(pworld, invparentworld);


            math.matrixClone(mat, this.worldMatrix);
            this.dirtyWorldDecompose = true;
            //这个乘反了
            math.matrixMultiply(invparentworld, this.worldMatrix, this.localMatrix);
            math.matrixDecompose(this.localMatrix, this.localScale, this.localRotate, this.localTranslate);
            this.markDirty();

            math.pool.delete_matrix(pworld);
            math.pool.delete_matrix(invparentworld);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform世界空间下的位移
         * @param pos 世界空间下的坐标
         * @version egret-gd3d 1.0
         */
        setWorldPosition(pos: math.vector3)
        {
            this.dirty = true;
            this.updateWorldTran();

            var pworld = math.pool.new_matrix();
            if (this.parent != null)
            {
                math.matrixClone(this.parent.worldMatrix, pworld);
            }
            else
            {
                math.matrixMakeIdentity(pworld);
            }
            var invparentworld = math.pool.new_matrix();
            math.matrixInverse(pworld, invparentworld);

            this.worldMatrix.rawData[12] = pos.x;
            this.worldMatrix.rawData[13] = pos.y;
            this.worldMatrix.rawData[14] = pos.z;

            math.matrixMultiply(invparentworld, this.worldMatrix, this.localMatrix);
            math.matrixDecompose(this.localMatrix, this.localScale, this.localRotate, this.localTranslate);
            this.markDirty();

            math.pool.delete_matrix(pworld);
            math.pool.delete_matrix(invparentworld);

            //不正规的做法  这里是要变换到父节点的空间下就对了
            //将world tran 移动到 pos位置
            // this.dirty = true;
            // this.updateWorldTran();

            // //求个world空间偏移量
            // var thispos = this.getWorldTranslate();
            // var dir = math.pool.new_vector3();
            // dir.x = pos.x - thispos.x;
            // dir.y = pos.y - thispos.y;
            // dir.z = pos.z - thispos.z;

            // var pworld = math.pool.new_matrix();
            // if (this.parent != null)
            // {
            //     math.matrixClone(this.parent.worldMatrix, pworld);
            // }
            // else
            // {
            //     math.matrixMakeIdentity(pworld);
            // }
            // //拿反矩阵
            // var matinv = math.pool.new_matrix();
            // math.matrixInverse(pworld, matinv);

            // //将偏移量转换会local space
            // var dirinv = math.pool.new_vector3();
            // math.matrixTransformNormal(dir, matinv, dirinv);

            // //应用偏移
            // this.localTranslate.x += dirinv.x;
            // this.localTranslate.y += dirinv.y;
            // this.localTranslate.z += dirinv.z;

            // math.pool.delete_matrix(matinv);
            // math.pool.delete_vector3(dir);
            // math.pool.delete_vector3(dirinv);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 旋转当前transform到z轴指向给定transform
         * @param trans 给定的transform
         * @version egret-gd3d 1.0
         */
        lookat(trans: transform)
        {
            this.dirty = true;
            trans.updateWorldTran();//确保worldmatrix正确，这个计算比较慢
            this.updateWorldTran();

            var p0 = this.getWorldTranslate();
            var p1 = trans.getWorldTranslate();

            var d = math.pool.new_vector3();//池化处理

            gd3d.math.vec3Subtract(p1, p0, d);

            var quatworld = math.pool.new_quaternion();
            var quat = math.pool.new_quaternion();
            gd3d.math.quatLookat(p0, p1, quatworld);
            var quatworldCur = this.parent.getWorldRotate();
            math.quatInverse(quatworldCur, quat);
            math.quatMultiply(quat, quatworld, this.localRotate);

            math.pool.delete_vector3(d);//归还vector3,不归还也没多大毛病，多几个gc而已，也许v8能搞定
            math.pool.delete_quaternion(quatworld);
            math.pool.delete_quaternion(quat);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 旋转当前transform到z轴指向给定坐标
         * @param point 给定的坐标
         * @version egret-gd3d 1.0
         */
        lookatPoint(point: math.vector3)
        {
            this.dirty = true;
            this.updateWorldTran();

            var p0 = this.getWorldTranslate();
            var p1 = point;

            var d = math.pool.new_vector3();//池化处理
            gd3d.math.vec3Subtract(p1, p0, d);

            var quatworld = math.pool.new_quaternion();
            var quat = math.pool.new_quaternion();
            gd3d.math.quatLookat(p0, p1, quatworld);
            var quatworldCur = this.parent.getWorldRotate();
            math.quatInverse(quatworldCur, quat);
            math.quatMultiply(quat, quatworld, this.localRotate);

            this.markDirty();

            math.pool.delete_vector3(d);//归还vector3,不归还也没多大毛病，多几个gc而已，也许v8能搞定
            math.pool.delete_quaternion(quatworld);
            math.pool.delete_quaternion(quat);
        }
        private _gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取绑定的gameObject
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("gameObject")
        get gameObject()
        {
            if (this._gameObject == null)
            {
                this._gameObject = new gameObject();
                this._gameObject.transform = this;
            }
            return this._gameObject;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform的克隆
         * @version egret-gd3d 1.0
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
         * @version egret-gd3d 1.0
         */
        get beDispose():boolean
        {
            return this._beDispose;
        }
        private _beDispose:boolean = false;//是否被释放了 
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放当前transform
         * @version egret-gd3d 1.0
         */
        dispose()
        {
            if(this._beDispose)  return;
            if (this.children)
            {
                for (var k in this.children)
                {
                    this.children[k].dispose();
                }
                this.removeAllChild();
            }
            this._gameObject.dispose();
            this._beDispose = true;
        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 作为引擎实例的唯一id使用 自增
     * @version egret-gd3d 1.0
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
         * @version egret-gd3d 1.0
         */
        getInsID(): number
        {
            return this.id;
        }
    }
}