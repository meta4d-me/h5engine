/** 
 * 粒子系統示例
 */
class test_ETC1_KTX implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;

    private transform: gd3d.framework.transform;

    async start(app: gd3d.framework.application)
    {
        var ext = app.webgl.getExtension('WEBGL_compressed_texture_etc1');
        if (!ext)
        {
            alert(`需要使用Android平台才能运行！`)
            // return;
        }

        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        gd3d.framework.assetMgr.openGuid = false;

        await demoTool.loadbySync(`res_etc1/shader/MainShader.assetbundle.json`, this.astMgr);
        // await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, this.astMgr);
        //
        this.init();
    }

    private init()
    {
        //相机-----------------------------------
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 1000;
        this.camera.fov = Math.PI * 2 / 3;
        this.camera.backgroundColor = new gd3d.math.color(0.2784, 0.2784, 0.2784, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));

        this.loadPrefabs();
    }

    private async loadPrefabs()
    {
        var res = "test_ktx";

        await demoTool.loadbySync(`res/prefabs/${res}/${res}.assetbundle.json`, this.astMgr);

        let cubeP = this.astMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as gd3d.framework.prefab;
        let cubeTran = this.transform = cubeP.getCloneTrans();

        cubeTran.localPosition.x = 0;
        cubeTran.localPosition.y = 0;
        cubeTran.localPosition.z = 0;

        cubeTran.localScale.x = 8;
        cubeTran.localScale.y = 8;
        cubeTran.localScale.z = 8;

        this.scene.addChild(cubeTran);
    }

    ry = 0;

    update(delta: number)
    {
        if (!this.transform) return;

        //圆柱朝向
        gd3d.math.quatFromEulerAngles(0, this.ry, 0, this.transform.localRotate);

        this.ry++;
    }
}