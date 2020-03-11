class testReload implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    resRoot  = `newRes/pfb/model/`;
    async start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        var role;
        var role1;

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10000;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        //相机控制
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 0, 0);


        var o2d = new gd3d.framework.overlay2D();
        this.camera.addOverLay(o2d);
        
        // await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`newRes/customShader/customShader.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${this.resRoot}0001_shengyi_male/0001_shengyi_male.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${this.resRoot}fs/fs.assetbundle.json`, this.app.getAssetMgr());

        //布置模型
        var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName("fs.prefab.json" , `fs.assetbundle.json`) as gd3d.framework.prefab;
        role = _prefab.getCloneTrans();
        this.scene.addChild(role);
        var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName("0001_shengyi_male.prefab.json" , `0001_shengyi_male.assetbundle.json`) as gd3d.framework.prefab;
        role1 = _prefab.getCloneTrans();
        role.localScale = new gd3d.math.vector3(1, 1, 1);
        role.localTranslate = new gd3d.math.vector3(0, 0, 0);

        //获取 动画组件
        var _aniplayer = role.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
        _aniplayer.autoplay = true;

        //设置debug 按钮
        if (role != null)
        {
            this.createChangeBtn(role, role1, o2d, "body");
            this.createChangeBtn(role, role1, o2d, "handL");
            this.createChangeBtn(role, role1, o2d, "handR");
            this.createChangeBtn(role, role1, o2d, "head");
            this.createChangeBtn(role, role1, o2d, "leg");
        }

    }

    uileft: number = 0;
    createChangeBtn(role: gd3d.framework.transform, role1: gd3d.framework.transform, o2d: gd3d.framework.overlay2D, part: string)
    {
        let t2d_9 = new gd3d.framework.transform2D();
        t2d_9.width = 120;
        t2d_9.height = 30;
        t2d_9.pivot.x = 0;
        t2d_9.pivot.y = 0;
        t2d_9.localTranslate.x = this.uileft;
        t2d_9.localTranslate.y = 0;
        let btn = t2d_9.addComponent("button") as gd3d.framework.button;
        let img9 = t2d_9.addComponent("image2D") as gd3d.framework.image2D;
        img9.imageType = gd3d.framework.ImageType.Sliced;
        btn.targetImage = img9;
        btn.transition = gd3d.framework.TransitionType.ColorTint;//颜色变换

        let role_part: gd3d.framework.skinnedMeshRenderer;
        let role1_part: gd3d.framework.skinnedMeshRenderer;
        btn.addListener(gd3d.event.UIEventEnum.PointerClick,() =>
        {
            if (role_part == null)
            {
                let role_skinMeshRenders = role.gameObject.getComponentsInChildren("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer[];
                let role1_skinMeshRenders = role1.gameObject.getComponentsInChildren("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer[];

                for (var key in role_skinMeshRenders)
                {
                    if (role_skinMeshRenders[key].gameObject.getName().indexOf("_" + part) >= 0)
                    {
                        role_part = role_skinMeshRenders[key];
                    }
                }
                for (var key in role1_skinMeshRenders)
                {
                    if (role1_skinMeshRenders[key].gameObject.getName().indexOf("_" + part) >= 0)
                    {
                        role1_part = role1_skinMeshRenders[key];
                    }
                }
            }

            let role_part_parent = role_part.gameObject.transform.parent;
            role1_part.gameObject.transform.parent.addChild(role_part.gameObject.transform);
            role_part_parent.addChild(role1_part.gameObject.transform);

            let role_part_player =  role_part.player;
            role_part._player = role1_part.player;
            role1_part._player = role_part_player;

        },this);
        o2d.addChild(t2d_9);

        var lab = new gd3d.framework.transform2D();
        let opt = gd3d.framework.layoutOption;
        lab.layoutState = opt.H_CENTER | opt.V_CENTER;
        lab.name = "lab111";
        lab.width = 150;
        lab.height = 50;
        lab.markDirty();
        var label = lab.addComponent("label") as gd3d.framework.label;
        label.text = "换" + part;
        label.fontsize = 25;
        label.color = new gd3d.math.color(1, 0, 0, 1);
        // label.verticalOverflow = false;
        label.horizontalOverflow = false;
        t2d_9.addChild(lab);

        this.app.getAssetMgr().load("res/uisprite.png", gd3d.framework.AssetTypeEnum.Auto, (s) => 
        {
            if (s.isfinish) 
            {
                let texture = this.app.getAssetMgr().getAssetByName("uisprite.png") as gd3d.framework.texture;
                img9.sprite = this.app.getAssetMgr().getDefaultSprite("white_sprite");
            }
        });

        this.app.getAssetMgr().load("res/STXINGKA.TTF.png", gd3d.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                this.app.getAssetMgr().load("res/resources/STXINGKA.font.json", gd3d.framework.AssetTypeEnum.Auto, (s1) =>
                {
                    if(s1.isfinish)
                        label.font = this.app.getAssetMgr().getAssetByName("STXINGKA.font.json") as gd3d.framework.font;//;
                });
            }
        });
        this.uileft += 130;
    }

    camera: gd3d.framework.camera;
    timer: number = 0;
    update(delta: number)
    {
        // this.timer += delta;
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.1);
        // var z2 = Math.cos(this.timer * 0.1);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        // if (this.cube != null)
        // {
        //     objCam.lookat(this.cube);
        //     objCam.markDirty();//标记为需要刷新
        //     objCam.updateWorldTran();
        // }
    }
}