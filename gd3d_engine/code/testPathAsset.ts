namespace t {
    export class test_pathAsset implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        start(app: gd3d.framework.application) {
            this.app = app;
            this.scene = this.app.getScene();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.loadpath.bind(this));
            this.taskmgr.addTaskCall(this.loadasset.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
        }
        private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
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

        private loadpath(laststate:gd3d.framework.taskstate,state:gd3d.framework.taskstate)
        {
           var pathnumber:number=2;
            this.app.getAssetMgr().load("res/path/circlepath.path.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                if (s.isfinish) {
                    pathnumber--;
                    if(pathnumber==0)
                    {
                        state.finish = true;                        
                    }
                }
                else {
                    state.error = true;
                }
            });
                 this.app.getAssetMgr().load("res/path/circlepath_2.path.json",gd3d.framework.AssetTypeEnum.Auto,(s)=>{
                if (s.isfinish) {
                    pathnumber--;
                    if(pathnumber==0)
                    {
                        state.finish = true;                        
                    }
                }
                else {
                    state.error = true;
                }
            })
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
        sh: gd3d.framework.shader;
        private initscene(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "cam_show";
            this.scene.addChild(objCam);
            this.showcamera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.showcamera.order = 0;
            this.showcamera.near = 0.01;
            this.showcamera.far = 1000;
            objCam.localTranslate = new gd3d.math.vector3(0, 50, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            {
                var longtouprefab=this.app.getAssetMgr().getAssetByName("rotatedLongTou.prefab.json")as gd3d.framework.prefab;
                for(var i=0;i<4;i++)
                {
                    var parent=new gd3d.framework.transform();
                    parent.gameObject.visible=false;
                    this.scene.addChild(parent);
                    this.parentlist.push(parent);
                    
                    //------------------龙头----------------------------
                    let head=longtouprefab.getCloneTrans();
                    head.localScale.x=head.localScale.y=head.localScale.z=4;
                    parent.addChild(head);
                    this.dragonlist.push(head);

                    //-----------------挂拖尾---------------------------------
                    var trans=new gd3d.framework.transform();
                    head.addChild(trans);
                    var trailmat=new gd3d.framework.material();
                    //transparent_bothside.shader.json
                    //particles_blend.shader.json
                    var shader=this.app.getAssetMgr().getShader("transparent_bothside.shader.json");

                    var tex1=this.app.getAssetMgr().getAssetByName("sd_hlb_1.png")as gd3d.framework.texture;
                    trailmat.setShader(shader);
                    trailmat.setTexture("_MainTex",tex1);
                    this.trailrender=trans.gameObject.addComponent("trailRender")as gd3d.framework.trailRender;
                    this.trailrender.material=trailmat;
                    this.trailrender.setWidth(1.0);
                    this.trailrender.lookAtCamera=true;
                    this.trailrender.extenedOneSide=false;
                    this.trailrender.setspeed(0.25);
                    this.trailrender.play();
                }
            }
            var path=this.app.getAssetMgr().getAssetByName("circlepath.path.json")as gd3d.framework.pathasset;
            var path2=this.app.getAssetMgr().getAssetByName("circlepath_2.path.json")as gd3d.framework.pathasset;

            {
                this.parentlist[0].gameObject.visible=true;
                var guidp=this.dragonlist[0].gameObject.addComponent("guidpath")as gd3d.framework.guidpath;
                guidp.setpathasset(path2,50);
                guidp.setActive();
                guidp.isloop=true;
            }
            {
                this.parentlist[1].gameObject.visible=true;
                this.parentlist[1].localTranslate.x=-5;
                this.parentlist[1].markDirty();
                var guidp=this.dragonlist[1].gameObject.addComponent("guidpath")as gd3d.framework.guidpath;
                guidp.setpathasset(path,50);
                guidp.setActive();
                guidp.isloop=true;
            }
            {
                this.parentlist[2].gameObject.visible=true;
                gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up,180,this.parentlist[2].localRotate);
                this.parentlist[2].markDirty();
                var guidp=this.dragonlist[2].gameObject.addComponent("guidpath")as gd3d.framework.guidpath;
                guidp.setpathasset(path2,50);
                guidp.setActive();
                guidp.isloop=true;
            }
            state.finish = true;
        }
        private parentlist:gd3d.framework.transform[]=[];

        private dragonlist:gd3d.framework.transform[]=[];
        private trailrender:gd3d.framework.trailRender;
        private path:gd3d.framework.pathasset;
        private showcamera: gd3d.framework.camera;

        target: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
        angle: number;
        timer: number=0;
        update(delta: number) {
            this.taskmgr.move(delta);

        }
    }
}