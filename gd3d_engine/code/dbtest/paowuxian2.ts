namespace dome
{
    export class paowuxian2 implements IState
    {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        assetmgr: gd3d.framework.assetMgr;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
        camera: gd3d.framework.camera;
        inputMgr: gd3d.framework.inputMgr;
        rooto2d: gd3d.framework.overlay2D;

        start(app: gd3d.framework.application) {
            this.app=app;
            this.scene=app.getScene();
            this.assetmgr=app.getAssetMgr();
            this.inputMgr = this.app.getInputMgr();


            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadmesh.bind(this));
            this.taskmgr.addTaskCall(this.gamePlay.bind(this));
        }        
        
        private pointDown = false;
        update(delta: number)
        {
            if (this.pointDown == false && this.inputMgr.point.touch == true)//pointdown
            {
                this.pickDown();
            }
            this.pointDown = this.inputMgr.point.touch;

            this.taskmgr.move(delta);
            CameraController.instance().update(delta);
            this.updateBullet(delta);
            this.updateUI();
        }

        private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    state.finish = true;
                }
            }
            );
        }

        private targets:gd3d.framework.transform[]=[];
        private loadmesh(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            var name="box";
            name="Map_Castle";
            this.app.getAssetMgr().load("res/prefabs/"+name+"/"+name+".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name+".prefab.json") as gd3d.framework.prefab;
                    let item= _prefab.getCloneTrans();
                    this.scene.addChild(item);

                    //---------------showbox
                    let showColider=(trans:gd3d.framework.transform)=>{
                        let collider=trans.gameObject.getComponent("boxcollider") as gd3d.framework.boxcollider;
                        if(collider!=null)
                        {
                            collider.colliderVisible=true;
                            this.targets.push(trans);
                        }
                        if(trans.children!=null)
                        {
                            for(let key in trans.children)
                            {
                                showColider(trans.children[key]);
                                // this.targets.push(trans.children[key]);
                            }
                        }
                    }
                    showColider(item);
                    state.finish = true;
                }
            });
        }
        private addcam(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            //添加一个摄像机
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new gd3d.math.vector3(0,0,-15);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            let controller=new CameraController();
            CameraController.instance().init(this.app,this.camera);
            state.finish = true;

        }

        pickDown():void{
            let v3  =  this.rayCollider();
            if(v3){
                console.warn("pick point:"+v3.hitposition.toString(),v3);
                this.target=this.addcube(v3.hitposition);
                this.fireBullet();
            }
        }

        private rayCollider():gd3d.framework.pickinfo{
            let inputMgr = this.app.getInputMgr();
            let ray = this.camera.creatRayByScreen(new gd3d.math.vector2(inputMgr.point.x, inputMgr.point.y), this.app);
            let temp  = gd3d.math.pool.new_pickInfo();
            //let bool = this.scene.pick(ray,temp,false,this.scene.getRoot(),this.pickLayer);
            let bool = this.scene.pick(ray,temp,false);
            return bool? temp: null;
        }

        addcube(pos:gd3d.math.vector3,scale:number=1):gd3d.framework.transform
        {
            let cube4=new gd3d.framework.transform();
            cube4.localScale=new gd3d.math.vector3(scale,scale,scale);
            gd3d.math.vec3Clone(pos,cube4.localPosition);
            this.scene.addChild(cube4);

            let meshf4=cube4.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            cube4.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            meshf4.mesh=this.assetmgr.getDefaultMesh("cube");
            return cube4;
        }

        private beLaunched:boolean=false;
        private time:number=0;
        /**
         * 设置泡弹跑的总时间
         */
        private totaltime:number=10;
        private fireBullet()
        {
            this.beLaunched=true;
            this.time=0;
        }

        private temptPos:gd3d.math.vector3=new gd3d.math.vector3();
        private updateBullet(delta:number)
        {
            if(this.beLaunched)
            {
                this.time+=delta;

                let lerp=this.time/this.totaltime;
                lerp= Math.min(lerp,1.0);
    
                this.lerp(this.paojia.localPosition,this.target.localPosition,lerp,this.temptPos);
                gd3d.math.vec3Clone(this.temptPos,this.paodan.localPosition);
                this.paodan.markDirty();
            }
        }

        private screenpos:gd3d.math.vector2=new gd3d.math.vector2();
        private updateUI()
        {
            if(this.beUIFollow&&this.paodan)
            {
               let pos=this.paodan.getWorldPosition();
               this.camera.calcScreenPosFromWorldPos(this.app,pos,this.screenpos);
               
               gd3d.math.vec2Clone(this.screenpos,this.testUI.localTranslate);
               this.testUI.markDirty();
            }
        }

        paojia:gd3d.framework.transform;
        paodan:gd3d.framework.transform;
        target:gd3d.framework.transform;
        beUIFollow:boolean=true;
        gamePlay(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            this.paojia=this.addcube(new gd3d.math.vector3());
            this.paodan=this.addcube(new gd3d.math.vector3(),0.2);

            this.addPaoDancam();

            this.addBtn("切换相机",60,500,()=>{
                this.cam2.visible=!this.cam2.visible;
                this.camera.gameObject.visible=!this.camera.gameObject.visible;
            });

            this.addBtn("UI跟随Paodan",60,700,()=>{
                this.beUIFollow=!this.beUIFollow;
                if(this.beUIFollow==false)
                {
                    this.testUI.localTranslate.x=0;
                    this.testUI.localTranslate.y=0;
                    this.testUI.markDirty();
                }
            });

            state.finish=true;
        }

        cam2: gd3d.framework.gameObject;
        camctr:camCtr;
        testUI:gd3d.framework.transform2D;
        addPaoDancam()
        {
            var objCam = new gd3d.framework.transform();
            this.cam2=objCam.gameObject;
            this.cam2.visible=false;
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            camera.near = 0.01;
            camera.far = 2000;
            camera.fov = Math.PI * 0.3;
            camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new gd3d.math.vector3(0,0,-15);
            objCam.markDirty();//标记为需要刷新
            this.camctr=objCam.gameObject.addComponent("camCtr") as camCtr;

            this.camctr.setTarget(this.paodan,new gd3d.math.vector3(0,0.5,0));
            this.camctr.setDistanceToTarget(5);
            this.camctr.setRotAngle(0,30);


            //2dUI root
            this.rooto2d = new gd3d.framework.overlay2D();
            this.camera.addOverLay(this.rooto2d);

            //raw png
            let raw_t2 = new gd3d.framework.transform2D;
            this.testUI=raw_t2;
            raw_t2.name = "滑动卷轴框png";
            raw_t2.width = 100 ;
            raw_t2.height = 100;
            let raw_i2 = raw_t2.addComponent("rawImage2D") as gd3d.framework.rawImage2D;
            raw_i2.image =this.assetmgr.getDefaultTexture("grid");
            this.rooto2d.addChild(raw_t2);
        }

        private addBtn(text: string,x:number,y:number,func:()=>void)
        {
            var btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () =>
            {
                func();
            }
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }

        private tempt:gd3d.math.vector3=new gd3d.math.vector3();
        /**
         * 
         * @param from 
         * @param to 
         * @param s 
         */
        private lerp(from:gd3d.math.vector3,to:gd3d.math.vector3,t:number,out:gd3d.math.vector3)
        {
            let dis=gd3d.math.vec3Distance(from,to);
            //----lerp
            let lerp=0.7;
            gd3d.math.vec3SLerp(from,to,lerp,this.tempt);
            //---------------up延伸
            // let upy=10;
            this.tempt.y+=dis*0.5;

            this.bessel(from,this.tempt,to,t,out);
        }

        private bessel(from:gd3d.math.vector3,middle:gd3d.math.vector3,to:gd3d.math.vector3,t:number,out:gd3d.math.vector3)
        {
            //out=from*(1-t)^2+middle*2t(1-t)+to*t^2

            let p1=Math.pow(1-t,2);
            let p2=2*t*(1-t);
            let p3=Math.pow(t,2);
            
            out.x=from.x*p1+middle.x*p2+to.x*p3;
            out.y=from.y*p1+middle.y*p2+to.y*p3;
            out.z=from.z*p1+middle.z*p2+to.z*p3;
        }
    }
}