
class test_spine_vin implements IState
{
    private _inited: boolean;
    private controlBones = ["base", "vine-control1", "vine-control2", "vine-control3", "vine-control4"];
    private _temptMat = new gd3d.math.matrix();
    private _temptPos = new gd3d.math.vector2();
    private _chooseBone: spine_gd3d.Bone;
    private bonesPos: { [bone: string]: { bone: spine_gd3d.Bone, boneUI: HTMLDivElement } } = {}

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
        let atlasFile = "atlas2.atlas"
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).vine);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置皮肤
                comp.state.setAnimation(0, "animation", true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                comp.onUpdate = () =>
                {
                    if (!this._inited)
                    {
                        this._inited = true;
                        let ui = document.getElementById("drawarea") as HTMLDivElement;
                        //拖动骨骼
                        document.addEventListener("mousemove", (ev) =>
                        {
                            if (this._chooseBone)
                            {
                                let boneName = this._chooseBone.data.name;

                                let temptPos = new gd3d.math.vector2();
                                temptPos.x = ev.clientX;
                                temptPos.y = ev.clientY;
                                root2d.calScreenPosToCanvasPos(temptPos, temptPos);
                                let toMat = this._comp.getToCanvasMatrix();
                                let temptMat = new gd3d.math.matrix3x2();
                                gd3d.math.matrix3x2Inverse(toMat, temptMat);
                                gd3d.math.matrix3x2TransformVector2(temptMat, temptPos, temptPos);
                                let tempt = new spine_gd3d.Vector2();
                                tempt.set(temptPos.x, temptPos.y)

                                this._chooseBone.parent.worldToLocal(tempt);
                                this._chooseBone.x = tempt.x;
                                this._chooseBone.y = tempt.y;

                                this.bonesPos[boneName].boneUI.style.top = ev.clientY + "px";
                                this.bonesPos[boneName].boneUI.style.left = ev.clientX + "px";
                            }
                        })
                        document.addEventListener("mouseup", () => this._chooseBone = null)

                        let temptMat = this._comp.getToCanvasMatrix();
                        let temptPos = new gd3d.math.vector2();

                        for (let i = 0; i < this.controlBones.length; i++)
                        {
                            // if(this.bonesPos[this.controlBones[i]]!=null)
                            let boneName = this.controlBones[i];
                            let bone = this._comp.skeleton.findBone(boneName);
                            let x = this._comp.skeleton.x + bone.worldX;
                            let y = this._comp.skeleton.y + bone.worldY;
                            gd3d.math.matrix3x2TransformVector2(temptMat, new gd3d.math.vector2(x, y), temptPos);
                            root2d.calCanvasPosToScreenPos(temptPos, temptPos);
                            let screen_x = temptPos.x;
                            let screen_y = temptPos.y;

                            let boneUI = document.createElement("div", {});
                            boneUI.style.position = "absolute";
                            boneUI.style.width = "10px";
                            boneUI.style.height = "10px";
                            boneUI.style.backgroundColor = "blue";
                            boneUI.style.top = screen_y + "px";
                            boneUI.style.left = screen_x + "px";
                            boneUI.addEventListener("mouseenter", () =>
                            {
                                boneUI.style.backgroundColor = "green";
                            });
                            boneUI.addEventListener("mouseleave", () =>
                            {
                                boneUI.style.backgroundColor = "blue";
                            });
                            boneUI.addEventListener("mousedown", () =>
                            {
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