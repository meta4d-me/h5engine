/// <reference path="../lib/dat.gui.d.ts" />

/** 
 * 线条渲染组件示例
 */
class test_LineRenderer implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;

    lr: gd3d.framework.LineRenderer

    loop = false;
    viewcamera = false;
    useCurve = false;
    curveSamples = 10;
    numCapVertices = 0;
    numCornerVertices = 0;
    uSpeed = 0;
    vSpeed = 0;

    res = "Line";

    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        gd3d.framework.assetMgr.openGuid = false;

        await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, this.astMgr);
        await datGui.init();

        //
        this.setGUI();
        //
        this.init();
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'loop');
        gui.add(this, 'viewcamera');
        gui.add(this, 'useCurve');
        gui.add(this, 'curveSamples');
        gui.add(this, 'numCapVertices');
        gui.add(this, 'numCornerVertices');
        gui.add(this, 'uSpeed');
        gui.add(this, 'vSpeed');
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
        this.camera.fov = Math.PI * 2 / 3;
        this.camera.backgroundColor = new gd3d.math.color(0.2784, 0.2784, 0.2784, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 3;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 0, 0)

        // this.initLineRenderer();
        this.loadRes(this.res);
    }

    private initLineRenderer()
    {
        let tran = new gd3d.framework.transform();
        tran.name = "LineRenderer";
        this.scene.addChild(tran);

        //
        let lr = tran.gameObject.getComponent("LineRenderer") as gd3d.framework.LineRenderer;
        if (!lr) lr = tran.gameObject.addComponent("linerenderer") as any;
        //
        this.lr = lr;
        //
        lr.positions = [new gd3d.math.vector3(0, 0, 0), new gd3d.math.vector3(1, 0, 0), new gd3d.math.vector3(0, 1, 0),];
    }

    private async loadRes(res: string)
    {
        if (this.lr)
        {
            this.scene.removeChild(this.lr.transform);
            this.lr = null;
        }

        await demoTool.loadbySync(`res/prefabs/effects/${res}/${res}.assetbundle.json`, this.astMgr);

        let cubeP = this.astMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as gd3d.framework.prefab;
        let cubeTran = cubeP.getCloneTrans();

        this.lr = cubeTran.gameObject.getComponent("LineRenderer") as gd3d.framework.LineRenderer;

        this.scene.addChild(cubeTran);
    }

    update(delta: number)
    {
        if (this.lr)
        {
            this.lr.loop = this.loop;
            this.lr.alignment = this.viewcamera ? gd3d.framework.LineAlignment.View : gd3d.framework.LineAlignment.TransformZ;
            this.lr.useCurve = this.useCurve;
            this.lr.curveSamples = this.curveSamples;
            this.lr.numCapVertices = this.numCapVertices;
            this.lr.numCornerVertices = this.numCornerVertices;
            this.lr.uvSpeed.x = this.uSpeed;
            this.lr.uvSpeed.y = this.vSpeed;
        }
    }
}