namespace gd3d.framework
{
    /**
     * @private
     */
    export class renderContext
    {
        constructor(webgl: WebGLRenderingContext)
        {
            this.webgl = webgl;
        }



        drawtype: string;
        webgl: WebGLRenderingContext;
        viewPortPixel: gd3d.math.rect = new gd3d.math.rect(0, 0, 0, 0);//像素的viewport
        eyePos: gd3d.math.vector4 = new gd3d.math.vector4();

        matrixView: gd3d.math.matrix = new gd3d.math.matrix();
        matrixProject: gd3d.math.matrix = new gd3d.math.matrix();
        matrixModel: gd3d.math.matrix = new gd3d.math.matrix();
        private _lastM_IT: gd3d.math.matrix = new gd3d.math.matrix();
        private _matrixWorld2Object: gd3d.math.matrix = new gd3d.math.matrix();
        /** M 矩阵的逆矩阵 */
        get matrixWorld2Object()
        {
            if(!gd3d.math.matrixEqual(this._lastM_IT,this.matrixModel , 0)){
                gd3d.math.matrixInverse(this.matrixModel, this._matrixWorld2Object);
                gd3d.math.matrixClone(this.matrixModel ,this._lastM_IT);
            }
            return this._matrixWorld2Object;
        }
        matrixModelViewProject: gd3d.math.matrix = new gd3d.math.matrix;

        private _matrixModelView: gd3d.math.matrix = new gd3d.math.matrix;
        get matrixModelView(){
            gd3d.math.matrixMultiply(this.matrixView , this.matrixModel ,this._matrixModelView);
            return this._matrixModelView;
        }

        private _matrixInverseModelView: gd3d.math.matrix = new gd3d.math.matrix;
        private _lastMV_IT : gd3d.math.matrix = new gd3d.math.matrix;
        /** MV 矩阵的逆转置矩阵 */
        get matrixInverseModelView(){
            if(!gd3d.math.matrixEqual(this._lastMV_IT , this.matrixModelView , 0)){
                gd3d.math.matrixInverse(this.matrixModelView, this._matrixInverseModelView);
                gd3d.math.matrixTranspose(this._matrixInverseModelView,this._matrixInverseModelView);
                gd3d.math.matrixClone(this._matrixModelView ,this._lastMV_IT);
            }
            return this._matrixInverseModelView;
        }

        matrixViewProject: gd3d.math.matrix = new gd3d.math.matrix;
        //matrixNormal: gd3d.math.matrix = new gd3d.math.matrix();
        floatTimer: number = 0;
        //最多8灯，再多不管
        intLightCount: number = 0;
        vec4LightPos: Float32Array = new Float32Array(32);
        vec4LightDir: Float32Array = new Float32Array(32);
        vec4LightColor: Float32Array = new Float32Array(32);
        floatLightRange: Float32Array = new Float32Array(8);
        floatLightIntensity: Float32Array = new Float32Array(8);
        floatLightSpotAngleCos: Float32Array = new Float32Array(8);
        private _intLightCount: number = 0;
        private _lightCullingMask: number[] = [];
        private _vec4LightPos: Float32Array = new Float32Array(32);
        private _vec4LightDir: Float32Array = new Float32Array(32);
        private _vec4LightColor: Float32Array = new Float32Array(32);
        private _floatLightRange: Float32Array = new Float32Array(8);
        private _floatLightIntensity: Float32Array = new Float32Array(8);
        private _floatLightSpotAngleCos: Float32Array = new Float32Array(8);


        lightmap: gd3d.framework.texture = null;
        lightmapUV: number = 1;
        lightmapOffset: gd3d.math.vector4 = new gd3d.math.vector4(1, 1, 0, 0);
        fog: Fog;

        //skin auto uniform
        vec4_bones: Float32Array;
        matrix_bones: Float32Array;
        updateCamera(app: application, camera: camera)
        {
            // camera.calcViewPortPixel(app, this.viewPortPixel);
            // var asp = this.viewPortPixel.w / this.viewPortPixel.h;
            //update viewport

            // camera.calcViewMatrix(this.matrixView);
            // camera.calcProjectMatrix(asp, this.matrixProject);
            // gd3d.math.matrixMultiply(this.matrixProject, this.matrixView, this.matrixViewProject);
            camera.calcViewProjectMatrix(app,this.matrixViewProject,this.matrixView,this.matrixProject);
            this.floatTimer = app.getTotalTime();

            var pso = camera.gameObject.transform.getWorldTranslate();
            this.eyePos.x = pso.x;
            this.eyePos.y = pso.y;
            this.eyePos.z = pso.z;
        }
        updateLights(lights: light[])
        {
            this._intLightCount = lights.length;
            if(this._intLightCount < 1) return;
            
            this._lightCullingMask.length = 0;
            var dirt = math.pool.new_vector3();
            for (var i = 0, len = lights.length; i < len; i++)
            {
                this._lightCullingMask.push(lights[i].cullingMask);
                {
                    var pos = lights[i].gameObject.transform.getWorldTranslate();
                    this._vec4LightPos[i * 4 + 0] = pos.x;
                    this._vec4LightPos[i * 4 + 1] = pos.y;
                    this._vec4LightPos[i * 4 + 2] = pos.z;
                    this._vec4LightPos[i * 4 + 3] = lights[i].type == framework.LightTypeEnum.Direction ? 0 : 1;

                    lights[i].gameObject.transform.getForwardInWorld(dirt);
                    this._vec4LightDir[i * 4 + 0] = dirt.x;
                    this._vec4LightDir[i * 4 + 1] = dirt.y;
                    this._vec4LightDir[i * 4 + 2] = dirt.z;
                    this._vec4LightDir[i * 4 + 3] = lights[i].type == framework.LightTypeEnum.Point ? 0 : 1;
                    //dir.w=1 && pos.w=1 表示聚光灯
                    //dir.w=0 && pos.w=1 表示点光源
                    //dir.w=1 && pos.w=0 表示方向光
                    this._floatLightSpotAngleCos[i] = lights[i].spotAngelCos;

                    this._vec4LightColor[i * 4 + 0] = lights[i].color.r;
                    this._vec4LightColor[i * 4 + 1] = lights[i].color.g;
                    this._vec4LightColor[i * 4 + 2] = lights[i].color.b;
                    this._vec4LightColor[i * 4 + 3] = lights[i].color.a;

                    this._floatLightRange[i] = lights[i].range;
                    this._floatLightIntensity[i] = lights[i].intensity;
                }

            }
            math.pool.delete_vector3(dirt);
            //收集灯光参数
        }
        updateOverlay()  
        {   //可能性优化点 UI 不用乘MVP 矩阵
            //v 特殊
            //gd3d.math.matrixMakeIdentity(this.matrixView);//v
            //gd3d.math.matrixMakeIdentity(this.matrixProject);//p
            //gd3d.math.matrixMultiply(this.matrixProject, this.matrixView, this.matrixViewProject);//vp

            //gd3d.math.matrixMakeIdentity(this.matrixModel);//m
            //gd3d.math.matrixMultiply(this.matrixView, this.matrixModel, this.matrixModelView);//mv
            //gd3d.math.matrixMultiply(this.matrixViewProject, this.matrixModel, this.matrixModelViewProject);//mvp
            gd3d.math.matrixMakeIdentity(this.matrixModelViewProject);
        }
        updateModel(model: transform)
        {
            this.updateModelByMatrix(model.getWorldMatrix());
        }
        updateModelByMatrix(m_matrix: gd3d.math.matrix)
        {
            //注意，这tm是个引用
            gd3d.math.matrixClone(m_matrix, this.matrixModel);
            gd3d.math.matrixMultiply(this.matrixViewProject, this.matrixModel, this.matrixModelViewProject);
        }

        //为特效拖尾服务
        updateModeTrail()
        {
            gd3d.math.matrixClone(this.matrixView, this.matrixModelView);
            gd3d.math.matrixClone(this.matrixViewProject, this.matrixModelViewProject);
        }

        //更新 光照剔除mask
        updateLightMask(layer: number)
        {
            this.intLightCount = 0;
            if (this._intLightCount == 0) return;
            let num = 1 << layer;
            let indexList: number[] = [];
            for (var i = 0; i < this._lightCullingMask.length; i++)
            {
                let mask = this._lightCullingMask[i];
                if (mask & num) indexList.push(i);
            }
            this.intLightCount = indexList.length;
            for (var i = 0; i < indexList.length; i++)
            {
                let idx = indexList[i];
                this.floatLightSpotAngleCos[i] = this._floatLightSpotAngleCos[idx];
                this.floatLightRange[i] = this._floatLightRange[idx];
                this.floatLightIntensity[i] = this._floatLightIntensity[idx];
                //pos
                this.vec4LightPos[i * 4 + 0] = this._vec4LightPos[idx * 4 + 0];
                this.vec4LightPos[i * 4 + 1] = this._vec4LightPos[idx * 4 + 1];
                this.vec4LightPos[i * 4 + 2] = this._vec4LightPos[idx * 4 + 2];
                this.vec4LightPos[i * 4 + 3] = this._vec4LightPos[idx * 4 + 3];
                //dir
                this.vec4LightDir[i * 4 + 0] = this._vec4LightDir[idx * 4 + 0];
                this.vec4LightDir[i * 4 + 1] = this._vec4LightDir[idx * 4 + 1];
                this.vec4LightDir[i * 4 + 2] = this._vec4LightDir[idx * 4 + 2];
                this.vec4LightDir[i * 4 + 3] = this._vec4LightDir[idx * 4 + 3];
                //color
                this.vec4LightColor[i * 4 + 0] = this._vec4LightColor[idx * 4 + 0];
                this.vec4LightColor[i * 4 + 1] = this._vec4LightColor[idx * 4 + 1];
                this.vec4LightColor[i * 4 + 2] = this._vec4LightColor[idx * 4 + 2];
                this.vec4LightColor[i * 4 + 3] = this._vec4LightColor[idx * 4 + 3];
            }
        }
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 渲染的层级
     * @version gd3d 1.0
     */
    export enum RenderLayerEnum
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 不透明
         * @version gd3d 1.0
         */
        Common,
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 半透明
         * @version gd3d 1.0
         */
        Transparent,
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * Overlay层
         * @version gd3d 1.0
         */
        Overlay,
    }
    // /**
    //  * @public
    //  * @language zh_CN
    //  * @classdesc
    //  * 渲染器接口 继承自组件接口
    //  * @version gd3d 1.0
    //  */
    // export interface IRenderer extends INodeComponent
    // {
    //     layer: RenderLayerEnum;
    //     renderLayer: number;  //后期发现 和 gameObject.layer 概念冲突 ，实现时 对接处理
    //     queue: number;

    //     render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera);
    // }

    /**
     * @private
     */
    export class renderList
    {
        constructor()
        {
            this.renderLayers = [];
            var common = new renderLayer(false);
            var transparent = new renderLayer(true);
            var overlay = new renderLayer(true);
            this.renderLayers.push(common);
            this.renderLayers.push(transparent);
            this.renderLayers.push(overlay);
        }
        clear()
        {            
            let len = this.renderLayers.length;
            for(let i=0;i < len;i++){
                this.renderLayers[i].list.length = 0;
                let obj = this.renderLayers[i].gpuInstanceMap;
                for(let key in obj){
                    // obj[key].clear();
                    obj[key].length=0;
                }
                // this.renderLayers[i].gpuInstanceMap = {};
            }
        }
        addRenderer(renderer: IRenderer , webgl : WebGLRenderingContext)
        {
            let layer = renderer.layer; 
            if (layer == RenderLayerEnum.Common)
            {
                var idx = 0;
            }
            else if (layer == RenderLayerEnum.Overlay)
            {
                idx = 2;
            }
            else if (layer == RenderLayerEnum.Transparent)
            {
                idx = 1;
            }
            let gpuInsR = (renderer as IRendererGpuIns);
            if(!webgl.drawArraysInstanced || !gpuInsR.isGpuInstancing || !gpuInsR.isGpuInstancing()){
                this.renderLayers[idx].list.push(renderer);
            }else{
                this.renderLayers[idx].addInstance(gpuInsR);
            }
        }

        // addStaticInstanceRenderer(renderer: IRendererGpuIns , webgl : WebGLRenderingContext){
        //     if(!webgl.drawArraysInstanced || !renderer.isGpuInstancing || !renderer.isGpuInstancing()) return;
        //     let idx = 0;
        //     if (renderer.layer == RenderLayerEnum.Common)
        //     {
        //     }
        //     else if (renderer.layer == RenderLayerEnum.Transparent)
        //     {
        //         idx = 1;
        //     }
        //     else if (renderer.layer == RenderLayerEnum.Overlay)
        //     {
        //         idx = 2;
        //     }

        //     this.renderLayers[idx].addInstance

        // }

        
        //此处应该根据绘制分类处理
        renderLayers: renderLayer[];
    }
    /**
     * @private
     */
    export class renderLayer
    {
        needSort: boolean = false;
        //先暂时分配 透明与不透明两组
        list: IRenderer[] = [];
        constructor(_sort: boolean = false)
        {
            this.needSort = _sort;
        }

        /** gpu instance map*/
        // gpuInstanceMap: {[sID:string] : IRendererGpuIns[]} = {}; 
        gpuInstanceMap: {[sID:string] : math.ReuseArray<IRendererGpuIns>} = {}; 
        /** gpu instance 静态渲染模式 ，玩家自己管理 */
        // gpuInstanceStaticMap: {[sID:string] : { renderers : IRendererGpuIns[] , buffer : Float32Array}} = {}; 
        gpuInstanceStaticMap: {[sID:string] : { renderers : math.ReuseArray<IRendererGpuIns> , buffer : Float32Array}} = {}; 

        addInstance(r : IRendererGpuIns){
            let mr = r as meshRenderer;
            let mf = mr.filter;
            if(!mf || !mf.mesh) return;
            let mat = mr.materials[0];
            if(!mat) return;
            let gpuInstancingGUID = mat.gpuInstancingGUID;
            if(!gpuInstancingGUID) return;
            // let sh = mat.getShader();
            // if(!sh) return;
            // if(!sh.passes["instance"] && !sh.passes["instance_fog"]){
            //     console.warn(`shader ${sh.getName()} , has not "instance" pass when enable gpuInstance on the material ${mat.getName()}.`);
            //     return;
            // }
            // let texId = this.getTexId(mat);

            // let id = `${mf.mesh.getGUID()}_${gpuInstancingGUID}`;
            let id = renderLayer.getRandererGUID(mf.mesh.getGUID() , gpuInstancingGUID);
            if(!this.gpuInstanceMap[id]) {
                this.gpuInstanceMap[id] = new math.ReuseArray<IRendererGpuIns>();
            }
            this.gpuInstanceMap[id].push(r);
        }


        private static gpuInsRandererGUID = -1;
        private static gpuInsRandererGUIDMap = {};
        /** gpuInstancing 唯一ID */
        private static getRandererGUID(meshGuid :number , materialGuid : string): number{
            let meshTemp = this.gpuInsRandererGUIDMap[meshGuid];
            if(!meshTemp){
                meshTemp = this.gpuInsRandererGUIDMap[meshGuid] = {};
            }
            let rId = meshTemp[materialGuid];
            if(rId == null){
                this.gpuInsRandererGUID++;
                rId = meshTemp[materialGuid] = this.gpuInsRandererGUID;
            }
            return rId;
        }

        // addInstanceStatic(rs : IRendererGpuIns[]){
        //     this.gpuInstanceStaticMap

        // }

        // private getTexId(mat : material) : string{
        //     let result = "";
        //     let staMap = mat.statedMapUniforms;
        //     for(let key in staMap){
        //         let val = staMap[key];
        //         if(val.getGUID == null) continue;
        //         let guid = (val as gd3d.framework.texture).getGUID();
        //         result += `_${guid}`;
        //     }
        //     return result;
        // }
    }

}