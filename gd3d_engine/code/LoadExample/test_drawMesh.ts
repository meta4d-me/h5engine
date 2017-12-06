class test_drawMesh implements IState{
    

    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application) {       
        console.log("i see you are a dog!");
        this.app = app;
        this.scene = this.app.getScene();
        
        let name = "Cube1_1024";
        let isloaded = false;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state)=>{
            if (state.isfinish){

                this.app.getAssetMgr().load("res/prefabs/"+name+"/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                (s)=>{
                    if (s.isfinish){
                    // if(s.bundleLoadState & gd3d.framework.AssetBundleLoadState.Scene && !isloaded){
                        isloaded = true;
                        console.error(s.isfinish);

                        var _prefab:gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as gd3d.framework.prefab;
                        var _root = _prefab.getCloneTrans();
                        this.scene.addChild(_root);
                        // _root.localTranslate = new gd3d.math.vector3(-60, -30, 26.23);
                        _root.localEulerAngles = new gd3d.math.vector3(0,0,0);                     
                        // _root.localTranslate = new gd3d.math.vector3(0,0,0);
                        _root.markDirty();
                        this.app.getScene().lightmaps = [];
                    }
                });
            }
        });

        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        //this.camera.postQueues.push(new gd3d.framework.cameraPostQueue_Depth());

        // this.camera.near = 0.01;
        // this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
        // objCam.lookatPoint(new gd3d.math.vector3(133.6694, 97.87, 67));
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));

        objCam.markDirty();//标记为需要刷新

        CameraController.instance().init(this.app, this.camera);
    }

    camera:gd3d.framework.camera;
    timer: number = 0;

    update(delta: number) {
        this.timer += delta;
        CameraController.instance().update(delta);
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x2 * -1, 30, z2 * -1);
        objCam.markDirty();//标记为需要刷新
    }


}