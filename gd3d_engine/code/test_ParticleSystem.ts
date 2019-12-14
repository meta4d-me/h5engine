namespace gd3d.math
{
    export interface color
    {
        "__class__"?: "gd3d.math.color"
    }

    export interface vector3
    {
        "__class__"?: "gd3d.math.vector3"
    }
}

/** 
 * 粒子系統示例
 */
class test_ParticleSystem implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;
    // res : string = "Cube";
    res : string = "ParticleSystem";
    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();
        await demoTool.loadbySync(`res/f14effprefab/customShader/customShader.assetbundle.json`,this.astMgr);

        await demoTool.loadbySync(`res/prefabs/${this.res}/${this.res}.assetbundle.json`,this.astMgr);
        //res/f14effprefab/customShader/customShader.assetbundle.json
        //
        this.init();
    }

    private init()
    {
        //相机-----------------------------------
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 1000;
        this.camera.fov = Math.PI / 3;
        this.camera.backgroundColor = new gd3d.math.color(0.2784, 0.2784, 0.2784, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0)

        // this.initParticleSystem();

        //load res to secnen
        let cubeP = this.astMgr.getAssetByName( `${this.res}.prefab.json` , `${this.res}.assetbundle.json`) as gd3d.framework.prefab;
        let cubeTran = cubeP.getCloneTrans();

        this.scene.addChild(cubeTran);
    }

    private initParticleSystem()
    {
        let tran = new gd3d.framework.transform();
        tran.name = "ParticleSystem";
        gd3d.math.quatFromAxisAngle(new gd3d.math.vector3(1, 0, 0), -90, tran.localRotate);
        tran.localRotate = tran.localRotate;
        this.scene.addChild(tran);

        // 新建粒子材质
        var mat = new gd3d.framework.material("defparticle1");
        // var shader = test_ParticleSystem_particles_additive.initShader(this.astMgr, this.astMgr.shaderPool);
        var shader = test_ParticleSystem_particles_additive_drawInstanced.initShader(this.astMgr, this.astMgr.shaderPool);
        mat.setShader(shader);

        var tex = this.astMgr.getDefaultTexture(gd3d.framework.defTexture.particle);
        mat.setTexture("_MainTex", tex);
        //
        let ps = tran.gameObject.getComponent("ParticleSystem") as gd3d.framework.ParticleSystem;
        if (!ps) ps = tran.gameObject.addComponent("ParticleSystem") as any;
        //
        ps.material = mat;
        // ps.mesh = this.astMgr.getDefaultMesh("cube");

        gd3d.framework.ClassUtils.addClassNameSpace("gd3d.framework");

        gd3d.framework.serialization.setValue(ps, pd);

        //
        ps.play();
    }

    update(delta: number)
    {

    }
}