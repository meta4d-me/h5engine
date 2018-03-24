/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d矩形碰撞盒
     * @version egret-gd3d 1.0
     */
    @reflect.node2DComponent
    @reflect.nodeBoxCollider2d
    export class boxcollider2d implements I2DComponent , ICollider2d
    {
        transform: transform2D;

        private _obb: obb2d;

        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取obb2d
        * @version egret-gd3d 1.0
        */
        getBound()
        {
            return this._obb;
        }

        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 检测碰撞
        * @version egret-gd3d 1.0
        */
        intersectsTransform(tran: transform2D): boolean
        {
            if (tran == null) return false;
            if (this._obb == null || tran.collider.getBound() == null) return false;
            var _obb = tran.collider.getBound();
            return this._obb.intersects(_obb);
        }

         /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒
        * @version egret-gd3d 1.0
        */
        private build()
        {
            let t = this.transform;
            this._obb = new obb2d();
            this._obb.buildByCenterSize(t.getWorldTranslate(),t.width,t.height);
            this._obb.offset.x = (0.5-t.pivot.x) * this._obb.size.x/2;
            this._obb.offset.y = (0.5-t.pivot.y) * this._obb.size.y/2;
        }

        start() {
            this.build();
        }

        update(delta: number) {
            if (this._obb)
            {
                this._obb.update(this.transform.getCanvasWorldMatrix());
            }
        }
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean) {

        }
        remove() {
            if(this._obb)   this._obb.dispose();
            this._obb = null;
        }
    }
}