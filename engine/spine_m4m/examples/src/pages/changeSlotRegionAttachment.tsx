import { Button } from "antd";
import React from "react";
import { AtlasAttachmentLoader, m4mTexture, MeshAttachment, RegionAttachment, SkeletonJson, SpineAssetMgr, spineSkeleton, TextureAtlasPage, TextureAtlasRegion, TextureWrap } from "../../../src";

export class ChangeSlotRegionAttachment extends React.Component {
    private _comp: spineSkeleton;
    private _index: number;
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
        let skeletonFile = "raptor-pro.json";
        let atlasFile = "raptor.atlas"
        let animation = "walk";

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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile));
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
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


        this.onclick = () => {
            if (this._index == null) {
                this._index = 0;
            } else {
                this._index = (this._index + 1) % 2;
            }
            let tex = ["head2.png", "head3.png"][this._index];
            assetManager.loadTexture(tex, (path, texture) => {
                // // this.changeSlotMeshAttachment("face/NFT头像3", texture as m4mTexture);
                this._comp.changeSlotTexture("gun", texture as m4mTexture);
            })
        }
    }

    private onclick = () => { }

    render(): React.ReactNode {
        return <div>
            <div id="container"></div>
            <div className="ui speed">
                <Button onClick={() => this.onclick()}>切换</Button>
            </div>
        </div>
    }
}