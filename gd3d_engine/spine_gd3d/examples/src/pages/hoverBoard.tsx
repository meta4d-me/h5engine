import { Button, Slider } from "antd";
import React from "react";
import { AtlasAttachmentLoader, Bone, SkeletonJson, SpineAssetMgr, spineSkeleton, Vector2 } from "../../../src/index";

interface IState {
    hoverBone: Bone,
}

export class HoverBoard extends React.Component<{}, IState> {
    private _comp: spineSkeleton;
    private _app: gd3d.framework.application;
    private _inited: boolean = false;
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

    private controlBones = ["hoverboard controller", "hip controller", "board target", "crosshair"];
    private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {
        this._app = app;
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
                // spineNode.localTranslate.y = -app.height / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                comp.onUpdate = () => {
                    this.forceUpdate();

                    if (this._inited == false) {
                        this._inited = true;
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

                            let screen_x = this._temptPos.x + this._app.width / 2;
                            let screen_y = this._app.height / 2 - this._temptPos.y;
                            this.bonesPos[boneName] = { bone, pos: [screen_x, screen_y] }
                        }
                    }
                }
            })

        this.ref_container.current.addEventListener("mousemove", (ev) => {
            if (this._chooseBone) {
                let bone = this._chooseBone.data.name;
                let x = ev.movementX;
                let y = ev.movementY;
                this.bonesPos[bone].pos[0] = ev.clientX;
                this.bonesPos[bone].pos[1] = ev.clientY;

                let boneWorldPos = new gd3d.math.vector2(ev.clientX - app.width / 2, app.height / 2 - ev.clientY);
                let worldPos = this._comp.transform.getWorldTranslate();
                let worldRot = this._comp.transform.getWorldRotate();
                let worldScale = this._comp.transform.getWorldScale();
                gd3d.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                gd3d.math.matrix3x2Inverse(this._temptMat, this._temptMat);
                gd3d.math.matrix3x2TransformVector2(this._temptMat, boneWorldPos, this._temptPos);

                let tempt = new Vector2();
                tempt.set(this._temptPos.x, this._temptPos.y)
                this._chooseBone.parent.worldToLocal(tempt);
                this._chooseBone.x = tempt.x;
                this._chooseBone.y = tempt.y;
            }
        })
        this.ref_container.current.addEventListener("mouseup", () => this._chooseBone = null)
    }

    private ChangeSpeed(ev) {
        if (this._comp) {
            this._comp.state.timeScale = ev / 100;
        }
    }
    private _temptMat = new gd3d.math.matrix();
    private _temptPos = new gd3d.math.vector2();
    private _chooseBone: Bone;
    private bonesPos: { [bone: string]: { bone: Bone, pos: number[] } } = {}

    private ref_container = React.createRef<HTMLDivElement>();


    private fire = () => {
        this._comp.state.setAnimation(3, "aim", true);
        this._comp.state.setAnimation(4, "shoot", false);
        this._comp.state.addEmptyAnimation(4, 0.5, 0).listener = {
            complete: (trackIndex) => {
                this._comp.state.setEmptyAnimation(3, 0.2);
            }
        };
    }
    private jump = () => {
        this._comp.state.setAnimation(2, "jump", false);
        this._comp.state.addEmptyAnimation(2, 0.5, 0);
    }
    render(): React.ReactNode {
        let { hoverBone } = this.state;
        return <div>
            <div id="container" ref={this.ref_container}>
                {
                    Object.keys(this.bonesPos).map((boneName, index) => {
                        let item = this.bonesPos[boneName];
                        return <div className="radiusCircle" style={{
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
            <div className="ui speed">
                <Button onClick={this.fire} >射击</Button>
                <Button onClick={this.jump}>跳跃</Button>
                <div>动画速度：</div>
                <Slider className="slider" defaultValue={100} onChange={(ev) => this.ChangeSpeed(ev)} tipFormatter={(value) => value / 100} />
            </div>
        </div>
    }
}
