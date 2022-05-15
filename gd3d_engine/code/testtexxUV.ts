class test_texuv implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);

        util.loadShader(this.app.getAssetMgr())
            .then(() => util.loadTex("res/trailtest_yellow.png", this.app.getAssetMgr()))
            .then(() =>
            {
                let base = this.createBaseCube();
                base.localTranslate.x = -1;
                base.markDirty();

                let uv = this.createUvCube();
                uv.localPosition.x = 1;
                uv.markDirty();

            })

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        //this.camera.backgroundColor=new gd3d.math.color(0,0,0,1);
        objCam.localTranslate = new gd3d.math.vector3(0, 2, 5);
        objCam.lookatPoint(new gd3d.math.vector3());
        objCam.markDirty();//标记为需要刷新
    }

    private createBaseCube()
    {
        var mat = new gd3d.framework.material();
        var shader = gd3d.framework.sceneMgr.app.getAssetMgr().getShader("diffuse.shader.json");
        mat.setShader(shader);
        var tex = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName("trailtest_yellow.png") as gd3d.framework.texture;
        mat.setTexture("_MainTex", tex);

        var trans = new gd3d.framework.transform();
        var meshf = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        var meshr = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        meshr.materials = [];
        meshr.materials.push(mat);
        var mesh = gd3d.framework.sceneMgr.app.getAssetMgr().getDefaultMesh("cube");
        meshf.mesh = mesh;

        this.scene.addChild(trans);
        return trans;
    }

    private createUvCube()
    {
        var mat = new gd3d.framework.material();
        var shader = gd3d.framework.sceneMgr.app.getAssetMgr().getShader("testtexuv.shader.json");
        mat.setShader(shader);
        var tex = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName("trailtest_yellow.png") as gd3d.framework.texture;
        mat.setTexture("_MainTex", tex);

        var trans = new gd3d.framework.transform();
        var meshf = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        var meshr = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        meshr.materials = [];
        meshr.materials.push(mat);
        var mesh = gd3d.framework.sceneMgr.app.getAssetMgr().getDefaultMesh("cube");
        meshf.mesh = mesh;

        this.scene.addChild(trans);
        return trans;
    }


    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number = 0;
    update(delta: number)
    {

    }
}