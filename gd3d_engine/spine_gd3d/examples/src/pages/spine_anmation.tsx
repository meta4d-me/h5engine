import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src/index";
export class SpineAnimation extends React.Component {
    componentDidMount(): void {
        let app = new gd3d.framework.application();
        let div = document.getElementById("container") as HTMLDivElement;
        app.start(div);
        let scene = app.getScene();
        //相机
        var objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        camera.near = 0.01;
        camera.far = 10;
        //2dUI root
        let root2d = new gd3d.framework.overlay2D();
        camera.addOverLay(root2d);
        this.init(app, root2d);
    }

    private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {
        let assetManager = new SpineAssetMgr(app.webgl);
        let skeletonFile = "./assets/raptor-pro.json";
        let atlasFile = "./assets/raptor.atlas"
        let animation = "walk";
        Promise.all([
            new Promise<void>((resolve, reject) => {
                assetManager.loadText(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) => {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() => {
                let atlas = assetManager.require(atlasFile);
                let atlasLoader = new AtlasAttachmentLoader(atlas);
                let skeletonJson = new SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.require(skeletonFile));
                let comp = new spineSkeleton(skeletonData);
                comp.state.setAnimation(0, animation, true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }

    render(): React.ReactNode {
        return <div id="container">spine_animation</div>
    }
}