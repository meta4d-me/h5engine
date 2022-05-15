namespace util
{
    export function loadShader(assetMgr: gd3d.framework.assetMgr)
    {
        return new Promise<void>((resolve, reject) =>
        {
            assetMgr.load("newRes/shader/Mainshader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    resolve();
                }
            }
            );
        })
    }

    export function loadModel(assetMgr: gd3d.framework.assetMgr, modelName: string)
    {
        return new Promise<gd3d.framework.prefab>((resolve, reject) =>
        {
            assetMgr.load(`newRes/pfb/model/${modelName}/${modelName}.assetbundle.json`, gd3d.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    let prefab = assetMgr.getAssetByName(modelName + ".prefab.json", `${modelName}.assetbundle.json`) as gd3d.framework.prefab;
                    resolve(prefab);
                }
            });
        })
    }

    export function addCamera(scene: gd3d.framework.scene)
    {
        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        camera.near = 0.01;
        camera.far = 120;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, 10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();
        return objCam;
    }

    export function loadTex(url: string, assetMgr: gd3d.framework.assetMgr)
    {
        return new Promise<void>((resolve, reject) =>
        {
            assetMgr.load(url, gd3d.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    resolve();
                }
                else
                {
                    reject()
                }
            })
        })
    }

    export function loadTextures(urls: string[], assetMgr: gd3d.framework.assetMgr)
    {
        return Promise.all(urls.map(item => loadTex(item, assetMgr)))
    }

}