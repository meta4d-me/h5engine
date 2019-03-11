declare let CANNON;
class test_3DPhysics_cannon implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    background: gd3d.framework.transform;
    parts: gd3d.framework.transform;
    timer: number = 0;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    count: number = 0;
    counttimer: number = 0;
    astMgr : gd3d.framework.assetMgr;
    iptMgr : gd3d.framework.inputMgr;

    async start  (app: gd3d.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();
        this.iptMgr = this.app.getInputMgr();
        await this.loadbySync(`./res/shader/shader.assetbundle.json`);
        await this.loadbySync(`./res/prefabs/Capsule/Capsule.assetbundle.json`);
        this.init();
        return null;
    }

    loadbySync(url:string){
        return new gd3d.threading.gdPromise<any>((resolve,reject)=>{
            this.astMgr.load(url,gd3d.framework.AssetTypeEnum.Auto,(state)=>{
                if(state && state.isfinish){
                    resolve();
                }
            });
        });
    }

    init(){
        // let cannonUrl = `./lib/cannon.js`;
        // gd3d.io.loadText(cannonUrl,(txt)=>{
        //     let isok = eval(txt);
        //     setTimeout(() => {
        //         console.warn(CANNON);
        //     }, 0);

        // });



        //构建物体
        //底面
        let trans=new gd3d.framework.transform();
        trans.localScale.x= 20;
        trans.localScale.y= 0.01;
        trans.localScale.z= 20;
        // gd3d.math.quatFromEulerAngles(-90,0,0,trans.localRotate);
        // trans.local

        this.scene.addChild(trans);
        let mf=trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        let mr=trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        mf.mesh=this.astMgr.getDefaultMesh("cube");

        //box
        let trans2=new gd3d.framework.transform();
        trans2.localPosition.y=5;
        trans2.localPosition.x= -0.3;
        trans2.localPosition.z=0.3;
        this.scene.addChild(trans2);
        let mf2=trans2.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        let mr2=trans2.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        mf2.mesh=this.astMgr.getDefaultMesh("cube");

        //sphere
        let trans3=new gd3d.framework.transform();
        // gd3d.math.vec3ScaleByNum(trans3.localScale , 0.5 , trans3.localScale);
        trans3.localPosition.y = 15;
        // trans3.localPosition.x = 0.7;
        // trans3.localPosition.z = -0.7;
        trans3.localPosition.x = -0.2;
        trans3.localPosition.z = 0.2;
        this.scene.addChild(trans3);
        let mf3=trans3.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        let mr3=trans3.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        // mf3.mesh=this.astMgr.getDefaultMesh("cube");
        mf3.mesh=this.astMgr.getDefaultMesh("sphere");


        //组合 碰撞体--------------------
        //父层级
        let combination = new gd3d.framework.transform();
        combination.name = "combination"
        combination.localPosition.y = 10;
        // combination.localPosition.x = 0.6;
        // combination.localPosition.z = -0.6;
        this.scene.addChild(combination);

        //显示模型
        //外部加载mesh (capsule)
        let p1= this.astMgr.getAssetByName("Capsule.prefab.json") as gd3d.framework.prefab;
        let capsule = p1.getCloneTrans();
        capsule.name = "capsule"
        let mf4 = capsule.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
        // gd3d.math.vec3ScaleByNum(trans4.localScale , 0.5 , trans4.localScale);
        combination.addChild(capsule);

        //top sphere
        let sphere_top =new gd3d.framework.transform();
        sphere_top.name = "sphere_top"
        sphere_top.localPosition.y = 0.5;
        gd3d.math.vec3SetAll(sphere_top.localScale,0.5);
        // gd3d.math.vec3SetAll(sphere_top.localScale,2);
        // sphere_top.localPosition.x = 2;
        // sphere_top.localPosition.z = 2;
        combination.addChild(sphere_top);
        let mf_st=sphere_top.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        let mr_st=sphere_top.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        mf_st.mesh=this.astMgr.getDefaultMesh("sphere");

        //mid 
        let cylinder_mid =new gd3d.framework.transform();
        cylinder_mid.name = "cylinder_mid"
        // gd3d.math.vec3SetAll(cylinder_mid.localScale,1);
        gd3d.math.vec3Set(cylinder_mid.localScale,1,0.5,1);
        // box_1.localPosition.y = 8;
        // sphere_top.localPosition.x = 0.6;
        // sphere_top.localPosition.z = -0.6;
        combination.addChild(cylinder_mid);
        let mf_cl=cylinder_mid.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        let mr_cl=cylinder_mid.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        mf_cl.mesh=this.astMgr.getDefaultMesh("cylinder");

        //bottom sphere
        let sphere_bottom =new gd3d.framework.transform();
        sphere_bottom.name = "sphere_bottom"
        sphere_bottom.localPosition.y = -0.5;
        // sphere_bottom.localPosition.y = -1;
        // sphere_bottom.localPosition.x = 6;
        // sphere_bottom.localPosition.z = 6;
        gd3d.math.vec3SetAll(sphere_bottom.localScale,0.5);
        // box_1.localPosition.y = 8;
        // sphere_top.localPosition.x = 0.6;
        // sphere_top.localPosition.z = -0.6;
        combination.addChild(sphere_bottom);
        let mf_sb=sphere_bottom.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        let mr_sb=sphere_bottom.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        mf_sb.mesh=this.astMgr.getDefaultMesh("sphere");

        //高度场
        let trans5 = new gd3d.framework.transform();
        trans5.localPosition.x = -30;
        trans5.localPosition.z = 30;
        // trans5.localPosition.y = -30;
        trans5.name = "heightFiled";
        gd3d.math.quatFromEulerAngles(-90,0,0,trans5.localRotate);

        //data
        let hf_matrix = [];
        let sizeX = 10 , sizeY = 10;
        let testv = -2;
        for (var i = 0; i < sizeX; i++) {
            hf_matrix.push([]);
            for (var j = 0; j < sizeY; j++) {
                // var height = Math.cos(i/sizeX * Math.PI * 2)*Math.cos(j/sizeY * Math.PI * 2) *testv + 2;
                var height = Math.cos(j/sizeY * Math.PI * 2) *testv + 2;
                if(i===0 || i === sizeX-1 || j===0 || j === sizeY-1)
                    height = 3;
                    hf_matrix[i].push(height);

                    // hf_matrix[i].push(0);
            }
        }

        let opts = {elementSize: 10};
        //初始化 物理
        this.scene.enablePhysics(new gd3d.math.vector3(0,-9.8,0),new gd3d.framework.OimoJSPlugin());

        // let groundImpostor= new gd3d.framework.PhysicsImpostor(trans, gd3d.framework.ImpostorType.BoxImpostor, { mass: 0, restitution: 0.5});
        let groundImpostor= new gd3d.framework.PhysicsImpostor(trans, gd3d.framework.ImpostorType.PlaneImpostor, { mass: 0, restitution: 0.3});
        let boxImpostor = new gd3d.framework.PhysicsImpostor(trans2, gd3d.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.9 });
        let sphereImpostor = new gd3d.framework.PhysicsImpostor(trans3, gd3d.framework.ImpostorType.SphereImpostor, { mass: 0.3, restitution: 0.9 });
        // let hfImpostor = new gd3d.framework.PhysicsImpostor(trans5, gd3d.framework.ImpostorType.HeightmapImpostor, { mass: 0 ,heightFieldMatrix : hf_matrix , heightFieldOptions : opts});
        
        //组合 碰撞体
        let s_top_Impostor = new gd3d.framework.PhysicsImpostor(sphere_top, gd3d.framework.ImpostorType.SphereImpostor, { mass: 1, restitution: 0.5});
        let c_mid_Impostor = new gd3d.framework.PhysicsImpostor(cylinder_mid, gd3d.framework.ImpostorType.CylinderImpostor, { mass: 1, restitution: 0.5});
        let s_bottom_Impostor = new gd3d.framework.PhysicsImpostor(sphere_bottom, gd3d.framework.ImpostorType.SphereImpostor, { mass: 1, restitution: 0.5});
        let combImpostor = new gd3d.framework.PhysicsImpostor(combination, gd3d.framework.ImpostorType.NoImpostor, { mass: 1, restitution: 0.5});


        let pWorld = gd3d.framework.physic.getPhysicsPlugin().world;
        pWorld.broadphase = new CANNON.NaiveBroadphase();

        // gd3d["hh"] = meshImpostor;

        // //按键事件
        let ipt = this.app.getInputMgr();
        ipt.addKeyListener(gd3d.event.KeyEventEnum.KeyDown,(code : gd3d.event.KeyCode )=>{
            // let kd = ipt.GetKeyDown(gd3d.event.KeyCode.Space);
            // if(kd){
            //     meshImpostor.physicsBody.velocity.set(0,10,0);
            // }

            if(code == gd3d.event.KeyCode.KeyA){
                console.log(`AAAAAAAAAAAAA`);
            }
        },this);

        console.log("i am here.");
        this.scene = this.app.getScene();

        //相机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 120;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0,15,-15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        // let controller=new CameraController();
        // CameraController.instance().init(this.app,this.camera);
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30 ;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0)

        //鼠标事件
        //this.iptMgr.addPointListener(gd3d.event.PointEventEnum.PointMove,);
    }

    onPonitMove(x,y){

    }

    doRay(){
        
    }


    update(delta: number) {
        //CameraController.instance().update(delta);
    }
}