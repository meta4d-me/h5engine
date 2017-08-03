class test_loadprefab implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    renderer: gd3d.framework.meshRenderer[];
    skinRenders: gd3d.framework.skinnedMeshRenderer[];
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        let names: string[] = ["elong", "0060_duyanshou", "Cube", "0001_fashion", "193_meirenyu"];
        let name = names[0];
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if(state.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/" + name + "/meshprefab/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, 
                (s) => 
                {
                    if(s.isfinish)
                    {
                        var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as gd3d.framework.prefab;
                        this.baihu = _prefab.getCloneTrans();
                        this.scene.addChild(this.baihu);
                        // this.baihu.localScale = new gd3d.math.vector3(50, 50, 50);
                        this.baihu.localTranslate = new gd3d.math.vector3(0, 0, 0);
                        this.baihu.localEulerAngles = new gd3d.math.vector3(0, 180, 0);

                        objCam.localTranslate = new gd3d.math.vector3(0, 20, -10);
                        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                        objCam.markDirty();

                        this.app.getAssetMgr().load("res/prefabs/" + name + "/textures/" + name + "texture.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                        (s) => 
                        {
                            if(s.isfinish)
                            {
                                let meshrenderer = this.baihu.gameObject.getComponentsInChildren("meshRenderer") as gd3d.framework.meshRenderer[];
                                let skinnmeshrenderer = this.baihu.gameObject.getComponentsInChildren("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer[];
                                for(let i=0; i<meshrenderer.length; i++)
                                {
                                    let v = meshrenderer[i];
                                    for(let j=0; j<v.materials.length; j++)
                                    {
                                        for(let k in v.materials[j].mapUniform)
                                        {
                                            if(v.materials[j].mapUniform[k].type == gd3d.render.UniformTypeEnum.Texture)
                                            {
                                                let textur = this.app.getAssetMgr().getAssetByName(v.materials[j].mapUniform[k].resname) as gd3d.framework.texture;
                                                v.materials[j].setTexture(k, textur);
                                            }
                                        }
                                        
                                    }
                                }
                                for(let i=0; i<skinnmeshrenderer.length; i++)
                                {
                                    let v = skinnmeshrenderer[i];
                                    for(let j=0; j<v.materials.length; j++)
                                    {
                                        for(let k in v.materials[j].mapUniform)
                                        {
                                            if(v.materials[j].mapUniform[k].type == gd3d.render.UniformTypeEnum.Texture)
                                            {
                                                let textur = this.app.getAssetMgr().getAssetByName(v.materials[j].mapUniform[k].resname) as gd3d.framework.texture;
                                                v.materials[j].setTexture(k, textur);
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        });
                        this.app.getAssetMgr().load("res/prefabs/" + name + "/aniclip/" + name + "aniclip.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                        (s) => 
                        {
                            if(s.isfinish)
                            {
                                
                                let anipalyer = this.baihu.gameObject.getComponentsInChildren("aniplayer") as gd3d.framework.aniplayer[];
                                for(let i=0; i<anipalyer.length; i++)
                                {
                                    for(let j=0; j<anipalyer[i].clips.length; j++)
                                    {
                                        let v = anipalyer[i].clips[j];
                                        anipalyer[i].clips[j] = this.app.getAssetMgr().getAssetByName(v.getName()) as gd3d.framework.animationClip;
                                    }
                                    
                                    anipalyer[i].playByIndex(0);
                                }
                            }
                        });
                    }
                });
            }
        });
        // name="Wing_11";
        // this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        // {
        //     if (state.isfinish)
        //     {
        //         this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
        //             (s) =>
        //             {
        //                 console.log(s.curtask + "/" + s.totaltask);
        //                 console.log(s.curByteLength+"/"+s.totalByteLength);
        //                 if (s.isfinish)
        //                 {
        //                     var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as gd3d.framework.prefab;
        //                     this.baihu = _prefab.getCloneTrans();
        //                     this.scene.addChild(this.baihu);
        //                     // this.baihu.localScale = new gd3d.math.vector3(50, 50, 50);
        //                     this.baihu.localTranslate = new gd3d.math.vector3(0, 0, 0);
        //                     this.baihu.localEulerAngles = new gd3d.math.vector3(0, 180, 0);

        //                     // this.baihu.localEulerAngles = new gd3d.math.vector3();
        //                     this.baihu = _prefab.getCloneTrans();
        //                     objCam.localTranslate = new gd3d.math.vector3(0, 20, -10);
        //                     objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //                     objCam.markDirty();
        //                     this.renderer = this.baihu.gameObject.getComponentsInChildren("meshRenderer") as gd3d.framework.meshRenderer[];
        //                     this.skinRenders = this.baihu.gameObject.getComponentsInChildren(gd3d.framework.StringUtil.COMPONENT_SKINMESHRENDER) as gd3d.framework.skinnedMeshRenderer[];
        //                     // this.changeShader();
        //                     // for(let i=0; i<22; i++)
        //                     // {
        //                     //     for(let j=0; j<22; j++)
        //                     //     {
        //                     //         let bp = _prefab.getCloneTrans();
        //                     //         bp.localTranslate = new gd3d.math.vector3(i - 11, 0, j - 11);
        //                     //         bp.markDirty();
        //                     //         this.scene.addChild(bp);
        //                     //     }
        //                     // }
        //                 }
        //             });
        //     }
        // });


        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new gd3d.math.color(0.11, 0.11, 0.11, 1.0);
        // objCam.localTranslate = new gd3d.math.vector3(0, 0, -30);
        objCam.markDirty();//标记为需要刷新

    }

    private changeShader()
    {
        var btn = document.createElement("button");
        btn.textContent = "切换Shader到：diffuse.shader.json";
        btn.onclick = () =>
        {
            var sh = this.app.getAssetMgr().getShader("diffuse.shader.json") as gd3d.framework.shader;
            this.change(sh);
        }
        btn.style.top = "160px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);

        var btn2 = document.createElement("button"); 
        btn2.textContent = "切换Shader到：additive_alpha.shader.json";
        btn2.onclick = () =>
        {
            var sh = this.app.getAssetMgr().getShader("additive_alpha.shader.json") as gd3d.framework.shader;
            this.change(sh);
        }
        btn2.style.top = "124px";
        btn2.style.position = "absolute";
        this.app.container.appendChild(btn2);
    }

    change(sha: gd3d.framework.shader)
    {
        for (let j = 0; j < this.renderer.length; j++)
        {
            for (let i = 0; i < this.renderer[j].materials.length; i++)
            {
                this.renderer[j].materials[i].changeShader(sha);
                // this.renderer[j].materials[i].setVector4("_TintColor", new gd3d.math.vector4(0,1,0,1));
            }
        }
        for (let j = 0; j < this.skinRenders.length; j++)
        {
            for (let i = 0; i < this.skinRenders[j].materials.length; i++)
            {
                this.skinRenders[j].materials[i].changeShader(sha);
                // this.renderer[j].materials[i].setVector4("_TintColor", new gd3d.math.vector4(0,1,0,1));
            }
        }
    }
    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        if (this.baihu)
        {
            objCam.lookat(this.baihu);
            objCam.markDirty();//标记为需要刷新
        }
    }
}