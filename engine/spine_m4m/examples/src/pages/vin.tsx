import { Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, Bone, SkeletonJson, SpineAssetMgr, spineSkeleton, Vector2 } from "../../../src/index";

interface IState {
    hoverBone: Bone,
}
export class Vin extends React.Component<{}, IState> {
    private _comp: spineSkeleton;
    private _inited: boolean = false;
    private _temptMat: m4m.math.matrix3x2 = new m4m.math.matrix3x2();
    private _temptPos = new m4m.math.vector2();
    private _app: m4m.framework.application;

    constructor(props) {
        super(props);
        this.state = {
            hoverBone: null,
        }
    }
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
    private controlBones = ["base", "vine-control1", "vine-control2", "vine-control3", "vine-control4"];
    private init(app: m4m.framework.application, root2d: m4m.framework.overlay2D) {
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).vine);
                let comp = new spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, "animation", true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;

                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                comp.onUpdate = () => {
                    if (this._inited == false) {
                        this._inited = true;
                        let temptMat = this._comp.getToCanvasMatrix();
                        let temptPos = new m4m.math.vector2();

                        for (let i = 0; i < this.controlBones.length; i++) {
                            // if(this.bonesPos[this.controlBones[i]]!=null)
                            let boneName = this.controlBones[i];
                            let bone = this._comp.skeleton.findBone(boneName);
                            let x = this._comp.skeleton.x + bone.worldX;
                            let y = this._comp.skeleton.y + bone.worldY;
                            m4m.math.matrix3x2TransformVector2(temptMat, new m4m.math.vector2(x, y), temptPos);
                            root2d.calCanvasPosToScreenPos(temptPos, temptPos);
                            let screen_x = temptPos.x;
                            let screen_y = temptPos.y;
                            this.bonesPos[boneName] = { bone, pos: [screen_x, screen_y] }
                        }
                    }
                    this.forceUpdate();
                }
            }

            )
        this.ref_container.current.addEventListener("mousemove", (ev) => {
            if (this._chooseBone) {
                let bone = this._chooseBone.data.name;
                let x = ev.movementX;
                let y = ev.movementY;
                this.bonesPos[bone].pos[0] = ev.clientX;
                this.bonesPos[bone].pos[1] = ev.clientY;

                let temptPos = new m4m.math.vector2();
                temptPos.x = ev.clientX;
                temptPos.y = ev.clientY;
                root2d.calScreenPosToCanvasPos(temptPos, temptPos);
                let toMat = this._comp.getToCanvasMatrix();
                let temptMat = new m4m.math.matrix3x2();
                m4m.math.matrix3x2Inverse(toMat, temptMat);
                m4m.math.matrix3x2TransformVector2(temptMat, temptPos, temptPos);

                let tempt = new Vector2();
                tempt.set(temptPos.x, temptPos.y)
                this._chooseBone.parent.worldToLocal(tempt);
                this._chooseBone.x = tempt.x;
                this._chooseBone.y = tempt.y;
            }
        })
        this.ref_container.current.addEventListener("mouseup", () => this._chooseBone = null)
    }
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