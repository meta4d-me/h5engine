class test_spine_wheelTransform implements IState {
    private _inited: boolean;
    private controlBones = ["wheel2overlay", "wheel3overlay", "rotate-handle"];
    private _temptMat = new gd3d.math.matrix();
    private _temptPos = new gd3d.math.vector2();
    private _chooseBone: spine_gd3d.Bone;
    private bonesPos: { [bone: string]: { bone: spine_gd3d.Bone, boneUI: HTMLDivElement } } = {}
    private _hoverBone: string;

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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).transforms);
                let comp = new spine_gd3d.spineSkeleton(skeletonData);
                this._comp = comp;
                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                let wheel = this._comp.skeleton.findBone("wheel1overlay");
                comp.onUpdate = () => {
                    if (!this._inited) {
                        this._inited = true;
                        let ui = document.getElementById("drawarea") as HTMLDivElement;

                        let lastAngle = 0;
                        //拖动骨骼
                        document.addEventListener("mousemove", (ev) => {
                            if (this._chooseBone) {
                                let bone = this._chooseBone.data.name;
                                //拖拉骨骼
                                if (["wheel2overlay", "wheel3overlay"].indexOf(bone) >= 0) {
                                    //修改UI位置
                                    this.bonesPos[bone].boneUI.style.left = ev.clientX + "px";
                                    this.bonesPos[bone].boneUI.style.top = ev.clientY + "px";

                                    //修改骨骼位置
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
                                } else {
                                    //计算旋转
                                    //修改骨骼位置
                                    //screen world
                                    let mouseWorldPos = new gd3d.math.vector2(ev.clientX - app.width / 2, app.height / 2 - ev.clientY);
                                    let worldPos = this._comp.transform.getWorldTranslate();
                                    let worldRot = this._comp.transform.getWorldRotate();
                                    let worldScale = this._comp.transform.getWorldScale();
                                    //spine world
                                    let spineWorldPos = new gd3d.math.vector2();
                                    gd3d.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                                    gd3d.math.matrix3x2Inverse(this._temptMat, this._temptMat);
                                    gd3d.math.matrix3x2TransformVector2(this._temptMat, mouseWorldPos, spineWorldPos);

                                    let subRes = new gd3d.math.vector2();
                                    gd3d.math.vec2Subtract(spineWorldPos, new gd3d.math.vector2(wheel.worldX, wheel.worldY), subRes);
                                    gd3d.math.vec2Normalize(subRes, subRes);
                                    let angle = Math.acos(subRes.x);
                                    if (subRes.y < 0) angle = 2 * Math.PI - angle;
                                    var delta = angle - lastAngle;
                                    this._comp.skeleton.findBone("wheel1").rotation += delta * 180 / Math.PI;
                                    lastAngle = angle;
                                }
                            }
                        })
                        document.addEventListener("mouseup", () => this._chooseBone = null)

                        //初始化骨骼UI
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
                    //计算旋转骨骼的屏幕坐标
                    let worldPos = this._comp.transform.getWorldTranslate();
                    let worldRot = this._comp.transform.getWorldRotate();
                    let worldScale = this._comp.transform.getWorldScale();
                    gd3d.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                    let bone = this._comp.skeleton.findBone("rotate-handle");
                    let x = this._comp.skeleton.x + bone.worldX;
                    let y = this._comp.skeleton.y + bone.worldY;
                    gd3d.math.matrix3x2TransformVector2(this._temptMat, new gd3d.math.vector2(x, y), this._temptPos);
                    let screen_x = this._temptPos.x + app.width / 2;
                    let screen_y = app.height / 2 - this._temptPos.y;
                    this.bonesPos["rotate-handle"].boneUI.style.left = screen_x + "px";
                    this.bonesPos["rotate-handle"].boneUI.style.top = screen_y + "px";
                }
            })
    }
    update(delta: number) { }
    private _comp: spine_gd3d.spineSkeleton;
}