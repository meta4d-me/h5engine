/// <reference path="../lib/dat.gui.d.ts" />

/** 
 * 拖尾渲染组件示例
 */
class test_TrailRenderer implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;

    lr: gd3d.framework.TrailRenderer

    move = true;
    viewcamera = false;

    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        gd3d.framework.assetMgr.openGuid = false;

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
        gui.add(this, 'move');
        gui.add(this, 'viewcamera');
    }

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

        // this._showParticle(this._particles[0]);
        this.initLineRenderer();
    }

    private initLineRenderer()
    {
        let tran = new gd3d.framework.transform();
        tran.name = "TrailRenderer";
        this.scene.addChild(tran);

        //
        let lr = tran.gameObject.getComponent("TrailRenderer") as gd3d.framework.TrailRenderer;
        if (!lr) lr = tran.gameObject.addComponent("TrailRenderer") as any;
        //
        this.lr = lr;
    }

    private async _showParticle(res: string)
    {
    }

    private _particleStartPosition = new gd3d.math.vector3();
    private _particleCurrentPosition = new gd3d.math.vector3();
    private _moveRadius = 5;
    private _moveAngle = 0;
    private _moveAngleSpeed = 5;

    update(delta: number)
    {
        if (this.lr)
        {
            if (this.move)
            {
                var offsetX = Math.cos(this._moveAngle / 180 * Math.PI) * this._moveRadius;
                var offsetY = (this._moveAngle % 3600) / 3600 * this._moveRadius;
                var offsetZ = Math.sin(this._moveAngle / 180 * Math.PI) * this._moveRadius;

                this._particleCurrentPosition.x = this._particleStartPosition.x + offsetX;
                this._particleCurrentPosition.y = this._particleStartPosition.y + offsetY;
                this._particleCurrentPosition.z = this._particleStartPosition.z + offsetZ;

                this.lr.transform.localPosition = this._particleCurrentPosition;

                this._moveAngle += this._moveAngleSpeed;
            }
            this.lr.alignment = this.viewcamera ? gd3d.framework.LineAlignment.View : gd3d.framework.LineAlignment.TransformZ;
        }
    }
}