import { Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, MixBlend, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src/index";

export class AdditiveBlending extends React.Component {
    private _comp: spineSkeleton;
    componentDidMount(): void {
        let app = new gd3d.framework.application();
        app.bePlay = true;
        let div = document.getElementById("container") as HTMLDivElement;
        app.start(div);
        let scene = app.getScene();
        //相机
        var objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        //2dUI root
        let root2d = new gd3d.framework.overlay2D();
        camera.addOverLay(root2d);
        this.init(app, root2d);
    }

    private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {
        let assetManager = new SpineAssetMgr(app.getAssetMgr(), "./assets/");
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
                let atlasLoader = new AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).owl);
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, "idle", true);
                comp.state.setAnimation(1, "blink", true);
                let right = comp.state.setAnimation(2, "left", true);
                let left = comp.state.setAnimation(3, "right", true);
                let up = comp.state.setAnimation(4, "up", true);
                let down = comp.state.setAnimation(5, "down", true);

                left.mixBlend = MixBlend.add;
                right.mixBlend = MixBlend.add;
                up.mixBlend = MixBlend.add;
                down.mixBlend = MixBlend.add;
                left.alpha = 0;
                right.alpha = 1;
                up.alpha = 0;
                down.alpha = 0;

                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                this.ref_container.current.addEventListener("mousemove", (ev) => {
                    //计算混合比例
                    if (ev.x - app.width / 2 > 0) {
                        right.alpha = (ev.x - app.width / 2) / (app.width / 2)
                        left.alpha = 0;
                    } else {
                        right.alpha = 0;
                        left.alpha = (app.width / 2 - ev.x) / (app.width / 2);
                    }

                    if (ev.y - app.height / 2 > 0) {
                        up.alpha = 0;
                        down.alpha = (ev.y - app.height / 2) / (app.height / 2)
                    } else {
                        down.alpha = 0;
                        up.alpha = (app.height / 2 - ev.y) / (app.height / 2)
                    }
                })
            })
    }

    private ChangeSpeed(ev) {
        if (this._comp) {
            this._comp.state.timeScale = ev / 100;
        }
    }
    private ref_container = React.createRef<HTMLDivElement>();
    render(): React.ReactNode {
        return <div id="container" ref={this.ref_container}></div>
    }
}