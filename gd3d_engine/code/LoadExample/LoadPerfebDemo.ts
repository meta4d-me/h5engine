//现在我们使用封装好的loadDome类来加载一个 简单的面片prefeb 
//import { LoadDomes } from "./LoadDomes";
class LoadPrefebDome implements IState {//IState 接口是给dome用的接口，为了更方便地看我们dome的效果。该接口与引擎无关
    app: gd3d.framework.application;
    assetMgr: gd3d.framework.assetMgr;
    scene: gd3d.framework.scene;

    start(app: gd3d.framework.application) {//接口IState 入口
        this.app = app;
        this.assetMgr = app.getAssetMgr();
        this.scene = app.getScene();

        //在场景中放入一个相机
        let cam: gd3d.framework.transform, camera: gd3d.framework.camera;
        {
            cam = new gd3d.framework.transform();
            cam.name = "looker";
            this.scene.addChild(cam);
            cam.localPosition = new gd3d.math.vector3(0, 0, -10);
            //cam.localRotate = new gd3d.math.quaternion(0,0,0,1);
            camera = cam.gameObject.addComponent("camera") as gd3d.framework.camera;
            camera.far = 100;
            cam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            cam.markDirty();
        }
        //Dome加载的资源使用的是 res/prefabs/Quad11
        LoadDomes.loadPrefab(this.assetMgr, "res/prefabs/Cube/resources/Cube.prefab.json", (prefeb: gd3d.framework.prefab) => {
            let quad11 = prefeb.getCloneTrans();
            quad11.name = "Quad11"
            this.scene.addChild(quad11);
            quad11.localPosition = new gd3d.math.vector3(0, 0, 0);
            quad11.markDirty();
            console.log(quad11);
        });
    }

    update(delta: number) {//接口IState 的update方法 detal一般是当前与上次 app中update方法被的时间差

    }

    //运行时我们会发现，并没有看到什么，这是因为我们只加载了prefeb资源 。prefeb资源中并没其他如mesh texture 等资源。如果我们想看到效果必须把其他相关资源一起加载了。
}

//为了更好的看到效果，我们可以把其他资源也一起加载。。
//这个Dome是多个有关联的资源一起加载的Dome。
class LoadPrefebDome2 implements IState {
    app: gd3d.framework.application;
    assetMgr: gd3d.framework.assetMgr;
    scene: gd3d.framework.scene;

    start(app: gd3d.framework.application) {
        this.app = app;
        this.assetMgr = app.getAssetMgr();
        this.scene = app.getScene();

        //在场景中放入一个相机
        let cam: gd3d.framework.transform, camera: gd3d.framework.camera;
        {
            cam = new gd3d.framework.transform();
            cam.name = "looker";
            this.scene.addChild(cam);
            cam.localPosition = new gd3d.math.vector3(0, 0, -10);
            //cam.localRotate = new gd3d.math.quaternion(0,0,0,1);
            camera = cam.gameObject.addComponent("camera") as gd3d.framework.camera;
            camera.far = 100;
            cam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            cam.markDirty();
        }

        //按照一定的顺序加载有关联的资源。
        /*
            关联资源的优先级是 
                pack, glvshader, glfshader,shader,textasset,mesh,
                texture,pvr,dds,texturedesc,font, atlas,
                material, anclip, f14eff,prefab,scene
        */
        LoadDomes.loadBundle(this.assetMgr, "res/shader/MainShader.assetbundle.json", (s) => {//加载shader
            LoadDomes.loadMesh(this.assetMgr, "res/prefabs/Quad11/resources/Library_unity_default_resources_Quad.mesh.bin", (mesh: gd3d.framework.mesh) => {
                LoadDomes.loadTextureDesc(this.assetMgr, "res/prefabs/Quad11/resources/87_terrain_007_diff.imgdesc.json", (s) => {
                    LoadDomes.loadMaterial(this.assetMgr, "res/prefabs/Quad11/resources/NewMaterial.mat.json", (s) => {
                        LoadDomes.loadPrefabToTranfrom(this.assetMgr, "res/prefabs/Quad11/resources/Quad.prefab.json", (tran: gd3d.framework.transform) => {
                            this.scene.addChild(tran);
                            tran.markDirty();
                            console.log(tran);
                        });
                    });
                });
            });
        });
        /*
            上面加载资源使用的是Dome事先封装好的加载方法。在实际项目使用的时候一般都会直接使用assetMgr的Load方法去进行加载，如下：
            this.assetMgr.load("res/shader/MainShader.assetbundle.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                if(s.isfinish){
                    this.assetMgr.load("res/prefabs/Quad11/resources/Library_unity_default_resources_Quad.mesh.bin",gd3d.framework.AssetTypeEnum.Mesh,(s)=>{
                        if(s.isfinish){
                            this.assetMgr.load("res/prefabs/Quad11/resources/87_terrain_007_diff.imgdesc.json",gd3d.framework.AssetTypeEnum.TextureDesc,(s)=>{
                                if(s.isfinish){
                                    this.assetMgr.load("res/prefabs/Quad11/resources/NewMaterial.mat.json",gd3d.framework.AssetTypeEnum.Material,(s)=>{
                                        if(s.isfinish){
                                            this.assetMgr.load("res/prefabs/Quad11/resources/Quad.prefab.json",gd3d.framework.AssetTypeEnum.Prefab,(s)=>{
                                                if(s.isfinish){
                                                    let quadPrefab = this.assetMgr.getAssetByName("Quad.prefab.json") as gd3d.framework.prefab;
                                                    let quad = quadPrefab.getCloneTrans();
                                                    this.scene.addChild(quad);
                                                    quad.markDirty();
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
        */


        /*  
            从上面的代码中可以看出，加载复杂的资源代码量会非常乱，所以实际开发中都会把资源打包成bundle包 或 压缩的bundle包进行统一加载。如下：
            this.assetMgr.load("res/shader/MainShader.assetbundle.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                if(s.isfinish){
                    this.assetMgr.load("res/prefabs/Quad11/Quad.assetbundle.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                        if(s.isfinish){
                            let quadPrefab = this.assetMgr.getAssetByName("Quad.prefab.json") as gd3d.framework.prefab;
                            let quad = quadPrefab.getCloneTrans();
                            this.scene.addChild(quad);
                            quad.markDirty();
                        }
                    });
                }
            });
        */
    }

    update(delta: number) {

    }

}