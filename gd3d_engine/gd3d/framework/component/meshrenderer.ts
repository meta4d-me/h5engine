/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    export class meshRenderer implements IRenderer
    {
        constructor()
        {

        }
        gameObject: gameObject;

        @gd3d.reflect.Field("material[]")
        materials: material[]=[];

        @gd3d.reflect.Field("number")
        lightmapIndex: number = -1;
        @gd3d.reflect.Field("vector4")
        lightmapScaleOffset: math.vector4 = new math.vector4(1, 1, 0, 0);

        layer: RenderLayerEnum = RenderLayerEnum.Common;

        renderLayer: gd3d.framework.CullingMask = CullingMask.default;
        private issetq = false;
        _queue: number = 0;
        get queue(): number
        {
            return this._queue;
        }
        set queue(value: number)
        {
            this._queue = value;
            this.issetq = true;
        }
        filter: meshFilter;
        start()
        {
            this.filter = this.gameObject.getComponent("meshFilter") as meshFilter;

            this.refreshLayerAndQue();
        }

        private refreshLayerAndQue()
        {
            if (this.materials == null || this.materials.length == 0)
            {
                this.materials = [];
                this.materials.push(new framework.material());
                this.materials[0].setShader(sceneMgr.app.getAssetMgr().getShader("shader/def"));
            }

            this.layer = this.materials[0].getLayer();
            if (!this.issetq)
                this._queue = this.materials[0].getQueue();
        }

        update(delta: number)
        {
            if (this.materials != null && this.materials.length > 0)
            {
                let _mat = this.materials[0];
                if (_mat)
                {
                    this.layer = _mat.getLayer();
                    if (!this.issetq)
                        this._queue = _mat.getQueue();
                }
            }
        }
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
                
            context.updateModel(this.gameObject.transform);
            if (this.filter != null)
            {
                var mesh = this.filter.getMeshOutput();
                if (mesh != null)
                {
                    if (mesh.submesh != null)
                    {
                        for (var i = 0; i < mesh.submesh.length; i++)
                        {
                            var sm = mesh.submesh[i];

                            var mid = mesh.submesh[i].matIndex;//根据这个找到使用的具体哪个材质
                            var usemat = this.materials[mid];
                            var drawtype = this.gameObject.transform.scene.fog ? "base_fog" : "base";
                            if (this.lightmapIndex >= 0)
                            {
                                drawtype = this.gameObject.transform.scene.fog ? "lightmap_fog" : "lightmap";
                                //usemat.shaderStatus = shaderStatus.Lightmap;
                                if (this.gameObject.transform.scene.lightmaps.length > this.lightmapIndex)
                                {
                                    context.lightmap = this.gameObject.transform.scene.lightmaps[this.lightmapIndex];
                                    context.lightmapOffset = this.lightmapScaleOffset;
                                    context.lightmapUV = mesh.glMesh.vertexFormat & gd3d.render.VertexFormatMask.UV1 ? 1 : 0;
                                }
                            }
                            else
                            {
                                //usemat.shaderStatus = shaderStatus.Base;
                            }
                            if (this.gameObject.transform.scene.fog)
                            {
                                context.fog = this.gameObject.transform.scene.fog;
                            }
                            if (usemat != null)
                                usemat.draw(context, mesh, sm, drawtype);
                        }
                    }
                }
            }
        }

        remove()
        {

        }
        clone()
        {

        }
    }

}