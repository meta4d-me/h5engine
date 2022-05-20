import { Button, Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, Bone, SkeletonJson, SpineAssetMgr, spineSkeleton, Vector2 } from "../../../src/index";

interface IState {
    hoverBone: Bone,
}

export class WheelTransform extends React.Component<{}, IState> {
    private _comp: spineSkeleton;
    private _app: gd3d.framework.application;
    private _inited: boolean = false;
    wheel: Bone;
    constructor(props) {
        super(props);
        this.state = {
            hoverBone: null,
        }
    }
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

    private controlBones = ["wheel2overlay", "wheel3overlay", "rotate-handle"];
    private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {
        this._app = app;
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).transforms);
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                let spineNode = new gd3d.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;

                // spineNode.localTranslate.y = -app.height / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                let wheel = this._comp.skeleton.findBone("wheel1overlay");
                this.wheel = wheel;
                comp.onUpdate = () => {
                    this.forceUpdate();

                    if (this._inited == false) {
                        this._inited = true;
                        let temptMat = this._comp.getToCanvasMatrix();
                        let temptPos = new gd3d.math.vector2();

                        for (let i = 0; i < this.controlBones.length; i++) {
                            // if(this.bonesPos[this.controlBones[i]]!=null)
                            let boneName = this.controlBones[i];
                            let bone = this._comp.skeleton.findBone(boneName);
                            let x = this._comp.skeleton.x + bone.worldX;
                            let y = this._comp.skeleton.y + bone.worldY;
                            gd3d.math.matrix3x2TransformVector2(temptMat, new gd3d.math.vector2(x, y), temptPos);
                            root2d.calCanvasPosToScreenPos(temptPos, temptPos);
                            let screen_x = temptPos.x;
                            let screen_y = temptPos.y;

                            this.bonesPos[boneName] = { bone, pos: [screen_x, screen_y] }
                        }
                    }

                    //计算旋转骨骼的屏幕坐标
                    let temptMat = this._comp.getToCanvasMatrix();
                    let temptPos = new gd3d.math.vector2();

                    let bone = this._comp.skeleton.findBone("rotate-handle");
                    let x = this._comp.skeleton.x + bone.worldX;
                    let y = this._comp.skeleton.y + bone.worldY;
                    gd3d.math.matrix3x2TransformVector2(temptMat, new gd3d.math.vector2(x, y), temptPos);
                    root2d.calCanvasPosToScreenPos(temptPos, temptPos);
                    let screen_x = temptPos.x;
                    let screen_y = temptPos.y;

                    this.bonesPos["rotate-handle"] = { bone, pos: [screen_x, screen_y] }
                }
            })

        let lastAngle = 0;
        this.ref_container.current.addEventListener("mousemove", (ev) => {
            if (this._chooseBone) {
                let bone = this._chooseBone.data.name;
                if (["wheel2overlay", "wheel3overlay"].indexOf(bone) >= 0) {
                    this.bonesPos[bone].pos[0] = ev.clientX;
                    this.bonesPos[bone].pos[1] = ev.clientY;

                    let temptPos = new gd3d.math.vector2();
                    temptPos.x = ev.clientX;
                    temptPos.y = ev.clientY;
                    root2d.calScreenPosToCanvasPos(temptPos, temptPos);
                    let toMat = this._comp.getToCanvasMatrix();
                    let temptMat = new gd3d.math.matrix3x2();
                    gd3d.math.matrix3x2Inverse(toMat, temptMat);
                    gd3d.math.matrix3x2TransformVector2(temptMat, temptPos, temptPos);


                    let tempt = new Vector2();
                    tempt.set(temptPos.x, temptPos.y)
                    this._chooseBone.parent.worldToLocal(tempt);
                    this._chooseBone.x = tempt.x;
                    this._chooseBone.y = tempt.y;
                } else {
                    //计算旋转
                    let temptPos = new gd3d.math.vector2();
                    temptPos.x = ev.clientX;
                    temptPos.y = ev.clientY;
                    root2d.calScreenPosToCanvasPos(temptPos, temptPos);
                    let toMat = this._comp.getToCanvasMatrix();
                    let temptMat = new gd3d.math.matrix3x2();
                    gd3d.math.matrix3x2Inverse(toMat, temptMat);
                    gd3d.math.matrix3x2TransformVector2(temptMat, temptPos, temptPos);

                    let subRes = new gd3d.math.vector2();
                    gd3d.math.vec2Subtract(temptPos, new gd3d.math.vector2(this.wheel.worldX, this.wheel.worldY), subRes);
                    gd3d.math.vec2Normalize(subRes, subRes);
                    let angle = Math.acos(subRes.x);
                    if (subRes.y < 0) angle = 2 * Math.PI - angle;
                    var delta = angle - lastAngle;
                    this._comp.skeleton.findBone("wheel1").rotation += delta * 180 / Math.PI;
                    lastAngle = angle;
                }
            }
        })
        this.ref_container.current.addEventListener("mouseup", () => this._chooseBone = null)
    }

    private _temptMat = new gd3d.math.matrix();
    private _temptPos = new gd3d.math.vector2();
    private _chooseBone: Bone;
    private bonesPos: { [bone: string]: { bone: Bone, pos: number[] } } = {}

    private ref_container = React.createRef<HTMLDivElement>();

    render(): React.ReactNode {
        let { hoverBone } = this.state;
        return <div>
            <div id="container" ref={this.ref_container}>
                {
                    Object.keys(this.bonesPos).map((boneName, index) => {
                        let item = this.bonesPos[boneName];
                        return <div className="radiusCircle" key={index} style={{
                            top: item.pos[1] + "px",
                            left: item.pos[0] + "px",
                            backgroundColor: hoverBone == item.bone ? "green" : "blue"
                        }}
                            onMouseEnter={() => this.setState({ hoverBone: item.bone })}
                            onMouseLeave={() => { this.setState({ hoverBone: null }); }}
                            onMouseDown={() => { this._chooseBone = item.bone }}
                        ></div>
                    })
                }
            </div>
        </div>
    }
}
