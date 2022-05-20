class test_load implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: any;
    camNode: gd3d.framework.transform;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();
        assetMgr.load("newRes/shader/Mainshader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                let name = "0001_shengyi_male";
                assetMgr.load(`newRes/pfb/model/${name}/${name}.assetbundle.json`, gd3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        let prefab = assetMgr.getAssetByName(name + ".prefab.json", `${name}.assetbundle.json`) as gd3d.framework.prefab;
                        let ins = prefab.getCloneTrans();
                        this.scene.addChild(ins);
                        this.camNode.lookat(ins);
                        this.camNode.markDirty();
                    }
                });
            }
        });

        //添加一个摄像机
        let camNode = new gd3d.framework.transform();
        this.scene.addChild(camNode);
        this.camera = camNode.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        camNode.localTranslate = new gd3d.math.vector3(0, 10, -10);
        this.camNode = camNode;
    }
    update(delta: number)
    {

    }
}