
namespace t {
    export class test_ATC implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
        assetMgr: gd3d.framework.assetMgr;
        rooto2d: gd3d.framework.overlay2D;
        static temp: gd3d.framework.transform2D;
        start(app: gd3d.framework.application) {
            this.app = app;
            this.scene = this.app.getScene();
            this.assetMgr = this.app.getAssetMgr();
            let objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);

            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 10;

            this.rooto2d = new gd3d.framework.overlay2D();
            this.camera.addOverLay(this.rooto2d);

            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.createUI.bind(this));

        }

        //shannon_dxt5.dds  shannon_dxt3.dds    shannon_dxt1.dds
        //shannon_atc_rgba_interpolated.dds     shannon_atc_rgba_explicit.dds   shannon_atc_rgb.dds

        private createLabel(x: number, y: number, text: string): gd3d.framework.transform2D {
            let label1 = new gd3d.framework.transform2D;
            label1.width = 60;
            label1.height = 14;
            label1.localTranslate.x = x;
            label1.localTranslate.y = y;
            this.rooto2d.addChild(label1);
            let a1 = label1.addComponent("label") as gd3d.framework.label;
            a1.font = this.assetMgr.getAssetByName("STXINGKA.font.json") as gd3d.framework.font;
            a1.fontsize = 12;
            a1.text = text;
            a1.color = new gd3d.math.color(0, 0, 0, 1);
            return label1;
        }

        private createImage(x: number, y: number, texName: string) {
            let image = new gd3d.framework.transform2D;
            image.width = 60;
            image.height = 60;
            image.localTranslate.x = x;
            image.localTranslate.y = y;
            this.rooto2d.addChild(image);

            let img = image.addComponent("rawImage2D") as gd3d.framework.rawImage2D;
            let tex = this.assetMgr.getAssetByName(texName) as gd3d.framework.texture;
            img.image = tex;
        }

        private createUI(astState: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            let atlasComp = this.assetMgr.getAssetByName("comp.atlas.json") as gd3d.framework.atlas;
            let tex_0 = this.assetMgr.getAssetByName("zg03_256.png") as gd3d.framework.texture;

            let label1 = this.createLabel(10, 10, "shannon_dxt1.dds");
            let label3 = this.createLabel(80, 10, "shannon_dxt3.dds");
            let label5 = this.createLabel(150, 10, "shannon_dxt5.dds");
            let labelAAI = this.createLabel(10, 200, "shannon_atc_rgb.dds");
            let labelAAE = this.createLabel(80, 200, "shannon_atc_rgba_explicit.dds");
            let labelARGB = this.createLabel(150, 200, "shannon_atc_rgba_interpolated.dds");

            let image1 = this.createImage(10, 26, "shannon_dxt1.dds");
            let image3 = this.createImage(80, 26, "shannon_dxt3.dds");
            let image5 = this.createImage(150, 26, "shannon_dxt5.dds");
            let imageAAI = this.createImage(10, 214, "shannon_atc_rgb.dds");
            let imageAAE = this.createImage(80, 214, "shannon_atc_rgba_explicit.dds");
            let imageARGB = this.createImage(150, 214, "shannon_atc_rgba_interpolated.dds");

            let tran = this.assetMgr.getAssetByName("dragon");
            if(tran instanceof gd3d.framework.transform){
                let dragon = tran as gd3d.framework.transform;
            }

            state.finish = true;

        }

        private loadTexture(lastState: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            //加载图片资源
            this.assetMgr.load("res/comp/comp.json.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    this.assetMgr.load("res/comp/comp.atlas.json", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                        if (s.isfinish) {
                            //加载字体资源
                            this.assetMgr.load("res/STXINGKA.TTF.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                if (s.isfinish) {
                                    this.assetMgr.load("res/resources/STXINGKA.font.json", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                        this.assetMgr.load("res/zg03_256.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                            if (s.isfinish) {

                                                let t = 6;

                                                this.assetMgr.load("res/shannon_dxt1.dds", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                                    if (s.isfinish) {
                                                        t--;
                                                        if (t == 0) {
                                                            state.finish = true;
                                                        }
                                                    } else {
                                                        state.error = false;
                                                    }
                                                });

                                                this.assetMgr.load("res/shannon_dxt3.dds", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                                    if (s.isfinish) {
                                                        t--;
                                                        if (t == 0) {
                                                            state.finish = true;
                                                        }
                                                    } else {
                                                        state.error = false;
                                                    }
                                                });

                                                this.assetMgr.load("res/shannon_dxt5.dds", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                                    if (s.isfinish) {
                                                        t--;
                                                        if (t == 0) {
                                                            state.finish = true;
                                                        }
                                                    } else {
                                                        state.error = false;
                                                    }
                                                });

                                                this.assetMgr.load("res/shannon_atc_rgb.dds", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                                    if (s.isfinish) {
                                                        t--;
                                                        if (t == 0) {
                                                            state.finish = true;
                                                        }
                                                    } else {
                                                        state.error = false;
                                                    }
                                                });

                                                this.assetMgr.load("res/shannon_atc_rgba_explicit.dds", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                                    if (s.isfinish) {
                                                        t--;
                                                        if (t == 0) {
                                                            state.finish = true;
                                                        }
                                                    } else {
                                                        state.error = false;
                                                    }
                                                });

                                                this.assetMgr.load("res/shannon_atc_rgba_interpolated.dds", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                                                    if (s.isfinish) {
                                                        t--;
                                                        if (t == 0) {
                                                            state.finish = true;
                                                        }
                                                    } else {
                                                        state.error = false;
                                                    }
                                                });

                                            
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });


        }
        //shannon_dxt5.dds shannon_dxt3.dds shannon_dxt1.dds  shannon_atc_rgba_interpolated.dds shannon_atc_rgba_explicit.dds shannon_atc_rgb.dds
        update(delta: number) {
            this.taskmgr.move(delta);
        }
    }
}