
/** GPU 实例渲染模式  */
class test_GPU_instancing implements IState
{
    private _app : gd3d.framework.application;
    private _scene: gd3d.framework.scene;
    private _mat_ins: gd3d.framework.material;
    private createCount = 500;
    private instanceShBase : gd3d.framework.shader;
    private mats : gd3d.framework.material[] =[];
    private isInstancing = true;
    private cubeRoot : gd3d.framework.transform;
    async start(app: gd3d.framework.application)
    {
        await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, app.getAssetMgr());
        await datGui.init();

        let scene = this._scene = app.getScene();
        this.cubeRoot = new gd3d.framework.transform();
        scene.addChild(this.cubeRoot);
        this._app = app;
        //initCamera
        let objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
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
        _dat.add(this , 'isInstancing');
        _dat.add(this , 'createCount');
        _dat.add(this , 'refresh');

    }

    refresh(){
        this.cubeRoot.removeAllChild();
        this.createByNum(this.createCount);
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

    createOne(app , needInstance : boolean )
    {
        let obj = gd3d.framework.TransformUtil.CreatePrimitive(gd3d.framework.PrimitiveType.Cube, app);
        this.cubeRoot.addChild(obj);
        let range = 10;
        gd3d.math.vec3Set(obj.localPosition, this.getRandom(range), this.getRandom(range), this.getRandom(range));
        //change materail
        let mr = obj.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        let mat = this._mat_ins;
        mr.materials[0] = mat.clone();
        mr.materials[0].enableGpuInstancing = needInstance;
        mr.materials[0].setVector4("a_particle_color",new gd3d.math.vector4(Math.random(),Math.random(),Math.random(),1));
        this.mats.push(mr.materials[0]);
    }

    private getRandom(range: number)
    {
        return range * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    }

    update(delta: number)
    {


    }
}