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
            DrawCallInfo.inc.currentState = DrawCallEnum.Meshrender;
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

        }

        private static helpIMatrix = new gd3d.math.matrix();
        static GpuInstancingRender(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera , instanceArray : IRendererGpuIns[]){
            let insLen = instanceArray.length;
            if(insLen < 1) return;
            DrawCallInfo.inc.currentState=DrawCallEnum.Meshrender;
            let mr = instanceArray[0] as gd3d.framework.meshRenderer;
            let go = instanceArray[0].gameObject;
            let tran = go.transform;
            let filter = mr.filter; 

            context.updateLightMask(go.layer);
            context.updateModelByMatrix(this.helpIMatrix);
            if(filter == null) return;
            let mesh = filter.getMeshOutput();
            if(mesh == null || mesh.glMesh == null || mesh.submesh == null) return;
            let subMeshs = mesh.submesh;

            mesh.glMesh.bindVboBuffer(context.webgl);

            let len = subMeshs.length;
            for (let i = 0; i < len; i++)
            {
                let sm = subMeshs[i];
                let mid = subMeshs[i].matIndex;//根据这个找到使用的具体哪个材质    
                let usemat = mr.materials[mid];
                let drawtype = this.instanceDrawType(context,mr,sm);

                ///--------------------------darw instancing--------------------------------------
                // let _attributes = this._attributes;
                // let data: number[] = [];
                // for (let i = 0, n = insLen; i < n; i++)
                // {
                //     let insObj = instanceArray[i];
                //     let _wmat = insObj.gameObject.transform.getWorldMatrix();
                //     let rawdata = _wmat.rawData;
                //     data.push(
                //         rawdata[0],rawdata[1],rawdata[2],rawdata[3],
                //         rawdata[4],rawdata[5],rawdata[6],rawdata[7],
                //         rawdata[8],rawdata[9],rawdata[10],rawdata[11],
                //         rawdata[12],rawdata[13],rawdata[14],rawdata[15],
                //         // Math.random(),Math.random(),Math.random(),1
                //         1,0,1,1
                //     );
    
                // }
                

                // let stride = _attributes.reduce((pv, cv) => pv += cv[1], 0) * 4;
                
                let vbo = this._getVBO(context.webgl);
                let drawInstanceInfo: DrawInstanceInfo = {
                    instanceCount: insLen,
                    initBuffer: (gl ) =>
                    {
                        // gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                        
                    },
                    activeAttributes: (gl, pass) =>
                    {
                        // let program = pass.program.program;
                        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                        let data = [];
                        for(let i=0;i < insLen ;i++){
                            let mr = instanceArray[i] as meshRenderer;
                            let mat = mr.materials[mid];
                            this.setInstanceOffsetMatrix(mr.gameObject.transform,mat); //RTS offset 矩阵
                            mat.uploadInstanceAtteribute( pass ,data);  //收集 各material instance atteribute
                        }
                        
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                        
                        let offset = 0;
                        // _attributes.forEach(element =>
                        // {
                            //     let location = gl.getAttribLocation(program, element[0]);
                            //     if (location == -1) return;
                            
                            //     gl.enableVertexAttribArray(location);
                            //     gl.vertexAttribPointer(location, element[1], gl.FLOAT, false, stride, offset);
                        //     gl.vertexAttribDivisor(location, 1);
                        //     offset += element[1] * 4;
                        
                        // });

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
                    },
                    disableAttributes: (gl, pass) =>
                    {
                        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

                        let attMap = pass.program.mapCustomAttrib;
                        for(let key in attMap){
                            let att = attMap[key];
                            let location = att.location;
                            if (location == -1) break;
    
                            gl.vertexAttribDivisor(location, 0);
                            gl.disableVertexAttribArray(location);
                        }
                    },
                };
                ///----------------------------------------------------------------

                if (usemat != null)
                    usemat.draw(context, mesh, sm, drawtype , drawInstanceInfo);
            }


                // mr.materials[0].draw(context,mesh , subMeshs[0], "base", drawInstanceInfo);

            //---------------------
            // mr.render(context,assetmgr,camera);
        }

        private static setInstanceOffsetMatrix(tran: gd3d.framework.transform, mat: material){
            let _wmat = tran.getWorldMatrix();
            let insOffsetMtxStr = "instance_offset_matrix_";
            let len = 4;
            let rawdata = _wmat.rawData;
            for(let i=0;i<len;i++){
                let arr = mat.instanceAttribValMap[`${insOffsetMtxStr}${i}`];
                if(!arr) arr = mat.instanceAttribValMap[`${insOffsetMtxStr}${i}`] = [];
                 arr[0] = rawdata[0 + 4 * i];
                 arr[1] = rawdata[1 + 4 * i];
                 arr[2] = rawdata[2 + 4 * i];
                 arr[3] = rawdata[3 + 4 * i];
            }
        }

        private static instanceDrawType(context : renderContext , mr : meshRenderer ,  _subMeshInfo : subMeshInfo){
            let drawtype = "instance_base";
            //fog
            let _fog = gd3d.framework.sceneMgr.scene.fog;
            if (_fog)
            {
                drawtype +="_fog" 
                context.fog = _fog;
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
            if(!this.materials || !this.materials[0]) return false;
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