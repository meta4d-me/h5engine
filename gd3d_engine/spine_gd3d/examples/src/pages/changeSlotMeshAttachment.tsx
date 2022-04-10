import { Button } from "antd";
import React from "react";
import { AtlasAttachmentLoader, Gd3dTexture, MeshAttachment, RegionAttachment, SkeletonJson, SpineAssetMgr, spineSkeleton, TextureAtlasPage, TextureAtlasRegion, TextureWrap } from "../../../src";

export class ChangeSlotMeshAttachment extends React.Component {
    private _comp: spineSkeleton;
    private _index: number;
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
        let skeletonFile = "cha_ObliqueFront_walk_idle/json/skeleton.json";
        let atlasFile = "cha_ObliqueFront_walk_idle/json/skeleton.atlas"
        let animation = "cha_ObliqueFront_idle";

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
                skeletonJson.scale = 2;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile));
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                // comp.skeleton.setSkinByName("Magic_1_skin");
                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth * 1 / 3;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight * 1 / 3;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);


                let comp2 = new spineSkeleton(skeletonData);
                //设置播放动画
                comp2.state.setAnimation(0, animation, true);
                comp2.skeleton.setSkinByName("Magic_1_skin");
                let spineNode2 = new gd3d.framework.transform2D;
                spineNode2.localTranslate.x = root2d.canvas.pixelWidth * 2 / 3;
                spineNode2.localTranslate.y = root2d.canvas.pixelHeight * 2 / 3;
                spineNode2.addComponentDirect(comp2);
                root2d.addChild(spineNode2);

            })

        this.onclick = () => {
            if (this._index == null) {
                this._index = 0;
            } else {
                this._index = (this._index + 1) % 2;
            }
            let tex = ["head2.png", "head3.png"][this._index];
            assetManager.loadTexture(tex, (path, texture) => {
                // // this.changeSlotMeshAttachment("face/NFT头像3", texture as Gd3dTexture);
                this._comp.changeSlotTexture("1像素头像", texture as Gd3dTexture);
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