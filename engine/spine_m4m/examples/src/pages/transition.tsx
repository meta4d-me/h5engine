import { Slider, Button } from "antd";
import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton, AnimationState } from "../../../src";

export class Transition extends React.Component {
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
        let animation = "death";
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).spineboy);

                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //复杂融合参考官方文档
                //http://zh.esotericsoftware.com/spine-applying-animations#%E9%80%9A%E9%81%93%28Track%29
                //设置默认融合
                comp.animData.defaultMix = 0.2
                //播放一系列动画
                this.setAnimations(comp.state);
                // comp.state.setAnimation(0, animation, true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }

    private setAnimations(state: AnimationState) {
        state.addAnimation(0, "idle", true, 0);
        state.addAnimation(0, "walk", true, 0);
        state.addAnimation(0, "jump", false, 0);
        state.addAnimation(0, "run", true, 0);
        state.addAnimation(0, "jump", false, 1);
        state.addAnimation(0, "walk", true, 0).listener = {
            start: (trackIndex) => {
                this.setAnimations(state);
            }
        };
    }
    private ChangeSpeed(ev) {
        if (this._comp) {
            this._comp.state.timeScale = ev / 100;
        }
    }

    private PlayDie = () => {
        this._comp.state.setAnimation(0, "death", false);
        this.setAnimations(this._comp.state);
    }

    render(): React.ReactNode {
        return <div>
            <div id="container"></div>
            <div className="ui">
                <Button type="primary" onClick={this.PlayDie}>DIE</Button>
                <div className="speed">
                    <div>动画速度：</div>
                    <Slider className="slider" defaultValue={100} onChange={(ev) => this.ChangeSpeed(ev)} tipFormatter={(value) => value / 100} />
                </div>
            </div>
        </div>
    }
}