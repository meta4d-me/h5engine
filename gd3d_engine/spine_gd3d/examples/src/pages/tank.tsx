import { Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src/index";
export class Tank extends React.Component {
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).tank);
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, "drive", true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;

                // spineNode.localTranslate.x = 500;
                spineNode.localScale.x = 0.5;
                spineNode.localScale.y = 0.5;
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