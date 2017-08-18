/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @private
     */
    export interface ICameraPostQueue
    {
        render(scene: scene, context: renderContext, camera: camera);
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    export class cameraPostQueue_Depth implements ICameraPostQueue
    {
        constructor()
        {
            this.renderTarget = null;
        }
        render(scene: scene, context: renderContext, camera: camera)
        {

            //最后一个参数true 表示不用camera的clear 配置
            camera._targetAndViewport(this.renderTarget, scene, context, true);
            context.webgl.depthMask(true);//zwrite 會影響clear depth，這個查了好一陣
            gd3d.render.glDrawPass.lastZWrite = true;
            context.webgl.clearColor(0, 0, 0, 0);
            context.webgl.clearDepth(1.0);
            context.webgl.clear(context.webgl.COLOR_BUFFER_BIT | context.webgl.DEPTH_BUFFER_BIT);
            camera._renderOnce(scene, context, "_depth");
            render.glRenderTarget.useNull(context.webgl);
        }
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    export class cameraPostQueue_Quad implements ICameraPostQueue
    {
        material: material;//shader & uniform
        constructor()
        {
            this.renderTarget = null;
            this.material = new material();
        }
        render(scene: scene, context: renderContext, camera: camera)
        {


            camera._targetAndViewport(this.renderTarget, scene, context, true);

            context.webgl.depthMask(true);//zwrite 會影響clear depth，這個查了好一陣
            gd3d.render.glDrawPass.lastZWrite = true;
            context.webgl.clearColor(0, 0.3, 0, 0);
            context.webgl.clearDepth(1.0);
            context.webgl.clear(context.webgl.COLOR_BUFFER_BIT | context.webgl.DEPTH_BUFFER_BIT);
            var mesh = scene.app.getAssetMgr().getDefaultMesh("quad");
            //画四边形
            context.drawtype = "";
            mesh.glMesh.bindVboBuffer(context.webgl);
            this.material.draw(context, mesh, mesh.submesh[0], "quad");
        }
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    export class cameraPostQueue_Color implements ICameraPostQueue
    {
        constructor()
        {
            this.renderTarget = null;
        }
        render(scene: scene, context: renderContext, camera: camera)
        {
            camera._targetAndViewport(this.renderTarget, scene, context, false);
            camera._renderOnce(scene, context, "");
            render.glRenderTarget.useNull(context.webgl);
        }
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    export interface IOverLay
    {
        init: boolean;
        start(camera: camera);
        render(context: renderContext, assetmgr: assetMgr, camera: camera);
        update(delta: number);
    }
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 视锥剔除组件，作为标记存在
    * @version egret-gd3d 1.0
    */
    @reflect.nodeComponent
    @reflect.nodeCamera
    export class camera implements INodeComponent
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version egret-gd3d 1.0
         */
        gameObject: gameObject;

        private _near: number = 0.01;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机到近裁剪面距离
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.UIStyle("rangeFloat", 1, 1000, 2)//加上这个标记，编辑器就能读取这个显示ui了
        @gd3d.reflect.Field("number")
        get near(): number
        {
            return this._near;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置相机到近裁剪面距离
         * @version egret-gd3d 1.0
         */
        set near(val: number)
        {
            if (this.opvalue > 0)
            {
                if (val < 0.01) val = 0.01;
            }
            if (val >= this.far) val = this.far - 0.01;
            this._near = val;
        }
        private _far: number = 1000;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机到远裁剪面距离
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.UIStyle("rangeFloat", 1, 1000, 999)
        @gd3d.reflect.Field("number")
        get far(): number
        {
            return this._far;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置相机到远裁剪面距离
         * @version egret-gd3d 1.0
         */
        set far(val: number)
        {
            if (val <= this.near) val = this.near + 0.01;
            this._far = val;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为主相机
         * @version egret-gd3d 1.0
         */
        public isMainCamera: boolean = false;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机的渲染层级
         * @version egret-gd3d 1.0
         */
        CullingMask: CullingMask = CullingMask.default | CullingMask.ui;
        //CullingMask: CullingMask = CullingMask.everything;
        /**
         * @private
         */
        index: number;
        /**
         * @private
         */
        @reflect.compCall({ "use": "dirty", "display": "刷新camera" })
        markDirty()
        {

        }
        start()
        {
        }
        update(delta: number)
        {
            for (var i = 0; i < this.overlays.length; i++)
            {
                if (!this.overlays[i].init)
                {
                    this.overlays[i].start(this);
                    this.overlays[i].init = true;
                }
                this.overlays[i].update(delta);
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否清除颜色缓冲区
         * @version egret-gd3d 1.0
         */
        clearOption_Color: boolean = true;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否清除深度缓冲区
         * @version egret-gd3d 1.0
         */
        clearOption_Depth: boolean = true;
        // backgroundColor: gd3d.math.color = new gd3d.math.color(0.11, 0.11, 0.11, 1.0);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 背景色
         * @version egret-gd3d 1.0
         */
        backgroundColor: gd3d.math.color = new gd3d.math.color(0.5, 0.8, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机视窗
         * @version egret-gd3d 1.0
         */
        viewport: gd3d.math.rect = new gd3d.math.rect(0, 0, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染目标
         * @version egret-gd3d 1.0
         */
        renderTarget: gd3d.render.glRenderTarget = null;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * camera 渲染排序标记
         * @version egret-gd3d 1.0
         */
        order: number = 0;//camera 渲染顺序
        @gd3d.reflect.Field("IOverLay[]")
        private overlays: IOverLay[] = [];
        /**
         * @public
         * @language zh_CN
         * @param overlay 2d组件
         * @classdesc
         * 添加2d渲染组件
         * @version egret-gd3d 1.0
         */
        addOverLay(overLay: IOverLay)
        {
            // if (overLay instanceof overlay2D)
            // {
            //     let lay = overLay as overlay2D;
            //     if (lay.camera != null)
            //     {
            //         lay.camera.removeOverLay(lay);
            //     }
            // }
            this.overlays.push(overLay);
        }
        /**
         * @public
         * @language zh_CN
         * @param overlay 2d组件
         * @param index 在overlays对应位置添加组件
         * @classdesc
         * 添加2d渲染组件
         * @version egret-gd3d 1.0
         */
        addOverLayAt(overLay: IOverLay, index: number)
        {
            // if (overLay instanceof overlay2D)
            // {
            //     let lay = overLay as overlay2D;
            //     if (lay.camera != null)
            //     {
            //         lay.camera.removeOverLay(lay);
            //     }
            // }
            this.overlays.splice(index, 0, overLay);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 返回此相机上的overlays数组
         * @version egret-gd3d 1.0
         */
        getOverLays()
        {
            return this.overlays;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除相机上的所有overly
         * @version egret-gd3d 1.0
         */
        removeOverLay(overLay: IOverLay)
        {
            if (this.overlays == null)
                return;
            let index = this.overlays.indexOf(overLay);
            if (index >= 0)
                this.overlays.splice(index, 1);
        }
        /**
         * @public
         * @language zh_CN
         * @param matrix 返回的视矩阵
         * @classdesc
         * 计算相机的viewmatrix（视矩阵）
         * @version egret-gd3d 1.0
         */
        calcViewMatrix(matrix: gd3d.math.matrix)
        {
            var camworld = this.gameObject.transform.getWorldMatrix();
            //视矩阵刚好是摄像机世界矩阵的逆
            gd3d.math.matrixInverse(camworld, this.matView);



            gd3d.math.matrixClone(this.matView, matrix);
            return;
        }
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param viewportpixel 视口rect
         * @classdesc
         * 计算相机视口像素rect
         * @version egret-gd3d 1.0
         */
        calcViewPortPixel(app: application, viewPortPixel: math.rect)
        {

            var w: number;
            var h: number;
            if (this.renderTarget == null)
            {
                w = app.width;
                h = app.height;
            }
            else
            {
                w = this.renderTarget.width;
                h = this.renderTarget.height;
            }
            viewPortPixel.x = w * this.viewport.x;
            viewPortPixel.y = h * this.viewport.y;
            viewPortPixel.w = w * this.viewport.w;
            viewPortPixel.h = h * this.viewport.h;
            //asp = this.viewPortPixel.w / this.viewPortPixel.h;

        }
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param matrix projectmatrix（投影矩阵）
         * @classdesc
         * 计算相机投影矩阵
         * @version egret-gd3d 1.0
         */
        calcProjectMatrix(asp: number, matrix: gd3d.math.matrix)
        {
            if (this.opvalue > 0)
                math.matrixProject_PerspectiveLH(this.fov, asp, this.near, this.far, this.matProjP);
            if (this.opvalue < 1)
                math.matrixProject_OrthoLH(this.size * asp, this.size, this.near, this.far, this.matProjO);

            if (this.opvalue == 0)
                math.matrixClone(this.matProjO, this.matProj);
            else if (this.opvalue == 1)
                math.matrixClone(this.matProjP, this.matProj);
            else
                math.matrixLerp(this.matProjO, this.matProjP, this.opvalue, this.matProj);
            //投影矩阵函数缺一个
            gd3d.math.matrixClone(this.matProj, matrix);
        }
        /**
         * @public
         * @language zh_CN
         * @param screenpos 屏幕坐标
         * @param app 主程序
         * @classdesc
         * 由屏幕坐标发射射线
         * @version egret-gd3d 1.0
         */
        public creatRayByScreen(screenpos: gd3d.math.vector2, app: application): ray
        {
            var src1 = gd3d.math.pool.new_vector3();
            src1.x = screenpos.x;
            src1.y = screenpos.y;
            src1.z = 0;
            var src2 = gd3d.math.pool.new_vector3();
            src2.x = screenpos.x;
            src2.y = screenpos.y;
            src2.z = 1;
            var dest1 = gd3d.math.pool.new_vector3();
            var dest2 = gd3d.math.pool.new_vector3();
            this.calcWorldPosFromScreenPos(app, src1, dest1);
            this.calcWorldPosFromScreenPos(app, src2, dest2);

            var dir = gd3d.math.pool.new_vector3();
            gd3d.math.vec3Subtract(dest2, dest1, dir);
            gd3d.math.vec3Normalize(dir, dir);
            var ray = new gd3d.framework.ray(dest1, dir);

            gd3d.math.pool.delete_vector3(src1);
            gd3d.math.pool.delete_vector3(src2);
            gd3d.math.pool.delete_vector3(dest1);
            gd3d.math.pool.delete_vector3(dest2);
            gd3d.math.pool.delete_vector3(dir);
            return ray;
        }
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param screenpos 屏幕坐标
         * @param outWorldPos 世界坐标
         * @classdesc
         * 由屏幕坐标得到世界坐标
         * @version egret-gd3d 1.0
         */
        calcWorldPosFromScreenPos(app: application, screenPos: math.vector3, outWorldPos: math.vector3)
        {
            var vpp = new math.rect();
            this.calcViewPortPixel(app, vpp);
            var vppos = new math.vector2(screenPos.x / vpp.w * 2 - 1, 1 - screenPos.y / vpp.h * 2);
            var matrixView = new gd3d.math.matrix();
            var matrixProject = new gd3d.math.matrix();
            var asp = vpp.w / vpp.h;
            this.calcViewMatrix(matrixView);
            this.calcProjectMatrix(asp, matrixProject);
            var matrixViewProject = new gd3d.math.matrix();
            var matinv = new gd3d.math.matrix();
            gd3d.math.matrixMultiply(matrixProject, matrixView, matrixViewProject);
            gd3d.math.matrixInverse(matrixViewProject, matinv);
            var src1 = new math.vector3(vppos.x, vppos.y, screenPos.z);
            gd3d.math.matrixTransformVector3(src1, matinv, outWorldPos);

        }
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param worldPos 世界坐标
         * @param outScreenPos 屏幕坐标
         * @classdesc
         * 由世界坐标得到屏幕坐标
         * @version egret-gd3d 1.0
         */
        calcScreenPosFromWorldPos(app: application, worldPos: math.vector3, outScreenPos: math.vector2)
        {
            var vpp = new math.rect();
            this.calcViewPortPixel(app, vpp);
            var matrixView = new gd3d.math.matrix();
            var matrixProject = new gd3d.math.matrix();
            var asp = vpp.w / vpp.h;
            this.calcViewMatrix(matrixView);
            this.calcProjectMatrix(asp, matrixProject);
            var matrixViewProject = new gd3d.math.matrix();
            gd3d.math.matrixMultiply(matrixProject, matrixView, matrixViewProject);

            var ndcPos = gd3d.math.pool.new_vector3();
            gd3d.math.matrixTransformVector3(worldPos, matrixViewProject, ndcPos);
            outScreenPos.x = (ndcPos.x + 1) * vpp.w / 2;
            outScreenPos.y = (1 - ndcPos.y) * vpp.h / 2;
        }
        /**
         * @private
         * @param app
         */
        calcCameraFrame(app: application)
        {
            var _vpp = new math.rect();
            this.calcViewPortPixel(app, _vpp);

            var near_h = this.near * Math.tan(this.fov * 0.5);
            var asp = _vpp.w / _vpp.h;
            var near_w = near_h * asp;

            var nearLT = new gd3d.math.vector3(-near_w, near_h, this.near);
            var nearLD = new gd3d.math.vector3(-near_w, -near_h, this.near);
            var nearRT = new gd3d.math.vector3(near_w, near_h, this.near);
            var nearRD = new gd3d.math.vector3(near_w, -near_h, this.near);

            var far_h = this.far * Math.tan(this.fov * 0.5);
            var far_w = far_h * asp;

            var farLT = new gd3d.math.vector3(-far_w, far_h, this.far);
            var farLD = new gd3d.math.vector3(-far_w, -far_h, this.far);
            var farRT = new gd3d.math.vector3(far_w, far_h, this.far);
            var farRD = new gd3d.math.vector3(far_w, -far_h, this.far);

            let matrix = this.gameObject.transform.getWorldMatrix();
            gd3d.math.matrixTransformVector3(farLD, matrix, farLD);
            gd3d.math.matrixTransformVector3(nearLD, matrix, nearLD);
            gd3d.math.matrixTransformVector3(farRD, matrix, farRD);
            gd3d.math.matrixTransformVector3(nearRD, matrix, nearRD);
            gd3d.math.matrixTransformVector3(farLT, matrix, farLT);
            gd3d.math.matrixTransformVector3(nearLT, matrix, nearLT);
            gd3d.math.matrixTransformVector3(farRT, matrix, farRT);
            gd3d.math.matrixTransformVector3(nearRT, matrix, nearRT);
            this.frameVecs.length = 0;
            this.frameVecs.push(farLD);
            this.frameVecs.push(nearLD);
            this.frameVecs.push(farRD);
            this.frameVecs.push(nearRD);
            this.frameVecs.push(farLT);
            this.frameVecs.push(nearLT);
            this.frameVecs.push(farRT);
            this.frameVecs.push(nearRT);
        }
        private matView: math.matrix = new math.matrix;
        private matProjP: math.matrix = new math.matrix;
        private matProjO: math.matrix = new math.matrix;
        private matProj: math.matrix = new math.matrix;

        private frameVecs: math.vector3[] = [];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 透视投影的fov
         * @version egret-gd3d 1.0
         */
        fov: number = Math.PI * 0.25;//透视投影的fov
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 正交投影的竖向size
         * @version egret-gd3d 1.0
         */
        size: number = 2;//正交投影的竖向size

        private _opvalue = 1;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 0=正交， 1=透视 中间值可以在两种相机间过度
         * @version egret-gd3d 1.0
         */
        set opvalue(val: number)
        {
            if (val > 0 && this._near < 0.01)
            {
                this._near = 0.01;
                if (this._far <= this._near)
                    this._far = this._near + 0.01;
            }
            this._opvalue = val;
        }
        get opvalue():number
        {
            return this._opvalue;
        }

        /**
         * @private
         */
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: gd3d.math.vector2, app: application, z: number, out: gd3d.math.vector2)
        {
            var vpp = new math.rect();
            this.calcViewPortPixel(app, vpp);

            var nearpos: gd3d.math.vector3 = new gd3d.math.vector3;
            nearpos.z = -this.near;
            nearpos.x = screenPos.x - vpp.w * 0.5;
            nearpos.y = vpp.h * 0.5 - screenPos.y;

            var farpos: gd3d.math.vector3 = new gd3d.math.vector3;
            farpos.z = -this.far;
            farpos.x = this.far * nearpos.x / this.near;
            farpos.y = this.far * nearpos.y / this.near;;

            var rate = (nearpos.z - z) / (nearpos.z - farpos.z);
            out.x = nearpos.x - (nearpos.x - farpos.x) * rate;
            out.y = nearpos.y - (nearpos.y - farpos.y) * rate;
        }
        /**
        * @private
        */
        fillRenderer(scene: scene)
        {
            scene.renderList.clear();
            if (scene.app.isFrustumCulling)
                this.calcCameraFrame(scene.app);
            this._fillRenderer(scene, scene.getRoot());
        }
        private _fillRenderer(scene: scene, node: transform)
        {
            if (scene.app.isFrustumCulling && !this.testFrustumCulling(scene, node)) return;//视锥测试不通过 直接return
            if (node.gameObject != null && node.gameObject.renderer != null && node.gameObject.visible)
            {
                scene.renderList.addRenderer(node.gameObject.renderer);
            }
            if (node.children != null && node.gameObject.visible)
            {
                for (var i = 0; i < node.children.length; i++)
                {
                    this._fillRenderer(scene, node.children[i]);
                }
            }
        }
        /**
        * @private
        */
        testFrustumCulling(scene: scene, node: transform)
        {
            if (!node.gameObject.getComponent("frustumculling")) return true;//没挂识别组件即为通过测试
            let spherecol = node.gameObject.getComponent("spherecollider") as spherecollider;
            let worldPos = node.getWorldTranslate();

            if (!spherecol.caclPlaneInDir(this.frameVecs[0], this.frameVecs[1], this.frameVecs[5])) return false;
            if (!spherecol.caclPlaneInDir(this.frameVecs[1], this.frameVecs[3], this.frameVecs[7])) return false;
            if (!spherecol.caclPlaneInDir(this.frameVecs[3], this.frameVecs[2], this.frameVecs[6])) return false;
            if (!spherecol.caclPlaneInDir(this.frameVecs[2], this.frameVecs[0], this.frameVecs[4])) return false;
            if (!spherecol.caclPlaneInDir(this.frameVecs[5], this.frameVecs[7], this.frameVecs[6])) return false;
            if (!spherecol.caclPlaneInDir(this.frameVecs[0], this.frameVecs[2], this.frameVecs[3])) return false;
            return true;
        }
        /**
        * @private
        */
        _targetAndViewport(target: render.glRenderTarget, scene: scene, context: renderContext, withoutClear: boolean)
        {
            {
                var w: number;
                var h: number;
                if (target == null)
                {
                    w = scene.app.width;
                    h = scene.app.height;
                    render.glRenderTarget.useNull(context.webgl);
                }
                else
                {
                    w = target.width;
                    h = target.height;
                    target.use(context.webgl);
                }

                //viewport 管不到clear的区域？
                context.webgl.viewport(w * this.viewport.x, h * this.viewport.y, w * this.viewport.w, h * this.viewport.h);
                context.webgl.depthRange(0, 1);

                if (withoutClear == false)
                {
                    //clear
                    if (this.clearOption_Color && this.clearOption_Depth)
                    {
                        context.webgl.depthMask(true);//zwrite 會影響clear depth，這個查了好一陣
                        gd3d.render.glDrawPass.lastZWrite = true;
                        context.webgl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
                        context.webgl.clearDepth(1.0);
                        context.webgl.clear(context.webgl.COLOR_BUFFER_BIT | context.webgl.DEPTH_BUFFER_BIT);
                    }
                    else if (this.clearOption_Depth)
                    {
                        context.webgl.depthMask(true);
                        gd3d.render.glDrawPass.lastZWrite = true;
                        context.webgl.clearDepth(1.0);
                        context.webgl.clear(context.webgl.DEPTH_BUFFER_BIT);
                    }
                    else if (this.clearOption_Color)
                    {
                        context.webgl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
                        context.webgl.clear(context.webgl.COLOR_BUFFER_BIT);
                    }
                    else
                    {

                    }
                }

            }
        }
        /**
        * @private
        */
        _renderOnce(scene: scene, context: renderContext, drawtype: string)
        {
            context.drawtype = drawtype;

            var assetmgr = scene.app.getAssetMgr();

            for (var i = 0; i < scene.renderList.renderLayers.length; i++)
            {
                var layer = scene.renderList.renderLayers[i];
                var list = layer.list;

                for (var j = 0; j < list.length; j++)
                {
                    if (this.CullingMask & list[j].renderLayer)
                    {
                        list[j].render(context, assetmgr, this);
                    }
                }
            }

        }
        /**
        * @private
        */
        postQueues: ICameraPostQueue[] = [];
        /**
        * @private
        */
        renderScene(scene: scene, context: renderContext)
        {
            for (var i = 0; i < scene.renderList.renderLayers.length; i++)
            {
                var layer = scene.renderList.renderLayers[i];
                var list = layer.list;
                if (layer.needSort)
                {
                    if (list.length > 1)
                    {
                        list.sort((a, b) =>
                        {
                            if (a.queue != b.queue)
                            {
                                return a.queue - b.queue;
                            }
                            else
                            {
                                // var matrixView = math.pool.new_matrix();
                                // this.calcViewMatrix(matrixView);
                                var matrixView = context.matrixView;

                                var az = math.pool.new_vector3();
                                var bz = math.pool.new_vector3();
                                gd3d.math.matrixTransformVector3(a.gameObject.transform.getWorldTranslate(), matrixView, az);
                                gd3d.math.matrixTransformVector3(b.gameObject.transform.getWorldTranslate(), matrixView, bz);
                                return bz.z - az.z;
                            }
                        })
                    }
                }
            }
            if (this.postQueues.length == 0)
            {
                this._targetAndViewport(this.renderTarget, scene, context, false);
                this._renderOnce(scene, context, "");
                //context.webgl.flush();
            }
            else
            {
                for (var i = 0; i < this.postQueues.length; i++)
                {
                    this.postQueues[i].render(scene, context, this);
                }
                context.webgl.flush();
            }


        }
        /**
        * @private
        */
        remove()
        {

        }
        /**
        * @private
        */
        clone()
        {

        }
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 渲染层级枚举
     * @version egret-gd3d 1.0
     */
    export enum CullingMask
    {
        ui = 0x00000001,
        default = 0x00000002,
        editor = 0x00000004,
        model = 0x00000008,
        everything = 0xffffffff,
        nothing = 0x00000000,
        modelbeforeui = 0x00000008
    }
}
