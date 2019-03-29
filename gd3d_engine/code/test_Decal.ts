/** 表面贴花 样例 */
class test_Decal implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    assetMgr: gd3d.framework.assetMgr;
    private buildingPname = "Map_Castle_dajiwuA";
    private texName = "EF_decal_yp.png";
    private inited = false;
    async start  (app: gd3d.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();
        await demoTool.loadbySync(`./res/shader/shader.assetbundle.json`,this.assetMgr);
        await demoTool.loadbySync(`./res/texture/${this.texName}`,this.assetMgr);
        await demoTool.loadbySync(`./res/prefabs/${this.buildingPname}/${this.buildingPname}.assetbundle.json`,this.assetMgr);
        await datGui.init();
        this.init();
        this.inited = true; 
        return null;
    }

    private dec  = "点击模型发射贴上弹痕";
    private building : gd3d.framework.transform;
    init(){
        this.initCamera();
        //建筑
        let bPrefb = this.assetMgr.getAssetByName(`${this.buildingPname}.prefab.json`) as gd3d.framework.prefab;
        let bTrans = bPrefb.getCloneTrans();
        this.building = bTrans;
        let mf = bTrans.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
        gd3d.math.vec3SetAll(bTrans.localScale,5);
        this.scene.addChild(bTrans);
        
        //贴花模板
        let templateD = new gd3d.framework.transform();
        let mr = templateD.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        mr.materials= [];
        mr.materials[0] = new gd3d.framework.material();
        mr.materials[0].setShader(this.assetMgr.getShader("particles_blend.shader.json"));
        mr.materials[0].setTexture("_Main_Tex",this.assetMgr.getAssetByName(this.texName) as gd3d.framework.texture);

        //Manager
        let mgr = new gd3d.framework.transform ();
        this.scene.addChild(mgr);
        let decal = mgr.gameObject.addComponent("decalCreater") as decalCreater;
        decal.tempTex = mr;
        decal.targetMF = mf;
        decal.camera = this.camera;

         //adtUI
         let gui = new dat.GUI();;
         gui.add( this , 'dec');
    }

    private initCamera(){
        //相机-----------------------------------
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 1000;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0,15,-15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30 ;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0)
    }

    private Y_ag = 0; 
    update(delta: number) {
        if(!this.inited) return;
        this.Y_ag += delta * 30;
        gd3d.math.quatFromEulerAngles(0,this.Y_ag,0,this.building.localRotate);
        this.building.localRotate = this.building.localRotate;
    }

}