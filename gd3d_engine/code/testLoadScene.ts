class test_loadScene implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        let names: string[] = ["city", "1042_pata_shenyuan_01", "1030_huodongchuangguan", "xinshoucun_fuben_day", "chuangjue-01"];
        let name = names[0];
        // name="MainCity";
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/scenes/citycompress/index.json.txt",gd3d.framework.AssetTypeEnum.Auto,(s1)=>{
                    if(s1.isfinish)
                    {   
                        let index = JSON.parse((this.app.getAssetMgr().getAssetByName("index.json.txt") as gd3d.framework.textasset).content);
                        let totalLength = index[name + ".assetbundle.json"];

                        this.app.getAssetMgr().loadCompressBundle("res/scenes/citycompress/" + name + ".assetbundle.json",
                        (s) =>
                        {
                            console.log(s.curtask + "/" + s.totaltask);
                            console.log(s.curByteLength+"/"+totalLength);
                            // console.log(s.progress);
                            if (s.isfinish)
                            {
                                var _scene: gd3d.framework.rawscene = this.app.getAssetMgr().getAssetByName(name + ".scene.json") as gd3d.framework.rawscene;
                                var _root = _scene.getSceneRoot();
                                this.scene.addChild(_root);
                                // _root.localTranslate = new gd3d.math.vector3(-60, -30, 26.23);
                                _root.localEulerAngles = new gd3d.math.vector3(0,0,0);
                                _root.markDirty();
                                this.app.getScene().lightmaps = [];
                                _scene.useLightMap(this.app.getScene());
                                _scene.useFog(this.app.getScene());
                            }
                        });

                    }
                })
                
            }
        });
        // var name="Wing_11";
        // this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        // {
        //     if (state.isfinish)
        //     {
        //         this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
        //             (s) =>
        //             {
        //                 if (s.isfinish)
        //                 {
        //                     var name="Wing_11";
        //                     var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as gd3d.framework.prefab;
        //                     this.baihu = _prefab.getCloneTrans();
        //                     this.baihu.name="chibang";
        //                     this.baihu.localTranslate.y=50;
        //                     this.baihu.markDirty();
        //                     this.scene.addChild(this.baihu);
        //                     this.camera.gameObject.transform.lookat(this.baihu);
        //                     this.camera.gameObject.transform.markDirty();

        //                     var name="MainCity";
        //                     this.app.getAssetMgr().load("res/scenes/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
        //                         (s) =>
        //                         {
        //                             console.log(s.curtask + "/" + s.totaltask);
        //                             console.log(s.progress);
        //                             if (s.isfinish)
        //                             {
        //                                 var _scene: gd3d.framework.rawscene = this.app.getAssetMgr().getAssetByName(name + ".scene.json") as gd3d.framework.rawscene;
        //                                 var _root = _scene.getSceneRoot();
        //                                 _root.name="changjing";
        //                                 this.scene.addChild(_root);
        //                                 // _root.localTranslate = new gd3d.math.vector3(-60, -30, 26.23);
        //                                 _root.localEulerAngles = new gd3d.math.vector3(0,0,0);
        //                                 _root.markDirty();
        //                                 this.app.getScene().lightmaps = [];
        //                                 _scene.useLightMap(this.app.getScene());
        //                                 _scene.useFog(this.app.getScene());


        //                             }
        //                         });
        //                 }
        //             });


        //     }
        // });
        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        //this.camera.postQueues.push(new gd3d.framework.cameraPostQueue_Depth());

        // this.camera.near = 0.01;
        // this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(-20, 50, -20);
        // objCam.lookatPoint(new gd3d.math.vector3(133.6694, 97.87, 67));
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));

        objCam.markDirty();//标记为需要刷新

        // CameraController.instance().init(this.app, this.camera);
    }

    baihu:gd3d.framework.transform;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number = 0;
    bere: boolean = false;
    update(delta: number)
    {
        this.timer += delta;
        // CameraController.instance().update(delta);
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.5);
        // var z2 = Math.cos(this.timer * 0.5);
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