/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    export interface ICameraPostQueue
    {
        render(scene: scene, context: renderContext, camera: camera);
        renderTarget: render.glRenderTarget;
    }
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
            context.webgl.clearColor(0, 0, 0, 0);
            context.webgl.clearDepth(1.0);
            context.webgl.clear(context.webgl.COLOR_BUFFER_BIT | context.webgl.DEPTH_BUFFER_BIT);
            camera._renderOnce(scene, context, "_depth");
            render.glRenderTarget.useNull(context.webgl);
        }
        renderTarget: render.glRenderTarget;
    }
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
            context.webgl.clearColor(0, 0.3, 0, 0);
            context.webgl.clearDepth(1.0);
            context.webgl.clear(context.webgl.COLOR_BUFFER_BIT | context.webgl.DEPTH_BUFFER_BIT);
            var mesh = scene.app.getAssetMgr().getDefaultMesh("quad");
            //画四边形
            context.drawtype = "";
            this.material.draw(context, mesh, mesh.submesh[0], "quad");
        }
        renderTarget: render.glRenderTarget;
    }
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
    export interface IOverLay
    {
        init: boolean;
        start(camera: camera);
        render(context: renderContext, assetmgr: assetMgr, camera: camera);
        update(delta: number);
    }
    // //相机绘制也可以是好几层的，如果没有，就来一组标准输出
    // export class cameraLayer
    // {
    //     drawQueue: number = 0;//绘制顺序，越小的越往前
    //     asRenderTarget: string;//是否使用renderTarget
    //     //clear info
    //     clearOption_Color: boolean = true;
    //     clearOption_Depth: boolean = true;

    //     //customDraw//是绘制场景 还是 绘制别的东西
    //     renderTag: {} = null;
    //     screenRenderer: IOverLay = null;//没有screenRenderer 就画场景
    // }
    @reflect.nodeComponent
    @reflect.nodeCamera
    export class camera implements INodeComponent
    {
        gameObject: gameObject;

        private _near: number = 0.01;
        @gd3d.reflect.UIStyle("rangeFloat", 1, 1000, 2)//加上这个标记，编辑器就能读取这个显示ui了
        @gd3d.reflect.Field("number")
        get near(): number
        {
            return this._near;
        }
        set near(val: number)
        {
            if (val >= this.far) val = this.far - 1;
            if (val < 0.01) val = 0.01;
            this._near = val;
        }
        private _far: number = 1000;
        @gd3d.reflect.UIStyle("rangeFloat", 1, 1000, 999)
        @gd3d.reflect.Field("number")
        get far(): number
        {
            return this._far;
        }
        set far(val: number)
        {
            if (val <= this.near) val = this.near + 1;
            if (val >= 1000) val = 1000;
            this._far = val;
        }
        public isMainCamera:boolean = false;
        CullingMask: CullingMask = CullingMask.default | CullingMask.ui;
        //CullingMask: CullingMask = CullingMask.everything;
        index: number;
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
        clearOption_Color: boolean = true;
        clearOption_Depth: boolean = true;
        // backgroundColor: gd3d.math.color = new gd3d.math.color(0.11, 0.11, 0.11, 1.0);
        backgroundColor: gd3d.math.color = new gd3d.math.color(0.5, 0.8, 1, 1);
        viewport: gd3d.math.rect = new gd3d.math.rect(0, 0, 1, 1);
        renderTarget: gd3d.render.glRenderTarget = null;
        order: number = 0;//camera 渲染顺序
        @gd3d.reflect.Field("IOverLay[]")
        private overlays: IOverLay[] = [];

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
        getOverLays()
        {
            return this.overlays;
        }
        removeOverLay(overLay: IOverLay)
        {
            if (this.overlays == null)
                return;
            let index = this.overlays.indexOf(overLay);
            if (index >= 0)
                this.overlays.splice(index, 1);
        }

        calcViewMatrix(matrix: gd3d.math.matrix)
        {
            var camworld = this.gameObject.transform.getWorldMatrix();
            //视矩阵刚好是摄像机世界矩阵的逆
            gd3d.math.matrixInverse(camworld, this.matView);



            gd3d.math.matrixClone(this.matView, matrix);
            return;
        }
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
            var matinv = new gd3d.math.matrix();
            gd3d.math.matrixMultiply(matrixProject, matrixView, matrixViewProject);

            var ndcPos = gd3d.math.pool.new_vector3();
            gd3d.math.matrixTransformVector3(worldPos, matrixViewProject, ndcPos);
            outScreenPos.x = (ndcPos.x + 1) * vpp.w / 2;
            outScreenPos.y = (1 - ndcPos.y) * vpp.h / 2;
        }

        //----------------待我测试，董波---------------------
        //creatRayByScreenPos(app: application, screenPos: math.vector2): gd3d.framework.ray
        //{
        //    var _vpp = new math.rect();
        //    this.calcViewPortPixel(app, _vpp);
        //    var ex = screenPos.x / _vpp.w * 2 - 1;
        //    var ey = 1 - screenPos.y / _vpp.h * 2;

        //    //这些都是半长
        //    var near_h = this.near * Math.tan(this.fov * 0.5);
        //    var asp = _vpp.w / _vpp.h;
        //    var near_w = near_h * asp;

        //    var near_pos = gd3d.math.pool.new_vector3();
        //    near_pos.x = ex * near_w;
        //    near_pos.y = ey * near_h;
        //    near_pos.z = -this.near;

        //    var far_h = this.far * Math.tan(this.fov * 0.5);
        //    var far_w = far_h * asp;

        //    var far_pos = gd3d.math.pool.new_vector3();
        //    far_pos.x = ex * far_w;
        //    far_pos.y = ey * far_h;
        //    far_pos.z = -this.far;

        //    var camworld = this.gameObject.transform.getWorldMatrix();
        //    var w_near = gd3d.math.pool.new_vector3();
        //    var w_far = gd3d.math.pool.new_vector3();
        //    gd3d.math.matrixMakeTransformVector3(near_pos, camworld, w_near);
        //    gd3d.math.matrixMakeTransformVector3(far_pos, camworld, w_far);

        //    var dir = gd3d.math.pool.new_vector3();
        //    var dir1: gd3d.math.vector3 = gd3d.math.pool.new_vector3();
        //    gd3d.math.vec3Subtract(w_far, w_near, dir);
        //    gd3d.math.vec3Normalize(dir, dir1);

        //    var ray = new gd3d.framework.ray(w_near, dir1);
        //    gd3d.math.pool.delete_vector3(near_pos);
        //    gd3d.math.pool.delete_vector3(far_pos);
        //    gd3d.math.pool.delete_vector3(dir);
        //    gd3d.math.pool.delete_vector3(dir1);
        //    gd3d.math.pool.delete_vector3(w_near);
        //    gd3d.math.pool.delete_vector3(w_far);

        //    return ray;
        //}


        private matView: math.matrix = new math.matrix;
        private matProjP: math.matrix = new math.matrix;
        private matProjO: math.matrix = new math.matrix;
        private matProj: math.matrix = new math.matrix;

        //asp: number = 1;//由viewport 和 renderTarget计算而来
        // near: number = 0.2;
        // far: number = 100;

        fov: number = Math.PI * 0.25;//透视投影的fov
        size: number = 2;//正交投影的竖向size
        opvalue: number = 1;//0=正交， 1=透视 中间值可以在两种相机间过度

        //这些问自己的

        // updateproj()
        // {
        //     if (this.opvalue > 0)
        //         TSM.mat4.sPerspectiveLH(this.p_fov, this.asp, this.near, this.far, this.matProjP);
        //     if (this.opvalue < 1)
        //         TSM.mat4.sOrthoLH(this.asp * this.o_size, this.o_size, this.near, this.far, this.matProjO);

        //     if (this.opvalue == 0)
        //         this.matProjO.copy(this.matProj);
        //     else if (this.opvalue == 1)
        //         this.matProjP.copy(this.matProj);
        //     else
        //         TSM.mat4.sLerp(this.matProjO, this.matProjP, this.opvalue, this.matProj);
        // }

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
        //检查可见的列表
        fillRenderer(scene: scene)
        {
            scene.renderList.clear();
            this._fillRenderer(scene, scene.getRoot());
        }
        private _fillRenderer(scene: scene, node: transform)
        {
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
                        context.webgl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
                        context.webgl.clearDepth(1.0);
                        context.webgl.clear(context.webgl.COLOR_BUFFER_BIT | context.webgl.DEPTH_BUFFER_BIT);
                    }
                    else if (this.clearOption_Depth)
                    {
                        context.webgl.depthMask(true);
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
        postQueues: ICameraPostQueue[] = [];
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
                                var matrixView = math.pool.new_matrix();
                                this.calcViewMatrix(matrixView);

                                var az = math.pool.new_vector3();
                                var bz = math.pool.new_vector3();
                                gd3d.math.matrixTransformVector3(a.gameObject.transform.getWorldTranslate(), matrixView, az);
                                gd3d.math.matrixTransformVector3(b.gameObject.transform.getWorldTranslate(), matrixView, bz);
                                return az.z - bz.z;
                            }
                        })
                    }
                }
            }
            if (this.postQueues.length == 0)
            {
                this._targetAndViewport(this.renderTarget, scene, context, false);
                this._renderOnce(scene, context, "");
                context.webgl.flush();
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
        remove()
        {

        }
        clone()
        {

        }
    }

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
