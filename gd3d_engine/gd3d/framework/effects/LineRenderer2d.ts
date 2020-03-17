/// <reference path="LineRendererBase.ts" />

namespace gd3d.framework
{
    /**
     * The line renderer is used to draw free-floating lines in 3D space.
     * 
     * 线渲染器用于在三维空间中绘制自由浮动的线。
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    export class LineRenderer2d extends LineRendererBase implements IRectRenderer
    {
        transform: transform2D;

        private datar: number[] = [];

        render(canvas: canvas)
        {
            math.matrixClone(this.transform.getWorldMatrix(), this.localToWorldMatrix);
            math.matrixInverse(this.localToWorldMatrix, this.worldToLocalMatrix);

            if (!this.material)
            {
                this.material = sceneMgr.app.getAssetMgr().getDefLineRendererMat();
            }
            this.uvOffset.x += this.uvSpeed.x;
            this.uvOffset.y += this.uvSpeed.y;
            this.material.setVector4("_uvOffset", this.uvOffset);

            // 清理网格
            LineRenderer.clearMesh(this.mesh);

            // 烘焙网格
            this.BakeMesh(this.mesh, null, false);

            if (this.positions.length < 2) return;

            // 上传网格数据
            LineRenderer.uploadMesh(this.mesh, canvas.webgl);

            // 绘制
            if (this.datar.length != 0)
                canvas.pushRawData(this.material, this.datar);

            // // 绘制
            // LineRenderer.draw(context, this.gameObject, this.mesh, this.material);
        }
        static readonly ClassName: string = "LineRenderer2d";

        protected mesh = new gd3d.framework.mesh("LineRenderer2d" + ".mesh.bin");

        updateTran()
        {
            throw new Error("Method not implemented.");
        }

        getMaterial(): material
        {
            return this.material;
        }

        getDrawBounds(): math.rect
        {
            throw new Error("Method not implemented.");
        }

    }
}