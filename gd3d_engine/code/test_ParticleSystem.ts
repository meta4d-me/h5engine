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
        mat_white.setShader(this.astMgr.getShader("diffuse.shader.json"));
        mat_white.setVector4("_MainColor", new gd3d.math.vector4(1,1,1,1) );

        let trans = new gd3d.framework.transform();
        trans.localScale.x = 20;
        trans.localScale.y = 0.01;
        trans.localScale.z = 20;
        this.scene.addChild(trans);
        physics3dDemoTool.attachMesh(trans, mat_white, "cube");
    }

    update(delta: number) {

    }

}