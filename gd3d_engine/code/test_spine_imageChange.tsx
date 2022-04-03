// import React from "react";
// import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src";

// export class ImageChange extends React.Component {

//     componentDidMount(): void {
//         let app = new gd3d.framework.application();
//         app.bePlay = true;
//         let div = document.getElementById("container") as HTMLDivElement;
//         app.start(div);
//         let scene = app.getScene();
//         //相机
//         var objCam = new gd3d.framework.transform();
//         scene.addChild(objCam);
//         let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
//         //2dUI root
//         let root2d = new gd3d.framework.overlay2D();
//         camera.addOverLay(root2d);
//         this.init(app, root2d);
//     }

//     private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {
//         let assetManager = new SpineAssetMgr(app.getAssetMgr(), "./assets/");
//         let skeletonFile = "demos.json";
//         let atlasFile = "atlas1.atlas"
//         let animation = "death";
//         Promise.all([
//             new Promise<void>((resolve, reject) => {
//                 assetManager.loadJson(skeletonFile, () => resolve())
//             }),
//             new Promise<void>((resolve, reject) => {
//                 assetManager.loadTextureAtlas(atlasFile, () => resolve());
//             })])
//             .then(() => {
//                 let atlasLoader = new AtlasAttachmentLoader(assetManager.get(atlasFile));
//                 let skeletonJson = new SkeletonJson(atlasLoader);
//                 skeletonJson.scale = 0.4;
//                 let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).alien);
//                 let comp = new spineSkeleton(skeletonData);
//                 comp.state.setAnimation(0, animation, true);
//                 let spineNode = new gd3d.framework.transform2D;
//                 spineNode.addComponentDirect(comp);
//                 root2d.addChild(spineNode);
//             })
//     }
//     render(): React.ReactNode {
//         return <div id="container"></div>
//     }
// }

class test_spine_imageChange implements IState
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
        let animation = "death";
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).alien);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }
    update(delta: number) { }
}