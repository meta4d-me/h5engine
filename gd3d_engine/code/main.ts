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
    app: gd3d.framework.application;
    state: IState;
    onStart(app: gd3d.framework.application)
    {

        console.log("i am here.");
        this.app = app;
        //this.addBtn("test_loadScene",()=>new dome.test_loadScene());
        //this.addBtn("f14effect",()=>new dome.db_test_f14eff());
        //this.addBtn("loadPrefab",()=>new dome.loadPrefab());
        
        
        // this.addBtn("test_01", () => new test_01());//最早是做加载测试。现在已经没价值了
        //this.addBtn("loadscene", () => new dome.test_loadScene());
        
        this.addBtn("test_ui", () => new t.test_ui());
        this.addBtn("test_load", () => new test_load());
        this.addBtn("test_loadprefab", () => new test_loadprefab());
        this.addBtn("test_loadScene", () => new test_loadScene());
        this.addBtn("test_loadMulBundle", () => new test_loadMulBundle());
        this.addBtn("test_pick", () => new test_pick());

        this.addBtn("test_anim", () => new test_anim());
        this.addBtn("test_multipleplayer_anim", () => new test_multipleplayer_anim());
        this.addBtn("test_reload(换装)", () => new testReload());
        this.addBtn("test_uvroll", () => new t.test_uvroll());

        this.addBtn("test_light1", () => new t.test_light1());
        this.addBtn("test_light_d1", () => new t.light_d1());

        //this.addBtn("test_changeshader", () => new t.test_changeshader());
        this.addBtn("test_normalmap", () => new t.Test_NormalMap());
        this.addBtn("test_assestmgr", () => new test_assestmgr());

        this.addBtn("test_posteffect", () => new t.test_posteffect());
        this.addBtn("test_streamlight", () => new test_streamlight());

        this.addBtn("test_trailRender", () => new t.test_trailrender());
        this.addBtn("test_rendertexture", () => new t.test_rendertexture());
        this.addBtn("test_sound", () => new t.test_sound());
        this.addBtn("test_cleardepth", () => new t.test_clearDepth0());
        this.addBtn("test_fakepbr", () => new test_fakepbr());
        this.addBtn("test_metalModel", () => new t.test_metal());
        this.addBtn("test_tank", () => new demo.TankGame());
        this.addBtn("test_long", () => new demo.DragonTest());

        //this.addBtn("test_lookAt", () => new t.TestRotate());
        this.addBtn("test_skillsystem", () => new t.test_skillsystem());
        //this.addBtn("test_integratedrender", () => new t.test_integratedrender());
        this.addBtn("test_blend", () => new t.test_blend());

        this.addBtn("TestRotate", () => new t.TestRotate());
        this.addBtn("testtrailrenderRecorde", () => new t.test_trailrenderrecorde());
        this.addBtn("effect", () => new test_effect());
        this.addBtn("pathasset", () => new t.test_pathAsset());
        this.addBtn("test_Asi_prefab", () => new test_loadAsiprefab());

        this.addBtn("test_tex_uv", () => new test_texuv());
        //this.addBtn("test_uimove", () => new test_uimove());

        this.addBtn("post_景深", () => new t.test_posteffect_cc());
        //this.addBtn("test_effecteditor", () => new test_effecteditor());
        this.addBtn("test_shadowmap", () => new test_ShadowMap());
        //this.addBtn("test_xinshouMask", () => new t.test_xinshouMask());
        this.addBtn("test_liChange", () => new testLiChangeMesh());

        //----------------------------------------------文档案例
        //this.addBtn("example_newScene",() =>new test_NewScene());
        this.addBtn("example_newObject",()=>new test_NewGameObject);
        this.addBtn("example_changeMesh",()=>new test_ChangeMesh());
        this.addBtn("example_changeMaterial",()=>new test_ChangeMaterial());
        this.addBtn("example_Sound",()=>new test_Sound());      
        this.addBtn("demo_ScreenSplit",()=>new demo_ScreenSplit());
        //----------------------------------------------文档案例

        //this.addBtn("test_liloadscene", () => new test_LiLoadScene());
        //this.addBtn("test_RangeScreen" ,()=>new test_RangeScreen());
        this.addBtn("test_四分�, () => new test_pick_4p());       
        this.addBtn("test_UI组件", () => new test_UI_Component());
        this.addBtn("test_帧动画_keyframeAni",()=>new test_heilongbo());
        this.addBtn("test_UI预设体加�, () => new test_uiPerfabLoad());
        this.addBtn("test_PBR 展示", () => new test_pbr());
        this.addBtn("test_PBR 场景", () => new test_pbr_scene());
        this.addBtn("导航网格", () => new test_navMesh());
        this.addBtn("rvo2_驾驶行为", () => new test_Rvo2());
        this.addBtn("导航RVO_防挤Demo", () => new demo_navigaionRVO());
        

        this.addBtn("test_loadprefabdds",() => new test_loadprefabdds());
        this.addBtn("test_ATC纹理",()=>new t.test_ATC());
        this.addBtn("test_LookRotation",() => new test_LookRotation());

        // this.addBtn("test_drawMesh",()=>new test_drawMesh());
        // this.addBtn("cj_zs",()=>new dome.testCJ());
        // this.addBtn("test_eff",()=>new dome.db_test_eff());
        //this.addBtn("tesrtss",()=>new dome.testCJ());

        //this.addBtn("test_f14",()=>new dome.db_test_f14eff());
    }
    
    private x: number = 0;
    private y: number = 100;
    private btns: HTMLButtonElement[] = [];
    private addBtn(text: string, act: () => IState)
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
    private clearBtn()
    {
        for (var i = 0; i < this.btns.length; i++)
        {
            this.app.container.removeChild(this.btns[i]);
        }
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
