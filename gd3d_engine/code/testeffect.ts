class test_effect implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    timer: number = 0;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    effect: gd3d.framework.effectSystem;
    label: HTMLLabelElement;

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
    private loadText(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {
        this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                state.finish = true;
            }
            else
            {
                state.error = true;
            }
        }
        );
    }
    private addcube(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        //添加一个盒子
        {
            //添加一个盒子
            {
                let cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localTranslate.x = 0;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as gd3d.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);

                }
            }
        }
        state.finish = true;
    }

    private dragon: gd3d.framework.transform;
    private loadModel(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/fx_shuijing_cj/fx_shuijing_cj.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                    (_s) =>
                    {
                        if (_s.isfinish)
                        {
                            let _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName("fx_shuijing_cj.prefab.json") as gd3d.framework.prefab;
                            this.dragon = _prefab.getCloneTrans();
                            this.scene.addChild(this.dragon);
                            state.finish = true;
                        }
                    });
            }
        });

    }
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        // this.taskmgr.addTaskCall(this.addcube.bind(this));
        // this.taskmgr.addTaskCall(this.loadModel.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));

    }


    private loadEffect(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {
        // this._loadEffect("res/particleEffect/hjxnew/hjxnew.assetbundle.json", "hjxnew");//
        // this._loadEffect("res/particleEffect/particle/particle.assetbundle.json", "particle.effect.json");//
        //fx_0005_sword_sword
        let names: string[] = ["fx_0005_sword_sword", "fx_fs_female@attack_02", "fx_0005_sword_sword", "fx_0005_sword_sword"];
        let name = names[2];
        this.app.getAssetMgr().load("res/particleEffect/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                this.tr = new gd3d.framework.transform();
                this.effect = this.tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName(name + ".effect.json") as gd3d.framework.textasset;
                this.effect.setJsonData(text);
                // this.scene.addChild(this.tr);
                this.tr.markDirty();
                state.finish = true;
                this.effectloaded = true;
            }
        }
        );

    }

    private addcam(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {
        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 200;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 0, 10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        state.finish = true;
    }

    tr:gd3d.framework.transform;
    ttr:gd3d.framework.transform;
    eff:gd3d.framework.effectSystem;
    beclone = false;
    effectloaded = false;
    bestop = false;
    bereplay = false;
    update(delta: number)
    {
        this.taskmgr.move(delta);
        if(this.effectloaded)
        {
            this.timer += delta;
            if(this.timer > 1 && !this.beclone)
            {
                this.beclone = true;
                this.ttr = this.tr.clone(); 
                this.eff = this.ttr.gameObject.getComponent("effectSystem") as gd3d.framework.effectSystem;
                this.scene.addChild(this.ttr);
            }
            // if(this.timer > 3 && !this.bestop)
            // {
            //     this.bestop = true;
            //     this.eff.stop();
            // }

            // if(this.timer > 6 && !this.bereplay)
            // {
            //     this.bereplay = true;
            //     this.eff.play();
            // }
        }
    }
}