//优化size的动画加载
class test_optimize_size_animationClip implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    prefab: gd3d.framework.transform;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        gd3d.framework.assetMgr.openGuid = true;
        this.app.getAssetMgr().load("./newRes/shader/MainShader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load(`./newRes/pfb/laohu_fs_low/laohu_fs_low.assetbundle.json`, gd3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(`laohu_fs_low.prefab.json`, "laohu_fs_low.assetbundle.json") as gd3d.framework.prefab;
                        let prefabObj = _prefab.getCloneTrans();
                        this.scene.addChild(prefabObj);
                        this.prefab = prefabObj;


                        this.app.getAssetMgr().load(`./newRes/pfb/laohu_fs_low/resources/idle.FBAni.aniclip.bin`, gd3d.framework.AssetTypeEnum.Aniclip, (s) =>
                        {
                            if (s.isfinish)
                            {
                                var aps = prefabObj.gameObject.getComponentsInChildren("aniplayer") as gd3d.framework.aniplayer[];
                                var ap = aps[0];
                                ap.addClip(s.resstateFirst.res as gd3d.framework.animationClip);
                                ap.play("idle.FBAni.aniclip.bin");
                            }
                        });
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
        objCam.localTranslate = new gd3d.math.vector3(0, 10, 30);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
    }

    camera: gd3d.framework.camera;
    // cube: gd3d.framework.transform;
    // cube2: gd3d.framework.transform;
    // cube3: gd3d.framework.transform;
    // timer: number = 0;
    update(delta: number)
    {
        // this.timer += delta;
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.1);
        // var z2 = Math.cos(this.timer * 0.1);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        // objCam.lookat(this.cube);
        // objCam.markDirty();//标记为需要刷新
        // objCam.updateWorldTran();
        if (this.prefab)
        {
            this.camera.gameObject.transform.lookat(this.prefab);
        }
    }
}