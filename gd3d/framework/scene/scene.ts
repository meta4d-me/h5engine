namespace gd3d.framework
{
    //场景是基础的功能，有场景图，相当于Unity的Level
    export class scene
    {
        app: application;
        webgl: WebGLRenderingContext;
        constructor(app: application)
        {
            this.app = app;
            this.webgl = app.webgl;
            this.assetmgr = app.getAssetMgr();

            this.rootNode = new transform();
            this.rootNode.scene = this;
            this.renderList = new renderList();
        }
        name: string;
        private rootNode: transform;
        renderList: renderList;
        private assetmgr: assetMgr;

        public renderCameras: camera[] = [];//需要camera class 

        private _mainCamera: camera = null;
        public get mainCamera()
         {
            if(this._mainCamera == null)
            {
                this._mainCamera = this.renderCameras[0];
            }
             return this._mainCamera;
        }
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
        lightmaps: texture[] = [];//lightmap
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
            //但是场景管理的优化，可能针对每个camera 跑一遍
            //log coll
            document["log"] = {};

            document["log"].lights = this.renderLights.length;
            document["log"].cameras = [];



            //排序
            //排序camera 并绘制
            if (this.renderCameras.length > 1)
            {
                this.renderCameras.sort((a, b) =>
                {
                    return a.order - b.order;
                })
            }


            for (var i = 0; i < this.renderCameras.length; i++)
            {
                this.renderCameras[i].index = i;
                document["log"].cameras.push({});
                document["log"].cameras[i].name = this.renderCameras[i].gameObject.getName();
                document["log"].cameras[i].objs = [];
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
        }

        private RealCameraNumber: number = 0;
        //这个函数后面还有别的过程，应该留给camera
        private _renderCamera(camindex: number)
        {
            //增加当前编辑器状态，管控场编相机
            //一个camera 不是一次单纯的绘制，camera 还有多个绘制遍
            var cam = this.renderCameras[camindex];
            var context = this.renderContext[camindex];

            if (!this.app.bePlay && cam.gameObject.transform.name.toLowerCase().indexOf("editor") >= 0)
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
            else if (this.app.bePlay && cam.gameObject.transform.name.toLowerCase().indexOf("editor") < 0)
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


        // //要应用可见判断 和 场景管理，就是这里
        // private fillRenderer(node: transform, cam: camera) {
        //     if (node.gameObject != null && node.gameObject.renderer != null && node.gameObject.visible) {
        //         this.renderList.addRenderer(node.gameObject.renderer);
        //     }
        //     if (node.children != null) {
        //         for (var i = 0; i < node.children.length; i++) {
        //             this.fillRenderer(node.children[i], cam);
        //         }
        //     }
        // }
        updateScene(node: transform, delta)
        {
            if (node.gameObject != null)
            {
                node.gameObject.update(delta);
                //update 的时候只收集摄像机和灯光信息
                // this.renderList.addObj(node.gameObject);
                // //收集渲染物体
                // var r = node.gameObject.renderer;
                // if (r != null)
                // {
                //     this.renderList.addRenderer(r);
                // }
                //收集摄像机
                var c = node.gameObject.camera;
                if (c != null)
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
            if (node.children != null)
            {
                for (var i = 0; i < node.children.length; i++)
                {
                    this.updateScene(node.children[i], delta);
                }
            }
        }
        addChild(node: transform)
        {
            this.rootNode.addChild(node);
        }
        removeChild(node: transform)
        {
            this.rootNode.removeChild(node);
        }
        getChildren(): transform[]
        {
            return this.rootNode.children;
        }
        getChildCount(): number
        {
            if (this.rootNode.children == null) return 0;
            return this.rootNode.children.length;
        }
        getChild(index: number): transform
        {
            return this.rootNode.children[index];
        }
        getChildByName(name: string): transform
        {
            let res = this.rootNode.find(name);
            return res;
        }
        getRoot()
        {
            return this.rootNode;
        }

        public pickAll(ray: ray, isPickMesh: boolean = false): Array<pickinfo>
        {
            var picked = this.doPick(ray, true, isPickMesh) as Array<pickinfo>;
            if (picked == null) return null;
            return picked;
        }

        public pick(ray: ray, isPickMesh: boolean = false): pickinfo
        {
            var pickinfo = this.doPick(ray, false, isPickMesh) as pickinfo;
            if (pickinfo == null) return null;

            //pickinfo.pickedtran.gameObject.collider.subTran.gameObject.visible = !pickinfo.pickedtran.gameObject.collider.subTran.gameObject.visible;
            //pickinfo.pickedtran.markDirty();

            return pickinfo;
        }
        private doPick(ray: ray, pickall: boolean = false, isPickMesh: boolean = false): any
        {
            var pickedList: Array<pickinfo> = new Array<pickinfo>();
            if (isPickMesh)
            {
                this.pickMesh(ray, this.getRoot(), pickedList);
            }
            else
            {
                this.pickCollider(ray, this.getRoot(), pickedList);
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