class testReload implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    //资源放置位置
    resRoot  = `newRes/pfb/model/`;
    //关心的 部位
    careSubList = ["body","face","handL","handR","head","leg"];
    //模型名字
    r_a_Name = "fs";
    r_b_Name = "0001_shengyi_male";
    
    async start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
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


        let o2d = new gd3d.framework.overlay2D();
        this.camera.addOverLay(o2d);
        
        // await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`newRes/customShader/customShader.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`res/STXINGKA.TTF.png`, this.app.getAssetMgr());
        await demoTool.loadbySync(`res/resources/STXINGKA.font.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${this.resRoot}${this.r_a_Name}/${this.r_a_Name}.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${this.resRoot}${this.r_b_Name}/${this.r_b_Name}.assetbundle.json`, this.app.getAssetMgr());

        //布置模型
        let _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(`${this.r_a_Name}.prefab.json` , `${this.r_a_Name}.assetbundle.json`) as gd3d.framework.prefab;
        let r_a = _prefab.getCloneTrans();
        r_a.localScale = new gd3d.math.vector3(1, 1, 1);
        r_a.localTranslate = new gd3d.math.vector3(0, 0, 0);
        this.scene.addChild(r_a);

        _prefab = this.app.getAssetMgr().getAssetByName(`${this.r_b_Name}.prefab.json` , `${this.r_b_Name}.assetbundle.json`) as gd3d.framework.prefab;
        let r_b = _prefab.getCloneTrans();

        //获取 动画组件
        let _aniplayer = r_a.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
        _aniplayer.autoplay = true;

        //查找 共同的 部件
        // 布置按钮
        this.careSubList.forEach((v,i)=>{
            this.createChangeBtn(r_a, r_b, o2d, v);
        });
    }

    uileft: number = 0;
    createChangeBtn(role: gd3d.framework.transform, role1: gd3d.framework.transform, o2d: gd3d.framework.overlay2D, part: string)
    {
        //设置UI
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
        img9.sprite = this.app.getAssetMgr().getDefaultSprite("white_sprite");
        label.font = this.app.getAssetMgr().getAssetByName("STXINGKA.font.json") as gd3d.framework.font;//;
        this.uileft += 130;

        //事件简体
        let r_a_part: gd3d.framework.skinnedMeshRenderer;
        let r_b_part: gd3d.framework.skinnedMeshRenderer;
        let role_skinMeshRenders = role.gameObject.getComponentsInChildren("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer[];
        let role1_skinMeshRenders = role1.gameObject.getComponentsInChildren("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer[];

        btn.addListener(gd3d.event.UIEventEnum.PointerClick,() =>
        {
            r_a_part = null;
            r_b_part = null;
            for (var key in role_skinMeshRenders)
            {
                let name = role_skinMeshRenders[key].gameObject.getName() ;
                if (name.toLowerCase().indexOf(part.toLowerCase()) != -1)
                {
                    r_a_part = role_skinMeshRenders[key];
                    break;
                }
            }
            for (var key in role1_skinMeshRenders)
            {
                let name = role1_skinMeshRenders[key].gameObject.getName() ;
                if ( name.toLowerCase().indexOf(part.toLowerCase()) != -1)
                {
                    r_b_part = role1_skinMeshRenders[key];
                    break;
                }
            }

            if(!r_a_part || !r_b_part) {
                console.warn(`更换节点 ${part.toLowerCase()} 更换失败 ！ 检查一下 this.careSubList 中 是否包含  `);
                return;
            }

            this.excangeSub(r_a_part,r_b_part);
        },this);
    }

    excangeSub(r_a_part : gd3d.framework.skinnedMeshRenderer, r_b_part : gd3d.framework.skinnedMeshRenderer){
        //交换位置
        let role_part_parent = r_a_part.gameObject.transform.parent;
        r_b_part.gameObject.transform.parent.addChild(r_a_part.gameObject.transform);
        role_part_parent.addChild(r_b_part.gameObject.transform);
        let role_part_player =  r_a_part.player;
        r_a_part._player = r_b_part.player;
        r_b_part._player = role_part_player;
    }

    camera: gd3d.framework.camera;
    timer: number = 0;
    update(delta: number)
    {
     
    }
}