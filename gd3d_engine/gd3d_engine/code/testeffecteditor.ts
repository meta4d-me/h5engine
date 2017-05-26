class effectshowMgr
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
    counttimer: number = 0;


    effectparent:gd3d.framework.transform;
    // basePath: string;
    // resPath: string;
    constructor(app: gd3d.framework.application)
    {
        this.onStart(app);
    }
    private particleUrl: string;
    /** 当前正交相机与透视相机的标记值 */
    private currentOpValue: number;
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
    private effect: gd3d.framework.effectSystem;
    private currentDiv: HTMLDivElement;
    ///可以累计播放
    loadeffect(fullName: string,name:string)
    {
        this.app.getAssetMgr().load(fullName, gd3d.framework.AssetTypeEnum.Auto, (_state) =>
        {
            if (_state.isfinish)
            {
                let tr = new gd3d.framework.transform();
                this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName(name) as gd3d.framework.textasset;
                this.effect.setEffect(text.content);
                this.effectparent.removeAllChild();
                this.effectparent.addChild(tr);
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
        this.camera.far = 100;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.2, 0.2, 0.2, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 3, -8);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        CameraController.instance().init(this.app, this.camera);
        this.sceneFrame = this.initSceneFrame();
        state.finish = true;

    }
    sceneFrame: gd3d.framework.transform;
    onStart(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.effectparent=new gd3d.framework.transform();
        this.scene.addChild(this.effectparent);
        //添加线框
        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcube.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        //this.taskmgr.addTaskCall(this.loadEffect.bind(this));
        //this.taskmgr.addTaskCall(this.loadRole.bind(this));
        //this.taskmgr.addTaskCall(this.loadUIBoard.bind(this));

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

        // if (this.isTrail && this.curEffectTrans)
        // {
        //     // this.timer += delta;
        //     // this.curEffectTrans.localTranslate.x = this.timer - 5;
        //     // //    this.curEffectTrans.localTranslate.y = z;
        //     // this.curEffectTrans.markDirty();
        // }

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