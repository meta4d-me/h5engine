
class test_keyFrameAni implements IState
{
    app:gd3d.framework.application;
    scene:gd3d.framework.scene;
    camera:gd3d.framework.camera;
    taskMgr:gd3d.framework.taskMgr=new gd3d.framework.taskMgr();
    keyframeanicomponet:gd3d.framework.keyframeanimation;
    longtou:gd3d.framework.transform;

    start(app:gd3d.framework.application)
    {
        this.app=app;
        this.scene=this.app.getScene();

        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.loadasset.bind(this));
        this.taskMgr.addTaskCall(this.iniscene.bind(this));
        this.taskMgr.addTaskCall(this.addbtns.bind(this));
    }


    private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => 
        {
            if (_state.isfinish) 
            {
                state.finish = true;
            }
        }
        );
    }

    private loadasset(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/keyframeAnimation/Cube/Cube.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
            if (_state.isfinish) {
                state.finish = true;
            }
        }
        );
    }

    private iniscene(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {

        //资源
        var cubePrefab=this.app.getAssetMgr().getAssetByName("Cube.prefab.json") as gd3d.framework.prefab;
        let head=cubePrefab.getCloneTrans();
         
        this.scene.addChild(head);

        var objCam=new gd3d.framework.transform();
        objCam.name="keyframeAni Cam";
        this.scene.addChild(objCam);
        this.camera=objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.order=0;
        this.camera.near=0.3;
        this.camera.far=1000;
        this.camera.fov=60;
        objCam.localTranslate=new gd3d.math.vector3(0,3,0);
        objCam.lookatPoint(new gd3d.math.vector3(0,0,0)); 
        objCam.markDirty();

        state.finish=true;
    }

    private addbtns()
    {
        this.addbtn("play",10,100,()=>{
                 
        });

        this.addbtn("stop",10,200,()=>{
            
        });

        this.addbtn("replay",10,300,()=>
        {
            
        });


        var input=document.createElement("input");
        input.type="range";
        input.valueAsNumber=50;
        this.longtou.localTranslate.x=input.valueAsNumber-50;
        input.oninput=(e) =>
        {
            this.longtou.localTranslate.x=input.valueAsNumber-50;
            this.longtou.markDirty();
            console.log(input.valueAsNumber);
        };
        input.style.top="400px";
        input.style.left="10px";
        input.style.position="absolute";
        this.app.container.appendChild(input);
    }

    private addbtn(text:string,x:number,y:number,func:()=>void)
    {
        var btn=document.createElement("button");
        btn.textContent=text;
        btn.onclick=()=>
        {
            func();
        }
        btn.style.top=y+"px";
        btn.style.left=x+"px";
        btn.style.position="absolute";
        this.app.container.appendChild(btn);
    }    


    update(delta:number)
    {
        this.taskMgr.move(delta);
          
    }    
}