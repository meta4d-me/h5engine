/// <reference path="../lib/gd3d.d.ts" />
/// <reference path="../lib_launcher/htmlui.d.ts" />
/// <reference path="../lib_launcher/localsave.d.ts" />

@gd3d.reflect.userCode
class effecteditor implements gd3d.framework.IUserCode
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    private UIBoard: gd3d.framework.transform;
    parts: gd3d.framework.transform;
    timer: number = 0;
    cube2: gd3d.framework.transform;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    count: number = 0;
    counttimer: number = 0;
    basePath: string;
    resPath: string;
    constructor(_basePath: string = "proj_sample/scene_test/", _resPath: string = "res/particleEffect/")
    {
        this.basePath = _basePath;
        this.resPath = _resPath
    }
    private particleUrl: string;
    /** 当前正交相机与透视相机的标记值 */
    private currentOpValue: number;
    private fileList: string[] = [];
    private role = new gd3d.framework.transform();
    private effectListBoxs: lighttool.htmlui.listBox;
    private functionArea: HTMLDivElement;
    private currentEffectNameList: { [name: string]: gd3d.framework.transform } = {};
    private currentEffectName: string;
    private effectParentTransform: gd3d.framework.transform = new gd3d.framework.transform();
    private curEffectTrans: gd3d.framework.transform = new gd3d.framework.transform();

    frameWidth: number = 100;
    frameHeight: number = 100;
    scale: number = 5;
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

    private loadText(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/background.png", gd3d.framework.AssetTypeEnum.Auto, (s) => 
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
                this.role.localTranslate = new gd3d.math.vector3(0, 0, 0);
                this.role.gameObject.visible = false;
            }
        });
    }


    private loadEffect(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
    {
        ///初始化一个特效
        this.effectParentTransform.name = "effect";
        this.scene.addChild(this.effectParentTransform);
        //this._loadEffect("res/particleEffect/billboard/billboard.effect.json", "billboard.effect.json");

        ///显示编辑器div
        let drawArea: HTMLDivElement = document.getElementById("drawarea") as HTMLDivElement;
        drawArea.style.height = "80%";
        let effectListArea: HTMLDivElement = document.getElementById("effectlist") as HTMLDivElement;
        effectListArea.hidden = false;
        this.functionArea = document.getElementById("effectmgr") as HTMLDivElement;
        this.functionArea.hidden = false;

        let effectCatalog: HTMLDivElement = document.getElementById("catalog") as HTMLDivElement;
        lighttool.htmlui.panelMgr.instance().init(document.getElementById("catalog") as HTMLDivElement);

        let textPanel = lighttool.htmlui.panelMgr.instance().createPanel("");
        this.effectListBoxs = new lighttool.htmlui.listBox(textPanel);
        this.effectListBoxs.txtArea.style.backgroundColor = "lightslategray";

        var list = localsave.list(this.basePath + this.resPath);
        for (var i in list["subpath"])
        {
            var strpath = list["subpath"][i].name;
            this.fileList.push(strpath);
            this.effectListBoxs.addLine(strpath);
        }

        for (let i = 0; i < effectCatalog.children.length; i++) 
        {
            if (effectCatalog.children[i] instanceof HTMLImageElement) 
            {
                effectCatalog.removeChild(effectCatalog.children[i]);
            }
        }
        let dialog = effectCatalog.querySelector(".dialog") as HTMLDivElement;
        dialog.style.boxShadow = "";

        //this.addEffectToPlayList("billboard");

        ///选择播放特效
        this.effectListBoxs.onSelectItem = (name: string) =>
        {
            if (this.currentEffectName != name)
            {
                this.addEffectToPlayList(name);
                this._loadEffect(this.resPath + name + "/" + name + ".assetbundle.json", name + ".effect.json");
            }
        };

        this.setFunctionArea();

        state.finish = true;
    }
    private effect: gd3d.framework.effectSystem;
    private currentDiv: HTMLDivElement;
    private addEffectToPlayList(effectName: string)
    {
        this.currentEffectName = effectName;
        if (this.currentEffectNameList[effectName + ".effect.json"] != null) return;
        this.currentDiv = document.getElementById("currenteffect") as HTMLDivElement;
        var btn = document.createElement("button");
        btn.textContent = effectName;
        this.currentDiv.appendChild(btn);
        btn.onclick = () =>
        {
            this.currentDiv.removeChild(btn);
            if (this.currentEffectName == effectName)
            {
                this.currentEffectName = null;
            }
            this.effectParentTransform.removeChild(this.currentEffectNameList[effectName + ".effect.json"]);
            this.currentEffectNameList[effectName + ".effect.json"] = null;
        }
    }

    ///可以累计播放

    private isTrail: boolean = false;
    private _loadEffect(fullName: string, name: string)
    {
        this.particleUrl = fullName;
        if (fullName.indexOf("trail") >= 0)
        {
            this.isTrail = true;
        }
        else
        {
            this.isTrail = false;
            this.timer = 0;
        }

        this.app.getAssetMgr().load(fullName, gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                let tr = new gd3d.framework.transform();
                this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName(name) as gd3d.framework.textasset;
                this.effect.setEffect(text.content);
                // this.scene.addChild(tr);
                this.effectParentTransform.addChild(tr);
                tr.markDirty();
                this.effectParentTransform.markDirty();
            }
        }
        );
    }

    private setFunctionArea()
    {
        /**播放多个粒子 */
        let particleNum = document.getElementById("particlenum") as HTMLInputElement;
        particleNum.hidden = true;
        let btn_load = document.getElementById("load") as HTMLButtonElement;
        btn_load.hidden = true;
        btn_load.onclick = () =>
        {
            let number = Number(particleNum.value);
            let index = this.particleUrl.lastIndexOf("/");
            let lastEffectUrl = this.particleUrl.substr(index + 1);
            ///加载的时间往里面加东西
            this.effectParentTransform = new gd3d.framework.transform();
            for (let i = 0; i < number; i++)
            {
                this._loadEffect(this.particleUrl, this.currentEffectName + ".effect.json");
            }
        }

        ///播放按钮
        let btn_play = document.getElementById("play") as HTMLButtonElement;
        // btn_play.hidden = true;

        btn_play.onclick = () =>
        {
            console.log("currentEffectName: " + this.currentEffectName);
            if (this.effect != null)
            {
                // this.effect.dispose();
                this.effect.gameObject.transform.dispose();
            }
            this._loadEffect(this.resPath + this.currentEffectName + "/" + this.currentEffectName + ".assetbundle.json", this.currentEffectName + ".effect.json");
        }

        /// 清除按钮
        let btn_clear = document.getElementById("clear") as HTMLButtonElement;
        btn_clear.onclick = () =>
        {
            ///移除所有特效
            if (this.effectParentTransform)
            {
                if (this.effectParentTransform.children)
                {
                    for (let i = this.effectParentTransform.children.length - 1; i >= 0; i--) 
                    {
                        this.effectParentTransform.children[i].dispose();
                    }
                    this.effectParentTransform.children.length = 0;
                }
            }

            ///移除button
            if (this.currentDiv)
            {
                if (this.currentDiv.children)
                {
                    for (let c = this.currentDiv.children.length - 1; c >= 0; c--) 
                    {
                        if (this.currentDiv.children[c] instanceof HTMLButtonElement) 
                        {
                            this.currentDiv.removeChild(this.currentDiv.children[c]);
                        }
                    }
                }
            }

            for (let k in this.currentEffectNameList)
            {
                delete this.currentEffectNameList[k];
            }

            this.currentEffectNameList = {};
        }

        ///切换相机按钮
        let btn_switchCamera = document.getElementById("camera") as HTMLButtonElement;
        btn_switchCamera.onclick = () =>
        {
            if (this.camera.opvalue != 0)
            {
                btn_switchCamera.textContent = "切换至3D相机";
                this.currentOpValue = this.camera.opvalue;
                this.sceneFrame.gameObject.visible = false;
            } else
            {

                btn_switchCamera.textContent = "切换至2D相机";
                this.sceneFrame.gameObject.visible = true;
            }
            this.camera.opvalue = (this.camera.opvalue != 0) ? 0 : this.currentOpValue;
        }

        ///UI参考面板控制按钮
        let btn_showUI = document.getElementById("showui") as HTMLButtonElement;
        btn_showUI.onclick = () =>
        {
            this.UIBoard.gameObject.visible = !this.UIBoard.gameObject.visible;
            if (this.UIBoard.gameObject.visible)
            {
                btn_showUI.textContent = "不显示UI面板";
            } else
            {
                btn_showUI.textContent = "显示UI面板";
            }
        }

        ///角色控制按钮
        let btn_showRole = document.getElementById("showrole") as HTMLButtonElement;
        btn_showRole.onclick = () =>
        {
            this.role.gameObject.visible = !this.role.gameObject.visible;
            if (this.role.gameObject.visible)
            {
                btn_showRole.textContent = "不显示参考角色";
            } else
            {
                btn_showRole.textContent = "显示参考角色";
            }
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
        this.camera.far = 100;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.2, 0.2, 0.2, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 3, -8);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        //.instance().init(this.app, this.sceneEditorCamera);
        CameraController.instance().init(this.app, this.camera);
        this.sceneFrame = this.initSceneFrame();
        state.finish = true;

    }
    /**
     * 加载UI测试面板
     * @param laststate
     * @param state
     */
    private loadUIBoard(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        {
            let plane = new gd3d.framework.transform();
            plane.name = "cube";
            plane.localScale.x = 1;
            plane.localScale.y = 2;
            plane.localScale.z = 1;
            plane.localTranslate.x = 0;
            this.scene.addChild(plane);
            var mesh = plane.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

            var smesh = this.app.getAssetMgr().getDefaultMesh("plane");
            mesh.mesh = (smesh);
            var renderer = plane.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            let cuber = renderer;

            var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
            if (sh != null)
            {
                cuber.materials = [];
                cuber.materials.push(new gd3d.framework.material());
                cuber.materials[0].setShader(sh);
                let texture = this.app.getAssetMgr().getAssetByName("background.png") as gd3d.framework.texture;
                cuber.materials[0].setTexture("_MainTex", texture);

            }
            this.UIBoard = plane;
            this.UIBoard.gameObject.visible = false;
        }
        state.finish = true;
    }
    private addcube(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
    {
        //添加一个盒子
        {
            //X
            {
                let cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localTranslate.x = 2.5;
                cube.localScale.x = 1;
                cube.localScale.y = 0.05;
                cube.localScale.z = 0.05;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("materialcolor.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    cuber.materials[0].setVector4("_Color", new gd3d.math.vector4(1, 0, 0, 0.5));
                }
            }

            //Y
            {
                let cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localTranslate.y = 0.5;
                cube.localTranslate.x = 2;
                cube.localScale.y = 1;
                cube.localScale.x = 0.05;
                cube.localScale.z = 0.05;

                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("materialcolor.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    cuber.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 1, 0, 0.5));
                }
            }

            //Z
            {
                let cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localTranslate.z = 0.5;
                cube.localTranslate.x = 2;

                cube.localScale.z = 1;
                cube.localScale.x = 0.05;
                cube.localScale.y = 0.05;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("materialcolor.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    cuber.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 0, 1, 0.5));
                }
            }
        }
        state.finish = true;
    }
    sceneFrame: gd3d.framework.transform;
    onStart(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        //添加线框

        this.scene.addChild(this.effectParentTransform);
        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcube.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));
        this.taskmgr.addTaskCall(this.loadRole.bind(this));
        this.taskmgr.addTaskCall(this.loadUIBoard.bind(this));

    }

    private initSceneFrame(): gd3d.framework.transform
    {
        var _mesh: gd3d.framework.mesh = new gd3d.framework.mesh();
        var data = new gd3d.render.meshData();
        _mesh.data = data;
        data.pos = [];
        data.trisindex = [];
        data.color = [];
        //构建pos
        for (let i = 0; i <= this.frameWidth; i++)
        {
            for (let j = 0; j <= this.frameHeight; j++)
            {
                data.pos.push(new gd3d.math.vector3((i - this.frameWidth / 2) * this.scale, 0, (j - this.frameHeight / 2) * this.scale));
            }
        }
        //构建color
        for (let i = 0; i < data.pos.length; i++)
        {
            data.color.push(new gd3d.math.color(0.2, 0.2, 0.2, 0.5));
        }

        //构建索引X
        //构建竖线
        for (let i = 0; i <= this.frameWidth; i++)
        {
            data.trisindex.push(i);
            data.trisindex.push(i + this.frameHeight * (this.frameWidth + 1));
        }
        //构建横线
        for (let i = 0; i <= this.frameHeight; i++)
        {
            data.trisindex.push(i * (this.frameWidth + 1));
            data.trisindex.push(i * (this.frameWidth + 1) + this.frameWidth);
        }

        //设定顶点格式
        var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color;
        //根据顶点格式生成VBO
        var vbo32 = _mesh.data.genVertexDataArray(vf);
        //生成IBO
        var ibo16 = new Uint16Array(data.trisindex);

        var webgl = this.scene.webgl;
        _mesh.glMesh = new gd3d.render.glMesh();
        _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexSubData(webgl, vbo32);
        _mesh.glMesh.addIndex(webgl, ibo16.length);
        _mesh.glMesh.uploadIndexSubData(webgl, 0, ibo16);

        _mesh.submesh = [];
        {
            var sm = new gd3d.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = 0;
            sm.start = 0;
            sm.size = ibo16.length;
            sm.line = true;
            _mesh.submesh.push(sm);
        }

        let trans = new gd3d.framework.transform();
        trans.name = "______EditorFrame";
        trans.gameObject.hideFlags = gd3d.framework.HideFlags.HideAndDontSave;
        let filter = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER) as gd3d.framework.meshFilter;
        filter.mesh = (_mesh);
        let render = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER) as gd3d.framework.meshRenderer;
        let material = new gd3d.framework.material();
        render.materials = [];
        render.materials.push(material);
        render.materials[0].setShader(this.app.getAssetMgr().getShader("line.shader.json"));
        render.renderLayer = gd3d.framework.CullingMask.default;
        this.scene.addChild(trans);

        CameraController.instance().lookat(trans);
        trans.markDirty();
        return trans;
    }


    onUpdate(delta: number)
    {
        this.taskmgr.move(delta);

        this.counttimer += delta;
        // var x = Math.sin(this.timer)*2.5;
        // var z = Math.cos(this.timer)*2.5;
        // var x2 = Math.sin(this.timer * 0.5);
        // var z2 = Math.cos(this.timer * 0.5);

        if (this.isTrail && this.curEffectTrans)
        {
            this.timer += delta;
            this.curEffectTrans.localTranslate.x = this.timer - 5;
            //    this.curEffectTrans.localTranslate.y = z;
            this.curEffectTrans.markDirty();
        }

        //if (this.camera != null)
        //{
        //     var objCam = this.camera.gameObject.transform;
        //     objCam.updateWorldTran();
        //     objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //     objCam.markDirty();
        //     var objCam = this.camera.gameObject.transform;
        //     objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
        //     objCam.updateWorldTran();
        //     objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //     objCam.markDirty();
        //}

        if (CameraController.instance().isInit)
        {
            CameraController.instance().update(delta);
        }

        var asset = this.app.getAssetMgr();
        var yin = asset.getAssetsRefcount();
    }
    isClosed()
    {
        return false;
    }
}