

class test_heilongbo implements IState
{
    app:gd3d.framework.application;
    scene:gd3d.framework.scene;
    camera:gd3d.framework.camera;
    taskMgr:gd3d.framework.taskMgr=new gd3d.framework.taskMgr();
    keyframeanicomponet:gd3d.framework.keyframeanimation;
    keyframeanicomponet1:gd3d.framework.keyframeanimation;
    longtou:gd3d.framework.transform;

    start(app:gd3d.framework.application)
    {
        this.app=app;
        this.scene=this.app.getScene();

        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.loadTexture.bind(this));
        this.taskMgr.addTaskCall(this.loadkeyFrameAnimationPath.bind(this));
        this.taskMgr.addTaskCall(this.loadCube.bind(this));
        this.taskMgr.addTaskCall(this.loadasset.bind(this));
        this.taskMgr.addTaskCall(this.iniscene.bind(this));
        this.taskMgr.addTaskCall(this.addbtns.bind(this));
    }


    private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => 
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

    private loadCube(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/prefabs/Cube/Cube.assetbundle.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>
        {
            if(s.isfinish)
            {
                state.finish=true;
            }
        }
        );
    }


    private loadkeyFrameAnimationPath(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
        var number=0;
        number++;
        this.app.getAssetMgr().load("res/keyframeAnimation/hlb_lthr.keyFrameAnimationPath.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
            if (s.isfinish) 
            {
                number--;
                if(number==0)
                {
                    state.finish=true;      
                }
                    
            }            
        }); 
        
        number++;
        this.app.getAssetMgr().load("res/keyframeAnimation/Cube.keyFrameAnimationPath.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>
        {
            if(s.isfinish)
            {
                number--;
                if(number==0)
                {
                    state.finish=true;
                }
            }
         
        });
    }

    private loadasset(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/prefabs/hlb_lthr/hlb_lthr.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
            if (_state.isfinish) {
                state.finish = true;
            }
        }
        );
    }


    cube:gd3d.framework.transform;
    private iniscene(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
    {
        var cubeprefab=this.app.getAssetMgr().getAssetByName("Cube.prefab.json") as gd3d.framework.prefab;        
        let cube=cubeprefab.getCloneTrans();
        this.scene.addChild(cube);      
        this.cube=cube;

        //资源
        var longtouprefab=this.app.getAssetMgr().getAssetByName("hlb_lthr.prefab.json") as gd3d.framework.prefab;
        var keyframeanimationpath=this.app.getAssetMgr().getAssetByName("hlb_lthr.keyFrameAnimationPath.json") as gd3d.framework.keyframeAnimationPathAsset;
        var keyframeanimationpath1=this.app.getAssetMgr().getAssetByName("Cube.keyFrameAnimationPath.json") as gd3d.framework.keyframeAnimationPathAsset;
        
        let head=longtouprefab.getCloneTrans();
        head.localScale.x=head.localScale.y=head.localScale.z=1;
        head.localTranslate.x=head.localTranslate.y=head.localTranslate.z=0;         
        this.scene.addChild(head);
        this.longtou=head; 

        var objCam=new gd3d.framework.transform();
        objCam.name="keyframeAni Cam";
        this.scene.addChild(objCam);
        this.camera=objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.order=0;
        this.camera.near=0.01;
        this.camera.far=1000;
        this.camera.fov=60;
        objCam.localTranslate=new gd3d.math.vector3(0,8,1);
        objCam.lookatPoint(new gd3d.math.vector3(0,0,0)); 
        objCam.markDirty();

        var keyframeani=this.longtou.gameObject.addComponent("keyframeanimation") as gd3d.framework.keyframeanimation;     
        keyframeani.setkeyframeanimationasst(keyframeanimationpath);
        this.keyframeanicomponet=keyframeani;

        var keyframeani1=this.cube.gameObject.addComponent("keyframeanimation") as gd3d.framework.keyframeanimation;
        keyframeani1.setkeyframeanimationasst(keyframeanimationpath1);
        this.keyframeanicomponet1=keyframeani1;
        // for(var key in keyframeani.pathdata)
        // {
        //     console.log(key);
        // }        
        state.finish=true;
    }

   

    private addbtns()
    {
        this.addbtn("play",10,100,()=>{
            this.longtou.gameObject.visible=true;
            this.keyframeanicomponet.play();       
            this.keyframeanicomponet1.play();     
        });

        this.addbtn("stop",10,200,()=>{
            this.longtou.gameObject.visible=true;
            this.keyframeanicomponet.stop();
            this.keyframeanicomponet1.stop();
        });

        this.addbtn("replay",10,300,()=>
        {
            this.longtou.gameObject.visible=true;
            this.keyframeanicomponet.replay();
            this.keyframeanicomponet1.replay();
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
        if(this.cube!=null && this.keyframeanicomponet1.isactived)
        {
            console.log(this.cube.localTranslate);
        }
       
    }    
}