
//UI 组件资源加载 样例
class test_uiPerfabLoad implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    assetMgr: gd3d.framework.assetMgr;
    rooto2d: gd3d.framework.overlay2D;
    static temp: gd3d.framework.transform2D;

    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();

        //相机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;

        //2dUI root
        this.rooto2d = new gd3d.framework.overlay2D();
        this.camera.addOverLay(this.rooto2d);


        this._showUI("res/prefabs/UI/template", "button");
    }

    private async _showUI(root: string, res: string)
    {
        await demoTool.loadbySync(`${root}/${res}/${res}.assetbundle.json`, this.assetMgr);

        let cubeP = this.assetMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as gd3d.framework.prefab;
        let cubeTran = cubeP.getCloneTrans2D();

        this.rooto2d.addChild(cubeTran);
    }


    update(delta: number)
    {

    }
}