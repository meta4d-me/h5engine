/// <reference path="../lib/gd3d.d.ts" />

class test_anim implements IState
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
        var camNode = new gd3d.framework.transform();
        this.scene.addChild(camNode);
        this.camera = camNode.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        camNode.localTranslate = new gd3d.math.vector3(0, 10, -10);

        util.loadShader(assetMgr)
            .then(() =>
            {
                let prefabName = "PF_PlayerSharkReef";
                assetMgr.load(`newRes/pfb/model/${prefabName}/${prefabName}.assetbundle.json`, gd3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        let prefab = assetMgr.getAssetByName(prefabName + ".prefab.json", `${prefabName}.assetbundle.json`) as gd3d.framework.prefab;
                        let ins = prefab.getCloneTrans();
                        this.scene.addChild(ins);
                        camNode.lookat(ins);
                        camNode.markDirty();

                        var aps = ins.gameObject.getComponentsInChildren("aniplayer") as gd3d.framework.aniplayer[];
                        var ap = aps[0];
                        let resPath = `newRes/pfb/model/${prefabName}/resources`;
                        let list = ap.awaitLoadClipNames();
                        Promise.all(list.map(item => new Promise<void>((resolve, reject) =>
                        {
                            ap.addClipByNameLoad(assetMgr, resPath, item, () => resolve())
                        })))
                            .then(() =>
                            {
                                document.onkeydown = (ev) =>
                                {
                                    ap.play(list[Math.floor(Math.random() * list.length)]);
                                }
                            })
                    }
                });
            })
    }
    camera: gd3d.framework.camera;
    update(delta: number)
    {

    }
}