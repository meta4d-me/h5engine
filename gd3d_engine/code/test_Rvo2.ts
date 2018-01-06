declare var RVO;

class test_Rvo2 implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    inputMgr:gd3d.framework.inputMgr;
    assetMgr: gd3d.framework.assetMgr;
    size = 0.5;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.inputMgr = this.app.getInputMgr();
        this.assetMgr = app.getAssetMgr();
        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.far = 1000;
        objCam.localTranslate = new gd3d.math.vector3(0, 50, 0);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        CameraController.instance().init(this.app, this.camera);

        this.init();
    }

    spheres:gd3d.framework.transform[] = [];
    init(){
        //加球
        let sphere = new gd3d.framework.transform;
        sphere.localTranslate.x =sphere.localTranslate.y =sphere.localTranslate.z = 0;
        let mf = sphere.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        mf.mesh = this.assetMgr.getDefaultMesh("sphere") as gd3d.framework.mesh;
        let mr = sphere.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        mr.materials = [];
        mr.materials[0] = new gd3d.framework.material("sphere");
        mr.materials[0].setShader(this.assetMgr.getShader("shader/def"));
        let count = 6;
        let radius = 15;
        let tempdir = gd3d.math.pool.new_vector3();
        for(var i=0; i< count ;i++){
            gd3d.math.vec3Set_One(tempdir);
            let rate = i/count;
            tempdir.x = Math.sin(rate*2*Math.PI);
            tempdir.z = Math.cos(rate*2*Math.PI);
            gd3d.math.vec3Normalize(tempdir,tempdir);
            let temps = sphere.clone();
            this.scene.addChild(temps);
            gd3d.math.vec3ScaleByNum(tempdir,radius,tempdir);
            gd3d.math.vec3Clone(tempdir,temps.localTranslate);
            temps.markDirty();
        }

    }

    camera:gd3d.framework.camera;
    update(delta: number)
    {
        CameraController.instance().update(delta);
        
    }
}