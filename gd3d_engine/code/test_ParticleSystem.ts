/** 
 * 粒子系統
 */
class test_ParticleSystem implements IState {

    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;

    start(app: gd3d.framework.application) {

        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();
        //

        //相机-----------------------------------
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 120;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 15, -15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0)

        let mat_white = new gd3d.framework.material("white");
        mat_white.setShader(this.astMgr.getShader("shader/def"));
        mat_white.setVector4("_MainColor", new gd3d.math.vector4(1, 1, 1, 1));

        let tran = new gd3d.framework.transform();
        tran.localScale.x = 20;
        tran.localScale.y = 0.01;
        tran.localScale.z = 20;
        this.scene.addChild(tran);

        let mf = tran.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
        if (!mf) mf = tran.gameObject.addComponent("meshFilter") as any;
        let mr = tran.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        if (!mr) mr = tran.gameObject.addComponent("meshRenderer") as any;
        mr.materials[0] = mat_white;
        mf.mesh = this.astMgr.getDefaultMesh("cube");


    }

    update(delta: number) {

    }

}