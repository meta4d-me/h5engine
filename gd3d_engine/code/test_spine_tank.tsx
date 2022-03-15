
class test_spine_tank implements IState {
    start(app: gd3d.framework.application) {

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
            new Promise<void>((resolve, reject) => {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) => {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() => {
                let atlasLoader = new spine_gd3d.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_gd3d.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).tank);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                comp.state.setAnimation(0, "drive", true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = 500;
                spineNode.localScale.x = 0.5;
                spineNode.localScale.y = 0.5;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }
    setGUI() {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) => {
            this._comp.state.timeScale = value;
        });
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_gd3d.spineSkeleton;
}