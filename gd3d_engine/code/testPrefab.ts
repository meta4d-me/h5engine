class test_loadprefab implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        let names: string[] = ["baihu"];
        let name = names[0];
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        if (s.isfinish)
                        {
                            var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as gd3d.framework.prefab;
                            this.baihu = _prefab.getCloneTrans();
                            this.scene.addChild(this.baihu);
                            this.baihu.localScale = new gd3d.math.vector3(30, 30, 30);
                            this.baihu.localTranslate = new gd3d.math.vector3(0, 0, 0);
                            // this.baihu.localEulerAngles = new gd3d.math.vector3();
                            this.baihu = _prefab.getCloneTrans();
                            objCam.localTranslate = new gd3d.math.vector3(0, 20, -10);
                            objCam.lookatPoint(new gd3d.math.vector3(0.1, 0.1, 0.1));
                            objCam.markDirty();
                        }
                    });
            }
        });


        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -15);
        objCam.markDirty();//标记为需要刷新

    }
    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        if (this.baihu)
        {
            objCam.lookat(this.baihu);
            objCam.markDirty();//标记为需要刷新
        }
    }
}