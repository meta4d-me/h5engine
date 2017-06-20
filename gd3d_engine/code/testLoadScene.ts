class test_loadScene implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        this.cube = new gd3d.framework.transform();
        this.scene.addChild(this.cube);
        let names: string[] = ["xinshoucun_fuben_day","city"];
        let name = names[1];
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/scenes/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                    // this.app.getAssetMgr().load("res/scenes/test/test.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        console.log(s.curtask + "/" + s.totaltask);
                        console.log(s.progress);
                        if (s.isfinish)
                        {

                            // this.app.getAssetMgr().loadScene("city.scene.json", () =>
                            // {
                            // this.app.getAssetMgr().load("res/particleEffect/fx_shuijing_cj/fx_shuijing_cj.effect.json", gd3d.framework.AssetTypeEnum.Effect, (state) =>
                            // {
                            //     if (state.isfinish)
                            //     {
                            //         // var effect = state.resstate["start.effect.json"].res as gd3d.framework.Effect;
                            //         var effect = this.app.getAssetMgr().getAssetByName("fx_shuijing_cj.effect.json") as gd3d.framework.Effect;
                            //         let trans = effect.clonetotran(this.camera);
                            //         trans.localScale = new gd3d.math.vector3(1.5, 1.5, 1.5);
                            //         trans.localTranslate = new gd3d.math.vector3(-13.72, -1.147, -26.23);
                            //         this.scene.getChildByName("10004a_gemstone01").addChild(trans);
                            //         trans.markDirty();
                            //     }
                            // });

                            var _scene: gd3d.framework.rawscene = this.app.getAssetMgr().getAssetByName(name + ".scene.json") as gd3d.framework.rawscene;
                            var _root = _scene.getSceneRoot();
                            this.scene.addChild(_root);
                            _root.localTranslate = new gd3d.math.vector3(-60, -30, 26.23);
                            this.app.getScene().lightmaps = [];
                            _scene.useLightMap(this.app.getScene());
                            _scene.useFog(this.app.getScene());
                            // });
                        }
                    });

            }
        });


        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        //this.camera.postQueues.push(new gd3d.framework.cameraPostQueue_Depth());

        // this.camera.near = 0.01;
        // this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(50, 82, -84);
        this.cube.localTranslate = new gd3d.math.vector3(0, 0, 0);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
        CameraController.instance().init(app,this.camera);
    }
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number = 0;
    bere: boolean = false;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 30, z2 * 10);
        // objCam.markDirty();//标记为需要刷新








        // this.cube.markDirty();
        // objCam.updateWorldTran();
        // if (this.timer > 5)
        // {
        //     this.app.getScene().getRoot().dispose();
        // }
        // if (this.timer > 10 && !this.bere)
        // {
        //     this.bere = true;
        //     this.app.getAssetMgr().unload("res/scenes/city/city.assetbundle.json");
        //     this.app.getAssetMgr().releaseUnuseAsset();
        // }
    }
}