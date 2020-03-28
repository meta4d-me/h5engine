namespace gd3d.plugins.preview {
    export class main {
        urlParam: { [key: string]: string } = {};
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        assetMgr: gd3d.framework.assetMgr;
        root: gd3d.framework.transform;
        pviewCam: gd3d.framework.transform;
        target: gd3d.framework.transform;
        constructor() {
            window.oncontextmenu = (e) => { e.preventDefault(); };
            this.initParam();
        }
        createCamera(parent, name) {
            var objCam = new gd3d.framework.transform();
            objCam.name = name;
            parent.addChild(objCam);
            var camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            camera.near = 0.01;
            camera.far = 1000;
            camera.CullingMask = gd3d.framework.CullingMask.everything;
            // camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.markDirty();//标记为需要刷新
            return objCam;
        }

        start(gameStage: HTMLCanvasElement) {

            var gdapp = new gd3d.framework.application();
            gdapp.bePlay = true;

            gdapp.startForCanvas(gameStage, gd3d.framework.CanvasFixedType.Free, 720);

            this.app = gdapp;
            this.assetMgr = this.app.getAssetMgr();
            this.scene = gd3d.framework.sceneMgr.scene;

            this.root = new gd3d.framework.transform();
            this.root.name = "pviewroot";
            this.root.gameObject.hideFlags = gd3d.framework.HideFlags.HideAndDontSave;
            this.scene.addChild(this.root);

            var cam = this.createCamera(this.root, "pviewCam");
            this.pviewCam = cam;
            // createCube();
            var pviewPath = this.urlParam["pviewPath"];
            console.log(`pview:Resources/${pviewPath}`);
            this.assetMgr.load(`Resources/${pviewPath}`, gd3d.framework.AssetTypeEnum.Auto, (state) => {
                if (state.isfinish) {
                    var resName = pviewPath.split("/").pop().replace(".assetbundle.json", "");
                    let prefab = this.assetMgr.getAssetByName(`${resName}.cprefab.json`, `${resName}.assetbundle.json`) as gd3d.framework.prefab;

                    let trans: any = prefab.getCloneTrans();
                    if (trans.constructor.name == "transform2D")
                        this.pview2DTrans(trans);
                    else
                        this.pview3DTrans(trans);
                }
            });
            this.handleEvent();
        }

        initParam() {
            let params = window.location.href.replace("?", "&").split("&");
            for (var i = 1; i < params.length; ++i) {
                var pair = params[i].split("=");
                this.urlParam[pair[0]] = pair[1];
            }
            console.log(`参数:`, this.urlParam);
        }


        handleEvent() {
            (document as any).onmousewheel = (e) => {
                this.pviewCam.localTranslate.z += e.deltaY / 100;
                this.pviewCam.lookat(this.root);
                this.pviewCam.markDirty();
            }
            let thita = 0;
            document.onmousedown = (event) => {
                event.preventDefault();
                let ev = event;

                document.onmousemove = (e) => {
                    e.preventDefault();
                    if (!this.target)
                        return;
                    let ry = ev.clientY - e.clientY;
                    let rx = ev.clientX - e.clientX;
                    let vc3 = new gd3d.math.vector3(0, 0.4, 0);

                    let quat = new gd3d.math.quaternion();

                    gd3d.math.quatFromAxisAngle(vc3, rx, quat);

                    gd3d.math.quatNormalize(quat, quat);

                    gd3d.math.quatMultiply(this.target.localRotate, quat, this.target.localRotate);

                    gd3d.math.quatNormalize(this.target.localRotate, this.target.localRotate);

                    if (ry != 0) {
                        thita += ry * 0.4;
                        if (thita >= -90 && thita <= 90) {
                            let vc3x = new gd3d.math.vector3(0.4, 0, 0);

                            let q = new gd3d.math.quaternion();

                            q.w = this.target.localRotate.w;
                            q.x = -this.target.localRotate.x;
                            q.y = -this.target.localRotate.y;
                            q.z = -this.target.localRotate.z;

                            gd3d.math.quatTransformVector(q, vc3x, vc3x);

                            let quatx = new gd3d.math.quaternion();

                            gd3d.math.quatFromAxisAngle(vc3x, -ry, quatx);

                            gd3d.math.quatNormalize(quatx, quatx);

                            gd3d.math.quatMultiply(this.target.localRotate, quatx, this.target.localRotate);

                            gd3d.math.quatNormalize(this.target.localRotate, this.target.localRotate);

                        } else {
                            thita -= ry * 0.4;
                        }
                    }

                    this.target.markDirty();

                    ev = e;
                }

                document.onmouseup = (e) => {

                    document.onmousemove = null;
                    document.onmouseup = null;
                    document.onmouseup = null;
                }

                document.onmouseout = (e) => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    document.onmouseup = null;
                }
            }

        }

        pview3DTrans(trans: framework.transform) {

            trans.localTranslate = new gd3d.math.vector3(0, 0, 0);
            this.root.addChild(trans);
            this.pviewCam.localTranslate = new gd3d.math.vector3(0, 0, 5);
            this.pviewCam.lookat(trans);
            this.target = trans;
        }

        pview2DTrans(trans: framework.transform2D) {
            let overlay = new gd3d.framework.overlay2D();
            overlay.scaleMode = gd3d.framework.UIScaleMode.SCALE_WITH_SCREEN_SIZE;
            let wwidth: number = 1280;
            let hheight: number = 720;
            //因会被广告位档到  iphone  5  5s   iphone 8  ui整体微调缩小
            let isLowPix = this.app.canvasClientHeight <= 414;

            let pixChange = 1;

            wwidth = 1280 * pixChange;
            hheight = 720 * pixChange;

            overlay.matchReference_width = wwidth;
            overlay.matchReference_height = hheight;
            overlay.screenMatchRate = 1;

            let asp = this.app.width / this.app.height;
            let min = 0.6;
            let max = 1.68;
            asp = asp < min ? min : asp;
            if (asp < max) {
                overlay.screenMatchRate = (asp - min) / (max - min);
            }

            this.scene.mainCamera.addOverLay(overlay);
            let uiRoot = overlay.canvas.getRoot();
            uiRoot.addChild(trans);
            trans.markDirty();
        }
    }
}