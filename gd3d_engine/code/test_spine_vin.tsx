
class test_spine_vin implements IState {
    private _inited: boolean;
    private controlBones = ["base", "vine-control1", "vine-control2", "vine-control3", "vine-control4"];
    private _temptMat = new gd3d.math.matrix();
    private _temptPos = new gd3d.math.vector2();
    private _chooseBone: spine_gd3d.Bone;
    private bonesPos: { [bone: string]: { bone: spine_gd3d.Bone, boneUI: HTMLDivElement } } = {}

    start(app: gd3d.framework.application) {

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
        let atlasFile = "atlas2.atlas"
        Promise.all([
            new Promise<void>((resolve, reject) => {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) => {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() => {
                let atlasLoader = new spine_gd3d.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_gd3d.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).vine);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置皮肤
                comp.state.setAnimation(0, "animation", true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                comp.onUpdate = () => {
                    if (!this._inited) {
                        this._inited = true;
                        let ui = document.getElementById("drawarea") as HTMLDivElement;
                        //拖动骨骼
                        document.addEventListener("mousemove", (ev) => {
                            if (this._chooseBone) {
                                let boneName = this._chooseBone.data.name;

                                let boneWorldPos = new gd3d.math.vector2(ev.clientX - app.width / 2, app.height / 2 - ev.clientY);
                                let worldPos = this._comp.transform.getWorldTranslate();
                                let worldRot = this._comp.transform.getWorldRotate();
                                let worldScale = this._comp.transform.getWorldScale();
                                gd3d.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                                gd3d.math.matrix3x2Inverse(this._temptMat, this._temptMat);
                                gd3d.math.matrix3x2TransformVector2(this._temptMat, boneWorldPos, this._temptPos);

                                let tempt = new spine_gd3d.Vector2();
                                tempt.set(this._temptPos.x, this._temptPos.y)
                                this._chooseBone.parent.worldToLocal(tempt);
                                this._chooseBone.x = tempt.x;
                                this._chooseBone.y = tempt.y;

                                this.bonesPos[boneName].boneUI.style.top = ev.clientY + "px";
                                this.bonesPos[boneName].boneUI.style.left = ev.clientX + "px";
                            }
                        })
                        document.addEventListener("mouseup", () => this._chooseBone = null)

                        let worldPos = this._comp.transform.getWorldTranslate();
                        let worldRot = this._comp.transform.getWorldRotate();
                        let worldScale = this._comp.transform.getWorldScale();
                        gd3d.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                        for (let i = 0; i < this.controlBones.length; i++) {
                            // if(this.bonesPos[this.controlBones[i]]!=null)
                            let boneName = this.controlBones[i];
                            let bone = this._comp.skeleton.findBone(boneName);
                            let x = this._comp.skeleton.x + bone.worldX;
                            let y = this._comp.skeleton.y + bone.worldY;
                            gd3d.math.matrix3x2TransformVector2(this._temptMat, new gd3d.math.vector2(x, y), this._temptPos);

                            let screen_x = this._temptPos.x + app.width / 2;
                            let screen_y = app.height / 2 - this._temptPos.y;
                            let boneUI = document.createElement("div", {});
                            boneUI.style.position = "absolute";
                            boneUI.style.width = "10px";
                            boneUI.style.height = "10px";
                            boneUI.style.backgroundColor = "blue";
                            boneUI.style.top = screen_y + "px";
                            boneUI.style.left = screen_x + "px";
                            boneUI.addEventListener("mouseenter", () => {
                                boneUI.style.backgroundColor = "green";
                            });
                            boneUI.addEventListener("mouseleave", () => {
                                boneUI.style.backgroundColor = "blue";
                            });
                            boneUI.addEventListener("mousedown", () => {
                                this._chooseBone = bone;
                            });
                            this.bonesPos[boneName] = { bone, boneUI }
                            ui.appendChild(boneUI)
                        }
                    }
                }
            })
    }
    update(delta: number) { }
    private _comp: spine_gd3d.spineSkeleton;
}