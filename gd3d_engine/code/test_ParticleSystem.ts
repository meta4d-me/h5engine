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

    private _particles = ["ps_inheritVelocity", "ParticleSystem", "aaaaa", "Fire", "Flames", "shark-levelup"];
    private _particle: gd3d.framework.transform;

    private _isMove = false;
    private _particleStartPosition = new gd3d.math.vector3();
    private _particleCurrentPosition = new gd3d.math.vector3();
    private _moveRadius = 5;
    private _moveAngle = 0;
    private _moveAngleSpeed = 1;

    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        gd3d.framework.assetMgr.openGuid = false;

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
        gui.add(this, '_isMove');
        gui.add(this, '_moveRadius', 1, 50, 1);
        gui.add(this, '_moveAngleSpeed', -10, 10, 0.2);
        gui.add(this, 'play');
        gui.add(this, 'stop');
    }

    play()
    {
        this._particle.gameObject.getComponentsInChildren("ParticleSystem").forEach(v =>
        {
            var ps: gd3d.framework.ParticleSystem = <any>v;
            ps.play();
        })
    }

    stop()
    {
        this._particle.gameObject.getComponentsInChildren("ParticleSystem").forEach(v =>
        {
            var ps: gd3d.framework.ParticleSystem = <any>v;
            ps.stop();
        })
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
    private _particleName: string = "ps_inheritVelocity";

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

        this._particleStartPosition = new gd3d.math.vector3();
        gd3d.math.vec3Clone(this._particle.localPosition, this._particleStartPosition);
    }

    update(delta: number)
    {
        if (!this._particle) return;

        if (this._isMove)
        {
            var offsetX = Math.cos(this._moveAngle / 180 * Math.PI) * this._moveRadius;
            var offsetZ = Math.sin(this._moveAngle / 180 * Math.PI) * this._moveRadius;

            // this._particleCurrentPosition.x = this._particleStartPosition.x + offsetX;
            this._particleCurrentPosition.y = this._particleStartPosition.y;
            this._particleCurrentPosition.z = this._particleStartPosition.z + offsetZ;

            this._particle.localPosition = this._particleCurrentPosition;

            this._moveAngle += this._moveAngleSpeed;
        } else
        {
            this._particle.localPosition = this._particleStartPosition;
        }
    }
}