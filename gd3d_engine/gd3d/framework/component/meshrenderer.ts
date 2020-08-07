/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    /** meshRenderer GpuInstancing 合批类
     * 
     */
    export class meshGpuInsBatcher{
        /** 实例数量 */
        count : number = 0;
        /** 渲染使用mesh */
        mesh : gd3d.framework.mesh;
        /** 材质数组（应对submesh） */
        materials : gd3d.framework.material[];
        /** 游戏标记layer */
        gameLayer : number;
        /** batcher 缓存的array */
        bufferDArrs : gd3d.math.ExtenArray<Float32Array>[];
        /** 当前材质上 使用到的通道列表 */
        passArr : gd3d.render.glDrawPass[];
        /** passId 对应 passArr 中的索引map*/
        passIdMap : {[id:number] : number};
        constructor(_glayer : number , _mesh : gd3d.framework.mesh , _mats : gd3d.framework.material[]){
            this.gameLayer = _glayer;
            this.mesh = _mesh;
            this.mesh.use();
            this.materials = _mats;
            let _sh = _mats[0].getShader();
            this.passArr = [];
            this.bufferDArrs = [];
            this.passIdMap = {};
            let tempArr = _sh.passes[gd3d.framework.meshRenderer.instanceDrawType()];
            for(let i=0 , len = tempArr.length ;i < len;i++){
                let pass = tempArr[i];
                this.passArr.push(pass);
                this.bufferDArrs.push(new gd3d.math.ExtenArray<Float32Array>(Float32Array));
                this.passIdMap[pass.id.getID()] = i;
            }
        }

        /** 清理 */
        dispose(){
            // for(let i=0 , len = this.materials.length ; i < len ;i++){
            //     let mat = this.materials[i];
            //     mat.unuse();
            // }
            for(let i=0 , len = this.bufferDArrs.length ; i < len ;i++){
                this.bufferDArrs[i].dispose();
            }

           this.passArr = null;
            this.mesh = null;
            this.materials = null;
            this.bufferDArrs = null;
            this.passIdMap = null;
        }
    }

    /** mesh  Gpu 实例 绘制info数据类*/
    export class meshGpuInstanceDrawInfo implements DrawInstanceInfo
    {
        instanceCount: number;
        mid : number;
        vbo : WebGLBuffer ; 
        cacheBuffers : gd3d.math.ExtenArray<Float32Array>[];
        bufferIdMap : {[passId : number] : number};
        instanceArray : gd3d.math.ReuseArray<IRendererGpuIns>;
        helpDArray : gd3d.math.ExtenArray<Float32Array>;
        private attSuccess : boolean = false;
        initBuffer(gl: WebGLRenderingContext): void
        {
            
        }
        activeAttributes(gl: WebGLRenderingContext, pass: render.glDrawPass): void
        {
            if(!this.instanceArray && !this.cacheBuffers) return;
            let cacheBuffer : gd3d.math.ExtenArray<Float32Array>;
            if(this.bufferIdMap){
                let idx = this.bufferIdMap[pass.id.getID()];
                if(idx == null) idx = 0; 
                cacheBuffer = this.cacheBuffers[idx]
            }

            let _mid = this.mid;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            let dataArr : Float32Array;
            if(cacheBuffer){
                dataArr = cacheBuffer.buffer;
            }
            if(!dataArr){
                this.helpDArray.count = 0;
                let len = this.instanceCount;
                for(let i=0;i < len ;i++){
                    let mr = this.instanceArray.get(i) as meshRenderer;
                    let mat = mr.materials[_mid];
                    meshRenderer.setInstanceOffsetMatrix(mr.gameObject.transform,mat,pass);
                    mat.uploadInstanceAtteribute(pass , this.helpDArray );
                }
                dataArr = this.helpDArray.buffer;
            }
            
            gl.bufferData(gl.ARRAY_BUFFER, dataArr , gl.STATIC_DRAW);
            
            let offset = 0;
            let attMap = pass.program.mapCustomAttrib;
            for(let key in attMap){
                let att = attMap[key];
                let location = att.location;
                if (location == -1) break;
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, att.size, gl.FLOAT, false, pass.program.strideInsAttrib, offset);
                gl.vertexAttribDivisor(location, 1);
                offset += att.size * 4;
            }

            this.attSuccess = true;
        }
        disableAttributes(gl: WebGLRenderingContext, pass: render.glDrawPass): void
        {
            if(this.attSuccess){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
                let attMap = pass.program.mapCustomAttrib;
                for(let key in attMap){
                    let att = attMap[key];
                    let location = att.location;
                    if (location == -1) break;
                    gl.vertexAttribDivisor(location, 0);
                    gl.disableVertexAttribArray(location);
                }

                this.attSuccess = false;
            }

            //clear
            this.instanceCount = this.mid = 0;
            this.vbo = null;
            this.cacheBuffers = null;
            this.instanceArray = null;
            this.helpDArray = null;
            this.bufferIdMap = null;

            if(this.onDisableAttribute){
                this.onDisableAttribute(this);
            }
        }

        /** Disable 结束回调 */
        onDisableAttribute : (info : meshGpuInstanceDrawInfo)=>any;

        private static _pool : meshGpuInstanceDrawInfo [] = [];
        
        /** 池子中取出一个 */
        static new_info (){
            let info = this._pool.pop();
            if(info) return info;

            info = new meshGpuInstanceDrawInfo();
            return info;
        }

        /** 放回池子 */
        static del_info (info : meshGpuInstanceDrawInfo){
            this._pool.push(info);
        }
        
    }

     /**
     * @public
     * @language zh_CN
     * @classdesc
     * mesh的渲染组件
     * @version gd3d 1.0
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    export class meshRenderer implements IRendererGpuIns
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

        private lastMat0Id = -1;
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
        private _queue: number = 0;
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
        set queue(value: number)
        {
            this._queue = value;
            this.issetq = true;
        }

        private _filter: meshFilter;
        
        /**
         * 渲染使用 meshFilter
         */
        get filter (){
            if(!this._filter){
                this._filter = this.gameObject.getComponent("meshFilter") as meshFilter;
            }
            return this._filter;
        }
        set filter (val){ this._filter = val;}


        private static readonly insOffsetMatrixStr = "instance_offset_matrix_";
        private static insOffsetMtxIDMap = [`instance_offset_matrix_0`,`instance_offset_matrix_1`,`instance_offset_matrix_2`,`instance_offset_matrix_3`];
        private static GpuInsAttrignoreMap = {"instance_offset_matrix_0":true,"instance_offset_matrix_1":true,"instance_offset_matrix_2":true,"instance_offset_matrix_3":true};
        private static helpDArray = new gd3d.math.ExtenArray<Float32Array>(Float32Array);
        private static helpIMatrix = new gd3d.math.matrix();


        start()
        {
            this.refreshLayerAndQue();

            if(this.lightmapIndex ==-2)
            {
                this.useGlobalLightMap=false;
            }
        }

        onPlay()
        {

        }

        /** 
         * 刷新 渲染layer 和 渲染 queueId （切换了材质时需要手动刷新）
         * *优化了自动处理的消耗
         *  */
        refreshLayerAndQue()
        {
            if (this.materials == null || this.materials.length == 0)
            {
                //没有材质 给一个默认材质
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
            let mesh = filter.getMeshOutput();
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

        private static onGpuInsDisableAttribute (info : meshGpuInstanceDrawInfo){
            if(!info) return;
            meshGpuInstanceDrawInfo.del_info(info);
        }

        static GpuInstancingRender(context: renderContext, instanceArray : gd3d.math.ReuseArray<IRendererGpuIns>, cacheBuffer? : Float32Array){
            let insLen = instanceArray.length;
            if(insLen < 1) return;
            DrawCallInfo.inc.currentState=DrawCallEnum.Meshrender;
            // let mr = instanceArray[0] as gd3d.framework.meshRenderer;
            let mr = instanceArray.get(0) as gd3d.framework.meshRenderer;
            // let go = instanceArray[0].gameObject;
            let go = mr.gameObject;
            // let tran = go.transform;
            let filter = mr.filter; 

            context.updateLightMask(go.layer);
            context.updateModelByMatrix(this.helpIMatrix);
            if(filter == null) return;
            let mesh = filter.getMeshOutput();
            if(mesh == null || mesh.glMesh == null || mesh.submesh == null) return;
            let subMeshs = mesh.submesh;

            // mesh.glMesh.bindVboBuffer(context.webgl);
            if (sceneMgr.scene.fog)
            {
                context.fog = sceneMgr.scene.fog;
            }
            let len = subMeshs.length;
            let drawtype = this.instanceDrawType();
            for (let i = 0; i < len; i++)
            {
                let sm = subMeshs[i];
                let mid = subMeshs[i].matIndex;//根据这个找到使用的具体哪个材质    
                let usemat = mr.materials[mid];

                let drawInstanceInfo: meshGpuInstanceDrawInfo = meshGpuInstanceDrawInfo.new_info();
                drawInstanceInfo.mid = mid;
                drawInstanceInfo.instanceCount = insLen;
                drawInstanceInfo.vbo = this._getVBO(context.webgl);
                drawInstanceInfo.instanceArray = instanceArray;
                drawInstanceInfo.helpDArray = this.helpDArray;
                drawInstanceInfo.onDisableAttribute = this.onGpuInsDisableAttribute.bind(this);

                ///----------------------------------------------------------------

                if (usemat != null)
                    usemat.draw(context, mesh, sm, drawtype , drawInstanceInfo);
            }
        }

        static GpuInstancingRenderBatcher(context: renderContext, batcher : meshGpuInsBatcher){
            let insLen = batcher.count;
            if(insLen < 1) return;
            DrawCallInfo.inc.currentState=DrawCallEnum.Meshrender;
            let mesh = batcher.mesh;
            let mats = batcher.materials;
            let gameLayer = batcher.gameLayer;
            
            context.updateLightMask(gameLayer);
            context.updateModelByMatrix(this.helpIMatrix);
            if (sceneMgr.scene.fog)
            {
                context.fog = sceneMgr.scene.fog;
            }

            let subMeshs = mesh.submesh;
            let len = subMeshs.length;
            for (let i = 0; i < len; i++)
            {
                let sm = subMeshs[i];
                let mid = subMeshs[i].matIndex;//根据这个找到使用的具体哪个材质    
                let usemat = mats[mid];
                let drawtype = this.instanceDrawType();
                let vbo = this._getVBO(context.webgl);

                let drawInstanceInfo: meshGpuInstanceDrawInfo = meshGpuInstanceDrawInfo.new_info();
                drawInstanceInfo.mid = mid;
                drawInstanceInfo.instanceCount = insLen;
                drawInstanceInfo.vbo = this._getVBO(context.webgl);
                drawInstanceInfo.cacheBuffers = batcher.bufferDArrs;
                drawInstanceInfo.bufferIdMap = batcher.passIdMap;
                drawInstanceInfo.onDisableAttribute = this.onGpuInsDisableAttribute.bind(this);

                if (usemat != null)
                    usemat.draw(context, mesh, sm, drawtype , drawInstanceInfo);
            }
        }

        /**
         * 设置 OffsetMatrix
         * @param tran transform
         * @param mat 材质对象
         * @param pass 绘制通道对象
         */
        static setInstanceOffsetMatrix(tran: gd3d.framework.transform, mat: material , pass : render.glDrawPass){
            if(!pass.program.mapAttrib[this.insOffsetMtxIDMap[0]]) return;
            this._setInstanceOffsetMatrix(tran , mat);
        }

        private static _setInstanceOffsetMatrix(tran: gd3d.framework.transform, mat: material){
            let _wmat = tran.getWorldMatrix();
            let len = 4;
            let rawdata = _wmat.rawData;
            for(let i=0;i<len;i++){
                let id = this.insOffsetMtxIDMap[i];
                let arr = mat.instanceAttribValMap[id];
                if(!arr) arr = mat.instanceAttribValMap[id] = [];
                 arr[0] = rawdata[0 + 4 * i];
                 arr[1] = rawdata[1 + 4 * i];
                 arr[2] = rawdata[2 + 4 * i];
                 arr[3] = rawdata[3 + 4 * i];
            }
        }

        static instanceDrawType(){
            let drawtype = "instance";
            //fog
            let _fog = gd3d.framework.sceneMgr.scene.fog;
            if (_fog)
            {
                drawtype = "instance_fog";
            }
            return drawtype;
        }

        private static _vbos: [WebGLRenderingContext, WebGLBuffer][] = [];
        private static _getVBO(gl: WebGLRenderingContext)
        {
            for (let i = 0, n = this._vbos.length; i < n; i++)
            {
                if (this._vbos[i][0] == gl)
                    return this._vbos[i][1];
            }
            let vbo = gl.createBuffer();
            this._vbos.push([gl, vbo]);
            return vbo;
        }

        isGpuInstancing(){
            // if(!this.materials || !this.materials[0]) return false;
            if(!this.materials || this.materials.length < 1) return false;
            return this.materials[0].enableGpuInstancing;
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