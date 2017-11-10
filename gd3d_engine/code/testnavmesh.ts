class test_navmesh implements IState
{
    
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    navMeshLoader:gd3d.framework.NavMeshLoadManager;
    camera: gd3d.framework.camera;
    cube:gd3d.framework.transform;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.inputMgr = this.app.getInputMgr();
        this.navMeshLoader = gd3d.framework.NavMeshLoadManager.Instance;

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        
        //只需要load一下
        this.navMeshLoader.loadNavMesh("res/navinfo.json", app, (s)=>{
            objCam.lookat(this.navMeshLoader.navTrans);
            objCam.markDirty();//标记为需要刷新
        });
        var array = this.navMeshLoader.moveToPoints(new gd3d.math.vector3(-2.635004384225666,0.033333320000000555, 2.331812147285282), new gd3d.math.vector3(3.2923403637954975,0.03333331999999878,-1.158075981081689));
        console.error(JSON.stringify(array));
        // gd3d.io.loadText("res/navinfo.json", (text, error) =>
        // {
        //     this.navmeshLoaded(text);
        //     objCam.lookat(this.navObj);
        //     objCam.markDirty();//标记为需要刷新
        // });

        //添加一个盒子
        let cuber: gd3d.framework.meshRenderer;
        this.cube = new gd3d.framework.transform();
        this.cube.name = "cube";

        this.cube.localScale.x = 1;
        this.cube.localScale.y = 1;
        this.cube.localScale.z = 1;
        this.scene.addChild(this.cube);
        var mesh = this.cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

        var smesh = this.app.getAssetMgr().getDefaultMesh("pyramid");
        mesh.mesh = (this.app.getAssetMgr().getDefaultMesh("cube"));
        var renderer = this.cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        var col = this.cube.gameObject.addComponent("boxcollider") as gd3d.framework.boxcollider;
        col.colliderVisible = true;

        this.cube.markDirty();
        cuber = renderer;

        this.scene.addChild(this.cube);
        var array = this.navMeshLoader.moveToPoints(new gd3d.math.vector3(-2.635004384225666,0.033333320000000555, 2.331812147285282), new gd3d.math.vector3(3.2923403637954975,0.03333331999999878,-1.158075981081689));
        console.error(JSON.stringify(array));
    }

    timer: number = 0;
    movetarget: gd3d.math.vector3 = new gd3d.math.vector3();
    inputMgr: gd3d.framework.inputMgr;
    pointDown: boolean = false;
    update(delta: number) {
        if (this.pointDown == false && this.inputMgr.point.touch == true)//pointdown
        {
            // var ray = this.camera.creatRayByScreen(new gd3d.math.vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
            // var pickinfo = this.scene.pick(ray);
            // if (pickinfo != null)
            // {
                
            //     this.movetarget = pickinfo.hitposition;
            //     console.log(this.movetarget);
            //     this.timer = 0;
            // }
            this.pickDown();
        }
        this.pointDown = this.inputMgr.point.touch;
    }

    pos = [];

    pickDown():void{
        let navTrans = this.navMeshLoader.navTrans;
        let navmesh = this.navMeshLoader.navMesh;
        if (navmesh == null) return;
        let inputMgr = this.app.getInputMgr();
        let ray = this.camera.creatRayByScreen(new gd3d.math.vector2(inputMgr.point.x, inputMgr.point.y), this.app);
        let pickinfo: gd3d.framework.pickinfo = navmesh.intersects(ray, navTrans.getWorldMatrix());
        if (!pickinfo) return;
        // let startPos = gd3d.math.pool.new_vector3();
        // gd3d.math.vec3Clone(this.cube.localTranslate, startPos);
        let endPos = pickinfo.hitposition;
        console.error(endPos);
        this.pos.push(endPos);
        // let points = this.navMeshLoader.moveToPoints(startPos, endPos);
        if (this.pos.length > 1){
            let a = this.navMeshLoader.moveToPoints(this.pos.pop(), this.pos.pop());
            console.error(a);
        }
    }
}