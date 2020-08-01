
/** GPU 实例渲染模式  */
class test_GPU_instancing implements IState
{
    private static readonly help_quat : gd3d.math.quaternion = new gd3d.math.quaternion();
    private _app : gd3d.framework.application;
    private _scene: gd3d.framework.scene;
    private _mat_ins: gd3d.framework.material;
    private createCount = 10000;
    private instanceShBase : gd3d.framework.shader;
    private mats : gd3d.framework.material[] =[];
    private mrArr : gd3d.framework.meshRenderer[] =[];
    private lookAtCameraTransArr : gd3d.framework.transform[] =[];
    private isInstancing = true;
    private isStatic = true;
    private cubeRoot : gd3d.framework.transform;
    private cam : gd3d.framework.camera;
    private modelType : string = "";
    private subRange = 10;
    async start(app: gd3d.framework.application)
    {
        

        await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, app.getAssetMgr());
        await demoTool.loadbySync(`newRes/test/shader/customShader/customShader.assetbundle.json`, app.getAssetMgr());  //项目shader
        await datGui.init();

        let scene = this._scene = app.getScene();
        this.cubeRoot = new gd3d.framework.transform();
        this.cubeRoot.localTranslate.y = -5;
        scene.addChild(this.cubeRoot);
        this._app = app;
        //initCamera
        let objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        this.cam = cam;
        objCam.localTranslate = new gd3d.math.vector3(0, 15, -15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0);

        this.initMaterails();

        //绘制xx  个物体
        this.refresh();

        //
        app.showDrawCall();
        app.showFps();

        //set datui
        let _dat = new dat.GUI();
        _dat.add(this, "modelType", ["" , "bullet_11" , "bullet_12"]);
        _dat.add(this , 'isInstancing').listen();
        _dat.add(this , 'instanceSwitch');
        _dat.add(this , 'batcherSwitch');
        _dat.add(this , 'isStatic');
        _dat.add(this , 'needUpdate');
        _dat.add(this , 'createCount');
        _dat.add(this , 'refresh');

        //
        gd3d.framework.transform.prototype["checkToTop"] = () => { }; //去掉检查优化
        app.isFrustumCulling = false;
    }

    private _batcher = false;
    batcherSwitch(){
        this._batcher =!this._batcher;
        let renderList = this._scene.renderList;
        if(this._batcher){
            this.cubeRoot.parent.removeChild(this.cubeRoot);
            for(let key in gpuInstanceMgr.batcherMap){
                let v = gpuInstanceMgr.batcherMap[key];
                renderList.renderLayers[0].gpuInstanceStaticMap[key] = {renderers : v.renderers , buffer : v.darr.buffer}
            }
        }else{
            this._scene.addChild(this.cubeRoot);
            renderList.renderLayers[0].gpuInstanceStaticMap = {}; 
        }
    }

    refresh(){
        this.cubeRoot.removeAllChild();
        if(!this.modelType){
            this.createByNum(this.createCount);
        }else{
            this.loadTest(this.modelType);
        }     
    }

    private _needUpdate = true; 
    get needUpdate (){ return this._needUpdate;}
    set needUpdate (v){ 
        this._needUpdate = v;
        this.cubeRoot.gameObject.needUpdate = v;
    }

    private loadedTest = false; 
    async loadTest(modelName: string){
        let url = `newRes/pfb/model/${modelName}/${modelName}.assetbundle.json`;
        if(!this.loadedTest)
        await demoTool.loadbySync( url,this._app.getAssetMgr()) ;
        this.loadedTest = true;

        let m = this._app.getAssetMgr().getAssetByName(`${modelName}.prefab.json` , `${modelName}.assetbundle.json`) as gd3d.framework.prefab;
        let count = this.createCount;
        let  range = this.subRange;
        for(let i=0 ;i < count;i++){
            let tran = m.getCloneTrans();
            tran.gameObject.isStatic = true;
            this.cubeRoot.addChild(tran);
            gd3d.math.vec3Set(tran.localTranslate , Math.random() * range ,Math.random() * range , Math.random() * range );
            tran.localTranslate = tran.localTranslate;
            if(this.isInstancing){
                gpuInstanceMgr.setToGupInstance(tran , url , this.mats);
            }
            let mrs = tran.gameObject.getComponentsInChildren("meshRenderer") as gd3d.framework.meshRenderer[];
            mrs.forEach((v)=>{
                this.mrArr.push(v);
            });
        }
        if(this.isInstancing)
        for(let i=0, len = this.mrArr.length ;i < len;i++){
            gpuInstanceMgr.addToBatcher(this.mrArr[i]);
        }
    }

    createByNum(num:number){
        if(num < 1) num =1;
        let count = 0;
        while (count < num)
        {
            this.createOne(this._app ,this.isInstancing);
            count++;
        }
    }

    instanceSwitch(){
        this.isInstancing = !this.isInstancing;
        this.mats.forEach((v)=>{
            v.enableGpuInstancing = this.isInstancing;
        });
    }

    initMaterails(){
       this._mat_ins = new gd3d.framework.material("GPU_Instancing");
       this.instanceShBase = this._app .getAssetMgr().getShader("demo_gpu_instancing.shader.json");
       this._mat_ins.setShader(this.instanceShBase);
    }

    private count = 0;
    createOne(app , needInstance : boolean )
    {
        let obj = gd3d.framework.TransformUtil.CreatePrimitive(gd3d.framework.PrimitiveType.Cube, app);
        obj.gameObject.isStatic = this.isStatic;
        obj.name = `cube_${++this.count}`;
        this.cubeRoot.addChild(obj);
        let range = this.subRange;
        gd3d.math.vec3Set(obj.localPosition, this.getRandom(range), this.getRandom(range), this.getRandom(range));
        //change materail
        let mr = obj.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        let mat = this._mat_ins;
        mr.materials[0] = mat.clone();
        mr.materials[0].enableGpuInstancing = needInstance;
        mr.materials[0].setVector4("a_particle_color",new gd3d.math.vector4(Math.random(),Math.random(),Math.random(),1));
        this.mats.push(mr.materials[0]);
    }

    private lookAtCamera(trans : gd3d.framework.transform){
        if( !this.cam ) return;
        //朝向玩家
        let camPos = this.cam.gameObject.transform.localPosition;
        let tempQuat = test_GPU_instancing.help_quat;
        // gd3d.math.quatLookat(trans.getWorldPosition(), camPos,tempQuat);
        gd3d.math.quat2Lookat(trans.getWorldPosition(), camPos,tempQuat);
        trans.setWorldRotate(tempQuat);
    }

    private getRandom(range: number)
    {
        return range * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    }

    update(delta: number)
    {

    }
}

type batcherStrct = {sh : gd3d.framework.shader , pass : gd3d.render.glDrawPass , darr : gd3d.math.ExtenArray<Float32Array> , renderers : gd3d.math.ReuseArray<gd3d.framework.IRendererGpuIns>};
class gpuInstanceMgr{
    private static SetedMap : {[resUrl  : string] : boolean} = {}
    /**
     * 设置材质渲染到 gupInstance
     * @param tran   需要设置的对象
     * @param resUrl 资源的URL （去重操作）
     */
    static setToGupInstance(tran : gd3d.framework.transform , resUrl ?: string , mats?: gd3d.framework.material[]){
        if(this.SetedMap[resUrl] || !tran) return;
        if(resUrl) this.SetedMap[resUrl] = true;
        let mrs = tran.gameObject.getComponentsInChildren("meshRenderer") as gd3d.framework.meshRenderer[];
        for(let i = 0 , len = mrs.length ; i < len ;i++){
            let mr = mrs[i];
            for(let j=0 , len_1 = mr.materials.length ; j < len_1;j++){
                let mat = mr.materials[j];
                let canUseGpuIns = this.ckCanUseGpuInstance(mat);
                if(!canUseGpuIns) continue;
                mat.enableGpuInstancing = true;
                this.fillParameters(mat);
                if(mats){
                    mats.push(mat);
                }
            }
        }
    }

    private static fillParameters(mat : gd3d.framework.material){
        let staMap = mat.statedMapUniforms;
        for(let key in staMap){
            let val = staMap[key];
            if(typeof(val) == "number"){
                mat.setFloat(key , val);
                continue;
            }
            if(val instanceof gd3d.math.vector4){
               mat.setVector4(key , val);
                continue; 
            }
        }
    }

    private static ckCanUseGpuInstance(mat : gd3d.framework.material){
        if(!mat) return false;
        let sh = mat.getShader();
        if(!sh) return false;
        if(!sh.passes["instance"] && !sh.passes["instance_fog"]){
            console.warn(`shader ${sh.getName()} , 没有 instance 通道, 无法使用 gupInstance 功能.`);
            return false;
        }
        return true;    
    }

    // static Type batcherStrct = {[id : string] : {sh : gd3d.framework.shader , pass : gd3d.render.glDrawPass , darr : dArray<Float32Array>}};
    static batcherMap : {[id: string] : batcherStrct} = {};
    static addToBatcher(mr : gd3d.framework.meshRenderer ){
        let mat = mr.materials[0];
        let mf = mr.filter;
        if(!mf){
            mf = mr.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
        }
        if(!mf) return;
        let id = `${mf.mesh.getGUID()}_${mat.gpuInstancingGUID}`;
        let bs : batcherStrct = this.batcherMap[id];
        if(!bs){
            let _sh = mat.getShader();
            let _pass = _sh.passes[gd3d.framework.meshRenderer.instanceDrawType()][0];
            let _darr = new gd3d.math.ExtenArray<Float32Array>(Float32Array);
            // let _renderers = [];
            let _renderers = new gd3d.math.ReuseArray<gd3d.framework.IRendererGpuIns>();
            bs = this.batcherMap[id] = {sh : _sh , pass : _pass , darr : _darr , renderers : _renderers };
        }
        let pass : gd3d.render.glDrawPass = bs.pass;
        // let darr : gd3d.math.ExtenArray<Float32Array> = bs.darr;
        let darr : gd3d.math.ExtenArray<Float32Array> = bs.darr;
        let renderers : gd3d.math.ReuseArray<gd3d.framework.IRendererGpuIns> = bs.renderers;
        
        gd3d.framework.meshRenderer.setInstanceOffsetMatrix(mr.gameObject.transform , mat , pass); //RTS offset 矩阵
        renderers.push(mr);
        this.uploadInstanceAtteribute( mat , pass ,darr);  //收集 各material instance atteribute
    }

    private static uploadInstanceAtteribute(mat : gd3d.framework.material ,pass : gd3d.render.glDrawPass , darr: gd3d.math.ExtenArray<Float32Array>){
        // let sh = mat.getShader();
        // let pass = sh.passes[gd3d.framework.meshRenderer.instanceDrawType()][0];
        // gd3d.framework.meshRenderer.setInstanceOffsetMatrix(mr.gameObject.transform , mat , pass); //RTS offset 矩阵

        let attmap =  pass.program.mapCustomAttrib;
        for(let key in attmap){
            let arr = mat.instanceAttribValMap[key];
            if(!arr){
                let att = pass.program.mapCustomAttrib[key];
                // let oldLen = setContainer.length;
                // setContainer.length = oldLen + att.size;
                // setContainer.fill(0,oldLen);
                for(let i=0 , len = att.size ; i < len ; i++){
                    darr.push(0);
                }
            }else{
                for(let i=0 , len = arr.length ; i < len ; i++){
                    darr.push(arr[i]);
                }
            }
        }
    }

}

class gpuInstanceBatcher{
    // isDynamic : boolean = true;
    private _cellSize : number ;
    /** 浮标位置 */
    private buoy : number = 0;
    private _dArr : gd3d.math.ExtenArray<Float32Array>;
    get dBuffer (){return this._dArr;}
    constructor(size : number ){
        this._dArr = new gd3d.math.ExtenArray<Float32Array>(Float32Array);
        this._cellSize = size;
    }

    push(data : number[]){
        let uselen = Math.floor( data.length % this._cellSize);
        let count = 0;
        while(count < uselen){
            this._dArr.push(data[count]);
            count++;
        }
    }
}

