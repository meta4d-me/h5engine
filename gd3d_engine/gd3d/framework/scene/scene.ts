namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 场景是基础的功能，有场景图，相当于Unity的Level
     * @version egret-gd3d 1.0
     */
    export class scene
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 全局的application实例
         * @version egret-gd3d 1.0
         */
        app: application;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 全局的webgl实例
         * @version egret-gd3d 1.0
         */
        webgl: WebGLRenderingContext;
        /**
         * @private
         * @param app 
         */
        constructor(app: application)
        {
            this.app = app;
            this.webgl = app.webgl;
            this.assetmgr = app.getAssetMgr();

            this.rootNode = new transform();
            this.rootNode.scene = this;
            this.renderList = new renderList();
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景名称
         * @version egret-gd3d 1.0
         */
        name: string;
        private rootNode: transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染列表
         * @version egret-gd3d 1.0
         */
        renderList: renderList;
        private assetmgr: assetMgr;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 参与渲染的相机
         * @version egret-gd3d 1.0
         */
        public renderCameras: camera[] = [];//需要camera class 

        private _mainCamera: camera = null;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前主相机
         * @version egret-gd3d 1.0
         */
        public get mainCamera()
         {
            if(this._mainCamera == null)
            {
                this._mainCamera = this.renderCameras[0];
            }
             return this._mainCamera;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置当前主相机
         * @param _camera 相机组件实例
         * @version egret-gd3d 1.0
         */
        public set mainCamera(_camera: camera) {
            for (let i in this.renderCameras) {
                if (this.renderCameras[i] == _camera)
                {
                    this._mainCamera = _camera;
                }
            }
        }
        private renderContext: renderContext[] = [];
        private renderLights: light[] = [];//需要光源 class
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * lightmap列表
         * @version egret-gd3d 1.0
         */
        lightmaps: texture[] = [];//lightmap
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 雾效
         * @version egret-gd3d 1.0
         */
        fog:Fog;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景的刷新函数
         * @param delta
         * @version egret-gd3d 1.0
         */
        update(delta: number)
        {
            //更新矩阵
            this.rootNode.updateTran(false);
            this.rootNode.updateAABBChild();//更新完tarn再更新子物体aabb 确保每个transform的aabb正确

            //更新跑一遍，刷出渲染列表
            this.renderCameras.length = 0;
            this.renderLights.length = 0;
            this.renderList.clear();

            //递归的更新与填充渲染列表
            this.updateScene(this.rootNode, delta);

            //排序
            //排序camera 并绘制
            if (this.renderCameras.length > 1)
            {
                this.renderCameras.sort((a, b) =>
                {
                    return a.order - b.order;
                })
            }


            this.RealCameraNumber = 0;
            for (var i = 0; i < this.renderCameras.length; i++)
            {
                this._renderCamera(i);
            }
            
            if (this.RealCameraNumber == 0)
            {
                this.webgl.clearColor(0, 0, 0, 1);
                this.webgl.clearDepth(1.0);
                this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
            }
            this.webgl.flush();
        }

        private RealCameraNumber: number = 0;
        //这个函数后面还有别的过程，应该留给camera
        private _renderCamera(camindex: number)
        {
            //增加当前编辑器状态，管控场编相机
            //一个camera 不是一次单纯的绘制，camera 还有多个绘制遍
            var cam = this.renderCameras[camindex];
            var context = this.renderContext[camindex];

            if (this.app.bePlay && cam.gameObject.transform.name.toLowerCase().indexOf("editor") < 0)
            {
                context.updateCamera(this.app, cam);
                context.updateLights(this.renderLights);
                cam.fillRenderer(this);
                cam.renderScene(this, context);
                this.RealCameraNumber++;

                // //还有overlay
                let overLays: IOverLay[] = cam.getOverLays();
                for (var i = 0; i < overLays.length; i++)
                {
                    if (cam.CullingMask & CullingMask.ui)
                    {
                        overLays[i].render(context, this.assetmgr, cam);         
                    }
                }
            }
            else if (!this.app.bePlay && cam.gameObject.transform.name.toLowerCase().indexOf("editor") >= 0)
            {
                context.updateCamera(this.app, cam);
                context.updateLights(this.renderLights);
                cam.fillRenderer(this);
                cam.renderScene(this, context);
                this.RealCameraNumber++;
                //----------------------------------场编相机的overlay展示----------------------------------------------------
                if(this.app.be2dstate)
                {
                    let overLays: IOverLay[] = cam.getOverLays();
                    for (var i = 0; i < overLays.length; i++)
                    {
                        if (cam.CullingMask & CullingMask.ui)
                        {
                            overLays[i].render(context, this.assetmgr, cam);         
                        }
                    }
                }
            }
            if(!this.app.bePlay&&this.app.be2dstate)
            {
                if (camindex==this.app.curcameraindex)
                {
                    let overLays: IOverLay[] = cam.getOverLays();
                    for (var i = 0; i < overLays.length; i++)
                    {
                        if (cam.CullingMask & CullingMask.ui)
                        {
                            overLays[i].render(context, this.assetmgr, cam);         
                        }
                    }
                }
            }

        }

        private updateScene(node: transform, delta)
        {
            if(this.app.bePlay)
            {
                this.objupdate(node,delta);
            }
            else
            {
                this.objupdateInEditor(node,delta);
            }
        }

        private objupdateInEditor(node: transform, delta)//场编下
        {
            node.gameObject.init();//组件还未初始化的初始化
            if(node.gameObject.renderer!=null)
            {
                node.gameObject.renderer.update(delta);//update 了啥
            }
            var c = node.gameObject.camera;
            if(c!=null)
            {
                node.gameObject.camera.update(delta);//update 了啥
            }
            
            this.collectCameraAndLight(node);

            if (node.children != null)
            {
                for (var i = 0; i < node.children.length; i++)
                {
                    this.objupdateInEditor(node.children[i], delta);
                }
            }
        }
        private objupdate(node: transform, delta)//play状态下
        {
            node.gameObject.init();//组件还未初始化的初始化
            if(node.gameObject.components.length>0)
            {
                node.gameObject.update(delta);

                this.collectCameraAndLight(node);
            }
            if (node.children != null)
            {
                for (var i = 0; i < node.children.length; i++)
                {
                    this.objupdate(node.children[i], delta);
                }
            }
        }

        private collectCameraAndLight(node: transform)
        {
            //update 的时候只收集摄像机和灯光信息
            //收集摄像机
            var c = node.gameObject.camera;
            if (c != null && c.gameObject.visibleInScene)
            {
                this.renderCameras.push(c);
            }
            while (this.renderContext.length < this.renderCameras.length)
            {
                this.renderContext.push(new renderContext(this.webgl));
            }
            //收集灯光
            var l = node.gameObject.light;
            if (l != null)
            {
                this.renderLights.push(l);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景根节点下添加物体
         * @param node 要添加的transform
         * @version egret-gd3d 1.0
         */
        addChild(node: transform)
        {
            this.rootNode.addChild(node);
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景根节点下移出物体
         * @param node 要移出的transform
         * @version egret-gd3d 1.0
         */
        removeChild(node: transform)
        {
            this.rootNode.removeChild(node);
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取children列表
         * @version egret-gd3d 1.0
         */
        getChildren(): transform[]
        {
            return this.rootNode.children;
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取children数量
         * @version egret-gd3d 1.0
         */
        getChildCount(): number
        {
            if (this.rootNode.children == null) return 0;
            return this.rootNode.children.length;
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据索引获取child
         * @param index 索引
         * @version egret-gd3d 1.0
         */
        getChild(index: number): transform
        {
            return this.rootNode.children[index];
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据name获取child
         * @param name
         * @version egret-gd3d 1.0
         */
        getChildByName(name: string): transform
        {
            let res = this.rootNode.find(name);
            return res;
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取场景根节点
         * @version egret-gd3d 1.0
         */
        getRoot()
        {
            return this.rootNode;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取射线路径上的所有物体
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh 否为拾取collider
         * @version egret-gd3d 1.0
         */
        public pickAll(ray: ray, isPickMesh: boolean = false, root: transform = this.getRoot()): Array<pickinfo>
        {
            var picked = this.doPick(ray, true, isPickMesh, root) as Array<pickinfo>;
            if (picked == null) return null;
            return picked;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取射线拾取到的最近物体
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh 否为拾取collider
         * @version egret-gd3d 1.0
         */
        public pick(ray: ray, isPickMesh: boolean = false, root: transform = this.getRoot()): pickinfo
        {
            var pickinfo = this.doPick(ray, false, isPickMesh, root) as pickinfo;
            if (pickinfo == null) return null;

            //pickinfo.pickedtran.gameObject.collider.subTran.gameObject.visible = !pickinfo.pickedtran.gameObject.collider.subTran.gameObject.visible;
            //pickinfo.pickedtran.markDirty();

            return pickinfo;
        }
        private doPick(ray: ray, pickall: boolean, isPickMesh: boolean, root: transform): any
        {
            var pickedList: Array<pickinfo> = new Array<pickinfo>();
            if (isPickMesh)
            {
                this.pickMesh(ray, root, pickedList);
            }
            else
            {
                this.pickCollider(ray, root, pickedList);
            }

            if (pickedList.length == 0) return null;

            if (pickall)
            {
                return pickedList;
            }
            else
            {
                var index = 0;
                for (var i = 1; i < pickedList.length; i++)
                {
                    if (pickedList[i].distance < pickedList[index].distance) index = i;
                }
                return pickedList[index];
            }
        }

        private pickMesh(ray: gd3d.framework.ray, tran: gd3d.framework.transform, pickedList: Array<gd3d.framework.pickinfo>)
        {
            if (tran.gameObject != null)
            {
                if (!tran.gameObject.visible) return;
                var meshFilter = tran.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
                if (meshFilter != null)
                {
                    //3d normal mesh
                    var mesh = meshFilter.getMeshOutput();
                    var pickinfo = mesh.intersects(ray, tran.getWorldMatrix());
                    if (pickinfo)
                    {
                        pickedList.push(pickinfo);
                        pickinfo.pickedtran = tran;
                    }
                }
                else
                {
                    var skinmesh = tran.gameObject.getComponent("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer;
                    if (skinmesh != null)
                    {
                        //3d skinmesh
                        var pickinfo = skinmesh.intersects(ray);
                        if (pickinfo)
                        {
                            pickedList.push(pickinfo);
                            pickinfo.pickedtran = tran;
                        }
                    }

                }
            }
            if (tran.children != null)
            {
                for (var i = 0; i < tran.children.length; i++)
                {
                    this.pickMesh(ray, tran.children[i], pickedList);
                }
            }
        }

        private pickCollider(ray: ray, tran: transform, pickedList: Array<pickinfo>)
        {
            if (tran.gameObject != null)
            {
                if (!tran.gameObject.visible) return;
                if (tran.gameObject.collider != null)
                {
                    //挂了collider
                    var pickinfo = ray.intersectCollider(tran);
                    if (pickinfo)
                    {
                        pickedList.push(pickinfo);
                        pickinfo.pickedtran = tran;
                    }
                }
            }
            if (tran.children != null)
            {
                for (var i = 0; i < tran.children.length; i++)
                {
                    this.pickCollider(ray, tran.children[i], pickedList);
                }
            }
        }
    }
}