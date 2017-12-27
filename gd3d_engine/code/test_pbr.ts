//UI 组件样例
class test_pbr implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    assetMgr: gd3d.framework.assetMgr;
    cube: gd3d.framework.transform;
    static temp:gd3d.framework.transform2D;
    start(app: gd3d.framework.application) {

        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();

        //相机
        var objCam = new gd3d.framework.transform();
        objCam.localTranslate.z = -10;
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;

        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.loadpbrRes.bind(this));
        this.taskmgr.addTaskCall(this.init.bind(this));
    }



    private init(astState: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
        let temp1 = new gd3d.framework.transform();
        this.scene.addChild(temp1);
        let mf= temp1.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        mf.mesh = this.assetMgr.getDefaultMesh("sphere");
        let mr = temp1.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        mr.materials[0] = new gd3d.framework.material("testmat");
        // mr.materials[0].setShader(this.assetMgr.getShader("shader/def"));
        // mr.materials[0].setTexture("_MainTex",this.assetMgr.getDefaultTexture("grid"));
        
        //pbr
        mr.materials[0].setShader(this.assetMgr.getAssetByName("pbr.shader.json") as gd3d.framework.shader);
        mr.materials[0].setTexture("brdf",this.assetMgr.getAssetByName(`brdf.png`)as gd3d.framework.texture);

        //sky
        let wrc = WebGLRenderingContext;
        let negx = this.assetMgr.getAssetByName(`negx.jpg`)as gd3d.framework.texture;
        (negx.glTexture as gd3d.render.glTexture2D).TransferToCubeTextureMode(wrc.TEXTURE_CUBE_MAP_NEGATIVE_X);
        let negy = this.assetMgr.getAssetByName(`negy.jpg`)as gd3d.framework.texture;
        (negx.glTexture as gd3d.render.glTexture2D).TransferToCubeTextureMode(wrc.TEXTURE_CUBE_MAP_NEGATIVE_Y);
        let negz = this.assetMgr.getAssetByName(`negz.jpg`)as gd3d.framework.texture;
        (negx.glTexture as gd3d.render.glTexture2D).TransferToCubeTextureMode(wrc.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        let posx = this.assetMgr.getAssetByName(`posx.jpg`)as gd3d.framework.texture;
        (negx.glTexture as gd3d.render.glTexture2D).TransferToCubeTextureMode(wrc.TEXTURE_CUBE_MAP_POSITIVE_X);
        let posy = this.assetMgr.getAssetByName(`posy.jpg`)as gd3d.framework.texture;
        (negx.glTexture as gd3d.render.glTexture2D).TransferToCubeTextureMode(wrc.TEXTURE_CUBE_MAP_POSITIVE_Y);
        let posz = this.assetMgr.getAssetByName(`posz.jpg`)as gd3d.framework.texture;
        (negx.glTexture as gd3d.render.glTexture2D).TransferToCubeTextureMode(wrc.TEXTURE_CUBE_MAP_POSITIVE_Z);

        mr.materials[0].setCubeTexture("u_sky",
        this.assetMgr.getAssetByName(`negx.jpg`)as gd3d.framework.texture,
        this.assetMgr.getAssetByName(`negy.jpg`)as gd3d.framework.texture,
        this.assetMgr.getAssetByName(`negz.jpg`)as gd3d.framework.texture,
        this.assetMgr.getAssetByName(`posx.jpg`)as gd3d.framework.texture,
        this.assetMgr.getAssetByName(`posy.jpg`)as gd3d.framework.texture,
        this.assetMgr.getAssetByName(`posz.jpg`)as gd3d.framework.texture);

        state.finish = true;
    }

    private PBRPath:string = "res/pbrRes/";
    private material:string = this.PBRPath + "barrel1/";
    private skyName = "map";
    private iblPath:string = this.PBRPath + `IBL/${this.skyName}/`;
    private loadpbrRes(lastState: gd3d.framework.taskstate, state: gd3d.framework.taskstate){
        this.assetMgr.load(this.iblPath + "negx.jpg",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
            if(s.isfinish){
                this.assetMgr.load(this.iblPath + "negy.jpg",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                    if(s.isfinish){
                        this.assetMgr.load(this.iblPath + "negz.jpg",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                            if(s.isfinish){
                                this.assetMgr.load(this.iblPath + "posx.jpg",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                                    if(s.isfinish){
                                        this.assetMgr.load(this.iblPath + "posy.jpg",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                                            if(s.isfinish){
                                                this.assetMgr.load(this.iblPath + "posz.jpg",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                                                    if(s.isfinish){
                                                        state.finish = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    private loadTexture(lastState: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
        //加载图片资源
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s1) =>
        {
            if (s1.isfinish){
                this.assetMgr.load(this.PBRPath + "brdf.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        this.assetMgr.load(this.material + "basecolor.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                            if(s.isfinish){
                                this.assetMgr.load(this.material + "normal.png",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                                    if(s.isfinish){
                                        this.assetMgr.load(this.material + "metallicRoughness.png",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                                            if(s.isfinish){
                                                this.assetMgr.load(this.material + "AO.png",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                                                    if(s.isfinish){
                                                        state.finish = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    private addCube() {
        var cube = new gd3d.framework.transform();
        cube.name = "cube";
        cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
        this.scene.addChild(cube);
        var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        mesh.mesh = (this.app.getAssetMgr()).getDefaultMesh("cube");
        cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        cube.gameObject.addComponent("boxcollider") as gd3d.framework.boxcollider;
        this.cube = cube;
        cube.markDirty();

        var cube = new gd3d.framework.transform();
        cube.name = "cube";
        cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
        cube.localTranslate.x = 1;
        cube.localTranslate.z = 1;

        this.scene.addChild(cube);
        var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        mesh.mesh = (this.app.getAssetMgr()).getDefaultMesh("cube");
        cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        cube.gameObject.addComponent("boxcollider") as gd3d.framework.boxcollider;
        this.cube = cube;
        cube.markDirty();
    }

    update(delta: number) {
        this.taskmgr.move(delta); //推进task

    }

}
