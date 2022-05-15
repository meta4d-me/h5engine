class test_loadScene implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        objCam.localTranslate = new gd3d.math.vector3(-20, 50, -20);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 100));
        objCam.markDirty();//标记为需要刷新
        CameraController.instance().init(this.app, camera);

        util.loadShader(assetMgr)
            .then(() =>
            {
                let sceneName = "testnav"
                assetMgr.load(`newRes/pfb/scene/${sceneName}/${sceneName}.assetbundle.json`, gd3d.framework.AssetTypeEnum.Auto, (s1) =>
                {
                    if (s1.isfinish)
                    {
                        var _scene = assetMgr.getAssetByName(sceneName + ".scene.json", `${sceneName}.assetbundle.json`) as gd3d.framework.rawscene;
                        var _root = _scene.getSceneRoot();
                        this.scene.addChild(_root);
                        this.app.getScene().lightmaps = [];
                        _scene.useLightMap(this.app.getScene());
                        _scene.useFog(this.app.getScene());
                    }
                });
            })
    }

    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        CameraController.instance().update(delta);
    }
}