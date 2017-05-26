class test_effect implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    parts: gd3d.framework.transform;
    timer: number = 0;
    cube2: gd3d.framework.transform;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    count: number = 0;
    counttimer: number = 0;

    private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            state.finish = true;
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

        this.app.getAssetMgr().load("res/fire.png", gd3d.framework.AssetTypeEnum.Auto, (s) => 
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
    private fileList: string[] = [];
    private effectListBoxs: lighttool.htmlui.listBox;
    private functionArea: HTMLDivElement;
    private currentEffectNameList: { [name: string]: string };

    private loadEffect(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {

        this.effectParentTransform.name = "bezier";
        this.scene.addChild(this.effectParentTransform);
        // this._loadEffect("res/particleEffect/bezier/bezier.effect.json", "bezier.effect.json");
        this._loadEffect("res/particleEffect/fx_shuijing_cj/fx_shuijing_cj.effect.json", "fx_shuijing_cj.effect.json");


        let drawArea: HTMLDivElement = document.getElementById("drawarea") as HTMLDivElement;
        drawArea.style.height = "80%";

        let effectListArea: HTMLDivElement = document.getElementById("effectlist") as HTMLDivElement;
        effectListArea.hidden = false;

        for (let i = 0; i < effectListArea.children.length; i++) 
        {

            if (effectListArea.children[i] instanceof HTMLImageElement) 
            {
                effectListArea.removeChild(effectListArea.children[i]);
            }
        }

        this.functionArea = document.getElementById("effectmgr") as HTMLDivElement;
        this.functionArea.hidden = false;


        lighttool.htmlui.panelMgr.instance().init(document.getElementById("effectlist") as HTMLDivElement);

        let textPanel = lighttool.htmlui.panelMgr.instance().createPanel("");
        this.effectListBoxs = new lighttool.htmlui.listBox(textPanel);
        this.effectListBoxs.txtArea.style.backgroundColor = "#6666ff";
        this.effectListBoxs.txtArea.style.maxHeight = "20%";

        var list = localsave.list("proj_sample/scene_test/res/particleeffect");
        for (var i in list["subpath"])
        {
            var strpath = list["subpath"][i].name;
            console.log("strpath: " + strpath);
            this.fileList.push(strpath);
            this.effectListBoxs.addLine(strpath);
        }

        this.effectListBoxs.onSelectItem = (name: string) =>
        {
            if (this.effectParentTransform.name != name)
            {
                console.log("name: " + name + "----------par: " + this.effectParentTransform.name);
                this.effectParentTransform.name = name;
                this.scene.addChild(this.effectParentTransform);
                this._loadEffect("res/particleEffect/" + name + "/" + name + ".effect.json", name + ".effect.json");
                this.addEffectToPlayList(name);
            }
        };

        this.setFunctionArea();

        state.finish = true;
    }

    private currentDiv: HTMLDivElement;
    private addEffectToPlayList(filename: string)
    {
        this.currentDiv = document.getElementById("currenteffect") as HTMLDivElement;
        var btn = document.createElement("button");
        btn.textContent = filename;
        this.currentDiv.appendChild(btn);
        btn.onclick = () =>
        {
            this.currentDiv.removeChild(btn);
        }
    }

    private currentOpValue: number;
    private setFunctionArea()
    {
        // lighttool.htmlui.panelMgr.instance().init(document.getElementById("effectmgr") as HTMLDivElement);
        /**播放多个粒子 */
        let particleNum = document.getElementById("particlenum") as HTMLInputElement;

        let index = this.particleUrl.lastIndexOf("/");
        let lastEffectUrl = this.particleUrl.substr(index + 1);
        let loadBtn = document.getElementById("load") as HTMLButtonElement;
        loadBtn.onclick = () =>
        {
            let number = Number(particleNum.value);
            this.effectParentTransform = new gd3d.framework.transform();
            for (let i = 0; i < number; i++)
            {

                // this.app.getAssetMgr().load(this.particleUrl, gd3d.framework.AssetTypeEnum.Effect, (state) =>
                // {
                //     if (state.isfinish)
                //     {
                //         // var effect = state.resstate["start.effect.json"].res as gd3d.framework.Effect;
                //         let effect = this.app.getAssetMgr().getAssetByName(lastEffectUrl) as gd3d.framework.Effect;
                //         let curEffectTrans = effect.clonetotran(this.camera);
                //         this.scene.addChild(this.effectParentTransform);
                //         this.effectParentTransform.addChild(curEffectTrans);
                //         this.effectParentTransform.markDirty();
                //     }
                // });

            }
        }


        let playBtn = document.getElementById("play") as HTMLButtonElement;
        playBtn.onclick = () =>
        {

            // this.addEffectToPlayList(name, effect);
        }

        let clearBtn = document.getElementById("clear") as HTMLButtonElement;
        clearBtn.onclick = () =>
        {
            if (this.effectParentTransform.parent)
            {
                for (let i = 0; i < this.effectParentTransform.children.length; i++) 
                {
                    this.effectParentTransform.removeChild(this.effectParentTransform.children[i]);
                }
                // this.effectParentTransform = null;
            }

            for (let c = this.currentDiv.children.length - 1; c >= 0; c--)
            {
                if (this.currentDiv.children[c] instanceof HTMLButtonElement)
                {
                    this.currentDiv.removeChild(this.currentDiv.children[c]);
                }
            }
        }

        let cameraBtn = document.getElementById("camera") as HTMLButtonElement;
        cameraBtn.onclick = () =>
        {
            if (this.camera.opvalue != 0)
            {
                this.currentOpValue = this.camera.opvalue;
            }

            this.camera.opvalue = (this.camera.opvalue != 0) ? 0 : this.currentOpValue;
        }

        let showUIBtn = document.getElementById("showui") as HTMLButtonElement;
        showUIBtn.onclick = () =>
        {

        }

        let showRole = document.getElementById("showrole") as HTMLButtonElement;
        showRole.onclick = () =>
        {

        }
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
        this.camera.backgroundColor = new gd3d.math.color(0.2, 0.2, 0.2, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 3, -8);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新

        // var lighttran = new gd3d.framework.transform();
        // this.scene.addChild(lighttran);
        // var light = lighttran.gameObject.addComponent("light");
        // lighttran.localTranslate.x = 5;
        // lighttran.localTranslate.y = 5;
        // lighttran.markDirty();

        state.finish = true;

    }
    private addcube(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {

        //添加一个盒子
        {
            //添加一个盒子
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                cube.localTranslate.x = -1;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("transparent-diffuse.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    let texture = this.app.getAssetMgr().getAssetByName("fire.png") as gd3d.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);

                }
                this.cube = cube;
            }
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                cube.localTranslate.x = 3;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("effect_uvroll.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as gd3d.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);

                }
                this.cube2 = cube;
            }
            state.finish = true;
        }
    }
    private effectParentTransform: gd3d.framework.transform = new gd3d.framework.transform();
    private curEffectTrans: gd3d.framework.transform = new gd3d.framework.transform();

    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        this.scene.addChild(this.effectParentTransform);
        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        //this.taskmgr.addTaskCall(this.addcube.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));
    }

    private particleUrl: string;
    _loadEffect(fullName: string, name: string)
    {
        this.particleUrl = fullName;
        // this.app.getAssetMgr().load(fullName, gd3d.framework.AssetTypeEnum.Effect, (state) =>
        // {
        //     if (state.isfinish)
        //     {
        //         // var effect = state.resstate["start.effect.json"].res as gd3d.framework.Effect;
        //         var effect = this.app.getAssetMgr().getAssetByName(name) as gd3d.framework.Effect;
        //         if (this.curEffectTrans.parent)
        //         {
        //             this.curEffectTrans.parent.removeChild(this.curEffectTrans);
        //         }
        //         this.curEffectTrans = effect.clonetotran(this.camera);
        //         // this.effectParentTransform = new gd3d.framework.transform();
        //         // this.scene.addChild(this.effectParentTransform);
        //         this.effectParentTransform.addChild(this.curEffectTrans);
        //         this.effectParentTransform.markDirty();
        //     }
        // });
    }
    private tileX: number = 0;
    private tileY: number = 0;
    private row: number = 4;
    private column: number = 4;
    private uvSpirteTime: number = 4;
    /**
     * 每秒16帧
     */
    private framerate: number = 4;
    private interframeSpace: number = 0;
    private UVPlay: boolean = true;

    update(delta: number)
    {
        this.taskmgr.move(delta);
        //this.cube.localTranslate = this.scene.pickCenter;
        //this.cube.markDirty();
        this.timer += delta;
        this.counttimer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);

        // if (this.cube != null) 
        // {//uv 滚动原理
        //     if (this.UVPlay)
        //     {

        //         let vec4 = new gd3d.math.vector4(1 / this.row, 1 / this.column, this.tileX, this.tileY);
        //         let renderer = this.cube.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        //         renderer.materials[0].setVector4("_MainTex_ST", vec4);//shader 里加入st参数

        //         this.tileY += 1 / this.column;
        //         if (this.tileY >= 1)
        //         {
        //             this.tileY = 0;
        //             this.tileX += 1 / this.row;
        //             if (this.tileX >= 1)
        //             {
        //                 this.tileX = 0;
        //             }
        //         }

        //     }
        //     this.interframeSpace += delta;
        //     if (this.interframeSpace < 1 / this.framerate)
        //     {
        //         this.UVPlay = false;
        //     }
        //     else
        //     {
        //         this.interframeSpace = 0;
        //         this.UVPlay = true;
        //     }

        // }

        // if (this.cube2 != null) {

        //     this.cube2.gameObject.transform.localTranslate = new gd3d.math.vector3(x2 *3, 0, -z2 * 3);
        //     this.cube2.gameObject.transform.markDirty();
        //     var vec4 = new gd3d.math.vector4(Math.sin(this.timer), Math.cos(this.timer), 0, 0);
        //     var renderer = this.cube2.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        //     renderer.materials[0].setVector4("_MainTex_STSpeed", vec4);//shader 里加入st参数
        // }
        if (this.camera != null)
        {
            // var objCam = this.camera.gameObject.transform;
            // objCam.updateWorldTran();
            // objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            // objCam.markDirty();
            // var objCam = this.camera.gameObject.transform;
            // objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
            // objCam.updateWorldTran();
            // objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            // objCam.markDirty();
        }

    }
}