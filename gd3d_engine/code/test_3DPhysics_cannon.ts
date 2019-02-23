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
    

    private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
            if (_state.isfinish) {

                state.finish = true;
            }
        }
        );
    }

    private addcam(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 120;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, 10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        state.finish = true;

    }
    start(app: gd3d.framework.application) {
        let cannonUrl = `./lib/cannon.js`;

        gd3d.io.loadText(cannonUrl,(txt)=>{
            

            let isok = eval(txt);
            eval("alert('Hello world')");

            debugger;
    
            var CANNON = CANNON ? CANNON : {};
    
            debugger;
            
        });


        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));

    }


    update(delta: number) {

    }
}