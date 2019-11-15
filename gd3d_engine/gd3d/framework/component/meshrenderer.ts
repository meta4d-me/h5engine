/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * mesh的渲染组件
     * @version gd3d 1.0
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    export class meshRenderer implements IRenderer
    {
        static readonly ClassName:string="meshRenderer";

        constructor()
        {

        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("material[]")
        materials: material[]=[];

        /**
         * @private
         * 使用全局的lightMap
         */
        useGlobalLightMap:boolean=true;
        /**
         * @private
         */
        @gd3d.reflect.Field("number")
        lightmapIndex: number = -1;
         /**
         * @private
         */
        @gd3d.reflect.Field("vector4")
        lightmapScaleOffset: math.vector4 = new math.vector4(1, 1, 0, 0);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景渲染层级（common、transparent、overlay）
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染mask层级（和相机相对应）
         * @version gd3d 1.0
         */
        // @gd3d.reflect.Field("number")
        // renderLayer: gd3d.framework.CullingMask = CullingMask.default;
        get renderLayer() {return this.gameObject.layer;}
        set renderLayer(layer:number){
            this.gameObject.layer = layer;
        }
        private issetq = false;
         /**
         * @private
         */
        _queue: number = 0;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 返回此组件的场景渲染层级排序依据queue大小
         * @version gd3d 1.0
         */
        get queue(): number
        {
            return this._queue;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置此组件的场景渲染层级排序number大小
         * @version gd3d 1.0
         */
        set queue(value: number)
        {
            this._queue = value;
            this.issetq = true;
        }
         /**
         * @private
         */
        filter: meshFilter;
        start()
        {
            this.filter = this.gameObject.getComponent("meshFilter") as meshFilter;
          
            this.refreshLayerAndQue();

            if(this.lightmapIndex ==-2)
            {
                this.useGlobalLightMap=false;
            }
        }

        onPlay()
        {

        }


        // material(mat:material|material[])
        // {
        //     if(mat==null) this.materials.length=0;
        //     if(mat instanceof material)
        //     {
        //         this.materials[0]=mat;
        //     }else
        //     {
        //         this.materials=mat;
        //     }
        //     this.refreshLayerAndQue();
        // }
        private refreshLayerAndQue()
        {
            if (this.materials == null || this.materials.length == 0)
            {
                this.materials = [];
                let material = new framework.material();
                material.use();
                this.materials.push(material);
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
            if(this.filter==null)
            {
                this.filter = this.gameObject.getComponent("meshFilter") as meshFilter;
            }
        }
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
            DrawCallInfo.inc.currentState=DrawCallEnum.Meshrender;
            let go = this.gameObject;
            let tran = go.transform;
            let filter = this.filter; 

            context.updateLightMask(go.layer);
            context.updateModel(tran);
            if(filter == null) return;
            let mesh = this.filter.getMeshOutput();
            if(mesh == null || mesh.glMesh == null || mesh.submesh == null) return;
            let subMeshs = mesh.submesh;
            if(subMeshs == null) return;

            mesh.glMesh.bindVboBuffer(context.webgl);


            let len = subMeshs.length;
            let scene = tran.scene;
            let lightIdx = this.lightmapIndex;
            for (let i = 0; i < len; i++)
            {
                let sm = subMeshs[i];
                let mid = subMeshs[i].matIndex;//根据这个找到使用的具体哪个材质    
                let usemat = this.materials[mid];
                let drawtype = scene.fog ? "base_fog" : "base";
                if (lightIdx >= 0 && scene.lightmaps.length>0)
                {
                    drawtype = scene.fog ? "lightmap_fog" : "lightmap";
                    //usemat.shaderStatus = shaderStatus.Lightmap;
                    if (scene.lightmaps.length > lightIdx)
                    {
                        context.lightmap = scene.lightmaps[lightIdx];
                        context.lightmapOffset = this.lightmapScaleOffset;
                        context.lightmapUV = mesh.glMesh.vertexFormat & gd3d.render.VertexFormatMask.UV1 ? 1 : 0;
                    }

                }
                else
                {
                    if(!this.useGlobalLightMap)
                    {
                        drawtype = scene.fog ? "lightmap_fog" : "lightmap";
                        context.lightmap = usemat.statedMapUniforms["_LightmapTex"];
                        context.lightmapOffset = this.lightmapScaleOffset;
                        context.lightmapUV = mesh.glMesh.vertexFormat & gd3d.render.VertexFormatMask.UV1 ? 1 : 0;
                    }
                }
                if (scene.fog)
                {
                    context.fog = scene.fog;
                }
                if (usemat != null)
                    usemat.draw(context, mesh, sm, drawtype);
            }
        }
         /**
         * @private
         */
        remove()
        {
            this.materials.forEach(element=>{
                if(element) element.unuse();                
            });
            this.materials.length=0;
        }
         /**
         * @private
         */
        clone()
        {

        }
    }

}