
class test_keyframeAnimation implements IState
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
        this.taskMgr.addTaskCall(this.loadTexture.bind(this));
        this.taskMgr.addTaskCall(this.loadkeyFrameAnimationPath.bind(this));
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

    private loadTexture(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
        var texnumber:number=2;
        this.app.getAssetMgr().load("res/rock256.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                texnumber--;
                if(texnumber==0)
                {
                    state.finish = true;
                }
            }
            else {
                state.error = true;
            }
        }
        );
        this.app.getAssetMgr().load("res/sd_hlb_1.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                texnumber--;
                if(texnumber==0)
                {
                    state.finish = true;
                }
            }
            else {
                state.error = true;
            }
        }
        );
    }


    private loadkeyFrameAnimationPath(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
       // this.app.getAssetMgr().load("res/path/circlepath.path.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
        this.app.getAssetMgr().load("res/keyframeAnimation/Cube.keyFrameAnimationPath.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
            if (s.isfinish) 
            {
                state.finish=true;      
            }
            else {
                state.error = true;
            }
        });     
    }

    private loadasset(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/prefabs/rotatedLongTou/rotatedLongTou.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
            if (_state.isfinish) {
                state.finish = true;
            }
        }
        );
    }

    private iniscene(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
       

        //背景
        // var mat=t.DBgetMat("rock256.png");
        // var trans=t.DBgetAtrans(mat);
        // this.scene.addChild(trans);
        // trans.localScale.x=trans.localScale.z=40;
        // trans.localScale.y=0.1;
        // trans.localTranslate.y=-1;
        // trans.markDirty();

        //资源
        var longtouprefab=this.app.getAssetMgr().getAssetByName("rotatedLongTou.prefab.json") as gd3d.framework.prefab;
        var keyframeanimationpath=this.app.getAssetMgr().getAssetByName("Cube.keyFrameAnimationPath.json") as gd3d.framework.keyframeAnimationPathAsset;
        
        let head=longtouprefab.getCloneTrans();
        head.localScale.x=head.localScale.y=head.localScale.z=10;
        head.localTranslate.x=head.localTranslate.y=head.localTranslate.z=0;
         
        this.scene.addChild(head);
        this.longtou=head; 

        // cube
        var cube=new gd3d.framework.transform();
        cube.name="cube1";
        cube.localTranslate.x=4;
        //cube.localScale.x=cube.localScale.y=cube.localScale.z=1;
        //cube.parent=head;
        this.scene.addChild(cube);

        var meshfiter=cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        var mesh=this.app.getAssetMgr().getDefaultMesh("cube");
        meshfiter.mesh= mesh;
        var meshrender=cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;    
        cube.markDirty();      

        var objCam=new gd3d.framework.transform();
        objCam.name="keyframeAni Cam";
        this.scene.addChild(objCam);
        this.camera=objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.order=0;
        this.camera.near=0.3;
        this.camera.far=1000;
        this.camera.fov=60;
        objCam.localTranslate=new gd3d.math.vector3(-5,10,3);
        objCam.lookatPoint(new gd3d.math.vector3(0,0,0)); 
        objCam.markDirty();

        var keyframeani=head.gameObject.addComponent("keyframeanimation") as gd3d.framework.keyframeanimation;     
        keyframeani.setkeyframeanimationasst(keyframeanimationpath);
        this.keyframeanicomponet=keyframeani;

        state.finish=true;
    }

    private addbtns()
    {
        this.addbtn("play",10,100,()=>{
            this.longtou.gameObject.visible=true;
            this.keyframeanicomponet.play();            
        });

        this.addbtn("stop",10,200,()=>{
            this.longtou.gameObject.visible=false;
            this.keyframeanicomponet.stop();
        });

        this.addbtn("replay",10,300,()=>
        {
            this.longtou.gameObject.visible=true;
            this.keyframeanicomponet.replay();
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
        // if(this.keyframeanicomponet!=null)
        // {
        //     console.log(this.keyframeanicomponet.playingtime);

        //     if(this.longtou!=null&& this.keyframeanicomponet.isactived)
        //     {
        //         console.log("longtou translate: "+this.longtou.localTranslate);
        //     }
        // }       
    }    
}