/// <reference path="../lib/gd3d.d.ts" />

interface IState
{
    start(app: gd3d.framework.application);
    update(delta: number);
}
//需加上这个反射标记，引擎才能通过名字找到这个类，并自动创建他
@gd3d.reflect.userCode
class main implements gd3d.framework.IUserCode
{
    static instance: main;
    app: gd3d.framework.application;
    state: IState;
    onStart(app: gd3d.framework.application)
    {
        if (!main.instance) main.instance = this;
        console.log("i am here.");
        this.app = app;

        //关闭 guid 依赖
        gd3d.framework.assetMgr.openGuid = false;

        //-------------------------------------基础
        this.addBtn("基础==>",()=>{
            demoList.addBtn("最小demo",()=>new mini_sample());
            demoList.addBtn("f14effect",()=>new dome.db_test_f14eff());
            demoList.addBtn("物理2d_dome",()=>new physic2d_dome());
            demoList.addBtn("test_load", () => new test_load());
            demoList.addBtn("test_loadScene", () => new test_loadScene());
            demoList.addBtn("test_pick", () => new test_pick());
            demoList.addBtn("test_anim", () => new test_anim());
            demoList.addBtn("test_sound", () => new t.test_sound());
            demoList.addBtn("射线检测", () => new test_pick_boxcollider());
            demoList.addBtn("关键帧动画", () => new test_keyFrameAni());
            demoList.addBtn("粒子系統", () => new test_ParticleSystem());
            demoList.addBtn("线条", () => new test_LineRenderer());
            demoList.addBtn("拖尾", () => new test_TrailRenderer());
            demoList.addBtn("Android平台ETC1压缩纹理", () => new test_ETC1_KTX());
            return new demoList();
        });

        //-------------------------------------渲染
        this.addBtn("渲染==>", () =>
        {
            demoList.addBtn("test_posteffect(后期效果)", () => new t.test_posteffect());
            demoList.addBtn("test_blend", () => new t.test_blend());
            demoList.addBtn("test_shadowmap", () => new test_ShadowMap());
            demoList.addBtn("test_tex_uv", () => new test_texuv());
            demoList.addBtn("test_PBR 展示", () => new test_pbr());
            demoList.addBtn("test_PBR 场景", () => new test_pbr_scene());
            demoList.addBtn("SSSSS", () => new test_sssss());
            demoList.addBtn("test_trailRender", () => new t.test_trailrender());
            demoList.addBtn("test_light1", () => new t.test_light1());
            demoList.addBtn("test_light_d1", () => new t.light_d1());
            demoList.addBtn("test_normalmap", () => new t.Test_NormalMap());
            demoList.addBtn("test_f4skin", () => new test_f4skin());
            demoList.addBtn("GPU_Instancing 绘制",()=>new test_GPU_instancing());
            return new demoList();
        });

        //----------------------------------------------UI
        this.addBtn("UI样例==>", () =>
        {
            demoList.addBtn("test_ui", () => new t.test_ui());
            demoList.addBtn("test_UI组件", () => new test_UI_Component());
            demoList.addBtn("test_UI预设体加载", () => new test_uiPerfabLoad());
            demoList.addBtn("UI 新手引导mask", () => new test_UIGuideMask());
            return new demoList();
        });

        //-------------------------------------------物理
        this.addBtn("3D物理样例==>", () =>
        {
            demoList.addBtn("3D物理_基础形状", () => new test_3DPhysics_baseShape());
            demoList.addBtn("3D物理_复合组合", () => new test_3DPhysics_compound());
            demoList.addBtn("3D物理_动力学", () => new test_3DPhysics_kinematic());
            demoList.addBtn("3D物理_铰链关节", () => new test_3DPhysics_joint_hinge());
            demoList.addBtn("3D物理_球嵌套关节", () => new test_3DPhysics_joint_ballandSocket());
            demoList.addBtn("3D物理_滑竿关节", () => new test_3DPhysics_joint_slider());
            demoList.addBtn("3D物理_棱柱滑竿关节", () => new test_3DPhysics_joint_prismatic());
            demoList.addBtn("3D物理_距离关节", () => new test_3DPhysics_joint_distance());
            demoList.addBtn("3D物理_车轮关节", () => new test_3DPhysics_joint_wheel());
            demoList.addBtn("3D物理_铰链马达", () => new test_3DPhysics_motor_hinge());
            demoList.addBtn("3D物理_车轮马达", () => new test_3DPhysics_motor_wheel());
            demoList.addBtn("3D物理_滑竿马达", () => new test_3DPhysics_motor_slider());
            demoList.addBtn("3D物理_冻结_位移旋转", () => new test_3DPhysics_freeze());
            demoList.addBtn("3D物理_样例_中心点爆炸", () => new test_3DPhysics_explode());
            demoList.addBtn("cannonPhysics3D", () => new PhysicDemo.physic_01());
            return new demoList();
        });

        //-------------------------------------其他
        this.addBtn("其他==>", () =>
        {
            demoList.addBtn("test_multipleplayer_anim", () => new test_multipleplayer_anim());
            demoList.addBtn("test_reload(换装)", () => new testReload());
            demoList.addBtn("mixmesh", () => new dome.mixMesh());
            demoList.addBtn("test_assestmgr", () => new test_assestmgr());
            demoList.addBtn("test_streamlight", () => new test_streamlight());
            demoList.addBtn("test_rendertexture", () => new t.test_rendertexture());
            demoList.addBtn("test_cleardepth", () => new t.test_clearDepth0());
            demoList.addBtn("test_fakepbr", () => new test_fakepbr());
            demoList.addBtn("test_skillsystem", () => new t.test_skillsystem());
            demoList.addBtn("TestRotate", () => new t.TestRotate());
            demoList.addBtn("pathasset", () => new t.test_pathAsset());
            demoList.addBtn("test_Asi_prefab", () => new test_loadAsiprefab());
            demoList.addBtn("test_liChange", () => new testLiChangeMesh());
            demoList.addBtn("example_newObject", () => new test_NewGameObject);
            demoList.addBtn("example_changeMesh", () => new test_ChangeMesh());
            demoList.addBtn("example_changeMaterial", () => new test_ChangeMaterial());
            demoList.addBtn("demo_ScreenSplit", () => new demo_ScreenSplit());  //屏幕拆分
            demoList.addBtn("导航网格", () => new test_navMesh());
            demoList.addBtn("rvo2_驾驶行为", () => new test_Rvo2());
            demoList.addBtn("导航RVO_防挤Demo", () => new demo_navigaionRVO());
            demoList.addBtn("dome_加载播放动画", () => new dome_loadaniplayer());
            demoList.addBtn("使用加载资源的Demo列表", () => new UseAssetByLoadDemoList());
            demoList.addBtn("tesrtss", () => new dome.testCJ());
            demoList.addBtn("表面贴花(弹痕)", () => new test_Decal());
            demoList.addBtn("test_01", () => new test_01());  //屏幕拆分
            return new demoList();
        });

        //-------------------------------------炮王项目
        this.addBtn("项目Demo==>", () =>
        {
            demoList.addBtn("paowuxian2", () => new dome.paowuxian2());
            demoList.addBtn("paowuxian", () => new dome.paowuxian());
            demoList.addBtn("test_tank", () => new demo.TankGame());
            demoList.addBtn("test_long", () => new demo.DragonTest());
            return new demoList();
        });




        //others 历史遗留
        //this.addBtn("trans性能测试",()=>new demo.test_performance());
        // this.addBtn("testtrailrenderRecorde", () => new t.test_trailrenderrecorde()); //有问题
        // this.addBtn("LoadBase64Tex", () => new dome.LoadTex());
        // this.addBtn("rayTest",()=>new dome.rayTest());
        //this.addBtn("linPai",()=>new dome.font());
        //this.addBtn("newobjFromAni",()=>new dome.newObjFromAni());
        //this.addBtn("test_loadprefab", () => new test_loadprefab());
        // this.addBtn("loadPrefab",()=>new dome.loadPrefab());
        //this.addBtn("test_loadMulBundle", () => new test_loadMulBundle());
        //this.addBtn("test_loadScene",()=>new dome.test_loadScene());
        //this.addBtn("starcam",()=>new dome.db_test_starcam());
        //this.addBtn("trailComponent",()=>new dome.db_test_trail());
        //this.addBtn("loadPrefab",()=>new dome.loadPrefab());
        // this.addBtn("test_01", () => new test_01());//最早是做加载测试。现在已经没价值了
        //this.addBtn("loadscene", () => new dome.test_loadScene());
        //this.addBtn("test_changeshader", () => new t.test_changeshader());
        // this.addBtn("test_metalModel", () => new t.test_metal());
        //this.addBtn("test_lookAt", () => new t.TestRotate());
        //this.addBtn("test_integratedrender", () => new t.test_integratedrender());
        //this.addBtn("effect", () => new test_effect());
        //this.addBtn("test_uimove", () => new test_uimove());
        //this.addBtn("test_effecteditor", () => new test_effecteditor());
        //this.addBtn("test_xinshouMask", () => new t.test_xinshouMask());
        //this.addBtn("example_newScene",() =>new test_NewScene());
        // this.addBtn("example_Sound",()=>new test_Sound());
        //this.addBtn("test_四分屏", () => new test_pick_4p());
        //this.addBtn("test_liloadscene", () => new test_LiLoadScene());
        //this.addBtn("test_RangeScreen" ,()=>new test_RangeScreen());
        // this.addBtn("test_drawMesh",()=>new test_drawMesh());
        // this.addBtn("cj_zs",()=>new dome.testCJ());
        // this.addBtn("test_eff",()=>new dome.db_test_eff());
        //this.addBtn("test_f14",()=>new dome.db_test_f14eff());
    }

    private def_x = 0;
    private def_y = 100;
    private x: number = this.def_x;
    private y: number = this.def_y;
    private btns: HTMLButtonElement[] = [];
    addBtn(text: string, act: () => IState)
    {
        var btn = document.createElement("button");
        this.btns.push(btn);
        btn.textContent = text;
        btn.onclick = () =>
        {
            this.clearBtn();
            this.state = act();
            this.state.start(this.app);
        }
        btn.style.top = this.y + "px";
        btn.style.left = this.x + "px";
        if (this.y + 24 > 550)
        {
            this.y = 100;
            this.x += 200;
        }
        else
        {
            this.y += 24;
        }
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);

    }
    clearBtn()
    {
        for (var i = 0; i < this.btns.length; i++)
        {
            this.app.container.removeChild(this.btns[i]);
        }
        this.x = this.def_x;
        this.y = this.def_y;
        this.btns.length = 0;
    }

    onUpdate(delta: number)
    {
        if (this.state != null)
            this.state.update(delta);
    }
    isClosed(): boolean
    {
        return false;
    }
}
