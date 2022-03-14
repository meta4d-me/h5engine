class test_spine_transition implements IState
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
        let atlasFile = "atlas1.atlas"
        let animation = "walk";
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).spineboy);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                //复杂融合参考官方文档
                //http://zh.esotericsoftware.com/spine-applying-animations#%E9%80%9A%E9%81%93%28Track%29
                //设置默认融合
                comp.animData.defaultMix = 0.2
                //播放一系列动画
                this.setAnimations(comp.state);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }
    private setAnimations(state: spine_gd3d.AnimationState)
    {
        state.addAnimation(0, "idle", true, 0);
        state.addAnimation(0, "walk", true, 0);
        state.addAnimation(0, "jump", false, 0);
        state.addAnimation(0, "run", true, 0);
        state.addAnimation(0, "jump", false, 1);
        state.addAnimation(0, "walk", true, 0).listener = {
            start: (trackIndex) =>
            {
                this.setAnimations(state);
            }
        };
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });
        gui.add(this, 'playDie');
    }

    private playDie = () =>
    {
        this._comp.state.setAnimation(0, "death", false);
        this.setAnimations(this._comp.state);
    }

    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_gd3d.spineSkeleton;
}