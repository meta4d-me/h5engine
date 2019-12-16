/// <reference path="../lib/dat.gui.d.ts" />

namespace gd3d.math
{
    export interface color
    {
        "__class__"?: "gd3d.math.color"
    }

    export interface vector3
    {
        "__class__"?: "gd3d.math.vector3"
    }
}

/** 
 * 粒子系統示例
 */
class test_ParticleSystem implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;

    private _particles = ["ParticleSystem", "Fire", "Flames"];
    private _particle: gd3d.framework.transform;

    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, this.astMgr);
        await datGui.init();

        //
        this.setGUI();
        //
        this.init();
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'particleName', this._particles);
    }

    private get particleName()
    {
        return this._particleName;
    }
    private set particleName(v)
    {
        this._showParticle(v);
        this._particleName = v;
    }
    private _particleName = "ParticleSystem";

    private init()
    {
        //相机-----------------------------------
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 1000;
        this.camera.fov = Math.PI * 2 / 3;
        this.camera.backgroundColor = new gd3d.math.color(0.2784, 0.2784, 0.2784, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 0, 0)

        this._showParticle(this._particles[0]);
        // this.initParticleSystem();
    }

    private async _showParticle(res: string)
    {
        if (this._particle)
        {
            this.scene.removeChild(this._particle);
            this._particle = null;
        }

        await demoTool.loadbySync(`res/prefabs/${res}/${res}.assetbundle.json`, this.astMgr);

        let cubeP = this.astMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as gd3d.framework.prefab;
        let cubeTran = this._particle = cubeP.getCloneTrans();

        this.scene.addChild(cubeTran);

        let ps = cubeTran.gameObject.getComponent("ParticleSystem") as gd3d.framework.ParticleSystem;
        if (ps)
        {
            ps.play();
        }

    }

    private initParticleSystem()
    {
        let tran = new gd3d.framework.transform();
        tran.name = "ParticleSystem";
        gd3d.math.quatFromAxisAngle(new gd3d.math.vector3(1, 0, 0), -90, tran.localRotate);
        tran.localRotate = tran.localRotate;
        // tran.localPosition = new gd3d.math.vector3(-7.2, 0.29, 2.826);
        this.scene.addChild(tran);

        // 新建粒子材质
        var mat = new gd3d.framework.material("defparticle1");
        var shader = test_ParticleSystem_particles_additive_drawInstanced.initShader(this.astMgr, this.astMgr.shaderPool);
        // var shader = test_ParticleSystem_particles_additive.initShader(this.astMgr, this.astMgr.shaderPool);
        mat.setShader(shader);

        var tex = this.astMgr.getDefaultTexture(gd3d.framework.defTexture.particle);
        mat.setTexture("_MainTex", tex);
        //
        let ps = tran.gameObject.getComponent("particlesystem") as gd3d.framework.ParticleSystem;
        if (!ps) ps = tran.gameObject.addComponent("particlesystem") as any;
        //
        ps.material = mat;

        gd3d.framework.serialization.setValue(ps, pd);

        //
        ps.play();
    }

    update(delta: number)
    {

    }
}