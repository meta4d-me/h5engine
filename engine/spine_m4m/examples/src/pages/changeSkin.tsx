import { Button, Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton, SkeletonData, Skin } from "../../../src/index";

export class ChangeSkin extends React.Component {
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
        let atlasFile = "heroes.atlas"
        let animation = "run";
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).heroes);
                let comp = new spineSkeleton(skeletonData);
                comp.skeleton.setSkinByName("Assassin")
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }

    private randomSkin = () => {
        let skeleton = this._comp.skeleton;
        // var skins: Skin[] = [];
        // for (var indx in skeleton.data.skins) {
        //     let skin = skeleton.data.skins[indx];
        //     if (skin.name === "default") continue;
        //     skins.push(skin);
        // }

        // //组装skin
        // var newSkin = new Skin("random-skin");
        // for (var slotIndex = 0; slotIndex < skeleton.slots.length; slotIndex++) {
        //     var skin = skins[(Math.random() * skins.length - 1) | 0];
        //     var attachments = skin.attachments[slotIndex];
        //     for (var attachmentName in attachments) {
        //         newSkin.setAttachment(slotIndex, attachmentName, attachments[attachmentName]);
        //     }
        // }
        let randomIndex = Math.floor(Math.random() * skeleton.data.skins.length);
        let skin = skeleton.data.skins[randomIndex]
        this._comp.skeleton.setSkin(skin);
        this._comp.skeleton.setSlotsToSetupPose();
    }

    private randomGroupSkin = () => {
        let skeleton = this._comp.skeleton;
        var skins: Skin[] = [];
        for (var indx in skeleton.data.skins) {
            let skin = skeleton.data.skins[indx];
            if (skin.name === "default") continue;
            skins.push(skin);
        }

        //组装skin
        var newSkin = new Skin("random-skin");
        for (var slotIndex = 0; slotIndex < skeleton.slots.length; slotIndex++) {
            var skin = skins[(Math.random() * skins.length - 1) | 0];
            var attachments = skin.attachments[slotIndex];
            for (var attachmentName in attachments) {
                newSkin.setAttachment(slotIndex, attachmentName, attachments[attachmentName]);
            }
        }
        this._comp.skeleton.setSkin(newSkin);
        this._comp.skeleton.setSlotsToSetupPose();
    }

    private ChangeSpeed(ev) {
        if (this._comp) {
            this._comp.state.timeScale = ev / 100;
        }
    }

    render(): React.ReactNode {
        return <div>
            <div id="container"></div>
            <div className="ui">
                <Button type="primary" onClick={this.randomSkin}>随机皮肤</Button>
                <Button type="primary" onClick={this.randomGroupSkin} style={{ marginLeft: "10px" }}>随机组装皮肤</Button>
                <div className="speed">
                    <div>动画速度：</div>
                    <Slider className="slider" defaultValue={100} onChange={(ev) => this.ChangeSpeed(ev)} tipFormatter={(value) => value / 100} />
                </div>
            </div>
        </div>
    }
}