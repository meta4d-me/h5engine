/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    export class batcher2D
    {
        mesh: render.glMesh;
        drawMode: render.DrawModeEnum;
        vboCount: number = 0;
        curPass: render.glDrawPass;

        eboCount: number = 0;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        initBuffer(webgl: WebGLRenderingContext, vf: render.VertexFormatMask, drawMode: render.DrawModeEnum)
        {
            this.mesh = new render.glMesh();
            this.mesh.initBuffer(webgl, vf, 128, render.MeshTypeEnum.Dynamic);
            this.dataForVbo = new Float32Array(128);
            this.drawMode = drawMode;
            if (drawMode == render.DrawModeEnum.EboLine || drawMode == render.DrawModeEnum.EboTri)
            {
                this.mesh.addIndex(webgl, 128);
                this.dataForEbo = new Uint16Array(128);
            }
        }
        begin(webgl: WebGLRenderingContext, pass: render.glDrawPass)
        {
            // if (mat == this.curmaterial) return;
            //这明显是个bug,pass即使一样，也可能要重绘
            if (this.vboCount > 0)
                this.end(webgl);
            this.curPass = pass;
        }
        push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[])
        {
            if (this.vboCount + vbodata.length > 2048
                ||
                (ebodata != null && this.eboCount + ebodata.length > 2048))
            {
                this.end(webgl);
            }

            if (this.vboCount + vbodata.length > this.dataForVbo.length)
            {
                var narr = new Float32Array(this.dataForVbo.length * 2);
                for (var i = 0; i < this.dataForVbo.length; i++)
                {
                    narr[i] = this.dataForVbo[i];
                }
                this.dataForVbo = narr;
                this.mesh.resetVboSize(webgl, this.dataForVbo.length);
            }
            for (var i = 0; i < vbodata.length; i++)
            {
                this.dataForVbo[this.vboCount + i] = vbodata[i];
            }
            this.vboCount += vbodata.length;

            if (this.drawMode == render.DrawModeEnum.VboLine || this.drawMode == render.DrawModeEnum.VboTri)
                return;

            if (ebodata != null)
            {
                if (this.eboCount + ebodata.length > this.dataForEbo.length)
                {
                    var narr = new Uint16Array(this.dataForEbo.length * 2);
                    for (var i = 0; i < this.dataForEbo.length; i++)
                    {
                        narr[i] = this.dataForEbo[i];
                    }
                    this.dataForEbo = narr;
                    this.mesh.resetEboSize(webgl, 0, this.dataForEbo.length);
                }
                for (var i = 0; i < ebodata.length; i++)
                {
                    this.dataForEbo[this.eboCount + i] = ebodata[i];
                }
                this.eboCount += ebodata.length;
            }



        }
        end(webgl: WebGLRenderingContext)
        {
            if (this.vboCount == 0) return;
            this.mesh.uploadVertexSubData(webgl, this.dataForVbo.slice(0, this.vboCount), 0);
            if (this.eboCount > 0)
                this.mesh.uploadIndexSubData(webgl, 0, this.dataForEbo.slice(0, this.eboCount), 0);

            var vertexcount = (this.vboCount / (this.mesh.vertexByteSize / 4)) | 0;
            this.curPass.use(webgl);
            this.mesh.bind(webgl, this.curPass.program, (this.drawMode == render.DrawModeEnum.EboLine || this.drawMode == render.DrawModeEnum.EboTri) ? 0 : -1);
            if (this.drawMode == render.DrawModeEnum.EboLine)
            {
                this.mesh.drawElementLines(webgl, 0, this.eboCount);
            }
            else if (this.drawMode == render.DrawModeEnum.EboTri)
            {
                this.mesh.drawElementTris(webgl, 0, this.eboCount);
            }
            else if (this.drawMode == render.DrawModeEnum.VboLine)
            {
                this.mesh.drawArrayLines(webgl, 0, vertexcount);
            }
            else if (this.drawMode == render.DrawModeEnum.VboTri)
            {
                this.mesh.drawArrayTris(webgl, 0, vertexcount);
            }
            this.vboCount = 0;
            this.eboCount = 0;
        }
    }

    @reflect.nodeRender
    @reflect.nodeComponent
    @reflect.nodeCanvasRendererCollider
    export class canvasRenderer implements IRenderer, ICollider
    {
        constructor()
        {
            this.canvas = new canvas();
            this.canvas.is2dUI = false;
        }
        subTran: transform;
        getBound()
        {
            return null;
        }
        intersectsTransform(tran: transform): boolean
        {
            return false;
        }
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        queue: number = 0;
        gameObject: gameObject;
        @gd3d.reflect.Field("canvas")
        canvas: canvas;
        inputmgr: inputMgr;
        //绑定这个canvas 从哪个camera 响应事件
        cameraTouch: camera;
        start()
        {
            this.canvas.scene = this.gameObject.getScene();
            this.canvas.parentTrans=this.gameObject.transform;
            this.inputmgr = this.gameObject.getScene().app.getInputMgr();
        }
        addChild(node: transform2D)
        {
            this.canvas.addChild(node);
        }
        removeChild(node: transform2D)
        {
            this.canvas.removeChild(node);
        }
        getChildren(): transform2D[]
        {
            return this.canvas.getChildren();
        }
        getChildCount(): number
        {
            return this.canvas.getChildCount();
        }
        getChild(index: number): transform2D
        {
            return this.canvas.getChild(index);
        }

        update(delta: number)
        {
            var asp = this.canvas.pixelWidth / this.canvas.pixelHeight;
            this.gameObject.transform.localScale.x = this.gameObject.transform.localScale.y * asp;


            if (this.cameraTouch != null)//需要用户代码 或者在编辑器里面绑定使用哪个camera（即设置此变量）,否则不会主动响应事件
            {
                var scene = this.gameObject.getScene();

                var ray = this.cameraTouch.creatRayByScreen(new math.vector2(this.inputmgr.point.x, this.inputmgr.point.y), scene.app);
                var pinfo = scene.pick(ray);

                if (pinfo != null && pinfo.pickedtran == this.gameObject.transform)//pick 到自己
                {
                    var mat = this.gameObject.transform.getWorldMatrix();
                    var matinv = new math.matrix();
                    math.matrixInverse(mat, matinv);
                    var outv = new math.vector3();
                    math.matrixTransformVector3(pinfo.hitposition, matinv, outv);

                    this.canvas.update(delta, this.inputmgr.point.touch, outv.x, outv.y);
                }
                else
                {
                    this.canvas.update(delta, false, 0, 0);
                }
            }
            else
            {
                this.canvas.update(delta, false, 0, 0);
            }
        }

        pick2d(ray:gd3d.framework.ray):transform2D
        {
            var pinfo = ray.intersectPlaneTransform(this.gameObject.transform);
            if (pinfo != null)
            {
                var mat = this.gameObject.transform.getWorldMatrix();
                var matinv = math.pool.new_matrix();
                math.matrixInverse(mat, matinv);
                var outv = math.pool.new_vector3();
                math.matrixTransformVector3(pinfo.hitposition, matinv, outv);
                var outv2 = math.pool.new_vector2();
                outv2.x = outv.x;
                outv2.y = outv.y;
                var root = this.canvas.getRoot();
                return this.dopick2d(outv2, root);
            }
            return null;
        }

        dopick2d(outv:math.vector2, tran:transform2D):transform2D
        {
            if (tran.components != null)
            {
                for (var i = tran.components.length - 1; i >= 0; i--)
                {
                    var comp = tran.components[i];
                    if (comp != null)
                        if (comp.init && comp.comp.transform.ContainsCanvasPoint(outv))
                        {
                            return comp.comp.transform;
                        }
                }
            }

            if(tran.children != null)
            {
                for (var i = tran.children.length - 1; i >= 0; i--)
                {
                    var tran2 = this.dopick2d(outv, tran.children[i]);
                    if(tran2 != null)   return tran2;
                }
            }
            return null;
        }

        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
            if (!(camera.CullingMask & this.renderLayer)) return;
            context.updateModel(this.gameObject.transform);
            this.canvas.render(context, assetmgr);
        }

        jsonToAttribute(json, assetmgr: gd3d.framework.assetMgr)
        {

        }
        remove()
        {

        }
        clone()
        {
            
        }
        renderLayer: CullingMask = CullingMask.default;
    }
}