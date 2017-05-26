class test_effect_1 implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    timer: number = 0;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    effect: gd3d.framework.effectSystem;
    label: HTMLLabelElement;

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
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.label = document.createElement("label");
        this.label.textContent = "剩余life:";
        this.label.style.top = "60px";
        this.label.style.position = "absolute";
        this.label.style.color = "#ff0000";
        this.app.container.appendChild(this.label);

        var btnPlay = document.createElement("button");
        btnPlay.textContent = "播放";
        btnPlay.onclick = () =>
        {
            if (this.effect != null)
                this.effect.play();
        }
        btnPlay.style.top = "120px";
        btnPlay.style.position = "absolute";
        this.app.container.appendChild(btnPlay);
        var btnPause = document.createElement("button");
        btnPause.textContent = "暂停";
        btnPause.onclick = () =>
        {
            if (this.effect != null)
                this.effect.pause();
        }
        btnPause.style.top = "180px";
        btnPause.style.position = "absolute";
        this.app.container.appendChild(btnPause);

        var btnStop = document.createElement("button");
        btnStop.textContent = "停止";
        btnStop.onclick = () =>
        {
            if (this.effect != null)
                this.effect.stop();
        }
        btnStop.style.top = "240px";
        btnStop.style.position = "absolute";
        this.app.container.appendChild(btnStop);


        var btnDispose = document.createElement("button");
        btnDispose.textContent = "销毁";
        btnDispose.onclick = () =>
        {
            if (this.effect != null)
                this.effect.gameObject.transform.dispose();
            this.effect = null;
        }
        btnDispose.style.top = "300px";
        btnDispose.style.position = "absolute";
        this.app.container.appendChild(btnDispose);
        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        this.taskmgr.addTaskCall(this.loadRole.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));
        this.taskmgr.addTaskCall(this.loadScene.bind(this));

    }
    private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                state.finish = true;
            }
        }
        );
    }
    private role = new gd3d.framework.transform();
    private loadRole(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        this.role.name = "role";
        this.app.getAssetMgr().load("res/prefabs/dingji_m_zs/dingji_m_zs.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName("dingji_m_zs.prefab.json") as gd3d.framework.prefab;
                this.role = _prefab.getCloneTrans();
                this.scene.addChild(this.role);
                this.role.localScale = new gd3d.math.vector3(1, 1, 1);
                this.role.localTranslate = new gd3d.math.vector3(29.48158, 27.01, 25.16527);
                this.role.gameObject.visible = false;
                this.role.markDirty();
                this.role.updateWorldTran();
                if (this.camera != null)
                {
                    var objCam = this.camera.gameObject.transform;
                    objCam.lookatPoint(new gd3d.math.vector3(29.48158, 27.01, 25.16527));
                    objCam.markDirty();
                    objCam.updateWorldTran();
                }
                state.finish = true;
            }
        });
    }

    private loadEffect(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {
        // this._loadEffect("res/particleEffect/hjxnew/hjxnew.assetbundle.json", "hjxnew");//
        // this._loadEffect("res/particleEffect/particle/particle.assetbundle.json", "particle.effect.json");//
        this.app.getAssetMgr().load("res/particleEffect/particle_billboard/particle_billboard.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                let tr = new gd3d.framework.transform();
                this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName("particle_billboard.effect.json") as gd3d.framework.textasset;
                this.effect.setEffect(text.content);
                this.scene.addChild(tr);
                tr.markDirty();
                state.finish = true;
            }
        }
        );

    }
    _loadEffect(assetbundleName: string, name: string)
    {
        this.app.getAssetMgr().load(assetbundleName, gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                let tr = new gd3d.framework.transform();
                this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName(name) as gd3d.framework.textasset;
                this.effect.setEffect(text.content);
                this.scene.addChild(tr);
                tr.markDirty();
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
        this.camera.far = 50;
        this.camera.fov = Math.PI * 0.3;
        // this.camera.backgroundColor = new gd3d.math.color(0.2, 0.2, 0.2, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 5, -5);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        state.finish = true;
    }

    private loadScene(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                this.app.getAssetMgr().load("res/scenes/10102_Training_s/10102_Training_s.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        if (s.isfinish) 
                        {
                            this.app.getAssetMgr().loadScene("10102_Training_s.scene.json", () =>
                            {
                                var _scene: gd3d.framework.rawscene = this.app.getAssetMgr().getAssetByName("10102_Training_s.scene.json") as gd3d.framework.rawscene;
                                var _root = _scene.getSceneRoot();
                                this.scene.addChild(_root);
                                _root.localTranslate = new gd3d.math.vector3(0, 0, 0);
                                this.app.getScene().lightmaps = [];
                                _scene.useLightMap(this.app.getScene());
                                state.finish = true;
                            });
                        }
                    });
            }
        });
    }
    beclone = false;
    update(delta: number)
    {
        this.taskmgr.move(delta);
        this.timer += delta;
        if (this.camera)
        {
            var x = Math.sin(this.timer * 0.5);
            var z = Math.cos(this.timer * 0.5);
            // var x2 = Math.sin(this.timer * 1.1);
            // var z2 = Math.cos(this.timer * 1.1);
            let objCam = this.camera.gameObject.transform;
            // objCam.localTranslate = new gd3d.math.vector3(x * 5, 5, -z * 5);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            objCam.updateWorldTran();
        }
        if (this.effect != null)
        {
            if(this.timer > 5 && !this.beclone)
            {
                this.beclone = true;
                let newtran = this.effect.gameObject.transform.clone();
                newtran.localTranslate = new gd3d.math.vector3(3, 0, 0);
                newtran.markDirty();
                this.scene.addChild(newtran);
            }
            if (this.effect.state == gd3d.framework.EffectPlayStateEnum.Play || this.effect.state == gd3d.framework.EffectPlayStateEnum.Pause)
                this.label.textContent = this.effect.leftLifeTime >= 0 ? "剩余life:" + this.effect.leftLifeTime : "剩余life:0";
            else
                this.label.textContent = "剩余life:0";
        } else
            this.label.textContent = "剩余life:0";
    }
}