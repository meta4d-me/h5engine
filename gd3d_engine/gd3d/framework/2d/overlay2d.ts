/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2DUI的容器类，与canvasrender(3DUI)相对应。
     * @version egret-gd3d 1.0
     */
    @gd3d.reflect.SerializeType
    export class overlay2D implements IOverLay
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 构造函数
         * @version egret-gd3d 1.0
         */
        constructor()
        {
            this.canvas = new canvas();
            sceneMgr.app.markNotify(this.canvas.getRoot(), NotifyType.AddChild);
        }

        /**
         * @private
         * @language zh_CN
         * @classdesc
         * 是否初始化完成，在执行完start之后设置为true
         * @version egret-gd3d 1.0
         */
        init: boolean = false;

        private camera: camera;
        private app: application;
        private inputmgr: inputMgr;

        /**
         * @private
         */
        start(camera: camera)
        {
            if(camera == this.camera) return;
            this.camera = camera;
            this.app = camera.gameObject.getScene().app;
            this.canvas.scene = camera.gameObject.getScene();
            this.inputmgr = camera.gameObject.getScene().app.getInputMgr();
        }
        
        /**
         * @private
         */
        @gd3d.reflect.Field("canvas")
        canvas: canvas;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否自适应
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("boolean")
        autoAsp: boolean = true;

         /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染排序
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        sortOrder:number = 0;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加2d子节点
         * @param node 2d节点实例
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
         * @param node 2d节点实例
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
         * 获取所有的2d子节点
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
        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            if (!this.canvas.getRoot().visible) return;
           // if (!(camera.CullingMask & this.renderLayer)) return;
            if (this.camera == null || this.camera == undefined)
                return;
            if (this.autoAsp)
            {
                var vp = new gd3d.math.rect();
                this.camera.calcViewPortPixel(assetmgr.app, vp);
                var aspcam = vp.w / vp.h;
                var aspc = this.canvas.pixelWidth / this.canvas.pixelHeight;
                if (aspc != aspcam)
                {
                    this.canvas.pixelWidth = this.canvas.pixelHeight * aspcam;
                    this.canvas.getRoot().markDirty();
                }
            }
            context.updateOverlay();
            this.canvas.render(context, assetmgr);
        }

        /**
         * @private
         */
        update(delta: number)
        {
            var vp = new math.rect();
            var app = this.camera.calcViewPortPixel(this.app, vp);
            var sx = (this.inputmgr.point.x / vp.w) * 2 - 1;
            var sy = (this.inputmgr.point.y / vp.h) * -2 + 1;

            //用屏幕空间坐标系丢给canvas

            //canvas de update 直接集成pointevent处理
            this.canvas.update(delta, this.inputmgr.point.touch, sx, sy);

            //用屏幕空间坐标系丢给canvas

        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 事件检测
         * @param mx x偏移
         * @param my y偏移
         * @version egret-gd3d 1.0
         */
        pick2d(mx: number, my: number,tolerance:number=0): transform2D
        {
            if (this.camera == null) return null;
            var vp = new math.rect();
            var app = this.camera.calcViewPortPixel(this.app, vp);
            var sx = (mx / vp.w) * 2 - 1;
            var sy = (my / vp.h) * -2 + 1;

            var outv2 = math.pool.new_vector2();
            outv2.x = sx;
            outv2.y = sy;
            var root = this.canvas.getRoot();
            let trans = this.dopick2d(outv2, root,tolerance);
            math.pool.delete_vector2(outv2);
            return trans;
        }

        /**
         * @private
         */
        dopick2d(outv: math.vector2, tran: transform2D,tolerance:number=0): transform2D
        {
            if (tran.components != null)
            {
                for (var i = tran.components.length - 1; i >= 0; i--)
                {
                    var comp = tran.components[i];
                    if (comp != null)
                        if (comp.init && comp.comp.transform.ContainsCanvasPoint(outv,tolerance))
                        {
                            return comp.comp.transform;
                        }
                }
            }

            if (tran.children != null)
            {
                for (var i = tran.children.length - 1; i >= 0; i--)
                {
                    var tran2 = this.dopick2d(outv, tran.children[i],tolerance);
                    if (tran2 != null) return tran2;
                }
            }
            return null;
        }
        /**
         * @private
         */
        pick2d_new(mx: number, my: number,tolerance:number=0): transform2D
        {
            if (this.camera == null) return null;
            var vp = new math.rect();
            var app = this.camera.calcViewPortPixel(this.app, vp);
            var sx = (mx / vp.w) * 2 - 1;
            var sy = (my / vp.h) * -2 + 1;

            var outv2 = math.pool.new_vector2();
            outv2.x = sx;
            outv2.y = sy;
            var root = this.canvas.getRoot();
            return this.dopick2d_new(outv2, root,tolerance);
        }
        /**
         * @private
         */
        dopick2d_new(outv: math.vector2, tran: transform2D,tolerance:number=0): transform2D
        {
            if(tran.children!=null)
            {
                for (var i = tran.children.length - 1; i >= 0; i--)
                {
                    var tran2 = this.dopick2d_new(outv, tran.children[i]);
                    if (tran2 != null) return tran2;
                }
            }
            var uirect=tran.getComponent("uirect") as gd3d.framework.uirect;
            if(uirect!=null)
            {
                if(uirect.canbeClick&&uirect.transform.ContainsCanvasPoint(outv,tolerance))
                {
                    return uirect.transform;
                }
            }
            return null;
        }

        /**
         * @private
         */
        calScreenPosToCanvasPos(mousePos: gd3d.math.vector2, canvasPos: gd3d.math.vector2)
        {
            var vp = new math.rect();
            this.camera.calcViewPortPixel(this.app, vp);
            var temt = gd3d.math.pool.new_vector2();
            temt.x = (mousePos.x / vp.w) * 2 - 1;
            temt.y = (mousePos.y / vp.h) * -2 + 1;

            var mat: gd3d.math.matrix3x2 = gd3d.math.pool.new_matrix3x2();
            gd3d.math.matrix3x2Clone(this.canvas.getRoot().getWorldMatrix(), mat);
            gd3d.math.matrix3x2Inverse(mat, mat);
            gd3d.math.matrix3x2TransformVector2(mat, temt, canvasPos);
            gd3d.math.pool.delete_vector2(temt);
        }
    }

}