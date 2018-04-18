/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d批处理类
     * @version egret-gd3d 1.0
     */
    export class batcher2D
    {
        private mesh: render.glMesh;
        private drawMode: render.DrawModeEnum;
        private vboCount: number = 0;
        private curPass: render.glDrawPass;

        private eboCount: number = 0;
        private dataForVbo: Float32Array;
        private dataForEbo: Uint16Array;

        /**
         * @private
         */
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

        /**
         * @private
         */
        begin(webgl: WebGLRenderingContext, pass: render.glDrawPass)
        {
            // if (mat == this.curmaterial) return;
            //这明显是个bug,pass即使一样，也可能要重绘
            if (this.vboCount > 0)
                this.end(webgl);
            this.curPass = pass;
        }

        /**
         * @private
         */
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

        /**
         * @private
         */
        end(webgl: WebGLRenderingContext)
        {
            if (this.vboCount == 0) return;
            this.mesh.uploadVertexData(webgl, this.dataForVbo);
            if (this.eboCount > 0){
                this.mesh.uploadIndexData(webgl, 0, this.dataForEbo);
            }

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

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 3DUI的容器类</p>
     * 3d组件</p>
     * 与overlay(2DUI)相对应。
     * @version egret-gd3d 1.0
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    @reflect.nodeCanvasRendererCollider
    export class canvasRenderer implements IRenderer, ICollider
    {
        /**
         * @private
         */
        constructor()
        {
            this.canvas = new canvas();
            this.canvas.is2dUI = false;
        }

        /**
         * @private
         */
        subTran: transform;

        /**
         * @private
         */
        getBound()
        {
            return null;
        }

        /**
         * @private
         */
        intersectsTransform(tran: transform): boolean
        {
            return false;
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * layer类型
         * @version egret-gd3d 1.0
         */
        layer: RenderLayerEnum = RenderLayerEnum.Common;

        /**
         * @private
         */
        queue: number = 0;
        
        gameObject: gameObject;
        @gd3d.reflect.Field("canvas")
        canvas: canvas;
        inputmgr: inputMgr;
        //绑定这个canvas 从哪个camera 响应事件
        cameraTouch: camera;

        /**
         * @private
         */
        start()
        {
            this.canvas.scene = this.gameObject.getScene();
            this.canvas.parentTrans=this.gameObject.transform;
            this.inputmgr = this.gameObject.getScene().app.getInputMgr();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加2d子节点
         * @version egret-gd3d 1.0
         */
        addChild(node: transform2D)
        {
            this.canvas.addChild(node);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除2d子节点
         * @version egret-gd3d 1.0
         */
        removeChild(node: transform2D)
        {
            this.canvas.removeChild(node);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所有2d子节点
         * @version egret-gd3d 1.0
         */
        getChildren(): transform2D[]
        {
            return this.canvas.getChildren();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取2d子节点的数量
         * @version egret-gd3d 1.0
         */
        getChildCount(): number
        {
            return this.canvas.getChildCount();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取2d子节点
         * @param index 索引
         * @version egret-gd3d 1.0
         */
        getChild(index: number): transform2D
        {
            return this.canvas.getChild(index);
        }

        /**
         * @private
         */
        update(delta: number)
        {
            var asp = this.canvas.pixelWidth / this.canvas.pixelHeight;
            this.gameObject.transform.localScale.x = this.gameObject.transform.localScale.y * asp;


            if (this.cameraTouch != null)//需要用户代码 或者在编辑器里面绑定使用哪个camera（即设置此变量）,否则不会主动响应事件否则不会主动响应事件
            {
                var scene = this.gameObject.getScene();

                var ray = this.cameraTouch.creatRayByScreen(new math.vector2(this.inputmgr.point.x, this.inputmgr.point.y), scene.app);
                let tempInfo = math.pool.new_pickInfo();
                var bool = scene.pick(ray,tempInfo);

                if (bool && tempInfo.pickedtran == this.gameObject.transform)//pick 到自己
                {
                    var mat = this.gameObject.transform.getWorldMatrix();
                    var matinv = new math.matrix();
                    math.matrixInverse(mat, matinv);
                    var outv = new math.vector3();
                    math.matrixTransformVector3(tempInfo.hitposition, matinv, outv);
                    this.canvas.update(delta, this.inputmgr.point.touch, outv.x, outv.y);
                }
                else
                {
                    this.canvas.update(delta, false, 0, 0);
                }
                math.pool.delete_pickInfo(tempInfo);
            }
            else
            {
                this.canvas.update(delta, false, 0, 0);
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 射线检测
         * @param ray 射线
         * @version egret-gd3d 1.0
         */
        pick2d(ray:gd3d.framework.ray):transform2D
        {
            let tempinfo = math.pool.new_pickInfo();
            var bool = ray.intersectPlaneTransform(this.gameObject.transform,tempinfo);
            if (bool != null)
            {
                var mat = this.gameObject.transform.getWorldMatrix();
                var matinv = math.pool.new_matrix();
                math.matrixInverse(mat, matinv);
                var outv = math.pool.new_vector3();
                math.matrixTransformVector3(tempinfo.hitposition, matinv, outv);
                var root = this.canvas.getRoot();
                let trans = this.dopick2d(outv, root);

                math.pool.delete_vector3(outv);
                math.pool.delete_matrix(matinv);
                return trans;
            }
            math.pool.delete_pickInfo(tempinfo);
            return null;
        }

        /**
         * @private
         */
        dopick2d(NDCPos:math.vector2, tran:transform2D):transform2D
        {
            if (tran.components != null)
            {
                for (var i = tran.components.length - 1; i >= 0; i--)
                {
                    var comp = tran.components[i];
                    if (comp != null)
                        //if (comp.init && comp.comp.transform.ContainsCanvasPoint(outv))
                        if (comp.comp.transform.ContainsCanvasPoint(NDCPos))
                        {
                            return comp.comp.transform;
                        }
                }
            }

            if(tran.children != null)
            {
                for (var i = tran.children.length - 1; i >= 0; i--)
                {
                    var tran2 = this.dopick2d(NDCPos, tran.children[i]);
                    if(tran2 != null)   return tran2;
                }
            }
            return null;
        }

        /**
         * @private
         */
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
           // if (!(camera.CullingMask & this.renderLayer)) return;
            context.updateModel(this.gameObject.transform);
            this.canvas.render(context, assetmgr);
        }

        /**
         * @private
         */
        jsonToAttribute(json, assetmgr: gd3d.framework.assetMgr)
        {

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
        renderLayer: CullingMask = CullingMask.default;
    }
}