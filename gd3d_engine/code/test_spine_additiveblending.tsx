
class test_spine_additiveBlending implements IState
{
    start(app: gd3d.framework.application)
    {

        let scene = app.getScene();
        //相机
        var objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        //2dUI root
        let root2d = new gd3d.framework.overlay2D();
        camera.addOverLay(root2d);
        let assetManager = new spine_gd3d.SpineAssetMgr(app.getAssetMgr(), "./res/spine/");
        let skeletonFile = "demos.json";
        let atlasFile = "atlas2.atlas"
        Promise.all([
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() =>
            {
                let atlasLoader = new spine_gd3d.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_gd3d.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).owl);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, "idle", true);
                comp.state.setAnimation(1, "blink", true);
                let right = comp.state.setAnimation(2, "left", true);
                let left = comp.state.setAnimation(3, "right", true);
                let up = comp.state.setAnimation(4, "up", true);
                let down = comp.state.setAnimation(5, "down", true);
                left.mixBlend = spine_gd3d.MixBlend.add;
                right.mixBlend = spine_gd3d.MixBlend.add;
                up.mixBlend = spine_gd3d.MixBlend.add;
                down.mixBlend = spine_gd3d.MixBlend.add;
                left.alpha = 0;
                right.alpha = 1;
                up.alpha = 0;
                down.alpha = 0;

                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                document.addEventListener("mousemove", (ev) =>
                {
                    //计算混合比例
                    if (ev.x - app.width / 2 > 0)
                    {
                        right.alpha = (ev.x - app.width / 2) / (app.width / 2)
                        left.alpha = 0;
                    } else
                    {
                        right.alpha = 0;
                        left.alpha = (app.width / 2 - ev.x) / (app.width / 2);
                    }

                    if (ev.y - app.height / 2 > 0)
                    {
                        up.alpha = 0;
                        down.alpha = (ev.y - app.height / 2) / (app.height / 2)
                    } else
                    {
                        down.alpha = 0;
                        up.alpha = (app.height / 2 - ev.y) / (app.height / 2)
                    }
                })
            })
    }

    update(delta: number) { }
    private _comp: spine_gd3d.spineSkeleton;
}