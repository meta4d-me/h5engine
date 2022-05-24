import { Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src/index";
export class SpriteSheet extends React.Component {
    private _comp: spineSkeleton;
    componentDidMount(): void {
        let app = new m4m.framework.application();
        app.bePlay = true;
        let div = document.getElementById("container") as HTMLDivElement;
        app.start(div);
        let scene = app.getScene();
        //相机
        var objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        //2dUI root
        let root2d = new m4m.framework.overlay2D();
        camera.addOverLay(root2d);
        this.init(app, root2d);
    }

    private init(app: m4m.framework.application, root2d: m4m.framework.overlay2D) {
        let assetManager = new SpineAssetMgr(app.getAssetMgr(), "./assets/");
        let skeletonFile = "demos.json";
        let atlasFile = "atlas1.atlas"
        let animation = "walk";

        // skeletonFile = "skeleton_animation/cha_ObliqueFront_walk_idle/json/skeleton.json";
        // atlasFile = "skeleton_animation/cha_ObliqueFront_walk_idle/json/skeleton.atlas";
        // animation = "cha_ObliqueFront_walk";

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
                // skeletonJson.scale = 0.4;
                skeletonJson.scale = 1;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).raptor);
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                // comp.skeleton.setSkinByName("Normal_BOT_skin")
                let spineNode = new m4m.framework.transform2D;
                //可用transform2d缩放等
                // spineNode.localTranslate.x = app.width / 2;
                // spineNode.localTranslate.y = -app.height / 2;
                // spineNode.localRotate = 30 * Math.PI / 180;
                // spineNode.localScale.y = -1;
                // spineNode.localScale.x = -1;

                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }

    private ChangeSpeed(ev) {
        if (this._comp) {
            this._comp.state.timeScale = ev / 100;
        }
    }

    render(): React.ReactNode {
        return <div>
            <div id="container"></div>
            <div className="ui speed">
                <div>动画速度：</div>
                <Slider className="slider" defaultValue={100} onChange={(ev) => this.ChangeSpeed(ev)} tipFormatter={(value) => value / 100} />
            </div>
        </div>
    }
}