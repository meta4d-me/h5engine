namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * ?ºæ?¯æ?¯å?ºç??????½ï????ºæ?¯å?¾ï??¸å?äº?Unity??Level
     * @version egret-gd3d 1.0
     */
    export class scene
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?¨å???applicationå®?ä¾?
         * @version egret-gd3d 1.0
         */
        app: application;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?¨å???webglå®?ä¾?
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
         * ?ºæ?¯å??ç§?         * @version egret-gd3d 1.0
         */
        name: string;
        private rootNode: transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * æ¸²æ????è¡?         * @version egret-gd3d 1.0
         */
        renderList: renderList;
        private assetmgr: assetMgr;
        private _overlay2d: Array<overlay2D>;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * æ·»å??ScreenSpaceOverlay
         * @version egret-gd3d 1.0
         */
        addScreenSpaceOverlay(overlay: overlay2D)
        {
            if (!overlay) return;
            if (!this._overlay2d) this._overlay2d = [];
            if (this._overlay2d.indexOf(overlay) != -1) return;
            this._overlay2d.push(overlay);
            this.sortOverLays(this._overlay2d);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ????creenSpaceOverlay
         * @version egret-gd3d 1.0
         */
        removeScreenSpaceOverlay(overlay)
        {
            if (!overlay || !this._overlay2d) return;
            let idx = this._overlay2d.indexOf(overlay);
            if (idx != -1) this._overlay2d.splice(idx, 1);
            this.sortOverLays(this._overlay2d);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ??ä¸?æ¸²æ?????¸æ??         * @version egret-gd3d 1.0
         */
        public renderCameras: camera[] = [];//??è¦?camera class 

        private _mainCamera: camera = null;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?·å??å½???ä¸»ç?¸æ??         * @version egret-gd3d 1.0
         */
        public get mainCamera()
        {
            if (this._mainCamera == null)
            {
                this._mainCamera = this.renderCameras[0];
            }
            return this._mainCamera;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * è®¾ç½®å½???ä¸»ç?¸æ??         * @param _camera ?¸æ?ºç?ä»¶å?ä¾?
         * @version egret-gd3d 1.0
         */
        public set mainCamera(_camera: camera)
        {
            for (let i in this.renderCameras)
            {
                if (this.renderCameras[i] == _camera)
                {
                    this._mainCamera = _camera;
                }
            }
        }
        public renderContext: renderContext[] = [];
        private renderLights: light[] = [];//??è¦???æº? class
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * lightmap??è¡?         * @version egret-gd3d 1.0
         */
        lightmaps: texture[] = [];//lightmap
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?¾æ??
         * @version egret-gd3d 1.0
         */
        fog: Fog;

        /**
         * lateUpdate
         */
        onLateUpdate : (delta: number) => any;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?ºæ?¯ç???·æ?°å?½æ??         * @param delta
         * @version egret-gd3d 1.0
         */
        update(delta: number)
        {
            

            //?´æ?°ç?©é??            this.rootNode.updateTran(false);
            this.rootNode.updateAABBChild();//?´æ?°å?tarn???´æ?°å??©ä?aabb ç¡®ä?æ¯?ä¸?ransform??aabbæ­£ç¡®

            //?´æ?°è?ä¸???ï¼??·å?ºæ¸²????è¡?            this.renderCameras.length = 0;
            this.renderLights.length = 0;
            this.renderList.clear();

            // aniplayer.playerCaches = [];

            //??å½????´æ?°ä?å¡«å??æ¸²æ????è¡?            this.updateScene(this.rootNode, delta);
            //lateupdate
            if(this.onLateUpdate)
                this.onLateUpdate(delta);

            //??åº?
            //??åº?camera å¹¶ç???            if (this.renderCameras.length > 1)
            {
                this.renderCameras.sort((a, b) =>
                {
                    return a.order - b.order;
                });
            }


            this.RealCameraNumber = 0;
            for (var i = 0; i < this.renderCameras.length; i++)
            {
                render.glDrawPass.resetLastState();
                this._renderCamera(i);
            }

            this.updateSceneOverLay(delta);

            if (this.RealCameraNumber == 0)
            {
                this.webgl.clearColor(0, 0, 0, 1);
                this.webgl.clearDepth(1.0);
                this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
            }
            this.webgl.flush();

            if(DrawCallInfo.BeActived)
            {
                DrawCallInfo.inc.showPerFrame();
                DrawCallInfo.inc.reset();
            }
        }

        //?´æ?°å??æ¸²æ?? scene overlayers
        private updateSceneOverLay(delta: number)
        {
            if (!this._overlay2d || this._overlay2d.length < 1) return;

            let targetcamera = this.mainCamera;
            if (!this._overlay2d || !targetcamera) return;
            let mainCamIdx = this.renderCameras.indexOf(targetcamera);
            if (mainCamIdx == -1)
            {
                let cname = targetcamera.gameObject.getName();
                let oktag = false;
                for (var i = 0; i < this.renderCameras.length; i++)
                {
                    let cam = this.renderCameras[i];
                    if (cam && cam.gameObject.getName() == cname)
                    {
                        targetcamera = this.mainCamera = cam;
                        oktag = true;
                        break;
                    }
                }
                if (!oktag)
                {
                    this._mainCamera = null;
                    targetcamera = this.mainCamera;
                }
            }
            mainCamIdx = this.renderCameras.indexOf(targetcamera);
            if (!targetcamera) return;
            if (this._overlay2d)
            {
                this._overlay2d.forEach(overlay =>
                {
                    if (overlay)
                    {
                        overlay.start(targetcamera);
                        overlay.update(delta);
                        overlay.render(this.renderContext[mainCamIdx], this.assetmgr, targetcamera);
                    }
                });
            }

            //test----
            // for(var i=0;i< this.renderCameras.length;i++){
            //     let cam = this.renderCameras[i];
            //     let contx = this.renderContext[i];
            //     if(!cam || !contx) return;
            //     if(this._overlay2d){
            //         this._overlay2d.forEach(overlay=>{
            //             if(overlay){
            //                 overlay.start( cam);
            //                 overlay.update(delta);
            //                 overlay.render(contx, this.assetmgr, cam);
            //             }
            //         });
            //     }
            // }
        }

        private RealCameraNumber: number = 0;
        //è¿?ä¸ªå?½æ?°å???¢è????«ç??è¿?ç¨?ï¼?åº?è¯¥ç??ç»?camera
        private _renderCamera(camindex: number)
        {
            //å¢???å½???ç¼?è¾??¨ç?¶æ??ï¼?ç®¡æ?§å?ºç??¸æ??            //ä¸?ä¸?amera ä¸??¯ä?æ¬¡å??çº¯ç??ç»??¶ï?camera è¿???å¤?ä¸ªç??¶é??
            var cam = this.renderCameras[camindex];
            var context = this.renderContext[camindex];
            //sceneMgr.camera=cam;
            if (this.app.bePlay && cam.gameObject.transform.name.toLowerCase().indexOf("editor") < 0)
            {
                context.updateCamera(this.app, cam);
                context.updateLights(this.renderLights);
                cam.fillRenderer(this);
                cam.renderScene(this, context);
                this.RealCameraNumber++;

                // //è¿???overlay
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
                //----------------------------------?ºç??¸æ?ºç??overlayå±?ç¤?---------------------------------------------------
                if (this.app.be2dstate)
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
            if (!this.app.bePlay && this.app.be2dstate)
            {
                if (camindex == this.app.curcameraindex)
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

        private sortOverLays(lays: IOverLay[])
        {
            if (!lays || lays.length < 1) return;
            lays.sort((a, b) =>
            {
                return a.sortOrder - b.sortOrder;
            });
        }

        private updateScene(node: transform, delta)
        {
            if (this.app.bePlay)
            {
                this.objupdate(node, delta);
            }
            else
            {
                this.objupdateInEditor(node, delta);
            }
        }

        private objupdateInEditor(node: transform, delta)//?ºç?ä¸?
        {
            node.gameObject.init();//ç»?ä»¶è??ªå??å§???????å§???
            if (node.gameObject.renderer != null)
            {
                node.gameObject.renderer.update(delta);//update äº???            }
            var c = node.gameObject.camera;
            if (c != null)
            {
                node.gameObject.camera.update(delta);//update äº???            }

            this.collectCameraAndLight(node);

            if (node.children != null)
            {
                for (var i = 0; i < node.children.length; i++)
                {
                    this.objupdateInEditor(node.children[i], delta);
                }
            }
        }
        private objupdate(node: transform, delta)//play?¶æ??ä¸?
        {
            if (node.hasComponent == false && node.hasComponentChild == false)
                return;
            node.gameObject.init(this.app.bePlay);//ç»?ä»¶è??ªå??å§???????å§???
            if (node.gameObject.components.length > 0)
            {
                node.gameObject.update(delta);

                this.collectCameraAndLight(node);
            }
            if (node.children)
            {
                for (let item of node.children)
                    this.objupdate(item, delta);
                // for (var i = 0; i < node.children.length; i++)
                // {
                //     this.objupdate(node.children[i], delta);
                // }
            }
        }

        private collectCameraAndLight(node: transform)
        {
            //update ???¶å???ªæ?¶é???????ºå???¯å??ä¿¡æ??            //?¶é????????            var c = node.gameObject.camera;
            if (c != null && c.gameObject.visibleInScene)
            {
                this.renderCameras.push(c);
            }
            while (this.renderContext.length < this.renderCameras.length)
            {
                this.renderContext.push(new renderContext(this.webgl));
            }
            //?¶é???¯å??
            var l = node.gameObject.light;
            if (l != null && node.gameObject.visible)
            {
                this.renderLights.push(l);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?ºæ?¯æ?¹è???¹ä?æ·»å???©ä?
         * @param node è¦?æ·»å????transform
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
         * ?ºæ?¯æ?¹è???¹ä?ç§»å?ºç?©ä?
         * @param node è¦?ç§»å?ºç??transform
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
         * ?·å??children??è¡?         * @version egret-gd3d 1.0
         */
        getChildren(): transform[]
        {
            return this.rootNode.children;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?·å??children?°é??
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
         * ?¹æ?®ç´¢å¼??·å??child
         * @param index ç´¢å?
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
         * ?¹æ??ame?·å??child
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
         * ?·å???ºæ?¯æ?¹è????         * @version egret-gd3d 1.0
         */
        getRoot()
        {
            return this.rootNode;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?·å??å°?çº¿è·¯å¾?ä¸????????©ä?
         * @param ray å°?çº¿å?ä¾?
         * @param isPickMesh ?¯å?¦ä¸º?¾å??mesh ?¦ä¸º?¾å??collider
         * @version egret-gd3d 1.0
         */
        public pickAll(ray: ray, outInfos: pickinfo[], isPickMesh: boolean = false, root: transform = this.getRoot(), layermask: number = NaN): boolean
        {
            if (!outInfos || !ray) return false;
            let isHited = this.doPick(ray, true, isPickMesh, root, outInfos, layermask);
            return isHited;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * ?·å??å°?çº¿æ?¾å???°ç????è¿??©ä?
         * @param ray å°?çº¿å?ä¾?
         * @param isPickMesh ?¯å?¦ä¸º?¾å??mesh ?¦ä¸º?¾å??collider
         * @version egret-gd3d 1.0
         */
        public pick(ray: ray, outInfo: pickinfo, isPickMesh: boolean = false, root: transform = this.getRoot(), layermask: number = NaN): boolean
        {
            if (!outInfo || !ray) return false;
            let isHited = this.doPick(ray, false, isPickMesh, root, outInfo, layermask);
            return isHited;

            //pickinfo.pickedtran.gameObject.collider.subTran.gameObject.visible = !pickinfo.pickedtran.gameObject.collider.subTran.gameObject.visible;
            //pickinfo.pickedtran.markDirty();

        }
        private doPick(ray: ray, pickall: boolean, isPickMesh: boolean, root: transform, out: any, layermask: number = NaN): boolean
        {
            let ishited = false;
            var pickedList: Array<pickinfo> = new Array<pickinfo>();
            if (isPickMesh)
            {
                ishited = this.pickMesh(ray, root, pickedList, layermask);
            }
            else
            {
                ishited = this.pickCollider(ray, root, pickedList, layermask);
            }

            if (pickedList.length == 0) return ishited;

            if (pickall)
            {
                out.length = 0;
                pickedList.forEach(element =>
                {
                    out.push(element);
                });
            }
            else
            {
                var index = 0;
                for (var i = 1; i < pickedList.length; i++)
                {
                    if (pickedList[i].distance < pickedList[index].distance) index = i;
                }
                //return pickedList[index];
                let temp = pickedList.splice(index, 1);
                (out as pickinfo).cloneFrom(temp[0]);
                pickedList.forEach(element =>
                {
                    math.pool.delete_pickInfo(element);
                });
                pickedList.length = 0;
            }

            return ishited;
        }

        private pickMesh(ray: ray, tran: transform, pickedList: pickinfo[], layermask: number = NaN): boolean
        {
            let ishited = false;
            if (tran.gameObject != null)
            {
                if (!tran.gameObject.visible) return ishited;
                let canDo = true;
                //if(!isNaN(layermask) && layermask != tran.gameObject.layer) canDo = false;
                if (!isNaN(layermask) && (layermask & (1 << tran.gameObject.layer)) == 0) canDo = false;
                if (canDo)
                {
                    var meshFilter = tran.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
                    if (meshFilter != null)
                    {
                        //3d normal mesh
                        var mesh = meshFilter.getMeshOutput();
                        if (mesh)
                        {
                            let pinfo = math.pool.new_pickInfo();
                            let bool = mesh.intersects(ray, tran.getWorldMatrix(), pinfo);
                            if (bool)
                            {
                                ishited = true;
                                pickedList.push(pinfo);
                                pinfo.pickedtran = tran;
                            }
                        }
                    }
                    else
                    {
                        var skinmesh = tran.gameObject.getComponent("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer;
                        if (skinmesh != null)
                        {
                            //3d skinmesh
                            let pinfo = math.pool.new_pickInfo();
                            var bool = skinmesh.intersects(ray, pinfo);
                            if (bool)
                            {
                                ishited = true;
                                pickedList.push(pinfo);
                                pinfo.pickedtran = tran;
                            }
                        }

                    }
                }
            }
            if (tran.children != null)
            {
                for (var i = 0; i < tran.children.length; i++)
                {
                    let bool = this.pickMesh(ray, tran.children[i], pickedList, layermask);
                    if (!ishited)
                        ishited = bool;
                }
            }
            return ishited;
        }

        private pickCollider(ray: ray, tran: transform, pickedList: Array<pickinfo>, layermask: number = NaN): boolean
        {
            let ishited = false;
            if (tran.gameObject != null)
            {
                if (!tran.gameObject.visible) return ishited;
                if (tran.gameObject.collider != null)
                {
                    let canDo = true;
                    if (!isNaN(layermask) && (layermask & (1 << tran.gameObject.layer)) == 0) canDo = false;
                    //console.error(`${tran.gameObject.layer}  --  ${layermask}`);
                    if (canDo)
                    {
                        //??äº?collider
                        let pinfo = math.pool.new_pickInfo();
                        var bool = ray.intersectCollider(tran, pinfo);
                        if (bool)
                        {
                            ishited = true;
                            pickedList.push(pinfo);
                            pinfo.pickedtran = tran;
                        }
                    }
                }
            }
            if (tran.children != null)
            {
                for (var i = 0; i < tran.children.length; i++)
                {
                    let bool = this.pickCollider(ray, tran.children[i], pickedList, layermask);
                    if (!ishited)
                        ishited = bool;
                }
            }
            return ishited;
        }
    }
}