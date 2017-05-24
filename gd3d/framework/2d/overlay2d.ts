/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class overlay2D implements IOverLay
    {
        // public notify: INotify;
        constructor()
        {
            this.canvas = new canvas();
            sceneMgr.app.markNotify(this.canvas.getRoot(), NotifyType.AddChild);
        }
        init: boolean = false;
        camera: camera;
        app: application;
        inputmgr: inputMgr;
        start(camera: camera)
        {
            this.camera = camera;
            this.app = camera.gameObject.getScene().app;
            this.canvas.scene = camera.gameObject.getScene();
            this.inputmgr = camera.gameObject.getScene().app.getInputMgr();
        }
        @gd3d.reflect.Field("canvas")
        canvas: canvas;//2d huabu
        @gd3d.reflect.Field("boolean")
        autoAsp: boolean = true;

        renderLayer: CullingMask = CullingMask.ui;
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

        pick2d(mx: number, my: number): transform2D
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
            return this.dopick2d(outv2, root);

        }

        dopick2d(outv: math.vector2, tran: transform2D): transform2D
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

            if (tran.children != null)
            {
                for (var i = tran.children.length - 1; i >= 0; i--)
                {
                    var tran2 = this.dopick2d(outv, tran.children[i]);
                    if (tran2 != null) return tran2;
                }
            }
            return null;
        }

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