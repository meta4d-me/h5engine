class test_spine_change_slot_mesh_tex implements IState
{
    assetManager: spine_gd3d.SpineAssetMgr;
    private _index = 0;
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
        this.assetManager = assetManager;
        let skeletonFile = "robot/skeleton.json";
        let atlasFile = "robot/skeleton.atlas"
        let animation = "cha_ObliqueFront_idle";
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
                // skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile));
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                comp.skeleton.setSkinByName("Magic_1_skin");
                let spineNode = new gd3d.framework.transform2D;
                //可用transform2d缩放等
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                // spineNode.localRotate = 30 * Math.PI / 180;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }

    private changeSlot = () =>
    {
        this._index = (this._index + 1) % 2;
        let tex = ["head2.png", "head3.png"][this._index];
        this.assetManager.loadTexture(tex, (path, texture) =>
        {
            this._comp.changeSlotTexture("face/NFT头像3", texture);
        })
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });
        gui.add(this, "changeSlot")
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_gd3d.spineSkeleton;
}