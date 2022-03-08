import { Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src/index";
export class HoverBoard extends React.Component {
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
    private hoverTargets = [];
    private controlBones = ["hoverboard controller", "hip controller", "board target", "crosshair"];
    private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {
        let assetManager = new SpineAssetMgr(app.getAssetMgr(), "./assets/");
        let skeletonFile = "demos.json";
        let atlasFile = "atlas1.atlas"
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
                comp.state.setAnimation(0, "hoverboard", true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                comp.onUpdate = () => {
                    this.forceUpdate();
                }
            })
    }

    private ChangeSpeed(ev) {
        if (this._comp) {
            this._comp.state.timeScale = ev / 100;
        }
    }

    render(): React.ReactNode {
        let circle = [];
        if (this._comp) {
            for (let i = 0; i < this.controlBones.length; i++) {
                let bone = this._comp.skeleton.findBone(this.controlBones[i]);
                let x = this._comp.skeleton.x + bone.worldX;
                let y = this._comp.skeleton.y + bone.worldY;
                console.log(x, y);
            }
        }
        return <div>
            <div id="container">
                {
                    this.controlBones.map(item => <RadiusCircle bone={item} key={item} />)
                }
            </div>
            <div className="ui speed">
                <div>动画速度：</div>
                <Slider className="slider" defaultValue={100} onChange={(ev) => this.ChangeSpeed(ev)} tipFormatter={(value) => value / 100} />
            </div>
        </div>
    }
}


export function RadiusCircle(props: { bone: string }) {
    return <div className="radiusCircle"></div>
}