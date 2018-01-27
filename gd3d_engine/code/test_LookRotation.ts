class test_LookRotation implements IState {
    app:gd3d.framework.application;
    scene:gd3d.framework.scene;
    taskmgr:gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    camere:gd3d.framework.camera;
    cube:gd3d.framework.transform;
    time:number = 0;
    objCam:gd3d.framework.transform;
    private loadShader(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate){
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json",gd3d.framework.AssetTypeEnum.Auto,(_state)=>{
            if(_state.isfinish){
                state.finish=true;
            }else{
                state.error=true;
            }
        });
    }

    private loadTexture(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate){
        this.app.getAssetMgr().load("res/zg256.png",gd3d.framework.AssetTypeEnum.Auto,(_state)=>{
            if(_state.isfinish){
                state.finish=true;
            }else{
                state.error=true;
            }
        });
    }

    private addCam(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate){
        let objCam = new gd3d.framework.transform();
        objCam.name = "Main Camera";
        this.scene.addChild(objCam);
        this.camere = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camere.near=0.01;
        this.camere.far=100;
        objCam.localTranslate=new gd3d.math.vector3(0,0,-10);
        //objCam.lookatPoint(new gd3d.math.vector3(0,0,0));

        objCam.updateWorldTran();

        gd3d.math.quat2LookRotation(objCam.getWorldTranslate(),new gd3d.math.vector3(0,0,0),new gd3d.math.vector3(1,1,0),objCam.localRotate);

        this.objCam = objCam;
        objCam.markDirty();
        state.finish=true;
    }

    private addCube(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate){
        let objCube = new gd3d.framework.transform();
        objCube.name = "Cube";
        this.scene.addChild(objCube);
        objCube.localScale.x=objCube.localScale.y=objCube.localScale.z=1;
        objCube.localTranslate=new gd3d.math.vector3(0,0,0);

        let mesh = objCube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        let smesh=this.app.getAssetMgr().getDefaultMesh("cube");
        mesh.mesh=smesh;

        let render = objCube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        let sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
        if(sh!=null){
            render.materials=[];
            render.materials.push(new gd3d.framework.material());
            render.materials[0].setShader(sh);
            let texture0=this.app.getAssetMgr().getAssetByName("zg256.png") as gd3d.framework.texture;
            render.materials[0].setTexture("_MainTex",texture0);
        }

        this.cube=objCube;
        this.cube.markDirty();
        state.finish=true;

    }

    start(app:gd3d.framework.application){
        this.app = app;
        this.scene=this.app.getScene();
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.addCam.bind(this));
        this.taskmgr.addTaskCall(this.addCube.bind(this));
    }

    update(delta:number){
        this.taskmgr.move(delta);
        this.time+=delta;

        if(this.objCam!=null){
            let cam = this.objCam.gameObject.transform;
            let yRoate=(this.time*30)%360;
            gd3d.math.quat2LookRotation(cam.getWorldTranslate(),new gd3d.math.vector3(0,0,0),new gd3d.math.vector3(Math.sin(yRoate*Math.PI/180),Math.cos(yRoate*Math.PI/180),0),cam.localRotate);
            cam.markDirty();
        }
        // if(this.cube!=null)
        // {
        //     let cubeTrans = this.cube.gameObject.transform;
        //     let yRoate=(this.time*30)%360;
        //     let yQuaternion = gd3d.math.pool.new_quaternion();

        //     gd3d.math.quatFromEulerAngles(0,yRoate,0,yQuaternion);
        //     cubeTrans.localRotate = yQuaternion;
        //     cubeTrans.markDirty();
        //     console.log(this.time);
        // }
    }
    
}